/**
 * §7 · A MEDIÇÃO É EM METROS. (LAB-143, item 900, a dívida própria, D371)
 *
 * ```sh
 * bun test tests/medicao-em-metros.test.ts
 * ```
 *
 * O `CLAUDE.md` §7 diz *"Medição é em metros e em dados"*. Os quatro conceitos e o determinismo têm
 * trava; o **metro** não tinha nenhuma, e duas ferramentas gravavam a área da gleba em hectare
 * arredondado (`src/medicao-em-metros.ts` tem a tabela). Esta trava pergunta nos dois universos onde a
 * regra mora, cada um com a lista de exceções conferida nos dois sentidos:
 *
 * 1. **as provas JSON de `docs/provas/`** — nenhuma chave de comprimento ou área fora do metro, salvo
 *    as duas provas gravadas antes desta trava, congeladas com a contagem (D118: prova é história);
 * 2. **o código dos três pacotes** (`git ls-files`, fora do `upstream/`) — nenhuma chave fora do metro,
 *    salvo as duas ferramentas do Symbios que gravam FORA de `docs/provas/`, com o motivo.
 *
 * Lê só arquivo deste repositório: entra no trabalho sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  chavesForaDoMetroNoCodigo,
  chavesForaDoMetroNoJson,
  sufixoForaDoMetro,
} from "../src/medicao-em-metros.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTE_ARQUIVO = "external-engines/esteira/tests/medicao-em-metros.test.ts";

const versionados = execFileSync("git", ["-C", RAIZ, "ls-files"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean);

/**
 * As provas gravadas ANTES desta trava, com a chave fora do metro e QUANTAS vezes ela aparece.
 * Não se regeram para trocar a unidade (D118): são a fotografia do que a ferramenta gravou no dia. As
 * duas ferramentas passaram a gravar em metro quadrado no LAB-143.
 */
const HISTORICO_NAS_PROVAS: Record<string, { chaves: Record<string, number>; motivo: string }> = {
  "docs/provas/LAB-07/medicoes.json": {
    chaves: { area_ha: 3 },
    motivo:
      "gravada em 13/09/2026 por `testfit/ferramentas/medir.ts`, que escrevia a área da gleba em hectare com duas casas; a ferramenta grava `area_m2` desde o LAB-143",
  },
  "docs/provas/LAB-50/passagem-externa.json": {
    chaves: { areaDaGleba_ha: 2 },
    motivo:
      "gravada por `esteira/ferramentas/lab50.ts`, que escrevia a área da gleba em hectare com uma casa; a ferramenta grava `areaDaGleba_m2` desde o LAB-143",
  },
};

/**
 * O código que escreve chave fora do metro e fica, com o motivo. Contagem por arquivo.
 */
const EXCECOES_NO_CODIGO: Record<string, { chaves: Record<string, number>; motivo: string }> = {
  "external-engines/symbios/adapter/ferramentas/medir.ts": {
    chaves: { area_ha: 2 },
    motivo:
      "a medição do LAB-01, gravada em `outputs/lab01/medicoes.json` — fora de `docs/provas/`, o universo do §7 — e só roda com o `.wasm`, que não se constrói nesta máquina: trocar a chave sem regerar a saída deixaria a ferramenta e a gravação discordando sem que ninguém pudesse remedir",
  },
  "external-engines/symbios/adapter/ferramentas/gerar-terrenos.ts": {
    chaves: { area_ha: 1 },
    motivo:
      "grava o ÍNDICE das entradas do LAB-01 (`docs/terrenos/indice.json`), não uma medição em `docs/provas/`; regerá-lo reescreve os quatro terrenos de prova",
  },
};

/** Conta as chaves achadas por nome. */
function porChave(achadas: { chave: string }[]): Record<string, number> {
  const contagem: Record<string, number> = {};
  for (const a of achadas) contagem[a.chave] = (contagem[a.chave] ?? 0) + 1;
  return contagem;
}

