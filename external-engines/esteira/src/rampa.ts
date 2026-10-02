/**
 * A RÉGUA DE RAMPA — trecho por trecho, e cruzamento por cruzamento. (LAB-21)
 *
 * # Por que ela existe, e por que mede em vez de ler
 *
 * O LAB-18 pôs o pico de rampa no contrato e mediu o tamanho do problema: em
 * `completo`, o Symbios tem média de **24,23 %** e pico de **161,38 %** — a
 * média escondia o pico por um fator de **6,7×**.
 *
 * Mas o pico só existe para **um** dos quatro motores. As duas candidatas do
 * Generate trazem o campo `rampaMaxima_pct` e o deixam `null`; o Laboratório de
 * Parcelamento ainda escreve saída v1. Uma tabela de rampa com três colunas
 * vazias não mede nada.
 *
 * **Então o Lab mede por conta própria.** O relevo chega na ENTRADA, o
 * `montarAlturas` o transforma em mapa de cotas, e o eixo de cada via é
 * amostrado sobre ele. Isso vale para os quatro motores, inclusive os que não
 * dizem nada.
 *
 * # A distinção que NÃO pode sumir
 *
 * | quem mede | o que significa |
 * |---|---|
 * | o **motor**, em `vias[].rampaMaxima_pct` | *"eu calculei o greide e ele é este"* |
 * | o **Lab**, aqui | *"passei o eixo dele pelo relevo da gleba e deu isto"* |
 *
 * São respostas diferentes à mesma pergunta, e a segunda **não substitui** a
 * primeira: um motor que não calcula greide pode ter traçado uma rua que o
 * relevo reprova **sem saber**. É justamente isso que esta régua torna visível —
 * e é por isso que as duas saem lado a lado, nunca somadas.
 *
 * # Os cortes, e por que nenhum deles é "o limite legal"
 *
 * **O Lab não tem limite legal de rampa de VIA, e não o inventa** (CLAUDE.md
 * §4). Procurado na família antes de escrever isto: o `normas/br.ts` do Generate
 * traz **declividade máxima parcelável do TERRENO — 30 %**, da Lei 6.766/1979,
 * art. 3º, § único, III, e as faixas de uso restrito **em grau**. Nenhum limite
 * de **greide de rua** existe em lugar nenhum da família.
 *
 * **E as duas coisas não são a mesma.** Uma rua pode ser cortada numa encosta de
 * 40 % e ter greide de 8 %; o terreno é um número, o greide é outro. O próprio
 * comentário da norma avisa que misturar as unidades *"é erro silencioso"*.
 *
 * Então os cortes abaixo são **cortes de leitura**, para a distribuição ficar
 * visível — e o de 30 % sai com o significado dele dito, que é do terreno.
 * **Qual é a rampa máxima de via** é item do Jonny.
 *
 * # Dois defeitos que a primeira passada teve, e o que eles ensinam
 *
 * **1 · A régua media a discretização do motor, não a rua — e dava 1053 %.**
 * Amostrar **dentro de cada segmento** parece natural e está errado, porque a
 * densidade de vértices é **escolha de quem desenhou**, não propriedade da rua.
 * Medido: as vias do Symbios em `completo` têm **5 353 de 7 436 segmentos abaixo
 * de 1 m**, mediana de **0,47 m**, e o trecho culpado tinha **15 cm**. Dividir o
 * degrau do mapa de cotas por 15 cm dá 1053 %.
 *
 * Mais medida, para não ficar no palpite: o mapa de `completo` tem célula de 5 m
 * e **degrau máximo de 3,666 m entre células vizinhas** — por construção, nada
 * acima de **73,3 %** pode sair dele numa amostra de 5 m. Qualquer número acima
 * disso era aritmética.
 *
 * O conserto: a régua **caminha a via inteira por comprimento de arco**, em
 * passos iguais, atravessando vértice sem ligar para ele. É a mesma lição do
 * LAB-17, onde olhar vértice em vez de amostrar punha três de quatro vias
 * desenhadas no balde errado.
 *
 * **2 · O passo não desce abaixo da célula do mapa.** O `cotaEm` é consulta à
 * célula mais próxima, sem interpolar: pedir detalhe menor que a célula é
 * inventar resolução. O passo é `max(passo pedido, célula do mapa)`, e **esta
 * régua não vê detalhe mais fino que isso** — dito, não suposto.
 *
 * **3 · Cruzamento não é ponta de via.** A primeira passada procurava nós nas
 * PONTAS, e deu **zero cruzamentos** numa malha ortogonal de quinze vias — numa
 * grade as ruas se cruzam no MEIO. Agora o cruzamento é **interseção de eixos**,
 * segmento contra segmento.
 */
