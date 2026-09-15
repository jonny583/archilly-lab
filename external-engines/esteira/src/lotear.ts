/**
 * LOTEAR — a quadra do Symbios vira lotes, pelo esqueleto reto. (LAB-04)
 *
 * # Por que o esqueleto reto, e não uma faixa qualquer
 *
 * Uma quadra faz frente para mais de uma rua. Se cada frente puxar uma faixa de
 * lotes para dentro sem saber das outras, as faixas se atravessam no miolo e o
 * Validator acusa sobreposição — que é o defeito mais grave que existe num
 * parcelamento.
 *
 * O esqueleto reto resolve isso de graça: ele parte a quadra em **uma face por
 * aresta**, e a face de uma aresta é exatamente a parte da quadra que está mais
 * perto dela do que de qualquer outra. Lotes plantados dentro da própria face
 * **não podem** invadir a face vizinha. O miolo se reparte sozinho, e em quadra
 * de canto reflexo ele se reparte certo — que é onde recuo ingênuo falha.
 *
 * # O meio-fio não é o eixo — e foi o Validator que ensinou
 *
 * A borda de uma quadra do Symbios **é o eixo da rua**, não o meio-fio: as
 * quadras são faces do grafo viário. A primeira versão plantou o lote encostado
 * nessa borda, e o Validator do Generate devolveu o retrato do erro:
 * **369 de 369 lotes com `via-sobre-lote`** e 310 sem frente — o leito da rua,
 * que tem `largura_m` de largura centrada no eixo, cobria metade de cada lote.
 *
 * É o mesmo erro que o LAB-07 cometeu com a calçada, e a mesma lição: o
 * adaptador declara a geometria que existe, não a que parece. O lote começa a
 * **meia caixa** do eixo, que é onde o meio-fio está.
 *
 * # Como um lote nasce, em cinco passos
 *
 * 1. **Qual aresta é frente.** Não se supõe: mede-se. Uma aresta é frente
 *    quando o eixo de alguma via passa a menos de meia caixa dela. Aresta sem
 *    rua não recebe lote — lote sem frente é violação no Validator.
 * 1b. **Onde o lote começa.** A meia caixa da via que faz frente para ele — o
 *    meio-fio. Nunca no eixo.
 * 2. **Quanto o lote tem de testada e de profundidade.** Sai dos parâmetros da
 *    gleba, não de número inventado: testada é
 *    `max(testadaMinLote_m, sqrt(areaAlvo / 2))` — a mesma conta que o LAB-07
 *    usou na ida — e a profundidade é `areaAlvo / testada`.
 * 3. **A faixa.** A face da aresta, cortada na profundidade do lote. O corte é
 *    por semiplano, que é sempre convexo e nunca inverte o polígono.
 * 4. **Os lotes.** A faixa é fatiada ao longo da aresta, de testada em testada,
 *    com dois cortes perpendiculares por lote.
 *
 * # O que ele recusa a fazer
 *
 * - **Não estica lote para caber.** A sobra no fim da aresta vira lote se tiver
 *   área e testada suficientes, e some se não tiver. Esticar produziria lote
 *   fora da faixa que o Validator mede.
 * - **Não inventa regra.** Área mínima, área máxima e testada mínima vêm dos
 *   parâmetros da gleba. O que não passa nelas é descartado, e o descarte é
 *   contado.
 *
 * # A área máxima também é parâmetro — e o Validator cobrou
 *
 * A primeira versão fatiava a aresta em `floor(comprimento / testadaAlvo)`
 * pedaços. Uma aresta de 26 m com testada alvo de 13,4 m dá **um** pedaço de
 * 26 m de testada: um lote de 700 m², acima do máximo de 600 da gleba. O
 * Validator do Generate devolveu isso como **8 violações `faixa-legal`** em
 * `geo-antonina`.
 *
 * O número de fatias passou a ser o mesmo `floor`, mas **preso entre dois
 * limites que saem dos próprios parâmetros**: ao menos
 * `comprimento · profundidade / areaMax` fatias, para nenhuma passar do máximo,
 * e no máximo `comprimento / testadaMin`, para nenhuma ficar sem testada.
 * Quando os dois limites se cruzam — aresta curta e funda demais — não há
 * número de fatias que sirva, e a peça é descartada pelo máximo, contada.
 */
