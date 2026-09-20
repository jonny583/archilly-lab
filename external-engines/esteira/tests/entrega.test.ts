/**
 * A PROVA DA PEÇA QUE VAI PARA O GENERATE. (LAB-06)
 *
 * ```sh
 * bun test tests/entrega.test.ts
 * ```
 *
 * # O teste que dá nome ao prompt
 *
 * *"…e o teste de que apagar o Lab inteiro não quebra o Generate"*. Ele é o
 * primeiro `describe` abaixo, e é feito de dois jeitos, porque um só não bastava:
 *
 * - **por leitura**: nenhum arquivo de `entrega/` importa `external-engines/`,
 *   `@symbios`, `@testfit` ou a esteira. Isso se confere lendo os `import`, e é
 *   o que pega a dependência que alguém acrescenta sem perceber;
 * - **por execução**: o registro roda com um motor **de mentira**, escrito aqui
 *   dentro do teste, sem nada do Laboratório. Se a peça precisasse do Lab para
 *   funcionar, este teste não compilaria.
 *
 * # O resto
 *
 * As regras da D68 — todos ligados por padrão, padrão = o do Parcelamento,
 * escolha salva — e as três regras do ranking, com atenção à terceira: **nunca
 * um ranking vazio em silêncio**.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  montarRanking,
  PADRAO_DE_FABRICA,
  RegistroDeMotores,
  type CapacidadesDoMotor,
  type MotorNaPorta,
  type ResultadoDoMotor,
  type Veredito,
} from "../../../entrega/registro-de-motores/registro.ts";

const ENTREGA = join(import.meta.dirname, "..", "..", "..", "entrega");

/** Todos os arquivos de código de `entrega/`. */
function arquivosDaEntrega(dir = ENTREGA): string[] {
  const achados: string[] = [];
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) achados.push(...arquivosDaEntrega(p));
    else if (nome.endsWith(".ts")) achados.push(p);
  }
  return achados;
}

/**
 * Um motor de mentira, escrito aqui dentro.
 *
 * Ele não é um atalho: é o ponto. Se a peça precisasse de qualquer coisa do
 * Laboratório, não haveria como escrever este motor sem importar o Lab.
 */
function motorDeMentira(
  id: string,
  opcoes: {
    nome?: string;
    lotes?: number | null;
    recusa?: string;
    estoura?: boolean;
    geometria?: string;
  } = {},
): MotorNaPorta {
  const cap: CapacidadesDoMotor = {
    id,
    nome: opcoes.nome ?? `Motor ${id}`,
    versao: "1",
    entrega: "lote",
    geometrias: [opcoes.geometria ?? "ortogonal"],
  };
  return {
    capacidades: () => cap,
    gerar(): ResultadoDoMotor {
      if (opcoes.estoura) throw new Error("estourei de propósito");
      const recusou = Boolean(opcoes.recusa);
      return {
        saida: recusou ? null : { lotes: new Array(opcoes.lotes ?? 10).fill({}) },
        indicadores: { lotes: recusou ? null : (opcoes.lotes ?? 10) },
        semente: 1,
        geometria: opcoes.geometria ?? "ortogonal",
        naoAtendido: recusou
          ? [{ campo: "—", oQueChegou: "a gleba", postura: "recusei", consequencia: opcoes.recusa! }]
          : [],
        ms: 1,
      };
    },
  };
}

/** Um Validator de mentira: aprova quem tem lote, reprova quem não tem. */
const julgarPorLotes = (r: ResultadoDoMotor): Veredito => {
  const lotes = r.indicadores.lotes ?? 0;
  return lotes > 0
    ? { aprovada: true, motivos: [], nota: lotes }
    : { aprovada: false, motivos: ["não produziu lote nenhum"], nota: null };
};

describe("APAGAR O LAB INTEIRO NÃO QUEBRA A PEÇA", () => {
  test("por leitura: nenhum arquivo de entrega/ importa o Laboratório", () => {
    const proibidos = [/external-engines/, /@symbios/, /@testfit/, /@generate/, /esteira/];
    const culpados: string[] = [];
    for (const arquivo of arquivosDaEntrega()) {
      const texto = readFileSync(arquivo, "utf8");
      for (const linha of texto.split("\n")) {
        const t = linha.trim();
        if (!t.startsWith("import ") && !t.startsWith("export ") && !t.includes("require(")) continue;
        if (!t.includes("from ") && !t.includes("require(")) continue;
        for (const p of proibidos) {
          if (p.test(t)) culpados.push(`${arquivo}: ${t}`);
        }
      }
    }
    expect(culpados, `a peça passou a depender do Lab:\n${culpados.join("\n")}`).toHaveLength(0);
  });

  test("por leitura: a peça não importa NADA de fora dela", () => {
    // Nem npm. Uma dependência é uma coisa a mais para o Generate instalar, e a
    // peça inteira cabe sem nenhuma.
    for (const arquivo of arquivosDaEntrega()) {
      for (const linha of readFileSync(arquivo, "utf8").split("\n")) {
        const t = linha.trim();
        if (t.startsWith("import ") && t.includes("from ")) {
          expect(t, `${arquivo} importa algo: ${t}`).toContain("./");
        }
      }
    }
  });

  test("por execução: o registro roda com motor que não vem do Lab", () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("qualquer-um"));
    const ranking = montarRanking(r, undefined as never, julgarPorLotes);
    expect(ranking.aprovadas).toHaveLength(1);
    expect(ranking.nenhumaAprovada).toBe(false);
  });
});

