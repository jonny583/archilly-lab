/**
 * **LAB-206 (item 900) · a prova do LAB-41 roda o Generate e não escreve o commit dele — e, medido, ela se refaz
 * numa janela FECHADA, de 20/09 a 14/10, com o instante dentro** (D434).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-41/ortogonal-fora-da-gleba.json` foi gravada uma vez só, no LAB-41 (`d817176`,
 * 04/10/2026, 17h45 UTC), com carimbo fixo (`geradoEm` escrito à mão). A ferramenta
 * `external-engines/esteira/ferramentas/lab41.ts` (nunca mudou depois: a de então é a de hoje) roda as duas
 * candidatas **do Generate** (`src/lib/engine/`, pelo contrato de motor v1 de `src/lib/contratos/motor-v1/`) em
 * seis acessos de duas glebas acusadas, em três de controle e numa varredura ao longo da aresta, e responde por que
 * a ortogonal não entrega. A prova não escreve commit nenhum do Generate: o retrato do LAB-198 a dá calando só ele
 * — o motor do Laboratório de Parcelamento não está no fecho dos `import` (`bun build --metafile`: 59 arquivos do
 * Generate, zero do motor).
 *
 * # A janela, achada rodando a ferramenta
 *
 * Rodada em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `d817176`, a prova comparada **byte a byte**. A ferramenta leva de 25 a 60 segundos; rodaram-se **todos** os
 * commits de primeiro pai que tocam `src/lib/` do contrato de motor v1 em diante (68), os três de antes dele, e a
 * ponta de hoje:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `a02644c` (30/06) … `4cd7dc2` (09/09), 371 commits | a ferramenta não roda — nenhum tem `src/lib/contratos/motor-v1/` (os três últimos rodados; os 368 outros, conferidos pela árvore) |
 * | `22502b3` (10/09, o contrato v1) … `93b6f72` (20/09, GX-04 e GX-05), 24 commits | a ferramenta roda e **acusa** — 11 valores |
 * | **`7eb39ce` (20/09, A13) … `db31559` (14/10, cotar-sem-repetir), 36 commits** | **igual, byte a byte** |
 * | `18df3a8` (14/10, aparo-ja-dentro) … `0297934` (16/10), 8 commits, e a ponta de hoje (`cf3bc53`) | a ferramenta roda e **acusa** — 5 valores |
 *
 * - **O instante está dentro**: a ponta da origem às 17h45 UTC de 04/10 era `a06befa` — igual. Aqui, ao contrário
 *   do LAB-37 e do LAB-40, o commit do instante É um que refaz a prova; **coerência, não medição** de que era o do
 *   disco: a janela tem 36.
 * - **O que muda nas duas bordas é contagem de lote, não a resposta.** Na de depois, só os lotes da ESPINHA em
 *   cinco acessos (805 → 804, 123 → 126…); na de antes, também um da ortogonal e a varredura. Em nenhuma das duas o
 *   que a prova afirma — a ortogonal recusada pela via fora da gleba, a espinha entregando nos mesmos acessos — muda
 *   um campo. *A frase da prova vale com o Generate de hoje; os números dela, não.*
 * - **Os dentes são commits de verdade**: as duas bordas acusam. Não precisou de troca na cópia nem de veneno — a
 *   ferramenta chama `rodarGenerate`, e as bordas já mudam a prova.
 *
 * # O que se escreve: uma janela, FECHADA, com o instante dentro
 *
 * O que a prova cala é **"o Generate de `7eb39ce` (20/09) a `db31559` (14/10)"**. A prova não se toca (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio**: medidos aqui e no D434, não a cada verde — a trava roda o começo, o instante, o fim e as
 *   duas bordas;
 * - **commit de primeiro pai que não toca `src/lib/`**: não foi rodado (a ponta de hoje, sim);
 * - **commit que só existiu no ramo `motor-v2`** do Generate: mediu-se a `main`;
 * - **os 368 commits de antes do contrato v1 que não rodaram**: a conta deles é pela árvore (o contrato não existe
 *   neles), não pela ferramenta;
 * - **qual dos 36 era o do disco**: nenhuma régua acha, e a prova não pode ser regravada para dizê-lo;
 * - **o que a ferramenta imprime na tela**: a trava pergunta só a prova.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-41/ortogonal-fora-da-gleba.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab41.ts";

/** O Lab: o único commit da prova e da ferramenta. */
export const O_RETRATO_DO_LAB41: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "d8171760897bb4c5c836b86288b83c686ad0139e",
    deOndeSeSabe: "o único commit da prova e da ferramenta (`git log`: o LAB-41, 04/10/2026, 17h45 UTC)",
  },
];

/**
 * **A janela do Generate**, fechada: de `primeiro` a `ultimo` a ferramenta do `d817176` refaz a prova byte a byte;
 * em `antes` e em `depois` ela roda e acusa. O do instante (a ponta da origem na hora da prova) fica DENTRO.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "7eb39ce3c7904078d35d747391af955336d84448",
  ultimo: "db31559012ca7aeb7eca38ff6264f3527b5921e4",
  antes: "93b6f72e3396c9de9d5ee983b35900c7e2f471bf",
  oQueDaAntes:
    "a ferramenta roda e acusa: 11 valores — os lotes da espinha em seis acessos, um da ortogonal e dois pontos da varredura (20/09, GX-04 e GX-05, antes do A13); e acusa em todos os 24 commits desde o contrato v1",
  depois: "18df3a8c0c888c2216786f9e58a0a26eaac1a622",
  oQueDaDepois:
    "a ferramenta roda e acusa: 5 valores, só os lotes da espinha (14/10, a tesoura do lote na divisa); e os mesmos 5 nos 8 commits que tocam `src/lib/` até hoje",
  oDoInstante: "a06befa6192e0361bc7e395ea5f2697b44f2492f",
  oInstanteEstaDentro: true,
  porQueODoInstante:
    "a ponta da origem às 17h45 UTC de 04/10, a hora da prova — e ele refaz: coerência, não medição de que era o do disco (a janela tem 36 commits)",
} as const;

/**
 * Os commits de primeiro pai que tocam o lugar do fecho, e o que deram. Dos 371 que não rodam, três rodaram pela
 * ferramenta (os últimos antes do contrato v1) e 368 se contaram pela árvore — por isso `rodadosPelaFerramenta`.
 */
export const OS_COMMITS_RODADOS = {
  generate: {
    lugar: "src/lib/",
    commits: 439,
    rodadosPelaFerramenta: 71,
    naoRodam: 371,
    naoRodamPelaArvore: 368,
    acusamAntes: 24,
    refazem: 36,
    acusamDepois: 8,
  },
} as const;
