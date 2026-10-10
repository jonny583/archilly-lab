/**
 * AS TRAVAS DO REGISTRO DE MOTORES DO LAB. (LAB-76, D68)
 *
 * A D68 pediu três travas, e a terceira é a que vale:
 *
 *   1. todo motor que a esteira roda **está no registro**;
 *   2. todo motor do registro tem a **procedência medida**, com a distância até a origem;
 *   3. **motor desligado não entra em medição nenhuma**, e o relatório diz **quantos motores
 *      havia e quantos estavam ligados** — *conferência que não publica o tamanho do universo
 *      que leu passa lendo zero*.
 *
 * # Por que este arquivo não precisa dos clones vizinhos
 *
 * Porque as funções que ele testa recebem a medição **por parâmetro**, como
 * `conferirContraAOrigem` (LAB-74). A metade que precisa dos clones — conferir os ids que as
 * fábricas da porta de fato produzem — mora em `porta.test.ts`, que já importa a porta e já tem
 * os quatro motores montados. **Não se cria um segundo lugar para a pergunta que já tem lugar.**
 *
 * # E há uma trava aqui que não estava na lista, e é a mais forte das quatro
 *
 * A do **formato fechado** do dado. A lição do item 006 foi: *"não escreva 'recusar X' numa
 * conferência; tire o campo onde o X caberia — campo que não existe não se esquece"*. O risco
 * declarado deste prompt era o registro virar **cópia do inventário das pontes**, e uma régua de
 * palavra contra isso teria a doença de sempre. Então o dado tem **lista fechada de chaves**: a
 * cópia campo a campo não é proibida por texto, ela **não tem onde caber**.
 */

import { describe, expect, test } from "bun:test";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { PADRAO_DE_FABRICA } from "../../../entrega/registro-de-motores/registro.ts";
import { MOTORES_DE_LOTE } from "../src/acesso.ts";
import type { ConferenciaDaOrigem } from "../src/commit-dos-vizinhos.ts";
import * as inventario from "../src/inventario-das-pontes.ts";
import {
  CAMINHO_DO_REGISTRO,
  CONTRATO_DO_REGISTRO,
  ESTADOS,
  TIPOS_DE_PROCEDENCIA,
  conferirORegistro,
  lerORegistro,
  ligados,
  padraoDoLab,
  procedenciaDosMotores,
  universoLido,
  type RegistroDoLab,
} from "../src/registro-do-lab.ts";

const REGISTRO = lerORegistro();

/** Os nomes das constantes do inventário das pontes — para os ponteiros terem a quem apontar. */
const NOMES_DO_INVENTARIO = Object.keys(inventario).filter((n) => /^[A-Z_]+$/.test(n));

/** Os ids que as fábricas da porta produzem. Conferido contra a porta REAL em `porta.test.ts`. */
const IDS_DA_PORTA = ["generate-ortogonal", "generate-espinha", "parcelamento", "symbios"] as const;

/** Escreve um registro sabotado num arquivo temporário e devolve o caminho. */
function sabotar(mexer: (cru: Record<string, unknown>) => void): string {
  const cru: Record<string, unknown> = JSON.parse(readFileSync(CAMINHO_DO_REGISTRO, "utf8")) as Record<
    string,
    unknown
  >;
  mexer(cru);
  const dir = mkdtempSync(join(tmpdir(), "registro-do-lab-"));
  const caminho = join(dir, "registro-de-motores.json");
  writeFileSync(caminho, JSON.stringify(cru));
  return caminho;
}

function motorDe(reg: RegistroDoLab, id: string): Record<string, unknown> {
  const lista = reg.motores as unknown as Record<string, unknown>[];
  const m = lista.find((x) => x.id === id);
  if (!m) throw new Error(`o teste pediu o motor "${id}" e ele não está no registro`);
  return m;
}

