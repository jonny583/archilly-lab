/**
 * A DÍVIDA TÉCNICA NÃO ENTRA NA PÁGINA DO JONNY — a outra metade do `CLAUDE.md` §5, que nunca teve
 * guarda. (LAB-137, item 900, a dívida própria, D365)
 *
 * # A regra, e o que se mediu em 16/10/2026
 *
 * O `CLAUDE.md` §5 diz: *"`docs/PENDENCIAS_JONNY.md` é escrito **para leigo**; item resolvido é
 * **marcado, nunca apagado**, e **dívida técnica não entra lá**"*. O alto da página repete: *"Dívida
 * técnica do código é minha e não entra nesta lista."* O LAB-124 pôs trava na metade *"marcado,
 * nunca apagado"* (`pendencias-marcadas.ts`); **a metade da dívida técnica ficou sem nenhuma**.
 *
 * Medido por mutação, não por leitura: na página de verdade, uma pendência nova
 * `## 20 · Refatorar \`src/forma.ts\` e subir a cobertura dos testes`, declarada na lista do
 * LAB-124 como `aberta` — e a suíte inteira da esteira deu as **mesmas** falhas de antes (as nove do
 * `.wasm`), mais as duas provas que contam linhas da árvore (LAB-52, LAB-57), que reprovam com
 * qualquer mudança em `src/` e não falam da regra. Nenhuma trava perguntava *de quem* era a
 * pendência. A régua do LAB-124 até ajudava a dívida a entrar: pedia que ela fosse **declarada**, e
 * declarada ela passava.
 *
 * Por LUGAR, a página de hoje: as **19** pendências numeradas, lidas uma a uma — **nenhuma é dívida
 * técnica**. Dezesseis são das cinco classes que param (catorze de urbanismo ou negócio, a §8 de
 * dinheiro, a §11 de segurança); três são aviso (§5, §6, §9-C), e as três dizem, na própria seção,
 * que não são pergunta. A regra estava cumprida por disciplina — como a *"nunca apagado"* estava no
 * LAB-124.
 *
 * # O que a régua cobra — pela estrutura, não pela palavra
 *
 * O LAB-73 (D239, `trava-de-estrutura.ts`) mediu que trava de palavra deixa passar oito de doze
 * compromissos, e a resposta foi *"não há onde"*. Aqui é o mesmo desenho: a declaração do LAB-124
 * ganhou o campo **`dono`** (`DonoDaPendencia`), cujos valores são **as cinco classes que param**, da
 * `COMO_FUNCIONA.md`, e o `informe`. **Não existe valor para dívida técnica.** Quem quiser pôr uma na
 * página tem de escrever, numa linha revisável, que ela *gasta dinheiro*, *não tem volta*, *muda
 * promessa*, *toca segurança* ou *é urbanismo* — e a mentira fica à vista de quem revisa, em vez de
 * passar calada.
 *
 * 1. **pergunta tem classe** — pendência `aberta`, `parada` ou `resolvida` não pode ser `informe`:
 *    pergunta ao Jonny é pergunta por uma das cinco razões, ou não é dele (`pergunta-sem-classe`);
 * 2. **o informe se diz informe** — o aviso declarado `informe` tem de dizer, no título ou no
 *    primeiro parágrafo da seção, que não é pergunta (*"não é pendência sua"*, *"não depende de
 *    você"*, *"não é pergunta"*); o leigo que abre a seção não lê a declaração (`informe-sem-aviso`);
 * 3. **título para leigo** — nenhum título numerado traz caminho de código ou palavra de oficina
 *    (`src/`, `tests/`, `.ts`, `.json`, *refatorar*, *typecheck*, *lint*, *cobertura de teste*):
 *    é o sintoma de dívida técnica que a palavra **alcança**, e a página é escrita para leigo
 *    (`titulo-de-oficina`);
 * 4. **as cinco são as da `COMO_FUNCIONA.md`** — a lista numerada de *"O que você NÃO faz
 *    sozinho"* tem cinco itens, e cada classe de `DonoDaPendencia` tem a sua palavra num deles, e
 *    num só; se a página do protocolo mudar as classes, o tipo tem de mudar junto
 *    (`classes-divergem`).
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se a classe declarada é a verdadeira.** É o mesmo limite do LAB-124: a régua impede que a
 *   página e a declaração divirjam, e impede o valor *"é minha"*; não impede que alguém declare
 *   *urbanismo* para uma refatoração. Contra isso, a defesa é a linha estar escrita, com a fonte, num
 *   lugar que se revisa;
 * - **o corpo das seções** além do primeiro parágrafo do informe — uma seção de urbanismo pode citar
 *   um arquivo de código no meio do relato (a §7 cita, e é relato de medição);
 * - **a §6 e o que ela carrega.** Ela é aviso do que o laboratório descobriu nos **outros**
 *   aplicativos — dívida técnica, sim, mas do Generate e do Geo, não *"do código"* daqui, que é o que
 *   a página exclui. Se ela deve continuar ali é pergunta de forma, e foi **proposta ao chat**
 *   (LAB-137), não decidida por mim;
 * - **as seções sem número** (a nota de 12/10, *"Em cinco minutos"*, *"Já resolvidos"*): a primeira
 *   é relato de respostas, a segunda tem a régua do LAB-125, a terceira a do LAB-124.
 */
