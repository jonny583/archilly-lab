/**
 * Os testes da régua de rampa. (LAB-21)
 *
 * ```sh
 * bun test tests/rampa.test.ts
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **a rampa da rua não depende de como o motor picou a polilinha.** É o
 *   defeito que deu 1053 %: as vias do Symbios têm 5 353 segmentos abaixo de
 *   1 m, e medir a rampa de um trecho de 15 cm contra uma grade de 5 m mede a
 *   grade, não a rua. O teste passa a MESMA via em duas discretizações e exige
 *   o mesmo resultado;
 * - **cruzamento é interseção, não encontro de pontas.** Numa malha ortogonal
 *   as ruas se cruzam no meio, e a primeira passada devolveu ZERO cruzamentos
 *   em quinze vias;
 * - **sem relevo, tudo `null` com o motivo escrito** — nunca zero (D23);
 * - **os quatro cortes saem sempre**, e nenhum deles é limite legal de rampa de
 *   via: esse limite não existe na família (ver o cabeçalho de `src/rampa.ts`).
 */
import { describe, expect, test } from "bun:test";

import type { MapaDeAlturas } from "@symbios/alturas.ts";

import type { P } from "../src/motores/comum.ts";
import {
  CORTES_DE_RAMPA,
  CORTE_DA_LEI_6766_TERRENO_PCT,
  caminhar,
  perfilDeRampa,
} from "../src/rampa.ts";

/**
 * Um mapa de cotas de mentira, com rampa constante conhecida.
 *
 * A cota cresce `inclinacao` metros por metro em x, então qualquer trecho
 * horizontal tem exatamente `100 × inclinacao` por cento de rampa. Com resposta
 * conhecida, o teste mede a régua e não o terreno.
 */
function mapaInclinado(inclinacao: number, celula_m = 5, lado = 60): MapaDeAlturas {
  const alturas = new Float32Array(lado * lado);
  const dentro = new Uint8Array(lado * lado).fill(1);
  for (let iz = 0; iz < lado; iz++) {
    for (let ix = 0; ix < lado; ix++) {
      alturas[iz * lado + ix] = ix * celula_m * inclinacao;
    }
  }
  return {
    nx: lado, ny: lado, celula_m, alturas, dentro,
    origemMundo: { x: 0, y: 0 },
    fracaoFora: 0, cotaMin: 0, cotaMax: lado * celula_m * inclinacao,
  } as unknown as MapaDeAlturas;
}

/** Pica uma reta em segmentos de `passo` metros — a discretização do motor. */
function picar(de: P, para: P, passo: number): P[] {
  const d = Math.hypot(para.x - de.x, para.y - de.y);
  const n = Math.max(1, Math.ceil(d / passo));
  const saida: P[] = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    saida.push({ x: de.x + (para.x - de.x) * t, y: de.y + (para.y - de.y) * t });
  }
  return saida;
}

const DE: P = { x: 20, y: 100 };
const PARA: P = { x: 220, y: 100 };

describe("caminhar a via por comprimento de arco", () => {
  test("os passos são iguais, e o último marco é a ponta da via", () => {
    const marcos = caminhar([DE, PARA], 10);
    expect(marcos[0]!.s).toBe(0);
    expect(marcos[marcos.length - 1]!.s).toBeCloseTo(200, 6);
    for (let i = 1; i < marcos.length - 1; i++) {
      expect(marcos[i]!.s - marcos[i - 1]!.s).toBeCloseTo(10, 6);
    }
  });

  test("atravessa vértice sem parar nele", () => {
    // A mesma reta, com um vértice a cada 0,5 m: os marcos têm de ser os mesmos.
    const a = caminhar([DE, PARA], 10).map((m) => Number(m.s.toFixed(6)));
    const b = caminhar(picar(DE, PARA, 0.5), 10).map((m) => Number(m.s.toFixed(6)));
    expect(b).toEqual(a);
  });

  test("via de menos de dois pontos não caminha", () => {
    expect(caminhar([DE], 10)).toEqual([]);
  });
});

