/**
 * O BLOCO DE INDICADORES DE TERRENO — para comparar planos e estimar
 * terraplenagem. (LAB-24)
 *
 * # Os dois limites, e eles NÃO têm a mesma força
 *
 * O Jonny respondeu a pergunta que a D91 deixou aberta, e a resposta tem duas
 * metades que não se misturam:
 *
 * | o quê | limite | força |
 * |---|---|---|
 * | **LOTE** | **30 %** de declividade do terreno | **limite legal** (Lei 6.766/1979) — **reprova** |
 * | **RUA** | **15 %** de rampa | **o número que ele usa na prática** — **só avisa** |
 *
 * **Por que a rua só avisa, nas palavras dele:** *"trecho acima pode ser
 * resolvido com terraplenagem ou com mudança de traçado, e isso é decisão de
 * projeto com custo, que o motor não toma"*. Então aqui **não existe "passa" ou
 * "não passa" para via** — existe quantidade, para quem decide pôr preço nela.
 *
 * **No lote é diferente:** os 30 % são lei, e lote acima disso **reprova**.
 *
 * # Para que este bloco serve
 *
 * Duas coisas, e nenhuma é dar nota:
 *
 * 1. **comparar planos** — quatro motores no mesmo terreno, e quanto cada um
 *    deixa de rua e de lote em declive;
 * 2. **estimar terraplenagem** — metros e metros quadrados são o que vira
 *    volume de corte e aterro no orçamento.
 *
 * # O que ele NÃO faz
 *
 * Não calcula volume de corte e aterro: isso pede o greide projetado, que
 * nenhum motor da família entrega. O que sai daqui é a **área e o comprimento
 * sujeitos a terraplenagem**, que é a entrada do cálculo, não o resultado.
 */
import { cotaEm, type MapaDeAlturas } from "@symbios/alturas.ts";

import { areaComSinal, type P } from "./motores/comum.ts";

/** O limite do LOTE: declividade do terreno, em porcento. **Lei — reprova.** */
export const LIMITE_DO_LOTE_PCT = 30;

/** O limite da RUA: rampa, em porcento. **Prática do Jonny — só avisa.** */
export const LIMITE_DA_RUA_PCT = 15;

/** A fonte de cada limite, para sair junto do número e nunca se perder. */
export const FONTE_DOS_LIMITES = {
  lote: "Lei 6.766/1979, art. 3º, § único, III — confirmado pelo Jonny em 03/10/2026 como limite do LOTE",
  rua: "prática do Jonny, confirmada em 03/10/2026 — é AVISO, não reprovação: o trecho acima se resolve com terraplenagem ou mudança de traçado, e isso é decisão de projeto com custo",
} as const;

/** Onde está o pior caso, para quem for olhar o desenho. */
export interface OndeEstaOPior {
  /** O id da via ou do lote, como o motor o nomeou. */
  id: string;
  /** A declividade ou rampa dele, em porcento. */
  valor_pct: number;
  /** Um ponto para procurar no desenho: meio do trecho, ou centro do lote. */
  onde: P;
}

/** O bloco, igual para os quatro motores. */
export interface IndicadoresDeTerreno {
  medido: boolean;
  porQueNaoMedido: string | null;

  /** ── A RUA: aviso, nunca reprovação ───────────────────────────────── */
  via: {
    comprimentoTotal_m: number;
    /** Metros lineares de eixo com rampa acima do limite da rua. */
    comprimentoAcimaDoLimite_m: number;
    pctDoComprimento: number;
    /** Área da caixa da via, em m². É o que vira terraplenagem. */
    areaTotal_m2: number;
    areaAcimaDoLimite_m2: number;
    pctDaArea: number;
    pior: OndeEstaOPior | null;
  } | null;

