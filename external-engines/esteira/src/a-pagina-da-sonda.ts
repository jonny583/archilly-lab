/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PÁGINA DA SONDA — o que a pasta carrega, o que a sonda é hoje, e os números do LAB-00 em dois lugares. (LAB-189, item 900, D417)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `external-engines/symbios/archilly/wasm-probe/README.md` nasceu no LAB-00 (09/09/2026) e nunca mais foi tocado. Era
 * o último `README.md` fora do `upstream/` sem leitor no código (a conta do LAB-187, corrigida no LAB-188), e o
 * `o-trabalho-em-archilly.ts` (LAB-152) o deixava no *não alcança*. Espécies da dívida própria: *mensagem fixa que
 * afirma estado sem perguntar* e *número digitado à mão*. Medido por LUGAR em 19/10/2026:
 *
 * | a página | o que a árvore diz |
 * |---|---|
 * | *"existe por um motivo só: provar que o `symbios-tensor` compila para `wasm32`"*, com a receita `wasm_js` | verdade em 09/09 — e calada desde o LAB-01: o `.wasm` carregado é o da ponte `../wasm/`, que sai pelo backend `custom` porque o `wasm_js` arrasta `wasm-bindgen` e `js-sys` (estão no `Cargo.lock` desta pasta); ninguém carrega o da sonda, e o `conferir.sh` não o compila |
 * | *"`rand 0.9` puxa `getrandom 0.3`"* | verdade: `rand 0.9.5` → `rand_core 0.9.5` → `getrandom 0.3.4`, no `Cargo.lock` |
 * | *"não modifica o upstream"* | verdade: `symbios-tensor` por `path = "../../upstream"`, sem `[patch]` nem `[replace]` |
 * | *"Sem dependência nativa"* | verdade: nenhum `cc`, `cmake`, `pkg-config` ou `bindgen` entre os 34 pacotes do `Cargo.lock` |
 * | *"162 696 bytes, compilado em 12,54 s"* | os mesmos dois números estão **digitados de novo** na seção 10 de `docs/SYMBIOS_ANALYSIS.md` (*"12.54s"*, *"162 696 bytes"*, e *"159 KB"*) — dois lugares, nenhuma trava entre eles |
 * | *"registrado como a primeira tentativa em `docs/SYMBIOS_ANALYSIS.md`, seção 10"* | verdade: a seção 10 é *Viabilidade WebAssembly*, e cita o erro |
 * | não diz nada do `rust-toolchain.toml` | ele é byte a byte o do `upstream/`, com o comentário em inglês sobre o CI de LÁ (*"CI reads THIS FILE via actions-rust-lang/setup-rust-toolchain"*); o `verde.yml` daqui não usa essa ação |
 *
 * Nada era falso: era **calado** — a página não dizia que a sonda deixou de ser o caminho no dia seguinte.
 *
 * # O que se pergunta
 *
 * 1. **a pasta, nos dois sentidos:** a lista entre as marcas nomeia cada arquivo que o `git` carrega na pasta (fora a
 *    página), e nada além; nenhum `.wasm` nem `target/` versionado, como a página diz;
 * 2. **o papel:** a pasta é `sonda` nas {@link PONTES} do LAB-176, a ponte que a página aponta é a `carregada` de lá, e
 *    nenhuma linha do `conferir.sh` que não é comentário nomeia esta pasta ou o artefato dela;
 * 3. **a receita:** o `--cfg` do bloco de comando da página é o da seção 10; o `getrandom` do `Cargo.toml` tem
 *    `wasm_js`; e a página só diz o backend `custom` da ponte enquanto o `conferir.sh` o imprime;
 * 4. **o `Cargo.lock`:** `rand 0.9`, `getrandom 0.3` alcançável a partir dele pelas dependências do lock; a cola que o
 *    item do lock nomeia é a cola que o lock traz, nos dois sentidos; e nenhum pacote de compilação nativa;
 * 5. **o upstream:** `symbios-tensor` por `path = "../../upstream"`, e nenhuma seção `[patch]` ou `[replace]`;
 * 6. **o `rust-toolchain.toml`:** o item diz *"byte a byte o do `upstream/`"* se, e só se, os bytes são os mesmos;
 * 7. **os números do LAB-00 em dois lugares:** bytes e segundos da página são os da seção 10; os *"159 KB"* da seção são
 *    os bytes ÷ 1024, arredondados; e a página diz que são dois lugares, nomeando a análise;
 * 8. **a seção 10 citada:** existe, o título diz *WebAssembly*, e traz o erro que a página cita;
 * 9. **os caminhos:** todo link da página e todo `docs/…` ou `external-engines/…` entre crases resolvem no `git`.
 */
