/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O VEREDITO NÃO CONTRADIZ A EVIDÊNCIA AO LADO.
 *  (LAB-109, item 900 — proposta do LAB-108: a coerência do veredito com a evidência, D336)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-108 (D335) perguntou aos vereditos booleanos das provas *"a evidência está ao lado?"* e
 * achou que `limpo`, `aceito` e `confere` a guardam — e que, **recalculados**, batem com ela em
 * **392 de 392**. Mas nada cobrava isso: um `"limpo": true` ao lado de `"violacoes": 3` passava
 * todas as travas. É a outra pergunta — **a evidência contradiz o veredito?** — e uma prova que se
 * contradiz é pior do que uma que se cala, porque as duas metades parecem medidas.
 *
 * Medido por LUGAR, no mesmo universo do D330 e do D335 — todo `.json` versionado em `docs/`, **100
 * arquivos** —, os **404** campos com esses três nomes caem em **sete formas**, e a forma decide a
 * regra:
 *
 * | veredito | a evidência ao lado | a regra | campos | `true` / `false` vistos |
 * |---|---|---|---|---|
 * | `limpo` | `violacoes` (número) | `limpo ⇔ violacoes === 0` | 151 | os dois |
 * | `aceito` | `violacoes` (número) | `aceito ⇔ violacoes === 0` | 92 | os dois |
 * | `aceito` | `recusa` (lista) | `aceito ⇔ recusa vazia` | 13 | só `false` |
 * | `aceito` | `lotes` (número ou nulo), sem `violacoes` | `aceito ⇔ lotes !== null` | 66 | os dois |
 * | `confere` | `agregadoPublicado` e `agregadoRefeitoDosCrus` | `confere ⇔ os dois iguais` (igualdade profunda, chaves em ordem) | 56 | só `true` |
 * | `confere` | `confrontoPublicado` e `confrontoRefeitoDosCrus` | idem | 14 | só `true` |
 * | `limpo` do clone vizinho | `commit`, `origemMain`, `repo` | **nenhuma**: a evidência de *limpo* é a saída vazia do `git status`, que não se grava (D335) | 12 | só `true` |
 *
 * As seis primeiras são **regras**; a sétima é **forma sem regra declarada**, com o motivo. E o
 * **nulo** passa como *não medido* (D23) — nenhum na árvore hoje, mas `src/passagens-dos-legais.ts`
 * declara `aceito: boolean | null` para a passagem sem relatório, e o nulo ali é a verdade, não um
 * defeito: *o caso válido que quase parece inválido*. Campo com um dos três nomes que não cai em
 * nenhuma das sete, e não é nulo, **reprova** — senão a forma nova nasceria
 * fora da régua, e a régua continuaria verde *"porque não achou nada"* (D263).
 *
 * # O que esta régua NÃO alcança, dito
 *
 * - **o outro sentido da evidência**: `violacoes: 0` errado com `limpo: true` passa — a régua cobra
 *   que as duas metades concordem, não que a contagem esteja certa;
 * - vereditos com **outro nome** (`semPlano`, `divergem`, `saoIguais`…) — os três desta régua são os
 *   que o LAB-103 nomeou e o LAB-108 mediu;
 * - o `false` de `confere` e o `true` de `aceito`-por-recusa **nunca apareceram** na árvore: a regra
 *   está provada nesse lado só por caso sintético, na trava;
 * - as ferramentas que gravam esses campos: a régua lê a prova gravada, não o código que a produz.
 *   O código foi medido no LAB-110 (D337): doze lugares, e o único com outra definição do
 *   veredito era o `confere` do `lab39` — agora ele chama {@link mesmoValor}, a mesma desta régua.
 */

import { canonico, mesmoValor } from "./mesmo-valor.ts";

/** Os três nomes de veredito que o LAB-103 nomeou e o LAB-108 mediu. */
export const VEREDITOS = ["limpo", "aceito", "confere"] as const;
export type Veredito = (typeof VEREDITOS)[number];

