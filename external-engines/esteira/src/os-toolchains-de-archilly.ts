/**
 * ════════════════════════════════════════════════════════════════════════════
 *  OS `rust-toolchain.toml` DE `archilly/` — cópias do upstream, com o comentário que fala do CI de lá. (LAB-190, item 900, D418)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Os três projetos de `external-engines/symbios/archilly/` (`probe/`, `wasm-probe/`, `wasm/`) carregam um
 * `rust-toolchain.toml` byte a byte o do `upstream/`. O comentário em inglês de dentro afirma estado sem perguntar — e
 * o estado é de OUTRA casa. Espécie da dívida própria: *mensagem fixa que afirma estado sem perguntar*. Medido por LUGAR
 * em 19/10/2026:
 *
 * | o comentário diz | o que esta casa tem |
 * |---|---|
 * | *"CI reads THIS FILE via actions-rust-lang/setup-rust-toolchain"* | o `verde.yml` daqui não usa essa ação; quem lê o arquivo é o `rustup`, pela pasta, no passo que compila o `.wasm` (`working-directory` em `archilly/wasm`) |
 * | *"the local gate ran 1.96.1"* | a máquina das sessões tem o `rustc` 1.97.0; ao entrar em `archilly/wasm` o `rustup` tenta baixar a 1.96.1 e o proxy recusa o `static.rust-lang.org` |
 * | *"`clippy -D warnings`"* | esta casa não roda `clippy` em lugar nenhum |
 * | `channel = "1.96.1"` | verdade, e é o que importa: a mesma versão do motor |
 *
 * O arquivo **não se edita** (a cópia inteira é a garantia de que a versão não deriva — o LAB-189 já o descartou). O
 * que se conserta é a página do motor, `external-engines/symbios/README.md`, que nada dizia deles: ganha uma seção
 * que os lista entre marcas e diz de quem é o comentário. Esta régua pergunta:
 *
 * 1. **a lista, nos dois sentidos:** os itens entre as marcas são os `archilly/<p>/rust-toolchain.toml` que o `git`
 *    carrega, e só eles; universo vazio reprova (D213);
 * 2. **os bytes:** a página diz *"byte a byte o `upstream/rust-toolchain.toml`"* se, e só se, cada cópia é igual;
 * 3. **a versão:** o `channel = "…"` que a página cita é o do upstream;
 * 4. **a frase citada:** o que a página põe entre aspas como o comentário está, palavra por palavra, no comentário;
 * 5. **a ação ausente:** a página diz *"não usa essa ação"* se, e só se, nenhuma linha do `verde.yml` que não é
 *    comentário nomeia a ação que a frase cita;
 * 6. **a pasta do passo:** o passo do `verde.yml` que roda `cargo build` tem `working-directory` num projeto da lista,
 *    e a página nomeia esse projeto; os projetos que a página diz que *"nenhuma rotina compila"* não aparecem fora de
 *    comentário no `verde.yml` nem no `conferir.sh`;
 * 7. **os caminhos:** todo `external-engines/…`, `docs/…` ou `.github/…` entre crases da página resolve no `git`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { comoARegraSeLe } from "./texto-das-regras.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const O_MOTOR = "external-engines/symbios/";
export const A_PAGINA = `${O_MOTOR}README.md`;
export const O_DO_UPSTREAM = `${O_MOTOR}upstream/rust-toolchain.toml`;
export const O_VERDE = ".github/workflows/verde.yml";
export const O_CONFERIR = "external-engines/conferir.sh";

export const MARCA_ABRE = "<!-- os-toolchains-de-archilly (LAB-190) -->";
export const MARCA_FECHA = "<!-- /os-toolchains-de-archilly -->";

export const A_PAGINA_DIZ_DOS_BYTES = "byte a byte o `upstream/rust-toolchain.toml`";
export const A_PAGINA_DIZ_DA_ACAO = "não usa essa ação";
export const A_PAGINA_DIZ_DOS_OUTROS = "nenhuma rotina compila";

/** Um `archilly/<p>/rust-toolchain.toml`, relativo ao motor. */
const TOOLCHAIN = /^archilly\/([^/]+)\/rust-toolchain\.toml$/;

