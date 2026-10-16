/**
 * **LAB-118 (item 900) · o índice afirma o que existe, e é conferido no que afirma** (D346).
 *
 * ```sh
 * bun test tests/o-indice.test.ts
 * ```
 *
 * Seis relatórios (`LAB-70.md` a `LAB-75.md`) nunca tiveram linha na seção *"um relatório por
 * prompt"*, e três linhas da tabela *"Decisão e fila"* afirmavam o estado de um dia que passou
 * (*"72 decisões"*, *"a fila de 19/09 esgotou"*, *"Hoje: quanto é desvio desproporcional?"*).
 * Lê só arquivos deste repositório — entra no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  PAGINAS_QUE_MUDAM_A_CADA_RODADA,
  afirmacoesDeEstado,
  relatoriosForaDoIndice,
} from "../src/o-indice.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

describe("LAB-118 · todo relatório tem a sua linha no índice", () => {
  const arquivos = [
    "docs/relatorios/LAB-70.md",
    "docs/relatorios/LAB-76.md",
    "docs/relatorios/RECADOS.md",
    "docs/provas/LAB-70/x.json",
    "docs/relatorios/sub/pasta.md",
  ];

  test("o lado ruim: o defeito de 16/10 reproduzido — relatório sem ligação reprova, pelo caminho", () => {
    const indice = "| [`relatorios/LAB-76.md`](relatorios/LAB-76.md) | x |\n[r](relatorios/RECADOS.md)";
    const r = relatoriosForaDoIndice(arquivos, indice);
    expect(r.fora).toEqual(["docs/relatorios/LAB-70.md"]);
    expect(r.lidos).toBe(3);
  });

  test("o lado bom: com a ligação, passa — e prova e subpasta não são relatório", () => {
    const indice = "[a](relatorios/LAB-70.md) [b](./relatorios/LAB-76.md#x) [c](relatorios/RECADOS.md)";
    expect(relatoriosForaDoIndice(arquivos, indice).fora).toEqual([]);
  });

  test("o caso que quase parece bom: o NOME entre crases, sem ligação, não é linha no índice", () => {
    const indice = "o `relatorios/LAB-70.md` existe\n[b](relatorios/LAB-76.md) [c](relatorios/RECADOS.md)";
    expect(relatoriosForaDoIndice(arquivos, indice).fora).toEqual(["docs/relatorios/LAB-70.md"]);
  });

  test("a ligação resolve pela pasta do índice: `../docs/relatorios/…` vale, `relatorios/` de outra raiz não", () => {
    expect(relatoriosForaDoIndice(["docs/relatorios/A.md"], "[a](../docs/relatorios/A.md)").fora).toEqual([]);
    expect(relatoriosForaDoIndice(["docs/relatorios/A.md"], "[a](../relatorios/A.md)").fora).toEqual([
      "docs/relatorios/A.md",
    ]);
  });
});

describe("LAB-118 · a linha de página que muda a cada rodada diz o que ela responde, não o que ela diz hoje", () => {
  const paginas = ["docs/DECISOES.md", "docs/ONDE_PARAMOS.md"];

  test("o lado ruim: as três formas de 16/10 reproduzidas — contagem, data e “Hoje:”", () => {
    const r = afirmacoesDeEstado(
      [
        "| [`DECISOES.md`](DECISOES.md) | Por que a casa é assim. 72 decisões numeradas |",
        "| [`ONDE_PARAMOS.md`](ONDE_PARAMOS.md) | a fila de 19/09 esgotou. Hoje: **quanto é?** |",
      ].join("\n"),
      paginas,
    );
    expect(r.afirmacoes.map((a) => `${a.linha} ${a.motivo} ${a.trecho}`)).toEqual([
      "1 algarismo 72",
      "2 algarismo 19/09",
      "2 hoje: Hoje:",
    ]);
  });

  test("o lado bom: citação não é estado — prompt, decisão, item, seção e o caminho entre crases", () => {
    const r = afirmacoesDeEstado(
      [
        "| [`DECISOES.md`](DECISOES.md) | Por que a casa é assim (LAB-06). A D61 é do Jonny; regra no `CLAUDE.md` §1-B, item 030 |",
        "| [`ONDE_PARAMOS.md`](ONDE_PARAMOS.md) | **Onde estamos hoje**, e o que ficou esperando — ver [`LAB-1`](x.md) |",
      ].join("\n"),
      paginas,
    );
    expect(r.afirmacoes).toEqual([]);
    expect(r.linhasLidas).toBe(2);
    expect(r.semUmaLinha).toEqual([]);
  });

  test("“Hoje:” em negrito também é anúncio do dia", () => {
    const r = afirmacoesDeEstado("| [d](DECISOES.md) | **Hoje**: a D99 |\n| [o](ONDE_PARAMOS.md) | x |", paginas);
    expect(r.afirmacoes.map((a) => a.motivo)).toEqual(["hoje:"]);
  });

  test("só a linha que LIGA para a página no primeiro campo é lida — a mesma frase noutra linha é de outro dono", () => {
    const r = afirmacoesDeEstado(
      "| [d](DECISOES.md) | x |\n| [o](ONDE_PARAMOS.md) | y |\n| [t](TRIAGEM.md) | 72 decisões, veja [d](DECISOES.md) |",
      paginas,
    );
    expect(r.afirmacoes).toEqual([]);
    expect(r.linhasLidas).toBe(2);
  });

  test("o outro sentido: página sem linha, ou com duas, reprova — ausência não aprova", () => {
    const r = afirmacoesDeEstado("| [d](DECISOES.md) | x |\n| [d](DECISOES.md) | y |", paginas);
    expect(r.semUmaLinha).toEqual([
      { pagina: "docs/DECISOES.md", linhas: 2 },
      { pagina: "docs/ONDE_PARAMOS.md", linhas: 0 },
    ]);
  });
});

describe("LAB-118 · o índice de hoje — e o universo lido, publicado", () => {
  const indice = readFileSync(join(RAIZ, "docs/INDEX.md"), "utf8");
  const arquivos = execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8" }).split("\n");

  test("todo relatório versionado tem uma ligação no índice", () => {
    const r = relatoriosForaDoIndice(arquivos, indice);
    const resumo = `lidos ${r.lidos} relatórios e ${r.ligacoesLidas} ligações do índice`;
    // Os seis que motivaram a régua: sem eles no universo, ela aprova por não ler.
    for (const n of [70, 71, 72, 73, 74, 75]) {
      expect(arquivos, `docs/relatorios/LAB-${n}.md saiu do universo — ${resumo}`).toContain(
        `docs/relatorios/LAB-${n}.md`,
      );
    }
    expect(r.lidos, resumo).toBeGreaterThan(100);
    expect(r.fora, `relatório sem linha no índice — "um relatório por prompt" (${resumo})`).toEqual([]);
  });

  test("as linhas das páginas que mudam a cada rodada não afirmam o estado do dia", () => {
    const r = afirmacoesDeEstado(indice);
    const resumo = `lidas ${r.linhasLidas} linhas de ${PAGINAS_QUE_MUDAM_A_CADA_RODADA.length} páginas`;
    expect(r.semUmaLinha, resumo).toEqual([]);
    expect(r.linhasLidas, resumo).toBe(PAGINAS_QUE_MUDAM_A_CADA_RODADA.length);
    expect(
      r.afirmacoes.map((a) => `${a.pagina} (INDEX.md:${a.linha}) ${a.motivo} "${a.trecho}"`),
      `o que a página diz hoje, ela mesma diz — ${resumo}`,
    ).toEqual([]);
  });
});
