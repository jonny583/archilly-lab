/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NÚMERO DA DECISÃO NÃO TEM TETO DE CASAS. (LAB-112, item 900, D339)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A proposta do LAB-104: *"a mesma pergunta para as travas que leem OUTRO nome pela forma — a
 * decisão (`D\d{2,3}`). Hoje não há defeito: a D1000 está a 669 decisões."* **A segunda frase
 * estava errada, e isto é medição.** Enumerados os lugares (os 246 `.ts` versionados de
 * `external-engines/`, fora `upstream/`), oito linhas de código leem a decisão pela forma:
 *
 * | onde | a forma | o que ela faz com a decisão de hoje |
 * |---|---|---|
 * | `classes-de-rodada.ts`, a classe `decisao-registrada` | `\bD\d\d\b —` | **duas casas fixas**: o título *"D339 — o Jonny decidiu"* sai **ÓRFÃO**, e *"D99 — …"* sai `decisao-registrada`. **Defeito ABERTO desde a D100** (03/10/2026) |
 * | `varredura-das-propostas.ts`, as decisões de um item | `\bD(\d{2,3})\b` | **três casas no máximo**: a `D1000` some da lista, em silêncio — e a lista é o que liga um item riscado ao seu par (`lab61`) |
 * | `varredura-do-que-eu-aceitei.ts`, seis linhas | `D\d+`, `^\|\s*D\d` | sem teto — servem |
 *
 * A primeira é a forma exata do D331 com outro prefixo — *régua nova nasce com a doença que a
 * velha já curou, um campo ao lado* (D263) — e ninguém a viu porque o único título do histórico
 * que ela segura é o de 20/09, *"D69 — a via desenhada à mão…"*, de antes da D100; os outros três
 * da classe a OUTRA forma pega (*"Decisão do Jonny…"*) ou o cabeçalho declara. **Teste que nunca
 * reprovou** porque nunca lhe deram o caso de três casas.
 *
 * Por isso a forma mora **num lugar só** ({@link DECISAO_DA_CASA}) e há uma régua contra o teto
 * renascer ao lado ({@link tetoDeCasasNoCodigo}).
 */

import { semComentarios } from "./varredura-de-chamadas.ts";

/**
 * O número de uma decisão desta casa: `D` e **duas casas ou mais** (`D01` a `D338` hoje; `D1000`
 * amanhã). Em `String.raw` para entrar em `new RegExp` sem dobrar barra. **Gulosa**: `D1000` casa
 * inteiro. Quem a usa põe a fronteira (`\b`) dos dois lados — sem ela, `D10` casa dentro de `D100`.
 */
export const DECISAO_DA_CASA = String.raw`D\d{2,}`;

/** As decisões citadas num texto, sem repetição e em ordem de texto (`D100` antes de `D99`). */
export function decisoesCitadas(texto: string): string[] {
  return [...new Set(texto.match(new RegExp(String.raw`\b${DECISAO_DA_CASA}\b`, "g")) ?? [])].sort();
}

/**
 * Uma leitura do número da decisão no TEXTO de um programa: `D`, um parêntese de captura
 * opcional, e uma sequência de `\d` / `[0-9]` com seus quantificadores.
 *
 * **A doença é o TETO**: a forma que aceita no máximo *n* casas, com *n* ≥ 2 — `D\d\d`, `D\d{2}`,
 * `D\d{2,3}`, `D\d\d\d?`, `D[0-9]{3}`. Sem teto (`D\d+`, `D\d{2,}`) não é a doença.
 *
 * **O que esta régua NÃO olha, e vai dito:**
 *
 * - `D\d` sem quantificador — teto de UMA casa: lê *"começa com D e um algarismo"*, não o número
 *   (é a forma de `^\|\s*D\d` na `varredura-do-que-eu-aceitei.ts`, que filtra linha de tabela);
 * - o número montado por concatenação (`"D" + n`) e a forma escrita com outra letra (`d\d\d` com
 *   a bandeira `i`);
 * - comentário — é relato da forma velha, não régua.
 */
