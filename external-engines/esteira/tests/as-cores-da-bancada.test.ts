/**
 * **LAB-181 (item 900) · nada repintado fora do catálogo de design — "não há design", e há cor escrita à mão em três
 * lugares** (D409).
 *
 * ```sh
 * bun test tests/as-cores-da-bancada.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026): *"Não há design: a única página é a bancada, que é
 * ferramenta e não tela de usuário."* Há nove cores escritas à mão — seis na bancada, três no `.svg` que o upstream
 * pintou. O motivo inteiro está no cabeçalho de `src/as-cores-da-bancada.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PAGINA,
  A_SECAO,
  LUGARES,
  O_ITEM,
  O_PONTEIRO,
  O_QUE_ISTO_NAO_ALCANCA,
  aTabela,
  conferir,
  conferirAArvore,
  medir,
  medirOsArquivos,
  oItem,
  totalDeCores,
  type Medicao,
} from "../src/as-cores-da-bancada.ts";
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
/** Cor escrita em pedaços: inteira, ela seria achada neste arquivo. */
const cor = (s: string) => "#" + s;

const tipos = (pagina: string | null, m: Medicao = MEDIDO) => conferir(pagina, m).map((p) => p.tipo);
/** A casa com um arquivo trocado (ou acrescentado) — a régua rodada de novo, como na árvore. */
const comArquivo = (caminho: string, texto: string): Medicao =>
  medirOsArquivos(ARQUIVOS.includes(caminho) ? ARQUIVOS : [...ARQUIVOS, caminho], (c) => (c === caminho ? texto : lerDaCasa(c)));
const naPagina = (de: string, para: string) => {
  expect(PAGINA).toContain(de);
  return PAGINA.replace(de, para);
};
/** O item do LF-FINAL, palavra por palavra. */
const O_ITEM_DE_ANTES = `${O_ITEM} Não há design: a única página é a bancada, que é ferramenta e não\n  tela de usuário.\n`;
const itemDeHoje = () => {
  const linhas = PAGINA.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(O_ITEM));
  let j = i + 1;
  while (j < linhas.length && linhas[j]!.trim() !== "" && !linhas[j]!.startsWith("- ")) j++;
  return `${linhas.slice(i, j).join("\n")}\n`;
};
const HTML = LUGARES.find((l) => l.id === "bancada-html")!.caminho;
const JS = LUGARES.find((l) => l.id === "bancada-js")!.caminho;
const SVG = LUGARES.find((l) => l.id === "svg-do-upstream")!.caminho;

describe("LAB-181 · a casa de hoje", () => {
  test("a árvore passa — e os dois universos são publicados", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `   [as-cores-da-bancada] lidos: pagina ${r.medicao.lidos.pagina}, codigo ${r.medicao.lidos.codigo} · ${totalDeCores(r.medicao)} cores em ${Object.keys(r.medicao.cores).length} lugares`,
    );
    expect(r.problemas, r.problemas.map((p) => p.detalhe).join("\n")).toEqual([]);
    expect(r.medicao.lidos.pagina).toBeGreaterThan(0);
    expect(r.medicao.lidos.codigo).toBeGreaterThan(0);
  });

  test("as cores moram nos três lugares declarados, e em nenhum outro", () => {
    expect(Object.keys(MEDIDO.cores).sort()).toEqual(LUGARES.map((l) => l.caminho).sort());
    for (const l of LUGARES) expect(MEDIDO.cores[l.caminho], l.id).toEqual([...l.cores].sort());
    expect(totalDeCores(MEDIDO)).toBe(9);
  });

  test("a tabela tem os três lugares, uma linha cada", () => {
    expect(aTabela(PAGINA)!.size).toBe(LUGARES.length);
  });
});

