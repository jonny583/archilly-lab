/**
 * §4 · O NÃO MEDIDO SAI `null`, NUNCA ZERO. (LAB-147, item 900, a dívida própria, D375)
 *
 * ```sh
 * bun test tests/nulo-nunca-zero.test.ts
 * ```
 *
 * O `CLAUDE.md` §4 diz *"Não inventa dado: o não medido sai `null`, nunca zero (D23)"*, e nada lia o código que
 * escreve a medida: a varredura de chamadas (LAB-52) declara que **não** pega o `?? 0` sobre propriedade. Medido no
 * LAB-147, a regra estava **descumprida** na porta — `comprimentoDeVia_m` somava `v.comprimento_m ?? 0` sobre uma via
 * que o contrato v1 não mede, e a prova do LAB-06 gravou zero metro de rua para 974 lotes (`src/nulo-nunca-zero.ts`
 * tem a régua; o relatório, a tabela).
 *
 * **Os dois lados, nesta ordem:** a casa de hoje passa, com cada zero sobre medida declarado e com motivo; e cada
 * jeito de inventar um zero novo reprova. Lê só arquivo deste repositório: entra no trabalho sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { indicadoresDa } from "../src/porta/indicadores.ts";
import {
  O_QUE_ISTO_NAO_ALCANCA,
  ZEROS_DECLARADOS,
  conferirNuloNuncaZero,
  ehMedida,
  zerosSobreMedida,
} from "../src/nulo-nunca-zero.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const versionados = execFileSync("git", ["-C", RAIZ, "ls-files"], { encoding: "utf8" })
  .split("\n")
  .filter((c) => c !== "" && /\.(ts|tsx|js|mjs|cjs)$/.test(c));

const arvore = () => versionados.map((caminho) => ({ caminho, texto: readFileSync(join(RAIZ, caminho), "utf8") }));

/** Um arquivo plantado, dentro do universo. */
const plantado = (texto: string, caminho = "external-engines/esteira/src/plantado.ts") => [{ caminho, texto }];

// As formas ruins se montam por pedaços, para que este arquivo não contenha nenhuma (ele está fora do universo
// por ser teste, mas a régua de chamadas e a de segredos leem o texto inteiro).
const OU = "?" + "?";

describe("§4 · a régua: o que é medida, e as duas formas do zero", () => {
  test("o caso bom: sufixo de unidade é medida; contador, nome sem unidade e tempo não são", () => {
    for (const n of ["areaPrivativa_m2", "comprimento_m", "rampaPior_pct", "azimute_graus", "area_ha", "volume_m3"]) {
      expect(ehMedida(n), n).toBe(true);
    }
    for (const n of ["lotes", "numLotes", "nota", "mediana", "motor_ms", "lotes_nas92", "quantos"]) {
      expect(ehMedida(n), n).toBe(false);
    }
  });

  test("o caso que quase parece inválido: contador e comprimento de lista com `?? 0` passam", () => {
    const codigo = [
      `grau.set(k, (grau.get(k) ${OU} 0) + 1);`,
      `const curvas = entrada.relevo?.curvas?.length ${OU} 0;`,
      `porRegra[k] = (porRegra[k] ${OU} 0) + n;`,
      `const ladoMinimo = 0.5 || 0.25;`,
      `const x = y ${OU} 0.5;`,
    ].join("\n");
    const l = zerosSobreMedida(codigo);
    expect(l.zeros).toBe(3);
    expect(l.sobreMedida).toEqual([]);
  });

  test("a forma OPERANDO: o zero no lugar de uma medida ausente", () => {
    const l = zerosSobreMedida(`const a = r.judge.areaPrivativa_m2 ${OU} 0;\nconst b = (v.comprimento_m || 0) + 1;`);
    expect(l.sobreMedida.map((z) => [z.linha, z.forma, z.medida])).toEqual([
      [1, "operando", "areaPrivativa_m2"],
      [2, "operando", "comprimento_m"],
    ]);
  });

  test("a forma CHAVE: o zero gravado numa medida — a máxima de uma lista vazia", () => {
    const l = zerosSobreMedida(`  maxima_pct: n2(lista.at(-1) ${OU} 0),\n  "minima_m2": n2(areas[0] ${OU} 0),`);
    expect(l.sobreMedida.map((z) => [z.forma, z.medida])).toEqual([
      ["chave", "maxima_pct"],
      ["chave", "minima_m2"],
    ]);
  });

  test("a chave de antes de uma vírgula é de outra chave, e não conta", () => {
    expect(zerosSobreMedida(`{ area_m2: a, lotes: lista.length ${OU} 0 }`).sobreMedida).toEqual([]);
  });

  test("comentário não conta: a regra se escreve citando a forma que ela proíbe", () => {
    const l = zerosSobreMedida(`// nunca \`x.area_m2 ${OU} 0\`\n/* nem maxima_pct: a ${OU} 0 */\nconst a = 1;`);
    expect(l.zeros).toBe(0);
  });
});

