/**
 * **LAB-206 (item 900) · a prova do LAB-41 se refaz byte a byte com o Generate de `7eb39ce` (20/09) a `db31559`
 * (14/10) — uma janela FECHADA, com o instante dentro** (D434).
 *
 * ```sh
 * bun test tests/retrato-do-lab41.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as duas árvores (o Lab em `d817176`, o Generate na história dele) e
 * roda **a ferramenta do Lab de então**: no começo, no instante (a ponta da origem às 17h45 UTC de 04/10) e no fim
 * da janela tem de refazer a prova byte a byte; nas duas bordas tem de rodar e acusar — os dentes, que são commits
 * de verdade do Generate. O motivo inteiro está no cabeçalho de `src/retrato-do-lab41.ts`. A prova não se toca
 * (D182).
 *
 * **Precisa do clone vizinho `../urban-create-hub-41d93a4d`, com a história inteira**, e por isso NÃO está no
 * portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). O vizinho só é lido.
 * Cada rodada leva de 25 a 60 segundos; são cinco.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { A_FERRAMENTA, A_JANELA_DO_GENERATE, A_PROVA, OS_COMMITS_RODADOS, O_RETRATO_DO_LAB41 } from "../src/retrato-do-lab41.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const TESTFIT = join(RAIZ, "external-engines", "testfit");
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  "urban-create-hub-41d93a4d": join(RAIZ, "..", "urban-create-hub-41d93a4d"),
};
const MINUTOS = 60_000;
const curto = (c: string) => c.slice(0, 7);
const LAB = O_RETRATO_DO_LAB41[0]!;
const G = A_JANELA_DO_GENERATE;

describe("LAB-206 · o retrato escrito", () => {
  test("o Lab tem um commit; a janela do Generate tem as duas bordas e o instante dentro, e as contas somam", () => {
    expect(O_RETRATO_DO_LAB41.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    for (const c of [LAB.commit, G.primeiro, G.ultimo, G.antes, G.depois, G.oDoInstante]) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(new Set([G.primeiro, G.ultimo, G.antes, G.depois, G.oDoInstante]).size).toBe(5);
    expect(G.oInstanteEstaDentro).toBe(true);
    const e = OS_COMMITS_RODADOS.generate;
    expect(e.naoRodam + e.acusamAntes + e.refazem + e.acusamDepois).toBe(e.commits);
    expect(e.commits - e.naoRodamPelaArvore).toBe(e.rodadosPelaFerramenta);
    expect(e.refazem).toBeGreaterThan(0);
  });

  test("o commit do Lab é o único da prova e da ferramenta, e a prova cala o Generate", () => {
    for (const p of [join("docs", "provas", A_PROVA), A_FERRAMENTA]) {
      const daHistoria = execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", p], { encoding: "utf8" }).trim().split("\n");
      expect(daHistoria, p).toEqual([LAB.commit]);
    }
    const texto = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    for (const c of [G.primeiro, G.ultimo, G.antes, G.depois, G.oDoInstante]) expect(texto).not.toContain(curto(c));
  });

  test("o instante é mesmo a ponta da origem do Generate na hora da prova, e a janela está na ordem da história", () => {
    const origem = ORIGEM["urban-create-hub-41d93a4d"]!;
    if (!existsSync(origem)) throw new Error(`o clone do Generate não está em ${origem}`);
    const hora = execFileSync("git", ["-C", RAIZ, "show", "-s", "--format=%cI", LAB.commit], { encoding: "utf8" }).trim();
    const ponta = execFileSync("git", ["-C", origem, "rev-list", "-1", "--first-parent", `--before=${hora}`, "origin/main"], { encoding: "utf8" }).trim();
    expect(ponta, `a ponta da origem às ${hora} não é a escrita`).toBe(G.oDoInstante);
    const ancestral = (a: string, b: string) => spawnSync("git", ["-C", origem, "merge-base", "--is-ancestor", a, b]).status === 0;
    for (const [a, b] of [
      [G.antes, G.primeiro],
      [G.primeiro, G.oDoInstante],
      [G.oDoInstante, G.ultimo],
      [G.ultimo, G.depois],
    ] as const)
      expect(ancestral(a, b), `${curto(a)} não vem antes de ${curto(b)}`).toBe(true);
  });
});

describe("LAB-206 · a janela, perguntada à ferramenta", () => {
  let pasta = "";
  const arv = (nome: string) => join(pasta, nome);
  const lab = () => arv("archilly-lab");

  /** Roda a ferramenta de então com o Generate no commit dado e diz se ela rodou e se a prova saiu igual, byte a byte. */
  function rodarCom(g: string): { rodou: boolean; igual: boolean } {
    execFileSync("git", ["-C", arv("urban-create-hub-41d93a4d"), "checkout", "-q", "-f", g]);
    execFileSync("git", ["-C", arv("urban-create-hub-41d93a4d"), "clean", "-q", "-fd"]);
    execFileSync("git", ["-C", lab(), "checkout", "-q", "--", join("docs", "provas", A_PROVA)]);
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const rodou = r.status === 0;
    const igual = rodou && spawnSync("git", ["-C", lab(), "diff", "--quiet", "--", join("docs", "provas", A_PROVA)]).status === 0;
    console.log(
      `    [retrato-do-lab41] Lab ${curto(LAB.commit)} · Generate ${curto(g)} · ${rodou ? (igual ? "a prova igual, byte a byte" : "a prova difere") : "a ferramenta não rodou"}`,
    );
    return { rodou, igual };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab41-retrato-"));
    const montar = (nome: string, commit: string, outros: string[]) => {
      const origem = ORIGEM[nome]!;
      if (!existsSync(origem)) throw new Error(`o clone ${nome} não está em ${origem} — clone-o só para leitura, com a história inteira`);
      execFileSync("git", ["clone", "-q", "--no-checkout", origem, arv(nome)]);
      for (const c of [commit, ...outros])
        if (spawnSync("git", ["-C", arv(nome), "cat-file", "-e", `${c}^{commit}`]).status !== 0)
          throw new Error(`o commit ${c} não está na história de ${origem} — desrase-o: git -C ${origem} fetch --unshallow origin`);
      execFileSync("git", ["-C", arv(nome), "checkout", "-q", commit]);
    };
    montar("archilly-lab", LAB.commit, []);
    montar("urban-create-hub-41d93a4d", G.oDoInstante, [G.primeiro, G.ultimo, G.antes, G.depois]);
    // As dependências de hoje, e o zod que o Generate importa, na node_modules dele (o git de lá a ignora).
    symlinkSync(join(ESTEIRA, "node_modules"), join(lab(), "external-engines", "esteira", "node_modules"));
    if (existsSync(join(TESTFIT, "node_modules")))
      symlinkSync(join(TESTFIT, "node_modules"), join(lab(), "external-engines", "testfit", "node_modules"));
    cpSync(join(ESTEIRA, "node_modules", "zod"), join(arv("urban-create-hub-41d93a4d"), "node_modules", "zod"), { recursive: true });
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "no começo, no instante e no fim da janela a ferramenta de então refaz a prova byte a byte",
    () => {
      for (const g of [G.primeiro, G.oDoInstante, G.ultimo])
        expect(
          rodarCom(g),
          `com o Generate em ${curto(g)} a ferramenta não refaz mais a prova: a janela está errada (D182: explica-se, não se regrava)`,
        ).toEqual({ rodou: true, igual: true });
    },
    20 * MINUTOS,
  );

  test(
    "nas duas bordas a ferramenta de então roda e acusa — os dentes, em commits de verdade",
    () => {
      expect(rodarCom(G.antes), `o Generate em ${curto(G.antes)}: ${G.oQueDaAntes}`).toEqual({ rodou: true, igual: false });
      expect(rodarCom(G.depois), `o Generate em ${curto(G.depois)}: ${G.oQueDaDepois}`).toEqual({ rodou: true, igual: false });
    },
    20 * MINUTOS,
  );
});
