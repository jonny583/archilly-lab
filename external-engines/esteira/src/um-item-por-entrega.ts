/**
 * UM PROMPT POR DESPERTADOR, E O ANTERIOR ABERTO SE TERMINA PRIMEIRO — e nada lia a caixa pela história. (LAB-144,
 * item 900, a dívida própria, D372)
 *
 * # A regra, e por que ela ficou de fora seis vezes
 *
 * O `CLAUDE.md` §1-A manda: *"**Um prompt por despertador**; o anterior aberto se termina primeiro."* Do LAB-138 ao
 * LAB-143 ela foi descartada com o mesmo motivo — *"não se mede sem ler o que cada disparo fez"*. É verdade para o
 * DISPARO (a sessão não deixa rastro de quando acordou). **Não é verdade para o ITEM**: cada item da caixa que se
 * termina deixa um rastro exato — o arquivo vira `NNN-FEITO.md` num commit da primeira linha da `main`. Por esse
 * LUGAR, as duas metades da frase são perguntáveis:
 *
 * 1. **um por entrega** — nenhum commit da primeira linha fecha dois itens de números diferentes (o item e os seus
 *    adendos são um pedido só: o `010` e o `010-adendo`, o `025` e os dois adendos dele entraram juntos, e devem);
 * 2. **o anterior primeiro** — quando o item `N` vira `-FEITO`, a árvore de antes não tem item da direção ABERTO com
 *    número menor que `N` (o `900`, a *"lista própria"*, não conta: ele nunca se fecha e só vale quando não há outro);
 * 3. e, do mesmo rastro, o que o `900.md` manda por escrito: **o `900` nunca vira `-FEITO`**.
 *
 * # O que se mediu (17/10/2026), por LUGAR
 *
 * A primeira linha da `main` (`--first-parent`), cada commit lido **contra o seu primeiro pai**
 * (`--diff-merges=first-parent`, a mescla `--no-ff` lida pelo que ela trouxe à `main`), só a
 * pasta `docs/caixa-de-entrada/`, a árvore reconstruída do nascimento da caixa até hoje. Trinta entregas fecharam
 * item — `001` a `030`, uma cada, em ordem, sem pular nenhum; três delas com adendos do mesmo número (34 arquivos
 * `-FEITO`). **Zero problemas** — depois de separar **uma colisão**: a primeira leitura acusou o LAB-82 (`306954d`) de
 * fechar o `015` com o `013.md` aberto, e o `013.md` era um SEGUNDO arquivo com o número de um item já terminado
 * (`013-FEITO.md`, LAB-80), que a própria entrega renumerou para `015` (o aviso está no topo do `015-FEITO.md`). O
 * anterior daquele número já tinha se terminado: é número repetido, não item pulado. Regra cumprida por disciplina, sem
 * guarda: *regra sem guarda*, a primeira espécie da dívida própria.
 *
 * # O que esta régua decide, e é uma função pura
 *
 * Dada a lista de PASSOS (o que cada commit acrescentou e tirou da pasta), ela reconstrói a árvore e devolve os
 * problemas, o universo lido e as exceções. Ler o `git` é do chamador ({@link argumentosDoLog}, {@link lerOsPassos}).
 */

import { ITEM_RESERVADO, lerNomeDoItem } from "./numero-do-item.ts";

/** A regra, como o `CLAUDE.md` §1-A a escreve — a trava confere que ela continua lá. */
export const A_REGRA = "**Um prompt por despertador**; o anterior aberto se termina primeiro.";

/** A pasta da caixa, como o `git` a escreve. */
export const A_CAIXA = "docs/caixa-de-entrada/";

/** Um commit da primeira linha que mexeu na caixa: o que ele acrescentou e o que tirou, contra o primeiro pai. */
export interface PassoDaCaixa {
  hash: string;
  assunto: string;
  /** Nomes de arquivo (sem a pasta) que passaram a existir. */
  adicionados: string[];
  /** Nomes de arquivo (sem a pasta) que deixaram de existir. */
  removidos: string[];
}

export type TipoDeProblema =
  /** Um commit fechou itens de dois números diferentes. */
  | "dois-itens-numa-entrega"
  /** O item `N` fechou com um item da direção aberto de número menor na árvore de antes. */
  | "pulou-o-anterior"
  /** O `900` virou `-FEITO`. */
  | "fechou-o-reservado";

export interface ProblemaDaCaixa {
  hash: string;
  tipo: TipoDeProblema;
  detalhe: string;
}

/** Uma exceção é o commit (prefixo do hash, sete ou mais) e o tipo, com o motivo — nunca uma regra afrouxada. */
export interface ExcecaoDaCaixa {
  hash: string;
  tipo: TipoDeProblema;
  motivo: string;
}

