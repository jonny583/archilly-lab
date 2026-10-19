/**
 * **LAB-202 (item 900) · as cinco provas do `medir.ts` do LAB-07 rodam o motor e o Generate e não escrevem o
 * commit de nenhum dos dois — achado por medição, e são DUAS janelas FECHADAS: o motor de 10/09 a 14/09, o
 * Generate de 10/09 a 02/10** (D430).
 *
 * # O que estava escrito, e o que faltava
 *
 * As cinco provas — `docs/provas/LAB-07/ensaio-47ha.saida.json`, `geo-antonina.saida.json`,
 * `lab01-50ha-ondulado.saida.json`, `medicoes.json` e `medir.txt` (a saída de tela da mesma rodada) — foram
 * gravadas uma vez só, no LAB-07 (`25b62e0`, 13/09/2026; o `geradoEm` da `medicoes.json` é 14h31 UTC). A
 * ferramenta `external-engines/testfit/ferramentas/medir.ts` roda **o motor** (`motor-testfit`, `src/lib/lab/`,
 * por `import`), traduz o plano para o contrato de motor v1 e o julga com **o Validator e o Judge do
 * Generate** — e nenhuma das cinco escreve commit de nenhum dos dois. O retrato do LAB-198 dá as cinco calando
 * os dois vizinhos: dez silêncios.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `25b62e0`, o motor e o Generate na história de primeiro pai da `main` de cada um. A ferramenta não precisa do
 * Symbios, então roda **inteira** (perto de treze segundos). Compara-se cada `.json` valor a valor, **fora** o
 * {@link FORA_DA_RAIZ} da `medicoes.json` (a hora e o `bun` da rodada) e os tempos dela ({@link eTempo}); as
 * três `.saida.json` têm carimbo fixo e se comparam inteiras; a `.txt`, linha a linha, fora o *"· tempos: …"* do
 * fim das três linhas de perdas ({@link textoForaDoTempo}).
 *
 * **O eixo do motor**, com o Generate do instante (`22502b3`) — rodados os **37** commits de primeiro pai que
 * tocam `src/lib/lab/` (o fecho inteiro da ferramenta no motor mora ali: nove arquivos, `bun build --metafile`):
 *
 * | o motor em | o que muda contra as provas |
 * |---|---|
 * | `9404d78` (10/09) e antes | **a ferramenta nem roda** — o motor ainda não tem `src/lib/lab/api.ts` |
 * | **`0ece0b1` (10/09) · `d2f71e4` (13/09, T01) · `66ece91` (14/09)** | **zero** — as cinco |
 * | `648ae78` (14/09) | 66 valores na `medicoes.json` e 6 linhas da `.txt` |
 * | `fe0c7a1` (14/09) … `3fdb8ca` (11/10) | de 6 422 a 30 766 valores, nas quatro `.json` |
 *
 * **O eixo do Generate**, com o motor do instante (`d1998f1`) — o fecho dos `import` da ferramenta dentro do
 * Generate tirado em doze pontos de `22502b3` à ponta e unido (43 arquivos de `src/`), mais
 * `docs/glebas-padrao/` (que a ferramenta lê do disco): **27** commits tocam esse conjunto, e rodei todos:
 *
 * | o Generate em | o que muda contra as provas |
 * |---|---|
 * | `805b6a0` (09/09) e antes | **a ferramenta nem roda** — ainda não existe `src/lib/import/parcelamento-externo.ts` |
 * | **`22502b3` (10/09, o contrato de motor v1) … `8223873` (02/10)** | **zero** — os dez estados ({@link OS_ESTADOS_DO_GENERATE}), cobrindo os 46 commits da janela |
 * | `5b70e5f` (02/10, o contrato v2) … `18df3a8` (14/10) | **a ferramenta nem roda** — *"Contrato de motor versão 2 — este adaptador entende a versão 1"* |
 *
 * - **Os quatro cantos** (o começo e o fim de cada janela, juntos) dão zero: a janela é um retângulo, não só
 *   duas linhas que se cruzam no instante.
 * - **A ponta do instante está dentro das duas**: motor `d1998f1` (13/09, 03h58 UTC) e Generate `22502b3`. O
 *   `d2f71e4` (o T01 do motor, mesclado às 14h35 UTC, quatro minutos DEPOIS do `geradoEm`) também refaz — não se
 *   distingue do `d1998f1`, porque não mudou nada do fecho.
 * - **Os dentes**: do motor, um commit de verdade do vizinho — `648ae78`, a borda de depois, 66 valores. Do
 *   Generate, como no D429, uma troca **na cópia temporária** ({@link A_TROCA_DOS_DENTES}): a tolerância de apoio
 *   da via no Validator, de 0,75 m para 0,5 m — 7 valores mudam, todos na `medicoes.json`, e 6 linhas da `.txt`.
 *
 * # O que se escreve: duas janelas, com as quatro bordas
 *
 * Ao contrário do D428 e do D429, aqui **há borda de depois** nos dois eixos: o motor anda e a ferramenta enxerga
 * (`648ae78`); o Generate muda de contrato e a ferramenta para (`5b70e5f`). O que as provas calam é **"o motor
 * de `0ece0b1` a `66ece91`, e o Generate de `22502b3` a `8223873`"**. O provável, pelo instante, é `d1998f1` e
 * `22502b3`; **coerência, não medição**, e fica dito assim.
 *
 * # O que este módulo faz
 *
 * {@link O_RETRATO_DO_LAB07_MEDIR} escreve o Lab; {@link A_JANELA_DO_MOTOR} e {@link A_JANELA_DO_GENERATE}, as
 * janelas. A trava (`tests/retrato-do-lab07-medir.test.ts`) monta as três árvores numa pasta temporária, por
 * caminho, e roda a ferramenta de então: no instante e nos quatro cantos (as cinco provas iguais), nas quatro
 * bordas (não refaz) e com a troca dos dentes na cópia do Generate (acusa). **As provas não se tocam** (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio**: o `d2f71e4` do motor e os oito do meio do Generate ({@link OS_ESTADOS_DO_GENERATE})
 *   — medidos aqui e no D430, não a cada verde;
 * - **o produto inteiro**: rodou-se cada eixo com o outro no instante, e os quatro cantos; um par do meio dos
 *   dois eixos ao mesmo tempo não foi rodado (os fechos não se cruzam: o motor não importa o Generate, nem ele
 *   o motor);
 * - **o fecho dos `import` do Generate**: tirado em doze pontos e unido; um arquivo que só existiu entre eles
 *   escaparia à contagem dos 27 — não à trava, que roda a ferramenta;
 * - **o ramo de trabalho de cada vizinho** (`motor-v2` do Generate, os `claude/*` do motor): mediu-se a `main`;
 *   commit que só existiu no ramo — o `d2f71e4` foi mesclado depois do `geradoEm`, então a rodada pode ter
 *   lido um estado do ramo — não foi rodado;
 * - **qual commit era o do disco**: nenhuma régua acha, e as provas não podem ser regravadas para dizê-lo;
 * - **a `lab01-50ha-ondulado.entrada.json`**: sai do `gleba-lab01.ts` e não roda vizinho — não está no retrato.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** As cinco provas, relativas a `docs/provas/`: quatro gravadas pela ferramenta e a saída de tela da mesma rodada. */
