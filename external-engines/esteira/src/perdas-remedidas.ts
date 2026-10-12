/**
 * AS TRÊS PERDAS QUE FICARAM SOB SUSPEITA, REMEDIDAS E DATADAS. (LAB-93, item 026)
 *
 * # A frase que ficou pendurada, e o que ela não dizia
 *
 * A D226 fechou assim: *"três perdas declaradas desta ponte ficam sob suspeita de
 * estarem velhas: o motor pode ter crescido por baixo delas."* A frase saiu em
 * **cinco lugares** — a decisão, o relatório do LAB-68, a `FILA.md`, o `ida.ts` e a
 * caixa 026 — e em nenhum deles ela **nomeia as três**.
 *
 * > **Contagem sem a lista ao lado é a forma mais barata de um número envelhecer.**
 * > Quem for conferir "as três" tem de descobrir quais, e duas pessoas descobrem
 * > conjuntos diferentes. Esta casa já pagou isso: era o defeito da própria §1 do
 * > `CLAUDE.md` (D218) e o do *"NOVE foram réguas minhas"* que não somava (D212).
 *
 * Medido: no bloco de parâmetros do inventário da ida do Parcelamento
 * (`inventario-das-idas.ts`) há **exatamente três** `perda(...)`, e são estas. A
 * contagem da D226 estava **certa**; o que faltava era o nome.
 *
 * # E a terceira nunca teve nada a ver com os quatro campos
 *
 * Isto é o achado desta releitura, e ele é contra a D226: a suspeita era *"o motor
 * cresceu por baixo delas"*, e dos quatro campos novos de `legais` **dois** tocam
 * perda declarada. A `pctAreaPublica` não tem campo novo nenhum apontando para ela —
 * ela entrou na conta por morar no mesmo bloco das outras duas.
 *
 * > **Três coisas suspeitas porque estão na mesma gaveta não são três coisas
 * > suspeitas.** A vizinhança no arquivo não é vizinhança na causa.
 */

/** O que a releitura decidiu sobre cada uma. */
export type VeredictoDaPerda =
  /** O motor passou a ter quem cubra: deixa de ser perda e vira destino traduzido. */
  | "saiu-da-lista"
  /** Continua perda, remedida e datada hoje. */
  | "fica-remedida"
  /** Nunca esteve em jogo: nenhum campo novo aponta para ela. */
  | "nao-era-dessa-familia";

export interface PerdaRemedida {
  campo: string;
  /** A frase que estava escrita antes desta releitura. */
  oQueDizia: string;
  veredicto: VeredictoDaPerda;
  /** O que a medição do LAB-93 respondeu. */
  oQueAMedicaoDisse: string;
  /** Para onde o campo passa a ir, quando passa. */
  destinoAgora: string | null;
  remedidaEm: "2026-10-12";
}

/**
 * As três, nomeadas — e a ordem é a do arquivo, para qualquer um refazer a conta.
 */
export const AS_TRES_SOB_SUSPEITA: readonly PerdaRemedida[] = [
  {
    campo: "parametros.caixaViariaMin_m",
    oQueDizia:
      "o motor usa as caixas explícitas e não tem um piso independente. Vira perda declarada " +
      "só quando o mínimo é MAIOR que a menor caixa — aí o contrato se contradiz",
    veredicto: "saiu-da-lista",
    oQueAMedicaoDisse:
      "o piso independente EXISTE desde que `legais.caixaViariaMinima_m` nasceu: a " +
      "`viasComPistaCurta` compara a PISTA (caixa menos as duas calçadas) com o mínimo do " +
      "arquivo, e o motor avisa por classe de via. Entregue o campo, `ensaio-com-via` ganhou " +
      "38 avisos novos e a geometria ficou IDÊNTICA — ele avisa e não redesenha, por escrito",
    destinoAgora: "terreno.legais.caixaViariaMinima_m",
    remedidaEm: "2026-10-12",
  },
  {
    campo: "parametros.rampaMaxima_pct",
    oQueDizia: "o motor não limita rampa — ele mede, desde o T03 dele",
    veredicto: "saiu-da-lista",
    oQueAMedicaoDisse:
      "a frase continua VERDADEIRA como está escrita — ele não limita —, e é por isso que ela " +
      "enganava: o campo deixou de ser DESCARTADO. Ele entra em `cortesDoArquivo` e decide " +
      "contra que rampa a conferência do motor corre. Campo que chega ao motor e muda uma " +
      "resposta dele não é perda, qualquer que seja a resposta. E MEDIDO: entregá-lo não move " +
      "nada hoje, porque a `cortesDoArquivo` não é chamada por ninguém no `src/` do motor — " +
      "porta aberta não é porta usada, e isso não a torna uma perda",
    destinoAgora: "terreno.legais.rampaMaximaDeVia_pct",
    remedidaEm: "2026-10-12",
  },
  {
    campo: "parametros.pctAreaPublica",
    oQueDizia:
      "o motor não reserva área pública por porcentagem; ele reserva por ímã de conteúdo",
    veredicto: "nao-era-dessa-familia",
    oQueAMedicaoDisse:
      "nenhum dos quatro campos novos de `legais` aponta para ela, e o motor continua sem " +
      "agregado de área pública: tem `doacaoPct` e `lazerPct` separados. A perda FICA, " +
      "remedida hoje — e ela entrou na suspeita por vizinhança de arquivo, não por causa",
    destinoAgora: null,
    remedidaEm: "2026-10-12",
  },
];

/** A conta da releitura, para a trava poder confrontá-la com a lista. */
export function aContaDasPerdas(): Record<VeredictoDaPerda | "total", number> {
  const por = (v: VeredictoDaPerda) =>
    AS_TRES_SOB_SUSPEITA.filter((p) => p.veredicto === v).length;
  return {
    total: AS_TRES_SOB_SUSPEITA.length,
    "saiu-da-lista": por("saiu-da-lista"),
    "fica-remedida": por("fica-remedida"),
    "nao-era-dessa-familia": por("nao-era-dessa-familia"),
  };
}
