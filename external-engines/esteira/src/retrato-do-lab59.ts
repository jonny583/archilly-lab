/**
 * **LAB-214 (item 900) · o contrafactual de Antonina do LAB-59 roda o motor e o Generate e não escreve o commit de
 * nenhum dos dois — e, medido, a janela dele é a do LAB-53 e do LAB-58: o motor de 14/09 e o Generate do contrato v2 a
 * 03/10, os dois instantes FORA. Mas, ao contrário da do LAB-58, fora dela a ferramenta de então NÃO PARA: escreve
 * outra prova, sem aviso — e na do instante o plano de 1 228 lotes não existe** (D442).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-59/contrafactual-de-antonina.json` foi gravada uma vez só, no LAB-59 (`387fc20`, 07/10/2026,
 * 11h35 UTC), com um `quando` da hora (`new Date()`, na raiz). A ferramenta `external-engines/esteira/ferramentas/lab59.ts`
 * nasceu nesse commit e mudou **uma linha** depois, no LAB-135 (`1711bd1`, D363): o `import` de `distanciaSegmento`
 * passou de `@testfit/geo.ts` à porta do adaptador. A de então é a do `387fc20`, e é ela que se roda. Ela roda as vinte
 * candidatas julgadas do motor **padrão** em `geo-antonina` (13 arquivos do motor no fecho) e o esquema, o Validator,
 * `_testadaDoLote`, `divisaDoAcesso` e `faixaViaPublica` do Generate (15 arquivos, mais 8 do `zod`); **lê** três provas do
 * Lab (LAB-53, 50 e 54, do mesmo commit) — como **calibração** por lote e como **aferição**. O fecho tem um arquivo do
 * Symbios (`adapter/src/geo.ts`, TypeScript) e **nenhum `.wasm`**: roda aqui. O retrato do LAB-198 dá a prova calando os
 * dois vizinhos — dois silêncios. O relatório do LAB-59 (§6) nomeia os clones do fim (motor `4181e95`, Generate
 * `5b7e9b4`): **um ponto**, o mesmo do LAB-58.
 *
 * # O desenho da ferramenta, e por que ele decide o que acontece fora da janela
 *
 * A `lab59.ts` para (`process.exit(1)`, sem escrever) em poucos lugares, e **nenhum deles confere a lista inteira**:
 *
 * - a **aferição** compara UM número — as violações da 1ª do ranking em `geo-antonina` — com o do LAB-53 (40). Fora de
 *   Antonina o LAB-53 tem 52 violações que o motor de depois de 14/09 não produz, mas a ferramenta não as lê;
 * - a **calibração** compara por lote **só os lotes que as provas contêm** (os `v19-eN` da vencedora do LAB-50 e 54);
 *   lote que não existe nelas não é conferido — de propósito, foi o conserto do D200;
 * - candidata que o **esquema** recusa vira uma linha `recusadaPeloEsquema`, e não para: quando o esquema recusa TODAS,
 *   quem para é a aferição (*"a 1ª do ranking (\"undefined\") deu undefined"*).
 *
 * Então, fora da janela, com o esquema aceitando a saída, **a ferramenta escreve outra prova** — com outras candidatas,
 * outros lotes, outra contagem por cenário —, e o `exit 0` dela é o mesmo de quando refaz. É a forma das seis anteriores
 * desta série (LAB-205 a 212), não a da `lab58.ts` (LAB-213), que confere a lista inteira e cala.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 20/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em `387fc20`,
 * `INVARIANTES_EXEMPLOS=100000` (o que o `bun run lab59` do `package.json` põe), a prova comparada **byte a byte, fora o
 * `quando` da raiz**, e a árvore do Lab conferida depois de cada rodada (em nenhuma a ferramenta escreveu outro arquivo).
 * De 3 a 35 segundos por rodada; rodaram-se **todos** os commits de primeiro pai que tocam o lugar do fecho no motor (37,
 * com o Generate em `5b7e9b4`, e a ponta de hoje) e, no Generate, os 68 do contrato v1 em diante e os três de antes (com o
 * motor em `4181e95`; os outros 368 de antes contados pela árvore no LAB-211: nenhum tem
 * `src/lib/import/parcelamento-externo.ts`) — e a ponta de hoje.
 *
 * **O instante não refaz a prova — e a ferramenta escreve outra sem aviso.** Com as pontas da origem às 11h35 UTC de 07/10
 * (motor `6cf6396`, Generate `09cd4c0` — as mesmas do LAB-58, porque nenhum dos dois andou entre 11h01 e 11h35) a
 * ferramenta sai bem e escreve: **20 candidatas, 17 aprovam com os dois consertos** (a prova diz 16), a 1ª do ranking dele
 * entre elas continua a `superquadra` de 33 lotes — **mas não há candidata de 1 228 lotes**: a maior é uma `espinha` de
 * 1 154. O motor do instante sozinho (Generate `5b7e9b4`) escreve a mesma contagem; **o Generate do instante sozinho
 * (motor `4181e95`) escreve outra**: as mesmas vinte candidatas, a `ortogonal` de 1 228 ainda aprovando, mas **só 10 de 20**
 * com os dois consertos — 40 violações saem `MECANISMO-NAO-NOMEADO`, 36 delas `testada-ilegal` (a do `641addb`, que os
 * mecanismos do LAB-58 não nomeiam).
 *
 * **O eixo do motor**, com o Generate em `5b7e9b4`:
 *
 * | o motor em | o que dá contra a prova |
 * |---|---|
 * | `d98b0fe` … `0ece0b1` (10/09), 10 commits | para: `Cannot find module` (`@testfit/api.ts`, e no último `@testfit/contrato/tipos.ts`) |
 * | `d2f71e4` (13/09, T01) · `66ece91` (14/09) | para: a aferição — o esquema recusa as vinte, e a 1ª do ranking é `undefined` |
 * | `648ae78` (14/09, T03) | **escreve outra**: 16 candidatas, 12 aprovam com os dois |
 * | **`fe0c7a1` (14/09, T02) · `4181e95` · `244aae3` (14/09)** | **igual, byte a byte (fora o `quando`)** |
 * | `2160fce` (15/09, T07) … `3fdb8ca` (11/10), 21 commits, e a ponta de hoje (`30b3434`) | **escreve outra**: no `2160fce`, 17 de 20 e nenhuma de 1 228 |
 *
 * **O eixo do Generate**, com o motor em `4181e95`:
 *
 * | o Generate em | o que dá contra a prova |
 * |---|---|
 * | `19d195f` … `4cd7dc2` (09/09), três rodados (e 368 pela árvore) | para: `Cannot find module` (`@generate/import/parcelamento-externo.ts`) |
 * | `22502b3` (10/09, o contrato v1) … `8223873` (02/10), 29 commits | para: a aferição — o esquema recusa as vinte |
 * | **`5b70e5f` (02/10, o contrato v2) … `49d8e3e` (03/10), 5 commits** | **igual, byte a byte (fora o `quando`)** |
 * | `641addb` (03/10, a `testada-ilegal`) … `0297934` (16/10), 34 commits, e a ponta de hoje (`27b9330`) | **escreve outra**: no `641addb`, 10 de 20 |
 *
 * Os quatro cantos (`fe0c7a1`/`244aae3` × `5b70e5f`/`49d8e3e`) e o par do LAB-59 (`4181e95` × `5b7e9b4`) dão igual. As
 * duas pontas de hoje juntas (motor `30b3434`, Generate `27b9330`) escrevem: 17 de 20, a `superquadra` de 33 primeiro, a
 * maior aprovável uma `espinha` de 1 154, nenhuma de 1 228.
 *
 * - **As janelas são as do LAB-53 corrigidas pelo LAB-210 e as do LAB-58** (D437, D438, D441) — mas aqui **não por
 *   construção**: a ferramenta não confere a lista. Coincidem porque o motor e o Generate mudaram o que ela mede nos
 *   mesmos commits.
 * - **Os dois instantes ficam FORA**, e o que morre com o do motor é o **número da pendência**: o *"1 228 lotes"* que a
 *   pendência 7 do Jonny cita é de um motor de 14/09. A **forma** da tese sobrevive no instante e nas pontas de hoje —
 *   com os dois consertos, a nota dele ainda põe a `superquadra` de 33 em primeiro, à frente de planos de mais de mil
 *   lotes que aprovariam.
 * - **Os dentes são commits de verdade**: as bordas acusam (escrevem outra, ou param), cada uma com a sua marca. Não
 *   precisou de troca na cópia, nem de veneno.
 *
 * # O que se escreve: duas janelas fechadas, os dois instantes FORA, e o que a ferramenta escreve fora delas
 *
 * O que a prova cala é **"o motor de `fe0c7a1` a `244aae3` (14/09), e o Generate de `5b70e5f` a `49d8e3e` (02 e
 * 03/10)"**. A prova não se toca (D182). A outra prova da pasta, `sabotagem.json`, é ato (as sabotagens da precondição),
 * não ferramenta, e não cala vizinho.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio e depois de hoje**: medidos aqui e no D442, não a cada verde — a trava roda o instante, cada
 *   vizinho dele, os quatro cantos, o par do LAB-59, as quatro bordas, o T01 e uma falta de módulo de cada vizinho;
 * - **o produto inteiro**: cada eixo com o outro num ponto (`5b7e9b4` e `4181e95`), e os quatro cantos;
 * - **commit que só existiu num ramo** (os `claude/*` do motor, o `motor-v2` do Generate): mediu-se a `main`;
 * - **commit de primeiro pai que não toca o lugar do fecho**: não foi rodado (a ponta de hoje de cada um, sim);
 * - **as três provas que a ferramenta lê**: são as do `387fc20`, lidas da árvore do Lab montada, nunca de hoje;
 * - **o `quando` da raiz**: fica fora da comparação, porque a ferramenta o escreve com a hora da rodada;
 * - **a prova inteira escrita fora da janela**: a trava confere três marcas dela (quantas candidatas, quantas aprovam com
 *   os dois consertos, se há uma de 1 228 lotes), não o texto;
 * - **por que o disco estava em 14/09 e em 03/10**: não se mede daqui;
 * - **se a pendência 7 deve ser remedida**: é decisão do Jonny, e ela está parada a pedido dele até o Lab entrar no
 *   Generate.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-59/contrafactual-de-antonina.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab59.ts";

/** A variável que o `bun run lab59` do `package.json` põe — a tampa de exemplos do Validator do Generate. */
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