export const AS_PROVAS_JSON = [
  "LAB-07/ensaio-47ha.saida.json",
  "LAB-07/geo-antonina.saida.json",
  "LAB-07/lab01-50ha-ondulado.saida.json",
  "LAB-07/medicoes.json",
] as const;
export const A_PROVA_TXT = "LAB-07/medir.txt";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/testfit/ferramentas/medir.ts";

/** Os campos da raiz que a rodada decide e nenhum commit decide: ficam fora da comparação. */
export const FORA_DA_RAIZ = ["geradoEm", "ambiente"] as const;

/** O Lab: um commit, com de onde se sabe. */
export const O_RETRATO_DO_LAB07_MEDIR: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "25b62e0b3c9c038a40f8673d006f18c318040e7b",
    deOndeSeSabe: "o único commit das cinco provas (`git log`: o LAB-07, #4, 13/09/2026); a ferramenta é a desse commit",
  },
];

/**
 * **A janela do motor**: de `primeiro` a `ultimo`, a ferramenta do `25b62e0` refaz as cinco provas (com o
 * Generate em qualquer ponto da janela dele); em `antes` ela nem roda, em `depois` ela roda e acusa.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  primeiro: "0ece0b1969d9e1cfca8c1c44d1ceb582d69cca9c",
  ultimo: "66ece910a40b02b4172c2229283f512e8d2c0bb1",
  antes: "9404d78e9cd61cbcd58ea9babef72ec67f493aae",
  oQueDaAntes: "a ferramenta não roda: o motor ainda não tem `src/lib/lab/api.ts`",
  depois: "648ae78c711d010a94e0fc236382def6afed9b59",
  oQueDaDepois: "a ferramenta roda e acusa: 66 valores na `medicoes.json` e 6 linhas da `.txt`",
  oDoInstante: "d1998f161187ed1d27e0f50a817dda43b378912c",
  porQueODoInstante:
    "a ponta da origem às 14h31 UTC de 13/09, o `geradoEm` da `medicoes.json` — coerência, não medição: a ferramenta não o distingue dos outros",
} as const;

/**
 * **A janela do Generate**: de `primeiro` (o contrato de motor v1) a `ultimo`, a ferramenta do `25b62e0` refaz
 * as cinco provas; em `antes` e em `depois` (o contrato v2) ela nem roda.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "22502b380cfd2e58c7190707b9b3e57bb42b9155",
  ultimo: "8223873a05794411521ac3f4b13e46758ccf6627",
  antes: "805b6a059f24527935e60a24ffbafe48e3a5be50",
  oQueDaAntes: "a ferramenta não roda: ainda não existe `src/lib/import/parcelamento-externo.ts`",
  depois: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  oQueDaDepois: "a ferramenta não roda: o contrato de motor passa à versão 2, e o adaptador de então entende a 1",
  oDoInstante: "22502b380cfd2e58c7190707b9b3e57bb42b9155",
  porQueODoInstante:
    "a ponta da origem às 14h31 UTC de 13/09 — e o primeiro da janela; coerência, não medição: a ferramenta não o distingue dos outros nove",
} as const;

/**
 * Os dez commits da janela do Generate que tocam o fecho da ferramenta (ou `docs/glebas-padrao/`) — do mais novo
 * ao mais velho; o último é o `primeiro` da janela. Os dez refazem as cinco provas (medido em 19/10/2026, D430).
 */
