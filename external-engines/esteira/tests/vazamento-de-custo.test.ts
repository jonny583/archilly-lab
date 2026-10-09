/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NOSSO CUSTO NÃO VAZA PARA O CLIENTE. (Central, 08/10/2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **O achado é da Central:** a função de consulta de preço devolvia `custoMedido` e
 * `multiplicador` desde a migração 0001, nos dois modos, e **quem recebeu mostrou** — a tela de
 * Créditos do hub imprimia *"custo × 3"* para o cliente.
 *
 * Há **três níveis de dono**, e confundi-los estraga tela e banco: o **Admin dono do Archilly**
 * (define fator, preço e regra de cobrança, e é o único que vê custo e margem), o **Admin do
 * escritório** e o **usuário comum**. *Custo, fator e margem nunca chegam aos dois últimos.*
 *
 * # Aqui a varredura deu ZERO, e esta trava é para continuar dando
 *
 * Este repositório **não tem tela de produto** (§4: o único HTML é a bancada da prova no
 * navegador) e **não faz chamada paga de IA** — as únicas menções a `anthropic`/`openai` são
 * **nomes de regra da minha varredura de segredos**, que procura chaves, não as usa.
 *
 * **Mas o que o git carrega sai daqui**: relatório, prova e recado vão ao chat e à página do
 * Jonny. Então a trava cobra o que de fato pode vazar por este repositório.
 *
 * # Por que `margem` sozinha NÃO conta, e isso é o D137
 *
 * `margem` aqui é **geométrica** — folga da caixa envolvente, em metros, em `alturas.ts` e
 * `terrenos.ts`. Acusá-la seria medir **ortografia**, não conteúdo. Só conta quando aparece
 * **junto de dinheiro**.
 */

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** Os nomes do NOSSO custo e do NOSSO fator. Nenhum deles pode sair daqui. */
export const NOMES_DO_NOSSO_CUSTO = [
  /\bcustoMedido\b/,
  /\bcusto_medido\b/,
  /\bmultiplicador\b/,
  /\bcusto\s*[x×]\s*\d/i,
  /\bmarkup\b/i,
  /\bprecoCusto\b/,
] as const;

/**
 * `margem` só conta **perto de dinheiro** — a mesma linha tem de trazer lucro, preço, custo,
 * `R$` ou `US$`. Sem isso é a folga geométrica, em metros, e acusá-la é medir ortografia (D137).
 */
export const MARGEM_DE_DINHEIRO = /\bmargem\b[^\n]{0,60}?(lucro|pre[çc]o|custo|R\$|US\$)|\b(lucro|pre[çc]o|custo|R\$|US\$)[^\n]{0,60}?\bmargem\b/i;

/** Tudo que o git carrega — é o escopo certo: o que o git carrega é o que sai daqui. */
function arquivosDoGit(): string[] {
  return execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8", maxBuffer: 64e6 })
    .split("\n")
    .filter((f) => f.trim() !== "");
}

/**
 * Os documentos que **falam sobre** o vazamento — e **falar não é vazar** (D155).
 *
 * A lista é **nominal e curta de propósito**: nenhuma pasta inteira, nenhum padrão. A primeira
 * versão esqueceu o `INDEX.md`, e a régua acusou a própria linha que **descreve este conserto**
 * — a mesma forma do D155, onde ela reprovou o arquivo que eu acabara de consertar porque o
 * comentário do conserto citava o defeito. *Varredura em texto mede o que o texto FAZ e o que
 * ele DIZ SOBRE SI, e só uma delas é o objeto.*
 *
 * Nenhum destes é tela de produto: são registro. O que sai para o cliente não passa por aqui.
 */
const FALAM_SOBRE_O_ASSUNTO = [
  "external-engines/esteira/tests/vazamento-de-custo.test.ts",
  "docs/DECISOES.md",
  "docs/relatorios/RECADOS.md",
  "docs/relatorios/LAB-67.md",
  "docs/INDEX.md",
  // Item 005: a §4-A e o item que a trouxe **enunciam** a proibição — *"custo, fator e margem
  // nunca chegam ao usuário comum"* —, e a régua acusou a própria linha que a define. É a
  // terceira vez da forma do D155 nesta lista, e a razão de ela ser NOMINAL: cada entrada é um
  // arquivo que tropeçou de verdade, não um padrão que adivinha quais tropeçariam.
  "CLAUDE.md",
  "docs/caixa-de-entrada/005-FEITO.md",
  // Item 006: o relatório do 005 e a declaração das consequências **enunciam** a proibição —
  // a nº 3 é literalmente *"o multiplicador não chega ao usuário"*.
  "docs/relatorios/LAB-72.md",
  "external-engines/esteira/src/cobranca-por-uso.ts",
  // Itens 006 e 007: os relatórios que DOCUMENTAM os achados citam `multiplicador` ao explicar a
  // proibição. **Estes dois são o sinal do defeito de desenho declarado no LAB-73 §7** — ver o
  // comentário do teto, e a proposta ao chat que saiu daí.
  "docs/relatorios/LAB-73.md",
  "docs/relatorios/LAB-74.md",
];

/**
 * **Chamada paga de IA se procura no IMPORT e na CHAMADA, não no texto** (D142, D224).
 *
 * A primeira versão varria o arquivo inteiro atrás de `PedidoIA`, `central.ia`, `@anthropic-ai/`
 * e `new OpenAI` — e **casou consigo mesma** assim que este arquivo entrou no git: os nomes
 * estão aqui dentro, no padrão que os procura. *Régua que varre texto mede o que o código FAZ
 * e o que ele DIZ SOBRE SI, e só uma delas é o objeto.*
 *
 * Agora ela procura onde o nome **significa chamar**: num `import … from`, num `require(…)`, ou
 * depois de `new`. Mencionar o nome num padrão, num comentário ou numa string não é chamar.
 */
export const CHAMADA_PAGA_DE_IA = [
  /\bfrom\s+["'`](?:@anthropic-ai\/[\w-]+|openai|@google\/genai|cohere-ai|@mistralai\/[\w-]+)["'`]/,
  /\brequire\(\s*["'`](?:@anthropic-ai\/[\w-]+|openai)["'`]\s*\)/,
  /\bnew\s+(?:OpenAI|Anthropic)\s*\(/,
  /\bfrom\s+["'`][^"'`]*\bgateway\b[^"'`]*["'`]/,
  /\b(?:await\s+)?central\.ia\.\w+\s*\(/,
  /:\s*PedidoIA\b|\bPedidoIA\s*=|\bas\s+PedidoIA\b/,
] as const;

describe("o nosso custo não vaza — Central, 08/10/2026", () => {
  const arquivos = arquivosDoGit().filter((f) => !FALAM_SOBRE_O_ASSUNTO.includes(f));

  test("o escopo é tudo que o git carrega, e não uma pasta escolhida a dedo", () => {
    expect(arquivos.length).toBeGreaterThan(100);
  });

  /**
   * **O teto subiu de 6 para 9 em dois prompts, e subir é um ato declarado.** Entraram a
   * `CLAUDE.md` (a §4-A **enuncia** a proibição: *"custo, fator e margem nunca chegam ao usuário
   * comum"*), o item que a trouxe, o relatório dele e a declaração das consequências — quatro
   * arquivos que **dizem a regra**, acusados pela régua que a cumpre. É a forma do D155, e nesta
   * lista já é a quinta vez.
   *
   * **E o teto tem um CRITÉRIO, não só um número** (D240): ele sobe quando a regra passa a ser
   * **escrita** em mais um lugar, e cada entrada nova nomeia qual regra enuncia. *Se ele subir
   * sem que uma regra nova tenha sido escrita, o que está errado é o desenho da lista, não o
   * número* — e aí a varredura precisa aprender a diferença entre prosa e produto, em vez de
   * ganhar mais uma linha.
   *
   * **E O CRITÉRIO DISPAROU, no item 007: o teto foi a 11 e as duas entradas novas são
   * RELATÓRIOS** — `LAB-73.md` e `LAB-74.md`, que não são regra nova: são documentação **sobre** a
   * regra. *Pela minha própria frase, o que está errado daqui em diante é o DESENHO*, e a saída
   * não é uma linha por relatório: é escopar a varredura por **destino** — o que pode chegar a um
   * usuário —, deixando o registro com uma conferência própria (o valor citado tem de estar dentro
   * de citação ou de bloco de código). **Isso é mudança de modelo, não conserto deste item**
   * (§1-A: não ampliar escopo), e está na `FILA.md` como proposta ao chat, com este número (D243).
   */
  test("a lista de exceções é NOMINAL e curta — nada de pasta inteira nem padrão", () => {
    expect(FALAM_SOBRE_O_ASSUNTO.length).toBeLessThanOrEqual(11);
    expect(new Set(FALAM_SOBRE_O_ASSUNTO).size).toBe(FALAM_SOBRE_O_ASSUNTO.length);
    for (const f of FALAM_SOBRE_O_ASSUNTO) {
      expect(f, f).not.toContain("*");
      expect(f.endsWith(".md") || f.endsWith(".ts"), f).toBe(true);
    }
  });

  test("nenhum arquivo carrega custoMedido, multiplicador, custo × N, markup ou precoCusto", () => {
    const achados: string[] = [];
    for (const f of arquivos) {
      let texto: string;
      try {
        texto = readFileSync(join(RAIZ, f), "utf8");
      } catch {
        continue; // binário ou ilegível: não é texto que vaza
      }
      texto.split("\n").forEach((linha, i) => {
        for (const re of NOMES_DO_NOSSO_CUSTO) {
          if (re.test(linha)) achados.push(`${f}:${i + 1} · ${re.source}`);
        }
      });
    }
    expect(achados, achados.join("\n")).toEqual([]);
  });

  test("nenhum arquivo traz MARGEM junto de dinheiro", () => {
    const achados: string[] = [];
    for (const f of arquivos) {
      let texto: string;
      try {
        texto = readFileSync(join(RAIZ, f), "utf8");
      } catch {
        continue;
      }
      texto.split("\n").forEach((linha, i) => {
        if (MARGEM_DE_DINHEIRO.test(linha)) achados.push(`${f}:${i + 1} · ${linha.trim().slice(0, 90)}`);
      });
    }
    expect(achados, achados.join("\n")).toEqual([]);
  });

  test("a régua REPROVA o vazamento de verdade, plantado", () => {
    for (const texto of ['{ "custoMedido": 0.012 }', "const multiplicador = 3;", "custo × 3", "markup: 3"]) {
      expect(NOMES_DO_NOSSO_CUSTO.some((re) => re.test(texto))).toBe(true);
    }
    expect(MARGEM_DE_DINHEIRO.test("a margem de lucro é 40%")).toBe(true);
    expect(MARGEM_DE_DINHEIRO.test("preço com margem")).toBe(true);
  });

  test("a régua NÃO acusa a margem GEOMÉTRICA — seria medir ortografia (D137)", () => {
    for (const texto of [
      "const margem = lado * 0.08;",
      "A grade cobre a caixa envolvente da gleba mais uma margem.",
      "a extensão vai de ponta a ponta dele com 15 m de margem",
      "retrato do erro, sem margem para dúvida",
    ]) {
      expect(MARGEM_DE_DINHEIRO.test(texto), texto).toBe(false);
      expect(NOMES_DO_NOSSO_CUSTO.some((re) => re.test(texto)), texto).toBe(false);
    }
  });


  test("este repositório não faz chamada paga de IA — medido no IMPORT e na CHAMADA", () => {
    // O fonte DESTA trava carrega os padrões e as fixtures: ele mede, não chama (D155).
    const fontes = arquivos.filter((f) => /\.(ts|tsx|js|mjs)$/.test(f));
    const chamadas: string[] = [];
    for (const f of fontes) {
      const texto = readFileSync(join(RAIZ, f), "utf8");
      for (const re of CHAMADA_PAGA_DE_IA) {
        if (re.test(texto)) chamadas.push(`${f} · ${re.source.slice(0, 40)}`);
      }
    }
    expect(chamadas, chamadas.join("\n")).toEqual([]);
  });

  test("a régua da chamada paga reprova o caso ruim E aprova o caso bom", () => {
    const ruins = [
      'import Anthropic from "@anthropic-ai/sdk";',
      'import OpenAI from "openai";',
      'const c = require("openai");',
      "const cliente = new Anthropic({ apiKey: k });",
      "const r = await central.ia.leitura({ paginas: 3 });",
      "const pedido: PedidoIA = { operacao: 'ia.texto' };",
    ];
    for (const r of ruins) {
      expect(CHAMADA_PAGA_DE_IA.some((re) => re.test(r)), r).toBe(true);
    }
    const bons = [
      '{ nome: "chave-de-ia-anthropic", oQue: "chave da API da Anthropic" }',
      "// este repositório não usa PedidoIA nem central.ia",
      'const padrao = /\\bPedidoIA\\b|\\bnew OpenAI\\b/;',
      "o gateway da Central mede sozinho segundos de vídeo",
    ];
    for (const b of bons) {
      expect(CHAMADA_PAGA_DE_IA.some((re) => re.test(b)), b).toBe(false);
    }
  });
});
