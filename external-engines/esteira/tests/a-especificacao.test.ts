/**
 * **LAB-170 (item 900) · a especificação como chegou — o comentário do topo passa a ser perguntado** (D398).
 *
 * ```sh
 * bun test tests/a-especificacao.test.ts
 * ```
 *
 * A `docs/referencia/LABORATORIO.md` (LAB-00, 09/09/2026) dizia no topo que *"a numeração das seções foi tornada
 * sequencial"*, e nenhum código a lia; nove subseções ainda carregavam o número de outra seção, quatro deles
 * repetidos. O motivo inteiro está no cabeçalho de `src/a-especificacao.ts`.
 *
 * Roda **sem clones** — o arquivo, o `git ls-files` desta casa e, quando a história está à mão, o `git show` do
 * commit de nascimento — e por isso está no portão sem clones do `verde.yml`. No checkout raso do CI o commit de
 * nascimento não existe; o teste que o lê diz isso e não finge que mediu.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_ESPECIFICACAO,
  CAMINHO_NO_NASCIMENTO,
  CITACOES_CONHECIDAS,
  COMMIT_DE_NASCIMENTO,
  IMPRESSAO_DO_TEXTO,
  citacoesEm,
  comentarioDoTopo,
  conferirAEspecificacao,
  conferirNumeracao,
  ehLugarDeCitacao,
  etapasDaSecao20,
  impressaoDoTexto,
  numerosDoComentario,
  titulosNumerados,
  type TipoDeProblema,
} from "../src/a-especificacao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const TEXTO = readFileSync(join(RAIZ, A_ESPECIFICACAO), "utf8");
const tipos = (t: string): TipoDeProblema[] => conferirNumeracao(titulosNumerados(t)).map((p) => p.tipo);

describe("LAB-170 · a especificação de verdade", () => {
  const r = conferirAEspecificacao(RAIZ);

  test("o universo é publicado, e não é zero", () => {
    console.log(
      `    ${r.titulos.length} títulos numerados · ${r.secoes} seções · ${r.subsecoes} subseções · ` +
        `etapas ${r.etapas.join("")} · ${r.problemas.length} problemas`,
    );
    // Contados no LAB-170, em 18/10/2026: 38 seções, 14 subseções (as cinco da 8, as cinco da 23, as quatro da 28).
    expect(r.secoes).toBeGreaterThanOrEqual(30);
    expect(r.subsecoes).toBeGreaterThanOrEqual(10);
  });

  test("a numeração: única, sequencial, e cada subseção dentro da sua seção", () => {
    expect(r.problemas).toEqual([]);
  });

  test("os dois números do comentário do topo são os do arquivo", () => {
    expect(r.comentario).not.toBeNull();
    expect(r.comentario).toEqual({ secoes: r.secoes, subsecoes: r.subsecoes });
  });

  test("o texto, sem o comentário e sem os números dos títulos, tem a impressão declarada", () => {
    expect(r.impressao).toBe(IMPRESSAO_DO_TEXTO);
  });

  test("as Etapas que o índice e a história prometem — A a G — são as da seção 20", () => {
    expect(r.etapas).toEqual(["A", "B", "C", "D", "E", "F", "G"]);
    for (const pagina of ["docs/INDEX.md", "docs/HISTORIA_DAS_REGRAS.md"]) {
      const linha = readFileSync(join(RAIZ, pagina), "utf8")
        .split("\n")
        .find((l) => l.includes("referencia/LABORATORIO.md"));
      expect(linha, pagina).toBeDefined();
      expect(linha!, pagina).toContain("Etapas A a G");
    }
  });

  test("toda citação de seção, por LUGAR, aponta para seção que existe — e as conhecidas, para o título que dizem", () => {
    const lugares = execFileSync("git", ["ls-files", "*.md"], { cwd: RAIZ, encoding: "utf8" })
      .split("\n")
      .filter((c) => c && ehLugarDeCitacao(c));
    const citacoes = lugares.flatMap((c) => citacoesEm(c, readFileSync(join(RAIZ, c), "utf8")));
    console.log(`    ${lugares.length} páginas lidas · ${citacoes.length} citações de seção`);
    expect(lugares.length).toBeGreaterThanOrEqual(50);
    const porNumero = new Map(r.titulos.filter((t) => t.numero.length === 1).map((t) => [t.numero[0], t.texto]));
    for (const c of citacoes) expect(porNumero.has(c.secao), `${c.arquivo}:${c.linha} cita a seção ${c.secao}`).toBe(true);
    for (const k of CITACOES_CONHECIDAS) {
      expect(
        citacoes.some((c) => c.arquivo === k.arquivo && c.secao === k.secao),
        `${k.arquivo} deixou de citar a seção ${k.secao}`,
      ).toBe(true);
      expect(porNumero.get(k.secao)).toBe(k.titulo);
    }
  });

  test("o texto não mudou desde o nascimento — quando a história está à mão", () => {
    let antigo: string;
    try {
      antigo = execFileSync("git", ["show", `${COMMIT_DE_NASCIMENTO}:${CAMINHO_NO_NASCIMENTO}`], {
        cwd: RAIZ,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      console.log(`    sem o ${COMMIT_DE_NASCIMENTO} neste clone (raso): a impressão de hoje vale, a do nascimento não foi lida`);
      return;
    }
    expect(impressaoDoTexto(antigo)).toBe(IMPRESSAO_DO_TEXTO);
    // E a prova de que o conserto foi preciso: o nascimento tinha os nove problemas da numeração.
    expect(conferirNumeracao(titulosNumerados(antigo)).length).toBeGreaterThan(0);
  });
});

describe("LAB-170 · a régua, nos dois lados", () => {
  const BOM = ["## 1. A", "### 1.1 a", "### 1.2 b", "## 2. B", "```", "## 9. dentro de cerca", "```", "## 3. C", "### 3.1 c"].join("\n");

  test("o caso bom passa, e o título dentro de bloco cercado não conta", () => {
    expect(tipos(BOM)).toEqual([]);
    expect(titulosNumerados(BOM).map((t) => t.numero.join("."))).toEqual(["1", "1.1", "1.2", "2", "3", "3.1"]);
  });

  test("o defeito que a especificação tinha: subseção com o número de outra seção, repetida", () => {
    const ruim = ["## 23. A", "### 24.1 a", "## 24. B", "## 28. C", "### 24.1 b"].join("\n");
    const t = tipos(ruim);
    expect(t).toContain("subsecao-sem-a-mae");
    expect(t).toContain("numero-repetido");
    expect(t).toContain("secao-fora-de-ordem"); // 24 → 28
  });

  test("seção que pula, subseção que pula, e número com a profundidade errada", () => {
    expect(tipos("## 1. A\n## 3. B")).toEqual(["secao-fora-de-ordem"]);
    expect(tipos("## 1. A\n### 1.2 a")).toEqual(["subsecao-fora-de-ordem"]);
    expect(tipos("## 1. A\n## 1.1 a")).toEqual(["profundidade-errada"]);
  });

  test("o comentário: lê os dois números, e a frase que some é null, nunca zero", () => {
    expect(numerosDoComentario("<!--\n  Hoje: 38 seções e 14\n  subseções numeradas, cada…\n-->\n# x")).toEqual({
      secoes: 38,
      subsecoes: 14,
    });
    expect(numerosDoComentario("<!-- sem a frase -->\n# x")).toBeNull();
    expect(numerosDoComentario("# sem comentário\n<!-- Hoje: 1 seções e 1 subseções numeradas -->")).toBeNull();
    expect(comentarioDoTopo(TEXTO)).toContain("LAB-170");
  });

  test("a impressão ignora o comentário e os números dos títulos — e só eles", () => {
    const a = "<!-- um -->\n## 1. Título\ntexto";
    expect(impressaoDoTexto("<!-- outro comentário -->\n## 7. Título\ntexto")).toBe(impressaoDoTexto(a));
    expect(impressaoDoTexto("<!-- um -->\n## 1. Titulo\ntexto")).not.toBe(impressaoDoTexto(a));
    expect(impressaoDoTexto("<!-- um -->\n## 1. Título\ntexto.")).not.toBe(impressaoDoTexto(a));
    // Uma palavra trocada na especificação de verdade muda a impressão.
    expect(impressaoDoTexto(TEXTO.replace("MÉTODO DE COMPARAÇÃO", "MÉTODO DE COMPARACAO"))).not.toBe(IMPRESSAO_DO_TEXTO);
  });

  test("a citação: as duas formas, e o nome sem seção não é citação", () => {
    expect(citacoesEm("x.md", "(`docs/referencia/LABORATORIO.md`, seção 36) pede").map((c) => c.secao)).toEqual([36]);
    expect(citacoesEm("x.md", "ver LABORATORIO.md §12").map((c) => c.secao)).toEqual([12]);
    expect(citacoesEm("x.md", "| `referencia/LABORATORIO.md` | a especificação (Etapas A a G) |")).toEqual([]);
    expect(ehLugarDeCitacao("docs/relatorios/LAB-01.md")).toBe(false);
    expect(ehLugarDeCitacao(A_ESPECIFICACAO)).toBe(false);
    expect(ehLugarDeCitacao("docs/TRIAGEM.md")).toBe(true);
  });

  test("as Etapas: só as da seção 20, e a seção que some dá lista vazia", () => {
    const t = ["## 19. X", "### Etapa Z --- fora", "## 20. COMO", "### Etapa A --- a", "### Etapa B --- b", "## 21. Y"].join("\n");
    expect(etapasDaSecao20(t)).toEqual(["A", "B"]);
    expect(etapasDaSecao20("## 1. X\n### Etapa A --- a")).toEqual([]);
  });
});