import { join, normalize } from "node:path";
import { existsSync, readFileSync } from "node:fs";

import { PONTES, artefatoDe, dependenciasDoBinario, A_RECEITA_DO_BACKEND } from "./o-wasm-nao-pede-nada.ts";
import { comoARegraSeLe } from "./texto-das-regras.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PASTA = "external-engines/symbios/archilly/wasm-probe/";
export const A_PAGINA = `${A_PASTA}README.md`;
export const O_CARGO = `${A_PASTA}Cargo.toml`;
export const O_LOCK = `${A_PASTA}Cargo.lock`;
export const O_TOOLCHAIN = `${A_PASTA}rust-toolchain.toml`;
export const O_TOOLCHAIN_DO_UPSTREAM = "external-engines/symbios/upstream/rust-toolchain.toml";
export const A_ANALISE = "docs/SYMBIOS_ANALYSIS.md";
export const O_CONFERIR = "external-engines/conferir.sh";

export const MARCA_ABRE = "<!-- a-pasta-da-sonda (LAB-189) -->";
export const MARCA_FECHA = "<!-- /a-pasta-da-sonda -->";

export const A_PAGINA_DIZ_DO_WASM = "O `.wasm` e a pasta `target/` não são versionados";
export const A_PAGINA_DIZ_DO_PAPEL = "Ninguém carrega o";
export const A_PAGINA_DIZ_DO_CONFERIR = "o `conferir.sh` não o compila";
export const A_PAGINA_DIZ_DO_BACKEND = 'getrandom_backend="custom"';
export const A_PAGINA_DIZ_DO_UPSTREAM = "Ele não modifica o upstream";
export const A_PAGINA_DIZ_DO_NATIVO = "Sem dependência nativa";
export const A_PAGINA_DIZ_DOS_DOIS = "Os números do LAB-00 moram em dois lugares";
export const A_PAGINA_DIZ_DO_TOOLCHAIN = "byte a byte o do `upstream/`";

/** Os pacotes que compilam código nativo: o que *"sem dependência nativa"* nega. */
export const NATIVOS: readonly string[] = ["cc", "cmake", "pkg-config", "bindgen"];
/** A cola que o item do `Cargo.lock` pode nomear (a mesma família do LAB-176). */
export const COLA_NOMEAVEL: readonly string[] = ["wasm-bindgen", "js-sys", "web-sys"];

export interface PacoteDoLock {
  nome: string;
  versao: string;
  deps: string[];
}

/** Os `[[package]]` de um `Cargo.lock`: nome, versão e o nome de cada dependência (sem a versão que o lock às vezes põe). */
export function lerOLock(lock: string): PacoteDoLock[] {
  const fora: PacoteDoLock[] = [];
  for (const bloco of lock.split(/^\[\[package\]\]\s*$/m).slice(1)) {
    const nome = /^name = "([^"]+)"/m.exec(bloco)?.[1];
    const versao = /^version = "([^"]+)"/m.exec(bloco)?.[1];
    if (nome === undefined || versao === undefined) continue;
    const lista = /^dependencies = \[([\s\S]*?)\]/m.exec(bloco)?.[1] ?? "";
    const deps = [...lista.matchAll(/"([^"\s]+)(?: [^"]*)?"/g)].map((m) => m[1] as string);
    fora.push({ nome, versao, deps });
  }
  return fora;
}

/** As versões de `alvo` alcançáveis a partir dos pacotes `de` cuja versão começa por `versaoDe`, pelas dependências do lock. */
export function alcancavel(pacotes: readonly PacoteDoLock[], de: string, versaoDe: string, alvo: string): string[] {
  const porNome = new Map<string, PacoteDoLock[]>();
  for (const p of pacotes) porNome.set(p.nome, [...(porNome.get(p.nome) ?? []), p]);
  const vistos = new Set<PacoteDoLock>();
  const fila = (porNome.get(de) ?? []).filter((p) => p.versao.startsWith(versaoDe));
  const achadas = new Set<string>();
  while (fila.length > 0) {
    const p = fila.shift()!;
    if (vistos.has(p)) continue;
    vistos.add(p);
    for (const d of p.deps)
      for (const q of porNome.get(d) ?? []) {
        if (q.nome === alvo) achadas.add(q.versao);
        fila.push(q);
      }
  }
  return [...achadas].sort();
}

