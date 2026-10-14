/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NOME DO PROMPT TEM DUAS CASAS OU MAIS. (LAB-104, item 900, D331)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Os prompts desta casa passaram de 99 no LAB-100 (13/10/2026). Cinco réguas vivas casavam o
 * nome com **exatamente dois algarismos** (`LAB-\d\d`), escritas quando todo prompt tinha dois:
 *
 * | onde | o que a forma de duas casas fazia com `LAB-103` |
 * |---|---|
 * | `varredura-das-propostas.ts`, a seção em prosa | lia **`LAB-10`** — origem errada, e a trava acusava a citação certa |
 * | `varredura-das-propostas.ts`, a marca do executor | não casava — item riscado **certo** acusado de não ter executor |
 * | `recado.test.ts`, o universo dos relatórios | `LAB-100.md` a `LAB-103.md` **fora do universo**: a trava *"todo relatório tem recado"* nunca os olhou |
 * | `recado.test.ts`, o item do ACUMULADO | reprovava `ACUMULADO — inclui os recados LAB-102 e LAB-103` |
 * | `propostas.test.ts`, o executor | reprovava o executor `LAB-103` |
 *
 * **A terceira é a que importa, e é da espécie "teste que nunca reprovou"**: medido no LAB-104,
 * apagando de `RECADOS.md` o recado do LAB-103 a trava continuava **9 pass · 0 fail**. Não é que
 * ela não tenha reprovado: ela **não podia** — o relatório não estava no que ela lia, e o
 * universo que ela publicava (*"mais de 20"*) não muda quando quatro somem de 95.
 *
 * Por isso a forma mora **num lugar só** ({@link PROMPT_DO_LAB}) e há uma régua contra a forma de
 * duas casas renascer ao lado ({@link duasCasasNoCodigo}): *régua nova nasce com a doença que a
 * velha já curou, um campo ao lado* (D263) — e a `classes-de-rodada.ts` já tinha curado esta
 * mesma doença em outro campo, com o comentário dizendo *"a primeira versão casava `LAB-\d\d`"*.
 */

import { semComentarios } from "./varredura-de-chamadas.ts";

/**
 * O nome de um prompt desta casa: `LAB-` e **duas casas ou mais**. Em `String.raw` para entrar
 * em `new RegExp` sem dobrar barra. **Guloso**: `LAB-103` casa inteiro, nunca `LAB-10`.
 */
export const PROMPT_DO_LAB = String.raw`LAB-\d{2,}`;

/**
 * As formas de **duas casas fixas**, no TEXTO de um programa: `LAB-\d\d`, `LAB-\d{2}`,
 * `LAB-[0-9]{2}` e `LAB-[0-9][0-9]` — quando não seguidas de mais um algarismo ou de um
 * quantificador (`LAB-\d{2,}` e `LAB-\d\d\d?` não são a doença).
 *
 * **O que esta régua NÃO olha, e vai dito:** nome montado por concatenação (`"LAB-" + n`),
 * `\d+` (que já aceita três casas) e outro prefixo (`LF-`, `T-`), que tem a sua própria forma
 * em `promptsDoCabecalho`.
 */
const FORMA_DE_DUAS_CASAS = /LAB-(?:\\d\\d|\\d\{2\}|\[0-9\]\{2\}|\[0-9\]\[0-9\])(?!\\d|\[0-9\]|\{|\?|\+|\*)/g;

/** As linhas (1-based) em que o CÓDIGO — sem comentário — usa a forma de duas casas. */
export function duasCasasNoCodigo(texto: string): number[] {
  const codigo = semComentarios(texto);
  const linhas: number[] = [];
  for (const m of codigo.matchAll(FORMA_DE_DUAS_CASAS)) {
    linhas.push(codigo.slice(0, m.index).split("\n").length);
  }
  return linhas;
}

/**
 * Onde a forma de duas casas FICA, de propósito — e por quê. **Uma só: a trava desta régua**, que
 * reproduz a forma velha para demonstrar o lado ruim em vez de lembrá-lo.
 *
 * As ferramentas `lab66.ts` e `lab70.ts` **não** são exceção, embora fiquem fora do verde: as duas
 * repetem a trava do recado para medi-la, e a `lab66.ts` guarda o precedente com todas as letras —
 * *"a trava foi consertada… a ferramenta não, porque ela não roda no verde"* (D231). Ferramenta que
 * espelha uma trava anda junto com ela; e a `lab70.ts` regera a prova do item 003 a cada rodada.
 *
 * **A lista é conferida nos dois sentidos**: a exceção que deixar de conter a forma reprova, para
 * não virar licença velha.
 */
export const EXCECOES_DE_DUAS_CASAS: readonly { arquivo: string; motivo: string }[] = [
  {
    arquivo: "external-engines/esteira/tests/nome-do-prompt.test.ts",
    motivo: "a trava desta régua reproduz a forma velha para demonstrar o lado ruim, em vez de lembrá-lo",
  },
];

/** Uma régua de duas casas achada fora das exceções. Lista vazia é a única saída aceitável. */
export interface DuasCasas {
  arquivo: string;
  linhas: number[];
}

/**
 * Confere um universo de arquivos `{ arquivo, texto }`: devolve os que usam a forma de duas
 * casas e **não** estão nas exceções, e as exceções que **não** a usam mais (licença velha).
 */
export function conferirDuasCasas(arquivos: readonly { arquivo: string; texto: string }[]): {
  achados: DuasCasas[];
  excecoesVelhas: string[];
} {
  const excecoes = new Set(EXCECOES_DE_DUAS_CASAS.map((e) => e.arquivo));
  const achados: DuasCasas[] = [];
  const comAForma = new Set<string>();
  for (const { arquivo, texto } of arquivos) {
    const linhas = duasCasasNoCodigo(texto);
    if (linhas.length === 0) continue;
    comAForma.add(arquivo);
    if (!excecoes.has(arquivo)) achados.push({ arquivo, linhas });
  }
  const excecoesVelhas = [...excecoes].filter((e) => !comAForma.has(e));
  return { achados, excecoesVelhas };
}
