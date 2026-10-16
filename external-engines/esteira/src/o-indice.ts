/**
 * O ÍNDICE AFIRMA O QUE EXISTE — e passa a ser conferido nas duas coisas que afirma. (LAB-118,
 * item 900, a dívida própria, D346)
 *
 * # O defeito, medido em 16/10/2026
 *
 * A seção *"As medições — um relatório por prompt"* do `docs/INDEX.md` diz, no título, que todo
 * relatório tem a sua linha. Enumerados por LUGAR os `.md` de `docs/relatorios/` (115: 109
 * `LAB-NN`, quatro de antes da numeração, `RECADOS.md` e `BALANCOS.md`), **seis nunca tiveram linha**: `LAB-70.md` a
 * `LAB-75.md`, os itens 003 a 008 da caixa, todos de 09/10/2026 e do mesmo ramo — e o `git log -S`
 * do nome de cada um no `INDEX.md` volta vazio. A trava do LAB-100 (D327) confere que toda ligação
 * do índice **leva a algum lugar**; nenhuma conferia o outro sentido, que todo relatório **tem** uma
 * ligação. *O CLAUDE.md §7 manda o `INDEX.md` em dia ao fim de todo prompt — regra sem guarda.*
 *
 * E na tabela *"Decisão e fila"*, as linhas das páginas que mudam A CADA RODADA afirmavam o estado
 * de um dia que passou, com nada que as relesse:
 *
 * | linha | o que dizia | o que é hoje | escrito em |
 * |---|---|---|---|
 * | `DECISOES.md` | **72 decisões numeradas** | a D345 é a última | 20/09 (LAB-06) |
 * | `prompts/FILA.md` | *"a fila de 19/09, a da tela unificada, **esgotou**"* | a ida vem da caixa desde 09/10 | 19/09 |
 * | `PENDENCIAS_JONNY.md` | ***Hoje:*** *quanto é "desvio desproporcional"?* | respondido em 02/10 (D84) | 01/10 (D61) |
 *
 * São duas espécies da dívida própria numa página só: **número digitado à mão** e **mensagem fixa
 * que afirma estado sem perguntar**.
 *
 * # Por que a frase SAI, em vez de ganhar uma recontagem
 *
 * Cada uma dessas páginas diz o próprio estado a quem a abre — a última decisão está no fim do
 * `DECISOES.md`, o que está aberto para o Jonny está no topo do `PENDENCIAS_JONNY.md`. A linha do
 * índice diz **o que a página responde**, não **o que ela diz hoje**: o índice muda quando nasce
 * documento novo, e estas páginas mudam em toda rodada. *Sem frase honesta, a frase sai* (a mesma
 * forma do LAB-115, D342).
 *
 * # O que este módulo faz
 *
 * - {@link relatoriosForaDoIndice} — todo `docs/relatorios/<nome>.md` tem de ser alvo de uma
 *   ligação do índice (resolvida pela MESMA régua do LAB-100, `resolverDaPagina`). Publica o
 *   universo lido.
 * - {@link afirmacoesDeEstado} — nas linhas da tabela cujo primeiro campo liga para uma das
 *   {@link PAGINAS_QUE_MUDAM_A_CADA_RODADA}, reprova **algarismo** (contagem ou data) e
 *   ***"hoje:"*** (o conteúdo do dia anunciado). A citação não é afirmação de estado: `LAB-NN`,
 *   `D123`, `item 003` e `§1-B` saem antes de contar. *"Onde estamos hoje"* (sem os dois-pontos)
 *   é o caso válido que quase parece inválido: diz o que a página responde.
 *   E **toda página da lista tem de ter exatamente uma linha** — sem linha, a régua aprovaria por
 *   não ler.
 *
 * # O que ele NÃO alcança, dito
 *
 * - **as outras seções do índice** — *"O código"* descreve arquivo vivo com contagem de desenho
 *   (*"quatro regras"*, *"seis pontos por comprimento de arco"*), que é verdade por construção e
 *   não estado do dia; uma delas (*"seis travas"* do `verde.test.ts`, que tem quinze) estava
 *   errada e saiu à mão, sem régua — proposta na FILA;
 * - **as linhas de relatório**: são relato datado, e o relato não se reescreve;
 * - **estado dito por extenso** (*"nenhuma pendência"*, *"a fila esgotou"* sem data): régua de
 *   palavra não pega o que não reconhece;
 * - **prova, pasta ou arquivo de outra espécie** fora do índice: só o relatório de prompt tem a
 *   promessa *"um por prompt"* escrita.
 */
import { ligacoes, resolverDaPagina } from "./caminhos-da-pagina.ts";

/** A página que este módulo confere. */
export const PAGINA = "docs/INDEX.md";

