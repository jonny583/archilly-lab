/**
 * AS TRAVAS DO SÉTIMO MECANISMO. (LAB-78, item 011)
 *
 * A pergunta do item era binária na forma — *motor ou faixa?* — e a medição respondeu **motor**.
 * Estas travas guardam a resposta E o caminho até ela, porque o caminho teve um erro meu no meio:
 *
 * > A primeira versão do `deQuemEhAViolacao` devolvia `faixa-alcance` sempre que a projeção do
 * > lote caísse fora da divisa, e ia publicar **um achado contra o Generate** em dois lotes. A
 * > cobertura medida é **100 %**: a faixa cobre a face declarada inteira. Quem estava fora não
 * > era a faixa — era o LOTE, 10 a 13 m além da ponta da face, virando o canto.
 *
 * Então há trava para os **dois** lados: a de que o transbordo é do motor, e a de que
 * `faixa-alcance` **só** sai quando a cobertura é menor que 100 % — a condição que faltava.
 */

import { describe, expect, test } from "bun:test";

import {
  CONTATO_m,
  DONOS,
  VEREDICTOS,
  aContaFecha,
  contarOsVereditos,
  deQuemEhAViolacao,
  type LoteAcusado,
} from "../src/setimo-mecanismo.ts";

/** O molde: tudo medido, e cada teste muda só o que a sua hipótese precisa. */
const base: LoteAcusado = {
  chave: "geo-antonina|frente|v0-e0",
  candidata: "teste",
  tipo: "frente",
  externo: true,
  dAoContornoDaVia_m: 5,
  aoSegmentoDaFaceEntregue_m: 0.2,
  testadaDele_m: 0,
  testadaComPassoFino_m: 0,
  testadaMin_m: 10,
  projecaoDentroDaDivisa: false,
  alemDaFaceDeclarada_m: 13.18,
  coberturaDaFacePct: 100,
  // As duas larguras da faixa, com os números MEDIDOS em Antonina: idênticas, porque a faixa
  // cresce para fora da divisa. É o controle, e ele viaja no molde.
  aFaixaDe8_m: 0.19,
  aFaixaDe10_m: 0.19,
};

const com = (p: Partial<LoteAcusado>): LoteAcusado => ({ ...base, ...p });

describe("o vocabulário é FECHADO", () => {
  test("todo veredicto sai da lista, e todo dono também", () => {
    const casos = [
      base,
      com({ coberturaDaFacePct: 60 }),
      com({ tipo: "testada", testadaDele_m: 8.72, testadaComPassoFino_m: 10.22 }),
      com({ dAoContornoDaVia_m: 0.04, testadaComPassoFino_m: 1.5, alemDaFaceDeclarada_m: 0 }),
      com({ alemDaFaceDeclarada_m: null, coberturaDaFacePct: null, projecaoDentroDaDivisa: null }),
    ];
    for (const c of casos) {
      const v = deQuemEhAViolacao(c);
      expect(VEREDICTOS as readonly string[]).toContain(v.veredicto);
      expect(DONOS as readonly string[]).toContain(v.dono);
    }
  });

  test("a evidência é FRASE com os metros, não rótulo — o item cobra a distância", () => {
    const v = deQuemEhAViolacao(base);
    expect(v.aEvidencia.split(" ").length).toBeGreaterThan(15);
    expect(v.aEvidencia).toContain("13.18 m");
  });
});

describe("O SÉTIMO MECANISMO é do MOTOR: transbordo do canto", () => {
  test("faixa cobrindo 100 % e lote além da ponta → motor", () => {
    const v = deQuemEhAViolacao(base);
    expect(v.veredicto).toBe("motor-transbordo-do-canto");
    expect(v.dono).toBe("motor-testfit");
    expect(v.aEvidencia).toContain("NÃO é curta");
    expect(v.aEvidencia).toContain("face vizinha");
  });

  test("os DOIS lotes medidos em Antonina caem aqui, com os metros deles", () => {
    const cluster = deQuemEhAViolacao(
      com({ chave: "geo-antonina|frente|v16-e15", candidata: "cluster", alemDaFaceDeclarada_m: 13.18, dAoContornoDaVia_m: 5.54 }),
    );
    const pente = deQuemEhAViolacao(
      com({ chave: "geo-antonina|frente|v3-e19", candidata: "pente", alemDaFaceDeclarada_m: 10.43, dAoContornoDaVia_m: 0.04, aoSegmentoDaFaceEntregue_m: 0.29, testadaComPassoFino_m: 1.5 }),
    );
    expect(cluster.veredicto).toBe("motor-transbordo-do-canto");
    expect(pente.veredicto).toBe("motor-transbordo-do-canto");
    expect(cluster.aEvidencia).toContain("13.18 m");
    expect(pente.aEvidencia).toContain("10.43 m");
  });

  test("lote DENTRO da face declarada não é transbordo", () => {
    const v = deQuemEhAViolacao(com({ alemDaFaceDeclarada_m: 0, projecaoDentroDaDivisa: true }));
    expect(v.veredicto).not.toBe("motor-transbordo-do-canto");
  });

  test("um transbordo abaixo do contato não é transbordo — o número é parâmetro", () => {
    const v = deQuemEhAViolacao(com({ alemDaFaceDeclarada_m: 0.01 }));
    expect(v.veredicto).not.toBe("motor-transbordo-do-canto");
    // E o contato é parâmetro: com a folga maior, o mesmo lote passa a transbordar.
    expect(deQuemEhAViolacao(com({ alemDaFaceDeclarada_m: 0.2 }), 0.1).veredicto).toBe(
      "motor-transbordo-do-canto",
    );
    expect(deQuemEhAViolacao(com({ alemDaFaceDeclarada_m: 0.2 }), 1).veredicto).not.toBe(
      "motor-transbordo-do-canto",
    );
  });
});

