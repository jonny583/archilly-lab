/**
 * O contrato do adaptador: o que entra, o que sai, em que unidades.
 *
 * # A regra de unidade
 *
 * **O núcleo é em metros.** Georreferenciamento existe só nas duas bordas: o
 * terreno chega em graus (WGS84, como o contrato `archilly-terreno` do Geo
 * manda) e o GeoJSON de saída volta para graus. Entre as duas bordas, tudo é
 * metro no plano local — nenhuma função deste adaptador vê um grau.
 *
 * # Por que os parâmetros são de urbanismo, e não do motor
 *
 * Quem usa isto pensa em "quadra de 80 por 200 metros" e "rampa de 10 %", não
 * em `minor_road_dist` nem em `max_grade: 0.15`. Os defaults do upstream — via
 * a cada 15 m — **não vazam para fora**: o LAB-00 mediu que eles produzem
 * "quadras" de 97 m² medianos, que é tamanho de lote, não de quadra. A
 * tradução para o vocabulário do motor mora em `parametros.ts`, e é o único
 * lugar onde os nomes do Symbios aparecem.
 */

/** Um ponto no plano local, em metros. */
export interface Ponto {
  x: number;
  y: number;
}

/** Um ponto em graus decimais, WGS84. */
export interface LatLon {
  lat: number;
  lon: number;
}

/**
 * A origem do plano local, no formato que o Generate já usa.
 *
 * Plano tangente local equiretangular, centrado no centróide da gleba — a mesma
 * convenção de `src/lib/import/geo-projecao.ts` do Generate, inclusive o
 * **y crescendo para o SUL** (convenção CAD daquele aplicativo). O Lab
 * reimplementa as fórmulas em vez de importar: o Generate não pode depender do
 * Lab, e o Lab não pode depender do Generate.
 */
export interface Origem {
  lat0: number;
  lon0: number;
  metrosPorGrauLat: number;
  metrosPorGrauLon: number;
}

/** Um anel fechado de coordenadas, em metros locais. */
export type Anel = Ponto[];

/** Polígono com anel externo e, opcionalmente, furos. */
export interface Poligono {
  externo: Anel;
  furos: Anel[];
}

/** Uma curva de nível lida do Geo, já em metros locais. */
export interface CurvaDeNivel {
  cota_m: number;
  pontos: Ponto[];
}

/**
 * Uma restrição que viaja junto com o terreno.
 *
 * No LAB-01 ela é **carga**, não filtro: chega, é contada, sai no diagnóstico, e
 * não recorta nada. O recorte é o LAB-02. Registrar desde já evita que o
 * adaptador tenha de mudar de forma quando o recorte chegar.
 */
export interface Restricao {
  id: string;
  nome: string;
  /** A categoria do contrato do Geo, sem tradução — `app_rio`, `faixa_dominio`… */
  categoria: string;
  /** `true` quando o Geo diz que esta área desconta da área líquida. */
  desconta: boolean;
  area: Poligono;
}

/**
 * O terreno como o adaptador o consome: tudo em metros locais, mais a origem
 * para voltar a graus.
 *
 * Nasce de `lerTerrenoGeo` a partir de um arquivo `archilly-terreno` 1.x, ou à
 * mão, para terreno sintético.
 */
export interface Terreno {
  nome: string;
  origem: Origem;
  /** A poligonal oficial da gleba, em metros locais. */
  gleba: Poligono;
  curvas: CurvaDeNivel[];
  restricoes: Restricao[];
  /** Área da gleba declarada pelo Geo, em m². Informação, nunca cálculo. */
  areaDeclarada_m2: number | null;
  /** Zona UTM anotada pelo Geo, quando houver. Só para registro. */
  zonaUtm: string | null;
  /** Como este terreno chegou até aqui — fica no diagnóstico. */
  procedencia: string;
}

/**
 * Os parâmetros, em unidades do urbanismo.
 *
 * Todos opcionais: `PARAMETROS_PADRAO` preenche o que faltar, com valores de
 * loteamento brasileiro.
 */
export interface Parametros {
  /** Espaçamento entre vias principais, em metros. Padrão 200. */
  espacamentoPrincipal_m?: number;
  /** Espaçamento entre vias locais, em metros. Padrão 80. */
  espacamentoLocal_m?: number;
  /**
   * Rampa máxima ao longo do eixo de uma via, em **porcento**.
   *
   * Padrão 10 %, que é o `LIMITES_TOPOGRAFIA.rampaMaxPct` do Generate — o
   * adaptador não inventa limite próprio quando o produto já tem um. O motor
   * pede fração, e a conversão é uma divisão por 100 em `parametros.ts`.
   */
  rampaMaxima_pct?: number;
  /**
   * Largura da faixa de domínio, em metros — a caixa da via inteira, pista mais
   * calçadas. Padrão 8,4 m, que é o `NORMA_BR.via.caixaMinima` do Generate
   * (6 m de pista + 2 × 1,2 m).
   *
   * No LAB-01 ela **não** é usada para gerar geometria: serve para dimensionar
   * o raio de snap do traçador (duas vias mais perto que uma caixa são a mesma
   * via) e viaja na saída, para o LAB-02 construir a área viária.
   */
  faixaDominio_m?: number;
  /** Passo da grade do mapa de alturas, em metros. Padrão 2. */
  passoGrade_m?: number;
  /** Extrair quadras (Uso C) além da rede viária (Uso B). Padrão `true`. */
  extrairQuadras?: boolean;
}

