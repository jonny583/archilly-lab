/**
 * **LAB-201 (item 900) · o diagnóstico de relevo do LAB-07 roda o Generate e não escreve o commit dele — achado
 * por medição, e é uma janela ABERTA: a ferramenta não distingue Generate nenhum de 06/09 até hoje** (D429).
 *
 * # O que estava escrito, e o que faltava
 *
 * As duas provas `docs/provas/LAB-07/diagnostico-relevo.json` e `.txt` (gravadas uma vez só, no LAB-07,
 * `25b62e0`, 13/09/2026 14h43 UTC — a `.txt` é a saída de tela da mesma rodada) dão as estatísticas de três
 * interpoladores sobre a mesma nuvem de curvas. O segundo é o `criarModeloRelevo` **do Generate**
 * (`src/lib/engine/topografia.ts`), que roda ali por `import`; a prova não escreve **nenhum commit** dele. O
 * primeiro (o `campoRelevo` do motor) está replicado na ferramenta, linha a linha, e por isso o motor não roda
 * — o retrato do LAB-198 dá as duas calando só o Generate. Eram as mais velhas do retrato que esta máquina
 * consegue rodar: as do LAB-02 ao LAB-06 precisam do `.wasm` do Symbios, e nelas o Generate julga o que o
 * Symbios gerou — sem o `.wasm` não há o que julgar.
 *
 * # A janela, achada rodando a ferramenta
 *
 * Rodada em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `25b62e0` e o Generate em estados da história de primeiro pai da `main` dele. A ferramenta não precisa do
 * Symbios nem do motor, então roda **inteira**. Compara-se a prova valor a valor, **fora os `ms`** de cada
 * interpolador (o tempo da rodada, que nenhum commit decide) — e a `.txt` linha a linha, fora o *"— N ms"*:
 *
 * | o Generate em | o que muda contra a prova |
 * |---|---|
 * | `14b6227` (06/09, 03h05 UTC) e antes (`f62a416`, e o pai dele, sem `topografia.ts`) | **a ferramenta nem roda** — o modelo ainda não tem `espacamentoDoDado` |
 * | **`645a572` (06/09, 03h16 UTC, *"P43 na tela"*) … `1ee9459` (19/10, a ponta de hoje)** | **zero** — as duas provas, valor a valor e linha a linha |
 *
 * - **Coberta inteira, e não por amostra.** O fecho dos `import` da ferramenta dentro do Generate (`bun build
 *   --metafile`, em quatro pontos: `645a572`, `22502b3`, `641addb`, `1ee9459`) é `topografia.ts`, e desde
 *   `e4f6109` também `normas/index.ts` e `normas/br.ts`. Os três arquivos mudaram em **cinco** dos 299 commits
 *   da janela ({@link OS_ESTADOS_DO_FECHO}); os cinco deram zero, e as duas pontas também.
 * - **A ponta do instante está dentro**: o Generate da origem às 14h43 UTC de 13/09 era `22502b3` (10/09) —
 *   zero. Como no LAB-200, a data não erra; mas não erra porque a ferramenta não distingue nada, não porque
 *   acerte.
 * - **A comparação tem dentes**: com o Generate no instante e o número de vizinhos do modelo trocado de 6 para
 *   7 na cópia ({@link A_TROCA_DOS_DENTES}), seis valores mudam (o *"sobre valor de curva"* vai de 49,8 % para
 *   46,9 %). A comparação enxerga o interpolador do Generate.
 *
 * # O que se escreve: a janela, com UMA borda
 *
 * O que as provas calam é **"o Generate a partir do P43 na tela"**: `645a572` em diante, até onde se mediu.
 * Não há borda de depois. O provável, pelo instante, é `22502b3`; **coerência, não medição**, e fica dito assim.
 *
 * # O que este módulo faz
 *
 * {@link O_RETRATO_DO_LAB07_RELEVO} escreve o Lab; {@link A_JANELA_DO_GENERATE}, a janela. A trava
 * (`tests/retrato-do-lab07-relevo.test.ts`) monta as duas árvores numa pasta temporária, por caminho, e roda a
 * ferramenta de então: no começo da janela, no instante e no último medido (as duas provas, iguais), na borda
 * de antes (tem de NÃO refazer) e com a troca dos dentes (tem de acusar). **As provas não se tocam** (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio** ({@link OS_ESTADOS_DO_FECHO}): medidos aqui e no D429, não a cada verde;
 * - **o Generate depois de `1ee9459`**: a janela é aberta até onde se mediu, e não se estende sozinha;
 * - **qual commit era o do disco**: nenhuma régua acha, e a prova não pode ser regravada para dizê-lo;
 * - **o ramo `motor-v2` do Generate**: mediu-se a `main` (é ela que os clones leem); um commit que só existiu
 *   no ramo de trabalho e nunca entrou na `main` não foi rodado;
 * - **o fecho dos `import`**: tirado em quatro pontos e unido; um arquivo que só existiu entre eles escaparia
 *   à contagem dos cinco — não à trava, que roda a ferramenta;
 * - **o `campoRelevo` do motor**: está replicado na ferramenta, e a fidelidade da cópia ao motor de então
 *   (*"linhas 605-633 do commit medido"*, sem commit escrito) é outra pergunta — o motor não roda aqui.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** As duas provas, relativas a `docs/provas/`: a gravada pela ferramenta e a saída de tela da mesma rodada. */
