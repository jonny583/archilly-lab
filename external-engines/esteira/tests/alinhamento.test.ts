/**
 * O ALINHAMENTO À VIA DESENHADA, e as travas do número que eu publiquei sem
 * investigar. (LAB-32)
 *
 * ```sh
 * bun test tests/alinhamento.test.ts
 * ```
 *
 * # O que estes testes fixam, e por quê
 *
 * O LAB-30 entregou a `viaManual` ao Laboratório de Parcelamento e a aderência
 * medida em `antonina-com-via` **caiu de 17,4 % para 11,2 %**. Eu publiquei a
 * queda sem investigar. Medida, ela tem **duas** causas e nenhuma é "o motor
 * passou a desrespeitar a linha":
 *
 *   1. **o ranking do motor trocou de partido** — `ortogonal` (nota 0,6176) deu
 *      lugar a `espinha` (0,6318). Metade da queda é a comparação ter sido feita
 *      entre dois desenhos diferentes;
 *   2. **a régua do Lab mede uma coisa que o motor não promete.** O campo
 *      `viaManual` faz duas coisas no motor: a direção da linha vira o ângulo
 *      base do partido, e a faixa dela vira área bloqueada. Alinhar o partido
 *      **gira a rede toda**, e girar a rede tira eixos de cima das outras linhas
 *      desenhadas — então obediência entra na régua da aderência como queda.
 *
 * As travas, nesta ordem: a régua nova (unidade), a régua da faixa (e a
 * distinção que a primeira versão dela não fazia), a queda decomposta no mesmo
 * partido, e a declaração nova medida nos quatro motores.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import {
  aderenciaAViaDesenhada,
  alinhamentoAViaDesenhada,
  linhasDaEntrada,
  lotesNaFaixaDaVia,
} from "../src/motores/comum.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import { entradaDaPorta } from "../src/porta/porta.ts";
import { motorDoGenerate, motorDoParcelamento, separar } from "../src/porta/motores.ts";

const FIXTURES = join(import.meta.dirname, "..", "..", "..", "docs", "fixtures", "glebas-com-via-desenhada");
const SEMENTE = 20260913;
const CARIMBO = "2026-10-04T00:00:00.000Z";

type P = { x: number; y: number };

const ler = (id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, `${id}.entrada.json`), "utf8"));

const comprimento = (l: P[]) =>
  l.reduce((s, p, i) => (i === 0 ? 0 : s + Math.hypot(p.x - l[i - 1]!.x, p.y - l[i - 1]!.y)), 0);

/** A coluna vertebral que a ponte entrega: a mais longa das desenhadas. */
function colunaDe(v1: EntradaMinima): P[] {
  const { desenhadas } = linhasDaEntrada(v1);
  expect(desenhadas.length, "a fixture precisa ter via desenhada").toBeGreaterThan(0);
  return [...desenhadas].sort((a, b) => comprimento(b) - comprimento(a))[0]!;
}

function viasDaSaida(saida: unknown): { pontos: P[]; largura_m: number }[] {
  const s = saida as { vias?: { eixo?: P[]; pontos?: P[]; largura_m?: number; caixa_m?: number }[] } | null;
  return (s?.vias ?? [])
    .map((v) => ({ pontos: v.eixo ?? v.pontos ?? [], largura_m: v.largura_m ?? v.caixa_m ?? 10 }))
    .filter((v) => v.pontos.length >= 2);
}

/**
 * Uma rodada barata: UM partido, duas variantes. Confere-se que ela reproduz os
 * números da rodada cheia — 17,4 % e 14,0 % no ortogonal — para a economia não
 * custar a verdade.
 */
function rodada(v1: EntradaMinima, formato: string, coluna: P[] | null) {
  const r = rodarEsteira(v1 as unknown as EntradaV1, {
    semente: SEMENTE,
    variantes: 2,
    aparar: true,
    formatos: [formato as never],
    ...(coluna ? { viaManual: coluna } : {}),
  });
  return r.variantes.filter((v) => v.relatorio)[0] ?? null;
}

