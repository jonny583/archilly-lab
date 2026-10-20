/**
 * **LAB-221 (item 900) · as quatro sabotagens do LAB-59 REFEITAS — o que o LAB-219 perguntou à do LAB-58, perguntado à
 * do LAB-59, e já no commit da prova E na ponta de hoje** (D449).
 *
 * # O que estava escrito
 *
 * A `LAB-59/sabotagem.json` registra um ato de 07/10/2026 (`387fc20`): quatro sabotagens das travas do contrafactual de
 * Antonina, descritas em prosa, com o `exit` de cada uma. O LAB-217 (D445) achou pelo fecho dos `import` que o ato rodou
 * a `lab59.ts`, e ela roda o motor e o Generate; deixou o candidato (`docs/relatorios/LAB-217.md` §8), e o LAB-219 e o
 * LAB-220 o repetiram (*"a sabotagem do LAB-59, da mesma forma — refazendo a de ferramenta também na ponta de hoje"*).
 * Ninguém tinha refeito o ato desde 07/10; a prova só tinha leitura de forma.
 *
 * # O que o ato respondeu (20/10/2026, em clones locais numa pasta temporária)
 *
 * | n | onde | mede | o par da prova (Lab `387fc20`, motor `4181e95`, Generate `5b7e9b4`) | a ponta de hoje |
 * |---|---|---|---|---|
 * | 1 | `lab59.ts` · `aoSegmento` lido do LAB-50 | a ferramenta | `exit` 0 → 1: *"lote EXTERNO sem distância à face entregue"* (o `v9-e1` da `superquadra`), sem escrever | **o mesmo** |
 * | 1, sem a precondição | o mesmo, e o `if` da precondição desligado | a ferramenta e a suíte | ferramenta `exit` 0, escreve *"os-dois aprovam 1 de 20"*; suíte 20 → **2** reprovados, os dois da resposta ao Jonny | **o mesmo** |
 * | 2 | `lab59.ts` · `someComAFaixa` lido do LAB-53 | a ferramenta e a suíte | ferramenta `exit` 0, *"1 de 20"*; suíte 20 → **2**, os mesmos dois | **o mesmo** |
 * | 3 | a prova · `cenarios[os-dois].aPrimeiraNoRankingDELE` | a suíte | **2** de 20: a do §4 e a da resposta ao Jonny | **o mesmo** |
 * | 4 | a prova · `candidatas[1].cenarios[so-o-motor].aprovaria` | a suíte | **1** de 20: a da contagem contada | **o mesmo** |
 *
 * **Refeito, o ato morde como a prova diz, nos dois pares.** As duas da ferramenta (1 e 2) rodam o motor e o Generate
 * (`vizinhosQueRoda`); as duas da prova (3 e 4) rodam só a suíte, que lê arquivo do Lab. Ao contrário da do LAB-58 (D448),
 * aqui a ferramenta **não para** fora da janela do LAB-214 — escreve outra prova, *"17 de 20"*, sem 1 228 lotes —, e **as
 * 20 travas aprovam essa outra prova**: o *"antes"* das sabotagens 1 e 2 é verde nos dois pares. Por isso, na ponta de
 * hoje, as sabotagens não mudam uma parada; mudam o verde da suíte para vermelho, nas mesmas duas travas.
 *
 * **O "antes da precondição" da sabotagem 1**, que a prova escreve (`exit` 0, as travas pegaram 2 de 20, *"1 de 20"*),
 * não tem árvore: a precondição nasceu no mesmo commit da prova. Diferente do LAB-219, aqui ele se **reconstrói** sem
 * inventar nada — a precondição é UM `if`, e desligá-lo é a segunda troca; o que sai é o que a prova diz, nos dois pares.
 * É reconstrução, e está etiquetada como tal ({@link A_RECONSTRUCAO_DO_ANTES}).
 *
 * # O que este módulo faz
 *
 * É a parte pura: {@link AS_TROCAS}, {@link A_RECONSTRUCAO_DO_ANTES}, {@link aTrocaDaProva}, {@link OS_PARES} e
 * {@link aprovamNoOsDois}. Quem cria a pasta, clona e roda é a trava, `tests/sabotagem-do-lab59.test.ts`, no verde
 * completo. `sabotar` e `falhasDoBun` são os do LAB-215; o fecho dos `import` é o `vizinhosQueRoda` do LAB-198.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **o texto exato de cada sabotagem**: a prova escreve em prosa, não o diff. As trocas daqui são a leitura mais
 *   estreita da prosa — a 1 lê o `AO_SEGMENTO_50` que a ferramenta já carrega, a 2 o `SOME_COM_A_FAIXA_53`, a 3 põe a
 *   `ortogonal` de 1 228 como a primeira, a 4 vira um `false` em `true` — e o que se confere é que mordem como a prova
 *   diz (a frase da precondição, o *"1 de 20"*, os testes pelo nome);
 * - **a sabotagem 4 por posição**: a prova diz `candidatas[1]`, e o bloco `so-o-motor` dela é igual ao de outras duas
 *   candidatas; a troca leva junto o `so-o-contrato` de antes, que só ela tem — conferido UMA vez no arquivo;
 * - **os estados do meio**: o par da prova e a ponta de hoje. A janela da ferramenta sem sabotagem é a do LAB-214;
 * - **a contagem que a ferramenta de hoje escreve sem sabotagem** (17 de 20 com as pontas de 20/10): medida à mão, não
 *   travada — muda com os vizinhos, e a do LAB-214 já trava a de uma ponta fixa;
 * - **o fecho dos `import`**: segue `import`, não `spawn` nem leitura de arquivo (o que o `vizinhosQueRoda` diz de si).
 */

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-59/sabotagem.json";

