/**
 * **LAB-183 (item 900) · nada de exportar motor ou código ao usuário — perguntado pela porta, a cada verde** (D411).
 *
 * ```sh
 * bun test tests/nada-se-exporta.test.ts
 * ```
 *
 * A linha do `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026), só que *"o Lab não tem usuário nem exportação"*.
 * O repositório é público e lê vizinhos privados: o que sai daqui sai para o mundo. O motivo inteiro está no cabeçalho
 * de `src/nada-se-exporta.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 *
 * As plantas que parecem publicação vão dentro de strings deste teste, e o `.wasm` em base64 é montado em pedaços — por
 * isso este arquivo não é, ele mesmo, um achado da régua (e o teste da árvore de verdade confere isso a cada verde).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_PORTAS,
  AS_VIZINHAS,
  A_FRASE_ANTIGA,
  A_LINHA,
  A_PAGINA,
  A_SECAO,
  FORMATOS_DE_DOCS,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  WASM_EM_BASE64,
  cargoNaoPublica,
  conferir,
  conferirAArvore,
  conferirOsArquivos,
  oQueARotinaPublica,
} from "../src/nada-se-exporta.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** Uma árvore mínima que passa: um pacote de cada língua sem publicação, uma rotina que só testa, e `docs/` nos formatos. */
const BASE: Record<string, string> = {
  "external-engines/esteira/package.json": JSON.stringify({
    name: "x",
    private: true,
  }),
  "external-engines/symbios/archilly/wasm/Cargo.toml":
    '[package]\nname = "x"\npublish = false\n\n[dependencies]\nglam = "0.32"\n',
  "external-engines/symbios/upstream/Cargo.toml":
    '[package]\nname = "symbios-tensor"\nversion = "0.4.0"\n',
  ".github/workflows/verde.yml":
    "jobs:\n  a:\n    steps:\n      - uses: actions/checkout@v4\n      - run: bun test\n",
  "external-engines/esteira/src/coisa.ts": "export const x = 1;\n",
  "docs/relatorios/LAB-1.md": "# x\n",
  "docs/provas/LAB-1/x.json": "{}\n",
  "docs/terrenos/a.geojson": "{}\n",
  "docs/provas/LAB-1/medir.txt": "ok\n",
};

const arvore = (extra: Record<string, string | Buffer | null> = {}) => {
  const m = new Map<string, string | Buffer | null>([
    ...Object.entries(BASE),
    ...Object.entries(extra),
  ]);
  return conferirOsArquivos([...m.keys()], (c) => {
    const v = m.get(c);
    if (v === null || v === undefined) return null;
    return typeof v === "string" ? Buffer.from(v) : v;
  });
};
const portas = (r: ReturnType<typeof arvore>) => r.achados.map((a) => a.porta);

/** Uma página boa, montada com os nomes que a régua exige. */
const paginaBoa = () =>
  [
    `${A_LINHA} ✅ | ${O_PONTEIRO} LAB-183 · ${AS_VIZINHAS.map((v) => `${v.trava} LAB-${v.desde}`).join(" · ")} · ${FORMATOS_DE_DOCS.map((f) => `\`${f}\``).join(" ")} |`,
    "",
    `${A_SECAO} · 18/10/2026`,
    "",
    "| porta | o que | achados |",
    "|---|---|---|",
    ...AS_PORTAS.map((p) => `| \`${p}\` | x | 0 |`),
    "",
  ].join("\n");
const modulosBons = Object.fromEntries(
  AS_VIZINHAS.map((v) => [v.trava, `/** (LAB-${v.desde}) */`]),
);

