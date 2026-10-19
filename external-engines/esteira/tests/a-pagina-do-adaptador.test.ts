/**
 * **LAB-191 (item 900) · a página do adaptador do Symbios — o mapa da pasta, o que a função não faz, e os números
 * perguntados ao dono** (D419).
 *
 * ```sh
 * bun test tests/a-pagina-do-adaptador.test.ts
 * ```
 *
 * O `external-engines/symbios/adapter/README.md` dizia, desde o LAB-01 (10/09/2026), *"Estado: LAB-01 concluído"*,
 * um mapa sem os dois arquivos do recorte, que o adaptador *"não recorta"* e que *"Validator é LAB-02, Judge é LAB-03"*;
 * e citava um nome do Generate que nunca existiu. O motivo inteiro está no cabeçalho de `src/a-pagina-do-adaptador.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`. A pergunta
 * ao Generate mora em `tests/a-pagina-do-adaptador-com-clone.test.ts`, no verde completo.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_MEDICOES,
  A_PAGINA,
  MARCA_FECHA,
  O_CONTRATO,
  O_INDEX,
  O_QUE_ISTO_NAO_ALCANCA,
  O_RECORTE,
  O_TRACER,
  aConta,
  aFracao,
  conferir,
  oCabecalho,
  conferirAArvore,
  corpoDa,
  oLocalDoUpstream,
  oMapa,
  oValorNoArquivo,
  osNomesDoContrato,
  osPadroesEm,
} from "../src/a-pagina-do-adaptador.ts";
import { arquivosQueOGitCarrega } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

function lerDaRaiz(c: string): string | null {
  const p = join(RAIZ, c);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}
/** O blob de `64ee4e8` (a ponta antes do LAB-191): a página e o contrato como estavam. */
const antes = (c: string) => execFileSync("git", ["-C", RAIZ, "show", `64ee4e8:${c}`], { encoding: "utf8" });

const CAMINHOS = arquivosQueOGitCarrega(RAIZ);
const PAGINA = lerDaRaiz(A_PAGINA) as string;
const CONTRATO = lerDaRaiz(O_CONTRATO) as string;
const INDEX = lerDaRaiz(O_INDEX) as string;

function com(trocas: Record<string, string | null>, caminhos: readonly string[] = CAMINHOS) {
  return conferir(caminhos, (c) => (c in trocas ? (trocas[c] as string | null) : lerDaRaiz(c))).problemas;
}
const troca = (texto: string, de: string, para: string) => {
  if (!texto.includes(de)) throw new Error(`a mutação não acha «${de}»`);
  return texto.replace(de, para);
};
const naPagina = (de: string, para: string) => com({ [A_PAGINA]: troca(PAGINA, de, para) });
const acusa = (problemas: string[], trecho: string) =>
  expect(problemas.some((p) => p.includes(trecho)), `esperava «${trecho}» em:\n${problemas.join("\n")}`).toBe(true);

describe("LAB-191 · o que o git carrega hoje — a página confere com a pasta, o código, a medição e o upstream", () => {
  test("zero problemas, e o universo publicado", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `    [a-pagina-do-adaptador] ${r.naPasta.length} na pasta além da página · ${r.noMapa} no mapa · fração ${r.fracao} · ` +
        `${Object.keys(r.padroes).length} padrões · ${r.caminhosLidos} caminhos lidos · ${r.problemas.length} problemas`,
    );
    for (const n of O_QUE_ISTO_NAO_ALCANCA) console.log(`    NÃO alcança: ${n}`);
    expect(r.problemas).toEqual([]);
    // Pisos (medido em 19/10/2026: 16 na pasta, a bancada como uma; 8 caminhos).
    expect(r.naPasta.length).toBeGreaterThanOrEqual(16);
    expect(r.caminhosLidos).toBeGreaterThanOrEqual(8);
    expect(r.fracao).toBe(0.3758);
  });

  test("a página e o contrato de antes, postos de volta no lugar, reprovam — e os números já batiam", () => {
    const p = com({ [A_PAGINA]: antes(A_PAGINA), [O_CONTRATO]: antes(O_CONTRATO) });
    // Medido em 19/10/2026: 29 problemas — as marcas e os 16 nomes do mapa, as três frases fora de risco, o juiz, a
    // função, o recorte, quem o chama, o terreno, a fração, os nomes do Generate (dois) e o nome que nunca existiu.
    expect(p).toHaveLength(29);
    for (const t of ["sem as marcas", "«LAB-01 concluído» fora de risco", "«Validator é LAB-02» fora de risco", "NORMA_BR.via.caixaMinima, um nome"])
      acusa(p, t);
    // Nenhum padrão e nenhum ≈ estava errado: era silêncio e um nome inventado.
    expect(p.filter((x) => x.includes("o bloco diz") || x.includes("diz ≈"))).toEqual([]);
  });
});

