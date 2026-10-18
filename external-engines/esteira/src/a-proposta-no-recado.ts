/**
 * A IDEIA QUE NÃO CABIA NO ITEM VAI À `FILA.md`, E O RECADO A CITA NUMA LINHA — e só a primeira metade tinha
 * trava. (LAB-164, item 900, a dívida própria, D392)
 *
 * # A regra, e o que estava sem guarda
 *
 * O protocolo da caixa (`docs/caixa-de-entrada/COMO_FUNCIONA.md`, seção *"A RESPOSTA INTEIRA VAI PARA O ARQUIVO"*,
 * escrita pelo chat em 09/10/2026, commit `b0b537b`), na lista das três coisas que costumam ficar só na tela:
 *
 * > *"2. **A ideia que não cabia no item.** Vai para a `FILA.md` como "proposto ao chat", e o recado a cita numa
 * > linha."*
 *
 * A trava do LAB-61 (`varredura-das-propostas.ts`) cobra a LISTA da `FILA.md` — riscado com executor, aberto com
 * motivo, cópia, seção de prosa citada pela lista. **Ninguém perguntava se o recado do prompt que propôs a cita** — e
 * o recado é o que o chat lê primeiro; proposta que só mora na `FILA.md`, no meio de três mil linhas, é proposta que o
 * chat acha por sorte. Medido por mutação (18/10/2026), a suíte inteira da esteira com três mudanças plantadas no
 * `RECADOS.md`: tirar *"(1) Proposto ao chat (FILA, abaixo do LAB-159): …"* do recado do LAB-159, o *"Proposto ao
 * chat"* do LAB-123 e o *"Está na FILA como proposta"* do LAB-80 → **zero** falhas novas. *Regra sem guarda*, a
 * primeira espécie da dívida própria.
 *
 * # O que se mediu, por LUGAR
 *
 * O lugar é toda proposta da `FILA.md` que diz de que prompt saiu, nas TRÊS formas que a página usa — e cada forma
 * foi achada lendo a página, não procurando uma frase:
 *
 * 1. **`Proposto ao chat, saído do LAB-NNN`** — título de seção ou parágrafo em negrito; também *"saído do item NNN"*,
 *    e o item se traduz no prompt pela marca de FEITO do topo do arquivo dele (`> # ✅ FEITO — dd/mm/aaaa, LAB-NN`);
 * 2. **`**Proposto (minha lista …)**`** debaixo da seção `### LAB-NNN · …` — a origem é o prompt da seção;
 * 3. **o item da lista `## Proposto ao chat — não executar`** com a origem entre parênteses (`(LAB-NN, …`), a forma
 *    que a trava do LAB-61 já lê ({@link citaAOrigem}).
 *
 * Do **LAB-70** em diante (o primeiro prompt depois do commit da regra; o LAB-68 e o LAB-69 são do mesmo dia e de
 * antes dele — o mesmo corte do LAB-130), **30 prompts** propuseram, e **todos** os recados citam a proposta:
 *
 * - do **LAB-123** em diante, na forma *"Proposto ao chat"* — nove de nove;
 * - **antes**, em vinte e uma formas soltas (*"PROPOSTO na FILA"*, *"Está na FILA como proposta"*, *"e a nova do
 *   LAB-108"*, *"PRECISO DE UMA LINHA SUA, E É UM DESEMPATE"*…). Cada uma é exceção declarada em
 *   {@link FORMAS_ANTIGAS}, com o **trecho** que cita — conferido no recado, e conferido que a forma de hoje não está lá
 *   (senão sobra perdão). Regra verdadeira, guarda ausente.
 *
 * # Como ela cobra
 *
 * 1. **toda proposta do alcance tem recado** do prompt que a fez → senão `proposta-sem-recado`;
 * 2. **o recado cita**: a forma {@link A_FORMA}, ou o trecho declarado da exceção → senão `recado-nao-cita`;
 * 3. **e o sentido de volta**: recado do alcance que diz {@link A_FORMA} tem proposta na `FILA.md` daquele prompt →
 *    senão `recado-cita-o-que-a-fila-nao-tem` (a proposta que ficou só na tela);
 * 4. **"saído do item NNN"** sem marca de FEITO que diga o prompt → `item-sem-prompt` (a régua não adivinha);
 *    **"minha lista"** fora de uma seção `### LAB-NNN` → `proposta-sem-origem`;
 * 5. **a exceção se confere nos dois sentidos**: o prompt está no alcance e antes da forma, o trecho está no recado, e
 *    a forma de hoje não → senão `excecao-que-sobra` ou `excecao-sem-o-trecho`;
 * 6. **nenhuma proposta no alcance** → `universo-vazio` (D213).
 *
 * # O que ela acusa a mais, e é o lado seguro
 *
 * O recado que **menciona** a forma sem propor nada é acusado no sentido de volta — o primeiro rascunho do recado do
 * LAB-164, que descrevia esta régua citando a forma entre aspas, foi. Escreve-se a frase de outro jeito; a régua lê a
 * forma pela letra, e prefere acusar a mais a deixar passar.
 *
 * # O que ela NÃO alcança — dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */
