/**
 * ════════════════════════════════════════════════════════════════════════════
 *  COBRANÇA POR USO, NUNCA MENSALIDADE. (item 005 da caixa de entrada)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Regra de família, ordem direta do Jonny em 09/10/2026, para **todos** os aplicativos e
 * **todas** as APIs: *"absolutamente todas, em todas as sessões"*.
 *
 * > **Entre uma API que cobra por USO e uma que cobra MENSALIDADE, escolhe-se a de uso — mesmo
 * > que o uso saia mais caro.**
 *
 * O motivo não é financeiro, é de **ritmo**: *uma mensalidade contratada hoje é uma meta de
 * vendas contratada junto*. O texto dele, literal, e as oito consequências em prosa estão na
 * `CLAUDE.md` §4-A; este arquivo é a forma **conferível** delas.
 *
 * # O item mandou GRAVAR e NÃO EXECUTAR
 *
 * *"Não a execute: não há nada a comprar hoje. Ela existe para o dia em que houver."* Então aqui
 * não há fonte paga, não há comparação e não há conta — há a regra, as consequências e a
 * varredura do que a contradiria por escrito.
 *
 * # E o que esta guarda NÃO pega fica declarado
 *
 * **Contratar acontece fora da árvore**, num navegador, com um cartão. Nenhuma régua daqui
 * alcança isso — e é exatamente por isso que a consequência nº 8 é de **processo**, não de
 * código. *Guarda que não declara o próprio buraco mente pelo silêncio.*
 */

export interface ConsequenciaDaRegra {
  id: string;
  /** O que ela decide, em uma linha. */
  oQue: string;
  /** A frase pela qual a §4-A a cita, **declarada e não adivinhada** (D137, item 003). */
  marcaNaRegra: string;
  /** `decisao` ordena opções · `arquitetura` pede estrutura · `processo` é de pessoa. */
  tipo: "decisao" | "arquitetura" | "processo";
}

/** As oito consequências. Conjunto fechado — a trava confere cada uma contra a §4-A. */
export const CONSEQUENCIAS: ConsequenciaDaRegra[] = [
  {
    id: "ordenar-pela-menor-faixa",
    oQue:
      "a ordenação é pelo custo na MENOR faixa de uso, nunca por preço de tabela; toda " +
      "comparação de fonte paga traz três linhas — 3, 20 e 200 clientes",
    marcaNaRegra: "a ordenação é pelo custo na menor faixa de uso",
    tipo: "decisao",
  },
  {
    id: "volume-inventado-aprova-despesa",
    oQue:
      "conta feita com o volume que se gostaria de ter aprova despesa que não se sustenta — " +
      "medido contra mim no mesmo dia: R$ 2 por estudo com 200 clientes, R$ 133 com três",
    marcaNaRegra: "a forma mais educada de aprovar uma\n   despesa que não se sustenta",
    tipo: "decisao",
  },
  {
    id: "repasse-com-o-multiplicador",
    oQue:
      "o custo por uso se repassa pela porta de créditos da Central, declarando OPERAÇÃO e " +
      "nunca PREÇO; custo, fator e margem nunca chegam ao usuário comum",
    marcaNaRegra: "declarando operação e nunca preço",
    tipo: "decisao",
  },
  {
    id: "franquia-minima-e-mensalidade",
    oQue: "franquia mínima é mensalidade com outro nome, e se trata como tal",
    marcaNaRegra: "franquia mínima é mensalidade com outro nome",
    tipo: "decisao",
  },
  {
    id: "teste-gratis-que-vira-cobranca",
    oQue: "teste grátis que vira cobrança é mensalidade que começa depois: não se inicia",
    marcaNaRegra: "mensalidade que começa depois",
    tipo: "decisao",
  },
  {
    id: "cota-gratuita-de-verdade-pode",
    oQue:
      "cota gratuita de verdade não é mensalidade e pode entrar, desde que o aplicativo nunca " +
      "ultrapasse a faixa livre sozinho",
    marcaNaRegra: "cota gratuita de verdade não é mensalidade",
    tipo: "decisao",
  },
  {
    id: "liga-e-desliga-por-recorte",
    oQue:
      "fonte paga tem de poder ser ligada e desligada por recorte — estado, conta, operação — " +
      "sem tocar em código: é estrutura, não despesa",
    marcaNaRegra: "ligada e desligada por recorte",
    tipo: "arquitetura",
  },
  {
    id: "nenhuma-sessao-contrata",
    oQue:
      "nenhuma sessão abre conta, cadastra chave ou inicia teste; a sessão entrega a comparação " +
      "pronta e quem gasta é uma pessoa, fonte a fonte",
    marcaNaRegra: "nenhuma sessão contrata nada",
    tipo: "processo",
  },
];

/** As três faixas de uso que toda comparação de fonte paga tem de trazer. */
export const FAIXAS_DE_USO = [3, 20, 200] as const;

/**
 * O que seria um **compromisso mensal escrito** num arquivo que o git carrega.
 *
 * **Elas exigem o compromisso perto do dinheiro ou do prazo**, e não a palavra solta: `mensal`
 * aparece em *"custo mensal"* numa frase que **explica a regra**, e acusá-la seria medir
 * ortografia (D137) — a mesma lição que fez a régua da `margem` exigir dinheiro na mesma linha.
 */
export const COMPROMISSO_MENSAL = [
  /\b(?:assinatura|assinar|contratar|contratamos|plano)\b[^\n]{0,40}\b(?:mensal|por m[êe]s|\/m[êe]s)\b/i,
  /\bR\$\s*[\d.,]+\s*(?:por m[êe]s|\/\s*m[êe]s|mensais?)\b/i,
  /\bUS\$\s*[\d.,]+\s*(?:por m[êe]s|\/\s*m[êe]s|monthly|\/\s*month)\b/i,
  /\b(?:fran?quia|m[íi]nimo)\s+m[íi]nim[ao]?\b[^\n]{0,40}\bR\$/i,
  /\bfree trial\b[^\n]{0,40}\b(?:then|after)\b/i,
] as const;

/**
 * **O que esta guarda NÃO pega.** Declarado, porque o buraco é maior que a régua.
 *
 * *Guarda que não declara o próprio buraco mente pelo silêncio* — e a consequência nº 8 existe
 * exatamente porque este buraco não fecha com código.
 */
export const O_QUE_ISTO_NAO_GUARDA = [
  {
    oQue: "contratar de verdade",
    porQue:
      "acontece FORA da árvore — num navegador, com um cartão. Nenhuma régua daqui alcança, e " +
      "é por isso que a consequência nº 8 é de processo e não de código",
  },
  {
    oQue: "uma comparação de fonte paga sem as três faixas",
    porQue:
      "não há nenhuma comparação de fonte paga neste repositório hoje, então a régua das três " +
      "faixas não tem o que medir. Ela cobra a REGRA escrita, não um caso — e declarar isso é " +
      "melhor do que uma trava que aprova o vazio",
  },
  {
    oQue: "mensalidade contratada por OUTRO aplicativo da família",
    porQue:
      "este repositório só vê a própria árvore. A regra é da família; a guarda é deste app — " +
      "e dizer isso evita que alguém leia o verde daqui como verde da família",
  },
];