describe("o dado — ele é dado, e ele se confere", () => {
  test("o registro lê, e com o contrato que este leitor entende", () => {
    expect(REGISTRO.contrato).toBe(CONTRATO_DO_REGISTRO);
    expect(REGISTRO.motores.length).toBeGreaterThan(0);
  });

  test("dado de outro contrato NÃO se adivinha", () => {
    const c = sabotar((cru) => {
      cru.contrato = "registro-de-motores/9";
    });
    expect(() => lerORegistro(c)).toThrow(/contrato/);
  });

  test("o estado é vocabulário FECHADO", () => {
    for (const m of REGISTRO.motores) {
      expect(ESTADOS as readonly string[]).toContain(m.estado);
    }
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      if (ms[0]) ms[0].estado = "mais-ou-menos";
    });
    expect(() => lerORegistro(c)).toThrow(/não é um dos/);
  });

  test("a procedência é vocabulário FECHADO", () => {
    for (const m of REGISTRO.motores) {
      expect(TIPOS_DE_PROCEDENCIA as readonly string[]).toContain(m.procedencia.tipo);
    }
  });

  test("motor fora da medição SEM motivo escrito reprova", () => {
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      const alvo = ms.find((m) => m.estado !== "ligado");
      if (!alvo) throw new Error("o registro não tem motor fora da medição para sabotar");
      alvo.porque = null;
    });
    expect(() => lerORegistro(c)).toThrow(/sem `porque`/);
  });

  test("motor LIGADO com `porque` reprova — não há o que justificar", () => {
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      const alvo = ms.find((m) => m.estado === "ligado");
      if (!alvo) throw new Error("o registro não tem motor ligado para sabotar");
      alvo.porque = "porque sim";
    });
    expect(() => lerORegistro(c)).toThrow(/não leva `porque`/);
  });

  test("versão lida E versão declarada ao mesmo tempo reprova (D116)", () => {
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      const alvo = ms.find((m) => (m.procedencia as Record<string, unknown>).versaoLidaDe !== null);
      if (!alvo) throw new Error("nenhum motor lê a versão de arquivo");
      (alvo.procedencia as Record<string, unknown>).versaoDeclarada = "9.9.9";
    });
    expect(() => lerORegistro(c)).toThrow(/duas respostas para a mesma pergunta/);
  });

  test("dois motores com o mesmo id reprovam", () => {
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      if (ms[0]) ms.push({ ...ms[0] });
    });
    expect(() => lerORegistro(c)).toThrow(/dois motores com o id/);
  });
});

describe("O FORMATO É FECHADO — a cópia do inventário não tem onde caber", () => {
  const CHAVES_DO_MOTOR = ["id", "nome", "estado", "porque", "procedencia", "oQuePrometeMoraEm"];
  const CHAVES_DA_PROCEDENCIA = ["tipo", "repo", "alias", "versaoLidaDe", "versaoDeclarada"];
  const CHAVES_DA_RAIZ = ["contrato", "porQueIstoEDado", "oQueNaoMoraAqui", "motores"];

  const cru: Record<string, unknown> = JSON.parse(readFileSync(CAMINHO_DO_REGISTRO, "utf8")) as Record<
    string,
    unknown
  >;

  test("a raiz não tem chave além das declaradas", () => {
    expect(Object.keys(cru).sort()).toEqual([...CHAVES_DA_RAIZ].sort());
  });

  test("cada motor não tem chave além das declaradas — nem a procedência", () => {
    for (const m of cru.motores as Record<string, unknown>[]) {
      expect(Object.keys(m).sort()).toEqual([...CHAVES_DO_MOTOR].sort());
      expect(Object.keys(m.procedencia as Record<string, unknown>).sort()).toEqual(
        [...CHAVES_DA_PROCEDENCIA].sort(),
      );
    }
  });

  test("O PADRÃO NÃO MORA NO DADO — ele tem UM nome nesta casa (D116)", () => {
    const texto = readFileSync(CAMINHO_DO_REGISTRO, "utf8");
    expect(Object.keys(cru)).not.toContain("padrao");
    for (const m of cru.motores as Record<string, unknown>[]) {
      expect(Object.keys(m)).not.toContain("padrao");
    }
    // E a única menção ao padrão no dado é o PONTEIRO para onde ele mora.
    expect(texto).toContain("PADRAO_DE_FABRICA");
  });

  test("o dado APONTA para o inventário e não o copia", () => {
    for (const m of REGISTRO.motores) {
      for (const nome of m.oQuePrometeMoraEm ?? []) {
        expect(NOMES_DO_INVENTARIO).toContain(nome);
      }
    }
    const c = sabotar((cru2) => {
      const ms = cru2.motores as Record<string, unknown>[];
      const alvo = ms.find((m) => Array.isArray(m.oQuePrometeMoraEm));
      if (!alvo) throw new Error("nenhum motor aponta para o inventário");
      (alvo.oQuePrometeMoraEm as string[]).push("INVENTARIO_QUE_NAO_EXISTE");
    });
    const conf = conferirORegistro(lerORegistro(c), IDS_DA_PORTA, MOTORES_DE_LOTE, NOMES_DO_INVENTARIO);
    expect(conf.ok).toBe(false);
    expect(conf.apontamDesconhecido.map((a) => a.nome)).toContain("INVENTARIO_QUE_NAO_EXISTE");
  });
});

