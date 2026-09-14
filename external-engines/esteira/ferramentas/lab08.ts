#!/usr/bin/env bun
/**
 * LAB-08 — os dois motores lado a lado, na mesma terra e com a mesma semente.
 *
 * ```sh
 * bun ferramentas/lab08.ts
 * ```
 *
 * # O que mudou desde o LAB-07, e por isso esta rodada existe
 *
 * O LAB-07 mediu o motor do Testfit em **T00-A** e mandou oito correções. O
 * **T02** foi mesclado na `main` daquele repositório, e é ele que roda aqui. O
 * Symbios entra **recortado** pelo LAB-02. As glebas são as duas do Generate,
 * com o relevo que o LAB-03 lhes deu — sem ele o Symbios nem roda.
 *
 * # A regra desta medição
 *
 * Mesma gleba, mesma semente, mesmo Validator, mesmo Judge. O que não é igual
 * fica declarado na tabela, não escondido na média.
 *
 * **Nada de recomendação de produto.** O Lab mede e publica; quem decide com a
 * tabela é o chat, com o Jonny.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { gerarRedeViaria, Motor, recortarPelaGleba } from "@symbios/index.ts";
import type { Ponto, Terreno, Via } from "@symbios/contrato.ts";
import { areaPoligono } from "@symbios/geo.ts";

import {
  montarParcelamentoExterno,
  montarRelatorio,
} from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { symbiosParaOContrato } from "../src/symbios-para-contrato.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-08");
const CONTRATOS = join(RAIZ, "docs", "contratos", "saidas");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const DO_GENERATE = join(RAIZ, "..", "urban-create-hub-41d93a4d", "docs", "glebas-padrao");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const VARIANTES = 20;
const CARIMBO = "2026-09-14T00:00:00.000Z";
const TODOS_OS_FORMATOS = [
  "ortogonal", "espinha", "pente", "diagonal", "loop",
  "cluster", "radial", "organico", "superquadra", "mioloVerde",
] as const;

const n2 = (v: number) => Number(v.toFixed(2));
const pc = (a: number, b: number) => (b > 0 ? Number(((100 * a) / b).toFixed(2)) : 0);

// ───────────────────────────────────────────────────────────────── rampa

const TOL = 0.01;
const chave = (p: Ponto) => `${Math.round(p.x / TOL)}:${Math.round(p.y / TOL)}`;

/**
 * Rampa por aresta, repartida por grau do nó — a definição do LAB-01.
 *
 * Só serve para quem entrega cota. O motor do Testfit não calcula greide
 * (LAB-07, §7), e para ele isto sai `null` — que é "não medido", não zero.
 */
function rampaDeVias(vias: Via[]) {
  const grau = new Map<string, number>();
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      for (const p of [v.pontos[i - 1]!, v.pontos[i]!]) {
        grau.set(chave(p), (grau.get(chave(p)) ?? 0) + 1);
      }
    }
  }
  const ao: number[] = [];
  const cr: number[] = [];
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      const a = v.pontos[i - 1]!;
      const b = v.pontos[i]!;
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (d < 1e-6) continue;
      const r = (Math.abs(v.cotas_m[i]! - v.cotas_m[i - 1]!) / d) * 100;
      (Math.max(grau.get(chave(a)) ?? 0, grau.get(chave(b)) ?? 0) >= 3 ? cr : ao).push(r);
    }
  }
  const resumo = (xs: number[]) => {
    const o = [...xs].sort((x, y) => x - y);
    return {
      arestas: o.length,
      mediana_pct: n2(o.length ? o[Math.floor((o.length - 1) * 0.5)]! : 0),
      maxima_pct: n2(o.at(-1) ?? 0),
      acimaDe10: o.filter((r) => r > 10.5).length,
    };
  };
  return { aoLongo: resumo(ao), cruzamento: resumo(cr) };
}

