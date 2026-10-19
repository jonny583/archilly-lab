/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A TRAVA QUE REGERA A VARREDURA — e as duas espécies de prova. (item 024, LAB-91)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **Proposta minha, do LAB-60, aberta desde 07/10 e executada agora.** O texto dela:
 *
 * > *"Prova gerada antes da última edição do que ela mede é prova velha — e nada no verde
 * > reprovava isso. A trava que existe hoje confere a prova contra si mesma; ela não **regera**
 * > a varredura. Fica proposto ao chat: uma trava que reexecuta a varredura e exige que a prova
 * > bata."*
 *
 * E o número que a fundamentou, medido no LAB-60 sobre o commit `4249027`:
 *
 * ```
 * conferencia-desligada-por-arquivo   a prova commitada dizia  1
 *                                     a ferramenta, na MESMA árvore: 10
 * ```
 *
 * > **Prova velha não é prova errada: é prova de outro commit, com a autoridade de quem
 * > conferiu.** A régua existe, roda, dá verde — e o universo que ela leu não é o da árvore.
 *
 * # O que o LAB-86 já tinha feito, e o que FALTAVA
 *
 * O D287 pôs a recontagem do **ESCOPO** (`remedirAProva`): quantos arquivos, quantas linhas. Mas
 * o defeito do LAB-60 **não estava no escopo** — estava em `totalPorRegra`, a contagem **por
 * regra**, e nos `achados`. *Recontar o tamanho do universo não reconta o que a régua achou
 * nele* — e era exatamente a metade que faltava.
 *
 * # A PERGUNTA DE PROJETO, respondida por medição e não por categoria
 *
 * O item pediu: *quais provas podem ser regeradas dentro da trava sem ferir o D182*, que proíbe
 * sobregravar prova *"antes"* com prova *"depois"*. A resposta tem duas espécies, e a fronteira
 * **não se adivinha pelo nome do arquivo** — então ela é uma **lista escrita à mão, fechada nos
 * dois sentidos, com o motivo por linha**, como a lista de exceções do §7 (e o item autoriza
 * isso com estas palavras: *"a lista escrita à mão é a resposta… o que não serve é a trava
 * adivinhar"*).
 *
 * | espécie | regera? | por quê |
 * |---|---|---|
 * | **fotografia de um estado passado** | **nunca** | regerar é o próprio defeito que o D182 nasceu para impedir: o *"antes"* de uma aferição só vale no instante em que foi tirado |
 * | **função pura da árvore de AGORA** | **sempre** | o valor dela só tem sentido no commit em que está; prova que não bate com a árvore de hoje **não é prova, é lembrança** |
 *
 * **E a trava reprova nos dois sentidos:** função-da-árvore que não bate, e **fotografia que
 * deixou de precisar ser fotografia** — isto é, entrada da lista cujo motivo não se sustenta
 * mais. *Lista que não se revalida envelhece igual a comentário* (D104).
 *
 * **O segundo sentido, até o LAB-196, era só este parágrafo:** nenhum teste perguntava a uma fotografia se
 * o motivo dela se sustentava. Desde o LAB-196 (D424) **uma** é perguntada — a do LAB-60, pela trava
 * `tests/fotografia-no-commit-declarado.test.ts`, que roda a ferramenta no commit declarado (tem de dar a
 * prova) e na ponta do motor (tem de dar outra coisa). As outras três seguem só com o motivo escrito, e o
 * cabeçalho de `src/fotografia-no-commit-declarado.ts` diz por quê, uma a uma.
 */

/** A espécie de uma prova, para fins de regeração. */
export type EspecieDaProva =
  /** Estado passado, congelado de propósito: **não se regera** (D182). */
  | "fotografia"
  /** Função pura da árvore de agora: **tem de bater, e a trava regera**. */
  | "funcao-da-arvore";

export interface ProvaClassificada {
  prova: string;
  especie: EspecieDaProva;
  porque: string;
  /** Só para `funcao-da-arvore`: a trava desta casa já a regera e compara? */
  regeradaPelaTrava?: boolean;
}

/**
 * **A lista, fechada e com motivo por linha.** Ela cobre as provas desta casa cujo gerador é
 * **código daqui** — as que dependem de clone vizinho, de semente ou de motor não entram na
 * espécie `funcao-da-arvore`, porque *recontar o que depende de fora não é mais rigor: é outra
 * medição com o nome da antiga* (D288).
 */
export const AS_ESPECIES: readonly ProvaClassificada[] = [
  {
    prova: "LAB-57/varredura-de-configuracao.json",
    especie: "funcao-da-arvore",
    porque:
      "varre as configurações que o git carrega AGORA, com regras que são texto sobre arquivo: " +
      "o resultado é função da árvore, e foi ela que o LAB-60 pegou velha (1 contra 10)",
    regeradaPelaTrava: true,
  },
  {
    prova: "LAB-52/varredura-de-chamadas.json",
    especie: "funcao-da-arvore",
    porque:
      "varre todo `.ts` que existe e não é ignorado, com seis regras de texto: função da árvore, " +
      "e já esteve 40 % velha (D290)",
    regeradaPelaTrava: true,
  },
  {
    prova: "LAB-04/oraculo.json",
    especie: "funcao-da-arvore",
    porque:
      "o `medido` é função pura de duas fixtures fixas e do código de geometria de agora — o " +
      "`esperado` NÃO se reconta, porque vem de duas implementações independentes de fora desta " +
      "casa (D289)",
    regeradaPelaTrava: true,
  },
  {
    prova: "LAB-84/as-trinta-por-execucao.json",
    especie: "funcao-da-arvore",
    porque:
      "a SOMA `quantasTravasNaLista` é função da lista do workflow e dos testes de agora: ficou " +
      "698 enquanto a suíte rodada dizia 719, e as cópias escritas concordavam com ela (D325). A " +
      "trava `contar-as-travas.test.ts` reconta a soma; o 'passam sem clone' depende de AMBIENTE " +
      "(uma cópia sem os vizinhos) e continua sendo do `bun run lab84`",
    regeradaPelaTrava: true,
  },
  {
    prova: "LAB-48/violacoes-do-motor-padrao.json",
    especie: "fotografia",
    porque:
      "é o ANTES de uma aferição: as violações do motor no commit em que o defeito foi medido. " +
      "Regerá-la apagaria o lado 'antes' da comparação, que é precisamente o que o D182 proíbe — " +
      "e ela roda MOTOR, então o universo nem está nesta casa",
  },
  {
    prova: "LAB-02/completo.saida-cortada.json",
    especie: "fotografia",
    porque:
      "a saída guardada de uma rodada do motor sobre uma gleba, com semente: ela existe para que " +
      "a medição possa ser refeita contra a MESMA saída. Regerar aqui troca o sujeito da comparação",
  },
  {
    prova: "LAB-31/sabotagem.json",
    especie: "fotografia",
    porque:
      "registra um ATO ('quebrei esta trava e o exit foi 0 → 1'): regerar seria REFAZER a " +
      "sabotagem, que é outro ato (D289)",
  },
  {
    prova: "LAB-60/configuracao-do-motor.json",
    especie: "fotografia",
    porque:
      "mede a árvore de configuração do CLONE VIZINHO: o universo está fora desta casa, e " +
      "recontar com o motor andado mede outra coisa com o nome da antiga (D288). Perguntado no LAB-196 " +
      "(D424): no commit que ela declara a ferramenta de hoje a refaz igual, e na ponta do motor grava " +
      "outra — a trava `fotografia-no-commit-declarado.test.ts` pergunta as duas coisas a cada verde",
  },
] as const;

export interface DesacordoDaRegeracao {
  tipo: "contagem-por-regra" | "achado-a-mais" | "achado-a-menos" | "chave-ausente";
  oQue: string;
}

/**
 * **Compara o publicado com o REGERADO**, por regra e achado por achado.
 *
 * Não compara datas e não compara o texto em volta: compara **o que a régua achou**. Cada
 * desacordo sai **nomeando a regra e o arquivo**, porque *linha de reprovação sem o nome do que
 * reprovou obriga quem conserta a adivinhar*.
 */
export function conferirRegerando(
  publicado: { porRegra?: Record<string, number>; achados?: { arquivo: string; linha: number; regra: string }[] },
  regerado: { porRegra: Record<string, number>; achados: { arquivo: string; linha: number; regra: string }[] },
): DesacordoDaRegeracao[] {
  const desacordos: DesacordoDaRegeracao[] = [];
  const pub = publicado.porRegra;
  if (pub === undefined) {
    desacordos.push({
      tipo: "chave-ausente",
      oQue: "a prova não traz a contagem por regra — e sem ela a regeração não tem o que comparar",
    });
  } else {
    for (const regra of new Set([...Object.keys(pub), ...Object.keys(regerado.porRegra)])) {
      const a = pub[regra] ?? 0;
      const b = regerado.porRegra[regra] ?? 0;
      if (a !== b) {
        desacordos.push({
          tipo: "contagem-por-regra",
          oQue: `\`${regra}\`: a prova diz ${a} e a árvore de agora diz ${b}`,
        });
      }
    }
  }

  const chave = (x: { arquivo: string; linha: number; regra: string }): string =>
    `${x.regra}|${x.arquivo}:${x.linha}`;
  const publicados = new Set((publicado.achados ?? []).map(chave));
  const agora = new Set(regerado.achados.map(chave));
  for (const k of agora) {
    if (!publicados.has(k)) desacordos.push({ tipo: "achado-a-mais", oQue: `a árvore de agora acha \`${k}\` e a prova não o traz` });
  }
  for (const k of publicados) {
    if (!agora.has(k)) desacordos.push({ tipo: "achado-a-menos", oQue: `a prova traz \`${k}\` e a árvore de agora não o acha` });
  }
  return desacordos;
}

/**
 * **A lista fecha?** Reprova a prova que está em duas espécies, e a que não está em nenhuma
 * **entre as que a trava diz regerar**. *Lista aberta é lista que não cobra.*
 */
export function conferirALista(
  provasQueExistem: readonly string[],
): { duplicadas: string[]; regeradasSemEntrada: string[]; entradasSemArquivo: string[] } {
  const vistas = new Map<string, number>();
  for (const e of AS_ESPECIES) vistas.set(e.prova, (vistas.get(e.prova) ?? 0) + 1);
  return {
    duplicadas: [...vistas].filter(([, n]) => n > 1).map(([p]) => p),
    regeradasSemEntrada: AS_ESPECIES.filter((e) => e.regeradaPelaTrava === true && e.especie !== "funcao-da-arvore").map((e) => e.prova),
    entradasSemArquivo: AS_ESPECIES.filter((e) => !provasQueExistem.includes(e.prova)).map((e) => e.prova),
  };
}
