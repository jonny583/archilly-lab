/**
 * Os testes do LAB-03 — a interpolação do relevo e as fixtures com relevo.
 *
 * ```sh
 * bun test
 * ```
 *
 * O que eles fixam:
 *
 * - **o defeito existe e é grande**: o interpolador de k vizinhos põe dezenas
 *   de porcento das células sobre um valor de curva e deixa a grade com
 *   gradiente zero. Se algum dia esse número cair sozinho, é porque a réplica
 *   parou de replicar o defeito, e o controle deixou de valer;
 * - **a correção resolve**: o interpolador de produção fica perto de zero nos
 *   dois números;
 * - **a réplica só difere no interpolador**: mesma grade, mesmo passo, mesma
 *   inversão de eixo — senão a comparação mede duas coisas ao mesmo tempo;
 * - **a fixture não mexe no que é do Generate**: poligonal, restrições e
 *   parâmetros chegam intactos; só o relevo é acrescentado, e declarado;
 * - **a prova da fixture**: o Symbios recusava a gleba e passa a rodar.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { gerarRedeViaria, Motor } from "@symbios/index.ts";
import { montarAlturas, type MapaDeAlturas } from "@symbios/alturas.ts";
import type { Terreno } from "@symbios/contrato.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { montarAlturasPorKVizinhos } from "../src/relevo-k-vizinhos.ts";
import { comRelevo, EQUIDISTANCIA_M } from "../src/fixtures-com-relevo.ts";

const WASM = join(
  import.meta.dirname, "..", "..", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);
const GLEBAS = join(
  import.meta.dirname, "..", "..", "..", "..",
  "urban-create-hub-41d93a4d", "docs", "glebas-padrao",
);
const motor = await Motor.carregar(readFileSync(WASM));
const PASSO = 2;
const SEMENTE = 20260913;

const { terreno } = glebaParaOSymbios(glebaDoLab("sintetico-50ha-ondulado"));
const T = terreno as Terreno;
const CORRIGIDO = montarAlturas(T, PASSO);
const K_VIZINHOS = montarAlturasPorKVizinhos(T, PASSO);

/** As duas estatísticas do LAB-01, sobre um mapa pronto. */
function estatisticas(m: MapaDeAlturas) {
  let sobre = 0;
  for (const z of m.alturas) {
    const d = Math.abs(z / EQUIDISTANCIA_M - Math.round(z / EQUIDISTANCIA_M)) * EQUIDISTANCIA_M;
    if (d < 0.02) sobre++;
  }
  let zero = 0;
  let n = 0;
  for (let iy = 1; iy < m.ny - 1; iy++) {
    for (let ix = 1; ix < m.nx - 1; ix++) {
      const at = (i: number, j: number) => m.alturas[j * m.nx + i]!;
      const g = Math.hypot(
        (at(ix + 1, iy) - at(ix - 1, iy)) / (2 * m.celula_m),
        (at(ix, iy + 1) - at(ix, iy - 1)) / (2 * m.celula_m),
      ) * 100;
      n++;
      if (g < 0.01) zero++;
    }
  }
  return { sobreCurva: sobre / m.alturas.length, gradienteZero: zero / n };
}

describe("o defeito, e a correção", () => {
  test("o interpolador de k vizinhos faz o bolo de casamento", () => {
    const e = estatisticas(K_VIZINHOS);
    // O LAB-01 mediu 85 % e 73 % nesta mesma gleba. O teste guarda a ordem de
    // grandeza, não o dígito: a réplica tem de continuar sendo o defeito.
    expect(e.sobreCurva).toBeGreaterThan(0.5);
    expect(e.gradienteZero).toBeGreaterThan(0.5);
  });

  test("o interpolador de produção não faz", () => {
    const e = estatisticas(CORRIGIDO);
    expect(e.sobreCurva).toBeLessThan(0.05);
    expect(e.gradienteZero).toBeLessThan(0.01);
  });

  test("a réplica difere SÓ no interpolador", () => {
    // Mesma grade, mesmo passo, mesma origem. Se isto quebrar, a comparação do
    // LAB-03 passa a medir duas coisas ao mesmo tempo.
    expect(K_VIZINHOS.nx).toBe(CORRIGIDO.nx);
    expect(K_VIZINHOS.ny).toBe(CORRIGIDO.ny);
    expect(K_VIZINHOS.celula_m).toBe(CORRIGIDO.celula_m);
    expect(K_VIZINHOS.origemMundo).toEqual(CORRIGIDO.origemMundo);
    expect(K_VIZINHOS.dentro).toEqual(CORRIGIDO.dentro);
  });

  test("o motor aceita um mapa injetado e o usa de verdade", () => {
    const a = gerarRedeViaria(motor, T, { passoGrade_m: PASSO }, SEMENTE, CORRIGIDO);
    const b = gerarRedeViaria(motor, T, { passoGrade_m: PASSO }, SEMENTE, K_VIZINHOS);
    // Mesma semente, mesma gleba, mapas diferentes → geometria diferente.
    expect(a.diagnostico.hash).not.toBe(b.diagnostico.hash);
    // E o mapa injetado é mesmo o que entrou.
    const c = gerarRedeViaria(motor, T, { passoGrade_m: PASSO }, SEMENTE, CORRIGIDO);
    expect(c.diagnostico.hash).toBe(a.diagnostico.hash);
  }, 120_000);
});

