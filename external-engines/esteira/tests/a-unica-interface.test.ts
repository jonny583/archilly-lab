/**
 * **LAB-153 (item 900) · não tem interface — com UMA exceção, declarada** (D381).
 *
 * ```sh
 * bun test tests/a-unica-interface.test.ts
 * ```
 *
 * O `CLAUDE.md` §4 diz que o repositório não tem interface, fora a bancada do navegador; a guarda do LAB-36 contava só
 * `.html`, só no disco de `external-engines/`, e passou uma página em `docs/` e um componente `.tsx` postos no `git`. O
 * motivo inteiro, com as três portas contadas, está no cabeçalho de `src/a-unica-interface.ts`.
 *
 * Roda **sem clones** (lê o `git ls-files` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  EXCECAO,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirAArvore,
  conferirAUnicaInterface,
  portaPeloNome,
  sobeServidor,
} from "../src/a-unica-interface.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const BANCADA = "external-engines/symbios/adapter/ferramentas/navegador/index.html";
const SERVIDOR = "external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts";
const SERVIDOR_DE_HOJE = `const servidor = Bun.serve({ port: 0, fetch() { return new Response("ok"); } });\n`;

/** Um repositório de mentira: caminho → texto. Os arquivos carregados são as chaves. */
const HOJE: Record<string, string> = {
  [BANCADA]: "<!doctype html><script type=module src=prova.js></script>\n",
  [SERVIDOR]: SERVIDOR_DE_HOJE,
  "external-engines/esteira/src/porta/porta.ts": "export const x = 1;\n",
  "docs/INDEX.md": "# índice\n",
};
const conferir = (arvore: Record<string, string>) =>
  conferirAUnicaInterface(Object.keys(arvore), (c) => arvore[c] ?? null).problemas.map(
    (p) => `${p.tipo}:${p.caminho}`,
  );

describe("LAB-153 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §4 diz que não tem interface, com uma exceção declarada, e nomeia a bancada", () => {
    const claude = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    expect(aRegraEstaEscrita(claude, A_REGRA)).toBe(true);
    expect(claude).toContain(BANCADA);
  });

  test("a exceção são dois arquivos, cada um com porta e motivo", () => {
    expect(EXCECAO.map((e) => `${e.porta}:${e.caminho}`)).toEqual([`pagina:${BANCADA}`, `servidor:${SERVIDOR}`]);
    for (const e of EXCECAO) expect(e.motivo.length).toBeGreaterThan(20);
  });
});

describe("LAB-153 · a árvore de hoje", () => {
  const r = conferirAArvore(RAIZ);

  test("nenhum problema", () => {
    expect(r.problemas).toEqual([]);
  });

  test("as três portas acham exatamente a exceção declarada", () => {
    expect(r.achados).toEqual([
      { caminho: BANCADA, porta: "pagina" },
      { caminho: SERVIDOR, porta: "servidor" },
    ]);
  });

  test("o universo lido se publica, e não é pequeno (D164)", () => {
    // 733 arquivos e 334 de código no dia do LAB-153; o piso é folgado de propósito, para não travar arquivo novo.
    expect(r.universo).toBeGreaterThan(600);
    expect(r.codigoLido).toBeGreaterThan(300);
  });
});

describe("LAB-153 · o lado bom", () => {
  test("a árvore só com a exceção passa", () => {
    expect(conferir(HOJE)).toEqual([]);
  });

  test("servidor citado em comentário ou em string não é servidor", () => {
    expect(sobeServidor("// o LAB-03 usa Bun.serve( para abrir a bancada\n")).toBe(false);
    expect(sobeServidor('const nome = "createServer(";\n')).toBe(false);
    expect(sobeServidor("/* createServer() */ export {};\n")).toBe(false);
    expect(conferir({ ...HOJE, "external-engines/esteira/src/nota.ts": "// Bun.serve( é da bancada\n" })).toEqual([]);
  });

  test("nome que só CONTÉM html não é página; `.d.ts` e `.md` não são componente", () => {
    expect(portaPeloNome("external-engines/esteira/src/html.ts")).toBeNull();
    expect(portaPeloNome("docs/relatorios/HTML.md")).toBeNull();
    expect(portaPeloNome("external-engines/esteira/src/tipos.d.ts")).toBeNull();
  });

  test("o que mora em node_modules não é desta casa", () => {
    expect(conferir({ ...HOJE, "external-engines/esteira/node_modules/pacote/index.html": "<html>" })).toEqual([]);
  });
});

