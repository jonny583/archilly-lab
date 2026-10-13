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
