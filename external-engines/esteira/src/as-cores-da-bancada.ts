/**
 * ════════════════════════════════════════════════════════════════════════════
 *  NADA REPINTADO FORA DO CATÁLOGO DE DESIGN — "não há design", e há cor escrita à mão em três lugares. (LAB-181,
 *  item 900, D409)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, seção *O que **não** foi conferido, e por quê*, do LF-FINAL (14/09/2026), dizia:
 *
 * > **Nada repintado fora do catálogo de design.** Não há design: a única página é a bancada, que é ferramenta e não
 * > tela de usuário.
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. A regra do Padrão (o `CLAUDE.md` da Central, regra 7:
 * *"Nenhum valor visual em tela: tudo vem de `temas/temas.json` pelas variáveis `--ar-*`"*) existe para que a cor de
 * uma tela tenha um dono só. A frase da página respondia pela AUSÊNCIA de design — e ninguém perguntava se havia cor.
 *
 * # O que se mediu, por LUGAR (18/10/2026)
 *
 * Cor entra numa árvore por dois caminhos: o arquivo de PÁGINA (`.html`, `.css`, `.svg` e os componentes de tela), onde
 * ela é escrita como valor; e o CÓDIGO que pinta (o `fillStyle` do canvas, o `fill=` de um SVG gerado), onde ela é uma
 * string. Enumerei os dois no que o `git` carrega, fora de `node_modules/`; o `upstream/` entra na pergunta da página
 * (o que ele produziu e está na árvore é nosso artefato) e sai da do código (é cópia byte a byte, LAB-132 — o que ele
 * pinta não é decisão desta casa).
 *
 * | lugar | o que é | cores |
 * |---|---|---|
 * | `bancada-html` | o `<style>` da bancada (`index.html`): o fundo do `<pre>` e a borda do `<canvas>` | 2 |
 * | `bancada-js` | o canvas da bancada (`prova.js`): o fundo, as curvas, e as duas cores das vias | 4 |
 * | `svg-do-upstream` | `outputs/symbios_full_city_lots.svg`, saída do exemplo `full_city.rs` do upstream, gravada no LAB-00 | 3 |
 *
 * **A frase era falsa na letra e verdadeira no que importa:** há design — nove cores escritas à mão, nenhuma do
 * catálogo da família —, mas todas numa página de FERRAMENTA (a exceção declarada do `CLAUDE.md` §4, `a-unica-
 * interface.ts`) ou num artefato de medição que o upstream pintou. Tela de usuário, nenhuma; e por isso a regra não se
 * aplica. O que faltava era a pergunta: uma cor nova na bancada, ou uma página nova pintada, passariam a esteira inteira.
 *
 * # A régua — paleta congelada, como a do Laboratório de Parcelamento (`scripts/fronteira-congelada.json`)
 *
 * 1. **Os lugares com cor**, nos dois sentidos: arquivo com cor fora de {@link LUGARES} reprova (`cor-fora-da-lista`);
 *    lugar declarado que o `git` não carrega mais, ou sem cor nenhuma, reprova (`lugar-que-sumiu`).
 * 2. **As cores de cada lugar**, nos dois sentidos: cor nova num lugar declarado (`cor-nova`) e cor declarada que sumiu
 *    (`cor-que-sumiu`). Mudar de propósito é mudar a lista e a página no mesmo commit — o ato deliberado.
 * 3. **O item da página** nomeia esta trava e o LAB-181 (`item-nao-nomeia`), escreve *"**N** cores escritas à mão"* com N
 *    o total medido (`item-numero-errado`), e não volta a dizer *"não há design"* (`item-sem-design`, o caso da página
 *    de antes).
 * 4. **A tabela** da seção *Reconferido no LAB-181* tem os lugares, nem mais nem menos, com as cores que a árvore dá
 *    (`tabela-*`).
 * 5. **Universo vazio** — pergunta sem arquivo lido → `universo-vazio` (D213). Os dois universos saem na medição.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo do item da lista que esta régua responde. */
export const O_ITEM = "- **Nada repintado fora do catálogo de design.**";
export const O_PONTEIRO = "external-engines/esteira/src/as-cores-da-bancada.ts";
export const ESTA_RODADA = 181;
/** O título da seção da página que leva a tabela dos lugares. */
export const A_SECAO = "## Reconferido no LAB-181";
/** A frase da página de antes, que esta trava não deixa voltar. */
export const A_FRASE_DE_ANTES = /não há design/i;

const BANCADA = "external-engines/symbios/adapter/ferramentas/navegador/";

// As cores vão em pedaços: escritas inteiras, a própria régua as acharia neste arquivo.
const h = (s: string) => `#${s}`;

