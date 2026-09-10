/**
 * Carga do módulo WebAssembly e chamada de cada estágio.
 *
 * # Por que `WebAssembly.instantiate` puro
 *
 * Nada de `wasm-bindgen`. O módulo é carregado com a API padrão do JavaScript, o
 * que significa que este arquivo roda **igual** no Node e no navegador, e que o
 * laboratório não depende de nenhuma ferramenta além do `cargo` para produzir o
 * artefato. O preço é fazer o marshalling à mão — as trinta linhas de
 * `escreverBytes` / `lerTexto` abaixo — e ele é barato.
 *
 * A única diferença entre ambientes é **de onde vêm os bytes** do `.wasm`: no
 * Node, do disco; no navegador, de um `fetch`. Por isso `carregarMotor` aceita os
 * bytes já lidos, e quem chama resolve a origem.
 *
 * # Um estágio por chamada
 *
 * `Instant` não existe em `wasm32-unknown-unknown`. Quem crona é este arquivo, e
 * para cronar por estágio cada estágio precisa ser uma travessia separada da
 * fronteira. A sessão do lado Rust guarda o grafo entre as chamadas.
 */
import type { PedidoMotor } from "./parametros.ts";

/** A resposta crua do motor, no vocabulário dele. */
export interface RespostaMotor {
  ok: boolean;
  erro?: string | null;
  /** `[x, z, cota]` em metros de mundo do motor. */
  nos: [number, number, number][];
  /** `[no_a, no_b, tipo]`, tipo 0 = contorno (principal), 1 = gradiente (local). */
  arestas: [number, number, number][];
  /** Perímetros de quadra, por índice em `nos`. */
  quadras: number[][];
  nos_totais: number;
  arestas_totais: number;
  arestas_ativas: number;
  estagios: string[];
  versao_motor: string;
}

interface Exportados {
  memory: WebAssembly.Memory;
  archilly_alloc(n: number): number;
  archilly_free(ptr: number, n: number): void;
  /** `alturasLen` é em BYTES: `nx * ny * 4`. Ver a doc de `archilly_abrir`. */
  archilly_abrir(
    pedidoPtr: number,
    pedidoLen: number,
    alturasPtr: number,
    alturasLen: number,
  ): number;
  archilly_fechar(id: number): void;
  archilly_gerar_vias(id: number): number;
  archilly_racionalizar(id: number): number;
  archilly_extrair_quadras(id: number): number;
  /** `nosLen` e `arestasLen` são em BYTES. */
  archilly_quadras_de_grafo_externo(
    id: number,
    nosPtr: number,
    nosLen: number,
    arestasPtr: number,
    arestasLen: number,
  ): number;
  archilly_contar_edificacoes(id: number): number;
  archilly_resultado(id: number): number;
}

/** Um bloco reservado na memória do módulo, que precisa ser devolvido. */
interface Bloco {
  ptr: number;
  len: number;
}

/** O motor carregado. Uma instância serve para muitas sessões. */
export class Motor {
  private readonly ex: Exportados;

  private constructor(ex: Exportados) {
    this.ex = ex;
  }

  /**
   * Instancia o módulo a partir dos bytes do `.wasm`.
   *
   * Sem imports: o módulo não precisa de nada do ambiente. Isso é o que permite
   * carregá-lo em Web Worker, em Node e em `deno` sem adaptação — e é
   * consequência de o motor não tocar arquivo, rede nem relógio.
   */
  static async carregar(bytes: BufferSource): Promise<Motor> {
    const { instance } = await WebAssembly.instantiate(bytes, {});
    const ex = instance.exports as unknown as Exportados;
    for (const nome of [
      "memory",
      "archilly_alloc",
      "archilly_free",
      "archilly_abrir",
      "archilly_resultado",
    ] as const) {
      if (!(nome in ex)) throw new Error(`o .wasm não exporta ${nome}`);
    }
    return new Motor(ex);
  }

  // ------------------------------------------------------------ marshalling

  /**
   * Lê um bloco `[u32 tamanho][UTF-8]` e devolve a memória.
   *
   * A `DataView` é recriada a cada leitura de propósito: `archilly_alloc` pode
   * fazer a memória do módulo crescer, e quando cresce o `ArrayBuffer` é
   * **trocado** — qualquer view guardada de antes aponta para memória morta. É
   * uma das duas ou três maneiras clássicas de errar nesta fronteira.
   */
  private lerTexto(ptr: number): string {
    if (ptr === 0) throw new Error("o motor devolveu ponteiro nulo");
    const tamanho = new DataView(this.ex.memory.buffer).getUint32(ptr, true);
    const bytes = new Uint8Array(this.ex.memory.buffer, ptr + 4, tamanho).slice();
    this.ex.archilly_free(ptr, 4 + tamanho);
    return new TextDecoder().decode(bytes);
  }

  private escreverBytes(dados: Uint8Array): Bloco {
    const ptr = this.ex.archilly_alloc(dados.byteLength);
    if (ptr === 0) throw new Error(`o motor não reservou ${dados.byteLength} bytes`);
    new Uint8Array(this.ex.memory.buffer, ptr, dados.byteLength).set(dados);
    return { ptr, len: dados.byteLength };
  }

