/**
 * Os testes do LAB-02 — o recorte pela gleba e pelas restrições.
 *
 * ```sh
 * bun test
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **a meta**: zero metro de via fora da gleba, e zero dentro de restrição que
 *   desconta. É o número que o prompt pediu, e é o que um teste tem de travar
 *   para que ninguém o perca sem perceber;
 * - **o que o corte NÃO pode fazer**: inventar geometria, mover vértice que
 *   estava dentro, ou mexer em quadra que não está fora;
 * - **a cota interpolada**: o ponto de corte tem de cair na reta entre os dois
 *   vizinhos, senão o corte cria rampa que o motor nunca desenhou;
 * - **a régua de conectividade**, que já mediu errado uma vez: a rede CRUA tem
 *   de sair como uma rede só;
 * - **determinismo**: mesma semente, mesma geometria.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { gerarRedeViaria, Motor, recortarPelaGleba } from "@symbios/index.ts";
import type { Ponto, Terreno } from "@symbios/contrato.ts";
import { dentroDoPoligono } from "@symbios/geo.ts";

import { glebaParaOSymbios } from "../src/gleba-v1.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { symbiosParaOContrato } from "../src/symbios-para-contrato.ts";

const WASM = join(
  import.meta.dirname, "..", "..", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);
const SEMENTE = 20260913;
const motor = await Motor.carregar(readFileSync(WASM));

/** A gleba com restrição de verdade: 2 APP e 1 reserva legal. */
function preparar(nome: string) {
  const { terreno, perdas } = glebaParaOSymbios(glebaDoLab(nome));
  const bruto = gerarRedeViaria(motor, terreno as Terreno, {}, SEMENTE);
  return { terreno: terreno as Terreno, bruto, perdas, corte: recortarPelaGleba(bruto, terreno as Terreno) };
}

const COMPLETO = preparar("completo");

describe("a meta do LAB-02", () => {
  test("zero metro de via fora da gleba", () => {
    expect(COMPLETO.corte.comprimentoForaDaGlebaAntes_m).toBeGreaterThan(1000);
    expect(COMPLETO.corte.comprimentoForaDaGlebaDepois_m).toBeLessThan(0.01);
  });

  test("zero metro de via dentro de restrição que desconta", () => {
    expect(COMPLETO.corte.comprimentoEmRestricaoAntes_m).toBeGreaterThan(1000);
    expect(COMPLETO.corte.comprimentoEmRestricaoDepois_m).toBeLessThan(0.01);
  });

  test("todo vértice que sobrou está dentro da gleba e fora do que bloqueia", () => {
    const bloqueadas = COMPLETO.terreno.restricoes.filter((r) => r.desconta).map((r) => r.area);
    for (const v of COMPLETO.corte.vias) {
      for (const p of v.pontos) {
        expect(dentroDoPoligono(p, COMPLETO.terreno.gleba)).toBe(true);
        for (const b of bloqueadas) expect(dentroDoPoligono(p, b)).toBe(false);
      }
    }
  });

  test("quem bloqueia é o `desconta` do Geo, não uma lista do Lab", () => {
    const quantasDescontam = COMPLETO.terreno.restricoes.filter((r) => r.desconta).length;
    expect(COMPLETO.corte.bloqueios.length).toBe(quantasDescontam);
    expect(quantasDescontam).toBeGreaterThan(0);
  });
});

describe("o que o corte não pode fazer", () => {
  test("não inventa comprimento: a rede só encolhe", () => {
    expect(COMPLETO.corte.comprimentoDepois_m).toBeLessThan(COMPLETO.corte.comprimentoAntes_m);
    expect(COMPLETO.corte.comprimentoDepois_m).toBeGreaterThan(0);
  });

  test("vértice original que estava livre chega intacto do outro lado", () => {
    const bloqueadas = COMPLETO.terreno.restricoes.filter((r) => r.desconta).map((r) => r.area);
    const livre = (p: Ponto) =>
      dentroDoPoligono(p, COMPLETO.terreno.gleba) && !bloqueadas.some((b) => dentroDoPoligono(p, b));
    const chave = (p: Ponto) => `${p.x.toFixed(6)}:${p.y.toFixed(6)}`;
    const depois = new Set(COMPLETO.corte.vias.flatMap((v) => v.pontos.map(chave)));

    // Um vértice livre no meio de uma via que sobreviveu tem de estar lá, igual.
    let conferidos = 0;
    for (const v of COMPLETO.bruto.vias) {
      if (!v.pontos.every(livre)) continue;
      for (const p of v.pontos) {
        expect(depois.has(chave(p))).toBe(true);
        conferidos++;
      }
    }
    expect(conferidos).toBeGreaterThan(100);
  });

  test("a cota do ponto de corte cai na reta entre os vizinhos", () => {
    // Nenhum trecho cortado pode ter rampa maior que a maior rampa da via de
    // origem: interpolar linearmente não cria declividade nova.
    const maiorAntes = Math.max(...COMPLETO.bruto.vias.map((v) => v.rampaMaxima_pct));
    const maiorDepois = Math.max(...COMPLETO.corte.vias.map((v) => v.rampaMaxima_pct));
    expect(maiorDepois).toBeLessThanOrEqual(maiorAntes + 1e-6);
  });

  test("quadra que não está fora não é tocada", () => {
    const dentroAntes = COMPLETO.bruto.quadras.filter((q) => q.fracaoDentroDaGleba > 0);
    expect(COMPLETO.corte.quadras).toEqual(dentroAntes);
  });
});

