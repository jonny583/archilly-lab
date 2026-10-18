/**
 * **LAB-172 (item 900) · a análise do esqueleto reto — as fichas perguntadas à origem, as saídas ao arquivo, os
 * lugares e a pasta** (D400).
 *
 * ```sh
 * bun test tests/a-analise-do-esqueleto-reto.test.ts
 * ```
 *
 * A `docs/STRAIGHT_SKELETON_ANALYSIS.md` (LAB-00) fixa a ficha de dois repositórios de fora que seis lugares desta casa
 * repetem, e cita duas saídas que diz guardar em `outputs/`. O motivo inteiro está no cabeçalho de
 * `src/a-analise-do-esqueleto-reto.ts`.
 *
 * Roda **sem clones e sem rede**: a página, os lugares, o registro, as duas saídas, o oráculo do LAB-04, o
 * `git ls-files` desta casa e a prova que a ferramenta `bun run lab172` (a única parte com rede) gravou. Por isso está
 * no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PAGINA,
  A_PROVA,
  ARQUIVOS_DA_PASTA,
  COMMIT_A,
  COMMIT_B,
  conferirAAnalise,
  conferirAPasta,
  conferirAsSaidas,
  conferirContraAOrigem,
  conferirOOraculo,
  conferirOsLugares,
  lerAFicha,
  O_ORACULO,
  oQueCadaLugarDiz,
  REGISTRO,
  SAIDA_CGAL,
  SAIDA_RUST,
  type ProvaNaOrigem,
  type TipoDeProblema,
} from "../src/a-analise-do-esqueleto-reto.ts";

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
const ORACULO = JSON.parse(ler(O_ORACULO)!) as Parameters<typeof conferirOOraculo>[0];
const CGAL = ler(SAIDA_CGAL)!;
const RUST = ler(SAIDA_RUST)!;
const contra = (texto: string, prova: ProvaNaOrigem = PROVA): TipoDeProblema[] =>
  conferirContraAOrigem(lerAFicha(texto), prova).map((p) => p.tipo);
const saidas = (texto: string, troca?: [string, string, string]): TipoDeProblema[] =>
  conferirAsSaidas(texto, (c) => (troca && c === troca[0] ? ler(c)!.replace(troca[1], troca[2]) : ler(c))).map((p) => p.tipo);

describe("LAB-172 · a análise de verdade", () => {
  const r = conferirAAnalise(RAIZ);

  test("o universo é publicado, e não é zero", () => {
    const lugares = oQueCadaLugarDiz(r.ficha);
    console.log(
      `    fichas: ${Object.keys(r.ficha.a.bibliotecas).length} bibliotecas · ${r.ficha.a.includes.length} includes · ` +
        `${r.ficha.a.opcoes.length} opções · ${r.ficha.b.nomes.length} nomes do B · ` +
        `${r.citado.reduce((s, c) => s + c.geometria.length, 0)} linhas de geometria e ` +
        `${r.citado.reduce((s, c) => s + c.tempos.length, 0)} tempos citados · ${lugares.length} lugares, ` +
        `${lugares.reduce((s, l) => s + l.diz.length, 0)} frases · ${r.versionados} arquivos versionados · ` +
        `${r.problemas.length} problemas`,
    );
    // Contados no LAB-172, em 18/10/2026: 4 bibliotecas, 2 includes, 2 opções, 5 nomes, 30 linhas, 4 tempos, 6 lugares.
    expect(Object.keys(r.ficha.a.bibliotecas).length).toBe(4);
    expect(r.ficha.b.nomes.length).toBe(5);
    expect(r.citado.reduce((s, c) => s + c.geometria.length, 0)).toBeGreaterThanOrEqual(30);
    expect(r.citado.reduce((s, c) => s + c.tempos.length, 0)).toBe(4);
    expect(r.versionados).toBeGreaterThan(500);
  });

  test("as fichas, as saídas, o oráculo, os seis lugares e a pasta: nenhum problema", () => {
    expect(r.problemas).toEqual([]);
  });

  test("a prova é dos commits que a página fixa, e foi medida — não digitada", () => {
    expect(r.ficha.a.commit).toBe(COMMIT_A);
    expect(r.ficha.b.commit).toBe(COMMIT_B);
    expect(PROVA.candidatoA.commit.existe).toBe(true);
    expect(PROVA.candidatoB.commit.existe).toBe(true);
    expect(PROVA.prompt).toBe("LAB-172");
    expect(Date.parse(PROVA.quando)).not.toBeNaN();
    expect(PROVA.candidatoA.headDeHoje.sha).toMatch(/^[0-9a-f]{40}$/);
    expect(PROVA.candidatoB.headDeHoje.sha).toMatch(/^[0-9a-f]{40}$/);
  });
});

describe("LAB-172 · a régua contra a origem, nos dois lados", () => {
  test("cada campo da ficha que muda de valor é acusado", () => {
    const mutacoes: [string, string][] = [
      ["d68f08ad2da5eea7f58d451a94068d39cd2b3796 (2026-03-24)", "d68f08ad2da5eea7f58d451a94068d39cd2b3797 (2026-03-24)"],
      ["d68f08ad2da5eea7f58d451a94068d39cd2b3796 (2026-03-24)", "d68f08ad2da5eea7f58d451a94068d39cd2b3796 (2026-03-25)"],
      ["Versão:       3.0.0", "Versão:       3.0.1"],
      ["MIT (Copyright 2021-2023 StrandedKitty)", "MIT (Copyright 2021-2024 StrandedKitty)"],
      ["Licença do invólucro: MIT", "Licença do invólucro: BSD"],
      ["(`CGAL 5.6`, fixada", "(`CGAL 5.5`, fixada"],
      ["**GMP 6.2.1**", "**GMP 6.3.0**"],
      ["Boost 1.81 (permissivo)", "Boost 1.82 (permissivo)"],
      ["1,05 MB com", "1,50 MB com"],
      ['→ "GPL (v3 or later)"', '→ "LGPL (v3 or later)"'],
      ["7ca4b0f563e9d8bb9cc306dd81192a51a4243286 (2026-07-17)", "7ca4b0f563e9d8bb9cc306dd81192a51a4243286 (2026-07-18)"],
      ["Versão:       0.2.1", "Versão:       0.2.2"],
      ["Licença:      GPL-2.0-or-later", "Licença:      GPL-3.0-or-later"],
      ["Repositório:  https://github.com/lizelive/straight-skeleton", "Repositório:  https://github.com/outro/straight-skeleton"],
    ];
    for (const [de, para] of mutacoes) {
      expect(PAGINA.includes(de), de).toBe(true);
      expect(contra(PAGINA.replace(de, para)), para).toContain("ficha-contra-a-origem");
    }
  });

  test("o campo que some é acusado como sumido, nunca como acerto", () => {
    const somem: [string | RegExp, string][] = [
      [/^Versão:\s+3\.0\.0$/m, ""],
      ["#include <CGAL/Straight_skeleton_2/IO/print.h>", ""],
      ["`-s SINGLE_FILE`", "`SINGLE_FILE`"],
      ["**Erro:** retorna `null`", "**Erro:** devolve nada"],
      ["`no_std`", "no std"],
      ["`residual()`", "residual()"],
      ["**Ambos os repositórios: REFERÊNCIA APENAS.**", "Ambos os repositórios."],
    ];
    // `replaceAll`: o nome que aparece duas vezes na seção só some se sumir das duas.
    for (const [de, para] of somem)
      expect(contra(typeof de === "string" ? PAGINA.replaceAll(de, para) : PAGINA.replace(de, para)), String(de)).toContain("campo-que-sumiu");
  });

  test("a prova que muda também é acusada — a origem que perdeu o commit, a licença, a biblioteca ou o nome", () => {
    const A = PROVA.candidatoA;
    const B = PROVA.candidatoB;
    const provas: ProvaNaOrigem[] = [
      { ...PROVA, candidatoA: { ...A, commit: { ...A.commit, existe: false } } },
      { ...PROVA, candidatoA: { ...A, licenca: null } },
      { ...PROVA, candidatoA: { ...A, bibliotecas: { ...A.bibliotecas, MPFR: "4.1.0" } } },
      { ...PROVA, candidatoA: { ...A, bytesDoMainJs: 2_000_000 } },
      { ...PROVA, candidatoA: { ...A, opcoesDeCompilacao: { ...A.opcoesDeCompilacao, SINGLE_FILE: null } } },
      { ...PROVA, cgal: { ...PROVA.cgal, texto: "LGPL (v3 or later)" } },
      { ...PROVA, candidatoB: { ...B, licencaNoCargo: "MIT" } },
      { ...PROVA, candidatoB: { ...B, primeiraLinhaDoLicense: "MIT License" } },
      { ...PROVA, candidatoB: { ...B, noStd: false } },
      { ...PROVA, candidatoB: { ...B, nomes: { ...B.nomes, "arc.sources": false } } },
    ];
    for (const p of provas) expect(contra(PAGINA, p)).toContain("ficha-contra-a-origem");
  });

  test("o caso bom passa: a página de verdade contra a prova de verdade", () => {
    expect(contra(PAGINA)).toEqual([]);
    // E o `1.81` da página contra o `1.81.0` do script é prefixo ponto a ponto, não erro; `1.8` contra `1.81.0` é.
    expect(contra(PAGINA.replace("Boost 1.81 (permissivo)", "Boost 1.81.0 (permissivo)"))).toEqual([]);
    expect(contra(PAGINA.replace("Boost 1.81 (permissivo)", "Boost 1.8 (permissivo)"))).toContain("ficha-contra-a-origem");
  });
});

describe("LAB-172 · as saídas que a página cita, contra o arquivo que ela aponta", () => {
  test("a linha de geometria que o arquivo não tem é acusada — dos dois lados (página e arquivo)", () => {
    expect(saidas(PAGINA.replace("5: [45, 15, 15]", "5: [44, 15, 15]"))).toContain("geometria-que-a-saida-nao-tem");
    expect(saidas(PAGINA.replace("[1,5,4,0]", "[1,4,5,0]"))).toContain("geometria-que-a-saida-nao-tem");
    expect(saidas(PAGINA.replace("residual 0: [(5, 5), (55, 5), (55, 25), (25, 25)", "residual 0: [(5, 5), (55, 5), (55, 26), (25, 25)"))).toContain(
      "geometria-que-a-saida-nao-tem",
    );
    expect(saidas(PAGINA.replace("nó 8: (15,45)", "nó 8: (16,45)"))).toContain("geometria-que-a-saida-nao-tem");
    expect(saidas(PAGINA, [SAIDA_CGAL, "4: [15, 15, 15]", "4: [15, 16, 15]"])).toContain("geometria-que-a-saida-nao-tem");
    expect(saidas(PAGINA, [SAIDA_RUST, "Ok(5)", "Ok(4)"])).toContain("geometria-que-a-saida-nao-tem");
  });

  test("o arquivo que some é acusado, nunca 'nada a conferir'", () => {
    expect(conferirAsSaidas(PAGINA, (c) => (c === SAIDA_RUST ? null : ler(c))).map((p) => p.detalhe)).toEqual([
      "a página aponta o arquivo, e ele não existe",
    ]);
  });

  test("o tempo citado que o arquivo não tem: sem a nota, acusado; com a nota que não traz os do arquivo, acusado", () => {
    const semNota = PAGINA.replace("> **Medido contra a origem em 18/10/2026 (LAB-172", "> **Medido em outro dia (LAB-999");
    expect(saidas(semNota).filter((t) => t === "tempo-que-a-saida-nao-tem")).toHaveLength(2);
    // A nota que esqueceu um tempo do arquivo.
    expect(saidas(PAGINA.replace("13.709µs e 6.319µs", "13.709µs e 6,3 µs"))).toContain("tempo-que-a-saida-nao-tem");
    // O arquivo que mudou de tempo: a nota não o cita mais.
    expect(saidas(PAGINA, [SAIDA_CGAL, "(12.487 ms)", "(12.400 ms)"])).toContain("tempo-que-a-saida-nao-tem");
  });

  test("o caso bom: tempo citado que o arquivo TEM não pede nota", () => {
    const comOsDoArquivo = PAGINA.replace("(11.378 ms)", "(12.487 ms)").replace("(3.490 ms)", "(3.366 ms)");
    const semNota = comOsDoArquivo.replace("> **Medido contra a origem em 18/10/2026 (LAB-172", "> **Medido em outro dia (LAB-999");
    // Só o Rust continua sem nota: o CGAL passou a citar o arquivo.
    expect(conferirAsSaidas(semNota, ler).map((p) => p.detalhe.includes(SAIDA_RUST))).toEqual([true]);
  });
});

describe("LAB-172 · o oráculo do LAB-04 está nas duas saídas guardadas", () => {
  test("o caso bom passa", () => {
    expect(conferirOOraculo(ORACULO, CGAL, RUST)).toEqual([]);
  });

  test("um nó, o offset ou a frente trocados no esperado são acusados, e o caso que some também", () => {
    const esp = ORACULO.esperado;
    const ret = esp["retangulo-60x30"]!;
    const com = (mud: Partial<typeof ret>, caso = "retangulo-60x30") => ({ esperado: { ...esp, [caso]: { ...esp[caso]!, ...mud } } });
    const tipos = (o: typeof ORACULO, c = CGAL, r = RUST) => conferirOOraculo(o, c, r).map((p) => p.tipo);
    expect(tipos(com({ nos: [[15, 15], [46, 15]] }))).toContain("oraculo-que-a-saida-nao-tem");
    expect(tipos(com({ nos: [[15, 15]] }))).toContain("oraculo-que-a-saida-nao-tem");
    expect(tipos(com({ offset_m: 14 }))).toContain("oraculo-que-a-saida-nao-tem");
    expect(tipos(com({ frenteEm5: [[5, 5], [55, 5], [55, 25], [5, 26]] }))).toContain("oraculo-que-a-saida-nao-tem");
    expect(tipos({ esperado: { ...esp, "triangulo-novo": ret } })).toContain("oraculo-que-a-saida-nao-tem");
    expect(tipos({ esperado: {} })).toEqual(["oraculo-que-a-saida-nao-tem"]);
    // E o lado da saída: o CGAL que perdeu um nó do L.
    expect(tipos(ORACULO, CGAL.replace("8: [15, 45, 15]", "8: [15, 45, 0]"))).toContain("oraculo-que-a-saida-nao-tem");
  });
});

describe("LAB-172 · os lugares e a pasta, nos dois lados", () => {
  const lugar = (arquivo: string, de: string, para: string) =>
    conferirOsLugares(FICHA, (c) => (c === arquivo ? ler(c)!.replace(de, para) : ler(c))).map((p) => p.onde);

  test("cada lugar que deixa de repetir a ficha é acusado, pelo nome", () => {
    const casos: [string, string, string][] = [
      ["docs/TRIAGEM.md", "commit `d68f08a`", "commit `d68f08b`"],
      ["docs/TRIAGEM.md", "(2026-07-17) · **GPL-2.0-or-later**", "(2026-07-16) · **GPL-2.0-or-later**"],
      ["docs/TRIAGEM.md", "(CGAL 5.6, fixada em", "(CGAL 5.5, fixada em"],
      ["docs/TRIAGEM.md", "(1,05 MB", "(1,5 MB"],
      ["docs/TRIAGEM.md", "| straight-skeleton (Rust) | **GPLv2+** |", "| straight-skeleton (Rust) | **MIT** |"],
      ["README.md", "| **GPLv3+** | contamina | REFERÊNCIA APENAS |", "| **MIT** | contamina | REFERÊNCIA APENAS |"],
      ["README.md", "straight-skeleton/            ← nada clonado", "straight-skeleton/            ← clonado"],
      ["external-engines/straight-skeleton/README.md", "**Nada foi clonado para `upstream/`.", "**Clonado para `upstream/`."],
      ["external-engines/straight-skeleton/archilly/README.md", "-s ENVIRONMENT='web'", "-s ENVIRONMENT='node'"],
      ["external-engines/esteira/src/esqueleto/esqueleto.ts", "(CGAL, GPLv3+)", "(CGAL, MIT)"],
    ];
    for (const [arquivo, de, para] of casos) {
      expect(ler(arquivo)!.includes(de), `${arquivo}: ${de}`).toBe(true);
      expect(lugar(arquivo, de, para), `${arquivo}: ${para}`).toEqual([arquivo]);
    }
    expect(conferirOsLugares(FICHA, (c) => (c === "README.md" ? null : ler(c))).map((p) => p.detalhe)).toEqual([
      "o arquivo não existe (ou, no registro, o motor não está nele)",
    ]);
    // O registro se lê pelo motor: mudar o PackingSolver não acusa o straight skeleton, e mudar o straight skeleton acusa.
    expect(lugar(REGISTRO, '"estado": "so-referencia",\n      "porque": "Triagem', '"estado": "ligado",\n      "porque": "Triagem')).toEqual([]);
    expect(lugar(REGISTRO, '"estado": "so-referencia",\n      "porque": "Impedimento', '"estado": "ligado",\n      "porque": "Impedimento')).toEqual([
      REGISTRO,
    ]);
    expect(lugar(REGISTRO, '"id": "straight-skeleton"', '"id": "esqueleto"')).toEqual([REGISTRO]);
  });

  test("a frase que cada lugar tem de dizer vem da ficha, nunca digitada: a ficha que muda muda o pedido", () => {
    const outra = lerAFicha(PAGINA.replace("Licença:      GPL-2.0-or-later", "Licença:      GPL-3.0-or-later"));
    expect(conferirOsLugares(outra, ler).length).toBeGreaterThan(3);
  });

  test("a pasta: arquivo a mais, ou arquivo que o README aponta e sumiu, é acusado; o resto do repositório não", () => {
    const base = [...ARQUIVOS_DA_PASTA, "external-engines/symbios/upstream/VERSION", "README.md"];
    expect(conferirAPasta(base)).toEqual([]);
    expect(conferirAPasta([...base, "external-engines/straight-skeleton/upstream/src/lib.rs"]).map((p) => p.onde)).toEqual([
      "external-engines/straight-skeleton/upstream/src/lib.rs",
    ]);
    expect(conferirAPasta(base.filter((c) => !c.endsWith("probe.mjs"))).map((p) => p.tipo)).toEqual(["pasta-com-arquivo-a-mais"]);
  });
});
