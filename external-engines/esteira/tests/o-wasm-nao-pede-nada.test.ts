/**
 * **LAB-176 (item 900) · o `.wasm` não pede nada do ambiente — perguntado ao que o produz e ao que o carrega** (D404).
 *
 * ```sh
 * bun test tests/o-wasm-nao-pede-nada.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026), que o `.wasm` é carregado com objeto de imports vazio e
 * que, *"medido no LAB-01"*, tem zero imports — uma medição sobre um binário que não é versionado e que nenhuma máquina de
 * sessão compila. O motivo inteiro está no cabeçalho de `src/o-wasm-nao-pede-nada.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_LINHA,
  A_PAGINA,
  A_RECEITA,
  INSTANCIADORES,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  PONTES,
  artefatoDe,
  caminhoDoBinario,
  conferirAArvore,
  conferirOWasm,
  dependenciasDoBinario,
  ehCdylib,
  importsDasInstanciacoes,
  importsDoBinario,
} from "../src/o-wasm-nao-pede-nada.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (c: string) => readFileSync(join(RAIZ, c), "utf8");
const PONTE = PONTES.find((p) => p.papel === "carregada")!.pasta;
const SONDA = PONTES.find((p) => p.papel === "sonda")!.pasta;
const MOTOR = INSTANCIADORES[0]!.caminho;
const BANCADA = INSTANCIADORES[1]!.caminho;

/** A árvore mínima que passa: a página, a receita, os dois instanciadores e as duas crates, de verdade. */
const BASE: Record<string, string> = {
  [A_PAGINA]: ler(A_PAGINA),
  [A_RECEITA]: ler(A_RECEITA),
  [MOTOR]: ler(MOTOR),
  [BANCADA]: ler(BANCADA),
  [`${PONTE}/Cargo.toml`]: ler(`${PONTE}/Cargo.toml`),
  [`${PONTE}/Cargo.lock`]: ler(`${PONTE}/Cargo.lock`),
  [`${PONTE}/src/lib.rs`]: ler(`${PONTE}/src/lib.rs`),
  [`${SONDA}/Cargo.toml`]: ler(`${SONDA}/Cargo.toml`),
  [`${SONDA}/Cargo.lock`]: ler(`${SONDA}/Cargo.lock`),
};

const conferir = (extra: Record<string, string | null> = {}, bytes: Uint8Array<ArrayBuffer> | null = null) => {
  const arvore = new Map<string, string | null>(Object.entries(BASE));
  for (const [k, v] of Object.entries(extra)) {
    if (v === null) arvore.delete(k);
    else arvore.set(k, v);
  }
  return conferirOWasm([...arvore.keys()], (c) => arvore.get(c) ?? null, () => bytes);
};
const tipos = (r: ReturnType<typeof conferir>) => r.problemas.map((p) => p.tipo);
const trocar = (caminho: string, de: string, para: string) => {
  const t = BASE[caminho]!;
  expect(t).toContain(de);
  return { [caminho]: t.replace(de, para) };
};

/** Um módulo WebAssembly vazio (zero imports) e um que pede `env.f`, montados byte a byte. */
const VAZIO = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
const COM_IMPORT = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
  0x01, 0x04, 0x01, 0x60, 0x00, 0x00,
  0x02, 0x09, 0x01, 0x03, 0x65, 0x6e, 0x76, 0x01, 0x66, 0x00, 0x00,
]);

describe("LAB-176 · a árvore de hoje, e o universo que ela leu", () => {
  test("passa, e publica o que leu", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `    ${r.caminhos} caminhos · ${r.lidosJs} JS/TS · ${r.instanciacoes.length} instanciadores · ${r.cdylibs.length} crates cdylib · binário: ${r.binario === null ? "ausente (não medido)" : `${r.binario} imports`} · ${r.problemas.length} problemas`,
    );
    for (const n of O_QUE_ISTO_NAO_ALCANCA) console.log(`    NÃO alcança: ${n}`);
    expect(r.problemas).toEqual([]);
    expect(r.lidosJs).toBeGreaterThan(300);
    expect(r.instanciacoes.map((x) => x.caminho).sort()).toEqual(INSTANCIADORES.map((x) => x.caminho).sort());
    expect(r.cdylibs.sort()).toEqual(PONTES.map((p) => p.pasta).sort());
  });

  test("a linha da página existe e aponta para esta trava", () => {
    const linha = BASE[A_PAGINA]!.split("\n").find((l) => l.startsWith(A_LINHA));
    expect(linha).toBeDefined();
    expect(linha).toContain(O_PONTEIRO);
    expect(linha).toContain("não é medido em máquina de sessão");
  });
});

