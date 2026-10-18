/**
 * **LAB-182 (item 900) · mobile sem rolagem lateral — "a bancada não é aberta no celular", e ninguém a tinha aberto**
 * (D410).
 *
 * ```sh
 * bun test tests/a-rolagem-no-celular.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` dizia, desde o LF-FINAL (14/09/2026): *"Idem: a bancada não é aberta no celular."* Medida no
 * Chromium a 390, 360 e 320 px, ela não rola de lado — mas sem `<meta name="viewport">`. O motivo inteiro está no
 * cabeçalho de `src/a-rolagem-no-celular.ts`; a medição, no produtor `rolagem-no-celular.ts`, ao lado da bancada.
 *
 * Roda **sem clones** (lê o JSON da medição, a página e o `conferir.sh` DESTE repositório), e por isso está no portão
 * sem clones do `verde.yml`. Quem abre o Chromium é o `conferir.sh`, antes deste teste.
 */
import { describe, expect, test } from "bun:test";

import {
  A_TELA_DA_FAMILIA,
  O_ITEM,
  O_PONTEIRO,
  O_PRODUTOR,
  O_QUE_ISTO_NAO_ALCANCA,
  aCasa,
  aTabela,
  conferir,
  conferirAArvore,
  oItem,
  sobraDoCaso,
  temMetaViewport,
  type Casa,
  type Caso,
  type Prova,
} from "../src/a-rolagem-no-celular.ts";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const HOJE = aCasa(RAIZ);
const PAGINA = HOJE.pagina!;
const PROVA = HOJE.prova!;

const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const comProva = (mudar: (p: Prova) => void): Casa => {
  const p = copia(PROVA);
  mudar(p);
  return { ...HOJE, prova: p };
};
const tipos = (casa: Casa) => conferir(casa).map((p) => p.tipo);
const naPagina = (de: string, para: string): Casa => {
  expect(PAGINA).toContain(de);
  return { ...HOJE, pagina: PAGINA.replace(de, para) };
};
/** O item do LF-FINAL, palavra por palavra. */
const O_ITEM_DE_ANTES = `${O_ITEM} Idem: a bancada não é aberta no celular.\n`;
const itemDeHoje = () => {
  const linhas = PAGINA.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(O_ITEM));
  let j = i + 1;
  while (j < linhas.length && linhas[j]!.trim() !== "" && !linhas[j]!.startsWith("- ")) j++;
  return `${linhas.slice(i, j).join("\n")}\n`;
};

describe("LAB-182 · a casa de hoje", () => {
  test("a árvore passa — e o universo é publicado", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `   [a-rolagem-no-celular] ${r.casa.prova?.casos.length ?? 0} casos × 2 estados · maior sobra ${r.casa.prova?.maiorSobra} px · meta viewport ${r.casa.prova?.metaViewport}`,
    );
    expect(r.problemas, r.problemas.map((p) => p.detalhe).join("\n")).toEqual([]);
    expect(r.casa.prova!.casos.length).toBeGreaterThan(0);
  });

  test("a medição: seis casos, a tela da família entre eles, nenhuma sobra, e a página sem <meta name=viewport>", () => {
    expect(PROVA.casos).toHaveLength(6);
    expect(PROVA.casos.some((c) => c.tela === A_TELA_DA_FAMILIA && c.emulaCelular)).toBe(true);
    expect(PROVA.casos.map(sobraDoCaso)).toEqual([0, 0, 0, 0, 0, 0]);
    expect(PROVA.metaViewport).toBe(false);
    expect(temMetaViewport(HOJE.html!)).toBe(false);
  });

  test("o registro largo rola DENTRO da caixa na janela estreita — e isso não é sobra da página", () => {
    const janela = PROVA.casos.find((c) => c.tela === A_TELA_DA_FAMILIA && !c.emulaCelular)!;
    expect(janela.comORegistroDe1009.registro.conteudo).toBeGreaterThan(janela.comORegistroDe1009.registro.caixa);
    expect(janela.comORegistroDe1009.sobra).toBe(0);
  });

  test("a tabela tem os seis casos", () => {
    expect(aTabela(PAGINA)!.size).toBe(6);
  });
});

