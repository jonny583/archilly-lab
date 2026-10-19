/**
 * **LAB-203 (item 900) · a guarda da IDA do LAB-30 carrega o motor e o Generate e não escreve o commit de nenhum
 * dos dois — e, medido, não CHAMA nenhum dos dois: nenhum commit de vizinho decide a prova** (D431).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-30/guarda-da-ida.json` foi regravada pela última vez no LAB-93 (`c8a1013`, 12/10/2026,
 * 00h37 UTC). A ferramenta `external-engines/esteira/ferramentas/lab30.ts` puxa, pelo fecho dos `import`, quatro
 * arquivos do motor (`src/lib/lab/api.ts`, `geo.ts`, `medidas.ts`, `contrato/tipos.ts`) e dois do Generate
 * (`src/lib/engine/sobras.ts`, `src/lib/import/parcelamento-externo.ts`), e a prova não escreve commit de nenhum
 * — o retrato do LAB-198 a dá calando os dois: dois silêncios. Era a mais velha do retrato que esta máquina roda
 * depois do LAB-07: do LAB-08 ao LAB-28 as ferramentas carregam o `.wasm` do Symbios, que não se constrói aqui.
 *
 * # As janelas, achadas rodando a ferramenta
 *
 * Rodada em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `c8a1013`, cada vizinho em **todos** os commits de primeiro pai da `main` dele, o outro no instante (motor
 * `11fcbad`, Generate `12cf23c` — as pontas da origem às 00h37 UTC de 12/10). A ferramenta leva menos de um
 * segundo, e a prova tem carimbo fixo (`geradoEm` escrito à mão): compara-se **o arquivo inteiro, byte a byte**.
 *
 * | eixo | antes (a ferramenta não roda) | refaz a prova byte a byte |
 * |---|---|---|
 * | motor, 271 commits | 42, até `d1998f1` (13/09) — falta `src/lib/lab/contrato/tipos.ts` | **229**, de `d2f71e4` (13/09, T01) à ponta de hoje (`d8a172f`) |
 * | Generate, 1 251 commits | 971, até `805b6a0` (09/09) — falta `src/lib/import/parcelamento-externo.ts` | **280**, de `22502b3` (10/09, o contrato v1) à ponta de hoje (`5f330d9`) |
 *
 * Nenhum commit de nenhum vizinho muda um byte. Ao contrário do D430, **nem o contrato v2 fecha a janela do
 * Generate** — e foi isso que pediu a pergunta seguinte.
 *
 * # Por que nada muda: a ferramenta CARREGA os vizinhos e não os CHAMA
 *
 * Com o motor e o Generate do instante e **toda função declarada no topo** dos `src/lib/` dos dois envenenada na
 * cópia ({@link envenenarAsFuncoes}: 1 099 funções, cada uma abrindo com `throw new Error("VENENO …")`), a
 * ferramenta roda até o fim e a prova sai **idêntica**. O veneno está vivo: chamar `rodarMotor` (motor) ou
 * `medirSobras` (Generate) pela mesma árvore explode com *"VENENO"*. A guarda da IDA audita o que a ida **do Lab**
 * (`testfit/adapter/src/ida.ts`, `src/gleba-v1.ts`) entrega ao motor, contra o inventário **do Lab**
 * (`src/inventario-das-idas.ts`); os arquivos dos vizinhos entram porque os módulos do Lab que ela usa os importam
 * para outras funções (a esteira, a volta, a disputa), que esta ferramenta nunca percorre.
 *
 * - **A comparação tem dentes — do lado de quem decide**: trocado, na cópia do Lab, o destino de `gleba.furos` na
 *   ida do Symbios ({@link A_TROCA_DOS_DENTES}), quinze linhas da prova mudam. Os dentes do vizinho não existem:
 *   o veneno é a prova de que não há onde mordê-lo.
 * - **O instante está dentro das duas janelas** — como em tudo o mais, porque as janelas são tudo o que monta.
 *
 * # O que se escreve: o silêncio é verdadeiro e não custa nada
 *
 * A prova cala dois commits que **não a decidem**. O que se escreve ao lado não é uma janela de commits que refazem
 * (seriam todos), é **o fato medido**: com a ferramenta do `c8a1013`, nenhuma função dos vizinhos é chamada, e a
 * prova se refaz com qualquer motor desde `d2f71e4` e qualquer Generate desde `22502b3` até onde se mediu. A prova
 * continua no retrato — ela segue calando, e é verdade (D182: não se regrava).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os estados do meio** e **depois de hoje**: medidos aqui e no D431, não a cada verde — a trava roda o
 *   instante, os quatro cantos, as duas bordas, o veneno e os dentes;
 * - **função que não é declaração de topo** — método de classe, `const f = () =>`, função aninhada: o veneno não
 *   as alcança. Hoje os quatro arquivos do motor e os dois do Generate do fecho não exportam nenhuma; uma chamada a
 *   uma delas a partir de uma função de topo envenenada explodiria antes, mas código no TOPO de um módulo que
 *   chamasse uma arrow escaparia;
 * - **a ferramenta de HOJE**: mediu-se a do `c8a1013`, a que gravou a prova; a de hoje é outra pergunta;
 * - **o ramo de trabalho de cada vizinho** (`motor-v2` do Generate, os `claude/*` do motor): mediu-se a `main`;
 * - **qual commit era o do disco**: nenhuma régua acha — e aqui nenhuma precisa achar.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-30/guarda-da-ida.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab30.ts";

/** O Lab: o último commit da prova. */
export const O_RETRATO_DO_LAB30: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "c8a10131da5e7b3fa90494d624a53872e88750fb",
    deOndeSeSabe: "o último commit da prova (`git log`: o LAB-93, 12/10/2026, 00h37 UTC); a ferramenta é a desse commit",
  },
];

