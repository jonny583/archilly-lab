/**
 * **LAB-130 (item 900) · o recado diz onde está o detalhe** (D358).
 *
 * ```sh
 * bun test tests/onde-esta-o-detalhe.test.ts
 * ```
 *
 * O protocolo da caixa manda a resposta inteira da rodada para `docs/relatorios/<prompt>.md` e que o
 * recado diga **onde** ela está. A trava que havia andava no sentido contrário (todo relatório tem
 * recado); tirar o ponteiro de um recado, ou apontar o relatório de outro prompt, não reprovava nenhuma
 * das 1 390 travas da esteira. Roda **sem clones** (lê o `COMO_FUNCIONA.md`, o `RECADOS.md` e os
 * relatórios deste repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  DIA_DA_REGRA,
  EXCECOES_HISTORICAS,
  conferirOndeEstaODetalhe,
  dizOnde,
  type ExcecaoDoDetalhe,
} from "../src/onde-esta-o-detalhe.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RELATORIOS = join(RAIZ, "docs", "relatorios");
const RECADOS = readFileSync(join(RELATORIOS, "RECADOS.md"), "utf8");
const PROTOCOLO = readFileSync(join(RAIZ, "docs", "caixa-de-entrada", "COMO_FUNCIONA.md"), "utf8");

/** A primeira linha do relatório de verdade, ou `null`. */
const deVerdade = (p: string): string | null => {
  const f = join(RELATORIOS, `${p}.md`);
  return existsSync(f) ? readFileSync(f, "utf8").split("\n")[0]! : null;
};

const CORPO = ["Estado: feito", "Feito: a régua; relatório LAB-500.", "Achados para outros apps ou Central: nada", "Depende do Jonny: nada", "Próximo na fila: o 900"];
const bloco = (prompt: string, corpo = CORPO, data = "16/10/2026"): string =>
  [`## ${data} · ${prompt} — a`, "", "```", `=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · ${prompt} (item 900) ===`, ...corpo, "=== FIM ===", "```", ""].join("\n");
const falso = (titulos: Record<string, string>) => (p: string) => titulos[p] ?? null;
const tipos = (texto: string, rel: (p: string) => string | null, excecoes: readonly ExcecaoDoDetalhe[] = []) =>
  conferirOndeEstaODetalhe(texto, rel, excecoes).problemas.map((p) => `${p.prompt} ${p.tipo}`);

/** Troca a PRIMEIRA ocorrência de `de` dentro do recado de `prompt`, e falha alto se ela não estiver lá. */
function trocarNoRecado(texto: string, prompt: string, de: string, para: string): string {
  const i = texto.indexOf(`· ${prompt} `);
  expect(i).toBeGreaterThan(0);
  const fim = texto.indexOf("=== FIM ===", i);
  const j = texto.indexOf(de, i);
  expect(j > i && j < fim).toBe(true);
  return texto.slice(0, j) + para + texto.slice(j + de.length);
}

