/**
 * Os testes do bloco de indicadores de terreno. (LAB-24)
 *
 * ```sh
 * bun test tests/terreno.test.ts
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **os dois limites NÃO têm a mesma força.** 30 % no lote é **lei e reprova**;
 *   15 % na rua é **aviso e não reprova**. Foi o Jonny quem separou as duas, e a
 *   razão dele está no cabeçalho de `src/terreno-indicadores.ts`: *"trecho acima
 *   pode ser resolvido com terraplenagem ou com mudança de traçado, e isso é
 *   decisão de projeto com custo, que o motor não toma"*;
 * - **NENHUM campo de via dá veredito.** Se alguém acrescentar um `reprova` ao
 *   bloco da via, este teste morde;
 * - **a declividade é medida nas duas direções.** Medir só em x daria zero numa
 *   encosta que desce em y, e encosta não tem direção preferida;
 * - **metro vira metro quadrado pela caixa da via** — é o que vira
 *   terraplenagem no orçamento;
 * - **sem relevo, tudo `null` com o motivo escrito** (D23).
 */
import { describe, expect, test } from "bun:test";

import type { MapaDeAlturas } from "@symbios/alturas.ts";

import type { P } from "../src/motores/comum.ts";
import {
  FONTE_DOS_LIMITES,
  LIMITE_DA_RUA_PCT,
  LIMITE_DO_LOTE_PCT,
  declividadeEm,
  fracaoDoLoteAcima,
  indicadoresDeTerreno,
} from "../src/terreno-indicadores.ts";

/** Mapa de cotas com rampa constante na direção escolhida. */
function mapaInclinado(
  inclinacao: number,
  direcao: "x" | "y" = "x",
  celula_m = 5,
  lado = 80,
): MapaDeAlturas {
  const alturas = new Float32Array(lado * lado);
  for (let iz = 0; iz < lado; iz++) {
    for (let ix = 0; ix < lado; ix++) {
      alturas[iz * lado + ix] = (direcao === "x" ? ix : iz) * celula_m * inclinacao;
    }
  }
  return {
    nx: lado, ny: lado, celula_m, alturas,
    dentro: new Uint8Array(lado * lado).fill(1),
    origemMundo: { x: 0, y: 0 },
    fracaoFora: 0, cotaMin: 0, cotaMax: lado * celula_m * inclinacao,
  } as unknown as MapaDeAlturas;
}

/** Um lote retangular com o canto em (x, y). */
const lote = (id: string, x: number, y: number, w = 20, h = 30): { id: string; pontos: P[] } => ({
  id,
  pontos: [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
  ],
});

describe("os dois limites, e as forças diferentes", () => {
  test("são os números que o Jonny deu", () => {
    expect(LIMITE_DO_LOTE_PCT).toBe(30);
    expect(LIMITE_DA_RUA_PCT).toBe(15);
  });

  test("a fonte de cada um sai junto, e diz a força", () => {
    expect(FONTE_DOS_LIMITES.lote).toContain("Lei 6.766/1979");
    expect(FONTE_DOS_LIMITES.lote).toContain("LOTE");
    expect(FONTE_DOS_LIMITES.rua).toContain("AVISO");
    expect(FONTE_DOS_LIMITES.rua).toContain("não reprovação");
  });

  test("o LOTE acima de 30 % REPROVA", () => {
    const i = indicadoresDeTerreno([], [lote("L1", 100, 100)], mapaInclinado(0.5));
    expect(i.lote!.reprovaPelaLei).toBe(true);
    expect(i.lote!.pctDaArea).toBeGreaterThan(90);
  });

  test("o LOTE em terreno manso NÃO reprova", () => {
    const i = indicadoresDeTerreno([], [lote("L1", 100, 100)], mapaInclinado(0.05));
    expect(i.lote!.reprovaPelaLei).toBe(false);
    expect(i.lote!.areaAcimaDoLimite_m2).toBe(0);
    expect(i.lote!.lotesComParteAcima).toBe(0);
  });

  test("a VIA não tem veredito NENHUM — nem quando passa muito do limite", () => {
    const i = indicadoresDeTerreno(
      [{ id: "v1", pontos: [{ x: 50, y: 100 }, { x: 250, y: 100 }], largura_m: 12 }],
      [],
      mapaInclinado(0.4),
    );
    expect(i.via!.pctDoComprimento).toBeGreaterThan(90);
    // E mesmo assim: nenhuma chave de veredito no bloco da via.
    const chaves = Object.keys(i.via!);
    for (const proibida of ["reprova", "reprovaPelaLei", "aprovado", "passa"]) {
      expect(chaves).not.toContain(proibida);
    }
  });
});

