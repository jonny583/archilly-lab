/**
 * **LAB-212 (item 900) · a assimetria da faixa do LAB-55 roda o motor e o Generate e não escreve o commit de nenhum
 * dos dois — e, medido, o motor que a fez NÃO é o da origem daquela hora: é o de 14/09, a MESMA janela do LAB-37, 46,
 * 50, 53 e 54; e a tese da prova (o lote respeita a faixa, a via não) SOBREVIVE ao instante e às pontas de hoje,
 * com outros números em `ensaio-com-testada`** (D440).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-55/via-sobre-a-faixa.json` foi gravada uma vez só, no LAB-55 (`2d4052b`, 07/10/2026,
 * 05h23 UTC; o `quando` da raiz diz 05h13), com um `quando` da hora (`new Date()`, na raiz). A ferramenta
 * `external-engines/esteira/ferramentas/lab55.ts` nasceu nesse commit e mudou **uma vez**, no LAB-135 (`1711bd1`,
 * D363): **uma linha**, o `import` de `distanciaAoPoligono` e `pontoEmPoligono`, que passou de `@testfit/geo.ts` para a
 * porta `../../testfit/adapter/src/motor.ts` (repasse). A trava roda **a de então** (o Lab em `2d4052b`) e confere que
 * a mudança de depois é só aquela linha. A ferramenta roda o motor **padrão** da tela unificada — **o motor**
 * (`motor-testfit/src/lib/lab/` e `contrato/`, 13 arquivos no fecho dos `import` do `2d4052b` com o motor do LAB-55) —
 * e passa cada plano pelo esquema e pelo Validator **do Generate** (`engine/`, `engine/espinha/`, `contratos/motor-v1/`,
 * `normas/`, `import/`: 14 arquivos, mais 8 do `zod`), lendo a faixa nos lotes externos publicados e medindo as vias
 * que entram nela, nas duas glebas do LAB-55 (`geo-antonina` e o controle convexo `ensaio-com-testada`). O fecho tem
 * um arquivo do Symbios (`adapter/src/geo.ts`, TypeScript) e **nenhum `.wasm`**: roda aqui. A prova não escreve
 * commit de nenhum dos dois: o retrato do LAB-198 a dá calando os dois — dois silêncios. O relatório do LAB-55 (§4)
 * nomeia os clones do fim da rodada (motor `4181e95`, Generate `5b7e9b4`) — os mesmos do LAB-53 e 54: **um ponto**,
 * não a janela, e não o instante.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 20/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em `2d4052b`,
 * `INVARIANTES_EXEMPLOS=100000` (o que o `bun run lab55` do `package.json` põe), a prova comparada **byte a byte, fora
 * o `quando` da raiz**. Cada rodada leva perto de 6 segundos; rodaram-se **todos** os commits de primeiro pai que
 * tocam o lugar do fecho no motor (37, com o Generate em `5b7e9b4`) e, no Generate, os 68 do contrato v1 em diante e
 * os três de antes (com o motor em `4181e95`; os outros 368 de antes contados pela árvore: nenhum tem
 * `src/lib/import/parcelamento-externo.ts`, que a ferramenta importa) — e as duas pontas de hoje. Em nenhuma rodada a
 * ferramenta escreveu outro arquivo, e em toda rodada que rodou ela escreveu a prova (o `quando` novo).
 *
 * **O instante não refaz a prova.** Com as pontas da origem às 05h23 UTC de 07/10 (motor `6cf6396` — não o `332bf91`
 * do LAB-54: a origem andou uma hora —, Generate `7330cc7`), **130 linhas** mudam (as do `diff` sem a do `quando`). A
 * rede do motor sai em trechos: `geo-antonina` de 10 para **41** vias, `ensaio-com-testada` de 11 para **37**; e o
 * controle convexo muda de conta — 54 lotes externos (eram 51), **4** vias entrando na faixa (eram 2), **29**
 * `via-sobre-lote` (eram 15), 31 pares lote-via (eram 17), seis vias culpadas (eram quatro; todas secundárias, a
 * principal `V1` sai da lista). **`geo-antonina` mantém a conta** (33 externos, 2 vias na faixa, 11 `via-sobre-lote`,
 * 11 pares, zero bulbo; as duas culpadas, principais, invadem os mesmos 8 e 3 lotes, com as mesmas áreas — a `V2` de
 * 1 708,54 m sai como `V3` de 681,93 m, por causa dos trechos). O motor do instante acusa sozinho (com o Generate em `5b7e9b4`, as mesmas 130 linhas); o
 * Generate do instante, sozinho (com o motor em `4181e95`), refaz. **As pontas de hoje (motor `ac5d74d`, Generate
 * `a2be4f6`) dão a mesma prova do instante, byte a byte fora o `quando`.**
 *
 * **O eixo do motor**, com o Generate em `5b7e9b4` — os 37 commits de primeiro pai que tocam `src/lib/lab/`:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `d98b0fe` … `0ece0b1` (10/09), 10 commits | a ferramenta não roda (falta módulo: `@testfit/api.ts`, e no último `@testfit/contrato/tipos.ts`) |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | a ferramenta roda e **acusa** — 143 linhas: o Generate recusa o plano pelo esquema nas duas glebas (*"20 de 20 variantes foram recusadas pelo esquema"*) |
 * | `648ae78` (14/09, T03) | a ferramenta roda e **acusa** — 36 linhas (as mesmas contas e as mesmas vias culpadas, com outro nome e frações de metro; o ranking é de 16 e 17 variantes) |
 * | **`fe0c7a1` (14/09, T02) · `4181e95` · `244aae3` (14/09, o fechamento)** | **igual, byte a byte (fora o `quando`)** |
 * | `2160fce` (15/09, T07): 120 linhas; `ee7c438` … `3fdb8ca` (11/10), 20 commits, e a ponta de hoje (`ac5d74d`): as **mesmas** 130 linhas do instante | a ferramenta roda e **acusa** |
 *
 * **O eixo do Generate**, com o motor em `4181e95` — os 439 commits de primeiro pai que tocam `src/lib/`:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `a02644c` (30/06) … `4cd7dc2` (09/09), 371 commits | a ferramenta não roda — falta `@generate/import/parcelamento-externo.ts` (três rodados; 368 pela árvore) |
 * | `22502b3` (10/09, o contrato v1) … `8223873` (02/10), 29 commits | a ferramenta roda e **acusa** — 143 linhas: o Generate recusa o plano pelo esquema nas duas glebas |
 * | **`5b70e5f` (02/10, o contrato v2) … `0297934` (16/10, o último que toca `src/lib/`), 39 commits, e a ponta de hoje (`a2be4f6`)** | **igual, byte a byte (fora o `quando`)** |
 *
 * - **O instante do Generate está dentro da janela dele; o do motor, NÃO** — o mesmo achado do D432, D433, D435,
 *   D436, D437, D438 e D439, agora às 05h23 de 07/10, uma hora depois do LAB-54: o motor de 14/09. **A janela do motor
 *   é a MESMA** (`fe0c7a1` … `244aae3`; o T03 acusa, como lá). Seis provas do mesmo disco (LAB-37, 40, 46, 50, 53, 54) e
 *   esta, a sétima: **coerência, não medição** de que o disco ficou parado.
 * - **Sem ilha.** O T01 e o merge seguinte acusam pela recusa do esquema, como no LAB-54 (D439).
 * - **A janela do Generate é a do LAB-54**: do contrato v2 em diante, sem fechar.
 * - **A tese da prova sobrevive.** *"`sobreposicao` = 0, `via-sobre-lote` = 11: o lote respeita a faixa, a via não"*
 *   (LAB-55 §0) fala de `geo-antonina`, e lá a conta sai igual no instante e hoje; no controle convexo a via entra
 *   MAIS na faixa (4 vias, 29 `via-sobre-lote`), e continua sem bulbo de retorno, então o recorte por `util` do
 *   `aplicarCulDeSac` continua sem rodar. **O que não sobrevive são os números de `ensaio-com-testada` e os nomes e
 *   comprimentos das vias culpadas** — e a frase do LAB-55 de que uma via **principal** (`V1`) entra na faixa do
 *   controle: no instante, as quatro que entram ali são secundárias. **A leitura do código** (`apararRedeViaria` pela
 *   divisa, `formatos.ts:826`) **não foi reconferida** contra o motor do instante: a prova não a mede, e esta trava
 *   pergunta a prova.
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
 * - **os estados do meio e depois de hoje**: medidos aqui e no D440, não a cada verde — a trava roda o instante, cada
 *   vizinho dele, os quatro cantos, o clone do LAB-55 e as três bordas;
 * - **o produto inteiro**: cada eixo com o outro num ponto (`5b7e9b4` e `4181e95`), e os quatro cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o lugar do fecho**: não foi rodado (a ponta de hoje de cada um, sim);
 * - **os 368 commits do Generate de antes do contrato v1 que não rodaram**: contados pela árvore, não pela ferramenta;
 * - **a ferramenta de hoje** (`1711bd1`): a trava confere que a diferença é uma linha de `import`, não a roda;
 * - **o `quando` da raiz**: fica fora da comparação, porque a ferramenta o escreve com a hora da rodada;
 * - **por que o disco estava em 14/09**: não se mede daqui;
 * - **o que a ferramenta imprime na tela**: a trava pergunta só a prova.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-55/via-sobre-a-faixa.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab55.ts";

/**
 * **A ferramenta mudou uma vez depois da prova**: no LAB-135 (D363), só a linha do `import` das duas funções de
 * geometria, que passou a entrar pela porta do adaptador. `antes` e `depois` são a linha inteira, como o `git` a mostra.
 */