/** As duas formas de a ferramenta PARAR sem escrever — o que ela diz, no `stderr` ou no `stdout`. */
export const AS_PARADAS = {
  faltaModulo: "Cannot find module",
  aAfericao: "a aferição falhou",
} as const;

/** A marca da aferição quando o esquema recusou TODAS as candidatas: não há 1ª do ranking. */
export const SEM_PRIMEIRA = 'a 1ª do ranking ("undefined") deu undefined';

/**
 * As três marcas que a trava lê da prova ESCRITA fora da janela — e que a prova do LAB-59 tem como 20, 16 e sim.
 * `candidatas`: quantas linhas; `osDoisAprovam`: quantas aprovariam com os dois consertos; `haUmaDe1228`: se alguma
 * candidata julgada tem 1 228 lotes.
 */
export interface OQueEscreve {
  readonly candidatas: number;
  readonly osDoisAprovam: number;
  readonly haUmaDe1228: boolean;
}

/** As marcas da prova gravada — o que "igual" reproduz. */
export const O_QUE_A_PROVA_DIZ: OQueEscreve = { candidatas: 20, osDoisAprovam: 16, haUmaDe1228: true };

/** Lê as três marcas de um texto de prova. */
export function marcasDaProva(texto: string): OQueEscreve {
  const p = JSON.parse(texto) as {
    cenarios: { id: string; quantasAprovam: number }[];
    candidatas: { lotes?: number }[];
  };
  const osDois = p.cenarios.find((c) => c.id === "os-dois");
  if (!osDois) throw new Error("a prova não tem o cenário `os-dois`");
  return {
    candidatas: p.candidatas.length,
    osDoisAprovam: osDois.quantasAprovam,
    haUmaDe1228: p.candidatas.some((c) => c.lotes === 1228),
  };
}