import { esqueletoReto, simplificar, type P } from "./esqueleto/esqueleto.ts";

const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a: P, b: P): number => a.x * b.x + a.y * b.y;
const norma = (a: P): number => Math.hypot(a.x, a.y);
const unit = (a: P): P => {
  const n = norma(a);
  return n < 1e-12 ? { x: 0, y: 0 } : { x: a.x / n, y: a.y / n };
};

/** Área com sinal de um anel. */
function area(anel: P[]): number {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2);
}

/**
 * Corta um polígono por um semiplano `(p − q)·n ≤ c`.
 *
 * Sutherland–Hodgman com uma só aresta de corte. Um semiplano é convexo, então
 * o algoritmo não produz a auto-interseção que ele produziria com uma janela
 * côncava — é por isso que os quatro cortes de um lote são feitos um a um.
 */
function cortar(pol: P[], n: P, c: number): P[] {
  if (pol.length < 3) return [];
  const out: P[] = [];
  for (let i = 0; i < pol.length; i++) {
    const a = pol[i]!;
    const b = pol[(i + 1) % pol.length]!;
    const da = dot(a, n) - c;
    const db = dot(b, n) - c;
    if (da <= 0) out.push(a);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  // Tira repetido consecutivo — corte rente a um vértice duplica ponto.
  const lim: P[] = [];
  for (const p of out) {
    const u = lim[lim.length - 1];
    if (!u || norma(sub(p, u)) > 1e-6) lim.push(p);
  }
  if (lim.length > 1 && norma(sub(lim[0]!, lim[lim.length - 1]!)) < 1e-6) lim.pop();
  return lim.length >= 3 ? lim : [];
}

/** Um lote plantado. */
export interface Lote {
  pontos: P[];
  area_m2: number;
  testada_m: number;
  /** Índice da aresta da quadra para a qual ele faz frente. */
  arestaDeFrente: number;
}

/** Os parâmetros que o loteamento consome, todos da gleba. */
export interface ParametrosDeLote {
  areaMinLote_m2: number;
  areaAlvoLote_m2: number;
  areaMaxLote_m2: number;
  testadaMinLote_m: number;
}

/** O que o loteamento de uma quadra devolve, com o que ele descartou. */
export interface ResultadoLoteamento {
  lotes: Lote[];
  /** `true` quando a quadra foi pulada por atravessar a divisa da gleba. */
  puladaPorAtravessarADivisa?: boolean;
  /** Arestas da quadra com rua — as que podem receber lote. */
  arestasDeFrente: number;
  arestasSemRua: number;
  /** Peças descartadas por não passarem na área mínima ou na testada mínima. */
  descartadosPorArea: number;
  descartadosPorTestada: number;
  /** Peças descartadas por passarem da área máxima da gleba. */
  descartadosPorAreaMaxima: number;
  /** Peças descartadas por não haver rua na frente DELAS, só no resto da aresta. */
  descartadosPorFaltaDeRua: number;
  /** Lotes descartados por uma via passar por cima deles. */
  descartadosPorVia: number;
  /** Fração da quadra que virou lote, de 0 a 1. */
  aproveitamento: number;
  /** `true` quando a quadra foi pulada por o esqueleto não fechar. */
  puladaPorEsqueleto: boolean;
  avisos: string[];
}

/** Um eixo de via, para decidir que aresta tem rua. */
export interface EixoDeVia {
  pontos: P[];
  largura_m: number;
}

/**
 * O leito de alguma via cobre este lote?
 *
 * # Por que a conferência da frente não basta
 *
 * O lote já nasce recuado do eixo da rua que lhe dá frente. Mas uma **outra**
 * via pode cruzar a quadra — depois do recorte do LAB-02 a rede é fragmentada, e
 * trecho de via sobra dentro de quadra. O Validator do Generate viu isso: 41 de
 * 252 lotes com `via-sobre-lote` mesmo depois do recuo de meio-fio.
 *
 * Aqui a mesma pergunta é feita antes, com a mesma régua: o leito de qualquer
 * via — `largura_m` centrada no eixo — encosta neste lote? Se encosta, o lote
 * não nasce. É mais honesto descartar do que entregar lote que o Validator vai
 * reprovar.
 *
 * A folga de 1 cm evita reprovar o lote que apenas encosta no meio-fio da
 * própria rua, que é exatamente onde ele deve estar.
 */
function viaCobre(lote: P[], vias: EixoDeVia[]): boolean {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of lote) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  for (const v of vias) {
    const meia = v.largura_m / 2 - 0.01;
    if (meia <= 0) continue;
    for (let i = 1; i < v.pontos.length; i++) {
      const a = v.pontos[i - 1]!;
      const b = v.pontos[i]!;
      // Descarte rápido pela caixa envolvente, com a folga do leito.
      if (Math.max(a.x, b.x) < minX - meia || Math.min(a.x, b.x) > maxX + meia) continue;
      if (Math.max(a.y, b.y) < minY - meia || Math.min(a.y, b.y) > maxY + meia) continue;

      // O eixo passa a menos de meia caixa de alguma aresta do lote?
      for (let k = 0; k < lote.length; k++) {
        const c = lote[k]!;
        const d = lote[(k + 1) % lote.length]!;
        if (distSegSeg(a, b, c, d) < meia) return true;
      }
      // Ou o eixo passa por DENTRO do lote sem tocar a borda.
      if (dentroDoAnel(a, lote) || dentroDoAnel(b, lote)) return true;
    }
  }
  return false;
}

