/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-173 · A RODADA SEM LINHA NA CONTA DOS DISPAROS. (item 900, D401)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Mede as rodadas do regime da caixa contra a conta dos disparos do `ONDE_PARAMOS.md`, nos dois
 * sentidos, e confere cada linha `reconstruido` contra o `git`: o commit que ela nomeia existe, é
 * o PRIMEIRO da rodada, e a hora de teto é a dele. Grava `docs/provas/LAB-173/`. Uso:
 * `bun run lab173`. Só lê o `git` desta casa; nada de rede, nada de vizinho.
 */

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { ancorarRecado, lerRecados } from "../src/classes-de-rodada.ts";
import {
  RODADAS_SEM_LINHA,
  conferirAConta,
  conferirAsRodadas,
  diasDosRecadosEmVazio,
  lerAConta,
  promptsDosRecados,
} from "../src/disparos-do-despertador.ts";

const ESTEIRA = join(import.meta.dirname, "..");
const RAIZ = join(ESTEIRA, "..", "..");
const ABERTURA = "09/10/2026";
const PROVA = join(RAIZ, "docs", "provas", "LAB-173");

const git = (...a: string[]) => {
  const r = spawnSync("git", a, { cwd: RAIZ, encoding: "utf8", env: { ...process.env, TZ: "UTC" } });
  return (r.stdout ?? "").trim();
};

const conta = lerAConta(readFileSync(join(RAIZ, "docs", "ONDE_PARAMOS.md"), "utf8"));
const recados = lerRecados(readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8")).map(
  ancorarRecado,
);
const prompts = promptsDosRecados(recados, ABERTURA);

// ── Cada reconstruída contra o git ──────────────────────────────────────────
const reconstruidas = conta.linhas
  .filter((l) => l.origem === "reconstruido")
  .map((l) => {
    const rodada = /\bLAB-\d+\b/.exec(l.rodada)?.[0] ?? "";
    const nomeado = /`([0-9a-f]{7,40})`/.exec(l.achou)?.[1] ?? "";
    const primeiro = git(
      "log",
      "--reverse",
      "--format=%h %ad",
      "--date=format-local:%d/%m/%Y %H:%M",
      "-E",
      `--grep=^${rodada}[ :]`,
    ).split("\n")[0] ?? "";
    const [hash, data, hora] = primeiro.split(" ");
    // O nome `confere` é veredito com régua própria (LAB-109, D336) e pede regra de coerência; aqui a evidência vai
    // inteira ao lado (o commit, a data e a hora do git), e a igualdade se chama pelo que ela compara.
    const bateComOGit = hash === nomeado && data === l.data && `≤ ${hora}` === l.hora;
    return {
      rodada,
      naConta: { data: l.data, hora: l.hora, commit: nomeado },
      noGit: { data: data ?? null, hora: hora ?? null, commit: hash ?? null },
      bateComOGit,
    };
  });

// ── O defeito, medido: a conta SEM as reconstruídas, com os totais andando junto ──
const abandonada = { ...conta, linhas: conta.linhas.filter((l) => l.origem !== "reconstruido") };
abandonada.declarados = { ...conta.declarados, noRegistro: abandonada.linhas.length, reconstruidos: 0 };
const oDefeito = {
  aReguaVelhaAprovava: conferirAConta(abandonada, diasDosRecadosEmVazio(recados), ABERTURA).length === 0,
  aReguaNovaAcusa: conferirAsRodadas(abandonada, prompts).map((p) => p.oQue),
};

// ── As mutações: cada uma TEM de ser acusada ──────────────────────────────
const i = conta.linhas.findIndex((l) => l.origem === "reconstruido");
const MUTACOES: { oQue: string; c: typeof conta; ex?: Record<string, string> }[] = [
  { oQue: "apagar a linha do LAB-150", c: { ...conta, linhas: conta.linhas.filter((l) => !/\bLAB-150\b/.test(l.rodada)) } },
  { oQue: "uma linha cita uma rodada sem recado", c: { ...conta, linhas: [...conta.linhas, { ...conta.linhas.at(-1)!, rodada: "item 900 (LAB-9999)" }] } },
  { oQue: "reconstruída sem o commit", c: { ...conta, linhas: conta.linhas.map((l, k) => (k === i ? { ...l, achou: "só o 900" } : l)) } },
  { oQue: "reconstruída com hora afirmada", c: { ...conta, linhas: conta.linhas.map((l, k) => (k === i ? { ...l, hora: "16:29" } : l)) } },
  { oQue: "exceção morta (a rodada tem linha)", c: conta, ex: { "LAB-150": "x".repeat(60) } },
  { oQue: "exceção sem recado", c: conta, ex: { ...RODADAS_SEM_LINHA, "LAB-9999": "x".repeat(60) } },
  { oQue: "exceção sem motivo", c: conta, ex: { "LAB-68": "" } },
];
const mutacoes = MUTACOES.map((m) => ({
  oQue: m.oQue,
  acusada: conferirAsRodadas(m.c, prompts, m.ex).length > 0,
}));

const problemas = conferirAsRodadas(conta, prompts);

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "rodadas-sem-linha.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-173",
      oQueIstoMede:
        "as RODADAS do regime da caixa (LAB-N nos títulos do RECADOS.md, de 09/10/2026 em diante) contra as " +
        "linhas da conta dos disparos do ONDE_PARAMOS.md, nos dois sentidos, e cada linha reconstruída contra o " +
        "primeiro commit da rodada no git desta casa; não mede gleba",
      geradoEm: "2026-10-18",
      osRecadosDePrompt: prompts.length,
      asLinhasDaConta: conta.linhas.length,
      porOrigem: conta.declarados,
      asExcecoes: RODADAS_SEM_LINHA,
      reconstruidas: {
        quantas: reconstruidas.length,
        batemComOGit: reconstruidas.filter((r) => r.bateComOGit).length,
        linhas: reconstruidas,
      },
      oDefeito,
      mutacoes,
      problemas,
    },
    null,
    2,
  )}\n`,
);

console.log(`  recados de prompt desde ${ABERTURA}: ${prompts.length} · linhas na conta: ${conta.linhas.length}`);
console.log(`  reconstruídas: ${reconstruidas.length}, conferem com o git: ${reconstruidas.filter((r) => r.bateComOGit).length}`);
console.log(`  a régua velha aprovava o abandono: ${oDefeito.aReguaVelhaAprovava}`);
console.log(`  mutações acusadas: ${mutacoes.filter((m) => m.acusada).length} de ${mutacoes.length}`);
console.log(`  problemas hoje: ${problemas.length}`);
console.log("\n  docs/provas/LAB-173/rodadas-sem-linha.json");
if (reconstruidas.some((r) => !r.bateComOGit) || mutacoes.some((m) => !m.acusada) || !oDefeito.aReguaVelhaAprovava) {
  process.exit(1);
}
