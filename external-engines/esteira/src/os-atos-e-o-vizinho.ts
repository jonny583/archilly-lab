/**
 * **LAB-217 (item 900) · os registros de ATO e o código de vizinho — o motivo "não roda código de ninguém",
 * perguntado ao fecho dos `import`, ato a ato** (D445).
 *
 * # O que estava escrito
 *
 * A lista de quem grava cada prova (`src/o-commit-do-vizinho-na-prova.ts`, LAB-198) dava às oito sabotagens e
 * disparos do CI sem ferramenta o mesmo motivo, por um molde:
 *
 * > *"o registro de um ATO, escrito à mão na rodada: … Não há ferramenta que o grave, e por isso ele não roda
 * > código de ninguém"*
 *
 * O *"por isso"* é uma inferência, e errada na forma: não ter ferramenta que GRAVE a prova não diz nada do que o
 * ato RODOU. O LAB-215 (D443) achou a primeira exceção refazendo a sabotagem do LAB-31 — ela rodou a suíte do
 * testfit, que roda o motor — e deixou escrito o candidato: as outras, uma a uma.
 *
 * # Como se pergunta, e por que não se refaz cada ato
 *
 * Refazer as sabotagens responde se elas dão a mesma resposta; a pergunta aqui é outra e mais estreita: **o que o
 * ato rodou alcança código de vizinho?** Ela se responde com o instrumento que o LAB-198 já usa para as provas com
 * ferramenta — {@link vizinhosQueRoda}, o fecho dos `import` de execução —, aplicado aos arquivos que o ato rodou,
 * **no commit da prova** (a árvore daquele dia, tirada com `git archive`) e na ponta de hoje. O que o ato rodou está
 * escrito à mão em {@link OS_ATOS}, cada linha com a fonte: o `oComando` da prova, quando ela o escreve, ou a
 * mensagem que a prova cita e que só aquela ferramenta imprime.
 *
 * # O que a ferramenta respondeu (20/10/2026)
 *
 * | ato | o que rodou | vizinho no fecho, no commit da prova e hoje |
 * |---|---|---|
 * | **LAB-31** | `esteira/tests/identidade.test.ts`, `testfit/tests/esteira.test.ts` | **o motor e o Generate** — os dois arquivos |
 * | LAB-38 | o trabalho sem clones do CI (`verde.test.ts` foi o sabotado) | nenhum — e no CI não havia clone a rodar |
 * | **LAB-58** | `lab58.ts` (*"a função DELE devolve … a MINHA distância reconstrói"*) e `mecanismos.test.ts` | **o motor e o Generate** |
 * | **LAB-59** | `lab59.ts` (*"lote EXTERNO sem distância à face entregue"*) e `contrafactual.test.ts` | **o motor e o Generate** |
 * | LAB-60 a 63, 66 | a ferramenta da rodada e as travas que a prova nomeia | nenhum |
 *
 * **O molde mentia em duas de oito** (três de nove, com a do LAB-31): as sabotagens do LAB-58 e do LAB-59 rodaram
 * a ferramenta da rodada, e a ferramenta roda o motor e o Generate — as mesmas que o LAB-213 e o LAB-214 retrataram.
 * **E o motivo que o LAB-215 escreveu para o LAB-31 estava pela metade:** *"a do testfit roda o motor"* — medido, os
 * dois arquivos que aquela sabotagem rodou alcançam o motor E o Generate (o Validator dele entra pela porta da
 * esteira). Quem achou foi a primeira passada desta trava, que esperava só o motor.
 * Que o ato rodou nos mesmos clones da prova irmã (mesmo commit do Lab, `d8d8a72` e `387fc20`) é **coerência, não
 * medição**: a sabotagem não escreve commit de vizinho, e a janela que vale para ela é a do retrato da irmã
 * (`src/retrato-do-lab58.ts`, `src/retrato-do-lab59.ts`) por ser a mesma ferramenta na mesma rodada.
 *
 * # O que isto NÃO alcança, dito
 *
 * - **processo filho**: o fecho segue `import`, não `spawn`. Medido à mão hoje: das travas que os atos rodaram, só
 *   `verde.test.ts` abre processo, e é o `find` do sistema; nenhuma ferramenta dos atos abre processo;
 * - **leitura de arquivo de vizinho** (o `lab60.ts` lê a configuração do motor, o `enderecos-do-vizinho.test.ts` lê
 *   o código dele): é leitura, não execução — a regra do LAB-198;
 * - **se a lista do que o ato rodou está completa**: a prova não escreve o comando nas rodadas 58 a 61; a linha cita
 *   a mensagem que só a ferramenta imprime e a trava que a prova diz que caiu. Uma trava que o ato rodou e a prova
 *   não nomeia fica fora — e por isso o veredicto "nenhum" é o do que está escrito, não o do ato inteiro;
 * - **o CI do LAB-38**: o que ele rodou é a lista do `verde.yml` daquele commit, e ali não havia clone de vizinho
 *   no disco do executor; a trava mede o arquivo sabotado, não as 64 travas.
 */
import { vizinhosQueRoda } from "./o-commit-do-vizinho-na-prova.ts";

export const MOTOR = "motor-testfit";
export const GENERATE = "urban-create-hub-41d93a4d";

const E = "external-engines/esteira";

/** Um registro de ATO: a prova, o commit que a criou, o que o ato rodou (com a fonte) e os vizinhos medidos. */
export interface Ato {
  prova: string;
  /** O commit do Lab que criou a prova (`git log --diff-filter=A`). */
  commit: string;
  /** Os arquivos que o ato rodou, relativos à raiz do Lab. */
  rodou: readonly string[];
  /** De onde se sabe o que o ato rodou. */
  fonte: string;
  /** Os vizinhos no fecho dos `import`, medidos no commit da prova e hoje (os dois deram o mesmo). */
  vizinhos: readonly string[];
}

