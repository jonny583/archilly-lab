/**
 * **LAB-180 (item 900) · nenhuma chave em `VITE_` — "não há build de navegador", e o `.wasm` embute uma variável de
 * compilação** (D408).
 *
 * ```sh
 * bun test tests/o-que-o-navegador-baixa.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026): *"não há build de navegador neste repositório; e a busca
 * acima cobre `VITE_`"*. Há um: o `.wasm` da ponte, que embute `SYMBIOS_VERSAO` (posta pelo `build.rs`, de arquivo
 * público). O motivo inteiro está no cabeçalho de `src/o-que-o-navegador-baixa.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { NOMES } from "../src/a-busca-das-chaves.ts";
import {
  AS_PERGUNTAS,
  A_BANCADA,
  A_LINHA,
  A_PAGINA,
  A_SECAO,
  EMBUTIDAS,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  aLinha,
  aTabela,
  conferir,
  conferirAArvore,
  medir,
  medirOsArquivos,
  type Medicao,
} from "../src/o-que-o-navegador-baixa.ts";
import { arquivosQueOGitCarrega } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, A_PAGINA), "utf8");
const MEDIDO = medir(RAIZ);
const ARQUIVOS = arquivosQueOGitCarrega(RAIZ);
const lerDaCasa = (c: string): string | null => {
  try {
    return readFileSync(join(RAIZ, c), "utf8");
  } catch {
    return null;
  }
};

const tipos = (pagina: string | null, m: Medicao = MEDIDO, nomes: readonly string[] = NOMES) => conferir(pagina, m, nomes).map((p) => p.tipo);
/** A casa com um arquivo trocado (ou acrescentado) — a régua rodada de novo, como na árvore. */
const comArquivo = (caminho: string, texto: string): Medicao =>
  medirOsArquivos(ARQUIVOS.includes(caminho) ? ARQUIVOS : [...ARQUIVOS, caminho], (c) => (c === caminho ? texto : lerDaCasa(c)));
const naPagina = (de: string, para: string) => {
  expect(PAGINA).toContain(de);
  return PAGINA.replace(de, para);
};
const naLinha = (de: string, para: string) => {
  const linha = aLinha(PAGINA)!;
  expect(linha).toContain(de);
  return PAGINA.replace(linha, linha.replace(de, para));
};
/** A linha do LF-FINAL, palavra por palavra. */
const A_LINHA_DE_ANTES = "| Nenhuma chave em `VITE_` | ✅ **não se aplica, e está limpo** | não há build de navegador neste repositório; e a busca acima cobre `VITE_` |";
const LIB = "external-engines/symbios/archilly/wasm/src/lib.rs";
const BUILD_RS = "external-engines/symbios/archilly/wasm/build.rs";
const PROVA_JS = `${A_BANCADA}prova.js`;
const PACOTE = "external-engines/esteira/package.json";

describe("LAB-180 · a casa de hoje", () => {
  test("a árvore passa — e os três universos são publicados", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `   [o-que-o-navegador-baixa] lidos: empacotador ${r.medicao.lidos.empacotador}, pagina ${r.medicao.lidos.pagina}, wasm ${r.medicao.lidos.wasm} · embutidas: ${r.medicao.embutidas.join(", ")}`,
    );
    expect(r.problemas, r.problemas.map((p) => p.detalhe).join("\n")).toEqual([]);
    for (const p of AS_PERGUNTAS) expect(r.medicao.lidos[p], p).toBeGreaterThan(0);
  });

  test("sem empacotador e sem ambiente na bancada; o .wasm embute uma variável, a da versão, posta pelo build.rs", () => {
    expect(MEDIDO.achados.filter((a) => a.pergunta !== "wasm")).toEqual([]);
    expect(MEDIDO.embutidas).toEqual(EMBUTIDAS.map((e) => e.nome));
    expect(MEDIDO.postasPeloBuildRs[EMBUTIDAS[0]!.ponte]).toContain(EMBUTIDAS[0]!.nome);
    expect(MEDIDO.buildLeAMaquina).toEqual([]);
  });

  test("a página da bancada são os dois arquivos que o servidor dela devolve como estão", () => {
    expect(MEDIDO.lidos.pagina).toBe(2);
  });

  test("a tabela tem as três perguntas, uma linha cada", () => {
    expect(aTabela(PAGINA)!.size).toBe(AS_PERGUNTAS.length);
  });
});

