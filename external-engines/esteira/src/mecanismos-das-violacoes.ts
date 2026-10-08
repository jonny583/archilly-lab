/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Os MECANISMOS do motor que produzem as violações — como DADO, não como prosa.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-58 precisa dizer **quantos mecanismos distintos** produzem as 81 violações que são
 * do motor, e **quantas cada um responde**. Isso só é uma medição se cada mecanismo tiver
 * um **predicado sobre campos medidos** — caso contrário é agrupamento de impressão.
 *
 * Então cada mecanismo aqui carrega cinco coisas:
 *
 * | campo | o que é |
 * |---|---|
 * | `emUmaLinha` | o nome curto, para a lista numerada que vai ao motor |
 * | `oQueOMotorFaz` | o mecanismo, em palavras, **do lado do motor** |
 * | `ondeNoMotor` | onde isso foi LIDO no código do vizinho (só de leitura, §4) |
 * | `aProvaQueSustenta` | o prompt e a prova em que o mecanismo foi medido |
 * | `oPredicadoMedido` | a frase do predicado, para quem lê o JSON sem ler este arquivo |
 * | `casa` | o predicado, em código, sobre os campos MEDIDOS |
 *
 * # Por que os predicados são EXCLUSIVOS, e por que isso é conferido
 *
 * "Quantos mecanismos existem" só tem resposta se a atribuição for uma **partição**: cada
 * violação em um mecanismo e não em dois. Um predicado que casa duas vezes não é
 * agrupamento, é dupla contagem — e dupla contagem numa lista que vai virar fila de
 * conserto faz o motor consertar duas vezes a mesma coisa, ou nenhuma.
 *
 * Por isso `mecanismosQueCasam` devolve **todos** os que casam, e o chamador **para** se
 * algum casar mais de um. O que nenhum alcança sai `MECANISMO-NAO-NOMEADO` **com a
 * contagem** — `null` é "não medido" e zero é uma medição (D23).
 *
 * # O que estes predicados NÃO fazem
 *
 * Eles **não julgam**. O veredicto de cada violação é do Validator do Generate, e já estava
 * dado antes de este arquivo existir. Aqui só se pergunta *qual mecanismo do motor explica
 * esta violação que ele já deu* — e todo campo que o predicado lê foi medido com a função
 * dele ou com uma régua calibrada contra ela (LAB-58).
 */

/** Uma violação do Validator do Generate com os campos que o LAB-58 mediu em volta dela. */
export type ViolacaoMedida = {
  gleba: string;
  tipo: string;
  loteId: string | null;
  /** `gleba|tipo|loteId` — a chave da junção, e o TIPO faz parte dela. */
  chave: string;
  externo: boolean;
  quadraId: string | null;
  // ── só em `face-quadra` ──
  facesDaQuadra_m: number[] | null;
  facesAcimaDoTeto: number | null;
  facesAbaixoDoTeto: number | null;
  tetoDeFace_m: number;
  // ── só em `frente`, `testada` e `via-sobre-lote` ──
  /** A distância da borda do lote ao CONTORNO da via mais próxima, calibrada contra a função dele. */
  dAoContornoDaVia_m: number | null;
  verticesDoLote: number | null;
  arestas_m: number[] | null;
  maiorAresta_m: number | null;
  /** A moda da maior aresta entre os lotes da mesma quadra — a profundidade da fileira, MEDIDA. */
  profundidadeModalDaFileira_m: number | null;
  lotesNaQuadra: number | null;
  testadaDele_m: number | null;
  testadaMin_m: number;
  /** Lido da prova do LAB-50: a distância do lote externo à face entregue. */
  aoSegmentoDaFaceEntregue_m: number | null;
  /** Lido da prova do LAB-54: a classe medida com a função dele. */
  classe_LAB54: string | null;
  testadaComPassoFino_m: number | null;
  /** Lido da prova do LAB-53: esta violação é do contrato do Generate, não do motor. */
  doContratoDoGenerate: boolean;
};

export type Limites = {
  /** A tolerância do próprio Validator: 0,75 m. */
  tolDele_m: number;
  /** Quanto a maior aresta pode diferir da profundidade modal para ser "a mesma". */
  mesmaProfundidade_m: number;
};

export type Mecanismo = {
  id: string;
  emUmaLinha: string;
  oQueOMotorFaz: string;
  ondeNoMotor: string;
  aProvaQueSustenta: string;
  oPredicadoMedido: string;
  casa: (v: ViolacaoMedida, lim: Limites) => boolean;
};

export const NAO_NOMEADO = "MECANISMO-NAO-NOMEADO";

