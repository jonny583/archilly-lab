/**
 * **LAB-149 (item 900) · o que o vizinho precisa vira lista numerada em relatório** (D377).
 *
 * ```sh
 * bun test tests/pedido-ao-vizinho.test.ts
 * ```
 *
 * O `CLAUDE.md` §4 manda que *"o que o vizinho precisa vira lista numerada em relatório"*, e nada perguntava: só se
 * conferia que a frase estava escrita. O motivo inteiro, com os lugares contados, está no cabeçalho de
 * `src/pedido-ao-vizinho.ts`.
 *
 * Roda **sem clones** (lê os relatórios e o `CLAUDE.md` desta casa), e por isso está no portão sem clones do
 * `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  NAO_E_PEDIDO,
  O_QUE_ISTO_NAO_ALCANCA,
  PRIMEIRO_COBRADO,
  SEM_LISTA_ANTES_DA_TRAVA,
  conferirPedidosAoVizinho,
  itemNumerado,
  lugaresDePedido,
  tituloDePedido,
} from "../src/pedido-ao-vizinho.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RELATORIOS = join(RAIZ, "docs", "relatorios");

const relatoriosDeVerdade = (): Map<string, string> =>
  new Map(
    readdirSync(RELATORIOS)
      .filter((f) => f.endsWith(".md"))
      .map((f) => [f, readFileSync(join(RELATORIOS, f), "utf8")]),
  );

const tipos = (rel: [string, string][], semLista: Record<string, string> = {}, nao: Record<string, string> = {}) =>
  conferirPedidosAoVizinho(new Map(rel), semLista, nao).problemas.map((p) => `${p.onde} ${p.tipo}`);

const LIMPO = "# x\n\n## 1 · nada\n\ntexto.\n";
/** Um relatório com um pedido bem escrito, para o universo não sair vazio quando o caso testado é outro. */
const BOM: [string, string] = ["LAB-501.md", "## 1 · Para o motor\n\n1. isto\n"];

describe("LAB-149 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §4 diz que o que o vizinho precisa vira lista numerada em relatório", () => {
    const claude = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    expect(aRegraEstaEscrita(claude, A_REGRA)).toBe(true);
  });
});

describe("LAB-149 · os relatórios de verdade", () => {
  const r = conferirPedidosAoVizinho(relatoriosDeVerdade());

  test("nenhum problema — todo pedido ao vizinho tem lista, ou está congelado com o motivo", () => {
    expect(r.problemas).toEqual([]);
  });

  test("o universo é publicado e não encolhe: 145 relatórios, 27 lugares, 5 congelados (17/10/2026)", () => {
    // Piso, não igualdade: relatório novo entra todo dia. Encolher é a régua lendo menos do que diz.
    expect(r.relatoriosLidos).toBeGreaterThanOrEqual(145);
    expect(r.lugares.length).toBeGreaterThanOrEqual(27);
    expect(r.lugares.filter((l) => l.forma === "marcador").length).toBeGreaterThanOrEqual(1);
    expect(Object.keys(SEM_LISTA_ANTES_DA_TRAVA)).toHaveLength(5);
  });

  test("o recado não é relatório: o RECADOS.md fica fora da conta", () => {
    expect(r.lugares.some((l) => l.arquivo === "RECADOS.md")).toBe(false);
  });

  test("todo congelado é de antes da trava", () => {
    for (const chave of Object.keys(SEM_LISTA_ANTES_DA_TRAVA)) {
      const n = /^LAB-(\d+)\.md/.exec(chave);
      if (n) expect(Number(n[1])).toBeLessThan(PRIMEIRO_COBRADO);
    }
  });
});

describe("LAB-149 · o lado bom: as quatro escritas de lista numerada passam", () => {
  test("item 1. do Markdown", () => {
    expect(tipos([["LAB-500.md", "## 5 · Para o Generate — lista numerada\n\n1. isto\n2. aquilo\n"]])).toEqual([]);
  });
  test("linha de tabela que começa pelo número", () => {
    expect(tipos([["LAB-500.md", "## 1 · A lista para o motor\n\n| # | o quê |\n|---|---|\n| **1** | isto |\n"]])).toEqual([]);
  });
  test("subtítulo numerado dentro da seção", () => {
    expect(tipos([["LAB-500.md", "## 7 · O que fica pedido\n\n### 1 · a regra ligada\n\ntexto\n"]])).toEqual([]);
  });
  test("linha numerada dentro de bloco de código", () => {
    expect(tipos([["BALANCOS.md", "### A lista que vai ao motor\n\n```\n1 · o teto de face ... 14\n```\n"]])).toEqual([]);
  });
  test("marcador com sub-itens numerados, recuados", () => {
    expect(tipos([["LAB-500.md", "## 8 · Achados\n\n- **Para o Generate (pelo chat):** duas coisas:\n  1. isto;\n  2. aquilo.\n"]])).toEqual([]);
  });
  test("título que fala do vizinho sem pedir nada não é lugar", () => {
    expect(lugaresDePedido("LAB-500.md", "## 9 · Os clones vizinhos ficaram limpos\n\ntexto\n")).toEqual([]);
    expect(lugaresDePedido("LAB-500.md", "### O Generate não foi alterado\n\ntexto\n")).toEqual([]);
    expect(tituloDePedido("O que o campo faz no motor, e a régua que eu devia ter usado")).toBe(false);
  });
  test("título dentro de bloco de código não é título", () => {
    expect(lugaresDePedido("LAB-500.md", "```\n## Para o Generate\n```\n")).toEqual([]);
  });
  test("a seção acaba no título do mesmo nível: a lista da seção seguinte não conta", () => {
    const t = "## 5 · Para o Generate\n\ntexto\n\n## 6 · Outra\n\n1. não é do Generate\n";
    expect(tipos([["LAB-500.md", t]])).toEqual(["LAB-500.md:1 pedido-sem-lista"]);
  });
  test("item numerado: as escritas que NÃO são lista", () => {
    expect(itemNumerado("2026 foi o ano", false)).toBe(false);
    expect(itemNumerado("| a | 1 |", false)).toBe(false);
    expect(itemNumerado("## 5 · Para o Generate", false)).toBe(true); // subtítulo numerado
    expect(itemNumerado("1 · dentro do bloco", false)).toBe(false);
    expect(itemNumerado("1 · dentro do bloco", true)).toBe(true);
  });
});

