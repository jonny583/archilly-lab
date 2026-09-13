#!/usr/bin/env bun
/**
 * As medições obrigatórias do LAB-07, §2.4 e §2.5.
 *
 * ```sh
 * bun ferramentas/medir.ts
 * ```
 *
 * Escreve `docs/provas/LAB-07/medicoes.json` (números crus, para o relatório não
 * depender de transcrição à mão) e imprime o mesmo conteúdo, legível.
 *
 * # As três glebas
 *
 * | gleba | o que é | relevo |
 * |---|---|---|
 * | `ensaio-47ha` | gleba-padrão do Generate: retângulo sintético de 47 ha | **nenhum** |
 * | `geo-antonina` | gleba-padrão do Generate: 141,76 ha em Antonina/PR, 3 APPs | **nenhum** |
 * | `lab01-50ha-ondulado` | a do LAB-01, convertida: 50 ha, 575 curvas, 45 m de desnível | sim |
 *
 * As duas glebas-padrão do Generate **não trazem topografia** (`cotas: null`,
 * `curvas: []`, `classesDeclividade: null`). A terceira existe por isso.
 *
 * # Duas passagens por variante, e por quê
 *
 * **Fiel** — o que o motor entrega, traduzido e nada mais. Resultado medido: o
 * contrato recusa, porque todas as vias saem da gleba.
 *
 * **Com aparo** — os eixos viários aparados pelo perímetro (ver `aparo.ts`).
 * É a única forma de o Validator rodar e de existirem os números que o §2.4
 * pede. O conserto é do Lab, não do motor, e as duas passagens saem lado a lado
 * no relatório justamente para isso não se confundir.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { rodarMotor } from "@testfit/api.ts";
import { distanciaSegmento } from "@testfit/geo.ts";

import { rodarEsteira, type RodadaMedida } from "../adapter/src/index.ts";
import { idaParaOMotor } from "../adapter/src/ida.ts";
import type { EntradaV1 } from "../adapter/src/contrato-v1.ts";
import { glebaDoLab01 } from "./gleba-lab01.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const GLEBAS_PADRAO = join(RAIZ, "..", "urban-create-hub-41d93a4d", "docs", "glebas-padrao");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-07");
mkdirSync(SAIDA, { recursive: true });

const SEMENTE = 20260913;

/**
 * Vinte variantes, e não doze.
 *
 * O motor tem **dez partidos de traçado** no catálogo, mas o padrão de fábrica
 * dele é `formatos: ["ortogonal"]` — um só. Medir no padrão mediria um décimo do
 * motor e chamaria isso de "o motor": a primeira rodada deste arquivo devolveu
 * doze variantes, todas ortogonais, e o número enganava.
 *
 * Com os dez partidos na disputa, doze variantes não dão nem uma por partido.
 * Vinte dá folga para cada um aparecer e para a comparação entre eles significar
 * alguma coisa.
 */
const VARIANTES = 20;

/** Os dez partidos do catálogo do motor, todos na disputa. */
const TODOS_OS_FORMATOS = [
  "ortogonal",
  "diagonal",
  "espinha",
  "organico",
  "radial",
  "superquadra",
  "cluster",
  "loop",
  "pente",
  "mioloVerde",
] as const;

const n2 = (v: number) => Number(v.toFixed(2));
const pct = (v: number) => Number((v * 100).toFixed(2));

function carregar(id: string): EntradaV1 {
  if (id === "lab01-50ha-ondulado") return glebaDoLab01();
  return JSON.parse(readFileSync(join(GLEBAS_PADRAO, `${id}.entrada.json`), "utf8"));
}

/** Comprimento total dos eixos de uma rodada, em metros. */
function comprimentoDeVias(vias: { pontos: { x: number; y: number }[] }[]): number {
  let d = 0;
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      d += Math.hypot(v.pontos[i]!.x - v.pontos[i - 1]!.x, v.pontos[i]!.y - v.pontos[i - 1]!.y);
    }
  }
  return d;
}

/**
 * A rampa que o TERRENO impõe ao longo de cada eixo, em porcento.
 *
 * O §2.4 pede "rampa máxima nos cruzamentos e ao longo da via". O motor do
 * Testfit **não calcula greide** — nenhuma via tem cota em lugar nenhum do
 * `Plano`, e é por isso que `rampaMedia_pct` sai `null` no contrato. Medir a
 * rampa do motor, então, é impossível: não há o que medir.
 *
 * O que se pode medir, e é o que está aqui, é a rampa que o **terreno** impõe:
 * se a via seguisse o chão, qual seria a inclinação dela. É o número que diz se
 * o traçado ignorou a topografia — e é diretamente comparável com o que o LAB-01
 * mediu no Symbios, onde o clamp de rampa existe.
 *
 * Cruzamento é onde dois eixos se encontram a menos de meia caixa de via.
 */
