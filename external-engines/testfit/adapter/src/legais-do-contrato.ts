/**
 * OS QUATRO CAMPOS DE `legais` QUE O MOTOR PASSOU A ACEITAR — a D226, entregue. (LAB-93)
 *
 * # O que estava aqui antes, e por que saiu
 *
 * Em 09/10 o `Terreno["legais"]` do motor ganhou `caixaViariaMinima_m`,
 * `faceQuadraMaxima_m`, `rampaMaximaDeVia_pct` e `declividadeMaximaDeLote_pct`, o
 * typecheck desta ponte quebrou, e a ida passou a mandar **os quatro `null`** com o
 * motivo escrito ao lado: *entregar muda o desenho, e isso é prompt, não conserto de
 * typecheck* (D226). A decisão estava certa — o §4 proíbe consertar geometria em
 * silêncio. O que ela deixou pendurado foi a medição, e é ela que mora aqui.
 *
 * # A medição que a D226 não tinha, e ela mudou a frase da D226
 *
 * A D226 disse que *"o motor GANHOU a capacidade que esta ponte declara como perda
 * (ele não limita rampa de via — não calcula greide)"*. Medido campo por campo, no
 * fonte do motor:
 *
 * | campo | o que o motor faz com ele | muda o desenho AQUI? |
 * |---|---|---|
 * | `caixaViariaMinima_m` | `viasComPistaCurta` → aviso por classe de via | **não** — e ele AVISA |
 * | `faceQuadraMaxima_m` | `tetoDeFaceDeQuadra` → `min(botão, legal)` | ~~SIM~~ **não** |
 * | `rampaMaximaDeVia_pct` | `cortesDoArquivo` → corte da CONFERÊNCIA | **não medido** |
 * | `declividadeMaximaDeLote_pct` | idem, o par da rampa | o contrato não publica |
 *
 * > **O motor não ganhou a capacidade de LIMITAR rampa: ele ganhou a de CONFERIR
 * > contra a rampa que o arquivo pediu.** As duas funções dele dizem isso por
 * > escrito — *"isto conta; não reprova e não conserta"* e *"isto mede, avisa e diz
 * > que reprova; não redesenha nada"*. A perda declarada desta ponte (*"o motor não
 * > limita rampa"*) **continua verdadeira como está escrita**, e era a frase
 * > seguinte dela que envelheceu.
 *
 * # ~~A face de quadra é a que move a geometria~~ — a RODADA negou a LEITURA (D308)
 *
 * A coluna acima dizia **SIM** para a `faceQuadraMaxima_m`, e eu a escrevi lendo o
 * fonte do motor: o `tetoDeFaceDeQuadra` faz `min(alvo, legal)` e o resultado entra
 * na quebra de quadra, que é geometria. Rodado, **nada se moveu em 8 de 8 glebas** —
 * nem um lote, nem uma via, nem um aviso.
 *
 * O motivo é medido e é desta ponte: **o mesmo campo do contrato já chegava ao motor
 * por OUTRO caminho** — `parametros.faceQuadraMax_m` vira a faixa degenerada
 * `padroes.comprimentoQuadra` (`ida.ts`), que é de onde sai o `alvo`. Então o
 * `min(alvo, legal)` é `min(200, 200)`, e um mínimo entre dois nomes do mesmo número
 * nunca morde.
 *
 * > **Leitura de fonte é hipótese; rodada é dado.** E quando um campo chega por dois
 * > caminhos, a régua que compara os dois caminhos compara o campo consigo mesmo.
 *
 * # A rampa: primeiro NÃO MEDIDA, depois medida — e as duas coisas importam
 *
 * `parametros.rampaMaxima_pct` vinha **`null` em 8 das 8 glebas** desta casa. A
 * passagem que entrega só ela entregava `null`, e nada mudava **porque nada era
 * entregue**: *passagem que entregou nada mediu a gleba, não o campo.* Dizer "sem
 * efeito" ali seria afirmar sobre o campo o que só se sabia da gleba.
 *
 * Então nasceu a fixture `ensaio-com-rampa` — a única desta casa que declara rampa
 * máxima (8 %) —, e com valor de verdade **continua não movendo nada**. O motivo é
 * estrutural e está medido: varrido o `src/` da origem do motor, quem lê o campo é só
 * a `cortesDoArquivo`, e **a `cortesDoArquivo` não é chamada por ninguém em `src/`**
 * — os chamadores são os `scripts/` de medição dele e os testes dele.
 *
 * > **Porta aberta não é porta usada.** O campo existe no tipo, a tradução do dono o
 * > preenche, e nenhum caminho do motor o consome. Entregá-lo é certo de qualquer
 * > forma — a porta é dele, e quem a usar depois vai achá-la cheia em vez de vazia.
 *
 * Consequência direta: o delta que a D226 publicou — a rampa de `ensaio-com-via` de
 * 21,63 % para 17,92 % — **não pode ter vindo deste campo**, porque o campo é `null`
 * nessa gleba. E não veio da face de quadra, que não morde. *O número foi medido; a
 * causa foi atribuída sem passagem isolada, e as três entregues juntas esconderam
 * qual delas era.* Aqui ele **não reproduz**, e dizer "era isto" sem reproduzir seria
 * inventar a causa de um número que eu não tenho.
 *
 * # O quarto não tem de onde vir, e isso é `null` de verdade
 *
 * `declividadeMaximaDeLote_pct` sai de `parametros.declividadeMaximaLote_pct`, e o
 * **`ParametrosV1` não tem esse campo** — são treze, conferidos. O motor já lê esse
 * nome de forma tolerante (ele diz, no próprio comentário, que *"o esquema do
 * Generate ainda NÃO traz o campo"*), mas tolerar na leitura não é publicar: aqui
 * ele sai `null`, que quer dizer **NÃO MEDIDO** e nunca zero (D23), e o que falta
 * vira pedido numerado ao dono do contrato.
 *
 * # Por que o mapa mora aqui, e não dentro da `ida.ts`
 *
 * O **motor tem a sua própria tradução do contrato v1** (`contrato/traducao.ts`), e
 * ela mapeia os quatro com estes mesmos nomes. Quando esta ponte mandava `null`, ela
 * **discordava da tradução do próprio dono do motor** para a mesma entrada. O mapa
 * fica declarado num lugar só, com o endereço de cada consumidor no fonte dele, para
 * a próxima divergência ser conferível em vez de ser descoberta por typecheck.
 */
