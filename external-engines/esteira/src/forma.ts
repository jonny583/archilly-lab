/**
 * A RÉGUA DE FORMA DO LOTE — o que ela mede, e o que ela NÃO tem o direito de dizer. (LAB-16)
 *
 * # O que já estava consertado, e não se conserta duas vezes
 *
 * O chat mandou *"conserte a régua de forma: ela pune quem gira o lote — 754 de
 * 776 'irregulares' eram retângulos"*. **O conserto já tinha sido feito no
 * LAB-13** (D63): a `irregularidadeGirada` usa a **caixa de menor área em
 * qualquer orientação**, e a tabela do LAB-13 **já a usa**. Os 754 são o número
 * da régua VELHA, dos eixos, que continua publicada ao lado só para se poder
 * ver o tamanho do estrago. Fingir que estou consertando de novo seria mentir
 * sobre trabalho.
 *
 * **O que ainda estava errado** é outra coisa, e ela é mais fina.
 *
 * # O erro que sobrou: um número que não é medição, é veredito
 *
 * A régua publicava **uma contagem só** — `naoRetangulares`, os lotes que perdem
 * mais de **1 %** da caixa de menor área. Dois problemas, os dois medidos:
 *
 * **1 · O corte de 1 % é meu, não do Jonny.** E ele manda no resultado. Medido
 * nas cinco glebas: o Laboratório de Parcelamento em `geo-antonina` tem **34**
 * lotes acima de 1 %, **15** acima de 5 % e **zero** acima de 10 %. Três
 * respostas para a mesma pergunta, e a que saía na tabela era a de um corte que
 * ninguém escolheu.
 *
 * **2 · "Irregular" é palavra de urbanista, e a régua não é urbanista.** Medido:
 * dos lotes que a régua marcava, a esmagadora maioria é **pentágono, hexágono e
 * trapézio** — lote de esquina, lote na curva, lote encostado na APP. Um
 * trapézio numa rua curva é um lote **normal**. Chamá-lo de irregular é decidir
 * urbanismo, e isso é do Jonny (CLAUDE.md §4).
 *
 * # O que esta régua passa a publicar
 *
 * **A distribuição inteira** — mediana, p90, p99, máxima —, a contagem nos
 * **três cortes declarados**, e a **composição por forma**: quantos retângulos,
 * quantos trapézios, quantos pentágonos, quantos com **lado curvo**. Quem lê
 * decide o que é ruim; a régua só diz o que há.
 *
 * # Por que "lado curvo" precisou existir
 *
 * Ao classificar as formas apareceram lotes com **ig ≈ 0,10** cujos quatro
 * cantos dão 90,0° — impossível para um retângulo de verdade. Medido: o
 * polígono tinha **49 vértices**. Era um lote de **testada curva**, e a
 * tolerância de colinearidade da primeira classificação tinha achatado o arco
 * numa reta. A régua **não** estava errada; a classificação estava. Por isso o
 * arco é detectado e contado, em vez de ser alisado em silêncio.
 */
import { areaComSinal, irregularidade, irregularidadeGirada, type P } from "./motores/comum.ts";

/** Dois pontos mais perto que isto são o mesmo ponto. */
export const TOL_PONTO_M = 0.05;

/** Duas arestas que viram menos que isto seguem o mesmo lado. */
export const TOL_COLINEAR_GRAUS = 2;

/** Um lado feito de várias arestas que vira mais que isto no total é um ARCO. */
export const GIRO_DE_ARCO_GRAUS = 5;

/**
 * Os cortes em que a contagem é publicada — **os três, sempre**.
 *
 * Publicar um só esconde que a resposta depende dele. Qual deles separa "lote
 * bom" de "lote ruim" é decisão de urbanismo, e está em
 * `docs/PENDENCIAS_JONNY.md`, não aqui.
 */
export const CORTES_DE_FORMA = [0.01, 0.05, 0.1] as const;

