/**
 * **LAB-159 (item 900) · a entrada se confere antes de entrar no núcleo — em três portas, não duas** (D387).
 *
 * ```sh
 * bun test tests/entrada-validada.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` afirma, desde o LF-FINAL (14/09/2026), que versão do contrato, unidade e anel de menos de 3
 * pontos são recusados antes do núcleo, em `ida.ts` e `gleba-v1.ts`. Nenhuma trava perguntava. Medido por LUGAR: a
 * terceira porta, a do motor interno do Generate (LAB-13), não recusava nada — aceitou pés e contrato "9" e devolveu
 * 1 606 lotes. O motivo inteiro está no cabeçalho de `src/entrada-validada.ts`.
 *
 * Roda **sem clones** (lê o `git ls-files` DESTE repositório e a `gleba-v1.ts`, que só importa o adaptador do
 * Symbios, daqui), e por isso está no portão sem clones do `verde.yml`. O comportamento da porta do Generate, que
 * precisa do clone, se prova em `motores.test.ts`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_LINHA,
  A_PAGINA,
  NAO_SAO_PORTA,
  O_QUE_ISTO_NAO_ALCANCA,
  PORTAS,
  QUEM_CONFERE,
  conferirAArvore,
  conferirAsPortasDaEntrada,
  funcoesExportadas,
} from "../src/entrada-validada.ts";
import { glebaParaOSymbios, recusaDaEntrada, type EntradaMinima } from "../src/gleba-v1.ts";
import { arquivosQueOGitCarrega } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (c: string) => readFileSync(join(RAIZ, c), "utf8");

/** A árvore de hoje, só com os arquivos que a trava lê — e um jeito de trocar o texto de um deles. */
function hoje(): Record<string, string> {
  const arvore: Record<string, string> = {};
  for (const c of new Set([
    ...PORTAS.map((p) => p.arquivo),
    ...NAO_SAO_PORTA.map((n) => n.arquivo),
    ...QUEM_CONFERE.map((q) => q.arquivo),
    "external-engines/esteira/src/motores/comum.ts",
  ])) {
    arvore[c] = ler(c);
  }
  return arvore;
}
const conferir = (arvore: Record<string, string>) =>
  conferirAsPortasDaEntrada(Object.keys(arvore), (c) => arvore[c] ?? null).problemas.map(
    (p) => `${p.tipo}:${p.funcao}`,
  );
function trocar(arvore: Record<string, string>, arquivo: string, de: string | RegExp, para: string) {
  const antes = arvore[arquivo]!;
  const depois = antes.replace(de, para);
  expect(depois).not.toBe(antes); // a mutação tem de acontecer, senão ela prova nada
  arvore[arquivo] = depois;
}

const GENERATE = "external-engines/esteira/src/motores/generate.ts";
const SYMBIOS = "external-engines/esteira/src/motores/symbios.ts";
const TESTFIT = "external-engines/esteira/src/motores/testfit.ts";
const GLEBA = "external-engines/esteira/src/gleba-v1.ts";
const IDA = "external-engines/testfit/adapter/src/ida.ts";

describe("LAB-159 · a página diz as três portas e aponta para a trava", () => {
  const pagina = readFileSync(join(RAIZ, A_PAGINA), "utf8");
  const linha = pagina.split("\n").find((l) => l.startsWith(`| ${A_LINHA}`));

  test("a linha da tabela existe e nomeia as três portas", () => {
    expect(linha).toBeDefined();
    for (const nome of ["`ida.ts`", "`gleba-v1.ts`", "`motores/generate.ts`"]) expect(linha).toContain(nome);
  });

  test("a página aponta para a trava e para o teste", () => {
    expect(pagina).toContain("external-engines/esteira/src/entrada-validada.ts");
    expect(pagina).toContain("tests/entrada-validada.test.ts");
    expect(pagina).toContain("## Reconferido no LAB-159");
  });
});

describe("LAB-159 · a árvore de hoje", () => {
  const r = conferirAArvore(RAIZ, arquivosQueOGitCarrega(RAIZ));

  test("zero problemas, e o universo publicado", () => {
    console.log(`[LAB-159] ${r.resumo}`);
    expect(r.problemas).toEqual([]);
    // Medido em 17/10/2026: sete funções exportadas em motores/, todas recebem a entrada.
    expect(r.funcoesLidas).toBe(7);
    expect(r.recebemAEntrada).toBe(7);
  });

  test("cada declaração tem motivo, e o que não se alcança está dito", () => {
    for (const n of NAO_SAO_PORTA) expect(n.porque.length).toBeGreaterThan(20);
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-159 · o comportamento da recusa (sem clones)", () => {
  const base = {
    archilly: { versao: "1" },
    crs: { unidade: "m" },
    gleba: { anel: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }] },
  };

  test("o caso bom passa, e as versões lidas também", () => {
    expect(recusaDaEntrada(base)).toBeNull();
    expect(recusaDaEntrada({ ...base, archilly: { versao: "2" } })).toBeNull();
  });

  test("as três recusas, com a mensagem de antes, palavra por palavra", () => {
    expect(recusaDaEntrada({ ...base, archilly: { versao: "9" } })).toBe(
      'esta esteira lê o contrato "2" e "1"; chegou versão "9"',
    );
    expect(recusaDaEntrada({ ...base, crs: { unidade: "ft" } })).toBe('o núcleo é em metro; o CRS declarou "ft"');
    expect(recusaDaEntrada({ ...base, gleba: { anel: base.gleba.anel.slice(0, 2) } })).toBe(
      "a gleba tem 2 ponto(s); um anel precisa de 3",
    );
  });

  test("o caso que quase parece inválido: anel de exatamente 3 pontos entra", () => {
    expect(recusaDaEntrada({ ...base, gleba: { anel: base.gleba.anel.slice(0, 3) } })).toBeNull();
  });

  test("o glebaParaOSymbios estoura com unidade e anel — as duas que não tinham teste até o LAB-159", () => {
    const e = { ...base, crs: { ...base.crs, unidade: "ft" } } as unknown as EntradaMinima;
    expect(() => glebaParaOSymbios(e)).toThrow(/núcleo é em metro/);
    const a = { ...base, gleba: { anel: base.gleba.anel.slice(0, 2) } } as unknown as EntradaMinima;
    expect(() => glebaParaOSymbios(a)).toThrow(/um anel precisa de 3/);
  });
});