export const OS_ESTADOS_DO_GENERATE: readonly string[] = [
  "8223873a05794411521ac3f4b13e46758ccf6627",
  "dfa2a61b2895a51adfed067efc501c3fc06c9312",
  "80d24f12b17a729592f8618b6646be52b7d5e081",
  "639c0e15618f86c26129eb3b2ce36fb9e12504d0",
  "ff65dad7653f7002166484b967b51d6026ad6945",
  "bf092fc5ce130567149481fdd107db079fe5e894",
  "503b4a2b3255b1b28fc9c83b4de7930953bc3599",
  "510e6f8606cf200b15dda514646736d7f02cd923",
  "8fd954b4a2a3be9eaa3b8c5ffc7a6c07a8eb437e",
  "22502b380cfd2e58c7190707b9b3e57bb42b9155",
];

/**
 * A troca que dá os dentes do eixo do Generate, feita na CÓPIA temporária (nunca no vizinho): a tolerância de
 * apoio da via no Validator, de 0,75 m para 0,5 m. Tem de casar uma vez no `invariantes.ts` do instante.
 */
export const A_TROCA_DOS_DENTES = {
  arquivo: "src/lib/engine/invariantes.ts",
  de: "const TOL_APOIO_VIA_M = 0.75;",
  para: "const TOL_APOIO_VIA_M = 0.5;",
} as const;

/** Um caminho em que a prova e uma rodada diferem. */
export interface Diferenca {
  onde: string;
  naProva: unknown;
  naRodada: unknown;
}

/** É tempo da rodada: o bloco `tempos` de cada gleba, ou um `ms` / `*_ms`. */
export function eTempo(chave: string): boolean {
  return chave === "tempos" || chave === "ms" || chave.endsWith("_ms");
}

/**
 * Compara uma prova `.json` com uma rodada, valor a valor, tirando {@link FORA_DA_RAIZ} da raiz e o que
 * {@link eTempo} diz, em qualquer profundidade — e mais nada.
 */
export function diferencasForaDoTempo(prova: unknown, rodada: unknown): Diferenca[] {
  const out: Diferenca[] = [];
  const andar = (onde: string, a: unknown, b: unknown) => {
    if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
      if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
        out.push({ onde, naProva: `${a.length} itens`, naRodada: `${b.length} itens` });
        return;
      }
      const ka = a as Record<string, unknown>;
      const kb = b as Record<string, unknown>;
      for (const k of [...new Set([...Object.keys(ka), ...Object.keys(kb)])].sort()) {
        if (onde === "" && (FORA_DA_RAIZ as readonly string[]).includes(k)) continue;
        if (eTempo(k)) continue;
        andar(`${onde}.${k}`, ka[k], kb[k]);
      }
      return;
    }
    if (a !== b) out.push({ onde, naProva: a, naRodada: b });
  };
  andar("", prova, rodada);
  return out;
}

/** A saída de tela sem o tempo: tira o *"· tempos: …"* do fim das linhas de perdas, e só ele. */
export function textoForaDoTempo(texto: string): string {
  return texto.replace(/^(perdas na ida: \d+) · tempos: .*$/gm, "$1");
}
