#!/usr/bin/env bun
/**
 * A terceira gleba: a do LAB-01, convertida para a ENTRADA do contrato v1.
 *
 * ```sh
 * bun ferramentas/gleba-lab01.ts
 * ```
 *
 * # Por que esta gleba, e não outra
 *
 * O LAB-07 pede "as duas glebas-padrão do Generate, mais a gleba que o LAB-01
 * usou". O LAB-01 gerou quatro terrenos; a escolhida é
 * `sintetico-50ha-ondulado`, e a razão é que ela **traz relevo** — 575 curvas de
 * nível a cada 2 m, 45 m de desnível.
 *
 * Isso importa mais do que parece: as duas glebas-padrão do Generate
 * (`ensaio-47ha` e `geo-antonina`) têm `relevo` com `cotas: null`,
 * `curvas: []` e `classesDeclividade: null` — **nenhuma das duas carrega
 * topografia**. Sem uma terceira gleba com relevo de verdade, o §2.6 do LAB-07
 * (a interpolação do relevo) não teria o que medir, e o campo `relevo` do
 * contrato atravessaria a esteira inteira sem nunca ser exercitado.
 *
 * # A conversão
 *
 * O terreno do LAB-01 está em `archilly-terreno` 1.1, GeoJSON em WGS84. Quem o
 * projeta para metros locais é o **leitor do próprio Lab**, o mesmo que o
 * adaptador do Symbios usa (`lerTerrenoGeo`): plano tangente local centrado no
 * centróide da gleba, com y para o SUL, que é a convenção do Generate.
 *
 * Reaproveitar aquele leitor não é economia — é o que garante que a mesma gleba
 * chegue ao Symbios e ao Testfit **no mesmo lugar**, com a mesma origem. Duas
 * projeções para o mesmo terreno seria a divergência silenciosa que o LAB-01
 * gastou uma seção inteira evitando.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { lerTerrenoGeo } from "../../symbios/adapter/src/terreno-geo.ts";
import type { EntradaV1, PontoV1, RestricaoV1 } from "../adapter/src/contrato-v1.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** O terreno do LAB-01 que vira a terceira gleba, e por quê. */
export const TERRENO_ESCOLHIDO = "sintetico-50ha-ondulado";

/** Área de um anel, em m². */
function area(anel: PontoV1[]): number {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2);
}

/**
 * Monta a ENTRADA do contrato a partir de um terreno do LAB-01.
 *
 * Os parâmetros urbanísticos copiam os das glebas-padrão do Generate, de
 * propósito: mudar os dois ao mesmo tempo — terreno e parâmetros — tornaria
 * impossível dizer se uma diferença de resultado veio do relevo ou da
 * calibragem.
 */
export function glebaDoLab01(): EntradaV1 {
  const caminho = join(RAIZ, "docs", "terrenos", `${TERRENO_ESCOLHIDO}.geojson`);
  const arq = JSON.parse(readFileSync(caminho, "utf8"));
  const t = lerTerrenoGeo(arq, `LAB-01 · docs/terrenos/${TERRENO_ESCOLHIDO}.geojson`);

  const anel: PontoV1[] = t.gleba.externo.map((p) => ({ x: p.x, y: p.y }));

  const restricoes: RestricaoV1[] = t.restricoes.map((r, i) => ({
    id: r.id || `R${i + 1}`,
    tipo: r.categoria.startsWith("app")
      ? "app_hidrica"
      : r.categoria === "reserva_legal"
        ? "reserva_legal"
        : "outra",
    nome: r.nome,
    baseLegal: null,
    desconta: r.desconta,
    geometria: {
      tipo: "poligono",
      aneis: [r.area.externo.map((p) => ({ x: p.x, y: p.y }))],
    },
  }));

  // O acesso: o Geo não marcou nenhum neste terreno sintético. O vértice do
  // anel mais ao sul é o palpite, e ele viaja com `sugerido: true` — que é
  // exatamente para isso que o campo existe no contrato.
  const maisAoSul = anel.reduce((a, b) => (b.y > a.y ? b : a), anel[0]!);

  return {
    archilly: {
      schema: "archilly-motor-entrada",
      versao: "1",
      origem: "archilly-lab · LAB-07 (convertido do terreno do LAB-01)",
      geradoEm: "2026-09-13T00:00:00.000Z",
    },
    projeto: { id: "lab01-50ha-ondulado", nome: t.nome },
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
    acessos: [
      {
        id: "A1",
        nome: "Acesso sugerido",
        papel: "principal",
        ponto: maisAoSul,
        segmento: null,
        sugerido: true,
      },
    ],
    relevo: {
      cotas: null,
      curvas: t.curvas.map((c) => ({
        cota_m: c.cota_m,
        pontos: c.pontos.map((p) => ({ x: p.x, y: p.y })),
      })),
      classesDeclividade: null,
      fonteMdt: "superfície analítica do gerador do LAB-01",
      resolucao_m: 2,
    },
    restricoes,
    atracoes: [],
    // Os mesmos parâmetros das duas glebas-padrão do Generate.
    parametros: {
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
    },
    regiaoNormativa: "BR",
    geo: null,
  };
}

if (import.meta.main) {
  const e = glebaDoLab01();
  const destino = join(RAIZ, "docs", "provas", "LAB-07", "lab01-50ha-ondulado.entrada.json");
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, `${JSON.stringify(e, null, 1)}\n`, "utf8");
  const vertices = e.relevo?.curvas?.reduce((s, c) => s + c.pontos.length, 0) ?? 0;
  console.log(
    `${e.projeto.id}: ${(e.gleba.area_m2 / 1e4).toFixed(2)} ha · ${e.gleba.anel.length} vértices · ` +
      `${e.relevo?.curvas?.length ?? 0} curvas (${vertices} vértices cotados) · ` +
      `${e.restricoes.length} restrições`,
  );
  console.log(`gravado em docs/provas/LAB-07/lab01-50ha-ondulado.entrada.json`);
}
