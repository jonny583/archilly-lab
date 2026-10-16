/**
 * **LAB-123 (item 900) · a marca de FEITO no topo do item da caixa** (D351).
 *
 * ```sh
 * bun test tests/marca-de-feito.test.ts
 * ```
 *
 * O passo 4 do `COMO_FUNCIONA.md` manda escrever no topo do item concluído o que foi feito; cinco
 * dos 34 itens feitos (`009` a `012`, LAB-76 a LAB-79) não tinham marca nenhuma, e nada acusava.
 * Esta trava lê a caixa de verdade e a régua dos dois lados. Roda **sem clones** (só lê arquivo
 * deste repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { conferirAsMarcas, lerAMarca, topoDoItem } from "../src/marca-de-feito.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CAIXA = join(RAIZ, "docs", "caixa-de-entrada");
const RELATORIOS = join(RAIZ, "docs", "relatorios");
const relatorioExiste = (p: string): boolean => existsSync(join(RELATORIOS, `${p}.md`));

const ITENS = readdirSync(CAIXA).map((nome) => ({ nome, texto: readFileSync(join(CAIXA, nome), "utf8") }));

const marca = (prompt: string): string =>
  `> ✅ **FEITO no ${prompt}**, em 16/10/2026. Relatório em\n> [\`../relatorios/${prompt}.md\`](../relatorios/${prompt}.md).\n\n`;
const pedido = "# 999 — um pedido do chat\n\nFaça a coisa.\n";
const existe = (p: string): boolean => p === "LAB-76";

describe("LAB-123 · a caixa de verdade — todo item feito tem a marca no topo", () => {
  const { feitos, problemas } = conferirAsMarcas(ITENS, relatorioExiste);

  test("o universo: a régua leu os mesmos `-FEITO` que uma contagem ingênua conta, e não zero", () => {
    const ingenua = ITENS.filter((i) => i.nome.endsWith("-FEITO.md")).length;
    console.log(`    ${ITENS.length} arquivos na caixa · ${feitos} itens feitos lidos · ${problemas.length} sem marca`);
    expect(feitos).toBe(ingenua);
    expect(feitos).toBeGreaterThanOrEqual(34);
  });

  test("nenhum item feito sem marca — e a lista diz QUAIS, se houver", () => {
    expect(problemas).toEqual([]);
  });

  test("as cinco marcas reconstruídas dizem que são reconstrução (§1-B), e apontam o prompt certo", () => {
    const esperado: Record<string, string> = {
      "009-FEITO.md": "LAB-76",
      "010-FEITO.md": "LAB-77",
      "010-adendo-FEITO.md": "LAB-77",
      "011-FEITO.md": "LAB-78",
      "012-FEITO.md": "LAB-79",
    };
    for (const [nome, prompt] of Object.entries(esperado)) {
      const texto = ITENS.find((i) => i.nome === nome)!.texto;
      expect(lerAMarca(texto).prompt, nome).toBe(prompt);
      expect(topoDoItem(texto).join("\n"), nome).toContain("RECONSTRUÍDA no LAB-123");
    }
  });

  test("o `015`: o `013-FEITO.md` e o `LAB-80` do aviso não são a marca — a marca é o LAB-82", () => {
    const m = lerAMarca(ITENS.find((i) => i.nome === "015-FEITO.md")!.texto);
    expect(m.prompt).toBe("LAB-82");
    expect(m.citaORelatorio).toBe(true);
  });
});

describe("LAB-123 · a régua — os dois lados demonstrados", () => {
  test("O LADO BOM: marca com FEITO, prompt e o relatório que existe", () => {
    expect(conferirAsMarcas([{ nome: "999-FEITO.md", texto: marca("LAB-76") + pedido }], existe).problemas).toEqual([]);
  });

  test("O LADO RUIM, o defeito medido: arquivo só renomeado, sem topo", () => {
    expect(conferirAsMarcas([{ nome: "999-FEITO.md", texto: pedido }], existe).problemas).toEqual([
      { item: "999-FEITO.md", tipo: "sem-topo" },
    ]);
  });

  test("a marca DEPOIS do texto do chat não é topo — nem logo abaixo de uma linha só", () => {
    const r = conferirAsMarcas(
      [
        { nome: "998-FEITO.md", texto: pedido + "\n" + marca("LAB-76") },
        { nome: "999-FEITO.md", texto: "Faça a coisa.\n" + marca("LAB-76") },
      ],
      existe,
    );
    expect(r.problemas).toEqual([
      { item: "998-FEITO.md", tipo: "sem-topo" },
      { item: "999-FEITO.md", tipo: "sem-topo" },
    ]);
  });

  test("topo sem FEITO; e o `-FEITO.md` de um nome de arquivo não conta como FEITO", () => {
    const r = conferirAsMarcas(
      [
        { nome: "998-FEITO.md", texto: "> uma nota qualquer, LAB-76, ../relatorios/LAB-76.md\n\n" + pedido },
        { nome: "999-FEITO.md", texto: "> ver `013-FEITO.md`, LAB-76, ../relatorios/LAB-76.md\n\n" + pedido },
      ],
      existe,
    );
    expect(r.problemas).toEqual([
      { item: "998-FEITO.md", tipo: "topo-sem-feito" },
      { item: "999-FEITO.md", tipo: "topo-sem-feito" },
    ]);
  });

  test("topo sem prompt; e prompt citado ANTES do FEITO não é o da marca", () => {
    const r = conferirAsMarcas(
      [
        { nome: "998-FEITO.md", texto: "> ✅ FEITO, sem dizer por quem\n\n" + pedido },
        { nome: "999-FEITO.md", texto: "> o LAB-76 fez outro item. ✅ FEITO aqui também\n\n" + pedido },
      ],
      existe,
    );
    expect(r.problemas).toEqual([
      { item: "998-FEITO.md", tipo: "topo-sem-prompt" },
      { item: "999-FEITO.md", tipo: "topo-sem-prompt" },
    ]);
  });

  test("topo sem o relatório do prompt; e relatório citado que não existe no disco", () => {
    const r = conferirAsMarcas(
      [
        { nome: "998-FEITO.md", texto: "> ✅ FEITO no LAB-76, relatório em ../relatorios/LAB-75.md\n\n" + pedido },
        { nome: "999-FEITO.md", texto: marca("LAB-999") + pedido },
      ],
      existe,
    );
    expect(r.problemas).toEqual([
      { item: "998-FEITO.md", tipo: "topo-sem-relatorio" },
      { item: "999-FEITO.md", tipo: "relatorio-que-nao-existe" },
    ]);
  });

  test("o item aberto, o `900`, o `COMO_FUNCIONA.md` e o retirado ficam FORA — só o feito se marca", () => {
    const r = conferirAsMarcas(
      [
        { nome: "031.md", texto: pedido },
        { nome: "900.md", texto: pedido },
        { nome: "COMO_FUNCIONA.md", texto: pedido },
        { nome: "002-RETIRADO.md", texto: pedido },
        { nome: "1000-FEITO.md", texto: pedido },
      ],
      existe,
    );
    // o `1000` é item (sem teto de casas, D340) — e por isso é cobrado.
    expect(r).toEqual({ feitos: 1, problemas: [{ item: "1000-FEITO.md", tipo: "sem-topo" }] });
  });
});
