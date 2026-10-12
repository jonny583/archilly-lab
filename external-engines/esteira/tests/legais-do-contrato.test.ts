/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-93 · item 026 — as travas dos quatro campos de `legais`.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O que elas guardam, e cada uma nasceu de um defeito **desta** rodada:
 *
 * 1. **a LISTA não pode discordar da RODADA em silêncio.** A `OS_QUATRO` declara o
 *    que eu li no fonte do motor; a prova do LAB-93 declara o que a esteira viu
 *    acontecer. Eu escrevi *"a face de quadra MUDA o desenho"* lendo o fonte, e a
 *    rodada disse que não muda. Divergência é permitida — o que não é permitido é
 *    ela não estar **escrita** no campo `porQueNaoMordeAqui`;
 * 2. **`null` nunca vira zero.** É o D23, e aqui ele morde de verdade: zero em
 *    `rampaMaximaDeVia_pct` diria ao motor que a rampa máxima da via é 0 %;
 * 3. **"não havia o que entregar" não é "não tem efeito".** A conta tem veredicto
 *    próprio para a passagem que entregou `null`, e a trava cobra que ele apareça
 *    quando nenhuma gleba traz valor;
 * 4. **as três perdas sob suspeita estão NOMEADAS.** A D226 contou três e não disse
 *    quais em nenhum dos cinco lugares onde a frase saiu;
 * 5. **o inventário acompanha.** Perda que saiu da lista não pode continuar `perda`
 *    no inventário da ida, e a que ficou não pode ter virado destino.
 *
 * Elas **não leem clone vizinho nenhum** — só módulos puros deste repositório e a
 * prova em JSON —, e por isso vão no trabalho de CI que roda sem segredo.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  NENHUM_ENTREGUE,
  ONDE_ISTO_FOI_LIDO,
  OS_LEGAIS_POR_PADRAO,
  OS_QUATRO,
  O_QUE_O_CONTRATO_PUBLICA,
  legaisDoContrato,
  type CampoLegal,
} from "../../testfit/adapter/src/legais-do-contrato.ts";
import type { ParametrosV1 } from "../../testfit/adapter/src/contrato-v1.ts";
import { AS_TRES_SOB_SUSPEITA, aContaDasPerdas } from "../src/perdas-remedidas.ts";
import { IDA_DO_PARCELAMENTO } from "../src/inventario-das-idas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-93", "as-cinco-passagens.json");

interface ContaDoCampoNaProva {
  campo: CampoLegal["campo"];
  passagem: string | null;
  glebasComValor: number;
  mudaramODesenho: number;
  soMudaramAviso: number;
  veredicto: string;
  aListaDeclarava: string;
}
const prova = (): {
  glebas: string[];
  aConta: { glebas: number; porCampo: ContaDoCampoNaProva[] };
  porGleba: { gleba: string; mudaramODesenho: string[]; soMudaramAVISO: string[] }[];
  osDeltas: { gleba: string; passagem: string; grandeza: string }[];
} => JSON.parse(readFileSync(PROVA, "utf8"));

/** Um `ParametrosV1` de teste, com valor nos três que o contrato publica. */
const PARAMS: ParametrosV1 = {
  areaMinLote_m2: 200,
  areaAlvoLote_m2: 360,
  areaMaxLote_m2: 600,
  testadaMinLote_m: 10,
  caixaViariaMin_m: 8,
  caixaPrincipal_m: 11.5,
  caixaSecundaria_m: 10,
  calcada_m: null,
  faceQuadraMax_m: 200,
  pctAreaPublica: null,
  pctAPP: 15,
  pctLazer: 10,
  rampaMaxima_pct: 7,
};

