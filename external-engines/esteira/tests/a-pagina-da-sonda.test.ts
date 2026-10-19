/**
 * **LAB-189 (item 900) · a página da sonda — o que a pasta carrega, o que a sonda é hoje, e os números do LAB-00 em dois lugares** (D417).
 *
 * ```sh
 * bun test tests/a-pagina-da-sonda.test.ts
 * ```
 *
 * O `external-engines/symbios/archilly/wasm-probe/README.md` dizia, desde o LAB-00 (09/09/2026), a sonda daquele dia, e
 * calava que a ponte carregada (`../wasm/`, LAB-01) não usa a receita dela; e os números do LAB-00 estavam digitados em
 * dois lugares sem trava entre eles. O motivo inteiro está no cabeçalho de `src/a-pagina-da-sonda.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_ANALISE,
  A_PAGINA,
  A_PASTA,
  MARCA_FECHA,
  O_CARGO,
  O_CONFERIR,
  O_LOCK,
  O_QUE_ISTO_NAO_ALCANCA,
  O_TOOLCHAIN,
  O_TOOLCHAIN_DO_UPSTREAM,
  aListaDaPagina,
  aSecao10,
  alcancavel,
  conferir,
  conferirAArvore,
  lerOLock,
  osCfgs,
  osNumerosDaPagina,
  osNumerosDaSecao,
} from "../src/a-pagina-da-sonda.ts";
import { artefatoDe } from "../src/o-wasm-nao-pede-nada.ts";
import { arquivosQueOGitCarrega } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/**
 * O artefato da sonda, perguntado ao `Cargo.toml` — e não escrito aqui: a trava do LAB-176 (`sonda-carregada`) reprova
 * o nome da sonda em qualquer código, e foi ela que o pegou na primeira versão deste teste.
 */
const ARTEFATO = artefatoDe(readFileSync(join(RAIZ, O_CARGO), "utf8")) as string;

/** A página como estava antes desta rodada, byte a byte o blob de `f61be91` (LAB-00), nunca tocado até o LAB-189. */
const A_PAGINA_DE_ANTES = `# wasm-probe — prova de compilação para WebAssembly

Crate de fachada que existe por um motivo só: provar que o \`symbios-tensor\`
compila para \`wasm32-unknown-unknown\`, que é o alvo do Archilly Generate.

Ele **não modifica o upstream**. A correção necessária é do lado consumidor:
\`rand 0.9\` puxa \`getrandom 0.3\`, que em wasm32 exige escolha explícita de
backend. Declarar \`getrandom\` com a feature \`wasm_js\` aqui e compilar com o
\`--cfg\` correspondente resolve, sem tocar no motor.

\`\`\`shell
rustup target add wasm32-unknown-unknown
RUSTFLAGS='--cfg getrandom_backend="wasm_js"' \\
  cargo build --release --target wasm32-unknown-unknown
\`\`\`

Resultado medido no LAB-00: \`${ARTEFATO}\`, **162 696 bytes**,
compilado em 12,54 s. Sem dependência nativa, sem C++, sem emscripten.

Sem esse \`--cfg\`, a compilação falha com
\`error: The wasm32-unknown-unknown targets are not supported by default\`.
Isso está registrado como a primeira tentativa em
\`docs/SYMBIOS_ANALYSIS.md\`, seção 10.
`;

function lerDaRaiz(c: string): string | null {
  const p = join(RAIZ, c);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}
const CAMINHOS = arquivosQueOGitCarrega(RAIZ);
const PAGINA = lerDaRaiz(A_PAGINA) as string;

/** Confere com um arquivo trocado (ou apagado, com `null`). */
function com(trocas: Record<string, string | null>, caminhos: readonly string[] = CAMINHOS) {
  return conferir(caminhos, (c) => (c in trocas ? (trocas[c] as string | null) : lerDaRaiz(c))).problemas;
}
const troca = (texto: string, de: string, para: string) => {
  if (!texto.includes(de)) throw new Error(`a mutação não acha «${de}»`);
  return texto.replace(de, para);
};
const naPagina = (de: string, para: string) => com({ [A_PAGINA]: troca(PAGINA, de, para) });
const acusa = (problemas: string[], trecho: string) => expect(problemas.some((p) => p.includes(trecho))).toBe(true);