import { lerOsRecados } from "./as-cinco-linhas-do-recado.ts";
import { PROMPT_DO_LAB } from "./nome-do-prompt.ts";
import { citaAOrigem } from "./varredura-das-propostas.ts";

/** A frase do protocolo que esta régua responde, conferida no `COMO_FUNCIONA.md` por `aRegraEstaEscrita`. */
export const A_REGRA = 'Vai para a `FILA.md` como *"proposto ao chat"*, e o recado a cita numa linha.';

/**
 * O primeiro prompt depois do commit da regra (`b0b537b`, 09/10/2026 às 13h42 -0300). O LAB-68 e o LAB-69 são do mesmo
 * dia e de ANTES dele — o mesmo corte que o LAB-130 mediu (`onde-esta-o-detalhe.ts`, `ANTES_DO_COMMIT`). Em número de
 * prompt, e não em data, porque a origem de uma proposta na `FILA.md` é um prompt, não um dia.
 */
export const PRIMEIRO_PROMPT_DA_REGRA = 70;

/**
 * A forma que o recado usa para citar a proposta desde o LAB-123 — nove de nove. **Com caixa, e é de propósito:** a
 * primeira versão lia sem caixa e acusou seis recados (LAB-153 a LAB-158) que dizem *"Nada novo proposto ao chat"* — a
 * NEGAÇÃO, escrita em minúscula no meio da frase. A citação abre a frase (*"(1) Proposto ao chat (FILA): …"*).
 */
export const A_FORMA = /\bProposto ao chat\b/;

/** O primeiro prompt que citou na forma de hoje; antes dele, cada recado é uma exceção nomeada. */
export const FORMA_DESDE = 123;

export interface FormaAntiga {
  prompt: string;
  /** O trecho do recado que cita a proposta — copiado do `RECADOS.md`, conferido lá. */
  trecho: string;
}

/**
 * **Vinte e uma**, as citações de antes da forma de hoje — cada uma com o trecho que cita a proposta, tirado do
 * recado gravado. Não são perdão de falta: são a regra cumprida numa forma que a régua não sabe ler sozinha. O
 * `RECADOS.md` é registro do que foi enviado, e não se reescreve.
 */
