/**
 * **LAB-120 (item 900) · as contagens de desenho do `CLAUDE.md`, conferidas contra o arquivo que
 * elas contam** (D348).
 *
 * ```sh
 * bun test tests/contagens-do-claude.test.ts
 * ```
 *
 * O D347 conferiu a seção *"O código"* do índice e deixou dito que não alcançava o `CLAUDE.md`.
 * Medido aqui: 29 números lidos, 16 contam um arquivo, nenhum errado — e nenhum era conferido
 * contra o arquivo, só copiado. Lê só arquivos deste repositório: entra no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CONTAGENS,
  NAO_CONTAM,
  conferirAsContagensDoClaude,
  linhasDaPagina,
  numerosDaPagina,
  trechoComoExpressao,
} from "../src/contagens-do-claude.ts";
import type { Ler } from "../src/contagens-do-indice.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
const ler: Ler = (c) => (existsSync(join(RAIZ, c)) ? readFileSync(join(RAIZ, c), "utf8") : null);

const comArquivo =
  (caminho: string, troca: (t: string) => string): Ler =>
  (c) => {
    const t = ler(c);
    return c === caminho && t !== null ? troca(t) : t;
  };
const motivos = (r: ReturnType<typeof conferirAsContagensDoClaude>) =>
  r!.desacordos.map((d) => `${d.motivo}:${d.trecho}`);
/** Troca exatamente UM trecho, e reprova a própria prova se ele não estava lá. */
const trocar = (texto: string, de: string, para: string) => {
  expect(texto.split(de).length - 1, `a mutação não acha: ${de}`).toBe(1);
  return texto.replace(de, para);
};

describe("LAB-120 · o número do CLAUDE.md é o que o arquivo conta", () => {
  test("o lado bom: hoje, nenhum desacordo — e o universo lido vai publicado", () => {
    const r = conferirAsContagensDoClaude(PAGINA, ler)!;
    expect(r.desacordos).toEqual([]);
    expect(r.numerosLidos).toBeGreaterThan(20);
    expect(r.contagens + r.naoContam).toBe(r.numerosLidos);
    expect(r.pulado.linhasDeCitacao).toBeGreaterThan(20); // a §1-C e as palavras do Jonny
    console.log(
      `    ${r.linhasLidas} linhas lidas · ${r.numerosLidos} números · ${r.contagens} contados no arquivo · ` +
        `${r.naoContam} declarados que não contam · pulados: ${JSON.stringify(r.pulado)}`,
    );
  });

  test("página ausente ou vazia não aprova: devolve null", () => {
    expect(conferirAsContagensDoClaude(null, ler)).toBeNull();
    expect(conferirAsContagensDoClaude("  \n", ler)).toBeNull();
  });

  test("o lado ruim, na PÁGINA: 'As nove' consequências acusa CONTA DIFERENTE, com o escrito e o contado", () => {
    const p = trocar(PAGINA, "contratada junto. As oito", "contratada junto. As nove");
    const r = conferirAsContagensDoClaude(p, ler)!;
    expect(r.desacordos).toEqual([
      expect.objectContaining({
        trecho: "contratada junto. As {n}",
        motivo: "conta-diferente",
        escrito: 9,
        contado: 8,
      }),
    ]);
  });

  test("o lado ruim, na PÁGINA: 'pega 5 dos 12' e 'DOIS passos' viram 'TRÊS' — cada um acusa o seu", () => {
    let p = trocar(PAGINA, "pega 4 dos", "pega 5 dos");
    p = trocar(p, "Religar são **DOIS**", "Religar são **TRÊS**");
    expect(motivos(conferirAsContagensDoClaude(p, ler)).sort()).toEqual(
      ["conta-diferente:pega {n} dos", "conta-diferente:Religar são **{n}**"].sort(),
    );
  });

  test("o lado ruim, no ARQUIVO: um compromisso a mais que a régua pega muda o 4 e o 12, e o 8 não", () => {
    const ESTRUTURA = "external-engines/esteira/src/trava-de-estrutura.ts";
    const mais = comArquivo(ESTRUTURA, (t) =>
      trocar(t, '  "teste de 14 dias, cartão obrigatório",', '  "teste de 14 dias, cartão obrigatório",\n  "assinatura mensal de R$ 50",'),
    );
    expect(motivos(conferirAsContagensDoClaude(PAGINA, mais)).sort()).toEqual(
      [
        "conta-diferente:pega {n} dos",
        "conta-diferente:dos {n} compromissos",
        "conta-diferente:dos {n} escapam",
      ].sort(),
    );
  });

  test("o lado ruim, no ARQUIVO: o teto do recado, a faixa, o terceiro trabalho e o terceiro passo", () => {
    const casos: [string, (t: string) => string, string[]][] = [
      [
        "external-engines/esteira/tests/recado.test.ts",
        (t) => trocar(t, ".toBeLessThanOrEqual(12);", ".toBeLessThanOrEqual(13);"),
        ["conta-diferente:O teto de {n} linhas", "conta-diferente:{n} linhas é teto"],
      ],
      [
        "external-engines/esteira/src/cobranca-por-uso.ts",
        (t) => trocar(t, "FAIXAS_DE_USO = [3, 20, 200]", "FAIXAS_DE_USO = [5, 20, 200]"),
        ["conta-diferente:com **{n}**,", "conta-diferente:com {n} clientes"],
      ],
      [
        ".github/workflows/verde.yml",
        (t) => t.replace(/^jobs:\n/m, "jobs:\n  terceiro:\n    runs-on: ubuntu-latest\n"),
        ["conta-diferente:tem {n} trabalhos"],
      ],
      [
        "docs/COMO_RELIGAR_O_CI.md",
        (t) => t + "\n**Passo 3 — avisar a direção.**\n",
        ["conta-diferente:Religar são **{n}**"],
      ],
    ];
    for (const [arquivo, troca, esperado] of casos)
      expect(motivos(conferirAsContagensDoClaude(PAGINA, comArquivo(arquivo, troca))).sort(), arquivo).toEqual(
        esperado.sort(),
      );
  });

  test("arquivo que sumiu ou forma que sumiu é NÃO CONTOU — nunca o texto vazio que contaria zero", () => {
    const semArquivo: Ler = (c) => (c === "docs/COMO_RELIGAR_O_CI.md" ? null : ler(c));
    expect(motivos(conferirAsContagensDoClaude(PAGINA, semArquivo))).toEqual(["nao-contou:Religar são **{n}**"]);
    const semConstante = comArquivo("external-engines/esteira/src/varredura-de-segredos.ts", (t) =>
      trocar(t, "export const MAXIMO_DE_CARACTERES_NA_AMOSTRA = 12;", "const MAXIMO = 12;"),
    );
    expect(motivos(conferirAsContagensDoClaude(PAGINA, semConstante))).toEqual(["nao-contou:mais de {n}"]);
    // A receita sem nenhum "Passo N" não tem ZERO passos: perdeu a forma que se conta.
    const semPassos = comArquivo("docs/COMO_RELIGAR_O_CI.md", (t) => t.replace(/^\*\*Passo \d+ —/gm, "**Etapa —"));
    expect(motivos(conferirAsContagensDoClaude(PAGINA, semPassos))).toEqual(["nao-contou:Religar são **{n}**"]);
    // Dois tetos no mesmo teste não é um teto: a contagem não escolhe o primeiro.
    const doisTetos = comArquivo("external-engines/esteira/tests/recado.test.ts", (t) =>
      trocar(t, ".toBeLessThanOrEqual(12);", ".toBeLessThanOrEqual(12);\n    expect(1).toBeLessThanOrEqual(99);"),
    );
    expect(motivos(conferirAsContagensDoClaude(PAGINA, doisTetos)).sort()).toEqual(
      ["nao-contou:O teto de {n} linhas", "nao-contou:{n} linhas é teto"].sort(),
    );
  });

  test("o lado ruim, nos dois sentidos: número novo sem entrada, entrada sem frase, frase repetida, trecho sem marca", () => {
    const novo = trocar(PAGINA, "despedida, nem segundo bloco.", "despedida, nem segundo bloco, nem cinco linhas soltas.");
    expect(motivos(conferirAsContagensDoClaude(novo, ler))).toEqual(["numero-sem-entrada:cinco"]);

    const sumiu = trocar(PAGINA, "Duas pilhas convivem", "Pilhas convivem");
    expect(motivos(conferirAsContagensDoClaude(sumiu, ler))).toEqual(["entrada-sem-trecho:{n} pilhas convivem"]);

    const repetido = PAGINA + "\nE de novo: Node 20+.\n";
    expect(motivos(conferirAsContagensDoClaude(repetido, ler)).sort()).toEqual(
      ["numero-sem-entrada:22", "numero-sem-entrada:20", "trecho-repetido:Node {n}+"].sort(),
    );

    const semMarca = [...NAO_CONTAM, { trecho: "Duas pilhas", motivo: "sem marca" }];
    expect(motivos(conferirAsContagensDoClaude(PAGINA, ler, CONTAGENS, semMarca))).toEqual([
      "trecho-sem-marca:Duas pilhas",
    ]);
  });

  test("tirar uma entrada da lista deixa o número dela SEM entrada", () => {
    const menos = CONTAGENS.filter((c) => c.trecho !== "tem {n} trabalhos");
    expect(motivos(conferirAsContagensDoClaude(PAGINA, ler, menos))).toEqual(["numero-sem-entrada:dois"]);
  });
});

