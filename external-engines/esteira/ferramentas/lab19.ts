#!/usr/bin/env bun
/**
 * LAB-19 — a regra de forma do chat, na tabela comparativa. (02/10/2026)
 *
 * ```sh
 * bun ferramentas/lab19.ts
 * ```
 *
 * # O que esta ferramenta faz
 *
 * Aplica a regra que o chat decidiu — **área útil abaixo de 85 % da caixa
 * envolvente = "a conferir"; abaixo de 70 % = "ruim"** —, põe a **coluna na
 * tabela comparativa** e mede os **quatro motores** nas cinco glebas.
 *
 * # Por que ela refaz a tabela inteira, e não só a coluna
 *
 * Porque "pôr a coluna na tabela" só quer dizer algo se a tabela sair junto. Uma
 * coluna publicada num arquivo à parte obriga quem lê a cruzar dois JSON, e é
 * assim que número vai para a linha errada.
 *
 * A saída, `docs/provas/LAB-19/tabela.json`, é também **a entrada do LAB-20** —
 * a página que o Jonny abre sem terminal. Uma medição, duas leituras.
 *
 * # O que ela NÃO faz
 *
 * Não decide se "a conferir" reprova. O veredito do ranking é do **Validator do
 * Generate** (D20), e forma de lote não é violação dele. A coluna informa; ela
 * não vira régua de aprovação por conta própria.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import { areaPoligono } from "@symbios/geo.ts";
import type { Terreno } from "@symbios/contrato.ts";
import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { julgar, type P, type Rodada, type Veredito } from "../src/motores/comum.ts";
import { mapaDaGleba, perfilDeRampa } from "../src/rampa.ts";
import {
  POSICOES_DE_ACESSO,
  amplitudePctDe,
  referenciaDe,
  sensibilidadeAoAcesso,
  type SensibilidadeAoAcesso,
} from "../src/acesso.ts";
import { indicadoresDeTerreno } from "../src/terreno-indicadores.ts";
import {
  UTIL_A_CONFERIR,
  UTIL_RUIM,
  distribuicaoDeForma,
} from "../src/forma.ts";
import { rodarGenerate } from "../src/motores/generate.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-19");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

// Os mesmos do LAB-13 e do LAB-16: mudar a semente aqui mediria outra coisa.
const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

const n2 = (v: number) => Number(v.toFixed(2));
const n4 = (v: number | null) => (v == null ? null : Number(v.toFixed(4)));
const pc = (a: number, b: number) => (b > 0 ? Number(((100 * a) / b).toFixed(2)) : 0);

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
];

const MOTORES = [
  { id: "generate-ortogonal", nome: "Generate · candidata ortogonal" },
  { id: "generate-espinha", nome: "Generate · candidata espinha" },
  { id: "parcelamento", nome: "Laboratório de Parcelamento" },
  { id: "symbios", nome: "Symbios + subdivisão do Lab" },
] as const;

function rodar(id: string, e: EntradaMinima): Rodada {
  if (id === "generate-ortogonal") return rodarGenerate(e, "ortogonal", CARIMBO);
  if (id === "generate-espinha") return rodarGenerate(e, "espinha", CARIMBO);
  if (id === "parcelamento") return rodarTestfit(e, SEMENTE);
  return rodarSymbios(wasm, e, SEMENTE, CARIMBO);
}

/** As vias da SAÍDA, para a régua de rampa, com o que o motor declarou. */
function viasDaSaida(saida: unknown): {
  vias: { id: string; pontos: P[]; largura_m: number }[];
  declaradoPeloMotor: number | null;
} {
  const s = saida as {
    vias?: {
      id?: string; pontos?: P[]; eixo?: P[];
      largura_m?: number; caixa_m?: number;
      rampaMaxima_pct?: number | null;
    }[];
  } | null;
  const brutas = s?.vias ?? [];
  const vias = brutas
    .map((v, i) => ({
      id: v.id ?? `v${i}`,
      pontos: v.eixo ?? v.pontos ?? [],
      largura_m: v.largura_m ?? v.caixa_m ?? 0,
    }))
    .filter((v) => v.pontos.length >= 2);
  const picos = brutas.map((v) => v.rampaMaxima_pct).filter((r): r is number => typeof r === "number");
  return { vias, declaradoPeloMotor: picos.length ? Math.max(...picos) : null };
}

/** Os anéis dos lotes, pelo mesmo caminho do `julgar` — a régua é uma só. */
function lotesDaSaida(saida: unknown, entrada: EntradaMinima): P[][] | null {
  const l = montarParcelamentoExterno(saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) return null;
  return (l.externo.resultado.lotes as { pontos: P[] }[]).map((lo) => lo.pontos);
}

/** Os lotes com id, para o bloco de terreno poder dizer QUAL é o pior. */
function lotesComId(saida: unknown, entrada: EntradaMinima): { id: string; pontos: P[] }[] {
  const l = montarParcelamentoExterno(saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) return [];
  return (l.externo.resultado.lotes as { id?: string; pontos: P[] }[]).map((lo, i) => ({
    id: lo.id ?? `lote-${i}`,
    pontos: lo.pontos,
  }));
}

