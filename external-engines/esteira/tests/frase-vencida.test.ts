/**
 * **LAB-151 (item 900) · o motivo de uma perda não mora em comentário** (D379).
 *
 * ```sh
 * bun test tests/frase-vencida.test.ts
 * ```
 *
 * O `CLAUDE.md` §4 diz que *"o motivo de uma perda não mora em comentário (D98, D104)"*, e nada perguntava se a frase que
 * o D98 matou continuava viva fora da ponte. O motivo inteiro, com os lugares contados, está no cabeçalho de
 * `src/frase-vencida.ts`.
 *
 * Roda **sem clones** (lê a árvore DESTE repositório pelo `git ls-files`), e por isso está no portão sem clones do
 * `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_FRASES_VENCIDAS,
  A_REGRA,
  O_QUE_ISTO_NAO_ALCANCA,
  VIVAS_DECLARADAS,
  conferirAsFontes,
  conferirAsFrasesVencidas,
  oUniverso,
  ocorrencias,
  type FraseViva,
} from "../src/frase-vencida.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (c: string) => readFileSync(join(RAIZ, c), "utf8");

const UM = (arquivo: string, texto: string, declaradas: readonly FraseViva[] = []) =>
  conferirAsFrasesVencidas(new Map([[arquivo, texto]]), declaradas).problemas.map((p) => p.tipo);

const classe = (arquivo: string, texto: string) => ocorrencias(texto, arquivo).map((o) => `${o.frase}:${o.classe}`);

describe("LAB-151 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §4 diz que o motivo de uma perda não mora em comentário", () => {
    expect(aRegraEstaEscrita(ler("CLAUDE.md"), A_REGRA)).toBe(true);
  });

  test("cada frase vencida está registrada como falsa na fonte que a lista aponta", () => {
    expect(conferirAsFontes(ler)).toEqual([]);
  });
});

describe("LAB-151 · a árvore de hoje", () => {
  const universo = oUniverso(RAIZ);
  const r = conferirAsFrasesVencidas(universo);

  test("passa, e diz o tamanho do que leu", () => {
    expect(r.problemas).toEqual([]);
    expect(r.arquivosLidos).toBeGreaterThan(300);
    expect(r.ocorrencias.length).toBeGreaterThan(20);
  });

  test("as únicas vivas são as declaradas — as três da ferramenta do LAB-08", () => {
    expect(r.porClasse.viva).toBe(VIVAS_DECLARADAS.reduce((s, d) => s + d.quantas, 0));
    expect(new Set(r.ocorrencias.filter((o) => o.classe === "viva").map((o) => o.arquivo))).toEqual(
      new Set(VIVAS_DECLARADAS.map((d) => d.arquivo)),
    );
  });

  test("os quatro consertos do LAB-151 seguem consertados", () => {
    for (const f of [
      "external-engines/esteira/src/symbios-para-contrato.ts",
      "external-engines/testfit/ferramentas/medir.ts",
      "external-engines/testfit/README.md",
      "README.md",
    ])
      expect(r.ocorrencias.filter((o) => o.arquivo === f && o.classe === "viva"), f).toEqual([]);
  });

  test("o universo não lê docs/ nem upstream/ — e lê as pontes", () => {
    const chaves = [...universo.keys()];
    expect(chaves.filter((c) => c.startsWith("docs/") || c.includes("/upstream/"))).toEqual([]);
    expect(chaves).toContain("external-engines/testfit/adapter/src/volta.ts");
    expect(chaves).toContain("external-engines/esteira/src/symbios-para-contrato.ts");
  });
});

describe("LAB-151 · o lado bom: a frase dita sem ser afirmada", () => {
  test("citada entre aspas, num comentário e num texto do código", () => {
    expect(classe("a.ts", '// estava escrito "o motor não calcula greide", e ninguém viu\n')).toEqual(["greide:citada"]);
    expect(classe("a.ts", 'const x = { motivo: "o motor não calcula greide" };\n')).toEqual(["greide:citada"]);
    expect(classe("a.md", "A frase “o motor não guarda de qual via” é do D104.\n")).toEqual(["face-de-rua:citada"]);
  });

  test("citação longa que atravessa ponto final continua citação", () => {
    const t = '  oQue: "o motor usa as caixas e não tem um piso independente. Vira perda declarada " +\n';
    expect(classe("a.ts", t)).toEqual(["piso-de-caixa:citada"]);
  });

  test("na história: era, Até o LAB-NN, deixou de ser, riscado", () => {
    expect(classe("a.ts", "// O motor não calcula greide, e era verdade em 13/09.\n")).toEqual(["greide:historia"]);
    expect(classe("a.ts", "// Até o LAB-22 o motor não calcula greide aqui.\n")).toEqual(["greide:historia"]);
    expect(classe("a.md", "5. ~~O motor não calcula greide~~ — consertado.\n")).toEqual(["greide:historia"]);
  });

  test("genérica: um motor que não calcula, quando o motor não calcula", () => {
    expect(classe("a.ts", "/** Um motor que não calcula greide pode traçar mal. */\n")).toEqual(["greide:generica"]);
    expect(classe("a.ts", "// `null` quando o motor não calcula greide (D23).\n")).toEqual(["greide:generica"]);
  });

  test("no passado não é a frase: não calculava greide", () => {
    expect(classe("a.md", "e o motor não calculava greide em 13/09.\n")).toEqual([]);
  });

  test("a declaração que bate passa", () => {
    const d: FraseViva[] = [{ arquivo: "a.ts", frase: "greide", quantas: 1, motivo: "uma ferramenta que reproduz a prova congelada de um dia" }];
    expect(UM("a.ts", "// O motor não calcula greide.\n", d)).toEqual([]);
  });
});

