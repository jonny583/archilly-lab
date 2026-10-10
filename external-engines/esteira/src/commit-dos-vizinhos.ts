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

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";

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
  /**
   * O `origin/main` do clone, lido **depois de um `git fetch`** — e este campo nasceu no item
   * 007, porque sem ele o carimbo mede o **disco** e eu publiquei isso como o estado do vizinho.
   */
  origemMain?: string | null;
  /** Quantos commits o `HEAD` do disco está **atrás** da `origin/main`. */
  atrasPor?: number | null;
  /**
   * De ONDE este carimbo saiu: do **módulo que o `import` carregou** ou do **caminho por
   * convenção**. (item 016, D274)
   *
   * `modulo-resolvido` é a resposta à pergunta *"qual código rodou?"*. `convencao` é a resposta a
   * *"que árvore está no lugar de sempre?"* — e ela vale quando o Lab **não importa** aquele
   * vizinho, caso em que não existe módulo a resolver.
   */
  de: "modulo-resolvido" | "convencao";
  /**
   * A SEGUNDA linha: o `HEAD` do caminho por convenção, quando o carimbo saiu do módulo
   * resolvido. Ela não desaparece — responde outra pergunta e continua valendo.
   */
  pelaConvencao?: { caminho: string; commit: string } | null;
  /**
   * As duas linhas DIVERGEM? **A divergência é a notícia, não o erro** — ela quer dizer que o
   * código que rodou não veio da árvore que está no lugar de sempre, e foi exatamente isso que o
   * LAB-82 fez de propósito e o carimbo velho não contou.
   */
  divergem?: boolean;
}

/**
 * O PONTO DE ENTRADA de cada vizinho — o especificador que o `import` desta casa usa.
 *
 * **Medido no item 016, e o número muda o tamanho do conserto:** de três vizinhos, **dois** têm
 * módulo a resolver e **um não tem** — o `urban-scout-tool` não aparece em `paths` nenhum, porque
 * **o Lab não importa o Geo**. Para ele não existe *"o código que rodou"*, e o carimbo honesto é o
 * do caminho por convenção, **dito como tal**.
 *
 * > **Carimbo que não tem módulo a resolver não é um carimbo pior: é um carimbo de outra
 * > pergunta.** O que não se pode é chamar os dois pelo mesmo nome.
 */
export const PONTO_DE_ENTRADA: Record<Vizinho, string | null> = {
  "motor-testfit": "@testfit/api.ts",
  "urban-create-hub-41d93a4d": "@generate/contratos/motor-v1/index.ts",
  // O Lab não importa o Geo: ele lê GeoJSON de `docs/terrenos/`, não código. Sem `import`, não há
  // módulo resolvido — e inventar um alias só para carimbar seria carimbar uma ficção.
  "urban-scout-tool": null,
};

/** Sobe do arquivo até a raiz de git que o contém. `null` quando não há nenhuma acima. */
export function raizDeGitAcima(arquivo: string, existe: (p: string) => boolean): string | null {
  let d = dirname(arquivo);
  for (let i = 0; i < 12; i++) {
    if (existe(join(d, ".git"))) return d;
    const acima = dirname(d);
    if (acima === d) return null;
    d = acima;
  }
  return null;
}

/**
 * Onde o módulo de um vizinho FOI CARREGADO DE — a raiz de git do arquivo que o resolvedor
 * devolveu.
 *
 * O `resolver` entra por parâmetro para a régua ser testável sem clone nenhum: quem a chama de
 * verdade passa `import.meta.resolve`. **É a mesma régua com que eu conferi o repoint no LAB-82**,
 * e é por isso que ela serve de carimbo: ela responde à pergunta que o `git rev-parse` do caminho
 * fixo não responde.
 */
