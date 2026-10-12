/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-94 · item 027 — as travas do PREÇO do sétimo mecanismo.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O que elas guardam:
 *
 * 1. **a conta fecha, e "não se aplica" não é "custou zero".** Sete das dez glebas não
 *    declaram face: ali a pergunta não tem objeto, e um `0` ali diria que o mecanismo foi
 *    medido e não custou nada;
 * 2. **cada lote da conta viaja com os METROS.** É o D161: o id `-eN` diz de QUEM o lote é,
 *    a distância diz ONDE ele está — e eu já publiquei "todos da beira da rua" contando id;
 * 3. **a segunda metade da frase da `FILA.md` sai MEDIDA.** *"Zera a violação"* é um booleano
 *    que agora tem rodada atrás; e quando ele é `false`, a trava cobra que exista a segunda
 *    retirada (a fileira inteira) para dizer **de quem é o que sobra**;
 * 4. **o rótulo da simulação não promete teto nem piso.** O item 027 proibiu por escrito, e
 *    uma varredura de palavra cobra isso no texto do rótulo;
 * 5. **a resposta do acabamento separa o que foi RODADO do que foi LIDO.** `comoEuSei` é
 *    vocabulário fechado, e a metade "mata ou funde" sai como **não sei**, com a casa que
 *    pode medir nomeada.
 *
 * Elas **não leem clone vizinho nenhum** — módulo puro e a prova em JSON —, e por isso vão
 * no trabalho de CI que roda sem segredo.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PORTA_DO_ACABAMENTO,
  MARCA_DA_FILEIRA_EXTERNA,
  O_CRITERIO_DO_PISO_DE_AREA,
  O_QUE_A_SIMULACAO_MEDE,
  O_QUE_A_SIMULACAO_NAO_MEDE,
  aConta,
  aFileiraExterna,
  osQueMorrem,
  type PrecoDaGleba,
} from "../src/preco-do-setimo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-94", "o-preco-do-setimo.json");

const prova = (): {
  glebas: string[];
  aConta: ReturnType<typeof aConta>;
  porGleba: PrecoDaGleba[];
  oQueIstoMede: string;
  oQueIstoNaoMede: string[];
  aPerguntaDoAcabamento: {
    porAREA: { veredicto: string; abaixoDoMinimo: number; lotesMedidos: number; comoEuSei: string };
    porFRENTE: { veredicto: string; comFaceDeRuaNula: number; comoEuSei: string };
    aPREMISSA_DO_ITEM_NAO_SE_SUSTENTA: { oQueEstaPopulacaoTEM: { comTestadaZero: number } };
    oQUE_EU_NAO_SEI: string;
  };
} => JSON.parse(readFileSync(PROVA, "utf8"));

/** Um quadrado de 10 m, para exercitar a classificação sem gleba nenhuma. */
const quadrado = (x: number) => [
  { x, y: 0 },
  { x: x + 10, y: 0 },
  { x: x + 10, y: 10 },
  { x, y: 10 },
];

describe("LAB-94 · a fileira externa, classificada — e os dois sentidos", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 100, y: 0 };

  test("O LADO BOM: lote da fileira DENTRO da face sai com `alemDaPonta_m` zero", () => {
    const f = aFileiraExterna([{ id: "v1-e1", pontos: quadrado(40) }], a, b);
    expect(f).toHaveLength(1);
    expect(f[0]!.alemDaPonta_m).toBe(0);
    expect(osQueMorrem(f)).toEqual([]);
  });

  test("O LADO RUIM: lote ALÉM da ponta sai com os metros, e é ele que morre", () => {
    const f = aFileiraExterna([{ id: "v1-e2", pontos: quadrado(130) }], a, b);
    expect(f[0]!.alemDaPonta_m).toBe(40);
    expect(osQueMorrem(f).map((l) => l.id)).toEqual(["v1-e2"]);
  });

  test("lote que NÃO é da fileira externa não entra na conta, esteja onde estiver", () => {
    expect(aFileiraExterna([{ id: "v1-l77", pontos: quadrado(500) }], a, b)).toEqual([]);
    expect(MARCA_DA_FILEIRA_EXTERNA.test("v1-l77")).toBe(false);
    expect(MARCA_DA_FILEIRA_EXTERNA.test("v16-e15")).toBe(true);
  });

  test("cada linha da conta carrega os METROS, e não só o id (D161)", () => {
    for (const g of prova().porGleba) {
      for (const c of g.candidatas) {
        for (const l of c.aMorrer) {
          expect(typeof l.alemDaPonta_m, `${g.gleba}/${c.candidata}/${l.id}`).toBe("number");
          expect(l.alemDaPonta_m).toBeGreaterThan(0);
          expect(MARCA_DA_FILEIRA_EXTERNA.test(l.id)).toBe(true);
        }
      }
    }
  });
});

