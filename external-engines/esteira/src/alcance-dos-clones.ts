/**
 * QUEM ALCANÇA UM CLONE VIZINHO — por `import`, e por TODA a cadeia. (LAB-93)
 *
 * # A régua que havia, e ela errava para os dois lados
 *
 * A trava que impede o CI de virar falso verde confere que nenhum teste da lista do
 * trabalho **sem clones** importe de um clone vizinho. Ela lia o especificador do
 * `import` de cada teste — conserto do D142, e correto até onde ia — e o comparava com
 * uma lista de PREFIXOS: `@generate/`, `@testfit/`, `@symbios/`, `../../testfit/`.
 *
 * Prefixo não é alcance, e por isso ela errava nas duas direções:
 *
 * - **larga demais:** reprovou `tests/legais-do-contrato.test.ts`, que importa
 *   `../../testfit/adapter/src/legais-do-contrato.ts` — um módulo cuja única
 *   importação é um **tipo** de `./contrato-v1.ts`, que não importa nada. Nenhum clone
 *   no caminho, e a régua disse que havia;
 * - **estreita demais, e isto é o lado caro:** `../src/` **não está** entre os
 *   prefixos. Um teste da lista que importasse `../src/passagens-dos-legais.ts` —
 *   que importa `@testfit/api.ts` — passaria pela régua e **quebraria o CI**, que é
 *   exatamente o que ela existe para impedir.
 *
 * > **Régua de PREFIXO mede onde o arquivo mora; a pergunta era o que ele ALCANÇA.**
 * > Estreita demais e larga demais são o mesmo defeito: ninguém a conferiu dos dois
 * > lados.
 *
 * # Como esta anda
 *
 * Fecho transitivo dos `import` relativos, a partir do arquivo de entrada. Qualquer
 * especificador que **não** começa com `.` e casa um dos apelidos de clone é alcance,
 * e o caminho até ele volta junto — porque *"este teste alcança um clone"* sem dizer
 * **por onde** manda alguém procurar.
 *
 * Arquivo que não se consegue ler **não é silêncio**: entra como `naoLidos`, e quem
 * chama decide. Engolir leitura falha aqui seria o `catch` que o LAB-91 tirou.
 */

/**
 * OS APELIDOS DE CLONE, **derivados do `tsconfig.json`** — nunca escritos à mão.
 *
 * A lista à mão era `["@generate/", "@testfit/", "@symbios/"]`, e ela estava errada
 * nos dois extremos, medido contra os `paths` de verdade:
 *
 * - **`@symbios/` NÃO é clone.** Ele resolve para `../symbios/adapter/src/*`, que mora
 *   **dentro deste repositório** — o adaptador do Symbios é desta casa (D14). Proibi-lo
 *   no portão proibia a própria casa;
 * - **`@/` FALTAVA**, e é clone: resolve para `urban-create-hub-41d93a4d/src/*`.
 *
 * > **Apelido que decide o portão não se escreve à mão: ele se LÊ de onde ele mora.**
 * > A lista à mão tinha um apelido que não era clone e não tinha um que era — e
 * > nenhuma das duas metades falhava fazendo barulho.
 *
 * O critério é um só e é o que a palavra "clone" quer dizer: o alvo do apelido, depois
 * de resolvido, **sai da raiz deste repositório**.
 */
export function apelidosDeClone(
  paths: Record<string, string[]>,
  resolverAlvo: (alvo: string) => string,
  raizDoRepositorio: string,
): string[] {
  const fora = (alvo: string) => !resolverAlvo(alvo).startsWith(raizDoRepositorio);
  return Object.entries(paths)
    .filter(([, alvos]) => alvos.some(fora))
    .map(([apelido]) => apelido.replace(/\*$/, ""))
    .sort();
}

export interface Alcance {
  /** `true` quando algum arquivo do fecho importa de um clone. */
  alcanca: boolean;
  /** O caminho de arquivos até o primeiro alcance — vazio quando não alcança. */
  porOnde: string[];
  /** O especificador do clone que foi alcançado, quando houve. */
  oClone: string | null;
  /** Quantos arquivos o fecho visitou. */
  visitados: number;
  /** Arquivos que o leitor não devolveu — declarados, nunca engolidos. */
  naoLidos: string[];
}

/**
 * Os `import ... from "x"` de um texto — o especificador, nunca a menção (D142), e
 * **sem o `import type`**, que não existe em tempo de execução.
 *
 * A distinção não é purismo: ela é a terceira correção desta mesma régua na mesma
 * rodada. Sem ela, o fecho acusou `tests/contrato.test.ts` de alcançar
 * `@symbios/contrato.ts` — e alcança, **por um `import type`** em `gleba-v1.ts`, que
 * o Bun apaga antes de rodar. O teste passa sem clone nenhum, e a medição por
 * execução do LAB-84 prova isso em 40 de 40.
 *
 * > **A pergunta do portão é de EXECUÇÃO, não de tipo.** `import type` é promessa para
 * > o `tsc`; o que o CI precisa saber é o que o Bun vai tentar abrir.
 */
export function especificadoresDe(texto: string): string[] {
  return [
    ...texto.matchAll(/^\s*import[^;]*?from\s+["']([^"']+)["']/gm),
    ...texto.matchAll(/^\s*export[^;]*?from\s+["']([^"']+)["']/gm),
  ]
    .filter((m) => !/^\s*(?:import|export)\s+type\b/.test(m[0]))
    .map((m) => m[1]!);
}

/**
 * Anda o fecho transitivo dos `import` relativos e diz se ele toca um clone.
 *
 * `ler` recebe o caminho absoluto e devolve o texto, ou `null` quando não há arquivo
 * — e `resolver` transforma (arquivo, especificador) em caminho absoluto. Os dois vêm
 * de fora para a trava poder rodar sobre texto em memória, sem disco: é como se
 * demonstra o lado ruim sem plantar arquivo na árvore.
 *
 * `apelidos` vem da `apelidosDeClone`, lida do `tsconfig.json` — nunca de uma lista
 * escrita aqui.
 */
export function alcanceDeClone(
  inicial: string,
  ler: (caminho: string) => string | null,
  resolver: (de: string, especificador: string) => string,
  apelidos: readonly string[],
): Alcance {
  const visitados = new Set<string>();
  const naoLidos: string[] = [];
  const fila: { arquivo: string; caminho: string[] }[] = [{ arquivo: inicial, caminho: [inicial] }];

  while (fila.length > 0) {
    const { arquivo, caminho } = fila.shift()!;
    if (visitados.has(arquivo)) continue;
    visitados.add(arquivo);

    const texto = ler(arquivo);
    if (texto === null) {
      naoLidos.push(arquivo);
      continue;
    }
    for (const esp of especificadoresDe(texto)) {
      const apelido = apelidos.find((a) => esp.startsWith(a));
      if (apelido) {
        return { alcanca: true, porOnde: caminho, oClone: esp, visitados: visitados.size, naoLidos };
      }
      if (esp.startsWith(".")) {
        const destino = resolver(arquivo, esp);
        if (!visitados.has(destino)) fila.push({ arquivo: destino, caminho: [...caminho, destino] });
      }
    }
  }
  return { alcanca: false, porOnde: [], oClone: null, visitados: visitados.size, naoLidos };
}
