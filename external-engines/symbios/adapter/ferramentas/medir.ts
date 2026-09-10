#!/usr/bin/env node
/**
 * As medições obrigatórias da seção 4 do prompt LAB-01.
 *
 * ```shell
 * node --experimental-strip-types ferramentas/medir.ts
 * ```
 *
 * Escreve `outputs/lab01/medicoes.json` (números crus, para o relatório não
 * depender de transcrição à mão) e um `.geojson` por terreno. O que sai no
 * terminal é o mesmo conteúdo, legível.
 *
 * Tudo o que é medido aqui está pedido no prompt, e nada é estimado: tempo por
 * estágio, contagem e comprimento de vias, distribuição de rampas, contagem e
 * área de quadras, fração fora da gleba, ida e volta georreferenciada,
 * determinismo, escada de tamanho, e a conferência da rampa contra a
 * declividade da superfície original.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  gerarRedeViaria,
  lerTerrenoGeo,
  Motor,
  montarAlturas,
  paraGeoJSON,
  paraArchilly,
  paraMotor,
  projetar,
  reverter,
  resolverParametros,
  type Parametros,
  type Resultado,
  type Terreno,
} from "../src/index.ts";
import { escadaDeTamanho, gerar } from "./terrenos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..", "..");
const SAIDA = join(RAIZ, "outputs", "lab01");
mkdirSync(SAIDA, { recursive: true });

const WASM = join(
  import.meta.dirname,
  "..",
  "..",
  "archilly",
  "wasm",
  "target",
  "wasm32-unknown-unknown",
  "release",
  "archilly_symbios_wasm.wasm",
);

const n2 = (v: number) => Number(v.toFixed(2));
const n4 = (v: number) => Number(v.toFixed(4));
const pct = (v: number) => `${(v * 100).toFixed(2)} %`;

/** Percentis de uma lista já ordenada. */
function percentil(ordenada: number[], q: number): number {
  if (ordenada.length === 0) return 0;
  return ordenada[Math.min(ordenada.length - 1, Math.floor((ordenada.length - 1) * q))]!;
}

interface Medicao {
  terreno: string;
  procedencia: string;
  area_ha: number;
  desnivel_m: number;
  grade: { nx: number; ny: number; celula_m: number; mundo_m: [number, number] };
  tempos: Resultado["diagnostico"]["tempos"];
  vias: {
    total: number;
    principais: number;
    locais: number;
    comprimentoTotal_m: number;
    comprimentoMediano_m: number;
    rampa: { mediana_pct: number; p90_pct: number; maxima_pct: number };
    acimaDaRampaPedida: number;
    fracaoForaDaGleba: number;
  };
  quadras: {
    total: number;
    area: { minima_m2: number; mediana_m2: number; maxima_m2: number; total_m2: number };
    fracaoForaDaGleba: number;
  };
  fracaoGradeForaDaGleba: number;
  hash: string;
  avisos: string[];
}

