/**
 * **LAB-135 (item 900) · `adapter/` é a única fronteira — a régua, nos dois lados** (D363).
 *
 * ```sh
 * bun test tests/adapter-unica-fronteira.test.ts
 * ```
 *
 * Roda **sem clones**: a régua só lê o código e os `tsconfig.json` DESTE repositório (`git
 * ls-files`), e resolver um apelido é aritmética de caminho — o clone não precisa existir para se
 * saber que `@testfit/api.ts` aponta para ele. Por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  CLONES_QUE_NAO_SAO_MOTOR,
  MOTORES_DE_FORA,
  conferirAFronteira,
  configuracaoDe,
  especificadores,
  type Arquivo,
  type Configuracao,
} from "../src/adapter-unica-fronteira.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** Os dois `tsconfig` de hoje, só com o que a régua lê. */
const CONFIGS: Configuracao[] = [
  {
    pasta: "external-engines/esteira",
    baseUrl: ".",
    paths: {
      "@testfit/*": ["../../../motor-testfit/src/lib/lab/*"],
      "@generate/*": ["../../../urban-create-hub-41d93a4d/src/lib/*"],
      "@/*": ["../../../urban-create-hub-41d93a4d/src/*"],
      "@symbios/*": ["../symbios/adapter/src/*"],
    },
  },
  {
    pasta: "external-engines/testfit",
    baseUrl: ".",
    paths: { "@testfit/*": ["../../../motor-testfit/src/lib/lab/*"] },
  },
];

/** Uma casa de mentira, limpa: a porta do motor no adaptador, e todo o resto passando por ela. */
function casa(...trocas: Arquivo[]): Arquivo[] {
  const base: Arquivo[] = [
    { caminho: "external-engines/testfit/adapter/src/motor.ts", texto: 'export { rodarMotor } from "@testfit/api.ts";\n' },
    { caminho: "external-engines/testfit/adapter/src/ida.ts", texto: 'import type { Terreno } from "@testfit/tipos.ts";\nexport type T = Terreno;\n' },
    { caminho: "external-engines/esteira/src/porta.ts", texto: 'import { rodarMotor } from "../../testfit/adapter/src/motor.ts";\nimport { Motor } from "@symbios/index.ts";\nimport { validar } from "@generate/engine/validator.ts";\nexport const p = [rodarMotor, Motor, validar];\n' },
    { caminho: "external-engines/symbios/adapter/src/motor.ts", texto: "export const carregar = (b: Uint8Array) => WebAssembly.compile(b);\n" },
    { caminho: "external-engines/symbios/archilly/probe-cgal-wasm/probe.mjs", texto: 'import "./outro.mjs";\n' },
    { caminho: "docs/relatorios/X.md", texto: 'import { rodarMotor } from "@testfit/api.ts";\n' },
  ];
  const porCaminho = new Map(base.map((a) => [a.caminho, a]));
  for (const t of trocas) porCaminho.set(t.caminho, t);
  return [...porCaminho.values()];
}
const tipos = (arquivos: Arquivo[], configs: Configuracao[] = CONFIGS) =>
  conferirAFronteira(arquivos, configs).problemas.map((p) => `${p.tipo} ${p.arquivo}`);

describe("LAB-135 · a regra e as tabelas, escritas", () => {
  test("a regra está escrita onde mora — o §3", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
  });

  test("toda raiz de clone termina em barra, e o clone que não é motor tem motivo", () => {
    for (const m of MOTORES_DE_FORA) expect(m.raiz).toMatch(/^\.\.\/[^/]+\/$/);
    for (const n of CLONES_QUE_NAO_SAO_MOTOR) {
      expect(n.raiz).toMatch(/^\.\.\/[^/]+\/$/);
      expect(n.motivo.length, n.raiz).toBeGreaterThan(40);
    }
  });

  test("o especificador sai COM o tipo, com o `export … from`, o `import()` e o `require`, e sem o comentário", () => {
    const texto =
      '// import "@testfit/comentario.ts";\n' +
      'import type { A } from "@testfit/a.ts";\n' +
      'export { b } from "@testfit/b.ts";\n' +
      'export type { C } from "@testfit/c.ts";\n' +
      'const d = await import("@testfit/d.ts");\n' +
      'const e = require("@testfit/e.ts");\n';
    expect(especificadores(texto).sort()).toEqual(
      ["@testfit/a.ts", "@testfit/b.ts", "@testfit/c.ts", "@testfit/d.ts", "@testfit/e.ts"].sort(),
    );
  });
});