import type { ParametrosV1 } from "./contrato-v1.ts";

/** O que o motor FAZ com o campo — medido no fonte dele, não suposto pelo nome. */
export type OQueOMotorFaz =
  /** Conta e avisa; nenhuma via muda de lugar. */
  | "confere-e-avisa"
  /** Entra na geometria: o traçado sai diferente. */
  | "muda-o-desenho"
  /** Troca o corte contra o qual a conferência corre; o desenho é o mesmo. */
  | "troca-o-corte-da-conferencia";

/** Um dos quatro campos, com a origem no contrato e o destino no motor. */
export interface CampoLegal {
  /** O nome no `Terreno["legais"]` do motor. */
  campo:
    | "caixaViariaMinima_m"
    | "faceQuadraMaxima_m"
    | "rampaMaximaDeVia_pct"
    | "declividadeMaximaDeLote_pct";
  /** De onde ele vem no contrato v1 — ou `null` quando o contrato não publica. */
  doContrato: keyof ParametrosV1 | "declividadeMaximaLote_pct" | null;
  /** `true` quando `ParametrosV1` declara o campo de origem. */
  oContratoPublica: boolean;
  oQueOMotorFaz: OQueOMotorFaz;
  /** Onde o motor o consome — arquivo e linha **na origem carimbada abaixo**. */
  onde: string;
  /** O que ele decide, em uma frase. */
  oQueDecide: string;
  /**
   * O que a RODADA disse nas oito glebas desta casa (LAB-93) — e ela manda sobre a
   * leitura do fonte, que é só hipótese.
   *
   * `"nao-medido"` é resposta: o contrato destas glebas não traz valor para o campo,
   * então a passagem entregou `null` e não mediu nada.
   */
  aquiMudouODesenho: "sim" | "nao" | "nao-medido";
  /** Por que não morde aqui, quando não morde. `null` quando morde ou não foi medido. */
  porQueNaoMordeAqui: string | null;
}

/**
 * A procedência da leitura do motor — e ela grava as DUAS profundidades (D294).
 *
 * O clone irmão que esta esteira compila está num commit; a origem está em outro.
 * Em vez de afirmar que *"dá no mesmo"*, os três consumidores e o bloco de tipo
 * foram **comparados byte a byte** nos dois, e é esse `sha256` que autoriza medir no
 * clone e falar da origem. *Carimbar só o commit responderia "quando"; o que
 * identifica o TEXTO é o conteúdo.*
 */
