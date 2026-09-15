/**
 * Os testes do LAB-04 — o esqueleto reto e o loteamento da quadra.
 *
 * ```sh
 * bun test
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **os dois casos do oráculo**, que é o que o prompt pediu. O quadrado e o
 *   retângulo têm esqueleto conhecido de cor — um nó no centro, e um segmento
 *   entre dois nós — e o **L** tem o que quadrado nenhum tem: um canto reflexo,
 *   que é onde uma implementação ingênua erra. Os três já pegaram defeito de
 *   verdade nesta esteira (evento simultâneo, evento de vértice, faces
 *   trocadas);
 * - **a propriedade que vale para QUALQUER polígono**: as faces são uma
 *   partição, então elas somam a área do anel. Foi este teste que mostrou que
 *   `ladoEsq` e `ladoDir` estavam cruzados — as faces saíam em gravata e
 *   somavam metade da área;
 * - **a simplificação**, que é obrigatória e não enfeite: ela tem de matar
 *   vértice colinear e aresta de comprimento zero sem mexer na forma;
 * - **o que o loteamento recusa**: quadra sem rua não vira lote nenhum, e
 *   nenhum lote sai fora dos parâmetros da gleba;
 * - **o recuo do meio-fio**, que é a lição que o Validator do Generate deu:
 *   lote nenhum pode encostar no eixo da via.
 */
import { describe, expect, test } from "bun:test";

import { areaComSinal, esqueletoReto, offsetInterno, simplificar, type P } from "../src/esqueleto/esqueleto.ts";
import { lotearQuadra, type EixoDeVia, type ParametrosDeLote } from "../src/lotear.ts";

const area = (anel: P[]) => Math.abs(areaComSinal(anel));
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);

/** Quadrado de 100 m, anti-horário. */
const QUADRADO: P[] = [
  { x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 },
];

/**
 * **O oráculo, caso 1:** retângulo 60 × 30.
 *
 * Nós internos em (15,15) e (45,15), offset 15; a frente de onda em 5 devolve
 * `[(5,5), (55,5), (55,25), (5,25)]`. Não é número escolhido por mim: são as
 * duas implementações independentes do `STRAIGHT_SKELETON_ANALYSIS.md`, §4.3 e
 * §4.4, concordando — uma em Rust com aritmética inteira exata, outra em outra
 * linguagem. É por isso que ele serve de oráculo.
 */
const RETANGULO: P[] = [
  { x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: 30 }, { x: 0, y: 30 },
];

/**
 * **O oráculo, caso 2:** o L — 60 × 60 com um recorte de 30 × 30.
 *
 * Os mesmos dois nós do retângulo, **mais um** em (15,45), também no offset 15;
 * a frente de onda em 5 devolve `[(5,5), (55,5), (55,25), (25,25), (25,55),
 * (5,55)]`, com o canto reflexo tratado certo — que é onde recuo ingênuo falha.
 */
const ELE: P[] = [
  { x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: 30 },
  { x: 30, y: 30 }, { x: 30, y: 60 }, { x: 0, y: 60 },
];

