/**
 * **LAB-209 (item 900) · a aferição do LAB-53 roda o motor e o Generate e não escreve o commit de nenhum dos dois —
 * e, medido, as DUAS pontas da origem daquela hora ficam FORA: a prova é do motor de 14/09 e do Generate de 02 e
 * 03/10** (D437, corrigido no LAB-210, D438).
 *
 * # Corrigido no LAB-210 (D438): a ilha do motor e o Generate do contrato v1 eram a ferramenta gravando NOUTRO ARQUIVO
 *
 * O LAB-209 escreveu uma *ilha* do motor (`d2f71e4`, `66ece91`) e a janela do Generate começando no contrato v1
 * (`22502b3`). As duas eram artefato da comparação: a ferramenta escolhe o destino pela MEDIÇÃO da ponte
 * (`ponteConsertada`, LAB-53) — com o motor do T01 ou com o Generate do contrato v1 a ponte se mede como NÃO
 * consertada, e ela grava `LAB-48/violacoes-do-motor-padrao.json`, sem tocar a prova. A trava comparava só o arquivo
 * da prova, antes e depois: intocado, saía *"igual, byte a byte"*. **Arquivo que a ferramenta não escreveu não foi
 * refeito.** Medido de novo no disparo de ≤ 05:06, com o outro destino vigiado: nos 2 commits da ilha e nos 29 do
 * contrato v1 (`22502b3` … `8223873`) a ferramenta roda e grava `LAB-48/`; a prova só se refaz de `5b70e5f` (o
 * contrato v2) a `49d8e3e`. A trava agora exige que a ferramenta TENHA ESCRITO a prova para dizer *"igual"*, e confere
 * o outro destino. O que segue no texto é o do LAB-209, corrigido onde a ilha e o contrato v1 apareciam.
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-53/violacoes-depois-do-conserto-da-ponte.json` foi gravada uma vez só, no LAB-53
 * (`e1fbe61`, 07/10/2026, 03h21 UTC), com um `quando` da hora (`new Date()`, na raiz). A ferramenta
 * `external-engines/esteira/ferramentas/lab48.ts` (a do LAB-48, que o LAB-53 mudou para gravar o *"depois"* noutro
 * arquivo, e nunca mais mudou: a de então é a de hoje) roda o motor **padrão** da tela unificada — **o motor**
 * (`motor-testfit/src/lib/lab/`, 16 arquivos no fecho dos `import` do `e1fbe61` com o motor do instante) — e passa cada plano pelo Validator
 * **do Generate** (`engine/`, `engine/espinha/`, `contratos/motor-v1/`, `normas/`, `import/`: 18 arquivos), nas cinco
 * glebas originais. O fecho tem dois arquivos do Symbios (`adapter/src/geo.ts` e `terreno-geo.ts`, TypeScript) e
 * **nenhum `.wasm`**: roda aqui. A prova não escreve commit de nenhum dos dois: o retrato do LAB-198 a dá calando os
 * dois — dois silêncios. O relatório do LAB-53 (§5) nomeia os clones conferidos ao fim da rodada (motor `4181e95`,
 * Generate `5b7e9b4`), e o LAB-197 (`src/fotografia-do-lab48.ts`) já roda a ferramenta de hoje neles e acha esta
 * prova igual: **um ponto**, não a janela, e não o instante.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 20/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em `e1fbe61`,
 * `INVARIANTES_EXEMPLOS=100000` (a ferramenta recusa medir *"uma a uma"* com a tampa de exemplos baixa), a prova
 * comparada **byte a byte, fora o `quando` da raiz**. Cada rodada leva de 10 a 40 segundos; rodaram-se **todos** os
 * commits de primeiro pai que tocam o lugar do fecho no motor (37, com o Generate em `5b7e9b4`) e no Generate (os 68
 * do contrato v1 em diante e os três de antes, com o motor em `4181e95`; os outros 368 de antes contados pela árvore:
 * nenhum tem `src/lib/contratos/motor-v1/traducao.ts`) — e as duas pontas de hoje.
 *
 * **O instante não refaz a prova.** Com as pontas da origem às 03h21 UTC de 07/10 (motor `3e306d1`, Generate
 * `ad17a7e`), **1 127 linhas** mudam: das 92 violações da prova sobram **40**, todas em `geo-antonina` (29 `frente` e
 * 11 `via-sobre-lote`, iguais às da prova) — as outras quatro glebas saem com **zero**, e com outras variantes e
 * outras contagens de lote. **Os dois vizinhos do instante estão FORA das janelas deles**: o motor acusa sozinho (com
 * o Generate em `5b7e9b4`, as mesmas 1 127 linhas) e o Generate também (com o motor em `4181e95`, 20 linhas: uma
 * `testada-ilegal` em `sintetico-50ha-ondulado`, 92 → 93).
 *
 * **O eixo do motor**, com o Generate em `5b7e9b4` — os 37 commits de primeiro pai que tocam `src/lib/lab/`:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `d98b0fe` … `0ece0b1` (10/09), 10 commits | a ferramenta não roda (falta módulo) |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | a ferramenta roda e **grava noutro arquivo** (`LAB-48/`): a ponte se mede como não consertada, e a prova fica intocada — era a *ilha* do LAB-209 (D438) |
 * | `648ae78` (14/09, T03) | a ferramenta roda e **acusa** — 482 linhas (`completo` sai pela variante `loop`: 79 violações) |
 * | **`fe0c7a1` (14/09, T02) · `4181e95` · `244aae3` (14/09, o fechamento)** | **igual, byte a byte (fora o `quando`)** |
 * | `2160fce` (15/09, T07): 1 057 linhas; `ee7c438` … `3fdb8ca` (11/10), 20 commits, e a ponta de hoje (`d483aed`): as **mesmas** 1 127 linhas do instante | a ferramenta roda e **acusa** |
 *
 * **O eixo do Generate**, com o motor em `4181e95` — os 439 commits de primeiro pai que tocam `src/lib/`:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `a02644c` (30/06) … `4cd7dc2` (09/09), 371 commits | a ferramenta não roda — antes do contrato de motor v1 (três rodados; 368 pela árvore) |
 * | `22502b3` (10/09, o contrato v1) … `8223873` (02/10), 29 commits | a ferramenta roda e **grava noutro arquivo** (`LAB-48/`): com o contrato v1 a ponte se mede como não consertada, e a prova fica intocada — o LAB-209 os contava como *"igual"* (D438) |
 * | **`5b70e5f` (02/10, o contrato v2) … `49d8e3e` (03/10, 14h24, o raio mínimo da via principal), 5 commits — e o `5b7e9b4`, o clone do LAB-53, entre eles** | **igual, byte a byte (fora o `quando`)** |
 * | `641addb` (03/10, 14h27, o piso legal de testada vira invariante) … `0297934` (16/10), 34 commits, e a ponta de hoje (`92ba2a1`) | a ferramenta roda e **acusa** — 20 linhas, a `testada-ilegal` nova |
 *
 * - **A janela do motor NÃO tem buraco** (D438): o que o LAB-209 leu como ilha antes do T03 é a ferramenta gravando
 *   `LAB-48/`. A janela é o pedaço de 14/09 (`fe0c7a1` … `244aae3`, a mesma do LAB-37, 46 e 50), com o clone que o
 *   LAB-53 conferiu (`4181e95`) dentro. *Arquivo que a ferramenta não escreveu não foi refeito.*
 * - **O instante fica fora nos DOIS eixos** — pela primeira vez na série (no LAB-37, 40, 46 e 50 o Generate do
 *   instante estava dentro). A prova é de 03h10 de 07/10, e o Generate que a fez é anterior a 03/10, 14h27: **os
 *   clones do disco estavam velhos nos dois**, e o relatório do LAB-53 os nomeia (`4181e95`, `5b7e9b4`) — o que
 *   aqui é medição: os dois estão dentro.
 * - **A frase da prova não sobrevive às pontas de hoje.** *"As 92 continuam não aprovando gleba nenhuma"* (LAB-53 §5):
 *   com o motor `d483aed` e o Generate `92ba2a1` são **40**, todas de `geo-antonina`, e quatro glebas saem com zero.
 *   O que sobrevive é `geo-antonina`, igual (33 lotes, 29 `frente`, 11 `via-sobre-lote`).
 * - **Os dentes são commits de verdade**: as bordas do motor e a de depois do Generate acusam; a de antes do
 *   Generate (`8223873`) e a ponta do T01 (`66ece91`) **gravam noutro arquivo**; e antes delas a ferramenta não roda
 *   (falta módulo: `0ece0b1` no motor, `4cd7dc2` no Generate). Não precisou de troca na cópia, nem de veneno.
 *
 * # O que se escreve: duas janelas fechadas — e os dois instantes FORA
 *
 * O que a prova cala é **"o motor de `fe0c7a1` a `244aae3` (14/09) e o Generate de `5b70e5f` a `49d8e3e` (02 e
 * 03/10)"** (D438; o LAB-209 escreveu também a ilha do T01 e o Generate desde `22502b3`). A prova não se toca (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio e depois de hoje**: medidos aqui e no D437, não a cada verde — a trava roda o instante, os
 *   quatro cantos, as quatro bordas, as duas pontas do que grava noutro arquivo e as duas faltas de módulo;
 * - **o produto inteiro**: cada eixo com o outro num ponto (`5b7e9b4` e `4181e95`), e os cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o lugar do fecho**: não foi rodado (a ponta de hoje de cada um, sim);
 * - **os 368 commits do Generate de antes do contrato v1 que não rodaram**: contados pela árvore, não pela ferramenta;
 * - **o que a ferramenta grava em `LAB-48/` quando a ponte se mede como não consertada**: a trava confere que ela
 *   NÃO toca a prova e que escreve lá, não o que escreve — essa é a pergunta de `src/fotografia-do-lab48.ts`;
 * - **o `quando` da raiz**: fica fora da comparação, porque a ferramenta o escreve com a hora da rodada;
 * - **por que o disco estava velho**: não se mede daqui;
 * - **o que a ferramenta imprime na tela**: a trava pergunta só a prova.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-53/violacoes-depois-do-conserto-da-ponte.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab48.ts";

/** A variável sem a qual a ferramenta recusa medir — a tampa de exemplos do Validator do Generate. */
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
export const O_RETRATO_DO_LAB53: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "e1fbe61f2e7ed8b5a79bc08d833e724f17b0179b",
    deOndeSeSabe: "o único commit da prova (`git log`: o LAB-53, 07/10/2026, 03h21 UTC); a ferramenta é a desse commit, e a de hoje",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `e1fbe61` refaz a prova byte a byte (fora
 * o `quando`); em `antes` e em `depois` ela roda e acusa. O do instante (a ponta da origem na hora da prova) fica FORA.
 * Antes da borda de antes, a ferramenta grava noutro arquivo e depois não roda ({@link O_QUE_GRAVA_NOUTRO}).
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  oDoLab53: "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueDaAntes: "a ferramenta roda e acusa: 482 linhas — o T03, 14/09 (`completo` pela variante `loop`, 79 violações)",
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueDaDepois:
    "a ferramenta roda e acusa: 1 057 linhas (o T07, 15/09); e de `ee7c438` à ponta de hoje as mesmas 1 127 linhas do instante",
  oDoInstante: "3e306d12a6fc662e10491aacddc438ebd0e2c0cf",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 03h21 UTC de 07/10, a hora da prova — e ele ACUSA (1 127 linhas: das 92 violações sobram as 40 de `geo-antonina`, e as outras quatro glebas saem com zero): a prova foi feita com um motor de 13 ou 14/09",
} as const;

