/**
 * **LAB-157 (item 900) · a semente é a mesma em todas as provas, e o `geradoEm` é carimbo fixo** (D385).
 *
 * ```sh
 * bun test tests/semente-e-carimbo.test.ts
 * ```
 *
 * O `docs/provas/LEIA-ME.md` afirma as duas coisas sobre **todas** as provas, e nenhuma régua as perguntava. Medido por
 * LUGAR, 84 provas: as 111 sementes são `20260913`; dos 34 `geradoEm`, um tem a forma do relógio (`LAB-07/medicoes.json`)
 * — e no código, três linhas liam o relógio para o `geradoEm`. O motivo inteiro, com a medição, está no cabeçalho de
 * `src/semente-e-carimbo.ts`.
 *
 * Roda **sem clones** (lê as provas, o código e a página desta casa), e por isso está no portão sem clones do
 * `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { join } from "node:path";

import {
  A_FRASE_DA_SEMENTE,
  A_FRASE_DO_CARIMBO,
  CARIMBOS_DE_RELOGIO_DECLARADOS,
  O_QUE_ISTO_NAO_ALCANCA,
  RELOGIO_DECLARADO_NO_CODIGO,
  SEMENTE_DA_CASA,
  conferirASementeEOCarimbo,
  ehCarimboFixo,
  entraNoCodigo,
  lerAArvore,
  relogioNoCarimbo,
  type EntradaDaConferencia,
} from "../src/semente-e-carimbo.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ARVORE = lerAArvore(RAIZ);

const PAGINA_MINIMA =
  "- **A semente é a mesma em todos** (`20260913`), e o determinismo é provado;\n" +
  "- **`geradoEm` é carimbo fixo** nas provas, de propósito.\n";

/** Uma árvore mínima e limpa: uma prova, um arquivo de código, a página. */
function minima(mudar: Partial<EntradaDaConferencia> = {}): EntradaDaConferencia {
  return {
    provas: [
      {
        arquivo: "docs/provas/LAB-00/medicoes.json",
        json: { prompt: "LAB-00", geradoEm: "2026-10-17", semente: SEMENTE_DA_CASA, saida: { archilly: { geradoEm: "2026-10-17T00:00:00.000Z" } } },
      },
    ],
    codigo: [{ arquivo: "external-engines/esteira/ferramentas/lab00.ts", fonte: 'const CARIMBO = "2026-10-17";\nconst p = { geradoEm: CARIMBO };\n' }],
    pagina: PAGINA_MINIMA,
    ...mudar,
  };
}

const tipos = (e: EntradaDaConferencia) => conferirASementeEOCarimbo(e, [], []).problemas.map((p) => p.tipo);

describe("LAB-157 · as duas frases estão escritas onde moram", () => {
  test("a página das provas diz que a semente é a mesma em todas e que o geradoEm é carimbo fixo", () => {
    expect(aRegraEstaEscrita(ARVORE.pagina, A_FRASE_DA_SEMENTE)).toBe(true);
    expect(aRegraEstaEscrita(ARVORE.pagina, A_FRASE_DO_CARIMBO)).toBe(true);
  });

  test("e diz que a hora real se chama quando", () => {
    expect(aRegraEstaEscrita(ARVORE.pagina, "A hora em que a medição rodou de verdade se chama `quando`")).toBe(true);
  });
});

