/**
 * **LAB-167 (item 900) · o Lab não adota a Central — a página pergunta ao código** (D395).
 *
 * ```sh
 * bun test tests/a-adocao-da-central.test.ts
 * ```
 *
 * O `docs/ADOCAO_CENTRAL.md` (LF-FINAL, 14/09/2026) afirmava seis estados e nenhum código o lia; um deles (*"não há
 * tela"*) era falso desde antes de a página nascer, e outro (*"o vendor do Generate não tem código"*) ficou falso
 * depois. O motivo inteiro está no cabeçalho de `src/a-adocao-da-central.ts`.
 *
 * Este arquivo é a **pergunta 1** (o Lab não importa, não depende, só as duas declarações, a página aponta) e a prova
 * do instrumento do fecho sobre uma árvore montada aqui. Roda **sem clones**, e por isso está no portão sem clones do
 * `verde.yml`. A pergunta 2 sobre os clones de verdade mora em `a-adocao-da-central-com-clone.test.ts`.
 *
 * O nome do pacote vai **em pedaços** nas árvores plantadas: escrito inteiro numa importação de verdade, este teste
 * seria o achado que ele procura.
 */
import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import {
  AS_DECLARACOES,
  A_PAGINA,
  A_PAGINA_APONTA,
  O_PACOTE,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirOLab,
  conferirOsTextosDoLab,
  declaraOPacote,
  fechoDeImportacoes,
  importacoesDe,
  type TipoDeProblema,
} from "../src/a-adocao-da-central.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const P = ["@archilly", "/central"].join("");

describe("LAB-167 · a árvore de verdade: o Lab não adota a Central", () => {
  const r = conferirOLab(RAIZ);

  test("o universo é publicado, e não é zero", () => {
    console.log(
      `    ${r.codigos} códigos · ${r.importacoes} importações · ${r.pacotes} package.json · ` +
        `${r.declaracoes.length} declarações do pacote · ${A_PAGINA_APONTA.length} travas apontadas · ${r.problemas.length} problemas`,
    );
    // Contados no LAB-167, em 18/10/2026 : 365 códigos antes dos três arquivos dele (368 com eles), 2 package.json.
    expect(r.codigos).toBeGreaterThanOrEqual(300);
    expect(r.importacoes).toBeGreaterThanOrEqual(1000);
    expect(r.pacotes).toBeGreaterThanOrEqual(2);
  });

  test("nenhum problema: ninguém importa, ninguém depende, só as duas declarações, e a página aponta", () => {
    expect(r.problemas).toEqual([]);
    expect([...r.declaracoes].sort()).toEqual([...AS_DECLARACOES].sort());
  });

  test("a constante e a página falam do mesmo pacote", () => {
    expect(O_PACOTE).toBe(P);
  });
});

// ── a régua, dos dois lados ─────────────────────────────────────────────────

const DECL = `/** fronteira */\ndeclare module "${P}" {\n  const x: unknown;\n  export default x;\n}\n`;
const PAGINA_BOA = `# ADOÇÃO\n\n${A_PAGINA_APONTA.map((a) => `- \`${a.arquivo}\``).join("\n")}\n`;

function arvoreBoa(): Map<string, string> {
  return new Map<string, string>([
    ["external-engines/esteira/src/qualquer.ts", `import { x } from "./outro.ts";\nexport const y = x;\n`],
    ["external-engines/esteira/package.json", JSON.stringify({ name: "esteira", dependencies: { zod: "^3" } })],
    ["external-engines/testfit/package.json", JSON.stringify({ name: "testfit", devDependencies: { typescript: "^5" } })],
    [AS_DECLARACOES[0]!, DECL],
    [AS_DECLARACOES[1]!, DECL],
    [A_PAGINA, PAGINA_BOA],
  ]);
}
const sempre = () => true;
const tipos = (m: Map<string, string>, existe: (c: string) => boolean = sempre): TipoDeProblema[] =>
  conferirOsTextosDoLab(m, existe).problemas.map((p) => p.tipo);

describe("LAB-167 · a pergunta 1 aprova o caso bom", () => {
  test("a árvore boa passa sem problema", () => {
    expect(tipos(arvoreBoa())).toEqual([]);
  });

  test("o caso que quase parece inválido: o pacote em comentário, em texto e em template não é importação", () => {
    const m = arvoreBoa();
    m.set(
      "external-engines/esteira/src/fala.ts",
      `// import { a } from "${P}";\nconst t = 'import "${P}"';\nconst u = \`declare module "${P}" {}\`;\nexport { t, u };\n`,
    );
    expect(tipos(m)).toEqual([]);
  });

  test("dentro de `upstream/` está fora do universo, dito no módulo", () => {
    const m = arvoreBoa();
    m.set("external-engines/symbios/upstream/x.ts", `import "${P}";\n`);
    expect(tipos(m)).toEqual([]);
  });
});

