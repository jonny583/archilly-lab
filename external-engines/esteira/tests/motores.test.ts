/**
 * Os testes do LAB-13 — a régua que mede os três motores.
 *
 * ```sh
 * bun test
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **a régua da forma não pode punir quem gira o lote**: um retângulo girado
 *   tem de dar irregularidade **zero**. Pela caixa dos eixos ele dá 0,5 — e foi
 *   exatamente isso que apareceu na primeira passada, com 754 de 776 lotes da
 *   candidata espinha marcados "irregulares" sendo todos retângulos;
 * - **testada de frente não é via desenhada à mão**: o contrato v1 chama as
 *   duas de `via_existente`, e perguntar "o motor seguiu esta linha?" a uma
 *   testada premiaria quem pusesse rua em cima da divisa;
 * - **a comparação exige os mesmos parâmetros**, e isso é conferido, não
 *   suposto;
 * - **`null` não é zero**: gleba sem via desenhada devolve `null` na aderência.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  aderenciaAViaDesenhada,
  irregularidade,
  irregularidadeGirada,
  linhasDaEntrada,
  lotesNaTestadaDeFrente,
  type P,
} from "../src/motores/comum.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";

const FIXTURES = join(import.meta.dirname, "..", "..", "..", "docs", "fixtures", "glebas-padrao-com-relevo");
const lerFixture = (id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, `${id}.entrada.json`), "utf8"));

/** Gira um polígono em torno da origem. */
function girar(pts: P[], graus: number): P[] {
  const a = (graus * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return pts.map((p) => ({ x: p.x * c - p.y * s, y: p.x * s + p.y * c }));
}

const RETANGULO: P[] = [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 12 }, { x: 0, y: 12 }];

describe("a forma do lote — duas réguas, e por que duas", () => {
  test("retângulo alinhado aos eixos: zero pelas duas", () => {
    expect(irregularidade(RETANGULO)).toBeCloseTo(0, 6);
    expect(irregularidadeGirada(RETANGULO)).toBeCloseTo(0, 6);
  });

  test("O PONTO: retângulo GIRADO dá zero na girada e muito na dos eixos", () => {
    for (const g of [15, 30, 45, 63]) {
      const r = girar(RETANGULO, g);
      expect(irregularidadeGirada(r)).toBeCloseTo(0, 4);
    }
    // A 45° a caixa dos eixos é a pior possível — e o lote é o mesmo retângulo.
    expect(irregularidade(girar(RETANGULO, 45))).toBeGreaterThan(0.4);
  });

  test("triângulo é metade da caixa, girado ou não", () => {
    const t: P[] = [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 10 }];
    expect(irregularidadeGirada(t)).toBeCloseTo(0.5, 4);
    expect(irregularidadeGirada(girar(t, 37))).toBeCloseTo(0.5, 4);
  });

  test("lasca fina tem irregularidade alta, como tem de ter", () => {
    const lasca: P[] = [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 40, y: 0.2 }, { x: 20, y: 3 }, { x: 0, y: 0.2 }];
    expect(irregularidadeGirada(lasca)).toBeGreaterThan(0.4);
  });
});

