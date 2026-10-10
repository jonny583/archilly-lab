/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O DESTINO DO QUE SAI DAQUI — a varredura de custo escopada por DESTINO. (LAB-80, D243)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * # O que estava errado, e foi o CRITÉRIO que acusou (D243)
 *
 * A trava do vazamento de custo isentava arquivos por uma **lista nominal**, e o item 006 deu
 * a essa lista um critério em vez de só um número:
 *
 * > **O teto sobe quando a regra passa a ser ESCRITA em mais um lugar, e cada entrada nomeia
 * > qual regra enuncia. Se ele subir sem que uma regra nova tenha sido escrita, o que está
 * > errado é o DESENHO da lista, não o número.**
 *
 * **Ele disparou um prompt depois:** o teto foi de 9 para 11 e as duas entradas novas eram
 * **relatórios de prompt** — documentação *sobre* a regra. Continuar assim era uma linha por
 * relatório, para sempre.
 *
 * # A causa, medida e não suposta
 *
 * A frase que PROÍBE o vazamento **enumera, numa linha, exatamente os nomes que proíbe** —
 * *"custo, fator e margem nunca chegam ao usuário comum"*. Qualquer régua de proximidade
 * morde essa frase, e ela tem de estar escrita em todo lugar onde a regra vale. Daí as 11
 * entradas, e daí o crescimento: **não havia defeito a consertar em arquivo nenhum.**
 *
 * > **Lista de isenções que cresce porque a regra está escrita em mais lugares não mede
 * > vazamento: mede quantas vezes a casa repetiu a própria regra.**
 *
 * # O desenho novo: a pergunta é PARA ONDE a linha vai
 *
 * Todo arquivo que o git carrega tem um **destino**, e o destino decide o rigor:
 *
 * | destino | o que é | como se varre |
 * |---|---|---|
 * | `tela` | o que um navegador desenha | **nome e valor, no texto cru** — rigor máximo |
 * | `codigo` | o que roda aqui | nome e valor em **posição de identificador** |
 * | `dado` | prova, saída, configuração de dado | nome e valor, no texto cru |
 * | `upstream-intocavel` | cópia do motor original (§3) | nome e valor, no texto cru |
 * | `registro` | relatório, decisão, recado, item, fila | **só o VALOR**, e só em prosa nua |
 *
 * **A palavra do D243 é `valor`**, não `nome`: *"o **valor** citado tem de estar dentro de
 * citação ou de bloco de código"*. É o que separa enunciar a regra de vazá-la — e medido, é
 * o que esvazia a lista: **das 11 isenções, ZERO sobrevivem.**
 *
 * # Duas isenções estavam MORTAS, e uma delas nunca tropeçou (D260)
 *
 * Medido antes de desenhar: das 11 entradas, só **9** arquivos eram acusados. `DECISOES.md` e
 * `LAB-74.md` não acusavam nada — e `LAB-74.md`, varrido commit a commit, **nunca** casou com
 * nenhuma das sete regras, em toda a sua história. A lista jurava no próprio comentário que
 * *"cada entrada é um arquivo que tropeçou de verdade, não um padrão que adivinha quais
 * tropeçariam"*. Essa entrada foi adivinhada — e ela é uma das duas que **dispararam o
 * critério**.
 *
 * > **Lista de isenções sem revalidação envelhece igual a comentário** (D104). A §7 já cobra
 * > isso das provas — *"exceção na lista que deixou de precisar ser exceção"* —, e a lista do
 * > custo não tinha a mesma guarda. Agora não tem lista.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { lugaresDaPagina, afirmadoNaLinha } from "./texto-das-regras.ts";
import { soOsNomesUsados } from "./varredura-de-chamadas.ts";

/** Os destinos, em vocabulário fechado. Arquivo sem destino é erro, nunca um padrão novo. */
export const DESTINOS = ["tela", "registro", "codigo", "dado", "upstream-intocavel"] as const;
export type Destino = (typeof DESTINOS)[number];

