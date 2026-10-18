#!/usr/bin/env bun
/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-172 · item 900 — a análise do esqueleto reto, medida contra as ORIGENS dela.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A `docs/STRAIGHT_SKELETON_ANALYSIS.md` (LAB-00, 09/09/2026) afirma a ficha de dois repositórios que **não estão
 * nesta casa** (a análise recusou os dois por licença) e cita o `license.txt` de um pacote da CGAL. Ninguém tinha
 * voltado a eles. Esta ferramenta volta:
 *
 *   1. busca em cada origem **só o commit que a página fixa** (e, da CGAL, só a tag que o script fixa), sem os blobs
 *      (`--filter=blob:none --depth 1`), numa pasta temporária vazia, e **lê** com `git show`, `git ls-tree` e
 *      `git grep` — só o arquivo pedido desce; **nada é compilado nem executado**, e nada entra nesta árvore;
 *   2. pergunta a cada origem qual é o `HEAD` de hoje, e a data dele;
 *   3. grava `docs/provas/LAB-172/esqueleto-reto-na-origem.json`.
 *
 * A trava `tests/a-analise-do-esqueleto-reto.test.ts` lê essa prova **sem rede**. Esta ferramenta é a única parte com
 * rede, e está declarada em `src/rede-em-execucao.ts` (classe *origem pública*).
 *
 * Uso: `bun run lab172`
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  BIBLIOTECAS,
  COMMIT_A,
  COMMIT_B,
  INCLUDES,
  LICENCA_DA_CGAL,
  NOMES_DO_B,
  OPCOES_DE_COMPILACAO,
  ORIGEM_A,
  ORIGEM_B,
  ORIGEM_CGAL,
  type CommitNaOrigem,
  type ProvaNaOrigem,
} from "../src/a-analise-do-esqueleto-reto.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-172");
const pastas: string[] = [];

