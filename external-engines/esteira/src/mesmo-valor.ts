/**
 * ════════════════════════════════════════════════════════════════════════════
 *  "O PUBLICADO CONFERE COM O REFEITO" TEM UMA DEFINIÇÃO SÓ.
 *  (LAB-110, item 900 — proposta do LAB-109: as ferramentas que gravam o veredito, D337)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O D336 passou a cobrar que o veredito gravado numa prova não contradiga a evidência ao lado, e
 * deixou de fora, dito, **o código que grava a prova**. O LAB-110 o mediu por LUGAR — todo `.ts`
 * versionado de `external-engines/`, fora `upstream/` e as travas, **166 arquivos** — e achou
 * **quinze linhas em onze arquivos** que gravam `limpo`, `aceito` ou `confere` (o LAB-109 nomeou
 * sete ferramentas; as outras quatro estavam fora de `esteira/ferramentas/` ou eram repasse):
 *
 * | quem grava | onde | de onde vem o veredito | pode divergir da evidência ao lado? |
 * |---|---|---|---|
 * | copia do Validator | `lab02`, `lab04`, `lab05`, `lab08` (`limpo`), `testfit/ferramentas/medir.ts` e `src/passagens-dos-legais.ts` (`aceito`) | `montarRelatorio` do Generate, que deriva `limpo` **e** `aceito` de `invariantes.violacoes === 0` — o MESMO campo que vai ao lado como `violacoes`, nas **4 de 4** versões do arquivo desde que nasceu (10/09/2026) | **não**, enquanto as duas metades saírem do mesmo relatório — e se o Generate mudar a definição, a prova regerada reprova no D336, e o achado é sobre ele |
 * | deriva ali, de um número | `lab94` (`limpo`), `lab41` (`aceito`, três linhas: derivado, sem plano, repasse) | a mesma variável que vai ao lado | não |
 * | deriva ali, de uma condição | `symbios/adapter/ferramentas/medir.ts` (`confere`) | grava em `outputs/`, fora de `docs/` | fora do universo das provas |
 * | o clone vizinho | `src/commit-dos-vizinhos.ts` | o `git status` vazio | a forma sem regra do D336 |
 * | **compara o publicado com o refeito** | **`lab39` (`confere`, duas vezes)** | **`JSON.stringify(a) === JSON.stringify(b)`** | **SIM** |
 *
 * **A última linha é o defeito, e ele é de regra, não de valor.** A ferramenta do LAB-39 dizia
 * *"confere"* quando as duas metades tinham os mesmos **bytes**; a régua do D336 diz *"confere"*
 * quando têm o mesmo **valor** — a ordem das chaves não conta. Medido no LAB-110: trocada só a
 * ORDEM em que o `lab39` monta o agregado publicado (nenhum número mexido), a ferramenta gravou
 * **56 divergências** e a régua do D336 acusou a prova de **contradizer a própria evidência** —
 * a ferramenta dizendo *"diverge"* de dois objetos que a régua vê iguais. Dois instrumentos com o
 * mesmo nome de veredito e duas definições: o Lab estaria a um passo de acusar o próprio dado.
 * E a trava que confere aquela prova (`tests/acesso.test.ts`) tinha a definição da ferramenta.
 *
 * Por isso a igualdade mora **num lugar só** ({@link mesmoValor}), e a régua do D336, a ferramenta
 * e a trava a chamam. **Não** é para todo `JSON.stringify` comparado: em **determinismo** — a mesma
 * função duas vezes —, a igualdade de bytes é a pergunta certa, e a ordem das chaves é parte do
 * que se repete. A régua {@link igualdadePorTextoDoPublicado} tem o sujeito escrito: a comparação
 * do **publicado** com o **refeito**.
 *
 * # O que esta régua NÃO olha, e vai dito
 *
 * - a comparação em **mais de uma linha**, ou com o texto guardado numa variável antes
 *   (`const a = JSON.stringify(x)`);
 * - a linha que não diz `publicado` (nem `pub`): a régua lê o **nome**, e nome é ortografia (D137) —
 *   o sujeito escrito é o que a impede de proibir o determinismo, e é também o seu limite;
 * - a cópia do Validator: as duas metades viajarem do **mesmo** relatório é verdade hoje nos seis
 *   lugares, e quem cobra o resultado é o D336 na prova gravada;
 * - no censo dos que gravam ({@link GRAVADORES_DE_VEREDITO}): o veredito com outro nome, a chave
 *   montada (`[campo]: …`, como o `vereditoDeIdentidade` do D335) e o que entra por espalhamento
 *   (`...relatorio`) — a régua lê a linha que escreve o nome.
 */

import { semComentarios } from "./varredura-de-chamadas.ts";

/**
 * O texto canônico de um valor: as chaves de objeto **em ordem alfabética**, a ordem das listas
 * **mantida**. Dois valores com o mesmo texto canônico são o mesmo valor.
 */