/** Como o texto de um destino é lido antes de a régua casar. */
export type Limpeza = "cru" | "identificador" | "prosa-nua-ou-cru-por-formato";

/** O rigor de cada destino, declarado — é o que a trava confere contra o que a varredura faz. */
export const RIGOR: Record<Destino, { oQue: string; regras: "nome-e-valor" | "so-valor"; limpeza: Limpeza }> = {
  tela: {
    oQue: "o que um navegador desenha — hoje, só a bancada da prova (§4)",
    regras: "nome-e-valor",
    limpeza: "cru",
  },
  codigo: {
    oQue: "o que roda aqui e nunca é desenhado",
    regras: "nome-e-valor",
    limpeza: "identificador",
  },
  dado: {
    oQue: "entrada de terreno, saída crua, configuração e trava de dependência — nada disto é registro",
    regras: "nome-e-valor",
    limpeza: "cru",
  },
  "upstream-intocavel": {
    oQue: "cópia exata do motor original — §3 proíbe editar, então um achado aqui é CONFLITO de regras, não conserto meu",
    regras: "nome-e-valor",
    limpeza: "cru",
  },
  registro: {
    oQue: "tudo sob `docs/` mais o `CLAUDE.md` — relatório, decisão, recado, item, fila E PROVA: é onde a casa escreve a própria regra e os próprios números",
    regras: "so-valor",
    limpeza: "prosa-nua-ou-cru-por-formato",
  },
};

/**
 * COMO SE LÊ UM ARQUIVO DO REGISTRO — e o **formato** decide, não a pergunta. (D261)
 *
 * O registro tem duas formas: a página em Markdown e a prova em dados. **A limpeza de uma é
 * cega na outra**, e isto foi medido no próprio prompt: a leitura de Markdown tira o que está
 * entre aspas, porque ali aspas são citação — e **em JSON toda chave está entre aspas**. Aplicar
 * a limpeza de Markdown a uma prova apagaria `"custoMedido"` junto com todo o resto, e um
 * vazamento de verdade passaria em silêncio.
 *
 * > **A limpeza certa para Markdown é a cegueira certa para JSON.** O D179 ensinou que *a
 * > pergunta decide a limpeza*; aqui é o **formato** que decide, e esquecê-lo é a espécie de
 * > falso negativo do D164 — zero de régua cega é indistinguível de zero de árvore limpa.
 */
export type FormaDoRegistro = "markdown" | "dados";

/** A forma de um arquivo do registro. Só o `.md` tem citação, crase e bloco de código. */
export function formaDoRegistro(arquivo: string): FormaDoRegistro {
  return arquivo.endsWith(".md") ? "markdown" : "dados";
}

/** Os nomes do NOSSO custo e do NOSSO fator. Nenhum deles pode sair daqui. */
export const NOMES_DO_NOSSO_CUSTO = [
  /\bcustoMedido\b/,
  /\bcusto_medido\b/,
  /\bmultiplicador\b/,
  /\bcusto\s*[x×]\s*\d/i,
  /\bmarkup\b/i,
  /\bprecoCusto\b/,
] as const;

/**
 * `margem` só conta **perto de dinheiro** — a mesma linha tem de trazer lucro, preço, custo,
 * `R$` ou `US$`. Sem isso é a folga geométrica, em metros, e acusá-la é medir ortografia (D137).
 */
export const MARGEM_DE_DINHEIRO =
  /\bmargem\b[^\n]{0,60}?(lucro|pre[çc]o|custo|R\$|US\$)|\b(lucro|pre[çc]o|custo|R\$|US\$)[^\n]{0,60}?\bmargem\b/i;

const DINHEIRO = String.raw`lucro|pre[çc]o|custo|R\$|US\$|fatura|cobran[çc]a`;

