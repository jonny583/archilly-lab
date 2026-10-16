/**
 * AS CINCO LINHAS DO RECADO: "LINHA SEM CONTEÚDO LEVA `—`, NUNCA SOME" — e só o último recado era
 * conferido, e só pela presença. (LAB-129, item 900, a dívida própria, D357)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §1 dá o formato do recado — o cabeçalho, as cinco linhas `Estado:`, `Feito:`,
 * `Achados para outros apps ou Central:`, `Depende do Jonny:` e `Próximo na fila:`, e o `=== FIM ===`
 * — e manda: *"**Linha sem conteúdo leva `—`, nunca some.**"*
 *
 * **A única trava das cinco linhas era o `recado.test.ts`**, e ela olha **só o último** recado, com
 * `toContain(campo)`: a palavra aparecer em qualquer lugar do bloco basta. Medido por mutação antes
 * desta régua, no `RECADOS.md` de verdade, rodando as 200 travas dos 14 arquivos de teste que citam a
 * página e depois a suíte inteira da esteira (1 370 travas):
 *
 * - `Depende do Jonny:` **vazio** no último recado (o LAB-128) → **0 falhas**;
 * - a linha `Achados…` **tirada** do recado do LAB-50 → **0**;
 * - `Feito:` **antes** de `Estado:` no LAB-110 → **0**;
 * - `Depende do Jonny:` **duas vezes** no LAB-90 → **0**.
 *
 * As quatro plantadas juntas: a suíte inteira deu as mesmas 1 361 aprovadas e 9 reprovadas (as do
 * `.wasm`) de antes. *Regra sem guarda*, a primeira espécie da dívida própria.
 *
 * # O que se mediu (16/10/2026), por LUGAR
 *
 * O lugar é o `RECADOS.md` inteiro: todo bloco de código que abre com `=== RECADO PARA O CHAT`.
 * **140 recados**, de 13/09/2026 (LAB-07) a 16/10/2026 (LAB-128). Em **todos** as cinco linhas
 * existem, **uma vez cada**, **na ordem**, e **nenhuma vazia**: 118 respondem *"nada…"* onde não há o
 * que dizer, 6 respondem `—`. **18** têm linhas que não abrem com um dos cinco nomes, e quase todas
 * são de duas formas, ambas válidas:
 *
 * - **14 com continuação recuada** (os recados antigos, do LAB-07 ao LAB-06): a linha longa quebrada
 *   em duas, e a segunda começa com espaço — é a mesma linha, não uma sexta;
 * - **4 com a marca `ACUMULADO — inclui os recados …`** logo depois do cabeçalho.
 *
 * E **uma** linha, num desses dezoito, não é continuação nem marca: no recado do LF-01 (14/09/2026),
 * uma sexta pergunta, `Não saiu como pedido:`. As cinco estão lá, na ordem e com conteúdo; ela é
 * declarado como exceção histórica (`EXCECOES_HISTORICAS`), conferida nos dois sentidos — o registro
 * do que foi enviado não se reescreve. Fora ele, cumprida por disciplina; é a disciplina que esta
 * trava passa a cobrar.
 *
 * # As escolhas, e de onde veio cada uma
 *
 * - **"Nunca some" vale para TODO recado, não só o último.** O teto de doze linhas olha só o último de
 *   propósito (os antigos foram enviados acima do teto, e o registro não se reescreve); aqui há uma
 *   linha só a perdoar em 140, declarada pelo nome, então a régua lê todos e passa a impedir a próxima.
 * - **Na ordem do formato.** O chat lê as cinco linhas na mesma posição em nove casas; trocar a ordem
 *   é o leitor achar a resposta errada no lugar certo.
 * - **Uma vez cada.** Duas linhas `Depende do Jonny:` são duas respostas, e uma delas mente.
 * - **"Sem conteúdo" é o vazio** — nada depois dos dois-pontos e nenhuma continuação. *"nada"*,
 *   *"nenhum"* e `—` são resposta, e passam: a regra proíbe a linha **calada**, não manda a palavra.
 *   Exigir o `—` literal reprovaria 118 recados escritos *"nada"* — a forma que as outras casas usam
 *   (o Generate e a Pesquisa mandam *"nada"* no próprio `CLAUDE.md`) — por uma diferença de grafia,
 *   não de conteúdo.
 * - **A linha recuada continua a anterior**, e conta como conteúdo dela; a marca `ACUMULADO` só vale
 *   **logo depois do cabeçalho**. Qualquer outra linha é *solta* — uma sexta pergunta que o formato
 *   não tem, ou um nome de campo escrito errado (`Achados:`), que de outro modo passaria como texto.
 * - **Os nomes das cinco linhas vêm do `CLAUDE.md`**, conferidos no teste contra o bloco do formato:
 *   mudou o formato, a régua avisa em vez de cobrar o velho.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se a resposta é verdadeira** — *"Depende do Jonny: nada"* com uma pendência aberta passa;
 * - **o cabeçalho e o `=== FIM ===`** — são do `recado.test.ts`; o nome do `<app>`, do
 *   `nome-do-aplicativo.test.ts`; o teto de doze linhas, do `recado.test.ts`, só no último;
 * - **o recado fora do `RECADOS.md`** — o que foi ao chat não é arquivo.
 */

