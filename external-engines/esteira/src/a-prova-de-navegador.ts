/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PROVA DE NAVEGADOR — quantas existem, quem as produz, e o que elas NÃO conferem. (LAB-175, item 900, D403)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, do LF-FINAL (14/09/2026), na seção *O que **não** foi conferido, e por quê*, dizia:
 *
 * > **Prova no navegador com console limpo.** O Lab não tem tela (é regra dele, em `CLAUDE.md` §4). A única prova de
 * > navegador que existe é a do LAB-01 — o `.wasm` carregando no Chromium —, e está em `outputs/lab01/navegador.png`.
 *
 * e, no topo, que o Lab *"não tem tela"*. Espécie: *mensagem fixa que afirma estado sem perguntar*. Medido por LUGAR em
 * 18/10/2026, as três afirmações tinham envelhecido, e nenhuma trava as lia:
 *
 * | a frase | o que a árvore diz |
 * |---|---|
 * | *"a única prova de navegador que existe é a do LAB-01"* | são **duas**: a captura do LAB-01 (`outputs/lab01/navegador.png`, manual, 10/09) e a prova **automática** do LAB-31 (`docs/provas/LAB-31/navegador.json`, escrita por `prova-automatica.ts`, que o `conferir.sh` roda) |
 * | *"o Lab não tem tela (é regra dele, em `CLAUDE.md` §4)"* | o `CLAUDE.md` §4 diz *"não tem interface — com UMA exceção, declarada: a bancada do navegador"* (D381), e a `a-unica-interface.ts` a conta |
 * | *"console limpo"* | a prova do LAB-31 **escuta** o console e o `pageerror`, mas só os usa quando a página NÃO publica o resultado: com o número certo e um erro no console, ela aprova |
 *
 * # O que se pergunta, e onde
 *
 * | pergunta | lugar |
 * |---|---|
 * | quem PRODUZ prova de navegador | todo JS/TS que o `git` carrega importando um condutor de navegador (`playwright`, `puppeteer`…), a string inteira em posição de importação |
 * | onde a prova MORA | todo arquivo do `git` em `outputs/` ou `docs/provas/` com `navegador` no nome |
 * | o que a página DIZ | o item *Prova no navegador* do `SEGURANCA.md`: nomeia cada produtor e cada artefato, nomeia a bancada (o caminho vem de `a-unica-interface.ts`), não diz *"única"*, e diz se o console reprova |
 * | se o CONSOLE reprova | no código do produtor, sem comentário e sem string: um `if (` que testa a variável preenchida pelo `pageerror` |
 * | o topo | toda linha da página que diz *"não tem tela"* ou *"não há tela"* nomeia a bancada |
 *
 * As duas listas abaixo (`PRODUTORES`, `ARTEFATOS`) são conferidas **nos dois sentidos**: o que a árvore tem e a lista
 * não tem reprova, e o que a lista tem e a árvore não tem também. (Os números de hoje o teste imprime.)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { EXCECAO } from "./a-unica-interface.ts";
import { literais } from "./rede-em-execucao.ts";
import { soOCodigo } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo do item que esta régua responde, na seção *O que não foi conferido*. */
export const O_ITEM = "- **Prova no navegador com console limpo.**";
/** O ponteiro que o item passa a carregar. */
export const O_PONTEIRO = "external-engines/esteira/src/a-prova-de-navegador.ts";
/** A palavra que envelheceu: com duas provas, *"única"* é falso. */
export const A_PALAVRA_PROIBIDA = /(^|[^\p{L}])única prova/iu;

/** Os condutores de navegador, pelo nome do pacote (inteiro, ou seguido de `/`). */
export const CONDUTORES: readonly string[] = [
  "playwright",
  "playwright-core",
  "@playwright/test",
  "puppeteer",
  "puppeteer-core",
  "selenium-webdriver",
  "webdriverio",
];

export interface Produtor {
  caminho: string;
  prompt: string;
  /** Se ela REPROVA por erro de console ou `pageerror` — conferido contra o código por `consoleReprova`. */
  consoleReprova: boolean;
}

/** Quem produz prova de navegador, por prompt. Conferido nos dois sentidos contra a árvore. */
export const PRODUTORES: readonly Produtor[] = [
  {
    caminho: "external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts",
    prompt: "LAB-31",
    consoleReprova: false,
  },
];

