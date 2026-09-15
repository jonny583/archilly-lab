/**
 * ESQUELETO RETO — reimplementação em TypeScript, a partir da literatura.
 *
 * # Por que reimplementar, e não usar o que existe
 *
 * O LAB-00 investigou as duas implementações disponíveis e as duas são
 * **copyleft** por caminhos independentes: `StrandedKitty/straight-skeleton`
 * (CGAL, GPLv3+) e `lizelive/straight-skeleton` (Rust, GPLv2+). O Generate é
 * produto proprietário de navegador; adotar qualquer uma abriria o código dele.
 * A decisão de reimplementar está em `docs/STRAIGHT_SKELETON_ANALYSIS.md`, §5.
 *
 * **O algoritmo é da literatura, não daqueles repositórios:**
 *
 * - Felkel & Obdržálek (1998), *Straight Skeleton Implementation* — a construção
 *   por frente de onda e a classificação dos eventos;
 * - Aichholzer, Aurenhammer, Alberts & Gärtner (1995), *A Novel Type of Skeleton
 *   for Polygons* — a definição e as propriedades;
 * - Aichholzer & Aurenhammer (1996) — o tratamento de polígonos com furos.
 *
 * Implementar a partir dos artigos não toca em código GPL e não cria obra
 * derivada. Nenhuma linha daqui foi copiada de nenhum dos dois.
 *
 * # O que é o esqueleto reto, em uma frase
 *
 * Encolha o polígono para dentro, todas as arestas à mesma velocidade,
 * mantendo-se paralelas a si mesmas. O rastro que os vértices deixam é o
 * esqueleto; o instante em que cada nó nasce é a **distância de offset** em que
 * ele aparece. É por isso que ele dá recuo e subdivisão de graça.
 *
 * # Os dois eventos
 *
 * - **Evento de aresta:** dois vértices vizinhos se encontram e a aresta entre
 *   eles desaparece. É o que acontece num polígono convexo, sempre.
 * - **Evento de divisão:** um vértice **reflexo** (canto que aponta para dentro)
 *   alcança uma aresta não vizinha e parte a frente de onda em duas. É o caso
 *   em que o buffer ingênuo se auto-intersecta e o esqueleto reto não.
 * - **Evento de vértice:** um vértice reflexo alcança **outro vértice**, e não o
 *   meio de uma aresta. É o mesmo corte, no caso degenerado em que o encontro
 *   cai exatamente na ponta. O oráculo cobra este: no L de 60 × 60, o canto
 *   reflexo (30, 30) e o canto (0, 0) chegam juntos a (15, 15), no offset 15.
 *   Sem ele o nó do meio do L simplesmente não nasce.
 *
 * # O oráculo
 *
 * `docs/STRAIGHT_SKELETON_ANALYSIS.md`, §4.4: as duas implementações copyleft,
 * em linguagens e algoritmos independentes, concordam em dois casos —
 * retângulo 60 × 30 → nós internos em (15, 15) e (45, 15), offset 15; o L de
 * 60 × 60 com recorte 30 × 30 → mais um nó em (15, 45). Esta implementação
 * nasce com esse teste de aceitação, e ele está em `tests/esqueleto.test.ts`.
 *
 * # O que esta implementação NÃO faz
 *
 * - **Furos.** Quadra de loteamento não tem furo; o LAB-00 registrou o caso de
 *   Aichholzer & Aurenhammer (1996) para quando precisar.
 * - **Robustez industrial.** Eventos exatamente simultâneos e arestas quase
 *   paralelas são tratados com tolerância declarada (`EPS`), não com predicados
 *   exatos. O LAB-00 avisou que essa é a parte cara, e o escopo aqui — quadras
 *   de dezenas de vértices — não pede a artilharia da CGAL. O que não fecha sai
 *   **declarado** em `avisos`, nunca em silêncio.
 */

/** Um ponto no plano, em metros. */
export interface P {
  x: number;
  y: number;
}

/**
 * A tolerância geométrica, em metros.
 *
 * Um décimo de milímetro: muito abaixo de qualquer levantamento e muito acima do
 * ruído de `f64` nas contas envolvidas. Serve para decidir "é o mesmo ponto",
 * "é paralelo" e "o tempo é o mesmo".
 */
export const EPS = 1e-4;

