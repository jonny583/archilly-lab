/**
 * ════════════════════════════════════════════════════════════════════════════
 *  MOBILE SEM ROLAGEM LATERAL — "a bancada não é aberta no celular", e ninguém a tinha aberto. (LAB-182, item 900,
 *  D410)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, seção *O que **não** foi conferido, e por quê*, do LF-FINAL (14/09/2026), dizia:
 *
 * > **Mobile sem rolagem lateral.** Idem: a bancada não é aberta no celular.
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. "Não é aberta" é hábito de quem usa, não propriedade da
 * página: respondia a regra da família (*nada estoura lateralmente no celular*) pelo COSTUME, e ninguém a media.
 *
 * # O que se mediu (18/10/2026), e onde
 *
 * A medição é de navegador e mora num produtor próprio, `rolagem-no-celular.ts`, ao lado da bancada — o primeiro que
 * roda nesta máquina, porque não precisa do `.wasm`: a página monta o mesmo esqueleto com ou sem ele (o `.wasm` só
 * muda o que vai DENTRO do `<pre>` e do `<canvas>`). Três larguras (390, 360, 320 px), com e sem a emulação de
 * celular do Chromium, em dois estados: como a página monta aqui, e com o registro de 10/09/2026 (do `README.md`) no
 * `<pre>`. O resultado vai a `docs/provas/LAB-182/navegador-celular.json`, e o `conferir.sh` o refaz a cada verde.
 *
 * **A frase era verdadeira no resultado e falsa no motivo:** a página não rola de lado — sobra **0** px nos doze
 * casos. Mas não é porque ninguém a abre no celular; é por três coisas da própria página, e uma quarta que muda a
 * resposta:
 *
 * - o `<canvas>` de 700 px tem `max-width: 100%` e encolhe com a janela;
 * - o `<pre>` do registro tem `overflow-x: auto`: a linha larga rola DENTRO da caixa (698 px de texto em 326 px de
 *   caixa, a 390), não na página;
 * - o `body` tem `max-width: 60rem` e margem — nada de largura fixa maior que a janela;
 * - **e não há `<meta name="viewport">`**: o celular de verdade desenha a página em 980 px e a encolhe para caber —
 *   não rola, mas a letra fica com cerca de 40 % do tamanho. Sem a emulação (a janela estreita do computador), a página
 *   é desenhada na largura da janela.
 *
 * # A régua — o JSON da medição contra a página e contra a árvore
 *
 * 1. **A prova é desta página:** o JSON leva o SHA-256 do `index.html` e do `prova.js`; mudou um, sem refazer a
 *    medição, reprova (`prova-velha`). O `<meta name="viewport">` que a medição viu tem de ser o que a página tem hoje
 *    (`viewport-divergente`).
 * 2. **A tela da família está lá** (390×844, emulada — a do Laboratório de Parcelamento), e todo caso tem os dois
 *    estados (`sem-a-tela-da-familia`, `caso-incompleto`); a maior sobra escrita no JSON é a dos casos
 *    (`json-incoerente`) e é zero (`rola-de-lado`).
 * 3. **O verde a refaz:** o `conferir.sh` roda o produtor (`fora-do-verde`).
 * 4. **O item da página** nomeia o produtor, o JSON, esta trava e o LAB-182 (`item-nao-nomeia`), escreve *"sobra **N**
 *    px"* com N a maior sobra (`item-numero-errado`), diz que falta o `<meta name="viewport">` quando falta
 *    (`item-cala-o-viewport`) e não volta a dizer *"não é aberta no celular"* (`item-de-antes`).
 * 5. **A tabela** da seção *Reconferido no LAB-182* tem os casos do JSON, nem mais nem menos, com a largura em que a
 *    página é desenhada e a maior sobra de cada um (`tabela-*`).
 * 6. **Universo vazio** — JSON sem caso → `universo-vazio` (D213).
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo do item da lista que esta régua responde. */
export const O_ITEM = "- **Mobile sem rolagem lateral.**";
export const O_PONTEIRO = "external-engines/esteira/src/a-rolagem-no-celular.ts";
export const ESTA_RODADA = 182;
export const A_SECAO = "## Reconferido no LAB-182";
/** A frase da página de antes, que esta trava não deixa voltar. */
export const A_FRASE_DE_ANTES = /não é aberta no celular/i;

