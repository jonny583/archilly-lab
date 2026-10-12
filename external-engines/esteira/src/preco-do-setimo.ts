/**
 * O PREÇO DO SÉTIMO MECANISMO, EM LOTES — e ele é simulação, não conserto. (LAB-94, item 027)
 *
 * # A frase que ficou pendurada, e quem a escreveu fui eu
 *
 * O LAB-78 nomeou o sétimo mecanismo — **o transbordo do canto**: a fileira externa do motor
 * continua plantando **além da ponta** da face que a ida declara, e ali não há rua declarada
 * nenhuma, então o Validator do Generate acusa `frente` com razão. E a `FILA.md` fechou a seção
 * dizendo, com todas as letras:
 *
 * > *"**Quantos lotes se perdem é medição que este prompt não fez** — e prometer o número sem
 * > medir seria a classe do D133."*
 *
 * Duas linhas acima dela mora a outra metade, e ela é igualmente sem medição: *"encurtá-la ao
 * fim da rua perde esses lotes **e zera a violação**"*.
 *
 * > **Uma decisão que espera um número que ninguém mediu não está esperando uma pessoa: está
 * > esperando uma medição.** A página do Jonny pergunta se a fileira externa encurta, e não
 * > oferece o preço — e ninguém decide entre perder 2 lotes e perder 200 sem saber qual é.
 *
 * # O que esta simulação MEDE, e a frase é curta de propósito
 *
 * > **Os lotes que hoje nascem além da ponta da face declarada, RETIRADOS, e NADA posto no
 * > lugar** — e o veredicto do Validator e os indicadores do juiz sobre esse plano editado.
 *
 * # E o que ela NÃO mede, que é a parte que não se pode esquecer
 *
 * O conserto de verdade mexe no **plantio**, e plantio que para mais cedo pode **replantar
 * diferente** daí para a frente — outra fileira, outro lote, outra área. Esta simulação não
 * replanta nada.
 *
 * > **Isto NÃO é teto nem piso da perda, e dizer que é seria hipótese sobre o plantio** — a
 * > coisa que esta casa não roda. O item 027 avisou antes de eu errar: *"diga o que a simulação
 * > mede e pare aí"*. É a lição do LAB-93 doze horas antes: **leitura de fonte é hipótese;
 * > rodada é dado.**
 *
 * # A régua NÃO é nova, e isso é obrigação do item
 *
 * O *"além da ponta"* é a `alemDaPonta` do `setimo-mecanismo.ts` — a mesma que publicou os
 * **13,18 m** do `v16-e15` no LAB-78. Este módulo **não tem geometria própria**: ele classifica,
 * conta e declara o limite. *Régua nova para uma pergunta que já tinha régua é a segunda régua
 * do D116, e o item a proibiu por escrito.*
 */
import { alemDaPonta, type PontoDaRegua } from "./setimo-mecanismo.ts";

/**
 * O MARCADOR DA FILEIRA EXTERNA, e ele é **do motor**, não meu.
 *
 * O motor nomeia `…-eN` os lotes que ele cria a partir de `facesLoteamento` — a fileira virada
 * para a rua que já existe. Usar o id aqui **não** é classificar pelo nome: o id É a declaração
 * do motor de que aquele lote nasceu daquela face, e é exatamente essa fileira que a pergunta do
 * Jonny ("ela encurta?") trata.
 *
 * **O D161 é o cuidado, e ele está respeitado:** lá eu usei o `-eN` para afirmar *onde* o lote
 * estava (*"todos da beira da rua existente"*) e só **14 de 33** encostavam. *Id serve para dizer
 * de QUEM o lote é; a distância é que diz ONDE ele está* — e por isso cada lote desta medição
 * viaja com os metros ao lado.
 */
export const MARCA_DA_FILEIRA_EXTERNA = /-e\d+$/;

/** Um lote da fileira externa, com os metros que dizem onde ele está. */
export interface LoteDaFileira {
  id: string;
  /** Quantos metros ele avança além da ponta da face declarada. `0` = está dentro dela. */
  alemDaPonta_m: number;
  area_m2: number;
  /** A testada que o motor reporta. */
  testada_m: number;
  /** A via do plano para a qual ele faz frente — `null` é o próprio motor dizendo que não há. */
  faceDeRua: string | null;
}

