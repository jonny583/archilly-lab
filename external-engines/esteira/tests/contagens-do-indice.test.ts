/**
 * **LAB-119 (item 900) · as contagens de desenho da seção "O código" do índice, conferidas contra o
 * arquivo que elas contam** (D347).
 *
 * ```sh
 * bun test tests/contagens-do-indice.test.ts
 * ```
 *
 * A linha da guarda da IDA dizia *"Quatro regras, e a quarta é a dívida"* com cinco em
 * `REGRAS_DA_IDA` desde 04/10, e a dos experimentos *"dois testes de varredura"* com três no
 * `describe`. Lê só arquivos deste repositório — entra no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CONTAGENS,
  NAO_CONTAM,
  conferirAsContagens,
  linhasDaSecao,
  numerosDaSecao,
  type Ler,
  valorDoNumero,
} from "../src/contagens-do-indice.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const INDICE = readFileSync(join(RAIZ, "docs", "INDEX.md"), "utf8");
const ler: Ler = (c) =>
  existsSync(join(RAIZ, c)) ? readFileSync(join(RAIZ, c), "utf8") : null;
const IDA = "external-engines/esteira/src/guarda-da-ida.ts";

/** O mesmo leitor, com um arquivo trocado. */
const comArquivo =
  (caminho: string, troca: (t: string) => string): Ler =>
  (c) => {
    const t = ler(c);
    return c === caminho && t !== null ? troca(t) : t;
  };
const motivos = (r: ReturnType<typeof conferirAsContagens>) =>
  r!.desacordos.map((d) => `${d.motivo}:${d.trecho}`);

describe("LAB-119 · o número da seção 'O código' é o que o arquivo conta", () => {
  test("o lado bom: hoje, nenhum desacordo — e o universo lido vai publicado", () => {
    const r = conferirAsContagens(INDICE, ler)!;
    expect(r.desacordos).toEqual([]);
    expect(r.linhasLidas).toBe(22);
    expect(r.numerosLidos).toBe(23);
    expect(r.contagens + r.naoContam).toBe(r.numerosLidos);
    console.log(
      `    ${r.linhasLidas} linhas · ${r.numerosLidos} números · ${r.contagens} contados no arquivo · ${r.naoContam} declarados que não contam`,
    );
  });

  test("o lado ruim: o defeito de 16/10 reproduzido — 'Quatro regras, e a quarta' reprova pelos dois sentidos", () => {
    const velho = INDICE.replace(
      "Cinco regras — duas reprovam, `promessa-nao-exercitada` (LAB-35) e `mapa-velho` avisam —, e a quinta é a",
      "Quatro regras, e a quarta é a",
    );
    expect(velho).not.toBe(INDICE);
    expect(motivos(conferirAsContagens(velho, ler)).sort()).toEqual(
      [
        "entrada-sem-trecho:Cinco regras",
        "entrada-sem-trecho:duas reprovam",
        "entrada-sem-trecho:a quinta é a",
        "numero-sem-entrada:Quatro",
        "numero-sem-entrada:quarta",
      ].sort(),
    );
  });

  test("o lado ruim: o ARQUIVO muda embaixo da frase — uma regra a menos, e as duas contagens acusam", () => {
    const menos = comArquivo(IDA, (t) =>
      t.replace(
        '  "promessa-nao-exercitada",\n  "mapa-velho",',
        '  "mapa-velho",',
      ),
    );
    expect(menos(IDA)).not.toBe(ler(IDA));
    const r = conferirAsContagens(INDICE, menos)!;
    expect(
      r.desacordos.map((d) => [d.motivo, d.trecho, d.escrito, d.contado]),
    ).toEqual([
      ["conta-diferente", "Cinco regras", 5, 4],
      ["conta-diferente", "a quinta é a", 5, 4],
    ]);
  });

  test("o lado ruim: o experimento da varredura com quatro travas, e a linha diz três", () => {
    const porta = "external-engines/esteira/tests/porta.test.ts";
    const titulo =
      'describe("a varredura das capacidades — nenhum campo sem quem o desminta", () => {\n';
    const mais = comArquivo(porta, (t) =>
      t.replace(titulo, `${titulo}  test("um quarto", () => {});\n`),
    );
    expect(mais(porta)).not.toBe(ler(porta));
    expect(motivos(conferirAsContagens(INDICE, mais))).toEqual([
      "conta-diferente:em três travas",
    ]);
  });

  test("número que nasce na seção sem entrada reprova — a lista não aprova pelo que não leu", () => {
    const novo = INDICE.replace(
      "**A régua do acesso** (LAB-28): seis pontos",
      "**A régua do acesso** (LAB-28): oito travas e seis pontos",
    );
    expect(motivos(conferirAsContagens(novo, ler))).toEqual([
      "numero-sem-entrada:oito",
    ]);
  });

  test("entrada que nenhuma linha lê reprova — a lista não envelhece calada", () => {
    const extra = [...CONTAGENS, { ...CONTAGENS[0]!, trecho: "nove pontos" }];
    expect(motivos(conferirAsContagens(INDICE, ler, extra))).toEqual([
      "entrada-sem-trecho:nove pontos",
    ]);
    const extraNao = [
      ...NAO_CONTAM,
      { arquivo: IDA, trecho: "dez anos", motivo: "x" },
    ];
    expect(
      motivos(conferirAsContagens(INDICE, ler, CONTAGENS, extraNao)),
    ).toEqual(["entrada-sem-trecho:dez anos"]);
  });

  test("o contador que não acha o que procura reprova com 'nao-contou', nunca com zero", () => {
    const acesso = "external-engines/esteira/src/acesso.ts";
    const sem = comArquivo(acesso, (t) =>
      t.replace("export const POSICOES_DE_ACESSO = 6;", "export const N = 6;"),
    );
    expect(motivos(conferirAsContagens(INDICE, sem))).toEqual([
      "nao-contou:seis pontos",
    ]);
  });

  test("arquivo que sumiu reprova com 'nao-contou' — e nunca vira texto vazio que contaria zero", () => {
    const regras = "external-engines/esteira/tests/regras.test.ts";
    const sumiu: Ler = (c) => (c === regras ? null : ler(c));
    expect(motivos(conferirAsContagens(INDICE, sumiu))).toEqual([
      "nao-contou:duas classes de exceção",
    ]);
  });

  test("o trecho que pega dois números, ou nenhum, é recusado — um trecho, um número", () => {
    const largo = CONTAGENS.map((c) =>
      c.trecho === "seis pontos" ? { ...c, trecho: "seis pontos por" } : c,
    );
    expect(conferirAsContagens(INDICE, ler, largo)!.desacordos).toEqual([]);
    const semNumero = CONTAGENS.map((c) =>
      c.trecho === "seis pontos" ? { ...c, trecho: "pontos por" } : c,
    );
    expect(motivos(conferirAsContagens(INDICE, ler, semNumero)).sort()).toEqual(
      ["numero-sem-entrada:seis", "trecho-sem-um-numero:pontos por"].sort(),
    );
  });

  test("o trecho que aparece duas vezes na linha é recusado — ninguém sabe de qual número ele fala", () => {
    const duplo = INDICE.replace(
      "seis pontos por",
      "seis pontos e seis pontos por",
    );
    expect(motivos(conferirAsContagens(duplo, ler)).sort()).toEqual(
      [
        "numero-sem-entrada:seis",
        "numero-sem-entrada:seis",
        "trecho-repetido:seis pontos",
      ].sort(),
    );
  });

  test("seção ausente devolve null: régua que não acha o que ler não aprova", () => {
    expect(
      conferirAsContagens(INDICE.replace("## O código", "## Outro nome"), ler),
    ).toBeNull();
  });

  test("toda contagem conta hoje (nenhuma 'nao-contou'), e todo 'não conta' diz por quê", () => {
    for (const c of CONTAGENS)
      expect(c.contar(ler(c.le)!), `${c.arquivo}: ${c.trecho}`).not.toBeNull();
    for (const n of NAO_CONTAM)
      expect(
        n.motivo.length,
        `${n.trecho}: motivo curto é motivo sem revisão`,
      ).toBeGreaterThan(30);
  });
});

