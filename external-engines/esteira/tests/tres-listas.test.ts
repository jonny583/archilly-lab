/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-62 · As travas das três listas que vão ao chat.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O chat pediu as três listas **dentro do recado**, porque *"é só o recado que chega até o
 * chat"*. Então o que vai nelas tem de ser **gerado do medido**, e não digitado: foi
 * digitando um número que estava impresso na linha de cima que eu publiquei *"oito"* onde
 * eram *"cinco"* (D185).
 *
 * As travas cobram três coisas, e duas delas são régua de conteúdo e não de forma:
 *
 * 1. **a conta fecha** — onze abertos, seis mecanismos com afirmação cada, as três formas
 *    do LAB-60 cobertas uma vez cada, e o *"não tem CI"* em primeiro, que foi o pedido;
 * 2. **nenhuma afirmação nomeia artefato** — *"cada item diz o que precisa ficar verdadeiro,
 *    não qual arquivo mexer"*. A guarda barra caminho e extensão, e **não** barra nome de
 *    chave de configuração: `skipLibCheck` é a coisa de que a afirmação fala;
 * 3. **as duas leituras de "destrava" dão ordens diferentes** — e é por isso que as duas vão
 *    nomeadas. Trava semântica: se um dia elas coincidirem, esta trava cai e a distinção
 *    deixa de precisar ser dita.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AFIRMACOES_DA_CONFERENCIA,
  AFIRMACOES_DOS_MECANISMOS,
  EXTENSOES_DE_ARTEFATO,
  afirmacaoNomeiaArtefato,
} from "../src/as-tres-listas.ts";
import { MECANISMOS } from "../src/mecanismos-das-violacoes.ts";
import { lerPropostas } from "../src/varredura-das-propostas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-62", "as-tres-listas.json");

interface ProvaDoLab62 {
  oAchadoDaORDEM: {
    porDESTRAVE: string[];
    porALCANCE: string[];
    quantosDestravamAlgumaCoisa: number;
  };
  aRegraDasAFIRMACOES: { quantasAfirmacoes: number; quantasNomeiamArtefato: number };
  lista1: { quantos: number; itens: { motivo: string | null; titulo: string }[] };
  lista2: {
    quantos: number;
    itens: {
      id: string;
      violacoes: number;
      glebasEmQueAparece: number;
      glebasQueOConsertoDestravaSOZINHO: number;
      oQuePrecisaFicarVerdadeiro: string;
    }[];
  };
  lista3: { quantos: number; itens: { numero: number; formaDoLAB60: string | null }[] };
  problemas: string[];
}
const prova = JSON.parse(readFileSync(PROVA, "utf8")) as ProvaDoLab62;

