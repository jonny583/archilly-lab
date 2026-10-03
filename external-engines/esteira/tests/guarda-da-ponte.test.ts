/**
 * A GUARDA DA PONTE — o teste que impede a quarta vez. (LAB-25)
 *
 * ```sh
 * bun test tests/guarda-da-ponte.test.ts
 * ```
 *
 * # Por que este arquivo vale mais que uma medição nova
 *
 * O §6 do `CLAUDE.md` pegou o mesmo ponto cego três vezes (D75, D93/D94, D98), e
 * nas três o Lab estava a um passo de acusar o motor de um vizinho por um
 * defeito do Lab. A terceira não foi erro de conta: foi um **comentário
 * envelhecendo em silêncio**. Comentário não se revalida; teste se revalida.
 *
 * Este arquivo tem quatro andares, e a ordem não é decorativa:
 *
 * | andar | o que prova |
 * |---|---|
 * | **1 · o mecanismo** | as três regras pegam o que prometem, em amostra sintética |
 * | **2 · a falsificação** | uma ponte sabotada de propósito É pega — sem isto, verde não quer dizer nada |
 * | **3 · as pontes de verdade** | hoje nenhuma das duas descarta campo publicado |
 * | **4 · a volta do D104** | o `faceDeRua` que a guarda achou não pode voltar a `null` |
 *
 * O andar 2 é o que separa esta guarda de uma guarda de enfeite. Um teste que
 * só é verde nunca provou que sabe ficar vermelho.
 */
