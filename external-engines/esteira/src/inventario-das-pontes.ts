/**
 * O INVENTÁRIO DAS PONTES — um destino para cada campo que o motor publica.
 * (LAB-25)
 *
 * Este arquivo é a lista que o `guarda-da-ponte.ts` confere **contra o motor
 * rodando**. Ele substitui, com função, o que antes eram comentários:
 *
 * > *"o motor não calcula greide"* — `volta.ts`, verdadeiro em 13/09, falso em
 * > 14/09, e ninguém avisou (D98).
 *
 * A diferença não é de forma. Um comentário errado é invisível; uma entrada
 * errada aqui **fica vermelha na primeira rodada do teste**, porque a regra
 * `campo-vazio` não acredita no inventário: ela pergunta ao objeto que o motor
 * devolveu.
 *
 * # Como se mexe aqui
 *
 * Quando o teste reprovar com `campo-novo`, o campo é novo **no motor**. As duas
 * saídas honestas são:
 *
 * 1. **fazer o campo atravessar** — se o contrato tem onde pôr, é o que se faz;
 * 2. **declarar a perda, com o motivo medido** — se o contrato não tem onde pôr,
 *    ou se o valor do motor não serve.
 *
 * O que **não** é saída: apagar a entrada do inventário, nem pôr `interno` em
 * dado de desenho para calar o teste. `interno` é para mecânica do motor —
 * identificador de variante, nota própria, semente —, não para medição.
 *
 * # Quais pontes estão aqui, e qual não está
 *
 * - **`parcelamento`** — `volta.ts`: o `Plano` do motor → SAÍDA v2.
 * - **`symbios`** — `symbios-para-contrato.ts`: `Via`/`Quadra` do adaptador →
 *   SAÍDA v2.
 *
 * O Symbios tem **duas** pontes em série (WASM → `contrato.ts` do adaptador →
 * SAÍDA), e só a segunda está auditada. A primeira recebe vetor cru do WASM, sem
 * campo nomeado para inventariar; o que se pode medir dela está no LAB-02.
 *
 * As duas candidatas do Generate não têm ponte do Lab: elas produzem o contrato
 * por conta própria, no repositório delas. **Não há o que o Lab possa descartar
 * nelas** — e é por isso que a guarda tem duas pontes e não quatro.
 */
import type { Destino, ObjetoAuditado } from "./guarda-da-ponte.ts";

const atravessa = (contrato: string): Destino => ({ tipo: "atravessa", contrato });
const traduzido = (contrato: string, como: string): Destino => ({ tipo: "traduzido", contrato, como });
const perda = (motivo: string): Destino => ({ tipo: "perda", motivo });
const interno = (motivo: string): Destino => ({ tipo: "interno", motivo });

/** Qualquer coisa com campos nomeados, para a guarda ler por nome. */
type Linha = Record<string, unknown>;

// ═══════════════════════════ a ponte do Parcelamento ═══════════════════════

/** `Via` do motor do Laboratório de Parcelamento. */
export const VIA_DO_PARCELAMENTO: Record<string, Destino> = {
  eixo: traduzido(
    "pontos",
    "as duas pontas do eixo viram a polilinha de dois pontos do contrato. O tipo do " +
      "motor é `[Ponto, Ponto]`: a via curva dele já nasce como corda reta, e isso " +
      "está parado na V3 por decisão do chat (03/10)",
  ),
  caixa_m: traduzido(
    "largura_m",
    "a caixa do motor é o corredor que EXISTE — medido, o vértice mais próximo de cada " +
      "lote fica a `caixa_m / 2` do eixo (D52). Somar a calçada declarada punia lote " +
      "bem-feito: 441 de 441 sem frente, no LAB-07",
  ),
  calcada_m: perda(
    "o motor declara a calçada e NÃO a reserva na geometria (medido, LAB-07). Declará-la " +
      "faria o leito invadir o lote",
  ),
  classe: traduzido("hierarquia", "`principal` | `secundaria` do motor → os quatro níveis do contrato"),
  rampaMedia_pct: atravessa("rampaMedia_pct"),
  rampaMaxima_pct: atravessa("rampaMaxima_pct"),
};

