/**
 * **LAB-121 (item 900) · a página dos ramos abertos, e a régua que a cruza com a origem** (D349).
 *
 * ```sh
 * bun test tests/ramos-abertos.test.ts
 * ```
 *
 * Esta é a metade que roda **sem rede e sem história**, no portão sem clones: a régua pura, dos
 * dois lados, e a página lida. A metade que pergunta à origem é
 * `tests/ramos-abertos-na-origem.test.ts`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CABECALHO,
  conferirOsRamos,
  lerAPagina,
  lerOsRamosDaOrigem,
  type RamoNaOrigem,
} from "../src/ramos-abertos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, "docs", "RAMOS_ABERTOS.md"), "utf8");

const tabela = (...linhas: string[]): string => ["# x", "", CABECALHO, "|---|---|", ...linhas, "", "fim"].join("\n");

describe("LAB-121 · a leitura da página — `null` sem tabela, nunca lista vazia", () => {
  test("a página de verdade tem a tabela (o protocolo a manda existir)", () => {
    expect(lerAPagina(PAGINA)).not.toBeNull();
  });

  test("tabela vazia é lista vazia — é o ZERO medido", () => {
    expect(lerAPagina(tabela())).toEqual([]);
  });

  test("sem o cabeçalho é `null` — a página que perdeu a tabela não diz 'nenhum ramo' (D23)", () => {
    expect(lerAPagina("# Os ramos abertos\n\nnenhum.\n")).toBeNull();
    expect(lerAPagina("")).toBeNull();
  });

  test("lê o ramo sem as crases e a pergunta inteira; a tabela acaba na primeira linha sem `|`", () => {
    const t = tabela("| `espera-definicao-de-quadra` | O que é uma quadra? |", "| outro | e esta? |");
    expect(lerAPagina(t)).toEqual([
      { ramo: "espera-definicao-de-quadra", pergunta: "O que é uma quadra?" },
      { ramo: "outro", pergunta: "e esta?" },
    ]);
  });
});

describe("LAB-121 · a régua — os dois lados demonstrados", () => {
  const mesclado: RamoNaOrigem = { nome: "claude/stoic-ritchie-ijzqy3", mesclado: true };
  const principal: RamoNaOrigem = { nome: "main", mesclado: true };

  test("O LADO BOM, o de hoje: a main e um ramo já mesclado, e a tabela vazia", () => {
    expect(conferirOsRamos([principal, mesclado], [])).toEqual([]);
  });

  test("O LADO BOM com ramo aberto: ele tem linha e pergunta", () => {
    const aberto = { nome: "espera-x", mesclado: false };
    expect(conferirOsRamos([principal, aberto], [{ ramo: "espera-x", pergunta: "x?" }])).toEqual([]);
  });

  test("O LADO RUIM: ramo aberto sem linha — o defeito que a regra quer impedir", () => {
    expect(conferirOsRamos([principal, { nome: "ajuste-invariante", mesclado: false }], [])).toEqual([
      { tipo: "ramo-aberto-sem-linha", ramo: "ajuste-invariante" },
    ]);
  });

  test("'não sei se mesclou' REPROVA — não sei não é não há", () => {
    expect(conferirOsRamos([{ nome: "r", mesclado: null }], [])).toEqual([{ tipo: "nao-sei-se-mesclou", ramo: "r" }]);
  });

  test("linha de ramo que não existe na origem, e de ramo que já entrou", () => {
    expect(
      conferirOsRamos([principal, mesclado], [
        { ramo: "sumiu", pergunta: "?" },
        { ramo: mesclado.nome, pergunta: "?" },
      ]),
    ).toEqual([
      { tipo: "linha-sem-ramo-na-origem", ramo: "sumiu" },
      { tipo: "linha-de-ramo-ja-mesclado", ramo: mesclado.nome },
    ]);
  });

  test("linha sem pergunta, linha repetida, e a main na página", () => {
    const aberto = { nome: "a", mesclado: false };
    expect(
      conferirOsRamos([principal, aberto], [
        { ramo: "a", pergunta: "" },
        { ramo: "a", pergunta: "x?" },
        { ramo: "main", pergunta: "x?" },
      ]),
    ).toEqual([
      { tipo: "linha-sem-pergunta", ramo: "a" },
      { tipo: "linha-repetida", ramo: "a" },
      { tipo: "o-principal-na-pagina", ramo: "main" },
    ]);
  });
});

describe("LAB-121 · a leitura do `git ls-remote --heads`", () => {
  test("lê sha e nome, inclusive com barra no nome; ignora o resto", () => {
    const a = "a".repeat(40);
    const b = "b".repeat(40);
    expect(lerOsRamosDaOrigem(`${a}\trefs/heads/main\n${b}\trefs/heads/claude/x-y\nlixo\n${a}\trefs/tags/v1\n`)).toEqual([
      { sha: a, nome: "main" },
      { sha: b, nome: "claude/x-y" },
    ]);
  });

  test("saída vazia é lista vazia — quem a julga é a trava viva, que exige a main", () => {
    expect(lerOsRamosDaOrigem("")).toEqual([]);
  });
});
