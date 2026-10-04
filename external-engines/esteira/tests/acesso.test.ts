/**
 * A RÉGUA DO ACESSO — o que ela promete, e o que ela não promete. (LAB-28)
 *
 * ```sh
 * bun test tests/acesso.test.ts
 * ```
 *
 * A medição do LAB-28 é das que mudam uma decisão de compra, e por isso a régua
 * dela precisa de trava em três lugares: **onde** os pontos caem, **o que** a
 * amplitude significa, e **o piso** — a ressalva de que seis pontos não varrem o
 * perímetro tem de viajar junto com o número, não ficar só na prosa do relatório.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CHAVES_DO_CONFRONTO,
  MOTORES_DE_LOTE,
  POSICOES_DE_ACESSO,
  agregadosDasPosicoes,
  amplitudePctDe,
  comAcessoEm,
  confrontoDoAcesso,
  instabilidadeDaOrdem,
  posicoesDeAcesso,
  referenciaDe,
  sensibilidadeAoAcesso,
  type ConfrontoDoAcesso,
  type RendimentoNoAcesso,
  type SensibilidadeAoAcesso,
} from "../src/acesso.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import type { P } from "../src/motores/comum.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** Um quadrado de 100 m, o caso em que se sabe a resposta de cabeça. */
const QUADRADO: P[] = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

describe("as posições caem por comprimento de arco, não por vértice", () => {
  test("quatro pontos num quadrado de 100 m caem nos quatro cantos", () => {
    const p = posicoesDeAcesso(QUADRADO, 4);
    expect(p).toHaveLength(4);
    expect(p[0]).toEqual({ x: 0, y: 0 });
    expect(p[1]).toEqual({ x: 100, y: 0 });
    expect(p[2]).toEqual({ x: 100, y: 100 });
    expect(p[3]).toEqual({ x: 0, y: 100 });
  });

  test("oito pontos caem nos cantos E nos meios dos lados", () => {
    const p = posicoesDeAcesso(QUADRADO, 8);
    expect(p).toHaveLength(8);
    expect(p[1]).toEqual({ x: 50, y: 0 });
    expect(p[3]).toEqual({ x: 100, y: 50 });
  });

  test("vértices amontoados num canto NÃO atraem as amostras", () => {
    // É o erro de forma que o D75 e o D93 pegaram, nas duas vezes em que uma
    // régua minha mediu vértice onde devia medir linha. Aqui o lado de baixo tem
    // dez vértices e os outros três têm um: por vértice, 10 das 13 amostras
    // cairiam embaixo. Por arco, elas se espalham.
    const amontoado: P[] = [
      ...Array.from({ length: 10 }, (_, i) => ({ x: i * 10, y: 0 })),
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ];
    const p = posicoesDeAcesso(amontoado, 4);
    const embaixo = p.filter((q) => q.y === 0).length;
    expect(embaixo).toBeLessThanOrEqual(2);
  });

  test("anel degenerado devolve lista vazia, e não estoura", () => {
    expect(posicoesDeAcesso([{ x: 0, y: 0 }, { x: 1, y: 1 }], 4)).toEqual([]);
    expect(posicoesDeAcesso([], 4)).toEqual([]);
  });

  test("as posições são determinísticas — a mesma gleba dá os mesmos pontos", () => {
    const anel = glebaDoLab("sintetico-10ha-plano").gleba.anel as P[];
    expect(JSON.stringify(posicoesDeAcesso(anel))).toBe(JSON.stringify(posicoesDeAcesso(anel)));
  });
});