/** Os parâmetros com todo campo resolvido. */
export type ParametrosResolvidos = Required<Parametros>;

/** Um trecho de via devolvido pelo adaptador. */
export interface Via {
  id: string;
  /**
   * A hierarquia no vocabulário do Generate (`TrechoViario.tipo`): o Symbios
   * distingue contorno de gradiente, e isso mapeia em principal × local.
   */
  tipo: "principal" | "local";
  /** Polilinha do eixo, em metros locais. */
  pontos: Ponto[];
  /** Cota de cada ponto, em metros. Mesmo comprimento de `pontos`. */
  cotas_m: number[];
  comprimento_m: number;
  /** Rampa média do trecho, em porcento. */
  rampaMedia_pct: number;
  /** Maior rampa entre dois pontos consecutivos, em porcento. */
  rampaMaxima_pct: number;
  /** Largura da caixa, repassada dos parâmetros. */
  faixaDominio_m: number;
  /** `true` quando algum ponto do trecho cai fora da gleba. */
  saiDaGleba: boolean;
  /**
   * Quantos metros deste trecho caem fora da gleba.
   *
   * Medido por amostragem ao longo de cada segmento, não por vértice. A diferença
   * não é acadêmica: a primeira versão somava o comprimento INTEIRO de todo trecho
   * que tivesse um só ponto fora, e relatou "100 % das vias fora da gleba" num
   * terreno onde a rede estava quase toda dentro. Um trecho de 300 m que atravessa
   * a divisa por 2 m tem 2 m fora, não 300.
   */
  comprimentoForaDaGleba_m: number;
}

/** Uma quadra devolvida pelo adaptador. */
export interface Quadra {
  id: string;
  /** Perímetro fechado, em metros locais, sentido anti-horário. */
  pontos: Ponto[];
  area_m2: number;
  perimetro_m: number;
  /** Fração do polígono que cai dentro da gleba, de 0 a 1. */
  fracaoDentroDaGleba: number;
}

/** Tempo de parede de cada estágio, em milissegundos, medido no Node. */
export interface Tempos {
  alturas_ms: number;
  vias_ms: number;
  racionalizacao_ms: number;
  quadras_ms: number;
  traducaoDeVolta_ms: number;
  total_ms: number;
}

/** O que o adaptador conta sobre a própria execução. */
export interface Diagnostico {
  terreno: string;
  procedencia: string;
  versaoMotor: string;
  versaoAdaptador: string;
  seed: number;
  parametros: ParametrosResolvidos;
  /** Dimensões da grade de alturas e extensão do mundo do motor. */
  grade: { nx: number; ny: number; celula_m: number; mundo_m: [number, number] };
  /** Células da grade que caíram fora da gleba, de 0 a 1. */
  fracaoGradeForaDaGleba: number;
  areaGleba_m2: number;
  areaDeclarada_m2: number | null;
  /** Cotas mínima e máxima interpoladas, em metros. */
  cotas_m: { min: number; max: number };
  estagios: string[];
  tempos: Tempos;
  /** SHA-256 da saída canônica — é a prova de determinismo. */
  hash: string;
  /** Restrições que viajaram junto, sem recortar nada (LAB-02 recorta). */
  restricoes: { id: string; nome: string; categoria: string; desconta: boolean }[];
  /** Comprimento total de via, em metros. */
  comprimentoTotalVias_m: number;
  /**
   * Trechos com rampa acima do pedido, com a tolerância de
   * `TOLERANCIA_RAMPA_PP` pontos percentuais.
   *
   * A tolerância não é frouxidão: o clamp do motor pousa os trechos **exatamente
   * sobre** o limite, e aí metade deles cai alguns centésimos acima por
   * aritmética de `f32`. Medido no LAB-01, ao longo de uma cadeia o pior caso foi
   * 10,06 % contra 10 % pedidos. Contar isso como violação afogaria em ruído as
   * violações de verdade, que são de outra ordem — e estão nos cruzamentos.
   */
  trechosAcimaDaRampa: number;
  /** A maior rampa de trecho devolvida, em porcento. Sem tolerância nenhuma. */
  rampaMaximaObtida_pct: number;
  /** Fração do comprimento de via que cai fora da gleba, de 0 a 1. */
  fracaoViasForaDaGleba: number;
  /** Fração da área de quadras que cai fora da gleba, de 0 a 1. */
  fracaoQuadrasForaDaGleba: number;
  /** Avisos que não impedem o uso do resultado. */
  avisos: string[];
}

/** O que `gerarRedeViaria` devolve. */
export interface Resultado {
  vias: Via[];
  quadras: Quadra[];
  diagnostico: Diagnostico;
}

export const VERSAO_ADAPTADOR = "0.1.0";

/**
 * Os padrões, em unidades do urbanismo.
 *
 * `espacamentoPrincipal_m` e `espacamentoLocal_m` vêm da medição do LAB-00:
 * 200 × 80 m deu quadras de área mediana 3 439 m² — geometria plausível de
 * loteamento — e ficou 37× mais rápido que os defaults do upstream.
 */
export const PARAMETROS_PADRAO: ParametrosResolvidos = {
  espacamentoPrincipal_m: 200,
  espacamentoLocal_m: 80,
  rampaMaxima_pct: 10,
  faixaDominio_m: 8.4,
  passoGrade_m: 2,
  extrairQuadras: true,
};
