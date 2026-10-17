/**
 * O MOTOR DA FAMÍLIA NÃO SE COPIA — e nada perguntava se ele tinha sido copiado. (LAB-146, item 900, a dívida própria, D374)
 *
 * # A regra, e a metade que estava sem guarda
 *
 * O `CLAUDE.md` §3 diz: *"Motor da própria família não ganha `upstream/` (D16): lê-se do clone irmão pelos `paths` do
 * `tsconfig.json`."* São duas metades. A segunda — **ler pelos `paths`** — tem trava desde o LAB-135
 * (`adapter-unica-fronteira.ts`: import relativo que sai da raiz é acusado). A primeira — **não copiar** — só tinha
 * guarda **pelo nome**: o `upstream-intocavel.ts` (LAB-132) conhece uma pasta `upstream` só, a do Symbios. Nada lia
 * **o conteúdo**. A D16 diz o porquê de a cópia ser o defeito: *"uma cópia congelada dentro do Lab começaria a envelhecer
 * no dia seguinte e ninguém repararia"*.
 *
 * **Medido por mutação (17/10/2026):** o `src/lib/lab/quadra.ts` do Laboratório de Parcelamento copiado byte a byte para
 * `external-engines/testfit/adapter/src/quadra-copia.ts`, adicionado ao `git`, e a suíte inteira da esteira → **duas**
 * falhas novas, as duas de contagem de árvore (as provas do LAB-52 e do LAB-57, que acusam QUALQUER arquivo novo e não
 * dizem por quê); o `tsc` do pacote acusou só os três imports relativos que a cópia trouxe — com eles trocados por
 * `@testfit/`, passaria. *Regra sem guarda*, a primeira espécie da dívida própria.
 *
 * # O que se mediu, por LUGAR
 *
 * Os dois lados são os arquivos de código **versionados** (`git ls-files`, nunca o disco), com as extensões de
 * {@link EXTENSOES_DE_CODIGO}:
 *
 * - **esta casa**: todos, inclusive o `upstream/` do Symbios (é de terceiro, e não tem por que se parecer com a família —
 *   ler a mais não esconde nada);
 * - **os motores da família**: os clones que {@link CLONES_DA_FAMILIA} junta do `adapter-unica-fronteira.ts` — o
 *   Laboratório de Parcelamento (o motor de fora) e o Generate (o dono do contrato, do Validator, do Judge e dos motores
 *   internos que a esteira também roda). Clone que entrar lá entra aqui sem ninguém lembrar.
 *
 * A medida é a **linha de código em comum**: cada arquivo vira o conjunto das suas linhas significativas
 * ({@link linhasDeCodigo}), e para cada arquivo desta casa conta-se quantas dessas linhas aparecem num mesmo arquivo do
 * vizinho. Resultado do LAB-146: **nenhum arquivo idêntico**; o mais parecido é o `contrato-v1.ts` do adaptador do
 * Testfit — 36 de 50 linhas (72 %) em comum com o `contrato/tipos.ts` do motor, e 19 (38 %) com o do Generate —, e ele é
 * **redeclaração declarada** desde o LAB-07: os tipos do contrato do Generate, escritos como *"conveniência de escrita"*,
 * com o validador do dono julgando. Os dois copiaram o mesmo contrato, e por isso se parecem. **O segundo mais parecido
 * tem 15 %** (9 linhas, `symbios-para-contrato.ts`, pelo mesmo contrato). Regra cumprida por disciplina.
 *
 * # Como ela cobra
 *
 * 1. **arquivo idêntico** a um do vizinho → `copia-inteira`, de qualquer tamanho (com uma linha significativa ao menos);
 * 2. **parecido demais** → `copia-de-motor`: {@link LIMIAR_DA_FRACAO} das linhas do arquivo em comum com UM arquivo do
 *    vizinho, com pelo menos {@link MINIMO_DE_LINHAS} linhas; **ou** {@link BLOCO_COPIADO} linhas em comum, qualquer que
 *    seja a fração — a função copiada para dentro de um arquivo grande;
 * 3. **a redeclaração é lista fechada, nos dois sentidos** ({@link REDECLARACOES}): cada uma diz o arquivo, de quem ele
 *    redeclara, o motivo, e um trecho que **o próprio arquivo** escreve dizendo que é redeclaração. Declarada e sem o
 *    arquivo → `redeclaracao-sem-arquivo`; sem o trecho → `redeclaracao-calada`; e declarada que **já não se parece**
 *    com nada → `redeclaracao-que-nao-copia-mais` (exceção que sobra é exceção que perdoa a próxima);
 * 4. **`upstream/` debaixo da pasta de um motor da família** → `upstream-de-motor-da-familia`, a letra da regra;
 * 5. **vizinho sem arquivo lido** → `vizinho-vazio`. Comparar contra nada dá zero igual a árvore limpa (D164).
 *
 * # As duas tolerâncias, e por que não mais apertadas
 *
 * O mais parecido sem declaração mede 15 % e 9 linhas — os dois limites ficam bem acima (50 % e 30 linhas) para que a
 * régua acuse cópia e não vocabulário: duas casas que escrevem contra o mesmo contrato repetem nomes de campo, e uma
 * linha como a raiz do repositório (`join(import.meta.dirname, …)`) é igual em toda parte. Cada limite tem as duas
 * mutações no teste, uma de cada lado (lição 12b do Generate, que esta casa adotou no LAB-36).
 *
 * # O que ela NÃO cobra, dito
 *
 * O mesmo texto vai na saída ({@link O_QUE_ISTO_NAO_ALCANCA}).
 */