/**
 * **Nenhuma**, medido em 17/10/2026: as trinta entregas cumpriram. Exceção que entrar aqui diz o motivo, e a que não
 * perdoar nada reprova (`excecoesSemUso`).
 */
export const EXCECOES: readonly ExcecaoDaCaixa[] = [];

export interface UniversoDaCaixa {
  /** Commits da primeira linha que mexeram na caixa. */
  passos: number;
  /** Desses, os que fecharam algum item. */
  entregasQueFecham: number;
  /** Números de item fechados (o item e os adendos contam um). */
  numerosFechados: number;
  /** Arquivos que viraram `-FEITO` (o item e cada adendo contam um). */
  arquivosFechados: number;
  /** Itens da direção abertos na árvore de hoje, fora o `900`. */
  abertosHoje: number;
}

export interface ConferenciaDaCaixa {
  universo: UniversoDaCaixa;
  /** Os números fechados, na ordem em que fecharam. */
  ordem: number[];
  /** Abertos de número menor que NÃO contaram como anterior, por terem a identidade de um `-FEITO` (`hash nome`). */
  colisoes: string[];
  problemas: ProblemaDaCaixa[];
  perdoados: ProblemaDaCaixa[];
  excecoesSemUso: ExcecaoDaCaixa[];
}

const casa = (prefixo: string, hash: string): boolean => prefixo.length >= 7 && hash.startsWith(prefixo);

/** Reconstrói a caixa passo a passo e confere as três coisas. */
export function conferirAsEntregas(
  passos: readonly PassoDaCaixa[],
  excecoes: readonly ExcecaoDaCaixa[] = EXCECOES,
): ConferenciaDaCaixa {
  const arvore = new Set<string>();
  const problemas: ProblemaDaCaixa[] = [];
  const perdoados: ProblemaDaCaixa[] = [];
  const usadas = new Set<ExcecaoDaCaixa>();
  const ordem: number[] = [];
  const colisoes: string[] = [];
  let entregasQueFecham = 0;
  let arquivosFechados = 0;

  const anotar = (p: ProblemaDaCaixa): void => {
    const e = excecoes.find((x) => casa(x.hash, p.hash) && x.tipo === p.tipo);
    if (e === undefined) problemas.push(p);
    else {
      perdoados.push(p);
      usadas.add(e);
    }
  };

  for (const passo of passos) {
    const antes = [...arvore];
    const feitosAntes = new Set(
      antes.map(lerNomeDoItem).filter((i) => i !== null && i.estado === "feito").map((i) => i!.identidade),
    );
    for (const r of passo.removidos) arvore.delete(r);
    for (const a of passo.adicionados) arvore.add(a);

    // O que virou -FEITO neste passo: arquivo FEITO novo cuja identidade não estava feita antes.
    const fechados = passo.adicionados
      .map(lerNomeDoItem)
      .filter((i): i is NonNullable<typeof i> => i !== null && i.estado === "feito" && !feitosAntes.has(i.identidade));
    if (fechados.length === 0) continue;

    entregasQueFecham++;
    arquivosFechados += fechados.length;
    const numeros = [...new Set(fechados.map((i) => i.numero))].sort((a, b) => a - b);
    ordem.push(...numeros);
    const curto = `${passo.hash.slice(0, 7)} "${passo.assunto.slice(0, 70)}"`;

    if (numeros.includes(ITEM_RESERVADO)) {
      anotar({
        hash: passo.hash,
        tipo: "fechou-o-reservado",
        detalhe: `${curto}: o ${ITEM_RESERVADO} virou -FEITO — o 900.md diz "este item nunca se fecha"`,
      });
    }
    if (numeros.length > 1) {
      anotar({
        hash: passo.hash,
        tipo: "dois-itens-numa-entrega",
        detalhe: `${curto}: fechou ${numeros.length} itens (${numeros.join(", ")}) — "um prompt por despertador" (CLAUDE.md §1-A)`,
      });
    }
    for (const n of numeros) {
      if (n === ITEM_RESERVADO) continue;
      const abertosMenores = antes
        .map(lerNomeDoItem)
        .filter(
          (i): i is NonNullable<typeof i> =>
            i !== null && i.estado === "aberto" && i.numero !== ITEM_RESERVADO && i.numero < n && !numeros.includes(i.numero),
        );
      // (O menor que fecha no MESMO passo não é o anterior pulado: é o segundo item da entrega, e já foi acusado acima.)
      // A COLISÃO não é o anterior: um aberto cuja identidade já está `-FEITO` é um segundo arquivo com o número de um
      // item terminado (D273) — o `013.md` que a direção escreveu com o `013-FEITO.md` ao lado, renumerado para `015`
      // no LAB-82. O anterior daquele número já se terminou; o que sobra é o número repetido, e esse tem a sua guarda.
      for (const i of abertosMenores) if (feitosAntes.has(i.identidade)) colisoes.push(`${passo.hash.slice(0, 7)} ${i.nome}`);
      const anteriores = abertosMenores
        .filter((i) => !feitosAntes.has(i.identidade))
        .map((i) => i.nome)
        .sort();
      if (anteriores.length > 0) {
        anotar({
          hash: passo.hash,
          tipo: "pulou-o-anterior",
          detalhe: `${curto}: fechou o ${n} com ${anteriores.join(", ")} aberto(s) — "o anterior aberto se termina primeiro" (CLAUDE.md §1-A)`,
        });
      }
    }
  }

  const abertosHoje = [...arvore]
    .map(lerNomeDoItem)
    .filter((i) => i !== null && i.estado === "aberto" && i.numero !== ITEM_RESERVADO).length;

  return {
    universo: {
      passos: passos.length,
      entregasQueFecham,
      numerosFechados: ordem.length,
      arquivosFechados,
      abertosHoje,
    },
    ordem,
    colisoes,
    problemas,
    perdoados,
    excecoesSemUso: excecoes.filter((e) => !usadas.has(e)),
  };
}

