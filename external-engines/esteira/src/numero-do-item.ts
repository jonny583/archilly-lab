/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NÚMERO DO ITEM DA CAIXA NÃO TEM TETO DE CASAS. (LAB-113, item 030, D340)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A proposta do LAB-112: *"o número do item da caixa tem três casas fixas —
 * `caixa-vazia-era-verdade.ts` (`^\d{3}`) e `leituras.test.ts` leem o nome com exatamente três
 * algarismos; um `1000.md` cairia fora da régua que existe para impedir a caixa vazia falsa. A
 * convenção do nome é da direção."* **A direção respondeu a convenção no item 030** (15/10/2026):
 *
 * 1. **três casas no MÍNIMO, sem teto** — `001`…`899`, `901`…`999`, `1000`, `1001`;
 * 2. **`900` é reservado**: o item permanente *"lista própria"*, que nunca vira `-FEITO`; a
 *    numeração comum pula o `900`;
 * 3. **"o menor número ainda não feito" é comparação NUMÉRICA**, nunca de texto — em ordem de texto
 *    `"1000" < "900" < "901"`.
 *
 * Enumerados os lugares (os `.ts` versionados de `external-engines/`, fora `upstream/`), três
 * leituras do nome do item pela forma, todas com teto de três casas:
 *
 * | onde | a forma | o que ela faz com o `1000.md` |
 * |---|---|---|
 * | `caixa-vazia-era-verdade.ts`, `ehItemAberto` | `^\d{3}(-…)?\.md$` | **não é item**: a caixa com `1000.md` aberto sai *vazia* — a declaração FALSA que a régua existe para pegar sai VERDADEIRA |
 * | `caixa-vazia-era-verdade.ts`, `numeroDoItem` | `^(\d{3})` | **lê `100`**: o número errado, não a ausência — e é ele que diz se o item é o próximo ou um pulado |
 * | `leituras.test.ts`, `numeroDe` (a guarda do número repetido, D273) | `^(\d{3}(?:-adendo)?)(?:-FEITO)?\.md$` | fora da guarda — **e o `025-adendo-2-FEITO.md` de hoje também**, que ela nunca viu |
 *
 * E uma ordenação por TEXTO: os `abertos` de `aCaixaEstavaVazia` saíam por `.sort()`.
 *
 * **E o reservado é a outra metade da convenção.** A régua da caixa vazia contava o `900.md` como
 * item aberto, e com ele *maior* que todo `-FEITO` o veredicto era *"aberta com o próximo"* — a
 * declaração **verdadeira** de hoje (*"a caixa só tem o 900"*) sairia **FALSA**. Nenhuma prova
 * gravada a chamou com o `900` (as nove declarações do LAB-90 são de 09 a 11/10, e o `900.md` nasceu
 * em 12/10), por isso o defeito estava aberto e verde.
 *
 * Por isso a forma mora **num lugar só** (este arquivo) e há uma régua contra o teto renascer ao
 * lado ({@link conferirTetoNoItem}).
 */

import { semComentarios } from "./varredura-de-chamadas.ts";

/** O número de um item da caixa: **três casas ou mais**. Em `String.raw` para entrar em `new RegExp`. */
export const ITEM_DA_CAIXA = String.raw`\d{3,}`;

/**
 * O item permanente *"lista própria"* (convenção da direção, item 030): nunca vira `-FEITO`, e só
 * vale quando não há outro item aberto. **Não é item da direção** para a régua da caixa vazia.
 */
export const ITEM_RESERVADO = 900;

/**
 * A forma do nome: o número, um sufixo opcional (`-adendo`, `-adendo-2`, `-bis`, e o estado
 * `-FEITO` / `-RETIRADO`), e `.md`. Os sufixos existem e são legítimos (item 030, regra 3).
 */
const NOME = new RegExp(String.raw`^(${ITEM_DA_CAIXA})(-[A-Za-z0-9-]+)?\.md$`);
const ESTADO = /-(FEITO|RETIRADO)$/i;

export type EstadoDoItem = "aberto" | "feito" | "retirado";