describe("`faixa-alcance` SÓ sai com cobertura menor que 100 % — o conserto do meu erro", () => {
  test("cobertura de 100 % NUNCA vira achado contra o Generate", () => {
    for (const alem of [0.2, 5, 13.18, 100]) {
      const v = deQuemEhAViolacao(com({ alemDaFaceDeclarada_m: alem, coberturaDaFacePct: 100 }));
      expect(v.veredicto).not.toBe("faixa-alcance");
      expect(v.dono).not.toBe("generate");
    }
  });

  test("cobertura MENOR que 100 % e projeção fora → aí sim é do Generate", () => {
    const v = deQuemEhAViolacao(com({ coberturaDaFacePct: 60 }));
    expect(v.veredicto).toBe("faixa-alcance");
    expect(v.dono).toBe("generate");
    expect(v.aEvidencia).toContain("60 %");
  });

  test("a LARGURA é controle e tem de sair indiferente — medido 0,19 = 0,19", () => {
    // Em Antonina a faixa de 8 m e a de 10 m deixam o lote à MESMA distância, porque a faixa
    // cresce para FORA da divisa. Se este veredicto saísse, a geometria errada seria a minha.
    const v = deQuemEhAViolacao(com({ aFaixaDe8_m: 0.19, aFaixaDe10_m: 0.19 }));
    expect(v.veredicto).not.toBe("faixa-largura");
  });
});

describe("as outras formas, e a que não é de ninguém", () => {
  test("testada que PASSA com passo fino não é mecanismo de ninguém", () => {
    const v = deQuemEhAViolacao(
      com({ tipo: "testada", externo: false, testadaDele_m: 8.72, testadaComPassoFino_m: 10.22, alemDaFaceDeclarada_m: 0 }),
    );
    expect(v.veredicto).toBe("amostragem-da-testada");
    expect(v.dono).toBe("nenhum");
    expect(v.aEvidencia).toContain("o lote PASSA");
  });

  test("encosta na via com contato de lasca → testada curta, do motor", () => {
    const v = deQuemEhAViolacao(
      com({ dAoContornoDaVia_m: 0.04, testadaComPassoFino_m: 1.5, alemDaFaceDeclarada_m: 0 }),
    );
    expect(v.veredicto).toBe("motor-testada-curta");
    expect(v.dono).toBe("motor-testfit");
    expect(v.aEvidencia).toContain("1.5 m");
  });

  test("evidência que não separa sai `nao-decidido` — e isso é medição", () => {
    const v = deQuemEhAViolacao(
      com({ alemDaFaceDeclarada_m: null, coberturaDaFacePct: null, projecaoDentroDaDivisa: null, dAoContornoDaVia_m: null }),
    );
    expect(v.veredicto).toBe("nao-decidido");
    expect(v.dono).toBe("nao-decidido");
    expect(v.aEvidencia).toContain("não separa");
  });

  test("o contato tem valor DECLARADO, e não é zero", () => {
    expect(CONTATO_m).toBeGreaterThan(0);
    expect(CONTATO_m).toBeLessThan(1);
  });
});

describe("a conta FECHA — partição que não soma não é partição (D212)", () => {
  test("a soma por veredicto e por dono é o número de lotes", () => {
    const vs = [
      deQuemEhAViolacao(base),
      deQuemEhAViolacao(com({ coberturaDaFacePct: 60 })),
      deQuemEhAViolacao(com({ tipo: "testada", testadaDele_m: 8.72, testadaComPassoFino_m: 10.22, alemDaFaceDeclarada_m: 0 })),
    ];
    const c = contarOsVereditos(vs);
    expect(c.lotes).toBe(3);
    expect(aContaFecha(c)).toBe(true);
    expect(c.comoSeDiz).toContain("3 lotes acusados");
  });

  test("a conta REPROVA quando a soma não bate", () => {
    const c = contarOsVereditos([deQuemEhAViolacao(base)]);
    expect(aContaFecha({ ...c, lotes: 9 })).toBe(false);
  });
});
