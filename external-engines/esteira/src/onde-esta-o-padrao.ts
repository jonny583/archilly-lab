/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ONDE ESTÁ O PADRÃO DA FAMÍLIA — a procedência, num lugar só. (item 021, LAB-88)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Esta casa **não vendoriza o kit** e, desde 11/10/2026, **não carrega cópia do Padrão
 * Archilly**. O que havia em `docs/referencia/PADRAO_ARCHILLY.md` era uma cópia de **145
 * linhas**, congelada na **Versão 1 de 13/09**, com o título de um documento normativo — e o
 * documento vigente tem **1 731 linhas**: era **8,4 % das linhas e 11,8 % dos bytes dele.**
 *
 * # Por que o ponteiro, e não a cópia atualizada (D292)
 *
 * A direção ofereceu três formas e mandou **medir** antes de escolher. Medido:
 *
 * 1. **A VERSÃO NÃO IDENTIFICA O CONTEÚDO.** O rótulo *"Versão 3.0 · 10/10/2026"* cobre **dois
 *    textos diferentes** na origem: `96dbc9b` (03:35, 1 712 linhas · 106 081 bytes) e
 *    `e48bff9` (20:36, **1 731** linhas · **107 395** bytes) — **+19 linhas e +1 314 bytes com o
 *    mesmo número.** E a cópia vendorizada do Parcelamento é byte a byte igual à **PRIMEIRA**:
 *    ela já está atrás, **sem que o número mude.** *Carimbar a versão numa cópia seria carimbar
 *    o rótulo e não a coisa — e rótulo não é identidade (D148).*
 * 2. **A FORMA 2 (trava contra o commit da origem) NÃO É EXECUTÁVEL AQUI, e é medição:**
 *    `jonny583/archilly-central` é **privado** e este repositório é **público**. O verde roda
 *    sem rede por desenho, e o trabalho de CI que roda em todo envio **não tem segredo** — o
 *    `GITHUB_TOKEN` do Actions não alcança repositório privado de fora. Seria um **terceiro**
 *    vizinho privado a pedir no §11, e a trava ficaria **verde por não achar o objeto**, que é
 *    o D213: *guarda que não acha o objeto não está aprovando, está sem medir nada.*
 * 3. **A FORMA 3 (congelar e declarar) morre com a nº 1:** declarar *"Versão 1, 8 % do
 *    vigente"* é declarar um **rótulo**, e quem abrisse o arquivo leria um documento normativo
 *    de 145 linhas com um aviso no índice de outra página.
 *
 * > **Documento normativo que esta casa não pode manter atualizado não deve morar nela.** O que
 * > fica é **onde ele está, qual commit foi lido e quando** — e o commit, não a versão, é o que
 * > identifica o texto.
 *
 * **E o texto da Versão 1 não se perdeu:** ele está no **histórico**, no commit em que a
 * conferência do LF-FINAL o leu ({@link COMMIT_DA_COPIA_QUE_SAIU}). *Arquivo que sai da árvore
 * continua no histórico; o que a saída tira é a autoridade de parecer vigente.*
 */

import { type LeituraDaHistoria, lerPelaHistoria } from "./profundidade-da-historia.ts";

/** A fonte do Padrão, conferida **na origem** em 11/10/2026 — nunca de clone no disco. */
export const A_FONTE_DO_PADRAO = {
  repositorio: "jonny583/archilly-central",
  visibilidade: "privado",
  ramo: "main",
  caminho: "docs/PADRAO_ARCHILLY.md",
  versao: "3.0 · 10/10/2026",
  commit: "e48bff9",
  quandoOCommitFoiFeito: "2026-10-10T20:36:15Z",
  /**
   * **O BLOB — o que identifica o TEXTO, e não depende da profundidade do clone** (LAB-89,
   * D294). `git rev-parse e48bff9:docs/PADRAO_ARCHILLY.md`.
   */
  blob: "f22f7deb742c4b9b758ade255735cd0979034f41",
  linhas: 1731,
  bytes: 107395,
  lidoEm: "2026-10-11",
  comoSeLe: "git show origin/main:docs/PADRAO_ARCHILLY.md",
} as const;

/**
 * **O commit em que o texto da Versão 1 está no histórico desta casa** — e ele é também a
 * correção de um número que eu publiquei errado ontem (D293).
 *
 * O D291 disse *"trazida em 03/10 no PR #40"*. **Medido com história inteira: entrou em
 * `4081c27`, de 14/09, no PR #12** — o commit da própria conferência do LF-FINAL —, e **nunca
 * foi tocada depois: um único commit em toda a vida do arquivo.** O erro de ontem saiu de um
 * **clone raso**: num `--depth 1`, o `git log` de um caminho responde o commit do **corte**, e
 * ele existe, tem data e assunto plausíveis, e **passa por medição**.
 */
export const COMMIT_DA_COPIA_QUE_SAIU = {
  commit: "4081c27",
  quando: "2026-09-14",
  pr: 12,
  caminho: "docs/referencia/PADRAO_ARCHILLY.md",
  versao: "1 · 13/09/2026",
  linhas: 145,
  bytes: 12716,
  comoSeLe: "git show 4081c27:docs/referencia/PADRAO_ARCHILLY.md",
  commitsQueATocaram: 1,
} as const;

/**
 * O rótulo "3.0" cobre dois textos — a medição que mata a forma 3, **agora pelo BLOB** (D294).
 *
 * ~~`{ commit: "96dbc9b", … }`~~ **O nome estava errado, e era de clone raso.** Medido com a
 * história inteira (245 commits), quem **entregou** este texto é **`67d18d5`** (10/10 00:38), e
 * `96dbc9b` **não está na história do arquivo** — ele só devolve o mesmo blob porque o arquivo
 * ainda não tinha mudado quando ele aconteceu. *Publiquei `96dbc9b` em quatro lugares e num PR
 * mesclado; a 29ª do ponto cego, e a quarta que escapou.*
 */
