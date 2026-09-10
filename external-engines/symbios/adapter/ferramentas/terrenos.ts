/**
 * Biblioteca de geração de terrenos de prova no contrato `archilly-terreno` 1.1.
 *
 * O CLI que grava os arquivos é `gerar-terrenos.ts`; a escada de tamanho da
 * seção 4 do prompt é gerada em memória por `medir.ts`. As duas usam o mesmo
 * `gerar`, para que terreno de arquivo e terreno de escada saiam pelo mesmo
 * caminho — se divergissem, a escada mediria outra coisa.
 *
 * Gera os terrenos de prova do LAB-01 no contrato `archilly-terreno` 1.1.
 *
 * # Por que este arquivo existe, e o que ele NÃO é
 *
 * O prompt do LAB-01 manda exportar os estudos de prova do Geo
 * (`src/lib/geo/relatorio/__tests__/estudos-de-prova.ts`) no contrato e copiá-los
 * para cá. Ao abrir aquele arquivo, **os estudos não têm geometria**: são entradas
 * de dossiê e de prancha — `SinteseTerreno` com área, perímetro, contagem de
 * vértices, restrições e relevo resumido, mas `vertices: []`, testadas com
 * coordenadas de exemplo (`[-48.71, -25.41]`) e mapa substituído por um PNG de
 * 1×1. Eles provam a **formatação** dos dois entregáveis pagos, não a geometria.
 *
 * Exportar o que não existe não é possível. O que se faz aqui, então, é honesto e
 * está registrado em cada arquivo gerado: os **números** dos estudos `pequeno` e
 * `completo` são reais e vêm de lá — área, perímetro, contagem de vértices, zona
 * UTM, municipio/UF, matrícula, CAR, as três restrições com suas áreas, cota
 * mínima e máxima, equidistância das curvas, as duas zonas. A **geometria** é
 * construída para casar com esses números. Cada arquivo diz isso no campo
 * `procedencia`, e o relatório repete.
 *
 * Os dois sintéticos (10 ha plano e 50 ha ondulado) são declaradamente
 * inventados, e existem para dar a escada de tamanho da seção 4 do prompt.
 *
 * # As curvas de nível são curvas de verdade
 *
 * O relevo de cada terreno é uma função analítica, e as curvas são extraídas dela
 * por *marching squares* numa grade fina. Não são polilinhas decorativas: são as
 * isolinhas da superfície. Isso importa porque o adaptador vai **reinterpolar** as
 * curvas de volta numa grade, e só com isolinhas verdadeiras a comparação entre a
 * rampa que sai do motor e a declividade da superfície original quer dizer algo.
 */

/** Graus decimais, `[lon, lat]`. */
type Posicao = [number, number];

/** Relevo analítico: cota em metros, dadas coordenadas locais em metros. */
type Relevo = (x: number, y: number) => number;

// ------------------------------------------------------ plano local ↔ graus
//
// As mesmas fórmulas de `src/geo.ts`, repetidas aqui de propósito: este gerador é
// uma ferramenta autônoma, e fazê-lo importar o adaptador criaria a situação
// ridícula de o terreno de prova depender do código que ele existe para provar.

const metrosPorGrauLat = (latGraus: number) => {
  const lat = (latGraus * Math.PI) / 180;
  return (
    111132.92 - 559.82 * Math.cos(2 * lat) + 1.175 * Math.cos(4 * lat) - 0.0023 * Math.cos(6 * lat)
  );
};
const metrosPorGrauLon = (latGraus: number) => {
  const lat = (latGraus * Math.PI) / 180;
  return 111412.84 * Math.cos(lat) - 93.5 * Math.cos(3 * lat) + 0.118 * Math.cos(5 * lat);
};

interface Base {
  lat0: number;
  lon0: number;
  mLat: number;
  mLon: number;
}

const base = (lat0: number, lon0: number): Base => ({
  lat0,
  lon0,
  mLat: metrosPorGrauLat(lat0),
  mLon: metrosPorGrauLon(lat0),
});

/** Metros locais (x leste, y sul) → graus. */
const paraGraus = (b: Base, x: number, y: number): Posicao => [
  Number((b.lon0 + x / b.mLon).toFixed(9)),
  Number((b.lat0 - y / b.mLat).toFixed(9)),
];

// ------------------------------------------------------------------ geometria

