#!/usr/bin/env bun
/**
 * LAB-05 — reconectar, recortar a quadra, descartar a lasca.
 *
 * ```sh
 * bun ferramentas/lab05.ts
 * ```
 *
 * # As três coisas que o prompt pediu, e o que cada uma virou
 *
 * 1. **Reconectar a rede depois do corte.** `geo-antonina` fragmenta a 70,4 %,
 *    e o prompt tratava isso como defeito a consertar. **Medido, não é:** os
 *    dois blocos estão separados por uma **APP hídrica de 14,4 ha**, e o vão
 *    mais curto entre eles — 72,45 m — está 200 de 201 pontos amostrados
 *    **dentro da APP**. Ligar os dois é lançar rua sobre APP, que é decisão de
 *    urbanismo e não é do Lab (CLAUDE.md §4). O que sobra de fragmentação
 *    genuína são farelos, e é a D48 que os trata.
 * 2. **Recortar a quadra que atravessa a divisa.** Feito, com um recortador de
 *    polígono de verdade (`@symbios/poligono.ts`).
 * 3. **Descartar a lasca pela D48.** Feito, com a régua da própria gleba.
 *
 * # Por que cinco glebas, e não três
 *
 * As **três do LAB-02** (`completo`, `sintetico-50ha-ondulado`,
 * `sintetico-10ha-plano`) são onde o antes-e-depois do recorte é comparável com
 * o que já foi publicado. As **duas glebas-padrão com relevo** são onde o Judge
 * do Generate julga lote, desde o LAB-04. Medir só um dos dois conjuntos
 * deixaria metade da pergunta sem resposta.
 *
 * # As duas passagens
 *
 * O CLAUDE.md §4 manda: conserto do Lab é declarado, vem **desligado por
 * padrão**, e a medição sai **com e sem**. É o que esta ferramenta faz — cada
 * gleba é medida duas vezes, e as duas vão para o JSON.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { gerarRedeViaria, Motor, recortarPelaGleba } from "@symbios/index.ts";
import type { Ponto, Terreno } from "@symbios/contrato.ts";
import { areaPoligono, dentroDoPoligono } from "@symbios/geo.ts";
import type { ResultadoRecorte } from "@symbios/recorte.ts";

import {
  montarParcelamentoExterno,
  montarRelatorio,
} from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { symbiosParaOContrato, type LoteParaOContrato } from "../src/symbios-para-contrato.ts";
import { lotearQuadra, type EixoDeVia } from "../src/lotear.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-05");
const CONTRATOS = join(RAIZ, "docs", "contratos", "saidas");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-15T00:00:00.000Z";
/** A folga de divisa do contrato de motor: 5 cm. */
const FOLGA_DIVISA_M = 0.05;

const n2 = (v: number) => Number(v.toFixed(2));
const pc = (a: number, b: number) => (b > 0 ? Number(((100 * a) / b).toFixed(2)) : 0);

/** Distância de um ponto a um segmento. */
function distSeg(p: Ponto, a: Ponto, b: Ponto): number {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const L = vx * vx + vy * vy;
  if (L < 1e-18) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / L));
  return Math.hypot(p.x - (a.x + vx * t), p.y - (a.y + vy * t));
}

/**
 * A conferência independente: alguma quadra passa da divisa?
 *
 * Um vértice EM CIMA da divisa conta como "fora" num teste de ponto-em-polígono
 * — o raio o pega ou não, conforme o lado de onde sai. Por isso a régua aqui é
 * a **distância** à divisa, e não o teste booleano: o que importa é se a quadra
 * passa da folga de 5 cm do contrato, não de que lado o arredondamento caiu.
 */
function quadrasForaDaDivisa(corte: ResultadoRecorte, t: Terreno) {
  const anel = t.gleba.externo;
  let vertices = 0;
  let acimaDaFolga = 0;
  let pior = 0;
  for (const q of corte.quadras) {
    for (const p of q.pontos) {
      if (dentroDoPoligono(p, t.gleba)) continue;
      vertices++;
      let d = Infinity;
      for (let i = 0; i < anel.length; i++) {
        d = Math.min(d, distSeg(p, anel[i]!, anel[(i + 1) % anel.length]!));
      }
      if (d > FOLGA_DIVISA_M) acimaDaFolga++;
      if (d > pior) pior = d;
    }
  }
  return { vertices, acimaDaFolga, pior_m: n2(pior) };
}