describe("LAB-120 · o que a leitura pula — e o caso válido que quase parece inválido", () => {
  const nums = (t: string) => numerosDaPagina(linhasDaPagina(t).linhas).map((n) => n.palavra);

  test("pula: bloco de código, citação literal, data, número da seção e marcador de lista", () => {
    const t = [
      "```",
      "doze linhas de exemplo",
      "```",
      "> três sessões já perderam texto assim",
      "## 4-A · Da família",
      "1. **a ordenação**",
      "Mandado em 08/10/2026 e zerado em 1º/11/2026.",
    ].join("\n");
    expect(nums(t)).toEqual([]);
    expect(linhasDaPagina(t).pulado).toEqual({
      linhasDeCodigo: 3,
      linhasDeCitacao: 1,
      datas: 2,
      numerosDeSecao: 1,
      marcadoresDeLista: 1,
    });
  });

  test("NÃO pula o resto da linha: o título conta depois do número da seção, e a lista depois do marcador", () => {
    expect(nums("## 7 · As oito regras")).toEqual(["oito"]);
    expect(nums("2. as três faixas")).toEqual(["três"]);
    expect(nums("o passo 2. depois")).toEqual(["2"]); // o marcador só no começo da linha
  });

  test("o ponteiro não é número: LAB-NN, D123, § e o caminho entre crases saem", () => {
    expect(nums("o LAB-119 (D347, §H10) e o `src/lab84.ts`")).toEqual([]);
  });

  test("o trecho com marca acha o número, por extenso ou algarismo, e só um", () => {
    const re = trechoComoExpressao("pega {n} dos")!;
    expect([..."pega 4 dos".matchAll(re)].map((m) => m[1])).toEqual(["4"]);
    expect([..."pega quatro dos".matchAll(re)].map((m) => m[1])).toEqual(["quatro"]);
    expect(trechoComoExpressao("sem marca")).toBeNull();
    expect(trechoComoExpressao("{n} e {n}")).toBeNull();
  });
});