type Objeto = Record<string, unknown>;

/**
 * Igualdade profunda com as chaves em ordem — a mesma que o LAB-108 usou para recalcular. Desde o
 * LAB-110 (D337) ela mora em `mesmo-valor.ts`, e a ferramenta que GRAVA o `confere` (`lab39`) e a
 * trava que confere aquela prova chamam a mesma: o veredito tem uma definição só.
 */
export { canonico };

export interface RegraDeCoerencia {
  /** O nome da regra, que vai no relatório e na mensagem da trava. */
  nome: string;
  veredito: Veredito;
  /** A forma: este objeto traz a evidência que a regra lê? */
  aplica: (o: Objeto) => boolean;
  /** O veredito que a evidência dá. */
  esperado: (o: Objeto) => boolean;
}

/**
 * **As regras, na ordem em que se tentam.** A primeira que se aplica decide — e a ordem importa num
 * caso só: `aceito` com `violacoes` **e** `lotes` (LAB-07, LAB-93) é julgado pelas violações, que é
 * o que o Validator decide; o `lotes` ali é contagem, não veredito.
 */
export const REGRAS_DE_COERENCIA: readonly RegraDeCoerencia[] = [
  {
    nome: "limpo ⇔ violacoes === 0",
    veredito: "limpo",
    aplica: (o) => typeof o["violacoes"] === "number",
    esperado: (o) => o["violacoes"] === 0,
  },
  {
    nome: "aceito ⇔ violacoes === 0",
    veredito: "aceito",
    aplica: (o) => typeof o["violacoes"] === "number",
    esperado: (o) => o["violacoes"] === 0,
  },
  {
    nome: "aceito ⇔ recusa vazia",
    veredito: "aceito",
    aplica: (o) => Array.isArray(o["recusa"]),
    esperado: (o) => (o["recusa"] as unknown[]).length === 0,
  },
  {
    nome: "aceito ⇔ lotes !== null",
    veredito: "aceito",
    aplica: (o) => "lotes" in o && (o["lotes"] === null || typeof o["lotes"] === "number"),
    esperado: (o) => o["lotes"] !== null,
  },
  {
    nome: "confere ⇔ agregadoPublicado = agregadoRefeitoDosCrus",
    veredito: "confere",
    aplica: (o) => "agregadoPublicado" in o && "agregadoRefeitoDosCrus" in o,
    esperado: (o) => mesmoValor(o["agregadoPublicado"], o["agregadoRefeitoDosCrus"]),
  },
  {
    nome: "confere ⇔ confrontoPublicado = confrontoRefeitoDosCrus",
    veredito: "confere",
    aplica: (o) => "confrontoPublicado" in o && "confrontoRefeitoDosCrus" in o,
    esperado: (o) => mesmoValor(o["confrontoPublicado"], o["confrontoRefeitoDosCrus"]),
  },
];

/**
 * **As formas sem regra, fechadas e com o motivo.** O veredito que cai aqui não se confere — e
 * diz por quê. Forma nova não entra aqui por omissão: entra por linha escrita.
 */
export const FORMAS_SEM_REGRA: readonly { nome: string; veredito: Veredito; aplica: (o: Objeto) => boolean; porque: string }[] = [
  {
    nome: "limpo do clone vizinho",
    veredito: "limpo",
    aplica: (o) => typeof o["commit"] === "string" && typeof o["origemMain"] === "string" && !("violacoes" in o),
    porque:
      "a evidência de um clone limpo é a saída VAZIA do `git status --porcelain`, e a ausência não se " +
      "grava ao lado (LAB-108, D335); quem a calcula é src/commit-dos-vizinhos.ts, na hora da medição",
  },
];

export interface Achado {
  caminho: string;
  veredito: Veredito;
  /** O nome da regra que decidiu, ou o defeito. */
  porque: string;
}

