/**
 * A guarda da AFIRMAÇÃO do nome do trabalho de CI. (item 017, LAB-84)
 *
 * ```sh
 * bun test tests/nome-do-trabalho.test.ts
 * ```
 *
 * O item 017 pediu a trava que faltava: *"nenhuma régua confere hoje que o nome do trabalho
 * corresponda ao que ele precisa… e ela é a única coisa que impede isto de voltar, já que o CI
 * está desligado e não vai desmentir ninguém."*
 *
 * **Os dois lados, e nesta ordem:** primeiro que a afirmação de hoje é VERDADEIRA, depois que a
 * régua reprova cada jeito de ela ficar falsa. *Régua que só mostra o lado bom não prova que
 * mede; régua que só mostra o lado ruim não prova que deixa passar o certo.*
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DEPENDEM_DE_CLONE,
  type MedidaPorExecucao,
  TRABALHO_SEM_CLONES,
  arquivosDoTrabalho,
  conferirONome,
} from "../src/nome-do-trabalho.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const WORKFLOW = join(RAIZ, ".github", "workflows", "verde.yml");

const PROVA = join(RAIZ, "docs", "provas", "LAB-84", "as-trinta-por-execucao.json");

const workflow = () => readFileSync(WORKFLOW, "utf8");
const existe = (c: string) => existsSync(join(RAIZ, c));

/** As linhas da medição por EXECUÇÃO — a prova do `lab84`, e não uma releitura do fonte. */
const medicao = (): MedidaPorExecucao[] =>
  (JSON.parse(readFileSync(PROVA, "utf8")) as { asTrintaEUma: MedidaPorExecucao[] }).asTrintaEUma;

describe("item 017 · o nome do trabalho de CI é uma AFIRMAÇÃO, e ela é conferida", () => {
  test("O LADO BOM: a afirmação de hoje é verdadeira — zero problemas", () => {
    expect(conferirONome(workflow(), existe, medicao()).map((p) => `${p.tipo}: ${p.oQue}`)).toEqual([]);
  });

  test("a lista do trabalho é achada, e tem os 31 arquivos que a medição rodou", () => {
    const lista = arquivosDoTrabalho(workflow(), TRABALHO_SEM_CLONES);
    // 30 quando a medição do LAB-84 começou, 31 com esta própria trava dentro — medidos um a
    // um POR EXECUÇÃO, numa cópia sem os clones irmãos. O número anda quando o trabalho ganha
    // ou perde arquivo, e mudá-lo é deliberado: é a lista que a medição cobriu.
    expect(lista).toHaveLength(31);
    // Sem duplicata: arquivo repetido roda duas vezes e paga a bateria duas vezes.
    expect(new Set(lista).size).toBe(lista.length);
  });

  test("o arquivo que PRECISA do clone existe, e NÃO está no trabalho", () => {
    const lista = arquivosDoTrabalho(workflow(), TRABALHO_SEM_CLONES);
    expect(Object.keys(DEPENDEM_DE_CLONE)).toEqual([
      "tests/commit-dos-vizinhos-com-clone.test.ts",
    ]);
    for (const arquivo of Object.keys(DEPENDEM_DE_CLONE)) {
      expect(existe(`external-engines/esteira/${arquivo}`)).toBe(true);
      expect(lista).not.toContain(arquivo);
    }
  });

  test("e o irmão dele, SEM as quatro travas, continua NO trabalho", () => {
    // Esta é a metade que a medição comprou: tirar o arquivo inteiro custaria as 10 travas
    // limpas de clone. Se alguém "simplificar" movendo o arquivo todo, esta trava reprova.
    const lista = arquivosDoTrabalho(workflow(), TRABALHO_SEM_CLONES);
    expect(lista).toContain("tests/commit-dos-vizinhos.test.ts");
  });
});

describe("item 017 · O LADO RUIM: cada jeito de a afirmação ficar falsa REPROVA", () => {
  test("pôr o arquivo que depende de clone na lista do trabalho REPROVA", () => {
    const estragado = workflow().replace(
      "            tests/commit-dos-vizinhos.test.ts \\",
      "            tests/commit-dos-vizinhos.test.ts \\\n" +
        "            tests/commit-dos-vizinhos-com-clone.test.ts \\",
    );
    expect(estragado).not.toBe(workflow());
    const p = conferirONome(estragado, existe, medicao());
    expect(p.map((x) => x.tipo)).toContain("arquivo-que-depende-no-trabalho");
    // E a mensagem traz o MOTIVO medido, não só o nome: quem conserta precisa saber quais travas.
    expect(p.map((x) => x.oQue).join(" ")).toContain("4 travas");
  });

  test("RENOMEAR o trabalho REPROVA — a afirmação mudou, e a régua tem de mudar com ela", () => {
    const estragado = workflow().replace(TRABALHO_SEM_CLONES, "guardas rápidas");
    const p = conferirONome(estragado, existe, medicao());
    expect(p.map((x) => x.tipo)).toEqual(["trabalho-nao-encontrado"]);
  });

  test("lista que a régua não acha é PROBLEMA, não aprovação", () => {
    const soONome = `jobs:\n  x:\n    name: ${TRABALHO_SEM_CLONES}\n    steps: []\n`;
    const p = conferirONome(soONome, existe, medicao());
    expect(p.map((x) => x.tipo)).toEqual(["lista-vazia"]);
  });

  test("arquivo listado que não existe REPROVA — o trabalho inteiro falharia nele", () => {
    const estragado = workflow().replace(
      "tests/pagina.test.ts \\",
      "tests/arquivo-que-nunca-existiu.test.ts \\",
    );
    expect(estragado).not.toBe(workflow());
    const p = conferirONome(estragado, existe, medicao());
    expect(p.map((x) => x.tipo)).toContain("arquivo-da-lista-nao-existe");
  });

  test("arquivo no trabalho SEM linha na medição REPROVA — afirmação sem prova", () => {
    // A régua não relê o fonte: ela cobra a MEDIÇÃO por execução. Arquivo novo no portão sem
    // ninguém ter rodado o `lab84` é exatamente o caso em que o CI desligado não desmente nada.
    const semEsse = medicao().filter((m) => m.arquivo !== "tests/pagina.test.ts");
    const p = conferirONome(workflow(), existe, semEsse);
    expect(p.map((x) => x.tipo)).toContain("sem-medicao");
    expect(p.map((x) => x.oQue).join(" ")).toContain("bun run lab84");
  });

  test("arquivo no trabalho que a medição viu REPROVANDO sem clone REPROVA", () => {
    // É o caso que o LAB-84 achou de verdade, e o único que decide a afirmação do nome.
    const comUmVermelho = medicao().map((m) =>
      m.arquivo === "tests/pagina.test.ts"
        ? { ...m, saida: 1, asQueReprovam: ["uma trava qualquer que precisa do clone"] }
        : m,
    );
    const p = conferirONome(workflow(), existe, comUmVermelho);
    expect(p.map((x) => x.tipo)).toContain("medido-reprovando-sem-clone");
    // A mensagem traz QUAL trava reprovou: número sozinho manda recontar à mão (D272).
    expect(p.map((x) => x.oQue).join(" ")).toContain("precisa do clone");
  });

  test("declarado que deixou de existir REPROVA — lista que não se revalida envelhece", () => {
    const p = conferirONome(workflow(), (c) => !c.includes("com-clone") && existe(c), medicao());
    expect(p.map((x) => x.tipo)).toContain("declarado-que-nao-existe");
  });
});