/**
 * A REGRA DE FORMA DO LOTE — decidida pelo chat em 02/10/2026. (LAB-19)
 *
 * > **Área útil abaixo de 85 % do retângulo envolvente = "a conferir".
 * > Abaixo de 70 % = "ruim".**
 *
 * É a resposta à pergunta que o LAB-16 abriu e **não quis responder sozinho**
 * (D76): qual perda da caixa envolvente separa lote bom de lote ruim. O corte
 * de 1 % que eu usava era meu, sem critério, e mandava no resultado — 34 ou
 * zero lotes conforme o corte, na mesma gleba.
 *
 * **Quem decidiu foi o chat, não eu.** Como no "3× / 1,5 km" (D61), fica
 * valendo e fica **à vista em `docs/PENDENCIAS_JONNY.md`** até o Jonny
 * confirmar: regra que vem pelo chat e passa a ser tratada como dele é regra
 * que se perde.
 *
 * # O que a régua continua NÃO fazendo
 *
 * O veredito é **da área útil contra a caixa**, e só. Ele não olha testada, não
 * olha topografia e não olha para quem o lote dá frente — um retângulo de 4 m de
 * testada sai "ok" aqui e é pior que um trapézio de 12 m que sai "a conferir".
 * A composição por forma (D77) continua publicada ao lado por isso mesmo.
 */

/** A partir deste preenchimento da caixa envolvente, o lote está "ok". */
export const UTIL_A_CONFERIR = 0.85;

/** Abaixo deste preenchimento, o lote é "ruim". */
export const UTIL_RUIM = 0.7;

/** O veredito de forma, nas três palavras do chat. */
export type VereditoDeForma = "ok" | "a conferir" | "ruim";

/**
 * O veredito de um lote, a partir de quanto ele preenche a caixa de menor área.
 *
 * `util` é a fração preenchida — 1 é um retângulo perfeito. É o complemento da
 * `irregularidade`, e o veredito é escrito nela, e não na irregularidade, porque
 * foi nela que o chat decidiu: ler "85 %" como "0,15 de irregularidade" obriga
 * quem confere a fazer a conta de cabeça, e é assim que limiar troca de lado.
 */
export function vereditoDeForma(util: number): VereditoDeForma {
  if (util < UTIL_RUIM) return "ruim";
  if (util < UTIL_A_CONFERIR) return "a conferir";
  return "ok";
}

/** O perfil de forma de um lote. Nada aqui julga; tudo aqui mede. */
export interface PerfilDeForma {
  /** Pela caixa alinhada aos eixos — a fórmula do Generate. Punia quem girava. */
  irregularidadeEixos: number;
  /** Pela caixa de menor área, em qualquer orientação. É a régua justa (D63). */
  irregularidade: number;
  /** Lados retos, depois de mesclar arestas que seguem a mesma direção. */
  lados: number;
  /** Quantos desses lados são arco, e não reta. */
  ladosCurvos: number;
  /** Vértices como o motor os entregou, antes de qualquer limpeza. */
  verticesCrus: number;
  /** A forma, em palavra: `retângulo`, `trapézio`, `pentágono`, `polígono 6 lados`… */
  classe: string;
  /** Quanto o lote preenche a caixa de menor área. 1 é retângulo perfeito. */
  util: number;
  /** O veredito da regra do chat (LAB-19). Ver `vereditoDeForma`. */
  veredito: VereditoDeForma;
}

/** Tira pontos repetidos. Não tira colinear — isso é trabalho dos lados. */
function semRepetidos(anel: P[]): P[] {
  const a: P[] = [];
  for (const p of anel) {
    const u = a[a.length - 1];
    if (!u || Math.hypot(p.x - u.x, p.y - u.y) > TOL_PONTO_M) a.push(p);
  }
  while (a.length > 1) {
    const d = Math.hypot(a[0]!.x - a[a.length - 1]!.x, a[0]!.y - a[a.length - 1]!.y);
    if (d > TOL_PONTO_M) break;
    a.pop();
  }
  return a;
}