/** O Lab: o único commit da prova. */
export const O_RETRATO_DO_LAB59: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "387fc205b666f72e57f2e6c8579b009c842bd81d",
    deOndeSeSabe:
      "o único commit da prova (`git log`: o LAB-59, 07/10/2026, 11h35 UTC); a ferramenta nasceu nele e mudou uma linha no LAB-135 (`1711bd1`, o import da porta) — roda-se a de então",
  },
];

/**
 * **A janela do motor**, fechada: de `primeiro` a `ultimo` a ferramenta do `387fc20` refaz a prova byte a byte (fora
 * o `quando`); em `antes` e em `depois` ela ESCREVE OUTRA, sem aviso. O do instante (a ponta da origem na hora da prova)
 * fica FORA. `naoRoda` é o último que nem compila o fecho; `recusa`, o T01, em que o esquema recusa as vinte e a
 * aferição para.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ultimo: "244aae34726532d8a2e6ea382c77419c52232879",
  oDoLab59: "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueEscreveAntes: { candidatas: 16, osDoisAprovam: 12, haUmaDe1228: true } satisfies OQueEscreve,
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  oQueEscreveDepois: { candidatas: 20, osDoisAprovam: 17, haUmaDe1228: false } satisfies OQueEscreve,
  recusa: "d2f71e48e860650cc2c7a2b841b1c2c2c7fbe3a7",
  naoRoda: "0ece0b1969d9e1cfca8c1c44d1ceb582d69cca9c",
  oDoInstante: "6cf6396dd0af759cffba4006442f1242c2d69888",
  oInstanteEstaDentro: false,
  porQueODoInstante:
    "a ponta da origem às 11h35 UTC de 07/10, a hora da prova — e com ela a ferramenta ESCREVE OUTRA, sem aviso: 17 de 20 aprovam com os dois consertos (a prova diz 16) e não há candidata de 1 228 lotes (a maior é uma `espinha` de 1 154). A prova foi feita com um motor de 14/09, a mesma janela do LAB-37, 46, 50, 53, 54, 55 e 58 (coerência, não medição)",
  aPontaDeHoje: "30b3434a00deba900322b2bab58446af1ae4ebfc",
} as const;

/**
 * **A janela do Generate**, fechada: do contrato v2 (`primeiro`) a `ultimo` a ferramenta refaz a prova byte a byte
 * (fora o `quando`); em `antes` ela para (o esquema recusa as vinte, e a aferição não acha a 1ª); em `depois` escreve
 * outra (a `testada-ilegal` entra, e os mecanismos do LAB-58 não a nomeiam). O do instante fica FORA.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimo: "49d8e3e4d6d7c3f6e2daed6ef4fb5f67c5b54996",
  oDoLab59: "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes:
    "a ferramenta para pela aferição: antes do contrato v2 (02/10) o esquema do Generate recusa as vinte candidatas, e não há 1ª do ranking; o mesmo nos 29 commits desde o contrato v1",
  depois: "641addb0d572a833d91583e40848f7c4cf05135b",
  oQueEscreveDepois: { candidatas: 20, osDoisAprovam: 10, haUmaDe1228: true } satisfies OQueEscreve,
  naoRoda: "4cd7dc286a146634c31fcf8b2d0f6f1424f17525",
  oDoInstante: "09cd4c0ef4c36cfb87822682716a8f57dbb75f00",
  oInstanteEstaDentro: false,
  aPontaDeHoje: "27b933086c50d69f4b5ac2cbc5c042d8c2ecf79f",
} as const;

/** O que a ferramenta escreve no instante (as duas pontas da origem às 11h35 de 07/10) e com o motor do instante sozinho. */
export const O_QUE_ESCREVE_O_INSTANTE: OQueEscreve = { candidatas: 20, osDoisAprovam: 17, haUmaDe1228: false };

/**
 * Os commits de primeiro pai que tocam o lugar do fecho, e o que deram. `naoRodam` é falta de módulo; `param`, a
 * aferição sem 1ª do ranking (o esquema recusando as vinte — no motor, o T01 e o merge seguinte; no Generate, os 29 do
 * contrato v1); `escrevemOutraAntes` e `escrevemOutraDepois`, a prova diferente com `exit 0`. No Generate, dos 371 que
 * não rodam, três rodaram pela ferramenta (os últimos antes do contrato v1) e 368 se contaram pela árvore (LAB-211).
 */
export const OS_COMMITS_RODADOS = {
  motor: {
    lugar: "src/lib/lab/",
    commits: 37,
    rodadosPelaFerramenta: 37,
    naoRodam: 10,
    param: 2,
    escrevemOutraAntes: 1,
    refazem: 3,
    escrevemOutraDepois: 21,
  },
  generate: {
    lugar: "src/lib/",
    commits: 439,
    rodadosPelaFerramenta: 71,
    naoRodam: 371,
    naoRodamPelaArvore: 368,
    param: 29,
    escrevemOutraAntes: 0,
    refazem: 5,
    escrevemOutraDepois: 34,
  },
} as const;
