/**
 * LAB-92 · A esteira compara motores sob premissas idênticas? — a medição.
 *
 * Uso: `bun run lab92`
 *
 * **Não constrói nada e não conserta nada**: enumera por LUGAR, conta, e nomeia o que não dá para
 * igualar. **Esta prova não mede gleba nenhuma** — mede a PASSAGEM de premissas —, e por isso está
 * na lista declarada de exceções do §7 (LAB-36).
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_DUAS_FORMAS,
  AS_QUE_VAO_NULAS,
  MOTOR_COMPOSTO,
  O_K,
  O_QUE_A_ESTEIRA_PASSA,
  O_QUE_EU_NAO_CONSIGO_IGUALAR,
  O_QUE_O_MOTOR_NAO_RECEBE,
  aConta,
} from "../src/premissas-identicas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-92");

/** As glebas-padrão, e qual delas traz área declarada como POLÍGONO. */
const glebas = execFileSync("git", ["-C", RAIZ, "ls-files", "docs/terrenos"], { encoding: "utf8" })
  .split("\n")
  .filter((f) => f.endsWith(".geojson"))
  .map((f) => {
    const arq = JSON.parse(readFileSync(join(RAIZ, f), "utf8")) as {
      features?: { properties?: { tipo?: string } }[];
    };
    const tipos = (arq.features ?? []).map((x) => x.properties?.tipo).filter((t): t is string => !!t);
    const declaradas = [...new Set(tipos.filter((t) => ["app", "reserva_legal", "lazer", "area_verde", "doacao"].includes(t)))].sort();
    return { gleba: f.replace(/^docs\/terrenos\//, "").replace(/\.geojson$/, ""), feicoes: (arq.features ?? []).length, areaDeclaradaComoPoligono: declaradas };
  });

const conta = aConta();

console.log("══════════ LAB-92 · premissas idênticas? ══════════");
console.log(`  N = ${conta.N} premissas que a esteira passa · M = ${conta.M} com valor · ${conta.nulas} vão NULAS`);
console.log(`  K = ${conta.K} caem no PADRÃO DE FÁBRICA de quem recebe:`);
for (const [motor, n] of Object.entries(conta.porMotor)) console.log(`      ${String(n).padStart(2)} · ${motor}`);
console.log(`  e o SYMBIOS não recebe premissa nenhuma (perda em bloco na ida)`);
console.log("");
console.log("  O K, um a um (default de MOTOR — o invisível):");
for (const k of O_K) console.log(`      ${k.motor.padEnd(38)} ${k.premissa}${k.oDefault === undefined ? "" : ` = ${k.oDefault}`}`);
console.log("");
console.log("  O que o motor NÃO TEM COMO receber (pedido ao dono do contrato, não achado):");
for (const p of O_QUE_O_MOTOR_NAO_RECEBE) console.log(`      ${p.motor.padEnd(38)} ${p.premissa}`);
console.log("");
console.log("  As glebas-padrão e a forma da área declarada:");
for (const g of glebas) console.log(`      ${g.gleba.padEnd(26)} ${String(g.feicoes).padStart(4)} feições · polígono: ${g.areaDeclaradaComoPoligono.join(", ") || "nenhum"}`);
console.log("");
console.log("  O QUE EU NÃO CONSIGO IGUALAR:");
for (const l of O_QUE_EU_NAO_CONSIGO_IGUALAR) console.log(`      · ${l}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "premissas-identicas.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-92",
      oQue: "a medição do item 025: a esteira compara motores sob premissas idênticas?",
      aResposta: "NÃO — K = 17 premissas caem no padrão de fábrica de quem recebe, e o Symbios não recebe premissa nenhuma",
      oQueIstoNaoMede:
        "não mede gleba, motor nem semente: mede a PASSAGEM de premissas da esteira para cada motor, por lugar. Está na lista de exceções do §7",
      quando: new Date().toISOString(),
      aConta: conta,
      oQueAEsteiraPassa: O_QUE_A_ESTEIRA_PASSA,
      asQueVaoNulas: AS_QUE_VAO_NULAS,
      oK: O_K,
      oQueOMotorNaoRecebe: O_QUE_O_MOTOR_NAO_RECEBE,
      oQueEuNaoConsigoIgualar: O_QUE_EU_NAO_CONSIGO_IGUALAR,
      asDuasFormas: AS_DUAS_FORMAS,
      asGlebasPadrao: glebas,
      motorComposto: MOTOR_COMPOSTO,
      ondeFoiMedido: {
        "o que a esteira passa": "external-engines/esteira/src/gleba-do-lab.ts · bloco PARAMETROS",
        "o K do Generate": "external-engines/esteira/src/motores/generate.ts (`...PARAMS_PADRAO_V1` + 8 campos) contra urban-create-hub-41d93a4d origin/main:src/lib/engine/gerar-v1.ts:456 (12 campos)",
        "o K do Parcelamento": "external-engines/testfit/adapter/src/ida.ts (9 chaves preenchidas) contra motor-testfit origin/main:src/lib/lab/tipos.ts:124 (22 ChaveFaixa)",
        "o Symbios": "external-engines/esteira/src/inventario-das-idas.ts · `parametros: perdaEmBloco`",
        "o motor composto": "external-engines/esteira/src/porta/motores.ts · três implementações, uma por rodada, tudo indexado por `id`",
      },
      naoConsertaNada: "o conserto é do chassi e dos donos dos motores; esta casa mede e pede, e o pedido vai em lista no relatório (§4)",
      conferidoAqui: "verde na mão, não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-92/premissas-identicas.json`);
