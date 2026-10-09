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
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const VERDE_YML = join(RAIZ, ".github", "workflows", "verde.yml");
const RECEITA = join(RAIZ, "docs", "COMO_RELIGAR_O_CI.md");

/**
 * **A data em que o motivo de estar desligado acaba.** A cota gratuita de Actions zera em
 * 1º/11/2026; daí em diante, gatilho comentado é esquecimento, não economia.
 */
export const DATA_DE_RELIGAR = new Date("2026-11-01T00:00:00Z");

const yml = readFileSync(VERDE_YML, "utf8");

/** O gatilho automático está ligado quando `push:` ou `pull_request:` abrem linha sem `#`. */
function gatilhoAutomaticoLigado(texto: string): boolean {
  return texto.split("\n").some((l) => /^\s*(push|pull_request):\s*$/.test(l));
}

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