import { cotaEm, montarAlturas, type MapaDeAlturas } from "@symbios/alturas.ts";
import type { Terreno } from "@symbios/contrato.ts";

import type { P } from "./motores/comum.ts";

/**
 * Os cortes em que a contagem é publicada, em porcento.
 *
 * **Nenhum deles é decidido.** São cortes de leitura; ver o cabeçalho.
 */
export const CORTES_DE_RAMPA = [8, 15, 20, 30] as const;

/**
 * O único corte da lista com fonte legal — **e é do TERRENO, não da rua.**
 *
 * `normas/br.ts` do Generate: *"Não se parcela terreno com declividade acima de
 * 30% sem exigências específicas"*, Lei 6.766/1979, art. 3º, § único, III.
 * Aparece aqui porque é o número que a família tem escrito, e sai sempre com
 * esta ressalva ao lado.
 */
export const CORTE_DA_LEI_6766_TERRENO_PCT = 30;

/**
 * De quanto em quanto o eixo é amostrado sobre o relevo.
 *
 * O passo efetivo é `max(este, célula do mapa)` — ver o cabeçalho, defeito 2.
 */
export const PASSO_DE_AMOSTRA_M = 10;

/** Dois cruzamentos mais perto que isto são o mesmo cruzamento. */
export const TOL_DO_NO_M = 2;

/** Um ponto do caminho, com a distância acumulada desde o começo da via. */
interface PassoNaVia {
  p: P;
  s: number;
}

/**
 * Caminha a polilinha e devolve um ponto a cada `passo` metros.
 *
 * **Atravessa vértice sem parar nele**, de propósito: vértice é onde o motor
 * decidiu pôr um ponto, e a rampa da rua não depende dessa escolha. A última
 * amostra é a ponta da via, mesmo que o resto seja menor que um passo — e ela
 * entra com o comprimento que tem, nunca dividindo por quase-zero.
 */
export function caminhar(pontos: P[], passo: number): PassoNaVia[] {
  if (pontos.length < 2 || passo <= 0) return [];
  const saida: PassoNaVia[] = [{ p: pontos[0]!, s: 0 }];
  let acumulado = 0;
  let proximo = passo;
  for (let i = 1; i < pontos.length; i++) {
    const a = pontos[i - 1]!;
    const b = pontos[i]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d < 1e-9) continue;
    while (proximo <= acumulado + d) {
      const t = (proximo - acumulado) / d;
      saida.push({ p: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, s: proximo });
      proximo += passo;
    }
    acumulado += d;
  }
  const ultimo = saida[saida.length - 1]!;
  if (acumulado - ultimo.s > 1e-6) {
    saida.push({ p: pontos[pontos.length - 1]!, s: acumulado });
  }
  return saida;
}

/** Um trecho de via, com a rampa que o relevo lhe dá. */
export interface TrechoComRampa {
  viaId: string;
  comprimento_m: number;
  /** A rampa do trecho, em porcento. Sempre positiva — subida e descida contam igual. */
  rampa_pct: number;
}

/** Um cruzamento: onde duas ou mais vias se encontram. */
export interface CruzamentoComRampa {
  /** As vias que chegam nele. */
  vias: string[];
  /** A pior rampa entre os trechos que chegam ao nó. */
  piorRampa_pct: number;
  onde: P;
}

/** O que a régua devolve para um conjunto de vias. */
export interface PerfilDeRampa {
  /** `null` quando não há relevo para medir — nunca zero (D23). */
  medida: boolean;
  porQueNaoMedida: string | null;
  trechos: number | null;
  comprimentoTotal_m: number | null;
  /** Ponderada pelo comprimento: é a rampa que a rua tem, não a média das contas. */
  rampaMediaPonderada_pct: number | null;
  rampaMediana_pct: number | null;
  rampaPior_pct: number | null;
  /** Quantos TRECHOS passam de cada corte. A chave é o corte, em porcento. */
  trechosAcimaDe: Record<string, number> | null;
  /** Quantos METROS de via passam de cada corte — é o que se paga em obra. */
  metrosAcimaDe: Record<string, number> | null;
  cruzamentos: number | null;
  /** Quantos CRUZAMENTOS têm algum trecho acima de cada corte. */
  cruzamentosAcimaDe: Record<string, number> | null;
  /** O pior cruzamento, para quem quiser ir olhar. */
  piorCruzamento: CruzamentoComRampa | null;
}

