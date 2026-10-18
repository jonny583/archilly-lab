/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O LAB NÃO TEM BANCO — perguntado ao `git`, pelo LUGAR e pela IMPORTAÇÃO. (LAB-174, item 900, D402)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, do LF-FINAL (14/09/2026), abre dizendo que o Lab *"não tem tela, **não tem banco**, não tem
 * conta de usuário e não faz chamada de rede em execução"*, e a tabela *Banco e RLS* põe as três linhas do Padrão de
 * Segurança em *"não se aplica"* por uma frase só:
 *
 * > RLS em tudo, por conta · ✅ **não se aplica** · **não há banco.** Não existe `supabase/`, não existe migração, não
 * > existe tabela
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. O cabeçalho da `rede-em-execucao.ts` (LAB-158) dizia que esta
 * negação já tinha trava — *"o banco e a conta pela ausência de `supabase/`, que o `verde.test.ts` confere contra o
 * disco"*. **Não tinha.** A régua do `verde.test.ts` (LAB-51) lê só as linhas do `conferir.sh` que dizem "não existe";
 * a página não é lida por ela. Medido por mutação em 18/10/2026, cada uma numa cópia da casa, adicionada ao `git`, com a
 * esteira inteira rodando:
 *
 * | o que se plantou | o que caiu além das 9 de sempre (o `.wasm`) |
 * |---|---|
 * | `supabase/migrations/0001_estudos.sql` com um `create table` | só a contagem de arquivos do LAB-57 (765 → 766), sem dizer por quê |
 * | `esteira/src/guardar.ts` abrindo um banco pelo `bun:sqlite` | a mesma contagem, e a das chamadas do LAB-52 |
 * | `dados/medicoes.sqlite`, o arquivo de banco | só a contagem do LAB-57 |
 *
 * Uma contagem cai com **qualquer** arquivo novo, e manda regerar a prova — quem regera aprova o banco junto. Regra
 * verdadeira, guarda ausente: o mesmo desenho do LAB-161.
 *
 * # Onde um banco nasceria, e as cinco portas
 *
 * | porta | o que se pergunta | onde se lê |
 * |---|---|---|
 * | `pasta` | um pedaço de caminho que é a casa de banco: `supabase`, `migrations` (e `migracoes`), `drizzle`, `prisma` | o caminho que o `git` carrega |
 * | `arquivo` | o arquivo que é banco ou o descreve: `.sql`, `.db`, `.sqlite`, `.sqlite3`, `.duckdb`, `.mdb`, `.prisma`, `drizzle.config.*` | o nome |
 * | `modulo` | importar um cliente de banco (lista abaixo), em `from`, `require(` ou `import(` | a string inteira, sem comentário |
 * | `dependencia` | o mesmo cliente declarado num `package.json` ou num `Cargo.toml` | as chaves de dependência |
 * | `navegador` | o banco do navegador: `indexedDB`, `openDatabase` | o código, sem comentário e sem string |
 *
 * O universo é o que o `git` carrega (`arquivosQueOGitCarrega`: o rastreado e o que entraria no próximo `commit -a`),
 * `upstream/` incluído, `node_modules/` fora. **Medido em 18/10/2026, antes do commit desta rodada: 801 caminhos, 378
 * arquivos JS/TS, 23 Rust, 2 `package.json`, 5 `Cargo.toml` — zero nas cinco portas.** Zero também numa busca larga por
 * `localStorage`, `sessionStorage`, `indexedDB`, `bun:sqlite`, `node:sqlite` e `create table` em todo texto que o `git`
 * carrega, `.md` incluído. (Os números de hoje o teste imprime.)
 *
 * **Não há lista de exceções.** Um banco aqui é o dia em que a página tem de ser refeita *antes da primeira migração*,
 * como ela mesma diz — e a trava reprova até isso acontecer.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { literais } from "./rede-em-execucao.ts";
import { soOCodigo } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** A negação do topo da página, como está escrita. */
export const A_FRASE = "não tem banco";
/** O começo da linha da tabela *Banco e RLS* que esta régua responde. */
export const A_LINHA = "| RLS em tudo, por conta";

export type Porta = "pasta" | "arquivo" | "modulo" | "dependencia" | "navegador";

/** Os pedaços de caminho que são casa de banco. Comparados por pedaço inteiro, sem diferença de maiúscula. */
export const PASTAS_DE_BANCO: readonly string[] = ["supabase", "migrations", "migracoes", "drizzle", "prisma"];

/** O nome de arquivo que é banco ou o descreve. */
export const ARQUIVO_DE_BANCO = /(\.(sql|db|sqlite|sqlite3|duckdb|mdb|prisma)$)|(^drizzle\.config\.[a-z]+$)/i;

/**
 * Os clientes de banco do JavaScript, pelo nome do pacote. O escopo inteiro (`@supabase/`, `@prisma/`…) vale pelo
 * prefixo; o resto, pelo nome inteiro ou seguido de `/`.
 */