describe("o registro — as regras da D68", () => {
  const comOsQuatro = () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("generate-ortogonal", { lotes: 30 }));
    r.registrar(motorDeMentira("generate-espinha", { lotes: 20 }));
    r.registrar(motorDeMentira("parcelamento", { lotes: 25 }));
    r.registrar(motorDeMentira("symbios", { lotes: 15 }));
    return r;
  };

  test("todos nascem VISÍVEIS e LIGADOS", () => {
    const lista = comOsQuatro().listar();
    expect(lista).toHaveLength(4);
    for (const m of lista) expect(m.ligado).toBe(true);
  });

  test("o padrão de fábrica é o do Laboratório de Parcelamento", () => {
    expect(PADRAO_DE_FABRICA).toBe("parcelamento");
    expect(comOsQuatro().padrao()).toBe("parcelamento");
    expect(comOsQuatro().listar().filter((m) => m.padrao).map((m) => m.id)).toEqual(["parcelamento"]);
  });

  test("o botão liga/desliga, por motor", () => {
    const r = comOsQuatro();
    r.desligar("symbios");
    expect(r.listar().find((m) => m.id === "symbios")!.ligado).toBe(false);
    expect(r.ligados()).toHaveLength(3);
    r.ligar("symbios");
    expect(r.ligados()).toHaveLength(4);
  });

  test("desligar o PADRÃO é permitido, e o padrão passa adiante", () => {
    const r = comOsQuatro();
    r.desligar("parcelamento");
    expect(r.padrao()).not.toBe("parcelamento");
    expect(r.padrao()).not.toBeNull();
    // E voltar a ligá-lo devolve o padrão de fábrica.
    r.ligar("parcelamento");
    expect(r.padrao()).toBe("parcelamento");
  });

  test("id repetido é recusado na porta, com a razão", () => {
    const r = comOsQuatro();
    expect(() => r.registrar(motorDeMentira("symbios"))).toThrow(/já há um motor com o id/);
  });

  test("sem motor ligado, o padrão é null — e não um id inventado", () => {
    const r = comOsQuatro();
    for (const m of r.listar()) r.desligar(m.id);
    expect(r.padrao()).toBeNull();
    expect(r.estadoDoUsuario().padrao).toBe("");
  });
});

describe("a escolha do usuário, salva e devolvida", () => {
  const registro = () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("a"));
    r.registrar(motorDeMentira("b"));
    r.registrar(motorDeMentira("parcelamento"));
    return r;
  };

  test("o que foi desligado continua desligado depois de salvar e voltar", () => {
    const antes = registro();
    antes.desligar("b");
    antes.definirPadrao("a");
    const salvo = antes.estadoDoUsuario();

    const depois = registro();
    depois.aplicarEstado(salvo);
    expect(depois.listar().find((m) => m.id === "b")!.ligado).toBe(false);
    expect(depois.padrao()).toBe("a");
  });

  test("MOTOR NOVO nasce ligado, sem apagar a escolha antiga", () => {
    const antes = registro();
    antes.desligar("b");
    const salvo = antes.estadoDoUsuario();

    // Chega um motor que não existia quando o usuário salvou.
    const depois = registro();
    depois.registrar(motorDeMentira("recem-chegado"));
    depois.aplicarEstado(salvo);

    expect(depois.listar().find((m) => m.id === "recem-chegado")!.ligado).toBe(true);
    expect(depois.listar().find((m) => m.id === "b")!.ligado).toBe(false);
  });

  test("motor que sumiu volta em `esquecidos`, não em silêncio", () => {
    const r = registro();
    const { esquecidos } = r.aplicarEstado({ desligados: ["b", "motor-que-nao-existe-mais"], padrao: "sumiu-tambem" });
    expect(esquecidos.sort()).toEqual(["motor-que-nao-existe-mais", "sumiu-tambem"]);
    // E o que sobrou continua coerente: o padrão volta ao de fábrica.
    expect(r.padrao()).toBe("parcelamento");
  });

  test("o estado é um objeto simples — o hospedeiro o guarda onde quiser", () => {
    const r = registro();
    r.desligar("a");
    const salvo = r.estadoDoUsuario();
    expect(JSON.parse(JSON.stringify(salvo))).toEqual(salvo);
  });
});

