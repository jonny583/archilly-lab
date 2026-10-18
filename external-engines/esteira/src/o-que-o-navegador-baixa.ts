/**
 * ════════════════════════════════════════════════════════════════════════════
 *  NENHUMA CHAVE EM `VITE_` — "não há build de navegador neste repositório", e há um: o `.wasm`, que embute uma
 *  variável de compilação. (LAB-180, item 900, D408)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, tabela *Chaves e segredos*, do LF-FINAL (14/09/2026), dizia:
 *
 * > Nenhuma chave em `VITE_` · ✅ **não se aplica, e está limpo** · não há build de navegador neste repositório; e a
 * > busca acima cobre `VITE_`
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. A regra do Padrão existe porque o EMPACOTADOR de navegador
 * copia para dentro do arquivo que o navegador baixa toda variável de ambiente com o prefixo público — e o que o
 * navegador baixa, qualquer um lê. A frase da página responde pela AUSÊNCIA do empacotador, e ninguém perguntava; a
 * segunda metade (*"a busca acima cobre"*) é verdade desde o LAB-166, e a linha não nomeava a trava.
 *
 * # O que se mediu, por LUGAR (18/10/2026)
 *
 * O navegador recebe, nesta casa, só o que a bancada serve (`a-unica-interface.ts`, LAB-153, a exceção declarada): o
 * servidor da prova automática lê o arquivo do disco e o devolve COMO ESTÁ (`readFileSync`, sem transpilar). E recebe
 * **um** artefato compilado: o `.wasm` da ponte `symbios/archilly/wasm/` (`o-wasm-nao-pede-nada.ts`, LAB-176). Três
 * perguntas, uma por porta por onde uma variável de compilação chegaria ao navegador:
 *
 * | pergunta | onde | achados em 18/10 |
 * |---|---|---|
 * | `empacotador` | dependência de empacotador num `package.json`, o `script` que o chama, arquivo de configuração dele pelo nome, a chamada no código | 0 |
 * | `pagina` | os `.html` e `.js` da bancada: leitura de ambiente e nome com prefixo público | 0 |
 * | `wasm` | `env!` e `option_env!` nos `.rs` das pontes que o navegador carrega | **1** — `SYMBIOS_VERSAO`, que o `build.rs` põe a partir do `Cargo.toml` do upstream; nenhuma lida da máquina |
 *
 * **A frase era falsa na letra e verdadeira no que importa:** HÁ um build que chega ao navegador — o `cargo build
 * --target wasm32-unknown-unknown` do `conferir.sh` — e ele embute uma variável; mas ela é o carimbo da versão do
 * motor, lido de um arquivo público pelo `build.rs`, e não uma chave da máquina. Ninguém perguntava nem uma coisa nem
 * outra: um `env!("CHAVE")` no `lib.rs` da ponte passaria a esteira inteira — a `nada-pago.ts` (LAB-148) o veria como
 * variável de ambiente nova e reprovaria pela PORTA não declarada, mas quem a declara escolhe a classe, e "local" a
 * cala; esta trava pergunta outra coisa: se a variável vai para dentro do que o navegador baixa.
 *
 * # A régua
 *
 * 1. **As três perguntas na árvore.** `empacotador` e `pagina` têm de dar zero (`empacotador`, `pagina-le-o-ambiente`);
 *    no `wasm`, todo nome embutido tem de estar em {@link EMBUTIDAS}, e o `build.rs` da ponte tem de pô-lo com
 *    `cargo:rustc-env=` (`embutida-nao-declarada`, `embutida-sem-build-rs`); o `build.rs` não lê ambiente da máquina
 *    (`build-le-a-maquina`); e a declarada que sumiu do código reprova (`declarada-que-sumiu`) — os dois sentidos.
 * 2. **A busca da linha de cima cobre o prefixo** — a `a-busca-das-chaves.ts` (LAB-166) continua com ele nos nomes
 *    (`busca-sem-o-prefixo`).
 * 3. **A linha** nomeia esta trava, o LAB-180, a `a-busca-das-chaves.ts` e o LAB-166 (`linha-nao-nomeia`); escreve
 *    *"**N** variável de compilação"*, N o número de nomes embutidos, e cada nome (`linha-numero-errado`); e não volta a
 *    dizer *"não há build de navegador"* (`linha-sem-build`, o caso da página de antes).
 * 4. **A tabela** da seção *Reconferido no LAB-180* tem as três perguntas, nem mais nem menos, com os achados que a
 *    árvore dá (`tabela-*`).
 * 5. **Universo vazio** — pergunta sem arquivo lido → `universo-vazio` (D213). Os três universos saem na medição.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NOMES } from "./a-busca-das-chaves.ts";
import { PONTES } from "./o-wasm-nao-pede-nada.ts";
import { soOCodigo } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela que esta régua responde. */
export const A_LINHA = "| Nenhuma chave em `VITE_` |";
export const O_PONTEIRO = "external-engines/esteira/src/o-que-o-navegador-baixa.ts";
export const ESTA_RODADA = 180;
export const A_BUSCA = { trava: "external-engines/esteira/src/a-busca-das-chaves.ts", desde: 166 } as const;
/** O título da seção da página que leva a tabela das três perguntas. */
export const A_SECAO = "## Reconferido no LAB-180";
/** A frase da página de antes, que esta trava não deixa voltar. */
export const A_FRASE_DE_ANTES = "não há build de navegador";

