/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A ESPECIFICAÇÃO COMO CHEGOU — o comentário do topo passa a ser perguntado. (LAB-170, item 900, D398)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A `docs/referencia/LABORATORIO.md` é a especificação do laboratório, gravada no LAB-00 (09/09/2026) e só movida de
 * pasta no LF-FINAL (`R100`). **Nenhum** arquivo de código a citava (contado em 18/10/2026, por nome, nas três suítes):
 * era a maior página de `docs/` sem leitor, 1 491 linhas. O comentário do topo dela afirma o que se fez com o texto
 * recebido, e ninguém perguntava (espécie *mensagem fixa que afirma estado sem perguntar*):
 *
 * | o que a página dizia | medido em 18/10/2026 |
 * |---|---|
 * | *"a numeração das seções foi tornada sequencial (o original repetia 24-28…)"* | **meio verdade.** As 38 seções de nível dois são 1 a 38, sem repetição; as **subseções** não: as cinco da 23 eram `24.1`–`24.5` e as quatro da 28 eram `24.1`–`24.4` — **quatro números repetidos** (`24.1` a `24.4`, duas vezes cada) e todos colidindo com a seção 24. Era exatamente o defeito que o prompt do LAB-00 mandou corrigir (*"corrija apenas a numeração duplicada de seções"*) |
 * | *"Nenhum texto, título ou trecho de conteúdo foi alterado"* | verdadeiro **desde o LAB-00**: o arquivo de hoje e o do commit `f61be91` dão a mesma {@link IMPRESSAO_DO_TEXTO} (o texto sem o comentário e sem os números dos títulos) — e o original do prompt não está no repositório, então antes do LAB-00 não há o que medir |
 * | o `docs/TRIAGEM.md`: *"(`docs/referencia/LABORATORIO.md`, seção 36) pede Melhor / igual / pior / inviável"* | verdadeiro: a 36 é *"MÉTODO DE COMPARAÇÃO"*, e a tabela dela pede isso |
 * | o `docs/INDEX.md` e a `HISTORIA_DAS_REGRAS.md`: *"Etapas A a G"* | verdadeiro: a seção 20 tem as sete, de A a G |
 *
 * O conserto foi terminar o que o prompt pediu — as nove subseções passaram a `23.1`–`23.5` e `28.1`–`28.4`, só o
 * número — e dizê-lo no comentário. **Esta trava pergunta, a cada verde, sem clones:**
 *
 *   1. todo título numerado é único; as seções de nível dois são 1, 2, … N, em ordem; cada subseção leva o número da
 *      seção-mãe e conta 1, 2, … dentro dela;
 *   2. os dois números que o comentário afirma (*"Hoje: N seções e M subseções numeradas"*) são os do arquivo;
 *   3. o texto, tirados o comentário do topo e os números dos títulos, tem a {@link IMPRESSAO_DO_TEXTO} — mudar uma
 *      palavra da especificação passa a ser gesto deliberado, que troca a impressão no mesmo commit e diz por quê;
 *   4. toda citação de seção da especificação em outra página (*"`LABORATORIO.md`, seção N"*), por LUGAR — todo `.md`
 *      que o `git` carrega, fora dos relatórios e do `RECADOS.md`, que são história —, aponta para seção que existe; e
 *      as duas que {@link CITACOES_CONHECIDAS} conhece apontam para o título que dizem;
 *   5. as Etapas que o índice e a história prometem (A a G) são as da seção 20.
 *
 * **O que ela não alcança, dito:** o texto **antes** do LAB-00 (o prompt colado não foi guardado; o *"tal como
 * recebida"* do comentário é a palavra da sessão daquele dia) e o **sentido** do que a especificação manda — se o
 * laboratório cumpre cada seção é pergunta das travas de cada regra, não desta.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const A_ESPECIFICACAO = "docs/referencia/LABORATORIO.md";

/** O commit em que a especificação nasceu (LAB-00); o LF-FINAL só a moveu de pasta (`R100`). */
export const COMMIT_DE_NASCIMENTO = "f61be91";
/** O caminho dela naquele commit. */
export const CAMINHO_NO_NASCIMENTO = "docs/LABORATORIO.md";

/**
 * A impressão do texto da especificação sem o comentário do topo e sem os números dos títulos (`sha256`, hex).
 * Medida em 18/10/2026 nos dois lados — o arquivo de hoje e o do `f61be91` — e igual: o texto não mudou desde o LAB-00.
 * Mudou de propósito: recalcule com {@link impressaoDoTexto}, troque aqui e diga por quê no commit.
 */
export const IMPRESSAO_DO_TEXTO = "4926990e724d3cf4914f32e2093dff9845c0d6080aa7d507adf78884a8130609";

export interface Titulo {
  linha: number;
  nivel: number;
  /** `[23]` para `## 23. …`, `[23, 1]` para `### 23.1 …`. */
  numero: number[];
  texto: string;
}

const TITULO_NUMERADO = /^(#{2,6}) (\d+(?:\.\d+)*)\.? +(.*)$/;
const CERCA = /^\s*(```|~~~)/;

/** Os títulos numerados (`## 3. …`, `### 23.1 …`), fora de bloco cercado. */
export function titulosNumerados(texto: string): Titulo[] {
  const saida: Titulo[] = [];
  let dentroDeCerca = false;
  texto.split("\n").forEach((l, i) => {
    if (CERCA.test(l)) {
      dentroDeCerca = !dentroDeCerca;
      return;
    }
    if (dentroDeCerca) return;
    const m = TITULO_NUMERADO.exec(l);
    if (!m) return;
    saida.push({
      linha: i + 1,
      nivel: m[1]!.length,
      numero: m[2]!.split(".").map(Number),
      texto: m[3]!.trim(),
    });
  });
  return saida;
}

export type TipoDeProblema =
  | "numero-repetido"
  | "secao-fora-de-ordem"
  | "subsecao-sem-a-mae"
  | "subsecao-fora-de-ordem"
  | "profundidade-errada";

export interface Problema {
  tipo: TipoDeProblema;
  linha: number;
  detalhe: string;
}

/** A régua da numeração: única, sequencial, e cada subseção dentro da sua seção. */
export function conferirNumeracao(titulos: readonly Titulo[]): Problema[] {
  const problemas: Problema[] = [];
  const vistos = new Map<string, number>();
  let secao = 0;
  let sub = 0;
  for (const t of titulos) {
    const chave = t.numero.join(".");
    const antes = vistos.get(chave);
    if (antes !== undefined) {
      problemas.push({ tipo: "numero-repetido", linha: t.linha, detalhe: `${chave} já é a linha ${antes}` });
    } else {
      vistos.set(chave, t.linha);
    }
    if (t.numero.length !== t.nivel - 1) {
      problemas.push({
        tipo: "profundidade-errada",
        linha: t.linha,
        detalhe: `${chave} num título de nível ${t.nivel}`,
      });
      continue;
    }
    if (t.numero.length === 1) {
      if (t.numero[0] !== secao + 1) {
        problemas.push({
          tipo: "secao-fora-de-ordem",
          linha: t.linha,
          detalhe: `${chave} depois da ${secao}`,
        });
      }
      secao = t.numero[0]!;
      sub = 0;
    } else if (t.numero.length === 2) {
      if (t.numero[0] !== secao) {
        problemas.push({
          tipo: "subsecao-sem-a-mae",
          linha: t.linha,
          detalhe: `${chave} dentro da seção ${secao}`,
        });
      } else if (t.numero[1] !== sub + 1) {
        problemas.push({
          tipo: "subsecao-fora-de-ordem",
          linha: t.linha,
          detalhe: `${chave} depois da ${secao}.${sub}`,
        });
      }
      sub = t.numero[1]!;
    }
  }
  return problemas;
}

/** O comentário HTML do topo (o primeiro `<!-- … -->`, se o arquivo começa por ele), ou `null`. */
export function comentarioDoTopo(texto: string): string | null {
  const m = /^\s*<!--([\s\S]*?)-->/.exec(texto);
  return m ? m[1]! : null;
}

/** Os dois números que o comentário afirma — `null` quando a frase some. */
export function numerosDoComentario(texto: string): { secoes: number; subsecoes: number } | null {
  const c = comentarioDoTopo(texto);
  if (c === null) return null;
  const m = /Hoje:\s*(\d+)\s+seções\s+e\s+(\d+)\s+subseções\s+numeradas/.exec(c.replace(/\s+/g, " "));
  return m ? { secoes: Number(m[1]), subsecoes: Number(m[2]) } : null;
}

/** O texto sem o comentário do topo e com os números dos títulos apagados — o que a impressão mede. */
export function textoSemNumeros(texto: string): string {
  const semComentario = texto.replace(/^\s*<!--[\s\S]*?-->\s*/, "");
  let dentroDeCerca = false;
  return semComentario
    .split("\n")
    .map((l) => {
      if (CERCA.test(l)) {
        dentroDeCerca = !dentroDeCerca;
        return l;
      }
      if (dentroDeCerca) return l;
      const m = TITULO_NUMERADO.exec(l);
      return m ? `${m[1]} # ${m[3]!.trim()}` : l;
    })
    .join("\n");
}

export const impressaoDoTexto = (texto: string): string =>
  createHash("sha256").update(textoSemNumeros(texto), "utf8").digest("hex");

export interface Citacao {
  arquivo: string;
  linha: number;
  secao: number;
}

/** *"`LABORATORIO.md`, seção 36"*, *"LABORATORIO.md §36"* — a seção citada, numa janela curta depois do nome. */
const CITACAO = /LABORATORIO\.md[^\n]{0,40}?(?:seç(?:ão|ao)|§)\s*(\d+)/g;

export function citacoesEm(arquivo: string, texto: string): Citacao[] {
  const saida: Citacao[] = [];
  texto.split("\n").forEach((l, i) => {
    for (const m of l.matchAll(CITACAO)) saida.push({ arquivo, linha: i + 1, secao: Number(m[1]) });
  });
  return saida;
}

/** As citações que esta trava conhece pelo título — as que uma página da casa usa para dizer o que a seção pede. */
export const CITACOES_CONHECIDAS: readonly { arquivo: string; secao: number; titulo: string }[] = [
  { arquivo: "docs/TRIAGEM.md", secao: 36, titulo: "MÉTODO DE COMPARAÇÃO" },
];

/** Onde se procura citação: todo `.md` versionado, fora da história (relatórios e recados) e da própria página. */
export const ehLugarDeCitacao = (caminho: string): boolean =>
  caminho.endsWith(".md") &&
  !caminho.startsWith("docs/relatorios/") &&
  !caminho.includes("/upstream/") &&
  caminho !== A_ESPECIFICACAO;

/** As letras das Etapas (`### Etapa A --- …`) dentro da seção 20. */
export function etapasDaSecao20(texto: string): string[] {
  const linhas = texto.split("\n");
  const titulos = titulosNumerados(texto).filter((t) => t.nivel === 2);
  const t20 = titulos.find((t) => t.numero[0] === 20);
  if (!t20) return [];
  const fim = titulos.find((t) => t.linha > t20.linha)?.linha ?? linhas.length + 1;
  const letras: string[] = [];
  for (let i = t20.linha; i < fim - 1; i++) {
    const m = /^#{3,} Etapa ([A-Z])\b/.exec(linhas[i]!);
    if (m) letras.push(m[1]!);
  }
  return letras;
}

export interface Resultado {
  titulos: Titulo[];
  secoes: number;
  subsecoes: number;
  problemas: Problema[];
  comentario: { secoes: number; subsecoes: number } | null;
  impressao: string;
  etapas: string[];
}

export function conferirAEspecificacao(raiz: string): Resultado {
  const texto = readFileSync(join(raiz, A_ESPECIFICACAO), "utf8");
  const titulos = titulosNumerados(texto);
  return {
    titulos,
    secoes: titulos.filter((t) => t.numero.length === 1).length,
    subsecoes: titulos.filter((t) => t.numero.length === 2).length,
    problemas: conferirNumeracao(titulos),
    comentario: numerosDoComentario(texto),
    impressao: impressaoDoTexto(texto),
    etapas: etapasDaSecao20(texto),
  };
}
