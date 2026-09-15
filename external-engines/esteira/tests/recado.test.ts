/**
 * O teste da regra do RECADO. (LF-FINAL-2)
 *
 * ```sh
 * bun test
 * ```
 *
 * # Por que uma regra de documento virou teste
 *
 * O CLAUDE.md §1 fixa: o recado para o chat tem **no máximo 12 linhas**. É a
 * regra mais visível do repositório — o recado é o que o Jonny cola no chat do
 * outro aplicativo — e o LF-FINAL-2 a conferiu pela primeira vez.
 *
 * **Sete dos oito recados passaram do teto.** Nenhum por pouco: 16, 21, 19, 19,
 * 18, 19 e 16 linhas. A regra estava escrita, e ninguém a mediu.
 *
 * Por isso ela virou teste. Não adianta "prestar mais atenção": o que não é
 * medido volta a acontecer, e este repositório inteiro é sobre isso.
 *
 * # Por que o teste olha só o ÚLTIMO recado
 *
 * `RECADOS.md` é **registro do que foi enviado**, em ordem. Reescrever os sete
 * antigos para caberem no teto falsificaria o registro — eles foram enviados
 * assim, e a tabela do LF-FINAL-2 diz exatamente quais e de quanto passaram.
 *
 * O que o teste tem de impedir é o **próximo**. Olhando o último, ele morde toda
 * vez que um recado novo é escrito, sem precisar de lista de exceções que
 * envelhece.
 *
 * # Por que ele mora aqui
 *
 * `bun test` na esteira é o único corredor de teste do repositório. A regra é de
 * documento, o teste é de código, e o lugar do teste é onde ele roda.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RECADOS = join(import.meta.dirname, "..", "..", "..", "docs", "relatorios", "RECADOS.md");

/** Todos os recados do acumulado, em ordem, já sem as crases. */
function recados(): string[][] {
  const texto = readFileSync(RECADOS, "utf8");
  const achados: string[][] = [];
  const re = /```\n(=== RECADO PARA O CHAT[\s\S]*?=== FIM ===)\n```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto)) !== null) achados.push(m[1]!.trim().split("\n"));
  return achados;
}

describe("a regra do RECADO — CLAUDE.md §1", () => {
  test("o acumulado tem recado, e cada um abre e fecha com a marca certa", () => {
    const todos = recados();
    expect(todos.length).toBeGreaterThan(0);
    for (const r of todos) {
      expect(r[0]).toMatch(/^=== RECADO PARA O CHAT — Lab · /);
      expect(r[r.length - 1]).toBe("=== FIM ===");
    }
  });

  test("O TETO: o último recado tem no máximo 12 linhas", () => {
    const todos = recados();
    const ultimo = todos[todos.length - 1]!;
    // A mensagem do erro traz o recado inteiro: quem quebrar isto tem de ver o
    // que escreveu, não só o número.
    expect(ultimo.length, `o último recado tem ${ultimo.length} linhas:\n${ultimo.join("\n")}`)
      .toBeLessThanOrEqual(12);
  });

  test("o último recado responde às cinco perguntas do formato", () => {
    const ultimo = recados().at(-1)!.join("\n");
    for (const campo of [
      "Estado:",
      "Feito:",
      "Achados para outros apps ou Central:",
      "Depende do Jonny:",
      "Próximo na fila:",
    ]) {
      expect(ultimo).toContain(campo);
    }
  });
});