/** Menor distância entre dois segmentos. */
function distSegSeg(a: P, b: P, c: P, d: P): number {
  // Se cruzam, é zero.
  const d1 = cruzZ(sub(b, a), sub(c, a));
  const d2 = cruzZ(sub(b, a), sub(d, a));
  const d3 = cruzZ(sub(d, c), sub(a, c));
  const d4 = cruzZ(sub(d, c), sub(b, c));
  if (((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0))) return 0;
  return Math.min(distSeg(a, c, d), distSeg(b, c, d), distSeg(c, a, b), distSeg(d, a, b));
}

const cruzZ = (u: P, v: P): number => u.x * v.y - u.y * v.x;

/** Ponto dentro de um anel, por cruzamentos de raio. */
function dentroDoAnel(p: P, anel: P[]): boolean {
  let dentro = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const a = anel[i]!;
    const b = anel[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      dentro = !dentro;
    }
  }
  return dentro;
}

/** Distância de um ponto a um segmento. */
function distSeg(p: P, a: P, b: P): number {
  const ab = sub(b, a);
  const L = dot(ab, ab);
  if (L < 1e-12) return norma(sub(p, a));
  const t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / L));
  return norma(sub(p, { x: a.x + ab.x * t, y: a.y + ab.y * t }));
}

/** Distância de um ponto à polilinha mais próxima de um conjunto de vias. */
function distAsVias(p: P, vias: EixoDeVia[]): { d: number; largura: number } {
  let melhor = Infinity;
  let largura = 0;
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      const d = distSeg(p, v.pontos[i - 1]!, v.pontos[i]!);
      if (d < melhor) {
        melhor = d;
        largura = v.largura_m;
      }
    }
  }
  return { d: melhor, largura };
}

