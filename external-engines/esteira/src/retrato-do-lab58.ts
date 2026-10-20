/**
 * **LAB-213 (item 900) · os mecanismos das 81 do LAB-58 rodam o motor e o Generate e não escrevem o commit de nenhum
 * dos dois — e, medido, a janela deles é a do LAB-53, HERDADA: fora dela a ferramenta de então não escreve outra
 * prova, ela PARA, porque confere a lista de violações contra a da prova do LAB-53 antes de agrupar** (D441).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-58/mecanismos-das-81.json` foi gravada uma vez só, no LAB-58 (`d8d8a72`, 07/10/2026,
 * 11h01 UTC; o `quando` da raiz diz 10h54), com um `quando` da hora (`new Date()`, na raiz). A ferramenta
 * `external-engines/esteira/ferramentas/lab58.ts` nasceu nesse commit e mudou **uma linha** depois, no LAB-135
 * (`1711bd1`, D363): o `import` de `distanciaSegmento` passou de `@testfit/geo.ts` à porta do adaptador. A de então é a
 * do `d8d8a72`, e é ela que se roda. Ela roda o motor **padrão** da tela unificada (13 arquivos de `src/lib/lab/` e
 * `contrato/` no fecho dos `import`) e o esquema, o Validator e `_testadaDoLote` do Generate (14 arquivos, mais 8 do
 * `zod`), nas cinco glebas originais; **lê** quatro provas do Lab (LAB-53, 54, 50 e 55, do mesmo commit) e **para**
 * (`process.exit(1)`, sem escrever) se a lista de violações que ela mede não for, chave a chave, a da prova do LAB-53.
 * O fecho tem dois arquivos do Symbios (`adapter/src/geo.ts` e `terreno-geo.ts`, TypeScript) e **nenhum `.wasm`**:
 * roda aqui. A prova não escreve commit de nenhum dos dois vizinhos: o retrato do LAB-198 a dá calando os dois — dois
 * silêncios. O relatório do LAB-58 (§7) nomeia os clones do fim da rodada (motor `4181e95`, Generate `5b7e9b4`):
 * **um ponto**, não a janela, e não o instante.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 20/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em `d8d8a72`,
 * `INVARIANTES_EXEMPLOS=100000` (o que o `bun run lab58` do `package.json` põe), a prova comparada **byte a byte, fora
 * o `quando` da raiz**, e a árvore do Lab conferida depois de cada rodada (a lição do LAB-210: a ferramenta não
 * escreveu outro arquivo em nenhuma). De 12 a 35 segundos por rodada; rodaram-se **todos** os commits de primeiro pai
 * que tocam o lugar do fecho no motor (37, com o Generate em `5b7e9b4`, e a ponta de hoje) e, no Generate, os 68 do
 * contrato v1 em diante e os três de antes (com o motor em `4181e95`; os outros 368 de antes contados pela árvore no
 * LAB-211: nenhum tem `src/lib/import/parcelamento-externo.ts`) — e a ponta de hoje.
 *
 * **Fora da janela, a ferramenta não acusa com outra prova: ela PARA**, sem escrever nada, com uma de três mensagens —
 * falta de módulo (`Cannot find module`), o esquema do Generate recusando a saída do motor (*"o esquema recusou a
 * saída"*), ou a lista medida diferente da do LAB-53 (*"a lista de hoje não é a lista do LAB-53"*).
 *
 * **O instante não refaz a prova.** Com as pontas da origem às 11h01 UTC de 07/10 (motor `6cf6396`, Generate
 * `09cd4c0`) a ferramenta para: *"0 só aqui, 52 só lá"* — das 92 violações do LAB-53, 52 não existem (as quatro glebas
 * de fora de Antonina, como no LAB-209). O motor do instante sozinho (Generate `5b7e9b4`) para igual; **o Generate do
 * instante sozinho (motor `4181e95`) também para**: *"1 só aqui, 0 só lá"* — a `testada-ilegal` que o `641addb`
 * (03/10, 14h27) acrescenta em `sintetico-50ha-ondulado`.
 *
 * **O eixo do motor**, com o Generate em `5b7e9b4`:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `d98b0fe` … `0ece0b1` (10/09), 10 commits | para: `Cannot find module` (`@testfit/api.ts`, e no último `@testfit/contrato/tipos.ts`) |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | para: o esquema recusou a saída (*"não tem o bloco `archilly`"*) |
 * | `648ae78` (14/09, T03) | para: a lista não é a do LAB-53 — *"12 só aqui, 25 só lá"* |
 * | **`fe0c7a1` (14/09, T02) · `4181e95` · `244aae3` (14/09)** | **igual, byte a byte (fora o `quando`)** |
 * | `2160fce` (15/09, T07) … `3fdb8ca` (11/10), 21 commits, e a ponta de hoje (`cf77eee`) | para: *"0 só aqui, 52 só lá"* |
 *
 * **O eixo do Generate**, com o motor em `4181e95`:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `19d195f` … `4cd7dc2` (09/09), três rodados (e 368 pela árvore) | para: `Cannot find module` (`@generate/import/parcelamento-externo.ts`) |
 * | `22502b3` (10/09, o contrato v1) … `8223873` (02/10), 29 commits | para: o esquema recusou a saída |
 * | **`5b70e5f` (02/10, o contrato v2) … `49d8e3e` (03/10), 5 commits** | **igual, byte a byte (fora o `quando`)** |
 * | `641addb` (03/10, a `testada-ilegal`) … `0297934` (16/10), 34 commits, e a ponta de hoje (`765afae`) | para: *"1 só aqui, 0 só lá"* |
 *
 * Os quatro cantos (`fe0c7a1`/`244aae3` × `5b70e5f`/`49d8e3e`) e o par do LAB-58 (`4181e95` × `5b7e9b4`) dão igual.
 *
 * - **As duas janelas são EXATAMENTE as do LAB-53 corrigidas pelo LAB-210** (D437, D438), e por construção: a
 *   ferramenta só escreve quando reproduz a lista daquela prova. *Prova que confere outra antes de escrever herda a
 *   janela dela.* O que a medição acrescenta é a contraprova: em nenhum dos 110 estados ela escreveu outra coisa.
 * - **Os dois instantes ficam FORA** — o do motor (o mesmo achado do D432 ao D440: a prova é do motor de 14/09) e o do
 *   Generate (o `641addb` já estava na origem havia quatro dias). Sete provas do mesmo disco: **coerência, não
 *   medição** de que ele ficou parado.
 * - **A tese da prova não se mede fora da janela** — e isso é a ferramenta dizendo, não o retrato: *"as 81 do motor
 *   são seis mecanismos"* depende das 92 do LAB-53, e com o motor do instante (e o de hoje) 52 delas não existem.
 * - **Os dentes são commits de verdade**: as bordas acusam (param), cada uma com a sua mensagem. Não precisou de
 *   troca na cópia, nem de veneno.
 *
 * # O que se escreve: duas janelas fechadas, e os dois instantes FORA
 *
 * O que a prova cala é **"o motor de `fe0c7a1` a `244aae3` (14/09), e o Generate de `5b70e5f` a `49d8e3e` (02 e
 * 03/10)"**. A prova não se toca (D182). A outra prova da pasta, `sabotagem.json`, é ato (as quatro sabotagens das
 * travas do agrupamento), não ferramenta, e não cala vizinho.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio e depois de hoje**: medidos aqui e no D441, não a cada verde — a trava roda o instante, cada
 *   vizinho dele, os quatro cantos, o par do LAB-58, as quatro bordas e uma falta de módulo de cada vizinho;
 * - **o produto inteiro**: cada eixo com o outro num ponto (`5b7e9b4` e `4181e95`), e os quatro cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o lugar do fecho**: não foi rodado (a ponta de hoje de cada um, sim);
 * - **as quatro provas que a ferramenta lê**: são as do `d8d8a72`, lidas da árvore do Lab montada, nunca de hoje;
 * - **o `quando` da raiz**: fica fora da comparação, porque a ferramenta o escreve com a hora da rodada;
 * - **por que o disco estava em 14/09 e em 03/10**: não se mede daqui;
 * - **o que a ferramenta imprime na tela além da mensagem de parada**: a trava pergunta a prova e a mensagem.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-58/mecanismos-das-81.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab58.ts";

/** A variável que o `bun run lab58` do `package.json` põe — a tampa de exemplos do Validator do Generate. */
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

