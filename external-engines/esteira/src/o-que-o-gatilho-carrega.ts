/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O QUE O GATILHO AUTOMÁTICO CARREGA QUANDO ELE VOLTAR. (item 018, LAB-85)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O **D221** achou a pergunta certa: *"o D124 está certo em FALHAR COM A RECEITA em vez de pular;
 * o que está errado é AGENDÁ-LO enquanto o segredo não existe."* São duas perguntas diferentes —
 * *como* um trabalho impossível reporta, e *se* ele deve ser agendado —, e misturá-las era o
 * defeito.
 *
 * E o item 018 pôs prazo nela, porque a trava desta casa pôs: `DATA_DE_RELIGAR` é **1º/11/2026**,
 * e a partir dali `gatilho-do-verde.test.ts` reprova se o gatilho continuar comentado.
 *
 * # A MEDIÇÃO MOVEU DUAS PREMISSAS DO ITEM, e as duas para o mesmo lado
 *
 * O item pediu *"o número de NOVEMBRO, não o de outubro"*. Medido na API do Actions, três
 * execuções de dias diferentes:
 *
 * | execução | `run_duration_ms` | `billable.UBUNTU.total_ms` |
 * |---|---|---|
 * | 37751994616 | 9 000 | **0** |
 * | 37751249491 | 49 000 | **0** |
 * | 37713910680 | 10 000 | **0** |
 *
 * > **Os "136 minutos" do D221 são MINUTOS-TRABALHO CONSUMIDOS, e não dinheiro: a conta cobrada
 * > é ZERO.** `archilly-lab` é público e `ubuntu-latest` em repositório público é gratuito e não
 * > medido — a §7 do `CLAUDE.md` já dizia isso em outras palavras (*"a parte deste repositório no
 * > estouro é ZERO"*), e a API confirma campo por campo.
 *
 * **Então a escolha NÃO é de dinheiro**, e o item autorizava parar na fronteira se fosse. Em
 * nenhum dos três caminhos novembro custa um centavo.
 *
 * # E o trabalho condenado custa SETE SEGUNDOS, não um minuto
 *
 * Medido passo a passo em duas execuções: `o verde completo` dura **5 a 7 s** e a **precondição
 * falha 3 a 4 s depois do início**; todos os passos seguintes saem `skipped` — ele **nunca clona,
 * nunca instala, nunca roda a suíte.** O D124 está funcionando exatamente como desenhado.
 *
 * # O custo REAL, e ele não se mede em minutos
 *
 * **136 de 136 execuções terminaram em `failure`** — sempre pelo mesmo passo, sempre pelo mesmo
 * motivo.
 *
 * > **Um sinal que ficou vermelho 136 de 136 vezes não é um alarme: é ruído de fundo.** O custo
 * > dele não se paga em minuto — paga-se em quantas vezes alguém aprendeu a ignorar o vermelho.
 *
 * E é isto que concilia o D221 com a frase da §7 (*"um CI vermelho por falta de configuração é
 * honesto"*): **as duas estão certas sobre coisas diferentes.** O vermelho por falta de
 * configuração é honesto **uma vez**; repetido 136 vezes sem nada mudar, ele deixou de informar.
 */

/** A data em que a trava do gatilho passa a reprovar o gatilho comentado. */
export const DATA_DO_PRAZO = "2026-11-01";

/** A condição que tira o verde completo do gatilho automático — pelo EVENTO, não pelo segredo. */
export const CONDICAO_DO_VERDE_COMPLETO = "github.event_name == 'workflow_dispatch'";

/**
 * **POR QUE PELO EVENTO E NÃO PELO SEGREDO, e isto é o que eu posso DEMONSTRAR.**
 *
 * O item ofereceu o caminho condicional *"o trabalho 2 condicionado à existência do segredo"*, e
 * ele tem um problema de plataforma: o contexto `secrets` **não está disponível num `if:` de
 * trabalho**. Fazê-lo exigiria um **terceiro trabalho** só para ler o segredo num passo e publicar
 * uma saída — e eu **não posso demonstrar isso aqui**, porque a execução automática está desligada
 * e o item proíbe religá-la para medir.
 *
 * > **Entre dois consertos, o que eu posso demonstrar nesta máquina vale mais do que o que eu só
 * > posso afirmar** — e uma condição que eu não testei, num arquivo que ninguém executa, é a
 * > forma mais silenciosa de desligar um trabalho.
 *
 * `github.event_name` **está** disponível num `if:` de trabalho, é legível no arquivo e o seu
 * efeito é conferível por leitura: o trabalho sai do `push`/`pull_request` e fica no
 * `workflow_dispatch`, que já está ligado.
 */
export const PORQUE_PELO_EVENTO =
  "o contexto `secrets` não existe num `if:` de trabalho, e a alternativa exigiria um terceiro " +
  "trabalho que eu não posso demonstrar com o CI desligado";

export interface Caminho {
  nome: string;
  ganha: string;
  perde: string;
  /** Dinheiro em novembro, por envio. Medido: zero nos três. */
  custoEmNovembro: "R$ 0";
  escolhido: boolean;
}

/**
 * Os TRÊS caminhos do item, recusteados com a medição — e o custo em dinheiro é o mesmo nos três.
 *
 * *Quando a coluna do dinheiro empata, ela para de decidir — e o que decide passa a ser a coluna
 * que ninguém tinha escrito.*
 */
export const CAMINHOS: Caminho[] = [
  {
    nome: "o gatilho carrega só o trabalho 1",
    ganha:
      "o vermelho volta a informar: 136 de 136 deixam de existir, e um vermelho novo passa a " +
      "querer dizer que uma guarda de verdade quebrou. E são 5 a 7 s menos por envio",
    perde:
      "o verde completo só roda à mão — e no dia em que o segredo nascer, ninguém é avisado se " +
      "ele quebrar, até alguém pôr o trabalho de volta no gatilho. **É isto que a trava deste " +
      "prompt cobra**, nos dois sentidos",
    custoEmNovembro: "R$ 0",
    escolhido: true,
  },
  {
    nome: "carrega os dois, com o trabalho 2 condicionado à EXISTÊNCIA DO SEGREDO",
    ganha: "volta sozinho no dia em que o segredo nascer, sem ninguém lembrar",
    perde:
      "o contexto `secrets` não existe num `if:` de trabalho, então precisa de um TERCEIRO " +
      "trabalho para ler o segredo e publicar a saída — e com o CI desligado eu **não posso " +
      "demonstrar** que a condição pega. Condição não demonstrada, em arquivo que ninguém " +
      "executa, é a quinta forma de desligar: a que não deixa nada vermelho",
    custoEmNovembro: "R$ 0",
    escolhido: false,
  },
  {
    nome: "carrega os dois como hoje",
    ganha: "nada a mexer",
    perde:
      "o vermelho continua sendo ruído: 136 de 136, sempre o mesmo passo. Não custa dinheiro e " +
      "custa 5 a 7 s — o preço é o sinal, e ele já foi pago 136 vezes",
    custoEmNovembro: "R$ 0",
    escolhido: false,
  },
];

/** Um trabalho do workflow, só com o que esta régua pergunta. */
interface TrabalhoDoWorkflow {
  if?: unknown;
}

/**
 * Os trabalhos do workflow, lidos do YAML. `null` quando o YAML não abre — e isso é PROBLEMA
 * para quem chama, nunca aprovação (D213).
 */
export function jobsDoWorkflow(workflow: string): Record<string, TrabalhoDoWorkflow> | null {
  try {
    const d = Bun.YAML.parse(workflow) as { jobs?: Record<string, TrabalhoDoWorkflow> } | null;
    return d?.jobs ?? null;
  } catch {
    return null;
  }
}

export interface ProblemaDoGatilho {
  tipo:
    | "condicao-ausente"
    | "condicao-sem-marca"
    | "trabalho-1-condicionado"
    | "escolha-sem-caminho"
    | "pendencia-ausente"
    | "pendencia-resolvida-e-condicao-de-pe"
    | "yaml-nao-abre";
  oQue: string;
}

/** A marca que a condição carrega no arquivo — sem ela, um `if:` é desligamento calado. */
export const MARCA_DA_CONDICAO = "LAB-85";

/** O que a página do Jonny tem de dizer enquanto a condição estiver de pé. */
export const MARCA_NA_PAGINA = "VIZINHOS_TOKEN";

/** Onde começa a documentação do trabalho 2 — a âncora da janela em que a marca tem de estar. */
export const ANCORA_DO_TRABALHO_2 = "# ── O VERDE de verdade";

/**
 * O título da pendência na página do Jonny, e é por ele que se sabe se ela foi RESOLVIDA.
 *
 * **A convenção da página é riscar o título** (§5: *"item resolvido é marcado, nunca apagado"*),
 * então a pergunta é se a LINHA do título traz `~~`.
 *
 * E a primeira versão disto era um `~~[^~]*VIZINHOS_TOKEN[^~]*~~` sobre a página inteira, que
 * leu a página de hoje como **resolvida**: o `[^~]` não para em fim de linha nem em fim de seção,
 * então ele emendou um `~~` da §10 com um da lista de resolvidos, com a §11 no meio.
 *
 * > **Classe negada não é fronteira.** `[^~]` diz *"qualquer coisa que não seja til"* — e
 * > parágrafos, seções e o arquivo inteiro cabem nisso.
 */
export const TITULO_DA_PENDENCIA = "Uma senha que só você pode criar";

/**
 * Confere a decisão **nos dois sentidos**, que é o que a torna um prazo e não um desligamento.
 *
 * 1. enquanto a condição estiver no arquivo, ela traz a marca **e** a pendência está aberta na
 *    página do Jonny — é a pendência que diz *por que* o trabalho está fora;
 * 2. quando a pendência for marcada como resolvida, a condição **tem de sair** — porque o motivo
 *    dela deixou de existir. *Condição cujo motivo acabou e que continua de pé é desligamento.*
 *
 * O segundo sentido é o **prazo**, e ele é um EVENTO e não uma data: a data de 1º/11 é do gatilho,
 * esta é do segredo. *Prazo que não pode ser uma data ainda pode ser um evento, desde que alguém
 * cobre o evento.*
 */
export function conferirOQueOGatilhoCarrega(
  workflow: string,
  paginaDoJonny: string,
): ProblemaDoGatilho[] {
  const problemas: ProblemaDoGatilho[] = [];

  if (CAMINHOS.filter((c) => c.escolhido).length !== 1) {
    problemas.push({
      tipo: "escolha-sem-caminho",
      oQue: "a decisão tem de eleger EXATAMENTE um dos caminhos — zero é indecisão, dois é confusão",
    });
  }

  const jobsParaACondicao = jobsDoWorkflow(workflow);
  if (jobsParaACondicao === null) {
    problemas.push({
      tipo: "yaml-nao-abre",
      oQue:
        "o `verde.yml` não abre como YAML, ou não tem `jobs:` — e isso NÃO é aprovação: é a " +
        "régua sem medir nada (D213)",
    });
    return problemas;
  }
  const temCondicao = jobsParaACondicao?.["verde-completo"]?.if === CONDICAO_DO_VERDE_COMPLETO;
  if (!temCondicao) {
    problemas.push({
      tipo: "condicao-ausente",
      oQue:
        `o \`verde-completo\` não traz \`if: ${CONDICAO_DO_VERDE_COMPLETO}\` — ou a decisão do ` +
        "LAB-85 saiu do arquivo, ou ela mudou e esta régua tem de mudar com ela",
    });
  }

  // A marca: o `if:` tem de dizer DE ONDE veio e POR QUE existe, na vizinhança dele.
  if (temCondicao) {
    // A marca é prosa de propósito — é ela que um humano lê — e por isso aqui o texto é o objeto.
    // *A pergunta decide o instrumento: `tem condição?` é do YAML; `a condição está explicada?`
    // é do texto.*
    //
    // E a janela sai de uma ÂNCORA e não de um número de caracteres: `i - 1800` dependia do
    // tamanho da caixa de comentário, e cresceria para mentira no dia em que alguém escrevesse
    // mais uma linha ali. *Janela medida em caracteres é coincidência com prazo de validade.*
    const i = workflow.indexOf(`if: ${CONDICAO_DO_VERDE_COMPLETO}`);
    const ini = workflow.indexOf(ANCORA_DO_TRABALHO_2);
    const vizinhanca = ini >= 0 && ini < i ? workflow.slice(ini, i) : "";
    if (!vizinhanca.includes(MARCA_DA_CONDICAO) || !vizinhanca.includes(MARCA_NA_PAGINA)) {
      problemas.push({
        tipo: "condicao-sem-marca",
        oQue:
          `a condição existe e não traz a marca (\`${MARCA_DA_CONDICAO}\` e ` +
          `\`${MARCA_NA_PAGINA}\`) perto dela — *condição sem marca é desligamento calado*, e ` +
          "cinco dos seis desligadores desta família não têm evento próprio",
      });
    }
  }

  // ── O trabalho 1 NUNCA é condicionado: ele é o portão de todo envio ─────
  //
  // **E ESTA PERGUNTA SE FAZ À ESTRUTURA, NÃO AO TEXTO** (D286). A primeira versão procurava a
  // palavra `if:` entre o nome de um trabalho e o do outro, e **acusou o próprio comentário que
  // explica a condição** — a caixa acima do `verde-completo` diz *"o `if:` abaixo é essa
  // decisão"*. Oitava vez da família do D142/D155/D257 nesta casa, e a primeira **no mesmo dia**
  // em que eu a escrevi como decisão (D282).
  //
  // > **Régua que pergunta se um TRABALHO tem condição pergunta ao YAML, não ao arquivo.** O
  // > `Bun.YAML` responde pela chave; o `includes` responde pelo que está escrito em volta.
  const jobs = jobsDoWorkflow(workflow);
  if (jobs !== null && jobs["guardas-sem-clones"]?.if !== undefined) {
    problemas.push({
      tipo: "trabalho-1-condicionado",
      oQue:
        "o `guardas-sem-clones` ganhou um `if:` — ele é o portão que roda em TODO envio, e " +
        `condicioná-lo é desligar o único trabalho que hoje informa alguma coisa (achei \`${String(jobs["guardas-sem-clones"]?.if)}\`)`,
    });
  }

  // Os dois sentidos da pendência do Jonny.
  // **LINHA A LINHA, e é o conserto da classe negada.** A pergunta é se a linha DO TÍTULO está
  // riscada — e uma linha é a fronteira que o `~~` respeita.
  const pendenciaResolvida = paginaDoJonny
    .split("\n")
    .some((l) => l.includes(TITULO_DA_PENDENCIA) && l.includes("~~"));
  if (!paginaDoJonny.includes(MARCA_NA_PAGINA)) {
    problemas.push({
      tipo: "pendencia-ausente",
      oQue:
        "a página do Jonny não fala do `VIZINHOS_TOKEN`, e ele é a ÚNICA coisa desta decisão que " +
        "só uma pessoa pode fazer. O LAB-38 propôs isto no RELATÓRIO e nunca na página — e o " +
        "item 018 afirmou que estava lá. *Pedido que mora só num relatório não chega a quem " +
        "decide* (D285)",
    });
  } else if (pendenciaResolvida && temCondicao) {
    problemas.push({
      tipo: "pendencia-resolvida-e-condicao-de-pe",
      oQue:
        "o segredo foi criado (a pendência está marcada como resolvida) e o `verde-completo` " +
        "CONTINUA fora do gatilho automático — o motivo da condição acabou, então a condição tem " +
        "de sair. *Este é o PRAZO, e ele é um evento: condição cujo motivo acabou é desligamento*",
    });
  }

  return problemas;
}