describe("LAB-183 · a árvore de hoje — nada exportável, a página em dia, e o universo publicado", () => {
  test("zero problemas, e cada porta leu alguma coisa", () => {
    const { resultado: r, problemas } = conferirAArvore(RAIZ);
    console.log(
      `[nada-se-exporta] ${r.caminhos} caminhos · ${r.lidos.packageJson} package.json · ${r.lidos.cargoToml} Cargo.toml · ${r.lidos.rotinas} rotina(s) · ${r.lidos.binario} lidos pelos bytes · ${r.lidos.docs} em docs/ (${Object.entries(
        r.formatosDeDocs,
      )
        .map(([k, n]) => `${n} ${k}`)
        .join(
          ", ",
        )}) · ${r.achados.length} achado(s) · ${problemas.length} problema(s)`,
    );
    expect(problemas).toEqual([]);
    // 831 caminhos, 2 package.json, 4 Cargo.toml fora do upstream, 1 rotina, 806 lidos pelos bytes e 349 em docs/, em
    // 18/10/2026, antes do commit do LAB-183. Se encolherem, a régua passou a ler menos — o vigia que não vigia nada (D164).
    expect(r.caminhos).toBeGreaterThanOrEqual(831);
    expect(r.lidos.packageJson).toBeGreaterThanOrEqual(2);
    expect(r.lidos.cargoToml).toBeGreaterThanOrEqual(4);
    expect(r.lidos.rotinas).toBeGreaterThanOrEqual(1);
    expect(r.lidos.binario).toBeGreaterThanOrEqual(806);
    expect(r.lidos.docs).toBeGreaterThanOrEqual(349);
  });

  test("a linha da página não diz mais a frase de 14/09 sozinha, e o que a trava não alcança está dito", () => {
    const pagina = readFileSync(join(RAIZ, A_PAGINA), "utf8");
    const linha = pagina.split("\n").find((l) => l.startsWith(A_LINHA));
    expect(linha).toBeDefined();
    expect(linha).not.toContain(A_FRASE_ANTIGA);
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(6);
  });
});

describe("LAB-183 · os dois lados da régua, na árvore", () => {
  test("o caso bom passa, e o upstream publicável não é da casa", () => {
    expect(arvore().achados).toEqual([]);
  });

  test("o que quase parece publicação e não é passa: comentário de YAML, a palavra em texto, o workspace", () => {
    const r = arvore({
      ".github/workflows/verde.yml":
        "# um dia: npm publish, gh release, actions/deploy-pages\njobs:\n  a:\n    steps:\n      - run: echo 'veja docs' # git push fica para o Jonny\n",
      "external-engines/esteira/src/nota.ts":
        'export const s = "publicar é proibido";\n',
      "Cargo.toml": '[workspace]\nmembers = ["a"]\n',
    });
    expect(r.achados).toEqual([]);
  });

  test("o pacote: package.json sem private, com private falso, ou que não é JSON; Cargo.toml sem publish = false", () => {
    for (const texto of [
      JSON.stringify({ name: "x" }),
      JSON.stringify({ private: false }),
      JSON.stringify({ private: "true" }),
      "{",
    ]) {
      expect(
        portas(arvore({ "external-engines/esteira/package.json": texto })),
        texto,
      ).toEqual(["pacote"]);
    }
    expect(
      portas(arvore({ "a/Cargo.toml": '[package]\nname = "a"\n' })),
    ).toEqual(["pacote"]);
    // O publish fora do [package] não vale, nem comentado.
    expect(
      cargoNaoPublica('[package]\nname = "a"\n[features]\npublish = false\n'),
    ).toBe(false);
    expect(cargoNaoPublica("[package]\n# publish = false\n")).toBe(false);
    expect(
      cargoNaoPublica('[package]\nname = "a"\npublish = false # nunca\n'),
    ).toBe(true);
    expect(cargoNaoPublica("[workspace]\n")).toBeNull();
  });

  test("a rotina: as ações que publicam e os comandos, em uses: e em run:", () => {
    const acoes = [
      "actions/upload-artifact@v4",
      "actions/deploy-pages@v4",
      "softprops/action-gh-release@v2",
      "peaceiris/actions-gh-pages@v4",
    ];
    for (const a of acoes)
      expect(
        oQueARotinaPublica(`      - uses: ${a}\n`).length,
        a,
      ).toBeGreaterThan(0);
    const comandos = [
      "npm publish",
      "bun publish --access public",
      "cargo publish",
      "gh release create v1",
      "npx wrangler deploy",
      "git push origin gh-pages",
    ];
    for (const c of comandos)
      expect(
        oQueARotinaPublica(`        run: ${c}\n`).length,
        c,
      ).toBeGreaterThan(0);
    expect(
      portas(
        arvore({
          ".github/workflows/x.yaml":
            "steps:\n  - uses: actions/upload-pages-artifact@v3\n",
        }),
      ),
    ).toEqual(["rotina"]);
    // O checkout e o setup não publicam.
    expect(
      oQueARotinaPublica(
        "  - uses: actions/checkout@v4\n  - uses: oven-sh/setup-bun@v2\n",
      ),
    ).toEqual([]);
  });

  test("o binário: pela extensão, pela mágica do .wasm em arquivo de outro nome, e pelo .wasm em base64 dentro de texto", () => {
    for (const c of [
      "x/motor.wasm",
      "x/a.node",
      "x/lib.so",
      "pacote.tgz",
      "a.crate",
    ])
      expect(portas(arvore({ [c]: Buffer.from([1, 2, 3]) })), c).toContain(
        "binario",
      );
    expect(
      portas(
        arvore({
          "x/dados.bin.txt": Buffer.from([0x00, 0x61, 0x73, 0x6d, 1, 0, 0, 0]),
        }),
      ),
    ).toEqual(["binario"]);
    expect(
      portas(
        arvore({
          "x/embutido.ts": `export const m = "${WASM_EM_BASE64}AAAAA";\n`,
        }),
      ),
    ).toEqual(["binario"]);
    // O binário do upstream é dele (o upstream é intocável, LAB-132).
    expect(
      portas(
        arvore({
          "external-engines/symbios/upstream/x.wasm": Buffer.from([
            0, 0x61, 0x73, 0x6d,
          ]),
        }),
      ),
    ).toEqual([]);
  });

  test("a pasta docs/: captura de tela, código e página fora dos quatro formatos reprovam", () => {
    for (const c of [
      "docs/provas/LAB-1/tela.png",
      "docs/x.ts",
      "docs/pagina.html",
      "docs/LEIA-ME",
    ])
      expect(portas(arvore({ [c]: "x" })), c).toEqual(["docs"]);
  });

  test("o universo vazio e a porta que não leu nada reprovam — verde sobre zero não é verde", () => {
    const vazio = conferirOsArquivos([], () => null);
    expect(
      conferir(vazio, paginaBoa(), modulosBons).map((p) => p.tipo),
    ).toContain("universo-vazio");
    const semRotina = arvore({ ".github/workflows/verde.yml": null });
    expect(
      conferir(semRotina, paginaBoa(), modulosBons)
        .map((p) => p.detalhe)
        .join("\n"),
    ).toContain("rotinas");
  });
});

