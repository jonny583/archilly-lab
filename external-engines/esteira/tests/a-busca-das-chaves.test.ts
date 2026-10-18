/**
 * **LAB-166 (item 900) · nenhuma chave sensível no repositório — a busca da página, a cada verde** (D394).
 *
 * ```sh
 * bun test tests/a-busca-das-chaves.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` afirma, desde o LF-FINAL (14/09/2026), que a busca dos oito nomes de chave dá **zero
 * ocorrências** — um `grep` rodado uma vez. Ficou falso em 05/10/2026 (LAB-47) e ninguém viu; e a varredura de segredos
 * não responde esta linha: as oito linhas plantadas abaixo passam caladas por ela. O motivo inteiro está no cabeçalho de
 * `src/a-busca-das-chaves.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 *
 * Todo nome e todo valor deste arquivo vão **em pedaços**: escritos inteiros, este teste seria uma ocorrência da busca
 * que ele confere, e um achado da varredura de segredos.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_FONTE,
  A_LINHA,
  A_PAGINA,
  DECLARADAS,
  NOMES,
  O_QUE_ISTO_NAO_ALCANCA,
  buscarNoTexto,
  conferirAArvore,
  conferirOsTextos,
  naPagina,
} from "../src/a-busca-das-chaves.ts";
import { varrerTexto } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** O valor de sempre (21 alfanuméricos, começa por letra), em pedaços. */
const V = ["k8Fq2Lm", "Zp9Xw3R", "t7Yv1Nb"].join("");
const N = {
  constante: "API" + "_KEY",
  campo: "api" + "Key",
  campoPython: "api" + "_key",
  segredo: "SEC" + "RET",
  autorizacao: "Author" + "ization",
  portador: "Bea" + "rer",
  vite: "VI" + "TE_SUPABASE_ANON_KEY",
};

/**
 * As oito linhas plantadas no LAB-166: a varredura de segredos passa calada pelas oito; a busca da página acusa sete. A
 * oitava escapa das DUAS: o `\b` da busca não separa `_` do nome (`JWT_` + o segredo), a mesma doença que o LAB-160 achou
 * na varredura com o `DB_` da senha. Declarado em `O_QUE_ISTO_NAO_ALCANCA` e na proposta da FILA.
 */
const PLANTADAS: readonly string[] = [
  `const ${N.constante} = "${V}";`,
  `const ${N.campo} = "${V}";`,
  `cliente({ ${N.campoPython}: "${V}" })`,
  `headers: { ${N.autorizacao}: "${N.portador} ${V}" }`,
  `const ${N.segredo} = "${V}";`,
  `{"${N.vite}": "${V}"}`,
  `const JWT_${N.segredo} = "${V}";`,
  `fetch(u, { headers: { authorization: \`${N.portador} ${V}\` } })`,
];

/** A árvore de hoje, mais o que o caso pede. */
const arvoreDeMentira = (extra: Record<string, string | null> = {}) =>
  new Map<string, string | null | undefined>([
    ["external-engines/esteira/src/coisa.ts", "export const x = 1;\n"],
    ["external-engines/esteira/tests/segredos.test.ts", `  '${N.campo}: "<a sua chave aqui>"',\n`],
    [
      "external-engines/esteira/tests/vazamento-de-custo.test.ts",
      `  "const cliente = new Anthropic({ ${N.campo}: k });",\n`,
    ],
    ["docs/SEGURANCA.md", `a busca: ${A_FONTE}\n`],
    ...Object.entries(extra),
  ]);

describe("LAB-166 · a linha está escrita onde mora, e aponta para esta trava", () => {
  const pagina = readFileSync(join(RAIZ, A_PAGINA), "utf8");
  const linha = pagina.split("\n").find((l) => l.startsWith(A_LINHA));

  test("o SEGURANCA.md tem a linha, com a busca que esta trava faz — letra por letra — e o nome da trava", () => {
    expect(linha).toBeDefined();
    // Na tabela o `|` vai escapado; a busca da página tem de ser a desta trava, senão a trava pergunta outra coisa.
    expect(linha).toContain(A_FONTE.replaceAll("|", "\\|"));
    expect(linha).toContain("a-busca-das-chaves.ts");
  });

  test("a linha não diz mais 'zero' sem data: o número de hoje é o que o teste imprime", () => {
    expect(linha).not.toMatch(/—\s*\*\*zero ocorrências\*\*\s*\|/);
  });

  test("cada declarada tem motivo, e o que a trava não alcança está dito", () => {
    for (const d of DECLARADAS) expect(d.motivo.length, d.arquivo).toBeGreaterThan(40);
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-166 · o que o git carrega hoje — os dois universos publicados", () => {
  test("toda ocorrência está declarada, e toda declarada ainda ocorre", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `[a-busca-das-chaves] página: ${r.lidosNaPagina} arquivos, ${r.ocorrenciasNaPagina.length} ocorrência(s) · larga: ${r.lidosNaLarga} arquivos, ${r.ocorrenciasNaLarga.length} ocorrência(s) · de fora: ${r.deFora.md} .md, ${r.deFora.binario} binário(s), ${r.deFora.naoLido} não lido(s) · ${r.problemas.length} problema(s)`,
    );
    expect(r.problemas).toEqual([]);
    // 473 e 535 em 18/10/2026, antes do commit do LAB-166; só crescem.
    expect(r.lidosNaPagina).toBeGreaterThanOrEqual(473);
    expect(r.lidosNaLarga).toBeGreaterThanOrEqual(535);
    expect(r.ocorrenciasNaLarga).toHaveLength(DECLARADAS.length);
  });
});

