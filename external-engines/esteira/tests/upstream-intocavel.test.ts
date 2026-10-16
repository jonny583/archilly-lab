/**
 * **LAB-132 (item 900) · o `upstream/` é intocável** (D360).
 *
 * ```sh
 * bun test tests/upstream-intocavel.test.ts
 * ```
 *
 * O `CLAUDE.md` §3 abre a regra de ouro por *"`upstream/` é intocável: cópia exata, commit e data em
 * `VERSION`; sem patch"* — e uma linha acrescentada ao `src/lib.rs` do Symbios, um arquivo novo ao lado
 * dele e o `Commit:` apagado do `VERSION` não reprovavam nenhuma das travas da esteira. Roda **sem
 * clones** (lê o `git` e o disco desta casa), e por isso está no portão sem clones do `verde.yml`. No
 * clone raso do CI o `HEAD` tem a árvore inteira — a régua não pergunta pela história.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  COPIAS_DE_UPSTREAM,
  conferirOUpstream,
  oVersionDiz,
  pastasDeUpstream,
  type OQueORepositorioDiz,
} from "../src/upstream-intocavel.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const git = (...args: string[]): string => execFileSync("git", args, { cwd: RAIZ, encoding: "utf8" });

/** O repositório de verdade, lido pelo `git` e pelo disco. */
const DE_VERDADE: OQueORepositorioDiz = {
  versionados: git("ls-files").split("\n").filter(Boolean),
  arvoreNoHead: (pasta) => {
    try {
      return git("rev-parse", `HEAD:${pasta}`).trim();
    } catch {
      return null;
    }
  },
  diferencas: (pasta) => git("status", "--porcelain", "--untracked-files=all", "--", pasta).split("\n").filter(Boolean),
  version: (pasta) => (existsSync(join(RAIZ, pasta, "VERSION")) ? readFileSync(join(RAIZ, pasta, "VERSION"), "utf8") : null),
};

const SYMBIOS = "external-engines/symbios/upstream";
const VERSION_DE_VERDADE = DE_VERDADE.version(SYMBIOS)!;
const ARVORE = COPIAS_DE_UPSTREAM[0]!.arvore;

/** Um repositório de mentira, limpo e igual ao registro — cada teste o estraga num ponto só. */
function falso(mudar: Partial<OQueORepositorioDiz> = {}): OQueORepositorioDiz {
  return {
    versionados: [`${SYMBIOS}/VERSION`, `${SYMBIOS}/src/lib.rs`, "external-engines/symbios/archilly/wasm/src/lib.rs"],
    arvoreNoHead: (p) => (p === SYMBIOS ? ARVORE : null),
    diferencas: () => [],
    version: () => VERSION_DE_VERDADE,
    ...mudar,
  };
}
const tipos = (repo: OQueORepositorioDiz) => conferirOUpstream(repo).problemas.map((p) => `${p.tipo} ${p.pasta}`);

describe("LAB-132 · a casa de verdade — uma cópia, intocada desde o LAB-00", () => {
  const r = conferirOUpstream(DE_VERDADE);

  test("a regra está escrita onde mora — o §3", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
  });

  test("o universo: as pastas e os arquivos lidos — publicado, não zero", () => {
    console.log(`    ${r.pastas.length} pasta(s) upstream · ${r.arquivos} arquivos · ${r.problemas.length} problemas`);
    // Contados no LAB-132: uma pasta, 25 arquivos.
    expect(r.pastas).toEqual([SYMBIOS]);
    expect(r.arquivos).toBeGreaterThanOrEqual(20);
  });

  test("nenhum problema: a árvore é a registrada, nada difere do HEAD, e o VERSION diz commit e data", () => {
    expect(r.problemas).toEqual([]);
  });

  test("o VERSION do Symbios, lido: o commit do upstream e a data dele", () => {
    expect(oVersionDiz(VERSION_DE_VERDADE)).toEqual({
      commit: "c3f287556b98cc616d4263d163e6643ae32111ff",
      data: "2026-09-06",
    });
  });
});