describe("§4 · a casa de hoje", () => {
  test("a regra está escrita no `CLAUDE.md` §4, que é de onde esta trava a lê", () => {
    const claude = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    const s4 = claude.slice(claude.indexOf("## 4 ·"), claude.indexOf("## 4-A ·"));
    expect(s4).toContain("o não medido sai `null`, nunca zero (D23)");
  });

  test("O LADO BOM: a árvore versionada passa, com o universo publicado", () => {
    const r = conferirNuloNuncaZero(arvore());
    expect(r.problemas.map((p) => `${p.tipo} ${p.arquivo}: ${p.oQue}`)).toEqual([]);
    // O universo, para que um verde sem leitura se denuncie (D164).
    expect(r.arquivos).toBeGreaterThan(150);
    expect(r.zeros).toBeGreaterThan(100);
    expect(r.sobreMedida).toBe(Object.values(ZEROS_DECLARADOS).reduce((s, d) => s + d.quantos, 0));
    console.log(
      `  nulo, nunca zero: ${r.arquivos} arquivos de código, ${r.zeros} zeros \`?? 0\`/\`|| 0\`, ` +
        `${r.sobreMedida} sobre medida, em ${Object.keys(r.porArquivo).length} arquivos — todos declarados`,
    );
  });

  test("toda declaração tem classe e motivo, e nenhuma é de teste", () => {
    for (const [caminho, d] of Object.entries(ZEROS_DECLARADOS)) {
      expect(d.motivo.length, caminho).toBeGreaterThanOrEqual(40);
      expect(caminho, caminho).not.toMatch(/\/tests\//);
      expect(d.quantos, caminho).toBeGreaterThan(0);
    }
  });

  test("os dois consertos do LAB-147 não voltam: o julgamento e a porta estão FORA da lista", () => {
    expect(ZEROS_DECLARADOS["external-engines/esteira/src/motores/comum.ts"]).toBeUndefined();
    expect(ZEROS_DECLARADOS["external-engines/esteira/src/porta/motores.ts"]).toBeUndefined();
    expect(ZEROS_DECLARADOS["external-engines/esteira/src/porta/indicadores.ts"]).toBeUndefined();
  });

  test("a porta: via sem comprimento sai `null`, e não zero metro de rua", () => {
    // A via do contrato v1 do Generate não tem campo de comprimento: antes do LAB-147 isto dava 0.
    expect(indicadoresDa({ lotes: [{}, {}], vias: [{ rampaMedia_pct: 1 }, { rampaMedia_pct: 2 }] }).comprimentoDeVia_m).toBeNull();
    // A mistura também: uma via sem comprimento basta para a soma não ser a rede.
    expect(indicadoresDa({ vias: [{ comprimento_m: 10 }, {}] }).comprimentoDeVia_m).toBeNull();
    // A medida, quando existe, continua somando; sem via nenhuma, `null` como antes.
    expect(indicadoresDa({ vias: [{ comprimento_m: 10 }, { comprimento_m: 5.5 }] }).comprimentoDeVia_m).toBe(15.5);
    expect(indicadoresDa({ vias: [] }).comprimentoDeVia_m).toBeNull();
  });

  test("o que ela não alcança está dito, e o `: 0` do ternário é o primeiro exemplo medido", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
    expect(O_QUE_ISTO_NAO_ALCANCA.some((l) => l.includes("ternário"))).toBe(true);
  });
});

