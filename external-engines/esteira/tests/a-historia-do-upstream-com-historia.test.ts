/**
 * **LAB-163 (item 900) · o `upstream/` nunca foi tocado depois de criado — perguntado à história de VERDADE** (D391).
 *
 * ```sh
 * bun test tests/a-historia-do-upstream-com-historia.test.ts
 * ```
 *
 * Lê todo commit do `HEAD` e da origem desta casa e, de cada um, a árvore de cada pasta `upstream` registrada. Precisa
 * da história inteira, então mora no **verde completo**, não no portão sem clones (o CI clona raso). Com o clone raso,
 * **reprova** com a receita — não pula (D124, D293).
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

import {
  ARGUMENTOS_DO_REV_LIST,
  conferirAHistoriaDoUpstream,
  entradaDoCatFile,
  lerOCatFile,
} from "../src/a-historia-do-upstream.ts";
import { COPIAS_DE_UPSTREAM } from "../src/upstream-intocavel.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const git = (a: readonly string[], entrada?: string) =>
  execFileSync("git", a, { cwd: RAIZ, encoding: "utf8", maxBuffer: 1 << 28, ...(entrada ? { input: entrada } : {}) });

describe("LAB-163 · nenhuma árvore do `upstream/` que não seja a registrada, em commit nenhum", () => {
  test("nenhum problema — e o universo é publicado", () => {
    const rasa = git(["rev-parse", "--is-shallow-repository"]).trim() === "true";
    const commits = git(ARGUMENTOS_DO_REV_LIST).split("\n").filter((l) => l.trim() !== "");
    const historias = COPIAS_DE_UPSTREAM.map((copia) => ({
      pasta: copia.pasta,
      commits: lerOCatFile(commits, git(["cat-file", "--batch-check"], entradaDoCatFile(commits, copia.pasta))),
    }));
    const r = conferirAHistoriaDoUpstream({ rasa, historias });
    for (const u of r.universo) {
      console.log(`    ${u.pasta}: ${u.commits} commit(s) lido(s), ${u.comAPasta} com a pasta, ${u.arvores} árvore(s)`);
    }
    expect(r.problemas).toEqual([]);
    // O universo de hoje, com folga: se a leitura encolher (o rev-list errado, o clone raso), o número cai aqui.
    for (const u of r.universo) {
      expect(u.commits).toBeGreaterThan(400);
      expect(u.comAPasta).toBeGreaterThan(400);
      expect(u.arvores).toBe(1);
    }
  });
});
