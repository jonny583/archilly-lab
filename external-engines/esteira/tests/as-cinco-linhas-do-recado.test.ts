/**
 * **LAB-129 (item 900) · as cinco linhas do recado: "linha sem conteúdo leva `—`, nunca some"** (D357).
 *
 * ```sh
 * bun test tests/as-cinco-linhas-do-recado.test.ts
 * ```
 *
 * O `CLAUDE.md` §1 dá as cinco linhas do recado e manda que a linha sem conteúdo leve `—` e nunca
 * suma. A única trava olhava o ÚLTIMO recado e só a PRESENÇA da palavra: esvaziar uma linha, tirar
 * outra de um recado velho, trocar a ordem ou repetir uma não reprovava nenhuma das 1 370 travas da
 * esteira. Roda **sem clones** (só lê o `CLAUDE.md` e o `RECADOS.md` deste repositório), e por isso
 * está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_CINCO_LINHAS,
  A_REGRA,
  EXCECOES_HISTORICAS,
  conferirAsCincoLinhas,
  type ExcecaoHistorica,
} from "../src/as-cinco-linhas-do-recado.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RECADOS = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");
const CLAUDE = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");

const CAB = "=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-12 ===";
const BOAS = ["Estado: feito", "Feito: a régua", "Achados para outros apps ou Central: nada", "Depende do Jonny: —", "Próximo na fila: o 900"];
const bloco = (corpo: string[], cab = CAB, fim = true): string =>
  ["## 16/10/2026 · LAB-12 — a", "", "```", cab, ...corpo, ...(fim ? ["=== FIM ==="] : []), "```", ""].join("\n");
const tipos = (texto: string, excecoes: readonly ExcecaoHistorica[] = []): string[] =>
  conferirAsCincoLinhas(texto, excecoes).problemas.map((p) => p.tipo);

/**
 * Troca a PRIMEIRA ocorrência de `de` DEPOIS do cabeçalho do recado de `prompt`, e falha alto se ela
 * não existir dentro desse recado — mutação que não muda nada não prova nada.
 */
function trocarNoRecado(texto: string, prompt: string, de: string, para: string): string {
  const i = texto.indexOf(`· ${prompt} ===`);
  expect(i).toBeGreaterThan(0);
  const fim = texto.indexOf("=== FIM ===", i);
  const j = texto.indexOf(de, i);
  expect(j > i && j < fim).toBe(true);
  return texto.slice(0, j) + para + texto.slice(j + de.length);
}

