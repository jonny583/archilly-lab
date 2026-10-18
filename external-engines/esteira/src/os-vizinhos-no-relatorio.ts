/**
 * ════════════════════════════════════════════════════════════════════════════
 *  OS VIZINHOS SÃO SÓ LEITURA — e "o número sai no relatório" de TODA rodada. (LAB-177, item 900, D405)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, tabela *Os repositórios vizinhos*, do LF-FINAL (14/09/2026), dizia:
 *
 * > Geo, Generate e o motor de parcelamento são **só leitura** · ✅ · `git status` nos três ao fim de **toda** rodada, e
 * > o número sai no relatório. Em 14/09, ao fim do LAB-08: **0 alterações** em cada
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. A linha tem duas metades, e só uma tinha trava:
 *
 * | metade | quem pergunta |
 * |---|---|
 * | *"`git status` nos três ao fim de toda rodada"* | a `regras.test.ts`, §4 (*"os clones somente-leitura estão limpos"*, LAB-38, D136/D143), a cada verde com clones — e a linha não a nomeava |
 * | *"o número sai no relatório"* | **ninguém** — e medido em 18/10/2026, por LUGAR (todo `docs/relatorios/LAB-<n>.md`): dos relatórios de antes desta rodada, {@link CALADOS} não dizem o `git status` dos vizinhos em lugar nenhum |
 *
 * # A régua
 *
 * 1. **O que conta como dizer** ({@link dizOStatusDosVizinhos}): o texto, com o espaço achatado, tem `git status` e, a
 *    até {@link JANELA} caracteres dele, os vizinhos (*"os três"*, *"vizinho"*, *"clone"*) **e** o resultado (*"limpo"*,
 *    *"vazio"*, *"0 alterações"*, *"nenhuma alteração"*, *"sem alteração"*). As formas foram tiradas dos relatórios que
 *    dizem; o teste prova que cada forma conta e que `git status` sozinho, ou sobre outra coisa, não conta.
 * 2. **De {@link DESDE} em diante, todo relatório diz** — `relatorio-calado`. É daqui para a frente que a linha
 *    corrigida promete.
 * 3. **O passado é congelado nos dois sentidos:** relatório de antes de {@link DESDE} que não diz e não está em
 *    {@link CALADOS} → `calado-fora-da-lista`; o que está em `CALADOS` e diz (alguém o reescreveu) ou não existe →
 *    `declaracao-que-sobra`. Relatório não se reescreve para passar numa régua: a lista é a medição de 18/10.
 * 4. **A linha** nomeia as duas travas e escreve *"**N** dos M relatórios"* — N o comprimento de `CALADOS`, M os relatórios
 *    de antes de {@link DESDE} que a régua leu, os dois perguntados, nenhum digitado sem conferência —, e não diz mais
 *    *"toda rodada, e o número sai no relatório"* sem o recorte — `linha-ausente`, `linha-nao-nomeia`,
 *    `linha-numero-errado`.
 * 5. **Universo vazio** (nenhum relatório lido) → `universo-vazio`: *"nenhum dos 0"* não é verde (D213).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela que esta régua responde. */
export const A_LINHA = "| Geo, Generate e o motor de parcelamento são **só leitura** |";
/** Os dois ponteiros que a linha passa a carregar: esta régua e a que pergunta o clone de verdade. */
export const O_PONTEIRO = "external-engines/esteira/src/os-vizinhos-no-relatorio.ts";
export const A_TRAVA_DO_CLONE = "external-engines/esteira/tests/regras.test.ts";

/** A primeira rodada de que a linha corrigida passa a cobrar o relatório: esta. */
export const DESDE = 177;

/** O relatório de uma rodada da casa. Os outros (`LF-*`, `LAB01_ADAPTADOR`, `RECADOS`, `BALANCOS`) não são rodadas `LAB-<n>`. */
export const RELATORIO = /^docs\/relatorios\/LAB-(\d+)\.md$/;

/** A distância, em caracteres, entre `git status` e as palavras que dizem de quem e o resultado. */
export const JANELA = 220;

const VIZINHOS = /\bos tr[êe]s\b|\bnos tr[êe]s\b|tr[êe]s clones|vizinh|\bclones?\b/i;
const RESULTADO = /limp[oa]s?\b|\bvazi[oa]\b|\b0 altera[çc][õo]es|nenhum[a]? (arquivo )?altera|sem (nenhuma )?altera[çc][ãa]o/i;

/**
 * Os relatórios de antes do LAB-177 que NÃO dizem o `git status` dos vizinhos — medidos em 18/10/2026 com
 * {@link dizOStatusDosVizinhos}. Congelados: um que passe a dizer, ou que suma, reprova (`declaracao-que-sobra`).
 */
export const CALADOS: readonly number[] = [
  2, 3, 7, 48, 49, 50, 51, 52, 57, 58, 59, 60, 61, 69, 75, 77, 78, 79, 85, 88, 89, 90, 91, 92, 93, 94, 95, 116, 117, 118, 119,
  120, 121, 122, 123, 124, 125, 153,
];

/** Se o texto diz o `git status` dos vizinhos e o resultado. */
export function dizOStatusDosVizinhos(texto: string): boolean {
  const t = texto.replace(/\s+/g, " ");
  const re = /git status/gi;
  for (let m = re.exec(t); m; m = re.exec(t)) {
    const janela = t.slice(Math.max(0, m.index - JANELA), m.index + m[0].length + JANELA);
    if (VIZINHOS.test(janela) && RESULTADO.test(janela)) return true;
  }
  return false;
}