describe("1 · o mapa, nos dois sentidos", () => {
  test("medido: as linhas entre as marcas são os nomes da pasta", () => expect(oMapa(PAGINA)?.length).toBe(16));
  test("um arquivo novo na pasta, sem linha, reprova", () =>
    acusa(com({}, [...CAMINHOS, "external-engines/symbios/adapter/src/novo.ts"]), "o mapa não nomeia src/novo.ts"));
  test("um arquivo dentro da bancada não pede linha: a bancada é uma pasta só", () =>
    expect(com({}, [...CAMINHOS, "external-engines/symbios/adapter/ferramentas/navegador/novo.js"])).toEqual([]));
  test("uma linha de arquivo que não existe reprova", () =>
    acusa(com({}, CAMINHOS.filter((c) => !c.endsWith("adapter/src/poligono.ts"))), "o mapa nomeia src/poligono.ts, que o git não"));
  test("a linha que some reprova", () => acusa(naPagina("| `src/recorte.ts` |", "| recorte |"), "o mapa não nomeia src/recorte.ts"));
  test("sem as marcas reprova", () => acusa(naPagina(MARCA_FECHA, ""), "sem as marcas"));
  test("a linha repetida reprova", () => acusa(naPagina("| `src/hash.ts` |", "| `src/geo.ts` |"), "o mapa repete"));
  test("a pasta vazia reprova (D213)", () => acusa(com({}, CAMINHOS.filter((c) => !c.startsWith("external-engines/symbios/adapter/") || c === A_PAGINA)), "universo vazio"));
});

describe("2 e 4 · o estado e o juiz só riscados", () => {
  test("o estado sem o risco reprova", () => acusa(naPagina("~~**LAB-01 concluído.**~~", "**LAB-01 concluído.**"), "«LAB-01 concluído» fora de risco"));
  test("o juiz sem o risco reprova", () => acusa(naPagina("~~Validator é LAB-02, Judge é LAB-03~~", "Validator é LAB-02, Judge é LAB-03"), "«Validator é LAB-02» fora de risco"));
  test("o título velho de volta reprova", () => acusa(naPagina("## O que `gerarRedeViaria` NÃO faz", "## O que este adaptador NÃO faz"), "fora de risco"));
  test("sem dizer que o juiz é o do Generate reprova", () => acusa(naPagina("**são os do Generate**", "**ficam lá**"), "não diz que o Validator"));
});

describe("3 · o que a função não faz", () => {
  test("medido: o corpo de gerarRedeViaria não chama recorte", () => expect(corpoDa("gerarRedeViaria", INDEX)).not.toBeNull());
  test("a função que passa a recortar reprova", () =>
    acusa(com({ [O_INDEX]: troca(INDEX, "export function gerarRedeViaria(", "export function gerarRedeViaria(\n  _x = recortarPelaGleba(null as never),") }), "chama um recorte"));
  test("um recorte só em comentário dentro dela não conta", () =>
    expect(com({ [O_INDEX]: troca(INDEX, "export function gerarRedeViaria(", "export function gerarRedeViaria( // recortarPelaGleba(x)\n") })).toEqual([]));
  test("o index que deixa de exportar o recorte reprova", () =>
    acusa(com({ [O_INDEX]: troca(INDEX, "export { recortarPelaGleba,", "export {") }), "não exporta recortarPelaGleba"));
  test("o recorte.ts sem a função reprova", () =>
    acusa(com({ [O_RECORTE]: (lerDaRaiz(O_RECORTE) as string).replace("export function recortarPelaGleba", "export function outra") }), "não define recortarPelaGleba"));
  test("a seção que não nomeia a função reprova", () => acusa(naPagina("## O que `gerarRedeViaria` NÃO faz", "## O que a função NÃO faz"), "não nomeia `gerarRedeViaria`"));
  test("quem chama o recorte, apontado para um arquivo que não o chama, reprova", () =>
    acusa(naPagina("`external-engines/esteira/src/motores/symbios.ts`", "`external-engines/esteira/src/motores/testfit.ts`"), "não chama recortarPelaGleba"));
  test("quem chama, apontado para um arquivo que não existe, reprova", () =>
    acusa(naPagina("`external-engines/esteira/src/motores/symbios.ts`", "`external-engines/esteira/src/motores/nao.ts`"), "ele não existe"));
});

