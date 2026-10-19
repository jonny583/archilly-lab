/**
 * **LAB-197 (item 900) · a fotografia do LAB-48 se retira igual nos três commits que a tiraram — e eles
 * não estavam escritos em lugar nenhum** (D425).
 *
 * # O que estava escrito, e o que faltava
 *
 * A lista das espécies de prova (`src/regerar-a-varredura.ts`, item 024, LAB-91) põe
 * `LAB-48/violacoes-do-motor-padrao.json` entre as **fotografias**, com o motivo:
 *
 * > *"é o ANTES de uma aferição: as violações do motor no commit em que o defeito foi medido. Regerá-la
 * > apagaria o lado 'antes' da comparação, que é precisamente o que o D182 proíbe — e ela roda MOTOR, então
 * > o universo nem está nesta casa"*
 *
 * *"No commit em que o defeito foi medido"* — e **nenhum commit está escrito**: nem na prova (ela traz o
 * nome do motor, a semente e o contrato, e nenhum `head`), nem na lista, nem no relatório do LAB-48. A
 * fotografia dependia de **três** árvores (a ponte do Lab, o motor do vizinho, o Validator do Generate), e a
 * frase falava de um commit que ninguém tinha nomeado.
 *
 * # Os três commits, achados por medição e não por data
 *
 * O palpite óbvio — a ponta da `origin/main` de cada vizinho no instante da prova (`quando`
 * 2026-10-06T21:10:17Z) — está **errado**: motor `c420613` e Generate `64489ff` dão **221** violações,
 * contra 128. Os clones daquela máquina estavam **velhos**, e quem os nomeia é o relatório do LAB-53 (§5),
 * que conferiu os três ao fim da rodada seguinte, sem `fetch` no meio: motor `4181e95`, Generate `5b7e9b4`.
 * Rodado em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados):
 *
 * | o Lab em | o motor em | o Generate em | o que a ferramenta grava |
 * |---|---|---|---|
 * | `9d28fd7` (o commit da prova) | `c420613` (a ponta da origem no instante) | `64489ff` (idem) | **221** violações — outra coisa |
 * | `9d28fd7` | `4181e95` (os clones do LAB-53) | `5b7e9b4` (idem) | **a prova, byte a byte**, fora `quando` |
 * | `1c41a40` (a ponta de hoje) | `4181e95` | `5b7e9b4` | **não grava a prova**: grava `LAB-53/…`, e **igual** à versionada, fora `quando` |
 *
 * O motivo **se sustenta**, e agora com o sujeito escrito: o *"antes"* é a ponte do Lab em `9d28fd7`, que
 * escrevia o ALVO no campo do MÍNIMO (D166). A ferramenta de hoje, com os mesmos vizinhos, mede o *"depois"*
 * — e grava noutro arquivo, porque o LAB-53 tirou o destino da medição. Então regerar hoje **não apaga** o
 * *"antes"*: não o alcança. O que o apagaria seria rodar a ferramenta do `9d28fd7` sobre outros vizinhos — e
 * é isso que a primeira linha mostra.
 *
 * # O que este módulo faz
 *
 * {@link O_RETRATO_DO_LAB48} escreve os três commits, com a origem de cada um. A trava
 * (`tests/fotografia-do-lab48.test.ts`) monta as três árvores numa pasta temporária, por caminho, e roda a
 * ferramenta **duas** vezes:
 *
 * 1. **a do Lab em `9d28fd7`** sobre os vizinhos do retrato — tem de dar a prova, com
 *    `compararSemOMomento` (LAB-196) dando zero;
 * 2. **a do Lab em `HEAD`** sobre os mesmos vizinhos — tem de NÃO tocar o `LAB-48/` e de gravar o
 *    `LAB-53/` igual ao versionado: o segundo sentido, *"a fotografia ainda precisa ser fotografia"*.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **a primeira linha da tabela** (a ponta da origem no instante): é a prova de que a data não acha o
 *   commit, e está aqui e no D425; rodá-la a cada verde custaria mais uma volta de motor para repetir um
 *   número que não guarda nada;
 * - **o que está no disco e não no `HEAD`**: a segunda rodada clona o Lab pelo `HEAD`, então mudança não
 *   commitada na ferramenta só entra depois do commit;
 * - **se o diagnóstico está certo**: a trava diz que a ferramenta tira a mesma foto nos mesmos commits, não
 *   que a classificação das 128 está certa — essa é a pergunta do LAB-48;
 * - **um clone raso de vizinho**: sem o commit do retrato na história, a trava reprova com a receita.
 */

/** Um commit do retrato, com de onde se sabe que é ele. */
export interface CommitDoRetrato {
  /** A pasta irmã, em `/home/claude`, que o `tsconfig.json` da esteira lê por caminho. */
  pasta: "archilly-lab" | "motor-testfit" | "urban-create-hub-41d93a4d";
  commit: string;
  deOndeSeSabe: string;
}

/** Os três commits que tiraram a fotografia do LAB-48 — medidos, não deduzidos da data. */
export const O_RETRATO_DO_LAB48: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "9d28fd7552fd1f22ec37bc97505e01ae8ee78e15",
    deOndeSeSabe: "o único commit da prova e da ferramenta no LAB-48 (`git log` dos dois arquivos)",
  },
  {
    pasta: "motor-testfit",
    commit: "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
    deOndeSeSabe:
      "o clone conferido ao fim do LAB-53 (docs/relatorios/LAB-53.md §5), e a ferramenta do 9d28fd7 refaz a prova nele",
  },
  {
    pasta: "urban-create-hub-41d93a4d",
    commit: "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
    deOndeSeSabe:
      "o clone conferido ao fim do LAB-53 (docs/relatorios/LAB-53.md §5), e a ferramenta do 9d28fd7 refaz a prova nele",
  },
];

/** A fotografia, relativa a `docs/provas/`. */
export const A_FOTOGRAFIA = "LAB-48/violacoes-do-motor-padrao.json";

/** A aferição que a ferramenta de hoje grava no lugar dela, relativa a `docs/provas/`. */
export const A_AFERICAO = "LAB-53/violacoes-depois-do-conserto-da-ponte.json";

/** A ferramenta, relativa à raiz do repositório — a mesma nas duas rodadas (LAB-53 §4). */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab48.ts";
