/**
 * Os testes do LAB-17 — a via desenhada à mão, e a D69.
 *
 * ```sh
 * bun test tests/vias-desenhadas.test.ts
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **a via desenhada não sai da gleba**: o traçado imposto é aparado, senão a
 *   aderência mediria contra uma linha que motor nenhum poderia seguir sem
 *   violar a divisa;
 * - **a via que ATRAVESSA a gleba não é testada de frente**: as duas pontas
 *   dela ficam na divisa, e foi por olhar só as pontas que a primeira passada
 *   do LAB-17 pôs **três das quatro** vias desenhadas de `antonina-com-via` no
 *   balde errado. A régua amostra ao longo, e o teste guarda isso;
 * - **a D69 acha a travessia** e a marca com a frase que a tela mostra;
 * - **a obra sai `null`**: ponte ou bueiro depende da vazão, que não chega no
 *   contrato. Zero seria medição; `null` é "não medido" (D23);
 * - **as duas metades não verificáveis saem SEMPRE**, com ou sem travessia.
 *   Regra que só aparece quando é violada é regra que o leitor supõe cumprida.
 */
import { describe, expect, test } from "bun:test";

import { linhasDaEntrada, type P } from "../src/motores/comum.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import { comViasDesenhadas, tracadoImposto } from "../src/vias-desenhadas.ts";
import {
  MARCA_DA_TRAVESSIA,
  RAIO_DA_NASCENTE_M,
  aplicarD69,
  naoVerificavelHoje,
} from "../src/travessia.ts";

/** Um quadrado de 400 m de lado, e o mínimo de entrada em volta dele. */
const QUADRADO: P[] = [
  { x: 0, y: 0 },
  { x: 400, y: 0 },
  { x: 400, y: 400 },
  { x: 0, y: 400 },
];

function entradaDe(anel: P[], restricoes: EntradaMinima["restricoes"] = []): EntradaMinima {
  return {
    archilly: { schema: "archilly-motor-entrada", versao: "1" },
    projeto: { id: "teste", nome: "teste" },
    crs: { codigo: "EPSG:31982", unidade: "m", origemGeografica: null },
    gleba: { id: "g", nome: "g", anel, furos: [], area_m2: 160000 },
    relevo: null,
    restricoes,
    atracoes: [],
    acessos: [],
    parametros: {},
  };
}

describe("o traçado imposto", () => {
  test("dá uma principal e as secundárias pedidas", () => {
    const vias = tracadoImposto(QUADRADO, 3);
    expect(vias.filter((v) => v.papel === "principal")).toHaveLength(1);
    expect(vias.filter((v) => v.papel === "secundaria")).toHaveLength(3);
  });

  test("nenhum ponto dele cai fora da gleba", () => {
    // Uma gleba em L: a caixa envolvente sai do terreno em dois lugares, e é
    // justamente onde uma via não aparada iria parar.
    const ele: P[] = [
      { x: 0, y: 0 },
      { x: 400, y: 0 },
      { x: 400, y: 200 },
      { x: 200, y: 200 },
      { x: 200, y: 400 },
      { x: 0, y: 400 },
    ];
    for (const v of tracadoImposto(ele, 3)) {
      for (const p of v.pontos) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(400);
        expect(p.y).toBeLessThanOrEqual(400);
      }
    }
  });

  test("é o mesmo traçado toda vez — fixture não sorteia", () => {
    expect(tracadoImposto(QUADRADO, 3)).toEqual(tracadoImposto(QUADRADO, 3));
  });
});

describe("a via que atravessa a gleba não é testada de frente", () => {
  test("as quatro desenhadas entram como desenhadas, e nenhuma como testada", () => {
    const vias = tracadoImposto(QUADRADO, 3);
    const { desenhadas, testadasDeFrente } = linhasDaEntrada(comViasDesenhadas(entradaDe(QUADRADO), vias));
    expect(desenhadas).toHaveLength(4);
    expect(testadasDeFrente).toHaveLength(0);
  });

  test("a linha rente à divisa continua sendo testada de frente", () => {
    // Este é o outro lado da mesma régua: se amostrar ao longo tivesse quebrado
    // a distinção, ela cairia aqui.
    const rente = entradaDe(QUADRADO);
    rente.atracoes = [
      {
        id: "L1",
        tipo: "via_existente",
        nome: "Testada de frente",
        geometria: { tipo: "linha", pontos: [{ x: 0, y: 0 }, { x: 400, y: 0 }] },
      } as never,
    ];
    const { desenhadas, testadasDeFrente } = linhasDaEntrada(rente);
    expect(testadasDeFrente).toHaveLength(1);
    expect(desenhadas).toHaveLength(0);
  });
});

