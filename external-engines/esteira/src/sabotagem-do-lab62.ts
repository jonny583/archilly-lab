/**
 * **LAB-223 (item 900) · as quatro sabotagens do LAB-62 REFEITAS — o que o LAB-219 e o LAB-221 perguntaram às do LAB-58 e
 * do LAB-59, perguntado à primeira dos registros de ATO que não rodam vizinho** (D451).
 *
 * # O que estava escrito
 *
 * A `LAB-62/sabotagem.json` registra um ato de 08/10/2026 (`d40b2c0`): quatro sabotagens das travas das três listas que
 * vão ao chat, descritas em prosa, com o que a ferramenta disse e quantas travas de 20 caíram — **2, 3, 4 e 3**. O LAB-217
 * (D445) mediu pelo fecho dos `import` que o ato não roda vizinho (`src/os-atos-e-o-vizinho.ts`) e o LAB-221 deixou o
 * candidato (`docs/relatorios/LAB-221.md` §8: *"os registros de ATO que sobram — LAB-60 a 63 e 66 —, refeitos"*). Ninguém
 * tinha refeito o ato desde 08/10.
 *
 * # Por que o LAB-62 e não o LAB-60
 *
 * O §8 diz *"começando pela LAB-60"*, e sete disparos seguidos desta casa tiveram rodada aberta ao mesmo tempo, com três
 * trabalhos repetidos (o recado do ≤ 21:07): o candidato escrito é o que a próxima sessão pega, e quem o pegou não aparece
 * na origem até enviar. Peguei outro da MESMA lista, para não ser a quarta repetição; o LAB-60 continua o próximo.
 *
 * # O que o ato respondeu (21/10/2026, numa pasta temporária)
 *
 * | n | o que se trocou | a prova | o par da prova (Lab `d40b2c0`) | a ponta de hoje |
 * |---|---|---|---|---|
 * | 1 | a afirmação de `face-de-quadra-limitada-num-eixo-so` vira um caminho | `exit` 1, **2** de 20 | `exit` 1, a frase da prova, **2** de 20 | **o mesmo** |
 * | 2 | o id `fileira-encosta-na-via-so-de-esguelha` renomeado nas afirmações | `exit` 1, **3** de 20 | `exit` 1, a frase da prova, **1** de 20 | **o mesmo** |
 * | 2, depois da 1 | a 2, sobre a prova que a 1 deixou escrita | — | **3** de 20: a da 2 e as duas da 1 | **o mesmo** |
 * | 3 | o destrave sem a exigência de UM mecanismo por gleba | `exit` 1, **4** de 20 | `exit` 1, a frase da prova, **4** de 20 | **o mesmo** |
 * | 4 | a linha 1 da lista 3 declara `nao-pode-reprovar` | `exit` 1, **3** de 20 | `exit` 1, as duas frases da prova, **3** de 20 | **o mesmo** |
 *
 * **Três das quatro mordem como a prova diz, nos dois pares. A 2 não: ela derruba UMA trava, e a prova diz três.** O
 * motivo se mede: a ferramenta da 2 **para por exceção antes de escrever** (*"mecanismo sem afirmação escrita"* é um
 * `throw`, não um `cobrar`), então a suíte lê a prova que estiver no disco — e as duas travas que a mais só caem se essa
 * prova for a que a sabotagem 1 deixou escrita (*"a prova não tem problema nenhum"* e *"nenhuma das dez afirmações nomeia
 * artefato"*). Refeita na ordem da prova, sem restaurar a prova entre a 1 e a 2, ela dá os três da prova, pelo nome
 * ({@link A_DOIS_DEPOIS_DA_UM}). **O "3 de 20" da prova é a mordida da 2 somada ao resto da 1.** Espécie: *prova que só
 * registra aparência* — o número estava certo para o que se rodou, e errado para o que ele diz medir.
 *
 * Sem sabotagem, nos dois pares, a ferramenta sai bem e só reescreve a `as-tres-listas.json`, e as 20 travas aprovam.
 *
 * # O que este módulo faz
 *
 * É a parte pura: {@link AS_TROCAS}, {@link A_DOIS_DEPOIS_DA_UM}, {@link OS_PARES} e {@link aTrocaDaProva}. Quem cria a
 * pasta, clona e roda é a trava, `tests/sabotagem-do-lab62.test.ts`, no verde completo. `sabotar` e `falhasDoBun` são os
 * do LAB-215; o fecho dos `import` é o `vizinhosQueRoda` do LAB-198.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **o texto exato de cada sabotagem**: a prova escreve em prosa, sem diff e sem o `onde`. As trocas daqui são a leitura
 *   mais estreita da prosa — o caminho da 1 é um qualquer (a régua barra o `/`, não o caminho), o nome novo da 2 é um
 *   qualquer — e o que se confere é que mordem como a prova diz: a frase da ferramenta, palavra por palavra, e a conta;
 * - **que a ordem do ato foi 1, 2, 3, 4**: é a única ordem em que o resto de uma sabotagem alcança a 2 com os dois nomes
 *   que sobram (só a 1 os derruba), e é a da numeração — mas o ato não escreveu a ordem. Reconstrução, etiquetada;
 * - **os estados do meio**: o par da prova e a ponta de hoje. Entre eles a ferramenta mudou (o `ABERTOS_ESPERADOS`, do
 *   LAB-78 ao LAB-200) sem tocar nas linhas sabotadas;
 * - **a `as-tres-listas.json` gravada hoje**: a ferramenta da ponta reescreve as `linhaNaFila` dos itens abertos (a
 *   `FILA.md` cresceu desde o LAB-200) e nenhuma das 20 travas lê esse campo. Visto, não medido aqui — vai ao §8;
 * - **o fecho dos `import`**: segue `import`, não `spawn` nem leitura de arquivo (o que o `vizinhosQueRoda` diz de si).
 */

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-62/sabotagem.json";

