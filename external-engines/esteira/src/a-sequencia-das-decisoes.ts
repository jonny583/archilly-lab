/**
 * A DECISÃO É NUMERADA — e nada perguntava pela numeração. (LAB-131, item 900, a dívida própria, D359)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §7 manda que todo prompt feche com *"decisões em `docs/DECISOES.md`"*, e a D01, que fez o
 * arquivo nascer, adotou o padrão do Geo: *"um arquivo só, decisões numeradas"* — `D01`, `D02`…, com data.
 * A casa inteira **cita** as decisões pelo número (4 778 citações em 171 páginas, medido em 16/10/2026):
 * o recado, a FILA, o relatório, o próprio `CLAUDE.md`. Número que some, se repete ou volta no
 * calendário quebra todas essas citações sem que nenhuma página mude.
 *
 * Medido por mutação (16/10/2026), a suíte inteira da esteira com quatro mudanças plantadas no
 * `DECISOES.md` ao mesmo tempo — o título da D200 apagado (buraco), a D201 renumerada como D200
 * (repetição), a D300 datada em 01/09/2026 (o calendário volta) e a **D358 inteira apagada** → **zero**
 * falhas (1 397 aprovadas, 9 reprovadas — as nove do `.wasm`, as mesmas de antes). *Regra sem guarda*,
 * a primeira espécie da dívida própria.
 *
 * # O que se mediu, por LUGAR
 *
 * - **os títulos**: todo `## D…` fora de bloco de código — **357**, de D01 a D358, nenhum repetido, em
 *   ordem, todos datados, e o calendário nunca volta. **Um buraco: a D176 nunca existiu.** O recado do
 *   LAB-50 (06/10/2026) anunciou *"próxima decisão D176"*, e o LAB-51 escreveu a D177 — `git log -S` não
 *   acha commit nenhum que tenha escrito `## D176`. Declarada em {@link BURACOS_DECLARADOS}, com o motivo;
 * - **a história**: as 140 versões do `DECISOES.md` na `main` — **nenhum número sumiu** de uma versão
 *   para a seguinte (medido no relatório, não aqui: o CI clona raso, D293);
 * - **as citações**: 4 778 `D\d{2,}` nas páginas da casa ({@link PAGINAS_QUE_CITAM}) — **28** sem título:
 *   27 são a `D1000`, o número hipotético com que a D339 mediu o teto de casas (declarada em
 *   {@link CITACOES_SEM_TITULO}), e uma é a própria *"próxima decisão D176"* no recado do LAB-50 — a
 *   citação do buraco declarado, que vale em qualquer página: citá-lo é dizer que ele não existe.
 *
 * # As escolhas
 *
 * - **O número do título é o primeiro `D` depois do `##`**, riscado ou não (`## ~~D236~~ · …` é a D236,
 *   desempatada na D244 — riscar é o jeito desta casa de não apagar). Título de decisão em outro nível
 *   (`###`) reprova: a casa inteira lê `## D`.
 * - **A data é a primeira `DD/MM/AAAA` do título**; a D159 tem texto depois da data (*"MOLDURA
 *   CORRIGIDA"*) e vale.
 * - **O buraco declarado é conferido nos dois sentidos**: tem de continuar sendo buraco (senão sobra
 *   perdão), e buraco novo não declarado reprova. A repetição e a volta do calendário não têm perdão.
 * - **A citação vale para qualquer número que tenha título, e para o buraco declarado** (a previsão do
 *   LAB-50 no `RECADOS.md`, que é registro e não se reescreve, e a nota que diz *"Não há D176"*). Sem
 *   título, só a forma declarada: a `D1000`, em qualquer página.
 * - **`hoje` vem de fora** (a régua é pura), como em `a-data-do-recado.ts`.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **que a citação seja DESTA casa**: *"a D17 do Geo"* passa porque existe uma D17 aqui. A régua
 *   pergunta se o número tem título, não de quem é a frase;
 * - **que o título diga o que a citação acha que ele diz** — isso é leitura;
 * - **que todo prompt tenha decisão** — há rodada sem decisão, e o §7 não a exige;
 * - **o motivo dentro da decisão** — *"decisão sem motivo escrito"* é juízo de texto;
 * - **a história** — só a versão de hoje; a que falta (um número que sumiu de vez, com os seguintes
 *   renumerados) aparece como citação sem título, porque a casa cita as decisões que escreve.
 */

import { DECISAO_DA_CASA } from "./numero-da-decisao.ts";

/** A frase da regra, conferida no teste onde ela mora (o `CLAUDE.md` §7). */
export const A_REGRA = "decisões em `docs/DECISOES.md`";

/** E a da D01, que fez o arquivo nascer numerado. */
export const A_ORIGEM = "Adotado o do Geo: um arquivo só, decisões numeradas.";