describe("§4 · as mutações — cada jeito de inventar um zero reprova", () => {
  const tipos = (arqs: { caminho: string; texto: string }[], decl = {}) =>
    conferirNuloNuncaZero(arqs, decl).problemas.map((p) => p.tipo);

  test("zero sobre medida num arquivo novo → zero-inventado", () => {
    expect(tipos(plantado(`export const a = (x: { area_m2?: number }) => x.area_m2 ${OU} 0;`))).toEqual(["zero-inventado"]);
  });

  test("um zero a mais num arquivo declarado → zero-inventado, nos dois sentidos da contagem", () => {
    const texto = `const a = v.area_m2 ${OU} 0;\nconst b = v.testada_m ${OU} 0;`;
    const decl = (n: number) => ({ "external-engines/esteira/src/plantado.ts": { quantos: n, classe: "nunca-dispara" as const, motivo: "x".repeat(40) } });
    expect(tipos(plantado(texto), decl(1))).toEqual(["zero-inventado"]);
    expect(tipos(plantado(texto), decl(2))).toEqual([]);
    expect(tipos(plantado(texto), decl(3))).toEqual(["declaracao-que-sobra"]);
  });

  test("declaração de arquivo que não existe → declaracao-sem-arquivo", () => {
    const decl = { "external-engines/esteira/src/sumiu.ts": { quantos: 1, classe: "nunca-dispara" as const, motivo: "x".repeat(40) } };
    expect(tipos(plantado(`const a = (m.get(k) ${OU} 0) + 1;`), decl)).toEqual(["declaracao-sem-arquivo"]);
  });

  test("declaração sem motivo → declaracao-sem-motivo", () => {
    const decl = { "external-engines/esteira/src/plantado.ts": { quantos: 1, classe: "nunca-dispara" as const, motivo: "porque sim" } };
    expect(tipos(plantado(`const a = v.area_m2 ${OU} 0;`), decl)).toEqual(["declaracao-sem-motivo"]);
  });

  test("teste e upstream ficam fora do universo; arquivo fora do universo não conta", () => {
    expect(tipos(plantado(`const a = v.area_m2 ${OU} 0; const b = (m.get(k) ${OU} 0) + 1;`, "external-engines/esteira/tests/x.test.ts"))).toEqual(["universo-vazio"]);
    expect(tipos(plantado(`const a = v.area_m2 ${OU} 0;`, "external-engines/symbios/upstream/x.ts"))).toEqual(["universo-vazio"]);
  });

  test("universo sem zero nenhum → universo-vazio (régua que não leu nada não diz limpo)", () => {
    expect(tipos([])).toEqual(["universo-vazio"]);
    expect(tipos(plantado("export const a = 1;"))).toEqual(["universo-vazio"]);
  });

  test("a árvore de verdade com a forma antiga da porta de volta → zero-inventado", () => {
    const caminho = "external-engines/esteira/src/porta/indicadores.ts";
    const mutada = arvore().map((a) =>
      a.caminho === caminho
        ? { ...a, texto: a.texto + `\nexport const velho = (v: { comprimento_m?: number }) => v.comprimento_m ${OU} 0;\n` }
        : a,
    );
    const r = conferirNuloNuncaZero(mutada);
    expect(r.problemas.map((p) => [p.tipo, p.arquivo])).toEqual([["zero-inventado", caminho]]);
  });
});