/**
 * Onde dois segmentos se cruzam, ou `null`. Toque de ponta conta.
 *
 * É a interseção de verdade, e não "as pontas estão perto": numa malha
 * ortogonal as ruas se cruzam no MEIO, e procurar só nas pontas devolve zero
 * cruzamentos — foi o que a primeira passada do LAB-21 devolveu.
 */
function cruzam(a1: P, a2: P, b1: P, b2: P): P | null {
  const rx = a2.x - a1.x;
  const ry = a2.y - a1.y;
  const sx = b2.x - b1.x;
  const sy = b2.y - b1.y;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-12) return null; // paralelos ou degenerados
  const t = ((b1.x - a1.x) * sy - (b1.y - a1.y) * sx) / den;
  const u = ((b1.x - a1.x) * ry - (b1.y - a1.y) * rx) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: a1.x + rx * t, y: a1.y + ry * t };
}

/** O mapa de cotas da gleba, ou `null` quando ela não tem relevo. */
export function mapaDaGleba(terreno: Terreno, passo_m = 5): MapaDeAlturas | null {
  try {
    return montarAlturas(terreno, passo_m);
  } catch {
    // `montarAlturas` estoura, com mensagem legível, quando não há duas cotas.
    // Aqui isso não é erro: é gleba plana ou sem levantamento, e a resposta é
    // "não medida" — ver `PerfilDeRampa.porQueNaoMedida`.
    return null;
  }
}

/** A rampa de um segmento, em porcento. `null` quando falta cota na ponta. */
function rampaDoSegmento(mapa: MapaDeAlturas, a: P, b: P): { d: number; rampa: number } | null {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  if (d < 1e-6) return null;
  const ca = cotaEm(mapa, a);
  const cb = cotaEm(mapa, b);
  if (ca == null || cb == null) return null;
  return { d, rampa: (Math.abs(cb - ca) / d) * 100 };
}

/**
 * Mede a rampa de um conjunto de vias contra o relevo da gleba.
 *
 * O eixo é **amostrado de `PASSO_DE_AMOSTRA_M` em `PASSO_DE_AMOSTRA_M`**, e não
 * vértice a vértice. A razão é a mesma do LAB-17: vértice é onde o motor decidiu
 * pôr um ponto, e dois vértices a 300 m de distância escondem o morro no meio.
 * O passo fixo mede a rua, não a escolha de quem a desenhou.
 */