describe("LAB-189 · o que o git carrega hoje — a página confere com a pasta, a ponte, o lock e a análise", () => {
  test("zero problemas, e o universo publicado", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `    [a-pagina-da-sonda] ${r.naPasta.length} arquivo(s) na pasta além da página · ${r.pacotesNoLock} pacotes no Cargo.lock · LAB-00 em 2 lugares: ${r.numerosDaPagina.bytes} bytes, ${r.numerosDaPagina.segundos} s · ${r.caminhosLidos} caminhos lidos · ${r.problemas.length} problemas`,
    );
    for (const n of O_QUE_ISTO_NAO_ALCANCA) console.log(`    NÃO alcança: ${n}`);
    expect(r.problemas).toEqual([]);
    // Pisos: o universo não encolhe calado (medido em 19/10/2026: 4 arquivos, 34 pacotes, 5 caminhos).
    expect(r.naPasta.length).toBeGreaterThanOrEqual(4);
    expect(r.pacotesNoLock).toBeGreaterThanOrEqual(34);
    expect(r.caminhosLidos).toBeGreaterThanOrEqual(5);
  });

  test("a página de antes, posta de volta no lugar, reprova", () => {
    const p = com({ [A_PAGINA]: A_PAGINA_DE_ANTES });
    // Medido em 19/10/2026: 10 problemas — as marcas, os quatro arquivos sem nome, o .wasm e o target/ calados, o papel,
    // a ponte, o conferir.sh e os dois lugares. Nenhum era número errado: tudo era silêncio. (A cola do lock não se
    // pergunta sem o item do lock, que já é o problema dos quatro arquivos.)
    expect(p).toEqual(PROBLEMAS_DE_ANTES);
  });

  test("a página de antes tinha os números certos: os dois lugares já batiam, só ninguém perguntava", () => {
    const p = com({ [A_PAGINA]: A_PAGINA_DE_ANTES });
    expect(p.filter((x) => x.includes("seção 10 diz") || x.includes("KB"))).toEqual([]);
    expect(osNumerosDaPagina(A_PAGINA_DE_ANTES)).toEqual({ bytes: 162696, segundos: 12.54 });
  });
});

const PROBLEMAS_DE_ANTES: string[] = [
  `${A_PAGINA}: sem as marcas da lista da pasta`,
  `${A_PAGINA}: a lista não nomeia Cargo.lock, que o git carrega na pasta`,
  `${A_PAGINA}: a lista não nomeia Cargo.toml, que o git carrega na pasta`,
  `${A_PAGINA}: a lista não nomeia rust-toolchain.toml, que o git carrega na pasta`,
  `${A_PAGINA}: a lista não nomeia src/lib.rs, que o git carrega na pasta`,
  `${A_PAGINA}: não diz que o .wasm e o target/ não são versionados («O \`.wasm\` e a pasta \`target/\` não são versionados»)`,
  `${A_PAGINA}: não diz que ninguém carrega o artefato («Ninguém carrega o»)`,
  `${A_PAGINA}: não aponta a ponte carregada (external-engines/symbios/archilly/wasm) por link`,
  `${A_PAGINA}: não diz se o conferir.sh compila a sonda («o \`conferir.sh\` não o compila»)`,
  `${A_PAGINA}: não diz que os números do LAB-00 moram em dois lugares («Os números do LAB-00 moram em dois lugares»)`,
];