/** As páginas da casa cujas citações de decisão se conferem, além dos relatórios e dos itens da caixa. */
export const PAGINAS_QUE_CITAM = [
  "CLAUDE.md",
  "docs/DECISOES.md",
  "docs/INDEX.md",
  "docs/ONDE_PARAMOS.md",
  "docs/PENDENCIAS_JONNY.md",
  "docs/RAMOS_ABERTOS.md",
  "docs/prompts/FILA.md",
] as const;

export interface TituloDeDecisao {
  /** Linha do título no `DECISOES.md`, contando de 1. */
  linha: number;
  nivel: number;
  numero: number;
  /** `AAAA-MM-DD`, ou `null` se o título não tem data ou tem uma que o calendário não tem. */
  data: string | null;
  /** O título tinha data escrita, e o calendário não a tem (`31/02`). */
  dataInvalida: boolean;
}

export type TipoDeProblemaDaDecisao =
  | "nivel-errado"
  | "sem-data"
  | "data-invalida"
  | "data-no-futuro"
  | "data-volta"
  | "numero-repetido"
  | "fora-de-ordem"
  | "buraco"
  | "citacao-sem-titulo";

export interface ProblemaDaDecisao {
  /** O arquivo, contando da raiz. */
  arquivo: string;
  linha: number;
  tipo: TipoDeProblemaDaDecisao;
  detalhe: string;
}

export interface BuracoDeclarado {
  numero: number;
  motivo: string;
}

export interface CitacaoSemTitulo {
  /** A forma exata, `D1000`. */
  numero: string;
  /** Só neste arquivo; ausente = em qualquer página. */
  arquivo?: string;
  motivo: string;
}

export const BURACOS_DECLARADOS: readonly BuracoDeclarado[] = [
  {
    numero: 176,
    motivo:
      "nunca existiu: o recado do LAB-50 (06/10/2026) anunciou 'próxima decisão D176', e o LAB-51 (commit 44d2e34) escreveu a D177 — nenhum commit da história escreveu '## D176'. Não se inventa decisão para tapar número",
  },
];

export const CITACOES_SEM_TITULO: readonly CitacaoSemTitulo[] = [
  {
    numero: "D1000",
    motivo: "o número hipotético com que a D339 (LAB-112) mediu o teto de casas da forma antiga, de duas ou três casas — nunca foi decisão",
  },
];

/** A data `DD/MM/AAAA` existe no calendário? */
function noCalendario(d: number, m: number, a: number): boolean {
  const x = new Date(Date.UTC(a, m - 1, d));
  return x.getUTCFullYear() === a && x.getUTCMonth() === m - 1 && x.getUTCDate() === d;
}

