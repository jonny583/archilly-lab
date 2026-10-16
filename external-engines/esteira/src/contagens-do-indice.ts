/**
 * AS CONTAGENS DE DESENHO DA SEÇÃO "O CÓDIGO" DO ÍNDICE — conferidas contra o arquivo que elas
 * contam. (LAB-119, item 900, a minha própria lista, proposta do LAB-118, D347)
 *
 * # O defeito, medido em 16/10/2026
 *
 * A seção *"O código"* do `docs/INDEX.md` descreve arquivo VIVO, e a descrição conta: *"seis pontos"*
 * do acesso, *"três regras"* da guarda da ponte, *"quatro cortes"* da rampa. O LAB-118 tirou à mão a
 * *"seis travas"* do `verde.test.ts` (que tinha quinze) e deixou o resto, sem régua, proposto na
 * FILA. Lido número por número, por extenso e em algarismo, nas 22 linhas da tabela, há **22
 * números**, e **três estavam errados, em duas linhas**:
 *
 * | linha | o que dizia | o que o arquivo tem | errado desde |
 * |---|---|---|---|
 * | `guarda-da-ida.ts` | *"Quatro regras, e a **quarta** é a dívida declarada"* | **cinco** (`REGRAS_DA_IDA`), e a dívida é a **quinta** | 04/10 (LAB-35 acrescentou `promessa-nao-exercitada`) |
 * | `porta/experimentos.ts` | *"**dois** testes de varredura"* | **três** no `describe` da varredura (o da contagem nasceu depois) | — |
 *
 * Nenhum dos dois dizia estado do dia: dizia o **desenho** de um arquivo, e o desenho mudou embaixo
 * da frase sem que nada a relesse — a forma do D342 e do D346 na seção ao lado.
 *
 * # O que este módulo faz
 *
 * - {@link numerosDaSecao} — acha, na descrição de cada linha da seção, todo número por extenso
 *   (*dois* a *doze*), todo ordinal (*primeira* a *décima*) e todo algarismo, depois de tirar o que
 *   é ponteiro (crases, ligações, `LAB-NN`, `D123`, `§1-B` — a mesma limpeza do LAB-118).
 * - {@link CONTAGENS} — cada número que CONTA o arquivo da linha, com a função que o conta no texto do
 *   arquivo. O número escrito tem de ser o contado.
 * - {@link NAO_CONTAM} — cada número que NÃO conta o arquivo (data, relato, geometria), com o motivo.
 * - {@link conferirAsContagens} — os dois sentidos: todo número da seção está em exatamente uma das
 *   duas listas (o que nasce sem entrada reprova), e toda entrada das listas acha o seu trecho (a
 *   entrada que ninguém mais lê reprova). Publica o universo lido.
 *
 * # O que ele NÃO alcança, dito
 *
 * - **as outras seções do índice**: as linhas de relatório são relato datado, e as de *"Decisão e
 *   fila"* já não podem ter algarismo (D346);
 * - **o "um" e o "uma"**: são artigo em quase toda frase (*"um experimento por capacidade"*), e
 *   régua que os lesse viraria lista de exceções do português;
 * - **a contagem dita sem número** (*"o par que impede"*, *"as duas metades"* escritas como
 *   *"ambas"*): régua de palavra não pega o que não reconhece;
 * - **a verdade do que se conta**: a função diz QUANTOS, não se a frase descreve o que eles são.
 */
import { ligacoes, resolverDaPagina } from "./caminhos-da-pagina.ts";
import { contarOsPassosDoScript } from "./passos-do-verde.ts";

/** A página que este módulo confere, e a seção. */
export const PAGINA = "docs/INDEX.md";
export const SECAO = "## O código";

const CARDINAIS: Record<string, number> = {
  dois: 2,
  duas: 2,
  três: 3,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
};
const ORDINAIS: [RegExp, number][] = [
  [/^primeir[oa]s?$/, 1],
  [/^segund[oa]s?$/, 2],
  [/^terceir[oa]s?$/, 3],
  [/^quart[oa]s?$/, 4],
  [/^quint[oa]s?$/, 5],
  [/^sext[oa]s?$/, 6],
  [/^s[ée]tim[oa]s?$/, 7],
  [/^oitav[oa]s?$/, 8],
  [/^non[oa]s?$/, 9],
  [/^d[ée]cim[oa]s?$/, 10],
];
/** Fronteira de palavra que conhece o acento — o `\b` do JavaScript é só ASCII. */
const L = "A-Za-zÀ-ÿ";
const NUMERO = new RegExp(
  `(?<![${L}\\d])(?:dois|duas|tr[êe]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|` +
    `primeir[oa]s?|segund[oa]s?|terceir[oa]s?|quart[oa]s?|quint[oa]s?|sext[oa]s?|s[ée]tim[oa]s?|` +
    `oitav[oa]s?|non[oa]s?|d[ée]cim[oa]s?|\\d+(?:[.,/]\\d+)*)(?![${L}\\d])`,
  "gi",
);

