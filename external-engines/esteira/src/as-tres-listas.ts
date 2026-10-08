/**
 * ════════════════════════════════════════════════════════════════════════════
 *  AS TRÊS LISTAS QUE ESPERAM PELO CHAT. (LAB-62)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **O pedido do chat, nas palavras dele:** *"mande AQUI, dentro do próprio recado, as três
 * coisas que esperam por mim, porque é só o recado que chega até o chat."* Três listas: os
 * **onze** itens abertos da seção *"Proposto ao chat"*, os **seis** mecanismos do motor
 * *"em ordem de quantas glebas cada conserto destrava"*, e as **três** formas de desligar
 * conferência dele *"com o 'não tem CI' em primeiro"*.
 *
 * # Duas coisas aqui são régua, e não texto
 *
 * ## 1 · "quantas glebas cada conserto destrava" tem DUAS leituras, e elas dão ordens
 * diferentes
 *
 * O número que a prova do LAB-58 publica por mecanismo é `glebasQueEleBloqueia` — **em
 * quantas glebas ele aparece**. Essa não é a mesma pergunta que *"quantas ele destrava"*:
 * gleba com dois mecanismos não zera quando você conserta **um**.
 *
 * Medido nas cinco glebas: por **alcance**, o primeiro é `fileira-sem-via-propria` (3
 * glebas); por **destrave sozinho**, o primeiro é `face-de-quadra-limitada-num-eixo-so`,
 * **o único que leva uma gleba a zero por si** (`ensaio-47ha`, 1 mecanismo e nada mais) —
 * e os outros cinco destravam **zero**. As duas ordens vão na lista, nomeadas, porque
 * mandar uma delas chamando-a pelo nome da outra é a forma do D148: **rótulo não é
 * identidade**.
 *
 * ## 2 · "o que precisa ficar verdadeiro", e não "qual arquivo mexer"
 *
 * O chat mandou isto junto, pelo achado da Pesquisa (LAB-63): *"cada item diz o que precisa
 * ficar verdadeiro, não qual arquivo mexer."* Então cada item das duas listas numeradas
 * carrega uma **afirmação** e a **frequência** com que ela se confere — e há guarda:
 * `afirmacaoNomeiaArtefato` reprova afirmação que cita caminho ou extensão de arquivo.
 *
 * > **Pedido que nomeia o artefato volta pela metade.** O destino do item é do motor, não
 * > meu: eu digo o que tem de passar a ser verdade e como se mede que passou.
 */

/** As extensões que fazem de um nome um ARTEFATO, e não uma afirmação. */
export const EXTENSOES_DE_ARTEFATO = [
  ".ts",
  ".tsx",
  ".js",
  ".json",
  ".sh",
  ".md",
  ".yml",
  ".yaml",
  ".wasm",
] as const;

/**
 * Uma afirmação **nomeia artefato** quando traz separador de caminho ou extensão de arquivo.
 *
 * Nome de chave de configuração (`skipLibCheck`) e nome de passo (`lint`) **não** contam: eles
 * são a coisa de que a afirmação fala, não o lugar onde mexer. O que a régua barra é
 * `tsconfig.json`, `src/lib/lab/motor.ts`, `.github/workflows/` — endereço.
 *
 * **O prefixo que mente sobre o veredicto, e ele apareceu nesta própria régua** (D184): a
 * primeira versão varria a lista na ordem declarada e devolvia `.ts` para `pacote.tsx` e
 * `.js` para `TSCONFIG.JSON`. O veredicto estava certo — a afirmação nomeia artefato nos dois
 * casos — e o **rótulo** estava errado, e é o rótulo que vai na mensagem ao motor. Então a
 * varredura é da extensão **mais longa para a mais curta**, e a extensão só casa quando não
 * continua em letra ou dígito.
 */
export function afirmacaoNomeiaArtefato(afirmacao: string): string | null {
  if (afirmacao.includes("/")) return "traz separador de caminho `/`";
  const baixo = afirmacao.toLowerCase();
  const daMaisLonga = [...EXTENSOES_DE_ARTEFATO].sort((a, b) => b.length - a.length);
  for (const ext of daMaisLonga) {
    let de = baixo.indexOf(ext);
    while (de !== -1) {
      const depois = baixo[de + ext.length];
      if (depois === undefined || !/[a-z0-9]/.test(depois)) return `traz a extensão \`${ext}\``;
      de = baixo.indexOf(ext, de + 1);
    }
  }
  return null;
}

/** O que precisa ficar verdadeiro para um mecanismo do motor deixar de produzir violação. */
export interface AfirmacaoDeMecanismo {
  /** O id do mecanismo em `mecanismos-das-violacoes.ts`. Chave da junção. */
  mecanismo: string;
  /** O que precisa ficar VERDADEIRO. Sem endereço de arquivo — há guarda. */
  oQuePrecisaFicarVerdadeiro: string;
  /** Com que frequência isso se confere. Metade do pedido (LAB-63). */
  comQueFrequencia: string;
  /** O que NÃO serve como prova de que ficou verdadeiro. */
  oQueNaoServe: string;
}

