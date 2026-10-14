/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A MEDIÇÃO DA VARREDURA DE CONFIGURAÇÃO, NUM LUGAR SÓ. (item 019, LAB-86)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O **D204** mediu que a prova do LAB-57 ficou **velha** e nada reprovava:
 *
 * > *"a prova commitada dizia **1** e a ferramenta dizia **10**, na MESMA árvore. (…) o
 * > último `bun run lab57` daquele prompt rodou **antes** das edições finais dele mesmo. A
 * > prova ficou com o número de antes — e é a forma mais honesta de prova falsa que existe:
 * > ninguém mentiu, ninguém errou a régua, e o número estava certo **uma edição atrás**."*
 *
 * **E ao abrir o item 019 eu remedi, e o defeito estava VIVO** — pior do que o D204 descreveu,
 * porque não era uma edição de atraso, era semanas:
 *
 * | o que a prova commitada dizia | o que a mesma árvore diz |
 * |---|---|
 * | 128 arquivos de código varridos | **187** |
 * | 364 arquivos que o git carrega | **498** |
 * | 36 157 linhas de código lidas | **50 714** |
 *
 * # POR QUE A TRAVA NÃO PEGOU, e esta é a lição (D287)
 *
 * A trava lia a prova e conferia com **limiar**: `configuracoesEncontradas > 20`,
 * `linhasDeCodigoLidas > 10000`. Uma prova congelada em 36 157 linhas passa `> 10000` para
 * sempre.
 *
 * > **Régua que confere uma prova com `maior que` aceita qualquer prova velha que já fosse
 * > grande o bastante quando nasceu.** O limiar mede se o número é PLAUSÍVEL; só a
 * > recontagem mede se ele é VERDADE — e num repositório que cresce, o limiar fica mais
 * > frouxo a cada commit sem ninguém mexer nele.
 *
 * # A FORMA ESCOLHIDA: recontar e comparar — e por que não o carimbo
 *
 * O item ofereceu duas, e pediu o motivo escrito:
 *
 * | forma | por que sim / por que não |
 * |---|---|
 * | **recontar e comparar** *(escolhida)* | o universo desta varredura é o `git ls-files` **deste** repositório: sem clone, sem rede, sem motor. Recontar custa ~0,3 s, e a comparação é **exata** |
 * | comparar carimbos (o instante da prova contra o da última mudança) | **o carimbo do disco não é o do git**: numa sessão nova todo arquivo tem a data do checkout, e a comparação vira vácuo — *guarda que não acha o objeto não está aprovando, está sem medir nada* (D213). O item avisou disto, e a medição confirma: é vácuo justamente onde a trava mais precisaria valer, no CI |
 *
 * E a recontagem responde de graça **o caso válido que quase parece inválido**, que o item
 * nomeou: a prova que **não mudou porque nada que ela mede mudou** passa — os números batem.
 * *Uma régua que exigisse carimbo mais novo a cada commit reprovaria a árvore correta, e
 * vigia que nasce vermelho vira ruído e morre.*
 *
 * # POR QUE ISTO MORA AQUI, E NÃO NA FERRAMENTA
 *
 * Porque a ferramenta e a trava têm de contar **com a mesma régua**. Escrever a recontagem
 * dentro da trava criaria duas implementações da mesma pergunta, e *duas listas para a mesma
 * pergunta divergem* — o item chamou isso pelo nome, e o D231 já cobrou esta casa por meio
 * conserto aplicado num instrumento só.
 */
import { REGRAS_DE_CONFIGURACAO, varrerConfiguracao } from "./varredura-de-configuracao.ts";

/** O que CONTA como configuração, por nome de arquivo. */
export const EH_CONFIGURACAO = (f: string): boolean =>
  /(^|\/)(tsconfig[^/]*\.json|[^/]*eslint[^/]*\.(js|cjs|mjs)|package\.json|bunfig\.toml|\.npmrc|\.nvmrc|\.gitignore|\.gitattributes|[^/]*\.ya?ml|\.editorconfig|[^/]*prettier[^/]*|Cargo\.toml|rust-toolchain\.toml|[^/]*\.lock|conferir\.sh)$/.test(
    f,
  );

/** O que conta como CÓDIGO para as duas regras que vivem nele — o MESMO predicado na
 * varredura e na conta da outra mão, para um `.ts` na caixa nunca sair das duas. */
