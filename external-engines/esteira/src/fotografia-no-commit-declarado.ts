/**
 * **LAB-196 (item 900) · a fotografia do LAB-60 se retira no commit que ela declara — e o motivo de não
 * regerá-la, perguntado à ferramenta** (D424).
 *
 * # O que estava escrito, e o que a ferramenta respondeu
 *
 * A lista das espécies de prova (`src/regerar-a-varredura.ts`, item 024, LAB-91) põe
 * `LAB-60/configuracao-do-motor.json` entre as **fotografias** — as que nunca se regeram —, com o motivo:
 *
 * > *"mede a árvore de configuração do CLONE VIZINHO: o universo está fora desta casa, e recontar com o
 * > motor andado mede outra coisa com o nome da antiga (D288)"*
 *
 * É uma frase sobre o que aconteceria se alguém rodasse a ferramenta (`ferramentas/lab60.ts`). Ninguém a
 * tinha rodado desde 07/10/2026: a prova tem um commit só (`ce19bfc`) e nenhuma trava chama a ferramenta.
 * E o cabeçalho daquele módulo promete que a trava *"reprova nos dois sentidos"* — inclusive a
 * *"fotografia que deixou de precisar ser fotografia"* —, e nenhum teste fazia a segunda metade.
 *
 * Perguntada em 19/10/2026, em clones locais numa pasta de rascunho (o vizinho não foi tocado):
 *
 * | o Lab em | o motor em | contra a prova versionada |
 * |---|---|---|
 * | `ce19bfc` (o commit da prova) | `4181e95` (o que ela declara) | **igual** |
 * | `a644dee` (a ponta de hoje) | `4181e95` | **igual** |
 * | `a644dee` | `89b26ce` (a ponta de hoje do motor) | **102 linhas diferentes** — 369 → 616 arquivos, `temCI` de `false` a `true`, um desligador a mais |
 *
 * Fora as duas chaves do MOMENTO ({@link AS_CHAVES_DO_MOMENTO}). O motivo **se sustenta**: com o motor
 * andado, a ferramenta mede outra coisa. E a prova é mais do que fotografia: ela é **função do commit que
 * declara**, e a régua de hoje a refaz igual. Então ela se confere — retirada no commit declarado, numa pasta
 * temporária, sem sobregravar nada (o D182 fica de pé: o que se escreve é rascunho, não a prova).
 *
 * # O que este módulo faz
 *
 * {@link compararSemOMomento} compara duas saídas da ferramenta chave a chave, nos dois sentidos, fora as
 * do momento. A trava (`tests/fotografia-no-commit-declarado.test.ts`) a chama duas vezes:
 *
 * 1. **no commit declarado** — tem de dar **zero** diferenças: a prova é o que a ferramenta mede ali;
 * 2. **na ponta de hoje do motor** — tem de dar **alguma** diferença, ou a fotografia *"deixou de precisar
 *    ser fotografia"* e o motivo dela, escrito na lista, ficou falso. É o segundo sentido que o cabeçalho
 *    de `regerar-a-varredura.ts` prometia.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **as outras três fotografias da lista**: `LAB-02/completo.saida-cortada.json` roda o Symbios e precisa
 *   do `.wasm`, ausente nesta máquina; `LAB-31/sabotagem.json` registra um ATO, e retirá-lo é refazer a
 *   sabotagem; `LAB-48/violacoes-do-motor-padrao.json` roda o motor do vizinho e o Validator do Generate,
 *   em dois commits que a prova teria de declarar — não perguntado nesta rodada, e perguntado no LAB-197
 *   (D425) por outra trava, `tests/fotografia-do-lab48.test.ts`, porque a prova não declara commit nenhum;
 * - **as chaves do momento**: `quando` é a hora da rodada, e `osClonesVizinhos` é o estado dos três clones
 *   na máquina daquele dia — nenhuma das duas é medição do motor, e as duas ficam fora da comparação;
 * - **um clone raso do motor**: sem o commit declarado na história, a trava reprova com a receita, não pula.
 */

/** As chaves que dizem QUANDO e EM QUE MÁQUINA a ferramenta rodou — não o que ela mediu. */
export const AS_CHAVES_DO_MOMENTO = ["quando", "osClonesVizinhos"] as const;

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-60/configuracao-do-motor.json";

/** A ferramenta que a grava, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab60.ts";

/** Uma diferença entre duas saídas, pelo nome da chave de primeiro nível. */
export interface DiferencaDaFotografia {
  chave: string;
  tipo: "difere" | "so-na-prova" | "so-na-retirada";
}

/**
 * Compara a prova com uma saída retirada, chave a chave de primeiro nível e nos dois sentidos, fora
 * {@link AS_CHAVES_DO_MOMENTO}. O valor se compara pelo `JSON.stringify` — a ordem das chaves é a que a
 * ferramenta grava, e uma ordem diferente é saída diferente.
 */
export function compararSemOMomento(
  prova: Readonly<Record<string, unknown>>,
  retirada: Readonly<Record<string, unknown>>,
): DiferencaDaFotografia[] {
  const fora = new Set<string>(AS_CHAVES_DO_MOMENTO);
  const diferencas: DiferencaDaFotografia[] = [];
  for (const chave of Object.keys(prova)) {
    if (fora.has(chave)) continue;
    if (!(chave in retirada)) diferencas.push({ chave, tipo: "so-na-prova" });
    else if (JSON.stringify(prova[chave]) !== JSON.stringify(retirada[chave])) diferencas.push({ chave, tipo: "difere" });
  }
  for (const chave of Object.keys(retirada)) {
    if (fora.has(chave)) continue;
    if (!(chave in prova)) diferencas.push({ chave, tipo: "so-na-retirada" });
  }
  return diferencas;
}

/** O commit do motor que a prova declara — lido da própria prova, nunca escrito aqui. */
export function oCommitDeclarado(prova: Readonly<Record<string, unknown>>): string | null {
  const clone = prova["oClone"] as { head?: unknown } | undefined;
  return typeof clone?.head === "string" && /^[0-9a-f]{40}$/.test(clone.head) ? clone.head : null;
}
