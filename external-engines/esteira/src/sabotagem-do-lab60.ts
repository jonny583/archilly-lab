/**
 * **LAB-224 (item 900) · as duas sabotagens do LAB-60 REFEITAS — o que o LAB-223 perguntou às do LAB-62, perguntado à
 * primeira dos registros de ATO que sobravam** (D452).
 *
 * # O que estava escrito
 *
 * A `LAB-60/sabotagem.json` registra um ato de 07/10/2026 (`ce19bfc`): duas sabotagens das travas da leitura da
 * configuração do motor, em prosa, com a ferramenta saindo bem (*"nos dois casos a ferramenta saiu com exit 0"*) e as
 * travas que caíram, pelo nome — **3 de 16** na 1 (depois de corrigir a ordem do texto sintético) e **2** na 2, uma delas
 * no LAB-57. A prova não escreve o comando nem a ordem; o LAB-217 (D445) leu o que o ato rodou (`lab60.ts`,
 * `configuracao-do-motor.test.ts`, `configuracao.test.ts`) e o LAB-223 deixou o candidato (`docs/relatorios/LAB-223.md`
 * §8: *"começando pela LAB-60"*). Ninguém tinha refeito o ato desde 07/10.
 *
 * # O que o ato respondeu (24/10/2026, numa pasta temporária, com o motor no commit que a prova leu, `4181e95`)
 *
 * | n | o que se trocou | a prova | o par da prova (Lab `ce19bfc`) | a ponta de hoje |
 * |---|---|---|---|---|
 * | 1 | a `semComentarios` volta às duas regex | `exit` 0, **3** de 16, os três nomes | `exit` 0, **3**: os da prova, e só eles | `exit` 0, **4**: os três da prova **e a do LAB-57** |
 * | 2 | a `regra-em-off` sai da lista | `exit` 0, **2**, os dois nomes | ferramenta e depois a suíte: `exit` 0, **2**, os da prova | **o mesmo** |
 * | 2, sem a ferramenta | a 2, com a suíte lendo a prova GRAVADA | — | **3**: os dois e *"as contagens por regra"* | **o mesmo** |
 *
 * **As duas mordem como a prova diz no commit dela.** Dois desvios, os dois medidos:
 *
 * - **a conta da 2 só fecha com a ferramenta rodada ANTES da suíte.** Sem rodá-la, a suíte lê a prova que já estava no
 *   disco (com a `regra-em-off` dentro) e cai uma terceira — a que confere as contagens contra a lista de regras. O
 *   LAB-223 achou o avesso (a ferramenta que para antes de escrever deixa a suíte medir a prova velha); aqui a ferramenta
 *   escreve sempre, e o *"2"* da prova é o do ato na ordem ferramenta → suíte. A prova não escreve a ordem; a conta a
 *   denuncia ({@link A_DOIS_SEM_A_FERRAMENTA});
 * - **hoje a 1 derruba uma a mais, e não pelo motivo dela.** A trava do LAB-57 (*"a prova existe, traz o ESCOPO como
 *   número"*) ganhou no LAB-86 (D287) a recontagem do escopo contra a árvore, e a sabotagem muda o tamanho da
 *   `varredura-de-chamadas.ts`: com a troca daqui (+6 linhas) a recontagem vê `linhasDeCodigoLidas` 110 137 na prova e
 *   110 143 na árvore; com a função inteira substituída (−26), 110 111 — as duas medidas, a mesma queda.
 *   **Ela morde pelo TAMANHO do arquivo sabotado, não pelo sentido da sabotagem** — qualquer troca que mude a contagem de
 *   linhas a derrubaria. A conta escrita (*"3 de 16"*) é a do arquivo do LAB-60 e continua certa; o ato inteiro, hoje,
 *   derruba quatro ({@link A_MAIS_HOJE}).
 *
 * A 1 da prova tem ainda *"a primeira versão da trava"* (*"1 trava de 16"*): essa versão nunca foi commitada (o LAB-60 é
 * um commit só) e não se refaz — fica fora, dito.
 *
 * Sem sabotagem, nos dois pares, a ferramenta sai bem e só reescreve a `configuracao-do-motor.json` (o carimbo de hora e o
 * `§4` dos clones presentes), e a suíte aprova a gravada e a reescrita.
 *
 * # O que este módulo faz
 *
 * É a parte pura: {@link AS_TROCAS}, {@link A_DOIS_SEM_A_FERRAMENTA}, {@link A_MAIS_HOJE}, {@link OS_PARES},
 * {@link oQueAProvaConta} e {@link aTrocaDaProva}. Quem cria a pasta, clona e roda é a trava,
 * `tests/sabotagem-do-lab60.test.ts`, no verde completo. `sabotar` e `falhasDoBun` são os do LAB-215.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **o texto exato de cada sabotagem**: a 1 é a `semComentarios` do commit anterior ao LAB-60 (`ce19bfc^`), palavra por
 *   palavra — a prova diz *"volta a ser as duas regex"*, e é isso; o varredor com estado fica no arquivo, renomeado e sem
 *   uso, para a troca ser uma só. A 2 é o bloco inteiro da regra. O que se confere é que mordem como a prova diz;
 * - **a ordem do ato**: reconstruída pela conta (só a ordem ferramenta → suíte dá o *"2"*), não lida;
 * - **o motor de hoje**: os dois pares leem o motor em `4181e95`, o commit que a prova grava — uma variável só. Com o
 *   motor de hoje a ferramenta lê outra configuração, e isso é a fotografia do LAB-196 (D424), não esta pergunta;
 * - **o vizinho**: o ato **lê** o motor por caminho (`../motor-testfit`; sem ele a ferramenta para com `exit` 1) e não
 *   roda código dele — o que o LAB-217 já escrevia (*"leitura, não execução"*). A trava mede as duas coisas;
 * - **a primeira versão da trava da 1**: nunca foi commitada.
 */

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-60/sabotagem.json";

