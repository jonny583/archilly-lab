#!/usr/bin/env node
/**
 * Por que há trechos acima da rampa pedida?
 *
 * A medição principal acusou centenas de trechos acima dos 10 % pedidos, com
 * máximas absurdas (190 %). Antes de culpar o motor, há três hipóteses a separar,
 * e duas delas são suspeita contra o próprio adaptador:
 *
 * 1. **o encadeamento do adaptador liga nós que não são vizinhos no grafo** — aí a
 *    "rampa" medida seria entre dois pontos distantes, e o número não existiria
 *    na geometria;
 * 2. **os trechos íngremes estão fora da gleba**, em relevo que o adaptador
 *    extrapolou e que portanto é invenção dele;
 * 3. **o clamp do motor não fecha** — e aí é achado sobre o motor.
 *
 * Este diagnóstico mede a rampa **aresta por aresta, direto na saída do motor**,
 * sem passar pelo encadeamento, separa dentro de fora da gleba, e reparte por
 * grau do nó e por comprimento do segmento.
 *
 * # O que ele já respondeu (LAB-01, 10/09/2026)
 *
 * As hipóteses 1 e 2 caíram: as violações aparecem nas arestas CRUAS do motor,
 * e dentro da gleba tanto quanto fora. A 3 é a certa, com uma precisão que vale
 * mais que ela:
 *
 * - **ao longo de uma cadeia (nó de grau 2) o clamp fecha**: a pior rampa medida
 *   foi 10,06 % contra 10 % pedidos, que é aritmética de `f32`, não violação;
 * - **nos cruzamentos (grau 3 ou mais) o clamp não chega**: ali aparecem 49 %,
 *   68 %, 161 %, 174 %;
 * - **não é falta de convergência**: 10 passes e 1 000 passes, tolerância 1e-2 e
 *   0, dão resultado idêntico (1 104 contra 1 103 arestas acima). O limite é
 *   estrutural, não numérico.
 *
 * A leitura é que o clamp do motor opera por cadeia, e um nó compartilhado por
 * várias cadeias não pode ser movido sem quebrar as outras. Conferir rampa é,
 * portanto, trabalho do Validator — e é no cruzamento que ele tem de olhar.
 *
 * ```shell
 * node --experimental-strip-types ferramentas/diagnostico-rampa.ts
 * ```
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  dentroDoPoligono,
  lerTerrenoGeo,
  montarAlturas,
  Motor,
  paraArchilly,
  resolverParametros,
} from "../src/index.ts";
import { traduzirParaMotor } from "../src/parametros.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..", "..");
const WASM = join(
  import.meta.dirname, "..", "..", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const n2 = (v: number) => Number(v.toFixed(2));
const percentil = (ord: number[], q: number) =>
  ord.length === 0 ? 0 : ord[Math.min(ord.length - 1, Math.floor((ord.length - 1) * q))]!;

const motor = await Motor.carregar(readFileSync(WASM));
const relatorio: Record<string, unknown> = { prompt: "LAB-01", diagnostico: "rampa" };

for (const id of ["sintetico-50ha-ondulado", "completo"]) {
  const arq = JSON.parse(readFileSync(join(RAIZ, "docs", "terrenos", `${id}.geojson`), "utf8"));
  const terreno = lerTerrenoGeo(arq, id);
  const p = resolverParametros({});
  const mapa = montarAlturas(terreno, p.passoGrade_m);
  const pedido = traduzirParaMotor(p, mapa, 42);

  // Duas variantes, para isolar o estágio: com e sem racionalização. A rampa é
  // clampada DENTRO da racionalização, então sem ela não há clamp nenhum — é a
  // linha de base contra a qual o clamp tem de mostrar efeito.
  for (const racionalizar of [false, true]) {
    const r = motor.comSessao(pedido, mapa.alturas, (s) => {
      s.gerarVias();
      if (racionalizar) s.racionalizar();
      return s.resultado();
    });

    const dentro: number[] = [];
    const fora: number[] = [];
    const cortes: number[] = [];
    let comprimentoDentro = 0;
    let comprimentoFora = 0;

    for (const [a, b] of r.arestas) {
      const na = r.nos[a]!;
      const nb = r.nos[b]!;
      const pa = paraArchilly(mapa, na[0], na[1]);
      const pb = paraArchilly(mapa, nb[0], nb[1]);
      const d = Math.hypot(pb.x - pa.x, pb.y - pa.y);
      if (d < 1e-6) continue;
      // A rampa da ARESTA do motor: dois nós que o grafo declara vizinhos.
      const rampa = (Math.abs(nb[2] - na[2]) / d) * 100;

      const aDentro = dentroDoPoligono(pa, terreno.gleba);
      const bDentro = dentroDoPoligono(pb, terreno.gleba);
      if (aDentro && bDentro) {
        dentro.push(rampa);
        comprimentoDentro += d;
      } else {
        fora.push(rampa);
        comprimentoFora += d;
      }

      // Corte/aterro: de quanto o nó está acima ou abaixo do terreno.
      for (const [no, ponto] of [
        [na, pa],
        [nb, pb],
      ] as const) {
        const ix = Math.floor((ponto.x - mapa.origemMundo.x) / mapa.celula_m);
        const iz = Math.floor((mapa.ny * mapa.celula_m - (ponto.y - mapa.origemMundo.y)) / mapa.celula_m);
        if (ix < 0 || iz < 0 || ix >= mapa.nx || iz >= mapa.ny) continue;
        cortes.push(Math.abs(no[2] - mapa.alturas[iz * mapa.nx + ix]!));
      }
    }

    dentro.sort((a, b) => a - b);
    fora.sort((a, b) => a - b);
    cortes.sort((a, b) => a - b);

    // Onde, exatamente, estão as violações: por grau do nó e por comprimento do
    // segmento. É esta repartição que separa "o clamp não funciona" de "o clamp
    // não cobre os cruzamentos".
    const grau = new Int32Array(r.nos.length);
    for (const [a, b] of r.arestas) {
      grau[a]!; grau[a] = grau[a]! + 1; grau[b] = grau[b]! + 1;
    }
    const FAIXAS: [number, number][] = [[0, 2], [2, 5], [5, 10], [10, 20], [20, Infinity]];
    const porGrau = new Map<number, { arestas: number; acima: number; soma: number; max: number }>();
    const porFaixa = FAIXAS.map(() => ({ arestas: 0, acima: 0, max: 0, comprimento_m: 0 }));
    let compTotal = 0;
    let compAcima = 0;

    for (const [a, b] of r.arestas) {
      const na = r.nos[a]!;
      const nb = r.nos[b]!;
      const pa = paraArchilly(mapa, na[0], na[1]);
      const pb = paraArchilly(mapa, nb[0], nb[1]);
      const d = Math.hypot(pb.x - pa.x, pb.y - pa.y);
      if (d < 1e-6) continue;
      if (!dentroDoPoligono(pa, terreno.gleba) || !dentroDoPoligono(pb, terreno.gleba)) continue;
      const rampa = (Math.abs(nb[2] - na[2]) / d) * 100;
      const viola = rampa > p.rampaMaxima_pct + 0.5;
      compTotal += d;
      if (viola) compAcima += d;

      const g = Math.min(4, Math.max(grau[a]!, grau[b]!));
      const e = porGrau.get(g) ?? { arestas: 0, acima: 0, soma: 0, max: 0 };
      e.arestas++;
      if (viola) e.acima++;
      e.soma += rampa;
      e.max = Math.max(e.max, rampa);
      porGrau.set(g, e);

      const fi = FAIXAS.findIndex(([lo, hi]) => d >= lo && d < hi);
      const f = porFaixa[fi]!;
      f.arestas++;
      if (viola) f.acima++;
      f.max = Math.max(f.max, rampa);
      f.comprimento_m += d;
    }

    const resumo = {
      terreno: id,
      racionalizado: racionalizar,
      rampaPedida_pct: p.rampaMaxima_pct,
      arestas: r.arestas.length,
      dentroDaGleba: {
        arestas: dentro.length,
        comprimento_m: n2(comprimentoDentro),
        mediana_pct: n2(percentil(dentro, 0.5)),
        p90_pct: n2(percentil(dentro, 0.9)),
        p99_pct: n2(percentil(dentro, 0.99)),
        maxima_pct: n2(dentro.at(-1) ?? 0),
        acimaDoPedido: dentro.filter((x) => x > p.rampaMaxima_pct + 1e-6).length,
        fracaoAcimaDoPedido: n2(
          dentro.length ? dentro.filter((x) => x > p.rampaMaxima_pct).length / dentro.length : 0,
        ),
      },
      foraDaGleba: {
        arestas: fora.length,
        comprimento_m: n2(comprimentoFora),
        mediana_pct: n2(percentil(fora, 0.5)),
        maxima_pct: n2(fora.at(-1) ?? 0),
        acimaDoPedido: fora.filter((x) => x > p.rampaMaxima_pct + 1e-6).length,
      },
      corteAterro: {
        mediana_m: n2(percentil(cortes, 0.5)),
        p90_m: n2(percentil(cortes, 0.9)),
        maximo_m: n2(cortes.at(-1) ?? 0),
      },
      comprimentoDentro_m: n2(compTotal),
      comprimentoAcimaDoPedido_m: n2(compAcima),
      fracaoComprimentoAcima: n2(compTotal > 0 ? compAcima / compTotal : 0),
      porGrauDoNo: [...porGrau.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([g, e]) => ({
          grau: g >= 4 ? ">=4" : String(g),
          arestas: e.arestas,
          acima: e.acima,
          fracaoAcima: n2(e.acima / e.arestas),
          rampaMedia_pct: n2(e.soma / e.arestas),
          rampaMaxima_pct: n2(e.max),
        })),
      porComprimentoDoSegmento: FAIXAS.map(([lo, hi], i) => ({
        faixa_m: `${lo}–${hi === Infinity ? "∞" : hi}`,
        ...porFaixa[i]!,
        comprimento_m: n2(porFaixa[i]!.comprimento_m),
        rampaMaxima_pct: n2(porFaixa[i]!.max),
      })).filter((f) => f.arestas > 0),
    };
    relatorio[`${id}-${racionalizar ? "racionalizado" : "cru"}`] = resumo;

    console.log(
      `\n${id} — ${racionalizar ? "COM racionalização (clamp ativo)" : "SEM racionalização (sem clamp)"}`,
    );
    console.log(`  arestas: ${resumo.arestas}`);
    console.log(
      `  DENTRO da gleba (${resumo.dentroDaGleba.arestas} arestas, ` +
        `${resumo.dentroDaGleba.comprimento_m} m): mediana ${resumo.dentroDaGleba.mediana_pct} % · ` +
        `p90 ${resumo.dentroDaGleba.p90_pct} % · p99 ${resumo.dentroDaGleba.p99_pct} % · ` +
        `máx ${resumo.dentroDaGleba.maxima_pct} %`,
    );
    console.log(
      `    acima dos ${p.rampaMaxima_pct} % pedidos: ${resumo.dentroDaGleba.acimaDoPedido} arestas ` +
        `(${(resumo.dentroDaGleba.fracaoAcimaDoPedido * 100).toFixed(1)} %)`,
    );
    console.log(
      `  FORA da gleba (${resumo.foraDaGleba.arestas} arestas): ` +
        `mediana ${resumo.foraDaGleba.mediana_pct} % · máx ${resumo.foraDaGleba.maxima_pct} % · ` +
        `${resumo.foraDaGleba.acimaDoPedido} acima`,
    );
    console.log(
      `  corte/aterro contra o terreno: mediana ${resumo.corteAterro.mediana_m} m · ` +
        `p90 ${resumo.corteAterro.p90_m} m · máx ${resumo.corteAterro.maximo_m} m`,
    );
    console.log(
      `  comprimento dentro ${resumo.comprimentoDentro_m} m, acima do pedido ` +
        `${resumo.comprimentoAcimaDoPedido_m} m (${(resumo.fracaoComprimentoAcima * 100).toFixed(1)} %)`,
    );
    console.log("  por GRAU do nó mais conectado da aresta (tolerância 0,5 pp):");
    for (const g of resumo.porGrauDoNo) {
      console.log(
        `    grau ${g.grau.padEnd(3)} ${String(g.arestas).padStart(6)} arestas · ` +
          `${String(g.acima).padStart(5)} acima (${(g.fracaoAcima * 100).toFixed(1)} %) · ` +
          `média ${g.rampaMedia_pct.toFixed(2)} % · MÁX ${g.rampaMaxima_pct.toFixed(2)} %`,
      );
    }
    console.log("  por COMPRIMENTO do segmento:");
    for (const f of resumo.porComprimentoDoSegmento) {
      console.log(
        `    ${f.faixa_m.padStart(7)} m ${String(f.arestas).padStart(6)} arestas · ` +
          `${String(f.acima).padStart(5)} acima · máx ${f.rampaMaxima_pct.toFixed(2)} % · ` +
          `${f.comprimento_m.toFixed(0)} m`,
      );
    }
  }
}

writeFileSync(
  join(RAIZ, "outputs", "lab01", "diagnostico-rampa.json"),
  `${JSON.stringify(relatorio, null, 2)}\n`,
  "utf8",
);
console.log("\noutputs/lab01/diagnostico-rampa.json");