describe("LAB-180 · a árvore com o defeito reprova, cada um pelo nome — e a tabela, que dizia zero, junto", () => {
  test("uma dependência de empacotador, um script que o chama, uma configuração dele, uma chamada no código", () => {
    const pacote = lerDaCasa(PACOTE)!;
    const comDep = pacote.replace('"devDependencies": {', '"devDependencies": {\n    "vi' + 'te": "^6.0.0",');
    expect(comDep).not.toBe(pacote);
    expect(tipos(PAGINA, comArquivo(PACOTE, comDep))).toEqual(["empacotador", "tabela-numero-errado"]);
    const comScript = pacote.replace('"test": "bun test"', '"test": "bun test", "pagina": "bun build ./a.ts --outdir x"');
    expect(comScript).not.toBe(pacote);
    expect(tipos(PAGINA, comArquivo(PACOTE, comScript))).toEqual(["empacotador", "tabela-numero-errado"]);
    expect(tipos(PAGINA, comArquivo("external-engines/esteira/vi" + "te.config.ts", "export default {};\n"))).toContain("empacotador");
    expect(tipos(PAGINA, comArquivo("external-engines/esteira/src/x.ts", "await Bun.bu" + "ild({ entrypoints: [] });\n"))).toEqual(["empacotador", "tabela-numero-errado"]);
  });

  test("o comentário que FALA do empacotador não é ele", () => {
    expect(tipos(PAGINA, comArquivo("external-engines/esteira/src/x.ts", "// Bun.bu" + "ild( não se usa aqui\nconst a = 1;\n"))).toEqual([]);
  });

  test("a bancada que lê o ambiente, ou que leva um nome com prefixo público", () => {
    const js = lerDaCasa(PROVA_JS)!;
    expect(tipos(PAGINA, comArquivo(PROVA_JS, `${js}\nconst k = import.meta.en` + "v;\n"))).toEqual(["pagina-le-o-ambiente", "tabela-numero-errado"]);
    expect(tipos(PAGINA, comArquivo(PROVA_JS, `${js}\nconst k = "VI` + 'TE_CHAVE_DO_MAPA";\n'))).toEqual(["pagina-le-o-ambiente", "tabela-numero-errado"]);
  });

  test("o .wasm que embute uma chave da máquina: não declarada, e não posta pelo build.rs", () => {
    const lib = lerDaCasa(LIB)!;
    const m = comArquivo(LIB, `${lib}\nconst K: &str = en` + 'v!("CHAVE_DO_MAPA");\n');
    expect(tipos(PAGINA, m)).toEqual(expect.arrayContaining(["embutida-nao-declarada", "linha-numero-errado", "tabela-numero-errado"]));
  });

  test("a declarada que o build.rs deixa de pôr — viria da máquina", () => {
    const b = lerDaCasa(BUILD_RS)!;
    expect(b).toContain("cargo:rustc-env=SYMBIOS_VERSAO=");
    expect(tipos(PAGINA, comArquivo(BUILD_RS, b.replace("cargo:rustc-env=SYMBIOS_VERSAO=", "cargo:warning=")))).toEqual(["embutida-sem-build-rs"]);
  });

  test("o build.rs que lê a máquina", () => {
    const b = lerDaCasa(BUILD_RS)!;
    expect(tipos(PAGINA, comArquivo(BUILD_RS, `${b}\nfn x() { let _ = std::en` + 'v::var("CHAVE"); }\n'))).toEqual(["build-le-a-maquina"]);
  });

  test("a declarada que sumiu do código — o outro sentido", () => {
    const lib = lerDaCasa(LIB)!;
    const sem = lib.replace("en" + 'v!("SYMBIOS_VERSAO")', '"0.0.0"');
    expect(sem).not.toBe(lib);
    expect(tipos(PAGINA, comArquivo(LIB, sem))).toEqual(expect.arrayContaining(["declarada-que-sumiu"]));
  });

  test("a busca do LAB-166 sem o prefixo", () => {
    expect(tipos(PAGINA, MEDIDO, NOMES.filter((n) => !n.startsWith("VI" + "TE_")))).toEqual(["busca-sem-o-prefixo"]);
  });
});