  /** ── O LOTE: os 30 % são lei, e reprovam ──────────────────────────── */
  lote: {
    lotes: number;
    areaTotal_m2: number;
    /** Área de lote sobre terreno com declividade acima do limite legal. */
    areaAcimaDoLimite_m2: number;
    pctDaArea: number;
    /** Quantos lotes têm ALGUMA parte acima do limite. */
    lotesComParteAcima: number;
    /** Quantos lotes estão acima do limite na MAIOR PARTE da área. */
    lotesPrincipalmenteAcima: number;
    /** **Reprova** quando há lote acima do limite legal. */
    reprovaPelaLei: boolean;
    pior: OndeEstaOPior | null;
  } | null;
}

/** O centro de massa de um anel, para localizar o lote no desenho. */
function centro(anel: P[]): P {
  let x = 0;
  let y = 0;
  for (const p of anel) {
    x += p.x;
    y += p.y;
  }
  return { x: x / anel.length, y: y / anel.length };
}

/** Ponto dentro de um anel, por cruzamentos de raio. */
function dentro(p: P, anel: P[]): boolean {
  let d = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const a = anel[i]!;
    const b = anel[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) d = !d;
  }
  return d;
}

/**
 * A declividade do terreno num ponto, em porcento — pelo gradiente do mapa.
 *
 * Mede nas **duas direções**, com diferença centrada de uma célula para cada
 * lado, e devolve o módulo do gradiente. Medir só em x daria zero numa encosta
 * que desce em y, e encosta não tem direção preferida.
 */
export function declividadeEm(mapa: MapaDeAlturas, p: P): number | null {
  const h = mapa.celula_m;
  const cx1 = cotaEm(mapa, { x: p.x - h, y: p.y });
  const cx2 = cotaEm(mapa, { x: p.x + h, y: p.y });
  const cy1 = cotaEm(mapa, { x: p.x, y: p.y - h });
  const cy2 = cotaEm(mapa, { x: p.x, y: p.y + h });
  if (cx1 == null || cx2 == null || cy1 == null || cy2 == null) return null;
  const gx = (cx2 - cx1) / (2 * h);
  const gy = (cy2 - cy1) / (2 * h);
  return Math.hypot(gx, gy) * 100;
}

/**
 * A fração de um lote que está sobre terreno acima do limite.
 *
 * O lote é varrido numa grade do tamanho da célula do mapa. **Não dá para ver
 * detalhe menor que a célula** — a mesma ressalva da régua de rampa (D93), e
 * pela mesma razão: o `cotaEm` não interpola.
 */
export function fracaoDoLoteAcima(
  anel: P[],
  mapa: MapaDeAlturas,
  limite_pct: number,
): { fracao: number; piorDeclividade_pct: number } | null {
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
  const passo = mapa.celula_m;
  let dentroDoLote = 0;
  let acima = 0;
  let pior = 0;
  for (let y = y0 + passo / 2; y <= y1; y += passo) {
    for (let x = x0 + passo / 2; x <= x1; x += passo) {
      const p = { x, y };
      if (!dentro(p, anel)) continue;
      const d = declividadeEm(mapa, p);
      if (d == null) continue;
      dentroDoLote++;
      if (d > pior) pior = d;
      if (d > limite_pct) acima++;
    }
  }
  // Lote menor que a célula não tem amostra: cai no centro, que é a melhor
  // aproximação honesta — e sai declarado por `amostras`.
  if (dentroDoLote === 0) {
    const d = declividadeEm(mapa, centro(anel));
    if (d == null) return null;
    return { fracao: d > limite_pct ? 1 : 0, piorDeclividade_pct: d };
  }
  return { fracao: acima / dentroDoLote, piorDeclividade_pct: pior };
}

