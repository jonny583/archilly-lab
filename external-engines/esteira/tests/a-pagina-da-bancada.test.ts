/**
 * **LAB-188 (item 900) · a página da bancada — a pasta, quem roda cada arquivo, e a medição de 10/09 num lugar só** (D416).
 *
 * ```sh
 * bun test tests/a-pagina-da-bancada.test.ts
 * ```
 *
 * O `external-engines/symbios/adapter/ferramentas/navegador/README.md` dizia, desde o LAB-01 (10/09/2026), o que a pasta
 * era naquele dia — uma página para abrir à mão — e não nomeava os dois arquivos que o `conferir.sh` roda nela (LAB-31,
 * LAB-182); e os cinco números de 10/09 estavam digitados em três lugares sem trava entre eles. O motivo inteiro está no
 * cabeçalho de `src/a-pagina-da-bancada.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PAGINA,
  A_PAGINA_DIZ_DO_ADAPTADOR,
  A_PAGINA_DIZ_DO_WASM,
  A_PAGINA_DIZ_DOS_TRES,
  A_PASTA,
  A_PROVA_AUTOMATICA,
  A_PROVA_DO_LAB31,
  CAMPOS,
  MARCA_ABRE,
  MARCA_FECHA,
  O_CONFERIR,
  O_INDEX,
  O_MOTOR_DO_ADAPTADOR,
  O_PROVA_JS,
  O_QUE_ISTO_NAO_ALCANCA,
  aListaDaPagina,
  aMedicaoDaPagina,
  aMedicaoDaProva,
  aMedicaoGravada,
  conferir,
  conferirAArvore,
  osCds,
  oQueOConferirRoda,
} from "../src/a-pagina-da-bancada.ts";
import { arquivosQueOGitCarrega } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const BLOCO = [
  "wasm: 193174 bytes, instanciado em 19.7 ms",
  "resultado: ok=true · motor 0.4.1 · 6242 nós · 6514 arestas ativas · 275 quadras",
].join("\n");
const pagina = (itens: string[], extra = "", bloco = BLOCO) =>
  [
    "# A prova no navegador",
    "",
    `${A_PAGINA_DIZ_DO_WASM}.`,
    "",
    MARCA_ABRE,
    ...itens,
    MARCA_FECHA,
    "",
    `Ela é JavaScript puro e ${A_PAGINA_DIZ_DO_ADAPTADOR}. O contrato: \`archilly_alloc\`, \`archilly_free\`.`,
    "",
    "## Medido em 10/09/2026 (Chromium)",
    "",
    "```text",
    bloco,
    "```",
    "",
    `Portão: ${A_PAGINA_DIZ_DOS_TRES} — o bloco, o \`prova-automatica.ts\` e \`${A_PROVA_DO_LAB31}\`.`,
    "",
    extra,
  ].join("\n");
const ITENS = [
  "- `index.html` — a página.",
  "- `prova.js` — o script.",
  "- `prova-automatica.ts` — roda no `conferir.sh`.",
];
const PROVA_TS = 'const DE_10_09 = { versao_motor: "0.4.1", nos: 6242, arestas: 6514, quadras: 275, bytesDoWasm: 193174 };\n';
const GRAVADA = JSON.stringify({ medidoEm_10_09_2026: { versao_motor: "0.4.1", nos: 6242, arestas: 6514, quadras: 275, bytesDoWasm: 193174 } });
const BASE: Record<string, string> = {
  [A_PAGINA]: pagina(ITENS),
  [O_INDEX]: '<script type="module" src="./prova.js"></script>\n',
  [O_PROVA_JS]: "const ex = instance.exports; ex.archilly_alloc(1); ex.archilly_free(1);\n",
  [A_PROVA_AUTOMATICA]: PROVA_TS,
  [A_PROVA_DO_LAB31]: GRAVADA,
  [O_MOTOR_DO_ADAPTADOR]: "archilly_alloc archilly_free\n",
  [O_CONFERIR]: "# ferramentas/navegador/prova.js no comentário não conta\nbun ../symbios/adapter/ferramentas/navegador/prova-automatica.ts\n",
};
const rodar = (extra: Record<string, string | null> = {}) => {
  const arvore = new Map(Object.entries({ ...BASE, ...extra }).filter((e): e is [string, string] => e[1] !== null));
  return conferir([...arvore.keys()].sort(), (c) => arvore.get(c) ?? null);
};

/** A página como o LAB-01 a escreveu (10/09/2026, `069fd29`), byte a byte — para a trava provar que a reprova. */
const A_PAGINA_DE_ANTES = `# A prova no navegador

Mostra o \`.wasm\` do adaptador carregando e rodando num navegador de verdade —
com \`WebAssembly.instantiate(bytes, {})\`, objeto de imports **vazio**.

\`\`\`shell
# 1. compilar a ponte (uma vez)
cd ../../../archilly/wasm
RUSTFLAGS='--cfg getrandom_backend="custom"' \\
  cargo build --release --target wasm32-unknown-unknown

# 2. copiar o artefato para cá
cp target/wasm32-unknown-unknown/release/archilly_symbios_wasm.wasm \\
   ../../adapter/ferramentas/navegador/

# 3. servir (um \`file://\` não serve: \`fetch\` de wasm exige HTTP)
cd ../../adapter/ferramentas/navegador && npx http-server -p 8099 .
\`\`\`

O \`.wasm\` **não é versionado**: é artefato de build, e um binário no git que já
não corresponde ao fonte ao lado dele é a divergência silenciosa que o \`build.rs\`
da ponte existe para impedir.

## O que esta página é, e o que não é

Ela é JavaScript puro e **não importa o adaptador**. O que está em dúvida para o
LAB-05 é se o módulo carrega e executa no navegador, e isso se responde sem o
invólucro TypeScript — trazer o adaptador inteiro exigiria um empacotador, que é
a complexidade que o LAB-01 não precisa assumir. O relevo aqui é sintético,
construído na própria página; terreno do Generate é o LAB-05.

O marshalling segue o mesmo contrato de \`src/motor.ts\`: \`archilly_alloc\`,
\`archilly_free\`, e texto como \`[u32 tamanho][UTF-8]\`.

## Medido em 10/09/2026 (Chromium)

\`\`\`text
wasm: 193174 bytes, instanciado em 19.7 ms
  vias                19.70 ms
  racionalização      88.00 ms
  quadras              9.10 ms
resultado: ok=true · motor 0.4.1 · 6242 nós · 6514 arestas ativas · 275 quadras
TOTAL no navegador: 151.0 ms
\`\`\`

Captura em [\`outputs/lab01/navegador.png\`](../../../../../outputs/lab01/navegador.png).
No desenho: **azul** são vias principais (seguem a curva de nível, fechando anéis
em torno dos morros) e **vermelho** são locais (descem o gradiente, em leque a
partir dos cumes). As duas coisas que o relatório aponta estão visíveis ali.
`;

