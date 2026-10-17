/**
 * O MOTIVO DE UMA PERDA NÃO MORA EM COMENTÁRIO — E A FRASE QUE O D98 MATOU AINDA MORAVA, VIVA, EM CINCO. (LAB-151, item 900,
 * a dívida própria, D379)
 *
 * # A regra, e o que a guardava
 *
 * O `CLAUDE.md` §4 diz: *"Não descarta em silêncio campo que o motor publica: destino em `inventario-das-pontes.ts`,
 * conferido contra o motor rodando. **O motivo de uma perda não mora em comentário** (D98, D104)."*
 *
 * A primeira metade tem trava desde o LAB-25: a `guarda-da-ponte.ts` confere o inventário contra o motor rodando, e a
 * regra `campo-vazio` pega a ponte que escreve `null` onde o motor publica valor. A segunda metade só se conferia
 * **escrita** (`enxugar-o-claude.ts`, item 028). O que ela ensina — D98 e D105 — é que *"uma justificativa escrita num
 * comentário não se revalida sozinha"*: o inventário tirou o motivo do comentário **na ponte**, e nada perguntava se a
 * mesma frase continuava viva **noutro lugar**.
 *
 * # O que se mediu (17/10/2026), por LUGAR
 *
 * As frases vencidas são as que a própria casa mediu falsas e registrou com o motivo: duas do D98 (*"o motor não calcula
 * greide"*, *"nenhuma via tem cota"*), uma do D104 (*"não guarda de qual via"*) e uma das perdas remedidas do LAB-93
 * (*"não tem um piso independente"*). O lugar é o **parágrafo**: o comentário de código entre duas linhas vazias, ou o
 * parágrafo de um `.md`, em todo arquivo que o `git` carrega fora de `docs/` (o registro do dia, D118) e de `upstream/`
 * (intocável). Dentro dele, a frase pode estar:
 *
 * - **citada** — entre aspas: alguém está repetindo a frase para dizer o que ela era;
 * - **na história** — a mesma sentença diz que ela era, dizia, deixou de ser, foi falsa (`Até o LAB-22`, `~~`);
 * - **genérica** — *"um motor que não calcula greide"*, *"quando o motor não calcula"*: a frase fala de qualquer motor;
 * - **viva** — afirmada no presente, sobre o motor desta família. É o caso que a regra proíbe.
 *
 * **Medido em 346 arquivos: 26 ocorrências em 24 parágrafos de 19 arquivos — 13 citadas, uma na história, três
 * genéricas e NOVE VIVAS, em oito parágrafos de cinco arquivos**: a frase do D98, 33 dias depois de vencer, afirmada no
 * presente.
 *
 * | onde | o que dizia | o que se fez |
 * |---|---|---|
 * | `esteira/src/symbios-para-contrato.ts` | *"É o contrário do outro motor, que não calcula greide e sai `null`"* — escrita em 02/10, já falsa desde 14/09 e **na véspera do D98**, numa PONTE | consertada |
 * | `testfit/ferramentas/medir.ts` | duas: o cabeçalho (*"não calcula greide — nenhuma via tem cota em lugar nenhum do `Plano`"*) e a linha do console | consertadas (o texto; a ferramenta não muda) |
 * | `testfit/README.md` | a ressalva 5, *"O motor não calcula greide"*, numa lista no presente | consertada (riscada, com a data) |
 * | `README.md` | o resumo do LAB-07, *"e o motor não calcula greide"* | consertada (no passado, com a data) |
 * | `esteira/ferramentas/lab08.ts` | três: o cabeçalho, o `rampa: null` com o motivo ao lado, e a linha do console | **declarada** — ferramenta da prova do LAB-08 |
 *
 * Depois do conserto: 21 ocorrências, **três vivas, as três declaradas**.
 *
 * A do `lab08.ts` é a forma exata da regra descumprida — um `null` com o motivo num comentário — e **fica**, declarada:
 * a ferramenta reproduz a prova congelada do LAB-08 (D118), e consertá-la reescreveria a prova do dia. A rampa do motor
 * hoje sai pela porta (`porta/indicadores.ts`), que não tem a frase.
 *
 * # O que ela NÃO alcança, dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { comoARegraSeLe, comoOComentarioSeLe } from "./texto-das-regras.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

/** A frase do `CLAUDE.md` §4 que esta trava faz perguntar. */
export const A_REGRA = "O motivo de uma perda não mora em comentário";

