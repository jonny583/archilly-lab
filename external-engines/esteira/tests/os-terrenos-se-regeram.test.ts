/**
 * **LAB-195 (item 900) · os terrenos de prova se regeram byte a byte** (D423).
 *
 * ```sh
 * bun test tests/os-terrenos-se-regeram.test.ts
 * ```
 *
 * Os quatro terrenos de `docs/terrenos/` e o `indice.json` saem de `symbios/adapter/ferramentas/gerar-terrenos.ts`
 * desde o LAB-01, e nenhuma trava rodava a ferramenta. Esta a roda **de verdade, no Node**, numa pasta temporária, e
 * compara o que ela grava com o que o `git` carrega, arquivo por arquivo e nos dois sentidos. O motivo inteiro está no
 * cabeçalho de `src/os-terrenos-se-regeram.ts`.
 *
 * Roda **sem clones** (a ferramenta não importa nada de fora deste repositório), e por isso está no portão sem clones
 * do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { A_FERRAMENTA, A_PASTA, compararPastas } from "../src/os-terrenos-se-regeram.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** O que o `git` carrega na pasta, pelo nome relativo a ela. */
function naArvore(): Record<string, string> {
  const arquivos = execFileSync("git", ["-C", RAIZ, "ls-files", A_PASTA], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  return Object.fromEntries(arquivos.map((f) => [f.slice(A_PASTA.length + 1), readFileSync(join(RAIZ, f), "utf8")]));
}

/** Roda a ferramenta numa pasta temporária e devolve o que ela gravou. */
function oQueAFerramentaGrava(): Record<string, string> {
  const pasta = mkdtempSync(join(tmpdir(), "terrenos-"));
  try {
    const r = spawnSync("node", ["--no-warnings", "--experimental-strip-types", join(RAIZ, A_FERRAMENTA), pasta], {
      encoding: "utf8",
    });
    if (r.status !== 0) throw new Error(`a ferramenta não rodou (${r.status}): ${r.stderr}`);
    return Object.fromEntries(readdirSync(pasta).map((f) => [f, readFileSync(join(pasta, f), "utf8")]));
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
}

describe("LAB-195 · a comparação, nos dois lados", () => {
  const BOM = { "a.geojson": "{\n \"x\": 1\n}\n", "indice.json": "{}\n" };

  test("o caso bom: as duas pastas iguais passam", () => {
    expect(compararPastas(BOM, { ...BOM })).toEqual([]);
  });

  test("o caso que quase parece inválido: a ordem em que os arquivos chegam não importa", () => {
    expect(compararPastas({ "indice.json": "{}\n", "a.geojson": BOM["a.geojson"] }, BOM)).toEqual([]);
  });

  test("o caso ruim: um byte a mais, e a linha onde começa", () => {
    const ruim = { ...BOM, "a.geojson": "{\n \"x\": 1.0\n}\n" };
    expect(compararPastas(BOM, ruim)).toEqual([
      { arquivo: "a.geojson", tipo: "difere", detalhe: "a.geojson difere do que a ferramenta grava a partir da linha 2" },
    ]);
    // o fim de linha também é byte
    expect(compararPastas(BOM, { ...BOM, "indice.json": "{}" }).map((p) => p.tipo)).toEqual(["difere"]);
  });

  test("o caso ruim nos dois sentidos: o que a árvore não tem, e o que a ferramenta não grava", () => {
    const soOTerreno = { "a.geojson": BOM["a.geojson"] };
    expect(compararPastas(BOM, soOTerreno).map((p) => `${p.tipo} ${p.arquivo}`)).toEqual(["falta-na-arvore indice.json"]);
    expect(compararPastas(soOTerreno, BOM).map((p) => `${p.tipo} ${p.arquivo}`)).toEqual(["sobra-na-arvore indice.json"]);
  });
});

describe("LAB-195 · a ferramenta, rodada, regrava a pasta versionada byte a byte", () => {
  const gerados = oQueAFerramentaGrava();
  const versionados = naArvore();

  test("o universo: os cinco arquivos que a ferramenta grava e os que o git carrega — publicado, não zero", () => {
    const bytes = Object.values(gerados).reduce((s, t) => s + Buffer.byteLength(t), 0);
    console.log(
      `    [os-terrenos-se-regeram] gravados ${Object.keys(gerados).length} · na árvore ${Object.keys(versionados).length} · ${bytes} bytes comparados`,
    );
    // Contados no LAB-195: quatro terrenos e o índice, dos dois lados.
    expect(Object.keys(gerados).sort()).toEqual([
      "completo.geojson",
      "indice.json",
      "pequeno.geojson",
      "sintetico-10ha-plano.geojson",
      "sintetico-50ha-ondulado.geojson",
    ]);
    expect(bytes).toBeGreaterThan(1_000_000);
  });

  test("nenhum arquivo difere, falta ou sobra", () => {
    expect(
      compararPastas(gerados, versionados).map((p) => p.detalhe),
      `regere com \`node --experimental-strip-types ${A_FERRAMENTA}\` e explique no commit o que mudou`,
    ).toEqual([]);
  });

  test("o índice grava a área em metro quadrado, a mesma de cada terreno", () => {
    const indice = JSON.parse(gerados["indice.json"]!) as { terrenos: { id: string; area_m2: number }[] };
    for (const t of indice.terrenos) {
      const terreno = JSON.parse(gerados[`${t.id}.geojson`]!) as {
        features: { properties: { areaCalculada_m2: number } }[];
      };
      expect(t.area_m2, t.id).toBe(terreno.features[0]!.properties.areaCalculada_m2);
    }
    expect(gerados["indice.json"]).not.toContain("_ha\"");
  });
});
