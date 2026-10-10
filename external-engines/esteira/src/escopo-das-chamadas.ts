/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A MEDIÇÃO DA VARREDURA DE CHAMADAS, NUM LUGAR SÓ. (item 020, LAB-87)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **Segunda prova velha achada pela mesma régua, e pelo mesmo motivo.** O LAB-86 consertou a
 * do LAB-57 por recontagem; ao abrir as outras dez, a do LAB-52 estava igualmente velha:
 *
 * | número | na prova commitada | na mesma árvore | atraso |
 * |---|---|---|---|
 * | `arquivos` | 114 | **191** | 40,3 % do número de hoje |
 * | `linhas` | 32 114 | **52 245** | 38,5 % |
 * | `bytes` | 1 357 772 | **2 325 267** | 41,6 % |
 * | `parametrosExaminados` | 4 932 | **7 892** | 37,5 % |
 * | `camposExaminados` | 4 318 | **6 577** | 34,3 % |
 *
 * E a trava dela tinha **quatro** limiares: `arquivos > 100`, `parametrosExaminados > 3000`,
 * `camposExaminados > 2500`, mais os de tamanho de texto. *Régua que confere uma prova com
 * `maior que` aceita qualquer prova velha que já fosse grande o bastante quando nasceu*
 * (D287) — e esta já nascera grande.
 *
 * # O UNIVERSO É OUTRO, e isso é de propósito
 *
 * A varredura de configuração (LAB-57) parte de `git ls-files`: **o que o git carrega**. Esta
 * parte de `ls-files --cached --others --exclude-standard "*.ts"`: **todo `.ts` que existe e
 * não é ignorado**, rastreado ou não.
 *
 * > **Duas varreduras da mesma casa podem ter universos diferentes sem que uma esteja errada
 * > — o que não podem é ter o universo ESCRITO em dois lugares.** O instante em que cada uma
 * > fica velha é diferente: a do LAB-57 muda no `git add`; esta muda **assim que o arquivo
 * > existe**, porque `--others` já o vê.
 *
 * *E é a mais fácil de deixar velha das duas, justamente por isso: ela envelhece antes de
 * qualquer comando.*
 */
import { REGRAS_DE_CHAMADA, varrerUmArquivo, type AchadoDeChamada } from "./varredura-de-chamadas.ts";

/** Os números do escopo — o que a prova publica e a trava reconta. */
export interface NumerosDasChamadas {
  arquivos: number;
  linhas: number;
  bytes: number;
  regras: number;
  parametrosExaminados: number;
  camposExaminados: number;
}

export interface MedicaoDasChamadas {
  numeros: NumerosDasChamadas;
  achados: AchadoDeChamada[];
  porRegra: Record<string, number>;
}

/**
 * O filtro do universo: `.ts` que não é de dependência nem declaração de tipo.
 *
 * Mora aqui, e não na ferramenta, porque a trava precisa do **mesmo** filtro — duas
 * implementações da mesma pergunta divergem (D231), e foi o que o item 019 cobrou pelo nome.
 */
export const EH_FONTE_TS = (f: string): boolean =>
  f.length > 0 && !f.includes("node_modules/") && !f.endsWith(".d.ts");

/**
 * Mede a varredura de chamadas sobre uma lista de arquivos — a MESMA conta que a prova
 * publica.
 *
 * `arquivos` já vem filtrado por `EH_FONTE_TS`, e `ler` lê um caminho relativo à raiz.
 */
export function medirAsChamadas(
  arquivos: readonly string[],
  ler: (relativo: string) => string,
): MedicaoDasChamadas {
  const achados: AchadoDeChamada[] = [];
  let linhas = 0;
  let bytes = 0;
  let parametros = 0;
  let campos = 0;

  for (const rel of arquivos) {
    const bruto = ler(rel);
    linhas += bruto.split("\n").length;
    bytes += Buffer.byteLength(bruto);
    const r = varrerUmArquivo(bruto, rel);
    achados.push(...r.achados);
    parametros += r.parametros;
    campos += r.campos;
  }

  const porRegra: Record<string, number> = {};
  for (const r of REGRAS_DE_CHAMADA) porRegra[r.nome] = achados.filter((a) => a.regra === r.nome).length;

  return {
    numeros: {
      arquivos: arquivos.length,
      linhas,
      bytes,
      regras: REGRAS_DE_CHAMADA.length,
      parametrosExaminados: parametros,
      camposExaminados: campos,
    },
    achados,
    porRegra,
  };
}

export interface ChaveVelha {
  chave: string;
  naProva: number;
  naArvore: number;
}

/**
 * **A PERGUNTA DO D204 para esta prova:** ela bate com a árvore de agora?
 *
 * Mesma forma do `remedirAProva` do `escopo-da-varredura.ts`, e de propósito: são duas
 * varreduras com universos diferentes, mas **a pergunta é a mesma**, e quem lê uma lê a outra.
 */
export function remedirAsChamadas(
  publicado: Partial<Record<keyof NumerosDasChamadas, unknown>>,
  agora: NumerosDasChamadas,
): ChaveVelha[] {
  const velhas: ChaveVelha[] = [];
  for (const [chave, naArvore] of Object.entries(agora) as [keyof NumerosDasChamadas, number][]) {
    const naProva = publicado[chave];
    if (typeof naProva !== "number" || naProva !== naArvore) {
      velhas.push({ chave, naProva: typeof naProva === "number" ? naProva : Number.NaN, naArvore });
    }
  }
  return velhas;
}