describe("LAB-129 · a página de verdade — as cinco linhas, uma vez cada, na ordem, nenhuma calada", () => {
  const r = conferirAsCincoLinhas(RECADOS);

  test("a regra está escrita onde mora, e as cinco linhas são as do formato do CLAUDE.md §1", () => {
    expect(aRegraEstaEscrita(CLAUDE, A_REGRA)).toBe(true);
    const formato = /```\n=== RECADO PARA O CHAT — <app> · <prompt> ===\n([\s\S]*?)\n=== FIM ===/.exec(CLAUDE);
    expect(formato).not.toBeNull();
    const nomes = formato![1]!.split("\n").map((l) => l.replace(/ \.\.\.$/, ""));
    expect(nomes).toEqual([...AS_CINCO_LINHAS]);
  });

  test("o universo: os recados lidos são os de uma contagem ingênua, e não zero", () => {
    const ingenuos = RECADOS.match(/^=== RECADO PARA O CHAT/gm)!.length;
    console.log(
      `    ${r.recados} recados · ${r.comContinuacao} com continuação recuada · ${r.comAcumulado} com ACUMULADO · ` +
        `${r.perdoados.length} linha perdoada · ${r.problemas.length} problemas`,
    );
    expect(r.recados).toBe(ingenuos);
    expect(r.recados).toBeGreaterThanOrEqual(140);
    // As duas formas válidas além das cinco, contadas no LAB-129: se uma sumir, a régua leu menos.
    expect(r.comContinuacao).toBe(14);
    expect(r.comAcumulado).toBeGreaterThanOrEqual(4);
  });

  test("nenhum problema — e a lista diz QUAL, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("a exceção histórica é usada — uma linha só, a do LF-01 — e nenhuma sobra sem uso", () => {
    expect(EXCECOES_HISTORICAS).toHaveLength(1);
    expect(r.perdoados).toHaveLength(1);
    expect(r.perdoados[0]!.tipo).toBe("linha-solta");
    expect(r.excecoesSemUso).toEqual([]);
  });

  test("sem a exceção, o LF-01 reprova — o perdão é de verdade, não enfeite", () => {
    const sem = conferirAsCincoLinhas(RECADOS, []);
    expect(sem.problemas.map((p) => p.tipo)).toEqual(["linha-solta"]);
    expect(sem.problemas[0]!.detalhe).toContain("LF-01");
  });
});

describe("LAB-129 · as mutações medidas antes da régua, plantadas na página de verdade", () => {
  test("`Depende do Jonny:` vazio no recado do LAB-128 — antes, zero travas acusavam", () => {
    const m = trocarNoRecado(RECADOS, "LAB-128 (item 900)", "Depende do Jonny: nada.", "Depende do Jonny:");
    expect(tipos(m, EXCECOES_HISTORICAS)).toEqual(["linha-vazia"]);
  });

  test("a linha dos Achados tirada do recado do LAB-50 — antes, zero", () => {
    const i = RECADOS.indexOf("· LAB-50 ");
    const j = RECADOS.indexOf("\nAchados para outros apps ou Central:", i);
    const k = RECADOS.indexOf("\n", j + 1);
    const m = RECADOS.slice(0, j) + RECADOS.slice(k);
    expect(tipos(m, EXCECOES_HISTORICAS)).toEqual(["linha-que-falta"]);
  });

  test("`Feito:` antes de `Estado:` no recado do LAB-110 — antes, zero", () => {
    const i = RECADOS.indexOf("· LAB-110 ");
    const e = RECADOS.indexOf("\nEstado:", i);
    const a = RECADOS.indexOf("\nFeito:", e);
    const b = RECADOS.indexOf("\nAchados", a);
    const m = RECADOS.slice(0, e) + RECADOS.slice(a, b) + RECADOS.slice(e, a) + RECADOS.slice(b);
    expect(tipos(m, EXCECOES_HISTORICAS)).toEqual(["linha-fora-de-ordem"]);
  });

  test("`Depende do Jonny:` duas vezes no recado do LAB-90 — antes, zero", () => {
    const i = RECADOS.indexOf("· LAB-90 ");
    const a = RECADOS.indexOf("\nDepende do Jonny:", i);
    const b = RECADOS.indexOf("\n", a + 1);
    const m = RECADOS.slice(0, b) + "\nDepende do Jonny: nada." + RECADOS.slice(b);
    expect(tipos(m, EXCECOES_HISTORICAS)).toEqual(["linha-repetida"]);
  });
});

describe("LAB-129 · a régua — os dois lados demonstrados", () => {
  test("O LADO BOM: as cinco, na ordem, com `—`, com 'nada' e com texto", () => {
    expect(tipos(bloco(BOAS))).toEqual([]);
  });

  test("o caso válido que quase parece inválido: a linha calada seguida de continuação recuada tem conteúdo", () => {
    const corpo = [...BOAS];
    corpo.splice(1, 1, "Feito:", "  a régua, na linha de baixo");
    expect(tipos(bloco(corpo))).toEqual([]);
  });

  test("a continuação recuada não conta como linha a mais; a marca ACUMULADO vale logo depois do cabeçalho", () => {
    const corpo = ["ACUMULADO — inclui os recados LAB-11 e LAB-12", BOAS[0]!, "  continuação", ...BOAS.slice(1)];
    expect(tipos(bloco(corpo))).toEqual([]);
  });

  test("a marca ACUMULADO em outro lugar é linha solta", () => {
    const corpo = [BOAS[0]!, "ACUMULADO — inclui os recados LAB-11 e LAB-12", ...BOAS.slice(1)];
    expect(tipos(bloco(corpo))).toEqual(["linha-solta"]);
  });

  test("a linha calada reprova — só espaço também é calada", () => {
    const corpo = [...BOAS];
    corpo[3] = "Depende do Jonny:";
    expect(tipos(bloco(corpo))).toEqual(["linha-vazia"]);
    corpo[3] = "Depende do Jonny:   ";
    expect(tipos(bloco(corpo))).toEqual(["linha-vazia"]);
  });

  test("a linha que some reprova — cada uma das cinco", () => {
    for (let i = 0; i < 5; i++) {
      expect(tipos(bloco(BOAS.filter((_, j) => j !== i)))).toEqual(["linha-que-falta"]);
    }
  });

  test("o nome escrito errado é linha que falta E linha solta — não passa como texto", () => {
    const corpo = [...BOAS];
    corpo[2] = "Achados: nada";
    expect(tipos(bloco(corpo))).toEqual(["linha-solta", "linha-que-falta"]);
  });

  test("a linha repetida reprova, e a ordem trocada também", () => {
    expect(tipos(bloco([...BOAS, "Estado: de novo"]))).toEqual(["linha-repetida", "linha-fora-de-ordem"]);
    expect(tipos(bloco([BOAS[1]!, BOAS[0]!, ...BOAS.slice(2)]))).toEqual(["linha-fora-de-ordem"]);
  });

  test("o recado sem `=== FIM ===` reprova", () => {
    expect(tipos(bloco(BOAS, CAB, false))).toEqual(["recado-sem-fim"]);
  });

  test("bloco de código que não é recado não é lido", () => {
    expect(tipos("```\nEstado:\nqualquer coisa\n```\n" + bloco(BOAS))).toEqual([]);
    expect(conferirAsCincoLinhas("```\nsó código\n```\n").recados).toBe(0);
  });

  test("a exceção casa por cabeçalho, tipo e começo da linha — e a que não casa sobra, nos dois sentidos", () => {
    const corpo = [BOAS[0]!, BOAS[1]!, "Não saiu como pedido: x", ...BOAS.slice(2)];
    const e: ExcecaoHistorica = { cabecalho: CAB, tipo: "linha-solta", inicio: "Não saiu como pedido:", motivo: "teste" };
    const com = conferirAsCincoLinhas(bloco(corpo), [e]);
    expect(com.problemas).toEqual([]);
    expect(com.perdoados).toHaveLength(1);
    expect(com.excecoesSemUso).toEqual([]);
    const outroRecado = conferirAsCincoLinhas(bloco(corpo, CAB.replace("LAB-12", "LAB-13")), [e]);
    expect(outroRecado.problemas.map((p) => p.tipo)).toEqual(["linha-solta"]);
    expect(outroRecado.excecoesSemUso).toEqual([e]);
    const outroTipo = conferirAsCincoLinhas(bloco(BOAS.filter((_, j) => j !== 4)), [{ ...e, tipo: "linha-que-falta" }]);
    expect(outroTipo.problemas.map((p) => p.tipo)).toEqual(["linha-que-falta"]);
  });
});
