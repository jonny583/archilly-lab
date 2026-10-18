/**
 * **LAB-184 (item 900) · o Lab não tem conta de usuário — perguntado ao `git`, pela porta, a cada verde** (D412).
 *
 * ```sh
 * bun test tests/o-lab-nao-tem-conta.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` abre, desde o LF-FINAL (14/09/2026), com quatro negações; três ganharam trava, e a da conta só
 * tinha a porta da Central. Uma biblioteca de senha, um campo de senha na bancada e um cookie de sessão, plantados cada
 * um numa cópia da casa, não derrubavam trava nenhuma que dissesse por quê. O motivo inteiro está no cabeçalho de
 * `src/o-lab-nao-tem-conta.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 *
 * As plantas são montadas em pedaços (`SENHA`, `SET_COOKIE`, `DOC_COOKIE`) e os nomes de módulo vão em strings fora de
 * posição de importação — por isso este arquivo não é, ele mesmo, um achado da régua (e o teste da árvore de verdade
 * confere isso a cada verde).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_NEGACOES,
  AS_PORTAS,
  A_FRASE,
  CRATES,
  MODULOS_JS,
  A_PAGINA,
  O_QUE_ISTO_NAO_ALCANCA,
  SENHA,
  SET_COOKIE,
  conferirAArvore,
  conferirAPagina,
  conferirAsPortas,
  contaNoArquivo,
  oParagrafo,
} from "../src/o-lab-nao-tem-conta.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const DOC_COOKIE = ["document", "cookie"].join(".");
const CAMPO = `<input type="${SENHA}">`;

/** Uma árvore mínima que passa: um arquivo de código, uma página, um `package.json` e um `Cargo.toml` sem conta. */
const BASE: Record<string, string> = {
  "external-engines/esteira/src/coisa.ts": 'import { readFileSync } from "node:fs";\nexport const x = 1;\n',
  "external-engines/symbios/adapter/ferramentas/navegador/index.html": '<canvas id="tela"></canvas><input type="number">\n',
  "external-engines/esteira/package.json": JSON.stringify({ devDependencies: { typescript: "^5", zod: "^3" } }),
  "external-engines/symbios/archilly/wasm/Cargo.toml": '[dependencies]\nglam = "0.32"\n',
};

const conferir = (extra: Record<string, string | null> = {}) => {
  const arvore = new Map<string, string | null>([...Object.entries(BASE), ...Object.entries(extra)]);
  return conferirAsPortas([...arvore.keys()], (c) => arvore.get(c) ?? null);
};
const portas = (r: ReturnType<typeof conferir>) => r.achados.map((a) => a.porta);