export const MECANISMOS: readonly Mecanismo[] = [
  {
    id: "faixa-externa-sem-limite-longitudinal",
    emUmaLinha: "a faixa do lote externo é um SEMIPLANO: ela não acaba onde a face entregue acaba",
    oQueOMotorFaz:
      "para cada face entregue, `reservarFacesExternas` corta a gleba por um semiplano à " +
      "distância `prof` da RETA da face — e distribui os lotes pela caixa envolvente dessa " +
      "faixa. A reta é infinita e a face não: lotes nascem a centenas de metros do trecho " +
      "que recebeu a testada, onde não há rua nenhuma",
    ondeNoMotor: "motor-testfit · src/lib/lab/motor.ts · reservarFacesExternas (lido, não tocado)",
    aProvaQueSustenta: "LAB-50 · docs/provas/LAB-50/passagem-externa.json (D173)",
    oPredicadoMedido: "tipo `frente` · lote externo (`-eN`) · a mais de 0,5 m da face entregue (LAB-50)",
    casa: (v) => v.tipo === "frente" && v.externo && (v.aoSegmentoDaFaceEntregue_m ?? -1) > 0.5,
  },
  {
    id: "rede-viaria-aparada-so-pela-divisa",
    emUmaLinha: "a rede viária é aparada pela DIVISA e não por `util`: ela entra na faixa do lote externo",
    oQueOMotorFaz:
      "`apararRedeViaria(viasBrutas, terreno.perimetro)` é o único aparo que a rede recebe, e " +
      "ele usa o PERÍMETRO da gleba. A faixa que `reservarFacesExternas` tirou da gleba é " +
      "buraco só no domínio do LOTE (`quadraRet(util, …)`), não no da VIA — então o leito " +
      "atravessa os lotes externos. O recorte por cul-de-sac não salva: ele só roda com " +
      "`pctCulDeSac > 0` e só sobre a secundária",
    // CORRIGIDO no LAB-63 (D211). Este campo dizia `motor.ts · apararRedeViaria e
    // aplicarCulDeSac`, e os dois moram em OUTROS arquivos: `motor.ts` é só onde eles são
    // CHAMADOS (linhas 247 e 209). Endereço que leva à chamada e não à definição manda quem
    // recebe a acusação procurar no arquivo errado. Agora há guarda conferindo contra o clone.
    ondeNoMotor:
      "motor-testfit · src/lib/lab/aparo.ts · apararRedeViaria (lido, não tocado) ; " +
      "motor-testfit · src/lib/lab/formatos.ts · aplicarCulDeSac (lido, não tocado)",
    aProvaQueSustenta: "LAB-55 · docs/provas/LAB-55/via-sobre-a-faixa.json (D188)",
    oPredicadoMedido: "tipo `via-sobre-lote`",
    casa: (v) => v.tipo === "via-sobre-lote",
  },
  {
    id: "fileira-sem-via-propria",
    emUmaLinha: "a quadra recebe fileira de lote em face que não é rua — a fileira inteira nasce sem frente",
    oQueOMotorFaz:
      "`quadraRet` distribui os lotes sobre a quadra sem perguntar QUAIS faces dela são via. " +
      "Onde a quadra tem rua de um lado só, a fileira do outro lado nasce voltada para o " +
      "miolo, e os lotes ficam a uma profundidade de fileira da rua mais próxima — a que " +
      "serve a fileira gêmea, do outro lado do fundo",
    ondeNoMotor: "motor-testfit · src/lib/lab/formatos.ts · quadraRet (lido, não tocado)",
    aProvaQueSustenta: "LAB-54 (a classe `motor-sem-via-perto`) + a distância medida no LAB-58",
    oPredicadoMedido: "tipo `frente` · lote interno · borda a mais de 0,75 m do contorno de qualquer via",
    casa: (v, lim) => v.tipo === "frente" && !v.externo && (v.dAoContornoDaVia_m ?? -1) > lim.tolDele_m,
  },
  {
    id: "face-de-quadra-limitada-num-eixo-so",
    emUmaLinha: "o teto de face de quadra limita um eixo e deixa o outro correr",
    oQueOMotorFaz:
      "o `comprimentoQuadra` do motor limita a quadra num eixo só. A quadra sai uma tira: " +
      "duas faces curtas dentro do teto e duas faces longas muito acima dele — as curtas " +
      "medem duas profundidades de fileira, as longas correm até onde a gleba deixar",
    ondeNoMotor: "motor-testfit · src/lib/lab/motor.ts · a montagem das quadras (lida, não tocada)",
    aProvaQueSustenta: "LAB-48 §4 + as faces medidas no LAB-53 e no LAB-58",
    oPredicadoMedido:
      "tipo `face-quadra` · a mesma quadra tem face ACIMA do teto e face ABAIXO dele " +
      "(o teto pegou um eixo e não o outro)",
    casa: (v) => v.tipo === "face-quadra" && (v.facesAcimaDoTeto ?? 0) >= 1 && (v.facesAbaixoDoTeto ?? 0) >= 1,
  },
  {
    id: "lote-do-fim-da-fileira-perde-testada-e-nao-profundidade",
    emUmaLinha: "ao fechar a fileira contra a borda da quadra, o corte encurta a TESTADA e preserva o fundo",
    oQueOMotorFaz:
      "o último lote de cada fileira é o resto do corte da fileira contra a borda da quadra. " +
      "O corte sai pela diagonal: o lote fica com cinco vértices, **mantém a profundidade " +
      "inteira da fileira** e paga a diferença na TESTADA, que desce abaixo do mínimo " +
      "declarado. O lote encosta no meio-fio — a frente existe, é curta",
    ondeNoMotor: "motor-testfit · src/lib/lab/formatos.ts · quadraRet, o recorte do último lote (lido, não tocado)",
    aProvaQueSustenta: "LAB-53 (as 11 `testada`) + a geometria medida no LAB-58",
    oPredicadoMedido:
      "tipo `testada` · o lote ENCOSTA (borda a ≤ 0,75 m do contorno) · tem 5 vértices ou mais · " +
      "a maior aresta é a profundidade modal da fileira (±0,5 m) · a testada que ELE mede está " +
      "abaixo do mínimo",
    casa: (v, lim) =>
      v.tipo === "testada" &&
      (v.dAoContornoDaVia_m ?? Number.POSITIVE_INFINITY) <= lim.tolDele_m &&
      (v.verticesDoLote ?? 0) >= 5 &&
      v.maiorAresta_m !== null &&
      v.profundidadeModalDaFileira_m !== null &&
      Math.abs(v.maiorAresta_m - v.profundidadeModalDaFileira_m) <= lim.mesmaProfundidade_m &&
      (v.testadaDele_m ?? Number.POSITIVE_INFINITY) < v.testadaMin_m,
  },
  {
    id: "fileira-encosta-na-via-so-de-esguelha",
    emUmaLinha: "a fileira encosta na via de esguelha: o lote toca a rua num trecho curto, e não pela frente",
    oQueOMotorFaz:
      "a fileira não fica paralela à via que a serve. O lote encosta no leito, mas por um " +
      "trecho curto — longe do meio de qualquer aresta —, e o contato não chega ao mínimo de " +
      "testada. O rótulo que sai do Validator é `frente` porque a amostra dele é o MEIO da " +
      "aresta; o defeito que sobra depois de consertar a amostra é `testada`, no mesmo lote: " +
      "o LAB-54 mediu saldo ZERO para o conserto do rótulo",
    ondeNoMotor: "motor-testfit · src/lib/lab/formatos.ts · quadraRet, a orientação da fileira (lido, não tocado)",
    aProvaQueSustenta: "LAB-54 (classe `regua-amostragem`, com `viraViolacaoDeTestada`) + a distância do LAB-58",
    oPredicadoMedido:
      "tipo `frente` · lote interno · o lote ENCOSTA (borda a ≤ 0,75 m do contorno) · e a testada " +
      "que aparece com amostragem fina está abaixo do mínimo (LAB-54)",
    casa: (v, lim) =>
      v.tipo === "frente" &&
      !v.externo &&
      (v.dAoContornoDaVia_m ?? Number.POSITIVE_INFINITY) <= lim.tolDele_m &&
      (v.testadaComPassoFino_m ?? Number.POSITIVE_INFINITY) < v.testadaMin_m,
  },
];