describe("LAB-157 · a árvore de verdade", () => {
  const r = conferirASementeEOCarimbo(ARVORE);

  test("nenhum problema — sementes iguais, carimbos fixos, nenhum relógio no código fora do declarado", () => {
    expect(r.problemas).toEqual([]);
  });

  test("o universo lido é publicado, com o piso do dia da trava", () => {
    // As provas só crescem; os pisos são os de 17/10/2026.
    expect(r.provas).toBeGreaterThanOrEqual(84);
    expect(r.sementes).toBeGreaterThanOrEqual(111);
    expect(r.arquivosComSemente).toBeGreaterThanOrEqual(35);
    expect(r.carimbos).toBeGreaterThanOrEqual(34);
    expect(r.carimbos - r.carimbosFixos).toBe(CARIMBOS_DE_RELOGIO_DECLARADOS.length);
    expect(r.arquivosDeCodigo).toBeGreaterThan(150);
    console.log(
      `   semente e carimbo: ${r.provas} provas · ${r.sementes} sementes em ${r.arquivosComSemente} arquivos, todas ${SEMENTE_DA_CASA} · ${r.carimbos} geradoEm, ${r.carimbosFixos} fixos e ${r.carimbos - r.carimbosFixos} declarado(s) · ${r.arquivosDeCodigo} arquivos de código, ${r.relogiosNoCodigo.length} relógio(s) no geradoEm, ${RELOGIO_DECLARADO_NO_CODIGO.length} declarado(s)`,
    );
  });

  test("uma prova declarada e uma linha de código declarada, cada uma com o motivo escrito", () => {
    expect(CARIMBOS_DE_RELOGIO_DECLARADOS).toHaveLength(1);
    expect(RELOGIO_DECLARADO_NO_CODIGO).toHaveLength(1);
    for (const d of [...CARIMBOS_DE_RELOGIO_DECLARADOS, ...RELOGIO_DECLARADO_NO_CODIGO]) {
      expect(d.motivo.length).toBeGreaterThan(80);
    }
  });

  test("as duas ferramentas de medição gravam a hora real em quando, não em geradoEm", () => {
    for (const f of ["testfit/ferramentas/medir.ts", "symbios/adapter/ferramentas/medir.ts"]) {
      const c = ARVORE.codigo.find((x) => x.arquivo === `external-engines/${f}`);
      expect(c).toBeDefined();
      expect(relogioNoCarimbo(c!.arquivo, c!.fonte)).toEqual([]);
      expect(c!.fonte).toContain("quando: new Date().toISOString()");
    }
  });

  test("o que ela não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-157 · o lado ruim — cada mentira é acusada", () => {
  test("a mutação da medição: o medir.ts de volta ao relógio no geradoEm", () => {
    const codigo = ARVORE.codigo.map((c) =>
      c.arquivo === "external-engines/testfit/ferramentas/medir.ts"
        ? { ...c, fonte: c.fonte.replace("quando: new Date().toISOString()", "geradoEm: new Date().toISOString()") }
        : c,
    );
    const r = conferirASementeEOCarimbo({ ...ARVORE, codigo });
    expect(r.problemas.map((p) => p.tipo)).toEqual(["relogio-no-codigo"]);
    expect(r.problemas[0]!.detalhe).toContain("testfit/ferramentas/medir.ts");
  });

  test("uma prova nova com a hora real no geradoEm", () => {
    const provas = [
      ...ARVORE.provas,
      { arquivo: "docs/provas/LAB-999/medicoes.json", json: { geradoEm: "2026-10-17T18:31:07.412Z", semente: SEMENTE_DA_CASA } },
    ];
    const r = conferirASementeEOCarimbo({ ...ARVORE, provas });
    expect(r.problemas.map((p) => p.tipo)).toEqual(["carimbo-de-relogio"]);
  });

  test("o relógio aninhado na SAÍDA também é acusado", () => {
    const e = minima();
    e.provas = [{ arquivo: "docs/provas/LAB-00/x.json", json: { semente: SEMENTE_DA_CASA, geradoEm: "2026-10-17", r: [{ archilly: { geradoEm: "2026-10-17T10:11:12.131Z" } }] } }];
    expect(tipos(e)).toEqual(["carimbo-de-relogio"]);
  });

  test("uma semente diferente numa prova", () => {
    const e = minima();
    e.provas = [...e.provas, { arquivo: "docs/provas/LAB-00/y.json", json: { semente: 42, geradoEm: "2026-10-17" } }];
    expect(tipos(e)).toEqual(["semente-diferente"]);
  });

  test("a página com outra semente escrita, ou sem dizer qual", () => {
    expect(tipos(minima({ pagina: PAGINA_MINIMA.replace("20260913", "20260914") }))).toEqual(["pagina-com-outra-semente"]);
    expect(tipos(minima({ pagina: PAGINA_MINIMA.replace(" (`20260913`)", "") }))).toEqual(["pagina-com-outra-semente"]);
  });

  test("a página sem uma das duas frases", () => {
    expect(tipos(minima({ pagina: PAGINA_MINIMA.replace("carimbo fixo", "carimbo") }))).toEqual(["pagina-sem-a-frase"]);
  });

  test("a página que cala a exceção declarada", () => {
    const pagina = ARVORE.pagina.replaceAll("LAB-07/medicoes.json", "LAB-07/o-arquivo.json");
    const r = conferirASementeEOCarimbo({ ...ARVORE, pagina });
    expect(r.problemas.map((p) => p.tipo)).toEqual(["pagina-cala-a-excecao"]);
  });

  test("a declaração que não acha mais o que declarou sobra — a prova regerada e a queda tirada", () => {
    const provas = ARVORE.provas.map((p) =>
      p.arquivo === "docs/provas/LAB-07/medicoes.json"
        ? { ...p, json: { ...(p.json as object), geradoEm: "2026-09-13T00:00:00.000Z" } }
        : p,
    );
    const codigo = ARVORE.codigo.map((c) =>
      c.arquivo === "external-engines/testfit/adapter/src/volta.ts"
        ? { ...c, fonte: c.fonte.replace("opcoes.geradoEm ?? new Date().toISOString()", "opcoes.geradoEm ?? CARIMBO") }
        : c,
    );
    const r = conferirASementeEOCarimbo({ ...ARVORE, provas, codigo });
    expect(r.problemas.map((p) => p.tipo)).toEqual(["declaracao-sem-achado", "declaracao-sem-achado"]);
  });

  test("as formas do relógio no código: Date.now, performance.now, variável e parâmetro, atribuição", () => {
    const casos = [
      "const p = { geradoEm: new Date(Date.now()).toISOString() };",
      "const p = { geradoEm: String(performance.now()) };",
      "const geradoEm = new Date().toISOString();",
      "function f(geradoEm = new Date().toISOString()) { return geradoEm; }",
      "const o: { geradoEm?: string } = {}; o.geradoEm = new Date().toISOString();",
      'const p = { "geradoEm": new Date().toJSON() };',
    ];
    for (const fonte of casos) expect(relogioNoCarimbo("x.ts", fonte)).toHaveLength(1);
  });

  test("o universo vazio reprova — verde de nenhum não é verde", () => {
    expect(tipos(minima({ provas: [] }))).toContain("universo-vazio");
    expect(tipos(minima({ codigo: [] }))).toContain("universo-vazio");
  });
});

describe("LAB-157 · o lado bom — o que quase parece relógio e não é", () => {
  test("a árvore mínima limpa passa", () => {
    expect(tipos(minima())).toEqual([]);
  });

  test("a hora cheia e a data só são carimbo escolhido; o segundo ou o milissegundo é relógio", () => {
    expect(ehCarimboFixo("2026-10-03")).toBe(true);
    expect(ehCarimboFixo("2026-10-04T16:00:00.000Z")).toBe(true);
    expect(ehCarimboFixo("2026-10-05T00:30:00Z")).toBe(true);
    expect(ehCarimboFixo("2026-09-13T14:31:44.835Z")).toBe(false);
    expect(ehCarimboFixo("2026-09-13T14:31:00.835Z")).toBe(false);
    expect(ehCarimboFixo("ontem")).toBe(false);
  });

  test("new Date com argumento é data escrita, não relógio; e o relógio em quando não é desta régua", () => {
    expect(relogioNoCarimbo("x.ts", 'const p = { geradoEm: new Date("2026-10-17").toISOString() };')).toEqual([]);
    expect(relogioNoCarimbo("x.ts", "const p = { quando: new Date().toISOString(), geradoEm: CARIMBO };")).toEqual([]);
  });

  test("a menção em comentário e em texto não conta", () => {
    const fonte = '// geradoEm: new Date().toISOString()\nconst s = "geradoEm: new Date()";\n';
    expect(relogioNoCarimbo("x.ts", fonte)).toEqual([]);
  });

  test("os testes, o upstream e o que não é código ficam fora do universo, como está dito", () => {
    expect(entraNoCodigo("external-engines/esteira/tests/x.test.ts")).toBe(false);
    expect(entraNoCodigo("external-engines/symbios/upstream/src/a.ts")).toBe(false);
    expect(entraNoCodigo("external-engines/esteira/README.md")).toBe(false);
    expect(entraNoCodigo("external-engines/testfit/ferramentas/medir.ts")).toBe(true);
  });

  test("a semente com outro nome não é desta régua", () => {
    const e = minima();
    e.provas = [...e.provas, { arquivo: "docs/provas/LAB-00/z.json", json: { outraSemente: 7, semente: SEMENTE_DA_CASA } }];
    expect(tipos(e)).toEqual([]);
  });
});
