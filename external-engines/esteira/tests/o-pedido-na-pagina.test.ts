/**
 * **LAB-178 (item 900) · o que precisa mudar nos vizinhos vira lista em relatório — e os quatro exemplos da página**
 * (D406).
 *
 * ```sh
 * bun test tests/o-pedido-na-pagina.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026): *"LAB-07 §9 (8 correções), LAB-02 §5, LAB-03 e LAB-08 —
 * todos com o número e sem commit lá"*. A regra tem trava desde o LAB-149, que a linha não nomeava; dos quatro exemplos,
 * dois saíram em prosa. O motivo inteiro está no cabeçalho de `src/o-pedido-na-pagina.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_LINHA,
  A_PAGINA,
  A_SECAO,
  A_TRAVA_DOS_RELATORIOS,
  EXEMPLOS,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  aLinha,
  conferirAArvore,
  conferirAPagina,
  contar,
} from "../src/o-pedido-na-pagina.ts";
import { SEM_LISTA_ANTES_DA_TRAVA } from "../src/pedido-ao-vizinho.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, A_PAGINA), "utf8");
const caminho = (n: number) => `docs/relatorios/LAB-${String(n).padStart(2, "0")}.md`;
const BASE: Record<string, string> = Object.fromEntries([
  [A_PAGINA, PAGINA],
  ...EXEMPLOS.map((n) => [caminho(n), readFileSync(join(RAIZ, caminho(n)), "utf8")]),
]);

const conferir = (extra: Record<string, string | null> = {}) => {
  const arvore = new Map<string, string | null>(Object.entries(BASE));
  for (const [k, v] of Object.entries(extra)) {
    if (v === null) arvore.delete(k);
    else arvore.set(k, v);
  }
  return conferirAPagina([...arvore.keys()], (c) => arvore.get(c) ?? null);
};
const tipos = (r: ReturnType<typeof conferir>) => r.problemas.map((p) => p.tipo);
const naPagina = (de: string, para: string) => {
  expect(PAGINA).toContain(de);
  return { [A_PAGINA]: PAGINA.replace(de, para) };
};
const naLinha = (de: string, para: string) => {
  const linha = aLinha(PAGINA)!;
  expect(linha).toContain(de);
  return { [A_PAGINA]: PAGINA.replace(linha, linha.replace(de, para)) };
};

describe("LAB-178 · a árvore de hoje", () => {
  test("a linha nomeia as duas travas, e a tabela bate com a régua do LAB-149 nos quatro exemplos", () => {
    const r = conferirAArvore(RAIZ);
    for (const [n, c] of r.medido)
      console.log(`LAB-${n}: ${c.lugares} lugar(es) de pedido · ${c.comLista} com lista (${c.itens} itens) · ${c.congelados} congelado(s)`);
    for (const l of O_QUE_ISTO_NAO_ALCANCA) console.log(`  não alcança: ${l}`);
    expect(r.problemas).toEqual([]);
    expect(r.lidos).toBe(EXEMPLOS.length);
  });

  test("a medição de 18/10: dois dos quatro exemplos em prosa, e só o LAB-07 com lista que a régua vê", () => {
    const r = conferirAArvore(RAIZ);
    expect(r.medido.get(7)).toEqual({ lugares: 2, comLista: 1, itens: 8, congelados: 1 });
    expect(r.medido.get(3)).toEqual({ lugares: 1, comLista: 0, itens: 0, congelados: 1 });
    expect(r.medido.get(2)!.lugares).toBe(0);
    expect(r.medido.get(8)!.lugares).toBe(0);
  });

  test("a linha começa pelo item, aponta para as duas travas e escreve o número da lista congelada do LAB-149", () => {
    const linha = aLinha(PAGINA)!;
    expect(linha.startsWith(A_LINHA)).toBe(true);
    for (const n of [A_TRAVA_DOS_RELATORIOS, O_PONTEIRO]) expect(linha).toContain(n);
    expect(linha).toContain(`**${Object.keys(SEM_LISTA_ANTES_DA_TRAVA).length}** pedidos sem lista`);
  });
});

describe("LAB-178 · a contagem, dos dois lados", () => {
  test("título de pedido com lista conta itens; sem lista e congelado conta congelado; prosa não conta lugar", () => {
    expect(contar("LAB-999.md", "## Para o Generate — lista numerada\n\n1. um\n2. dois\n")).toEqual({
      lugares: 1,
      comLista: 1,
      itens: 2,
      congelados: 0,
    });
    expect(contar("LAB-999.md", "## Para o Generate — lista numerada\n\nem prosa\n")).toEqual({
      lugares: 1,
      comLista: 0,
      itens: 0,
      congelados: 0,
    });
    expect(contar("LAB-999.md", "**Para o chat repassar ao Generate**:\n\n1. um\n").lugares).toBe(0);
  });
});

describe("LAB-178 · as mutações, cada uma acusada pelo nome", () => {
  test("a base passa", () => {
    expect(tipos(conferir())).toEqual([]);
  });

  test("a página sem a linha → linha-ausente", () => {
    const linha = aLinha(PAGINA)!;
    expect(tipos(conferir({ [A_PAGINA]: PAGINA.replace(linha, "| outra |") }))).toEqual(["linha-ausente"]);
  });

  test("a linha que cala uma trava ou uma rodada → linha-nao-nomeia", () => {
    expect(tipos(conferir(naLinha(O_PONTEIRO, "a régua")))).toEqual(["linha-nao-nomeia"]);
    expect(tipos(conferir(naLinha(A_TRAVA_DOS_RELATORIOS, "a trava")))).toEqual(["linha-nao-nomeia"]);
  });

  test("o número dos congelados errado → linha-numero-errado", () => {
    const k = Object.keys(SEM_LISTA_ANTES_DA_TRAVA).length;
    expect(tipos(conferir(naLinha(`**${k}** pedidos`, `**${k + 1}** pedidos`)))).toEqual(["linha-numero-errado"]);
  });

  test("a promessa antiga de volta → linha-promete-demais", () => {
    const linha = aLinha(PAGINA)!;
    const outra = PAGINA.replace(linha, `${linha.slice(0, -1)} todos com o número |`);
    expect(tipos(conferir({ [A_PAGINA]: outra }))).toEqual(["linha-promete-demais"]);
  });

  test("a linha que cita relatório fora da tabela → linha-cita-fora-da-tabela", () => {
    const linha = aLinha(PAGINA)!;
    const outra = PAGINA.replace(linha, `${linha.slice(0, -1)} e o LAB-24 |`);
    expect(tipos(conferir({ [A_PAGINA]: outra }))).toEqual(["linha-cita-fora-da-tabela"]);
  });

  test("a seção sem a tabela → tabela-ausente; sem um exemplo → tabela-sem-exemplo; com outro → tabela-com-outro", () => {
    expect(tipos(conferir(naPagina(A_SECAO, "## Outra seção")))).toEqual(["tabela-ausente"]);
    expect(tipos(conferir(naPagina("| LAB-08 | 0 |", "| LAB-8x | 0 |")))).toEqual(["tabela-sem-exemplo"]);
    expect(tipos(conferir(naPagina("| LAB-08 | 0 |", "| LAB-24 | 0 | 0 | 0 | 0 | x |\n| LAB-08 | 0 |")))).toEqual([
      "tabela-com-outro",
    ]);
  });

  test("um número da tabela errado → tabela-numero-errado; e o relatório que muda muda a resposta", () => {
    expect(tipos(conferir(naPagina("| LAB-07 | 2 | 1 | 8 |", "| LAB-07 | 2 | 1 | 9 |")))).toEqual(["tabela-numero-errado"]);
    const lab08 = BASE[caminho(8)]! + "\n## Para o Generate — lista numerada\n\n1. a pergunta do §2.4\n";
    expect(tipos(conferir({ [caminho(8)]: lab08 }))).toEqual([
      "tabela-numero-errado",
      "tabela-numero-errado",
      "tabela-numero-errado",
    ]);
  });

  test("exemplo que o git não carrega, ou nenhum → universo-vazio", () => {
    expect(tipos(conferir({ [caminho(2)]: null }))).toEqual(["universo-vazio"]);
    const r = conferirAPagina([A_PAGINA], (c) => (c === A_PAGINA ? PAGINA : null));
    expect(r.lidos).toBe(0);
    expect(tipos(r).filter((t) => t === "universo-vazio")).toHaveLength(EXEMPLOS.length + 1);
  });
});