import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import { paraSaida } from "@generate/contratos/motor-v1/traducao.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { apararVias } from "../../testfit/adapter/src/aparo.ts";
import type { EntradaV1, SaidaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import {
  auditarObjeto,
  auditarPonte,
  REGRAS_QUE_REPROVAM,
  reprovam,
  type ObjetoAuditado,
} from "../src/guarda-da-ponte.ts";
import { auditarParcelamento, auditarSymbios } from "../src/guarda-em-acao.ts";
import {
  LOTE_DO_PARCELAMENTO,
  VIA_DO_PARCELAMENTO,
  objetosDaPonteDoParcelamento,
} from "../src/inventario-das-pontes.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);
const SEMENTE = 20260913;

/** A mesma gleba rápida da porta: os quatro motores rodam nela num piscar. */
const GLEBA = "sintetico-10ha-plano";

let wasm: Motor;
beforeAll(async () => {
  wasm = await Motor.carregar(readFileSync(WASM));
});

// ═════════════════════ andar 1 · o mecanismo das três regras ═══════════════

describe("as três regras pegam o que prometem", () => {
  test("`campo-vazio`: a SAÍDA sai null e o motor tinha o número — é o D98", () => {
    // A forma EXATA do D98: o motor mede a rampa, a ponte escreve `null`.
    const o: ObjetoAuditado = {
      nome: "via",
      inventario: { rampaMedia_pct: { tipo: "atravessa", contrato: "rampaMedia_pct" } },
      doMotor: [{ rampaMedia_pct: 7.4 }, { rampaMedia_pct: 3.1 }],
      doContrato: [{ rampaMedia_pct: null }, { rampaMedia_pct: null }],
    };
    const a = reprovam(auditarObjeto("falsa", o));
    expect(a).toHaveLength(1);
    expect(a[0]!.regra).toBe("campo-vazio");
    expect(a[0]!.campo).toBe("via[].rampaMedia_pct");
    expect(a[0]!.amostras).toEqual({ comAchado: 2, total: 2 });
    expect(a[0]!.exemplo).toBe(7.4);
  });

  test("`campo-vazio` NÃO acusa quando o próprio motor não mediu", () => {
    // Esta é a metade que importa: `null` que vem do motor é resposta, não perda
    // (D23). Uma guarda que confundisse as duas seria desligada em uma semana.
    const o: ObjetoAuditado = {
      nome: "via",
      inventario: { rampaMedia_pct: { tipo: "atravessa", contrato: "rampaMedia_pct" } },
      doMotor: [{ rampaMedia_pct: null }, { rampaMedia_pct: 3.1 }],
      doContrato: [{ rampaMedia_pct: null }, { rampaMedia_pct: 3.1 }],
    };
    expect(reprovam(auditarObjeto("falsa", o))).toHaveLength(0);
  });

  test("`campo-vazio` pega mesmo quando o inventário MENTE", () => {
    // O casamento por nome é o que torna a regra independente do inventário: uma
    // ponte que declarasse a perda com motivo bonito seria pega igual, porque o
    // motor publica o campo com o MESMO nome. Era o caso do D98.
    const o: ObjetoAuditado = {
      nome: "via",
      inventario: { rampaMedia_pct: { tipo: "perda", motivo: "o motor não calcula greide" } },
      doMotor: [{ rampaMedia_pct: 7.4 }],
      doContrato: [{ rampaMedia_pct: null }],
    };
    const a = reprovam(auditarObjeto("falsa", o));
    expect(a).toHaveLength(1);
    expect(a[0]!.regra).toBe("campo-vazio");
  });

  test("`campo-novo`: o motor ganhou um campo e o inventário não soube", () => {
    const o: ObjetoAuditado = {
      nome: "via",
      inventario: { caixa_m: { tipo: "atravessa", contrato: "largura_m" } },
      doMotor: [{ caixa_m: 10, rampaMaxima_pct: 12.5 }],
      doContrato: [{ largura_m: 10 }],
    };
    const a = reprovam(auditarObjeto("falsa", o));
    expect(a).toHaveLength(1);
    expect(a[0]!.regra).toBe("campo-novo");
    expect(a[0]!.campo).toBe("via[].rampaMaxima_pct");
    expect(a[0]!.exemplo).toBe(12.5);
  });

  test("`mapa-velho` avisa e NÃO reprova — campo opcional falta de verdade", () => {
    const o: ObjetoAuditado = {
      nome: "lote",
      inventario: {
        id: { tipo: "atravessa", contrato: "id" },
        travado: { tipo: "perda", motivo: "fixação pelo usuário" },
      },
      doMotor: [{ id: "L1" }],
      doContrato: [{ id: "L1" }],
    };
    const todos = auditarObjeto("falsa", o);
    expect(todos.map((x) => x.regra)).toEqual(["mapa-velho"]);
    expect(reprovam(todos)).toHaveLength(0);
    expect(REGRAS_QUE_REPROVAM).not.toContain("mapa-velho");
  });

  test("uma ponte sem nada a esconder não produz achado que reprove", () => {
    const o: ObjetoAuditado = {
      nome: "via",
      inventario: {
        caixa_m: { tipo: "atravessa", contrato: "largura_m" },
        calcada_m: { tipo: "perda", motivo: "declarada e não reservada na geometria" },
      },
      doMotor: [{ caixa_m: 10, calcada_m: 1.5 }],
      doContrato: [{ largura_m: 10 }],
    };
    expect(reprovam(auditarObjeto("falsa", o))).toHaveLength(0);
  });
});

// ═══════════════ andar 2 · a guarda sabe ficar VERMELHA ════════════════════

describe("a falsificação — uma ponte sabotada é pega", () => {
  test("sabotar `rampaMedia_pct` na ponte do Parcelamento reprova (o D98 de novo)", () => {
    const r = rodarTestfit(glebaDoLab(GLEBA), SEMENTE);
    const saida = r.saida as unknown as SaidaV1;
    // A sabotagem é exatamente o que a ponte fazia até o LAB-22: escrever `null`
    // no campo que o motor mede.
    const sabotada = {
      ...saida,
      vias: saida.vias.map((v) => ({ ...v, rampaMedia_pct: null })),
    };
    const objetos: ObjetoAuditado[] = [
      {
        nome: "via",
        inventario: VIA_DO_PARCELAMENTO,
        // O "motor" aqui é a SAÍDA de verdade, que carrega os mesmos nomes de
        // campo de rampa — é o que torna a sabotagem detectável por nome.
        doMotor: saida.vias as unknown as Record<string, unknown>[],
        doContrato: sabotada.vias as unknown as Record<string, unknown>[],
      },
    ];
    const a = reprovam(auditarPonte("sabotada", objetos));
    expect(a.length).toBeGreaterThan(0);
    expect(a.some((x) => x.campo === "via[].rampaMedia_pct" && x.regra === "campo-vazio")).toBe(true);
  });

  test("sabotar `faceDeRua` reprova — é o achado que o LAB-25 colheu de verdade", () => {
    const r = rodarTestfit(glebaDoLab(GLEBA), SEMENTE);
    const saida = r.saida as unknown as SaidaV1;
    const comoEraAntes = saida.lotes.map((l) => ({ ...l, faceDeRua: null }));
    const a = reprovam(
      auditarObjeto("sabotada", {
        nome: "lote",
        inventario: LOTE_DO_PARCELAMENTO,
        doMotor: saida.lotes as unknown as Record<string, unknown>[],
        doContrato: comoEraAntes as unknown as Record<string, unknown>[],
      }),
    );
    expect(a.some((x) => x.campo === "lote[].faceDeRua")).toBe(true);
  });

  test("apagar uma entrada do inventário reprova por `campo-novo`", () => {
    const semRampa = { ...VIA_DO_PARCELAMENTO };
    delete (semRampa as Record<string, unknown>)["rampaMaxima_pct"];
    const r = rodarTestfit(glebaDoLab(GLEBA), SEMENTE);
    const saida = r.saida as unknown as SaidaV1;
    const a = reprovam(
      auditarObjeto("sabotada", {
        nome: "via",
        inventario: semRampa,
        doMotor: saida.vias as unknown as Record<string, unknown>[],
        doContrato: saida.vias as unknown as Record<string, unknown>[],
      }),
    );
    expect(a.some((x) => x.campo === "via[].rampaMaxima_pct" && x.regra === "campo-novo")).toBe(true);
  });
});

// ═══════════════ andar 3 · as duas pontes de verdade, hoje ═════════════════

describe("as pontes do Lab não descartam campo que o motor publica", () => {
  test("a ponte do Laboratório de Parcelamento está limpa", () => {
    const a = reprovam(auditarParcelamento(glebaDoLab(GLEBA), SEMENTE).achados);
    expect(a.map((x) => `${x.regra} ${x.campo}`)).toEqual([]);
  });

  test("a ponte do Symbios está limpa", () => {
    const a = reprovam(auditarSymbios(wasm, glebaDoLab(GLEBA), SEMENTE).achados);
    expect(a.map((x) => `${x.regra} ${x.campo}`)).toEqual([]);
  });

  test("o inventário cobre TODOS os campos que os motores publicam", () => {
    // É a regra 2 lida do outro lado: nenhum `campo-novo` significa que cada
    // campo publicado tem destino escrito. É esta a frase que pode envelhecer, e
    // é por isso que ela é um teste.
    const p = auditarParcelamento(glebaDoLab(GLEBA), SEMENTE);
    const s = auditarSymbios(wasm, glebaDoLab(GLEBA), SEMENTE);
    for (const r of [p, s]) {
      expect(r.achados.filter((x) => x.regra === "campo-novo").map((x) => x.campo)).toEqual([]);
    }
  });
});

// ═══════════════ andar 4 · o D104 não pode voltar ══════════════════════════

describe("o `faceDeRua` que a guarda achou", () => {
  test("a ponte publica o id da via, não `null`", () => {
    const r = rodarTestfit(glebaDoLab(GLEBA), SEMENTE);
    const saida = r.saida as unknown as SaidaV1;
    const ids = new Set(saida.vias.map((v) => v.id));
    const comFace = saida.lotes.filter((l) => l.faceDeRua != null);
    // Não é "a maioria": o motor mede desde o T02 e o que ele não mede é pouco.
    expect(comFace.length).toBeGreaterThan(saida.lotes.length * 0.9);
    // E todo id publicado existe no arquivo — o esquema do Generate recusa o
    // arquivo INTEIRO quando um lote aponta para via que não está nele.
    for (const l of comFace) expect(ids.has(l.faceDeRua!)).toBe(true);
  });

  test("o aparo apaga a face que apontava para via descartada, e conta", () => {
    const entrada = glebaDoLab(GLEBA);
    const r = rodarTestfit(entrada, SEMENTE);
    const saida = r.saida as unknown as SaidaV1;
    // Uma gleba minúscula faz o aparo descartar quase tudo: é o jeito de provar
    // que o apagamento acontece sem depender de qual via sai em qual gleba.
    const anelMinusculo = [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 5, y: 5 },
      { x: 0, y: 5 },
    ];
    const comFaceAntes = saida.lotes.filter((l) => l.faceDeRua != null).length;
    const ap = apararVias(saida, anelMinusculo);
    const idsQueSobraram = new Set(ap.saida.vias.map((v) => v.id));
    expect(ap.viasDescartadas).toBeGreaterThan(0);
    expect(ap.facesApagadas).toBeGreaterThan(0);
    expect(ap.facesApagadas).toBeLessThanOrEqual(comFaceAntes);
    // Nenhuma face morta sobrevive ao aparo.
    for (const l of ap.saida.lotes) {
      if (l.faceDeRua != null) expect(idsQueSobraram.has(l.faceDeRua)).toBe(true);
    }
  });

  test("o aparo de uma gleba inteira não apaga face nenhuma", () => {
    const entrada = glebaDoLab(GLEBA);
    const r = rodarTestfit(entrada, SEMENTE);
    const saida = r.saida as unknown as SaidaV1;
    const ap = apararVias(saida, (entrada as unknown as EntradaV1).gleba.anel);
    expect(ap.facesApagadas).toBe(0);
  });

  test("o inventário não deixa o campo voltar a ser perda sem motivo medido", () => {
    // O inventário é documento vivo: se alguém reescrever `faceDeRua` como
    // perda, a regra `campo-vazio` o pega — mas só se o campo for de fato
    // descartado. Este teste prende a OUTRA metade: o destino declarado.
    const d = LOTE_DO_PARCELAMENTO["faceDeRua"]!;
    expect(d.tipo).toBe("traduzido");
    if (d.tipo === "traduzido") {
      expect(d.contrato).toBe("faceDeRua");
      expect(d.como).toContain("V<i+1>");
    }
  });

  test("a auditoria de verdade, montada pelos objetos da ponte, vê os dois lados", () => {
    const r = rodarTestfit(glebaDoLab(GLEBA), SEMENTE);
    const objetos = objetosDaPonteDoParcelamento(
      { vias: [], lotes: [], areas: [], bolsoes: [], metricas: {} },
      r.saida as unknown as Record<string, unknown>,
    );
    // Sem amostra do motor não há o que acusar: a guarda não inventa achado.
    expect(reprovam(auditarPonte("vazia", objetos)).length).toBe(0);
  });
});