/** Os nós de um esqueleto, ordenados, para comparar com o oráculo. */
function nosOrdenados(nos: { p: P }[]): [number, number][] {
  return nos
    .map((n) => [Number(n.p.x.toFixed(3)), Number(n.p.y.toFixed(3))] as [number, number])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

/** Um anel, rodado para começar no vértice mais perto da origem, para comparar. */
function anelNormalizado(anel: P[]): [number, number][] {
  let i0 = 0;
  for (let i = 1; i < anel.length; i++) {
    const a = anel[i]!;
    const b = anel[i0]!;
    if (a.x + a.y < b.x + b.y) i0 = i;
  }
  return anel
    .map((_, i) => anel[(i0 + i) % anel.length]!)
    .map((p) => [Number(p.x.toFixed(3)), Number(p.y.toFixed(3))] as [number, number]);
}

describe("esqueleto reto · o oráculo", () => {
  test("quadrado de 100 m: um nó só, no centro, no offset 50", () => {
    const e = esqueletoReto(QUADRADO);
    expect(e.confiavel).toBe(true);
    expect(e.nos).toHaveLength(1);
    expect(dist(e.nos[0]!.p, { x: 50, y: 50 })).toBeLessThan(1e-3);
    expect(e.nos[0]!.offset_m).toBeCloseTo(50, 3);
    // Quatro arestas, quatro faces, e cada face é um triângulo de 2500 m².
    expect(e.faces).toHaveLength(4);
    for (const f of e.faces) expect(area(f)).toBeCloseTo(2500, 3);
  });

  test("ORÁCULO 1 · retângulo 60 × 30: nós em (15,15) e (45,15), offset 15", () => {
    // O defeito que este caso pegou: a esteira processava um evento por vez e
    // devolvia UM nó, porque os dois nascem no mesmo instante.
    const e = esqueletoReto(RETANGULO);
    expect(e.confiavel).toBe(true);
    expect(nosOrdenados(e.nos)).toEqual([[15, 15], [45, 15]]);
    for (const n of e.nos) expect(n.offset_m).toBeCloseTo(15, 3);
  });

  test("ORÁCULO 1 · a frente de onda do retângulo em 5 é (5,5)-(55,5)-(55,25)-(5,25)", () => {
    const laco = offsetInterno(RETANGULO, 5);
    expect(laco).toHaveLength(1);
    expect(anelNormalizado(laco[0]!)).toEqual([[5, 5], [55, 5], [55, 25], [5, 25]]);
  });

  test("ORÁCULO 2 · o L tem os mesmos dois nós MAIS um em (15,45), offset 15", () => {
    // O canto reflexo é o caso que separa esqueleto reto de recuo ingênuo. Ele
    // custou dois defeitos: o evento de divisão e, depois, o evento de vértice.
    const e = esqueletoReto(ELE);
    expect(e.confiavel).toBe(true);
    expect(e.faces).toHaveLength(6);
    expect(nosOrdenados(e.nos)).toEqual([[15, 15], [15, 45], [45, 15]]);
    for (const n of e.nos) expect(n.offset_m).toBeCloseTo(15, 3);
  });

  test("ORÁCULO 2 · a frente de onda do L em 5 trata o canto reflexo certo", () => {
    const laco = offsetInterno(ELE, 5);
    expect(laco).toHaveLength(1);
    expect(anelNormalizado(laco[0]!)).toEqual([
      [5, 5], [55, 5], [55, 25], [25, 25], [25, 55], [5, 55],
    ]);
  });
});

describe("esqueleto reto · a propriedade", () => {
  // Uma face por aresta, e as faces são uma PARTIÇÃO: nem sobra nem falta.
  const casos: [string, P[]][] = [
    ["quadrado", QUADRADO],
    ["retângulo", RETANGULO],
    ["L reflexo", ELE],
    ["triângulo", [{ x: 0, y: 0 }, { x: 60, y: 0 }, { x: 30, y: 45 }]],
    ["trapézio", [{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 60, y: 30 }, { x: 20, y: 30 }]],
  ];
  for (const [nome, anel] of casos) {
    test(`${nome}: as faces somam a área do anel`, () => {
      const e = esqueletoReto(anel);
      expect(e.confiavel).toBe(true);
      expect(e.faces).toHaveLength(anel.length);
      const soma = e.faces.reduce((s, f) => s + area(f), 0);
      expect(soma).toBeCloseTo(area(anel), 3);
      // E nenhuma face é vazia ou invertida.
      for (const f of e.faces) {
        expect(f.length).toBeGreaterThanOrEqual(3);
        expect(areaComSinal(f)).toBeGreaterThan(0);
      }
    });
  }

  test("esqueleto interrompido se DECLARA, em vez de entregar face aberta", () => {
    // Orçamento impossível: a resposta certa é "não confie", não uma face
    // absurda. Uma face aberta já produziu erro de área de 5×10¹⁰ %.
    const e = esqueletoReto(ELE, { orcamento_ms: 0 });
    expect(e.confiavel).toBe(false);
    expect(e.avisos.length).toBeGreaterThan(0);
  });
});

describe("offset interno", () => {
  test("quadrado recuado de 10 m é o quadrado de 80 m", () => {
    const [anel, ...resto] = offsetInterno(QUADRADO, 10);
    expect(resto).toHaveLength(0);
    expect(area(anel!)).toBeCloseTo(6400, 2);
  });

  test("recuo maior que a quadra devolve nada, não devolve absurdo", () => {
    expect(offsetInterno(QUADRADO, 60)).toHaveLength(0);
  });
});

describe("simplificar", () => {
  test("mata vértice colinear e aresta de comprimento zero, sem mexer na forma", () => {
    const sujo: P[] = [
      { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 },
      { x: 100, y: 100 }, { x: 50, y: 100 }, { x: 0, y: 100 },
    ];
    const limpo = simplificar(sujo, 0.01);
    expect(limpo).toHaveLength(4);
    expect(area(limpo)).toBeCloseTo(area(QUADRADO), 6);
  });

  test("a tolerância é teto de desvio: o arco vira corda e não some", () => {
    // Um "arco" de 1 cm de flecha some a 25 cm, e não some a 1 mm.
    const comArco: P[] = [
      { x: 0, y: 0 }, { x: 50, y: 0.01 }, { x: 100, y: 0 },
      { x: 100, y: 100 }, { x: 0, y: 100 },
    ];
    expect(simplificar(comArco, 0.25)).toHaveLength(4);
    expect(simplificar(comArco, 0.001)).toHaveLength(5);
  });
});

describe("lotear a quadra", () => {
  const PARAMS: ParametrosDeLote = {
    areaMinLote_m2: 200,
    areaAlvoLote_m2: 360,
    areaMaxLote_m2: 600,
    testadaMinLote_m: 10,
  };
  /** Uma rua de 12 m de caixa correndo pela aresta de baixo do quadrado. */
  const RUA_DE_BAIXO: EixoDeVia[] = [
    { pontos: [{ x: -20, y: 0 }, { x: 120, y: 0 }], largura_m: 12 },
  ];

  test("quadra sem rua nenhuma não vira lote nenhum — e isso não é erro", () => {
    const r = lotearQuadra(QUADRADO, PARAMS, []);
    expect(r.lotes).toHaveLength(0);
    expect(r.arestasDeFrente).toBe(0);
    expect(r.arestasSemRua).toBe(4);
    expect(r.puladaPorEsqueleto).toBe(false);
  });

  test("com rua numa aresta só, os lotes saem todos por ela", () => {
    const r = lotearQuadra(QUADRADO, PARAMS, RUA_DE_BAIXO);
    expect(r.arestasDeFrente).toBe(1);
    expect(r.lotes.length).toBeGreaterThan(0);
    for (const l of r.lotes) expect(l.arestaDeFrente).toBe(0);
  });

  test("nenhum lote sai fora dos parâmetros da gleba", () => {
    const r = lotearQuadra(QUADRADO, PARAMS, RUA_DE_BAIXO);
    for (const l of r.lotes) {
      expect(l.area_m2).toBeGreaterThanOrEqual(PARAMS.areaMinLote_m2);
      expect(l.area_m2).toBeLessThanOrEqual(PARAMS.areaMaxLote_m2);
      expect(l.testada_m).toBeGreaterThanOrEqual(PARAMS.testadaMinLote_m);
    }
  });

  test("o lote começa no MEIO-FIO, nunca no eixo da via", () => {
    // A lição do Validator do Generate: a borda da quadra do Symbios é o eixo,
    // e lote encostado nela deu 369 de 369 `via-sobre-lote`.
    const r = lotearQuadra(QUADRADO, PARAMS, RUA_DE_BAIXO);
    expect(r.lotes.length).toBeGreaterThan(0);
    for (const l of r.lotes) {
      for (const p of l.pontos) expect(p.y).toBeGreaterThanOrEqual(6 - 1e-6);
    }
  });

  test("os lotes de uma quadra não se sobrepõem, porque cada um mora na sua face", () => {
    const quatroRuas: EixoDeVia[] = [
      { pontos: [{ x: -20, y: 0 }, { x: 120, y: 0 }], largura_m: 12 },
      { pontos: [{ x: 100, y: -20 }, { x: 100, y: 120 }], largura_m: 12 },
      { pontos: [{ x: 120, y: 100 }, { x: -20, y: 100 }], largura_m: 12 },
      { pontos: [{ x: 0, y: 120 }, { x: 0, y: -20 }], largura_m: 12 },
    ];
    const r = lotearQuadra(QUADRADO, PARAMS, quatroRuas);
    expect(r.arestasDeFrente).toBe(4);
    expect(r.lotes.length).toBeGreaterThan(4);
    // A soma das áreas não pode passar da quadra: se passasse, havia invasão.
    const soma = r.lotes.reduce((s, l) => s + l.area_m2, 0);
    expect(soma).toBeLessThanOrEqual(area(QUADRADO));
    expect(r.aproveitamento).toBeLessThanOrEqual(1);
  });

  test("é determinístico: a mesma quadra devolve os mesmos lotes", () => {
    const a = lotearQuadra(ELE, PARAMS, RUA_DE_BAIXO);
    const b = lotearQuadra(ELE, PARAMS, RUA_DE_BAIXO);
    expect(JSON.stringify(b.lotes)).toBe(JSON.stringify(a.lotes));
  });
});
