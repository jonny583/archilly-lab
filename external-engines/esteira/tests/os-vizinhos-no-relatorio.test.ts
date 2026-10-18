/**
 * **LAB-177 (item 900) · os vizinhos são só leitura — e o relatório diz o `git status` deles** (D405).
 *
 * ```sh
 * bun test tests/os-vizinhos-no-relatorio.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026): *"`git status` nos três ao fim de **toda** rodada, e o
 * número sai no relatório"*. A primeira metade tem trava desde o LAB-38 (`regras.test.ts` §4), e a linha não a nomeava;
 * a segunda não tinha nenhuma — e 38 relatórios não dizem. O motivo inteiro está no cabeçalho de
 * `src/os-vizinhos-no-relatorio.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_LINHA,
  A_PAGINA,
  A_TRAVA_DO_CLONE,
  CALADOS,
  DESDE,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  aLinha,
  conferirAArvore,
  conferirOsRelatorios,
  dizOStatusDosVizinhos,
} from "../src/os-vizinhos-no-relatorio.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, A_PAGINA), "utf8");

const DIZ = "Os três vizinhos, só para leitura; `git status` limpo nos três no fim.\n";
const CALA = "Nada sobre os vizinhos aqui.\n";

/**
 * A árvore mínima que passa: a página de verdade e um relatório por número que a árvore de hoje tem — calado nos
 * declarados, dizendo nos outros (o número que a linha escreve é o dos relatórios de antes do LAB-177, perguntado).
 */
const HOJE = conferirAArvore(RAIZ);
const BASE: Record<string, string> = Object.fromEntries([
  [A_PAGINA, PAGINA],
  ...HOJE.calados.map((n) => [`docs/relatorios/LAB-${n}.md`, CALA]),
  ...HOJE.dizem.map((n) => [`docs/relatorios/LAB-${n}.md`, DIZ]),
  [`docs/relatorios/LAB-${DESDE}.md`, DIZ],
  ["docs/relatorios/LF-FINAL.md", CALA],
]);

const conferir = (extra: Record<string, string | null> = {}) => {
  const arvore = new Map<string, string | null>(Object.entries(BASE));
  for (const [k, v] of Object.entries(extra)) {
    if (v === null) arvore.delete(k);
    else arvore.set(k, v);
  }
  return conferirOsRelatorios([...arvore.keys()], (c) => arvore.get(c) ?? null);
};
const tipos = (r: ReturnType<typeof conferir>) => r.problemas.map((p) => p.tipo);
const naLinha = (de: string, para: string) => {
  const linha = aLinha(PAGINA)!;
  expect(linha).toContain(de);
  return { [A_PAGINA]: PAGINA.replace(linha, linha.replace(de, para)) };
};

describe("LAB-177 · a árvore de hoje", () => {
  test("todo relatório de LAB-177 em diante diz, o passado bate com CALADOS, e a linha nomeia as duas travas", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `relatórios LAB-<n> lidos: ${r.lidos} · dizem o git status dos vizinhos: ${r.dizem.length} · calados: ${r.calados.length} (declarados: ${CALADOS.length})`,
    );
    for (const l of O_QUE_ISTO_NAO_ALCANCA) console.log(`  não alcança: ${l}`);
    expect(r.problemas).toEqual([]);
    expect(r.lidos).toBeGreaterThan(CALADOS.length);
    expect(r.calados).toEqual([...CALADOS]);
  });

  test("a linha existe, nomeia esta trava, a do clone e o LAB-177, e escreve o número dos calados", () => {
    const linha = aLinha(PAGINA);
    expect(linha).not.toBeNull();
    expect(linha!.startsWith(A_LINHA)).toBe(true);
    for (const n of [O_PONTEIRO, A_TRAVA_DO_CLONE, `LAB-${DESDE}`]) expect(linha).toContain(n);
    expect(linha).toContain(`**${CALADOS.length}**`);
  });

  test("a trava do clone existe e ainda pergunta o `git status --porcelain` dos três", () => {
    const t = readFileSync(join(RAIZ, A_TRAVA_DO_CLONE), "utf8");
    expect(t).toContain('"status", "--porcelain"');
    for (const v of ["motor-testfit", "urban-create-hub-41d93a4d", "urban-scout-tool"]) expect(t).toContain(`"${v}"`);
  });
});

