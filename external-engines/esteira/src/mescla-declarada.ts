/**
 * SEM PR, MESCLAR COM `--no-ff` E DECLARAR — e nada perguntava se a entrega tinha entrado assim. (LAB-138, item 900,
 * a dívida própria, D366)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §1-A: *"**Sem `mcp__github__*`**, mesclar com `git merge --no-ff` na `main` e declarar (D29)."* A D29
 * (14/09/2026) diz o porquê e o onde: o despertador nasceu sem os conectores do GitHub, a sessão que ele acorda não abre
 * PR, e então mescla **por git direto** e **declara isso no relatório e no recado** — porque o chat lê a `main` e o
 * `RECADOS.md`, e entrega sem PR que não se diz sem PR parece ter passado por um lugar onde ninguém a viu.
 *
 * Nada lia a primeira linha da `main`. Medido pelo caso de verdade, não por mutação plantada: **duas entregas desta casa
 * entraram direto, sem mescla** — o LAB-102 (`7d0e635`, 13/10, 17 arquivos) e o LAB-114 (`b6b32bb`, 15/10, 16 arquivos)
 * —, sem dizer nada nem no recado nem no relatório, e a suíte inteira está verde com as duas na história (1 532
 * aprovadas e 9 reprovadas, as nove do `.wasm`). *Regra sem guarda*, a primeira espécie da dívida própria — e, como na
 * do `adapter/` (LAB-135), **já quebrada quando alguém olhou**.
 *
 * A metade da declaração também: das 41 mesclas por git direto, **todas** dizem *"mesclado por git direto (D29)"* no
 * assunto do commit, e **nenhum** dos 44 recados do LAB-95 ao LAB-137 diz, nem o relatório de nenhum deles — a
 * declaração foi morar no único lugar que a D29 não nomeou.
 *
 * # O que se mediu, por LUGAR
 *
 * A primeira linha da `main` (`git log --first-parent main`), inteira — 201 commits em 16/10/2026 —, com quem GRAVOU
 * cada um (o *committer*, não o autor) e quantos pais ele tem:
 *
 * | quem gravou | pais | quantos | o que é |
 * |---|---|---|---|
 * | `GitHub <noreply@github.com>` | 0 | 1 | o `Initial commit` |
 * | `GitHub` | 1 | 9 | PR espremido pela interface, de antes da D29 (LAB-07 a LF-FINAL) |
 * | `GitHub` | 2 | 114 | PR mesclado pela interface ou pela API — inclusive os nove do LAB-39 ao LAB-47, que **não** têm `(#N)` no assunto |
 * | local | 2 | 41 | mescla por git direto, **todas** declaradas no assunto |
 * | local | 1 | 32 | escrita da direção **só** na caixa de entrada |
 * | local | 1 | 4 | **o resto**: o LAB-102 e o LAB-114 (entregas desta casa) e duas escritas da direção fora da caixa |
 *
 * **Quem grava é a pergunta certa, e o assunto é a errada:** a primeira tentativa separou PR de mescla local pelo
 * `(#N)` no assunto, e deixava nove PRs de verdade como *"mesclas sem declaração"*. O GitHub grava como ele mesmo o que
 * mescla; a mescla local é gravada por quem a fez.
 *
 * # Como ela cobra
 *
 * Cada commit da primeira linha cai num de cinco montes, e dois deles são problema:
 *
 * - **`raiz`** — sem pai;
 * - **`pela-interface`** — gravado pelo GitHub: é PR, e a D29 não se aplica;
 * - **`so-a-caixa`** — gravado aqui, com todo arquivo em `docs/caixa-de-entrada/`: é a mão da direção escrevendo o
 *   pedido, que o protocolo manda escrever direto na `main`, e não é entrega;
 * - **`mescla-declarada`** — gravado aqui, com dois pais e a {@link DECLARACAO} no assunto;
 * - **`entrega-sem-mescla`** (problema) — gravado aqui, com um pai e arquivo fora da caixa: entrou direto;
 * - **`mescla-sem-declaracao`** (problema) — gravado aqui, com dois pais e sem a frase.
 *
 * Os quatro do *"resto"* são exceção nomeada, um por um, em {@link EXCECOES_HISTORICAS}: a história da `main` não se
 * reescreve (sem `--force`, regra da casa). A exceção é conferida nos dois sentidos — tem de continuar perdoando alguém,
 * e só perdoa o problema que ela nomeia.
 *
 * E a outra metade, no texto: **do {@link PRIMEIRO_PROMPT_COBRADO} em diante, o recado e o relatório dizem como a
 * entrega entrou** — a {@link DECLARACAO}, ou o PR (`PR #N`). Os de antes são registro do que foi enviado, e não se
 * reescrevem (a mesma regra do LAB-130).
 *
 * # Onde ela roda
 *
 * - **no gancho do envio** (`ferramentas/antes-do-envio.ts`, LAB-106): os commits da primeira linha que vão à `main`
 *   nesse envio passam por {@link conferirAPrimeiraLinha} antes de qualquer trava — o único instante que é, por
 *   definição, depois da mescla;
 * - **na suíte** (`tests/mescla-declarada.test.ts`): a `main` local inteira, quando a história está inteira; num clone
 *   raso (o CI), a leitura **recusa** pelo LAB-89 (D295) em vez de responder o corte.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **quem grava mentindo**: um commit local gravado com `GITHUB_COMMITTER_EMAIL` trocado passa por PR. É fraude
 *   deliberada, não esquecimento, e é o esquecimento que a régua pega;
 * - **a entrega que só mexe na caixa**: cai em `so-a-caixa`, como a direção. Nenhuma entrega desta casa é só isso — ela
 *   sempre traz o recado —, e o recado mora em `docs/relatorios/`;
 * - **os ramos**: só a primeira linha da `main`, que é o que o chat lê e o que o próximo clone recebe;
 * - **a mescla `--no-ff` de ramo que não tem nada**: dois pais e a frase passam, mesmo que o segundo pai seja o primeiro;
 * - **se a declaração é verdadeira**: o recado que diz *"mesclado por git direto"* de uma entrega que foi por PR passa.
 */

