/**
 * O SÉTIMO MECANISMO, SE ELE EXISTIR — motor ou faixa? (LAB-78, item 011)
 *
 * # A pergunta, e por que ela é binária na forma e não no fundo
 *
 * O LAB-59 deixou **quatro** candidatas de Antonina fora, **uma violação cada**, que os seis
 * mecanismos do LAB-58 não nomeiam. A minha própria frase propôs a pergunta:
 *
 * > *"Pode ser um sétimo mecanismo do motor, ou a **largura e a divisa** da faixa do Generate."*
 *
 * O item 011 manda **descobrir qual das duas é** — e avisa, com a §6 na mão, que *a primeira
 * suspeita costuma ser a régua ou a ponte, não o medido*.
 *
 * **E foi exatamente isso que a medição achou primeiro, antes de olhar o motor:** a faixa que o
 * Lab construiu no LAB-48 e no LAB-59 tem **8 m**, e a que o Generate constrói tem
 * `Math.max(8, larguraEntrada / 2)` com `larguraEntrada` em **20** por padrão — ou seja
 * **10 m**. *Mais uma vez o número acusador saiu da minha ponte e não de quem declarou a regra*
 * (D98, D104, D166).
 *
 * # Mas a largura não podia ser a explicação, e a geometria diz por quê
 *
 * `faixaViaPublica` cola o quadrilátero **do lado de FORA da divisa** e o estende para fora por
 * `largura`. A borda de dentro dela **é a divisa**. Então alargar de 8 para 10 m afasta a borda
 * externa — e **não encosta um milímetro mais perto** de um lote que está do lado de dentro.
 *
 * > **Alargar uma faixa que cresce para fora não fecha uma folga que está do lado de dentro.**
 *
 * Por isso a largura entra na medição como **controle**, não como hipótese: ela tem de sair
 * `indiferente`, e se sair diferente disso é a minha geometria que está errada.
 *
 * # A metade que sobrou da hipótese, e é a que tinha corpo: a DIVISA
 *
 * `divisaDoAcesso` devolve **UM segmento** do anel — o mais próximo do ponto de acesso. Se a
 * face entregue atravessa vários segmentos, **a faixa cobre um só**, e um lote plantado na face
 * entregue mas fora da extensão daquele segmento **não tem faixa nenhuma na frente**. Não é
 * largura: é **alcance**.
 *
 * Esta é a diferença que o módulo mede, e ela é falsificável: projeta-se o lote na reta da
 * divisa e pergunta-se se a projeção cai **dentro** de `[a, b]`.
 *
 * # Os veredictos são vocabulário FECHADO, e `nao-decidido` é um deles
 *
 * Balde fechado é o que o D23 proíbe; **balde que não existe** é pior, porque força a régua a
 * escolher um culpado para caber. Quando a evidência não separa, o veredicto diz isso.
 */

/** A medição de um lote acusado, em METROS. `null` é "não medido", nunca zero (D23). */
export interface LoteAcusado {
  /** `<gleba>|<tipo>|<loteId>`, a chave do LAB-58. */
  chave: string;
  candidata: string;
  tipo: "frente" | "testada";
  externo: boolean;
  /** Distância ao contorno de qualquer via **interna**. */
  dAoContornoDaVia_m: number | null;
  /** Distância ao segmento da face entregue — a rua que a entrada declara. */
  aoSegmentoDaFaceEntregue_m: number | null;
  /** A testada que o motor reporta, com a amostragem dele. */
  testadaDele_m: number | null;
  /** A mesma testada remedida com passo fino. */
  testadaComPassoFino_m: number | null;
  testadaMin_m: number | null;
  /** A projeção do lote na reta da divisa cai DENTRO de `[a, b]`? `null` = não medido. */
  projecaoDentroDaDivisa: boolean | null;
  /**
   * Quantos METROS o lote avança ALÉM da ponta da face declarada. `0` = está dentro dela.
   *
   * É o número que decidiu este prompt. `projecaoDentroDaDivisa: false` diz *que* o lote está
   * fora; este diz **quanto**, e sem o quanto eu ia atribuir a culpa ao vizinho errado.
   */
  alemDaFaceDeclarada_m: number | null;
  /** Que fração da face declarada a faixa cobre. 100 = cobre inteira. */
  coberturaDaFacePct: number | null;
  /** Distância do lote à faixa de 8 m — a que o LAB-48 construiu. */
  aFaixaDe8_m: number | null;
  /** Distância do lote à faixa de 10 m — a que o GENERATE constrói. */
  aFaixaDe10_m: number | null;
}