export interface LeituraDaCoerencia {
  /** Quantos campos com um dos três nomes, conferidos ou não. */
  vereditos: number;
  /** Quantos cada regra conferiu — e quantos cada forma sem regra deixou passar, dito. */
  porRegra: Record<string, number>;
  /** O veredito que contradiz a evidência ao lado. */
  incoerentes: Achado[];
  /** O veredito que não cai em regra nem em forma declarada — ou que não é booleano nem nulo. */
  semForma: Achado[];
}

/** Anda o JSON inteiro e lê todo campo `limpo`, `aceito` e `confere` contra a evidência ao lado. */
export function lerACoerencia(
  json: unknown,
  regras: readonly RegraDeCoerencia[] = REGRAS_DE_COERENCIA,
  formasSemRegra: typeof FORMAS_SEM_REGRA = FORMAS_SEM_REGRA,
): LeituraDaCoerencia {
  const leitura: LeituraDaCoerencia = { vereditos: 0, porRegra: {}, incoerentes: [], semForma: [] };
  const contar = (nome: string): void => {
    leitura.porRegra[nome] = (leitura.porRegra[nome] ?? 0) + 1;
  };
  const andar = (x: unknown, caminho: string): void => {
    if (Array.isArray(x)) {
      x.forEach((v, i) => andar(v, `${caminho}[${i}]`));
      return;
    }
    if (x === null || typeof x !== "object") return;
    const o = x as Objeto;
    for (const [k, v] of Object.entries(o)) {
      const aqui = caminho ? `${caminho}.${k}` : k;
      const veredito = (VEREDITOS as readonly string[]).includes(k) ? (k as Veredito) : null;
      if (veredito) {
        leitura.vereditos++;
        if (v === null) {
          // não medido (D23): o `aceito` de uma passagem sem relatório sai nulo, não `false`
          contar("sem regra: não medido (null, D23)");
        } else if (typeof v !== "boolean") {
          leitura.semForma.push({ caminho: aqui, veredito, porque: `não é booleano (${canonico(v)})` });
        } else {
          const regra = regras.find((r) => r.veredito === veredito && r.aplica(o));
          const forma = regra ? undefined : formasSemRegra.find((f) => f.veredito === veredito && f.aplica(o));
          if (regra) {
            contar(regra.nome);
            if (v !== regra.esperado(o)) {
              leitura.incoerentes.push({ caminho: aqui, veredito, porque: `${regra.nome}, e o veredito diz ${v}` });
            }
          } else if (forma) {
            contar(`sem regra: ${forma.nome}`);
          } else {
            leitura.semForma.push({ caminho: aqui, veredito, porque: "nenhuma regra e nenhuma forma declarada se aplica" });
          }
        }
      }
      andar(v, aqui);
    }
  };
  andar(json, "");
  return leitura;
}

export interface ConferenciaDaCoerencia extends LeituraDaCoerencia {
  /** O universo, publicado: quantos JSON a régua leu. */
  lidos: number;
}

/** A régua sobre um conjunto de provas, com o arquivo à frente de cada caminho. */
export function conferirACoerencia(
  provas: readonly { arquivo: string; json: unknown }[],
  regras: readonly RegraDeCoerencia[] = REGRAS_DE_COERENCIA,
  formasSemRegra: typeof FORMAS_SEM_REGRA = FORMAS_SEM_REGRA,
): ConferenciaDaCoerencia {
  const total: ConferenciaDaCoerencia = { lidos: provas.length, vereditos: 0, porRegra: {}, incoerentes: [], semForma: [] };
  for (const p of provas) {
    const l = lerACoerencia(p.json, regras, formasSemRegra);
    total.vereditos += l.vereditos;
    for (const [nome, n] of Object.entries(l.porRegra)) total.porRegra[nome] = (total.porRegra[nome] ?? 0) + n;
    const comArquivo = (a: Achado): Achado => ({ ...a, caminho: `${p.arquivo} · ${a.caminho}` });
    total.incoerentes.push(...l.incoerentes.map(comArquivo));
    total.semForma.push(...l.semForma.map(comArquivo));
  }
  return total;
}