describe("a D69 aplicada", () => {
  /** Uma APP em faixa, atravessada no meio pela via principal. */
  const APP: EntradaMinima["restricoes"] = [
    {
      id: "R1",
      tipo: "app_hidrica",
      nome: "APP — curso d'água",
      desconta: true,
      geometria: {
        tipo: "poligono",
        aneis: [[
          { x: 180, y: 0 },
          { x: 220, y: 0 },
          { x: 220, y: 400 },
          { x: 180, y: 400 },
        ]],
      },
    },
  ];

  test("acha a travessia, mede o trecho dentro e põe a marca da tela", () => {
    const entrada = entradaDe(QUADRADO, APP);
    const r = aplicarD69(entrada, [{ id: "VD1", pontos: [{ x: 0, y: 200 }, { x: 400, y: 200 }] }], 12);
    expect(r.travessias).toHaveLength(1);
    expect(r.travessias[0]!.restricaoTipo).toBe("app_hidrica");
    expect(r.travessias[0]!.comprimento_m).toBeGreaterThan(35);
    expect(r.travessias[0]!.comprimento_m).toBeLessThan(45);
    expect(r.travessias[0]!.marca).toBe(MARCA_DA_TRAVESSIA);
  });

  test("a via que não toca a APP não vira travessia", () => {
    const entrada = entradaDe(QUADRADO, APP);
    const r = aplicarD69(entrada, [{ id: "VD9", pontos: [{ x: 0, y: 200 }, { x: 100, y: 200 }] }], 12);
    expect(r.travessias).toHaveLength(0);
    expect(r.itensDeCusto).toHaveLength(0);
  });

  test("o item de custo sai com obra null, e com a razão escrita", () => {
    const entrada = entradaDe(QUADRADO, APP);
    const r = aplicarD69(entrada, [{ id: "VD1", pontos: [{ x: 0, y: 200 }, { x: 400, y: 200 }] }], 12);
    expect(r.itensDeCusto).toHaveLength(1);
    expect(r.itensDeCusto[0]!.obra).toBeNull();
    expect(r.itensDeCusto[0]!.largura_m).toBe(12);
    expect(r.itensDeCusto[0]!.porQueSemObra.length).toBeGreaterThan(0);
  });

  test("sem caixa nos parâmetros a largura sai null, nunca um valor de fábrica", () => {
    const entrada = entradaDe(QUADRADO, APP);
    const r = aplicarD69(entrada, [{ id: "VD1", pontos: [{ x: 0, y: 200 }, { x: 400, y: 200 }] }], null);
    expect(r.itensDeCusto[0]!.largura_m).toBeNull();
  });
});

describe("o que a D69 pede e o contrato v1 não deixa verificar", () => {
  test("as duas metades saem mesmo na gleba sem restrição nenhuma", () => {
    const fora = naoVerificavelHoje(entradaDe(QUADRADO));
    expect(fora).toHaveLength(2);
    for (const f of fora) expect(f.oQueFaltaNoContrato.length).toBeGreaterThan(0);
  });

  test("a regra dos 50 m da nascente fica escrita, e marcada como não aplicável", () => {
    expect(RAIO_DA_NASCENTE_M).toBe(50);
    const nascente = naoVerificavelHoje(entradaDe(QUADRADO)).find((f) => f.regra.includes("nascente"));
    expect(nascente).toBeDefined();
    expect(nascente!.regra).toContain("50 m");
    expect(nascente!.oQueFaltaNoContrato).toContain("app_nascente");
  });

  test("saem junto com a travessia, e não só quando não há nenhuma", () => {
    const entrada = entradaDe(QUADRADO, [
      {
        id: "R1",
        tipo: "app_hidrica",
        nome: "APP",
        desconta: true,
        geometria: { tipo: "poligono", aneis: [[{ x: 180, y: 0 }, { x: 220, y: 0 }, { x: 220, y: 400 }, { x: 180, y: 400 }]] },
      },
    ]);
    const r = aplicarD69(entrada, [{ id: "VD1", pontos: [{ x: 0, y: 200 }, { x: 400, y: 200 }] }], 12);
    expect(r.travessias).toHaveLength(1);
    expect(r.naoVerificado).toHaveLength(2);
  });
});
