/**
 * O `upstream/` NUNCA FOI TOCADO DEPOIS DE CRIADO — perguntado à HISTÓRIA, commit a commit. (LAB-163, item 900, a
 * dívida própria, D391)
 *
 * # A linha, e o que estava sem guarda
 *
 * O `docs/SEGURANCA.md`, na seção *Reconferido no LF-FINAL-2* (15/09/2026), diz: *"`external-engines/symbios/upstream/`
 * nunca foi tocado depois de criado · ✅ · `git log --oneline -- external-engines/symbios/upstream/` — **um commit**, o
 * do LAB-00 que o criou"*. Foi um comando rodado uma vez, e nunca mais — espécie *mensagem fixa que afirma estado sem
 * perguntar*.
 *
 * A trava do LAB-132 (`upstream-intocavel.ts`) pergunta a árvore **no `HEAD`**, e diz por extenso o que deixa de fora:
 * *"a história: só o `HEAD`. Um patch commitado e desfeito depois volta à mesma árvore e passa"*. É exatamente a
 * diferença entre as duas frases: *"é igual hoje"* (LAB-132) e *"nunca foi tocado"* (LF-FINAL-2). Medido por mutação
 * (18/10/2026), num clone descartável desta casa: um commit que acrescenta uma linha ao `upstream/src/lib.rs` e um
 * segundo que a tira — a árvore do `HEAD` volta a `7ea7b17…`, e a trava do LAB-132 **passa**. *"Nunca tocado"* era falso
 * e verde.
 *
 * # O que se mediu, por LUGAR
 *
 * A história inteira da origem desta casa (`git rev-list HEAD --remotes=origin`, clone desrasado), e de cada commit a
 * árvore da pasta (`<commit>:<pasta>`, pelo `git cat-file --batch-check`, uma leitura só): **462 commits, 461 com a
 * árvore registrada, 1 sem a pasta** (a raiz, de antes do LAB-00) — **nenhuma terceira árvore**. A linha é verdadeira.
 *
 * E o comando antigo já não diria *"um commit"*: `git log --full-history` mostra **dois**, o `f61be91` (LAB-00) e a
 * mescla `baa3e07` que o trouxe à `main` (o PR #1). A mescla não muda a pasta — leva a árvore do `f61be91`. Contar
 * commits responde a forma da história; contar **árvores** responde a pergunta.
 *
 * # Como ela cobra
 *
 * 1. **toda árvore que a pasta já teve, em qualquer commit lido, é a registrada** em `COPIAS_DE_UPSTREAM`, ou uma das
 *    {@link ARVORES_QUE_JA_FORAM} (a troca deliberada da cópia, com o motivo) → senão `arvore-que-nunca-foi-registrada`:
 *    o patch, ainda que desfeito depois;
 * 2. **o commit que trouxe a cópia** (`trazidaEm`) está na história e tem a árvore registrada → senão
 *    `trazida-em-que-nao-confere`;
 * 3. **cada árvore declarada em {@link ARVORES_QUE_JA_FORAM} aparece** em algum commit → senão `declaracao-que-sobra`;
 * 4. **história rasa** → `historia-rasa` (D293: no raso, *"nenhuma"* é falta de história);
 * 5. **nenhum commit lido, ou nenhum com a pasta** → `universo-vazio` (D213).
 *
 * # O que ela NÃO alcança — dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */
import { COPIAS_DE_UPSTREAM, type CopiaDeUpstream } from "./upstream-intocavel.ts";

/** A linha do `docs/SEGURANCA.md` que esta régua responde, conferida por `aRegraEstaEscrita`. */
export const A_LINHA = "nunca foi tocado depois de criado";

/** O ponteiro que a linha passa a carregar. */
export const O_PONTEIRO = "external-engines/esteira/src/a-historia-do-upstream.ts";

/**
 * As árvores que uma pasta `upstream` já teve **antes** da registrada — a cópia trocada por uma versão nova do motor,
 * de propósito. Hoje nenhuma: a cópia é a do LAB-00. Trocar a cópia acrescenta aqui a árvore velha, no mesmo commit do
 * `VERSION` novo e da decisão.
 */
export const ARVORES_QUE_JA_FORAM: readonly { pasta: string; arvore: string; motivo: string }[] = [];

/** O que esta régua NÃO alcança — publicado na saída, para o silêncio não parecer cobertura. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o que não chegou à ORIGEM: um patch num ramo local, nunca enviado, não está na história lida",
  "a história reescrita na origem (um envio forçado que apaga o commit do patch): o que a origem esqueceu, a régua não " +
    "lê — e o envio forçado é proibido na casa por outra regra",
  "que a cópia tenha entrado EXATA: isso pede o repositório de outra pessoa e a rede; quem atesta é o `VERSION` e o " +
    "commit que a trouxe (como no LAB-132)",
  "pasta de motor de fora com outro nome que não `upstream`: as pastas lidas são as de `COPIAS_DE_UPSTREAM`",
];

/** A árvore da pasta num commit; `null` quando o commit não tem a pasta. */
export interface ArvoreNoCommit {
  hash: string;
  arvore: string | null;
}

