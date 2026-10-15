/**
 * O `<app>` DO RECADO É O NOME DESTA CASA — e a régua do cabeçalho aceitava qualquer um.
 * (LAB-117, item 900, a dívida própria, D345)
 *
 * # O defeito, medido em 15/10/2026
 *
 * Com a caixa só no `900` e a FILA sem proposta que não espere ninguém, fui à dívida própria,
 * espécie **regra sem guarda**, no lugar mais lido do repositório: o `CLAUDE.md` §1. Lá está
 *
 * > **`<app>` é `MOTOR LAB (archilly-lab)`**, nunca `Lab`
 *
 * e nada a cobrava. A trava do cabeçalho (`tests/recado.test.ts`, `CABECALHO`) é
 * `/^=== RECADO PARA O CHAT — .+ · .+ ===$/`: o `<app>` virou `.+` no D228, quando a régua que
 * casava `Lab` **literal** reprovou o primeiro cabeçalho certo. O conserto daquele dia abriu a
 * régua para os DOIS lados — a forma nova passou, e a forma velha **continuou passando**.
 * Medido, com o recado do LAB-116 trocado para `— Lab · LAB-116 (item 900) ===` numa cópia do
 * acumulado de verdade (e desfeito depois), os **nove** arquivos de teste que leem o `RECADOS.md`
 * rodaram **127 de 127 verdes** — o `recado.test.ts` (9) e o `classes-de-rodada.test.ts` (9)
 * entre eles.
 *
 * *Régua nova nasce estreita demais, e às vezes larga demais — as duas coisas são o mesmo
 * defeito* (`COMO_FUNCIONA.md`). Esta nasceu estreita, foi alargada no conserto, e ficou larga.
 *
 * # O que o histórico diz, contado no `RECADOS.md` de hoje
 *
 * | trecho | cabeçalhos | `<app>` |
 * |---|---|---|
 * | até o LAB-67 (antes do D228, 09/10) | **72** | `Lab`, todos |
 * | do LAB-68 (item 001) até o LAB-116 | **56** | `MOTOR LAB (archilly-lab)`, todos |
 *
 * **A regra foi cumprida em 56 de 56** — por disciplina. *Disciplina não é guarda* (item 002).
 *
 * # O que este módulo faz
 *
 * - {@link appDaPagina} — lê o `<app>` do `CLAUDE.md`, para a régua e a regra não divergirem:
 *   quem trocar o nome da casa na página troca o que a trava cobra;
 * - {@link lerCabecalhos} — todo cabeçalho de recado do acumulado, com a linha; o que começa como
 *   cabeçalho e não tem a forma `— <app> · <prompt> ===` volta marcado, e **reprova** (régua que
 *   não lê uma linha não pode dizer que ela está certa — D343);
 * - {@link conferirOsApps} — o **corte** é o recado do `LAB-68`, o primeiro depois do D228, achado
 *   pelo **prompt** e não pelo primeiro `MOTOR LAB` (achar pelo nome deixaria a régua andar o
 *   corte para frente quando o próprio LAB-68 errasse). Antes do corte, `Lab` e **72** — a
 *   fotografia do registro, que não se reescreve e não cresce; do corte em diante, o nome da
 *   página, **exato**.
 *
 * # O que ele NÃO alcança, dito
 *
 * - o recado que **só foi à tela** e não chegou ao arquivo: a trava lê o arquivo (a âncora disso é
 *   a do item 002, `classes-de-rodada.ts`);
 * - o recado escrito **dentro de um relatório** ou de um item `-FEITO` da caixa: não é o acumulado,
 *   e o chat lê o acumulado;
 * - o `<prompt>`: é da âncora do item 002 (`ancorarRecado`), que já o cobra pelo vocabulário.
 */

/** O cabeçalho como o §1 o escreve. O `<app>` é o mais curto possível antes do primeiro ` · `. */
const CABECALHO = /^=== RECADO PARA O CHAT — (.+?) · (.+) ===$/;

/** Tudo que começa como cabeçalho é cabeçalho — inclusive o que errou a forma. */
const COMECO_DO_CABECALHO = /^=== RECADO PARA O CHAT\b/;

/** O nome que os cabeçalhos levavam antes do D228. Fotografia, não regra. */
export const APP_ANTES_DO_CORTE = "Lab";

/** O primeiro recado depois do D228 (09/10/2026, item 001). O corte é achado por ele. */
export const PROMPT_DO_CORTE = "LAB-68";

/** Quantos cabeçalhos há antes do corte. O registro não se reescreve — e não cresce. */
export const RECADOS_ANTES_DO_CORTE = 72;