function julgar(saida: unknown, entrada: EntradaMinima) {
  const l = montarParcelamentoExterno(saida as never, {
    entrada: entrada as unknown as EntradaMotorV1,
  });
  if (!l.conferencia.valido || !l.externo) {
    return { recusa: l.conferencia.erros.slice(0, 3), judge: null, validator: null };
  }
  const r = montarRelatorio(l.externo, null);
  return {
    recusa: null,
    judge: { numLotes: r.judge.numLotes, areaPrivativa_m2: n2(r.judge.areaPrivativa_m2 ?? 0) },
    validator: {
      limpo: r.validator.limpo,
      violacoes: r.validator.violacoes,
      porTipo: r.validator.porTipo,
      exemplos: (r.validator.exemplos ?? []).slice(0, 3),
    },
  };
}

/** Lota as quadras de um recorte, sem pular nenhuma. */
function lotear(corte: ResultadoRecorte, params: Parametros) {
  const vias: EixoDeVia[] = corte.vias.map((v) => ({ pontos: v.pontos, largura_m: v.faixaDominio_m }));
  const lotes: LoteParaOContrato[] = [];
  let puladasPeloEsqueleto = 0;
  let comLote = 0;
  for (let iq = 0; iq < corte.quadras.length; iq++) {
    const r = lotearQuadra(corte.quadras[iq]!.pontos, params, vias);
    if (r.puladaPorEsqueleto) puladasPeloEsqueleto++;
    if (r.lotes.length) comLote++;
    for (const l of r.lotes) {
      lotes.push({ quadraIndice: iq, pontos: l.pontos, area_m2: n2(l.area_m2), testada_m: n2(l.testada_m) });
    }
  }
  return { lotes, puladasPeloEsqueleto, comLote };
}

interface Parametros {
  areaMinLote_m2: number;
  areaAlvoLote_m2: number;
  areaMaxLote_m2: number;
  testadaMinLote_m: number;
}

const motor = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });
mkdirSync(CONTRATOS, { recursive: true });

/** As cinco glebas, e quais delas o Judge julga com lote. */
const GLEBAS: { id: string; entrada: EntradaMinima; julgaLote: boolean }[] = [
  { id: "completo", entrada: glebaDoLab("completo"), julgaLote: false },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado"), julgaLote: false },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano"), julgaLote: false },
  {
    id: "ensaio-47ha",
    entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")),
    julgaLote: true,
  },
  {
    id: "geo-antonina",
    entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")),
    julgaLote: true,
  },
];

const linhas: Record<string, unknown>[] = [];

