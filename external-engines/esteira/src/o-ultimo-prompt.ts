/**
 * O CABEÇALHO DO `ONDE_PARAMOS.md` AFIRMA QUAL FOI O ÚLTIMO PROMPT — e nada perguntava. (LAB-126,
 * item 900, a dívida própria, D354)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` manda ler `docs/ONDE_PARAMOS.md` **primeiro** ao acordar, e o §7 manda que todo
 * prompt feche com ele *"em dia"*. A primeira linha dele que não é moldura é o cabeçalho:
 *
 * > `**Última atualização:** 16/10/2026, 07h · **Último prompt executado:** LAB-125 (item 900, …) — …
 * > · antes dele o LAB-124 (item 900, …) — … · antes dele o LAB-123 …`
 *
 * São **três afirmações de estado**, escritas à mão a cada rodada: a data, o último prompt (com o
 * item da caixa) e a corrente *"antes dele o …"*, que diz a ordem dos anteriores. O mesmo estado
 * mora, com forma fixa, em `docs/relatorios/RECADOS.md`: um título `## DD/MM/AAAA · <prompt> — …`
 * por rodada e o cabeçalho do recado `=== RECADO PARA O CHAT — <app> · <prompt> (item NNN) ===`.
 * **Nenhuma trava punha os dois lado a lado** — dezessete módulos leem o `ONDE_PARAMOS.md`, e nenhum
 * lê o cabeçalho. *Mensagem fixa que afirma estado sem perguntar*, a quinta espécie da dívida
 * própria, no arquivo que se lê primeiro.
 *
 * # O que se mediu (16/10/2026), por LUGAR e pela HISTÓRIA
 *
 * Na `main` de hoje as três afirmações batem: LAB-125, item 900, e a corrente de 29 elos (LAB-124 a
 * LAB-96) é exatamente a ordem dos títulos do `RECADOS.md`. Na história (a `main` por
 * `--first-parent`), **151** versões mexeram num dos dois arquivos; em **140** os dois existem e o
 * cabeçalho tem a forma, e a régua sai limpa em **139** — a corrente, presente em 29 delas, nunca
 * saiu de ordem. A exceção é de verdade: **`76bfdcd`** (LAB-67, 09/10/2026, 00h01), o cabeçalho
 * ainda no *"LAB-66"* com o recado do LAB-67 já gravado, e assim ficou **13h20** até o `093f6ae`.
 * Cumprida por disciplina, quebrada uma vez sem que nada acusasse — é a disciplina que esta trava
 * passa a cobrar. (A primeira rodada da régua na história acusou mais duas, e as duas eram dela:
 * o título `LAB-83 (continuação) · decisao-registrada`, cujo recado não repete o item, e o título
 * `LAB-13 e LAB-14`, de 19/09, que fecha dois prompts. Consertadas abaixo.)
 *
 * # As escolhas, e de onde veio cada uma
 *
 * - **O "último prompt" é o último título de prompt do `RECADOS.md`**, pela forma única
 *   ({@link PROMPT_DO_LAB}). Os títulos de classe (`despertador-sem-item`, `decisao-registrada`) não
 *   são prompt executado: num disparo em vazio o cabeçalho continua no último prompt, e é certo —
 *   medido nos três disparos em vazio de 09 e 10/10, o cabeçalho ficou no LAB-77, LAB-78 e LAB-80.
 * - **O item** é o número depois de *"item "* no cabeçalho e no recado desse prompt. Prompt sem item
 *   nos dois (os de antes da caixa) não é cobrado; item num lado e não no outro, é.
 * - **A data** do cabeçalho não pode ser anterior ao título do recado: atualizar depois, sim (o
 *   LAB-95 teve dois despertadores); antes, é afirmar o que ainda não aconteceu.
 * - **A corrente** se confere elo a elo contra a sequência dos títulos de prompt, mais novo primeiro,
 *   **sem repetir** (o LAB-83 e o LAB-95 têm dois títulos cada): cada *"antes dele o X"* tem de ser o
 *   prompt seguinte dessa sequência. A corrente pode parar onde quiser — o cabeçalho escolhe até
 *   onde relata —, mas não pode pular nem trocar a ordem.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **o texto** de cada elo (o que o prompt fez): é relato, e o relato mora no relatório;
 * - **a hora** (*"07h"*): o título do recado não tem hora, e não há o que comparar;
 * - **o *"próximo:"*** de cada elo: é intenção, não estado;
 * - **o corpo** do `ONDE_PARAMOS.md` abaixo do cabeçalho (*"A HISTÓRIA"*, a conta dos disparos) —
 *   a conta tem a trava do LAB-81 (`disparos-do-despertador.ts`);
 * - **se o recado diz a verdade**: a régua confere que as duas páginas dizem a mesma coisa, não que
 *   a coisa aconteceu.
 */