describe("a rampa da rua não depende da discretização do motor", () => {
  const mapa = mapaInclinado(0.1); // 10 % em toda parte

  test("a reta de dois pontos dá a rampa do terreno", () => {
    const p = perfilDeRampa([{ id: "v1", pontos: [DE, PARA] }], mapa);
    expect(p.medida).toBe(true);
    expect(p.rampaMediaPonderada_pct!).toBeCloseTo(10, 1);
    expect(p.rampaPior_pct!).toBeCloseTo(10, 1);
  });

  test("A MESMA via picada em segmentos de 15 cm dá O MESMO resultado", () => {
    // Era aqui que a primeira passada dava 1053 %: o trecho culpado tinha 15 cm.
    const grossa = perfilDeRampa([{ id: "v1", pontos: [DE, PARA] }], mapa);
    const fina = perfilDeRampa([{ id: "v1", pontos: picar(DE, PARA, 0.15) }], mapa);
    expect(fina.rampaPior_pct).toBeCloseTo(grossa.rampaPior_pct!, 1);
    expect(fina.rampaMediaPonderada_pct).toBeCloseTo(grossa.rampaMediaPonderada_pct!, 1);
    expect(fina.comprimentoTotal_m).toBeCloseTo(grossa.comprimentoTotal_m!, 1);
  });

  test("nenhuma discretização produz rampa fisicamente impossível", () => {
    for (const passo of [0.1, 0.47, 1, 5, 37]) {
      const p = perfilDeRampa([{ id: "v1", pontos: picar(DE, PARA, passo) }], mapa);
      // O terreno é 10 %; nada pode sair acima de uns 15 %.
      expect(p.rampaPior_pct!, `picada em ${passo} m`).toBeLessThan(15);
    }
  });
});

describe("os cruzamentos", () => {
  const mapa = mapaInclinado(0.02);

  test("duas vias que se cruzam NO MEIO dão um cruzamento", () => {
    const p = perfilDeRampa(
      [
        { id: "h", pontos: [{ x: 20, y: 100 }, { x: 220, y: 100 }] },
        { id: "v", pontos: [{ x: 120, y: 20 }, { x: 120, y: 180 }] },
      ],
      mapa,
    );
    expect(p.cruzamentos).toBe(1);
    expect(p.piorCruzamento!.vias).toEqual(["h", "v"]);
  });

  test("duas vias paralelas não se cruzam", () => {
    const p = perfilDeRampa(
      [
        { id: "a", pontos: [{ x: 20, y: 100 }, { x: 220, y: 100 }] },
        { id: "b", pontos: [{ x: 20, y: 140 }, { x: 220, y: 140 }] },
      ],
      mapa,
    );
    expect(p.cruzamentos).toBe(0);
    expect(p.piorCruzamento).toBeNull();
  });

  test("a malha de 3 × 3 dá nove cruzamentos", () => {
    const vias = [
      ...[60, 120, 180].map((y) => ({ id: `h${y}`, pontos: [{ x: 20, y }, { x: 220, y }] })),
      ...[60, 120, 180].map((x) => ({ id: `v${x}`, pontos: [{ x, y: 20 }, { x, y: 220 }] })),
    ];
    expect(perfilDeRampa(vias, mapa).cruzamentos).toBe(9);
  });
});

describe("o que não foi medido sai declarado", () => {
  test("sem mapa de cotas, tudo null e o motivo escrito", () => {
    const p = perfilDeRampa([{ id: "v1", pontos: [DE, PARA] }], null);
    expect(p.medida).toBe(false);
    expect(p.porQueNaoMedida).toContain("não tem duas cotas");
    expect(p.rampaPior_pct).toBeNull();
    expect(p.trechosAcimaDe).toBeNull();
    expect(p.cruzamentos).toBeNull();
  });

  test("sem via nenhuma, idem", () => {
    const p = perfilDeRampa([], mapaInclinado(0.1));
    expect(p.medida).toBe(false);
    expect(p.porQueNaoMedida).toContain("via nenhuma");
  });
});

describe("os cortes", () => {
  test("os quatro saem sempre, em trechos, metros e cruzamentos", () => {
    const p = perfilDeRampa([{ id: "v1", pontos: [DE, PARA] }], mapaInclinado(0.1));
    for (const c of CORTES_DE_RAMPA) {
      expect(p.trechosAcimaDe![String(c)]).toBeDefined();
      expect(p.metrosAcimaDe![String(c)]).toBeDefined();
      expect(p.cruzamentosAcimaDe![String(c)]).toBeDefined();
    }
  });

  test("os metros acima de um corte nunca passam do comprimento total", () => {
    const p = perfilDeRampa([{ id: "v1", pontos: [DE, PARA] }], mapaInclinado(0.25));
    for (const c of CORTES_DE_RAMPA) {
      expect(p.metrosAcimaDe![String(c)]!).toBeLessThanOrEqual(p.comprimentoTotal_m! + 0.01);
    }
  });

  test("o corte de 30 % é o da Lei 6.766 — e é do TERRENO, não do greide", () => {
    expect(CORTE_DA_LEI_6766_TERRENO_PCT).toBe(30);
    expect(CORTES_DE_RAMPA).toContain(CORTE_DA_LEI_6766_TERRENO_PCT);
  });
});