/** Os pares de commits em que o ato se refaz. `"HEAD"` quer dizer a ponta de cada clone, a de hoje. */
export const OS_PARES = {
  "o-da-prova": {
    "archilly-lab": "387fc205b666f72e57f2e6c8579b009c842bd81d",
    "motor-testfit": "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
    "urban-create-hub-41d93a4d": "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
  },
  "o-de-hoje": { "archilly-lab": "HEAD", "motor-testfit": "HEAD", "urban-create-hub-41d93a4d": "HEAD" },
} as const;
export type Par = keyof typeof OS_PARES;

/**
 * Como a sabotagem se mede: `suite` roda `tests/contrafactual.test.ts`; `ferramenta` roda `ferramentas/lab59.ts` e
 * exige que ela PARE sem escrever; `ferramenta-e-suite` roda a ferramenta, que escreve a prova, e depois a suíte sobre ela.
 */
export type Medida = "suite" | "ferramenta" | "ferramenta-e-suite";

/** Uma sabotagem: onde, as trocas de texto, como ela se mede, e o que ela tem de morder. */
export interface Troca {
  n: number;
  /** O `onde` da prova, palavra por palavra. */
  ondeNaProva: string;
  /** O arquivo, relativo à raiz do Lab. */
  arquivo: string;
  /** As trocas de texto, cada uma UMA vez no arquivo. */
  trocas: readonly { de: string; para: string }[];
  mede: Medida;
  /** Os testes da suíte que têm de cair, pelo nome (para `suite` e `ferramenta-e-suite`). */
  derruba?: readonly string[];
  /** O que a ferramenta tem de dizer depois da sabotagem. */
  diz: readonly string[];
  /** Quantas aprovam no cenário `os-dois`, na linha que a ferramenta imprime, depois da sabotagem (a prova: 1). */
  aprovamDepois?: number;
  /** Roda código de vizinho? É o que a trava mede pelo fecho de `import` (`vizinhosQueRoda`), não o que se afirma. */
  rodaVizinho: boolean;
}

const FERRAMENTA = "external-engines/esteira/ferramentas/lab59.ts";
const CONTRAFACTUAL = "docs/provas/LAB-59/contrafactual-de-antonina.json";
const D = "LAB-59 · a resposta à pendência do Jonny, como MEDIÇÃO e não como frase > ";
const AS_DUAS_DO_JONNY = [
  `${D}a candidata de MAIS lotes aprova no cenário em que tudo foi resolvido`,
  `${D}e a nota DELE ainda prefere a de MENOS lotes — é isso que responde o Jonny`,
] as const;

/** O bloco `so-o-contrato` + `so-o-motor` da `candidatas[1]` — o `so-o-motor` sozinho aparece três vezes na prova. */
const BLOCO_DA_SEGUNDA =
  '"so-o-contrato": {\n          "violacoesQueRestam": 35,\n          "aprovaria": false,\n          "oQueAindaBloqueia": [\n' +
  '            "faixa-externa-sem-limite-longitudinal (25)",\n            "rede-viaria-aparada-so-pela-divisa (10)"\n' +
  '          ]\n        },\n        "so-o-motor": {\n          "violacoesQueRestam": 14,\n          "aprovaria": ';

