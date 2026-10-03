/**
 * Os testes da via desenhada como coluna vertebral. (LAB-23)
 *
 * ```sh
 * bun test tests/coluna-vertebral.test.ts
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **a prova por diferença vale mais que a declaração.** Os quatro motores
 *   declaram ignorar via desenhada; aqui a mesma gleba roda com e sem ela e a
 *   SAÍDA é comparada byte a byte. Declaração é promessa, diferença é prova —
 *   e se algum dia um motor passar a respeitar, este teste morde primeiro;
 * - **tirar a via do arquivo não pode tirar mais nada.** O controle da
 *   experiência precisa ser cirúrgico: se ele apagasse também a testada de
 *   frente, a comparação mediria duas coisas ao mesmo tempo.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { linhasDaEntrada } from "../src/motores/comum.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";

const FIXTURES = join(import.meta.dirname, "..", "..", "..", "docs", "fixtures", "glebas-com-via-desenhada");
const PROVA = join(import.meta.dirname, "..", "..", "..", "docs", "provas", "LAB-23", "coluna-vertebral.json");

const ler = (id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, `${id}.entrada.json`), "utf8"));

/** O mesmo controle da ferramenta: tira só as vias desenhadas. */
function semViaDesenhada(e: EntradaMinima): EntradaMinima {
  const { desenhadas } = linhasDaEntrada(e);
  const chaves = new Set(desenhadas.map((l) => JSON.stringify(l)));
  return {
    ...e,
    atracoes: (e.atracoes ?? []).filter((a) => {
      const g = (a as { geometria?: { pontos?: { x: number; y: number }[] } }).geometria;
      return !(g?.pontos && chaves.has(JSON.stringify(g.pontos)));
    }),
  };
}

describe("o controle da experiência é cirúrgico", () => {
  test("tira as vias desenhadas, e só elas", () => {
    const e = ler("antonina-com-via");
    const antes = linhasDaEntrada(e);
    expect(antes.desenhadas.length).toBe(4);
    expect(antes.testadasDeFrente.length).toBe(1);

    const depois = linhasDaEntrada(semViaDesenhada(e));
    expect(depois.desenhadas).toHaveLength(0);
    // A testada de frente FICA: ela não é via desenhada (D64), e apagá-la faria
    // a comparação medir duas coisas ao mesmo tempo.
    expect(depois.testadasDeFrente).toHaveLength(1);
  });

  test("na gleba sem testada, sobra atração nenhuma", () => {
    const e = ler("ensaio-com-via");
    expect(linhasDaEntrada(e).desenhadas).toHaveLength(4);
    const d = linhasDaEntrada(semViaDesenhada(e));
    expect(d.desenhadas).toHaveLength(0);
    expect(d.testadasDeFrente).toHaveLength(0);
  });
});

describe("a prova por diferença, como a ferramenta a gravou", () => {
  const prova = JSON.parse(readFileSync(PROVA, "utf8")) as {
    glebas: {
      gleba: string;
      viasDesenhadas: number;
      aLinhaDaMao: { medida: boolean; rampaPior_pct: number | null };
      motores: Record<string, { saidaIdenticaSemAVia: boolean; rampaDoMotor: { pior_pct: number | null } }>;
    }[];
  };

  test("as duas glebas foram medidas, com quatro vias desenhadas cada", () => {
    expect(prova.glebas).toHaveLength(2);
    for (const g of prova.glebas) expect(g.viasDesenhadas).toBe(4);
  });

  /**
   * **VIRADO no LAB-30, e esta virada é a mais cara do repositório.**
   *
   * O nome dele era *"NENHUM motor muda a saída quando a via sai do arquivo"*, e o
   * comentário dizia, com orgulho, *"se um dia um motor passar a respeitar a via,
   * este teste morde antes de qualquer relatório sair errado"*.
   *
   * **Ele não mordeu, e o relatório saiu errado — duas vezes.** A SAÍDA do
   * Laboratório de Parcelamento era idêntica com e sem a via porque **a ida do Lab
   * nunca entregava a via ao motor**. O campo `viaManual` existe nele desde sempre.
   * O LAB-17 e o LAB-23 publicaram que *o motor* ignorava via desenhada; quem a
   * ignorava era a ponte (D119).
   *
   * **E havia um segundo defeito, mais fino:** este teste lê a PROVA CONGELADA
   * (`coluna-vertebral.json`), não o motor rodando. Teste de falsificação que lê
   * prova velha não falsifica nada — ele repete. A prova foi regerada, e o que
   * garante que ela não envelheça de novo é o `guarda-da-ida.test.ts`, que mede.
   *
   * Agora ele exige o que está medido: **três dos quatro** não mudam, e **o
   * Parcelamento muda**.
   */
  test("três dos quatro ignoram a via; o Parcelamento MUDA a saída com ela", () => {
    for (const g of prova.glebas) {
      for (const [id, m] of Object.entries(g.motores)) {
        if (id === "parcelamento") {
          expect(
            m.saidaIdenticaSemAVia,
            `${id} em ${g.gleba}: a via chega ao motor desde o LAB-30 e a saída tem de mudar`,
          ).toBe(false);
          continue;
        }
        expect(m.saidaIdenticaSemAVia, `${id} em ${g.gleba} mudou a saída`).toBe(true);
      }
    }
  });

  test("a linha da mão foi medida pela mesma régua das vias dos motores", () => {
    for (const g of prova.glebas) {
      expect(g.aLinhaDaMao.medida).toBe(true);
      expect(g.aLinhaDaMao.rampaPior_pct).not.toBeNull();
      for (const m of Object.values(g.motores)) {
        expect(m.rampaDoMotor.pior_pct).not.toBeNull();
      }
    }
  });

  test("em `antonina-com-via` a linha da mão é melhor assentada que as QUATRO", () => {
    // É o resultado que o relatório lê — e ele tem de quebrar se a medição
    // mudar, para a leitura não sobreviver aos números.
    const g = prova.glebas.find((x) => x.gleba === "antonina-com-via")!;
    const dela = g.aLinhaDaMao.rampaPior_pct!;
    for (const [id, m] of Object.entries(g.motores)) {
      expect(dela, `a linha da mão devia ser mais mansa que ${id}`).toBeLessThan(m.rampaDoMotor.pior_pct!);
    }
  });

  test("em `ensaio-com-via` ela é PIOR que as quatro — e isso também está medido", () => {
    // A resposta depende da gleba, e o relatório diz isso. Fixar as duas pontas
    // impede que uma leitura cômoda sobreviva à medição.
    const g = prova.glebas.find((x) => x.gleba === "ensaio-com-via")!;
    const dela = g.aLinhaDaMao.rampaPior_pct!;
    for (const [id, m] of Object.entries(g.motores)) {
      expect(dela, `a linha da mão devia ser mais íngreme que ${id}`).toBeGreaterThan(m.rampaDoMotor.pior_pct!);
    }
  });
});
