/**
 * OS CAMINHOS QUE O `CLAUDE.md` CITA, conferidos contra a ÁRVORE. (LAB-99, item 900)
 *
 * # O defeito, medido em 13/10/2026
 *
 * O enxugar do `CLAUDE.md` (LAB-95, commit `099d0b4`) encurtou os ponteiros: o que era
 * `external-engines/esteira/src/cobranca-por-uso.ts` virou `src/cobranca-por-uso.ts`. **Não existe
 * `src/` na raiz deste repositório.** Oito caminhos da página — seis `src/…`, um `tests/…` e a
 * bancada `symbios/…` — não resolviam de onde se lê a página, e nenhuma trava olhava: a do enxugar
 * confere que a REGRA ficou e que a HISTÓRIA resolve, não que o ARQUIVO citado existe.
 *
 * > **Ponteiro encurtado é ponteiro para outro lugar.** Quem abre a página no GitHub (o chat, a
 * > sessão nova) segue o caminho da raiz, e ali não há nada.
 *
 * # A régua
 *
 * Lê os trechos entre crases **fora** dos blocos cercados e separa três espécies:
 *
 * 1. **caminho** — tem barra. Resolve **da raiz do repositório**, arquivo ou pasta. Sem
 *    exceção por proximidade: `src/x.ts` que só existe dentro de um pacote é caminho errado.
 * 2. **nome** — sem barra, com extensão de arquivo (`verde.yml`, `tsconfig.json`). É nome, não
 *    caminho: passa se existir **algum** arquivo com esse nome na árvore.
 * 3. **anatomia do motor** — `upstream/`, `archilly/` e `adapter/` (§3, a regra de ouro) não são
 *    pastas da raiz: são as três pastas DENTRO de cada motor. Exceção DECLARADA, conferida nos
 *    dois sentidos: cada uma tem de ser citada na página **e** existir em ao menos um motor de
 *    `external-engines/`.
 *
 * **O que ela NÃO alcança, dito:** trecho com `<`, `*` ou espaço (é molde, padrão ou comando, não
 * caminho); extensão sozinha (`.md`, `.wasm`); o que está dentro de bloco cercado; e qualquer
 * página que não seja o `CLAUDE.md`. Nem diz que o arquivo citado é o CERTO — só que existe.
 */

/** Extensões que fazem de um trecho sem barra um NOME de arquivo. */
const EXTENSAO = /\.(?:ts|md|sh|ya?ml|json|html|mjs|js|toml)$/;

/** Só letras, dígitos, `_`, `.`, `-` e `/`: o resto é molde, padrão ou comando. */
const SO_CAMINHO = /^[\w.\-/]+$/;

/** As três pastas que vivem dentro de cada motor, e não na raiz (§3 do `CLAUDE.md`). */
export const ANATOMIA_DO_MOTOR = ["upstream/", "archilly/", "adapter/"] as const;

export type Especie = "caminho" | "nome" | "anatomia";

export interface Citado {
  trecho: string;
  especie: Especie;
}

/** Tira os blocos cercados por três crases — o que está dentro deles não é lido. */
function semBlocosCercados(md: string): string {
  return md.replace(/```[\s\S]*?```/g, "");
}

/**
 * Os trechos entre crases que **afirmam um arquivo ou pasta**, sem repetição e na ordem em que
 * aparecem. Trecho que é só extensão (`.md`) fica fora.
 */
