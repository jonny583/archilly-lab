/**
 * A PERGUNTA QUE É DELE VAI COM "O QUE FAZER / ONDE / COMO SABER QUE DEU CERTO" — a terceira coisa
 * da lista do protocolo da caixa, e a única das três que nunca teve guarda.
 * (LAB-165, item 900, a dívida própria, D393)
 *
 * # A regra, e o defeito medido em 18/10/2026
 *
 * O protocolo desta sessão (`docs/caixa-de-entrada/COMO_FUNCIONA.md`, seção *"A RESPOSTA INTEIRA VAI
 * PARA O ARQUIVO"*) diz: *"A pergunta que é dele. Vai para `docs/PENDENCIAS_JONNY.md`, em português
 * de leigo, com o que fazer / onde / como saber que deu certo."* A página tem três travas (LAB-124:
 * o título marcado; LAB-125: o resumo do alto; LAB-137: o dono da pendência), e **nenhuma** pergunta
 * pelas três partes — o LAB-164 procurou a frase e o assunto em `src/` e `tests/`, e o `grep` voltou
 * vazio.
 *
 * Medido por mutação, antes de escrever a régua: tirar da página os dois primeiros passos da §11 (o
 * *"o que fazer"* da senha), a tabela dos três caminhos da §10 e o *"Onde olhar"* da §7 derrubou
 * **um** teste da suíte inteira — o do LAB-155, e só porque o *"Onde olhar"* levava dois endereços
 * desta casa que ele conta. Os passos da senha e os caminhos da esquina saíram em silêncio.
 *
 * E lida por LUGAR — as pendências que pedem alguma coisa a ele, que são as **abertas** e as
 * **paradas** de {@link PENDENCIAS} (as paradas voltam a ele quando o Lab entrar no Generate) —, são
 * **cinco**: 5-B, 7, 8, 10 e 11. A §8 diz no próprio corpo que *"não é pergunta e não trava nada"*.
 * Das outras quatro, **nenhuma** dizia *como saber que deu certo*; a §11 tinha o *o que fazer* e o
 * *onde* (três passos, dois endereços), a §7 e a §10 tinham as opções espalhadas em tabelas, e a 5-B
 * só a frase *"até você dizer 'é isso' ou dar outro número"*. **Regra verdadeira pela metade, guarda
 * ausente.**
 *
 * # O que a régua cobra
 *
 * As três partes não se procuram por frase (D137: régua de palavra mede ortografia). Elas moram num
 * **bloco de forma fixa**, escrito uma vez em cada pendência que pede, e a régua lê a forma:
 *
 * ```md
 * > **O que fazer, onde e como saber que deu certo**
 * > - **o que fazer:** …
 * > - **onde:** …
 * > - **como saber que deu certo:** …
 * ```
 *
 * 1. **toda pendência aberta ou parada tem o bloco** no corpo dela — do título até o próximo título
 *    numerado ou o próximo `## ` —, a menos que esteja em {@link NAO_PEDEM} (`sem-bloco`);
 * 2. **as três partes estão no bloco, uma vez cada, com conteúdo** — pelo menos
 *    {@link CONTEUDO_MINIMO} caracteres depois do rótulo; o traço sozinho não é parte
 *    (`falta-o-que-fazer`, `falta-onde`, `falta-como-saber`, `parte-repetida`);
 * 3. **o sentido de volta: a resolvida e o aviso não têm bloco** — pedir ação sobre o que já se
 *    respondeu é a mesma página dizendo duas coisas, o defeito do LAB-124 do outro lado
 *    (`bloco-em-quem-nao-pede`);
 * 4. **a exceção se confere, não se obedece**: a pendência de {@link NAO_PEDEM} existe, está aberta
 *    ou parada, traz no corpo o trecho que diz que não pede, e não tem bloco (`excecao-desconhecida`,
 *    `excecao-sem-trecho`, `excecao-com-bloco`);
 * 5. **nenhum bloco solto**: o bloco fora do corpo de uma pendência numerada (no resumo do alto, na
 *    lista dos resolvidos) é pedido sem dono (`bloco-solto`);
 * 6. **o universo não é vazio** — página sem título numerado é acusada, não aprovada
 *    (`universo-vazio`).
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se o texto é de leigo.** A régua lê a forma; *"português de leigo"* é juízo, e a do LAB-155
 *   cobra a única palavra que dá para cobrar (o nome interno);
 * - **se o lugar e a prova são verdadeiros.** Ela impede o bloco de faltar ou de vir pela metade —
 *   não que o *"como saber"* esteja certo. Quem o escreve é a sessão, e quem confere é quem lê;
 * - **o corpo fora do bloco.** As tabelas e os passos que já existiam ficam como estavam; o bloco
 *   aponta para eles;
 * - **o estado da pendência.** Ele vem de {@link PENDENCIAS} — um lugar só para o estado, como na
 *   tabela do LAB-125.
 */
