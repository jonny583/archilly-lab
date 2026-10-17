/**
 * **LAB-154 (item 900) · não reimplementa o Validator nem o Judge** (D382).
 *
 * ```sh
 * bun test tests/o-julgamento-vem-do-generate.test.ts
 * ```
 *
 * O `CLAUDE.md` §4 diz que o Lab não reimplementa o Validator nem o Judge (D20); a guarda do LAB-36 perguntava a uma
 * pasta (`esteira/src/`), por cinco nomes, na forma `function`/`class`, e confiava na MENÇÃO de `@generate/` no
 * `comum.ts`. Um Validator falso no `comum.ts` passou a suíte inteira sem nenhum teste de veredito cair. O motivo
 * inteiro está no cabeçalho de `src/o-julgamento-vem-do-generate.ts`.
 *
 * Roda **sem clones** (lê o `git ls-files` DESTE repositório e a árvore sintática de cada arquivo; não segue import para
 * dentro de clone nenhum), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  EXCECAO,
  O_JULGAMENTO,
  O_PONTO,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirAArvore,
  conferirAOrigemDoVeredito,
  funcoesRustDoVocabulario,
} from "../src/o-julgamento-vem-do-generate.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const DO_GENERATE = `import { montarParcelamentoExterno, montarRelatorio } from "${O_JULGAMENTO.especificador}";\n`;
const PONTO_DE_HOJE = `${DO_GENERATE}export function julgar(s: unknown) {\n  const l = montarParcelamentoExterno(s as never, {});\n  return montarRelatorio(l.externo, null);\n}\n`;
const DUBLE = "external-engines/esteira/tests/entrega.test.ts";
const DUBLE_DE_HOJE = "const julgarPorLotes = (r: { lotes: number }) => ({ aprovada: r.lotes > 0 });\n";

/** Um repositório de mentira: caminho → texto. Os arquivos carregados são as chaves. */
const HOJE: Record<string, string> = {
  [O_PONTO]: PONTO_DE_HOJE,
  [DUBLE]: DUBLE_DE_HOJE,
  "external-engines/esteira/ferramentas/lab06.ts":
    'import { julgar } from "../src/motores/comum.ts";\nconst julgarComARegua = (r: unknown) => julgar(r);\n',
  "docs/INDEX.md": "# índice\n",
};
const conferir = (arvore: Record<string, string>, excecao = EXCECAO) =>
  conferirAOrigemDoVeredito(Object.keys(arvore), (c) => arvore[c] ?? null, excecao).problemas.map(
    (p) => `${p.tipo}:${p.caminho}${p.nome ? `#${p.nome}` : ""}`,
  );
const comMais = (extra: Record<string, string>) => conferir({ ...HOJE, ...extra });

describe("LAB-154 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §4 diz que não reimplementa o Validator nem o Judge", () => {
    const claude = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    expect(aRegraEstaEscrita(claude, A_REGRA)).toBe(true);
  });

  test("a D20 nomeia os dois símbolos que esta trava segue", () => {
    const decisoes = readFileSync(join(RAIZ, "docs", "DECISOES.md"), "utf8");
    const d20 = decisoes.slice(decisoes.indexOf("## D20 "), decisoes.indexOf("## D21 "));
    for (const s of O_JULGAMENTO.simbolos) expect(d20, `a D20 não diz ${s}`).toContain(s);
  });

  test("a exceção é uma, com motivo", () => {
    expect(EXCECAO.map((e) => `${e.caminho}#${e.nome}`)).toEqual([`${DUBLE}#julgarPorLotes`]);
    for (const e of EXCECAO) expect(e.motivo.length).toBeGreaterThan(20);
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThan(3);
  });
});

describe("LAB-154 · a árvore de hoje", () => {
  const r = conferirAArvore(RAIZ);

  test("nenhum problema", () => {
    expect(r.problemas).toEqual([]);
  });

  test("o ponto e o adaptador do Parcelamento importam o julgamento", () => {
    expect(r.importam).toContain(O_PONTO);
    expect(r.importam).toContain("external-engines/testfit/adapter/src/esteira.ts");
    // 18 no dia do LAB-154; o piso é folgado, para não travar ferramenta nova.
    expect(r.importam.length).toBeGreaterThan(10);
  });

  test("as funções com nome de julgamento: todas chegam ao Generate, menos o dublê declarado", () => {
    const naoChegam = r.comNomeDeJulgamento.filter((f) => !f.chega).map((f) => `${f.caminho}#${f.nome}`);
    expect(naoChegam).toEqual([`${DUBLE}#julgarPorLotes`]);
    const chegam = r.comNomeDeJulgamento.filter((f) => f.chega).map((f) => `${f.caminho}#${f.nome}`);
    expect(chegam).toContain(`${O_PONTO}#julgar`);
    expect(chegam).toContain("external-engines/esteira/ferramentas/lab06.ts#julgarComARegua");
    expect(chegam).toContain("external-engines/esteira/src/motores/testfit.ts#variantesJulgadasDoTestfit");
  });

  test("o universo lido se publica, e não é pequeno (D164)", () => {
    // 335 TypeScript/JavaScript e 5 Rust antes desta trava; pisos folgados de propósito.
    expect(r.lidos.ts).toBeGreaterThan(300);
    expect(r.lidos.rs).toBeGreaterThan(3);
  });
});