describe("`comAcessoEm` substitui, e não acrescenta", () => {
  test("a gleba sai com UM acesso, principal, no ponto dado", () => {
    const e = glebaDoLab("sintetico-10ha-plano");
    const r = comAcessoEm(e, { x: 7, y: 9 }) as unknown as {
      acessos: { papel: string; ponto: P; sugerido: boolean }[];
    };
    expect(r.acessos).toHaveLength(1);
    expect(r.acessos[0]!.papel).toBe("principal");
    expect(r.acessos[0]!.ponto).toEqual({ x: 7, y: 9 });
    // `sugerido: false` porque o Lab PÔS o ponto de propósito; dizer "sugerido"
    // faria o motor tratar a hipótese do experimento como palpite do Geo.
    expect(r.acessos[0]!.sugerido).toBe(false);
  });

  test("a gleba que já tinha acesso fica com um só", () => {
    const base = JSON.parse(
      readFileSync(
        join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo", "ensaio-47ha.entrada.json"),
        "utf8",
      ),
    ) as EntradaMinima;
    expect(base.acessos.length).toBe(1);
    const r = comAcessoEm(base, { x: 0, y: 0 }) as unknown as { acessos: unknown[] };
    expect(r.acessos).toHaveLength(1);
  });
});

describe("a amplitude diz o que promete", () => {
  /** Um `medir` de mentira, para a conta ser conferível de cabeça. */
  const medirFake = (porPonto: (number | null)[]) => {
    let i = 0;
    return () => {
      const v = porPonto[i++ % porPonto.length] ?? null;
      return { lotes: v, areaVendavel_m2: v == null ? null : v * 10 };
    };
  };

  test("amplitudePct é sobre o MÍNIMO: 'o melhor rende X % acima do pior'", () => {
    const e = glebaDoLab("sintetico-10ha-plano");
    const s = sensibilidadeAoAcesso(e, medirFake([100, 150, 120, 100, 150, 120]), 6);
    expect(s.lotes.minimo).toBe(100);
    expect(s.lotes.maximo).toBe(150);
    expect(s.lotes.amplitude).toBe(50);
    // 50 sobre 100, não sobre a média — é a frase que o número responde.
    expect(s.lotes.amplitudePct).toBe(50);
  });

  test("amplitude zero é uma MEDIÇÃO, não falta de medição", () => {
    // O Symbios dá exatamente isto, e é verdade: ele não recebe ponto de acesso.
    const e = glebaDoLab("sintetico-10ha-plano");
    const s = sensibilidadeAoAcesso(e, medirFake([80, 80, 80, 80, 80, 80]), 6);
    expect(s.lotes.amplitudePct).toBe(0);
    expect(s.lotes.amplitude).toBe(0);
    expect(s.posicoesMedidas).toBe(6);
  });

  test("posição que o esquema recusou sai de fora da conta, e aparece na contagem", () => {
    const e = glebaDoLab("sintetico-10ha-plano");
    const s = sensibilidadeAoAcesso(e, medirFake([100, null, 150, 100, null, 150]), 6);
    expect(s.posicoes).toBe(6);
    expect(s.posicoesMedidas).toBe(4);
    expect(s.lotes.minimo).toBe(100);
    expect(s.lotes.maximo).toBe(150);
  });

  test("melhor e pior ponto são pontos, para dar para localizar no desenho", () => {
    const e = glebaDoLab("sintetico-10ha-plano");
    const s = sensibilidadeAoAcesso(e, medirFake([100, 150, 120, 100, 150, 120]), 6);
    expect(s.melhorPonto).not.toBeNull();
    expect(s.piorPonto).not.toBeNull();
    expect(typeof s.melhorPonto!.x).toBe("number");
    expect(s.melhorPonto).not.toEqual(s.piorPonto);
  });
});