/** Uma frase que a casa mediu falsa, com onde a medição mora. */
export interface FraseVencida {
  id: string;
  /** Casa a frase no texto normalizado (sem `**`, sem `*`, sem crase, espaço simples). */
  padrao: RegExp;
  /** A decisão que a matou. */
  decisao: string;
  /** O arquivo onde a casa registrou a frase como falsa — a trava confere que ela está lá. */
  fonte: string;
  /** O que a fonte tem de dizer, além da frase, para ser a medição e não uma menção solta. */
  marcaNaFonte: string;
  oQueEVerdade: string;
}

/**
 * As frases vencidas, numa lista fechada. **Frase nova entra aqui quando a casa a mede falsa** — com a fonte onde a
 * medição mora, que a trava confere.
 */
export const AS_FRASES_VENCIDAS: readonly FraseVencida[] = [
  {
    id: "greide",
    padrao: /n[ãa]o calcula greide/i,
    decisao: "D98",
    fonte: "external-engines/esteira/src/inventario-das-pontes.ts",
    marcaNaFonte: "D98",
    oQueEVerdade:
      "o motor do Laboratório de Parcelamento mede rampa média e máxima por via desde o T03 dele (14/09/2026), e a " +
      "ponte as lê desde o LAB-22",
  },
  {
    id: "cota-no-plano",
    padrao: /nenhuma via tem (cota|eleva[çc][ãa]o)/i,
    decisao: "D98",
    fonte: "docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md",
    marcaNaFonte: "LAB-22",
    oQueEVerdade: "o `Plano` do motor carrega `rampaMedia_pct` e `rampaMaxima_pct` em cada via desde o T03 dele",
  },
  {
    id: "face-de-rua",
    padrao: /n[ãa]o guarda de qual via/i,
    decisao: "D104",
    fonte: "external-engines/esteira/src/inventario-das-pontes.ts",
    marcaNaFonte: "D104",
    oQueEVerdade: "o motor guarda o índice da via de frente desde o T02 dele (`face.ts`), e a ponte o traduz desde o LAB-25",
  },
  {
    id: "piso-de-caixa",
    padrao: /n[ãa]o tem um piso independente/i,
    decisao: "D226 remedida no LAB-93",
    fonte: "external-engines/esteira/src/perdas-remedidas.ts",
    marcaNaFonte: "saiu-da-lista",
    oQueEVerdade:
      "o piso existe desde que `legais.caixaViariaMinima_m` nasceu: a `viasComPistaCurta` compara a pista com o mínimo " +
      "e avisa",
  },
];

/** O que faz uma sentença ser HISTÓRIA da frase, e não afirmação dela. */
export const MARCAS_DE_HISTORIA: readonly RegExp[] = [
  /~~/,
  /\b(era|eram|dizia|diziam|dizendo|disse|declarava|estava)\b/i,
  /deixou de ser|deixaram de ser/i,
  /\bat[ée] (o|este) (LAB|T)-?\d+/i,
  /\bfals[oa]s?\b/i,
  /\bvencid[oa]s?\b/i,
  /com a justificativa|com o coment[áa]rio/i,
  /\boQueDizia\b/,
];

/** O que faz uma sentença falar de QUALQUER motor, e não do desta família. */
export const MARCAS_GENERICAS: readonly RegExp[] = [/\b(um|qualquer) motor que n[ãa]o/i, /\b(quando|se) o motor n[ãa]o/i];

