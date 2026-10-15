/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A MÁQUINA DO DISPARO NASCE COM UMA `main` VELHA E UM CLONE RASO. (LAB-116, item 900, D344)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A proposta do LAB-115: *"o passo 0 do `COMO_FUNCIONA.md` não diz o que fazer com o clone RASO —
 * do LAB-101 ao LAB-114, catorze rodadas seguidas acharam a `main` local 'ahead 94, behind N' (o
 * `pull --ff-only` do disparo recusa), e cada uma redescobriu que era clone raso"*.
 *
 * # O mecanismo, medido no disparo de 15/10/2026, 22h06 UTC (a décima sexta vez)
 *
 * A máquina chega com os doze repositórios da família já no disco, e **em cada um deles há duas
 * coisas ao mesmo tempo**:
 *
 * - um **ramo `main` local VELHO**, do retrato da máquina (09 e 10/10/2026 nas doze casas);
 * - o **`HEAD` destacado na ponta de hoje**, posto ali por um `fetch` raso — e o clone é **raso**.
 *
 * O comando fixo do disparo faz `fetch` → `checkout main` → `pull --ff-only`. No raso, o `git`
 * não acha a base comum entre a `main` velha e a ponta (a história foi cortada nas duas pontas) e
 * declara **divergência** que não existe. **E o pior não é a recusa**: o `checkout main` já rodou
 * antes dela, então **a árvore de trabalho volta ao retrato da máquina** — aqui, 84e63d4, de
 * 09/10/2026 23h54. Lido do disco depois disso:
 *
 * - o `COMO_FUNCIONA.md` é o de 09/10, **sem passo 0 nenhum** (zero `git fetch` nas onze casas que
 *   têm a página — a direção não tem caixa);
 * - a caixa mostra **item aberto que já foi feito** — o `011.md` aqui (feito no LAB-78, 10/10), e
 *   em oito das doze casas o mesmo (009, 010, 007, 003 a 006…).
 *
 * Uma sessão que seguisse o disco **refaria um item de seis dias atrás, pelo protocolo velho**.
 *
 * # O conserto, e por que ele é uma RECEITA escrita na página e não um script do repositório
 *
 * Um script versionado não existe na árvore velha — quem estiver no retrato não o tem. A receita
 * mora no passo 0 da página, que é o que o disparo manda ler; e a página manda lê-la **da origem**
 * quando o comando do disparo falhou. A receita:
 *
 * 1. `fetch`; **se raso, desrasa** — antes de qualquer comparação, porque no raso *"divergiu"* é
 *    falta de história, não fato;
 * 2. **só então** pergunta se a `main` local é ancestral da origem; se for, avança por
 *    `--ff-only`; se **não** for, a divergência é de verdade — **não toca em nada**, diz e para.
 *    Nunca `--force`, nunca `reset --hard`, nunca `checkout -B`: a `main` local que não é
 *    ancestral pode ter trabalho que não foi enviado.
 *
 * # O que este módulo faz
 *
 * - {@link receitaDoClone} — tira da página o bloco `sh` que vem depois da {@link MARCA_DA_RECEITA};
 *   `null` se não houver (é a página que se confere, não uma cópia dela);
 * - {@link conferirAReceita} — o que a receita TEM de dizer e o que ela NÃO PODE dizer, com o
 *   sujeito escrito (a receita, não a página inteira — a página cita `--force` para proibi-lo).
 *
 * A prova de que a receita funciona não é ler o texto: é **rodá-la**, num clone raso montado como
 * a máquina monta — `tests/clone-da-maquina.test.ts`.
 *
 * # O que ele NÃO alcança, dito
 *
 * - **o comando do disparo**, que é texto da tarefa agendada e não se muda daqui (*"mudar o
 *   protocolo é commit naquele arquivo"*); por isso o recado leva o achado à direção;
 * - **as outras onze casas**: a medição delas está no relatório do LAB-116 e no recado — esta
 *   casa não escreve no repositório de ninguém;
 * - **a sessão que nem lê a página da origem**: se o disparo falhou e ela leu o disco, leu o
 *   protocolo de 09/10. A página só pode pedir; quem garante é o comando do disparo.
 */

/** A marca, num comentário de HTML, logo antes do bloco `sh` da receita no `COMO_FUNCIONA.md`. */
export const MARCA_DA_RECEITA = "<!-- receita-do-clone (LAB-116) -->";

/** A página onde a receita mora — o passo 0 do protocolo. */
export const PAGINA_DA_RECEITA = "docs/caixa-de-entrada/COMO_FUNCIONA.md";

/**
 * O bloco `sh` que vem logo depois da marca, sem as cercas. `null` quando a marca não está, ou
 * quando o que vem depois dela não é um bloco `sh` (uma marca solta não é receita).
 */
export function receitaDoClone(pagina: string): string | null {
  const i = pagina.indexOf(MARCA_DA_RECEITA);
  if (i < 0) return null;
  // A receita mora dentro de uma citação (`   > `), no item 0 da lista: tira-se o prefixo da
  // citação de cada linha — só o primeiro `>` dela, porque `>/dev/null` é shell, não citação.
  const resto = pagina
    .slice(i + MARCA_DA_RECEITA.length)
    .split("\n")
    .map((l) => l.replace(/^\s*> ?/, ""))
    .join("\n");
  const m = /^\s*```sh\n([\s\S]*?)\n```/.exec(resto);
  return m ? m[1]! : null;
}

/**
 * O que a receita TEM de conter — cada linha com o motivo. O sujeito é a RECEITA, nunca a página.
 */
export const A_RECEITA_DIZ: ReadonlyArray<{ trecho: string; porque: string }> = [
  { trecho: "git fetch -q origin", porque: "sem buscar, a origem que se compara é a do retrato" },
  {
    trecho: "--is-shallow-repository",
    porque: "a pergunta do raso vem ANTES da comparação — no raso, 'divergiu' é falta de história",
  },
  { trecho: "--unshallow", porque: "desrasar é o que devolve a base comum" },
  {
    trecho: "merge-base --is-ancestor main origin/main",
    porque: "só se avança a main que é ancestral da origem — a outra pode ter trabalho não enviado",
  },
  { trecho: "--ff-only", porque: "avançar nunca cria commit nem descarta um" },
];

/** O que a receita NÃO PODE conter: tudo o que resolve a divergência apagando um dos lados. */
export const A_RECEITA_NAO_DIZ: ReadonlyArray<{ trecho: string; porque: string }> = [
  { trecho: "--force", porque: "nunca --force (regra da casa e do disparo)" },
  { trecho: "reset --hard", porque: "descarta a main local sem perguntar se ela tinha trabalho" },
  { trecho: "checkout -B", porque: "o mesmo descarte, com outro nome" },
  { trecho: "branch -f", porque: "o mesmo descarte, com outro nome" },
  { trecho: "rebase", porque: "reescreve a história local (regra 2 da família)" },
];

export interface ConferenciaDaReceita {
  achada: boolean;
  faltam: string[];
  sobram: string[];
}

/** Confere a receita da página nos dois sentidos. A receita ausente é reprovação, não "nada a dizer". */
export function conferirAReceita(pagina: string): ConferenciaDaReceita {
  const receita = receitaDoClone(pagina);
  if (receita === null) {
    return { achada: false, faltam: A_RECEITA_DIZ.map((r) => r.trecho), sobram: [] };
  }
  return {
    achada: true,
    faltam: A_RECEITA_DIZ.filter((r) => !receita.includes(r.trecho)).map((r) => r.trecho),
    sobram: A_RECEITA_NAO_DIZ.filter((r) => receita.includes(r.trecho)).map((r) => r.trecho),
  };
}

/**
 * O comando fixo do disparo, como a tarefa agendada o manda hoje — guardado aqui para que a trava
 * reproduza o defeito com o comando REAL, e não com uma paráfrase dele. Se a direção mudar o
 * comando, esta cópia envelhece; a trava que a usa diz *"o comando do disparo de 15/10"*.
 */
export const O_COMANDO_DO_DISPARO_DE_15_10 =
  "git fetch -q origin && git checkout -q main && git pull -q --ff-only origin main";
