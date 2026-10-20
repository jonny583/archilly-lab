/**
 * **LAB-207 (item 900) · as três amostragens do LAB-46 rodam o motor e o Generate e não escrevem o commit de nenhum
 * dos dois — e, medido, o motor que as fez NÃO é o da origem daquela hora: é o de 14/09, a MESMA janela da testada do
 * LAB-37** (D435).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-46/antonina-tres-amostragens.json` foi gravada uma vez só, no LAB-46 (`c0b7c54`,
 * 05/10/2026, 00h16 UTC), com carimbo fixo (`geradoEm` escrito à mão). A ferramenta
 * `external-engines/esteira/ferramentas/lab46.ts` (mudada depois no LAB-103 e no LAB-105, só na prova de
 * determinismo; a de então é a do `c0b7c54`) roda a esteira do Laboratório de Parcelamento — **o motor**
 * (`motor-testfit/src/lib/lab/`, 17 arquivos no fecho dos `import`) — com o contrato e as regras **do Generate**
 * (`src/lib/contratos/motor-v1/`, `engine/`, `import/`, `normas/`: 43 arquivos) em `geo-antonina`, nas três
 * amostragens do D148, e responde *"o 33 contra 1 228 aparece nas três, ou só na completa?"*. A prova não escreve
 * commit de nenhum dos dois: o retrato do LAB-198 a dá calando os dois — dois silêncios.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 20/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `c0b7c54`, a prova comparada **byte a byte**. A ferramenta leva de 20 a 45 segundos; rodaram-se **todos** os
 * commits de primeiro pai que tocam o lugar do fecho no motor (37) e, no Generate, os 68 do contrato v1 em diante e
 * os três de antes (os outros 368 de antes contados pela árvore: nenhum tem `src/lib/contratos/motor-v1/traducao.ts`,
 * que a ferramenta importa) — e as duas pontas de hoje.
 *
 * **O instante não refaz a prova.** Com as pontas da origem às 00h16 UTC de 05/10 (motor `f581b5a`, Generate
 * `a06befa`), **63 linhas** mudam: as duas amostragens de 2 variantes (a espinha *sem as faces* deixa de sair
 * `null` e entrega 1 417 lotes; com as faces, 1 088 → 1 247; a ortogonal 1 386 → 1 335 e 1 228 → 1 101) e as aceitas
 * da completa. **A completa com as faces NÃO muda: superquadra, 33 lotes, 33 externos, 14 na testada.**
 *
 * **O eixo do motor**, com o Generate do instante — os 37 commits de primeiro pai que tocam `src/lib/lab/`:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `d98b0fe` … `0ece0b1` (10/09), 10 commits | a ferramenta não roda |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | a ferramenta roda e **acusa** — 16 linhas: a espinha de 2 variantes sai sem plano também com as faces |
 * | `648ae78` (14/09, T03) | a ferramenta roda e **acusa** — 4 linhas, só as aceitas (18 → 15, 20 → 16) |
 * | **`fe0c7a1` (14/09, T02) · `4181e95` · `244aae3` (14/09, o fechamento)** | **igual, byte a byte** |
 * | `2160fce` (15/09, T07) · `ee7c438`: 16 linhas; `38f9943` … `3fdb8ca` (11/10), 19 commits, e a ponta de hoje (`e9afae6`): as **mesmas** 63 linhas do instante | a ferramenta roda e **acusa** |
 *
 * **O eixo do Generate**, com o motor em `244aae3` — os 439 commits de primeiro pai que tocam `src/lib/`:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `a02644c` (30/06) … `4cd7dc2` (09/09), 371 commits | a ferramenta não roda — antes do contrato de motor v1 (três rodados; 368 pela árvore) |
 * | `22502b3` (10/09, o contrato v1) … `8223873` (02/10), 29 commits | a ferramenta roda e **acusa** — 16 linhas |
 * | **`5b70e5f` (02/10, o contrato v2) … `0297934` (16/10, o último que toca `src/lib/`), 39 commits, e a ponta de hoje (`2ba6e5e`)** | **igual, byte a byte** |
 *
 * - **Os quatro cantos** (`fe0c7a1`/`244aae3` × `5b70e5f`/`2ba6e5e`) dão igual: a janela é um retângulo.
 * - **O instante do Generate está dentro da janela dele; o do motor, NÃO** — o mesmo achado do D432 e do D433, agora
 *   às 00h16 de 05/10: o motor de 14/09. **A janela do motor é a MESMA do LAB-37** (`fe0c7a1` … `244aae3`; o T03
 *   acusa, como lá) — e as três provas do mesmo disco (LAB-37, 40 e 46) não estreitam além disso. **Coerência, não
 *   medição.**
 * - **A frase da prova sobrevive ao motor de hoje; os números das amostragens de 2 variantes, não.** Com as pontas de
 *   hoje (motor `e9afae6`, Generate `2ba6e5e`), o que a prova afirma — *"o plano só de lote externo aparece SÓ na
 *   completa"* (`planoSoDeLoteExterno.em`), com 33 lotes, 33 externos e 14 na testada — sai igual; a espinha *sem as
 *   faces* de 2 variantes, que a prova dá `null`, entrega 1 417 lotes.
 * - **Os dentes são commits de verdade**: as três bordas acusam. Não precisou de troca na cópia, nem de veneno.
 *
 * # O que se escreve: duas janelas, uma fechada e uma aberta — e o instante FORA da do motor
 *
 * O que a prova cala é **"o motor de `fe0c7a1` a `244aae3` (14/09), e o Generate de `5b70e5f` em diante"**. A prova
 * não se toca (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio e depois de hoje**: medidos aqui e no D435, não a cada verde — a trava roda o instante,
 *   os quatro cantos e as três bordas;
 * - **o produto inteiro**: cada eixo com o outro num ponto, e os quatro cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o lugar do fecho**: não foi rodado (a ponta de hoje de cada um, sim);
 * - **os 368 commits do Generate de antes do contrato v1 que não rodaram**: contados pela árvore, não pela ferramenta;
 * - **por que o disco estava em 14/09**: não se mede daqui;
 * - **o que a ferramenta imprime na tela**: a trava pergunta só a prova.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-46/antonina-tres-amostragens.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab46.ts";

/** O Lab: o único commit da prova. */
export const O_RETRATO_DO_LAB46: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "c0b7c5442d74130abcb463eea1b337d3363279a4",
    deOndeSeSabe: "o único commit da prova (`git log`: o LAB-46, 05/10/2026, 00h16 UTC); a ferramenta é a desse commit",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `c0b7c54` refaz a prova byte a byte; em
 * `antes` e em `depois` ela roda e acusa. O do instante (a ponta da origem na hora da prova) fica FORA dela.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueDaAntes: "a ferramenta roda e acusa: 4 linhas, só as aceitas da completa (18 → 15, 20 → 16) — o T03, 14/09, antes do T02",
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueDaDepois:
    "a ferramenta roda e acusa: 16 linhas (o T07, 15/09); e de `38f9943` à ponta de hoje as mesmas 63 linhas do instante",
  oDoInstante: "f581b5a2895390d3d80e78256db40d7ab1dce1b1",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 00h16 UTC de 05/10, a hora da prova — e ele ACUSA (63 linhas: as amostragens de 2 variantes; a completa com as faces não muda): a prova foi feita com um motor de 14/09, a mesma janela da testada do LAB-37 (coerência, não medição)",
} as const;