const areaDe = (anel: { x: number; y: number }[]): number => {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2);
};

const perimetroDe = (anel: { x: number; y: number }[]): number => {
  let d = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    d += Math.hypot(q.x - p.x, q.y - p.y);
  }
  return d;
};

/**
 * Polígono irregular de `n` vértices com a área pedida.
 *
 * Raio variável por uma soma de senos, com semente fixa: a forma precisa ser
 * irregular (gleba retangular esconde problema de borda) e **reprodutível** (um
 * terreno de prova que muda a cada geração não prova nada). Depois de montado, o
 * polígono é escalado para a área bater exatamente.
 */
function glebaIrregular(n: number, area_m2: number, semente: number): { x: number; y: number }[] {
  const bruto: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r =
      1 +
      0.22 * Math.sin(t * 3 + semente) +
      0.13 * Math.sin(t * 5 - semente * 2) +
      0.07 * Math.sin(t * 8 + semente * 3);
    // Achatamento em y: gleba real raramente é circular.
    bruto.push({ x: Math.cos(t) * r, y: Math.sin(t) * r * 0.72 });
  }
  const k = Math.sqrt(area_m2 / areaDe(bruto));
  return bruto.map((p) => ({ x: p.x * k, y: p.y * k }));
}

// ----------------------------------------------------------------- isolinhas

/**
 * Extrai as isolinhas de `cota` por *marching squares*.
 *
 * Devolve segmentos soltos, que `costurar` junta em polilinhas. Os casos de
 * sela (5 e 10) são resolvidos pela média central — a escolha padrão, e a que
 * evita isolinha que se cruza.
 */
function segmentosDaIsolinha(
  relevo: Relevo,
  cota: number,
  caixa: { minX: number; minY: number; maxX: number; maxY: number },
  passo: number,
): [number, number, number, number][] {
  const segs: [number, number, number, number][] = [];
  const interpolar = (xa: number, ya: number, za: number, xb: number, yb: number, zb: number) => {
    const t = Math.abs(zb - za) < 1e-12 ? 0.5 : (cota - za) / (zb - za);
    return [xa + (xb - xa) * t, ya + (yb - ya) * t] as [number, number];
  };

  for (let y = caixa.minY; y < caixa.maxY; y += passo) {
    for (let x = caixa.minX; x < caixa.maxX; x += passo) {
      const x2 = x + passo;
      const y2 = y + passo;
      // Cantos no sentido: 0 = (x,y), 1 = (x2,y), 2 = (x2,y2), 3 = (x,y2).
      const z = [relevo(x, y), relevo(x2, y), relevo(x2, y2), relevo(x, y2)];
      let caso = 0;
      for (let i = 0; i < 4; i++) if (z[i]! > cota) caso |= 1 << i;
      if (caso === 0 || caso === 15) continue;

      const arestas = {
        b: () => interpolar(x, y, z[0]!, x2, y, z[1]!),
        d: () => interpolar(x2, y, z[1]!, x2, y2, z[2]!),
        t: () => interpolar(x2, y2, z[2]!, x, y2, z[3]!),
        e: () => interpolar(x, y2, z[3]!, x, y, z[0]!),
      };
      const liga = (a: () => [number, number], b2: () => [number, number]) => {
        const p = a();
        const q = b2();
        segs.push([p[0], p[1], q[0], q[1]]);
      };

      switch (caso) {
        case 1: case 14: liga(arestas.e, arestas.b); break;
        case 2: case 13: liga(arestas.b, arestas.d); break;
        case 3: case 12: liga(arestas.e, arestas.d); break;
        case 4: case 11: liga(arestas.d, arestas.t); break;
        case 6: case 9:  liga(arestas.b, arestas.t); break;
        case 7: case 8:  liga(arestas.t, arestas.e); break;
        case 5: {
          // Sela: a média central decide qual par de cantos se conecta.
          const centro = (z[0]! + z[1]! + z[2]! + z[3]!) / 4;
          if (centro > cota) { liga(arestas.e, arestas.t); liga(arestas.b, arestas.d); }
          else { liga(arestas.e, arestas.b); liga(arestas.d, arestas.t); }
          break;
        }
        case 10: {
          const centro = (z[0]! + z[1]! + z[2]! + z[3]!) / 4;
          if (centro > cota) { liga(arestas.e, arestas.b); liga(arestas.d, arestas.t); }
          else { liga(arestas.e, arestas.t); liga(arestas.b, arestas.d); }
          break;
        }
      }
    }
  }
  return segs;
}