describe("o ranking — as três regras", () => {
  test("1 · só entra quem o Validator aprova, e as aprovadas vêm ordenadas", () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("poucos", { lotes: 5 }));
    r.registrar(motorDeMentira("muitos", { lotes: 50 }));
    r.registrar(motorDeMentira("nenhum", { lotes: 0 }));

    const ranking = montarRanking(r, undefined as never, julgarPorLotes);
    expect(ranking.aprovadas.map((c) => c.motorId)).toEqual(["muitos", "poucos"]);
    expect(ranking.reprovadas.map((c) => c.motorId)).toEqual(["nenhum"]);
  });

  test("2 · a reprovada leva o MOTIVO e NÃO leva o resultado", () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("reprovado", { lotes: 0 }));
    const ranking = montarRanking(r, undefined as never, julgarPorLotes);

    const c = ranking.reprovadas[0]!;
    expect(c.motivos.length).toBeGreaterThan(0);
    // O tipo não tem `resultado`, e o objeto também não: o desenho reprovado
    // não sai da peça.
    expect(Object.keys(c)).not.toContain("resultado");
  });

  test("2b · reprovar sem motivo é defeito da peça, e ela não deixa", () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("mudo", { lotes: 3 }));
    const mudo = (): Veredito => ({ aprovada: false, motivos: [], nota: null });
    const ranking = montarRanking(r, undefined as never, mudo);
    expect(ranking.reprovadas[0]!.motivos.length).toBeGreaterThan(0);
  });

  test("3 · NUNCA um ranking vazio em silêncio: todas reprovadas", () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("um", { lotes: 0 }));
    r.registrar(motorDeMentira("dois", { lotes: 0 }));

    const ranking = montarRanking(r, undefined as never, julgarPorLotes);
    expect(ranking.aprovadas).toHaveLength(0);
    expect(ranking.nenhumaAprovada).toBe(true);
    expect(ranking.recado).toContain("Nenhuma das 2 propostas passou");
    expect(ranking.reprovadas).toHaveLength(2);
    for (const c of ranking.reprovadas) expect(c.motivos.length).toBeGreaterThan(0);
  });

  test("3b · vazio porque está tudo desligado diz OUTRA coisa", () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("um"));
    r.desligar("um");
    const ranking = montarRanking(r, undefined as never, julgarPorLotes);
    expect(ranking.nenhumaAprovada).toBe(true);
    expect(ranking.recado).toContain("desligados");
    expect(ranking.desligados).toEqual(["um"]);
  });

  test("3c · vazio porque não há motor instalado diz uma TERCEIRA coisa", () => {
    const ranking = montarRanking(new RegistroDeMotores(), undefined as never, julgarPorLotes);
    expect(ranking.recado).toContain("Nenhum motor está instalado");
  });

  test("motor que RECUSA vira reprovada com a razão dele, não erro", () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("exigente", { recusa: "este motor precisa de relevo, e a gleba não tem" }));
    r.registrar(motorDeMentira("normal", { lotes: 9 }));

    const ranking = montarRanking(r, undefined as never, julgarPorLotes);
    expect(ranking.aprovadas.map((c) => c.motorId)).toEqual(["normal"]);
    expect(ranking.reprovadas[0]!.motivos[0]).toContain("precisa de relevo");
  });

  test("MOTOR QUE ESTOURA NÃO DERRUBA OS OUTROS", () => {
    // O contrato proíbe estourar (§7), mas a peça não confia — numa tela com
    // vários motores, um que caia levando os outros é o pior defeito possível.
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("bomba", { estoura: true }));
    r.registrar(motorDeMentira("sobrevivente", { lotes: 12 }));

    const ranking = montarRanking(r, undefined as never, julgarPorLotes);
    expect(ranking.aprovadas.map((c) => c.motorId)).toEqual(["sobrevivente"]);
    expect(ranking.reprovadas[0]!.motivos[0]).toContain("estourei de propósito");
  });

  test("motor desligado NÃO corre, e a tela sabe disso", () => {
    const r = new RegistroDeMotores();
    r.registrar(motorDeMentira("ligado", { lotes: 7 }));
    r.registrar(motorDeMentira("desligado", { lotes: 99 }));
    r.desligar("desligado");

    const ranking = montarRanking(r, undefined as never, julgarPorLotes);
    expect(ranking.aprovadas.map((c) => c.motorId)).toEqual(["ligado"]);
    expect(ranking.desligados).toEqual(["desligado"]);
  });
});
