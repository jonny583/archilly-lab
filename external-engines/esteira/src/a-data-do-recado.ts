/**
 * O RECADO VAI AO `RECADOS.md` "COM DATA", E "EM ORDEM CRONOLÓGICA" — e nada perguntava. (LAB-128,
 * item 900, a dívida própria, D356)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §1 manda: *"O recado vai também, inteiro e com data, a `docs/relatorios/RECADOS.md`."*
 * E o próprio `RECADOS.md` diz, no alto: *"O mesmo recado é acrescentado aqui, com a data, em ordem
 * cronológica — o mais antigo primeiro."* A forma, a mesma desde o primeiro recado, é um título por rodada —
 * `## DD/MM/AAAA · <prompt ou classe> — <assunto>` — com o bloco do recado embaixo.
 *
 * **As travas que leem esses títulos não cobram a data nem a ordem.** O `o-ultimo-prompt.ts`
 * (LAB-126) lê `## DD/MM/AAAA · …` com uma expressão que simplesmente **não enxerga** o título sem
 * data; o `classes-de-rodada.ts` (item 002) ancora o recado pelo cabeçalho dele, não pelo título; o
 * `recado.test.ts` confere o bloco. Medido por mutação, antes de escrever esta régua, rodando as 184
 * travas dos 13 arquivos de teste que citam o `RECADOS.md`: tirar a data do título do LAB-50 → **0 falhas**; pôr o LAB-120 em
 * 03/10, atrás do LAB-119 → **0 falhas**; datar o LAB-110 em 31/02 → **0 falhas**. Tirar a data do
 * LAB-121 deu **1** falha — mas só porque ele está na corrente do cabeçalho do `ONDE_PARAMOS.md`; é
 * acaso de posição, não guarda. *Regra sem guarda*, a primeira espécie da dívida própria.
 *
 * # O que se mediu (16/10/2026), por LUGAR
 *
 * O lugar é o próprio `RECADOS.md`: todo título `## ` fora de bloco de código. **139 títulos, 139
 * blocos de recado, um por título**, nenhum recado antes do primeiro título. **Todos com data**, e a
 * data nunca volta: de 13/09/2026 (LAB-07) a 16/10/2026 (LAB-127). Um título só tem forma diferente,
 * e é válida: `## 07/10/2026 (noite) · A fila T-36 a T-39 …` — a data está lá, com um qualificador
 * entre parênteses. Cumprida por disciplina, sem nenhuma quebra; é a disciplina que esta trava passa
 * a cobrar.
 *
 * # As escolhas, e de onde veio cada uma
 *
 * - **"Em ordem" é "a data nunca volta"**, não *"a data sempre avança"*: dois, três, até dez recados
 *   no mesmo dia são comuns. A comparação é de **data**, não de texto — *"01/10"*
 *   vem antes de *"30/09"* na ordem das letras, e um caso de teste prende isso.
 * - **O qualificador entre parênteses vale** (`(noite)`): a data está escrita; a palavra a mais é do
 *   dia, não da forma.
 * - **Um recado por título.** O título é a âncora da data: dois recados sob um título deixam o
 *   segundo com a data emprestada, e um título sem recado é data que não ancora nada.
 * - **A data no futuro reprova**, contra um *"hoje"* que vem de fora (a régua é pura). Não é bomba de
 *   data: o tempo só faz o caso passar, nunca reprovar.
 * - **Título dentro de bloco de código não é título** — um recado que cite `## …` não vira rodada.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se a data é a do dia em que o recado foi escrito** — a régua confere a forma e a ordem, não o
 *   calendário do commit (o `o-ultimo-prompt.ts` confere a data do cabeçalho contra a do título);
 * - **o "inteiro"** — que o recado no arquivo é o mesmo que foi ao chat: o chat não é arquivo, e não
 *   há o que comparar. O bloco ter as marcas de abertura e de fim é do `recado.test.ts`;
 * - **a hora**: o título não tem hora.
 */

const ABRE_O_RECADO = /^=== RECADO PARA O CHAT\b/;

/** `## DD/MM/AAAA · …`, com um qualificador opcional entre parênteses: `## 07/10/2026 (noite) · …`. */
const TITULO_COM_DATA = /^## (\d{2})\/(\d{2})\/(\d{4})(?: \([^)\n]+\))? · \S/;

export type TipoDeProblemaDaData =
  | "titulo-sem-data"
  | "data-invalida"
  | "data-que-volta"
  | "data-no-futuro"
  | "titulo-sem-recado"
  | "titulo-com-dois-recados"
  | "recado-sem-titulo";

export interface ProblemaDaData {
  /** A linha do arquivo, contando de 1. */
  linha: number;
  tipo: TipoDeProblemaDaData;
  detalhe: string;
}