/** Mede o bloco inteiro. */
export function indicadoresDeTerreno(
  vias: { id: string; pontos: P[]; largura_m: number }[],
  lotes: { id: string; pontos: P[] }[],
  mapa: MapaDeAlturas | null,
  passoDaVia_m = 10,
): IndicadoresDeTerreno {
  if (!mapa) {
    return {
      medido: false,
      porQueNaoMedido: "a gleba não tem duas cotas de relevo: não há declividade para medir",
      via: null,
      lote: null,
    };
  }

  const passo = Math.max(passoDaVia_m, mapa.celula_m);

  // ── a rua ───────────────────────────────────────────────────────────────
  let compTotal = 0;
  let compAcima = 0;
  let areaViaTotal = 0;
  let areaViaAcima = 0;
  let piorVia: OndeEstaOPior | null = null;

  for (const via of vias) {
    for (let i = 1; i < via.pontos.length; i++) {
      const a = via.pontos[i - 1]!;
      const b = via.pontos[i]!;
      const comp = Math.hypot(b.x - a.x, b.y - a.y);
      if (comp < 1e-9) continue;
      const n = Math.max(1, Math.round(comp / passo));
      for (let k = 0; k < n; k++) {
        const p0 = { x: a.x + (b.x - a.x) * (k / n), y: a.y + (b.y - a.y) * (k / n) };
        const p1 = { x: a.x + (b.x - a.x) * ((k + 1) / n), y: a.y + (b.y - a.y) * ((k + 1) / n) };
        const d = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        if (d < mapa.celula_m / 2) continue;
        const ca = cotaEm(mapa, p0);
        const cb = cotaEm(mapa, p1);
        if (ca == null || cb == null) continue;
        const rampa = (Math.abs(cb - ca) / d) * 100;
        compTotal += d;
        areaViaTotal += d * via.largura_m;
        if (rampa > LIMITE_DA_RUA_PCT) {
          compAcima += d;
          areaViaAcima += d * via.largura_m;
        }
        if (!piorVia || rampa > piorVia.valor_pct) {
          piorVia = {
            id: via.id,
            valor_pct: Number(rampa.toFixed(2)),
            onde: { x: Number(((p0.x + p1.x) / 2).toFixed(2)), y: Number(((p0.y + p1.y) / 2).toFixed(2)) },
          };
        }
      }
    }
  }

  // ── o lote ──────────────────────────────────────────────────────────────
  let areaLoteTotal = 0;
  let areaLoteAcima = 0;
  let comParte = 0;
  let principalmente = 0;
  let piorLote: OndeEstaOPior | null = null;

  for (const lote of lotes) {
    const area = Math.abs(areaComSinal(lote.pontos));
    if (!(area > 0)) continue;
    areaLoteTotal += area;
    const m = fracaoDoLoteAcima(lote.pontos, mapa, LIMITE_DO_LOTE_PCT);
    if (!m) continue;
    areaLoteAcima += area * m.fracao;
    if (m.fracao > 0) comParte++;
    if (m.fracao > 0.5) principalmente++;
    if (!piorLote || m.piorDeclividade_pct > piorLote.valor_pct) {
      const c = centro(lote.pontos);
      piorLote = {
        id: lote.id,
        valor_pct: Number(m.piorDeclividade_pct.toFixed(2)),
        onde: { x: Number(c.x.toFixed(2)), y: Number(c.y.toFixed(2)) },
      };
    }
  }

  const pc = (a: number, b: number) => (b > 0 ? Number(((100 * a) / b).toFixed(2)) : 0);
  const n2 = (v: number) => Number(v.toFixed(2));

  return {
    medido: true,
    porQueNaoMedido: null,
    via:
      compTotal > 0
        ? {
            comprimentoTotal_m: n2(compTotal),
            comprimentoAcimaDoLimite_m: n2(compAcima),
            pctDoComprimento: pc(compAcima, compTotal),
            areaTotal_m2: n2(areaViaTotal),
            areaAcimaDoLimite_m2: n2(areaViaAcima),
            pctDaArea: pc(areaViaAcima, areaViaTotal),
            pior: piorVia,
          }
        : null,
    lote:
      lotes.length > 0
        ? {
            lotes: lotes.length,
            areaTotal_m2: n2(areaLoteTotal),
            areaAcimaDoLimite_m2: n2(areaLoteAcima),
            pctDaArea: pc(areaLoteAcima, areaLoteTotal),
            lotesComParteAcima: comParte,
            lotesPrincipalmenteAcima: principalmente,
            // Os 30 % são LEI: lote acima disso reprova. É a única linha deste
            // bloco que dá veredito, e dá porque o Jonny disse que dá.
            reprovaPelaLei: comParte > 0,
            pior: piorLote,
          }
        : null,
  };
}
