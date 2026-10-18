/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O `.WASM` NÃO PEDE NADA DO AMBIENTE — perguntado ao que o PRODUZ e ao que o CARREGA. (LAB-176, item 900, D404)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, do LF-FINAL (14/09/2026), tem na tabela *Execução* a linha:
 *
 * > O `.wasm` não pede nada do ambiente · ✅ · carregado com `WebAssembly.instantiate(bytes, {})` — **objeto de imports
 * > vazio**. Medido no LAB-01: 189 KB, zero imports
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. A medição foi uma, no LAB-01 (10/09), sobre um binário que
 * **não é versionado** e que **nenhuma máquina de sessão produz** desde o LAB-31 (o alvo `wasm32-unknown-unknown` do
 * `rustup` não instala — de novo nesta rodada: *"unsuccessful tunnel"* em `static.rust-lang.org`). As rodadas LAB-174 e
 * LAB-175 deixaram a linha de lado por isso: *"a do `.wasm` espera o `rustup`"*. Metade dela espera; a outra metade,
 * não — o que faz o módulo não pedir nada **está no código**, e o código o `git` carrega:
 *
 * | porta | o que se pergunta | onde se lê |
 * |---|---|---|
 * | `instanciacao` | toda `WebAssembly.instantiate(`, `WebAssembly.instantiateStreaming(` e `new WebAssembly.Instance(` passa **`{}`** como imports | o código JS/TS, sem comentário e sem string; a lista {@link INSTANCIADORES} nos dois sentidos |
 * | `cola` | a ponte que vira o `.wasm` carregado não depende de `wasm-bindgen`, `js-sys`, `web-sys`, `wasm-bindgen-futures`, `gloo*`, nem do `getrandom` com `wasm_js`/`js` | as seções de dependência do `Cargo.toml` e os pacotes do `Cargo.lock` |
 * | `backend` | o `getrandom` sai pelo backend `custom`: a função `__getrandom_v03_custom` definida no `src/` da ponte (fora de comentário) e o `getrandom_backend=\"custom\"` na receita do `conferir.sh`; e nenhum bloco `extern "C" { … }` nem `wasm_import_module` ali, que viraria import | o `src/` da ponte e o `conferir.sh` |
 * | `ponte` | toda crate `cdylib` da árvore é a carregada ou uma sonda declarada ({@link PONTES}); a carregada tem o artefato nomeado no `conferir.sh`, a sonda não é nomeada em código nenhum | os `Cargo.toml` e todo texto de código |
 * | `binario` | **quando o `.wasm` existe no disco**, `WebAssembly.Module.imports` dele é vazio | o arquivo, no caminho do `conferir.sh`; ausente, a resposta é `null` — *"não medi"* —, nunca zero (D23) |
 *
 * # O que se mediu (18/10/2026, antes do commit desta rodada)
 *
 * Duas instanciações, as duas com `{}`: `symbios/adapter/src/motor.ts` (`instantiate(modulo, {})`, depois de um
 * `compile`) e a bancada, `symbios/adapter/ferramentas/navegador/prova.js` (`instantiate(bytes, {})`). A página dizia
 * *"`instantiate(bytes, {})`"* — é a forma da bancada; a do adaptador é a de dois passos, que o comentário dele explica.
 * Duas crates `cdylib`: `symbios/archilly/wasm/` (a ponte, `archilly_symbios_wasm.wasm`, nomeada no `conferir.sh` e em
 * dezoito ferramentas `labNN.ts`) e `symbios/archilly/wasm-probe/` — **a sonda do LAB-00, que tem a cola**: ela depende do
 * `getrandom` com `wasm_js`, e o `Cargo.lock` dela traz `wasm-bindgen` e `js-sys`. É o caso válido que quase parece
 * inválido, e é ela que explica o `Cargo.toml` da ponte (*"o LAB-00 usou a feature `wasm_js`, que funciona — mas arrasta
 * `wasm-bindgen`"*). Ninguém carrega o artefato dela. O binário: ausente nesta máquina — `binario: null`.
 *
 * Sem a trava, as mutações que importam passavam a esteira inteira sem barulho além das contagens de arquivo: trocar o
 * `{}` do `motor.ts` por `{ env: {} }`, pôr `features = ["wasm_js"]` no `getrandom` da ponte, ou apagar o
 * `__getrandom_v03_custom`. A primeira quebraria só na máquina que tem o `.wasm` — nenhuma, hoje —; a segunda e a
 * terceira, só na compilação, que também não roda aqui.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { soOCodigo } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela *Execução* que esta régua responde. */
export const A_LINHA = "| O `.wasm` não pede nada do ambiente";
export const O_PONTEIRO = "external-engines/esteira/src/o-wasm-nao-pede-nada.ts";
/** A receita que diz onde o binário fica e como se compila. */
export const A_RECEITA = "external-engines/conferir.sh";

/** Quem instancia um módulo WebAssembly, e quantas vezes. Conferido nos dois sentidos contra a árvore. */
export const INSTANCIADORES: readonly { caminho: string; vezes: number; prompt: string }[] = [
  { caminho: "external-engines/symbios/adapter/src/motor.ts", vezes: 1, prompt: "LAB-01" },
  { caminho: "external-engines/symbios/adapter/ferramentas/navegador/prova.js", vezes: 1, prompt: "LAB-01" },
];

export interface Ponte {
  /** A pasta da crate (onde está o `Cargo.toml`). */
  pasta: string;
  papel: "carregada" | "sonda";
  motivo: string;
}

/** Toda crate `cdylib` da árvore. Conferido nos dois sentidos. */
export const PONTES: readonly Ponte[] = [
  {
    pasta: "external-engines/symbios/archilly/wasm",
    papel: "carregada",
    motivo: "a ponte do LAB-01: o `.wasm` que o adaptador, a bancada e as ferramentas `labNN.ts` carregam",
  },
  {
    pasta: "external-engines/symbios/archilly/wasm-probe",
    papel: "sonda",
    motivo:
      "a sonda do LAB-00, que mostrou que o `getrandom` com `wasm_js` arrasta `wasm-bindgen` (o import `__wbindgen_placeholder__`); TEM a cola, de propósito, e ninguém carrega o artefato dela",
  },
];

/** Os pacotes que fazem o `.wasm` pedir coisa ao ambiente (a cola do JavaScript). */
export const COLA: readonly RegExp[] = [/^wasm-bindgen(-.*)?$/, /^js-sys$/, /^web-sys$/, /^gloo(-.*)?$/];
/** As features do `getrandom` que puxam a cola. */
export const FEATURES_DE_COLA: readonly string[] = ["wasm_js", "js"];
export const O_BACKEND = "__getrandom_v03_custom";
export const A_RECEITA_DO_BACKEND = 'getrandom_backend=\\"custom\\"';

const JS = /\.(ts|mts|cts|js|mjs|cjs)$/i;
const naoEhDependencia = (c: string) => !/(^|\/)(node_modules|target)\//.test(c);

/** O nome do artefato de uma crate: o `name` do `[package]` (ou do `[lib]`), com `-` virando `_`, mais `.wasm`. */
export function artefatoDe(cargoToml: string): string | null {
  const lib = /^\[lib\][^[]*?^\s*name\s*=\s*"([^"]+)"/ms.exec(cargoToml)?.[1];
  const pacote = /^\[package\][^[]*?^\s*name\s*=\s*"([^"]+)"/ms.exec(cargoToml)?.[1];
  const nome = lib ?? pacote;
  return nome ? `${nome.replace(/-/g, "_")}.wasm` : null;
}