export const EH_CODIGO = (f: string): boolean => /\.(ts|js)$/.test(f) && !f.includes("node_modules/");

/**
 * ── A ESCRITA DA OUTRA MÃO SAI DA CONTA DO UNIVERSO, e não da varredura (LAB-107, D334) ──
 *
 * **Medido no LAB-106 e remedido aqui:** sobre os 37 estados da `main` desde o LAB-86, a
 * recontagem desta prova ficava VERMELHA em **15 de 15** escritas da direção na caixa — cada
 * item ou adendo é um arquivo a mais no `git ls-files`, e `arquivosQueOGitCarrega` mudava sem
 * que a varredura mudasse uma linha. A `main` ficava vermelha da escrita da direção até o
 * próximo envio desta casa, e *vigia que fica vermelho por ofício vira ruído e morre*.
 *
 * As duas saídas que a proposta pediu para medir, cada uma pelo que a régua PERDE:
 *
 * | forma | o que se perde |
 * |---|---|
 * | tirar o número do universo da recontagem | a recontagem deixa de ver **todo** arquivo que não é configuração nem código — o envelhecimento do LAB-98 e do LAB-104 (2 de 21 envios desta casa) só aparecia por ele. Perde-se o que a trava pegou de verdade |
 * | **tirar da conta a escrita da outra mão** *(escolhida)* | só o `.md` que nasce na caixa — que a varredura nunca leu. Remedido: as 15 escritas da direção ficam verdes e **os 2 envios vermelhos desta casa seguem vermelhos** |
 *
 * **E é estreita de propósito:** sai da CONTA, não da VARREDURA, e só o que não é
 * configuração nem código. Um `.yml` ou um `.ts` posto na caixa continua varrido e contado —
 * o desligador escondido na pasta da outra mão é exatamente o que esta régua procura.
 *
 * Renomear para `-FEITO` não muda a conta; só o arquivo NOVO muda, e só a direção os cria.
 */
export const DA_OUTRA_MAO: readonly { casa: (f: string) => boolean; porque: string }[] = [
  {
    casa: (f) => f.startsWith("docs/caixa-de-entrada/") && !EH_CONFIGURACAO(f) && !EH_CODIGO(f),
    porque:
      "é a CAIXA DE ENTRADA, escrita pela direção noutro clone e noutro instante: cada item novo mudava o número do universo sem mudar a varredura, e deixava a `main` vermelha até o próximo envio desta casa (15 de 15, LAB-106). Sai da CONTA, não da varredura, e só o que não é configuração nem código",
  },
];

export const eDaOutraMao = (f: string): boolean => DA_OUTRA_MAO.some((x) => x.casa(f));

/**
 * O que fica FORA da varredura, e **por quê**. Conjunto fechado: a trava reprova arquivo
 * de configuração que não esteja nem varrido nem nomeado aqui.
 */
export const FORA: readonly { casa: (f: string) => boolean; porque: string }[] = [
  {
    casa: (f) => f.startsWith("external-engines/symbios/upstream/"),
    porque:
      "é UPSTREAM e é INTOCÁVEL (§3): cópia exata do motor original, que não se edita. A configuração dele governa o projeto dele, não o verde deste repositório",
  },
  {
    casa: (f) => /(^|\/)[^/]*\.lock$/.test(f),
    porque:
      "lockfile não liga nem desliga conferência: ele PRENDE versão. Afrouxar versão é outra classe de risco, e não é a deste prompt",
  },
  {
    casa: (f) => /(^|\/)(Cargo\.toml|rust-toolchain\.toml)$/.test(f),
    porque:
      "governa a compilação do .wasm em Rust, que o verde cobre pela PRECONDIÇÃO (o .wasm existe ou o script reprova com a receita, D124) — e não por conferência de tipo",
  },
];

/**
 * ── O FONTE DA PRÓPRIA RÉGUA SAI DO ESCOPO, e isso é medido, não gosto (LAB-60) ──
 *
 * **O LAB-60 mediu que esta varredura acusava a si mesma dez vezes.** O
 * `conferencia-desligada-por-arquivo` procura `@ts-ignore`, `@ts-nocheck` e
 * `eslint-disable`, e esses três literais moram, por necessidade, no **padrão** da regra e
 * no texto que declara os achados — onde eles significam *"eu estou falando sobre"*, e não
 * *"eu faço"*. É a sub-família do **D155**, e a única limpeza que resolveria (tirar
 * comentários) **cegaria esta regra por completo**, porque é dentro de comentário que o
 * desligador vive.
 *
 * **O precedente é desta casa e está declarado:** a varredura de segredos do LAB-47 varre
 * *"tudo que o git carrega — nem uma pasta de fora, nem o fonte dela própria"*. A exclusão
 * é a mesma, e é **estreita**: só o arquivo que define os padrões e as ferramentas que
 * publicam as chaves de achado. Nenhuma outra pasta sai.
 */
