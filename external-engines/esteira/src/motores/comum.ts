/**
 * A RÉGUA ÚNICA — o que se mede de qualquer motor, do mesmo jeito. (LAB-13)
 *
 * # Por que uma régua só, e por que ela é do Generate
 *
 * A comparação do LAB-13 só vale se os três motores forem medidos **com o mesmo
 * instrumento**. Medir um com a régua dele e outro com a minha produz tabela
 * bonita e conclusão falsa — e o CLAUDE.md §4 já proíbe a versão leve do
 * Validator justamente por isso (D20).
 *
 * O caminho é o mesmo para todos, sem exceção:
 *
 * ```text
 * motor → SAÍDA do contrato v1 → montarParcelamentoExterno → ResultadoMotor
 *                                       ↓            ↓             ↓
 *                                  Validator      Judge      medirSobras
 * ```
 *
 * Inclusive o motor **interno** do Generate passa pela porta externa: ele
 * produz `ResultadoMotor` direto, mas se eu o medisse por aí ele seria o único
 * dos três a não atravessar o contrato, e qualquer perda de tradução ficaria
 * invisível justamente no motor da casa. **Ele dá a volta inteira, como os
 * outros.**
 *
 * # As três medidas que não vêm prontas
 *
 * `medirSobras` e o Validator são do Generate. Três números o prompt pede e a
 * família não tem função para eles; cada um está definido aqui, com a razão:
 *
 * - **lote irregular** — a fórmula é a do próprio Generate
 *   (`gerar-v1.ts`: `irregularidade = 1 − área / áreaDaCaixa`), aplicada ao
 *   lote em vez da massa. O corte de 1 % **não é regra de urbanismo**: é a
 *   separação numérica entre "é um retângulo" e "não é". Um lote a 0,5 % é um
 *   retângulo com ruído de arredondamento; a 30 % é outra coisa;
 * - **aderência a via desenhada à mão** — a fração do comprimento da linha
 *   desenhada que tem **eixo de via gerada a menos de meia caixa**. Meia caixa
 *   porque é onde o meio-fio está (D52): mais perto que isso, a rua gerada
 *   **é** a rua desenhada;
 * - **determinismo** — a mesma entrada, duas vezes, comparando a SAÍDA inteira.
 *   Não a contagem de lotes: duas geometrias diferentes podem dar o mesmo
 *   número, e foi assim que a régua de determinismo errou no LAB-08.
 */
import {
  montarParcelamentoExterno,
  montarRelatorio,
} from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";
import { medirSobras } from "@generate/engine/sobras.ts";

import type { EntradaMinima } from "../gleba-v1.ts";

/** Um ponto do plano, em metros. */
export interface P {
  x: number;
  y: number;
}

/**
 * O que um motor entrega quando roda. É o mesmo para os três — e é o embrião
 * da porta única que o LAB-14 escreve.
 */
export interface Rodada {
  /** A SAÍDA no contrato de motor v1, como o motor a entregou. */
  saida: unknown;
  /** Tempo de parede do motor, em milissegundos. */
  ms: number;
  /** O que o motor **não soube fazer**, dito em português. Vazio = fez tudo. */
  naoSoubeFazer: string[];
  /** Rótulo da variante ou partido escolhido, quando o motor tem mais de um. */
  variante: string | null;
}