/** `Lote` do motor do Laboratório de Parcelamento. */
export const LOTE_DO_PARCELAMENTO: Record<string, Destino> = {
  id: atravessa("id"),
  poligono: traduzido("pontos", "o anel do motor vira a lista de pontos do contrato"),
  area_m2: atravessa("area_m2"),
  testada_m: atravessa("testada_m"),
  faceDeRua: traduzido(
    "faceDeRua",
    "o motor dá o ÍNDICE em `plano.vias` e o contrato quer o id da via; `i` → `V<i+1>`, " +
      "a mesma numeração que esta ponte escreve nas vias. Até o LAB-25 isto saía `null` " +
      "atrás do comentário *“o motor não guarda de qual via”* — falso desde o T02 dele, e " +
      "a quarta vez do mesmo ponto cego (D104)",
  ),
  profundidade_m: perda(
    "o contrato não tem profundidade de lote: ele tem área e testada, e a profundidade " +
      "é derivável do polígono por quem precisar",
  ),
  quadra: traduzido(
    "quadraId",
    "índice 1-based em `plano.quadras` → o id `Q<n>`; `0` é lote sem quadra e vira cadeia vazia",
  ),
  travado: perda(
    "lote travado é lote que o usuário fixou na tela do motor; o contrato não tem o " +
      "conceito de fixação pelo usuário",
  ),
  externo: perda(
    "a distinção loteamento × condomínio não existe no contrato; o lote externo vira " +
      "lote comum e o Generate não saberá que a frente é para via pública de fora",
  ),
};

/** `AreaEspecial` do motor. */
export const AREA_DO_PARCELAMENTO: Record<string, Destino> = {
  tipo: traduzido(
    "tipo",
    "oito tipos do motor → seis do contrato; `comercio` e `estacionamento` não têm " +
      "destino honesto e saem como perda (declarar `institucional` diria que é doação ao município)",
  ),
  poligono: traduzido("pontos", "o anel vira a lista de pontos"),
  area_m2: atravessa("area_m2"),
  travado: perda("fixação pelo usuário, que o contrato não tem"),
  conteudo: perda(
    "o ímã de conteúdo que pediu a área (`lazerEsportivo`, `bosque`…) é vocabulário do " +
      "motor; o contrato só tem o tipo da área",
  ),
};

/** Os bulbos de retorno: círculo no motor, polígono no contrato. */
export const BOLSAO_DO_PARCELAMENTO: Record<string, Destino> = {
  centro: traduzido("pontos", "centro + raio viram um 24-ágono, como `retorno`"),
  raio: traduzido("area_m2", "a área declarada é a do CÍRCULO, ~0,3 % maior que a do 24-ágono"),
};

/** `Metricas` do motor → `quadroDeAreas` do contrato. */
export const METRICAS_DO_PARCELAMENTO: Record<string, Destino> = {
  lotes: interno("a contagem de lotes; o contrato a tem pelo tamanho da lista"),
  areaPrivativa_m2: atravessa("areaPrivativa_m2"),
  areaViaria_m2: atravessa("areaViaria_m2"),
  areaEspecial_m2: traduzido(
    "areaLazer_m2",
    "o motor soma TODAS as especiais num número; o contrato quer lazer e APP separados, " +
      "e esta ponte os recalcula somando as áreas por tipo",
  ),
  areaBruta_m2: atravessa("areaTotal_m2"),
  aproveitamento: interno("razão derivável de privativa ÷ bruta"),
  areaMediaLote_m2: interno("média derivável da lista de lotes"),
  desvioArea: perda(
    "o desvio de área entre lotes é régua do próprio motor; o contrato não tem campo de " +
      "estatística, e o Judge do Generate faz a dele",
  ),
  testadaMedia_m: interno("média derivável da lista de lotes"),
  profundidadeMedia_m: perda("profundidade não existe no contrato (ver `lote.profundidade_m`)"),
};