describe("LAB-119 · o que é número, e o que só parece", () => {
  test("por extenso, com acento; ordinal; algarismo", () => {
    expect(valorDoNumero("três")).toBe(3);
    expect(valorDoNumero("Cinco")).toBe(5);
    expect(valorDoNumero("quinta")).toBe(5);
    expect(valorDoNumero("sétimo")).toBe(7);
    expect(valorDoNumero("primeira")).toBe(1);
    expect(valorDoNumero("12")).toBe(12);
    expect(valorDoNumero("10/09/2026")).toBeNull();
  });

  test("o caso que quase parece número: 'um' é artigo, 'dezembro' e 'setembro' não são dez nem sete, e a citação sai", () => {
    const md = [
      "## O código",
      "",
      "| onde | o que tem |",
      "|---|---|",
      "| [`a`](../a.ts) | um experimento por capacidade, em dezembro e setembro, no LAB-26 e na D108, `três` entre crases, [quatro](x) |",
      "",
      "## Depois",
    ].join("\n");
    const linhas = linhasDaSecao(md)!;
    expect(linhas.map((l) => l.arquivo)).toEqual(["a.ts"]);
    expect(numerosDaSecao(linhas)).toEqual([]);
  });

  test("a seção acaba no próximo '## ', e o número de outra seção não entra", () => {
    const md =
      "## O código\n\n| [`a`](../a.ts) | seis |\n\n## Outra\n\n| [`b`](../b.ts) | sete |\n";
    expect(numerosDaSecao(linhasDaSecao(md)!).map((n) => n.palavra)).toEqual([
      "seis",
    ]);
  });
});
