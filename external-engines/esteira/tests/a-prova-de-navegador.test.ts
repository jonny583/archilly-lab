/**
 * **LAB-175 (item 900) · a prova de navegador — perguntada pelo lugar a cada verde** (D403).
 *
 * ```sh
 * bun test tests/a-prova-de-navegador.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026), que *"a única prova de navegador que existe é a do
 * LAB-01"* e que o Lab *"não tem tela"*. Eram duas provas desde o LAB-31, a bancada é a exceção declarada do `CLAUDE.md`
 * §4, e a prova automática escuta o console sem reprovar por ele. O motivo inteiro está no cabeçalho de
 * `src/a-prova-de-navegador.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ARTEFATOS,
  A_PAGINA,
  O_ITEM,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  PRODUTORES,
  conferirAArvore,
  conferirAProva,
  condutoresImportados,
  consoleReprova,
  oItem,
} from "../src/a-prova-de-navegador.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PRODUTOR = PRODUTORES[0]!.caminho;
const PAGINA = readFileSync(join(RAIZ, A_PAGINA), "utf8");
const TEXTO_DO_PRODUTOR = readFileSync(join(RAIZ, PRODUTOR), "utf8");

/** A árvore mínima que passa: a página e o produtor de verdade, os dois artefatos e um arquivo de código qualquer. */
const BASE: Record<string, string> = {
  [A_PAGINA]: PAGINA,
  [PRODUTOR]: TEXTO_DO_PRODUTOR,
  "outputs/lab01/navegador.png": "",
  "docs/provas/LAB-31/navegador.json": "{}",
  "external-engines/esteira/src/coisa.ts": 'import { readFileSync } from "node:fs";\nexport const x = 1;\n',
};

const conferir = (extra: Record<string, string | null> = {}) => {
  const arvore = new Map<string, string | null>(Object.entries(BASE));
  for (const [k, v] of Object.entries(extra)) {
    if (v === null) arvore.delete(k);
    else arvore.set(k, v);
  }
  return conferirAProva([...arvore.keys()], (c) => arvore.get(c) ?? null);
};
const tipos = (r: ReturnType<typeof conferir>) => r.problemas.map((p) => p.tipo);
const naPagina = (de: string, para: string) => {
  expect(PAGINA).toContain(de);
  return { [A_PAGINA]: PAGINA.replace(de, para) };
};

describe("LAB-175 · a página diz o que esta trava pergunta, e aponta para ela", () => {
  test("o item existe, nomeia a trava e diz que o console não reprova", () => {
    const item = oItem(PAGINA);
    expect(item).not.toBeNull();
    expect(item!.startsWith(O_ITEM)).toBe(true);
    expect(item).toContain(O_PONTEIRO);
    expect(item).toMatch(/console não reprova/i);
  });

  test("o topo ainda diz que o Lab não tem banco nem rede em execução (as outras réguas leem a mesma frase)", () => {
    const topo = PAGINA.replace(/\n>\s*/g, " ").replace(/\s+/g, " ");
    expect(topo).toContain("não tem banco");
    expect(topo).toContain("não faz chamada de rede em execução");
    expect(topo).toContain("bancada");
  });
});

describe("LAB-175 · as peças da régua, dos dois lados", () => {
  test("condutor importado é achado; condutor em string solta ou em comentário não é", () => {
    expect(condutoresImportados('import { chromium } from "playwright";')).toEqual(["playwright"]);
    expect(condutoresImportados('const p = await import("puppeteer-core");')).toEqual(["puppeteer-core"]);
    expect(condutoresImportados('const x = require("@playwright/test/reporter");')).toEqual(["@playwright/test/reporter"]);
    expect(condutoresImportados('const nome = "playwright";')).toEqual([]);
    expect(condutoresImportados('// import { chromium } from "playwright";\nexport const y = 2;')).toEqual([]);
    expect(condutoresImportados('import x from "playwrights";')).toEqual([]);
  });

  test("o produtor de hoje NÃO reprova por console; com um `if (erroNaPagina)` ele passa a reprovar", () => {
    expect(consoleReprova(TEXTO_DO_PRODUTOR)).toBe(false);
    const comIf = TEXTO_DO_PRODUTOR.replace(
      "servidor.stop(true);\n\nif (!prova)",
      'servidor.stop(true);\n\nif (erroNaPagina) morrer("a página lançou um erro", erroNaPagina);\nif (!prova)',
    );
    expect(comIf).not.toBe(TEXTO_DO_PRODUTOR);
    expect(consoleReprova(comIf)).toBe(true);
    // O `if` dentro de um comentário não conta.
    const comentado = TEXTO_DO_PRODUTOR.replace("if (!prova)", "// if (erroNaPagina) morrer('x', '')\nif (!prova)");
    expect(consoleReprova(comentado)).toBe(false);
  });
});

