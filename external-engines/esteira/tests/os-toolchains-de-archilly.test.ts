/**
 * **LAB-190 (item 900) · os `rust-toolchain.toml` de `archilly/` — cópias do upstream, com o comentário que fala do CI de lá** (D418).
 *
 * ```sh
 * bun test tests/os-toolchains-de-archilly.test.ts
 * ```
 *
 * As três cópias do `rust-toolchain.toml` em `external-engines/symbios/archilly/` trazem o comentário em inglês do
 * upstream, que afirma o CI de LÁ; a página do motor nada dizia delas. O motivo inteiro está no cabeçalho de
 * `src/os-toolchains-de-archilly.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PAGINA,
  MARCA_ABRE,
  MARCA_FECHA,
  O_CONFERIR,
  O_DO_UPSTREAM,
  O_MOTOR,
  O_QUE_ISTO_NAO_ALCANCA,
  O_VERDE,
  aListaDaPagina,
  aSecao,
  asCitacoes,
  asPastasDoCargo,
  conferir,
  conferirAArvore,
  oCanal,
  oComentario,
} from "../src/os-toolchains-de-archilly.ts";
import { arquivosQueOGitCarrega } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CAMINHOS = arquivosQueOGitCarrega(RAIZ);

function lerDaRaiz(c: string): string | null {
  const p = join(RAIZ, c);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

/** A árvore de verdade, com alguns arquivos trocados — a mutação. */
function comTroca(trocas: Record<string, string | null>, caminhos: readonly string[] = CAMINHOS) {
  return conferir(caminhos, (c) => (c in trocas ? (trocas[c] ?? null) : lerDaRaiz(c)));
}

const PAGINA = lerDaRaiz(A_PAGINA) as string;
const UPSTREAM = lerDaRaiz(O_DO_UPSTREAM) as string;
const VERDE = lerDaRaiz(O_VERDE) as string;
const CONFERIR = lerDaRaiz(O_CONFERIR) as string;

/** A página como estava antes desta rodada: o blob da `main` antes do LAB-190 (`30c8de4`). */
const A_PAGINA_DE_ANTES = execFileSync("git", ["-C", RAIZ, "show", `30c8de4:${A_PAGINA}`], { encoding: "utf8" });

describe("a árvore de hoje", () => {
  test("passa, e publica o universo que leu", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `    [os-toolchains-de-archilly] ${r.copias.length} cópia(s) em archilly/ · channel ${r.canal} · cargo build em ${r.pastasDoCargo.join(", ")}`,
    );
    expect(r.problemas).toEqual([]);
    expect(r.copias).toEqual([
      "archilly/probe/rust-toolchain.toml",
      "archilly/wasm-probe/rust-toolchain.toml",
      "archilly/wasm/rust-toolchain.toml",
    ]);
    expect(r.canal).toBe("1.96.1");
    expect(r.pastasDoCargo).toEqual(["archilly-lab/external-engines/symbios/archilly/wasm"]);
  });

  test("as três cópias são, hoje, byte a byte o upstream (o que a página afirma)", () => {
    for (const c of ["probe", "wasm-probe", "wasm"]) expect(lerDaRaiz(`${O_MOTOR}archilly/${c}/rust-toolchain.toml`)).toBe(UPSTREAM);
  });

  test("o comentário do upstream diz mesmo o que a página cita", () => {
    expect(oComentario(UPSTREAM)).toContain("CI reads THIS FILE via actions-rust-lang/setup-rust-toolchain");
    expect(oComentario(UPSTREAM)).toContain("local gate ran 1.96.1");
  });

  test("o que a régua não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThan(0);
  });
});

describe("a página de antes reprova", () => {
  test("sem a seção, a régua acusa", () => {
    const r = comTroca({ [A_PAGINA]: A_PAGINA_DE_ANTES });
    console.log(`    [os-toolchains-de-archilly] a página de antes: ${r.problemas.length} problema(s)`);
    expect(r.problemas).toEqual([`${A_PAGINA}: sem a seção dos rust-toolchain.toml`]);
  });
});

