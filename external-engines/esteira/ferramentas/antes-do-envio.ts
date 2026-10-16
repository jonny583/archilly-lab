/**
 * O QUE O GANCHO `pre-push` RODA. (LAB-106, item 900)
 *
 * ```sh
 * # chamado pelo git, com as refs na entrada — não se roda à mão:
 * external-engines/ganchos/pre-push
 * ```
 *
 * 1. lê as refs que vão (a entrada do `pre-push`);
 * 2. se nenhuma leva a `main`, sai em silêncio — o envio de ramo não é entrega;
 * 3. se leva, recusa quando o que vai não é o `HEAD` ou a árvore está suja
 *    (`src/antes-do-envio.ts`);
 * 4. recusa quando um commit da primeira linha que vai à `main` entrou sem mescla, ou mesclou sem dizer
 *    *"mesclado por git direto (D29)"* (`src/mescla-declarada.ts`, LAB-138);
 * 5. e roda **as travas do trabalho sem clones** — a lista lida do `verde.yml` pela MESMA função
 *    que a ferramenta do LAB-84 e a trava do LAB-98 usam (D231), nunca uma lista escrita aqui.
 *
 * Sai com o código do `bun test`: diferente de zero, o `git` não envia.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { estadoDoRepositorio, lerAEntrada, levaAMain, motivosParaRecusar } from "../src/antes-do-envio.ts";
import { argumentosDoLog, lerALinha, motivosDaMescla } from "../src/mescla-declarada.ts";
import { TRABALHO_SEM_CLONES, arquivosDoTrabalho } from "../src/nome-do-trabalho.ts";

const ESTEIRA = join(import.meta.dirname, "..");
const RAIZ = join(ESTEIRA, "..", "..");

const refs = lerAEntrada(readFileSync(0, "utf8"));
if (!levaAMain(refs)) process.exit(0);

const git = (args: string[]): string => execFileSync("git", args, { encoding: "utf8" });
const motivos = motivosParaRecusar(refs, estadoDoRepositorio(RAIZ, git));
// A primeira linha do que vai (LAB-138, D366): sem PR, a entrega entra por mescla `--no-ff`, e a mescla se declara.
for (const r of refs.filter((x) => x.refRemota === "refs/heads/main" && !/^0+$/.test(x.shaLocal))) {
  const alcance = /^0+$/.test(r.shaRemoto) ? r.shaLocal : `${r.shaRemoto}..${r.shaLocal}`;
  try {
    motivos.push(...motivosDaMescla(lerALinha(git(["-C", RAIZ, ...argumentosDoLog(alcance)]))));
  } catch {
    // Não ler a linha não é aprovação (D213): sem o commit remoto no clone, não se sabe o que vai.
    motivos.push(`não deu para ler a primeira linha de ${alcance} — busque a origem (git fetch) e envie de novo`);
  }
}
if (motivos.length > 0) {
  console.error("\n✗ o envio à main NÃO sai — a ordem da entrega (LAB-106) e a mescla (LAB-138):");
  for (const m of motivos) console.error(`  · ${m}`);
  console.error("\n  Ponha tudo no commit, regere as provas que contam a árvore, rode o verde, e envie de novo.");
  process.exit(1);
}

const lista = arquivosDoTrabalho(readFileSync(join(RAIZ, ".github", "workflows", "verde.yml"), "utf8"), TRABALHO_SEM_CLONES);
if (lista.length === 0) {
  // Lista vazia não é aprovação (D213): o gancho que não achou o que rodar não deixa passar.
  console.error("✗ o gancho não achou a lista do trabalho sem clones no verde.yml");
  process.exit(1);
}
console.error(`\n  antes do envio: ${lista.length} arquivos de trava do trabalho sem clones, sobre o HEAD limpo`);
const r = spawnSync("bun", ["test", ...lista], { cwd: ESTEIRA, stdio: "inherit" });
if (r.status !== 0) {
  console.error("\n✗ o envio à main NÃO sai: uma trava do trabalho sem clones reprovou sobre a árvore que iria.");
  console.error("  Se é a prova do LAB-52 ou do LAB-57, ela foi regerada antes do último arquivo entrar.");
}
process.exit(r.status ?? 1);
