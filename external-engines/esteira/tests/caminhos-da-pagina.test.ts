/**
 * **LAB-99 (item 900) · todo caminho que o `CLAUDE.md` cita resolve da RAIZ.**
 *
 * ```sh
 * bun test tests/caminhos-da-pagina.test.ts
 * ```
 *
 * O enxugar do LAB-95 encurtou `external-engines/esteira/src/x.ts` para `src/x.ts`, e não há
 * `src/` na raiz: oito ponteiros da página não levavam a lugar nenhum, com todas as travas
 * verdes (D326). A régua mora em `src/caminhos-da-pagina.ts`.
 *
 * Lê só arquivos deste repositório — nenhum clone vizinho —, e por isso vai no trabalho de CI
 * que roda sem segredo.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { ANATOMIA_DO_MOTOR, type Arvore, citados, conferirOsCaminhos } from "../src/caminhos-da-pagina.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");

/** Todos os nomes de arquivo da árvore, sem `.git` nem `node_modules` (nem alvo de build). */
function nomesDaArvore(): Set<string> {
  const nomes = new Set<string>();
  const fora = new Set([".git", "node_modules", "target"]);
  const andar = (dir: string): void => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (fora.has(e.name)) continue;
      if (e.isDirectory()) andar(join(dir, e.name));
      else nomes.add(e.name);
    }
  };
  andar(RAIZ);
  return nomes;
}

const NOMES = nomesDaArvore();
const MOTORES = readdirSync(join(RAIZ, "external-engines")).filter((m) =>
  statSync(join(RAIZ, "external-engines", m)).isDirectory(),
);

const ARVORE_DE_VERDADE: Arvore = {
  existe: (c) => existsSync(join(RAIZ, c)),
  temONome: (n) => NOMES.has(n),
  algumMotorTem: (p) => MOTORES.some((m) => existsSync(join(RAIZ, "external-engines", m, p))),
};

/** Uma árvore de mentira, para a régua ser provada sem disco. */
function arvoreFalsa(caminhos: string[], nomes: string[], anatomia: string[]): Arvore {
  return {
    existe: (c) => caminhos.includes(c),
    temONome: (n) => nomes.includes(n),
    algumMotorTem: (p) => anatomia.includes(p),
  };
}
const ANATOMIA_INTEIRA = "`upstream/` `archilly/` `adapter/`";

describe("LAB-99 · a leitura — o que é caminho, o que é nome, o que fica fora", () => {
  test("separa caminho, nome e anatomia; extensão sozinha, molde e comando ficam fora", () => {
    const md =
      "`src/x.ts` `verde.yml` `upstream/` `.md` `docs/provas/<prompt>/` `git merge --no-ff` " +
      "`mcp__github__*` `null`\n```sh\n`dentro/do/bloco.ts`\n```";
    expect(citados(md)).toEqual([
      { trecho: "src/x.ts", especie: "caminho" },
      { trecho: "verde.yml", especie: "nome" },
      { trecho: "upstream/", especie: "anatomia" },
    ]);
  });

  test("a mesma citação duas vezes conta uma", () => {
    expect(citados("`a/b.ts` e de novo `a/b.ts`")).toHaveLength(1);
  });
});

describe("LAB-99 · a régua, dos dois lados", () => {
  test("LADO RUIM, o estado de antes: `src/…` que só existe dentro do pacote é REPROVADO", () => {
    const arvore = arvoreFalsa(
      ["external-engines/esteira/src/cobranca-por-uso.ts"],
      [],
      [...ANATOMIA_DO_MOTOR],
    );
    const { problemas } = conferirOsCaminhos(`\`src/cobranca-por-uso.ts\` ${ANATOMIA_INTEIRA}`, arvore);
    expect(problemas).toEqual(["caminho que não resolve da raiz: src/cobranca-por-uso.ts"]);
  });

  test("LADO BOM: o caminho inteiro passa", () => {
    const arvore = arvoreFalsa(
      ["external-engines/esteira/src/cobranca-por-uso.ts"],
      [],
      [...ANATOMIA_DO_MOTOR],
    );
    const md = `\`external-engines/esteira/src/cobranca-por-uso.ts\` ${ANATOMIA_INTEIRA}`;
    expect(conferirOsCaminhos(md, arvore)).toEqual({ lidos: 4, problemas: [] });
  });

  test("nome que nenhum arquivo tem é reprovado; nome que existe em qualquer pasta passa", () => {
    const arvore = arvoreFalsa([], ["verde.yml"], [...ANATOMIA_DO_MOTOR]);
    const { problemas } = conferirOsCaminhos(`\`verde.yml\` \`sumiu.json\` ${ANATOMIA_INTEIRA}`, arvore);
    expect(problemas).toEqual(["nome que nenhum arquivo tem: sumiu.json"]);
  });

  test("a exceção da anatomia, nos DOIS sentidos: nenhum motor a tem, ou a página não a cita", () => {
    const semMotor = arvoreFalsa([], [], ["upstream/", "archilly/"]);
    expect(conferirOsCaminhos(ANATOMIA_INTEIRA, semMotor).problemas).toEqual([
      "anatomia declarada que nenhum motor tem: adapter/",
    ]);
    const comTudo = arvoreFalsa([], [], [...ANATOMIA_DO_MOTOR]);
    expect(conferirOsCaminhos("`upstream/` `archilly/`", comTudo).problemas).toEqual([
      "anatomia declarada que a página não cita: adapter/",
    ]);
  });

  test("`./` na frente não muda o caminho", () => {
    const arvore = arvoreFalsa(["external-engines/conferir.sh"], [], [...ANATOMIA_DO_MOTOR]);
    const md = `\`./external-engines/conferir.sh\` ${ANATOMIA_INTEIRA}`;
    expect(conferirOsCaminhos(md, arvore).problemas).toEqual([]);
  });
});

describe("LAB-99 · o CLAUDE.md de hoje", () => {
  test("todo caminho, nome e anatomia que a página cita existe — e o universo lido vai junto", () => {
    const { lidos, problemas } = conferirOsCaminhos(claudeMd, ARVORE_DE_VERDADE);
    expect(problemas).toEqual([]);
    // Universo que encolhe a nada é régua que parou de ler (§2.7 da direção). Em 13/10/2026 a
    // página cita 33 trechos desta espécie (23 caminhos, 7 nomes, 3 da anatomia); o piso é
    // largo de propósito, só para pegar o zero.
    expect(lidos).toBeGreaterThanOrEqual(20);
  });
});
