/**
 * **LAB-134 (item 900) · o Generate nunca depende disto — a régua, nos dois lados** (D362).
 *
 * ```sh
 * bun test tests/generate-nao-depende.test.ts
 * ```
 *
 * Só travas sintéticas: um Generate de mentira, limpo, que cada teste estraga num ponto. Roda **sem
 * clones**, e por isso está no portão sem clones do `verde.yml`. A conferência contra o clone de
 * verdade mora em `generate-nao-depende-com-clone.test.ts`, no verde completo — *mover por ARQUIVO
 * quando a dependência é de TRAVA paga a conta de quem não mediu* (LAB-84).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  EXCECOES,
  conferirOGenerate,
  type ArquivoDoGenerate,
  type ExcecaoDeLeitura,
} from "../src/generate-nao-depende.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const MEDIDOR = "scripts/medir-violacoes-do-testfit.ts";

/** Um Generate de mentira: limpo, com a exceção de hoje lendo o que ela lê hoje. */
function generate(...trocas: ArquivoDoGenerate[]): ArquivoDoGenerate[] {
  const base: ArquivoDoGenerate[] = [
    { caminho: "package.json", texto: JSON.stringify({ name: "g", scripts: { test: "vitest" }, dependencies: { zod: "^3" } }) },
    { caminho: "tsconfig.json", texto: JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }) },
    { caminho: "src/lib/a.ts", texto: 'import { b } from "./b";\nexport const a = b + 1;\n' },
    { caminho: "src/lib/b.ts", texto: "export const b = 1;\n" },
    { caminho: "scripts/diag-tudo.ts", texto: 'import "../src/lib/a";\nconsole.log("bateria");\n' },
    {
      caminho: MEDIDOR,
      texto:
        "/** Clone o archilly-lab (só leitura). */\n" +
        'const PASTA = process.argv[2] ?? "/home/user/jonny583/archilly-lab/docs/contratos/saidas";\n' +
        "console.log(PASTA);\n",
    },
    { caminho: "README.md", texto: "Lê as saídas do archilly-lab e de external-engines.\n" },
  ];
  const porCaminho = new Map(base.map((a) => [a.caminho, a]));
  for (const t of trocas) porCaminho.set(t.caminho, t);
  return [...porCaminho.values()];
}
const tipos = (arquivos: ArquivoDoGenerate[], excecoes?: readonly ExcecaoDeLeitura[]) =>
  conferirOGenerate(arquivos, excecoes).problemas.map((p) => `${p.tipo} ${p.arquivo}`);

describe("LAB-134 · a regra e a exceção, escritas", () => {
  test("a regra está escrita onde mora — o §3", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
  });

  test("toda exceção tem motivo, e o arquivo é código", () => {
    expect(EXCECOES.length).toBeGreaterThan(0);
    for (const e of EXCECOES) {
      expect(e.motivo.length, e.arquivo).toBeGreaterThan(40);
      expect(e.arquivo).toMatch(/\.(ts|tsx|js|mjs|cjs)$/);
    }
  });
});

describe("LAB-134 · o caso bom, e os que quase parecem ruins", () => {
  test("o Generate de mentira, limpo → nada", () => {
    expect(tipos(generate())).toEqual([]);
  });

  test("o Lab citado só em COMENTÁRIO de código → nada (dizer não é depender)", () => {
    const comComentario = { caminho: "src/lib/b.ts", texto: "// ver archilly-lab/external-engines\nexport const b = 1;\n" };
    expect(tipos(generate(comComentario))).toEqual([]);
  });

  test("o Lab citado num `.md` e num JSON de dados → nada (não são lugar de dependência)", () => {
    const catalogo = { caminho: "vendor/archilly-central/dist/familia.json", texto: '{"repositorio":"jonny583/archilly-lab"}' };
    expect(tipos(generate(catalogo))).toEqual([]);
  });

  test("o medidor citado pelo nome só num COMENTÁRIO da bateria → nada", () => {
    const bateria = { caminho: "scripts/diag-tudo.ts", texto: `// não roda o ${MEDIDOR}\nconsole.log("bateria");\n` };
    expect(tipos(generate(bateria))).toEqual([]);
  });
});

describe("LAB-134 · as três mutações medidas antes da régua, replantadas", () => {
  test("a dependência `github:jonny583/archilly-lab` no `package.json` → reprova", () => {
    const pkg = { caminho: "package.json", texto: JSON.stringify({ dependencies: { lab: "github:jonny583/archilly-lab" } }) };
    expect(tipos(generate(pkg))).toEqual(["configuracao-cita-o-lab package.json"]);
  });

  test("um `import` de `external-engines/` no código → reprova, e diz o especificador", () => {
    const especificador = "../../../../../archilly-lab/external-engines/esteira/src/forma.ts";
    const a = { caminho: "src/lib/a.ts", texto: `import "${especificador}";\nexport const a = 1;\n` };
    const r = conferirOGenerate(generate(a));
    expect(r.problemas.map((p) => `${p.tipo} ${p.arquivo}`)).toEqual(["importa-o-lab src/lib/a.ts"]);
    expect(r.problemas[0]!.detalhe).toBe(especificador);
  });

  test("a bateria citando o medidor que lê o Lab → reprova a exceção", () => {
    const bateria = { caminho: "scripts/diag-tudo.ts", texto: `const passos = ["${MEDIDOR}"];\nconsole.log(passos);\n` };
    expect(tipos(generate(bateria))).toEqual([`excecao-citada-por-outro ${MEDIDOR}`]);
  });
});

