/**
 * Os tipos do **contrato de motor v1** — só o que este adaptador lê e escreve.
 *
 * # Por que redeclarar, e o que exatamente foi redeclarado
 *
 * O contrato é de autoria do Archilly Urban Generate
 * (`docs/CONTRATO_MOTOR_v1.md`, repositório `jonny583/urban-create-hub-41d93a4d`)
 * e os tipos normativos vivem em `src/lib/contratos/motor-v1/tipos.ts`, de lá.
 * Importar aqueles tipos daqui acoplaria o Lab ao **layout de código** do
 * Generate: mover um arquivo lá quebraria o Lab, e o Lab não pode fazer o
 * Generate refém do seu próprio layout.
 *
 * A saída deste redesenho não é confiança em cópia. **Quem julga o formato é o
 * validador do dono**: a esteira roda `validarSaidaMotor` do Generate sobre tudo
 * o que sai daqui, e é ele que aprova ou recusa. Se estes tipos divergirem do
 * contrato, a esteira falha alto, com a mensagem em português que o contrato
 * promete — não em silêncio.
 *
 * Ou seja: estes tipos são **conveniência de escrita**, e a régua é de lá.
 *
 * # As duas regras que estes tipos carregam
 *
 * 1. **Metros, sempre.** Todo par de coordenadas está no plano projetado
 *    declarado em `crs`. Lat/lon só existe em `crs.origemGeografica`.
 * 2. **`versao` é `"1"` e é conferida.** Um leitor que aceita qualquer versão
 *    não tem contrato, tem esperança — a frase é do próprio contrato.
 */

/** Um ponto no plano projetado, em metros. */
export interface PontoV1 {
  x: number;
  y: number;
}

export interface CrsV1 {
  codigo: string;
  unidade: "m";
  origemGeografica: { lat: number; lon: number } | null;
}

export type GeometriaV1 =
  | { tipo: "poligono"; aneis: PontoV1[][] }
  | { tipo: "linha"; pontos: PontoV1[] }
  | { tipo: "ponto"; ponto: PontoV1 };

/**
 * Os tipos de restrição do contrato.
 *
 * `desconta` é o campo que mais importa: diz se aquela terra sai da área
 * aproveitável. O contrato é explícito sobre o custo de ignorá-lo — "contar APP
 * como terra vendável é o erro mais caro de um estudo de viabilidade, porque ele
 * infla o VGV e só aparece no protocolo".
 */
export interface RestricaoV1 {
  id: string;
  tipo:
    | "app_hidrica"
    | "app_relevo"
    | "app_outra"
    | "reserva_legal"
    | "faixa_nao_edificavel"
    | "curso_dagua"
    | "zoneamento"
    | "matricula"
    | "outra";
  nome: string;
  baseLegal?: string | null;
  desconta: boolean;
  geometria: GeometriaV1;
}

export interface AtracaoV1 {
  id: string;
  tipo: "via_existente" | "ponto_de_interesse" | "outra";
  nome: string;
  geometria: GeometriaV1;
}

/**
 * Acesso: ponto **ou** segmento, nunca os dois.
 *
 * `sugerido: true` significa que ninguém marcou o acesso e o meio da testada de
 * frente virou palpite. Ele viaja porque é de lá que o traçado costuma partir —
 * palpite que se anuncia é premissa; palpite calado é erro de projeto.
 */
export interface AcessoV1 {
  id: string;
  nome: string;
  papel: string;
  ponto: PontoV1 | null;
  segmento: { a: PontoV1; b: PontoV1 } | null;
  sugerido: boolean;
}

/**
 * `classesDeclividade` e `rampaMaxima_pct` estão em **PORCENTO**.
 *
 * O contrato abre uma seção só para esta armadilha: a lei brasileira mistura as
 * duas escalas na mesma frase — 30 % é o limite de parcelamento (Lei
 * 6.766/1979), mas 25° a 45° é a faixa de uso restrito (Código Florestal), e
 * **25° são 46,6 %, não 25 %**.
 */
export interface RelevoV1 {
  cotas: { x: number; y: number; z: number }[] | null;
  curvas: { cota_m: number; pontos: PontoV1[] }[] | null;
  classesDeclividade: { faixa: string; percentual: number }[] | null;
  fonteMdt: string | null;
  resolucao_m: number | null;
}