/** O outro destino da mesma ferramenta, quando a ponte se mede como não consertada, relativo a `docs/provas/`. */
export const O_OUTRO_DESTINO = "LAB-48/violacoes-do-motor-padrao.json";

/**
 * **O que grava noutro arquivo** (LAB-210, D438 — a *ilha* e o começo do Generate do LAB-209): de `primeiro` a `ultimo`
 * a ferramenta roda, mede a ponte como não consertada e grava {@link O_OUTRO_DESTINO}, sem tocar a prova. Antes de
 * `primeiro` (`naoRoda`), ela não roda: falta módulo.
 */
export const O_QUE_GRAVA_NOUTRO = {
  motor: {
    primeiro: "d2f71e48e860650cc2c7a2b841b1c2c2c7fbe3a7",
    ultimo: "66ece910a40b02b4172c2229283f512e8d2c0bb1",
    naoRoda: "0ece0b1969d9e1cfca8c1c44d1ceb582d69cca9c",
    oQueDaNaoRoda: "a ferramenta não roda — falta módulo do motor (10/09)",
  },
  generate: {
    primeiro: "22502b380cfd2e58c7190707b9b3e57bb42b9155",
    ultimo: "8223873a05794411521ac3f4b13e46758ccf6627",
    naoRoda: "4cd7dc286a146634c31fcf8b2d0f6f1424f17525",
    oQueDaNaoRoda: "a ferramenta não roda — antes do contrato de motor v1 (09/09), falta `@generate/import/parcelamento-externo.ts`",
  },
  aMarcaDaQueda: "Cannot find module",
} as const;

