/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A VARREDURA DE SEGREDOS — o que ela procura, ONDE ela procura, e o que ela
 *  NÃO pega. (LAB-47)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * # Por que ela existe
 *
 * O Render plantou uma chave de IA **com formato real dentro do código** e todos
 * os testes passaram verdes — porque **nada procurava segredo na árvore**. A fase
 * (a) do LAB-47 mediu o mesmo aqui: cinco segredos de formato real num arquivo
 * `src/` versionado, e o comando único saiu **VERDE, 7 passos, 401 travas, exit
 * 0**, sem uma palavra. O `tsc` e o `eslint` **leram o arquivo** (conferido: ele
 * aparece no `--listFiles`, e o `eslint` nele sai 0) e aprovaram.
 *
 * # A lição que a Pesquisa trouxe, e ela está no desenho deste arquivo
 *
 * > **O que importa é o ESCOPO da varredura, não a existência dela.**
 *
 * A varredura da Pesquisa existia, e cobria **três formatos e uma pasta só**.
 * Uma varredura de escopo estreito é pior que nenhuma, porque **cala o alarme**:
 * é a forma exata do D110 (a suíte que ninguém rodava) e do D123 (a prova
 * manual). Então aqui o escopo é **dado publicado**, não promessa:
 *
 *   · **ONDE** — `arquivosQueOGitCarrega()`: tudo que o git versiona MAIS tudo
 *     que ele versionaria no próximo `commit -a` (rastreado + não-rastreado
 *     não-ignorado). **Nenhuma pasta é excluída, nem a deste arquivo**, e há
 *     trava exigindo que a varredura passe pelo próprio fonte dela e pelo
 *     próprio teste dela — auto-exclusão é como um escopo encolhe em silêncio;
 *   · **O QUÊ** — as {@link REGRAS}, cada uma com nome, o que casa, **o que não
 *     casa** e um exemplo falso montado em pedaços;
 *   · **o que SOBROU de fora** — sai contado e nomeado em `escopo.deFora`, com o
 *     motivo. Arquivo pulado em silêncio é escopo mentindo.
 *
 * # A segunda lição: o relatório não repete o segredo
 *
 * > **O relatório nunca repete mais de doze caracteres do segredo, senão a chave
 * > vaza no próprio registro.**
 *
 * {@link MAXIMO_DE_CARACTERES_NA_AMOSTRA} é 12, e **cada regra declara quantos
 * caracteres cabem na amostra dela**, porque os 12 não valem o mesmo para todas:
 * em `sk-ant-…` os doze primeiros são o **prefixo público do formato** e não
 * revelam nada; numa senha atribuída a um nome, os doze primeiros **são a senha**.
 * Então a regra de prefixo mostra 12 e a de senha mostra 4, e há trava impedindo
 * qualquer regra de declarar mais de 12.
 *
 * E a prova disto se prova sozinha: a varredura cobre `docs/provas/` e
 * `docs/relatorios/`, então **um relatório que repetisse o segredo seria reprovado
 * pela própria varredura que o relatório descreve**.
 *
 * # O que ela NÃO faz, dito em vez de suposto
 *
 *   · **não lê o histórico do git.** Ela mede a ÁRVORE DE HOJE. Segredo que
 *     entrou e saiu num commit antigo continua no histórico e esta varredura não
 *     o vê — para isso o remédio é rotação da chave, não varredura;
 *   · **não mede entropia.** Segredo sem formato reconhecível e sem nome que o
 *     declare passa. Cada regra escreve isso em `oQueNaoPega`;
 *   · **não substitui segredo do lado do servidor.** Medido na fase (a) do
 *     LAB-47: este repositório **não tem GitHub Advanced Security habilitada**
 *     (`run_secret_scanning` responde exatamente isso), então a rede do lado do
 *     GitHub também não estava lá. O que existe é o que está neste arquivo.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * **Doze.** O teto de caracteres do segredo que qualquer registro desta
 * varredura pode repetir — amostra, prova, relatório ou mensagem de erro.
 *
 * O número é do chat, e o motivo é de uma linha: *a chave vaza no próprio
 * registro*. Uma varredura que publica o casado inteiro transforma a prova dela
 * no vazamento que ela veio impedir.
 */
