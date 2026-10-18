/**
 * **LAB-179 (item 900) · chave de IA só no servidor da Central — "o Lab não chama IA", e as quatro travas que a linha
 * não nomeava** (D407).
 *
 * ```sh
 * bun test tests/a-ia-na-pagina.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026): *"Chave de IA só no servidor da Central · não se aplica ·
 * o Lab não chama IA. Ver `ADOCAO_CENTRAL.md`"*. Verdade, e perguntada por quatro travas nascidas depois — a chave
 * (LAB-47), a chamada (LAB-80), a porta paga (LAB-148) e a rede (LAB-158) —, que a linha não nomeava. O motivo inteiro
 * está no cabeçalho de `src/a-ia-na-pagina.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_TRAVAS,
  A_LINHA,
  A_PAGINA,
  A_SECAO,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  REGRAS_DE_CHAVE_DE_IA,
  aLinha,
  aTabela,
  conferirAArvore,
  conferirAPagina,
  medir,
  type Medicao,
} from "../src/a-ia-na-pagina.ts";
import { CHAMADA_PAGA_DE_IA } from "../src/destino-do-que-sai.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, A_PAGINA), "utf8");
const MEDIDO = medir(RAIZ);

const tipos = (pagina: string | null, m: Medicao = MEDIDO) => conferirAPagina(pagina, m).map((p) => p.tipo);
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
const A_LINHA_DE_ANTES = "| Chave de IA só no servidor da Central | ✅ **não se aplica** | o Lab não chama IA. Ver `ADOCAO_CENTRAL.md` |";

describe("LAB-179 · a casa de hoje", () => {
  test("a árvore passa — e os quatro universos são publicados", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `   [a-ia-na-pagina] lidos: chave ${r.medicao.lidos.chave}, chamada ${r.medicao.lidos.chamada}, porta ${r.medicao.lidos.porta}, rede ${r.medicao.lidos.rede} · ` +
        `achados: ${AS_TRAVAS.map((t) => `${t.pergunta} ${r.medicao.achados[t.pergunta]}`).join(", ")}`,
    );
    expect(r.problemas, r.problemas.map((p) => p.detalhe).join("\n")).toEqual([]);
    for (const t of AS_TRAVAS) expect(r.medicao.lidos[t.pergunta], t.pergunta).toBeGreaterThan(0);
  });

  test("as quatro réguas acham zero hoje — o Lab não guarda chave de IA nem a chama", () => {
    expect(MEDIDO.achados).toEqual({ chave: 0, chamada: 0, porta: 0, rede: 0 });
  });

  test("os dois números da linha são o tamanho das duas listas de formas", () => {
    expect(REGRAS_DE_CHAVE_DE_IA.length).toBeGreaterThan(0);
    expect(aLinha(PAGINA)).toContain(`**${REGRAS_DE_CHAVE_DE_IA.length}** formas de chave de IA`);
    expect(aLinha(PAGINA)).toContain(`**${CHAMADA_PAGA_DE_IA.length}** formas do import e da chamada`);
  });

  test("a tabela tem as quatro travas, uma linha cada", () => {
    expect(aTabela(PAGINA)!.size).toBe(AS_TRAVAS.length);
  });
});

describe("LAB-179 · a página de antes reprova, e cada defeito pelo nome", () => {
  test("a linha do LF-FINAL, sem a seção: sem trava, dez nomes calados, os dois números e a tabela — catorze", () => {
    const antes = PAGINA.replace(aLinha(PAGINA)!, A_LINHA_DE_ANTES).split(`\n${A_SECAO}`)[0]!;
    const t = tipos(antes);
    expect(t.filter((x) => x === "linha-sem-trava")).toHaveLength(1);
    expect(t.filter((x) => x === "linha-nao-nomeia")).toHaveLength(10);
    expect(t.filter((x) => x === "linha-numero-errado")).toHaveLength(2);
    expect(t).toContain("tabela-ausente");
    expect(t).toHaveLength(14);
  });

  test("a página sem a linha", () => {
    expect(tipos(PAGINA.replace(aLinha(PAGINA)!, "| outra coisa | ✅ | x |"))).toContain("linha-ausente");
    expect(tipos(null)).toEqual(expect.arrayContaining(["linha-ausente", "tabela-ausente"]));
  });

  test.each(AS_TRAVAS.map((t) => [t.trava, t.desde] as const))("a linha que cala %s", (trava) => {
    expect(tipos(naLinha(trava, "outra-trava.ts"))).toEqual(["linha-nao-nomeia"]);
  });

  test("a linha que cala esta trava, ou que troca LAB-179 por LAB-1790", () => {
    expect(tipos(naLinha(O_PONTEIRO, "x.ts"))).toEqual(["linha-nao-nomeia"]);
    const linha = aLinha(PAGINA)!;
    expect(linha.match(/LAB-179\b/g)!.length).toBeGreaterThanOrEqual(1);
    expect(tipos(PAGINA.replace(linha, linha.replaceAll("LAB-179", "LAB-1790")))).toEqual(["linha-nao-nomeia"]);
  });

  test("um número da linha errado", () => {
    expect(tipos(naLinha("**3** formas de chave de IA", "**4** formas de chave de IA"))).toEqual(["linha-numero-errado"]);
    expect(tipos(naLinha("**6** formas do import", "**5** formas do import"))).toEqual(["linha-numero-errado"]);
  });

  test("a seção sem uma trava, ou com uma quinta", () => {
    expect(tipos(naPagina("| a rede no caminho do motor | `rede-em-execucao.ts` | LAB-158 | 0 |\n", ""))).toEqual(["tabela-sem-trava"]);
    expect(
      tipos(naPagina("| a rede no caminho do motor |", "| outra | `a-busca-das-chaves.ts` | LAB-166 | 0 |\n| a rede no caminho do motor |")),
    ).toEqual(["tabela-com-outra"]);
  });

  test("a rodada errada na tabela", () => {
    expect(tipos(naPagina("| `nada-pago.ts` | LAB-148 |", "| `nada-pago.ts` | LAB-149 |"))).toEqual(["tabela-rodada-errada"]);
  });

  test("o módulo que deixa de nomear a rodada que a tabela lhe dá", () => {
    const m: Medicao = { ...MEDIDO, modulos: { ...MEDIDO.modulos, rede: MEDIDO.modulos.rede!.replaceAll("LAB-158", "LAB-x") } };
    expect(tipos(PAGINA, m)).toEqual(["tabela-rodada-errada"]);
  });

  test("um achado na árvore e a tabela ainda dizendo zero — cada pergunta", () => {
    for (const t of AS_TRAVAS) {
      const m: Medicao = { ...MEDIDO, achados: { ...MEDIDO.achados, [t.pergunta]: 1 } };
      expect(tipos(PAGINA, m), t.pergunta).toEqual(["tabela-numero-errado"]);
    }
  });

  test("régua que não leu nada, e trava que o git não carrega", () => {
    expect(tipos(PAGINA, { ...MEDIDO, lidos: { ...MEDIDO.lidos, chamada: 0 } })).toEqual(["universo-vazio"]);
    const semModulo: Medicao = { ...MEDIDO, modulos: { ...MEDIDO.modulos, chave: null } };
    expect(tipos(PAGINA, semModulo)).toEqual(["universo-vazio"]);
  });
});

describe("LAB-179 · o que ela não alcança, dito", () => {
  test("o buraco está escrito, e nomeia as duas formas que só a porta pega", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    const tudo = O_QUE_ISTO_NAO_ALCANCA.join("\n");
    expect(tudo).toContain("Rust");
    expect(tudo).toContain("nenhuma das quatro réguas conhece");
  });

  test("a linha continua começando como a régua a procura", () => {
    expect(PAGINA.split("\n").filter((l) => l.startsWith(A_LINHA))).toHaveLength(1);
  });
});
