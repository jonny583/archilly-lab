/**
 * A `FILA.md` EM DIA — todo prompt da caixa tem a sua linha, e quem responde é o `RECADOS.md`.
 * (LAB-136, item 900, a dívida própria, D364)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §7 manda que todo prompt feche com *"`FILA.md`, `ONDE_PARAMOS.md` e `INDEX.md` em
 * dia"*. O `ONDE_PARAMOS.md` tem a trava do LAB-126 (`o-ultimo-prompt.ts`), o `INDEX.md` a do
 * LAB-118 (`o-indice.ts`). **A `FILA.md` não tinha nenhuma** — o LAB-131 a lê só para conferir
 * as citações de decisão, e o LAB-121 só para os ramos.
 *
 * # O que se mediu (16/10/2026), por LUGAR
 *
 * A `FILA.md` registra os prompts da caixa em DOIS lugares, cada um com a sua forma:
 *
 * - a tabela da seção *"A IDA MUDOU DE LUGAR"*, uma linha por item numerado: `` | `NNN` | … | ✅ **LAB-NN**, … ``;
 * - um título `### LAB-NN · item 900 — …` por rodada do item contínuo, mais novo primeiro.
 *
 * Contra os 69 prompts com item no `RECADOS.md` (LAB-68 a LAB-135), **19 não tinham o seu lugar**: a
 * tabela parava no `012` (LAB-79), e os itens `013` a `030` — dezoito, de 10 a 15/10/2026 — nunca
 * ganharam linha; e o LAB-97, o primeiro do 900, não tinha título (os títulos começam no LAB-98).
 * Medido por mutação antes da régua: apagar a linha do `012` e o título do LAB-135 da página **não
 * derrubava nenhuma trava**. *Regra sem guarda*, e já quebrada — dezoito vezes seguidas, porque a
 * rodada do item numerado escrevia o relatório e o recado e esquecia a tabela.
 *
 * # As escolhas, e de onde veio cada uma
 *
 * - **O universo é o `RECADOS.md`**, pela leitura que já existe ({@link lerAsRodadas}, LAB-126):
 *   todo título de prompt cujo recado diz o item. É a página que a direção lê, e a única que
 *   diz, rodada a rodada, qual prompt fechou qual item.
 * - **E a caixa, no outro sentido**: todo `NNN-FEITO.md` (fora o `900`, que nunca se fecha) tem de
 *   ter linha. Item feito sem recado não existe hoje — mas, se nascer, a régua o pega pela caixa.
 * - **A linha do item numerado tem de citar o prompt que o fechou** (`LAB-NN`, com fronteira); se o
 *   item teve dois prompts (o `028`, num prompt só com dois despertadores), basta um.
 * - **Linha de item que ainda está aberto na caixa reprova**: o ✅ afirma um estado que a caixa
 *   desmente.
 * - **O 900 se confere pelo título**, riscado ou não: `### LAB-NN ·`.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **os prompts de antes da caixa** (LAB-02 a LAB-67, sem item no recado): a fila então era a porta
 *   de entrada e tinha outra forma, e oito deles (LAB-02, 03, 07, 08, 62, 63, 66 e 67) nunca tiveram
 *   título próprio. É história, e não se reescreve;
 * - **o que a linha diz** do prompt — é relato; o relato mora no relatório;
 * - **a ordem** das linhas e dos títulos;
 * - **as propostas ao chat** (*"proposto ao chat"*) — têm a trava do LAB-62 (`varredura-das-propostas.ts`).
 */

import { lerAsRodadas } from "./o-ultimo-prompt.ts";
import { ITEM_RESERVADO, lerNomeDoItem } from "./numero-do-item.ts";

/** A frase da regra, conferida no teste onde ela mora (o `CLAUDE.md` §7). */
export const A_REGRA = "`FILA.md`, `ONDE_PARAMOS.md` e `INDEX.md` em dia";

/** O título da seção da tabela, para a régua ler só ali. */
export const SECAO_DA_TABELA = "## 📥 A IDA MUDOU DE LUGAR";

export type TipoDeProblemaDaFila =
  | "sem-tabela"
  | "item-sem-linha"
  | "linha-com-outro-prompt"
  | "linha-de-item-aberto"
  | "novecentos-sem-titulo";

export interface ProblemaDaFila {
  tipo: TipoDeProblemaDaFila;
  detalhe: string;
}

export interface LinhaDaTabela {
  /** O número do item, como número. */
  item: number;
  /** A linha inteira. */
  texto: string;
}