const sub = (a: P, b: P): P => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: P, k: number): P => ({ x: a.x * k, y: a.y * k });
const dot = (a: P, b: P): number => a.x * b.x + a.y * b.y;
const cruz = (a: P, b: P): number => a.x * b.y - a.y * b.x;
const norma = (a: P): number => Math.hypot(a.x, a.y);
const unit = (a: P): P => {
  const n = norma(a);
  return n < 1e-12 ? { x: 0, y: 0 } : { x: a.x / n, y: a.y / n };
};

/** Área com sinal. Positiva quando o anel é anti-horário. */
export function areaComSinal(anel: P[]): number {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/** Um nó do esqueleto: onde ele está e em que offset nasceu. */
export interface NoDoEsqueleto {
  p: P;
  /** Distância de offset em que o nó aparece, em metros. */
  offset_m: number;
}

/**
 * Simplifica um anel tirando vértice que não carrega forma.
 *
 * # Por que isto é obrigatório, e não um enfeite
 *
 * As quadras do Symbios nascem de faces do grafo viário, e o grafo tem vértice
 * colinear e nó repetido em abundância. Medido nas 94 quadras de `ensaio-47ha`:
 * até **292 vértices** por quadra (mediana 25), **aresta de comprimento zero** e
 * **mudança de direção de 0,0000°**.
 *
 * O esqueleto reto não sobrevive a isso — aresta de comprimento zero não tem
 * normal, e vértice colinear produz evento no instante zero, em cadeia. A
 * primeira versão desta esteira **travou** numa quadra real, que é exatamente o
 * que o LAB-00 avisou que aconteceria: *"uma implementação ingênua funciona nos
 * testes e falha em produção"*.
 *
 * # O que a simplificação preserva
 *
 * # Douglas–Peucker, e por que não basta tirar colinear
 *
 * A primeira versão só tirava vértice colinear, a 1 cm. Não bastou: as quadras
 * do Symbios trazem as **curvas do traçado discretizadas** em segmentos de 0,5
 * a 1,3 m, e esses vértices não são colineares — são arco de verdade. Uma
 * quadra de 115 vértices caía para 65, e os 65 restantes eram arcos que
 * produziam eventos quase simultâneos em cadeia. A frente de onda empacava.
 *
 * Douglas–Peucker resolve porque ele mede **desvio**, não ângulo: um arco de
 * dez segmentos cujo desvio ao vão é menor que a tolerância vira uma corda só.
 *
 * A tolerância é escolha de quem chama, e a escolha tem consequência medida:
 * um lote plantado sobre o anel simplificado pode ultrapassar o anel original
 * em até `tolerancia`. Por isso o `lotear.ts` usa 0,25 m e **publica o que o
 * Validator do Generate disse** — se aparecer `via-sobre-lote`, a tolerância
 * está grosseira e o número aparece no relatório.
 */
export function simplificar(anel: P[], tolerancia = 0.01): P[] {
  let pts = anel.slice();
  // Pontos coincidentes primeiro: aresta de comprimento zero não tem normal.
  pts = pts.filter((p, i) => norma(sub(p, pts[(i + pts.length - 1) % pts.length]!)) > Math.max(EPS, tolerancia / 10));
  if (pts.length < 4) return pts;

  // Douglas–Peucker num anel: corta em dois pontos extremos e simplifica os
  // dois arcos. O ponto mais distante do primeiro é o segundo âncora — é o que
  // torna o algoritmo aplicável a um fechado, que não tem ponta natural.
  let maisLonge = 0;
  let dMax = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = norma(sub(pts[i]!, pts[0]!));
    if (d > dMax) {
      dMax = d;
      maisLonge = i;
    }
  }
  const a = pts.slice(0, maisLonge + 1);
  const b = [...pts.slice(maisLonge), pts[0]!];
  const out = [...dp(a, tolerancia).slice(0, -1), ...dp(b, tolerancia).slice(0, -1)];
  return out.length >= 3 ? out : pts;
}

/** Douglas–Peucker numa polilinha aberta, pontas preservadas. */
function dp(pts: P[], tol: number): P[] {
  if (pts.length < 3) return pts.slice();
  const a = pts[0]!;
  const b = pts[pts.length - 1]!;
  const ab = sub(b, a);
  const L = norma(ab);
  let iMax = -1;
  let dMax = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = L < 1e-12 ? norma(sub(pts[i]!, a)) : Math.abs(cruz(ab, sub(pts[i]!, a))) / L;
    if (d > dMax) {
      dMax = d;
      iMax = i;
    }
  }
  if (dMax <= tol || iMax < 0) return [a, b];
  return [...dp(pts.slice(0, iMax + 1), tol).slice(0, -1), ...dp(pts.slice(iMax), tol)];
}

