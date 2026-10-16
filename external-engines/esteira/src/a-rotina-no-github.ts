/**
 * A ROTINA NO GITHUB — o segundo passo do desligamento, afirmado em quatro lugares e nunca
 * perguntado. (LAB-122, item 900, a dívida própria, D350)
 *
 * # A regra, e o defeito medido em 16/10/2026
 *
 * O CI desta casa foi desligado em 08/10/2026 em **dois** passos (LAB-67, D220): o gatilho
 * `push`/`pull_request` comentado no `.github/workflows/verde.yml` **e** a rotina desabilitada no
 * painel do GitHub. *"Religar são DOIS passos, e quem fizer só o primeiro vai achar que o GitHub
 * quebrou"* — a frase está no `CLAUDE.md`, no `verde.yml`, no `COMO_RELIGAR_O_CI.md` e no
 * `ONDE_PARAMOS.md`.
 *
 * O primeiro passo tem guarda desde o LAB-67: `gatilho-do-verde.test.ts` lê o arquivo. O
 * **segundo não tinha nenhuma**. Enumerados por LUGAR os arquivos vivos (fora de relato), a
 * rotina é afirmada `disabled_manually` em **quatro** lugares e o id dela (`374646435`) digitado
 * em **três** — e nenhum `.ts` perguntava ao GitHub. É a quinta espécie da dívida própria,
 * *mensagem fixa que afirma estado sem perguntar*: o estado mora **fora** da árvore, e muda sem
 * commit — basta um clique em *"Enable workflow"*.
 *
 * Perguntado (`GET /repos/{dono}/{repo}/actions/workflows`, sem chave: o repositório é público), o
 * GitHub respondeu `disabled_manually`, id `374646435`, caminho `.github/workflows/verde.yml`. As
 * quatro frases e os três ids estavam **certos** — e eram certos por sorte, não por conferência.
 *
 * # O que este módulo faz
 *
 * - {@link lerARotina} — lê a resposta da API e acha a rotina pelo **caminho** (o nome de tela
 *   pode mudar; o caminho é o que o `verde.yml` é). Resposta ilegível ou sem a rotina é `null`:
 *   *não sei* não é *não há* (D23).
 * - {@link afirmacoesDaRotina} — acha, num texto, o **estado** afirmado (`disabled_manually`,
 *   `disabled_inactivity`, `disabled_fork`) e o **id** digitado num endereço da API **desta**
 *   casa (`/repos/<dono>/<repo>/actions/workflows/<id>`). Endereço de outro repositório não é
 *   desta régua.
 * - {@link conferirARotina} — cruza as três coisas, nos dois sentidos:
 *   1. **o par**: gatilho ligado ⇔ rotina `active`. Gatilho descomentado com a rotina desabilitada,
 *      ou o contrário, é **o passo pela metade** — o defeito que a receita de religar nasceu para
 *      impedir, e que nenhuma régua via;
 *   2. **o estado afirmado** é o estado perguntado;
 *   3. **o id digitado** é o id perguntado;
 *   4. **o espelho**: rotina desabilitada **e ninguém dizendo** reprova — senão o aviso some de
 *      todas as páginas e a régua fica verde com zero afirmações (*"verde: nenhuma de 0"*).
 *
 * A pergunta ao GitHub mora na trava viva, `tests/a-rotina-no-github-na-origem.test.ts`, fora do
 * portão sem clones: precisa da **rede**, e a régua pura não.
 *
 * # O que ele NÃO alcança, dito
 *
 * - o estado dito **com outras palavras** (*"desabilitada no GitHub"*, *"a trava que de fato
 *   segura"*): é régua de palavra, e palavra não pega o que não reconhece — por isso o espelho
 *   cobra que ao menos uma frase diga o estado **pelo nome que a API usa**;
 * - **relato datado** (`ONDE_PARAMOS.md`, `DECISOES.md`, relatórios, provas): verdadeiro na data
 *   em que foi escrito; a lista é a do `o-ci-que-roda.ts` (`ehRelato`), uma só para as duas
 *   réguas;
 * - **se o `workflow_dispatch` funciona com a rotina desabilitada** — o `verde.yml` diz que ele
 *   *"segue ligado para rodar à mão"*; perguntar seria **disparar** a rotina, que é ato, e não
 *   leitura. Fica escrito *"não testado"* no relatório do LAB-122;
 * - a trava viva **não roda no CI** (gatilho desligado), e no dia em que rodar a pergunta sem
 *   chave divide a cota de 60 por hora do endereço de saída do runner — quem a executa é a
 *   sessão, no `conferir.sh`.
 */

import { type ArquivoLido, EXTENSOES_LIDAS, ehRelato } from "./o-ci-que-roda.ts";

/** A rotina como a API a mostra. */
export interface RotinaNoGitHub {
  id: number;
  caminho: string;
  estado: string;
}

/** O caminho da rotina, como o repositório a guarda. A régua procura a rotina por ELE. */
export const CAMINHO_DA_ROTINA = ".github/workflows/verde.yml";

/** O estado em que a rotina roda. Todo outro (`disabled_*`) é desligada. */
export const ESTADO_LIGADO = "active";

/** Os estados de desligada que a API documenta, e que a régua reconhece num texto. */
const ESTADO_AFIRMADO = /\bdisabled_(?:manually|inactivity|fork)\b/g;

/** O id digitado num endereço da API, com o dono e o repositório — só os desta casa contam. */
const ID_NO_ENDERECO = /\/repos\/([\w.-]+)\/([\w.-]+)\/actions\/workflows\/(\d+)\b/g;

