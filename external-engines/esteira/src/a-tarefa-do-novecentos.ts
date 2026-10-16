/**
 * O RECADO DE UMA RODADA DO `900` DIZ QUAL TAREFA E DE QUAL LISTA — e nada perguntava. (LAB-127,
 * item 900, a dívida própria, D355)
 *
 * # A regra, e o que estava sem guarda
 *
 * O item permanente `docs/caixa-de-entrada/900.md` termina assim:
 *
 * > *"No recado, diga **qual tarefa da sua lista** você pegou, e **de qual arquivo**."*
 *
 * E a lista dele diz quais são as listas: *"a `FILA.md`, as `DIVIDAS.md`, o `QUADRO_DE_TAREFAS.md`
 * ou a fila de dívida própria"*. Nesta casa existem duas: a **FILA** (as propostas que um prompt
 * deixa *"proposto ao chat"*) e a **dívida própria** (as cinco espécies da regra 16 da Central:
 * regra sem guarda, teste que nunca reprovou, número digitado à mão, prova que só registra
 * aparência, mensagem fixa que afirma estado sem perguntar). Vinte e nove rodadas do `900` gravaram
 * recado (LAB-97 a LAB-126, menos o LAB-113, que foi do item 030), e **nenhuma trava lia o que elas
 * diziam sobre a própria origem** — cumprida por disciplina. *Regra sem guarda*, a primeira espécie.
 *
 * # O que se mediu (16/10/2026), por LUGAR
 *
 * O lugar é a linha `Estado:` do recado (onde todas as 29 dizem de onde veio a tarefa) e o bloco do
 * recado inteiro (onde a espécie às vezes só aparece no `Feito:`):
 *
 * - **14** dizem *"peguei … a proposta … do LAB-NN"* e nomeiam a FILA — a tarefa é a proposta, a
 *   lista é a FILA;
 * - **15** dizem *"fui à dívida própria"* — a lista; e **14** delas nomeiam ao menos uma das cinco
 *   espécies em algum lugar do recado — a tarefa;
 * - **uma não nomeia espécie nenhuma: o LAB-118** (*"fui à dívida própria, no docs/INDEX.md"*). O
 *   relatório dele nomeia três (linha *"as espécies"*). É a exceção de verdade, e fica declarada em
 *   {@link EXCECOES} com a reconstrução e a fonte — um recado gravado não se reescreve.
 *
 * # As escolhas
 *
 * - **A origem se lê no `Estado:`**, pelas duas formas que a história usa: *"peguei"* + *"proposta"*
 *   + o prompt que a deixou, ou *"fui à dívida própria"*. As duas juntas reprovam (é a lista que o
 *   recado não decidiu), nenhuma reprova. A frase *"a FILA sem proposta que não espere ninguém"*
 *   **não** é origem FILA — é o motivo de ter ido à dívida, e por isso a forma exige *"peguei"*.
 * - **A proposta tem de ser de um prompt ANTERIOR, com relatório**: citar o próprio número, um
 *   número do futuro ou um prompt que não deixou relatório não diz de onde veio nada.
 * - **A espécie se lê no recado inteiro**, sem acento e sem caixa: o LAB-98 a LAB-103 a disseram no
 *   `Feito:`, e o `Estado:` não é o único lugar onde se diz o que se fez.
 * - **A exceção é declarada e se confere nos dois sentidos**: a exceção tem de continuar falhando
 *   (senão sobra) e o relatório que a reconstrói tem de nomear a espécie declarada.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se a escolha foi certa** (*"a mais importante; em empate, a mais velha"*): é juízo, e o recado
 *   o justifica em palavras;
 * - **se a FILA realmente tinha a proposta** — as propostas mudam de texto ao serem executadas
 *   (riscadas, marcadas), e o lugar delas varia (seção própria, fim de entrada, relatório); a régua
 *   cobra o relatório do prompt que a deixou, não o texto da proposta;
 * - **o `<app>`, o formato e as doze linhas**: têm as travas deles (`recado.test.ts`, LAB-117);
 * - **recado de classe** (`despertador-sem-item`): não pegou tarefa, não tem o que dizer.
 */
import { PROMPT_DO_LAB } from "./nome-do-prompt.ts";

/** A frase do `900.md` que esta trava cobra — conferida no arquivo, para a trava saber de onde vem. */
export const A_REGRA_DO_900 = "No recado, diga qual tarefa da sua lista você pegou, e de qual arquivo.";

/** As cinco espécies, sem acento e sem caixa, como a régua as procura. */
export const ESPECIES = [
  "regra sem guarda",
  "teste que nunca reprovou",
  "numero digitado a mao",
  "prova que so registra aparencia",
  "mensagem fixa que afirma estado",
] as const;

export type Especie = (typeof ESPECIES)[number];

/**
 * As exceções declaradas: recado já gravado que não diz a espécie, com a reconstrução tirada do
 * relatório do mesmo prompt. Etiquetada como reconstrução; não se obedece, confere-se.
 */
export const EXCECOES: Record<string, { especies: Especie[]; fonte: string }> = {
  "LAB-118": {
    especies: ["regra sem guarda", "numero digitado a mao", "mensagem fixa que afirma estado"],
    fonte: "docs/relatorios/LAB-118.md, linha *\"as espécies\"* da tabela da §1",
  },
};

