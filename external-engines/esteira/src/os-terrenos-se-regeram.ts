/**
 * **LAB-195 (item 900) · os terrenos de prova se regeram byte a byte — e o índice deles grava em metro
 * quadrado** (D423).
 *
 * # O que estava escrito, e o que a árvore respondeu
 *
 * Os quatro terrenos de `docs/terrenos/` e o `indice.json` ao lado saem de uma ferramenta só,
 * `external-engines/symbios/adapter/ferramentas/gerar-terrenos.ts`, desde o LAB-01 (10/09/2026). Nenhuma
 * trava a rodava. A régua do §7 (`tests/medicao-em-metros.test.ts`, LAB-143) declarava a ferramenta em
 * exceção — ela gravava `area_ha` no índice — com o motivo *"regerá-lo reescreve os quatro terrenos de
 * prova"*. Era uma frase sobre o que aconteceria, e ninguém a tinha perguntado à ferramenta.
 *
 * Perguntada em 19/10/2026: rodada numa cópia da árvore, a ferramenta reescreveu os **cinco** arquivos
 * (quatro terrenos e o índice) **byte a byte iguais** aos versionados. E os terrenos saem de `gerar`, que
 * não lê o índice: trocar a chave do índice não toca terreno nenhum. O motivo da exceção era falso, e a
 * exceção saiu — o índice grava `area_m2`, o `areaCalculada_m2` de cada terreno, sem arredondar; os
 * quatro `.geojson` ficaram como estavam.
 *
 * # O que este módulo faz
 *
 * {@link compararPastas} compara o que a ferramenta grava com o que o `git` carrega em `docs/terrenos/`,
 * arquivo por arquivo e byte a byte, nos dois sentidos — o que a ferramenta grava e a árvore não tem, e o
 * que a árvore tem e a ferramenta não grava. A trava (`tests/os-terrenos-se-regeram.test.ts`) roda a
 * ferramenta de verdade, no Node, numa pasta temporária, e chama esta função.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **se a geometria está certa**: a trava diz que o arquivo é o que a ferramenta grava hoje, não que a
 *   ferramenta grava o terreno certo — essa é a pergunta do LAB-01 (a procedência dentro de cada arquivo)
 *   e das provas que usam os terrenos;
 * - **o Node de outra versão**: a trava roda no Node desta máquina (o 22 do verde); um Node que formatasse
 *   número de outro jeito mudaria os bytes, e a trava acusaria — o que é a resposta certa;
 * - **`outputs/lab01/`**: as saídas do LAB-01 são do `medir.ts`, que só roda com o `.wasm`, e ficam fora.
 */

/** Um defeito da comparação. */
export interface ProblemaDosTerrenos {
  /** o nome do arquivo, relativo à pasta (`completo.geojson`) */
  arquivo: string;
  tipo: "difere" | "falta-na-arvore" | "sobra-na-arvore";
  detalhe: string;
}

/** A pasta que a ferramenta grava, relativa à raiz do repositório. */
export const A_PASTA = "docs/terrenos";

/** A ferramenta que grava a pasta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/symbios/adapter/ferramentas/gerar-terrenos.ts";

/** Onde os dois textos começam a divergir — para o detalhe dizer a linha, não só "difere". */
function primeiraLinhaDiferente(a: string, b: string): number {
  const la = a.split("\n");
  const lb = b.split("\n");
  const n = Math.max(la.length, lb.length);
  for (let i = 0; i < n; i++) if (la[i] !== lb[i]) return i + 1;
  return n;
}

/**
 * Compara, arquivo por arquivo, o que a ferramenta gravou (`gerados`) com o que o `git` carrega
 * (`versionados`). As chaves são nomes de arquivo relativos à pasta; os valores, o conteúdo inteiro.
 */
export function compararPastas(
  gerados: Readonly<Record<string, string>>,
  versionados: Readonly<Record<string, string>>,
): ProblemaDosTerrenos[] {
  const problemas: ProblemaDosTerrenos[] = [];
  for (const [arquivo, texto] of Object.entries(gerados).sort(([a], [b]) => a.localeCompare(b))) {
    const naArvore = versionados[arquivo];
    if (naArvore === undefined) {
      problemas.push({ arquivo, tipo: "falta-na-arvore", detalhe: `a ferramenta grava ${arquivo} e o git não o carrega` });
    } else if (naArvore !== texto) {
      problemas.push({
        arquivo,
        tipo: "difere",
        detalhe: `${arquivo} difere do que a ferramenta grava a partir da linha ${primeiraLinhaDiferente(naArvore, texto)}`,
      });
    }
  }
  for (const arquivo of Object.keys(versionados).sort()) {
    if (!(arquivo in gerados)) {
      problemas.push({ arquivo, tipo: "sobra-na-arvore", detalhe: `o git carrega ${arquivo} e a ferramenta não o grava` });
    }
  }
  return problemas;
}
