/**
 * **LAB-163 (item 900) · o `upstream/` nunca foi tocado depois de criado — perguntado à história** (D391).
 *
 * ```sh
 * bun test tests/a-historia-do-upstream.test.ts
 * ```
 *
 * A linha do `docs/SEGURANCA.md` (LF-FINAL-2) era um `git log` rodado uma vez. O motivo inteiro, com a medição, está no
 * cabeçalho de `src/a-historia-do-upstream.ts`.
 *
 * Roda **sem clones e sem história** (lê só a página e histórias plantadas) e por isso está no portão sem clones do
 * `verde.yml`. A pergunta à história de verdade mora em `a-historia-do-upstream-com-historia.test.ts`, no verde
 * completo: o CI clona raso, e no raso a resposta seria o corte do clone (D293).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_LINHA,
  ARGUMENTOS_DO_REV_LIST,
  ARVORES_QUE_JA_FORAM,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirAHistoriaDoUpstream,
  entradaDoCatFile,
  lerOCatFile,
  type ArvoreNoCommit,
} from "../src/a-historia-do-upstream.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";
import { COPIAS_DE_UPSTREAM } from "../src/upstream-intocavel.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const PASTA = "external-engines/symbios/upstream";
const BOA = "a".repeat(40);
const PATCH = "b".repeat(40);
const VELHA = "c".repeat(40);
const REGISTRO = [{ pasta: PASTA, arvore: BOA, trazidaEm: "1111111", motivo: "a cópia plantada" }];

const c = (hash: string, arvore: string | null): ArvoreNoCommit => ({ hash: hash.padEnd(40, "0"), arvore });
// A história boa, do mais novo ao mais velho, como o `rev-list` a dá: trabalho, a mescla, a cópia, a raiz sem a pasta.
const BOA_HISTORIA = [c("4444444", BOA), c("3333333", BOA), c("1111111", BOA), c("0000000", null)];

const tipos = (commits: ArvoreNoCommit[], extra: { rasa?: boolean; jaForam?: { pasta: string; arvore: string }[] } = {}) =>
  conferirAHistoriaDoUpstream({
    rasa: extra.rasa ?? false,
    historias: [{ pasta: PASTA, commits }],
    registro: REGISTRO,
    jaForam: extra.jaForam ?? [],
  }).problemas.map((p) => p.tipo);

describe("LAB-163 · a linha da página, e o que a régua diz de si", () => {
  test("o `docs/SEGURANCA.md` escreve a linha e aponta para esta régua", () => {
    const pagina = readFileSync(join(RAIZ, "docs", "SEGURANCA.md"), "utf8");
    expect(aRegraEstaEscrita(pagina, A_LINHA)).toBe(true);
    const linha = pagina.split("\n").find((l) => l.includes("nunca foi tocado depois de criado"));
    expect(linha).toBeDefined();
    expect(linha).toContain(O_PONTEIRO);
  });

  test("o que ela não alcança está dito, e inclui a origem e a história reescrita", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    expect(O_QUE_ISTO_NAO_ALCANCA.join(" ")).toContain("ORIGEM");
    expect(O_QUE_ISTO_NAO_ALCANCA.join(" ")).toContain("reescrita");
  });

  test("hoje nenhuma árvore anterior está declarada — a cópia é a do LAB-00", () => {
    expect(ARVORES_QUE_JA_FORAM).toEqual([]);
    expect(COPIAS_DE_UPSTREAM.map((x) => x.pasta)).toEqual([PASTA]);
  });

  test("a leitura pede o HEAD e a origem", () => {
    expect(ARGUMENTOS_DO_REV_LIST).toEqual(["rev-list", "HEAD", "--remotes=origin"]);
  });
});

describe("LAB-163 · a leitura do `git cat-file`", () => {
  test("a entrada é uma linha `<commit>:<pasta>` por commit", () => {
    expect(entradaDoCatFile(["x1", "x2"], PASTA)).toBe(`x1:${PASTA}\nx2:${PASTA}\n`);
  });

  test("árvore e ausência, na mesma ordem dos commits", () => {
    const saida = `${BOA} tree 512\nx2:${PASTA} missing\n`;
    expect(lerOCatFile(["x1", "x2"], saida)).toEqual([
      { hash: "x1", arvore: BOA },
      { hash: "x2", arvore: null },
    ]);
  });

  test("número de linhas que não bate é erro, não silêncio", () => {
    expect(() => lerOCatFile(["x1", "x2"], `${BOA} tree 512\n`)).toThrow();
  });

  test("a pasta que virou arquivo é erro, não árvore", () => {
    expect(() => lerOCatFile(["x1"], `${BOA} blob 12\n`)).toThrow();
  });
});

describe("LAB-163 · os dois lados de cada regra", () => {
  test("a história boa passa — e o universo é contado", () => {
    const r = conferirAHistoriaDoUpstream({ rasa: false, historias: [{ pasta: PASTA, commits: BOA_HISTORIA }], registro: REGISTRO, jaForam: [] });
    expect(r.problemas).toEqual([]);
    expect(r.universo).toEqual([{ pasta: PASTA, commits: 4, comAPasta: 3, arvores: 1 }]);
  });

  test("o patch commitado e DESFEITO depois reprova — o HEAD está igual, e é isso que o LAB-132 não via", () => {
    const desfeito = [c("6666666", BOA), c("5555555", PATCH), ...BOA_HISTORIA];
    expect(tipos(desfeito)).toEqual(["arvore-que-nunca-foi-registrada"]);
  });

  test("o patch num ramo da origem, nunca mesclado, também reprova", () => {
    expect(tipos([...BOA_HISTORIA, c("7777777", PATCH)])).toEqual(["arvore-que-nunca-foi-registrada"]);
  });

  test("a pasta apagada e trazida de volta é ausência, não patch — passa", () => {
    expect(tipos([c("6666666", BOA), c("5555555", null), ...BOA_HISTORIA])).toEqual([]);
  });

  test("a troca DECLARADA da cópia passa; sem a declaração, reprova", () => {
    const trocada = [c("4444444", BOA), c("1111111", BOA), c("2222222", VELHA), c("0000000", null)];
    expect(tipos(trocada, { jaForam: [{ pasta: PASTA, arvore: VELHA }] })).toEqual([]);
    expect(tipos(trocada)).toEqual(["arvore-que-nunca-foi-registrada"]);
  });

  test("a declaração que não aparece em commit nenhum sobra", () => {
    expect(tipos(BOA_HISTORIA, { jaForam: [{ pasta: PASTA, arvore: VELHA }] })).toEqual(["declaracao-que-sobra"]);
  });

  test("o commit que trouxe a cópia, ausente ou com outra árvore, reprova", () => {
    expect(tipos([c("4444444", BOA), c("0000000", null)])).toEqual(["trazida-em-que-nao-confere"]);
    expect(tipos([c("4444444", BOA), c("1111111", null)])).toEqual(["trazida-em-que-nao-confere"]);
  });

  test("a história rasa reprova", () => {
    expect(tipos(BOA_HISTORIA, { rasa: true })).toEqual(["historia-rasa"]);
  });

  test("nenhum commit com a pasta é universo vazio, não verde", () => {
    expect(tipos([c("0000000", null)])).toContain("universo-vazio");
    expect(tipos([])).toContain("universo-vazio");
  });
});
