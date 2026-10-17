/**
 * NENHUM COMMIT, NENHUM PUSH NOS VIZINHOS — E A PÁGINA DIZIA ISSO SEM PERGUNTAR. (LAB-162, item 900, a dívida própria,
 * D390)
 *
 * # A linha, e o que a guardava
 *
 * O `docs/SEGURANCA.md`, tabela *Os repositórios vizinhos*, do LF-FINAL (14/09), diz: *"Nenhum commit, nenhum push nos
 * vizinhos · ✅ · o histórico deles não tem commit desta sessão"*; e o LF-FINAL-2 (15/09) acrescentou *"Os commits dos
 * clones vizinhos são **deles**, não meus"*, conferido por `git log --since=2026-09-13 --format="%an"`. Foi um comando
 * rodado duas vezes e nunca mais (espécie *mensagem fixa que afirma estado sem perguntar*). A trava do LAB-38
 * (`regras.test.ts`, §4) pergunta outra coisa — que o clone **na minha máquina** está limpo —, e um commit desta casa
 * enviado à origem de um vizinho deixa o clone limpo.
 *
 * **E o comando de 15/09 já não responderia hoje:** ele lia o AUTOR, e o autor de todo commit de sessão da família é o
 * mesmo — `Claude <noreply@anthropic.com>` (204 no Laboratório de Parcelamento, 1 076 no Generate, 449 no Geo, medidos em
 * 17/10). O autor não diz de qual casa veio o commit.
 *
 * # O que identifica a casa: a SESSÃO
 *
 * Todo commit de sessão carrega o rodapé `Claude-Session: https://claude.ai/code/session_…`. Medido em 17/10, na
 * história inteira (todas as referências da origem, clones desrasados):
 *
 * - **14 sessões aparecem nesta casa e num vizinho.** Todas são **da direção** — a sessão do chat, que escreve nas caixas
 *   de entrada das onze casas na mesma rodada. Nesta casa, os commits delas mexem só em `docs/caixa-de-entrada/`, com
 *   **duas** exceções de 09/10, o dia em que a direção montou a caixa: `6f43837` (o `docs/INDEX.md` passou a apontar para
 *   a pasta) e `d103582` (o `.claude/settings.json`). As duas estão em {@link COMMITS_DA_DIRECAO_FORA_DA_CAIXA}, com o
 *   motivo.
 * - **Nenhuma sessão que trabalhou nesta casa aparece num vizinho**, e **nenhum commit de vizinho tem o assunto desta
 *   casa** (`LAB-<n>`). A linha é verdadeira; faltava a pergunta.
 *
 * # A régua
 *
 * 1. **Sessão da casa** é a de todo commit desta casa que **não** é da direção. Da direção é o commit que só mexe em
 *    `docs/caixa-de-entrada/` sem nada `-FEITO` (fechar item é trabalho da casa), ou um dos declarados.
 * 2. Sessão da casa no rodapé de commit de vizinho → `sessao-da-casa-no-vizinho`.
 * 3. Assunto `LAB-<n>` em commit de vizinho → `assunto-da-casa-no-vizinho` (pega o commit sem rodapé que veio daqui).
 * 4. Declaração que não acha o commit, ou cujo commit já cabe na caixa → `declaracao-que-sobra`. A lista desce com a
 *    história.
 * 5. História rasa → `historia-rasa`: no raso, *"nenhum"* é falta de história, nunca fato (D293).
 * 6. Universo vazio (nenhum commit desta casa ou de um vizinho lido) → `universo-vazio`: *"nenhuma das 0"* não é verde
 *    (D213).
 *
 * # O que ela NÃO alcança — dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */

/** A linha do `docs/SEGURANCA.md` que esta régua responde, conferida por `aRegraEstaEscrita`. */
export const A_LINHA = "Nenhum commit, nenhum push nos vizinhos";

/** O ponteiro que a linha passa a carregar. */
export const O_PONTEIRO = "external-engines/esteira/src/nenhum-commit-nos-vizinhos.ts";

/** Onde a direção escreve nesta casa. Commit que só mexe aqui, sem fechar item, é dela. */
export const A_CAIXA = "docs/caixa-de-entrada/";