describe("LAB-175 · as mutações — cada uma acusada pelo nome", () => {
  test("a base passa", () => {
    expect(tipos(conferir())).toEqual([]);
  });

  test("um produtor novo de prova de navegador, fora da lista", () => {
    expect(tipos(conferir({ "external-engines/esteira/src/outra-prova.ts": 'import puppeteer from "puppeteer";\n' }))).toEqual([
      "produtor-fora-da-lista",
    ]);
  });

  test("o produtor que deixa de importar o condutor", () => {
    const sem = TEXTO_DO_PRODUTOR.replace('import { chromium } from "playwright";', "const chromium = null as never;");
    expect(sem).not.toBe(TEXTO_DO_PRODUTOR);
    expect(tipos(conferir({ [PRODUTOR]: sem }))).toEqual(["produtor-que-sumiu"]);
  });

  test("o produtor que passa a reprovar por console, com a declaração e a página paradas", () => {
    const comIf = TEXTO_DO_PRODUTOR.replace("if (!prova)", 'if (erroNaPagina) morrer("erro na página", "");\nif (!prova)');
    expect(tipos(conferir({ [PRODUTOR]: comIf }))).toEqual(["console-declarado-errado"]);
  });

  test("um artefato novo de navegador, fora da lista; e um que sumiu", () => {
    expect(tipos(conferir({ "docs/provas/LAB-999/navegador-celular.png": "" }))).toEqual(["artefato-fora-da-lista"]);
    expect(tipos(conferir({ "outputs/lab01/navegador.png": null }))).toEqual(["artefato-que-sumiu"]);
  });

  test("a página que volta a dizer 'única prova'", () => {
    const r = conferir(naPagina("As provas de navegador são **duas**", "A única prova de navegador são **duas**"));
    expect(tipos(r)).toEqual(["item-diz-unica"]);
  });

  test("a página que cala um artefato, a bancada ou a trava", () => {
    expect(tipos(conferir(naPagina("(`docs/provas/LAB-31/navegador.json`,", "(o JSON,")))).toEqual(["item-nao-nomeia"]);
    expect(
      tipos(conferir(naPagina("(`external-engines/symbios/adapter/ferramentas/navegador/index.html`)", "(a página)"))),
    ).toEqual(["item-nao-nomeia"]);
    expect(tipos(conferir(naPagina(`(\`${O_PONTEIRO}\`;`, "(a trava;")))).toEqual(["item-nao-nomeia"]);
  });

  test("a página que cala o console", () => {
    expect(tipos(conferir(naPagina("**O console não reprova:**", "**Sobre o console:**")))).toEqual(["item-cala-o-console"]);
  });

  test("a linha que diz 'não tem tela' sem a bancada, em qualquer lugar da página", () => {
    const r = conferir({ [A_PAGINA]: `${PAGINA}\nO Lab não tem tela.\n` });
    expect(tipos(r)).toEqual(["tela-sem-bancada"]);
  });

  test("o item ausente, e o universo vazio", () => {
    expect(tipos(conferir(naPagina(O_ITEM, "- **Prova no navegador.**")))).toEqual(["item-ausente"]);
    expect(tipos(conferirAProva([], () => null))).toContain("universo-vazio");
  });
});

describe("LAB-175 · a árvore de verdade", () => {
  const r = conferirAArvore(RAIZ);

  test("zero problemas, com o universo publicado", () => {
    console.log(
      `  a prova de navegador: ${r.caminhos} caminhos · ${r.lidosJs} JS/TS lidos · ` +
        `${r.produtoresNaArvore.length} produtor(es) · ${r.artefatosNaArvore.length} artefato(s) · ${r.problemas.length} problemas`,
    );
    for (const n of O_QUE_ISTO_NAO_ALCANCA) console.log(`    NÃO alcança: ${n}`);
    expect(r.problemas).toEqual([]);
    expect(r.caminhos).toBeGreaterThan(700);
    expect(r.lidosJs).toBeGreaterThan(300);
  });

  test("as duas listas batem com a árvore, e a lista de artefatos nomeia o produtor declarado", () => {
    expect(r.produtoresNaArvore).toEqual(PRODUTORES.map((p) => p.caminho));
    expect([...r.artefatosNaArvore].sort()).toEqual(ARTEFATOS.map((a) => a.caminho).sort());
    for (const a of ARTEFATOS) if (a.produtor) expect(PRODUTORES.map((p) => p.caminho)).toContain(a.produtor);
  });

  test("o buraco está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(3);
    expect(O_QUE_ISTO_NAO_ALCANCA.some((n) => /RODA/.test(n))).toBe(true);
  });
});