/** Os lugares que têm cor escrita à mão, e as cores de cada um — conferidos nos dois sentidos. */
export const LUGARES: readonly { id: string; caminho: string; cores: readonly string[]; motivo: string }[] = [
  {
    id: "bancada-html",
    caminho: `${BANCADA}index.html`,
    cores: [h("d4d4d8"), h("f4f4f5")],
    motivo: "o `<style>` da bancada: o fundo do `<pre>` do registro e a borda do `<canvas>` (LAB-01)",
  },
  {
    id: "bancada-js",
    caminho: `${BANCADA}prova.js`,
    cores: [h("1d4ed8"), h("a1a1aa"), h("dc2626"), h("fafafa")],
    motivo: "o canvas da bancada: o fundo, as curvas de nível e as duas cores das vias (LAB-01)",
  },
  {
    id: "svg-do-upstream",
    caminho: "outputs/symbios_full_city_lots.svg",
    cores: [h("1c1f26"), h("222"), h("7a8ab5")],
    motivo: "saída do exemplo `full_city.rs` do upstream, gravada no LAB-00 como medição — quem pintou foi o upstream",
  },
];

/** Arquivo de PÁGINA: a cor nele é valor escrito. */
const PAGINA = /\.(html?|xhtml|css|scss|sass|less|svg|tsx|jsx|vue|svelte|astro)$/i;
/** Arquivo de CÓDIGO que pinta: a cor nele é string. */
const CODIGO = /\.(ts|mts|cts|js|mjs|cjs|rs|py)$/i;