describe("LAB-134 · a régua nos dois lados", () => {
  test("o `import()` dinâmico é importação; o `require` reprova como leitura", () => {
    // Medido no LAB-134: o `Bun.Transpiler.scan` não devolve `require(...)` em nenhum carregador
    // (`ts`, `js`, `tsx`). O texto do especificador sobra no código sem comentário, então ele
    // reprova do mesmo jeito — com o nome de leitura, não de importação.
    const din = { caminho: "src/lib/a.ts", texto: 'export const m = await import("archilly-lab/x");\n' };
    const req = { caminho: "src/lib/b.cjs", texto: 'module.exports = require("../archilly-lab/y");\n' };
    expect(tipos(generate(din, req))).toEqual(["importa-o-lab src/lib/a.ts", "le-o-lab-sem-excecao src/lib/b.cjs"]);
  });

  test("a caixa não salva: `Archilly-Lab` também é o Lab", () => {
    const a = { caminho: "src/lib/a.ts", texto: 'import "../Archilly-Lab/x";\n' };
    expect(tipos(generate(a))).toEqual(["importa-o-lab src/lib/a.ts"]);
  });

  test("um `tsconfig` com `paths` para o Lab → reprova; e um `tsconfig.scripts.json` também", () => {
    const tc = { caminho: "tsconfig.scripts.json", texto: '{"compilerOptions":{"paths":{"@lab/*":["../archilly-lab/*"]}}}' };
    expect(tipos(generate(tc))).toEqual(["configuracao-cita-o-lab tsconfig.scripts.json"]);
  });

  test("um `.gitmodules` apontando para o Lab → reprova", () => {
    const gm = { caminho: ".gitmodules", texto: '[submodule "lab"]\n\turl = https://github.com/jonny583/archilly-lab\n' };
    expect(tipos(generate(gm))).toEqual(["configuracao-cita-o-lab .gitmodules"]);
  });

  test("o `package.json` de uma subpasta também é lugar", () => {
    const subpasta = { caminho: "vendor/x/package.json", texto: '{"dependencies":{"e":"file:../../archilly-lab/external-engines/esteira"}}' };
    expect(tipos(generate(subpasta))).toEqual(["configuracao-cita-o-lab vendor/x/package.json"]);
  });

  test("um script novo lendo o Lab do disco, sem exceção → reprova", () => {
    const novo = { caminho: "scripts/outro.ts", texto: 'const p = "../archilly-lab/docs/provas";\nconsole.log(p);\n' };
    expect(tipos(generate(novo))).toEqual(["le-o-lab-sem-excecao scripts/outro.ts"]);
  });

  test("a exceção passando a ler `external-engines/` → reprova, mesmo declarada", () => {
    const m = { caminho: MEDIDOR, texto: 'const PASTA = "/home/user/archilly-lab/external-engines/esteira/dados";\n' };
    expect(tipos(generate(m))).toEqual([`excecao-le-external-engines ${MEDIDOR}`]);
  });

  test("a exceção citada nos `scripts` do `package.json` → reprova (entrou na bateria por outra porta)", () => {
    const pkg = { caminho: "package.json", texto: JSON.stringify({ scripts: { gu06: `tsx ${MEDIDOR}` } }) };
    expect(tipos(generate(pkg))).toEqual([`excecao-citada-por-outro ${MEDIDOR}`]);
  });

  test("a exceção que não lê mais o Lab → reprova (exceção que sobrou)", () => {
    const m = { caminho: MEDIDOR, texto: 'const PASTA = process.argv[2] ?? "docs/saidas";\n' };
    expect(tipos(generate(m))).toEqual([`excecao-sobrou ${MEDIDOR}`]);
  });

  test("a exceção cujo arquivo saiu → reprova", () => {
    const semMedidor = generate().filter((a) => a.caminho !== MEDIDOR);
    expect(tipos(semMedidor)).toEqual([`excecao-sem-arquivo ${MEDIDOR}`]);
  });

  test("a leitura que a exceção cobria, sem a exceção → reprova", () => {
    expect(tipos(generate(), [])).toEqual([`le-o-lab-sem-excecao ${MEDIDOR}`]);
  });

  test("o código que não se lê → reprova, não pula", () => {
    const quebrado = { caminho: "src/lib/b.ts", texto: "export const = ;;; {\n" };
    expect(tipos(generate(quebrado))).toEqual(["nao-se-leu src/lib/b.ts"]);
  });

  test("o universo vazio → reprova (o vigia que não leu nada não sai verde)", () => {
    expect(tipos([], [])).toEqual(["universo-vazio (o clone)"]);
    expect(tipos([{ caminho: "README.md", texto: "" }], [])).toEqual(["universo-vazio (o clone)"]);
  });
});