describe("TRAVA 1 — todo motor que a esteira roda está no registro", () => {
  test("os quatro ids da porta estão no registro, e nenhum ligado é promessa vazia", () => {
    const conf = conferirORegistro(REGISTRO, IDS_DA_PORTA, MOTORES_DE_LOTE, NOMES_DO_INVENTARIO);
    expect(conf.fora).toEqual([]);
    expect(conf.prometidosQueNaoExistem).toEqual([]);
    expect(conf.ok).toBe(true);
  });

  test("motor que a esteira roda e o registro não conhece REPROVA", () => {
    const conf = conferirORegistro(
      REGISTRO,
      [...IDS_DA_PORTA, "motor-fantasma"],
      MOTORES_DE_LOTE,
      NOMES_DO_INVENTARIO,
    );
    expect(conf.fora).toEqual(["motor-fantasma"]);
    expect(conf.ok).toBe(false);
  });

  test("a MOTORES_DE_LOTE está toda no registro e toda LIGADA", () => {
    const conf = conferirORegistro(REGISTRO, IDS_DA_PORTA, MOTORES_DE_LOTE, NOMES_DO_INVENTARIO);
    expect(conf.loteForaDoRegistro).toEqual([]);
    expect(conf.loteQueNaoEstaLigado).toEqual([]);
  });

  test("desligar um motor da MOTORES_DE_LOTE reprova — e é por isso que mudar o estado é prompt", () => {
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      const alvo = ms.find((m) => m.id === MOTORES_DE_LOTE[0]);
      if (!alvo) throw new Error(`"${MOTORES_DE_LOTE[0]}" não está no registro`);
      alvo.estado = "desligado";
      alvo.porque = "sabotagem do teste";
    });
    const conf = conferirORegistro(lerORegistro(c), IDS_DA_PORTA, MOTORES_DE_LOTE, NOMES_DO_INVENTARIO);
    expect(conf.loteQueNaoEstaLigado).toEqual([MOTORES_DE_LOTE[0]]);
    expect(conf.ok).toBe(false);
  });
});