describe("LAB-62 · a conta das três listas fecha", () => {
  test("a prova não tem problema nenhum: a ferramenta reprova quando tem", () => {
    expect(prova.problemas).toEqual([]);
  });

  /**
   * **Eram ONZE no LAB-62, TREZE em 08/10, QUINZE em 09/10, DEZESSEIS, DEZESSETE e de volta a
   * DEZESSEIS em 10/10** — a última por ENTREGA (o LAB-81 executou a proposta das cinco leituras), com os dois itens da rodada do orçamento de Actions (D221, D223), a proposta do
   * sétimo mecanismo (D253) e a unificação das cinco leituras de *"afirma ou mostra"* (D259). O
   * número vive declarado na ferramenta (`ABERTOS_ESPERADOS`) e aqui, e mudá-lo é deliberado:
   * lista que cresce sem ninguém notar é a dívida que o LAB-61 achou.
   */
  test("os itens abertos batem com o número declarado hoje", () => {
    expect(prova.lista1.quantos).toBe(16);
    expect(prova.lista1.itens).toHaveLength(16);
  });

  test("todo item aberto da lista 1 leva motivo declarado", () => {
    expect(prova.lista1.itens.filter((i) => i.motivo === null)).toEqual([]);
  });

  test("a lista 1 bate com a FILA de hoje, lida pela régua do LAB-61", () => {
    const fila = readFileSync(join(RAIZ, "docs", "prompts", "FILA.md"), "utf8");
    const abertos = lerPropostas(fila).filter((p) => !p.riscado);
    expect(abertos).toHaveLength(prova.lista1.quantos);
  });

  test("são SEIS mecanismos, e os seis somam as 81 violações do motor", () => {
    expect(prova.lista2.quantos).toBe(6);
    expect(MECANISMOS).toHaveLength(6);
    expect(prova.lista2.itens.reduce((s, m) => s + m.violacoes, 0)).toBe(81);
  });

  test("cada mecanismo tem afirmação escrita, e nenhuma afirmação é órfã", () => {
    const idsDosMecanismos = new Set(MECANISMOS.map((m) => m.id));
    const idsDasAfirmacoes = new Set(AFIRMACOES_DOS_MECANISMOS.map((a) => a.mecanismo));
    expect([...idsDosMecanismos].filter((i) => !idsDasAfirmacoes.has(i))).toEqual([]);
    expect([...idsDasAfirmacoes].filter((i) => !idsDosMecanismos.has(i))).toEqual([]);
  });

  test("a lista 3 é o contexto + as três formas, e o 'não tem CI' é o PRIMEIRO", () => {
    expect(prova.lista3.quantos).toBe(4);
    expect(prova.lista3.itens[0]!.formaDoLAB60).toBeNull();
    expect(prova.lista3.itens[0]!.numero).toBe(1);
  });

  test("as três formas do LAB-60 aparecem uma vez cada na lista 3", () => {
    for (const forma of ["nao-pode-reprovar", "desligada", "sem-motivo-escrito"]) {
      expect(AFIRMACOES_DA_CONFERENCIA.filter((l) => l.formaDoLAB60 === forma)).toHaveLength(1);
    }
  });
});

describe("LAB-62 · afirmação que nomeia artefato não é afirmação", () => {
  test("nenhuma das dez afirmações nomeia artefato", () => {
    expect(prova.aRegraDasAFIRMACOES.quantasNomeiamArtefato).toBe(0);
    expect(prova.aRegraDasAFIRMACOES.quantasAfirmacoes).toBe(
      AFIRMACOES_DOS_MECANISMOS.length + AFIRMACOES_DA_CONFERENCIA.length,
    );
    for (const a of AFIRMACOES_DOS_MECANISMOS) {
      expect(afirmacaoNomeiaArtefato(a.oQuePrecisaFicarVerdadeiro)).toBeNull();
    }
    for (const a of AFIRMACOES_DA_CONFERENCIA) {
      expect(afirmacaoNomeiaArtefato(a.oQuePrecisaFicarVerdadeiro)).toBeNull();
    }
  });

  test("a guarda pega caminho e pega CADA extensão declarada", () => {
    expect(afirmacaoNomeiaArtefato("mexer em src/lib/lab/motor")).toBe(
      "traz separador de caminho `/`",
    );
    for (const ext of EXTENSOES_DE_ARTEFATO) {
      expect(afirmacaoNomeiaArtefato(`conserte o arquivo pacote${ext} e pronto`)).toBe(
        `traz a extensão \`${ext}\``,
      );
    }
  });

  test("a guarda pega a extensão escrita em MAIÚSCULA", () => {
    expect(afirmacaoNomeiaArtefato("conserte TSCONFIG.JSON")).toBe("traz a extensão `.json`");
  });

  test("a guarda NÃO barra nome de chave nem de passo: eles são a coisa, não o endereço", () => {
    expect(afirmacaoNomeiaArtefato("a chave `skipLibCheck` está ligada")).toBeNull();
    expect(afirmacaoNomeiaArtefato("o passo de `lint` reprova com qualquer aviso")).toBeNull();
    expect(afirmacaoNomeiaArtefato("o invariante `via-sobre-lote` não acusa nenhum lote")).toBeNull();
  });

  test("toda afirmação diz também COM QUE FREQUÊNCIA e o que NÃO serve", () => {
    for (const a of [...AFIRMACOES_DOS_MECANISMOS, ...AFIRMACOES_DA_CONFERENCIA]) {
      expect(a.comQueFrequencia.length).toBeGreaterThan(20);
      expect(a.oQueNaoServe.length).toBeGreaterThan(20);
    }
  });
});

