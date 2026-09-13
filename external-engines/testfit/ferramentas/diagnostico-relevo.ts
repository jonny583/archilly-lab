#!/usr/bin/env bun
/**
 * §2.6 — O defeito de interpolação do LAB-01 atinge o Testfit? E o Generate?
 *
 * ```sh
 * bun ferramentas/diagnostico-relevo.ts
 * ```
 *
 * # O defeito, em uma frase
 *
 * Vértices ao longo de uma curva de nível são muito mais próximos entre si do
 * que a distância entre duas curvas. Interpolar por vizinhos mais próximos faz
 * com que, para quase toda amostra, **todos os vizinhos estejam na mesma
 * curva** — e a média deles é a cota daquela curva. O relevo vira um bolo de
 * casamento: terraços planos com degraus entre eles, e gradiente zero no meio de
 * cada terraço. O LAB-01 mediu 85 % das células sobre um valor de curva e 73 %
 * com gradiente exatamente zero, e corrigiu interpolando entre **níveis
 * distintos** (docs/DECISOES.md, D08).
 *
 * # O que este diagnóstico compara
 *
 * Três interpoladores, a MESMA nuvem de pontos (9 448 vértices de 575 curvas de
 * 2 em 2 m, do terreno de 50 ha do LAB-01), as MESMAS estatísticas:
 *
 * | # | interpolador | onde vive |
 * |---|---|---|
 * | 1 | `campoRelevo` do Testfit — IDW global sobre **todos** os pontos | `motor-testfit`, `src/lib/lab/motor.ts` |
 * | 2 | `criarModeloRelevo` do Generate — IDW sobre os **k = 6** vizinhos, com piso de passo | `urban-create-hub`, `src/lib/engine/topografia.ts` |
 * | 3 | `montarAlturas` do LAB-01 — interpolação entre **níveis distintos** | este repositório (a correção) |
 *
 * As duas estatísticas são as do LAB-01, e cada uma responde a uma pergunta:
 *
 * - **amostras sobre um valor de curva** — quantas caem a menos de 2 cm de uma
 *   cota de curva. Alto significa terraço: a interpolação está devolvendo a cota
 *   da curva em vez de interpolar entre curvas.
 * - **gradiente zero** — quantas não têm inclinação nenhuma. É a consequência
 *   que quebra o motor: um campo tensorial (Symbios) ou uma deformação de
 *   traçado (Testfit) lido de terreno plano não segue topografia nenhuma.
 *
 * O `campoRelevo` do Testfit **não é exportado**. Ele está replicado aqui,
 * linha a linha, com a origem anotada — medir o algoritmo de outro repositório
 * sem alterá-lo é a única forma de cumprir o §2.6 sem escrever nele.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { criarModeloRelevo } from "@generate/engine/topografia.ts";

import { lerTerrenoGeo } from "../../symbios/adapter/src/terreno-geo.ts";
import { montarAlturas, paraMotor } from "../../symbios/adapter/src/alturas.ts";
import { glebaDoLab01, TERRENO_ESCOLHIDO } from "./gleba-lab01.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-07");

interface Ponto {
  x: number;
  y: number;
}

/**
 * `campoRelevo` do `motor-testfit`, replicado de `src/lib/lab/motor.ts` (linhas
 * 605-633 do commit medido).
 *
 * Sem o giro e sem a normalização para −1..1: o que se quer medir é a superfície
 * interpolada em cota, e girar não muda estatística nenhuma. O núcleo —
 * **inverso da distância sobre TODOS os pontos, com `+1` no denominador** — está
 * idêntico, e é ele que decide o resultado.
 */