describe("a régua do alinhamento (LAB-32)", () => {
  const linha: P[] = [{ x: 0, y: 0 }, { x: 100, y: 0 }];

  test("eixo paralelo à linha conta inteiro; perpendicular não conta nada", () => {
    expect(alinhamentoAViaDesenhada(linha, [{ pontos: [{ x: 0, y: 50 }, { x: 100, y: 50 }] }], 5)).toBe(1);
    expect(alinhamentoAViaDesenhada(linha, [{ pontos: [{ x: 50, y: -50 }, { x: 50, y: 50 }] }], 5)).toBe(0);
  });

  test("direção de rua NÃO tem sentido: o eixo desenhado ao contrário conta igual", () => {
    // Sem o módulo 180 a régua reprovaria metade de cada grade ortogonal por
    // ela estar "ao contrário" — e o número sairia pela metade, calado.
    expect(alinhamentoAViaDesenhada(linha, [{ pontos: [{ x: 100, y: 7 }, { x: 0, y: 7 }] }], 5)).toBe(1);
  });

  test("a fração é PONDERADA pelo comprimento, não pela contagem de eixos", () => {
    const f = alinhamentoAViaDesenhada(
      linha,
      [
        { pontos: [{ x: 0, y: 0 }, { x: 300, y: 0 }] }, // 300 m paralelos
        { pontos: [{ x: 0, y: 0 }, { x: 0, y: 100 }] }, // 100 m perpendiculares
      ],
      5,
    );
    expect(f).toBeCloseTo(0.75, 6);
  });

  test("sem linha desenhada a régua devolve null, nunca zero (D23)", () => {
    expect(alinhamentoAViaDesenhada(null, [{ pontos: linha }], 5)).toBeNull();
  });
});

describe("a régua da faixa, e a distinção que a primeira versão dela não fazia (LAB-32)", () => {
  const linha: P[] = [{ x: 0, y: 0 }, { x: 100, y: 0 }];

  test("INVASÃO é o centro do lote dentro da faixa", () => {
    const emCima = { pontos: [{ x: 40, y: -3 }, { x: 60, y: -3 }, { x: 60, y: 3 }, { x: 40, y: 3 }] };
    expect(lotesNaFaixaDaVia(linha, [emCima], 6)).toEqual({ centroDentro: 1, soEncostam: 0 });
  });

  test("o lote que FAZ FRENTE para a faixa encosta nela de direito, e não é invasor", () => {
    // Esta é a trava do erro que eu quase publiquei: medindo por "tem vértice
    // dentro da faixa", este lote contaria como invasor, e o ortogonal daria
    // "27 → 34 lotes" — o contrário da verdade.
    const defronte = { pontos: [{ x: 40, y: 5 }, { x: 60, y: 5 }, { x: 60, y: 30 }, { x: 40, y: 30 }] };
    expect(lotesNaFaixaDaVia(linha, [defronte], 6)).toEqual({ centroDentro: 0, soEncostam: 1 });
  });

  test("lote longe da faixa não entra em nenhuma das duas contas", () => {
    const longe = { pontos: [{ x: 40, y: 200 }, { x: 60, y: 200 }, { x: 60, y: 230 }, { x: 40, y: 230 }] };
    expect(lotesNaFaixaDaVia(linha, [longe], 6)).toEqual({ centroDentro: 0, soEncostam: 0 });
  });
});

describe("a queda de 17,4 % para 11,2 %, decomposta (LAB-32, D127)", () => {
  const v1 = ler("antonina-com-via");
  const coluna = colunaDe(v1);

  test("no MESMO partido a queda é de 3,4 pp, não de 6,2 — o resto foi troca de desenho", () => {
    const sem = rodada(v1, "ortogonal", null);
    const com = rodada(v1, "ortogonal", coluna);
    expect(sem, "o ortogonal sem a via precisa passar no esquema").not.toBeNull();
    expect(com, "o ortogonal com a via precisa passar no esquema").not.toBeNull();

    const aSem = aderenciaAViaDesenhada(v1, viasDaSaida(sem!.saida)).fracao;
    const aCom = aderenciaAViaDesenhada(v1, viasDaSaida(com!.saida)).fracao;

    // Os dois números publicados no LAB-17 e no LAB-30, e o número que FALTAVA:
    // o 17,4 % era o ortogonal, o 11,2 % é a espinha, e no ortogonal a queda
    // real é 17,4 → 14,0.
    expect(aSem).toBeCloseTo(0.174, 3);
    expect(aCom).toBeCloseTo(0.14, 3);
  }, 120_000);

  test("o motor OBEDECE à direção da linha — e é isso que a régua da aderência leu como queda", () => {
    const sem = rodada(v1, "ortogonal", null);
    const com = rodada(v1, "ortogonal", coluna);
    const aSem = alinhamentoAViaDesenhada(coluna, viasDaSaida(sem!.saida), 10) ?? 0;
    const aCom = alinhamentoAViaDesenhada(coluna, viasDaSaida(com!.saida), 10) ?? 0;
    expect(aSem, "sem a via, nenhum eixo aponta para a direção dela").toBeLessThan(0.05);
    expect(aCom, "com a via, a maior parte do comprimento aponta para a direção dela").toBeGreaterThan(0.5);
  }, 120_000);

  test("a faixa da linha fica LIVRE de lote: invasores vão a zero", () => {
    const caixa = typeof v1.parametros.caixaPrincipal_m === "number" ? v1.parametros.caixaPrincipal_m : 10;
    const meia = Math.max(3, caixa / 2);
    const sem = rodada(v1, "ortogonal", null);
    const com = rodada(v1, "ortogonal", coluna);
    const fSem = lotesNaFaixaDaVia(coluna, (sem!.saida as { lotes: { pontos: P[] }[] }).lotes, meia)!;
    const fCom = lotesNaFaixaDaVia(coluna, (com!.saida as { lotes: { pontos: P[] }[] }).lotes, meia)!;
    expect(fSem.centroDentro, "sem a via havia lote com o centro em cima dela").toBeGreaterThan(0);
    expect(fCom.centroDentro, "com a via a faixa tem de ficar livre").toBe(0);
  }, 120_000);
});