/**
 * O `<app>` que o `CLAUDE.md` §1 declara. **`null` quando a página não declara exatamente um** —
 * nunca um nome suposto (D23): régua sem o sujeito da regra não cobra nada.
 */
export function appDaPagina(claudeMd: string): string | null {
  const achados = [...claudeMd.matchAll(/`<app>`\*?\*? é `([^`]+)`/g)].map((m) => m[1]!);
  return achados.length === 1 ? achados[0]! : null;
}

export interface CabecalhoDoRecado {
  /** A linha no acumulado, a partir de 1. */
  linha: number;
  /** `null` quando a linha começa como cabeçalho e não tem a forma. */
  app: string | null;
  prompt: string | null;
  texto: string;
}

/** Todo cabeçalho de recado do acumulado, em ordem. */
export function lerCabecalhos(acumulado: string): CabecalhoDoRecado[] {
  const fora: CabecalhoDoRecado[] = [];
  acumulado.split("\n").forEach((texto, i) => {
    if (!COMECO_DO_CABECALHO.test(texto)) return;
    const m = CABECALHO.exec(texto);
    fora.push({ linha: i + 1, app: m ? m[1]! : null, prompt: m ? m[2]! : null, texto });
  });
  return fora;
}

export interface DesvioDoApp {
  linha: number;
  texto: string;
  porque: string;
}

export interface ConferenciaDosApps {
  /** Quantos cabeçalhos a régua leu — o universo, publicado (§2.7 da direção). */
  lidos: number;
  antesDoCorte: number;
  doCorteEmDiante: number;
  desvios: DesvioDoApp[];
}

/** O corte é o cabeçalho cujo `<prompt>` nomeia o `LAB-68`, como prompt e não como prefixo. */
function ehOCorte(c: CabecalhoDoRecado): boolean {
  return c.prompt !== null && new RegExp(String.raw`(?<![\w-])${PROMPT_DO_CORTE}(?![\w-])`).test(c.prompt);
}

/**
 * Confere o `<app>` de todo cabeçalho contra o nome que a página declara.
 *
 * Desvio é: a página sem nome (ou com dois); o cabeçalho fora da forma; o corte ausente; o corte
 * repetido; antes do corte, um nome que não é `Lab` ou uma contagem que não é a do registro; do
 * corte em diante, qualquer nome que não seja **exatamente** o da página.
 */
export function conferirOsApps(acumulado: string, app: string | null): ConferenciaDosApps {
  const cabecalhos = lerCabecalhos(acumulado);
  const desvios: DesvioDoApp[] = [];
  const res = (antes: number, depois: number): ConferenciaDosApps => ({
    lidos: cabecalhos.length,
    antesDoCorte: antes,
    doCorteEmDiante: depois,
    desvios,
  });

  if (app === null) {
    desvios.push({ linha: 0, texto: "CLAUDE.md §1", porque: "a página não declara UM `<app>` — sem o sujeito, a régua não cobra nada" });
  }
  for (const c of cabecalhos.filter((c) => c.app === null)) {
    desvios.push({ linha: c.linha, texto: c.texto, porque: "começa como cabeçalho e não tem a forma `— <app> · <prompt> ===`" });
  }

  const cortes = cabecalhos.filter(ehOCorte);
  if (cortes.length !== 1) {
    desvios.push({
      linha: cortes[1]?.linha ?? 0,
      texto: cortes.map((c) => c.texto).join(" | ") || "(nenhum)",
      porque: `o corte (o recado do ${PROMPT_DO_CORTE}) tem de existir uma vez só — achei ${cortes.length}`,
    });
    return res(0, 0);
  }

  const i = cabecalhos.indexOf(cortes[0]!);
  const antes = cabecalhos.slice(0, i);
  const depois = cabecalhos.slice(i);

  if (antes.length !== RECADOS_ANTES_DO_CORTE) {
    desvios.push({
      linha: cortes[0]!.linha,
      texto: cortes[0]!.texto,
      porque: `antes do corte o registro tem ${RECADOS_ANTES_DO_CORTE} cabeçalhos, e achei ${antes.length} — registro não se reescreve nem cresce`,
    });
  }
  for (const c of antes.filter((c) => c.app !== null && c.app !== APP_ANTES_DO_CORTE)) {
    desvios.push({ linha: c.linha, texto: c.texto, porque: `antes do corte o nome era \`${APP_ANTES_DO_CORTE}\` — o registro foi reescrito` });
  }
  if (app !== null) {
    for (const c of depois.filter((c) => c.app !== null && c.app !== app)) {
      desvios.push({ linha: c.linha, texto: c.texto, porque: `o <app> é \`${c.app}\`, e a página manda \`${app}\`` });
    }
  }
  return res(antes.length, depois.length);
}