describe("LAB-177 · o que conta como dizer, dos dois lados", () => {
  test("as formas que os relatórios usam contam", () => {
    for (const f of [
      "`git status` limpo nos três clones (`motor-testfit`, `urban-create-hub-41d93a4d`, `urban-scout-tool`)",
      "## 7 · Os vizinhos ficaram limpos\n\n`git status` nos três clones de leitura ao fim da rodada — **nenhuma alteração**",
      "**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três",
      "`git status` nos três: **0 alterações** em `urban-scout-tool`, `urban-create-hub-41d93a4d` e `motor-testfit`",
      "Generate `f8943c7`, Laboratório de Parcelamento `f1fc84c`, Geo `3582c32`; `git status` limpo nos três ao fim",
      "- **Clones vizinhos limpos:** `git status` em `motor-testfit`,\n  `urban-create-hub-41d93a4d` e `urban-scout-tool` — **sem nenhuma alteração**",
    ])
      expect(dizOStatusDosVizinhos(f), f).toBe(true);
  });

  test("`git status` sem os vizinhos, sem resultado, ou os vizinhos sem `git status`, não contam", () => {
    for (const f of [
      "Todas desfeitas (o arquivo restaurado da cópia, o `git status` conferido).",
      "Os três vizinhos ficaram limpos.",
      "rodei `git status` aqui e o índice tinha os três arquivos novos",
      "",
    ])
      expect(dizOStatusDosVizinhos(f), f).toBe(false);
  });

  test("a palavra longe demais do `git status` não conta (a janela é a do módulo)", () => {
    const longe = "`git status` rodado." + " palavra".repeat(60) + " os três vizinhos limpos.";
    expect(dizOStatusDosVizinhos(longe)).toBe(false);
  });
});

describe("LAB-177 · as mutações, cada uma acusada pelo nome", () => {
  test("a base mínima passa", () => {
    expect(tipos(conferir())).toEqual([]);
  });

  test("relatório de LAB-177 em diante calado → relatorio-calado", () => {
    expect(tipos(conferir({ [`docs/relatorios/LAB-${DESDE}.md`]: CALA }))).toEqual(["relatorio-calado"]);
    expect(tipos(conferir({ [`docs/relatorios/LAB-${DESDE + 50}.md`]: CALA }))).toEqual(["relatorio-calado"]);
  });

  test("relatório antigo calado e fora da lista → calado-fora-da-lista", () => {
    expect(tipos(conferir({ "docs/relatorios/LAB-4.md": CALA }))).toEqual(["calado-fora-da-lista"]);
  });

  test("declarado que passou a dizer, ou que sumiu → declaracao-que-sobra", () => {
    expect(tipos(conferir({ [`docs/relatorios/LAB-${CALADOS[0]}.md`]: DIZ }))).toEqual(["declaracao-que-sobra"]);
    // O que sumiu também muda o número de relatórios de antes do LAB-177 — as duas acusações, cada uma pelo nome.
    expect(tipos(conferir({ [`docs/relatorios/LAB-${CALADOS[1]}.md`]: null }))).toEqual(["declaracao-que-sobra", "linha-numero-errado"]);
  });

  test("o relatório que não é rodada LAB-<n> não é perguntado", () => {
    expect(tipos(conferir({ "docs/relatorios/LAB01_ADAPTADOR.md": CALA, "docs/relatorios/RECADOS.md": CALA }))).toEqual([]);
  });

  test("a página sem a linha → linha-ausente", () => {
    expect(tipos(conferir({ [A_PAGINA]: "# nada\n" }))).toEqual(["linha-ausente"]);
  });

  test("a linha que cala uma trava ou o LAB-177 → linha-nao-nomeia", () => {
    expect(tipos(conferir(naLinha(O_PONTEIRO, "a régua")))).toEqual(["linha-nao-nomeia"]);
    expect(tipos(conferir(naLinha(A_TRAVA_DO_CLONE, "a trava")))).toEqual(["linha-nao-nomeia"]);
  });

  test("o número dos calados ou dos relatórios escrito errado → linha-numero-errado", () => {
    expect(tipos(conferir(naLinha(`**${CALADOS.length}**`, `**${CALADOS.length + 1}**`)))).toEqual(["linha-numero-errado"]);
    const antes = [...HOJE.dizem, ...HOJE.calados].filter((n) => n < DESDE).length;
    expect(tipos(conferir(naLinha(`dos ${antes} relatórios`, `dos ${antes + 1} relatórios`)))).toEqual(["linha-numero-errado"]);
    // E um relatório antigo a mais na árvore muda o número perguntado: a linha passa a estar errada.
    expect(tipos(conferir({ "docs/relatorios/LAB-1.md": DIZ }))).toEqual(["linha-numero-errado"]);
  });

  test("a promessa antiga de volta → linha-promete-demais", () => {
    const linha = aLinha(PAGINA)!;
    const outra = PAGINA.replace(linha, `${linha.slice(0, -1)} \`git status\` nos três ao fim de **toda** rodada, e o número sai no relatório |`);
    expect(tipos(conferir({ [A_PAGINA]: outra }))).toEqual(["linha-promete-demais"]);
  });

  test("nenhum relatório lido → universo-vazio (e o passado inteiro sobra)", () => {
    const r = conferirOsRelatorios([A_PAGINA], (c) => (c === A_PAGINA ? PAGINA : null));
    expect(tipos(r)).toContain("universo-vazio");
    expect(r.lidos).toBe(0);
  });
});
