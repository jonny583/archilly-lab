/**
 * Os testes da régua de forma. (LAB-16)
 *
 * ```sh
 * bun test tests/forma.test.ts
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **girar o lote não pode custar nada**: um retângulo girado 37° dá
 *   irregularidade **zero**. Pela régua velha, dos eixos, ele dá 0,5 — e era
 *   isso que fazia 754 de 776 lotes "irregulares" serem retângulos;
 * - **o arco é um lado, não quarenta**: uma testada curva de 49 vértices tem de
 *   sair como UM lado, e marcado como curvo. Foi o achatamento de um arco em
 *   reta que fez a primeira classificação chamar de "retângulo" um lote que
 *   perdia 10 % da caixa;
 * - **os três cortes saem sempre**: publicar um só esconde que a resposta
 *   depende dele;
 * - **sem lote, tudo `null`** — nunca zero (D23).
 */
import { describe, expect, test } from "bun:test";

import type { P } from "../src/motores/comum.ts";
import {
  CORTES_DE_FORMA,
  classeDaForma,
  distribuicaoDeForma,
  ladosDoAnel,
  perfilDeForma,
} from "../src/forma.ts";

/** Gira um polígono em torno da origem. */
function girar(anel: P[], graus: number): P[] {
  const a = (graus * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return anel.map((p) => ({ x: p.x * c - p.y * s, y: p.x * s + p.y * c }));
}

const RETANGULO: P[] = [
  { x: 0, y: 0 },
  { x: 30, y: 0 },
  { x: 30, y: 12 },
  { x: 0, y: 12 },
];

describe("girar o lote não custa nada", () => {
  test("o retângulo girado 37° continua com irregularidade zero", () => {
    const g = perfilDeForma(girar(RETANGULO, 37));
    expect(g.irregularidade).toBeCloseTo(0, 6);
    expect(g.classe).toBe("retângulo");
  });

  test("e a régua VELHA o pune — é por isso que ela continua publicada ao lado", () => {
    const g = perfilDeForma(girar(RETANGULO, 37));
    expect(g.irregularidadeEixos).toBeGreaterThan(0.3);
  });

  test("girar de 0° a 90° não muda nada na régua justa", () => {
    for (let a = 0; a <= 90; a += 7.5) {
      expect(perfilDeForma(girar(RETANGULO, a)).irregularidade).toBeCloseTo(0, 6);
    }
  });
});

describe("os lados, e o arco", () => {
  test("o retângulo tem quatro lados, nenhum curvo", () => {
    const p = perfilDeForma(RETANGULO);
    expect(p.lados).toBe(4);
    expect(p.ladosCurvos).toBe(0);
  });

  test("vértice no meio de um lado reto não vira canto", () => {
    const comMeio: P[] = [
      { x: 0, y: 0 },
      { x: 15, y: 0 },
      { x: 30, y: 0 },
      { x: 30, y: 12 },
      { x: 0, y: 12 },
    ];
    expect(perfilDeForma(comMeio).lados).toBe(4);
    expect(perfilDeForma(comMeio).classe).toBe("retângulo");
  });

  test("a testada curva sai como UM lado, e marcado como curvo", () => {
    // Um lote de 30 m com a frente em arco de 40 m de raio, descrita por 46
    // vértices — que é a ordem de grandeza do que os motores entregam.
    const frente: P[] = [];
    for (let i = 0; i <= 45; i++) {
      const t = -0.35 + (0.7 * i) / 45;
      frente.push({ x: 40 * Math.sin(t), y: 40 * Math.cos(t) - 40 });
    }
    const anel: P[] = [
      ...frente,
      { x: frente[frente.length - 1]!.x, y: frente[frente.length - 1]!.y + 25 },
      { x: frente[0]!.x, y: frente[0]!.y + 25 },
    ];
    const p = perfilDeForma(anel);
    expect(p.verticesCrus).toBe(48);
    expect(p.lados).toBe(4);
    expect(p.ladosCurvos).toBe(1);
    expect(p.classe).toContain("lado(s) curvo(s)");
    // E o que importa: ela NÃO é confundida com um retângulo perfeito.
    expect(p.irregularidade).toBeGreaterThan(0.01);
  });

  test("o trapézio é trapézio, e o pentágono é pentágono", () => {
    const trapezio: P[] = [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 26, y: 12 },
      { x: 0, y: 12 },
    ];
    expect(classeDaForma(ladosDoAnel(trapezio))).toBe("trapézio");

    const pentagono: P[] = [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 30, y: 8 },
      { x: 22, y: 12 },
      { x: 0, y: 12 },
    ];
    expect(classeDaForma(ladosDoAnel(pentagono))).toBe("pentágono");
  });

  test("nenhuma dessas palavras é um juízo — trapézio não quer dizer ruim", () => {
    // Fixa a intenção: a classe descreve a forma e não ordena nada. Se alguém
    // acrescentar "ruim" ou "irregular" ao vocabulário, este teste morde.
    const vocabulario = [
      classeDaForma(ladosDoAnel(RETANGULO)),
      classeDaForma(ladosDoAnel([{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 26, y: 12 }, { x: 0, y: 12 }])),
    ];
    for (const v of vocabulario) {
      expect(v).not.toContain("irregular");
      expect(v).not.toContain("ruim");
    }
  });
});

describe("a distribuição", () => {
  test("publica os três cortes, sempre", () => {
    const d = distribuicaoDeForma([RETANGULO, girar(RETANGULO, 20)]);
    for (const c of CORTES_DE_FORMA) expect(d.acimaDe[String(c)]).toBeDefined();
    expect(Object.keys(d.acimaDe)).toHaveLength(3);
  });

  test("o corte muda a resposta, e é por isso que ele não pode ficar escondido", () => {
    // Três lotes: um retângulo, um trapézio que perde 3,3 % da caixa e um que
    // perde 13,3 %. Entre o corte de 1 % e o de 10 %, a resposta cai de 2 para 1.
    const trapezio = (recuo: number): P[] => [
      { x: 0, y: 0 },
      { x: 30, y: 0 },
      { x: 30 - recuo, y: 12 },
      { x: recuo, y: 12 },
    ];
    const d = distribuicaoDeForma([RETANGULO, trapezio(1), trapezio(4)]);
    expect(d.acimaDe["0.01"]).toBe(2);
    expect(d.acimaDe["0.05"]).toBe(1);
    expect(d.acimaDe["0.1"]).toBe(1);
  });

  test("sem lote nenhum, tudo sai null — nunca zero", () => {
    const d = distribuicaoDeForma([]);
    expect(d.lotes).toBe(0);
    expect(d.mediana).toBeNull();
    expect(d.p90).toBeNull();
    expect(d.maxima).toBeNull();
  });

  test("conta o que a contagem sozinha não conta: a composição e os curvos", () => {
    const d = distribuicaoDeForma([RETANGULO, girar(RETANGULO, 37)]);
    expect(d.porClasse["retângulo"]).toBe(2);
    expect(d.comLadoCurvo).toBe(0);
    expect(d.area_m2).toBeCloseTo(720, 3);
  });
});