/** A frase da regra, conferida no teste onde ela mora (o `CLAUDE.md` §1-A). */
export const A_REGRA = "mesclar com `git merge --no-ff` na `main` e declarar (D29).";

/** A declaração, como as 41 mesclas por git direto a escrevem no assunto do commit desde o LAB-95. */
export const DECLARACAO = "mesclado por git direto (D29)";

/** O e-mail com que o GitHub grava o que ele mesmo mescla (PR pela interface ou pela API). */
export const QUEM_GRAVA_O_PR = "noreply@github.com";

/** A pasta que a direção escreve direto na `main`, por protocolo. */
export const A_CAIXA = "docs/caixa-de-entrada/";

/** O primeiro prompt cujo recado e relatório têm de dizer como a entrega entrou: este. */
export const PRIMEIRO_PROMPT_COBRADO = 138;

/** Um commit da primeira linha da `main`, como o `git` o descreve. */
export interface CommitDaLinha {
  hash: string;
  /** Quantos pais (`%P`). */
  pais: number;
  /** O e-mail de quem GRAVOU (`%ce`) — não o autor. */
  quemGravou: string;
  assunto: string;
  /** Os arquivos que ele muda em relação ao primeiro pai. */
  arquivos: readonly string[];
}

export type Monte = "raiz" | "pela-interface" | "so-a-caixa" | "mescla-declarada" | "entrega-sem-mescla" | "mescla-sem-declaracao";
export type TipoDeProblemaDaMescla = Extract<Monte, "entrega-sem-mescla" | "mescla-sem-declaracao">;

export interface ProblemaDaMescla {
  hash: string;
  tipo: TipoDeProblemaDaMescla;
  detalhe: string;
}

export interface ExcecaoDaMescla {
  /** O hash curto (7) do commit, como o `git log --oneline` o mostra. */
  hash: string;
  /** O único problema que ela perdoa. */
  tipo: TipoDeProblemaDaMescla;
  motivo: string;
}

/**
 * **Quatro**, os commits da primeira linha que nem o GitHub gravou, nem são só a caixa, nem são mescla — medidos em
 * 16/10/2026. Dois são entregas desta casa que entraram direto; dois são a direção escrevendo fora da caixa.
 */
