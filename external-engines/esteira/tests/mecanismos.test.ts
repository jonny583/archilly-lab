/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-58 · As travas do agrupamento das 81 por MECANISMO.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A pergunta do prompt é **"quantos mecanismos distintos existem"**, e essa pergunta só tem
 * resposta se a atribuição for uma **partição**: cada violação em um mecanismo, e em um só.
 * As três travas que importam são, nesta ordem:
 *
 * 1. **a soma fecha** — mecanismos + não nomeadas = as 81, e as 81 = 92 menos as do contrato;
 * 2. **ninguém casa duas vezes** — predicado que casa dois mecanismos é dupla contagem, e
 *    dupla contagem numa lista que vira fila de conserto faz consertar duas vezes, ou nenhuma;
 * 3. **a chave da junção leva o TIPO** — e esta trava existe porque o par curto me pegou
 *    DENTRO deste prompt: sete dos 85 lotes acusados têm mais de uma violação, e juntar por
 *    `(gleba, loteId)` etiqueta uma `via-sobre-lote` com a classe de uma `frente` do mesmo
 *    lote. A trava mede a discordância entre as duas chaves em vez de confiar na lembrança.
 *
 * E uma quarta, que é do §4: **todo mecanismo declara onde foi LIDO no motor do vizinho**, e
 * a declaração diz que foi leitura. Lista de conserto que não diz onde olhou obriga o motor
 * a procurar; lista que não diz "lido, não tocado" deixa dúvida sobre o que este repositório
 * fez no clone alheio.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  MECANISMOS,
  NAO_NOMEADO,
  atribuirMecanismo,
  decidirMecanismo,
  mecanismosQueCasam,
  type Limites,
  type ViolacaoMedida,
} from "../src/mecanismos-das-violacoes.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-58", "mecanismos-das-81.json");

type Prova = {
  total: { as92: number; doContratoDoGenerate: number; doMotor: number; mecanismosDistintosComViolacao: number; naoNomeadas: number };
  aMedicaoNova: { discordancias: number; calibracao: string };
  aChaveDaJuncao: { qual: string };
  mecanismos: {
    numero: number; id: string; emUmaLinha: string; oQueOMotorFaz: string; ondeNoMotor: string;
    aProvaQueSustenta: string; oPredicadoMedido: string; violacoes: number; porGleba: Record<string, number>;
    lotes: string[];
  }[];
  naoNomeadas: unknown[];
  violacoes: (ViolacaoMedida & { mecanismo: string })[];
};
const prova = JSON.parse(readFileSync(PROVA, "utf8")) as Prova;
const LIMITES: Limites = { tolDele_m: 0.75, mesmaProfundidade_m: 0.5 };

describe("LAB-58 · a soma fecha, e ela é a conta do MVP", () => {
  test("mecanismos + não nomeadas = as do motor", () => {
    const soma = prova.mecanismos.reduce((s, m) => s + m.violacoes, 0);
    expect(soma + prova.total.naoNomeadas).toBe(prova.total.doMotor);
  });

  test("as do motor = as 92 menos as do contrato do Generate", () => {
    expect(prova.total.doMotor + prova.total.doContratoDoGenerate).toBe(prova.total.as92);
  });

  test("a lista por lote tem exatamente uma linha por violação do motor", () => {
    expect(prova.violacoes.length).toBe(prova.total.doMotor);
    expect(new Set(prova.violacoes.map((v) => v.chave)).size).toBe(prova.total.doMotor);
  });

  test("a contagem de cada mecanismo é a contagem da lista dele, não um número à parte", () => {
    for (const m of prova.mecanismos) {
      const daLista = prova.violacoes.filter((v) => v.mecanismo === m.id).length;
      expect(daLista, `${m.id}: o campo diz ${m.violacoes} e a lista tem ${daLista}`).toBe(m.violacoes);
      expect(m.lotes.length).toBe(m.violacoes);
    }
  });

  test("`mecanismosDistintosComViolacao` é CONTADO, não declarado", () => {
    expect(prova.total.mecanismosDistintosComViolacao).toBe(prova.mecanismos.filter((m) => m.violacoes > 0).length);
  });
});