/** Opções de `esqueletoReto`. */
export interface OpcoesEsqueleto {
  /**
   * Orçamento de tempo, em milissegundos. Padrão 250.
   *
   * O esqueleto reto é sensível a degenerescência e pode não convergir. Um
   * orçamento duro garante que ele **sempre devolve**, com um aviso dizendo que
   * parou pelo tempo — travar em silêncio seria pior que devolver incompleto.
   */
  orcamento_ms?: number;
  /**
   * Parar a frente de onda neste offset e devolvê-la em `frente`.
   *
   * É assim que sai o **recuo**: o polígono encolhido de `d` metros é a própria
   * frente de onda no instante `d`. Sai de graça, e é a razão de o esqueleto
   * reto ser a ferramenta certa para recuo de APP, faixa não edificável e
   * profundidade de lote — buffer ingênuo se auto-intersecta em canto reflexo,
   * a frente de onda não.
   */
  pararEm?: number;
}

/** O que `esqueletoReto` devolve. */
export interface Esqueleto {
  /**
   * A frente de onda no offset pedido, um anel por laço.
   *
   * Vazio quando `pararEm` não foi pedido, ou quando o polígono já colapsou
   * antes daquele offset — que é a resposta certa para "recuar mais do que a
   * quadra tem de largura".
   */
  frente: P[][];
  /** Os nós internos, em ordem de nascimento. */
  nos: NoDoEsqueleto[];
  /**
   * Uma face por aresta do polígono de entrada, na mesma ordem das arestas.
   *
   * A face da aresta `i` é a região do polígono que aquela aresta varre ao
   * encolher — a parte da quadra que faz frente para aquela rua. É esta
   * partição que o loteamento usa.
   */
  faces: P[][];
  /** O que não fechou, dito em português. Vazio quando tudo fechou. */
  avisos: string[];
  /**
   * `true` quando as faces somam a área do polígono e podem ser usadas.
   *
   * # Por que este campo existe
   *
   * Um esqueleto interrompido — pelo orçamento de tempo, pelo limite de passos
   * ou por uma frente que empacou — deixa faces **abertas**, e uma face aberta
   * montada como anel vira uma gravata-borboleta de área absurda. Medido numa
   * rodada real: erro de fechamento de 5 × 10¹⁰ %.
   *
   * Um número desses não pode chegar ao loteamento fingindo ser um polígono. O
   * teste é direto e barato: **a soma das faces tem de dar a área do anel**. Se
   * não der, o esqueleto se declara não confiável e quem chama decide o que
   * fazer — no `lotear.ts`, a quadra é pulada e contada.
   */
  confiavel: boolean;
  /** Soma das faces dividida pela área do anel. 1 quando fecha. */
  fechamento: number;
}

/** Um vértice da frente de onda. */
interface Vert {
  id: number;
  /** Posição no instante `t`. */
  p: P;
  /** Instante em que este vértice nasceu. */
  t: number;
  /** Velocidade: quanto ele anda por unidade de offset. */
  v: P;
  ant: Vert | null;
  prox: Vert | null;
  /** Índice da aresta original à esquerda (entre `ant` e este). */
  arestaAnt: number;
  /** Índice da aresta original à direita (entre este e `prox`). */
  arestaProx: number;
  vivo: boolean;
  /**
   * `true` quando as duas arestas deste vértice são antiparalelas.
   *
   * Não é erro: é a frente de onda que colapsou num segmento, e ali as duas
   * arestas se aniquilam. O vértice fica parado e o laço termina — ver o
   * cabeçalho de `esqueletoReto`, "o colapso terminal".
   */
  degenerado?: boolean;
}

interface Evento {
  t: number;
  tipo: "aresta" | "divisao" | "vertice";
  a: Vert;
  b: Vert;
  /** No evento de divisão, a aresta original atingida. */
  aresta?: number;
  p: P;
}