describe("LAB-153 · o lado ruim, plantado", () => {
  test("as duas formas da mutação do LAB-153, que a guarda do LAB-36 passava", () => {
    expect(
      conferir({
        ...HOJE,
        "docs/painel/index.html": '<!doctype html><form><input name="gleba"></form>\n',
        "external-engines/testfit/adapter/src/Painel.tsx": "export const P = () => <form />;\n",
      }),
    ).toEqual([
      "interface-fora-da-excecao:docs/painel/index.html",
      "interface-fora-da-excecao:external-engines/testfit/adapter/src/Painel.tsx",
    ]);
  });

  test("cada porta pelo nome: .htm, .xhtml, .jsx, .vue, .svelte, .astro — em qualquer pasta", () => {
    for (const c of [
      "pagina.htm",
      "upstream/x/doc.xhtml",
      "external-engines/symbios/adapter/ferramentas/navegador/Outra.jsx",
      "docs/Tela.vue",
      "external-engines/esteira/src/Tela.svelte",
      "site/index.astro",
    ])
      expect(conferir({ ...HOJE, [c]: "" })).toEqual([`interface-fora-da-excecao:${c}`]);
  });

  test("uma segunda página na MESMA pasta da bancada não herda a exceção", () => {
    const c = "external-engines/symbios/adapter/ferramentas/navegador/painel.html";
    expect(conferir({ ...HOJE, [c]: "<html>" })).toEqual([`interface-fora-da-excecao:${c}`]);
  });

  test("servidor de página noutro arquivo, pelas duas formas", () => {
    expect(conferir({ ...HOJE, "a/servir.ts": SERVIDOR_DE_HOJE })).toEqual(["interface-fora-da-excecao:a/servir.ts"]);
    expect(
      conferir({ ...HOJE, "b/servir.mjs": 'import { createServer } from "node:http";\ncreateServer(() => {}).listen(1);\n' }),
    ).toEqual(["interface-fora-da-excecao:b/servir.mjs"]);
  });

  test("a exceção que sumiu, ou mudou de porta, é acusada (o outro sentido)", () => {
    const semBancada = { ...HOJE };
    delete semBancada[BANCADA];
    expect(conferir(semBancada)).toEqual([`excecao-que-sumiu:${BANCADA}`]);
    expect(conferir({ ...HOJE, [SERVIDOR]: "export const semServidor = 1;\n" })).toEqual([
      `excecao-que-sumiu:${SERVIDOR}`,
    ]);
  });

  test("a exceção que declara a porta errada não cobre o arquivo: a página não vira servidor por estar na lista", () => {
    const trocada = EXCECAO.map((e) => (e.caminho === BANCADA ? { ...e, porta: "servidor" as const } : e));
    const r = conferirAUnicaInterface(Object.keys(HOJE), (c) => HOJE[c] ?? null, trocada);
    expect(r.problemas.map((p) => `${p.tipo}:${p.porta}`)).toEqual([
      "interface-fora-da-excecao:pagina",
      "excecao-que-sumiu:servidor",
    ]);
  });

  test("o universo vazio não sai verde (D164)", () => {
    expect(conferir({})).toContain("universo-vazio:—");
  });
});

describe("LAB-153 · o buraco, dito", () => {
  test("a trava declara o que não alcança", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    expect(O_QUE_ISTO_NAO_ALCANCA.join("\n")).toContain("git");
  });
});
