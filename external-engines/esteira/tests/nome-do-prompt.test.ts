/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NOME DO PROMPT TEM DUAS CASAS OU MAIS. (LAB-104, item 900, D331)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A dívida própria, espécie **"teste que nunca reprovou"**, achada pela proposta 3 do LAB-103.
 * Cinco réguas vivas liam o nome do prompt com dois algarismos; a pior era a do `recado.test.ts`
 * que tirava `LAB-100.md` a `LAB-103.md` do universo — apagado o recado do LAB-103, ela seguia
 * verde. O motivo inteiro está no cabeçalho de `src/nome-do-prompt.ts`.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - a forma única aceita duas e três casas e **não corta** `LAB-103` em `LAB-10`;
 * - as duas réguas de `varredura-das-propostas.ts` leem `LAB-103` inteiro — e a forma velha,
 *   reproduzida aqui, lia errado (o caso ruim fica demonstrado, não lembrado);
 * - o universo dos relatórios do `recado.test.ts` alcança os de três casas;
 * - nenhum arquivo `.ts` versionado em `external-engines/` volta a escrever a forma de duas
 *   casas no CÓDIGO, fora das exceções declaradas — e exceção que não a tem mais reprova.
 *
 * Lê só arquivo deste repositório e não importa clone: vai no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  EXCECOES_DE_DUAS_CASAS,
  PROMPT_DO_LAB,
  conferirDuasCasas,
  duasCasasNoCodigo,
} from "../src/nome-do-prompt.ts";
import { lerPropostas, secoesDePropostaEmProsa } from "../src/varredura-das-propostas.ts";

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
    .map((arquivo) => ({ arquivo, texto: readFileSync(join(RAIZ, arquivo), "utf8") }));
}

describe("LAB-104 · a forma única do nome do prompt (D331)", () => {
  const inteiro = new RegExp(`^${PROMPT_DO_LAB}$`);
  const primeiro = (s: string) => new RegExp(PROMPT_DO_LAB).exec(s)?.[0];

  test("O LADO BOM: duas, três e quatro casas são prompt", () => {
    for (const p of ["LAB-07", "LAB-99", "LAB-100", "LAB-103", "LAB-1000"]) expect(inteiro.test(p), p).toBe(true);
  });

  test("O LADO RUIM: uma casa, nenhuma, e outro prefixo não são", () => {
    for (const p of ["LAB-7", "LAB-", "LF-01", "lab-07"]) expect(inteiro.test(p), p).toBe(false);
  });

  test("é GULOSA: dentro de uma frase, `LAB-103` sai inteiro — e a forma velha o cortava", () => {
    expect(primeiro("saído do LAB-103, em prosa")).toBe("LAB-103");
    expect(/LAB-\d\d/.exec("saído do LAB-103, em prosa")?.[0]).toBe("LAB-10");
  });
});

describe("LAB-104 · as duas réguas da lista de propostas leem três casas", () => {
  test("a seção em prosa do LAB-103 é do LAB-103, não do LAB-10 — o defeito medido no LAB-103", () => {
    const texto = "# x\n\n### Proposto ao chat, saído do LAB-103 — não executado\n\nalgo\n";
    expect(secoesDePropostaEmProsa(texto)).toEqual([{ linha: 3, prompt: "LAB-103" }]);
    // A forma velha, reproduzida: a origem errada que a trava acusava.
    expect(/^#{2,4} Proposto ao chat, saído do (LAB-\d\d)/.exec("### Proposto ao chat, saído do LAB-103")?.[1]).toBe(
      "LAB-10",
    );
  });

  test("a seção de duas casas segue lida como antes — o conserto não muda o que já valia", () => {
    expect(secoesDePropostaEmProsa("### Proposto ao chat, saído do LAB-78 — x")).toEqual([
      { linha: 1, prompt: "LAB-78" },
    ]);
  });

  test("o executor `LAB-103` é lido — e a forma velha não casava, e acusava o item certo", () => {
    const sec = "## Proposto ao chat — não executar";
    const doc = (exec: string) => `${sec}\n\n- ~~**Uma coisa feita** (LAB-90)~~ — ✅ **executado no ${exec}** (D331)\n\n## fim\n`;
    expect(lerPropostas(doc("LAB-103"))[0]!.executadoPor).toBe("LAB-103");
    expect(lerPropostas(doc("LAB-61"))[0]!.executadoPor).toBe("LAB-61");
    expect(/✅\s*\*\*executad[oa] no (LAB-\d\d)\*\*/.exec("✅ **executado no LAB-103**")).toBeNull();
  });
});