export const FORMAS_ANTIGAS: readonly FormaAntiga[] = [
  { prompt: "LAB-71", trecho: "PRECISO DE UMA LINHA SUA, E É UM DESEMPATE" },
  { prompt: "LAB-74", trecho: "está na FILA como proposta" },
  { prompt: "LAB-78", trecho: "O conserto está PROPOSTO na FILA.md" },
  { prompt: "LAB-80", trecho: "Está na FILA como proposta" },
  { prompt: "LAB-82", trecho: "Proposto na FILA, não consertado" },
  { prompt: "LAB-83", trecho: "Foi para a FILA como proposta" },
  { prompt: "LAB-86", trecho: "uma entrou, a das outras dez provas recontáveis" },
  { prompt: "LAB-96", trecho: "Três propostas novas na FILA" },
  { prompt: "LAB-99", trecho: "proposto na minha lista" },
  { prompt: "LAB-103", trecho: "há três propostas novas na FILA" },
  { prompt: "LAB-104", trecho: "e uma nova (a mesma pergunta para o número da decisão)" },
  { prompt: "LAB-105", trecho: "e a nova (a ordem da entrega como trava)" },
  { prompt: "LAB-106", trecho: "o conserto é meu, proposto na FILA" },
  { prompt: "LAB-108", trecho: "e a nova do LAB-108" },
  { prompt: "LAB-109", trecho: "e a nova do LAB-109" },
  { prompt: "LAB-110", trecho: "e a nova do LAB-110" },
  { prompt: "LAB-112", trecho: "na FILA segue a nova do LAB-112" },
  { prompt: "LAB-113", trecho: "na FILA segue a nova do LAB-113" },
  { prompt: "LAB-115", trecho: "proposto na FILA pôr a receita no passo 0" },
  { prompt: "LAB-117", trecho: "está proposta na FILA" },
  { prompt: "LAB-118", trecho: "a proposta nova do LAB-118" },
];

/** O que esta régua NÃO alcança — publicado na saída, para o silêncio não parecer cobertura. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "proposta escrita na FILA.md sem dizer de que prompt saiu: um item da lista só com data (`(09/10, D226)`) é " +
    "contado em `semOrigem`, não cobrado — os dezessete de hoje citam decisão até a D226, de antes das do item 002 " +
    "(LAB-69, D229), e portanto de antes da regra",
  "proposta que ficou SÓ NA TELA e cujo recado não usa a forma de hoje: o sentido de volta lê só \"Proposto ao chat\"",
  "se o recado cita ESTA proposta e não outra: \"Proposto ao chat\" num recado com duas propostas na FILA.md conta " +
    "para as duas — a régua cobra a citação, não o assunto",
  "se a proposta é boa, se espera alguém ou se já foi feita: isso é a trava do LAB-61 (`varredura-das-propostas.ts`)",
  "o recado das classes sem prompt `LAB-NNN` (`despertador-sem-item`…): não propõem por protocolo",
];

export interface PropostaDaFila {
  /** A linha da `FILA.md`, contando de 1. */
  linha: number;
  prompt: string;
  forma: "saido-do" | "minha-lista" | "item-da-lista";
}

export type TipoDeProblemaDaProposta =
  | "proposta-sem-recado"
  | "recado-nao-cita"
  | "recado-cita-o-que-a-fila-nao-tem"
  | "item-sem-prompt"
  | "proposta-sem-origem"
  | "excecao-que-sobra"
  | "excecao-sem-o-trecho"
  | "universo-vazio";

export interface ProblemaDaProposta {
  tipo: TipoDeProblemaDaProposta;
  prompt: string | null;
  detalhe: string;
}

const UM_PROMPT = new RegExp(`^${PROMPT_DO_LAB}$`);
const numero = (prompt: string): number => Number(prompt.slice(4));

/**
 * O prompt que fechou um item da caixa, pela marca do topo do arquivo `NNN-FEITO.md` (o passo 4 do protocolo, cobrado
 * pelo LAB-123). A marca tem quatro escritas na história — `> # ✅ FEITO — 09/10/2026, LAB-74`, `> ✅ **FEITO no
 * LAB-76**, …`, `> ## ✅ FEITO — **LAB-93**, …` e `> ## ✅ FEITO EM 12/10/2026 — … · LAB-96 · …` —, e a régua lê o
 * primeiro prompt depois do ✅ e da palavra FEITO. `null` se a primeira linha não for a marca (o `015`, renumerado por
 * colisão, abre com ⚠️).
 */
