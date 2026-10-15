/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NÚMERO DA DECISÃO NÃO TEM TETO DE CASAS. (LAB-112, item 900, D339)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A proposta do LAB-104, medida por LUGAR: das oito linhas de código que leem a decisão pela
 * forma, duas tinham teto — a classe `decisao-registrada` (duas casas: defeito aberto desde a
 * D100) e a lista de decisões de um item da FILA (três casas: a D1000 sumiria). O motivo inteiro
 * está no cabeçalho de `src/numero-da-decisao.ts`.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - a forma única aceita duas, três e quatro casas e **não corta** `D1000`;
 * - as duas leituras consertadas leem três e quatro casas — e as formas velhas, reproduzidas aqui,
 *   não liam (o caso ruim fica demonstrado, não lembrado);
 * - o histórico do `RECADOS.md` sai igual: as quatro rodadas da classe seguem nela;
 * - nenhum `.ts` versionado em `external-engines/` volta a ler a decisão com teto no CÓDIGO, fora
 *   das exceções declaradas — e exceção que não o tem mais reprova.
 *
 * Lê só arquivo deste repositório e não importa clone: vai no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ancorarRecado, lerRecados } from "../src/classes-de-rodada.ts";
import {
  DECISAO_DA_CASA,
  EXCECOES_DE_TETO,
  conferirTetoDeCasas,
  decisoesCitadas,
  larguraDaLeitura,
  tetoDeCasasNoCodigo,
} from "../src/numero-da-decisao.ts";
import { lerPropostas } from "../src/varredura-das-propostas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** O universo: todo `.ts` versionado em `external-engines/`, menos `upstream/` (intocável, §3). */
function universo(): { arquivo: string; texto: string }[] {
  return execFileSync("git", ["ls-files", "external-engines/**/*.ts", "external-engines/*.ts"], {
    cwd: RAIZ,
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter((a) => a && !a.includes("/upstream/"))
    .map((arquivo) => ({ arquivo, texto: readFileSync(join(RAIZ, arquivo), "utf8") }));
}

describe("LAB-112 · a forma única do número da decisão (D339)", () => {
  const inteira = new RegExp(`^${DECISAO_DA_CASA}$`);

  test("O LADO BOM: duas, três e quatro casas são decisão", () => {
    for (const d of ["D01", "D99", "D100", "D339", "D1000"]) expect(inteira.test(d), d).toBe(true);
  });

  test("O LADO RUIM: uma casa, nenhuma, minúscula e outro prefixo não são", () => {
    for (const d of ["D1", "D", "d339", "DD-006", "LAB-104"]) expect(inteira.test(d), d).toBe(false);
  });

  test("as citadas: com fronteira, sem repetição, e a D1000 inteira — a forma velha a perdia", () => {
    expect(decisoesCitadas("(D1000, D99, D99; e a D338)")).toEqual(["D1000", "D338", "D99"]);
    expect(decisoesCitadas("LAB-104 e DD-006 e D1")).toEqual([]);
    // A forma velha, reproduzida: a D1000 some em silêncio.
    expect([..."(D1000, D99)".matchAll(/\bD(\d{2,3})\b/g)].map((m) => `D${m[1]}`)).toEqual(["D99"]);
  });
});

describe("LAB-112 · as duas leituras consertadas", () => {
  test("a classe `decisao-registrada` lê `D339 —` — e a forma velha a deixava ÓRFÃ", () => {
    for (const titulo of ["13/10/2026 · D99 — o Jonny decidiu", "13/10/2026 · D339 — o Jonny decidiu"]) {
      expect(ancorarRecado({ titulo, prompt: "—" }).ancora, titulo).toBe("decisao-registrada");
    }
    // A forma velha, reproduzida: três casas não casam, e o título sobrava sem classe.
    expect(/\bD\d\d\b —/.test("13/10/2026 · D339 — o Jonny decidiu")).toBe(false);
    // E sem o travessão segue sem classe: o conserto não alarga o que a classe aceita.
    expect(ancorarRecado({ titulo: "13/10/2026 · a D339 foi lida", prompt: "—" }).ancora).toBe("ORFAO");
  });

  test("o histórico sai IGUAL: as quatro rodadas da classe seguem nela", () => {
    const recados = lerRecados(readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8"));
    expect(recados.length, "o universo dos recados").toBeGreaterThan(100);
    const daClasse = recados.map(ancorarRecado).filter((a) => a.ancora === "decisao-registrada");
    expect(daClasse.map((a) => a.titulo.slice(0, 10))).toEqual(["15/09/2026", "20/09/2026", "20/09/2026", "10/10/2026"]);
  });

  test("a lista de decisões de um item da FILA lê a D1000 — e a da FILA de hoje não muda", () => {
    const doc = (d: string) => `## Proposto ao chat — não executar\n\n- **Uma coisa** (${d}, D99)\n\n## fim\n`;
    expect(lerPropostas(doc("D338"))[0]!.decisoes).toEqual(["D338", "D99"]);
    expect(lerPropostas(doc("D1000"))[0]!.decisoes).toEqual(["D1000", "D99"]);
    // A FILA de hoje, lida pelas duas formas: o conserto não muda nenhuma citação existente.
    const itens = lerPropostas(readFileSync(join(RAIZ, "docs", "prompts", "FILA.md"), "utf8"));
    expect(itens.length, "o universo dos itens").toBeGreaterThan(20);
    for (const i of itens) {
      const velha = [...new Set([...i.texto.matchAll(/\bD(\d{2,3})\b/g)].map((m) => `D${m[1]}`))].sort();
      expect(i.decisoes, `linha ${i.linha}`).toEqual(velha);
    }
  });
});

describe("LAB-112 · o teto não renasce no código", () => {
  test("a largura de cada leitura — o teto é o que conta", () => {
    expect(larguraDaLeitura(String.raw`\d\d\b —`)).toEqual({ min: 2, max: 2 });
    expect(larguraDaLeitura(String.raw`(\d{2,3})\b`)).toEqual({ min: 2, max: 3 });
    expect(larguraDaLeitura(String.raw`\d\d\d?`)).toEqual({ min: 2, max: 3 });
    expect(larguraDaLeitura(String.raw`[0-9]{3}`)).toEqual({ min: 3, max: 3 });
    expect(larguraDaLeitura(String.raw`\d{2,}`)).toEqual({ min: 2, max: Infinity });
    expect(larguraDaLeitura(String.raw`(?:\d+)`)).toEqual({ min: 1, max: Infinity });
    expect(larguraDaLeitura("ECISOES")).toBeNull();
  });

  test("a régua acha as cinco grafias com teto", () => {
    const ruins = [
      String.raw`const a = /\bD\d\d\b —/;`,
      String.raw`const b = /\bD(\d{2,3})\b/g;`,
      String.raw`const c = /^## (D[0-9]{3}) · /;`,
      String.raw`const d = /D\d\d\d?/;`,
      'const e = new RegExp("\\\\bD\\\\d{3}\\\\b");',
    ];
    for (const r of ruins) expect(tetoDeCasasNoCodigo(r), r).toEqual([1]);
  });

  test("e NÃO acha o que quase parece: sem teto, teto de uma casa, outra palavra, comentário", () => {
    const boas = [
      String.raw`const a = /\bD\d+\b/g;`,
      "const b = new RegExp(String.raw`\\b${DECISAO_DA_CASA}\\b`);",
      String.raw`const c = /^\|\s*D\d/;`,
      String.raw`const d = /\n## (D\d+) · /;`,
      String.raw`const e = /DD-\d{3}/; const f = /ID\d\d/;`,
      String.raw`const g = /D\d+(?:\/D\d+)?/g;`,
      "const h = `DECISOES.md · D${n}`;",
    ];
    for (const b of boas) expect(tetoDeCasasNoCodigo(b), b).toEqual([]);
    expect(tetoDeCasasNoCodigo("// a forma velha era `\\bD\\d\\d\\b`\nconst x = 1;")).toEqual([]);
    expect(tetoDeCasasNoCodigo("/** era `D\\d\\d` */\nconst y = /\\bD\\d\\d\\b/;")).toEqual([2]);
  });

  test("a árvore de hoje: zero achados fora das exceções, e nenhuma exceção velha", () => {
    const u = universo();
    // O tamanho do universo publicado: régua que lê zero arquivos sai verde.
    expect(u.length).toBeGreaterThan(200);
    for (const quem of [
      "external-engines/esteira/src/classes-de-rodada.ts",
      "external-engines/esteira/src/varredura-das-propostas.ts",
      "external-engines/esteira/src/varredura-do-que-eu-aceitei.ts",
    ]) {
      expect(u.some((a) => a.arquivo === quem), `${quem} fora do universo`).toBe(true);
    }
    const r = conferirTetoDeCasas(u);
    expect(
      r.achados.map((a) => `${a.arquivo}:${a.linhas.join(",")}`),
      "número de decisão lido com teto de casas — use DECISAO_DA_CASA (src/numero-da-decisao.ts)",
    ).toEqual([]);
    expect(r.excecoesVelhas, "exceção que não contém mais a forma — tire-a da lista").toEqual([]);
  });

  test("O LADO RUIM na árvore: a forma velha plantada num arquivo vivo é achada", () => {
    const ALVO = "external-engines/esteira/src/classes-de-rodada.ts";
    const plantado = universo().map((a) =>
      a.arquivo === ALVO ? { ...a, texto: `${a.texto}\nconst z = /\\bD\\d\\d\\b —/;\n` } : a,
    );
    expect(conferirTetoDeCasas(plantado).achados.map((a) => a.arquivo)).toEqual([ALVO]);
  });

  test("toda exceção diz o motivo, e a exceção curada vira acusação", () => {
    for (const e of EXCECOES_DE_TETO) expect(e.motivo.length, e.arquivo).toBeGreaterThan(20);
    const EXC = "external-engines/esteira/tests/numero-da-decisao.test.ts";
    const curado = universo().map((a) => (a.arquivo === EXC ? { ...a, texto: "const nada = 1;\n" } : a));
    expect(conferirTetoDeCasas(curado).excecoesVelhas).toEqual([EXC]);
  });
});