/** Um repositório vazio numa pasta temporária, com a origem; devolve o `git` dele e o `talvez` (o que falha é `null`). */
function abrir(origem: string) {
  const pasta = mkdtempSync(join(tmpdir(), "lab172-"));
  pastas.push(pasta);
  const git = (...args: string[]): string =>
    execFileSync("git", args, { cwd: pasta, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
  const talvez = (...args: string[]): string | null => {
    try {
      return git(...args);
    } catch {
      return null;
    }
  };
  git("init", "-q");
  git("remote", "add", "origin", origem);
  return { git, talvez };
}

function oCommit(git: (...a: string[]) => string, pedido: string): CommitNaOrigem {
  const [sha, data, autor] = git("log", "-1", "--format=%H%n%ad%n%an", "--date=iso", pedido).trim().split("\n");
  return { pedido, existe: sha === pedido, data: data ?? null, autor: autor ?? null };
}

function oHeadDeHoje(git: (...a: string[]) => string): { sha: string; data: string } {
  const sha = git("ls-remote", "origin", "HEAD").trim().split(/\s+/)[0]!;
  git("fetch", "-q", "--filter=blob:none", "--depth", "1", "origin", sha);
  return { sha, data: git("log", "-1", "--format=%ad", "--date=iso", sha).trim() };
}

try {
  // ── O candidato A: o invólucro MIT da CGAL compilada para WebAssembly.
  const a = abrir(ORIGEM_A);
  a.git("fetch", "-q", "--filter=blob:none", "--depth", "1", "origin", COMMIT_A);
  const licA = a.talvez("show", `${COMMIT_A}:LICENSE`);
  const pacoteA = a.talvez("show", `${COMMIT_A}:package.json`);
  const mainCpp = a.talvez("show", `${COMMIT_A}:src/core/main.cpp`);
  const script = a.talvez("show", `${COMMIT_A}:src/core/install_libraries.sh`);
  const cmake = a.talvez("show", `${COMMIT_A}:src/core/CMakeLists.txt`);
  const wrapper = a.talvez("show", `${COMMIT_A}:src/wrapper/index.ts`);
  const lsMain = a.talvez("ls-tree", "-l", COMMIT_A, "src/core/build/main.js");
  const candidatoA: ProvaNaOrigem["candidatoA"] = {
    origem: ORIGEM_A,
    commit: oCommit(a.git, COMMIT_A),
    versao: pacoteA === null ? null : ((JSON.parse(pacoteA) as { version?: string }).version ?? null),
    licenca:
      licA === null
        ? null
        : {
            primeiraLinha: licA.split("\n")[0]!.trim(),
            direitos: licA.split("\n").find((l) => /^Copyright/.test(l))?.trim() ?? null,
          },
    includes: Object.fromEntries(INCLUDES.map((i) => [i, mainCpp === null ? null : mainCpp.includes(`#include <${i}>`)])),
    bibliotecas: Object.fromEntries(
      BIBLIOTECAS.map((b) => [b, script === null ? null : (new RegExp(`^${b}_VERSION=(\\S+)$`, "m").exec(script)?.[1] ?? null)]),
    ),
    opcoesDeCompilacao: Object.fromEntries(OPCOES_DE_COMPILACAO.map((o) => [o, cmake === null ? null : cmake.includes(`-s ${o}`)])),
    bytesDoMainJs: lsMain === null || lsMain.trim() === "" ? null : Number(lsMain.trim().split(/\s+/)[3]),
    devolveNull: wrapper === null ? null : /\): Skeleton \| null/.test(wrapper),
    headDeHoje: oHeadDeHoje(a.git),
  };

  // ── A CGAL: só a tag que o script fixa, e só o `license.txt` do pacote.
  const tag = `v${candidatoA.bibliotecas.CGAL ?? "?"}`;
  const c = abrir(ORIGEM_CGAL);
  c.git("fetch", "-q", "--filter=blob:none", "--depth", "1", "origin", `refs/tags/${tag}`);
  const cgal: ProvaNaOrigem["cgal"] = {
    origem: ORIGEM_CGAL,
    tag,
    arquivo: LICENCA_DA_CGAL,
    texto: c.talvez("show", `FETCH_HEAD:${LICENCA_DA_CGAL}`)?.trim() ?? null,
  };

  // ── O candidato B: a crate Rust.
  const b = abrir(ORIGEM_B);
  b.git("fetch", "-q", "--filter=blob:none", "--depth", "1", "origin", COMMIT_B);
  const cargo = b.talvez("show", `${COMMIT_B}:Cargo.toml`);
  const licB = b.talvez("show", `${COMMIT_B}:LICENSE`);
  const lib = b.talvez("show", `${COMMIT_B}:src/lib.rs`);
  const arvoreB = b.git("ls-tree", "-r", "--name-only", COMMIT_B).split("\n").filter(Boolean);
  const fontes = arvoreB
    .filter((p) => p.startsWith("src/") && p.endsWith(".rs"))
    .map((p) => b.talvez("show", `${COMMIT_B}:${p}`))
    .filter((t): t is string => t !== null)
    .join("\n");
  const candidatoB: ProvaNaOrigem["candidatoB"] = {
    origem: ORIGEM_B,
    commit: oCommit(b.git, COMMIT_B),
    versao: cargo === null ? null : (/^version = "([^"]+)"/m.exec(cargo)?.[1] ?? null),
    licencaNoCargo: cargo === null ? null : (/^license = "([^"]+)"/m.exec(cargo)?.[1] ?? null),
    primeiraLinhaDoLicense: licB === null ? null : licB.split("\n").slice(0, 2).join(" ").replace(/\s+/g, " ").trim(),
    unsafeForbid: cargo === null ? null : /^unsafe_code = "forbid"$/m.test(cargo),
    noStd: lib === null ? null : /^#!\[no_std\]$/m.test(lib),
    designMd: arvoreB.includes("docs/DESIGN.md"),
    nomes: Object.fromEntries(Object.entries(NOMES_DO_B).map(([n, forma]) => [n, fontes === "" ? null : fontes.includes(forma)])),
    headDeHoje: oHeadDeHoje(b.git),
  };

  const prova: ProvaNaOrigem = {
    prompt: "LAB-172",
    oQueIstoMede:
      "os dois repositórios de fora que a docs/STRAIGHT_SKELETON_ANALYSIS.md descreve, nos commits que ela fixa, e o license.txt do pacote da CGAL na tag que o script deles fixa — lidos com git show/ls-tree, nada compilado nem executado; não mede gleba",
    quando: new Date().toISOString(),
    candidatoA,
    cgal,
    candidatoB,
  };
  mkdirSync(PROVA, { recursive: true });
  writeFileSync(join(PROVA, "esqueleto-reto-na-origem.json"), JSON.stringify(prova, null, 2) + "\n");
  console.log(JSON.stringify(prova, null, 2));
} finally {
  for (const p of pastas) rmSync(p, { recursive: true, force: true });
}