export interface NomeDoItem {
  /** O nome lido, inteiro. */
  nome: string;
  /** O número, como NÚMERO — é por ele que se ordena. */
  numero: number;
  /** O sufixo sem o estado (`-adendo`, `-adendo-2`, ou `""`): adendo e item são dois objetos. */
  sufixo: string;
  estado: EstadoDoItem;
  /**
   * A IDENTIDADE do item (D273): o número **como número** e o sufixo — `013.md` e `013-FEITO.md`
   * são o mesmo; `010-FEITO.md` e `010-adendo-FEITO.md` não. `0030.md` colide com `030.md`.
   */
  identidade: string;
}

/** Lê o nome de um arquivo da caixa. `null` quando não é item (`COMO_FUNCIONA.md`, `09.md`). */
export function lerNomeDoItem(nome: string): NomeDoItem | null {
  const m = NOME.exec(nome);
  if (!m) return null;
  const numero = Number(m[1]);
  // A casa confere o número que guarda (LAB-52): `\d{3,}` sem teto aceita 400 algarismos, e eles
  // viram `Infinity` — ou um inteiro que já não é exato. Isso não é item: é recusa.
  if (!Number.isFinite(numero) || numero > Number.MAX_SAFE_INTEGER) return null;
  const resto = m[2] ?? "";
  const e = ESTADO.exec(resto);
  const sufixo = e ? resto.slice(0, e.index) : resto;
  const estado: EstadoDoItem = !e ? "aberto" : e[1]!.toUpperCase() === "FEITO" ? "feito" : "retirado";
  return { nome, numero, sufixo, estado, identidade: `${numero}${sufixo.toLowerCase()}` };
}

/** Ordem de fila: pelo NÚMERO, e no empate o item antes do adendo (`010` < `010-adendo` < `010-adendo-2`). */
export function compararItens(a: NomeDoItem, b: NomeDoItem): number {
  if (a.numero !== b.numero) return a.numero - b.numero;
  return a.sufixo < b.sufixo ? -1 : a.sufixo > b.sufixo ? 1 : 0;
}

/** Os nomes que são item, em ordem de fila — nunca de texto. */
export function itensEmOrdem(nomes: readonly string[]): NomeDoItem[] {
  return nomes
    .map(lerNomeDoItem)
    .filter((i): i is NomeDoItem => i !== null)
    .sort(compararItens);
}

/**
 * **O PRÓXIMO item a fazer** — *"o menor número ainda não feito"*, em comparação NUMÉRICA, e
 * **pulando o reservado**: o `900` só é o próximo quando não há outro aberto (o texto do `900.md`
 * diz *"quando a caixa não tiver outro item"*). Sem isto, o `900` aberto para sempre passaria na
 * frente do `901` no dia em que ele existir.
 *
 * `null` quando não há item aberto nenhum: a caixa está vazia.
 */
export function proximoItem(nomes: readonly string[]): NomeDoItem | null {
  const abertos = itensEmOrdem(nomes).filter((i) => i.estado === "aberto");
  return abertos.find((i) => i.numero !== ITEM_RESERVADO) ?? abertos[0] ?? null;
}

/**
 * Uma leitura de algarismos no TEXTO de um programa — uma sequência de `\d` / `[0-9]` com seus
 * quantificadores — e a largura que ela aceita. Devolve também quantos caracteres consumiu.
 */
const ALGARISMO = /^(?:\\{1,2}d|\[0-9\])/;
const QUANTIFICADOR = /^(?:\{(\d+)(,(\d*))?\}|\?|\+|\*)/;

export function larguraDosAlgarismos(texto: string): { min: number; max: number; consumido: number } | null {
  let resto = texto;
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
      if (!Number.isFinite(n)) return null;
      min += n;
      max = q[2] === undefined ? max + n : q[3] === "" ? Infinity : max + Number(q[3]);
    }
  }
  return tokens === 0 ? null : { min, max, consumido: texto.length - resto.length };
}

/**
 * **O SUJEITO, escrito** (§1-C: *regra de forma sem o sujeito escrito manda na coisa errada*): a
 * régua só olha o programa que, no CÓDIGO, fala da caixa — o caminho `caixa-de-entrada` ou o estado
 * `FEITO` / `RETIRADO` de um item — ou que importa a forma única ou a régua da caixa vazia (a
 * régua da caixa vazia, depois do conserto, não diz mais `FEITO` no código: sem esta linha, o
 * arquivo para o qual a régua nasceu sairia do sujeito dela). Um `\d{4}` de data num arquivo de
 * geometria não é dela.
 */
