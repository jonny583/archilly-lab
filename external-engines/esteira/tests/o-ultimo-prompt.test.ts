/**
 * **LAB-126 (item 900) · o cabeçalho do `ONDE_PARAMOS.md` contra o `RECADOS.md`** (D354).
 *
 * ```sh
 * bun test tests/o-ultimo-prompt.test.ts
 * ```
 *
 * A primeira linha do arquivo que se lê ao acordar afirma a data, o último prompt (com o item) e a
 * ordem dos anteriores — à mão, a cada rodada — e nada a punha ao lado do `RECADOS.md`, que diz o
 * mesmo com forma fixa. Medido na história: 139 de 140 versões limpas, e a exceção (`76bfdcd`, o
 * LAB-67) ficou 13h20 com o cabeçalho num prompt atrás. Roda **sem clones** (só lê dois arquivos
 * deste repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { conferirOCabecalho, lerAsRodadas, lerOCabecalho } from "../src/o-ultimo-prompt.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ONDE = readFileSync(join(RAIZ, "docs", "ONDE_PARAMOS.md"), "utf8");
const RECADOS = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");

const cab = (data: string, prompt: string, item: string, corrente: string[] = []): string =>
  `# ONDE PARAMOS\n\n**Última atualização:** ${data}, 07h · **Último prompt executado:** ${prompt} (item ${item}, a dívida) — feito` +
  corrente.map((p) => ` · antes dele o ${p} (item 900) — feito`).join("") +
  "\n\nA HISTÓRIA\n";
const rodada = (data: string, titulo: string, prompt: string, item: string | null): string =>
  `## ${data} · ${titulo} — o assunto\n\n\`\`\`\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · ${prompt}${item ? ` (item ${item})` : ""} ===\nEstado: …\n=== FIM ===\n\`\`\`\n\n`;
const recados = (...r: string[]): string => `# RECADOS\n\n${r.join("")}`;
const tipos = (o: string, r: string): string[] => conferirOCabecalho(o, r).problemas.map((p) => p.tipo);

const TRES = recados(
  rodada("15/10/2026", "LAB-10", "LAB-10", "900"),
  rodada("16/10/2026", "LAB-11", "LAB-11", "900"),
  rodada("16/10/2026", "LAB-12", "LAB-12", "031"),
);

describe("LAB-126 · as páginas de verdade — o cabeçalho diz o que o RECADOS.md diz", () => {
  const r = conferirOCabecalho(ONDE, RECADOS);

  test("o universo: as rodadas de prompt que a régua leu são as que uma contagem ingênua conta, e não zero", () => {
    const ingenua = RECADOS.match(/^## \d{2}\/\d{2}\/\d{4} · LAB-\d+/gm)!.length;
    console.log(`    ${r.rodadas} rodadas de prompt no RECADOS.md · ${r.elos} elos na corrente · ${r.problemas.length} problemas`);
    // Um título por rodada: o `LAB-13 e LAB-14` é um título só, lido como LAB-14 pela régua.
    expect(r.rodadas).toBe(ingenua);
    expect(r.rodadas).toBeGreaterThanOrEqual(118);
    expect(r.elos).toBeGreaterThanOrEqual(1);
  });

  test("nenhum problema — e a lista diz QUAL, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("o cabeçalho foi LIDO: tem prompt, item e data, e o prompt é o último título de prompt", () => {
    const c = lerOCabecalho(ONDE)!;
    expect(c).not.toBeNull();
    expect(c.prompt).toBe(lerAsRodadas(RECADOS).at(-1)!.prompt);
    expect(c.item).toMatch(/^\d{3,}$/);
    expect(c.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("LAB-126 · a régua — os dois lados demonstrados", () => {
  test("O LADO BOM: data, prompt, item e corrente certos", () => {
    expect(tipos(cab("16/10/2026", "LAB-12", "031", ["LAB-11", "LAB-10"]), TRES)).toEqual([]);
  });

  test("O LADO RUIM, o defeito medido (`76bfdcd`, LAB-67): o recado novo gravado, o cabeçalho num prompt atrás", () => {
    expect(tipos(cab("16/10/2026", "LAB-11", "900", ["LAB-10"]), TRES)).toEqual(["prompt-diferente"]);
  });

  test("o item trocado reprova", () => {
    expect(tipos(cab("16/10/2026", "LAB-12", "900"), TRES)).toEqual(["item-diferente"]);
  });

  test("a data ANTERIOR ao recado reprova — e a posterior não", () => {
    expect(tipos(cab("15/10/2026", "LAB-12", "031"), TRES)).toEqual(["data-anterior-ao-recado"]);
    expect(tipos(cab("17/10/2026", "LAB-12", "031"), TRES)).toEqual([]);
  });

  test("a data se compara como DATA, não como texto dd/mm: 01/11 é depois de 31/10", () => {
    const r = recados(rodada("31/10/2026", "LAB-12", "LAB-12", "031"));
    expect(tipos(cab("01/11/2026", "LAB-12", "031"), r)).toEqual([]);
  });

  test("a corrente fora de ordem, pulando um, ou com um prompt que não existe reprova", () => {
    expect(tipos(cab("16/10/2026", "LAB-12", "031", ["LAB-10", "LAB-11"]), TRES)).toEqual([
      "corrente-fora-de-ordem",
      "corrente-fora-de-ordem",
    ]);
    expect(tipos(cab("16/10/2026", "LAB-12", "031", ["LAB-10"]), TRES)).toEqual(["corrente-fora-de-ordem"]);
    expect(tipos(cab("16/10/2026", "LAB-12", "031", ["LAB-11", "LAB-10", "LAB-09"]), TRES)).toEqual([
      "corrente-fora-de-ordem",
    ]);
  });

  test("a corrente pode PARAR antes — o cabeçalho escolhe até onde relata", () => {
    expect(tipos(cab("16/10/2026", "LAB-12", "031", ["LAB-11"]), TRES)).toEqual([]);
  });

  test("cabeçalho sem a forma reprova — não é verde em zero", () => {
    expect(tipos("# ONDE PARAMOS\n\nalgum texto\n", TRES)).toEqual(["cabecalho-ilegivel"]);
    expect(tipos(cab("16/10/2026", "LAB-12", "031"), "# RECADOS\n")).toEqual(["recados-sem-prompt"]);
  });
});

describe("LAB-126 · os casos válidos que quase parecem inválidos — os três que a história tem", () => {
  test("o disparo em vazio DEPOIS do prompt: o título de classe não é prompt executado", () => {
    const r = TRES + rodada("17/10/2026", "despertador-sem-item", "despertador-sem-item", null);
    expect(tipos(cab("16/10/2026", "LAB-12", "031", ["LAB-11"]), r)).toEqual([]);
  });

  test("a continuação do mesmo prompt (o `LAB-83 (continuação) · decisao-registrada`), sem item no recado", () => {
    const r = TRES + rodada("16/10/2026", "LAB-12 (continuação) · decisao-registrada", "decisao-registrada", null);
    expect(tipos(cab("16/10/2026", "LAB-12", "031", ["LAB-11"]), r)).toEqual([]);
  });

  test("o segundo despertador do mesmo prompt (o LAB-95), num dia depois: a corrente não repete o prompt", () => {
    const r = TRES + rodada("17/10/2026", "LAB-12 (2º despertador)", "LAB-12", "031");
    expect(tipos(cab("16/10/2026", "LAB-12", "031", ["LAB-11", "LAB-10"]), r)).toEqual([]);
  });

  test("um título, dois prompts (o `LAB-13 e LAB-14`, de 19/09): vale o último", () => {
    const r = recados(rodada("19/09/2026", "LAB-13 e LAB-14", "LAB-13 e LAB-14", null));
    expect(lerAsRodadas(r).map((x) => x.prompt)).toEqual(["LAB-14"]);
  });

  test("LAB-12 não é prefixo de LAB-125: o item é o do prompt inteiro", () => {
    const r = recados(rodada("16/10/2026", "LAB-125", "LAB-125", "900"));
    expect(tipos(cab("16/10/2026", "LAB-125", "900"), r)).toEqual([]);
    expect(tipos(cab("16/10/2026", "LAB-12", "900"), r)).toEqual(["prompt-diferente"]);
  });
});