function campoRelevoDoTestfit(pts: { x: number; y: number; z: number }[]) {
  return (p: Ponto): number => {
    let num = 0;
    let den = 0;
    for (const q of pts) {
      const d2 = (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + 1;
      num += q.z / d2;
      den += 1 / d2;
    }
    return den > 0 ? num / den : 0;
  };
}

/** As duas estatísticas do LAB-01, sobre uma grade de amostras. */
function estatisticas(
  amostrar: (p: Ponto) => number | null,
  caixa: { minX: number; minY: number; maxX: number; maxY: number },
  passo: number,
  equidistancia: number,
) {
  const nx = Math.floor((caixa.maxX - caixa.minX) / passo);
  const ny = Math.floor((caixa.maxY - caixa.minY) / passo);
  const z: (number | null)[] = [];
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      z.push(amostrar({ x: caixa.minX + ix * passo, y: caixa.minY + iy * passo }));
    }
  }

  let sobreCurva = 0;
  let validas = 0;
  for (const v of z) {
    if (v == null || !Number.isFinite(v)) continue;
    validas++;
    const d = Math.abs(v / equidistancia - Math.round(v / equidistancia)) * equidistancia;
    if (d < 0.02) sobreCurva++;
  }

  // Gradiente por diferença central, em porcento.
  const grads: number[] = [];
  for (let iy = 1; iy < ny - 1; iy++) {
    for (let ix = 1; ix < nx - 1; ix++) {
      const at = (i: number, j: number) => z[j * nx + i];
      const [d, e, s, n] = [at(ix + 1, iy), at(ix - 1, iy), at(ix, iy + 1), at(ix, iy - 1)];
      if (d == null || e == null || s == null || n == null) continue;
      grads.push(Math.hypot((d - e) / (2 * passo), (s - n) / (2 * passo)) * 100);
    }
  }
  grads.sort((a, b) => a - b);
  const q = (t: number) => (grads.length ? grads[Math.floor((grads.length - 1) * t)]! : 0);

  return {
    amostras: validas,
    sobreValorDeCurva: sobreCurva,
    sobreValorDeCurva_pct: validas ? Number(((100 * sobreCurva) / validas).toFixed(1)) : 0,
    gradienteZero_pct: grads.length
      ? Number(((100 * grads.filter((g) => g < 0.01).length) / grads.length).toFixed(1))
      : 0,
    declividade_pct: {
      p10: Number(q(0.1).toFixed(2)),
      mediana: Number(q(0.5).toFixed(2)),
      p90: Number(q(0.9).toFixed(2)),
      maxima: Number((grads.at(-1) ?? 0).toFixed(2)),
    },
  };
}

// ------------------------------------------------------------------ execução

const entrada = glebaDoLab01();
const curvas = entrada.relevo?.curvas ?? [];
const nuvem: { x: number; y: number; z: number }[] = [];
for (const c of curvas) for (const p of c.pontos) nuvem.push({ x: p.x, y: p.y, z: c.cota_m });

const xs = entrada.gleba.anel.map((p) => p.x);
const ys = entrada.gleba.anel.map((p) => p.y);
const caixa = {
  minX: Math.min(...xs),
  minY: Math.min(...ys),
  maxX: Math.max(...xs),
  maxY: Math.max(...ys),
};
const EQUIDISTANCIA = 2;

console.log(`gleba: ${TERRENO_ESCOLHIDO} · ${(entrada.gleba.area_m2 / 1e4).toFixed(1)} ha`);
console.log(`nuvem: ${curvas.length} curvas, ${nuvem.length} vértices, equidistância ${EQUIDISTANCIA} m\n`);

const resultados: Record<string, unknown> = {
  prompt: "LAB-07",
  diagnostico: "interpolacao-do-relevo",
  gleba: TERRENO_ESCOLHIDO,
  nuvem: { curvas: curvas.length, vertices: nuvem.length, equidistancia_m: EQUIDISTANCIA },
};

