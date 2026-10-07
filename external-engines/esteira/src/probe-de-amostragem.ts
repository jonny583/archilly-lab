/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O PROBE DE AMOSTRAGEM — como perguntar "por que a régua DELE diz zero"
 *  sem trocar de régua. (LAB-54)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * # O problema que ele resolve
 *
 * O LAB-48 deixou **27 violações `frente` sem culpado**, e disse isso em vez de escolher,
 * porque atribuir com régua minha seria a forma do D93 e do D127:
 *
 * > *"A minha régua é distância ao eixo menos meia-caixa, e a do Validator é
 * > `_testadaDoLote` contra as `superficiesDeFrente` dele. **As duas não são a mesma
 * > régua.**"*
 *
 * Mas "medir com a régua dele" responde **se** ela acusa, não **por quê**. E a pergunta do
 * prompt é o porquê.
 *
 * # A ideia, e ela cabe em uma frase
 *
 * > **Mude a AMOSTRAGEM e deixe a função DELE responder de novo.**
 *
 * A função dele testa o **ponto do MEIO** de cada aresta contra o contorno das superfícies
 * viárias, com tolerância de 0,75 m. Numa aresta de 34 m que encosta no leito só numa
 * ponta, o meio está a 17 m de lá — e a aresta inteira some do teste.
 *
 * `densificar()` insere vértices ao longo das arestas: **a borda é a mesma, a área é a
 * mesma, o polígono é o mesmo** — só os pontos que a função dele vai amostrar mudam. Se
 * ela passa a devolver testada > 0, a conclusão é **dela sobre o mesmo polígono**, e não
 * uma régua minha discordando da dela.
 *
 * # As duas coisas que fazem disto medição e não truque
 *
 * 1. **A precondição de área.** Se densificar mudasse a geometria, o probe teria
 *    *consertado* o lote em vez de medi-lo. A ferramenta compara a área antes e depois e
 *    **para** se mudar mais de 1e-6 m². `areaMudou()` é essa conta;
 * 2. **A resolução declarada, que é o que dá força ao NEGATIVO.** Com passo de 0,25 m,
 *    "nenhuma amostra a ≤ 0,75 m do contorno" significa que **nenhum ponto da borda** está
 *    a menos de ~0,62 m. Sem dizer o passo, "continuou zero" não prova nada.
 *
 * **E o resultado mais útil do LAB-54 não é o probe: é o que ele mostrou DEPOIS.** Dos 11
 * lotes que viram, a frontagem real é de **1,5 a 5,49 m** contra um mínimo de 10 — então
 * **nenhum** deles passaria: a violação troca de `frente` para `testada` e **zero
 * desaparecem**. *Régua que erra o RÓTULO e acerta o VEREDICTO não é régua errada* (D184).
 */

/** Um ponto no plano, em metros. */
export interface Ponto {
  x: number;
  y: number;
}

/** Área do polígono fechado, em m². */
export function area(pontos: readonly Ponto[]): number {
  let s = 0;
  for (let i = 0; i < pontos.length; i++) {
    const a = pontos[i]!;
    const b = pontos[(i + 1) % pontos.length]!;
    s += a.x * b.y - b.x * a.y;
  }
  return Math.abs(s) / 2;
}

/**
 * O MESMO polígono com mais vértices — mesma borda, mesma área.
 *
 * @param passosPorAresta em quantos pedaços cada aresta é dividida.
 * @param so quando dado, densifica **apenas** essa aresta. É como se descobre **qual**
 *   aresta era a frontal que a amostragem perdia.
 */
export function densificar(pontos: readonly Ponto[], passosPorAresta: number, so?: number): Ponto[] {
  const out: Ponto[] = [];
  for (let i = 0; i < pontos.length; i++) {
    const a = pontos[i]!;
    const b = pontos[(i + 1) % pontos.length]!;
    const k = so === undefined || so === i ? Math.max(1, Math.floor(passosPorAresta)) : 1;
    for (let j = 0; j < k; j++) {
      out.push({ x: a.x + ((b.x - a.x) * j) / k, y: a.y + ((b.y - a.y) * j) / k });
    }
  }
  return out;
}

