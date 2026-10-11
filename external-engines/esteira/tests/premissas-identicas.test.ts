/**
 * **item 025 · a esteira compara motores sob premissas idênticas? — a medição, travada.**
 *
 * ```sh
 * bun test tests/premissas-identicas.test.ts
 * ```
 *
 * O item pediu **medição, não obra**: *"não conserte nada… se K > 0, o conserto é do chassi e vira
 * pedido"*. Então estas travas não guardam comportamento de motor: guardam **a medição** — que a
 * conta feche, que o K seja uma LISTA e não um número solto (adendo-2), que cada linha diga **onde
 * foi medida**, e que o que não dá para igualar esteja **nomeado**.
 *
 * **E elas são herméticas:** leem o módulo e os `.geojson` desta casa, nenhum clone — o portão não
 * tem os vizinhos, e o número do K vem da leitura que a ferramenta fez na ORIGEM deles, gravada na
 * prova.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  aFraseEstaNoComentario,
  aRegraEstaEscrita,
  comoARegraSeLe,
} from "../src/texto-das-regras.ts";
import {
  AS_DUAS_FORMAS,
  AS_QUE_VAO_NULAS,
  MOTOR_COMPOSTO,
  O_K,
  O_QUE_A_ESTEIRA_PASSA,
  O_QUE_EU_NAO_CONSIGO_IGUALAR,
  O_QUE_O_MOTOR_NAO_RECEBE,
  aConta,
} from "../src/premissas-identicas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (p: string): string => readFileSync(join(RAIZ, p), "utf8");

describe("item 025 · a conta fecha, e K é uma LISTA", () => {
  test("N, M e as nulas fecham: M + nulas = N", () => {
    const c = aConta();
    expect(c.N).toBe(O_QUE_A_ESTEIRA_PASSA.length);
    expect(c.nulas).toBe(AS_QUE_VAO_NULAS.length);
    expect(c.M + c.nulas).toBe(c.N);
  });

  test("as três que vão NULAS estão entre as que a esteira passa", () => {
    for (const n of AS_QUE_VAO_NULAS) {
      expect([...O_QUE_A_ESTEIRA_PASSA], n).toContain(n);
    }
  });

  /** *"K = 3 não diz o que consertar; APP, lazer e perfil de lote, no motor tal, diz"* (adendo-2). */
  test("K é a soma das LINHAS, e cada linha nomeia motor, premissa e motivo", () => {
    const c = aConta();
    expect(c.K).toBe(O_K.length);
    expect(Object.values(c.porMotor).reduce((s, n) => s + n, 0)).toBe(c.K);
    for (const k of O_K) {
      expect(k.origem, k.premissa).toBe("default-do-motor");
      expect(k.motor.length, k.premissa).toBeGreaterThan(3);
      expect(k.porque.length, k.premissa).toBeGreaterThan(40);
    }
  });

  test("K > 0 — o achado do item —, e os dois motores do Generate contam 4", () => {
    const c = aConta();
    expect(c.K).toBeGreaterThan(0);
    expect(c.porMotor["generate-ortogonal | generate-espinha"]).toBe(4);
    expect(c.porMotor["parcelamento"]).toBe(13);
  });

  /** O default de MOTOR é o que quebra a comparação; o `regimeFachada` é o mais pesado. */
  test("o `regimeFachada` está no K e o motivo diz o que ele decide", () => {
    const r = O_K.find((k) => k.premissa === "regimeFachada");
    expect(r).toBeDefined();
    expect(r!.oDefault).toBe('"condominio"');
    expect(r!.porque).toContain("RUA PÚBLICA");
  });

  /** Nenhuma premissa pode estar nas duas listas — *o K acusa, a outra pede*. */
  test("K e `motor-nao-recebe` são disjuntos por (motor, premissa)", () => {
    const chave = (p: { motor: string; premissa: string }) => `${p.motor}|${p.premissa}`;
    const noK = new Set(O_K.map(chave));
    for (const p of O_QUE_O_MOTOR_NAO_RECEBE) {
      expect(noK.has(chave(p)), chave(p)).toBe(false);
      expect(p.origem).toBe("motor-nao-recebe");
    }
  });
});

describe("item 025 · o limite vai dito, e o Symbios é o maior deles", () => {
  test("o que NÃO dá para igualar está nomeado, com cinco linhas", () => {
    expect(O_QUE_EU_NAO_CONSIGO_IGUALAR.length).toBeGreaterThanOrEqual(5);
    for (const l of O_QUE_EU_NAO_CONSIGO_IGUALAR) expect(l.length).toBeGreaterThan(60);
  });

  test("o Symbios aparece como `motor-nao-recebe` em TODAS, e o motivo diz que ele não parcela", () => {
    const s = O_QUE_O_MOTOR_NAO_RECEBE.find((p) => p.motor === "symbios");
    expect(s).toBeDefined();
    expect(s!.premissa).toContain("TODAS");
    expect(s!.porque).toContain("não parcela em lote");
  });

  test("e o limite do Symbios está também na lista do que não dá para igualar", () => {
    expect(O_QUE_EU_NAO_CONSIGO_IGUALAR.join(" | ")).toContain("SYMBIOS");
  });
});

