/**
 * **LAB-131 (item 900) · a decisão é numerada** (D359).
 *
 * ```sh
 * bun test tests/a-sequencia-das-decisoes.test.ts
 * ```
 *
 * O `CLAUDE.md` §7 manda as decisões para `docs/DECISOES.md`, e a D01 as fez numeradas. A casa cita
 * as decisões pelo número em todo lugar — e apagar a D358 inteira, repetir a D200, abrir um buraco
 * ou fazer o calendário voltar não reprovava nenhuma das 1 406 travas da esteira. Roda **sem clones**
 * (lê o `DECISOES.md`, o `CLAUDE.md`, os relatórios, a caixa e as páginas da casa), e por isso está no
 * portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  A_ORIGEM,
  A_REGRA,
  BURACOS_DECLARADOS,
  CITACOES_SEM_TITULO,
  PAGINAS_QUE_CITAM,
  conferirASequenciaDasDecisoes,
  lerAsDecisoes,
  type BuracoDeclarado,
  type CitacaoSemTitulo,
} from "../src/a-sequencia-das-decisoes.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (arquivo: string): string => readFileSync(join(RAIZ, arquivo), "utf8");
const DECISOES = ler("docs/DECISOES.md");
const HOJE = new Date().toISOString().slice(0, 10);

const daPasta = (pasta: string) =>
  readdirSync(join(RAIZ, pasta))
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => `${pasta}/${f}`);

/** O universo das citações: as páginas da casa, os relatórios e os itens da caixa. */
const ARQUIVOS = [...PAGINAS_QUE_CITAM, ...daPasta("docs/relatorios"), ...daPasta("docs/caixa-de-entrada")];
const PAGINAS = ARQUIVOS.map((arquivo) => ({ arquivo, texto: ler(arquivo) }));

/** As páginas com o `DECISOES.md` trocado pelo texto mutado — ele também se cita. */
const comDecisoes = (texto: string) => PAGINAS.map((p) => (p.arquivo === "docs/DECISOES.md" ? { ...p, texto } : p));
const tipos = (decisoes: string, paginas = comDecisoes(decisoes), hoje = HOJE) =>
  conferirASequenciaDasDecisoes(decisoes, paginas, hoje).problemas.map((p) => `${p.tipo} ${p.detalhe.split(" ")[0]}`);

/** Troca a primeira ocorrência, e falha alto se ela não estiver lá. */
function trocar(texto: string, de: string | RegExp, para: string): string {
  const novo = texto.replace(de, para);
  expect(novo).not.toBe(texto);
  return novo;
}

