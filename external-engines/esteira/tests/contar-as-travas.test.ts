/**
 * **LAB-98 (item 900) · o número de travas do portão sem clones, RECONTADO por execução.**
 *
 * ```sh
 * bun test tests/contar-as-travas.test.ts
 * ```
 *
 * A trava do LAB-93 (D311) confere as quatro cópias escritas contra a prova do LAB-84 — e a
 * prova do LAB-84 é medida à mão. Em 13/10/2026 as cinco diziam **698** e a suíte rodada dizia
 * **719**: o LAB-96 e o LAB-97 puseram 21 travas na lista e ninguém rodou `bun run lab84`. Esta
 * trava roda a lista e reconta (D325).
 *
 * **Ela NÃO entra na lista do `guardas-sem-clones`, de propósito:** rodar a lista de dentro de
 * um arquivo da lista é a lista se rodando a si mesma, sem fim. Ela roda no verde completo
 * (`conferir.sh`), que é onde o número é escrito e commitado.
 */
import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { conferirAContagem, lerARodada } from "../src/contar-as-travas.ts";
import { TRABALHO_SEM_CLONES, arquivosDoTrabalho } from "../src/nome-do-trabalho.ts";

const ESTEIRA = join(import.meta.dirname, "..");
const RAIZ = join(ESTEIRA, "..", "..");
const ler = (p: string): string => readFileSync(join(RAIZ, p), "utf8");

/** A MESMA função que a ferramenta do LAB-84 usa para achar a lista (D231). */
const lista = arquivosDoTrabalho(ler(".github/workflows/verde.yml"), TRABALHO_SEM_CLONES);

/** As cópias escritas à mão, pela MESMA frase que a trava do LAB-42 casa. */
function escritosAMao(): Record<string, number | null> {
  const r: Record<string, number | null> = {};
  for (const arquivo of ["CLAUDE.md", "docs/ONDE_PARAMOS.md", "docs/prompts/FILA.md", ".github/workflows/verde.yml"]) {
    const ns = [...ler(arquivo).matchAll(/(\d+) travas que (?:leem arquivo do próprio repositório|não)/g)];
    // Mais de uma ou nenhuma é `null`: a trava do LAB-42 já cobra "exatamente uma", e aqui
    // ausência não pode virar aprovação.
    r[arquivo] = ns.length === 1 ? Number(ns[0]![1]) : null;
  }
  const y = ler(".github/workflows/verde.yml");
  const daReceita = [...y.matchAll(/(\d+) travas; e o verde completo/g)];
  r[".github/workflows/verde.yml (a receita impressa)"] = daReceita.length === 1 ? Number(daReceita[0]![1]) : null;
  const prova = JSON.parse(ler("docs/provas/LAB-84/as-trinta-por-execucao.json")) as {
    quantasTravasNaLista: number | null;
  };
  r["docs/provas/LAB-84/as-trinta-por-execucao.json"] = prova.quantasTravasNaLista;
  return r;
}

describe("LAB-98 · a leitura da rodada — `null` quando a linha não veio, nunca zero", () => {
  test("lê a linha do resumo, e a ÚLTIMA vale", () => {
    const saida = "Ran 3 tests across 1 file.\n...\n 719 pass\n 0 fail\nRan 719 tests across 42 files. [8.55s]\n";
    expect(lerARodada(saida)).toEqual({ travas: 719, arquivos: 42 });
  });

  test("singular também — um arquivo com uma trava", () => {
    expect(lerARodada("Ran 1 test across 1 file. [5ms]")).toEqual({ travas: 1, arquivos: 1 });
  });

  test("sem a linha, `null` — rodada que estourou antes de contar não tem zero travas (D23)", () => {
    expect(lerARodada("error: Cannot find module\n")).toBeNull();
    expect(lerARodada("")).toBeNull();
  });
});

describe("LAB-98 · a comparação — os dois lados demonstrados", () => {
  test("O LADO BOM: tudo igual ao contado não acusa nada", () => {
    expect(conferirAContagem(719, { a: 719, b: 719 })).toEqual([]);
  });

  test("O LADO RUIM: o defeito de 13/10 reproduzido — 698 escrito, 719 contado, nomeando o lugar", () => {
    expect(conferirAContagem(719, { "CLAUDE.md": 698, prova: 719 })).toEqual([
      { onde: "CLAUDE.md", escrito: 698, contado: 719 },
    ]);
  });

  test("escrito `null` REPROVA — prova sem a soma não aprova por silêncio", () => {
    expect(conferirAContagem(719, { prova: null })).toHaveLength(1);
  });
});

describe("LAB-98 · o número do portão sem clones, RECONTADO por execução", () => {
  test(
    "a lista RODADA conta o mesmo número que as cinco cópias escritas e a prova do LAB-84",
    () => {
      expect(lista.length, "não achei a lista do trabalho no workflow").toBeGreaterThan(0);
      expect(lista, "esta trava não pode estar na lista que ela roda").not.toContain(
        "tests/contar-as-travas.test.ts",
      );

      const r = spawnSync("bun", ["test", ...lista], {
        cwd: ESTEIRA,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 64 * 1024 * 1024,
      });
      const rodada = lerARodada(`${r.stdout ?? ""}${r.stderr ?? ""}`);
      expect(rodada, "o `bun test` da lista não imprimiu o resumo — a contagem não aconteceu").not.toBeNull();

      // O universo lido se publica: rodar menos arquivos que a lista é contar outra coisa.
      expect(rodada!.arquivos, `a rodada leu ${rodada!.arquivos} arquivos e a lista tem ${lista.length}`).toBe(
        lista.length,
      );

      const desacordos = conferirAContagem(rodada!.travas, escritosAMao());
      expect(
        desacordos.map((d) => `${d.onde}: escrito ${d.escrito}, contado ${d.contado}`),
        "o número de travas do portão envelheceu — rode `bun run lab84` (refaz a prova) e corrija " +
          "as cópias escritas para o número contado",
      ).toEqual([]);
    },
    180_000,
  );
});