/**
 * De quem é a violação. **Fechado**, e as duas últimas não são "motor" nem "faixa":
 *
 * - `faixa-alcance` — a faixa cobre **menos** da face declarada do que a face tem. **Achado para o
 *   Generate** — e, medido em Antonina, ela cobre **100 %**, então este veredicto saiu VAZIO;
 * - `motor-transbordo-do-canto` — **o sétimo mecanismo, e é este.** O lote avança ALÉM da ponta
 *   da face declarada e continua alguns metros na face VIZINHA, que a ida não declarou como face
 *   de loteamento. Não há rua ali, então não pode haver frente. **Dono: o motor**;
 * - `faixa-largura` — alargar de 8 para 10 m resolveria. *Controle da medição: tem de sair
 *   vazio, porque a faixa cresce para fora*;
 * - `motor-recuo` — o lote está plantado com folga da divisa, e nenhuma largura de faixa a
 *   fecha. **Sétimo mecanismo**, e o conserto se propõe sem executar;
 * - `motor-testada-curta` — há contato, mas o comprimento dele é uma lasca. **Sétimo
 *   mecanismo**, de outra forma;
 * - `amostragem-da-testada` — o motor mede a testada com passo grosso e se acusa sozinho: com
 *   passo fino o lote **passa**. Não é mecanismo de plantio nem faixa;
 * - `nao-decidido` — a evidência não separa. Dizer isso é medição; escolher um culpado para
 *   caber não é.
 */
export const VEREDICTOS = [
  "faixa-alcance",
  "faixa-largura",
  "motor-transbordo-do-canto",
  "motor-recuo",
  "motor-testada-curta",
  "amostragem-da-testada",
  "nao-decidido",
] as const;
export type Veredicto = (typeof VEREDICTOS)[number];

/** De qual repositório é o conserto, se houver. */
export const DONOS = ["generate", "motor-testfit", "nenhum", "nao-decidido"] as const;
export type Dono = (typeof DONOS)[number];

export interface VereditoDoLote {
  chave: string;
  candidata: string;
  veredicto: Veredicto;
  dono: Dono;
  /** A frase com os METROS — o item 011 cobra a distância, não a contagem. */
  aEvidencia: string;
}

/**
 * A folga abaixo da qual duas geometrias se consideram **em contato**.
 *
 * Declarada aqui e não enterrada: um lote a 0,01 m de uma via encosta nela para qualquer
 * efeito prático de projeto, e um a 0,2 m não. **Este número é do Lab**, não do Generate — e
 * por isso ele é parâmetro de toda função deste módulo, nunca literal no corpo.
 */
export const CONTATO_m = 0.05;

/**
 * Decide de quem é a violação de UM lote.
 *
 * A ordem dos testes é deliberada, e cada um só dispara com a evidência que o sustenta:
 *
 * 1. **a amostragem primeiro** — porque quando o passo fino aprova o lote, não há violação de
 *    plantio nem de faixa para atribuir a ninguém; discutir mecanismo aqui seria procurar
 *    culpado para um número que o próprio motor desmente;
 * 2. **o alcance da faixa depois** — é a única hipótese que explica um lote **sobre** a face
 *    entregue e **longe** de qualquer via, e é falsificável pela projeção;
 * 3. **a largura como CONTROLE** — tem de sair vazia (a faixa cresce para fora);
 * 4. **o motor por último**, e só com a folga medida na mão.
 */