export const A_BANCADA = "external-engines/symbios/adapter/ferramentas/navegador/";
export const O_PRODUTOR = `${A_BANCADA}rolagem-no-celular.ts`;
export const A_PROVA = "docs/provas/LAB-182/navegador-celular.json";
export const O_VERDE = "external-engines/conferir.sh";
/** Os arquivos que desenham a página — a impressão deles vai no JSON. */
export const DA_PAGINA = ["index.html", "prova.js"] as const;
/** A tela da família: a do Laboratório de Parcelamento (`scripts/provas.ts`, `390×844, isMobile`). */
export const A_TELA_DA_FAMILIA = "390×844";

export interface Medida {
  largura: number;
  conteudo: number;
  sobra: number;
  registro: { conteudo: number; caixa: number };
  canvas: number;
}
export interface Caso {
  tela: string;
  emulaCelular: boolean;
  comoMonta: Medida;
  comORegistroDe1009: Medida;
  errosDaPagina: string[];
}
export interface Prova {
  prompt: string;
  impressaoDaPagina: Record<string, string>;
  metaViewport: boolean | null;
  casos: Caso[];
  maiorSobra: number;
}

export interface Casa {
  /** O texto do `docs/SEGURANCA.md`, ou `null`. */
  pagina: string | null;
  /** O JSON da medição, ou `null` se não existe ou não se lê. */
  prova: Prova | null;
  /** O SHA-256 de cada arquivo da página, como estão hoje. */
  impressao: Record<string, string | null>;
  /** O `index.html` de hoje, para perguntar o `<meta name="viewport">`. */
  html: string | null;
  /** O `conferir.sh`. */
  verde: string | null;
}

export type TipoDeProblema =
  | "prova-ausente"
  | "prova-velha"
  | "viewport-divergente"
  | "sem-a-tela-da-familia"
  | "caso-incompleto"
  | "json-incoerente"
  | "rola-de-lado"
  | "fora-do-verde"
  | "item-ausente"
  | "item-de-antes"
  | "item-nao-nomeia"
  | "item-numero-errado"
  | "item-cala-o-viewport"
  | "tabela-ausente"
  | "tabela-sem-caso"
  | "tabela-com-outro"
  | "tabela-numero-errado"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

const ehNumero = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);
const medidaInteira = (m: unknown): m is Medida => {
  const x = m as Medida | null;
  return !!x && ehNumero(x.largura) && ehNumero(x.conteudo) && ehNumero(x.sobra) && ehNumero(x.registro?.conteudo) && ehNumero(x.registro?.caixa);
};
/** A maior sobra de um caso, nos dois estados. */
export const sobraDoCaso = (c: Caso): number => Math.max(c.comoMonta.sobra, c.comORegistroDe1009.sobra);
/** O `<meta name="viewport">`, no HTML sem comentário. */
export const temMetaViewport = (html: string): boolean =>
  /<meta\b[^>]*\bname\s*=\s*["']?viewport\b/i.test(html.replace(/<!--[\s\S]*?-->/g, " "));
const rotulo = (c: { tela: string; emulaCelular: boolean }) => `${c.tela} ${c.emulaCelular ? "celular" : "janela"}`;

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

/** A tabela da seção: `| \`390×844\` | celular | 980 | 0 |` → rótulo → { largura, sobra }. */
export function aTabela(pagina: string): Map<string, { largura: number; sobra: number }> | null {
  const linhas = pagina.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(A_SECAO));
  if (i < 0) return null;
  const t = new Map<string, { largura: number; sobra: number }>();
  for (let j = i + 1; j < linhas.length && !/^##\s/.test(linhas[j]!); j++) {
    const m = /^\|\s*`(\d+×\d+)`\s*\|\s*(celular|janela)\s*\|\s*\**(\d+)\**\s*\|\s*\**(\d+)\**\s*\|/.exec(linhas[j]!);
    if (m) t.set(`${m[1]} ${m[2]}`, { largura: Number(m[3]), sobra: Number(m[4]) });
  }
  return t;
}

