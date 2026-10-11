/**
 * **item 023 · "caixa vazia" era verdade? — os dois sentidos, o terceiro estado e a recusa.**
 *
 * ```sh
 * bun test tests/caixa-vazia.test.ts
 * ```
 *
 * O critério do item: *"o `e701a6f` do Orçamento tem de sair **falsa**, e uma das `ok` tem de
 * sair **verdadeira**"*; o terceiro estado *"`bloqueado`"*, e **se a distinção não for decidível
 * por máquina, "diga isso e recuse em vez de adivinhar"*; e **o limite na SAÍDA, sempre**.
 *
 * **Estas travas são herméticas:** as listas de nomes abaixo foram **medidas** nos clones (a
 * ferramenta `lab90` as mede ao vivo e publica a prova), e aqui entram como fixture — porque
 * *trava que clona no portão paga bateria para medir o que uma lista mede*, e porque o portão não
 * tem os clones.
 */
import { describe, expect, test } from "bun:test";

import {
  O_QUE_ISTO_NAO_ALCANCA,
  aCaixaEstavaVazia,
  ehItemAberto,
  numeroDoItem,
  oAssuntoNegaACaixaVazia,
} from "../src/caixa-vazia-era-verdade.ts";

/** Medido em 11/10/2026 nos clones irmãos, commit por commit. */
const COMO_AS_CAIXAS_ESTAVAM = {
  /** Orçamento, `e701a6f`, "Caixa vazia às 01:13 UTC" — o caso que o item manda sair FALSA. */
  orcamentoE701a6f: [
    ...Array.from({ length: 20 }, (_, i) => `${String(i + 1).padStart(3, "0")}-FEITO.md`),
    "021.md",
    "COMO_FUNCIONA.md",
  ],
  /** Propostas, `bd84f13` — as oito legítimas: `007` + adendos, com `013-FEITO` na caixa. */
  propostasBd84f13: [
    ...Array.from({ length: 6 }, (_, i) => `${String(i + 1).padStart(3, "0")}-FEITO.md`),
    "007.md",
    "007-adendo.md",
    "007-adendo-2.md",
    "007-adendo-3.md",
    ...Array.from({ length: 6 }, (_, i) => `${String(i + 8).padStart(3, "0")}-FEITO.md`),
    "COMO_FUNCIONA.md",
  ],
  /** Este Lab, `34bc00c` — a declaração falsa é MINHA, e está medida aqui. */
  labFalsa34bc00c: ["001-FEITO.md", "002-FEITO.md", "003-FEITO.md", "004-FEITO.md", "005.md", "COMO_FUNCIONA.md"],
  /** Este Lab, `2bc543f` — caixa vazia de verdade. */
  labVerdadeira2bc543f: [
    ...Array.from({ length: 7 }, (_, i) => `${String(i + 1).padStart(3, "0")}-FEITO.md`),
    "COMO_FUNCIONA.md",
  ],
} as const;

describe("item 023 · os dois sentidos que o item exigiu", () => {
  test("O LADO RUIM: o `e701a6f` do Orçamento sai FALSA, e a linha nomeia o item", () => {
    const r = aCaixaEstavaVazia(COMO_AS_CAIXAS_ESTAVAM.orcamentoE701a6f);
    expect(r.declaracaoEraVerdadeira).toBe(false);
    expect(r.veredicto).toBe("aberta-com-o-proximo");
    expect(r.abertos).toEqual(["021.md"]);
    expect(r.oMaiorFeito).toBe(20);
    expect(r.porque).toContain("021.md");
  });

  test("O LADO BOM: uma caixa vazia de verdade sai VERDADEIRA", () => {
    const r = aCaixaEstavaVazia(COMO_AS_CAIXAS_ESTAVAM.labVerdadeira2bc543f);
    expect(r.declaracaoEraVerdadeira).toBe(true);
    expect(r.veredicto).toBe("vazia");
    expect(r.abertos).toEqual([]);
  });

  /** *A primeira declaração falsa que esta régua acusa é a minha* — e ela está na fixture. */
  test("e a declaração falsa DESTA casa também sai falsa — a régua acusa quem a escreveu", () => {
    const r = aCaixaEstavaVazia(COMO_AS_CAIXAS_ESTAVAM.labFalsa34bc00c);
    expect(r.declaracaoEraVerdadeira).toBe(false);
    expect(r.abertos).toEqual(["005.md"]);
    expect(r.oMaiorFeito).toBe(4);
  });
});