function rampaDoTerreno(
  vias: { pontos: { x: number; y: number }[]; largura_m: number }[],
  cota: (p: { x: number; y: number }) => number | null,
): {
  aoLongoDaVia: { mediana_pct: number; p90_pct: number; maxima_pct: number; trechos: number };
  nosCruzamentos: { mediana_pct: number; maxima_pct: number; cruzamentos: number };
} | null {
  const PASSO = 5;
  const aoLongo: number[] = [];
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      const a = v.pontos[i - 1]!;
      const b = v.pontos[i]!;
      const comp = Math.hypot(b.x - a.x, b.y - a.y);
      const n = Math.max(1, Math.ceil(comp / PASSO));
      for (let k = 0; k < n; k++) {
        const p0 = { x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n };
        const p1 = { x: a.x + ((b.x - a.x) * (k + 1)) / n, y: a.y + ((b.y - a.y) * (k + 1)) / n };
        const z0 = cota(p0);
        const z1 = cota(p1);
        const d = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        if (z0 == null || z1 == null || d < 1e-6) continue;
        aoLongo.push((Math.abs(z1 - z0) / d) * 100);
      }
    }
  }
  if (aoLongo.length === 0) return null;

  // Cruzamentos: a ponta de um eixo perto de outro eixo. A rampa ali é a do
  // trecho que chega — é onde o LAB-01 mediu que o clamp do Symbios falha.
  const nosCruz: number[] = [];
  let cruzamentos = 0;
  for (let i = 0; i < vias.length; i++) {
    const vi = vias[i]!;
    for (const ponta of [vi.pontos[0]!, vi.pontos[vi.pontos.length - 1]!]) {
      let encontrou = false;
      for (let j = 0; j < vias.length && !encontrou; j++) {
        if (i === j) continue;
        const vj = vias[j]!;
        for (let k = 1; k < vj.pontos.length; k++) {
          if (distanciaSegmento(ponta, vj.pontos[k - 1]!, vj.pontos[k]!) < vi.largura_m / 2) {
            encontrou = true;
            break;
          }
        }
      }
      if (!encontrou) continue;
      cruzamentos++;
      const outro = vi.pontos.length > 1 ? vi.pontos[1]! : ponta;
      const z0 = cota(ponta);
      const z1 = cota(outro);
      const d = Math.hypot(outro.x - ponta.x, outro.y - ponta.y);
      if (z0 != null && z1 != null && d > 1e-6) nosCruz.push((Math.abs(z1 - z0) / d) * 100);
    }
  }

  const q = (arr: number[], t: number) =>
    arr.length ? arr.slice().sort((a, b) => a - b)[Math.floor((arr.length - 1) * t)]! : 0;

  return {
    aoLongoDaVia: {
      mediana_pct: n2(q(aoLongo, 0.5)),
      p90_pct: n2(q(aoLongo, 0.9)),
      maxima_pct: n2(Math.max(...aoLongo)),
      trechos: aoLongo.length,
    },
    nosCruzamentos: {
      mediana_pct: n2(q(nosCruz, 0.5)),
      maxima_pct: nosCruz.length ? n2(Math.max(...nosCruz)) : 0,
      cruzamentos,
    },
  };
}

