/**
 * LAB-49 · O detector de prova velha para o LAB-25 e o LAB-30 — e o escopo dele.
 *
 * O LAB-33 criou o detector de prova velha (D131) e o deu a **duas** provas. As outras
 * ficaram sem, e duas apodreceram caladas até o LAB-43 as regerar (D156). Este prompt
 * paga essa dívida, e esta ferramenta **publica o escopo do detector como NÚMERO** — a
 * lição do D164, porque *"mede as duas provas"* é afirmação e `9 de 19` é um número de
 * que se pode desconfiar.
 *
 * A trava mora em `tests/prova-velha.test.ts`; aqui só se publica o que ela alcança e o
 * registro da sabotagem que prova que ela reprova (D126).
 *
 * Uso: `bun run lab49`
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ESCOPO_DO_DETECTOR } from "../src/escopo-do-detector.ts";
import { REGRAS_DA_IDA } from "../src/guarda-da-ida.ts";
import { REGRAS_DA_PONTE } from "../src/guarda-da-ponte.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-49");

type Contagem = { medida: number; medidaEmParte: number; declarada: number; naoMedida: number };

const classe = (v: string): keyof Contagem =>
  v === "medida" ? "medida" : v === "declarada" ? "declarada" : v.startsWith("medidaEmParte:") ? "medidaEmParte" : "naoMedida";

const porProva = Object.entries(ESCOPO_DO_DETECTOR).map(([arquivo, chaves]) => {
  const c: Contagem = { medida: 0, medidaEmParte: 0, declarada: 0, naoMedida: 0 };
  for (const v of Object.values(chaves)) c[classe(v)] += 1;
  return {
    arquivo,
    chaves: Object.keys(chaves).length,
    ...c,
    alcancadas: c.medida + c.medidaEmParte,
    oQueNaoEAlcancado: Object.entries(chaves)
      .filter(([, v]) => classe(v) === "naoMedida")
      .map(([k, v]) => ({ chave: k, porque: v.replace(/^naoMedida:\s*/, "") })),
  };
});

/**
 * A SABOTAGEM, transcrita de execuções reais (D126).
 *
 * Duas das quatro são **as mentiras históricas**, não invenções: os 74 campos virando
 * 72 é a forma exata do que a prova do LAB-30 dizia desde o LAB-40, e o 33 virando
 * 1 228 é a variante que a prova do LAB-25 publicava desde o LAB-37.
 */
const SABOTAGEM = {
  base: { pass: 15, fail: 0, exit: 0 },
  casos: [
    { sabotagem: "inventário da ida: 74 campos viram 72 — a mentira exata do D156", pass: 14, fail: 1, exit: 1, ehHistorica: true },
    { sabotagem: "porRegra da ida perde a regra `divida-do-lab`", pass: 14, fail: 1, exit: 1, ehHistorica: false },
    { sabotagem: "faceDeRua de geo-antonina: 33 lotes viram 1228 — a mentira do LAB-37", pass: 14, fail: 1, exit: 1, ehHistorica: true },
    { sabotagem: "campo novo na prova, fora do ESCOPO do detector", pass: 14, fail: 1, exit: 1, ehHistorica: false },
  ],
  depoisDeRestaurar: { pass: 15, fail: 0, exit: 0 },
};

const totalChaves = porProva.reduce((s, p) => s + p.chaves, 0);
const totalAlcancadas = porProva.reduce((s, p) => s + p.alcancadas, 0);

console.log("══════════ LAB-49 · o escopo do detector de prova velha ══════════");
for (const p of porProva) {
  console.log(`  ${p.arquivo.padEnd(32)} ${p.alcancadas}/${p.chaves} alcançadas · medida ${p.medida} · em parte ${p.medidaEmParte} · declarada ${p.declarada} · não medida ${p.naoMedida}`);
}
console.log(`\n  TOTAL: ${totalAlcancadas} de ${totalChaves} chaves das duas provas`);
console.log(`  regras conferidas como DADO: ida ${REGRAS_DA_IDA.length}, ponte ${REGRAS_DA_PONTE.length}`);
console.log(`  sabotagem: ${SABOTAGEM.casos.length} de ${SABOTAGEM.casos.length} reprovaram (${SABOTAGEM.casos.filter((c) => c.ehHistorica).length} são mentiras históricas)`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "detector-de-prova-velha.json"),
  JSON.stringify(
    {
      prompt: "LAB-49",
      oQueIstoMede: "o ESCOPO do detector de prova velha e a sabotagem que prova que ele reprova — mede duas provas e uma trava, não terreno",
      quando: new Date().toISOString(),
      aDividaQuePaga: "o LAB-33 deu detector a 2 provas (LAB-23 e LAB-28); as do LAB-25 e do LAB-30 ficaram sem e apodreceram caladas até o LAB-43 (D156)",
      escopo: { chaves: totalChaves, alcancadas: totalAlcancadas, porProva },
      regrasComoDado: {
        porque: "tipo não existe em tempo de execução (D157) — sem a lista, o `porRegra` de uma prova não tinha contra o que ser conferido",
        ida: [...REGRAS_DA_IDA],
        ponte: [...REGRAS_DA_PONTE],
      },
      sabotagem: SABOTAGEM,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-49/detector-de-prova-velha.json`);