describe("item 023 · o terceiro estado, e a recusa em vez do chute", () => {
  /**
   * **As oito do Propostas não podem ser acusadas** — *cobrança que reprova o código correto é
   * desligada na semana seguinte*. A régua não diz que elas são bloqueio: diz que **não decide**.
   */
  test("item aberto JÁ PULADO sai `null`, nunca `false`", () => {
    const r = aCaixaEstavaVazia(COMO_AS_CAIXAS_ESTAVAM.propostasBd84f13);
    expect(r.declaracaoEraVerdadeira).toBeNull();
    expect(r.veredicto).toBe("aberta-ja-pulada");
    expect(r.abertos).toContain("007.md");
    expect(r.oMaiorFeito).toBe(13);
    expect(r.porque).toContain("não decide");
  });

  test("árvore SEM a pasta da caixa sai `null` — não medido não é medido (D23)", () => {
    const r = aCaixaEstavaVazia([]);
    expect(r.declaracaoEraVerdadeira).toBeNull();
    expect(r.veredicto).toBe("sem-caixa");
    expect(r.porque).toContain("D23");
  });

  /**
   * **O achado contra a tabela da direção:** a linha do Geo aponta o commit da **correção**. A
   * régua de palavra existe aqui **para recusar**, e o lado seguro do erro é dizer *"isto não é
   * uma declaração"*.
   */
  test("assunto que NEGA a caixa vazia → `nao-e-declaracao`, e não uma acusação", () => {
    const assunto = "correcao: a caixa NAO esta vazia — o 010 chegou durante a rodada do 009";
    expect(oAssuntoNegaACaixaVazia(assunto)).toBe(true);
    const r = aCaixaEstavaVazia(["009-FEITO.md", "010.md", "COMO_FUNCIONA.md"], assunto);
    expect(r.declaracaoEraVerdadeira).toBeNull();
    expect(r.veredicto).toBe("nao-e-declaracao");
    expect(r.porque).toContain("acertou");
  });

  test("e o MESMO conteúdo, com assunto de declaração, sai FALSA — senão a régua não mede nada", () => {
    const r = aCaixaEstavaVazia(["009-FEITO.md", "010.md", "COMO_FUNCIONA.md"], "Caixa vazia às 01:13 UTC");
    expect(r.declaracaoEraVerdadeira).toBe(false);
    expect(oAssuntoNegaACaixaVazia("Caixa vazia às 01:13 UTC")).toBe(false);
  });

  test("a régua da negação pega as formas que existem, e não pega a declaração", () => {
    for (const nega of [
      "correcao: a caixa NAO esta vazia — o 010 chegou",
      "decisao-registrada: o disparo das 19:06 não é em vazio",
      "a caixa não está vazia: o 021 chegou",
    ]) {
      expect(oAssuntoNegaACaixaVazia(nega), nega).toBe(true);
    }
    for (const declara of [
      "Caixa vazia às 01:13 UTC: a linha da medição e o recado",
      "despertador-sem-item: a caixa esgotou às 04:05Z — data anotada, e eu durmo",
      "caixa vazia às 22:47 — pelo protocolo, e sem ponta solta",
    ]) {
      expect(oAssuntoNegaACaixaVazia(declara), declara).toBe(false);
    }
  });
});

describe("item 023 · a definição de ABERTO é a do documento da direção", () => {
  test("`NNN.md` conta; `-FEITO`, `-RETIRADO` e o `COMO_FUNCIONA` não", () => {
    for (const aberto of ["001.md", "021.md", "007-adendo.md", "007-adendo-3.md", "010-ADENDO.md"]) {
      expect(ehItemAberto(aberto), aberto).toBe(true);
    }
    for (const fechado of [
      "001-FEITO.md",
      "007-adendo-FEITO.md",
      "005-RETIRADO.md",
      "COMO_FUNCIONA.md",
      "README.md",
      "relatorio.md",
    ]) {
      expect(ehItemAberto(fechado), fechado).toBe(false);
    }
  });

  test("o número sai do prefixo de três dígitos, e é ele que ordena a fila", () => {
    expect(numeroDoItem("021.md")).toBe(21);
    expect(numeroDoItem("007-adendo-3.md")).toBe(7);
    expect(numeroDoItem("COMO_FUNCIONA.md")).toBeNull();
  });
});

describe("item 023 · o LIMITE vai na SAÍDA, em toda resposta", () => {
  /** O item pediu com estas palavras: *"o limite na SAÍDA, sempre — inclusive no verde"*. */
  test("TODA leitura carrega o limite, inclusive a verdadeira", () => {
    const casos = [
      aCaixaEstavaVazia(COMO_AS_CAIXAS_ESTAVAM.orcamentoE701a6f),
      aCaixaEstavaVazia(COMO_AS_CAIXAS_ESTAVAM.labVerdadeira2bc543f),
      aCaixaEstavaVazia(COMO_AS_CAIXAS_ESTAVAM.propostasBd84f13),
      aCaixaEstavaVazia([]),
      aCaixaEstavaVazia(["010.md"], "correcao: a caixa NAO esta vazia"),
    ];
    for (const c of casos) {
      expect(c.oQueIstoNaoAlcanca).toBe(O_QUE_ISTO_NAO_ALCANCA);
      expect(c.oQueIstoNaoAlcanca.length).toBeGreaterThanOrEqual(4);
    }
  });

  test("o limite NOMEIA os quatro buracos, e os dois que o item já sabia", () => {
    const tudo = O_QUE_ISTO_NAO_ALCANCA.join(" | ");
    expect(tudo).toContain("CEGA");
    expect(tudo).toContain("CLONE");
    expect(tudo).toContain("BLOQUEIO");
    expect(tudo).toContain("D295");
  });
});
