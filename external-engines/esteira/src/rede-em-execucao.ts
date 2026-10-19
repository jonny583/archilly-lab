/**
 * O LAB NÃO FAZ CHAMADA DE REDE EM EXECUÇÃO — e a página que o afirma não perguntava a ninguém. (LAB-158, item 900, a
 * dívida própria, D386)
 *
 * # A frase, e quem a perguntava
 *
 * O `docs/SEGURANCA.md`, escrito no LF-FINAL (14/09/2026) e reconferido no LF-FINAL-2 (15/09), abre assim:
 *
 * > *"O Lab **não tem tela, não tem banco, não tem conta de usuário e não faz chamada de rede em execução.**"*
 *
 * e a linha da tabela *Execução* diz: *"Nada de rede em execução · ✅ · … Nenhum `fetch`, nenhum `http`"*.
 *
 * A primeira negação ganhou trava antes (a tela no LAB-153, `a-unica-interface.ts`). Este cabeçalho dizia que o banco e a
 * conta também tinham — *"pela ausência de `supabase/`, que o `verde.test.ts` confere contra o disco"* — e **não tinham**:
 * aquela régua lê só o `conferir.sh`. Medido e consertado no LAB-174 (D402): o banco é perguntado pela
 * `o-lab-nao-tem-banco.ts`; a conta da família é da Central, e quem pergunta se o Lab a importa é a
 * `a-adocao-da-central.ts` (LAB-167).
 * **A quarta não tinha nenhuma**: nenhum arquivo
 * de `esteira/` cita o `SEGURANCA.md`, e a conferência de 14/09 foi um `grep` feito uma vez. Espécie: *mensagem fixa que
 * afirma estado sem perguntar*.
 *
 * # O que se mediu, por LUGAR (17/10/2026)
 *
 * O universo é o código que o `git` carrega — `.ts`, `.mts`, `.cts`, `.js`, `.mjs`, `.cjs`, `.rs`, `.sh` e o gancho
 * `pre-push`, `upstream/` incluído (é o motor que vira `.wasm`), `node_modules/` fora. Rede entra no código por quatro
 * portas, e as quatro foram lidas:
 *
 * | forma | o que é | onde se lê |
 * |---|---|---|
 * | `chamada` | `fetch(`, `new XMLHttpRequest`/`WebSocket`/`EventSource`, `sendBeacon(`, `Bun.connect`/`Bun.listen`/`Bun.serve`, `createServer(` | o código, sem comentário e sem string |
 * | `modulo` | importar `http`, `https`, `http2`, `net`, `tls`, `dgram` ou `dns` (com ou sem `node:`); no Rust, `std::net`, `TcpStream`, `UdpSocket`, `TcpListener`, `reqwest`, `ureq`, `hyper` | a string do `from`/`require(`/`import(`, inteira; no Rust, o código |
 * | `processo` | um processo filho que sai para a rede: o argumento `"fetch"`, `"ls-remote"`, `"pull"`, `"push"`, `"clone"`, `"curl"` ou `"wget"`, string inteira, em posição de argumento | o código sem comentário, string por string |
 * | `shell` | a linha de `.sh`/`pre-push` com `curl`, `wget` ou `git … fetch/ls-remote/pull/push/clone` | a linha, sem comentário |
 *
 * Um `clone` cuja chamada leva `file://` copia de uma pasta, não da rede, e não conta.
 *
 * **370 arquivos lidos, 52 deles no caminho do motor; 7 achados, em 6 arquivos.** **Nenhum** no caminho do motor — os adaptadores (`adapter/src/` de cada motor), a porta, os
 * motores e o esqueleto da esteira, o código Rust do Lab (`archilly/` de cada motor) e o `upstream/` do Symbios. A frase
 * *"não faz chamada de rede em execução"* é **verdadeira** para a execução do motor. A linha da tabela, não: *"Nenhum
 * `fetch`, nenhum `http`"* é **falsa** como foi escrita — há três famílias de rede fora do motor, e a página calava as
 * três:
 *
 * - **o servidor local da bancada** (LAB-03): o `prova-automatica.ts` sobe um `Bun.serve` em `127.0.0.1`, e a página
 *   faz `fetch("./archilly_symbios_wasm.wasm")` nele. Rede de laço, sem sair da máquina;
 * - **a leitura da origem pública**, de quatro formas: o `git fetch` do carimbo dos vizinhos (LAB-68, LAB-83 — as
 *   ferramentas de medição o chamam), o `git ls-remote` dos ramos abertos (LAB-121), o `curl` à API do GitHub da rotina
 *   (LAB-122) e o `fetch` do clone de teste, que é `file://` mas passa o nome por variável. Ler, nunca escrever;
 * - e **o `fetch` da bancada já existia quando a linha foi escrita** (LAB-01, 10/09; a página é de 14/09): ela nasceu
 *   falsa fora do motor, e era a única da tabela *Execução* sem comando ao lado. As outras seis vieram de 04/10 a 16/10;
 * - nenhuma terceira família: nenhum `push` em código, nenhum `curl` em script, nenhuma biblioteca de rede no Rust.
 *
 * Duas falsas acusações da primeira régua, consertadas na régua e não na lista: o nome do gancho `pre-push` numa linha do
 * `conferir.sh` (o subcomando agora tem de vir logo depois do `git`), e a própria lista de argumentos de rede deste arquivo
 * (agora uma string só, partida por espaço).
 *
 * # O que este módulo faz
 *
 * {@link conferirARedeEmExecucao} recebe a lista do que o `git` carrega e um leitor de arquivo, e acusa:
 *
 * - `rede-no-caminho-do-motor` — qualquer achado sob o caminho do motor, **declarado ou não**: a frase da página é sobre
 *   ele, e exceção ali seria a frase mentindo com licença;
 * - `rede-nao-declarada` — achado fora do motor que a lista não declara, ou um a mais do que ela conta naquele arquivo;
 * - `declarada-que-sumiu` — declaração com mais achados do que a árvore tem (o outro sentido: lista que ninguém percorre
 *   envelhece calada);
 * - `universo-vazio` — o `git` não carrega código nenhum (D164).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { semComentarios, soOCodigo } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

/** A frase no `docs/SEGURANCA.md` — o teste confere que ela continua escrita. */
export const A_FRASE = "não faz chamada de rede em execução";
export const A_PAGINA = "docs/SEGURANCA.md";