export function falaDaCaixa(codigo: string): boolean {
  return /caixa-de-entrada|FEITO|RETIRADO|numero-do-item\.ts|caixa-vazia-era-verdade\.ts/.test(codigo);
}

/**
 * As linhas (1-based) em que o CÓDIGO — sem comentário — de um programa que fala da caixa lê uma
 * sequência de algarismos com **teto de três casas ou mais** (`\d{3}`, `\d\d\d`, `[0-9]{3}`,
 * `\d{3,4}`). Sem teto (`\d{3,}`, `\d+`) não é a doença.
 *
 * **O que esta régua NÃO olha, e vai dito:**
 *
 * - a ordenação por TEXTO de nomes de item (`.sort()`, `localeCompare`) — não se distingue, no
 *   texto do programa, de ordenar qualquer outra lista; a defesa é {@link itensEmOrdem} e a trava
 *   do lado ruim na `caixa-vazia.test.ts`;
 * - o teto de uma ou duas casas — não é número de item (três no mínimo); e o teto de três casas que
 *   leia OUTRA coisa no mesmo arquivo cai na régua e vai às exceções, com o motivo;
 * - o número montado por concatenação ou por `padStart` — isso ESCREVE nome, não lê;
 * - programa que lê a caixa sem nomear a pasta nem o estado no código — fica fora do sujeito;
 * - comentário — é relato da forma velha, não régua.
 */
export function tetoNoItemDoCodigo(texto: string): number[] {
  const codigo = semComentarios(texto);
  if (!falaDaCaixa(codigo)) return [];
  const linhas: number[] = [];
  const inicio = /(?:\\{1,2}d|\[0-9\])/g;
  let ate = -1;
  for (const m of codigo.matchAll(inicio)) {
    if (m.index < ate) continue;
    const l = larguraDosAlgarismos(codigo.slice(m.index, m.index + 60));
    if (!l) continue;
    ate = m.index + l.consumido;
    if (Number.isFinite(l.max) && l.max >= 3) linhas.push(codigo.slice(0, m.index).split("\n").length);
  }
  return [...new Set(linhas)];
}

/**
 * Onde o teto FICA, de propósito — e por quê. Conferida nos dois sentidos: a exceção que deixar de
 * conter a forma reprova, para não virar licença velha.
 */
export const EXCECOES_DE_TETO_NO_ITEM: readonly { arquivo: string; motivo: string }[] = [
  {
    arquivo: "external-engines/esteira/tests/numero-do-item.test.ts",
    motivo: "a trava desta régua reproduz as formas velhas para demonstrar o lado ruim, em vez de lembrá-lo",
  },
  {
    arquivo: "external-engines/esteira/tests/disparos-em-vazio.test.ts",
    motivo:
      "lê a DATA da conta dos disparos (o ano de `dd/mm/aaaa`, quatro algarismos com teto) e fala da caixa porque abre o `COMO_FUNCIONA.md` dela — o caso que quase parece a doença e não é: não lê número de item",
  },
];

export interface TetoNoItem {
  arquivo: string;
  linhas: number[];
}

/** Confere um universo `{ arquivo, texto }`: os achados fora das exceções, e as exceções velhas. */
export function conferirTetoNoItem(arquivos: readonly { arquivo: string; texto: string }[]): {
  achados: TetoNoItem[];
  excecoesVelhas: string[];
  /** Quantos programas do universo falam da caixa — o tamanho do que a régua de fato leu. */
  doSujeito: number;
} {
  const excecoes = new Set(EXCECOES_DE_TETO_NO_ITEM.map((e) => e.arquivo));
  const achados: TetoNoItem[] = [];
  const comOTeto = new Set<string>();
  let doSujeito = 0;
  for (const { arquivo, texto } of arquivos) {
    if (falaDaCaixa(semComentarios(texto))) doSujeito += 1;
    const linhas = tetoNoItemDoCodigo(texto);
    if (linhas.length === 0) continue;
    comOTeto.add(arquivo);
    if (!excecoes.has(arquivo)) achados.push({ arquivo, linhas });
  }
  return { achados, excecoesVelhas: [...excecoes].filter((e) => !comOTeto.has(e)), doSujeito };
}
