#!/usr/bin/env bun
/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-171 · item 900 — a triagem do PackingSolver, medida contra a ORIGEM dele.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A `docs/PACKINGSOLVER_TRIAGEM.md` (LAB-00, 09/09/2026) afirma o commit, a data, a licença, as opções do
 * `CMakeLists.txt`, os seis tipos de problema e as opções da linha de comando de um repositório que **não está nesta
 * casa** (a triagem recusou copiá-lo para `upstream/`). Ninguém tinha voltado a ele. Esta ferramenta volta:
 *
 *   1. busca na origem **só o commit que a página fixa** (`git fetch --depth 1 <sha>`), numa pasta temporária vazia,
 *      e o **lê** com `git show`, `git ls-tree` e `git grep` — **nada é compilado nem executado**, e nada entra nesta
 *      árvore (o conteúdo de fora é dado, nunca código);
 *   2. pergunta à origem qual é o `HEAD` de hoje, e a data dele — o *"commit mais recente"* da §6 é relato datado, e o
 *      número de hoje vai ao lado dele, não no lugar;
 *   3. grava `docs/provas/LAB-171/packingsolver-na-origem.json`.
 *
 * A trava `tests/a-triagem-do-packingsolver.test.ts` lê essa prova **sem rede** e a compara com a página e com os
 * cinco lugares que repetem a ficha. Esta ferramenta é a única parte com rede, e está declarada em
 * `src/rede-em-execucao.ts` (classe *origem pública*).
 *
 * Uso: `bun run lab171`
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  COMMIT_DA_TRIAGEM,
  OPCOES_DA_CLI,
  OPCOES_DO_CMAKE,
  ORIGEM_DO_PACKINGSOLVER,
  TIPOS_DE_PROBLEMA,
  type ProvaNaOrigem,
} from "../src/a-triagem-do-packingsolver.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-171");

const pasta = mkdtempSync(join(tmpdir(), "lab171-packingsolver-"));
const git = (...args: string[]): string =>
  execFileSync("git", args, {
    cwd: pasta,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
const talvez = (...args: string[]): string | null => {
  try {
    return git(...args);
  } catch {
    return null;
  }
};

try {
  git("init", "-q");
  git("remote", "add", "origin", ORIGEM_DO_PACKINGSOLVER);
  git("fetch", "-q", "--depth", "1", "origin", COMMIT_DA_TRIAGEM);
  const c = COMMIT_DA_TRIAGEM;

  const [sha, data, autor] = git(
    "log",
    "-1",
    "--format=%H%n%ad%n%an",
    "--date=iso",
    c,
  )
    .trim()
    .split("\n");
  const licenca = talvez("show", `${c}:LICENSE`);
  const cmake = talvez("show", `${c}:CMakeLists.txt`);
  const pastasDoSrc = git("ls-tree", "--name-only", c, "src/")
    .split("\n")
    .filter(Boolean)
    .map((p) => p.replace(/^src\//, ""));
  // O arquivo que some vira `null` em cada campo que dependia dele — nunca `false`, que pareceria medido (D23).
  const mainCli = talvez("show", `${c}:src/rectangleguillotine/main.cpp`);

  const opcaoDoCmake = (nome: string): "ON" | "OFF" | null => {
    if (cmake === null) return null;
    const m = new RegExp(`option\\(${nome}\\s+"[^"]*"\\s+(ON|OFF)\\)`).exec(
      cmake,
    );
    return m ? (m[1] as "ON" | "OFF") : null;
  };

  const head = git("ls-remote", "origin", "HEAD").trim().split(/\s+/)[0]!;
  git("fetch", "-q", "--depth", "1", "origin", head);
  const dataDoHead = git(
    "log",
    "-1",
    "--format=%ad",
    "--date=iso",
    head,
  ).trim();

  const prova: ProvaNaOrigem = {
    prompt: "LAB-171",
    oQueIstoMede:
      "o repositório de fora que a docs/PACKINGSOLVER_TRIAGEM.md descreve, no commit que ela fixa — lido com git show/ls-tree, nada compilado nem executado; não mede gleba",
    quando: new Date().toISOString(),
    origem: ORIGEM_DO_PACKINGSOLVER,
    commit: {
      pedido: COMMIT_DA_TRIAGEM,
      existe: sha === COMMIT_DA_TRIAGEM,
      data: data ?? null,
      autor: autor ?? null,
    },
    licenca:
      licenca === null
        ? null
        : {
            primeiraLinha: licenca.split("\n")[0]!.trim(),
            direitos:
              licenca
                .split("\n")
                .find((l) => /^Copyright/.test(l))
                ?.trim() ?? null,
          },
    cmake: Object.fromEntries(OPCOES_DO_CMAKE.map((o) => [o, opcaoDoCmake(o)])),
    tiposDeProblema: Object.fromEntries(
      TIPOS_DE_PROBLEMA.map((t) => [t, pastasDoSrc.includes(t)]),
    ),
    pastasDoSrc,
    opcoesDaCli: Object.fromEntries(
      OPCOES_DA_CLI.map((o) => [
        o,
        mainCli === null ? null : mainCli.includes(`"${o}`),
      ]),
    ),
    certificadoNaCli: mainCli === null ? null : /certificate/.test(mainCli),
    headDeHoje: { sha: head, data: dataDoHead },
  };

  mkdirSync(PROVA, { recursive: true });
  writeFileSync(
    join(PROVA, "packingsolver-na-origem.json"),
    JSON.stringify(prova, null, 2) + "\n",
  );
  console.log(JSON.stringify(prova, null, 2));
} finally {
  rmSync(pasta, { recursive: true, force: true });
}