import { lerOsTitulos, PENDENCIAS, type DeclaracaoDePendencia } from "./pendencias-marcadas.ts";

/** A regra, como o protocolo da caixa a escreve — a nota do LAB-165 no `COMO_FUNCIONA.md` aponta para cá. */
export const A_REGRA = "com o que fazer / onde / como saber que deu certo";

/** A linha que abre o bloco. */
export const CABECA_DO_BLOCO = "> **O que fazer, onde e como saber que deu certo**";

/** As três partes, na ordem em que o protocolo as diz, com o rótulo que abre cada linha do bloco. */
export const PARTES = [
  { parte: "o-que-fazer", rotulo: "> - **o que fazer:**" },
  { parte: "onde", rotulo: "> - **onde:**" },
  { parte: "como-saber", rotulo: "> - **como saber que deu certo:**" },
] as const;

export type Parte = (typeof PARTES)[number]["parte"];

/** Menos do que isto depois do rótulo não é parte — é o lugar da parte, vazio. */
export const CONTEUDO_MINIMO = 15;

export interface PendenciaQueNaoPede {
  /** o número em {@link PENDENCIAS} */
  numero: string;
  /** o trecho do corpo que diz que ela não pede nada — conferido lá */
  trecho: string;
  motivo: string;
}

/**
 * As abertas ou paradas que **não pedem** nada a ele, cada uma com o trecho do corpo que o diz.
 * **Fechada nos dois sentidos**: a exceção que sobra (pendência resolvida, ou que ganhou bloco) é
 * acusada.
 */
export const NAO_PEDEM: readonly PendenciaQueNaoPede[] = [
  {
    numero: "8",
    trecho: "Isto não é pergunta e não trava nada",
    motivo:
      "é gasto futuro, posto na página para ele saber antes de chegar (dono: dinheiro); não há o que fazer hoje — " +
      "a obra só vale quando houver a primeira fonte paga, e este laboratório não usa nenhuma",
  },
];

export interface CorpoDaPendencia {
  numero: string;
  /** a linha do título, contada de 1 */
  linha: number;
  /** as linhas do corpo, sem o título */
  corpo: string[];
}

const TITULO_NUMERADO = /^#{2,3} \d+(?:-[A-Z])? · /;

/** O corpo de cada pendência numerada: do título até o próximo título numerado ou o próximo `## `. */
export function lerOsCorpos(pagina: string): CorpoDaPendencia[] {
  const linhas = pagina.split("\n");
  return lerOsTitulos(pagina).map((t) => {
    const corpo: string[] = [];
    for (const l of linhas.slice(t.linha)) {
      if (TITULO_NUMERADO.test(l) || l.startsWith("## ")) break;
      corpo.push(l);
    }
    return { numero: t.numero, linha: t.linha, corpo };
  });
}

export interface BlocoLido {
  /** quantas cabeças de bloco o corpo tem */
  cabecas: number;
  /** para cada parte, o conteúdo de cada linha dela achada no bloco */
  partes: Record<Parte, string[]>;
}

/** O bloco de um corpo: a cabeça e as linhas `>` coladas embaixo dela. `null` se o corpo não tem cabeça. */
export function lerOBloco(corpo: readonly string[]): BlocoLido | null {
  const partes: Record<Parte, string[]> = { "o-que-fazer": [], onde: [], "como-saber": [] };
  let cabecas = 0;
  corpo.forEach((l, i) => {
    if (l.trimEnd() !== CABECA_DO_BLOCO) return;
    cabecas++;
    for (const b of corpo.slice(i + 1)) {
      if (!b.startsWith(">")) break;
      for (const p of PARTES) if (b.startsWith(p.rotulo)) partes[p.parte].push(b.slice(p.rotulo.length).trim());
    }
  });
  return cabecas === 0 ? null : { cabecas, partes };
}