/** O giro, em graus e com sinal, de uma direção para a outra. */
function giro(de: number, para: number): number {
  let d = (para - de) * (180 / Math.PI);
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

/** Um lado: o trecho entre dois cantos, reto ou em arco. */
interface Lado {
  /** Canto onde ele começa. */
  de: P;
  /** Canto onde ele acaba. */
  para: P;
  /** Quantas arestas do polígono original ele engoliu. */
  arestas: number;
  /** O giro somado ao longo dele. Reta dá ~0; arco dá o ângulo do arco. */
  giroTotal_graus: number;
}

/**
 * Parte o anel em lados: arestas seguidas que viram pouco são o mesmo lado.
 *
 * O critério é o giro entre **arestas vizinhas**, e não entre a aresta e a
 * primeira do lado — é o que deixa o arco ser um lado só, em vez de virar
 * quarenta lados de meio grau cada.
 */
export function ladosDoAnel(anel: P[]): Lado[] {
  const a = semRepetidos(anel);
  if (a.length < 3) return [];

  const n = a.length;
  const dir: number[] = [];
  for (let i = 0; i < n; i++) {
    const p = a[i]!;
    const q = a[(i + 1) % n]!;
    dir.push(Math.atan2(q.y - p.y, q.x - p.x));
  }

  // Onde começa um lado: a aresta em que o giro vindo da anterior é grande.
  const cantos: number[] = [];
  for (let i = 0; i < n; i++) {
    const g = giro(dir[(i - 1 + n) % n]!, dir[i]!);
    if (Math.abs(g) > TOL_COLINEAR_GRAUS) cantos.push(i);
  }
  // Sem canto nenhum: o anel inteiro é um arco fechado (um círculo, na prática).
  if (cantos.length === 0) {
    let total = 0;
    for (let i = 0; i < n; i++) total += giro(dir[(i - 1 + n) % n]!, dir[i]!);
    return [{ de: a[0]!, para: a[0]!, arestas: n, giroTotal_graus: total }];
  }

  const lados: Lado[] = [];
  for (let k = 0; k < cantos.length; k++) {
    const i0 = cantos[k]!;
    const i1 = cantos[(k + 1) % cantos.length]!;
    let arestas = 0;
    let total = 0;
    for (let i = i0; ; i = (i + 1) % n) {
      arestas++;
      if (i !== i0) total += giro(dir[(i - 1 + n) % n]!, dir[i]!);
      if ((i + 1) % n === i1) break;
      if (arestas > n) break;
    }
    lados.push({ de: a[i0]!, para: a[i1]!, arestas, giroTotal_graus: total });
  }
  return lados;
}

/** O ângulo interno entre dois lados que se encontram, em graus. */
function anguloEntre(a: P, canto: P, b: P): number {
  const a1 = Math.atan2(a.y - canto.y, a.x - canto.x);
  const a2 = Math.atan2(b.y - canto.y, b.x - canto.x);
  let d = Math.abs((a1 - a2) * (180 / Math.PI));
  if (d > 180) d = 360 - d;
  return d;
}

/** Duas direções paralelas, sem se importar com o sentido. */
function paralelos(d1: number, d2: number): boolean {
  let d = Math.abs((d1 - d2) * (180 / Math.PI)) % 180;
  if (d > 90) d = 180 - d;
  return d <= TOL_COLINEAR_GRAUS;
}

/**
 * A forma do lote, em palavra.
 *
 * **Nenhuma destas palavras é um juízo.** `trapézio` não quer dizer ruim, e
 * `retângulo` não quer dizer bom — um retângulo de 4 m de testada é pior que um
 * trapézio de 12 m. O que é bom é do Jonny.
 */
export function classeDaForma(lados: Lado[]): string {
  if (lados.length === 0) return "degenerado";
  const curvos = lados.filter((l) => l.arestas >= 3 && Math.abs(l.giroTotal_graus) >= GIRO_DE_ARCO_GRAUS).length;
  const sufixo = curvos > 0 ? ` com ${curvos} lado(s) curvo(s)` : "";

  if (lados.length === 1) return `arco fechado${sufixo}`;
  if (lados.length === 2) return `degenerado${sufixo}`;
  if (lados.length === 3) return `triângulo${sufixo}`;

  if (lados.length === 4) {
    const cantos = lados.map((l, i) =>
      anguloEntre(l.de, l.para, lados[(i + 1) % 4]!.para),
    );
    const retos = cantos.every((g) => Math.abs(g - 90) <= TOL_COLINEAR_GRAUS);
    if (retos) return `retângulo${sufixo}`;

    const d = lados.map((l) => Math.atan2(l.para.y - l.de.y, l.para.x - l.de.x));
    const p0 = paralelos(d[0]!, d[2]!);
    const p1 = paralelos(d[1]!, d[3]!);
    if (p0 && p1) return `paralelogramo${sufixo}`;
    if (p0 || p1) return `trapézio${sufixo}`;
    return `quadrilátero${sufixo}`;
  }

  if (lados.length === 5) return `pentágono${sufixo}`;
  return `polígono ${lados.length} lados${sufixo}`;
}

/** Mede um lote. */
export function perfilDeForma(anel: P[]): PerfilDeForma {
  const lados = ladosDoAnel(anel);
  const irr = irregularidadeGirada(anel);
  const util = 1 - irr;
  return {
    irregularidadeEixos: irregularidade(anel),
    irregularidade: irr,
    lados: lados.length,
    ladosCurvos: lados.filter((l) => l.arestas >= 3 && Math.abs(l.giroTotal_graus) >= GIRO_DE_ARCO_GRAUS).length,
    verticesCrus: anel.length,
    classe: classeDaForma(lados),
    util,
    veredito: vereditoDeForma(util),
  };
}

/** A forma de um conjunto de lotes, sem veredito nenhum. */
export interface DistribuicaoDeForma {
  lotes: number;
  /** A distribuição da régua justa. `null` quando não há lote (D23). */
  mediana: number | null;
  p90: number | null;
  p99: number | null;
  maxima: number | null;
  /** Quantos passam de cada corte declarado. A chave é o corte. */
  acimaDe: Record<string, number>;
  /** A mesma contagem pela régua VELHA, dos eixos — só para se ver o estrago. */
  acimaDeUmPorCentoPelosEixos: number;
  /** A regra do chat (LAB-19): quantos lotes `ok`, `a conferir` e `ruim`. */
  porVeredito: Record<VereditoDeForma, number>;
  /** A mesma contagem em fração dos lotes, que é como a tabela a mostra. */
  pctAConferir: number | null;
  pctRuim: number | null;
  /** Quantos lotes de cada forma. */
  porClasse: Record<string, number>;
  /** Quantos têm ao menos um lado em arco. */
  comLadoCurvo: number;
  /** A área somada dos lotes, em m². Para pesar o que a contagem não pesa. */
  area_m2: number;
}

/** Mede um conjunto de lotes. Sem lote nenhum, tudo sai `null` — nunca zero. */
export function distribuicaoDeForma(aneis: P[][]): DistribuicaoDeForma {
  const perfis = aneis.map(perfilDeForma);
  const v = perfis.map((p) => p.irregularidade).sort((a, b) => a - b);
  const q = (x: number): number | null =>
    v.length ? v[Math.min(v.length - 1, Math.floor(x * v.length))]! : null;

  const acimaDe: Record<string, number> = {};
  for (const c of CORTES_DE_FORMA) acimaDe[String(c)] = v.filter((i) => i > c).length;

  const porClasse: Record<string, number> = {};
  for (const p of perfis) porClasse[p.classe] = (porClasse[p.classe] ?? 0) + 1;

  const porVeredito: Record<VereditoDeForma, number> = { ok: 0, "a conferir": 0, ruim: 0 };
  for (const p of perfis) porVeredito[p.veredito]++;
  const fracao = (n: number): number | null => (perfis.length ? n / perfis.length : null);

  return {
    lotes: perfis.length,
    porVeredito,
    pctAConferir: fracao(porVeredito["a conferir"]),
    pctRuim: fracao(porVeredito.ruim),
    mediana: q(0.5),
    p90: q(0.9),
    p99: q(0.99),
    maxima: v.length ? v[v.length - 1]! : null,
    acimaDe,
    acimaDeUmPorCentoPelosEixos: perfis.filter((p) => p.irregularidadeEixos > 0.01).length,
    porClasse,
    comLadoCurvo: perfis.filter((p) => p.ladosCurvos > 0).length,
    area_m2: aneis.reduce((s, a) => s + Math.abs(areaComSinal(a)), 0),
  };
}
