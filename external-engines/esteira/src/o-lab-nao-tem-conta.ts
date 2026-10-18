/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O LAB NÃO TEM CONTA DE USUÁRIO — perguntado ao `git`, pela PORTA. (LAB-184, item 900, D412)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, do LF-FINAL (14/09/2026), abre com quatro negações: o Lab *"não tem tela de usuário […], não
 * tem banco, **não tem conta de usuário** e não faz chamada de rede em execução"*. Três delas ganharam trava depois — a
 * tela (`a-unica-interface.ts`, LAB-153), a rede (`rede-em-execucao.ts`, LAB-158) e o banco (`o-lab-nao-tem-banco.ts`,
 * LAB-174). A da conta, não: o cabeçalho da trava do banco a passou adiante — *"ela depende da Central, e quem pergunta
 * se o Lab a importa é a `a-adocao-da-central.ts`"* —, e a trava da Central pergunta **uma** porta, a do kit da família.
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. E o parágrafo do topo não nomeava trava nenhuma, das quatro.
 *
 * Medido por mutação em 18/10/2026, cada uma numa cópia da casa (`git worktree`), adicionada ao `git`, com a suíte da
 * esteira inteira rodando — os números estão no relatório do LAB-184 (§3). Conta de usuário feita **sem** a Central —
 * uma biblioteca de senha, um campo de senha na bancada, um cookie de sessão — não derrubava nenhuma trava que dissesse
 * por quê.
 *
 * # Onde uma conta nasceria, e as quatro portas
 *
 * Conta de usuário é **identidade guardada**: alguém entra com um segredo, e a casa lembra quem é. Sem banco (LAB-174)
 * ela não guarda nada aqui dentro — mas pode nascer de três jeitos que não são banco, e um que é a família:
 *
 * | porta | o que se pergunta | onde se lê |
 * |---|---|---|
 * | `modulo` | importar uma biblioteca de identidade (lista abaixo): sessão, senha, token, login de terceiro | a string em posição de importação (JS/TS) e o `use`/`extern crate` (Rust), sem comentário |
 * | `dependencia` | a mesma biblioteca declarada num `package.json` ou num `Cargo.toml` | as chaves de dependência |
 * | `senha` | o campo de senha: `type="password"`, `autocomplete="current-password"`/`"new-password"`, ou `.type = "password"` | o `.html` sem comentário; nas strings do JS/TS |
 * | `cookie` | o lembrete de sessão: `document.cookie`, `cookieStore`, e o cabeçalho `set-cookie` | o código do JS/TS sem comentário e sem string; o `.html` sem comentário; a string inteira `set-cookie` |
 *
 * E a quinta, a da família — o kit da Central, que é quem tem contas —, **não é perguntada de novo aqui**: é a
 * `a-adocao-da-central.ts` (LAB-167), sem clones e com clones. Esta trava confere só que a página a nomeia.
 *
 * O universo é o que o `git` carrega (`arquivosQueOGitCarrega`), `upstream/` incluído, `node_modules/` fora — o mesmo da
 * trava do banco. **Medido em 18/10/2026, antes do commit desta rodada: zero nas quatro portas** (os números do
 * universo o teste imprime, e o relatório guarda).
 *
 * **Não há lista de exceções.** Uma conta aqui é o dia em que a página tem de ser refeita — e com ela a seção *Banco e
 * RLS*, porque conta guardada precisa de onde guardar.
 *
 * # A página
 *
 * O parágrafo *Leia primeiro* passa a nomear, para cada negação, a trava que a pergunta (`AS_NEGACOES`), e esta
 * régua cobra: a frase está lá, cada trava está nomeada no parágrafo, e cada uma existe no disco.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { literais } from "./rede-em-execucao.ts";
import { soOCodigo } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";
import { dependenciasDoCargo, dependenciasDoPackage } from "./o-lab-nao-tem-banco.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** A negação do topo da página, como está escrita. */
export const A_FRASE = "não tem conta de usuário";
/** O começo do parágrafo do topo, onde as quatro negações moram. */
export const O_PARAGRAFO = "> **Leia primeiro o que este repositório é.**";
/** O título da seção desta rodada na página. */
export const A_SECAO = "## Reconferido no LAB-184";