// ═══════════ as duas réguas do `faceDeRua`, uma contra a outra ═════════════

describe("o campo que a ponte descartava, posto contra a régua do Generate", () => {
  test("os ids de via sobrevivem à volta, e a concordância é alta", () => {
    const entrada = glebaDoLab(GLEBA);
    const r = rodarTestfit(entrada, SEMENTE);
    const nossa = r.saida as unknown as SaidaV1;
    const l = montarParcelamentoExterno(r.saida as never, {
      entrada: entrada as unknown as EntradaMotorV1,
    });
    expect(l.conferencia.valido).toBe(true);
    const deles = paraSaida(l.externo!.resultado, {
      motor: { nome: "regua-do-generate", versao: "0" },
      crs: nossa.crs as never,
    });

    // O casamento é por ID, então o que precisa bater é o CONJUNTO, não a ordem:
    // o `paraSaida` emite `[...principal, ...secundarias]` e isso reordena a
    // lista em algumas glebas. Comparar ordem aqui produziria achado inventado.
    const ordenados = (v: { id: string }[]) => v.map((x) => x.id).sort();
    expect(ordenados(deles.vias)).toEqual(ordenados(nossa.vias));

    const doGenerate = new Map(deles.lotes.map((x) => [x.id, x.faceDeRua]));
    let concordam = 0;
    let divergem = 0;
    for (const lote of nossa.lotes) {
      const g = doGenerate.get(lote.id) ?? null;
      if (lote.faceDeRua == null || g == null) continue;
      if (lote.faceDeRua === g) concordam++;
      else divergem++;
    }
    expect(concordam + divergem).toBeGreaterThan(100);
    // O piso é 85 % porque as duas réguas são DIFERENTES de propósito e o lote de
    // esquina pode cair nas duas. Medido nas cinco glebas: 91,5 % a 99,8 %. Um
    // valor abaixo disto não é "régua tolerante demais" — é sinal de que a
    // tradução do índice para id saiu do lugar.
    expect((100 * concordam) / (concordam + divergem)).toBeGreaterThan(85);
  });
});
