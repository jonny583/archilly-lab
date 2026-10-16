/**
 * AS CONTAGENS DE DESENHO DO `CLAUDE.md` — conferidas contra o arquivo que elas contam. (LAB-120,
 * item 900, a dívida própria, D348)
 *
 * # De onde veio
 *
 * O LAB-119 (D347) conferiu os números da seção *"O código"* do `docs/INDEX.md` e deixou escrito o
 * que não alcançava: *"as outras páginas vivas (`CLAUDE.md`, `ONDE_PARAMOS.md`), que têm contagens de
 * desenho também — não foram medidas aqui"*. O `CLAUDE.md` é a página que toda sessão lê primeiro, e
 * a regra dele diz quantas coisas há: *"as oito consequências"* da cobrança por uso, *"a régua pega 4
 * dos 12 compromissos"*, *"o teto de doze linhas"*, *"Religar são DOIS passos"*, *"dois trabalhos"*
 * do CI. Cada um desses é um número que **um arquivo vivo conta**, e o arquivo muda sem reler a frase.
 *
 * # O que se mediu, em 16/10/2026
 *
 * Lidos número por número — por extenso, ordinal e algarismo — fora dos blocos de código e das
 * citações literais, depois de tirar o que é ponteiro (a limpeza do LAB-118), as datas, o número da
 * seção no título e o marcador de lista: **29 números**. Dezesseis contam (ou leem) um arquivo, treze não contam
 * (ordem, método, relato, versão, o número de travas que já se reconta por execução). **Nenhum dos
 * dezesseis estava errado** — e nenhum era conferido contra o arquivo: os que tinham trava tinham-na
 * por **cópia** (o `toBe(4)` da `trava-de-estrutura.test.ts` e o *"8 dos 12"* da página, iguais por
 * disciplina; o `toBeLessThanOrEqual(12)` do `recado.test.ts` e o *"doze"* da página, idem).
 *
 * # A diferença para o módulo do índice: o trecho não carrega o número
 *
 * No D347 a entrada é `"seis pontos"`: se a página passar a dizer *"sete pontos"*, a entrada some
 * (*entrada-sem-trecho*) e o número aparece sem entrada — reprova, mas pelo motivo torto. Aqui o
 * trecho tem um **`{n}`** no lugar do número (`"As {n}"`): a entrada continua achando a frase, e a
 * falha é a verdadeira, **conta diferente**, com o escrito e o contado lado a lado. E o número que
 * muda a cada rodada (as travas do portão sem clones) fica com entrada estável.
 *
 * # O que ele NÃO alcança, dito
 *
 * - **as citações literais** (linhas que começam por `>`): o texto da Central na §1-C e as palavras
 *   do Jonny na §4-A *"não se reescrevem"* — o número delas é de quem falou, não do arquivo;
 * - **número acima de doze por extenso** (*"Trinta e três"* é lido como *três*), e o *"um"* e o *"uma"*,
 *   pelo motivo do D347 (são artigo);
 * - **a contagem dita sem número** e **a verdade do que se conta** — a função diz QUANTOS;
 * - **o `ONDE_PARAMOS.md`**: é relato datado quase inteiro, e o número dele é do dia em que foi
 *   escrito. Não medido aqui, e não proposto sem medir.
 */
import { COMPROMISSO_MENSAL } from "./cobranca-por-uso.ts";
import {
  type Ler,
  NUMERO,
  limparDescricao,
  listaDeTextos,
  valorDoNumero,
} from "./contagens-do-indice.ts";
import { contarOsPassosDoScript } from "./passos-do-verde.ts";

/** A página que este módulo confere. */
export const PAGINA = "CLAUDE.md";

/** O marcador do número dentro de um trecho. */
export const MARCA = "{n}";

const E = "external-engines/esteira";

/** Uma linha da página que a régua LÊ, já limpa, com o número dela no arquivo. */
export interface LinhaLida {
  linha: number;
  texto: string;
}

/** O que a leitura pulou, contado — o universo publicado, para o verde não sair de lista vazia. */
export interface Pulado {
  linhasDeCodigo: number;
  linhasDeCitacao: number;
  datas: number;
  numerosDeSecao: number;
  marcadoresDeLista: number;
}