function lerDaRaiz(c: string): string | null {
  const p = join(RAIZ, c);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

describe("LAB-188 · o que o git carrega hoje — a página confere com a pasta, o conferir.sh e a medição de 10/09", () => {
  test("zero problemas, e o universo publicado", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `    [a-pagina-da-bancada] ${r.naPasta.length} arquivo(s) na pasta além da página · o conferir.sh roda ${r.oConferirRoda.length} (${r.oConferirRoda.join(", ")}) · 10/09 em 3 lugares: ${r.daPagina?.bytesDoWasm} bytes, ${r.daPagina?.nos} nós · ${r.caminhosLidos} caminhos lidos · ${r.problemas.length} problemas`,
    );
    for (const n of O_QUE_ISTO_NAO_ALCANCA) console.log(`    NÃO alcança: ${n}`);
    expect(r.problemas).toEqual([]);
    // Pisos: o universo não encolhe calado (medido em 19/10/2026: 4 arquivos, 2 rodados pelo conferir.sh, 6 caminhos).
    expect(r.naPasta.length).toBeGreaterThanOrEqual(4);
    expect(r.oConferirRoda.length).toBeGreaterThanOrEqual(2);
    expect(r.caminhosLidos).toBeGreaterThanOrEqual(6);
  });

  test("a página de antes, posta de volta no lugar, reprova — a trava já reprovou uma vez", () => {
    const r = conferir(arquivosQueOGitCarrega(RAIZ), (c) => (c === A_PAGINA ? A_PAGINA_DE_ANTES : lerDaRaiz(c)));
    // Medido em 19/10/2026: 6 problemas — as marcas, os quatro arquivos que a lista não nomeia e a frase dos três lugares.
    expect(r.problemas).toHaveLength(6);
  });

  test("a página de antes tinha a medição certa: os três lugares já batiam, só ninguém perguntava", () => {
    const r = conferir(arquivosQueOGitCarrega(RAIZ), (c) => (c === A_PAGINA ? A_PAGINA_DE_ANTES : lerDaRaiz(c)));
    expect(r.problemas.filter((p) => p.includes("DE_10_09") || p.includes("medidoEm_10_09_2026"))).toEqual([]);
  });
});

