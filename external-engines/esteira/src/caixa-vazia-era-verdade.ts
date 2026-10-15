/**
 * ════════════════════════════════════════════════════════════════════════════
 *  "CAIXA VAZIA" ERA VERDADE? — a guarda, e o que ela NÃO decide. (item 023, LAB-90)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A direção mediu um defeito **do documento dela**, em 11 de 11 casas: o
 * `COMO_FUNCIONA.md` mandava *"leia esta pasta"* — **o disco** — e a pasta é escrita por
 * outra mão, de hora em hora. *Um clone que nasceu antes da última escrita lê a caixa vazia com
 * item dentro.* Ela consertou a receita e pediu **a guarda**, porque *"consertar o texto não é
 * guarda"* (a A409 desta casa).
 *
 * # O que esta régua decide, e é uma função pura
 *
 * Dada a **lista de nomes** de `docs/caixa-de-entrada/` na árvore de um commit de declaração,
 * ela diz se havia item **aberto** — `NNN.md` sem `-FEITO`, sem `-RETIRADO` e sem o
 * `COMO_FUNCIONA`, que é a definição do próprio documento da direção. Função de
 * (árvore, commit) → veredicto: **perguntável por partes, e sem rede.**
 *
 * # O que ela NÃO decide, e isto é o terceiro estado que o item pediu
 *
 * O item pediu um estado **`bloqueado`** — *"item aberto cuja execução espera pessoa ou outro
 * repositório"* — e avisou: *"se a distinção não for decidível por máquina, diga isso e RECUSE
 * em vez de adivinhar"*. **Medido: não é decidível por nome.**
 *
 * | onde | o que existe no NOME |
 * |---|---|
 * | `archilly-propostas`, toda a história da caixa | só `NNN.md` e `NNN-FEITO.md` |
 * | `archilly-lab` (aqui) | só `NNN.md` e `NNN-FEITO.md` |
 * | a receita da direção | `-FEITO` e `-RETIRADO`, e nada mais |
 *
 * **Nenhuma casa marca bloqueio no nome do arquivo.** Então `bloqueado` sai **`null`** — *não
 * medido*, nunca "verdadeira" nem "falsa" (D23, D295).
 *
 * # Mas há uma distinção que É decidível, e ela separa as quatro acusadas das oito legítimas
 *
 * > **Item aberto com número MENOR que algum `-FEITO` foi PULADO em rodadas anteriores** — a casa
 * > já passou por ele e decidiu passar, e *onde mora essa decisão esta régua não alcança.*
 * > **Item aberto que é o MAIOR número da caixa, com todos os menores já `-FEITO`, é O PRÓXIMO** —
 * > e declarar a caixa vazia com ele dentro é declaração **falsa**.
 *
 * Medido, ela casa com todas as linhas que eu pude conferir:
 *
 * | casa | commit | aberto | maior `-FEITO` | veredicto |
 * |---|---|---|---|---|
 * | Orçamento | `e701a6f` | `021.md` | 020 | **falsa** — era o próximo |
 * | este Lab | `34bc00c` | `005.md` | 004 | **falsa** — era o próximo, e é minha |
 * | Propostas | `bd84f13` | `007.md` + 3 adendos | 012 | **já pulada** — não acusa |
 * | este Lab | `2bc543f`, `1e7df13`, `8e8b74b`, `8236799` | nenhum | — | **vazia** — verdadeira |
 *
 * *A régua não diz que o pulado está certo: diz que **não é o caso do clone velho**, e que quem
 * decide se ele é bloqueio legítimo não é ela.* **Cobrança que reprova o código correto é
 * desligada na semana seguinte** (A254/A255), e as oito do Propostas estão certas.
 */

import { ITEM_RESERVADO, itensEmOrdem, lerNomeDoItem } from "./numero-do-item.ts";

/**
 * Um item **aberto**, pela definição do próprio `COMO_FUNCIONA.md` da direção — com o número pela
 * forma única ({@link lerNomeDoItem}): **três casas ou mais**. Até o LAB-113 era `^\d{3}`, e um
 * `1000.md` aberto não era item: a caixa saía *vazia* com ele dentro (D340).
 */
