/**
 * **LAB-217 (item 900) · os registros de ATO e o código de vizinho, perguntados ao fecho a cada verde** (D445).
 *
 * ```sh
 * bun test tests/os-atos-e-o-vizinho.test.ts
 * ```
 *
 * O molde da lista de quem grava as provas dizia de todo ATO que *"por isso ele não roda código de ninguém"*. Esta
 * trava refaz a medição de `src/os-atos-e-o-vizinho.ts`: o fecho dos `import` do que cada ato rodou, **na árvore do
 * commit da prova** (tirada com `git archive` para uma pasta temporária) e na de hoje, e cobra que o motivo escrito
 * em `QUEM_GRAVA` bata com o que o fecho acha — nos dois sentidos.
 *
 * **Precisa da história inteira do Lab** (o `git archive` de commits de 04 a 08/10), e por isso NÃO está no portão
 * sem clones do `verde.yml`, que clona raso: roda no verde completo. Os vizinhos não são lidos — o fecho para no
 * caminho que sai da casa, e só o NOME do clone conta.
 */
import { afterAll, describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { QUEM_GRAVA } from "../src/o-commit-do-vizinho-na-prova.ts";
import { GENERATE, MOTOR, NAO_RODA_VIZINHO, OS_ATOS, oMotivoBate, vizinhosDoAto } from "../src/os-atos-e-o-vizinho.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PASTA = mkdtempSync(join(tmpdir(), "lab217-"));
afterAll(() => rmSync(PASTA, { recursive: true, force: true }));
const git = (...args: string[]) => execFileSync("git", ["-C", RAIZ, ...args], { encoding: "utf8" }).trim();

describe("LAB-217 · a parte pura, nos dois sentidos", () => {
  test("motivo sem vizinho: a frase nova passa; sem ela, reprova", () => {
    expect(oMotivoBate(`um ATO; ${NAO_RODA_VIZINHO}`, [])).toBeNull();
    expect(oMotivoBate("um ATO, escrito à mão", [])).toContain("não diz");
  });

  test("O LADO RUIM: motivo que nega vizinho onde o fecho acha — a frase nova E a velha reprovam", () => {
    expect(oMotivoBate(`um ATO; ${NAO_RODA_VIZINHO}`, [MOTOR])).toContain("nega");
    expect(oMotivoBate("e por isso ele não roda código de ninguém", [MOTOR, GENERATE])).toContain("nega");
  });

  test("motivo com vizinho tem de nomear CADA um — pelo clone ou pelo apelido", () => {
    expect(oMotivoBate("rodou a ferramenta, que roda o motor e o Generate", [MOTOR, GENERATE])).toBeNull();
    expect(oMotivoBate(`rodou ${MOTOR} e ${GENERATE}`, [MOTOR, GENERATE])).toBeNull();
    expect(oMotivoBate("rodou a ferramenta, que roda o motor", [MOTOR, GENERATE])).toContain(GENERATE);
  });

  test("toda linha da lista é um registro sem ferramenta em QUEM_GRAVA, e todo ATO de QUEM_GRAVA está na lista", () => {
    const nulas = QUEM_GRAVA.filter((l) => l.ferramenta === null && l.porque?.includes("ATO")).map((l) => l.prova);
    expect(OS_ATOS.map((a) => a.prova).sort()).toEqual(nulas.sort());
  });
});

describe("LAB-217 · o fecho, no commit da prova e hoje", () => {
  test(
    "cada ato alcança os vizinhos que a lista escreve — nos DOIS pontos —, e o motivo em QUEM_GRAVA bate com isso",
    () => {
      if (git("rev-parse", "--is-shallow-repository") === "true") {
        throw new Error("clone raso: `git fetch --unshallow origin` antes — o `git archive` precisa dos commits de outubro");
      }
      for (const ato of OS_ATOS) {
        const dir = join(PASTA, ato.prova.split("/")[0]!);
        const criou = git("log", "--diff-filter=A", "--format=%h", "--abbrev=7", "--", `docs/provas/${ato.prova}`).split("\n").pop();
        expect(criou, `${ato.prova}: o commit que a criou`).toBe(ato.commit);
        mkdirSync(dir, { recursive: true });
        execFileSync("sh", ["-c", `git -C "${RAIZ}" archive ${ato.commit} external-engines | tar -x -C "${dir}"`]);
        for (const a of ato.rodou) expect(existsSync(join(dir, a)), `${ato.prova}: ${a} no ${ato.commit}`).toBe(true);
        const entao = vizinhosDoAto(ato.rodou, dir);
        const hoje = vizinhosDoAto(ato.rodou, RAIZ);
        console.log(`    [os-atos-e-o-vizinho] ${ato.prova} · ${ato.commit}: ${entao.join(", ") || "nenhum"} · hoje: ${hoje.join(", ") || "nenhum"}`);
        expect(entao, `${ato.prova} no ${ato.commit}`).toEqual([...ato.vizinhos]);
        expect(hoje, `${ato.prova} hoje`).toEqual([...ato.vizinhos]);
        const motivo = QUEM_GRAVA.find((l) => l.prova === ato.prova)?.porque ?? "";
        expect(oMotivoBate(motivo, ato.vizinhos), ato.prova).toBeNull();
      }
    },
    60_000,
  );
});