  private escreverF32(dados: Float32Array): Bloco {
    return this.escreverBytes(
      new Uint8Array(dados.buffer, dados.byteOffset, dados.byteLength),
    );
  }

  private escreverU32(dados: Uint32Array): Bloco {
    return this.escreverBytes(
      new Uint8Array(dados.buffer, dados.byteOffset, dados.byteLength),
    );
  }

  private liberar(...blocos: Bloco[]): void {
    for (const b of blocos) this.ex.archilly_free(b.ptr, b.len);
  }

  // ------------------------------------------------------------------ sessão

  /**
   * Abre uma sessão com o mapa de alturas e a configuração do motor.
   *
   * Devolve um objeto `Sessao` que **tem de ser fechado** — a memória do mapa de
   * alturas fica viva dentro do módulo até então. Use `comSessao` para não
   * depender de disciplina.
   */
  abrir(pedido: PedidoMotor, alturas: Float32Array): Sessao {
    const p = this.escreverBytes(new TextEncoder().encode(JSON.stringify(pedido)));
    const a = this.escreverF32(alturas);
    try {
      const id = this.ex.archilly_abrir(p.ptr, p.len, a.ptr, a.len);
      if (id === 0) {
        throw new Error(
          "o motor recusou o pedido: confira nx, ny, célula e o tamanho do vetor de alturas",
        );
      }
      return new Sessao(this, this.ex, id);
    } finally {
      // O módulo copiou o que precisava; os blocos de entrada saem já.
      this.liberar(p, a);
    }
  }

  /** Abre, entrega à função e fecha, mesmo se ela lançar. */
  comSessao<T>(pedido: PedidoMotor, alturas: Float32Array, f: (s: Sessao) => T): T {
    const s = this.abrir(pedido, alturas);
    try {
      return f(s);
    } finally {
      s.fechar();
    }
  }

  /** @internal — usado por `Sessao`. */
  lerTextoInterno(ptr: number): string {
    return this.lerTexto(ptr);
  }

  /** @internal */
  escreverF32Interno(d: Float32Array): Bloco {
    return this.escreverF32(d);
  }

  /** @internal */
  escreverU32Interno(d: Uint32Array): Bloco {
    return this.escreverU32(d);
  }

  /** @internal */
  liberarInterno(...b: Bloco[]): void {
    this.liberar(...b);
  }
}

/** Uma sessão aberta: o mapa de alturas e o grafo vivos dentro do módulo. */
export class Sessao {
  private fechada = false;
  private readonly motor: Motor;
  private readonly ex: Exportados;
  private readonly id: number;

  constructor(motor: Motor, ex: Exportados, id: number) {
    this.motor = motor;
    this.ex = ex;
    this.id = id;
  }

  private conferir(codigo: number, estagio: string): void {
    if (codigo === 0) return;
    if (codigo === -1) throw new Error(`sessão ${this.id} não existe mais`);
    // -2 significa que o estágio falhou e a mensagem está na sessão; ela sai no
    // resultado, então aqui basta dizer qual estágio foi.
    throw new Error(`o estágio "${estagio}" falhou: ${this.resultado().erro ?? "sem detalhe"}`);
  }

  /** Estágio 1 — traça a rede viária. */
  gerarVias(): void {
    this.conferir(this.ex.archilly_gerar_vias(this.id), "vias");
  }

  /** Estágio 2 — racionaliza. É o caro: O(N²) na contagem de nós. */
  racionalizar(): void {
    this.conferir(this.ex.archilly_racionalizar(this.id), "racionalizacao");
  }

  /** Estágio 3 — extrai as quadras. */
  extrairQuadras(): void {
    this.conferir(this.ex.archilly_extrair_quadras(this.id), "quadras");
  }

  /**
   * Uso C puro: quadras a partir de eixos que o Archilly forneceu.
   *
   * O LAB-00 provou que isto funciona; aqui fica utilizável. `nos` é
   * `[x, z, cota, …]` no mundo do motor e `arestas` é `[a, b, tipo, …]`.
   */
  quadrasDeGrafoExterno(nos: Float32Array, arestas: Uint32Array): void {
    const n = this.motor.escreverF32Interno(nos);
    const a = this.motor.escreverU32Interno(arestas);
    try {
      this.conferir(
        this.ex.archilly_quadras_de_grafo_externo(this.id, n.ptr, n.len, a.ptr, a.len),
        "quadras-de-grafo-externo",
      );
    } finally {
      this.motor.liberarInterno(n, a);
    }
  }

  /**
   * Quantas pegadas de edificação o motor produziria.
   *
   * Fora da cadeia do LAB-01 — o LAB-00 estabeleceu que isso não é parcelamento.
   * Existe para o LAB-03 poder medir sem reabrir o `.wasm`.
   */
  contarEdificacoes(): number {
    return this.ex.archilly_contar_edificacoes(this.id);
  }

  /** O estado atual da sessão, já desserializado. */
  resultado(): RespostaMotor {
    return JSON.parse(this.motor.lerTextoInterno(this.ex.archilly_resultado(this.id)));
  }

  fechar(): void {
    if (this.fechada) return;
    this.fechada = true;
    this.ex.archilly_fechar(this.id);
  }
}
