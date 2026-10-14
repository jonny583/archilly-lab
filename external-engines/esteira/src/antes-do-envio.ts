/**
 * A ORDEM DA ENTREGA, COBRADA NO ENVIO. (LAB-106, item 900 — a proposta do LAB-105)
 *
 * # O defeito, medido em 14/10/2026
 *
 * As provas que contam a árvore (`LAB-52`, `LAB-57`) **já têm trava** que as reconta — e a trava
 * pega. O que falhava era a **ordem**: o verde rodava, e um arquivo da entrega (o relatório, o
 * módulo, a própria trava) entrava no `git` **depois**. A `main` enviada saía vermelha numa trava
 * que, rodada antes, estava verde.
 *
 * Rodada a trava do LAB-57 e a do LAB-52 sobre **cada** estado da `main` desde o LAB-86 (D287, a
 * recontagem): **36 estados**, e
 *
 * - **21 envios desta casa, 2 vermelhos** — o LAB-98 (`0318814`) e o LAB-104 (`3689986`), os dois
 *   pelo LAB-57, e os dois relatados como *"9 fail, as do `.wasm`"*;
 * - **15 escritas da direção na caixa, 15 vermelhas** — cada item novo é um arquivo a mais no
 *   `git ls-files`, e a prova do LAB-57 o conta. Essa metade **não é desta casa** e não se resolve
 *   aqui: a mão que escreve não roda as travas desta casa (ver o relatório, §6).
 *
 * # Por que no ENVIO, e não no commit
 *
 * Medido, e não suposto:
 *
 * - **um gancho de `pre-commit`** cobraria toda prova a cada commit, e uma entrega com dois commits
 *   (código, depois relatório) tem o primeiro vermelho **por construção** — a prova só se regera no
 *   fim. Ele pararia a ordem certa;
 * - **uma trava no `bun test`** roda **antes** do último `git add` — é exatamente o instante que
 *   falhou. Trava nenhuma dentro da suíte vê o arquivo que ainda vai entrar;
 * - **o CI** veria, depois do envio, e está **desligado** até 1º/11/2026.
 *
 * O envio é o único instante que é, por definição, **depois do último arquivo**: a regra da casa é
 * *um envio por entrega*. O gancho `pre-push` (`external-engines/ganchos/pre-push`) roda nesse
 * instante as travas do trabalho sem clones — a MESMA lista do `verde.yml`, lida dele.
 *
 * # O que este módulo decide
 *
 * `motivosParaRecusar` recebe o que o `git` passa ao gancho e o estado do repositório, e devolve
 * **por que** o envio não deve sair — lista vazia é *"pode enviar, e então as travas rodam"*. Só
 * a `main` é cobrada: é ela que o chat lê, e é ela que o clone de quem acorda depois recebe.
 *
 * Para a `main`, duas condições, **antes** de rodar trava nenhuma:
 *
 * 1. **o que vai é o `HEAD`** — as travas rodam sobre a árvore de trabalho, e só ela; enviar outro
 *    commit seria conferir uma árvore e enviar outra;
 * 2. **a árvore está limpa** — sem mudança fora do commit e sem arquivo não rastreado. A prova do
 *    LAB-52 conta o não rastreado e a do LAB-57 não (medido: um `.ts` solto reprova a primeira e
 *    passa na segunda); árvore suja é árvore em que as duas respondem coisas diferentes do commit.
 *
 * # O que ele NÃO alcança, dito
 *
 * - **o verde completo**: o gancho roda o trabalho sem clones (o que o CI rodaria), não o
 *   `conferir.sh` — este precisa do `.wasm` e dos clones, e leva minutos;
 * - **quem envia sem o gancho**: o gancho mora no repositório, mas o `git` só o usa com
 *   `core.hooksPath` apontado — quem aponta é o `conferir.sh`, a cada execução. Clone que nunca
 *   rodou o verde envia sem gancho, e `git push --no-verify` passa por cima;
 * - **a escrita da direção na caixa**: é outra mão, outro clone, outro instante.
 */

/** Uma linha do que o `git` escreve na entrada do `pre-push`. */
export interface RefEnviada {
  refLocal: string;
  shaLocal: string;
  refRemota: string;
  shaRemoto: string;
}

/** O estado do repositório no instante do envio. */
export interface EstadoNoEnvio {
  head: string;
  /** Linhas do `git status --porcelain` — o que está fora do commit, rastreado ou não. */
  foraDoCommit: string[];
}

/** A ref que se cobra: a `main` do remoto. */
export const REF_COBRADA = "refs/heads/main";

const APAGAR = /^0+$/;

/** Lê a entrada do `pre-push`: uma linha por ref, quatro campos separados por espaço. */
export function lerAEntrada(texto: string): RefEnviada[] {
  const refs: RefEnviada[] = [];
  for (const linha of texto.split("\n")) {
    const campos = linha.trim().split(/\s+/);
    if (campos.length !== 4) continue;
    const [refLocal, shaLocal, refRemota, shaRemoto] = campos as [string, string, string, string];
    refs.push({ refLocal, shaLocal, refRemota, shaRemoto });
  }
  return refs;
}

/**
 * Por que o envio NÃO deve sair. Vazia: pode sair, e as travas rodam.
 *
 * Só as refs que chegam a `refs/heads/main` são cobradas; apagar uma ref (sha local de zeros)
 * não é envio de árvore e passa.
 */
export function motivosParaRecusar(refs: readonly RefEnviada[], estado: EstadoNoEnvio): string[] {
  const motivos: string[] = [];
  const aMain = refs.filter((r) => r.refRemota === REF_COBRADA && !APAGAR.test(r.shaLocal));
  if (aMain.length === 0) return motivos;
  for (const r of aMain) {
    if (r.shaLocal !== estado.head) {
      motivos.push(
        `vai à main o commit ${r.shaLocal.slice(0, 7)}, e o HEAD é ${estado.head.slice(0, 7)}: ` +
          "as travas rodariam sobre uma árvore e o envio levaria outra",
      );
    }
  }
  if (estado.foraDoCommit.length > 0) {
    const amostra = estado.foraDoCommit.slice(0, 5).join(" · ");
    const resto = estado.foraDoCommit.length > 5 ? ` (e mais ${estado.foraDoCommit.length - 5})` : "";
    motivos.push(
      `${estado.foraDoCommit.length} arquivo(s) fora do commit: ${amostra}${resto} — ` +
        "a prova que conta a árvore responderia sobre o que NÃO vai",
    );
  }
  return motivos;
}

/** Se o envio leva a `main` — só então as travas rodam. */
export function levaAMain(refs: readonly RefEnviada[]): boolean {
  return refs.some((r) => r.refRemota === REF_COBRADA && !APAGAR.test(r.shaLocal));
}

/**
 * Lê o estado do repositório em `raiz`: o `HEAD` e o que está fora do commit.
 *
 * `--porcelain` sem `--ignored`: o que o `.gitignore` tira (o `.wasm`, o `node_modules`) não
 * conta, porque nenhuma prova o conta.
 */
export function estadoDoRepositorio(
  raiz: string,
  git: (args: string[]) => string,
): EstadoNoEnvio {
  const head = git(["-C", raiz, "rev-parse", "HEAD"]).trim();
  const foraDoCommit = git(["-C", raiz, "status", "--porcelain", "--untracked-files=all"])
    .split("\n")
    .filter((l) => l.trim().length > 0);
  return { head, foraDoCommit };
}