describe("LAB-130 · a página de verdade — todo recado com prompt aponta o relatório dele", () => {
  const r = conferirOndeEstaODetalhe(RECADOS, deVerdade);

  test("a regra está escrita onde mora, e o dia de corte é o do commit dela", () => {
    expect(aRegraEstaEscrita(PROTOCOLO, A_REGRA)).toBe(true);
    expect(aRegraEstaEscrita(PROTOCOLO, "`docs/relatorios/<prompt>.md`")).toBe(true);
    expect(DIA_DA_REGRA).toBe("2026-10-09");
  });

  test("o universo: todos os recados lidos, e cada um num dos três montes — publicado, não zero", () => {
    const ingenuos = RECADOS.match(/^=== RECADO PARA O CHAT/gm)!.length;
    const u = r.universo;
    console.log(
      `    ${u.recados} recados · ${u.antesDaRegra} antes de ${DIA_DA_REGRA} · ${u.semPrompt} de classe, sem prompt · ` +
        `${u.noAlcance} no alcance · ${r.perdoados.length} perdoados · ${r.problemas.length} problemas`,
    );
    expect(u.recados).toBe(ingenuos);
    expect(u.antesDaRegra + u.semPrompt + u.noAlcance).toBe(u.recados);
    // Contados no LAB-130: os de antes não mudam mais; os de classe e os do alcance só crescem.
    expect(u.antesDaRegra).toBe(72);
    expect(u.semPrompt).toBeGreaterThanOrEqual(6);
    expect(u.noAlcance).toBeGreaterThanOrEqual(63);
  });

  test("nenhum problema — e a lista diz QUAL, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("as exceções: vinte e três, todas usadas, todas com o relatório gravado", () => {
    expect(EXCECOES_HISTORICAS).toHaveLength(23);
    expect(new Set(EXCECOES_HISTORICAS.map((e) => e.prompt)).size).toBe(23);
    expect(r.perdoados).toHaveLength(23);
    expect(r.perdoados.every((p) => p.tipo === "recado-nao-diz-onde")).toBe(true);
    expect(r.excecoesSemUso).toEqual([]);
    expect(r.excecoesSemRelatorio).toEqual([]);
  });

  test("sem as exceções, reprovam os vinte e três — e só por não dizer onde", () => {
    const sem = conferirOndeEstaODetalhe(RECADOS, deVerdade, []);
    expect(sem.problemas).toHaveLength(23);
    expect(sem.problemas.every((p) => p.tipo === "recado-nao-diz-onde")).toBe(true);
  });
});

describe("LAB-130 · as mutações medidas antes da régua, plantadas na página de verdade", () => {
  test("o ponteiro tirado do recado do LAB-129 — antes, zero travas acusavam", () => {
    const m = trocarNoRecado(RECADOS, "LAB-129 (item 900)", "; relatório LAB-129.", ".");
    expect(tipos(m, deVerdade, EXCECOES_HISTORICAS)).toEqual(["LAB-129 recado-nao-diz-onde"]);
  });

  test("o ponteiro tirado do LAB-92, o primeiro que adotou a forma — antes, zero", () => {
    const m = trocarNoRecado(RECADOS, "LAB-92", "Relatório: `docs/relatorios/LAB-92.md`.", "");
    expect(tipos(m, deVerdade, EXCECOES_HISTORICAS)).toEqual(["LAB-92 recado-nao-diz-onde"]);
  });

  test("o LAB-120 apontando o relatório do LAB-119 — um lugar que existe, e é o errado — antes, zero", () => {
    const m = trocarNoRecado(RECADOS, "LAB-120", "relatório LAB-120", "relatório LAB-119");
    expect(tipos(m, deVerdade, EXCECOES_HISTORICAS)).toEqual(["LAB-120 recado-nao-diz-onde"]);
  });

  test("o relatório do LAB-110 sumido do disco — o ponteiro sozinho não basta", () => {
    const rel = (p: string) => (p === "LAB-110" ? null : deVerdade(p));
    expect(tipos(RECADOS, rel, EXCECOES_HISTORICAS)).toEqual(["LAB-110 relatorio-ausente"]);
  });

  test("a exceção cujo relatório sumiu é denunciada — o perdão é do ponteiro, nunca do detalhe", () => {
    const rel = (p: string) => (p === "LAB-75" ? null : deVerdade(p));
    const r = conferirOndeEstaODetalhe(RECADOS, rel);
    expect(r.problemas.map((p) => `${p.prompt} ${p.tipo}`)).toEqual(["LAB-75 relatorio-ausente"]);
    expect(r.excecoesSemRelatorio.map((e) => e.prompt)).toEqual(["LAB-75"]);
  });
});

