/**
 * **LAB-174 (item 900) · o Lab não tem banco — perguntado ao `git` a cada verde** (D402).
 *
 * ```sh
 * bun test tests/o-lab-nao-tem-banco.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` afirma, desde o LF-FINAL (14/09/2026), que o Lab *"não tem banco"* e que *"não existe
 * `supabase/`, não existe migração, não existe tabela"* — e por essa frase as três linhas de *Banco e RLS* ficam em
 * "não se aplica". Nenhuma trava a perguntava: um `supabase/migrations/…sql`, um `bun:sqlite` e um `.sqlite` plantados,
 * cada um numa cópia da casa, derrubaram só a contagem de arquivos do LAB-57. O motivo inteiro está no cabeçalho de
 * `src/o-lab-nao-tem-banco.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 *
 * Os nomes de módulo das plantas vão dentro de strings que não estão em posição de importação — por isso este arquivo
 * não é, ele mesmo, um achado da régua (e o teste da árvore de verdade confere isso a cada verde).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_FRASE,
  A_LINHA,
  A_PAGINA,
  O_QUE_ISTO_NAO_ALCANCA,
  bancoNoArquivo,
  conferirAArvore,
  conferirOBanco,
  dependenciasDoCargo,
} from "../src/o-lab-nao-tem-banco.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** Uma árvore mínima que passa: um arquivo de código, um `package.json` e um `Cargo.toml` sem banco. */
const BASE: Record<string, string> = {
  "external-engines/esteira/src/coisa.ts": 'import { readFileSync } from "node:fs";\nexport const x = 1;\n',
  "external-engines/esteira/package.json": JSON.stringify({ devDependencies: { typescript: "^5", zod: "^3" } }),
  "external-engines/symbios/archilly/wasm/Cargo.toml": '[dependencies]\nglam = "0.32"\nsymbios-tensor = { path = "../../upstream" }\n',
};

const conferir = (extra: Record<string, string | null> = {}) => {
  const arvore = new Map<string, string | null>([...Object.entries(BASE), ...Object.entries(extra)]);
  return conferirOBanco([...arvore.keys()], (c) => arvore.get(c) ?? null);
};
const tipos = (r: ReturnType<typeof conferir>) => r.problemas.map((p) => p.tipo);

