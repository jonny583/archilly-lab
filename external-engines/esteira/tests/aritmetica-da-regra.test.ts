/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-63 · As travas da regra da casa que ninguém somava.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A `CLAUDE.md` §6 é a página que eu leio antes de toda tarefa, e a §1-B diz dela, por
 * escrito: *"regra que ninguém pode desmentir é slogan (D136), e esta pode."* **Até o LAB-63
 * ela NÃO podia**, e o que não era medido era a aritmética:
 *
 * - a frase da partição dizia **NOVE + duas + três = 14** num total declarado de **16**;
 * - ela citava **D104** e **D175** como membros das classes, e nenhuma é linha da tabela;
 * - uma frase ainda contava a mesma lista como **"quinze"**.
 *
 * Estas travas não leem clone vizinho nenhum — só arquivo deste repositório — e por isso vão
 * no trabalho de CI que roda sem segredo.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  MARCAS_DE_CONTRAEXEMPLO,
  NUMEROS_EM_PALAVRA,
  lerNumeroEmPalavra,
  conferirAritmeticaDoPontoCego,
  varrerContraexemplosNasDecisoes,
} from "../src/varredura-do-que-eu-aceitei.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
const secao6 = claudeMd.slice(
  claudeMd.indexOf("## 6 · Medir antes de atribuir"),
  claudeMd.indexOf("## 7 · Entrega"),
);

describe("LAB-63 · a §6 fecha a conta", () => {
  const a = conferirAritmeticaDoPontoCego(secao6);

  test("zero problemas de aritmética na §6 de hoje", () => {
    expect(a.problemas).toEqual([]);
  });

  test("o total declarado é o número de linhas da tabela", () => {
    expect(a.totalDeclarado).toBe(a.linhasDaTabela.length);
  });

  test("as classes da partição SOMAM o total — era 14 de 16 até o LAB-63", () => {
    expect(a.somaDasCategorias).toBe(a.totalDeclarado ?? -1);
    expect(a.categorias.length).toBeGreaterThan(0);
  });

  test("toda decisão citada numa classe é linha da tabela", () => {
    const linhas = new Set(a.decisoesDasLinhas);
    for (const c of a.categorias) {
      for (const d of c.decisoesCitadas) expect(linhas.has(d)).toBe(true);
    }
  });

  test("cada linha da tabela está em EXATAMENTE uma classe", () => {
    const classificadas = a.categorias.flatMap((c) => c.decisoesCitadas);
    expect(new Set(classificadas).size).toBe(classificadas.length);
    const linhas = new Set(a.decisoesDasLinhas);
    const semClasse = [...linhas].filter((d) => !classificadas.includes(d));
    expect(semClasse).toEqual([]);
  });
});

describe("LAB-63 · a régua da §6 reprova, e NÃO fica calada", () => {
  test("partição que a régua não acha é PROBLEMA, nunca aprovação", () => {
    const semTabela = secao6.replace(/^\|\s*\*\*[^*]+\*\*\s*\|.*$/gm, "");
    const r = conferirAritmeticaDoPontoCego(semTabela);
    expect(r.categorias).toEqual([]);
    expect(r.problemas.map((p) => p.tipo)).toContain("particao-nao-encontrada");
  });

  test("classe a mais na soma reprova", () => {
    const r = conferirAritmeticaDoPontoCego(
      `${secao6}\n| **DUAS** | uma classe inventada | D18, D75 |\n`,
    );
    expect(r.problemas.map((p) => p.tipo)).toContain("categorias-nao-somam-o-total");
  });

  test("decisão citada numa classe sem ser linha da tabela reprova", () => {
    const r = conferirAritmeticaDoPontoCego(secao6.replace("D133 |", "D999 |"));
    expect(r.problemas.map((p) => p.tipo)).toContain("citada-na-categoria-sem-ser-linha");
  });

  test("total velho em outra frase reprova — era o 'quinze' de quando a lista tinha 15", () => {
    const r = conferirAritmeticaDoPontoCego(`${secao6}\ne três das quinze vezes eu errei.`);
    expect(r.problemas.map((p) => p.tipo)).toContain("total-velho-em-outra-frase");
  });

  test("palavra de número que a régua não conhece é PROBLEMA, e não `continue`", () => {
    const r = conferirAritmeticaDoPontoCego(
      `${secao6}\n| **SETENTA** | classe de palavra que o mapa não tem | D18 |\n`,
    );
    expect(r.problemas.map((p) => p.tipo)).toContain("palavra-de-numero-nao-reconhecida");
  });

  test("o mapa conhece as palavras de UM a VINTE, que é a faixa que a §6 usa", () => {
    for (const p of ["uma", "duas", "três", "quatro", "sete", "nove", "dez", "dezesseis"]) {
      expect(NUMEROS_EM_PALAVRA[p]).toBeGreaterThan(0);
    }
  });

  test("o acento não parte a palavra: 'três' vale 3, e não 'ês'", () => {
    const r = conferirAritmeticaDoPontoCego(
      "se repetiu três vezes\n| D18 (x) | a | b |\n| D75 (y) | a | b |\n| D98 (z) | a | b |\n" +
        "| **três** | a classe | D18, D75, D98 |\n",
    );
    expect(r.somaDasCategorias).toBe(3);
    expect(r.problemas).toEqual([]);
  });
});

