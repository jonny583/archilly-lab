/**
 * A MARCA DE FEITO NO TOPO DO ITEM — o passo 4 do protocolo, que nunca teve guarda. (LAB-123, item
 * 900, a dívida própria, D351)
 *
 * # A regra, e o defeito medido em 16/10/2026
 *
 * O `docs/caixa-de-entrada/COMO_FUNCIONA.md`, passo 4, manda: *"No fim do item, renomeie o arquivo
 * para `001-FEITO.md` e escreva no topo dele o que foi feito, com arquivo e linha."* O nome tem
 * guarda desde o LAB-80 (`lerNomeDoItem`, o estado mora no sufixo); **o topo não tinha nenhuma** —
 * nenhum `.ts` abria um `-FEITO.md` para ver se ele diz onde o trabalho ficou.
 *
 * Enumerados por LUGAR os **34** `-FEITO.md` da caixa na `main` de 16/10/2026:
 *
 * - **29** abrem com um bloco de citação (`>`) que diz `FEITO`, o prompt (`LAB-NN`) e um arquivo;
 * - **5 não têm marca nenhuma** — `009`, `010`, `010-adendo`, `011` e `012`, os quatro disparos
 *   seguidos de 10/10/2026, 00h58 a 05h22 (LAB-76 a LAB-79). Neles o arquivo foi só renomeado, e
 *   quem abre o item lê o pedido do chat **sem saber se, onde e por quem ele foi feito**: a resposta
 *   mora na tabela da `FILA.md` e no `git log`, e o protocolo manda que ela more no item.
 *
 * Cumprida por disciplina de 001 a 008 e de 013 em diante; quebrada numa madrugada, sem que nada
 * acusasse. *Regra sem guarda* — a primeira espécie da dívida própria.
 *
 * # O que a marca precisa ter, e de onde veio cada exigência
 *
 * O **topo** é o bloco de citação com que o arquivo começa: as linhas iniciais que começam por `>`.
 * É a forma que as 29 marcas têm (inclusive a do `015`, que abre pelo aviso de renumeração e diz o
 * `FEITO` na terceira linha do mesmo bloco) — e é a forma que separa a nota da sessão do texto do
 * chat, que fica intocado abaixo. Nele, as três coisas:
 *
 * 1. a palavra **`FEITO`**, em maiúsculas, como no nome do arquivo;
 * 2. o **prompt** que fez, pela forma única ({@link PROMPT_DO_LAB}, `LAB-\d{2,}`);
 * 3. o **relatório** desse prompt, `relatorios/<prompt>.md`, que **existe** — quem confere é a
 *    trava, contra o disco. Exigir o relatório, e não *"um arquivo qualquer"*, é o que impede uma
 *    marca de citar o prompt certo e apontar para nada.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **a "linha"** de *"com arquivo e linha"*: das 29 marcas escritas no dia, só **7** citam linha
 *   de arquivo (`001`, `002`, `003`, `024`, `024-adendo`, `026` e `030` — lido no topo como
 *   `.md`/`.ts`/`.json` seguido de `:N`, `#LN` ou *"linha"*). Cobrá-la reprovaria 22 marcas escritas
 *   de boa-fé, e reescrevê-las seria reconstrução de relato. A pergunta de forma foi **proposta ao
 *   chat** na `FILA.md` (LAB-123);
 * - **as cinco marcas reconstruídas** (`009` a `012`) passam pela mesma régua; elas dizem no próprio
 *   texto que são reconstrução, e de onde veio cada campo (§1-B do `CLAUDE.md`);
 * - **se o prompt citado é o que de fato fez o item**: isso mora na tabela da `FILA.md`, que é
 *   relato e não tem forma fixa — a régua confere que o relatório existe, não que ele trata deste
 *   item;
 * - **o item aberto e o `900`**, que nunca vira `-FEITO`;
 * - **o `-RETIRADO`**: retirar não é fazer, e não há o que marcar (não há nenhum nesta caixa).
 */
