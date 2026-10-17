/**
 * **LAB-152 (item 900) · o trabalho acontece em `archilly/`, documentado** (D380).
 *
 * ```sh
 * bun test tests/o-trabalho-em-archilly.test.ts
 * ```
 *
 * O `CLAUDE.md` §3 diz que *"o trabalho acontece em `archilly/`, documentado"*, e nada perguntava se o que mora ali está
 * dito; a página do Symbios dizia um projeto onde havia três. O motivo inteiro, com os lugares contados, está no
 * cabeçalho de `src/o-trabalho-em-archilly.ts`.
 *
 * Roda **sem clones** (lê o `git ls-files` e as páginas DESTE repositório), e por isso está no portão sem clones do
 * `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirAArvore,
  conferirOTrabalhoEmArchilly,
  linhaDeArchilly,
  nomeadosNaLinha,
  nomeadosNoReadmeDeArchilly,
} from "../src/o-trabalho-em-archilly.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (c: string) => readFileSync(join(RAIZ, c), "utf8");

/** Um repositório de mentira: caminho → texto. Os arquivos carregados são as chaves. */
const conferir = (arvore: Record<string, string>) =>
  conferirOTrabalhoEmArchilly(Object.keys(arvore), (c) => arvore[c] ?? null).problemas.map(
    (p) => `${p.tipo}${p.projeto ? `:${p.projeto}` : ""}`,
  );

const LINHA_DE_HOJE = "| `archilly/` | Cópia de trabalho. São dois: `probe/`, a medição; e `wasm/`, a ponte que o `adapter/` carrega. |";
const PAGINA = (linha: string) => `# motor\n\n| Pasta | Regra |\n|---|---|\n| \`upstream/\` | Intocada. |\n${linha}\n`;
const DOIS = {
  "external-engines/m/archilly/probe/src/main.rs": "",
  "external-engines/m/archilly/wasm/Cargo.toml": "",
};

/** A linha do Symbios como estava até o LAB-152, literal. */
const LINHA_DO_LAB_00 =
  "| `archilly/` | Cópia de trabalho. Contém `probe/`, o arranjo de medição do LAB-00. Ele **depende** do upstream por caminho; não o modifica. |";

describe("LAB-152 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §3 diz que o trabalho acontece em archilly/, documentado", () => {
    const claude = ler("CLAUDE.md");
    expect(aRegraEstaEscrita(claude, A_REGRA)).toBe(true);
    expect(claude).toContain("`archilly/`**, documentado");
  });
});

describe("LAB-152 · a árvore de hoje", () => {
  const r = conferirAArvore(RAIZ);

  test("passa", () => {
    expect(r.problemas).toEqual([]);
  });

  test("e diz o tamanho do que leu: dois motores, cinco projetos", () => {
    expect(r.motores.map((m) => m.motor)).toEqual(["straight-skeleton", "symbios"]);
    expect(r.projetos).toBe(5);
    expect(Object.fromEntries(r.motores.map((m) => [m.motor, m.projetos]))).toEqual({
      "straight-skeleton": ["probe-cgal-wasm", "probe-rust"],
      symbios: ["probe", "wasm", "wasm-probe"],
    });
  });

  test("cada motor documenta num lugar: o esqueleto no archilly/README.md, o Symbios na linha da página", () => {
    const lugares = Object.fromEntries(r.motores.map((m) => [m.motor, m.lugares.map((l) => l.lugar)]));
    expect(lugares["straight-skeleton"]).toEqual(["external-engines/straight-skeleton/archilly/README.md"]);
    expect(lugares["symbios"]).toEqual(["external-engines/symbios/README.md (a linha `archilly/`)"]);
  });

  test("a linha do LAB-00, de volta na página de hoje, seria acusada — dois projetos calados", () => {
    const pagina = ler("external-engines/symbios/README.md");
    const linha = linhaDeArchilly(pagina)!;
    const antiga = pagina.replace(linha, LINHA_DO_LAB_00);
    const r2 = conferirOTrabalhoEmArchilly(
      [...r.motores.flatMap((m) => m.projetos.map((p) => `external-engines/${m.motor}/archilly/${p}/x`)),
        "external-engines/symbios/README.md",
        "external-engines/straight-skeleton/archilly/README.md"],
      (c) => (c === "external-engines/symbios/README.md" ? antiga : ler(c)),
    );
    expect(r2.problemas.map((p) => `${p.tipo}:${p.projeto}`)).toEqual([
      "projeto-calado:wasm",
      "projeto-calado:wasm-probe",
    ]);
  });
});