describe("LAB-154 · o lado bom — o que NÃO é acusado", () => {
  test("a árvore de mentira de hoje passa", () => {
    expect(conferir(HOJE)).toEqual([]);
  });

  test("o embrulho que chama o julgamento pela cadeia, por relativo, por apelido da casa e por re-exportação", () => {
    expect(
      comMais({
        "external-engines/symbios/adapter/src/juiz.ts":
          'import { julgar as j } from "../../../esteira/src/motores/comum.ts";\nexport const validarSaida = (x: unknown) => j(x);\n',
        "external-engines/symbios/adapter/src/index.ts": 'export { validarSaida } from "./juiz.ts";\n',
        "external-engines/esteira/ferramentas/labxx.ts":
          'import { validarSaida } from "@symbios/index.ts";\nfunction julgarTudo(xs: unknown[]) { return xs.map((x) => validarSaida(x)); }\n',
      }),
    ).toEqual([]);
  });

  test("o símbolo do Generate passado como argumento chega", () => {
    expect(
      comMais({
        "external-engines/esteira/src/lote.ts": `${DO_GENERATE}export const julgarLote = (xs: never[]) => xs.map(montarRelatorio);\n`,
      }),
    ).toEqual([]);
  });

  test("nome de julgamento citado em comentário ou em string não é definição; resultado guardado não é função", () => {
    expect(
      comMais({
        "external-engines/esteira/src/texto.ts":
          '// function validar() {}\nexport const m = "function julgarLocal() {}";\nconst julgadas = [1, 2].filter(Boolean);\n',
      }),
    ).toEqual([]);
  });

  test("upstream/ e node_modules/ não são desta casa", () => {
    expect(
      comMais({
        "external-engines/symbios/upstream/src/validate.ts": "export function validate() { return true; }\n",
        "external-engines/esteira/node_modules/x/judge.js": "export function judge() { return 1; }\n",
      }),
    ).toEqual([]);
  });

  test("o Rust sem fn de julgamento passa; comentário não conta", () => {
    expect(funcoesRustDoVocabulario("// fn validar() {}\nfn main() {}\n")).toEqual([]);
    expect(comMais({ "external-engines/symbios/archilly/wasm/src/lib.rs": "pub fn rodar() {}\n" })).toEqual([]);
  });
});