/** Uma linha de medição por variante, no formato que o relatório consome. */
function resumirVariante(v: RodadaMedida["variantes"][number]) {
  const rel = v.relatorio;
  const comprimento = comprimentoDeVias(v.saida.vias);
  return {
    posicaoNoMotor: v.posicaoNoMotor,
    formato: v.formato,
    assinatura: v.assinatura,
    notaDoMotor: n2(v.notaDoMotor),
    // ── o que o motor entregou, antes do conserto do Lab ──────────────────
    fiel: {
      aceitoPeloContrato: v.semAparo ? v.semAparo.recusa === null : v.recusa === null,
      recusa: v.semAparo?.recusa?.erros ?? null,
      vias: v.aparo?.viasOriginais ?? v.saida.vias.length,
      comprimentoDeVia_m: n2(v.aparo?.comprimentoOriginal_m ?? comprimento),
      comprimentoForaDaGleba_m: v.aparo
        ? n2(v.aparo.comprimentoOriginal_m - v.aparo.comprimentoAparado_m)
        : 0,
      comprimentoForaDaGleba_pct: v.aparo
        ? pct(
            (v.aparo.comprimentoOriginal_m - v.aparo.comprimentoAparado_m) /
              Math.max(1, v.aparo.comprimentoOriginal_m),
          )
        : 0,
    },
    // ── o que o Validator e o Judge disseram, já com aparo ────────────────
    julgado: rel
      ? {
          aceito: rel.aceito,
          lotes: rel.judge.numLotes,
          areaPrivativa_m2: n2(rel.judge.areaPrivativa_m2),
          violacoes: rel.validator.violacoes,
          porRegra: rel.validator.porTipo,
          avisos: rel.validator.avisos,
          quadroDeAreas: {
            areaTotal_m2: n2(rel.quadroDeAreas.areaTotal_m2),
            areaPrivativa_m2: n2(rel.quadroDeAreas.areaPrivativa_m2),
            areaViaria_m2: n2(rel.quadroDeAreas.areaViaria_m2),
            areaLazer_m2: n2(rel.quadroDeAreas.areaLazer_m2),
            areaAPP_m2: n2(rel.quadroDeAreas.areaAPP_m2),
            areaNaoAproveitada_m2: n2(rel.quadroDeAreas.areaNaoAproveitada_m2),
          },
        }
      : { aceito: false, recusa: v.recusa?.erros ?? null },
    comprimentoDeViaAposAparo_m: n2(comprimento),
    // ── a régua do próprio Testfit: a "dobra" dos lotes ───────────────────
    dobra: {
      lotes: v.dobra.lotes,
      foraDaFaixaTestada: v.dobra.foraDaFaixaTestada,
      foraDaFaixaArea: v.dobra.foraDaFaixaArea,
      foraDaToleranciaArea: v.dobra.foraDaToleranciaArea,
      sobrepostos: v.dobra.sobrepostos,
      foraDaQuadra: v.dobra.foraDaQuadra,
      maiorFugaDaQuadra_m: n2(v.dobra.maiorFugaDaQuadra_m),
      foraDaGleba: v.dobra.foraDaGleba,
      maiorDesvioTestada_m: n2(v.dobra.maiorDesvioTestada_m),
      maiorDesvioArea_m2: n2(v.dobra.maiorDesvioArea_m2),
    },
    fechamentoDeAreas_pct: n2(v.fechamento.diferenca_pct),
    ms: n2(v.ms),
  };
}

// ═══════════════════════════════════════════════════════════ execução

const GLEBAS = ["ensaio-47ha", "geo-antonina", "lab01-50ha-ondulado"] as const;
const medicoes: Record<string, unknown> = {
  prompt: "LAB-07",
  geradoEm: new Date().toISOString(),
  ambiente: { bun: Bun.version, plataforma: `${process.platform}-${process.arch}` },
  semente: SEMENTE,
  variantesPedidas: VARIANTES,
};
const porGleba: Record<string, unknown> = {};