/**
 * A velocidade do vértice entre duas arestas de normais internas `n1` e `n2`.
 *
 * Queremos `v` tal que as duas arestas avancem exatamente 1 por unidade de
 * tempo: `v·n1 = 1` e `v·n2 = 1`. É um sistema 2×2; quando as normais são
 * paralelas (arestas colineares) o sistema degenera e a resposta é a própria
 * normal — o vértice só translada.
 */
function velocidade(n1: P, n2: P): P | null {
  const det = cruz(n1, n2);
  if (Math.abs(det) < 1e-9) {
    // Colineares e no mesmo sentido: translação pura. Em sentidos opostos o
    // vértice é uma ponta que some — devolve null e o chamador declara.
    return dot(n1, n2) > 0 ? { ...n1 } : null;
  }
  // Regra de Cramer para n1·v = 1, n2·v = 1.
  return { x: (n2.y - n1.y) / det, y: (n1.x - n2.x) / det };
}

/**
 * O esqueleto reto de um polígono simples, sem furos.
 *
 * O anel entra **anti-horário**; se vier horário, é invertido e um aviso é
 * emitido — a orientação decide para que lado é "dentro", e errar isso produz
 * um esqueleto que cresce para fora.
 */
export function esqueletoReto(anelEntrada: P[], opcoes: OpcoesEsqueleto = {}): Esqueleto {
  const avisos: string[] = [];
  let anel = anelEntrada.slice();

  // Tira vértice repetido no fim, se vier fechado.
  if (
    anel.length > 1 &&
    Math.abs(anel[0]!.x - anel[anel.length - 1]!.x) < EPS &&
    Math.abs(anel[0]!.y - anel[anel.length - 1]!.y) < EPS
  ) {
    anel = anel.slice(0, -1);
  }
  // Simplifica: vértice colinear e aresta de comprimento zero matam o algoritmo.
  // Ver o cabeçalho de `simplificar` — não é enfeite, é requisito medido.
  const antesDaSimplificacao = anel.length;
  anel = simplificar(anel);
  if (anel.length < antesDaSimplificacao) {
    avisos.push(
      `o anel foi simplificado de ${antesDaSimplificacao} para ${anel.length} vértices ` +
        "(colineares e coincidentes, a menos de 1 cm)",
    );
  }

  if (anel.length < 3) {
    return { nos: [], faces: [], frente: [], confiavel: false, fechamento: 0, avisos: [`o anel tem ${anel.length} vértice(s) úteis; o esqueleto pede 3`] };
  }
  if (areaComSinal(anel) < 0) {
    anel = anel.slice().reverse();
    avisos.push("o anel veio em sentido horário e foi invertido: anti-horário é o que define o lado de dentro");
  }

  const n = anel.length;
  /** Normal interna unitária da aresta `i` (de `anel[i]` a `anel[i+1]`). */
  const normal: P[] = [];
  for (let i = 0; i < n; i++) {
    const d = unit(sub(anel[(i + 1) % n]!, anel[i]!));
    // Anel anti-horário: a normal interna é a direção girada +90°.
    normal.push({ x: -d.y, y: d.x });
  }

  // ── a frente de onda inicial ─────────────────────────────────────────────
  let proximoId = 0;
  const verts: Vert[] = [];
  for (let i = 0; i < n; i++) {
    const arestaAnt = (i + n - 1) % n;
    const v = velocidade(normal[arestaAnt]!, normal[i]!);
    if (!v) {
      return {
        nos: [],
        faces: [],
        frente: [],
        confiavel: false,
        fechamento: 0,
        avisos: [...avisos, `as arestas ${arestaAnt} e ${i} são antiparalelas no vértice ${i}: o polígono tem uma ponta de espessura zero`],
      };
    }
    verts.push({
      id: proximoId++, p: { ...anel[i]! }, t: 0, v,
      ant: null, prox: null, arestaAnt, arestaProx: i, vivo: true,
    });
  }
  for (let i = 0; i < n; i++) {
    verts[i]!.ant = verts[(i + n - 1) % n]!;
    verts[i]!.prox = verts[(i + 1) % n]!;
  }

  /** Onde o vértice está no instante `t`. */
  const em = (v: Vert, t: number): P => add(v.p, mul(v.v, t - v.t));

  /** A cadeia de pontos que cada aresta original já varreu, dos dois lados. */
  const ladoEsq: Map<number, P[]> = new Map();
  const ladoDir: Map<number, P[]> = new Map();
  for (let i = 0; i < n; i++) {
    ladoEsq.set(i, []);
    ladoDir.set(i, []);
  }

  const nos: NoDoEsqueleto[] = [];
  const alvo = opcoes.pararEm ?? null;
  const frente: P[][] = [];

  /** Os laços da frente de onda no instante `t`, em ordem de ligação. */
  function laçosEm(t: number): P[][] {
    const out: P[][] = [];
    const vistos = new Set<number>();
    for (const inicio of verts) {
      if (!inicio.vivo || vistos.has(inicio.id)) continue;
      const laco: P[] = [];
      let w: Vert = inicio;
      let passos = 0;
      do {
        vistos.add(w.id);
        laco.push(em(w, t));
        w = w.prox!;
      } while (w !== inicio && ++passos < 10000);
      const lim = limpar(laco);
      if (lim.length >= 3) out.push(lim);
    }
    return out;
  }

  /**
   * Quando um vértice morre, o ponto onde ele morreu pertence às duas arestas
   * que ele separava. É assim que a face de cada aresta se fecha.
   */
  const registrar = (v: Vert, p: P) => {
    ladoDir.get(v.arestaAnt)!.push(p);
    ladoEsq.get(v.arestaProx)!.push(p);
  };

  /**
   * Instante em que a aresta entre `a` e `b` some. `null` se nunca.
   *
   * # A formulação que a primeira versão errou
   *
   * A primeira versão exigia que os dois vértices **coincidissem exatamente**:
   * resolvia `d + s·w = 0` numa componente e conferia a outra com tolerância
   * relativa apertada. Em ponto flutuante dois vértices quase nunca coincidem
   * exatamente, e o resultado foi a frente de onda **empacando** — medido: 9 de
   * 94 quadras reais paravam com 4 ou 9 vértices vivos e "nenhum evento em
   * vista", e as faces delas não fechavam.
   *
   * A formulação certa não é "os pontos se encontram", é **"o comprimento da
   * aresta chega a zero"**. Isso é uma quadrática em `s`:
   *
   * ```text
   * |d + s·w|² = |w|² s² + 2(d·w) s + |d|² = 0
   * ```
   *
   * O mínimo está em `s* = −(d·w)/|w|²`. Se o comprimento mínimo for
   * desprezível, há evento em `s*` — mesmo que a aritmética nunca zere de fato.
   */
  function tempoDeAresta(a: Vert, b: Vert, agora: number): number | null {
    const pa = em(a, agora);
    const pb = em(b, agora);
    const d = sub(pb, pa);
    const w = sub(b.v, a.v);

    const qa = dot(w, w);
    if (qa < 1e-14) return null; // velocidades iguais: a aresta nunca encolhe
    const qb = 2 * dot(d, w);
    const s = -qb / (2 * qa);
    if (s < -EPS) return null;

    const minLen2 = Math.max(0, dot(d, d) - (qb * qb) / (4 * qa));
    // A tolerância acompanha a escala: comprimento de aresta em metros.
    const tol = Math.max(EPS, 1e-7 * norma(d));
    if (Math.sqrt(minLen2) > tol) return null;

    return agora + Math.max(0, s);
  }

  /** O vértice é reflexo (aponta para dentro) no instante atual? */
  const reflexo = (v: Vert, agora: number): boolean => {
    const p = em(v, agora);
    const a = em(v.ant!, agora);
    const b = em(v.prox!, agora);
    return cruz(sub(p, a), sub(b, p)) < -EPS;
  };

  /**
   * Instante em que o vértice reflexo `v` alcança a aresta original `i`.
   *
   * A reta de suporte da aresta `i` no instante `t` é o conjunto dos pontos a
   * distância `t` dela, do lado de dentro. O vértice a alcança quando
   * `(p − q)·n + t(v·n) = t`.
   */
  function tempoDeDivisao(v: Vert, i: number, agora: number): number | null {
    const nrm = normal[i]!;
    // A aresta `i` no instante `t` está a distância `t` da reta original dela.
    // O vértice a alcança quando a distância DELE à reta original também é `t`:
    //
    //   D + (t − agora)·k = t,  com D = (p − anel[i])·n  e  k = v·n
    //   ⇒  t = (D − agora·k) / (1 − k)
    //
    // A primeira versão escrevia `agora + D/(1 − k)`, que só coincide quando
    // `agora` é zero. Com isso os eventos de divisão descobertos depois do
    // primeiro instante saíam na hora errada, a frente de onda passava por
    // cima de si mesma e depois empacava sem evento nenhum — foi a causa dos
    // "parou com N vértices vivos" que apareciam em 1 de cada 5 quadras reais.
    const k = dot(v.v, nrm);
    const den = 1 - k;
    if (Math.abs(den) < 1e-9) return null;
    const D = dot(sub(em(v, agora), anel[i]!), nrm);
    const t = (D - agora * k) / den;
    if (!Number.isFinite(t) || t < agora + EPS) return null;
    return t;
  }

  // ── o laço de eventos ────────────────────────────────────────────────────
  //
  // **Eventos simultâneos são processados juntos.** A primeira versão pegava só
  // o primeiro, e o oráculo a desmascarou na hora: um retângulo 60 × 30 colapsa
  // pelos DOIS lados no mesmo instante (offset 15), e processar um só deixava o
  // esqueleto com um nó em vez de dois. Um retângulo é o caso mais simples que
  // existe — se ele falha, tudo falha.
  let agora = 0;
  let vivos = n;
  let guarda = 0;
  const limite = 20 * n + 200;
  const orcamento = opcoes.orcamento_ms ?? 250;
  const comecou = performance.now();
  let estourouOTempo = false;

  while (vivos > 2 && guarda++ < limite) {
    if (performance.now() - comecou > orcamento) {
      estourouOTempo = true;
      break;
    }
    const candidatos: Evento[] = [];

    for (const v of verts) {
      if (!v.vivo) continue;

      const t1 = tempoDeAresta(v, v.prox!, agora);
      if (t1 !== null) candidatos.push({ t: t1, tipo: "aresta", a: v, b: v.prox!, p: em(v, t1) });

      if (!reflexo(v, agora)) continue;
      for (let i = 0; i < n; i++) {
        if (i === v.arestaAnt || i === v.arestaProx) continue;
        const t2 = tempoDeDivisao(v, i, agora);
        if (t2 === null) continue;
        const hit = em(v, t2);
        let dentro = false;
        for (const w of verts) {
          if (!w.vivo || w.arestaProx !== i) continue;
          const a = em(w, t2);
          const b = em(w.prox!, t2);
          const ab = sub(b, a);
          const sPar = norma(ab) < EPS ? -1 : dot(sub(hit, a), ab) / dot(ab, ab);
          if (sPar > EPS && sPar < 1 - EPS) dentro = true;
        }
        if (dentro) candidatos.push({ t: t2, tipo: "divisao", a: v, b: v, aresta: i, p: hit });
      }

      // Evento de vértice: o reflexo alcança outro vértice, não o meio de uma
      // aresta. É o caso degenerado da divisão, e o oráculo o cobra no L.
      for (const w of verts) {
        if (!w.vivo || w === v || w === v.ant || w === v.prox) continue;
        const t3 = tempoDeAresta(v, w, agora);
        if (t3 === null || t3 < agora + EPS) continue;
        candidatos.push({ t: t3, tipo: "vertice", a: v, b: w, p: em(v, t3) });
      }
    }

    if (!candidatos.length) {
      avisos.push(
        `a frente de onda parou com ${vivos} vértices vivos e nenhum evento em vista, ` +
          `no offset ${agora.toFixed(3)} m`,
      );
      break;
    }

    const tMin = Math.min(...candidatos.map((c) => c.t));
    // A frente pedida está ENTRE o instante atual e o próximo evento: amostra
    // antes de processar, senão os vértices que a formam já morreram.
    if (alvo !== null && frente.length === 0 && tMin >= alvo - EPS) {
      frente.push(...laçosEm(alvo));
    }
    agora = tMin;
    // No mesmo instante: aresta primeiro (colapsar deixa menos vizinhança para
    // desfazer), vértice depois, divisão por último.
    const ordem = { aresta: 0, vertice: 1, divisao: 2 } as const;
    const lote = candidatos
      .filter((c) => c.t <= tMin + EPS)
      .sort((x, y) => ordem[x.tipo] - ordem[y.tipo]);

    for (const ev of lote) {
      // Um evento do lote pode ter sido invalidado por outro do mesmo lote.
      if (!ev.a.vivo || !ev.b.vivo) continue;

      if (ev.tipo === "aresta") {
        const { a, b } = ev;
        if (a.prox !== b) continue;
        const p = ev.p;
        nos.push({ p, offset_m: agora });
        registrar(a, p);
        registrar(b, p);

        a.vivo = false;
        b.vivo = false;
        vivos -= 2;

        const vel = velocidade(normal[a.arestaAnt]!, normal[b.arestaProx]!);
        const novoV: Vert = {
          id: proximoId++, p, t: agora,
          // Antiparalelo aqui é o COLAPSO TERMINAL, não erro: as duas arestas
          // se aniquilam e o que resta é o segmento final do esqueleto. O
          // vértice fica parado e o laço termina logo a seguir.
          v: vel ?? { x: 0, y: 0 },
          ant: a.ant, prox: b.prox,
          arestaAnt: a.arestaAnt, arestaProx: b.arestaProx, vivo: true,
          degenerado: vel === null,
        };
        a.ant!.prox = novoV;
        b.prox!.ant = novoV;
        verts.push(novoV);
        vivos += 1;
      } else if (ev.tipo === "vertice") {
        // Os dois vértices morrem e a frente se parte em dois laços, exatamente
        // como na divisão — só que o ponto de encontro é uma ponta, não o meio
        // de uma aresta.
        const v = ev.a;
        const w = ev.b;
        if (v === w.ant || v === w.prox) continue;
        const p = ev.p;
        nos.push({ p, offset_m: agora });
        registrar(v, p);
        registrar(w, p);
        v.vivo = false;
        w.vivo = false;
        vivos -= 2;

        const velA = velocidade(normal[v.arestaAnt]!, normal[w.arestaProx]!);
        const velB = velocidade(normal[w.arestaAnt]!, normal[v.arestaProx]!);
        const nA: Vert = {
          id: proximoId++, p, t: agora, v: velA ?? { x: 0, y: 0 },
          ant: v.ant, prox: w.prox, arestaAnt: v.arestaAnt, arestaProx: w.arestaProx,
          vivo: true, degenerado: velA === null,
        };
        const nB: Vert = {
          id: proximoId++, p, t: agora, v: velB ?? { x: 0, y: 0 },
          ant: w.ant, prox: v.prox, arestaAnt: w.arestaAnt, arestaProx: v.arestaProx,
          vivo: true, degenerado: velB === null,
        };
        v.ant!.prox = nA;
        w.prox!.ant = nA;
        w.ant!.prox = nB;
        v.prox!.ant = nB;
        verts.push(nA, nB);
        vivos += 2;
      } else {
        const v = ev.a;
        const i = ev.aresta!;
        const p = ev.p;

        let esq: Vert | null = null;
        for (const w of verts) {
          if (!w.vivo || w.arestaProx !== i) continue;
          const a = em(w, agora);
          const b = em(w.prox!, agora);
          const ab = sub(b, a);
          const sPar = norma(ab) < EPS ? -1 : dot(sub(p, a), ab) / dot(ab, ab);
          if (sPar > EPS && sPar < 1 - EPS) esq = w;
        }
        if (!esq) continue;
        const dir = esq.prox!;

        nos.push({ p, offset_m: agora });
        registrar(v, p);
        v.vivo = false;
        vivos -= 1;

        const velA = velocidade(normal[v.arestaAnt]!, normal[i]!);
        const velB = velocidade(normal[i]!, normal[v.arestaProx]!);
        const nA: Vert = {
          id: proximoId++, p, t: agora, v: velA ?? { x: 0, y: 0 },
          ant: v.ant, prox: dir, arestaAnt: v.arestaAnt, arestaProx: i, vivo: true,
          degenerado: velA === null,
        };
        const nB: Vert = {
          id: proximoId++, p, t: agora, v: velB ?? { x: 0, y: 0 },
          ant: esq, prox: v.prox, arestaAnt: i, arestaProx: v.arestaProx, vivo: true,
          degenerado: velB === null,
        };
        v.ant!.prox = nA;
        dir.ant = nA;
        esq.prox = nB;
        v.prox!.ant = nB;
        verts.push(nA, nB);
        vivos += 2;
      }
    }

    // Se tudo o que sobrou está parado, não há mais para onde a onda ir.
    if (verts.filter((v) => v.vivo).every((v) => v.degenerado)) break;
  }

  if (estourouOTempo) {
    avisos.push(
      `o esqueleto parou pelo orçamento de ${orcamento} ms com ${vivos} vértices vivos ` +
        `no offset ${agora.toFixed(3)} m — devolvido incompleto, de propósito`,
    );
  } else if (guarda >= limite) {
    avisos.push(`o laço de eventos atingiu o limite de ${limite} passos — o esqueleto pode estar incompleto`);
  }

  // O que sobrou vivo morre junto: as últimas arestas colapsam num ponto ou num
  // segmento. Registra o que resta para as faces fecharem.
  for (const v of verts) {
    if (!v.vivo) continue;
    registrar(v, em(v, agora));
    v.vivo = false;
  }

  // Nós coincidentes: dois eventos simultâneos no mesmo ponto — o centro de um
  // quadrado, por exemplo — são o MESMO nó do esqueleto, contado duas vezes.
  const unicos: NoDoEsqueleto[] = [];
  for (const no of nos) {
    if (!unicos.some((u) => norma(sub(u.p, no.p)) < EPS && Math.abs(u.offset_m - no.offset_m) < EPS)) {
      unicos.push(no);
    }
  }
  nos.length = 0;
  nos.push(...unicos);

  // ── as faces ─────────────────────────────────────────────────────────────
  //
  // A face da aresta `i` é: a aresta, mais o rastro do vértice da direita, mais
  // o rastro do vértice da esquerda de volta. Os pontos registrados vêm em
  // ordem de tempo, que é a ordem em que a face se fecha.
  const faces: P[][] = [];
  for (let i = 0; i < n; i++) {
    const a = anel[i]!;
    const b = anel[(i + 1) % n]!;
    // Anti-horário: sai de `a`, vai até `b`, sobe pelo rastro do vértice que
    // estava na PONTA `b` (o que tem esta aresta como `arestaAnt`) e volta pelo
    // rastro do vértice que estava em `a` (o que a tem como `arestaProx`).
    //
    // A primeira versão trocou os dois lados, e o resultado foi uma face em
    // gravata-borboleta: a soma das faces dava 2 500 m² numa quadra de 5 000.
    // Somar as faces e comparar com a área da quadra é o teste que pega isso,
    // e ele está em `tests/esqueleto.test.ts`.
    const naPonta = ladoDir.get(i)!;
    const naOrigem = ladoEsq.get(i)!;
    const face: P[] = [a, b, ...naPonta, ...naOrigem.slice().reverse()];
    faces.push(limpar(face));
  }

  // Pediram um offset que a quadra nunca alcança porque ela colapsa antes: a
  // frente sai vazia, e isso é a resposta, não uma falha.
  if (alvo !== null && frente.length === 0 && agora >= alvo - EPS) {
    frente.push(...laçosEm(alvo));
  }

  // A prova de que as faces servem: elas têm de recobrir o polígono, sem sobra
  // e sem falta. Ver o campo `confiavel`.
  const areaDoAnel = Math.abs(areaComSinal(anel));
  const areaDasFaces = faces.reduce((acc, f) => acc + Math.abs(areaComSinal(f)), 0);
  const fechamento = areaDoAnel > 0 ? areaDasFaces / areaDoAnel : 0;
  const confiavel = Math.abs(fechamento - 1) < 0.01;
  if (!confiavel) {
    avisos.push(
      `as faces somam ${areaDasFaces.toFixed(1)} m² contra ${areaDoAnel.toFixed(1)} m² do anel ` +
        `(fechamento ${fechamento.toFixed(3)}) — o esqueleto não é confiável e não deve ser loteado`,
    );
  }

  return { nos, faces, frente, avisos, confiavel, fechamento: Number(fechamento.toFixed(4)) };
}

/**
 * O polígono recuado de `d` metros para dentro — um anel por laço.
 *
 * Atalho para `esqueletoReto(anel, { pararEm: d }).frente`. Vazio quando o
 * polígono colapsa antes de `d`, que é o caso "a quadra não tem profundidade
 * para esse recuo".
 */
export function offsetInterno(anel: P[], d: number): P[][] {
  return esqueletoReto(anel, { pararEm: d }).frente;
}

/** Tira pontos repetidos consecutivos e o fechamento redundante. */
function limpar(pts: P[]): P[] {
  const out: P[] = [];
  for (const p of pts) {
    const u = out[out.length - 1];
    if (!u || norma(sub(p, u)) > EPS) out.push(p);
  }
  while (out.length > 1 && norma(sub(out[0]!, out[out.length - 1]!)) < EPS) out.pop();
  return out;
}