import { PROMPT_DO_LAB } from "./nome-do-prompt.ts";

const DATA = String.raw`(\d{2})/(\d{2})/(\d{4})`;

/** O cabeçalho: a primeira linha com `**Última atualização:**`. */
const CABECALHO = new RegExp(
  String.raw`^\*\*Última atualização:\*\*\s*${DATA}[^\n]*?\*\*Último prompt executado:\*\*\s*(${PROMPT_DO_LAB})`,
  "m",
);

/** `antes dele o LAB-NN` — o elo da corrente. */
const ELO = new RegExp(String.raw`antes dele o (${PROMPT_DO_LAB})\b`, "g");

/** O título de uma rodada no `RECADOS.md`: `## DD/MM/AAAA · <prompt> — …`. */
const TITULO = new RegExp(String.raw`^## ${DATA} · (\S+)`, "gm");

const PROMPT_SO = new RegExp(String.raw`^${PROMPT_DO_LAB}$`);

/** `item NNN` logo depois do prompt: `LAB-125 (item 900` ou `LAB-125 (item 900)`. */
function itemDepois(texto: string, prompt: string): string | null {
  const m = new RegExp(String.raw`\b${prompt} \(item (\d{3,})`).exec(texto);
  return m?.[1] ?? null;
}

const diaDe = (d: string, m: string, a: string): string => `${a}-${m}-${d}`;

export interface Cabecalho {
  /** AAAA-MM-DD, para comparar como texto. */
  data: string;
  prompt: string;
  item: string | null;
  /** Os elos *"antes dele o X"*, na ordem em que aparecem. */
  corrente: string[];
}

/** Lê o cabeçalho do `ONDE_PARAMOS.md`. `null` é *"não achei a forma"* — e isso reprova. */
export function lerOCabecalho(ondeParamos: string): Cabecalho | null {
  const m = CABECALHO.exec(ondeParamos);
  if (!m) return null;
  const [, d, mes, a, prompt] = m;
  const inteira = ondeParamos.slice(m.index).split("\n", 1)[0]!;
  return {
    data: diaDe(d!, mes!, a!),
    prompt: prompt!,
    item: itemDepois(inteira, prompt!),
    corrente: [...inteira.matchAll(ELO)].map((e) => e[1]!),
  };
}

export interface RodadaDoRecado {
  data: string;
  prompt: string;
  /** O item lido no cabeçalho do recado (`· LAB-NN (item NNN`), ou `null`. */
  item: string | null;
}

/**
 * Os títulos de PROMPT do `RECADOS.md`, na ordem do arquivo. Os de classe ficam fora. O item vem do
 * cabeçalho do recado que segue o título, até o próximo título.
 */