export const FONTES_DA_PROPRIA_REGUA: Record<string, string> = {
  "external-engines/esteira/src/varredura-de-configuracao.ts":
    "é o arquivo que DEFINE os padrões: `@ts-ignore`, `@ts-nocheck` e `eslint-disable` estão nele como texto do padrão e do `exemploQuePega`",
  "external-engines/esteira/src/escopo-da-varredura.ts":
    "é a MEDIÇÃO da varredura, extraída no LAB-86 para a ferramenta e a trava contarem com a mesma régua — e para isso ela carrega os nomes das regras e o motivo de cada exclusão",
  "external-engines/esteira/ferramentas/lab57.ts":
    "publica as chaves de achado e o motivo de cada declarado, e para isso tem de escrever os literais",
  "external-engines/esteira/ferramentas/lab60.ts":
    "o mesmo, apontado ao clone do motor: a lista numerada que vai ao vizinho nomeia os literais",
  "external-engines/esteira/tests/configuracao.test.ts":
    "exercita cada regra com o `exemploQuePega` dela, e por isso carrega os três literais",
  "external-engines/esteira/tests/configuracao-do-motor.test.ts":
    "o mesmo, para as travas do LAB-60",
};

export interface LinhaDoEscopo {
  arquivo: string;
  varrido: boolean;
  porqueFora?: string;
  bytes?: number;
  linhas?: number;
  regrasQueOlharam?: string[];
}

/** Os números do escopo — o que a prova publica e a trava reconta. */
export interface NumerosDoEscopo {
  /** O `git ls-files` MENOS a escrita da outra mão (`DA_OUTRA_MAO`, LAB-107). Era
   * `arquivosQueOGitCarrega`, o total; o nome mudou junto com o que ele conta, para nenhuma
   * prova antiga passar por esta (*rótulo não é identidade*, D148). */
  arquivosQueOGitCarregaForaDaCaixa: number;
  configuracoesEncontradas: number;
  configuracoesVarridas: number;
  configuracoesForaDoEscopoNomeadas: number;
  linhasDeConfiguracaoLidas: number;
  arquivosDeCodigoVarridos: number;
  linhasDeCodigoLidas: number;
  regras: number;
}

export interface MedicaoDoEscopo {
  numeros: NumerosDoEscopo;
  porArquivo: LinhaDoEscopo[];
  achados: ReturnType<typeof varrerConfiguracao>["achados"];
  porRegra: Record<string, number>;
}

/**
 * Mede o escopo da varredura sobre uma árvore — a MESMA conta que a prova publica.
 *
 * `carregados` é o `git ls-files` da raiz (o universo começa no LUGAR, nunca numa lista
 * escrita à mão: *lista à mão não vê o arquivo que nasceu depois dela*), e `ler` lê um
 * caminho relativo a essa raiz.
 *
 * **E ISSO FIXA UM INSTANTE, que não é o que eu havia declarado:** o `git ls-files` muda no
 * `git add`, não quando o arquivo é escrito. A prova desta varredura tem de ser gerada
 * **depois do `git add`** — na primeira rodada com a trava nova eu a gerei como última
 * ferramenta, commitei, e ela reprovou: 498 → 502 arquivos carregados, porque os quatro
 * arquivos novos da rodada estavam no disco e **não rastreados**.
 *
 * > *Quando o universo de uma medição é "o que o git carrega", o instante que importa não é o
 * > da escrita: é o do `add`* — e os dois estão a um comando de distância, o que torna o
 * > engano barato de cometer e invisível sem recontagem.
 */