/** Área com sinal de um anel. */
export function areaComSinal(anel: P[]): number {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/**
 * A irregularidade de um polígono: `1 − área / área da caixa envolvente`.
 *
 * É a fórmula do próprio Generate (`gerar-v1.ts`), aqui aplicada ao lote. Zero
 * é retângulo perfeito alinhado aos eixos; perto de 1 é lasca.
 *
 * **Cuidado que a fórmula exige:** a caixa é alinhada aos eixos, então um lote
 * retangular **girado** mede irregular sem ser. É por isso que o LAB-13 publica
 * a distribuição inteira, e não só a contagem acima do corte: num motor que
 * gira o lote conforme a rua — e o do Generate gira —, a mediana sobe sem que
 * um lote sequer seja disforme.
 */
export function irregularidade(anel: P[]): number {
  if (anel.length < 3) return 1;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const p of anel) {
    if (p.x < x0) x0 = p.x;
    if (p.y < y0) y0 = p.y;
    if (p.x > x1) x1 = p.x;
    if (p.y > y1) y1 = p.y;
  }
  const caixa = (x1 - x0) * (y1 - y0);
  if (!(caixa > 0)) return 1;
  return Math.max(0, Math.min(1, 1 - Math.abs(areaComSinal(anel)) / caixa));
}

/**
 * A irregularidade contra a **caixa girada** — a mesma fórmula, sem o viés.
 *
 * # Por que ela precisou existir
 *
 * A fórmula do Generate usa a caixa alinhada aos eixos, e isso **pune quem gira
 * o lote pela rua**. Medido: na candidata `espinha`, que gira o lote conforme a
 * via que o serve, **754 de 776 lotes** saem "irregulares" pela caixa dos eixos,
 * com mediana **0,657** — e são retângulos. O número não estava errado; a
 * pergunta é que estava.
 *
 * Aqui a caixa é a **de menor área entre todas as orientações**, achada pelo
 * teorema de Freeman & Shapira (1975): a caixa mínima de um polígono convexo
 * tem um lado colinear com uma aresta do fecho convexo, então basta testar as
 * arestas. Retângulo girado dá **zero**, esteja em que ângulo estiver.
 *
 * As duas saem na tabela, de propósito: a dos eixos mantém a continuidade com
 * os números que o Generate já publicou; a girada é a que responde "o lote tem
 * forma boa?".
 */
export function irregularidadeGirada(anel: P[]): number {
  if (anel.length < 3) return 1;
  const area = Math.abs(areaComSinal(anel));
  if (!(area > 0)) return 1;

  const fecho = fechoConvexo(anel);
  if (fecho.length < 3) return 1;

  let melhor = Infinity;
  for (let i = 0; i < fecho.length; i++) {
    const a = fecho[i]!;
    const b = fecho[(i + 1) % fecho.length]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const n = Math.hypot(dx, dy);
    if (n < 1e-12) continue;
    const ux = dx / n;
    const uy = dy / n;
    let u0 = Infinity;
    let u1 = -Infinity;
    let v0 = Infinity;
    let v1 = -Infinity;
    for (const p of fecho) {
      const u = p.x * ux + p.y * uy;
      const v = -p.x * uy + p.y * ux;
      if (u < u0) u0 = u;
      if (u > u1) u1 = u;
      if (v < v0) v0 = v;
      if (v > v1) v1 = v;
    }
    const caixa = (u1 - u0) * (v1 - v0);
    if (caixa > 0 && caixa < melhor) melhor = caixa;
  }
  if (!Number.isFinite(melhor) || melhor <= 0) return 1;
  return Math.max(0, Math.min(1, 1 - area / melhor));
}

/** Fecho convexo pelo varredor de Andrew — determinístico, sem aleatório. */
function fechoConvexo(pts: P[]): P[] {
  const p = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  if (p.length < 3) return p;
  const cruz = (o: P, a: P, b: P) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const baixo: P[] = [];
  for (const q of p) {
    while (baixo.length >= 2 && cruz(baixo[baixo.length - 2]!, baixo[baixo.length - 1]!, q) <= 0) baixo.pop();
    baixo.push(q);
  }
  const alto: P[] = [];
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i]!;
    while (alto.length >= 2 && cruz(alto[alto.length - 2]!, alto[alto.length - 1]!, q) <= 0) alto.pop();
    alto.push(q);
  }
  baixo.pop();
  alto.pop();
  return [...baixo, ...alto];
}

