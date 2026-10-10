/**
 * A guarda do item 006: **a trava forte é a ESTRUTURA, não a palavra.**
 *
 * ```sh
 * bun test tests/trava-de-estrutura.test.ts
 * ```
 *
 * O critério de "deu certo" do item: *"a sua trava tem uma frase dizendo se ela é estrutura ou
 * palavra, e o que ela não pega. As condições de volta foram varridas, com o número delas
 * escrito — inclusive se for zero."* As três coisas são cobradas aqui, **com número**.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { COMPROMISSO_MENSAL } from "../src/cobranca-por-uso.ts";
import {
  A_PALAVRA_QUE_ENGANA,
  CAMPO_DE_RECORRENCIA,
  COMPROMISSOS_DE_FORMATO_REAL,
  camposDeRecorrencia,
  condicoesDeConta,
  condicoesDeclaradas,
} from "../src/trava-de-estrutura.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (p: string) => readFileSync(join(RAIZ, p), "utf8");

function doGit(filtro: (f: string) => boolean): { arquivo: string; texto: string }[] {
  return execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8", maxBuffer: 64e6 })
    .split("\n")
    .filter((f) => f.trim() !== "" && filtro(f))
    .flatMap((f) => {
      try {
        return [{ arquivo: f, texto: ler(f) }];
      } catch {
        return [];
      }
    });
}

/** A §4-A, achada pelo TÍTULO. */
const regra = () =>
  (/\n## 4-A · [^\n]*\n([\s\S]*?)(?=\n## )/.exec(ler("CLAUDE.md"))?.[1] ?? "").replace(/[*`]/g, "");

describe("item 006 · pergunta 1: a minha trava é de PALAVRA, e QUANTO ela deixa passar", () => {
  /**
   * **O número é o argumento.** O item disse que *"franquia mínima e teste grátis passam por
   * qualquer varredura de texto"* — na minha **não passam**, há padrão para os dois. Mas a
   * conclusão dele está certa e medida fica **pior**: dos doze, a régua de palavra pega quatro.
   * *O exemplo estava errado; a lição estava certa.*
   */
  test("dos DOZE compromissos de formato real, a régua de palavra pega QUATRO", () => {
    const pega = COMPROMISSOS_DE_FORMATO_REAL.filter((c) =>
      COMPROMISSO_MENSAL.some((re) => re.test(c)),
    );
    expect(COMPROMISSOS_DE_FORMATO_REAL).toHaveLength(12);
    expect(pega.length, `pegou: ${pega.join(" | ")}`).toBe(4);
  });

  test("os dois casos que o item citou são justamente os que ela PEGA", () => {
    for (const c of ["franquia mínima de R$ 100", "free trial, then US$ 20"]) {
      expect(COMPROMISSO_MENSAL.some((re) => re.test(c)), c).toBe(true);
    }
  });

  test("a §4-A diz, com a palavra, se a trava é ESTRUTURA ou PALAVRA e o que ela não pega", () => {
    const r = regra().toLowerCase();
    expect(r).toContain("de palavra, não de estrutura");
    expect(r).toContain("8 dos 12");
    expect(r).toContain("campo que não existe não se esquece");
  });
});

describe("item 006 · pergunta 2: existe tipo onde a mensalidade caberia?", () => {
  const fontes = doGit((f) => f.endsWith(".ts") || f.endsWith(".tsx"));

  test("AQUI NÃO HÁ ONDE: nenhum campo de recorrência declarado em tipo nenhum", () => {
    // Os dois arquivos que **falam sobre** o campo: a régua e o teste dela, que carrega os
    // campos plantados como texto. É a forma do D155, e é a terceira lista nominal da casa
    // pelo mesmo motivo — cada entrada é um arquivo que tropeçou de verdade.
    const FALAM_SOBRE_O_CAMPO = [
      "external-engines/esteira/src/trava-de-estrutura.ts",
      "external-engines/esteira/tests/trava-de-estrutura.test.ts",
    ];
    const achados = camposDeRecorrencia(
      fontes.filter((f) => !FALAM_SOBRE_O_CAMPO.includes(f.arquivo)),
    );
    expect(achados.map((a) => `${a.arquivo}:${a.linha} · ${a.campo}`), "campo onde a mensalidade caberia").toEqual([]);
  });

  test("a régua de ESTRUTURA reprova o campo plantado — em qualquer das formas", () => {
    for (const ruim of [
      "  mensalidade: number;",
      "  valorMensal?: number;",
      "  franquiaMinima: number | null;",
      "  readonly billingCycle: string;",
      "  trialEndsAt?: Date;",
    ]) {
      expect(CAMPO_DE_RECORRENCIA.test(ruim), ruim).toBe(true);
    }
  });

  /**
   * **`assinatura` aqui é a assinatura de DETERMINISMO de uma rodada** — o hash que prova que a
   * mesma semente devolve o mesmo plano. Uma régua de palavra acusaria as sete ocorrências; a de
   * estrutura casa **declaração de campo** e não casa esta.
   */
  test("a régua NÃO acusa `assinatura` nem menção fora de declaração de campo", () => {
    for (const bom of [
      "  assinatura: string;",
      "  assinaturaDaRodada: string;",
      "// a mensalidade é proibida pela §4-A",
      "const semMensalidade = true;",
      "      assinatura: opcao.assinatura,",
    ]) {
      expect(CAMPO_DE_RECORRENCIA.test(bom), bom).toBe(false);
    }
    expect(A_PALAVRA_QUE_ENGANA.palavra).toBe("assinatura");
    expect(ler(A_PALAVRA_QUE_ENGANA.ondeMora.split(" e ")[0]!)).toContain("assinatura");
  });
});

describe("item 006 · pergunta 3: condição de retorno escrita sob a regra antiga", () => {
  /**
   * Os documentos onde uma condição de volta moraria.
   *
   * **Fora: os que ENUNCIAM a proibição.** O item 006 e a §4-A citam *"quando compensar"* para
   * dizer que isso é condição de conta — e a régua morde a frase que a define. É a **quarta**
   * vez da forma do D155 neste par de prompts, e a razão de toda lista destas ser **nominal**:
   * cada entrada é um arquivo que tropeçou de verdade, não um padrão que adivinha quais
   * tropeçariam.
   */
  /**
   * **A régua encurtou esta lista por SINAL ESTRUTURAL, e o resto mede o tamanho do defeito que
   * sobra.** Ela passou a pular **linha de citação** (`>`), e isso tirou daqui, sem nome de
   * arquivo nenhum, as duas acusações que vinham da MESMA frase da Central citada — no
   * `DECISOES.md` e no item. *Sinal estrutural no lugar de nome na lista.*
   *
   * **O que sobra são RELATÓRIOS DE PROMPT**, que citam a frase em tabela e em prosa própria, não
   * em citação: `LAB-73.md` e `LAB-74.md`. É a mesma classe que trava a lista do vazamento de
   * custo, e é o objeto da proposta ao chat (D243) — *escopar por destino em vez de por nome*. A
   * `CLAUDE.md` fica porque a §4-A enuncia a proibição em texto próprio.
   */
  // **TRÊS → DOIS no LAB-80**, e por medição: a régua passou a ler bloco de código, crase e
  // citação curta (a mesma leitura que a varredura de custo ganhou no mesmo prompt, D231), e o
  // `LAB-74.md` revelou-se **isenção morta** — não acusava nada, exatamente como na lista de
  // custo (D260).
  //
  // **E o `LAB-73.md` FICA, contra a minha primeira conclusão.** Eu medi com um script que testava
  // só o PRIMEIRO padrão que casava a linha, e a régua testa TODOS (`.some`): na linha 88 o
  // *"quando compensar"* está entre aspas e dissolve, mas **`ponto de equilíbrio` está nu**, numa
  // célula de tabela. Eu ia publicar "três a um" e são "três a dois" — *régua de medição mais
  // estreita que a régua medida dá o número errado para o lado otimista* (D266).
  const FALAM_SOBRE_A_CONDICAO = ["CLAUDE.md", "docs/relatorios/LAB-73.md"];
  const docs = doGit(
    (f) =>
      f.endsWith(".md") &&
      !f.startsWith("docs/caixa-de-entrada/006") &&
      !FALAM_SOBRE_A_CONDICAO.includes(f),
  );

  test("as condições declaradas são DEZESSEIS, e nenhuma é uma CONTA", () => {
    // 15 → 16 no LAB-78 (o sétimo mecanismo, `aguardando-o-jonny`), 16 → 17 no LAB-80 (a
    // unificação das cinco leituras, `prompt-novo`) e 17 → 16 no LAB-81, por ENTREGA dela.
    // 16 → 17 no LAB-82 (o carimbo do módulo resolvido, `prompt-novo`) e no LAB-83 duas vezes,
    // de volta a 17: o carimbo saiu por ENTREGA e o trabalho de CI do D279 entrou.
    // 17 → 16 no LAB-84, por ENTREGA da do trabalho de CI (D282).
    // **O vocabulário não mudou** em nenhuma das seis — e é ele que esta trava guarda: todas as
    // mudanças do dia são `prompt-novo`, que já existia, e nenhuma condição é uma CONTA.
    const declaradas = condicoesDeclaradas(ler("docs/prompts/FILA.md"));
    expect(declaradas.length, declaradas.join(", ")).toBe(16);
    // Nenhuma delas é volume: todas esperam pessoa, repositório, prompt ou medição.
    expect(new Set(declaradas)).toEqual(
      new Set([
        "prompt-novo",
        "nao-medido",
        "aguardando-outro-repositorio",
        "escopo-novo",
        "depois-do-mvp",
        "aguardando-o-jonny",
      ]),
    );
  });

  test("ZERO condições de CONTA em todo o repositório — e zero é resposta", () => {
    const achados = condicoesDeConta(docs);
    expect(achados.map((a) => `${a.arquivo}:${a.linha} · ${a.trecho}`)).toEqual([]);
  });

  test("a régua da condição de CONTA reprova de verdade, plantada", () => {
    const plantadas = [
      { arquivo: "x.md", texto: 'volta quando o volume mensal pagar os US$ 10' },
      { arquivo: "x.md", texto: "reabrir quando compensar" },
      { arquivo: "x.md", texto: "espera o ponto de equilíbrio" },
      { arquivo: "x.md", texto: "a partir de 200 clientes entra" },
    ];
    for (const p of plantadas) expect(condicoesDeConta([p]).length, p.texto).toBe(1);
    // E uma linha com DUAS marcas continua sendo UMA condição — senão o número infla.
    expect(condicoesDeConta([{ arquivo: "x.md", texto: "volta quando o volume pagar, no ponto de equilíbrio" }])).toHaveLength(1);
  });

  test("linha de CITAÇÃO não é condição desta casa (item 007), e nem frase entre ASPAS (LAB-80)", () => {
    const citada = "> O `grep` por *\"quando compensar\"*, *\"ponto de equilíbrio\"* deu ZERO";
    expect(condicoesDeConta([{ arquivo: "x.md", texto: citada }])).toEqual([]);
    // **E a mesma frase SEM o `>` também não é mais acusada**, porque desde o LAB-80 a régua lê a
    // aspas curta como quem MOSTRA, não como quem afirma. É mudança de sentido declarada: *reportar
    // a frase de outro não é assumir a condição*, e o `>` nunca foi a única forma de reportar.
    expect(condicoesDeConta([{ arquivo: "x.md", texto: citada.replace(/^> /, "") }])).toEqual([]);
    // O que CONTINUA sendo acusado é a frase escrita NUA — que é como se adota qualquer coisa.
    expect(condicoesDeConta([{ arquivo: "x.md", texto: "volta no ponto de equilíbrio" }])).toHaveLength(1);
    expect(condicoesDeConta([{ arquivo: "x.md", texto: "> volta no ponto de equilíbrio" }])).toEqual([]);
  });

  test("e NÃO acusa `volume` noutro sentido — a §6 fala de acusar em volume", () => {
    const outroSentido = [
      "Antes de acusar em volume, pergunte se o volume é da coisa ou da sua régua.",
      "o volume de terra movida no corte",
      "aguardando-o-jonny",
    ];
    for (const t of outroSentido) {
      expect(condicoesDeConta([{ arquivo: "x.md", texto: t }]).length, t).toBe(0);
    }
  });
});