describe("LAB-58 · ninguém casa duas vezes — a partição é disjunta", () => {
  test("cada violação medida casa com UM predicado, ou com nenhum", () => {
    const duplas: string[] = [];
    for (const v of prova.violacoes) {
      const casam = mecanismosQueCasam(v, LIMITES);
      if (casam.length > 1) duplas.push(`${v.chave}: ${casam.join(", ")}`);
    }
    expect(duplas, `casam com mais de um mecanismo: ${duplas.join(" | ")}`).toEqual([]);
  });

  test("e o mecanismo gravado na prova é o que os predicados devolvem hoje", () => {
    for (const v of prova.violacoes) {
      expect(atribuirMecanismo(v, LIMITES), `${v.chave}`).toBe(v.mecanismo);
    }
  });

  test("os seis se excluem POR CONSTRUÇÃO: quatro pelo tipo, dois pelo lado dos 0,75 m", () => {
    // Não é prosa: é a conferência de que cada tipo tem no máximo um mecanismo, e que os
    // dois de `frente` interna pedem lados OPOSTOS da mesma tolerância.
    const porTipo = new Map<string, string[]>();
    for (const v of prova.violacoes) {
      const arr = porTipo.get(v.tipo) ?? [];
      if (!arr.includes(v.mecanismo)) arr.push(v.mecanismo);
      porTipo.set(v.tipo, arr);
    }
    expect(porTipo.get("testada")).toHaveLength(1);
    expect(porTipo.get("face-quadra")).toHaveLength(1);
    expect(porTipo.get("via-sobre-lote")).toHaveLength(1);
    // `frente` é o único tipo com mais de um mecanismo, e a separação é externo × distância.
    const frentes = prova.violacoes.filter((v) => v.tipo === "frente");
    const porMec = new Map<string, { externo: boolean; d: number | null }[]>();
    for (const f of frentes) {
      const arr = porMec.get(f.mecanismo) ?? [];
      arr.push({ externo: f.externo, d: f.dAoContornoDaVia_m });
      porMec.set(f.mecanismo, arr);
    }
    expect(porMec.get("faixa-externa-sem-limite-longitudinal")!.every((x) => x.externo)).toBe(true);
    expect(porMec.get("fileira-sem-via-propria")!.every((x) => !x.externo && (x.d ?? 0) > 0.75)).toBe(true);
    expect(porMec.get("fileira-encosta-na-via-so-de-esguelha")!.every((x) => !x.externo && (x.d ?? 9) <= 0.75)).toBe(true);
  });

  test("e o caminho do ESTOURO é alcançável — a decisão não escolhe, ela para", () => {
    expect(decidirMecanismo(["um"], "x|frente|L1")).toBe("um");
    expect(decidirMecanismo([], "x|frente|L1")).toBe(NAO_NOMEADO);
    expect(() => decidirMecanismo(["um", "dois"], "x|frente|L1")).toThrow(/dupla contagem/);
  });

  test("violação que nenhum predicado alcança sai NÃO NOMEADA, e não no mecanismo mais parecido", () => {
    const orfa: ViolacaoMedida = {
      gleba: "sintetica", tipo: "sobreposicao", loteId: "X1", chave: "sintetica|sobreposicao|X1",
      externo: false, quadraId: null, facesDaQuadra_m: null, facesAcimaDoTeto: null, facesAbaixoDoTeto: null,
      tetoDeFace_m: 200, dAoContornoDaVia_m: 0, verticesDoLote: 4, arestas_m: [10, 20, 10, 20],
      maiorAresta_m: 20, profundidadeModalDaFileira_m: 20, lotesNaQuadra: 10, testadaDele_m: 10,
      testadaMin_m: 10, aoSegmentoDaFaceEntregue_m: null, classe_LAB54: null, testadaComPassoFino_m: null,
      doContratoDoGenerate: false,
    };
    expect(atribuirMecanismo(orfa, LIMITES)).toBe(NAO_NOMEADO);
  });
});