export function deQuemEhAViolacao(l: LoteAcusado, contato_m = CONTATO_m): VereditoDoLote {
  const base = { chave: l.chave, candidata: l.candidata };
  const m = (v: number | null): string => (v === null ? "NÃO MEDIDO" : `${v} m`);

  // 1 · O motor se acusa sozinho pela amostragem: com passo fino o lote passa.
  if (
    l.tipo === "testada" &&
    l.testadaDele_m !== null &&
    l.testadaComPassoFino_m !== null &&
    l.testadaMin_m !== null &&
    l.testadaDele_m < l.testadaMin_m &&
    l.testadaComPassoFino_m >= l.testadaMin_m
  ) {
    return {
      ...base,
      veredicto: "amostragem-da-testada",
      dono: "nenhum",
      aEvidencia:
        `o motor reporta testada de ${l.testadaDele_m} m contra o mínimo de ${l.testadaMin_m} m, e ` +
        `a MESMA função dele com passo fino devolve ${l.testadaComPassoFino_m} m — o lote PASSA. ` +
        "A violação é do passo da amostragem, não do plantio nem da faixa: não há o que consertar " +
        "em motor nenhum, e atribuí-la a um mecanismo seria nomear um culpado para um número que o " +
        "próprio motor desmente",
    };
  }

  // 2 · O ALCANCE da faixa — e ele só é do Generate se a faixa cobrir MENOS que a face.
  //
  // **Esta condição é o conserto do meu próprio erro neste prompt.** A primeira versão dizia
  // `faixa-alcance` sempre que a projeção caísse fora da divisa, e ia publicar um achado contra
  // o Generate em dois lotes. A cobertura medida é **100 %**: a faixa cobre a face declarada
  // inteira. Quem estava fora não era a faixa — era o LOTE, plantado além da ponta da face.
  if (
    l.coberturaDaFacePct !== null &&
    l.coberturaDaFacePct < 100 &&
    l.projecaoDentroDaDivisa === false
  ) {
    return {
      ...base,
      veredicto: "faixa-alcance",
      dono: "generate",
      aEvidencia:
        `a faixa cobre ${l.coberturaDaFacePct} % da face declarada e a projeção do lote cai fora ` +
        "da extensão dela: há face entregue sem faixa na frente, e é ALCANCE, não largura",
    };
  }

  // 2-B · O TRANSBORDO DO CANTO — o sétimo mecanismo, e a medição o nomeou aqui.
  if (
    l.alemDaFaceDeclarada_m !== null &&
    l.alemDaFaceDeclarada_m > contato_m &&
    l.coberturaDaFacePct !== null &&
    l.coberturaDaFacePct >= 100
  ) {
    return {
      ...base,
      veredicto: "motor-transbordo-do-canto",
      dono: "motor-testfit",
      aEvidencia:
        `a faixa cobre ${l.coberturaDaFacePct} % da face declarada — ela NÃO é curta — e o lote ` +
        `avança ${l.alemDaFaceDeclarada_m} m ALÉM da ponta dessa face, virando o canto para a face ` +
        `vizinha, que a ida NÃO declarou como face de loteamento. Ele fica a ` +
        `${m(l.aoSegmentoDaFaceEntregue_m)} da face declarada e a ${m(l.dAoContornoDaVia_m)} de via ` +
        "interna: não há rua na frente dele porque ninguém declarou rua ali. A fileira externa " +
        "transborda o canto",
    };
  }

  // 3 · CONTROLE: a largura resolveria? Não pode, porque a faixa cresce para FORA da divisa.
  if (l.aFaixaDe8_m !== null && l.aFaixaDe10_m !== null && l.aFaixaDe8_m > contato_m && l.aFaixaDe10_m <= contato_m) {
    return {
      ...base,
      veredicto: "faixa-largura",
      dono: "generate",
      aEvidencia:
        `a faixa de 8 m deixa o lote a ${m(l.aFaixaDe8_m)} e a de 10 m o alcança (${m(l.aFaixaDe10_m)}). ` +
        "ISTO NÃO DEVIA ACONTECER: a faixa cresce para FORA da divisa, e alargá-la não aproxima a " +
        "borda de dentro. Se este veredicto saiu, a geometria a conferir é a MINHA",
    };
  }

  // 4 · O motor. Duas formas, e a folga medida separa-as.
  const encosta = l.dAoContornoDaVia_m !== null && l.dAoContornoDaVia_m <= contato_m;
  if (
    encosta &&
    l.testadaComPassoFino_m !== null &&
    l.testadaMin_m !== null &&
    l.testadaComPassoFino_m > 0 &&
    l.testadaComPassoFino_m < l.testadaMin_m
  ) {
    return {
      ...base,
      veredicto: "motor-testada-curta",
      dono: "motor-testfit",
      aEvidencia:
        `o lote ENCOSTA na via (${m(l.dAoContornoDaVia_m)}) e o contato mede ${l.testadaComPassoFino_m} m ` +
        `contra o mínimo de ${l.testadaMin_m} m — uma lasca, não uma testada. Há frente geométrica e ` +
        "não há frente de projeto: o plantio produz um encosto de canto. Nenhuma faixa conserta " +
        "isto, porque o lote já toca a via",
    };
  }

  if (
    l.projecaoDentroDaDivisa === true &&
    l.aoSegmentoDaFaceEntregue_m !== null &&
    l.aoSegmentoDaFaceEntregue_m > contato_m &&
    l.aFaixaDe10_m !== null &&
    l.aFaixaDe10_m > contato_m
  ) {
    return {
      ...base,
      veredicto: "motor-recuo",
      dono: "motor-testfit",
      aEvidencia:
        `a faixa ESTÁ na frente do lote (a projeção cai dentro da divisa) e ele fica a ` +
        `${m(l.aoSegmentoDaFaceEntregue_m)} dela, com a faixa de 10 m ainda a ${m(l.aFaixaDe10_m)}. ` +
        "O plantio deixa uma folga que nenhuma largura fecha, porque a folga está do lado de DENTRO: " +
        "é recuo do plantio",
    };
  }

  return {
    ...base,
    veredicto: "nao-decidido",
    dono: "nao-decidido",
    aEvidencia:
      `a evidência não separa: face entregue a ${m(l.aoSegmentoDaFaceEntregue_m)}, via a ` +
      `${m(l.dAoContornoDaVia_m)}, faixa de 10 m a ${m(l.aFaixaDe10_m)}, testada fina ` +
      `${m(l.testadaComPassoFino_m)}, projeção na divisa ` +
      `${l.projecaoDentroDaDivisa === null ? "NÃO MEDIDA" : String(l.projecaoDentroDaDivisa)}. ` +
      "Escolher um culpado para caber seria o contrário de medir",
  };
}

