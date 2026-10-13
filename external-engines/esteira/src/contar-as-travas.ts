/**
 * O NÚMERO DE TRAVAS DO PORTÃO SEM CLONES, contado por EXECUÇÃO dentro da trava. (LAB-98, item 900)
 *
 * # O defeito, medido em 13/10/2026
 *
 * O número de travas do trabalho de CI `guardas-sem-clones` mora **escrito à mão** em quatro
 * lugares (`CLAUDE.md`, `ONDE_PARAMOS.md`, `FILA.md` e o `verde.yml`, duas vezes). Duas travas o
 * vigiavam, e as duas eram de CONCORDÂNCIA:
 *
 * 1. as quatro cópias concordam entre si (LAB-42);
 * 2. as quatro cópias concordam com a prova do LAB-84, `quantasTravasNaLista` (LAB-93, D311).
 *
 * **Mas a prova do LAB-84 é ela mesma uma medição feita à mão** (`bun run lab84`), e nada a
 * reexecutava. O LAB-96 e o LAB-97 puseram 21 travas em arquivos da lista e não rodaram a
 * ferramenta: a prova ficou em **698**, as quatro cópias ficaram em **698**, as duas travas
 * ficaram **verdes** — e a suíte rodada dizia **719**.
 *
 * > **Número escrito à mão conferido contra prova medida à mão é concordância, não medição.**
 * > Quando a prova é função da árvore de agora, a trava tem de recontar — é o D299 aplicado a
 * > uma prova que ficou fora da lista dele.
 *
 * # O que este módulo faz
 *
 * Lê a linha que o `bun test` imprime no fim (*"Ran N tests across M files."*) e devolve os dois
 * números — ou `null`, nunca zero, quando a linha não veio (D23): rodada que estourou antes de
 * contar não é rodada com zero travas.
 *
 * **O que ele NÃO mede, e vai dito:** se os arquivos passam **sem os clones**. Isso é o resto da
 * prova do LAB-84, e depende de ambiente (uma cópia do repositório sem os vizinhos); a trava
 * reconta só a SOMA, que é a parte que é função pura da árvore.
 */

/** O que a rodada do `bun test` contou. */
export interface ContagemDaRodada {
  travas: number;
  arquivos: number;
}

/**
 * Lê *"Ran N tests across M files."* do fim da saída do `bun test`. **`null` quando a linha não
 * existe** — e a última ocorrência vale, porque é a do resumo.
 */
export function lerARodada(saida: string): ContagemDaRodada | null {
  const m = [...saida.matchAll(/^Ran (\d+) tests? across (\d+) files?\./gm)].at(-1);
  if (m === undefined) return null;
  return { travas: Number(m[1]), arquivos: Number(m[2]) };
}

/** Um desacordo entre o que foi contado e o que está escrito, nomeando o lugar. */
export interface DesacordoDaContagem {
  onde: string;
  escrito: number | null;
  contado: number;
}

/**
 * Compara a contagem POR EXECUÇÃO com cada número escrito. Escrito `null` (a prova sem a soma)
 * **reprova** — soma com buraco não confere nada.
 */
export function conferirAContagem(
  contado: number,
  escritos: Readonly<Record<string, number | null>>,
): DesacordoDaContagem[] {
  return Object.entries(escritos)
    .filter(([, n]) => n !== contado)
    .map(([onde, escrito]) => ({ onde, escrito, contado }));
}