describe("LAB-176 · as peças da régua, dos dois lados", () => {
  test("os imports de cada instanciação, sem comentário e sem string", () => {
    expect(importsDasInstanciacoes("await WebAssembly.instantiate(bytes, {});")).toEqual(["{}"]);
    expect(importsDasInstanciacoes("await WebAssembly.instantiate(bytes, { env: { f } });")).toEqual(["{env:{f}}"]);
    expect(importsDasInstanciacoes("await WebAssembly.instantiateStreaming(fetch(u), {})")).toEqual(["{}"]);
    expect(importsDasInstanciacoes("new WebAssembly.Instance(m, imps)")).toEqual(["imps"]);
    expect(importsDasInstanciacoes("WebAssembly.instantiate(f(a, b))")).toEqual([null]);
    expect(importsDasInstanciacoes("// WebAssembly.instantiate(b, { env })\nconst x = 1;")).toEqual([]);
    expect(importsDasInstanciacoes('const s = "WebAssembly.instantiate(b, { env })";')).toEqual([]);
    expect(importsDasInstanciacoes("WebAssembly.compile(b)")).toEqual([]);
  });

  test("o binário: zero imports no módulo vazio, um no que pede `env.f`, e `null` no que não compila", () => {
    expect(importsDoBinario(VAZIO)).toBe(0);
    expect(importsDoBinario(COM_IMPORT)).toBe(1);
    expect(importsDoBinario(new Uint8Array([1, 2, 3]))).toBeNull();
  });

  test("o Cargo.toml: cdylib, artefato e as dependências que entram no binário", () => {
    const ponte = BASE[`${PONTE}/Cargo.toml`]!;
    expect(ehCdylib(ponte)).toBe(true);
    expect(artefatoDe(ponte)).toBe("archilly_symbios_wasm.wasm");
    expect(ehCdylib('[package]\nname = "x"\n# crate-type = ["cdylib"]\n')).toBe(false);
    const deps = dependenciasDoBinario(
      '[dependencies]\na = "1"\nb = { version = "2", features = ["f"] }\n[dev-dependencies]\nc = "3"\n[dependencies.d]\nversion = "4"\nfeatures = ["js"]\n',
    );
    expect([...deps.keys()].sort()).toEqual(["a", "b", "d"]);
    expect(deps.get("d")).toContain('"js"');
  });

  test("o caminho do binário vem da receita, não é escrito de novo", () => {
    expect(caminhoDoBinario(BASE[A_RECEITA]!)).toBe(
      "external-engines/symbios/archilly/wasm/target/wasm32-unknown-unknown/release/archilly_symbios_wasm.wasm",
    );
  });
});