describe("1 · a lista, nos dois sentidos", () => {
  test("cópia que a lista não nomeia reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace("- `archilly/probe/rust-toolchain.toml`\n", "") });
    expect(r.problemas).toContain(`${A_PAGINA}: a lista não nomeia archilly/probe/rust-toolchain.toml, que o git carrega`);
  });
  test("item que o git não carrega reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace(MARCA_FECHA, `- \`archilly/outro/rust-toolchain.toml\`\n${MARCA_FECHA}`) });
    expect(r.problemas).toContain(`${A_PAGINA}: a lista nomeia archilly/outro/rust-toolchain.toml, que o git não carrega`);
  });
  test("cópia nova no git, sem linha, reprova", () => {
    const novo = `${O_MOTOR}archilly/novo/rust-toolchain.toml`;
    const r = conferir([...CAMINHOS, novo], (c) => (c === novo ? UPSTREAM : lerDaRaiz(c)));
    expect(r.problemas).toContain(`${A_PAGINA}: a lista não nomeia archilly/novo/rust-toolchain.toml, que o git carrega`);
  });
  test("item repetido reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace(MARCA_FECHA, `- \`archilly/wasm/rust-toolchain.toml\`\n${MARCA_FECHA}`) });
    expect(r.problemas).toContain(`${A_PAGINA}: a lista repete um nome`);
  });
  test("sem as marcas reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace(MARCA_ABRE, "") });
    expect(r.problemas).toContain(`${A_PAGINA}: sem as marcas da lista dos toolchains`);
  });
  test("universo vazio reprova (D213)", () => {
    const r = conferir(
      CAMINHOS.filter((c) => !/archilly\/[^/]+\/rust-toolchain\.toml$/.test(c)),
      lerDaRaiz,
    );
    expect(r.problemas).toContain(`${O_MOTOR}archilly/: o git não carrega nenhum rust-toolchain.toml — universo vazio (D213)`);
  });
  test("a lista lê só os itens entre as marcas", () => {
    expect(aListaDaPagina(aSecao(PAGINA) as string)).toEqual([
      "archilly/probe/rust-toolchain.toml",
      "archilly/wasm-probe/rust-toolchain.toml",
      "archilly/wasm/rust-toolchain.toml",
    ]);
    expect(aListaDaPagina("sem marcas")).toBeNull();
  });
});

describe("2 · os bytes", () => {
  test("cópia que diverge, com a página dizendo byte a byte, reprova", () => {
    const c = `${O_MOTOR}archilly/wasm/rust-toolchain.toml`;
    const r = comTroca({ [c]: UPSTREAM.replace("# A version", "# Uma versão") });
    expect(r.problemas).toContain(`${A_PAGINA}: diz que as cópias são byte a byte o upstream, e archilly/wasm/rust-toolchain.toml não é`);
  });
  test("página que cala a cópia, sendo cópia, reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace("byte a byte o `upstream/rust-toolchain.toml`", "parecidos com o do upstream") });
    expect(r.problemas.some((p) => p.includes("não diz que as cópias são byte a byte o upstream"))).toBe(true);
  });
  test("página que cala, e cópia que diverge: não há o que acusar nos bytes", () => {
    const c = `${O_MOTOR}archilly/wasm/rust-toolchain.toml`;
    const r = comTroca({
      [A_PAGINA]: PAGINA.replace("byte a byte o `upstream/rust-toolchain.toml`", "parecidos com o do upstream"),
      [c]: UPSTREAM.replace("# A version", "# Uma versão"),
    });
    expect(r.problemas.filter((p) => p.includes("byte a byte"))).toEqual([]);
  });
});

describe("3 · a versão", () => {
  test("channel citado diferente do upstream reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace('`channel = "1.96.1"`', '`channel = "1.97.0"`') });
    expect(r.problemas).toContain(`${A_PAGINA}: cita channel = "1.97.0", e o upstream fixa 1.96.1`);
  });
  test("upstream que sobe a versão, e a página parada, reprova", () => {
    const r = comTroca({ [O_DO_UPSTREAM]: UPSTREAM.replace('channel = "1.96.1"', 'channel = "1.98.0"') });
    expect(r.problemas).toContain(`${A_PAGINA}: cita channel = "1.96.1", e o upstream fixa 1.98.0`);
  });
  test("o canal se lê fora de comentário", () => {
    expect(oCanal('# channel = "x"\nchannel = "1.2.3"')).toBe("1.2.3");
    expect(oCanal("# nada")).toBeNull();
  });
});

describe("4 · a frase citada", () => {
  test("citação que o comentário não diz reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace("*\"local gate ran 1.96.1\"*", '*"local gate ran 1.97.0"*') });
    expect(r.problemas).toContain(`${A_PAGINA}: cita «local gate ran 1.97.0» como o comentário, e o comentário do upstream não diz isso`);
  });
  test("comentário do upstream que muda, e a página parada, reprova", () => {
    const r = comTroca({ [O_DO_UPSTREAM]: UPSTREAM.replace("actions-rust-lang/setup-rust-toolchain", "dtolnay/rust-toolchain") });
    expect(r.problemas.some((p) => p.includes("CI reads THIS FILE via actions-rust-lang/setup-rust-toolchain"))).toBe(true);
  });
  test("o comentário se junta numa linha só, e a citação se lê entre *\"…\"*", () => {
    expect(oComentario("# a\n# b c\nx = 1")).toBe("a b c");
    expect(asCitacoes('um *"dois"* e *"três"*')).toEqual(["dois", "três"]);
  });
});

