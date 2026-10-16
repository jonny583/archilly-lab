/**
 * **LAB-133 (item 900) · o Symbios roda em Node 22+ sem npm** (D361).
 *
 * ```sh
 * bun test tests/node-sem-npm.test.ts
 * ```
 *
 * O `CLAUDE.md` §7 diz *"Symbios em Node 22+ sem npm"* (D14) — e a esteira roda o adaptador no **Bun**, que
 * aceita o que o Node recusa: um `enum`, uma propriedade de parâmetro, um `namespace` e um import relativo sem
 * extensão, plantados juntos, não fizeram cair nenhuma trava que falasse da regra. Esta pergunta ao **Node**
 * desta máquina (precisa dele, 22 ou mais — sem ele reprova com a receita) e lê só arquivos desta casa: não
 * precisa de clone, mas **não está** no portão sem clones do `verde.yml`, porque aquele trabalho instala só o
 * Bun; roda no verde completo, que instala o Node 22.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  ADAPTADOR,
  EXCECOES_DE_PACOTE,
  NODE_MINIMO,
  PERGUNTA_AO_NODE,
  arquivosDoAdaptador,
  conferirONodeSemNpm,
  importacoesDe,
  manifestosNoSymbios,
  nomeDoPacote,
  tipoDaImportacao,
  versaoMaior,
  type OQueSeLeu,
  type RespostaDoNode,
} from "../src/node-sem-npm.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const versionados = execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8" }).split("\n").filter(Boolean);
const CAMINHOS = arquivosDoAdaptador(versionados);
const CODIGOS: Record<string, string> = Object.fromEntries(
  CAMINHOS.map((c) => [c, readFileSync(join(RAIZ, c), "utf8")]),
);

const RECEITA =
  `o Node ${NODE_MINIMO}+ não está nesta máquina — a regra é "Symbios em Node 22+", e quem diz o que o Node ` +
  "aceita é o Node. Instale um Node 22.13 ou mais novo (`nvm install 22`, ou `actions/setup-node` com " +
  "`node-version: 22` no CI) e rode de novo. Esta trava não pula.";

/** Pergunta ao Node desta máquina — uma vez, para todos os códigos. */
function perguntarAoNode(codigos: Record<string, string>): RespostaDoNode {
  const r = spawnSync("node", ["--no-warnings", "-e", PERGUNTA_AO_NODE], {
    input: JSON.stringify(codigos),
    encoding: "utf8",
  });
  if (r.error || r.status !== 0) throw new Error(`${RECEITA}\n(${r.error?.message ?? r.stderr})`);
  return JSON.parse(r.stdout) as RespostaDoNode;
}

const NODE = perguntarAoNode(CODIGOS);

function lido(codigos: Record<string, string>, resposta: RespostaDoNode, extras: readonly string[] = []): OQueSeLeu {
  return {
    versionados: [...versionados, ...extras],
    arquivos: Object.entries(codigos).map(([caminho, codigo]) => ({ caminho, importacoes: importacoesDe(codigo) })),
    vereditoDoNode: (c) => resposta.vereditos[c],
    existe: (c) => existsSync(join(RAIZ, c)),
  };
}

const DE_VERDADE = conferirONodeSemNpm(lido(CODIGOS, NODE));

/** O adaptador de verdade com UM arquivo trocado — a mutação no lugar real, perguntada ao Node de verdade. */
function comMudanca(arquivo: string, mudar: (codigo: string) => string) {
  const codigos = { ...CODIGOS, [arquivo]: mudar(CODIGOS[arquivo]!) };
  return conferirONodeSemNpm(lido(codigos, perguntarAoNode(codigos)));
}
/** Acrescenta uma linha no TOPO do código — depois da linha `#!`, se houver, que tem de ser a primeira. */
function noTopo(codigo: string, linha: string): string {
  if (!codigo.startsWith("#!")) return `${linha}\n${codigo}`;
  const fim = codigo.indexOf("\n");
  return `${codigo.slice(0, fim + 1)}${linha}\n${codigo.slice(fim + 1)}`;
}
const tipos = (r: ReturnType<typeof conferirONodeSemNpm>) => r.problemas.map((p) => `${p.tipo} ${p.arquivo.replace(`${ADAPTADOR}/`, "")}`);

const HASH = `${ADAPTADOR}/src/hash.ts`;
const GERAR = `${ADAPTADOR}/ferramentas/gerar-terrenos.ts`;
const PROVA = EXCECOES_DE_PACOTE[0]!.arquivo;