/** O valor de um número escrito — por extenso, ordinal ou algarismo; `null` se não for número. */
export function valorDoNumero(palavra: string): number | null {
  const p = palavra.toLowerCase();
  if (p in CARDINAIS) return CARDINAIS[p]!;
  for (const [re, v] of ORDINAIS) if (re.test(p)) return v;
  return /^\d+$/.test(p) ? Number(p) : null;
}

/** A mesma limpeza do LAB-118: ponteiro não é número do desenho. */
const CITACAO =
  /\bLAB-?\d+\b|\bLF-[\w-]+|\bD\d{2,}\b|\bitem\s+\d{3,}\b|§[\w.-]+/gi;
export function limparDescricao(resto: string): string {
  return resto
    .replace(/`[^`\n]*`/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(CITACAO, "");
}

/** Uma linha da seção: o arquivo que ela descreve (a partir da raiz) e a descrição, limpa. */
export interface LinhaDaSecao {
  arquivo: string;
  linha: number;
  descricao: string;
}

/** As linhas da tabela da seção `## O código`. Seção ausente devolve `null` — não lê, não aprova. */
export function linhasDaSecao(indice: string): LinhaDaSecao[] | null {
  const todas = indice.split("\n");
  const inicio = todas.findIndex((l) => l.trim() === SECAO);
  if (inicio < 0) return null;
  const linhas: LinhaDaSecao[] = [];
  for (let i = inicio + 1; i < todas.length; i++) {
    const l = todas[i]!;
    if (l.startsWith("## ")) break;
    if (!l.startsWith("|")) continue;
    const partes = l.split("|");
    if (partes.length < 4) continue;
    const alvo = ligacoes(partes[1]!)[0];
    if (alvo === undefined) continue; // o cabeçalho e o separador
    const arquivo = resolverDaPagina(PAGINA, alvo);
    if (arquivo === null) continue;
    linhas.push({
      arquivo: arquivo.replace(/\/$/, ""),
      linha: i + 1,
      descricao: limparDescricao(partes.slice(2).join("|")),
    });
  }
  return linhas;
}

/** Um número achado na seção. */
export interface NumeroDaSecao {
  arquivo: string;
  linha: number;
  palavra: string;
  posicao: number;
}

export function numerosDaSecao(
  linhas: readonly LinhaDaSecao[],
): NumeroDaSecao[] {
  return linhas.flatMap((l) =>
    [...l.descricao.matchAll(NUMERO)].map((m) => ({
      arquivo: l.arquivo,
      linha: l.linha,
      palavra: m[0],
      posicao: m.index!,
    })),
  );
}

// ── As funções que contam, no TEXTO do arquivo ─────────────────────────────────────────────────

/** Os textos de uma lista `export const NOME = [ "a", "b" ] as const;`; `null` se não achar. */
export function listaDeTextos(fonte: string, nome: string): string[] | null {
  const m = fonte.match(
    new RegExp(`export const ${nome}(?:\\s*:[^=]+)?\\s*=\\s*\\[([^\\]]*)\\]`),
  );
  if (m === null) return null;
  return [...m[1]!.matchAll(/"([^"]*)"/g)].map((x) => x[1]!);
}

/** Quantos itens tem `export const NOME = [ ... ]` — de texto ou de número. */
export function tamanhoDaLista(fonte: string, nome: string): number | null {
  const m = fonte.match(
    new RegExp(`export const ${nome}(?:\\s*:[^=]+)?\\s*=\\s*\\[([^\\]]*)\\]`),
  );
  if (m === null) return null;
  return m[1]!.split(",").filter((x) => x.trim() !== "").length;
}

/**
 * Os títulos dos `test(` dentro do `describe(` de nível de cima cujo título começa por `inicio`.
 * O fim do bloco é o próximo `describe(` de nível de cima. `null` se o `describe` não existe.
 */
export function testesDoDescribe(
  fonte: string,
  inicio: string,
): string[] | null {
  const linhas = fonte.split("\n");
  const de = linhas.findIndex(
    (l) =>
      l.startsWith(`describe("${inicio}`) ||
      l.startsWith(`describe(\`${inicio}`),
  );
  if (de < 0) return null;
  const titulos: string[] = [];
  for (
    let i = de + 1;
    i < linhas.length && !linhas[i]!.startsWith("describe(");
    i++
  ) {
    const m = linhas[i]!.match(/^\s+test\(\s*["`](.*?)["`]\s*,/);
    if (m !== null) titulos.push(m[1]!);
  }
  return titulos;
}

/** Os títulos dos `describe(` de nível de cima. */
export function describes(fonte: string): string[] {
  return [...fonte.matchAll(/^describe\(\s*["`](.*?)["`]\s*,/gm)].map(
    (m) => m[1]!,
  );
}

/** Lê um arquivo a partir da raiz; `null` se não existe. */
export type Ler = (caminhoDaRaiz: string) => string | null;

/** Um número que CONTA o arquivo da linha. */
export interface Contagem {
  /** O arquivo da linha, a partir da raiz — a chave é a linha, não o texto. */
  arquivo: string;
  /** O trecho da descrição limpa que traz o número, e só um número. */
  trecho: string;
  /** O que se conta, dito para quem lê a falha. */
  conta: string;
  /** O arquivo que a contagem LÊ, a partir da raiz — quase sempre o da linha, nem sempre. */
  le: string;
  /**
   * A contagem, feita no texto de {@link Contagem.le}; `null` quando o que ela procura sumiu. Arquivo
   * ausente nem chega aqui: vira *"não contou"*, e nunca o texto vazio que contaria zero.
   */
  contar: (texto: string) => number | null;
}

const E = "external-engines/esteira";
const posicao = (lista: string[] | null, item: string): number | null =>
  lista === null || !lista.includes(item) ? null : lista.indexOf(item) + 1;
const tamanho = <T>(x: T[] | null): number | null =>
  x === null ? null : x.length;

export const CONTAGENS: readonly Contagem[] = [
  {
    arquivo: `${E}/src/acesso.ts`,
    trecho: "seis pontos",
    le: `${E}/src/acesso.ts`,
    conta: "o valor de `POSICOES_DE_ACESSO`",
    contar: (t) => {
      const m = t.match(/export const POSICOES_DE_ACESSO\s*=\s*(\d+)\s*;/);
      return m === null ? null : Number(m[1]);
    },
  },
  {
    arquivo: `${E}/ferramentas/lab39.ts`,
    trecho: "das duas provas",
    le: `${E}/ferramentas/lab39.ts`,
    conta:
      'as provas que a ferramenta LÊ de `docs/provas/` (`readFileSync(join(RAIZ, "docs", "provas", …`)',
    contar: (t) =>
      [...t.matchAll(/readFileSync\(join\(RAIZ, "docs", "provas", /g)].length,
  },
  {
    arquivo: "external-engines/conferir.sh",
    trecho: "dois pacotes",
    le: "external-engines/conferir.sh",
    conta:
      "os pacotes de `COBERTOS`, pela régua do LAB-101 (`contarOsPassosDoScript`)",
    contar: (t) => contarOsPassosDoScript(t)?.pacotes ?? null,
  },
  {
    arquivo: "external-engines/conferir.sh",
    trecho: "sete passos",
    le: "external-engines/conferir.sh",
    conta:
      "os passos do script, pela régua do LAB-101 (`contarOsPassosDoScript`)",
    contar: (t) => contarOsPassosDoScript(t)?.total ?? null,
  },
  {
    arquivo: `${E}/tests/regras.test.ts`,
    trecho: "duas classes de exceção",
    le: `${E}/tests/regras.test.ts`,
    conta:
      "as listas de exceção com motivo (`const NOME: Record<string, string>` ou `Record<string, {…}>`)",
    contar: (t) =>
      [...t.matchAll(/const [A-Z_]+: Record<string, (?:string>|\{)/g)].length,
  },
  {
    arquivo: `${E}/tests/promessas.test.ts`,
    trecho: "quatro promessas",
    le: `${E}/tests/promessas.test.ts`,
    conta: "os `test(` com `→` no título do `describe` das promessas do LAB-35",
    contar: (t) =>
      tamanho(
        testesDoDescribe(t, "as promessas do inventário")?.filter((t) =>
          t.includes("→"),
        ) ?? null,
      ),
  },
  {
    arquivo: `${E}/tests/promessas.test.ts`,
    trecho: "dois tropeços",
    le: `${E}/tests/promessas.test.ts`,
    conta: "os cabeçalhos `// ── E o … erro … (D135)` no arquivo",
    contar: (t) => [...t.matchAll(/^\s*\/\/ ── E o .*erro.*\(D135\)/gm)].length,
  },
  {
    arquivo: `${E}/tests/coluna-vertebral.test.ts`,
    trecho: "três travas",
    le: `${E}/tests/coluna-vertebral.test.ts`,
    conta: "os `test(` do `describe` da PONTE",
    contar: (t) => tamanho(testesDoDescribe(t, "a PONTE entrega")),
  },
  {
    arquivo: `${E}/tests/alinhamento.test.ts`,
    trecho: "duas réguas novas",
    le: `${E}/tests/alinhamento.test.ts`,
    conta: 'os `describe(` de nível de cima que começam por *"a régua"*',
    contar: (t) => describes(t).filter((d) => d.startsWith("a régua")).length,
  },
  {
    arquivo: `${E}/src/guarda-da-ida.ts`,
    trecho: "Cinco regras",
    le: `${E}/src/guarda-da-ida.ts`,
    conta: "os itens de `REGRAS_DA_IDA`",
    contar: (t) => tamanho(listaDeTextos(t, "REGRAS_DA_IDA")),
  },
  {
    arquivo: `${E}/src/guarda-da-ida.ts`,
    trecho: "duas reprovam",
    le: `${E}/src/guarda-da-ida.ts`,
    conta: "os itens de `REGRAS_DA_IDA_QUE_REPROVAM`",
    contar: (t) => tamanho(listaDeTextos(t, "REGRAS_DA_IDA_QUE_REPROVAM")),
  },
  {
    arquivo: `${E}/src/guarda-da-ida.ts`,
    trecho: "a quinta é a",
    le: `${E}/src/guarda-da-ida.ts`,
    conta: "a posição de `divida-do-lab` em `REGRAS_DA_IDA`",
    contar: (t) => posicao(listaDeTextos(t, "REGRAS_DA_IDA"), "divida-do-lab"),
  },
  {
    arquivo: `${E}/src/porta/experimentos.ts`,
    trecho: "em três travas",
    le: `${E}/tests/porta.test.ts`,
    conta:
      "os `test(` do `describe` da varredura das capacidades, em `tests/porta.test.ts`",
    contar: (t) => tamanho(testesDoDescribe(t, "a varredura das capacidades")),
  },
  {
    arquivo: `${E}/src/guarda-da-ponte.ts`,
    trecho: "três regras",
    le: `${E}/src/guarda-da-ponte.ts`,
    conta: "os itens de `REGRAS_DA_PONTE`",
    contar: (t) => tamanho(listaDeTextos(t, "REGRAS_DA_PONTE")),
  },
  {
    arquivo: `${E}/src/guarda-da-ponte.ts`,
    trecho: "A primeira",
    le: `${E}/src/guarda-da-ponte.ts`,
    conta:
      "a posição de `campo-vazio` em `REGRAS_DA_PONTE` — a regra que casa por nome",
    contar: (t) => posicao(listaDeTextos(t, "REGRAS_DA_PONTE"), "campo-vazio"),
  },
  {
    arquivo: `${E}/src/terreno-indicadores.ts`,
    trecho: "os dois limites",
    le: `${E}/src/terreno-indicadores.ts`,
    conta: "as constantes `export const LIMITE_…_PCT`",
    contar: (t) => [...t.matchAll(/^export const LIMITE_\w+_PCT\s*=/gm)].length,
  },
  {
    arquivo: `${E}/src/rampa.ts`,
    trecho: "quatro cortes",
    le: `${E}/src/rampa.ts`,
    conta: "os itens de `CORTES_DE_RAMPA`",
    contar: (t) => tamanhoDaLista(t, "CORTES_DE_RAMPA"),
  },
  {
    arquivo: `${E}/src/forma.ts`,
    trecho: "três cortes",
    le: `${E}/src/forma.ts`,
    conta: "os itens de `CORTES_DE_FORMA`",
    contar: (t) => tamanhoDaLista(t, "CORTES_DE_FORMA"),
  },
];

/** Um número que NÃO conta o arquivo da linha, com o motivo. */
export interface NaoConta {
  arquivo: string;
  trecho: string;
  motivo: string;
}

export const NAO_CONTAM: readonly NaoConta[] = [
  {
    arquivo: "external-engines/conferir.sh",
    trecho: "duas guardas antes",
    motivo:
      "as duas são NOMEADAS na mesma frase, cada uma com a sua decisão (descobrir o `package.json`, D122; precondição que falta é falha, D124): o número conta o texto, e o texto as mostra",
  },
  {
    arquivo: `${E}/tests/alinhamento.test.ts`,
    trecho: "sexta repetição",
    motivo:
      "é relato: a sexta vez do defeito, na história do LAB-32 — ordinal de acontecimento, não item do arquivo",
  },
  {
    arquivo: `${E}/src/terreno-indicadores.ts`,
    trecho: "nas duas direções",
    motivo:
      "é geometria: a declividade numa grade plana se mede em x e em y, e o número é o do plano, não um item do arquivo",
  },
  {
    arquivo: ".github/workflows/verde.yml",
    trecho: "08/10/2026",
    motivo:
      "é data: o dia em que o gatilho foi desligado — e a frase de que ele está desligado é cobrada pela régua do LAB-102 (`o-ci-que-roda.ts`, D329), não por esta",
  },
  {
    arquivo:
      "external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts",
    trecho: "10/09/2026",
    motivo:
      "é data: o dia dos números com que a prova compara (D123), e data não se reconta",
  },
];

/** Um desacordo achado. */
export interface Desacordo {
  arquivo: string;
  trecho: string;
  motivo:
    | "numero-sem-entrada"
    | "entrada-sem-trecho"
    | "trecho-repetido"
    | "conta-diferente"
    | "nao-contou"
    | "trecho-sem-um-numero";
  escrito?: number | null;
  contado?: number | null;
  conta?: string;
}

export interface ContagensDoIndice {
  /** As linhas da seção lidas, e os números achados nelas — o universo, publicado. */
  linhasLidas: number;
  numerosLidos: number;
  contagens: number;
  naoContam: number;
  desacordos: Desacordo[];
}

/** A conferência nos dois sentidos. `null` quando a seção não existe — não lê, não aprova. */
export function conferirAsContagens(
  indice: string,
  ler: Ler,
  contagens: readonly Contagem[] = CONTAGENS,
  naoContam: readonly NaoConta[] = NAO_CONTAM,
): ContagensDoIndice | null {
  const linhas = linhasDaSecao(indice);
  if (linhas === null) return null;
  const numeros = numerosDaSecao(linhas);
  const desacordos: Desacordo[] = [];
  const cobertos = new Set<string>();
  const entradas: { arquivo: string; trecho: string; contagem?: Contagem }[] = [
    ...contagens.map((c) => ({
      arquivo: c.arquivo,
      trecho: c.trecho,
      contagem: c,
    })),
    ...naoContam.map((n) => ({ arquivo: n.arquivo, trecho: n.trecho })),
  ];
  for (const e of entradas) {
    const linha = linhas.filter((l) => l.arquivo === e.arquivo);
    const achados = linha.flatMap((l) => {
      const onde: number[] = [];
      for (
        let i = l.descricao.indexOf(e.trecho);
        i >= 0;
        i = l.descricao.indexOf(e.trecho, i + 1)
      )
        onde.push(i);
      return onde.map((i) => ({ l, i }));
    });
    if (achados.length === 0) {
      desacordos.push({
        arquivo: e.arquivo,
        trecho: e.trecho,
        motivo: "entrada-sem-trecho",
      });
      continue;
    }
    if (achados.length > 1) {
      desacordos.push({
        arquivo: e.arquivo,
        trecho: e.trecho,
        motivo: "trecho-repetido",
      });
      continue;
    }
    const { l, i } = achados[0]!;
    const dentro = numeros.filter(
      (n) =>
        n.linha === l.linha &&
        n.posicao >= i &&
        n.posicao < i + e.trecho.length,
    );
    if (dentro.length !== 1) {
      desacordos.push({
        arquivo: e.arquivo,
        trecho: e.trecho,
        motivo: "trecho-sem-um-numero",
      });
      continue;
    }
    cobertos.add(`${dentro[0]!.linha}:${dentro[0]!.posicao}`);
    if (e.contagem === undefined) continue;
    const escrito = valorDoNumero(dentro[0]!.palavra);
    const texto = ler(e.contagem.le);
    const contado = texto === null ? null : e.contagem.contar(texto);
    if (contado === null)
      desacordos.push({
        arquivo: e.arquivo,
        trecho: e.trecho,
        motivo: "nao-contou",
        escrito,
        contado,
        conta: e.contagem.conta,
      });
    else if (contado !== escrito)
      desacordos.push({
        arquivo: e.arquivo,
        trecho: e.trecho,
        motivo: "conta-diferente",
        escrito,
        contado,
        conta: e.contagem.conta,
      });
  }
  for (const n of numeros)
    if (!cobertos.has(`${n.linha}:${n.posicao}`))
      desacordos.push({
        arquivo: n.arquivo,
        trecho: n.palavra,
        motivo: "numero-sem-entrada",
      });
  return {
    linhasLidas: linhas.length,
    numerosLidos: numeros.length,
    contagens: contagens.length,
    naoContam: naoContam.length,
    desacordos,
  };
}