/** Sem acento, sem caixa, sem negrito e sem crase de código. */
export function semAcento(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[*`]/g, "")
    .toLowerCase();
}

const CABECALHO = new RegExp(String.raw`^=== RECADO PARA O CHAT — [^\n]*?· (${PROMPT_DO_LAB}) \(item 900\b[^\n]*$`, "gm");
const PEGUEI_PROPOSTA = new RegExp(String.raw`peguei[^.;]*?\bproposta\b[^.;]*?\b(${PROMPT_DO_LAB})\b`);
const FUI_A_DIVIDA = /fui a divida propria/;

export interface RecadoDoNovecentos {
  prompt: string;
  /** A linha `Estado:` (vazia se não houver). */
  estado: string;
  /** O bloco do cabeçalho até o `=== FIM ===`. */
  bloco: string;
}

/** Os recados cujo cabeçalho diz `(item 900`, na ordem do arquivo. */
export function lerOsRecadosDoNovecentos(recados: string): RecadoDoNovecentos[] {
  return [...recados.matchAll(CABECALHO)].map((m) => {
    const resto = recados.slice(m.index!);
    const fim = resto.indexOf("\n=== FIM ===");
    const bloco = fim < 0 ? resto : resto.slice(0, fim);
    const estado = /^Estado: (.*)$/m.exec(bloco)?.[1] ?? "";
    return { prompt: m[1]!, estado, bloco };
  });
}

export type Origem = { lista: "fila"; proposta: string } | { lista: "divida"; especies: Especie[] };

export type TipoDeProblemaDaTarefa =
  | "origem-nao-dita"
  | "origem-dupla"
  | "fila-nao-nomeada"
  | "proposta-nao-anterior"
  | "proposta-sem-relatorio"
  | "especie-nao-dita"
  | "excecao-que-sobra"
  | "excecao-sem-fonte";

export interface ProblemaDaTarefa {
  prompt: string;
  tipo: TipoDeProblemaDaTarefa;
  detalhe: string;
}

const numero = (p: string): number => Number(p.slice(4));

/** O que o recado diz da origem; `null` se não diz, ou diz duas. */
export function lerAOrigem(r: RecadoDoNovecentos): { origem: Origem | null; dupla: boolean } {
  const est = semAcento(r.estado);
  const fila = PEGUEI_PROPOSTA.exec(semAcento(r.estado).replace(/lab-/g, "LAB-"));
  const divida = FUI_A_DIVIDA.test(est);
  if (fila && divida) return { origem: null, dupla: true };
  if (fila) return { origem: { lista: "fila", proposta: fila[1]! }, dupla: false };
  if (divida) {
    const b = semAcento(r.bloco);
    return { origem: { lista: "divida", especies: ESPECIES.filter((e) => b.includes(e)) }, dupla: false };
  }
  return { origem: null, dupla: false };
}

/**
 * Confere os recados do `900`. `temRelatorio(prompt)` diz se `docs/relatorios/<prompt>.md` existe, e
 * `relatorio(prompt)` devolve o texto dele — os dois vêm de fora para a régua ser pura.
 */
export function conferirATarefaDoNovecentos(
  recados: string,
  relatorio: (prompt: string) => string | null,
  excecoes: Record<string, { especies: Especie[]; fonte: string }> = EXCECOES,
): { recados: number; fila: number; divida: number; problemas: ProblemaDaTarefa[] } {
  const lidos = lerOsRecadosDoNovecentos(recados);
  const problemas: ProblemaDaTarefa[] = [];
  let fila = 0;
  let divida = 0;
  const vistos = new Set<string>();
  for (const r of lidos) {
    vistos.add(r.prompt);
    const { origem, dupla } = lerAOrigem(r);
    if (dupla) {
      problemas.push({ prompt: r.prompt, tipo: "origem-dupla", detalhe: "o Estado diz as duas listas" });
      continue;
    }
    if (!origem) {
      problemas.push({ prompt: r.prompt, tipo: "origem-nao-dita", detalhe: "nem \"peguei a proposta do LAB-NN\" nem \"fui à dívida própria\" no Estado" });
      continue;
    }
    if (origem.lista === "fila") {
      fila++;
      if (!/\bfila\b/i.test(r.estado)) {
        problemas.push({ prompt: r.prompt, tipo: "fila-nao-nomeada", detalhe: `a proposta do ${origem.proposta} sem dizer de qual arquivo` });
      }
      if (numero(origem.proposta) >= numero(r.prompt)) {
        problemas.push({ prompt: r.prompt, tipo: "proposta-nao-anterior", detalhe: `proposta do ${origem.proposta} num recado do ${r.prompt}` });
      } else if (relatorio(origem.proposta) === null) {
        problemas.push({ prompt: r.prompt, tipo: "proposta-sem-relatorio", detalhe: `docs/relatorios/${origem.proposta}.md não existe` });
      }
      continue;
    }
    divida++;
    const exc = excecoes[r.prompt];
    if (origem.especies.length === 0) {
      if (!exc) {
        problemas.push({ prompt: r.prompt, tipo: "especie-nao-dita", detalhe: "foi à dívida própria e não diz qual das cinco espécies" });
        continue;
      }
      // Relatório que não existe não é "relatório vazio": as espécies faltam TODAS, e é a mesma falha.
      const texto = relatorio(r.prompt);
      const rel = texto === null ? null : semAcento(texto);
      const faltam = exc.especies.filter((e) => rel === null || !rel.includes(e));
      if (exc.especies.length === 0 || faltam.length > 0) {
        problemas.push({ prompt: r.prompt, tipo: "excecao-sem-fonte", detalhe: `o relatório não nomeia: ${faltam.join(", ") || "(nenhuma espécie declarada)"}` });
      }
    } else if (exc) {
      problemas.push({ prompt: r.prompt, tipo: "excecao-que-sobra", detalhe: "o recado já diz a espécie; a exceção não é mais necessária" });
    }
  }
  for (const p of Object.keys(excecoes)) {
    if (!vistos.has(p)) problemas.push({ prompt: p, tipo: "excecao-que-sobra", detalhe: "exceção de um prompt sem recado do 900" });
  }
  return { recados: lidos.length, fila, divida, problemas };
}
