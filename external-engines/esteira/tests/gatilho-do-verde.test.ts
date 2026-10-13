/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A TRAVA DO GATILHO — régua desligada publica verde. (08/10/2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **O achado é do Render, e ele vale aqui inteiro:** a régua que caça desligadores de
 * conferência (`varredura-de-configuracao.ts`, 7 regras) procura **regra em `"off"`** e **passo
 * que ignora erro**, e **não tem forma para "o gatilho virou comentário"** — que é o
 * desligamento **mais completo que existe**. Ela ficaria **VERDE** com o CI inteiro parado.
 *
 * > **Régua desligada publica verde**, e em 1º de novembro alguém vai esquecer de religar.
 *
 * # O que esta trava cobra, e ela cobra os DOIS lados
 *
 * - **gatilho comentado** → `docs/COMO_RELIGAR_O_CI.md` existe e traz os **dois** passos
 *   (descomentar **E** reabilitar), e a rotina aparece como desligada no `ONDE_PARAMOS`;
 * - **gatilho ativo** → o aviso de desligado **sai** dos dois lugares, senão o documento
 *   mente na direção contrária;
 * - **e o PRAZO**: a partir de `DATA_DE_RELIGAR` a trava **REPROVA** enquanto o gatilho
 *   estiver comentado. A cota zera em 1º/11; o motivo de estar desligado acaba nessa data, e
 *   *desligamento sem prazo vira desligamento permanente*.
 *
 * Ela lê só arquivo deste repositório: vai no trabalho de CI que roda sem segredo — quando o
 * CI voltar.
 *
 * # E o lado que faltava: DESLIGADO, a frase que diz que ele RODA sai (LAB-102, D329)
 *
 * A trava cobrava *ligado → o aviso de desligado sai*, e não o espelho. Com o gatilho comentado
 * desde 08/10, seis frases vivas ainda diziam que o CI *roda hoje* / *roda em todo push* — no
 * `conferir.sh`, no próprio `verde.yml`, no `INDEX.md`, num comentário de teste e numa mensagem
 * de problema. A régua mora em `src/o-ci-que-roda.ts`, junto com a pergunta ao gatilho, que
 * saiu daqui para haver UMA implementação dela (D231).
 */

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  afirmacoesDeQueRoda,
  conferirAsAfirmacoes,
  EXCECOES,
  EXTENSOES_LIDAS,
  gatilhoAutomaticoLigado,
} from "../src/o-ci-que-roda.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const VERDE_YML = join(RAIZ, ".github", "workflows", "verde.yml");
const RECEITA = join(RAIZ, "docs", "COMO_RELIGAR_O_CI.md");

/**
 * **A data em que o motivo de estar desligado acaba.** A cota gratuita de Actions zera em
 * 1º/11/2026; daí em diante, gatilho comentado é esquecimento, não economia.
 */
export const DATA_DE_RELIGAR = new Date("2026-11-01T00:00:00Z");

const yml = readFileSync(VERDE_YML, "utf8");

describe("a trava do gatilho · régua desligada publica verde", () => {
  const ligado = gatilhoAutomaticoLigado(yml);

  test("a régua sabe distinguir gatilho comentado de gatilho ativo", () => {
    expect(gatilhoAutomaticoLigado("on:\n  push:\n    branches: ['**']\n")).toBe(true);
    expect(gatilhoAutomaticoLigado("on:\n#  push:\n#    branches: ['**']\n")).toBe(false);
    expect(gatilhoAutomaticoLigado("on:\n  pull_request:\n")).toBe(true);
    expect(gatilhoAutomaticoLigado("on:\n  workflow_dispatch:\n")).toBe(false);
  });

  test("rodar à mão continua possível: workflow_dispatch nunca sai", () => {
    expect(yml).toMatch(/^\s*workflow_dispatch:\s*$/m);
  });

  test("nada foi apagado: os dois trabalhos e os comentários continuam no arquivo", () => {
    expect(yml).toContain("guardas-sem-clones");
    expect(yml).toContain("verde-completo");
    expect(yml).toContain("VIZINHOS_TOKEN");
  });

  test("DESLIGADO exige a receita no LUGAR ÚNICO, com os DOIS passos", () => {
    if (ligado) return;
    expect(existsSync(RECEITA)).toBe(true);
    const receita = readFileSync(RECEITA, "utf8");
    expect(receita).toContain("RELIGAR SÃO DOIS PASSOS");
    expect(receita).toContain("/enable");
    expect(receita).toMatch(/descomentar/i);
    // E o arquivo do workflow aponta para o lugar único, para ninguém escrever a segunda cópia.
    expect(yml).toContain("docs/COMO_RELIGAR_O_CI.md");
  });

  test("DESLIGADO aparece no ONDE_PARAMOS — estado que não se lê não é estado", () => {
    if (ligado) return;
    const onde = readFileSync(join(RAIZ, "docs", "ONDE_PARAMOS.md"), "utf8");
    expect(onde).toContain("COMO_RELIGAR_O_CI.md");
  });

  test("LIGADO exige que o aviso de desligado SAIA — o documento não mente ao contrário", () => {
    if (!ligado) return;
    expect(existsSync(RECEITA)).toBe(false);
    expect(yml).not.toContain("EXECUÇÃO AUTOMÁTICA DESLIGADA");
  });

  test("O PRAZO: a partir de 1º/11/2026 o gatilho comentado REPROVA", () => {
    const hoje = new Date();
    expect(
      ligado || hoje < DATA_DE_RELIGAR,
      `o gatilho automático do verde.yml continua COMENTADO em ${hoje.toISOString().slice(0, 10)}, ` +
        `e a cota de Actions zerou em ${DATA_DE_RELIGAR.toISOString().slice(0, 10)}. ` +
        "Religar são DOIS passos — docs/COMO_RELIGAR_O_CI.md. " +
        "Desligamento sem prazo vira desligamento permanente.",
    ).toBe(true);
  });
});