/** As cinco linhas do formato do `CLAUDE.md` §1, na ordem. */
export const AS_CINCO_LINHAS = [
  "Estado:",
  "Feito:",
  "Achados para outros apps ou Central:",
  "Depende do Jonny:",
  "Próximo na fila:",
] as const;

/** A frase da regra, conferida no teste onde ela mora (o `CLAUDE.md` §1). */
export const A_REGRA = "Linha sem conteúdo leva `—`, nunca some.";

const ABRE_O_RECADO = /^=== RECADO PARA O CHAT\b/;
const FECHA_O_RECADO = "=== FIM ===";
const MARCA_DO_ACUMULADO = /^ACUMULADO — /;
const CONTINUACAO = /^\s+\S/;

export type TipoDeProblemaDasLinhas =
  | "linha-que-falta"
  | "linha-repetida"
  | "linha-fora-de-ordem"
  | "linha-vazia"
  | "linha-solta"
  | "recado-sem-fim";

export interface ProblemaDasLinhas {
  /** A linha do arquivo, contando de 1. */
  linha: number;
  tipo: TipoDeProblemaDasLinhas;
  detalhe: string;
}

export interface RecadoLido {
  /** A linha do cabeçalho, contando de 1. */
  linha: number;
  cabecalho: string;
  /** O corpo, sem o cabeçalho e sem o `=== FIM ===`. */
  corpo: string[];
  fechado: boolean;
}

/** Todo recado do texto: o bloco de código que abre com `=== RECADO PARA O CHAT`, até o `=== FIM ===`. */
export function lerOsRecados(texto: string): RecadoLido[] {
  const linhas = texto.split("\n");
  const recados: RecadoLido[] = [];
  let noBloco = false;
  let atual: RecadoLido | null = null;
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i]!;
    if (l.startsWith("```")) {
      noBloco = !noBloco;
      if (atual !== null) {
        recados.push(atual);
        atual = null;
      }
      continue;
    }
    if (!noBloco) continue;
    if (atual === null) {
      if (ABRE_O_RECADO.test(l)) atual = { linha: i + 1, cabecalho: l, corpo: [], fechado: false };
      continue;
    }
    if (l === FECHA_O_RECADO) {
      atual.fechado = true;
      recados.push(atual);
      atual = null;
      continue;
    }
    atual.corpo.push(l);
  }
  if (atual !== null) recados.push(atual);
  return recados;
}

/** Confere as cinco linhas de UM recado. */
export function conferirUmRecado(r: RecadoLido): ProblemaDasLinhas[] {
  const problemas: ProblemaDasLinhas[] = [];
  const curto = r.cabecalho.slice(0, 90);
  if (!r.fechado) problemas.push({ linha: r.linha, tipo: "recado-sem-fim", detalhe: `sem ${FECHA_O_RECADO}: ${curto}` });

  /** Para cada uma das cinco: onde aparece (índice no corpo), e se tem conteúdo. */
  const achadas: { campo: number; indice: number; conteudo: boolean }[] = [];
  for (let j = 0; j < r.corpo.length; j++) {
    const l = r.corpo[j]!;
    const campo = AS_CINCO_LINHAS.findIndex((c) => l.startsWith(c));
    if (campo >= 0) {
      achadas.push({ campo, indice: j, conteudo: l.slice(AS_CINCO_LINHAS[campo]!.length).trim() !== "" });
      continue;
    }
    if (j === 0 && MARCA_DO_ACUMULADO.test(l)) continue;
    if (CONTINUACAO.test(l) && achadas.length > 0) {
      achadas.at(-1)!.conteudo = true;
      continue;
    }
    problemas.push({ linha: r.linha + 1 + j, tipo: "linha-solta", detalhe: `não é uma das cinco, nem continuação: ${l.slice(0, 60)} — em ${curto}` });
  }

  AS_CINCO_LINHAS.forEach((nome, campo) => {
    const desta = achadas.filter((a) => a.campo === campo);
    if (desta.length === 0) problemas.push({ linha: r.linha, tipo: "linha-que-falta", detalhe: `falta "${nome}" em ${curto}` });
    if (desta.length > 1) problemas.push({ linha: r.linha + 1 + desta[1]!.indice, tipo: "linha-repetida", detalhe: `"${nome}" ${desta.length} vezes em ${curto}` });
    for (const a of desta) {
      if (!a.conteudo) problemas.push({ linha: r.linha + 1 + a.indice, tipo: "linha-vazia", detalhe: `"${nome}" sem conteúdo — leva —, nunca fica calada: ${curto}` });
    }
  });

  let anterior = -1;
  for (const a of achadas) {
    if (a.campo < anterior) {
      problemas.push({ linha: r.linha + 1 + a.indice, tipo: "linha-fora-de-ordem", detalhe: `"${AS_CINCO_LINHAS[a.campo]}" depois de "${AS_CINCO_LINHAS[anterior]}" em ${curto}` });
    }
    anterior = Math.max(anterior, a.campo);
  }
  return problemas;
}