describe("a ressalva viaja com o número", () => {
  test("`amplitudeEhPiso` está no objeto, não só no relatório", () => {
    // Seis pontos não varrem o perímetro: o melhor e o pior ponto REAIS podem
    // cair entre duas amostras. Quem ler a prova sem ler o relatório tem de
    // encontrar essa ressalva ali mesmo — foi o defeito que o D82 puniu.
    const e = glebaDoLab("sintetico-10ha-plano");
    const s = sensibilidadeAoAcesso(e, () => ({ lotes: 1, areaVendavel_m2: 1 }), 2);
    expect(s.amplitudeEhPiso).toBe(true);
  });

  test("a gleba sem acesso declarado sai com `acessoDeclarado: null`, nunca zero", () => {
    // `null` é não medido; zero é uma medição (D23). As três glebas sintéticas
    // não declaram acesso, e dizer "0 lotes no acesso declarado" seria mentira.
    const e = glebaDoLab("sintetico-10ha-plano");
    expect(e.acessos.length).toBe(0);
    const s = sensibilidadeAoAcesso(e, () => ({ lotes: 5, areaVendavel_m2: 50 }), 2);
    expect(s.acessoDeclarado).toBeNull();
  });

  test("a gleba COM acesso declarado mede esse ponto à parte dos amostrados", () => {
    const base = JSON.parse(
      readFileSync(
        join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo", "ensaio-47ha.entrada.json"),
        "utf8",
      ),
    ) as EntradaMinima;
    let chamadas = 0;
    const s = sensibilidadeAoAcesso(
      base,
      () => {
        chamadas++;
        return { lotes: chamadas, areaVendavel_m2: null };
      },
      3,
    );
    // Três amostras MAIS o acesso declarado: ele não é uma das três.
    expect(chamadas).toBe(4);
    expect(s.acessoDeclarado).not.toBeNull();
    expect(s.porPosicao).toHaveLength(3);
  });

  test("o número de posições é declarado, e é o que a prova carrega", () => {
    expect(POSICOES_DE_ACESSO).toBe(6);
    const prova = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-28", "acesso.json"), "utf8"),
    ) as { posicoesDeAcesso: number; amplitudeEhPiso: boolean; ressalva: string };
    expect(prova.posicoesDeAcesso).toBe(POSICOES_DE_ACESSO);
    expect(prova.amplitudeEhPiso).toBe(true);
    expect(prova.ressalva).toContain("PISO");
  });
});

