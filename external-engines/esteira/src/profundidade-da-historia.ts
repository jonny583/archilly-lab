/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PERGUNTA DO CLONE RASO, VIRADA GUARDA. (item 022, LAB-89)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-88 fechou com uma lição e **não** com uma guarda:
 *
 * > *"Clone raso não erra por silêncio: devolve um commit QUE EXISTE, com data e assunto
 * > plausíveis — a pior forma de resposta errada, a que passa por medição.
 * > `git rev-parse --is-shallow-repository` era a pergunta que faltava."*
 *
 * A direção cobrou pela minha própria doutrina (A409): *"toda lição que descreve um erro
 * repetível merece a pergunta 'dá para cobrar isso por texto?'"* — e **escrever a regra não
 * impediu nada; guarda impediu.**
 *
 * # O MECANISMO, medido nesta rodada e mais largo do que o D293 dizia
 *
 * O D293 dizia *"toda afirmação de QUANDO isto mudou feita dentro de um clone raso é afirmação
 * sobre o clone"*. Medido no `archilly-central`, **a história INTEIRA do arquivo troca de nome**:
 *
 * | onde | `git log -- docs/PADRAO_ARCHILLY.md` |
 * |---|---|
 * | o meu clone **raso** | `e48bff9`, **`96dbc9b`** — 2 commits |
 * | o clone **raso da direção**, de outra profundidade | `e48bff9`, **`170a28f`** — 2 commits |
 * | **aprofundado** (245 commits, `is-shallow=false`) | `e48bff9`, **`67d18d5`**, `8212a54`, … — 21 commits |
 *
 * **Nem `96dbc9b` nem `170a28f` estão na história do arquivo** quando ela está inteira —
 * medido, `git log -- <caminho> | grep -c` dá **zero** para os dois. Os dois existem como
 * commit, e `git show <eles>:<caminho>` devolve o mesmo texto, **porque o arquivo ainda não
 * tinha mudado quando eles aconteceram.**
 *
 * > **`git log -- <caminho>` responde "quem ENTREGOU este texto". Num clone raso ele responde
 * > "o commit mais velho que eu tenho e que já tinha este texto" — que é o CORTE.** E como
 * > `git show` de qualquer commit posterior devolve o texto vigente naquele momento, **todo
 * > commit posterior à entrega "confirma" o texto e passa por entrega.**
 *
 * E o mais útil: **duas profundidades diferentes dão nomes diferentes, e cada uma é
 * internamente coerente** — a da direção e a minha discordaram, e as duas "conferiam".
 *
 * # Por que a resposta é RECUSAR, e não "medir com uma ressalva"
 *
 * Porque a §4 desta casa já decidiu isto para dado de motor, e vale igual para procedência:
 * **o que não foi medido sai `null`, nunca um valor plausível** (D23). Aqui o valor plausível
 * é o desfecho ruim **exato** que o D293 mediu — um commit que existe, com data e assunto.
 *
 * # E o CI DESTA CASA roda num clone raso — medido no arquivo, não suposto
 *
 * O `.github/workflows/verde.yml` usa `actions/checkout@v4` **sem `fetch-depth`**, e o padrão
 * dele é **1**. Então uma trava que exigisse história inteira **reprovaria no portão** por um
 * motivo que não é defeito nenhum.
 *
 * > **Guarda que confunde "não posso afirmar" com "a afirmação está errada" reprova o ambiente
 * > em vez de medir a coisa.** A trava desta régua aceita os dois desfechos — medição ou recusa
 * > declarada — e reprova **um terceiro**: um valor devolvido sem história para sustentá-lo.
 */

/** A pergunta, escrita uma vez, para ninguém a reescrever de memória. */
export const A_PERGUNTA = "git rev-parse --is-shallow-repository";

export type MotivoDaLeitura =
  /** A história está inteira: a afirmação se sustenta. */
  | "historia-inteira"
  /** `is-shallow-repository = true`: o `git log` do caminho responde o CORTE. */
  | "clone-raso"
  /** Não deu para saber se é raso — e não medido não é medido (D23). */
  | "profundidade-desconhecida"
  /** A história está inteira e o caminho não tem commit nenhum. */
  | "caminho-sem-historia";