/** Todos os mecanismos cujo predicado casa — o chamador PARA se vierem dois (dupla contagem). */
export function mecanismosQueCasam(v: ViolacaoMedida, lim: Limites): string[] {
  return MECANISMOS.filter((m) => m.casa(v, lim)).map((m) => m.id);
}

/**
 * A decisão, separada do predicado — para que o caminho do ESTOURO seja alcançável por teste.
 *
 * Os seis predicados se excluem **por construção**: quatro por `tipo` e os dois de `frente`
 * pelos lados opostos dos 0,75 m. Isso é bom e é um problema para a trava: *nenhuma entrada
 * sintética consegue casar dois*, então o `throw` ficaria sem teste e viraria código morto —
 * e código morto é o que não reprova no dia em que um predicado novo deixar de excluir.
 * Com a decisão isolada, a trava a chama com dois ids e vê o estouro.
 */
export function decidirMecanismo(casam: readonly string[], chave: string): string {
  if (casam.length === 1) return casam[0]!;
  if (casam.length === 0) return NAO_NOMEADO;
  throw new Error(
    `${chave}: ${casam.length} mecanismos casam ao mesmo tempo (${casam.join(", ")}) — ` +
      `atribuição que casa duas vezes é dupla contagem, não agrupamento`,
  );
}

/** O mecanismo de uma violação, ou `MECANISMO-NAO-NOMEADO` quando nenhum predicado alcança. */
export function atribuirMecanismo(v: ViolacaoMedida, lim: Limites): string {
  return decidirMecanismo(mecanismosQueCasam(v, lim), v.chave);
}