/** Distância de um ponto a um segmento. */
export function distSeg(p: P, a: P, b: P): number {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const L = vx * vx + vy * vy;
  if (L < 1e-18) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / L));
  return Math.hypot(p.x - (a.x + vx * t), p.y - (a.y + vy * t));
}

/**
 * As linhas `via_existente` da ENTRADA, separadas em duas coisas diferentes.
 *
 * # A distinção que o contrato v1 NÃO faz, e que muda a pergunta
 *
 * O contrato tem um tipo só — `atracoes[].tipo = "via_existente"` — para duas
 * coisas que não se parecem:
 *
 * - **a via desenhada à mão**: uma rua que o urbanista traçou DENTRO da gleba e
 *   que o motor deve seguir. É a que o LAB-13 foi mandado medir;
 * - **a testada de frente**: a linha onde a gleba encosta numa rua que já
 *   existe, e que corre **sobre a divisa**, por fora. O motor não deve pôr rua
 *   em cima dela — deve pôr **lote de frente para ela**.
 *
 * Medido em `geo-antonina`, a única das cinco glebas com atração: a única linha
 * é *"Testada de frente L1"*, 180,2 m, com os **dois extremos a 0,00 m da
 * divisa**. É testada, não é via desenhada.
 *
 * Perguntar "o motor seguiu esta linha?" a uma testada de frente é perguntar
 * errado: o motor que puser rua exatamente sobre a divisa está **errado**, e
 * uma tabela que o premiasse por "aderência" estaria premiando o defeito.
 *
 * Por isso a separação é feita aqui, por medição e não por nome: a linha cujo
 * ponto médio está a menos de `TOL_DIVISA_M` da divisa é testada de frente.
 */
export const TOL_DIVISA_M = 1;

export interface LinhasDaEntrada {
  /** Rua traçada à mão DENTRO da gleba — o motor deve segui-la. */
  desenhadas: P[][];
  /** Linha sobre a divisa — o motor deve dar frente para ela, não rua. */
  testadasDeFrente: P[][];
}

export function linhasDaEntrada(entrada: EntradaMinima): LinhasDaEntrada {
  const anel = entrada.gleba.anel;
  const desenhadas: P[][] = [];
  const testadasDeFrente: P[][] = [];

  for (const a of entrada.atracoes ?? []) {
    const g = (a as { tipo?: string; geometria?: { tipo?: string; pontos?: P[] } }).geometria;
    const tipo = (a as { tipo?: string }).tipo;
    if (tipo !== "via_existente") continue;
    if (g?.tipo !== "linha" || !g.pontos || g.pontos.length < 2) continue;

    const pts = g.pontos;
    const distancias = pts.map((p) => {
      let d = Infinity;
      for (let i = 0; i < anel.length; i++) {
        d = Math.min(d, distSeg(p, anel[i]!, anel[(i + 1) % anel.length]!));
      }
      return d;
    });
    const mediana = [...distancias].sort((x, y) => x - y)[Math.floor(distancias.length / 2)] ?? 0;
    if (mediana <= TOL_DIVISA_M) testadasDeFrente.push(pts);
    else desenhadas.push(pts);
  }

  return { desenhadas, testadasDeFrente };
}

/** Só as vias desenhadas à mão — as que um motor deveria seguir. */
export function viasDesenhadas(entrada: EntradaMinima): P[][] {
  return linhasDaEntrada(entrada).desenhadas;
}

/**
 * Quanto da via desenhada à mão o motor de fato seguiu.
 *
 * Amostra a linha desenhada de metro em metro e pergunta, em cada ponto, se há
 * **eixo de via gerada a menos de meia caixa**. Devolve a fração do comprimento
 * que passou, de 0 a 1 — e `null` quando não há via desenhada nesta gleba, que
 * é o caso de quatro das cinco.
 *
 * **`null`, nunca zero** (D23): "não havia o que aderir" e "não aderiu a nada"
 * são respostas opostas, e um zero aqui leria como a segunda.
 */
