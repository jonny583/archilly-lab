/**
 * ════════════════════════════════════════════════════════════════════════════
 *  REGRA DE FORMA SEM O SUJEITO ESCRITO MANDA NA COISA ERRADA. (D218)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Achado da Central em 08/10/2026: *"máximo de 12 linhas", sem dizer DE QUE, obriga a abrir um
 * segundo bloco — os quatro blocos foram OBEDIÊNCIA a uma regra errada, não desobediência.*
 *
 * Medido aqui, na `CLAUDE.md` de 08/10: **UMA** regra de forma não dizia de quê — *"Doze linhas
 * é teto, não meta"*, na §1, que é **exatamente a frase que me fez abrir os quatro blocos**.
 * Consertada; esta trava impede que ela, ou outra, volte sem sujeito.
 *
 * Estas travas leem só arquivo deste repositório: vão no CI que roda sem segredo.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  PALAVRAS_DE_LIMITE,
  SECOES_DE_REGRA,
  dizDeQue,
  limitesSemSujeito,
  secoesDeRegra,
  semCitacoes,
} from "../src/limites-com-sujeito.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");

describe("D218 · toda regra de forma diz DE QUE é o limite", () => {
  test("zero limites sem sujeito na CLAUDE.md de hoje", () => {
    const achados = limitesSemSujeito(claudeMd);
    expect(
      achados,
      achados.map((a) => `[${a.secao}] "${a.palavra}": ${a.frase}`).join("\n"),
    ).toEqual([]);
  });

  test("a §1 diz, com todas as letras, que o teto é do RECADO e não do bloco", () => {
    expect(claudeMd).toContain("O teto de doze linhas é do RECADO, não do bloco");
    expect(claudeMd).toContain("Doze linhas é teto DO RECADO");
  });

  test("a régua acha as seis seções de regra, e não a §6 narrativa", () => {
    const titulos = secoesDeRegra(claudeMd).map((s) => s.titulo);
    expect(titulos).toHaveLength(SECOES_DE_REGRA.length);
    expect(titulos.some((t) => t.startsWith("## 6 ·"))).toBe(false);
  });
});

describe("D218 · a régua REPROVA o limite sem sujeito, e não acusa prosa", () => {
  test("a frase que me enganou, replantada INTEIRA como era, é pega", () => {
    // A redação de antes do conserto, palavra por palavra. Trocar só um pedaço dela NÃO serve:
    // o resto da frase nova traz "do bloco", e a régua acharia o sujeito ali — foi o que a
    // primeira versão desta sabotagem fez, e ela passou.
    const i = claudeMd.indexOf("Doze linhas é teto DO RECADO");
    const j = claudeMd.indexOf("(D218).", i) + "(D218).".length;
    const sabotado = claudeMd.slice(0, i) + "Doze linhas é teto, não meta." + claudeMd.slice(j);
    const achados = limitesSemSujeito(sabotado);
    expect(achados).toHaveLength(1);
    expect(achados[0]!.palavra).toBe("teto");
    expect(achados[0]!.frase).toContain("Doze linhas é teto, não meta");
  });

  test("um limite novo sem sujeito, em qualquer seção de regra, é pego", () => {
    const sabotado = claudeMd.replace("## 7 · Entrega", "## 7 · Entrega\n\nNo máximo oito passos.");
    expect(limitesSemSujeito(sabotado).some((a) => a.palavra === "no máximo")).toBe(true);
  });

  test("o MESMO limite COM sujeito passa — a régua mede o sujeito, não a palavra", () => {
    const comSujeito = claudeMd.replace(
      "## 7 · Entrega",
      "## 7 · Entrega\n\nNo máximo oito passos do verde.",
    );
    expect(limitesSemSujeito(comSujeito).some((a) => a.palavra === "no máximo")).toBe(false);
  });

  test("a §6 é narrativa e NÃO entra: 441 de 441, 9 + 2 + 3 = 14 não são regra de forma", () => {
    expect(claudeMd).toContain("441 de 441 lotes sem frente");
    expect(limitesSemSujeito(claudeMd)).toEqual([]);
  });

  test("a citação literal da Central é FONTE, não regra minha — sai da varredura", () => {
    expect(claudeMd).toContain("O LIMITE DE DOZE LINHAS É DO");
    const corpo = secoesDeRegra(claudeMd).map((s) => s.corpo).join("\n");
    expect(semCitacoes(corpo)).not.toContain("O LIMITE DE DOZE LINHAS É DO");
  });

  test("frase que RELATA redação antiga não é acusada — é o D155", () => {
    const relato = '## 1 · x\n\nA §1 dizia "no máximo 12 linhas" e estava errada.\n';
    expect(limitesSemSujeito(relato)).toEqual([]);
  });

  test("`dizDeQue` separa os dois lados, e o vocabulário é fechado", () => {
    expect(dizDeQue("o teto de doze linhas é do RECADO", "teto")).toBe(true);
    expect(dizDeQue("doze linhas é teto, não meta", "teto")).toBe(false);
    expect(dizDeQue("no máximo 12 linhas do Recado", "no máximo")).toBe(true);
    expect(dizDeQue("no máximo 12 linhas", "no máximo")).toBe(false);
    expect(PALAVRAS_DE_LIMITE.length).toBe(4);
  });
});