describe("a régua de conectividade", () => {
  test("a rede CRUA é uma rede só", () => {
    // Foi este teste que teria pego a régua errada da primeira versão, que via
    // 472 componentes numa rede recém-gerada.
    expect(COMPLETO.corte.conectividadeAntes.fracaoNoMaior).toBeGreaterThan(0.95);
  });

  test("o corte custa conectividade, e o custo é medido", () => {
    const c = COMPLETO.corte.conectividade;
    expect(c.componentes).toBeGreaterThan(COMPLETO.corte.conectividadeAntes.componentes);
    expect(c.fracaoNoMaior).toBeGreaterThan(0.9);
    expect(c.comprimentoIsolado_m).toBeGreaterThan(0);
  });
});

describe("a ponte para o contrato", () => {
  test("a SAÍDA sai sem lote, e isso é declarado como perda", () => {
    const { saida, perdas } = symbiosParaOContrato(COMPLETO.corte.vias, COMPLETO.corte.quadras, {
      projetoId: "completo", glebaId: "G1", areaDaGleba_m2: 1e6, areaQueDesconta_m2: 0,
      semente: SEMENTE, versaoMotor: "0.4.1", geradoEm: "2026-09-14T00:00:00.000Z",
      crs: { codigo: "local", unidade: "m", origemGeografica: null }, parametrosUsados: {},
    });
    expect(saida.lotes).toEqual([]);
    expect(saida.archilly.schema).toBe("archilly-motor-saida");
    expect(perdas.some((p) => p.campo === "lotes" && p.gravidade === "alta")).toBe(true);
    for (const p of perdas) expect(p.motivo.length).toBeGreaterThan(30);
  });

  test("a rampa média viaja: o Symbios mede greide, ao contrário do outro motor", () => {
    const { saida } = symbiosParaOContrato(COMPLETO.corte.vias, [], {
      projetoId: "completo", glebaId: "G1", areaDaGleba_m2: 1e6, areaQueDesconta_m2: 0,
      semente: SEMENTE, versaoMotor: "0.4.1", geradoEm: "2026-09-14T00:00:00.000Z",
      crs: { codigo: "local", unidade: "m", origemGeografica: null }, parametrosUsados: {},
    });
    expect(saida.vias.every((v) => v.rampaMedia_pct !== null)).toBe(true);
  });
});

describe("determinismo", () => {
  test("mesma semente, mesma geometria cortada", () => {
    const a = preparar("sintetico-10ha-plano");
    const b = preparar("sintetico-10ha-plano");
    expect(JSON.stringify(a.corte.vias)).toBe(JSON.stringify(b.corte.vias));
  }, 60_000);
});

describe("as glebas-padrão do Generate não têm relevo", () => {
  test("o Symbios recusa a gleba sem curva de nível, e a recusa é legível", () => {
    const entrada = JSON.parse(
      readFileSync(
        join(import.meta.dirname, "..", "..", "..", "..",
          "urban-create-hub-41d93a4d", "docs", "glebas-padrao", "ensaio-47ha.entrada.json"),
        "utf8",
      ),
    );
    expect(entrada.relevo?.curvas ?? []).toHaveLength(0);
    const { terreno, perdas } = glebaParaOSymbios(entrada);
    expect(perdas.some((p) => p.campo === "relevo.curvas" && p.gravidade === "alta")).toBe(true);
    expect(() => gerarRedeViaria(motor, terreno as Terreno, {}, SEMENTE)).toThrow(/vértices cotados/);
  });
});