/** Os itens entre as marcas: o nome entre crases que abre o item, e o texto inteiro dele. `null` se as marcas faltam. */
export function aListaDaPagina(texto: string): { nome: string; linha: string }[] | null {
  const a = texto.indexOf(MARCA_ABRE);
  const f = texto.indexOf(MARCA_FECHA);
  if (a < 0 || f < 0 || f < a) return null;
  const itens: { nome: string; linha: string }[] = [];
  for (const l of texto.slice(a + MARCA_ABRE.length, f).split("\n")) {
    const m = /^\s*-\s+`([^`]+)`/.exec(l);
    if (m) itens.push({ nome: m[1] as string, linha: l });
    else if (itens.length > 0 && /^\s{2,}\S/.test(l)) itens[itens.length - 1]!.linha += ` ${l.trim()}`;
  }
  return itens;
}

/** Os números do LAB-00 na página: bytes (`162 696 bytes`) e segundos (`12,54 s`), na forma de cada lugar. */
export function osNumerosDaPagina(pagina: string): { bytes: number | null; segundos: number | null } {
  const lida = comoARegraSeLe(pagina);
  const b = /\b(\d{1,3}(?: \d{3})+|\d+) bytes\b/.exec(lida)?.[1];
  const s = /compilado em (\d+(?:,\d+)?) s\b/.exec(lida)?.[1];
  return { bytes: b ? Number(b.replace(/ /g, "")) : null, segundos: s ? Number(s.replace(",", ".")) : null };
}

/** A seção 10 da análise: o título e o corpo, até o próximo `## `. `null` se não há. */
export function aSecao10(analise: string): { titulo: string; corpo: string } | null {
  const m = /^## 10\. ([^\n]*)\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(analise);
  return m ? { titulo: m[1] as string, corpo: m[2] as string } : null;
}

/** Os números do LAB-00 na seção 10: segundos (`in 12.54s`), bytes (`— 162 696 bytes`) e KB (`159 KB`). */
export function osNumerosDaSecao(corpo: string): { bytes: number | null; segundos: number | null; kb: number | null } {
  const b = /\b(\d{1,3}(?: \d{3})+|\d+) bytes\b/.exec(corpo)?.[1];
  const s = /\bin (\d+(?:\.\d+)?)s\b/.exec(corpo)?.[1];
  const k = /\b(\d+) KB\b/.exec(corpo)?.[1];
  return { bytes: b ? Number(b.replace(/ /g, "")) : null, segundos: s ? Number(s) : null, kb: k ? Number(k) : null };
}

/** O `--cfg getrandom_backend=…` de cada bloco de comando. */
export const osCfgs = (texto: string): string[] =>
  [...texto.matchAll(/```(?:shell|sh|bash)\n([\s\S]*?)\n```/g)].flatMap((b) =>
    [...(b[1] as string).matchAll(/--cfg getrandom_backend="([^"]+)"/g)].map((m) => m[1] as string),
  );