/** O `Plano` inteiro — para que container novo do motor não passe calado. */
export const PLANO_DO_PARCELAMENTO: Record<string, Destino> = {
  id: interno("identificador da variante dentro da rodada do motor"),
  vias: atravessa("vias"),
  quadras: atravessa("quadras"),
  lotes: atravessa("lotes"),
  areas: traduzido("areasEspeciais", "as que têm tipo no contrato; as outras são perda declarada"),
  bolsoes: traduzido("areasEspeciais", "cada bulbo entra como `retorno`"),
  formato: traduzido(
    "motor.versao",
    "o partido de traçado não tem campo; vai embutido em `motor.versao` para a opção não " +
      "virar anônima na mesa",
  ),
  metricas: traduzido("quadroDeAreas", "ver `METRICAS_DO_PARCELAMENTO`"),
  nota: perda("a nota do motor não tem campo de propósito: quem julga é o Judge do Generate"),
  notas: perda("as notas por critério, pela mesma razão"),
  // ── Este destino estava META-VERDADEIRO, e a metade falsa valia 36 violações ──
  //
  // Ele dizia "os valores SORTEADOS … é o que o contrato pede em
  // `parametrosUsados`", e parava aí. O contrato pede o que o motor **de fato
  // aplicou** — e um MÍNIMO que o motor não escolheu não é coisa que ele aplicou:
  // é limite de quem o declarou. Escrever o sorteado nele fez o Validator do
  // Generate medir o motor **contra o próprio alvo dele**, e reprovar 36 lotes de
  // 316 m² por 1,94 cm (LAB-48, D166). Consertado no LAB-53.
  amostra: traduzido(
    "parametrosUsados",
    "o que o motor ESCOLHEU — `areaAlvoLote_m2` e as três caixas. Os campos MIN/MAX de " +
      "`parametrosUsados` vêm do CONTRATO, nunca do sorteio: o motor mira dentro deles, não os " +
      "declara. O alvo sorteado de `testada` e de `comprimentoQuadra` não tem campo no contrato " +
      "v1 e sai como perda declarada quando difere do limite",
  ),
  avisos: perda("o contrato não tem canal para aviso do motor; os avisos ficam no relatório do Lab"),
  // ── Os dois campos que a guarda pegou em 09/10, e a ponte os largava calada ──
  //
  // Medido: `volta.ts` não menciona nenhum dos dois, e a SAÍDA v2 não tem onde
  // pô-los — procurado `travessia` e `indicador` no contrato do Generate, as
  // únicas citações são da ENTRADA (a restrição e o `eixoDoCurso`), nunca da
  // saída. Então é perda, e perda se DECLARA: era este o silêncio do D98/D104.
  travessias: perda(
    "a SAÍDA v2 não tem campo para travessia sobre área protegida — no contrato do Generate a " +
      "palavra só aparece na ENTRADA, na restrição e no `eixoDoCurso`. O motor diz que a lista " +
      "vazia é a resposta normal e que o que estiver nela é exceção justificada, com vão, ângulo " +
      "e obra; nada disso atravessa. E a travessia é DECISÃO DO JONNY (D58, D61), não minha: ela " +
      "está na página dele, e o Geo ainda não manda o eixo do curso d'água",
  ),
  indicadores: perda(
    "a SAÍDA v2 não tem campo para indicador de terreno por PLANO. O que atravessa é a rampa por " +
      "VIA (`rampaMedia_pct`, `rampaMaxima_pct`); quanto de rua e de lote cai em terreno íngreme, " +
      "e onde está o pior de cada um, não tem onde morar. O motor usa `null` para NÃO MEDIDO — a " +
      "mesma convenção do D23 daqui —, e por isso a perda não vira zero",
  ),
  invalido: perda(
    "*por que esta variante não é uma opção*, em português. O contrato não tem campo de " +
      "recusa do próprio motor; a esteira do Lab já não julga variante inválida",
  ),
};

/**
 * Os objetos auditados da ponte do Parcelamento.
 *
 * @param plano o `Plano` como o motor o devolveu.
 * @param saida a SAÍDA que `voltaParaOContrato` escreveu a partir dele.
 */
