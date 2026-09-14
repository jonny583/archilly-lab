#!/usr/bin/env bun
/**
 * LAB-02 — o recorte pela gleba e pelas restrições, medido antes e depois.
 *
 * ```sh
 * bun ferramentas/lab02.ts
 * ```
 *
 * O que ele mede, que é o que o prompt pede:
 *
 * 1. **comprimento de via fora da gleba** — meta declarada: **0 %**;
 * 2. **comprimento de via dentro de restrição que desconta** — APP como
 *    geometria de verdade;
 * 3. **rampa nos cruzamentos** — o número que o LAB-01 deixou em aberto,
 *    remedido na rede cortada, com a MESMA definição daquele relatório: rampa
 *    por aresta, repartida por grau do nó;
 * 4. **conectividade** — o que o LAB-01 mandou conferir depois do corte;
 * 5. **o julgamento**, pelo Validator e pelo Judge **do Generate**, antes e
 *    depois do corte.
 *
 * Tudo sai em `docs/provas/LAB-02/medicoes.json`, com gleba, motor, semente e
 * versão do contrato em cada registro.
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

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { symbiosParaOContrato, type PontoV1 } from "../src/symbios-para-contrato.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-02");
const GLEBAS_DO_GENERATE = join(
  RAIZ, "..", "urban-create-hub-41d93a4d", "docs", "glebas-padrao",
);
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

/** A semente do LAB-07, para que os dois motores fiquem comparáveis no LAB-08. */
const SEMENTE = 20260913;
/** Carimbo fixo: um relógio real faria o arquivo mudar sem a geometria mudar. */
const CARIMBO = "2026-09-14T00:00:00.000Z";
const VERSAO_MOTOR = "0.4.1";

const n2 = (v: number) => Number(v.toFixed(2));
const pc = (a: number, b: number) => (b > 0 ? Number(((100 * a) / b).toFixed(2)) : 0);

// ───────────────────────────────────────────────────── rampa nos cruzamentos

/**
 * Rampa por aresta, repartida por grau do nó — a definição do LAB-01.
 *
 * # Um cuidado que custou uma conclusão errada
 *
 * A primeira versão classificava cada aresta pelo grau que o nó tem **na rede
 * que está sendo medida**. Com isso o "antes" e o "depois" mediam coisas
 * diferentes, e o resultado foi uma manchete falsa: *"a rampa ao longo da via
 * piorou de 10,01 % para 34,98 % depois do corte"*.
 *
 * Medido: aquela aresta de 34,98 % **sempre teve 34,98 %**. Ela encostava num
 * cruzamento, era contada como aresta de cruzamento, e o corte levou embora a
 * via que fazia o cruzamento — então ela passou a ter as duas pontas de grau 2
 * e mudou de balde. Nada piorou; a régua trocou de gaveta.
 *
 * A correção é classificar sempre pelo grau da rede **original**. Um ponto novo,
 * criado pelo corte, não existe no mapa original e conta grau 0 — o que deixa a
 * classificação da aresta por conta da ponta que sobreviveu, que é justamente a
 * que carrega a informação.
 */
function grausDe(vias: Via[]): Map<string, number> {
  const TOL = 0.01;
  const chave = (p: Ponto) => `${Math.round(p.x / TOL)}:${Math.round(p.y / TOL)}`;
  const grau = new Map<string, number>();
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      for (const p of [v.pontos[i - 1]!, v.pontos[i]!]) {
        grau.set(chave(p), (grau.get(chave(p)) ?? 0) + 1);
      }
    }
  }
  return grau;
}