describe("LAB-131 · a página de verdade — D01 a D358, um buraco declarado, nenhuma citação órfã", () => {
  const r = conferirASequenciaDasDecisoes(DECISOES, PAGINAS, HOJE);

  test("a regra está escrita onde mora — o §7 e a D01", () => {
    expect(aRegraEstaEscrita(ler("CLAUDE.md"), A_REGRA)).toBe(true);
    expect(aRegraEstaEscrita(DECISOES, A_ORIGEM)).toBe(true);
  });

  test("o universo: títulos, páginas e citações — publicado, não zero", () => {
    const u = r.universo;
    console.log(
      `    ${u.titulos} títulos (D${String(u.primeira).padStart(2, "0")} a D${u.ultima}) · ${u.paginas} páginas · ` +
        `${u.citacoes} citações · ${r.perdoadas} perdoadas · ${r.problemas.length} problemas`,
    );
    // Contados no LAB-131: 358 títulos (a D359 é a deste prompt) e um buraco; os números só crescem.
    expect(u.primeira).toBe(1);
    expect(u.ultima).toBeGreaterThanOrEqual(359);
    expect(u.titulos).toBe(u.ultima! - BURACOS_DECLARADOS.length);
    expect(u.paginas).toBeGreaterThanOrEqual(170);
    expect(u.citacoes).toBeGreaterThanOrEqual(4778);
    // A contagem ingênua: todo `## D` do arquivo é um título lido.
    expect(DECISOES.match(/^## (?:~~)?D\d{2,}\b/gm)!.length).toBe(u.titulos);
  });

  test("nenhum problema — e a lista diz QUAL, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("o buraco e as citações declarados: todos usados", () => {
    expect(BURACOS_DECLARADOS.map((b) => b.numero)).toEqual([176]);
    expect(r.buracosSemUso).toEqual([]);
    expect(r.citacoesSemUso).toEqual([]);
    expect(r.perdoadas).toBeGreaterThanOrEqual(28);
  });

  test("sem as declarações, reprovam o buraco da D176 e as 28 citações — e só elas", () => {
    const sem = conferirASequenciaDasDecisoes(DECISOES, PAGINAS, HOJE, [], []);
    const porTipo = (t: string) => sem.problemas.filter((p) => p.tipo === t);
    expect(porTipo("buraco").map((p) => p.detalhe.split(" ")[3])).toEqual(["D176"]);
    expect(porTipo("citacao-sem-titulo").length).toBeGreaterThanOrEqual(28);
    expect(sem.problemas.length).toBe(1 + porTipo("citacao-sem-titulo").length);
    expect(new Set(porTipo("citacao-sem-titulo").map((p) => p.detalhe.split(" ")[0]))).toEqual(new Set(["D1000", "D176"]));
  });

  test("o DECISOES.md diz que a D176 não existe, ao lado da D177 — o buraco não é silêncio", () => {
    expect(DECISOES).toMatch(/Não há D176/);
  });
});

describe("LAB-131 · as mutações medidas antes da régua, plantadas na página de verdade", () => {
  test("o título da D200 apagado — um buraco; antes, zero travas acusavam", () => {
    const m = trocar(DECISOES, /^## D200 · /m, "**(sem título)** ");
    const t = tipos(m);
    // O buraco, e as citações da D200 que ficaram sem endereço — duas formas do mesmo defeito, ditas.
    expect(t.filter((x) => !x.startsWith("citacao"))).toEqual(["buraco não"]);
    expect(t.filter((x) => x.startsWith("citacao")).length).toBeGreaterThan(0);
    expect(new Set(t.filter((x) => x.startsWith("citacao")))).toEqual(new Set(["citacao-sem-titulo D200"]));
  });

  test("a D201 renumerada como D200 — repetição; antes, zero", () => {
    const m = trocar(DECISOES, /^## D201 · /m, "## D200 · ");
    const t = tipos(m);
    expect(t.filter((x) => !x.startsWith("citacao")).sort()).toEqual(["buraco não", "numero-repetido D200"]);
    expect(new Set(t.filter((x) => x.startsWith("citacao")))).toEqual(new Set(["citacao-sem-titulo D201"]));
  });

  test("a D300 datada em 01/09/2026 — o calendário volta; antes, zero", () => {
    // A data trocada pela que a própria régua leu no título — sem escrever outra forma de ler data aqui.
    const t300 = lerAsDecisoes(DECISOES).find((t) => t.numero === 300)!;
    const [a, mes, dia] = t300.data!.split("-");
    const linha = DECISOES.split("\n")[t300.linha - 1]!;
    const m = trocar(DECISOES, linha, linha.replace(`${dia}/${mes}/${a}`, "01/09/2026"));
    expect(tipos(m)).toEqual(["data-volta D300:"]);
  });

  test("a última decisão apagada inteira — some sem buraco, e as citações dela ficam órfãs; antes, zero", () => {
    const ultima = Math.max(...lerAsDecisoes(DECISOES).map((t) => t.numero));
    const i = DECISOES.indexOf(`\n## D${ultima} ·`);
    expect(i).toBeGreaterThan(0);
    const m = DECISOES.slice(0, i) + "\n";
    const t = tipos(m);
    expect(t.length).toBeGreaterThan(0);
    expect(t.every((x) => x === `citacao-sem-titulo D${ultima}`)).toBe(true);
  });

  test("a D176 escrita para tapar o buraco — o perdão sobra, e é denunciado", () => {
    const m = trocar(DECISOES, /\n## D177 · /, "\n## D176 · inventada · 06/10/2026\n\n## D177 · ");
    const r = conferirASequenciaDasDecisoes(m, comDecisoes(m), HOJE);
    expect(r.buracosSemUso.map((b) => b.numero)).toEqual([176]);
  });
});

describe("LAB-131 · a régua — os dois lados demonstrados", () => {
  const dec = (...titulos: string[]) => ["# Decisões", "", ...titulos.flatMap((t) => [t, "", "texto", ""])].join("\n");
  const so = (d: string, paginas: { arquivo: string; texto: string }[] = [], b: BuracoDeclarado[] = [], c: CitacaoSemTitulo[] = []) =>
    conferirASequenciaDasDecisoes(d, paginas, "2026-10-16", b, c).problemas.map((p) => p.tipo);
  const tres = dec("## D01 · a · 10/09/2026", "## D02 · b · 10/09/2026", "## D03 · c · 11/09/2026");

  test("O LADO BOM: em ordem, datado, sem buraco; o riscado e a data no meio do título valem", () => {
    expect(so(tres)).toEqual([]);
    expect(so(dec("## D01 · a · 10/09/2026", "## ~~D02~~ · b, desempatada · 10/09/2026", "## D03 · ~~c~~ · 11/09/2026 · **MOLDURA**"))).toEqual([]);
    expect(lerAsDecisoes(tres).map((t) => [t.numero, t.data])).toEqual([[1, "2026-09-10"], [2, "2026-09-10"], [3, "2026-09-11"]]);
  });

  test("o caso válido que quase parece inválido: '## D' dentro de bloco de código não é título, e '### E havia a D116' também não", () => {
    const d = tres + "\n```\n## D09 · exemplo · 01/01/2020\n```\n\n### E havia precedente, o sinal do D116\n";
    expect(so(d)).toEqual([]);
    expect(lerAsDecisoes(d)).toHaveLength(3);
  });

  test("O LADO RUIM: cada defeito pelo nome", () => {
    expect(so(dec("## D01 · a · 10/09/2026", "## D03 · c · 11/09/2026"))).toEqual(["buraco"]);
    expect(so(dec("## D01 · a · 10/09/2026", "## D02 · b · 10/09/2026", "## D02 · c · 11/09/2026"))).toEqual(["numero-repetido"]);
    expect(so(dec("## D01 · a · 10/09/2026", "## D03 · c · 11/09/2026", "## D02 · b · 11/09/2026"))).toEqual(["fora-de-ordem"]);
    expect(so(dec("## D01 · a · 10/09/2026", "## D02 · b · 09/09/2026"))).toEqual(["data-volta"]);
    expect(so(dec("## D01 · a · 10/09/2026", "## D02 · b"))).toEqual(["sem-data"]);
    expect(so(dec("## D01 · a · 10/09/2026", "## D02 · b · 31/02/2026"))).toEqual(["data-invalida"]);
    expect(so(dec("## D01 · a · 10/09/2026", "## D02 · b · 17/10/2026"))).toEqual(["data-no-futuro"]);
    expect(so(dec("## D01 · a · 10/09/2026", "### D02 · b · 10/09/2026"))).toEqual(["nivel-errado"]);
    // Sem a D01, o buraco começa do 1.
    expect(so(dec("## D02 · b · 10/09/2026"))).toEqual(["buraco"]);
  });

  test("a citação: com título passa; sem título reprova; D1000 não é D100; D3 não é decisão (duas casas ou mais)", () => {
    const p = (texto: string, arquivo = "docs/prompts/FILA.md") => [{ arquivo, texto }];
    expect(so(tres, p("ver a D02 e a D03; e a D3 não conta"))).toEqual([]);
    expect(so(tres, p("ver a D04"))).toEqual(["citacao-sem-titulo"]);
    expect(so(tres, p("a D1000 seria"))).toEqual(["citacao-sem-titulo"]);
    expect(so(tres, p("XD04 e D04x não são citação"))).toEqual([]);
  });

  test("a declaração perdoa só a forma dela, e só no arquivo dela — e a que não perdoa nada sobra", () => {
    const c: CitacaoSemTitulo = { numero: "D04", arquivo: "docs/relatorios/RECADOS.md", motivo: "teste" };
    const r1 = conferirASequenciaDasDecisoes(tres, [{ arquivo: "docs/relatorios/RECADOS.md", texto: "a D04" }], "2026-10-16", [], [c]);
    expect(r1.problemas).toEqual([]);
    expect(r1.perdoadas).toBe(1);
    const r2 = conferirASequenciaDasDecisoes(tres, [{ arquivo: "docs/INDEX.md", texto: "a D04" }], "2026-10-16", [], [c]);
    expect(r2.problemas.map((p) => p.tipo)).toEqual(["citacao-sem-titulo"]);
    expect(r2.citacoesSemUso).toEqual([c]);
    const qualquer: CitacaoSemTitulo = { numero: "D04", motivo: "teste" };
    expect(so(tres, [{ arquivo: "docs/INDEX.md", texto: "a D04" }], [], [qualquer])).toEqual([]);
  });

  test("o buraco declarado perdoa só o número dele — e a citação dele —; o que existe ou passa da última sobra", () => {
    const comBuraco = dec("## D01 · a · 10/09/2026", "## D03 · c · 11/09/2026");
    const b: BuracoDeclarado = { numero: 2, motivo: "teste" };
    expect(so(comBuraco, [], [b])).toEqual([]);
    expect(so(comBuraco, [{ arquivo: "docs/INDEX.md", texto: "não há D02" }], [b])).toEqual([]);
    expect(so(comBuraco, [{ arquivo: "docs/INDEX.md", texto: "não há D02" }], [])).toEqual(["buraco", "citacao-sem-titulo"]);
    expect(conferirASequenciaDasDecisoes(tres, [], "2026-10-16", [b], []).buracosSemUso).toEqual([b]);
    const alem: BuracoDeclarado = { numero: 9, motivo: "teste" };
    expect(conferirASequenciaDasDecisoes(tres, [], "2026-10-16", [alem], []).buracosSemUso).toEqual([alem]);
    expect(so(dec("## D01 · a · 10/09/2026", "## D04 · d · 11/09/2026"), [], [b])).toEqual(["buraco"]);
  });

  test("as declarações de hoje: cada uma com motivo; a D1000 em qualquer página", () => {
    expect(CITACOES_SEM_TITULO.map((c) => [c.numero, c.arquivo ?? "*"])).toEqual([["D1000", "*"]]);
    for (const x of [...BURACOS_DECLARADOS, ...CITACOES_SEM_TITULO]) expect(x.motivo.length).toBeGreaterThan(40);
  });
});