export interface HistoriaDaPasta {
  pasta: string;
  commits: ArvoreNoCommit[];
}

export type TipoDoProblema =
  | "arvore-que-nunca-foi-registrada"
  | "trazida-em-que-nao-confere"
  | "declaracao-que-sobra"
  | "historia-rasa"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDoProblema;
  pasta: string;
  detalhe: string;
}

export interface Universo {
  pasta: string;
  commits: number;
  comAPasta: number;
  arvores: number;
}

/** Os argumentos de `git rev-list`: todo commit do `HEAD` e da origem. */
export const ARGUMENTOS_DO_REV_LIST: readonly string[] = ["rev-list", "HEAD", "--remotes=origin"];

/** A entrada do `git cat-file --batch-check`: uma linha `<commit>:<pasta>` por commit. */
export function entradaDoCatFile(commits: readonly string[], pasta: string): string {
  return commits.map((c) => `${c}:${pasta}\n`).join("");
}

/**
 * Lê a saída do `git cat-file --batch-check` dada por {@link entradaDoCatFile}, na mesma ordem: `<sha> tree <tamanho>`
 * quando a pasta existe, `<commit>:<pasta> missing` quando não.
 */
export function lerOCatFile(commits: readonly string[], saida: string): ArvoreNoCommit[] {
  const linhas = saida.split("\n").filter((l) => l.trim() !== "");
  if (linhas.length !== commits.length) {
    throw new Error(`o cat-file devolveu ${linhas.length} linha(s) para ${commits.length} commit(s)`);
  }
  return commits.map((hash, i) => {
    const [sha = "", tipo = ""] = linhas[i]!.split(" ");
    if (tipo === "missing") return { hash, arvore: null };
    if (tipo !== "tree") throw new Error(`a pasta, no commit ${hash}, é ${tipo || "?"} — esperava uma árvore`);
    return { hash, arvore: sha };
  });
}

export function conferirAHistoriaDoUpstream(e: {
  rasa: boolean;
  historias: readonly HistoriaDaPasta[];
  registro?: readonly CopiaDeUpstream[];
  jaForam?: readonly { pasta: string; arvore: string }[];
}): { problemas: Problema[]; universo: Universo[] } {
  const registro = e.registro ?? COPIAS_DE_UPSTREAM;
  const jaForam = e.jaForam ?? ARVORES_QUE_JA_FORAM;
  const problemas: Problema[] = [];
  const universo: Universo[] = [];

  for (const copia of registro) {
    const h = e.historias.find((x) => x.pasta === copia.pasta);
    const commits = h?.commits ?? [];
    const comAPasta = commits.filter((c) => c.arvore !== null);

    if (e.rasa) {
      problemas.push({
        tipo: "historia-rasa",
        pasta: copia.pasta,
        detalhe: 'clone raso — desrase com `git fetch --unshallow origin`; no raso, "nenhuma" é falta de história',
      });
    }
    if (comAPasta.length === 0) {
      problemas.push({
        tipo: "universo-vazio",
        pasta: copia.pasta,
        detalhe: `${commits.length} commit(s) lido(s), nenhum com a pasta — nada foi perguntado`,
      });
    }

    const permitidas = new Set([copia.arvore, ...jaForam.filter((j) => j.pasta === copia.pasta).map((j) => j.arvore)]);
    const estranhas = new Map<string, string[]>();
    for (const c of comAPasta) {
      if (!permitidas.has(c.arvore!)) estranhas.set(c.arvore!, [...(estranhas.get(c.arvore!) ?? []), c.hash]);
    }
    for (const [arvore, hashes] of estranhas) {
      problemas.push({
        tipo: "arvore-que-nunca-foi-registrada",
        pasta: copia.pasta,
        detalhe:
          `a árvore ${arvore.slice(0, 7)} em ${hashes.length} commit(s) (${hashes.map((x) => x.slice(0, 7)).join(", ")}) ` +
          "— a pasta foi tocada, ainda que desfeita depois",
      });
    }

    const trouxe = commits.find((c) => c.hash.startsWith(copia.trazidaEm));
    if (!trouxe || trouxe.arvore !== copia.arvore) {
      problemas.push({
        tipo: "trazida-em-que-nao-confere",
        pasta: copia.pasta,
        detalhe: trouxe
          ? `${copia.trazidaEm} tem a árvore ${trouxe.arvore ?? "(sem a pasta)"}, não a registrada`
          : `${copia.trazidaEm} não está na história lida`,
      });
    }

    for (const j of jaForam.filter((x) => x.pasta === copia.pasta)) {
      if (!comAPasta.some((c) => c.arvore === j.arvore)) {
        problemas.push({
          tipo: "declaracao-que-sobra",
          pasta: copia.pasta,
          detalhe: `a árvore declarada ${j.arvore.slice(0, 7)} não aparece em commit nenhum`,
        });
      }
    }

    universo.push({
      pasta: copia.pasta,
      commits: commits.length,
      comAPasta: comAPasta.length,
      arvores: new Set(comAPasta.map((c) => c.arvore)).size,
    });
  }

  return { problemas, universo };
}
