/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-93 · a impressão digital da GEOMETRIA, nos dois sentidos.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Esta trava existe por causa de um engano meu, pego dentro do próprio prompt.
 *
 * A medição das passagens de `legais` usava, como instrumento de *"o desenho mudou"*,
 * a `assinaturaDaRodada` que a esteira publica — que é a `impressao(plano)` **do
 * próprio motor**. Parecia a escolha óbvia: é a régua do dono, e o comentário dela diz
 * *"serve para provar que duas rodadas deram o mesmo desenho"*.
 *
 * Só que o `Plano` do motor carrega `avisos`, `metricas`, `nota` e `indicadores` ao
 * lado da geometria. Entregue a `caixaViariaMinima_m`, o motor passou a **avisar** —
 * e a assinatura mudou com lotes, vias, quadras e pior rampa **idênticos**. Eu estava
 * a um passo de publicar *"entregar a caixa viária mínima muda o desenho"*.
 *
 * > **Assinatura de RODADA não é assinatura de DESENHO.** Impressão digital só
 * > responde à pergunta de quem sabe o que entrou nela — e a régua do dono estava
 * > certa sobre o que ELE queria provar, não sobre o que eu estava perguntando.
 *
 * Ela mora fora do portão sem clones **porque usa a `impressao` do motor**, que é
 * leitura do clone vizinho por caminho (D16). Refazer a canonicalização aqui seria a
 * segunda régua para a mesma grandeza que o D116 proíbe.
 */
import { describe, expect, test } from "bun:test";

import { assinaturaDaGeometria, piorRampaPublicada } from "../src/passagens-dos-legais.ts";
import type { SaidaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

/** Uma SAÍDA mínima, só com o que a impressão da geometria olha. */
const saida = (dx = 0): SaidaV1 =>
  ({
    archilly: { schema: "archilly-motor-saida", versao: "2", origem: "trava", geradoEm: "2026-10-11" },
    motor: { nome: "trava", versao: "1", semente: null },
    entrada: { projetoId: "p", glebaId: "G1", contrato: "2" },
    crs: { codigo: "local", unidade: "m", origemGeografica: { lat: 0, lon: 0 } },
    vias: [
      {
        id: "V1",
        hierarquia: "principal",
        pontos: [
          { x: 0, y: 0 },
          { x: 100 + dx, y: 0 },
        ],
        largura_m: 11.5,
        rampaMedia_pct: 3,
        rampaMaxima_pct: 9.5,
      },
    ],
    quadras: [{ id: "Q1", pontos: [{ x: 0, y: 0 }], area_m2: 1 }],
    lotes: [
      { id: "L1", quadraId: "Q1", pontos: [{ x: 0, y: 0 }], area_m2: 1, testada_m: 10, faceDeRua: "V1" },
    ],
    areasEspeciais: [],
    quadroDeAreas: {
      areaTotal_m2: 1,
      areaPrivativa_m2: 1,
      areaViaria_m2: 0,
      areaLazer_m2: 0,
      areaAPP_m2: 0,
      areaNaoAproveitada_m2: 0,
    },
    parametrosUsados: {} as SaidaV1["parametrosUsados"],
  }) as SaidaV1;

describe("LAB-93 · a assinatura da GEOMETRIA, e ela reprova", () => {
  test("O LADO BOM: geometria igual dá a mesma impressão", () => {
    expect(assinaturaDaGeometria(saida())).toBe(assinaturaDaGeometria(saida()));
  });

  test("O LADO RUIM: mover um vértice MUDA a impressão — sem isso ela não prova nada", () => {
    expect(assinaturaDaGeometria(saida(1))).not.toBe(assinaturaDaGeometria(saida()));
  });

  test("o que NÃO é geometria não entra: trocar a rampa publicada não muda a impressão", () => {
    const outra = saida();
    outra.vias[0]!.rampaMaxima_pct = 42;
    outra.vias[0]!.rampaMedia_pct = 7;
    expect(assinaturaDaGeometria(outra)).toBe(assinaturaDaGeometria(saida()));
  });

  test("SAÍDA ausente é `null`, não uma impressão de nada (D23)", () => {
    expect(assinaturaDaGeometria(null)).toBeNull();
  });

  test("a pior rampa publicada é o MÁXIMO das vias, e `null` quando ninguém mediu", () => {
    expect(piorRampaPublicada(saida())).toBe(9.5);
    const semRampa = saida();
    semRampa.vias[0]!.rampaMaxima_pct = null;
    expect(piorRampaPublicada(semRampa)).toBeNull();
    expect(piorRampaPublicada(null)).toBeNull();
  });
});
