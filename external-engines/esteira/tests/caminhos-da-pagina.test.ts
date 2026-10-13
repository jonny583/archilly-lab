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

import {
  ANATOMIA_DO_MOTOR,
  type Arvore,
  PAGINAS_VIVAS,
  citados,
  conferirAsLigacoes,
  conferirOsCaminhos,
  ligacoes,
  resolverDaPagina,
} from "../src/caminhos-da-pagina.ts";

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

// ─────────────────────────────────────────────────────────────────────────────────────────────
// LAB-100 (item 900) · as LIGAÇÕES das páginas vivas resolvem da pasta da página (D327)
// ─────────────────────────────────────────────────────────────────────────────────────────────

const existeDaRaiz = (c: string): boolean => existsSync(join(RAIZ, c));

describe("LAB-100 · a leitura das ligações", () => {
  test("tira âncora e título, deixa fora esquema, bloco cercado e o que está entre crases", () => {
    const md =
      '[a](relatorios/A.md#secao) [b](https://x.y) [c](mailto:z@w) [d](#so-ancora) ' +
      '[e](<com espaco.md>) [f](g.md "titulo") `[nao](dentro.md)`\n```\n[nem](bloco.md)\n```';
    expect(ligacoes(md)).toEqual(["relatorios/A.md", "g.md"]);
  });

  test("resolve da pasta da página, decodifica `%20`, e recusa subir acima da raiz", () => {
    expect(resolverDaPagina("docs/INDEX.md", "relatorios/LAB-99.md")).toBe("docs/relatorios/LAB-99.md");
    expect(resolverDaPagina("docs/prompts/FILA.md", "../relatorios/x.md")).toBe("docs/relatorios/x.md");
    expect(resolverDaPagina("docs/INDEX.md", "../CLAUDE.md")).toBe("CLAUDE.md");
    expect(resolverDaPagina("docs/INDEX.md", "a%20b.md")).toBe("docs/a b.md");
    expect(resolverDaPagina("CLAUDE.md", "../fora.md")).toBeNull();
  });
});

describe("LAB-100 · a régua das ligações, dos dois lados", () => {
  const arvore = (cs: string[]) => (c: string) => cs.includes(c);

  test("LADO BOM: alvo que existe a partir da pasta da página passa, e o universo vem junto", () => {
    const r = conferirAsLigacoes("docs/INDEX.md", "[x](relatorios/A.md) [y](../CLAUDE.md)", arvore([
      "docs/relatorios/A.md",
      "CLAUDE.md",
    ]));
    expect(r).toEqual({ lidas: 2, problemas: [] });
  });

  test("LADO RUIM: o mesmo alvo lido DA RAIZ não serve — a ligação é da pasta da página", () => {
    // `relatorios/A.md` existe na raiz e não em `docs/`: quem segue no GitHub cai em `docs/…`.
    const r = conferirAsLigacoes("docs/INDEX.md", "[x](relatorios/A.md)", arvore(["relatorios/A.md"]));
    expect(r.problemas).toEqual(["docs/INDEX.md: ligação que não leva a nada: relatorios/A.md"]);
  });

  test("LADO RUIM: alvo que sobe acima da raiz é reprovado pelo nome do defeito", () => {
    const r = conferirAsLigacoes("CLAUDE.md", "[x](../vizinho/README.md)", arvore([]));
    expect(r.problemas).toEqual(["CLAUDE.md: ligação que sobe acima da raiz: ../vizinho/README.md"]);
  });

  test("SABOTAGEM no INDEX de verdade: um alvo com um caractere trocado reprova, e só ele", () => {
    const indice = readFileSync(join(RAIZ, "docs/INDEX.md"), "utf8");
    expect(indice).toContain("](relatorios/LAB-99.md)");
    const sabotado = indice.replace("](relatorios/LAB-99.md)", "](relatorios/LAB-9.md)");
    expect(conferirAsLigacoes("docs/INDEX.md", sabotado, existeDaRaiz).problemas).toEqual([
      "docs/INDEX.md: ligação que não leva a nada: relatorios/LAB-9.md",
    ]);
  });
});

describe("LAB-100 · as cinco páginas vivas de hoje", () => {
  test("a lista é a do `CLAUDE.md` §7 — as quatro que ele manda manter em dia, e ele mesmo", () => {
    const frase = /`docs\/DECISOES\.md`, `FILA\.md`, `ONDE_PARAMOS\.md` e `INDEX\.md` em dia/;
    expect(claudeMd).toMatch(frase);
    const nomes = PAGINAS_VIVAS.map((p) => p.split("/").at(-1));
    expect(nomes.sort()).toEqual(["CLAUDE.md", "DECISOES.md", "FILA.md", "INDEX.md", "ONDE_PARAMOS.md"]);
    for (const p of PAGINAS_VIVAS) expect(existsSync(join(RAIZ, p))).toBe(true);
  });

  for (const pagina of PAGINAS_VIVAS) {
    test(`toda ligação de \`${pagina}\` leva a um arquivo ou pasta que existe`, () => {
      const { lidas, problemas } = conferirAsLigacoes(pagina, readFileSync(join(RAIZ, pagina), "utf8"), existeDaRaiz);
      expect(problemas).toEqual([]);
      // Piso só para pegar o zero (régua que parou de ler). Em 13/10/2026: CLAUDE 5, INDEX 144,
      // ONDE_PARAMOS 49, FILA 100, DECISOES 11 — o piso é o da menor, largo de propósito.
      expect(lidas).toBeGreaterThanOrEqual(3);
    });
  }
});