import { PROMPT_DO_LAB } from "./nome-do-prompt.ts";
import { lerNomeDoItem } from "./numero-do-item.ts";

/** O que a régua achou no topo de um item feito. */
export interface MarcaDeFeito {
  /** Quantas linhas tem o bloco de citação inicial. Zero é *"não há topo"*. */
  linhasDoTopo: number;
  temFeito: boolean;
  /** O primeiro prompt citado no topo, ou `null`. */
  prompt: string | null;
  /** O relatório desse prompt é citado no topo? (`relatorios/<prompt>.md`) */
  citaORelatorio: boolean;
}

export type TipoDeProblemaDaMarca =
  | "sem-topo"
  | "topo-sem-feito"
  | "topo-sem-prompt"
  | "topo-sem-relatorio"
  | "relatorio-que-nao-existe";

export interface ProblemaDaMarca {
  item: string;
  tipo: TipoDeProblemaDaMarca;
}

/** O bloco de citação com que o texto começa — as linhas iniciais que começam por `>`. */
export function topoDoItem(texto: string): string[] {
  const topo: string[] = [];
  for (const l of texto.split("\n")) {
    if (!l.startsWith(">")) break;
    topo.push(l);
  }
  return topo;
}

const PROMPT = new RegExp(`\\b(${PROMPT_DO_LAB})\\b`);

/**
 * O `FEITO` **da marca**, e não o de um nome de arquivo citado: `013-FEITO.md` não é marca. Medido
 * no `015`, que abre pelo aviso de renumeração citando `013-FEITO.md` e o `LAB-80` (que fez o
 * **outro** item), e só na 20ª linha do topo diz *"✅ FEITO no LAB-82"*.
 */
const FEITO_DA_MARCA = /(?<![\w-])FEITO(?![\w-]|\.md)/;

/**
 * Lê a marca no topo. Nunca lança: texto sem topo é marca de zero linhas. O prompt é o **primeiro
 * citado depois do `FEITO` da marca** — o que vem antes fala de outra coisa (o `015`, acima).
 */
export function lerAMarca(texto: string): MarcaDeFeito {
  const linhas = topoDoItem(texto);
  const topo = linhas.join("\n");
  const feito = FEITO_DA_MARCA.exec(topo);
  const prompt = feito ? (PROMPT.exec(topo.slice(feito.index))?.[1] ?? null) : null;
  return {
    linhasDoTopo: linhas.length,
    temFeito: feito !== null,
    prompt,
    citaORelatorio: prompt !== null && topo.includes(`relatorios/${prompt}.md`),
  };
}

/**
 * Confere os itens feitos de uma caixa. Recebe **todos** os nomes da pasta e escolhe sozinha os
 * `-FEITO` pela forma única — quem chama não filtra, para a régua não herdar o filtro de ninguém.
 *
 * @param itens nome e texto de cada arquivo da pasta
 * @param relatorioExiste pergunta ao disco se `docs/relatorios/<prompt>.md` existe
 */
export function conferirAsMarcas(
  itens: readonly { nome: string; texto: string }[],
  relatorioExiste: (prompt: string) => boolean,
): { feitos: number; problemas: ProblemaDaMarca[] } {
  const problemas: ProblemaDaMarca[] = [];
  let feitos = 0;
  for (const { nome, texto } of itens) {
    if (lerNomeDoItem(nome)?.estado !== "feito") continue;
    feitos++;
    const m = lerAMarca(texto);
    if (m.linhasDoTopo === 0) problemas.push({ item: nome, tipo: "sem-topo" });
    else if (!m.temFeito) problemas.push({ item: nome, tipo: "topo-sem-feito" });
    else if (m.prompt === null) problemas.push({ item: nome, tipo: "topo-sem-prompt" });
    else if (!m.citaORelatorio) problemas.push({ item: nome, tipo: "topo-sem-relatorio" });
    else if (!relatorioExiste(m.prompt)) problemas.push({ item: nome, tipo: "relatorio-que-nao-existe" });
  }
  return { feitos, problemas };
}