export interface ContaDosVereditos {
  lotes: number;
  porVeredicto: Record<string, number>;
  porDono: Record<string, number>;
  /** A frase para o relatório e o recado: ela DIZ a conta, porque a conta é a resposta. */
  comoSeDiz: string;
}

/**
 * A conta, e ela **fecha**: a soma por veredicto é o número de lotes.
 *
 * *Conferência que não publica o tamanho do universo que leu passa lendo zero* — a lição do
 * LAB-76, aplicada aqui porque esta medição tem **quatro** itens e a tentação de falar das
 * "três com a mesma forma" e perder a quarta é exatamente o D133.
 */
export function contarOsVereditos(vs: readonly VereditoDoLote[]): ContaDosVereditos {
  const porVeredicto: Record<string, number> = {};
  const porDono: Record<string, number> = {};
  for (const v of vs) {
    porVeredicto[v.veredicto] = (porVeredicto[v.veredicto] ?? 0) + 1;
    porDono[v.dono] = (porDono[v.dono] ?? 0) + 1;
  }
  const pedacos = Object.entries(porVeredicto)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, n]) => `${n} ${k}`);
  return {
    lotes: vs.length,
    porVeredicto,
    porDono,
    comoSeDiz: `${vs.length} lotes acusados · ${pedacos.join(" · ")}`,
  };
}

/** A soma por veredicto bate com o número de lotes? Partição que não fecha não é partição (D212). */
export function aContaFecha(c: ContaDosVereditos): boolean {
  const soma = Object.values(c.porVeredicto).reduce((s, n) => s + n, 0);
  const somaDonos = Object.values(c.porDono).reduce((s, n) => s + n, 0);
  return soma === c.lotes && somaDonos === c.lotes;
}
