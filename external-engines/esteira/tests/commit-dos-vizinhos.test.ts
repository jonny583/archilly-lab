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
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  VIZINHOS,
  conferirCarimbo,
  conferirProva,
  precisaDeCarimbo,
} from "../src/commit-dos-vizinhos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CLONE_DO_MOTOR = join(RAIZ, "..", "motor-testfit");

/** O `HEAD` curto de um clone, ou `null` quando ele não está aqui. */
function cabecaDe(caminho: string): string | null {
  if (!existsSync(join(caminho, ".git"))) return null;
  return execFileSync("git", ["-C", caminho, "rev-parse", "--short", "HEAD"], {
    encoding: "utf8",
  }).trim();
}

describe("item 001 · a régua do commit do vizinho, nos DOIS lados", () => {
  const cabeca = cabecaDe(CLONE_DO_MOTOR);

  test("O CASO BOM, contra o clone de verdade: carimbo igual ao HEAD → `igual`", () => {
    expect(cabeca, "o clone do motor tem de estar nesta máquina para esta demonstração").not.toBeNull();
    const r = conferirCarimbo("motor-testfit", cabeca, cabeca);
    expect(r.veredito).toBe("igual");
    expect(r.oQueIssoQuerDizer).toContain(cabeca!);
  });

  test("O CASO RUIM, contra o clone de verdade: carimbo de OUTRO commit do histórico → `mudou`", () => {
    // Um commit que existe mesmo no histórico do motor, e que não é o HEAD. Inventar um
    // sha seria demonstrar contra um caso que não acontece.
    const anterior = execFileSync(
      "git",
      ["-C", CLONE_DO_MOTOR, "rev-parse", "--short", "HEAD~1"],
      { encoding: "utf8" },
    ).trim();
    expect(anterior).not.toBe(cabeca);
    const r = conferirCarimbo("motor-testfit", anterior, cabeca);
    expect(r.veredito).toBe("mudou");
    expect(r.oQueIssoQuerDizer).toContain("ANDOU");
    expect(r.oQueIssoQuerDizer).toContain(anterior);
    expect(r.oQueIssoQuerDizer).toContain(cabeca!);
  });

  test("prova SEM carimbo sai `nao-gravado`, e nunca `igual`", () => {
    const r = conferirCarimbo("motor-testfit", null, cabeca);
    expect(r.veredito).toBe("nao-gravado");
    expect(r.oQueIssoQuerDizer).toContain("NÃO MEDIDO");
  });

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
        { repo: "motor-testfit", commit: "aaa1111", limpo: true },
        { repo: "urban-create-hub-41d93a4d", commit: "bbb2222", limpo: true },
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
