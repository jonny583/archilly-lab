/**
 * A guarda do item 007: **por LUGAR, não por frase** — e o disco não é a origem.
 *
 * ```sh
 * bun test tests/por-lugar.test.ts
 * ```
 *
 * O critério de "deu certo" do item: *"nenhuma afirmação sua sobre outro repositório saiu sem um
 * `git show origin/…` na mão, e a varredura das condições de volta foi feita por LUGAR — com a
 * lista dos lugares escrita, para quem vier depois saber onde você olhou."*
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { VIZINHOS, conferirContraAOrigem } from "../src/commit-dos-vizinhos.ts";
import {
  LUGARES,
  QUANTAS_CONDICOES,
  conferirOsLugares,
} from "../src/lugares-das-condicoes.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (p: string): string | null => {
  try {
    return readFileSync(join(RAIZ, p), "utf8");
  } catch {
    return null;
  }
};

describe("item 007 · a varredura por LUGAR, e a lista está escrita", () => {
  test("O LADO BOM: os SETE lugares existem e cada um ainda traz a sua marca", () => {
    expect(LUGARES).toHaveLength(7);
    expect(conferirOsLugares(ler).map((p) => `${p.tipo}: ${p.oQue}`)).toEqual([]);
  });

  /**
   * **A conta que corrige o item 006.** Lá eu publiquei *"zero de quinze"* — as quinze eram as
   * etiquetas de **um** lugar. Por lugar são **vinte e uma** condições em **sete** lugares, e o
   * veredicto (nenhuma é CONTA) sobreviveu; a cobertura não. *O meu "zero" estava certo por não
   * haver nenhuma, não por a varredura alcançar.*
   */
  test("são VINTE E UMA condições em sete lugares, e a varredura de frase alcançava QUINZE", () => {
    expect(QUANTAS_CONDICOES.naFila).toBe(15);
    expect(QUANTAS_CONDICOES.foraDaFila).toBe(6);
    expect(QUANTAS_CONDICOES.total).toBe(21);
    expect(QUANTAS_CONDICOES.queAVarreduraDeFraseAlcancou).toBe(15);
    // A conta fecha: o que a frase alcançava mais o que só o lugar mostrou.
    expect(QUANTAS_CONDICOES.queAVarreduraDeFraseAlcancou + QUANTAS_CONDICOES.foraDaFila).toBe(
      QUANTAS_CONDICOES.total,
    );
  });

  test("NENHUMA das condições é uma CONTA, e nenhuma contradiz a regra de família", () => {
    expect(LUGARES.filter((l) => l.tipo === "conta")).toEqual([]);
    expect(LUGARES.filter((l) => l.contradizARegra)).toEqual([]);
  });

  test("todo lugar é um ARQUIVO, nunca um padrão — e cada tipo é do vocabulário", () => {
    for (const l of LUGARES) {
      expect(l.lugar, l.lugar).not.toContain("*");
      expect(l.oQueEstaParado.length, l.lugar).toBeGreaterThan(20);
      expect(l.aCondicao.length, l.lugar).toBeGreaterThan(20);
    }
    expect(new Set(LUGARES.map((l) => l.lugar)).size).toBe(LUGARES.length);
  });

  test("O LADO RUIM: lugar que sumiu, marca que saiu e CONTA declarada REPROVAM", () => {
    expect(conferirOsLugares(() => null).map((p) => p.tipo)).toEqual(
      LUGARES.map(() => "lugar-ausente"),
    );
    expect(conferirOsLugares(() => "texto sem marca nenhuma").every((p) => p.tipo === "marca-ausente")).toBe(true);
  });
});

describe("item 007 · o DISCO não é a ORIGEM", () => {
  test("`atras` DIZ quantos commits, e o número vai na frase", () => {
    const r = conferirContraAOrigem("motor-testfit", "6cf6396", "0f00c1a", 23);
    expect(r.veredito).toBe("atras");
    expect(r.oQueIssoQuerDizer).toContain("23 commit(s) ATRÁS");
    expect(r.oQueIssoQuerDizer).toContain("0f00c1a");
  });

  test("`em-dia` só quando a distância é ZERO", () => {
    expect(conferirContraAOrigem("urban-scout-tool", "abc1234", "abc1234", 0).veredito).toBe("em-dia");
  });

  /** **Sem `git fetch` não há origem**, e não medido não é em dia (D23). */
  test("sem a origem o veredicto é `origem-desconhecida`, nunca `em-dia`", () => {
    for (const caso of [
      ["abc1234", null, null],
      [null, "abc1234", 0],
      ["abc1234", "def5678", null],
    ] as const) {
      const r = conferirContraAOrigem("urban-create-hub-41d93a4d", caso[0], caso[1], caso[2]);
      expect(r.veredito, JSON.stringify(caso)).toBe("origem-desconhecida");
      expect(r.oQueIssoQuerDizer).toContain("NÃO MEDIDO");
    }
  });

  test("clone à frente da origem é `a-frente`, e é estranho num clone só de leitura", () => {
    const r = conferirContraAOrigem("motor-testfit", "aaa1111", "bbb2222", -3);
    expect(r.veredito).toBe("a-frente");
  });

  test("o veredicto da origem NUNCA reprova — ele diz, como o do primeiro eixo", () => {
    for (const v of VIZINHOS) {
      const r = conferirContraAOrigem(v, "aaa1111", "bbb2222", 10);
      expect(r.oQueIssoQuerDizer.length).toBeGreaterThan(40);
      expect(r.repo).toBe(v);
    }
  });
});
