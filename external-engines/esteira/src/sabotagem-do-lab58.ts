/**
 * **LAB-219 (item 900) · as quatro sabotagens do LAB-58 REFEITAS — o que o LAB-215 perguntou à do LAB-31, perguntado à
 * do LAB-58** (D447).
 *
 * # O que estava escrito
 *
 * A `LAB-58/sabotagem.json` registra um ato de 07/10/2026: quatro sabotagens das travas do agrupamento, descritas em
 * prosa, com o `exit` de cada uma. O LAB-217 (D445) perguntou ao fecho dos `import` o que o ato rodou e achou o motor e
 * o Generate — o ato rodou a `lab58.ts` —, e deixou o candidato escrito (`docs/relatorios/LAB-217.md` §8): *"refeitas no
 * commit da prova e na janela do retrato irmão, derrubam o que a prova diz?"*, começando por esta. Ninguém tinha
 * refeito o ato desde 07/10; a prova só tinha leitura de forma.
 *
 * # O que o ato respondeu (20/10/2026, em clones locais numa pasta temporária)
 *
 * | n | onde | o par | o que a sabotagem faz cair | roda vizinho? |
 * |---|---|---|---|---|
 * | 1 | `ferramentas/lab58.ts` · `distAoContorno` | o da prova: Lab `d8d8a72`, motor `4181e95`, Generate `5b7e9b4` | a ferramenta: `exit` 0 → 1, *"CALIBRAÇÃO FALHOU em 15 lote(s)"*, *"a função DELE devolve 0 m e a MINHA distância reconstrói 13.16 m"*, sem escrever a prova | **sim**: a ferramenta importa o Generate (`@generate/…`) e o motor (`@testfit/…`) |
 * | 2 | `src/mecanismos-das-violacoes.ts` · `MECANISMOS[2].casa` | o da prova e a ponta de hoje | 2 testes de `tests/mecanismos.test.ts`, 4 violações casando dois mecanismos | não |
 * | 3 | `src/mecanismos-das-violacoes.ts` · `ondeNoMotor` do mecanismo 1 | os dois | 1 teste de 24 | não |
 * | 4 | `docs/provas/LAB-58/mecanismos-das-81.json` · `mecanismosDistintosComViolacao` | os dois | 1 teste de 24 | não |
 *
 * **Refeito, o ato morde como a prova diz, e a resposta do LAB-217 se divide por sabotagem.** O vizinho que o fecho
 * achou é todo da sabotagem 1: ela roda a ferramenta, que roda o motor e o Generate, e só se refaz na janela do LAB-213
 * (D441) — na ponta de hoje a ferramenta PARA antes da calibração (*"a lista de hoje não é a lista do LAB-53"*), e a
 * sabotagem não teria onde morder. As outras três rodam só a suíte do agrupamento, cujo fecho não sai do Lab, e mordem
 * igual no commit da prova e na ponta de hoje.
 *
 * # O que este módulo faz
 *
 * É a parte pura: {@link AS_TROCAS} (as quatro, com o texto que sai e o que entra), {@link aTrocaDaProva} (cada troca
 * contra o `onde` da prova) e {@link OS_PARES}. Quem cria a pasta, clona e roda é a trava,
 * `tests/sabotagem-do-lab58.test.ts`, no verde completo. `sabotar` e `falhasDoBun` são os do LAB-215; o fecho dos
 * `import`, para dizer qual sabotagem roda vizinho, é o `vizinhosQueRoda` do LAB-198 — a mesma régua do LAB-217.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **o texto exato de cada sabotagem**: a prova do LAB-58 escreve o que mudou em prosa, não o diff (a do LAB-31
 *   escrevia). As trocas daqui são a leitura mais estreita da prosa — a 2 tira só a condição da distância, a 3 só o
 *   *"(lido, não tocado)"*, a 4 troca 6 por 4, a 1 faz o `distAoContorno` devolver o `distanciaAoPoligono` do motor — e
 *   o que se confere é que elas mordem como a prova diz (os 15 lotes e os 13,16 m, as 4 violações, *"1 trava de 24"*);
 * - **o "antes do conserto" da sabotagem 1** (`exit` 0): a calibração de antes nunca foi commitada — o conserto
 *   aconteceu dentro da rodada, antes do `d8d8a72`. Não há árvore onde refazê-lo;
 * - **a sabotagem 1 fora da janela**: só no par do LAB-58. Fora dele a ferramenta para antes de calibrar (LAB-213);
 * - **o fecho dos `import`**: segue `import`, não `spawn` nem leitura de arquivo (o que o `vizinhosQueRoda` diz de si).
 */

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-58/sabotagem.json";

/** Os pares de commits em que o ato se refaz. `"HEAD"` quer dizer a ponta de cada clone, a de hoje. */
export const OS_PARES = {
  "o-da-prova": {
    "archilly-lab": "d8d8a72095d24da6b55869fd1ca8223235eabd0d",
    "motor-testfit": "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
    "urban-create-hub-41d93a4d": "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
  },
  "o-de-hoje": { "archilly-lab": "HEAD", "motor-testfit": "HEAD", "urban-create-hub-41d93a4d": "HEAD" },
} as const;
export type Par = keyof typeof OS_PARES;