/** As linhas da tabela da caixa: só dentro da seção dela, até o próximo `## `. */
export function lerATabela(fila: string): LinhaDaTabela[] | null {
  const i = fila.indexOf(SECAO_DA_TABELA);
  if (i < 0) return null;
  const resto = fila.slice(i + SECAO_DA_TABELA.length);
  const fim = resto.search(/^## /m);
  const secao = fim < 0 ? resto : resto.slice(0, fim);
  const saida: LinhaDaTabela[] = [];
  for (const l of secao.split("\n")) {
    const m = /^\|\s*`(\d{3,})`/.exec(l);
    if (m) saida.push({ item: Number(m[1]), texto: l });
  }
  return saida;
}

/** Os prompts com título próprio na página: `### LAB-NN ·`, riscado ou não. */
export function lerOsTitulos(fila: string): Set<string> {
  return new Set([...fila.matchAll(/^###\s*(?:~~)?\s*(LAB-\d{2,})\b/gm)].map((m) => m[1]!));
}

const tres = (n: number): string => String(n).padStart(3, "0");
const cita = (texto: string, prompt: string): boolean => new RegExp(String.raw`\b${prompt}\b(?!\d)`).test(texto);

/**
 * Confere a `FILA.md` contra o `RECADOS.md` e contra a caixa. `caixa` são os nomes dos arquivos da
 * pasta `docs/caixa-de-entrada/`.
 */
export function conferirAFilaEmDia(
  fila: string,
  recados: string,
  caixa: readonly string[],
): {
  universo: { rodadasComItem: number; itensNumerados: number; novecentos: number; linhas: number; titulos: number; feitosNaCaixa: number };
  problemas: ProblemaDaFila[];
} {
  const problemas: ProblemaDaFila[] = [];
  const tabela = lerATabela(fila);
  if (tabela === null) problemas.push({ tipo: "sem-tabela", detalhe: `a seção '${SECAO_DA_TABELA}' não está na página` });
  const linhas = tabela ?? [];
  const titulos = lerOsTitulos(fila);

  const rodadas = lerAsRodadas(recados).filter((r) => r.item !== null);
  /** item → prompts que o fecharam, na ordem do arquivo. */
  const promptsDoItem = new Map<number, string[]>();
  const novecentos = new Set<string>();
  for (const r of rodadas) {
    // O número do item pela forma única da caixa (LAB-113): a casa confere o número que guarda (LAB-52).
    const lido = lerNomeDoItem(`${r.item}.md`);
    if (lido === null) continue;
    const n = lido.numero;
    if (n === ITEM_RESERVADO) novecentos.add(r.prompt);
    else promptsDoItem.set(n, [...new Set([...(promptsDoItem.get(n) ?? []), r.prompt])]);
  }

  const itens = caixa.map(lerNomeDoItem).filter((x) => x !== null);
  const feitos = new Set(itens.filter((x) => x.estado === "feito" && x.numero !== ITEM_RESERVADO).map((x) => x.numero));
  const abertos = new Set(itens.filter((x) => x.estado === "aberto").map((x) => x.numero));

  const numerados = [...new Set([...promptsDoItem.keys(), ...feitos])].sort((a, b) => a - b);
  for (const n of numerados) {
    const daLinha = linhas.filter((l) => l.item === n);
    const prompts = promptsDoItem.get(n) ?? [];
    if (daLinha.length === 0) {
      problemas.push({ tipo: "item-sem-linha", detalhe: `${tres(n)} (${prompts.join(", ") || "feito na caixa, sem recado"}) não tem linha na tabela` });
      continue;
    }
    if (prompts.length > 0 && !daLinha.some((l) => prompts.some((p) => cita(l.texto, p)))) {
      problemas.push({ tipo: "linha-com-outro-prompt", detalhe: `${tres(n)}: a linha não cita ${prompts.join(" nem ")}, que o RECADOS.md diz ter fechado o item` });
    }
  }
  for (const l of linhas) {
    if (abertos.has(l.item) && !feitos.has(l.item)) {
      problemas.push({ tipo: "linha-de-item-aberto", detalhe: `${tres(l.item)}: a tabela tem linha, e o item está aberto na caixa` });
    }
  }
  for (const p of novecentos) {
    if (!titulos.has(p)) problemas.push({ tipo: "novecentos-sem-titulo", detalhe: `${p} (item 900) não tem título '### ${p} ·' na página` });
  }

  return {
    universo: {
      rodadasComItem: rodadas.length,
      itensNumerados: numerados.length,
      novecentos: novecentos.size,
      linhas: linhas.length,
      titulos: titulos.size,
      feitosNaCaixa: feitos.size,
    },
    problemas,
  };
}
