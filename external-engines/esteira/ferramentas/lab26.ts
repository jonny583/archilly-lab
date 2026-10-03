#!/usr/bin/env bun
/**
 * LAB-26 — a varredura das capacidades declaradas. (03/10/2026)
 *
 * ```sh
 * bun run lab26
 * ```
 *
 * # A pergunta
 *
 * O LAB-22 partiu `leRelevo` em duas porque a capacidade **envelheceu sozinha** e
 * o teste de falsificação a pegou. O prompt do LAB-26 pede o resto: **quais
 * capacidades declaradas o mesmo teste ainda não cobre?**
 *
 * Ela não se responde lendo o arquivo de teste — ler é o que cria a lista que
 * envelhece. Aqui a resposta sai de `src/porta/experimentos.ts`, que é conferido
 * por dois testes: um exige cobertura para todo campo de um `Capacidades` de
 * verdade, outro exige que todo teste citado exista no arquivo.
 *
 * # E a medição que a varredura pediu
 *
 * Três campos não tinham experimento, e um deles guardava uma declaração falsa.
 * Esta ferramenta mede o campo descoberto — **`respeitaAcesso`** — nos quatro
 * motores e nas glebas que declaram acesso, movendo o acesso entre os dois
 * vértices mais distantes do anel. Mover pouco não distingue *"não lê"* de *"lê e
 * mudou pouco"*.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import type { P } from "../src/motores/comum.ts";
import { contagem, EXPERIMENTOS } from "../src/porta/experimentos.ts";
import { entradaDaPorta, type Capacidades, type MotorNaPorta } from "../src/porta/porta.ts";
import {
  motorDoGenerate,
  motorDoParcelamento,
  motorDoSymbios,
  separar,
} from "../src/porta/motores.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-26");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";
const CONTRATO = "2";

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

const motores: MotorNaPorta[] = [
  motorDoGenerate("ortogonal"),
  motorDoGenerate("espinha"),
  motorDoParcelamento(),
  motorDoSymbios(wasm),
];

/** A geometria sem os campos de rampa — a mesma régua do `porta.test.ts`. */
const soGeometria = (saida: unknown): string =>
  JSON.stringify(saida, (chave, valor) =>
    chave === "rampaMedia_pct" || chave === "rampaMaxima_pct" ? undefined : valor,
  );

/** Os dois vértices mais distantes do anel — o par que move o acesso mais longe. */
function parMaisDistante(anel: P[]): { a: P; b: P; d: number } {
  let a = anel[0]!;
  let b = anel[0]!;
  let d = -1;
  for (let i = 0; i < anel.length; i++) {
    for (let j = i + 1; j < anel.length; j++) {
      const dd = Math.hypot(anel[j]!.x - anel[i]!.x, anel[j]!.y - anel[i]!.y);
      if (dd > d) {
        d = dd;
        a = anel[i]!;
        b = anel[j]!;
      }
    }
  }
  return { a, b, d };
}

// ───────────────────────────────────── 1 · a varredura

console.log("══════════ a varredura das capacidades ══════════");
const campos = Object.keys(motores[0]!.capacidades()) as (keyof Capacidades)[];
const varredura = campos.map((campo) => {
  const c = EXPERIMENTOS[campo];
  return {
    campo,
    cobertura: c.tipo,
    teste: "teste" in c ? c.teste : null,
    porque: "porque" in c ? c.porque : null,
  };
});
for (const v of varredura) {
  console.log(`  ${String(v.campo).padEnd(24)} ${v.cobertura.padEnd(14)} ${v.teste ?? v.porque}`);
}
console.log(`  → ${JSON.stringify(contagem())}`);

// ───────────────────────────────────── 2 · o campo descoberto, medido

const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
];

const porGleba: Record<string, unknown> = {};

for (const { id, entrada } of GLEBAS) {
  const { a, b, d } = parMaisDistante(entrada.gleba.anel as P[]);
  console.log(`\n══════════ ${id} · acesso movido ${d.toFixed(1)} m ══════════`);
  const comAcessoEm = (p: P): EntradaMinima => ({
    ...entrada,
    acessos: [
      { id: "A1", nome: "Acesso principal", papel: "principal", ponto: p, segmento: null, sugerido: false },
    ],
  });
  const linhas: unknown[] = [];
  for (const m of motores) {
    const c = m.capacidades();
    const rA = m.gerar(entradaDaPorta(comAcessoEm(a), SEMENTE, CARIMBO, separar));
    const rB = m.gerar(entradaDaPorta(comAcessoEm(b), SEMENTE, CARIMBO, separar));
    const mudou = soGeometria(rA.saida) !== soGeometria(rB.saida);
    const bate = mudou === c.respeitaAcesso;
    console.log(
      `  ${c.id.padEnd(20)} declara ${String(c.respeitaAcesso).padEnd(5)} · mudou ${String(mudou).padEnd(5)} · ` +
        `lotes ${rA.indicadores.lotes} → ${rB.indicadores.lotes} · ${bate ? "bate" : "NÃO BATE"}`,
    );
    linhas.push({
      motor: c.id,
      declara_respeitaAcesso: c.respeitaAcesso,
      aGeometriaMudou: mudou,
      declaracaoBateComOMedido: bate,
      lotesComAcessoEmA: rA.indicadores.lotes,
      lotesComAcessoEmB: rB.indicadores.lotes,
      versaoDeclarada: c.versao,
      versaoNaSaida: (rA.saida as { motor?: { versao?: string } } | null)?.motor?.versao ?? null,
      geometriaEntregue: rA.geometria,
      geometriasDeclaradas: c.geometrias,
    });
  }
  porGleba[id] = { acessoMovido_m: Number(d.toFixed(1)), de: a, para: b, motores: linhas };
}

writeFileSync(
  join(SAIDA, "varredura.json"),
  JSON.stringify(
    {
      prompt: "LAB-26",
      geradoEm: "2026-10-03",
      semente: SEMENTE,
      contrato: CONTRATO,
      varredura,
      contagem: contagem(),
      respeitaAcesso: porGleba,
    },
    null,
    2,
  ) + "\n",
);

console.log("\ndocs/provas/LAB-26/varredura.json");
