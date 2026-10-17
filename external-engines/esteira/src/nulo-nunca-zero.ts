/**
 * O NÃO MEDIDO SAI `null`, NUNCA ZERO — e nada perguntava ao código que escreve a medida. (LAB-147, item 900, a
 * dívida própria, D375)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §4 diz, entre o que este repositório NUNCA faz:
 *
 * > *"**Não inventa dado:** o não medido sai `null`, nunca zero (D23)."*
 *
 * Descartada do LAB-138 ao LAB-146 como *"espalhada por vinte módulos"*. Espalhada está; sem dono, também. A
 * varredura de chamadas (`varredura-de-chamadas.ts`, LAB-52) pega o `?? 0` sobre o resultado de uma **chamada** e
 * diz, no `oQueNaoPega` dela, que **não** pega o `?? 0` sobre **propriedade ou variável** — que é exatamente a forma
 * em que uma medida ausente vira zero: `r.judge.areaPrivativa_m2 ?? 0`. Ninguém cobria esse buraco declarado.
 *
 * # O que este módulo pergunta
 *
 * Todo `?? 0` e todo `|| 0` do código versionado (fora de `upstream/` e de `tests/`), sem comentários, e separa os
 * que caem sobre uma **medida** — pelo nome, na convenção de unidade que a casa mede desde o LAB-143 (`_m`, `_m2`,
 * `_pct`, `_graus`…):
 *
 * - **`operando`** — o zero substitui uma medida ausente: `x.areaPrivativa_m2 ?? 0`;
 * - **`chave`** — o zero é gravado NUMA medida: `maxima_pct: n2(lista.at(-1) ?? 0)` (a máxima de uma lista vazia
 *   não é zero, é *não há*).
 *
 * O resto — contador (`mapa.get(k) ?? 0) + 1`), comprimento de lista opcional, posição de linha — **não é medida** e
 * fica fora de propósito: zero ali é a contagem do que não apareceu, e é verdade.
 *
 * Cada zero sobre medida que existe hoje está numa lista fechada, **por arquivo, com a contagem e o motivo**
 * ({@link ZEROS_DECLARADOS}), conferida nos dois sentidos: zero novo reprova, e zero declarado que sumiu também (a
 * catraca só desce com a lista descendo junto). Quem escreve ferramenta nova escreve `?? null`.
 *
 * # O que ela NÃO cobra, dito
 *
 * Vai na saída da trava ({@link O_QUE_ISTO_NAO_ALCANCA}).
 */
import { semComentarios } from "./varredura-de-chamadas.ts";

/**
 * Os sufixos de unidade que fazem de um nome uma MEDIDA. Os de comprimento e área no metro e fora dele (o LAB-143
 * reprova os de fora em outra trava; aqui eles contam como medida do mesmo jeito), a fração e o ângulo.
 */
export const SUFIXOS_DE_MEDIDA: readonly string[] = [
  "m",
  "m2",
  "m3",
  "pct",
  "graus",
  "ha",
  "km",
  "km2",
  "cm",
  "mm",
] as const;

/** Um nome é medida se termina, depois de um sublinhado, num sufixo de {@link SUFIXOS_DE_MEDIDA}. */
export function ehMedida(nome: string): boolean {
  const m = /_([A-Za-z0-9]+)$/.exec(nome);
  return m !== null && SUFIXOS_DE_MEDIDA.includes(m[1]!.toLowerCase());
}

export type FormaDoZero = "operando" | "chave";

/** Um zero posto no lugar de uma medida. */
export interface ZeroSobreMedida {
  linha: number;
  forma: FormaDoZero;
  /** a medida: o operando (`areaPrivativa_m2`) ou a chave que recebe o zero (`maxima_pct`) */
  medida: string;
  /** a linha, aparada, até 160 caracteres */
  trecho: string;
}

/** O que a leitura de um texto devolve: todos os zeros, e os que caem sobre medida. */
export interface LeituraDosZeros {
  /** todo `?? 0` e `|| 0` fora de comentário */
  zeros: number;
  sobreMedida: ZeroSobreMedida[];
}

/** `?? 0` ou `|| 0`, e o zero não é o começo de outro número (`|| 0.5`, `?? 0x10`). */
const ZERO = /(\?\?|\|\|)\s*0(?![\d.xXbBoOeE_])/g;