describe("LAB-183 · os dois lados da régua, na página", () => {
  test("a página boa passa", () => {
    expect(conferir(arvore(), paginaBoa(), modulosBons)).toEqual([]);
  });

  test("a página de antes reprova: a frase de 14/09, os seis nomes, os quatro formatos e a seção — doze problemas", () => {
    const antes = `${A_LINHA} ✅ **não se aplica** | ${A_FRASE_ANTIGA} |\n`;
    const tipos = conferir(arvore(), antes, modulosBons).map((p) => p.tipo);
    expect(tipos.filter((t) => t === "linha-nao-nomeia")).toHaveLength(6);
    expect(tipos.filter((t) => t === "linha-sem-formato")).toHaveLength(4);
    expect(tipos).toContain("linha-afirmacao-antiga");
    expect(tipos).toContain("tabela-ausente");
    expect(tipos).toHaveLength(12);
  });

  test("a tabela com o número errado, sem uma porta ou com uma porta de fora reprova", () => {
    const comAchado = arvore({ "a/Cargo.toml": '[package]\nname = "a"\n' });
    expect(
      conferir(comAchado, paginaBoa(), modulosBons).map((p) => p.tipo),
    ).toContain("tabela-numero-errado");
    const semDocs = paginaBoa().replace("| `docs` | x | 0 |", "");
    expect(conferir(arvore(), semDocs, modulosBons).map((p) => p.tipo)).toEqual(
      ["tabela-sem-porta"],
    );
    const comOutra = paginaBoa().replace(
      "| `docs` | x | 0 |",
      "| `docs` | x | 0 |\n| `tela` | x | 0 |",
    );
    expect(
      conferir(arvore(), comOutra, modulosBons).map((p) => p.tipo),
    ).toEqual(["tabela-com-outra"]);
  });

  test("a vizinha que sumiu ou que não nomeia a rodada reprova", () => {
    const [primeira] = AS_VIZINHAS;
    expect(
      conferir(arvore(), paginaBoa(), {
        ...modulosBons,
        [primeira!.trava]: null,
      }).map((p) => p.tipo),
    ).toEqual(["universo-vazio"]);
    expect(
      conferir(arvore(), paginaBoa(), {
        ...modulosBons,
        [primeira!.trava]: "/** LAB-9 */",
      }).map((p) => p.tipo),
    ).toEqual(["vizinha-sem-rodada"]);
  });

  test("a rodada se lê sem prefixo de outra: LAB-1830 não é LAB-183", () => {
    const pagina = paginaBoa().replace(
      `${O_PONTEIRO} LAB-183 ·`,
      `${O_PONTEIRO} LAB-1830 ·`,
    );
    expect(
      conferir(arvore(), pagina, modulosBons).map((p) => p.detalhe),
    ).toEqual(["a linha não nomeia LAB-183"]);
  });
});
