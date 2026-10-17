/**
 * *"NÃO HÁ NADA PAGO NESTE REPOSITÓRIO HOJE"* — A FRASE PERGUNTA À ÁRVORE. (LAB-148, item 900, a dívida própria,
 * D376)
 *
 * # A frase, e o que a guardava
 *
 * O `CLAUDE.md` §4-A afirma um ESTADO: *"E **não há nada pago neste repositório hoje**, então a guarda só alcança
 * texto: contratar acontece fora da árvore."* A única trava que a lia (`custo-por-uso.test.ts`, item 005) confere que
 * a frase **está escrita** — `toContain("não há nada pago neste repositório hoje")`. Se amanhã entrar um cliente de
 * API paga, a frase continua escrita e a trava continua verde. É a quinta espécie da dívida própria: **mensagem fixa
 * que afirma estado sem perguntar**.
 *
 * # O que se mediu (17/10/2026), por LUGAR
 *
 * Uma coisa paga só funciona se entrar por uma PORTA da árvore. São cinco, lidas uma a uma:
 *
 * 1. **dependência** — `package.json` (as quatro listas) e `Cargo.toml` (as três seções), `upstream/` incluído, porque
 *    o que ele pede entra no `.wasm`: um SDK de serviço pago é o primeiro sinal de que alguém vai chamá-lo;
 * 2. **variável de ambiente** — a leitura com nome (`process.env.X`, `Bun.env.X`, `import.meta.env.X`, `env!("X")`,
 *    `env::var("X")`) no código: é por ela que a chave de um serviço pago entra;
 * 3. **endereço** — o host de todo `http(s)://` no código, fora de comentário: é para ele que a chamada sai;
 * 4. **segredo da rotina** — `secrets.X` em `.github/workflows/`;
 * 5. **ação e máquina da rotina** — `uses:` e `runs-on:`: máquina maior que a padrão é cobrada mesmo em repositório
 *    público.
 *
 * Deram **33 portas** (17 dependências, 4 variáveis, 7 endereços, 1 segredo, 4 ações e máquina), nenhuma paga — a frase era verdade, e agora é medida. O relatório (`docs/relatorios/LAB-148.md`)
 * tem a tabela.
 *
 * # A régua
 *
 * Cada porta achada tem de estar em {@link PORTAS_DECLARADAS} com a classe e o motivo; a declarada que não se acha
 * mais **sobra** (a lista desce com a árvore); e a frase da §4-A só pode estar escrita enquanto **nenhuma** porta for
 * `pago` — e tem de estar enquanto nenhuma for, porque é ela que diz ao leitor que a guarda só alcança texto.
 *
 * # O que ela NÃO alcança, dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */
import { semComentarios } from "./varredura-de-chamadas.ts";

/** A frase do `CLAUDE.md` §4-A que esta trava faz perguntar. */
export const A_FRASE = "não há nada pago neste repositório hoje";

/** As cinco portas por onde uma coisa paga entra na árvore. */
export const PORTAS = ["dependencia", "variavel-de-ambiente", "endereco", "segredo-da-rotina", "acao-da-rotina"] as const;
export type Porta = (typeof PORTAS)[number];

export type ClasseDaPorta =
  /** pacote aberto de registro público, ou serviço sem cobrança para este uso */
  | "gratuito"
  /** a própria máquina: endereço local, pasta temporária, carimbo de compilação */
  | "local"
  /** texto plantado num teste ou nome de espaço XML: nunca é contatado */
  | "nao-e-chamada"
  /** fonte paga — e a frase da §4-A deixa de poder estar escrita */
  | "pago";

export interface PortaDeclarada {
  classe: ClasseDaPorta;
  motivo: string;
}

/** Uma porta achada na árvore. */
export interface PortaAchada {
  porta: Porta;
  nome: string;
  /** onde foi achada, `arquivo:linha` (a primeira vez) */
  onde: string;
}

const NPM = "pacote aberto do registro npm, baixado sem conta; ferramenta de desenvolvimento, não chama serviço";
const CRATE = "pacote aberto do crates.io, baixado sem conta; entra no binário e não chama serviço";

