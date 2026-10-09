/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A TRAVA FORTE É A ESTRUTURA, NÃO A PALAVRA. (item 006 da caixa de entrada)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A Pesquisa de Mercado mediu, e o chat trouxe:
 *
 * > **Não escreva "recusar mensalidade" numa conferência. Tire o campo onde a mensalidade
 * > caberia.** Campo que não existe não se esquece.
 *
 * Este arquivo responde as três perguntas do item **com medição**, não com opinião:
 *
 * 1. a minha trava é de **palavra** ou de **estrutura**? — e **quanto** a de palavra deixa
 *    passar, contado;
 * 2. existe neste aplicativo um **tipo** onde um valor mensal, uma franquia ou um mínimo
 *    caberiam? — e, se existir, o conserto é **tirar o campo**;
 * 3. há **condição de retorno** escrita sob a regra antiga, que fale de volume ou de ponto de
 *    equilíbrio?
 *
 * # O que medi, e o exemplo do item estava errado ao meu respeito
 *
 * O item diz que *"franquia mínima e teste grátis passam por qualquer varredura de texto"*. **Na
 * minha, não passam** — há padrão para os dois. Mas a **conclusão** dele está certa, e medida
 * fica **pior** do que ele escreveu: dos **doze** compromissos mensais de formato real abaixo, a
 * minha régua de palavra pega **quatro**. *O exemplo estava errado; a lição estava certa.*
 */

/** O que é um compromisso mensal de verdade, escrito como o mundo escreve. */
export const COMPROMISSOS_DE_FORMATO_REAL = [
  "assinatura mensal de R$ 400",
  "plano Starter: R$ 99/mês",
  "franquia mínima de R$ 100",
  "free trial, then US$ 20",
  "Starter plan: 1.000 consultas incluídas, renovação automática",
  "compromisso mínimo de 50 chamadas por mês",
  "contrato anual com faturamento recorrente",
  "US$ 10 de mínimo de faturamento no período",
  "o plano inclui 5.000 requisições; excedente cobrado à parte",
  "licença por assento, renovada automaticamente",
  "pacote pré-pago de créditos que expiram em 30 dias",
  "teste de 14 dias, cartão obrigatório",
] as const;

/**
 * **Um campo de recorrência DENTRO de um tipo** — e a diferença entre isto e procurar a palavra
 * no arquivo é o item 006 inteiro.
 *
 * Ela casa **declaração de campo** (`nome: tipo` ou `nome?: tipo`), não menção. É o que faz a
 * régua distinguir `assinatura: string` — que **neste repositório é a assinatura de
 * determinismo de uma rodada**, e aparece sete vezes — de um campo que guardaria mensalidade.
 * *Régua que casasse a palavra acusaria as sete* (D137).
 */
export const CAMPO_DE_RECORRENCIA =
  /^\s*(?:readonly\s+)?(mensalidade|valorMensal|precoMensal|custoMensal|franquia|franquiaMinima|minimoMensal|minimoFaturamento|recorrencia|recorrente|perMonth|monthlyPrice|monthlyFee|subscription|subscriptionId|billingCycle|trialEndsAt)\s*\??\s*:/;

/**
 * **`plano` e `planoId` SAÍRAM desta régua, e a razão é medição, não gosto.**
 *
 * A primeira versão os incluía — *plano* é palavra de cobrança em todo lugar — e ela acusou
 * `plano: Plano` em `testfit/adapter/src/volta.ts`, duas vezes: **o PLANO DE LOTEAMENTO**, que é
 * o objeto central deste repositório inteiro.
 *
 * > **A régua de ESTRUTURA não é imune ao defeito da régua de palavra.** "Campo que não existe
 * > não se esquece" é verdade; *campo cujo NOME eu adivinhei* tem a mesma doença — ela só se
 * > mudou de lugar, do texto para o identificador (D240).
 *
 * Por isso ela guarda só nomes que **não têm outro significado nesta casa**.
 */
export const NOMES_QUE_SAIRAM = ["plano", "planoId"] as const;

/** O campo que seria o par honesto: dinheiro **por evento**, como o da Pesquisa. */
export const CAMPO_POR_EVENTO = /^\s*(?:readonly\s+)?(custoPorChamada|precoPorEvento|porConsulta|porEstudo|unitPrice|pricePerCall)\s*\??\s*:/;