export const AS_PROVAS = ["LAB-07/diagnostico-relevo.json", "LAB-07/diagnostico-relevo.txt"] as const;

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/testfit/ferramentas/diagnostico-relevo.ts";

/** Os blocos da prova que trazem `ms` (o tempo da rodada, que nenhum commit decide): o `ms` fica fora. */
export const BLOCOS_COM_TEMPO = ["testfit", "generate", "lab01Corrigido"] as const;

/** O Lab: um commit, com de onde se sabe. */
export const O_RETRATO_DO_LAB07_RELEVO: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "25b62e0b3c9c038a40f8673d006f18c318040e7b",
    deOndeSeSabe: "o único commit das duas provas e da ferramenta (`git log`: o LAB-07, #4, 13/09/2026)",
  },
];

/**
 * **A janela do Generate**: de `primeiro` (o P43 na tela) até `ultimoMedido` (a ponta da origem em 19/10/2026),
 * a ferramenta do `25b62e0` refaz as duas provas; em `antes` ela nem roda. Não há borda de depois.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "645a572370332ed68669cbde83b6a4aeddf4d669",
  ultimoMedido: "1ee94598e406b6e190066a1c382286421e0b3b0f",
  antes: "14b62271bf9d7b695f69ee8da9ddda8c970a6efa",
  oQueDaAntes: "a ferramenta não roda: o modelo de relevo ainda não tem `espacamentoDoDado`",
  depois: null,
  oDoInstante: "22502b380cfd2e58c7190707b9b3e57bb42b9155",
  porQueODoInstante:
    "a ponta da origem às 14h43 UTC de 13/09, o commit das provas — coerência, não medição: a ferramenta não o distingue dos outros",
} as const;

/**
 * Os cinco commits da janela em que o fecho dos `import` da ferramenta dentro do Generate mudou — do mais novo
 * ao mais velho, o último é o `primeiro` da janela. Os cinco refazem as provas (medido em 19/10/2026, D429).
 */
export const OS_ESTADOS_DO_FECHO: readonly string[] = [
  "641addb0d572a833d91583e40848f7c4cf05135b",
  "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  "e4f6109d452b74a68e5a2a26bf6cf5a501032695",
  "54f6f73795600beed87018e0299c6e85f8d568d2",
  "645a572370332ed68669cbde83b6a4aeddf4d669",
];

/**
 * A troca que dá os dentes da trava, feita na CÓPIA temporária do Generate (nunca no vizinho): o número de
 * vizinhos do modelo de relevo, de 6 para 7. Tem de casar uma vez no `topografia.ts` do instante.
 */
export const A_TROCA_DOS_DENTES = {
  arquivo: "src/lib/engine/topografia.ts",
  de: "const k = opcoes.vizinhos ?? 6;",
  para: "const k = opcoes.vizinhos ?? 7;",
} as const;

/** Um caminho em que a prova e uma rodada diferem. */
export interface Diferenca {
  onde: string;
  naProva: unknown;
  naRodada: unknown;
}

/** Compara a prova `.json` com uma rodada, valor a valor, tirando só o `ms` de {@link BLOCOS_COM_TEMPO}. */
export function diferencasForaDoTempo(prova: unknown, rodada: unknown): Diferenca[] {
  const limpar = (x: unknown): unknown => {
    const c = structuredClone(x) as Record<string, Record<string, unknown> | undefined>;
    for (const b of BLOCOS_COM_TEMPO) if (c[b] && typeof c[b] === "object") delete c[b]!["ms"];
    return c;
  };
  const out: Diferenca[] = [];
  const andar = (onde: string, a: unknown, b: unknown) => {
    if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
      if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
        out.push({ onde, naProva: `${a.length} itens`, naRodada: `${b.length} itens` });
        return;
      }
      const ka = a as Record<string, unknown>;
      const kb = b as Record<string, unknown>;
      for (const k of [...new Set([...Object.keys(ka), ...Object.keys(kb)])].sort()) andar(`${onde}.${k}`, ka[k], kb[k]);
      return;
    }
    if (a !== b) out.push({ onde, naProva: a, naRodada: b });
  };
  andar("", limpar(prova), limpar(rodada));
  return out;
}

/** A saída de tela sem o tempo: tira o *"— N ms"* do fim de cada linha, e só ele. */
export function textoForaDoTempo(texto: string): string {
  return texto.replace(/ — \d+ ms$/gm, "");
}