function rampaPorGrau(vias: Via[], grauDeReferencia: Map<string, number>) {
  const TOL = 0.01;
  const chave = (p: Ponto) => `${Math.round(p.x / TOL)}:${Math.round(p.y / TOL)}`;

  const grupos = {
    aoLongo: { arestas: 0, maxima_pct: 0, acimaDe10: 0, comprimento_m: 0 },
    cruzamento: { arestas: 0, maxima_pct: 0, acimaDe10: 0, comprimento_m: 0 },
  };
  const todas: number[] = [];
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      const a = v.pontos[i - 1]!;
      const b = v.pontos[i]!;
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (d < 1e-6) continue;
      const rampa = (Math.abs(v.cotas_m[i]! - v.cotas_m[i - 1]!) / d) * 100;
      todas.push(rampa);
      // Grau da rede ORIGINAL — ver o cabeçalho. Ponto novo do corte vale 0.
      const g = Math.max(grauDeReferencia.get(chave(a)) ?? 0, grauDeReferencia.get(chave(b)) ?? 0);
      const alvo = g >= 3 ? grupos.cruzamento : grupos.aoLongo;
      alvo.arestas++;
      alvo.comprimento_m += d;
      if (rampa > alvo.maxima_pct) alvo.maxima_pct = rampa;
      // 10,5 % e não 10 %: o clamp do motor pousa EXATAMENTE no limite e a
      // aritmética de f32 joga metade das arestas alguns centésimos acima.
      if (rampa > 10.5) alvo.acimaDe10++;
    }
  }
  todas.sort((a, b) => a - b);
  const q = (t: number) => (todas.length ? todas[Math.floor((todas.length - 1) * t)]! : 0);
  return {
    aoLongo: {
      ...grupos.aoLongo,
      maxima_pct: n2(grupos.aoLongo.maxima_pct),
      comprimento_m: n2(grupos.aoLongo.comprimento_m),
    },
    cruzamento: {
      ...grupos.cruzamento,
      maxima_pct: n2(grupos.cruzamento.maxima_pct),
      comprimento_m: n2(grupos.cruzamento.comprimento_m),
    },
    /** Sobre TODAS as arestas — imune à troca de balde, comparável sempre. */
    todasAsArestas: {
      arestas: todas.length,
      mediana_pct: n2(q(0.5)),
      p90_pct: n2(q(0.9)),
      p99_pct: n2(q(0.99)),
      maxima_pct: n2(todas.at(-1) ?? 0),
      acimaDe10: todas.filter((r) => r > 10.5).length,
    },
  };
}

// ────────────────────────────────────────────────────────── o julgamento

function julgar(saida: unknown, entrada: EntradaMinima) {
  const l = montarParcelamentoExterno(saida as never, {
    entrada: entrada as unknown as EntradaMotorV1,
  });
  if (!l.conferencia.valido || !l.externo) {
    return {
      recusa: { erros: l.conferencia.erros, avisos: l.conferencia.avisos },
      judge: null,
      validator: null,
    };
  }
  const r = montarRelatorio(l.externo, null);
  return {
    recusa: null,
    judge: { numLotes: r.judge.numLotes, areaPrivativa_m2: n2(r.judge.areaPrivativa_m2 ?? 0) },
    validator: {
      limpo: r.validator.limpo,
      violacoes: r.validator.violacoes,
      porTipo: r.validator.porTipo,
      avisos: r.validator.avisos?.length ?? 0,
      exemplos: (r.validator.exemplos ?? []).slice(0, 3),
    },
  };
}

// ───────────────────────────────────────────────────────────── as glebas

function carregarDoGenerate(id: string): EntradaMinima {
  return JSON.parse(readFileSync(join(GLEBAS_DO_GENERATE, `${id}.entrada.json`), "utf8"));
}

/**
 * As três glebas do LAB-02, e por que não são as três do LAB-07.
 *
 * O LAB-07 mediu em `ensaio-47ha`, `geo-antonina` e `lab01-50ha-ondulado`. Aqui
 * as duas primeiras **não podem entrar**, e a razão é medida, não escolhida:
 * elas não têm relevo (`curvas: []`), e o Symbios é um motor de campo tensorial
 * — sem cotas o mapa de alturas nem se monta. Ver `NAO_RODAM`, abaixo: a recusa
 * é registrada como medição, não escondida.
 *
 * O trio que roda cobre o que o LAB-02 precisa cobrir:
 *
 * | gleba | por que ela está aqui |
 * |---|---|
 * | `completo` | a única com **restrição de verdade** — 2 APP e 1 reserva legal. Sem ela, "recortar pelas restrições" não teria o que morder |
 * | `sintetico-50ha-ondulado` | a gleba do LAB-01 e do LAB-07, **relevo forte** — é o elo com as duas medições anteriores |
 * | `sintetico-10ha-plano` | o extremo oposto: **quase sem desnível**, onde o campo tensorial degenera para grade |
 */