/**
 * **A janela do Generate**, fechada: do contrato v2 (`primeiro`) a `ultimo` a ferramenta refaz a prova byte a byte
 * (fora o `quando`); em `antes` ela roda e grava noutro arquivo (com o contrato v1 a ponte se mede como não
 * consertada); em `depois` roda e acusa. O do instante fica FORA. (O LAB-209 escreveu `primeiro` no contrato v1 e
 * `antes` onde não roda — D438.)
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimo: "49d8e3e4d6d7c3f6e2daed6ef4fb5f67c5b54996",
  oDoLab53: "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes:
    "a ferramenta roda e grava noutro arquivo (`LAB-48/`), sem tocar a prova: com o contrato v1 a ponte se mede como não consertada — e o mesmo nos 29 commits desde o contrato v1",
  depois: "641addb0d572a833d91583e40848f7c4cf05135b",
  oQueDaDepois:
    "a ferramenta roda e acusa: 20 linhas — o piso legal de testada vira invariante (03/10, 14h27), e `sintetico-50ha-ondulado` ganha uma `testada-ilegal` (92 → 93); o mesmo em todos os 34 até 16/10 e na ponta de hoje",
  oDoInstante: "ad17a7e4e6834bd2d1d432301c65c38ee403d389",
  oInstanteEstaDentro: false,
} as const;

/**
 * Os commits de primeiro pai que tocam o lugar do fecho, e o que deram. `naoRodam` é falta de módulo; `gravamNoutro`
 * é a ferramenta rodar e escrever `LAB-48/`, sem tocar a prova (no LAB-209, `refazemNaIlha` no motor e parte de
 * `refazem` no Generate — D438). No Generate, dos 371 que não rodam, três rodaram pela ferramenta (os
 * últimos antes do contrato v1) e 368 se contaram pela árvore.
 */
export const OS_COMMITS_RODADOS = {
  motor: {
    lugar: "src/lib/lab/",
    commits: 37,
    rodadosPelaFerramenta: 37,
    naoRodam: 10,
    gravamNoutro: 2,
    acusamAntes: 1,
    refazem: 3,
    acusamDepois: 21,
  },
  generate: {
    lugar: "src/lib/",
    commits: 439,
    rodadosPelaFerramenta: 71,
    naoRodam: 371,
    naoRodamPelaArvore: 368,
    gravamNoutro: 29,
    acusamAntes: 0,
    refazem: 5,
    acusamDepois: 34,
  },
} as const;