describe("LAB-159 · a régua, nos dois sentidos", () => {
  test("o corpo de função com tipo de objeto no parâmetro não para no `})` da assinatura", () => {
    const f = funcoesExportadas(`export function f(e: {\n  a: number;\n}): number {\n  return g(e);\n}\n`);
    expect(f.get("f")).toContain("return g(e)");
  });

  test("a chamada ao motor dentro de COMENTÁRIO não conta", () => {
    const a = hoje();
    trocar(a, GENERATE, "  const recusa = recusaDaEntrada(entrada);", "  // gerarPlano(\n  const recusa = recusaDaEntrada(entrada);");
    expect(conferir(a)).toEqual([]);
  });

  test("ontem: a porta do Generate sem a conferência reprova", () => {
    const a = hoje();
    trocar(a, GENERATE, "const recusa = recusaDaEntrada(entrada);", "const recusa = null as string | null;");
    expect(conferir(a)).toEqual(["motor-antes-da-conferencia:rodarGenerate"]);
  });

  test("a conferência DEPOIS do motor reprova", () => {
    const a = hoje();
    trocar(a, GENERATE, "const recusa = recusaDaEntrada(entrada);", "const recusa = null as string | null;");
    trocar(a, GENERATE, "  const ms = performance.now() - t0;", "  const ms = performance.now() - t0;\n  recusaDaEntrada(entrada);");
    expect(conferir(a)).toEqual(["motor-antes-da-conferencia:rodarGenerate"]);
  });

  test("o Symbios que pula o glebaParaOSymbios reprova", () => {
    const a = hoje();
    trocar(a, SYMBIOS, "glebaParaOSymbios(entrada)", "({ terreno: entrada as never, perdas: [] })");
    expect(conferir(a)).toEqual(["motor-antes-da-conferencia:redeDoSymbios"]);
  });

  test("a quarta porta nascendo sem declaração reprova", () => {
    const a = hoje();
    a["external-engines/esteira/src/motores/novo.ts"] =
      `import type { EntradaMinima } from "../gleba-v1.ts";\nexport function rodarNovo(e: EntradaMinima) {\n  return gerarPlano(e.gleba.anel);\n}\n`;
    expect(conferir(a)).toEqual(["porta-nao-declarada:rodarNovo"]);
  });

  test("função que chama motor sem receber a entrada também é porta", () => {
    const a = hoje();
    a["external-engines/esteira/src/motores/novo.ts"] = `export function rodarCru(anel: unknown) {\n  return gerarPlano(anel);\n}\n`;
    expect(conferir(a)).toEqual(["porta-nao-declarada:rodarCru"]);
  });

  test("a não-porta que passa a rodar motor reprova", () => {
    const a = hoje();
    trocar(a, GENERATE, "  const p = entrada.parametros;", "  gerarPlano([] as never);\n  const p = entrada.parametros;");
    expect(conferir(a)).toEqual(["nao-porta-que-roda-motor:parametrosDoGenerate"]);
  });

  test("a porta declarada que some reprova", () => {
    const a = hoje();
    trocar(a, TESTFIT, "export function variantesJulgadasDoTestfit(", "function variantesJulgadasDoTestfit(");
    expect(conferir(a)).toEqual(["declarada-que-sumiu:variantesJulgadasDoTestfit"]);
  });

  test("a recusa da unidade que some da gleba-v1 reprova", () => {
    const a = hoje();
    trocar(a, GLEBA, /if \(e\.crs\.unidade !== "m"\) \{\n\s*return [^\n]*\n\s*\}\n/, "");
    expect(conferir(a)).toEqual(["recusa-que-falta:recusaDaEntrada"]);
  });

  test("o glebaParaOSymbios que deixa de perguntar reprova", () => {
    const a = hoje();
    trocar(a, GLEBA, "const recusa = recusaDaEntrada(e);", "const recusa = null as string | null;");
    expect(conferir(a)).toEqual(["recusa-que-falta:glebaParaOSymbios"]);
  });

  test("a recusa do anel que some da ida do Parcelamento reprova", () => {
    const a = hoje();
    trocar(a, IDA, /if \(perimetro\.length < 3\)[^\n]*\n/, "");
    expect(conferir(a)).toEqual(["recusa-que-falta:idaParaOMotor"]);
  });

  test("o universo vazio reprova (D164)", () => {
    expect(conferirAsPortasDaEntrada([], () => null).problemas.map((p) => p.tipo)).toContain("universo-vazio");
  });
});
