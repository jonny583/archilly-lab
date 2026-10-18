/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O ESTADO DO DESPERTADOR MORA NUM LUGAR SÓ — e a porta da frente dizia outro. (LAB-186, item 900, D414)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O item 004 (09/10/2026, D234) pôs o estado do despertador num lugar só — a conta dos disparos do
 * `docs/ONDE_PARAMOS.md`, que diz de si mesma: *"Este é o ÚNICO lugar do repositório que diz o estado do despertador
 * agora."* A trava que nasceu com ele (`disparos-do-despertador.ts`) pergunta **dentro** daquela seção — mais de um id é o
 * defeito —, e ninguém perguntava **fora** dela.
 *
 * E fora dela, na porta da frente, o `README.md` da raiz dizia desde o LF-FINAL (14/09/2026): *"A fila autônoma está
 * esgotada desde 14/09/2026 — os cinco prompts dela foram executados e mesclados, e o despertador foi apagado"*. Falso
 * desde o dia seguinte (a fila de 15/09) e, desde 09/10, falso de outro jeito: a ida vem da caixa de entrada e o
 * despertador acorda a casa. Espécie da regra 16: **mensagem fixa que afirma estado sem perguntar** — no primeiro
 * arquivo que o GitHub mostra a quem chega.
 *
 * # A pergunta, por LUGAR
 *
 * O universo é **todo `.md` que o `git` carrega**, menos os lugares onde a frase datada é o próprio conteúdo
 * ({@link OS_DIARIOS}, cada um com o motivo, e a trava confere que cada um existe). Em cada parágrafo, depois de sair o
 * riscado, a crase e a citação (`semRiscadoNemCitado`, a leitura do D192), procura-se a frase que **afirma o estado no
 * presente** ({@link AS_FORMAS}): *o despertador foi/está/segue apagado, desligado, ligado, religado*, e *a fila está
 * esgotada*. O lugar é o parágrafo e não a linha, porque o `.md` quebra a frase onde a coluna acaba.
 *
 * **Medido em 18/10/2026, antes do conserto: um achado, no `README.md`** — o parágrafo do topo. Os outros seis
 * `README.md`, o `INDEX.md`, o `CLAUDE.md` e o `COMO_FUNCIONA.md` não afirmam estado. Os números do universo o teste
 * imprime, e o relatório do LAB-186 guarda.
 *
 * # A porta da frente
 *
 * O bloco de citação do topo do `README.md` passa a dizer **onde** o estado mora, e não **qual** ele é: a caixa de
 * entrada e a conta dos disparos. A régua cobra que o bloco cite os dois caminhos ({@link A_PORTA_CITA}).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { comoARegraSeLe, semRiscadoNemCitado } from "./texto-das-regras.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

/** O lugar único (D234). */
export const O_LUGAR = "docs/ONDE_PARAMOS.md";
/** A porta da frente. */
export const A_PORTA = "README.md";
/** O que o bloco do topo da porta tem de citar — onde o estado mora. */
export const A_PORTA_CITA: readonly string[] = ["docs/caixa-de-entrada/COMO_FUNCIONA.md", "docs/ONDE_PARAMOS.md"];

/** As frases que afirmam o estado no presente. Leem o parágrafo já normalizado (uma linha, sem `**` nem `>`). */
export const AS_FORMAS: readonly { id: string; padrao: RegExp }[] = [
  {
    id: "despertador",
    padrao: /\bdespertador\s+(?:foi|está|esta|segue|ficou|continua|é)\s+(?:apagad|desligad|religad|ligad)/i,
  },
  { id: "fila-esgotada", padrao: /\bfila(?:\s+autônoma)?\s+(?:está|esta|segue|ficou|continua)\s+esgotad/i },
];

/** Os lugares onde a frase datada é o conteúdo. Pasta termina em `/`. */
export const OS_DIARIOS: readonly { lugar: string; motivo: string }[] = [
  { lugar: O_LUGAR, motivo: "o lugar único do estado (D234), e embaixo dele a história, uma entrada por rodada" },
  { lugar: "docs/prompts/FILA.md", motivo: "o diário das filas: cada seção é datada e diz o estado DAQUELE dia" },
  { lugar: "docs/DECISOES.md", motivo: "decisão registrada com o motivo e a data; não se reescreve" },
  { lugar: "docs/HISTORIA_DAS_REGRAS.md", motivo: "o relato das regras, palavra por palavra (item 028)" },
  { lugar: "docs/relatorios/", motivo: "relato datado de cada rodada (D118)" },
  { lugar: "docs/provas/", motivo: "os números de cada prova, congelados" },
  { lugar: "docs/caixa-de-entrada/0", motivo: "os itens do chat, como chegaram; o COMO_FUNCIONA fica no universo" },
  { lugar: "docs/caixa-de-entrada/9", motivo: "o item contínuo 900, como chegou" },
];