export type TipoDeProblemaDoPedido =
  | "universo-vazio"
  | "sem-bloco"
  | "falta-o-que-fazer"
  | "falta-onde"
  | "falta-como-saber"
  | "parte-repetida"
  | "bloco-em-quem-nao-pede"
  | "excecao-desconhecida"
  | "excecao-sem-trecho"
  | "excecao-com-bloco"
  | "bloco-solto";

export interface ProblemaDoPedido {
  tipo: TipoDeProblemaDoPedido;
  /** o número da pendência, ou a linha do bloco solto */
  onde: string;
}

const FALTA: Record<Parte, TipoDeProblemaDoPedido> = {
  "o-que-fazer": "falta-o-que-fazer",
  onde: "falta-onde",
  "como-saber": "falta-como-saber",
};

/**
 * Confere a página. Nunca lança; página sem pendência numerada é `universo-vazio`, não um verde.
 * Devolve o universo que leu — quantas pedem, quantas com bloco, quantas por exceção.
 */
export function conferirOQueFazerOndeComoSaber(
  pagina: string,
  pendencias: readonly DeclaracaoDePendencia[] = PENDENCIAS,
  naoPedem: readonly PendenciaQueNaoPede[] = NAO_PEDEM,
): { pendencias: number; pedem: number; comBloco: number; porExcecao: number; problemas: ProblemaDoPedido[] } {
  const problemas: ProblemaDoPedido[] = [];
  const corpos = lerOsCorpos(pagina);
  if (corpos.length === 0) {
    return { pendencias: 0, pedem: 0, comBloco: 0, porExcecao: 0, problemas: [{ tipo: "universo-vazio", onde: "docs/PENDENCIAS_JONNY.md" }] };
  }
  const estado = new Map(pendencias.map((p) => [p.numero, p.estado]));
  const excecao = new Map(naoPedem.map((e) => [e.numero, e]));

  for (const e of naoPedem) {
    const s = estado.get(e.numero);
    if (s !== "aberta" && s !== "parada") problemas.push({ tipo: "excecao-desconhecida", onde: e.numero });
  }

  let pedem = 0;
  let comBloco = 0;
  let porExcecao = 0;
  for (const c of corpos) {
    const s = estado.get(c.numero);
    const bloco = lerOBloco(c.corpo);
    const pede = s === "aberta" || s === "parada";
    if (!pede) {
      if (bloco) problemas.push({ tipo: "bloco-em-quem-nao-pede", onde: c.numero });
      continue;
    }
    pedem++;
    const e = excecao.get(c.numero);
    if (e) {
      porExcecao++;
      if (!c.corpo.join("\n").includes(e.trecho)) problemas.push({ tipo: "excecao-sem-trecho", onde: c.numero });
      if (bloco) problemas.push({ tipo: "excecao-com-bloco", onde: c.numero });
      continue;
    }
    if (!bloco) {
      problemas.push({ tipo: "sem-bloco", onde: c.numero });
      continue;
    }
    comBloco++;
    if (bloco.cabecas > 1) problemas.push({ tipo: "parte-repetida", onde: `${c.numero}:cabeça` });
    for (const p of PARTES) {
      const achadas = bloco.partes[p.parte];
      if (achadas.length > 1) problemas.push({ tipo: "parte-repetida", onde: `${c.numero}:${p.parte}` });
      if (!achadas.some((a) => a.replace(/[—–\-\s.]/g, "").length >= CONTEUDO_MINIMO))
        problemas.push({ tipo: FALTA[p.parte], onde: c.numero });
    }
  }

  // O sentido do universo: toda cabeça da página está no corpo de uma pendência. A pergunta é pela
  // LINHA (o corpo da pendência é um intervalo de linhas), não pela contagem.
  const dentro = new Set<number>();
  for (const c of corpos) for (let k = 1; k <= c.corpo.length; k++) dentro.add(c.linha + k);
  pagina.split("\n").forEach((l, i) => {
    if (l.trimEnd() === CABECA_DO_BLOCO && !dentro.has(i + 1)) problemas.push({ tipo: "bloco-solto", onde: `linha ${i + 1}` });
  });

  return { pendencias: corpos.length, pedem, comBloco, porExcecao, problemas };
}