/** Uma janela: de `primeiro` à ponta medida a prova se refaz byte a byte; em `antes` a ferramenta não roda. */
export interface JanelaQueSoMonta {
  pasta: string;
  primeiro: string;
  ultimoMedido: string;
  antes: string;
  oQueDaAntes: string;
  depois: null;
  oDoInstante: string;
  /** Quantos commits de primeiro pai foram rodados, e quantos refizeram. */
  rodados: number;
  refazem: number;
}

export const A_JANELA_DO_MOTOR: JanelaQueSoMonta = {
  pasta: "motor-testfit",
  primeiro: "d2f71e48e860650cc2c7a2b841b1c2c2c7fbe3a7",
  ultimoMedido: "d8a172f6ceaf3f02cef395d7d2fab2847493bee5",
  antes: "d1998f161187ed1d27e0f50a817dda43b378912c",
  oQueDaAntes: "a ferramenta não roda: ainda não existe `src/lib/lab/contrato/tipos.ts`",
  depois: null,
  oDoInstante: "11fcbad29306bdabbe66b0a99c24f4b51eb9ab59",
  rodados: 271,
  refazem: 229,
};

export const A_JANELA_DO_GENERATE: JanelaQueSoMonta = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "22502b380cfd2e58c7190707b9b3e57bb42b9155",
  ultimoMedido: "5f330d9e303a95b7302284a600499d0a64335cfc",
  antes: "805b6a059f24527935e60a24ffbafe48e3a5be50",
  oQueDaAntes: "a ferramenta não roda: ainda não existe `src/lib/import/parcelamento-externo.ts`",
  depois: null,
  oDoInstante: "12cf23c2b3b9738c289891e1c4aa54a7acaf5228",
  rodados: 1251,
  refazem: 280,
};

/** Uma função de cada vizinho, no fecho da ferramenta, que o veneno tem de fazer explodir quando chamada. */
export const O_VENENO_VIVO = [
  { pasta: "motor-testfit", alias: "@testfit/api.ts", funcao: "rodarMotor" },
  { pasta: "urban-create-hub-41d93a4d", alias: "@generate/engine/sobras.ts", funcao: "medirSobras" },
] as const;