describe("o confronto é calculado UMA vez, e CONFERIDO contra os números crus", () => {
  /**
   * O conserto do LAB-39.
   *
   * A trava que estava aqui comparava a prova do LAB-19 com a prova do LAB-28 e
   * dizia *"trazem os mesmos números"*. O D131 varreu as sete travas que leem
   * `docs/provas/` e esta foi a única reprovada: **duas provas comparadas entre
   * si, nenhuma medida**. Se as duas fossem regeradas erradas do mesmo jeito —
   * e elas saem da MESMA fórmula, então errariam juntas —, ela passava. Pior: ela
   * ficava vermelha quando uma era regerada e a outra não, que é a família de
   * falso alarme que o §6 chama de régua acusando o medido.
   *
   * Agora cada arquivo é conferido contra o `porPosicao` **dele**: o agregado
   * publicado tem de SEGUIR dos números crus que o próprio arquivo carrega, pela
   * fórmula que mora na régua. Não roda motor nenhum — são 5 glebas × 4 motores ×
   * 6 posições já medidas em disco —, e falsifica de verdade: agregado que não
   * segue dos crus reprova, em qualquer dos dois arquivos, sozinho.
   */
  const LOTE = [...MOTORES_DE_LOTE];

  /** Um bloco de prova vira a sensibilidade que a régua sabe conferir. */
  function sensDaProva(b: {
    porPosicao: RendimentoNoAcesso[];
    acessoDeclarado: RendimentoNoAcesso | null;
  }): SensibilidadeAoAcesso {
    return {
      ...agregadosDasPosicoes(b.porPosicao),
      amplitudeEhPiso: true,
      acessoDeclarado: b.acessoDeclarado,
      porPosicao: b.porPosicao,
    };
  }

  interface BlocoDeMotor extends SensibilidadeAoAcesso {
    motor: string;
  }

  /** As duas provas, cada uma com os blocos por motor e o confronto publicado. */
  const ARQUIVOS: {
    arquivo: string;
    regere: string;
    glebas: { gleba: string; motores: Record<string, BlocoDeMotor>; publicado: ConfrontoDoAcesso }[];
  }[] = (() => {
    const tabela = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-19", "tabela.json"), "utf8"),
    ) as {
      glebas: {
        gleba: string;
        confrontoDoAcesso: ConfrontoDoAcesso;
        motores: Record<string, { acesso: BlocoDeMotor }>;
      }[];
    };
    const lab28 = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-28", "acesso.json"), "utf8"),
    ) as {
      glebas: Record<
        string,
        {
          motores: Record<string, BlocoDeMotor>;
          // Os nomes da RÉGUA nos dois arquivos, desde o LAB-44 (D157).
          confronto: ConfrontoDoAcesso;
        }
      >;
    };
    return [
      {
        arquivo: "LAB-19/tabela.json",
        regere: "bun run lab19",
        glebas: tabela.glebas.map((g) => ({
          gleba: g.gleba,
          // Na tabela do LAB-19 a sensibilidade do acesso é um bloco DENTRO do
          // motor; na prova do LAB-28 ela é o motor. Os nomes diferem, o conteúdo
          // é o mesmo — e a régua só conhece o conteúdo.
          motores: Object.fromEntries(Object.entries(g.motores).map(([k, v]) => [k, v.acesso])),
          publicado: g.confrontoDoAcesso,
        })),
      },
      {
        arquivo: "LAB-28/acesso.json",
        regere: "bun run lab28",
        glebas: Object.entries(lab28.glebas).map(([gleba, g]) => ({
          gleba,
          motores: g.motores,
          publicado: g.confronto,
        })),
      },
    ];
  })();

  test("os dois arquivos publicam o confronto com os MESMOS nomes de chave", () => {
    // ── A trava do LAB-44, e o defeito que ela fecha (D145, D157) ────────────
    //
    // As mesmas três contas saíam com **chaves diferentes nos dois arquivos que o
    // Jonny lê lado a lado**: `amplitudeDoAcesso_pct` na prova do LAB-28 e
    // `maiorAmplitude_pct` na tabela do LAB-19. **Dois nomes para um número é meio
    // caminho para dois números**, e é assim que o D116 começou — ali eram duas
    // montagens da mesma conta; aqui, dois nomes para a mesma saída.
    //
    // A lista dos nomes é DADO (`CHAVES_DO_CONFRONTO`), não só tipo, porque tipo de
    // TypeScript não existe em tempo de execução — e era disso que o defeito
    // precisava para sobreviver num arquivo publicado.
    const esperadas = [...CHAVES_DO_CONFRONTO].sort();
    for (const a of ARQUIVOS) {
      for (const g of a.glebas) {
        expect(
          Object.keys(g.publicado).sort(),
          `${a.arquivo} · ${g.gleba}: as chaves do confronto divergiram da régua`,
        ).toEqual(esperadas);
      }
    }
  });

  test("as duas provas trazem as cinco glebas e os quatro motores", () => {
    // Sem isto, um laço vazio passaria verde dizendo que conferiu tudo.
    for (const a of ARQUIVOS) {
      expect(a.glebas, a.arquivo).toHaveLength(5);
      for (const g of a.glebas) {
        expect(Object.keys(g.motores).sort(), `${a.arquivo} · ${g.gleba}`).toEqual([
          "generate-espinha",
          "generate-ortogonal",
          "parcelamento",
          "symbios",
        ]);
        expect(g.motores["symbios"]!.porPosicao, `${a.arquivo} · ${g.gleba}`).toHaveLength(
          POSICOES_DE_ACESSO,
        );
      }
    }
  });

  test("o AGREGADO de cada motor segue das posições cruas do próprio arquivo", () => {
    const erradas: string[] = [];
    for (const a of ARQUIVOS) {
      for (const g of a.glebas) {
        for (const [mid, bloco] of Object.entries(g.motores)) {
          const refeito = agregadosDasPosicoes(bloco.porPosicao);
          const publicado = {
            posicoes: bloco.posicoes,
            posicoesMedidas: bloco.posicoesMedidas,
            lotes: bloco.lotes,
            areaVendavel_m2: bloco.areaVendavel_m2,
            melhorPonto: bloco.melhorPonto,
            piorPonto: bloco.piorPonto,
          };
          if (JSON.stringify(refeito) !== JSON.stringify(publicado)) {
            erradas.push(`${a.arquivo} · ${g.gleba} · ${mid} (regere com \`${a.regere}\`)`);
          }
        }
      }
    }
    expect(erradas, "agregado publicado que não segue das posições cruas").toEqual([]);
  });

  test("o CONFRONTO publicado segue dos números crus do próprio arquivo", () => {
    const erradas: string[] = [];
    for (const a of ARQUIVOS) {
      for (const g of a.glebas) {
        const sens = Object.fromEntries(
          Object.entries(g.motores).map(([k, v]) => [k, sensDaProva(v)]),
        );
        const refeito = confrontoDoAcesso(sens, LOTE);
        if (JSON.stringify(refeito) !== JSON.stringify(g.publicado)) {
          erradas.push(
            `${a.arquivo} · ${g.gleba}: publicado ${JSON.stringify(g.publicado)} ` +
              `vs refeito dos crus ${JSON.stringify(refeito)} (regere com \`${a.regere}\`)`,
          );
        }
      }
    }
    expect(erradas, "confronto publicado que não segue dos crus").toEqual([]);
  });

  test("a régua REPROVA um agregado que não segue dos crus — sabotagem em memória", () => {
    // Sem isto eu teria uma trava verde e nenhuma prova de que ela aperta. A
    // sabotagem é em memória, numa cópia: nenhum arquivo de prova é tocado.
    const g = ARQUIVOS[0]!.glebas[0]!;
    const sens = Object.fromEntries(
      Object.entries(g.motores).map(([k, v]) => [k, sensDaProva(v)]),
    );
    expect(JSON.stringify(confrontoDoAcesso(sens, LOTE))).toBe(JSON.stringify(g.publicado));

    const sabotado = JSON.parse(JSON.stringify(sens)) as Record<string, SensibilidadeAoAcesso>;
    sabotado["generate-ortogonal"]!.porPosicao[0]!.lotes = 1;
    expect(JSON.stringify(confrontoDoAcesso(sabotado, LOTE))).not.toBe(
      JSON.stringify(g.publicado),
    );
  });

  test("a montagem do confronto é falsificável num caso de cabeça", () => {
    // Dois motores inventados, com números que se conferem de cabeça — para a
    // régua não ser conferida só contra os arquivos que ela mesma produziu.
    const cru = (lotes: (number | null)[]): SensibilidadeAoAcesso =>
      sensDaProva({
        porPosicao: lotes.map((l, i) => ({ ponto: { x: i, y: 0 }, lotes: l, areaVendavel_m2: null })),
        acessoDeclarado: null,
      });
    const c = confrontoDoAcesso({ a: cru([100, 200, null]), b: cru([50, 60]) }, ["b"]);
    // "a" vai de 100 a 200: +100 %. "b" de 50 a 60: +20 %. A maior é 100.
    expect(c.maiorAmplitude_pct).toBe(100);
    // Sem acesso declarado, a referência é a PRIMEIRA posição: 100 e 50 → +100 %.
    expect(c.entreOsQuatroMotores_pct).toBe(100);
    // Um motor só na lista de lote: menos de dois valores, nenhuma diferença.
    expect(c.entreOsMotoresDeLote_pct).toBe(0);
  });

  test("os dois arquivos continuam carregando os MESMOS números crus — detector de prova velha", () => {
    // Esta é a única metade da trava antiga que se salva, e ela está declarada pelo
    // que é (D131): detector de prova velha, não medição. A propriedade é de
    // determinismo — mesma semente, mesmas glebas, mesmas posições —, e ela só cai
    // quando uma das duas foi regerada e a outra não.
    const [a, b] = ARQUIVOS as [(typeof ARQUIVOS)[number], (typeof ARQUIVOS)[number]];
    const cruzar = (x: (typeof ARQUIVOS)[number]) =>
      Object.fromEntries(
        x.glebas.map((g) => [
          g.gleba,
          Object.fromEntries(
            Object.entries(g.motores).map(([k, v]) => [
              k,
              { porPosicao: v.porPosicao, acessoDeclarado: v.acessoDeclarado },
            ]),
          ),
        ]),
      );
    expect(
      JSON.stringify(cruzar(a)),
      "uma das duas provas envelheceu: regere com `bun run lab19 && bun run lab28`",
    ).toBe(JSON.stringify(cruzar(b)));
  });

  test("a conta entre os QUATRO motores é maior que a dos três de lote", () => {
    // Não é curiosidade: é a razão de haver duas contas. Incluir o Symbios — que
    // entrega quadra, e cujos lotes são da subdivisão do Lab (D50) — infla a
    // diferença "entre motores" a ponto de responder outra pergunta. Se um dia
    // esta desigualdade se invertesse, a justificativa das duas contas caiu.
    const tabela = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-19", "tabela.json"), "utf8"),
    ) as {
      glebas: {
        confrontoDoAcesso: { entreOsQuatroMotores_pct: number; entreOsMotoresDeLote_pct: number };
      }[];
    };
    for (const g of tabela.glebas) {
      expect(g.confrontoDoAcesso.entreOsQuatroMotores_pct).toBeGreaterThanOrEqual(
        g.confrontoDoAcesso.entreOsMotoresDeLote_pct,
      );
    }
  });

  test("`referenciaDe` prefere o acesso DECLARADO, e cai na primeira amostra sem ele", () => {
    const comDeclarado = {
      acessoDeclarado: { ponto: { x: 0, y: 0 }, lotes: 500, areaVendavel_m2: null },
      porPosicao: [{ ponto: { x: 1, y: 1 }, lotes: 100, areaVendavel_m2: null }],
    };
    const semDeclarado = { acessoDeclarado: null, porPosicao: comDeclarado.porPosicao };
    expect(referenciaDe(comDeclarado as never)).toBe(500);
    expect(referenciaDe(semDeclarado as never)).toBe(100);
    expect(referenciaDe({ acessoDeclarado: null, porPosicao: [] } as never)).toBeNull();
  });

  test("`amplitudePctDe` é sobre o mínimo, e um valor só não tem amplitude", () => {
    expect(amplitudePctDe([100, 150])).toBe(50);
    expect(amplitudePctDe([100, null, 150])).toBe(50);
    expect(amplitudePctDe([100])).toBe(0);
    expect(amplitudePctDe([])).toBe(0);
    // Mínimo zero não dá porcentagem: dividir por zero daria Infinity, e
    // publicar "Infinity %" é pior que publicar 0.
    expect(amplitudePctDe([0, 50])).toBe(0);
  });
});