export function oPromptDoItem(primeiraLinha: string): string | null {
  const m = new RegExp(`✅[^\\n]*?\\bFEITO\\b[^\\n]*?\\b(${PROMPT_DO_LAB})\\b`).exec(primeiraLinha);
  return m === null ? null : m[1]!;
}

/**
 * As propostas da `FILA.md` que dizem de que prompt saíram, nas três formas. `itemParaPrompt` traduz o número do item
 * da caixa (`"007"`) no prompt que o fechou; quem chama decide de onde ler.
 */
export function lerAsPropostasDaFila(
  fila: string,
  itemParaPrompt: ReadonlyMap<string, string>,
): { propostas: PropostaDaFila[]; semOrigem: number; problemas: ProblemaDaProposta[] } {
  const linhas = fila.split("\n");
  const propostas: PropostaDaFila[] = [];
  const problemas: ProblemaDaProposta[] = [];
  let semOrigem = 0;
  let secao: string | null = null;
  let naLista = false;
  const saido = new RegExp(`Proposto ao chat, saído do (?:item (\\d{3,})(?!\\d)(?: \\((${PROMPT_DO_LAB})\\))?|(${PROMPT_DO_LAB})\\b)`, "g");
  for (const [i, l] of linhas.entries()) {
    const linha = i + 1;
    if (/^#{1,4} /.test(l)) {
      naLista = l.startsWith("## Proposto ao chat — não executar");
      const m = new RegExp(`^#{2,4} (?:~~)?(${PROMPT_DO_LAB})\\b`).exec(l);
      secao = m === null ? null : m[1]!;
    }
    for (const m of l.matchAll(saido)) {
      const prompt = m[3] ?? m[2] ?? itemParaPrompt.get(m[1]!) ?? null;
      if (prompt === null) {
        problemas.push({ tipo: "item-sem-prompt", prompt: null, detalhe: `linha ${linha}: "saído do item ${m[1]}" e nenhuma marca de FEITO diz o prompt` });
      } else propostas.push({ linha, prompt, forma: "saido-do" });
    }
    if (/\*\*Proposto \(minha lista/.test(l)) {
      if (secao === null) {
        problemas.push({ tipo: "proposta-sem-origem", prompt: null, detalhe: `linha ${linha}: "minha lista" fora de uma seção ### LAB-NNN` });
      } else propostas.push({ linha, prompt: secao, forma: "minha-lista" });
    }
    if (naLista && l.startsWith("- ")) {
      const m = new RegExp(`\\((${PROMPT_DO_LAB})\\b`).exec(l);
      if (m !== null && citaAOrigem(l, m[1]!)) propostas.push({ linha, prompt: m[1]!, forma: "item-da-lista" });
      else semOrigem++;
    }
  }
  return { propostas, semOrigem, problemas };
}

/** O corpo de todos os recados cujo cabeçalho nomeia o prompt, juntos. */
export function osRecadosPorPrompt(recados: string): Map<string, string> {
  const por = new Map<string, string>();
  for (const r of lerOsRecados(recados)) {
    const campo = r.cabecalho.split(" · ").slice(1).join(" · ");
    for (const p of new Set(campo.match(new RegExp(`\\b${PROMPT_DO_LAB}\\b`, "g")) ?? [])) {
      por.set(p, [por.get(p) ?? "", ...r.corpo].join("\n"));
    }
  }
  return por;
}

export interface ConferenciaDaProposta {
  universo: {
    propostasNaFila: number;
    semOrigem: number;
    antesDaRegra: number;
    promptsNoAlcance: number;
    naFormaDeHoje: number;
    naFormaAntiga: number;
    recadosComAForma: number;
  };
  problemas: ProblemaDaProposta[];
}

export function conferirAPropostaNoRecado(
  fila: string,
  recados: string,
  itemParaPrompt: ReadonlyMap<string, string>,
  formasAntigas: readonly FormaAntiga[] = FORMAS_ANTIGAS,
): ConferenciaDaProposta {
  const lidas = lerAsPropostasDaFila(fila, itemParaPrompt);
  const problemas = [...lidas.problemas];
  const porPrompt = osRecadosPorPrompt(recados);
  const noAlcance = new Set(lidas.propostas.filter((p) => numero(p.prompt) >= PRIMEIRO_PROMPT_DA_REGRA).map((p) => p.prompt));
  const antesDaRegra = new Set(lidas.propostas.filter((p) => numero(p.prompt) < PRIMEIRO_PROMPT_DA_REGRA).map((p) => p.prompt)).size;
  let naFormaDeHoje = 0;
  let naFormaAntiga = 0;

  for (const prompt of [...noAlcance].sort((a, b) => numero(a) - numero(b))) {
    const corpo = porPrompt.get(prompt);
    if (corpo === undefined) {
      problemas.push({ tipo: "proposta-sem-recado", prompt, detalhe: `a FILA.md tem proposta saída do ${prompt} e o RECADOS.md não tem recado dele` });
      continue;
    }
    if (A_FORMA.test(corpo)) {
      naFormaDeHoje++;
      continue;
    }
    const antiga = formasAntigas.find((f) => f.prompt === prompt);
    if (antiga !== undefined && corpo.includes(antiga.trecho)) {
      naFormaAntiga++;
      continue;
    }
    if (antiga === undefined) {
      problemas.push({ tipo: "recado-nao-cita", prompt, detalhe: `o recado do ${prompt} não cita a proposta que ele deixou na FILA.md (falta "Proposto ao chat")` });
    }
  }

  let recadosComAForma = 0;
  for (const [prompt, corpo] of porPrompt) {
    if (!UM_PROMPT.test(prompt) || numero(prompt) < PRIMEIRO_PROMPT_DA_REGRA || !A_FORMA.test(corpo)) continue;
    recadosComAForma++;
    if (!noAlcance.has(prompt)) {
      problemas.push({ tipo: "recado-cita-o-que-a-fila-nao-tem", prompt, detalhe: `o recado do ${prompt} diz "Proposto ao chat" e a FILA.md não tem proposta saída dele` });
    }
  }

  for (const f of formasAntigas) {
    const corpo = porPrompt.get(f.prompt);
    if (!noAlcance.has(f.prompt) || numero(f.prompt) >= FORMA_DESDE) {
      problemas.push({ tipo: "excecao-que-sobra", prompt: f.prompt, detalhe: `${f.prompt} não é proposta do alcance de antes do LAB-${FORMA_DESDE}` });
    } else if (corpo !== undefined && A_FORMA.test(corpo)) {
      problemas.push({ tipo: "excecao-que-sobra", prompt: f.prompt, detalhe: `o recado do ${f.prompt} já cita na forma de hoje: a exceção sobra` });
    } else if (corpo === undefined || !corpo.includes(f.trecho)) {
      problemas.push({ tipo: "excecao-sem-o-trecho", prompt: f.prompt, detalhe: `o trecho "${f.trecho}" não está no recado do ${f.prompt}` });
    }
  }

  if (noAlcance.size === 0) {
    problemas.push({ tipo: "universo-vazio", prompt: null, detalhe: `nenhuma proposta da FILA.md saída de um prompt do LAB-${PRIMEIRO_PROMPT_DA_REGRA} em diante` });
  }

  return {
    universo: {
      propostasNaFila: lidas.propostas.length,
      semOrigem: lidas.semOrigem,
      antesDaRegra,
      promptsNoAlcance: noAlcance.size,
      naFormaDeHoje,
      naFormaAntiga,
      recadosComAForma,
    },
    problemas,
  };
}