describe("LAB-93 · os quatro campos de `legais`, declarados", () => {
  test("são QUATRO, com nome único, e cada um diz o que o motor faz e onde", () => {
    expect(OS_QUATRO).toHaveLength(4);
    expect(new Set(OS_QUATRO.map((c) => c.campo)).size).toBe(4);
    for (const c of OS_QUATRO) {
      expect(c.onde, c.campo).toMatch(/^src\/lib\/lab\/[a-z]+\.ts:\d+ · \w+$/);
      expect(c.oQueDecide.length, c.campo).toBeGreaterThan(40);
      expect(["confere-e-avisa", "muda-o-desenho", "troca-o-corte-da-conferencia"]).toContain(
        c.oQueOMotorFaz,
      );
    }
  });

  test("`doContrato` só aponta para campo que o `ParametrosV1` publica — ou para `null`", () => {
    for (const c of OS_QUATRO) {
      if (c.oContratoPublica) {
        expect(O_QUE_O_CONTRATO_PUBLICA as readonly string[], c.campo).toContain(
          c.doContrato as string,
        );
        expect(PARAMS as unknown as Record<string, unknown>, c.campo).toHaveProperty(
          c.doContrato as string,
        );
      } else {
        expect(
          O_QUE_O_CONTRATO_PUBLICA as readonly string[],
          `${c.campo} diz que o contrato não publica — então o nome não pode estar na lista`,
        ).not.toContain(c.doContrato as string);
      }
    }
  });

  test("a procedência grava as DUAS profundidades e o sha de cada trecho lido (D294)", () => {
    expect(ONDE_ISTO_FOI_LIDO.cloneQueCompila).toMatch(/^[0-9a-f]{7,40}$/);
    expect(ONDE_ISTO_FOI_LIDO.origemNaLeitura).toMatch(/^[0-9a-f]{7,40}$/);
    const shas = Object.values(ONDE_ISTO_FOI_LIDO.identicosNosDois);
    expect(shas.length).toBeGreaterThanOrEqual(5);
    for (const h of shas) expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  test("o que a esteira passa a usar são os TRÊS que o contrato publica", () => {
    const publicam = OS_QUATRO.filter((c) => c.oContratoPublica).map((c) => c.campo);
    expect([...(OS_LEGAIS_POR_PADRAO as readonly string[])].sort()).toEqual([...publicam].sort());
  });
});

describe("LAB-93 · `legaisDoContrato` — os dois sentidos, e o `null` que não vira zero", () => {
  test("entrega o que o contrato publica quando a passagem pede", () => {
    const r = legaisDoContrato(PARAMS, true);
    expect(r.caixaViariaMinima_m).toBe(8);
    expect(r.faceQuadraMaxima_m).toBe(200);
    expect(r.rampaMaximaDeVia_pct).toBe(7);
  });

  test("o que o contrato NÃO publica sai `null` mesmo pedindo tudo — nunca zero (D23)", () => {
    const r = legaisDoContrato(PARAMS, true);
    expect(r.declividadeMaximaDeLote_pct).toBeNull();
    expect(r.declividadeMaximaDeLote_pct).not.toBe(0);
  });

  test("passagem SEM devolve os quatro `null` — e é a passagem que o §4 exige existir", () => {
    expect(legaisDoContrato(PARAMS, false)).toEqual(NENHUM_ENTREGUE);
    for (const v of Object.values(NENHUM_ENTREGUE)) expect(v).toBeNull();
  });

  test("a lista entrega UM por vez, que é o que separa o campo culpado do vizinho", () => {
    const r = legaisDoContrato(PARAMS, ["faceQuadraMaxima_m"]);
    expect(r.faceQuadraMaxima_m).toBe(200);
    expect(r.caixaViariaMinima_m).toBeNull();
    expect(r.rampaMaximaDeVia_pct).toBeNull();
  });

  test("contrato com valor ausente sai `null`, e não zero — o campo que o arquivo não falou", () => {
    const r = legaisDoContrato({ ...PARAMS, rampaMaxima_pct: null }, true);
    expect(r.rampaMaximaDeVia_pct).toBeNull();
    expect(r.caixaViariaMinima_m).toBe(8);
  });

  test("valor não-finito do contrato sai `null` — `NaN` não é medição", () => {
    const r = legaisDoContrato({ ...PARAMS, caixaViariaMin_m: Number.NaN }, true);
    expect(r.caixaViariaMinima_m).toBeNull();
  });
});

describe("LAB-93 · a LISTA não discorda da RODADA em silêncio", () => {
  test("todo campo da prova é campo da lista, e a conta cobre os quatro", () => {
    const p = prova();
    expect(p.aConta.porCampo.map((c) => c.campo)).toEqual(OS_QUATRO.map((c) => c.campo));
    expect(p.aConta.glebas).toBe(p.glebas.length);
    expect(p.aConta.glebas).toBeGreaterThanOrEqual(9);
  });

  test("campo que a lista disse que MUDA o desenho e a rodada diz que não tem o motivo ESCRITO", () => {
    const porCampo = new Map(prova().aConta.porCampo.map((c) => [c.campo, c]));
    for (const c of OS_QUATRO) {
      const medido = porCampo.get(c.campo)!;
      const aRodadaViuMudar = medido.mudaramODesenho > 0;
      expect(c.aquiMudouODesenho === "sim", `${c.campo}: a lista e a rodada discordam`).toBe(
        aRodadaViuMudar,
      );
      if (c.aquiMudouODesenho === "nao" && c.oQueOMotorFaz === "muda-o-desenho") {
        expect(
          c.porQueNaoMordeAqui,
          `${c.campo}: o fonte diz que entra na geometria e a rodada diz que não morde — o ` +
            "motivo tem de estar escrito, não subentendido",
        ).toBeTruthy();
      }
    }
  });

  test("o veredicto da conta bate com os números dela, campo por campo", () => {
    for (const c of prova().aConta.porCampo) {
      if (c.veredicto === "o-contrato-nao-publica") {
        expect(OS_QUATRO.find((x) => x.campo === c.campo)!.oContratoPublica).toBe(false);
      } else if (c.veredicto === "nao-havia-o-que-entregar") {
        expect(c.glebasComValor, c.campo).toBe(0);
      } else if (c.veredicto === "entregue-mudou-o-desenho") {
        expect(c.mudaramODesenho, c.campo).toBeGreaterThan(0);
      } else if (c.veredicto === "entregue-so-passou-a-avisar") {
        expect(c.mudaramODesenho, c.campo).toBe(0);
        expect(c.soMudaramAviso, c.campo).toBeGreaterThan(0);
      } else {
        expect(c.veredicto, c.campo).toBe("entregue-nada-se-moveu");
        expect(c.mudaramODesenho + c.soMudaramAviso, c.campo).toBe(0);
        expect(c.glebasComValor, c.campo).toBeGreaterThan(0);
      }
    }
  });

  test("campo entregue em gleba nenhuma NÃO pode sair como “nada se moveu”", () => {
    for (const c of prova().aConta.porCampo) {
      if (c.glebasComValor === 0 && c.passagem !== null) {
        expect(
          c.veredicto,
          `${c.campo}: nenhuma gleba traz valor, então a passagem mediu a GLEBA e não o campo`,
        ).toBe("nao-havia-o-que-entregar");
      }
    }
  });

  test("todo delta publicado é de uma gleba e de uma passagem que a prova conhece", () => {
    const p = prova();
    const glebas = new Set(p.glebas);
    const passagens = new Set(p.aConta.porCampo.map((c) => c.passagem).filter(Boolean));
    passagens.add("os-tres");
    for (const d of p.osDeltas) {
      expect(glebas.has(d.gleba), d.gleba).toBe(true);
      expect(passagens.has(d.passagem), d.passagem).toBe(true);
    }
  });
});

describe("LAB-93 · as TRÊS perdas sob suspeita, nomeadas e remedidas", () => {
  test("são três, com nome, frase antiga, veredicto, medição e data", () => {
    expect(AS_TRES_SOB_SUSPEITA).toHaveLength(3);
    expect(aContaDasPerdas().total).toBe(3);
    for (const p of AS_TRES_SOB_SUSPEITA) {
      expect(p.campo).toMatch(/^parametros\./);
      expect(p.oQueDizia.length, p.campo).toBeGreaterThan(30);
      expect(p.oQueAMedicaoDisse.length, p.campo).toBeGreaterThan(60);
      expect(p.remedidaEm).toBe("2026-10-12");
    }
  });

  test("a soma dos vereditos fecha a lista — partição, não amostra", () => {
    const c = aContaDasPerdas();
    expect(
      c["saiu-da-lista"] + c["fica-remedida"] + c["nao-era-dessa-familia"],
    ).toBe(c.total);
  });

  test("as três SÃO as três perdas do bloco de parâmetros do inventário", () => {
    const noInventario = Object.entries(IDA_DO_PARCELAMENTO)
      .filter(([campo, d]) => campo.startsWith("parametros.") && d.tipo === "perda")
      .map(([campo]) => campo);
    // Depois do LAB-93 sobrou UMA perda; as outras duas viraram destino traduzido.
    expect(noInventario).toEqual(["parametros.pctAreaPublica"]);
    expect(AS_TRES_SOB_SUSPEITA.map((p) => p.campo)).toContain("parametros.pctAreaPublica");
  });

  test("quem SAIU da lista tem destino no inventário; quem ficou NÃO tem", () => {
    for (const p of AS_TRES_SOB_SUSPEITA) {
      const d = (IDA_DO_PARCELAMENTO as Record<string, { tipo: string } | undefined>)[p.campo];
      expect(d, p.campo).toBeDefined();
      if (p.veredicto === "saiu-da-lista") {
        expect(d!.tipo, p.campo).toBe("traduzido");
        expect(p.destinoAgora, p.campo).toMatch(/^terreno\.legais\./);
      } else {
        expect(d!.tipo, p.campo).toBe("perda");
        expect(p.destinoAgora, p.campo).toBeNull();
      }
    }
  });

  test("o destino escrito na releitura é o MESMO que o inventário declara", () => {
    for (const p of AS_TRES_SOB_SUSPEITA) {
      if (p.destinoAgora === null) continue;
      const d = (IDA_DO_PARCELAMENTO as Record<string, { tipo: string; caminho?: string }>)[
        p.campo
      ]!;
      expect(d.caminho, p.campo).toBe(p.destinoAgora);
    }
  });
});
