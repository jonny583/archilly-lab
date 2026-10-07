/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-59 · As travas do contrafactual de Antonina.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A conclusão deste prompt é uma frase que vai à página do Jonny — *"o motor prefere 33 lotes
 * a 1.228 porque a nota dele prefere, e não porque a de 1.228 seja inválida"* —, e ela só vale
 * se quatro coisas forem verdade ao mesmo tempo:
 *
 * 1. **a aferição fecha**: a 1ª do ranking reproduz o número do LAB-53, senão o contrafactual
 *    não mede futuro nenhum;
 * 2. **as calibrações estão em zero**: as três grandezas que este prompt mede por candidata
 *    reproduzem, na vencedora, o que o LAB-50, o LAB-54 e o LAB-53 mediram;
 * 3. **as órfãs saem CARACTERIZADAS**: `MECANISMO-NAO-NOMEADO` é um número publicado com os
 *    traços dos lotes dele, nunca um balde fechado — foi o balde que quase fez este prompt
 *    publicar o contrário da verdade;
 * 4. **os cenários são MONÓTONOS**: quem aprova resolvendo menos tem de aprovar resolvendo
 *    mais. Cenário que perde candidata ao resolver mais coisa é contradição, não medição.
 *
 * E uma quinta, que é do §4: **a escolha é do motor**. A primeira entre as que aprovam tem de
 * ser a de melhor `notaDoMotor` — se alguém puser outra ali, o Lab passou a escolher variante.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-59", "contrafactual-de-antonina.json");

type Cenario = { violacoesQueRestam: number; aprovaria: boolean; oQueAindaBloqueia: string[] };
type Candidata = {
  posicaoNoRankingDele: number;
  formato: string;
  notaDoMotor: number;
  lotes?: number;
  violacoesHoje?: number;
  porTipo?: Record<string, number>;
  porMecanismo?: Record<string, number>;
  naoNomeadas?: string[];
  oQueAsNaoNomeadasTemEmComum?: {
    quantas: number;
    porTipo: Record<string, number>;
    externas: number;
    internas: number;
    encostamNaVia: number;
    lista: Record<string, unknown>[];
  } | null;
  cenarios?: Record<string, Cenario>;
  recusadaPeloEsquema?: string[];
};
type Prova = {
  gleba: string;
  aAfericao: { oLab53: { variante: string; violacoes: number }; medidoAqui: { formato: string; violacoes: number } };
  aCalibracao: {
    discordancias: number; qual: string; eMais: string; aTerceiraMedicaoViva: string; porqueNaoSaoLIDAS: string;
  };
  aEscolhaEhDELE: string;
  cenarios: {
    id: string;
    quantasAprovam: number;
    deQuantas: number;
    aPrimeiraNoRankingDELE: { formato: string; lotes: number; notaDoMotor: number } | null;
    todasQueAprovam: { formato: string; lotes: number; notaDoMotor: number }[];
  }[];
  candidatas: Candidata[];
};
const prova = JSON.parse(readFileSync(PROVA, "utf8")) as Prova;
const julgadas = prova.candidatas.filter((c) => c.cenarios);

describe("LAB-59 · a aferição fecha, senão não há contrafactual", () => {
  test("a 1ª do ranking reproduz o número que o LAB-53 mediu nesta gleba", () => {
    expect(prova.aAfericao.medidoAqui.violacoes).toBe(prova.aAfericao.oLab53.violacoes);
    expect(prova.aAfericao.oLab53.variante).toContain(prova.aAfericao.medidoAqui.formato);
  });

  test("o cenário `hoje` aprova ZERO — é o presente, e ele é vermelho", () => {
    const hoje = prova.cenarios.find((c) => c.id === "hoje")!;
    expect(hoje.quantasAprovam).toBe(0);
    expect(hoje.aPrimeiraNoRankingDELE).toBeNull();
  });
});

describe("LAB-59 · as três medições por candidata vêm CALIBRADAS", () => {
  test("zero discordâncias contra o LAB-50, o LAB-54 e o LAB-53", () => {
    expect(prova.aCalibracao.discordancias).toBe(0);
  });

  test("e a prova DECLARA as três, e por que não são lidas", () => {
    expect(prova.aCalibracao.eMais).toContain("LAB-54");
    expect(prova.aCalibracao.eMais).toContain("LAB-50");
    expect(prova.aCalibracao.aTerceiraMedicaoViva).toContain("faixaViaPublica");
    expect(prova.aCalibracao.porqueNaoSaoLIDAS).toContain("MECANISMO-NAO-NOMEADO");
  });
});

describe("LAB-59 · as órfãs saem CARACTERIZADAS, nunca como balde fechado", () => {
  test("toda candidata com órfã publica os traços delas", () => {
    for (const c of julgadas) {
      const n = c.porMecanismo?.["MECANISMO-NAO-NOMEADO"] ?? 0;
      if (n === 0) continue;
      expect(c.oQueAsNaoNomeadasTemEmComum, `${c.formato}: ${n} órfã(s) sem caracterização`).not.toBeNull();
      expect(c.oQueAsNaoNomeadasTemEmComum!.quantas).toBe(n);
      expect(c.oQueAsNaoNomeadasTemEmComum!.lista).toHaveLength(n);
      expect(c.naoNomeadas).toHaveLength(n);
    }
  });

  test("e o que bloqueia uma candidata no cenário mais largo SAI NOMEADO", () => {
    for (const c of julgadas) {
      const d = c.cenarios!["os-dois"]!;
      if (d.aprovaria) continue;
      expect(d.oQueAindaBloqueia.length, `${c.formato}: não aprova e não diz o que a bloqueia`).toBeGreaterThan(0);
      expect(d.violacoesQueRestam).toBeGreaterThan(0);
    }
  });
});