export const EXCECOES_HISTORICAS: readonly ExcecaoDaMescla[] = [
  {
    hash: "6f43837",
    tipo: "entrega-sem-mescla",
    motivo:
      "a direção, 09/10/2026: o NASCIMENTO da caixa — o COMO_FUNCIONA.md e os itens 001 a 004 —, e a linha dela no docs/INDEX.md. A caixa ainda não existia para conter a escrita",
  },
  {
    hash: "d103582",
    tipo: "entrega-sem-mescla",
    motivo:
      "a direção, 09/10/2026: o .claude/settings.json (a sessão para de interromper o Jonny) — configuração da sessão, escrita pela mão que não roda as travas desta casa",
  },
  {
    hash: "7d0e635",
    tipo: "entrega-sem-mescla",
    motivo:
      "o LAB-102, 13/10/2026: entrega DESTA casa commitada direto na main, sem mescla e sem dizer — o defeito que esta régua existe para pegar. A história não se reescreve",
  },
  {
    hash: "b6b32bb",
    tipo: "entrega-sem-mescla",
    motivo:
      "o LAB-114, 15/10/2026: entrega DESTA casa commitada direto na main, sem mescla e sem dizer — a segunda vez, dois dias depois. A história não se reescreve",
  },
];

/** Em que monte cai um commit da primeira linha — sem olhar exceção nenhuma. */
export function monteDe(c: CommitDaLinha): Monte {
  if (c.pais === 0) return "raiz";
  if (c.quemGravou.trim().toLowerCase() === QUEM_GRAVA_O_PR) return "pela-interface";
  if (c.arquivos.length > 0 && c.arquivos.every((a) => a.startsWith(A_CAIXA))) return "so-a-caixa";
  if (c.pais >= 2) return c.assunto.includes(DECLARACAO) ? "mescla-declarada" : "mescla-sem-declaracao";
  return "entrega-sem-mescla";
}

const DETALHE: Record<TipoDeProblemaDaMescla, string> = {
  "entrega-sem-mescla": "gravado aqui, com UM pai e arquivo fora da caixa — a entrega entrou direto na main, sem mescla",
  "mescla-sem-declaracao": `gravado aqui, com dois pais, e o assunto não diz "${DECLARACAO}"`,
};

/** O hash da exceção casa com o do commit pelo começo — o curto do `--oneline` contra o inteiro do `git`. */
const casa = (curto: string, inteiro: string): boolean => curto.length >= 7 && inteiro.startsWith(curto);

/**
 * Confere a primeira linha da `main`, do mais novo ao mais velho (a ordem do `git log`; a régua não depende dela).
 * Publica o universo — quantos em cada monte —, para que *"nenhum problema"* nunca seja *"nenhum commit lido"* (D213).
 */
export function conferirAPrimeiraLinha(
  commits: readonly CommitDaLinha[],
  excecoes: readonly ExcecaoDaMescla[] = EXCECOES_HISTORICAS,
): {
  universo: Record<Monte, number> & { commits: number };
  problemas: ProblemaDaMescla[];
  perdoados: ProblemaDaMescla[];
  /** Exceção que não perdoou nada: o commit não está na linha lida, ou o problema dele não é o que ela nomeia. */
  excecoesSemUso: ExcecaoDaMescla[];
} {
  const universo = {
    commits: commits.length,
    raiz: 0,
    "pela-interface": 0,
    "so-a-caixa": 0,
    "mescla-declarada": 0,
    "entrega-sem-mescla": 0,
    "mescla-sem-declaracao": 0,
  } satisfies Record<Monte, number> & { commits: number };
  const problemas: ProblemaDaMescla[] = [];
  const perdoados: ProblemaDaMescla[] = [];
  const usadas = new Set<ExcecaoDaMescla>();

  for (const c of commits) {
    const monte = monteDe(c);
    universo[monte]++;
    if (monte !== "entrega-sem-mescla" && monte !== "mescla-sem-declaracao") continue;
    const p: ProblemaDaMescla = { hash: c.hash, tipo: monte, detalhe: `${c.hash.slice(0, 7)} "${c.assunto.slice(0, 70)}": ${DETALHE[monte]}` };
    const e = excecoes.find((x) => casa(x.hash, c.hash) && x.tipo === monte);
    if (e === undefined) problemas.push(p);
    else {
      perdoados.push(p);
      usadas.add(e);
    }
  }

  return { universo, problemas, perdoados, excecoesSemUso: excecoes.filter((e) => !usadas.has(e)) };
}

/**
 * Lê a saída de `git log --first-parent --format=%x00%H%x1f%P%x1f%ce%x1f%s --name-only <ref>`: cada commit abre com um
 * `NUL`, os campos se separam por `US`, e os arquivos vêm um por linha depois do cabeçalho.
 */