export interface LeituraDaHistoria {
  /** Dá para afirmar procedência a partir desta leitura? */
  podeAfirmar: boolean;
  /** O valor medido, ou **`null`** — nunca um valor plausível sem história que o sustente. */
  valor: string | null;
  motivo: MotivoDaLeitura;
  /** O que isto quer dizer, em uma frase — é o que vai para o relatório e para a prova. */
  oQueIssoQuerDizer: string;
}

/**
 * **Pergunta a profundidade ANTES de medir, e recusa em vez de responder.**
 *
 * @param ehRaso `true` raso, `false` inteiro, `null` não deu para saber.
 * @param medir só é **chamada** quando a história está inteira — a recusa não mede, para não
 *        haver nem a tentação de aproveitar "o valor que veio junto".
 */
export function lerPelaHistoria(
  ehRaso: boolean | null,
  medir: () => string | null,
): LeituraDaHistoria {
  if (ehRaso === null) {
    return {
      podeAfirmar: false,
      valor: null,
      motivo: "profundidade-desconhecida",
      oQueIssoQuerDizer:
        `não deu para responder \`${A_PERGUNTA}\` — e não medido NÃO É MEDIDO (D23): ` +
        "nenhum commit é devolvido, porque um commit plausível é o desfecho ruim do D293",
    };
  }
  if (ehRaso) {
    return {
      podeAfirmar: false,
      valor: null,
      motivo: "clone-raso",
      oQueIssoQuerDizer:
        "clone RASO: o `git log` de um caminho aqui responde o commit do CORTE, não a ENTREGA — " +
        "medido, duas profundidades diferentes dão nomes diferentes e as duas parecem conferir. " +
        "Para afirmar procedência, aprofunde (`git fetch --depth=<n>` ou `--unshallow`) e releia",
    };
  }
  const valor = medir();
  if (valor === null || valor === "") {
    return {
      podeAfirmar: false,
      valor: null,
      motivo: "caminho-sem-historia",
      oQueIssoQuerDizer:
        "a história está inteira e o caminho não tem commit nenhum — ou ele nunca existiu, " +
        "ou o nome está errado. Nos dois casos não há procedência a afirmar",
    };
  }
  return {
    podeAfirmar: true,
    valor,
    motivo: "historia-inteira",
    oQueIssoQuerDizer: `história inteira (\`${A_PERGUNTA}\` → false): a afirmação se sustenta`,
  };
}

/**
 * **O que um clone raso respondeu, medido — a fixture que justifica a recusa.**
 *
 * Não é exemplo inventado: são as três respostas desta semana para **o mesmo arquivo do mesmo
 * repositório**, e só a última está na história inteira dele.
 */
export const O_QUE_O_CORTE_RESPONDEU = [
  { onde: "clone raso desta sessão (depth 50)", respondeu: "96dbc9b", estaNaHistoriaDoArquivo: false },
  { onde: "clone raso da direção (outra profundidade)", respondeu: "170a28f", estaNaHistoriaDoArquivo: false },
  { onde: "aprofundado a 245 commits, is-shallow=false", respondeu: "67d18d5", estaNaHistoriaDoArquivo: true },
] as const;

/**
 * **O que identifica um TEXTO não é o commit: é o BLOB.** (LAB-89, D294)
 *
 * Os três commits acima devolvem **o mesmo blob** `f95b2838…` (1 712 linhas · 106 081 bytes),
 * e só `67d18d5` o **entregou**. O D292 escreveu *"só o commit identifica o texto"* — está
 * **errado como estava escrito**, e a correção é esta:
 *
 * > **O RÓTULO identifica a intenção, o COMMIT identifica a ENTREGA, e o BLOB identifica o
 * > TEXTO.** Procedência que quer dizer *"este texto"* grava o blob; procedência que quer dizer
 * > *"esta entrega"* grava o commit — e as duas juntas é que deixam outra casa conferir sem
 * > depender da profundidade do clone dela.
 */
export const O_QUE_IDENTIFICA_O_QUE = {
  rotulo: "a intenção de quem publicou — e pode cobrir mais de um texto: `3.0` cobre dois",
  commit: "a ENTREGA — e o nome dele depende da profundidade do clone que você está lendo",
  blob: "o TEXTO, byte a byte — `git rev-parse <commit>:<caminho>`, igual em qualquer clone",
} as const;