for (const { id, entrada, julgaLote } of GLEBAS) {
  const { terreno } = glebaParaOSymbios(entrada);
  const t = terreno as Terreno;
  const bruto = gerarRedeViaria(motor, t, {}, SEMENTE);

  const p = entrada.parametros;
  const params: Parametros = {
    areaMinLote_m2: p.areaMinLote_m2 ?? 200,
    areaAlvoLote_m2: p.areaAlvoLote_m2 ?? 360,
    areaMaxLote_m2: p.areaMaxLote_m2 ?? 600,
    testadaMinLote_m: p.testadaMinLote_m ?? 10,
  };
  // D48 · o lado do lote mínimo, pela raiz quadrada. Régra da gleba, não minha.
  const ladoDoLoteMinimo_m = Math.sqrt(params.areaMinLote_m2);

  const tSem = performance.now();
  const sem = recortarPelaGleba(bruto, t);
  const msSem = performance.now() - tSem;

  const tCom = performance.now();
  const com = recortarPelaGleba(bruto, t, {
    ladoDoLoteMinimo_m,
    recortarQuadraQueAtravessa: true,
  });
  const msCom = performance.now() - tCom;

  // Determinismo: a mesma entrada, a mesma saída, peça por peça.
  const bis = recortarPelaGleba(bruto, t, { ladoDoLoteMinimo_m, recortarQuadraQueAtravessa: true });
  const determinismo =
    JSON.stringify(bis.quadras.map((q) => q.pontos)) === JSON.stringify(com.quadras.map((q) => q.pontos)) &&
    JSON.stringify(bis.vias.map((v) => v.pontos)) === JSON.stringify(com.vias.map((v) => v.pontos));

  const areaGleba = areaPoligono(t.gleba);
  const areaQueDesconta = t.restricoes
    .filter((r) => r.desconta)
    .reduce((s, r) => s + areaPoligono(r.area), 0);

  const linha: Record<string, unknown> = {
    prompt: "LAB-05",
    gleba: id,
    motor: "symbios-tensor 0.4.1",
    semente: SEMENTE,
    contrato: "1",
    areaDaGleba_m2: n2(areaGleba),
    ladoDoLoteMinimo_m: n2(ladoDoLoteMinimo_m),
    vias: {
      sem: sem.viasDepois,
      com: com.viasDepois,
      comprimentoSem_m: n2(sem.comprimentoDepois_m),
      comprimentoCom_m: n2(com.comprimentoDepois_m),
      lascasDescartadas: com.lascasDescartadas,
      comprimentoDescartado_m: n2(com.comprimentoDescartadoEmLascas_m),
      pctDoComprimentoDescartado: pc(com.comprimentoDescartadoEmLascas_m, sem.comprimentoDepois_m),
    },
    conectividade: {
      semComponentes: sem.conectividade.componentes,
      semFracaoNoMaior_pct: n2(100 * sem.conectividade.fracaoNoMaior),
      comComponentes: com.conectividade.componentes,
      comFracaoNoMaior_pct: n2(100 * com.conectividade.fracaoNoMaior),
      cruaComponentes: sem.conectividadeAntes.componentes,
      cruaFracaoNoMaior_pct: n2(100 * sem.conectividadeAntes.fracaoNoMaior),
    },
    quadras: {
      sem: sem.quadrasDepois,
      com: com.quadrasDepois,
      atravessandoSem: sem.quadrasAtravessando,
      atravessandoCom: com.quadrasAtravessando,
      recortadas: com.quadrasRecortadas,
      pecas: com.pecasDeQuadra,
      naoRecortaram: com.quadrasQueNaoRecortaram,
      areaRecortada_m2: n2(com.areaDeQuadraRecortada_m2),
      deslocamentosContraDegenerescencia: com.deslocamentosNoRecorteDeQuadra,
    },
    foraDaDivisa: { sem: quadrasForaDaDivisa(sem, t), com: quadrasForaDaDivisa(com, t) },
    ms: { sem: n2(msSem), com: n2(msCom) },
    determinismo,
  };

  // ── O Judge, onde há lote a julgar ──────────────────────────────────────
  if (julgaLote) {
    const opcoes = {
      projetoId: entrada.projeto.id,
      glebaId: entrada.gleba.id,
      areaDaGleba_m2: areaGleba,
      areaQueDesconta_m2: areaQueDesconta,
      semente: SEMENTE,
      versaoMotor: "0.4.1 + subdivisão do Lab (LAB-05)",
      geradoEm: CARIMBO,
      crs: entrada.crs as never,
      parametrosUsados: entrada.parametros,
    };

    // SEM o recorte de quadra, a quadra que atravessa TEM de ser pulada — foi o
    // que o LAB-04 fez, e é a razão de ele perder 119 quadras em `geo-antonina`.
    const viasSem: EixoDeVia[] = sem.vias.map((v) => ({ pontos: v.pontos, largura_m: v.faixaDominio_m }));
    const lotesSem: LoteParaOContrato[] = [];
    let puladasPorAtravessar = 0;
    sem.quadras.forEach((q, iq) => {
      if (q.fracaoDentroDaGleba < 1 - 1e-6) {
        puladasPorAtravessar++;
        return;
      }
      for (const l of lotearQuadra(q.pontos, params, viasSem).lotes) {
        lotesSem.push({ quadraIndice: iq, pontos: l.pontos, area_m2: n2(l.area_m2), testada_m: n2(l.testada_m) });
      }
    });

    const comLotes = lotear(com, params);

    const saidaSem = symbiosParaOContrato(sem.vias, sem.quadras, opcoes, lotesSem);
    const saidaCom = symbiosParaOContrato(com.vias, com.quadras, opcoes, comLotes.lotes);

    writeFileSync(
      join(CONTRATOS, `${id}.symbios-recortado.saida.json`),
      `${JSON.stringify(saidaCom.saida, null, 1)}\n`,
      "utf8",
    );

    const areaSem = lotesSem.reduce((s, l) => s + l.area_m2, 0);
    const areaCom = comLotes.lotes.reduce((s, l) => s + l.area_m2, 0);

    linha.loteamento = {
      sem: {
        quadrasPuladasPorAtravessar: puladasPorAtravessar,
        lotes: lotesSem.length,
        areaVendavel_m2: n2(areaSem),
        areaVendavel_pctDaGleba: pc(areaSem, areaGleba),
      },
      com: {
        quadrasPuladasPorAtravessar: 0,
        quadrasPuladasPeloEsqueleto: comLotes.puladasPeloEsqueleto,
        quadrasComLote: comLotes.comLote,
        lotes: comLotes.lotes.length,
        areaVendavel_m2: n2(areaCom),
        areaVendavel_pctDaGleba: pc(areaCom, areaGleba),
      },
    };
    linha.julgamento = { sem: julgar(saidaSem.saida, entrada), com: julgar(saidaCom.saida, entrada) };
  }

  linhas.push(linha);

  // ── o que sai na tela ───────────────────────────────────────────────────
  const v = linha.vias as Record<string, number>;
  const c = linha.conectividade as Record<string, number>;
  const q = linha.quadras as Record<string, number>;
  const f = linha.foraDaDivisa as Record<string, { vertices: number; acimaDaFolga: number; pior_m: number }>;
  console.log(`\n══════════ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha · lado do lote mínimo ${linha.ladoDoLoteMinimo_m} m ══════════`);
  console.log(`  vias ${v.sem} → ${v.com} · lascas descartadas ${v.lascasDescartadas} (${v.comprimentoDescartado_m} m, ${v.pctDoComprimentoDescartado} % do total)`);
  console.log(`  conectividade: crua ${c.cruaFracaoNoMaior_pct} % · cortada ${c.semFracaoNoMaior_pct} % (${c.semComponentes} comp) → ${c.comFracaoNoMaior_pct} % (${c.comComponentes} comp)`);
  console.log(`  quadras ${q.sem} → ${q.com} · atravessando ${q.atravessandoSem} → ${q.atravessandoCom} · recortadas ${q.recortadas} em ${q.pecas} peças · não recortaram ${q.naoRecortaram}`);
  console.log(`  área de quadra recuperada ${(q.areaRecortada_m2 / 1e4).toFixed(2)} ha · deslocamentos ${q.deslocamentosContraDegenerescencia}`);
  console.log(`  vértice de quadra além da folga de 5 cm: ${f.sem!.acimaDaFolga} (pior ${f.sem!.pior_m} m) → ${f.com!.acimaDaFolga} (pior ${f.com!.pior_m} m)`);
  console.log(`  ${(linha.ms as Record<string, number>).com} ms · determinismo ${linha.determinismo ? "OK" : "FALHOU"}`);
  if (linha.loteamento) {
    const l = linha.loteamento as Record<string, Record<string, number>>;
    const j = linha.julgamento as Record<string, { recusa: string[] | null; judge: { numLotes: number } | null; validator: { violacoes: number; porTipo: Record<string, number> } | null }>;
    console.log(`  LOTES ${l.sem!.lotes} → ${l.com!.lotes} · área vendável ${(l.sem!.areaVendavel_m2! / 1e4).toFixed(2)} → ${(l.com!.areaVendavel_m2! / 1e4).toFixed(2)} ha (${l.com!.areaVendavel_pctDaGleba} % da gleba)`);
    for (const lado of ["sem", "com"] as const) {
      const x = j[lado]!;
      if (x.recusa) console.log(`  Judge (${lado}): CONTRATO RECUSADO — ${x.recusa[0]}`);
      else console.log(`  Judge (${lado}): ${x.judge!.numLotes} lotes · Validator ${x.validator!.violacoes} violações ${JSON.stringify(x.validator!.porTipo)}`);
    }
  }
}

writeFileSync(
  join(SAIDA, "medicoes.json"),
  `${JSON.stringify({ prompt: "LAB-05", geradoEm: CARIMBO, semente: SEMENTE, glebas: linhas }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-05/medicoes.json`);
