/**
 * O QUE O VIZINHO PRECISA VIRA LISTA NUMERADA EM RELATÓRIO — E NADA PERGUNTAVA SE VIRAVA. (LAB-149, item 900, a dívida
 * própria, D377)
 *
 * # A regra, e o que a guardava
 *
 * O `CLAUDE.md` §4 diz: *"**Não escreve em repositório vizinho:** clones só leitura, `git status` limpo ao fim; o que o
 * vizinho precisa **vira lista numerada em relatório**."* A primeira metade tem trava desde o LAB-38
 * (`tests/regras.test.ts`, *"§4 · não escreve em repositório vizinho"*: o clone que existe está limpo). A segunda só
 * tinha a do enxugamento do item 028 (`enxugar-o-claude.ts`), que confere que a frase **está escrita** no `CLAUDE.md` —
 * não que algum relatório a cumpra. Tirar a lista de qualquer pedido ao vizinho deixava a suíte inteira verde.
 *
 * # O que se mediu (17/10/2026), por LUGAR
 *
 * O pedido ao vizinho mora em dois lugares de um relatório, e os dois têm forma reconhecível desde o LAB-17:
 *
 * 1. **o título de seção** — *"Para o Generate — lista numerada, nada escrito lá"*, *"O que vai ao Laboratório de
 *    Parcelamento — pelo chat, nunca por commit"*, *"O que fica pedido, e o pedido NÃO é commit (§4)"*: um DESTINO (o
 *    Generate, o Laboratório de Parcelamento, o Geo, o motor, o vizinho, outro repositório) e um GESTO de levar (para o,
 *    vai ao, pede ao, precisa mudar, para repassar, lista para), ou o pedido nomeado sozinho;
 * 2. **o marcador de item** — *"- **Para o Generate (pelo chat, não por commit lá):**"*, a forma que nasceu na seção
 *    *"Achados"* dos relatórios recentes.
 *
 * E "lista numerada" tem quatro escritas na casa, todas contadas: o item `1.` do Markdown, a linha de tabela que começa
 * pelo número (`| **1** |`), o subtítulo numerado (`### 1 · …`) e a linha numerada dentro de bloco de código
 * (`1 · o teto de face…`, do `BALANCOS.md`).
 *
 * Nos 145 relatórios de `docs/relatorios/` (o `RECADOS.md` fora: recado não é relatório), a régua acha **27 lugares de
 * pedido** (26 títulos e 1 marcador), **22 com lista** e **cinco sem**, todos anteriores a esta trava, congelados em
 * {@link SEM_LISTA_ANTES_DA_TRAVA} com o motivo: quatro antigos (LAB-03, LAB-07, LAB-24 e o LAB-82, cujo pedido de seis
 * linhas foi só no recado) e **o do LAB-147, a rodada da véspera**, um marcador *"Para o Generate"* em tópico. A regra
 * estava descumprida até a véspera.
 *
 * # A régua
 *
 * Todo lugar de pedido achado tem de ter ao menos um item numerado, ou estar numa das duas listas fechadas, com motivo:
 * {@link SEM_LISTA_ANTES_DA_TRAVA} (só relatório anterior a {@link PRIMEIRO_COBRADO}) ou {@link NAO_E_PEDIDO} (o título
 * que tem a forma e não é pedido). Declaração que não se acha mais, ou que passou a ter lista, **sobra** — a lista desce
 * com a árvore.
 *
 * # O que ela NÃO alcança, dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */

/** A frase do `CLAUDE.md` §4 que esta trava faz perguntar. */
export const A_REGRA = "o que o vizinho precisa **vira lista numerada em relatório**";

/** O primeiro relatório cobrado sem exceção: o desta trava. Antes dele, o que faltava está congelado e nomeado. */
export const PRIMEIRO_COBRADO = 149;

/** Os arquivos de `docs/relatorios/` que não são relatório: o recado é o resumo de doze linhas, não o lugar da lista. */
export const NAO_SAO_RELATORIO: readonly string[] = ["RECADOS.md"];

const DESTINO =
  /\b(archilly generate|generate|laborat[óo]rio de parcelamento|geo|motor|testfit|vizinhos?|outro reposit[óo]rio)\b/i;
const GESTO =
  /\b(para o|para a|vai ao|vai para|fica para|pede ao|pede à|precisa mudar|para repassar|lista para|lista que vai|lista numerada|levar ao|leva ao)\b/i;
const PEDIDO_SOZINHO = /(\bfica pedido\b|^(\d+(\.\d+)?\s*·\s*)?o pedido\b)/i;
const MARCADOR = /^[-*]\s+\*\*Para (o|a) (Archilly )?(Generate|Laborat[óo]rio de Parcelamento|Geo|motor|Testfit|vizinho)\b[^*]*\*\*/i;