/** Lê um texto de código e acha os zeros sobre medida. */
export function zerosSobreMedida(texto: string): LeituraDosZeros {
  const codigo = semComentarios(texto);
  const linhas = codigo.split("\n");
  const originais = texto.split("\n");
  let zeros = 0;
  const sobreMedida: ZeroSobreMedida[] = [];
  linhas.forEach((linha, i) => {
    for (const m of linha.matchAll(ZERO)) {
      zeros++;
      const antes = linha.slice(0, m.index);
      const trecho = (originais[i] ?? linha).trim().slice(0, 160);
      // O operando: o último nome antes do operador (com o `!` de não-nulo, se houver).
      const op = /([A-Za-z_$][\w$]*)[!]?\s*$/.exec(antes);
      if (op && ehMedida(op[1]!)) {
        sobreMedida.push({ linha: i + 1, forma: "operando", medida: op[1]!, trecho });
        continue;
      }
      // A chave: a última `nome:` da linha antes do zero, sem vírgula entre ela e ele (senão é de outra chave).
      const chaves = [...antes.matchAll(/["']?\b([A-Za-z_$][\w$]*)["']?\s*:(?!:)/g)];
      const ultima = chaves.at(-1);
      if (ultima && ehMedida(ultima[1]!) && !antes.slice(ultima.index! + ultima[0].length).includes(",")) {
        sobreMedida.push({ linha: i + 1, forma: "chave", medida: ultima[1]!, trecho });
      }
    }
  });
  return { zeros, sobreMedida };
}

/** O que torna um zero declarado aceitável hoje — a classe dele. */
export type ClasseDoZero =
  /** o fluxo garante a medida: o `?? 0` está ali para o compilador e nunca dispara */
  | "nunca-dispara"
  /** pode disparar, e não disparou em nenhuma prova gravada — medido chave por chave */
  | "nao-disparou-nas-provas"
  /** a ausência é o próprio fato: não houve aparo, e o zero de "aparado" é verdade */
  | "ausencia-e-zero-de-verdade"
  /** é um PARÂMETRO com padrão, não uma medida: zero é "sem piso", e o conserto nasce desligado */
  | "parametro-padrao"
  /** a ferramenta é de um prompt antigo e gravou a prova do dia; trocá-la sem regerar deixaria as duas discordando (D118) */
  | "ferramenta-historica";

/** Um arquivo com zeros sobre medida que ficam, e por quê. */
export interface ZeroDeclarado {
  quantos: number;
  classe: ClasseDoZero;
  motivo: string;
}

/**
 * A lista fechada: os zeros sobre medida que existem no código de hoje, por arquivo. Medida no LAB-147
 * (17/10/2026), arquivo por arquivo — a tabela do relatório diz linha por linha.
 */
export const ZEROS_DECLARADOS: Readonly<Record<string, ZeroDeclarado>> = {
  "external-engines/esteira/ferramentas/lab02.ts": {
    quantos: 2,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-02/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia",
  },
  "external-engines/esteira/ferramentas/lab03.ts": {
    quantos: 1,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-03/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia",
  },
  "external-engines/esteira/ferramentas/lab04.ts": {
    quantos: 1,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-04/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia",
  },
  "external-engines/esteira/ferramentas/lab05.ts": {
    quantos: 1,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-05/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia",
  },
  "external-engines/esteira/ferramentas/lab08.ts": {
    quantos: 12,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-08/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia; dez dos doze trocam por zero a `judge.areaPrivativa_m2` ausente, que o tipo do Generate diz `number` (um deles lê um `judge?` opcional)",
  },
  "external-engines/esteira/ferramentas/lab13.ts": {
    quantos: 3,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-13/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia; os três estão no texto impresso pela ferramenta, não numa chave",
  },
  "external-engines/esteira/ferramentas/lab19.ts": {
    quantos: 1,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-19/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia; `largura_m` medido: nenhum zero nas 463 vezes que a chave aparece nas provas",
  },
  "external-engines/esteira/ferramentas/lab23.ts": {
    quantos: 2,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-23/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia; `largura_m` medido: nenhum zero nas 463 vezes que a chave aparece nas provas",
  },
  "external-engines/esteira/ferramentas/lab24.ts": {
    quantos: 1,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-24/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia; `largura_m` medido: nenhum zero nas 463 vezes que a chave aparece nas provas",
  },
  "external-engines/esteira/ferramentas/lab50.ts": {
    quantos: 3,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `docs/provas/LAB-50/`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia; dois dos três só CONTAM lotes por faixa, e o da máxima corre sobre lista já filtrada pelos medidos",
  },
  "external-engines/symbios/adapter/ferramentas/diagnostico-rampa.ts": {
    quantos: 3,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `o diagnóstico de rampa do LAB-01`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia; só roda com o `.wasm`, que não se constrói nesta máquina — trocar sem remedir é escrever no escuro",
  },
  "external-engines/symbios/adapter/ferramentas/medir.ts": {
    quantos: 6,
    classe: "ferramenta-historica",
    motivo:
      "ferramenta que gravou `outputs/lab01/medicoes.json`; a prova é história (D118) e regerá-la para trocar o zero por `null` reescreve o que o prompt mediu no dia. DISPAROU: o terreno de 450 m², sem quadra, sem via e sem amostra, gravou `minima_m2: 0`, `maxima_m2: 0` e três `maxima_pct: 0` — está no relatório do LAB-147. Só roda com o `.wasm`",
  },
  "external-engines/esteira/src/motores/testfit.ts": {
    quantos: 2,
    classe: "ausencia-e-zero-de-verdade",
    motivo:
      "variante sem `aparo` é variante que o Lab não aparou: ela entra com zero no ORIGINAL e no que RESTOU, e o corte (a diferença) dela é zero de verdade, não um não medido",
  },
  "external-engines/esteira/src/preco-do-setimo.ts": {
    quantos: 2,
    classe: "nao-disparou-nas-provas",
    motivo:
      "lote da fileira externa sem `area_m2` ou `testada_m` sairia zero; medido na prova do LAB-94, 1 196 áreas e nenhuma zero, nenhuma testada zero — vira `null` no dia em que disparar",
  },
  "external-engines/esteira/src/rampa.ts": {
    quantos: 2,
    classe: "nunca-dispara",
    motivo:
      "a mediana e a pior são lidas de `ordenadas`, que não pode estar vazia ali: a função devolve `medida: false` antes, quando não há trecho (`trechos.length === 0`); o `?? 0` é só para o `noUncheckedIndexedAccess`",
  },
  "external-engines/symbios/adapter/src/geojson.ts": {
    quantos: 2,
    classe: "nao-disparou-nas-provas",
    motivo:
      "via sem cota viraria cota ZERO, que é uma altitude; medido, nenhum `cotaInicial_m` nem `cotaFinal_m` zero nas 674 vezes que aparecem nas provas — vira `null` no dia em que disparar, e o adaptador do Symbios só se remede com o `.wasm`",
  },
  "external-engines/symbios/adapter/src/recorte.ts": {
    quantos: 1,
    classe: "parametro-padrao",
    motivo:
      "`ladoDoLoteMinimo_m` é OPÇÃO do recorte, não medida: zero é *sem piso de lado*, e é assim que o conserto nasce desligado (CLAUDE.md §4)",
  },
};

export type TipoDoProblema =
  /** zero sobre medida num arquivo que não está na lista, ou mais do que a lista diz */
  | "zero-inventado"
  /** a lista diz mais zeros do que o arquivo tem: a catraca desceu sem a lista descer junto */
  | "declaracao-que-sobra"
  /** a lista nomeia um arquivo que não existe mais */
  | "declaracao-sem-arquivo"
  /** a declaração não diz por quê */
  | "declaracao-sem-motivo"
  /** a leitura não achou nenhum zero em lugar nenhum: régua que não leu nada sai verde (D164) */
  | "universo-vazio";

export interface ProblemaDoZero {
  tipo: TipoDoProblema;
  arquivo: string;
  oQue: string;
}

export interface ResultadoDosZeros {
  problemas: ProblemaDoZero[];
  /** quantos arquivos de código foram lidos */
  arquivos: number;
  /** todo `?? 0` e `|| 0` achado */
  zeros: number;
  /** quantos caem sobre medida */
  sobreMedida: number;
  /** por arquivo, os achados */
  porArquivo: Record<string, ZeroSobreMedida[]>;
}

/** O universo: código versionado, fora de `upstream/`, `node_modules/` e `tests/`. */
export function entraNoUniverso(caminho: string): boolean {
  return (
    /\.(ts|tsx|js|mjs|cjs)$/.test(caminho) &&
    !/(^|\/)upstream\//.test(caminho) &&
    !/(^|\/)node_modules\//.test(caminho) &&
    !/(^|\/)tests\//.test(caminho)
  );
}

/** Confere os arquivos lidos contra a lista fechada, nos dois sentidos. */
export function conferirNuloNuncaZero(
  arquivos: readonly { caminho: string; texto: string }[],
  declarados: Readonly<Record<string, ZeroDeclarado>> = ZEROS_DECLARADOS,
): ResultadoDosZeros {
  const problemas: ProblemaDoZero[] = [];
  const porArquivo: Record<string, ZeroSobreMedida[]> = {};
  let zeros = 0;
  let sobreMedida = 0;
  const lidos = arquivos.filter((a) => entraNoUniverso(a.caminho));
  for (const a of lidos) {
    const l = zerosSobreMedida(a.texto);
    zeros += l.zeros;
    sobreMedida += l.sobreMedida.length;
    if (l.sobreMedida.length > 0) porArquivo[a.caminho] = l.sobreMedida;
    const d = declarados[a.caminho];
    const n = l.sobreMedida.length;
    if (n > (d?.quantos ?? 0)) {
      const novos = l.sobreMedida.map((z) => `linha ${z.linha} (${z.forma} \`${z.medida}\`)`).join("; ");
      problemas.push({
        tipo: "zero-inventado",
        arquivo: a.caminho,
        oQue: `${n} zero(s) sobre medida, ${d === undefined ? "e o arquivo não está na lista" : `e a lista diz ${d.quantos}`}: ${novos} — o não medido sai \`null\`, nunca zero (D23)`,
      });
    } else if (d !== undefined && n < d.quantos) {
      problemas.push({
        tipo: "declaracao-que-sobra",
        arquivo: a.caminho,
        oQue: `a lista diz ${d.quantos} zero(s) sobre medida e o arquivo tem ${n}: desça a lista junto com o conserto`,
      });
    }
  }
  const caminhos = new Set(lidos.map((a) => a.caminho));
  for (const [caminho, d] of Object.entries(declarados)) {
    if (!caminhos.has(caminho)) {
      problemas.push({ tipo: "declaracao-sem-arquivo", arquivo: caminho, oQue: "a lista nomeia um arquivo que não foi lido" });
    }
    if (d.motivo.trim().length < 40) {
      problemas.push({ tipo: "declaracao-sem-motivo", arquivo: caminho, oQue: "o motivo tem menos de 40 caracteres" });
    }
  }
  if (lidos.length === 0 || zeros === 0) {
    problemas.push({
      tipo: "universo-vazio",
      arquivo: "(nenhum)",
      oQue: `${lidos.length} arquivo(s) lido(s) e ${zeros} zero(s) achado(s): a régua não leu nada e não pode dizer que está limpo`,
    });
  }
  return { problemas, arquivos: lidos.length, zeros, sobreMedida, porArquivo };
}

/** O que esta trava não alcança, dito na saída dela. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o nome sem unidade: `lotes ?? 0`, `nota ?? 0`, `mediana ?? 0` — a régua reconhece medida pelo sufixo (`_m`, `_m2`, `_pct`, `_graus`…), e um nome sem sufixo não diz o que é",
  "o camelCase do Generate (`areaM2`, `pctPrivativa`): a convenção desta casa é o sublinhado, e o nome do dono entra pelo operando só quando tem sufixo",
  "o zero que não é `?? 0` nem `|| 0`: `: 0` num ternário, `Math.max(0, …)`, `reduce(…, 0)` sobre lista vazia, `Number(undefined)` — outras formas de inventar, não lidas",
  "o tempo (`_ms`): é medida do motor, não da terra, e fica fora dos sufixos",
  "os testes (`tests/`): não gravam prova; o zero de um teste é dado plantado",
  "o JSON já gravado: um zero em `docs/provas/` não diz se foi medido ou inventado — a régua lê quem escreve, não o escrito",
] as const;
