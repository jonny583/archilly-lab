/**
 * ════════════════════════════════════════════════════════════════════════════
 *  "É O MESMO COMMIT" TEM UMA DEFINIÇÃO SÓ. (LAB-111, item 900, D338)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A proposta do LAB-110: *"os outros vereditos de igualdade têm a mesma definição? […] medir antes
 * de travar, porque em alguns deles os bytes podem ser a pergunta certa"*. O motivo inteiro está no
 * cabeçalho de `src/mesmo-commit.ts`.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - a igualdade única: o mesmo commit em dois tamanhos de curto é o mesmo; outro commit não é;
 *   prefixo curto demais e texto que não é commit não ganham o prefixo;
 * - **o defeito, demonstrado no git de verdade, e não lembrado**: um repositório temporário com
 *   16 386 objetos imprime o `HEAD` com 8 caracteres, e o clone raso dele, com 7 — pela forma
 *   velha, "diverge" e "o vizinho ANDOU"; pela igualdade única, o mesmo;
 * - os três lugares que comparam commit chamam a igualdade única;
 * - a régua da comparação de commits por texto acha a forma velha e **não** acha a comparação com
 *   nulo, com literal, nem a de dois nomes que não são commit;
 * - a árvore de hoje: zero comparações de commit por texto nos arquivos que leem o curto, a
 *   exceção conferida nos dois sentidos — com o universo publicado.
 *
 * Lê só arquivo deste repositório e um repositório temporário criado aqui; não importa clone: vai no
 * portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { conferirCarimbo } from "../src/commit-dos-vizinhos.ts";
import {
  EXCECOES_DE_COMMIT_POR_TEXTO,
  comparacoesDeCommitPorTexto,
  conferirCommitPorTexto,
  leOCommitCurto,
  mesmoCommit,
} from "../src/mesmo-commit.ts";
import { A_FONTE_DO_PADRAO, oCommitGravadoAindaEOMesmo } from "../src/onde-esta-o-padrao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** O universo: todo `.ts` versionado em `external-engines/`, menos `upstream/` (intocável, §3). */
function universo(): { arquivo: string; texto: string }[] {
  return execFileSync("git", ["ls-files", "external-engines/**/*.ts", "external-engines/*.ts"], {
    cwd: RAIZ,
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter((a) => a && !a.includes("/upstream/"))
    .map((arquivo) => ({
      arquivo,
      texto: readFileSync(join(RAIZ, arquivo), "utf8"),
    }));
}

/** A forma VELHA, reproduzida para demonstrar o lado ruim: o texto curto no lugar do commit. */
const formaVelha = (gravado: string, agora: string): boolean => gravado === agora;

const git = (cwd: string, ...args: string[]): string =>
  execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();

describe("LAB-111 · a igualdade única de commit (D338)", () => {
  test("o mesmo commit em dois tamanhos é o mesmo; outro commit não é", () => {
    expect(mesmoCommit("5ec1157", "5ec11575")).toBe(true);
    expect(mesmoCommit("5ec11575", "5ec1157")).toBe(true);
    expect(mesmoCommit("5EC1157", "5ec11575c0ffee")).toBe(true);
    expect(mesmoCommit("68312eb", "68312eb")).toBe(true);
    expect(mesmoCommit("5ec1157", "5ec1158")).toBe(false);
    expect(mesmoCommit("5ec11575", "5ec11576")).toBe(false);
    // Prefixo curto demais não identifica commit: o git não imprime menos de 7 por padrão.
    expect(mesmoCommit("5ec115", "5ec11575")).toBe(false);
    // Texto que não é commit só vale pela igualdade de texto — nunca pelo prefixo.
    expect(mesmoCommit("a", "a")).toBe(true);
    expect(mesmoCommit("abcdefg-sujo", "abcdefg")).toBe(false);
  });

  test("o defeito, no git de verdade: 16 386 objetos imprimem 8 caracteres, e o clone raso, 7", () => {
    const dir = mkdtempSync(join(tmpdir(), "lab111-"));
    try {
      const cheio = join(dir, "cheio");
      const raso = join(dir, "raso");
      execFileSync("git", ["init", "-q", "-b", "main", cheio]);
      // 5 462 commits de um arquivo só: um commit, uma árvore e um blob cada — 16 386 objetos, logo
      // acima de 2¹⁴, onde o git passa a imprimir o curto com 8 caracteres (medido no LAB-111).
      let fluxo = "";
      for (let i = 0; i < 5462; i++) {
        const d = `v ${i}\n`;
        fluxo += `commit refs/heads/main\ncommitter a <a@a> ${i} +0000\ndata 2\nx\nM 100644 inline f\ndata ${d.length}\n${d}\n`;
      }
      execFileSync("git", ["-C", cheio, "fast-import", "--quiet"], {
        input: fluxo,
      });
      execFileSync("git", ["clone", "-q", "--depth", "1", "--branch", "main", `file://${cheio}`, raso], {
        stdio: "pipe",
      });
      const doCheio = git(cheio, "rev-parse", "--short", "main");
      const doRaso = git(raso, "rev-parse", "--short", "HEAD");
      // A mesma árvore, o mesmo commit inteiro…
      expect(git(raso, "rev-parse", "HEAD")).toBe(git(cheio, "rev-parse", "main"));
      // …e dois textos curtos diferentes.
      expect(doCheio).toHaveLength(8);
      expect(doRaso).toHaveLength(7);
      // Pela forma velha, "diverge" e "o vizinho ANDOU"; pela igualdade única, o mesmo.
      expect(formaVelha(doRaso, doCheio)).toBe(false);
      expect(mesmoCommit(doRaso, doCheio)).toBe(true);
      expect(conferirCarimbo("urban-create-hub-41d93a4d", doRaso, doCheio).veredito).toBe("igual");
      // E o outro lado: o commit anterior, também por prefixo, continua outro commit.
      const anterior = git(cheio, "rev-parse", "--short", "main~1");
      expect(conferirCarimbo("urban-create-hub-41d93a4d", anterior, doCheio).veredito).toBe("mudou");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("o carimbo da prova velha (7) contra o mesmo HEAD lido com 8 é 'igual' — neste repositório", () => {
    // O salto de tamanho forçado por configuração, sobre o HEAD desta casa: o caso do tempo passando.
    const sete = git(RAIZ, "-c", "core.abbrev=7", "rev-parse", "--short", "HEAD");
    const oito = git(RAIZ, "-c", "core.abbrev=8", "rev-parse", "--short", "HEAD");
    expect(oito.length).toBeGreaterThan(sete.length);
    expect(conferirCarimbo("motor-testfit", sete, oito).veredito).toBe("igual");
    expect(conferirCarimbo("motor-testfit", oito, sete).veredito).toBe("igual");
  });

  test("a procedência do Padrão usa a mesma igualdade, dos dois lados", () => {
    const c = A_FONTE_DO_PADRAO.commit;
    const leitura = (valor: string) =>
      ({ podeAfirmar: true, valor }) as Parameters<typeof oCommitGravadoAindaEOMesmo>[0];
    expect(oCommitGravadoAindaEOMesmo(leitura(`${c}0ab1`))).toBe(true);
    expect(oCommitGravadoAindaEOMesmo(leitura(c))).toBe(true);
    expect(oCommitGravadoAindaEOMesmo(leitura("944c2325f96e"))).toBe(false);
  });

  test("os três lugares que comparam commit chamam a igualdade única", () => {
    const ler = (a: string) => readFileSync(join(RAIZ, "external-engines/esteira/src", a), "utf8");
    expect(ler("commit-dos-vizinhos.ts").match(/\bmesmoCommit\(/g)).toHaveLength(2);
    expect(ler("onde-esta-o-padrao.ts").match(/\bmesmoCommit\(/g)).toHaveLength(1);
    expect(ler("onde-esta-o-padrao.ts")).not.toMatch(/valor\.startsWith\(/);
  });
});

describe("LAB-111 · a régua da comparação de commits por texto (D338)", () => {
  test("acha a forma velha — os dois lados com nome de commit", () => {
    expect(comparacoesDeCommitPorTexto("  if (gravado === agora) {")).toEqual([1]);
    expect(comparacoesDeCommitPorTexto("x\n  divergem: daConvencao !== commit,")).toEqual([2]);
    expect(comparacoesDeCommitPorTexto("const ok = a.commit === b?.commit;")).toEqual([1]);
  });

  test("NÃO acha o que quase parece: nulo, literal, nomes que não são commit, comentário, a igualdade única", () => {
    expect(comparacoesDeCommitPorTexto("  if (agora === null) {")).toEqual([]);
    expect(comparacoesDeCommitPorTexto('  if (head === "main") {')).toEqual([]);
    expect(comparacoesDeCommitPorTexto("const g = limites.find((l) => l.gleba === r.gleba);")).toEqual([]);
    expect(comparacoesDeCommitPorTexto("// gravado === agora era a forma velha")).toEqual([]);
    expect(comparacoesDeCommitPorTexto("  if (mesmoCommit(gravado, agora)) {")).toEqual([]);
  });

  test("o sujeito: só o arquivo que lê o commit CURTO entra", () => {
    expect(leOCommitCurto('git("rev-parse", "--short", "HEAD")')).toBe(true);
    expect(leOCommitCurto('git(["rev-parse", "--short=9", "HEAD"])')).toBe(true);
    expect(leOCommitCurto('git("rev-parse", "HEAD") // não "--short"')).toBe(false);
    const r = conferirCommitPorTexto([
      {
        arquivo: "a.ts",
        texto: 'const c = git("rev-parse", "--short", "HEAD");\nif (gravado === agora) {}',
      },
      {
        arquivo: "b.ts",
        texto: 'const c = git("rev-parse", "HEAD");\nif (r.shaLocal !== estado.head) {}',
      },
    ]);
    expect(r.leemOCurto).toEqual(["a.ts"]);
    expect(r.achados).toEqual([{ arquivo: "a.ts", linhas: [2] }]);
  });

  test("a árvore de hoje: zero comparações de commit por texto, a exceção viva — com o universo", () => {
    const u = universo();
    const r = conferirCommitPorTexto(u);
    console.log(
      `    ${r.lidos} .ts lidos · ${r.leemOCurto.length} leem o commit curto · ` +
        `${r.achados.length} comparam commit por texto fora da exceção`,
    );
    expect(r.lidos).toBeGreaterThan(200);
    // Os que leem o curto, medidos no LAB-111: o carimbo, duas ferramentas e duas travas (esta é
    // uma). Arquivo novo que lê o curto muda a lista, e mudá-la é deliberado: é o universo da régua.
    expect(r.leemOCurto).toEqual([
      "external-engines/esteira/ferramentas/lab60.ts",
      "external-engines/esteira/ferramentas/lab82.ts",
      "external-engines/esteira/src/commit-dos-vizinhos.ts",
      "external-engines/esteira/tests/commit-dos-vizinhos-com-clone.test.ts",
      "external-engines/esteira/tests/mesmo-commit.test.ts",
    ]);
    expect(r.achados).toEqual([]);
    expect(r.excecoesVelhas).toEqual([]);
    for (const e of EXCECOES_DE_COMMIT_POR_TEXTO) expect(u.some((x) => x.arquivo === e.arquivo)).toBe(true);
  });
});