describe("LAB-167 · a pergunta 1 reprova cada forma de adotar", () => {
  const formas: [string, string][] = [
    ["import de valor", `import { coresDeDominio } from "${P}";\nexport const c = coresDeDominio;\n`],
    ["import só de tipo", `import type { X } from "${P}/react";\nexport type Y = X;\n`],
    ["nomes todos marcados type", `import { type X } from "${P}";\nexport type Y = X;\n`],
    ["export … from", `export { a } from "${P}/local";\n`],
    ["export * from", `export * from "${P}";\n`],
    ["import()", `export const m = () => import("${P}");\n`],
    ["require", `const k = require("${P}");\nexport { k };\n`],
    ["typeof import() num tipo", `export type K = typeof import("${P}");\n`],
    ["efeito colateral", `import "${P}";\n`],
  ];
  for (const [nome, texto] of formas) {
    test(nome, () => {
      const m = arvoreBoa();
      m.set("external-engines/esteira/src/adota.ts", texto);
      expect(tipos(m)).toEqual(["importa-o-pacote"]);
    });
  }

  test("num `.mjs` da bancada também", () => {
    const m = arvoreBoa();
    m.set("external-engines/symbios/adapter/ferramentas/x.mjs", `import k from "${P}";\nexport default k;\n`);
    expect(tipos(m)).toEqual(["importa-o-pacote"]);
  });

  for (const especie of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
    test(`dependência em ${especie}`, () => {
      const m = arvoreBoa();
      m.set("external-engines/testfit/package.json", JSON.stringify({ name: "testfit", [especie]: { [P]: "file:x" } }));
      expect(tipos(m)).toEqual(["depende-do-pacote"]);
    });
  }

  test("uma terceira declaração do pacote", () => {
    const m = arvoreBoa();
    m.set("external-engines/symbios/adapter/src/central.d.ts", DECL);
    expect(tipos(m)).toEqual(["declaracao-fora-do-lugar"]);
  });

  test("uma das duas declarações sumiu", () => {
    const m = arvoreBoa();
    m.delete(AS_DECLARACOES[1]!);
    expect(tipos(m)).toEqual(["declaracao-que-sumiu"]);
  });

  test("as duas declarações divergiram", () => {
    const m = arvoreBoa();
    m.set(AS_DECLARACOES[1]!, `${DECL}// uma linha a mais\n`);
    expect(tipos(m)).toEqual(["declaracoes-diferentes"]);
  });

  test("a página deixou de apontar uma trava", () => {
    const m = arvoreBoa();
    m.set(A_PAGINA, PAGINA_BOA.replace(A_PAGINA_APONTA[1]!.arquivo, "outra-coisa.ts"));
    expect(tipos(m)).toEqual(["pagina-nao-aponta"]);
  });

  test("a trava apontada não existe no disco", () => {
    const alvo = A_PAGINA_APONTA[2]!.arquivo;
    expect(tipos(arvoreBoa(), (c) => c !== alvo)).toEqual(["trava-apontada-nao-existe"]);
  });

  test("a página sumiu", () => {
    const m = arvoreBoa();
    m.delete(A_PAGINA);
    expect(tipos(m)).toEqual(["pagina-ausente"]);
  });

  test("universo vazio reprova, não passa calado", () => {
    expect(tipos(new Map([[A_PAGINA, PAGINA_BOA]]))).toContain("universo-vazio");
  });
});

