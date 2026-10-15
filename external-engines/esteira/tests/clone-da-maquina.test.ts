/**
 * **LAB-116 (item 900) · a máquina do disparo nasce com uma `main` velha e um clone raso** (D344).
 *
 * ```sh
 * bun test tests/clone-da-maquina.test.ts
 * ```
 *
 * A receita do passo 0 do `COMO_FUNCIONA.md` é **rodada**, não lida: cada trava monta, com
 * `file://` e sem rede, a máquina como o disparo a encontra — um clone RASO, a `main` local no
 * retrato e o `HEAD` destacado na ponta de hoje — e roda nela o bloco `sh` tirado da página.
 *
 * Os dois lados (a régua do protocolo: aprovar o caso bom E reprovar o ruim):
 * - **o caso bom** — a `main` velha é ancestral da origem: a receita a leva à ponta;
 * - **o caso ruim** — a `main` local tem commit que a origem não tem: a receita **não toca em
 *   nada**, diz e sai com erro;
 * - **a mutação** — a mesma receita sem a linha que desrasa NÃO chega à ponta: é essa linha que faz
 *   o trabalho, e não a sorte do cenário.
 *
 * Hermética: só `git` local, sem rede, sem os clones vizinhos — entra no portão sem clones.
 */
import { afterAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  A_RECEITA_DIZ,
  A_RECEITA_NAO_DIZ,
  MARCA_DA_RECEITA,
  O_COMANDO_DO_DISPARO_DE_15_10,
  PAGINA_DA_RECEITA,
  conferirAReceita,
  receitaDoClone,
} from "../src/clone-da-maquina.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, PAGINA_DA_RECEITA), "utf8");
const RECEITA = receitaDoClone(PAGINA);

const AMBIENTE = {
  ...process.env,
  GIT_AUTHOR_NAME: "lab116",
  GIT_AUTHOR_EMAIL: "lab116@exemplo.invalid",
  GIT_COMMITTER_NAME: "lab116",
  GIT_COMMITTER_EMAIL: "lab116@exemplo.invalid",
  GIT_CONFIG_GLOBAL: "/dev/null",
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_TERMINAL_PROMPT: "0",
};

const PASTAS: string[] = [];
afterAll(() => {
  for (const p of PASTAS) rmSync(p, { recursive: true, force: true });
});

function git(dir: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd: dir, env: AMBIENTE, encoding: "utf8" }).trim();
}

/** Roda um texto de shell na pasta. Devolve o código de saída e o que ele disse. */
function sh(dir: string, script: string): { codigo: number; saida: string } {
  const r = spawnSync("bash", ["-c", script], { cwd: dir, env: AMBIENTE, encoding: "utf8" });
  return { codigo: r.status ?? -1, saida: `${r.stdout}${r.stderr}` };
}

function commit(dir: string, mensagem: string): string {
  // um arquivo por commit: o ramo e a main nunca disputam a mesma linha no merge
  writeFileSync(join(dir, `${mensagem}.txt`), `${mensagem}\n`);
  git(dir, "add", `${mensagem}.txt`);
  git(dir, "commit", "-q", "-m", mensagem);
  return git(dir, "rev-parse", "HEAD");
}

const assunto = (dir: string, ref: string) => git(dir, "log", "-1", "--format=%s", ref);

/**
 * A máquina como o disparo de 15/10 a encontrou: a origem andou (com um merge no meio, como a
 * história desta casa), o clone nasceu RASO no retrato, e a ponta de hoje chegou por um `fetch`
 * raso, com o `HEAD` destacado nela. Devolve a pasta da máquina e a ponta.
 */
function montarAMaquina(): { maquina: string; ponta: string; base: string } {
  const base = mkdtempSync(join(tmpdir(), "lab116-"));
  PASTAS.push(base);
  const origem = join(base, "origem");
  execFileSync("git", ["init", "-q", "-b", "main", origem], { env: AMBIENTE });
  git(origem, "config", "uploadpack.allowReachableSHA1InWant", "true");
  for (const c of ["c1", "c2", "c3"]) commit(origem, c);

  const maquina = join(base, "maquina");
  execFileSync("git", ["clone", "-q", "--depth", "1", `file://${origem}`, maquina], { env: AMBIENTE });

  git(origem, "checkout", "-q", "-b", "ramo");
  commit(origem, "r1");
  git(origem, "checkout", "-q", "main");
  for (const c of ["c4", "c5"]) commit(origem, c);
  git(origem, "merge", "-q", "--no-ff", "ramo", "-m", "c6-merge");
  const ponta = git(origem, "rev-parse", "HEAD");

  git(maquina, "fetch", "-q", "--depth", "1", "origin", ponta);
  git(maquina, "checkout", "-q", "--detach", "FETCH_HEAD");
  return { maquina, ponta, base };
}