describe("LAB-184 · o que o git carrega hoje — zero conta, e o universo publicado", () => {
  test("nenhuma das quatro portas acha conta, a página nomeia as travas, e cada porta leu alguma coisa", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `[o-lab-nao-tem-conta] ${r.caminhos} caminhos · ${r.lidos.js} JS/TS · ${r.lidos.rust} Rust · ${r.lidos.html} HTML · ${r.lidos.packageJson} package.json · ${r.lidos.cargoToml} Cargo.toml · ${r.achados.length} achado(s) · ${r.problemas.length} problema(s)`,
    );
    expect(r.problemas).toEqual([]);
    // Medido em 18/10/2026, antes dos dois arquivos do LAB-184: 833 caminhos, 399 JS/TS, 23 Rust, 1 HTML, 2 package.json e
    // 5 Cargo.toml; só crescem. Se encolherem, a régua passou a ler menos — é o vigia que não vigia nada (D164).
    expect(r.caminhos).toBeGreaterThanOrEqual(833);
    expect(r.lidos.js).toBeGreaterThanOrEqual(399);
    expect(r.lidos.rust).toBeGreaterThanOrEqual(23);
    expect(r.lidos.html).toBeGreaterThanOrEqual(1);
    expect(r.lidos.packageJson).toBeGreaterThanOrEqual(2);
    expect(r.lidos.cargoToml).toBeGreaterThanOrEqual(5);
  });

  test("a trava do banco não diz mais que a conta só é perguntada pela Central", () => {
    const banco = readFileSync(join(RAIZ, "external-engines", "esteira", "src", "o-lab-nao-tem-banco.ts"), "utf8");
    expect(banco).toContain("o-lab-nao-tem-conta.ts");
  });

  test("o que a trava não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-184 · a página: as quatro negações, cada uma com a trava nomeada", () => {
  const pagina = readFileSync(join(RAIZ, A_PAGINA), "utf8");
  const existe = () => true;

  test("o parágrafo do topo diz a frase da conta", () => {
    expect(oParagrafo(pagina)).toContain(A_FRASE);
  });

  test("a página de hoje passa", () => {
    expect(conferirAPagina(pagina, existe)).toEqual([]);
  });

  test("tirar o nome de cada trava do parágrafo reprova, uma a uma", () => {
    for (const { travas } of AS_NEGACOES)
      for (const t of travas) {
        const nome = t.split("/").pop()!;
        const p = oParagrafo(pagina)!;
        expect(p).toContain(nome);
        // Só o parágrafo perde o nome: a seção da rodada, abaixo, pode citá-lo à vontade.
        const ini = pagina.indexOf("> **Leia primeiro");
        const fim = pagina.indexOf("\n\n", ini);
        const sem = pagina.slice(0, ini) + pagina.slice(ini, fim).replaceAll(nome, "x.ts") + pagina.slice(fim);
        expect(
          conferirAPagina(sem, existe).map((x) => x.tipo),
          nome,
        ).toContain("trava-nao-nomeada");
      }
  });

  test("a trava nomeada que não existe no disco reprova", () => {
    const tipos = conferirAPagina(pagina, (c) => !c.endsWith("a-adocao-da-central.ts")).map((x) => x.tipo);
    expect(tipos).toEqual(["trava-nao-existe"]);
  });

  test("a frase que some do parágrafo reprova, e o parágrafo que some também", () => {
    expect(conferirAPagina(pagina.replace(A_FRASE, "não tem cadastro"), existe).map((x) => x.tipo)).toContain("frase-sumiu");
    expect(conferirAPagina(pagina.replace("> **Leia primeiro", "> **Leia antes"), existe).map((x) => x.tipo)).toEqual([
      "frase-sumiu",
    ]);
  });

  test("os dois números da tabela são os tamanhos das listas, contados, não lembrados", () => {
    expect(pagina).toContain(`(${MODULOS_JS.length} nomes de JavaScript, ${CRATES.length} crates de Rust)`);
  });

  test("a seção da rodada diz as quatro portas; uma a menos reprova", () => {
    for (const porta of AS_PORTAS) {
      const ini = pagina.indexOf("## Reconferido no LAB-184");
      expect(ini).toBeGreaterThan(-1);
      const fim = pagina.indexOf("\n## ", ini + 1);
      const secao = pagina.slice(ini, fim === -1 ? pagina.length : fim);
      const sem = pagina.replace(secao, secao.replaceAll(`\`${porta}\``, "`outra`"));
      expect(
        conferirAPagina(sem, existe).map((x) => x.tipo),
        porta,
      ).toContain("secao-sem-porta");
    }
  });
});