/** Onde moram os relatórios — só o nível de cima: `docs/relatorios/<nome>.md`. */
export const RELATORIO = /^docs\/relatorios\/[^/]+\.md$/;

/**
 * As páginas que mudam a cada rodada, pelo caminho a partir da raiz. São as da tabela *"Decisão e
 * fila"* e a do estado: o que elas dizem hoje, elas mesmas dizem.
 */
export const PAGINAS_QUE_MUDAM_A_CADA_RODADA = [
  "docs/ONDE_PARAMOS.md",
  "docs/caixa-de-entrada/COMO_FUNCIONA.md",
  "docs/prompts/FILA.md",
  "docs/DECISOES.md",
  "docs/PENDENCIAS_JONNY.md",
  "docs/relatorios/BALANCOS.md",
  "docs/relatorios/RECADOS.md",
] as const;

/** O que a conferência dos relatórios devolve. */
export interface RelatoriosNoIndice {
  /** Quantos relatórios a régua leu — o universo, publicado. */
  lidos: number;
  /** Quantas ligações do índice ela leu. */
  ligacoesLidas: number;
  /** Os relatórios que nenhuma ligação alcança, em ordem. */
  fora: string[];
}

/** Todo relatório é alvo de uma ligação do índice. `arquivos` são caminhos a partir da raiz. */
export function relatoriosForaDoIndice(arquivos: readonly string[], indice: string): RelatoriosNoIndice {
  const relatorios = arquivos.filter((a) => RELATORIO.test(a)).sort();
  const lista = ligacoes(indice);
  const alcancados = new Set(lista.map((l) => resolverDaPagina(PAGINA, l)).filter((c) => c !== null));
  return {
    lidos: relatorios.length,
    ligacoesLidas: lista.length,
    fora: relatorios.filter((r) => !alcancados.has(r)),
  };
}

/** Uma afirmação de estado achada numa linha do índice. */
export interface AfirmacaoDeEstado {
  pagina: string;
  linha: number;
  motivo: "algarismo" | "hoje:";
  trecho: string;
}

/** O que a conferência das linhas devolve. */
export interface EstadoNoIndice {
  /** As linhas de tabela lidas que ligam para uma página da lista. */
  linhasLidas: number;
  afirmacoes: AfirmacaoDeEstado[];
  /** Página da lista com zero ou mais de uma linha, e quantas. */
  semUmaLinha: { pagina: string; linhas: number }[];
}

/**
 * A citação sai antes de contar: prompt, decisão, item e seção são ponteiro, não estado. O
 * `LAB01_` é o nome antigo de um relatório; `§1-B` e `§4-A` são seções do `CLAUDE.md`.
 */
const CITACAO = /\bLAB-?\d+\b|\bLF-[\w-]+|\bD\d{2,}\b|\bitem\s+\d{3,}\b|§[\w.-]+/gi;

/** O primeiro campo da linha de tabela, e o resto — a descrição. */
function campos(linha: string): { primeiro: string; resto: string } | null {
  if (!linha.startsWith("|")) return null;
  const partes = linha.split("|");
  if (partes.length < 4) return null;
  return { primeiro: partes[1]!, resto: partes.slice(2).join("|") };
}

export function afirmacoesDeEstado(
  indice: string,
  paginas: readonly string[] = PAGINAS_QUE_MUDAM_A_CADA_RODADA,
): EstadoNoIndice {
  const afirmacoes: AfirmacaoDeEstado[] = [];
  const contagem = new Map<string, number>(paginas.map((p) => [p, 0]));
  let linhasLidas = 0;
  indice.split("\n").forEach((l, i) => {
    const c = campos(l);
    if (c === null) return;
    const alvos = ligacoes(c.primeiro).map((a) => resolverDaPagina(PAGINA, a));
    const pagina = alvos.find((a): a is string => a !== null && contagem.has(a));
    if (pagina === undefined) return;
    linhasLidas++;
    contagem.set(pagina, contagem.get(pagina)! + 1);
    const descricao = c.resto.replace(/`[^`\n]*`/g, "").replace(/\[[^\]]*\]\([^)]*\)/g, "").replace(CITACAO, "");
    const numero = descricao.match(/\d[\d.,/: ]*\d|\d/);
    if (numero !== null) afirmacoes.push({ pagina, linha: i + 1, motivo: "algarismo", trecho: numero[0] });
    const hoje = descricao.match(/\bhoje\s*\**\s*:/i);
    if (hoje !== null) afirmacoes.push({ pagina, linha: i + 1, motivo: "hoje:", trecho: hoje[0] });
  });
  return {
    linhasLidas,
    afirmacoes,
    semUmaLinha: [...contagem].filter(([, n]) => n !== 1).map(([pagina, linhas]) => ({ pagina, linhas })),
  };
}
