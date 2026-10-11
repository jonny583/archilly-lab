/**
 * ════════════════════════════════════════════════════════════════════════════
 *  POR LUGAR, NÃO POR FRASE. (item 007 da caixa de entrada)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A Central mediu e corrigiu uma instrução que o próprio chat tinha espalhado:
 *
 * > O `grep` por *"quando compensar"*, *"ponto de equilíbrio"* e *"volume mensal"* deu **ZERO**
 * > — **e havia QUATRO.** As quatro apareceram **listando os LUGARES** onde a coisa mora e
 * > lendo cada um. **Faça por LUGAR, não por FRASE.**
 *
 * > **A régua de palavra não sabe as palavras que ainda não foram escritas.** Para achar o que
 * > existe, enumere os LUGARES; a varredura serve para impedir o que vai NASCER, não para
 * > inventariar o que já nasceu.
 *
 * # O que isto corrigiu no item 006, e o que NÃO corrigiu
 *
 * No item 006 eu varri por frase e publiquei *"zero de quinze"*. **O veredicto sobreviveu e a
 * cobertura não:** as quinze eram as etiquetas declaradas da `FILA.md`, **um lugar**. Lendo os
 * **sete** lugares há **vinte** condições de retorno — cinco que a varredura de frase não tinha
 * como ver, porque nenhuma delas usa as palavras que eu procurei.
 *
 * *O meu "zero" estava certo por não haver nenhuma, não por a varredura alcançar.*
 */

import { aRegraEstaEscrita } from "./texto-das-regras.ts";

/** Uma condição de retorno é uma CONTA quando o gatilho dela é volume, receita ou equilíbrio. */
export type TipoDaCondicao =
  | "conta"
  | "data"
  | "marco"
  | "evento"
  | "pessoa"
  | "repositorio"
  | "medicao"
  | "metodo";

export interface LugarDeCondicao {
  /** O arquivo, relativo à raiz — **um lugar é um arquivo**, não um padrão. */
  lugar: string;
  /** O que está parado ali. */
  oQueEstaParado: string;
  /** A condição para voltar, como ela está escrita. */
  aCondicao: string;
  tipo: TipoDaCondicao;
  /** Uma marca que tem de continuar no arquivo — é o que impede esta lista de envelhecer. */
  marcaNoLugar: string;
  /** Contradiz a regra de família da cobrança por uso (D239)? */
  contradizARegra: boolean;
  /**
   * **O que a declaração deste lugar afirma sobre a ÁRVORE** — arquivo por arquivo, e com o
   * booleano DECLARADO em vez de adivinhado na frase (LAB-87, D291).
   *
   * A declaração do `CLAUDE.md` dizia *"a cópia do Padrão Archilly e o `VERSAO.txt`, que não
   * existem na árvore"*, e **metade era falsa**: a cópia existia desde **14/09** (PR #12 — e não
   * *"03/10"*: aquele número era o commit do CORTE de um clone raso, corrigido no LAB-88 por
   * D293), e desde 11/10 aquele caminho é um PONTEIRO (D292). A primeira régua que
   * eu escrevi para pegar isso lia a FRASE — procurava *"não existe na árvore"* perto do nome do
   * arquivo — e **não pegou**, porque a mesma frase fala de dois arquivos com veredictos opostos.
   *
   * > **Não escreva uma régua que adivinhe o veredicto dentro da prosa: declare o veredicto.** É
   * > a lição do item 006 (*"tire o campo onde a mensalidade caberia"*) pelo lado de fora — aqui o
   * > que faltava era um campo onde o FATO caiba, para ninguém ter de ler a frase para saber dele.
   */
  oQueODiscoDeveDizer?: ReadonlyArray<{ arquivo: string; existe: boolean }>;
}

/**
 * **Os OITO lugares, lidos um a um.** Nenhum achado por `grep` de frase: achados por leitura.
 *
 * **Eram SETE até o LAB-85**, quando a decisão sobre o que o gatilho do CI carrega pôs uma coisa
 * NOVA em espera, com condição de volta (D284). *Lugar novo nasce quando algo novo fica parado —
 * e o jeito de esta lista mentir é alguém parar uma coisa e não a inscrever aqui.*
 *
 * As quinze etiquetas declaradas da `FILA.md` entram como **uma** linha, porque são um lugar e
 * um tipo; as outras cinco são as que só apareceram por lugar.
 */