/** O título tem a forma de pedido ao vizinho? (destino e gesto, ou o pedido nomeado sozinho) */
export function tituloDePedido(titulo: string): boolean {
  const t = titulo.replace(/[*`_]/g, "");
  return (DESTINO.test(t) && GESTO.test(t)) || PEDIDO_SOZINHO.test(t);
}

/** As quatro escritas de item numerado da casa. `dentroDeBloco` diz se a linha está num bloco de código. */
export function itemNumerado(linha: string, dentroDeBloco: boolean): boolean {
  if (dentroDeBloco) return /^\s*\d+\s*[·.)]\s+\S/.test(linha);
  return (
    /^\s*\d+[.)]\s+\S/.test(linha) ||
    /^\|\s*\**#?\d+\**\s*\|/.test(linha) ||
    /^#{2,6}\s+\d+(\.\d+)?\s*[·.—-]\s/.test(linha)
  );
}

export type FormaDoLugar = "titulo" | "marcador";

export interface LugarDePedido {
  arquivo: string;
  linha: number;
  /** O título da seção, ou o rótulo em negrito do marcador — é a chave das declarações, com o arquivo. */
  rotulo: string;
  forma: FormaDoLugar;
  itensNumerados: number;
}

export const chaveDoLugar = (l: Pick<LugarDePedido, "arquivo" | "rotulo">): string => `${l.arquivo} · ${l.rotulo}`;

const TITULO = /^(#{2,4})\s+(.*\S)\s*$/;

/** Os lugares de pedido ao vizinho num relatório, com quantos itens numerados cada um tem. */
export function lugaresDePedido(arquivo: string, texto: string): LugarDePedido[] {
  const linhas = texto.split("\n");
  const emBloco: boolean[] = [];
  let bloco = false;
  for (const l of linhas) {
    if (/^\s*```/.test(l)) {
      emBloco.push(true);
      bloco = !bloco;
      continue;
    }
    emBloco.push(bloco);
  }
  const lugares: LugarDePedido[] = [];
  for (let i = 0; i < linhas.length; i++) {
    if (emBloco[i]) continue;
    const l = linhas[i]!;
    const t = TITULO.exec(l);
    if (t && tituloDePedido(t[2]!)) {
      const nivel = t[1]!.length;
      let n = 0;
      for (let j = i + 1; j < linhas.length; j++) {
        const h = emBloco[j] ? null : TITULO.exec(linhas[j]!);
        if (h && h[1]!.length <= nivel) break;
        if (itemNumerado(linhas[j]!, emBloco[j]!)) n++;
      }
      lugares.push({ arquivo, linha: i + 1, rotulo: t[2]!, forma: "titulo", itensNumerados: n });
      continue;
    }
    const m = MARCADOR.exec(l);
    if (m) {
      let n = 0;
      for (let j = i + 1; j < linhas.length; j++) {
        const s = linhas[j]!;
        if (s.trim() === "") {
          if (!/^\s+\S/.test(linhas[j + 1] ?? "")) break;
          continue;
        }
        if (!/^\s+\S/.test(s)) break;
        if (itemNumerado(s, emBloco[j]!)) n++;
      }
      const rotulo = m[0].replace(/^[-*]\s+/, "");
      lugares.push({ arquivo, linha: i + 1, rotulo, forma: "marcador", itensNumerados: n });
    }
  }
  return lugares;
}

/**
 * Os pedidos ao vizinho SEM lista numerada, de antes desta trava. Não se reescreve relatório antigo para passar (o
 * relatório é o registro do dia, D118): congela-se, com o motivo, e a lista só desce.
 */
export const SEM_LISTA_ANTES_DA_TRAVA: Readonly<Record<string, string>> = {
  "LAB-03.md · O que isso muda para o Generate":
    "a correção do criarModeloRelevo (exigir vizinhos de duas cotas distintas) em prosa: um pedido só, que o LAB-07 já tinha mandado pelo chat",
  "LAB-07.md · O Generate: **afetado** — diagnóstico para repassar":
    "a mesma correção das duas cotas distintas, sugerida em prosa (\"O que sugerir ao Generate:\"): um pedido só, sem número",
  "LAB-24.md · 4 · O formato proposto para o Generate e o Orçamento":
    "a proposta vai como arquivo (docs/provas/LAB-24/formato-proposto.json) e a seção a descreve em tópicos, sem numerar",
  "LAB-82.md · 4 · O PEDIDO, e a escolha de desenho que ele NÃO esconde":
    "o pedido de seis linhas saiu no RECADO, pronto para colar (LAB-82), e a seção do relatório só o descreve: a lista nunca entrou no relatório",
  "LAB-147.md · **Para o Generate (pelo chat, não por commit lá):**":
    "o achado da via sem comprimento num marcador de tópico, um item só — a rodada da véspera desta trava, e o motivo dela existir",
};