describe("TRAVA 2 — a procedência, e `nao-medida` não é `em-dia`", () => {
  const origemDe = (repo: string, atrasPor: number): ConferenciaDaOrigem => ({
    repo: repo as ConferenciaDaOrigem["repo"],
    veredito: atrasPor === 0 ? "em-dia" : "atras",
    head: "aaaaaaa",
    origemMain: "bbbbbbb",
    atrasPor,
    oQueIssoQuerDizer: `\`${repo}\` está ${atrasPor} commit(s) atrás`,
  });

  const TODAS = new Map<string, ConferenciaDaOrigem>([
    ["motor-testfit", origemDe("motor-testfit", 28)],
    ["urban-create-hub-41d93a4d", origemDe("urban-create-hub-41d93a4d", 22)],
  ]);

  test("todo motor do registro recebe um veredito de procedência — nenhum fica sem", () => {
    const p = procedenciaDosMotores(REGISTRO, TODAS);
    expect(p.length).toBe(REGISTRO.motores.length);
    for (const x of p) expect(x.veredito).toBeTruthy();
  });

  test("motor lido por caminho traz a DISTÂNCIA até a origem, não só o commit do disco", () => {
    const p = procedenciaDosMotores(REGISTRO, TODAS);
    const parcelamento = p.find((x) => x.motor === "parcelamento");
    expect(parcelamento?.veredito).toBe("medida-contra-a-origem");
    expect(parcelamento?.atrasPor).toBe(28);
  });

  test("sem a medição da origem o veredito é `nao-medida` — e isso NÃO é `em-dia` (D23, D241)", () => {
    const p = procedenciaDosMotores(REGISTRO, new Map());
    const parcelamento = p.find((x) => x.motor === "parcelamento");
    expect(parcelamento?.veredito).toBe("nao-medida");
    expect(parcelamento?.atrasPor).toBe(null);
    expect(parcelamento?.comoSeDiz).toContain("não é o mesmo que em dia");
  });

  test("motor de `upstream/` é `carimbado-no-upstream`: uma resposta, não uma falta", () => {
    const p = procedenciaDosMotores(REGISTRO, TODAS);
    const symbios = p.find((x) => x.motor === "symbios");
    expect(symbios?.veredito).toBe("carimbado-no-upstream");
    expect(symbios?.comoSeDiz).toContain("NÃO é o mesmo que não medido");
  });

  test("motor não copiado é `nao-copiado`, e o motivo está no registro", () => {
    const p = procedenciaDosMotores(REGISTRO, TODAS);
    for (const x of p.filter((y) => y.veredito === "nao-copiado")) {
      expect(motorDe(REGISTRO, x.motor).porque).toBeTruthy();
    }
    expect(p.filter((y) => y.veredito === "nao-copiado").length).toBeGreaterThan(0);
  });

  /**
   * O COMMIT NÃO ESTÁ GRAVADO NO DADO (D104) — e esta trava já se acusou uma vez.
   *
   * A primeira versão dela varria o TEXTO com `/\b[0-9a-f]{7,}\b/` e reprovou o registro
   * legítimo: casou **`41d93a4d`**, que é o fim do NOME do repositório vizinho
   * `urban-create-hub-41d93a4d`. O `-` é fronteira de palavra para o regex, então um nome
   * composto se parte e o pedaço parece um sha (D245).
   *
   * > **Fronteira de palavra num nome composto não é fronteira de valor.**
   *
   * O conserto é de ESTRUTURA, não de texto: um commit só significa "commit" quando é o
   * **valor inteiro** de um campo. `urban-create-hub-41d93a4d` inteiro não é hexadecimal;
   * `"6cf6396"` é. Então a régua anda pelo JSON e olha cada valor por inteiro — é a mesma
   * lição do item 006 (*tire o campo onde a coisa caberia*) e a do §6 (*procure o nome no
   * lugar da gramática onde ele significa aquilo*).
   */
  test("o commit NÃO está gravado no dado — e a régua olha o VALOR, não o texto (D104, D245)", () => {
    const ehSha = (v: string): boolean => /^[0-9a-f]{7,40}$/.test(v);

    const valores: { caminho: string; valor: string }[] = [];
    const andar = (x: unknown, caminho: string): void => {
      if (typeof x === "string") valores.push({ caminho, valor: x });
      else if (Array.isArray(x)) x.forEach((y, i) => andar(y, `${caminho}[${i}]`));
      else if (typeof x === "object" && x !== null) {
        for (const [k, v] of Object.entries(x)) andar(v, `${caminho}.${k}`);
      }
    };
    andar(JSON.parse(readFileSync(CAMINHO_DO_REGISTRO, "utf8")), "$");

    expect(valores.length).toBeGreaterThan(0);
    expect(valores.filter((v) => ehSha(v.valor)).map((v) => v.caminho)).toEqual([]);

    // E ela PEGA um commit gravado — senão seria uma régua que só sabe aprovar.
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      if (ms[0]) (ms[0].procedencia as Record<string, unknown>).versaoDeclarada = "6cf6396";
    });
    const sabotados: string[] = [];
    const andar2 = (x: unknown, caminho: string): void => {
      if (typeof x === "string") {
        if (ehSha(x)) sabotados.push(caminho);
      } else if (Array.isArray(x)) x.forEach((y, i) => andar2(y, `${caminho}[${i}]`));
      else if (typeof x === "object" && x !== null) {
        for (const [k, v] of Object.entries(x)) andar2(v, `${caminho}.${k}`);
      }
    };
    andar2(JSON.parse(readFileSync(c, "utf8")), "$");
    expect(sabotados.length).toBe(1);

    // E o nome do vizinho, que a primeira versão desta régua acusou, atravessa.
    expect(ehSha("urban-create-hub-41d93a4d")).toBe(false);
    expect(ehSha("41d93a4d")).toBe(true);
  });
});

