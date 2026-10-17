/**
 * **LAB-156 (item 900) · balanço que já mora num recado não se copia** (D384).
 *
 * ```sh
 * bun test tests/balanco-nao-se-copia.test.ts
 * ```
 *
 * O `CLAUDE.md` §1-B diz *"Balanço que já mora num recado não se copia: aponta-se para ele."* O *"aponta-se"* tinha
 * guarda desde o LAB-42; o *"não se copia"* não tinha nenhuma — 1 406 caracteres de um recado colados no `BALANCOS.md`
 * deixaram a suíte inteira como estava. O motivo inteiro, com a medição, está no cabeçalho de
 * `src/balanco-nao-se-copia.ts`.
 *
 * Roda **sem clones** (lê o `BALANCOS.md`, o `RECADOS.md` e o `CLAUDE.md` desta casa), e por isso está no portão sem
 * clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  COPIAS_DECLARADAS,
  JANELA,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirQueOBalancoNaoSeCopia,
} from "../src/balanco-nao-se-copia.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const BALANCOS = readFileSync(join(RAIZ, "docs", "relatorios", "BALANCOS.md"), "utf8");
const RECADOS = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");

/** As linhas `Estado:` e `Feito:` do recado de uma seção do `RECADOS.md` — o que a mutação da medição colou. */
function linhasDoRecado(titulo: string): string {
  const i = RECADOS.indexOf(`## ${titulo}`);
  if (i < 0) throw new Error(`o RECADOS.md não tem mais a seção ${titulo}`);
  const bloco = RECADOS.slice(i).split("```")[1]!;
  return bloco
    .split("\n")
    .filter((l) => l.startsWith("Estado:") || l.startsWith("Feito:"))
    .join("\n");
}

const LAB37 = "04/10/2026 · LAB-37 — a dívida paga, e a fila de 04/10 esgotou";

/** Um parágrafo longo e inventado, que não está em arquivo nenhum. */
const PARAGRAFO =
  "O saldo desta fila inventada fecha com sete prompts, onze decisões e uma régua que reprovou o próprio autor duas vezes antes de sair, e isso é o que ela ensinou sobre as réguas da casa inteira.";

const MINIMO_BALANCO = (corpo: string) =>
  `# BALANÇOS\n\n## 2 · Índice dos balanços que JÁ moram num recado\n\n${corpo}\n\n## 3 · O saldo de uma fila — 04/10/2026\n\ntexto próprio deste saldo.\n`;
const MINIMO_RECADOS = (titulo: string, corpo: string) =>
  `# RECADOS\n\n## ${titulo}\n\n\`\`\`\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-00 ===\nEstado: ${corpo}\n=== FIM ===\n\`\`\`\n`;

describe("LAB-156 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §1-B diz que balanço que já mora num recado não se copia", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
  });

  test("e o BALANCOS.md diz por quê — a segunda montagem do D116", () => {
    expect(aRegraEstaEscrita(BALANCOS, "Balanço que já mora num recado não é copiado")).toBe(true);
    expect(aRegraEstaEscrita(BALANCOS, "Copiar criaria a segunda montagem que o D116 proíbe")).toBe(true);
  });
});