describe("LAB-174 · a página diz o que esta trava pergunta, e aponta para ela", () => {
  const pagina = readFileSync(join(RAIZ, A_PAGINA), "utf8");

  test("o topo do SEGURANCA.md ainda diz que o Lab não tem banco", () => {
    // A frase quebra a linha dentro da citação (`não tem\n> banco`): lida como a regra se lê, sem o `>` e com o espaço
    // colapsado.
    expect(pagina.replace(/\n>\s*/g, " ").replace(/\s+/g, " ")).toContain(A_FRASE);
  });

  test("a linha de 'Banco e RLS' existe, diz que não há banco e nomeia esta trava", () => {
    const linha = pagina.split("\n").find((l) => l.startsWith(A_LINHA));
    expect(linha).toBeDefined();
    expect(linha).toContain("não há banco");
    expect(linha).toContain("o-lab-nao-tem-banco.ts");
  });

  test("o cabeçalho da trava da rede não diz mais que o verde.test.ts pergunta o banco", () => {
    const rede = readFileSync(join(RAIZ, "external-engines", "esteira", "src", "rede-em-execucao.ts"), "utf8");
    // A frase antiga, em afirmação (sem as aspas da citação que a desmente): "…pela ausência de `supabase/`, que o
    // `verde.test.ts` confere contra o disco)." — com o parêntese que a fechava.
    expect(rede).not.toContain("que o `verde.test.ts` confere contra o disco). **A quarta");
    expect(rede).toContain("o-lab-nao-tem-banco.ts");
  });

  test("o que a trava não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-174 · o que o git carrega hoje — zero banco, e o universo publicado", () => {
  test("nenhuma das cinco portas acha banco, e cada porta que lê texto leu alguma coisa", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `[o-lab-nao-tem-banco] ${r.caminhos} caminhos · ${r.lidos.js} JS/TS · ${r.lidos.rust} Rust · ${r.lidos.html} HTML · ${r.lidos.packageJson} package.json · ${r.lidos.cargoToml} Cargo.toml · ${r.achados.length} achado(s) · ${r.problemas.length} problema(s)`,
    );
    expect(r.problemas).toEqual([]);
    // 801 caminhos, 378 JS/TS, 23 Rust, 2 package.json e 5 Cargo.toml em 18/10/2026, antes do commit do LAB-174; só
    // crescem. Se encolherem, a régua passou a ler menos — é o vigia que não vigia nada (D164).
    expect(r.caminhos).toBeGreaterThanOrEqual(801);
    expect(r.lidos.js).toBeGreaterThanOrEqual(378);
    expect(r.lidos.rust).toBeGreaterThanOrEqual(23);
    expect(r.lidos.packageJson).toBeGreaterThanOrEqual(2);
    expect(r.lidos.cargoToml).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-174 · os dois lados da régua", () => {
  test("o caso bom passa: a árvore mínima, sem banco", () => {
    expect(conferir().problemas).toEqual([]);
  });

  test("o que quase parece banco e não é passa: o nome em comentário, em texto e em string fora de importação", () => {
    const r = conferir({
      "external-engines/esteira/src/quase.ts": [
        '// um dia isto pode ir para o "@supabase/supabase-js" — hoje não',
        'export const nota = "importar bun:sqlite está fora do escopo";',
        'export const lista = ["pg", "postgres", "redis"];',
        "export const migrations = 0; // a palavra solta não é pasta",
      ].join("\n"),
      "docs/relatorios/x.md": "não existe `supabase/`, não existe migração, não existe tabela\n",
      "external-engines/esteira/src/pgx.ts": "export const pgx = 1;\n",
      "external-engines/esteira/tests/sql-de-mentira.test.ts": "export {};\n",
    });
    expect(r.problemas).toEqual([]);
  });

  test("a pasta: supabase/, migrations/, drizzle/, prisma/ — em qualquer altura do caminho", () => {
    for (const p of ["supabase/config.toml", "a/migrations/x.txt", "external-engines/x/drizzle/y.ts", "prisma/LEIA-ME"]) {
      const r = conferir({ [p]: "" });
      expect(tipos(r), p).toContain("banco-na-arvore");
      expect(r.achados.some((a) => a.porta === "pasta"), p).toBe(true);
    }
  });

  test("o arquivo: .sql, .db, .sqlite, .sqlite3, .duckdb, .prisma e o drizzle.config", () => {
    for (const p of ["x.sql", "dados/a.db", "a.sqlite", "a.SQLITE3", "a.duckdb", "schema.prisma", "drizzle.config.ts"]) {
      const r = conferir({ [p]: "" });
      expect(r.achados.some((a) => a.porta === "arquivo"), p).toBe(true);
    }
  });

  test("o módulo: from, require( e import( de um cliente de banco, com e sem subcaminho", () => {
    const casos = [
      'import { Database } from "bun:sqlite";',
      'import { DatabaseSync } from "node:sqlite";',
      "const pg = require('pg');",
      'const { createClient } = await import("@supabase/supabase-js");',
      'import { drizzle } from "drizzle-orm/bun-sqlite";',
      'import Redis from "ioredis";',
    ];
    for (const linha of casos) {
      const r = conferir({ "external-engines/esteira/src/guardar.ts": `${linha}\n` });
      expect(
        r.achados.some((a) => a.porta === "modulo"),
        linha,
      ).toBe(true);
    }
  });

  test("o módulo no Rust: use e extern crate de um crate de banco", () => {
    for (const linha of ["use rusqlite::Connection;", "use tokio_postgres::Client;", "extern crate diesel;"]) {
      const a = bancoNoArquivo("external-engines/symbios/archilly/wasm/src/lib.rs", `${linha}\n`);
      expect(
        a.some((x) => x.porta === "modulo"),
        linha,
      ).toBe(true);
    }
    // O `use` em comentário não conta.
    expect(bancoNoArquivo("a.rs", "// use rusqlite::Connection;\n")).toEqual([]);
  });

  test("a dependência: no package.json (as quatro listas) e no Cargo.toml (as três tabelas, a forma longa e o renomeado)", () => {
    for (const lista of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
      const r = conferir({ "external-engines/x/package.json": JSON.stringify({ [lista]: { "@supabase/supabase-js": "^2" } }) });
      expect(
        r.achados.some((a) => a.porta === "dependencia"),
        lista,
      ).toBe(true);
    }
    expect(dependenciasDoCargo('[dependencies]\nrusqlite = "0.31"\n')).toEqual(["rusqlite"]);
    expect(dependenciasDoCargo('[dev-dependencies]\nsqlx = { version = "0.8" }\n')).toEqual(["sqlx"]);
    expect(dependenciasDoCargo("[target.'cfg(unix)'.dependencies]\nsled = \"0.34\"\n")).toEqual(["sled"]);
    expect(dependenciasDoCargo('[dependencies.diesel]\nversion = "2"\n')).toEqual(["diesel"]);
    expect(dependenciasDoCargo('[dependencies]\nbanco = { package = "rusqlite", version = "0.31" }\n')).toEqual([
      "rusqlite",
    ]);
    // O `[package]` e o `[features]` não são dependência.
    expect(dependenciasDoCargo('[package]\nname = "redis"\n[features]\npostgres = []\n')).toEqual([]);
    const r = conferir({ "external-engines/x/Cargo.toml": '[dependencies]\ntokio_postgres = "0.7"\n' });
    expect(r.achados.some((a) => a.porta === "dependencia")).toBe(true);
  });

  test("o navegador: indexedDB e openDatabase( no código e na página da bancada; em comentário, não", () => {
    const abrir = ["indexed", "DB.open('lab')"].join("");
    expect(conferir({ "x/prova.js": `const r = ${abrir};\n` }).achados.map((a) => a.porta)).toEqual(["navegador"]);
    expect(conferir({ "x/index.html": `<script>${abrir}</script>\n` }).achados.map((a) => a.porta)).toEqual([
      "navegador",
    ]);
    expect(conferir({ "x/prova.js": `// ${abrir}\n` }).problemas).toEqual([]);
  });

  test("o universo vazio e a porta que não leu nada reprovam — verde sobre zero não é verde", () => {
    expect(conferirOBanco([], () => null).problemas.map((p) => p.tipo)).toEqual(["universo-vazio"]);
    const soMd = conferirOBanco(["a.md"], () => "texto");
    expect(soMd.problemas.map((p) => p.tipo).sort()).toEqual(["porta-sem-leitura", "porta-sem-leitura"]);
  });

  test("as três mutações de 18/10, que só a contagem do LAB-57 pegava, caem aqui com o motivo", () => {
    const sql = conferir({ "supabase/migrations/0001_estudos.sql": "create table estudos (id uuid primary key);\n" });
    expect(sql.problemas.length).toBeGreaterThan(0);
    expect(sql.problemas[0]!.detalhe).toContain("Banco e RLS");
    const bun = conferir({
      "external-engines/esteira/src/guardar.ts": 'import { Database } from "bun:sqlite";\nexport const b = new Database("m.sqlite");\n',
    });
    expect(bun.achados.map((a) => a.oQue)).toEqual(["bun:sqlite"]);
    const arquivo = conferir({ "dados/medicoes.sqlite": null });
    expect(arquivo.achados.map((a) => a.porta)).toEqual(["arquivo"]);
  });
});
