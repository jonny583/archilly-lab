/**
 * **LAB-187 (item 900) · a pasta de testes do Symbios — a página perguntada ao `git`, a cada verde** (D415).
 *
 * ```sh
 * bun test tests/a-pasta-de-testes-do-symbios.test.ts
 * ```
 *
 * O `external-engines/symbios/tests/README.md` dizia, desde o LAB-00 (09/09/2026), que o adaptador *"só nasce na Etapa
 * C"* e que os testes dele *"serão escritos aqui"* — falso desde o LAB-01 e o LAB-02, e nenhuma régua lia a página. O
 * motivo inteiro está no cabeçalho de `src/a-pasta-de-testes-do-symbios.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_ESPECIFICACAO,
  A_PAGINA,
  A_PAGINA_DIZ_DOS_NOMES,
  A_PASTA_DIZ,
  A_SUITE,
  AS_FORMAS_VELHAS,
  MARCA_ABRE,
  MARCA_FECHA,
  O_ADAPTADOR,
  OS_NOMES_DA_ESPECIFICACAO,
  O_QUE_ISTO_NAO_ALCANCA,
  QUEM_ESCREVE_OS_NOMES_DE_PROPOSITO,
  aListaDaPagina,
  conferir,
  conferirAArvore,
  osCaminhosRelativos,
} from "../src/a-pasta-de-testes-do-symbios.ts";
import { arquivosQueOGitCarrega } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const NOMES = OS_NOMES_DA_ESPECIFICACAO.map((n) => `\`${n}\``).join(", ");
const pagina = (lista: string[], extra = "") =>
  [
    "# tests/",
    "",
    A_PASTA_DIZ,
    "",
    "O motor: `../upstream/tests/integration.rs`. A suíte: `../../esteira/tests/`.",
    "",
    MARCA_ABRE,
    ...lista.map((n) => `- \`${n}\``),
    MARCA_FECHA,
    "",
    `Os quatro nomes (${NOMES}) ${A_PAGINA_DIZ_DOS_NOMES}.`,
    "",
    extra,
  ].join("\n");

// A chamada montada em pedaços: escrita inteira, ESTE arquivo carregaria o .wasm aos olhos da régua (medido: ela o acusou).
const CARREGA = `const motor = await Motor.${"carregar"}(readFileSync(WASM));\n`;
const BASE: Record<string, string> = {
  [A_PAGINA]: pagina(["porta.test.ts"]),
  [`${O_ADAPTADOR}motor.ts`]: "export class Motor {}\n",
  "external-engines/symbios/upstream/tests/integration.rs": "#[test] fn test_minimal() {}\n",
  [`${A_SUITE}porta.test.ts`]: CARREGA,
  [`${A_SUITE}outro.test.ts`]: "test('nada', () => {});\n",
  [A_ESPECIFICACAO]: OS_NOMES_DA_ESPECIFICACAO.join("\n"),
  ...Object.fromEntries(QUEM_ESCREVE_OS_NOMES_DE_PROPOSITO.map((q) => [q.arquivo, OS_NOMES_DA_ESPECIFICACAO.join(" ")])),
};
const rodar = (extra: Record<string, string | null> = {}) => {
  const arvore = new Map(Object.entries({ ...BASE, ...extra }).filter((e): e is [string, string] => e[1] !== null));
  return conferir([...arvore.keys()].sort(), (c) => arvore.get(c) ?? null);
};

/** A página como o LAB-00 a escreveu (09/09/2026, `f61be91`), byte a byte — para a trava provar que a reprova. */
const A_PAGINA_DE_ANTES = `# tests/

Vazio nesta fase.

O LAB-00 é investigação e prova mínima de execução: as medições vivem em
\`../archilly/probe/\`, que é um executável de instrumentação, não uma suíte de
testes.

Os testes que a especificação exige (\`test_minimal\`, \`test_coordinates\`,
\`test_output_conversion\`, \`test_validator_compatibility\`) pressupõem um Adapter,
que só nasce na Etapa C. Serão escritos aqui quando houver o que testar.

Os testes do próprio motor estão no upstream (\`../upstream/tests/integration.rs\`)
e rodam com \`cargo test\` a partir de \`../upstream/\`.
`;