// ── 1 · o Testfit ──────────────────────────────────────────────────────────
//
// IDW global é O(n) por amostra: 9 448 pontos × as amostras. Um passo de 10 m
// já dá milhares de amostras e alguns segundos — suficiente para a estatística,
// e é por isso que o passo aqui é maior que o dos outros dois.
{
  const campo = campoRelevoDoTestfit(nuvem);
  const t0 = performance.now();
  const r = estatisticas((p) => campo(p), caixa, 10, EQUIDISTANCIA);
  const ms = performance.now() - t0;
  resultados["testfit"] = { ...r, passoDeAmostra_m: 10, ms: Number(ms.toFixed(0)) };
  console.log(`1 · campoRelevo do Testfit (IDW global sobre ${nuvem.length} pontos) — ${ms.toFixed(0)} ms`);
  console.log(`   sobre valor de curva: ${r.sobreValorDeCurva_pct} %  ·  gradiente zero: ${r.gradienteZero_pct} %`);
  console.log(`   declividade: p10 ${r.declividade_pct.p10} · mediana ${r.declividade_pct.mediana} · p90 ${r.declividade_pct.p90} · máx ${r.declividade_pct.maxima} %\n`);
}

// ── 2 · o Generate ─────────────────────────────────────────────────────────
{
  const t0 = performance.now();
  const modelo = criarModeloRelevo(nuvem, { passo: 10 });
  const ms = performance.now() - t0;
  if (!modelo) {
    resultados["generate"] = { erro: "criarModeloRelevo devolveu null" };
    console.log("2 · criarModeloRelevo do Generate: devolveu null\n");
  } else {
    const r = estatisticas((p) => modelo.elevacao(p), caixa, 10, EQUIDISTANCIA);
    resultados["generate"] = {
      ...r,
      passoPedido_m: 10,
      passoAplicado_m: Number(modelo.passo.toFixed(2)),
      espacamentoDoDado_m: Number(modelo.espacamentoDoDado.toFixed(2)),
      ms: Number(ms.toFixed(0)),
    };
    console.log(`2 · criarModeloRelevo do Generate (k=6 vizinhos, piso de passo) — ${ms.toFixed(0)} ms`);
    console.log(`   passo pedido 10 m · passo aplicado ${modelo.passo.toFixed(2)} m · espaçamento do dado ${modelo.espacamentoDoDado.toFixed(2)} m`);
    console.log(`   sobre valor de curva: ${r.sobreValorDeCurva_pct} %  ·  gradiente zero: ${r.gradienteZero_pct} %`);
    console.log(`   declividade: p10 ${r.declividade_pct.p10} · mediana ${r.declividade_pct.mediana} · p90 ${r.declividade_pct.p90} · máx ${r.declividade_pct.maxima} %\n`);
  }
}

// ── 3 · o LAB-01 corrigido, como referência ────────────────────────────────
{
  const arq = JSON.parse(
    readFileSync(join(RAIZ, "docs", "terrenos", `${TERRENO_ESCOLHIDO}.geojson`), "utf8"),
  );
  const terreno = lerTerrenoGeo(arq, "diagnóstico LAB-07");
  const t0 = performance.now();
  const mapa = montarAlturas(terreno, 2);
  const ms = performance.now() - t0;
  const r = estatisticas(
    (p) => {
      const m = paraMotor(mapa, p);
      const ix = Math.floor(m.x / mapa.celula_m);
      const iz = Math.floor(m.z / mapa.celula_m);
      if (ix < 0 || iz < 0 || ix >= mapa.nx || iz >= mapa.ny) return null;
      return mapa.alturas[iz * mapa.nx + ix] ?? null;
    },
    caixa,
    10,
    EQUIDISTANCIA,
  );
  resultados["lab01Corrigido"] = { ...r, passoDeGrade_m: 2, ms: Number(ms.toFixed(0)) };
  console.log(`3 · montarAlturas do LAB-01 (entre níveis distintos — a correção) — ${ms.toFixed(0)} ms`);
  console.log(`   sobre valor de curva: ${r.sobreValorDeCurva_pct} %  ·  gradiente zero: ${r.gradienteZero_pct} %`);
  console.log(`   declividade: p10 ${r.declividade_pct.p10} · mediana ${r.declividade_pct.mediana} · p90 ${r.declividade_pct.p90} · máx ${r.declividade_pct.maxima} %`);
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "diagnostico-relevo.json"),
  `${JSON.stringify(resultados, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-07/diagnostico-relevo.json`);
