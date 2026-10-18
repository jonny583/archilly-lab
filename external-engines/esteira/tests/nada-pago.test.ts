/**
 * §4-A · *"NÃO HÁ NADA PAGO NESTE REPOSITÓRIO HOJE"* — A FRASE PERGUNTA À ÁRVORE. (LAB-148, item 900, a dívida
 * própria, D376)
 *
 * ```sh
 * bun test tests/nada-pago.test.ts
 * ```
 *
 * Até aqui a frase só era conferida como TEXTO (`custo-por-uso.test.ts`: `toContain`). Agora as cinco portas por onde
 * uma coisa paga entra na árvore — dependência, variável de ambiente, endereço, segredo da rotina, ação e máquina da
 * rotina — são lidas, e cada porta achada tem classe e motivo (`src/nada-pago.ts`). **Os dois lados, nesta ordem:** a
 * casa de hoje passa; e cada jeito de pôr uma coisa paga reprova. Lê só arquivo deste repositório: entra no trabalho
 * sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_FRASE,
  O_QUE_ISTO_NAO_ALCANCA,
  PORTAS,
  PORTAS_DECLARADAS,
  type Arquivo,
  conferirNadaPago,
  lerAsPortas,
} from "../src/nada-pago.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CLAUDE = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");

const arvore = (): Arquivo[] =>
  execFileSync("git", ["-C", RAIZ, "ls-files"], { encoding: "utf8" })
    .split("\n")
    .filter((c) => /\.(ts|tsx|js|mjs|cjs|rs|html|sh|bash|ya?ml)$|(^|\/)package\.json$|(^|\/)Cargo\.toml$/.test(c))
    .map((caminho) => ({ caminho, texto: readFileSync(join(RAIZ, caminho), "utf8") }));

// As formas ruins se montam por pedaços: a varredura de segredos e a de custo leem o texto deste arquivo inteiro.
const SDK = "open" + "ai";
const CHAVE = "OPENAI" + "_API_" + "KEY";
const HOST = "api." + "servico-pago" + ".example";
const MAQUINA = "ubuntu-latest" + "-16-cores";

const tipos = (arquivos: Arquivo[], claude = CLAUDE, declaradas = PORTAS_DECLARADAS) =>
  conferirNadaPago(arquivos, claude, declaradas).problemas.map((p) => p.tipo);

describe("§4-A · a casa de hoje", () => {
  test("a árvore passa: toda porta achada está declarada, nenhuma é paga, e a frase está escrita", () => {
    const r = conferirNadaPago(arvore(), CLAUDE);
    expect(r.problemas).toEqual([]);
    expect(r.pagas).toEqual([]);
    expect(CLAUDE.toLowerCase()).toContain(A_FRASE);
  });

  test("cada porta leu arquivo, e o universo tem o tamanho medido no LAB-148 (33 portas), mais o endereço da bancada no celular (LAB-182) e o registro das crates (LAB-185)", () => {
    const { achadas, lidos } = lerAsPortas(arvore());
    for (const p of PORTAS) expect(lidos[p], p).toBeGreaterThan(0);
    expect(achadas).toHaveLength(Object.keys(PORTAS_DECLARADAS).length);
    expect(achadas).toHaveLength(35);
  });

  test("a trava diz o que NÃO alcança, e o primeiro buraco é o que a §4-A já confessa: contratar fora da árvore", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
    expect(O_QUE_ISTO_NAO_ALCANCA[0]).toContain("fora da árvore");
  });
});

describe("§4-A · o lado bom que quase parece ruim", () => {
  test("endereço e variável em COMENTÁRIO não são porta", () => {
    const { achadas } = lerAsPortas([
      { caminho: "x/a.ts", texto: `// https://${HOST}/v1\n/* process.env.${CHAVE} */\nconst a = 1;\n` },
      { caminho: "x/b.sh", texto: `# curl https://${HOST}\necho ok\n` },
      { caminho: ".github/workflows/w.yml", texto: `jobs:\n  a:\n    # secrets.${CHAVE}\n    runs-on: ubuntu-latest\n` },
    ]);
    expect(achadas.map((a) => `${a.porta}:${a.nome}`)).toEqual(["acao-da-rotina:runs-on ubuntu-latest"]);
  });

  test("o `[[bench]]` do Cargo fecha a seção de dependências: o que vem depois não é dependência", () => {
    const { achadas } = lerAsPortas([
      { caminho: "c/Cargo.toml", texto: `[dependencies]\nglam = "0.32"\n\n[[bench]]\nname = "x"\nharness = false\n` },
    ]);
    expect(achadas.map((a) => a.nome)).toEqual(["glam"]);
  });

  test("a string bruta do Rust não esconde o endereço (a limpeza de JS a apagava)", () => {
    const { achadas } = lerAsPortas([
      { caminho: "r/e.rs", texto: `writeln!(w, r##"<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg">"##);\n// http://${HOST}\n` },
    ]);
    expect(achadas.map((a) => a.nome)).toEqual(["www.w3.org"]);
  });
});