/** As três formas de a ferramenta PARAR sem escrever — o que ela diz, no `stderr` ou no `stdout`. */
export const AS_PARADAS = {
  faltaModulo: "Cannot find module",
  esquema: "o esquema recusou a saída",
  lista: "a lista de hoje não é a lista do LAB-53",
} as const;

/** O Lab: o único commit da prova. */
export const O_RETRATO_DO_LAB58: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "d8d8a72095d24da6b55869fd1ca8223235eabd0d",
    deOndeSeSabe:
      "o único commit da prova (`git log`: o LAB-58, 07/10/2026, 11h01 UTC); a ferramenta nasceu nele e mudou uma linha no LAB-135 (`1711bd1`, o import da porta) — roda-se a de então",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `d8d8a72` refaz a prova byte a byte (fora
 * o `quando`); em `antes` e em `depois` ela para, sem escrever. O do instante (a ponta da origem na hora da prova) fica
 * FORA. `naoRoda` é o último que nem compila o fecho; `recusa`, o T01, que o esquema do Generate recusa.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  oDoLab58: "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueDaAntes: "a ferramenta para: a lista não é a do LAB-53 — 12 só aqui, 25 só lá (o T03, 14/09)",
  aParadaDeAntes: "12 só aqui, 25 só lá",
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueDaDepois:
    "a ferramenta para: a lista não é a do LAB-53 — 0 só aqui, 52 só lá (o T07, 15/09); e o mesmo em todos até a ponta de hoje",
  aParadaDeDepois: "0 só aqui, 52 só lá",
  recusa: "d2f71e48e860650cc2c7a2b841b1c2c2c7fbe3a7",
  naoRoda: "0ece0b1969d9e1cfca8c1c44d1ceb582d69cca9c",
  oDoInstante: "6cf6396dd0af759cffba4006442f1242c2d69888",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 11h01 UTC de 07/10, a hora da prova — e com ela a ferramenta PARA (0 só aqui, 52 só lá: das 92 violações do LAB-53 sobram as 40 de `geo-antonina`): a prova foi feita com um motor de 14/09, a mesma janela do LAB-37, 46, 50, 53, 54 e 55 (coerência, não medição)",
} as const;