describe("LAB-94 · a conta fecha, e “não se aplica” não é “custou zero”", () => {
  test("a conta publicada é a que o módulo calcula da própria lista", () => {
    const p = prova();
    expect(aConta(p.porGleba)).toEqual(p.aConta);
  });

  test("as glebas somam, e a que não declara face NÃO tem candidata nem zero", () => {
    const p = prova();
    expect(p.aConta.glebasQueDeclaramFace + p.aConta.glebasSemFace).toBe(p.aConta.glebas);
    expect(p.aConta.glebas).toBe(p.glebas.length);
    for (const g of p.porGleba) {
      if (g.declaraFace) {
        expect(g.porqueNaoSeAplica, g.gleba).toBeNull();
      } else {
        expect(g.candidatas, g.gleba).toEqual([]);
        expect(g.porqueNaoSeAplica, g.gleba).toBeTruthy();
        expect(g.porqueNaoSeAplica!.length, g.gleba).toBeGreaterThan(60);
      }
    }
  });

  test("os lotes retirados somam o que a lista por candidata traz", () => {
    const p = prova();
    const soma = p.porGleba.flatMap((g) => g.candidatas).reduce((t, c) => t + c.aMorrer.length, 0);
    expect(p.aConta.lotesRetirados).toBe(soma);
  });

  test("toda candidata com retirada tem o ANTES e o DEPOIS medidos", () => {
    for (const g of prova().porGleba) {
      for (const c of g.candidatas) {
        if (c.aMorrer.length === 0) {
          expect(c.depois, `${g.gleba}/${c.candidata}`).toBeNull();
          expect(c.aViolacaoDeFrenteZerou, `${g.gleba}/${c.candidata}`).toBeNull();
          continue;
        }
        expect(c.depois, `${g.gleba}/${c.candidata}`).not.toBeNull();
        expect(c.depois!.lotes).toBe(c.antes.lotes - c.aMorrer.length);
      }
    }
  });
});

describe("LAB-94 · a segunda metade da frase sai MEDIDA, não afirmada", () => {
  test("`zera a violação` é booleano com rodada atrás, e a soma fecha", () => {
    const p = prova();
    expect(p.aConta.zeraramAFrente + p.aConta.naoZeraramAFrente).toBe(
      p.aConta.candidatasComRetirada,
    );
  });

  test("quando NÃO zera, existe a segunda retirada para dizer de quem é o que sobra", () => {
    for (const g of prova().porGleba) {
      for (const c of g.candidatas) {
        if (c.aViolacaoDeFrenteZerou !== false) continue;
        expect(
          c.depoisSemAFileiraToda,
          `${g.gleba}/${c.candidata}: não zerou e não há a retirada da fileira inteira — sem ela, ` +
            '"o que sobra não é da fileira" seria afirmação minha',
        ).not.toBeNull();
      }
    }
  });

  test("o veredicto bate com o número, candidata por candidata", () => {
    for (const g of prova().porGleba) {
      for (const c of g.candidatas) {
        if (c.depois === null) continue;
        expect(c.aViolacaoDeFrenteZerou, `${g.gleba}/${c.candidata}`).toBe(c.depois.frente === 0);
      }
    }
  });
});