describe("LAB-154 · o lado ruim — plantado, e acusado", () => {
  test("as três mutações da medição, literais", () => {
    expect(
      comMais({
        "external-engines/symbios/adapter/src/juiz.ts":
          "export function julgarLocal(lotes: number) { return { aprovada: lotes > 0, nota: lotes }; }\n",
      }),
    ).toEqual(["julgamento-proprio:external-engines/symbios/adapter/src/juiz.ts#julgarLocal"]);
    expect(
      comMais({
        "external-engines/esteira/src/nota-propria.ts":
          "export const validar = (lotes: number) => ({ limpo: lotes > 0, violacoes: 0 });\n",
      }),
    ).toEqual(["julgamento-proprio:external-engines/esteira/src/nota-propria.ts#validar"]);
    const falso =
      "// (antes vinha de @generate/import/parcelamento-externo.ts)\n" +
      "const montarParcelamentoExterno = (s: any, _o: any): any => ({ externo: s });\n" +
      "const montarRelatorio = (e: any, _n: any): any => ({ judge: { numLotes: 0 } });\n" +
      "export function julgar(s: unknown) { return montarRelatorio(montarParcelamentoExterno(s, {}).externo, null); }\n";
    expect(comMais({ [O_PONTO]: falso }).sort()).toEqual(
      [
        `ponto-sem-importacao:${O_PONTO}`,
        `simbolo-redefinido:${O_PONTO}#montarParcelamentoExterno`,
        `simbolo-redefinido:${O_PONTO}#montarRelatorio`,
        `julgamento-proprio:${O_PONTO}#julgar`,
        "julgamento-proprio:external-engines/esteira/ferramentas/lab06.ts#julgarComARegua",
      ].sort(),
    );
  });

  test("cada forma de escrever função: classe, método, propriedade, embrulhada em `as`, função anônima", () => {
    const formas: Record<string, string> = {
      "a.ts": "export class Judge { nota() { return 1; } }\n",
      "b.ts": "export const o = { validarPlano(x: number) { return x > 0; } };\n",
      "c.ts": "export const o = { juiz: (x: number) => x };\n",
      "d.ts": "export const validador = ((x: number) => x > 0) as (x: number) => boolean;\n",
      "e.ts": "export const julgamento = function (x: number) { return x; };\n",
      "f.tsx": "export class Painel { validator = (x: number) => x; }\n",
    };
    for (const [arq, texto] of Object.entries(formas)) {
      const caminho = `external-engines/esteira/src/${arq}`;
      const p = comMais({ [caminho]: texto });
      expect(p.length, `${arq} não foi acusado`).toBeGreaterThan(0);
      expect(p.every((x) => x.startsWith(`julgamento-proprio:${caminho}#`))).toBe(true);
    }
  });

  test("o ponto que só MENCIONA o Generate, ou que importa de outro lugar, não importa o julgamento", () => {
    const soMencao = `// ${DO_GENERATE}export function julgar(s: unknown) { return s; }\n`;
    expect(comMais({ [O_PONTO]: soMencao })).toContain(`ponto-sem-importacao:${O_PONTO}`);
    const outroLugar = PONTO_DE_HOJE.replace(O_JULGAMENTO.especificador, "@generate/engine/outro.ts");
    expect(comMais({ [O_PONTO]: outroLugar })).toContain(`ponto-sem-importacao:${O_PONTO}`);
  });

  test("redefinir o nome do julgamento noutro arquivo é acusado, mesmo sem usá-lo", () => {
    expect(
      comMais({ "external-engines/esteira/src/x.ts": "export function montarRelatorio() { return {}; }\n" }),
    ).toEqual(["simbolo-redefinido:external-engines/esteira/src/x.ts#montarRelatorio"]);
  });

  test("a cadeia de três elos, em ordem contrária à de leitura, chega — e cortada no fim, não chega", () => {
    const cadeia = (fim: string): Record<string, string> => ({
      "external-engines/esteira/src/a.ts": 'import { b } from "./b.ts";\nexport function julgarA() { return b(); }\n',
      "external-engines/esteira/src/b.ts": 'import { c } from "./c.ts";\nexport function b() { return c(); }\n',
      "external-engines/esteira/src/c.ts": fim,
    });
    expect(comMais(cadeia(`${DO_GENERATE}export function c() { return montarRelatorio({} as never, null); }\n`))).toEqual([]);
    expect(comMais(cadeia("export function c() { return 1; }\n"))).toEqual([
      "julgamento-proprio:external-engines/esteira/src/a.ts#julgarA",
    ]);
  });

  test("o Rust com fn de julgamento é acusado", () => {
    expect(funcoesRustDoVocabulario("pub fn validar_plano() {}\n")).toEqual(["validar_plano"]);
    expect(
      comMais({ "external-engines/symbios/archilly/wasm/src/lib.rs": "pub fn julgar(x: u32) -> u32 { x }\n" }),
    ).toEqual(["julgamento-proprio:external-engines/symbios/archilly/wasm/src/lib.rs#julgar"]);
  });

  test("a exceção que sumiu, nos dois jeitos: o dublê apagado, e o dublê que passou a chegar ao Generate", () => {
    const semDuble = { ...HOJE };
    delete semDuble[DUBLE];
    expect(conferir(semDuble)).toEqual([`excecao-que-sumiu:${DUBLE}#julgarPorLotes`]);
    expect(
      comMais({
        [DUBLE]: 'import { julgar } from "../src/motores/comum.ts";\nconst julgarPorLotes = (r: unknown) => julgar(r);\n',
      }),
    ).toEqual([`excecao-que-sumiu:${DUBLE}#julgarPorLotes`]);
  });

  test("a exceção é por arquivo E nome: o mesmo nome noutro arquivo é acusado", () => {
    expect(comMais({ "external-engines/esteira/tests/outro.test.ts": DUBLE_DE_HOJE })).toEqual([
      "julgamento-proprio:external-engines/esteira/tests/outro.test.ts#julgarPorLotes",
    ]);
  });

  test("o universo vazio", () => {
    expect(conferir({ "docs/INDEX.md": "# índice\n" }, [])).toContain("universo-vazio:—");
  });
});