describe("a declividade é medida nas duas direções", () => {
  test("encosta que desce em Y é vista — medir só em x daria zero", () => {
    const emY = mapaInclinado(0.4, "y");
    const d = declividadeEm(emY, { x: 150, y: 150 });
    expect(d).not.toBeNull();
    expect(d!).toBeCloseTo(40, 0);
  });

  test("encosta que desce em X também, com o mesmo número", () => {
    const d = declividadeEm(mapaInclinado(0.4, "x"), { x: 150, y: 150 });
    expect(d!).toBeCloseTo(40, 0);
  });

  test("terreno plano dá zero", () => {
    expect(declividadeEm(mapaInclinado(0, "x"), { x: 150, y: 150 })!).toBeCloseTo(0, 6);
  });
});

describe("a fração do lote acima do limite", () => {
  test("lote inteiro em encosta forte: fração 1", () => {
    const m = fracaoDoLoteAcima(lote("L", 100, 100).pontos, mapaInclinado(0.5), 30);
    expect(m!.fracao).toBeCloseTo(1, 6);
    expect(m!.piorDeclividade_pct).toBeGreaterThan(30);
  });

  test("lote inteiro em terreno manso: fração 0", () => {
    const m = fracaoDoLoteAcima(lote("L", 100, 100).pontos, mapaInclinado(0.05), 30);
    expect(m!.fracao).toBe(0);
  });

  test("lote menor que a célula do mapa ainda recebe uma resposta, pelo centro", () => {
    // Sem isto, lote pequeno sairia sem amostra nenhuma e viraria silêncio.
    const minusculo = lote("L", 100, 100, 2, 2);
    const m = fracaoDoLoteAcima(minusculo.pontos, mapaInclinado(0.5), 30);
    expect(m).not.toBeNull();
    expect(m!.fracao).toBe(1);
  });
});

describe("metro vira metro quadrado pela caixa da via", () => {
  test("a área da via é comprimento × largura da caixa", () => {
    const i = indicadoresDeTerreno(
      [{ id: "v1", pontos: [{ x: 50, y: 100 }, { x: 250, y: 100 }], largura_m: 12 }],
      [],
      mapaInclinado(0.4),
    );
    expect(i.via!.areaTotal_m2).toBeCloseTo(i.via!.comprimentoTotal_m * 12, 1);
    expect(i.via!.areaAcimaDoLimite_m2).toBeCloseTo(i.via!.comprimentoAcimaDoLimite_m * 12, 1);
  });

  test("via sem largura declarada não entra — área inventada vira preço inventado", () => {
    const i = indicadoresDeTerreno(
      [{ id: "v1", pontos: [{ x: 50, y: 100 }, { x: 250, y: 100 }], largura_m: 0 }],
      [],
      mapaInclinado(0.4),
    );
    // A ferramenta filtra largura<=0 antes de chegar aqui; aqui o bloco sai
    // medido mas sem área, e é isso que tem de acontecer.
    expect(i.via!.areaTotal_m2).toBe(0);
  });
});

describe("o pior caso vem com onde está", () => {
  test("a via pior traz id e ponto", () => {
    const i = indicadoresDeTerreno(
      [{ id: "minha-via", pontos: [{ x: 50, y: 100 }, { x: 250, y: 100 }], largura_m: 12 }],
      [],
      mapaInclinado(0.4),
    );
    expect(i.via!.pior!.id).toBe("minha-via");
    expect(i.via!.pior!.onde.x).toBeGreaterThan(50);
    expect(i.via!.pior!.valor_pct).toBeGreaterThan(30);
  });

  test("o lote pior traz id e centro", () => {
    const i = indicadoresDeTerreno([], [lote("meu-lote", 100, 100)], mapaInclinado(0.5));
    expect(i.lote!.pior!.id).toBe("meu-lote");
    expect(i.lote!.pior!.onde).toEqual({ x: 110, y: 115 });
  });
});

describe("o que não foi medido sai declarado", () => {
  test("sem mapa de cotas, tudo null e o motivo escrito", () => {
    const i = indicadoresDeTerreno([{ id: "v", pontos: [{ x: 0, y: 0 }, { x: 10, y: 0 }], largura_m: 8 }], [lote("L", 0, 0)], null);
    expect(i.medido).toBe(false);
    expect(i.porQueNaoMedido).toContain("não tem duas cotas");
    expect(i.via).toBeNull();
    expect(i.lote).toBeNull();
  });

  test("sem lote nenhum, o bloco do lote sai null — e não zero", () => {
    const i = indicadoresDeTerreno(
      [{ id: "v", pontos: [{ x: 50, y: 100 }, { x: 250, y: 100 }], largura_m: 8 }],
      [],
      mapaInclinado(0.1),
    );
    expect(i.lote).toBeNull();
    expect(i.via).not.toBeNull();
  });
});