describe("`alinhaOPartidoAViaDesenhada` medido nos motores (LAB-32)", () => {
  // As duas metades desta declaração são medidas de jeitos DIFERENTES, e a razão
  // vai dita: quem declara `false` tem de dar alinhamento IDÊNTICO com e sem a
  // via — asserção exata, e é ela que morde se um motor passar a alinhar em
  // silêncio. Quem declara `true` é medido POR PARTIDO, porque o ângulo base
  // obedece à linha mas cada variante sorteia ±30° em cima dele
  // (`variacaoAngular`, no motor): na variante que o ranking dele escolhe o
  // ganho é de 5,6 pp, e no partido ortogonal é de 72,9.
  const v1 = ler("antonina-com-via");
  const semLinhas: EntradaMinima = { ...v1, atracoes: [] };
  const coluna = colunaDe(v1);

  // O título deste teste é CITADO no registro das capacidades
  // (`src/porta/experimentos.ts`), e há guarda conferindo que ele existe. Ele
  // junta as duas metades porque a afirmação do registro é um "se e só se".
  test("`alinhaOPartidoAViaDesenhada`: a DIREÇÃO dos eixos se aproxima da linha se e só se declarou", () => {
    const eCom = entradaDaPorta(v1, SEMENTE, CARIMBO, separar);
    const eSem = entradaDaPorta(semLinhas, SEMENTE, CARIMBO, separar);
    for (const m of [motorDoGenerate("ortogonal"), motorDoGenerate("espinha")]) {
      const c = m.capacidades();
      if (c.alinhaOPartidoAViaDesenhada) continue;
      const aSem = alinhamentoAViaDesenhada(coluna, viasDaSaida(m.gerar(eSem).saida), 10);
      const aCom = alinhamentoAViaDesenhada(coluna, viasDaSaida(m.gerar(eCom).saida), 10);
      expect(aCom, `${c.id} declarou NÃO alinhar o partido e o alinhamento mudou`).toBe(aSem);
    }

    // ── e a outra metade: quem declara `true` mostra o ganho ───────────────
    expect(motorDoParcelamento().capacidades().alinhaOPartidoAViaDesenhada).toBe(true);
    const sem = rodada(v1, "ortogonal", null);
    const com = rodada(v1, "ortogonal", coluna);
    const ganho =
      (alinhamentoAViaDesenhada(coluna, viasDaSaida(com!.saida), 10) ?? 0) -
      (alinhamentoAViaDesenhada(coluna, viasDaSaida(sem!.saida), 10) ?? 0);
    expect(ganho, "declarou alinhar o partido e nenhum partido se aproximou da linha").toBeGreaterThan(0.1);
  }, 120_000);

  test("e `respeitaViaDesenhada` continua FALSO — assentar eixo na linha ele não faz", () => {
    // As duas verdades convivem, e é por isso que são dois campos: ele tira a
    // DIREÇÃO da linha e não põe a RUA em cima dela. Com um campo só, uma das
    // duas teria de virar mentira.
    const c = motorDoParcelamento().capacidades();
    expect(c.leViaDesenhada).toBe(true);
    expect(c.alinhaOPartidoAViaDesenhada).toBe(true);
    expect(c.respeitaViaDesenhada).toBe(false);
  });
});