describe("item 025 · as DUAS formas de área declarada (adendo-2)", () => {
  test("a esteira passa as duas, e cada uma diz ONDE", () => {
    expect(AS_DUAS_FORMAS.poligonoDesenhado.aEsteiraPassa).toBe(true);
    expect(AS_DUAS_FORMAS.porcentagem.aEsteiraPassa).toBe(true);
    expect(AS_DUAS_FORMAS.poligonoDesenhado.onde).toContain("restricoes");
    expect(AS_DUAS_FORMAS.porcentagem.onde).toContain("pctAPP");
  });

  /**
   * **O achado:** na gleba `completo` as duas formas chegam juntas e nada declara qual manda — e
   * isto é conferido contra o `.geojson`, não contra a minha frase.
   */
  test("só `completo` traz área declarada como POLÍGONO — medido no arquivo", () => {
    const completo = JSON.parse(ler("docs/terrenos/completo.geojson")) as {
      features: { properties?: { tipo?: string } }[];
    };
    const tipos = new Set(completo.features.map((f) => f.properties?.tipo));
    expect(tipos.has("app")).toBe(true);
    expect(tipos.has("reserva_legal")).toBe(true);

    for (const outra of ["pequeno", "sintetico-10ha-plano", "sintetico-50ha-ondulado"]) {
      const g = JSON.parse(ler(`docs/terrenos/${outra}.geojson`)) as {
        features: { properties?: { tipo?: string } }[];
      };
      const t = new Set(g.features.map((f) => f.properties?.tipo));
      expect(t.has("app"), outra).toBe(false);
      expect(t.has("reserva_legal"), outra).toBe(false);
    }
    expect(AS_DUAS_FORMAS.oProblema).toContain("duas vezes");
  });

  /** E a porcentagem vai para TODAS, porque o bloco de parâmetros é um só. */
  test("o bloco de parâmetros é UM, e por isso os 15 %/10 % vão para as quatro glebas", () => {
    const fonte = ler("external-engines/esteira/src/gleba-do-lab.ts");
    expect(fonte).toContain("pctAPP: 15");
    expect(fonte).toContain("pctLazer: 10");
    expect(AS_DUAS_FORMAS.porcentagem.medidoNasGlebas).toContain("TODAS");
  });
});

describe("item 025-adendo · o motor COMPOSTO", () => {
  test("a porta aceita, e o que falta é a regra de JUNÇÃO — declarado", () => {
    expect(MOTOR_COMPOSTO.aPortaAceita).toBe(true);
    expect(MOTOR_COMPOSTO.oQueFalta).toContain("JUNÇÃO");
    expect(MOTOR_COMPOSTO.porque).toContain("`id`");
  });

  /** A porta existe e tem três implementações — a afirmação é conferida no arquivo. */
  test("a porta tem TRÊS implementações, cada uma com `id` próprio", () => {
    const porta = ler("external-engines/esteira/src/porta/motores.ts");
    expect(porta).toContain('id: `generate-${candidata}`');
    expect(porta).toContain('id: "parcelamento"');
    expect(porta).toContain('id: "symbios"');
  });
});

describe("item 025 · a medição diz ONDE foi medida, e não conserta nada", () => {
  test("o módulo cita os quatro lugares da medição", () => {
    const m = ler("external-engines/esteira/src/premissas-identicas.ts");
    expect(m).toContain("gleba-do-lab.ts");
    expect(m).toContain("PARAMS_PADRAO_V1");
    expect(m).toContain("ChaveFaixa");
    expect(m).toContain("perdaEmBloco");
  });

  /**
   * *Esta casa mede e pede* — e o módulo diz isso, para ninguém o ler como conserto.
   *
   * **E a primeira versão desta trava tropeçou no próprio defeito do D248:** ela procurava o
   * literal `"mede e pede"` com `toContain`, e no módulo a frase está quebrada em duas linhas
   * (`mede e\n * pede`). *O normalizador do `.md` existe desde o LAB-77 — e medido, ele NÃO
   * servia aqui*: ele tira o `>` da citação e não o ` * ` do JSDoc, então devolvia
   * `mede e * pede`. **Duas gramáticas, dois normalizadores**, e o segundo nasceu em
   * `src/texto-das-regras.ts` (`comoOComentarioSeLe`), não dentro deste teste (D248).
   */
  test("o módulo declara que não é conserto, e cita a §4", () => {
    const m = ler("external-engines/esteira/src/premissas-identicas.ts");
    expect(aFraseEstaNoComentario(m, "mede e pede")).toBe(true);
    expect(m).toContain("§4");
  });
});

/**
 * **O leitor de COMENTÁRIO, nos dois sentidos** (LAB-92) — ele nasceu nesta rodada porque o do
 * `.md` não servia, e *régua nova sem o lado ruim não prova que mede*.
 */
describe("LAB-92 · o leitor de comentário de código, e por que o do `.md` não serve", () => {
  const JSDOC = ["/**", " * Esta casa **mede e", " * pede**, e o resto segue.", " */"].join("\n");

  test("O LADO BOM: a frase quebrada entre duas linhas de JSDoc É encontrada", () => {
    expect(aFraseEstaNoComentario(JSDOC, "mede e pede")).toBe(true);
  });

  test("O LADO RUIM: o normalizador do `.md` NÃO acha a mesma frase — foi o que me pegou", () => {
    expect(aRegraEstaEscrita(JSDOC, "mede e pede")).toBe(false);
    expect(comoARegraSeLe(JSDOC)).toContain("mede e * pede");
  });

  test("e o leitor de comentário NÃO afrouxa: frase que não está continua não estando", () => {
    expect(aFraseEstaNoComentario(JSDOC, "mede e cobra")).toBe(false);
  });

  test("ele também tira o `//` da linha simples", () => {
    expect(aFraseEstaNoComentario("// uma frase\n// partida ao meio", "uma frase partida ao meio")).toBe(true);
  });
});