describe("LAB-187 · o que o git carrega hoje — a página confere com a pasta, o adaptador e a suíte", () => {
  test("zero problemas, e o universo publicado", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `    [a-pasta-de-testes-do-symbios] ${r.naPasta.length} arquivo(s) na pasta · ${r.testesLidos} testes da esteira lidos · ${r.carregamOWasm.length} carregam o .wasm · ${r.naLista.length} na lista · ${r.codigoLido} arquivos de teste e .rs lidos pelos quatro nomes · ${r.problemas.length} problemas`,
    );
    for (const n of O_QUE_ISTO_NAO_ALCANCA) console.log(`    NÃO alcança: ${n}`);
    expect(r.problemas).toEqual([]);
    // Pisos: o universo não encolhe calado (medido em 19/10/2026: 155 testes, 8 carregam o .wasm, 161 lidos pelos nomes).
    expect(r.testesLidos).toBeGreaterThanOrEqual(155);
    expect(r.carregamOWasm.length).toBeGreaterThanOrEqual(8);
    expect(r.codigoLido).toBeGreaterThanOrEqual(161);
  });

  test("a página de antes, posta de volta no lugar, reprova — a trava já reprovou uma vez", () => {
    const r = conferir(arquivosQueOGitCarrega(RAIZ), (c) => (c === A_PAGINA ? A_PAGINA_DE_ANTES : lerDaRaiz(c)));
    // Medido em 19/10/2026: 14 problemas — a frase da pasta, as três formas velhas, as marcas, os oito testes que a lista
    // não nomeia e a frase dos nomes.
    expect(r.problemas).toHaveLength(14);
  });
});

