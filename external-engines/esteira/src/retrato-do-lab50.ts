/**
 * **LAB-208 (item 900) · a passagem externa do LAB-50 roda o motor e o Generate e não escreve o commit de nenhum dos
 * dois — e, medido, o motor que a fez NÃO é o da origem daquela hora: é o de 14/09, a MESMA janela do LAB-37 e do
 * LAB-46** (D436).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-50/passagem-externa.json` foi gravada uma vez só, no LAB-50 (`846b955`, 06/10/2026, 22h17
 * UTC), com um `quando` da hora (`new Date()`, na raiz). A ferramenta `external-engines/esteira/ferramentas/lab50.ts`
 * (mudada depois só no LAB-143, que trocou o hectare pelo metro quadrado; a de então é a do `846b955`) roda a esteira
 * do Laboratório de Parcelamento — **o motor** (`motor-testfit/src/lib/lab/`, 14 arquivos no fecho dos `import`) —
 * com o contrato e as regras **do Generate** (`src/lib/contratos/motor-v1/`, `engine/`, `import/`, `normas/`: 18
 * arquivos) em `geo-antonina` e `ensaio-com-testada`, e põe à prova as quatro previsões da passagem externa. A prova
 * não escreve commit de nenhum dos dois: o retrato do LAB-198 a dá calando os dois — dois silêncios.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 20/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em `846b955`,
 * a prova comparada **byte a byte, fora o `quando` da raiz**. A ferramenta leva perto de 20 segundos; rodaram-se
 * **todos** os commits de primeiro pai que tocam o lugar do fecho no motor (37) e, no Generate, os 68 do contrato v1
 * em diante e os três de antes (os outros 368 de antes contados pela árvore: nenhum tem
 * `src/lib/contratos/motor-v1/traducao.ts`, que a ferramenta importa) — e as duas pontas de hoje.
 *
 * **O instante não refaz a prova.** Com as pontas da origem às 22h17 UTC de 06/10 (motor `9336985`, Generate
 * `ad17a7e`), **226 linhas** mudam — todas em `ensaio-com-testada` (51 → 54 lotes externos, 9 → 21 sobre leito de
 * via, o teto de P1 35,4 → 26,7 m) e nos nomes das vias culpadas de `geo-antonina` (V2 → V3, V10 → V12). **Em
 * `geo-antonina` os 33 lotes saem iguais, um a um, e as quatro previsões dão o mesmo veredicto nas duas glebas.**
 *
 * **O eixo do motor**, com o Generate do instante — os 37 commits de primeiro pai que tocam `src/lib/lab/`:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `d98b0fe` … `0ece0b1` (10/09), 10 commits | a ferramenta não roda (falta módulo) |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | a ferramenta roda e **cai**: o motor não entrega plano (`saida` nula) |
 * | `648ae78` (14/09, T03) | a ferramenta roda e **acusa** — 14 linhas |
 * | **`fe0c7a1` (14/09, T02) · `4181e95` · `244aae3` (14/09, o fechamento)** | **igual, byte a byte (fora o `quando`)** |
 * | `2160fce` (15/09, T07): 220 linhas; `ee7c438` … `3fdb8ca` (11/10), 20 commits, e a ponta de hoje (`4c60ec7`): as **mesmas** 226 linhas do instante | a ferramenta roda e **acusa** |
 *
 * **O eixo do Generate**, com o motor em `244aae3` — os 439 commits de primeiro pai que tocam `src/lib/`:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `a02644c` (30/06) … `4cd7dc2` (09/09), 371 commits | a ferramenta não roda — antes do contrato de motor v1 (três rodados; 368 pela árvore) |
 * | `22502b3` (10/09, o contrato v1) … `8223873` (02/10), 29 commits | a ferramenta roda e **cai**: o motor não entrega plano (`saida` nula) |
 * | **`5b70e5f` (02/10, o contrato v2) … `0297934` (16/10, o último que toca `src/lib/`), 39 commits, e a ponta de hoje (`8ca421a`)** | **igual, byte a byte (fora o `quando`)** |
 *
 * - **Os quatro cantos** (`fe0c7a1`/`244aae3` × `5b70e5f`/`8ca421a`) dão igual: a janela é um retângulo.
 * - **O instante do Generate está dentro da janela dele; o do motor, NÃO** — o mesmo achado do D432, do D433 e do
 *   D435, agora às 22h17 de 06/10: o motor de 14/09. **A janela do motor é a MESMA do LAB-37 e do LAB-46**
 *   (`fe0c7a1` … `244aae3`; o T03 acusa, como lá). **Quatro provas do mesmo disco (LAB-37, 40, 46 e 50), e esta é
 *   de dois dias depois das outras: coerência, não medição** de que o disco ficou parado de 04 a 06/10.
 * - **A frase da prova sobrevive às pontas de hoje; os números de `ensaio-com-testada`, não.** Com as pontas de hoje
 *   (motor `4c60ec7`, Generate `8ca421a`), as quatro previsões dão o mesmo veredicto nas duas glebas (P1, P3 e P4
 *   cumpridas nas duas; P2 cumprida em `geo-antonina` e não em `ensaio-com-testada`), e os 33 lotes de `geo-antonina`
 *   saem iguais; em `ensaio-com-testada` são 54 lotes externos (51 na prova) e 21 sobre leito de via (9 na prova).
 * - **Os dentes são commits de verdade**: as bordas do motor acusam; a do Generate **cai** — o motor não entrega plano
 *   com o contrato v1, e a ferramenta não tem o que medir. Não precisou de troca na cópia, nem de veneno.
 *
 * # O que se escreve: duas janelas, uma fechada e uma aberta — e o instante FORA da do motor
 *
 * O que a prova cala é **"o motor de `fe0c7a1` a `244aae3` (14/09), e o Generate de `5b70e5f` em diante"**. A prova
 * não se toca (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio e depois de hoje**: medidos aqui e no D436, não a cada verde — a trava roda o instante,
 *   os quatro cantos e as três bordas;
 * - **o produto inteiro**: cada eixo com o outro num ponto, e os quatro cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o lugar do fecho**: não foi rodado (a ponta de hoje de cada um, sim);
 * - **os 368 commits do Generate de antes do contrato v1 que não rodaram**: contados pela árvore, não pela ferramenta;
 * - **o `quando` da raiz**: fica fora da comparação, porque a ferramenta o escreve com a hora da rodada;
 * - **por que o disco estava em 14/09**: não se mede daqui;
 * - **o que a ferramenta imprime na tela**: a trava pergunta só a prova.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-50/passagem-externa.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab50.ts";

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
export const O_RETRATO_DO_LAB50: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "846b955078241ea346dbfce63b87e4988fa295c1",
    deOndeSeSabe: "o único commit da prova (`git log`: o LAB-50, 06/10/2026, 22h17 UTC); a ferramenta é a desse commit",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `846b955` refaz a prova byte a byte (fora
 * o `quando`); em `antes` e em `depois` ela roda e acusa. O do instante (a ponta da origem na hora da prova) fica FORA.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueDaAntes: "a ferramenta roda e acusa: 14 linhas — o T03, 14/09, antes do T02",
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueDaDepois:
    "a ferramenta roda e acusa: 220 linhas (o T07, 15/09); e de `ee7c438` à ponta de hoje as mesmas 226 linhas do instante",
  oDoInstante: "933698567154b59ee134da14c0b0e063b88a9f49",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 22h17 UTC de 06/10, a hora da prova — e ele ACUSA (226 linhas: `ensaio-com-testada` e os nomes das vias culpadas; os 33 lotes de `geo-antonina` não mudam): a prova foi feita com um motor de 14/09, a mesma janela do LAB-37 e do LAB-46 (coerência, não medição)",
} as const;

/**
 * **A janela do Generate**, aberta: do contrato v2 (`primeiro`) à ponta medida a ferramenta refaz a prova byte a
 * byte (fora o `quando`); em `antes` ela roda e CAI — o motor não entrega plano com o contrato v1.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimoMedido: "8ca421aedf50f58bced49d6341db80571a225879",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes:
    "a ferramenta roda e cai — o motor não entrega plano (`saida` nula), antes do contrato v2 (02/10); e o mesmo em todos os 29 commits desde o contrato v1",
  aMarcaDaQueda: "evaluating 'saida.lotes'",
  depois: null,
  oDoInstante: "ad17a7e4e6834bd2d1d432301c65c38ee403d389",
  oInstanteEstaDentro: true,
} as const;

/**
 * Os commits de primeiro pai que tocam o lugar do fecho, e o que deram. `naoRodam` é falta de módulo; `caem` é a
 * ferramenta rodar e cair porque o motor não entregou plano. No Generate, dos 371 que não rodam, três rodaram pela
 * ferramenta (os últimos antes do contrato v1) e 368 se contaram pela árvore.
 */
export const OS_COMMITS_RODADOS = {
  motor: {
    lugar: "src/lib/lab/",
    commits: 37,
    rodadosPelaFerramenta: 37,
    naoRodam: 10,
    caem: 2,
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
    caem: 29,
    acusamAntes: 0,
    refazem: 39,
    acusamDepois: 0,
  },
} as const;