describe("LAB-94 · o rótulo da simulação não promete o que ela não mede", () => {
  test("o que ela mede diz RETIRADOS e NADA no lugar", () => {
    expect(prova().oQueIstoMede).toBe(O_QUE_A_SIMULACAO_MEDE);
    expect(O_QUE_A_SIMULACAO_MEDE).toContain("RETIRADOS");
    expect(O_QUE_A_SIMULACAO_MEDE).toContain("NADA posto no lugar");
  });

  test("o rótulo RECUSA teto e piso — o item 027 proibiu por escrito", () => {
    const todo = O_QUE_A_SIMULACAO_NAO_MEDE.join(" ").toLowerCase();
    expect(todo).toContain("teto");
    expect(todo).toContain("piso");
    expect(todo).toContain("replantar");
    // E a recusa não pode virar promessa: nenhuma das linhas AFIRMA que é um dos dois.
    for (const l of O_QUE_A_SIMULACAO_NAO_MEDE) {
      expect(l, l).not.toMatch(/\bé o (teto|piso)\b/i);
    }
  });

  test("o limite viaja na prova, e não só no módulo", () => {
    expect(prova().oQueIstoNaoMede).toEqual([...O_QUE_A_SIMULACAO_NAO_MEDE]);
    expect(prova().oQueIstoNaoMede.length).toBeGreaterThanOrEqual(4);
  });
});

describe("LAB-94 · a pergunta do acabamento separa o RODADO do LIDO", () => {
  test("as duas metades da resposta vêm medidas nos nossos lotes", () => {
    const a = prova().aPerguntaDoAcabamento;
    expect(a.porAREA.comoEuSei).toBe("medido-nos-nossos-lotes");
    expect(a.porFRENTE.comoEuSei).toBe("medido-nos-nossos-lotes");
    expect(a.porAREA.abaixoDoMinimo).toBe(0);
    expect(a.porAREA.veredicto).toContain("NAO alcança");
    expect(a.porFRENTE.comFaceDeRuaNula).toBe(a.porAREA.lotesMedidos);
  });

  test("“mata ou funde” sai como NÃO SEI, com a casa que pode medir nomeada", () => {
    const a = prova().aPerguntaDoAcabamento;
    expect(a.oQUE_EU_NAO_SEI).toContain("MATA ou FUNDE");
    expect(a.oQUE_EU_NAO_SEI).toContain("RODANDO");
  });

  test("a porta do acabamento é declarada com as DUAS profundidades (D294/D295)", () => {
    expect(A_PORTA_DO_ACABAMENTO.existeNaOrigem).toBe(true);
    expect(A_PORTA_DO_ACABAMENTO.existeNoCloneQueEstaCasaCompila).toBe(false);
    expect(A_PORTA_DO_ACABAMENTO.passosAplicados.length).toBe(13);
    expect(A_PORTA_DO_ACABAMENTO.passosFora.length).toBe(4);
    // 13 + 4 = 17, que é o total do inventário do `024-O-CHASSI.md`.
    expect(
      A_PORTA_DO_ACABAMENTO.passosAplicados.length + A_PORTA_DO_ACABAMENTO.passosFora.length,
    ).toBe(17);
    expect(new Set(A_PORTA_DO_ACABAMENTO.passosAplicados).size).toBe(13);
  });

  test("o critério do `piso-de-area` declara as DUAS condições, não só a do nome", () => {
    expect(O_CRITERIO_DO_PISO_DE_AREA).toContain("areaMin");
    expect(O_CRITERIO_DO_PISO_DE_AREA).toContain("testadaContraVias");
    expect(O_CRITERIO_DO_PISO_DE_AREA).toContain("FUNDIR");
  });

  test("a premissa do item sobre testada zero foi medida, e ela não se sustenta", () => {
    const p = prova().aPerguntaDoAcabamento.aPREMISSA_DO_ITEM_NAO_SE_SUSTENTA;
    expect(p.oQueEstaPopulacaoTEM.comTestadaZero).toBe(0);
  });
});
