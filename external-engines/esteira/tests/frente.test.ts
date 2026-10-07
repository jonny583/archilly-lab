/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-54 · As travas do probe de amostragem e da conclusão que ele produziu.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **A mais importante não é nenhuma das contagens: é o SALDO.** Dos 11 lotes em que a
 * régua do Generate muda de resposta com amostragem fina, **zero** deixariam de ser
 * violação: a frontagem real é de 1,5 a 5,49 m contra um mínimo de 10, então a violação
 * troca de `frente` para `testada` e o total não se move.
 *
 * Se algum dia esse zero virar outra coisa, a conclusão do LAB-54 mudou — e quem lê
 * precisa saber por uma trava vermelha, não por um relatório de três semanas atrás.
 *
 * > **Régua que erra o RÓTULO e acerta o VEREDICTO não é régua errada — e consertá-la não
 * > derruba violação nenhuma** (D184).
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { _testadaDoLote } from "@generate/engine/invariantes.ts";

import {
  AREA_PODE_MUDAR_ATE_M2,
  PODE_SAIR_DA_BORDA_ATE_M,
  amostrasParaOPasso,
  area,
  areaMudou,
  densificar,
  probeMexeuNoObjeto,
  saiuDaBorda,
  type Ponto,
} from "../src/probe-de-amostragem.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA_54 = join(RAIZ, "docs", "provas", "LAB-54", "frente-nao-atribuida.json");
const PROVA_53 = join(RAIZ, "docs", "provas", "LAB-53", "violacoes-depois-do-conserto-da-ponte.json");
const FERRAMENTA = join(RAIZ, "external-engines", "esteira", "ferramentas", "lab54.ts");

const CLASSES = ["regua-amostragem-no-meio-da-aresta", "motor-sem-via-perto", "NAO-REPRODUZIU"];

describe("LAB-54 · o probe não mexe no objeto que mede", () => {
  const quadrado: Ponto[] = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];

  test("densificar preserva a área — é a precondição inteira do probe", () => {
    expect(area(quadrado)).toBe(100);
    for (const k of [2, 3, 8, 64, 137]) {
      const d = densificar(quadrado, k);
      expect(d.length, `k=${k}: densificar tem de multiplicar os vértices`).toBe(4 * k);
      expect(
        areaMudou(quadrado, d),
        `k=${k}: densificar MUDOU a geometria — aí não é probe, é conserto disfarçado`,
      ).toBeLessThanOrEqual(AREA_PODE_MUDAR_ATE_M2);
    }
  });

  /**
   * **A trava que a sabotagem exigiu** (D186).
   *
   * A primeira versão desta suíte conferia só a área, e eu sabotei `densificar` deslocando
   * todos os pontos em 1 cm: **passou**. Deslocar TODOS é uma translação, e translação não
   * muda área. Num probe que mede DISTÂNCIA até o leito da via, escorregar o lote para o
   * lado da rua é exatamente o conserto disfarçado que a precondição existia para impedir.
   */
  test("probe TRANSLADADO é reprovado — área igual não é borda igual", () => {
    const transladado = densificar(quadrado, 8).map((p) => ({ x: p.x + 0.01, y: p.y }));
    expect(areaMudou(quadrado, transladado), "a translação não muda a área, e é o ponto").toBeLessThanOrEqual(
      AREA_PODE_MUDAR_ATE_M2,
    );
    expect(saiuDaBorda(quadrado, transladado)).toBeGreaterThan(PODE_SAIR_DA_BORDA_ATE_M);
    expect(probeMexeuNoObjeto(quadrado, transladado), "o probe transladado passou pela precondição").not.toBeNull();
    expect(probeMexeuNoObjeto(quadrado, transladado)).toContain("borda");
  });

  test("probe honesto passa pelas DUAS precondições", () => {
    for (const k of [2, 8, 137]) {
      expect(probeMexeuNoObjeto(quadrado, densificar(quadrado, k)), `k=${k}`).toBeNull();
    }
  });

  test("densificar UMA aresta só mexe nela, e também preserva a área", () => {
    const d = densificar(quadrado, 10, 2);
    expect(d.length).toBe(3 + 10); // três arestas intactas + uma com 10 passos
    expect(areaMudou(quadrado, d)).toBeLessThanOrEqual(AREA_PODE_MUDAR_ATE_M2);
  });

  test("o passo sai do comprimento da aresta, não de um número redondo", () => {
    expect(amostrasParaOPasso(34.16, 0.25)).toBe(137);
    expect(amostrasParaOPasso(0.1, 0.25), "aresta curta ainda ganha duas amostras").toBe(2);
  });
});

