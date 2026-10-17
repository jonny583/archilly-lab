/**
 * **LAB-146 (item 900) · motor da própria família não ganha `upstream/` — e não se copia com outro nome** (D374).
 *
 * ```sh
 * bun test tests/o-motor-da-familia-nao-se-copia.test.ts
 * ```
 *
 * O `CLAUDE.md` §3 manda ler o motor da família do clone irmão, nunca copiá-lo (D16). A metade do *"ler pelos
 * `paths`"* tem trava desde o LAB-135; esta é a do *"não copiar"*, pelo conteúdo. O motivo inteiro, com a medição, está
 * no cabeçalho de `src/o-motor-da-familia-nao-se-copia.ts`.
 *
 * Roda **sem clones** (lê só este repositório e dados plantados) e por isso está no portão sem clones do `verde.yml`. A
 * comparação com os vizinhos de verdade mora em `o-motor-da-familia-nao-se-copia-com-clone.test.ts`, no verde completo.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Arquivo } from "../src/adapter-unica-fronteira.ts";
import {
  ARGUMENTOS_DO_LS_FILES,
  A_REGRA,
  BLOCO_COPIADO,
  CLONES_DA_FAMILIA,
  EXTENSOES_DE_CODIGO,
  O_QUE_ISTO_NAO_ALCANCA,
  REDECLARACOES,
  conferirQueOMotorNaoSeCopia,
  lerOLsFiles,
  linhasDeCodigo,
  type Entrada,
  type Redeclaracao,
} from "../src/o-motor-da-familia-nao-se-copia.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

function aCasaDeHoje(): Arquivo[] {
  const saida = execFileSync("git", [...ARGUMENTOS_DO_LS_FILES], { cwd: RAIZ, encoding: "utf8", maxBuffer: 1 << 28 });
  return lerOLsFiles(saida)
    .filter((c) => EXTENSOES_DE_CODIGO.test(c))
    .map((caminho) => ({ caminho, texto: readFileSync(join(RAIZ, caminho), "utf8") }));
}

/** `n` linhas de código plantadas, longas e distintas — nenhuma é linha real de motor nenhum. */
const plantadas = (prefixo: string, n: number) =>
  Array.from({ length: n }, (_, i) => `const ${prefixo}_${i} = calcularAlgoPlantado(${i}, "${prefixo}");`);
const arquivo = (caminho: string, linhas: string[]): Arquivo => ({ caminho, texto: linhas.join("\n") + "\n" });
const vizinho = (arquivos: Arquivo[]) => ({ pasta: "motor-testfit", arquivos });

const MOTOR = arquivo("src/lib/lab/quadra.ts", plantadas("motor", 40));
const tipos = (e: Entrada) => conferirQueOMotorNaoSeCopia(e).problemas.map((p) => p.tipo);

describe("LAB-146 · a regra está escrita, e a casa de hoje", () => {
  test("o `CLAUDE.md` §3 escreve a regra", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
  });

  test("os clones da família vêm do `adapter-unica-fronteira.ts`, e são os dois lidos por caminho", () => {
    expect(CLONES_DA_FAMILIA.map((c) => c.pasta)).toEqual(["motor-testfit", "urban-create-hub-41d93a4d"]);
  });

  test("a casa de hoje: nenhum `upstream/` de motor da família, e toda redeclaração existe e se diz", () => {
    const casa = aCasaDeHoje();
    const r = conferirQueOMotorNaoSeCopia({ casa, vizinhos: [] });
    console.log(`    ${r.universo.arquivosDaCasa} arquivo(s) de código desta casa lido(s)`);
    expect(r.universo.arquivosDaCasa).toBeGreaterThan(300);
    expect(r.problemas).toEqual([]);
  });

  test("toda redeclaração diz de quem, por quê e o trecho — e o `de` nomeia um clone da família", () => {
    const pastas = CLONES_DA_FAMILIA.map((c) => c.pasta);
    for (const r of REDECLARACOES) {
      expect(r.motivo.length).toBeGreaterThan(40);
      expect(r.trecho.length).toBeGreaterThan(20);
      for (const d of r.de) expect(pastas, d).toContain(d.split("/")[0]);
    }
  });

  test("o que ela não alcança é publicado", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
    expect(conferirQueOMotorNaoSeCopia({ casa: [], vizinhos: [] }).naoAlcanca).toBe(O_QUE_ISTO_NAO_ALCANCA);
  });
});

