/**
 * APARO — o conserto declarado, separado da tradução.
 *
 * # Por que este arquivo existe, e por que ele NÃO é a volta
 *
 * `volta.ts` traduz e não conserta: ela escreve no contrato o que o motor
 * desenhou, e nada mais. Este arquivo faz outra coisa, e por isso mora separado:
 * ele **repara** a saída para que ela passe no esquema do contrato. Misturar as
 * duas responsabilidades esconderia a diferença entre "o motor desenhou assim" e
 * "o Lab arrumou para caber".
 *
 * # O defeito que ele repara, medido
 *
 * O motor do Testfit monta o traçado num sistema girado e depois desgira; os
 * eixos das vias nascem varrendo a **caixa envolvente** da gleba girada e
 * **não são aparados pelo perímetro**. O resultado, medido no LAB-07:
 *
 * | gleba | vias | vias com ponta fora | comprimento fora |
 * |---|---|---|---|
 * | `ensaio-47ha` | 45 | **45 (todas)** | 7 971 m de 31 118 m (25,6 %) |
 * | `geo-antonina` | 160 | **160 (todas)** | 83 097 m de 208 322 m (39,9 %) |
 *
 * O esquema do contrato recusa o arquivo inteiro por isso — *"45 peça(s) do
 * parcelamento saem da gleba — a pior é a via V1, a 69,11 m para fora da
 * divisa"* — e a recusa é de FORMATO, antes de qualquer julgamento. Sem aparo,
 * **nenhuma variante chega ao Validator**, e o LAB-07 não mede nada.
 *
 * Os lotes, as quadras e as áreas especiais **não** são o problema: o esquema
 * contou exatamente 45 peças, que são as 45 vias. Quadra fora da divisa é a
 * exceção declarada do contrato (vira aviso, não recusa).
 *
 * # O que ele apara, e o que ele recusa aparar
 *
 * - **Vias: sim.** Um eixo é um segmento; a parte dele que cai fora da gleba é
 *   descartada e a parte de dentro fica. Nada é inventado — só se tira.
 * - **Lote: nunca.** Aparar um lote mudaria a área e a testada dele, que são
 *   exatamente os números que o Validator vai medir. Um lote aparado passaria
 *   numa régua que o lote original reprova, e o relatório mentiria.
 * - **Área especial e quadra: nunca**, pela mesma razão.
 *
 * # Quem tem de consertar isto de verdade
 *
 * O motor, não o Lab. O aparo está na lista para o T02 do Testfit, no relatório:
 * a rede viária tem de nascer aparada pelo perímetro, porque uma via que sai da
 * gleba não é só um problema de contrato — é asfalto orçado em terra que não é
 * do empreendimento.
 */
import type { PontoV1, SaidaV1, ViaV1 } from "./contrato-v1.ts";

/** O que o aparo fez, para o relatório poder dizer o tamanho do conserto. */
export interface ResultadoAparo {
  saida: SaidaV1;
  aparou: boolean;
  viasOriginais: number;
  viasRestantes: number;
  /** Vias descartadas por caírem inteiramente fora da gleba. */
  viasDescartadas: number;
  comprimentoOriginal_m: number;
  comprimentoAparado_m: number;
}

const dist = (a: PontoV1, b: PontoV1) => Math.hypot(b.x - a.x, b.y - a.y);

/**
 * Ponto dentro do anel, por cruzamentos de raio.
 *
 * A folga de 5 cm é a mesma tolerância que o contrato declara para a conferência
 * de divisa. Sem ela, um vértice exatamente sobre a divisa decidiria por
 * arredondamento de ponto flutuante.
 */
function dentro(p: PontoV1, anel: PontoV1[]): boolean {
  let d = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const a = anel[i]!;
    const b = anel[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) d = !d;
  }
  return d;
}

/** A folga do contrato: 5 cm, a mesma do invariante interno do Generate. */
const FOLGA_M = 0.05;

/**
 * Recorta o segmento `a→b` pelo anel, devolvendo o maior pedaço contínuo dentro.
 *
 * A busca é por amostragem e não por interseção analítica, e isso é escolha: o
 * anel da gleba é côncavo (as duas glebas-padrão são), um segmento pode entrar e
 * sair várias vezes, e a interseção analítica exigiria ordenar os cruzamentos e
 * decidir paridade — mais código e mais modos de falhar para um resultado que a
 * amostragem dá com precisão de centímetro.
 *
 * Fica o **maior** trecho contínuo, não a soma deles: um eixo de via é uma peça
 * só, e devolver dois pedaços do mesmo eixo inventaria uma via que o motor não
 * desenhou.
 */
function recortarSegmento(
  a: PontoV1,
  b: PontoV1,
  anel: PontoV1[],
  passo = 0.5,
): [PontoV1, PontoV1] | null {
  const comprimento = dist(a, b);
  if (comprimento < 1e-9) return dentro(a, anel) ? [a, b] : null;

  const n = Math.max(2, Math.ceil(comprimento / passo));
  const em = (t: number): PontoV1 => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

  let melhorInicio = -1;
  let melhorFim = -1;
  let inicio = -1;
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    if (dentro(em(t), anel)) {
      if (inicio < 0) inicio = k;
      if (melhorInicio < 0 || k - inicio > melhorFim - melhorInicio) {
        melhorInicio = inicio;
        melhorFim = k;
      }
    } else {
      inicio = -1;
    }
  }
  if (melhorInicio < 0 || melhorFim <= melhorInicio) return null;

  // Encolhe meia amostra em cada ponta e mais a folga do contrato: a última
  // amostra de dentro ainda pode estar a até `passo` da divisa, e sobrar do lado
  // de fora reprovaria de novo.
  const recuo = (passo / 2 + FOLGA_M) / comprimento;
  const t0 = Math.min(1, melhorInicio / n + recuo);
  const t1 = Math.max(0, melhorFim / n - recuo);
  if (t1 <= t0) return null;

  const p0 = em(t0);
  const p1 = em(t1);
  return dist(p0, p1) < 1 ? null : [p0, p1];
}

/**
 * Apara os eixos viários pelo perímetro da gleba.
 *
 * Só as vias são tocadas. Lote, quadra e área especial saem exatamente como o
 * motor os desenhou — ver o cabeçalho.
 */
export function apararVias(saida: SaidaV1, anelDaGleba: PontoV1[]): ResultadoAparo {
  const comprimentoDe = (vias: ViaV1[]) =>
    vias.reduce((s, v) => {
      let d = 0;
      for (let i = 1; i < v.pontos.length; i++) d += dist(v.pontos[i - 1]!, v.pontos[i]!);
      return s + d;
    }, 0);

  const comprimentoOriginal_m = comprimentoDe(saida.vias);
  const vias: ViaV1[] = [];

  for (const v of saida.vias) {
    const a = v.pontos[0];
    const b = v.pontos[v.pontos.length - 1];
    if (!a || !b) continue;
    const recorte = recortarSegmento(a, b, anelDaGleba);
    if (recorte) vias.push({ ...v, pontos: [recorte[0], recorte[1]] });
  }

  return {
    saida: { ...saida, vias },
    aparou: vias.length !== saida.vias.length || comprimentoDe(vias) < comprimentoOriginal_m - 1,
    viasOriginais: saida.vias.length,
    viasRestantes: vias.length,
    viasDescartadas: saida.vias.length - vias.length,
    comprimentoOriginal_m,
    comprimentoAparado_m: comprimentoDe(vias),
  };
}