export function medirOEscopo(
  carregados: readonly string[],
  ler: (relativo: string) => string,
): MedicaoDoEscopo {
  // O lint do pacote REPROVA aviso? É o par do `regra-em-warn`, e é medido — lido no
  // `package.json` do pacote a que o arquivo pertence.
  const lintReprovaAviso = (arquivo: string): boolean => {
    const pacote = arquivo.includes("/esteira/")
      ? "external-engines/esteira"
      : arquivo.includes("/testfit/")
        ? "external-engines/testfit"
        : null;
    if (pacote === null) return false;
    const pj = JSON.parse(ler(`${pacote}/package.json`)) as { scripts?: Record<string, string> };
    return /--max-warnings\s+0/.test(pj.scripts?.["lint"] ?? "");
  };

  const porArquivo: LinhaDoEscopo[] = [];
  const achados: ReturnType<typeof varrerConfiguracao>["achados"] = [];
  let linhasLidas = 0;

  for (const f of [...carregados].filter(EH_CONFIGURACAO).sort()) {
    const fora = FORA.find((x) => x.casa(f));
    if (fora !== undefined) {
      porArquivo.push({ arquivo: f, varrido: false, porqueFora: fora.porque });
      continue;
    }
    const texto = ler(f);
    const r = varrerConfiguracao(texto, f, { lintReprovaAviso: lintReprovaAviso(f) });
    achados.push(...r.achados);
    linhasLidas += texto.split("\n").length;
    porArquivo.push({
      arquivo: f,
      varrido: true,
      bytes: texto.length,
      linhas: texto.split("\n").length,
      regrasQueOlharam: r.regrasQueOlharam,
    });
  }

  // ── E os arquivos de CÓDIGO, para as duas regras que vivem neles ──────────
  //
  // `teste-desligado` e `conferencia-desligada-por-arquivo` não moram em configuração: o
  // `.only` e o `@ts-ignore` são desligadores que viajam no código. Ficar só na configuração
  // responderia metade da pergunta.
  //
  // **E sem contar duas vezes:** os dois `eslint.config.js` são configuração E são `.js`.
  // Na primeira versão desta conta eles entraram nas duas passagens e o `regra-em-warn` saiu
  // **4** onde eram **2**. *O volume era da minha régua, não da coisa* (D179, D193).
  const jaVarridos = new Set(porArquivo.filter((l) => l.varrido).map((l) => l.arquivo));
  const codigo = carregados.filter(
    (f) =>
      EH_CODIGO(f) &&
      !jaVarridos.has(f) &&
      !(f in FONTES_DA_PROPRIA_REGUA),
  );
  let linhasDeCodigo = 0;
  for (const f of codigo) {
    const texto = ler(f);
    linhasDeCodigo += texto.split("\n").length;
    achados.push(...varrerConfiguracao(texto, f).achados);
  }

  const porRegra: Record<string, number> = {};
  for (const a of achados) porRegra[a.regra] = (porRegra[a.regra] ?? 0) + 1;

  return {
    numeros: {
      arquivosQueOGitCarregaForaDaCaixa: carregados.filter((f) => !eDaOutraMao(f)).length,
      configuracoesEncontradas: porArquivo.length,
      configuracoesVarridas: porArquivo.filter((l) => l.varrido).length,
      configuracoesForaDoEscopoNomeadas: porArquivo.filter((l) => !l.varrido).length,
      linhasDeConfiguracaoLidas: linhasLidas,
      arquivosDeCodigoVarridos: codigo.length,
      linhasDeCodigoLidas: linhasDeCodigo,
      regras: REGRAS_DE_CONFIGURACAO.length,
    },
    porArquivo,
    achados,
    porRegra,
  };
}

export interface ProvaVelha {
  chave: string;
  naProva: number;
  naArvore: number;
}

/**
 * **A PERGUNTA DO D204, respondida por RECONTAGEM:** a prova do disco bate com a árvore de
 * agora?
 *
 * Devolve uma linha por número que divergiu. Lista vazia = a prova foi gerada depois da
 * última edição do que ela mede, **ou** nada que ela mede mudou — e as duas são a mesma
 * coisa para quem lê a prova.
 */
export function remedirAProva(
  publicado: Partial<Record<keyof NumerosDoEscopo, unknown>>,
  agora: NumerosDoEscopo,
): ProvaVelha[] {
  const velhas: ProvaVelha[] = [];
  for (const [chave, naArvore] of Object.entries(agora) as [keyof NumerosDoEscopo, number][]) {
    const naProva = publicado[chave];
    if (typeof naProva !== "number" || naProva !== naArvore) {
      velhas.push({ chave, naProva: typeof naProva === "number" ? naProva : Number.NaN, naArvore });
    }
  }
  return velhas;
}
