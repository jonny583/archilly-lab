/**
 * **LAB-115 (item 900) · o tamanho de uma suíte não se escreve numa página viva** (D342).
 *
 * ```sh
 * bun test tests/numero-de-testes.test.ts
 * ```
 *
 * Três dos quatro *"N testes"* das páginas vivas estavam errados (93 contra 1 164; 14 contra 17,
 * duas vezes) e o quarto estava certo sem trava. A frase saiu das três páginas; esta trava impede
 * que volte. Lê só arquivos deste repositório — entra no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  EXCECOES,
  EXTENSAO_LIDA,
  conferirAsContagens,
  contagensDeTestes,
} from "../src/numero-de-testes.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

describe("LAB-115 · a régua acha a contagem, e só a contagem", () => {
  const acha = (t: string) => contagensDeTestes("x.md", t).map((c) => c.trecho.toLowerCase());

  test("o defeito de 15/10 reproduzido: as quatro formas que estavam nas páginas", () => {
    expect(acha("| `tests/` | 93 testes |")).toEqual(["93 testes"]);
    expect(acha("| `tests/` | 14 testes: ida e volta nas três glebas |")).toEqual(["14 testes"]);
    expect(acha("bun test                                # 14 testes, ~3 s")).toEqual(["14 testes"]);
    expect(acha("**22 testes**, e o primeiro deles é esse.")).toEqual(["22 testes"]);
  });

  test("milhar e extenso também — o número não escapa pela grafia", () => {
    expect(acha("são 1 164 testes")).toEqual(["1 164 testes"]);
    expect(acha("são 1.164 testes")).toEqual(["1.164 testes"]);
    expect(acha("Dezessete testes no pacote")).toEqual(["dezessete testes"]);
    expect(acha("a suíte tem **17** testes")).toEqual(["17 testes"]);
  });

  test("o caso válido que quase parece inválido: seção, artigo, singular e sigla NÃO são contagem", () => {
    expect(acha("## 15. TESTES OBRIGATÓRIOS")).toEqual([]);
    expect(acha("um teste de verdade, contra o dado real")).toEqual([]);
    expect(acha("os testes do pacote")).toEqual([]);
    expect(acha("o D110 testes à parte")).toEqual([]);
    expect(acha("2 teste")).toEqual([]);
  });

  test("a linha devolvida é a da frase", () => {
    expect(contagensDeTestes("x.md", "a\nb\nsão 9 testes")[0]?.linha).toBe(3);
  });
});

describe("LAB-115 · a conferência, nos dois sentidos", () => {
  test("lado ruim: contagem numa página viva reprova, com arquivo e linha", () => {
    const r = conferirAsContagens(
      [
        { arquivo: "external-engines/esteira/README.md", texto: "| `tests/` | 93 testes |" },
        { arquivo: "docs/relatorios/LAB-13.md", texto: "93 testes" },
      ],
      [],
    );
    expect(r.digitadas).toEqual([
      { arquivo: "external-engines/esteira/README.md", linha: 1, trecho: "93 testes" },
    ]);
    expect(r.deRelato).toBe(1);
  });

  test("lado bom: a mesma frase em RELATO, ou declarada como exceção, ou fora de `.md`, passa", () => {
    const excecao = [{ arquivo: "a.md", trecho: "dois testes", porque: "peças de um desenho" }];
    const r = conferirAsContagens(
      [
        { arquivo: "a.md", texto: "e dois testes de varredura" },
        { arquivo: "docs/DECISOES.md", texto: "93 testes" },
        { arquivo: "src/x.ts", texto: "// 93 testes" },
      ],
      excecao,
    );
    expect(r.digitadas).toEqual([]);
    expect(r.excecoesMortas).toEqual([]);
    expect(r.lidos).toBe(1);
  });

  test("o outro sentido: exceção cujo trecho sumiu é lista que envelheceu, e reprova", () => {
    const excecao = [{ arquivo: "a.md", trecho: "dois testes", porque: "peças" }];
    expect(conferirAsContagens([{ arquivo: "a.md", texto: "nada" }], excecao).excecoesMortas).toEqual([
      'a.md · "dois testes"',
    ]);
  });
});

describe("LAB-115 · a árvore de hoje — e o universo lido, publicado", () => {
  test("nenhuma página viva diz quantos testes uma suíte tem", () => {
    const arvore = execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8" })
      .split("\n")
      .filter((f) => f.endsWith(EXTENSAO_LIDA) && existsSync(join(RAIZ, f)))
      .map((arquivo) => ({ arquivo, texto: readFileSync(join(RAIZ, arquivo), "utf8") }));
    const r = conferirAsContagens(arvore);
    const resumo = `lidas ${r.lidos} páginas vivas (${r.deRelato} de relato fora); ${EXCECOES.length} exceções declaradas`;
    // As três que motivaram a régua: sem elas no universo, a trava aprova por não ler.
    for (const p of [
      "external-engines/esteira/README.md",
      "external-engines/testfit/README.md",
      "entrega/registro-de-motores/README.md",
    ]) {
      expect(arvore.some((a) => a.arquivo === p), `${p} saiu do universo — ${resumo}`).toBe(true);
    }
    expect(r.lidos, resumo).toBeGreaterThan(20);
    expect(r.deRelato, resumo).toBeGreaterThan(0);
    expect(
      r.digitadas.map((d) => `${d.arquivo}:${d.linha} "${d.trecho}"`),
      `quem diz quantos testes há é a linha "Ran N tests" do bun test, não a página — ${resumo}`,
    ).toEqual([]);
    expect(r.excecoesMortas, `exceções que a régua não acha mais — ${resumo}`).toEqual([]);
  });
});