/** A linha da página, ou `null`. */
export function aLinha(pagina: string): string | null {
  return pagina.split("\n").find((l) => l.startsWith(A_LINHA)) ?? null;
}

export type TipoDeProblema =
  | "relatorio-calado"
  | "calado-fora-da-lista"
  | "declaracao-que-sobra"
  | "linha-ausente"
  | "linha-nao-nomeia"
  | "linha-numero-errado"
  | "linha-promete-demais"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

export interface Resultado {
  /** Quantos relatórios `LAB-<n>` foram lidos — publicado, porque `every` sobre vazio é verdade. */
  lidos: number;
  /** Os que dizem, e os que não dizem, por número. */
  dizem: number[];
  calados: number[];
  problemas: Problema[];
}

/** A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null`. */
export function conferirOsRelatorios(arquivos: readonly string[], ler: (caminho: string) => string | null): Resultado {
  const problemas: Problema[] = [];
  const dizem: number[] = [];
  const calados: number[] = [];
  for (const c of arquivos) {
    const m = RELATORIO.exec(c);
    if (!m) continue;
    const t = ler(c);
    if (t === null) continue;
    const n = Number(m[1]);
    if (!Number.isFinite(n)) continue;
    (dizOStatusDosVizinhos(t) ? dizem : calados).push(n);
  }
  dizem.sort((a, b) => a - b);
  calados.sort((a, b) => a - b);
  const lidos = dizem.length + calados.length;
  if (lidos === 0) problemas.push({ tipo: "universo-vazio", detalhe: "nenhum relatório LAB-<n> lido — verde sobre zero não é verde" });

  const declarados = new Set(CALADOS);
  for (const n of calados) {
    if (n >= DESDE)
      problemas.push({
        tipo: "relatorio-calado",
        detalhe: `docs/relatorios/LAB-${n}.md não diz o \`git status\` dos três vizinhos ao fim da rodada (de LAB-${DESDE} em diante, todo relatório diz)`,
      });
    else if (!declarados.has(n))
      problemas.push({ tipo: "calado-fora-da-lista", detalhe: `docs/relatorios/LAB-${n}.md não diz o \`git status\` dos vizinhos e não está em CALADOS` });
  }
  const existentes = new Set([...dizem, ...calados]);
  for (const n of CALADOS) {
    if (!existentes.has(n))
      problemas.push({ tipo: "declaracao-que-sobra", detalhe: `LAB-${n} está em CALADOS e o git não carrega docs/relatorios/LAB-${n}.md` });
    else if (dizem.includes(n))
      problemas.push({ tipo: "declaracao-que-sobra", detalhe: `LAB-${n} está em CALADOS e o relatório diz o \`git status\` — relatório antigo reescrito? (a lista é a medição de 18/10)` });
  }

  const pagina = ler(A_PAGINA);
  const linha = pagina === null ? null : aLinha(pagina);
  if (linha === null) {
    problemas.push({ tipo: "linha-ausente", detalhe: `o ${A_PAGINA} não tem a linha que começa por "${A_LINHA}"` });
  } else {
    for (const n of [O_PONTEIRO, A_TRAVA_DO_CLONE, `LAB-${DESDE}`])
      if (!linha.includes(n)) problemas.push({ tipo: "linha-nao-nomeia", detalhe: `a linha dos vizinhos só-leitura não nomeia ${n}` });
    const antes = [...dizem, ...calados].filter((n) => n < DESDE).length;
    const escrito = new RegExp(`\\*\\*(\\d+)\\*\\* dos (\\d+) relatórios`).exec(linha);
    if (!escrito || Number(escrito[1]) !== CALADOS.length || Number(escrito[2]) !== antes)
      problemas.push({
        tipo: "linha-numero-errado",
        detalhe: `a linha tem de escrever "**${CALADOS.length}** dos ${antes} relatórios" (CALADOS, e os relatórios de antes do LAB-${DESDE} lidos); escreve ${escrito ? `"**${escrito[1]}** dos ${escrito[2]}"` : "outra coisa"}`,
      });
    if (/toda\*?\*? rodada, e o número sai no relatório/i.test(linha))
      problemas.push({ tipo: "linha-promete-demais", detalhe: `a linha ainda diz "toda rodada, e o número sai no relatório" sem o recorte` });
  }
  return { lidos, dizem, calados, problemas };
}

/** A árvore de verdade: o `git` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirOsRelatorios(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se o que o relatório diz é VERDADE: ela lê a frase, não o clone — quem pergunta o clone é a `regras.test.ts` §4, a cada verde com clones, e só na máquina em que o verde roda",
  "o momento: a frase pode dizer o `git status` do começo da rodada; a régua não distingue \"antes\" de \"no fim\"",
  "a frase escrita sem as palavras `git status` (\"os clones ficaram intactos\", \"nada mudou lá\"): conta como calada, de propósito — a forma é o que a régua pergunta",
  "QUAIS vizinhos: uma frase que diz um clone só (\"o `git status` do clone ficou limpo\", sobre o Generate) e cita os três por perto conta — o relatório antigo que diz assim está entre os que dizem (LAB-96, LAB-126, LAB-134)",
  "o relatório que não existe: rodada sem `docs/relatorios/LAB-<n>.md` não é perguntada aqui (a conta dos disparos, D401, cruza rodada e recado)",
];