const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
];

/** As glebas-padrão do Generate, que o Symbios não consegue comer. */
const NAO_RODAM = ["ensaio-47ha", "geo-antonina"];

// ────────────────────────────────────────────────────────────── execução

const motor = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

const registros: Record<string, unknown>[] = [];

for (const { id, entrada } of GLEBAS) {
  const t0 = performance.now();
  const { terreno, perdas: perdasNaIda } = glebaParaOSymbios(entrada);
  const bruto = gerarRedeViaria(motor, terreno as Terreno, {}, SEMENTE);
  const corte = recortarPelaGleba(bruto, terreno as Terreno);

  const areaGleba = areaPoligono(terreno.gleba);
  const areaQueDesconta = terreno.restricoes
    .filter((r) => r.desconta)
    .reduce((s, r) => s + areaPoligono(r.area), 0);

  const opcoes = {
    projetoId: entrada.projeto.id,
    glebaId: entrada.gleba.id,
    areaDaGleba_m2: areaGleba,
    areaQueDesconta_m2: areaQueDesconta,
    semente: SEMENTE,
    versaoMotor: VERSAO_MOTOR,
    geradoEm: CARIMBO,
    crs: entrada.crs as never,
    parametrosUsados: entrada.parametros,
  };

  const grauOriginal = grausDe(bruto.vias);
  const antes = symbiosParaOContrato(bruto.vias, bruto.quadras, opcoes);
  const depois = symbiosParaOContrato(corte.vias, corte.quadras, opcoes);

  const registro = {
    prompt: "LAB-02",
    gleba: id,
    motor: "symbios-tensor",
    versaoMotor: VERSAO_MOTOR,
    semente: SEMENTE,
    contrato: "1",
    areaDaGleba_m2: n2(areaGleba),
    restricoesQueBloqueiam: corte.bloqueios,
    areaQueDesconta_m2: n2(areaQueDesconta),
    perdasNaIda,
    perdasNaVolta: depois.perdas,

    via: {
      antes: {
        trechos: corte.viasAntes,
        comprimento_m: n2(corte.comprimentoAntes_m),
        foraDaGleba_m: n2(corte.comprimentoForaDaGlebaAntes_m),
        foraDaGleba_pct: pc(corte.comprimentoForaDaGlebaAntes_m, corte.comprimentoAntes_m),
        emRestricao_m: n2(corte.comprimentoEmRestricaoAntes_m),
        emRestricao_pct: pc(corte.comprimentoEmRestricaoAntes_m, corte.comprimentoAntes_m),
      },
      depois: {
        trechos: corte.viasDepois,
        descartados: corte.viasDescartadas,
        fragmentados: corte.viasFragmentadas,
        comprimento_m: n2(corte.comprimentoDepois_m),
        foraDaGleba_m: n2(corte.comprimentoForaDaGlebaDepois_m),
        foraDaGleba_pct: pc(corte.comprimentoForaDaGlebaDepois_m, corte.comprimentoDepois_m),
        emRestricao_m: n2(corte.comprimentoEmRestricaoDepois_m),
        emRestricao_pct: pc(corte.comprimentoEmRestricaoDepois_m, corte.comprimentoDepois_m),
        lascas: corte.lascas,
        comprimentoEmLascas_m: n2(corte.comprimentoEmLascas_m),
      },
    },
    quadra: {
      antes: corte.quadrasAntes,
      depois: corte.quadrasDepois,
      descartadas: corte.quadrasDescartadas,
      atravessandoADivisa: corte.quadrasAtravessando,
    },
    conectividade: { antes: corte.conectividadeAntes, depois: corte.conectividade },
    rampa: {
      // A MESMA régua nos dois lados: o grau vem sempre da rede original.
      antes: rampaPorGrau(bruto.vias, grauOriginal),
      depois: rampaPorGrau(corte.vias, grauOriginal),
    },
    julgamento: {
      antes: julgar(antes.saida, entrada),
      depois: julgar(depois.saida, entrada),
    },
    ms: n2(performance.now() - t0),
  };

  registros.push(registro);

  // A SAÍDA cortada, para o LAB-08 e para o Generate poderem julgar de novo.
  writeFileSync(
    join(SAIDA, `${id}.saida-cortada.json`),
    `${JSON.stringify(depois.saida, null, 1)}\n`,
    "utf8",
  );

  const v = registro.via;
  console.log(`\n═══ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha ═══`);
  console.log(`  via fora da gleba   ${v.antes.foraDaGleba_pct} %  →  ${v.depois.foraDaGleba_pct} %   (${v.depois.foraDaGleba_m} m)`);
  console.log(`  via em restrição    ${v.antes.emRestricao_pct} %  →  ${v.depois.emRestricao_pct} %   (${corte.bloqueios.length} área(s) bloqueando)`);
  console.log(`  trechos             ${v.antes.trechos}  →  ${v.depois.trechos}   (${v.depois.descartados} fora, ${v.depois.fragmentados} partidos)`);
  console.log(`  comprimento         ${v.antes.comprimento_m} m  →  ${v.depois.comprimento_m} m`);
  console.log(`  conectividade       ${corte.conectividadeAntes.componentes} comp. / maior ${(corte.conectividadeAntes.fracaoNoMaior * 100).toFixed(1)} %  →  ${corte.conectividade.componentes} comp. / maior ${(corte.conectividade.fracaoNoMaior * 100).toFixed(1)} %`);
  const ra = registro.rampa;
  console.log(`  rampa ao longo      máx ${ra.antes.aoLongo.maxima_pct} %  →  ${ra.depois.aoLongo.maxima_pct} %`);
  console.log(`  rampa CRUZAMENTO    máx ${ra.antes.cruzamento.maxima_pct} %  →  ${ra.depois.cruzamento.maxima_pct} %   (${ra.depois.cruzamento.acimaDe10} de ${ra.depois.cruzamento.arestas} arestas acima de 10 %)`);
  console.log(`  rampa TODAS         mediana ${ra.depois.todasAsArestas.mediana_pct} % · p99 ${ra.depois.todasAsArestas.p99_pct} % · máx ${ra.depois.todasAsArestas.maxima_pct} % · ${ra.depois.todasAsArestas.acimaDe10} acima de 10 %`);
  const ja = registro.julgamento;
  console.log(`  contrato ANTES      ${ja.antes.recusa ? "RECUSADO — " + (ja.antes.recusa.erros[0] ?? "").slice(0, 70) : `aceito · ${ja.antes.validator!.violacoes} violações`}`);
  console.log(`  contrato DEPOIS     ${ja.depois.recusa ? "RECUSADO — " + (ja.depois.recusa.erros[0] ?? "").slice(0, 70) : `aceito · ${ja.depois.validator!.violacoes} violações · ${JSON.stringify(ja.depois.validator!.porTipo)}`}`);
}