export const OS_DOIS_TEXTOS_DA_3_0 = [
  {
    blob: "f95b2838b16b3445be1ef6677dc09a7517c55981",
    entreguePor: "67d18d5",
    quando: "2026-10-10T00:38Z",
    linhas: 1712,
    bytes: 106081,
    /** Commits que DEVOLVEM este blob sem o terem entregue — e que um clone raso nomeia. */
    confirmadoSemEntregarPor: ["96dbc9b", "170a28f"],
  },
  {
    blob: "f22f7deb742c4b9b758ade255735cd0979034f41",
    entreguePor: "e48bff9",
    quando: "2026-10-10T20:36Z",
    linhas: 1731,
    bytes: 107395,
    confirmadoSemEntregarPor: [],
  },
] as const;

/** O caminho do ponteiro — **o mesmo da cópia que saiu**, para nenhum link morrer. */
export const CAMINHO_DO_PONTEIRO = "docs/referencia/PADRAO_ARCHILLY.md";

/**
 * A primeira linha do Padrão de verdade — o que o ponteiro **não pode** conter, senão alguém
 * recolou a cópia no lugar do ponteiro.
 */
export const O_TITULO_DO_PADRAO =
  "# PADRÃO ARCHILLY — COMO NASCE E COMO SE TRABALHA EM QUALQUER APP DA FAMÍLIA";

/**
 * **RECONFERIR a procedência só é possível com história inteira** (item 022, LAB-89).
 *
 * Esta é a porta por onde toda releitura da procedência passa: ela **pergunta a profundidade
 * antes** e **recusa** em clone raso, em vez de devolver o commit do corte. O `medir` só é
 * chamado quando a história está inteira — a recusa não mede.
 *
 * > **Não é a régua que decide se pode afirmar: é a profundidade do clone em que ela está
 * > rodando.** E o CI desta casa roda num clone raso (`actions/checkout` sem `fetch-depth`),
 * > então a recusa é o caminho NORMAL ali, e não um defeito.
 */
export function reconferirOCommitDaFonte(
  ehRaso: boolean | null,
  commitDoCaminhoNaOrigem: () => string | null,
): LeituraDaHistoria {
  return lerPelaHistoria(ehRaso, commitDoCaminhoNaOrigem);
}

/**
 * O commit gravado **bate** com o que a origem diz hoje? Devolve `null` quando **não se pode
 * afirmar** — e `null` aqui é "não medido", nunca "bate" nem "não bate" (D23).
 */
export function oCommitGravadoAindaEOMesmo(leitura: LeituraDaHistoria): boolean | null {
  if (!leitura.podeAfirmar || leitura.valor === null) return null;
  return leitura.valor.startsWith(A_FONTE_DO_PADRAO.commit);
}

export interface ProblemaDoPonteiro {
  tipo: "campo-ausente" | "e-a-copia-de-novo" | "ponteiro-ausente";
  oQue: string;
}

/**
 * **O ponteiro diz tudo o que a forma 1 exige?** Confere, nos dois sentidos:
 *
 * - **campo-ausente** — repositório, ramo, caminho, versão, **commit**, tamanho, data da
 *   leitura, a receita de ler da origem e o commit do histórico: cada um tem de estar escrito.
 *   *Procedência sem o commit é procedência de rótulo*, e é por isso que o commit é cobrado;
 * - **e-a-copia-de-novo** — se o título do Padrão voltar a abrir o arquivo, alguém trocou o
 *   ponteiro pela cópia, e a casa voltou a carregar documento normativo que não mantém.
 */
export function conferirOPonteiro(texto: string | null): ProblemaDoPonteiro[] {
  if (texto === null)
    return [{ tipo: "ponteiro-ausente", oQue: `\`${CAMINHO_DO_PONTEIRO}\` não existe` }];

  const problemas: ProblemaDoPonteiro[] = [];
  const exigidos: ReadonlyArray<[string, string]> = [
    ["o repositório da fonte", A_FONTE_DO_PADRAO.repositorio],
    ["o ramo", A_FONTE_DO_PADRAO.ramo],
    ["o caminho na fonte", A_FONTE_DO_PADRAO.caminho],
    ["a versão lida", A_FONTE_DO_PADRAO.versao],
    ["o COMMIT lido", A_FONTE_DO_PADRAO.commit],
    ["o tamanho em linhas", A_FONTE_DO_PADRAO.linhas.toLocaleString("pt-BR")],
    ["a data da leitura", A_FONTE_DO_PADRAO.lidoEm],
    ["a receita de ler da ORIGEM", A_FONTE_DO_PADRAO.comoSeLe],
    ["o commit do histórico, onde a Versão 1 ficou", COMMIT_DA_COPIA_QUE_SAIU.commit],
    // LAB-89 (D294): o BLOB é o que identifica o TEXTO, e é o único campo desta lista que não
    // muda de nome com a profundidade do clone de quem confere.
    ["o BLOB do texto lido", A_FONTE_DO_PADRAO.blob.slice(0, 12)],
  ];
  for (const [oQue, valor] of exigidos) {
    if (!texto.includes(valor)) problemas.push({ tipo: "campo-ausente", oQue: `falta ${oQue}: \`${valor}\`` });
  }
  if (texto.includes(O_TITULO_DO_PADRAO)) {
    problemas.push({
      tipo: "e-a-copia-de-novo",
      oQue: "o arquivo abre com o TÍTULO do Padrão — o ponteiro virou cópia outra vez",
    });
  }
  return problemas;
}
