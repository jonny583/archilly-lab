/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-95 · item 028 — as travas do enxugar: a regra fica, a história muda de gaveta.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O item 028 disse qual é a única forma de errar este item: **apagar**. Então estas travas guardam
 * o lado que o enxugar pode quebrar em silêncio:
 *
 * 1. **nenhuma regra saiu do `CLAUDE.md`** — e a conferência é dos **dois** lados: a marca de cada
 *    regra está na página de hoje **e** na história (que é o texto antigo, movido literal). Faltar
 *    no primeiro é regra apagada; faltar no segundo é lista inventada;
 * 2. **todo ponteiro de história resolve** numa seção que existe;
 * 3. **a prova diz que zero linhas se perderam** — e ela traz o `sha256` do texto antigo, para o
 *    número não ser sobre um "antes" que ninguém pode conferir;
 * 4. **a régua reprova de verdade:** regra tirada da página é pega, e marca que não existia antes
 *    também.
 *
 * Elas **não leem clone vizinho nenhum** — dois `.md` deste repositório, um módulo puro e a prova
 * em JSON —, e por isso vão no trabalho de CI que roda sem segredo.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_REGRAS,
  aContaDasRegras,
  conferirOInventario,
  linhasQueImportam,
  oQueSePerdeu,
} from "../src/enxugar-o-claude.ts";
import {
  ARQUIVO_DA_HISTORIA,
  SECAO_DO_PONTO_CEGO,
  aSecaoDaHistoria,
} from "../src/historia-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
const historia = readFileSync(join(RAIZ, ARQUIVO_DA_HISTORIA), "utf8");
const PROVA = join(RAIZ, "docs", "provas", "LAB-95", "nada-se-perdeu.json");
const prova = (): {
  caracteres: { claudeMd: { antes: number; depois: number }; meta: number; chegouNaMeta: boolean };
  regras: { total: number; problemas: unknown[] };
  linhasPerdidas: string[];
  oChaoDaMedicao: { oCommitDeAntes: string; sha256DoAntes: string; cloneRaso: boolean };
  oQueIstoNaoAlcanca: string[];
} => JSON.parse(readFileSync(PROVA, "utf8"));

describe("LAB-95 · nenhuma regra saiu, e a conta é dos dois lados", () => {
  test("O LADO BOM: zero problemas no inventário de hoje", () => {
    expect(conferirOInventario(claudeMd, historia)).toEqual([]);
  });

  test("a lista tem regra de TODAS as seções de regra da página", () => {
    const secoes = new Set(AS_REGRAS.map((r) => r.seccao));
    for (const s of ["1", "1-A", "1-B", "1-C", "3", "4", "4-A", "5", "6", "7"]) {
      expect(secoes.has(s), `nenhuma regra inscrita para a §${s}`).toBe(true);
    }
    expect(aContaDasRegras().total).toBe(AS_REGRAS.length);
    expect(AS_REGRAS.length).toBeGreaterThanOrEqual(70);
  });

  test("todo ponteiro de história resolve numa seção que existe", () => {
    for (const r of AS_REGRAS) {
      expect(historia, `${r.marca} aponta para ${r.historia}`).toContain(`## ${r.historia} ·`);
    }
    // E a seção que as guardas leem por título continua achável.
    expect(aSecaoDaHistoria(historia, SECAO_DO_PONTO_CEGO)).not.toBeNull();
    expect(aSecaoDaHistoria(historia, "## H99 · não existe")).toBeNull();
  });

  test("a página de regras NÃO carrega mais a narrativa, e a história carrega", () => {
    // Duas frases que o item chamava de história: a tabela do ponto cego e a medição datada.
    for (const narrativa of ["441 de 441 lotes sem frente", "quatro blocos numa rodada custaram"]) {
      expect(historia, `a história perdeu: ${narrativa}`).toContain(narrativa);
    }
    expect(claudeMd).not.toContain("441 de 441 lotes sem frente");
  });
});

describe("LAB-95 · a régua REPROVA — e os dois tipos de erro são diferentes", () => {
  test("O LADO RUIM: regra tirada da página é pega, e pelo tipo certo", () => {
    const semUmaRegra = claudeMd.replace("Não decide urbanismo", "(apagado)");
    const p = conferirOInventario(semUmaRegra, historia);
    expect(p.map((x) => x.tipo)).toContain("regra-sumiu-do-claude");
    expect(p).toHaveLength(1);
  });

  test("O LADO RUIM: marca que não existia antes é pega — lista inventada também reprova", () => {
    const semAHistoria = historia.replace("Não decide urbanismo", "(apagado)");
    const p = conferirOInventario(claudeMd, semAHistoria);
    expect(p.map((x) => x.tipo)).toContain("marca-nao-existia-antes");
  });

  test("ponteiro para seção que não existe é pego", () => {
    const semSecao = historia.replace("## H7 ·", "## H7-sumiu ·");
    expect(conferirOInventario(claudeMd, semSecao).map((x) => x.tipo)).toContain(
      "historia-sem-secao",
    );
  });

  test("`oQueSePerdeu` acha a linha apagada, e não acusa a que só mudou de lugar", () => {
    const antigo = "uma regra que fica\numa regra que foi apagada\noutra que mudou de gaveta";
    // A que "mudou de gaveta" está na história; a apagada não está em lugar nenhum.
    const perdidas = oQueSePerdeu(antigo, "uma regra que fica", "outra que mudou de gaveta");
    expect(perdidas).toEqual(["uma regra que foi apagada"]);
  });

  test("`linhasQueImportam` ignora enfeite, e só enfeite", () => {
    expect(linhasQueImportam("a\n\n---\n| --- |\nb")).toEqual(["a", "b"]);
  });
});

describe("LAB-95 · a prova da conta, e o número em vez do adjetivo", () => {
  test("zero linhas perdidas, e o `antes` é conferível pelo sha", () => {
    const p = prova();
    expect(p.linhasPerdidas).toEqual([]);
    expect(p.regras.problemas).toEqual([]);
    expect(p.oChaoDaMedicao.sha256DoAntes).toMatch(/^[0-9a-f]{64}$/);
    expect(p.oChaoDaMedicao.oCommitDeAntes).toMatch(/^[0-9a-f]{7,40}$/);
    expect(p.oChaoDaMedicao.cloneRaso, "a conta foi feita num clone raso — ela não vale (D295)").toBe(
      false,
    );
  });

  test("a conta de caracteres bate com os arquivos de hoje", () => {
    const p = prova();
    expect(p.caracteres.claudeMd.depois).toBe(claudeMd.length);
    expect(p.caracteres.claudeMd.antes).toBeGreaterThan(p.caracteres.claudeMd.depois);
  });

  test("a prova DIZ se chegou à meta, e o `false` não é escondido", () => {
    const p = prova();
    expect(typeof p.caracteres.chegouNaMeta).toBe("boolean");
    expect(p.caracteres.meta).toBe(15_000);
    // Enquanto não chegar, o número que falta tem de estar publicado — o item pediu
    // "número, não adjetivo", e `chegouNaMeta: false` sem o quanto seria adjetivo.
    if (!p.caracteres.chegouNaMeta) {
      expect(claudeMd.length - p.caracteres.meta).toBeGreaterThan(0);
    }
  });

  test("a prova declara o próprio buraco — a lista é escrita à mão", () => {
    expect(prova().oQueIstoNaoAlcanca.length).toBeGreaterThanOrEqual(3);
    expect(prova().oQueIstoNaoAlcanca.join(" ")).toContain("LISTA ESCRITA À MÃO");
  });
});
