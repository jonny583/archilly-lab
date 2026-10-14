/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A ORDEM DA ENTREGA, COBRADA NO ENVIO. (LAB-106, item 900, D333)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ```sh
 * bun test tests/antes-do-envio.test.ts
 * ```
 *
 * A proposta do LAB-105: as provas que contam a árvore têm de bater com a árvore **enviada**. O
 * motivo inteiro, com a medição dos 36 estados da `main`, está no cabeçalho de
 * `src/antes-do-envio.ts`.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - a decisão: envio à `main` do `HEAD` com a árvore limpa **passa**; outro commit, ou árvore com
 *   arquivo fora do commit, **é recusado** — e o caso válido que quase parece inválido: ramo que
 *   não é a `main`, com a árvore suja, passa (só a `main` é cobrada);
 * - a leitura do estado, num repositório de verdade criado aqui: limpo, não rastreado, mudado e
 *   ignorado;
 * - o gancho existe, é executável **no git** (não só no disco) e chama a ferramenta; a ferramenta
 *   lê a lista do `verde.yml` e não escreve uma;
 * - o `conferir.sh` liga o gancho apontando para a pasta onde ele mora.
 *
 * **Ela NÃO roda o gancho de ponta a ponta:** o gancho roda a lista do trabalho sem clones, e este
 * arquivo está nela — seria a lista rodando a si mesma (o mesmo motivo do LAB-98). A execução de
 * ponta a ponta está no relatório do LAB-106, rodada.
 *
 * Lê só arquivo deste repositório e um repositório temporário: vai no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import {
  type EstadoNoEnvio,
  REF_COBRADA,
  estadoDoRepositorio,
  lerAEntrada,
  levaAMain,
  motivosParaRecusar,
} from "../src/antes-do-envio.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (p: string): string => readFileSync(join(RAIZ, p), "utf8");
const git = (args: string[]): string => execFileSync("git", args, { encoding: "utf8" });

const GANCHO = "external-engines/ganchos/pre-push";
const FERRAMENTA = "external-engines/esteira/ferramentas/antes-do-envio.ts";

const HEAD = "a".repeat(40);
const OUTRO = "b".repeat(40);
const ZEROS = "0".repeat(40);
const limpo: EstadoNoEnvio = { head: HEAD, foraDoCommit: [] };
const sujo: EstadoNoEnvio = { head: HEAD, foraDoCommit: [" M docs/ONDE_PARAMOS.md", "?? docs/relatorios/LAB-999.md"] };
const ref = (shaLocal: string, refRemota = REF_COBRADA) => ({
  refLocal: "refs/heads/main",
  shaLocal,
  refRemota,
  shaRemoto: OUTRO,
});