const INICIO = /(?:(?<=\\b)|(?<![A-Za-z0-9_$\\]))D/g;
const ALGARISMO = /^(?:\\{1,2}d|\[0-9\])/;
const QUANTIFICADOR = /^(?:\{(\d+)(,(\d*))?\}|\?|\+|\*)/;

/** A largura que uma leitura aceita: `null` quando não é leitura de número de decisão. */
export function larguraDaLeitura(depoisDoD: string): { min: number; max: number } | null {
  let resto = depoisDoD.replace(/^\((?:\?:)?/, "");
  let min = 0;
  let max = 0;
  let tokens = 0;
  for (;;) {
    const a = ALGARISMO.exec(resto);
    if (!a) break;
    resto = resto.slice(a[0].length);
    tokens += 1;
    const q = QUANTIFICADOR.exec(resto);
    if (!q) {
      min += 1;
      max += 1;
      continue;
    }
    resto = resto.slice(q[0].length);
    if (q[0] === "?") max += 1;
    else if (q[0] === "+") {
      min += 1;
      max = Infinity;
    } else if (q[0] === "*") max = Infinity;
    else {
      const n = Number(q[1]);
      // O `{n}` saiu de `\d+`, então é finito — mas a casa confere o número que guarda (LAB-52).
      if (!Number.isFinite(n)) return null;
      min += n;
      max = q[2] === undefined ? max + n : q[3] === "" ? Infinity : max + Number(q[3]);
    }
  }
  return tokens === 0 ? null : { min, max };
}

/** As linhas (1-based) em que o CÓDIGO — sem comentário — lê a decisão com teto de duas casas ou mais. */
export function tetoDeCasasNoCodigo(texto: string): number[] {
  const codigo = semComentarios(texto);
  const linhas: number[] = [];
  for (const m of codigo.matchAll(INICIO)) {
    const l = larguraDaLeitura(codigo.slice(m.index + 1, m.index + 60));
    if (l && Number.isFinite(l.max) && l.max >= 2) linhas.push(codigo.slice(0, m.index).split("\n").length);
  }
  return linhas;
}

/**
 * Onde o teto FICA, de propósito — e por quê. **Uma só: a trava desta régua**, que reproduz as
 * duas formas velhas para demonstrar o lado ruim em vez de lembrá-lo. A lista é conferida nos dois
 * sentidos: a exceção que deixar de conter a forma reprova, para não virar licença velha.
 */
export const EXCECOES_DE_TETO: readonly { arquivo: string; motivo: string }[] = [
  {
    arquivo: "external-engines/esteira/tests/numero-da-decisao.test.ts",
    motivo: "a trava desta régua reproduz as duas formas velhas para demonstrar o lado ruim, em vez de lembrá-lo",
  },
];

/** Uma leitura com teto achada fora das exceções. Lista vazia é a única saída aceitável. */
export interface TetoDeCasas {
  arquivo: string;
  linhas: number[];
}

/**
 * Confere um universo de arquivos `{ arquivo, texto }`: devolve os que leem a decisão com teto e
 * **não** estão nas exceções, e as exceções que **não** o têm mais (licença velha).
 */
export function conferirTetoDeCasas(arquivos: readonly { arquivo: string; texto: string }[]): {
  achados: TetoDeCasas[];
  excecoesVelhas: string[];
} {
  const excecoes = new Set(EXCECOES_DE_TETO.map((e) => e.arquivo));
  const achados: TetoDeCasas[] = [];
  const comOTeto = new Set<string>();
  for (const { arquivo, texto } of arquivos) {
    const linhas = tetoDeCasasNoCodigo(texto);
    if (linhas.length === 0) continue;
    comOTeto.add(arquivo);
    if (!excecoes.has(arquivo)) achados.push({ arquivo, linhas });
  }
  const excecoesVelhas = [...excecoes].filter((e) => !comOTeto.has(e));
  return { achados, excecoesVelhas };
}