/**
 * A lista fechada, medida em 17/10/2026. Chave: `porta:nome`.
 */
export const PORTAS_DECLARADAS: Readonly<Record<string, PortaDeclarada>> = {
  "dependencia:@eslint/js": { classe: "gratuito", motivo: NPM },
  "dependencia:@types/bun": { classe: "gratuito", motivo: NPM },
  "dependencia:eslint": { classe: "gratuito", motivo: NPM },
  "dependencia:playwright": {
    classe: "gratuito",
    motivo: "pacote aberto do registro npm; dirige um Chromium LOCAL para a prova da bancada, sem nuvem de navegador",
  },
  "dependencia:typescript": { classe: "gratuito", motivo: NPM },
  "dependencia:typescript-eslint": { classe: "gratuito", motivo: NPM },
  "dependencia:zod": { classe: "gratuito", motivo: NPM },
  "dependencia:straight-skeleton": {
    classe: "gratuito",
    motivo: "dependência por caminho local de uma sonda (`../tmp/straight-skeleton`), código aberto, sem serviço",
  },
  "dependencia:symbios-tensor": { classe: "gratuito", motivo: "o próprio `upstream/` do Symbios, por caminho; código aberto" },
  "dependencia:symbios-ground": { classe: "gratuito", motivo: CRATE },
  "dependencia:glam": { classe: "gratuito", motivo: CRATE },
  "dependencia:serde": { classe: "gratuito", motivo: CRATE },
  "dependencia:serde_json": { classe: "gratuito", motivo: CRATE },
  "dependencia:getrandom": { classe: "gratuito", motivo: CRATE },
  "dependencia:rand": { classe: "gratuito", motivo: CRATE },
  "dependencia:rand_pcg": { classe: "gratuito", motivo: CRATE },
  "dependencia:criterion": { classe: "gratuito", motivo: `${CRATE}; só nos bancos de medida do upstream` },
  "variavel-de-ambiente:TMPDIR": { classe: "local", motivo: "a pasta temporária da máquina, lida pela ferramenta do LAB-84" },
  "variavel-de-ambiente:PLAYWRIGHT_BROWSERS_PATH": {
    classe: "local",
    motivo: "onde está o Chromium desta máquina, para a prova automática da bancada; não é chave",
  },
  "variavel-de-ambiente:SYMBIOS_VERSAO": {
    classe: "local",
    motivo: "carimbo da versão do motor, posto na compilação do `.wasm` (`env!`); não é chave",
  },
  "variavel-de-ambiente:SENHA_DO_BANCO": {
    classe: "nao-e-chamada",
    motivo: "texto plantado em `tests/segredos.test.ts` como o jeito CERTO de escrever uma senha; nada o lê",
  },
  "endereco:github.com": {
    classe: "gratuito",
    motivo: "a receita de `git clone` dos vizinhos (públicos) e exemplos de remoto em teste; git público não cobra",
  },
  "endereco:api.github.com": {
    classe: "gratuito",
    motivo: "a leitura das rotinas desta casa na origem (`a-rotina-no-github-na-origem.test.ts`); leitura pública, sem cobrança",
  },
  "endereco:localhost": { classe: "local", motivo: "a sonda do CGAL em `.wasm` finge um `location` local; nada sai da máquina" },
  "endereco:127.0.0.1": {
    classe: "local",
    motivo: "o servidor local da prova da bancada, e um remoto de teste que nunca se contata",
  },
  "endereco:x": { classe: "nao-e-chamada", motivo: "texto plantado em `configuracao-do-motor.test.ts` para a limpeza de comentário" },
  "endereco:x.y": { classe: "nao-e-chamada", motivo: "texto plantado em `caminhos-da-pagina.test.ts`: um link externo de exemplo" },
  "endereco:www.w3.org": {
    classe: "nao-e-chamada",
    motivo: "o nome de espaço do SVG num exemplo do `upstream/` do Symbios; é identificador, nunca é baixado",
  },
  "segredo-da-rotina:VIZINHOS_TOKEN": {
    classe: "gratuito",
    motivo: "token do GitHub para ler os vizinhos no verde completo; ler repositório não cobra (e o segredo ainda não existe)",
  },
  "acao-da-rotina:actions/checkout": { classe: "gratuito", motivo: "ação aberta do GitHub; roda na máquina da rotina" },
  "acao-da-rotina:oven-sh/setup-bun": { classe: "gratuito", motivo: "ação aberta que instala o Bun; roda na máquina da rotina" },
  "acao-da-rotina:actions/setup-node": { classe: "gratuito", motivo: "ação aberta do GitHub que instala o Node" },
  "acao-da-rotina:runs-on ubuntu-latest": {
    classe: "gratuito",
    motivo: "a máquina padrão; em repositório PÚBLICO o minuto dela não cobra (máquina maior cobraria)",
  },
};