describe("LAB-132 · as três mutações medidas antes da régua, replantadas", () => {
  test("uma linha acrescentada ao `src/lib.rs` e não enviada → mudança na pasta", () => {
    expect(tipos(falso({ diferencas: () => [` M ${SYMBIOS}/src/lib.rs`] }))).toEqual([`mudanca-na-pasta ${SYMBIOS}`]);
  });

  test("um arquivo novo ao lado dele → mudança na pasta", () => {
    expect(tipos(falso({ diferencas: () => [`?? ${SYMBIOS}/src/patch.rs`] }))).toEqual([`mudanca-na-pasta ${SYMBIOS}`]);
  });

  test("o `Commit:` apagado do `VERSION` → o VERSION não diz o commit", () => {
    const semCommit = VERSION_DE_VERDADE.replace(/^Commit:.*$/m, "");
    expect(semCommit).not.toBe(VERSION_DE_VERDADE);
    expect(tipos(falso({ version: () => semCommit }))).toEqual([`version-sem-commit ${SYMBIOS}`]);
  });

  test("e o mesmo patch, COMMITADO — a árvore no HEAD não é mais a registrada", () => {
    expect(tipos(falso({ arvoreNoHead: () => "0".repeat(40) }))).toEqual([`arvore-mudou ${SYMBIOS}`]);
  });
});

describe("LAB-132 · a régua nos dois lados", () => {
  test("o caso bom: limpo e igual ao registro → nada", () => {
    expect(tipos(falso())).toEqual([]);
  });

  test("pasta upstream nova, sem linha no registro → reprova, e diz a árvore dela", () => {
    const outra = "external-engines/outro/upstream";
    const r = conferirOUpstream(
      falso({
        versionados: [...falso().versionados, `${outra}/VERSION`, `${outra}/src/a.rs`],
        arvoreNoHead: (p) => (p === SYMBIOS ? ARVORE : "a".repeat(40)),
      }),
    );
    expect(r.problemas.map((p) => `${p.tipo} ${p.pasta}`)).toEqual([`pasta-sem-registro ${outra}`]);
    expect(r.problemas[0]!.detalhe).toContain("a".repeat(40));
  });

  test("linha no registro sem pasta → reprova (a cópia saiu e o registro ficou)", () => {
    expect(tipos(falso({ versionados: ["external-engines/symbios/archilly/wasm/src/lib.rs"] }))).toEqual([
      `registro-sem-pasta ${SYMBIOS}`,
    ]);
  });

  test("a pasta sem `VERSION` → reprova", () => {
    expect(tipos(falso({ version: () => null }))).toEqual([`sem-version ${SYMBIOS}`]);
  });

  test("o `VERSION` sem data → reprova", () => {
    const semData = VERSION_DE_VERDADE.replace(/^Commit date:.*$/m, "").replace(/^Cloned at:.*$/m, "");
    expect(tipos(falso({ version: () => semData }))).toEqual([`version-sem-data ${SYMBIOS}`]);
  });

  test("um commit CURTO no `VERSION` não é o commit — a cópia não se refaz com ele", () => {
    const curto = VERSION_DE_VERDADE.replace(/^(Commit:\s*)([0-9a-f]{40})/m, (_m, a: string, c: string) => a + c.slice(0, 7));
    expect(tipos(falso({ version: () => curto }))).toEqual([`version-sem-commit ${SYMBIOS}`]);
  });

  test("a pasta fora do HEAD (só no índice) → a árvore não é a registrada", () => {
    expect(tipos(falso({ arvoreNoHead: () => null }))).toEqual([`arvore-mudou ${SYMBIOS}`]);
  });
});

describe("LAB-132 · onde a régua acha as pastas", () => {
  test("o segmento `upstream`, cortado nele — e só ele", () => {
    expect(
      pastasDeUpstream([
        "a/upstream/x.rs",
        "a/upstream/b/y.rs",
        "b/upstreams/z.rs", // outro nome
        "c/meu-upstream/z.rs", // outro nome
        "d/upstream", // um ARQUIVO chamado upstream
        "e/upstream/upstream/w.rs", // corta no primeiro
      ]),
    ).toEqual(["a/upstream", "e/upstream"]);
  });

  test("o registro não tem pasta repetida", () => {
    const pastas = COPIAS_DE_UPSTREAM.map((c) => c.pasta);
    expect(new Set(pastas).size).toBe(pastas.length);
  });
});