describe("LAB-176 · as mutações — cada uma acusada pelo nome", () => {
  test("a base passa, sem binário e com um binário vazio", () => {
    expect(tipos(conferir())).toEqual([]);
    expect(conferir().binario).toBeNull();
    expect(tipos(conferir({}, VAZIO))).toEqual([]);
    expect(conferir({}, VAZIO).binario).toBe(0);
  });

  test("o binário que pede import", () => {
    expect(tipos(conferir({}, COM_IMPORT))).toEqual(["binario-pede-imports"]);
  });

  test("o adaptador que passa imports, ou que deixa de passar o `{}`", () => {
    expect(tipos(conferir(trocar(MOTOR, "WebAssembly.instantiate(modulo, {})", "WebAssembly.instantiate(modulo, { env: {} })")))).toEqual([
      "instanciacao-com-imports",
    ]);
    expect(tipos(conferir(trocar(MOTOR, "WebAssembly.instantiate(modulo, {})", "WebAssembly.instantiate(modulo)")))).toEqual([
      "instanciacao-com-imports",
    ]);
  });

  test("um instanciador novo, fora da lista; e um que deixou de instanciar", () => {
    expect(tipos(conferir({ "external-engines/esteira/src/outro.ts": "await WebAssembly.instantiate(b, {});\n" }))).toEqual([
      "instanciador-fora-da-lista",
    ]);
    expect(tipos(conferir(trocar(BANCADA, "WebAssembly.instantiate(bytes, {})", "carregar(bytes)")))).toEqual(["instanciador-que-mudou"]);
  });

  test("a ponte que liga o `wasm_js` no getrandom, ou que depende do wasm-bindgen", () => {
    expect(tipos(conferir(trocar(`${PONTE}/Cargo.toml`, 'getrandom = "0.3"', 'getrandom = { version = "0.3", features = ["wasm_js"] }')))).toEqual([
      "cola-no-cargo-toml",
    ]);
    expect(tipos(conferir(trocar(`${PONTE}/Cargo.toml`, 'getrandom = "0.3"', 'getrandom = "0.3"\nwasm-bindgen = "0.2"')))).toEqual([
      "cola-no-cargo-toml",
    ]);
  });

  test("a cola que chega pelo Cargo.lock", () => {
    const lock = `${BASE[`${PONTE}/Cargo.lock`]!}\n[[package]]\nname = "js-sys"\nversion = "0.3.0"\n`;
    expect(tipos(conferir({ [`${PONTE}/Cargo.lock`]: lock }))).toEqual(["cola-no-cargo-lock"]);
  });

  test("o backend `custom` apagado, comentado, ou fora da receita", () => {
    const lib = BASE[`${PONTE}/src/lib.rs`]!;
    expect(tipos(conferir({ [`${PONTE}/src/lib.rs`]: lib.replace("fn __getrandom_v03_custom(", "fn outra_coisa(") }))).toEqual([
      "backend-ausente",
    ]);
    expect(tipos(conferir({ [`${PONTE}/src/lib.rs`]: lib.replace("unsafe extern \"Rust\" fn __getrandom_v03_custom(", "// fn __getrandom_v03_custom(\nfn x(") }))).toEqual([
      "backend-ausente",
    ]);
    expect(tipos(conferir(trocar(A_RECEITA, 'getrandom_backend=\\"custom\\"', 'getrandom_backend=\\"wasm_js\\"')))).toEqual(["backend-ausente"]);
  });

  test("o import declarado à mão no Rust da ponte; o mesmo texto num comentário passa", () => {
    const lib = BASE[`${PONTE}/src/lib.rs`]!;
    expect(tipos(conferir({ [`${PONTE}/src/lib.rs`]: `${lib}\nextern "C" {\n    fn agora() -> f64;\n}\n` }))).toEqual([
      "import-declarado-a-mao",
    ]);
    expect(tipos(conferir({ [`${PONTE}/src/lib.rs`]: `${lib}\n// extern "C" { fn agora() -> f64; }\n` }))).toEqual([]);
  });

  test("a sonda — que TEM a cola — passa; e passa a ser acusada quando alguém a carrega", () => {
    expect(BASE[`${SONDA}/Cargo.toml`]).toContain("wasm_js");
    expect(tipos(conferir({ "external-engines/esteira/ferramentas/labX.ts": `const p = "release/${"symbios_wasm_probe"}.wasm";\n` }))).toEqual([
      "sonda-carregada",
    ]);
  });

  test("uma crate cdylib nova, fora da lista; e uma que sumiu", () => {
    expect(
      tipos(conferir({ "external-engines/outro/archilly/wasm/Cargo.toml": '[package]\nname = "x"\n[lib]\ncrate-type = ["cdylib"]\n' })),
    ).toEqual(["ponte-fora-da-lista"]);
    expect(tipos(conferir({ [`${SONDA}/Cargo.toml`]: null }))).toEqual(["ponte-que-sumiu"]);
  });

  test("a ponte cujo artefato a receita não carrega", () => {
    expect(tipos(conferir(trocar(`${PONTE}/Cargo.toml`, 'name = "archilly-symbios-wasm"', 'name = "outro-nome"')))).toEqual([
      "carregada-sem-artefato-na-receita",
    ]);
  });

  test("a linha que cala a trava, um instanciador ou a ponte; e a página sem a linha", () => {
    expect(tipos(conferir(trocar(A_PAGINA, `(\`${O_PONTEIRO}\`;`, "(a trava;")))).toEqual(["linha-nao-nomeia"]);
    expect(tipos(conferir(trocar(A_PAGINA, "(`symbios/adapter/src/motor.ts`,", "(o adaptador,")))).toEqual(["linha-nao-nomeia"]);
    expect(tipos(conferir(trocar(A_PAGINA, "a ponte `symbios/archilly/wasm/` sem cola", "a ponte sem cola")))).toEqual(["linha-nao-nomeia"]);
    expect(tipos(conferir(trocar(A_PAGINA, A_LINHA, "| O binário não pede nada")))).toEqual(["linha-ausente"]);
  });

  test("o universo vazio", () => {
    expect(tipos(conferirOWasm([], () => null))).toContain("universo-vazio");
  });
});