/** Uma sabotagem: onde, as trocas de texto, como ela se mede, e o que ela tem de morder. */
export interface Troca {
  n: number;
  /** O `onde` da prova, palavra por palavra. */
  ondeNaProva: string;
  /** O arquivo, relativo à raiz do Lab. */
  arquivo: string;
  /** As trocas de texto, cada uma UMA vez no arquivo. */
  trocas: readonly { de: string; para: string }[];
  /** `suite`: roda `tests/mecanismos.test.ts`; `ferramenta`: roda `ferramentas/lab58.ts`. */
  mede: "suite" | "ferramenta";
  /** Os pares em que se refaz. */
  pares: readonly Par[];
  /** Para `suite`: os testes que têm de cair, pelo nome. */
  derruba?: readonly string[];
  /** O que a saída tem de dizer depois da sabotagem (a frase da prova, medida). */
  diz: readonly string[];
  /** Roda código de vizinho? É o que a trava mede pelo fecho de `import` (`vizinhosQueRoda`), não o que se afirma. */
  rodaVizinho: boolean;
}

const MEC = "external-engines/esteira/src/mecanismos-das-violacoes.ts";

export const AS_TROCAS: readonly Troca[] = [
  {
    n: 1,
    ondeNaProva: "ferramentas/lab58.ts · distAoContorno",
    arquivo: "external-engines/esteira/ferramentas/lab58.ts",
    trocas: [
      {
        de: 'import { distanciaSegmento } from "@testfit/geo.ts";',
        para: 'import { distanciaAoPoligono, distanciaSegmento } from "@testfit/geo.ts";',
      },
      {
        de: "function distAoContorno(p: P, pol: readonly P[]): number {\n",
        para: "function distAoContorno(p: P, pol: readonly P[]): number {\n  return distanciaAoPoligono(p as never, pol as never);\n",
      },
    ],
    mede: "ferramenta",
    pares: ["o-da-prova"],
    diz: ["CALIBRAÇÃO FALHOU em 15 lote(s)", "a função DELE devolve 0 m e a MINHA distância reconstrói 13.16 m"],
    rodaVizinho: true,
  },
  {
    n: 2,
    ondeNaProva: "src/mecanismos-das-violacoes.ts · MECANISMOS[2].casa",
    arquivo: MEC,
    trocas: [
      {
        de: 'casa: (v, lim) => v.tipo === "frente" && !v.externo && (v.dAoContornoDaVia_m ?? -1) > lim.tolDele_m,',
        para: 'casa: (v) => v.tipo === "frente" && !v.externo,',
      },
    ],
    mede: "suite",
    pares: ["o-da-prova", "o-de-hoje"],
    derruba: [
      "LAB-58 · ninguém casa duas vezes — a partição é disjunta > cada violação medida casa com UM predicado, ou com nenhum",
      "LAB-58 · ninguém casa duas vezes — a partição é disjunta > e o mecanismo gravado na prova é o que os predicados devolvem hoje",
    ],
    diz: ["casam com mais de um mecanismo:"],
    rodaVizinho: false,
  },
  {
    n: 3,
    ondeNaProva: "src/mecanismos-das-violacoes.ts · ondeNoMotor do mecanismo 1",
    arquivo: MEC,
    trocas: [
      {
        de: 'ondeNoMotor: "motor-testfit · src/lib/lab/motor.ts · reservarFacesExternas (lido, não tocado)",',
        para: 'ondeNoMotor: "motor-testfit · src/lib/lab/motor.ts · reservarFacesExternas",',
      },
    ],
    mede: "suite",
    pares: ["o-da-prova", "o-de-hoje"],
    derruba: [
      "LAB-58 · cada mecanismo declara o suficiente para virar item de fila > faixa-externa-sem-limite-longitudinal: tem as cinco declarações, e a do motor diz que foi LEITURA",
    ],
    diz: ["`ondeNoMotor` não diz que a leitura foi SÓ leitura (§4)"],
    rodaVizinho: false,
  },
  {
    n: 4,
    ondeNaProva: "docs/provas/LAB-58/mecanismos-das-81.json · total.mecanismosDistintosComViolacao",
    arquivo: "docs/provas/LAB-58/mecanismos-das-81.json",
    trocas: [{ de: '"mecanismosDistintosComViolacao": 6', para: '"mecanismosDistintosComViolacao": 4' }],
    mede: "suite",
    pares: ["o-da-prova", "o-de-hoje"],
    derruba: ["LAB-58 · a soma fecha, e ela é a conta do MVP > `mecanismosDistintosComViolacao` é CONTADO, não declarado"],
    diz: [],
    rodaVizinho: false,
  },
];

/** A suíte que as sabotagens 2 a 4 mordem, relativa à raiz do Lab — e quantos testes ela tem (a prova diz 24). */
export const A_SUITE = "external-engines/esteira/tests/mecanismos.test.ts";
export const TESTES_DA_SUITE = 24;

/** A troca bate com a prova? O `onde` tem de ser o da prova, palavra por palavra. Devolve o motivo, ou `null`. */
export function aTrocaDaProva(prova: { sabotagens: readonly { n: number; onde: string }[] }, troca: Troca): string | null {
  const s = prova.sabotagens.find((x) => x.n === troca.n);
  if (!s) return `a prova não tem a sabotagem ${troca.n}`;
  if (s.onde !== troca.ondeNaProva) return `sabotagem ${troca.n}: a prova diz "${s.onde}", a troca diz "${troca.ondeNaProva}"`;
  const arq = troca.ondeNaProva.split(" · ")[0]!;
  if (!troca.arquivo.endsWith(arq)) return `sabotagem ${troca.n}: o arquivo ${troca.arquivo} não é o "${arq}" da prova`;
  return null;
}