import type { DeclaracaoDePendencia, DonoDaPendencia } from "./pendencias-marcadas.ts";
import { PENDENCIAS, lerOsTitulos } from "./pendencias-marcadas.ts";

/** A regra, como o `CLAUDE.md` §5 a escreve — o teste confere que ela continua lá. */
export const A_REGRA = "dívida técnica não entra lá";

/** As classes que param, cada uma com a palavra que a identifica na lista da `COMO_FUNCIONA.md`. */
export const PALAVRA_DA_CLASSE: Readonly<Record<Exclude<DonoDaPendencia, "informe">, string>> = {
  dinheiro: "dinheiro",
  "sem-volta": "não se desfaz",
  promessa: "promessa",
  seguranca: "segurança",
  "urbanismo-ou-negocio": "urbanismo",
};

/** O que o aviso declarado `informe` tem de dizer, na seção, para o leigo. */
const DIZ_QUE_NAO_E_PERGUNTA = /não é pendência sua|não depende de você|não é pergunta/i;

/** Caminho de código ou palavra de oficina — o sintoma de dívida técnica que a palavra alcança. */
const OFICINA = /\bsrc\/|\btests?\/|\.(?:ts|js|json|ya?ml|sh)\b|refator|typecheck|\blint\b|cobertura d[eo]s? testes?/i;

export function eTituloDeOficina(titulo: string): boolean {
  return OFICINA.test(titulo);
}

/**
 * O título e o primeiro parágrafo de uma seção numerada, sem o negrito (`**não** depende` é
 * `não depende`). `null` se o número não está na página.
 */
export function lerOAlto(pagina: string, numero: string): string | null {
  const titulos = lerOsTitulos(pagina);
  const t = titulos.find((x) => x.numero === numero);
  if (!t) return null;
  const linhas = pagina.split("\n").slice(t.linha); // depois do título
  const corpo: string[] = [];
  let comecou = false;
  for (const l of linhas) {
    if (l.startsWith("#")) break;
    if (l.trim() === "") {
      if (comecou) break;
      continue;
    }
    comecou = true;
    corpo.push(l);
  }
  return `${t.titulo}\n${corpo.join(" ")}`.replaceAll("**", "");
}

/** Os itens da lista numerada de *"O que você NÃO faz sozinho"*. `null` se a seção sumiu. */
export function lerAsCincoClasses(comoFunciona: string): string[] | null {
  const linhas = comoFunciona.split("\n");
  const ini = linhas.findIndex((l) => l.startsWith("## O que você NÃO faz sozinho"));
  if (ini < 0) return null;
  const itens: string[] = [];
  for (const l of linhas.slice(ini + 1)) {
    if (l.startsWith("## ")) break;
    if (/^\d+\. /.test(l)) itens.push(l);
    else if (itens.length > 0 && /^\s{2,}\S/.test(l)) itens[itens.length - 1] += ` ${l.trim()}`;
  }
  return itens;
}

export type TipoDeProblemaDoDono =
  | "pergunta-sem-classe"
  | "informe-sem-aviso"
  | "titulo-de-oficina"
  | "classes-divergem";

export interface ProblemaDoDono {
  tipo: TipoDeProblemaDoDono;
  onde: string;
}

/**
 * Confere a página do Jonny e a lista das cinco classes contra a declaração. Nunca lança: a lista
 * sumida é um problema, não um verde.
 */
export function conferirODono(
  pagina: string,
  comoFunciona: string,
  pendencias: readonly DeclaracaoDePendencia[] = PENDENCIAS,
): { pendencias: number; porDono: Record<string, number>; titulos: number; problemas: ProblemaDoDono[] } {
  const problemas: ProblemaDoDono[] = [];
  const porDono: Record<string, number> = {};

  for (const p of pendencias) {
    porDono[p.dono] = (porDono[p.dono] ?? 0) + 1;
    if (p.dono === "informe") {
      if (p.estado !== "aviso") {
        problemas.push({ tipo: "pergunta-sem-classe", onde: p.numero });
        continue;
      }
      const alto = lerOAlto(pagina, p.numero);
      // a seção sumida é da régua do LAB-124 (`apagada`); aqui só se lê o que existe
      if (alto !== null && !DIZ_QUE_NAO_E_PERGUNTA.test(alto)) {
        problemas.push({ tipo: "informe-sem-aviso", onde: p.numero });
      }
    }
  }

  const titulos = lerOsTitulos(pagina);
  for (const t of titulos) {
    if (eTituloDeOficina(t.titulo)) problemas.push({ tipo: "titulo-de-oficina", onde: t.numero });
  }

  const classes = lerAsCincoClasses(comoFunciona);
  if (classes === null || classes.length !== 5) {
    problemas.push({ tipo: "classes-divergem", onde: `${classes?.length ?? 0} itens na lista` });
  } else {
    for (const [dono, palavra] of Object.entries(PALAVRA_DA_CLASSE)) {
      const onde = classes.filter((c) => c.toLowerCase().includes(palavra.toLowerCase()));
      if (onde.length !== 1) problemas.push({ tipo: "classes-divergem", onde: `${dono}: ${onde.length}` });
    }
  }

  return { pendencias: pendencias.length, porDono, titulos: titulos.length, problemas };
}