describe("LAB-135 · o caso bom, e os que quase parecem ruins", () => {
  test("a casa de mentira, limpa → nada", () => {
    expect(tipos(casa())).toEqual([]);
  });

  test("o adaptador importando o PRÓPRIO motor, até por `import type` → nada", () => {
    const volta = { caminho: "external-engines/testfit/adapter/src/volta.ts", texto: 'import { area } from "@testfit/geo.ts";\nimport type { P } from "@testfit/tipos.ts";\nexport const v = area;\n' };
    expect(tipos(casa(volta))).toEqual([]);
  });

  test("o motor citado só em COMENTÁRIO fora do adaptador → nada", () => {
    const c = { caminho: "external-engines/esteira/src/b.ts", texto: '// antes: import { x } from "@testfit/api.ts"\nexport const b = 1;\n' };
    expect(tipos(casa(c))).toEqual([]);
  });

  test("o Generate e o adaptador do Symbios importados pela esteira → nada (juiz e adaptador não são motor)", () => {
    const g = { caminho: "external-engines/esteira/src/juiz.ts", texto: 'import { julgar } from "@/lib/engine/judge.ts";\nimport { geo } from "@symbios/geo.ts";\nexport const j = [julgar, geo];\n' };
    expect(tipos(casa(g))).toEqual([]);
  });

  test("o motor do Symbios importando a si mesmo, dentro do `archilly/` → nada", () => {
    const m = { caminho: "external-engines/symbios/archilly/wasm-probe/x.ts", texto: 'import "../probe/y.ts";\n' };
    expect(tipos(casa(m))).toEqual([]);
  });
});

describe("LAB-135 · as mutações medidas antes da régua, replantadas", () => {
  test("um `src/` da esteira importando `@testfit/api.ts` → reprova, e diz o especificador", () => {
    const a = { caminho: "external-engines/esteira/src/mutacao-a.ts", texto: 'import { impressao } from "@testfit/api.ts";\nexport const m = impressao;\n' };
    const r = conferirAFronteira(casa(a), CONFIGS);
    expect(r.problemas.map((p) => `${p.tipo} ${p.arquivo}`)).toEqual(["importa-o-motor external-engines/esteira/src/mutacao-a.ts"]);
    expect(r.problemas[0]!.detalhe).toBe("@testfit/api.ts (motor testfit)");
  });

  test("o motor por caminho relativo ao clone (o que o D16 proíbe) → reprova", () => {
    const b = { caminho: "external-engines/esteira/src/mutacao-b.ts", texto: 'import { rodarMotor } from "../../../../motor-testfit/src/lib/lab/api.ts";\nexport const m = rodarMotor;\n' };
    expect(tipos(casa(b))).toEqual(["importa-o-motor external-engines/esteira/src/mutacao-b.ts"]);
  });
});

