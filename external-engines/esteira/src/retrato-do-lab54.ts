/**
 * **LAB-211 (item 900) · a atribuição das `frente` do LAB-54 roda o motor e o Generate e não escreve o commit de
 * nenhum dos dois — e, medido, o motor que a fez NÃO é o da origem daquela hora: é o de 14/09, a MESMA janela do
 * LAB-37, 46, 50 e 53; e as 27 `frente` de fora de Antonina, que são a tese da prova, NÃO existem com o motor do
 * instante nem com o de hoje** (D439).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-54/frente-nao-atribuida.json` foi gravada uma vez só, no LAB-54 (`b42634f`, 07/10/2026,
 * 04h31 UTC; o `quando` da raiz diz 04h25), com um `quando` da hora (`new Date()`, na raiz). A ferramenta
 * `external-engines/esteira/ferramentas/lab54.ts` nasceu nesse commit e **nunca mais mudou: a de então é a de hoje**.
 * Ela roda o motor **padrão** da tela unificada — **o motor** (`motor-testfit/src/lib/lab/` e `contrato/`, 13 arquivos
 * no fecho dos `import` do `b42634f` com o motor do LAB-54) — e passa cada plano pelo `_testadaDoLote` **do Generate**
 * (`engine/`, `engine/espinha/`, `contratos/motor-v1/`, `normas/`, `import/`: 14 arquivos, mais o `zod`), densificando
 * o polígono para perguntar POR QUE a função dele devolve zero, nas cinco glebas originais. O fecho tem dois arquivos
 * do Symbios (`adapter/src/geo.ts` e `terreno-geo.ts`, TypeScript) e **nenhum `.wasm`**: roda aqui. A prova não escreve
 * commit de nenhum dos dois: o retrato do LAB-198 a dá calando os dois — dois silêncios. O relatório do LAB-54 (§6)
 * nomeia os clones do fim da rodada (motor `4181e95`, Generate `5b7e9b4`): **um ponto**, não a janela, e não o
 * instante.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 20/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em `b42634f`,
 * `INVARIANTES_EXEMPLOS=100000` (o que o `bun run lab54` do `package.json` põe), a prova comparada **byte a byte, fora
 * o `quando` da raiz**. Cada rodada leva perto de 12 segundos; rodaram-se **todos** os commits de primeiro pai que
 * tocam o lugar do fecho no motor (37, com o Generate em `5b7e9b4`) e, no Generate, os 68 do contrato v1 em diante e
 * os três de antes (com o motor em `4181e95`; os outros 368 de antes contados pela árvore: nenhum tem
 * `src/lib/import/parcelamento-externo.ts`, que a ferramenta importa) — e as duas pontas de hoje.
 *
 * **O instante não refaz a prova.** Com as pontas da origem às 04h31 UTC de 07/10 (motor `332bf91`, Generate
 * `7330cc7`), **717 linhas** mudam (as do `diff` sem a do `quando`): **as quatro glebas de fora de Antonina saem com
 * ZERO `frente`** — a prova diz 23, 3, 1 e 0 —, com outras variantes e contagens de lote (`completo` ortogonal 983,
 * `sintetico-50ha-ondulado` ortogonal 473, `sintetico-10ha-plano` espinha 120, `ensaio-47ha` espinha 450); o total cai
 * de 56 para 29. **`geo-antonina` sai igual** (33 lotes, 29 `frente`: 22 `motor-sem-via-perto`, 7
 * `regua-amostragem-no-meio-da-aresta`). O motor do instante acusa sozinho (com o Generate em `5b7e9b4`, as mesmas
 * 717 linhas); o Generate do instante, sozinho (com o motor em `4181e95`), refaz.
 *
 * **O eixo do motor**, com o Generate em `5b7e9b4` — os 37 commits de primeiro pai que tocam `src/lib/lab/`:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `d98b0fe` … `0ece0b1` (10/09), 10 commits | a ferramenta não roda (falta módulo: `@testfit/api.ts`, e no último `@testfit/contrato/tipos.ts`) |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | a ferramenta roda e **acusa** — 1 457 linhas: o Generate recusa o plano pelo esquema nas cinco glebas (*"não tem o bloco `archilly`"*) |
 * | `648ae78` (14/09, T03) | a ferramenta roda e **acusa** — 497 linhas (`completo` pela variante `loop`, 1 025 lotes, 11 `frente`) |
 * | **`fe0c7a1` (14/09, T02) · `4181e95` · `244aae3` (14/09, o fechamento)** | **igual, byte a byte (fora o `quando`)** |
 * | `2160fce` (15/09, T07): 715 linhas; `ee7c438` … `3fdb8ca` (11/10), 20 commits, e a ponta de hoje (`3eab85f`): as **mesmas** 717 linhas do instante | a ferramenta roda e **acusa** |
 *
 * **O eixo do Generate**, com o motor em `4181e95` — os 439 commits de primeiro pai que tocam `src/lib/`:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `a02644c` (30/06) … `4cd7dc2` (09/09), 371 commits | a ferramenta não roda — falta `@generate/import/parcelamento-externo.ts` (três rodados; 368 pela árvore) |
 * | `22502b3` (10/09, o contrato v1) … `8223873` (02/10), 29 commits | a ferramenta roda e **acusa** — 1 457 linhas: o Generate recusa o plano pelo esquema nas cinco glebas |
 * | **`5b70e5f` (02/10, o contrato v2) … `0297934` (16/10, o último que toca `src/lib/`), 39 commits, e a ponta de hoje (`c4edb50`)** | **igual, byte a byte (fora o `quando`)** |
 *
 * - **O instante do Generate está dentro da janela dele; o do motor, NÃO** — o mesmo achado do D432, D433, D435,
 *   D436, D437 e D438, agora às 04h31 de 07/10, uma hora depois do LAB-53: o motor de 14/09. **A janela do motor é a MESMA**
 *   (`fe0c7a1` … `244aae3`; o T03 acusa, como lá). Cinco provas do mesmo disco (LAB-37, 40, 46, 50, 53) e esta, a
 *   sexta: **coerência, não medição** de que o disco ficou parado.
 * - **Sem ilha.** O T01 e o merge seguinte (`d2f71e4`, `66ece91`) acusam: o motor deles ainda escreve o plano sem o
 *   bloco `archilly`, e esta ferramenta passa o plano pelo esquema do Generate antes de medir. (A ilha do LAB-53 também
 *   não era: era a `lab48.ts` gravando noutro arquivo, D438. A `lab54.ts` tem UM destino só, escrito sempre — e a
 *   trava confere que ela o escreveu: o `quando` novo.)
 * - **A janela do Generate é a do LAB-53 corrigida** (D438): do contrato v2 (`5b70e5f`) em diante. Aqui ela não fecha
 *   em `641addb`, porque esta ferramenta pergunta só as `frente`, e a `testada-ilegal` nova não mexe nelas.
 * - **A tese da prova não sobrevive ao instante — nem às pontas de hoje.** *"As 27 `frente` atribuídas: 23 do motor,
 *   4 da régua"* (LAB-54 §0) fala das quatro glebas de fora de Antonina; com o motor `332bf91` (o do instante) e com o
 *   `3eab85f` (o de hoje) elas saem com **zero** `frente`. O que sobrevive, inteiro, é `geo-antonina` (22 do motor, 7
 *   da régua, e o saldo: os 7 trocam de etiqueta, zero somem). As pontas de hoje dão **a mesma prova do instante**,
 *   byte a byte fora o `quando`.
 * - **Os dentes são commits de verdade**: as bordas do motor acusam, e a de antes do Generate também (recusa pelo
 *   esquema). Não precisou de troca na cópia, nem de veneno.
 *
 * # O que se escreve: duas janelas, uma fechada e uma aberta — e o instante FORA da do motor
 *
 * O que a prova cala é **"o motor de `fe0c7a1` a `244aae3` (14/09), e o Generate de `5b70e5f` em diante"**. A prova
 * não se toca (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio e depois de hoje**: medidos aqui e no D439, não a cada verde — a trava roda o instante, cada
 *   vizinho dele, os quatro cantos, o clone do LAB-54 e as três bordas;
 * - **o produto inteiro**: cada eixo com o outro num ponto (`5b7e9b4` e `4181e95`), e os quatro cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o lugar do fecho**: não foi rodado (a ponta de hoje de cada um, sim);
 * - **os 368 commits do Generate de antes do contrato v1 que não rodaram**: contados pela árvore, não pela ferramenta;
 * - **o `quando` da raiz**: fica fora da comparação, porque a ferramenta o escreve com a hora da rodada;
 * - **por que o disco estava em 14/09**: não se mede daqui;
 * - **o que a ferramenta imprime na tela**: a trava pergunta só a prova.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-54/frente-nao-atribuida.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab54.ts";

/** A variável que o `bun run lab54` do `package.json` põe — a tampa de exemplos do Validator do Generate. */
export const O_AMBIENTE = { INVARIANTES_EXEMPLOS: "100000" } as const;