export const ONDE_ISTO_FOI_LIDO = {
  repositorio: "motor-testfit",
  cloneQueCompila: "6cf6396",
  origemNaLeitura: "11fcbad",
  lidoEm: "2026-10-11",
  /** `sha256` do bloco/função, idêntico nos dois commits. */
  identicosNosDois: {
    "tipos.ts · legais": "2760883df1bbc428411422986e61077cae606f0b7b9ea90eee54302aff43f528",
    "contrato/traducao.ts · legais":
      "5f811fa9d88a8eb872f8764a8e88f4f950a15cbb5b78b818b053a04dc80faf06",
    "pista.ts · viasComPistaCurta":
      "35ba2c0c69fe81aef0d55fe483c1339b89001255dbdd405cc108267e91738b22",
    "motor.ts · tetoDeFaceDeQuadra":
      "d00b034f2489bf287570271993c9c2bab23edf3907595fe3b5dcf62165969e60",
    "relevo.ts · cortesDoArquivo":
      "d1535c31d54e198fe18609cea2105ebcdb8a5ba853fe61ddfe4c8f409a3b60cf",
  },
  /** As linhas citadas em `onde` são as da ORIGEM — no clone elas são outras. */
  asLinhasSaoDa: "11fcbad",
} as const;

/** Os quatro, na ordem em que o motor os declara. */
export const OS_QUATRO: readonly CampoLegal[] = [
  {
    campo: "caixaViariaMinima_m",
    doContrato: "caixaViariaMin_m",
    oContratoPublica: true,
    oQueOMotorFaz: "confere-e-avisa",
    onde: "src/lib/lab/pista.ts:52 · viasComPistaCurta",
    oQueDecide:
      "quais vias têm PISTA (caixa menos as duas calçadas) abaixo do mínimo que o arquivo " +
      "pediu. Sem o campo a função devolve `null` — e o motor é explícito: dizer “nenhuma” " +
      "seria dizer que passaram",
    aquiMudouODesenho: "nao",
    porQueNaoMordeAqui:
      "o motor diz, no próprio aviso, que “não mexeu no traçado: quem julga é o Generate”. " +
      "Medido: 8 de 8 glebas ganharam avisos (de +10 a +40) com a geometria IDÊNTICA",
  },
  {
    campo: "faceQuadraMaxima_m",
    doContrato: "faceQuadraMax_m",
    oContratoPublica: true,
    oQueOMotorFaz: "muda-o-desenho",
    onde: "src/lib/lab/motor.ts:185 · tetoDeFaceDeQuadra",
    oQueDecide:
      "o teto de face de quadra vale `min(alvo da amostra, limite do arquivo)` — o único dos " +
      "quatro cujo destino é a geometria. Que ele MORDA é outra pergunta, e a resposta aqui é não",
    aquiMudouODesenho: "nao",
    porQueNaoMordeAqui:
      "o MESMO campo do contrato já chega por outro caminho: `parametros.faceQuadraMax_m` vira " +
      "a faixa degenerada `padroes.comprimentoQuadra`, que é de onde sai o `alvo`. Então " +
      "`min(alvo, legal)` é `min(200, 200)` nas oito glebas, e mínimo entre dois nomes do " +
      "mesmo número não morde. Isto é da PONTE, não do motor",
  },
  {
    campo: "rampaMaximaDeVia_pct",
    doContrato: "rampaMaxima_pct",
    oContratoPublica: true,
    oQueOMotorFaz: "troca-o-corte-da-conferencia",
    onde: "src/lib/lab/relevo.ts:822 · cortesDoArquivo",
    oQueDecide:
      "contra que rampa a conferência corre. O INDICADOR continua correndo contra o corte " +
      "declarado da família (15 %), de propósito: indicador que muda de régua a cada arquivo " +
      "não compara gleba com gleba",
    aquiMudouODesenho: "nao",
    porQueNaoMordeAqui:
      "o campo NÃO TEM CONSUMIDOR dentro do motor. Varrido o `src/` da origem, quem o lê é " +
      "só a `cortesDoArquivo` — e a `cortesDoArquivo` não é chamada por ninguém em `src/`: " +
      "os chamadores são os `scripts/` de medição do próprio motor e os testes dele. Então " +
      "entregá-lo preenche a porta e não muda resposta nenhuma que esta esteira observe. " +
      "Medido com a fixture `ensaio-com-rampa`, a única desta casa que declara rampa (8 %)",
  },
  {
    campo: "declividadeMaximaDeLote_pct",
    doContrato: null,
    oContratoPublica: false,
    oQueOMotorFaz: "troca-o-corte-da-conferencia",
    onde: "src/lib/lab/relevo.ts:824 · cortesDoArquivo",
    oQueDecide:
      "o par da rampa, e é o único dos quatro que É LEI (6.766, art. 3º, parágrafo único, " +
      "III). O motor o lê de `parametros.declividadeMaximaLote_pct`, que o `ParametrosV1` " +
      "NÃO declara — então daqui ele sai `null`, que é “não medido”, e o resto é pedido ao " +
      "dono do contrato",
    aquiMudouODesenho: "nao-medido",
    porQueNaoMordeAqui: null,
  },
];