describe("5 · os ≈ 38 %", () => {
  test("medido: a fração da Fazenda Recanto das Águas", () => expect(aFracao(lerDaRaiz(AS_MEDICOES) as string, "Fazenda Recanto das Águas")).toBe(0.3758));
  test("o ≈ que diverge reprova", () => acusa(naPagina("≈ 38 %", "≈ 40 %"), "diz ≈ 40 %"));
  test("a fração citada que diverge reprova", () => acusa(naPagina("0,3758", "0,3759"), "cita 0,3759"));
  test("a medição que muda reprova a página", () =>
    acusa(com({ [AS_MEDICOES]: (lerDaRaiz(AS_MEDICOES) as string).replace('"fracaoForaDaGleba": 0.3758', '"fracaoForaDaGleba": 0.41') }), "diz ≈ 38 %"));
  test("sem o terreno nomeado reprova", () => acusa(com({ [A_PAGINA]: PAGINA.replaceAll("Fazenda Recanto das Águas", "a fazenda") }), "não nomeia o terreno"));
  test("sem a medição reprova", () => acusa(com({ [AS_MEDICOES]: null }), "outputs/lab01/medicoes.json: não existe"));
});

describe("6 · os padrões", () => {
  test("medido: os seis do bloco são os do contrato", () =>
    expect(osPadroesEm(PAGINA.slice(PAGINA.indexOf("## Contrato de entrada")))).toEqual({
      espacamentoPrincipal_m: 200,
      espacamentoLocal_m: 80,
      rampaMaxima_pct: 10,
      faixaDominio_m: 8.4,
      passoGrade_m: 2,
      extrairQuadras: true,
    }));
  test("o bloco que diverge reprova", () => acusa(naPagina("espacamentoLocal_m: 80,", "espacamentoLocal_m: 90,"), "espacamentoLocal_m = 90"));
  test("o contrato que muda reprova a página", () =>
    acusa(com({ [O_CONTRATO]: troca(CONTRATO, "faixaDominio_m: 8.4,\n  passo", "faixaDominio_m: 9,\n  passo") }), "o PARAMETROS_PADRAO diz 9"));
  test("o booleano que diverge reprova", () => acusa(naPagina("extrairQuadras: true,", "extrairQuadras: false,"), "extrairQuadras = false"));
});

describe("7 · os nomes do Generate", () => {
  test("medido: o contrato cita os dois nomes certos", () =>
    expect(osNomesDoContrato(CONTRATO)).toEqual(["LIMITES_TOPOGRAFIA.rampaMaxPct", "NORMA_BR.viario.valor.caixaMinima"]));
  test("o bloco com o nome inventado de volta reprova", () =>
    acusa(naPagina("// padrão — o NORMA_BR.viario.valor.caixaMinima do Generate", "// padrão — o NORMA_BR.via.caixaMinima do Generate"), "um nome que o Generate nunca teve"));
  test("o contrato com o nome inventado sem a frase reprova", () =>
    acusa(com({ [O_CONTRATO]: CONTRATO.replace("que o Generate nunca teve", "que mudou") }), `${O_CONTRATO}: cita NORMA_BR.via.caixaMinima`));
  test("o nome inventado riscado aprova", () =>
    expect(naPagina("diziam `NORMA_BR.via.caixaMinima`, um nome que o Generate nunca\n  teve", "diziam ~~`NORMA_BR.via.caixaMinima`~~")).toEqual([]));
  test("a página e o contrato que divergem reprovam", () =>
    acusa(com({ [O_CONTRATO]: CONTRATO.replace("`LIMITES_TOPOGRAFIA.rampaMaxPct` do Generate", "`LIMITES.rampa` do Generate") }), "e o external-engines/symbios/adapter/src/contrato.ts cita"));
});

describe("8 · os 15 m do upstream", () => {
  test("medido: o Default dá 15", () => expect(oLocalDoUpstream(lerDaRaiz(O_TRACER) as string)).toBe(15));
  test("a página que diverge reprova", () => acusa(naPagina("via a cada 15 m", "via a cada 20 m"), "via a cada 20 m"));
  test("sem a frase reprova", () => acusa(naPagina("via a cada 15 m", "via curta"), "não diz o espaçamento"));
});

describe("9 · os caminhos", () => {
  test("link que não resolve reprova", () => acusa(naPagina("](../archilly/wasm/)", "](../archilly/wasm-velha/)"), "o link ../archilly/wasm-velha/"));
  test("outputs/ que não existe reprova", () => acusa(naPagina("`outputs/lab01/medicoes.json`", "`outputs/lab01/medidas.json`"), "outputs/lab01/medidas.json não existe"));
  test("a página que some reprova", () => acusa(com({ [A_PAGINA]: null }), "a página não existe"));
});

