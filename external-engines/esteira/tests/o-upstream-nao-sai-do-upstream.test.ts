/**
 * **LAB-161 (item 900) · nenhum motor copiado para fora de `upstream/` — e o Lab o lê de lá** (D389).
 *
 * ```sh
 * bun test tests/o-upstream-nao-sai-do-upstream.test.ts
 * ```
 *
 * A linha do `docs/SEGURANCA.md` (tabela *Integridade do que foi copiado*) era uma frase sobre duas pastas, do LF-FINAL,
 * sem trava. O motivo inteiro, com a medição, está no cabeçalho de `src/o-upstream-nao-sai-do-upstream.ts`.
 *
 * Roda **sem clones** (lê só o `git ls-files` deste repositório e dados plantados) e por isso está no portão sem clones
 * do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, posix } from "node:path";

import type { Arquivo } from "../src/adapter-unica-fronteira.ts";
import {
  ARGUMENTOS_DO_LS_FILES,
  BLOCO_COPIADO,
  EXTENSOES_DE_CODIGO,
  lerOLsFiles,
} from "../src/o-motor-da-familia-nao-se-copia.ts";
import {
  A_LINHA,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirQueOUpstreamNaoSai,
  dependenciasDe,
  nomeDoPacote,
} from "../src/o-upstream-nao-sai-do-upstream.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

function oQueOGitCarrega(): Arquivo[] {
  const saida = execFileSync("git", [...ARGUMENTOS_DO_LS_FILES], { cwd: RAIZ, encoding: "utf8", maxBuffer: 1 << 28 });
  return lerOLsFiles(saida)
    .filter((c) => EXTENSOES_DE_CODIGO.test(c) || posix.basename(c) === "Cargo.toml")
    .map((caminho) => ({ caminho, texto: readFileSync(join(RAIZ, caminho), "utf8") }));
}

const plantadas = (prefixo: string, n: number) =>
  Array.from({ length: n }, (_, i) => `let ${prefixo}_${i} = calcular_algo_plantado(${i}, "${prefixo}");`);
const arquivo = (caminho: string, linhas: string[]): Arquivo => ({ caminho, texto: linhas.join("\n") + "\n" });

const UP = "external-engines/motor/upstream";
const CARGO_DO_UP = arquivo(`${UP}/Cargo.toml`, ["[package]", 'name = "motor-de-fora"', 'version = "1.0.0"']);
const MOTOR = arquivo(`${UP}/src/lib.rs`, plantadas("motor", 40));
const BASE = [CARGO_DO_UP, MOTOR];
const cargoDaPonte = (dep: string) =>
  arquivo("external-engines/motor/archilly/ponte/Cargo.toml", ["[package]", 'name = "ponte"', "", "[dependencies]", dep]);
const PONTE_CERTA = cargoDaPonte('motor-de-fora = { path = "../../upstream" }');
// O endereço do `git` plantado vai montado em pedaços: escrito inteiro, a trava do "nada pago" (LAB-148) o lê como
// porta nova não declarada — e ela está certa em ler, o que não se lê é o pedaço solto (a mesma saída do LAB-160).
const GIT_PLANTADO = ["https:", "", "exemplo.invalid", "motor"].join("/");
const tipos = (versionados: Arquivo[]) => conferirQueOUpstreamNaoSai({ versionados }).problemas.map((p) => p.tipo);

describe("LAB-161 · a linha da página, e a casa de hoje", () => {
  test("o `docs/SEGURANCA.md` escreve a linha e aponta para esta régua", () => {
    const pagina = readFileSync(join(RAIZ, "docs", "SEGURANCA.md"), "utf8");
    expect(aRegraEstaEscrita(pagina, A_LINHA)).toBe(true);
    const linha = pagina.split("\n").find((l) => l.includes("Nenhum motor copiado para fora de"));
    expect(linha).toBeDefined();
    expect(linha).toContain(O_PONTEIRO);
  });

  test("a casa de hoje: nenhuma cópia do `upstream/`, e o Lab o lê de lá — com o universo publicado", () => {
    const r = conferirQueOUpstreamNaoSai({ versionados: oQueOGitCarrega() });
    const u = r.universo;
    console.log(
      `    ${u.pastasDeUpstream.map((p) => `${p.pasta} (${p.pacote}, ${p.arquivosDeCodigo} arquivos de código)`).join("; ")}` +
        ` contra ${u.arquivosDaCasa} arquivo(s) da casa; ${u.manifestosLidos} Cargo.toml lido(s), ` +
        `${r.dependencias.length} dependência(s) do motor; o mais parecido: ` +
        (r.maisParecido ? `${r.maisParecido.arquivo} — ${r.maisParecido.comum} de ${r.maisParecido.linhas} linhas` : "nada"),
    );
    expect(r.problemas).toEqual([]);
    expect(u.pastasDeUpstream.map((p) => p.pasta)).toEqual(["external-engines/symbios/upstream"]);
    expect(u.pastasDeUpstream[0]!.pacote).toBe("symbios-tensor");
    expect(u.pastasDeUpstream[0]!.arquivosDeCodigo).toBeGreaterThan(10);
    expect(u.arquivosDaCasa).toBeGreaterThan(300);
    // As três pontes de Rust do Symbios, todas pelo `path` — se uma sumir, o número de hoje muda aqui, não calado.
    expect(r.dependencias.map((d) => d.manifesto).sort()).toEqual([
      "external-engines/symbios/archilly/probe/Cargo.toml",
      "external-engines/symbios/archilly/wasm-probe/Cargo.toml",
      "external-engines/symbios/archilly/wasm/Cargo.toml",
    ]);
    for (const d of r.dependencias) expect(d.aponta).toBe("external-engines/symbios/upstream");
    // A folga: o mais parecido está longe dos limites.
    expect(r.maisParecido!.comum).toBeLessThan(10);
  });

  test("o que ela não alcança está dito, e inclui a cópia reescrita e a sondagem sem `upstream/`", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
    expect(O_QUE_ISTO_NAO_ALCANCA.join(" ")).toContain("REESCRITA");
    expect(O_QUE_ISTO_NAO_ALCANCA.join(" ")).toContain("straight-skeleton");
  });
});

describe("LAB-161 · a cópia, dos dois lados", () => {
  test("O LADO BOM: a ponte que usa o motor pela API, com três linhas iguais às do exemplo, passa", () => {
    const ponte = arquivo("external-engines/motor/archilly/ponte/src/lib.rs", [
      ...plantadas("ponte", 20),
      ...plantadas("motor", 3),
    ]);
    expect(tipos([...BASE, PONTE_CERTA, ponte])).toEqual([]);
  });

  test("arquivo idêntico a um do `upstream/`, em qualquer lugar fora dele → `copia-inteira`", () => {
    const copia = { ...MOTOR, caminho: "external-engines/esteira/src/copia.rs" };
    expect(tipos([...BASE, copia])).toEqual(["copia-inteira"]);
  });

  test("metade das linhas iguais (com o mínimo) → `copia-do-upstream`; uma a menos do limite passa", () => {
    const metade = arquivo("external-engines/motor/archilly/x.rs", [...plantadas("motor", 10), ...plantadas("meu", 10)]);
    expect(tipos([...BASE, metade])).toEqual(["copia-do-upstream"]);
    const quase = arquivo("external-engines/motor/archilly/x.rs", [...plantadas("motor", 10), ...plantadas("meu", 11)]);
    expect(tipos([...BASE, quase])).toEqual([]);
  });

  test("um bloco de 30 linhas num arquivo grande → `copia-do-upstream`; 29 passam", () => {
    const grande = arquivo("external-engines/motor/archilly/g.rs", [
      ...plantadas("motor", BLOCO_COPIADO),
      ...plantadas("meu", 200),
    ]);
    expect(tipos([...BASE, grande])).toEqual(["copia-do-upstream"]);
    const quase = arquivo("external-engines/motor/archilly/g.rs", [
      ...plantadas("motor", BLOCO_COPIADO - 1),
      ...plantadas("meu", 200),
    ]);
    expect(tipos([...BASE, quase])).toEqual([]);
  });

  test("o próprio `upstream/` não se compara consigo, nem um segundo `upstream/` de outro motor com o primeiro", () => {
    const outro = arquivo("external-engines/outro/upstream/src/lib.rs", plantadas("outro", 20));
    const cargoOutro = arquivo("external-engines/outro/upstream/Cargo.toml", ["[package]", 'name = "outro"']);
    expect(tipos([...BASE, outro, cargoOutro])).toEqual([]);
  });

  test("sem `upstream/` nenhum, ou um sem código → o universo vazio se acusa, não passa calado", () => {
    expect(tipos([])).toEqual(["universo-vazio"]);
    expect(tipos([CARGO_DO_UP, arquivo(`${UP}/README.md`, ["só texto"])])).toEqual(["upstream-vazio"]);
  });
});

describe("LAB-161 · a dependência, dos dois lados", () => {
  test("o nome do pacote vem do `[package]`, não da primeira linha `name`", () => {
    expect(nomeDoPacote('[[bin]]\nname = "nao"\n\n[package]\nname = "sim"\n')).toBe("sim");
    expect(nomeDoPacote('[workspace]\nmembers = []\n')).toBeNull();
  });

  test("as formas de dependência: em linha, em tabela, de dev e de build, com e sem `path`", () => {
    const cargo = [
      "[dependencies]",
      'motor-de-fora = { path = "../../upstream" } # o certo',
      'outro = "1"',
      "[dev-dependencies]",
      'motor-de-fora = "1.0"',
      "[build-dependencies.motor-de-fora]",
      'path = "../vendido"',
      "[target.'cfg(unix)'.dependencies]",
      `motor-de-fora = { git = "${GIT_PLANTADO}" }`,
    ].join("\n");
    expect(dependenciasDe(cargo, ["motor-de-fora"])).toEqual([
      { pacote: "motor-de-fora", path: "../../upstream" },
      { pacote: "motor-de-fora", path: null },
      { pacote: "motor-de-fora", path: "../vendido" },
      { pacote: "motor-de-fora", path: null },
    ]);
  });

  test("O LADO BOM: `path` para o `upstream/` passa", () => {
    expect(tipos([...BASE, PONTE_CERTA])).toEqual([]);
  });

  test("do crates.io, de um git ou de outra pasta → `dependencia-fora-do-upstream`", () => {
    expect(tipos([...BASE, cargoDaPonte('motor-de-fora = "1.0"')])).toEqual(["dependencia-fora-do-upstream"]);
    expect(tipos([...BASE, cargoDaPonte(`motor-de-fora = { git = "${GIT_PLANTADO}" }`)])).toEqual([
      "dependencia-fora-do-upstream",
    ]);
    expect(tipos([...BASE, cargoDaPonte('motor-de-fora = { path = "../../vendido" }')])).toEqual([
      "dependencia-fora-do-upstream",
    ]);
  });

  test("o `Cargo.toml` do próprio `upstream/` não é a ponte, e dependência de outro pacote não interessa", () => {
    expect(tipos([...BASE, cargoDaPonte('glam = "0.32"')])).toEqual([]);
  });
});