describe("LAB-149 · o lado ruim: o que tem de reprovar, reprova", () => {
  test("título de pedido sem item numerado", () => {
    expect(tipos([["LAB-500.md", "## 5 · O que vai ao Laboratório de Parcelamento\n\n- isto\n- aquilo\n"]])).toEqual([
      "LAB-500.md:1 pedido-sem-lista",
    ]);
  });
  test("o pedido nomeado sozinho, sem lista", () => {
    expect(tipos([["LAB-500.md", "## 4 · O PEDIDO, e a escolha\n\nsaiu no recado.\n"]])).toEqual([
      "LAB-500.md:1 pedido-sem-lista",
    ]);
  });
  test("marcador de pedido em tópico, sem número (a forma do LAB-147)", () => {
    const t = "## 7 · Achados\n\n- **Para o Generate (pelo chat, não por commit lá):** a via não tem\n  comprimento.\n- **Para as outras casas:** x\n";
    expect(tipos([["LAB-500.md", t]])).toEqual(["LAB-500.md:3 pedido-sem-lista"]);
  });
  test("congelar relatório de depois da trava não vale", () => {
    const t = "## 5 · Para o Generate\n\ntexto\n";
    expect(tipos([[`LAB-${PRIMEIRO_COBRADO}.md`, t]], { [`LAB-${PRIMEIRO_COBRADO}.md · 5 · Para o Generate`]: "x".repeat(40) })).toEqual([
      `LAB-${PRIMEIRO_COBRADO}.md:1 excecao-depois-da-trava`,
    ]);
  });
  test("o congelado de antes da trava passa — e o motivo curto não", () => {
    const t = "## 5 · Para o Generate\n\ntexto\n";
    expect(tipos([["LAB-10.md", t]], { "LAB-10.md · 5 · Para o Generate": "x".repeat(40) })).toEqual([]);
    expect(tipos([["LAB-10.md", t]], { "LAB-10.md · 5 · Para o Generate": "curto" })).toEqual([
      "LAB-10.md · 5 · Para o Generate motivo-curto",
    ]);
  });
  test("declaração que sobra: o lugar sumiu, ou passou a ter lista", () => {
    expect(tipos([["LAB-10.md", LIMPO], BOM], { "LAB-10.md · 5 · Para o Generate": "x".repeat(40) })).toEqual([
      "LAB-10.md · 5 · Para o Generate declaracao-que-sobra",
    ]);
    expect(tipos([["LAB-10.md", "## 5 · Para o Generate\n\n1. isto\n"]], { "LAB-10.md · 5 · Para o Generate": "x".repeat(40) })).toEqual([
      "LAB-10.md · 5 · Para o Generate declaracao-que-sobra",
    ]);
  });
  test("o título que tem a forma e não é pedido se declara, e a declaração também sobra", () => {
    const t = "## 5 · Para o Generate, uma nota de rodapé\n\ntexto\n";
    expect(tipos([["LAB-500.md", t]], {}, { "LAB-500.md · 5 · Para o Generate, uma nota de rodapé": "x".repeat(40) })).toEqual([]);
    expect(tipos([["LAB-500.md", LIMPO], BOM], {}, { "LAB-500.md · 5 · Para o Generate, uma nota de rodapé": "x".repeat(40) })).toEqual([
      "LAB-500.md · 5 · Para o Generate, uma nota de rodapé declaracao-que-sobra",
    ]);
  });
  test("universo vazio: nenhum relatório, ou nenhum lugar de pedido (D164)", () => {
    expect(tipos([])).toEqual(["docs/relatorios/ universo-vazio"]);
    expect(tipos([["LAB-500.md", LIMPO]])).toEqual(["docs/relatorios/ universo-vazio"]);
    expect(tipos([["RECADOS.md", "## 5 · Para o Generate\n\n1. x\n"]])).toEqual(["docs/relatorios/ universo-vazio"]);
  });
});

describe("LAB-149 · as declarações e o que a régua não alcança", () => {
  test("toda declaração tem motivo de pelo menos 40 caracteres", () => {
    for (const m of [...Object.values(SEM_LISTA_ANTES_DA_TRAVA), ...Object.values(NAO_E_PEDIDO)])
      expect(m.trim().length).toBeGreaterThanOrEqual(40);
  });
  test("o que não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});
