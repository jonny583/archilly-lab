/**
 * §4 · NÃO CONSERTA GEOMETRIA EM SILÊNCIO — as três cláusulas, nos dois consertos. (LAB-142, D370)
 *
 * A guarda do LAB-36 (`regras.test.ts`) cobra o aparo desligado e o aparo declarado. Esta cobra as
 * quatro casas que faltavam, e cada uma tem os dois lados:
 *
 * 1. **o recorte declarado** — a função pura e o `rodarSymbios` que a chama;
 * 2. **o recorte desligado por padrão, SEM o `.wasm`** — com uma rede montada à mão, porque a trava
 *    do LAB-05 (`poligono.test.ts`) gera a rede pelo motor e fica escura sem ele;
 * 3. **o aparo medido nas duas passagens** — com o aparo pedido, toda variante traz a passagem
 *    fiel (`semAparo`); sem o aparo, nenhuma traz, porque não houve conserto a comparar.
 *
 * A casa *"recorte nas duas passagens"* é a prova do LAB-05 (`ferramentas/lab05.ts`) e não se
 * repete aqui: a regra é de medição, e a medição dele existe.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Resultado, Terreno } from "@symbios/contrato.ts";
import { recortarPelaGleba } from "@symbios/recorte.ts";

import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";
import {
  oQueORecorteConsertou,
  SUJEITO_DO_CONSERTO,
  type ContadoresDoConserto,
} from "../src/conserto-declarado.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const NADA: ContadoresDoConserto = {
  lascasDescartadas: 0,
  comprimentoDescartadoEmLascas_m: 0,
  quadrasRecortadas: 0,
  pecasDeQuadra: 0,
  quadrasQueNaoRecortaram: 0,
};

describe("§4 · o recorte do Symbios é DECLARADO", () => {
  test("O LADO BOM: conserto que não aconteceu não se declara", () => {
    expect(oQueORecorteConsertou(NADA)).toEqual([]);
  });

  test("O LADO RUIM: cada conserto que aconteceu sai numa linha, com o número e o sujeito", () => {
    const linhas = oQueORecorteConsertou({
      lascasDescartadas: 3,
      comprimentoDescartadoEmLascas_m: 21.04,
      quadrasRecortadas: 7,
      pecasDeQuadra: 9,
      quadrasQueNaoRecortaram: 2,
    });
    expect(linhas).toHaveLength(3);
    for (const l of linhas) expect(l.startsWith(SUJEITO_DO_CONSERTO)).toBe(true);
    expect(linhas[0]).toContain("3 lasca(s)");
    expect(linhas[0]).toContain("21.0 m");
    expect(linhas[1]).toContain("7 quadra(s)");
    expect(linhas[1]).toContain("9 peça(s)");
    expect(linhas[2]).toContain("2 quadra(s)");
  });

  test("cada contador fala sozinho: um ligado, uma linha", () => {
    expect(oQueORecorteConsertou({ ...NADA, lascasDescartadas: 1 })).toHaveLength(1);
    expect(oQueORecorteConsertou({ ...NADA, quadrasRecortadas: 1, pecasDeQuadra: 1 })).toHaveLength(1);
    expect(oQueORecorteConsertou({ ...NADA, quadrasQueNaoRecortaram: 1 })).toHaveLength(1);
  });

  test("o `rodarSymbios` liga o recorte E publica o que ele fez", () => {
    // Sem o `.wasm` o motor não roda nesta máquina; a trava lê o arquivo, como a do aparo
    // (`regras.test.ts`), e cobra as duas pontas: ligou, e declarou o resultado do MESMO corte.
    const fonte = readFileSync(join(import.meta.dirname, "..", "src", "motores", "symbios.ts"), "utf8");
    expect(fonte).toContain("recortarQuadraQueAtravessa: true");
    expect(fonte, "ligou o conserto e não publicou o tamanho dele").toContain(
      "naoSoubeFazer.push(...oQueORecorteConsertou(corte));",
    );
  });
});

/**
 * Uma rede de mentira, montada à mão: gleba 100 × 100, uma via inteira dentro, uma via que sai
 * pela divisa deixando 5 m dentro (a lasca do corte), e uma quadra que atravessa a divisa.
 */