for (const id of GLEBAS) {
  const entrada = carregar(id);
  console.log(`\n${"═".repeat(72)}\n${id} — ${(entrada.gleba.area_m2 / 1e4).toFixed(2)} ha`);

  const r = rodarEsteira(entrada, {
    semente: SEMENTE,
    variantes: VARIANTES,
    aparar: true,
    formatos: [...TODOS_OS_FORMATOS],
  });
  const variantes = r.variantes.map(resumirVariante);

  console.log(
    `perdas na ida: ${r.perdasNaIda.length} · tempos: ida ${r.tempos.ida_ms.toFixed(0)} ms · ` +
      `motor ${r.tempos.motor_ms.toFixed(0)} ms · volta+juiz ${r.tempos.voltaEJulgamento_ms.toFixed(0)} ms`,
  );
  for (const p of r.perdasNaIda) console.log(`   [ida/${p.gravidade}] ${p.campo}`);

  console.log(
    `\n  ${"#".padStart(3)} ${"formato".padEnd(12)} ${"lotes".padStart(6)} ${"viol".padStart(5)} ` +
      `${"por regra".padEnd(34)} ${"via m".padStart(8)} ${"fora%".padStart(6)} ${"dobra".padStart(6)}`,
  );
  for (const v of variantes) {
    const j = v.julgado as Record<string, unknown>;
    const porRegra = j["porRegra"] ? JSON.stringify(j["porRegra"]) : "—";
    console.log(
      `  ${String(v.posicaoNoMotor).padStart(3)} ${v.formato.padEnd(12)} ` +
        `${String(j["lotes"] ?? "—").padStart(6)} ${String(j["violacoes"] ?? "—").padStart(5)} ` +
        `${porRegra.slice(0, 34).padEnd(34)} ${String(v.comprimentoDeViaAposAparo_m.toFixed(0)).padStart(8)} ` +
        `${String(v.fiel.comprimentoForaDaGleba_pct).padStart(6)} ` +
        `${String(v.dobra.foraDaFaixaTestada + v.dobra.foraDaFaixaArea + v.dobra.sobrepostos).padStart(6)}`,
    );
  }

  // ── rampa do terreno, só onde há relevo ────────────────────────────────
  let rampa: ReturnType<typeof rampaDoTerreno> = null;
  if (entrada.relevo?.curvas?.length) {
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const pts = em.terreno.relevo ?? [];
    // A mesma interpolação corrigida do LAB-01 seria a ideal, mas o que se quer
    // aqui é a rampa que o MOTOR veria: por isso a cota sai do `campoRelevo`
    // dele, replicado — IDW global sobre todos os pontos.
    const cota = (p: { x: number; y: number }): number | null => {
      let num = 0;
      let den = 0;
      for (const q of pts) {
        const d2 = (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + 1;
        num += q.z / d2;
        den += 1 / d2;
      }
      return den > 0 ? num / den : null;
    };
    const melhor = r.variantes[0]!;
    rampa = rampaDoTerreno(melhor.saida.vias, cota);
    if (rampa) {
      console.log(
        `\n  rampa imposta pelo terreno (a melhor variante; o motor NÃO calcula greide):`,
      );
      console.log(
        `    ao longo da via: mediana ${rampa.aoLongoDaVia.mediana_pct} % · p90 ` +
          `${rampa.aoLongoDaVia.p90_pct} % · máx ${rampa.aoLongoDaVia.maxima_pct} % ` +
          `(${rampa.aoLongoDaVia.trechos} trechos)`,
      );
      console.log(
        `    nos cruzamentos: mediana ${rampa.nosCruzamentos.mediana_pct} % · máx ` +
          `${rampa.nosCruzamentos.maxima_pct} % (${rampa.nosCruzamentos.cruzamentos} cruzamentos)`,
      );
    }
  }

  porGleba[id] = {
    area_ha: n2(entrada.gleba.area_m2 / 1e4),
    temRelevo: Boolean(entrada.relevo?.curvas?.length || entrada.relevo?.cotas?.length),
    assinaturaDaRodada: r.assinaturaDaRodada,
    perdasNaIda: r.perdasNaIda,
    perdasNaVolta: r.variantes[0]?.perdasNaVolta ?? [],
    avisosDoMotor: r.avisosDoMotor,
    tempos: {
      ida_ms: n2(r.tempos.ida_ms),
      motor_ms: n2(r.tempos.motor_ms),
      voltaEJulgamento_ms: n2(r.tempos.voltaEJulgamento_ms),
      total_ms: n2(r.tempos.total_ms),
    },
    rampaDoTerreno: rampa,
    variantes,
  };

  // O melhor arquivo de SAÍDA de cada gleba, para quem quiser abrir.
  const melhor = r.variantes[0];
  if (melhor) {
    writeFileSync(
      join(SAIDA, `${id}.saida.json`),
      `${JSON.stringify(melhor.saida, null, 1)}\n`,
      "utf8",
    );
  }
}
medicoes["glebas"] = porGleba;

// ═══════════════════════════════════════════ §2.5 · a superquadra vazia

console.log(`\n${"═".repeat(72)}\n§2.5 — a superquadra nasce vazia? o plano vazio ganha o ranking?`);
const entradaSQ = carregar("ensaio-47ha");
const { entrada: emSQ } = idaParaOMotor(entradaSQ, {
  semente: SEMENTE,
  variantes: VARIANTES,
  formatos: ["superquadra"],
});
const sq = rodarMotor(emSQ);
const vaziasSQ = sq.opcoes.filter((o) => o.plano.metricas.lotes === 0);
console.log(
  `  formato "superquadra", ${sq.opcoes.length} variantes: ` +
    `${vaziasSQ.length} nasceram VAZIAS (0 lotes)`,
);
console.log(
  `  ranking do motor (nota, lotes): ` +
    sq.opcoes
      .slice(0, 6)
      .map((o) => `${o.plano.nota.toFixed(3)}/${o.plano.metricas.lotes}`)
      .join("  "),
);
const primeiroVazio = sq.opcoes[0]!.plano.metricas.lotes === 0;
console.log(`  a variante em PRIMEIRO tem ${sq.opcoes[0]!.plano.metricas.lotes} lotes` +
  `${primeiroVazio ? "  ←  o plano vazio ganhou o ranking" : ""}`);

// E na disputa aberta, com todos os formatos?
const { entrada: emTodos } = idaParaOMotor(entradaSQ, {
  semente: SEMENTE,
  variantes: VARIANTES,
  formatos: [...TODOS_OS_FORMATOS],
});
const todos = rodarMotor(emTodos);
const vaziasTodos = todos.opcoes.filter((o) => o.plano.metricas.lotes === 0);
console.log(
  `\n  disputa aberta (todos os formatos), ${todos.opcoes.length} variantes: ` +
    `${vaziasTodos.length} vazia(s); em primeiro, ${todos.opcoes[0]!.plano.formato} com ` +
    `${todos.opcoes[0]!.plano.metricas.lotes} lotes`,
);

medicoes["superquadra"] = {
  relatadoPeloTestfit: "a superquadra nasce vazia em 11 de 12 variantes e o plano vazio ganha o ranking",
  formatoIsolado: {
    variantes: sq.opcoes.length,
    vazias: vaziasSQ.length,
    primeiroTemLotes: sq.opcoes[0]!.plano.metricas.lotes,
    planoVazioGanhou: primeiroVazio,
    ranking: sq.opcoes.map((o) => ({
      formato: o.plano.formato,
      nota: n2(o.plano.nota),
      lotes: o.plano.metricas.lotes,
      areaPrivativa_m2: n2(o.plano.metricas.areaPrivativa_m2),
    })),
  },
  disputaAberta: {
    variantes: todos.opcoes.length,
    vazias: vaziasTodos.length,
    primeiroFormato: todos.opcoes[0]!.plano.formato,
    primeiroTemLotes: todos.opcoes[0]!.plano.metricas.lotes,
  },
};

// ═══════════════════════════════════════════════════ determinismo (§2.4)

console.log(`\n${"═".repeat(72)}\ndeterminismo — mesma entrada e semente, duas vezes`);
const entradaDet = carregar("ensaio-47ha");
const det = { variantes: 4, aparar: true, formatos: [...TODOS_OS_FORMATOS] } as const;
const d1 = rodarEsteira(entradaDet, { ...det, semente: SEMENTE });
const d2 = rodarEsteira(entradaDet, { ...det, semente: SEMENTE });
const d3 = rodarEsteira(entradaDet, { ...det, semente: SEMENTE + 1 });

// A prova é sobre a SAÍDA DO CONTRATO, não só sobre a assinatura do motor: é o
// arquivo que atravessa a ponte, e é ele que tem de ser igual byte a byte.
const texto = (r: RodadaMedida) => JSON.stringify(r.variantes.map((v) => v.saida));
const iguais = texto(d1) === texto(d2);
const diferente = texto(d1) !== texto(d3);
console.log(`  semente ${SEMENTE}, execução 1: assinatura ${d1.assinaturaDaRodada}`);
console.log(`  semente ${SEMENTE}, execução 2: assinatura ${d2.assinaturaDaRodada}`);
console.log(`  semente ${SEMENTE + 1}:          assinatura ${d3.assinaturaDaRodada}`);
console.log(
  `  SAÍDA DO CONTRATO byte a byte: mesma semente -> ${iguais ? "IDÊNTICA" : "DIVERGENTE"}; ` +
    `semente diferente -> ${diferente ? "diferente" : "IGUAL (semente sem efeito!)"}`,
);
medicoes["determinismo"] = {
  semente: SEMENTE,
  assinaturaExecucao1: d1.assinaturaDaRodada,
  assinaturaExecucao2: d2.assinaturaDaRodada,
  assinaturaOutraSemente: d3.assinaturaDaRodada,
  saidaDoContratoIdentica: iguais,
  sementeTemEfeito: diferente,
};

writeFileSync(join(SAIDA, "medicoes.json"), `${JSON.stringify(medicoes, null, 2)}\n`, "utf8");
console.log(`\ndocs/provas/LAB-07/medicoes.json`);
