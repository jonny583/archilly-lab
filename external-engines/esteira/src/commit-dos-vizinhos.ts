/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O COMMIT DO CLONE VIZINHO, GRAVADO NA PROVA. (item 001 da caixa de entrada)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O **D16** fixa o CAMINHO do irmão — o motor da própria família é lido do clone, e o caminho
 * vive num lugar só. Ninguém fixa a **VERSÃO**: nenhuma prova registrava contra qual commit do
 * vizinho ela foi medida, e por isso não havia como dizer se um número mudou porque **o motor
 * andou** ou porque **a minha ponte mudou**.
 *
 * # O que esta régua faz, e o que ela DELIBERADAMENTE não faz
 *
 * Ela **não reprova** quando o commit difere. Ela **diz**: `mudou`, com o de antes, o de agora
 * e o repositório. Reprovar seria tratar *"o motor andou"* como defeito meu, que é exatamente a
 * confusão que o item 001 veio desfazer.
 *
 * Os quatro veredictos são fechados, e cada um quer dizer uma coisa:
 *
 * | veredicto | quer dizer |
 * |---|---|
 * | `igual` | a prova foi medida contra este commit; o número vale |
 * | `mudou` | o vizinho andou — o número é de outra versão, e isso é informação, não falha |
 * | `nao-gravado` | prova antiga, de antes desta régua: **não medido**, e não "igual" |
 * | `clone-ausente` | o clone não está nesta máquina; nada a comparar |
 *
 * **`nao-gravado` não é `igual`.** Zero é uma medição, nulo é "não medi" (D23), e tratar prova
 * sem carimbo como prova conferida seria inventar a medição que falta.
 */

/** Os repositórios irmãos que este Lab lê, e só lê (§4). */
export const VIZINHOS = ["motor-testfit", "urban-create-hub-41d93a4d", "urban-scout-tool"] as const;
export type Vizinho = (typeof VIZINHOS)[number];

/** O carimbo que vai dentro da prova: um repositório e o commit com que ela foi medida. */
export interface CarimboDeVizinho {
  repo: Vizinho;
  /** O commit curto do `HEAD` do clone no momento da medição. */
  commit: string;
  /** `false` quando o clone tinha alteração não commitada — o commit sozinho mentiria. */
  limpo: boolean;
}

export type VereditoDoCarimbo = "igual" | "mudou" | "nao-gravado" | "clone-ausente";

export interface ConferenciaDoCarimbo {
  repo: Vizinho;
  veredito: VereditoDoCarimbo;
  gravado: string | null;
  agora: string | null;
  /** A frase que vai ao relatório — ela DIZ, não acusa. */
  oQueIssoQuerDizer: string;
}

/**
 * Compara o que a prova gravou com o que o clone tem agora.
 *
 * `agora` entra por parâmetro para a régua ser testável sem clone nenhum: quem a chama de
 * verdade passa o `HEAD` lido com `git -C <caminho> rev-parse --short HEAD`.
 */
export function conferirCarimbo(
  repo: Vizinho,
  gravado: string | null,
  agora: string | null,
): ConferenciaDoCarimbo {
  const base = { repo, gravado, agora };
  if (agora === null) {
    return {
      ...base,
      veredito: "clone-ausente",
      oQueIssoQuerDizer: `o clone de \`${repo}\` não está nesta máquina — nada a comparar`,
    };
  }
  if (gravado === null) {
    return {
      ...base,
      veredito: "nao-gravado",
      oQueIssoQuerDizer:
        `esta prova é anterior ao carimbo: não se sabe contra qual commit de \`${repo}\` ela foi ` +
        "medida. NÃO MEDIDO, e isso não é o mesmo que igual",
    };
  }
  if (gravado === agora) {
    return {
      ...base,
      veredito: "igual",
      oQueIssoQuerDizer: `medida contra \`${repo}@${gravado}\`, que é o que está aqui`,
    };
  }
  return {
    ...base,
    veredito: "mudou",
    oQueIssoQuerDizer:
      `\`${repo}\` ANDOU: a prova foi medida contra \`${gravado}\` e aqui está \`${agora}\`. ` +
      "O número é de outra versão do vizinho — isso é informação, não falha desta casa",
  };
}

/** A conferência de uma prova inteira, repositório por repositório. */
export function conferirProva(
  gravados: CarimboDeVizinho[] | undefined,
  agora: Partial<Record<Vizinho, string | null>>,
): ConferenciaDoCarimbo[] {
  return VIZINHOS.filter((v) => agora[v] !== undefined || gravados?.some((g) => g.repo === v)).map(
    (v) => conferirCarimbo(v, gravados?.find((g) => g.repo === v)?.commit ?? null, agora[v] ?? null),
  );
}

/**
 * **O toolchain também é variável, e foi ele que me pegou em 09/10.**
 *
 * Duas medições mudaram de valor sem que nenhum repositório mudasse — seguradas quatro
 * versões do motor, duas do hub e o meu próprio código do commit verde. A única variável que
 * sobrou foi a **versão do Bun**, que o contêiner trocou de `1.3.11` para `1.4.2` ao reiniciar.
 *
 * *Carimbar só os clones responderia "o motor andou?" e continuaria sem responder "e o chão?".*
 */
export interface CarimboDoChao {
  bun: string;
  plataforma: string;
}

/** Uma prova precisa de carimbo quando ela RODA algum vizinho. Sem rodar, não precisa. */
export function precisaDeCarimbo(prova: { osClonesVizinhos?: unknown }): boolean {
  return Array.isArray(prova.osClonesVizinhos);
}