/** A pasta da bancada: o que o servidor dela devolve como está é o que o navegador recebe (LAB-153). */
export const A_BANCADA = "external-engines/symbios/adapter/ferramentas/navegador/";

export type Pergunta = "empacotador" | "pagina" | "wasm";
export const AS_PERGUNTAS: readonly Pergunta[] = ["empacotador", "pagina", "wasm"];

/**
 * Os nomes que o build da ponte embute no `.wasm` — conferidos nos dois sentidos. Cada um tem de ser posto pelo
 * `build.rs` da ponte (`cargo:rustc-env=`), e não lido da máquina.
 */
export const EMBUTIDAS: readonly { nome: string; ponte: string; motivo: string }[] = [
  {
    nome: "SYMBIOS_VERSAO",
    ponte: "external-engines/symbios/archilly/wasm",
    motivo: "a versão do motor, que o `build.rs` lê do `Cargo.toml` do upstream (público) para o campo `versao_motor` do diagnóstico; não é chave",
  },
];

// Os nomes vão em pedaços: escritos inteiros, a própria régua os acharia neste arquivo — e a busca das chaves também.
const EMPACOTADORES = [
  "vi" + "te",
  "@vitejs/[\\w.-]+",
  "web" + "pack(-cli)?",
  "roll" + "up",
  "@rollup/[\\w.-]+",
  "rolldown",
  "es" + "build",
  "par" + "cel",
  "@parcel/[\\w.-]+",
  "rs" + "pack",
  "@rspack/[\\w.-]+",
  "tsup",
  "snowpack",
  "next",
  "astro",
  "@sveltejs/kit",
];
const DEPENDENCIA_DE_EMPACOTADOR = new RegExp(`^(${EMPACOTADORES.join("|")})$`);
/** O `script` do `package.json` que chama um empacotador — o `bun build` incluído. */
const SCRIPT_DE_EMPACOTADOR = new RegExp(String.raw`(^|[\s;&|])(` + ["bun build", "vi" + "te", "web" + "pack", "roll" + "up", "es" + "build", "par" + "cel", "rs" + "pack", "tsup", "next build", "astro build"].join("|") + String.raw`)\b`);
const CONFIG_DE_EMPACOTADOR = new RegExp(String.raw`(^|/)(` + ["vi" + "te", "web" + "pack", "roll" + "up", "rolldown", "rs" + "pack", "tsup", "next", "astro", "svelte"].join("|") + String.raw`)\.config\.[cm]?[jt]s$|(^|/)\.parcelrc$`);
const CHAMADA_DE_EMPACOTADOR = new RegExp(String.raw`\bBun\s*\.\s*bu` + String.raw`ild\s*\(|\bes` + String.raw`build\s*\.\s*(build|context)\s*\(`);
const CODIGO = /\.(ts|mts|cts|tsx|js|mjs|cjs|jsx)$/i;

/** A leitura de ambiente que um empacotador substitui no arquivo que o navegador baixa. */
const LEITURA_DE_AMBIENTE = new RegExp(String.raw`\bimport\s*\.\s*meta\s*\.\s*en` + String.raw`v\b|\bprocess\s*\.\s*en` + String.raw`v\b|\bBun\s*\.\s*en` + String.raw`v\b`);
/** Os prefixos públicos dos empacotadores: a variável que os leva é copiada para dentro do arquivo do navegador. */
export const PREFIXOS_PUBLICOS: readonly string[] = ["VI" + "TE", "NEXT_" + "PUBLIC", "REACT_" + "APP", "BUN_" + "PUBLIC", "EXPO_" + "PUBLIC", "NUXT_" + "PUBLIC", "PUB" + "LIC"];
const NOME_PUBLICO = new RegExp(String.raw`\b(` + PREFIXOS_PUBLICOS.join("|") + String.raw`)_[A-Z0-9_]+\b`);
const DA_PAGINA = /\.(html?|js|mjs)$/i;

