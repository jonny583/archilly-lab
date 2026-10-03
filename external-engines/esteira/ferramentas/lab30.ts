#!/usr/bin/env bun
/**
 * LAB-30 — a guarda da IDA. (03/10/2026)
 *
 * ```sh
 * bun run lab30
 * ```
 *
 * O LAB-25 fechou **motor → SAÍDA**. Esta fecha o sentido contrário: nenhum campo
 * que o contrato traz pode deixar de chegar ao motor em silêncio.
 *
 * **Ela achou, no levantamento, a quinta vez do ponto cego da §6 — e a primeira que
 * já tinha saído para o chat:** o motor do Laboratório de Parcelamento tem
 * `viaManual` (*"coluna vertebral desenhada à mão"*), a ida do Lab nunca o
 * preencheu, e o Lab publicou duas vezes que **o motor** ignorava via desenhada.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import {
  dividasDoLab,
  emLinhasDaIda,
  reprovamNaIda,
  type AchadoDaIda,
} from "../src/guarda-da-ida.ts";
import { auditarAsIdas } from "../src/guarda-em-acao.ts";
import { IDA_DO_PARCELAMENTO, IDA_DO_SYMBIOS } from "../src/inventario-das-idas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-30");
const PADRAO = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const COM_VIA = join(RAIZ, "docs", "fixtures", "glebas-com-via-desenhada");

mkdirSync(SAIDA, { recursive: true });
const ler = (d: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(d, `${id}.entrada.json`), "utf8"));

/** As sete glebas: as cinco da tabela e as duas com via desenhada. */
const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: ler(PADRAO, "ensaio-47ha") },
  { id: "geo-antonina", entrada: ler(PADRAO, "geo-antonina") },
  { id: "ensaio-com-via", entrada: ler(COM_VIA, "ensaio-com-via") },
  { id: "antonina-com-via", entrada: ler(COM_VIA, "antonina-com-via") },
];

const porGleba: Record<string, unknown> = {};
const todos: AchadoDaIda[] = [];

console.log("══════════ a guarda da IDA — contrato → motor ══════════");
for (const { id, entrada } of GLEBAS) {
  const idas = auditarAsIdas(entrada);
  const linhas: unknown[] = [];
  for (const r of idas) {
    todos.push(...r.achados);
    const rep = reprovamNaIda(r.achados);
    const avisos = r.achados.length - rep.length;
    console.log(
      `  ${id.padEnd(24)} ${r.ida.padEnd(14)} ` +
        `${rep.length === 0 ? "nada deixou de chegar" : `${rep.length} ACHADO(S) QUE REPROVAM`} · ${avisos} aviso(s)`,
    );
    for (const l of emLinhasDaIda(rep)) console.log(`     ${l}`);
    linhas.push({ ida: r.ida, achados: r.achados, reprovam: rep.length, avisos });
  }
  porGleba[id] = linhas;
}

const porRegra = {
  "campo-nao-entregue": todos.filter((a) => a.regra === "campo-nao-entregue").length,
  "campo-novo-no-contrato": todos.filter((a) => a.regra === "campo-novo-no-contrato").length,
  "mapa-velho": todos.filter((a) => a.regra === "mapa-velho").length,
  "divida-do-lab": dividasDoLab(todos).length,
};
const contar = (inv: Record<string, { tipo: string }>) => {
  const c: Record<string, number> = { entregue: 0, traduzido: 0, perda: 0, interno: 0 };
  for (const d of Object.values(inv)) c[d.tipo] = (c[d.tipo] ?? 0) + 1;
  return c;
};

writeFileSync(
  join(SAIDA, "guarda-da-ida.json"),
  JSON.stringify(
    {
      prompt: "LAB-30",
      geradoEm: "2026-10-03",
      contrato: "2",
      idasAuditadas: ["parcelamento", "symbios"],
      inventario: {
        parcelamento: { campos: Object.keys(IDA_DO_PARCELAMENTO).length, ...contar(IDA_DO_PARCELAMENTO) },
        symbios: { campos: Object.keys(IDA_DO_SYMBIOS).length, ...contar(IDA_DO_SYMBIOS) },
      },
      porRegra,
      reprovamNoTotal: reprovamNaIda(todos).length,
      // A dívida é publicada, não escondida: o motor tem onde receber e a ida ainda
      // não entrega. Uma só hoje, e ela é a testada de frente → `facesLoteamento`.
      dividasDoLab: [...new Set(dividasDoLab(todos).map((d) => `${d.ida} · ${d.campo} → ${d.destino}`))],
      glebas: porGleba,
    },
    null,
    2,
  ) + "\n",
);

const dividas = [...new Set(dividasDoLab(todos).map((d) => `${d.ida} · ${d.campo} → ${d.destino}`))];
if (dividas.length) {
  console.log("\n══════════ dívidas declaradas — o motor espera, a ida não entrega ══════════");
  for (const d of dividas) console.log(`  ${d}`);
}
console.log(
  `\n${JSON.stringify(porRegra)} · reprovam: ${reprovamNaIda(todos).length}\n` +
    "docs/provas/LAB-30/guarda-da-ida.json",
);