/**
 * As seis afirmações, uma por mecanismo do LAB-58.
 *
 * Cada uma é a **negação do predicado medido** daquele mecanismo, escrita como estado do
 * mundo. O predicado vive na prova do LAB-58 (`oPredicadoMedido`), e a trava confere que os
 * seis ids batem com os seis mecanismos — afirmação órfã ou mecanismo sem afirmação reprova.
 */
export const AFIRMACOES_DOS_MECANISMOS: AfirmacaoDeMecanismo[] = [
  {
    mecanismo: "face-de-quadra-limitada-num-eixo-so",
    oQuePrecisaFicarVerdadeiro:
      "nenhuma quadra sai com uma face acima do teto de comprimento declarado e outra abaixo dele: " +
      "o teto limita os DOIS eixos da quadra, não um só",
    comQueFrequencia:
      "a cada execução da esteira de conferência, nas cinco glebas de ensaio — é o invariante " +
      "`face-quadra` do Validator do Generate, que já roda e já conta",
    oQueNaoServe:
      "baixar o teto declarado para caber na tira que sai hoje: isso muda a entrada, não o motor, " +
      "e a tira volta na primeira gleba maior",
  },
  {
    mecanismo: "fileira-sem-via-propria",
    oQuePrecisaFicarVerdadeiro:
      "todo lote de quadra tem borda a 0,75 m ou menos do contorno de alguma via: a fileira " +
      "voltada para o miolo da quadra não nasce",
    comQueFrequencia:
      "a cada execução da esteira, nas cinco glebas — é o invariante `frente`, por lote, e ele " +
      "nomeia o lote que falha",
    oQueNaoServe:
      "contar só a quadra: a violação é por LOTE, e quadra com rua de um lado passa na conta da " +
      "quadra e reprova em 19 lotes",
  },
  {
    mecanismo: "lote-do-fim-da-fileira-perde-testada-e-nao-profundidade",
    oQuePrecisaFicarVerdadeiro:
      "o último lote de cada fileira fica com testada igual ou acima do mínimo declarado — se o " +
      "resto do corte não couber, ele é absorvido pelo vizinho e não vira lote",
    comQueFrequencia:
      "a cada execução da esteira — é o invariante `testada`, e o mínimo tem de vir do contrato " +
      "de entrada e nunca do alvo sorteado (foi isso que custou o D166 aqui)",
    oQueNaoServe:
      "preservar a profundidade e pagar na testada, que é o que ele faz hoje: o lote fica com cinco " +
      "vértices, fundo inteiro e frente curta, e a frente é o que a regra cobra",
  },
  {
    mecanismo: "faixa-externa-sem-limite-longitudinal",
    oQuePrecisaFicarVerdadeiro:
      "todo lote nascido de face entregue fica dentro da EXTENSÃO dessa face, e não dentro da reta " +
      "infinita que a contém: a faixa acaba onde a face acaba",
    comQueFrequencia:
      "a cada execução da esteira, mas a medição que a prova é a DISTÂNCIA do lote ao segmento da " +
      "face entregue — hoje ela vai de 10,25 m a 62,37 m em 18 lotes de uma gleba",
    oQueNaoServe:
      "medir a distância do lote à RETA da face: ela dá zero para todos os 18, que é exatamente " +
      "por que o defeito durou",
  },
  {
    mecanismo: "rede-viaria-aparada-so-pela-divisa",
    oQuePrecisaFicarVerdadeiro:
      "nenhum leito de via atravessa lote: o aparo da rede viária é contra a mesma área de onde os " +
      "lotes saem, e não contra a divisa da gleba",
    comQueFrequencia:
      "a cada execução da esteira — é o invariante `via-sobre-lote`, e ele é de sobreposição, " +
      "então aparece com qualquer tolerância",
    oQueNaoServe:
      "o recorte por cul-de-sac: ele só roda com percentual maior que zero e só sobre a via " +
      "secundária, e os 11 lotes de hoje não são todos de secundária",
  },
  {
    mecanismo: "fileira-encosta-na-via-so-de-esguelha",
    oQuePrecisaFicarVerdadeiro:
      "o contato de cada lote com o leito que o serve tem comprimento igual ou acima do mínimo de " +
      "testada: encostar num trecho curto não conta como frente",
    comQueFrequencia:
      "a cada execução da esteira, com amostragem fina da aresta — com amostragem no MEIO da " +
      "aresta esses 4 lotes passam, e foi assim que eles chegaram rotulados como `frente`",
    oQueNaoServe:
      "consertar o rótulo da régua: medido aqui, trocar `frente` por `testada` nesses lotes derruba " +
      "ZERO violações (D184). O saldo é o que conta, não o nome",
  },
];