const EMBUTE = new RegExp(String.raw`\b(option_)?en` + String.raw`v!\s*\(\s*"([^"]+)"`, "g");
const LE_A_MAQUINA = new RegExp(String.raw`\ben` + String.raw`v\s*::\s*var(_os)?\s*\(|\b(option_)?en` + String.raw`v!\s*\(`);
/** Comentário de Rust fora: `//` até o fim da linha, e `/* … *\/`. */
const semComentarioDeRust = (t: string) => t.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, "");

export interface Achado {
  pergunta: Pergunta;
  caminho: string;
  oQue: string;
}

export interface Medicao {
  achados: Achado[];
  /** Os nomes que o build da ponte embute no `.wasm`, de qualquer ponte carregada, sem repetição. */
  embutidas: string[];
  /** Por ponte carregada: o que o `build.rs` põe com `cargo:rustc-env=` (`null`: não há `build.rs`). */
  postasPeloBuildRs: Record<string, string[] | null>;
  /** O `build.rs` que lê ambiente da máquina. */
  buildLeAMaquina: string[];
  lidos: Record<Pergunta, number>;
}

export type Leitor = (caminho: string) => string | null;

/** As três perguntas, sobre a lista do que o `git` carrega e um leitor. */
export function medirOsArquivos(arquivos: readonly string[], ler: Leitor): Medicao {
  const achados: Achado[] = [];
  const lidos: Record<Pergunta, number> = { empacotador: 0, pagina: 0, wasm: 0 };
  const fora = (c: string) => /(^|\/)(node_modules|target)\//.test(c);

  for (const c of arquivos) {
    if (fora(c)) continue;
    if (/(^|\/)package\.json$/.test(c)) {
      const texto = ler(c);
      if (texto === null) continue;
      lidos.empacotador++;
      let pacote: Record<string, unknown>;
      try {
        pacote = JSON.parse(texto) as Record<string, unknown>;
      } catch {
        achados.push({ pergunta: "empacotador", caminho: c, oQue: "package.json que não se lê como JSON — não sei dizer que não há empacotador" });
        continue;
      }
      for (const campo of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
        for (const nome of Object.keys((pacote[campo] as Record<string, string> | undefined) ?? {}))
          if (DEPENDENCIA_DE_EMPACOTADOR.test(nome)) achados.push({ pergunta: "empacotador", caminho: c, oQue: `dependência de empacotador: ${nome}` });
      }
      for (const [nome, comando] of Object.entries((pacote["scripts"] as Record<string, string> | undefined) ?? {}))
        if (SCRIPT_DE_EMPACOTADOR.test(comando)) achados.push({ pergunta: "empacotador", caminho: c, oQue: `o script "${nome}" chama um empacotador` });
      continue;
    }
    if (CONFIG_DE_EMPACOTADOR.test(c)) {
      achados.push({ pergunta: "empacotador", caminho: c, oQue: "arquivo de configuração de empacotador" });
      continue;
    }
    if (CODIGO.test(c)) {
      const texto = ler(c);
      if (texto === null) continue;
      lidos.empacotador++;
      if (CHAMADA_DE_EMPACOTADOR.test(soOCodigo(texto))) achados.push({ pergunta: "empacotador", caminho: c, oQue: "chamada a empacotador no código" });
    }
  }

  for (const c of arquivos.filter((a) => a.startsWith(A_BANCADA) && DA_PAGINA.test(a))) {
    const texto = ler(c);
    if (texto === null) continue;
    lidos.pagina++;
    // No `.js` a leitura de ambiente se procura no código (o comentário que FALA dela não é ela); o nome público, no
    // texto inteiro — dentro de string ele é exatamente o que o empacotador troca.
    const codigo = /\.html?$/i.test(c) ? texto : soOCodigo(texto);
    if (LEITURA_DE_AMBIENTE.test(codigo)) achados.push({ pergunta: "pagina", caminho: c, oQue: "lê o ambiente — é o que um empacotador troca pelo valor" });
    const publico = NOME_PUBLICO.exec(texto);
    if (publico) achados.push({ pergunta: "pagina", caminho: c, oQue: `nome com prefixo público: ${publico[1]}_…` });
  }

  const embutidas = new Set<string>();
  const postasPeloBuildRs: Record<string, string[] | null> = {};
  const buildLeAMaquina: string[] = [];
  for (const ponte of PONTES.filter((p) => p.papel === "carregada")) {
    const buildRs = `${ponte.pasta}/build.rs`;
    for (const c of arquivos.filter((a) => a.startsWith(`${ponte.pasta}/`) && a.endsWith(".rs") && !fora(a))) {
      const texto = ler(c);
      if (texto === null) continue;
      lidos.wasm++;
      const codigo = semComentarioDeRust(texto);
      if (c === buildRs) {
        postasPeloBuildRs[ponte.pasta] = [...codigo.matchAll(/cargo:rustc-env=([A-Z0-9_]+)=/g)].map((m) => m[1]!);
        if (LE_A_MAQUINA.test(codigo)) buildLeAMaquina.push(c);
        continue;
      }
      for (const m of codigo.matchAll(EMBUTE)) {
        embutidas.add(m[2]!);
        achados.push({ pergunta: "wasm", caminho: c, oQue: `embute ${m[2]} no .wasm` });
      }
    }
    if (!(ponte.pasta in postasPeloBuildRs)) postasPeloBuildRs[ponte.pasta] = null;
  }
  return { achados, embutidas: [...embutidas].sort(), postasPeloBuildRs, buildLeAMaquina, lidos };
}