/** Cor escrita como valor: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, e as funções `rgb()`, `rgba()`, `hsl()`, `hsla()`. */
const COR_NA_PAGINA = /(?<![\w&#])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|\b(?:rgba?|hsla?)\s*\((?=[^)]*\d)[^)]*\)/g;
/** No código, a cor é uma string inteira: `"#…"` ou `"rgb(…)"`. */
const COR_NO_CODIGO = /(["'`])(#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})|(?:rgba?|hsla?)\s*\((?=[^)]*\d)[^)"'`]*\))\1/g;

const normalizar = (c: string) => c.toLowerCase().replace(/\s+/g, "");

export interface Medicao {
  /** Por caminho, as cores distintas achadas, em ordem. */
  cores: Record<string, string[]>;
  lidos: { pagina: number; codigo: number };
}

export type Leitor = (caminho: string) => string | null;

/** As duas perguntas, sobre a lista do que o `git` carrega e um leitor. */
export function medirOsArquivos(arquivos: readonly string[], ler: Leitor): Medicao {
  const cores: Record<string, string[]> = {};
  const lidos = { pagina: 0, codigo: 0 };
  for (const c of arquivos) {
    if (/(^|\/)(node_modules|target)\//.test(c)) continue;
    const ehPagina = PAGINA.test(c);
    const ehCodigo = !ehPagina && CODIGO.test(c) && !/(^|\/)upstream\//.test(c);
    if (!ehPagina && !ehCodigo) continue;
    const texto = ler(c);
    if (texto === null) continue;
    const achadas = new Set<string>();
    if (ehPagina) {
      lidos.pagina++;
      // Comentário de HTML e de CSS fora: a cor que se COMENTA não pinta.
      const t = texto.replace(/<!--[\s\S]*?-->/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
      for (const m of t.matchAll(COR_NA_PAGINA)) achadas.add(normalizar(m[0]));
    } else {
      lidos.codigo++;
      // Comentário fora, string dentro: a cor do código é a string. (O `.py` vai inteiro: o `#` dele é comentário e
      // cor ao mesmo tempo, e a cor só conta entre aspas.)
      const t = c.endsWith(".py") ? texto : texto.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
      for (const m of t.matchAll(COR_NO_CODIGO)) achadas.add(normalizar(m[2]!));
    }
    if (achadas.size > 0) cores[c] = [...achadas].sort();
  }
  return { cores, lidos };
}

export function medir(raiz: string): Medicao {
  return medirOsArquivos(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O total de cores (distintas por lugar) — o número que o item escreve. */
export const totalDeCores = (m: Medicao): number => Object.values(m.cores).reduce((s, l) => s + l.length, 0);

/** O item da página: do começo até o próximo item da lista ou a linha em branco, numa linha só. */
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

/** A tabela da seção: `| \`<lugar>\` | … | N |` → cores. */
export function aTabela(pagina: string): Map<string, number> | null {
  const linhas = pagina.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(A_SECAO));
  if (i < 0) return null;
  const t = new Map<string, number>();
  for (let j = i + 1; j < linhas.length && !/^##\s/.test(linhas[j]!); j++) {
    const m = /^\|\s*`([a-z-]+)`\s*\|.*\|\s*\**(\d+)\**\s*\|\s*$/.exec(linhas[j]!);
    if (m) t.set(m[1]!, Number(m[2]));
  }
  return t;
}

export type TipoDeProblema =
  | "cor-fora-da-lista"
  | "lugar-que-sumiu"
  | "cor-nova"
  | "cor-que-sumiu"
  | "item-ausente"
  | "item-sem-design"
  | "item-nao-nomeia"
  | "item-numero-errado"
  | "tabela-ausente"
  | "tabela-sem-lugar"
  | "tabela-com-outro"
  | "tabela-numero-errado"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A conferência da árvore e da página contra a medição. */
export function conferir(pagina: string | null, m: Medicao): Problema[] {
  const problemas: Problema[] = [];
  if (m.lidos.pagina === 0) problemas.push({ tipo: "universo-vazio", detalhe: "nenhum arquivo de página lido — verde sobre zero não é verde" });
  if (m.lidos.codigo === 0) problemas.push({ tipo: "universo-vazio", detalhe: "nenhum arquivo de código lido — verde sobre zero não é verde" });

  const declarados = new Map(LUGARES.map((l) => [l.caminho, l]));
  for (const [caminho, cores] of Object.entries(m.cores)) {
    const d = declarados.get(caminho);
    if (!d) {
      problemas.push({ tipo: "cor-fora-da-lista", detalhe: `${caminho} tem cor escrita à mão (${cores.join(", ")}) e não está em LUGARES` });
      continue;
    }
    for (const c of cores) if (!d.cores.includes(c)) problemas.push({ tipo: "cor-nova", detalhe: `${caminho}: ${c} não está na paleta congelada de ${d.id}` });
  }
  for (const l of LUGARES) {
    const achadas = m.cores[l.caminho];
    if (!achadas) {
      problemas.push({ tipo: "lugar-que-sumiu", detalhe: `${l.id} (${l.caminho}) está em LUGARES e a árvore não tem cor nele` });
      continue;
    }
    for (const c of l.cores) if (!achadas.includes(c)) problemas.push({ tipo: "cor-que-sumiu", detalhe: `${l.id}: ${c} está declarada e sumiu de ${l.caminho}` });
  }

  const item = pagina === null ? null : oItem(pagina);
  if (item === null) {
    problemas.push({ tipo: "item-ausente", detalhe: `o ${A_PAGINA} não tem o item "${O_ITEM}"` });
  } else {
    if (A_FRASE_DE_ANTES.test(item)) problemas.push({ tipo: "item-sem-design", detalhe: `o item diz "não há design", e a árvore tem ${totalDeCores(m)} cores escritas à mão` });
    for (const n of [O_PONTEIRO, `LAB-${ESTA_RODADA}`])
      if (!new RegExp(`${escapar(n)}(?![0-9])`).test(item)) problemas.push({ tipo: "item-nao-nomeia", detalhe: `o item não nomeia ${n}` });
    const n = totalDeCores(m);
    const escrito = /\*\*(\d+)\*\* cores escritas à mão/.exec(item);
    if (!escrito || Number(escrito[1]) !== n)
      problemas.push({ tipo: "item-numero-errado", detalhe: `o item tem de escrever "**${n}** cores escritas à mão"; escreve ${escrito ? `"**${escrito[1]}**"` : "outra coisa"}` });
  }

  const tabela = pagina === null ? null : aTabela(pagina);
  if (tabela === null) {
    problemas.push({ tipo: "tabela-ausente", detalhe: `o ${A_PAGINA} não tem a seção "${A_SECAO}"` });
  } else {
    for (const l of LUGARES) {
      const escrito = tabela.get(l.id);
      const medido = m.cores[l.caminho]?.length ?? 0;
      if (escrito === undefined) problemas.push({ tipo: "tabela-sem-lugar", detalhe: `a tabela não tem a linha de \`${l.id}\`` });
      else if (escrito !== medido) problemas.push({ tipo: "tabela-numero-errado", detalhe: `\`${l.id}\`: a tabela escreve ${escrito}, a árvore dá ${medido}` });
    }
    for (const id of tabela.keys())
      if (!LUGARES.some((l) => l.id === id)) problemas.push({ tipo: "tabela-com-outro", detalhe: `a tabela tem a linha de \`${id}\`, que não está em LUGARES` });
  }
  return problemas;
}

/** A árvore de verdade. */
export function conferirAArvore(raiz: string): { medicao: Medicao; problemas: Problema[] } {
  const medicao = medir(raiz);
  let pagina: string | null;
  try {
    pagina = readFileSync(join(raiz, A_PAGINA), "utf8");
  } catch {
    pagina = null;
  }
  return { medicao, problemas: conferir(pagina, medicao) };
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "cor por NOME (`red`, `steelblue`) e por variável de CSS sem valor literal: a régua lê `#…`, `rgb()`, `rgba()`, `hsl()` e `hsla()`",
  "o resto do valor visual — fonte, tamanho, margem, raio, sombra: a bancada tem `14px`, `2rem`, `60rem` e a fonte do sistema, e nenhuma é perguntada; a regra do Padrão é sobre tela de usuário, que esta casa não tem",
  "cor montada em pedaços no código (`\"#\" + x`) ou vinda de número (`0xff0000`): no código só se lê a string inteira",
  "o que o `upstream/` pinta no código: é cópia byte a byte (LAB-132), e o que ele pinta não é decisão desta casa — o que ele produziu e está na árvore (o `.svg`) é perguntado",
  "a imagem: o `outputs/lab01/navegador.png` é captura, e cor de pixel não é cor escrita",
  "os clones vizinhos: a paleta do Generate, do Geo e do Laboratório de Parcelamento é deles",
];