/**
 * Lote a quadra.
 *
 * `vias` decide que aresta é frente; sem vias, nenhuma aresta é frente e a
 * quadra sai vazia — que é a resposta honesta, não um erro.
 */
export function lotearQuadra(
  quadra: P[],
  p: ParametrosDeLote,
  vias: EixoDeVia[],
): ResultadoLoteamento {
  const avisos: string[] = [];
  // A tolerância de simplificação: 0,25 m. Ver o cabeçalho de `simplificar` —
  // a consequência é que um lote pode ultrapassar o anel original em até isso,
  // e quem diz se é demais é o Validator do Generate, no relatório.
  const TOL_SIMPLIFICACAO_M = 0.25;

  const esq = esqueletoReto(simplificar(quadra, TOL_SIMPLIFICACAO_M));
  avisos.push(...esq.avisos);

  const n = esq.faces.length;
  if (n === 0 || !esq.confiavel) {
    // Face aberta vira polígono absurdo. Uma quadra a menos é perda declarada;
    // um lote de área impossível seria mentira medida.
    return {
      lotes: [], arestasDeFrente: 0, arestasSemRua: 0,
      descartadosPorArea: 0, descartadosPorAreaMaxima: 0, descartadosPorFaltaDeRua: 0,
      descartadosPorTestada: 0, descartadosPorVia: 0, aproveitamento: 0,
      puladaPorEsqueleto: true,
      avisos: n === 0 ? [...avisos, "o esqueleto não produziu face nenhuma"] : avisos,
    };
  }

  // O esqueleto simplificou o anel; as faces seguem a versão simplificada, e é
  // com ela que as arestas têm de ser indexadas.
  const anelUsado = simplificar(quadra, TOL_SIMPLIFICACAO_M);

  // A testada e a profundidade do lote-alvo, dos parâmetros da gleba.
  const testadaAlvo = Math.max(p.testadaMinLote_m, Math.sqrt(p.areaAlvoLote_m2 / 2));
  const profundidade = p.areaAlvoLote_m2 / testadaAlvo;

  const lotes: Lote[] = [];
  let comFrente = 0;
  let semRua = 0;
  let porArea = 0;
  let semRuaNaFatia = 0;
  let porAreaMaxima = 0;
  let porTestada = 0;
  let porVia = 0;

  for (let i = 0; i < n && i < anelUsado.length; i++) {
    const a = anelUsado[i]!;
    const b = anelUsado[(i + 1) % anelUsado.length]!;
    const comprimento = norma(sub(b, a));
    if (comprimento < p.testadaMinLote_m) continue;

    // Passo 1 · esta aresta tem rua?
    const meio = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const { d, largura } = distAsVias(meio, vias);
    if (!(d <= largura / 2 + 1)) {
      semRua++;
      continue;
    }
    comFrente++;

    const face = esq.faces[i]!;
    if (face.length < 3) continue;

    const dir = unit(sub(b, a));
    // Normal interna da aresta: anel anti-horário → gira +90°.
    const nrm = { x: -dir.y, y: dir.x };

    // Passo 3 · a faixa: a face entre o MEIO-FIO e a profundidade do lote.
    // O meio-fio está a meia caixa do eixo, e o eixo é esta aresta — ver o
    // cabeçalho, "o meio-fio não é o eixo".
    // Meia caixa, MAIS a tolerância de simplificação: a aresta simplificada
    // pode estar até `TOL_SIMPLIFICACAO_M` do lado da rua em relação à
    // verdadeira, e sem essa folga o lote entra no leito por aí.
    const recuo = largura / 2 + TOL_SIMPLIFICACAO_M;
    const faixa = cortar(
      cortar(face, nrm, dot(a, nrm) + recuo + profundidade),
      { x: -nrm.x, y: -nrm.y },
      -(dot(a, nrm) + recuo),
    );
    if (faixa.length < 3) continue;

    // Passo 4 · fatia a faixa ao longo da aresta, de testada em testada.
    // O piso do máximo: com profundidade fixa, a testada não pode passar de
    // `areaMax / profundidade` sem o lote estourar a área máxima da gleba.
    const minimoPeloMaximo = Math.ceil((comprimento * profundidade) / p.areaMaxLote_m2 - 1e-9);
    // O teto do mínimo: mais fatias do que isto e nenhuma tem testada.
    const maximoPelaTestada = Math.floor(comprimento / p.testadaMinLote_m);
    const quantos = Math.min(
      Math.max(Math.floor(comprimento / testadaAlvo), minimoPeloMaximo, 1),
      Math.max(maximoPelaTestada, 1),
    );
    if (quantos < 1) continue;
    // A sobra é distribuída: `quantos` lotes de largura igual cobrem a aresta
    // inteira. Não sobra ponta, e nenhum lote fica abaixo da testada alvo.
    const largFatia = comprimento / quantos;

    for (let k = 0; k < quantos; k++) {
      const s0 = k * largFatia;
      const s1 = (k + 1) * largFatia;

      // A rua pode cobrir só um pedaço da aresta. A pergunta do passo 1 foi
      // feita no MEIO da aresta; aqui ela é refeita no meio da FATIA, que é
      // onde o lote vai nascer. Sem isto, o lote da ponta de uma aresta longa
      // sai sem rua e o Validator do Generate o reprova por `frente` — foram
      // 8 em `geo-antonina`. A régua é a mesma do passo 1; não há número novo.
      const meioDaFatia = { x: a.x + dir.x * ((s0 + s1) / 2), y: a.y + dir.y * ((s0 + s1) / 2) };
      const naFatia = distAsVias(meioDaFatia, vias);
      if (!(naFatia.d <= naFatia.largura / 2 + 1)) {
        semRuaNaFatia++;
        continue;
      }

      let pedaco = cortar(faixa, dir, dot(a, dir) + s1);
      pedaco = cortar(pedaco, { x: -dir.x, y: -dir.y }, -(dot(a, dir) + s0));
      if (pedaco.length < 3) continue;

      const ar = area(pedaco);
      if (ar < p.areaMinLote_m2) {
        porArea++;
        continue;
      }
      // A guarda do máximo. O cálculo de `quantos` já mira nela, mas a face do
      // esqueleto não é retângulo: um pedaço pode sair mais fundo que a
      // profundidade nominal. Quem não passa, não nasce.
      if (ar > p.areaMaxLote_m2) {
        porAreaMaxima++;
        continue;
      }
      // A testada é a projeção do lote sobre a aresta — a frente de verdade,
      // não o maior lado da caixa envolvente.
      let sMin = Infinity;
      let sMax = -Infinity;
      for (const q of pedaco) {
        const sq = dot(sub(q, a), dir);
        if (sq < sMin) sMin = sq;
        if (sq > sMax) sMax = sq;
      }
      const testada = sMax - sMin;
      if (testada < p.testadaMinLote_m) {
        porTestada++;
        continue;
      }
      if (viaCobre(pedaco, vias)) {
        porVia++;
        continue;
      }
      lotes.push({ pontos: pedaco, area_m2: ar, testada_m: testada, arestaDeFrente: i });
    }
  }

  const areaDaQuadra = area(anelUsado);
  const areaDeLotes = lotes.reduce((s, l) => s + l.area_m2, 0);

  return {
    lotes,
    arestasDeFrente: comFrente,
    arestasSemRua: semRua,
    descartadosPorArea: porArea,
    descartadosPorAreaMaxima: porAreaMaxima,
    descartadosPorFaltaDeRua: semRuaNaFatia,
    descartadosPorTestada: porTestada,
    descartadosPorVia: porVia,
    aproveitamento: areaDaQuadra > 0 ? areaDeLotes / areaDaQuadra : 0,
    puladaPorEsqueleto: false,
    avisos,
  };
}