/** A árvore versionada, nas extensões de texto que a régua lê. */
function arvoreVersionada() {
  return execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8" })
    .split("\n")
    .filter((f) => EXTENSOES_LIDAS.some((e) => f.endsWith(e)))
    .filter((f) => existsSync(join(RAIZ, f)))
    .map((arquivo) => ({ arquivo, texto: readFileSync(join(RAIZ, arquivo), "utf8") }));
}

describe("o espelho da trava · DESLIGADO, a frase que diz que o CI RODA sai (LAB-102, D329)", () => {
  test("a régua acha a frase de estado, atravessando quebra de linha, comentário e negrito", () => {
    const acha = (t: string) => afirmacoesDeQueRoda("x", t).map((a) => a.trecho.toLowerCase());
    expect(acha("o portão roda hoje, sem segredo")).toEqual(["roda hoje"]);
    expect(acha("# as travas rodam a cada push")).toEqual(["rodam a cada push"]);
    expect(acha(" * num portão que roda\n * em todo push.")).toEqual(["roda em todo push"]);
    expect(acha("# ── O que roda HOJE ──")).toEqual(["roda hoje"]);
    expect(acha("o trabalho roda **hoje**")).toEqual(["roda hoje"]);
  });

  test("o caso válido que quase parece inválido: intenção, nome e outro sujeito NÃO são estado", () => {
    const acha = (t: string) => afirmacoesDeQueRoda("x", t);
    expect(acha("foi feito para rodar em todo push")).toEqual([]);
    expect(acha("o trabalho de CI que roda sem segredo")).toEqual([]);
    expect(acha("todo push ao motor roda `lint`")).toEqual([]);
    expect(acha("a rodada de hoje")).toEqual([]);
  });

  test("a linha devolvida é a linha em que a frase COMEÇA", () => {
    const [a] = afirmacoesDeQueRoda("x", "um\ndois\n # o portão roda\n # em todo push");
    expect(a?.linha).toBe(3);
  });

  test("lado ruim: com o gatilho desligado, frase nova fora de relato reprova pelo arquivo e linha", () => {
    const r = conferirAsAfirmacoes(
      [
        { arquivo: "external-engines/conferir.sh", texto: "#\n# o verde roda em todo push\n" },
        { arquivo: "docs/relatorios/LAB-38.md", texto: "o CI roda em todo push" },
      ],
      false,
      [],
    );
    expect(r.desmentidas).toEqual([
      { arquivo: "external-engines/conferir.sh", linha: 2, trecho: "roda em todo push" },
    ]);
    expect(r.deRelato).toBe(1);
  });

  test("lado bom: a mesma frase em RELATO, ou declarada como exceção, passa", () => {
    const excecao = [{ arquivo: "a.md", trecho: "roda em todo envio", porque: "argumento" }];
    const r = conferirAsAfirmacoes(
      [
        { arquivo: "a.md", texto: "o trabalho que roda em todo envio não tem segredo" },
        { arquivo: "docs/DECISOES.md", texto: "o CI roda hoje" },
      ],
      false,
      excecao,
    );
    expect(r.desmentidas).toEqual([]);
    expect(r.excecoesMortas).toEqual([]);
  });

  test("o outro sentido: exceção cujo trecho sumiu é lista que envelheceu, e reprova", () => {
    const excecao = [{ arquivo: "a.md", trecho: "roda em todo envio", porque: "argumento" }];
    const r = conferirAsAfirmacoes([{ arquivo: "a.md", texto: "o trabalho não tem segredo" }], false, excecao);
    expect(r.excecoesMortas).toEqual(['a.md · "roda em todo envio"']);
  });

  test("ligado, a régua não cobra nada — a frase pode ser verdade, e o aviso é da outra trava", () => {
    const r = conferirAsAfirmacoes([{ arquivo: "a.md", texto: "o CI roda hoje" }], true, []);
    expect(r.desmentidas).toEqual([]);
  });

  test("a árvore de hoje, contra o gatilho de hoje — e o universo lido, publicado", () => {
    const arvore = arvoreVersionada();
    const r = conferirAsAfirmacoes(arvore, gatilhoAutomaticoLigado(yml));
    const resumo =
      `lidos ${r.lidos} arquivos vivos (${r.deRelato} de relato fora); ` +
      `${r.desmentidas.length} frases de estado, ${EXCECOES.length} exceções declaradas`;
    expect(r.lidos, resumo).toBeGreaterThan(100);
    expect(r.deRelato, resumo).toBeGreaterThan(0);
    expect(
      r.desmentidas.map((d) => `${d.arquivo}:${d.linha} "${d.trecho}"`),
      `com o gatilho desligado estas frases dizem que o CI roda — ${resumo}`,
    ).toEqual([]);
    expect(r.excecoesMortas, `exceções que a régua não acha mais — ${resumo}`).toEqual([]);
  });
});