/**
 * A troca que dá os dentes, feita na CÓPIA do Lab (a casa que decide a prova): o destino de `gleba.furos` na ida
 * do Symbios. Tem de casar uma vez no `inventario-das-idas.ts` do `c8a1013`.
 */
export const A_TROCA_DOS_DENTES = {
  arquivo: "external-engines/esteira/src/inventario-das-idas.ts",
  de: 'entregue("gleba.furos")',
  para: 'entregue("gleba.buracos")',
} as const;

/**
 * Põe `throw new Error("VENENO <nome>")` como primeira instrução de toda função **declarada no topo** do texto
 * (`function`, `export function`, `export default function`, `async function`, geradoras). Sobrecarga sem corpo
 * fica como está; o tipo de retorno literal (`): {` … `} {`) não é confundido com o corpo.
 */
export function envenenarAsFuncoes(texto: string, rotulo = ""): { texto: string; quantas: number } {
  const L = texto.split("\n");
  const out: string[] = [];
  let quantas = 0;
  const limpa = (s: string) => s.replace(/"[^"]*"|'[^']*'|`[^`]*`/g, "").split("//")[0]!.trimEnd();
  for (let i = 0; i < L.length; ) {
    const m = /^(export\s+)?(default\s+)?(async\s+)?function\*?\s+([A-Za-z0-9_$]+)/.exec(L[i]!);
    if (!m) {
      out.push(L[i]!);
      i++;
      continue;
    }
    let parenteses = 0;
    let chaves = 0;
    let corpo = -1;
    for (let j = i; j < L.length; j++) {
      const s = limpa(L[j]!);
      parenteses += (s.match(/\(/g)?.length ?? 0) - (s.match(/\)/g)?.length ?? 0);
      chaves += (s.match(/\{/g)?.length ?? 0) - (s.match(/\}/g)?.length ?? 0);
      if (parenteses === 0 && chaves === 0 && s.endsWith(";")) break; // sobrecarga: sem corpo
      if (parenteses === 0 && chaves === 1 && s.endsWith("{") && !/(:|<|\||&|,|=>)\s*\{$/.test(s)) {
        corpo = j;
        break;
      }
      if (j === i && parenteses === 0 && chaves === 0) {
        // Função de uma linha só: `function f(x): T { … }` — o corpo abre na primeira `{` depois do `)` que
        // fecha os parâmetros, se entre os dois não houver tipo literal.
        const linha = L[i]!;
        const fecha = fimDosParametros(linha);
        const abre = fecha < 0 ? -1 : linha.indexOf("{", fecha);
        if (abre > 0 && !/\{/.test(linha.slice(fecha, abre)) && !/(:|<|\||&|,)\s*$/.test(linha.slice(fecha + 1, abre))) {
          out.push(`${linha.slice(0, abre + 1)} throw new Error("VENENO ${rotulo}${m[4]}");${linha.slice(abre + 1)}`);
          quantas++;
          corpo = -2;
        }
        break;
      }
    }
    if (corpo === -2) {
      i++;
      continue;
    }
    if (corpo < 0) {
      out.push(L[i]!);
      i++;
      continue;
    }
    out.push(...L.slice(i, corpo + 1), `  throw new Error("VENENO ${rotulo}${m[4]}");`);
    quantas++;
    i = corpo + 1;
  }
  return { texto: out.join("\n"), quantas };
}

/** O índice do `)` que fecha a lista de parâmetros da declaração na linha, ou -1. */
function fimDosParametros(linha: string): number {
  const abre = linha.indexOf("(");
  if (abre < 0) return -1;
  let d = 0;
  for (let k = abre; k < linha.length; k++) {
    if (linha[k] === "(") d++;
    else if (linha[k] === ")" && --d === 0) return k;
  }
  return -1;
}