export function objetosDaPonteDoParcelamento(plano: Linha, saida: Linha): ObjetoAuditado[] {
  const lista = (o: unknown): Linha[] => (Array.isArray(o) ? (o as Linha[]) : []);
  const especiais = lista(saida["areasEspeciais"]);
  return [
    {
      nome: "via",
      inventario: VIA_DO_PARCELAMENTO,
      doMotor: lista(plano["vias"]),
      doContrato: lista(saida["vias"]),
    },
    {
      nome: "lote",
      inventario: LOTE_DO_PARCELAMENTO,
      doMotor: lista(plano["lotes"]),
      doContrato: lista(saida["lotes"]),
    },
    {
      // Só as áreas que o contrato aceitou: as de tipo sem destino viraram perda
      // declarada, e compará-las linha a linha casaria lote errado com lote errado.
      nome: "area",
      inventario: AREA_DO_PARCELAMENTO,
      doMotor: lista(plano["areas"]),
      doContrato: especiais.filter((a) => String(a["id"] ?? "").startsWith("AE")),
    },
    {
      nome: "bolsao",
      inventario: BOLSAO_DO_PARCELAMENTO,
      doMotor: lista(plano["bolsoes"]),
      doContrato: especiais.filter((a) => String(a["id"] ?? "").startsWith("AR")),
    },
    {
      nome: "metricas",
      inventario: METRICAS_DO_PARCELAMENTO,
      doMotor: [plano["metricas"] as Linha],
      doContrato: [saida["quadroDeAreas"] as Linha],
    },
    {
      nome: "plano",
      inventario: PLANO_DO_PARCELAMENTO,
      doMotor: [plano],
      doContrato: [saida],
    },
  ];
}

// ═════════════════════════════ a ponte do Symbios ══════════════════════════

/** `Via` do adaptador do Symbios. */
export const VIA_DO_SYMBIOS: Record<string, Destino> = {
  id: atravessa("id"),
  tipo: traduzido(
    "hierarquia",
    "o motor distingue contorno × gradiente, que é `principal` × `local`. Usar os dois " +
      "níveis que existem é mais honesto que espalhar pelos quatro do contrato",
  ),
  pontos: atravessa("pontos"),
  faixaDominio_m: atravessa("largura_m"),
  rampaMedia_pct: atravessa("rampaMedia_pct"),
  rampaMaxima_pct: atravessa("rampaMaxima_pct"),
  cotas_m: perda(
    "a cota de cada vértice do eixo — o GREIDE da via. O contrato v2 tem rampa média e " +
      "máxima, e não tem onde pôr o perfil ponto a ponto. É a maior perda desta ponte, e " +
      "quem precisar do greide para terraplenagem precisa dela: está no " +
      "`O_QUE_FALTA_MEDIR_POR_MOTOR.md`",
  ),
  comprimento_m: traduzido(
    "largura_m",
    "entra na conta de `quadroDeAreas.areaViaria_m2` (comprimento × faixa de domínio), " +
      "não num campo da via: o contrato tira o comprimento da polilinha",
  ),
  saiDaGleba: perda(
    "o contrato não tem como a via declarar que sai da gleba — e não precisa: o Validator " +
      "do Generate mede isso por conta própria, com a régua dele",
  ),
  comprimentoForaDaGleba_m: perda(
    "quantos metros do trecho caem fora da gleba, medido por amostragem. Mesma razão: é " +
      "diagnóstico do Lab, e o Validator tem a régua dele",
  ),
};

/** `Quadra` do adaptador do Symbios. */
export const QUADRA_DO_SYMBIOS: Record<string, Destino> = {
  id: atravessa("id"),
  pontos: atravessa("pontos"),
  area_m2: atravessa("area_m2"),
  perimetro_m: perda("o contrato não tem perímetro de quadra; ele é derivável do anel"),
  fracaoDentroDaGleba: perda(
    "fração do polígono dentro da gleba, de 0 a 1 — diagnóstico do recorte do Lab (LAB-05). " +
      "O Validator mede a sobreposição com a divisa por conta própria",
  ),
};

/** Os objetos auditados da ponte do Symbios. */
export function objetosDaPonteDoSymbios(
  vias: readonly Linha[],
  quadras: readonly Linha[],
  saida: Linha,
): ObjetoAuditado[] {
  const lista = (o: unknown): Linha[] => (Array.isArray(o) ? (o as Linha[]) : []);
  return [
    { nome: "via", inventario: VIA_DO_SYMBIOS, doMotor: vias, doContrato: lista(saida["vias"]) },
    {
      nome: "quadra",
      inventario: QUADRA_DO_SYMBIOS,
      doMotor: quadras,
      doContrato: lista(saida["quadras"]),
    },
  ];
}

/** As pontes que esta guarda cobre, pelo nome que aparece no achado. */
export const PONTES_AUDITADAS = ["parcelamento", "symbios"] as const;