/** Os commits do Lab em que o ato se refaz. `"HEAD"` quer dizer a ponta do clone, a de hoje. */
export const OS_PARES = {
  "o-da-prova": "ce19bfcde9db6fa7c8f95e6d2e4a76d1fbacf42a",
  "o-de-hoje": "HEAD",
} as const;
export type Par = keyof typeof OS_PARES;

/** O motor que a prova leu (`configuracao-do-motor.json` · `oClone.head`), nos dois pares. */
export const O_MOTOR_DA_PROVA = "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae";

/** A ferramenta e as suítes que o ato rodou (a linha do LAB-60 em `src/os-atos-e-o-vizinho.ts`). */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab60.ts";
export const AS_SUITES = [
  "external-engines/esteira/tests/configuracao-do-motor.test.ts",
  "external-engines/esteira/tests/configuracao.test.ts",
] as const;
/** O denominador que a prova escreve na 1 — os testes da `configuracao-do-motor.test.ts`. */
export const TESTES_DO_LAB60 = 16;

/** O que a ferramenta escreve quando chega ao fim. */
export const O_QUE_A_FERRAMENTA_ESCREVE = "docs/provas/LAB-60/configuracao-do-motor.json";

const LIMPEZA = "LAB-60 · a LIMPEZA, e o caso que a quebrou — a trava mais importante daqui > ";
const GLOB = `${LIMPEZA}o glob NÃO é confundido com comentário: as duas regras sobrevivem à limpeza`;
const ACHA = `${LIMPEZA}e a varredura ACHA as duas nesse texto — era zero antes do LAB-60`;
const STRING = `${LIMPEZA}a string PRESERVA o conteúdo — é o que separa esta limpeza da \`soOCodigo\``;
const CONTAGENS =
  "LAB-60 · o escopo sai como NÚMERO, e o que ficou fora é nomeado > as contagens por regra são as da lista de achados, não números à parte";
/** A trava do LAB-57 que a prova nomeia na 2. */
export const A_DO_LAB57 = "LAB-57 · as regras e o escopo > a prova existe, traz o ESCOPO como número e nada fica fora sem motivo";

/** Uma sabotagem: a troca de texto, e as travas que caem com a ferramenta rodada antes da suíte, pelo nome. */
export interface Troca {
  numero: number;
  /** O arquivo, relativo à raiz do Lab. */
  arquivo: string;
  /** A troca de texto, UMA vez no arquivo. */
  de: string;
  para: string;
  /** Os testes das duas suítes que caem no par da prova (ferramenta, depois suíte). */
  derruba: readonly string[];
}

/** A `semComentarios` do varredor com estado, como nasceu no LAB-60 — a primeira linha basta para a troca ser única. */
const O_VARREDOR = "export function semComentarios(texto: string): string {\n  const fora: string[] = [];\n";
/** A de antes do LAB-60 (`ce19bfc^`), palavra por palavra: as duas regex. */
const AS_DUAS_REGEX =
  "export function semComentarios(texto: string): string {\n" +
  '  let fora = texto.replace(/\\/\\*[\\s\\S]*?\\*\\//g, (m) => m.replace(/[^\\n]/g, " "));\n' +
  '  fora = fora.replace(/(^|[^:])\\/\\/[^\\n]*/g, (m, p1: string) => p1 + " ".repeat(m.length - p1.length));\n' +
  "  return fora;\n" +
  "}\n\n" +
  "function semComentariosDoVarredorSabotado(texto: string): string {\n  const fora: string[] = [];\n";

