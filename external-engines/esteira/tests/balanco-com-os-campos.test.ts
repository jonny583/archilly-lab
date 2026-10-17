/**
 * **LAB-150 (item 900) · o balanço vai ao arquivo com data, origem, conteúdo e prova** (D378).
 *
 * ```sh
 * bun test tests/balanco-com-os-campos.test.ts
 * ```
 *
 * O `CLAUDE.md` §1-B manda o balanço ao `BALANCOS.md` *"com data, origem, conteúdo e prova"*, e a guarda do LAB-42
 * perguntava só a três das onze entradas, por dois dos campos. O motivo inteiro, com as entradas contadas, está no
 * cabeçalho de `src/balanco-com-os-campos.ts`.
 *
 * Roda **sem clones** (lê o `BALANCOS.md` e o `CLAUDE.md` desta casa), e por isso está no portão sem clones do
 * `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  DIA_DA_TRAVA,
  FALTAVA_ANTES_DA_TRAVA,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirOsCamposDoBalanco,
  entradasDoBalanco,
  type Congelada,
} from "../src/balanco-com-os-campos.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const BALANCOS = join(RAIZ, "docs", "relatorios", "BALANCOS.md");

const COMPLETA = (n: string, data: string) =>
  `## ${n} · O saldo de uma fila — ${data}\n\n| | |\n|---|---|\n| **origem** | o chat |\n| **o que continha** | três prompts |\n| **o que produziu** | três PRs |\n| **onde está a prova** | docs/provas/X/ |\n\n### Os números\n\ntexto.\n`;

const tipos = (texto: string, congeladas: Record<string, Congelada> = {}) =>
  conferirOsCamposDoBalanco(texto, congeladas).problemas.map((p) => `${p.onde.replace(/^BALANCOS\.md:\d+ /, "")} ${p.tipo}`);

describe("LAB-150 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §1-B diz com data, origem, conteúdo e prova", () => {
    const claude = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    expect(aRegraEstaEscrita(claude, A_REGRA)).toBe(true);
  });

  test("e o BALANCOS.md promete os cinco, que é o que a régua cobra", () => {
    const t = readFileSync(BALANCOS, "utf8");
    for (const c of ["**data**", "**origem**", "**o que ele continha**", "**o que ele produziu**", "**onde está a prova**"])
      expect(t, `o BALANCOS.md deixou de prometer ${c}`).toContain(c);
  });
});

describe("LAB-150 · o BALANCOS.md de verdade", () => {
  const r = conferirOsCamposDoBalanco(readFileSync(BALANCOS, "utf8"));

  test("nenhum problema — toda entrada traz os campos, ou está congelada com o que falta e o motivo", () => {
    expect(r.problemas).toEqual([]);
  });

  test("o universo medido: onze entradas, duas completas (§7 e §8), nove congeladas", () => {
    expect(r.entradas.map((e) => e.numero)).toEqual(["1.1", "1.2", "1.3", "3", "4", "5", "6", "7", "8", "9", "10"]);
    expect(r.completas).toBe(2);
    expect(Object.keys(FALTAVA_ANTES_DA_TRAVA)).toHaveLength(9);
  });

  test("o índice do §2 não é entrada: não tem data no título", () => {
    expect(r.entradas.some((e) => e.numero === "2")).toBe(false);
  });

  test("nenhuma congelada é de depois do dia da trava", () => {
    for (const e of r.entradas.filter((x) => x.numero in FALTAVA_ANTES_DA_TRAVA))
      expect(e.data! <= DIA_DA_TRAVA, `§${e.numero}`).toBe(true);
  });

  test("o que ela não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-150 · o lado bom", () => {
  test("uma entrada completa passa, e o subtítulo dela não vira entrada", () => {
    expect(tipos(COMPLETA("11", "20/10/2026"))).toEqual([]);
    expect(entradasDoBalanco(COMPLETA("11", "20/10/2026"))).toHaveLength(1);
  });

  test("as duas escritas da casa: 'o que ele continha' e 'o que continha ao fim'", () => {
    const t = COMPLETA("11", "20/10/2026").replace("**o que continha**", "**o que continha ao fim**");
    expect(tipos(t)).toEqual([]);
    expect(tipos(COMPLETA("11", "20/10/2026").replace("**o que produziu**", "**o que ele produziu**"))).toEqual([]);
  });

  test("a entrada do §1, com três níveis de número", () => {
    expect(tipos(COMPLETA("1.4", "20/10/2026").replace(/^## /, "### "))).toEqual([]);
  });

  test("título dentro de bloco de código não é entrada", () => {
    const t = COMPLETA("11", "20/10/2026") + "\n```\n## 12 · falso — 21/10/2026\n```\n";
    expect(tipos(t)).toEqual([]);
  });

  test("título sem data (o índice) não é entrada", () => {
    expect(entradasDoBalanco("## 2 · Índice dos balanços\n\n| **origem** | x |\n")).toEqual([]);
  });
});

describe("LAB-150 · o lado ruim, plantado", () => {
  for (const campo of ["origem", "o que continha", "o que produziu", "onde está a prova"]) {
    test(`sem '${campo}' reprova`, () => {
      const t = COMPLETA("11", "20/10/2026").replace(new RegExp(`^\\| \\*\\*${campo}\\*\\* .*\\n`, "m"), "");
      expect(tipos(t)).toEqual(["(§11) campo-faltando"]);
    });
  }

  test("entrada sem tabela de campos reprova", () => {
    expect(tipos("## 11 · O saldo — 20/10/2026\n\nprosa.\n")).toEqual(["(§11) campo-faltando"]);
  });

  test("o campo abaixo do primeiro subtítulo não conta: tabela de conteúdo não é tabela de campos", () => {
    const t = "## 11 · O saldo — 20/10/2026\n\n### Os números\n\n| **origem** | x |\n| **o que continha** | x |\n| **o que produziu** | x |\n| **onde está a prova** | x |\n";
    expect(tipos(t)).toEqual(["(§11) campo-faltando"]);
  });

  test("data que não existe reprova", () => {
    expect(tipos(COMPLETA("11", "31/02/2026"))).toEqual(["(§11) data-que-nao-existe"]);
  });

  test("congelar balanço de depois da trava reprova", () => {
    const t = "## 11 · O saldo — 20/10/2026\n\nprosa.\n";
    const c = { "11": { faltam: ["origem", "conteudo", "produziu", "prova"], motivo: "x".repeat(50) } } as const;
    expect(tipos(t, c)).toEqual(["(§11) excecao-depois-da-trava"]);
  });

  test("a congelada que perde mais um campo reprova", () => {
    const t = COMPLETA("6", "07/10/2026").replace(/^\| \*\*onde está a prova\*\* .*\n/m, "").replace(/^\| \*\*origem\*\* .*\n/m, "");
    expect(tipos(t, { "6": { faltam: ["prova"], motivo: "x".repeat(50) } })).toEqual(["(§6) campo-faltando"]);
  });

  test("a declaração que sobra, nos dois jeitos: a entrada sumiu, ou o campo apareceu", () => {
    const t = COMPLETA("6", "07/10/2026");
    expect(tipos(t, { "6": { faltam: ["prova"], motivo: "x".repeat(50) } })).toEqual(["§6 declaracao-que-sobra"]);
    expect(tipos(t, { "9": { faltam: ["produziu"], motivo: "x".repeat(50) } })).toEqual(["§9 declaracao-que-sobra"]);
  });

  test("motivo curto reprova", () => {
    const t = COMPLETA("6", "07/10/2026").replace(/^\| \*\*onde está a prova\*\* .*\n/m, "");
    expect(tipos(t, { "6": { faltam: ["prova"], motivo: "curto" } })).toEqual(["§6 motivo-curto"]);
  });

  test("universo vazio reprova", () => {
    expect(tipos("# nada\n")).toEqual(["BALANCOS.md universo-vazio"]);
  });
});