describe("LAB-130 · a régua — os dois lados demonstrados", () => {
  const certo = falso({ "LAB-500": "# LAB-500 — a régua" });

  test("O LADO BOM: as duas formas da história dizem onde", () => {
    expect(tipos(bloco("LAB-500"), certo)).toEqual([]);
    const caminho = [...CORPO];
    caminho[1] = "Feito: a régua. Relatório: `docs/relatorios/LAB-500.md`.";
    expect(tipos(bloco("LAB-500", caminho), certo)).toEqual([]);
    expect(dizOnde("ver ../relatorios/LAB-500.md", "LAB-500")).toBe(true);
    expect(dizOnde("Relatório: LAB-500", "LAB-500")).toBe(true);
  });

  test("o caso válido que quase parece inválido: o ponteiro pode estar em qualquer linha do recado", () => {
    const corpo = [...CORPO];
    corpo[1] = "Feito: a régua.";
    corpo[4] = "Próximo na fila: o 900 (o detalhe está no relatório LAB-500)";
    expect(tipos(bloco("LAB-500", corpo), certo)).toEqual([]);
  });

  test("O LADO RUIM: 'ver o relatório' sem nome não diz onde, e o prompt de prefixo igual não conta", () => {
    const corpo = [...CORPO];
    corpo[1] = "Feito: a régua; ver o relatório.";
    expect(tipos(bloco("LAB-500", corpo), certo)).toEqual(["LAB-500 recado-nao-diz-onde"]);
    expect(dizOnde("relatório LAB-5000", "LAB-500")).toBe(false);
    expect(dizOnde("relatório LAB-50", "LAB-500")).toBe(false);
    expect(dizOnde("XLAB-500.md", "LAB-500")).toBe(false);
    expect(dizOnde("LAB-500 entregue", "LAB-500")).toBe(false);
  });

  test("o relatório ausente e o relatório de outro prompt reprovam, cada um pelo nome", () => {
    expect(tipos(bloco("LAB-500"), falso({}))).toEqual(["LAB-500 relatorio-ausente"]);
    expect(tipos(bloco("LAB-500"), falso({ "LAB-500": "# LAB-5001 — outro" }))).toEqual(["LAB-500 relatorio-de-outro-prompt"]);
  });

  test("recado de antes da regra e recado de classe ficam fora — contados, não engolidos", () => {
    const antes = conferirOndeEstaODetalhe(bloco("LAB-500", ["Estado: x"], "08/10/2026"), falso({}));
    expect(antes.problemas).toEqual([]);
    expect(antes.universo).toEqual({ recados: 1, antesDaRegra: 1, semPrompt: 0, noAlcance: 0 });
    const classe = bloco("despertador-sem-item", ["Estado: caixa vazia"]);
    const c = conferirOndeEstaODetalhe(classe, falso({}));
    expect(c.problemas).toEqual([]);
    expect(c.universo).toEqual({ recados: 1, antesDaRegra: 0, semPrompt: 1, noAlcance: 0 });
    // E o dia da regra entra inteiro.
    expect(tipos(bloco("LAB-500", ["Estado: x"], "09/10/2026"), certo)).toEqual(["LAB-500 recado-nao-diz-onde"]);
  });

  test("a exceção perdoa só o ponteiro, só do prompt dela — e a que não tem o que perdoar sobra", () => {
    const corpo = ["Estado: x"];
    const e: ExcecaoDoDetalhe = { prompt: "LAB-500", motivo: "teste" };
    const com = conferirOndeEstaODetalhe(bloco("LAB-500", corpo), certo, [e]);
    expect(com.problemas).toEqual([]);
    expect(com.perdoados).toHaveLength(1);
    expect(com.excecoesSemUso).toEqual([]);
    const outro = conferirOndeEstaODetalhe(bloco("LAB-501", corpo), falso({ "LAB-501": "# LAB-501" }), [e]);
    expect(outro.problemas.map((p) => p.tipo)).toEqual(["recado-nao-diz-onde"]);
    expect(outro.excecoesSemUso).toEqual([e]);
    const semRel = conferirOndeEstaODetalhe(bloco("LAB-500", corpo), falso({}), [e]);
    expect(semRel.problemas.map((p) => p.tipo)).toEqual(["relatorio-ausente"]);
    expect(semRel.excecoesSemRelatorio).toEqual([e]);
    const jaAponta = conferirOndeEstaODetalhe(bloco("LAB-500"), certo, [e]);
    expect(jaAponta.excecoesSemUso).toEqual([e]);
  });
});