describe("LAB-133 · o Node desta máquina é o que a regra pede", () => {
  test("o mínimo da régua é o número da regra, lido da frase — não digitado em dois lugares", () => {
    expect(A_REGRA.match(/Node (\d+)\+/)?.[1]).toBe(String(NODE_MINIMO));
  });

  test(`Node ${NODE_MINIMO} ou mais, com o removedor de tipos — senão reprova com a receita`, () => {
    console.log(`    Node ${NODE.versao}`);
    expect(versaoMaior(NODE.versao), RECEITA).toBeGreaterThanOrEqual(NODE_MINIMO);
    expect(NODE.temORemovedor, RECEITA).toBe(true);
  });
});

describe("LAB-133 · a casa de verdade — dezesseis arquivos, e o Node aceita todos", () => {
  test("a regra está escrita onde mora — o §7", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
  });

  test("o universo: arquivos e importações lidos — publicado, não zero", () => {
    console.log(`    ${DE_VERDADE.arquivos} arquivos · ${DE_VERDADE.importacoes} importações · ${DE_VERDADE.problemas.length} problemas`);
    // Contados no LAB-133: 16 arquivos (11 em `src/`, 5 em `ferramentas/`).
    expect(DE_VERDADE.arquivos).toBeGreaterThanOrEqual(16);
    expect(CAMINHOS.filter((c) => c.includes("/src/")).length).toBeGreaterThanOrEqual(11);
    expect(DE_VERDADE.importacoes).toBeGreaterThanOrEqual(30);
  });

  test("nenhum problema: o Node tira os tipos de todos, e nada importa pacote fora da exceção", () => {
    expect(DE_VERDADE.problemas, JSON.stringify(DE_VERDADE.problemas, null, 2)).toEqual([]);
  });

  test("nenhum manifesto de pacote no Symbios, fora do `upstream/`", () => {
    expect(manifestosNoSymbios(versionados)).toEqual([]);
  });

  test("a exceção é UMA, e é o passo do verde que roda no Bun", () => {
    expect(EXCECOES_DE_PACOTE.map((e) => [e.arquivo, e.pacotes])).toEqual([[PROVA, ["playwright"]]]);
    expect(CODIGOS[PROVA]!.startsWith("#!/usr/bin/env bun")).toBe(true);
    expect(readFileSync(join(RAIZ, "external-engines", "esteira", "package.json"), "utf8")).toContain('"playwright"');
  });

  test("RODADO, não lido: os onze de `src/` carregam no Node, com `--experimental-strip-types`", () => {
    // Os de `src/` não escrevem nada ao carregar (o `index.ts` só reexporta); as ferramentas escrevem e leem o
    // `.wasm`, e por isso só passam pelo removedor de tipos acima.
    const src = CAMINHOS.filter((c) => c.startsWith(`${ADAPTADOR}/src/`));
    const programa = `Promise.all(${JSON.stringify(src.map((c) => join(RAIZ, c)))}.map((f) => import(f)))` +
      `.then(() => console.log("carregaram"), (e) => { console.log(e.code + ": " + e.message); process.exit(1); })`;
    const r = spawnSync("node", ["--no-warnings", "--experimental-strip-types", "-e", programa], { encoding: "utf8" });
    expect(r.stdout.trim(), r.stderr).toBe("carregaram");
    expect(src.length).toBeGreaterThanOrEqual(11);
  });
});

describe("LAB-133 · as quatro formas de Bun-que-não-é-Node, plantadas no adaptador de verdade", () => {
  test("`enum` → o Node recusa", () => {
    expect(tipos(comMudanca(HASH, (c) => `${c}\nexport enum Cor { A, B }\n`))).toEqual([
      "sintaxe-que-o-node-nao-tira src/hash.ts",
    ]);
  });

  test("propriedade de parâmetro no construtor → o Node recusa", () => {
    expect(tipos(comMudanca(HASH, (c) => `${c}\nexport class Par { constructor(private a: number) {} }\n`))).toEqual([
      "sintaxe-que-o-node-nao-tira src/hash.ts",
    ]);
  });

  test("`namespace` com valor → o Node recusa", () => {
    expect(tipos(comMudanca(HASH, (c) => `${c}\nexport namespace Ns { export const x = 1; }\n`))).toEqual([
      "sintaxe-que-o-node-nao-tira src/hash.ts",
    ]);
  });

  test("import relativo sem extensão → o Node não completa", () => {
    expect(tipos(comMudanca(GERAR, (c) => noTopo(c, 'import { projetar } from "../src/geo";')))).toEqual([
      "relativo-sem-extensao ferramentas/gerar-terrenos.ts",
    ]);
  });
});

