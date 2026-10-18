/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O QUE PRECISA MUDAR NOS VIZINHOS VIRA LISTA EM RELATÓRIO — e a página dava quatro exemplos, dois em prosa.
 *  (LAB-178, item 900, D406)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, tabela *Os repositórios vizinhos*, do LF-FINAL (14/09/2026), dizia:
 *
 * > O que precisa mudar neles vira **lista em relatório** · ✅ · LAB-07 §9 (8 correções), LAB-02 §5, LAB-03 e LAB-08 —
 * > todos com o número e sem commit lá
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. A regra tem trava desde o LAB-149
 * (`pedido-ao-vizinho.ts`, D377), que pergunta a todo relatório se o lugar de pedido ao vizinho tem item numerado — e
 * a linha não a nomeava; os quatro exemplos, ninguém perguntava. Medido em 18/10/2026 com a régua do LAB-149:
 *
 * | exemplo | o que a régua acha |
 * |---|---|
 * | LAB-07 | dois lugares: *"9 · A lista para o T02 do Testfit"*, com os oito itens, e *"O Generate: afetado — diagnóstico para repassar"*, sem lista (congelado no LAB-149) |
 * | LAB-02 | nenhum: o pedido do §5 tem lista, mas abre num parágrafo em negrito, forma que a régua não lê |
 * | LAB-03 | um, sem lista — congelado no LAB-149 |
 * | LAB-08 | nenhum: *"uma pergunta, com número, para o Generate"*, em prosa |
 *
 * Dois dos quatro exemplos de *"lista em relatório"* saíram em prosa. O *"com o número"* é o número medido, não a
 * numeração, e esse é verdadeiro nos quatro — mas a linha diz *lista*.
 *
 * # A régua
 *
 * 1. **A linha** nomeia a trava do LAB-149, o LAB-149, esta trava e o LAB-178 (`linha-nao-nomeia`); escreve
 *    *"**K** pedidos sem lista"*, K o comprimento de `SEM_LISTA_ANTES_DA_TRAVA` (`linha-numero-errado`); não diz mais
 *    *"todos com o número"* (`linha-promete-demais`); e não cita relatório (`LAB-<n>`) que não seja o LAB-149, o
 *    LAB-178 ou um dos {@link EXEMPLOS} da tabela (`linha-cita-fora-da-tabela`).
 * 2. **A tabela** da seção *Reconferido no LAB-178* tem uma linha por exemplo, nem mais nem menos
 *    (`tabela-sem-exemplo`, `tabela-com-outro`), e as quatro colunas de número — lugares, com lista, itens numerados,
 *    sem lista congelados — são as que `lugaresDePedido` acha no relatório (`tabela-numero-errado`).
 * 3. **Universo vazio** — nenhum relatório lido, ou exemplo que o `git` não carrega → `universo-vazio` (D213).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { SEM_LISTA_ANTES_DA_TRAVA, chaveDoLugar, lugaresDePedido } from "./pedido-ao-vizinho.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela que esta régua responde. */
export const A_LINHA = "| O que precisa mudar neles vira **lista em relatório** |";
/** A trava que pergunta a regra aos relatórios (LAB-149) e esta, que pergunta a linha. */
export const A_TRAVA_DOS_RELATORIOS = "external-engines/esteira/src/pedido-ao-vizinho.ts";
export const O_PONTEIRO = "external-engines/esteira/src/o-pedido-na-pagina.ts";
export const ESTA_RODADA = 178;
export const RODADA_DA_TRAVA = 149;

/** Os quatro exemplos que a linha dava desde o LF-FINAL. */
export const EXEMPLOS: readonly number[] = [2, 3, 7, 8];

/** O título da seção da página que leva a tabela dos exemplos. */
export const A_SECAO = "## Reconferido no LAB-178";

export interface Contagem {
  lugares: number;
  comLista: number;
  itens: number;
  congelados: number;
}

/** O que a régua do LAB-149 acha num relatório. */
export function contar(arquivo: string, texto: string): Contagem {
  const ls = lugaresDePedido(arquivo, texto);
  return {
    lugares: ls.length,
    comLista: ls.filter((l) => l.itensNumerados > 0).length,
    itens: ls.reduce((s, l) => s + l.itensNumerados, 0),
    congelados: ls.filter((l) => l.itensNumerados === 0 && chaveDoLugar(l) in SEM_LISTA_ANTES_DA_TRAVA).length,
  };
}

/** A linha da página, ou `null`. */
export function aLinha(pagina: string): string | null {
  return pagina.split("\n").find((l) => l.startsWith(A_LINHA)) ?? null;
}

/** As linhas da tabela da seção: `| LAB-n | lugares | com lista | itens | congelados | … |` → número e contagem. */
export function aTabela(pagina: string): Map<number, Contagem> | null {
  const linhas = pagina.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(A_SECAO));
  if (i < 0) return null;
  const t = new Map<number, Contagem>();
  for (let j = i + 1; j < linhas.length && !/^##\s/.test(linhas[j]!); j++) {
    const m = /^\|\s*LAB-(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|/.exec(linhas[j]!);
    if (m)
      t.set(Number(m[1]), { lugares: Number(m[2]), comLista: Number(m[3]), itens: Number(m[4]), congelados: Number(m[5]) });
  }
  return t;
}