describe("LAB-63 · onde o contraexemplo NÃO está", () => {
  const decisoes = readFileSync(join(RAIZ, "docs", "DECISOES.md"), "utf8");
  const cru = varrerContraexemplosNasDecisoes(decisoes, "decisao");
  const estreito = varrerContraexemplosNasDecisoes(decisoes, "frase");

  test("nenhuma regra minha é desmentida por decisão posterior na mesma frase da citação", () => {
    expect(estreito.filter((p) => !p.aRegraApontaParaAFrente)).toEqual([]);
  });

  test("a régua CRUA acha muito mais que a estreita — e a diferença é falso positivo", () => {
    expect(cru.length).toBeGreaterThan(estreito.length);
    expect(cru.length).toBeGreaterThan(10);
  });

  test("a régua estreita reprova um contraexemplo DE VERDADE, plantado", () => {
    const plantado =
      "\n## D01 · uma regra qualquer · 01/01/2026\n\nToda prova traz semente.\n" +
      "\n## D02 · o contraexemplo · 02/01/2026\n\nA regra da D01 estava falsa em 8 de 32.\n";
    const achados = varrerContraexemplosNasDecisoes(plantado, "frase");
    expect(achados).toHaveLength(1);
    expect(achados[0]!.aRegra).toBe("D01");
    expect(achados[0]!.oContraexemplo).toBe("D02");
    expect(achados[0]!.aRegraApontaParaAFrente).toBe(false);
  });

  test("a régua estreita NÃO acusa citação de apoio na mesma decisão", () => {
    const apoio =
      "\n## D01 · uma regra qualquer · 01/01/2026\n\nToda prova traz semente.\n" +
      "\n## D02 · outra coisa · 02/01/2026\n\nSegue a D01, como sempre.\n" +
      "Noutro assunto, a minha conta estava errada.\n";
    expect(varrerContraexemplosNasDecisoes(apoio, "frase")).toEqual([]);
    expect(varrerContraexemplosNasDecisoes(apoio, "decisao")).toHaveLength(1);
  });

  test("o vocabulário das marcas é fechado, e não vazio", () => {
    expect(MARCAS_DE_CONTRAEXEMPLO.length).toBeGreaterThanOrEqual(6);
  });
});

/**
 * O LEITOR COMPOSITIVO DE NÚMERO EM PALAVRA. (LAB-77, D251)
 *
 * A §6 chegou a `VINTE E DUAS` e **a régua do total devolveu `null`** — ela procurava a palavra
 * inteira num mapa que ia até `vinte`, e o regex capturava UMA palavra só. A trava do total
 * **deixou de medir em silêncio**, que é a forma de falha mais cara desta casa (D110, D123, e o
 * `exit 0, 0 testes` do item 003).
 *
 * > **Régua que conta até vinte numa lista que cresce é régua com data de validade.**
 */
describe("o número em palavra, inclusive COMPOSTO (D251)", () => {
  test("o que não compõe continua vindo do mapa", () => {
    expect(lerNumeroEmPalavra("dezenove")).toBe(19);
    expect(lerNumeroEmPalavra("vinte")).toBe(20);
    expect(lerNumeroEmPalavra("duas")).toBe(2);
  });

  test("compõe dezena e unidade — o caso que derrubou a guarda", () => {
    expect(lerNumeroEmPalavra("vinte e duas")).toBe(22);
    expect(lerNumeroEmPalavra("VINTE E DUAS")).toBe(22);
    expect(lerNumeroEmPalavra("vinte e três")).toBe(23);
    expect(lerNumeroEmPalavra("trinta e uma")).toBe(31);
  });

  test("atravessa a quebra de linha e o espaço repetido", () => {
    expect(lerNumeroEmPalavra("vinte   e\n duas")).toBe(22);
  });

  test("RECUSA o que não é número em português — não soma por soar parecido", () => {
    expect(lerNumeroEmPalavra("dez e seis")).toBe(null);
    expect(lerNumeroEmPalavra("vinte e trinta")).toBe(null);
    expect(lerNumeroEmPalavra("vinte e vinte")).toBe(null);
    expect(lerNumeroEmPalavra("e duas")).toBe(null);
    expect(lerNumeroEmPalavra("banana")).toBe(null);
  });

  test("a §6 de hoje é lida pela régua, e o total NÃO é nulo", () => {
    const a = conferirAritmeticaDoPontoCego(secao6);
    expect(a.totalDeclarado).not.toBe(null);
    expect(a.totalDeclarado).toBe(a.linhasDaTabela.length);
  });
});
