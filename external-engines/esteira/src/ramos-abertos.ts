/**
 * OS RAMOS ABERTOS — a lista que o protocolo manda manter, e que nunca existiu. (LAB-121, item
 * 900, a dívida própria, D349)
 *
 * # A regra, e o defeito medido em 16/10/2026
 *
 * O `docs/caixa-de-entrada/COMO_FUNCIONA.md`, seção *"O que vai para ramo em vez da main"*, manda:
 * *"o ramo se chama pela pergunta que ele espera […] Mantenha a lista dos ramos abertos, com a
 * pergunta de cada um, em `docs/RAMOS_ABERTOS.md`"*. Enumerados por LUGAR:
 *
 * - **a página não existia** — nenhum `docs/RAMOS_ABERTOS.md` em nenhum commit da `main`, e o nome
 *   aparece numa linha só do repositório inteiro: a da própria regra;
 * - **nenhum `.ts` lia os ramos da origem** (o `antes-do-envio.ts` só olha a ref que o envio leva
 *   à `main`) — a regra não tinha guarda;
 * - **a origem tinha um ramo além da `main`** (`git ls-remote --heads origin`):
 *   `claude/stoic-ritchie-ijzqy3`, de onde saíram 52 PRs, com a ponta no LAB-95 (12/10/2026) — e
 *   essa ponta está **inteira** na `main`. Aberto, no sentido da regra, nenhum.
 *
 * A resposta certa era *"zero"*, e o repositório dizia *"nada"*: página ausente é **nulo** (não
 * medi), não **zero** (medi, e não há). *Zero é uma medição, nulo é "não medi"* — o mesmo
 * protocolo, quatro seções abaixo.
 *
 * # O que este módulo faz
 *
 * - {@link lerAPagina} — lê a tabela da página: uma linha por ramo, com a pergunta. Sem tabela
 *   devolve `null`, nunca lista vazia: página sem tabela não diz *"nenhum ramo"*.
 * - {@link conferirOsRamos} — cruza a página com os ramos da origem, nos dois sentidos:
 *   todo ramo **não mesclado** tem linha; toda linha tem ramo na origem, ramo **não** mesclado e
 *   pergunta. *"Não sei se mesclou"* (`mesclado: null`, o objeto não está no clone) **reprova** —
 *   não sei não é não há (D23).
 *
 * A leitura da origem (`git ls-remote` e `git merge-base --is-ancestor`) mora na trava viva,
 * `tests/ramos-abertos-na-origem.test.ts`, fora do portão sem clones: ela precisa da rede e da
 * história, e o `actions/checkout` traz a ponta sem a história.
 *
 * # O que ele NÃO alcança, dito
 *
 * - **se o nome do ramo é a pergunta** (*"`espera-definicao-de-quadra`, não `ajuste-invariante`"*):
 *   isso é leitura de sentido, e régua de palavra não a faz;
 * - **ramo só local**, que nunca subiu: a página serve ao chat, e o chat só vê a origem;
 * - **ramo mesclado que ficou na origem**: não espera pergunta nenhuma, então não é aberto. Ele é
 *   publicado no universo da trava viva, e apagá-lo é ato que não se desfaz (classe 2 do
 *   protocolo) — não é desta régua.
 */

/** Uma linha da tabela da página. */
export interface LinhaDaPagina {
  ramo: string;
  pergunta: string;
}

/** Um ramo como a origem o mostra. `mesclado: null` é *"não sei"*: o objeto não está no clone. */
export interface RamoNaOrigem {
  nome: string;
  mesclado: boolean | null;
}

export type TipoDeProblema =
  | "ramo-aberto-sem-linha"
  | "nao-sei-se-mesclou"
  | "linha-sem-ramo-na-origem"
  | "linha-de-ramo-ja-mesclado"
  | "linha-sem-pergunta"
  | "linha-repetida"
  | "o-principal-na-pagina";

export interface ProblemaDosRamos {
  tipo: TipoDeProblema;
  ramo: string;
}

/** O ramo que não é ramo aberto por definição: é para onde os outros vão. */
export const RAMO_PRINCIPAL = "main";

/** O cabeçalho da tabela, como a página o escreve. A régua procura ESTA linha. */
export const CABECALHO = "| ramo | a pergunta que ele espera |";

const semCrases = (s: string): string => s.trim().replace(/^`(.*)`$/, "$1").trim();

/**
 * Lê a tabela que começa no {@link CABECALHO}. A linha de separação (`|---|---|`) é pulada; a
 * tabela acaba na primeira linha que não começa por `|`. Sem cabeçalho, `null`.
 */
export function lerAPagina(texto: string): LinhaDaPagina[] | null {
  const linhas = texto.split("\n");
  const i = linhas.findIndex((l) => l.trim() === CABECALHO);
  if (i < 0) return null;
  const r: LinhaDaPagina[] = [];
  for (const l of linhas.slice(i + 1)) {
    const t = l.trim();
    if (!t.startsWith("|")) break;
    if (/^\|[\s|:-]+\|$/.test(t)) continue;
    const campos = t.slice(1, t.endsWith("|") ? -1 : undefined).split("|");
    r.push({ ramo: semCrases(campos[0] ?? ""), pergunta: (campos[1] ?? "").trim() });
  }
  return r;
}

/** Cruza a página com a origem, nos dois sentidos. Lista vazia é o lado bom. */
export function conferirOsRamos(
  origem: readonly RamoNaOrigem[],
  linhas: readonly LinhaDaPagina[],
): ProblemaDosRamos[] {
  const problemas: ProblemaDosRamos[] = [];
  const naOrigem = new Map(origem.map((r) => [r.nome, r]));
  const naPagina = new Set<string>();

  for (const l of linhas) {
    if (naPagina.has(l.ramo)) problemas.push({ tipo: "linha-repetida", ramo: l.ramo });
    naPagina.add(l.ramo);
    if (l.ramo === RAMO_PRINCIPAL) {
      problemas.push({ tipo: "o-principal-na-pagina", ramo: l.ramo });
      continue;
    }
    if (l.pergunta === "") problemas.push({ tipo: "linha-sem-pergunta", ramo: l.ramo });
    const r = naOrigem.get(l.ramo);
    if (!r) problemas.push({ tipo: "linha-sem-ramo-na-origem", ramo: l.ramo });
    else if (r.mesclado === true) problemas.push({ tipo: "linha-de-ramo-ja-mesclado", ramo: l.ramo });
  }

  for (const r of origem) {
    if (r.nome === RAMO_PRINCIPAL) continue;
    if (r.mesclado === null) problemas.push({ tipo: "nao-sei-se-mesclou", ramo: r.nome });
    else if (!r.mesclado && !naPagina.has(r.nome)) problemas.push({ tipo: "ramo-aberto-sem-linha", ramo: r.nome });
  }
  return problemas;
}

/** Lê a saída de `git ls-remote --heads origin`: `<sha>\trefs/heads/<nome>`, uma por linha. */
export function lerOsRamosDaOrigem(saida: string): { nome: string; sha: string }[] {
  const r: { nome: string; sha: string }[] = [];
  for (const l of saida.split("\n")) {
    const m = /^([0-9a-f]{40})\trefs\/heads\/(.+)$/.exec(l.trim());
    if (m) r.push({ sha: m[1]!, nome: m[2]! });
  }
  return r;
}