/** O quanto a área mudou. Densificar honesto devolve ~0. */
export function areaMudou(original: readonly Ponto[], denso: readonly Ponto[]): number {
  return Math.abs(area(denso) - area(original));
}

/** Teto da variação de área aceita, em m². Acima disso o probe mexeu no objeto. */
export const AREA_PODE_MUDAR_ATE_M2 = 1e-6;

/** Distância de um ponto ao SEGMENTO `a`–`b`. */
function aoSegmento(p: Ponto, a: Ponto, b: Ponto): number {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const n = vx * vx + vy * vy;
  const t = n === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / n));
  return Math.hypot(p.x - (a.x + t * vx), p.y - (a.y + t * vy));
}

/**
 * O quanto o ponto mais fora do probe SAIU DA BORDA original, em metros.
 *
 * # Por que esta conta existe, e ela foi achada por sabotagem
 *
 * A primeira versão deste probe tinha **uma** precondição — a área não mudar — e a
 * justificativa escrita era *"se densificar mudasse a geometria, o probe teria consertado
 * o lote em vez de medi-lo"*. **A sabotagem desmentiu a justificativa:** eu desloquei
 * todos os pontos densificados em 1 cm e a trava **PASSOU**, porque deslocar TODOS os
 * pontos é uma **translação**, e translação **não muda área nenhuma**.
 *
 * E translação é o pior erro possível aqui: o probe mede **distância até o leito da via**.
 * Um probe que escorregasse o lote 1 m para o lado da rua faria a régua do Generate dizer
 * "tem frente" sobre um lote que não tem — e a conta de área aprovaria.
 *
 * > **Área preservada não prova borda preservada.** A área é invariante por translação e
 * > por rotação; o que este probe precisa garantir é que **cada ponto novo está SOBRE a
 * > borda original**, e isso só a distância à borda responde.
 *
 * Terceira vez em três prompts que a sabotagem pega o que eu não vi (D179, D181, D186).
 */
export function saiuDaBorda(original: readonly Ponto[], denso: readonly Ponto[]): number {
  let pior = 0;
  for (const p of denso) {
    let melhor = Infinity;
    for (let i = 0; i < original.length; i++) {
      const a = original[i]!;
      const b = original[(i + 1) % original.length]!;
      melhor = Math.min(melhor, aoSegmento(p, a, b));
      if (melhor === 0) break;
    }
    if (melhor > pior) pior = melhor;
  }
  return pior;
}

/** Teto do quanto um ponto do probe pode sair da borda, em metros. */
export const PODE_SAIR_DA_BORDA_ATE_M = 1e-9;

/**
 * As duas precondições juntas, como a ferramenta as cobra.
 *
 * `null` quando o probe é honesto; a frase do motivo quando não é.
 */
export function probeMexeuNoObjeto(
  original: readonly Ponto[],
  denso: readonly Ponto[],
): string | null {
  const dA = areaMudou(original, denso);
  if (dA > AREA_PODE_MUDAR_ATE_M2) return `a área mudou ${dA} m²`;
  const dB = saiuDaBorda(original, denso);
  if (dB > PODE_SAIR_DA_BORDA_ATE_M) return `um ponto saiu ${dB} m da borda original`;
  return null;
}

/**
 * Quantas amostras por aresta para o passo não passar de `passo_m`.
 *
 * O passo é o que dá força ao negativo, então ele sai do comprimento da MAIOR aresta e
 * nunca de um número redondo escolhido à mão.
 */
export function amostrasParaOPasso(maiorAresta_m: number, passo_m: number): number {
  return Math.max(2, Math.ceil(maiorAresta_m / passo_m));
}
