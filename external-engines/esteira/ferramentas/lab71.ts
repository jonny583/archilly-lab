/**
 * ════════════════════════════════════════════════════════════════════════════
 *  item 004 · A CONTA DOS DISPAROS DO DESPERTADOR, e o id conferido na conta.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Grava os números crus da conta e **prova que a guarda reprova**, estragando o `ONDE_PARAMOS.md`
 * de verdade e devolvendo-o com `sha256` conferido. Uso: `bun run lab71`
 *
 * O id **não é lido daqui**: ele é lido da CONTA, por quem roda a sessão, e copiado para a seção
 * do `ONDE_PARAMOS`. Esta ferramenta confere que a seção cita **um** id — não que ele seja este
 * ou aquele, porque *identificador não se supõe*, e um literal em código seria exatamente a
 * suposição que o item 004 proíbe.
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ancorarRecado, lerRecados } from "../src/classes-de-rodada.ts";
import {
  conferirAConta,
  diasDosRecadosEmVazio,
  lerAConta,
} from "../src/disparos-do-despertador.ts";

const ESTEIRA = join(import.meta.dirname, "..");
const RAIZ = join(ESTEIRA, "..", "..");
const ONDE_PARAMOS = join(RAIZ, "docs", "ONDE_PARAMOS.md");
const RECADOS = join(RAIZ, "docs", "relatorios", "RECADOS.md");
const PROVA = join(RAIZ, "docs", "provas", "item-004");
const ABERTURA = "09/10/2026";
const A_TRAVA = "tests/disparos-em-vazio.test.ts";

const original = readFileSync(ONDE_PARAMOS, "utf8");
const hash = (t: string) => createHash("sha256").update(t).digest("hex");

const conta = lerAConta(original);
const recados = lerRecados(readFileSync(RECADOS, "utf8")).map(ancorarRecado);
const precedente = diasDosRecadosEmVazio(recados);
const problemas = conferirAConta(conta, precedente, ABERTURA);

console.log(`  disparos na conta: ${conta.linhas.length} · em vazio: ${conta.linhas.filter((l) => l.emVazio).length}`);
console.log(`  ids citados na seção: ${conta.idsCitados.join(", ") || "nenhum"}`);
console.log(`  precedente da FILA, lido do registro: ${precedente.length} (${precedente.join(", ")})`);
console.log(`  a frase do que o número decide: ${conta.temAFraseDoQueDecide ? "presente" : "AUSENTE"}`);

// ── A guarda reprova, e isso se prova estragando a conta de verdade ────────
const ESTRAGOS = [
  {
    oQue: "o total declarado deixa de bater com as linhas",
    de: "disparos observados: 4 · em vazio: 0",
    para: "disparos observados: 9 · em vazio: 0",
  },
  {
    oQue: "a frase do que o número decide sai da seção",
    de: "**Disparo em vazio não é fracasso:",
    para: "**Disparo em vazio é um disparo a menos:",
  },
  {
    oQue: "uma linha ganha origem fora do vocabulário",
    de: "| 09/10/2026 | 17:05 | observado |",
    para: "| 09/10/2026 | 17:05 | achismo |",
  },
  {
    oQue: "um disparo em vazio aparece sem recado da classe",
    de: "| 09/10/2026 | 18:06 | observado | item 004 pronto",
    para: "| 09/10/2026 | 18:06 | observado | nada na caixa",
  },
];

const daGuarda: { oQue: string; exit: number; reprovou: boolean; quais: string[] }[] = [];
const ESCAPE = String.fromCharCode(27);
const RE_COR = new RegExp(`${ESCAPE}\\[[0-9;]*m`, "g");

try {
  const limpo = spawnSync("bun", ["test", A_TRAVA], { cwd: ESTEIRA, encoding: "utf8" });
  if ((limpo.status ?? 1) !== 0) problemas.push({ tipo: "secao-nao-encontrada", oQue: "a guarda já reprova o caso BOM — nada abaixo vale" });
  for (const e of ESTRAGOS) {
    if (!original.includes(e.de)) throw new Error(`a sabotagem não achou no ONDE_PARAMOS: ${e.de}`);
    writeFileSync(ONDE_PARAMOS, original.replace(e.de, e.para));
    const r = spawnSync("bun", ["test", A_TRAVA], { cwd: ESTEIRA, encoding: "utf8" });
    const saida = `${r.stdout ?? ""}${r.stderr ?? ""}`.replace(RE_COR, "");
    const quais = [...saida.matchAll(/^\(fail\)\s+(.+?)(?:\s+\[[\d.]+ms\])?$/gm)].map((m) => m[1]!.trim());
    const exit = r.status ?? 1;
    daGuarda.push({ oQue: e.oQue, exit, reprovou: exit !== 0, quais });
    console.log(`  guarda · ${e.oQue}: exit ${exit}`);
    if (exit === 0) problemas.push({ tipo: "secao-nao-encontrada", oQue: `a guarda NÃO reprovou: ${e.oQue}` });
    writeFileSync(ONDE_PARAMOS, original);
  }
} finally {
  writeFileSync(ONDE_PARAMOS, original);
}

if (hash(readFileSync(ONDE_PARAMOS, "utf8")) !== hash(original)) {
  console.error("\n  o ONDE_PARAMOS NÃO voltou ao que era — conserte à mão antes de qualquer commit");
  process.exit(1);
}

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "conta-dos-disparos.json"),
  `${JSON.stringify(
    {
      prompt: "item 004 da caixa de entrada",
      oQueIstoMede:
        "a conta dos disparos do despertador: um por linha, com a origem de cada hora, o " +
        "precedente lido do registro e os dois sentidos do cruzamento com o RECADOS.md",
      aPergunta:
        "da família: apagar despertador perde o id E O HISTÓRICO DE DISPARO. A conta é a parte " +
        "que faltava, e disparo em vazio é medição, não fracasso",
      quando: new Date().toISOString(),
      oIdNaoSeSupoe: {
        oQue: "o id NÃO é literal nesta ferramenta: ele vem da CONTA e é copiado para a seção",
        quantosIdsNaSecao: conta.idsCitados.length,
        oGravadoEstavaCerto: true,
        comoConferi: "mcp get_trigger em 09/10/2026 18:06Z — existe, é desta sessão, enabled: true, cron 5 * * * *",
      },
      aConta: {
        aberta: ABERTURA,
        disparos: conta.linhas,
        declarados: conta.declarados,
        emVazio: conta.linhas.filter((l) => l.emVazio).length,
        temAFraseDoQueDecide: conta.temAFraseDoQueDecide,
      },
      oQueOPrimeiroDiaJaMOSTROU:
        "ZERO em vazio, e DOIS disparos acumulados — a caixa não ficou sem abastecimento; a " +
        "RODADA é mais longa que o intervalo. A conta não nasceu para confirmar a suspeita",
      oPrecedenteDaFILA: {
        oQue: "recados da classe `despertador-sem-item`, lidos do registro pela régua do item 002",
        quantos: precedente.length,
        dias: precedente,
        porQueNaoSoma:
          "é outro regime — a FILA, não a caixa. Somar duas séries diferentes é o erro da §6",
      },
      oQuartoNumeroQueFicaDEFORA: {
        oQue: "a CLAUDE.md §1-A diz `dos 7 disparos do despertador de 15/09, 4 não tiveram o que fazer`",
        porQueFicaFora:
          "era OUTRO despertador e outro regime, e aqueles 4 nunca tiveram recado um por um: " +
          "existe a contagem, não a série. Número que não se refaz do registro fica nomeado e fora da soma",
      },
      aGuardaREPROVA: {
        osCasosRuins: daGuarda,
        oOndeParamosVoltou: true,
      },
      problemas,
    },
    null,
    2,
  )}\n`,
);

console.log(`\n  docs/provas/item-004/conta-dos-disparos.json`);
if (problemas.length > 0) {
  console.error(`\n  ${problemas.length} PROBLEMA(S):`);
  for (const p of problemas) console.error(`   · ${p.tipo}: ${p.oQue}`);
  process.exit(1);
}
console.log("  o ONDE_PARAMOS voltou ao que era (sha256 conferido) · zero problemas");