describe("LAB-62 · 'aparece em' e 'destrava' são perguntas DIFERENTES", () => {
  test("as duas ordens não dão o mesmo primeiro", () => {
    expect(prova.oAchadoDaORDEM.porDESTRAVE[0]).not.toBe(prova.oAchadoDaORDEM.porALCANCE[0]);
  });

  test("UM mecanismo destrava gleba sozinho, e os outros cinco destravam zero", () => {
    expect(prova.oAchadoDaORDEM.quantosDestravamAlgumaCoisa).toBe(1);
    expect(
      prova.lista2.itens.filter((m) => m.glebasQueOConsertoDestravaSOZINHO === 0),
    ).toHaveLength(5);
  });

  test("o que destrava não é o de maior alcance nem o de mais violações", () => {
    const destrava = prova.lista2.itens.find((m) => m.glebasQueOConsertoDestravaSOZINHO > 0)!;
    const maiorAlcance = Math.max(...prova.lista2.itens.map((m) => m.glebasEmQueAparece));
    const maisViolacoes = Math.max(...prova.lista2.itens.map((m) => m.violacoes));
    expect(destrava.glebasEmQueAparece).toBeLessThan(maiorAlcance);
    expect(destrava.violacoes).toBeLessThan(maisViolacoes);
  });

  test("a lista 2 está ordenada por destrave, e não por alcance", () => {
    const ids = prova.lista2.itens.map((m) => m.id);
    expect(ids).toEqual(prova.oAchadoDaORDEM.porDESTRAVE);
    expect(ids).not.toEqual(prova.oAchadoDaORDEM.porALCANCE);
  });
});

describe("LAB-62 · os blocos que vão ao chat são a SAÍDA da ferramenta", () => {
  const blocos = readFileSync(
    join(RAIZ, "docs", "provas", "LAB-62", "os-tres-blocos.txt"),
    "utf8",
  );

  test("os três blocos existem, abrem e fecham", () => {
    for (const n of [1, 2, 3]) {
      expect(blocos).toContain(`=== LISTA ${n} de 3 —`);
      expect(blocos).toContain(`=== FIM DA LISTA ${n} ===`);
    }
  });

  test("a lista 1 do bloco tem uma linha numerada por item aberto", () => {
    const corpo = blocos.slice(
      blocos.indexOf("=== LISTA 1 de 3"),
      blocos.indexOf("=== FIM DA LISTA 1 ==="),
    );
    const linhas = corpo.split("\n").filter((l) => /^\s*\d+\. \[/.test(l));
    // 15 → 16 no LAB-78 (o sétimo mecanismo, D253), 16 → 17 no LAB-80 (a unificação das cinco
    // leituras, D259) e 17 → 16 no LAB-81, quando essa mesma proposta foi EXECUTADA. O número está
    // declarado em `ABERTOS_ESPERADOS` com o motivo, e os três lugares que o contam andam JUNTOS.
    expect(linhas).toHaveLength(16);
  });

  test("cada item das listas 2 e 3 carrega a afirmação, a frequência e o que não serve", () => {
    expect(blocos.match(/PRECISA FICAR VERDADEIRO:/g)).toHaveLength(10);
    expect(blocos.match(/com que frequência:/g)).toHaveLength(10);
    expect(blocos.match(/NÃO serve:/g)).toHaveLength(10);
  });
});
