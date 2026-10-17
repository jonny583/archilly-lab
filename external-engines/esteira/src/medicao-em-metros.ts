/**
 * A MEDIÇÃO É EM METROS — e duas ferramentas gravavam a gleba em hectare. (LAB-143, item 900, a dívida
 * própria, D371)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §7 diz:
 *
 * > *"**Medição é em metros e em dados:** JSON em `docs/provas/<prompt>/` com gleba, motor, semente e
 * > contrato, e determinismo provado"*.
 *
 * A metade de depois dos dois-pontos tem trava: os quatro conceitos (LAB-36 e LAB-141, `regras.test.ts`)
 * e o determinismo (LAB-103 e LAB-105). **A metade de antes — "em metros" — não tinha nenhuma**: `grep`
 * por *"em metros"* nas travas da esteira acha uma só, a das cinco glebas do contrato 1
 * (`motores.test.ts`), que fala da ENTRADA, não da prova.
 *
 * Medido por LUGAR (17/10/2026), as 84 provas JSON de `docs/provas/`, chave por chave, pelo sufixo de
 * unidade: `_m` 8 979 vezes, `_m2` 6 770, `_pct` 1 389, `_graus` 22, `_ms` 12 — e **`_ha` 5**:
 *
 * | prova | chave | ferramenta que a escreve |
 * |---|---|---|
 * | `LAB-07/medicoes.json` | `area_ha` (3×, arredondada a 2 casas) | `testfit/ferramentas/medir.ts` |
 * | `LAB-50/passagem-externa.json` | `areaDaGleba_ha` (2×, arredondada a 1 casa) | `esteira/ferramentas/lab50.ts` |
 *
 * Não é regra sem guarda só: é **regra descumprida**, e com perda — a área da gleba saía em hectare
 * **arredondado**, e o metro quadrado de onde ela veio não ia junto. Quem lê a prova do LAB-50 sabe que
 * Antonina tem *"141,8 ha"*, não quantos metros quadrados.
 *
 * Por LUGAR também o código (`src/`, `ferramentas/`, `tests/` dos três pacotes): quatro arquivos
 * escrevem chave em hectare — os dois acima e dois do Symbios (`symbios/adapter/ferramentas/medir.ts` e
 * `gerar-terrenos.ts`), que **não** gravam em `docs/provas/` (um em `outputs/lab01/`, outro em
 * `docs/terrenos/indice.json`).
 *
 * # O que este módulo faz
 *
 * Duas funções puras, uma por universo:
 *
 * - {@link chavesForaDoMetroNoJson} — percorre um JSON e devolve toda chave cuja unidade, pelo sufixo, é
 *   de comprimento ou área **fora do metro** (`_ha`, `_km`, `_km2`, `_cm`, `_cm2`, `_mm`, `_mm2`, `_dm`,
 *   e a forma por extenso `_hectares`, `_quilometros`, `_centimetros`, `_milimetros`), com o caminho;
 * - {@link chavesForaDoMetroNoCodigo} — a mesma pergunta no texto de um `.ts`, sem comentários, para a
 *   ferramenta que ainda vai gravar.
 *
 * Grandeza que **não é comprimento nem área** fica fora de propósito: `_pct`, `_graus`, `_ms` são outra
 * grandeza, e a regra fala de medida de terra.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **o valor**: uma chave `_m` com um número em hectare passaria — a régua lê o NOME da unidade, não o
 *   número (régua de valor exigiria saber a ordem de grandeza de cada medida);
 * - **chave sem sufixo**: `area: 47` não diz unidade nenhuma, e a régua não sabe o que é;
 * - **camelCase** (`areaHa`, `emKm`): medido, zero ocorrências em prova e em código hoje; a régua fala do
 *   sufixo com sublinhado, que é a convenção das 17 mil chaves medidas;
 * - **o que não é `docs/provas/`**: `outputs/lab01/medicoes.json` e `docs/terrenos/indice.json` são
 *   gravações do LAB-01, escritas pelas duas ferramentas do Symbios declaradas em exceção na trava.
 */

/** Os sufixos de comprimento e área fora do metro. Minúsculos; a comparação ignora caixa. */
export const SUFIXOS_FORA_DO_METRO: readonly string[] = [
  "ha",
  "hectares",
  "km",
  "km2",
  "quilometros",
  "cm",
  "cm2",
  "centimetros",
  "mm",
  "mm2",
  "milimetros",
  "dm",
] as const;

/** Uma chave fora do metro achada. */
export interface ChaveForaDoMetro {
  /** a chave como está escrita (`area_ha`) */
  chave: string;
  /** o sufixo de unidade, minúsculo (`ha`) */
  sufixo: string;
  /** onde ela está: no JSON, o caminho (`glebas.ensaio-47ha.area_ha`); no código, `linha N` */
  onde: string;
}

/** O sufixo de unidade de uma chave, se ele for de comprimento ou área fora do metro. */
export function sufixoForaDoMetro(chave: string): string | null {
  const m = /_([A-Za-z0-9]+)$/.exec(chave);
  if (!m) return null;
  const s = m[1]!.toLowerCase();
  return SUFIXOS_FORA_DO_METRO.includes(s) ? s : null;
}

/** Toda chave fora do metro num JSON já lido, com o caminho de cada uma. */
export function chavesForaDoMetroNoJson(valor: unknown, caminho = ""): ChaveForaDoMetro[] {
  const achadas: ChaveForaDoMetro[] = [];
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => achadas.push(...chavesForaDoMetroNoJson(v, `${caminho}[${i}]`)));
  } else if (valor !== null && typeof valor === "object") {
    for (const [chave, v] of Object.entries(valor)) {
      const aqui = caminho === "" ? chave : `${caminho}.${chave}`;
      const sufixo = sufixoForaDoMetro(chave);
      if (sufixo !== null) achadas.push({ chave, sufixo, onde: aqui });
      achadas.push(...chavesForaDoMetroNoJson(v, aqui));
    }
  }
  return achadas;
}

/**
 * Toda chave fora do metro no TEXTO de um `.ts`: um identificador com o sufixo seguido de `:` (chave de
 * objeto, com ou sem aspas, ou campo de tipo, com o `?` opcional). Comentários saem antes — a regra se escreve nos
 * comentários, e eles citam `area_ha` para dizer que não se usa.
 */
export function chavesForaDoMetroNoCodigo(texto: string): ChaveForaDoMetro[] {
  const semComentarios = texto
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (c, antes: string) => antes + " ".repeat(c.length - antes.length));
  const achadas: ChaveForaDoMetro[] = [];
  const linhas = semComentarios.split("\n");
  linhas.forEach((linha, i) => {
    for (const m of linha.matchAll(/\b([A-Za-z][A-Za-z0-9]*_[A-Za-z0-9]+)["']?\??\s*:/g)) {
      const sufixo = sufixoForaDoMetro(m[1]!);
      if (sufixo !== null) achadas.push({ chave: m[1]!, sufixo, onde: `linha ${i + 1}` });
    }
  });
  return achadas;
}
