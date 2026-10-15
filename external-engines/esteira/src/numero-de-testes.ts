/**
 * O TAMANHO DE UMA SUÍTE NÃO SE ESCREVE NUMA PÁGINA VIVA. (LAB-115, item 900, D342)
 *
 * # O defeito, medido em 15/10/2026
 *
 * Com a caixa só no `900` e a FILA sem proposta que não espere ninguém, fui à dívida própria,
 * espécie **número digitado à mão**, nas páginas que as séries anteriores não leram: os
 * `README.md`. Enumerados por LUGAR — os 31 `.md` versionados fora de relato —, a frase
 * *"&lt;número&gt; testes"* aparece em quatro lugares de três páginas, e **três dos quatro estavam
 * errados, sem trava nenhuma**:
 *
 * | página | escrito | contado (`bun test`) | escrito em |
 * |---|---|---|---|
 * | `external-engines/esteira/README.md` | **93 testes** | **1 164** (1 155 + 9 do `.wasm`) | 19/09 (LAB-13/14) |
 * | `external-engines/testfit/README.md`, tabela | **14 testes** | **17** | 13/09 (LAB-07) |
 * | `external-engines/testfit/README.md`, receita | **14 testes, ~3 s** | **17** | idem |
 * | `entrega/registro-de-motores/README.md` | **22 testes** | **22** — certo, e sem trava | 20/09 (LAB-06) |
 *
 * A trava do LAB-98 (`contar-as-travas.test.ts`) reconta **as travas do portão**, nas cinco
 * cópias que ela conhece; as do LAB-101 e do LAB-102 leem **passos** e **estado do CI**. Nenhuma
 * lia o tamanho de uma suíte escrito numa página — e o README do pacote principal dizia o
 * mesmo número desde 19/09, enquanto a suíte crescia por baixo dele.
 *
 * # Por que a frase SAI, em vez de ganhar uma recontagem
 *
 * Recontar exigiria rodar a suíte dentro da suíte (é por isso que a trava do LAB-98 fica fora do
 * portão), e o número muda **em toda rodada** desta casa. Quem diz quantos são é a linha
 * *"Ran N tests"* do `bun test`, que é medição; a página diz **o que** os testes cobram. *Sem frase
 * honesta, a frase sai* (regra 22 da Central, a mesma forma).
 *
 * # O que este módulo faz
 *
 * - {@link contagensDeTestes} — acha, num texto, *"&lt;número&gt; testes"*, em algarismo (com
 *   separador de milhar) ou por extenso de *dois* em diante, atravessando o negrito; **não** acha o
 *   número de seção (*"15. TESTES OBRIGATÓRIOS"*), nem *"um teste"* (artigo, não contagem).
 * - {@link conferirAsContagens} — nos `.md` vivos (relato pela MESMA definição do LAB-102,
 *   `ehRelato`, D231), toda contagem achada reprova, salvo exceção declarada com o motivo; e **toda
 *   exceção tem de continuar achada** (os dois sentidos). Publica o universo lido.
 *
 * # O que ele NÃO alcança, dito
 *
 * - **comentário de código** (`.ts`): os cabeçalhos de teste dizem *"quatro travas"* do próprio
 *   arquivo, ao lado das quatro — outra pergunta, e outra régua;
 * - **travas** e **passos**: são das réguas do LAB-98 e do LAB-101;
 * - a contagem com **outra palavra** (*"dezessete casos"*, *"17 verificações"*): régua de palavra
 *   não pega o que não reconhece;
 * - **relato datado**: verdadeiro na data, e não se reescreve.
 */
import { ehRelato } from "./o-ci-que-roda.ts";

const POR_EXTENSO =
  "dois|duas|três|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|catorze|quatorze|quinze|" +
  "dezesseis|dezessete|dezoito|dezenove|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem";

/**
 * O número, colado à palavra. Algarismo com milhar (`1 164`, `1.164`) ou por extenso. O olhar
 * para trás deixa de fora o `110` de dentro de `D110`; o número de seção (`15. TESTES`) já fica
 * fora porque o espaço tem de vir colado ao número (uma mutação de 15/10 mostrou que um olhar para
 * a frente ali era neutro, e ele saiu).
 */
const CONTAGEM = new RegExp(
  `(?<![\\w.])(\\d{1,3}(?:[.\\u00a0\\u202f ]\\d{3})+|\\d+|${POR_EXTENSO})\\s+testes\\b`,
  "giu",
);

/** Uma contagem achada, com a linha (1-based). */
export interface Contagem {
  arquivo: string;
  linha: number;
  trecho: string;
}

/** Acha as contagens de testes num texto; o `**` sai, para o negrito não esconder a frase. */
export function contagensDeTestes(arquivo: string, texto: string): Contagem[] {
  const achadas: Contagem[] = [];
  texto.split("\n").forEach((l, i) => {
    for (const m of l.replace(/\*\*/g, "").matchAll(CONTAGEM)) {
      achadas.push({ arquivo, linha: i + 1, trecho: m[0].replace(/\s+/g, " ") });
    }
  });
  return achadas;
}

/**
 * As contagens achadas que NÃO são o tamanho de uma suíte, com o motivo. As duas dizem quantas
 * peças um desenho datado tem — o LAB-26 (D108) pôs **dois** testes de varredura ao lado da ficha
 * de capacidades —, e não o tamanho da suíte de um pacote.
 */
export const EXCECOES: readonly { arquivo: string; trecho: string; porque: string }[] = [
  {
    arquivo: "docs/INDEX.md",
    trecho: "dois testes",
    porque: "a linha do LAB-26: as duas peças do desenho de D108, não o tamanho de uma suíte",
  },
  {
    arquivo: "docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md",
    trecho: "dois testes",
    porque: "o mesmo desenho do LAB-26 (D108), descrito na análise: peças, não tamanho de suíte",
  },
];

/** Um arquivo da árvore, com o texto dele. */
export interface ArquivoLido {
  arquivo: string;
  texto: string;
}

/** O que a conferência devolve. */
export interface ConferenciaDasContagens {
  /** Quantos `.md` vivos a régua leu — o universo, publicado. */
  lidos: number;
  /** Quantos ficaram fora por serem relato. */
  deRelato: number;
  /** Contagens fora de relato e fora das exceções. */
  digitadas: Contagem[];
  /** Exceções declaradas cujo trecho a régua não achou mais. */
  excecoesMortas: string[];
}

/** Só `.md`: é onde a página diz o tamanho da suíte a quem lê. */
export const EXTENSAO_LIDA = ".md";

export function conferirAsContagens(
  arvore: readonly ArquivoLido[],
  excecoes: typeof EXCECOES = EXCECOES,
): ConferenciaDasContagens {
  const md = arvore.filter((a) => a.arquivo.endsWith(EXTENSAO_LIDA));
  const vivos = md.filter((a) => !ehRelato(a.arquivo));
  const achadas = vivos.flatMap((a) => contagensDeTestes(a.arquivo, a.texto));
  const casa = (e: { arquivo: string; trecho: string }, c: Contagem) =>
    e.arquivo === c.arquivo && e.trecho.toLowerCase() === c.trecho.toLowerCase();
  return {
    lidos: vivos.length,
    deRelato: md.length - vivos.length,
    digitadas: achadas.filter((c) => !excecoes.some((e) => casa(e, c))),
    excecoesMortas: excecoes
      .filter((e) => !achadas.some((c) => casa(e, c)))
      .map((e) => `${e.arquivo} · "${e.trecho}"`),
  };
}