describe("5 · a ação ausente", () => {
  test("verde.yml que passa a usar a ação, e a página dizendo que não, reprova", () => {
    const r = comTroca({ [O_VERDE]: VERDE.replace("      - uses: oven-sh/setup-bun@v2", "      - uses: actions-rust-lang/setup-rust-toolchain@v1\n      - uses: oven-sh/setup-bun@v2") });
    expect(r.problemas).toContain(`${O_VERDE}: usa actions-rust-lang/setup-rust-toolchain, e a página diz que não usa essa ação`);
  });
  test("a ação em comentário do verde.yml não conta", () => {
    const r = comTroca({ [O_VERDE]: VERDE.replace("      - uses: oven-sh/setup-bun@v2", "      # actions-rust-lang/setup-rust-toolchain\n      - uses: oven-sh/setup-bun@v2") });
    expect(r.problemas).toEqual([]);
  });
  test("página que cala a ausência reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace("não usa essa ação", "talvez use") });
    expect(r.problemas.some((p) => p.includes("não diz que o verde.yml não usa actions-rust-lang/setup-rust-toolchain"))).toBe(true);
  });
});

describe("6 · a pasta do passo", () => {
  test("o cargo build mudando de projeto, e a página parada, reprova", () => {
    const r = comTroca({
      [O_VERDE]: VERDE.replace(
        "working-directory: archilly-lab/external-engines/symbios/archilly/wasm\n",
        "working-directory: archilly-lab/external-engines/symbios/archilly/probe\n",
      ),
    });
    expect(r.problemas).toContain(`${A_PAGINA}: não nomeia \`archilly/probe\`, a pasta do passo que compila`);
    expect(r.problemas).toContain(`${A_PAGINA}: diz que nenhuma rotina compila os outros, e não nomeia \`wasm/\``);
  });
  test("o cargo build fora de archilly/ reprova", () => {
    const r = comTroca({
      [O_VERDE]: VERDE.replace(
        "working-directory: archilly-lab/external-engines/symbios/archilly/wasm\n",
        "working-directory: archilly-lab/external-engines/symbios/upstream\n",
      ),
    });
    expect(r.problemas).toContain(`${O_VERDE}: o cargo build roda em archilly-lab/external-engines/symbios/upstream, que não é um projeto da lista`);
  });
  test("sem passo de cargo build reprova", () => {
    const r = comTroca({ [O_VERDE]: VERDE.replace(/cargo build/g, "cargo check") });
    expect(r.problemas).toContain(`${O_VERDE}: nenhum passo roda cargo build, e a página diz que um roda`);
  });
  test("conferir.sh que passa a compilar a sonda reprova", () => {
    const r = comTroca({ [O_CONFERIR]: `${CONFERIR}\n(cd external-engines/symbios/archilly/wasm-probe && cargo build)\n` });
    expect(r.problemas).toContain(`${A_PAGINA}: diz que nenhuma rotina compila wasm-probe/, e o verde.yml ou o conferir.sh o nomeia fora de comentário`);
  });
  test("o nome da sonda em comentário do conferir.sh não conta", () => {
    const r = comTroca({ [O_CONFERIR]: `${CONFERIR}\n# archilly/wasm-probe não se compila\n` });
    expect(r.problemas).toEqual([]);
  });
  test("página que não nomeia a pasta do passo reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replaceAll("`archilly/wasm`", "a ponte") });
    expect(r.problemas).toContain(`${A_PAGINA}: não nomeia \`archilly/wasm\`, a pasta do passo que compila`);
  });
  test("página que cala os outros dois reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace("nenhuma rotina compila", "ninguém lembra") });
    expect(r.problemas).toContain(`${A_PAGINA}: não diz que nenhuma rotina compila probe, wasm-probe («nenhuma rotina compila»)`);
  });
  test("as pastas do cargo se leem por passo", () => {
    expect(asPastasDoCargo("    steps:\n      - name: a\n        working-directory: x\n        run: cargo build\n      - name: b\n        run: ls\n")).toEqual(["x"]);
  });
});

describe("7 · os caminhos", () => {
  test("caminho que não existe reprova", () => {
    const r = comTroca({ [A_PAGINA]: PAGINA.replace("`external-engines/esteira/src/os-toolchains-de-archilly.ts`", "`external-engines/esteira/src/nao-existe.ts`") });
    expect(r.problemas).toContain(`${A_PAGINA}: external-engines/esteira/src/nao-existe.ts não existe no git`);
  });
});