/** Os treze campos que o `ParametrosV1` publica — a lista contra a qual `doContrato` se confere. */
export const O_QUE_O_CONTRATO_PUBLICA = [
  "areaMinLote_m2",
  "areaAlvoLote_m2",
  "areaMaxLote_m2",
  "testadaMinLote_m",
  "caixaViariaMin_m",
  "caixaPrincipal_m",
  "caixaSecundaria_m",
  "calcada_m",
  "faceQuadraMax_m",
  "pctAreaPublica",
  "pctAPP",
  "pctLazer",
  "rampaMaxima_pct",
] as const satisfies readonly (keyof ParametrosV1)[];

/** O que a ponte escreve no `legais` do motor, além dos dois que já iam. */
export interface LegaisEntregues {
  caixaViariaMinima_m: number | null;
  faceQuadraMaxima_m: number | null;
  rampaMaximaDeVia_pct: number | null;
  declividadeMaximaDeLote_pct: number | null;
}

/** Os quatro `null` — a passagem SEM, que a D226 deixou como estado do repositório. */
export const NENHUM_ENTREGUE: LegaisEntregues = {
  caixaViariaMinima_m: null,
  faceQuadraMaxima_m: null,
  rampaMaximaDeVia_pct: null,
  declividadeMaximaDeLote_pct: null,
};

/**
 * Quais dos quatro esta passagem entrega. `true` é "os três que o contrato publica".
 *
 * A lista explícita existe para a medição do LAB-93 poder entregar **um por vez** —
 * sem ela, três campos entregues juntos e um número que se move não dizem qual
 * campo o moveu, que foi exatamente o engano da D226.
 */
export type QuaisEntregar = boolean | readonly CampoLegal["campo"][];

/**
 * Monta o bloco `legais` a partir do que o contrato publica.
 *
 * O que o contrato não publica sai `null`, e o que esta passagem não entrega sai
 * `null` **pelo mesmo motivo de sempre**: `null` é "não medido", nunca zero (D23).
 * Pôr zero em `rampaMaximaDeVia_pct` diria ao motor que a rampa máxima da via é
 * 0 %, que é o contrário de "o contrato não falou".
 */
export function legaisDoContrato(p: ParametrosV1, entregar: QuaisEntregar): LegaisEntregues {
  const quais = (c: CampoLegal["campo"]) =>
    entregar === true ? true : entregar === false ? false : entregar.includes(c);
  const valor = (c: CampoLegal): number | null => {
    if (!quais(c.campo) || !c.oContratoPublica || c.doContrato === null) return null;
    const v = (p as unknown as Record<string, number | null | undefined>)[c.doContrato];
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  };
  const porCampo = Object.fromEntries(OS_QUATRO.map((c) => [c.campo, valor(c)]));
  return { ...NENHUM_ENTREGUE, ...porCampo } as LegaisEntregues;
}

/**
 * O QUE A ESTEIRA PASSA A USAR — e o motivo, porque a escolha é declarada (§4).
 *
 * **Os três que o contrato publica.** O quarto não tem de onde vir e sai `null`.
 *
 * A escolha é da medição do LAB-93, e ela tem três pernas:
 *
 * 1. **a omissão não é neutra.** `null` aqui não quer dizer "sem limite": quer dizer
 *    *"vale o padrão de fábrica do motor"* — 15 % de rampa e 30 % de declividade de
 *    lote, declarados por ele. Omitir é deixar o motor escolher a régua da
 *    conferência, que é a doença do K = 17 (LAB-92);
 * 2. **o dono do motor já declarou este mapa.** A tradução dele do contrato v1
 *    entrega os três com estes nomes; manter `null` era esta ponte discordando dele
 *    sobre a mesma entrada, e discordância de ponte não é dado;
 * 3. **o delta é conhecido, publicado e tem UM dono.** Só a `faceQuadraMaxima_m`
 *    mexe na geometria, e ela mexe para **obedecer ao arquivo**. Um motor que
 *    ignorava o teto legal de face de quadra porque a ponte não o passava desenhava
 *    quadra que o Validator reprovaria — e o Lab chamaria isso de defeito do motor.
 *
 * *Entregar não é melhorar o motor: é parar de omitir premissa.* O que é decisão de
 * urbanismo — **qual** limite a competição usa — não se decide aqui: vai à página do
 * Jonny, e é por isso que o valor vem do arquivo e nunca desta casa.
 */
export const OS_LEGAIS_POR_PADRAO: QuaisEntregar = [
  "caixaViariaMinima_m",
  "faceQuadraMaxima_m",
  "rampaMaximaDeVia_pct",
];
