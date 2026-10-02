#!/usr/bin/env bun
/**
 * LAB-21 — a rampa, trecho por trecho e cruzamento por cruzamento. (03/10/2026)
 *
 * ```sh
 * bun run lab21
 * ```
 *
 * # A pergunta
 *
 * O LAB-18 pôs o pico no contrato e mediu **161,38 %** contra **24,23 %** de
 * média, na mesma gleba. O chat mandou medir **quantos trechos e cruzamentos
 * passam dos limites**, em todas as glebas e todos os motores.
 *
 * # As duas réguas, e por que as duas
 *
 * - **o que o MOTOR declara** (`vias[].rampaMaxima_pct`): só o Symbios preenche;
 * - **o que o LAB mede**, passando o eixo de cada via pelo relevo da gleba:
 *   vale para os quatro, inclusive os que não dizem nada.
 *
 * A segunda não substitui a primeira. Um motor que não calcula greide pode ter
 * traçado uma rua que o relevo reprova **sem saber** — e é isso que aparece aqui.
 *
 * # O limite legal
 *
 * **Não existe limite de rampa de VIA na família, e o Lab não o inventa.** Ver o
 * cabeçalho de `src/rampa.ts`. Os cortes são de leitura; o de 30 % é o único com
 * fonte, e é **do terreno** (Lei 6.766/1979), não do greide.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import type { Terreno } from "@symbios/contrato.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import type { P, Rodada } from "../src/motores/comum.ts";
import {
  CORTES_DE_RAMPA,
  CORTE_DA_LEI_6766_TERRENO_PCT,
  mapaDaGleba,
  perfilDeRampa,
} from "../src/rampa.ts";
import { rodarGenerate } from "../src/motores/generate.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-21");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

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
  { id: "generate-ortogonal", nome: "Generate · ortogonal" },
  { id: "generate-espinha", nome: "Generate · espinha" },
  { id: "parcelamento", nome: "Laboratório de Parcelamento" },
  { id: "symbios", nome: "Symbios + subdivisão do Lab" },
] as const;

function rodar(id: string, e: EntradaMinima): Rodada {
  if (id === "generate-ortogonal") return rodarGenerate(e, "ortogonal", CARIMBO);
  if (id === "generate-espinha") return rodarGenerate(e, "espinha", CARIMBO);
  if (id === "parcelamento") return rodarTestfit(e, SEMENTE);
  return rodarSymbios(wasm, e, SEMENTE, CARIMBO);
}

/** As vias da SAÍDA, com o que o motor declarou sobre a rampa delas. */
function viasDaSaida(saida: unknown): {
  vias: { id: string; pontos: P[] }[];
  declaradoPeloMotor: number | null;
} {
  const s = saida as {
    vias?: { id?: string; pontos?: P[]; eixo?: P[]; rampaMaxima_pct?: number | null }[];
  } | null;
  const brutas = s?.vias ?? [];
  const vias = brutas
    .map((v, i) => ({ id: v.id ?? `v${i}`, pontos: v.eixo ?? v.pontos ?? [] }))
    .filter((v) => v.pontos.length >= 2);
  const picos = brutas
    .map((v) => v.rampaMaxima_pct)
    .filter((r): r is number => typeof r === "number");
  return { vias, declaradoPeloMotor: picos.length ? Math.max(...picos) : null };
}

console.log(
  `[LAB-21] cortes de LEITURA: ${CORTES_DE_RAMPA.map((c) => `${c} %`).join(" · ")}` +
    ` — e o de ${CORTE_DA_LEI_6766_TERRENO_PCT} % é do TERRENO (Lei 6.766/1979), não do greide`,
);

const linhas: Record<string, unknown>[] = [];