/** Quantos metros de via caem fora da gleba, por amostragem de 2 m. */
function foraDaGleba(vias: { pontos: Ponto[] }[], dentro: (p: Ponto) => boolean) {
  let fora = 0;
  let total = 0;
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      const a = v.pontos[i - 1]!;
      const b = v.pontos[i]!;
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (d < 1e-9) continue;
      total += d;
      const n = Math.max(1, Math.ceil(d / 2));
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5) / n;
        if (!dentro({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })) fora += d / n;
      }
    }
  }
  return { total_m: n2(total), fora_m: n2(fora), fora_pct: pc(fora, total) };
}

// ───────────────────────────────────────────────── a régua do Generate

function julgar(saida: unknown, entrada: EntradaMinima) {
  const l = montarParcelamentoExterno(saida as never, {
    entrada: entrada as unknown as EntradaMotorV1,
  });
  if (!l.conferencia.valido || !l.externo) {
    return { recusa: l.conferencia.erros.slice(0, 2), judge: null, validator: null };
  }
  const r = montarRelatorio(l.externo, null);
  return {
    recusa: null,
    judge: { numLotes: r.judge.numLotes, areaPrivativa_m2: n2(r.judge.areaPrivativa_m2 ?? 0) },
    validator: {
      limpo: r.validator.limpo,
      violacoes: r.validator.violacoes,
      porTipo: r.validator.porTipo,
    },
  };
}

// ───────────────────────────────────────────────────────────── execução

const motor = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });
mkdirSync(CONTRATOS, { recursive: true });

const carregar = (dir: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(dir, `${id}.entrada.json`), "utf8"));

const linhas: Record<string, unknown>[] = [];

