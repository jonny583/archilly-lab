/**
 * "VERDE" É UM COMANDO SÓ — e esta é a trava dentro da suíte. (LAB-31)
 *
 * ```sh
 * bun test tests/verde.test.ts
 * ```
 *
 * # Por que a trava é dupla
 *
 * O `conferir.sh` **descobre** todo `package.json` do repositório e reprova se
 * achar um que não esteja coberto. Isso resolve o caso de alguém criar um pacote
 * novo e esquecê-lo — **desde que alguém rode o script.**
 *
 * E a lição do D110 é exatamente que *"desde que alguém rode"* não basta. Então a
 * mesma regra também vive aqui, dentro da suíte que o script roda: se um pacote
 * novo nascer, **o `bun test` do `esteira` já fica vermelho**, antes de o script
 * entrar em cena.
 *
 * **Isto não é a mesma régua duas vezes** (o que o D20 proíbe e o D116 puniu). É a
 * mesma AFIRMAÇÃO em dois lugares com alcances diferentes: o script confere o
 * repositório inteiro e falha o comando; o teste confere a lista e falha a suíte.
 * Quem some primeiro é quem avisa primeiro.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SCRIPT = join(RAIZ, "external-engines", "conferir.sh");

const script = () => readFileSync(SCRIPT, "utf8");

/** Os pacotes que existem de verdade, descobertos como o script os descobre. */
function pacotesDoRepositorio(): string[] {
  const saida = execFileSync(
    "find",
    [RAIZ, "-name", "package.json", "-not", "-path", "*/node_modules/*", "-printf", "%h\n"],
    { encoding: "utf8" },
  );
  return saida
    .split("\n")
    .filter(Boolean)
    .map((d) => d.replace(`${RAIZ}/`, ""))
    .sort();
}

describe("o comando único cobre tudo o que existe", () => {
  test("todo `package.json` do repositório está na lista do `conferir.sh`", () => {
    const s = script();
    const cobertos = /COBERTOS=\(([^)]*)\)/.exec(s);
    expect(cobertos, "não achei a lista COBERTOS no conferir.sh").not.toBeNull();
    const lista = [...cobertos![1]!.matchAll(/"([^"]+)"/g)].map((m) => m[1]!);
    for (const pacote of pacotesDoRepositorio()) {
      expect(
        lista,
        `o pacote '${pacote}' existe e não está em COBERTOS — foi assim que a suíte do ` +
          "testfit ficou vermelha duas semanas (D110)",
      ).toContain(pacote);
    }
  });

  test("os três passos de cada pacote entram: typecheck, lint e test", () => {
    const s = script();
    for (const passo of ["bun run typecheck", "bun run lint", "bun test"]) {
      expect(s, `o conferir.sh não roda \`${passo}\``).toContain(passo);
    }
  });

  test("a prova no NAVEGADOR é um passo do comando, não um README", () => {
    // Ela era manual desde o LAB-01 e rodou uma vez, em 10/09/2026.
    expect(script()).toContain("prova-automatica.ts");
    expect(script()).toContain("navegador");
  });

  test("a precondição do `.wasm` FALHA, e não pula", () => {
    const s = script();
    // O artefato não é versionado de propósito; faltando, o comando tem de parar
    // com a receita — e não deixar o Symbios falhar por outro motivo, mandando
    // quem conserta para o lugar errado.
    expect(s).toContain("archilly_symbios_wasm.wasm");
    expect(s).toContain("rustup target add wasm32-unknown-unknown");
    expect(s).toContain("falhou=1");
    expect(s).not.toContain("skip");
  });

  test("o script roda TODOS os passos antes de desistir", () => {
    // Parar no primeiro erro faz quem conserta voltar cinco vezes. A trava é
    // frouxa de propósito — o que ela proíbe é um `set -e` ou um `exit` no meio.
    const s = script();
    expect(s).not.toContain("set -e\n");
    expect(s).toContain("exit 1");
  });

  test("a prova da sabotagem está publicada, com as três frentes", () => {
    // O chat pediu a prova por quebra: um teste de cada pacote, mais o navegador.
    const p = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-31", "sabotagem.json"), "utf8"),
    ) as {
      sabotagens: { frente: string }[];
      resultadoComASabotagem: { exit: number; passosQueFalharam: string[] };
      resultadoAntesDaSabotagem: { exit: number };
    };
    expect(p.sabotagens).toHaveLength(3);
    expect(p.resultadoAntesDaSabotagem.exit).toBe(0);
    expect(p.resultadoComASabotagem.exit).toBe(1);
    expect(p.resultadoComASabotagem.passosQueFalharam.length).toBeGreaterThanOrEqual(3);
  });
});