/** Os commits do Lab em que o ato se refaz. `"HEAD"` quer dizer a ponta do clone, a de hoje. O ato não roda vizinho. */
export const OS_PARES = {
  "o-da-prova": "d40b2c03f11b733ff99030ea769d1204a48e041c",
  "o-de-hoje": "HEAD",
} as const;
export type Par = keyof typeof OS_PARES;

/** A ferramenta e a suíte que o ato rodou (`oComando` da prova: "bun run lab62 (exit) + bun test tests/tres-listas.test.ts"). */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab62.ts";
export const A_SUITE = "external-engines/esteira/tests/tres-listas.test.ts";
export const TESTES_DA_SUITE = 20;

/** O que a ferramenta escreve quando chega ao fim — com problema ou sem. */
export const O_QUE_A_FERRAMENTA_ESCREVE = ["docs/provas/LAB-62/as-tres-listas.json", "docs/provas/LAB-62/os-tres-blocos.txt"] as const;

const AS_LISTAS = "external-engines/esteira/src/as-tres-listas.ts";

/** Uma sabotagem: as trocas de texto, o que a ferramenta tem de dizer, e as travas que têm de cair, pelo nome. */
export interface Troca {
  numero: number;
  /** O arquivo, relativo à raiz do Lab. */
  arquivo: string;
  /** As trocas de texto, cada uma UMA vez no arquivo. */
  trocas: readonly { de: string; para: string }[];
  /** A ferramenta chega ao fim e escreve a prova (com o problema dentro), ou para por exceção antes de escrever? */
  escreve: boolean;
  /** Os testes da suíte que caem, pelo nome, com a prova que ESTA sabotagem deixa no disco. */
  derruba: readonly string[];
}

const C = "LAB-62 · a conta das três listas fecha > ";
const A = "LAB-62 · afirmação que nomeia artefato não é afirmação > ";
const P = "LAB-62 · 'aparece em' e 'destrava' são perguntas DIFERENTES > ";
const SEM_PROBLEMA = `${C}a prova não tem problema nenhum: a ferramenta reprova quando tem`;