function medirTerreno(
  motor: Motor,
  terreno: Terreno,
  parametros: Parametros,
  seed: number,
): { medicao: Medicao; resultado: Resultado } {
  const r = gerarRedeViaria(motor, terreno, parametros, seed);
  const p = resolverParametros(parametros);

  const comps = r.vias.map((v) => v.comprimento_m).sort((a, b) => a - b);
  const rampas = r.vias.map((v) => v.rampaMaxima_pct).sort((a, b) => a - b);
  const areas = r.quadras.map((q) => q.area_m2).sort((a, b) => a - b);

  return {
    resultado: r,
    medicao: {
      terreno: terreno.nome,
      procedencia: terreno.procedencia,
      area_ha: n4(r.diagnostico.areaGleba_m2 / 10_000),
      desnivel_m: n2(r.diagnostico.cotas_m.max - r.diagnostico.cotas_m.min),
      grade: r.diagnostico.grade,
      tempos: {
        alturas_ms: n2(r.diagnostico.tempos.alturas_ms),
        vias_ms: n2(r.diagnostico.tempos.vias_ms),
        racionalizacao_ms: n2(r.diagnostico.tempos.racionalizacao_ms),
        quadras_ms: n2(r.diagnostico.tempos.quadras_ms),
        traducaoDeVolta_ms: n2(r.diagnostico.tempos.traducaoDeVolta_ms),
        total_ms: n2(r.diagnostico.tempos.total_ms),
      },
      vias: {
        total: r.vias.length,
        principais: r.vias.filter((v) => v.tipo === "principal").length,
        locais: r.vias.filter((v) => v.tipo === "local").length,
        comprimentoTotal_m: n2(r.diagnostico.comprimentoTotalVias_m),
        comprimentoMediano_m: n2(percentil(comps, 0.5)),
        rampa: {
          mediana_pct: n2(percentil(rampas, 0.5)),
          p90_pct: n2(percentil(rampas, 0.9)),
          maxima_pct: n2(rampas.at(-1) ?? 0),
        },
        acimaDaRampaPedida: r.diagnostico.trechosAcimaDaRampa,
        fracaoForaDaGleba: n4(r.diagnostico.fracaoViasForaDaGleba),
      },
      quadras: {
        total: r.quadras.length,
        area: {
          minima_m2: n2(areas[0] ?? 0),
          mediana_m2: n2(percentil(areas, 0.5)),
          maxima_m2: n2(areas.at(-1) ?? 0),
          total_m2: n2(areas.reduce((s, a) => s + a, 0)),
        },
        fracaoForaDaGleba: n4(r.diagnostico.fracaoQuadrasForaDaGleba),
      },
      fracaoGradeForaDaGleba: n4(r.diagnostico.fracaoGradeForaDaGleba),
      hash: r.diagnostico.hash,
      avisos: [...r.diagnostico.avisos, ...(p.extrairQuadras ? [] : ["quadras não extraídas"])],
    },
  };
}

// ------------------------------------------------------- ida e volta em graus

/**
 * A prova de ida e volta georreferenciada que a seção 4 pede.
 *
 * Um ponto conhecido do terreno atravessa **as duas conversões que o adaptador
 * faz** — graus → metros locais → mundo do motor, e de volta — e o erro é medido
 * em metros no plano local. Meta do prompt: menos de 0,01 m.
 *
 * Os pontos escolhidos são os vértices da gleba e o centróide dela: vértice é
 * onde o erro de projeção é maior (mais longe da origem) e centróide é onde ele
 * deveria ser exatamente zero, porque é a origem.
 */
function provaDeIdaEVolta(terreno: Terreno, passoGrade_m: number) {
  const mapa = montarAlturas(terreno, passoGrade_m);
  const centro = terreno.gleba.externo.reduce(
    (s, p) => ({
      x: s.x + p.x / terreno.gleba.externo.length,
      y: s.y + p.y / terreno.gleba.externo.length,
    }),
    { x: 0, y: 0 },
  );
  const amostras = [...terreno.gleba.externo, centro];

  let piorGraus = 0;
  let piorMotor = 0;
  let piorCompleto = 0;
  for (const p of amostras) {
    // Volta 1: metros → graus → metros.
    const g = reverter(p, terreno.origem);
    const volta1 = projetar(g, terreno.origem);
    piorGraus = Math.max(piorGraus, Math.hypot(volta1.x - p.x, volta1.y - p.y));

    // Volta 2: metros locais → mundo do motor → metros locais.
    const m = paraMotor(mapa, p);
    const volta2 = paraArchilly(mapa, m.x, m.z);
    piorMotor = Math.max(piorMotor, Math.hypot(volta2.x - p.x, volta2.y - p.y));

    // A cadeia inteira, que é o que o adaptador de fato percorre.
    const mm = paraMotor(mapa, projetar(reverter(p, terreno.origem), terreno.origem));
    const completo = paraArchilly(mapa, mm.x, mm.z);
    piorCompleto = Math.max(piorCompleto, Math.hypot(completo.x - p.x, completo.y - p.y));
  }
  return {
    amostras: amostras.length,
    erroGraus_m: piorGraus,
    erroMotor_m: piorMotor,
    erroCadeiaCompleta_m: piorCompleto,
    meta_m: 0.01,
    passou: piorCompleto < 0.01,
  };
}

