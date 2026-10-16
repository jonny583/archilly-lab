/**
 * **LAB-136 (item 900) · a `FILA.md` em dia** (D364).
 *
 * ```sh
 * bun test tests/a-fila-em-dia.test.ts
 * ```
 *
 * O `CLAUDE.md` §7 manda a `FILA.md` em dia ao fim de todo prompt, e nada perguntava: a tabela da
 * caixa parava no `012`, dezoito itens feitos sem linha, e o LAB-97 sem título — e apagar a linha do
 * `012` e o título do LAB-135 não derrubava nenhuma das 1 504 travas da esteira. Roda **sem clones**
 * (lê a `FILA.md`, o `RECADOS.md` e a pasta da caixa), e por isso está no portão sem clones do
 * `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { A_REGRA, conferirAFilaEmDia, lerATabela, lerOsTitulos } from "../src/a-fila-em-dia.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (arquivo: string): string => readFileSync(join(RAIZ, arquivo), "utf8");
const FILA = ler("docs/prompts/FILA.md");
const RECADOS = ler("docs/relatorios/RECADOS.md");
const CAIXA = readdirSync(join(RAIZ, "docs/caixa-de-entrada"));

const tipos = (fila: string, recados = RECADOS, caixa: readonly string[] = CAIXA) =>
  conferirAFilaEmDia(fila, recados, caixa).problemas.map((p) => `${p.tipo} ${p.detalhe.split(" ")[0]}`);

/** Troca a primeira ocorrência, e falha alto se ela não estiver lá. */
function trocar(texto: string, de: string | RegExp, para: string): string {
  const novo = texto.replace(de, para);
  expect(novo).not.toBe(texto);
  return novo;
}

describe("LAB-136 · a página de verdade — todo prompt da caixa tem o seu lugar", () => {
  const r = conferirAFilaEmDia(FILA, RECADOS, CAIXA);

  test("a regra está escrita onde mora — o §7", () => {
    expect(aRegraEstaEscrita(ler("CLAUDE.md"), A_REGRA)).toBe(true);
  });

  test("o universo: rodadas, itens, linhas e títulos — publicado, não zero", () => {
    const u = r.universo;
    console.log(
      `    ${u.rodadasComItem} rodadas com item no RECADOS.md · ${u.itensNumerados} itens numerados (${u.feitosNaCaixa} feitos na caixa) · ` +
        `${u.novecentos} prompts do 900 · ${u.linhas} linhas na tabela · ${u.titulos} títulos de prompt · ${r.problemas.length} problemas`,
    );
    // Contados no LAB-136: 69 rodadas (LAB-68 a LAB-135, o LAB-95 duas vezes), 30 itens, 38 do 900.
    // A rodada deste prompt ainda não tem recado quando a régua nasce; os números só crescem.
    expect(u.rodadasComItem).toBeGreaterThanOrEqual(69);
    expect(u.itensNumerados).toBeGreaterThanOrEqual(30);
    expect(u.feitosNaCaixa).toBeGreaterThanOrEqual(30);
    expect(u.novecentos).toBeGreaterThanOrEqual(38);
    expect(u.linhas).toBe(u.itensNumerados);
    // A contagem ingênua: toda linha da página que abre com `| \`NNN\`` é uma linha lida.
    expect(FILA.match(/^\| `\d{3,}`/gm)!.length).toBe(u.linhas);
  });

  test("nenhum problema — e a lista diz QUAL, se houver", () => {
    expect(r.problemas).toEqual([]);
  });
});

describe("LAB-136 · as mutações medidas antes da régua, plantadas na página de verdade", () => {
  test("a linha do 012 apagada — antes, zero travas acusavam", () => {
    const m = trocar(FILA, /^\| `012` \|.*\n/m, "");
    expect(tipos(m)).toEqual(["item-sem-linha 012"]);
  });

  test("o título do LAB-135 apagado — antes, zero", () => {
    const m = trocar(FILA, "### LAB-135 · item 900", "### Rodada · item 900");
    expect(tipos(m)).toEqual(["novecentos-sem-titulo LAB-135"]);
  });

  test("a linha do 013 citando o prompt errado", () => {
    const linha = lerATabela(FILA)!.find((l) => l.item === 13)!.texto;
    const m = trocar(FILA, linha, linha.replaceAll("LAB-80", "LAB-81"));
    expect(tipos(m)).toEqual(["linha-com-outro-prompt 013:"]);
  });

  test("o 029 reaberto na caixa, com a linha ✅ ainda na tabela", () => {
    const caixa = CAIXA.map((n) => (n === "029-FEITO.md" ? "029.md" : n));
    expect(caixa).not.toEqual(CAIXA);
    // O RECADOS.md ainda diz que o LAB-96 fechou o 029: a linha existe e cita; o que reprova é o ✅ contra a caixa.
    expect(tipos(FILA, RECADOS, caixa)).toEqual(["linha-de-item-aberto 029:"]);
  });

  test("um item feito na caixa sem recado e sem linha — o outro sentido", () => {
    expect(tipos(FILA, RECADOS, [...CAIXA, "031-FEITO.md"])).toEqual(["item-sem-linha 031"]);
  });

  test("a seção da tabela renomeada — a régua não aprova por não ler", () => {
    const m = trocar(FILA, "## 📥 A IDA MUDOU DE LUGAR", "## A ida");
    const t = tipos(m);
    expect(t[0]).toBe("sem-tabela a");
    expect(t.filter((x) => x.startsWith("item-sem-linha")).length).toBeGreaterThanOrEqual(30);
  });
});

