/**
 * **LAB-196 (item 900) · a fotografia do LAB-60 se retira no commit que ela declara** (D424).
 *
 * ```sh
 * bun test tests/fotografia-no-commit-declarado.test.ts
 * ```
 *
 * Roda `ferramentas/lab60.ts` **de verdade**, duas vezes, gravando numa pasta temporária: uma num clone
 * local do motor posto no commit que a prova declara (tem de dar a prova, fora o momento), outra no clone
 * vizinho como está (tem de dar OUTRA coisa — senão o motivo de a prova ser fotografia ficou falso). O
 * motivo inteiro está no cabeçalho de `src/fotografia-no-commit-declarado.ts`.
 *
 * **Precisa do clone vizinho `../motor-testfit`, com a história inteira**, e por isso NÃO está no portão
 * sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). O vizinho só é lido —
 * o clone no commit declarado é feito numa pasta temporária, e a ferramenta confere o `git status` dos três.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  A_FERRAMENTA,
  A_PROVA,
  AS_CHAVES_DO_MOMENTO,
  compararSemOMomento,
  oCommitDeclarado,
} from "../src/fotografia-no-commit-declarado.ts";
import { AS_ESPECIES } from "../src/regerar-a-varredura.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const VIZINHO = join(RAIZ, "..", "motor-testfit");
const prova = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as Record<string, unknown>;

/** Roda a ferramenta contra `motor`, gravando numa pasta temporária, e devolve a prova que ela gravou. */
function retirar(motor: string): Record<string, unknown> {
  const saida = mkdtempSync(join(tmpdir(), "lab60-saida-"));
  try {
    const r = spawnSync("bun", [join(RAIZ, A_FERRAMENTA), "--motor", motor, "--saida", saida], {
      cwd: join(RAIZ, "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    if (r.status !== 0) throw new Error(`a ferramenta não rodou (${r.status}): ${r.stderr}`);
    return JSON.parse(readFileSync(join(saida, "configuracao-do-motor.json"), "utf8")) as Record<string, unknown>;
  } finally {
    rmSync(saida, { recursive: true, force: true });
  }
}

describe("LAB-196 · a comparação sem o momento, nos dois lados", () => {
  const BOM = { prompt: "LAB-60", quando: "2026-10-07T12:25:10.255Z", escopo: { arquivos: 369 }, osClonesVizinhos: [1] };

  test("o caso bom: a mesma saída passa", () => {
    expect(compararSemOMomento(BOM, { ...BOM })).toEqual([]);
  });

  test("o caso que quase parece inválido: outra hora e outros clones não são outra medição", () => {
    expect(compararSemOMomento(BOM, { ...BOM, quando: "2026-10-19T00:00:00.000Z", osClonesVizinhos: [] })).toEqual([]);
    expect([...AS_CHAVES_DO_MOMENTO]).toEqual(["quando", "osClonesVizinhos"]);
  });

  test("o caso ruim: um número do escopo, dito pela chave", () => {
    expect(compararSemOMomento(BOM, { ...BOM, escopo: { arquivos: 616 } })).toEqual([{ chave: "escopo", tipo: "difere" }]);
  });

  test("o caso ruim nos dois sentidos: a chave que só a prova tem, e a que só a retirada tem", () => {
    const semEscopo = { prompt: BOM.prompt, quando: BOM.quando, osClonesVizinhos: BOM.osClonesVizinhos };
    expect(compararSemOMomento(BOM, semEscopo)).toEqual([{ chave: "escopo", tipo: "so-na-prova" }]);
    expect(compararSemOMomento(semEscopo, BOM)).toEqual([{ chave: "escopo", tipo: "so-na-retirada" }]);
  });

  test("o commit declarado se lê da prova, e só se tiver as quarenta casas", () => {
    expect(oCommitDeclarado(prova)).toBe("4181e95af4256b4c477a5ddcb19ee2aea7aaeaae");
    expect(oCommitDeclarado({ oClone: { head: "4181e95" } })).toBeNull();
    expect(oCommitDeclarado({})).toBeNull();
  });

  test("a prova segue na lista como fotografia — esta trava não a muda de espécie", () => {
    expect(AS_ESPECIES.find((e) => e.prova === A_PROVA)?.especie).toBe("fotografia");
  });
});

describe("LAB-196 · a fotografia do LAB-60, retirada pela ferramenta", () => {
  const declarado = oCommitDeclarado(prova);

  test("no commit que ela declara, a ferramenta de hoje grava a prova — fora o momento", () => {
    expect(existsSync(VIZINHO), `o clone vizinho não está em ${VIZINHO} — clone-o só para leitura, com a história inteira`).toBe(true);
    expect(declarado).not.toBeNull();
    const motor = mkdtempSync(join(tmpdir(), "lab60-motor-"));
    try {
      execFileSync("git", ["clone", "-q", "--no-checkout", VIZINHO, motor]);
      const temOCommit = spawnSync("git", ["-C", motor, "cat-file", "-e", `${declarado}^{commit}`]).status === 0;
      expect(
        temOCommit,
        `o commit ${declarado} não está na história do clone vizinho — desrase-o: git -C ../motor-testfit fetch --unshallow origin`,
      ).toBe(true);
      execFileSync("git", ["-C", motor, "checkout", "-q", declarado!]);
      const retirada = retirar(motor);
      const escopo = retirada["escopo"] as Record<string, number>;
      console.log(
        `    [fotografia-no-commit-declarado] motor em ${declarado!.slice(0, 7)} · ${escopo["arquivosQueOGitDeleCarrega"]} arquivos · ` +
          `${Object.keys(retirada).length - AS_CHAVES_DO_MOMENTO.length} chaves comparadas`,
      );
      expect(
        compararSemOMomento(prova, retirada),
        "a ferramenta, no commit declarado, não grava mais a prova: a régua mudou o que mede, e isto se explica num relatório — não se regera a fotografia (D182)",
      ).toEqual([]);
    } finally {
      rmSync(motor, { recursive: true, force: true });
    }
  });

  test("na ponta de hoje do motor ela mede OUTRA coisa — o motivo de ser fotografia, perguntado", () => {
    const hoje = execFileSync("git", ["-C", VIZINHO, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const diferencas = compararSemOMomento(prova, retirar(VIZINHO));
    console.log(
      `    [fotografia-no-commit-declarado] motor em ${hoje.slice(0, 7)} · ${diferencas.length} chaves diferentes da prova`,
    );
    if (hoje === declarado) return; // o vizinho no commit declarado: não há "motor andado" para perguntar
    expect(
      diferencas.length,
      "com o motor andado a ferramenta grava a MESMA prova: o motivo da lista (\"recontar com o motor andado mede outra coisa\") ficou falso, e a fotografia deixou de precisar ser fotografia",
    ).toBeGreaterThan(0);
  });
});