export const AS_TROCAS: readonly Troca[] = [
  {
    numero: 1,
    arquivo: AS_LISTAS,
    trocas: [
      {
        de:
          '"nenhuma quadra sai com uma face acima do teto de comprimento declarado e outra abaixo dele: " +\n' +
          '      "o teto limita os DOIS eixos da quadra, não um só",',
        para: '"src/lib/lab/motor.ts",',
      },
    ],
    escreve: true,
    derruba: [SEM_PROBLEMA, `${A}nenhuma das dez afirmações nomeia artefato`],
  },
  {
    numero: 2,
    arquivo: AS_LISTAS,
    trocas: [{ de: 'mecanismo: "fileira-encosta-na-via-so-de-esguelha",', para: 'mecanismo: "fileira-encosta-na-via-renomeada",' }],
    escreve: false,
    derruba: [`${C}cada mecanismo tem afirmação escrita, e nenhuma afirmação é órfã`],
  },
  {
    numero: 3,
    arquivo: A_FERRAMENTA,
    trocas: [{ de: "      g.mecanismosQueABloqueiam.length === 1 &&\n", para: "" }],
    escreve: true,
    derruba: [
      SEM_PROBLEMA,
      `${P}as duas ordens não dão o mesmo primeiro`,
      `${P}UM mecanismo destrava gleba sozinho, e os outros cinco destravam zero`,
      `${P}o que destrava não é o de maior alcance nem o de mais violações`,
    ],
  },
  {
    numero: 4,
    arquivo: AS_LISTAS,
    trocas: [{ de: "    numero: 1,\n    formaDoLAB60: null,", para: '    numero: 1,\n    formaDoLAB60: "nao-pode-reprovar",' }],
    escreve: true,
    derruba: [
      SEM_PROBLEMA,
      `${C}a lista 3 é o contexto + as três formas, e o 'não tem CI' é o PRIMEIRO`,
      `${C}as três formas do LAB-60 aparecem uma vez cada na lista 3`,
    ],
  },
];

/**
 * **RECONSTRUÇÃO DA ORDEM, não árvore:** a sabotagem 2 refeita depois da 1, sem restaurar a prova que a 1 deixou escrita.
 * A ferramenta da 2 para antes de escrever, então a suíte lê o resto da 1 — e caem as três que a prova conta: a da 2 e as
 * duas da 1.
 */
export const A_DOIS_DEPOIS_DA_UM = {
  antes: 1,
  sabotagem: 2,
  derruba: [...new Set([...AS_TROCAS[1]!.derruba, ...AS_TROCAS[0]!.derruba])].sort(),
} as const;

/** O que a prova diz de cada sabotagem: o que a ferramenta disse e quantas travas caíram. */
export interface SabotagemDaProva {
  numero: number;
  ferramenta: { exit: number; oQueEleDisse: string };
  travas: { fail: number; de: number };
}

/** As frases da ferramenta que a prova escreve, partidas no `·` que ela usa para juntar dois problemas. */
export function frasesDaProva(s: SabotagemDaProva): string[] {
  return s.ferramenta.oQueEleDisse.split(" · ").map((f) => f.trim());
}

/**
 * A troca bate com a prova? A prova não escreve o `onde`; confere-se o que ela escreve: o número, a ferramenta reprovando,
 * o denominador de travas — e a conta de travas que cai, que tem de ser a desta troca, ou (`naOrdem`) a da reconstrução da
 * ordem. Devolve o motivo, ou `null`.
 */
export function aTrocaDaProva(
  prova: { sabotagens: readonly SabotagemDaProva[] },
  troca: Troca,
  naOrdem: readonly string[] = troca.derruba,
): string | null {
  const s = prova.sabotagens.find((x) => x.numero === troca.numero);
  if (!s) return `a prova não tem a sabotagem ${troca.numero}`;
  if (s.ferramenta.exit !== 1) return `sabotagem ${troca.numero}: a prova diz que a ferramenta saiu com ${s.ferramenta.exit}`;
  if (s.travas.de !== TESTES_DA_SUITE) return `sabotagem ${troca.numero}: a prova conta de ${s.travas.de}, a suíte tem ${TESTES_DA_SUITE}`;
  if (s.travas.fail !== naOrdem.length)
    return `sabotagem ${troca.numero}: a prova diz ${s.travas.fail} de ${s.travas.de}, a troca derruba ${naOrdem.length}`;
  return null;
}