/** Junta segmentos soltos em polilinhas, emendando pontas coincidentes. */
function costurar(
  segs: [number, number, number, number][],
  tolerancia: number,
): [number, number][][] {
  const chave = (x: number, y: number) =>
    `${Math.round(x / tolerancia)}:${Math.round(y / tolerancia)}`;
  const porPonta = new Map<string, number[]>();
  segs.forEach(([x1, y1, x2, y2], i) => {
    for (const k of [chave(x1, y1), chave(x2, y2)]) {
      const l = porPonta.get(k);
      if (l) l.push(i);
      else porPonta.set(k, [i]);
    }
  });

  const usado = new Uint8Array(segs.length);
  const linhas: [number, number][][] = [];

  for (let i = 0; i < segs.length; i++) {
    if (usado[i]) continue;
    usado[i] = 1;
    const [x1, y1, x2, y2] = segs[i]!;
    const linha: [number, number][] = [
      [x1, y1],
      [x2, y2],
    ];

    // Cresce para os dois lados até não achar vizinho livre.
    for (const frente of [true, false]) {
      for (;;) {
        const ponta = frente ? linha[linha.length - 1]! : linha[0]!;
        const vizinhos = porPonta.get(chave(ponta[0], ponta[1])) ?? [];
        const j = vizinhos.find((v) => !usado[v]);
        if (j === undefined) break;
        usado[j] = 1;
        const s = segs[j]!;
        const aPerto = Math.hypot(s[0] - ponta[0], s[1] - ponta[1]) < tolerancia;
        const proximo: [number, number] = aPerto ? [s[2], s[3]] : [s[0], s[1]];
        if (frente) linha.push(proximo);
        else linha.unshift(proximo);
      }
    }
    // Polilinha de dois pontos é resíduo de célula isolada, não curva de nível.
    if (linha.length >= 3) linhas.push(linha);
  }
  return linhas;
}

// ------------------------------------------------------------------ terrenos

export interface Receita {
  id: string;
  nome: string;
  procedencia: string;
  lat0: number;
  lon0: number;
  vertices: number;
  area_m2: number;
  semente: number;
  relevo: Relevo;
  /**
   * Faixa de cota a que a superfície é mapeada, `[mínima, máxima]`.
   *
   * Sem isto, a amplitude que sai de `ondulado` ou de `planoInclinado` é o que a
   * fórmula der — e os estudos de prova declaram cota mínima e máxima EXATAS. O
   * mapeamento afim ajusta a superfície à faixa declarada sem mudar a forma do
   * relevo, que é o que alimenta o campo tensorial.
   */
  normalizarPara: [number, number];
  equidistancia_m: number;
  municipio: string;
  uf: string;
  zonaUtm: string;
  rural: boolean;
  areaDocumento_m2: number | null;
  matricula?: string;
  numeroCar?: string;
  certificacaoSigef?: string;
  /** Restrições a gerar: fração da área da gleba e onde colocar. */
  restricoes?: {
    tipo: "app" | "reserva_legal" | "restricao";
    id: string;
    nome: string;
    categoria: string;
    baseLegal?: string;
    area_m2: number;
    /** Centro relativo ao raio equivalente da gleba, de -1 a 1. */
    centro: [number, number];
  }[];
  zonas?: { zona: string; sigla: string; loteMinimo_m2: number; testadaMinima_m: number }[];
}

/** Plano inclinado: a rampa mais simples que não degenera o campo tensorial. */
export const planoInclinado = (cotaBase: number, pctX: number, pctY: number): Relevo => (x, y) =>
  cotaBase + (x * pctX) / 100 + (y * pctY) / 100;

/** Relevo ondulado: vale central, dois espigões, e uma inclinação geral. */
export const ondulado =
  (cotaBase: number, amplitude: number, escala: number): Relevo =>
  (x, y) =>
    cotaBase +
    amplitude *
      (0.55 * Math.sin((x / escala) * 1.6) * Math.cos((y / escala) * 1.1) +
        0.3 * Math.sin((x / escala) * 0.7 + (y / escala) * 0.5) +
        0.15 * Math.cos((y / escala) * 2.3)) +
    (y / escala) * amplitude * 0.18;

