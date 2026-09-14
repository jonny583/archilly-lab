/**
 * Os testes da esteira do LAB-07.
 *
 * ```sh
 * bun test
 * ```
 *
 * O que eles cobrem, e por quê:
 *
 * - **ida e volta nas três glebas** — a verificação que o §4 do prompt exige.
 *   Terreno → motor → parcelamento → Validator/Judge, com o resultado chegando
 *   inteiro do outro lado.
 * - **determinismo** — duas execuções com a mesma semente dão o mesmo arquivo de
 *   contrato, byte a byte. É a propriedade que sustenta toda comparação futura:
 *   sem ela, "o motor mudou" e "a máquina mudou" ficam indistinguíveis.
 * - **as perdas são declaradas** — o que não atravessa a ponte tem de estar na
 *   lista, não sumir em silêncio.
 * - **o adaptador recusa o que tem de recusar** — versão errada, unidade errada,
 *   gleba degenerada.
 *
 * Os testes usam poucas variantes de propósito: a bateria tem de rodar em
 * segundos. A medição completa é `bun ferramentas/medir.ts`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  apararVias,
  idaParaOMotor,
  rodarEsteira,
  voltaParaOContrato,
  type EntradaV1,
} from "../adapter/src/index.ts";
import { glebaDoLab01 } from "../ferramentas/gleba-lab01.ts";
import { rodarMotor } from "@testfit/api.ts";

const GLEBAS = join(
  import.meta.dirname,
  "..", "..", "..", "..",
  "urban-create-hub-41d93a4d", "docs", "glebas-padrao",
);

const carregar = (id: string): EntradaV1 =>
  JSON.parse(readFileSync(join(GLEBAS, `${id}.entrada.json`), "utf8"));

const SEMENTE = 20260913;
const FORMATOS = ["ortogonal", "pente"] as const;

describe("ida — o contrato vira entrada do motor", () => {
  test("as três glebas atravessam a ida", () => {
    for (const entrada of [carregar("ensaio-47ha"), carregar("geo-antonina"), glebaDoLab01()]) {
      const { entrada: em, perdas } = idaParaOMotor(entrada, { semente: SEMENTE });
      expect(em.terreno.perimetro.length).toBeGreaterThanOrEqual(3);
      expect(em.terreno.areaBruta_m2).toBeGreaterThan(0);
      // A área do anel tem de bater com a declarada dentro de 0,1 %.
      expect(Math.abs(em.terreno.areaBruta_m2 - entrada.gleba.area_m2)).toBeLessThan(
        entrada.gleba.area_m2 * 0.001,
      );
      // Perda sem motivo escrito é perda que ninguém vai entender depois.
      for (const p of perdas) {
        expect(p.campo.length).toBeGreaterThan(0);
        expect(p.motivo.length).toBeGreaterThan(20);
        expect(["alta", "media", "baixa"]).toContain(p.gravidade);
      }
    }
  });

  test("a restrição que desconta entra com o ímã máximo", () => {
    const { entrada: em } = idaParaOMotor(carregar("geo-antonina"), { semente: SEMENTE });
    const queDescontam = em.terreno.restricoes.filter((r) => r.bloqueia);
    expect(queDescontam.length).toBeGreaterThan(0);
    for (const r of queDescontam) expect(r.ima).toBe(3);
  });

  test("atração em linha não entra, e a perda é registrada", () => {
    // A gleba de Antonina traz uma via existente como LINHA — a forma natural
    // dela, e justamente a que o motor não aceita.
    const entrada = carregar("geo-antonina");
    expect(entrada.atracoes.some((a) => a.geometria.tipo === "linha")).toBe(true);
    const { entrada: em, perdas } = idaParaOMotor(entrada, { semente: SEMENTE });
    expect(em.terreno.atracoes.length).toBe(0);
    expect(perdas.some((p) => p.campo.startsWith("atracoes") && p.gravidade === "alta")).toBe(true);
  });

  test("recusa versão, unidade e gleba degenerada", () => {
    const base = carregar("ensaio-47ha");
    expect(() =>
      idaParaOMotor({ ...base, archilly: { ...base.archilly, versao: "2" } }, { semente: 1 }),
    ).toThrow(/versão "2"/);
    expect(() =>
      idaParaOMotor({ ...base, crs: { ...base.crs, unidade: "ft" as "m" } }, { semente: 1 }),
    ).toThrow(/metro/);
    expect(() =>
      idaParaOMotor(
        { ...base, gleba: { ...base.gleba, anel: [{ x: 0, y: 0 }, { x: 1, y: 1 }] } },
        { semente: 1 },
      ),
    ).toThrow(/3 pontos/);
  });
});

describe("volta — o plano vira SAÍDA do contrato", () => {
  test("a largura da via é a caixa, não a caixa mais as calçadas", () => {
    // O lote encosta a `caixa_m / 2` do eixo: a calçada declarada não é
    // reservada. Declarar `caixa + 2 × calçada` fez o Validator reprovar 441 de
    // 441 lotes por falta de frente — ver volta.ts e o relatório.
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1, versaoMotor: "T00-A" });
    for (const [i, v] of saida.vias.entries()) {
      expect(v.largura_m).toBe(plano.vias[i]!.caixa_m);
    }
  });

  test("lote aponta para quadra que existe, ou para nenhuma", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1, versaoMotor: "T00-A" });
    const ids = new Set(saida.quadras.map((q) => q.id));
    for (const l of saida.lotes) {
      if (l.quadraId !== "") expect(ids.has(l.quadraId)).toBe(true);
    }
  });

  test("o CRS da saída é o mesmo da entrada", () => {
    const entrada = carregar("geo-antonina");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1, versaoMotor: "T00-A" });
    expect(saida.crs).toEqual(entrada.crs);
    expect(saida.archilly.versao).toBe("1");
    expect(saida.entrada.contrato).toBe("1");
  });

  test("o quadro de áreas fecha na área bruta", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1, versaoMotor: "T00-A" });
    const q = saida.quadroDeAreas;
    const soma =
      q.areaPrivativa_m2 + q.areaViaria_m2 + q.areaLazer_m2 + q.areaAPP_m2 + q.areaNaoAproveitada_m2;
    expect(Math.abs(soma - q.areaTotal_m2)).toBeLessThan(q.areaTotal_m2 * 0.001);
  });

  test("nada é inventado: faceDeRua e rampa saem nulos", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1, versaoMotor: "T00-A" });
    for (const l of saida.lotes) expect(l.faceDeRua).toBeNull();
    for (const v of saida.vias) expect(v.rampaMedia_pct).toBeNull();
  });
});

describe("aparo — o conserto declarado", () => {
  test("apara só as vias e encurta a rede", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1, versaoMotor: "T00-A" });
    const r = apararVias(saida, entrada.gleba.anel);

    expect(r.comprimentoAparado_m).toBeLessThan(r.comprimentoOriginal_m);
    // Lote, quadra e área especial saem intactos — aparar um lote mudaria a
    // área e a testada dele, que são o que o Validator vai medir.
    expect(r.saida.lotes).toEqual(saida.lotes);
    expect(r.saida.quadras).toEqual(saida.quadras);
    expect(r.saida.areasEspeciais).toEqual(saida.areasEspeciais);
  });
});

describe("a esteira inteira", () => {
  test("ida e volta com julgamento, nas três glebas", () => {
    for (const entrada of [carregar("ensaio-47ha"), carregar("geo-antonina"), glebaDoLab01()]) {
      const r = rodarEsteira(entrada, {
        semente: SEMENTE,
        variantes: 2,
        aparar: true,
        formatos: [...FORMATOS],
      });
      expect(r.variantes.length).toBe(2);
      for (const v of r.variantes) {
        // ATÉ O T02, este teste exigia `not.toBeNull()`: no LAB-07, as 60 de 60
        // variantes eram recusadas pelo esquema sem o aparo, porque 25 % a 40 %
        // do comprimento de via nascia fora da divisa. O T02 consertou isso —
        // medido no LAB-08: 0 de 20 recusadas em `ensaio-47ha`, 2 de 20 em
        // `geo-antonina`, e o aparo do Lab passou a cortar 0,3 % em vez de 38 %.
        //
        // O teste não some: ele passa a guardar a propriedade que interessa
        // agora — que o aparo é OPCIONAL e o resultado com ele passa no esquema.
        // Apagar a linha perderia a memória de por que o aparo existe.
        expect(v.recusa).toBeNull();
        expect(v.relatorio).not.toBeNull();
        expect(v.relatorio!.judge.numLotes).toBeGreaterThan(0);
        expect(v.relatorio!.validator.violacoes).toBeGreaterThanOrEqual(0);
      }
    }
  }, 120_000);

  test("determinismo: mesma semente, mesmo arquivo de contrato", () => {
    const entrada = carregar("ensaio-47ha");
    const opcoes = { variantes: 2, aparar: true, formatos: [...FORMATOS] };
    const a = rodarEsteira(entrada, { ...opcoes, semente: SEMENTE });
    const b = rodarEsteira(entrada, { ...opcoes, semente: SEMENTE });
    const c = rodarEsteira(entrada, { ...opcoes, semente: SEMENTE + 1 });

    const texto = (r: typeof a) => JSON.stringify(r.variantes.map((v) => v.saida));
    expect(texto(a)).toBe(texto(b));
    expect(texto(a)).not.toBe(texto(c));
    expect(a.assinaturaDaRodada).toBe(b.assinaturaDaRodada);
  }, 120_000);

  test("rodar não altera o terreno recebido", () => {
    const entrada = carregar("ensaio-47ha");
    const antes = JSON.stringify(entrada);
    rodarEsteira(entrada, { semente: SEMENTE, variantes: 1, formatos: [...FORMATOS] });
    expect(JSON.stringify(entrada)).toBe(antes);
  }, 60_000);
});

describe("§2.5 — a superquadra nasce vazia", () => {
  test("o formato superquadra não produz lote nenhum, e o plano vazio lidera", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, {
      semente: SEMENTE,
      variantes: 6,
      formatos: ["superquadra"],
    });
    const s = rodarMotor(em);
    const vazias = s.opcoes.filter((o) => o.plano.metricas.lotes === 0).length;
    expect(vazias).toBe(s.opcoes.length);
    expect(s.opcoes[0]!.plano.metricas.lotes).toBe(0);
    // E mesmo assim ele recebe nota — é isso que o põe em primeiro.
    expect(s.opcoes[0]!.plano.nota).toBeGreaterThan(0);
  }, 60_000);
});