/** O que as réguas do DONO publicam sobre um plano — antes ou depois da retirada. */
export interface OQueOsDonosDizem {
  lotes: number;
  areaPrivativa_m2: number;
  /** Violações do Validator do Generate, todas. */
  violacoes: number;
  /** Só as do invariante `frente` — é a que o sétimo mecanismo produz. */
  frente: number;
  /** `true` quando o Validator não achou NADA. */
  limpo: boolean;
}

/** O preço numa candidata. */
export interface PrecoDaCandidata {
  candidata: string;
  /** Posição no ranking DELE — a escolha da variante continua sendo do motor. */
  posicaoNoMotor: number;
  notaDoMotor: number;
  /** Quantos lotes a fileira externa tem nesta candidata. */
  daFileiraExterna: number;
  /** Os que morrem na simulação: fileira externa com `alemDaPonta_m > 0`. */
  aMorrer: LoteDaFileira[];
  antes: OQueOsDonosDizem;
  /** `null` quando não houve o que retirar — e `null` aqui é "não simulado", nunca zero. */
  depois: OQueOsDonosDizem | null;
  /**
   * A MESMA simulação, retirando a fileira externa **INTEIRA** — e ela existe por medição.
   *
   * A primeira passada mostrou que a violação de `frente` **não zera** retirando só os lotes
   * além da ponta. Aí a pergunta vira *"o que sobra é da fileira externa ou não?"*, e responder
   * isso contando eu mesmo quem faz frente seria **reimplementar o invariante do Generate** — o
   * que a §4 proíbe com todas as letras.
   *
   * Então a resposta vem pela régua DELE, com uma segunda retirada: se `frente` continua acima
   * de zero com a fileira externa inteira fora, **o que sobra não é da fileira externa**, e o
   * sétimo mecanismo não é a única causa. `null` quando não houve fileira a retirar.
   */
  depoisSemAFileiraToda: OQueOsDonosDizem | null;
  /**
   * Os ids que o Validator publica como EXEMPLO de `frente` depois da retirada.
   *
   * Ele guarda **cinco por tipo**, de propósito — e isto é amostra, nunca contagem. Está aqui
   * para a frase *"o que sobra não é da fileira externa"* ter um id ao lado, e o limite da
   * amostra sai declarado junto.
   */
  exemplosDeFrenteDepois: string[];
  /**
   * A segunda metade da frase da `FILA.md`: *"zera a violação"*.
   *
   * `true` só quando `frente` vai a **zero**; `false` quando sobra alguma; `null` quando não
   * houve retirada e portanto não houve o que medir.
   */
  aViolacaoDeFrenteZerou: boolean | null;
}

/** O preço numa gleba — e a gleba que não declara face recebe o veredicto, não um zero. */
export interface PrecoDaGleba {
  gleba: string;
  /** `false` quando a ida não entrega `facesLoteamento` nenhuma. */
  declaraFace: boolean;
  /**
   * Por que esta gleba não entra na conta, quando não entra.
   *
   * *Gleba sem face declarada não tem "além da face": a pergunta não tem objeto ali, e
   * responder `0 lotes` diria que o mecanismo foi medido e não custou nada.*
   */
  porqueNaoSeAplica: string | null;
  candidatas: PrecoDaCandidata[];
}

/**
 * A fileira externa de um plano, classificada — e cada lote viaja com os metros.
 *
 * `pontosDoLote` vem do plano do Generate (`resultado.lotes[].pontos`), e `a`/`b` são as pontas
 * da face que a ida declarou. A geometria é a `alemDaPonta`, importada: aqui não há conta nova.
 */
export function aFileiraExterna(
  lotes: readonly {
    id: string;
    pontos: readonly PontoDaRegua[];
    area_m2?: number;
    testada_m?: number;
    faceDeRua?: string | null;
  }[],
  a: PontoDaRegua,
  b: PontoDaRegua,
): LoteDaFileira[] {
  return lotes
    .filter((l) => MARCA_DA_FILEIRA_EXTERNA.test(l.id))
    .map((l) => ({
      id: l.id,
      alemDaPonta_m: Number(alemDaPonta(l.pontos, a, b).toFixed(2)),
      area_m2: Number((l.area_m2 ?? 0).toFixed(2)),
      testada_m: Number((l.testada_m ?? 0).toFixed(2)),
      faceDeRua: l.faceDeRua ?? null,
    }));
}

/** Os que a simulação retira: fileira externa que avança além da ponta. */
export function osQueMorrem(fileira: readonly LoteDaFileira[]): LoteDaFileira[] {
  return fileira.filter((l) => l.alemDaPonta_m > 0);
}