// ══════════════════════════════════════════════════════════════════════════
// O OUTRO MOTOR: o que o recorte por RESTRIÇÃO mudaria lá
//
// "Violações por partido" é vocabulário do outro motor — o Symbios não tem
// partido de traçado, tem campo tensorial. A tabela por partido é a do LAB-07 e
// continua valendo: ela já foi medida com a rede aparada PELA GLEBA.
//
// O que o LAB-02 acrescenta é a segunda lâmina, que ninguém tinha passado: o
// aparo do LAB-07 corta pelo perímetro e **não olha para as restrições**. Em
// `geo-antonina` há 3 APP hídricas que descontam. Quanto do parcelamento
// daquele motor está em cima delas? Lote dentro de APP é terra protegida
// entrando no quadro de áreas como vendável — o contrato chama isso de "o erro
// mais caro de um estudo de viabilidade".
// ══════════════════════════════════════════════════════════════════════════

function dentroDoAnelSimples(p: PontoV1, anel: PontoV1[]): boolean {
  let d = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const a = anel[i]!;
    const b = anel[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) d = !d;
  }
  return d;
}

const antonina = carregarDoGenerate("geo-antonina");
const appDeAntonina = antonina.restricoes
  .filter((r) => r.desconta && r.geometria.tipo === "poligono")
  .map((r) => r.geometria.aneis![0]!);