describe("LAB-167 · a leitura das importações", () => {
  test("separa valor de tipo, e diz a linha", () => {
    const imps = importacoesDe(
      "x.ts",
      `import type { A } from "a";\nimport { type B, C } from "b";\nimport { type D } from "d";\nexport type { E } from "e";\n`,
    );
    expect(imps.map((i) => [i.especificador, i.soTipo, i.linha])).toEqual([
      ["a", true, 1],
      ["b", false, 2],
      ["d", true, 3],
      ["e", true, 4],
    ]);
  });

  test("a declaração do pacote se reconhece pela árvore, não pelo texto", () => {
    expect(declaraOPacote("t.d.ts", DECL)).toBe(true);
    expect(declaraOPacote("t.ts", `const s = 'declare module "${P}" {}';\n`)).toBe(false);
  });
});

// ── o instrumento do fecho, sobre uma árvore montada aqui ───────────────────

function montar(arquivos: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "lab167-"));
  for (const [c, t] of Object.entries(arquivos)) {
    mkdirSync(dirname(join(dir, c)), { recursive: true });
    writeFileSync(join(dir, c), t);
  }
  return dir;
}

const TSCONFIG = JSON.stringify({
  compilerOptions: {
    module: "ESNext",
    moduleResolution: "bundler",
    allowImportingTsExtensions: true,
    noEmit: true,
    baseUrl: ".",
    paths: { "@vizinho/*": ["../../../vizinho/*"] },
  },
  include: ["src"],
});

describe("LAB-167 · o fecho de importações, dos dois lados", () => {
  test("acha o pacote no fim de uma cadeia de valor que atravessa o `paths`, e diz por onde veio", () => {
    const raiz = montar({
      "casa/motores/pacote/tsconfig.json": TSCONFIG,
      "casa/motores/pacote/src/a.ts": `import { b } from "./b.ts";\nexport const a = b;\n`,
      "casa/motores/pacote/src/b.ts": `import { c } from "@vizinho/c.ts";\nexport const b = c;\n`,
      "vizinho/c.ts": `import k from "${P}";\nexport const c = k;\n`,
    });
    try {
      const f = fechoDeImportacoes(join(raiz, "casa", "motores", "pacote"), false);
      expect(f.chegadas.map((c) => [c.arquivo.replace(/\\/g, "/"), c.especificador])).toEqual([["../vizinho/c.ts", P]]);
      expect(f.chegadas[0]!.via).toContain("b.ts");
      expect(f.deFora).toBe(1);
      expect(f.naoResolvidos).toEqual([]);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  test("a cadeia só de tipo não está no caminho de execução — e está no programa de tipos", () => {
    const raiz = montar({
      "casa/motores/pacote/tsconfig.json": TSCONFIG,
      "casa/motores/pacote/src/a.ts": `import type { T } from "@vizinho/tipos.ts";\nexport const a: T | null = null;\n`,
      "vizinho/tipos.ts": `import { cor } from "./cores.ts";\nexport type T = typeof cor;\n`,
      "vizinho/cores.ts": `import { coresDeDominio } from "${P}";\nexport const cor = coresDeDominio;\n`,
    });
    try {
      expect(fechoDeImportacoes(join(raiz, "casa", "motores", "pacote"), false).chegadas).toEqual([]);
      expect(fechoDeImportacoes(join(raiz, "casa", "motores", "pacote"), true).chegadas.map((c) => c.arquivo)).toEqual([
        "../vizinho/cores.ts",
      ]);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  test("o caminho de `paths` que não resolve é publicado, não engolido", () => {
    const raiz = montar({
      "casa/motores/pacote/tsconfig.json": TSCONFIG,
      "casa/motores/pacote/src/a.ts": `import { x } from "@vizinho/nao-existe.ts";\nexport const a = x;\n`,
    });
    try {
      expect(fechoDeImportacoes(join(raiz, "casa", "motores", "pacote"), false).naoResolvidos).toHaveLength(1);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });
});

describe("LAB-167 · o que esta trava não alcança, dito", () => {
  test("a lista existe e cada linha diz o porquê", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    for (const l of O_QUE_ISTO_NAO_ALCANCA) expect(l).toContain(":");
  });
});