/** O blob de `cfb25f8` (a ponta antes do LAB-192): o `src/index.ts` com o cabeçalho do LAB-01. */
const INDEX_ANTES = execFileSync("git", ["-C", RAIZ, "show", `cfb25f8:${O_INDEX}`], { encoding: "utf8" });
const noIndex = (de: string, para: string) => com({ [O_INDEX]: troca(INDEX, de, para) });

describe("10 · o cabeçalho de src/index.ts (LAB-192, D420)", () => {
  test("medido: o cabeçalho de hoje lê inteiro, em linha, e não reprova nada", () => {
    const cab = oCabecalho(INDEX) as string;
    expect(cab.startsWith("O adaptador: `gerarRedeViaria(terreno, parametros, seed)`.")).toBe(true);
    expect(com({}).filter((x) => x.startsWith(O_INDEX))).toEqual([]);
  });
  test("o cabeçalho de antes, posto de volta, reprova com sete — e só no cabeçalho", () => {
    const p = com({ [O_INDEX]: INDEX_ANTES });
    // Medido em 19/10/2026: o título, as duas frases fora de risco, o juiz, a função do recorte, onde ela mora, quem a chama.
    expect(p).toHaveLength(7);
    expect(p.every((x) => x.includes("o cabeçalho"))).toBe(true);
    for (const t of ["não nomeia `gerarRedeViaria` no título", "«Validator é LAB-02» fora de risco", "«O que este adaptador NÃO faz» fora de risco"]) acusa(p, t);
  });
  test("o juiz sem o risco reprova", () => acusa(noIndex("~~Validator é LAB-02, Judge é LAB-03~~", "Validator é LAB-02, Judge é LAB-03"), "«Validator é LAB-02» fora de risco"));
  test("a frase velha que quebra de linha, sem o risco, também reprova", () =>
    acusa(noIndex("~~O que este adaptador NÃO faz~~", "O que este\n * adaptador NÃO faz"), "«O que este adaptador NÃO faz» fora de risco"));
  test("o título que não nomeia a função reprova", () =>
    acusa(noIndex("# O que `gerarRedeViaria` NÃO faz", "# O que a função NÃO faz"), "não nomeia `gerarRedeViaria` no título"));
  test("sem dizer que o juiz é o do Generate reprova", () => acusa(noIndex("são os do Generate", "ficam lá"), "o cabeçalho não diz que o Validator"));
  test("sem nomear o recorte reprova", () =>
    acusa(com({ [O_INDEX]: INDEX.replace(/^\/\*\*[\s\S]*?\*\//, (c) => c.replaceAll("`recortarPelaGleba`", "o recorte")) }), "não nomeia a função do recorte"));
  test("sem dizer onde ele mora reprova", () => acusa(noIndex("(`./recorte.ts`, LAB-02)", "(LAB-02)"), "não diz onde o recorte mora"));
  test("quem chama, apontado para um arquivo que não o chama, reprova", () =>
    acusa(noIndex("`external-engines/esteira/src/motores/symbios.ts`", "`external-engines/esteira/src/motores/testfit.ts`"), "e o cabeçalho de"));
  test("quem chama, apontado para um arquivo que não existe, reprova", () =>
    acusa(noIndex("`external-engines/esteira/src/motores/symbios.ts`", "`external-engines/esteira/src/motores/nao.ts`"), "ele não existe"));
  test("a frase velha FORA do cabeçalho (num comentário do corpo) não é desta pergunta", () =>
    expect(noIndex("const TOLERANCIA_RAMPA_PP = 0.5;", "// Validator é LAB-02\nconst TOLERANCIA_RAMPA_PP = 0.5;")).toEqual([]));
  test("o arquivo que não abre com comentário reprova", () => acusa(com({ [O_INDEX]: `import "x";\n${INDEX}` }), "não abre com o comentário"));
  test("oCabecalho: junta a frase partida e tira a margem", () =>
    expect((oCabecalho("/**\n * a b\n *   c\n */\nx") ?? "").replace(/\s+/g, " ")).toBe("a b c"));
});

describe("a conta e a leitura do Generate, sem o Generate", () => {
  test("a norma: 6 + 2 * 1.2 = 8,4", () => expect(aConta("6 + 2 * 1.2")).toBe(8.4));
  test("nome na conta não se resolve", () => expect(aConta("6 + PISTA")).toBeNull());
  test("o caminho desce chave a chave", () =>
    expect(oValorNoArquivo("export const N = {\n  a: { valor: { b: 1, c: 6 + 2 * 1.2 } },\n};", "N.a.valor.c")).toBe(8.4));
  test("a chave que não existe dá null", () => expect(oValorNoArquivo("export const N = { a: { valor: { b: 1 } } };", "N.via.caixaMinima")).toBeNull());
});
