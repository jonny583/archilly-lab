#!/usr/bin/env bun
/**
 * LAB-17 — as glebas com via desenhada, os quatro motores, e a D69.
 *
 * ```sh
 * bun ferramentas/lab17.ts
 * ```
 *
 * # A pergunta que o LAB-13 não pôde fazer
 *
 * *"Aderência a via desenhada à mão."* O LAB-13 mediu e descobriu que **nenhuma
 * das cinco glebas tem via desenhada** — quatro não têm atração nenhuma e a
 * quinta tem uma testada de frente, que é outra coisa (D64).
 *
 * É exatamente o que a tela unificada precisa comparar: o urbanista traça a via
 * principal com a mão e quer ver **qual motor a respeita**. Aqui as glebas
 * existem, e a pergunta tem onde ser feita.
 *
 * # O que sai
 *
 * Por gleba e por motor: **quanto do traçado imposto o motor seguiu**, o que ele
 * **declarou** sobre respeitar via desenhada, e se as duas coisas batem. Mais a
 * **D69 aplicada** — as travessias desenhadas sobre APP, com a marca e o item de
 * custo — e as duas metades dela que **não são verificáveis hoje**, declaradas.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import { areaPoligono } from "@symbios/geo.ts";
import type { Terreno } from "@symbios/contrato.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { aderenciaAViaDesenhada, linhasDaEntrada, julgar } from "../src/motores/comum.ts";
import { entradaDaPorta } from "../src/porta/porta.ts";
import { motorDoGenerate, motorDoParcelamento, motorDoSymbios, separar } from "../src/porta/motores.ts";
import { comViasDesenhadas, tracadoImposto } from "../src/vias-desenhadas.ts";
import { aplicarD69 } from "../src/travessia.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-17");
const FIXTURES_ENTRADA = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const FIXTURES_SAIDA = join(RAIZ, "docs", "fixtures", "glebas-com-via-desenhada");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-20T00:00:00.000Z";
const n2 = (v: number) => Number(v.toFixed(2));
const n3 = (v: number) => Number(v.toFixed(3));

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });
mkdirSync(FIXTURES_SAIDA, { recursive: true });

/** As duas glebas de referência, montadas sobre as glebas-padrão com relevo. */
const BASES = [
  { id: "ensaio-com-via", base: "ensaio-47ha", secundarias: 3 },
  { id: "antonina-com-via", base: "geo-antonina", secundarias: 3 },
];

const motores = [
  motorDoGenerate("ortogonal"),
  motorDoGenerate("espinha"),
  motorDoParcelamento(),
  motorDoSymbios(wasm),
];

/** As vias da SAÍDA, para medir aderência. */
function viasDaSaida(saida: unknown): { pontos: { x: number; y: number }[]; largura_m: number }[] {
  const s = saida as { vias?: { eixo?: { x: number; y: number }[]; pontos?: { x: number; y: number }[]; largura_m?: number; caixa_m?: number }[] } | null;
  if (!s?.vias) return [];
  return s.vias
    .map((v) => ({ pontos: v.eixo ?? v.pontos ?? [], largura_m: v.largura_m ?? v.caixa_m ?? 10 }))
    .filter((v) => v.pontos.length >= 2);
}

const linhas: Record<string, unknown>[] = [];

