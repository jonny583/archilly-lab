/**
 * Os terrenos do Lab (`archilly-terreno`, GeoJSON) → ENTRADA do contrato v1.
 *
 * # Por que passar pelo contrato em vez de alimentar o motor direto
 *
 * O LAB-01 lia o GeoJSON e entregava ao Symbios. Funciona, mas cria um segundo
 * caminho de entrada: um motor comendo `archilly-terreno` e o outro comendo o
 * contrato de motor v1. O LAB-08 vai cobrar *"mesmas glebas, mesmas sementes"*,
 * e duas portas diferentes tornam a frase impossível de honrar.
 *
 * Aqui todo terreno vira **ENTRADA v1** primeiro, e é o contrato que alimenta
 * os dois motores. A projeção é a do próprio Lab (`lerTerrenoGeo`), a mesma que
 * o LAB-07 usou para a terceira gleba — de novo para que a mesma terra caia no
 * mesmo lugar nos dois motores.
 *
 * Os parâmetros urbanísticos copiam os das glebas-padrão do Generate, de
 * propósito: mudar terreno e calibragem ao mesmo tempo tornaria impossível
 * dizer de onde veio uma diferença.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { lerTerrenoGeo } from "@symbios/terreno-geo.ts";
import type { Ponto } from "@symbios/contrato.ts";

import type { EntradaMinima } from "./gleba-v1.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** Área de um anel, em m². */
function area(anel: Ponto[]): number {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2);
}

/** Os mesmos parâmetros das glebas-padrão do Generate. */
const PARAMETROS = {
  areaMinLote_m2: 200,
  areaAlvoLote_m2: 360,
  areaMaxLote_m2: 600,
  testadaMinLote_m: 10,
  caixaViariaMin_m: 8,
  caixaPrincipal_m: 11.5,
  caixaSecundaria_m: 10,
  calcada_m: null,
  faceQuadraMax_m: 200,
  pctAreaPublica: null,
  pctAPP: 15,
  pctLazer: 10,
  rampaMaxima_pct: null,
};

export function glebaDoLab(nome: string): EntradaMinima {
  const arq = JSON.parse(
    readFileSync(join(RAIZ, "docs", "terrenos", `${nome}.geojson`), "utf8"),
  );
  const t = lerTerrenoGeo(arq, `archilly-lab · docs/terrenos/${nome}.geojson`);
  const anel = t.gleba.externo.map((p) => ({ x: p.x, y: p.y }));

  return {
    archilly: { schema: "archilly-motor-entrada", versao: "1" },
    projeto: { id: nome, nome: t.nome },
    crs: {
      codigo: "local",
      unidade: "m",
      origemGeografica: { lat: t.origem.lat0, lon: t.origem.lon0 },
    },
    gleba: {
      id: "G1",
      nome: t.nome,
      anel,
      furos: t.gleba.furos.map((f) => f.map((p) => ({ x: p.x, y: p.y }))),
      area_m2: area(anel),
    },
    relevo: {
      curvas: t.curvas.map((c) => ({
        cota_m: c.cota_m,
        pontos: c.pontos.map((p) => ({ x: p.x, y: p.y })),
      })),
    },
    restricoes: t.restricoes.map((r, i) => ({
      id: r.id || `R${i + 1}`,
      tipo: r.categoria,
      nome: r.nome,
      desconta: r.desconta,
      geometria: {
        tipo: "poligono",
        aneis: [
          r.area.externo.map((p) => ({ x: p.x, y: p.y })),
          ...r.area.furos.map((f) => f.map((p) => ({ x: p.x, y: p.y }))),
        ],
      },
    })),
    atracoes: [],
    acessos: [],
    parametros: PARAMETROS,
  };
}