/**
 * O **VALOR** do nosso custo: o nome com um NÚMERO colado. É a régua do `registro`.
 *
 * A diferença com {@link NOMES_DO_NOSSO_CUSTO} é a única coisa que faz a lista de isenções
 * desaparecer: *"custo, fator e margem nunca chegam ao usuário"* não traz número nenhum, e
 * *"a margem de lucro é 40 %"* traz.
 *
 * **`fator` e `margem` exigem dinheiro NA LINHA, além do número** — e isto é o D137 pela
 * segunda vez, medido **contra mim dentro deste prompt**: a primeira versão desta régua pedia
 * só `fator` perto de número e acusou **três** linhas, todas geométricas — *"fator de 6,7×"*,
 * *"fator de 13,2×"* e *"um fator de 6 a 13"*, que são a razão entre pico e média de uma rampa.
 * *A régua nova nasceu com a doença que a régua velha já tinha curado, um campo ao lado.*
 *
 * **O buraco fica declarado:** `"o fator é 3"`, escrito sem palavra de dinheiro na linha,
 * escapa. Fecha-se com proximidade de dinheiro ou não se fecha — e afrouxar para pegá-lo
 * devolve as três acusações geométricas.
 */
export const VALORES_DO_NOSSO_CUSTO = [
  /\bcusto\s*[x×*]\s*\d/i,
  /\bcustoMedido\b[^\n]{0,25}?\d/,
  /\bprecoCusto\b[^\n]{0,25}?\d/,
  /\bmultiplicador\b[^\n]{0,25}?\d/i,
  /\d[^\n]{0,25}?\bmultiplicador\b/i,
  /\bmarkup\b[^\n]{0,25}?\d/i,
  new RegExp(
    String.raw`\bfator\b[^\n]{0,30}?(?:${DINHEIRO})[^\n]{0,30}?\d` +
      String.raw`|\d[^\n]{0,30}?\bfator\b[^\n]{0,30}?(?:${DINHEIRO})` +
      String.raw`|(?:${DINHEIRO})[^\n]{0,30}?\bfator\b[^\n]{0,30}?\d`,
    "i",
  ),
  /\b(?:cobrar|cobra|cobramos)\b[^\n]{0,25}?\bvezes\s*(?:\d|tr[êe]s)\b/i,
  new RegExp(
    String.raw`\bmargem\b[^\n]{0,40}?(?:${DINHEIRO})[^\n]{0,40}?\d` +
      String.raw`|\bmargem\b[^\n]{0,40}?\d+(?:[.,]\d+)?\s*%` +
      String.raw`|(?:${DINHEIRO})[^\n]{0,40}?\bmargem\b[^\n]{0,40}?\d` +
      String.raw`|\d[^\n]{0,40}?\bmargem\b[^\n]{0,40}?(?:${DINHEIRO})`,
    "i",
  ),
] as const;

/**
 * **Chamada paga de IA se procura no IMPORT e na CHAMADA, não no texto** (D142, D224).
 *
 * Os nomes estão aqui dentro, no padrão que os procura — e é por isso que a varredura do
 * `codigo` lê {@link soOsNomesUsados}, onde literal de regex e conteúdo de string não existem.
 * Até o LAB-80 ela lia o **texto cru** e comprava a isenção na lista nominal (D258).
 */