const DATA = /\d{1,2}º?\/\d{1,2}\/\d{4}/g;
const NUMERO_DE_SECAO = /^(#{1,6}\s+)\d+(?:-[A-Z])?(?=\s)/;
const MARCADOR_DE_LISTA = /^(\s*)\d+\.(?=\s)/;

/**
 * As linhas que a régua lê. Fora: o bloco de código (exemplo, não afirmação), a citação literal
 * (o texto de quem falou), a data, o número da seção no título e o marcador de lista — os três
 * últimos só na PARTE que eles ocupam: o resto da linha é lido, e *"## 7 · As oito regras"* teria o
 * *oito* lido.
 */
export function linhasDaPagina(pagina: string): {
  linhas: LinhaLida[];
  pulado: Pulado;
} {
  const pulado: Pulado = {
    linhasDeCodigo: 0,
    linhasDeCitacao: 0,
    datas: 0,
    numerosDeSecao: 0,
    marcadoresDeLista: 0,
  };
  const linhas: LinhaLida[] = [];
  let codigo = false;
  pagina.split("\n").forEach((original, i) => {
    if (/^\s*```/.test(original)) {
      codigo = !codigo;
      pulado.linhasDeCodigo++;
      return;
    }
    if (codigo) {
      pulado.linhasDeCodigo++;
      return;
    }
    if (/^\s*>/.test(original)) {
      pulado.linhasDeCitacao++;
      return;
    }
    let l = original;
    if (NUMERO_DE_SECAO.test(l)) {
      pulado.numerosDeSecao++;
      l = l.replace(NUMERO_DE_SECAO, "$1");
    }
    if (MARCADOR_DE_LISTA.test(l)) {
      pulado.marcadoresDeLista++;
      l = l.replace(MARCADOR_DE_LISTA, "$1");
    }
    l = limparDescricao(l);
    pulado.datas += [...l.matchAll(DATA)].length;
    l = l.replace(DATA, "");
    linhas.push({ linha: i + 1, texto: l });
  });
  return { linhas, pulado };
}

/** Um número achado na página. */
export interface NumeroDaPagina {
  linha: number;
  palavra: string;
  posicao: number;
}

export function numerosDaPagina(linhas: readonly LinhaLida[]): NumeroDaPagina[] {
  return linhas.flatMap((l) =>
    [...l.texto.matchAll(NUMERO)].map((m) => ({
      linha: l.linha,
      palavra: m[0],
      posicao: m.index!,
    })),
  );
}

/** O trecho como expressão: o texto literal, e o `{n}` no lugar de UM número. `null` sem `{n}`. */
export function trechoComoExpressao(trecho: string): RegExp | null {
  const partes = trecho.split(MARCA);
  if (partes.length !== 2) return null;
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`${esc(partes[0]!)}(${NUMERO.source})${esc(partes[1]!)}`, "gi");
}

// ── As funções que contam ──────────────────────────────────────────────────────────────────────

/** Os números de `export const NOME = [3, 20, 200]`; `null` se não achar. */
export function listaDeNumeros(fonte: string, nome: string): number[] | null {
  const m = fonte.match(new RegExp(`export const ${nome}(?:\\s*:[^=]+)?\\s*=\\s*\\[([^\\]]*)\\]`));
  if (m === null) return null;
  const ns = m[1]!
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x !== "");
  return ns.every((x) => /^\d+$/.test(x)) ? ns.map(Number) : null;
}

/** Os `id: "…"` de dentro do bloco `export const NOME … = [` até o `];` que o fecha. */
export function idsDoBloco(fonte: string, nome: string): string[] | null {
  const de = fonte.search(new RegExp(`^export const ${nome}\\b`, "m"));
  if (de < 0) return null;
  const ate = fonte.indexOf("\n];", de);
  if (ate < 0) return null;
  return [...fonte.slice(de, ate).matchAll(/^\s+id:\s*"([^"]+)"/gm)].map((m) => m[1]!);
}

/** O teto do `test("O TETO…")`: o número do `toBeLessThanOrEqual(N)` dentro dele. */
export function tetoDoRecado(fonte: string): number | null {
  const de = fonte.indexOf('test("O TETO');
  if (de < 0) return null;
  const ate = fonte.indexOf("\n  });", de);
  const bloco = fonte.slice(de, ate < 0 ? undefined : ate);
  const ms = [...bloco.matchAll(/toBeLessThanOrEqual\((\d+)\)/g)];
  return ms.length === 1 ? Number(ms[0]![1]) : null;
}

/** Os trabalhos de um workflow: as chaves de dois espaços debaixo de `jobs:`. */
export function trabalhosDoWorkflow(yaml: string): string[] | null {
  const linhas = yaml.split("\n");
  const de = linhas.findIndex((l) => /^jobs:\s*$/.test(l));
  if (de < 0) return null;
  const nomes: string[] = [];
  for (let i = de + 1; i < linhas.length; i++) {
    const l = linhas[i]!;
    if (/^\S/.test(l)) break;
    const m = l.match(/^ {2}([A-Za-z_][\w-]*):\s*$/);
    if (m !== null) nomes.push(m[1]!);
  }
  return nomes;
}

/** Os compromissos de formato real que a régua de palavra PEGA — a régua rodada sobre a lista lida. */
export function compromissosQueARegraPega(fonte: string): {
  total: number;
  pega: number;
} | null {
  const lista = listaDeTextos(fonte, "COMPROMISSOS_DE_FORMATO_REAL");
  if (lista === null || lista.length === 0) return null;
  const pega = lista.filter((c) => COMPROMISSO_MENSAL.some((re) => re.test(c))).length;
  return { total: lista.length, pega };
}

/** Um número da página que CONTA (ou LÊ) um arquivo. */
export interface Contagem {
  /** O trecho da página, com {@link MARCA} no lugar do número — e um só. */
  trecho: string;
  /** O que se conta, dito para quem lê a falha. */
  conta: string;
  /** O arquivo que a contagem LÊ, a partir da raiz. */
  le: string;
  /** A contagem no texto de {@link Contagem.le}; `null` quando o que ela procura sumiu. */
  contar: (texto: string) => number | null;
}

const nth = (xs: number[] | null, i: number) => (xs === null ? null : (xs[i] ?? null));
const len = <T>(xs: T[] | null) => (xs === null ? null : xs.length);
const COBRANCA = `${E}/src/cobranca-por-uso.ts`;
const ESTRUTURA = `${E}/src/trava-de-estrutura.ts`;
const RECADO = `${E}/tests/recado.test.ts`;

export const CONTAGENS: readonly Contagem[] = [
  {
    trecho: "O teto de {n} linhas",
    le: RECADO,
    conta: 'o `toBeLessThanOrEqual(N)` do `test("O TETO…")`',
    contar: tetoDoRecado,
  },
  {
    trecho: "{n} linhas é teto",
    le: RECADO,
    conta: 'o `toBeLessThanOrEqual(N)` do `test("O TETO…")`',
    contar: tetoDoRecado,
  },
  {
    trecho: "mais de {n}",
    le: `${E}/src/varredura-de-segredos.ts`,
    conta: "o valor de `MAXIMO_DE_CARACTERES_NA_AMOSTRA`",
    contar: (t) => {
      const m = t.match(/export const MAXIMO_DE_CARACTERES_NA_AMOSTRA\s*=\s*(\d+)\s*;/);
      return m === null ? null : Number(m[1]);
    },
  },
  {
    trecho: "contratada junto. As {n}",
    le: COBRANCA,
    conta: "os `id:` do bloco `CONSEQUENCIAS`",
    contar: (t) => len(idsDoBloco(t, "CONSEQUENCIAS")),
  },
  {
    trecho: "{n} linhas, com",
    le: COBRANCA,
    conta: "os itens de `FAIXAS_DE_USO`",
    contar: (t) => len(listaDeNumeros(t, "FAIXAS_DE_USO")),
  },
  {
    trecho: "com **{n}**,",
    le: COBRANCA,
    conta: "o 1º valor de `FAIXAS_DE_USO`",
    contar: (t) => nth(listaDeNumeros(t, "FAIXAS_DE_USO"), 0),
  },
  {
    trecho: "**{n}** e",
    le: COBRANCA,
    conta: "o 2º valor de `FAIXAS_DE_USO`",
    contar: (t) => nth(listaDeNumeros(t, "FAIXAS_DE_USO"), 1),
  },
  {
    trecho: "**{n}** clientes",
    le: COBRANCA,
    conta: "o 3º valor de `FAIXAS_DE_USO`",
    contar: (t) => nth(listaDeNumeros(t, "FAIXAS_DE_USO"), 2),
  },
  {
    trecho: "com {n} clientes",
    le: COBRANCA,
    conta: "a MENOR faixa — o 1º valor de `FAIXAS_DE_USO`",
    contar: (t) => nth(listaDeNumeros(t, "FAIXAS_DE_USO"), 0),
  },
  {
    trecho: "pega {n} dos",
    le: ESTRUTURA,
    conta:
      "os de `COMPROMISSOS_DE_FORMATO_REAL` que `COMPROMISSO_MENSAL` (da `cobranca-por-uso.ts`) PEGA — a régua rodada sobre a lista lida",
    contar: (t) => compromissosQueARegraPega(t)?.pega ?? null,
  },
  {
    trecho: "dos {n} compromissos",
    le: ESTRUTURA,
    conta: "os itens de `COMPROMISSOS_DE_FORMATO_REAL`",
    contar: (t) => compromissosQueARegraPega(t)?.total ?? null,
  },
  {
    trecho: "**{n} dos",
    le: ESTRUTURA,
    conta: "os de `COMPROMISSOS_DE_FORMATO_REAL` que `COMPROMISSO_MENSAL` NÃO pega",
    contar: (t) => {
      const r = compromissosQueARegraPega(t);
      return r === null ? null : r.total - r.pega;
    },
  },
  {
    trecho: "dos {n} escapam",
    le: ESTRUTURA,
    conta: "os itens de `COMPROMISSOS_DE_FORMATO_REAL`",
    contar: (t) => compromissosQueARegraPega(t)?.total ?? null,
  },
  {
    trecho: "{n} passos, todos",
    le: "external-engines/conferir.sh",
    conta: "os passos do script, pela régua do LAB-101 (`contarOsPassosDoScript`)",
    contar: (t) => contarOsPassosDoScript(t)?.total ?? null,
  },
  {
    trecho: "tem {n} trabalhos",
    le: ".github/workflows/verde.yml",
    conta: "as chaves debaixo de `jobs:`",
    contar: (t) => len(trabalhosDoWorkflow(t)),
  },
  {
    trecho: "Religar são **{n}**",
    le: "docs/COMO_RELIGAR_O_CI.md",
    conta: "os `**Passo N —` da receita, no lugar único de religar",
    contar: (t) => {
      const n = [...t.matchAll(/^\*\*Passo \d+ —/gm)].length;
      return n === 0 ? null : n;
    },
  },
];

/** Um número da página que NÃO conta arquivo nenhum, com o motivo. */
export interface NaoConta {
  trecho: string;
  motivo: string;
}

export const NAO_CONTAM: readonly NaoConta[] = [
  {
    trecho: "nem {n} bloco",
    motivo: "é a forma da regra: o segundo bloco é o que ela proíbe, e não item de arquivo",
  },
  { trecho: "vem {n}", motivo: "é ordem: o recado vem antes do resto, no mesmo bloco" },
  {
    trecho: "as {n} divergirem",
    motivo: "são os dois textos da mesma regra, nomeados ao lado (o §1 e a §1-C)",
  },
  { trecho: "se termina {n}", motivo: "é ordem: o prompt anterior aberto antes do novo" },
  {
    trecho: "medido nas {n}",
    motivo: "é método: com e sem o conserto — a passagem é a do D23, e não um item de arquivo",
  },
  {
    trecho: "R$ {n} por",
    motivo:
      "é o contraexemplo medido contra a direção (a mesma despesa por estudo a 200 clientes); a presença dele é cobrada pela `custo-por-uso.test.ts`, e a aritmética de um caso não é contagem",
  },
  {
    trecho: "R$ {n}**",
    motivo:
      "é o mesmo contraexemplo, a três clientes; a presença é cobrada pela `custo-por-uso.test.ts`",
  },
  {
    trecho: "Trinta e {n} de",
    motivo:
      "é relato (a tabela das trinta e três mora em `docs/HISTORIA_DAS_REGRAS.md`), e a aritmética que fecha é cobrada pela `aritmetica-da-regra.test.ts`",
  },
  { trecho: "trinta e {n} vezes", motivo: "a mesma frase de relato, a segunda metade" },
  {
    trecho: "nos {n} sentidos",
    motivo: "é método: a lista de exceções conferida nos dois sentidos, e não item de arquivo",
  },
  {
    trecho: "{n} pilhas convivem",
    motivo: "as duas são NOMEADAS na mesma frase (Symbios em Node, o LAB-07 em Bun)",
  },
  { trecho: "Node {n}+", motivo: "é versão de ferramenta, não contagem" },
  {
    trecho: "**{n} travas que leem",
    motivo:
      "muda a cada rodada e já é RECONTADO por execução: `contar-as-travas.test.ts` roda a lista e confere a página (D325)",
  },
];

/** Um desacordo achado. */
export interface Desacordo {
  trecho: string;
  motivo:
    | "numero-sem-entrada"
    | "entrada-sem-trecho"
    | "trecho-repetido"
    | "trecho-sem-marca"
    | "conta-diferente"
    | "nao-contou";
  linha?: number;
  escrito?: number | null;
  contado?: number | null;
  conta?: string;
}

export interface ContagensDoClaude {
  /** O universo: as linhas lidas, o que se pulou, os números achados — publicado. */
  linhasLidas: number;
  pulado: Pulado;
  numerosLidos: number;
  contagens: number;
  naoContam: number;
  desacordos: Desacordo[];
}

/**
 * A conferência nos dois sentidos: todo número lido tem exatamente uma entrada, e toda entrada acha
 * a sua frase uma vez só, com o número no lugar da marca. `null` quando a página não foi lida.
 */
export function conferirAsContagensDoClaude(
  pagina: string | null,
  ler: Ler,
  contagens: readonly Contagem[] = CONTAGENS,
  naoContam: readonly NaoConta[] = NAO_CONTAM,
): ContagensDoClaude | null {
  if (pagina === null || pagina.trim() === "") return null;
  const { linhas, pulado } = linhasDaPagina(pagina);
  const numeros = numerosDaPagina(linhas);
  const desacordos: Desacordo[] = [];
  const cobertos = new Set<string>();
  const entradas: { trecho: string; contagem?: Contagem }[] = [
    ...contagens.map((c) => ({ trecho: c.trecho, contagem: c })),
    ...naoContam.map((n) => ({ trecho: n.trecho })),
  ];
  for (const e of entradas) {
    const re = trechoComoExpressao(e.trecho);
    if (re === null) {
      desacordos.push({ trecho: e.trecho, motivo: "trecho-sem-marca" });
      continue;
    }
    const achados = linhas.flatMap((l) =>
      [...l.texto.matchAll(re)].map((m) => ({
        l,
        palavra: m[1]!,
        posicao: m.index! + e.trecho.split(MARCA)[0]!.length,
      })),
    );
    if (achados.length === 0) {
      desacordos.push({ trecho: e.trecho, motivo: "entrada-sem-trecho" });
      continue;
    }
    if (achados.length > 1) {
      desacordos.push({ trecho: e.trecho, motivo: "trecho-repetido" });
      continue;
    }
    const { l, palavra, posicao } = achados[0]!;
    cobertos.add(`${l.linha}:${posicao}`);
    if (e.contagem === undefined) continue;
    const escrito = valorDoNumero(palavra);
    const texto = ler(e.contagem.le);
    const contado = texto === null ? null : e.contagem.contar(texto);
    if (contado === null || contado !== escrito)
      desacordos.push({
        trecho: e.trecho,
        linha: l.linha,
        motivo: contado === null ? "nao-contou" : "conta-diferente",
        escrito,
        contado,
        conta: e.contagem.conta,
      });
  }
  for (const n of numeros)
    if (!cobertos.has(`${n.linha}:${n.posicao}`))
      desacordos.push({ trecho: n.palavra, linha: n.linha, motivo: "numero-sem-entrada" });
  return {
    linhasLidas: linhas.length,
    pulado,
    numerosLidos: numeros.length,
    contagens: contagens.length,
    naoContam: naoContam.length,
    desacordos,
  };
}