describe("§4-A · cada jeito de pôr uma coisa paga reprova", () => {
  const somar = (extra: Arquivo) => [...arvore(), extra];

  test("um SDK de serviço pago no package.json", () => {
    const pkg = JSON.stringify({ name: "p", dependencies: { [SDK]: "^4.0.0" } });
    expect(tipos(somar({ caminho: "external-engines/esteira/plantado/package.json", texto: pkg }))).toEqual([
      "porta-nao-declarada",
    ]);
  });

  test("uma crate nova no Cargo.toml", () => {
    expect(tipos(somar({ caminho: "x/Cargo.toml", texto: `[dependencies]\nreqwest = "0.12"\n` }))).toEqual([
      "porta-nao-declarada",
    ]);
  });

  test("a chave de um serviço lida do ambiente, nas três escritas", () => {
    for (const t of [`process.env.${CHAVE}`, `process.env["${CHAVE}"]`, `Bun.env.${CHAVE}`]) {
      expect(tipos(somar({ caminho: "external-engines/esteira/src/plantado.ts", texto: `const k = ${t};\n` })), t).toEqual([
        "porta-nao-declarada",
      ]);
    }
  });

  test("uma chamada a um host novo", () => {
    const t = `await fetch("https://${HOST}/v1/estudos");\n`;
    expect(tipos(somar({ caminho: "external-engines/esteira/src/plantado.ts", texto: t }))).toEqual(["porta-nao-declarada"]);
  });

  test("uma máquina maior na rotina, e um segredo novo", () => {
    const w = `jobs:\n  a:\n    runs-on: ${MAQUINA}\n    env:\n      K: \${{ secrets.${CHAVE} }}\n`;
    const r = conferirNadaPago(somar({ caminho: ".github/workflows/plantada.yml", texto: w }), CLAUDE);
    expect(r.problemas.map((p) => p.chave).sort()).toEqual([`acao-da-rotina:runs-on ${MAQUINA}`, `segredo-da-rotina:${CHAVE}`]);
  });

  test("declarada como PAGA, a frase da §4-A passa a mentir; tirada a frase, passa", () => {
    const pkg = { caminho: "x/package.json", texto: JSON.stringify({ dependencies: { [SDK]: "^4" } }) };
    const declaradas = { ...PORTAS_DECLARADAS, [`dependencia:${SDK}`]: { classe: "pago" as const, motivo: "plantado: cobra por chamada, e é o caso que a frase não pode esconder" } };
    expect(tipos(somar(pkg), CLAUDE, declaradas)).toEqual(["a-frase-mente"]);
    const semAFrase = CLAUDE.replace(/não há nada pago neste repositório hoje/gi, "há uma fonte paga, declarada");
    expect(tipos(somar(pkg), semAFrase, declaradas)).toEqual([]);
  });

  test("sem nada pago, a frase não pode sumir", () => {
    const semAFrase = CLAUDE.replace(/não há nada pago neste repositório hoje/gi, "");
    expect(tipos(arvore(), semAFrase)).toEqual(["a-frase-sumiu"]);
  });
});

describe("§4-A · a lista fechada, nos dois sentidos", () => {
  test("porta declarada que sumiu da árvore sobra", () => {
    const sem = arvore().filter((a) => !a.caminho.endsWith("ferramentas/lab84.ts"));
    expect(tipos(sem)).toEqual(["declaracao-que-sobra"]);
  });

  test("motivo curto não vale", () => {
    const declaradas = { ...PORTAS_DECLARADAS, "dependencia:zod": { classe: "gratuito" as const, motivo: "grátis" } };
    expect(tipos(arvore(), CLAUDE, declaradas)).toEqual(["declaracao-sem-motivo"]);
  });

  test("régua que não leu nada não sai verde", () => {
    const t = tipos([], CLAUDE, {});
    expect(t.filter((x) => x === "universo-vazio")).toHaveLength(PORTAS.length + 1);
  });
});