describe("LAB-59 · os cenários são MONÓTONOS — resolver mais nunca aprova menos", () => {
  const maisLargo: Record<string, string[]> = {
    hoje: ["so-o-contrato", "so-o-motor", "os-dois"],
    "so-o-contrato": ["os-dois"],
    "so-o-motor": ["os-dois"],
  };
  for (const [estreito, largos] of Object.entries(maisLargo)) {
    for (const largo of largos) {
      test(`quem aprova em \`${estreito}\` aprova em \`${largo}\``, () => {
        for (const c of julgadas) {
          if (!c.cenarios![estreito]!.aprovaria) continue;
          expect(
            c.cenarios![largo]!.aprovaria,
            `${c.formato} aprova em ${estreito} e NÃO em ${largo} — resolver mais coisa não pode tirar aprovação`,
          ).toBe(true);
        }
      });
    }
  }

  test("e as violações que restam nunca crescem ao resolver mais", () => {
    for (const c of julgadas) {
      expect(c.cenarios!["os-dois"]!.violacoesQueRestam).toBeLessThanOrEqual(c.cenarios!["so-o-motor"]!.violacoesQueRestam);
      expect(c.cenarios!["os-dois"]!.violacoesQueRestam).toBeLessThanOrEqual(c.cenarios!["so-o-contrato"]!.violacoesQueRestam);
      expect(c.cenarios!["so-o-motor"]!.violacoesQueRestam).toBeLessThanOrEqual(c.cenarios!["hoje"]!.violacoesQueRestam);
    }
  });
});

describe("LAB-59 · a escolha é DO MOTOR, e a trava mede isso", () => {
  for (const cen of ["hoje", "so-o-contrato", "so-o-motor", "os-dois"]) {
    test(`\`${cen}\`: a primeira entre as que aprovam é a de melhor nota DELE`, () => {
      const c = prova.cenarios.find((x) => x.id === cen)!;
      if (!c.todasQueAprovam.length) {
        expect(c.aPrimeiraNoRankingDELE).toBeNull();
        return;
      }
      const melhorNota = Math.max(...c.todasQueAprovam.map((x) => x.notaDoMotor));
      expect(c.aPrimeiraNoRankingDELE!.notaDoMotor).toBe(melhorNota);
    });
  }

  test("as contagens dos cenários são CONTADAS, não declaradas", () => {
    for (const c of prova.cenarios) {
      expect(c.todasQueAprovam).toHaveLength(c.quantasAprovam);
      expect(c.deQuantas).toBe(julgadas.length);
      const daLista = julgadas.filter((x) => x.cenarios![c.id]!.aprovaria).length;
      expect(daLista, `${c.id}: o campo diz ${c.quantasAprovam} e a lista das candidatas tem ${daLista}`).toBe(c.quantasAprovam);
    }
  });

  test("a prova DECLARA que o Lab não escolhe variante (§4)", () => {
    expect(prova.aEscolhaEhDELE).toContain("NÃO escolhe");
  });
});

describe("LAB-59 · a resposta à pendência do Jonny, como MEDIÇÃO e não como frase", () => {
  /**
   * A pergunta dele é *"preferir 33 lotes a 1.228 é de propósito?"*, e a resposta só é
   * medição se as duas pontas estiverem na prova: a de 1.228 **aprovando** no cenário em que
   * tudo foi resolvido, e a nota dela sendo **menor** que a da de 33. Se uma das duas deixar
   * de ser verdade, a frase da página do Jonny precisa ser remedida — não mantida.
   */
  const dois = prova.cenarios.find((c) => c.id === "os-dois")!;

  test("a candidata de MAIS lotes aprova no cenário em que tudo foi resolvido", () => {
    const maisLotes = julgadas.reduce((a, b) => ((b.lotes ?? 0) > (a.lotes ?? 0) ? b : a));
    expect(
      maisLotes.cenarios!["os-dois"]!.aprovaria,
      `a de mais lotes ("${maisLotes.formato}", ${maisLotes.lotes}) NÃO aprova nem resolvido tudo — ` +
        "a frase da página do Jonny diz o contrário e tem de ser remedida",
    ).toBe(true);
  });

  test("e a nota DELE ainda prefere a de MENOS lotes — é isso que responde o Jonny", () => {
    const primeira = dois.aPrimeiraNoRankingDELE!;
    const maisLotes = dois.todasQueAprovam.reduce((a, b) => (b.lotes > a.lotes ? b : a));
    expect(maisLotes.lotes).toBeGreaterThan(primeira.lotes);
    expect(
      primeira.notaDoMotor,
      "a nota dele deixou de preferir a de menos lotes — a resposta ao Jonny mudou de sinal",
    ).toBeGreaterThan(maisLotes.notaDoMotor);
  });
});