function redeMontada(): { r: Resultado; t: Terreno } {
  const via = (id: string, xs: [number, number][]) => ({
    id,
    tipo: "local" as const,
    pontos: xs.map(([x, y]) => ({ x, y })),
    cotas_m: xs.map(() => 0),
    comprimento_m: Math.hypot(xs[1]![0] - xs[0]![0], xs[1]![1] - xs[0]![1]),
    rampaMedia_pct: 0,
    rampaMaxima_pct: 0,
    faixaDominio_m: 12,
    saiDaGleba: false,
    comprimentoForaDaGleba_m: 0,
  });
  const quadra = {
    id: "q-atravessa",
    pontos: [
      { x: 80, y: 60 },
      { x: 120, y: 60 },
      { x: 120, y: 90 },
      { x: 80, y: 90 },
    ],
    area_m2: 1200,
    perimetro_m: 140,
    fracaoDentroDaGleba: 0.5,
  };
  const r = {
    vias: [via("inteira", [[10, 10], [90, 10]]), via("sai", [[95, 50], [130, 50]])],
    quadras: [quadra],
    diagnostico: {},
  } as unknown as Resultado;
  const t = {
    nome: "montada",
    gleba: {
      externo: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ],
      furos: [],
    },
    curvas: [],
    restricoes: [],
  } as unknown as Terreno;
  return { r, t };
}

describe("§4 · o recorte do Symbios vem DESLIGADO por padrão — sem depender do `.wasm`", () => {
  test("O LADO BOM: sem opção, nada é descartado nem recortado, e a quadra sai como veio", () => {
    const { r, t } = redeMontada();
    const sem = recortarPelaGleba(r, t);
    expect(oQueORecorteConsertou(sem)).toEqual([]);
    expect(sem.quadras.map((q) => q.area_m2)).toEqual([1200]);
    expect(sem.viasDepois).toBe(2);
  });

  test("O LADO RUIM: pedido, ele conserta — e o que consertou se declara", () => {
    const { r, t } = redeMontada();
    const com = recortarPelaGleba(r, t, { ladoDoLoteMinimo_m: 14, recortarQuadraQueAtravessa: true });
    expect(com.lascasDescartadas).toBe(1);
    expect(com.quadrasRecortadas).toBe(1);
    expect(com.quadras.map((q) => Math.round(q.area_m2))).toEqual([600]);
    expect(oQueORecorteConsertou(com)).toHaveLength(2);
  });
});

describe("§4 · o aparo é medido nas DUAS passagens", () => {
  const entrada = JSON.parse(
    readFileSync(
      join(RAIZ, "..", "urban-create-hub-41d93a4d", "docs", "glebas-padrao", "geo-antonina.entrada.json"),
      "utf8",
    ),
  ) as EntradaV1;
  const opcoes = { semente: 20260913, variantes: 2, formatos: ["ortogonal", "pente"] as const };

  test("O LADO BOM: com o aparo pedido, toda variante traz a passagem FIEL ao lado da aparada", () => {
    const r = rodarEsteira(entrada, { ...opcoes, aparar: true });
    expect(r.variantes.length).toBeGreaterThan(0);
    for (const v of r.variantes) {
      expect(v.aparo, "aparou e não mediu o tamanho do conserto").not.toBeNull();
      expect(v.semAparo, "aparou e não mediu a passagem sem o conserto").not.toBeNull();
    }
  }, 120_000);

  test("O LADO RUIM: sem o aparo, não há segunda passagem a medir — e ela não aparece inventada", () => {
    const r = rodarEsteira(entrada, { ...opcoes, aparar: false });
    for (const v of r.variantes) {
      expect(v.aparo).toBeNull();
      expect(v.semAparo).toBeNull();
    }
  }, 120_000);
});