describe("LAB-151 · o lado ruim: a frase afirmada no presente", () => {
  test("a forma exata do D98: o null com o motivo ao lado", () => {
    expect(UM("volta.ts", "    rampaMedia_pct: null, // o motor não calcula greide\n")).toEqual(["frase-vencida-viva"]);
  });

  test("a do symbios, quebrada no JSDoc e com ênfase", () => {
    const t = "/**\n * - as duas vão preenchidas. É o contrário do outro motor, que **não calcula\n *   greide** e sai `null`.\n */\n";
    expect(UM("ponte.ts", t)).toEqual(["frase-vencida-viva"]);
  });

  test("a de linha simples, quebrada entre dois //", () => {
    expect(UM("x.ts", "  // a rampa sai null porque o motor não calcula\n  // greide no Plano.\n")).toEqual([
      "frase-vencida-viva",
    ]);
  });

  test("a citada antes não absolve a viva depois, no mesmo parágrafo", () => {
    const t = '// Estava escrito "o motor não calcula greide". Hoje o motor não calcula greide.\n';
    expect(UM("x.ts", t)).toEqual(["frase-vencida-viva"]);
  });

  test("a mensagem fixa do console, entre crases", () => {
    expect(UM("f.ts", "console.log(`  │ rampa: null — o motor não calcula greide`);\n")).toEqual(["frase-vencida-viva"]);
  });

  test("num README, numa lista no presente", () => {
    expect(UM("README.md", "5. O motor não calcula greide: `rampaMedia_pct` sai `null`.\n")).toEqual(["frase-vencida-viva"]);
  });

  test("cada uma das quatro frases é pega", () => {
    const vivas = [
      "// o motor não calcula greide.",
      "// nenhuma via tem cota no Plano.",
      "// o motor sabe a testada mas não guarda de QUAL via ela é frente.",
      "// o motor não tem um piso independente.",
    ];
    for (const v of vivas) expect(UM("x.ts", v + "\n"), v).toEqual(["frase-vencida-viva"]);
    expect(AS_FRASES_VENCIDAS).toHaveLength(vivas.length);
  });

  test("a palavra de história noutra sentença do parágrafo não salva a viva", () => {
    expect(UM("x.ts", "// Isto era outra coisa. O motor não calcula greide.\n")).toEqual(["frase-vencida-viva"]);
  });

  test("declaração que sobra: a frase saiu, ou apareceu mais uma", () => {
    const d: FraseViva[] = [{ arquivo: "a.ts", frase: "greide", quantas: 1, motivo: "uma ferramenta que reproduz a prova congelada de um dia" }];
    expect(UM("a.ts", "// nada aqui\n", d)).toEqual(["declaracao-que-sobra"]);
    expect(UM("a.ts", "// O motor não calcula greide.\n\n// O motor não calcula greide.\n", d)).toEqual([
      "declaracao-que-sobra",
    ]);
  });

  test("motivo curto", () => {
    const d: FraseViva[] = [{ arquivo: "a.ts", frase: "greide", quantas: 1, motivo: "fica" }];
    expect(UM("a.ts", "// O motor não calcula greide.\n", d)).toEqual(["motivo-curto"]);
  });

  test("universo vazio reprova", () => {
    expect(conferirAsFrasesVencidas(new Map(), []).problemas.map((p) => p.tipo)).toEqual(["universo-vazio"]);
  });

  test("frase sem fonte: a fonte não a tem, não tem a marca, ou não existe", () => {
    const f = [{ ...AS_FRASES_VENCIDAS[0]!, fonte: "x.ts" }];
    expect(conferirAsFontes(() => "nada", f).map((p) => p.tipo)).toEqual(["frase-sem-fonte"]);
    expect(conferirAsFontes(() => '"o motor não calcula greide"', f).map((p) => p.tipo)).toEqual(["frase-sem-fonte"]);
    expect(
      conferirAsFontes(() => {
        throw new Error("não existe");
      }, f).map((p) => p.tipo),
    ).toEqual(["frase-sem-fonte"]);
    expect(conferirAsFontes(() => '"o motor não calcula greide" (D98)', f)).toEqual([]);
  });
});

describe("LAB-151 · o que ela não alcança, dito", () => {
  test("a lista existe e não está vazia", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    for (const d of VIVAS_DECLARADAS) expect(d.motivo.length).toBeGreaterThanOrEqual(40);
  });
});