export function lerAsRodadas(recados: string): RodadaDoRecado[] {
  const titulos = [...recados.matchAll(TITULO)];
  const rodadas: RodadaDoRecado[] = [];
  titulos.forEach((t, i) => {
    // `LAB-13 e LAB-14` (19/09): um título, dois prompts — o último é o que fechou a rodada.
    const dupla = new RegExp(String.raw`^ e (${PROMPT_DO_LAB})\b`).exec(recados.slice(t.index! + t[0].length));
    const prompt = dupla?.[1] ?? t[4]!;
    if (!PROMPT_SO.test(prompt)) return;
    const fim = titulos[i + 1]?.index ?? recados.length;
    const trecho = recados.slice(t.index!, fim);
    const cab = /^=== RECADO PARA O CHAT[^\n]*$/m.exec(trecho)?.[0] ?? "";
    rodadas.push({ data: diaDe(t[1]!, t[2]!, t[3]!), prompt, item: itemDepois(cab, prompt) });
  });
  return rodadas;
}

export type TipoDeProblemaDoCabecalho =
  | "cabecalho-ilegivel"
  | "recados-sem-prompt"
  | "prompt-diferente"
  | "item-diferente"
  | "data-anterior-ao-recado"
  | "corrente-fora-de-ordem";

export interface ProblemaDoCabecalho {
  tipo: TipoDeProblemaDoCabecalho;
  detalhe: string;
}

/**
 * Confere o cabeçalho do `ONDE_PARAMOS.md` contra o `RECADOS.md`. Devolve também o tamanho do
 * universo lido, para a trava publicá-lo (*"verde em zero"* não é verde).
 */
export function conferirOCabecalho(
  ondeParamos: string,
  recados: string,
): { rodadas: number; elos: number; problemas: ProblemaDoCabecalho[] } {
  const problemas: ProblemaDoCabecalho[] = [];
  const rodadas = lerAsRodadas(recados);
  const cab = lerOCabecalho(ondeParamos);
  if (!cab) {
    problemas.push({ tipo: "cabecalho-ilegivel", detalhe: "sem **Última atualização:** … **Último prompt executado:** LAB-NN" });
    return { rodadas: rodadas.length, elos: 0, problemas };
  }
  const ultima = rodadas.at(-1);
  if (!ultima) {
    problemas.push({ tipo: "recados-sem-prompt", detalhe: "nenhum título de prompt no RECADOS.md" });
    return { rodadas: 0, elos: cab.corrente.length, problemas };
  }
  if (cab.prompt !== ultima.prompt) {
    problemas.push({ tipo: "prompt-diferente", detalhe: `cabeçalho ${cab.prompt} ≠ último recado ${ultima.prompt}` });
  } else {
    // O item e a data se comparam com o PRIMEIRO título deste prompt: a continuação do mesmo
    // prompt (o `LAB-83 (continuação) · decisao-registrada`, de 10/10, cujo recado não repete o
    // item) e o segundo despertador (LAB-95) vêm depois e não mudam o que ele fez.
    const primeira = rodadas.find((r) => r.prompt === ultima.prompt)!;
    if (cab.item !== primeira.item) {
      problemas.push({ tipo: "item-diferente", detalhe: `cabeçalho item ${cab.item} ≠ recado item ${primeira.item}` });
    }
    if (cab.data < primeira.data) {
      problemas.push({ tipo: "data-anterior-ao-recado", detalhe: `cabeçalho ${cab.data} < recado ${primeira.data}` });
    }
  }
  // A sequência sem repetição, mais novo primeiro.
  const sequencia: string[] = [];
  for (const r of [...rodadas].reverse()) if (sequencia.at(-1) !== r.prompt) sequencia.push(r.prompt);
  const inicio = sequencia.indexOf(cab.prompt);
  // Prompt do cabeçalho que o RECADOS.md não tem (o recado ainda não gravado): o problema é UM, e já
  // está dito acima — acusar cada elo repetiria o mesmo defeito trinta vezes.
  if (inicio < 0) return { rodadas: rodadas.length, elos: cab.corrente.length, problemas };
  cab.corrente.forEach((elo, i) => {
    const esperado = sequencia[inicio + 1 + i];
    if (elo !== esperado) {
      problemas.push({ tipo: "corrente-fora-de-ordem", detalhe: `elo ${i + 1}: ${elo} onde o RECADOS.md diz ${esperado ?? "nada"}` });
    }
  });
  return { rodadas: rodadas.length, elos: cab.corrente.length, problemas };
}