export function canonico(x: unknown): string {
  if (Array.isArray(x)) return `[${x.map(canonico).join(",")}]`;
  if (x !== null && typeof x === "object") {
    const o = x as Record<string, unknown>;
    return `{${Object.keys(o)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonico(o[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(x) ?? "undefined";
}

/**
 * **A** igualdade do *"o publicado confere com o refeito"*: o mesmo valor, qualquer que seja a
 * ordem das chaves; uma lista em outra ordem é outro valor, e um número a mais também.
 */
export function mesmoValor(a: unknown, b: unknown): boolean {
  return canonico(a) === canonico(b);
}

/**
 * A comparação por TEXTO numa linha só — `JSON.stringify(…) === JSON.stringify(…)`, `!==`, ou
 * `expect(JSON.stringify(…)).toBe(JSON.stringify(…))`.
 */
const COMPARACAO_POR_TEXTO = /JSON\.stringify\(.*\)\s*(?:[!=]==?|\)\s*\.toBe\()\s*JSON\.stringify\(/;
/** O sujeito: a linha fala do publicado. */
const O_PUBLICADO = /publicad|\bpub\b/i;

/** As linhas (1-based) em que o CÓDIGO — sem comentário — compara o publicado por texto. */
export function igualdadePorTextoDoPublicado(texto: string): number[] {
  return semComentarios(texto)
    .split("\n")
    .flatMap((l, i) => (COMPARACAO_POR_TEXTO.test(l) && O_PUBLICADO.test(l) ? [i + 1] : []));
}

/**
 * Onde a forma fica, de propósito. **Uma só: a trava desta régua**, que reproduz a forma velha
 * para demonstrar o lado ruim em vez de lembrá-lo. Conferida nos dois sentidos: exceção que não
 * tem mais a forma reprova.
 */
export const EXCECOES_DE_IGUALDADE_POR_TEXTO: readonly { arquivo: string; motivo: string }[] = [
  {
    arquivo: "external-engines/esteira/tests/mesmo-valor.test.ts",
    motivo: "a trava desta régua reproduz a forma velha para demonstrar o lado ruim, em vez de lembrá-lo",
  },
];

/** Confere um universo `{ arquivo, texto }`: os achados fora das exceções, e as exceções velhas. */
export function conferirIgualdadePorTexto(arquivos: readonly { arquivo: string; texto: string }[]): {
  lidos: number;
  achados: { arquivo: string; linhas: number[] }[];
  excecoesVelhas: string[];
} {
  const excecoes = new Set(EXCECOES_DE_IGUALDADE_POR_TEXTO.map((e) => e.arquivo));
  const achados: { arquivo: string; linhas: number[] }[] = [];
  const comAForma = new Set<string>();
  for (const { arquivo, texto } of arquivos) {
    const linhas = igualdadePorTextoDoPublicado(texto);
    if (linhas.length === 0) continue;
    comAForma.add(arquivo);
    if (!excecoes.has(arquivo)) achados.push({ arquivo, linhas });
  }
  return { lidos: arquivos.length, achados, excecoesVelhas: [...excecoes].filter((e) => !comAForma.has(e)) };
}

// ───────────────────────────────────────────── quem grava o veredito, e de onde ele vem

/**
 * A linha de CÓDIGO que grava `limpo`, `aceito` ou `confere` — a propriedade com valor
 * (`limpo: x`) ou abreviada (`confere,` numa linha só). A declaração de tipo (`limpo: boolean`)
 * não é gravação.
 */
const GRAVA_VEREDITO = /(?:\b(?:limpo|aceito|confere)\s*:(?!\s*boolean\b)|^\s*(?:limpo|aceito|confere),\s*$)/;

/** As linhas (1-based) em que o código — sem comentário — grava um dos três vereditos. */
export function gravacoesDeVeredito(texto: string): number[] {
  return semComentarios(texto)
    .split("\n")
    .flatMap((l, i) => (GRAVA_VEREDITO.test(l) ? [i + 1] : []));
}

/** De onde vem o veredito que o arquivo grava. */
export type OrigemDoVeredito =
  | "copia-do-validator"
  | "deriva-ali"
  | "compara-o-publicado"
  | "fora-das-provas"
  | "clone-vizinho";

/**
 * **Os lugares que gravam veredito, fechados e com a contagem de linhas** — medidos no LAB-110
 * (D337). Arquivo novo que grava um dos três reprova até dizer de onde o veredito vem; contagem
 * que mudou também (para mais é gravação nova, para menos a linha envelheceu). E quem é
 * `"compara-o-publicado"` tem de chamar {@link mesmoValor}: é a classe que tinha a outra definição.
 */
export const GRAVADORES_DE_VEREDITO: readonly {
  arquivo: string;
  linhas: number;
  origem: OrigemDoVeredito;
  porque: string;
}[] = [
  ...["lab02", "lab04", "lab05", "lab08"].map((l) => ({
    arquivo: `external-engines/esteira/ferramentas/${l}.ts`,
    linhas: 1,
    origem: "copia-do-validator" as const,
    porque:
      "o `limpo` ← `r.validator.limpo` ao lado das `violacoes` ← `r.validator.violacoes` — as duas metades do MESMO relatório, " +
      "e o Generate deriva o `limpo` desse mesmo campo (4 de 4 versões de `montarRelatorio` desde 10/09/2026)",
  })),
  {
    arquivo: "external-engines/esteira/src/passagens-dos-legais.ts",
    linhas: 1,
    origem: "copia-do-validator",
    porque:
      "`aceito` e `violacoes` do mesmo `escolhida.relatorio`, ou os dois nulos sem relatório (o nulo é *não medido*, D23)",
  },
  {
    arquivo: "external-engines/testfit/ferramentas/medir.ts",
    linhas: 2,
    origem: "copia-do-validator",
    porque:
      "o `aceito` ← `rel.aceito` com as `violacoes` ← `rel.validator.violacoes` do mesmo relatório; e o `aceito` falso ao lado da " +
      "`recusa` da ponte, quando não há relatório",
  },
  {
    arquivo: "external-engines/esteira/ferramentas/lab94.ts",
    linhas: 1,
    origem: "deriva-ali",
    porque: "o `limpo` ← `inv.violacoes === 0` ao lado das `violacoes` ← `inv.violacoes` — a mesma variável",
  },
  {
    arquivo: "external-engines/esteira/ferramentas/lab41.ts",
    linhas: 3,
    origem: "deriva-ali",
    porque:
      "`aceito` de `lotes != null` ao lado do próprio `lotes`; `false` com `lotes: null` sem plano; e o repasse de " +
      "`medir` para o ponto da aresta, com o `lotes` junto",
  },
  {
    arquivo: "external-engines/esteira/ferramentas/lab39.ts",
    linhas: 2,
    origem: "compara-o-publicado",
    porque: "o agregado e o confronto publicados contra os refeitos dos crus — por `mesmoValor` desde o LAB-110",
  },
  {
    arquivo: "external-engines/symbios/adapter/ferramentas/medir.ts",
    linhas: 1,
    origem: "fora-das-provas",
    porque: "o `confere` da grade 3×3 do LAB-01 vai a `outputs/lab01/`, fora de `docs/` e do universo do D336",
  },
  {
    arquivo: "external-engines/esteira/src/commit-dos-vizinhos.ts",
    linhas: 1,
    origem: "clone-vizinho",
    porque: "o `git status --porcelain` vazio, na hora — a forma sem regra declarada do D336",
  },
];

export interface ConferenciaDosGravadores {
  lidos: number;
  gravacoes: number;
  /** Arquivo que grava veredito e não está na lista. */
  semOrigem: { arquivo: string; linhas: number[] }[];
  /** Linha da lista cuja contagem não bate com o código (ou que não grava mais nada). */
  contagemQueMudou: { arquivo: string; declaradas: number; achadas: number }[];
  /** Quem compara o publicado e não chama `mesmoValor`. */
  semAIgualdadeUnica: string[];
}

/** Confere o universo `{ arquivo, texto }` contra a lista fechada, nos dois sentidos. */
export function conferirOsGravadores(arquivos: readonly { arquivo: string; texto: string }[]): ConferenciaDosGravadores {
  const declarados = new Map(GRAVADORES_DE_VEREDITO.map((g) => [g.arquivo, g]));
  const achados = new Map<string, number[]>();
  for (const { arquivo, texto } of arquivos) {
    const linhas = gravacoesDeVeredito(texto);
    if (linhas.length > 0) achados.set(arquivo, linhas);
  }
  const semOrigem = [...achados]
    .filter(([a]) => !declarados.has(a))
    .map(([arquivo, linhas]) => ({ arquivo, linhas }));
  const contagemQueMudou = GRAVADORES_DE_VEREDITO.filter((g) => (achados.get(g.arquivo)?.length ?? 0) !== g.linhas).map(
    (g) => ({ arquivo: g.arquivo, declaradas: g.linhas, achadas: achados.get(g.arquivo)?.length ?? 0 }),
  );
  const texto = new Map(arquivos.map((a) => [a.arquivo, a.texto]));
  const semAIgualdadeUnica = GRAVADORES_DE_VEREDITO.filter(
    (g) => g.origem === "compara-o-publicado" && !/\bmesmoValor\(/.test(semComentarios(texto.get(g.arquivo) ?? "")),
  ).map((g) => g.arquivo);
  return {
    lidos: arquivos.length,
    gravacoes: [...achados.values()].reduce((s, l) => s + l.length, 0),
    semOrigem,
    contagemQueMudou,
    semAIgualdadeUnica,
  };
}