describe("LAB-54 · o mecanismo é REAL, e isto não depende de gleba nenhuma", () => {
  /**
   * A demonstração sintética do que o probe mede, com a função DO GENERATE.
   *
   * Um lote de 34 × 12 m cuja aresta de baixo encosta num leito de via **só nos 2 m da
   * ponta esquerda**. O meio dessa aresta está a 17 m do leito, então a função dele não a
   * vê — e com amostragem fina ela vê.
   *
   * **Isto é o que torna a conclusão falsificável fora das cinco glebas:** se um dia a
   * função dele deixar de amostrar o meio, este teste fica vermelho e a explicação do
   * LAB-54 deixa de valer.
   */
  const lote: Ponto[] = [
    { x: 0, y: 0 },
    { x: 34, y: 0 },
    { x: 34, y: 12 },
    { x: 0, y: 12 },
  ];
  // Faixa de via: um retângulo logo abaixo, cobrindo só de x=0 a x=2.
  const leito: Ponto[] = [
    { x: 0, y: -8 },
    { x: 2, y: -8 },
    { x: 2, y: 0 },
    { x: 0, y: 0 },
  ];

  test("como está, a régua DELE devolve zero — e o lote encosta no leito", () => {
    expect(_testadaDoLote(lote as never, [leito] as never)).toBe(0);
  });

  test("com amostragem fina, a régua DELE passa a ver a frente", () => {
    const fino = densificar(lote, amostrasParaOPasso(34, 0.25));
    const t = _testadaDoLote(fino as never, [leito] as never);
    expect(t, "a função do Generate não mudou de resposta — o mecanismo do LAB-54 não é este").toBeGreaterThan(0);
    // E a frontagem que ela acha é da ordem do trecho que de fato encosta (2 m), não dos 34.
    expect(t).toBeLessThan(6);
  });

  test("e ela NÃO inventa frente onde não há: leito longe continua zero", () => {
    const longe = leito.map((p) => ({ x: p.x, y: p.y - 50 }));
    const fino = densificar(lote, amostrasParaOPasso(34, 0.25));
    expect(_testadaDoLote(fino as never, [longe] as never), "o probe cegou a régua dele").toBe(0);
  });
});

