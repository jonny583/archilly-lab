/**
 * **LAB-128 (item 900) · o recado vai ao `RECADOS.md` com data, e em ordem cronológica** (D356).
 *
 * ```sh
 * bun test tests/a-data-do-recado.test.ts
 * ```
 *
 * O `CLAUDE.md` §1 manda o recado *"inteiro e com data"* ao `RECADOS.md`, e o alto do `RECADOS.md`
 * diz *"em ordem cronológica — o mais antigo primeiro"*. Cento e trinta e nove títulos cumpriam por
 * disciplina; tirar a data de um, voltar a data de outro ou datar um 31/02 não reprovava nenhuma
 * das travas que leem a página. Roda **sem clones** (só lê o `CLAUDE.md` e o `RECADOS.md` deste
 * repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { A_REGRA_NO_CLAUDE, A_REGRA_NO_RECADOS, conferirADataDoRecado, lerOsTitulos } from "../src/a-data-do-recado.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RECADOS = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");
const CLAUDE = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
const HOJE = new Date().toISOString().slice(0, 10);

const rodada = (titulo: string, prompt = "LAB-12"): string =>
  `${titulo}\n\n\`\`\`\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · ${prompt} ===\nEstado: feito\n=== FIM ===\n\`\`\`\n\n`;
const tipos = (texto: string, hoje = "2026-10-16"): string[] => conferirADataDoRecado(texto, hoje).problemas.map((p) => p.tipo);

/** Troca a PRIMEIRA ocorrência, e falha alto se ela não existir — mutação que não muda nada não prova nada. */
function trocar(texto: string, de: string, para: string): string {
  expect(texto.includes(de)).toBe(true);
  return texto.replace(de, para);
}

describe("LAB-128 · a página de verdade — todo recado tem data, e a data nunca volta", () => {
  const r = conferirADataDoRecado(RECADOS, HOJE);

  test("as duas frases estão escritas onde moram — a trava sabe de onde vem", () => {
    expect(aRegraEstaEscrita(CLAUDE, A_REGRA_NO_CLAUDE)).toBe(true);
    expect(aRegraEstaEscrita(RECADOS, A_REGRA_NO_RECADOS)).toBe(true);
  });

  test("o universo: os títulos e os recados que a régua leu são os de uma contagem ingênua, e não zero", () => {
    const titulosIngenuos = RECADOS.match(/^## /gm)!.length;
    const recadosIngenuos = RECADOS.match(/^=== RECADO PARA O CHAT/gm)!.length;
    console.log(`    ${r.titulos} títulos · ${r.recados} recados · de ${r.primeira} a ${r.ultima} · ${r.problemas.length} problemas`);
    expect(r.titulos).toBe(titulosIngenuos);
    expect(r.recados).toBe(recadosIngenuos);
    expect(r.titulos).toBeGreaterThanOrEqual(139);
    expect(r.primeira).toBe("2026-09-13");
  });

  test("nenhum problema — e a lista diz QUAL, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("o título com qualificador é de verdade e vale: 07/10/2026 (noite)", () => {
    const noite = lerOsTitulos(RECADOS).titulos.filter((t) => t.texto.startsWith("## 07/10/2026 (noite) · "));
    expect(noite).toHaveLength(1);
    expect(noite[0]!.data).toBe("2026-10-07");
  });
});

describe("LAB-128 · as mutações medidas antes da régua, plantadas na página de verdade", () => {
  test("a data tirada de um título VELHO (o LAB-50) — antes, zero travas acusavam", () => {
    const m = trocar(RECADOS, "## 06/10/2026 · LAB-50 —", "## LAB-50 —");
    expect(tipos(m, HOJE)).toEqual(["titulo-sem-data"]);
  });

  test("a data que volta (o LAB-120 em 03/10, atrás do LAB-119) — antes, zero", () => {
    const m = trocar(RECADOS, "## 16/10/2026 · LAB-120 —", "## 03/10/2026 · LAB-120 —");
    expect(tipos(m, HOJE)).toEqual(["data-que-volta"]);
  });

  test("a data que o calendário não tem (o LAB-110 em 31/02) — antes, zero", () => {
    const m = trocar(RECADOS, "## 15/10/2026 · LAB-110", "## 31/02/2026 · LAB-110");
    expect(tipos(m, HOJE)).toEqual(["data-invalida"]);
  });
});

describe("LAB-128 · a régua — os dois lados demonstrados", () => {
  test("O LADO BOM: datas que avançam, e várias no mesmo dia", () => {
    expect(tipos(rodada("## 15/10/2026 · LAB-10 — a") + rodada("## 16/10/2026 · LAB-11 — b") + rodada("## 16/10/2026 · LAB-12 — c"))).toEqual([]);
  });

  test("o caso válido que quase parece inválido: 30/09 → 01/10 avança, embora '01' venha antes de '30' nas letras", () => {
    expect(tipos(rodada("## 30/09/2026 · LAB-10 — a") + rodada("## 01/10/2026 · LAB-11 — b"))).toEqual([]);
    expect(tipos(rodada("## 01/10/2026 · LAB-10 — a") + rodada("## 30/09/2026 · LAB-11 — b"))).toEqual(["data-que-volta"]);
  });

  test("o qualificador entre parênteses vale; outra palavra antes do · não", () => {
    expect(tipos(rodada("## 07/10/2026 (noite) · A fila — a"))).toEqual([]);
    expect(tipos(rodada("## 07/10/2026 noite · A fila — a"))).toEqual(["titulo-sem-data"]);
  });

  test("a data em outra forma não é a data da página", () => {
    expect(tipos(rodada("## 2026-10-16 · LAB-12 — a"))).toEqual(["titulo-sem-data"]);
    expect(tipos(rodada("## 16/10/26 · LAB-12 — a"))).toEqual(["titulo-sem-data"]);
  });

  test("a data no futuro reprova; a de hoje, não", () => {
    expect(tipos(rodada("## 17/10/2026 · LAB-12 — a"))).toEqual(["data-no-futuro"]);
    expect(tipos(rodada("## 16/10/2026 · LAB-12 — a"))).toEqual([]);
  });

  test("um recado por título: sem recado, e com dois, reprovam", () => {
    expect(tipos("## 16/10/2026 · LAB-12 — sem bloco\n\nsó texto\n\n")).toEqual(["titulo-sem-recado"]);
    const dois = rodada("## 16/10/2026 · LAB-12 — a") + "```\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-13 ===\n=== FIM ===\n```\n";
    expect(tipos(dois)).toEqual(["titulo-com-dois-recados"]);
  });

  test("o recado antes do primeiro título reprova — ele não tem data nenhuma", () => {
    const solto = "```\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-11 ===\n=== FIM ===\n```\n\n";
    expect(tipos(solto + rodada("## 16/10/2026 · LAB-12 — a"))).toEqual(["recado-sem-titulo"]);
  });

  test("o `## ` dentro de bloco de código não é título — nem com data, nem sem", () => {
    const citado = "## 16/10/2026 · LAB-12 — a\n\n```\n=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-12 ===\n## sem data aqui dentro\n=== FIM ===\n```\n";
    expect(tipos(citado)).toEqual([]);
  });

  test("a data que volta se mede contra o último título COM data, não contra o que não tem", () => {
    const t = rodada("## 16/10/2026 · LAB-10 — a") + rodada("## LAB-11 — b") + rodada("## 15/10/2026 · LAB-12 — c");
    expect(tipos(t)).toEqual(["titulo-sem-data", "data-que-volta"]);
  });
});
