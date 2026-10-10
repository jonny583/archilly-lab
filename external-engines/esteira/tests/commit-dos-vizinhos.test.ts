/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A RÉGUA DO COMMIT DO VIZINHO, CONFERIDA DOS DOIS LADOS. (item 001)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A caixa de entrada pede, com todas as letras: *"a régua nasce conferida dos dois lados:
 * demonstre que ela aprova o caso bom (clone no commit gravado) **e** reprova o caso ruim
 * (clone noutro commit). As duas demonstrações no relatório, ou não é trava."*
 *
 * Então os dois casos estão aqui, **contra o clone de verdade**, e não só em fixture: o caso
 * bom lê o `HEAD` do `motor-testfit` nesta máquina e carimba com ele; o caso ruim carimba com
 * um commit que existe no histórico dele e **não** é o `HEAD`.
 *
 * E há o terceiro estado, que é o que separa esta régua de uma régua ingênua: prova **sem**
 * carimbo sai `nao-gravado`, nunca `igual`. *Zero é uma medição, nulo é "não medi"* (D23).
 */

import { describe, expect, test } from "bun:test";

import {
  PONTO_DE_ENTRADA,
  VIZINHOS,
  raizDeGitAcima,
  raizDoModuloResolvido,
  conferirCarimbo,
  conferirProva,
  precisaDeCarimbo,
} from "../src/commit-dos-vizinhos.ts";

// **NÃO HÁ `join`, `existsSync` NEM `execFileSync` AQUI, e isso é o conserto do LAB-84.**
// Este arquivo está na lista do trabalho de CI que promete não precisar dos clones vizinhos, e
// as quatro travas que precisavam deles mudaram para `commit-dos-vizinhos-com-clone.test.ts`.
// *Arquivo que lê o disco do vizinho não cabe num portão cujo nome diz que ele não lê.*

describe("item 001 · a régua do commit do vizinho, SEM precisar do clone", () => {
  test("clone ausente sai `clone-ausente`, e nunca `igual` nem `mudou`", () => {
    const r = conferirCarimbo("urban-scout-tool", "abc1234", null);
    expect(r.veredito).toBe("clone-ausente");
  });

  test("a régua DIZ, não reprova — nenhum veredito é booleano de falha", () => {
    const vereditos = [
      conferirCarimbo("motor-testfit", "a", "a").veredito,
      conferirCarimbo("motor-testfit", "a", "b").veredito,
      conferirCarimbo("motor-testfit", null, "b").veredito,
      conferirCarimbo("motor-testfit", "a", null).veredito,
    ];
    expect(new Set(vereditos).size).toBe(4);
    for (const v of vereditos) expect(typeof v).toBe("string");
  });

  test("a prova inteira: um veredito por vizinho que aparece", () => {
    const r = conferirProva(
      [
        { repo: "motor-testfit", commit: "aaa1111", limpo: true, de: "modulo-resolvido" },
        { repo: "urban-create-hub-41d93a4d", commit: "bbb2222", limpo: true, de: "modulo-resolvido" },
      ],
      { "motor-testfit": "aaa1111", "urban-create-hub-41d93a4d": "ccc3333" },
    );
    expect(r.map((x) => [x.repo, x.veredito])).toEqual([
      ["motor-testfit", "igual"],
      ["urban-create-hub-41d93a4d", "mudou"],
    ]);
  });

  test("prova que não roda vizinho nenhum não precisa de carimbo", () => {
    expect(precisaDeCarimbo({})).toBe(false);
    expect(precisaDeCarimbo({ osClonesVizinhos: [] })).toBe(true);
  });

  test("os três vizinhos estão nomeados, e são os três do CLAUDE.md §2", () => {
    expect([...VIZINHOS]).toEqual([
      "motor-testfit",
      "urban-create-hub-41d93a4d",
      "urban-scout-tool",
    ]);
  });
});

/**
 * ── O CARIMBO SAI DO MÓDULO RESOLVIDO (item 016, D274) ──────────────────────
 *
 * O carimbo lia o `HEAD` do caminho **por convenção** (`../<repo>`), e o código vem do
 * **resolvedor de módulos**. No LAB-82 eu repontei o `paths` para um clone do clone e a
 * ferramenta **mediu o motor novo e carimbou o velho**.
 *
 * > **Carimbo que lê o repositório mede a INTENÇÃO de quem configurou, não o que rodou.**
 *
 * Medido antes de consertar, e o número mudou o tamanho do conserto: de **três** vizinhos, **dois**
 * têm módulo a resolver e **um não tem** — o Lab não importa o Geo. Para ele o carimbo honesto é o
 * da convenção, **dito como tal**.
 */
describe("o carimbo diz DE ONDE saiu, e a divergência é a notícia", () => {
  test("o ponto de entrada é declarado para os três, e UM é null com motivo", () => {
    expect(Object.keys(PONTO_DE_ENTRADA).sort()).toEqual([...VIZINHOS].sort());
    expect(PONTO_DE_ENTRADA["motor-testfit"]).toBe("@testfit/api.ts");
    expect(PONTO_DE_ENTRADA["urban-create-hub-41d93a4d"]).toContain("@generate/");
    // O Geo não é importado por esta casa: não há módulo a resolver, e inventar um alias só para
    // carimbar seria carimbar uma ficção.
    expect(PONTO_DE_ENTRADA["urban-scout-tool"]).toBeNull();
  });

  test("sobe do arquivo até a raiz de git, e devolve null quando não há nenhuma", () => {
    const existe = (p: string): boolean => p === "/a/b/.git";
    expect(raizDeGitAcima("/a/b/c/d/e.ts", existe)).toBe("/a/b");
    expect(raizDeGitAcima("/x/y/z.ts", existe)).toBeNull();
  });

  test("resolve o ponto de entrada e devolve a raiz de git DELE — não a de sempre", () => {
    // O resolvedor finge que o módulo foi carregado de OUTRA árvore, que é o que o repoint do
    // LAB-82 fez de verdade.
    const outraArvore = "/tmp/rascunho/motor-3680b9f";
    const raiz = raizDoModuloResolvido(
      "motor-testfit",
      () => `file://${outraArvore}/src/lib/lab/api.ts`,
      (p) => p === `${outraArvore}/.git`,
    );
    expect(raiz).toBe(outraArvore);
  });

  test("vizinho SEM ponto de entrada não tem módulo a resolver — e isso é null, não erro", () => {
    expect(
      raizDoModuloResolvido("urban-scout-tool", () => "file:///nunca/chamado.ts", () => true),
    ).toBeNull();
  });

  test("alias que saiu do tsconfig é NÃO MEDIDO, não 'igual ao de sempre'", () => {
    const raiz = raizDoModuloResolvido(
      "motor-testfit",
      () => {
        throw new Error("Cannot find package");
      },
      () => true,
    );
    expect(raiz).toBeNull();
  });

});