export type Forma = "chamada" | "modulo" | "processo" | "shell";

/**
 * O caminho do motor: onde a frase da página vale sem exceção. Os adaptadores, a porta e os motores da esteira, o
 * esqueleto, o Rust do Lab e o motor copiado.
 */
export const CAMINHO_DO_MOTOR: readonly RegExp[] = [
  /^external-engines\/[^/]+\/adapter\/src\//,
  /^external-engines\/esteira\/src\/(porta|motores|esqueleto)\//,
  /^external-engines\/[^/]+\/archilly\//,
  /^external-engines\/[^/]+\/upstream\//,
];

export const noCaminhoDoMotor = (c: string): boolean => CAMINHO_DO_MOTOR.some((r) => r.test(c));

const JS = /\.(ts|mts|cts|js|mjs|cjs)$/i;
const RUST = /\.rs$/i;
const SHELL = /(\.sh$|(^|\/)pre-push$)/;

const CHAMADA =
  /\bfetch\s*\(|\bnew\s+(XMLHttpRequest|WebSocket|EventSource)\b|\bsendBeacon\s*\(|\bBun\s*\.\s*(connect|listen|serve)\s*\(|\bcreateServer\s*\(/g;
const MODULO_JS = /^(node:)?(http|https|http2|net|tls|dgram|dns)(\/.*)?$/;
const MODULO_RUST = /\bstd\s*::\s*net\b|\b(TcpStream|UdpSocket|TcpListener)\b|\b(reqwest|ureq|hyper)\s*::/g;
/** Escrita numa string só, separada por espaço, para que a própria lista não seja um argumento de rede. */
const ARGUMENTO_DE_REDE = new Set("fetch ls-remote pull push clone curl wget".split(" "));
/** O subcomando logo depois do `git` (e das opções `-C`/`-c`): `pre-push` como nome de arquivo não é `push`. */
const LINHA_DE_SHELL = /\b(curl|wget)\b|\bgit(\s+-[Cc]\s+\S+)*\s+(fetch|ls-remote|pull|push|clone)\b/;

/** Uma string do código, inteira, com o que vem antes dela na mesma linha e a linha inteira. */
interface Literal {
  conteudo: string;
  antes: string;
  linha: string;
}

/** As strings do código, uma por uma, sem entrar nos comentários. Template conta como uma string só. */
export function literais(texto: string): Literal[] {
  const t = semComentarios(texto);
  const fora: Literal[] = [];
  let i = 0;
  while (i < t.length) {
    const c = t[i]!;
    if (c === "'" || c === '"' || c === "`") {
      let j = i + 1;
      while (j < t.length && t[j] !== c) j += t[j] === "\\" ? 2 : 1;
      const ini = t.lastIndexOf("\n", i) + 1;
      const fim = t.indexOf("\n", j);
      fora.push({ conteudo: t.slice(i + 1, j), antes: t.slice(ini, i), linha: t.slice(ini, fim === -1 ? t.length : fim) });
      i = j + 1;
      continue;
    }
    i++;
  }
  return fora;
}

/** Os achados de rede de UM arquivo, por forma. */
export function redeNoArquivo(caminho: string, texto: string): Forma[] {
  const achados: Forma[] = [];
  if (SHELL.test(caminho)) {
    for (const linha of texto.split("\n")) {
      const semComentario = linha.replace(/(^|\s)#.*$/, "");
      if (LINHA_DE_SHELL.test(semComentario) && !semComentario.includes("file://")) achados.push("shell");
    }
    return achados;
  }
  if (RUST.test(caminho)) {
    const n = [...soOCodigo(texto).matchAll(MODULO_RUST)].length;
    for (let i = 0; i < n; i++) achados.push("modulo");
    return achados;
  }
  if (!JS.test(caminho)) return achados;
  const chamadas = [...soOCodigo(texto).matchAll(CHAMADA)].length;
  for (let i = 0; i < chamadas; i++) achados.push("chamada");
  for (const l of literais(texto)) {
    if (MODULO_JS.test(l.conteudo) && /(\bfrom|\brequire\s*\(|\bimport\s*\()\s*$/.test(l.antes)) achados.push("modulo");
    else if (ARGUMENTO_DE_REDE.has(l.conteudo) && /[(,[]\s*$/.test(l.antes) && !l.linha.includes("file://"))
      achados.push("processo");
  }
  return achados;
}

export type Classe = "servidor-local" | "origem-publica" | "origem-de-teste";

export interface Declarada {
  caminho: string;
  forma: Forma;
  quantas: number;
  classe: Classe;
  motivo: string;
}

/** As redes fora do motor, declaradas uma a uma, com quantas há em cada arquivo. */
export const DECLARADAS: readonly Declarada[] = [
  {
    caminho: "external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts",
    forma: "chamada",
    quantas: 2,
    classe: "servidor-local",
    motivo: "o `Bun.serve` em 127.0.0.1 que abre a bancada no Chromium, e o método `fetch(req)` dele (LAB-03)",
  },
  {
    caminho: "external-engines/symbios/adapter/ferramentas/navegador/prova.js",
    forma: "chamada",
    quantas: 1,
    classe: "servidor-local",
    motivo: "a bancada lê o `.wasm` do servidor local que a abriu — caminho relativo, a mesma máquina (LAB-03)",
  },
  {
    caminho: "external-engines/esteira/src/commit-dos-vizinhos.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-publica",
    motivo: "o `git fetch` do carimbo dos vizinhos, só de referências, nada puxado (LAB-68, D241); a trava passa `false`",
  },
  {
    caminho: "external-engines/esteira/tests/ramos-abertos-na-origem.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-publica",
    motivo: "o `git ls-remote --heads origin` que cruza os ramos da origem com a página (LAB-121, D349)",
  },
  {
    caminho: "external-engines/esteira/tests/a-rotina-no-github-na-origem.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-publica",
    motivo: "o `curl` à API pública do GitHub que pergunta o estado da rotina (LAB-122)",
  },
  {
    caminho: "external-engines/esteira/tests/clone-da-maquina.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo: "o `fetch` do clone raso montado a partir de uma origem `file://` que o teste cria numa pasta (LAB-116)",
  },
  {
    caminho: "external-engines/esteira/tests/fotografia-no-commit-declarado.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo:
      "o `git clone --no-checkout` do clone vizinho `../motor-testfit`, por CAMINHO no disco, numa pasta temporária, para pôr o motor no commit que a prova do LAB-60 declara — não sai da máquina, e o vizinho só é lido (LAB-196, D424)",
  },
  {
    caminho: "external-engines/esteira/tests/fotografia-do-lab48.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo:
      "o `git clone --no-checkout` do Lab, do motor e do Generate, por CAMINHO no disco, numa pasta temporária, para pôr as três árvores nos commits que tiraram a fotografia do LAB-48 — não sai da máquina, e os vizinhos só são lidos (LAB-197, D425)",
  },
  {
    caminho: "external-engines/esteira/tests/retrato-do-lab18.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo:
      "o `git clone --no-checkout` do Lab, do motor e do Generate, por CAMINHO no disco, numa pasta temporária, para rodar a ferramenta do LAB-18 de então nas pontas e nas bordas da janela do motor — não sai da máquina, e os vizinhos só são lidos (LAB-199, D427)",
  },
  {
    caminho: "external-engines/esteira/tests/retrato-do-lab78.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo:
      "o `git clone --no-checkout` do Lab, do motor e do Generate, por CAMINHO no disco, numa pasta temporária, para rodar a ferramenta do LAB-78 de então no começo, no instante e no fim medido da janela do Generate, na borda de antes e com o motor trocado — não sai da máquina, e os vizinhos só são lidos (LAB-200, D428)",
  },
  {
    caminho: "external-engines/esteira/tests/retrato-do-lab07-relevo.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo:
      "o `git clone --no-checkout` do Lab e do Generate, por CAMINHO no disco, numa pasta temporária, para rodar o diagnóstico de relevo do LAB-07 de então no começo, no instante e no fim medido da janela do Generate, na borda de antes e com a troca dos dentes na cópia — não sai da máquina, e o vizinho só é lido (LAB-201, D429)",
  },
  {
    caminho: "external-engines/esteira/tests/retrato-do-lab07-medir.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo:
      "o `git clone --no-checkout` do Lab, do motor e do Generate, por CAMINHO no disco, numa pasta temporária, para rodar o `medir.ts` do LAB-07 de então no instante, nos quatro cantos e nas quatro bordas das janelas do motor e do Generate, e com a troca dos dentes na cópia — não sai da máquina, e os vizinhos só são lidos (LAB-202, D430)",
  },
  {
    caminho: "external-engines/esteira/tests/retrato-do-lab30.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo:
      "o `git clone --no-checkout` do Lab, do motor e do Generate, por CAMINHO no disco, numa pasta temporária, para rodar a guarda da IDA do LAB-30 de então no instante, nos quatro cantos e nas duas bordas, com as funções dos dois vizinhos envenenadas na cópia e com a troca dos dentes na cópia do Lab — não sai da máquina, e os vizinhos só são lidos (LAB-203, D431)",
  },
  {
    caminho: "external-engines/esteira/tests/retrato-do-lab37.test.ts",
    forma: "processo",
    quantas: 1,
    classe: "origem-de-teste",
    motivo:
      "o `git clone --no-checkout` do Lab, do motor e do Generate, por CAMINHO no disco, numa pasta temporária, para rodar a testada de frente do LAB-37 de então nos quatro cantos, no instante e nas três bordas das janelas do motor e do Generate — não sai da máquina, e os vizinhos só são lidos (LAB-204, D432)",
  },
  {
    caminho: "external-engines/esteira/ferramentas/lab171.ts",
    forma: "processo",
    quantas: 3,
    classe: "origem-publica",
    motivo:
      "os dois `git fetch --depth 1` (o commit que a triagem fixa e o HEAD de hoje) e o `git ls-remote` do PackingSolver, numa pasta temporária, lidos e nunca executados; ferramenta à mão, fora do verde (LAB-171)",
  },
  {
    caminho: "external-engines/esteira/ferramentas/lab172.ts",
    forma: "processo",
    quantas: 5,
    classe: "origem-publica",
    motivo:
      "os três `git fetch --filter=blob:none --depth 1` (os dois commits que a análise do esqueleto reto fixa e a tag da CGAL que o script deles fixa) e, numa função só para as duas origens, o `git ls-remote` e o `fetch` do HEAD de hoje, em pastas temporárias, lidos e nunca executados; ferramenta à mão, fora do verde (LAB-172)",
  },
  {
    caminho: "external-engines/esteira/ferramentas/lab185.ts",
    forma: "processo",
    quantas: 4,
    classe: "origem-publica",
    motivo:
      "os dois `git fetch --filter=blob:none --depth 1` (o commit que a análise do Symbios fixa e o HEAD de hoje) e o `git ls-remote` do `symbios-tensor`, numa pasta temporária, lidos e nunca executados, e o `curl` à API de leitura do registro público das crates (uma função só, chamada para a versão e para a crate de cada dependência direta); ferramenta à mão, fora do verde (LAB-185)",
  },
];

export type TipoDeProblema = "rede-no-caminho-do-motor" | "rede-nao-declarada" | "declarada-que-sumiu" | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  caminho: string;
  forma?: Forma;
  detalhe: string;
}

export interface Resultado {
  /** Quantos arquivos de código foram lidos — o tamanho do universo. */
  lidos: number;
  /** Quantos deles estão no caminho do motor. */
  doMotor: number;
  achados: { caminho: string; forma: Forma; quantas: number }[];
  problemas: Problema[];
}

const ehCodigo = (c: string) => !/(^|\/)node_modules\//.test(c) && (JS.test(c) || RUST.test(c) || SHELL.test(c));

/** A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null` se não existe. */
export function conferirARedeEmExecucao(
  arquivos: readonly string[],
  ler: (caminho: string) => string | null,
  declaradas: readonly Declarada[] = DECLARADAS,
): Resultado {
  const problemas: Problema[] = [];
  const achados: Resultado["achados"] = [];
  let lidos = 0;
  let doMotor = 0;
  for (const c of [...arquivos].filter(ehCodigo).sort()) {
    const texto = ler(c);
    if (texto === null) continue;
    lidos++;
    if (noCaminhoDoMotor(c)) doMotor++;
    const contagem = new Map<Forma, number>();
    for (const f of redeNoArquivo(c, texto)) contagem.set(f, (contagem.get(f) ?? 0) + 1);
    for (const [forma, quantas] of contagem) achados.push({ caminho: c, forma, quantas });
  }
  if (lidos === 0) problemas.push({ tipo: "universo-vazio", caminho: "—", detalhe: "o git não carrega código nenhum" });

  for (const a of achados) {
    if (noCaminhoDoMotor(a.caminho)) {
      problemas.push({
        tipo: "rede-no-caminho-do-motor",
        caminho: a.caminho,
        forma: a.forma,
        detalhe: `${a.caminho} tem ${a.quantas} ${a.forma} de rede no caminho do motor, e o ${A_PAGINA} diz que o Lab ${A_FRASE}`,
      });
      continue;
    }
    const d = declaradas.find((x) => x.caminho === a.caminho && x.forma === a.forma);
    if (!d || a.quantas > d.quantas)
      problemas.push({
        tipo: "rede-nao-declarada",
        caminho: a.caminho,
        forma: a.forma,
        detalhe: `${a.caminho}: ${a.quantas} ${a.forma} de rede, ${d ? `e a lista declara ${d.quantas}` : "e a lista não declara nenhuma"}`,
      });
  }
  for (const d of declaradas) {
    const a = achados.find((x) => x.caminho === d.caminho && x.forma === d.forma);
    if (!a || a.quantas < d.quantas)
      problemas.push({
        tipo: "declarada-que-sumiu",
        caminho: d.caminho,
        forma: d.forma,
        detalhe: `a lista declara ${d.quantas} ${d.forma} em ${d.caminho}, e a árvore tem ${a?.quantas ?? 0}`,
      });
  }
  return { lidos, doMotor, achados, problemas };
}

/** A árvore de verdade: o `git ls-files` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirARedeEmExecucao(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "a máquina do GitHub: o `verde.yml` clona os vizinhos e instala dependências, e isso é a rotina, não a execução do Lab — o arquivo nem é código que o Lab roda",
  "a instalação: `bun install` baixa pacotes, e é feita por quem prepara a máquina, antes; a frase é sobre o que o Lab faz ao rodar",
  "o argumento de rede montado por variável ou dentro de `${}` de template (`git(cmd)` com `cmd = 'fetch'`): a régua lê a string inteira em posição de argumento",
  "biblioteca de rede que não está nas dependências desta casa (`axios`, `undici`, `got`): a porta `modulo` pergunta pelos módulos que o Node, o Bun e o Rust trazem e pelos três clientes Rust mais usados",
  "o motor do VIZINHO que esta casa importa pelos `paths` (Generate, Laboratório de Parcelamento): ele não é carregado pelo `git` daqui, e a frase é sobre este repositório",
  "se a rede declarada fora do motor é inofensiva: a lista diz a classe e o motivo, e quem a lê decide; a trava só garante que ela é completa e que nenhuma mora no motor",
];