function lerDaRaiz(c: string): string | null {
  const p = join(RAIZ, c);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

describe("LAB-187 · aprova o caso bom", () => {
  test("a árvore mínima", () => expect(rodar().problemas).toEqual([]));
  test("a forma velha riscada, citada ou entre crases não conta", () => {
    const extra = '~~Vazio nesta fase. O Adapter só nasce na Etapa C.~~ E "serão escritos aqui" e `Vazio nesta fase`.';
    expect(rodar({ [A_PAGINA]: pagina(["porta.test.ts"], extra) }).problemas).toEqual([]);
  });
  test("sem adaptador no git, a forma velha não é acusada (ela seria verdade)", () => {
    const r = rodar({ [A_PAGINA]: pagina(["porta.test.ts"], "Vazio nesta fase."), [`${O_ADAPTADOR}motor.ts`]: null });
    expect(r.problemas).toEqual([]);
  });
  test("os quatro nomes no upstream e nos dois declarados não contam", () => expect(rodar().problemas).toEqual([]));
  test("teste que só menciona Motor sem carregar não entra na lista", () => {
    expect(rodar({ [`${A_SUITE}menciona.test.ts`]: "// Motor.carregar é a porta\n".replace("(", "") }).problemas).toEqual([]);
  });
});

describe("LAB-187 · reprova o caso ruim", () => {
  const um = (extra: Record<string, string | null>, trecho: string) => {
    const r = rodar(extra);
    expect(r.problemas.some((p) => p.includes(trecho))).toBe(true);
  };
  test("um teste novo dentro da pasta", () => um({ "external-engines/symbios/tests/novo.rs": "" }, "o git carrega 2 arquivo(s)"));
  test("a página sem dizer o que a pasta carrega", () =>
    um({ [A_PAGINA]: pagina(["porta.test.ts"]).replace(A_PASTA_DIZ, "Vazia.") }, "não diz o que o git carrega"));
  for (const f of AS_FORMAS_VELHAS) {
    const frase = { "adapter-por-nascer": "O Adapter só nasce na Etapa C.", "testes-por-escrever": "Serão escritos aqui depois.", "vazio-nesta-fase": "Vazio nesta fase." }[f.id] ?? "";
    test(`a forma velha ${f.id}, afirmada, com o adaptador no git`, () => um({ [A_PAGINA]: pagina(["porta.test.ts"], frase) }, `(${f.id})`));
  }
  test("a forma velha quebrada na coluna e em negrito", () =>
    um({ [A_PAGINA]: pagina(["porta.test.ts"], "Os testes pressupõem um **Adapter**, que\nsó nasce na Etapa C.") }, "(adapter-por-nascer)"));
  test("um teste novo carrega o .wasm e a lista não o nomeia", () =>
    um({ [`${A_SUITE}novo.test.ts`]: CARREGA }, "não nomeia novo.test.ts"));
  test("a lista nomeia um teste que não carrega o .wasm", () =>
    um({ [A_PAGINA]: pagina(["porta.test.ts", "outro.test.ts"]) }, "outro.test.ts, que não carrega"));
  test("a lista nomeia um teste que não existe", () =>
    um({ [A_PAGINA]: pagina(["porta.test.ts", "sumiu.test.ts"]) }, "sumiu.test.ts, que o git não carrega"));
  test("a lista repete um nome", () => um({ [A_PAGINA]: pagina(["porta.test.ts", "porta.test.ts"]) }, "repete"));
  test("a página sem as marcas", () =>
    um({ [A_PAGINA]: pagina(["porta.test.ts"]).replace(MARCA_ABRE, "") }, "sem as marcas"));
  test("nenhum teste carrega o .wasm — universo vazio", () => um({ [`${A_SUITE}porta.test.ts`]: "nada\n", [A_PAGINA]: pagina([]) }, "universo vazio"));
  test("um caminho relativo que não resolve", () =>
    um({ [A_PAGINA]: pagina(["porta.test.ts"], "Veja `../sumiu/`.") }, "o caminho ../sumiu/ não resolve"));
  test("um teste escreve um dos quatro nomes, e a página diz que nenhum escreve", () =>
    um({ [`${A_SUITE}outro.test.ts`]: "test('test_coordinates', () => {});\n" }, "escreve test_coordinates"));
  test("um .rs fora do upstream escreve um dos quatro nomes", () =>
    um({ "external-engines/symbios/archilly/probe/src/main.rs": "fn test_minimal() {}\n" }, "escreve test_minimal"));
  test("a página sem um dos quatro nomes", () =>
    um({ [A_PAGINA]: pagina(["porta.test.ts"]).replace("`test_minimal`", "") }, "não nomeia test_minimal"));
  test("a página sem a frase dos nomes", () =>
    um({ [A_PAGINA]: pagina(["porta.test.ts"]).replace(A_PAGINA_DIZ_DOS_NOMES, "talvez existam") }, "não diz se os quatro nomes"));
  test("a especificação sem um dos nomes", () => um({ [A_ESPECIFICACAO]: "test_minimal" }, "não tem test_coordinates"));
  test("a página que some", () => um({ [A_PAGINA]: null }, "a página não existe"));
  test("o declarado que some", () => um({ [QUEM_ESCREVE_OS_NOMES_DE_PROPOSITO[1]?.arquivo ?? ""]: null }, "declarado e o git não carrega"));
});

describe("LAB-187 · as peças", () => {
  test("a lista lê só os itens entre as marcas", () => {
    expect(aListaDaPagina(`- \`fora.test.ts\`\n${MARCA_ABRE}\n- \`a.test.ts\`\ntexto\n- \`b.test.ts\`\n${MARCA_FECHA}\n- \`depois.test.ts\``)).toEqual(["a.test.ts", "b.test.ts"]);
    expect(aListaDaPagina("sem marcas")).toBeNull();
  });
  test("os caminhos relativos são os que começam em ../", () => {
    expect(osCaminhosRelativos("`../a/` e `./b` e `c/../d` e `../../e.rs`")).toEqual(["../a/", "../../e.rs"]);
  });
  test("o que não alcança é dito, e os declarados têm motivo", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    for (const q of QUEM_ESCREVE_OS_NOMES_DE_PROPOSITO) expect(q.motivo.length).toBeGreaterThan(15);
  });
});