export interface AchadoDeEstrutura {
  arquivo: string;
  linha: number;
  campo: string;
}

/** Varre fontes à procura de **campo** de recorrência declarado num tipo. */
export function camposDeRecorrencia(
  fontes: { arquivo: string; texto: string }[],
): AchadoDeEstrutura[] {
  const achados: AchadoDeEstrutura[] = [];
  for (const f of fontes) {
    f.texto.split("\n").forEach((linha, i) => {
      const m = CAMPO_DE_RECORRENCIA.exec(linha);
      if (m) achados.push({ arquivo: f.arquivo, linha: i + 1, campo: m[1]! });
    });
  }
  return achados;
}

// ── A pergunta 3: condição de retorno escrita sob a regra antiga ───────────

/**
 * As condições declaradas na `FILA.md` — o vocabulário fechado com que uma proposta fica aberta.
 *
 * **`volume` sozinho não basta, e isto foi medido na primeira versão:** a régua casava
 * `se o volume` e acusou a linha da própria §6 — *"pergunte se o volume é da coisa ou da sua
 * régua"* —, que fala de **volume de acusação**, não de vendas. *Régua que casa a palavra mede
 * ortografia* (D137): agora o volume tem de vir **perto de pagar, compensar ou dinheiro**.
 *
 * O que o item procura é **condição que seja uma CONTA**: *"volta quando o volume pagar"*,
 * *"quando compensar"*, *"ponto de equilíbrio"*. *Condição de volta que contradiz regra de
 * família é condição que alguém vai cumprir sem perceber — achando que está obedecendo.*
 */
export const CONDICAO_DE_CONTA = [
  /\bvolta(?:r|rá)?\b[^\n]{0,40}\bquando\b[^\n]{0,40}\b(?:volume|pagar|compensar|receita|faturamento)\b/i,
  /\bquando\s+(?:o\s+)?volume\b[^\n]{0,40}\b(?:pagar|compensar|justificar|cobrir|receita|faturamento|R\$|US\$)/i,
  /\bquando\s+(?:passar\s+a\s+)?compensar\b/i,
  /\bponto\s+de\s+equil[íi]brio\b/i,
  /\bbreak.?even\b/i,
  /\bse\s+o\s+volume\b[^\n]{0,40}\b(?:pagar|compensar|justificar|cobrir|receita|faturamento|R\$|US\$)/i,
  /\ba\s+partir\s+de\s+\d+\s+(?:clientes|estudos|assinantes)\b/i,
] as const;

/** Uma condição de abertura declarada, como a `FILA.md` a escreve. */
export function condicoesDeclaradas(fila: string): string[] {
  return (fila.match(/aguardando-[a-z-]+|`(?:prompt-novo|nao-medido|escopo-novo|depois-do-mvp)`/g) ?? [])
    .map((c) => c.replace(/`/g, ""));
}

/** As linhas que trazem condição de CONTA — o que o item 006 manda procurar. */
export function condicoesDeConta(
  docs: { arquivo: string; texto: string }[],
): { arquivo: string; linha: number; trecho: string }[] {
  const achados: { arquivo: string; linha: number; trecho: string }[] = [];
  for (const d of docs) {
    d.texto.split("\n").forEach((linha, i) => {
      // **Uma linha conta UMA vez**, e não uma por padrão que casar: duas réguas mordendo a
      // mesma frase dariam duas condições onde há uma, e o número é o que o item 006 pede.
      if (CONDICAO_DE_CONTA.some((re) => re.test(linha))) {
        achados.push({ arquivo: d.arquivo, linha: i + 1, trecho: linha.trim().slice(0, 100) });
      }
    });
  }
  return achados;
}

/**
 * **A palavra que engana, medida aqui.** `assinatura` neste repositório é a **assinatura de
 * determinismo** de uma rodada do motor — e é o caso real que prova por que a régua de
 * estrutura casa campo e não palavra.
 */
export const A_PALAVRA_QUE_ENGANA = {
  palavra: "assinatura",
  oQueSignificaAqui:
    "a assinatura de determinismo de uma rodada do motor — o hash que prova que a mesma " +
    "semente devolve o mesmo plano",
  ondeMora: "external-engines/testfit/adapter/src/esteira.ts e ferramentas/medir.ts",
};