export const LUGARES: LugarDeCondicao[] = [
  {
    lugar: "docs/COMO_RELIGAR_O_CI.md",
    oQueEstaParado: "a execução automática do CI — gatilho comentado e rotina `disabled_manually`",
    aCondicao: "a cota gratuita de Actions zera em 1º/11/2026, e a trava REPROVA a partir dessa data",
    tipo: "data",
    marcaNoLugar: "1º de novembro de 2026",
    contradizARegra: false,
  },
  {
    lugar: "external-engines/symbios/adapter/src/recorte.ts",
    oQueEstaParado: "os consertos de geometria do LAB-05 — lascas e recorte de quadra",
    aCondicao: "vêm DESLIGADOS por padrão e só ligam quando pedidos, com medição nas duas passagens (§4)",
    tipo: "metodo",
    marcaNoLugar: "tudo desligado por padrão",
    contradizARegra: false,
  },
  {
    lugar: "docs/prompts/FILA.md",
    oQueEstaParado:
      "as CATORZE propostas e itens abertos, com as etiquetas declaradas — `prompt-novo` (4), " +
      "`nao-medido` (3), `aguardando-outro-repositorio` (3), `aguardando-o-jonny` (2), " +
      "`escopo-novo`, `depois-do-mvp`",
    aCondicao: "cada uma espera pessoa, repositório, prompt novo, medição ou o marco do MVP",
    tipo: "pessoa",
    marcaNoLugar: "depois-do-mvp",
    contradizARegra: false,
  },
  {
    lugar: "docs/PENDENCIAS_JONNY.md",
    oQueEstaParado: "a obra de ligar fonte paga por recorte (§8)",
    aCondicao: '"só vale a pena quando houver a primeira fonte paga" — e fui eu que escrevi, no item 006',
    tipo: "evento",
    marcaNoLugar: "quando houver a primeira fonte paga",
    contradizARegra: false,
  },
  {
    lugar: "docs/relatorios/BALANCOS.md",
    oQueEstaParado: "a corda reta das vias curvas",
    aCondicao: "adiada para a V3 — decisão do Jonny, registrada como decisão e não como pendência",
    tipo: "marco",
    marcaNoLugar: "adiada para a V3",
    contradizARegra: false,
  },
  {
    lugar: "CLAUDE.md",
    // ── A METADE FALSA DESTA LINHA, MEDIDA NO LAB-87 (D291) ──────────────────
    //
    // Ela dizia "a cópia do Padrão Archilly e o `VERSAO.txt`, que não existem na árvore".
    // Medido: o `VERSAO.txt` de fato não existe; a CÓPIA EXISTIA, em
    // `docs/referencia/PADRAO_ARCHILLY.md`, e o `docs/INDEX.md` a listava como "cópia trazida"
    // — a árvore se contradizia em duas páginas. A trava `por-lugar.test.ts` passou a conferir
    // ESTA declaração CONTRA O DISCO, nos dois sentidos.
    //
    // E NO LAB-88 (D292) A CÓPIA SAIU: aquele caminho é um PONTEIRO com procedência, porque a
    // cópia era 8,4 % das linhas do documento vigente e o rótulo "3.0" cobre DOIS textos na
    // origem. O arquivo continua EXISTINDO — o que mudou é o que ele é —, e por isso o booleano
    // do disco segue `true`: quem confere o CONTEÚDO dele é a `padrao-da-familia.test.ts`.
    oQueEstaParado:
      "o `VERSAO.txt`, que não existe na árvore — e o Padrão da família, que não mora aqui: " +
      "`docs/referencia/PADRAO_ARCHILLY.md` é um PONTEIRO para " +
      "`jonny583/archilly-central`, com o commit lido declarado (LAB-88, D292)",
    aCondicao: '"o kit, quando chegar, é outro item" — e a regra do bloco NÃO espera por ele',
    tipo: "evento",
    marcaNoLugar: "o kit, quando chegar, é outro item",
    contradizARegra: false,
    oQueODiscoDeveDizer: [
      { arquivo: "docs/referencia/PADRAO_ARCHILLY.md", existe: true },
      { arquivo: "VERSAO.txt", existe: false },
    ],
  },
  {
    lugar: ".github/workflows/verde.yml",
    oQueEstaParado:
      "o trabalho `o verde completo` fora do gatilho automático — ele roda à mão pelo " +
      "`workflow_dispatch`, e não entra no `push`/`pull_request` (LAB-85, D284)",
    aCondicao:
      "no dia em que o segredo `VIZINHOS_TOKEN` existir, a pendência da §11 da página do Jonny é " +
      "riscada e a condição TEM DE SAIR — é um EVENTO e não uma data, e a trava cobra os dois " +
      "sentidos (`tests/o-que-o-gatilho-carrega.test.ts`)",
    tipo: "evento",
    marcaNoLugar: "ELE NÃO ENTRA NO GATILHO AUTOMÁTICO ENQUANTO FALTAR O SEGREDO",
    contradizARegra: false,
  },
  {
    lugar: "docs/caixa-de-entrada/COMO_FUNCIONA.md",
    oQueEstaParado: "o que vai para ramo em vez da `main` — o que eu não tenho certeza",
    aCondicao: 'o ramo "se chama pela pergunta que ele espera", e volta quando a pergunta for respondida',
    tipo: "pessoa",
    marcaNoLugar: "pergunta que ele espera",
    contradizARegra: false,
  },
];