/** Onde a varredura não olha, e por quê. */
export const FORA_DO_UNIVERSO: readonly { prefixo: RegExp; motivo: string }[] = [
  { prefixo: /^docs\//, motivo: "o registro do dia: relatório, decisão e recado contam o que era, e não se reescrevem (D118)" },
  { prefixo: /(^|\/)upstream\//, motivo: "cópia exata de código de fora, intocável (§3)" },
  { prefixo: /(^|\/)node_modules\//, motivo: "dependência instalada, não é desta casa" },
];

const EXTENSOES = /\.(ts|tsx|mts|mjs|js|sh|md|ya?ml)$/;

export type Classe = "citada" | "historia" | "generica" | "viva";

export interface Ocorrencia {
  arquivo: string;
  linha: number;
  frase: string;
  classe: Classe;
  sentenca: string;
}

export interface FraseViva {
  arquivo: string;
  frase: string;
  /** Quantos parágrafos vivos, exatamente. */
  quantas: number;
  motivo: string;
}

/**
 * As vivas que FICAM, declaradas. A lista desce com a árvore: se a frase sair do arquivo, a declaração sobra.
 */
export const VIVAS_DECLARADAS: readonly FraseViva[] = [
  {
    arquivo: "external-engines/esteira/ferramentas/lab08.ts",
    frase: "greide",
    quantas: 3,
    motivo:
      "ferramenta da prova do LAB-08 (14/09): reproduz a medição congelada daquele dia, e a ponte de então escrevia " +
      "`null`. Consertar o `rampa: null` reescreveria a prova do dia (D118); a rampa do motor hoje sai pela porta",
  },
];

/** Os pares de aspas de um texto, como intervalos `[início, fim)`. */
function intervalosEntreAspas(texto: string): [number, number][] {
  const saida: [number, number][] = [];
  const aspas = /"[^"]*"|“[^”]*”/g;
  for (let m = aspas.exec(texto); m; m = aspas.exec(texto)) saida.push([m.index, m.index + m[0].length]);
  return saida;
}

function classeDaSentenca(sentenca: string, citada: boolean): Classe {
  if (citada) return "citada";
  if (MARCAS_DE_HISTORIA.some((r) => r.test(sentenca))) return "historia";
  if (MARCAS_GENERICAS.some((r) => r.test(sentenca))) return "generica";
  return "viva";
}

/** Os parágrafos de um arquivo, com a linha onde começam, já lidos como texto corrido. */
export function paragrafos(texto: string, arquivo: string): { linha: number; texto: string }[] {
  const ehMd = arquivo.endsWith(".md");
  const ehCerquilha = /\.(sh|ya?ml)$/.test(arquivo);
  const vazia = (l: string) =>
    (ehMd ? l : l.replace(/^\s*(?:\/\*\*?|\*\/|\*|\/\/|#)\s?/, "").replace(/\*\/\s*$/, "")).trim().length === 0;
  const linhas = texto.split("\n");
  const saida: { linha: number; texto: string }[] = [];
  let inicio = -1;
  const fechar = (fim: number) => {
    if (inicio < 0) return;
    const bruto = linhas.slice(inicio, fim).join("\n");
    const lido = ehMd
      ? comoARegraSeLe(bruto)
      : ehCerquilha
        ? comoARegraSeLe(bruto.replace(/^\s*#\s?/gm, ""))
        : comoOComentarioSeLe(bruto.replace(/^\s*\/\*\*?\s?/gm, ""));
    saida.push({ linha: inicio + 1, texto: lido });
    inicio = -1;
  };
  for (let i = 0; i < linhas.length; i++) {
    if (vazia(linhas[i]!)) fechar(i);
    else if (inicio < 0) inicio = i;
  }
  fechar(linhas.length);
  return saida;
}

/** As ocorrências de frase vencida num arquivo, uma por parágrafo e frase. */
export function ocorrencias(
  texto: string,
  arquivo: string,
  frases: readonly FraseVencida[] = AS_FRASES_VENCIDAS,
): Ocorrencia[] {
  const saida: Ocorrencia[] = [];
  for (const p of paragrafos(texto, arquivo)) {
    // Ênfase e crase saem só para casar; as aspas ficam, porque são elas que dizem "citada".
    const plano = p.texto.replace(/[*`_]/g, "").replace(/\s+/g, " ");
    // As aspas se contam no PARÁGRAFO: uma citação longa atravessa ponto final, e a sentença cortada no meio dela
    // perderia o par.
    const aspas = intervalosEntreAspas(plano);
    const sentencas = plano.split(/(?<=[.!?;:])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕ(«"“-])/);
    for (const f of frases) {
      let achou: Ocorrencia | null = null;
      let desloc = 0;
      for (const s of sentencas) {
        const inicio = plano.indexOf(s, desloc);
        desloc = inicio + s.length;
        const m = f.padrao.exec(s);
        if (!m) continue;
        const onde = inicio + m.index;
        const classe = classeDaSentenca(s, aspas.some(([a, b]) => onde >= a && onde < b));
        // Uma por parágrafo: a pior classe do parágrafo é a que vale.
        if (!achou || classe === "viva")
          achou = { arquivo, linha: p.linha, frase: f.id, classe, sentenca: s.slice(0, 240) };
      }
      if (achou) saida.push(achou);
    }
  }
  return saida;
}

export type TipoDoProblema =
  | "frase-vencida-viva"
  | "declaracao-que-sobra"
  | "frase-sem-fonte"
  | "motivo-curto"
  | "universo-vazio";

export interface Problema {
  onde: string;
  tipo: TipoDoProblema;
  detalhe: string;
}

export interface Resultado {
  arquivosLidos: number;
  ocorrencias: Ocorrencia[];
  porClasse: Record<Classe, number>;
  problemas: Problema[];
}

/** Confere um conjunto de arquivos (caminho → texto). */
export function conferirAsFrasesVencidas(
  arquivos: ReadonlyMap<string, string>,
  declaradas: readonly FraseViva[] = VIVAS_DECLARADAS,
  frases: readonly FraseVencida[] = AS_FRASES_VENCIDAS,
): Resultado {
  const problemas: Problema[] = [];
  const todas: Ocorrencia[] = [];
  for (const [arquivo, texto] of arquivos) todas.push(...ocorrencias(texto, arquivo, frases));

  if (arquivos.size === 0)
    problemas.push({ onde: "a árvore", tipo: "universo-vazio", detalhe: "nenhum arquivo lido — a régua não leu nada (D164)" });

  const vivas = new Map<string, Ocorrencia[]>();
  for (const o of todas.filter((o) => o.classe === "viva")) {
    const k = `${o.arquivo}::${o.frase}`;
    vivas.set(k, [...(vivas.get(k) ?? []), o]);
  }
  const chaves = new Set(declaradas.map((d) => `${d.arquivo}::${d.frase}`));
  for (const [k, os] of vivas) {
    if (chaves.has(k)) continue;
    for (const o of os)
      problemas.push({
        onde: `${o.arquivo}:${o.linha}`,
        tipo: "frase-vencida-viva",
        detalhe: `a frase "${o.frase}" afirmada no presente: "${o.sentenca}"`,
      });
  }
  for (const d of declaradas) {
    const os = vivas.get(`${d.arquivo}::${d.frase}`) ?? [];
    if (os.length !== d.quantas)
      problemas.push({
        onde: d.arquivo,
        tipo: "declaracao-que-sobra",
        detalhe: `declaradas ${d.quantas} vivas de "${d.frase}", e há ${os.length} — a lista desce com a árvore`,
      });
    if (d.motivo.length < 40)
      problemas.push({ onde: d.arquivo, tipo: "motivo-curto", detalhe: `"${d.motivo}" não diz por que a frase fica` });
  }

  const porClasse: Record<Classe, number> = { citada: 0, historia: 0, generica: 0, viva: 0 };
  for (const o of todas) porClasse[o.classe]++;
  return { arquivosLidos: arquivos.size, ocorrencias: todas, porClasse, problemas };
}

/** Confere que cada frase vencida está registrada como falsa na fonte que a lista aponta. */
export function conferirAsFontes(
  ler: (caminho: string) => string,
  frases: readonly FraseVencida[] = AS_FRASES_VENCIDAS,
): Problema[] {
  const problemas: Problema[] = [];
  for (const f of frases) {
    let texto: string;
    try {
      texto = ler(f.fonte);
    } catch {
      texto = "";
    }
    const plano = comoARegraSeLe(texto.replace(/^\s*(?:\*|\/\/)\s?/gm, "")).replace(/[*`_]/g, "");
    if (!f.padrao.test(plano) || !plano.includes(f.marcaNaFonte))
      problemas.push({
        onde: f.fonte,
        tipo: "frase-sem-fonte",
        detalhe: `a frase "${f.id}" e a marca "${f.marcaNaFonte}" (${f.decisao}) não estão em ${f.fonte} — frase vencida sem medição é opinião`,
      });
  }
  return problemas;
}

/** O universo desta trava: o que o `git` carrega, fora de {@link FORA_DO_UNIVERSO}, nas extensões de texto. */
export function oUniverso(raiz: string): Map<string, string> {
  const arquivos = new Map<string, string>();
  for (const f of arquivosQueOGitCarrega(raiz)) {
    if (!EXTENSOES.test(f)) continue;
    if (FORA_DO_UNIVERSO.some((u) => u.prefixo.test(f))) continue;
    let texto: string;
    try {
      texto = readFileSync(join(raiz, f), "utf8");
    } catch {
      continue; // apagado na árvore e ainda no índice: não há texto a ler
    }
    arquivos.set(f, texto);
  }
  return arquivos;
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "a frase falsa que a casa ainda não mediu: a lista é das que já venceram, e frase nova só entra quando alguém a mede",
  "a mesma ideia dita com outras palavras (\"o motor não mede rampa\"): a régua casa a frase, não o sentido",
  "o motivo de perda que mora num TEXTO entre aspas no código (`motivo: \"…\"`): conta como citação — a perda em dado é da guarda-da-ponte, contra o motor rodando",
  "a sentença que tem marca de história por outra razão (um \"era\" que fala de outra coisa): a classe é da sentença, não do sentido",
  "os relatórios, as decisões e os recados (`docs/`): são o registro do dia e dizem o que era (D118)",
];