export const MAXIMO_DE_CARACTERES_NA_AMOSTRA = 12;

/**
 * Arquivo acima deste tamanho não é varrido — e sai declarado em `escopo.deFora`.
 *
 * **64 MB, e o número tem história.** A primeira versão pôs 2 MB, e a varredura
 * saiu dizendo *"310 de 316"*: cinco saídas de geometria de `geo-antonina` ficaram
 * de fora por tamanho. **Treze megabytes**, lidos em menos de um segundo — e
 * exatamente o tipo de arquivo onde ninguém olha. Era o escopo estreito da
 * Pesquisa nascendo aqui, por comodidade minha.
 *
 * Então este número é **parede contra arquivo absurdo**, não filtro de rotina: hoje
 * o ÚNICO arquivo fora do escopo é um `.png`, e ele sai nomeado.
 */
export const MAXIMO_DE_BYTES_POR_ARQUIVO = 64_000_000;

/** Uma regra da varredura: o que ela casa, o que ela não casa, e um exemplo falso. */
export type RegraDeSegredo = {
  /** O nome que sai no achado. */
  nome: string;
  /** O que este formato é, em uma linha. */
  oQue: string;
  /** O que esta regra deixa passar — o buraco dela, escrito. */
  oQueNaoPega: string;
  /** Quantos caracteres do casado cabem na amostra (nunca mais de 12). */
  caracteresNaAmostra: number;
  /** O padrão. Sempre `g`, nunca com estado compartilhado (ver {@link casar}). */
  fonte: string;
  /** Sinalizadores do padrão. */
  sinais: string;
  /**
   * Um exemplo FALSO do formato, **montado em pedaços**.
   *
   * Isto não é capricho: se o literal estivesse inteiro neste arquivo, a
   * varredura reprovaria o próprio fonte dela, e o remédio óbvio — excluir este
   * arquivo do escopo — é justamente o buraco que o §-escopo acima proíbe. É
   * também a lição do D155 pelo avesso: **código que FALA de um formato não é
   * uma ocorrência dele**, e a única maneira honesta de garantir isso é o texto
   * do fonte não conter a ocorrência.
   */
  exemploFalso: () => string;
};