for (const { id, base, secundarias } of BASES) {
  const original: EntradaMinima = JSON.parse(
    readFileSync(join(FIXTURES_ENTRADA, `${base}.entrada.json`), "utf8"),
  );

  const vias = tracadoImposto(original.gleba.anel, secundarias);
  const v1 = comViasDesenhadas({ ...original, projeto: { ...original.projeto, id } }, vias);

  // A fixture fica gravada: quem quiser refazer a medição não precisa deste
  // arquivo, só do JSON.
  writeFileSync(join(FIXTURES_SAIDA, `${id}.entrada.json`), `${JSON.stringify(v1, null, 1)}\n`, "utf8");

  const { desenhadas, testadasDeFrente } = linhasDaEntrada(v1);
  const t = glebaParaOSymbios(v1).terreno as Terreno;
  const areaGleba = areaPoligono(t.gleba);

  const comprimentoDesenhado = vias.reduce((s, v) => {
    let c = 0;
    for (let i = 1; i < v.pontos.length; i++) {
      c += Math.hypot(v.pontos[i]!.x - v.pontos[i - 1]!.x, v.pontos[i]!.y - v.pontos[i - 1]!.y);
    }
    return s + c;
  }, 0);

  console.log(`\n══════════ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha ══════════`);
  console.log(
    `  vias desenhadas ${desenhadas.length} (${vias.filter((v) => v.papel === "principal").length} principal, ` +
      `${vias.filter((v) => v.papel === "secundaria").length} secundária) · ${n2(comprimentoDesenhado)} m · ` +
      `testadas de frente ${testadasDeFrente.length} · restrições ${v1.restricoes.length}`,
  );

  // ── A D69, aplicada ao traçado desenhado ───────────────────────────────
  const largura = typeof v1.parametros.caixaPrincipal_m === "number" ? v1.parametros.caixaPrincipal_m : null;
  const d69 = aplicarD69(v1, vias.map((v) => ({ id: v.id, pontos: v.pontos })), largura);

  if (d69.travessias.length) {
    console.log(`  D69 — ${d69.travessias.length} travessia(s) desenhada(s) sobre restrição:`);
    for (const x of d69.travessias) {
      console.log(`    ${x.viaId} × ${x.restricaoNome} (${x.restricaoTipo}) · ${n2(x.comprimento_m)} m · "${x.marca}"`);
    }
    console.log(`  itens de custo para o Orçamento: ${d69.itensDeCusto.length} (obra fica null — a vazão não chega no contrato)`);
  } else {
    console.log(`  D69 — nenhuma via desenhada atravessa restrição nesta gleba`);
  }
  for (const nv of d69.naoVerificado) console.log(`  ✗ NÃO VERIFICÁVEL: ${nv.regra}\n      ${nv.porQue}`);

  // ── Os quatro motores ──────────────────────────────────────────────────
  const entrada = entradaDaPorta(v1, SEMENTE, CARIMBO, separar);
  const porMotor: Record<string, unknown> = {};

  console.log(`  ── os quatro motores contra o traçado imposto ──`);
  for (const m of motores) {
    const c = m.capacidades();
    const r = m.gerar(entrada);
    const ader = aderenciaAViaDesenhada(v1, viasDaSaida(r.saida));
    const v = r.saida ? julgar(r.saida, v1) : null;

    // A declaração bate com o medido?
    const declarou = c.respeitaViaDesenhada;
    const seguiu = (ader.fracao ?? 0) > 0.8;
    const coerente = declarou === seguiu || (!declarou && !seguiu);

    porMotor[c.id] = {
      motor: c.nome,
      declarouRespeitarViaDesenhada: declarou,
      aderenciaMedida: ader.fracao == null ? null : n3(ader.fracao),
      declaracaoBateComOMedido: coerente,
      declarouTerIgnorado: r.naoAtendido.some((x) => x.campo === "viasDesenhadas"),
      lotes: v?.lotes ?? null,
      violacoes: v?.violacoes ?? null,
      recusado: v?.recusa ?? null,
      ms: n2(r.ms),
    };

    const pct = ader.fracao == null ? "—" : `${(100 * ader.fracao).toFixed(1)} %`;
    console.log(
      `    ${c.nome.padEnd(38)} aderência ${pct.padStart(7)} · declarou seguir: ${declarou ? "sim" : "não"}` +
        ` · declarou ter ignorado: ${(porMotor[c.id] as { declarouTerIgnorado: boolean }).declarouTerIgnorado ? "sim" : "NÃO"}` +
        (v?.recusa ? " · RECUSADO" : ` · ${v?.lotes ?? "—"} lotes, ${v?.violacoes ?? "—"} violações`),
    );
  }

  linhas.push({
    prompt: "LAB-17",
    gleba: id,
    montadaSobre: base,
    semente: SEMENTE,
    contrato: "1",
    areaDaGleba_m2: n2(areaGleba),
    tracadoImposto: {
      vias: vias.length,
      principais: vias.filter((v) => v.papel === "principal").length,
      secundarias: vias.filter((v) => v.papel === "secundaria").length,
      comprimento_m: n2(comprimentoDesenhado),
    },
    d69: {
      travessias: d69.travessias.map((x) => ({ ...x, comprimento_m: n2(x.comprimento_m) })),
      itensDeCusto: d69.itensDeCusto.map((x) => ({ ...x, comprimento_m: n2(x.comprimento_m) })),
      naoVerificado: d69.naoVerificado,
    },
    motores: porMotor,
  });
}

writeFileSync(
  join(SAIDA, "medicoes.json"),
  `${JSON.stringify({ prompt: "LAB-17", geradoEm: CARIMBO, semente: SEMENTE, glebas: linhas }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-17/medicoes.json`);
console.log(`docs/fixtures/glebas-com-via-desenhada/`);