/**
 * Confere a rampa das vias contra a declividade da superfície original.
 *
 * O prompt pede isso: "a rampa das vias devolvidas tem que ser coerente com a
 * declividade que o Geo já mediu no mesmo lugar". A conferência compara, em cada
 * vértice de via, a cota que o motor carimbou no nó com a cota interpolada do
 * mapa de alturas no mesmo ponto.
 *
 * **A divergência é esperada e é o ponto.** O motor *terraplena*: o estágio de
 * racionalização suaviza o perfil e aplica o clamp de rampa, então a via corta
 * morro e aterra baixada de propósito. Se as duas cotas batessem, o clamp não
 * estaria funcionando. O que se mede aqui é de quanto é esse corte — e é isso que
 * diz se a rampa devolvida é plausível ou é fantasia.
 */
function conferirRampaContraRelevo(terreno: Terreno, r: Resultado, passoGrade_m: number) {
  const mapa = montarAlturas(terreno, passoGrade_m);
  const difs: number[] = [];
  const declividadesSuperficie: number[] = [];

  for (const via of r.vias) {
    for (let i = 0; i < via.pontos.length; i++) {
      const p = via.pontos[i]!;
      const m = paraMotor(mapa, p);
      const ix = Math.floor(m.x / mapa.celula_m);
      const iz = Math.floor(m.z / mapa.celula_m);
      if (ix < 1 || iz < 1 || ix >= mapa.nx - 1 || iz >= mapa.ny - 1) continue;
      const terreno_z = mapa.alturas[iz * mapa.nx + ix]!;
      difs.push(Math.abs(via.cotas_m[i]! - terreno_z));

      // Declividade da superfície por diferença central, em porcento — a mesma
      // definição que `declividade()` do Generate usa.
      const dzdx =
        (mapa.alturas[iz * mapa.nx + ix + 1]! - mapa.alturas[iz * mapa.nx + ix - 1]!) /
        (2 * mapa.celula_m);
      const dzdy =
        (mapa.alturas[(iz + 1) * mapa.nx + ix]! - mapa.alturas[(iz - 1) * mapa.nx + ix]!) /
        (2 * mapa.celula_m);
      declividadesSuperficie.push(Math.hypot(dzdx, dzdy) * 100);
    }
  }
  difs.sort((a, b) => a - b);
  declividadesSuperficie.sort((a, b) => a - b);
  const rampas = r.vias.map((v) => v.rampaMaxima_pct).sort((a, b) => a - b);

  return {
    amostras: difs.length,
    corteAterro: {
      mediana_m: n2(percentil(difs, 0.5)),
      p90_m: n2(percentil(difs, 0.9)),
      maximo_m: n2(difs.at(-1) ?? 0),
    },
    declividadeDaSuperficie: {
      mediana_pct: n2(percentil(declividadesSuperficie, 0.5)),
      p90_pct: n2(percentil(declividadesSuperficie, 0.9)),
      maxima_pct: n2(declividadesSuperficie.at(-1) ?? 0),
    },
    rampaDasVias: {
      mediana_pct: n2(percentil(rampas, 0.5)),
      p90_pct: n2(percentil(rampas, 0.9)),
      maxima_pct: n2(rampas.at(-1) ?? 0),
    },
  };
}

// ------------------------------------------------------------------- execução

const motor = await Motor.carregar(readFileSync(WASM));
console.log(`motor carregado: ${readFileSync(WASM).byteLength} bytes\n`);

