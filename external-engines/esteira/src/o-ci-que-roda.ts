/**
 * A FRASE QUE DIZ QUE O CI RODA, conferida contra o gatilho. (LAB-102, item 900, D329)
 *
 * # O defeito, medido em 13/10/2026
 *
 * O gatilho automático do `verde.yml` está **comentado desde 08/10/2026** (o orçamento de Actions
 * da família estourou; a receita de religar mora em `docs/COMO_RELIGAR_O_CI.md`). A trava do
 * gatilho (`tests/gatilho-do-verde.test.ts`) cobrava **um** lado: *ligado, o aviso de desligado
 * sai*. O outro lado não tinha guarda — **desligado, a frase que diz que ele roda sai** — e seis
 * frases vivas afirmavam, cinco dias depois, que o CI rodava (o `grep` por frase achou cinco; a
 * régua, que atravessa a quebra de linha, achou a sexta):
 *
 * - `external-engines/conferir.sh`, o arquivo mais lido do repositório: *"roda em todo push, sem
 *   segredo"* — é o bloco que já mentiu por 8 dias (LAB-51) e ganhou guarda **só** para
 *   *"não existe"* sobre caminho;
 * - `.github/workflows/verde.yml`, duas vezes: *"roda hoje, sem segredo nenhum"* e *"O que roda
 *   HOJE"* — no mesmo arquivo do aviso de desligado, uma acima e outra abaixo dele;
 * - `docs/INDEX.md`: *"o que roda hoje sem segredo"*;
 * - um comentário de teste escrito no **dia 10/10**, já com o CI desligado: *"num portão que roda
 *   em todo push"* — falso no dia em que nasceu;
 * - a mensagem de problema de `o-que-o-gatilho-carrega.ts`: *"o portão que roda em TODO envio
 *   (…) o único trabalho que hoje informa alguma coisa"* — texto fixo que sai na tela de quem
 *   condicionar o trabalho, afirmando um estado que ninguém perguntou.
 *
 * > **Mensagem fixa que afirma estado sem perguntar** é a quinta espécie da dívida própria: a
 * > frase não pergunta ao gatilho, e o gatilho mudou embaixo dela.
 *
 * # O que este módulo faz
 *
 * - {@link gatilhoAutomaticoLigado} — a pergunta ao gatilho, num lugar só (era função local da
 *   trava do gatilho; duas implementações da mesma pergunta divergem, D231).
 * - {@link afirmacoesDeQueRoda} — acha, num texto, a frase de **estado** (*roda/rodam hoje*, *roda
 *   em todo push/envio*, *roda a cada push/envio*), atravessando a quebra de linha e o marcador de
 *   comentário (`#`, ` * `, `//`, `>`) e o negrito do markdown.
 * - {@link conferirAsAfirmacoes} — com o gatilho **desligado**, toda frase achada fora dos lugares
 *   de relato reprova, salvo exceção declarada com o motivo; e **toda exceção tem de continuar
 *   achada** — exceção cujo trecho sumiu é lista que envelheceu, e reprova também (os dois
 *   sentidos). Devolve o **tamanho do universo lido**: *"verde: nenhuma de 0"* se denuncia sozinho.
 *
 * # O que ele NÃO alcança, dito
 *
 * - a frase de estado com **outras palavras** (*"pinta vermelho sozinho"*, *"o GitHub confere"*):
 *   é régua de palavra, e palavra não pega o que não reconhece;
 * - **relato datado** — `docs/relatorios/`, `docs/prompts/`, a caixa de entrada, `DECISOES.md`,
 *   `ONDE_PARAMOS.md`, `HISTORIA_DAS_REGRAS.md`, as provas geradas: verdadeiro na data, e não se
 *   reescreve;
 * - `upstream/`: cópia exata de terceiro, que não fala deste CI e não se toca (§3);
 * - o lado **ligado**: com o gatilho ativo a frase pode ser verdade, e quem cobra o aviso de
 *   desligado sair é a trava do gatilho.
 */

/** O gatilho automático está ligado quando `push:` ou `pull_request:` abrem linha sem `#`. */
export function gatilhoAutomaticoLigado(texto: string): boolean {
  return texto.split("\n").some((l) => /^\s*(push|pull_request):\s*$/.test(l));
}

/** A frase de ESTADO: o verbo no presente, colado ao quando. */
const FRASE_DE_QUE_RODA =
  /\broda(?:m)?\s+(?:hoje|em\s+todo\s+(?:push|envio)|a\s+cada\s+(?:push|envio))\b/gi;

/** Uma frase achada, com a linha (1-based) em que ela começa. */
export interface Afirmacao {
  arquivo: string;
  linha: number;
  trecho: string;
}

/**
 * Acha as frases de estado num texto. O marcador de comentário do começo de cada linha e o `**`
 * saem, e as linhas se juntam com espaço, para a quebra da coluna não esconder a frase.
 */