export const OS_ATOS: readonly Ato[] = [
  {
    prova: "LAB-31/sabotagem.json",
    commit: "c8f5c22",
    rodou: [`${E}/tests/identidade.test.ts`, "external-engines/testfit/tests/esteira.test.ts"],
    fonte: "as duas sabotagens de pacote da prova (`sabotagens[].onde`), refeitas no LAB-215",
    vizinhos: [MOTOR, GENERATE],
  },
  {
    prova: "LAB-38/ci.json",
    commit: "903e407",
    rodou: [`${E}/tests/verde.test.ts`],
    fonte: "`disparos[2].sabotagem.onde` — o teste sabotado, no trabalho sem clones do CI",
    vizinhos: [],
  },
  {
    prova: "LAB-58/sabotagem.json",
    commit: "d8d8a72",
    rodou: [`${E}/ferramentas/lab58.ts`, `${E}/tests/mecanismos.test.ts`],
    fonte:
      "`sabotagens[0]` cita \"a função DELE devolve 0 m e a MINHA distância reconstrói\" e `sabotagens[1]` \"dupla contagem\" — mensagens do `lab58.ts`; `sabotagens[2..3]`, \"1 trava de 24\"",
    vizinhos: [MOTOR, GENERATE],
  },
  {
    prova: "LAB-59/sabotagem.json",
    commit: "387fc20",
    rodou: [`${E}/ferramentas/lab59.ts`, `${E}/tests/contrafactual.test.ts`],
    fonte:
      "`sabotagens[0]` cita \"lote EXTERNO sem distância à face entregue\" — mensagem do `lab59.ts`; as outras, \"travas de 20\"",
    vizinhos: [MOTOR, GENERATE],
  },
  {
    prova: "LAB-60/sabotagem.json",
    commit: "ce19bfc",
    rodou: [`${E}/ferramentas/lab60.ts`, `${E}/tests/configuracao-do-motor.test.ts`, `${E}/tests/configuracao.test.ts`],
    fonte: "`oQueAFERRAMENTAnaoPega` (\"a ferramenta saiu com exit 0\") e as travas nomeadas, a do LAB-57 inclusive",
    vizinhos: [],
  },
  {
    prova: "LAB-61/sabotagem.json",
    commit: "2216067",
    rodou: [`${E}/ferramentas/lab61.ts`, `${E}/tests/propostas.test.ts`],
    fonte: "\"a FERRAMENTA para e nomeia a linha\" e \"travas de 18\"; a suíte do relatório do LAB-61",
    vizinhos: [],
  },
  {
    prova: "LAB-62/sabotagem.json",
    commit: "d40b2c0",
    rodou: [`${E}/ferramentas/lab62.ts`, `${E}/tests/tres-listas.test.ts`],
    fonte: "`oComando`: \"bun run lab62 (exit) + bun test tests/tres-listas.test.ts\"",
    vizinhos: [],
  },
  {
    prova: "LAB-63/sabotagem.json",
    commit: "3346267",
    rodou: [
      `${E}/ferramentas/lab63.ts`,
      `${E}/tests/aritmetica-da-regra.test.ts`,
      `${E}/tests/enderecos-do-vizinho.test.ts`,
    ],
    fonte:
      "`oComando`: \"bun run lab63 (exit) + bun test tests/aritmetica-da-regra.test.ts tests/enderecos-do-vizinho.test.ts\"",
    vizinhos: [],
  },
  {
    prova: "LAB-66/sabotagem.json",
    commit: "6b94dcd",
    rodou: [`${E}/ferramentas/lab66.ts`, `${E}/tests/recado.test.ts`],
    fonte: "`oComando`: \"bun run lab66 (exit) + bun test tests/recado.test.ts\"",
    vizinhos: [],
  },
] as const;

/** Os vizinhos que os arquivos de um ato rodam, numa árvore do Lab com raiz `raiz` — a união dos fechos, ordenada. */
export function vizinhosDoAto(rodou: readonly string[], raiz: string): string[] {
  const todos = new Set<string>();
  for (const a of rodou) for (const v of vizinhosQueRoda(a, raiz)) todos.add(v);
  return [...todos].sort();
}

/** A frase que um motivo de ATO diz quando o que ele rodou não alcança vizinho. */
export const NAO_RODA_VIZINHO = "o que ele rodou não alcança código de vizinho";

/**
 * O motivo bate com a medição? Sem vizinho, ele tem de dizer {@link NAO_RODA_VIZINHO}; com vizinho, não pode
 * dizê-lo (nem a frase velha *"não roda código de ninguém"*) e tem de nomear cada um — pelo nome do clone ou pelo
 * apelido da casa (`motor`, `Generate`). Devolve o desacordo, ou `null`.
 */
export function oMotivoBate(motivo: string, vizinhos: readonly string[]): string | null {
  const negaTudo = motivo.includes(NAO_RODA_VIZINHO) || motivo.includes("não roda código de ninguém");
  if (vizinhos.length === 0) return negaTudo ? null : `o motivo não diz "${NAO_RODA_VIZINHO}", e o fecho não acha vizinho`;
  if (negaTudo) return `o motivo nega o vizinho, e o fecho acha ${vizinhos.join(" e ")}`;
  const apelido: Record<string, string> = { [MOTOR]: "motor", [GENERATE]: "Generate" };
  const faltam = vizinhos.filter((v) => !motivo.includes(v) && !motivo.includes(apelido[v] ?? v));
  return faltam.length === 0 ? null : `o motivo não nomeia ${faltam.join(" e ")}, que o fecho acha`;
}