describe("§7 · a régua da unidade, nos dois lados", () => {
  test("o caso bom: metro, metro quadrado e as grandezas que não são terra passam", () => {
    for (const c of ["area_m2", "comprimento_m", "volume_m3", "rampa_pct", "azimute_graus", "motor_ms"]) {
      expect(sufixoForaDoMetro(c), c).toBeNull();
    }
  });

  test("o caso que quase parece inválido: hectare no NOME da gleba não é unidade de chave", () => {
    // `ensaio-47ha` é chave de verdade em `LAB-07/medicoes.json`, e `semAVia`, `nas92` têm sufixo com
    // sublinhado que não é unidade.
    for (const c of ["ensaio-47ha", "sintetico-10ha-plano", "alinhamento10graus_semAVia", "lotes_nas92", "area"]) {
      expect(sufixoForaDoMetro(c), c).toBeNull();
    }
  });

  test("o caso ruim: hectare, quilômetro, centímetro e milímetro reprovam, em qualquer caixa", () => {
    const ruins: Record<string, string> = {
      area_ha: "ha",
      area_HA: "ha",
      areaDaGleba_hectares: "hectares",
      extensao_km: "km",
      bacia_km2: "km2",
      calcada_cm: "cm",
      folga_mm: "mm",
      degrau_dm: "dm",
    };
    for (const [c, s] of Object.entries(ruins)) expect(sufixoForaDoMetro(c), c).toBe(s);
  });

  test("no JSON, a chave é achada em qualquer profundidade e diz o caminho", () => {
    const json = { glebas: { "ensaio-47ha": { area_ha: 47, area_m2: 470000 } }, lista: [{ trecho_km: 1 }] };
    expect(chavesForaDoMetroNoJson(json)).toEqual([
      { chave: "area_ha", sufixo: "ha", onde: "glebas.ensaio-47ha.area_ha" },
      { chave: "trecho_km", sufixo: "km", onde: "lista[0].trecho_km" },
    ]);
    expect(chavesForaDoMetroNoJson({ area_m2: 1, rampa_pct: 2 })).toEqual([]);
  });

  test("no código, chave de objeto e campo de tipo contam; comentário não conta", () => {
    const fora = "area" + "_ha";
    const codigo = [
      `// o ${fora}: 1 antigo, num comentário`,
      `/* ${fora}: 2 */`,
      `const a = { ${fora}: 3, area_m2: 4 };`,
      `interface X { ${fora}?: number }`,
      `const b = { "${fora}": 5 };`,
      `console.log(\`\${x} ha\`); // o hectare é da tela`,
    ].join("\n");
    expect(chavesForaDoMetroNoCodigo(codigo).map((a) => a.onde)).toEqual(["linha 3", "linha 4", "linha 5"]);
    expect(chavesForaDoMetroNoCodigo("const a = { area_m2: 1 };")).toEqual([]);
  });
});

describe("§7 · as provas de `docs/provas/` são em metros", () => {
  const provas = versionados.filter((f) => f.startsWith("docs/provas/") && f.endsWith(".json"));
  const achadasPorProva = new Map(
    provas.map((f) => [f, chavesForaDoMetroNoJson(JSON.parse(readFileSync(join(RAIZ, f), "utf8")))] as const),
  );

  test("o universo: as provas JSON lidas — publicado, não zero", () => {
    const chaves = [...achadasPorProva.values()].reduce((s, a) => s + a.length, 0);
    console.log(`    ${provas.length} provas JSON · ${chaves} chaves fora do metro · ${Object.keys(HISTORICO_NAS_PROVAS).length} provas congeladas`);
    // Contadas no LAB-143: 84.
    expect(provas.length).toBeGreaterThanOrEqual(84);
  });

  test("nenhuma prova nova grava comprimento ou área fora do metro", () => {
    const novas = [...achadasPorProva.entries()]
      .filter(([f, a]) => a.length > 0 && !(f in HISTORICO_NAS_PROVAS))
      .map(([f, a]) => `${f}: ${a.map((x) => x.onde).join(", ")}`);
    expect(novas, "a medição é em metros (§7): grave `_m`/`_m2`, e o hectare fica para a tela").toEqual([]);
  });

  test("as congeladas têm exatamente as chaves e as contagens declaradas — nem mais, nem menos", () => {
    for (const [f, h] of Object.entries(HISTORICO_NAS_PROVAS)) {
      expect(achadasPorProva.has(f), `${f} não existe mais: tire-a da lista`).toBe(true);
      expect(porChave(achadasPorProva.get(f)!), f).toEqual(h.chaves);
      expect(h.motivo.length, `${f} sem motivo`).toBeGreaterThan(40);
    }
  });
});