/**
 * **A janela do Generate**, aberta: do contrato v2 (`primeiro`) à ponta medida a ferramenta refaz a prova byte a
 * byte; em `antes` ela roda e acusa.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimoMedido: "2ba6e5e73a7c6d21626545e6ae152bc76408b586",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes: "a ferramenta roda e acusa: 16 linhas, antes do contrato v2 (02/10) — e as mesmas 16 em todos os 29 commits desde o contrato v1",
  depois: null,
  oDoInstante: "a06befa6192e0361bc7e395ea5f2697b44f2492f",
  oInstanteEstaDentro: true,
} as const;

/**
 * Os commits de primeiro pai que tocam o lugar do fecho, e o que deram. No Generate, dos 371 que não rodam, três
 * rodaram pela ferramenta (os últimos antes do contrato v1) e 368 se contaram pela árvore.
 */
export const OS_COMMITS_RODADOS = {
  motor: { lugar: "src/lib/lab/", commits: 37, rodadosPelaFerramenta: 37, naoRodam: 10, acusamAntes: 3, refazem: 3, acusamDepois: 21 },
  generate: {
    lugar: "src/lib/",
    commits: 439,
    rodadosPelaFerramenta: 71,
    naoRodam: 371,
    naoRodamPelaArvore: 368,
    acusamAntes: 29,
    refazem: 39,
    acusamDepois: 0,
  },
} as const;