/** A lista escrita à mão, na forma que a ferramenta não pode ter: um `tests/….test.ts` literal. */
const listaAMao = (texto: string): boolean => /["'`]tests\/[\w.-]+\.test\.ts["'`]/.test(texto);

describe("LAB-106 · a entrada do pre-push", () => {
  test("quatro campos por linha; linha vazia ou torta não vira ref", () => {
    const entrada = `refs/heads/main ${HEAD} refs/heads/main ${OUTRO}\n\nlixo\n`;
    expect(lerAEntrada(entrada)).toEqual([ref(HEAD)]);
    expect(lerAEntrada("")).toEqual([]);
  });

  test("só a main leva as travas — ramo e apagamento não", () => {
    expect(levaAMain([ref(HEAD)])).toBe(true);
    expect(levaAMain([ref(HEAD, "refs/heads/claude/um-ramo")])).toBe(false);
    expect(levaAMain([ref(ZEROS)])).toBe(false);
    expect(levaAMain([])).toBe(false);
  });
});

describe("LAB-106 · a decisão, dos dois lados", () => {
  test("O LADO BOM: o HEAD à main, com a árvore limpa, passa", () => {
    expect(motivosParaRecusar([ref(HEAD)], limpo)).toEqual([]);
  });

  test("O LADO RUIM: outro commit que não o HEAD é recusado, nomeando os dois", () => {
    const m = motivosParaRecusar([ref(OUTRO)], limpo);
    expect(m.length).toBe(1);
    expect(m[0]).toContain("bbbbbbb");
    expect(m[0]).toContain("aaaaaaa");
  });

  test("O LADO RUIM: arquivo fora do commit é recusado — mudado e não rastreado", () => {
    const m = motivosParaRecusar([ref(HEAD)], sujo);
    expect(m.length).toBe(1);
    expect(m[0]).toContain("2 arquivo(s) fora do commit");
    expect(m[0]).toContain("LAB-999.md");
  });

  test("os dois defeitos juntos dão dois motivos, não um", () => {
    expect(motivosParaRecusar([ref(OUTRO)], sujo).length).toBe(2);
  });

  test("O CASO VÁLIDO QUE QUASE PARECE INVÁLIDO: ramo que não é a main, com árvore suja, passa", () => {
    expect(motivosParaRecusar([ref(OUTRO, "refs/heads/claude/um-ramo")], sujo)).toEqual([]);
  });

  test("apagar a main remota não é envio de árvore", () => {
    expect(motivosParaRecusar([ref(ZEROS)], sujo)).toEqual([]);
  });

  test("muitos arquivos fora: a amostra é de cinco e o resto é contado", () => {
    const muitos = { head: HEAD, foraDoCommit: Array.from({ length: 8 }, (_, i) => `?? f${i}.md`) };
    const m = motivosParaRecusar([ref(HEAD)], muitos);
    expect(m[0]).toContain("8 arquivo(s)");
    expect(m[0]).toContain("e mais 3");
  });
});

describe("LAB-106 · o estado, lido num repositório de verdade", () => {
  test("limpo, não rastreado, mudado e ignorado", () => {
    const dir = mkdtempSync(join(tmpdir(), "lab106-"));
    try {
      const g = (...a: string[]) => git(["-C", dir, ...a]);
      g("init", "-q");
      g("config", "user.email", "lab@exemplo.invalid");
      g("config", "user.name", "lab");
      writeFileSync(join(dir, ".gitignore"), "ignorado.txt\n");
      writeFileSync(join(dir, "a.md"), "um\n");
      g("add", ".");
      g("commit", "-q", "-m", "primeiro");
      const head = g("rev-parse", "HEAD").trim();

      expect(estadoDoRepositorio(dir, git)).toEqual({ head, foraDoCommit: [] });

      writeFileSync(join(dir, "ignorado.txt"), "fora do git\n");
      expect(estadoDoRepositorio(dir, git).foraDoCommit).toEqual([]);

      writeFileSync(join(dir, "novo.md"), "não rastreado\n");
      expect(estadoDoRepositorio(dir, git).foraDoCommit).toEqual(["?? novo.md"]);

      writeFileSync(join(dir, "a.md"), "mudado\n");
      expect(estadoDoRepositorio(dir, git).foraDoCommit.length).toBe(2);

      // Adicionado e não commitado também está fora do commit — foi a forma do LAB-104.
      g("add", ".");
      expect(estadoDoRepositorio(dir, git).foraDoCommit.length).toBe(2);
      expect(motivosParaRecusar([ref(head)], estadoDoRepositorio(dir, git)).length).toBe(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("LAB-106 · o gancho, a ferramenta e quem os liga", () => {
  test("o gancho é versionado E executável no git — o modo do disco não viaja no clone", () => {
    const linha = git(["-C", RAIZ, "ls-files", "-s", GANCHO]).trim();
    expect(linha, `${GANCHO} não está no git`).not.toBe("");
    expect(linha.split(/\s+/)[0], `${GANCHO} sem o bit de execução no git`).toBe("100755");
  });

  test("o gancho chama a ferramenta, e só ela", () => {
    const g = ler(GANCHO);
    expect(g.startsWith("#!/bin/sh")).toBe(true);
    expect(g).toContain("exec bun ferramentas/antes-do-envio.ts");
  });

  test("a ferramenta decide pelo módulo e lê a lista do verde.yml — não escreve uma", () => {
    const f = ler(FERRAMENTA);
    expect(f).toContain("motivosParaRecusar(");
    expect(f).toContain("arquivosDoTrabalho(");
    expect(f).toContain("TRABALHO_SEM_CLONES");
    expect(listaAMao(f), "a ferramenta escreveu uma lista de travas à mão").toBe(false);
  });

  test("o detector da lista à mão, dos dois lados", () => {
    expect(listaAMao(`spawnSync("bun", ["test", "tests/verde.test.ts"])`)).toBe(true);
    expect(listaAMao("const lista = arquivosDoTrabalho(yml, TRABALHO_SEM_CLONES);")).toBe(false);
  });

  test("o conferir.sh liga o gancho, apontando para a pasta onde ele mora", () => {
    const s = ler("external-engines/conferir.sh");
    const m = /^GANCHOS="([^"]+)"$/m.exec(s);
    expect(m, "o conferir.sh não declara GANCHOS").not.toBeNull();
    expect(m![1]).toBe(dirname(GANCHO));
    expect(s).toContain('config core.hooksPath "$GANCHOS"');
  });
});