describe("LAB-182 · a medição com o defeito reprova, cada um pelo nome", () => {
  test("a página rolando de lado: o caso, o JSON e o item, que diziam zero", () => {
    const casa = comProva((p) => {
      p.casos[0]!.comORegistroDe1009.sobra = 12;
      p.maiorSobra = 12;
    });
    expect(tipos(casa)).toEqual(["rola-de-lado", "item-numero-errado", "tabela-numero-errado"]);
  });

  test("o JSON que escreve uma maior sobra que os casos não dão", () => {
    expect(tipos(comProva((p) => (p.maiorSobra = 3)))).toEqual(["json-incoerente", "item-numero-errado"]);
  });

  test("a página mudou depois da medição: o index.html, o prova.js, e o arquivo que sumiu", () => {
    expect(tipos({ ...HOJE, impressao: { ...HOJE.impressao, "index.html": "0".repeat(64) } })).toEqual(["prova-velha"]);
    expect(tipos({ ...HOJE, impressao: { ...HOJE.impressao, "prova.js": "0".repeat(64) } })).toEqual(["prova-velha"]);
    expect(tipos({ ...HOJE, impressao: { ...HOJE.impressao, "prova.js": null } })).toEqual(["prova-velha"]);
  });

  test("o <meta name=viewport> acrescentado à página sem medir de novo — e o comentado não conta", () => {
    const com = HOJE.html!.replace("<title>", '<meta name="viewport" content="width=device-width">\n<title>');
    expect(temMetaViewport(com)).toBe(true);
    expect(tipos({ ...HOJE, html: com })).toEqual(["viewport-divergente"]);
    const comentado = HOJE.html!.replace("<title>", '<!-- <meta name="viewport" content="width=device-width"> -->\n<title>');
    expect(temMetaViewport(comentado)).toBe(false);
    expect(tipos({ ...HOJE, html: comentado })).toEqual([]);
  });

  test("sem a tela da família, e o caso com um estado faltando", () => {
    expect(tipos(comProva((p) => (p.casos = p.casos.filter((c) => !(c.tela === A_TELA_DA_FAMILIA && c.emulaCelular)))))).toEqual([
      "sem-a-tela-da-familia",
      "tabela-com-outro",
    ]);
    const t = tipos(comProva((p) => delete (p.casos[1] as Partial<Caso>).comORegistroDe1009));
    expect(t).toContain("caso-incompleto");
  });

  test("o JSON ausente, e o JSON sem caso nenhum (verde sobre zero)", () => {
    expect(tipos({ ...HOJE, prova: null })).toContain("prova-ausente");
    expect(tipos(comProva((p) => (p.casos = [])))).toContain("universo-vazio");
  });

  test("o verde que não roda o produtor — e a linha só comentada não é rodar", () => {
    const verde = HOJE.verde!;
    const sem = verde
      .split("\n")
      .filter((l) => !l.includes("rolagem-no-celular.ts"))
      .join("\n");
    expect(tipos({ ...HOJE, verde: sem })).toEqual(["fora-do-verde"]);
    expect(tipos({ ...HOJE, verde: `${sem}\n# bun ../symbios/adapter/ferramentas/navegador/rolagem-no-celular.ts\n` })).toEqual(["fora-do-verde"]);
    expect(tipos({ ...HOJE, verde: null })).toEqual(["fora-do-verde"]);
  });
});

describe("LAB-182 · o item e a tabela", () => {
  test("o item do LF-FINAL, palavra por palavra, reprova — o caso da página de antes", () => {
    const t = tipos(naPagina(itemDeHoje(), O_ITEM_DE_ANTES));
    expect(t).toContain("item-de-antes");
    expect(t).toContain("item-nao-nomeia");
    expect(t).toContain("item-numero-errado");
    expect(t).toContain("item-cala-o-viewport");
  });

  test("o item sem a trava, sem o produtor, ou com LAB-1820", () => {
    expect(tipos(naPagina(`por\n  \`${O_PONTEIRO}\``, "por\n  ninguém"))).toEqual(["item-nao-nomeia"]);
    const semProdutor = itemDeHoje().replace(`(\`${O_PRODUTOR}\`, que escreve`, "(que escreve");
    expect(semProdutor).not.toBe(itemDeHoje());
    expect(tipos(naPagina(itemDeHoje(), semProdutor))).toEqual(["item-nao-nomeia"]);
    // O item nomeia a rodada duas vezes (a medição e o ponteiro para a seção): as duas trocadas.
    const comOutraRodada = itemDeHoje().replace("no LAB-182,", "no LAB-1820,").replace("*Reconferido no LAB-182*", "*Reconferido no LAB-1820*");
    expect(tipos(naPagina(itemDeHoje(), comOutraRodada))).toEqual(["item-nao-nomeia"]);
  });

  test("o item com o número errado, e o que cala o viewport", () => {
    expect(tipos(naPagina("sobra **0** px nos", "sobra **3** px nos"))).toEqual(["item-numero-errado"]);
    expect(tipos(naPagina("A página não tem `<meta name=\"viewport\">`: o celular", "A página: o celular"))).toEqual(["item-cala-o-viewport"]);
  });

  test("o item ausente, e a seção ausente", () => {
    expect(tipos({ ...HOJE, pagina: PAGINA.replace(O_ITEM, "- **Outra coisa.**") })).toEqual(["item-ausente"]);
    expect(tipos({ ...HOJE, pagina: PAGINA.replace("## Reconferido no LAB-182", "## Outra seção") })).toEqual(["tabela-ausente"]);
    expect(tipos({ ...HOJE, pagina: null })).toEqual(["item-ausente", "tabela-ausente"]);
  });

  test("a tabela sem um caso, com um caso a mais, ou com o número errado", () => {
    expect(tipos(naPagina("| `320×568` | janela | 320 | 0 |\n", ""))).toEqual(["tabela-sem-caso"]);
    expect(tipos(naPagina("| `320×568` | janela | 320 | 0 |\n", "| `320×568` | janela | 320 | 0 |\n| `280×600` | janela | 280 | 0 |\n"))).toEqual([
      "tabela-com-outro",
    ]);
    expect(tipos(naPagina("| `390×844` | celular | 980 | 0 |", "| `390×844` | celular | 390 | 0 |"))).toEqual(["tabela-numero-errado"]);
    expect(tipos(naPagina("| `390×844` | janela | 390 | 0 |", "| `390×844` | janela | 390 | 4 |"))).toEqual(["tabela-numero-errado"]);
  });

  test("o item lido inteiro, numa linha só", () => {
    expect(oItem(PAGINA)).toContain("rolagem-no-celular.ts");
    expect(oItem(PAGINA)).not.toContain("\n");
  });
});

describe("LAB-182 · o que a trava não alcança, dito", () => {
  test("a lista existe e nomeia o .wasm, a letra e os outros navegadores", () => {
    const tudo = O_QUE_ISTO_NAO_ALCANCA.join(" ");
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(4);
    for (const s of [".wasm", "letra", "Safari"]) expect(tudo).toContain(s);
  });
});
