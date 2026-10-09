/**
 * A guarda da regra de família: **cobrança por USO, nunca mensalidade.** (item 005)
 *
 * ```sh
 * bun test tests/custo-por-uso.test.ts
 * ```
 *
 * O item 005 mandou **gravar e não executar** — *"não há nada a comprar hoje; ela existe para o
 * dia em que houver"*. Então esta trava não mede fonte paga nenhuma: ela confere que a regra
 * está **escrita onde não se perca**, que as oito consequências estão **todas** na página, e que
 * nada que o git carrega **escreve** um compromisso mensal.
 *
 * E ela **declara o próprio buraco**: contratar acontece fora da árvore.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  COMPROMISSO_MENSAL,
  CONSEQUENCIAS,
  FAIXAS_DE_USO,
  O_QUE_ISTO_NAO_GUARDA,
} from "../src/cobranca-por-uso.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (p: string) => readFileSync(join(RAIZ, p), "utf8");

/** A §4-A, achada pelo TÍTULO e não por número — número muda quando alguém insere acima. */
function regra(): string {
  const t = ler("CLAUDE.md");
  const m = /\n## 4-A · [^\n]*\n([\s\S]*?)(?=\n## )/.exec(t);
  return (m?.[1] ?? "").replace(/[*`]/g, "");
}

/**
 * Os arquivos que **falam sobre** a regra. Falar não é contratar (D155).
 *
 * Nominal e curta, como a do vazamento de custo: a §4-A **cita** `R$ 100/mês` para dizer que
 * isso é mensalidade, e a régua acusaria a própria linha que define a regra.
 */
const FALAM_SOBRE_O_ASSUNTO = [
  "CLAUDE.md",
  "docs/DECISOES.md",
  "docs/relatorios/RECADOS.md",
  "docs/caixa-de-entrada/005-FEITO.md",
  "docs/relatorios/LAB-72.md",
  "external-engines/esteira/src/cobranca-por-uso.ts",
  "external-engines/esteira/tests/custo-por-uso.test.ts",
  // O item 006 trouxe o corpus dos doze compromissos de formato real: ele é o OBJETO da
  // medição, e está aqui porque medir exige escrever o que se mede.
  "external-engines/esteira/src/trava-de-estrutura.ts",
  "external-engines/esteira/tests/trava-de-estrutura.test.ts",
  // Os relatórios dos itens 006 e 007 IMPRIMEM o corpus dos doze compromissos para mostrar
  // quais escapam — é o objeto da medição, não um compromisso assumido.
  "docs/relatorios/LAB-73.md",
  "docs/relatorios/LAB-74.md",
];

function arquivosDoGit(): string[] {
  return execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8", maxBuffer: 64e6 })
    .split("\n")
    .filter((f) => f.trim() !== "");
}

describe("item 005 · a regra está gravada onde não se perde", () => {
  test("a §4-A existe, traz a regra e nomeia a decisão", () => {
    const r = regra();
    expect(r.length, "a §4-A não foi achada pelo título — e isso NÃO é aprovação").toBeGreaterThan(
      800,
    );
    expect(r.toLowerCase()).toContain("entre uma api que cobra por uso e uma que cobra");
    expect(r).toContain("D239");
    // A ordem direta, com data e abrangência: sem isso ela se lê como preferência minha.
    expect(r).toContain("09/10/2026");
    expect(r.toLowerCase()).toContain("absolutamente todas");
  });

  test("AS OITO consequências estão na página, cada uma pela marca DECLARADA", () => {
    const r = regra().toLowerCase().replace(/\s+/g, " ");
    expect(CONSEQUENCIAS).toHaveLength(8);
    for (const c of CONSEQUENCIAS) {
      const marca = c.marcaNaRegra.toLowerCase().replace(/\s+/g, " ");
      expect(r, `a §4-A não cita ${c.id}`).toContain(marca);
    }
  });

  test("os três tipos existem, e nenhum id se repete", () => {
    expect(new Set(CONSEQUENCIAS.map((c) => c.id)).size).toBe(CONSEQUENCIAS.length);
    expect(new Set(CONSEQUENCIAS.map((c) => c.tipo))).toEqual(
      new Set(["decisao", "arquitetura", "processo"]),
    );
  });

  /**
   * **As três faixas são o conserto do defeito que ele mediu contra mim**: a mesma despesa sai a
   * R$ 2 ou a R$ 133 por estudo só trocando a premissa de volume. Então a página traz as três.
   */
  test("as TRÊS faixas de uso estão escritas, e o contraexemplo com os dois números", () => {
    const r = regra();
    for (const n of FAIXAS_DE_USO) expect(r, `falta a faixa de ${n}`).toContain(String(n));
    expect(r).toContain("R$ 2");
    expect(r).toContain("R$ 133");
  });

  test("a regra entrou também na lista do que este repositório NUNCA faz (§4)", () => {
    const quatro = /\n## 4 · [^\n]*\n([\s\S]*?)(?=\n## )/.exec(ler("CLAUDE.md"))?.[1] ?? "";
    expect(quatro.length).toBeGreaterThan(500);
    expect(quatro).toContain("Não contrata nada");
    expect(quatro).toContain("D239");
  });
});

describe("item 005 · nada que o git carrega ESCREVE um compromisso mensal", () => {
  const arquivos = arquivosDoGit().filter((f) => !FALAM_SOBRE_O_ASSUNTO.includes(f));

  test("o escopo é tudo que o git carrega, menos os que falam sobre o assunto", () => {
    expect(arquivos.length).toBeGreaterThan(100);
    for (const f of FALAM_SOBRE_O_ASSUNTO) expect(arquivos).not.toContain(f);
  });

  test("nenhum arquivo assina, contrata ou declara valor por mês", () => {
    const achados: string[] = [];
    for (const f of arquivos) {
      let texto: string;
      try {
        texto = ler(f);
      } catch {
        continue; // binário ou artefato: não é texto de contrato
      }
      texto.split("\n").forEach((linha, i) => {
        for (const re of COMPROMISSO_MENSAL) {
          if (re.test(linha)) achados.push(`${f}:${i + 1} · ${linha.trim().slice(0, 90)}`);
        }
      });
    }
    expect(achados, achados.join("\n")).toEqual([]);
  });

  test("a régua REPROVA o compromisso de verdade, plantado", () => {
    for (const ruim of [
      "assinatura mensal de R$ 400",
      "vamos contratar o plano mensal",
      "R$ 400 por mês",
      "US$ 99 / mês",
      "franquia mínima de R$ 100",
      "free trial, then US$ 20",
    ]) {
      expect(COMPROMISSO_MENSAL.some((re) => re.test(ruim)), ruim).toBe(true);
    }
  });

  /**
   * **E ela NÃO acusa a palavra solta** — *"custo mensal"* aparece na frase que **explica** a
   * regra, e acusá-la seria medir ortografia (D137), a mesma lição da régua da `margem`.
   */
  test("a régua NÃO acusa quem só FALA de mensalidade", () => {
    for (const bom of [
      "custo mensal alto me pressiona a arranjar cliente",
      "mensalidade paga-se igual com um cliente e com trezentos",
      "a regra proíbe mensalidade",
      "o relatório mensal de medições",
    ]) {
      expect(COMPROMISSO_MENSAL.some((re) => re.test(bom)), bom).toBe(false);
    }
  });
});

describe("item 005 · a guarda declara o PRÓPRIO BURACO", () => {
  test("há buraco declarado, e cada um diz por que não fecha", () => {
    expect(O_QUE_ISTO_NAO_GUARDA.length).toBeGreaterThanOrEqual(3);
    for (const b of O_QUE_ISTO_NAO_GUARDA) {
      expect(b.porQue.length, b.oQue).toBeGreaterThan(60);
    }
  });

  test("a §4-A diz o que a guarda NÃO pega — e que contratar acontece fora da árvore", () => {
    const r = regra().toLowerCase();
    expect(r).toContain("não há nada pago neste repositório hoje");
    expect(r).toContain("fora da árvore");
  });
});
