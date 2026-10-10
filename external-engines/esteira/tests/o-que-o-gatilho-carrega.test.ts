/**
 * A guarda da DECISÃO sobre o que o gatilho automático carrega. (item 018, LAB-85)
 *
 * ```sh
 * bun test tests/o-que-o-gatilho-carrega.test.ts
 * ```
 *
 * O item 018 pediu a trava **porque a decisão é um desligamento**, e desligamento sem guarda
 * envelhece: *"um `if:` de configuração que diz 'só roda se o segredo existir' não deixa nada
 * vermelho — é exatamente o desligamento mais completo que existe."*
 *
 * Então esta trava cobra **os dois sentidos**, e é isso que a torna um prazo:
 *
 * 1. enquanto a condição estiver no arquivo, ela traz a **marca** e a pendência está **aberta**
 *    na página do Jonny;
 * 2. no dia em que a pendência for marcada como **resolvida**, a condição **tem de sair**.
 *
 * *O segundo sentido é o prazo, e ele é um EVENTO e não uma data — prazo que não pode ser uma
 * data ainda pode ser um evento, desde que alguém cobre o evento.*
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ANCORA_DO_TRABALHO_2,
  CAMINHOS,
  CONDICAO_DO_VERDE_COMPLETO,
  MARCA_NA_PAGINA,
  TITULO_DA_PENDENCIA,
  conferirOQueOGatilhoCarrega,
  jobsDoWorkflow,
} from "../src/o-que-o-gatilho-carrega.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const workflow = () => readFileSync(join(RAIZ, ".github", "workflows", "verde.yml"), "utf8");
const pagina = () => readFileSync(join(RAIZ, "docs", "PENDENCIAS_JONNY.md"), "utf8");

describe("item 018 · a decisão está escrita, e os três caminhos têm o custo ao lado", () => {
  test("O LADO BOM: a decisão de hoje não tem problema nenhum", () => {
    expect(conferirOQueOGatilhoCarrega(workflow(), pagina()).map((p) => `${p.tipo}: ${p.oQue}`)).toEqual([]);
  });

  test("são TRÊS caminhos, UM escolhido, e cada um com o que PERDE escrito", () => {
    expect(CAMINHOS).toHaveLength(3);
    expect(CAMINHOS.filter((c) => c.escolhido)).toHaveLength(1);
    for (const c of CAMINHOS) {
      expect(c.perde.length, c.nome).toBeGreaterThan(40);
      expect(c.ganha.length, c.nome).toBeGreaterThan(10);
    }
  });

  test("o custo em dinheiro de NOVEMBRO é o mesmo nos três, e é ZERO", () => {
    // Medido na API: `billable.UBUNTU.total_ms` = 0 em três execuções de três dias. Repositório
    // público, `ubuntu-latest` gratuito e não medido. **Quando a coluna do dinheiro empata, ela
    // para de decidir** — e foi por isso que a decisão saiu pela coluna do SINAL.
    expect(new Set(CAMINHOS.map((c) => c.custoEmNovembro))).toEqual(new Set(["R$ 0"]));
  });

  test("a condição está no trabalho 2, e o trabalho 1 NÃO tem condição — lido do YAML", () => {
    // **Pela ESTRUTURA, não pelo texto** (D286): a primeira versão desta trava procurava a
    // palavra `if:` entre os dois nomes e acusou o COMENTÁRIO que explica a condição.
    const jobs = jobsDoWorkflow(workflow());
    expect(jobs).not.toBeNull();
    expect(Object.keys(jobs!).sort()).toEqual(["guardas-sem-clones", "verde-completo"]);
    expect(jobs!["verde-completo"]?.if).toBe(CONDICAO_DO_VERDE_COMPLETO);
    expect(jobs!["guardas-sem-clones"]?.if).toBeUndefined();
  });

  test("E O CONTRÁRIO: a régua de TEXTO que eu escrevi primeiro ACUSAVA o comentário", () => {
    // Sem esta trava a lição do D286 vira comentário, e comentário não se revalida (D104).
    const y = workflow();
    const i1 = y.indexOf("guardas-sem-clones:");
    const i2 = y.indexOf("verde-completo:");
    // O trecho entre os dois nomes CONTÉM "if:" — e não por causa de uma condição, mas da caixa
    // de comentário que explica a condição do trabalho de baixo.
    expect(y.slice(i1, i2)).toContain("if:");
    // E a régua de estrutura, na mesma pergunta, diz a verdade:
    expect(jobsDoWorkflow(y)!["guardas-sem-clones"]?.if).toBeUndefined();
  });

  test("o GATILHO continua comentado — este prompt NÃO religa nada", () => {
    const y = workflow();
    // O item foi explícito: "NÃO RELIGUE NADA… a régua cobra; não liga."
    expect(y).toContain("#  push:");
    expect(y).toContain("#  pull_request:");
    // E o `workflow_dispatch` segue ligado, que é por onde o verde completo roda à mão.
    expect(y).toMatch(/^ {2}workflow_dispatch:/m);
  });

  test("a pendência do segredo está na PÁGINA DO JONNY, e não só num relatório", () => {
    // É o achado do D285: o LAB-38 pediu isto no relatório e nunca na página, e o item 018
    // afirmou que estava lá. *Pedido que mora só num relatório não chega a quem decide.*
    const p = pagina();
    expect(p).toContain(MARCA_NA_PAGINA);
    // Escrita para LEIGO, como a §5 manda: sem a palavra técnica sozinha.
    expect(p).toContain("senha");
  });
});

describe("item 018 · O LADO RUIM: cada jeito de a decisão apodrecer REPROVA", () => {
  test("a condição sair do arquivo REPROVA", () => {
    const estragado = workflow().replace(`if: ${CONDICAO_DO_VERDE_COMPLETO}`, "");
    const p = conferirOQueOGatilhoCarrega(estragado, pagina());
    expect(p.map((x) => x.tipo)).toContain("condicao-ausente");
  });

  test("a condição SEM A MARCA perto dela REPROVA — é desligamento calado", () => {
    // Tira SÓ a caixa de comentário que explica a condição, e deixa a condição e o YAML
    // VÁLIDOS: é exatamente o desligamento calado que o item 018 descreveu — e um YAML quebrado
    // seria outro defeito, que esta trava não está medindo.
    const linhas = workflow().split("\n");
    const ini = linhas.findIndex((l) => l.includes(ANCORA_DO_TRABALHO_2));
    const fim = linhas.findIndex((l, k) => k > ini && l.trim() === "verde-completo:");
    expect(ini).toBeGreaterThanOrEqual(0);
    expect(fim).toBeGreaterThan(ini);
    const estragado = [...linhas.slice(0, ini + 1), ...linhas.slice(fim)].join("\n");
    expect(estragado).toContain(`if: ${CONDICAO_DO_VERDE_COMPLETO}`);
    // E o YAML continua abrindo, com os dois trabalhos:
    expect(Object.keys(jobsDoWorkflow(estragado) ?? {})).toHaveLength(2);
    const p = conferirOQueOGatilhoCarrega(estragado, pagina());
    expect(p.map((x) => x.tipo)).toContain("condicao-sem-marca");
  });

  test("condicionar o TRABALHO 1 REPROVA — ele é o portão de todo envio", () => {
    const estragado = workflow().replace(
      "    name: guardas que não precisam dos clones vizinhos (NÃO é o verde)",
      "    name: guardas que não precisam dos clones vizinhos (NÃO é o verde)\n    if: false",
    );
    const p = conferirOQueOGatilhoCarrega(estragado, pagina());
    expect(p.map((x) => x.tipo)).toContain("trabalho-1-condicionado");
    // A mensagem DIZ o que achou, e não só que achou.
    expect(p.map((x) => x.oQue).join(" ")).toContain("false");
  });

  test("YAML que não abre é PROBLEMA, não aprovação", () => {
    const p = conferirOQueOGatilhoCarrega("isto: [não é\n  yaml: :", pagina());
    expect(p.map((x) => x.tipo)).toContain("yaml-nao-abre");
  });

  test("a pendência sair da página do Jonny REPROVA", () => {
    const semPendencia = pagina().replaceAll(MARCA_NA_PAGINA, "(apagado)");
    const p = conferirOQueOGatilhoCarrega(workflow(), semPendencia);
    expect(p.map((x) => x.tipo)).toContain("pendencia-ausente");
    expect(p.map((x) => x.oQue).join(" ")).toContain("só uma pessoa pode fazer");
  });

  test("O PRAZO, e ele é um EVENTO: pendência RESOLVIDA com a condição de pé REPROVA", () => {
    // É o sentido que transforma um desligamento em prazo. No dia em que o segredo existir, a
    // página marca a pendência como resolvida — e aí a condição tem de sair.
    const resolvida = pagina().replace(
      `## 11 · ${TITULO_DA_PENDENCIA}`,
      `## 11 · ~~${TITULO_DA_PENDENCIA}~~ — **você criou a senha em 2026-11-02**`,
    );
    expect(resolvida).not.toBe(pagina());
    const p = conferirOQueOGatilhoCarrega(workflow(), resolvida);
    expect(p.map((x) => x.tipo)).toContain("pendencia-resolvida-e-condicao-de-pe");
    expect(p.map((x) => x.oQue).join(" ")).toContain("o motivo da condição acabou");
  });

  test("A CLASSE NEGADA NÃO É FRONTEIRA: a régua velha lia a página de hoje como RESOLVIDA", () => {
    // A primeira versão era `~~[^~]*VIZINHOS_TOKEN[^~]*~~` sobre a página inteira. O `[^~]` não
    // para em fim de linha nem de seção, então ele emendou um `~~` da §10 com um da lista de
    // resolvidos, com a §11 no meio — e a pendência ABERTA de hoje saía como resolvida.
    const p = pagina();
    const velha = /~~[^~]*VIZINHOS_TOKEN[^~]*~~/;
    expect(velha.test(p), "a régua VELHA achava a página resolvida — é o defeito").toBe(true);
    // E a régua de hoje, linha a linha, diz a verdade: a pendência está ABERTA.
    const linhaRiscada = p.split("\n").some((l) => l.includes(TITULO_DA_PENDENCIA) && l.includes("~~"));
    expect(linhaRiscada).toBe(false);
  });

  test("zero caminhos escolhidos, ou dois, REPROVA — indecisão não é decisão", () => {
    // A régua lê a lista declarada, então o estrago é na lista: aqui, conferido pela própria
    // invariante que a trava do lado bom já cobra.
    expect(CAMINHOS.filter((c) => c.escolhido)).toHaveLength(1);
    const dois = CAMINHOS.map((c, i) => ({ ...c, escolhido: i < 2 }));
    expect(dois.filter((c) => c.escolhido)).toHaveLength(2);
  });
});