for (const { id, entrada } of GLEBAS) {
  const { terreno } = glebaParaOSymbios(entrada);
  const mapa = mapaDaGleba(terreno as Terreno);
  const curvas = entrada.relevo?.curvas?.length ?? 0;

  console.log(`\n══════════ ${id} · ${curvas} curvas de nível ══════════`);
  if (!mapa) {
    console.log(`  SEM MAPA DE COTAS — nada a medir nesta gleba, e isso sai declarado`);
  }

  const porMotor: Record<string, unknown> = {};
  for (const m of MOTORES) {
    const r = rodar(m.id, entrada);
    const { vias, declaradoPeloMotor } = viasDaSaida(r.saida);
    const p = perfilDeRampa(vias, mapa);

    porMotor[m.id] = {
      motor: m.nome,
      vias: vias.length,
      declaradoPeloMotor_pct: declaradoPeloMotor,
      oMotorDeclaraOPico: declaradoPeloMotor != null,
      medidoPeloLab: p,
    };

    if (!p.medida) {
      console.log(`  ${m.nome.padEnd(30)} NÃO MEDIDA — ${p.porQueNaoMedida}`);
      continue;
    }
    const t = p.trechosAcimaDe!;
    const me = p.metrosAcimaDe!;
    const cr = p.cruzamentosAcimaDe!;
    console.log(
      `  ${m.nome.padEnd(30)} ${String(p.trechos).padStart(5)} trechos · ` +
        `média ${String(p.rampaMediaPonderada_pct).padStart(6)} % · PICO ${String(p.rampaPior_pct).padStart(7)} % · ` +
        `declarado pelo motor ${declaradoPeloMotor == null ? "   —  " : `${declaradoPeloMotor.toFixed(2)} %`}`,
    );
    console.log(
      `       trechos acima de  8 % ${String(t["8"]).padStart(5)} · 15 % ${String(t["15"]).padStart(5)} · ` +
        `20 % ${String(t["20"]).padStart(5)} · 30 % ${String(t["30"]).padStart(5)}`,
    );
    console.log(
      `       METROS  acima de  8 % ${String(Math.round(me["8"]!)).padStart(5)} · 15 % ${String(Math.round(me["15"]!)).padStart(5)} · ` +
        `20 % ${String(Math.round(me["20"]!)).padStart(5)} · 30 % ${String(Math.round(me["30"]!)).padStart(5)}`,
    );
    console.log(
      `       cruzamentos ${String(p.cruzamentos).padStart(4)}, acima de 8 % ${String(cr["8"]).padStart(4)} · ` +
        `15 % ${String(cr["15"]).padStart(4)} · 30 % ${String(cr["30"]).padStart(4)}` +
        (p.piorCruzamento ? ` · pior ${p.piorCruzamento.piorRampa_pct.toFixed(2)} %` : ""),
    );
  }

  linhas.push({
    prompt: "LAB-21",
    gleba: id,
    curvasDeNivel: curvas,
    temMapaDeCotas: mapa != null,
    semente: SEMENTE,
    contrato: "1",
    motores: porMotor,
  });
}

writeFileSync(
  join(SAIDA, "rampa.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-21",
      geradoEm: CARIMBO,
      semente: SEMENTE,
      cortesDeLeitura_pct: CORTES_DE_RAMPA,
      sobreOsCortes:
        "nenhum destes cortes é limite legal de rampa de VIA — esse limite não existe na família. " +
        `O de ${CORTE_DA_LEI_6766_TERRENO_PCT} % é a declividade máxima parcelável do TERRENO ` +
        "(Lei 6.766/1979, art. 3º, § único, III), que é outra coisa. Ver docs/PENDENCIAS_JONNY.md.",
      duasReguas: {
        declaradoPeloMotor: "vias[].rampaMaxima_pct da SAÍDA — o motor diz que calculou o greide",
        medidoPeloLab:
          "o eixo de cada via amostrado de 5 em 5 m sobre o relevo da gleba — vale para motor que não diz nada",
      },
      glebas: linhas,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-21/rampa.json`);