for (const id of ["ensaio-47ha", "geo-antonina"]) {
  // A gleba COM relevo (fixture do LAB-03): é a única terra em que os dois
  // motores rodam. A poligonal e os parâmetros são os do Generate, intocados.
  const comRelevo = carregar(FIXTURES, id);
  const original = carregar(DO_GENERATE, id);

  const { terreno } = glebaParaOSymbios(comRelevo);
  const t = terreno as Terreno;
  const areaGleba = areaPoligono(t.gleba);
  const areaQueDesconta = t.restricoes
    .filter((r) => r.desconta)
    .reduce((s, r) => s + areaPoligono(r.area), 0);

  // ── SYMBIOS ────────────────────────────────────────────────────────────
  const t0s = performance.now();
  const bruto = gerarRedeViaria(motor, t, {}, SEMENTE);
  const corte = recortarPelaGleba(bruto, t);
  const msSymbios = performance.now() - t0s;

  const pontes = symbiosParaOContrato(corte.vias, corte.quadras, {
    projetoId: comRelevo.projeto.id,
    glebaId: comRelevo.gleba.id,
    areaDaGleba_m2: areaGleba,
    areaQueDesconta_m2: areaQueDesconta,
    semente: SEMENTE,
    versaoMotor: "0.4.1",
    geradoEm: CARIMBO,
    crs: comRelevo.crs as never,
    parametrosUsados: comRelevo.parametros,
  });
  const julgSymbios = julgar(pontes.saida, comRelevo);

  // Determinismo: duas execuções, mesma semente.
  const bis = recortarPelaGleba(gerarRedeViaria(motor, t, {}, SEMENTE), t);
  const determinismoSymbios =
    JSON.stringify(bis.vias) === JSON.stringify(corte.vias) &&
    bruto.diagnostico.hash === gerarRedeViaria(motor, t, {}, SEMENTE).diagnostico.hash;

  writeFileSync(
    join(CONTRATOS, `${id}.symbios.saida.json`),
    `${JSON.stringify(pontes.saida, null, 1)}\n`,
    "utf8",
  );

  // ── O OUTRO MOTOR (T02) ────────────────────────────────────────────────
  const t0t = performance.now();
  const rt = rodarEsteira(comRelevo as unknown as EntradaV1, {
    semente: SEMENTE,
    variantes: VARIANTES,
    aparar: true,
    formatos: [...TODOS_OS_FORMATOS],
  });
  const msTestfit = performance.now() - t0t;

  // O Judge escolhe por número de lotes, com a área privativa no desempate —
  // é a regra dele, e é ela que decide qual variante representa o motor.
  const julgadas = rt.variantes.filter((v) => v.relatorio);
  const melhor = julgadas.sort((a, b) => {
    const d = b.relatorio!.judge.numLotes - a.relatorio!.judge.numLotes;
    return d !== 0 ? d : (b.relatorio!.judge.areaPrivativa_m2 ?? 0) - (a.relatorio!.judge.areaPrivativa_m2 ?? 0);
  })[0];

  // Determinismo: a MESMA rodada duas vezes. A primeira versão comparava 20
  // variantes com 3 e acusou "FALHOU" — a régua estava errada, não o motor.
  const bisT = rodarEsteira(comRelevo as unknown as EntradaV1, {
    semente: SEMENTE, variantes: VARIANTES, aparar: true, formatos: [...TODOS_OS_FORMATOS],
  });
  const determinismoTestfit =
    bisT.assinaturaDaRodada === rt.assinaturaDaRodada &&
    JSON.stringify(bisT.variantes.map((v) => v.saida)) ===
      JSON.stringify(rt.variantes.map((v) => v.saida));

  if (melhor) {
    writeFileSync(
      join(CONTRATOS, `${id}.testfit.saida.json`),
      `${JSON.stringify(melhor.saida, null, 1)}\n`,
      "utf8",
    );
  }

  const semAparoRecusadas = rt.variantes.filter((v) => v.semAparo?.recusa).length;
  const cortadoPeloAparo = rt.variantes.reduce(
    (s, v) => s + (v.aparo ? v.aparo.comprimentoOriginal_m - v.aparo.comprimentoAparado_m : 0), 0);
  const originalDoAparo = rt.variantes.reduce((s, v) => s + (v.aparo?.comprimentoOriginal_m ?? 0), 0);

  // Violação por regra, somando as variantes julgadas — a tabela pede "por regra".
  const porRegra: Record<string, number> = {};
  for (const v of julgadas) {
    for (const [k, n] of Object.entries(v.relatorio!.validator.porTipo ?? {})) {
      porRegra[k] = (porRegra[k] ?? 0) + (n as number);
    }
  }
  const porPartido: Record<string, { variantes: number; lotes: number; violacoes: number }> = {};
  for (const v of julgadas) {
    const a = porPartido[v.formato] ?? { variantes: 0, lotes: 0, violacoes: 0 };
    a.variantes++;
    a.lotes += v.relatorio!.judge.numLotes;
    a.violacoes += v.relatorio!.validator.violacoes;
    porPartido[v.formato] = a;
  }

  // ── O MESMO motor, na gleba SEM relevo ─────────────────────────────────
  //
  // Os números do motor interno do Generate foram medidos na gleba ORIGINAL,
  // sem relevo. Comparar com a rodada acima — que usa a fixture do LAB-03 —
  // misturaria duas mudanças. Esta terceira rodada isola: mesma semente, mesmo
  // motor, mesma gleba, só sem as curvas de nível.
  const rtSemRelevo = rodarEsteira(original as unknown as EntradaV1, {
    semente: SEMENTE, variantes: VARIANTES, aparar: true, formatos: [...TODOS_OS_FORMATOS],
  });
  const julgadasSem = rtSemRelevo.variantes.filter((v) => v.relatorio);
  const melhorSem = [...julgadasSem].sort((a, b) => {
    const d = b.relatorio!.judge.numLotes - a.relatorio!.judge.numLotes;
    return d !== 0 ? d : (b.relatorio!.judge.areaPrivativa_m2 ?? 0) - (a.relatorio!.judge.areaPrivativa_m2 ?? 0);
  })[0];

  // ── O MOTOR INTERNO DO GENERATE, como referência ───────────────────────
  const vereditos = ["ortogonal", "espinha"].map((m) => {
    const v = JSON.parse(
      readFileSync(join(DO_GENERATE, "resultados", `${id}.${m}.veredito.json`), "utf8"),
    );
    const q = v.quadroDeAreas;
    const soma = Object.entries(q).reduce(
      (s, [k, x]) => (k === "areaTotal_m2" ? s : s + (x as number)), 0);
    return {
      motor: m,
      lotes: v.judge?.numLotes ?? null,
      areaPrivativa_m2: n2(q.areaPrivativa_m2),
      loteMedio_m2: v.judge?.numLotes ? n2(q.areaPrivativa_m2 / v.judge.numLotes) : null,
      violacoes: v.validator?.violacoes ?? null,
      quadro: q,
      somaDasPartes_m2: n2(soma),
      excessoSobreOTotal_pct: pc(soma - q.areaTotal_m2, q.areaTotal_m2),
    };
  });

  const dentroDaGleba = (p: Ponto) => {
    let d = false;
    const anel = comRelevo.gleba.anel;
    for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
      const a = anel[i]!;
      const b = anel[j]!;
      if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) d = !d;
    }
    return d;
  };

  const linha = {
    prompt: "LAB-08",
    gleba: id,
    areaDaGleba_m2: n2(areaGleba),
    relevo: "fixture do LAB-03 — sintético declarado",
    semente: SEMENTE,
    contrato: "1",

    symbios: {
      versaoMotor: "0.4.1",
      lotes: julgSymbios.judge?.numLotes ?? 0,
      areaPrivativa_m2: julgSymbios.judge?.areaPrivativa_m2 ?? 0,
      quadras: corte.quadrasDepois,
      areaDeQuadras_m2: n2(corte.quadras.reduce((s, q) => s + q.area_m2, 0)),
      viaForaDaGleba: {
        semRecorte: pc(corte.comprimentoForaDaGlebaAntes_m, corte.comprimentoAntes_m),
        comRecorte: pc(corte.comprimentoForaDaGlebaDepois_m, corte.comprimentoDepois_m),
      },
      comprimentoDeVia_m: n2(corte.comprimentoDepois_m),
      conectividade_pctNoMaior: n2(corte.conectividade.fracaoNoMaior * 100),
      violacoes: julgSymbios.validator?.violacoes ?? null,
      porRegra: julgSymbios.validator?.porTipo ?? {},
      recusa: julgSymbios.recusa,
      rampa: rampaDeVias(corte.vias),
      ms: n2(msSymbios),
      determinismo: determinismoSymbios,
    },

    testfit: {
      versaoMotor: "T02",
      variantesPedidas: VARIANTES,
      variantesJulgadas: julgadas.length,
      recusadasPeloEsquema: rt.variantes.length - julgadas.length,
      semAparo_recusadas: semAparoRecusadas,
      oAparoAindaCorta_pct: pc(cortadoPeloAparo, originalDoAparo),
      melhorVariante: melhor
        ? {
            formato: melhor.formato,
            lotes: melhor.relatorio!.judge.numLotes,
            areaPrivativa_m2: n2(melhor.relatorio!.judge.areaPrivativa_m2 ?? 0),
            loteMedio_m2: melhor.relatorio!.judge.numLotes
              ? n2((melhor.relatorio!.judge.areaPrivativa_m2 ?? 0) / melhor.relatorio!.judge.numLotes)
              : null,
            violacoes: melhor.relatorio!.validator.violacoes,
            porRegra: melhor.relatorio!.validator.porTipo ?? {},
            quadroDeAreas: melhor.saida.quadroDeAreas,
            viaForaDaGleba: foraDaGleba(melhor.saida.vias, dentroDaGleba),
          }
        : null,
      somaDasVariantes: {
        lotes: julgadas.reduce((s, v) => s + v.relatorio!.judge.numLotes, 0),
        violacoes: julgadas.reduce((s, v) => s + v.relatorio!.validator.violacoes, 0),
        porRegra,
      },
      porPartido,
      // O motor não calcula greide: null é "não medido", nunca zero.
      rampa: null,
      naGlebaSemRelevo: melhorSem
        ? {
            formato: melhorSem.formato,
            lotes: melhorSem.relatorio!.judge.numLotes,
            areaPrivativa_m2: n2(melhorSem.relatorio!.judge.areaPrivativa_m2 ?? 0),
            loteMedio_m2: melhorSem.relatorio!.judge.numLotes
              ? n2((melhorSem.relatorio!.judge.areaPrivativa_m2 ?? 0) / melhorSem.relatorio!.judge.numLotes)
              : null,
            violacoes: melhorSem.relatorio!.validator.violacoes,
            quadroDeAreas: melhorSem.saida.quadroDeAreas,
            variantesJulgadas: julgadasSem.length,
          }
        : null,
      ms: n2(msTestfit),
      determinismo: determinismoTestfit,
    },

    motorInternoDoGenerate: vereditos,
  };

  linhas.push(linha);

  // ── o que sai no terminal ──────────────────────────────────────────────
  const s = linha.symbios;
  const tf = linha.testfit;
  console.log(`\n══════════ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha ══════════`);
  console.log(`  ┌ SYMBIOS 0.4.1 (recortado, LAB-02)`);
  console.log(`  │ lotes ${s.lotes} · quadras ${s.quadras} (${(s.areaDeQuadras_m2 / 1e4).toFixed(1)} ha) · via ${s.comprimentoDeVia_m} m`);
  console.log(`  │ via fora da gleba: ${s.viaForaDaGleba.semRecorte} % → ${s.viaForaDaGleba.comRecorte} % · conectividade ${s.conectividade_pctNoMaior} %`);
  console.log(`  │ violações ${s.violacoes} ${JSON.stringify(s.porRegra)} · rampa cruz. máx ${s.rampa.cruzamento.maxima_pct} %`);
  console.log(`  │ ${s.ms} ms · determinismo ${s.determinismo ? "OK" : "FALHOU"}`);
  console.log(`  ├ TESTFIT T02 (${tf.variantesJulgadas}/${tf.variantesPedidas} julgadas)`);
  if (tf.melhorVariante) {
    const m = tf.melhorVariante;
    console.log(`  │ melhor: ${m.formato} · ${m.lotes} lotes · ${(m.areaPrivativa_m2 / 1e4).toFixed(2)} ha privativa · lote médio ${m.loteMedio_m2} m²`);
    console.log(`  │ violações ${m.violacoes} ${JSON.stringify(m.porRegra)} · via fora da gleba ${m.viaForaDaGleba.fora_pct} %`);
  }
  console.log(`  │ sem aparo, recusadas pelo esquema: ${tf.semAparo_recusadas} de ${tf.variantesPedidas} (LAB-07: 60 de 60)`);
  console.log(`  │ o aparo do Lab ainda corta ${tf.oAparoAindaCorta_pct} % (LAB-07: 25–40 %)`);
  console.log(`  │ rampa: null — o motor não calcula greide`);
  if (tf.naGlebaSemRelevo) {
    const sr = tf.naGlebaSemRelevo;
    console.log(`  │ na gleba SEM relevo (a que o Generate mediu): ${sr.formato} · ${sr.lotes} lotes · lote médio ${sr.loteMedio_m2} m²`);
  }
  console.log(`  │ ${tf.ms} ms · determinismo ${tf.determinismo ? "OK" : "FALHOU"}`);
  console.log(`  └ MOTOR INTERNO DO GENERATE (referência)`);
  for (const v of vereditos) {
    console.log(`    ${v.motor.padEnd(10)} ${String(v.lotes).padStart(5)} lotes · lote médio ${v.loteMedio_m2} m² · quadro fecha? ${v.excessoSobreOTotal_pct === 0 ? "sim" : `NÃO, ${v.excessoSobreOTotal_pct} % a mais de terra`}`);
  }
}

writeFileSync(
  join(SAIDA, "medicoes.json"),
  `${JSON.stringify({ prompt: "LAB-08", geradoEm: CARIMBO, semente: SEMENTE, glebas: linhas }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-08/medicoes.json`);
console.log(`docs/contratos/saidas/ — as SAÍDAS dos dois motores, para o Generate julgar`);