describe("LAB-146 · o que conta como linha", () => {
  test("comentário, import, chave de fecho e linha curta NÃO contam; o espaço das pontas não muda nada", () => {
    const l = linhasDeCodigo(
      [
        "// const comentarioQueNaoConta = calcularAlgoPlantado(1, 'x');",
        " * const docQueNaoConta = calcularAlgoPlantado(2, 'x');",
        'import { calcularAlgoPlantado } from "./um/lugar/bem/comprido.ts";',
        "}); // fecho comprido, mas fecho de qualquer jeito, em toda parte",
        "return x;",
        "    const contaEsta = calcularAlgoPlantado(3, 'x');",
      ].join("\n"),
    );
    expect([...l]).toEqual(["const contaEsta = calcularAlgoPlantado(3, 'x');"]);
  });
});

describe("LAB-146 · os dois lados", () => {
  test("O LADO BOM: arquivo que divide umas linhas com o motor passa (o caso que quase parece cópia)", () => {
    // 6 de 40 (15 %), como o mais parecido de verdade sem declaração.
    const casa = [arquivo("external-engines/esteira/src/meu.ts", [...plantadas("motor", 6), ...plantadas("meu", 34)])];
    const r = conferirQueOMotorNaoSeCopia({ casa, vizinhos: [vizinho([MOTOR])], redeclaracoes: [] });
    expect(r.problemas).toEqual([]);
    expect(r.maisParecidoSemDeclaracao).toMatchObject({ comum: 6, linhas: 40 });
  });

  test("1 · a cópia byte a byte → `copia-inteira`", () => {
    const casa = [{ ...MOTOR, caminho: "external-engines/testfit/adapter/src/quadra-copia.ts" }];
    expect(tipos({ casa, vizinhos: [vizinho([MOTOR])], redeclaracoes: [] })).toEqual(["copia-inteira"]);
  });

  test("2 · a cópia com outro cabeçalho e outros imports → `copia-de-motor`", () => {
    const casa = [
      arquivo("external-engines/testfit/adapter/src/quadra-copia.ts", [
        "/** Copiado do motor. */",
        'import { x } from "@testfit/geo.ts";',
        ...plantadas("motor", 40),
      ]),
    ];
    expect(tipos({ casa, vizinhos: [vizinho([MOTOR])], redeclaracoes: [] })).toEqual(["copia-de-motor"]);
  });

  test("3 · a fração, dos dois lados: 20 de 40 acusa, 19 de 40 passa", () => {
    const com = (n: number) => [
      arquivo("external-engines/esteira/src/meio.ts", [...plantadas("motor", n), ...plantadas("meu", 40 - n)]),
    ];
    expect(tipos({ casa: com(20), vizinhos: [vizinho([MOTOR])], redeclaracoes: [] })).toEqual(["copia-de-motor"]);
    expect(tipos({ casa: com(19), vizinhos: [vizinho([MOTOR])], redeclaracoes: [] })).toEqual([]);
  });

  test("4 · o bloco, dos dois lados: a função copiada para dentro de um arquivo grande", () => {
    const motor = arquivo("src/lib/lab/motor.ts", plantadas("motor", 60));
    const com = (n: number) => [
      arquivo("external-engines/esteira/src/grande.ts", [...plantadas("motor", n), ...plantadas("meu", 300)]),
    ];
    expect(tipos({ casa: com(BLOCO_COPIADO), vizinhos: [vizinho([motor])], redeclaracoes: [] })).toEqual([
      "copia-de-motor",
    ]);
    expect(tipos({ casa: com(BLOCO_COPIADO - 1), vizinhos: [vizinho([motor])], redeclaracoes: [] })).toEqual([]);
  });

  test("5 · arquivo pequeno não se julga por fração: 9 linhas, todas iguais, passam", () => {
    const casa = [arquivo("external-engines/esteira/src/pequeno.ts", plantadas("motor", 9))];
    expect(tipos({ casa, vizinhos: [vizinho([MOTOR])], redeclaracoes: [] })).toEqual([]);
  });

  const DECLARADA: Redeclaracao = {
    arquivo: "external-engines/testfit/adapter/src/contrato.ts",
    de: ["motor-testfit/src/lib/lab/quadra.ts"],
    motivo: "redeclaração plantada para o teste, com motivo comprido o bastante",
    trecho: "isto é redeclaração, de propósito",
  };
  const declaradaNaCasa = (extra: string[] = ["// isto é redeclaração, de propósito"]) =>
    arquivo(DECLARADA.arquivo, [...extra, ...plantadas("motor", 30)]);

  test("6 · a redeclaração declarada, com o trecho no arquivo, passa", () => {
    expect(tipos({ casa: [declaradaNaCasa()], vizinhos: [vizinho([MOTOR])], redeclaracoes: [DECLARADA] })).toEqual([]);
  });

  test("7 · a mesma, parecida com OUTRO arquivo que o declarado → `copia-de-motor` (a exceção é por par)", () => {
    const outro = { ...MOTOR, caminho: "src/lib/lab/outro.ts" };
    expect(tipos({ casa: [declaradaNaCasa()], vizinhos: [vizinho([outro])], redeclaracoes: [DECLARADA] })).toEqual([
      "copia-de-motor",
      "redeclaracao-que-nao-copia-mais",
    ]);
  });

  test("8 · o arquivo que parou de dizer que é redeclaração → `redeclaracao-calada`", () => {
    expect(
      tipos({ casa: [declaradaNaCasa([])], vizinhos: [vizinho([MOTOR])], redeclaracoes: [DECLARADA] }),
    ).toEqual(["redeclaracao-calada"]);
  });

  test("9 · declarada e o arquivo sumiu → `redeclaracao-sem-arquivo`", () => {
    expect(tipos({ casa: [], vizinhos: [vizinho([MOTOR])], redeclaracoes: [DECLARADA] })).toEqual([
      "redeclaracao-sem-arquivo",
    ]);
  });

  test("10 · declarada e já não se parece com nada → `redeclaracao-que-nao-copia-mais`", () => {
    const casa = [arquivo(DECLARADA.arquivo, ["// isto é redeclaração, de propósito", ...plantadas("meu", 30)])];
    expect(tipos({ casa, vizinhos: [vizinho([MOTOR])], redeclaracoes: [DECLARADA] })).toEqual([
      "redeclaracao-que-nao-copia-mais",
    ]);
  });

  test("11 · `upstream/` debaixo da pasta do motor da família → acusado, mesmo sem vizinho", () => {
    const casa = [arquivo("external-engines/testfit/upstream/src/lib/lab/quadra.ts", plantadas("x", 3))];
    expect(tipos({ casa, vizinhos: [], redeclaracoes: [] })).toEqual(["upstream-de-motor-da-familia"]);
    // …e o do Symbios, que é de terceiro, não: a regra é da FAMÍLIA.
    const symbios = [arquivo("external-engines/symbios/upstream/src/lib.rs", plantadas("x", 3))];
    expect(tipos({ casa: symbios, vizinhos: [], redeclaracoes: [] })).toEqual([]);
  });

  test("12 · vizinho sem nada lido → `vizinho-vazio` (zero de régua cega não é árvore limpa)", () => {
    expect(tipos({ casa: [], vizinhos: [vizinho([])], redeclaracoes: [] })).toEqual(["vizinho-vazio"]);
    const soTexto = [{ caminho: "README.md", texto: plantadas("motor", 40).join("\n") }];
    expect(tipos({ casa: [], vizinhos: [vizinho(soTexto)], redeclaracoes: [] })).toEqual(["vizinho-vazio"]);
  });

  test("13 · o que não é código não é lido: o mesmo texto num `.md` desta casa passa", () => {
    const casa = [{ caminho: "docs/copia.md", texto: MOTOR.texto }];
    expect(tipos({ casa, vizinhos: [vizinho([MOTOR])], redeclaracoes: [] })).toEqual([]);
  });

  test("a leitura do `git ls-files -z`: separa por `\\0` e não inventa caminho vazio", () => {
    expect(lerOLsFiles("a.ts\0b/c.ts\0")).toEqual(["a.ts", "b/c.ts"]);
    expect(lerOLsFiles("")).toEqual([]);
  });
});