console.log(
  `[LAB-19] a regra do chat: útil < ${100 * UTIL_A_CONFERIR} % = "a conferir" · ` +
    `< ${100 * UTIL_RUIM} % = "ruim"`,
);

const glebas: Record<string, unknown>[] = [];

for (const { id, entrada } of GLEBAS) {
  const { terreno } = glebaParaOSymbios(entrada);
  const areaGleba = areaPoligono((terreno as Terreno).gleba);
  // O mapa de cotas é montado UMA vez por gleba: ele é da gleba, não do motor.
  const mapa = mapaDaGleba(terreno as Terreno);
  console.log(`\n══════════ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha ══════════`);
  console.log(
    `  ${"motor".padEnd(30)} ${"lotes".padStart(5)} ${"vendável".padStart(9)} ` +
      `${"viol".padStart(5)} ${"ok".padStart(5)} ${"a conferir".padStart(11)} ${"ruim".padStart(7)} ${"útil med".padStart(9)} ` +
      `${`lotes em ${POSICOES_DE_ACESSO} acessos`.padStart(20)}`,
  );

  const porMotor: Record<string, unknown> = {};
  /** As sensibilidades da gleba, para o confronto sair daqui e não da página. */
  const sensPorMotor: Record<string, SensibilidadeAoAcesso> = {};

  for (const m of MOTORES) {
    const r = rodar(m.id, entrada);
    const v: Veredito | null = r.saida ? julgar(r.saida, entrada) : null;
    const aneis = r.saida ? lotesDaSaida(r.saida, entrada) : null;
    const d = aneis ? distribuicaoDeForma(aneis) : null;
    const { vias, declaradoPeloMotor } = viasDaSaida(r.saida);
    const ramp = perfilDeRampa(vias, mapa);
    // O bloco de terreno (LAB-24): os dois limites do Jonny, com forças
    // diferentes — 30 % no lote REPROVA, 15 % na rua só AVISA.
    const terreno_ = indicadoresDeTerreno(
      vias.filter((v) => v.largura_m > 0),
      r.saida ? lotesComId(r.saida, entrada) : [],
      mapa,
    );
    // A sensibilidade ao acesso (LAB-28). O motor roda de novo em cada posição,
    // e quem julga continua sendo o Validator do Generate — `julgar`, o mesmo
    // desta linha de tabela. Duas réguas para a mesma grandeza é o que o D20
    // proíbe, e aqui seria fácil cair nisso contando lotes por conta própria.
    const acessoSens = sensibilidadeAoAcesso(entrada, (x) => {
      const rr = rodar(m.id, x);
      const vv = rr.saida ? julgar(rr.saida, x) : null;
      return {
        lotes: vv?.lotes ?? null,
        areaVendavel_m2: vv?.areaPrivativa_m2 == null ? null : n2(vv.areaPrivativa_m2),
      };
    });

    sensPorMotor[m.id] = acessoSens;
    porMotor[m.id] = {
      motor: m.nome,
      variante: r.variante,
      ms: n2(r.ms),
      naoSoubeFazer: r.naoSoubeFazer,
      recusadoPeloEsquema: v?.recusa ?? null,
      lotes: v?.lotes ?? null,
      areaVendavel_m2: v?.areaPrivativa_m2 == null ? null : n2(v.areaPrivativa_m2),
      pctPrivativa: v?.areaPrivativa_m2 == null ? null : pc(v.areaPrivativa_m2, areaGleba),
      violacoes: v?.violacoes ?? null,
      violacoesPorRegra: v?.porTipo ?? null,
      sobraSemLote_m2: v?.sobras ? n2(v.sobras.areaSobra_m2) : null,
      pctDaMassaSemLote: v?.sobras ? pc(v.sobras.areaSobra_m2, v.sobras.massa_m2) : null,
      // ── a coluna da rampa, do LAB-21 ────────────────────────────────────
      //
      // DUAS réguas, nunca somadas: o que o motor DECLARA e o que o Lab MEDE
      // passando o eixo dele pelo relevo. A segunda vale para os quatro, e a
      // primeira só para quem calcula greide.
      rampa: {
        declaradoPeloMotor_pct: declaradoPeloMotor,
        medida: ramp.medida,
        porQueNaoMedida: ramp.porQueNaoMedida,
        mediaPonderada_pct: ramp.rampaMediaPonderada_pct,
        pior_pct: ramp.rampaPior_pct,
        trechos: ramp.trechos,
        trechosAcimaDe: ramp.trechosAcimaDe,
        metrosAcimaDe: ramp.metrosAcimaDe,
        cruzamentos: ramp.cruzamentos,
        cruzamentosAcimaDe: ramp.cruzamentosAcimaDe,
      },
      // ── o bloco de indicadores de terreno, do LAB-24 ────────────────────
      terreno: terreno_,
      // ── a sensibilidade ao acesso, do LAB-28 ────────────────────────────
      //
      // A coluna que faltava, e é a de maior efeito que o Lab mede: a MESMA
      // gleba e o MESMO motor, com a entrada da rua em seis pontos do perímetro.
      // Sem ela, esta tabela responde "qual motor é melhor NESTE ponto de
      // entrada" e se apresenta como "qual motor é melhor".
      //
      // A amplitude é PISO: seis pontos não varrem o perímetro (ver `acesso.ts`).
      acesso: acessoSens,
      // ── a coluna nova, do LAB-19 ────────────────────────────────────────
      forma: d
        ? {
            regra: { aConferirAbaixoDe: UTIL_A_CONFERIR, ruimAbaixoDe: UTIL_RUIM },
            lotes: d.lotes,
            ok: d.porVeredito.ok,
            aConferir: d.porVeredito["a conferir"],
            ruim: d.porVeredito.ruim,
            pctAConferir: d.pctAConferir == null ? null : Number((100 * d.pctAConferir).toFixed(2)),
            pctRuim: d.pctRuim == null ? null : Number((100 * d.pctRuim).toFixed(2)),
            utilMediana: n4(d.mediana == null ? null : 1 - d.mediana),
            utilPior: n4(d.maxima == null ? null : 1 - d.maxima),
            porClasse: d.porClasse,
            comLadoCurvo: d.comLadoCurvo,
          }
        : null,
    };

    if (!d) {
      console.log(`  ${m.nome.padEnd(30)} RECUSADO pelo esquema — nada a medir`);
      continue;
    }
    console.log(
      `  ${m.nome.padEnd(30)} ${String(d.lotes).padStart(5)} ` +
        `${(v?.areaPrivativa_m2 == null ? "—" : `${(v.areaPrivativa_m2 / 1e4).toFixed(2)} ha`).padStart(9)} ` +
        `${String(v?.violacoes ?? "—").padStart(5)} ` +
        `${String(d.porVeredito.ok).padStart(5)} ` +
        `${`${d.porVeredito["a conferir"]} (${(100 * (d.pctAConferir ?? 0)).toFixed(1)}%)`.padStart(11)} ` +
        `${`${d.porVeredito.ruim} (${(100 * (d.pctRuim ?? 0)).toFixed(1)}%)`.padStart(7)} ` +
        `${(1 - (d.mediana ?? 0)).toFixed(3).padStart(9)} ` +
        `${`${acessoSens.lotes.minimo}–${acessoSens.lotes.maximo} (+${acessoSens.lotes.amplitudePct ?? "—"}%)`.padStart(20)}`,
    );
  }

  // ── O confronto do acesso, calculado AQUI e não na página (LAB-28) ─────────
  //
  // De um lado, a maior amplitude que um MESMO motor exibe só mudando a entrada.
  // Do outro, quanto os motores que entregam **lote** diferem entre si na mesma
  // referência. O Symbios fica fora da segunda conta porque entrega **quadra** e
  // os lotes dele são da subdivisão do Lab (D50): incluí-lo infla a diferença até
  // 355 %, que é a distância entre duas ETAPAS e não entre duas opções.
  //
  // A referência de cada motor vem da `referenciaDe`, que é a única — a primeira
  // versão tinha duas, e dava dois confrontos para a mesma gleba (D116).
  const amplitudes = Object.values(sensPorMotor).map((x) => x.lotes.amplitudePct ?? 0);
  const confrontoDoAcesso = {
    maiorAmplitude_pct: amplitudes.length ? Math.max(...amplitudes) : 0,
    entreOsQuatroMotores_pct: amplitudePctDe(
      Object.values(sensPorMotor).map((x) => referenciaDe(x)),
    ),
    entreOsMotoresDeLote_pct: amplitudePctDe(
      MOTORES.filter((m) => m.id !== "symbios").map((m) =>
        sensPorMotor[m.id] ? referenciaDe(sensPorMotor[m.id]!) : null,
      ),
    ),
  };

  glebas.push({
    prompt: "LAB-19",
    gleba: id,
    areaDaGleba_m2: n2(areaGleba),
    semente: SEMENTE,
    contrato: "1",
    confrontoDoAcesso,
    motores: porMotor,
  });
}

writeFileSync(
  join(SAIDA, "tabela.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-19",
      geradoEm: CARIMBO,
      semente: SEMENTE,
      contrato: "1",
      regraDeForma: {
        decididaPor: "chat",
        em: "2026-10-02",
        aConferirAbaixoDe: UTIL_A_CONFERIR,
        ruimAbaixoDe: UTIL_RUIM,
        medida: "área do lote dividida pela área da caixa de MENOR área, em qualquer orientação",
        observacao:
          "regra do chat, à espera de confirmação do Jonny — ver docs/PENDENCIAS_JONNY.md",
      },
      glebas,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-19/tabela.json`);