describe("testada de frente × via desenhada à mão", () => {
  test("a linha SOBRE a divisa é testada de frente, não via desenhada", () => {
    const e = lerFixture("geo-antonina");
    const { desenhadas, testadasDeFrente } = linhasDaEntrada(e);
    expect(testadasDeFrente).toHaveLength(1);
    expect(desenhadas).toHaveLength(0);
  });

  test("uma linha no MIOLO da gleba é via desenhada à mão", () => {
    const e = lerFixture("geo-antonina");
    const anel = e.gleba.anel;
    const centro = anel.reduce(
      (s, p) => ({ x: s.x + p.x / anel.length, y: s.y + p.y / anel.length }),
      { x: 0, y: 0 },
    );
    const inventada: EntradaMinima = {
      ...e,
      atracoes: [
        {
          id: "T9",
          tipo: "via_existente",
          geometria: { tipo: "linha", pontos: [centro, { x: centro.x + 40, y: centro.y + 40 }] },
        } as never,
      ],
    };
    const { desenhadas, testadasDeFrente } = linhasDaEntrada(inventada);
    expect(desenhadas).toHaveLength(1);
    expect(testadasDeFrente).toHaveLength(0);
  });

  test("sem via desenhada, a aderência é null — e null não é zero (D23)", () => {
    for (const id of ["ensaio-47ha", "geo-antonina"]) {
      const a = aderenciaAViaDesenhada(lerFixture(id), []);
      expect(a.fracao).toBeNull();
    }
  });

  test("com via desenhada e uma via gerada em cima dela, a aderência é 1", () => {
    const e = lerFixture("geo-antonina");
    const anel = e.gleba.anel;
    const centro = anel.reduce(
      (s, p) => ({ x: s.x + p.x / anel.length, y: s.y + p.y / anel.length }),
      { x: 0, y: 0 },
    );
    const linha = [centro, { x: centro.x + 100, y: centro.y }];
    const com: EntradaMinima = {
      ...e,
      atracoes: [{ id: "T9", tipo: "via_existente", geometria: { tipo: "linha", pontos: linha } } as never],
    };
    expect(aderenciaAViaDesenhada(com, [{ pontos: linha, largura_m: 10 }]).fracao).toBeCloseTo(1, 6);
    // E uma via a 60 m de distância não adere a nada.
    const longe = [{ x: centro.x, y: centro.y + 60 }, { x: centro.x + 100, y: centro.y + 60 }];
    expect(aderenciaAViaDesenhada(com, [{ pontos: longe, largura_m: 10 }]).fracao).toBeCloseTo(0, 6);
  });

  test("lote com ARESTA na testada conta; lote que só toca com um canto, não", () => {
    const testada: P[][] = [[{ x: 0, y: 0 }, { x: 100, y: 0 }]];
    const deFrente = { pontos: [{ x: 10, y: 0 }, { x: 25, y: 0 }, { x: 25, y: 24 }, { x: 10, y: 24 }] };
    const soUmCanto = { pontos: [{ x: 60, y: 0 }, { x: 80, y: 30 }, { x: 50, y: 30 }] };
    const r = lotesNaTestadaDeFrente([deFrente, soUmCanto], testada);
    expect(r).not.toBeNull();
    expect(r!.lotes).toBe(1);
    expect(r!.comprimentoDaTestada_m).toBeCloseTo(100, 6);
  });

  test("sem testada de frente, a medida é null", () => {
    expect(lotesNaTestadaDeFrente([{ pontos: RETANGULO }], [])).toBeNull();
  });
});

describe("a comparação só vale com as mesmas cinco glebas e os mesmos parâmetros", () => {
  const CINCO: EntradaMinima[] = [
    glebaDoLab("completo"),
    glebaDoLab("sintetico-50ha-ondulado"),
    glebaDoLab("sintetico-10ha-plano"),
    lerFixture("ensaio-47ha"),
    lerFixture("geo-antonina"),
  ];

  test("as cinco declaram exatamente os mesmos parâmetros", () => {
    const assinatura = JSON.stringify(CINCO[0]!.parametros);
    for (const e of CINCO) expect(JSON.stringify(e.parametros)).toBe(assinatura);
  });

  test("as cinco são do contrato 1, em metros, e têm anel fechável", () => {
    for (const e of CINCO) {
      expect(e.archilly.versao).toBe("1");
      expect(e.crs.unidade).toBe("m");
      expect(e.gleba.anel.length).toBeGreaterThanOrEqual(3);
    }
  });

  test("quatro das cinco não têm atração nenhuma — e é isso que a tabela diz", () => {
    const comAtracao = CINCO.filter((e) => (e.atracoes?.length ?? 0) > 0);
    expect(comAtracao).toHaveLength(1);
  });
});