describe("LAB-136 · a régua — os dois lados demonstrados", () => {
  const recado = (dia: string, prompt: string, item: string) =>
    `## ${dia} · ${prompt} — item ${item}: algo\n\n\`\`\`\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · ${prompt} (item ${item}) ===\nEstado: —\n=== FIM ===\n\`\`\`\n`;
  const RC = [recado("10/10/2026", "LAB-80", "013"), recado("11/10/2026", "LAB-81", "900"), recado("12/10/2026", "LAB-82", "014")].join("\n");
  const pagina = (linhas: string[], titulos: string[]) =>
    ["# FILA", "", "## 📥 A IDA MUDOU DE LUGAR EM 09/10/2026", "", "| item | o prompt | estado |", "|---|---|---|", ...linhas, "", "## outra seção", "", "| `099` | fora da seção | não é linha |", "", ...titulos].join("\n");
  const BOA = pagina(["| `013` | a | ✅ **LAB-80**, 10/10 |", "| `014` + adendo | b | ✅ **LAB-82**, 12/10 |"], ["### LAB-81 · item 900 — c"]);
  const caixa = ["013-FEITO.md", "014-FEITO.md", "014-adendo-FEITO.md", "900.md", "COMO_FUNCIONA.md"];
  const so = (fila: string, rc = RC, cx = caixa) => conferirAFilaEmDia(fila, rc, cx).problemas.map((p) => p.tipo);

  test("O LADO BOM: linha por item, título por 900; adendo na mesma linha; o 900 aberto não pede linha", () => {
    expect(so(BOA)).toEqual([]);
    expect(lerATabela(BOA)!.map((l) => l.item)).toEqual([13, 14]);
  });

  test("o caso válido que quase parece inválido: título riscado vale; linha fora da seção não é linha; LAB-800 não é LAB-80", () => {
    expect(so(BOA.replace("### LAB-81 ·", "### ~~LAB-81~~ ·"))).toEqual([]);
    expect(lerOsTitulos("### ~~LAB-81~~ · x\n#### LAB-82 · não é nível 3")).toEqual(new Set(["LAB-81"]));
    expect(so(BOA.replace("**LAB-80**", "**LAB-800**"))).toEqual(["linha-com-outro-prompt"]);
  });

  test("O LADO RUIM: cada defeito pelo nome", () => {
    expect(so(BOA.replace(/^\| `013`.*\n/m, ""))).toEqual(["item-sem-linha"]);
    expect(so(BOA.replace("### LAB-81 ·", "### LAB-8 ·"))).toEqual(["novecentos-sem-titulo"]);
    expect(so(BOA.replace("**LAB-80**", "**LAB-79**"))).toEqual(["linha-com-outro-prompt"]);
    expect(so(BOA, RC, caixa.map((n) => (n === "013-FEITO.md" ? "013.md" : n)))).toEqual(["linha-de-item-aberto"]);
    expect(so(BOA.replace("## 📥 A IDA MUDOU", "## A IDA MUDOU"))).toEqual(["sem-tabela", "item-sem-linha", "item-sem-linha"]);
  });

  test("um item com dois prompts (o 028 teve dois despertadores no mesmo prompt; o caso geral) — basta citar um", () => {
    const rc = RC + "\n" + recado("13/10/2026", "LAB-83", "013");
    expect(so(BOA, rc)).toEqual([]);
    expect(so(BOA.replace("**LAB-80**", "**LAB-83**"), rc)).toEqual([]);
  });

  test("o recado sem item (os de antes da caixa) não é cobrado", () => {
    const antigo = "## 01/10/2026 · LAB-50 — a ponte\n\n```\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-50 ===\n```\n";
    expect(so(BOA, RC + "\n" + antigo)).toEqual([]);
  });
});