export const AS_TROCAS: readonly Troca[] = [
  {
    n: 1,
    ondeNaProva: "ferramentas/lab59.ts · aoSegmento",
    arquivo: FERRAMENTA,
    trocas: [
      {
        de: "const aoSegmento = aoSegmentoDaFaceEntregue(pts, TESTADAS_DA_ENTRADA);",
        para: "const aoSegmento = AO_SEGMENTO_50.get(`${GLEBA}|${lo.id}`) ?? null;",
      },
    ],
    mede: "ferramenta",
    diz: ["lote EXTERNO sem distância à face entregue"],
    rodaVizinho: true,
  },
  {
    n: 2,
    ondeNaProva: "ferramentas/lab59.ts · someComAFaixa",
    arquivo: FERRAMENTA,
    trocas: [
      {
        de: "const someComAFaixa = comFaixa ? !comFaixa.has(`${v.tipo}|${v.loteId}`) : null;",
        para: "const someComAFaixa = SOME_COM_A_FAIXA_53.get(chave) ?? null;",
      },
    ],
    mede: "ferramenta-e-suite",
    derruba: AS_DUAS_DO_JONNY,
    diz: [],
    aprovamDepois: 1,
    rodaVizinho: true,
  },
  {
    n: 3,
    ondeNaProva: `${CONTRAFACTUAL} · cenarios[os-dois].aPrimeiraNoRankingDELE`,
    arquivo: CONTRAFACTUAL,
    trocas: [
      {
        de: '"aPrimeiraNoRankingDELE": {\n        "formato": "superquadra",\n        "lotes": 33,\n        "notaDoMotor": 0.6226435182362932,',
        para: '"aPrimeiraNoRankingDELE": {\n        "formato": "ortogonal",\n        "lotes": 1228,\n        "notaDoMotor": 0.5880792794093138,',
      },
    ],
    mede: "suite",
    derruba: ["LAB-59 · a escolha é DO MOTOR, e a trava mede isso > `os-dois`: a primeira entre as que aprovam é a de melhor nota DELE", AS_DUAS_DO_JONNY[1]],
    diz: [],
    rodaVizinho: false,
  },
  {
    n: 4,
    ondeNaProva: `${CONTRAFACTUAL} · candidatas[1].cenarios[so-o-motor].aprovaria`,
    arquivo: CONTRAFACTUAL,
    trocas: [{ de: `${BLOCO_DA_SEGUNDA}false`, para: `${BLOCO_DA_SEGUNDA}true` }],
    mede: "suite",
    derruba: ["LAB-59 · a escolha é DO MOTOR, e a trava mede isso > as contagens dos cenários são CONTADAS, não declaradas"],
    diz: [],
    rodaVizinho: false,
  },
];

/**
 * **RECONSTRUÇÃO, não árvore:** o *"antes da precondição"* da sabotagem 1. A precondição nasceu no commit da prova, então
 * não há commit sem ela; aqui ela se desliga com uma segunda troca (o `if` vira `if (false)`), e a sabotagem 1 tem de
 * fazer o que a prova diz de antes: a ferramenta sai bem, escreve *"1 de 20"*, e as travas pegam as duas do Jonny.
 */
export const A_RECONSTRUCAO_DO_ANTES: Troca = {
  ...AS_TROCAS[0]!,
  trocas: [
    ...AS_TROCAS[0]!.trocas,
    { de: "if (TESTADAS_DA_ENTRADA.length && /-e\\d+$/.test(lo.id) && aoSegmento === null) {", para: "if (false) {" },
  ],
  mede: "ferramenta-e-suite",
  derruba: AS_DUAS_DO_JONNY,
  diz: [],
  aprovamDepois: 1,
};

/** A suíte que as sabotagens mordem, relativa à raiz do Lab — e quantos testes ela tem (a prova diz 20). */
export const A_SUITE = "external-engines/esteira/tests/contrafactual.test.ts";
export const TESTES_DA_SUITE = 20;

/** Quantas aprovam no cenário `os-dois`, na linha que a ferramenta imprime (`os-dois  aprovam 16 de 20 · …`), ou `null`. */
export function aprovamNoOsDois(saida: string): { aprovam: number; de: number } | null {
  const m = /^\s*os-dois\s+aprovam\s+(\d+) de (\d+)/m.exec(saida);
  return m ? { aprovam: Number(m[1]), de: Number(m[2]) } : null;
}

/** A troca bate com a prova? O `onde` tem de ser o da prova, palavra por palavra. Devolve o motivo, ou `null`. */
export function aTrocaDaProva(prova: { sabotagens: readonly { n: number; onde: string }[] }, troca: Troca): string | null {
  const s = prova.sabotagens.find((x) => x.n === troca.n);
  if (!s) return `a prova não tem a sabotagem ${troca.n}`;
  if (s.onde !== troca.ondeNaProva) return `sabotagem ${troca.n}: a prova diz "${s.onde}", a troca diz "${troca.ondeNaProva}"`;
  const arq = troca.ondeNaProva.split(" · ")[0]!;
  if (!troca.arquivo.endsWith(arq)) return `sabotagem ${troca.n}: o arquivo ${troca.arquivo} não é o "${arq}" da prova`;
  return null;
}