export function perfilDeRampa(
  vias: { id: string; pontos: P[] }[],
  mapa: MapaDeAlturas | null,
): PerfilDeRampa {
  const vazio: PerfilDeRampa = {
    medida: false,
    porQueNaoMedida: null,
    trechos: null, comprimentoTotal_m: null,
    rampaMediaPonderada_pct: null, rampaMediana_pct: null, rampaPior_pct: null,
    trechosAcimaDe: null, metrosAcimaDe: null,
    cruzamentos: null, cruzamentosAcimaDe: null, piorCruzamento: null,
  };

  if (!mapa) {
    return { ...vazio, porQueNaoMedida: "a gleba não tem duas cotas de relevo: não há gradiente para medir" };
  }
  if (vias.length === 0) {
    return { ...vazio, porQueNaoMedida: "o motor não entregou via nenhuma" };
  }

  // O passo não desce abaixo da célula do mapa: o `cotaEm` não interpola, e
  // pedir detalhe menor que a célula é inventar resolução.
  const passo = Math.max(PASSO_DE_AMOSTRA_M, mapa.celula_m);

  const trechos: TrechoComRampa[] = [];
  /** A pior rampa de cada via, para pendurar no cruzamento. */
  const piorDaVia = new Map<string, number>();

  for (const via of vias) {
    // A via é caminhada por comprimento de arco, atravessando os vértices: a
    // densidade deles é escolha do motor, não propriedade da rua. Ver o
    // cabeçalho, defeito 1.
    const marcos = caminhar(via.pontos, passo);
    for (let i = 1; i < marcos.length; i++) {
      const a = marcos[i - 1]!;
      const b = marcos[i]!;
      // O trecho final pode ser curto; só entra se tiver meia célula de mapa,
      // abaixo disso a rampa é a resolução da grade e não a da rua.
      if (b.s - a.s < mapa.celula_m / 2) continue;
      const m = rampaDoSegmento(mapa, a.p, b.p);
      if (!m) continue;
      trechos.push({ viaId: via.id, comprimento_m: b.s - a.s, rampa_pct: m.rampa });
      if (m.rampa > (piorDaVia.get(via.id) ?? 0)) piorDaVia.set(via.id, m.rampa);
    }
  }

  if (trechos.length === 0) {
    return { ...vazio, porQueNaoMedida: "o eixo das vias caiu todo fora do mapa de cotas" };
  }

  // ── os cruzamentos: INTERSEÇÃO de eixos, não encontro de pontas ─────────
  const achados = new Map<string, { vias: Set<string>; pior: number; onde: P }>();
  const chave = (p: P) =>
    `${Math.round(p.x / TOL_DO_NO_M)}:${Math.round(p.y / TOL_DO_NO_M)}`;
  for (let i = 0; i < vias.length; i++) {
    for (let j = i + 1; j < vias.length; j++) {
      const A = vias[i]!;
      const B = vias[j]!;
      for (let a = 1; a < A.pontos.length; a++) {
        for (let b = 1; b < B.pontos.length; b++) {
          const x = cruzam(A.pontos[a - 1]!, A.pontos[a]!, B.pontos[b - 1]!, B.pontos[b]!);
          if (!x) continue;
          const k = chave(x);
          const achado = achados.get(k) ?? { vias: new Set<string>(), pior: 0, onde: x };
          achado.vias.add(A.id);
          achado.vias.add(B.id);
          achado.pior = Math.max(achado.pior, piorDaVia.get(A.id) ?? 0, piorDaVia.get(B.id) ?? 0);
          achados.set(k, achado);
        }
      }
    }
  }
  const cruzamentos: CruzamentoComRampa[] = [...achados.values()].map((n) => ({
    vias: [...n.vias].sort(),
    piorRampa_pct: n.pior,
    onde: n.onde,
  }));

  const comprimento = trechos.reduce((s, t) => s + t.comprimento_m, 0);
  const ordenadas = trechos.map((t) => t.rampa_pct).sort((a, b) => a - b);
  const trechosAcimaDe: Record<string, number> = {};
  const metrosAcimaDe: Record<string, number> = {};
  const cruzamentosAcimaDe: Record<string, number> = {};
  for (const c of CORTES_DE_RAMPA) {
    trechosAcimaDe[String(c)] = trechos.filter((t) => t.rampa_pct > c).length;
    metrosAcimaDe[String(c)] = Number(
      trechos.filter((t) => t.rampa_pct > c).reduce((s, t) => s + t.comprimento_m, 0).toFixed(2),
    );
    cruzamentosAcimaDe[String(c)] = cruzamentos.filter((x) => x.piorRampa_pct > c).length;
  }

  return {
    medida: true,
    porQueNaoMedida: null,
    trechos: trechos.length,
    comprimentoTotal_m: Number(comprimento.toFixed(2)),
    // Ponderada pelo comprimento, pela mesma razão que o contrato dá: a média
    // aritmética descreve uma rua que não existe quando um trecho de 3 m a 20 %
    // entra com o mesmo peso de um de 300 m a 1 %.
    rampaMediaPonderada_pct: Number(
      (trechos.reduce((s, t) => s + t.rampa_pct * t.comprimento_m, 0) / comprimento).toFixed(2),
    ),
    rampaMediana_pct: Number((ordenadas[Math.floor(ordenadas.length / 2)] ?? 0).toFixed(2)),
    rampaPior_pct: Number((ordenadas[ordenadas.length - 1] ?? 0).toFixed(2)),
    trechosAcimaDe,
    metrosAcimaDe,
    cruzamentos: cruzamentos.length,
    cruzamentosAcimaDe,
    piorCruzamento:
      cruzamentos.length === 0
        ? null
        : cruzamentos.reduce((m, x) => (x.piorRampa_pct > m.piorRampa_pct ? x : m)),
  };
}