describe("as fixtures com relevo", () => {
  const base: EntradaMinima = JSON.parse(
    readFileSync(join(GLEBAS, "ensaio-47ha.entrada.json"), "utf8"),
  );

  test("a gleba-padrão do Generate não tem relevo — é o problema que a fixture resolve", () => {
    expect(base.relevo?.curvas ?? []).toHaveLength(0);
    const { terreno: t } = glebaParaOSymbios(base);
    expect(() => gerarRedeViaria(motor, t as Terreno, { passoGrade_m: PASSO }, SEMENTE)).toThrow(
      /vértices cotados/,
    );
  });

  test("a fixture só acrescenta relevo: o que é do Generate chega intacto", () => {
    const f = comRelevo(base);
    expect(f.entrada.gleba).toEqual(base.gleba);
    expect(f.entrada.restricoes).toEqual(base.restricoes);
    expect(f.entrada.parametros).toEqual(base.parametros);
    expect(f.entrada.acessos).toEqual(base.acessos);
    expect(f.curvas).toBeGreaterThan(50);
    expect(f.verticesCotados).toBeGreaterThan(1000);
  });

  test("a fixture declara que o relevo é sintético", () => {
    const f = comRelevo(base);
    const origem = (f.entrada.archilly as unknown as { origem: string }).origem;
    expect(origem).toMatch(/SINT[ÉE]TICO/);
    expect(origem).toMatch(/LAB-03/);
  });

  test("com a fixture, o motor roda", () => {
    const f = comRelevo(base);
    const { terreno: t } = glebaParaOSymbios(f.entrada);
    const r = gerarRedeViaria(motor, t as Terreno, { passoGrade_m: PASSO }, SEMENTE);
    expect(r.vias.length).toBeGreaterThan(10);
    expect(r.quadras.length).toBeGreaterThan(10);
  }, 120_000);

  test("a fixture é determinística: mesma entrada, mesmas curvas", () => {
    expect(JSON.stringify(comRelevo(base).entrada.relevo)).toBe(
      JSON.stringify(comRelevo(base).entrada.relevo),
    );
  });
});

// ── LAB-08 ────────────────────────────────────────────────────────────────

describe("LAB-08 · o quadro de áreas do Generate, na gleba de ensaio", () => {
  const RES = join(
    import.meta.dirname, "..", "..", "..", "..",
    "urban-create-hub-41d93a4d", "docs", "glebas-padrao",
  );

  test("a gleba de ensaio declara ZERO restrições", () => {
    const e = JSON.parse(readFileSync(join(RES, "ensaio-47ha.entrada.json"), "utf8"));
    expect(e.restricoes).toHaveLength(0);
    expect(e.parametros.pctAPP).toBe(15);
    expect(e.parametros.pctLazer).toBe(10);
  });

  test("e mesmo assim o quadro de referência declara 15 % de APP — é eco do parâmetro", () => {
    const v = JSON.parse(
      readFileSync(join(RES, "resultados", "ensaio-47ha.ortogonal.veredito.json"), "utf8"),
    );
    const q = v.quadroDeAreas;
    // Os dois números são a porcentagem do parâmetro vezes a área, ao centavo.
    expect(q.areaAPP_m2).toBeCloseTo(q.areaTotal_m2 * 0.15, 2);
    expect(q.areaLazer_m2).toBeCloseTo(q.areaTotal_m2 * 0.1, 2);
  });

  test("por isso o quadro não fecha: sobra mais terra do que a gleba tem", () => {
    for (const motor of ["ortogonal", "espinha"]) {
      const v = JSON.parse(
        readFileSync(join(RES, "resultados", `ensaio-47ha.${motor}.veredito.json`), "utf8"),
      );
      const q = v.quadroDeAreas;
      const soma = Object.entries(q).reduce(
        (s, [k, x]) => (k === "areaTotal_m2" ? s : s + (x as number)), 0);
      expect(soma).toBeGreaterThan(q.areaTotal_m2 * 1.09);
    }
  });

  test("em geo-antonina o mesmo quadro FECHA — não é bug geral, é daquela gleba", () => {
    for (const motor of ["ortogonal", "espinha"]) {
      const v = JSON.parse(
        readFileSync(join(RES, "resultados", `geo-antonina.${motor}.veredito.json`), "utf8"),
      );
      const q = v.quadroDeAreas;
      const soma = Object.entries(q).reduce(
        (s, [k, x]) => (k === "areaTotal_m2" ? s : s + (x as number)), 0);
      expect(Math.abs(soma - q.areaTotal_m2)).toBeLessThan(q.areaTotal_m2 * 0.001);
    }
  });
});