/** As linhas fora de bloco de código (` ``` `), com o número de cada uma. */
function foraDeCodigo(texto: string): { linha: number; texto: string }[] {
  const saida: { linha: number; texto: string }[] = [];
  let dentro = false;
  texto.split("\n").forEach((l, i) => {
    if (/^\s*```/.test(l)) {
      dentro = !dentro;
      return;
    }
    if (!dentro) saida.push({ linha: i + 1, texto: l });
  });
  return saida;
}

/** O título: o nível, a decisão pela forma única da casa (riscada ou não), e o resto da linha. */
const TITULO = new RegExp(String.raw`^(#{1,6})\s*(?:~~)?\s*(${DECISAO_DA_CASA})\b(.*)$`);

/** A citação: a decisão pela forma única da casa, com fronteira dos dois lados. */
const CITACAO = new RegExp(String.raw`\b(${DECISAO_DA_CASA})\b`, "g");

/** Os títulos de decisão: toda linha de título cujo primeiro termo, riscado ou não, é `D` e duas casas ou mais. */
export function lerAsDecisoes(texto: string): TituloDeDecisao[] {
  const saida: TituloDeDecisao[] = [];
  for (const { linha, texto: l } of foraDeCodigo(texto)) {
    const m = TITULO.exec(l);
    if (m === null) continue;
    const d = /\b(\d{2})\/(\d{2})\/(\d{4})\b/.exec(m[3]!);
    let data: string | null = null;
    let dataInvalida = false;
    if (d !== null) {
      if (noCalendario(Number(d[1]), Number(d[2]), Number(d[3]))) data = `${d[3]}-${d[2]}-${d[1]}`;
      else dataInvalida = true;
    }
    saida.push({ linha, nivel: m[1]!.length, numero: Number(m[2]!.slice(1)), data, dataInvalida });
  }
  return saida;
}

const nome = (n: number): string => `D${String(n).padStart(2, "0")}`;

/**
 * Confere a numeração do `DECISOES.md` e as citações das páginas. `paginas` é a lista de
 * `{ arquivo, texto }` cujas citações se conferem (o `DECISOES.md` pode estar entre elas: ele se cita).
 * `hoje` é `AAAA-MM-DD`.
 */
export function conferirASequenciaDasDecisoes(
  decisoes: string,
  paginas: readonly { arquivo: string; texto: string }[],
  hoje: string,
  buracos: readonly BuracoDeclarado[] = BURACOS_DECLARADOS,
  citacoes: readonly CitacaoSemTitulo[] = CITACOES_SEM_TITULO,
): {
  universo: { titulos: number; primeira: number | null; ultima: number | null; paginas: number; citacoes: number };
  problemas: ProblemaDaDecisao[];
  /** Buracos declarados que não são buraco — a decisão existe, ou o número passa da última. */
  buracosSemUso: BuracoDeclarado[];
  /** Citações declaradas que nenhuma página faz mais. */
  citacoesSemUso: CitacaoSemTitulo[];
  perdoadas: number;
} {
  const ARQ = "docs/DECISOES.md";
  const titulos = lerAsDecisoes(decisoes);
  const problemas: ProblemaDaDecisao[] = [];
  const vistos = new Map<number, number>();
  let maior = 0;
  let ultimaData: string | null = null;

  for (const t of titulos) {
    const n = nome(t.numero);
    if (t.nivel !== 2) problemas.push({ arquivo: ARQ, linha: t.linha, tipo: "nivel-errado", detalhe: `${n} é título de nível ${t.nivel}; a casa lê '## D'` });
    if (t.dataInvalida) problemas.push({ arquivo: ARQ, linha: t.linha, tipo: "data-invalida", detalhe: `${n}: a data do título não existe no calendário` });
    else if (t.data === null) problemas.push({ arquivo: ARQ, linha: t.linha, tipo: "sem-data", detalhe: `${n} não tem DD/MM/AAAA no título` });
    else {
      if (t.data > hoje) problemas.push({ arquivo: ARQ, linha: t.linha, tipo: "data-no-futuro", detalhe: `${n}: ${t.data} é depois de hoje (${hoje})` });
      if (ultimaData !== null && t.data < ultimaData) problemas.push({ arquivo: ARQ, linha: t.linha, tipo: "data-volta", detalhe: `${n}: ${t.data} vem antes de ${ultimaData}, a data da decisão anterior` });
      if (ultimaData === null || t.data > ultimaData) ultimaData = t.data;
    }
    const antes = vistos.get(t.numero);
    if (antes !== undefined) problemas.push({ arquivo: ARQ, linha: t.linha, tipo: "numero-repetido", detalhe: `${n} já tem título na linha ${antes}` });
    else vistos.set(t.numero, t.linha);
    if (t.numero < maior && antes === undefined) problemas.push({ arquivo: ARQ, linha: t.linha, tipo: "fora-de-ordem", detalhe: `${n} vem depois de ${nome(maior)}` });
    maior = Math.max(maior, t.numero);
  }

  const declarados = new Map(buracos.map((b) => [b.numero, b]));
  for (let n = 1; n <= maior; n++) {
    if (vistos.has(n) || declarados.has(n)) continue;
    const depois = titulos.find((t) => t.numero > n);
    problemas.push({ arquivo: ARQ, linha: depois?.linha ?? 0, tipo: "buraco", detalhe: `não há título ${nome(n)} — entre a anterior e ${depois === undefined ? "o fim" : nome(depois.numero)}` });
  }
  const buracosSemUso = buracos.filter((b) => vistos.has(b.numero) || b.numero > maior);

  const usadas = new Set<CitacaoSemTitulo>();
  let total = 0;
  let perdoadas = 0;
  for (const p of paginas) {
    p.texto.split("\n").forEach((l, i) => {
      for (const m of l.matchAll(CITACAO)) {
        total++;
        const n = Number(m[1]!.slice(1));
        // A forma garante algarismos; a casa confere o número que guarda (LAB-52).
        if (!Number.isFinite(n) || vistos.has(n)) continue;
        if (declarados.has(n)) {
          // Citar o buraco declarado é dizer que ele não existe — a previsão do LAB-50, e a nota ao lado da D177.
          perdoadas++;
          continue;
        }
        const e = citacoes.find((c) => c.numero === m[0] && (c.arquivo === undefined || c.arquivo === p.arquivo));
        if (e !== undefined) {
          usadas.add(e);
          perdoadas++;
          continue;
        }
        problemas.push({ arquivo: p.arquivo, linha: i + 1, tipo: "citacao-sem-titulo", detalhe: `${m[0]} é citada e não tem título no DECISOES.md` });
      }
    });
  }

  return {
    universo: {
      titulos: titulos.length,
      primeira: titulos.length === 0 ? null : Math.min(...titulos.map((t) => t.numero)),
      ultima: titulos.length === 0 ? null : maior,
      paginas: paginas.length,
      citacoes: total,
    },
    problemas,
    buracosSemUso,
    citacoesSemUso: citacoes.filter((c) => !usadas.has(c)),
    perdoadas,
  };
}