describe("LAB-166 · os dois lados da régua", () => {
  test("as oito plantadas: a varredura de segredos passa calada pelas oito, e a busca da página acusa sete", () => {
    const escapaDaBusca = PLANTADAS.filter((p) => buscarNoTexto(p, "src/x.ts").length === 0);
    for (const p of PLANTADAS)
      // Se isto mudar, a varredura melhorou: atualize o cabeçalho da régua e a proposta da FILA (LAB-166).
      expect(varrerTexto(p, "src/x.ts"), p.slice(0, 12)).toEqual([]);
    expect(PLANTADAS).toHaveLength(8);
    // O buraco declarado: o nome colado depois de `_`. Se a busca da página mudar e o fechar, este número cai.
    expect(escapaDaBusca).toEqual([PLANTADAS[6]]);
    expect(O_QUE_ISTO_NAO_ALCANCA.some((l) => l.includes("depois de `_`"))).toBe(true);
  });

  test("cada nome da busca acusa ao menos um exemplo — nenhuma régua morta", () => {
    const exemplos = [
      `x.${N.campo}`,
      `${N.campoPython}=1`,
      `${N.constante}=1`,
      `${N.segredo}=1`,
      `${N.portador} abc`,
      `${N.autorizacao}:`,
      "sk" + "-" + "A".repeat(20) + " ",
      `${N.vite}=1`,
    ];
    const nomes = new Set(exemplos.flatMap((e) => buscarNoTexto(e, "x.ts").map((o) => o.nome)));
    expect(nomes.size).toBe(NOMES.length);
  });

  test("a chave plantada no código reprova — e o registro diz o NOME, nunca o valor", () => {
    const r = conferirOsTextos(arvoreDeMentira({ "src/cliente.ts": `${PLANTADAS[0]}\n` }));
    expect(r.problemas.map((p) => p.tipo)).toEqual(["ocorrencia-nao-declarada"]);
    expect(r.problemas[0]?.detalhe).toContain("src/cliente.ts:1");
    expect(JSON.stringify(r)).not.toContain(V.slice(0, 6));
  });

  test("a extensão que a página não nomeava: a larga acusa, a da página não via", () => {
    for (const [c, t] of [
      ["external-engines/symbios/adapter/ferramentas/navegador/prova.mjs", PLANTADAS[3]],
      [".github/workflows/x.yml", PLANTADAS[4]],
      ["external-engines/ganchos/pre-push", PLANTADAS[0]],
      ["external-engines/symbios/upstream/src/x.rs", PLANTADAS[4]],
    ] as const) {
      const r = conferirOsTextos(arvoreDeMentira({ [c]: `${t}\n` }));
      const tipos = r.problemas.map((p) => p.tipo);
      expect(tipos.length, c).toBeGreaterThan(0);
      expect(new Set(tipos), c).toEqual(new Set(["ocorrencia-nao-declarada"]));
      expect(r.ocorrenciasNaPagina, c).toHaveLength(2);
      expect(naPagina(c), c).toBe(false);
    }
  });

  test("a declaração perdoa a LINHA do trecho, não o arquivo: outra ocorrência no mesmo teste reprova", () => {
    const a = arvoreDeMentira();
    a.set(
      "external-engines/esteira/tests/segredos.test.ts",
      `  '${N.campo}: "<a sua chave aqui>"',\n${PLANTADAS[0]}\n`,
    );
    const r = conferirOsTextos(a);
    expect(r.problemas.map((p) => p.tipo)).toEqual(["ocorrencia-nao-declarada"]);
    expect(r.problemas[0]?.detalhe).toContain("segredos.test.ts:2");
  });

  test("a declarada que sumiu reprova — a lista não envelhece calada", () => {
    const a = arvoreDeMentira();
    a.set("external-engines/esteira/tests/vazamento-de-custo.test.ts", "nada\n");
    const r = conferirOsTextos(a);
    expect(r.problemas.map((p) => p.tipo)).toEqual(["declarada-que-sumiu"]);
  });

  test("a declarada fora de teste reprova, mesmo ocorrendo", () => {
    const a = arvoreDeMentira({ "src/x.ts": `const c = { ${N.campo}: k };\n` });
    const r = conferirOsTextos(a, [
      ...DECLARADAS,
      { arquivo: "src/x.ts", trecho: `${N.campo}: k`, motivo: "x".repeat(50) },
    ]);
    expect(r.problemas.map((p) => p.tipo)).toEqual(["declarada-fora-de-teste"]);
  });

  test("universo vazio reprova", () => {
    const r = conferirOsTextos(new Map(), []);
    expect(r.problemas.map((p) => p.tipo)).toEqual(["universo-vazio"]);
  });

  test("o caso válido que quase parece inválido passa", () => {
    const certos = [
      // A leitura do ambiente vai em pedaços: escrita inteira, a trava do "nada pago" (LAB-148) a lê como porta nova.
      "const chave = process." + "env.CHAVE_DO_PROVEDOR;",
      `const ${N.campo}s = [];`,
      `${N.segredo}ARIA municipal`,
      "VI" + "TE_ ",
      `${N.portador}Token`,
      "sk" + "-curta",
      `const ${N.campo.toLowerCase()} = 1;`,
    ];
    for (const c of certos) expect(buscarNoTexto(c, "x.ts"), c).toEqual([]);
    // O .md fala dos nomes e não conta; o binário sai contado.
    const r = conferirOsTextos(arvoreDeMentira({ "docs/x.md": PLANTADAS[0] ?? "", "a.png": null }));
    expect(r.problemas).toEqual([]);
    expect(r.deFora).toEqual({ binario: 1, md: 2, naoLido: 0 });
  });
});