describe("LAB-184 · os dois lados da régua", () => {
  test("o caso bom passa: a árvore mínima, sem conta", () => {
    expect(conferir().problemas).toEqual([]);
  });

  test("o que quase parece conta e não é passa: o nome em comentário, em texto, o campo de outro tipo, a palavra solta", () => {
    const r = conferir({
      "external-engines/esteira/src/quase.ts": [
        '// um dia isto pode usar o "next-auth" — hoje não',
        `// ${DOC_COOKIE} aqui seria sessão`,
        'export const nota = "importar bcryptjs está fora do escopo";',
        'export const lista = ["jose", "passport", "argon2"];',
        `export const tipo = "${SENHA}"; // a palavra, sem ser o type de um campo`,
        'export const cookie = "biscoito"; // a palavra solta não é cookie de sessão',
        'export const campo = "<input type=\\"text\\">";',
      ].join("\n"),
      "external-engines/symbios/adapter/ferramentas/navegador/outra.html": `<!-- ${CAMPO} -->\n<input type="range">\n`,
      "docs/relatorios/x.md": `${CAMPO} e ${DOC_COOKIE} num relatório não são código\n`,
      "external-engines/esteira/src/josefa.ts": "export const josefa = 1;\n",
    });
    expect(r.problemas).toEqual([]);
  });

  test("o módulo: from, require( e import( de uma biblioteca de identidade, com subcaminho, escopo e prefixo", () => {
    const casos = [
      'import bcrypt from "bcryptjs";',
      "const jwt = require('jsonwebtoken');",
      'const { getServerSession } = await import("next-auth/next");',
      'import { SignIn } from "@clerk/nextjs";',
      'import { Strategy } from "passport-local";',
      'import { createServerClient } from "@supabase/ssr";',
      'import { getAuth } from "firebase/auth";',
    ];
    for (const linha of casos) {
      const r = conferir({ "external-engines/esteira/src/entrar.ts": `${linha}\n` });
      expect(portas(r), linha).toContain("modulo");
      expect(r.problemas.map((p) => p.tipo), linha).toContain("conta-na-arvore");
    }
  });

  test("o módulo no Rust: use e extern crate de um crate de identidade", () => {
    for (const linha of ["use jsonwebtoken::encode;", "use argon2::Argon2;", "extern crate oauth2;", "use tower_sessions::Session;"]) {
      const a = contaNoArquivo("external-engines/symbios/archilly/wasm/src/lib.rs", `${linha}\n`);
      expect(a.map((x) => x.porta), linha).toContain("modulo");
    }
    expect(contaNoArquivo("x.rs", "// use jsonwebtoken::encode;\nuse glam::Vec2;\n")).toEqual([]);
  });

  test("a dependência: package.json (as quatro listas) e Cargo.toml (as três tabelas e a forma longa)", () => {
    const pkg = (k: string, n: string) => JSON.stringify({ [k]: { [n]: "^1" } });
    for (const [k, n] of [
      ["dependencies", "iron-session"],
      ["devDependencies", "@auth/core"],
      ["peerDependencies", "lucia"],
      ["optionalDependencies", "@supabase/auth-helpers-nextjs"],
    ] as const)
      expect(portas(conferir({ "external-engines/esteira/package.json": pkg(k, n) })), n).toContain("dependencia");
    for (const toml of [
      '[dependencies]\njsonwebtoken = "9"\n',
      '[dev-dependencies]\nargon2 = "0.5"\n',
      '[target.wasm32-unknown-unknown.dependencies]\noauth2 = "4"\n',
      '[dependencies.tower_sessions]\nversion = "0.12"\n',
      '[dependencies]\nsenha = { package = "bcrypt", version = "0.15" }\n',
    ])
      expect(portas(conferir({ "external-engines/symbios/archilly/wasm/Cargo.toml": toml })), toml).toContain("dependencia");
  });

  test("a senha: o campo no .html, com as aspas que vierem, e o autocomplete", () => {
    for (const html of [
      CAMPO,
      `<input type='${SENHA}' name="s">`,
      `<input type=${SENHA}>`,
      `<input autocomplete="current-${SENHA}">`,
      `<input autocomplete="new-${SENHA}">`,
    ]) {
      const r = conferir({ "external-engines/symbios/adapter/ferramentas/navegador/index.html": `<form>${html}</form>\n` });
      expect(portas(r), html).toContain("senha");
    }
  });

  test("a senha no código: o campo dentro de uma string e o type posto à mão", () => {
    for (const js of [
      `document.body.innerHTML = '${CAMPO}';`,
      `const el = document.createElement("input");\nel.type = "${SENHA}";`,
      `const campo = { type: "${SENHA}", name: "s" };`,
    ]) {
      const r = conferir({ "external-engines/symbios/adapter/ferramentas/navegador/prova.js": `${js}\n` });
      expect(portas(r), js).toContain("senha");
    }
  });

  test("o cookie: document.cookie e cookieStore no código e no .html, e o cabeçalho que grava cookie", () => {
    const casos: [string, string][] = [
      ["external-engines/symbios/adapter/ferramentas/navegador/prova.js", `${DOC_COOKIE} = "sessao=1";\n`],
      ["external-engines/symbios/adapter/ferramentas/navegador/prova.js", "await cookieStore.set('s', '1');\n"],
      ["external-engines/symbios/adapter/ferramentas/navegador/index.html", `<script>${DOC_COOKIE} = "s=1"</script>\n`],
      [
        "external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts",
        `return new Response("", { headers: { "${SET_COOKIE}": "s=1" } });\n`,
      ],
    ];
    for (const [c, t] of casos) expect(portas(conferir({ [c]: t })), t).toContain("cookie");
  });

  test("o universo vazio e a porta que não leu nada reprovam — verde sobre zero não é verde", () => {
    expect(conferirAsPortas([], () => null).problemas.map((p) => p.tipo)).toEqual(["universo-vazio"]);
    const soMd = conferirAsPortas(["docs/a.md"], () => "texto");
    expect(soMd.problemas.map((p) => p.tipo)).toEqual(["porta-sem-leitura", "porta-sem-leitura", "porta-sem-leitura"]);
  });

  test("o node_modules fica fora: dependência de dependência não é conta da casa", () => {
    const r = conferir({ "external-engines/esteira/node_modules/x/index.js": 'import j from "jsonwebtoken";\n' });
    expect(r.problemas).toEqual([]);
  });
});