export interface ParametrosV1 {
  areaMinLote_m2: number;
  areaAlvoLote_m2: number;
  areaMaxLote_m2: number;
  testadaMinLote_m: number;
  caixaViariaMin_m: number;
  caixaPrincipal_m: number | null;
  caixaSecundaria_m: number | null;
  calcada_m: number | null;
  faceQuadraMax_m: number | null;
  pctAreaPublica: number | null;
  pctAPP: number | null;
  pctLazer: number | null;
  rampaMaxima_pct: number | null;
}

export interface EntradaV1 {
  archilly: {
    schema: "archilly-motor-entrada";
    versao: string;
    origem: string;
    geradoEm: string;
  };
  projeto: { id: string | null; nome: string | null };
  crs: CrsV1;
  gleba: {
    id?: string | null;
    nome?: string | null;
    anel: PontoV1[];
    furos: PontoV1[][];
    area_m2: number;
  };
  acessos: AcessoV1[];
  relevo: RelevoV1 | null;
  restricoes: RestricaoV1[];
  atracoes: AtracaoV1[];
  parametros: ParametrosV1;
  regiaoNormativa: string;
  geo: unknown;
}

/** `hierarquia` do contrato. `largura_m` é a **caixa total** (pista + calçadas). */
export interface ViaV1 {
  id: string;
  hierarquia: "principal" | "secundaria" | "local" | "acesso";
  pontos: PontoV1[];
  largura_m: number;
  rampaMedia_pct: number | null;
}

export interface QuadraV1 {
  id: string;
  pontos: PontoV1[];
  area_m2: number;
}

/**
 * `faceDeRua` é o id da via para a qual o lote faz frente, ou `null`.
 *
 * O contrato manda **preferir `null` a chutar**: "um `faceDeRua` mentiroso é pior
 * que um incompleto, e o Validator mede a frente por conta própria de qualquer
 * forma". Este adaptador obedece — ver `volta.ts`.
 */
export interface LoteV1 {
  id: string;
  quadraId: string;
  pontos: PontoV1[];
  area_m2: number;
  testada_m: number;
  faceDeRua: string | null;
}

/**
 * Os bulbos de cul-de-sac entram como `retorno`, e **não** como via: no Generate
 * eles são superfície de frente — a testada em arco é legal —, e tratá-los como
 * leito reprovaria justamente o lote bem-feito.
 */
export interface AreaEspecialV1 {
  id: string;
  tipo: "lazer" | "doacao" | "verde" | "app" | "institucional" | "retorno";
  pontos: PontoV1[];
  area_m2: number;
}

/**
 * `areaNaoAproveitada_m2` não é enfeite, nas palavras do contrato: "sem ele, um
 * plano que deixa 40 % do terreno parado parece igual a um que aproveita tudo,
 * desde que tenham os mesmos lotes".
 */
export interface QuadroDeAreasV1 {
  areaTotal_m2: number;
  areaPrivativa_m2: number;
  areaViaria_m2: number;
  areaLazer_m2: number;
  areaAPP_m2: number;
  areaNaoAproveitada_m2: number;
}

export interface SaidaV1 {
  archilly: {
    schema: "archilly-motor-saida";
    versao: string;
    origem: string;
    geradoEm: string;
  };
  motor: { nome: string; versao: string; semente: string | null };
  entrada: { projetoId: string | null; glebaId: string | null; contrato: string };
  crs: CrsV1;
  vias: ViaV1[];
  quadras: QuadraV1[];
  lotes: LoteV1[];
  areasEspeciais: AreaEspecialV1[];
  quadroDeAreas: QuadroDeAreasV1;
  parametrosUsados: ParametrosV1;
}

/** A versão do contrato que este adaptador lê e escreve. */
export const CONTRATO = "1";

/**
 * Uma informação do contrato que não atravessou a ponte, com o motivo.
 *
 * O LAB-07 exige a lista item a item, nos dois sentidos. Registrar a perda é
 * metade do trabalho do adaptador: uma ponte que descarta em silêncio faz o
 * julgamento medir um terreno que o usuário não entregou.
 */
export interface Perda {
  /** O caminho do campo no contrato, como `restricoes[2].baseLegal`. */
  campo: string;
  /** O que havia ali, resumido. */
  oQueHavia: string;
  /** Por que não atravessou. */
  motivo: string;
  /** `alta` quando muda o desenho; `media` quando muda a conferência; `baixa` quando é só registro. */
  gravidade: "alta" | "media" | "baixa";
}