export const CHAMADA_PAGA_DE_IA = [
  /\bfrom\s+["'`](?:@anthropic-ai\/[\w-]+|openai|@google\/genai|cohere-ai|@mistralai\/[\w-]+)["'`]/,
  /\brequire\(\s*["'`](?:@anthropic-ai\/[\w-]+|openai)["'`]\s*\)/,
  /\bnew\s+(?:OpenAI|Anthropic)\s*\(/,
  /\bfrom\s+["'`][^"'`]*\bgateway\b[^"'`]*["'`]/,
  /\b(?:await\s+)?central\.ia\.\w+\s*\(/,
  /:\s*PedidoIA\b|\bPedidoIA\s*=|\bas\s+PedidoIA\b/,
] as const;

const CODIGO = /\.(ts|tsx|mjs|js|sh|yml|yaml|toml|rs)$/;

/**
 * O destino de cada arquivo, pela **estrutura** e não por uma lista de nomes.
 *
 * A ordem das perguntas é a precedência, e ela importa: `upstream/` vem antes de tudo porque
 * um `.rs` de lá não é código desta casa; `tela` vem antes de `codigo` porque o `prova.js` da
 * bancada é desenhado por um navegador, e é isso que decide o rigor dele.
 *
 * **`tela` é "tem um `.html` do lado"**, não um caminho escrito. Um `.html` novo em qualquer
 * pasta traz a pasta inteira para o rigor máximo sem que ninguém precise lembrar de incluí-la —
 * e a §4 já tem guarda que reprova um segundo `.html` (LAB-36).
 */
export function destinosDe(arquivos: readonly string[]): Map<string, Destino> {
  const pastasComHtml = new Set(arquivos.filter((f) => f.endsWith(".html")).map((f) => dirname(f)));
  const fora = new Map<string, Destino>();
  for (const f of arquivos) {
    if (/(?:^|\/)upstream\//.test(f)) fora.set(f, "upstream-intocavel");
    else if (f.endsWith(".html")) fora.set(f, "tela");
    else if (/\.(?:js|css)$/.test(f) && pastasComHtml.has(dirname(f))) fora.set(f, "tela");
    else if (f.endsWith(".md")) fora.set(f, "registro");
    else if (/^docs\//.test(f)) fora.set(f, "registro");
    else if (CODIGO.test(f)) fora.set(f, "codigo");
    else fora.set(f, "dado");
  }
  return fora;
}

export interface Achado {
  arquivo: string;
  destino: Destino;
  linha: number;
  regra: string;
}

export interface Varredura {
  /** Quantos arquivos o git carrega. É o universo, publicado (D164). */
  universo: number;
  /** Quantos arquivos em cada destino. A soma tem de fechar com o universo. */
  porDestino: Record<Destino, number>;
  /** Quantas LINHAS cada destino ofereceu à régua — o tamanho do que foi lido, não do que sobrou. */
  linhasLidas: Record<Destino, number>;
  achados: Achado[];
  /** Quantas isenções nominais a varredura ainda usa. O desenho novo exige ZERO. */
  isencoesNominais: number;
}

/** Os arquivos que o git carrega — é o escopo certo: o que o git carrega é o que sai daqui. */
export function arquivosDoGit(raiz: string, correr: (args: string[]) => string): string[] {
  return correr(["ls-files"])
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => f !== "" && f !== raiz);
}

/**
 * A varredura inteira, por destino. **Sem lista de isenções** — é o ponto do D243.
 *
 * `registro` é o único destino com régua própria: só o VALOR, e só em linha de prosa nua, com
 * o nome fora de crase, de riscado e de citação curta. Os outros quatro são varridos no cru,
 * exceto `codigo`, que é lido em posição de identificador.
 */
export function varrerOQueSai(raiz: string, arquivos: readonly string[]): Varredura {
  const destinos = destinosDe(arquivos);
  const porDestino = Object.fromEntries(DESTINOS.map((d) => [d, 0])) as Record<Destino, number>;
  const linhasLidas = Object.fromEntries(DESTINOS.map((d) => [d, 0])) as Record<Destino, number>;
  const achados: Achado[] = [];

  for (const arquivo of arquivos) {
    const destino = destinos.get(arquivo)!;
    porDestino[destino]++;
    let texto: string;
    try {
      texto = readFileSync(join(raiz, arquivo), "utf8");
    } catch {
      continue; // binário ou ilegível: não é texto que vaza
    }

    if (destino === "registro") {
      const forma = formaDoRegistro(arquivo);
      const lugares = forma === "markdown" ? lugaresDaPagina(texto) : null;
      texto.split("\n").forEach((linha, i) => {
        if (lugares && lugares[i] !== "prosa") return;
        linhasLidas[destino]++;
        for (const re of VALORES_DO_NOSSO_CUSTO) {
          const casou = forma === "markdown" ? afirmadoNaLinha(linha, re) : re.test(linha);
          if (casou) {
            achados.push({ arquivo, destino, linha: i + 1, regra: re.source.slice(0, 50) });
            return;
          }
        }
      });
      continue;
    }

    const lido = destino === "codigo" && CODIGO.test(arquivo) ? soOsNomesUsados(texto) : texto;
    lido.split("\n").forEach((linha, i) => {
      linhasLidas[destino]++;
      for (const re of [...NOMES_DO_NOSSO_CUSTO, MARGEM_DE_DINHEIRO, ...VALORES_DO_NOSSO_CUSTO]) {
        if (re.test(linha)) {
          achados.push({ arquivo, destino, linha: i + 1, regra: re.source.slice(0, 50) });
          return;
        }
      }
    });
  }

  return { universo: arquivos.length, porDestino, linhasLidas, achados, isencoesNominais: 0 };
}

/** As chamadas pagas de IA, lidas em posição de identificador — zero aqui, e é para continuar. */
export function chamadasPagasDeIA(raiz: string, arquivos: readonly string[]): string[] {
  const fora: string[] = [];
  for (const f of arquivos) {
    if (!/\.(?:ts|tsx|js|mjs)$/.test(f)) continue;
    let texto: string;
    try {
      texto = readFileSync(join(raiz, f), "utf8");
    } catch {
      continue;
    }
    const usado = soOsNomesUsados(texto);
    for (const re of CHAMADA_PAGA_DE_IA) {
      if (re.test(usado)) fora.push(`${f} · ${re.source.slice(0, 40)}`);
    }
  }
  return fora;
}

/**
 * ── A GUARDA DA GUARDA, NOS DOIS SENTIDOS ───────────────────────────────────
 *
 * Cada destino declara **um vazamento plantado que a régua tem de pegar** e **uma frase da
 * casa que ela não pode acusar**. A trava roda os dois por destino e reprova **dizendo o nome
 * do destino**, porque *régua nova nasce estreita demais, e às vezes larga demais — as duas
 * coisas são o mesmo defeito: ninguém a conferiu dos dois lados.*
 *
 * O plantado de `codigo` está em **posição de identificador** de propósito: é a única posição
 * que limpeza nenhuma alcança, e é por isso que o falso negativo da
 * {@link semLiteraisDeRegex} não abre buraco de verdade.
 */
export const SABOTAGEM: Record<Destino, { pega: string; naoPega: string }> = {
  tela: {
    pega: '<p>custo × 3</p>',
    naoPega: "<p>a gleba tem margem de 8 m na caixa envolvente</p>",
  },
  codigo: {
    pega: "const multiplicador = 3;",
    naoPega: "const margem = lado * 0.08;",
  },
  dado: {
    pega: '{ "custoMedido": 0.012 }',
    naoPega: '{ "margem_m": 8, "gleba": "antonina" }',
  },
  "upstream-intocavel": {
    pega: "let markup = 3.0;",
    naoPega: "let margin = 0.08;",
  },
  registro: {
    pega: "a margem de lucro é de 40 % sobre o custo",
    naoPega: "custo, fator e margem nunca chegam ao usuário comum",
  },
};

/** Uma linha deste destino vaza? É a MESMA decisão que a {@link varrerOQueSai} toma. */
export function vazaNoDestino(
  destino: Destino,
  linha: string,
  forma: FormaDoRegistro = "markdown",
): boolean {
  if (destino === "registro") {
    return VALORES_DO_NOSSO_CUSTO.some((re) =>
      forma === "markdown" ? afirmadoNaLinha(linha, re) : re.test(linha),
    );
  }
  const lido = destino === "codigo" ? soOsNomesUsados(linha) : linha;
  return [...NOMES_DO_NOSSO_CUSTO, MARGEM_DE_DINHEIRO, ...VALORES_DO_NOSSO_CUSTO].some((re) =>
    re.test(lido),
  );
}

/** A conta dos destinos fecha com o universo? Partição que não soma não é partição. */
export function aContaDosDestinosFecha(v: Varredura): boolean {
  return Object.values(v.porDestino).reduce((a, b) => a + b, 0) === v.universo;
}
