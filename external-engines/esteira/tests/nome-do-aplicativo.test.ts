/**
 * **LAB-117 (item 900) · o `<app>` do recado é o nome desta casa** (D345).
 *
 * ```sh
 * bun test tests/nome-do-aplicativo.test.ts
 * ```
 *
 * O `CLAUDE.md` §1 manda *"`<app>` é `MOTOR LAB (archilly-lab)`, nunca `Lab`"*, e a régua do
 * cabeçalho aceitava qualquer nome desde o D228: plantado `— Lab ·` no recado do LAB-116, os nove
 * arquivos que leem o `RECADOS.md` ficaram 127 de 127 verdes. Esta trava cobra o nome **exato**, lido
 * da página, do recado do LAB-68 em diante, e guarda os 72 de antes como fotografia. Lê só arquivos
 * deste repositório — entra no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  APP_ANTES_DO_CORTE,
  RECADOS_ANTES_DO_CORTE,
  appDaPagina,
  conferirOsApps,
  lerCabecalhos,
} from "../src/nome-do-aplicativo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CLAUDE = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
const ACUMULADO = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");
const APP = appDaPagina(CLAUDE);

/** O último cabeçalho do arquivo de verdade, trocado por outro texto — a mutação no lugar real. */
function trocarOUltimo(novo: string): string {
  const ultimo = lerCabecalhos(ACUMULADO).at(-1)!;
  const linhas = ACUMULADO.split("\n");
  linhas[ultimo.linha - 1] = novo;
  return linhas.join("\n");
}
const promptDoUltimo = lerCabecalhos(ACUMULADO).at(-1)!.prompt!;
const motivos = (t: string, app: string | null = APP) => conferirOsApps(t, app).desvios.map((d) => d.porque);

describe("LAB-117 · o sujeito da regra vem da PÁGINA", () => {
  test("o CLAUDE.md §1 declara UM `<app>`, e é este", () => {
    expect(APP).toBe("MOTOR LAB (archilly-lab)");
  });

  test("página sem o nome, ou com dois, é `null` — e a régua reprova em vez de supor", () => {
    expect(appDaPagina("nada aqui")).toBeNull();
    expect(appDaPagina("`<app>` é `A` e `<app>` é `B`")).toBeNull();
    expect(motivos(ACUMULADO, null).some((m) => /não declara UM/.test(m))).toBe(true);
  });
});

describe("LAB-117 · os dois lados, no arquivo de verdade", () => {
  test("O LADO BOM: zero desvios, e o universo publicado", () => {
    const r = conferirOsApps(ACUMULADO, APP);
    expect(r.desvios, JSON.stringify(r.desvios, null, 2)).toEqual([]);
    expect(r.antesDoCorte).toBe(RECADOS_ANTES_DO_CORTE);
    // O que vem depois do corte cresce a cada rodada: só não pode ser pouco (56 no LAB-116).
    expect(r.doCorteEmDiante).toBeGreaterThanOrEqual(56);
    expect(r.lidos).toBe(r.antesDoCorte + r.doCorteEmDiante);
  });

  test("O LADO RUIM: o defeito de 15/10 reproduzido — `Lab` no último recado reprova", () => {
    const plantado = trocarOUltimo(`=== RECADO PARA O CHAT — ${APP_ANTES_DO_CORTE} · ${promptDoUltimo} ===`);
    expect(motivos(plantado)).toEqual([`o <app> é \`Lab\`, e a página manda \`${APP}\``]);
  });
});

describe("LAB-117 · as mutações — o nome é EXATO, e o corte não anda", () => {
  const casos: [string, string][] = [
    ["sem o repositório", "MOTOR LAB"],
    ["caixa trocada", "Motor Lab (archilly-lab)"],
    ["espaço a mais", "MOTOR LAB  (archilly-lab)"],
    ["o repositório de outra casa", "MOTOR LAB (motor-testfit)"],
    ["o apelido de outra casa", "Laboratório de Parcelamento"],
  ];
  for (const [nome, app] of casos) {
    test(`${nome}: \`${app}\` reprova`, () => {
      const plantado = trocarOUltimo(`=== RECADO PARA O CHAT — ${app} · ${promptDoUltimo} ===`);
      expect(motivos(plantado).length).toBe(1);
    });
  }

  test("o caso válido que quase parece inválido: `<prompt>` com ` · ` dentro PASSA — o `<app>` é o mais curto", () => {
    // Nenhum dos cabeçalhos de hoje tem dois ` · `; o primeiro que tiver não pode virar desvio.
    const plantado = trocarOUltimo(`=== RECADO PARA O CHAT — ${APP} · ${promptDoUltimo} · com um aparte ===`);
    expect(motivos(plantado)).toEqual([]);
  });

  test("cabeçalho FORA DA FORMA (sem o ` · `) reprova — régua que não lê a linha não a aprova", () => {
    const plantado = trocarOUltimo(`=== RECADO PARA O CHAT — ${APP} ${promptDoUltimo} ===`);
    expect(motivos(plantado).some((m) => /não tem a forma/.test(m))).toBe(true);
  });

  test("o próprio LAB-68 com `Lab` reprova — o corte é achado pelo PROMPT, e não anda", () => {
    const plantado = ACUMULADO.replace(
      `=== RECADO PARA O CHAT — ${APP} · LAB-68 (item 001) ===`,
      "=== RECADO PARA O CHAT — Lab · LAB-68 (item 001) ===",
    );
    expect(plantado).not.toBe(ACUMULADO);
    expect(motivos(plantado).length).toBe(1);
  });

  test("o registro de antes REESCRITO (um `Lab` virado `MOTOR LAB`) reprova", () => {
    const plantado = ACUMULADO.replace(
      "=== RECADO PARA O CHAT — Lab · LAB-67 ===",
      `=== RECADO PARA O CHAT — ${APP} · LAB-67 ===`,
    );
    expect(plantado).not.toBe(ACUMULADO);
    expect(motivos(plantado).some((m) => /registro foi reescrito/.test(m))).toBe(true);
  });

  test("o registro de antes que CRESCE (um recado novo enfiado antes do corte) reprova", () => {
    const plantado = ACUMULADO.replace(
      "=== RECADO PARA O CHAT — Lab · LAB-67 ===",
      "=== RECADO PARA O CHAT — Lab · LAB-67 ===\n=== RECADO PARA O CHAT — Lab · LAB-67b ===",
    );
    expect(motivos(plantado).some((m) => /não se reescreve nem cresce/.test(m))).toBe(true);
  });

  test("sem o corte, ou com dois, reprova — e `LAB-680` não é o `LAB-68`", () => {
    const sem = ACUMULADO.replace(/ · LAB-68 \(item 001\) ===/, " · LAB-680 (item 001) ===");
    expect(motivos(sem).some((m) => /achei 0/.test(m))).toBe(true);
    const dois = trocarOUltimo(`=== RECADO PARA O CHAT — ${APP} · LAB-68 (de novo) ===`);
    expect(motivos(dois).some((m) => /achei 2/.test(m))).toBe(true);
  });
});