describe("LAB-180 · a página de antes reprova, e cada defeito pelo nome", () => {
  test("a linha do LF-FINAL, sem a seção: o build negado, quatro nomes calados, o número, o nome e a tabela — oito", () => {
    const antes = PAGINA.replace(aLinha(PAGINA)!, A_LINHA_DE_ANTES).split(`\n${A_SECAO}`)[0]!;
    const t = tipos(antes);
    expect(t.filter((x) => x === "linha-sem-build")).toHaveLength(1);
    expect(t.filter((x) => x === "linha-nao-nomeia")).toHaveLength(4);
    expect(t.filter((x) => x === "linha-numero-errado")).toHaveLength(2);
    expect(t).toContain("tabela-ausente");
    expect(t).toHaveLength(8);
  });

  test("a página sem a linha, e sem página", () => {
    expect(tipos(PAGINA.replace(aLinha(PAGINA)!, "| outra coisa | ✅ | x |"))).toContain("linha-ausente");
    expect(tipos(null)).toEqual(expect.arrayContaining(["linha-ausente", "tabela-ausente"]));
  });

  test("a linha que cala esta trava, a do LAB-166, ou troca LAB-180 por LAB-1800", () => {
    expect(tipos(naLinha(O_PONTEIRO, "x.ts"))).toEqual(["linha-nao-nomeia"]);
    expect(tipos(naLinha("external-engines/esteira/src/a-busca-das-chaves.ts", "x.ts"))).toEqual(["linha-nao-nomeia"]);
    const linha = aLinha(PAGINA)!;
    expect(tipos(PAGINA.replace(linha, linha.replaceAll("LAB-180", "LAB-1800")))).toEqual(["linha-nao-nomeia"]);
  });

  test("o número da linha errado, e o nome calado", () => {
    expect(tipos(naLinha("**1** variável de compilação", "**2** variável de compilação"))).toEqual(["linha-numero-errado"]);
    expect(tipos(naLinha("`SYMBIOS_VERSAO`, posta", "a versão, posta"))).toEqual(["linha-numero-errado"]);
  });

  test("a frase de antes de volta na linha", () => {
    expect(tipos(naLinha("não há empacotador de navegador", "não há build de navegador"))).toEqual(["linha-sem-build"]);
  });

  test("a tabela sem uma pergunta, com uma quarta, ou com o número errado", () => {
    const linhaWasm = PAGINA.split("\n").find((l) => l.startsWith("| `wasm` |"))!;
    expect(tipos(naPagina(`${linhaWasm}\n`, ""))).toEqual(["tabela-sem-pergunta"]);
    expect(tipos(naPagina(linhaWasm, `| \`outra\` | x | 0 |\n${linhaWasm}`))).toEqual(["tabela-com-outra"]);
    expect(tipos(naPagina(linhaWasm, linhaWasm.replace("**1**", "**0**")))).toEqual(["tabela-numero-errado"]);
  });

  test("pergunta que não leu nada", () => {
    expect(tipos(PAGINA, { ...MEDIDO, lidos: { ...MEDIDO.lidos, pagina: 0 } })).toEqual(["universo-vazio"]);
  });
});

describe("LAB-180 · o que ela não alcança, dito", () => {
  test("o buraco está escrito, e nomeia o binário e a macro de outra crate", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    const tudo = O_QUE_ISTO_NAO_ALCANCA.join("\n");
    expect(tudo).toContain("binário");
    expect(tudo).toContain("macro de outra crate");
  });

  test("a linha continua começando como a régua a procura", () => {
    expect(PAGINA.split("\n").filter((l) => l.startsWith(A_LINHA))).toHaveLength(1);
  });
});