export function citados(md: string): Citado[] {
  const vistos = new Set<string>();
  const r: Citado[] = [];
  for (const m of semBlocosCercados(md).matchAll(/`([^`\n]+)`/g)) {
    const t = m[1]!;
    if (!SO_CAMINHO.test(t) || vistos.has(t)) continue;
    const temBarra = t.includes("/");
    if (!temBarra && (!EXTENSAO.test(t) || t.startsWith("."))) continue;
    vistos.add(t);
    const especie: Especie = (ANATOMIA_DO_MOTOR as readonly string[]).includes(t)
      ? "anatomia"
      : temBarra
        ? "caminho"
        : "nome";
    r.push({ trecho: t, especie });
  }
  return r;
}

/** O que a árvore responde — injetado, para a régua ser testada sem disco. */
export interface Arvore {
  /** Existe este caminho, a partir da raiz? (arquivo ou pasta) */
  existe(caminhoDaRaiz: string): boolean;
  /** Existe algum arquivo com este nome, em qualquer pasta? */
  temONome(nome: string): boolean;
  /** Existe esta pasta dentro de algum motor de `external-engines/`? */
  algumMotorTem(pasta: string): boolean;
}

/**
 * Os problemas, um por linha legível. Lista vazia = todos resolvem. **E o tamanho do universo
 * lido vai junto**, porque régua que não leu nada também devolve lista vazia (§2.7 da direção).
 */
export function conferirOsCaminhos(
  md: string,
  arvore: Arvore,
): { lidos: number; problemas: string[] } {
  const lista = citados(md);
  const problemas: string[] = [];
  for (const { trecho, especie } of lista) {
    if (especie === "caminho") {
      const limpo = trecho.replace(/^\.\//, "");
      if (!arvore.existe(limpo)) problemas.push(`caminho que não resolve da raiz: ${trecho}`);
    } else if (especie === "nome") {
      if (!arvore.temONome(trecho)) problemas.push(`nome que nenhum arquivo tem: ${trecho}`);
    } else if (!arvore.algumMotorTem(trecho)) {
      problemas.push(`anatomia declarada que nenhum motor tem: ${trecho}`);
    }
  }
  // O outro sentido da exceção: declarada e não citada é exceção órfã.
  for (const a of ANATOMIA_DO_MOTOR) {
    if (!lista.some((c) => c.trecho === a)) problemas.push(`anatomia declarada que a página não cita: ${a}`);
  }
  return { lidos: lista.length, problemas };
}

/*
 * # A segunda pergunta: as LIGAÇÕES das páginas vivas (LAB-100, item 900, D327)
 *
 * O LAB-99 deixou proposta *"a mesma pergunta nas outras páginas vivas"*. Medido em 13/10/2026,
 * antes de estender qualquer coisa, a resposta é que **nas páginas de `docs/` o ponteiro vivo não
 * é o trecho entre crases: é a LIGAÇÃO** `[texto](alvo)`.
 *
 * - No `INDEX.md`, dos 143 caminhos entre crases, **128 só resolvem a partir da própria pasta**
 *   (`relatorios/LAB-07.md`), 3 da raiz, e os 12 que não resolvem de lugar nenhum estão TODOS na
 *   coluna da descrição — relato datado (`src/x.ts` é o exemplo do defeito do LAB-99), outro
 *   repositório (`jonny583/archilly-central`) ou ação do GitHub (`actions/checkout`). A régua da
 *   raiz, estendida a ele, reprovaria a convenção da página e o relato que não se reescreve.
 * - As 309 ligações das cinco páginas (`CLAUDE.md` 5, `INDEX.md` 144, `ONDE_PARAMOS.md` 49,
 *   `FILA.md` 100, `DECISOES.md` 11) resolvem **todas** — e resolveram em cada uma das 127
 *   versões dessas páginas na `main`. Nada as conferia.
 *
 * **A régua das ligações:** o alvo resolve **a partir da pasta da página**, que é como o GitHub o
 * segue. Âncora (`#…`) e título saem; `%20` se decodifica; endereço com esquema (`https:`,
 * `mailto:`) fica fora; alvo que sobe acima da raiz é reprovado. O que está em bloco cercado ou
 * dentro de crases não é ligação.
 *
 * **O que ela NÃO alcança, dito:** se a âncora existe no destino; ligação por referência
 * (`[x][1]`); e os trechos entre crases das páginas de `docs/` — esses ficam como estão, relato.
 */

/** Os alvos das ligações `[texto](alvo)`, sem âncora, sem repetição e na ordem em que aparecem. */
export function ligacoes(md: string): string[] {
  const limpo = semBlocosCercados(md).replace(/`[^`\n]*`/g, "x");
  const vistos = new Set<string>();
  for (const m of limpo.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) {
    const alvo = m[1]!.replace(/#.*$/, "");
    if (alvo === "" || /^[a-z][a-z0-9+.-]*:/i.test(alvo)) continue;
    vistos.add(alvo);
  }
  return [...vistos];
}

/** Junta a pasta da página com o alvo, à moda POSIX; `null` se o alvo sobe acima da raiz. */
export function resolverDaPagina(pagina: string, alvo: string): string | null {
  let decodificado: string;
  try {
    decodificado = decodeURIComponent(alvo);
  } catch {
    decodificado = alvo;
  }
  const partes = pagina.split("/").slice(0, -1);
  for (const p of decodificado.split("/")) {
    if (p === "" || p === ".") continue;
    if (p === "..") {
      if (partes.length === 0) return null;
      partes.pop();
    } else partes.push(p);
  }
  return partes.join("/");
}

/**
 * Os problemas das ligações de uma página, com o tamanho do universo lido (§2.7 da direção).
 * `existe` responde a partir da raiz — arquivo ou pasta; a raiz mesma é `""`.
 */
export function conferirAsLigacoes(
  pagina: string,
  md: string,
  existe: (caminhoDaRaiz: string) => boolean,
): { lidas: number; problemas: string[] } {
  const lista = ligacoes(md);
  const problemas: string[] = [];
  for (const alvo of lista) {
    const c = resolverDaPagina(pagina, alvo);
    if (c === null) problemas.push(`${pagina}: ligação que sobe acima da raiz: ${alvo}`);
    else if (!existe(c)) problemas.push(`${pagina}: ligação que não leva a nada: ${alvo}`);
  }
  return { lidas: lista.length, problemas };
}

/**
 * As páginas vivas cujas ligações são conferidas: as quatro que o `CLAUDE.md` §7 manda manter
 * *"em dia"* a cada prompt, e o próprio `CLAUDE.md`. A trava confere a lista contra a frase.
 */
export const PAGINAS_VIVAS = [
  "CLAUDE.md",
  "docs/INDEX.md",
  "docs/ONDE_PARAMOS.md",
  "docs/prompts/FILA.md",
  "docs/DECISOES.md",
] as const;