/** A conta da rodada — e ela separa "não se aplica" de "custou zero". */
export interface ContaDoPreco {
  glebas: number;
  glebasQueDeclaramFace: number;
  glebasSemFace: number;
  candidatasMedidas: number;
  /** Candidatas em que a simulação retirou pelo menos um lote. */
  candidatasComRetirada: number;
  lotesRetirados: number;
  /** Em quantas candidatas a violação de `frente` foi a zero. */
  zeraramAFrente: number;
  /** Em quantas ela NÃO zerou — a metade da frase que podia estar errada. */
  naoZeraramAFrente: number;
  /** Em quantas o Validator ficou totalmente limpo depois da retirada. */
  ficaramLimpas: number;
  /** Em quantas a `frente` zerou retirando a fileira externa INTEIRA. */
  zeraramComAFileiraToda: number;
  /** Em quantas ela NÃO zerou nem assim — ali o que sobra não é da fileira externa. */
  naoZeraramNemComAFileiraToda: number;
}

export function aConta(glebas: readonly PrecoDaGleba[]): ContaDoPreco {
  const medidas = glebas.flatMap((g) => g.candidatas);
  const comRetirada = medidas.filter((c) => c.aMorrer.length > 0);
  return {
    glebas: glebas.length,
    glebasQueDeclaramFace: glebas.filter((g) => g.declaraFace).length,
    glebasSemFace: glebas.filter((g) => !g.declaraFace).length,
    candidatasMedidas: medidas.length,
    candidatasComRetirada: comRetirada.length,
    lotesRetirados: comRetirada.reduce((t, c) => t + c.aMorrer.length, 0),
    zeraramAFrente: comRetirada.filter((c) => c.aViolacaoDeFrenteZerou === true).length,
    naoZeraramAFrente: comRetirada.filter((c) => c.aViolacaoDeFrenteZerou === false).length,
    ficaramLimpas: comRetirada.filter((c) => c.depois?.limpo === true).length,
    zeraramComAFileiraToda: comRetirada.filter((c) => c.depoisSemAFileiraToda?.frente === 0).length,
    naoZeraramNemComAFileiraToda: comRetirada.filter(
      (c) => (c.depoisSemAFileiraToda?.frente ?? -1) > 0,
    ).length,
  };
}

/** O rótulo da simulação, que é parte da entrega — o item 027 o cobrou por escrito. */
export const O_QUE_A_SIMULACAO_MEDE =
  "os lotes da fileira externa que hoje nascem ALÉM DA PONTA da face que a ida declara, " +
  "RETIRADOS do plano publicado, e NADA posto no lugar — com o Validator e os indicadores do " +
  "Generate rodados sobre esse plano editado";

/** O que ela **não** mede, e isto sai em toda saída dela. */
export const O_QUE_A_SIMULACAO_NAO_MEDE: readonly string[] = [
  "NÃO é o conserto: o conserto mexe no PLANTIO do motor, e plantio que para mais cedo pode " +
    "REPLANTAR diferente daí para a frente. Aqui nada é posto no lugar do que saiu",
  "NÃO é teto nem piso da perda, e chamá-la de um dos dois seria hipótese sobre o plantio — " +
    "a coisa que esta casa não roda. O item 027 avisou antes de eu errar",
  "NÃO recompõe a NOTA DO MOTOR: ela é dele, calculada sobre o `Plano` interno com as " +
    "`metricas` dele. Recalculá-la aqui exigiria reconstruir essas métricas, que é a segunda " +
    "régua do D116 — então a nota e a posição no ranking DELE saem como estão, e o que se move " +
    "é o que as réguas do DONO DO CONTRATO publicam sobre o plano editado",
  "NÃO decide urbanismo: se a fileira externa encurta continua sendo decisão do Jonny. O que " +
    "esta rodada muda é que ele decide com o preço na mão",
];

// ══════════════════════════════════════════════════════════════════════════════
//  A PERGUNTA DO ACABAMENTO — e a resposta mudou de casa no meio da medição
// ══════════════════════════════════════════════════════════════════════════════
//
// O item 027 cruzou esta medição com a do Generate e levantou a hipótese que nenhuma
// das duas casas via sozinha: *"algum dos dezesseis passos de acabamento mata ou arruma
// um lote que nasce além da face declarada, com testada 0 m? Se matar, o preço não é do
// plantio do Parcelamento — é do chassi que ainda não chama o acabamento."*
//
// **E ele disse, com todas as letras, que não estava afirmando: "estou dizendo que não
// sei, e que a sua é a casa que mede isso".** Medido, em três camadas.