/** O que a comparação deixa de fora: o carimbo da hora, que a ferramenta escreve com `new Date()`, só na raiz. */
export const FORA_DA_COMPARACAO = ["quando"] as const;

/**
 * O texto da prova sem a linha do `quando` da RAIZ (dois espaços de recuo, como o `JSON.stringify(…, null, 2)` da
 * ferramenta escreve). Um `quando` mais fundo fica, e conta.
 */
export function semOQuandoDaRaiz(texto: string): string {
  return texto.replace(/^ {2}"quando": "[^"]*",\n/m, "");
}

/** O Lab: o único commit da prova. */
export const O_RETRATO_DO_LAB54: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "b42634f90b5f3a3a822643e239c9c884bb3b383d",
    deOndeSeSabe: "o único commit da prova (`git log`: o LAB-54, 07/10/2026, 04h31 UTC); a ferramenta nasceu nele e é a de hoje",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `b42634f` refaz a prova byte a byte (fora
 * o `quando`); em `antes` e em `depois` ela roda e acusa. O do instante (a ponta da origem na hora da prova) fica FORA.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  oDoLab54: "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueDaAntes: "a ferramenta roda e acusa: 497 linhas — o T03, 14/09 (`completo` pela variante `loop`, 1 025 lotes, 11 `frente`)",
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueDaDepois:
    "a ferramenta roda e acusa: 715 linhas (o T07, 15/09); e de `ee7c438` à ponta de hoje as mesmas 717 linhas do instante",
  oDoInstante: "332bf91e0187428c847459dd96f4d6da447b5acc",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 04h31 UTC de 07/10, a hora da prova — e ele ACUSA (717 linhas: as quatro glebas de fora de Antonina saem com ZERO `frente`, a prova diz 23, 3, 1 e 0; `geo-antonina` igual): a prova foi feita com um motor de 14/09, a mesma janela do LAB-37, 46, 50 e 53 (coerência, não medição)",
} as const;

