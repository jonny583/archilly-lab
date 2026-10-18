#!/usr/bin/env bun
/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-185 · item 900 — a análise do Symbios, medida contra a ORIGEM dela e contra o registro das dependências.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A `docs/SYMBIOS_ANALYSIS.md` (LAB-00, 09/09/2026) afirma a ficha do `symbios-tensor`, que a cópia em `upstream/` é
 * idêntica ao commit dela, e a versão e a licença de cada dependência. Ninguém tinha voltado à origem. Esta ferramenta
 * volta:
 *
 *   1. busca na origem **só o commit que a página fixa**, sem os blobs (`--filter=blob:none --depth 1`), numa pasta
 *      temporária vazia, e lê com `git log`, `git ls-tree` e `git show` — a árvore inteira com o objeto de cada arquivo
 *      (que é o resumo dos bytes dele, e é o que a trava compara com a cópia), e só os blobs pedidos descem (o
 *      `Cargo.toml`, o `LICENSE` e o `src/lib.rs`); **nada é compilado nem executado**, e nada entra nesta árvore;
 *   2. pergunta à origem qual é o `HEAD` de hoje, e a data dele;
 *   3. pergunta ao registro público das crates (`crates.io`, a API de leitura, com `curl`) a licença, quem publicou e o
 *      repositório de cada dependência direta, **na versão que o `Cargo.lock` da ponte resolve**;
 *   4. grava `docs/provas/LAB-185/symbios-na-origem.json`.
 *
 * A trava `tests/a-analise-do-symbios.test.ts` lê essa prova **sem rede**. Esta ferramenta é a única parte com rede, e
 * está declarada em `src/rede-em-execucao.ts` (classe *origem pública*).
 *
 * Uso: `bun run lab185`
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  COMMIT,
  lerArvore,
  noLock,
  ORIGEM,
  osModulos,
  OS_LOCKS,
  type DependenciaNoRegistro,
  type ProvaNaOrigem,
} from "../src/a-analise-do-symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-185");
/** As dependências diretas que a §2 da página nomeia, como o `Cargo.toml` da cópia as escreve. */
const DIRETAS = ["symbios-ground", "glam", "rand", "rand_pcg", "serde"] as const;

/** A API de leitura do registro público das crates — um `curl` só, chamado duas vezes por crate (a versão e a crate). */
const COMO_SE_APRESENTA = ["-sS", "--max-time", "30", "-A", "archilly-lab (github.com/jonny583/archilly-lab)"];
const lerDoRegistro = (caminho: string): string =>
  execFileSync("curl", [...COMO_SE_APRESENTA, `https://crates.io/api/v1/crates/${caminho}`], { encoding: "utf8" });

const pasta = mkdtempSync(join(tmpdir(), "lab185-"));
const git = (...args: string[]): string =>
  execFileSync("git", args, { cwd: pasta, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
const talvez = (...args: string[]): string | null => {
  try {
    return git(...args);
  } catch {
    return null;
  }
};

try {
  git("init", "-q");
  git("remote", "add", "origin", ORIGEM);
  git("fetch", "-q", "--filter=blob:none", "--depth", "1", "origin", COMMIT);
  const [sha, data, autor] = git("log", "-1", "--format=%H%n%ad%n%an", "--date=iso", COMMIT).trim().split("\n");
  const arvore = lerArvore(git("ls-tree", "-r", COMMIT));
  const cargo = talvez("show", `${COMMIT}:Cargo.toml`);
  const licenca = talvez("show", `${COMMIT}:LICENSE`);
  const lib = talvez("show", `${COMMIT}:src/lib.rs`);

  const head = git("ls-remote", "origin", "HEAD").trim().split(/\s+/)[0]!;
  git("fetch", "-q", "--filter=blob:none", "--depth", "1", "origin", head);
  const dataDoHead = git("log", "-1", "--format=%ad", "--date=iso", head).trim();

  const lockDaPonte = readFileSync(join(RAIZ, OS_LOCKS[2]), "utf8");
  const dependencias: DependenciaNoRegistro[] = DIRETAS.map((crate) => {
    const versao = noLock(lockDaPonte, crate) ?? "?";
    const v = (JSON.parse(lerDoRegistro(`${crate}/${versao}`)) as { version?: { license?: string; published_by?: { login?: string } | null } })
      .version;
    const daCrate = lerDoRegistro(crate);
    const c = (JSON.parse(daCrate) as { crate?: { repository?: string | null } }).crate;
    return {
      crate,
      versao,
      licenca: v?.license ?? null,
      publicadaPor: v?.published_by?.login ?? null,
      repositorio: c?.repository ?? null,
    };
  });

  const prova: ProvaNaOrigem = {
    prompt: "LAB-185",
    oQueIstoMede:
      "o repositório de fora que a docs/SYMBIOS_ANALYSIS.md descreve, no commit que ela fixa — a árvore inteira com o objeto de cada arquivo, o Cargo.toml, o LICENSE e os módulos do lib.rs, lidos com git ls-tree/show, nada compilado nem executado — e a licença, quem publicou e o repositório das cinco dependências diretas no registro público, na versão que o Cargo.lock da ponte resolve; não mede gleba",
    quando: new Date().toISOString(),
    origem: ORIGEM,
    commit: { pedido: COMMIT, existe: sha === COMMIT, data: data ?? null, autor: autor ?? null },
    versao: cargo === null ? null : (/^version = "([^"]+)"/m.exec(cargo)?.[1] ?? null),
    licencaNoCargo: cargo === null ? null : (/^license = "([^"]+)"/m.exec(cargo)?.[1] ?? null),
    licenca:
      licenca === null
        ? null
        : {
            primeiraLinha: licenca.split("\n")[0]!.trim(),
            direitos: licenca.split("\n").find((l) => /^Copyright/.test(l))?.trim() ?? null,
          },
    workspace: cargo === null ? null : /^\[workspace\]/m.test(cargo),
    binarios:
      cargo === null ? null : /^\[\[bin\]\]/m.test(cargo) || arvore.some((l) => l.caminho === "src/main.rs" || l.caminho.startsWith("src/bin/")),
    modulos: lib === null ? null : osModulos(lib),
    arquivosEmSrc: arvore.filter((l) => /^src\/[^/]+\.rs$/.test(l.caminho)).length,
    arvore,
    dependencias,
    headDeHoje: { sha: head, data: dataDoHead },
  };
  mkdirSync(PROVA, { recursive: true });
  writeFileSync(join(PROVA, "symbios-na-origem.json"), JSON.stringify(prova, null, 2) + "\n");
  console.log(JSON.stringify({ ...prova, arvore: `${prova.arvore.length} arquivos` }, null, 2));
} finally {
  rmSync(pasta, { recursive: true, force: true });
}