describe("LAB-104 · o universo dos relatórios alcança as três casas", () => {
  test("os relatórios `LAB-1xx.md` estão no universo que a trava do recado lê", () => {
    const todos = readdirSync(join(RAIZ, "docs", "relatorios")).filter((f) => /^LAB-\d+\.md$/.test(f));
    const lidos = todos.filter((f) => new RegExp(`^${PROMPT_DO_LAB}\\.md$`).test(f));
    // O universo inteiro, publicado: nenhum relatório de prompt fica fora da forma.
    expect(lidos, "relatório de prompt fora da forma do nome").toEqual(todos);
    // E os de três casas existem — sem eles, a igualdade acima não provaria nada sobre eles.
    expect(lidos.filter((f) => /^LAB-\d{3}\.md$/.test(f)).length).toBeGreaterThanOrEqual(4);
  });
});

describe("LAB-104 · a forma de duas casas não renasce no código", () => {
  test("a régua acha as quatro grafias, e não acha as que aceitam três casas", () => {
    const ruins = [
      String.raw`const a = /LAB-\d\d/;`,
      String.raw`const b = /LAB-\d{2}$/;`,
      String.raw`const c = /LAB-[0-9]{2}/;`,
      String.raw`const d = /LAB-[0-9][0-9]\b/;`,
    ];
    for (const r of ruins) expect(duasCasasNoCodigo(r), r).toEqual([1]);
    const boas = [
      String.raw`const a = /LAB-\d{2,}/;`,
      String.raw`const b = /LAB-\d\d\d?/;`,
      String.raw`const c = /LAB-\d+/;`,
      "const d = String.raw`LAB-\\d{2,}`;",
    ];
    for (const b of boas) expect(duasCasasNoCodigo(b), b).toEqual([]);
  });

  test("comentário não conta — é relato da forma velha, não régua", () => {
    expect(duasCasasNoCodigo("// a primeira versão casava `LAB-\\d\\d`\nconst x = 1;")).toEqual([]);
    expect(duasCasasNoCodigo("/** casava `LAB-\\d\\d` */\nconst y = /LAB-\\d\\d/;")).toEqual([2]);
  });

  test("o universo de hoje: zero achados fora das exceções, e nenhuma exceção velha", () => {
    const u = universo();
    // O tamanho do universo publicado: régua que lê zero arquivos sai verde.
    expect(u.length).toBeGreaterThan(200);
    for (const quem of [
      "external-engines/esteira/src/varredura-das-propostas.ts",
      "external-engines/esteira/tests/recado.test.ts",
      "external-engines/esteira/ferramentas/lab66.ts",
      "external-engines/esteira/ferramentas/lab70.ts",
    ]) {
      expect(u.some((a) => a.arquivo === quem), `${quem} fora do universo`).toBe(true);
    }
    const r = conferirDuasCasas(u);
    expect(
      r.achados.map((a) => `${a.arquivo}:${a.linhas.join(",")}`),
      "nome de prompt lido com duas casas fixas — use PROMPT_DO_LAB (src/nome-do-prompt.ts)",
    ).toEqual([]);
    expect(r.excecoesVelhas, "exceção que não contém mais a forma — tire-a da lista").toEqual([]);
  });

  test("O LADO RUIM no universo: plantada a forma velha num arquivo vivo, ela é achada — e numa ferramenta também", () => {
    const u = universo().map((a) =>
      a.arquivo.endsWith("/tests/recado.test.ts") ? { ...a, texto: `${a.texto}\nconst z = /^(LAB-\\d\\d)\\.md$/;\n` } : a,
    );
    const r = conferirDuasCasas(u);
    expect(r.achados.map((a) => a.arquivo)).toEqual(["external-engines/esteira/tests/recado.test.ts"]);
    // A ferramenta que espelha a trava anda junto com ela (D231): não é exceção.
    const naFerramenta = universo().map((a) =>
      a.arquivo.endsWith("/ferramentas/lab70.ts") ? { ...a, texto: `${a.texto}\nconst z = /^(LAB-\\d\\d)\\.md$/;\n` } : a,
    );
    expect(conferirDuasCasas(naFerramenta).achados.map((a) => a.arquivo)).toEqual([
      "external-engines/esteira/ferramentas/lab70.ts",
    ]);
  });

  test("toda exceção diz o motivo, e a exceção curada vira acusação", () => {
    for (const e of EXCECOES_DE_DUAS_CASAS) expect(e.motivo.length, e.arquivo).toBeGreaterThan(20);
    const EXC = "external-engines/esteira/tests/nome-do-prompt.test.ts";
    const curado = universo().map((a) => (a.arquivo === EXC ? { ...a, texto: "const nada = 1;\n" } : a));
    expect(conferirDuasCasas(curado).excecoesVelhas).toEqual([EXC]);
  });
});