export function raizDoModuloResolvido(
  repo: Vizinho,
  resolver: (especificador: string) => string,
  existe: (p: string) => boolean,
): string | null {
  const spec = PONTO_DE_ENTRADA[repo];
  if (spec === null) return null;
  let url: string;
  try {
    url = resolver(spec);
  } catch {
    return null; // o alias saiu do tsconfig: NÃO MEDIDO, e não "igual ao de sempre"
  }
  return raizDeGitAcima(url.replace(/^file:\/\//, ""), existe);
}

/**
 * O SEGUNDO EIXO do carimbo: o disco contra a ORIGEM. (item 007)
 *
 * O primeiro eixo compara **a prova** com **o disco** (`igual`, `mudou`, …). Este compara **o
 * disco** com **a origem**, e é outra pergunta — foi a que faltou:
 *
 * > **O que está no disco não é o que está na origem.** O Propostas leu resíduo de BUILD, o Geo
 * > leu resíduo de CHECKOUT, e eu publiquei o `HEAD` do disco como *"o estado do vizinho"* em
 * > **seis recados**, com os três clones **18 a 23 commits atrás** (D241).
 *
 * **Ele DIZ, não reprova, e não puxa nada:** atualizar o clone mudaria toda medição desta casa,
 * e isso é prompt, não conserto silencioso — a mesma lição do D226.
 */
export type VereditoDaOrigem = "em-dia" | "atras" | "a-frente" | "origem-desconhecida";

export interface ConferenciaDaOrigem {
  repo: Vizinho;
  veredito: VereditoDaOrigem;
  head: string | null;
  origemMain: string | null;
  atrasPor: number | null;
  /** A frase que vai ao recado — ela DIZ quantos commits, porque o número é o aviso. */
  oQueIssoQuerDizer: string;
}

/**
 * Compara o `HEAD` do clone com a `origin/main` dele.
 *
 * `origemMain` e `atrasPor` entram por parâmetro: quem chama de verdade lê com
 * `git -C <caminho> fetch -q origin main` e depois `rev-parse --short origin/main` e
 * `rev-list --count HEAD..origin/main`. **O `fetch` só mexe nas referências locais do clone:
 * nenhum arquivo rastreado muda, e o `git status` dele continua limpo** (§4).
 */
export function conferirContraAOrigem(
  repo: Vizinho,
  head: string | null,
  origemMain: string | null,
  atrasPor: number | null,
): ConferenciaDaOrigem {
  const base = { repo, head, origemMain, atrasPor };
  if (head === null || origemMain === null || atrasPor === null) {
    return {
      ...base,
      veredito: "origem-desconhecida",
      oQueIssoQuerDizer:
        `não se sabe o que a origem de \`${repo}\` diz — sem \`git fetch\`, o que está aqui é o ` +
        "disco, e disco não é origem. NÃO MEDIDO, e isso não é o mesmo que em dia",
    };
  }
  if (atrasPor === 0) {
    return {
      ...base,
      veredito: "em-dia",
      oQueIssoQuerDizer: `\`${repo}\` está em dia com a origem (\`${origemMain}\`)`,
    };
  }
  if (atrasPor < 0) {
    return {
      ...base,
      veredito: "a-frente",
      oQueIssoQuerDizer:
        `o clone de \`${repo}\` está À FRENTE da \`origin/main\` — há commit aqui que não está ` +
        "lá, e isso é estranho num clone que esta casa só lê",
    };
  }
  return {
    ...base,
    veredito: "atras",
    oQueIssoQuerDizer:
      `\`${repo}\` está **${atrasPor} commit(s) ATRÁS** da origem: o disco diz \`${head}\` e a ` +
      `\`origin/main\` diz \`${origemMain}\`. Toda medição desta casa é contra \`${head}\`, e ` +
      "dizer só esse número seria publicar disco como se fosse origem (D241)",
  };
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

// ════════════════════════════════════════════════════════════════════════════
//  A METADE QUE MEDE — e ela subiu para cá no LAB-76.
// ════════════════════════════════════════════════════════════════════════════
//
// `carimbarVizinhos` nasceu dentro de `ferramentas/lab68.ts`, e o LAB-76 descobriu o preço
// disso ao precisar dela: **importar uma ferramenta a EXECUTA**. O `lab76` importou o `lab68`,
// e o `lab68` rodou inteiro — reescrevendo a prova do LAB-68 com a data de hoje.
//
// Prova sobrescrita por um import é a forma mais silenciosa de perder uma medição, e a função
// nunca foi da ferramenta: ela é a metade que MEDE deste módulo, cuja outra metade (as funções
// puras `conferirCarimbo` e `conferirContraAOrigem`) já morava aqui. Duas metades da mesma
// pergunta em dois arquivos é o D116.
//
// **Ela não é chamada ao importar** — por isso as travas sem clone vizinho continuam rodando.

const RAIZ_DO_LAB = join(import.meta.dirname, "..", "..", "..");

/**
 * O carimbo de hoje: o `HEAD` de cada clone, se ele estava limpo — **e o que a ORIGEM diz**.
 *
 * **O segundo eixo entrou no item 007, e entrou porque eu errei:** por seis recados eu publiquei
 * o `HEAD` do disco como *"o estado do vizinho"*, com os três clones **18 a 23 commits atrás**
 * da `origin/main` (D241). *O que está no disco não é o que está na origem.*
 *
 * **O `fetch` é de leitura**: ele mexe só nas referências locais do clone — nenhum arquivo
 * rastreado muda, e o `git status` dele continua limpo, o que a §4 exige e esta função confere.
 * **E nada é PUXADO:** atualizar o clone mudaria toda medição desta casa, e isso é prompt, não
 * conserto silencioso (D226).
 */
export function carimbarVizinhos(
  resolver: (especificador: string) => string = (e) => import.meta.resolve(e),
  /**
   * Buscar na origem? Ligado por padrão, porque o SEGUNDO eixo do carimbo (o atraso) depende
   * dele. **A trava passa `false`**: ela confere de ONDE o carimbo saiu, e isso não precisa de
   * rede — *trava que depende de rede não reprova o código, reprova a conexão.*
   */
  buscarNaOrigem = true,
): CarimboDeVizinho[] {
  const carimbos: CarimboDeVizinho[] = [];
  for (const repo of VIZINHOS) {
    const porConvencao = join(RAIZ_DO_LAB, "..", repo);
    // **O carimbo sai do MÓDULO RESOLVIDO quando existe um** (item 016, D274): é ele que responde
    // "qual código rodou?". O caminho por convenção responde "que árvore está no lugar de sempre?",
    // e vira a SEGUNDA linha — ela não desaparece.
    const resolvida = raizDoModuloResolvido(repo, resolver, existsSync);
    const caminho = resolvida ?? porConvencao;
    if (!existsSync(join(caminho, ".git"))) continue;
    const git = (...a: string[]): string =>
      execFileSync("git", ["-C", caminho, ...a], { encoding: "utf8" }).trim();
    const tentar = (...a: string[]): string | null => {
      try {
        return git(...a);
      } catch {
        return null; // sem rede ou sem `origin`: NÃO MEDIDO, e não "em dia"
      }
    };
    if (buscarNaOrigem) tentar("fetch", "-q", "origin", "main");
    const origemMain = tentar("rev-parse", "--short", "origin/main");
    const atras = tentar("rev-list", "--count", "HEAD..origin/main");
    const commit = git("rev-parse", "--short", "HEAD");
    // A segunda linha só se lê quando ela é OUTRO lugar — e quando há `.git` lá.
    const temConvencao = resolvida !== null && resolvida !== porConvencao && existsSync(join(porConvencao, ".git"));
    const daConvencao = temConvencao
      ? execFileSync("git", ["-C", porConvencao, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim()
      : null;
    carimbos.push({
      repo,
      commit,
      limpo: git("status", "--porcelain") === "",
      origemMain,
      atrasPor: atras === null ? null : Number(atras),
      de: resolvida === null ? "convencao" : "modulo-resolvido",
      pelaConvencao: daConvencao === null ? null : { caminho: porConvencao, commit: daConvencao },
      divergem: daConvencao === null ? false : daConvencao !== commit,
    });
  }
  return carimbos;
}