export const RECEITAS: Receita[] = [
  {
    id: "pequeno",
    nome: "Lote da Rua das Acácias",
    procedencia:
      'Números do estudo de prova "pequeno" do Archilly Geo ' +
      "(src/lib/geo/relatorio/__tests__/estudos-de-prova.ts, SINTESE_PEQUENA): " +
      "área 450 m², 4 vértices, UTM 22S, Antonina/PR, sem restrições e relevo nulo. " +
      "Aquele estudo NÃO tem geometria (vertices: [], testadas com coordenadas de " +
      "exemplo), então o retângulo de 15 × 30 m foi construído para a área bater " +
      "exatamente. As testadas do estudo são 15 m e 29 m; o perímetro declarado lá " +
      "é 88 m e aqui sai 90 m, pela mesma razão. Relevo: o estudo diz relevo nulo, " +
      "e um terreno plano perfeito degenera o campo tensorial (limitação declarada " +
      "pelo upstream), então foi posta uma rampa suave de 1,5 % — registrada como " +
      "acréscimo do Lab. TESTE DE SANIDADE: pequeno demais para rede viária.",
    lat0: -25.41,
    lon0: -48.7,
    vertices: 4,
    area_m2: 450,
    semente: 1,
    relevo: planoInclinado(8.4, 1.5, 0.6),
    // Rampa de 1,5 % sobre ~34 m de caixa ≈ 0,5 m de desnível.
    normalizarPara: [8.4, 8.9],
    equidistancia_m: 0.1,
    municipio: "Antonina",
    uf: "PR",
    zonaUtm: "UTM 22S",
    rural: false,
    areaDocumento_m2: null,
  },
  {
    id: "completo",
    nome: "Fazenda Recanto das Águas",
    procedencia:
      'Números do estudo de prova "completo" do Archilly Geo ' +
      "(src/lib/geo/relatorio/__tests__/estudos-de-prova.ts, SINTESE_COMPLETA): " +
      "área bruta 1.417.577,87 m² (141,76 ha), 20 vértices, UTM 22S, Antonina/PR, " +
      "matrícula 10123, SIGEF 7020130007283, área de documento 1.417.609 m², " +
      "cota 4,2 a 118,75 m (desnível 114,55 m), curvas de 5 m, zonas ZR-3 e ZR-2, " +
      "e as três restrições com as áreas exatas de lá (APP hídrica 51.230,4 m², " +
      "reserva legal do CAR 283.515,6 m², APP de encosta 8.904,15 m²). " +
      "Aquele estudo NÃO tem geometria, então a poligonal de 20 vértices foi " +
      "construída e escalada para a área bater, e as restrições foram posicionadas " +
      "dentro dela com as áreas declaradas. O perímetro do estudo é 5.842,4 m; o " +
      "desta poligonal é o que a geometria dá, e está registrado no arquivo.",
    lat0: -25.42,
    lon0: -48.71,
    vertices: 20,
    area_m2: 1_417_577.87,
    semente: 2.3,
    relevo: ondulado(0, 1, 210),
    // As cotas exatas do estudo "completo": 4,2 a 118,75 m.
    normalizarPara: [4.2, 118.75],
    equidistancia_m: 5,
    municipio: "Antonina",
    uf: "PR",
    zonaUtm: "UTM 22S",
    rural: true,
    areaDocumento_m2: 1_417_609,
    matricula: "10123",
    certificacaoSigef: "7020130007283",
    numeroCar: "PR-4101408-A1B2",
    restricoes: [
      {
        tipo: "app",
        id: "app-hidrica",
        nome: "APP hídrica — faixa de 30 m",
        categoria: "app_rio",
        baseLegal: "Lei 12.651/2012, art. 4º, I",
        area_m2: 51_230.4,
        centro: [-0.15, 0.25],
      },
      {
        tipo: "reserva_legal",
        id: "car-reserva",
        nome: "Reserva legal (CAR)",
        categoria: "reserva_legal",
        area_m2: 283_515.6,
        centro: [0.42, -0.3],
      },
      {
        tipo: "app",
        id: "app-relevo",
        nome: "APP de encosta",
        categoria: "app_declividade",
        baseLegal: "Lei 12.651/2012, art. 4º, V",
        area_m2: 8_904.15,
        centro: [-0.45, -0.35],
      },
    ],
    zonas: [
      { zona: "ZR-3", sigla: "ZR3", loteMinimo_m2: 360, testadaMinima_m: 12 },
      { zona: "ZR-2", sigla: "ZR2", loteMinimo_m2: 450, testadaMinima_m: 15 },
    ],
  },
  {
    id: "sintetico-10ha-plano",
    nome: "Gleba Sintética 10 ha (plano)",
    procedencia:
      "SINTÉTICO — inventado pelo LAB-01, não vem de estudo nenhum do Geo. " +
      "10 ha, rampa geral de 2,5 %, curvas de 1 m. Existe para dar o degrau " +
      "inferior da escada de tamanho da seção 4 do prompt, com relevo simples o " +
      "bastante para que a rampa das vias seja conferível a olho.",
    lat0: -25.45,
    lon0: -48.75,
    vertices: 10,
    area_m2: 100_000,
    semente: 3.7,
    relevo: planoInclinado(620, 2.5, 1.2),
    normalizarPara: [620, 628],
    equidistancia_m: 1,
    municipio: "Antonina",
    uf: "PR",
    zonaUtm: "UTM 22S",
    rural: false,
    areaDocumento_m2: 100_000,
    zonas: [{ zona: "ZR-2", sigla: "ZR2", loteMinimo_m2: 360, testadaMinima_m: 12 }],
  },
  {
    id: "sintetico-50ha-ondulado",
    nome: "Gleba Sintética 50 ha (ondulado)",
    procedencia:
      "SINTÉTICO — inventado pelo LAB-01, não vem de estudo nenhum do Geo. " +
      "50 ha, relevo ondulado com 45 m de desnível e curvas de 2 m. Existe para " +
      "exercitar o campo tensorial no regime em que ele deveria brilhar: vias " +
      "principais seguindo a curva de nível e locais descendo o gradiente.",
    lat0: -25.5,
    lon0: -48.8,
    vertices: 14,
    area_m2: 500_000,
    semente: 5.1,
    relevo: ondulado(0, 1, 150),
    normalizarPara: [700, 745],
    equidistancia_m: 2,
    municipio: "Antonina",
    uf: "PR",
    zonaUtm: "UTM 22S",
    rural: true,
    areaDocumento_m2: 500_000,
    zonas: [{ zona: "ZR-1", sigla: "ZR1", loteMinimo_m2: 450, testadaMinima_m: 15 }],
  },
];