const resultados: Record<string, unknown> = {
  prompt: "LAB-01",
  geradoEm: new Date().toISOString(),
  ambiente: { node: process.version, plataforma: `${process.platform}-${process.arch}` },
  wasm_bytes: readFileSync(WASM).byteLength,
};

// ---- 1. os quatro terrenos de prova --------------------------------------
const TERRENOS = ["pequeno", "completo", "sintetico-10ha-plano", "sintetico-50ha-ondulado"];
const medicoes: Medicao[] = [];
const idaEVolta: Record<string, unknown> = {};
const rampaVsRelevo: Record<string, unknown> = {};

console.log("=== TERRENOS DE PROVA ===");
for (const id of TERRENOS) {
  const arq = JSON.parse(readFileSync(join(RAIZ, "docs", "terrenos", `${id}.geojson`), "utf8"));
  const terreno = lerTerrenoGeo(arq, arq.archilly?.procedencia ?? `docs/terrenos/${id}.geojson`);

  const { medicao, resultado } = medirTerreno(motor, terreno, {}, 42);
  medicoes.push(medicao);
  idaEVolta[id] = provaDeIdaEVolta(terreno, 2);
  rampaVsRelevo[id] = conferirRampaContraRelevo(terreno, resultado, 2);

  writeFileSync(
    join(SAIDA, `${id}.geojson`),
    `${JSON.stringify(paraGeoJSON(resultado, terreno), null, 1)}\n`,
    "utf8",
  );

  console.log(
    `\n${id} — ${medicao.area_ha} ha, desnível ${medicao.desnivel_m} m, ` +
      `grade ${medicao.grade.nx}×${medicao.grade.ny} (mundo ${medicao.grade.mundo_m[0].toFixed(0)}×` +
      `${medicao.grade.mundo_m[1].toFixed(0)} m)`,
  );
  console.log(
    `  tempos (ms): alturas ${medicao.tempos.alturas_ms} · vias ${medicao.tempos.vias_ms} · ` +
      `racionalização ${medicao.tempos.racionalizacao_ms} · quadras ${medicao.tempos.quadras_ms} · ` +
      `volta ${medicao.tempos.traducaoDeVolta_ms} · TOTAL ${medicao.tempos.total_ms}`,
  );
  console.log(
    `  vias: ${medicao.vias.total} (${medicao.vias.principais} principais, ` +
      `${medicao.vias.locais} locais), ${medicao.vias.comprimentoTotal_m} m no total, ` +
      `mediana ${medicao.vias.comprimentoMediano_m} m`,
  );
  console.log(
    `  rampa: mediana ${medicao.vias.rampa.mediana_pct} % · p90 ${medicao.vias.rampa.p90_pct} % · ` +
      `máx ${medicao.vias.rampa.maxima_pct} % · ACIMA DO PEDIDO: ${medicao.vias.acimaDaRampaPedida}`,
  );
  console.log(
    `  quadras: ${medicao.quadras.total}, área min ${medicao.quadras.area.minima_m2} / ` +
      `mediana ${medicao.quadras.area.mediana_m2} / máx ${medicao.quadras.area.maxima_m2} m²`,
  );
  console.log(
    `  fora da gleba: grade ${pct(medicao.fracaoGradeForaDaGleba)} · ` +
      `vias ${pct(medicao.vias.fracaoForaDaGleba)} · quadras ${pct(medicao.quadras.fracaoForaDaGleba)}`,
  );
  const iv = idaEVolta[id] as { erroCadeiaCompleta_m: number; passou: boolean };
  console.log(
    `  ida e volta: pior erro ${iv.erroCadeiaCompleta_m.toExponential(2)} m — ` +
      `${iv.passou ? "PASSA" : "FALHA"} (meta < 0,01 m)`,
  );
  for (const a of medicao.avisos) console.log(`  aviso: ${a}`);
}
resultados["terrenos"] = medicoes;
resultados["idaEVolta"] = idaEVolta;
resultados["rampaVsRelevo"] = rampaVsRelevo;