/**
 * Uma exceção histórica: o recado já enviado que não cumpre, e que o registro não reescreve. Casa por
 * cabeçalho, tipo e o começo da linha acusada — e é conferida nos DOIS sentidos: a exceção que não
 * casa mais com nada também reprova (`excecoesSemUso`), para ela não ficar perdoando o vazio.
 */
export interface ExcecaoHistorica {
  cabecalho: string;
  tipo: TipoDeProblemaDasLinhas;
  /** O começo da linha acusada, no arquivo. */
  inicio: string;
  motivo: string;
}

/**
 * **Uma**, em 140. O recado do LF-01 (14/09/2026), o segundo que existiu, tem uma sexta linha —
 * `Não saiu como pedido:` — entre o `Feito:` e os `Achados…`: o que o prompt pediu e não se
 * conseguiu fazer (apagar uma branch, recusado pelo proxy). As cinco existem, na ordem e com
 * conteúdo; a sexta é uma pergunta que o formato não tem. Foi enviado assim, e o `RECADOS.md` é
 * registro do que foi enviado (o mesmo motivo que deixa o teto de doze linhas olhar só o último).
 * Hoje o que não saiu como pedido vai no `Estado:` ou no `Feito:` — como fazem os 139 outros.
 */
export const EXCECOES_HISTORICAS: readonly ExcecaoHistorica[] = [
  {
    cabecalho: "=== RECADO PARA O CHAT — Lab · LF-01 ===",
    tipo: "linha-solta",
    inicio: "Não saiu como pedido:",
    motivo: "a sexta linha do segundo recado (14/09/2026), enviado assim; o registro não se reescreve",
  },
];

/** Confere as cinco linhas de todos os recados do texto, e publica o universo lido. */
export function conferirAsCincoLinhas(
  texto: string,
  excecoes: readonly ExcecaoHistorica[] = EXCECOES_HISTORICAS,
): {
  recados: number;
  comContinuacao: number;
  comAcumulado: number;
  problemas: ProblemaDasLinhas[];
  /** Os problemas que casaram com uma exceção declarada. */
  perdoados: ProblemaDasLinhas[];
  /** As exceções que não casaram com nenhum problema — perdão a quem já não precisa. */
  excecoesSemUso: ExcecaoHistorica[];
} {
  const linhas = texto.split("\n");
  const recados = lerOsRecados(texto);
  const problemas: ProblemaDasLinhas[] = [];
  const perdoados: ProblemaDasLinhas[] = [];
  const usadas = new Set<ExcecaoHistorica>();
  for (const r of recados) {
    for (const p of conferirUmRecado(r)) {
      const linha = linhas[p.linha - 1] ?? "";
      const e = excecoes.find((x) => x.cabecalho === r.cabecalho && x.tipo === p.tipo && linha.startsWith(x.inicio));
      if (e === undefined) problemas.push(p);
      else {
        perdoados.push(p);
        usadas.add(e);
      }
    }
  }
  return {
    recados: recados.length,
    comContinuacao: recados.filter((r) => r.corpo.some((l) => CONTINUACAO.test(l))).length,
    comAcumulado: recados.filter((r) => r.corpo.length > 0 && MARCA_DO_ACUMULADO.test(r.corpo[0]!)).length,
    problemas,
    perdoados,
    excecoesSemUso: excecoes.filter((e) => !usadas.has(e)),
  };
}