/** Um anel circular aproximado com a área pedida, num centro dado. */
function anelDeArea(
  cx: number,
  cy: number,
  area_m2: number,
  lados = 12,
  achatamento = 0.8,
): { x: number; y: number }[] {
  const r = Math.sqrt(area_m2 / (Math.PI * achatamento));
  const anel: { x: number; y: number }[] = [];
  for (let i = 0; i < lados; i++) {
    const t = (i / lados) * Math.PI * 2;
    anel.push({ x: cx + Math.cos(t) * r, y: cy + Math.sin(t) * r * achatamento });
  }
  const k = Math.sqrt(area_m2 / areaDe(anel));
  return anel.map((p) => ({ x: cx + (p.x - cx) * k, y: cy + (p.y - cy) * k }));
}

export function gerar(r: Receita) {
  const b = base(r.lat0, r.lon0);
  const gleba = glebaIrregular(r.vertices, r.area_m2, r.semente);
  const area = areaDe(gleba);
  const perim = perimetroDe(gleba);

  const xs = gleba.map((p) => p.x);
  const ys = gleba.map((p) => p.y);
  const caixa = {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
  const raioEquivalente = Math.sqrt(r.area_m2 / Math.PI);

  const features: unknown[] = [];

  const fecharAnel = (anel: { x: number; y: number }[]): Posicao[] => {
    const g = anel.map((p) => paraGraus(b, p.x, p.y));
    return [...g, g[0]!];
  };

  // --------------------------------------------------------------- terreno
  features.push({
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [fecharAnel(gleba)] },
    properties: {
      tipo: "terreno",
      nome: r.nome,
      origem: r.certificacaoSigef ? "sigef" : "desenho",
      areaDocumento_m2: r.areaDocumento_m2,
      areaCalculada_m2: Number(area.toFixed(2)),
      metodoArea: "plano_local",
      perimetro_m: Number(perim.toFixed(2)),
      vertices: gleba.length,
      datum: "SIRGAS 2000",
      zonaUtm: r.zonaUtm,
      matricula: r.matricula ?? null,
      cartorioCns: r.matricula ? "07.971-5" : null,
      codigoIncra: null,
      certificacaoSigef: r.certificacaoSigef ?? null,
      numeroCar: r.numeroCar ?? null,
      municipio: r.municipio,
      uf: r.uf,
      rural: r.rural,
    },
  });

  // ---------------------------------------------------------------- curvas
  //
  // A grade de extração é ~1/200 do lado da gleba, com piso de 0,5 m: fina o
  // bastante para a isolinha não ficar serrilhada, grossa o bastante para não
  // gerar arquivo de dezenas de megabytes num terreno de 141 ha.
  const lado = Math.max(caixa.maxX - caixa.minX, caixa.maxY - caixa.minY);
  const passoExtracao = Math.max(0.5, lado / 200);
  const margem = lado * 0.08;
  const caixaExtracao = {
    minX: caixa.minX - margem,
    minY: caixa.minY - margem,
    maxX: caixa.maxX + margem,
    maxY: caixa.maxY + margem,
  };

  // A superfície é varrida uma vez para achar a amplitude crua e depois mapeada
  // afim para a faixa declarada. Varrer a CAIXA DE EXTRAÇÃO, e não só a gleba, é
  // o que garante que nenhuma curva extraída caia fora de [cotaMin, cotaMax].
  let cruMin = Infinity;
  let cruMax = -Infinity;
  for (let y = caixaExtracao.minY; y <= caixaExtracao.maxY; y += passoExtracao) {
    for (let x = caixaExtracao.minX; x <= caixaExtracao.maxX; x += passoExtracao) {
      const z = r.relevo(x, y);
      if (z < cruMin) cruMin = z;
      if (z > cruMax) cruMax = z;
    }
  }
  const [cotaMin, cotaMax] = r.normalizarPara;
  const amplitudeCrua = cruMax - cruMin;
  if (!(amplitudeCrua > 1e-9)) {
    throw new Error(`o relevo de "${r.id}" é constante: não há o que normalizar`);
  }
  const relevo: Relevo = (x, y) =>
    cotaMin + ((r.relevo(x, y) - cruMin) / amplitudeCrua) * (cotaMax - cotaMin);

  const primeira = Math.ceil(cotaMin / r.equidistancia_m) * r.equidistancia_m;
  let curvas = 0;
  for (let cota = primeira; cota <= cotaMax; cota += r.equidistancia_m) {
    const segs = segmentosDaIsolinha(relevo, cota, caixaExtracao, passoExtracao);
    for (const linha of costurar(segs, passoExtracao / 2)) {
      features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: linha.map(([x, y]) => paraGraus(b, x, y)),
        },
        properties: {
          tipo: "curva_nivel",
          cota_m: Number(cota.toFixed(2)),
          equidistancia_m: r.equidistancia_m,
        },
      });
      curvas++;
    }
  }
  if (curvas === 0) {
    throw new Error(
      `o terreno "${r.id}" não gerou curva de nível nenhuma: ` +
        `desnível de ${(cotaMax - cotaMin).toFixed(2)} m com equidistância de ` +
        `${r.equidistancia_m} m`,
    );
  }

  // ------------------------------------------------------------ restrições
  const restricoes = r.restricoes ?? [];
  for (const rest of restricoes) {
    const anel = anelDeArea(
      rest.centro[0] * raioEquivalente,
      rest.centro[1] * raioEquivalente * 0.72,
      rest.area_m2,
    );
    const comuns = {
      id: rest.id,
      nome: rest.nome,
      categoria: rest.categoria,
      motivo: `Restrição ${rest.categoria} do estudo de prova, com a área declarada nele.`,
      origem: "geo",
      padraoLigada: true,
      percentualDoTerreno: Number((rest.area_m2 / area).toFixed(4)),
      usoPermitido: rest.categoria === "reserva_legal" ? "nenhum" : "publico_condicionado",
      geometriaFechadaPor: "geo",
      area_m2: Number(rest.area_m2.toFixed(2)),
      descontaAreaLiquida: true,
    };
    features.push({
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [fecharAnel(anel)] },
      properties:
        rest.tipo === "app"
          ? { ...comuns, tipo: "app", baseLegal: rest.baseLegal!, fonte: "calculada", largura_m: 30 }
          : rest.tipo === "reserva_legal"
            ? { ...comuns, tipo: "reserva_legal", fonte: "car_declarada" }
            : { ...comuns, tipo: "restricao", restricao: "outra", fonte: "estudo" },
    });
  }

  // -------------------------------------------------------------- zoneamento
  for (const z of r.zonas ?? []) {
    features.push({
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [fecharAnel(gleba)] },
      properties: {
        tipo: "zoneamento",
        zona: z.zona,
        sigla: z.sigla,
        fonte: "estudo de prova",
        parametros: {
          coeficienteAproveitamento: 1,
          taxaOcupacao: 0.5,
          taxaPermeabilidade: 0.2,
          alturaMaxima_m: null,
          pavimentos: 2,
          recuoFrontal_m: 4,
          recuosLaterais_m: 1.5,
          recuoFundos_m: 3,
          loteMinimo_m2: z.loteMinimo_m2,
          testadaMinima_m: z.testadaMinima_m,
          densidade: null,
        },
      },
    });
  }

  const areaRestrita = restricoes.reduce((s, x) => s + x.area_m2, 0);

  return {
    type: "FeatureCollection",
    archilly: {
      schema: "archilly-terreno",
      versao: "1.1",
      origem: "archilly-lab LAB-01 · gerar-terrenos.ts",
      geradoEm: "2026-09-10T00:00:00.000Z",
      estudoId: r.id,
      empreendimento: { nome: r.nome, id: r.id },
      crsTrabalho: null,
      procedencia: r.procedencia,
      sintese: {
        areaBruta_m2: Number(area.toFixed(2)),
        areaLiquida_m2: Number((area - areaRestrita).toFixed(2)),
        areaParcelavel_m2: Number((area - areaRestrita).toFixed(2)),
        restricoes: restricoes.map((x) => ({
          tipo: x.categoria,
          area_m2: Number(x.area_m2.toFixed(2)),
          desconta: true,
        })),
        restricoesDetalhadas: restricoes.map((x) => ({
          id: x.id,
          nome: x.nome,
          area_m2: Number(x.area_m2.toFixed(2)),
          padraoLigada: true,
        })),
        relevo: {
          cotaMin: Number(cotaMin.toFixed(2)),
          cotaMax: Number(cotaMax.toFixed(2)),
          desnivel: Number((cotaMax - cotaMin).toFixed(2)),
          classesDeclividade: [],
          fonteMdt: "superfície analítica do gerador do LAB-01",
          resolucao_m: passoExtracao,
        },
      },
    },
    features,
  };
}