describe("§7 · as ferramentas gravam em metros", () => {
  const codigo = versionados.filter(
    (f) =>
      f.endsWith(".ts") &&
      f !== ESTE_ARQUIVO &&
      /^external-engines\/(esteira|testfit|symbios)\//.test(f) &&
      !f.includes("/upstream/") &&
      !f.includes("/node_modules/"),
  );
  const achadasPorArquivo = new Map(
    codigo.map((f) => [f, chavesForaDoMetroNoCodigo(readFileSync(join(RAIZ, f), "utf8"))] as const),
  );

  test("o universo: os .ts versionados dos três pacotes — publicado, não zero", () => {
    console.log(`    ${codigo.length} arquivos .ts · ${Object.keys(EXCECOES_NO_CODIGO).length} exceções declaradas`);
    // Contados no LAB-143: mais de 300 (as três pastas, fora do `upstream/`).
    expect(codigo.length).toBeGreaterThanOrEqual(300);
    expect(codigo.some((f) => f.endsWith("esteira/ferramentas/lab50.ts"))).toBe(true);
    expect(codigo.some((f) => f.endsWith("testfit/ferramentas/medir.ts"))).toBe(true);
  });

  test("nenhum código escreve chave de comprimento ou área fora do metro", () => {
    const novas = [...achadasPorArquivo.entries()]
      .filter(([f, a]) => a.length > 0 && !(f in EXCECOES_NO_CODIGO))
      .map(([f, a]) => `${f}: ${a.map((x) => `${x.chave} (${x.onde})`).join(", ")}`);
    expect(novas, "a medição é em metros (§7): grave `_m`/`_m2`, e o hectare fica para a tela").toEqual([]);
  });

  test("as exceções têm exatamente as chaves declaradas, e nenhuma grava em `docs/provas/`", () => {
    for (const [f, e] of Object.entries(EXCECOES_NO_CODIGO)) {
      expect(achadasPorArquivo.has(f), `${f} não existe mais: tire-o da lista`).toBe(true);
      expect(porChave(achadasPorArquivo.get(f)!), f).toEqual(e.chaves);
      expect(readFileSync(join(RAIZ, f), "utf8"), `${f} passou a falar de docs/provas`).not.toMatch(
        /"provas"|docs\/provas/,
      );
      expect(e.motivo.length, `${f} sem motivo`).toBeGreaterThan(40);
    }
  });

  test("as duas ferramentas que gravavam hectare em prova gravam metro quadrado", () => {
    const lab50 = readFileSync(join(RAIZ, "external-engines/esteira/ferramentas/lab50.ts"), "utf8");
    const medir = readFileSync(join(RAIZ, "external-engines/testfit/ferramentas/medir.ts"), "utf8");
    expect(lab50).toMatch(/areaDaGleba_m2:/);
    expect(medir).toMatch(/area_m2: n2\(entrada\.gleba\.area_m2\)/);
  });
});

describe("§7 · a regra está escrita onde mora", () => {
  test("o `CLAUDE.md` diz que a medição é em metros", () => {
    expect(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8")).toContain("**Medição é em metros e em dados:**");
  });
});
