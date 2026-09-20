#!/usr/bin/env bun
/**
 * LAB-16 — a régua de forma, e as cinco glebas reprovadas de novo.
 *
 * ```sh
 * bun ferramentas/lab16.ts
 * ```
 *
 * # O que esta ferramenta responde
 *
 * O chat mandou: *"conserte a régua, reprove de novo as cinco glebas e diga o
 * que muda na tabela do LAB-13"*. As três coisas, nesta ordem, e com a primeira
 * dita com todas as letras: **metade do conserto já estava feita**, no LAB-13
 * (D63), e o que faltava era outra coisa — ver o cabeçalho de `src/forma.ts`.
 *
 * O que sai em `docs/provas/LAB-16/forma.json`: por gleba e por motor, a
 * distribuição inteira da régua justa, a contagem nos **três** cortes
 * declarados, a contagem da régua velha ao lado, e a **composição por forma**.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import type { P, Rodada } from "../src/motores/comum.ts";
import { CORTES_DE_FORMA, distribuicaoDeForma } from "../src/forma.ts";
import { rodarGenerate } from "../src/motores/generate.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-16");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

// Os mesmos do LAB-13, de propósito: mudar a semente aqui faria a comparação
// medir outra coisa.
const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

const n2 = (v: number) => Number(v.toFixed(2));
const n4 = (v: number | null) => (v == null ? null : Number(v.toFixed(4)));

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

/** Os anéis dos lotes, pelo mesmo caminho do `julgar` — a régua é uma só. */
function lotesDaSaida(saida: unknown, entrada: EntradaMinima): P[][] | null {
  const l = montarParcelamentoExterno(saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) return null;
  return (l.externo.resultado.lotes as { pontos: P[] }[]).map((lo) => lo.pontos);
}

const linhas: Record<string, unknown>[] = [];

console.log(`[LAB-16] cortes declarados: ${CORTES_DE_FORMA.map((c) => `${100 * c} %`).join(" · ")}`);

for (const { id, entrada } of GLEBAS) {
  console.log(`\n══════════ ${id} ══════════`);
  const porMotor: Record<string, unknown> = {};

  for (const m of MOTORES) {
    const r = rodar(m.id, entrada);
    const aneis = r.saida ? lotesDaSaida(r.saida, entrada) : null;
    if (!aneis) {
      console.log(`  ${m.nome.padEnd(32)} RECUSADO pelo esquema — nada a medir`);
      porMotor[m.id] = { motor: m.nome, recusado: true, forma: null };
      continue;
    }

    const d = distribuicaoDeForma(aneis);
    porMotor[m.id] = {
      motor: m.nome,
      recusado: false,
      forma: {
        lotes: d.lotes,
        mediana: n4(d.mediana),
        p90: n4(d.p90),
        p99: n4(d.p99),
        maxima: n4(d.maxima),
        acimaDe: d.acimaDe,
        acimaDeUmPorCentoPelosEixos: d.acimaDeUmPorCentoPelosEixos,
        porClasse: d.porClasse,
        comLadoCurvo: d.comLadoCurvo,
        area_m2: n2(d.area_m2),
      },
    };

    const c1 = d.acimaDe["0.01"] ?? 0;
    const c5 = d.acimaDe["0.05"] ?? 0;
    const c10 = d.acimaDe["0.1"] ?? 0;
    console.log(
      `  ${m.nome.padEnd(32)} ${String(d.lotes).padStart(5)} lotes · ` +
        `acima de 1 % ${String(c1).padStart(5)} · 5 % ${String(c5).padStart(5)} · 10 % ${String(c10).padStart(5)} · ` +
        `pela régua VELHA ${String(d.acimaDeUmPorCentoPelosEixos).padStart(5)} · ` +
        `mediana ${(d.mediana ?? 0).toFixed(4)} · lado curvo ${d.comLadoCurvo}`,
    );
    const top = Object.entries(d.porClasse).sort((a, b) => b[1] - a[1]).slice(0, 4);
    console.log(`       formas: ${top.map(([k, v]) => `${v} ${k}`).join(" · ")}`);
  }

  linhas.push({ prompt: "LAB-16", gleba: id, semente: SEMENTE, contrato: "1", motores: porMotor });
}

writeFileSync(
  join(SAIDA, "forma.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-16",
      geradoEm: CARIMBO,
      semente: SEMENTE,
      contrato: "1",
      cortesDeclarados: CORTES_DE_FORMA,
      observacao:
        "qual corte separa lote bom de lote ruim é decisão de urbanismo, e está em docs/PENDENCIAS_JONNY.md",
      glebas: linhas,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-16/forma.json`);