/** Os itens entre as marcas: o nome entre crases que abre cada item. `null` se as marcas faltam. */
export function aListaDaPagina(texto: string): string[] | null {
  const a = texto.indexOf(MARCA_ABRE);
  const f = texto.indexOf(MARCA_FECHA);
  if (a < 0 || f < 0 || f < a) return null;
  return texto
    .slice(a + MARCA_ABRE.length, f)
    .split("\n")
    .map((l) => /^\s*-\s+`([^`]+)`/.exec(l)?.[1])
    .filter((n): n is string => n !== undefined);
}

/** O `channel = "…"` de um `rust-toolchain.toml`, fora de comentário. */
export const oCanal = (toml: string): string | null => /^\s*channel\s*=\s*"([^"]+)"/m.exec(toml)?.[1] ?? null;

/** O comentário de um `.toml`, numa linha só: o que vem depois de `#`, juntado por espaço. */
export const oComentario = (toml: string): string =>
  toml
    .split("\n")
    .map((l) => /^\s*#\s?(.*)$/.exec(l)?.[1])
    .filter((l): l is string => l !== undefined)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

/** As linhas de um YAML ou `.sh` que não são comentário. */
export const semComentario = (texto: string): string => texto.split("\n").filter((l) => !/^\s*#/.test(l)).join("\n");

/** O `working-directory` de cada passo do `verde.yml` cujo `run` chama `cargo build`. */
export function asPastasDoCargo(verde: string): string[] {
  const passos = semComentario(verde).split(/^\s*- (?=name:|uses:)/m);
  return passos
    .filter((p) => /\bcargo build\b/.test(p))
    .map((p) => /^\s*working-directory:\s*(\S+)\s*$/m.exec(p)?.[1] ?? "(sem working-directory)");
}

/** As frases entre `*"…"*` da seção: o que a página cita como o comentário. */
export const asCitacoes = (texto: string): string[] => [...texto.matchAll(/\*"([^"]+)"\*/g)].map((m) => m[1] as string);

/** A seção da página que fala dos toolchains: do título que nomeia `rust-toolchain.toml` até o próximo `## `. */
export function aSecao(pagina: string): string | null {
  const m = /^## [^\n]*rust-toolchain\.toml[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(pagina);
  return m ? (m[1] as string) : null;
}

export interface Resultado {
  copias: string[];
  canal: string | null;
  pastasDoCargo: string[];
  problemas: string[];
}

export function conferir(caminhos: readonly string[], ler: (c: string) => string | null): Resultado {
  const problemas: string[] = [];
  const carrega = new Set(caminhos);
  const resolve = (alvo: string) => carrega.has(alvo) || caminhos.some((c) => c.startsWith(`${alvo}/`));
  const copias = caminhos
    .filter((c) => c.startsWith(O_MOTOR) && TOOLCHAIN.test(c.slice(O_MOTOR.length)))
    .map((c) => c.slice(O_MOTOR.length))
    .sort();
  const upstream = ler(O_DO_UPSTREAM);
  const canal = upstream === null ? null : oCanal(upstream);
  const vazio: Resultado = { copias, canal, pastasDoCargo: [], problemas };
  const pagina = ler(A_PAGINA);
  if (pagina === null) {
    problemas.push(`${A_PAGINA}: a página não existe`);
    return vazio;
  }
  if (upstream === null) problemas.push(`${O_DO_UPSTREAM}: não existe`);
  if (copias.length === 0) problemas.push(`${O_MOTOR}archilly/: o git não carrega nenhum rust-toolchain.toml — universo vazio (D213)`);
  const secao = aSecao(pagina);
  if (secao === null) {
    problemas.push(`${A_PAGINA}: sem a seção dos rust-toolchain.toml`);
    return vazio;
  }
  const lida = comoARegraSeLe(secao);
  const diz = (frase: string) => lida.includes(comoARegraSeLe(frase));

  // 1 · a lista, nos dois sentidos
  const lista = aListaDaPagina(secao);
  if (lista === null) problemas.push(`${A_PAGINA}: sem as marcas da lista dos toolchains`);
  const nomes = lista ?? [];
  for (const c of copias) if (!nomes.includes(c)) problemas.push(`${A_PAGINA}: a lista não nomeia ${c}, que o git carrega`);
  for (const n of nomes) if (!copias.includes(n)) problemas.push(`${A_PAGINA}: a lista nomeia ${n}, que o git não carrega`);
  if (new Set(nomes).size !== nomes.length) problemas.push(`${A_PAGINA}: a lista repete um nome`);

  // 2 · os bytes
  const diferentes = copias.filter((c) => ler(O_MOTOR + c) !== upstream);
  if (diz(A_PAGINA_DIZ_DOS_BYTES)) {
    for (const c of diferentes) problemas.push(`${A_PAGINA}: diz que as cópias são byte a byte o upstream, e ${c} não é`);
  } else if (copias.length > 0 && diferentes.length === 0)
    problemas.push(`${A_PAGINA}: não diz que as cópias são byte a byte o upstream («${A_PAGINA_DIZ_DOS_BYTES}»), e são`);

  // 3 · a versão
  const citado = /channel = "([^"]+)"/.exec(secao)?.[1] ?? null;
  if (citado === null) problemas.push(`${A_PAGINA}: não cita o channel que as cópias fixam`);
  else if (citado !== canal) problemas.push(`${A_PAGINA}: cita channel = "${citado}", e o upstream fixa ${canal ?? "nenhum"}`);

  // 4 · a frase citada
  const comentario = upstream === null ? "" : oComentario(upstream);
  const citacoes = asCitacoes(secao);
  if (citacoes.length === 0) problemas.push(`${A_PAGINA}: não cita o comentário entre aspas`);
  for (const c of citacoes) if (!comentario.includes(c)) problemas.push(`${A_PAGINA}: cita «${c}» como o comentário, e o comentário do upstream não diz isso`);

  // 5 · a ação ausente
  const verde = ler(O_VERDE);
  if (verde === null) problemas.push(`${O_VERDE}: não existe`);
  const acao = citacoes.map((c) => /\bvia ([\w.-]+\/[\w.-]+)/.exec(c)?.[1]).find((a) => a !== undefined) ?? null;
  if (acao === null) problemas.push(`${A_PAGINA}: nenhuma frase citada nomeia a ação do CI do upstream`);
  else if (verde !== null) {
    const usa = semComentario(verde).includes(acao);
    if (diz(A_PAGINA_DIZ_DA_ACAO) && usa) problemas.push(`${O_VERDE}: usa ${acao}, e a página diz que não usa essa ação`);
    if (!diz(A_PAGINA_DIZ_DA_ACAO) && !usa) problemas.push(`${A_PAGINA}: não diz que o verde.yml não usa ${acao} («${A_PAGINA_DIZ_DA_ACAO}»), e não usa`);
  }

  // 6 · a pasta do passo
  const pastasDoCargo = verde === null ? [] : asPastasDoCargo(verde);
  if (verde !== null && pastasDoCargo.length === 0) problemas.push(`${O_VERDE}: nenhum passo roda cargo build, e a página diz que um roda`);
  const projetos = copias.map((c) => (TOOLCHAIN.exec(c)?.[1] as string));
  for (const p of pastasDoCargo) {
    const m = /(?:^|\/)external-engines\/symbios\/archilly\/([^/]+)\/?$/.exec(p);
    if (m === null || !projetos.includes(m[1] as string)) {
      problemas.push(`${O_VERDE}: o cargo build roda em ${p}, que não é um projeto da lista`);
      continue;
    }
    if (!secao.includes(`\`archilly/${m[1]}\``)) problemas.push(`${A_PAGINA}: não nomeia \`archilly/${m[1]}\`, a pasta do passo que compila`);
  }
  const compilados = pastasDoCargo.map((p) => /archilly\/([^/]+)\/?$/.exec(p)?.[1]).filter((p): p is string => p !== undefined);
  const outros = projetos.filter((p) => !compilados.includes(p));
  if (diz(A_PAGINA_DIZ_DOS_OUTROS)) {
    const conferirSh = ler(O_CONFERIR);
    if (conferirSh === null) problemas.push(`${O_CONFERIR}: não existe`);
    const rodam = `${verde === null ? "" : semComentario(verde)}\n${conferirSh === null ? "" : semComentario(conferirSh)}`;
    for (const o of outros) {
      if (!secao.includes(`\`${o}/\``)) problemas.push(`${A_PAGINA}: diz que nenhuma rotina compila os outros, e não nomeia \`${o}/\``);
      if (new RegExp(`archilly/${o.replace(/[-.]/g, "\\$&")}\\b(?!-)`).test(rodam))
        problemas.push(`${A_PAGINA}: diz que nenhuma rotina compila ${o}/, e o verde.yml ou o conferir.sh o nomeia fora de comentário`);
    }
  } else if (outros.length > 0) problemas.push(`${A_PAGINA}: não diz que nenhuma rotina compila ${outros.join(", ")} («${A_PAGINA_DIZ_DOS_OUTROS}»)`);

  // 7 · os caminhos
  for (const c of [...secao.matchAll(/`((?:docs|external-engines|\.github)\/[^`\s]+)`/g)].map((m) => m[1] as string))
    if (!resolve(c.replace(/\/$/, ""))) problemas.push(`${A_PAGINA}: ${c} não existe no git`);

  return { copias, canal, pastasDoCargo, problemas };
}

export function conferirAArvore(raiz: string): Resultado {
  const ler = (c: string) => {
    const p = join(raiz, c);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  return conferir(arquivosQueOGitCarrega(raiz), ler);
}

export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se o `rustup` do runner do GitHub de fato troca para a 1.96.1 no passo que compila o `.wasm`: a régua confere a pasta do passo, não o runner — e o CI está desligado desde 08/10/2026 (não testado lá)",
  "o resto do comentário em inglês (o `clippy -D warnings`, o *bump it deliberately*): a régua confere a frase que a página cita, não cada frase do comentário",
  "os toolchains do outro motor com `archilly/` (o `straight-skeleton`): a régua lê só o Symbios, o único com `upstream/rust-toolchain.toml`",
  "se a máquina das sessões AINDA recusa o `static.rust-lang.org`: a página diz a medição de 19/10/2026, datada, e a régua não refaz a rede",
];