export function aderenciaAViaDesenhada(
  entrada: EntradaMinima,
  vias: { pontos: P[]; largura_m: number }[],
): { fracao: number | null; linhas: number; comprimento_m: number; toleranciaMedia_m: number | null } {
  const linhas = viasDesenhadas(entrada);
  if (linhas.length === 0) {
    return { fracao: null, linhas: 0, comprimento_m: 0, toleranciaMedia_m: null };
  }

  const PASSO_M = 1;
  let dentro = 0;
  let total = 0;
  let comprimento = 0;
  let somaDaTolerancia = 0;
  let quantasToleranciasr = 0;

  for (const linha of linhas) {
    for (let i = 1; i < linha.length; i++) {
      const a = linha[i - 1]!;
      const b = linha[i]!;
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      comprimento += d;
      const n = Math.max(1, Math.ceil(d / PASSO_M));
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5) / n;
        const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        total++;
        let melhor = Infinity;
        let meiaCaixaDaMelhor = 0;
        for (const v of vias) {
          for (let j = 1; j < v.pontos.length; j++) {
            const dd = distSeg(p, v.pontos[j - 1]!, v.pontos[j]!);
            if (dd < melhor) {
              melhor = dd;
              meiaCaixaDaMelhor = (v.largura_m || 10) / 2;
            }
          }
        }
        somaDaTolerancia += meiaCaixaDaMelhor;
        quantasToleranciasr++;
        if (melhor <= meiaCaixaDaMelhor) dentro++;
      }
    }
  }

  return {
    fracao: total > 0 ? dentro / total : null,
    linhas: linhas.length,
    comprimento_m: comprimento,
    toleranciaMedia_m: quantasToleranciasr > 0 ? somaDaTolerancia / quantasToleranciasr : null,
  };
}

/**
 * Quantos lotes fazem frente para a testada de frente.
 *
 * É a pergunta CERTA para uma linha sobre a divisa — a errada é "o motor seguiu
 * esta linha?", que premiaria quem pusesse rua em cima dela.
 *
 * Um lote faz frente para a testada quando tem **aresta encostada nela**: dois
 * vértices consecutivos a menos de `TOL_FRENTE_M`. Um vértice só é um canto
 * que toca, e canto não é testada.
 */
export const TOL_FRENTE_M = 2;

export function lotesNaTestadaDeFrente(
  lotes: { pontos: P[] }[],
  testadas: P[][],
): { lotes: number; comprimentoDaTestada_m: number } | null {
  if (testadas.length === 0) return null;

  let comprimento = 0;
  for (const t of testadas) {
    for (let i = 1; i < t.length; i++) comprimento += Math.hypot(t[i]!.x - t[i - 1]!.x, t[i]!.y - t[i - 1]!.y);
  }

  const perto = (p: P) => {
    for (const t of testadas) {
      for (let i = 1; i < t.length; i++) {
        if (distSeg(p, t[i - 1]!, t[i]!) <= TOL_FRENTE_M) return true;
      }
    }
    return false;
  };

  let quantos = 0;
  for (const l of lotes) {
    const n = l.pontos.length;
    for (let i = 0; i < n; i++) {
      if (perto(l.pontos[i]!) && perto(l.pontos[(i + 1) % n]!)) {
        quantos++;
        break;
      }
    }
  }
  return { lotes: quantos, comprimentoDaTestada_m: comprimento };
}

