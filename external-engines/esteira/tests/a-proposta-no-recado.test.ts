/**
 * **LAB-164 (item 900) · a ideia que não cabia no item vai à `FILA.md`, e o recado a cita numa linha** (D392).
 *
 * ```sh
 * bun test tests/a-proposta-no-recado.test.ts
 * ```
 *
 * O protocolo da caixa manda a proposta à `FILA.md` e o recado citá-la. A trava do LAB-61 cobrava a lista; tirar a
 * citação do recado de quem propôs não reprovava nenhuma das travas da esteira. Roda **sem clones** (lê o
 * `COMO_FUNCIONA.md`, a `FILA.md`, o `RECADOS.md` e a marca de FEITO dos itens da caixa deste repositório), e por isso
 * está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  FORMAS_ANTIGAS,
  FORMA_DESDE,
  O_QUE_ISTO_NAO_ALCANCA,
  PRIMEIRO_PROMPT_DA_REGRA,
  conferirAPropostaNoRecado,
  lerAsPropostasDaFila,
  oPromptDoItem,
  type FormaAntiga,
} from "../src/a-proposta-no-recado.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CAIXA = join(RAIZ, "docs", "caixa-de-entrada");
const FILA = readFileSync(join(RAIZ, "docs", "prompts", "FILA.md"), "utf8");
const RECADOS = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");
const PROTOCOLO = readFileSync(join(CAIXA, "COMO_FUNCIONA.md"), "utf8");

/** O número do item da caixa → o prompt que o fechou, pela marca do topo de cada `NNN-FEITO.md`. */
const ITENS = new Map<string, string>();
for (const f of readdirSync(CAIXA)) {
  const m = /^(\d{3,})-FEITO\.md$/.exec(f);
  if (m === null) continue;
  const p = oPromptDoItem(readFileSync(join(CAIXA, f), "utf8").split("\n")[0]!);
  if (p !== null) ITENS.set(m[1]!, p);
}

const tipos = (fila: string, recados: string, itens: ReadonlyMap<string, string> = new Map(), formas: readonly FormaAntiga[] = []) =>
  conferirAPropostaNoRecado(fila, recados, itens, formas).problemas.map((p) => `${p.prompt} ${p.tipo}`);

const recado = (prompt: string, linhas: string[]): string =>
  ["## 18/10/2026 · " + prompt + " — x", "", "```", `=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · ${prompt} (item 900) ===`, ...linhas, "=== FIM ===", "```", ""].join("\n");
const CITA = ["Estado: feito", "Feito: a régua", "Achados para outros apps ou Central: (1) Proposto ao chat (FILA): a outra régua.", "Depende do Jonny: nada", "Próximo na fila: o 900"];
const NAO_CITA = ["Estado: feito", "Feito: a régua", "Achados para outros apps ou Central: nada.", "Depende do Jonny: nada", "Próximo na fila: o 900"];
const fila = (...linhas: string[]) => ["# FILA", "", ...linhas, ""].join("\n");

/** Troca a PRIMEIRA ocorrência de `de` dentro do recado de `prompt`, e falha alto se ela não estiver lá. */
function trocarNoRecado(texto: string, prompt: string, de: string, para: string): string {
  const i = texto.indexOf(`· ${prompt} `);
  expect(i).toBeGreaterThan(0);
  const fim = texto.indexOf("=== FIM ===", i);
  const j = texto.indexOf(de, i);
  expect(j > i && j < fim).toBe(true);
  return texto.slice(0, j) + para + texto.slice(j + de.length);
}