/** Um arquivo lido: caminho relativo à raiz e texto. */
export interface Arquivo {
  caminho: string;
  texto: string;
}

const CODIGO = /\.(ts|tsx|js|mjs|cjs|rs|html)$/;
const SHELL = /\.(sh|bash)$/;

/** Fora do universo: o que não é desta casa nem roda nela. */
export function foraDoUniverso(caminho: string): boolean {
  return /(^|\/)node_modules\//.test(caminho) || /(^|\/)target\//.test(caminho);
}

function limpar(caminho: string, texto: string): string {
  // Rust: a limpeza de JS se perde no `'a` de tempo de vida e nas aspas de dentro da string bruta (`r##"…"##`) —
  // medido: ela apagava o endereço do exemplo SVG do upstream. Aqui sai só a linha que É comentário.
  if (/\.rs$/.test(caminho)) {
    return texto
      .split("\n")
      .map((l) => (/^\s*\/\//.test(l) ? "" : l))
      .join("\n");
  }
  if (SHELL.test(caminho) || /\.ya?ml$/.test(caminho)) {
    return texto
      .split("\n")
      .map((l) => (/^\s*#/.test(l) ? "" : l))
      .join("\n");
  }
  if (/\.html$/.test(caminho)) return texto.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
  return semComentarios(texto);
}

const LEITURA_DE_AMBIENTE: readonly RegExp[] = [
  /process\.env\.([A-Za-z_][A-Za-z0-9_]*)/g,
  /process\.env\[\s*["'`]([A-Za-z_][A-Za-z0-9_]*)["'`]\s*\]/g,
  /Bun\.env\.([A-Za-z_][A-Za-z0-9_]*)/g,
  /Bun\.env\[\s*["'`]([A-Za-z_][A-Za-z0-9_]*)["'`]\s*\]/g,
  /import\.meta\.env\.([A-Za-z_][A-Za-z0-9_]*)/g,
  /\b(?:option_)?env!\(\s*"([A-Za-z_][A-Za-z0-9_]*)"/g,
  /env::var(?:_os)?\(\s*"([A-Za-z_][A-Za-z0-9_]*)"/g,
];

const ENDERECO = /\bhttps?:\/\/([A-Za-z0-9.-]+)/g;

function linhaDe(texto: string, indice: number): number {
  return texto.slice(0, indice).split("\n").length;
}

/** As dependências de um `package.json`. */
function dependenciasNpm(texto: string): string[] {
  const j = JSON.parse(texto) as Record<string, unknown>;
  const nomes: string[] = [];
  for (const lista of ["dependencies", "devDependencies", "optionalDependencies", "peerDependencies"]) {
    const l = j[lista];
    if (l && typeof l === "object") nomes.push(...Object.keys(l));
  }
  return nomes;
}

/** As dependências de um `Cargo.toml`: as linhas `nome = …` das três seções de dependência. */
function dependenciasCargo(texto: string): string[] {
  const nomes: string[] = [];
  let dentro = false;
  for (const linha of texto.split("\n")) {
    // Toda linha que abre por `[` é cabeçalho — inclusive `[[bench]]`, que fecha a seção anterior.
    const secao = /^\s*\[\[?([^\]]+)\]\]?\s*$/.exec(linha);
    if (secao) {
      dentro = /(^|\.)(dev-|build-)?dependencies$/.test(secao[1]!.trim());
      continue;
    }
    if (!dentro) continue;
    const m = /^\s*([A-Za-z0-9_-]+)\s*=/.exec(linha);
    if (m) nomes.push(m[1]!);
  }
  return nomes;
}

/** Lê as portas de um conjunto de arquivos. Devolve também quantos arquivos cada porta leu. */
export function lerAsPortas(arquivos: readonly Arquivo[]): { achadas: PortaAchada[]; lidos: Record<Porta, number> } {
  const achadas = new Map<string, PortaAchada>();
  const lidos: Record<Porta, number> = {
    dependencia: 0,
    "variavel-de-ambiente": 0,
    endereco: 0,
    "segredo-da-rotina": 0,
    "acao-da-rotina": 0,
  };
  const anotar = (porta: Porta, nome: string, onde: string) => {
    const k = `${porta}:${nome}`;
    if (!achadas.has(k)) achadas.set(k, { porta, nome, onde });
  };
  for (const a of arquivos) {
    if (foraDoUniverso(a.caminho)) continue;
    if (/(^|\/)package\.json$/.test(a.caminho)) {
      lidos.dependencia++;
      for (const n of dependenciasNpm(a.texto)) anotar("dependencia", n, a.caminho);
      continue;
    }
    if (/(^|\/)Cargo\.toml$/.test(a.caminho)) {
      lidos.dependencia++;
      for (const n of dependenciasCargo(a.texto)) anotar("dependencia", n, a.caminho);
      continue;
    }
    if (/^\.github\/workflows\/[^/]+\.ya?ml$/.test(a.caminho)) {
      lidos["segredo-da-rotina"]++;
      lidos["acao-da-rotina"]++;
      const t = limpar(a.caminho, a.texto);
      for (const m of t.matchAll(/\bsecrets\.([A-Za-z_][A-Za-z0-9_]*)/g)) {
        anotar("segredo-da-rotina", m[1]!, `${a.caminho}:${linhaDe(t, m.index!)}`);
      }
      for (const m of t.matchAll(/^\s*-?\s*uses:\s*["']?([^@\s"']+)/gm)) {
        anotar("acao-da-rotina", m[1]!, `${a.caminho}:${linhaDe(t, m.index!)}`);
      }
      for (const m of t.matchAll(/^\s*runs-on:\s*["']?([^\s"'#]+)/gm)) {
        anotar("acao-da-rotina", `runs-on ${m[1]!}`, `${a.caminho}:${linhaDe(t, m.index!)}`);
      }
      continue;
    }
    if (!CODIGO.test(a.caminho) && !SHELL.test(a.caminho)) continue;
    lidos["variavel-de-ambiente"]++;
    lidos.endereco++;
    const t = limpar(a.caminho, a.texto);
    for (const re of LEITURA_DE_AMBIENTE) {
      for (const m of t.matchAll(re)) anotar("variavel-de-ambiente", m[1]!, `${a.caminho}:${linhaDe(t, m.index!)}`);
    }
    for (const m of t.matchAll(ENDERECO)) {
      anotar("endereco", m[1]!.replace(/\.$/, "").toLowerCase(), `${a.caminho}:${linhaDe(t, m.index!)}`);
    }
  }
  return { achadas: [...achadas.values()], lidos };
}

export type TipoDoProblema =
  /** uma porta achada que a lista não conhece: pode ser a primeira coisa paga */
  | "porta-nao-declarada"
  /** a lista conhece uma porta que a árvore não tem mais: desça a lista */
  | "declaracao-que-sobra"
  /** o motivo é curto demais para dizer por que não cobra */
  | "declaracao-sem-motivo"
  /** há porta paga e a §4-A ainda diz que não há nada pago */
  | "a-frase-mente"
  /** não há porta paga e a frase sumiu: a §4-A deixou de dizer que a guarda só alcança texto */
  | "a-frase-sumiu"
  /** uma porta não leu arquivo nenhum, ou a árvore inteira não deu porta nenhuma (D164) */
  | "universo-vazio";

export interface ProblemaDaPorta {
  tipo: TipoDoProblema;
  chave: string;
  oQue: string;
}

export interface ResultadoDasPortas {
  problemas: ProblemaDaPorta[];
  achadas: PortaAchada[];
  lidos: Record<Porta, number>;
  pagas: string[];
}

/** Confere a árvore contra a lista fechada, nos dois sentidos, e a frase contra a classe. */
export function conferirNadaPago(
  arquivos: readonly Arquivo[],
  claude: string,
  declaradas: Readonly<Record<string, PortaDeclarada>> = PORTAS_DECLARADAS,
): ResultadoDasPortas {
  const { achadas, lidos } = lerAsPortas(arquivos);
  const problemas: ProblemaDaPorta[] = [];
  const chaves = new Set(achadas.map((p) => `${p.porta}:${p.nome}`));
  for (const p of achadas) {
    const k = `${p.porta}:${p.nome}`;
    if (declaradas[k] === undefined) {
      problemas.push({
        tipo: "porta-nao-declarada",
        chave: k,
        oQue: `${p.onde}: porta nova — declare a classe e o motivo; se for paga, a §4-A deixa de poder dizer "${A_FRASE}" (D376)`,
      });
    }
  }
  for (const [k, d] of Object.entries(declaradas)) {
    if (!chaves.has(k)) {
      problemas.push({ tipo: "declaracao-que-sobra", chave: k, oQue: "a lista nomeia uma porta que a árvore não tem mais" });
    }
    if (d.motivo.trim().length < 40) {
      problemas.push({ tipo: "declaracao-sem-motivo", chave: k, oQue: "o motivo tem menos de 40 caracteres" });
    }
  }
  const pagas = Object.entries(declaradas)
    .filter(([k, d]) => d.classe === "pago" && chaves.has(k))
    .map(([k]) => k);
  const escrita = claude.toLowerCase().includes(A_FRASE);
  if (pagas.length > 0 && escrita) {
    problemas.push({
      tipo: "a-frase-mente",
      chave: pagas.join(", "),
      oQue: `há ${pagas.length} porta(s) paga(s) e o CLAUDE.md §4-A ainda diz "${A_FRASE}"`,
    });
  }
  if (pagas.length === 0 && !escrita) {
    problemas.push({
      tipo: "a-frase-sumiu",
      chave: "CLAUDE.md §4-A",
      oQue: `nenhuma porta paga, e a frase "${A_FRASE}" sumiu: é ela que diz que a guarda só alcança texto`,
    });
  }
  for (const porta of PORTAS) {
    if (lidos[porta] === 0) {
      problemas.push({ tipo: "universo-vazio", chave: porta, oQue: `a porta \`${porta}\` não leu arquivo nenhum` });
    }
  }
  if (achadas.length === 0) {
    problemas.push({ tipo: "universo-vazio", chave: "(todas)", oQue: "a árvore não deu porta nenhuma: régua que não leu nada" });
  }
  return { problemas, achadas, lidos, pagas };
}

/** O que esta trava não alcança, dito na saída dela. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "contratar fora da árvore: conta aberta, chave cadastrada, teste grátis iniciado num painel — não deixa rastro aqui, e por isso a §4-A diz que a guarda só alcança texto",
  "a variável lida sem nome literal (`process.env[k]`, o ambiente inteiro passado a um processo filho): a régua lê o nome escrito",
  "o endereço montado por pedaços (`\"https://\" + host`) ou vindo de arquivo de dado: a régua lê o `http(s)://` inteiro no código",
  "a dependência de uma dependência (o que está só nos `.lock`): um SDK pago entra pelo nome direto, e é esse que se declara",
  "se o motivo é verdade: a classe `gratuito` é declarada por quem a escreve; a trava cobra que ela exista e seja revista quando a porta nascer",
  "o comentário de bloco (`/* … */`) no Rust: lá sai só a linha que começa por `//`, porque a limpeza de JS se perde no `'a` e na string bruta; o endereço num bloco de comentário Rust apareceria como porta (falso positivo, que se declara)",
  "os clones vizinhos: o que o Generate, o Laboratório de Parcelamento e o Geo chamam é deles",
] as const;