export function ehItemAberto(nome: string): boolean {
  return lerNomeDoItem(nome)?.estado === "aberto";
}

/**
 * O número do item, pela forma única. Até o LAB-113 era o prefixo de **exatamente** três dígitos,
 * e `1000.md` lia **`100`** — o número errado, não a ausência (D340).
 */
export function numeroDoItem(nome: string): number | null {
  return lerNomeDoItem(nome)?.numero ?? null;
}

/**
 * Os abertos **da direção**, em ordem de fila: o reservado `900` (*"lista própria"*) sai, porque não
 * é item que a direção escreveu para ser feito e renomeado — é o que vale quando não há outro (item
 * 030, regra 2). Com ele dentro, a declaração verdadeira de hoje (*"a caixa só tem o 900"*) saía
 * FALSA: o `900` é maior que todo `-FEITO` (D340).
 */
function abertosDaDirecao(nomes: readonly string[]): string[] {
  return itensEmOrdem(nomes)
    .filter((i) => i.estado === "aberto" && i.numero !== ITEM_RESERVADO)
    .map((i) => i.nome);
}

/**
 * **O ASSUNTO do commit NEGA a caixa vazia?** (LAB-90, achado contra a tabela da direção)
 *
 * Medido: a linha do **Geo** na tabela do item aponta `f0cb290`, cuja árvore **tem** o `010.md`
 * aberto — então a régua da árvore diz **falsa**. Mas o assunto daquele commit é
 * *"correcao: a caixa NAO esta vazia — o 010 chegou durante a rodada do 009"*: **é a casa se
 * corrigindo**, não declarando. A tabela da direção apontou **a correção, não a declaração.**
 *
 * > **A régua responde sobre a ÁRVORE, e a árvore não sabe o que o commit DIZ.** *O commit de
 * > declaração tem de ser escolhido por quem DECLARA, não por quem casa a palavra* — é a família
 * > do D155 desta casa (*"a régua leu o comentário que explicava o conserto"*), agora no
 * > instrumento da direção.
 *
 * Esta régua de palavra existe **para RECUSAR, nunca para acusar**: falso positivo aqui faz a
 * guarda dizer *"isto não é uma declaração"*, que é o lado seguro do erro.
 */
export function oAssuntoNegaACaixaVazia(assunto: string): boolean {
  const limpo = assunto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return (
    /\bnao\b[^.]{0,20}\bvazi/.test(limpo) ||
    /\bnao\b[^.]{0,20}\bem vazio\b/.test(limpo) ||
    /\bcorrecao\b[^.]{0,40}\bcaixa\b/.test(limpo)
  );
}

export type Veredicto =
  /** Nenhum item aberto: a declaração de caixa vazia era **verdadeira**. */
  | "vazia"
  /** Item aberto que é o PRÓXIMO da fila: a declaração era **falsa**. */
  | "aberta-com-o-proximo"
  /** Item aberto já PULADO em rodadas anteriores: **não decidível aqui**. */
  | "aberta-ja-pulada"
  /** Não havia pasta de caixa nessa árvore: **não medido**. */
  | "sem-caixa"
  /** O assunto do commit NEGA a caixa vazia: não é uma declaração, e não se julga. */
  | "nao-e-declaracao";

export interface LeituraDaCaixa {
  veredicto: Veredicto;
  /** `true` verdadeira, `false` falsa, **`null` não decidível** — nunca um chute. */
  declaracaoEraVerdadeira: boolean | null;
  abertos: string[];
  oMaiorFeito: number | null;
  porque: string;
  /** **O LIMITE, na SAÍDA, sempre** — inclusive no verde (o item 023 pediu com estas palavras). */
  oQueIstoNaoAlcanca: readonly string[];
}