describe("a ordem dos motores aguenta o acesso mudar? — a régua do LAB-34", () => {
  /** Monta uma sensibilidade só com o que esta régua lê. */
  const sens = (lotes: (number | null)[]) =>
    ({
      posicoes: lotes.length,
      posicoesMedidas: lotes.filter((l) => l != null).length,
      amplitudeEhPiso: true,
      lotes: { minimo: null, maximo: null, mediana: null, amplitude: null, amplitudePct: null },
      areaVendavel_m2: { minimo: null, maximo: null, mediana: null, amplitude: null, amplitudePct: null },
      melhorPonto: null,
      piorPonto: null,
      acessoDeclarado: null,
      porPosicao: lotes.map((l) => ({ ponto: { x: 0, y: 0 }, lotes: l, areaVendavel_m2: null })),
    }) as unknown as SensibilidadeAoAcesso;

  test("ordem estável: os números mudam, a ordem não", () => {
    const o = instabilidadeDaOrdem({ a: sens([100, 200, 300]), b: sens([10, 20, 30]) });
    expect(o.posicoesComparaveis).toBe(3);
    expect(o.ordensDistintas).toBe(1);
    expect(o.vencedores).toEqual(["a"]);
    expect(o.naoResponderam).toEqual({});
  });

  test("ordem instável: o primeiro lugar troca de mão", () => {
    const o = instabilidadeDaOrdem({ a: sens([100, 10]), b: sens([10, 100]) });
    expect(o.ordensDistintas).toBe(2);
    expect(o.vencedores.sort()).toEqual(["a", "b"]);
  });

  test("POSIÇÃO EM QUE UM MOTOR NÃO RESPONDE NÃO ENTRA na conta da ordem", () => {
    // Esta é a trava do erro que eu quase publiquei (D132). Contando a posição em
    // que `a` não respondeu, a ordem "mudaria" — mas o que mudou foi um motor
    // SAIR da comparação, que é outra afirmação. A primeira contagem que eu fiz
    // misturava as duas e dava "a ordem muda em 4 de 5 glebas" em vez de 3.
    const o = instabilidadeDaOrdem({ a: sens([100, null]), b: sens([10, 10]) });
    expect(o.posicoes).toBe(2);
    expect(o.posicoesComparaveis, "a posição sem resposta de `a` tinha de ficar fora").toBe(1);
    expect(o.ordensDistintas).toBe(1);
    expect(o.vencedores).toEqual(["a"]);
  });

  test("a ausência não é descartada: ela sai contada e nomeada", () => {
    // "Este motor não desenha nada aceitável se a rua entrar aqui" também é
    // resposta, e sumir com ela seria inventar silêncio (D23, em espírito).
    const o = instabilidadeDaOrdem({ a: sens([100, null, null]), b: sens([10, 10, 10]) });
    expect(o.naoResponderam).toEqual({ a: 2 });
  });

  test("sem posição comparável nenhuma, a régua não finge ordem", () => {
    const o = instabilidadeDaOrdem({ a: sens([null, null]), b: sens([10, 10]) });
    expect(o.posicoesComparaveis).toBe(0);
    expect(o.ordensDistintas).toBe(0);
    expect(o.vencedores).toEqual([]);
  });

  test("o medido nas cinco glebas: a ordem muda em 3, e o vencedor em 2", () => {
    // Lido da prova e conferido contra a régua — e é detector de prova velha, não
    // fonte da verdade (D131): se a medição mudar, isto reprova e manda regerar.
    const prova = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-19", "tabela.json"), "utf8"),
    ) as {
      glebas: {
        gleba: string;
        ordemDoAcesso: { posicoesComparaveis: number; ordensDistintas: number; vencedores: string[] };
      }[];
    };
    expect(prova.glebas).toHaveLength(5);
    const mudaAOrdem = prova.glebas.filter((g) => g.ordemDoAcesso.ordensDistintas > 1);
    const mudaOVencedor = prova.glebas.filter((g) => g.ordemDoAcesso.vencedores.length > 1);
    expect(mudaAOrdem.length, "regere com bun run lab19 — a ordem mudou de comportamento").toBe(3);
    expect(mudaOVencedor.length, "regere com bun run lab19").toBe(2);

    // E a única gleba em que a ordem aguenta as SEIS posições é a `ensaio-47ha`.
    const estaveis = prova.glebas.filter(
      (g) => g.ordemDoAcesso.ordensDistintas === 1 && g.ordemDoAcesso.posicoesComparaveis === 6,
    );
    expect(estaveis.map((g) => g.gleba)).toEqual(["ensaio-47ha"]);
  });
});