/** O rodapé de sessão, em qualquer lugar da mensagem — com ou sem a chave `Claude-Session:`. */
export const SESSAO = /claude\.ai\/code\/(session_[A-Za-z0-9]+)/g;

/** O assunto de um commit desta casa: o nome do prompt (D-`nome-do-prompt`), no começo. */
export const ASSUNTO_DA_CASA = /^LAB-\d+\b/;

/**
 * Os commits da direção que mexem FORA da caixa — o dia em que ela montou o ciclo. Fechado, com motivo; prefixo de
 * hash de 7 caracteres, como o `git log --oneline` o mostra.
 */
export const COMMITS_DA_DIRECAO_FORA_DA_CAIXA: readonly { hash: string; motivo: string }[] = [
  {
    hash: "6f43837",
    motivo:
      "09/10/2026, a direção cria a caixa de entrada (COMO_FUNCIONA.md e os itens 001 a 004) e o docs/INDEX.md passa a " +
      "apontar para a pasta — a mesma sessão escreveu nas caixas das outras casas",
  },
  {
    hash: "d103582",
    motivo:
      "09/10/2026, a direção grava o .claude/settings.json desta casa para a sessão parar de pedir permissão ao Jonny " +
      "a cada comando — nenhum código, nenhuma prova; a mesma sessão escreveu nas caixas das outras casas",
  },
];

/** O que esta régua NÃO alcança — publicado na saída, para o silêncio não parecer cobertura. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o commit SEM rodapé de sessão e sem o assunto LAB-<n>: um commit desta casa escrito à mão num vizinho, com outro " +
    "assunto, não tem como ser atribuído — o autor é o mesmo em toda a família",
  "os commits antigos desta casa sem rodapé (as primeiras rodadas e as mesclas por git direto): a sessão deles não entra " +
    "no conjunto das sessões da casa — publicados no universo, não perguntados",
  "o que não chegou à ORIGEM: push recusado, ramo local de vizinho, commit apagado da origem por quem é dono dela",
  "outro repositório que não seja um dos três vizinhos que esta casa lê (a Central, as outras casas): §4 fala dos " +
    "clones, e são eles os lidos",
  "a sessão da direção que, numa mesma rodada, fizesse trabalho de código nesta casa e num vizinho: o commit dela fora " +
    "da caixa é sessão da casa e acusa — por isso as duas exceções de 09/10 estão declaradas, e a próxima reprova",
];

export interface Commit {
  hash: string;
  assunto: string;
  /** As sessões do rodapé, sem repetição. */
  sessoes: string[];
  /** Os caminhos que o commit toca (só lidos desta casa). */
  caminhos?: string[];
}

export interface Historia {
  repo: string;
  rasa: boolean;
  commits: Commit[];
}

export type TipoDoProblema =
  | "sessao-da-casa-no-vizinho"
  | "assunto-da-casa-no-vizinho"
  | "declaracao-que-sobra"
  | "historia-rasa"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDoProblema;
  repo: string;
  detalhe: string;
}

export interface Universo {
  commitsDaCasa: number;
  daCasaComSessao: number;
  sessoesDaCasa: number;
  sessoesDaDirecao: number;
  vizinhos: { repo: string; commits: number; comSessao: number; sessoesEmComumComADirecao: number }[];
}

export interface Resultado {
  problemas: Problema[];
  universo: Universo;
}

/** As sessões citadas numa mensagem de commit, sem repetição e em ordem. */
export function sessoesDaMensagem(mensagem: string): string[] {
  return [...new Set([...mensagem.matchAll(SESSAO)].map((m) => m[1]!))].sort();
}

/** Separadores do `git log` lido por {@link lerOGitLog}. */
const REG = "\x1e";
const CAMPO = "\x1f";

/** Os argumentos do `git log` que {@link lerOGitLog} sabe ler; `comCaminhos` acrescenta os arquivos tocados. */
export function argumentosDoGitLog(comCaminhos: boolean): string[] {
  return [
    "log",
    "--remotes=origin",
    "--no-renames",
    `--format=${REG}%H${CAMPO}%s${CAMPO}%B${CAMPO}`,
    ...(comCaminhos ? ["--name-only"] : []),
  ];
}