const saidaTestfit = JSON.parse(
  readFileSync(join(SAIDA, "..", "LAB-07", "geo-antonina.saida.json"), "utf8"),
) as {
  vias: { id: string; pontos: PontoV1[] }[];
  lotes: { id: string; pontos: PontoV1[]; area_m2: number }[];
};

const emApp = (p: PontoV1) => appDeAntonina.some((a) => dentroDoAnelSimples(p, a));

let viaEmApp_m = 0;
let viaTotal_m = 0;
for (const v of saidaTestfit.vias) {
  for (let i = 1; i < v.pontos.length; i++) {
    const a = v.pontos[i - 1]!;
    const b = v.pontos[i]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d < 1e-9) continue;
    viaTotal_m += d;
    const n = Math.max(1, Math.ceil(d / 2));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      if (emApp({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })) viaEmApp_m += d / n;
    }
  }
}

const lotesTocandoApp = saidaTestfit.lotes.filter((l) => l.pontos.some(emApp));
const areaDeLoteEmApp = lotesTocandoApp.reduce((s, l) => s + l.area_m2, 0);

const outroMotor = {
  gleba: "geo-antonina",
  motor: "testfit",
  versaoMotor: "T00-A",
  fonte: "docs/provas/LAB-07/geo-antonina.saida.json (melhor variante do LAB-07, já aparada pela gleba)",
  appQueDescontam: appDeAntonina.length,
  via: {
    total_m: n2(viaTotal_m),
    dentroDeApp_m: n2(viaEmApp_m),
    dentroDeApp_pct: pc(viaEmApp_m, viaTotal_m),
  },
  lote: {
    total: saidaTestfit.lotes.length,
    tocandoApp: lotesTocandoApp.length,
    tocandoApp_pct: pc(lotesTocandoApp.length, saidaTestfit.lotes.length),
    areaTocandoApp_m2: n2(areaDeLoteEmApp),
  },
};

console.log(`\n═══ o outro motor · geo-antonina · o que o aparo do LAB-07 não olhou ═══`);
console.log(`  APP que descontam:  ${outroMotor.appQueDescontam}`);
console.log(`  via dentro de APP:  ${outroMotor.via.dentroDeApp_m} m de ${outroMotor.via.total_m} m  (${outroMotor.via.dentroDeApp_pct} %)`);
console.log(`  lotes tocando APP:  ${outroMotor.lote.tocandoApp} de ${outroMotor.lote.total}  (${outroMotor.lote.tocandoApp_pct} %) · ${(outroMotor.lote.areaTocandoApp_m2 / 1e4).toFixed(2)} ha`);

// ── as duas que não rodam, medidas em vez de omitidas ──────────────────────
const recusadas = NAO_RODAM.map((id) => {
  const entrada = carregarDoGenerate(id);
  const curvas = entrada.relevo?.curvas?.length ?? 0;
  const vertices = (entrada.relevo?.curvas ?? []).reduce((s, c) => s + c.pontos.length, 0);
  let erro = "";
  try {
    const { terreno } = glebaParaOSymbios(entrada);
    gerarRedeViaria(motor, terreno as Terreno, {}, SEMENTE);
  } catch (e) {
    erro = e instanceof Error ? e.message : String(e);
  }
  console.log(`\n═══ ${id} — NÃO RODA ═══`);
  console.log(`  curvas de nível: ${curvas} · vértices cotados: ${vertices}`);
  console.log(`  ${erro.slice(0, 120)}`);
  return { gleba: id, curvas, verticesCotados: vertices, erro };
});

writeFileSync(
  join(SAIDA, "medicoes.json"),
  `${JSON.stringify({ prompt: "LAB-02", geradoEm: CARIMBO, semente: SEMENTE, glebas: registros, glebasQueNaoRodam: recusadas, outroMotor }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-02/medicoes.json`);