/**
 * **A janela do Generate**, fechada: do contrato v2 (`primeiro`) a `ultimo` a ferramenta refaz a prova byte a byte
 * (fora o `quando`); em `antes` ela para (o esquema recusa a saída do motor); em `depois` para (a lista ganha uma
 * `testada-ilegal`). O do instante fica FORA.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimo: "49d8e3e4d6d7c3f6e2daed6ef4fb5f67c5b54996",
  oDoLab58: "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes:
    "a ferramenta para: o esquema recusou a saída — antes do contrato v2 (02/10) o Generate exige o bloco `archilly`; e o mesmo nos 29 commits desde o contrato v1",
  depois: "641addb0d572a833d91583e40848f7c4cf05135b",
  oQueDaDepois:
    "a ferramenta para: a lista não é a do LAB-53 — 1 só aqui, 0 só lá (o piso legal de testada vira invariante, 03/10, 14h27, e `sintetico-50ha-ondulado` ganha uma `testada-ilegal`); o mesmo em todos os 34 até 16/10 e na ponta de hoje",
  aParadaDeDepois: "1 só aqui, 0 só lá",
  naoRoda: "4cd7dc286a146634c31fcf8b2d0f6f1424f17525",
  oDoInstante: "09cd4c0ef4c36cfb87822682716a8f57dbb75f00",
  oInstanteEstaDentro: false,
} as const;

/**
 * Os commits de primeiro pai que tocam o lugar do fecho, e o que deram. Fora da janela, todos PARAM: `naoRodam` é
 * falta de módulo; `paramAntes`, no motor, são o T01 e o merge seguinte (o esquema) e o T03 (a lista); no Generate,
 * os 29 do contrato v1 (o esquema). `paramDepois` é a lista. No Generate, dos 371 que não rodam, três rodaram pela
 * ferramenta (os últimos antes do contrato v1) e 368 se contaram pela árvore (LAB-211).
 */
export const OS_COMMITS_RODADOS = {
  motor: {
    lugar: "src/lib/lab/",
    commits: 37,
    rodadosPelaFerramenta: 37,
    naoRodam: 10,
    paramAntes: 3,
    refazem: 3,
    paramDepois: 21,
  },
  generate: {
    lugar: "src/lib/",
    commits: 439,
    rodadosPelaFerramenta: 71,
    naoRodam: 371,
    naoRodamPelaArvore: 368,
    paramAntes: 29,
    refazem: 5,
    paramDepois: 34,
  },
} as const;
