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

/** Os anéis dos lotes, pelo mesmo caminho do `julgar` — a régua é uma só. */
function lotesDaSaida(saida: unknown, entrada: EntradaMinima): P[][] | null {
  const l = montarParcelamentoExterno(saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) return null;
  return (l.externo.resultado.lotes as { pontos: P[] }[]).map((lo) => lo.pontos);
}

console.log(
  `[LAB-19] a regra do chat: útil < ${100 * UTIL_A_CONFERIR} % = "a conferir" · ` +
    `< ${100 * UTIL_RUIM} % = "ruim"`,
);

const glebas: Record<string, unknown>[] = [];

for (const { id, entrada } of GLEBAS) {
  const { terreno } = glebaParaOSymbios(entrada);
  const areaGleba = areaPoligono((terreno as Terreno).gleba);
  console.log(`\n══════════ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha ══════════`);
  console.log(
    `  ${"motor".padEnd(30)} ${"lotes".padStart(5)} ${"vendável".padStart(9)} ` +
      `${"viol".padStart(5)} ${"ok".padStart(5)} ${"a conferir".padStart(11)} ${"ruim".padStart(7)} ${"útil med".padStart(9)}`,
  );

  const porMotor: Record<string, unknown> = {};

  for (const m of MOTORES) {
    const r = rodar(m.id, entrada);
    const v: Veredito | null = r.saida ? julgar(r.saida, entrada) : null;
    const aneis = r.saida ? lotesDaSaida(r.saida, entrada) : null;
    const d = aneis ? distribuicaoDeForma(aneis) : null;

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
        `${(1 - (d.mediana ?? 0)).toFixed(3).padStart(9)}`,
    );
  }

  glebas.push({
    prompt: "LAB-19",
    gleba: id,
    areaDaGleba_m2: n2(areaGleba),
    semente: SEMENTE,
    contrato: "1",
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