/** Lê a resposta de `GET /repos/{dono}/{repo}/actions/workflows`. Sem a rotina, `null`. */
export function lerARotina(json: string, caminho: string = CAMINHO_DA_ROTINA): RotinaNoGitHub | null {
  let dado: unknown;
  try {
    dado = JSON.parse(json);
  } catch {
    return null;
  }
  const lista = (dado as { workflows?: unknown })?.workflows;
  if (!Array.isArray(lista)) return null;
  for (const w of lista as { id?: unknown; path?: unknown; state?: unknown }[]) {
    if (w?.path === caminho && typeof w.id === "number" && typeof w.state === "string") {
      return { id: w.id, caminho: w.path, estado: w.state };
    }
  }
  return null;
}

/** Uma afirmação achada num texto: o estado da rotina, ou o id dela. */
export type AfirmacaoDaRotina =
  | { tipo: "estado"; arquivo: string; linha: number; estado: string }
  | { tipo: "id"; arquivo: string; linha: number; id: number };

/** Acha, linha por linha, o estado afirmado e o id digitado no endereço da API desta casa. */
export function afirmacoesDaRotina(arquivo: string, texto: string, repositorio: string): AfirmacaoDaRotina[] {
  const r: AfirmacaoDaRotina[] = [];
  texto.split("\n").forEach((l, i) => {
    for (const m of l.matchAll(ESTADO_AFIRMADO)) r.push({ tipo: "estado", arquivo, linha: i + 1, estado: m[0] });
    for (const m of l.matchAll(ID_NO_ENDERECO)) {
      if (`${m[1]}/${m[2]}` === repositorio) r.push({ tipo: "id", arquivo, linha: i + 1, id: Number(m[3]) });
    }
  });
  return r;
}

export type TipoDeProblemaDaRotina =
  | "nao-sei-o-estado"
  | "passo-pela-metade"
  | "estado-afirmado-que-nao-e"
  | "id-que-nao-e-da-rotina"
  | "desligada-sem-quem-diga";

export interface ProblemaDaRotina {
  tipo: TipoDeProblemaDaRotina;
  onde: string;
}

/** Cruza o gatilho, a rotina perguntada e as afirmações vivas. Lista vazia é o lado bom. */
export function conferirARotina(
  gatilhoLigado: boolean,
  rotina: RotinaNoGitHub | null,
  afirmacoes: readonly AfirmacaoDaRotina[],
): ProblemaDaRotina[] {
  if (rotina === null) return [{ tipo: "nao-sei-o-estado", onde: CAMINHO_DA_ROTINA }];
  const problemas: ProblemaDaRotina[] = [];
  const rotinaLigada = rotina.estado === ESTADO_LIGADO;
  if (gatilhoLigado !== rotinaLigada) {
    problemas.push({
      tipo: "passo-pela-metade",
      onde: `gatilho ${gatilhoLigado ? "ligado" : "comentado"}, rotina '${rotina.estado}'`,
    });
  }
  for (const a of afirmacoes) {
    const onde = `${a.arquivo}:${a.linha}`;
    if (a.tipo === "estado" && a.estado !== rotina.estado) {
      problemas.push({ tipo: "estado-afirmado-que-nao-e", onde: `${onde} diz '${a.estado}', a API diz '${rotina.estado}'` });
    }
    if (a.tipo === "id" && a.id !== rotina.id) {
      problemas.push({ tipo: "id-que-nao-e-da-rotina", onde: `${onde} diz ${a.id}, a API diz ${rotina.id}` });
    }
  }
  if (!rotinaLigada && !afirmacoes.some((a) => a.tipo === "estado" && a.estado === rotina.estado)) {
    problemas.push({ tipo: "desligada-sem-quem-diga", onde: `rotina '${rotina.estado}' e nenhuma página viva o diz` });
  }
  return problemas;
}

/**
 * Os arquivos que falam da rotina **para testá-la**: a própria régua e as travas dela. Não são
 * afirmação de estado — são o instrumento. Lista à mão, conferida nos dois sentidos pela trava.
 */
export const DA_PROPRIA_REGUA: readonly string[] = [
  "external-engines/esteira/src/a-rotina-no-github.ts",
  "external-engines/esteira/tests/a-rotina-no-github.test.ts",
  "external-engines/esteira/tests/a-rotina-no-github-na-origem.test.ts",
];

/** O universo lido: as afirmações, e quantos arquivos se leram e se deixaram por serem relato. */
export interface AfirmacoesDaArvore {
  afirmacoes: AfirmacaoDaRotina[];
  lidos: number;
  deRelato: number;
}

/**
 * As afirmações da árvore versionada, fora de relato (a lista do `o-ci-que-roda.ts`) e fora da
 * própria régua, nas extensões que aquela régua lê — uma lista só para as duas (D231).
 */
export function afirmacoesDaArvore(arvore: readonly ArquivoLido[], repositorio: string): AfirmacoesDaArvore {
  const deTexto = arvore.filter((a) => EXTENSOES_LIDAS.some((e) => a.arquivo.endsWith(e)));
  const vivos = deTexto.filter((a) => !ehRelato(a.arquivo) && !DA_PROPRIA_REGUA.includes(a.arquivo));
  return {
    afirmacoes: vivos.flatMap((a) => afirmacoesDaRotina(a.arquivo, a.texto, repositorio)),
    lidos: vivos.length,
    deRelato: deTexto.filter((a) => ehRelato(a.arquivo)).length,
  };
}

/** Lê `dono/repo` de um endereço `git remote` do GitHub (https ou ssh). Outro host, `null`. */
export function repositorioDoRemoto(url: string): string | null {
  const m = /github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/.exec(url.trim());
  return m ? `${m[1]}/${m[2]}` : null;
}