describe("LAB-188 · aprova o caso bom", () => {
  test("a árvore mínima", () => expect(rodar().problemas).toEqual([]));
  test("o item quebrado em duas linhas ainda diz o conferir.sh", () => {
    const itens = [...ITENS.slice(0, 2), "- `prova-automatica.ts` — a mesma página, que o", "  `conferir.sh` roda."];
    expect(rodar({ [A_PAGINA]: pagina(itens) }).problemas).toEqual([]);
  });
  test("sem dizer que não importa o adaptador, o import não é perguntado — e a falta da frase é", () => {
    const r = rodar({ [A_PAGINA]: pagina(ITENS).replace(A_PAGINA_DIZ_DO_ADAPTADOR, "usa o que quiser"), [O_PROVA_JS]: `import x from "y";\n${BASE[O_PROVA_JS]}` });
    expect(r.problemas).toHaveLength(1);
    expect(r.problemas[0]).toContain("não diz se importa o adaptador");
  });
  test("a palavra import em comentário ou string do prova.js não conta", () => {
    expect(rodar({ [O_PROVA_JS]: `// não importa o adaptador; import nenhum\nconst s = "import";\n${BASE[O_PROVA_JS]}` }).problemas).toEqual([]);
  });
});

describe("LAB-188 · reprova o caso ruim", () => {
  const um = (extra: Record<string, string | null>, trecho: string) => {
    const r = rodar(extra);
    expect(r.problemas.some((p) => p.includes(trecho))).toBe(true);
  };
  test("um arquivo novo na pasta, sem item", () => um({ [`${A_PASTA}novo.ts`]: "" }, "não nomeia novo.ts"));
  test("um item de arquivo que o git não carrega", () =>
    um({ [A_PAGINA]: pagina([...ITENS, "- `sumiu.js` — x"]) }, "nomeia sumiu.js, que o git não carrega"));
  test("a lista repete um nome", () => um({ [A_PAGINA]: pagina([...ITENS, ITENS[0] as string]) }, "repete"));
  test("a página sem as marcas", () => um({ [A_PAGINA]: pagina(ITENS).replace(MARCA_FECHA, "") }, "sem as marcas"));
  test("a pasta só com a página — universo vazio", () =>
    um({ [O_INDEX]: null, [O_PROVA_JS]: null, [A_PROVA_AUTOMATICA]: null, [A_PAGINA]: pagina([]) }, "universo vazio"));
  test("um .wasm versionado, e a página diz que não", () => um({ [`${A_PASTA}archilly_symbios_wasm.wasm`]: "" }, "o git carrega archilly_symbios_wasm.wasm"));
  test("a página sem dizer que o .wasm não é versionado", () =>
    um({ [A_PAGINA]: pagina(ITENS).replace(A_PAGINA_DIZ_DO_WASM, "O binário fica de fora") }, "não diz que o .wasm"));
  test("o conferir.sh roda um arquivo e o item não diz", () =>
    um({ [A_PAGINA]: pagina([...ITENS.slice(0, 2), "- `prova-automatica.ts` — a página no Chromium."]) }, "não diz que o `conferir.sh` o roda"));
  test("o item diz conferir.sh e o conferir.sh não roda", () =>
    um({ [A_PAGINA]: pagina(["- `index.html` — roda no `conferir.sh`.", ...ITENS.slice(1)]) }, "o item index.html diz"));
  test("o conferir.sh roda um arquivo que não existe na pasta", () =>
    um({ [O_CONFERIR]: `${BASE[O_CONFERIR]}bun ../symbios/adapter/ferramentas/navegador/sumiu.ts\n` }, "roda sumiu.ts"));
  for (const c of CAMPOS) {
    test(`o DE_10_09 diverge da página em ${c}`, () => {
      const r = rodar({ [A_PROVA_AUTOMATICA]: PROVA_TS.replace(c === "versao_motor" ? '"0.4.1"' : String(aMedicaoDaProva(PROVA_TS)?.[c]), c === "versao_motor" ? '"0.4.2"' : "1") });
      expect(r.problemas.some((p) => p.includes(`DE_10_09.${c}`))).toBe(true);
    });
    test(`a prova gravada do LAB-31 diverge da página em ${c}`, () => {
      const g = JSON.parse(GRAVADA) as { medidoEm_10_09_2026: Record<string, unknown> };
      g.medidoEm_10_09_2026[c] = c === "versao_motor" ? "9.9.9" : 1;
      const r = rodar({ [A_PROVA_DO_LAB31]: JSON.stringify(g) });
      expect(r.problemas.some((p) => p.includes(`medidoEm_10_09_2026.${c}`))).toBe(true);
    });
  }
  test("a página muda um número, e os outros dois lugares acusam", () => {
    const r = rodar({ [A_PAGINA]: pagina(ITENS, "", BLOCO.replace("6242 nós", "6243 nós")) });
    expect(r.problemas.filter((p) => p.includes(".nos ="))).toHaveLength(2);
  });
  test("o bloco de 10/09 sem um campo", () =>
    um({ [A_PAGINA]: pagina(ITENS, "", BLOCO.replace(" · 275 quadras", "")) }, "não traz quadras"));
  test("a página sem o bloco de 10/09", () =>
    um({ [A_PAGINA]: pagina(ITENS).replace("## Medido em 10/09/2026", "## Medido") }, "sem o bloco"));
  test("o prova-automatica.ts sem o DE_10_09", () => um({ [A_PROVA_AUTOMATICA]: "const OUTRO = {};\n" }, "sem a constante DE_10_09"));
  test("a prova gravada sem o medidoEm_10_09_2026, ou ilegível", () => {
    um({ [A_PROVA_DO_LAB31]: "{}" }, "sem o medidoEm_10_09_2026");
    um({ [A_PROVA_DO_LAB31]: "não é json" }, "sem o medidoEm_10_09_2026");
  });
  test("a página sem a frase dos três lugares", () =>
    um({ [A_PAGINA]: pagina(ITENS).replace(A_PAGINA_DIZ_DOS_TRES, "está aqui") }, "não diz que a medição"));
  test("a frase dos três lugares sem nomear a prova do LAB-31", () =>
    um({ [A_PAGINA]: pagina(ITENS).replace(`\`${A_PROVA_DO_LAB31}\``, "a prova") }, `não nomeia ${A_PROVA_DO_LAB31}`));
  test("o prova.js importa, e a página diz que não", () =>
    um({ [O_PROVA_JS]: `import { Motor } from "../../src/motor.ts";\n${BASE[O_PROVA_JS]}` }, "tem import no código"));
  test("o prova.js importa dinamicamente, e a página diz que não", () =>
    um({ [O_PROVA_JS]: `const m = await import("../../src/motor.ts");\n${BASE[O_PROVA_JS]}` }, "tem import no código"));
  test("o index.html carrega script de fora da pasta", () =>
    um({ [O_INDEX]: '<script type="module" src="../../src/motor.js"></script>\n' }, "carrega script de fora da pasta"));
  test("o index.html carrega script que o git não carrega", () =>
    um({ [O_INDEX]: '<script src="./sumiu.js"></script>\n' }, "carrega ./sumiu.js, que o git não carrega"));
  test("o marshalling some do prova.js ou do motor.ts", () => {
    um({ [O_PROVA_JS]: "ex.archilly_alloc(1);\n" }, "não usa archilly_free");
    um({ [O_MOTOR_DO_ADAPTADOR]: "archilly_free\n" }, "não usa archilly_alloc");
  });
  test("um link que não resolve", () => um({ [A_PAGINA]: pagina(ITENS, "Captura em [x](../sumiu.png).") }, "o link ../sumiu.png"));
  test("um cd que não chega a nada", () => um({ [A_PAGINA]: pagina(ITENS, "```shell\ncd ../sumiu\n```") }, "o cd chega a"));
  test("um docs/ que não existe", () => um({ [A_PAGINA]: pagina(ITENS, "Veja `docs/provas/LAB-999/x.json`.") }, "docs/provas/LAB-999/x.json não existe"));
  test("o motor.ts do adaptador que some", () => um({ [O_MOTOR_DO_ADAPTADOR]: null }, "motor.ts: não existe"));
  test("a página que some", () => um({ [A_PAGINA]: null }, "a página não existe"));
  test("o conferir.sh que some", () => um({ [O_CONFERIR]: null }, "conferir.sh: não existe"));
});