describe("1 · a pasta, nos dois sentidos", () => {
  test("arquivo novo na pasta sem item reprova", () => acusa(com({}, [...CAMINHOS, `${A_PASTA}build.rs`]), "não nomeia build.rs"));
  test("item sem arquivo reprova", () => acusa(com({}, CAMINHOS.filter((c) => c !== `${A_PASTA}src/lib.rs`)), "nomeia src/lib.rs, que o git não carrega"));
  test("nome repetido reprova", () => acusa(naPagina("- `src/lib.rs`", "- `src/lib.rs` — x\n- `src/lib.rs`"), "repete"));
  test("sem as marcas reprova", () => acusa(naPagina(MARCA_FECHA, ""), "sem as marcas"));
  test("universo vazio reprova", () => acusa(com({}, CAMINHOS.filter((c) => !c.startsWith(A_PASTA) || c === A_PAGINA)), "universo vazio"));
  test(".wasm versionado reprova", () => acusa(com({}, [...CAMINHOS, `${A_PASTA}${ARTEFATO}`]), `e o git carrega ${ARTEFATO}`));
  test("target/ versionado reprova", () => acusa(com({}, [...CAMINHOS, `${A_PASTA}target/x`]), "e o git carrega target/x"));
  test("sem a frase do .wasm reprova", () => acusa(naPagina("não são versionados", "ficam aqui"), "não diz que o .wasm"));
  test("o item quebrado em várias linhas é UM item", () => {
    const l = aListaDaPagina(PAGINA)!;
    expect(l.map((i) => i.nome)).toEqual(["Cargo.toml", "Cargo.lock", "rust-toolchain.toml", "src/lib.rs"]);
    expect(l[1]!.linha).toContain("`js-sys`");
  });
});

describe("2 · o papel", () => {
  test("sem a frase de que ninguém carrega reprova", () => acusa(naPagina("Ninguém carrega o", "Quase ninguém usa o"), "ninguém carrega"));
  test("sem o nome do artefato (nas duas menções) reprova", () =>
    acusa(com({ [A_PAGINA]: PAGINA.replaceAll(ARTEFATO, "o artefato") }), "não nomeia o artefato"));
  test("o artefato renomeado no Cargo.toml reprova (a página nomeia o velho)", () =>
    acusa(com({ [O_CARGO]: troca(lerDaRaiz(O_CARGO)!, '"symbios-wasm-probe"', '"outra-sonda"') }), "outra_sonda.wasm"));
  test("sem o link da ponte reprova", () => acusa(naPagina("[`../wasm/`](../wasm/)", "`../wasm/`"), "não aponta a ponte carregada"));
  test("o conferir.sh que compila a sonda reprova", () =>
    acusa(com({ [O_CONFERIR]: `${lerDaRaiz(O_CONFERIR)}\ncd external-engines/symbios/archilly/wasm-probe\n` }), "nomeia wasm-probe fora de comentário"));
  test("o conferir.sh que só COMENTA a sonda aprova", () =>
    expect(com({ [O_CONFERIR]: `${lerDaRaiz(O_CONFERIR)}\n# a wasm-probe não se compila\n` })).toEqual([]));
  test("sem a frase do conferir.sh reprova", () => acusa(naPagina("o `conferir.sh` não o compila", "nada mais"), "não diz se o conferir.sh"));
  test("o conferir.sh que some reprova", () => acusa(com({ [O_CONFERIR]: null }), "conferir.sh: não existe"));
  test("o Cargo.toml que some reprova", () => acusa(com({ [O_CARGO]: null }), "Cargo.toml: não existe"));
});

describe("3 · a receita", () => {
  test("o --cfg da página que diverge da análise reprova", () =>
    acusa(naPagina("RUSTFLAGS='--cfg getrandom_backend=\"wasm_js\"'", "RUSTFLAGS='--cfg getrandom_backend=\"js\"'"), 'usa getrandom_backend="js"'));
  test("a página sem bloco de comando reprova", () => acusa(naPagina("```shell", "```text"), "nenhum bloco de comando"));
  test("o getrandom sem wasm_js reprova", () =>
    acusa(com({ [O_CARGO]: troca(lerDaRaiz(O_CARGO)!, 'features = ["wasm_js"]', "features = []") }), "não tem a feature wasm_js"));
  test("o conferir.sh que deixa o backend custom reprova a frase da página", () =>
    acusa(com({ [O_CONFERIR]: lerDaRaiz(O_CONFERIR)!.replaceAll('getrandom_backend=\\"custom\\"', 'getrandom_backend=\\"wasm_js\\"') }), "não imprime essa receita"));
  test("a análise sem a seção 10 reprova", () => acusa(com({ [A_ANALISE]: lerDaRaiz(A_ANALISE)!.replace("## 10. ", "## 10b. ") }), "sem a seção 10"));
  test("a análise que some reprova", () => acusa(com({ [A_ANALISE]: null }), "SYMBIOS_ANALYSIS.md: não existe"));
  test("o --cfg é lido só dos blocos de comando", () => {
    expect(osCfgs(PAGINA)).toEqual(["wasm_js"]);
    expect(osCfgs('texto --cfg getrandom_backend="x"')).toEqual([]);
  });
});

