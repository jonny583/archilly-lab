#!/usr/bin/env node
/**
 * CLI: grava os quatro terrenos de prova do LAB-01 em `docs/terrenos/`.
 *
 * ```shell
 * node --experimental-strip-types ferramentas/gerar-terrenos.ts
 * ```
 *
 * A procedência de cada terreno vai dentro do próprio arquivo, no bloco
 * `archilly.procedencia` — inclusive a parte desconfortável: os estudos de prova
 * do Geo não têm geometria, e o que veio deles foram os números.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { gerar, RECEITAS } from "./terrenos.ts";
// ------------------------------------------------------------------ execução

const destino = join(import.meta.dirname, "..", "..", "..", "..", "docs", "terrenos");
mkdirSync(destino, { recursive: true });

const indice: Record<string, unknown>[] = [];
for (const r of RECEITAS) {
  const arq = gerar(r);
  const caminho = join(destino, `${r.id}.geojson`);
  writeFileSync(caminho, `${JSON.stringify(arq, null, 1)}\n`, "utf8");

  const curvas = arq.features.filter(
    (f) => (f as { properties: { tipo: string } }).properties.tipo === "curva_nivel",
  ).length;
  const terreno = arq.features[0] as { properties: Record<string, number> };
  const linha = {
    id: r.id,
    arquivo: `docs/terrenos/${r.id}.geojson`,
    area_ha: Number((terreno.properties["areaCalculada_m2"]! / 10_000).toFixed(3)),
    vertices: terreno.properties["vertices"],
    perimetro_m: terreno.properties["perimetro_m"],
    curvas,
    equidistancia_m: r.equidistancia_m,
    desnivel_m: arq.archilly.sintese.relevo.desnivel,
    restricoes: (r.restricoes ?? []).length,
    sintetico: r.id.startsWith("sintetico"),
  };
  indice.push(linha);
  console.log(
    `${r.id.padEnd(26)} ${String(linha.area_ha).padStart(9)} ha  ` +
      `${String(linha.vertices).padStart(3)} vért  ` +
      `${String(curvas).padStart(4)} curvas  desnível ${String(linha.desnivel_m).padStart(7)} m  ` +
      `${linha.restricoes} restrições`,
  );
}

writeFileSync(
  join(destino, "indice.json"),
  `${JSON.stringify({ gerado: "LAB-01", terrenos: indice }, null, 2)}\n`,
  "utf8",
);
console.log(`\n${RECEITAS.length} terrenos em ${destino}`);