describe("LAB-188 · as peças", () => {
  test("a lista lê só os itens entre as marcas, com a continuação", () => {
    const l = aListaDaPagina(`- \`fora\`\n${MARCA_ABRE}\n- \`a.js\` — um\n  dois\ntexto\n- \`b.ts\`\n${MARCA_FECHA}`);
    expect(l?.map((i) => i.nome)).toEqual(["a.js", "b.ts"]);
    expect(l?.[0]?.linha).toContain("dois");
    expect(aListaDaPagina("sem marcas")).toBeNull();
  });
  test("o conferir.sh: linha de comentário não conta", () => {
    expect(oQueOConferirRoda("# bun ferramentas/navegador/a.ts\n  bun x/ferramentas/navegador/b.ts\n")).toEqual(["b.ts"]);
  });
  test("os cd seguem em ordem, como o terminal", () => {
    expect(osCds("```shell\ncd ../../../archilly/wasm\nx\ncd ../../adapter/ferramentas/navegador && y\n```")).toEqual([
      "external-engines/symbios/archilly/wasm",
      "external-engines/symbios/adapter/ferramentas/navegador",
    ]);
  });
  test("a medição da página, da prova e da gravada", () => {
    expect(aMedicaoDaPagina(BLOCO)).toEqual({ versao_motor: "0.4.1", nos: 6242, arestas: 6514, quadras: 275, bytesDoWasm: 193174 });
    expect(aMedicaoDaProva(PROVA_TS)).toEqual(aMedicaoDaPagina(BLOCO));
    expect(aMedicaoGravada(GRAVADA)).toEqual(aMedicaoDaPagina(BLOCO));
  });
  test("o que não alcança é dito", () => expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4));
});