export function lerALinha(saida: string): CommitDaLinha[] {
  const commits: CommitDaLinha[] = [];
  for (const pedaco of saida.split("\u0000")) {
    if (pedaco.trim() === "") continue;
    const [cabecalho, ...resto] = pedaco.split("\n");
    const [hash, pais, quemGravou, ...assunto] = (cabecalho ?? "").split("\u001f");
    if (hash === undefined || !/^[0-9a-f]{40}$/.test(hash)) continue;
    commits.push({
      hash,
      pais: (pais ?? "").split(" ").filter(Boolean).length,
      quemGravou: quemGravou ?? "",
      assunto: assunto.join("\u001f"),
      arquivos: resto.map((l) => l.trim()).filter(Boolean),
    });
  }
  return commits;
}

/**
 * O que o gancho do envio diz quando a primeira linha que vai à `main` tem problema — lista vazia é *"pode ir"*.
 * Os commits são os do ENVIO (`<remoto>..<local>`, primeira linha), não a história inteira.
 */
export function motivosDaMescla(commits: readonly CommitDaLinha[]): string[] {
  return conferirAPrimeiraLinha(commits).problemas.map((p) => `${p.detalhe} (CLAUDE.md §1-A, D29)`);
}

/** Os argumentos do `git log` que {@link lerALinha} lê — escritos uma vez, para a suíte e o gancho pedirem o mesmo. */
export const argumentosDoLog = (alcance: string): string[] => [
  "log",
  "--first-parent",
  "--format=%x00%H%x1f%P%x1f%ce%x1f%s",
  "--name-only",
  "--no-renames",
  alcance,
];

// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//  A outra metade: o recado e o relatório dizem como a entrega entrou.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** O texto diz como a entrega entrou: a {@link DECLARACAO}, ou o número do PR. */
export function dizComoEntrou(texto: string): boolean {
  return texto.includes(DECLARACAO) || /\bPR #\d+/.test(texto);
}

export type TipoDeProblemaDoTexto = "recado-nao-diz-como-entrou" | "relatorio-nao-diz-como-entrou" | "relatorio-ausente";

export interface ProblemaDoTexto {
  prompt: string;
  tipo: TipoDeProblemaDoTexto;
  detalhe: string;
}

/**
 * Confere o `RECADOS.md` e os relatórios do {@link PRIMEIRO_PROMPT_COBRADO} em diante. `recados` é a lista lida por
 * `lerOsRecados` (LAB-129); `relatorio(prompt)` devolve o texto de `docs/relatorios/<prompt>.md`, ou `null`.
 */
export function conferirADeclaracaoNoTexto(
  recados: readonly { cabecalho: string; corpo: readonly string[] }[],
  relatorio: (prompt: string) => string | null,
  desde: number = PRIMEIRO_PROMPT_COBRADO,
): { universo: { recados: number; antes: number; semPrompt: number; noAlcance: number }; problemas: ProblemaDoTexto[] } {
  const problemas: ProblemaDoTexto[] = [];
  let antes = 0;
  let semPrompt = 0;
  let noAlcance = 0;
  for (const r of recados) {
    const campo = r.cabecalho.split(" · ").slice(1).join(" · ");
    const numeros = [...campo.matchAll(/\bLAB-(\d{2,})\b/g)].map((m) => Number(m[1]));
    if (numeros.length === 0) {
      semPrompt++;
      continue;
    }
    const cobrados = [...new Set(numeros)].filter((n) => n >= desde);
    if (cobrados.length === 0) {
      antes++;
      continue;
    }
    noAlcance++;
    const corpo = r.corpo.join("\n");
    for (const n of cobrados) {
      const prompt = `LAB-${n}`;
      if (!dizComoEntrou(corpo)) {
        problemas.push({ prompt, tipo: "recado-nao-diz-como-entrou", detalhe: `o recado de ${prompt} não diz "${DECLARACAO}" nem "PR #N"` });
      }
      const texto = relatorio(prompt);
      if (texto === null) problemas.push({ prompt, tipo: "relatorio-ausente", detalhe: `não existe docs/relatorios/${prompt}.md` });
      else if (!dizComoEntrou(texto)) {
        problemas.push({ prompt, tipo: "relatorio-nao-diz-como-entrou", detalhe: `o relatório de ${prompt} não diz "${DECLARACAO}" nem "PR #N"` });
      }
    }
  }
  return { universo: { recados: recados.length, antes, semPrompt, noAlcance }, problemas };
}
