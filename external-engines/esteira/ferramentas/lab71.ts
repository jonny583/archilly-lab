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
  diaDe,
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
/**
 * **O precedente é o que está ANTES da abertura.** Os recados da mesma classe de hoje em diante
 * não são precedente nenhum: são o parceiro do cruzamento da conta. *Esta linha dizia
 * "precedente da FILA: 4" no primeiro disparo em vazio, e um dos quatro era de hoje.*
 */
const antesDaAbertura = precedente.filter((d) => diaDe(d) < diaDe(ABERTURA));
const naCaixa = precedente.filter((d) => diaDe(d) >= diaDe(ABERTURA));
console.log(`  precedente da FILA (antes da abertura): ${antesDaAbertura.length} (${antesDaAbertura.join(", ")})`);
console.log(`  recados da classe no regime da caixa: ${naCaixa.length} (${naCaixa.join(", ") || "nenhum"})`);
console.log(`  a frase do que o número decide: ${conta.temAFraseDoQueDecide ? "presente" : "AUSENTE"}`);

// ── A guarda reprova, e isso se prova estragando a conta de verdade ────────
/**
 * **As sabotagens são DERIVADAS do arquivo, não literais.**
 *
 * A primeira versão trazia `"disparos observados: 4 · em vazio: 0"` escrito à mão, e **quebrou no
 * primeiro disparo em vazio** — o quinto, no mesmo dia. *Literal de ferramenta envelhece igual a
 * comentário* (D104), e esta ferramenta mede uma conta que cresce de hora em hora.
 */
const linhaDoTotal = /disparos no registro: \d+(?: · [a-z ]+: \d+)+/.exec(original)?.[0];
if (linhaDoTotal === undefined) throw new Error("não achei a linha dos totais no ONDE_PARAMOS");

/** A linha da tabela de um disparo, como está no documento. */
function linhaDaTabela(d: { data: string; hora: string }): string {
  const re = new RegExp(`^\\|\\s*${d.data}\\s*\\|\\s*${d.hora}\\s*\\|[^\n]*$`, "m");
  const l = re.exec(original)?.[0];
  if (l === undefined) throw new Error(`não achei a linha de ${d.data} ${d.hora}`);
  return l;
}

const umObservado = conta.linhas.find((l) => l.origem === "observado" && !l.emVazio);
const umEmVazio = conta.linhas.find((l) => l.emVazio);
if (umObservado === undefined) throw new Error("a conta não tem disparo `observado` com item");

const ESTRAGOS = [
  {
    oQue: "o total declarado deixa de bater com as linhas",
    de: linhaDoTotal,
    para: linhaDoTotal.replace(/no registro: \d+/, `no registro: ${conta.linhas.length + 5}`),
  },
  {
    oQue: "a frase do que o número decide sai da seção",
    de: "**Disparo em vazio não é fracasso:",
    para: "**Disparo em vazio é um disparo a menos:",
  },
  {
    oQue: "uma linha ganha origem fora do vocabulário",
    de: linhaDaTabela(umObservado),
    para: linhaDaTabela(umObservado).replace("| observado |", "| achismo |"),
  },
  // Os dois sentidos do cruzamento, no arquivo de verdade: com disparo em vazio na conta, o
  // estrago é APAGÁ-LO (sobra o recado da classe sem linha); sem nenhum, é INVENTAR um num dia
  // que não tem recado da classe.
  umEmVazio === undefined
    ? {
        oQue: "um disparo em vazio aparece sem recado da classe",
        de: linhaDaTabela(umObservado),
        para: linhaDaTabela(umObservado).replace(umObservado.achou, "nada na caixa"),
      }
    : {
        oQue: "o disparo em vazio deixa de ser em vazio, e sobra o recado da classe sem linha",
        de: linhaDaTabela(umEmVazio),
        para: linhaDaTabela(umEmVazio).replace(umEmVazio.achou, "item pronto"),
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
        oQue: "recados da classe `despertador-sem-item` ANTES da abertura, lidos do registro pela régua do item 002",
        quantos: antesDaAbertura.length,
        dias: antesDaAbertura,
        porQueNaoSoma:
          "é outro regime — a FILA, não a caixa. Somar duas séries diferentes é o erro da §6",
      },
      osDaCAIXA: {
        oQue:
          "recados da mesma classe da abertura em diante. NÃO são precedente: são o parceiro " +
          "do cruzamento, e cada um tem de ter a sua linha em vazio na conta",
        quantos: naCaixa.length,
        dias: naCaixa,
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