// ---- 2. determinismo -----------------------------------------------------
console.log("\n=== DETERMINISMO ===");
const arqDet = JSON.parse(
  readFileSync(join(RAIZ, "docs", "terrenos", "sintetico-50ha-ondulado.geojson"), "utf8"),
);
const tDet = lerTerrenoGeo(arqDet, "determinismo");
const a1 = gerarRedeViaria(motor, tDet, {}, 42).diagnostico.hash;
const a2 = gerarRedeViaria(motor, tDet, {}, 42).diagnostico.hash;
const b1 = gerarRedeViaria(motor, tDet, {}, 7).diagnostico.hash;
console.log(`  seed 42, execução 1: ${a1}`);
console.log(`  seed 42, execução 2: ${a2}`);
console.log(`  seed  7, execução 3: ${b1}`);
console.log(
  `  mesma seed -> ${a1 === a2 ? "MESMA saída" : "saída DIVERGENTE"}; ` +
    `seed diferente -> ${a1 !== b1 ? "saída diferente" : "MESMA saída (seed sem efeito!)"}`,
);
resultados["determinismo"] = {
  terreno: "sintetico-50ha-ondulado",
  seed42_execucao1: a1,
  seed42_execucao2: a2,
  seed7: b1,
  deterministico: a1 === a2,
  seedTemEfeito: a1 !== b1,
};

// ---- 3. escada de tamanho ------------------------------------------------
console.log("\n=== ESCADA DE TAMANHO ===");
console.log(
  `  ${"ha".padStart(5)} ${"grade".padStart(11)} ${"nós".padStart(7)} ${"vias".padStart(6)} ` +
    `${"quadras".padStart(8)} ${"alturas".padStart(9)} ${"vias ms".padStart(9)} ` +
    `${"racion ms".padStart(11)} ${"TOTAL ms".padStart(10)}`,
);
const escada: unknown[] = [];
for (const receita of escadaDeTamanho([10, 50, 100, 200])) {
  const terreno = lerTerrenoGeo(gerar(receita), receita.procedencia);
  const { medicao } = medirTerreno(motor, terreno, {}, 42);
  const ha = Number(receita.id.match(/(\d+)ha/)![1]);
  escada.push({
    hectares: ha,
    grade: medicao.grade,
    vias: medicao.vias.total,
    comprimentoTotal_m: medicao.vias.comprimentoTotal_m,
    quadras: medicao.quadras.total,
    areaMedianaQuadra_m2: medicao.quadras.area.mediana_m2,
    tempos: medicao.tempos,
    rampaMaxima_pct: medicao.vias.rampa.maxima_pct,
    acimaDaRampaPedida: medicao.vias.acimaDaRampaPedida,
  });
  console.log(
    `  ${String(ha).padStart(5)} ${`${medicao.grade.nx}×${medicao.grade.ny}`.padStart(11)} ` +
      `${"—".padStart(7)} ${String(medicao.vias.total).padStart(6)} ` +
      `${String(medicao.quadras.total).padStart(8)} ` +
      `${String(medicao.tempos.alturas_ms).padStart(9)} ` +
      `${String(medicao.tempos.vias_ms).padStart(9)} ` +
      `${String(medicao.tempos.racionalizacao_ms).padStart(11)} ` +
      `${String(medicao.tempos.total_ms).padStart(10)}`,
  );
}
resultados["escadaDeTamanho"] = escada;