export const MODULOS_JS: readonly string[] = [
  "bun:sqlite",
  "node:sqlite",
  "sqlite",
  "sqlite3",
  "better-sqlite3",
  "pg",
  "postgres",
  "mysql",
  "mysql2",
  "mongodb",
  "mongoose",
  "redis",
  "ioredis",
  "drizzle-orm",
  "kysely",
  "knex",
  "typeorm",
  "sequelize",
  "duckdb",
  "@duckdb/",
  "@supabase/",
  "@prisma/",
  "@libsql/",
  "@neondatabase/",
  "@planetscale/",
  "@vercel/postgres",
];

/** Os clientes de banco do Rust, pelo nome do crate (com `-` ou `_`, o Rust os troca). */
export const CRATES: readonly string[] = [
  "rusqlite",
  "sqlx",
  "diesel",
  "postgres",
  "tokio-postgres",
  "mysql",
  "redis",
  "mongodb",
  "sled",
  "rocksdb",
  "sea-orm",
  "duckdb",
];

const JS = /\.(ts|mts|cts|js|mjs|cjs)$/i;
const RUST = /\.rs$/i;
const NAVEGADOR = /\bindexedDB\b|\bopenDatabase\s*\(/g;

export const ehModuloDeBanco = (m: string): boolean =>
  MODULOS_JS.some((x) => (x.endsWith("/") ? m.startsWith(x) : m === x || m.startsWith(`${x}/`)));

const comTraco = (c: string) => c.replaceAll("_", "-").toLowerCase();
export const ehCrateDeBanco = (c: string): boolean => CRATES.includes(comTraco(c));

/** As chaves de dependência de um `package.json` (as quatro listas), ou `null` se não é JSON. */
export function dependenciasDoPackage(texto: string): string[] | null {
  let j: unknown;
  try {
    j = JSON.parse(texto);
  } catch {
    return null;
  }
  if (!j || typeof j !== "object") return [];
  const o = j as Record<string, unknown>;
  const fora: string[] = [];
  for (const k of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
    const d = o[k];
    if (d && typeof d === "object") fora.push(...Object.keys(d as Record<string, unknown>));
  }
  return fora;
}

/** Os nomes de crate das tabelas de dependência de um `Cargo.toml` (`[dependencies]`, `[dev-dependencies]`, `[target.….dependencies]`, `[dependencies.x]`). */
export function dependenciasDoCargo(texto: string): string[] {
  const fora: string[] = [];
  let naTabela = false;
  for (const crua of texto.split("\n")) {
    const linha = crua.replace(/#.*$/, "").trim();
    if (linha === "") continue;
    const cabeca = /^\[+([^\]]+)\]+$/.exec(linha);
    if (cabeca) {
      const nome = cabeca[1]!.trim();
      // `[dependencies.rusqlite]` é a forma longa de declarar UM crate: o nome está no cabeçalho.
      const longa = /(^|\.)(dev-|build-)?dependencies\.([A-Za-z0-9_-]+)$/.exec(nome);
      if (longa) {
        fora.push(longa[3]!);
        naTabela = false;
        continue;
      }
      naTabela = /(^|\.)(dev-|build-)?dependencies$/.test(nome);
      continue;
    }
    if (!naTabela) continue;
    const m = /^([A-Za-z0-9_-]+)\s*=/.exec(linha);
    if (!m) continue;
    // `x = { package = "rusqlite" }` renomeia: o crate de verdade é o do `package`.
    // As aspas vão como `\x22`: aspas cruas num literal de regex cegam o leitor de strings da casa (D267).
    const renomeado = /\bpackage\s*=\s*\x22([^\x22]+)\x22/.exec(linha);
    fora.push(renomeado ? renomeado[1]! : m[1]!);
  }
  return fora;
}

export interface Achado {
  caminho: string;
  porta: Porta;
  /** O que casou: o pedaço de caminho, o nome, o módulo, a dependência ou a chamada. */
  oQue: string;
}

/** O que UM caminho, com o seu texto, tem de banco, pelas cinco portas. `texto` `null` = só o caminho. */
export function bancoNoArquivo(caminho: string, texto: string | null): Achado[] {
  const fora: Achado[] = [];
  const pedacos = caminho.split("/");
  const nome = pedacos[pedacos.length - 1] ?? caminho;
  for (const p of pedacos.slice(0, -1))
    if (PASTAS_DE_BANCO.includes(p.toLowerCase())) fora.push({ caminho, porta: "pasta", oQue: p });
  if (ARQUIVO_DE_BANCO.test(nome)) fora.push({ caminho, porta: "arquivo", oQue: nome });
  if (texto === null) return fora;

  if (nome === "package.json") {
    for (const d of dependenciasDoPackage(texto) ?? [])
      if (ehModuloDeBanco(d)) fora.push({ caminho, porta: "dependencia", oQue: d });
  } else if (nome === "Cargo.toml") {
    for (const d of dependenciasDoCargo(texto))
      if (ehCrateDeBanco(d)) fora.push({ caminho, porta: "dependencia", oQue: d });
  } else if (JS.test(nome)) {
    for (const l of literais(texto))
      if (/(\bfrom|\brequire\s*\(|\bimport\s*\()\s*$/.test(l.antes) && ehModuloDeBanco(l.conteudo))
        fora.push({ caminho, porta: "modulo", oQue: l.conteudo });
    for (const m of soOCodigo(texto).matchAll(NAVEGADOR)) fora.push({ caminho, porta: "navegador", oQue: m[0] });
  } else if (RUST.test(nome)) {
    const codigo = soOCodigo(texto);
    for (const m of codigo.matchAll(/\b(?:use|extern\s+crate)\s+([a-z_][a-z0-9_]*)/g))
      if (ehCrateDeBanco(m[1]!)) fora.push({ caminho, porta: "modulo", oQue: m[1]! });
  } else if (/\.html?$/i.test(nome)) {
    for (const m of texto.matchAll(NAVEGADOR)) fora.push({ caminho, porta: "navegador", oQue: m[0] });
  }
  return fora;
}

export type TipoDeProblema = "banco-na-arvore" | "universo-vazio" | "porta-sem-leitura";

export interface Problema {
  tipo: TipoDeProblema;
  caminho: string;
  detalhe: string;
}

export interface Resultado {
  /** Quantos caminhos foram perguntados pelo nome — publicado, porque `every` sobre lista vazia é verdade. */
  caminhos: number;
  /** Quantos textos foram lidos, por espécie. */
  lidos: { js: number; rust: number; html: number; packageJson: number; cargoToml: number };
  achados: Achado[];
  problemas: Problema[];
}

const naoEhDependencia = (c: string) => !/(^|\/)node_modules\//.test(c);

/** A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null` se não existe. */
export function conferirOBanco(arquivos: readonly string[], ler: (caminho: string) => string | null): Resultado {
  const lidos = { js: 0, rust: 0, html: 0, packageJson: 0, cargoToml: 0 };
  const achados: Achado[] = [];
  const caminhos = [...arquivos].filter(naoEhDependencia).sort();
  for (const c of caminhos) {
    const nome = c.split("/").pop() ?? c;
    const precisaDeTexto =
      JS.test(nome) || RUST.test(nome) || /\.html?$/i.test(nome) || nome === "package.json" || nome === "Cargo.toml";
    const texto = precisaDeTexto ? ler(c) : null;
    if (texto !== null) {
      if (nome === "package.json") lidos.packageJson++;
      else if (nome === "Cargo.toml") lidos.cargoToml++;
      else if (JS.test(nome)) lidos.js++;
      else if (RUST.test(nome)) lidos.rust++;
      else lidos.html++;
    }
    achados.push(...bancoNoArquivo(c, texto));
  }
  const problemas: Problema[] = [];
  if (caminhos.length === 0)
    problemas.push({ tipo: "universo-vazio", caminho: "—", detalhe: "o git não carrega caminho nenhum — verde sobre zero não é verde" });
  // Cada porta que lê texto precisa de ao menos um texto lido: senão ela aprova por não ter olhado (D164).
  if (caminhos.length > 0) {
    if (lidos.js === 0) problemas.push({ tipo: "porta-sem-leitura", caminho: "—", detalhe: "nenhum arquivo JS/TS lido: a porta do módulo não olhou nada" });
    if (lidos.packageJson + lidos.cargoToml === 0)
      problemas.push({ tipo: "porta-sem-leitura", caminho: "—", detalhe: "nenhum package.json nem Cargo.toml lido: a porta da dependência não olhou nada" });
  }
  for (const a of achados)
    problemas.push({
      tipo: "banco-na-arvore",
      caminho: a.caminho,
      detalhe: `${a.caminho}: ${a.porta} de banco (${a.oQue}), e o ${A_PAGINA} diz que o Lab ${A_FRASE} — se o banco é de propósito, refaça a seção "Banco e RLS" antes da primeira migração, como a página manda`,
    });
  return { caminhos: caminhos.length, lidos, achados, problemas };
}

/** A árvore de verdade: o `git` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirOBanco(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o banco de FORA, alcançado pela rede: um cliente HTTP falando com um Supabase não importa nenhum cliente de banco — é a trava da rede (`rede-em-execucao.ts`) que o pega, e no caminho do motor ela reprova mesmo declarado",
  "o cliente de banco que não está na lista (`MODULOS_JS`, `CRATES`): a lista tem os que a família usa (o Supabase) e os mais comuns de JavaScript e Rust; um nome novo escapa até entrar nela",
  "o módulo montado por variável (`import(nome)`) ou dentro de `${}` de template: a régua lê a string inteira em posição de importação, como a da rede",
  "o armazenamento simples do navegador (`localStorage`, `sessionStorage`) e o arquivo JSON gravado em disco: guardam dado, mas não são banco; medidos em 18/10 (zero), e não perguntados",
  "a história: um `.sql` que entrou e saiu não deixa banco nenhum — a negação é sobre o que existe; segredo na história é da `arquivo-de-credencial.ts`",
  "a CONTA de usuário, a outra negação da mesma frase: a porta da família (o kit da Central) é a `a-adocao-da-central.ts` (LAB-167), e as outras quatro — a biblioteca, a dependência, o campo de senha e o cookie — são a `o-lab-nao-tem-conta.ts` (LAB-184)",
];