/** O que precisa ficar verdadeiro para uma forma de desligar conferência deixar de valer. */
export interface AfirmacaoDeConferencia {
  /** A ordem pedida pelo chat: o contexto primeiro, depois as três formas. */
  numero: number;
  /**
   * Qual das três formas do LAB-57/LAB-60 esta linha é — ou `null` no contexto, que não é
   * forma. A trava confere que as TRÊS aparecem exatamente uma vez cada.
   */
  formaDoLAB60: "nao-pode-reprovar" | "desligada" | "sem-motivo-escrito" | null;
  /** O título curto, como ele leva ao motor. */
  oQue: string;
  oQuePrecisaFicarVerdadeiro: string;
  comQueFrequencia: string;
  oQueNaoServe: string;
}

/**
 * As quatro linhas da terceira lista, na ordem que o chat pediu: **o "não tem CI" em
 * primeiro**, e as três formas depois.
 *
 * Por que a ordem dele está certa, e isto foi medido no LAB-60: *"regra que não pode reprovar
 * e regra que ninguém roda falham do mesmo jeito, e a segunda é a que este repositório pagou
 * duas semanas para aprender (D110)."*
 */
export const AFIRMACOES_DA_CONFERENCIA: AfirmacaoDeConferencia[] = [
  {
    numero: 1,
    formaDoLAB60: null,
    oQue: "o motor NÃO TEM CI — e isto vale mais que as três formas",
    oQuePrecisaFicarVerdadeiro:
      "todo push ao motor roda `lint`, `typecheck` e `test`, e o resultado é visível sem ninguém " +
      "pedir. Se alguma coisa faltar para rodar, o trabalho FALHA com a receita de obtê-la, e nunca pula",
    comQueFrequencia:
      "todo push, sem exceção e sem segredo para os passos que não precisam de clone vizinho",
    oQueNaoServe:
      "três passos declarados que alguém roda quando lembra: aqui a suíte de um pacote ficou " +
      "VERMELHA, 14 de 14, por duas semanas, porque eu rodava só o outro (D110)",
  },
  {
    numero: 2,
    formaDoLAB60: "nao-pode-reprovar",
    oQue: "a regra LIGADA QUE NÃO PODE REPROVAR — o passo de lint sai verde com o aviso impresso",
    oQuePrecisaFicarVerdadeiro:
      "o passo de lint do motor REPROVA com qualquer aviso: zero avisos tolerados. Hoje ele " +
      "declara 1 regra em `warn`, e ela aparece na saída e não derruba o passo",
    comQueFrequencia:
      "todo push, no mesmo trabalho de CI do item 1 — e a prova é o código de saída, não a leitura " +
      "da saída com o olho",
    oQueNaoServe:
      "ler a saída e dizer que está limpa: é a mais silenciosa das três formas justamente porque o " +
      "passo sai VERDE com o aviso impresso, e foi o que este repositório tinha até o LAB-57",
  },
  {
    numero: 3,
    formaDoLAB60: "desligada",
    oQue: "a regra DESLIGADA — e o desligador de conferência no próprio compilador",
    oQuePrecisaFicarVerdadeiro:
      "toda regra de lint em `off` e toda chave de configuração que afrouxa conferência tem, no " +
      "próprio lugar onde está desligada, o MOTIVO escrito e a condição de revisitar",
    comQueFrequencia:
      "a cada mudança de configuração, por varredura que reprova — não por revisão humana: " +
      "desligada sem motivo escrito envelhece em silêncio, que é o D104",
    oQueNaoServe:
      "o motivo em outro documento, em mensagem de commit ou em memória de quem desligou. Nem toda " +
      "regra desligada é defeito — `no-undef` em TypeScript é recomendação do próprio ferramental — " +
      "e é exatamente por isso que o motivo precisa estar ao lado: para distinguir as duas",
  },
  {
    numero: 4,
    formaDoLAB60: "sem-motivo-escrito",
    oQue: "o desligador SEM MOTIVO ESCRITO — a conferência de tipo nas dependências, sem o número ao lado",
    oQuePrecisaFicarVerdadeiro:
      "ou a conferência de tipo dentro das dependências está LIGADA, ou está desligada com o número " +
      "medido escrito ao lado: quantos erros ela acusa quando ligada, e em que data isso foi medido",
    comQueFrequencia:
      "a cada atualização de dependência, porque é a atualização que muda o número — a medição de " +
      "ontem não responde pela dependência de hoje",
    oQueNaoServe:
      "a afirmação de que é a escolha certa sem o número: aqui ela É a escolha certa, e só se sabe " +
      "disso porque foi medida — deu ZERO erros nos dois pacotes (LAB-57). Sem o número, é fé",
  },
];
