/**
 * **LAB-127 (item 900) · o recado de uma rodada do `900` diz qual tarefa e de qual lista** (D355).
 *
 * ```sh
 * bun test tests/a-tarefa-do-novecentos.test.ts
 * ```
 *
 * O `900.md` manda: *"No recado, diga qual tarefa da sua lista você pegou, e de qual arquivo."*
 * Vinte e nove recados do `900` cumpriam por disciplina, e um (o LAB-118) foi à dívida própria sem
 * dizer a espécie. Roda **sem clones** (só lê o `RECADOS.md`, o `900.md` e os relatórios deste
 * repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA_DO_900,
  EXCECOES,
  conferirATarefaDoNovecentos,
  lerAOrigem,
  lerOsRecadosDoNovecentos,
} from "../src/a-tarefa-do-novecentos.ts";
import { aRegraEstaEscrita, lerItemDaCaixa } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RECADOS = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");
const relatorioDe = (p: string): string | null => {
  const c = join(RAIZ, "docs", "relatorios", `${p}.md`);
  return existsSync(c) ? readFileSync(c, "utf8") : null;
};

const recado = (prompt: string, estado: string, feito = "o trabalho"): string =>
  `## 16/10/2026 · ${prompt} — o assunto\n\n\`\`\`\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · ${prompt} (item 900) ===\nEstado: ${estado}\nFeito: ${feito}\n=== FIM ===\n\`\`\`\n\n`;
const rels: Record<string, string> = { "LAB-10": "relatório", "LAB-11": "relatório", "LAB-12": "relatório" };
const rel = (p: string): string | null => rels[p] ?? null;
const tipos = (texto: string, exc: Parameters<typeof conferirATarefaDoNovecentos>[2] = {}): string[] =>
  conferirATarefaDoNovecentos(texto, rel, exc).problemas.map((p) => p.tipo);

const FILA_BOA = "caixa só com o 900; peguei da FILA a proposta do LAB-11. FEITA.";
const DIVIDA_BOA = "caixa só com o 900; a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda). FEITA.";

describe("LAB-127 · as páginas de verdade — os recados do 900 dizem de onde veio a tarefa", () => {
  const r = conferirATarefaDoNovecentos(RECADOS, relatorioDe);

  test("a regra está escrita no 900.md — a trava sabe de onde vem", () => {
    expect(aRegraEstaEscrita(lerItemDaCaixa(RAIZ, "900"), A_REGRA_DO_900)).toBe(true);
  });

  test("o universo: os recados do 900 que a régua leu são os que uma contagem ingênua conta, e não zero", () => {
    const ingenua = RECADOS.match(/^=== RECADO PARA O CHAT[^\n]*\(item 900\b/gm)!.length;
    console.log(`    ${r.recados} recados do 900 · ${r.fila} da FILA · ${r.divida} da dívida própria · ${r.problemas.length} problemas`);
    expect(r.recados).toBe(ingenua);
    expect(r.recados).toBeGreaterThanOrEqual(29);
    expect(r.fila + r.divida).toBe(r.recados - r.problemas.filter((p) => p.tipo.startsWith("origem")).length);
    expect(r.fila).toBeGreaterThanOrEqual(14);
    expect(r.divida).toBeGreaterThanOrEqual(15);
  });

  test("nenhum problema — e a lista diz QUAL, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("a exceção declarada é de verdade: o LAB-118 foi à dívida e o recado não diz a espécie", () => {
    const l118 = lerOsRecadosDoNovecentos(RECADOS).find((x) => x.prompt === "LAB-118")!;
    expect(lerAOrigem(l118).origem).toEqual({ lista: "divida", especies: [] });
    expect(Object.keys(EXCECOES)).toEqual(["LAB-118"]);
  });
});

describe("LAB-127 · a régua — os dois lados demonstrados", () => {
  test("O LADO BOM: a proposta da FILA, e a dívida com a espécie", () => {
    expect(tipos(recado("LAB-12", FILA_BOA) + recado("LAB-13", DIVIDA_BOA))).toEqual([]);
  });

  test("a espécie dita só no Feito vale (o LAB-98 a LAB-103)", () => {
    expect(tipos(recado("LAB-13", "fui à dívida própria. FEITA.", "um **número digitado à mão** no CLAUDE.md"))).toEqual([]);
  });

  test("O LADO RUIM, o defeito medido (LAB-118): a dívida sem a espécie", () => {
    expect(tipos(recado("LAB-13", "fui à dívida própria, no docs/INDEX.md. FEITO."))).toEqual(["especie-nao-dita"]);
  });

  test("a origem não dita reprova — inclusive a frase da FILA SEM proposta, que é motivo e não origem", () => {
    expect(tipos(recado("LAB-13", "caixa só com o 900. FEITA."))).toEqual(["origem-nao-dita"]);
    expect(tipos(recado("LAB-13", "a FILA sem proposta que não espere ninguém do LAB-11. FEITA."))).toEqual(["origem-nao-dita"]);
  });

  test("as duas listas no mesmo Estado reprovam", () => {
    expect(tipos(recado("LAB-13", "peguei a proposta do LAB-11 na FILA, e fui à dívida própria (regra sem guarda)."))).toEqual(["origem-dupla"]);
  });

  test("a proposta sem dizer o arquivo reprova", () => {
    expect(tipos(recado("LAB-13", "peguei a proposta do LAB-11. FEITA."))).toEqual(["fila-nao-nomeada"]);
  });

  test("a proposta do próprio prompt, ou do futuro, reprova", () => {
    expect(tipos(recado("LAB-12", "peguei da FILA a proposta do LAB-12."))).toEqual(["proposta-nao-anterior"]);
    expect(tipos(recado("LAB-12", "peguei da FILA a proposta do LAB-14."))).toEqual(["proposta-nao-anterior"]);
  });

  test("a proposta de um prompt sem relatório reprova", () => {
    expect(tipos(recado("LAB-12", "peguei da FILA a proposta do LAB-09."))).toEqual(["proposta-sem-relatorio"]);
  });

  test("a proposta com três algarismos se lê inteira (LAB-103 não vira LAB-10)", () => {
    rels["LAB-103"] = "relatório";
    expect(tipos(recado("LAB-104", "peguei da FILA a proposta 3 do LAB-103."))).toEqual([]);
    delete rels["LAB-103"];
    expect(tipos(recado("LAB-104", "peguei da FILA a proposta 3 do LAB-103."))).toEqual(["proposta-sem-relatorio"]);
  });

  test("a exceção declarada aprova SÓ com a fonte, e reprova quando sobra", () => {
    const sem = recado("LAB-11", "fui à dívida própria, no docs/INDEX.md.");
    const exc = { "LAB-11": { especies: ["regra sem guarda" as const], fonte: "relatório" } };
    rels["LAB-11"] = "as espécies: **regra sem guarda**";
    expect(tipos(sem, exc)).toEqual([]);
    rels["LAB-11"] = "relatório sem espécie";
    expect(tipos(sem, exc)).toEqual(["excecao-sem-fonte"]);
    rels["LAB-11"] = "relatório";
    expect(tipos(recado("LAB-11", DIVIDA_BOA), exc)).toEqual(["excecao-que-sobra"]);
    expect(tipos(recado("LAB-12", DIVIDA_BOA), exc)).toEqual(["excecao-que-sobra"]);
  });

  test("recado de classe e recado de outro item não entram no universo", () => {
    const classe = "## 16/10/2026 · despertador-sem-item\n\n```\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===\nEstado: caixa vazia\n=== FIM ===\n```\n";
    const outro = recado("LAB-13", "item 030 FEITO.").replace("(item 900)", "(item 030)");
    expect(conferirATarefaDoNovecentos(classe + outro, rel, {}).recados).toBe(0);
  });
});
