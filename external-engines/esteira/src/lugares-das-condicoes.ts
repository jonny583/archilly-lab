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
}

/**
 * **Os SETE lugares, lidos um a um.** Nenhum achado por `grep` de frase: achados por leitura.
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
      "as QUINZE propostas e itens abertos, com as etiquetas declaradas — `prompt-novo` (6), " +
      "`nao-medido` (3), `aguardando-outro-repositorio` (3), `escopo-novo`, `depois-do-mvp`, " +
      "`aguardando-o-jonny`",
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
    oQueEstaParado: "a cópia do Padrão Archilly e o `VERSAO.txt`, que não existem na árvore",
    aCondicao: '"o kit, quando chegar, é outro item" — e a regra do bloco NÃO espera por ele',
    tipo: "evento",
    marcaNoLugar: "o kit, quando chegar, é outro item",
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

/** Quantas condições de retorno existem, contando as quinze da `FILA.md` uma a uma. */
export const QUANTAS_CONDICOES = {
  naFila: 15,
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
    if (!texto.includes(l.marcaNoLugar)) {
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