export const A_MUDANCA_DA_FERRAMENTA = {
  commit: "1711bd14cb38b4e01b203c7dcd55629705721be7",
  antes: 'import { distanciaAoPoligono, pontoEmPoligono } from "@testfit/geo.ts";',
  depois: 'import { distanciaAoPoligono, pontoEmPoligono } from "../../testfit/adapter/src/motor.ts";',
} as const;

/** A variável que o `bun run lab55` do `package.json` põe — a tampa de exemplos do Validator do Generate. */
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

/** O Lab: o único commit da prova, e o da ferramenta de então. */
export const O_RETRATO_DO_LAB55: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "2d4052bfd85125fd75fb5f2bd326721e4123e7b2",
    deOndeSeSabe:
      "o único commit da prova (`git log`: o LAB-55, 07/10/2026, 05h23 UTC); a ferramenta nasceu nele e mudou uma linha de `import` no LAB-135",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `2d4052b` refaz a prova byte a byte (fora
 * o `quando`); em `antes` e em `depois` ela roda e acusa. O do instante (a ponta da origem na hora da prova) fica FORA.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  oDoLab55: "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueDaAntes: "a ferramenta roda e acusa: 36 linhas — o T03, 14/09 (as mesmas contas e as mesmas vias culpadas, com outro nome e frações de metro; ranking de 16 e 17 variantes)",
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueDaDepois:
    "a ferramenta roda e acusa: 120 linhas (o T07, 15/09); e de `ee7c438` à ponta de hoje as mesmas 130 linhas do instante",
  oDoInstante: "6cf6396dd0af759cffba4006442f1242c2d69888",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 05h23 UTC de 07/10, a hora da prova — e ele ACUSA (130 linhas: a rede sai em trechos, 41 e 37 vias; `ensaio-com-testada` com 4 vias na faixa e 29 `via-sobre-lote`, a prova diz 2 e 15; `geo-antonina` com a mesma conta): a prova foi feita com um motor de 14/09, a mesma janela do LAB-37, 46, 50, 53 e 54 (coerência, não medição)",
} as const;

/**
 * **A janela do Generate**, aberta: do contrato v2 (`primeiro`) à ponta medida a ferramenta refaz a prova byte a
 * byte (fora o `quando`); em `antes` ela roda e acusa — o Generate recusa o plano pelo esquema nas duas glebas.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimoMedido: "a2be4f64b90dbb7d9d2e6c26aec2a34d1db3a95c",
  oDoLab55: "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes:
    "a ferramenta roda e acusa: 143 linhas — antes do contrato v2 (02/10) o Generate recusa o plano pelo esquema nas duas glebas; e o mesmo em todos os 29 commits desde o contrato v1",
  aMarcaDaRecusa: "nenhuma variante passou no esquema",
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
