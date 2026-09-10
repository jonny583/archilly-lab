/**
 * A borda georreferenciada: graus ↔ metros locais, e nada mais.
 *
 * # Por que esta projeção, e não UTM
 *
 * Plano tangente local equiretangular, centrado no centróide da gleba. É a mesma
 * decisão que o Generate já tomou em `src/lib/import/geo-projecao.ts`, e a razão
 * dele vale aqui inteira: glebas deste produto têm poucos quilômetros de lado,
 * onde o erro do plano tangente é submétrico, e UTM traria o problema de terreno
 * na fronteira de duas zonas sem nada em troca.
 *
 * Escolher a mesma projeção do Generate não é comodidade: é o que faz a
 * geometria que sai daqui cair no mesmo lugar que a geometria que ele importa do
 * Geo. Projeção diferente dos dois lados é divergência silenciosa de
 * coordenada — o tipo de erro que passa em todo teste e aparece no desenho.
 *
 * O Lab **reimplementa** as fórmulas em vez de importar o módulo do Generate: o
 * Generate não pode depender do Lab, e o Lab não pode depender do Generate.
 * As fórmulas são as de metros por grau do WGS84, de domínio público.
 *
 * # A convenção de eixo, que é onde se erra
 *
 * O Generate é CAD: **x cresce para leste, y cresce para o SUL**. O Symbios é
 * motor de jogo: X/Z num sistema Y-up, com Z crescendo para o norte visual. O
 * adaptador inverte o eixo no caminho de ida e desinverte na volta — e é
 * exatamente por isso que `prova de ida e volta` existe como teste.
 */
import type { Anel, LatLon, Origem, Poligono, Ponto } from "./contrato.ts";

function metrosPorGrauLat(latGraus: number): number {
  const lat = (latGraus * Math.PI) / 180;
  return (
    111132.92 -
    559.82 * Math.cos(2 * lat) +
    1.175 * Math.cos(4 * lat) -
    0.0023 * Math.cos(6 * lat)
  );
}

function metrosPorGrauLon(latGraus: number): number {
  const lat = (latGraus * Math.PI) / 180;
  return 111412.84 * Math.cos(lat) - 93.5 * Math.cos(3 * lat) + 0.118 * Math.cos(5 * lat);
}

/**
 * A origem a partir do centróide simples de uma lista de pontos em graus.
 *
 * Centróide simples — média das coordenadas, não centróide de área — porque é o
 * que o Generate faz, e a origem só precisa ser *estável e a mesma nos dois
 * lados*, não geometricamente notável.
 */
export function calcularOrigem(pontos: LatLon[]): Origem {
  if (pontos.length === 0) throw new Error("origem pede pelo menos um ponto");
  const lat0 = pontos.reduce((s, p) => s + p.lat, 0) / pontos.length;
  const lon0 = pontos.reduce((s, p) => s + p.lon, 0) / pontos.length;
  return {
    lat0,
    lon0,
    metrosPorGrauLat: metrosPorGrauLat(lat0),
    metrosPorGrauLon: metrosPorGrauLon(lat0),
  };
}

/** Graus → metros locais. x para leste, y para o sul. */
export function projetar(p: LatLon, o: Origem): Ponto {
  return {
    x: (p.lon - o.lon0) * o.metrosPorGrauLon,
    y: (o.lat0 - p.lat) * o.metrosPorGrauLat,
  };
}

/** Metros locais → graus. Inverso exato de `projetar`. */
export function reverter(p: Ponto, o: Origem): LatLon {
  return {
    lon: o.lon0 + p.x / o.metrosPorGrauLon,
    lat: o.lat0 - p.y / o.metrosPorGrauLat,
  };
}

// ------------------------------------------------------------------ geometria

/** Área com sinal de um anel, em m². Positiva quando anti-horária. */
export function areaComSinal(anel: Anel): number {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/** Área de um polígono, descontando os furos. */
export function areaPoligono(pol: Poligono): number {
  const externo = Math.abs(areaComSinal(pol.externo));
  const furos = pol.furos.reduce((s, f) => s + Math.abs(areaComSinal(f)), 0);
  return Math.max(0, externo - furos);
}

/** Perímetro de um anel fechado, em metros. */
export function perimetro(anel: Anel): number {
  let d = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    d += Math.hypot(q.x - p.x, q.y - p.y);
  }
  return d;
}

/** Comprimento de uma polilinha aberta, em metros. */
export function comprimento(pontos: Ponto[]): number {
  let d = 0;
  for (let i = 1; i < pontos.length; i++) {
    const p = pontos[i - 1]!;
    const q = pontos[i]!;
    d += Math.hypot(q.x - p.x, q.y - p.y);
  }
  return d;
}

/**
 * Ponto dentro do anel, por cruzamentos de raio.
 *
 * O ponto exatamente sobre a aresta fica indefinido, e isso é aceitável aqui: o
 * uso é estatístico (que fração caiu fora da gleba), não decisório. Decidir se
 * um vértice pertence à gleba é o recorte do LAB-02, que precisa de geometria
 * robusta — não desta função.
 */
export function dentroDoAnel(p: Ponto, anel: Anel): boolean {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const a = anel[i]!;
    const b = anel[j]!;
    const cruza = a.y > p.y !== b.y > p.y;
    if (cruza && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) dentro = !dentro;
  }
  return dentro;
}

/** Dentro do polígono: dentro do externo e fora de todo furo. */
export function dentroDoPoligono(p: Ponto, pol: Poligono): boolean {
  if (!dentroDoAnel(p, pol.externo)) return false;
  return !pol.furos.some((f) => dentroDoAnel(p, f));
}

/** Caixa envolvente de um conjunto de pontos. */
export interface Caixa {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function caixaDe(pontos: Ponto[]): Caixa {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of pontos) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Garante sentido anti-horário num anel.
 *
 * GeoJSON pede anel externo anti-horário (RFC 7946), e o Symbios devolve quadra
 * em sentido horário. Normalizar na saída é mais barato que pedir ao
 * consumidor que saiba disso.
 */
export function antiHorario(anel: Anel): Anel {
  return areaComSinal(anel) < 0 ? [...anel].reverse() : anel;
}
