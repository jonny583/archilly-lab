/**
 * ════════════════════════════════════════════════════════════════════════════
 *  REGRA DE FORMA SEM O SUJEITO ESCRITO MANDA NA COISA ERRADA. (Central, 08/10)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A §1 dizia *"no máximo 12 linhas"* **sem dizer de quê**, e eu li como teto do **bloco**. Os
 * quatro blocos do LAB-62 foram **obediência a uma regra mal escrita, não desobediência** — e
 * foi preciso o Jonny pedir **duas vezes** para o defeito aparecer.
 *
 * > **Toda regra de forma que põe um limite tem de dizer DE QUE é o limite**, na mesma frase.
 *
 * # O escopo, e ele é estreito de propósito
 *
 * A régua varre **só as seções de regra** da `CLAUDE.md` — não a §6, que é narrativa cheia de
 * número ("441 de 441", "9 + 2 + 3 = 14"), nem a citação literal da Central, que é **fonte** e
 * não regra minha. Varrer o documento inteiro faria a régua acusar prosa, que é o D137.
 *
 * E ela ignora frase que **cita a redação antiga** (`dizia`, `estava`, `era`): o registro de um
 * texto velho não é a regra em vigor, e acusá-lo é ler o **comentário** em vez do código (D155).
 */

/** As seções da `CLAUDE.md` onde mora REGRA de forma. Fora delas, número é narrativa. */
export const SECOES_DE_REGRA = ["## 1 ·", "## 1-A ·", "## 1-B ·", "## 4 ·", "## 5 ·", "## 7 ·"];

/** As palavras que anunciam um limite. Fechadas: palavra aberta acusaria o documento inteiro. */
export const PALAVRAS_DE_LIMITE = ["no máximo", "no mínimo", "teto", "limite de"] as const;

/** Numeral em algarismo ou por extenso, até vinte — a faixa que estas regras usam. */
const NUMERAL =
  /\b(?:\d+|um|uma|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|catorze|quinze|dezesseis|dezessete|dezoito|dezenove|vinte)\b/i;

/** Marcas de que a frase RELATA uma redação antiga em vez de prescrever. */
const RELATO = /\b(?:dizia|dizi(?:am)|estava|estavam|era|eram|foi|foram|até o LAB|até 0?\d\/\d)\b/i;

export interface LimiteSemSujeito {
  secao: string;
  palavra: string;
  frase: string;
}

/**
 * Tira do texto o que não é regra minha: a linha de citação (`>`) **e o bloco de código**.
 *
 * **Era só a citação até o LAB-81** (item 014). O bloco de código entrou porque ele era o buraco
 * comum às cinco leituras desta casa — e nas seções de regra da `CLAUDE.md` são **20 linhas**,
 * **17 delas na §1**: o MOLDE do recado, que é exemplo e não regra sobre o recado.
 *
 * *Medido antes de trocar, como o item manda:* o veredito de hoje é **vazio nas duas leituras**,
 * então a troca não mudou veredito nenhum — e a prova de que ela faz algo está nas travas, com a
 * regra sem sujeito **plantada dentro de um bloco de código**.
 *
 * Mora em `texto-das-regras.ts`, com as outras cinco e com a pergunta de cada uma escrita: *uma
 * régua que ninguém terminou* era o nome do problema (D259).
 */
export { soAProsa } from "./texto-das-regras.ts";

import { soAProsa } from "./texto-das-regras.ts";

/** As fatias do documento que são seção de regra, pela lista declarada acima. */
export function secoesDeRegra(claudeMd: string): { titulo: string; corpo: string }[] {
  const linhas = claudeMd.split("\n");
  const fatias: { titulo: string; corpo: string }[] = [];
  let atual: { titulo: string; corpo: string[] } | null = null;
  for (const linha of linhas) {
    if (linha.startsWith("## ")) {
      if (atual) fatias.push({ titulo: atual.titulo, corpo: atual.corpo.join("\n") });
      atual = SECOES_DE_REGRA.some((s) => linha.startsWith(s))
        ? { titulo: linha.trim(), corpo: [] }
        : null;
    } else if (atual) {
      atual.corpo.push(linha);
    }
  }
  if (atual) fatias.push({ titulo: atual.titulo, corpo: atual.corpo.join("\n") });
  return fatias;
}

/**
 * A frase **diz de quê** é o limite quando, depois da palavra de limite, vem um `de`/`do`/`da`
 * ligando a um substantivo — `teto **de doze linhas é do RECADO**`, `limite **de** linhas **do**
 * recado`. Sem isso, o leitor escolhe o sujeito, e foi assim que eu escolhi o bloco.
 */
export function dizDeQue(frase: string, palavra: string): boolean {
  const i = frase.toLowerCase().indexOf(palavra);
  if (i === -1) return false;
  const depois = frase.slice(i + palavra.length);
  /*
   * **O `de` que introduz a QUANTIDADE não é o que nomeia o sujeito**, e a primeira versão desta
   * régua não sabia disso: em `teto de doze linhas`, o `de` liga ao número. O sujeito aparece no
   * `de`/`do`/`da` seguinte — `é **do** RECADO`, `oito passos **do** verde`. Então vale qualquer
   * ligação cujo alvo **não** seja um numeral.
   */
  for (const m of depois.matchAll(/\bd[aoe]s?\s+(\S+)/gi)) {
    if (!NUMERAL.test(m[1]!)) return true;
  }
  return false;
}

/** Toda regra de forma com limite que NÃO diz de que é o limite. */
export function limitesSemSujeito(claudeMd: string): LimiteSemSujeito[] {
  const achados: LimiteSemSujeito[] = [];
  for (const { titulo, corpo } of secoesDeRegra(claudeMd)) {
    for (const frase of soAProsa(corpo).split(/(?<=[.!?:])\s+|\n\n/)) {
      const limpa = frase.replace(/\s+/g, " ").trim();
      if (limpa === "" || RELATO.test(limpa) || !NUMERAL.test(limpa)) continue;
      for (const palavra of PALAVRAS_DE_LIMITE) {
        if (!limpa.toLowerCase().includes(palavra)) continue;
        if (!dizDeQue(limpa, palavra)) {
          achados.push({ secao: titulo, palavra, frase: limpa.slice(0, 160) });
        }
      }
    }
  }
  return achados;
}