describe("LAB-156 · o BALANCOS.md e o RECADOS.md de verdade", () => {
  const r = conferirQueOBalancoNaoSeCopia(BALANCOS, RECADOS);

  test("nenhuma cópia — todo trecho de 120 ou mais em comum está declarado, com o motivo", () => {
    expect(r.copias).toEqual([]);
  });

  test("nenhuma declaração fantasma — cada uma ainda acha o trecho dela", () => {
    expect(r.declaracoesSemTrecho).toEqual([]);
  });

  test("o universo lido é publicado: treze seções, os quatro títulos citados do índice, os dois arquivos inteiros", () => {
    expect(r.secoes).toBe(13);
    expect(r.titulosCitados).toBe(4);
    // O RECADOS.md cresce a cada rodada: o piso é o do dia da trava, e ele só sobe.
    expect(r.caracteresDosRecados).toBeGreaterThanOrEqual(539_618);
    expect(r.caracteresDoBalanco).toBeGreaterThan(30_000);
    expect(r.janelas).toBeGreaterThan(30_000);
    console.log(
      `   balanço não se copia: ${r.secoes} seções · ${r.caracteresDoBalanco} caracteres do balanço contra ${r.caracteresDosRecados} dos recados · ${r.janelas} janelas de ${JANELA} · ${r.titulosCitados} títulos citados · ${r.trechos.length} trecho(s) em comum, ${r.trechos.length - r.copias.length} declarado(s) · ${r.copias.length} cópia(s)`,
    );
  });

  test("uma declaração só, e o motivo dela é escrito", () => {
    expect(COPIAS_DECLARADAS).toHaveLength(1);
    for (const d of COPIAS_DECLARADAS) expect(d.motivo.length).toBeGreaterThan(40);
  });

  test("o que ela não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-156 · o lado ruim — a cópia é acusada", () => {
  test("a mutação da medição: o recado do LAB-37 colado no §2 do BALANCOS.md", () => {
    const copia = linhasDoRecado(LAB37);
    expect(copia.length).toBeGreaterThan(1_000);
    const mutado = BALANCOS.replace(
      "**O número que esse último saldo carrega",
      `${copia}\n\n**O número que esse último saldo carrega`,
    );
    expect(mutado).not.toBe(BALANCOS);
    const r = conferirQueOBalancoNaoSeCopia(mutado, RECADOS);
    expect(r.copias.length).toBeGreaterThanOrEqual(1);
    expect(r.copias[0]!.secao).toStartWith("2 · Índice");
    expect(r.copias[0]!.tamanho).toBeGreaterThan(1_000);
  });

  test("o sentido contrário também: um parágrafo do balanço colado num recado novo", () => {
    const r = conferirQueOBalancoNaoSeCopia(
      MINIMO_BALANCO(PARAGRAFO),
      MINIMO_RECADOS("17/10/2026 · LAB-00 — um recado", PARAGRAFO),
      JANELA,
      [],
    );
    expect(r.copias).toHaveLength(1);
    expect(r.copias[0]!.secao).toStartWith("2 · ");
  });

  test("a cópia com negrito e quebra de linha diferentes é a mesma cópia", () => {
    const comEnfase = PARAGRAFO.replace("sete prompts", "**sete prompts**").replace(", onze", ",\n> onze");
    const r = conferirQueOBalancoNaoSeCopia(
      MINIMO_BALANCO(comEnfase),
      MINIMO_RECADOS("17/10/2026 · LAB-00 — um recado", PARAGRAFO),
      JANELA,
      [],
    );
    expect(r.copias).toHaveLength(1);
  });

  test("o título citado entre crases que NÃO é título de recado não sai — um parágrafo entre crases é cópia", () => {
    const r = conferirQueOBalancoNaoSeCopia(
      MINIMO_BALANCO(`| 17/10/2026 | o saldo | \`${PARAGRAFO}\` |`),
      MINIMO_RECADOS("17/10/2026 · LAB-00 — um recado", PARAGRAFO),
      JANELA,
      [],
    );
    expect(r.titulosCitados).toBe(0);
    expect(r.copias).toHaveLength(1);
  });

  test("a declaração é teto: o trecho declarado CRESCER é cópia nova", () => {
    const d = COPIAS_DECLARADAS[0]!;
    const i = BALANCOS.indexOf("**correção da moldura do D159**");
    expect(i).toBeGreaterThan(-1);
    // Cola, logo depois do trecho declarado, o resto da linha do recado do LAB-52 — o trecho em comum cresce.
    const linha = RECADOS.split("\n").find((l) => l.includes("a correção da moldura do D159 nos três lugares"))!;
    const resto = linha.slice(linha.indexOf("a correção da moldura do D159"));
    const mutado = BALANCOS.replace(
      "## 7 · Os TRÊS números",
      `${linha.slice(linha.indexOf("guarda ao lado, D136"), linha.indexOf("a correção"))}${resto}\n\n## 7 · Os TRÊS números`,
    );
    const r = conferirQueOBalancoNaoSeCopia(mutado, RECADOS);
    expect(r.copias.length).toBeGreaterThanOrEqual(1);
    expect(d.tamanhoMaximo).toBe(155);
  });

  test("a declaração fantasma reprova: declarada e sem trecho", () => {
    const r = conferirQueOBalancoNaoSeCopia(
      MINIMO_BALANCO("texto próprio, sem nada em comum."),
      MINIMO_RECADOS("17/10/2026 · LAB-00 — um recado", PARAGRAFO),
      JANELA,
      [{ secao: "2 · Índice dos balanços que JÁ moram num recado", comeco: "O saldo", tamanhoMaximo: 300, motivo: "x" }],
    );
    expect(r.declaracoesSemTrecho).toHaveLength(1);
  });
});

describe("LAB-156 · o lado bom — o que quase parece cópia e não é", () => {
  test("o índice cita um título de recado LONGO entre crases — é o 'aponta-se para ele', e passa", () => {
    const titulo = `17/10/2026 · LAB-00 — ${"um título de recado muito comprido, ".repeat(5).trim()}`;
    expect(titulo.length).toBeGreaterThan(JANELA);
    const r = conferirQueOBalancoNaoSeCopia(
      MINIMO_BALANCO(`| 17/10/2026 | o saldo | \`${titulo}\` |`),
      MINIMO_RECADOS(titulo, "outra coisa."),
      JANELA,
      [],
    );
    expect(r.titulosCitados).toBe(1);
    expect(r.copias).toEqual([]);
  });

  test("a frase-lema da casa repetida nos dois (menos de 120) não é cópia de balanço", () => {
    const lema = "O que vai ao chat e não vai a um arquivo não existe amanhã.";
    const r = conferirQueOBalancoNaoSeCopia(
      MINIMO_BALANCO(`> **${lema}**`),
      MINIMO_RECADOS("17/10/2026 · LAB-00 — um recado", lema),
      JANELA,
      [],
    );
    expect(r.trechos).toEqual([]);
  });

  test("o maior trecho da mão que repete as próprias frases (98) fica abaixo da janela", () => {
    const r = conferirQueOBalancoNaoSeCopia(BALANCOS, RECADOS, 80);
    const fora = r.trechos.filter((t) => !COPIAS_DECLARADAS.some((d) => t.comeco.startsWith(d.comeco)));
    expect(fora.length).toBeGreaterThan(0);
    expect(Math.max(...fora.map((t) => t.tamanho))).toBeLessThan(JANELA);
  });
});
