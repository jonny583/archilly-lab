#!/usr/bin/env bun
/**
 * LAB-04 — o Symbios passa a fazer lote, e disputa o Judge.
 *
 * ```sh
 * bun ferramentas/lab04.ts
 * ```
 *
 * # O que mudou
 *
 * Até o LAB-08 o Symbios entregava rede viária e quadras, e o Judge marcava
 * **0 lotes** — ele entregava a etapa anterior à do outro motor. O esqueleto
 * reto fecha essa lacuna: as quadras limpas dele são subdivididas em lotes
 * **pelos parâmetros da gleba**, e o resultado entra na mesma disputa.
 *
 * **O que se compara passa a ser "Symbios + subdivisão do Lab"**, não o Symbios
 * sozinho. A tabela diz isso, porque comparar um motor com uma dupla sem avisar
 * seria trapaça de medição.
 *
 * # Contra quem
 *
 * - o motor do Testfit, **T02**, medido no LAB-08;
 * - o **motor interno do Generate**, pelos vereditos que acompanham as
 *   glebas-padrão.
 *
 * Mesmas glebas (as fixtures com relevo do LAB-03), mesma semente, mesmo
 * Validator, mesmo Judge.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { gerarRedeViaria, Motor, recortarPelaGleba } from "@symbios/index.ts";
import type { Terreno } from "@symbios/contrato.ts";
import { areaPoligono } from "@symbios/geo.ts";

import {
  montarParcelamentoExterno,
  montarRelatorio,
} from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { symbiosParaOContrato, type LoteParaOContrato } from "../src/symbios-para-contrato.ts";
import { lotearQuadra, type EixoDeVia } from "../src/lotear.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-04");
const CONTRATOS = join(RAIZ, "docs", "contratos", "saidas");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const DO_GENERATE = join(RAIZ, "..", "urban-create-hub-41d93a4d", "docs", "glebas-padrao");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-15T00:00:00.000Z";

const n2 = (v: number) => Number(v.toFixed(2));
const pc = (a: number, b: number) => (b > 0 ? Number(((100 * a) / b).toFixed(2)) : 0);

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

const motor = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });
mkdirSync(CONTRATOS, { recursive: true });

const linhas: Record<string, unknown>[] = [];

for (const id of ["ensaio-47ha", "geo-antonina"]) {
  const entrada: EntradaMinima = JSON.parse(
    readFileSync(join(FIXTURES, `${id}.entrada.json`), "utf8"),
  );
  const { terreno } = glebaParaOSymbios(entrada);
  const t = terreno as Terreno;

  const t0 = performance.now();
  const bruto = gerarRedeViaria(motor, t, {}, SEMENTE);
  const corte = recortarPelaGleba(bruto, t);
  const msMotor = performance.now() - t0;

  // ── O LOTEAMENTO ───────────────────────────────────────────────────────
  const vias: EixoDeVia[] = corte.vias.map((v) => ({
    pontos: v.pontos,
    largura_m: v.faixaDominio_m,
  }));
  const p = entrada.parametros;
  const params = {
    areaMinLote_m2: p.areaMinLote_m2 ?? 200,
    areaAlvoLote_m2: p.areaAlvoLote_m2 ?? 360,
    areaMaxLote_m2: p.areaMaxLote_m2 ?? 600,
    testadaMinLote_m: p.testadaMinLote_m ?? 10,
  };

  const tL = performance.now();
  const lotes: LoteParaOContrato[] = [];
  let quadrasComLote = 0;
  let quadrasPeloEsqueleto = 0;
  let quadrasSemLote = 0;
  let arestasDeFrente = 0;
  let arestasSemRua = 0;
  let porArea = 0;
  let porAreaMaxima = 0;
  let semRuaNaFatia = 0;
  let porTestada = 0;
  let porVia = 0;
  const avisos = new Map<string, number>();
  let areaDasQuadras = 0;

  let quadrasAtravessando = 0;
  corte.quadras.forEach((q, iq) => {
    // Quadra que atravessa a divisa não é loteada: o lote dela cairia fora da
    // gleba e o esquema recusa o arquivo inteiro — medido, 97 peças fora em
    // `geo-antonina`, a pior a 32 m. Recortar a quadra que atravessa é o LAB-05.
    if (q.fracaoDentroDaGleba < 1 - 1e-6) {
      quadrasAtravessando++;
      return;
    }
    areaDasQuadras += q.area_m2;
    const r = lotearQuadra(q.pontos, params, vias);
    arestasDeFrente += r.arestasDeFrente;
    arestasSemRua += r.arestasSemRua;
    porArea += r.descartadosPorArea;
    porAreaMaxima += r.descartadosPorAreaMaxima;
    semRuaNaFatia += r.descartadosPorFaltaDeRua;
    porTestada += r.descartadosPorTestada;
    porVia += r.descartadosPorVia;
    for (const a of r.avisos) avisos.set(a, (avisos.get(a) ?? 0) + 1);
    if (r.puladaPorEsqueleto) quadrasPeloEsqueleto++;
    if (r.lotes.length) quadrasComLote++;
    else quadrasSemLote++;
    for (const l of r.lotes) {
      lotes.push({
        quadraIndice: iq,
        pontos: l.pontos,
        area_m2: n2(l.area_m2),
        testada_m: n2(l.testada_m),
      });
    }
  });
  const msLote = performance.now() - tL;

  const areaGleba = areaPoligono(t.gleba);
  const areaQueDesconta = t.restricoes
    .filter((r) => r.desconta)
    .reduce((s, r) => s + areaPoligono(r.area), 0);

  const opcoes = {
    projetoId: entrada.projeto.id,
    glebaId: entrada.gleba.id,
    areaDaGleba_m2: areaGleba,
    areaQueDesconta_m2: areaQueDesconta,
    semente: SEMENTE,
    versaoMotor: "0.4.1 + subdivisão do Lab (LAB-04)",
    geradoEm: CARIMBO,
    crs: entrada.crs as never,
    parametrosUsados: entrada.parametros,
  };

  const comLotes = symbiosParaOContrato(corte.vias, corte.quadras, opcoes, lotes);
  const semLotes = symbiosParaOContrato(corte.vias, corte.quadras, opcoes, []);

  const julgComLotes = julgar(comLotes.saida, entrada);
  const julgSemLotes = julgar(semLotes.saida, entrada);

  writeFileSync(
    join(CONTRATOS, `${id}.symbios-loteado.saida.json`),
    `${JSON.stringify(comLotes.saida, null, 1)}\n`,
    "utf8",
  );

  // Determinismo: a subdivisão é função pura da quadra e dos parâmetros.
  const bis: LoteParaOContrato[] = [];
  corte.quadras.forEach((q, iq) => {
    // A segunda passagem tem de pular as MESMAS quadras que a primeira, senão a
    // régua de determinismo compara dois conjuntos diferentes e acusa falha que
    // não existe — foi o que ela fez na primeira versão.
    if (q.fracaoDentroDaGleba < 1 - 1e-6) return;
    for (const l of lotearQuadra(q.pontos, params, vias).lotes) {
      bis.push({ quadraIndice: iq, pontos: l.pontos, area_m2: n2(l.area_m2), testada_m: n2(l.testada_m) });
    }
  });
  const determinismo = JSON.stringify(bis) === JSON.stringify(lotes);

  // ── As referências ─────────────────────────────────────────────────────
  const doGenerate = ["ortogonal", "espinha"].map((m) => {
    const v = JSON.parse(
      readFileSync(join(DO_GENERATE, "resultados", `${id}.${m}.veredito.json`), "utf8"),
    );
    return {
      motor: m,
      lotes: v.judge?.numLotes ?? null,
      areaPrivativa_m2: n2(v.quadroDeAreas.areaPrivativa_m2),
      violacoes: v.validator?.violacoes ?? null,
    };
  });
  const doLab08 = JSON.parse(readFileSync(join(SAIDA, "..", "LAB-08", "medicoes.json"), "utf8"))
    .glebas.find((g: { gleba: string }) => g.gleba === id)?.testfit?.melhorVariante ?? null;

  const areaDeLotes = lotes.reduce((s, l) => s + l.area_m2, 0);

  const linha = {
    prompt: "LAB-04",
    gleba: id,
    motor: "symbios-tensor 0.4.1 + subdivisão do Lab",
    semente: SEMENTE,
    contrato: "1",
    areaDaGleba_m2: n2(areaGleba),
    parametros: params,
    quadras: {
      total: corte.quadrasDepois,
      atravessandoADivisa: quadrasAtravessando,
      loteaveis: corte.quadrasDepois - quadrasAtravessando,
      comLote: quadrasComLote,
      puladasPeloEsqueleto: quadrasPeloEsqueleto,
      semLote: quadrasSemLote,
      areaLoteavel_m2: n2(areaDasQuadras),
    },
    subdivisao: {
      lotes: lotes.length,
      areaVendavel_m2: n2(areaDeLotes),
      areaVendavel_pctDaGleba: pc(areaDeLotes, areaGleba),
  aproveitamentoDasQuadras_pct: pc(areaDeLotes, areaDasQuadras),
      loteMedio_m2: lotes.length ? n2(areaDeLotes / lotes.length) : null,
      testadaMediana_m: lotes.length
        ? n2([...lotes].map((l) => l.testada_m).sort((a, b) => a - b)[Math.floor(lotes.length / 2)]!)
        : null,
      arestasDeFrente,
      arestasSemRua,
      descartadosPorArea: porArea,
      descartadosPorAreaMaxima: porAreaMaxima,
      descartadosPorFaltaDeRua: semRuaNaFatia,
      descartadosPorTestada: porTestada,
      descartadosPorVia: porVia,
      avisosDoEsqueleto: [...avisos.entries()].map(([a, n]) => ({ aviso: a, quadras: n })),
      ms: n2(msLote),
      determinismo,
    },
    julgamento: { comLotes: julgComLotes, semLotes: julgSemLotes },
    msMotor: n2(msMotor),
    referencias: {
      testfitT02: doLab08
        ? { formato: doLab08.formato, lotes: doLab08.lotes, areaPrivativa_m2: doLab08.areaPrivativa_m2, violacoes: doLab08.violacoes }
        : null,
      motorInternoDoGenerate: doGenerate,
    },
  };
  linhas.push(linha);

  const s = linha.subdivisao;
  const j = linha.julgamento.comLotes;
  console.log(`\n══════════ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha ══════════`);
  console.log(`  quadras ${linha.quadras.total} · atravessam a divisa ${linha.quadras.atravessandoADivisa} (puladas) · loteáveis ${linha.quadras.loteaveis} (${(linha.quadras.areaLoteavel_m2 / 1e4).toFixed(1)} ha)`);
  console.log(`  com lote ${linha.quadras.comLote} · sem lote ${linha.quadras.semLote} · puladas por esqueleto não confiável ${linha.quadras.puladasPeloEsqueleto}`);
  console.log(`  LOTES ${s.lotes} · área vendável ${(s.areaVendavel_m2 / 1e4).toFixed(2)} ha (${s.areaVendavel_pctDaGleba} % da gleba)`);
  console.log(`  aproveitamento das quadras ${s.aproveitamentoDasQuadras_pct} % · lote médio ${s.loteMedio_m2} m² · testada mediana ${s.testadaMediana_m} m`);
  console.log(`  arestas com rua ${s.arestasDeFrente}, sem rua ${s.arestasSemRua} · descartados: área mín ${s.descartadosPorArea}, área máx ${s.descartadosPorAreaMaxima}, sem rua na fatia ${s.descartadosPorFaltaDeRua}, testada ${s.descartadosPorTestada}, via por cima ${s.descartadosPorVia}`);
  console.log(`  ${s.ms} ms · determinismo ${s.determinismo ? "OK" : "FALHOU"}`);
  if (j.recusa) console.log(`  CONTRATO RECUSADO: ${j.recusa[0]}`);
  else console.log(`  Judge ${j.judge!.numLotes} lotes · Validator ${j.validator!.violacoes} violações ${JSON.stringify(j.validator!.porTipo)}`);
  console.log(`  ── referências ──`);
  if (linha.referencias.testfitT02) {
    const r = linha.referencias.testfitT02;
    console.log(`  Testfit T02 (${r.formato}): ${r.lotes} lotes · ${(r.areaPrivativa_m2 / 1e4).toFixed(2)} ha · ${r.violacoes} violações`);
  }
  for (const g of doGenerate) {
    console.log(`  Generate ${g.motor}: ${g.lotes} lotes · ${(g.areaPrivativa_m2 / 1e4).toFixed(2)} ha · ${g.violacoes} violações`);
  }
}

writeFileSync(
  join(SAIDA, "medicoes.json"),
  `${JSON.stringify({ prompt: "LAB-04", geradoEm: CARIMBO, semente: SEMENTE, glebas: linhas }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-04/medicoes.json`);
