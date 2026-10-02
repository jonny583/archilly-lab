#!/usr/bin/env bun
/**
 * LAB-18 — o contrato v2 revendorizado, e o que ele mudou. (02/10/2026)
 *
 * ```sh
 * bun run lab18
 * ```
 *
 * # O que esta ferramenta mede
 *
 * 1. **a versão** que cada motor fala, na entrada e na saída;
 * 2. **as três coisas que o v2 trouxe a pedido do Lab**, uma a uma, com o
 *    estado real: a nascente, o eixo do curso e a rampa máxima por via;
 * 3. **se há dado nos campos novos** — que é outra pergunta, e a resposta
 *    desconfortável está no relatório.
 *
 * A quarta parte — **o que mudou na tabela do LAB-13** — sai do `lab19.ts`
 * rodado de novo e comparado com a tabela anterior; está no relatório, porque é
 * comparação entre duas medições e não uma medição nova.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { FALTA_NA_V1, VERSOES_LIDAS, type EntradaMinima } from "../src/gleba-v1.ts";
import { entradaDaPorta, type Indicadores } from "../src/porta/porta.ts";
import {
  motorDoGenerate,
  motorDoParcelamento,
  motorDoSymbios,
  separar,
} from "../src/porta/motores.ts";
import { RAIO_DA_NASCENTE_M } from "../src/travessia.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-18");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const GENERATE = join(RAIZ, "..", "urban-create-hub-41d93a4d");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";
const n2 = (v: number | null) => (v == null ? null : Number(v.toFixed(2)));

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
];

/** As glebas-padrão DO GENERATE, que já são v2 — é lá que o dado novo apareceria. */
const DELES = ["ensaio-47ha", "geo-antonina"].map((id) => ({
  id,
  entrada: JSON.parse(
    readFileSync(join(GENERATE, "docs", "glebas-padrao", `${id}.entrada.json`), "utf8"),
  ) as EntradaMinima,
}));

console.log(`[LAB-18] a esteira lê o contrato ${VERSOES_LIDAS.map((v) => `"${v}"`).join(" e ")}`);

// ── 1 · há DADO nos campos que o v2 trouxe? ───────────────────────────────
console.log(`\n══════════ os campos novos do v2, e se há dado neles ══════════`);
const camposNovos: Record<string, unknown>[] = [];
for (const { id, entrada } of [...GLEBAS, ...DELES.map((d) => ({ id: `${d.id} (do Generate, v2)`, entrada: d.entrada }))]) {
  const rs = entrada.restricoes ?? [];
  const linha = {
    gleba: id,
    versaoDeclarada: entrada.archilly.versao,
    restricoes: rs.length,
    tiposDeRestricao: [...new Set(rs.map((r) => r.tipo))],
    comTipoNascente: rs.filter((r) => r.tipo === "app_nascente").length,
    comPontoDaNascente: rs.filter((r) => r.nascente != null).length,
    hidricas: rs.filter((r) => r.tipo === "app_hidrica" || r.tipo === "curso_dagua").length,
    comEixoDoCurso: rs.filter((r) => r.eixoDoCurso != null && r.eixoDoCurso.length >= 2).length,
    tiposDeAtracao: [
      ...new Set((entrada.atracoes ?? []).map((a) => (a as { tipo?: string }).tipo ?? "—")),
    ],
  };
  camposNovos.push(linha);
  console.log(
    `  ${id.padEnd(34)} v${linha.versaoDeclarada} · nascente: tipo ${linha.comTipoNascente}, ponto ${linha.comPontoDaNascente}` +
      ` · hídricas ${linha.hidricas}, com eixo ${linha.comEixoDoCurso} · atrações ${JSON.stringify(linha.tiposDeAtracao)}`,
  );
}

// ── 2 · a rampa: a média que diluía, e o pico que agora viaja ─────────────
console.log(`\n══════════ a rampa por via: a média, e o PICO que o v2 deixou passar ══════════`);
const motores = [
  motorDoGenerate("ortogonal"),
  motorDoGenerate("espinha"),
  motorDoParcelamento(),
  motorDoSymbios(wasm),
];
const rampas: Record<string, unknown>[] = [];
for (const { id, entrada } of GLEBAS) {
  const daPorta = entradaDaPorta(entrada, SEMENTE, CARIMBO, separar);
  const porMotor: Record<string, unknown> = {};
  for (const m of motores) {
    const r = m.gerar(daPorta);
    const i = r.indicadores as Indicadores;
    const s = r.saida as { archilly?: { versao?: string }; vias?: unknown[] } | null;
    porMotor[m.capacidades().id] = {
      saidaVersao: s?.archilly?.versao ?? null,
      vias: s?.vias?.length ?? null,
      maiorRampaMedia_pct: n2(i.rampaMediaMaxima_pct),
      piorRampa_pct: n2(i.rampaPior_pct),
      reportaOPico: i.rampaPior_pct != null,
    };
    const p = porMotor[m.capacidades().id] as { maiorRampaMedia_pct: number | null; piorRampa_pct: number | null };
    console.log(
      `  ${id.padEnd(24)} ${m.capacidades().id.padEnd(20)} saída v${s?.archilly?.versao ?? "—"} · ` +
        `média ${p.maiorRampaMedia_pct == null ? "null" : `${p.maiorRampaMedia_pct} %`} · ` +
        `PICO ${p.piorRampa_pct == null ? "null (não reporta)" : `${p.piorRampa_pct} %`}`,
    );
  }
  rampas.push({ gleba: id, motores: porMotor });
}

writeFileSync(
  join(SAIDA, "contrato-v2.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-18",
      geradoEm: CARIMBO,
      semente: SEMENTE,
      contratoLidoPelaEsteira: VERSOES_LIDAS,
      generateEm: readFileSync(join(GENERATE, ".git", "refs", "heads", "main"), "utf8").trim(),
      oQueAV1NaoCarrega: FALTA_NA_V1,
      raioDaNascente_m: RAIO_DA_NASCENTE_M,
      camposNovosDoV2: camposNovos,
      rampaPorVia: rampas,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-18/contrato-v2.json`);