export function afirmacoesDeQueRoda(arquivo: string, texto: string): Afirmacao[] {
  const inicios: number[] = [];
  let juntado = "";
  for (const linha of texto.split("\n")) {
    inicios.push(juntado.length);
    juntado += linha.replace(/^\s*(?:#+|\*|\/\/|>)\s?/, "").replace(/\*\*/g, "") + " ";
  }
  const achadas: Afirmacao[] = [];
  for (const m of juntado.matchAll(FRASE_DE_QUE_RODA)) {
    let i = 0;
    while (i + 1 < inicios.length && inicios[i + 1]! <= m.index) i++;
    achadas.push({ arquivo, linha: i + 1, trecho: m[0].replace(/\s+/g, " ") });
  }
  return achadas;
}

/** Onde a frase é RELATO, verdadeira na data em que foi escrita — e por quê. */
export const LUGARES_DE_RELATO: readonly { prefixo: string; porque: string }[] = [
  { prefixo: "docs/relatorios/", porque: "relatório e recado de rodada: relato datado" },
  { prefixo: "docs/prompts/", porque: "a fila: relato datado de cada prompt" },
  { prefixo: "docs/caixa-de-entrada/", porque: "os itens do chat e o que se fez neles" },
  { prefixo: "docs/provas/", porque: "saída gerada por ferramenta, com a data dela" },
  { prefixo: "docs/DECISOES.md", porque: "decisão datada; quem discorda escreve a próxima" },
  { prefixo: "docs/ONDE_PARAMOS.md", porque: "o histórico das rodadas, só se acrescenta" },
  { prefixo: "docs/HISTORIA_DAS_REGRAS.md", porque: "o relato movido do CLAUDE.md, palavra por palavra" },
  { prefixo: "external-engines/symbios/upstream/", porque: "cópia exata de terceiro (§3)" },
  { prefixo: "external-engines/esteira/src/o-ci-que-roda.ts", porque: "a própria régua" },
  { prefixo: "external-engines/esteira/tests/gatilho-do-verde.test.ts", porque: "as travas da própria régua" },
];

/**
 * As frases que a régua acha e que NÃO são estado, com o motivo. Todas dizem a mesma coisa:
 * *o trabalho que roda em todo envio não tem segredo* — o argumento é sobre o que o trabalho
 * **não tem**, e vale com o gatilho ligado ou desligado. Trocá-las mudaria a saída de uma
 * ferramenta (`lab88`) e a prova que ela gera, para nada.
 */
export const EXCECOES: readonly { arquivo: string; trecho: string; porque: string }[] = [
  {
    arquivo: "docs/referencia/PADRAO_ARCHILLY.md",
    trecho: "roda em todo envio",
    porque: "argumento de segredo (D213), não de estado: vale ligado ou desligado",
  },
  {
    arquivo: "external-engines/esteira/src/onde-esta-o-padrao.ts",
    trecho: "roda em todo envio",
    porque: "argumento de segredo (D213), não de estado: vale ligado ou desligado",
  },
  {
    arquivo: "docs/INDEX.md",
    trecho: "roda em todo envio",
    porque: "a linha do relatório do LAB-88, que resume o mesmo argumento de segredo (D213)",
  },
  {
    arquivo: "external-engines/esteira/ferramentas/lab88.ts",
    trecho: "roda em todo envio",
    porque: "argumento de segredo (D213), na saída da ferramenta que gera a prova do LAB-88",
  },
];

/** Um arquivo da árvore, com o texto dele. */
export interface ArquivoLido {
  arquivo: string;
  texto: string;
}

/** O que a conferência devolve. */
export interface ConferenciaDasAfirmacoes {
  ligado: boolean;
  /** Quantos arquivos a régua leu — o universo, publicado. */
  lidos: number;
  /** Quantos ficaram fora por serem relato. */
  deRelato: number;
  /** Frases de estado fora de relato e fora das exceções, com o gatilho desligado. */
  desmentidas: Afirmacao[];
  /** Exceções declaradas cujo trecho a régua não achou mais. */
  excecoesMortas: string[];
}

/** O arquivo é relato? */
export function ehRelato(arquivo: string): boolean {
  return LUGARES_DE_RELATO.some((l) => arquivo === l.prefixo || arquivo.startsWith(l.prefixo));
}

/**
 * Confere as frases de estado contra o gatilho. Com o gatilho **ligado** não cobra nada (a frase
 * pode ser verdade); **desligado**, cobra os dois sentidos: frase nova reprova, exceção morta
 * reprova.
 */
export function conferirAsAfirmacoes(
  arvore: readonly ArquivoLido[],
  ligado: boolean,
  excecoes: typeof EXCECOES = EXCECOES,
): ConferenciaDasAfirmacoes {
  const vivos = arvore.filter((a) => !ehRelato(a.arquivo));
  const achadas = vivos.flatMap((a) => afirmacoesDeQueRoda(a.arquivo, a.texto));
  const ehExcecao = (f: Afirmacao) =>
    excecoes.some((e) => e.arquivo === f.arquivo && e.trecho.toLowerCase() === f.trecho.toLowerCase());
  const excecoesMortas = excecoes
    .filter((e) => !achadas.some((f) => f.arquivo === e.arquivo && f.trecho.toLowerCase() === e.trecho.toLowerCase()))
    .map((e) => `${e.arquivo} · "${e.trecho}"`);
  return {
    ligado,
    lidos: vivos.length,
    deRelato: arvore.length - vivos.length,
    desmentidas: ligado ? [] : achadas.filter((f) => !ehExcecao(f)),
    excecoesMortas: ligado ? [] : excecoesMortas,
  };
}

/** As extensões de texto que a régua lê na árvore versionada. */
export const EXTENSOES_LIDAS = [".md", ".ts", ".sh", ".yml", ".yaml", ".mjs", ".js", ".html"] as const;