describe("LAB-133 · os outros lados ruins", () => {
  test("pacote npm no adaptador → reprova; e o `@escopo/nome` sai com o nome inteiro", () => {
    expect(tipos(comMudanca(HASH, (c) => noTopo(c, 'import { z } from "zod";')))).toEqual(["pacote-npm src/hash.ts"]);
    expect(nomeDoPacote("@turf/area/dist")).toBe("@turf/area");
    expect(nomeDoPacote("zod/v4")).toBe("zod");
  });

  test("import dinâmico de pacote também conta", () => {
    expect(tipos(comMudanca(HASH, (c) => `${c}\nexport const p = () => import("lodash");\n`))).toEqual([
      "pacote-npm src/hash.ts",
    ]);
  });

  test("o arquivo da exceção importando OUTRO pacote → reprova (a exceção é pacote a pacote)", () => {
    expect(tipos(comMudanca(PROVA, (c) => noTopo(c, 'import "zod";')))).toEqual(["pacote-npm ferramentas/navegador/prova-automatica.ts"]);
  });

  test("a exceção que deixou de ser usada → reprova", () => {
    const sem = comMudanca(PROVA, (c) => c.replace('import { chromium } from "playwright";', "const chromium = null as never;"));
    expect(tipos(sem)).toEqual(["excecao-que-sobrou ferramentas/navegador/prova-automatica.ts"]);
  });

  test("a exceção para um arquivo que não existe → reprova", () => {
    const r = conferirONodeSemNpm(lido(CODIGOS, NODE), [
      ...EXCECOES_DE_PACOTE,
      { arquivo: `${ADAPTADOR}/ferramentas/fantasma.ts`, pacotes: ["x"], motivo: "teste" },
    ]);
    expect(tipos(r)).toEqual(["excecao-sem-arquivo ferramentas/fantasma.ts"]);
  });

  test("import relativo para arquivo que não existe → reprova", () => {
    expect(tipos(comMudanca(HASH, (c) => noTopo(c, 'import { x } from "./nao-existe.ts";')))).toEqual([
      "relativo-quebrado src/hash.ts",
    ]);
  });

  test("`package.json` no Symbios → reprova; no `upstream/`, não é desta régua", () => {
    const r = (extra: string) => conferirONodeSemNpm(lido(CODIGOS, NODE, [extra])).problemas.map((p) => p.tipo);
    expect(r("external-engines/symbios/adapter/package.json")).toEqual(["manifesto-npm"]);
    expect(r("external-engines/symbios/archilly/bun.lock")).toEqual(["manifesto-npm"]);
    expect(r("external-engines/symbios/upstream/web/package.json")).toEqual([]);
  });

  test("arquivo que o Node não foi perguntado → reprova, não aprova", () => {
    const r = conferirONodeSemNpm(lido(CODIGOS, { ...NODE, vereditos: {} }));
    expect(new Set(r.problemas.map((p) => p.tipo))).toEqual(new Set(["sem-veredito-do-node"]));
    expect(r.problemas.length).toBe(CAMINHOS.length);
  });
});

describe("LAB-133 · o caso válido que quase parece inválido", () => {
  test("pacote MENCIONADO em comentário ou entre aspas não é importação", () => {
    const codigo = `// import x from "lodash"\n/* import y from "zod" */\nconst s = "import z from 'react'";\nexport { s };\n`;
    expect(importacoesDe(codigo)).toEqual([]);
    expect(tipos(comMudanca(HASH, (c) => `${c}\n${codigo}`))).toEqual([]);
  });

  test("`import type` de pacote some na remoção de tipos — o Node não precisa dele (limite declarado)", () => {
    expect(importacoesDe(`import type { Feature } from "geojson";\nexport const a = 1;\n`)).toEqual([]);
  });

  test("módulo nativo sem o prefixo `node:` é do Node, não do npm", () => {
    expect(tipoDaImportacao("fs")).toBe("node");
    expect(tipoDaImportacao("node:path")).toBe("node");
    expect(tipoDaImportacao("./geo.ts")).toBe("relativo");
    expect(tipoDaImportacao("playwright")).toBe("pacote");
  });

  test("tipos que o Node TIRA (interface, `type`, anotação, `as`) não são problema", () => {
    const codigo = `export interface I { a: number }\nexport type T = I | null;\nexport const f = (x: T): number => (x as I).a;\n`;
    expect(tipos(comMudanca(HASH, (c) => `${c}\n${codigo}`))).toEqual([]);
  });
});