describe("LAB-54 · a prova, e o SALDO que é a conclusão do prompt", () => {
  const prova = () => {
    expect(existsSync(PROVA_54), "rode `bun run lab54`").toBe(true);
    return JSON.parse(readFileSync(PROVA_54, "utf8"));
  };

  test("o saldo de consertar a amostragem é ZERO violação derrubada", () => {
    const s = prova().total.saldoDeConsertarAAmostragem;
    expect(
      s.dasQuaisDeFatoSOMEM,
      "deixou de ser zero: consertar a amostragem passou a derrubar violação, e a conclusão do LAB-54 mudou",
    ).toBe(0);
    expect(s.frenteQueSumiria).toBe(s.dasQuaisSoTrocamDeEtiqueta);
    expect(s.porque.length, "saldo sem o porquê é número órfão").toBeGreaterThan(40);
  });

  test("toda violação tem classe de um conjunto FECHADO, e as classes fecham o total", () => {
    const p = prova();
    let soma = 0;
    for (const v of p.violacoes) {
      expect(CLASSES, `${v.gleba}/${v.loteId}: classe '${v.classe}' não está no conjunto`).toContain(v.classe);
      soma += 1;
    }
    expect(soma).toBe(p.total.violacoesFrente);
    expect(
      Object.values(p.total.porClasse as Record<string, number>).reduce((a, b) => a + b, 0),
    ).toBe(p.total.violacoesFrente);
    // "NAO-REPRODUZIU" existe para a acusação que não se repete — e se ela aparecer, a
    // medição não é sobre o mesmo objeto que o Validator acusou.
    expect(
      (p.total.porClasse as Record<string, number>)["NAO-REPRODUZIU"] ?? 0,
      "houve acusação que não se reproduziu: o objeto medido não é o acusado",
    ).toBe(0);
  });

  test("todo lote que VIRA traz a frontagem real e o mínimo DELE, não um palpite", () => {
    for (const v of prova().violacoes) {
      if (v.classe !== "regua-amostragem-no-meio-da-aresta") continue;
      expect(v.testadaComPassoFino_m).toBeGreaterThan(0);
      expect(typeof v.testadaMinUsada_m, `${v.loteId}: sem o mínimo usado não há veredicto`).toBe("number");
      expect(v.kQueVira, `${v.loteId}: sem dizer quantas amostras bastaram`).not.toBeNull();
      expect(v.arestasQueViramFrontais.length, `${v.loteId}: sem nomear a aresta`).toBeGreaterThan(0);
    }
  });

  /**
   * **O D172 em forma de trava.** O LAB-54 responde por "as 27 do LAB-48", e isso só vale
   * se as 27 forem **as mesmas 27** — os mesmos lotes, não a mesma contagem. Posição e
   * total são etiqueta; identidade é o id.
   */
  test("os lotes de `frente` são OS MESMOS da prova do LAB-53 — identidade, não contagem", () => {
    const a = JSON.parse(readFileSync(PROVA_53, "utf8")) as {
      violacoes: { gleba: string; tipo: string; loteId: string | null }[];
    };
    const doLab53 = new Set(
      a.violacoes.filter((v) => v.tipo === "frente").map((v) => `${v.gleba}|${v.loteId}`),
    );
    const doLab54 = new Set(
      (prova().violacoes as { gleba: string; loteId: string }[]).map((v) => `${v.gleba}|${v.loteId}`),
    );
    expect([...doLab54].filter((k) => !doLab53.has(k)), "o LAB-54 mediu lote que o LAB-53 não acusou").toEqual([]);
    expect([...doLab53].filter((k) => !doLab54.has(k)), "o LAB-54 deixou de medir lote acusado").toEqual([]);
  });

  test("o contrafactual do campo que falta é LIDO da prova do LAB-53, não remedido (D116)", () => {
    for (const v of prova().violacoes) {
      expect(
        "someComAFaixaViaPublica_LAB53" in v,
        `${v.gleba}/${v.loteId}: sem o contrafactual cruzado, a atribuição fica sem a hipótese do contrato`,
      ).toBe(true);
    }
  });
});

describe("LAB-54 · a atribuição é feita com a RÉGUA DELE, e isso é estrutural", () => {
  test("a ferramenta IMPORTA a função do Generate — no `import`, não em comentário", () => {
    // D142: o nome tem de estar no lugar da gramática onde significa "eu uso isto".
    const src = readFileSync(FERRAMENTA, "utf8");
    const imports = [...src.matchAll(/^import\s[\s\S]*?from\s+"([^"]+)";$/gm)];
    const doGenerate = imports.filter((m) => m[1]!.startsWith("@generate/"));
    expect(doGenerate.length, "a ferramenta deixou de importar do Generate").toBeGreaterThan(0);
    const bloco = doGenerate.map((m) => m[0]!).join("\n");
    for (const nome of ["_testadaDoLote", "superficiesDeFrente", "verificarInvariantesPlano"]) {
      expect(bloco, `a ferramenta não importa mais \`${nome}\` do Generate`).toContain(nome);
    }
  });

  test("a prova declara DE QUEM é a régua, com a tolerância contra a qual mediu", () => {
    const p = JSON.parse(readFileSync(PROVA_54, "utf8"));
    expect(p.aReguaEhDele.funcao).toContain("_testadaDoLote");
    expect(p.aReguaEhDele.tolerancia_m).toBe(0.75);
    expect(p.oProbe.forcaDoNegativo.length, "negativo sem resolução declarada não prova nada").toBeGreaterThan(40);
  });
});