/** O título que tem a forma de pedido e não é pedido ao vizinho. */
export const NAO_E_PEDIDO: Readonly<Record<string, string>> = {};

export type TipoDoProblema =
  | "pedido-sem-lista"
  | "excecao-depois-da-trava"
  | "declaracao-que-sobra"
  | "motivo-curto"
  | "universo-vazio";

export interface ProblemaDoPedido {
  onde: string;
  tipo: TipoDoProblema;
  detalhe: string;
}

export interface ResultadoDosPedidos {
  relatoriosLidos: number;
  lugares: LugarDePedido[];
  problemas: ProblemaDoPedido[];
}

/** O número do prompt de um relatório `LAB-NN.md`; `null` para os que não têm (BALANCOS, LF-FINAL…). */
export function numeroDoRelatorio(arquivo: string): number | null {
  const m = /^LAB-(\d+)\.md$/.exec(arquivo);
  return m ? Number(m[1]) : null;
}

/** Confere os relatórios (nome do arquivo → texto). */
export function conferirPedidosAoVizinho(
  relatorios: ReadonlyMap<string, string>,
  semLista: Readonly<Record<string, string>> = SEM_LISTA_ANTES_DA_TRAVA,
  naoEPedido: Readonly<Record<string, string>> = NAO_E_PEDIDO,
  desde: number = PRIMEIRO_COBRADO,
): ResultadoDosPedidos {
  const problemas: ProblemaDoPedido[] = [];
  const lugares: LugarDePedido[] = [];
  let lidos = 0;
  for (const [arquivo, texto] of [...relatorios].sort(([a], [b]) => a.localeCompare(b))) {
    if (NAO_SAO_RELATORIO.includes(arquivo)) continue;
    lidos++;
    lugares.push(...lugaresDePedido(arquivo, texto));
  }
  if (lidos === 0 || lugares.length === 0)
    problemas.push({
      onde: "docs/relatorios/",
      tipo: "universo-vazio",
      detalhe: `${lidos} relatório(s) lido(s), ${lugares.length} lugar(es) de pedido — a régua não leu nada (D164)`,
    });

  const achados = new Map(lugares.map((l) => [chaveDoLugar(l), l]));
  for (const l of lugares) {
    const chave = chaveDoLugar(l);
    if (l.itensNumerados > 0 || chave in naoEPedido) continue;
    if (chave in semLista) {
      const n = numeroDoRelatorio(l.arquivo);
      if (n !== null && n >= desde)
        problemas.push({
          onde: `${l.arquivo}:${l.linha}`,
          tipo: "excecao-depois-da-trava",
          detalhe: `LAB-${n} é de depois da trava (${desde}) — relatório novo não se congela, numera-se`,
        });
      continue;
    }
    problemas.push({
      onde: `${l.arquivo}:${l.linha}`,
      tipo: "pedido-sem-lista",
      detalhe: `"${l.rotulo}" (${l.forma}) pede ao vizinho e não tem item numerado — o CLAUDE.md §4 manda lista numerada`,
    });
  }
  for (const [nome, lista] of [
    ["SEM_LISTA_ANTES_DA_TRAVA", semLista],
    ["NAO_E_PEDIDO", naoEPedido],
  ] as const) {
    for (const [chave, motivo] of Object.entries(lista)) {
      const l = achados.get(chave);
      if (motivo.trim().length < 40)
        problemas.push({ onde: chave, tipo: "motivo-curto", detalhe: `${nome}: motivo com menos de 40 caracteres` });
      if (!l)
        problemas.push({ onde: chave, tipo: "declaracao-que-sobra", detalhe: `${nome}: o lugar não existe mais` });
      else if (nome === "SEM_LISTA_ANTES_DA_TRAVA" && l.itensNumerados > 0)
        problemas.push({ onde: chave, tipo: "declaracao-que-sobra", detalhe: `${nome}: o lugar passou a ter lista` });
    }
  }
  return { relatoriosLidos: lidos, lugares, problemas };
}

/** O que esta régua não alcança — dito, para não mentir pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o pedido escrito em prosa corrida, sem título nem marcador de forma reconhecível — a régua lê a FORMA que a casa usa",
  "se a lista numerada diz o que o vizinho precisa: ela confere que há item numerado, não o conteúdo de cada item",
  "o pedido que foi só no recado ou só na conversa — a regra manda o relatório, e o que não está nele não se lê",
  "título de destino novo (um vizinho que a casa ainda não lê): o DESTINO é lista fechada, e cresce com a casa",
  "relatório fora de docs/relatorios/ — a regra diz \"em relatório\", e é ali que eles moram (CLAUDE.md §7)",
  "os relatórios sem número (BALANCOS, LF-…): a exceção depois da trava só se mede pelo número do prompt",
];