/** Lê a saída de `git log` com {@link argumentosDoGitLog}. */
export function lerOGitLog(saida: string): Commit[] {
  return saida
    .split(REG)
    .filter((r) => r.trim() !== "")
    .map((r) => {
      const [hash = "", assunto = "", corpo = "", resto = ""] = r.split(CAMPO);
      const caminhos = resto
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "");
      return { hash, assunto, sessoes: sessoesDaMensagem(corpo), caminhos };
    });
}

const declarado = (hash: string) => COMMITS_DA_DIRECAO_FORA_DA_CAIXA.find((d) => hash.startsWith(d.hash));

/** O commit cabe na caixa da direção: toca alguma coisa, tudo dentro dela, e não fecha item. */
export function soNaCaixa(c: Commit): boolean {
  const cs = c.caminhos ?? [];
  return cs.length > 0 && cs.every((p) => p.startsWith(A_CAIXA) && !/-FEITO\.md$/.test(p));
}

/** É da direção: cabe na caixa, ou é uma das exceções declaradas. */
export const ehDaDirecao = (c: Commit): boolean => soNaCaixa(c) || declarado(c.hash) !== undefined;

export function conferirNenhumCommitNosVizinhos(e: { casa: Historia; vizinhos: Historia[] }): Resultado {
  const problemas: Problema[] = [];
  for (const h of [e.casa, ...e.vizinhos]) {
    if (h.rasa) {
      problemas.push({
        tipo: "historia-rasa",
        repo: h.repo,
        detalhe: `clone raso — desrase com \`git -C <clone> fetch --unshallow origin\`; no raso, "nenhum" é falta de história`,
      });
    }
    if (h.commits.length === 0) {
      problemas.push({ tipo: "universo-vazio", repo: h.repo, detalhe: "nenhum commit lido — nada foi perguntado" });
    }
  }

  const daCasa = new Set<string>();
  const daDirecao = new Set<string>();
  for (const c of e.casa.commits) for (const s of c.sessoes) (ehDaDirecao(c) ? daDirecao : daCasa).add(s);

  for (const d of COMMITS_DA_DIRECAO_FORA_DA_CAIXA) {
    const c = e.casa.commits.find((x) => x.hash.startsWith(d.hash));
    if (!c) {
      problemas.push({ tipo: "declaracao-que-sobra", repo: e.casa.repo, detalhe: `${d.hash}: não está na história` });
    } else if (soNaCaixa(c)) {
      problemas.push({ tipo: "declaracao-que-sobra", repo: e.casa.repo, detalhe: `${d.hash}: já cabe na caixa` });
    }
  }

  const vizinhos: Universo["vizinhos"] = [];
  for (const v of e.vizinhos) {
    const comum = new Set<string>();
    for (const c of v.commits) {
      if (ASSUNTO_DA_CASA.test(c.assunto)) {
        problemas.push({ tipo: "assunto-da-casa-no-vizinho", repo: v.repo, detalhe: `${c.hash.slice(0, 7)} ${c.assunto}` });
      }
      for (const s of c.sessoes) {
        if (daCasa.has(s)) {
          problemas.push({
            tipo: "sessao-da-casa-no-vizinho",
            repo: v.repo,
            detalhe: `${c.hash.slice(0, 7)} ${s} — ${c.assunto}`,
          });
        } else if (daDirecao.has(s)) comum.add(s);
      }
    }
    vizinhos.push({
      repo: v.repo,
      commits: v.commits.length,
      comSessao: v.commits.filter((c) => c.sessoes.length > 0).length,
      sessoesEmComumComADirecao: comum.size,
    });
  }

  return {
    problemas,
    universo: {
      commitsDaCasa: e.casa.commits.length,
      daCasaComSessao: e.casa.commits.filter((c) => c.sessoes.length > 0).length,
      sessoesDaCasa: daCasa.size,
      sessoesDaDirecao: daDirecao.size,
      vizinhos,
    },
  };
}