/** O limite vai em TODA resposta: *guarda que não declara o próprio buraco mente pelo silêncio.* */
export const O_QUE_ISTO_NAO_ALCANCA = [
  "não vê a casa que nunca commitou (a CEGA): sem commit não há árvore para ler, e ausência de declaração falsa não é ausência de problema — é ausência de medição",
  "não vê o CLONE da casa, só a origem: ela mede a árvore do commit de declaração contra a declaração, e é justamente o clone velho que causa o defeito",
  "não decide BLOQUEIO: nenhuma casa marca bloqueio no nome do arquivo, então `item aberto já pulado` sai com veredicto `null` e não como acusação",
  "não acha a declaração: quem dá o commit de declaração é quem chama — e `git log --grep` numa casa de clone RASO responde sobre o corte, não sobre a casa (D295)",
] as const;

/**
 * **A caixa estava vazia naquela árvore?** Função pura sobre a lista de nomes.
 *
 * @param nomes os nomes de `docs/caixa-de-entrada/` na árvore do commit de declaração, sem
 *        caminho. Lista **vazia** significa *não havia pasta*, que é outra coisa de não haver item.
 */
export function aCaixaEstavaVazia(nomes: readonly string[], assunto?: string): LeituraDaCaixa {
  const limite = O_QUE_ISTO_NAO_ALCANCA;
  if (assunto !== undefined && oAssuntoNegaACaixaVazia(assunto)) {
    return {
      veredicto: "nao-e-declaracao",
      declaracaoEraVerdadeira: null,
      abertos: abertosDaDirecao(nomes),
      oMaiorFeito: null,
      porque:
        `o assunto do commit NEGA a caixa vazia ("${assunto}") — é correção ou aviso, não ` +
        "declaração, e julgar isto seria acusar a casa pelo commit em que ela acertou",
      oQueIstoNaoAlcanca: limite,
    };
  }
  if (nomes.length === 0) {
    return {
      veredicto: "sem-caixa",
      declaracaoEraVerdadeira: null,
      abertos: [],
      oMaiorFeito: null,
      porque: "a árvore daquele commit não tem a pasta da caixa — não medido, e não medido não é medido (D23)",
      oQueIstoNaoAlcanca: limite,
    };
  }

  const abertos = abertosDaDirecao(nomes);
  const feitos = itensEmOrdem(nomes)
    .filter((i) => i.estado !== "aberto")
    .map((i) => i.numero);
  const oMaiorFeito = feitos.length > 0 ? Math.max(...feitos) : null;

  if (abertos.length === 0) {
    return {
      veredicto: "vazia",
      declaracaoEraVerdadeira: true,
      abertos: [],
      oMaiorFeito,
      porque: nomes.some((n) => ehItemAberto(n) && numeroDoItem(n) === ITEM_RESERVADO)
        ? `nenhum item aberto da direção na árvore daquele commit — só o reservado ${ITEM_RESERVADO} ("lista própria"), que nunca se fecha: a declaração era verdadeira`
        : "nenhum item aberto na árvore daquele commit: a declaração era verdadeira",
      oQueIstoNaoAlcanca: limite,
    };
  }

  const oProximo = abertos.filter((a) => {
    const n = numeroDoItem(a);
    return n !== null && (oMaiorFeito === null || n > oMaiorFeito);
  });

  if (oProximo.length > 0) {
    return {
      veredicto: "aberta-com-o-proximo",
      declaracaoEraVerdadeira: false,
      abertos,
      oMaiorFeito,
      porque:
        `havia item aberto que era O PRÓXIMO da fila (${oProximo.join(", ")}` +
        `${oMaiorFeito === null ? "" : `, e o maior já feito é ${String(oMaiorFeito).padStart(3, "0")}`}): ` +
        "a declaração de caixa vazia era FALSA",
      oQueIstoNaoAlcanca: limite,
    };
  }

  return {
    veredicto: "aberta-ja-pulada",
    declaracaoEraVerdadeira: null,
    abertos,
    oMaiorFeito,
    porque:
      `havia item aberto, mas todos com número MENOR que o maior já feito (${String(oMaiorFeito).padStart(3, "0")}): ` +
      "a casa já passou por eles em rodadas anteriores. Isto NÃO é o caso do clone velho, e se é " +
      "bloqueio legítimo esta régua não decide — nenhuma casa marca bloqueio no nome do arquivo",
    oQueIstoNaoAlcanca: limite,
  };
}
