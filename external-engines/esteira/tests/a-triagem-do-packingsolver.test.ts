/**
 * **LAB-171 (item 900) · a triagem do PackingSolver — a ficha perguntada à origem, aos lugares e à árvore** (D399).
 *
 * ```sh
 * bun test tests/a-triagem-do-packingsolver.test.ts
 * ```
 *
 * A `docs/PACKINGSOLVER_TRIAGEM.md` (LAB-00) era a última página de `docs/` sem leitor no código. Ela fixa a ficha de um
 * repositório de fora que cinco lugares desta casa repetem, e afirma que nada dele foi copiado. O motivo inteiro está
 * no cabeçalho de `src/a-triagem-do-packingsolver.ts`.
 *
 * Roda **sem clones e sem rede**: a página, os cinco lugares, o registro, o `git ls-files` desta casa e a prova que a
 * ferramenta `bun run lab171` (a única parte com rede) gravou. Por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PAGINA,
  A_PROVA,
  COMMIT_DA_TRIAGEM,
  conferirAArvore,
  conferirATriagem,
  conferirContraAOrigem,
  conferirOsLugares,
  lerAFicha,
  oQueCadaLugarDiz,
  type ProvaNaOrigem,
  type TipoDeProblema,
} from "../src/a-triagem-do-packingsolver.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (c: string): string | null => {
  try {
    return readFileSync(join(RAIZ, c), "utf8");
  } catch {
    return null;
  }
};
const PAGINA = ler(A_PAGINA)!;
const PROVA = JSON.parse(ler(A_PROVA)!) as ProvaNaOrigem;
const FICHA = lerAFicha(PAGINA);
const tiposContra = (
  texto: string,
  prova: ProvaNaOrigem = PROVA,
): TipoDeProblema[] =>
  conferirContraAOrigem(lerAFicha(texto), prova).map((p) => p.tipo);

describe("LAB-171 · a triagem de verdade", () => {
  const r = conferirATriagem(RAIZ);

  test("o universo é publicado, e não é zero", () => {
    const lugares = oQueCadaLugarDiz(r.ficha);
    console.log(
      `    ficha: ${r.ficha.tipos.length} tipos · ${Object.keys(r.ficha.cmake).length} opções do cmake · ` +
        `${r.ficha.opcoesNomeadas.length} da linha de comando · ${lugares.length} lugares, ` +
        `${lugares.reduce((s, l) => s + l.diz.length, 0)} frases · ${r.naoCopiados.length} motores nao-copiado · ` +
        `${r.versionados} arquivos versionados · ${r.problemas.length} problemas`,
    );
    // Contados no LAB-171, em 18/10/2026: 6 tipos, 3 opções do cmake, 6 da linha de comando, 5 lugares, 2 nao-copiado.
    expect(r.ficha.tipos.length).toBe(6);
    expect(r.naoCopiados).toContain("packingsolver");
    expect(r.naoCopiados.length).toBeGreaterThanOrEqual(2);
    expect(r.versionados).toBeGreaterThan(500);
  });

  test("a página, os cinco lugares e a árvore: nenhum problema", () => {
    expect(r.problemas).toEqual([]);
  });

  test("a prova é do commit que a página fixa, e foi medida — não digitada", () => {
    expect(r.ficha.commit).toBe(COMMIT_DA_TRIAGEM);
    expect(PROVA.commit.pedido).toBe(COMMIT_DA_TRIAGEM);
    expect(PROVA.commit.existe).toBe(true);
    expect(PROVA.prompt).toBe("LAB-171");
    expect(Date.parse(PROVA.quando)).not.toBeNaN();
    // O HEAD de hoje mora ao lado, e não é o da ficha: a §6 é relato datado.
    expect(PROVA.headDeHoje.sha).toMatch(/^[0-9a-f]{40}$/);
  });

  test("o registro de motores e o git concordam: nao-copiado não tem upstream/ versionado", () => {
    const upstream = execFileSync(
      "git",
      [
        "ls-files",
        "external-engines/packingsolver/",
        "external-engines/straight-skeleton/upstream/",
      ],
      {
        cwd: RAIZ,
        encoding: "utf8",
      },
    )
      .split("\n")
      .filter(Boolean);
    expect(upstream).toEqual([
      "external-engines/packingsolver/README.md",
      "external-engines/packingsolver/adapter/README.md",
    ]);
  });
});

describe("LAB-171 · a régua contra a origem, nos dois lados", () => {
  test("cada campo da ficha que muda de valor é acusado", () => {
    const mutacoes: [string, string][] = [
      [
        "a7e533033d9c6ee3ff286513720afe6660b5989f",
        "a7e533033d9c6ee3ff286513720afe6660b5989e",
      ],
      ["2026-09-08 02:45:18 +0200", "2026-09-07 02:45:18 +0200"],
      ["Licença:       MIT,", "Licença:       BSD,"],
      [
        "Copyright (c) 2020 Florian Fontan",
        "Copyright (c) 2021 Florian Fontan",
      ],
      ["`PACKINGSOLVER_USE_HIGHS=ON`", "`PACKINGSOLVER_USE_HIGHS=OFF`"],
      [
        "https://github.com/fontanf/packingsolver\n",
        "https://github.com/outro/packingsolver\n",
      ],
    ];
    for (const [de, para] of mutacoes) {
      expect(PAGINA.includes(de), de).toBe(true);
      expect(tiposContra(PAGINA.replace(de, para)), para).toContain(
        "ficha-contra-a-origem",
      );
    }
  });

  test("tipo de problema a mais, a menos, ou o número por extenso errado", () => {
    expect(
      tiposContra(PAGINA.replace(/`boxstacks`,\s/, "`boxstacks`, `polygon`, ")),
    ).toContain("ficha-contra-a-origem");
    expect(tiposContra(PAGINA.replace(/`boxstacks`,\s/, ""))).toContain(
      "ficha-contra-a-origem",
    );
    expect(tiposContra(PAGINA.replace("Seis tipos", "Cinco tipos"))).toContain(
      "ficha-contra-a-origem",
    );
  });

  test("o campo que some é acusado como sumido, nunca como acerto", () => {
    expect(tiposContra(PAGINA.replace(/^Data:.*$/m, ""))).toContain(
      "campo-que-sumiu",
    );
    expect(
      tiposContra(
        PAGINA.replace("**REFERÊNCIA APENAS.**", "REFERÊNCIA APENAS."),
      ),
    ).toContain("campo-que-sumiu");
    expect(
      tiposContra(PAGINA.replaceAll("certificate.csv", "saida.csv")),
    ).toContain("campo-que-sumiu");
    expect(
      tiposContra(
        PAGINA.replaceAll("`min2cut`", "min2cut").replaceAll(
          "/`min2cut`",
          "/min2cut",
        ),
      ),
    ).toContain("campo-que-sumiu");
    expect(
      tiposContra(
        PAGINA.replace("não foi copiado para `upstream/`", "foi copiado"),
      ),
    ).toContain("campo-que-sumiu");
  });

  test("a prova que muda também é acusada — a origem que perdeu o commit, a opção ou o certificado", () => {
    expect(
      tiposContra(PAGINA, {
        ...PROVA,
        commit: { ...PROVA.commit, existe: false },
      }),
    ).toContain("ficha-contra-a-origem");
    expect(
      tiposContra(PAGINA, {
        ...PROVA,
        cmake: { ...PROVA.cmake, PACKINGSOLVER_USE_KNITRO: "ON" },
      }),
    ).toContain("ficha-contra-a-origem");
    expect(
      tiposContra(PAGINA, {
        ...PROVA,
        opcoesDaCli: { ...PROVA.opcoesDaCli, "time-limit": false },
      }),
    ).toContain("ficha-contra-a-origem");
    expect(
      tiposContra(PAGINA, { ...PROVA, certificadoNaCli: false }),
    ).toContain("ficha-contra-a-origem");
    expect(tiposContra(PAGINA, { ...PROVA, licenca: null })).toContain(
      "ficha-contra-a-origem",
    );
  });

  test("o caso bom passa: a página de verdade contra a prova de verdade", () => {
    expect(tiposContra(PAGINA)).toEqual([]);
  });
});

describe("LAB-171 · os lugares e a árvore, nos dois lados", () => {
  const lugar = (arquivo: string, de: string, para: string) =>
    conferirOsLugares(FICHA, (c) =>
      c === arquivo ? ler(c)!.replace(de, para) : ler(c),
    ).map((p) => p.onde);

  test("cada lugar que deixa de repetir a ficha é acusado, pelo nome", () => {
    expect(
      lugar(
        "README.md",
        "| MIT | não (servidor) | REFERÊNCIA APENAS |",
        "| MIT | sim | REFERÊNCIA APENAS |",
      ),
    ).toEqual(["README.md"]);
    expect(
      lugar("README.md", "← nada clonado: triagem", "← clonado: triagem"),
    ).toEqual(["README.md"]);
    expect(
      lugar("docs/TRIAGEM.md", "commit `a7e5330`", "commit `a7e5331`"),
    ).toEqual(["docs/TRIAGEM.md"]);
    expect(
      lugar(
        "docs/TRIAGEM.md",
        "| PackingSolver | MIT | não (servidor) | não executado |",
        "| PackingSolver | MIT | não (servidor) | sim |",
      ),
    ).toEqual(["docs/TRIAGEM.md"]);
    expect(
      lugar(
        "external-engines/packingsolver/README.md",
        "(2026-09-08)",
        "(2026-09-09)",
      ),
    ).toEqual(["external-engines/packingsolver/README.md"]);
    expect(
      lugar(
        "external-engines/packingsolver/adapter/README.md",
        "Vazio de propósito",
        "Começado",
      ),
    ).toEqual(["external-engines/packingsolver/adapter/README.md"]);
    expect(
      lugar(
        "external-engines/esteira/dados/registro-de-motores.json",
        '"estado": "so-referencia",\n      "porque": "Triagem',
        '"estado": "ligado",\n      "porque": "Triagem',
      ),
    ).toEqual(["external-engines/esteira/dados/registro-de-motores.json"]);
    expect(
      conferirOsLugares(FICHA, (c) =>
        c === "docs/TRIAGEM.md" ? null : ler(c),
      ).map((p) => p.detalhe),
    ).toEqual([
      "o arquivo não existe (ou, no registro, o motor não está nele)",
    ]);
    // O registro se lê pelo motor: mudar o straight skeleton não acusa o PackingSolver, e tirar o PackingSolver acusa.
    const REG = "external-engines/esteira/dados/registro-de-motores.json";
    expect(
      lugar(
        REG,
        '"estado": "so-referencia",\n      "porque": "Impedimento',
        '"estado": "ligado",\n      "porque": "Impedimento',
      ),
    ).toEqual([]);
    expect(
      lugar(REG, '"id": "packingsolver"', '"id": "packing-solver"'),
    ).toEqual([REG]);
  });

  test("a frase que cada lugar tem de dizer vem da ficha, nunca digitada: a ficha que muda muda o pedido", () => {
    const outra = lerAFicha(
      PAGINA.replace("Licença:       MIT,", "Licença:       BSD,"),
    );
    expect(conferirOsLugares(outra, ler).length).toBeGreaterThan(3);
  });

  test("a árvore: upstream/ de um nao-copiado, ou arquivo a mais na pasta, é acusado; o resto do repositório não", () => {
    const base = [
      "external-engines/packingsolver/README.md",
      "external-engines/packingsolver/adapter/README.md",
      "external-engines/straight-skeleton/archilly/probe-rust/src/main.rs",
    ];
    expect(
      conferirAArvore(["packingsolver", "straight-skeleton"], base),
    ).toEqual([]);
    expect(
      conferirAArvore(
        ["packingsolver"],
        [...base, "external-engines/packingsolver/upstream/VERSION"],
      ).map((p) => p.tipo),
    ).toEqual(["copiado-que-diz-nao-copiado", "pasta-com-arquivo-a-mais"]);
    expect(
      conferirAArvore(
        ["straight-skeleton"],
        [...base, "external-engines/straight-skeleton/upstream/x.rs"],
      ).map((p) => p.tipo),
    ).toEqual(["copiado-que-diz-nao-copiado"]);
    expect(
      conferirAArvore(
        ["packingsolver"],
        [...base, "external-engines/packingsolver/adapter/src/porta.ts"],
      ).map((p) => p.tipo),
    ).toEqual(["pasta-com-arquivo-a-mais"]);
    // O upstream/ do Symbios é copiado de propósito, e ele não é nao-copiado: não conta.
    expect(
      conferirAArvore(
        ["packingsolver"],
        [...base, "external-engines/symbios/upstream/VERSION"],
      ),
    ).toEqual([]);
  });
});
