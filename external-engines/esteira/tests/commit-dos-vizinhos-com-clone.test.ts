/**
 * ════════════════════════════════════════════════════════════════════════════
 *  AS TRAVAS DO CARIMBO QUE PRECISAM DO CLONE NO DISCO. (item 017, LAB-84)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **Este arquivo existe por uma medição, e ela está publicada**
 * (`docs/provas/LAB-84/as-trinta-por-execucao.json`): dos **30** arquivos do trabalho de CI
 * `guardas que não precisam dos clones vizinhos (NÃO é o verde)`, rodados **sem os clones**,
 * **29 passam** e **um** reprova — este, com **4 travas de 14**.
 *
 * > **O nome de um trabalho de CI é uma afirmação sobre o que ele precisa.** A afirmação daquele
 * > trabalho era falsa por **quatro travas em 517**, e o conserto escolhido foi **mover as
 * > quatro**, não renomear o trabalho: o nome é a única coisa que torna aquela lista rodável em
 * > qualquer lugar sem preparo, e ele existe justamente porque o verde completo **não** roda sem
 * > segredo.
 *
 * **O que NÃO se fez, e a medição é que decidiu:** tirar o arquivo inteiro da lista custaria as
 * **10** travas dele que são limpas de clone — e elas são 10 travas de graça num portão que roda
 * em todo push. *Mover por ARQUIVO quando a dependência é de TRAVA paga a conta de quem não
 * mediu.*
 *
 * Os dois lados do item 001 continuam exigidos, e continuam **contra o clone de verdade**: o caso
 * bom lê o `HEAD` do `motor-testfit` nesta máquina; o caso ruim carimba com um commit que existe
 * no histórico dele e **não** é o `HEAD`. Eles só deixaram de estar no portão que promete não
 * precisar deles.
 */

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { carimbarVizinhos, conferirCarimbo } from "../src/commit-dos-vizinhos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CLONE_DO_MOTOR = join(RAIZ, "..", "motor-testfit");

/** O `HEAD` curto de um clone, ou `null` quando ele não está aqui. */
function cabecaDe(caminho: string): string | null {
  if (!existsSync(join(caminho, ".git"))) return null;
  return execFileSync("git", ["-C", caminho, "rev-parse", "--short", "HEAD"], {
    encoding: "utf8",
  }).trim();
}

describe("item 001 · os DOIS lados da régua, contra o clone de VERDADE", () => {
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
});

describe("o carimbo de VERDADE desta máquina (LAB-83, D276)", () => {
  test("o carimbo de VERDADE desta máquina diz de onde saiu, e as duas linhas batem hoje", () => {
    // Sem rede: esta trava pergunta de ONDE o carimbo saiu, não o quanto o clone está atrás.
    const carimbos = carimbarVizinhos((e) => import.meta.resolve(e), false);
    expect(carimbos.length).toBeGreaterThan(0);
    for (const c of carimbos) {
      expect(["modulo-resolvido", "convencao"], c.repo).toContain(c.de);
      // Hoje ninguém reponta nada, então nenhum carimbo pode estar divergindo: se divergir, a
      // notícia é essa — e é o que esta trava existe para contar.
      expect(c.divergem, `${c.repo} divergiu: módulo em ${c.commit}, convenção em ${c.pelaConvencao?.commit}`).toBe(false);
    }
    // E os dois que têm alias carimbam do MÓDULO: se um deles cair para `convencao`, o alias saiu
    // do tsconfig e o carimbo voltou a medir a intenção.
    const porRepo = new Map(carimbos.map((c) => [c.repo, c]));
    for (const repo of ["motor-testfit", "urban-create-hub-41d93a4d"] as const) {
      expect(porRepo.get(repo)?.de, `${repo} deixou de carimbar do módulo resolvido`).toBe("modulo-resolvido");
    }
    expect(porRepo.get("urban-scout-tool")?.de).toBe("convencao");
  });
});