/** Onde a prova mora. O do LAB-01 foi feito à mão (10/09/2026), sem produtor no `git`. */
export const ARTEFATOS: readonly { caminho: string; prompt: string; produtor: string | null }[] = [
  { caminho: "outputs/lab01/navegador.png", prompt: "LAB-01", produtor: null },
  {
    caminho: "docs/provas/LAB-31/navegador.json",
    prompt: "LAB-31",
    produtor: "external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts",
  },
];

const JS = /\.(ts|mts|cts|js|mjs|cjs)$/i;
const ehCondutor = (m: string) => CONDUTORES.some((x) => m === x || m.startsWith(`${x}/`));

/** Os condutores que UM arquivo importa (string inteira em posição de importação, sem comentário). */
export function condutoresImportados(texto: string): string[] {
  const fora: string[] = [];
  for (const l of literais(texto))
    if (/(\bfrom|\brequire\s*\(|\bimport\s*\(|^\s*import)\s*$/.test(l.antes) && ehCondutor(l.conteudo)) fora.push(l.conteudo);
  return fora;
}

/**
 * Se o produtor REPROVA por erro na página: a variável que o `pageerror` preenche aparece num `if (` — lido no código
 * sem comentário e sem string. Hoje ela só aparece dentro do `catch`, num ternário que escolhe a mensagem: não reprova.
 */
export function consoleReprova(texto: string): boolean {
  // A string `"pageerror"` sai em branco no `soOCodigo`; por isso o evento se procura no texto cru, e o uso, no código.
  const variavel = /\.on\(\s*["'`]pageerror["'`]\s*,\s*\(?\s*\w*\s*\)?\s*=>\s*\{?\s*(\w+)\s*=/.exec(texto)?.[1];
  if (!variavel) return false;
  return new RegExp(`\\bif\\s*\\(\\s*!?\\s*${variavel}\\b`).test(soOCodigo(texto));
}

/** O item da página: do começo até o próximo item da lista ou a linha em branco. */
export function oItem(pagina: string): string | null {
  const linhas = pagina.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(O_ITEM));
  if (i < 0) return null;
  const fora = [linhas[i]!];
  for (let j = i + 1; j < linhas.length; j++) {
    const l = linhas[j]!;
    if (l.trim() === "" || l.startsWith("- ")) break;
    fora.push(l);
  }
  return fora.join("\n").replace(/\s+/g, " ");
}

export type TipoDeProblema =
  | "produtor-fora-da-lista"
  | "produtor-que-sumiu"
  | "artefato-fora-da-lista"
  | "artefato-que-sumiu"
  | "console-declarado-errado"
  | "item-ausente"
  | "item-nao-nomeia"
  | "item-diz-unica"
  | "item-cala-o-console"
  | "tela-sem-bancada"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

export interface Resultado {
  /** Quantos caminhos o `git` carrega, e quantos JS/TS foram lidos — publicados, porque `every` sobre vazio é verdade. */
  caminhos: number;
  lidosJs: number;
  produtoresNaArvore: string[];
  artefatosNaArvore: string[];
  problemas: Problema[];
}

const naoEhDependencia = (c: string) => !/(^|\/)node_modules\//.test(c);
const ehArtefato = (c: string) => /^(outputs|docs\/provas)\//.test(c) && /navegador/i.test(c.split("/").pop() ?? "");

/** A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null`. */
export function conferirAProva(arquivos: readonly string[], ler: (caminho: string) => string | null): Resultado {
  const caminhos = [...arquivos].filter(naoEhDependencia).sort();
  const problemas: Problema[] = [];
  let lidosJs = 0;
  const produtoresNaArvore: string[] = [];
  for (const c of caminhos) {
    if (!JS.test(c)) continue;
    const t = ler(c);
    if (t === null) continue;
    lidosJs++;
    if (condutoresImportados(t).length > 0) produtoresNaArvore.push(c);
  }
  const artefatosNaArvore = caminhos.filter(ehArtefato);

  if (caminhos.length === 0 || lidosJs === 0)
    problemas.push({ tipo: "universo-vazio", detalhe: `${caminhos.length} caminhos, ${lidosJs} JS/TS lidos — verde sobre zero não é verde` });

  const declarados = new Set(PRODUTORES.map((p) => p.caminho));
  for (const c of produtoresNaArvore)
    if (!declarados.has(c)) problemas.push({ tipo: "produtor-fora-da-lista", detalhe: `${c} importa um condutor de navegador e não está em PRODUTORES — a página não o nomeia` });
  for (const p of PRODUTORES) {
    if (!produtoresNaArvore.includes(p.caminho)) {
      problemas.push({ tipo: "produtor-que-sumiu", detalhe: `${p.caminho} está em PRODUTORES e não importa condutor nenhum na árvore` });
      continue;
    }
    const t = ler(p.caminho);
    if (t !== null && consoleReprova(t) !== p.consoleReprova)
      problemas.push({
        tipo: "console-declarado-errado",
        detalhe: `${p.caminho}: declarado consoleReprova=${p.consoleReprova}, o código diz ${!p.consoleReprova} — conserte a declaração e o item do ${A_PAGINA}`,
      });
  }
  const artDeclarados = new Set(ARTEFATOS.map((a) => a.caminho));
  for (const c of artefatosNaArvore)
    if (!artDeclarados.has(c)) problemas.push({ tipo: "artefato-fora-da-lista", detalhe: `${c} é prova de navegador e não está em ARTEFATOS` });
  for (const a of ARTEFATOS)
    if (!artefatosNaArvore.includes(a.caminho)) problemas.push({ tipo: "artefato-que-sumiu", detalhe: `${a.caminho} está em ARTEFATOS e o git não o carrega` });

  const pagina = ler(A_PAGINA);
  const item = pagina === null ? null : oItem(pagina);
  if (pagina === null || item === null) {
    problemas.push({ tipo: "item-ausente", detalhe: `o ${A_PAGINA} não tem o item "${O_ITEM}"` });
  } else {
    const bancada = EXCECAO.find((e) => e.porta === "pagina")!.caminho;
    const devemSerNomeados = [...PRODUTORES.map((p) => p.caminho), ...ARTEFATOS.map((a) => a.caminho), bancada, O_PONTEIRO];
    for (const n of devemSerNomeados)
      if (!item.includes(n)) problemas.push({ tipo: "item-nao-nomeia", detalhe: `o item da prova de navegador não nomeia ${n}` });
    if (A_PALAVRA_PROIBIDA.test(item))
      problemas.push({ tipo: "item-diz-unica", detalhe: `o item diz "única prova", e são ${ARTEFATOS.length}` });
    if (PRODUTORES.some((p) => !p.consoleReprova) && !/console[^.]*não reprova/i.test(item))
      problemas.push({ tipo: "item-cala-o-console", detalhe: `uma prova não reprova por console, e o item não diz "… console … não reprova"` });
    pagina.split("\n").forEach((l, i) => {
      if (/não (tem|há) tela/i.test(l) && !/bancada/i.test(l))
        problemas.push({ tipo: "tela-sem-bancada", detalhe: `${A_PAGINA}:${i + 1} diz que não há tela e não nomeia a bancada (CLAUDE.md §4, D381)` });
    });
  }
  return { caminhos: caminhos.length, lidosJs, produtoresNaArvore, artefatosNaArvore, problemas };
}

/** A árvore de verdade: o `git` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirAProva(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se a prova RODA: o `.wasm` não é versionado e o alvo do `rustup` não instala nesta máquina, então a prova do LAB-31 falha na precondição a cada verde — esta régua pergunta quem ela é e o que diz, não se ela passa",
  "o console de verdade: `consoleReprova` lê o CÓDIGO do produtor (a variável do `pageerror` testada num `if`), não roda a página; um `console.error` sem `pageerror` não é perguntado",
  "o navegador aberto sem condutor (um `chromium` chamado por `spawn`, um `npx http-server` à mão): é a trava da rede e a da interface que veem o processo e o servidor",
  "a prova de navegador gravada com outro nome ou fora de `outputs/` e `docs/provas/`",
  "a frase da tela escrita sem as palavras `não tem tela` / `não há tela` (\"sem interface\", \"zero páginas\"…)",
];