describe("TRAVA 3 — o tamanho do universo, e a conta tem de FECHAR", () => {
  test("conhecidos = ligados + desligados + só-referência", () => {
    const u = universoLido(REGISTRO);
    expect(u.ligados + u.desligados + u.soReferencia).toBe(u.conhecidos);
    expect(u.conhecidos).toBe(REGISTRO.motores.length);
  });

  test("`so-referencia` NÃO é `desligado` — os dois estados são contados separados", () => {
    const u = universoLido(REGISTRO);
    expect(u.soReferencia).toBeGreaterThan(0);
    expect(u.desligados).toBe(0);
    // E quem é só-referência não entra nos ligados.
    const ids = ligados(REGISTRO).map((m) => m.id);
    for (const m of REGISTRO.motores.filter((x) => x.estado === "so-referencia")) {
      expect(ids).not.toContain(m.id);
    }
  });

  test("motor desligado não entra em medição nenhuma", () => {
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      const alvo = ms.find((m) => m.id === "symbios");
      if (!alvo) throw new Error("symbios não está no registro");
      alvo.estado = "desligado";
      alvo.porque = "sabotagem do teste";
    });
    const reg = lerORegistro(c);
    expect(ligados(reg).map((m) => m.id)).not.toContain("symbios");
    const u = universoLido(reg);
    expect(u.desligados).toBe(1);
    expect(u.ligados + u.desligados + u.soReferencia).toBe(u.conhecidos);
  });

  test("a frase do universo DIZ os números — publicar a conta é a trava", () => {
    const u = universoLido(REGISTRO);
    expect(u.comoSeDiz).toContain(`${u.conhecidos} motores conhecidos`);
    expect(u.comoSeDiz).toContain(`${u.ligados} ligados`);
    expect(u.comoSeDiz).toContain(`${u.desligados} desligados`);
  });
});

describe("O MOTOR PADRÃO — um nome só nesta casa", () => {
  test("o padrão do Lab é o `PADRAO_DE_FABRICA`, importado e não recopiado", () => {
    expect(padraoDoLab(REGISTRO)).toBe(PADRAO_DE_FABRICA);
    expect(PADRAO_DE_FABRICA).toBe("parcelamento");
  });

  test("padrão que não está no registro reprova", () => {
    const c = sabotar((cru) => {
      cru.motores = (cru.motores as Record<string, unknown>[]).filter(
        (m) => m.id !== PADRAO_DE_FABRICA,
      );
    });
    expect(() => padraoDoLab(lerORegistro(c))).toThrow(/não está no\s+registro|não está no registro/);
  });

  test("padrão desligado reprova — mudar o padrão é prompt, não efeito colateral", () => {
    const c = sabotar((cru) => {
      const ms = cru.motores as Record<string, unknown>[];
      const alvo = ms.find((m) => m.id === PADRAO_DE_FABRICA);
      if (!alvo) throw new Error("o padrão não está no registro");
      alvo.estado = "desligado";
      alvo.porque = "sabotagem do teste";
    });
    expect(() => padraoDoLab(lerORegistro(c))).toThrow(/é prompt/);
  });
});