export interface TituloDaRodada {
  linha: number;
  texto: string;
  /** `AAAA-MM-DD`, ou `null` se o título não tem data (ou tem uma que o calendário não tem). */
  data: string | null;
  /** Quantos recados abrem entre este título e o próximo. */
  recados: number;
}

/** A data `DD/MM/AAAA` existe no calendário? `31/02` não existe. */
function dataDoCalendario(d: number, m: number, a: number): boolean {
  const x = new Date(Date.UTC(a, m - 1, d));
  return x.getUTCFullYear() === a && x.getUTCMonth() === m - 1 && x.getUTCDate() === d;
}

const duas = (n: number): string => String(n).padStart(2, "0");

/**
 * Os títulos de rodada do `RECADOS.md` — todo `## ` fora de bloco de código —, com a data lida e os
 * recados contados. Devolve também os recados que abrem antes do primeiro título.
 */
export function lerOsTitulos(recados: string): { titulos: TituloDaRodada[]; semTitulo: number[]; invalidas: Set<number> } {
  const linhas = recados.split("\n");
  const titulos: TituloDaRodada[] = [];
  const semTitulo: number[] = [];
  const invalidas = new Set<number>();
  let noBloco = false;
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i]!;
    if (l.startsWith("```")) {
      noBloco = !noBloco;
      continue;
    }
    if (noBloco) {
      if (ABRE_O_RECADO.test(l)) {
        const ultimo = titulos.at(-1);
        if (ultimo === undefined) semTitulo.push(i + 1);
        else ultimo.recados++;
      }
      continue;
    }
    if (!l.startsWith("## ")) continue;
    const m = TITULO_COM_DATA.exec(l);
    let data: string | null = null;
    if (m) {
      const [d, mes, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
      if (dataDoCalendario(d, mes, a)) data = `${a}-${duas(mes)}-${duas(d)}`;
      else invalidas.add(i + 1);
    }
    titulos.push({ linha: i + 1, texto: l, data, recados: 0 });
  }
  return { titulos, semTitulo, invalidas };
}

/**
 * Confere a data e a ordem dos títulos do `RECADOS.md`. `hoje` é `AAAA-MM-DD`, e vem de fora para a
 * régua ser pura.
 */
export function conferirADataDoRecado(
  recados: string,
  hoje: string,
): { titulos: number; recados: number; primeira: string | null; ultima: string | null; problemas: ProblemaDaData[] } {
  const { titulos, semTitulo, invalidas } = lerOsTitulos(recados);
  const problemas: ProblemaDaData[] = [];
  let anterior: TituloDaRodada | null = null;
  for (const t of titulos) {
    const curto = t.texto.slice(0, 80);
    if (t.data === null) {
      problemas.push(
        invalidas.has(t.linha)
          ? { linha: t.linha, tipo: "data-invalida", detalhe: `o calendário não tem esta data: ${curto}` }
          : { linha: t.linha, tipo: "titulo-sem-data", detalhe: `o título não abre com DD/MM/AAAA: ${curto}` },
      );
    } else {
      if (anterior !== null && t.data < anterior.data!) {
        problemas.push({ linha: t.linha, tipo: "data-que-volta", detalhe: `${t.data} depois de ${anterior.data} (linha ${anterior.linha}): ${curto}` });
      }
      if (t.data > hoje) {
        problemas.push({ linha: t.linha, tipo: "data-no-futuro", detalhe: `${t.data} é depois de hoje (${hoje}): ${curto}` });
      }
      anterior = t;
    }
    if (t.recados === 0) problemas.push({ linha: t.linha, tipo: "titulo-sem-recado", detalhe: `nenhum recado abre sob: ${curto}` });
    if (t.recados > 1) problemas.push({ linha: t.linha, tipo: "titulo-com-dois-recados", detalhe: `${t.recados} recados sob: ${curto}` });
  }
  for (const linha of semTitulo) {
    problemas.push({ linha, tipo: "recado-sem-titulo", detalhe: "o recado abre antes do primeiro título, sem data" });
  }
  const datas = titulos.map((t) => t.data).filter((d): d is string => d !== null);
  return {
    titulos: titulos.length,
    recados: titulos.reduce((s, t) => s + t.recados, 0) + semTitulo.length,
    primeira: datas.length > 0 ? datas[0]! : null,
    ultima: datas.length > 0 ? datas[datas.length - 1]! : null,
    problemas,
  };
}

/** As duas frases que esta trava cobra — conferidas, no teste, onde elas moram. */
export const A_REGRA_NO_CLAUDE = "O recado vai também, inteiro e com data, a";
export const A_REGRA_NO_RECADOS = "com a data, em ordem cronológica — o mais antigo primeiro";