const corpo = (n: number, alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") =>
  Array.from({ length: n }, (_, i) => alfabeto[(i * 17 + 5) % alfabeto.length]).join("");

/**
 * As regras, nomeadas. **Quatro famílias saíram pedidas** — chave de IA, token,
 * senha e credencial de banco — e cada uma tem mais de um formato, porque
 * *"chave de IA"* não é um formato só.
 */
export const REGRAS: readonly RegraDeSegredo[] = [
  {
    nome: "chave-de-ia-anthropic",
    oQue: "chave da API da Anthropic (prefixo público + corpo longo)",
    oQueNaoPega: "o prefixo sozinho, sem corpo — é o que um documento escreve ao falar do formato",
    caracteresNaAmostra: 12,
    fonte: String.raw`\bsk-ant-(?:api|admin)\d{2}-[A-Za-z0-9_-]{80,}`,
    sinais: "g",
    exemploFalso: () => "sk" + "-ant-" + "api03-" + corpo(93),
  },
  {
    nome: "chave-de-ia-openai",
    oQue: "chave da API da OpenAI, inclusive as de projeto (`sk-proj-`)",
    oQueNaoPega: "chave curta de ambiente de teste, abaixo de 32 caracteres de corpo",
    caracteresNaAmostra: 12,
    fonte: String.raw`\bsk-(?:proj|svcacct|admin)?-?[A-Za-z0-9_-]{32,}`,
    sinais: "g",
    exemploFalso: () => "sk" + "-proj-" + corpo(48),
  },
  {
    nome: "chave-de-ia-google",
    oQue: "chave de API do Google (Gemini, Maps e o resto da família)",
    oQueNaoPega: "credencial de conta de serviço em JSON, que não tem este prefixo",
    caracteresNaAmostra: 12,
    fonte: String.raw`\bAIza[0-9A-Za-z_-]{35}\b`,
    sinais: "g",
    exemploFalso: () => "AI" + "za" + corpo(35),
  },
  {
    nome: "token-do-github",
    oQue: "token do GitHub — pessoal, de app, de OAuth, de refresh ou `fine-grained`",
    oQueNaoPega: "o `GITHUB_TOKEN` do Actions, que não aparece como literal em arquivo nenhum",
    caracteresNaAmostra: 12,
    fonte: String.raw`\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{60,})`,
    sinais: "g",
    exemploFalso: () => "gh" + "p_" + corpo(36),
  },
  {
    nome: "token-do-slack",
    oQue: "token do Slack (bot, usuário, app, refresh ou legado)",
    oQueNaoPega: "o `signing secret` do Slack, que é hexadecimal sem prefixo",
    caracteresNaAmostra: 12,
    fonte: String.raw`\bxox[baprse]-[0-9A-Za-z-]{12,}`,
    sinais: "g",
    exemploFalso: () => "xo" + "xb-" + corpo(24),
  },
  {
    nome: "chave-de-acesso-da-aws",
    oQue: "identificador de chave de acesso da AWS (`AKIA`) ou de sessão (`ASIA`)",
    oQueNaoPega: "a `secret access key` que vem ao lado dela — essa cai na regra do nome que se declara",
    caracteresNaAmostra: 12,
    fonte: String.raw`\b(?:AKIA|ASIA)[A-Z0-9]{16}\b`,
    sinais: "g",
    exemploFalso: () => "AK" + "IA" + "Q7XJ2MLV4TZBN6RY",
  },
  {
    nome: "token-da-stripe",
    oQue: "chave secreta ou restrita da Stripe em modo de produção",
    oQueNaoPega: "as chaves de teste (`sk_test_`), que não são segredo de produção",
    caracteresNaAmostra: 12,
    fonte: String.raw`\b(?:sk|rk)_live_[A-Za-z0-9]{20,}`,
    sinais: "g",
    exemploFalso: () => "sk" + "_live_" + corpo(24),
  },
  {
    nome: "token-do-npm",
    oQue: "token de publicação do npm, o que vaza por `.npmrc` esquecido",
    oQueNaoPega: "token de registro privado com outro formato",
    caracteresNaAmostra: 12,
    fonte: String.raw`\bnpm_[A-Za-z0-9]{36}\b`,
    sinais: "g",
    exemploFalso: () => "np" + "m_" + corpo(36),
  },
  {
    nome: "segredo-de-cliente-do-google",
    oQue: "`client secret` de OAuth do Google",
    oQueNaoPega: "o `client id`, que é público por desenho",
    caracteresNaAmostra: 12,
    fonte: String.raw`\bGOCSPX-[A-Za-z0-9_-]{20,}`,
    sinais: "g",
    exemploFalso: () => "GO" + "CSPX-" + corpo(28),
  },
  {
    nome: "chave-privada-em-pem",
    oQue: "chave privada no formato PEM — RSA, EC, OpenSSH ou PKCS#8",
    oQueNaoPega: "chave privada em formato binário (DER), que não tem cabeçalho de texto",
    caracteresNaAmostra: 12,
    fonte: String.raw`-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----`,
    sinais: "g",
    exemploFalso: () => "-----BE" + "GIN RSA PRI" + "VATE KEY-----\n" + corpo(60),
  },
  {
    nome: "jwt-assinado",
    oQue: "JSON Web Token com as três partes — é portador de sessão, e vale como credencial",
    oQueNaoPega: "token opaco de sessão, que não tem as três partes separadas por ponto",
    caracteresNaAmostra: 12,
    fonte: String.raw`\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}`,
    sinais: "g",
    exemploFalso: () => "ey" + "J" + corpo(20) + ".ey" + "J" + corpo(20) + "." + corpo(20),
  },
  {
    nome: "credencial-de-banco-em-url",
    oQue: "usuário e senha dentro de uma URL de conexão (Postgres, MySQL, Mongo, Redis, AMQP)",
    oQueNaoPega: "URL que recebe a senha por variável — `${...}`, `%s` ou `process.env`, que é o jeito certo",
    caracteresNaAmostra: 4,
    fonte: String.raw`\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis|rediss|amqps?|clickhouse|mssql):\/\/[^\s:@/]+:[^\s:@/]{6,}@`,
    sinais: "gi",
    exemploFalso: () => "postgre" + "sql://" + "archilly:" + "Tr0v4d0r-F4ls4" + "@db.exemplo.interno:5432/lab",
  },
  {
    nome: "segredo-atribuido-a-um-nome-que-o-declara",
    oQue: "valor literal atribuído a um nome que diz ser segredo — senha, token, chave de API, `client secret`",
    oQueNaoPega:
      "segredo guardado num nome que não o declara (`const x = \"…\"`), e valor sem formato: esta regra lê o NOME, não a entropia",
    caracteresNaAmostra: 4,
    fonte: String.raw`\b(?:senha|password|passwd|pwd|secret|segredo|token|api[_-]?key|apikey|access[_-]?key|secret[_-]?key|client[_-]?secret|private[_-]?key|credential)[A-Za-z_]*["']?\s*[:=]>?\s*["'\x60]([^"'\x60\n]{8,})["'\x60]`,
    sinais: "gi",
    exemploFalso: () => "senhaDoBanco" + ': "' + "F4ls4-S3nh4-D0-L4B-2026" + '"',
  },
] as const;

/**
 * Valores que a regra do **nome que se declara** não acusa, com o motivo.
 *
 * Não é lista de arquivos perdoados — é o reconhecimento de que `token: "${…}"`
 * e `senha: "process.env.SENHA"` são **o jeito certo** de escrever a coisa, e
 * acusá-los faria a varredura gritar exatamente onde o código está correto.
 * Varredura que grita no lugar certo é varredura que ninguém lê.
 */
export const VALORES_QUE_NAO_SAO_SEGREDO: readonly { padrao: RegExp; porque: string }[] = [
  { padrao: /^\$\{/, porque: "interpolação: o valor vem de fora, de variável ou de segredo do CI" },
  { padrao: /^\$[A-Z_]+$/, porque: "variável de ambiente do shell" },
  { padrao: /^%[sdv]/, porque: "marcador de formatação — o valor entra depois" },
  { padrao: /process\.env\.|import\.meta\.env\.|os\.environ|secrets\./, porque: "leitura de variável de ambiente ou de segredo do CI" },
  { padrao: /^<.*>$/, porque: "espaço reservado em documentação" },
  { padrao: /^[*x.•]{3,}$/i, porque: "o valor já está mascarado — alguém passou por aqui antes e o cobriu" },
  { padrao: /exemplo|example|placeholder|seu[_-]|sua[_-]|troque|fals[ao]|fake|dummy|redacted|changeme|xxx/i, porque: "o próprio valor se declara exemplo" },
  { padrao: /^[A-Z][A-Za-z0-9_]*$|^[a-z][a-zA-Z0-9]*$/, porque: "identificador de código, não valor — um nome de constante ou de campo" },
];

/** Um achado. **Nunca** carrega mais de {@link MAXIMO_DE_CARACTERES_NA_AMOSTRA} caracteres do casado. */
export type AchadoDeSegredo = {
  regra: string;
  arquivo: string;
  linha: number;
  /** Os primeiros caracteres do casado, no teto que a regra declara. */
  amostra: string;
  /** O tamanho do casado, que informa sem revelar. */
  caracteresCasados: number;
};

/** O que ficou de fora da varredura, e por quê. Isto é parte do escopo, não rodapé. */
export type ForaDaVarredura = { arquivo: string; porque: string };

export type EscopoDaVarredura = {
  /** Quantos arquivos o git carrega — rastreados e não-rastreados não-ignorados. */
  arquivosQueOGitCarrega: number;
  /** Quantos foram efetivamente lidos e varridos. */
  arquivosVarridos: number;
  bytesVarridos: number;
  regras: number;
  deFora: ForaDaVarredura[];
};

export type ResultadoDaVarredura = { escopo: EscopoDaVarredura; achados: AchadoDeSegredo[] };

/**
 * Tudo que o git carrega hoje: o que está rastreado **e** o que entraria no
 * próximo `commit -a`. Segredo recém-escrito e ainda não rastreado é o caso
 * mais comum de todos, e um escopo que só olhasse o índice o perderia.
 *
 * **Sem git, isto FALHA** (D124): pular seria exatamente o alarme calado.
 */
export function arquivosQueOGitCarrega(raiz: string): string[] {
  const saida = execFileSync("git", ["-C", raiz, "ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return saida.split("\0").filter((s) => s.length > 0);
}

const ehExemploDeclarado = (valor: string) => VALORES_QUE_NAO_SAO_SEGREDO.some(({ padrao }) => padrao.test(valor));

/** A amostra: os primeiros caracteres do casado, no teto da regra. Nunca mais. */
export function amostraDe(casado: string, regra: RegraDeSegredo): string {
  const teto = Math.min(regra.caracteresNaAmostra, MAXIMO_DE_CARACTERES_NA_AMOSTRA);
  return casado.slice(0, teto).replace(/\n/g, "⏎");
}

/** Varre UM texto. Separado para o teste poder medir a régua sem montar árvore. */
export function varrerTexto(texto: string, arquivo: string): AchadoDeSegredo[] {
  const achados: AchadoDeSegredo[] = [];
  for (const regra of REGRAS) {
    // Um `RegExp` novo por chamada: `lastIndex` compartilhado entre varreduras é
    // a maneira clássica de uma régua pular ocorrência sem avisar.
    const padrao = new RegExp(regra.fonte, regra.sinais);
    for (const m of texto.matchAll(padrao)) {
      const casado = m[0];
      if (regra.nome === "segredo-atribuido-a-um-nome-que-o-declara" && ehExemploDeclarado(m[1] ?? "")) continue;
      achados.push({
        regra: regra.nome,
        arquivo,
        linha: texto.slice(0, m.index).split("\n").length,
        amostra: amostraDe(casado, regra),
        caracteresCasados: casado.length,
      });
    }
  }
  return achados;
}

/** Varre a árvore. `arquivos` existe para o teste apontar a régua a uma árvore de mentira. */
export function varrer(raiz: string, arquivos: string[] = arquivosQueOGitCarrega(raiz)): ResultadoDaVarredura {
  const achados: AchadoDeSegredo[] = [];
  const deFora: ForaDaVarredura[] = [];
  let bytes = 0;
  let varridos = 0;

  for (const rel of arquivos) {
    const caminho = join(raiz, rel);
    let bruto: Buffer;
    try {
      if (statSync(caminho).size > MAXIMO_DE_BYTES_POR_ARQUIVO) {
        deFora.push({ arquivo: rel, porque: `acima de ${MAXIMO_DE_BYTES_POR_ARQUIVO} bytes` });
        continue;
      }
      bruto = readFileSync(caminho);
    } catch {
      deFora.push({ arquivo: rel, porque: "não pôde ser lido (apagado ou ligação quebrada)" });
      continue;
    }
    if (bruto.includes(0)) {
      deFora.push({ arquivo: rel, porque: "binário (tem byte nulo)" });
      continue;
    }
    varridos += 1;
    bytes += bruto.length;
    achados.push(...varrerTexto(bruto.toString("utf8"), rel));
  }

  return {
    escopo: {
      arquivosQueOGitCarrega: arquivos.length,
      arquivosVarridos: varridos,
      bytesVarridos: bytes,
      regras: REGRAS.length,
      deFora,
    },
    achados,
  };
}