/** As quatro negações do parágrafo, e as travas que cada uma tem de nomear. Os caminhos são da raiz. */
export const AS_NEGACOES: readonly { negacao: string; travas: readonly string[] }[] = [
  { negacao: "não tem tela de usuário", travas: ["external-engines/esteira/src/a-unica-interface.ts"] },
  { negacao: "não tem banco", travas: ["external-engines/esteira/src/o-lab-nao-tem-banco.ts"] },
  {
    negacao: A_FRASE,
    travas: ["external-engines/esteira/src/o-lab-nao-tem-conta.ts", "external-engines/esteira/src/a-adocao-da-central.ts"],
  },
  { negacao: "não faz chamada de rede em execução", travas: ["external-engines/esteira/src/rede-em-execucao.ts"] },
];

export type Porta = "modulo" | "dependencia" | "senha" | "cookie";
export const AS_PORTAS: readonly Porta[] = ["modulo", "dependencia", "senha", "cookie"];

/**
 * As bibliotecas de identidade do JavaScript, pelo nome do pacote. Terminada em `/`, vale o escopo inteiro; terminada
 * em `-`, vale o prefixo (`passport-local`, `@supabase/auth-helpers-nextjs`); o resto, o nome inteiro ou seguido de `/`.
 */
export const MODULOS_JS: readonly string[] = [
  "next-auth",
  "@auth/",
  "passport",
  "passport-",
  "jsonwebtoken",
  "jose",
  "jwt-decode",
  "bcrypt",
  "bcryptjs",
  "argon2",
  "@node-rs/argon2",
  "@node-rs/bcrypt",
  "lucia",
  "@lucia-auth/",
  "better-auth",
  "@clerk/",
  "@auth0/",
  "auth0",
  "firebase/auth",
  "@firebase/auth",
  "firebase-admin/auth",
  "express-session",
  "cookie-session",
  "iron-session",
  "@supabase/auth-js",
  "@supabase/auth-helpers-",
  "@supabase/ssr",
  "oidc-client-ts",
  "openid-client",
  "@simplewebauthn/",
  "otplib",
  "speakeasy",
  "keycloak-js",
  "@okta/",
];

/** As bibliotecas de identidade do Rust, pelo nome do crate (com `-` ou `_`, o Rust os troca). */
export const CRATES: readonly string[] = [
  "jsonwebtoken",
  "argon2",
  "rust-argon2",
  "bcrypt",
  "password-hash",
  "oauth2",
  "openidconnect",
  "tower-sessions",
  "axum-login",
  "actix-identity",
  "actix-session",
  "webauthn-rs",
  "totp-rs",
];

const JS = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/i;
const RUST = /\.rs$/i;
const HTML = /\.html?$/i;
/** O campo de senha, escrito como HTML (no `.html` ou dentro de uma string). */
// As aspas vão como `\x22`, `\x27` e `\x60`: aspas cruas num literal de regex cegam o leitor de strings da casa (D267).
const SENHA_HTML = /\btype\s*=\s*[\x22\x27\x60]?password\b|\bautocomplete\s*=\s*[\x22\x27\x60]?(?:current|new)-password\b/gi;
/** O nome do cabeçalho que grava cookie, montado em pedaços: escrito inteiro numa string, esta régua o acharia nela mesma. */
/** A palavra do `type` do campo de senha, montada como a de cima. */
export const SENHA = ["pass", "word"].join("");
export const SET_COOKIE = ["set", "cookie"].join("-");
/** O lembrete de sessão no navegador, lido no código. */
const COOKIE_NO_CODIGO = /\bdocument\s*\.\s*cookie\b|\bcookieStore\b/g;

export const ehModuloDeIdentidade = (m: string): boolean =>
  MODULOS_JS.some((x) =>
    x.endsWith("/") || x.endsWith("-") ? m.startsWith(x) : m === x || m.startsWith(`${x}/`),
  );

const comTraco = (c: string) => c.replaceAll("_", "-").toLowerCase();
export const ehCrateDeIdentidade = (c: string): boolean => CRATES.includes(comTraco(c));

const semComentarioHtml = (t: string) => t.replace(/<!--[\s\S]*?-->/g, " ");

export interface Achado {
  caminho: string;
  porta: Porta;
  /** O que casou: o módulo, a dependência, o campo ou a chamada. */
  oQue: string;
}