const ehDiario = (caminho: string) => OS_DIARIOS.some((d) => caminho === d.lugar || (!d.lugar.endsWith(".md") && caminho.startsWith(d.lugar)));
const ehForaDoUniverso = (caminho: string) => caminho.includes("node_modules/") || caminho.split("/").includes("upstream");

export interface Achado {
  arquivo: string;
  forma: string;
  trecho: string;
}

/** As formas afirmadas num texto `.md`, parágrafo a parágrafo. */
export function afirmacoesDeEstado(arquivo: string, texto: string): Achado[] {
  const achados: Achado[] = [];
  for (const paragrafo of texto.split(/\n\s*\n/)) {
    const lido = semRiscadoNemCitado(comoARegraSeLe(paragrafo));
    for (const f of AS_FORMAS) {
      const m = f.padrao.exec(lido);
      if (m) achados.push({ arquivo, forma: f.id, trecho: lido.slice(Math.max(0, m.index - 40), m.index + 60) });
    }
  }
  return achados;
}

/** O bloco de citação logo abaixo do título da porta. */
export function oBlocoDaPorta(texto: string): string | null {
  const linhas = texto.split("\n");
  const inicio = linhas.findIndex((l) => l.startsWith(">"));
  if (inicio < 0) return null;
  const fim = linhas.findIndex((l, i) => i > inicio && !l.startsWith(">"));
  return linhas.slice(inicio, fim < 0 ? undefined : fim).join("\n");
}

export interface Resultado {
  lidos: number;
  diarios: number;
  achados: Achado[];
  problemas: string[];
}

export function conferir(caminhos: readonly string[], ler: (c: string) => string | null, existe: (c: string) => boolean): Resultado {
  const problemas: string[] = [];
  const achados: Achado[] = [];
  let lidos = 0;
  let diarios = 0;
  for (const c of caminhos) {
    if (!c.endsWith(".md") || ehForaDoUniverso(c)) continue;
    if (ehDiario(c)) {
      diarios++;
      continue;
    }
    const texto = ler(c);
    if (texto === null) {
      problemas.push(`${c}: o git carrega e não se leu`);
      continue;
    }
    lidos++;
    achados.push(...afirmacoesDeEstado(c, texto));
  }
  for (const a of achados) problemas.push(`${a.arquivo}: afirma o estado (${a.forma}) fora de ${O_LUGAR} — «${a.trecho}»`);
  for (const d of OS_DIARIOS) {
    if (d.lugar.endsWith(".md") && !existe(d.lugar)) problemas.push(`${d.lugar}: declarado como diário e não existe`);
    if (d.motivo.length < 20) problemas.push(`${d.lugar}: o motivo do diário não diz nada`);
  }
  const porta = caminhos.includes(A_PORTA) ? ler(A_PORTA) : null;
  const bloco = porta === null ? null : oBlocoDaPorta(porta);
  if (bloco === null) problemas.push(`${A_PORTA}: sem o bloco do topo`);
  else for (const alvo of A_PORTA_CITA) if (!bloco.includes(alvo)) problemas.push(`${A_PORTA}: o bloco do topo não cita ${alvo}`);
  return { lidos, diarios, achados, problemas };
}

export function conferirAArvore(raiz: string): Resultado {
  const ler = (c: string) => {
    const p = join(raiz, c);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  return conferir(arquivosQueOGitCarrega(raiz), ler, (c) => existsSync(join(raiz, c)));
}

export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o estado dito com outras palavras (\"não há despertador\", \"a casa dorme de vez\"): a régua casa as formas da lista, e forma nova entra nela",
  "o estado dito no código e nos comentários: só o `.md` é lido",
  "a frase entre aspas, riscada ou entre crases: ali ela é citada, e a leitura do D192 a tira de propósito",
  "se a conta dos disparos está CERTA: isso é da `disparos-do-despertador.ts` e do id conferido contra a conta (item 004)",
  "os diários: ali a frase datada é o conteúdo, e cada um está declarado com o motivo",
];