describe("LAB-181 · a árvore com o defeito reprova, cada um pelo nome — e o item e a tabela, que diziam o número, junto", () => {
  test("uma cor nova na bancada: no <style> e no canvas", () => {
    const html = lerDaCasa(HTML)!;
    const outro = html.replace("max-width: 100%; }", `max-width: 100%; }\n  h1 { color: ${cor("b91c1c")}; }`);
    expect(outro).not.toBe(html);
    expect(tipos(PAGINA, comArquivo(HTML, outro))).toEqual(["cor-nova", "item-numero-errado", "tabela-numero-errado"]);
    const js = lerDaCasa(JS)!;
    expect(tipos(PAGINA, comArquivo(JS, `${js}\nctx.fillStyle = "${"rg" + "ba(0, 0, 0, 0.5)"}";\n`))).toEqual(["cor-nova", "item-numero-errado", "tabela-numero-errado"]);
  });

  test("uma página nova pintada, um .css, um componente — e uma string de cor num código qualquer", () => {
    const t1 = tipos(PAGINA, comArquivo("docs/painel/index.html", `<style>body { background: ${cor("fff")}; }</style>\n`));
    expect(t1).toEqual(["cor-fora-da-lista", "item-numero-errado"]);
    expect(tipos(PAGINA, comArquivo("external-engines/esteira/estilo.css", `a { color: hsl(210, 40%, 50%); }\n`))).toContain("cor-fora-da-lista");
    expect(tipos(PAGINA, comArquivo("external-engines/esteira/src/x.ts", `export const AZUL = "${cor("1d4ed8")}";\n`))).toEqual(["cor-fora-da-lista", "item-numero-errado"]);
  });

  test("a cor que só se COMENTA não pinta — nem no código, nem na página", () => {
    expect(tipos(PAGINA, comArquivo("external-engines/esteira/src/x.ts", `// a borda era "${cor("d4d4d8")}"\nconst a = 1;\n`))).toEqual([]);
    expect(tipos(PAGINA, comArquivo("external-engines/esteira/src/x.ts", `/* "${cor("d4d4d8")}" */\nconst a = 1;\n`))).toEqual([]);
    const html = lerDaCasa(HTML)!;
    expect(tipos(PAGINA, comArquivo(HTML, `${html}\n<!-- antes era ${cor("000")} -->\n`))).toEqual([]);
  });

  test("o caso válido que quase parece cor: o seletor por id da página, a âncora, o rgb() vazio", () => {
    const html = lerDaCasa(HTML)!;
    expect(tipos(PAGINA, comArquivo(HTML, html.replace("pre {", "#log, pre {")))).toEqual([]);
    expect(tipos(PAGINA, comArquivo("external-engines/esteira/src/x.ts", `const ancora = "#secao-2";\nconst f = "rgb()";\n`))).toEqual([]);
  });

  test("a cor que sumiu, e o lugar que deixou de ter cor — o outro sentido", () => {
    const js = lerDaCasa(JS)!;
    const semVermelho = js.replace(`"${cor("dc2626")}"`, `"${cor("1d4ed8")}"`);
    expect(semVermelho).not.toBe(js);
    expect(tipos(PAGINA, comArquivo(JS, semVermelho))).toEqual(["cor-que-sumiu", "item-numero-errado", "tabela-numero-errado"]);
    const semSvg = medirOsArquivos(
      ARQUIVOS.filter((c) => c !== SVG),
      lerDaCasa,
    );
    expect(tipos(PAGINA, semSvg)).toEqual(["lugar-que-sumiu", "item-numero-errado", "tabela-numero-errado"]);
  });

  test("o upstream que pinta no código não é desta casa; o que ele pintou e está na árvore, é", () => {
    expect(tipos(PAGINA, comArquivo("external-engines/symbios/upstream/examples/x.rs", `let c = "${cor("ff0000")}";\n`))).toEqual([]);
    const svg = lerDaCasa(SVG)!;
    expect(tipos(PAGINA, comArquivo(SVG, svg.replace(`fill="${cor("1c1f26")}"`, `fill="${cor("000000")}"`)))).toEqual(
      expect.arrayContaining(["cor-nova", "cor-que-sumiu"]),
    );
  });
});

describe("LAB-181 · a página de antes reprova, e cada defeito pelo nome", () => {
  test("o item do LF-FINAL, sem a seção: o design negado, dois nomes calados, o número e a tabela — cinco", () => {
    const antes = PAGINA.replace(itemDeHoje(), O_ITEM_DE_ANTES).split(`\n${A_SECAO}`)[0]!;
    const t = tipos(antes);
    expect(t.filter((x) => x === "item-sem-design")).toHaveLength(1);
    expect(t.filter((x) => x === "item-nao-nomeia")).toHaveLength(2);
    expect(t).toContain("item-numero-errado");
    expect(t).toContain("tabela-ausente");
    expect(t).toHaveLength(5);
  });

  test("a página sem o item, e sem página", () => {
    expect(tipos(PAGINA.replace(O_ITEM, "- **Outra coisa.**"))).toContain("item-ausente");
    expect(tipos(null)).toEqual(expect.arrayContaining(["item-ausente", "tabela-ausente"]));
  });

  test("o item que cala esta trava, ou troca LAB-181 por LAB-1810", () => {
    const item = itemDeHoje();
    expect(tipos(PAGINA.replace(item, item.replace(O_PONTEIRO, "x.ts")))).toEqual(["item-nao-nomeia"]);
    expect(tipos(PAGINA.replace(item, item.replaceAll("LAB-181", "LAB-1810")))).toEqual(["item-nao-nomeia"]);
  });

  test("o número do item errado, e a frase de antes de volta", () => {
    const item = itemDeHoje();
    expect(tipos(PAGINA.replace(item, item.replace("**9** cores escritas à mão", "**8** cores escritas à mão")))).toEqual(["item-numero-errado"]);
    expect(tipos(PAGINA.replace(item, item.replace("Não se aplica:", "Não há design; não se aplica:")))).toEqual(["item-sem-design"]);
  });

  test("a tabela sem um lugar, com um quarto, ou com o número errado", () => {
    const linhaSvg = PAGINA.split("\n").find((l) => l.startsWith("| `svg-do-upstream` |"))!;
    expect(tipos(naPagina(`${linhaSvg}\n`, ""))).toEqual(["tabela-sem-lugar"]);
    expect(tipos(naPagina(linhaSvg, `| \`outro\` | x | 0 |\n${linhaSvg}`))).toEqual(["tabela-com-outro"]);
    expect(tipos(naPagina(linhaSvg, linhaSvg.replace(/\| 3 \|$/, "| 2 |")))).toEqual(["tabela-numero-errado"]);
  });

  test("pergunta que não leu nada", () => {
    expect(tipos(PAGINA, { ...MEDIDO, lidos: { ...MEDIDO.lidos, pagina: 0 } })).toEqual(["universo-vazio"]);
    expect(tipos(PAGINA, { ...MEDIDO, lidos: { ...MEDIDO.lidos, codigo: 0 } })).toEqual(["universo-vazio"]);
  });
});

describe("LAB-181 · o que ela não alcança, dito", () => {
  test("o buraco está escrito, e nomeia a cor por nome, a fonte e o pixel", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    const tudo = O_QUE_ISTO_NAO_ALCANCA.join("\n");
    expect(tudo).toContain("cor por NOME");
    expect(tudo).toContain("fonte");
    expect(tudo).toContain("pixel");
  });

  test("o item da página é o que a régua lê", () => {
    expect(oItem(PAGINA)).toContain(O_PONTEIRO);
  });
});