/** O que UM caminho, com o seu texto, tem de conta de usuário, pelas quatro portas. */
export function contaNoArquivo(caminho: string, texto: string): Achado[] {
  const fora: Achado[] = [];
  const nome = caminho.split("/").pop() ?? caminho;
  const achou = (porta: Porta, oQue: string) => fora.push({ caminho, porta, oQue });

  if (nome === "package.json") {
    for (const d of dependenciasDoPackage(texto) ?? []) if (ehModuloDeIdentidade(d)) achou("dependencia", d);
  } else if (nome === "Cargo.toml") {
    for (const d of dependenciasDoCargo(texto)) if (ehCrateDeIdentidade(d)) achou("dependencia", d);
  } else if (JS.test(nome)) {
    for (const l of literais(texto)) {
      if (/(\bfrom|\brequire\s*\(|\bimport\s*\()\s*$/.test(l.antes) && ehModuloDeIdentidade(l.conteudo))
        achou("modulo", l.conteudo);
      for (const m of l.conteudo.matchAll(SENHA_HTML)) achou("senha", m[0]);
      if (l.conteudo.toLowerCase() === SENHA && /\btype\s*[:=]\s*$/.test(l.antes)) achou("senha", `type = ${l.conteudo}`);
      if (l.conteudo.toLowerCase() === SET_COOKIE) achou("cookie", l.conteudo);
    }
    for (const m of soOCodigo(texto).matchAll(COOKIE_NO_CODIGO)) achou("cookie", m[0]);
  } else if (RUST.test(nome)) {
    for (const m of soOCodigo(texto).matchAll(/\b(?:use|extern\s+crate)\s+([a-z_][a-z0-9_]*)/g))
      if (ehCrateDeIdentidade(m[1]!)) achou("modulo", m[1]!);
  } else if (HTML.test(nome)) {
    const t = semComentarioHtml(texto);
    for (const m of t.matchAll(SENHA_HTML)) achou("senha", m[0]);
    for (const m of t.matchAll(COOKIE_NO_CODIGO)) achou("cookie", m[0]);
  }
  return fora;
}

export type TipoDeProblema =
  | "conta-na-arvore"
  | "universo-vazio"
  | "porta-sem-leitura"
  | "frase-sumiu"
  | "trava-nao-nomeada"
  | "trava-nao-existe"
  | "secao-sem-porta";

export interface Problema {
  tipo: TipoDeProblema;
  caminho: string;
  detalhe: string;
}

export interface Resultado {
  /** Quantos caminhos o `git` carrega, fora do `node_modules/` — publicado, porque `every` sobre lista vazia é verdade. */
  caminhos: number;
  /** Quantos textos foram lidos, por espécie. */
  lidos: { js: number; rust: number; html: number; packageJson: number; cargoToml: number };
  achados: Achado[];
  problemas: Problema[];
}

const naoEhDependencia = (c: string) => !/(^|\/)node_modules\//.test(c);

/** A árvore: as quatro portas em todo arquivo que tem texto a ler. `ler` devolve `null` se não existe. */
export function conferirAsPortas(arquivos: readonly string[], ler: (caminho: string) => string | null): Resultado {
  const lidos = { js: 0, rust: 0, html: 0, packageJson: 0, cargoToml: 0 };
  const achados: Achado[] = [];
  const caminhos = [...arquivos].filter(naoEhDependencia).sort();
  for (const c of caminhos) {
    const nome = c.split("/").pop() ?? c;
    const especie =
      nome === "package.json"
        ? "packageJson"
        : nome === "Cargo.toml"
          ? "cargoToml"
          : JS.test(nome)
            ? "js"
            : RUST.test(nome)
              ? "rust"
              : HTML.test(nome)
                ? "html"
                : null;
    if (especie === null) continue;
    const texto = ler(c);
    if (texto === null) continue;
    lidos[especie]++;
    achados.push(...contaNoArquivo(c, texto));
  }
  const problemas: Problema[] = [];
  if (caminhos.length === 0)
    problemas.push({ tipo: "universo-vazio", caminho: "—", detalhe: "o git não carrega caminho nenhum — verde sobre zero não é verde" });
  if (caminhos.length > 0) {
    // Cada porta precisa de ao menos um texto lido: senão ela aprova por não ter olhado (D164).
    if (lidos.js === 0)
      problemas.push({ tipo: "porta-sem-leitura", caminho: "—", detalhe: "nenhum arquivo JS/TS lido: as portas do módulo, da senha e do cookie não olharam o código" });
    if (lidos.html === 0)
      problemas.push({ tipo: "porta-sem-leitura", caminho: "—", detalhe: "nenhum .html lido: a porta da senha não olhou a página da bancada" });
    if (lidos.packageJson + lidos.cargoToml === 0)
      problemas.push({ tipo: "porta-sem-leitura", caminho: "—", detalhe: "nenhum package.json nem Cargo.toml lido: a porta da dependência não olhou nada" });
  }
  for (const a of achados)
    problemas.push({
      tipo: "conta-na-arvore",
      caminho: a.caminho,
      detalhe: `${a.caminho}: ${a.porta} de conta de usuário (${a.oQue}), e o ${A_PAGINA} diz que o Lab ${A_FRASE} — se a conta é de propósito, refaça a página (e a seção "Banco e RLS": conta guardada precisa de onde guardar)`,
    });
  return { caminhos: caminhos.length, lidos, achados, problemas };
}

/** O parágrafo do topo, lido como a regra se lê: sem o `>` da citação e com o espaço colapsado. */
export function oParagrafo(pagina: string): string | null {
  const linhas = pagina.split("\n");
  const ini = linhas.findIndex((l) => l.startsWith(O_PARAGRAFO));
  if (ini === -1) return null;
  const fora: string[] = [];
  for (let i = ini; i < linhas.length && linhas[i]!.startsWith(">"); i++) fora.push(linhas[i]!.replace(/^>\s?/, ""));
  return fora.join(" ").replace(/\s+/g, " ");
}

/** A seção desta rodada, até o próximo título de nível dois. */
export function aSecao(pagina: string): string | null {
  const ini = pagina.indexOf(`\n${A_SECAO}`);
  if (ini === -1) return null;
  const fim = pagina.indexOf("\n## ", ini + 1);
  return pagina.slice(ini, fim === -1 ? pagina.length : fim);
}

/** A página: a frase, as travas de cada negação nomeadas no parágrafo e existentes, e as portas na seção. */
export function conferirAPagina(pagina: string, existe: (caminho: string) => boolean): Problema[] {
  const problemas: Problema[] = [];
  const p = oParagrafo(pagina);
  if (p === null) {
    problemas.push({ tipo: "frase-sumiu", caminho: A_PAGINA, detalhe: `o parágrafo "${O_PARAGRAFO}" sumiu da página` });
    return problemas;
  }
  for (const { negacao, travas } of AS_NEGACOES) {
    if (!p.includes(negacao))
      problemas.push({ tipo: "frase-sumiu", caminho: A_PAGINA, detalhe: `o parágrafo do topo não diz mais "${negacao}"` });
    for (const t of travas) {
      const nome = t.split("/").pop()!;
      if (!p.includes(nome))
        problemas.push({ tipo: "trava-nao-nomeada", caminho: A_PAGINA, detalhe: `"${negacao}": o parágrafo do topo não nomeia ${nome}` });
      if (!existe(t)) problemas.push({ tipo: "trava-nao-existe", caminho: t, detalhe: `"${negacao}": o parágrafo nomeia ${t}, e ele não existe` });
    }
  }
  const s = aSecao(pagina);
  if (s === null) problemas.push({ tipo: "secao-sem-porta", caminho: A_PAGINA, detalhe: `a seção "${A_SECAO}" sumiu da página` });
  else
    for (const porta of AS_PORTAS)
      if (!s.includes(`\`${porta}\``))
        problemas.push({ tipo: "secao-sem-porta", caminho: A_PAGINA, detalhe: `a seção "${A_SECAO}" não diz a porta \`${porta}\`` });
  return problemas;
}

/** A árvore de verdade e a página de verdade, desta casa. */
export function conferirAArvore(raiz: string): Resultado {
  const r = conferirAsPortas(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
  const pagina = readFileSync(join(raiz, A_PAGINA), "utf8");
  r.problemas.push(...conferirAPagina(pagina, (c) => existsSync(join(raiz, c))));
  return r;
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "a conta de FORA, alcançada pela rede: um `fetch` a um serviço de login não importa biblioteca nenhuma — é a trava da rede (`rede-em-execucao.ts`) que o pega, e no caminho do motor ela reprova mesmo declarado",
  "a biblioteca que não está na lista (`MODULOS_JS`, `CRATES`): a lista tem as que a família usa (o Supabase, pela Central) e as mais comuns de JavaScript e Rust; um nome novo escapa até entrar nela",
  "a conta feita à mão, sem biblioteca: um `crypto.subtle` derivando senha, um token montado com `btoa` — a régua pergunta o nome, não a intenção",
  "o cabeçalho de autorização do HTTP, lido ou escrito: as ferramentas desta casa o usam para ler os vizinhos com o token do GitHub, que é credencial da SESSÃO, não conta de usuário — e o segredo dele é da `varredura-de-segredos.ts`",
  "o `localStorage` e o `sessionStorage`: guardam dado no navegador, e uma sessão caberia neles; medidos em 18/10 (zero, pela trava do banco), e não perguntados como conta",
  "a história: uma conta que entrou e saiu não deixa conta nenhuma — a negação é sobre o que existe",
];