/** Quantas condições de retorno existem, contando uma a uma as da `FILA.md`. */
export const QUANTAS_CONDICOES = {
  // 15 → 16 no LAB-78: o conserto do sétimo mecanismo entrou como proposta com condição
  // `aguardando-o-jonny`, que passou de 1 para 2. **A etiqueta é a mesma; só a conta andou.**
  // 16 → 17 no LAB-80: a proposta de unificar as cinco leituras de "afirma ou mostra" entrou
  // com `prompt-novo`, que passou de 6 para 7. E 17 → 16 no LAB-81, quando ela foi EXECUTADA.
  // 16 → 17 no LAB-82: o carimbo do módulo resolvido (D274), também com `prompt-novo`. No
  // LAB-83 a conta andou DUAS vezes e voltou a 17: essa foi EXECUTADA e saiu por ENTREGA (D276),
  // e entrou a do trabalho de CI que diz não precisar dos clones e precisa (D279). **Saldo
  // parado não é rodada parada**, e é por isso que as duas ficam escritas.
  // 17 → 16 no LAB-84: a do nome do trabalho foi EXECUTADA (D282), e saiu por ENTREGA; e
  // 16 → 15 no LAB-85, a do trabalho de CI que não pode passar (D284). **QUATRO descidas por
  // entrega em cinco rodadas** — a fila está sendo consumida mais rápido do que abastecida, e
  // isso é notícia para quem decide o intervalo.
  // **ATENÇÃO, e isto me pegou no LAB-91:** este número conta as ETIQUETAS de condição
  // declaradas na `FILA.md` (`prompt-novo`, `nao-medido`…), e NÃO as propostas abertas. No
  // LAB-91 eu baixei os dois por reflexo ao executar uma proposta, e a trava da etiqueta
  // acusou: a proposta executada **não tinha etiqueta**, então este número não mudou.
  // *Dois números com o mesmo valor não são o mesmo número* (D301).
  // 15 → 14 no LAB-87: a das outras dez provas recontáveis (D289), por ENTREGA — e ela saiu
  // MENOR do que entrou, porque a forma cabia em três provas e não em dez.
  // E nenhuma das catorze é uma CONTA, que é o que a régua existe para cobrar.
  naFila: 14,
  foraDaFila: LUGARES.filter((l) => l.lugar !== "docs/prompts/FILA.md").length,
  get total(): number {
    return this.naFila + this.foraDaFila;
  },
  /** O que a varredura de FRASE do item 006 alcançou: um lugar só. */
  queAVarreduraDeFraseAlcancou: 15,
};