export type TipoDeProblema =
  | "linha-ausente"
  | "linha-nao-nomeia"
  | "linha-numero-errado"
  | "linha-promete-demais"
  | "linha-cita-fora-da-tabela"
  | "tabela-ausente"
  | "tabela-sem-exemplo"
  | "tabela-com-outro"
  | "tabela-numero-errado"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

export interface Resultado {
  /** Os relatórios lidos (os exemplos que o `git` carrega) — publicado, porque `every` sobre vazio é verdade. */
  lidos: number;
  medido: Map<number, Contagem>;
  problemas: Problema[];
}

/** A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null`. */
export function conferirAPagina(arquivos: readonly string[], ler: (caminho: string) => string | null): Resultado {
  const problemas: Problema[] = [];
  const medido = new Map<number, Contagem>();
  const carregados = new Set(arquivos);
  for (const n of EXEMPLOS) {
    const c = `docs/relatorios/LAB-${String(n).padStart(2, "0")}.md`;
    const t = carregados.has(c) ? ler(c) : null;
    if (t === null) {
      problemas.push({ tipo: "universo-vazio", detalhe: `o git não carrega ${c}, um dos exemplos da página` });
      continue;
    }
    medido.set(n, contar(c.slice("docs/relatorios/".length), t));
  }
  if (medido.size === 0) problemas.push({ tipo: "universo-vazio", detalhe: "nenhum exemplo lido — verde sobre zero não é verde" });

  const pagina = ler(A_PAGINA);
  const linha = pagina === null ? null : aLinha(pagina);
  if (linha === null) {
    problemas.push({ tipo: "linha-ausente", detalhe: `o ${A_PAGINA} não tem a linha que começa por "${A_LINHA}"` });
  } else {
    for (const n of [A_TRAVA_DOS_RELATORIOS, O_PONTEIRO, `LAB-${RODADA_DA_TRAVA}`, `LAB-${ESTA_RODADA}`])
      if (!linha.includes(n)) problemas.push({ tipo: "linha-nao-nomeia", detalhe: `a linha da lista aos vizinhos não nomeia ${n}` });
    const k = Object.keys(SEM_LISTA_ANTES_DA_TRAVA).length;
    const escrito = /\*\*(\d+)\*\* pedidos sem lista/.exec(linha);
    if (!escrito || Number(escrito[1]) !== k)
      problemas.push({
        tipo: "linha-numero-errado",
        detalhe: `a linha tem de escrever "**${k}** pedidos sem lista" (SEM_LISTA_ANTES_DA_TRAVA); escreve ${escrito ? `"**${escrito[1]}**"` : "outra coisa"}`,
      });
    if (/todos com o número/i.test(linha))
      problemas.push({ tipo: "linha-promete-demais", detalhe: `a linha ainda diz "todos com o número" dos exemplos, e dois saíram em prosa` });
    const permitidos = new Set([RODADA_DA_TRAVA, ESTA_RODADA, ...EXEMPLOS]);
    for (const m of linha.matchAll(/\bLAB-(\d+)\b/g))
      if (!permitidos.has(Number(m[1])))
        problemas.push({ tipo: "linha-cita-fora-da-tabela", detalhe: `a linha cita LAB-${m[1]}, que a tabela do ${A_SECAO.slice(3)} não pergunta` });
  }

  const tabela = pagina === null ? null : aTabela(pagina);
  if (tabela === null) {
    problemas.push({ tipo: "tabela-ausente", detalhe: `o ${A_PAGINA} não tem a seção "${A_SECAO}"` });
  } else {
    for (const n of EXEMPLOS) {
      const escrito = tabela.get(n);
      const m = medido.get(n);
      if (!escrito) {
        problemas.push({ tipo: "tabela-sem-exemplo", detalhe: `a tabela não tem a linha do LAB-${n}` });
        continue;
      }
      if (!m) continue;
      for (const campo of ["lugares", "comLista", "itens", "congelados"] as const)
        if (escrito[campo] !== m[campo])
          problemas.push({
            tipo: "tabela-numero-errado",
            detalhe: `LAB-${n}, ${campo}: a tabela escreve ${escrito[campo]}, a régua do LAB-${RODADA_DA_TRAVA} acha ${m[campo]}`,
          });
    }
    for (const n of tabela.keys())
      if (!EXEMPLOS.includes(n)) problemas.push({ tipo: "tabela-com-outro", detalhe: `a tabela tem a linha do LAB-${n}, que não é exemplo da página` });
  }
  return { lidos: medido.size, medido, problemas };
}

/** A árvore de verdade: o `git` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirAPagina(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "a coluna da leitura à mão da tabela (o que o pedido do LAB-02 e o do LAB-08 dizem): ela é texto, não número, e a régua não a lê",
  "o pedido em prosa ou em parágrafo de abertura em negrito, em qualquer relatório: a régua do LAB-149 lê o título e o marcador, e esta conta com ela — as duas formas estão fora; medido no LAB-178, dos sete parágrafos de pedido abertos em negrito cinco estão sob título que ela lê, e os dois de fora (LAB-02, com lista; LAB-56, um lembrete já numerado antes) não escondem pedido sem lista",
  "que nada foi escrito lá: é a linha de cima, \"Nenhum commit, nenhum push nos vizinhos\", com a trava do LAB-162",
  "se a lista diz o que o vizinho precisa: a régua do LAB-149 conta item numerado, não o conteúdo",
];