/** O veredito completo de uma saída, pela régua do Generate. */
export interface Veredito {
  /** Erros do esquema. `null` quando o contrato aceitou. */
  recusa: string[] | null;
  lotes: number | null;
  areaPrivativa_m2: number | null;
  violacoes: number | null;
  porTipo: Record<string, number> | null;
  exemplos: unknown[];
  /** As sobras, pela `medirSobras` do Generate. `null` se o esquema recusou. */
  sobras: {
    passoMalha_m: number;
    areaSobra_m2: number;
    pecas: number;
    maiorPeca_m2: number | null;
    massa_m2: number;
    lote_m2: number;
    leito_m2: number;
  } | null;
  /**
   * A forma dos lotes, pelas DUAS réguas — a dos eixos, que é a do Generate, e
   * a da caixa girada, que não pune quem gira o lote pela rua.
   */
  forma: {
    lotes: number;
    /** Pela caixa alinhada aos eixos — a fórmula do Generate. */
    eixos: { naoRetangulares: number; mediana: number; p90: number; maxima: number };
    /** Pela caixa de menor área, em qualquer orientação. É a régua justa. */
    girada: { naoRetangulares: number; mediana: number; p90: number; maxima: number };
  } | null;
  /** Lotes de frente para a testada de frente. `null` quando não há testada. */
  frenteNaTestada: { lotes: number; comprimentoDaTestada_m: number } | null;
}

/** O corte que separa "é um retângulo" de "não é". Ver o cabeçalho. */
export const CORTE_DE_IRREGULARIDADE = 0.01;

/**
 * Julga uma saída com o Validator, o Judge e a `medirSobras` do Generate.
 *
 * Tudo o que não pôde ser medido sai `null` — nunca zero (D23). Um esquema
 * recusado devolve os erros e `null` em todo o resto: é a resposta honesta,
 * porque o Validator não chegou a rodar.
 */
export function julgar(saida: unknown, entrada: EntradaMinima): Veredito {
  const l = montarParcelamentoExterno(saida as never, {
    entrada: entrada as unknown as EntradaMotorV1,
  });
  if (!l.conferencia.valido || !l.externo) {
    return {
      recusa: l.conferencia.erros.slice(0, 3),
      lotes: null, areaPrivativa_m2: null, violacoes: null, porTipo: null, exemplos: [],
      sobras: null, forma: null, frenteNaTestada: null,
    };
  }

  const r = montarRelatorio(l.externo, null);
  const res = l.externo.resultado;

  const rel = medirSobras({
    massa: { poligono: res.massa.poligono },
    lotes: res.lotes,
    rede: res.rede,
    apps: res.apps,
    lazers: res.lazers,
    culDeSacs: res.culDeSacs,
  });

  const distribuicao = (f: (a: P[]) => number) => {
    const v = res.lotes.map((lo) => f(lo.pontos as P[])).sort((a, b) => a - b);
    const q = (x: number) => (v.length ? v[Math.min(v.length - 1, Math.floor(x * v.length))]! : 0);
    return {
      naoRetangulares: v.filter((i) => i > CORTE_DE_IRREGULARIDADE).length,
      mediana: q(0.5),
      p90: q(0.9),
      maxima: v[v.length - 1] ?? 0,
    };
  };

  return {
    recusa: null,
    lotes: r.judge.numLotes,
    areaPrivativa_m2: r.judge.areaPrivativa_m2 ?? 0,
    violacoes: r.validator.violacoes,
    porTipo: r.validator.porTipo,
    exemplos: (r.validator.exemplos ?? []).slice(0, 3),
    sobras: {
      passoMalha_m: rel.passoMalhaM,
      areaSobra_m2: rel.areaSobraTotalM2,
      pecas: rel.pecas.length,
      maiorPeca_m2: rel.pecas[0]?.areaM2 ?? null,
      massa_m2: rel.massaM2,
      lote_m2: rel.loteM2,
      leito_m2: rel.leitoM2,
    },
    forma: {
      lotes: res.lotes.length,
      eixos: distribuicao(irregularidade),
      girada: distribuicao(irregularidadeGirada),
    },
    frenteNaTestada: lotesNaTestadaDeFrente(
      res.lotes as { pontos: P[] }[],
      linhasDaEntrada(entrada).testadasDeFrente,
    ),
  };
}