/**
 * Os argumentos do `git log` que {@link lerOsPassos} lê — escritos uma vez. **`--first-parent` é a peça que não pode
 * sair**: sem ela a entrega aparece no commit do RAMO, e a mescla na `main` não diz nada — a régua contaria os passos de
 * quem trabalhou, não o que a `main` recebeu. O `--diff-merges=first-parent` vai **escrito**, mesmo que o `git` daqui
 * (2.43) já o deduza do `--first-parent` (medido no LAB-144: tirá-lo não muda nada nesta máquina) — o `git` de antes do
 * 2.31 não deduzia, e com ele a mescla saía sem diferença e toda entrega `--no-ff` sumia.
 */
export const argumentosDoLog = (ref: string): string[] => [
  "log",
  "--reverse",
  "--first-parent",
  "--diff-merges=first-parent",
  "--no-renames",
  "--name-status",
  "--format=%x00%H%x1f%s",
  ref,
  "--",
  A_CAIXA,
];

/** Lê a saída de {@link argumentosDoLog}: cada commit abre com `NUL`, hash e assunto por `US`, e as linhas `A`/`D`/`M`. */
export function lerOsPassos(saida: string): PassoDaCaixa[] {
  const passos: PassoDaCaixa[] = [];
  for (const pedaco of saida.split("\u0000")) {
    if (pedaco.trim() === "") continue;
    const [cabecalho, ...linhas] = pedaco.split("\n");
    const [hash, ...assunto] = (cabecalho ?? "").split("\u001f");
    if (hash === undefined || !/^[0-9a-f]{40}$/.test(hash)) continue;
    const adicionados: string[] = [];
    const removidos: string[] = [];
    for (const linha of linhas) {
      const m = /^([ADMT])\t(.+)$/.exec(linha.trim());
      if (!m) continue;
      const caminho = m[2]!;
      if (!caminho.startsWith(A_CAIXA)) continue;
      const nome = caminho.slice(A_CAIXA.length);
      if (nome.includes("/")) continue;
      if (m[1] === "A") adicionados.push(nome);
      else if (m[1] === "D") removidos.push(nome);
    }
    passos.push({ hash, assunto: assunto.join("\u001f"), adicionados, removidos });
  }
  return passos;
}

/** **O LIMITE, dito na saída** — guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA = [
  "o DISPARO: uma entrega é um commit da primeira linha, não um despertador — dois disparos que juntassem um item numa entrega só passam, e um disparo que fizesse duas entregas de um item cada também",
  "o ramo que ainda não chegou à main: a régua lê a primeira linha da main, e a entrega em curso entra quando for mesclada",
  "o 900: as rodadas da lista própria não fecham item, e por isso não aparecem aqui — quem diz qual tarefa e de qual lista é a trava do LAB-127",
  "o item PULADO de propósito e declarado: não há hoje forma de declarar, e o primeiro que houver vira exceção com o motivo",
  "a COLISÃO: um aberto com o número de um item já -FEITO não conta como anterior (D273) — é o número repetido, e quem o acusa é a guarda do número (numero-do-item); aqui ele só é contado em `colisoes`",
  "o clone raso: a leitura recusa pela D295, porque a primeira linha de um clone raso começa no corte",
] as const;