describe("LAB-116 · a receita está na página, com o que tem de dizer e sem o que não pode", () => {
  test("a marca está no passo 0, e o que vem depois dela é um bloco `sh`", () => {
    expect(PAGINA).toContain(MARCA_DA_RECEITA);
    expect(RECEITA, "a receita não foi achada depois da marca").not.toBeNull();
    // o passo 0 vem antes do passo 1: a receita é a primeira coisa que se faz
    expect(PAGINA.indexOf(MARCA_DA_RECEITA)).toBeLessThan(PAGINA.indexOf("1. Leia a pasta."));
  });

  test("os dois sentidos: tudo o que ela tem de dizer, nada do que apaga um lado", () => {
    const c = conferirAReceita(PAGINA);
    expect(c).toEqual({ achada: true, faltam: [], sobram: [] });
  });

  test("O LADO RUIM da régua de texto: página sem a marca reprova inteira; receita com `--force` reprova", () => {
    const sem = conferirAReceita(PAGINA.replace(MARCA_DA_RECEITA, ""));
    expect(sem.achada).toBe(false);
    expect(sem.faltam).toEqual(A_RECEITA_DIZ.map((r) => r.trecho));
    const comForca = conferirAReceita(PAGINA.replace("--ff-only origin/main", "--ff-only --force origin/main"));
    expect(comForca.sobram).toEqual(["--force"]);
    const semDesrasar = conferirAReceita(PAGINA.replace("--unshallow", "--depth=1"));
    expect(semDesrasar.faltam).toEqual(["--unshallow"]);
    for (const proibido of A_RECEITA_NAO_DIZ) {
      expect(conferirAReceita(PAGINA.replace("--unshallow origin; fi", `--unshallow origin; fi # ${proibido.trecho}`)).sobram)
        .toContain(proibido.trecho);
    }
  });
});

describe("LAB-116 · o defeito reproduzido com o comando REAL do disparo", () => {
  test("no clone raso, o comando do disparo recusa — e deixa a árvore NO RETRATO", () => {
    const { maquina } = montarAMaquina();
    expect(git(maquina, "rev-parse", "--is-shallow-repository")).toBe("true");
    expect(assunto(maquina, "HEAD")).toBe("c6-merge");
    expect(assunto(maquina, "main")).toBe("c3");

    const r = sh(maquina, O_COMANDO_DO_DISPARO_DE_15_10);
    expect(r.codigo).not.toBe(0);
    expect(r.saida).toContain("Not possible to fast-forward");
    // a recusa veio DEPOIS do checkout: a árvore que a sessão leria agora é a do retrato
    expect(assunto(maquina, "HEAD")).toBe("c3");
    // e o raso fabrica a divergência: a `main` velha "não é ancestral" da ponta
    expect(sh(maquina, "git merge-base --is-ancestor main origin/main").codigo).not.toBe(0);
  });
});

describe("LAB-116 · a receita RODADA, nos dois lados e com a mutação", () => {
  test("O LADO BOM: depois do disparo que falhou, a receita leva a `main` à ponta, sem raso", () => {
    const { maquina, ponta } = montarAMaquina();
    sh(maquina, O_COMANDO_DO_DISPARO_DE_15_10); // o disparo, que falha, como na máquina de verdade
    const r = sh(maquina, RECEITA!);
    expect(r.codigo, r.saida).toBe(0);
    expect(git(maquina, "rev-parse", "main")).toBe(ponta);
    expect(git(maquina, "rev-parse", "HEAD")).toBe(ponta);
    expect(git(maquina, "symbolic-ref", "HEAD")).toBe("refs/heads/main");
    expect(git(maquina, "rev-parse", "--is-shallow-repository")).toBe("false");
    expect(git(maquina, "status", "--porcelain")).toBe("");
  });

  test("e também ANTES do disparo (HEAD destacado na ponta): o mesmo destino", () => {
    const { maquina, ponta } = montarAMaquina();
    const r = sh(maquina, RECEITA!);
    expect(r.codigo, r.saida).toBe(0);
    expect(git(maquina, "rev-parse", "HEAD")).toBe(ponta);
    expect(git(maquina, "symbolic-ref", "HEAD")).toBe("refs/heads/main");
  });

  test("a máquina SEM `main` local (só o HEAD destacado): a receita cria a `main` na ponta, rastreando a origem", () => {
    const { maquina, ponta } = montarAMaquina();
    git(maquina, "branch", "-q", "-D", "main");
    const r = sh(maquina, RECEITA!);
    expect(r.codigo, r.saida).toBe(0);
    expect(git(maquina, "rev-parse", "main")).toBe(ponta);
    expect(git(maquina, "rev-parse", "--abbrev-ref", "main@{upstream}")).toBe("origin/main");
  });

  test("a máquina já em dia: a receita não muda nada e sai bem", () => {
    const { maquina, ponta } = montarAMaquina();
    sh(maquina, RECEITA!);
    const r = sh(maquina, RECEITA!);
    expect(r.codigo, r.saida).toBe(0);
    expect(git(maquina, "rev-parse", "HEAD")).toBe(ponta);
  });

  test("O LADO RUIM: a `main` local com commit que a origem não tem — a receita não toca em nada e sai com erro", () => {
    const { maquina } = montarAMaquina();
    git(maquina, "checkout", "-q", "main");
    const naoEnviado = commit(maquina, "trabalho-nao-enviado");
    const r = sh(maquina, RECEITA!);
    expect(r.codigo).not.toBe(0);
    expect(r.saida).toContain("DIVERGÊNCIA DE VERDADE");
    expect(git(maquina, "rev-parse", "main")).toBe(naoEnviado);
    expect(git(maquina, "rev-parse", "HEAD")).toBe(naoEnviado);
  });

  test("A MUTAÇÃO: a mesma receita sem a linha que desrasa NÃO chega à ponta — é ela que faz o trabalho", () => {
    const linhas = RECEITA!.split("\n");
    const semDesrasar = linhas.filter((l) => !l.includes("--unshallow"));
    expect(semDesrasar.length).toBe(linhas.length - 1);
    const { maquina, ponta } = montarAMaquina();
    const r = sh(maquina, semDesrasar.join("\n"));
    expect(r.codigo).not.toBe(0);
    expect(git(maquina, "rev-parse", "main")).not.toBe(ponta);
    expect(r.saida).toContain("DIVERGÊNCIA DE VERDADE"); // a divergência FALSA que o raso fabrica
  });
});