describe("LAB-152 · o lado bom", () => {
  test("a linha da página que nomeia os dois passa — e o adapter/ citado não é projeto", () => {
    expect(conferir({ ...DOIS, "external-engines/m/README.md": PAGINA(LINHA_DE_HOJE) })).toEqual([]);
    expect(nomeadosNaLinha(LINHA_DE_HOJE)).toEqual(["probe", "wasm"]);
  });

  test("o archilly/README.md com uma seção por projeto passa", () => {
    const readme = "# archilly/\n\nTexto com `outra/` coisa.\n\n## `probe/` — a medição\n\nx\n\n### `wasm/`\n\ny\n";
    expect(conferir({ ...DOIS, "external-engines/m/archilly/README.md": readme })).toEqual([]);
    expect(nomeadosNoReadmeDeArchilly(readme)).toEqual(["probe", "wasm"]);
  });

  test("os dois lugares juntos somam: um nomeia um, o outro nomeia o outro", () => {
    const linha = "| `archilly/` | Contém `probe/`. |";
    expect(
      conferir({
        ...DOIS,
        "external-engines/m/README.md": PAGINA(linha),
        "external-engines/m/archilly/README.md": "## `wasm/`\n",
      }),
    ).toEqual([]);
  });

  test("a prosa que cita `archilly/` antes da tabela não é a linha — só a célula da tabela é", () => {
    const pagina = "# motor\n\nO código em `archilly/` usa `cargo/`.\n\n" + PAGINA(LINHA_DE_HOJE);
    expect(conferir({ ...DOIS, "external-engines/m/README.md": pagina })).toEqual([]);
  });

  test("motor sem archilly/ não é perguntado", () => {
    expect(
      conferir({ ...DOIS, "external-engines/m/README.md": PAGINA(LINHA_DE_HOJE), "external-engines/n/adapter/x.ts": "" }),
    ).toEqual([]);
  });
});

describe("LAB-152 · o lado ruim", () => {
  test("a forma exata do LAB-00: a linha nomeia um, há dois", () => {
    expect(conferir({ ...DOIS, "external-engines/m/README.md": PAGINA(LINHA_DO_LAB_00) })).toEqual(["projeto-calado:wasm"]);
  });

  test("projeto novo que nasce sem ser nomeado", () => {
    expect(
      conferir({
        ...DOIS,
        "external-engines/m/archilly/terceiro/main.rs": "",
        "external-engines/m/README.md": PAGINA(LINHA_DE_HOJE),
      }),
    ).toEqual(["projeto-calado:terceiro"]);
  });

  test("o outro sentido: o lugar nomeia um projeto apagado", () => {
    expect(
      conferir({
        "external-engines/m/archilly/probe/src/main.rs": "",
        "external-engines/m/README.md": PAGINA(LINHA_DE_HOJE),
      }),
    ).toEqual(["nomeado-sem-existir:wasm"]);
  });

  test("seção no archilly/README.md de projeto que não existe", () => {
    expect(
      conferir({ ...DOIS, "external-engines/m/archilly/README.md": "## `probe/`\n## `wasm/`\n## `sumiu/`\n" }),
    ).toEqual(["nomeado-sem-existir:sumiu"]);
  });

  test("menção solta no corpo do archilly/README.md não conta como seção", () => {
    expect(conferir({ ...DOIS, "external-engines/m/archilly/README.md": "## `probe/`\n\nVer também `wasm/`.\n" })).toEqual([
      "projeto-calado:wasm",
    ]);
  });

  test("sem lugar nenhum: a página não tem a linha, e não há archilly/README.md", () => {
    expect(conferir({ ...DOIS, "external-engines/m/README.md": "# motor\n\nTexto que cita `probe/` e `wasm/`.\n" })).toEqual([
      "sem-lugar",
    ]);
    expect(conferir(DOIS)).toEqual(["sem-lugar"]);
  });

  test("o README que existe no disco e o git não carrega não é lugar", () => {
    const arvore = { ...DOIS, "external-engines/m/README.md": PAGINA(LINHA_DE_HOJE) };
    const r = conferirOTrabalhoEmArchilly(Object.keys(DOIS), (c) => (arvore as Record<string, string>)[c] ?? null);
    expect(r.problemas.map((p) => p.tipo)).toEqual(["sem-lugar"]);
  });

  test("motor com archilly/ só com um arquivo solto também é perguntado", () => {
    expect(conferir({ "external-engines/m/archilly/notas.txt": "" })).toEqual(["sem-lugar"]);
  });

  test("universo vazio reprova", () => {
    expect(conferir({ "README.md": "" })).toEqual(["universo-vazio"]);
  });
});

describe("LAB-152 · o que ela não alcança, dito", () => {
  test("a lista existe e não está vazia", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
  });
});