/** A conferência da casa contra a medição. */
export function conferir(casa: Casa): Problema[] {
  const problemas: Problema[] = [];
  const p = casa.prova;
  if (p === null) {
    problemas.push({ tipo: "prova-ausente", detalhe: `${A_PROVA} não existe ou não se lê — rode ${O_PRODUTOR}` });
  } else {
    if (!Array.isArray(p.casos) || p.casos.length === 0)
      problemas.push({ tipo: "universo-vazio", detalhe: `${A_PROVA} não tem caso nenhum — verde sobre zero não é verde` });
    for (const a of DA_PAGINA) {
      const hoje = casa.impressao[a] ?? null;
      if (hoje === null || p.impressaoDaPagina?.[a] !== hoje)
        problemas.push({ tipo: "prova-velha", detalhe: `${A_BANCADA}${a} mudou depois da medição (ou sumiu) — rode ${O_PRODUTOR} de novo` });
    }
    if (casa.html !== null && p.metaViewport !== temMetaViewport(casa.html))
      problemas.push({
        tipo: "viewport-divergente",
        detalhe: `a medição viu metaViewport=${p.metaViewport}; o index.html de hoje tem ${temMetaViewport(casa.html)}`,
      });
    const casos = Array.isArray(p.casos) ? p.casos : [];
    const inteiros = casos.filter((c) => medidaInteira(c?.comoMonta) && medidaInteira(c?.comORegistroDe1009));
    for (const c of casos)
      if (!inteiros.includes(c)) problemas.push({ tipo: "caso-incompleto", detalhe: `o caso ${c?.tela ?? "?"} não tem os dois estados medidos` });
    if (!inteiros.some((c) => c.tela === A_TELA_DA_FAMILIA && c.emulaCelular))
      problemas.push({ tipo: "sem-a-tela-da-familia", detalhe: `a medição não tem ${A_TELA_DA_FAMILIA} com a emulação de celular` });
    if (inteiros.length > 0) {
      const maior = Math.max(...inteiros.map(sobraDoCaso));
      if (p.maiorSobra !== maior) problemas.push({ tipo: "json-incoerente", detalhe: `o JSON escreve maiorSobra ${p.maiorSobra}, os casos dão ${maior}` });
      for (const c of inteiros)
        if (sobraDoCaso(c) > 0) problemas.push({ tipo: "rola-de-lado", detalhe: `${rotulo(c)}: a página rola ${sobraDoCaso(c)} px de lado` });
    }
  }

  if (casa.verde === null || !casa.verde.split("\n").some((l) => !/^\s*#/.test(l) && l.includes("rolagem-no-celular.ts")))
    problemas.push({ tipo: "fora-do-verde", detalhe: `o ${O_VERDE} não roda ${O_PRODUTOR} — a medição não se refaz a cada verde` });

  const item = casa.pagina === null ? null : oItem(casa.pagina);
  if (item === null) {
    problemas.push({ tipo: "item-ausente", detalhe: `o ${A_PAGINA} não tem o item "${O_ITEM}"` });
  } else {
    if (A_FRASE_DE_ANTES.test(item)) problemas.push({ tipo: "item-de-antes", detalhe: `o item volta a dizer "não é aberta no celular" — hábito, não medição` });
    for (const n of [O_PRODUTOR, A_PROVA, O_PONTEIRO])
      if (!item.includes(n)) problemas.push({ tipo: "item-nao-nomeia", detalhe: `o item não nomeia ${n}` });
    // A rodada se procura FORA dos caminhos entre crases: o caminho do JSON (`docs/provas/LAB-182/…`) a nomearia sozinho.
    if (!new RegExp(`LAB-${ESTA_RODADA}(?![0-9])`).test(item.replace(/`[^`]*`/g, " ")))
      problemas.push({ tipo: "item-nao-nomeia", detalhe: `o item não nomeia LAB-${ESTA_RODADA} (fora dos caminhos)` });
    if (p !== null) {
      const escrito = /sobra \*\*(\d+)\*\* px/.exec(item);
      if (!escrito || Number(escrito[1]) !== p.maiorSobra)
        problemas.push({ tipo: "item-numero-errado", detalhe: `o item tem de escrever "sobra **${p.maiorSobra}** px"; escreve ${escrito ? `"**${escrito[1]}**"` : "outra coisa"}` });
      if (p.metaViewport === false && !item.includes('<meta name="viewport">'))
        problemas.push({ tipo: "item-cala-o-viewport", detalhe: `a página não tem <meta name="viewport">, e o item não diz` });
    }
  }

  const tabela = casa.pagina === null ? null : aTabela(casa.pagina);
  if (tabela === null) {
    problemas.push({ tipo: "tabela-ausente", detalhe: `o ${A_PAGINA} não tem a seção "${A_SECAO}"` });
  } else if (p !== null && Array.isArray(p.casos)) {
    const doJson = new Map(p.casos.filter((c) => medidaInteira(c?.comoMonta) && medidaInteira(c?.comORegistroDe1009)).map((c) => [rotulo(c), c]));
    for (const [r, c] of doJson) {
      const escrito = tabela.get(r);
      if (!escrito) problemas.push({ tipo: "tabela-sem-caso", detalhe: `a tabela não tem a linha de ${r}` });
      else if (escrito.largura !== c.comoMonta.largura || escrito.sobra !== sobraDoCaso(c))
        problemas.push({
          tipo: "tabela-numero-errado",
          detalhe: `${r}: a tabela escreve ${escrito.largura} px / sobra ${escrito.sobra}, a medição dá ${c.comoMonta.largura} / ${sobraDoCaso(c)}`,
        });
    }
    for (const r of tabela.keys()) if (!doJson.has(r)) problemas.push({ tipo: "tabela-com-outro", detalhe: `a tabela tem a linha de ${r}, que a medição não tem` });
  }
  return problemas;
}

const lerOuNulo = (caminho: string): string | null => {
  try {
    return readFileSync(caminho, "utf8");
  } catch {
    return null;
  }
};

/** A casa de verdade, lida do disco. */
export function aCasa(raiz: string): Casa {
  const texto = lerOuNulo(join(raiz, A_PROVA));
  let prova: Prova | null;
  try {
    prova = texto === null ? null : (JSON.parse(texto) as Prova);
  } catch {
    prova = null;
  }
  const impressao: Record<string, string | null> = {};
  for (const a of DA_PAGINA) {
    try {
      impressao[a] = createHash("sha256").update(readFileSync(join(raiz, A_BANCADA, a))).digest("hex");
    } catch {
      impressao[a] = null;
    }
  }
  return {
    pagina: lerOuNulo(join(raiz, A_PAGINA)),
    prova,
    impressao,
    html: lerOuNulo(join(raiz, A_BANCADA, "index.html")),
    verde: lerOuNulo(join(raiz, O_VERDE)),
  };
}

export function conferirAArvore(raiz: string): { casa: Casa; problemas: Problema[] } {
  const casa = aCasa(raiz);
  return { casa, problemas: conferir(casa) };
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se a medição é VERDADE: ela lê o JSON que o produtor escreveu; quem abre o Chromium é o `conferir.sh`, que roda o produtor, e o produtor reprova sozinho com sobra acima de zero",
  "a página com o `.wasm`: o registro inteiro que o `prova.js` escreveria e o desenho do canvas — a medição põe no `<pre>` o registro de 10/09 do `README.md`, e o canvas encolhe com ou sem desenho",
  "o tamanho da letra: sem `<meta name=\"viewport\">` o celular desenha a página em 980 px e a encolhe — não rola, mas fica pequena; isto se DIZ no item, não se reprova (a bancada é ferramenta, não tela de usuário)",
  "outros navegadores (Safari, Firefox) e larguras abaixo de 320 px",
  "uma página nova da bancada: a `a-unica-interface.ts` (LAB-153) a pergunta; esta régua mede só o `index.html`",
];