export interface ProblemaDoLugar {
  tipo: "lugar-ausente" | "marca-ausente" | "conta-sem-conserto" | "conta-declarada";
  oQue: string;
}

/**
 * Confere a lista **contra os arquivos**: cada lugar existe e ainda traz a sua marca.
 *
 * *Lista que não se revalida envelhece igual a comentário* (D104) — e esta lista é justamente a
 * resposta a *"para quem vier depois saber onde você olhou"*.
 */
export function conferirOsLugares(
  ler: (caminho: string) => string | null,
): ProblemaDoLugar[] {
  const problemas: ProblemaDoLugar[] = [];
  for (const l of LUGARES) {
    const texto = ler(l.lugar);
    if (texto === null) {
      problemas.push({ tipo: "lugar-ausente", oQue: `o lugar \`${l.lugar}\` não existe mais` });
      continue;
    }
    // ── A MARCA SE LÊ COMO ELA SE LÊ, NÃO COMO ESTÁ GRAVADA (D248, aplicado no LAB-87) ──
    //
    // Era `texto.includes(l.marcaNoLugar)` cru, e **me reprovou dentro do LAB-87**: ao corrigir
    // a §1-C do `CLAUDE.md` a frase *"o kit, quando chegar, é outro item"* caiu numa quebra de
    // linha — `"o kit,\nquando chegar"` —, e a trava acusou a marca de ter saído do arquivo.
    // É a NONA da família do D248, e o conserto já morava em `src/texto-das-regras.ts`: a
    // largura da coluna de um `.md` é escolha de quem escreve e não pode mudar o que a trava vê.
    if (!aRegraEstaEscrita(texto, l.marcaNoLugar)) {
      problemas.push({
        tipo: "marca-ausente",
        oQue: `\`${l.lugar}\` não traz mais "${l.marcaNoLugar}" — ou a coisa saiu de lá, ou a lista envelheceu`,
      });
    }
    if (l.tipo === "conta" && !l.contradizARegra) {
      problemas.push({
        tipo: "conta-sem-conserto",
        oQue: `\`${l.lugar}\` tem condição de CONTA e não está marcada como contradizendo a regra`,
      });
    }
    if (l.contradizARegra) {
      problemas.push({
        tipo: "conta-declarada",
        oQue: `\`${l.lugar}\` CONTRADIZ a regra de família (D239): ${l.aCondicao}`,
      });
    }
  }
  return problemas;
}

/**
 * **O que a lista AFIRMA sobre a árvore, conferido NO DISCO** (LAB-87, D291).
 *
 * Não lê frase nenhuma: lê o campo {@link LugarDeCondicao.oQueODiscoDeveDizer}, que é onde o fato
 * está declarado, e pergunta ao disco. Devolve uma linha por desacordo, **nomeando o arquivo e os
 * dois lados** — o que a lista diz e o que o disco diz.
 *
 * > **Declaração minha sobre o que a árvore TEM ou NÃO TEM é a mais fácil de todas de conferir, e
 * > por isso é a mais vergonhosa de deixar sem guarda:** não precisa de clone, de rede, de motor
 * > nem de semente — precisa de um `existsSync`. O que faltava não era instrumento, era a
 * > pergunta. E ela ficou **um mês** sem ser feita, enquanto o `docs/INDEX.md` dizia o contrário
 * > na mesma árvore.
 */
export function conferirAsAfirmacoesSobreADisco(
  lugares: readonly LugarDeCondicao[],
  existeNoDisco: (caminho: string) => boolean,
): string[] {
  const problemas: string[] = [];
  for (const l of lugares) {
    for (const { arquivo, existe } of l.oQueODiscoDeveDizer ?? []) {
      const noDisco = existeNoDisco(arquivo);
      if (noDisco !== existe) {
        problemas.push(
          `\`${l.lugar}\` afirma que \`${arquivo}\` ${existe ? "EXISTE" : "NÃO existe"} na árvore, ` +
            `e o disco diz que ele ${noDisco ? "EXISTE" : "NÃO existe"}`,
        );
      }
    }
  }
  return problemas;
}
