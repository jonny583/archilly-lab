/**
 * **LAB-205 (item 900) · as fixtures do LAB-40 rodam o motor e o Generate e não escrevem o commit de nenhum dos
 * dois — e, medido, o motor que as fez NÃO é o da origem daquele dia: é o de 14/09, como o da testada do LAB-37**
 * (D433).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-40/fixtures.json` foi gravada uma vez só, no LAB-40 (`90a93b2`, 04/10/2026, 17h26 UTC),
 * com carimbo fixo (`geradoEm` escrito à mão). A ferramenta `external-engines/esteira/ferramentas/lab40.ts` (mudada
 * depois no LAB-103 e no LAB-105; a de então é a do `90a93b2`) escreve as duas fixtures que exercem as promessas e
 * mede a testada de frente FORA de Antonina rodando a esteira do Laboratório de Parcelamento — **o motor**
 * (`motor-testfit/src/lib/lab/`) — com o contrato e as regras **do Generate** (`src/lib/`). A prova não escreve
 * commit de nenhum dos dois: o retrato do LAB-198 a dá calando os dois — dois silêncios.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `90a93b2`, a prova comparada **byte a byte**. A ferramenta leva de quatro a dez segundos, então rodaram-se
 * **todos** os commits de primeiro pai que tocam o lugar do fecho em cada vizinho — não os estados.
 *
 * **O instante não refaz a prova.** Com as pontas da origem às 17h26 UTC de 04/10 (motor `0ab380b`, Generate
 * `a06befa`), **11 linhas** mudam — os lotes da testada fora de Antonina nos três partidos, e **o sinal do delta
 * vira**: na prova a testada CUSTA lotes (*680 → 640* na espinha, delta −40); com o motor do instante ela RENDE
 * (*449 → 492*, delta +43). Foi isso que pediu o eixo do motor.
 *
 * **O eixo do motor**, com o Generate do instante — os 37 commits de primeiro pai que tocam `src/lib/lab/`:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `d98b0fe` … `0ece0b1` (10/09), 10 commits | a ferramenta não roda |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | a ferramenta roda e **acusa** — 9 linhas: a testada sai sem plano (`null`) |
 * | **`648ae78` (14/09, T03) · `fe0c7a1` (T02) · `4181e95` · `244aae3` (14/09, o fechamento)** | **igual, byte a byte** |
 * | `2160fce` (15/09, T07) … `3fdb8ca` (11/10), 21 commits, e a ponta de hoje (`cbbe224`) | a ferramenta roda e **acusa** — as **mesmas** 11 linhas do instante, em todos |
 *
 * **O eixo do Generate**, com o motor em `244aae3` — os 439 commits de primeiro pai que tocam `src/lib/`:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `a02644c` (30/06) … `4cd7dc2`, 371 commits | a ferramenta não roda — antes do contrato de motor v1 |
 * | `22502b3` (10/09, o contrato v1) … `8223873` (02/10), 29 commits | a ferramenta roda e **acusa** — as mesmas 9 linhas do motor de antes: a testada sai sem plano |
 * | **`5b70e5f` (02/10, o contrato v2) … `0297934` (16/10, o último que toca `src/lib/`), 39 commits, e a ponta de hoje (`ad6a0c5`)** | **igual, byte a byte** |
 *
 * - **Os quatro cantos** (`648ae78`/`244aae3` × `5b70e5f`/`ad6a0c5`) dão igual: a janela é um retângulo.
 * - **O instante do Generate está dentro da janela dele; o do motor, NÃO** — o mesmo achado do D432, seis horas
 *   depois, no mesmo disco: o motor de 14/09, e o LAB-60 (07/10) declara o disco em `4181e95`, dentro da janela.
 *   **Coerência, não medição.**
 * - **A janela do motor é UM commit mais larga que a do LAB-37**: aqui o T03 (`648ae78`) já refaz; lá ele acusava.
 *   As duas provas juntas estreitam o disco de 04/10 a `fe0c7a1` … `244aae3` — o que cada uma sozinha não diz.
 * - **Os dentes são commits de verdade**: as três bordas acusam. Não precisou de troca na cópia, nem de veneno —
 *   a ferramenta chama `rodarEsteira`, e o instante já mudou a prova.
 *
 * # O que se escreve: duas janelas, uma fechada e uma aberta — e o instante FORA da do motor
 *
 * O que a prova cala é **"o motor de `648ae78` a `244aae3` (14/09), e o Generate de `5b70e5f` em diante"**. A prova
 * não se toca (D182) — e a frase dela que vira com o motor de hoje (*"a testada custa lotes"*) é dita no D433, não
 * corrigida nela.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio e depois de hoje**: medidos aqui e no D433, não a cada verde — a trava roda o instante,
 *   os quatro cantos e as três bordas;
 * - **o produto inteiro**: cada eixo com o outro num ponto, e os quatro cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o lugar do fecho**: não foi rodado (a ponta de hoje de cada um, sim);
 * - **as fixtures que a ferramenta escreve**: saíram iguais em todas as rodadas que rodaram, mas a trava pergunta
 *   só a prova;
 * - **por que o disco estava em 14/09**: não se mede daqui.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-40/fixtures.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab40.ts";

/** O Lab: o único commit da prova. */
export const O_RETRATO_DO_LAB40: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "90a93b252f9e719f78a02b6494c5043135b99f82",
    deOndeSeSabe: "o único commit da prova (`git log`: o LAB-40, 04/10/2026, 17h26 UTC); a ferramenta é a desse commit",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `90a93b2` refaz a prova byte a byte; em
 * `antes` e em `depois` ela roda e acusa. O do instante (a ponta da origem na hora da prova) fica FORA dela.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "648ae78c711d010a94e0fc236382def6afed9b59",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  antes: "66ece910a40b02b4172c2229283f512e8d2c0bb1",
  oQueDaAntes: "a ferramenta roda e acusa: 9 linhas, a testada fora de Antonina sai sem plano (14/09, antes do T03)",
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueDaDepois:
    "a ferramenta roda e acusa: 11 linhas (o T07, 15/09); e as mesmas 11 em todos os 21 commits que tocam `src/lib/lab/` até hoje",
  oDoInstante: "0ab380b8e525ede2e730259509afc1156cc03677",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 17h26 UTC de 04/10, a hora da prova — e ele ACUSA (11 linhas; o delta da testada vira de −40 para +43): a prova foi feita com um motor de 14/09; o LAB-60 (07/10) declara o disco em `4181e95`, dentro da janela (coerência, não medição)",
} as const;

/**
 * **A janela do Generate**, aberta: do contrato v2 (`primeiro`) à ponta medida a ferramenta refaz a prova byte a
 * byte; em `antes` ela roda e acusa (a testada fora de Antonina sai sem plano).
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimoMedido: "ad6a0c5a0cd37808854ed59282e7a4374b35d53f",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes: "a ferramenta roda e acusa: antes do contrato v2 a testada fora de Antonina sai sem plano (as mesmas 9 linhas do motor de antes)",
  depois: null,
  oDoInstante: "a06befa6192e0361bc7e395ea5f2697b44f2492f",
  oInstanteEstaDentro: true,
} as const;

/** Os commits de primeiro pai que tocam o lugar do fecho, rodados, e o que deram. */
export const OS_COMMITS_RODADOS = {
  motor: { lugar: "src/lib/lab/", rodados: 37, naoRodam: 10, acusamAntes: 2, refazem: 4, acusamDepois: 21 },
  generate: { lugar: "src/lib/", rodados: 439, naoRodam: 371, acusamAntes: 29, refazem: 39, acusamDepois: 0 },
} as const;
