/**
 * **LAB-162 (item 900) · nenhum commit, nenhum push nos vizinhos — perguntado pela SESSÃO** (D390).
 *
 * ```sh
 * bun test tests/nenhum-commit-nos-vizinhos.test.ts
 * ```
 *
 * A linha do `docs/SEGURANCA.md` era um comando rodado no LF-FINAL e no LF-FINAL-2, e nunca mais. O motivo inteiro, com a
 * medição, está no cabeçalho de `src/nenhum-commit-nos-vizinhos.ts`.
 *
 * Roda **sem clones** (lê só a página e histórias plantadas) e por isso está no portão sem clones do `verde.yml`. A
 * pergunta à história de verdade — desta casa e dos três vizinhos — mora em `nenhum-commit-nos-vizinhos-com-clone.test.ts`,
 * no verde completo.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_LINHA,
  COMMITS_DA_DIRECAO_FORA_DA_CAIXA,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  argumentosDoGitLog,
  conferirNenhumCommitNosVizinhos,
  lerOGitLog,
  sessoesDaMensagem,
  type Commit,
  type Historia,
} from "../src/nenhum-commit-nos-vizinhos.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

// O endereço da sessão vai montado em pedaços, pela mesma razão do LAB-160 e do LAB-161: inteiro, outras réguas o leem.
const sessao = (id: string) => ["claude.ai", "code", `session_${id}`].join("/");
const rodape = (id: string) => `\n\nClaude-Session: https://${sessao(id)}\n`;

const commit = (hash: string, assunto: string, ids: string[], caminhos?: string[]): Commit => ({
  hash,
  assunto,
  sessoes: ids.map((i) => `session_${i}`),
  ...(caminhos ? { caminhos } : {}),
});
const historia = (repo: string, commits: Commit[], rasa = false): Historia => ({ repo, rasa, commits });

// Os dois declarados, como estão na história de verdade (fora da caixa).
const DECLARADOS = COMMITS_DA_DIRECAO_FORA_DA_CAIXA.map((d) =>
  commit(`${d.hash}000000`, "a direção monta a caixa", ["DIRECAO1"], ["docs/INDEX.md"]),
);
const TRABALHO = commit("aaaaaaa1", "LAB-900: uma rodada", ["CASA1"], ["docs/relatorios/LAB-900.md", "docs/caixa-de-entrada/031-FEITO.md"]);
const ITEM_DA_DIRECAO = commit("bbbbbbb1", "caixa 031: um pedido", ["DIRECAO2"], ["docs/caixa-de-entrada/031.md"]);
const CASA = historia("archilly-lab", [TRABALHO, ITEM_DA_DIRECAO, ...DECLARADOS]);

const doVizinho = (...commits: Commit[]) => historia("motor-testfit", [commit("ccccccc1", "o trabalho dele", ["DELE"]), ...commits]);
const tipos = (casa: Historia, ...vizinhos: Historia[]) =>
  conferirNenhumCommitNosVizinhos({ casa, vizinhos }).problemas.map((p) => p.tipo);

describe("LAB-162 · a linha da página, e o que a régua diz de si", () => {
  test("o `docs/SEGURANCA.md` escreve a linha e aponta para esta régua", () => {
    const pagina = readFileSync(join(RAIZ, "docs", "SEGURANCA.md"), "utf8");
    expect(aRegraEstaEscrita(pagina, A_LINHA)).toBe(true);
    const linha = pagina.split("\n").find((l) => l.includes("Nenhum commit, nenhum push nos"));
    expect(linha).toBeDefined();
    expect(linha).toContain(O_PONTEIRO);
  });

  test("o que ela não alcança está dito, e inclui o commit sem rodapé e o que não chegou à origem", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
    expect(O_QUE_ISTO_NAO_ALCANCA.join(" ")).toContain("SEM rodapé");
    expect(O_QUE_ISTO_NAO_ALCANCA.join(" ")).toContain("ORIGEM");
  });

  test("toda exceção da direção diz o motivo, com a data, e é um prefixo de hash de 7", () => {
    expect(COMMITS_DA_DIRECAO_FORA_DA_CAIXA.length).toBe(2);
    for (const d of COMMITS_DA_DIRECAO_FORA_DA_CAIXA) {
      // Sete caracteres pelo comprimento, não por quantificador: `{7}` num arquivo que fala da caixa é a forma que a
      // régua do teto do número do item (LAB-113) procura — e ela tem razão em procurar.
      expect(d.hash).toHaveLength(7);
      expect(d.hash).toMatch(/^[0-9a-f]+$/);
      expect(d.motivo).toStartWith("09/10/2026");
      expect(d.motivo.length).toBeGreaterThan(60);
    }
  });
});

describe("LAB-162 · a leitura do `git log`", () => {
  test("a sessão sai do rodapé, com e sem a chave, sem repetir", () => {
    expect(sessoesDaMensagem(`x${rodape("B")}\nveja https://${sessao("A")} e ${sessao("B")}`)).toEqual([
      "session_A",
      "session_B",
    ]);
    expect(sessoesDaMensagem("sem rodapé nenhum")).toEqual([]);
  });

  test("o formato que os argumentos pedem é o que a leitura lê — com e sem caminhos", () => {
    const fmt = argumentosDoGitLog(true).find((a) => a.startsWith("--format="))!;
    expect(argumentosDoGitLog(true)).toContain("--name-only");
    expect(argumentosDoGitLog(false)).not.toContain("--name-only");
    expect(argumentosDoGitLog(true)).toContain("--remotes=origin");
    // Simula a saída do `git log` com o formato pedido: registro, campos e os caminhos depois do último campo.
    const um = (h: string, s: string, b: string, cs: string[]) =>
      fmt.slice("--format=".length).replace("%H", h).replace("%s", s).replace("%B", b) + "\n\n" + cs.join("\n") + "\n";
    const saida = um("h1", "LAB-1: a", `LAB-1: a${rodape("X")}`, ["a.ts", "b.ts"]) + um("h2", "caixa 2", "caixa 2", []);
    const lidos = lerOGitLog(saida);
    expect(lidos).toEqual([
      { hash: "h1", assunto: "LAB-1: a", sessoes: ["session_X"], caminhos: ["a.ts", "b.ts"] },
      { hash: "h2", assunto: "caixa 2", sessoes: [], caminhos: [] },
    ]);
  });
});

describe("LAB-162 · a sessão, dos dois lados", () => {
  test("O LADO BOM: o vizinho com o trabalho dele e um item da direção (sessão em comum com a caixa daqui) passa", () => {
    const r = conferirNenhumCommitNosVizinhos({
      casa: CASA,
      vizinhos: [doVizinho(commit("ddddddd1", "caixa 040: pedido", ["DIRECAO2"]), commit("ddddddd2", "x", ["DIRECAO1"]))],
    });
    expect(r.problemas).toEqual([]);
    expect(r.universo.sessoesDaCasa).toBe(1);
    expect(r.universo.sessoesDaDirecao).toBe(2);
    expect(r.universo.vizinhos[0]!.sessoesEmComumComADirecao).toBe(2);
  });

  test("a sessão de uma rodada desta casa num commit do vizinho → `sessao-da-casa-no-vizinho`", () => {
    expect(tipos(CASA, doVizinho(commit("eeeeeee1", "conserto no vizinho", ["CASA1"])))).toEqual([
      "sessao-da-casa-no-vizinho",
    ]);
  });

  test("o assunto `LAB-<n>` num commit do vizinho, mesmo sem rodapé → `assunto-da-casa-no-vizinho`", () => {
    expect(tipos(CASA, doVizinho(commit("eeeeeee2", "LAB-77: ajuste lá", [])))).toEqual(["assunto-da-casa-no-vizinho"]);
    // O nome parecido no meio do assunto não é o desta casa: o do vizinho cita o Lab, e citar não é ser.
    expect(tipos(CASA, doVizinho(commit("eeeeeee3", "caixa 9: o que o LAB-77 mediu", [])))).toEqual([]);
  });

  test("fechar item é trabalho da casa: a sessão que renomeia para `-FEITO`, mesmo só na caixa, é da casa", () => {
    const fecha = commit("fffffff1", "item 031 feito", ["CASA2"], ["docs/caixa-de-entrada/031-FEITO.md", "docs/caixa-de-entrada/031.md"]);
    const casa = historia("archilly-lab", [...CASA.commits, fecha]);
    expect(tipos(casa, doVizinho(commit("eeeeeee4", "x", ["CASA2"])))).toEqual(["sessao-da-casa-no-vizinho"]);
  });

  test("a sessão da direção que trabalhou fora da caixa, sem declaração, conta como da casa e acusa", () => {
    const fora = commit("9999999a", "a direção mexe no código", ["DIRECAO3"], ["external-engines/x.ts"]);
    const casa = historia("archilly-lab", [...CASA.commits, fora]);
    expect(tipos(casa, doVizinho(commit("eeeeeee5", "caixa 041", ["DIRECAO3"])))).toEqual(["sessao-da-casa-no-vizinho"]);
  });

  test("a sessão com commit na caixa E fora dela conta como da casa — a dúvida cai para o lado que acusa", () => {
    const fora = commit("9999999b", "x", ["DIRECAO2"], ["docs/ONDE_PARAMOS.md"]);
    const casa = historia("archilly-lab", [...CASA.commits, fora]);
    expect(tipos(casa, doVizinho(commit("eeeeeee6", "caixa 042", ["DIRECAO2"])))).toEqual(["sessao-da-casa-no-vizinho"]);
  });
});

describe("LAB-162 · as declarações e o universo, dos dois lados", () => {
  test("declaração cujo commit sumiu da história → `declaracao-que-sobra`", () => {
    const casa = historia("archilly-lab", [TRABALHO, ITEM_DA_DIRECAO, DECLARADOS[0]!]);
    expect(tipos(casa, doVizinho())).toEqual(["declaracao-que-sobra"]);
  });

  test("declaração cujo commit já cabe na caixa → `declaracao-que-sobra`", () => {
    const caixa = { ...DECLARADOS[0]!, caminhos: ["docs/caixa-de-entrada/001.md"] };
    const casa = historia("archilly-lab", [TRABALHO, caixa, DECLARADOS[1]!]);
    expect(tipos(casa, doVizinho())).toEqual(["declaracao-que-sobra"]);
  });

  test("história rasa, desta casa ou do vizinho → `historia-rasa`", () => {
    expect(tipos({ ...CASA, rasa: true }, doVizinho())).toEqual(["historia-rasa"]);
    expect(tipos(CASA, { ...doVizinho(), rasa: true })).toEqual(["historia-rasa"]);
  });

  test("nenhum commit lido, desta casa ou do vizinho → `universo-vazio`", () => {
    expect(tipos(CASA, historia("motor-testfit", []))).toEqual(["universo-vazio"]);
    const vazia = historia("archilly-lab", []);
    expect(tipos(vazia, doVizinho())).toContain("universo-vazio");
  });
});