// ---- 4. rampa pedida é respeitada? --------------------------------------
console.log("\n=== RAMPA PEDIDA ===");
const rampas: unknown[] = [];
for (const pedida of [6, 8, 10, 15]) {
  const r = gerarRedeViaria(motor, tDet, { rampaMaxima_pct: pedida }, 42);
  const max = Math.max(...r.vias.map((v) => v.rampaMaxima_pct), 0);
  rampas.push({
    pedida_pct: pedida,
    maximaObtida_pct: n2(max),
    trechosAcima: r.diagnostico.trechosAcimaDaRampa,
    vias: r.vias.length,
  });
  console.log(
    `  pedida ${String(pedida).padStart(2)} % -> máxima obtida ${max.toFixed(2).padStart(7)} %, ` +
      `${String(r.diagnostico.trechosAcimaDaRampa).padStart(4)} trecho(s) acima, ` +
      `${r.vias.length} vias`,
  );
}
resultados["rampaPedida"] = rampas;

// ---- 5. Uso C: quadras a partir de eixos do Archilly --------------------
//
// O LAB-00 provou que o motor extrai faces de um grafo construído fora dele. Aqui
// isso fica acessível pelo adaptador, rodando pela mesma travessia WebAssembly —
// o que confirma que a separabilidade sobreviveu ao empacotamento.
console.log("\n=== USO C: quadras a partir de eixos externos ===");
const mapaC = montarAlturas(tDet, 4);
const passo = 120;
const nosC: number[] = [];
const arestasC: number[] = [];
const indiceC: number[][] = [];
for (let iy = 0; iy < 3; iy++) {
  indiceC.push([]);
  for (let ix = 0; ix < 3; ix++) {
    indiceC[iy]!.push(nosC.length / 3);
    nosC.push(200 + ix * passo, 200 + iy * passo, 700);
  }
}
for (let iy = 0; iy < 3; iy++) {
  for (let ix = 0; ix < 3; ix++) {
    if (ix + 1 < 3) arestasC.push(indiceC[iy]![ix]!, indiceC[iy]![ix + 1]!, 0);
    if (iy + 1 < 3) arestasC.push(indiceC[iy]![ix]!, indiceC[iy + 1]![ix]!, 1);
  }
}
const usoC = motor.comSessao(
  {
    nx: mapaC.nx, ny: mapaC.ny, celula_m: mapaC.celula_m, seed: 1,
    dist_principal_m: 200, dist_local_m: 80, passo_integracao_m: 4, raio_snap_m: 5,
    inercia_tracador: 0.8, max_passos_traco: 300, tolerancia_rdp_m: 1,
    raio_filete_principal_m: 20, raio_filete_local_m: 10, segmentos_filete: 6,
    passes_suavizacao_cota: 0, rampa_maxima: 0.1, tolerancia_convergencia: 1e-2,
  },
  mapaC.alturas,
  (s) => {
    s.quadrasDeGrafoExterno(new Float32Array(nosC), new Uint32Array(arestasC));
    return s.resultado();
  },
);
const areasC = usoC.quadras.map((perim) => {
  const pts = perim.map((i) => {
    const [x, z] = usoC.nos[i]!;
    return paraArchilly(mapaC, x, z);
  });
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!;
    const q = pts[(i + 1) % pts.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2);
});
console.log(
  `  grade 3×3 de eixos (${nosC.length / 3} nós, ${arestasC.length / 3} arestas) -> ` +
    `${usoC.quadras.length} quadras de ${areasC.map((a) => a.toFixed(0)).join(", ")} m²`,
);
console.log(`  esperado: 4 quadras de ${passo * passo} m² cada`);
resultados["usoC"] = {
  nos: nosC.length / 3,
  arestas: arestasC.length / 3,
  quadras: usoC.quadras.length,
  areas_m2: areasC.map(n2),
  esperado: { quadras: 4, area_m2: passo * passo },
  confere: usoC.quadras.length === 4 && areasC.every((a) => Math.abs(a - passo * passo) < 1),
};

// ---- gravação ------------------------------------------------------------
writeFileSync(join(SAIDA, "medicoes.json"), `${JSON.stringify(resultados, null, 2)}\n`, "utf8");
console.log(`\nmedições em outputs/lab01/medicoes.json`);
console.log(`GeoJSON por terreno em outputs/lab01/`);
