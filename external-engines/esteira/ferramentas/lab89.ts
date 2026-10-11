/**
 * LAB-89 · A prova de sentido invertido do clone raso — montada, não afirmada.
 *
 * Uso: `bun run lab89`
 *
 * Ela **monta um clone raso de verdade** deste repositório, por `file://` (sem rede), e roda a
 * MESMA régua nos dois: no raso ela tem de **RECUSAR**, no completo tem de **MEDIR**. O clone
 * temporário é apagado no fim, e nada fora de `docs/provas/LAB-89/` é escrito.
 *
 * **Esta prova não mede gleba nenhuma** — mede um instrumento —, e por isso está na lista
 * declarada de exceções do §7 (LAB-36).
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  A_PERGUNTA,
  O_QUE_IDENTIFICA_O_QUE,
  O_QUE_O_CORTE_RESPONDEU,
  lerPelaHistoria,
} from "../src/profundidade-da-historia.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-89");
/** O caminho medido: um arquivo com história longa nesta casa. */
const CAMINHO = "CLAUDE.md";

const git = (dir: string, ...args: string[]): string | null => {
  try {
    return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
};
const ehRaso = (dir: string): boolean | null => {
  const r = git(dir, "rev-parse", "--is-shallow-repository");
  return r === null ? null : r === "true";
};
const commitDoCaminho = (dir: string): string | null => git(dir, "log", "-1", "--format=%h", "--", CAMINHO);
const quantosCommitsDoCaminho = (dir: string): number | null => {
  const r = git(dir, "log", "--format=%h", "--", CAMINHO);
  return r === null ? null : r.split("\n").filter(Boolean).length;
};

console.log("══════════ LAB-89 · a prova de sentido invertido do clone raso ══════════");
console.log(`  a pergunta: ${A_PERGUNTA}`);

// ── O lado BOM: este repositório, como ele está ──────────────────────────────
const rasoAqui = ehRaso(RAIZ);
const aqui = lerPelaHistoria(rasoAqui, () => commitDoCaminho(RAIZ));
console.log(`\n  AQUI  · is-shallow=${String(rasoAqui)} · ${aqui.podeAfirmar ? "MEDIU" : "RECUSOU"} · valor=${aqui.valor ?? "null"} · ${aqui.motivo}`);

// ── O lado RUIM: um clone raso montado de propósito, por `file://`, sem rede ──
//
// Tudo o que o lado ruim mede sai de UMA função, que devolve o objeto inteiro: com `let`
// reatribuído dentro do `try`, o próprio `eslint` desta casa acusa `no-useless-assignment` —
// e régua da casa acusando o meu rascunho é a régua funcionando.
const medirNoRaso = (): {
  leitura: ReturnType<typeof lerPelaHistoria> | null;
  oQueOCorteTeriaRespondido: string | null;
  commitsDoCaminho: number | null;
} => {
  const berco = mkdtempSync(join(tmpdir(), "lab89-"));
  const clone = join(berco, "raso");
  try {
    execFileSync("git", ["clone", "--depth", "1", "--quiet", `file://${RAIZ}`, clone], {
      encoding: "utf8",
      stdio: ["ignore", "ignore", "ignore"],
    });
    return {
      leitura: lerPelaHistoria(ehRaso(clone), () => commitDoCaminho(clone)),
      // O que o CORTE responderia se ninguém perguntasse a profundidade:
      oQueOCorteTeriaRespondido: commitDoCaminho(clone),
      commitsDoCaminho: quantosCommitsDoCaminho(clone),
    };
  } catch {
    return { leitura: null, oQueOCorteTeriaRespondido: null, commitsDoCaminho: null };
  } finally {
    rmSync(berco, { recursive: true, force: true });
  }
};

const raso = medirNoRaso();
const commitsAqui = quantosCommitsDoCaminho(RAIZ);
console.log(
  `  RASO  · ${raso.leitura === null ? "NÃO DEU PARA MONTAR O CLONE" : `${raso.leitura.podeAfirmar ? "MEDIU" : "RECUSOU"} · valor=${raso.leitura.valor ?? "null"} · ${raso.leitura.motivo}`}`,
);
console.log(`\n  o que o CORTE teria respondido sem a pergunta: ${raso.oQueOCorteTeriaRespondido ?? "null"}`);
console.log(`  commits de ${CAMINHO}: ${raso.commitsDoCaminho ?? "?"} no raso · ${commitsAqui ?? "?"} aqui`);

const osDoisSentidos = {
  oLadoRuim: {
    oQue: "clone raso montado de propósito, por `file://` e sem rede",
    recusou: raso.leitura?.podeAfirmar === false,
    valor: raso.leitura?.valor ?? null,
    motivo: raso.leitura?.motivo ?? null,
    oQueOCorteTeriaRespondido: raso.oQueOCorteTeriaRespondido,
    commitsDoCaminhoNoRaso: raso.commitsDoCaminho,
  },
  oLadoBom: {
    oQue: "este repositório, como ele está",
    isShallow: rasoAqui,
    mediu: aqui.podeAfirmar,
    valor: aqui.valor,
    motivo: aqui.motivo,
    commitsDoCaminho: commitsAqui,
  },
};

/** O lado ruim só conta como demonstrado se a régua RECUSOU **e** não devolveu valor. */
const recusaOk = (): boolean =>
  raso.leitura !== null && raso.leitura.podeAfirmar === false && raso.leitura.valor === null;

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "a-pergunta-virou-guarda.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-89",
      oQue: "a pergunta do clone raso virada guarda, provada nos dois sentidos com clones de verdade",
      oQueIstoNaoMede:
        "não mede gleba, motor nem semente — mede um INSTRUMENTO de leitura de procedência, e está na lista de exceções do §7",
      quando: new Date().toISOString(),
      aPergunta: A_PERGUNTA,
      caminhoMedido: CAMINHO,
      osDoisSentidos,
      oQueOCorteRespondeuNaSemana: O_QUE_O_CORTE_RESPONDEU,
      oQueIdentificaOQue: O_QUE_IDENTIFICA_O_QUE,
      oVeredicto: recusaOk() && aqui.motivo !== null ? "os dois sentidos demonstrados" : "INCOMPLETO",
      conferidoAqui: "verde na mão, não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\n  veredicto: ${recusaOk() ? "os dois sentidos demonstrados" : "INCOMPLETO"}`);
console.log(`prova: docs/provas/LAB-89/a-pergunta-virou-guarda.json`);