import {
  CLONES_QUE_NAO_SAO_MOTOR,
  MOTORES_DE_FORA,
  type Arquivo,
} from "./adapter-unica-fronteira.ts";

/** A frase da regra, conferida no `CLAUDE.md` §3 por `aRegraEstaEscrita`. */
export const A_REGRA = "Motor da própria família **não ganha `upstream/`** (D16)";

/** As extensões lidas, dos dois lados. */
export const EXTENSOES_DE_CODIGO = /\.(ts|tsx|js|mjs|cjs|rs)$/;

/** Os argumentos do `git ls-files` — o mesmo comando dos dois lados. */
export const ARGUMENTOS_DO_LS_FILES = ["ls-files", "-z"] as const;

/** Os clones da família que esta casa lê, juntados do `adapter-unica-fronteira.ts` — nenhuma lista nova (D116). */
export const CLONES_DA_FAMILIA: readonly { pasta: string; papel: string }[] = [
  ...MOTORES_DE_FORA.map((m) => ({ pasta: m.raiz.replace(/^\.\.\//, "").replace(/\/$/, ""), papel: `motor ${m.motor}` })),
  ...CLONES_QUE_NAO_SAO_MOTOR.map((c) => ({
    pasta: c.raiz.replace(/^\.\.\//, "").replace(/\/$/, ""),
    papel: "o dono do contrato, do Validator, do Judge e dos motores internos",
  })),
];

/** A pasta, nesta casa, de cada motor da família lido por caminho — onde `upstream/` não pode nascer. */
export const PASTAS_DOS_MOTORES_DA_FAMILIA: readonly string[] = MOTORES_DE_FORA.map(
  (m) => `external-engines/${m.motor}/`,
);

/** Linha mais curta que isto não conta: `}`, `return x;`, `];` são iguais em toda parte. */
export const LINHA_MINIMA = 25;
/** A fração de linhas em comum com UM arquivo do vizinho a partir da qual é cópia. */
export const LIMIAR_DA_FRACAO = 0.5;
/** …desde que sejam pelo menos estas linhas — arquivo de três linhas não se julga por fração. */
export const MINIMO_DE_LINHAS = 10;
/** Linhas em comum que bastam sozinhas, em arquivo de qualquer tamanho: a função copiada. */
export const BLOCO_COPIADO = 30;

/** Uma redeclaração declarada: arquivo desta casa que se parece com um do vizinho DE PROPÓSITO. */
export interface Redeclaracao {
  arquivo: string;
  /** O clone e o arquivo de lá com que ele se parece, como `pasta/caminho`. */
  de: readonly string[];
  motivo: string;
  /** O que o PRÓPRIO arquivo escreve dizendo que é redeclaração — a declaração mora nele, não só aqui. */
  trecho: string;
}

export const REDECLARACOES: readonly Redeclaracao[] = [
  {
    arquivo: "external-engines/testfit/adapter/src/contrato-v1.ts",
    de: ["motor-testfit/src/lib/lab/contrato/tipos.ts", "urban-create-hub-41d93a4d/src/lib/contratos/motor-v1/tipos.ts"],
    motivo:
      "os tipos do contrato de motor v1, que é do Generate, redeclarados desde o LAB-07 para não prender o Lab ao layout " +
      "de código de lá; quem julga o formato é o validador do dono. O Laboratório de Parcelamento tem a mesma cópia " +
      "do mesmo contrato (D14 de lá), e por isso os dois se parecem",
    trecho: "estes tipos são **conveniência de escrita**, e a régua é de lá",
  },
];

/** O que esta régua NÃO alcança — publicado na saída, para o silêncio não parecer cobertura. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "a cópia REESCRITA: trocar os nomes, reordenar as linhas ou mudar a indentação de uma regra copiada passa — a régua " +
    "compara linhas iguais (sem o espaço das pontas), não comportamento",
  "a cópia de menos de 30 linhas num arquivo que é mais da metade outra coisa",
  "comentário, import e linha curta: não contam, de propósito (são iguais em toda parte)",
  "o que não é código: `.md`, JSON e dado copiados do vizinho não são lidos",
  "os vizinhos que esta casa não lê como motor: o Geo e as outras oito casas",
  "a história: só os arquivos de hoje, dos dois lados",
];

/** As linhas significativas de um texto de programa, sem o espaço das pontas. */
export function linhasDeCodigo(texto: string): Set<string> {
  const linhas = new Set<string>();
  for (const cru of texto.split("\n")) {
    const l = cru.trim();
    if (l.length < LINHA_MINIMA) continue;
    if (/^(\/\/|\/\*|\*|import\b|export \{|\})/.test(l)) continue;
    linhas.add(l);
  }
  return linhas;
}

export type TipoDoProblema =
  | "copia-inteira"
  | "copia-de-motor"
  | "redeclaracao-sem-arquivo"
  | "redeclaracao-calada"
  | "redeclaracao-que-nao-copia-mais"
  | "upstream-de-motor-da-familia"
  | "vizinho-vazio";

export interface Problema {
  tipo: TipoDoProblema;
  arquivo: string;
  oQue: string;
}

export interface Vizinho {
  pasta: string;
  arquivos: readonly Arquivo[];
}

export interface Entrada {
  casa: readonly Arquivo[];
  vizinhos: readonly Vizinho[];
  redeclaracoes?: readonly Redeclaracao[];
}

export interface Parecenca {
  arquivo: string;
  /** `pasta/caminho` do vizinho. */
  com: string;
  comum: number;
  linhas: number;
  fracao: number;
}

export interface Resultado {
  problemas: Problema[];
  universo: {
    arquivosDaCasa: number;
    vizinhos: { pasta: string; arquivos: number }[];
  };
  /** A maior parecença NÃO declarada — a folga que sobra até a régua acusar. `null` se nada se parece. */
  maisParecidoSemDeclaracao: Parecenca | null;
  naoAlcanca: readonly string[];
}

const ehCopia = (comum: number, linhas: number): boolean =>
  (comum >= MINIMO_DE_LINHAS && comum / linhas >= LIMIAR_DA_FRACAO) || comum >= BLOCO_COPIADO;

/**
 * Confere esta casa contra os motores da família. Função pura: recebe os textos, não lê disco — a trava sem clones a
 * roda com dados plantados, e a com clones com os versionados de verdade.
 */
export function conferirQueOMotorNaoSeCopia(e: Entrada): Resultado {
  const redeclaracoes = e.redeclaracoes ?? REDECLARACOES;
  const problemas: Problema[] = [];
  const codigo = (a: Arquivo) => EXTENSOES_DE_CODIGO.test(a.caminho);

  // 4 · a letra da regra
  for (const a of e.casa) {
    for (const pasta of PASTAS_DOS_MOTORES_DA_FAMILIA) {
      if (a.caminho.startsWith(pasta) && a.caminho.slice(pasta.length).split("/").includes("upstream")) {
        problemas.push({
          tipo: "upstream-de-motor-da-familia",
          arquivo: a.caminho,
          oQue: `\`upstream/\` debaixo de \`${pasta}\`: motor da família se lê do clone irmão, não se copia (D16)`,
        });
      }
    }
  }

  // o índice dos vizinhos: linha → arquivos de lá que a têm; e o texto inteiro, para a cópia idêntica
  const indice = new Map<string, Set<string>>();
  const inteiros = new Map<string, string>();
  const vizinhos: { pasta: string; arquivos: number }[] = [];
  for (const v of e.vizinhos) {
    const lidos = v.arquivos.filter(codigo);
    vizinhos.push({ pasta: v.pasta, arquivos: lidos.length });
    if (lidos.length === 0) {
      problemas.push({
        tipo: "vizinho-vazio",
        arquivo: v.pasta,
        oQue: `nenhum arquivo de código lido em \`${v.pasta}\`: comparar contra nada dá zero igual a árvore limpa (D164)`,
      });
    }
    for (const a of lidos) {
      const nome = `${v.pasta}/${a.caminho}`;
      if (linhasDeCodigo(a.texto).size > 0 && !inteiros.has(a.texto)) inteiros.set(a.texto, nome);
      for (const l of linhasDeCodigo(a.texto)) {
        let s = indice.get(l);
        if (!s) indice.set(l, (s = new Set()));
        s.add(nome);
      }
    }
  }

  const declarada = new Map(redeclaracoes.map((r) => [r.arquivo, r]));
  const casaPorCaminho = new Map(e.casa.map((a) => [a.caminho, a]));
  const parecidasDeclaradas = new Set<string>();
  let maisParecido: Parecenca | null = null;

  for (const a of e.casa.filter(codigo)) {
    const linhas = linhasDeCodigo(a.texto);
    const igual = inteiros.get(a.texto);
    if (igual !== undefined) {
      problemas.push({ tipo: "copia-inteira", arquivo: a.caminho, oQue: `idêntico a \`${igual}\`` });
      continue;
    }
    if (linhas.size === 0) continue;
    const conta = new Map<string, number>();
    for (const l of linhas) for (const v of indice.get(l) ?? []) conta.set(v, (conta.get(v) ?? 0) + 1);
    for (const [com, comum] of conta) {
      const p: Parecenca = { arquivo: a.caminho, com, comum, linhas: linhas.size, fracao: comum / linhas.size };
      const r = declarada.get(a.caminho);
      if (r && r.de.includes(com)) {
        if (ehCopia(comum, linhas.size)) parecidasDeclaradas.add(a.caminho);
        continue;
      }
      if (ehCopia(comum, linhas.size)) {
        problemas.push({
          tipo: "copia-de-motor",
          arquivo: a.caminho,
          oQue:
            `${comum} de ${linhas.size} linhas de código (${Math.round(p.fracao * 100)} %) iguais às de \`${com}\`: ` +
            "motor da família se lê pelo `paths` do `tsconfig.json`, não se copia (D16) — ou é redeclaração, e se declara",
        });
      } else if (
        maisParecido === null ||
        p.fracao > maisParecido.fracao ||
        (p.fracao === maisParecido.fracao && p.comum > maisParecido.comum)
      ) {
        maisParecido = p;
      }
    }
  }

  // 3 · a lista fechada, nos dois sentidos
  for (const r of redeclaracoes) {
    const a = casaPorCaminho.get(r.arquivo);
    if (!a) {
      problemas.push({ tipo: "redeclaracao-sem-arquivo", arquivo: r.arquivo, oQue: "declarada, e o arquivo não existe" });
      continue;
    }
    if (!a.texto.includes(r.trecho)) {
      problemas.push({
        tipo: "redeclaracao-calada",
        arquivo: r.arquivo,
        oQue: `o arquivo não escreve mais "${r.trecho}": a redeclaração mora nele, não só na lista`,
      });
    }
    if (e.vizinhos.length > 0 && !parecidasDeclaradas.has(r.arquivo)) {
      problemas.push({
        tipo: "redeclaracao-que-nao-copia-mais",
        arquivo: r.arquivo,
        oQue: "declarada como redeclaração e já não se parece com o que declara: exceção que sobra perdoa a próxima",
      });
    }
  }

  return {
    problemas,
    universo: { arquivosDaCasa: e.casa.filter(codigo).length, vizinhos },
    maisParecidoSemDeclaracao: maisParecido,
    naoAlcanca: O_QUE_ISTO_NAO_ALCANCA,
  };
}

/** Lê a saída do `git ls-files -z`. */
export function lerOLsFiles(saida: string): string[] {
  return saida.split("\0").filter((c) => c.length > 0);
}