describe("LAB-58 · a chave da junção leva o TIPO — e o par curto erra NA FRONTEIRA", () => {
  /**
   * **Esta seção mudou de ESCOPO dentro do prompt, e a trava é que mandou.**
   *
   * A primeira versão media os lotes com duas violações **dentro das 81** e devolveu
   * **zero**: nas 81 do motor cada lote carrega uma violação só. Medido onde a junção de
   * fato acontece — nas **92** da prova do LAB-53 —, os sete existem, e são **exatamente**
   * os sete cuja `frente` é do contrato e cuja `via-sobre-lote` é do motor.
   *
   * Então a conclusão ficou mais estreita, e mais útil: *a chave curta não erra em qualquer
   * lugar; ela erra na fronteira entre o que é do contrato e o que é do motor* (D189, D172).
   */
  const chave = prova.aChaveDaJuncao as unknown as {
    qual: string;
    lotesComMaisDeUmaViolacao_nas92: number;
    delesNaFronteiraContratoXMotor: number;
    lotesComMaisDeUmaViolacao_entreAs81: number;
  };

  test("nas 92 há lote com mais de uma violação, e TODOS eles estão na fronteira", () => {
    expect(chave.lotesComMaisDeUmaViolacao_nas92).toBeGreaterThan(0);
    expect(
      chave.delesNaFronteiraContratoXMotor,
      "lote com duas violações que NÃO cruza a fronteira contrato × motor passou a existir — " +
        "a conclusão deste prompt precisa ser remedida, não copiada",
    ).toBe(chave.lotesComMaisDeUmaViolacao_nas92);
  });

  test("e nas 81 do motor cada lote tem UMA — é por isso que a conclusão é a da FRONTEIRA", () => {
    expect(chave.lotesComMaisDeUmaViolacao_entreAs81).toBe(0);
    const porLote = new Map<string, number>();
    for (const v of prova.violacoes) {
      const k = `${v.gleba}|${v.loteId}`;
      porLote.set(k, (porLote.get(k) ?? 0) + 1);
    }
    expect([...porLote.values()].filter((n) => n > 1)).toEqual([]);
  });

  test("juntar as classes do LAB-54 pelo par curto etiqueta violação de outro tipo — MEDIDO", () => {
    // O LAB-54 classificou SÓ `frente`. Juntar a classe dele pelo par (gleba, lote) — e não
    // por (gleba, tipo, lote) — dá classe a violações que ele nunca classificou.
    const l54 = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-54", "frente-nao-atribuida.json"), "utf8"),
    ) as { violacoes: { gleba: string; loteId: string; classe: string }[] };
    const l53 = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-53", "violacoes-depois-do-conserto-da-ponte.json"), "utf8"),
    ) as { violacoes: { gleba: string; tipo: string; loteId: string | null }[] };

    const curto = new Map(l54.violacoes.map((v) => [`${v.gleba}|${v.loteId}`, v.classe]));
    const completo = new Map(l54.violacoes.map((v) => [`${v.gleba}|frente|${v.loteId}`, v.classe]));

    const etiquetadasAToa = l53.violacoes.filter(
      (v) => v.tipo !== "frente" && curto.has(`${v.gleba}|${v.loteId}`),
    );
    expect(
      etiquetadasAToa.length,
      "o par curto deixou de etiquetar violação de outro tipo — ou as provas mudaram, ou esta " +
        "trava perdeu o objeto; nos dois casos se remede, não se apaga",
    ).toBeGreaterThan(0);
    // e a chave completa não etiqueta nenhuma delas
    expect(etiquetadasAToa.filter((v) => completo.has(`${v.gleba}|${v.tipo}|${v.loteId}`))).toEqual([]);
  });

  test("a prova DECLARA qual é a chave", () => {
    expect(chave.qual).toContain("tipo");
  });
});

describe("LAB-58 · a régua nova vem CALIBRADA contra a função do Generate", () => {
  test("zero discordâncias entre a minha distância e a classe que ele mediu", () => {
    expect(prova.aMedicaoNova.discordancias).toBe(0);
  });

  test("e a prova diz contra o que foi calibrada", () => {
    expect(prova.aMedicaoNova.calibracao).toContain("LAB-54");
    expect(prova.aMedicaoNova.calibracao).toContain("0.75");
  });
});

describe("LAB-58 · cada mecanismo declara o suficiente para virar item de fila", () => {
  for (const mec of MECANISMOS) {
    test(`${mec.id}: tem as cinco declarações, e a do motor diz que foi LEITURA`, () => {
      for (const [campo, valor] of [
        ["emUmaLinha", mec.emUmaLinha],
        ["oQueOMotorFaz", mec.oQueOMotorFaz],
        ["ondeNoMotor", mec.ondeNoMotor],
        ["aProvaQueSustenta", mec.aProvaQueSustenta],
        ["oPredicadoMedido", mec.oPredicadoMedido],
      ] as const) {
        expect(valor.length, `${mec.id}: \`${campo}\` curto demais para servir de item`).toBeGreaterThan(20);
      }
      expect(mec.ondeNoMotor).toContain("motor-testfit");
      expect(
        /lido|lida/i.test(mec.ondeNoMotor),
        `${mec.id}: \`ondeNoMotor\` não diz que a leitura foi SÓ leitura (§4)`,
      ).toBe(true);
      expect(/LAB-\d\d/.test(mec.aProvaQueSustenta), `${mec.id}: a prova não cita prompt`).toBe(true);
    });
  }

  test("a prova que cada mecanismo cita por CAMINHO existe no disco", () => {
    const faltando: string[] = [];
    for (const mec of MECANISMOS) {
      for (const m of mec.aProvaQueSustenta.matchAll(/docs\/provas\/[\w./-]+\.json/g)) {
        if (!existsSync(join(RAIZ, m[0]))) faltando.push(`${mec.id} → ${m[0]}`);
      }
    }
    expect(faltando, `prova citada que não existe: ${faltando.join(", ")}`).toEqual([]);
  });

  test("os ids são únicos e a prova numera na ordem da lista", () => {
    expect(new Set(MECANISMOS.map((m) => m.id)).size).toBe(MECANISMOS.length);
    expect(prova.mecanismos.map((m) => m.id)).toEqual(MECANISMOS.map((m) => m.id));
    expect(prova.mecanismos.map((m) => m.numero)).toEqual(MECANISMOS.map((_, i) => i + 1));
  });
});