describe("LAB-135 · a régua nos dois lados", () => {
  test("`import type` do motor fora do adaptador → reprova (tipo também obriga a mexer)", () => {
    const t = { caminho: "external-engines/esteira/tests/x.test.ts", texto: 'import type { Plano } from "@testfit/tipos.ts";\nexport type P = Plano;\n' };
    expect(tipos(casa(t))).toEqual(["importa-o-motor external-engines/esteira/tests/x.test.ts"]);
  });

  test("o teste e a ferramenta DO PRÓPRIO pacote, fora do `adapter/` → reprovam", () => {
    const t = { caminho: "external-engines/testfit/tests/esteira.test.ts", texto: 'import { rodarMotor } from "@testfit/api.ts";\n' };
    const f = { caminho: "external-engines/testfit/ferramentas/medir.ts", texto: 'const m = await import("@testfit/geo.ts");\n' };
    expect(tipos(casa(t, f))).toEqual([
      "importa-o-motor external-engines/testfit/tests/esteira.test.ts",
      "importa-o-motor external-engines/testfit/ferramentas/medir.ts",
    ]);
  });

  test("a esteira lendo o `upstream/` ou o `archilly/` do Symbios por caminho → reprova", () => {
    const u = { caminho: "external-engines/esteira/src/u.ts", texto: 'import "../../symbios/upstream/x.ts";\nimport "../../symbios/archilly/wasm/y.ts";\n' };
    expect(tipos(casa(u))).toEqual(["importa-o-motor external-engines/esteira/src/u.ts", "importa-o-motor external-engines/esteira/src/u.ts"]);
  });

  test("o adaptador de UM motor importando OUTRO → reprova", () => {
    const s = { caminho: "external-engines/symbios/adapter/src/emprestado.ts", texto: 'import { area } from "../../../../../motor-testfit/src/lib/lab/geo.ts";\nexport const a = area;\n' };
    expect(tipos(casa(s))).toEqual(["importa-outro-motor external-engines/symbios/adapter/src/emprestado.ts"]);
  });

  test("um apelido novo para um clone sem dono → reprova no `tsconfig`", () => {
    const novo = [...CONFIGS, { pasta: "external-engines/outro", baseUrl: ".", paths: { "@geo/*": ["../../../urban-scout-tool/src/*"] } }];
    expect(tipos(casa(), novo)).toEqual(["apelido-sem-dono external-engines/outro/tsconfig.json"]);
  });

  test("o adaptador deixando de importar o motor de fora → reprova a tabela velha", () => {
    const vazio = { caminho: "external-engines/testfit/adapter/src/motor.ts", texto: "export const nada = 1;\n" };
    const ida = { caminho: "external-engines/testfit/adapter/src/ida.ts", texto: "export const i = 1;\n" };
    expect(tipos(casa(vazio, ida))).toEqual(["motor-de-fora-sem-uso external-engines/testfit/adapter/"]);
  });

  test("universo vazio não aprova (D213)", () => {
    expect(tipos([], CONFIGS)).toEqual(["universo-vazio (o repositório)"]);
    expect(tipos(casa(), [])[0]).toBe("universo-vazio (o repositório)");
  });

  test("o `tsconfig` mais FUNDO governa o arquivo — o da raiz não o absolve", () => {
    const raso: Configuracao = { pasta: "external-engines", baseUrl: ".", paths: { "@testfit/*": ["./testfit/adapter/src/*"] } };
    const a = { caminho: "external-engines/esteira/src/a.ts", texto: 'import { rodarMotor } from "@testfit/api.ts";\n' };
    expect(tipos(casa(a), [raso, ...CONFIGS])).toEqual(["importa-o-motor external-engines/esteira/src/a.ts"]);
  });

  test("o `baseUrl` entra na conta do apelido", () => {
    const comBase: Configuracao = { pasta: "external-engines/esteira", baseUrl: "./src", paths: { "@m/*": ["../../../../motor-testfit/src/lib/lab/*"] } };
    const a = { caminho: "external-engines/esteira/src/a.ts", texto: 'import { rodarMotor } from "@m/api.ts";\n' };
    expect(tipos(casa(a), [comBase, CONFIGS[1]!])).toEqual(["importa-o-motor external-engines/esteira/src/a.ts"]);
  });

  test("o universo é `external-engines/`: o `entrega/` tem a trava dele (LAB-06) e não entra na conta", () => {
    const fora = { caminho: "entrega/x.ts", texto: 'import "../../motor-testfit/src/lib/lab/api.ts";\n' };
    expect(conferirAFronteira(casa(fora), CONFIGS)).toEqual(conferirAFronteira(casa(), CONFIGS));
  });

  test("o `tsconfig` com comentário se lê como o `tsc` lê", () => {
    const c = configuracaoDe("p", '{\n  // um comentário\n  "compilerOptions": { "baseUrl": ".", "paths": { "@x/*": ["../y/*"] } }\n}');
    expect(c).toEqual({ pasta: "p", baseUrl: ".", paths: { "@x/*": ["../y/*"] } });
  });
});

describe("LAB-135 · a árvore de hoje", () => {
  const lista = execFileSync("git", ["ls-files", "external-engines"], { cwd: RAIZ, encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
  const arquivos = lista
    .filter((c) => /\.(ts|tsx|js|jsx|mjs|cjs|mts|cts)$/.test(c))
    .map((c) => ({ caminho: c, texto: readFileSync(join(RAIZ, c), "utf8") }));
  const configs = lista
    .filter((c) => /(^|\/)tsconfig\.json$/.test(c))
    .map((c) => configuracaoDe(c.replace(/\/tsconfig\.json$/, ""), readFileSync(join(RAIZ, c), "utf8")));

  test("nenhum arquivo fora de um `adapter/` importa um motor — e o universo lido é publicado", () => {
    const r = conferirAFronteira(arquivos, configs);
    expect(r.problemas).toEqual([]);
    // Medido no LAB-135: 297 códigos, 2 tsconfig, mais de mil especificadores. O piso pega o
    // universo encolhendo em silêncio; o número exato mora na prova, não aqui.
    expect(r.codigos).toBeGreaterThan(250);
    expect(r.configuracoes).toBe(2);
    expect(r.importacoes).toBeGreaterThan(1000);
  });

  test("a porta do motor existe no adaptador, e é por ela que a esteira entra", () => {
    expect(arquivos.some((a) => a.caminho === "external-engines/testfit/adapter/src/motor.ts")).toBe(true);
    const porta = arquivos.find((a) => a.caminho === "external-engines/esteira/src/porta/motores.ts")!;
    expect(especificadores(porta.texto)).toContain("../../../testfit/adapter/src/motor.ts");
  });
});