const A_REGRA_EM_OFF =
  "  {\n" +
  '    nome: "regra-em-off",\n' +
  '    forma: "desligada",\n' +
  "    oQue: 'regra de lint declarada com `\"off\"` — ela não roda, não avisa e não reprova; é a forma 1 do cabeçalho, e até o LAB-60 NENHUMA regra desta lista a procurava',\n" +
  "    oQueNaoPega:\n" +
  "      'regra que nasce desligada dentro de um conjunto `recommended`, e regra desligada por comentário `eslint-" +
  // o literal partido de propósito: a `conferencia-desligada-por-arquivo` lê o texto CRU, e aqui ele é CÓPIA da
  // string de uma regra (fala sobre, não faz) — medido: inteiro, o LAB-57 o acusava como desligador (LAB-224)
  "disable` — essa é da `conferencia-desligada-por-arquivo`',\n" +
  '    arquivos: ["eslint.config.js"],\n' +
  '    limpeza: "semComentarios",\n' +
  '    porqueEssaLimpeza: "a pergunta é o que a configuração DECLARA, e a declaração mora na string (D179)",\n' +
  '    padrao: String.raw`"([^"]+)"\\s*:\\s*(?:"off"|\\[\\s*"off")`,\n' +
  '    sinais: "g",\n' +
  "    exemploQuePega: () => 'rules: { \"no-undef\": \"off\" }',\n" +
  "  },\n";

export const AS_TROCAS: readonly Troca[] = [
  {
    numero: 1,
    arquivo: "external-engines/esteira/src/varredura-de-chamadas.ts",
    de: O_VARREDOR,
    para: AS_DUAS_REGEX,
    derruba: [GLOB, ACHA, STRING].sort(),
  },
  {
    numero: 2,
    arquivo: "external-engines/esteira/src/varredura-de-configuracao.ts",
    de: A_REGRA_EM_OFF,
    para: "",
    derruba: [ACHA, A_DO_LAB57].sort(),
  },
];

/**
 * **RECONSTRUÇÃO DA ORDEM, pela conta:** a 2 com a suíte lendo a prova GRAVADA, sem a ferramenta reescrevê-la. Cai uma
 * terceira, a das contagens — então o *"2"* da prova é o da ordem ferramenta → suíte.
 */
export const A_DOIS_SEM_A_FERRAMENTA = {
  sabotagem: 2,
  derruba: [...AS_TROCAS[1]!.derruba, CONTAGENS].sort(),
} as const;

/** O que a ponta de hoje derruba a mais, por sabotagem: a recontagem do LAB-86 (D287) vê o arquivo encurtado. */
export const A_MAIS_HOJE: Readonly<Record<number, readonly string[]>> = { 1: [A_DO_LAB57], 2: [] };

/** O que a prova conta numa frase como `3 travas de 16: 'a', 'b' e 'c'`. */
export interface Conta {
  fail: number;
  de: number | null;
  /** Os nomes entre aspas simples — a prova encurta, então cada um é um TRECHO do nome do teste. */
  nomes: string[];
}

export function oQueAProvaConta(frase: string): Conta | null {
  const m = /^(\d+) travas?(?: de (\d+))?:/.exec(frase);
  if (!m) return null;
  const nomes = [...frase.matchAll(/'([^']+)'/g)].map((x) => x[1]!);
  return { fail: Number(m[1]), de: m[2] === undefined ? null : Number(m[2]), nomes };
}

/** O resultado que a prova escreve para a sabotagem — na 1, o de depois de corrigir a ordem (o único commitado). */
export interface SabotagemDaProva {
  n: number;
  depoisDeCorrigirAOrdem?: { exit: number; oQuePegou: string };
  resultado?: { exit: number; oQuePegou: string };
}

export function oResultadoDaProva(s: SabotagemDaProva): { exit: number; oQuePegou: string } | null {
  return s.depoisDeCorrigirAOrdem ?? s.resultado ?? null;
}

/**
 * A troca bate com a prova? Confere-se o que ela escreve: a ferramenta saindo com 0, a conta, o denominador (quando há) e
 * que cada nome da prova é trecho de exatamente um teste derrubado. Devolve o motivo, ou `null`.
 */
export function aTrocaDaProva(
  prova: { sabotagens: readonly SabotagemDaProva[] },
  troca: Pick<Troca, "numero">,
  derrubados: readonly string[],
): string | null {
  const s = prova.sabotagens.find((x) => x.n === troca.numero);
  if (!s) return `a prova não tem a sabotagem ${troca.numero}`;
  const r = oResultadoDaProva(s);
  if (!r) return `sabotagem ${troca.numero}: a prova não escreve resultado`;
  if (r.exit !== 0) return `sabotagem ${troca.numero}: a prova diz que a ferramenta saiu com ${r.exit}`;
  const c = oQueAProvaConta(r.oQuePegou);
  if (!c) return `sabotagem ${troca.numero}: a prova não conta travas`;
  if (c.de !== null && c.de !== TESTES_DO_LAB60)
    return `sabotagem ${troca.numero}: a prova conta de ${c.de}, a suíte do LAB-60 tem ${TESTES_DO_LAB60}`;
  if (c.fail !== derrubados.length) return `sabotagem ${troca.numero}: a prova diz ${c.fail}, caíram ${derrubados.length}`;
  if (c.nomes.length !== c.fail) return `sabotagem ${troca.numero}: a prova nomeia ${c.nomes.length} de ${c.fail}`;
  for (const nome of c.nomes) {
    const quem = derrubados.filter((d) => d.includes(nome));
    if (quem.length !== 1) return `sabotagem ${troca.numero}: '${nome}' é trecho de ${quem.length} dos derrubados`;
  }
  return null;
}