/** O critério de um passo do acabamento, lido na ORIGEM — e o que esta casa mediu dele. */
export interface PassoDoAcabamento {
  chave: string;
  /** No que o passo decide — a condição, como ela está escrita no fonte dele. */
  oCriterio: string;
  /** Ele alcança um lote da fileira externa além da face? `null` = não medido. */
  alcancaOsNossos: boolean | null;
  /** Como esta casa sabe disso — e "li o fonte" é uma resposta diferente de "rodei". */
  comoEuSei: "medido-nos-nossos-lotes" | "lido-no-fonte-dele" | "nao-medido";
}

/**
 * A PROCEDÊNCIA da resposta, e ela tem duas profundidades que **discordam** (D294).
 *
 * O item cita a medição que o Generate publicou às 22h18 de 11/10: *"o caminho do motor
 * EXTERNO não chama NENHUM"* passo. **Isso deixou de ser verdade entre o item ser
 * escrito e esta rodada.** Na origem dele a porta **existe e está ligada**; no clone que
 * esta casa compila ela **não existe**.
 *
 * > **O clone não é a origem — e aqui a diferença não é de data, é de capacidade.** A
 * > pergunta do item só se responde por rodada em quem TEM a porta, e o clone desta casa
 * > não tem. *Terceira vez na família do D295, e a primeira em que o que falta no clone é
 * > uma função inteira, não um commit.*
 */
export const A_PORTA_DO_ACABAMENTO = {
  arquivo: "src/lib/engine/acabamento-externo.ts",
  aFuncao: "acabarPlano",
  quemAChama: "src/lib/import/parcelamento-externo.ts — entre a montagem e o Validator",
  comoEstaLigada:
    "atrás de `opcoes.acabamento`, e **o Validator roda DEPOIS dela** — então, com a opção " +
    "ligada, o veredicto passa a ser do plano que o CHASSI entrega, não do que o motor entregou",
  existeNaOrigem: true,
  existeNoCloneQueEstaCasaCompila: false,
  /** Os passos que a porta APLICA, nas chaves dela. */
  passosAplicados: [
    "esquinas",
    "cul-de-sac",
    "esquinas-2a",
    "recorte-bulbo",
    "aparo-na-divisa",
    "repescagem-face",
    "piso-de-area",
    "lote-legal-no-fim",
    "quadra-orfa",
    "revestir-quadras",
    "aparar-quadras",
    "furar-quadras",
    "afastar-leito",
  ],
  /** Os que ela declara FORA, com o motivo no fonte dela. */
  passosFora: ["fundo-variavel", "encurtar-secundarias", "lazer", "prolongar-avenida"],
  /**
   * O item falou de **dezesseis**; a porta que foi entregue aplica **treze** e declara
   * **quatro** fora.
   *
   * Não é contradição: o `024-O-CHASSI.md` contou os passos que **poderiam** rodar sobre um
   * plano de fora (16 de 17), e a porta é a lista do que **roda**. *Número de inventário e
   * número de porta respondem perguntas diferentes, e 13 + 4 = 17 fecha com os dois.*
   */
  aContaFecha: true,
} as const;

/**
 * O critério do `piso-de-area`, **literal**, porque é nele que a hipótese do item vive.
 *
 * ```ts
 * const temFrente = testadaContraVias(l.pontos, superficiesFrente) > 0;
 * if (!temFrente) semFrente++;
 * if (l.area >= areaMin - 1e-6 && temFrente) { mantidos.push(l); continue; }
 * // senão: tenta FUNDIR no melhor vizinho; não fundindo, DESCARTA
 * ```
 *
 * > **O passo não é "piso de área": é piso de área E DE FRENTE.** O nome dele diz uma das
 * > duas condições, e a hipótese do item vive na outra — *o comentário dele é explícito:
 * > "lote sem NENHUMA frente é tão invendável quanto lote abaixo do mínimo".*
 *
 * E é por isso que a resposta tem duas metades que não se misturam: **por área, não
 * alcança; por frente, alcança todos** — e qual das duas saídas (fundir ou descartar)
 * acontece em cada lote **não se sabe sem rodar o passo**, que é o que esta casa não tem.
 */
export const O_CRITERIO_DO_PISO_DE_AREA =
  "mantém o lote só quando `area >= areaMin` **E** `testadaContraVias(pontos, superficiesFrente) > 0`; " +
  "falhando qualquer uma das duas, tenta FUNDIR no melhor vizinho e, não fundindo, DESCARTA";