/** As linhas do `conferir.sh` que não são comentário. */
const semComentario = (sh: string): string => sh.split("\n").filter((l) => !/^\s*#/.test(l)).join("\n");

export interface Resultado {
  naPasta: string[];
  pacotesNoLock: number;
  numerosDaPagina: { bytes: number | null; segundos: number | null };
  caminhosLidos: number;
  problemas: string[];
}

export function conferir(caminhos: readonly string[], ler: (c: string) => string | null): Resultado {
  const problemas: string[] = [];
  const carrega = new Set(caminhos);
  const resolve = (alvo: string) => carrega.has(alvo) || caminhos.some((c) => c.startsWith(`${alvo}/`));
  const naPasta = caminhos.filter((c) => c.startsWith(A_PASTA) && c !== A_PAGINA).map((c) => c.slice(A_PASTA.length));
  const pagina = ler(A_PAGINA);
  const vazio: Resultado = { naPasta, pacotesNoLock: 0, numerosDaPagina: { bytes: null, segundos: null }, caminhosLidos: 0, problemas };
  if (pagina === null) {
    problemas.push(`${A_PAGINA}: a página não existe`);
    return vazio;
  }
  const lida = comoARegraSeLe(pagina);
  const diz = (frase: string) => lida.includes(comoARegraSeLe(frase));
  if (naPasta.length === 0) problemas.push(`${A_PASTA}: o git não carrega nada além da página — universo vazio (D213)`);

  // 1 · a pasta, nos dois sentidos
  const lista = aListaDaPagina(pagina);
  if (lista === null) problemas.push(`${A_PAGINA}: sem as marcas da lista da pasta`);
  const nomes = (lista ?? []).map((i) => i.nome);
  for (const n of naPasta) if (!nomes.includes(n)) problemas.push(`${A_PAGINA}: a lista não nomeia ${n}, que o git carrega na pasta`);
  for (const n of nomes) if (!naPasta.includes(n)) problemas.push(`${A_PAGINA}: a lista nomeia ${n}, que o git não carrega na pasta`);
  if (new Set(nomes).size !== nomes.length) problemas.push(`${A_PAGINA}: a lista repete um nome`);
  if (!diz(A_PAGINA_DIZ_DO_WASM)) problemas.push(`${A_PAGINA}: não diz que o .wasm e o target/ não são versionados («${A_PAGINA_DIZ_DO_WASM}»)`);
  for (const n of naPasta)
    if (n.endsWith(".wasm") || n.startsWith("target/")) problemas.push(`${A_PAGINA}: diz que o .wasm e o target/ não são versionados, e o git carrega ${n}`);
  const item = (nome: string) => (lista ?? []).find((i) => i.nome === nome)?.linha ?? null;

  // 2 · o papel
  const aSonda = PONTES.find((p) => `${p.pasta}/` === A_PASTA);
  const aCarregada = PONTES.filter((p) => p.papel === "carregada");
  if (!diz(A_PAGINA_DIZ_DO_PAPEL)) problemas.push(`${A_PAGINA}: não diz que ninguém carrega o artefato («${A_PAGINA_DIZ_DO_PAPEL}»)`);
  else if (aSonda?.papel !== "sonda")
    problemas.push(`${A_PAGINA}: diz que ninguém carrega o artefato, e as PONTES do LAB-176 dão a pasta como ${aSonda?.papel ?? "ausente"}`);
  const cargo = ler(O_CARGO);
  if (cargo === null) problemas.push(`${O_CARGO}: não existe`);
  const artefato = cargo === null ? null : artefatoDe(cargo);
  if (cargo !== null && artefato === null) problemas.push(`${O_CARGO}: sem nome de pacote, não há artefato a perguntar`);
  if (artefato !== null && !pagina.includes(artefato)) problemas.push(`${A_PAGINA}: não nomeia o artefato ${artefato}`);
  const linksDaPonte = osLinks(pagina).map((l) => normalize(A_PASTA + l).replace(/\/$/, ""));
  if (aCarregada.length !== 1) problemas.push(`as PONTES do LAB-176 dão ${aCarregada.length} ponte(s) carregada(s), e a página aponta uma`);
  else if (!linksDaPonte.includes(aCarregada[0]!.pasta))
    problemas.push(`${A_PAGINA}: não aponta a ponte carregada (${aCarregada[0]!.pasta}) por link`);
  const conferirSh = ler(O_CONFERIR);
  if (conferirSh === null) problemas.push(`${O_CONFERIR}: não existe`);
  const roda = conferirSh === null ? "" : semComentario(conferirSh);
  if (!diz(A_PAGINA_DIZ_DO_CONFERIR)) problemas.push(`${A_PAGINA}: não diz se o conferir.sh compila a sonda («${A_PAGINA_DIZ_DO_CONFERIR}»)`);
  else
    for (const nome of ["wasm-probe", ...(artefato === null ? [] : [artefato])])
      if (roda.includes(nome)) problemas.push(`${O_CONFERIR}: nomeia ${nome} fora de comentário, e a página diz que ele não compila a sonda`);

  // 3 · a receita
  const analise = ler(A_ANALISE);
  if (analise === null) problemas.push(`${A_ANALISE}: não existe`);
  const secao = analise === null ? null : aSecao10(analise);
  if (analise !== null && secao === null) problemas.push(`${A_ANALISE}: sem a seção 10`);
  const cfgsDaPagina = osCfgs(pagina);
  const cfgsDaSecao = secao === null ? [] : osCfgs(secao.corpo);
  if (cfgsDaPagina.length === 0) problemas.push(`${A_PAGINA}: nenhum bloco de comando com --cfg getrandom_backend`);
  for (const c of cfgsDaPagina)
    if (secao !== null && !cfgsDaSecao.includes(c)) problemas.push(`${A_PAGINA}: a receita usa getrandom_backend="${c}", e a seção 10 usa ${cfgsDaSecao.join(", ") || "nenhum"}`);
  const getrandom = cargo === null ? null : (dependenciasDoBinario(cargo).get("getrandom") ?? null);
  if (cargo !== null && (getrandom === null || !/"wasm_js"/.test(getrandom)))
    problemas.push(`${O_CARGO}: o getrandom não tem a feature wasm_js, que a página dá como a correção`);
  if (pagina.includes(A_PAGINA_DIZ_DO_BACKEND) && !roda.includes(A_RECEITA_DO_BACKEND))
    problemas.push(`${A_PAGINA}: diz que a ponte sai pelo backend custom, e o conferir.sh não imprime essa receita`);

  // 4 · o Cargo.lock
  const lock = ler(O_LOCK);
  if (lock === null) problemas.push(`${O_LOCK}: não existe`);
  const pacotes = lock === null ? [] : lerOLock(lock);
  if (lock !== null && pacotes.length === 0) problemas.push(`${O_LOCK}: nenhum pacote lido — universo vazio (D213)`);
  if (lock !== null) {
    if (!pacotes.some((p) => p.nome === "rand" && p.versao.startsWith("0.9."))) problemas.push(`${O_LOCK}: sem rand 0.9, que a página dá como a origem`);
    const gr = alcancavel(pacotes, "rand", "0.9.", "getrandom");
    if (!gr.some((v) => v.startsWith("0.3."))) problemas.push(`${O_LOCK}: o rand 0.9 não alcança getrandom 0.3 (alcança ${gr.join(", ") || "nada"})`);
    // O item que falta não vira texto vazio (a varredura do LAB-52 o pegou na primeira versão): a falta dele já é
    // problema da pergunta 1, e a cola só se confere contra um item que existe.
    const lockItem = item("Cargo.lock");
    for (const c of COLA_NOMEAVEL) {
      if (lockItem === null) break;
      const tem = pacotes.some((p) => p.nome === c);
      const nomeia = lockItem.includes(`\`${c}\``);
      if (tem && !nomeia) problemas.push(`${A_PAGINA}: o item do Cargo.lock não nomeia ${c}, que o lock traz`);
      if (nomeia && !tem) problemas.push(`${A_PAGINA}: o item do Cargo.lock nomeia ${c}, que o lock não traz`);
      if (nomeia && !pagina.slice(0, pagina.indexOf(MARCA_ABRE)).includes(`\`${c}\``))
        problemas.push(`${A_PAGINA}: a cola ${c} está no item, e o texto da sonda não a nomeia`);
    }
    if (diz(A_PAGINA_DIZ_DO_NATIVO))
      for (const n of NATIVOS) if (pacotes.some((p) => p.nome === n)) problemas.push(`${O_LOCK}: traz ${n}, e a página diz sem dependência nativa`);
  }

  // 5 · o upstream
  if (cargo !== null && diz(A_PAGINA_DIZ_DO_UPSTREAM)) {
    const tensor = dependenciasDoBinario(cargo).get("symbios-tensor") ?? null;
    if (tensor === null || !/path\s*=\s*"\.\.\/\.\.\/upstream"/.test(tensor))
      problemas.push(`${O_CARGO}: o symbios-tensor não vem por path = "../../upstream", e a página diz que a sonda não modifica o upstream`);
    if (/^\s*\[(patch(\.[^\]]+)?|replace)\]/m.test(cargo.replace(/#.*$/gm, "")))
      problemas.push(`${O_CARGO}: tem [patch] ou [replace], e a página diz que a sonda não modifica o upstream`);
  }

  // 6 · o rust-toolchain.toml
  const tc = item("rust-toolchain.toml");
  if (tc !== null) {
    const daqui = ler(O_TOOLCHAIN);
    const de = ler(O_TOOLCHAIN_DO_UPSTREAM);
    const iguais = daqui !== null && de !== null && daqui === de;
    const dizIgual = comoARegraSeLe(tc).includes(comoARegraSeLe(A_PAGINA_DIZ_DO_TOOLCHAIN));
    if (iguais && !dizIgual) problemas.push(`${A_PAGINA}: o item do rust-toolchain.toml não diz que é byte a byte o do upstream, e é`);
    if (dizIgual && !iguais) problemas.push(`${A_PAGINA}: o item do rust-toolchain.toml diz byte a byte o do upstream, e não é`);
  }

  // 7 · os números do LAB-00 em dois lugares
  const numerosDaPagina = osNumerosDaPagina(pagina);
  if (numerosDaPagina.bytes === null) problemas.push(`${A_PAGINA}: sem os bytes do LAB-00`);
  if (numerosDaPagina.segundos === null) problemas.push(`${A_PAGINA}: sem os segundos do LAB-00`);
  if (secao !== null) {
    const daSecao = osNumerosDaSecao(secao.corpo);
    for (const c of ["bytes", "segundos"] as const)
      if (daSecao[c] !== numerosDaPagina[c]) problemas.push(`${A_ANALISE}: a seção 10 diz ${c} = ${daSecao[c]}, e a página diz ${numerosDaPagina[c]}`);
    if (daSecao.bytes !== null && daSecao.kb !== Math.round(daSecao.bytes / 1024))
      problemas.push(`${A_ANALISE}: a seção 10 diz ${daSecao.kb} KB, e ${daSecao.bytes} bytes são ${Math.round(daSecao.bytes / 1024)} KB`);
  }
  if (!diz(A_PAGINA_DIZ_DOS_DOIS)) problemas.push(`${A_PAGINA}: não diz que os números do LAB-00 moram em dois lugares («${A_PAGINA_DIZ_DOS_DOIS}»)`);
  else if (!pagina.slice(pagina.indexOf("moram em dois lugares")).includes(A_ANALISE))
    problemas.push(`${A_PAGINA}: diz dois lugares e não nomeia ${A_ANALISE} depois da frase`);

  // 8 · a seção 10 citada
  if (secao !== null) {
    if (!/WebAssembly/.test(secao.titulo)) problemas.push(`${A_ANALISE}: a seção 10 se chama «${secao.titulo}», e a página a cita como a do WebAssembly`);
    const erro = /`(error: [^`]+)`/.exec(pagina)?.[1]?.replace(/^error: /, "");
    if (erro === undefined) problemas.push(`${A_PAGINA}: não cita o erro da primeira tentativa`);
    else if (!secao.corpo.includes(erro)) problemas.push(`${A_ANALISE}: a seção 10 não traz o erro que a página cita («${erro}»)`);
  }

  // 9 · os caminhos
  let caminhosLidos = 0;
  for (const link of osLinks(pagina)) {
    caminhosLidos++;
    const alvo = normalize(A_PASTA + link).replace(/\/$/, "");
    if (!resolve(alvo)) problemas.push(`${A_PAGINA}: o link ${link} não resolve em nada que o git carrega (${alvo})`);
  }
  for (const c of [...pagina.matchAll(/`((?:docs|external-engines)\/[^`\s]+)`/g)].map((m) => m[1] as string)) {
    caminhosLidos++;
    if (!resolve(c.replace(/\/$/, ""))) problemas.push(`${A_PAGINA}: ${c} não existe no git`);
  }

  return { naPasta, pacotesNoLock: pacotes.length, numerosDaPagina, caminhosLidos, problemas };
}

/** Os alvos dos links da página que não são endereço de fora. */
export function osLinks(pagina: string): string[] {
  return [...pagina.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1] as string).filter((l) => !/^[a-z]+:/i.test(l) && !l.startsWith("#"));
}

export function conferirAArvore(raiz: string): Resultado {
  const ler = (c: string) => {
    const p = join(raiz, c);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  return conferir(arquivosQueOGitCarrega(raiz), ler);
}

export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se os números do LAB-00 são VERDADE hoje: a régua confere que os dois lugares dizem o mesmo, não que o `cargo build` de hoje dá 162 696 bytes — nada compila a sonda, e nesta máquina falta o alvo do `rustup`",
  "se a receita de cima ainda compila: a régua confere o `--cfg` contra a análise e a feature contra o `Cargo.toml`, não o compilador",
  "o que o `src/lib.rs` FAZ: a régua confere o nome do arquivo na lista, não a descrição ao lado",
  "o comentário em inglês do `rust-toolchain.toml`, que fala do CI do upstream: a régua confere que a página o diz cópia, e não toca o arquivo — ele é igual nas três crates de `archilly/` e no `upstream/` (de quem o comentário fala, e o que esta casa tem em lugar dele, diz a página do motor, conferida pela `os-toolchains-de-archilly.ts`, LAB-190)",
  "a cola pedida por outro nome que não `wasm-bindgen`, `js-sys` ou `web-sys` (o LAB-176 pergunta a família inteira, com `gloo`, na ponte carregada)",
];