export function medir(raiz: string): Medicao {
  return medirOsArquivos(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** Quantos achados cada pergunta tem — o que a tabela da página escreve. */
export const achadosPorPergunta = (m: Medicao): Record<Pergunta, number> => ({
  empacotador: m.achados.filter((a) => a.pergunta === "empacotador").length,
  pagina: m.achados.filter((a) => a.pergunta === "pagina").length,
  wasm: m.embutidas.length,
});

/** A linha da página, ou `null`. */
export function aLinha(pagina: string): string | null {
  return pagina.split("\n").find((l) => l.startsWith(A_LINHA)) ?? null;
}

/** A tabela da seção: `| \`<pergunta>\` | … | N … |` → achados. */
export function aTabela(pagina: string): Map<string, number> | null {
  const linhas = pagina.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(A_SECAO));
  if (i < 0) return null;
  const t = new Map<string, number>();
  for (let j = i + 1; j < linhas.length && !/^##\s/.test(linhas[j]!); j++) {
    const m = /^\|\s*`([a-z-]+)`\s*\|[^|]*\|\s*\**(\d+)\**/.exec(linhas[j]!);
    if (m) t.set(m[1]!, Number(m[2]));
  }
  return t;
}

export type TipoDeProblema =
  | "empacotador"
  | "pagina-le-o-ambiente"
  | "embutida-nao-declarada"
  | "embutida-sem-build-rs"
  | "declarada-que-sumiu"
  | "build-le-a-maquina"
  | "busca-sem-o-prefixo"
  | "linha-ausente"
  | "linha-sem-build"
  | "linha-nao-nomeia"
  | "linha-numero-errado"
  | "tabela-ausente"
  | "tabela-sem-pergunta"
  | "tabela-com-outra"
  | "tabela-numero-errado"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A conferência da árvore e da página contra a medição. `nomesDaBusca` é a lista da busca da linha de cima. */
export function conferir(pagina: string | null, m: Medicao, nomesDaBusca: readonly string[] = NOMES): Problema[] {
  const problemas: Problema[] = [];
  for (const p of AS_PERGUNTAS)
    if (m.lidos[p] === 0) problemas.push({ tipo: "universo-vazio", detalhe: `a pergunta ${p} não leu arquivo nenhum — verde sobre zero não é verde` });

  for (const a of m.achados) {
    if (a.pergunta === "empacotador") problemas.push({ tipo: "empacotador", detalhe: `${a.caminho}: ${a.oQue}` });
    if (a.pergunta === "pagina") problemas.push({ tipo: "pagina-le-o-ambiente", detalhe: `${a.caminho}: ${a.oQue}` });
  }
  const declaradas = new Map(EMBUTIDAS.map((e) => [e.nome, e]));
  for (const nome of m.embutidas) {
    const d = declaradas.get(nome);
    if (!d) {
      problemas.push({ tipo: "embutida-nao-declarada", detalhe: `o .wasm embute ${nome}, que não está em EMBUTIDAS — o navegador baixa o valor dela` });
      continue;
    }
    const postas = m.postasPeloBuildRs[d.ponte];
    if (!postas || !postas.includes(nome))
      problemas.push({ tipo: "embutida-sem-build-rs", detalhe: `${nome} não é posta pelo build.rs de ${d.ponte} — viria do ambiente da máquina que compila` });
  }
  for (const e of EMBUTIDAS)
    if (!m.embutidas.includes(e.nome)) problemas.push({ tipo: "declarada-que-sumiu", detalhe: `EMBUTIDAS declara ${e.nome}, e nenhum .rs da ponte a embute mais` });
  for (const c of m.buildLeAMaquina) problemas.push({ tipo: "build-le-a-maquina", detalhe: `${c} lê o ambiente da máquina, e o que ele põe vai para dentro do .wasm` });

  const prefixo = "VI" + "TE_";
  if (!nomesDaBusca.some((n) => n.startsWith(prefixo)))
    problemas.push({ tipo: "busca-sem-o-prefixo", detalhe: `a busca de ${A_BUSCA.trava} deixou de procurar ${prefixo}, e a linha diz que ela o cobre` });

  const linha = pagina === null ? null : aLinha(pagina);
  if (linha === null) {
    problemas.push({ tipo: "linha-ausente", detalhe: `o ${A_PAGINA} não tem a linha que começa por "${A_LINHA}"` });
  } else {
    if (linha.includes(A_FRASE_DE_ANTES))
      problemas.push({ tipo: "linha-sem-build", detalhe: `a linha diz "${A_FRASE_DE_ANTES}", e o .wasm da ponte é um build que o navegador baixa` });
    for (const n of [O_PONTEIRO, `LAB-${ESTA_RODADA}`, A_BUSCA.trava, `LAB-${A_BUSCA.desde}`])
      if (!new RegExp(`${escapar(n)}(?![0-9])`).test(linha)) problemas.push({ tipo: "linha-nao-nomeia", detalhe: `a linha não nomeia ${n}` });
    const n = m.embutidas.length;
    const escrito = /\*\*(\d+)\*\* variáve(?:l|is) de compilação/.exec(linha);
    if (!escrito || Number(escrito[1]) !== n)
      problemas.push({ tipo: "linha-numero-errado", detalhe: `a linha tem de escrever "**${n}** variável de compilação"; escreve ${escrito ? `"**${escrito[1]}**"` : "outra coisa"}` });
    for (const nome of m.embutidas)
      if (!linha.includes(`\`${nome}\``)) problemas.push({ tipo: "linha-numero-errado", detalhe: `a linha não dá o nome embutido \`${nome}\`` });
  }

  const tabela = pagina === null ? null : aTabela(pagina);
  if (tabela === null) {
    problemas.push({ tipo: "tabela-ausente", detalhe: `o ${A_PAGINA} não tem a seção "${A_SECAO}"` });
  } else {
    const medidos = achadosPorPergunta(m);
    for (const p of AS_PERGUNTAS) {
      const escrito = tabela.get(p);
      if (escrito === undefined) problemas.push({ tipo: "tabela-sem-pergunta", detalhe: `a tabela não tem a linha de \`${p}\`` });
      else if (escrito !== medidos[p])
        problemas.push({ tipo: "tabela-numero-errado", detalhe: `\`${p}\`: a tabela escreve ${escrito}, a árvore dá ${medidos[p]}` });
    }
    for (const c of tabela.keys())
      if (!(AS_PERGUNTAS as readonly string[]).includes(c)) problemas.push({ tipo: "tabela-com-outra", detalhe: `a tabela tem a linha de \`${c}\`, que não é uma das três perguntas` });
  }
  return problemas;
}

/** A árvore de verdade. */
export function conferirAArvore(raiz: string): { medicao: Medicao; problemas: Problema[] } {
  const medicao = medir(raiz);
  let pagina: string | null;
  try {
    pagina = readFileSync(join(raiz, A_PAGINA), "utf8");
  } catch {
    pagina = null;
  }
  return { medicao, problemas: conferir(pagina, medicao) };
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "empacotador que a lista não conhece pelo nome: a dependência nova continua sendo PORTA nova para a `nada-pago.ts` (LAB-148), mas não esta trava",
  "o servidor da bancada transformar o arquivo antes de devolver: a régua lê a pasta da bancada, não o `Bun.serve` — que hoje devolve o `readFileSync` como está (`a-unica-interface.ts`, LAB-153, é quem pergunta quem sobe servidor)",
  "a variável que entra no `.wasm` por macro de outra crate, ou por `include_str!` de arquivo gerado: a régua lê `env!` e `option_env!` nos `.rs` da ponte, e o `cargo:rustc-env=` do `build.rs` dela",
  "o binário compilado: nenhuma máquina de sessão o tem hoje (o alvo do `rustup` não instala); o que se pergunta é o fonte que o produz",
  "a sonda `wasm-probe/`: ninguém a carrega (`o-wasm-nao-pede-nada.ts`), e por isso fica fora",
  "os clones vizinhos: o `VITE_` do Generate e do Geo é deles",
];