describe("4 · o Cargo.lock", () => {
  const LOCK = lerDaRaiz(O_LOCK)!;
  test("a cadeia medida: rand 0.9 alcança getrandom 0.3", () => {
    const p = lerOLock(LOCK);
    expect(p.find((x) => x.nome === "rand")?.versao).toMatch(/^0\.9\./);
    expect(alcancavel(p, "rand", "0.9.", "getrandom")).toEqual(["0.3.4"]);
  });
  test("o rand sem caminho até o getrandom reprova", () =>
    acusa(com({ [O_LOCK]: LOCK.replace(/(name = "rand_core"\nversion = "[^"]+"\n[\s\S]*?)dependencies = \[\n "getrandom",\n\]/, "$1") }), "não alcança getrandom 0.3"));
  test("sem rand 0.9 reprova", () => acusa(com({ [O_LOCK]: LOCK.replace(/name = "rand"\nversion = "0\.9\.\d+"/, 'name = "rand"\nversion = "0.8.5"') }), "sem rand 0.9"));
  test("a cola que o lock deixa de trazer, e o item ainda nomeia, reprova", () =>
    acusa(com({ [O_LOCK]: LOCK.replace(/name = "js-sys"/, 'name = "outro-js"') }), "nomeia js-sys, que o lock não traz"));
  test("a cola que o lock passa a trazer, e o item não nomeia, reprova", () =>
    acusa(com({ [O_LOCK]: `${LOCK}\n[[package]]\nname = "web-sys"\nversion = "0.3.0"\n` }), "não nomeia web-sys, que o lock traz"));
  test("a cola no item e não no texto da sonda reprova", () => acusa(naPagina("traz\n`wasm-bindgen` e `js-sys` —", "traz a cola —"), "o texto da sonda não a nomeia"));
  test("um pacote nativo no lock reprova", () => acusa(com({ [O_LOCK]: `${LOCK}\n[[package]]\nname = "cc"\nversion = "1.0.0"\n` }), "traz cc"));
  test("lock vazio reprova", () => acusa(com({ [O_LOCK]: "version = 4\n" }), "nenhum pacote lido"));
  test("lock que some reprova", () => acusa(com({ [O_LOCK]: null }), "Cargo.lock: não existe"));
  test("a dependência com versão no lock (`\"x 0.1.0\"`) é lida pelo nome", () =>
    expect(lerOLock('[[package]]\nname = "a"\nversion = "1.0.0"\ndependencies = [\n "b 0.1.0",\n "c",\n]\n')[0]!.deps).toEqual(["b", "c"]));
});

describe("5 · o upstream", () => {
  const CARGO = lerDaRaiz(O_CARGO)!;
  test("o symbios-tensor do registro reprova", () =>
    acusa(com({ [O_CARGO]: troca(CARGO, 'symbios-tensor = { path = "../../upstream" }', 'symbios-tensor = "0.4"') }), "não vem por path"));
  test("um [patch] reprova", () => acusa(com({ [O_CARGO]: `${CARGO}\n[patch.crates-io]\nrand = { path = "x" }\n` }), "tem [patch] ou [replace]"));
  test("um [patch] comentado aprova", () => expect(com({ [O_CARGO]: `${CARGO}\n# [patch.crates-io]\n` })).toEqual([]));
});

describe("6 · o rust-toolchain.toml", () => {
  test("medido: é byte a byte o do upstream", () => expect(lerDaRaiz(O_TOOLCHAIN)).toBe(lerDaRaiz(O_TOOLCHAIN_DO_UPSTREAM)));
  test("o arquivo que passa a diferir, e o item ainda diz cópia, reprova", () =>
    acusa(com({ [O_TOOLCHAIN]: `${lerDaRaiz(O_TOOLCHAIN)}# daqui\n` }), "diz byte a byte o do upstream, e não é"));
  test("o item que deixa de dizer cópia, e é, reprova", () => acusa(naPagina("byte a byte o do `upstream/`", "a versão fixa"), "não diz que é byte a byte"));
});

describe("7 · os números do LAB-00 em dois lugares", () => {
  const ANALISE = lerDaRaiz(A_ANALISE)!;
  test("medido: os dois lugares dizem o mesmo", () => {
    expect(osNumerosDaPagina(PAGINA)).toEqual({ bytes: 162696, segundos: 12.54 });
    expect(osNumerosDaSecao(aSecao10(ANALISE)!.corpo)).toEqual({ bytes: 162696, segundos: 12.54, kb: 159 });
  });
  test("os bytes da análise que divergem reprovam", () => acusa(com({ [A_ANALISE]: troca(ANALISE, "— 162 696 bytes", "— 162 697 bytes") }), "bytes = 162697"));
  test("os segundos da análise que divergem reprovam", () => acusa(com({ [A_ANALISE]: troca(ANALISE, "in 12.54s", "in 12.55s") }), "segundos = 12.55"));
  test("os bytes da página que divergem reprovam (as duas menções mudam juntas)", () =>
    acusa(com({ [A_PAGINA]: PAGINA.replaceAll("162 696 bytes", "162 000 bytes") }), "e a página diz 162000"));
  test("os KB que não são os bytes ÷ 1024 reprovam", () => acusa(com({ [A_ANALISE]: troca(ANALISE, "**159 KB", "**160 KB") }), "diz 160 KB"));
  test("a página sem os bytes reprova", () => acusa(com({ [A_PAGINA]: PAGINA.replaceAll(" bytes", " octetos") }), "sem os bytes"));
  test("a página sem os segundos reprova", () => acusa(naPagina("compilado em 12,54 s", "compilado"), "sem os segundos"));
  test("sem a frase dos dois lugares reprova", () => acusa(naPagina("moram em dois lugares", "moram aqui"), "não diz que os números"));
  test("a frase dos dois lugares sem nomear a análise depois dela reprova", () =>
    acusa(naPagina("e a seção 10 de `docs/SYMBIOS_ANALYSIS.md` (que", "e a seção 10 da análise (que"), "não nomeia docs/SYMBIOS_ANALYSIS.md"));
});

describe("8 · a seção 10 citada", () => {
  const ANALISE = lerDaRaiz(A_ANALISE)!;
  test("a seção renomeada para outra coisa reprova", () =>
    acusa(com({ [A_ANALISE]: troca(ANALISE, "## 10. Viabilidade WebAssembly", "## 10. Outra coisa") }), "se chama «Outra coisa"));
  test("a seção sem o erro reprova", () =>
    acusa(com({ [A_ANALISE]: troca(ANALISE, "error: The wasm32-unknown-unknown targets are not supported by default;", "error: outro;") }), "não traz o erro"));
  test("a página sem o erro reprova", () => acusa(naPagina("`error: The wasm32", "`erro: The wasm32"), "não cita o erro"));
});

describe("9 · os caminhos", () => {
  test("link que não resolve reprova", () => acusa(naPagina("](../wasm/)", "](../wasm-velha/)"), "o link ../wasm-velha/"));
  test("docs/ que não existe reprova", () => acusa(naPagina("seção 10 de `docs/SYMBIOS_ANALYSIS.md`", "seção 10 de `docs/SYMBIOS.md`"), "docs/SYMBIOS.md não existe"));
  test("external-engines/ que não existe reprova", () =>
    acusa(naPagina("`external-engines/esteira/src/o-wasm-nao-pede-nada.ts`", "`external-engines/esteira/src/o-wasm.ts`"), "o-wasm.ts não existe"));
  test("a página que some reprova", () => acusa(com({ [A_PAGINA]: null }), "a página não existe"));
});
