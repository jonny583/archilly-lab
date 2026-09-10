/**
 * A borda de saída: resultado em metros locais → GeoJSON em WGS84.
 *
 * # Por que WGS84, e por que GeoJSON comum
 *
 * O objetivo é abrir no QGIS, no Google Earth e em qualquer visualizador, sem que
 * a ferramenta saiba nada de Archilly — exatamente o critério que o contrato
 * `archilly-terreno` já adotou. GeoJSON, por RFC 7946, é em graus WGS84; escrever
 * metros locais num `.geojson` produz arquivo que carrega no lugar errado do
 * planeta, e é um erro que passa despercebido porque o desenho *parece* certo.
 *
 * As propriedades saem **em metros**, ao lado da geometria em graus: é o par que
 * permite conferir rampa e área num visualizador sem reprojetar nada.
 */
import type { Origem, Ponto, Resultado, Terreno } from "./contrato.ts";
import { antiHorario, reverter } from "./geo.ts";

type Posicao = [number, number];

const emGraus = (p: Ponto, o: Origem): Posicao => {
  const g = reverter(p, o);
  // Seis casas decimais ≈ 0,11 m no equador. Mais casas só inflariam o arquivo
  // com ruído de ponto flutuante abaixo da precisão de qualquer levantamento.
  return [Number(g.lon.toFixed(7)), Number(g.lat.toFixed(7))];
};

/** Fecha o anel repetindo o primeiro vértice, como a RFC 7946 exige. */
const fechar = (anel: Posicao[]): Posicao[] =>
  anel.length > 0 ? [...anel, anel[0]!] : anel;

interface Feicao {
  type: "Feature";
  geometry: { type: string; coordinates: unknown };
  properties: Record<string, unknown>;
}

/**
 * Empacota o resultado como GeoJSON.
 *
 * Inclui a gleba e as restrições junto das vias e quadras: sem elas, abrir o
 * arquivo num visualizador mostra uma rede viária flutuando sem referência, e a
 * pergunta que mais se faz ao olhar este resultado — "quanto saiu da gleba?" — não
 * tem como ser respondida a olho.
 */
export function paraGeoJSON(r: Resultado, terreno: Terreno) {
  const o = terreno.origem;
  const features: Feicao[] = [];

  features.push({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        fechar(antiHorario(terreno.gleba.externo).map((p) => emGraus(p, o))),
        ...terreno.gleba.furos.map((f) => fechar(f.map((p) => emGraus(p, o)))),
      ],
    },
    properties: {
      tipo: "gleba",
      nome: terreno.nome,
      area_m2: Number(r.diagnostico.areaGleba_m2.toFixed(2)),
      areaDeclarada_m2: terreno.areaDeclarada_m2,
      procedencia: terreno.procedencia,
    },
  });

  for (const restricao of terreno.restricoes) {
    features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          fechar(antiHorario(restricao.area.externo).map((p) => emGraus(p, o))),
          ...restricao.area.furos.map((f) => fechar(f.map((p) => emGraus(p, o)))),
        ],
      },
      properties: {
        tipo: "restricao",
        id: restricao.id,
        nome: restricao.nome,
        categoria: restricao.categoria,
        desconta: restricao.desconta,
        // O LAB-01 carrega a restrição sem aplicá-la; dizer isso no arquivo evita
        // que alguém olhe o desenho e conclua que o recorte já está feito.
        observacao: "carregada, não aplicada — o recorte é o LAB-02",
      },
    });
  }

  for (const v of r.vias) {
    features.push({
      type: "Feature",
      geometry: { type: "LineString", coordinates: v.pontos.map((p) => emGraus(p, o)) },
      properties: {
        tipo: "via",
        id: v.id,
        hierarquia: v.tipo,
        comprimento_m: Number(v.comprimento_m.toFixed(2)),
        rampaMedia_pct: Number(v.rampaMedia_pct.toFixed(2)),
        rampaMaxima_pct: Number(v.rampaMaxima_pct.toFixed(2)),
        faixaDominio_m: v.faixaDominio_m,
        cotaInicial_m: Number((v.cotas_m[0] ?? 0).toFixed(2)),
        cotaFinal_m: Number((v.cotas_m.at(-1) ?? 0).toFixed(2)),
        saiDaGleba: v.saiDaGleba,
      },
    });
  }

  for (const q of r.quadras) {
    features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [fechar(q.pontos.map((p) => emGraus(p, o)))],
      },
      properties: {
        tipo: "quadra",
        id: q.id,
        area_m2: Number(q.area_m2.toFixed(2)),
        perimetro_m: Number(q.perimetro_m.toFixed(2)),
        fracaoDentroDaGleba: Number(q.fracaoDentroDaGleba.toFixed(4)),
      },
    });
  }

  return {
    type: "FeatureCollection" as const,
    // Bloco próprio, no espírito do `archilly` do contrato do Geo: um
    // visualizador ignora, e quem conhece lê a procedência inteira do arquivo.
    archillyLab: {
      prompt: "LAB-01",
      adaptador: r.diagnostico.versaoAdaptador,
      motor: `symbios-tensor ${r.diagnostico.versaoMotor}`,
      seed: r.diagnostico.seed,
      hash: r.diagnostico.hash,
      parametros: r.diagnostico.parametros,
      origem: o,
      aviso:
        "geometria NÃO recortada pela gleba nem pelas restrições — isso é o LAB-02",
    },
    features,
  };
}