/**
 * **A janela do Generate**, aberta: do contrato v2 (`primeiro`) à ponta medida a ferramenta refaz a prova byte a
 * byte (fora o `quando`); em `antes` ela roda e acusa — o Generate recusa o plano pelo esquema nas cinco glebas.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimoMedido: "c4edb50c85e33e9b67a3b83f2135f3a884302fa9",
  oDoLab54: "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes:
    "a ferramenta roda e acusa: 1 457 linhas — antes do contrato v2 (02/10) o Generate recusa o plano pelo esquema nas cinco glebas; e o mesmo em todos os 29 commits desde o contrato v1",
  aMarcaDaRecusa: "recusadoPeloEsquema",
  depois: null,
  oDoInstante: "7330cc72ca940951979aecccbad162f573813fcf",
  oInstanteEstaDentro: true,
} as const;

/**
 * Os commits de primeiro pai que tocam o lugar do fecho, e o que deram. `naoRodam` é falta de módulo; `acusamAntes`,
 * no motor, são o T01, o merge seguinte (recusa pelo esquema) e o T03; no Generate, os 29 do contrato v1 (recusa pelo
 * esquema). No Generate, dos 371 que não rodam, três rodaram pela ferramenta (os últimos antes do contrato v1) e 368
 * se contaram pela árvore.
 */
export const OS_COMMITS_RODADOS = {
  motor: {
    lugar: "src/lib/lab/",
    commits: 37,
    rodadosPelaFerramenta: 37,
    naoRodam: 10,
    acusamAntes: 3,
    refazem: 3,
    acusamDepois: 21,
  },
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
