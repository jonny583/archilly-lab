/**
 * **LAB-204 (item 900) · a testada de frente do LAB-37 roda o motor e o Generate e não escreve o commit de nenhum
 * dos dois — e, medido, o motor que a fez NÃO é o da origem daquele dia: é o de 14/09, três semanas mais velho**
 * (D432).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-37/testada-de-frente.json` foi gravada uma vez só, no LAB-37 (`1ff6335`, 04/10/2026,
 * 11h48 UTC), com carimbo fixo (`geradoEm` escrito à mão). A ferramenta `external-engines/esteira/ferramentas/lab37.ts`
 * (mudada depois no LAB-108; a de então é a do `1ff6335`) roda a esteira do Laboratório de Parcelamento — **o
 * motor** (`motor-testfit`, dezesseis arquivos de `src/lib/lab/` no fecho dos `import`) — e passa o plano pelo
 * contrato e pelas regras **do Generate** (dezessete arquivos de `src/lib/`, `bun build --metafile`). A prova
 * não escreve commit de nenhum dos dois: o retrato do LAB-198 a dá calando os dois — dois silêncios.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `1ff6335`, a prova comparada **byte a byte** (`git diff --quiet`). A ferramenta leva de um a dois minutos.
 *
 * **O instante não refaz a prova.** Com as pontas da origem às 11h48 UTC de 04/10 (motor `a95d03d`, Generate
 * `cae6a2f`), **44 linhas** mudam — as contagens de lotes das duas glebas, em todos os partidos (*1 386 → 1 335*
 * lotes no ortogonal de Antonina, por exemplo). Foi isso que pediu o eixo do motor.
 *
 * **O eixo do motor**, com o Generate do instante — rodados os commits de primeiro pai que tocam `src/lib/lab/`
 * (onde mora o fecho inteiro da ferramenta no motor): os quatro de antes da janela, os três dela e os 21 de depois:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `0ece0b1` (10/09) | a ferramenta não roda — o motor ainda não tem `src/lib/lab/contrato/tipos.ts` |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | a ferramenta roda e **acusa** (6 linhas, as mesmas nos dois) |
 * | `648ae78` (14/09, T03) | a ferramenta roda e **acusa** (a borda de antes) |
 * | **`fe0c7a1` (14/09, T02) · `4181e95` (14/09) · `244aae3` (14/09, o fechamento)** | **igual, byte a byte** |
 * | `2160fce` (15/09, T07) · `ee7c438` (15/09) | a ferramenta roda e **acusa** (44 linhas; um texto diferente em cada) |
 * | `38f9943` (19/09) … a ponta de hoje (`fcbd995`), 19 commits | a ferramenta roda e **acusa** — as **mesmas** 44 linhas do instante, em todos |
 *
 * **O eixo do Generate**, com o motor em `244aae3` — o fecho dos `import` tirado em cada um dos 40 commits de
 * primeiro pai que tocam `src/lib/` de `8223873` à ponta, e os 18 estados distintos do fecho (pelo conteúdo dos
 * arquivos) rodados todos:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `8223873` (02/10) e antes | a ferramenta roda e **acusa** — a segunda gleba (`antonina-com-via`) sai sem plano |
 * | **`5b70e5f` (02/10, o contrato v2) … a ponta de hoje (`735535d`)** | **igual, byte a byte** — os 17 estados |
 *
 * - **Os quatro cantos** (o começo e o fim de cada janela, juntos) dão igual: a janela é um retângulo.
 * - **O instante do Generate está dentro da janela dele; o do motor, NÃO.** A prova foi feita com um motor que
 *   a origem tinha deixado para trás havia três semanas — e é o que o LAB-60 (07/10) declara do disco: o motor
 *   em `4181e95`, dentro desta janela. **Coerência, não medição**: a ferramenta não distingue os três commits da
 *   janela, e qual era o do disco no dia 04/10 nenhuma régua acha.
 * - **Os dentes são commits de verdade**: as três bordas acusam (o motor andou, e o Generate de antes do v2 não
 *   planta a gleba com via desenhada). Não precisou de troca na cópia.
 *
 * # O que se escreve: duas janelas, uma fechada e uma aberta — e o instante FORA da do motor
 *
 * O que a prova cala é **"o motor de `fe0c7a1` a `244aae3` (14/09), e o Generate de `5b70e5f` em diante"**. Ao
 * contrário do D430 e do D431, a coerência com o instante **falha** num eixo, e isso se escreve como achado: a
 * prova de 04/10 descreve o motor de 14/09. A prova não se toca (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio e depois de hoje**: medidos aqui e no D432, não a cada verde — a trava roda o instante,
 *   os quatro cantos e as três bordas;
 * - **o produto inteiro**: cada eixo com o outro num ponto, e os quatro cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o fecho**: não foi rodado; refaz pelo mesmo conteúdo do fecho;
 * - **por que o disco estava em 14/09**: não se mede daqui.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-37/testada-de-frente.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab37.ts";

/** O Lab: o único commit da prova. */
export const O_RETRATO_DO_LAB37: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "1ff6335120d1dbdc296f9a0670bc909848b5faf0",
    deOndeSeSabe: "o único commit da prova (`git log`: o LAB-37, 04/10/2026, 11h48 UTC); a ferramenta é a desse commit",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `1ff6335` refaz a prova byte a byte; em
 * `antes` e em `depois` ela roda e acusa. O do instante (a ponta da origem na hora da prova) fica FORA dela.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueDaAntes: "a ferramenta roda e acusa (o T03, 14/09)",
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueDaDepois: "a ferramenta roda e acusa: 44 linhas (o T07, 15/09); e acusa em todos os 21 commits que tocam `src/lib/lab/` até hoje",
  oDoInstante: "a95d03d82c10188f5afaab21379b700363ea8b1b",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 11h48 UTC de 04/10, a hora da prova — e ele ACUSA: a prova foi feita com um motor de 14/09; o LAB-60 (07/10) declara o disco em `4181e95`, dentro da janela (coerência, não medição)",
} as const;

/**
 * **A janela do Generate**, aberta: do contrato v2 (`primeiro`) à ponta medida a ferramenta refaz a prova byte a
 * byte; em `antes` ela roda e acusa (a gleba com via desenhada sai sem plano).
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimoMedido: "735535d4ba00dc0e31c57bd74396faeeb20821af",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes: "a ferramenta roda e acusa: antes do contrato v2 a gleba `antonina-com-via` sai sem plano",
  depois: null,
  oDoInstante: "cae6a2ff1cd6e263a55c636ae1b59d8aca099aa5",
  oInstanteEstaDentro: true,
  /** Os estados distintos do fecho rodados (pelo conteúdo dos arquivos), e quantos refazem. */
  estadosRodados: 18,
  estadosQueRefazem: 17,
} as const;

/** Os commits de primeiro pai do motor que tocam `src/lib/lab/`, rodados com o Generate do instante, e quantos refazem. */
export const OS_COMMITS_DO_MOTOR = { rodados: 28, refazem: 3, depoisDaJanela: 21 } as const;