// --------------------------------------------------- escada de tamanho (seção 4)

/**
 * A escada de 10, 50, 100 e 200 ha que a seção 4 do prompt pede.
 *
 * Todas com a MESMA forma de gleba, o MESMO relevo e o MESMO desnível — só a
 * área muda. É o único jeito de a comparação de tempo medir escala e nada mais:
 * se a forma ou o relevo variassem junto, o número não diria se o custo subiu
 * por causa do tamanho ou por causa do terreno.
 *
 * A escala do relevo acompanha o tamanho da gleba, para que o número de colinas
 * dentro dela seja constante. Sem isso, a gleba de 200 ha teria quatro vezes
 * mais ondulação que a de 10 ha, e o traçador veria terrenos qualitativamente
 * diferentes.
 */
export function escadaDeTamanho(hectares: number[]): Receita[] {
  return hectares.map((ha) => {
    const area = ha * 10_000;
    // Raio equivalente ÷ 3,5: mantém ~3 colinas por lado em qualquer tamanho.
    const escala = Math.sqrt(area / Math.PI) / 3.5;
    return {
      id: `escada-${ha}ha`,
      nome: `Escada ${ha} ha`,
      procedencia:
        `SINTÉTICO — escada de tamanho do LAB-01, ${ha} ha. Mesma forma de gleba e ` +
        "mesmo desnível (45 m) em todos os degraus; só a área muda, e a escala do " +
        "relevo acompanha para manter a densidade de colinas constante.",
      lat0: -25.55,
      lon0: -48.85,
      vertices: 14,
      area_m2: area,
      semente: 5.1,
      relevo: ondulado(0, 1, escala),
      normalizarPara: [700, 745],
      equidistancia_m: 2,
      municipio: "Antonina",
      uf: "PR",
      zonaUtm: "UTM 22S",
      rural: true,
      areaDocumento_m2: area,
    };
  });
}
