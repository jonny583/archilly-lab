/**
 * LAB-90 · "Caixa vazia" era verdade? — medido nas casas que eu pude ler.
 *
 * Uso: `bun run lab90`
 *
 * Lê **só para leitura**, pelo caminho, os clones irmãos que existirem, e aplica a MESMA função
 * que a trava chama. Nada é escrito fora de `docs/provas/LAB-90/`.
 *
 * **Esta prova não mede gleba nenhuma** — mede declarações e árvores —, e por isso está na lista
 * declarada de exceções do §7 (LAB-36).
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { O_QUE_ISTO_NAO_ALCANCA, aCaixaEstavaVazia } from "../src/caixa-vazia-era-verdade.ts";
import { lerPelaHistoria } from "../src/profundidade-da-historia.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-90");
const VIZINHOS = join(RAIZ, "..");

const git = (dir: string, ...args: string[]): string | null => {
  try {
    return execFileSync("git", ["-C", dir, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
};
const ehRaso = (dir: string): boolean | null => {
  const r = git(dir, "rev-parse", "--is-shallow-repository");
  return r === null ? null : r === "true";
};
const nomesDaCaixa = (dir: string, commit: string): string[] => {
  const r = git(dir, "ls-tree", "--name-only", commit, "docs/caixa-de-entrada/");
  return r === null || r === "" ? [] : r.split("\n").map((l) => l.replace(/^.*\//, ""));
};

/** As declarações que eu pude conferir, cada uma com a casa e o commit que a direção citou. */
const AS_DECLARACOES = [
  { casa: "Orçamento", repo: "archilly-budget-blueprint", commit: "e701a6f", oQueADirecaoDisse: "falsa" },
  { casa: "Propostas", repo: "archilly-propostas", commit: "bd84f13", oQueADirecaoDisse: "legítima (item bloqueado)" },
  { casa: "Propostas", repo: "archilly-propostas", commit: "612c161", oQueADirecaoDisse: "legítima" },
  { casa: "Geo", repo: "urban-scout-tool", commit: "f0cb290", oQueADirecaoDisse: "falsa" },
  { casa: "este Lab", repo: ".", commit: "34bc00c", oQueADirecaoDisse: "falsa" },
  { casa: "este Lab", repo: ".", commit: "2bc543f", oQueADirecaoDisse: "— (não citada)" },
  { casa: "este Lab", repo: ".", commit: "1e7df13", oQueADirecaoDisse: "— (não citada)" },
  { casa: "este Lab", repo: ".", commit: "8e8b74b", oQueADirecaoDisse: "— (não citada)" },
  { casa: "este Lab", repo: ".", commit: "8236799", oQueADirecaoDisse: "— (não citada)" },
] as const;

const dirDo = (repo: string): string => (repo === "." ? RAIZ : join(VIZINHOS, repo));

console.log('══════════ LAB-90 · "caixa vazia" era verdade? ══════════');
const medidas = AS_DECLARACOES.map((d) => {
  const dir = dirDo(d.repo);
  const existe = git(dir, "rev-parse", "--git-dir") !== null;
  if (!existe) {
    return { ...d, lido: false, porqueNaoLido: "o clone não está ao lado desta árvore", leitura: null, assunto: null, raso: null };
  }
  const assunto = git(dir, "log", "-1", "--format=%s", d.commit);
  if (assunto === null) {
    return { ...d, lido: false, porqueNaoLido: "o commit não está neste clone (pode ser o CORTE — D295)", leitura: null, assunto: null, raso: ehRaso(dir) };
  }
  const leitura = aCaixaEstavaVazia(nomesDaCaixa(dir, d.commit), assunto);
  // **Quando a casa declarou** depende de HISTÓRIA, e em clone raso isto RECUSA (D295).
  const quando = lerPelaHistoria(ehRaso(dir), () => git(dir, "log", "-1", "--format=%ad", "--date=iso-strict", d.commit));
  return { ...d, lido: true, porqueNaoLido: null, leitura, assunto, raso: ehRaso(dir), quando: { podeAfirmar: quando.podeAfirmar, valor: quando.valor, motivo: quando.motivo } };
});

for (const m of medidas) {
  if (!m.lido) {
    console.log(`  ?  ${m.casa.padEnd(10)} ${m.commit} · NÃO LIDO · ${m.porqueNaoLido}`);
    continue;
  }
  const v = m.leitura!;
  const marca = v.declaracaoEraVerdadeira === true ? "✓ verdadeira" : v.declaracaoEraVerdadeira === false ? "✗ FALSA     " : "· null      ";
  console.log(`  ${marca} ${m.casa.padEnd(10)} ${m.commit} · ${v.veredicto} · abertos=[${v.abertos.join(" ")}] maiorFeito=${v.oMaiorFeito ?? "—"}`);
}

const falsas = medidas.filter((m) => m.lido && m.leitura!.declaracaoEraVerdadeira === false).length;
const verdadeiras = medidas.filter((m) => m.lido && m.leitura!.declaracaoEraVerdadeira === true).length;
const nulas = medidas.filter((m) => m.lido && m.leitura!.declaracaoEraVerdadeira === null).length;
console.log(`\n  ${falsas} falsas · ${verdadeiras} verdadeiras · ${nulas} não decidíveis · ${medidas.filter((m) => !m.lido).length} não lidas`);
console.log("\n  O QUE ISTO NÃO ALCANÇA:");
for (const l of O_QUE_ISTO_NAO_ALCANCA) console.log(`    · ${l}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "caixa-vazia-era-verdade.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-90",
      oQue: 'a guarda que diz se uma declaração de "caixa vazia" era verdadeira, pela árvore do commit que a declarou',
      oQueIstoNaoMede:
        "não mede gleba, motor nem semente — mede declarações e árvores de caixa de entrada, e está na lista de exceções do §7",
      quando: new Date().toISOString(),
      aDefinicaoDeABERTO:
        "`NNN.md` sem `-FEITO`, sem `-RETIRADO` e sem `COMO_FUNCIONA` — a definição do próprio `COMO_FUNCIONA.md` da direção",
      oTerceiroEstado: {
        oQueOItemPediu: "`bloqueado` — item aberto cuja execução espera pessoa ou outro repositório",
        medido: "NENHUMA casa marca bloqueio no nome do arquivo: só existem `NNN.md` e `NNN-FEITO.md` (e `-RETIRADO` na receita)",
        oQueEuFiz:
          "recusei em vez de adivinhar (D23/D295): `bloqueado` sai `null`. E achei uma distinção que É decidível — item aberto com número MENOR que algum `-FEITO` foi PULADO em rodadas anteriores, e item aberto que é o PRÓXIMO da fila não foi",
      },
      asMedidas: medidas,
      aConta: { falsas, verdadeiras, naoDecidiveis: nulas, naoLidas: medidas.filter((m) => !m.lido).length },
      oQueIstoNaoAlcanca: O_QUE_ISTO_NAO_ALCANCA,
      conferidoAqui: "verde na mão, não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-90/caixa-vazia-era-verdade.json`);