export const ehCdylib = (cargoToml: string): boolean =>
  /^\[lib\][^[]*?^\s*crate-type\s*=\s*\[[^\]]*"cdylib"/ms.test(cargoToml.replace(/#.*$/gm, ""));

/**
 * As dependências que entram no binário: `[dependencies]`, `[target.….dependencies]` e a forma `[dependencies.X]`.
 * Devolve `nome → texto da declaração` (para ler as features). `dev-` e `build-dependencies` não entram no `.wasm`.
 */
export function dependenciasDoBinario(cargoToml: string): Map<string, string> {
  const fora = new Map<string, string>();
  let secao: string | null = null;
  let nomeDaSecao: string | null = null;
  for (const bruta of cargoToml.split("\n")) {
    const l = bruta.replace(/#.*$/, "");
    const cab = /^\s*\[([^\]]+)\]\s*$/.exec(l);
    if (cab) {
      const s = cab[1]!.trim();
      const dot = /^(?:target\..+\.)?dependencies\.([A-Za-z0-9_-]+)$/.exec(s);
      if (dot) {
        secao = "uma";
        nomeDaSecao = dot[1]!;
        fora.set(nomeDaSecao, "");
      } else if (/^(?:target\..+\.)?dependencies$/.test(s)) {
        secao = "lista";
        nomeDaSecao = null;
      } else {
        secao = null;
        nomeDaSecao = null;
      }
      continue;
    }
    if (secao === "lista") {
      const m = /^\s*([A-Za-z0-9_-]+)\s*=\s*(.*)$/.exec(l);
      if (m) fora.set(m[1]!, m[2]!.trim());
    } else if (secao === "uma" && nomeDaSecao) {
      fora.set(nomeDaSecao, `${fora.get(nomeDaSecao)} ${l.trim()}`.trim());
    }
  }
  return fora;
}

/** Os pacotes de um `Cargo.lock`. */
export const pacotesDoLock = (lock: string): string[] => [...lock.matchAll(/^name = "([^"]+)"/gm)].map((m) => m[1]!);

const ehCola = (nome: string) => COLA.some((r) => r.test(nome));

/** Os imports que cada instanciação passa, lidos no código sem comentário e sem string. `null` = sem segundo argumento. */
export function importsDasInstanciacoes(texto: string): (string | null)[] {
  const codigo = soOCodigo(texto);
  const fora: (string | null)[] = [];
  const chamada = /\bnew\s+WebAssembly\s*\.\s*Instance\s*\(|\bWebAssembly\s*\.\s*(?:instantiateStreaming|instantiate)\s*\(/g;
  for (const m of codigo.matchAll(chamada)) {
    let i = m.index! + m[0].length;
    let profundidade = 0;
    let virgula = -1;
    let fim = -1;
    for (; i < codigo.length; i++) {
      const c = codigo[i]!;
      if ("([{".includes(c)) profundidade++;
      else if (")]}".includes(c)) {
        if (profundidade === 0) {
          fim = i;
          break;
        }
        profundidade--;
      } else if (c === "," && profundidade === 0) {
        if (virgula < 0) virgula = i;
        else {
          fim = i;
          break;
        }
      }
    }
    if (virgula < 0) fora.push(null);
    else fora.push(codigo.slice(virgula + 1, fim < 0 ? undefined : fim).replace(/\s+/g, ""));
  }
  return fora;
}

/** Quantos imports um binário pede. `null` se os bytes não compilam. */
export function importsDoBinario(bytes: Uint8Array<ArrayBuffer>): number | null {
  try {
    return WebAssembly.Module.imports(new WebAssembly.Module(bytes)).length;
  } catch {
    return null;
  }
}

export type TipoDeProblema =
  | "instanciacao-com-imports"
  | "instanciador-fora-da-lista"
  | "instanciador-que-mudou"
  | "ponte-fora-da-lista"
  | "ponte-que-sumiu"
  | "carregada-sem-artefato-na-receita"
  | "sonda-carregada"
  | "cola-no-cargo-toml"
  | "cola-no-cargo-lock"
  | "backend-ausente"
  | "import-declarado-a-mao"
  | "binario-pede-imports"
  | "linha-ausente"
  | "linha-nao-nomeia"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

export interface Resultado {
  caminhos: number;
  lidosJs: number;
  instanciacoes: { caminho: string; imports: (string | null)[] }[];
  cdylibs: string[];
  /** Imports do binário no disco; `null` = ausente ou ilegível — *não medido*, nunca zero. */
  binario: number | null;
  problemas: Problema[];
}

/** O caminho do binário, lido da receita (`WASM="$RAIZ/…"`), não escrito de novo aqui. */
export const caminhoDoBinario = (receita: string): string | null =>
  /^WASM="\$RAIZ\/([^"]+)"/m.exec(receita)?.[1] ?? null;

/**
 * A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null`; `lerBytes` devolve o binário, se houver.
 */
export function conferirOWasm(
  arquivos: readonly string[],
  ler: (caminho: string) => string | null,
  lerBytes: (caminho: string) => Uint8Array<ArrayBuffer> | null = () => null,
): Resultado {
  const caminhos = [...arquivos].filter(naoEhDependencia).sort();
  const problemas: Problema[] = [];
  let lidosJs = 0;
  const instanciacoes: Resultado["instanciacoes"] = [];
  const textosDeCodigo: [string, string][] = [];

  for (const c of caminhos) {
    if (!JS.test(c) && !c.endsWith(".sh")) continue;
    const t = ler(c);
    if (t === null) continue;
    textosDeCodigo.push([c, t]);
    if (!JS.test(c)) continue;
    lidosJs++;
    const imps = importsDasInstanciacoes(t);
    if (imps.length > 0) instanciacoes.push({ caminho: c, imports: imps });
  }
  if (caminhos.length === 0 || lidosJs === 0)
    problemas.push({ tipo: "universo-vazio", detalhe: `${caminhos.length} caminhos, ${lidosJs} JS/TS lidos — verde sobre zero não é verde` });

  // ── instanciação
  for (const { caminho, imports } of instanciacoes) {
    imports.forEach((imp, k) => {
      if (imp !== "{}")
        problemas.push({
          tipo: "instanciacao-com-imports",
          detalhe: `${caminho}: a ${k + 1}ª instanciação passa ${imp === null ? "nada" : `"${imp}"`} como imports — a página diz objeto vazio, \`{}\``,
        });
    });
    const d = INSTANCIADORES.find((x) => x.caminho === caminho);
    if (!d) problemas.push({ tipo: "instanciador-fora-da-lista", detalhe: `${caminho} instancia WebAssembly e não está em INSTANCIADORES` });
    else if (d.vezes !== imports.length)
      problemas.push({ tipo: "instanciador-que-mudou", detalhe: `${caminho}: declarado ${d.vezes}, a árvore tem ${imports.length}` });
  }
  for (const d of INSTANCIADORES)
    if (!instanciacoes.some((x) => x.caminho === d.caminho))
      problemas.push({ tipo: "instanciador-que-mudou", detalhe: `${d.caminho}: declarado ${d.vezes}, a árvore tem 0` });

  // ── as pontes
  const receita = ler(A_RECEITA) ?? "";
  const cdylibs: string[] = [];
  for (const c of caminhos) {
    if (!c.endsWith("Cargo.toml")) continue;
    const t = ler(c);
    if (t !== null && ehCdylib(t)) cdylibs.push(c.replace(/\/?Cargo\.toml$/, ""));
  }
  for (const p of cdylibs)
    if (!PONTES.some((x) => x.pasta === p)) problemas.push({ tipo: "ponte-fora-da-lista", detalhe: `${p} é crate cdylib e não está em PONTES` });
  for (const p of PONTES) {
    if (!cdylibs.includes(p.pasta)) {
      problemas.push({ tipo: "ponte-que-sumiu", detalhe: `${p.pasta} está em PONTES e não é crate cdylib na árvore` });
      continue;
    }
    const toml = ler(`${p.pasta}/Cargo.toml`) ?? "";
    const artefato = artefatoDe(toml);
    if (p.papel === "sonda") {
      const quem = artefato ? textosDeCodigo.filter(([, t]) => t.includes(artefato)).map(([c]) => c) : [];
      if (quem.length > 0)
        problemas.push({ tipo: "sonda-carregada", detalhe: `${p.pasta} é sonda, e ${artefato} é nomeado em ${quem.join(", ")}` });
      continue;
    }
    if (!artefato || !receita.includes(artefato))
      problemas.push({ tipo: "carregada-sem-artefato-na-receita", detalhe: `${p.pasta}: o artefato ${artefato ?? "(sem nome)"} não está no ${A_RECEITA}` });
    for (const [nome, decl] of dependenciasDoBinario(toml)) {
      if (ehCola(nome)) problemas.push({ tipo: "cola-no-cargo-toml", detalhe: `${p.pasta}/Cargo.toml depende de ${nome}` });
      if (nome === "getrandom" && FEATURES_DE_COLA.some((f) => decl.includes(`"${f}"`)))
        problemas.push({ tipo: "cola-no-cargo-toml", detalhe: `${p.pasta}/Cargo.toml liga a cola no getrandom: ${decl}` });
    }
    const lock = ler(`${p.pasta}/Cargo.lock`);
    if (lock !== null)
      for (const n of pacotesDoLock(lock).filter(ehCola))
        problemas.push({ tipo: "cola-no-cargo-lock", detalhe: `${p.pasta}/Cargo.lock traz ${n}` });
    const rs = caminhos.filter((c) => c.startsWith(`${p.pasta}/src/`) && c.endsWith(".rs"));
    let backend = false;
    for (const c of rs) {
      const t = (ler(c) ?? "").replace(/\/\/.*$/gm, "");
      if (new RegExp(`\\bfn\\s+${O_BACKEND}\\s*\\(`).test(t)) backend = true;
      if (/\bextern\s+"C"\s*\{|#\[\s*link\s*\(\s*wasm_import_module/.test(t))
        problemas.push({ tipo: "import-declarado-a-mao", detalhe: `${c} declara um bloco \`extern "C" { … }\` ou \`wasm_import_module\`: vira import do .wasm` });
    }
    if (!backend)
      problemas.push({ tipo: "backend-ausente", detalhe: `${p.pasta}/src/ não define ${O_BACKEND} fora de comentário (${rs.length} arquivos .rs lidos)` });
    if (!receita.includes(A_RECEITA_DO_BACKEND))
      problemas.push({ tipo: "backend-ausente", detalhe: `a receita do ${A_RECEITA} não compila com ${A_RECEITA_DO_BACKEND}` });
  }

  // ── o binário, quando existe
  const onde = caminhoDoBinario(receita);
  const bytes = onde ? lerBytes(onde) : null;
  const binario = bytes ? importsDoBinario(bytes) : null;
  if (binario !== null && binario > 0)
    problemas.push({ tipo: "binario-pede-imports", detalhe: `${onde} pede ${binario} import(s) do ambiente` });

  // ── a linha da página
  const pagina = ler(A_PAGINA);
  const linha = pagina?.split("\n").find((l) => l.startsWith(A_LINHA)) ?? null;
  if (linha === null) problemas.push({ tipo: "linha-ausente", detalhe: `o ${A_PAGINA} não tem a linha "${A_LINHA}"` });
  else {
    const devem = [
      O_PONTEIRO,
      ...INSTANCIADORES.map((x) => x.caminho.replace(/^external-engines\//, "")),
      ...PONTES.filter((p) => p.papel === "carregada").map((p) => `${p.pasta.replace(/^external-engines\//, "")}/`),
    ];
    for (const n of devem)
      if (!linha.includes(n)) problemas.push({ tipo: "linha-nao-nomeia", detalhe: `a linha do .wasm não nomeia ${n}` });
  }

  return { caminhos: caminhos.length, lidosJs, instanciacoes, cdylibs, binario, problemas };
}

/** A árvore de verdade: o `git` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirOWasm(
    arquivosQueOGitCarrega(raiz),
    (c) => {
      try {
        return readFileSync(join(raiz, c), "utf8");
      } catch {
        return null;
      }
    },
    (c) => (existsSync(join(raiz, c)) ? new Uint8Array(readFileSync(join(raiz, c))) : null),
  );
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o binário em máquina sem ele: o `.wasm` não é versionado e o alvo do `rustup` não instala em máquina de sessão; aí a resposta é `binario: null` (não medido), e o que se pergunta é só o que o produz e o que o carrega",
  "os 189 KB do LAB-01: é número da época, dito como tal na página; o tamanho de hoje só existe onde o binário existe",
  "a instanciação escrita de outro jeito: `const { instantiate } = WebAssembly`, um `<script>` dentro de `.html`, e, do outro lado, o falso positivo: imports vazios guardados numa variável (`const nada = {}`; `instantiate(b, nada)`) são acusados, porque a régua exige o `{}` escrito na chamada",
  "o import declarado à mão fora do `src/` da ponte (numa dependência por caminho, como o `upstream/`): a régua lê o `extern \"C\" {` e o `wasm_import_module` só no código da própria ponte; o `upstream/` é intocável e cobrado pela árvore (LAB-132)",
  "o `Cargo.lock` não versionado: sem ele, a cola de segunda mão (dependência de dependência) não se vê; hoje os três locks do Symbios são versionados",
];