describe("LAB-164 · a página de verdade — toda proposta do alcance é citada no recado de quem a fez", () => {
  const r = conferirAPropostaNoRecado(FILA, RECADOS, ITENS);

  test("a regra está escrita onde mora, no protocolo da caixa", () => {
    expect(aRegraEstaEscrita(PROTOCOLO, A_REGRA)).toBe(true);
  });

  test("zero problemas, e o universo publicado (pisos, não números exatos: a FILA cresce)", () => {
    console.log(`  a proposta no recado: ${JSON.stringify(r.universo)}`);
    expect(r.problemas).toEqual([]);
    expect(r.universo.promptsNoAlcance).toBeGreaterThanOrEqual(30);
    expect(r.universo.naFormaAntiga).toBe(FORMAS_ANTIGAS.length);
    expect(r.universo.naFormaDeHoje).toBeGreaterThanOrEqual(9);
    expect(r.universo.naFormaDeHoje + r.universo.naFormaAntiga).toBe(r.universo.promptsNoAlcance);
    expect(r.universo.recadosComAForma).toBeGreaterThanOrEqual(9);
  });

  test("os itens da caixa se traduzem pela marca de FEITO — o 007 é o LAB-74, o 004 é o LAB-71", () => {
    expect(ITENS.get("007")).toBe("LAB-74");
    expect(ITENS.get("004")).toBe("LAB-71");
    expect(ITENS.get("029")).toBe("LAB-96");
    expect(ITENS.get("009")).toBe("LAB-76");
    expect(ITENS.size).toBeGreaterThanOrEqual(29);
  });

  test("as formas antigas vêm todas de antes da forma de hoje, sem repetir prompt", () => {
    for (const f of FORMAS_ANTIGAS) {
      const n = Number(f.prompt.slice(4));
      expect(Number.isFinite(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(PRIMEIRO_PROMPT_DA_REGRA);
      expect(n).toBeLessThan(FORMA_DESDE);
    }
    expect(new Set(FORMAS_ANTIGAS.map((f) => f.prompt)).size).toBe(FORMAS_ANTIGAS.length);
  });

  test("o que ela não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
  });
});

describe("LAB-164 · as mutações na página de verdade — cada uma acusa", () => {
  test("tirar a citação do recado do LAB-159 → recado-nao-cita", () => {
    const t = trocarNoRecado(RECADOS, "LAB-159", "Proposto ao chat (FILA, abaixo do LAB-159)", "(FILA, abaixo do LAB-159)");
    expect(tipos(FILA, t, ITENS, FORMAS_ANTIGAS)).toEqual(["LAB-159 recado-nao-cita"]);
  });

  test("tirar o trecho do recado do LAB-80 → excecao-sem-o-trecho", () => {
    const t = trocarNoRecado(RECADOS, "LAB-80", "Está na FILA como proposta", "Ficou para depois");
    expect(tipos(FILA, t, ITENS, FORMAS_ANTIGAS)).toEqual(["LAB-80 excecao-sem-o-trecho"]);
  });

  test("apagar da FILA a proposta do LAB-152 e deixar o recado → recado-cita-o-que-a-fila-nao-tem", () => {
    const f = FILA.replace("**Proposto ao chat, saído do LAB-152", "**Ficou só na tela, do LAB-152");
    expect(f).not.toBe(FILA);
    expect(tipos(f, RECADOS, ITENS, FORMAS_ANTIGAS)).toEqual(["LAB-152 recado-cita-o-que-a-fila-nao-tem"]);
  });

  test("sem a marca de FEITO do 007, a proposta dele não é atribuída — e a régua diz, não adivinha", () => {
    const sem = new Map(ITENS);
    sem.delete("007");
    expect(tipos(FILA, RECADOS, sem, FORMAS_ANTIGAS)).toEqual(["null item-sem-prompt", "LAB-74 excecao-que-sobra"]);
  });
});

describe("LAB-164 · os dois lados, com páginas plantadas", () => {
  test("as três formas da FILA, e o que fica de fora", () => {
    const f = fila(
      "### Proposto ao chat, saído do LAB-120 — x",
      "**Proposto ao chat, saído do item 029 (LAB-96) — y",
      "### Proposto ao chat, saído do item 007 — z",
      "### LAB-130 · item 900 — w",
      "**Proposto (minha lista, não espera ninguém):**",
      "## Proposto ao chat — não executar",
      "- **UMA** (LAB-140, 16/10, D1). Medido.",
      "- **OUTRA** (09/10, D2). Sem origem.",
      "- **A ANTIGA** (LAB-50, D3).",
    );
    const lidas = lerAsPropostasDaFila(f, new Map([["007", "LAB-74"]]));
    expect(lidas.propostas.map((p) => `${p.prompt} ${p.forma}`)).toEqual([
      "LAB-120 saido-do",
      "LAB-96 saido-do",
      "LAB-74 saido-do",
      "LAB-130 minha-lista",
      "LAB-140 item-da-lista",
      "LAB-50 item-da-lista",
    ]);
    expect(lidas.semOrigem).toBe(1);
    expect(lidas.problemas).toEqual([]);
  });

  test("o caso bom passa; antes da regra não é cobrado", () => {
    const f = fila("### Proposto ao chat, saído do LAB-130 — x", "### Proposto ao chat, saído do LAB-60 — velho");
    const r = conferirAPropostaNoRecado(f, recado("LAB-130", CITA), new Map(), []);
    expect(r.problemas).toEqual([]);
    expect(r.universo.antesDaRegra).toBe(1);
    expect(r.universo.promptsNoAlcance).toBe(1);
  });

  test("o recado que não cita, e o prompt sem recado", () => {
    const f = fila("### Proposto ao chat, saído do LAB-130 — x", "### Proposto ao chat, saído do LAB-131 — y");
    expect(tipos(f, recado("LAB-130", NAO_CITA))).toEqual(["LAB-130 recado-nao-cita", "LAB-131 proposta-sem-recado"]);
  });

  test("\"Nada novo proposto ao chat\" é a negação: não cita, e não cobra o sentido de volta", () => {
    const nega = NAO_CITA.map((l) => (l.startsWith("Achados") ? "Achados para outros apps ou Central: (1) Nada novo proposto ao chat." : l));
    expect(tipos(fila("### Proposto ao chat, saído do LAB-130 — x"), recado("LAB-130", nega))).toEqual(["LAB-130 recado-nao-cita"]);
    expect(tipos(fila("### Proposto ao chat, saído do LAB-130 — x"), recado("LAB-130", CITA) + recado("LAB-131", nega))).toEqual([]);
  });

  test("o sentido de volta: o recado propõe e a FILA não tem", () => {
    expect(tipos(fila("### Proposto ao chat, saído do LAB-130 — x"), recado("LAB-130", CITA) + recado("LAB-131", CITA))).toEqual([
      "LAB-131 recado-cita-o-que-a-fila-nao-tem",
    ]);
  });

  test("item da caixa sem marca, e \"minha lista\" sem seção", () => {
    const f = fila("### Proposto ao chat, saído do LAB-130 — x", "### Proposto ao chat, saído do item 099 — y", "## Outra", "**Proposto (minha lista):**");
    expect(tipos(f, recado("LAB-130", CITA))).toEqual(["null item-sem-prompt", "null proposta-sem-origem"]);
  });

  test("a forma antiga: perdoa com o trecho; acusa sem ele; sobra quando não precisa", () => {
    const f = fila("### Proposto ao chat, saído do LAB-100 — x");
    const antigo = NAO_CITA.map((l) => (l.startsWith("Achados") ? "Achados para outros apps ou Central: está na FILA como proposta." : l));
    const forma = [{ prompt: "LAB-100", trecho: "está na FILA como proposta" }];
    expect(tipos(f, recado("LAB-100", antigo), new Map(), forma)).toEqual([]);
    expect(tipos(f, recado("LAB-100", NAO_CITA), new Map(), forma)).toEqual(["LAB-100 excecao-sem-o-trecho"]);
    expect(tipos(f, recado("LAB-100", CITA), new Map(), forma)).toEqual(["LAB-100 excecao-que-sobra"]);
    expect(tipos(f, recado("LAB-100", antigo), new Map(), [...forma, { prompt: "LAB-101", trecho: "x" }])).toEqual(["LAB-101 excecao-que-sobra"]);
    const depois = fila("### Proposto ao chat, saído do LAB-130 — x");
    expect(tipos(depois, recado("LAB-130", antigo), new Map(), [{ prompt: "LAB-130", trecho: "está na FILA como proposta" }])).toEqual([
      "LAB-130 excecao-que-sobra",
    ]);
  });

  test("nenhuma proposta no alcance → universo-vazio", () => {
    expect(tipos(fila("nada aqui"), recado("LAB-130", NAO_CITA))).toEqual(["null universo-vazio"]);
  });

  test("a marca de FEITO do topo do item", () => {
    expect(oPromptDoItem("> # ✅ FEITO — 09/10/2026, LAB-74")).toBe("LAB-74");
    expect(oPromptDoItem("> # ✅ FEITO — 16/10/2026, LAB-113 (e o adendo)")).toBe("LAB-113");
    expect(oPromptDoItem("> ✅ **FEITO no LAB-76**, em 10/10/2026")).toBe("LAB-76");
    expect(oPromptDoItem("> ## ✅ FEITO EM 12/10/2026 — disparo das 23:07 UTC · LAB-96 · D3")).toBe("LAB-96");
    expect(oPromptDoItem("> ⚠️ **RENUMERADO PARA 015 POR COLISÃO")).toBeNull();
    expect(oPromptDoItem("# 900 — ITEM CONTÍNUO")).toBeNull();
  });
});
