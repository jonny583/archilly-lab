/**
 * **LAB-185 (item 900) · a análise do Symbios — a ficha perguntada à origem, a cópia byte a byte ao commit, as
 * dependências ao registro e os módulos ao `lib.rs`** (D413).
 *
 * ```sh
 * bun test tests/a-analise-do-symbios.test.ts
 * ```
 *
 * A `docs/SYMBIOS_ANALYSIS.md` (LAB-00) fixa a ficha do motor que esta casa copiou para `upstream/`, diz que a cópia é
 * idêntica ao commit e conta os módulos. O motivo inteiro está no cabeçalho de `src/a-analise-do-symbios.ts`.
 *
 * Roda **sem clones e sem rede**: a página, o `VERSION`, o `Cargo.toml` e o `lib.rs` da cópia, os três `Cargo.lock`,
 * os lugares, o `git ls-tree` desta casa e a prova que a ferramenta `bun run lab185` (a única parte com rede) gravou.
 * Por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PAGINA,
  A_PROVA,
  COMMIT,
  conferirAAnalise,
  conferirACopia,
  conferirAFicha,
  conferirAsDependencias,
  conferirOsLugares,
  conferirOsModulos,
  lerAFicha,
  O_CARGO_DA_COPIA,
  O_LIB_DA_COPIA,
  O_VERSION,
  OS_LOCKS,
  oQueCadaLugarDiz,
  prefixo,
  type ProvaNaOrigem,
  type TipoDeProblema,
} from "../src/a-analise-do-symbios.ts";

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
const VERSION = ler(O_VERSION)!;
const CARGO = ler(O_CARGO_DA_COPIA)!;
const LIB = ler(O_LIB_DA_COPIA)!;
const LOCKS = Object.fromEntries(OS_LOCKS.map((l) => [l, ler(l)]));
const r = conferirAAnalise(RAIZ);
const copia = r.copia;
const clonar = (): ProvaNaOrigem => JSON.parse(JSON.stringify(PROVA)) as ProvaNaOrigem;
const tipos = (l: { tipo: TipoDeProblema }[]): TipoDeProblema[] => l.map((p) => p.tipo);
const trocar = (texto: string, de: string, para: string): string => {
  if (!texto.includes(de)) throw new Error(`a mutação não achou "${de}"`);
  return texto.replace(de, para);
};
const ficha = (texto: string) => tipos(conferirAFicha(lerAFicha(texto), PROVA, VERSION));
const deps = (texto: string, prova = PROVA, locks = LOCKS, cargo: string | null = CARGO) =>
  tipos(conferirAsDependencias(lerAFicha(texto), prova, locks, cargo));
const modulos = (texto: string, prova = PROVA, lib: string | null = LIB) => tipos(conferirOsModulos(lerAFicha(texto), prova, lib));

describe("LAB-185 · a análise de verdade", () => {
  test("o universo é publicado, e não é zero", () => {
    console.log(
      `    [a-analise-do-symbios] ficha de ${[r.ficha.upstream, r.ficha.versao, r.ficha.commit, r.ficha.data, r.ficha.licenca].filter((v) => v !== null).length} campos · ` +
        `cópia ${r.copia.length} arquivos contra ${r.prova.arvore.length} do commit · ${r.ficha.dependencias.length} linhas ` +
        `de dependência (${r.ficha.dependencias.flatMap((d) => d.crates).length} crates) · ${r.ficha.modulos.length} módulos ` +
        `na lista, ${r.prova.modulos?.length ?? 0} no lib.rs, ${r.prova.arquivosEmSrc} arquivos em src/ · ` +
        `${oQueCadaLugarDiz(r.ficha).length} lugares · ${r.problemas.length} problemas`,
    );
    // Contados no LAB-185, em 18/10/2026: 24 arquivos no commit e 25 na cópia, 4 linhas e 5 crates, 13 módulos, 4 lugares.
    expect(r.prova.arvore.length).toBe(24);
    expect(r.copia.length).toBe(25);
    expect(r.ficha.dependencias.flatMap((d) => d.crates).length).toBe(5);
    expect(r.ficha.modulos.length).toBe(13);
  });

  test("a ficha, a cópia, as dependências, os módulos e os lugares: nenhum problema", () => {
    expect(r.problemas).toEqual([]);
  });

  test("a prova é do commit que a página fixa, e foi medida — não digitada", () => {
    expect(r.ficha.commit).toBe(COMMIT);
    expect(PROVA.commit.existe).toBe(true);
    expect(PROVA.prompt).toBe("LAB-185");
    expect(PROVA.arvore.every((l) => /^[0-9a-f]{40}$/.test(l.objeto))).toBe(true);
    expect(PROVA.dependencias.every((d) => d.licenca !== null)).toBe(true);
  });
});

describe("LAB-185 · a ficha — os dois lados", () => {
  test("cada campo trocado acusa", () => {
    expect(ficha(trocar(PAGINA, "Versão upstream:   0.4.1", "Versão upstream:   0.4.2"))).toContain("ficha-difere");
    expect(ficha(trocar(PAGINA, "Commit:            c3f2875", "Commit:            c3f2876"))).toContain("ficha-difere");
    expect(ficha(trocar(PAGINA, "2026-09-06 20:14:40", "2026-09-07 20:14:40"))).toContain("ficha-difere");
    expect(ficha(trocar(PAGINA, "Licença:           MIT", "Licença:           Apache-2.0"))).toContain("ficha-difere");
    expect(ficha(trocar(PAGINA, "TheJanusStream/symbios-tensor\n", "outro/symbios-tensor\n"))).toContain("ficha-difere");
  });

  test("o campo que some é sumido, nunca acerto", () => {
    expect(ficha(trocar(PAGINA, "Licença:           MIT\n", ""))).toEqual(["ficha-sumida"]);
  });

  test("o VERSION da cópia que muda acusa, e o commit que não existe na origem acusa", () => {
    const v = trocar(VERSION, "Commit date:       2026-09-06", "Commit date:       2026-09-05");
    expect(tipos(conferirAFicha(lerAFicha(PAGINA), PROVA, v))).toEqual(["version-difere"]);
    const p = clonar();
    p.commit.existe = false;
    expect(tipos(conferirAFicha(lerAFicha(PAGINA), p, VERSION))).toContain("commit-nao-existe");
  });
});

describe("LAB-185 · a cópia byte a byte — os dois lados", () => {
  test("a cópia de verdade contra o commit de verdade: nada, e o VERSION é o único a mais", () => {
    expect(conferirACopia(copia, PROVA)).toEqual([]);
    expect(copia.filter((l) => !PROVA.arvore.some((o) => o.caminho === l.caminho)).map((l) => l.caminho)).toEqual(["VERSION"]);
  });

  test("um byte mudado num arquivo (outro objeto) acusa", () => {
    const c = copia.map((l) => (l.caminho === "src/lib.rs" ? { ...l, objeto: "0".repeat(40) } : l));
    expect(tipos(conferirACopia(c, PROVA))).toEqual(["copia-difere"]);
  });

  test("o modo mudado (um arquivo virou executável) acusa", () => {
    const c = copia.map((l) => (l.caminho === "Cargo.toml" ? { ...l, modo: "100755" } : l));
    expect(tipos(conferirACopia(c, PROVA))).toEqual(["copia-difere"]);
  });

  test("arquivo que falta, arquivo a mais e cópia vazia acusam", () => {
    expect(tipos(conferirACopia(copia.filter((l) => l.caminho !== "LICENSE"), PROVA))).toEqual(["falta-na-copia"]);
    expect(tipos(conferirACopia([...copia, { modo: "100644", objeto: "1".repeat(40), caminho: "src/patch.rs" }], PROVA))).toEqual([
      "sobra-na-copia",
    ]);
    expect(tipos(conferirACopia([], PROVA))).toEqual(["copia-vazia"]);
    const p = clonar();
    p.arvore = [];
    expect(tipos(conferirACopia(copia, p))).toEqual(["copia-vazia"]);
  });
});

describe("LAB-185 · a licença e as dependências — os dois lados", () => {
  test("a tabela de verdade passa, e o prefixo é por componente", () => {
    expect(deps(PAGINA)).toEqual([]);
    expect(prefixo("0.9", "0.9.5")).toBe(true);
    expect(prefixo("0.4", "0.41.0")).toBe(false);
  });

  test("a versão, a licença e o copyright trocados acusam", () => {
    expect(deps(trocar(PAGINA, "| `glam` | 0.32.1 |", "| `glam` | 0.31.1 |"))).toEqual(["dependencia-difere"]);
    expect(deps(trocar(PAGINA, "| 1.0 | MIT/Apache-2.0 |", "| 1.0 | MIT |"))).toEqual(["dependencia-difere"]);
    expect(deps(trocar(PAGINA, "`Copyright (c) 2026 TheJanusStream`", "`Copyright (c) 2025 TheJanusStream`"))).toEqual(["licenca-difere"]);
  });

  test("\"mesmo autor\" que o registro desmente acusa", () => {
    const p = clonar();
    p.dependencias[0]!.publicadaPor = "outra-pessoa";
    expect(deps(PAGINA, p)).toEqual(["dependencia-difere"]);
  });

  test("os locks que discordam, a crate sem prova e o Cargo.toml que exige outra coisa acusam", () => {
    const l = { ...LOCKS, [OS_LOCKS[1]]: trocar(LOCKS[OS_LOCKS[1]]!, 'name = "serde"\nversion = "1.0.229"', 'name = "serde"\nversion = "1.0.228"') };
    expect(deps(PAGINA, PROVA, l)).toEqual(["locks-discordam"]);
    const p = clonar();
    p.dependencias = p.dependencias.filter((d) => d.crate !== "rand_pcg");
    expect(deps(PAGINA, p)).toEqual(["dependencia-sem-prova"]);
    expect(deps(PAGINA, PROVA, LOCKS, trocar(CARGO, 'rand = "0.9"', 'rand = "0.8"'))).toEqual(["dependencia-difere"]);
  });

  test("a tabela que some acusa", () => {
    const sem = PAGINA.split("\n").filter((l) => !l.startsWith("| `")).join("\n");
    expect(deps(sem)).toContain("ficha-sumida");
  });
});

describe("LAB-185 · os módulos e a arquitetura — os dois lados", () => {
  const SEM_NOTA = PAGINA.replace(/^> \*\*Medido contra a origem em [^\n]*LAB-185[\s\S]*?(?=\n\n)/m, "");

  test("o 14 sem a nota acusa; com a nota, passa; e o número certo não pede nota", () => {
    expect(SEM_NOTA).not.toBe(PAGINA);
    expect(modulos(SEM_NOTA)).toEqual(["numero-sem-nota"]);
    expect(modulos(PAGINA)).toEqual([]);
    expect(modulos(trocar(SEM_NOTA, "tem 14\nmódulos", "tem 13\nmódulos"))).toEqual([]);
  });

  test("a nota que erra um dos dois números, ou que não nomeia a trava, acusa", () => {
    expect(modulos(trocar(PAGINA, "os 13 `pub mod`", "os 12 `pub mod`"))).toEqual(["nota-errada"]);
    expect(modulos(trocar(PAGINA, "conta de 14 arquivos", "conta de 15 arquivos"))).toEqual(["nota-errada"]);
    expect(modulos(trocar(PAGINA, "`external-engines/esteira/src/a-analise-do-symbios.ts` pergunta", "a trava pergunta"))).toEqual([
      "nota-errada",
    ]);
  });

  test("um módulo a mais na lista, um a mais no lib.rs e a origem que vira workspace acusam", () => {
    expect(modulos(trocar(PAGINA, "`streaming` (", "`streaming` (x), `fantasma` ("))).toEqual(["modulos-diferem"]);
    expect(modulos(PAGINA, PROVA, LIB + "\npub mod fantasma;\n")).toEqual(["modulos-diferem"]);
    const p = clonar();
    p.workspace = true;
    expect(modulos(PAGINA, p)).toEqual(["arquitetura-difere"]);
  });

  test("a frase \"não é workspace, sem binários\" que some acusa", () => {
    expect(modulos(trocar(PAGINA, "(não é workspace), sem binários", "(um workspace)"))).toEqual(["ficha-sumida"]);
  });
});

describe("LAB-185 · os lugares — os dois lados", () => {
  test("cada lugar que muda a frase acusa", () => {
    const r0 = conferirOsLugares(r.ficha, ler);
    expect(r0).toEqual([]);
    for (const l of oQueCadaLugarDiz(r.ficha))
      for (const frase of l.diz) {
        const mutado = (c: string): string | null => (c === l.caminho ? ler(c)!.replaceAll(frase, "—") : ler(c));
        expect(tipos(conferirOsLugares(r.ficha, mutado))).toEqual(["lugar-nao-diz"]);
      }
  });

  test("a ficha que muda muda o pedido aos lugares", () => {
    const outra = lerAFicha(trocar(PAGINA, "Versão upstream:   0.4.1", "Versão upstream:   0.5.0"));
    expect(tipos(conferirOsLugares(outra, ler))).toEqual(["lugar-nao-diz"]);
  });
});
