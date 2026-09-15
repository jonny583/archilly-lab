/**
 * RECORTE DE POLÍGONO POR POLÍGONO — a quadra que atravessa a divisa. (LAB-05)
 *
 * # Por que um recortador de verdade, e não o corte por semiplano
 *
 * O `lotear.ts` corta lote com semiplano, e isso basta lá: semiplano é convexo,
 * e Sutherland–Hodgman nunca inverte o polígono. A gleba **não é convexa** —
 * `geo-antonina` é terreno real, com reentrância. Cortar uma quadra por um anel
 * côncavo com semiplanos, um de cada vez, come pedaço que estava dentro.
 *
 * E o recorte pode partir a quadra em **mais de uma peça**: uma quadra que sai e
 * volta pela divisa devolve duas. Um algoritmo que só sabe devolver um polígono
 * perderia a segunda em silêncio.
 *
 * # Greiner–Hormann, em três atos
 *
 * 1. **Achar as travessias.** Toda aresta do sujeito contra toda aresta do
 *    recorte. Cada travessia entra nas DUAS listas, na posição certa, e as duas
 *    cópias se conhecem (`par`).
 * 2. **Dizer quem entra e quem sai.** Percorrendo o sujeito, as travessias
 *    alternam entrada e saída; qual vem primeiro sai de uma pergunta só — o
 *    primeiro vértice está dentro do recorte? O mesmo do outro lado.
 * 3. **Andar.** De uma entrada, segue-se para frente no sujeito até uma saída;
 *    ali pula-se para a cópia no recorte e segue-se para frente nele até a
 *    próxima entrada; e assim até fechar. Cada volta é uma peça.
 *
 * Referência: Greiner, G. & Hormann, K. (1998), *Efficient clipping of arbitrary
 * polygons*, ACM Transactions on Graphics 17(2). A implementação é escrita aqui
 * a partir da descrição — como o esqueleto reto do LAB-04, e pela mesma razão:
 * as bibliotecas prontas ou são copyleft ou trariam dependência npm a um
 * adaptador que **não tem nenhuma** por decisão (D14).
 *
 * # A degenerescência, e o que se faz com ela
 *
 * Greiner–Hormann tem um buraco conhecido: ele pressupõe que nenhuma travessia
 * cai **exatamente** num vértice. Quando cai — e cai, porque quadra e gleba
 * compartilham vértice com frequência —, a alternância entra/sai quebra e o
 * resultado é lixo silencioso.
 *
 * Aqui a degenerescência é **detectada e contornada**: se alguma travessia cai a
 * menos de `EPS_ALFA` de um vértice, o recorte inteiro é refeito com o anel de
 * recorte **deslocado** de alguns décimos de milímetro, numa sequência fixa. O
 * deslocamento é determinístico (nada de aleatório), e o maior deles, 0,2 mm,
 * está três ordens de grandeza abaixo da folga de divisa do contrato, que é
 * 5 cm. O que ele desloca, ele declara: `deslocamentos` conta quantas tentativas
 * foram precisas.
 *
 * Se as oito tentativas falharem, a função **devolve `null`** em vez de um
 * polígono torto. Recortar errado uma quadra é plantar lote fora da gleba, que é
 * o defeito que o LAB-04 viu o Validator do Generate acusar — 97 peças fora, a
 * pior a 32 m. Vale a mesma regra do esqueleto não confiável (D51): **uma quadra
 * a menos é perda declarada; uma quadra torta é medição falsa.**
 */
import type { Anel, Ponto } from "./contrato.ts";
import { areaComSinal } from "./geo.ts";

/** Quão perto de um vértice uma travessia pode cair antes de ser degenerada. */
const EPS_ALFA = 1e-9;

/** Quão perto dois pontos podem estar e ainda serem o mesmo, em metros. */
const EPS_M = 1e-9;

/** Os deslocamentos tentados contra a degenerescência, em metros. */
const DESLOCAMENTOS = [0, 1e-7, 3e-7, 9e-7, 2.7e-6, 8.1e-6, 2.43e-5, 7.29e-5, 2.187e-4];

interface No {
  p: Ponto;
  prox: No;
  ant: No;
  /** A cópia deste mesmo ponto na outra lista. */
  par: No | null;
  travessia: boolean;
  entrada: boolean;
  visitado: boolean;
  alfa: number;
}

/** Erro interno: a degenerescência que manda tentar de novo, deslocado. */
class Degenerado extends Error {}

function fazerLista(anel: Ponto[]): No {
  const nos: No[] = anel.map((p) => ({
    p,
    prox: null as unknown as No,
    ant: null as unknown as No,
    par: null,
    travessia: false,
    entrada: false,
    visitado: false,
    alfa: 0,
  }));
  for (let i = 0; i < nos.length; i++) {
    nos[i]!.prox = nos[(i + 1) % nos.length]!;
    nos[i]!.ant = nos[(i - 1 + nos.length) % nos.length]!;
  }
  return nos[0]!;
}

/** Percorre a lista a partir de um nó, uma volta só. */
function* percorrer(inicio: No): Generator<No> {
  let n = inicio;
  do {
    yield n;
    n = n.prox;
  } while (n !== inicio);
}

/** O próximo vértice de verdade (não travessia) a partir daqui. */
function proximoVertice(n: No): No {
  let c = n.prox;
  while (c.travessia) c = c.prox;
  return c;
}

/**
 * Onde duas arestas se cruzam, em fração de cada uma.
 *
 * Devolve `null` quando são paralelas ou não se cruzam dentro dos dois
 * segmentos. Lança `Degenerado` quando o cruzamento cai em cima de um vértice —
 * ver o cabeçalho.
 */
function cruzamento(a: Ponto, b: Ponto, c: Ponto, d: Ponto): { alfa: number; beta: number } | null {
  const rx = b.x - a.x;
  const ry = b.y - a.y;
  const sx = d.x - c.x;
  const sy = d.y - c.y;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-18) return null;
  const alfa = ((c.x - a.x) * sy - (c.y - a.y) * sx) / den;
  const beta = ((c.x - a.x) * ry - (c.y - a.y) * rx) / den;
  if (alfa < -EPS_ALFA || alfa > 1 + EPS_ALFA) return null;
  if (beta < -EPS_ALFA || beta > 1 + EPS_ALFA) return null;
  if (alfa < EPS_ALFA || alfa > 1 - EPS_ALFA) throw new Degenerado("travessia sobre vértice");
  if (beta < EPS_ALFA || beta > 1 - EPS_ALFA) throw new Degenerado("travessia sobre vértice");
  return { alfa, beta };
}

/** Insere uma travessia na aresta que começa em `inicio`, na ordem do alfa. */
function inserir(inicio: No, no: No): void {
  let c = inicio;
  while (c.prox.travessia && c.prox.alfa < no.alfa) c = c.prox;
  no.prox = c.prox;
  no.ant = c;
  c.prox.ant = no;
  c.prox = no;
}

/** Ponto dentro de um anel, por cruzamentos de raio. */
function dentro(p: Ponto, anel: Ponto[]): boolean {
  let d = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const a = anel[i]!;
    const b = anel[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) d = !d;
  }
  return d;
}

/** Tira pontos repetidos consecutivos e o fechamento redundante. */
function limpar(pts: Ponto[]): Ponto[] {
  const out: Ponto[] = [];
  for (const p of pts) {
    const u = out[out.length - 1];
    if (!u || Math.hypot(p.x - u.x, p.y - u.y) > EPS_M) out.push(p);
  }
  while (out.length > 1 && Math.hypot(out[0]!.x - out[out.length - 1]!.x, out[0]!.y - out[out.length - 1]!.y) < EPS_M) {
    out.pop();
  }
  return out;
}

/** Uma passada de Greiner–Hormann, com o recorte já deslocado. */
function umaPassada(sujeito: Ponto[], recorte: Ponto[]): Ponto[][] {
  const s0 = fazerLista(sujeito);
  const c0 = fazerLista(recorte);

  // ── Ato 1 · as travessias ────────────────────────────────────────────────
  let houve = false;
  for (const s of [...percorrer(s0)].filter((n) => !n.travessia)) {
    const sa = s.p;
    const sb = proximoVertice(s).p;
    for (const c of [...percorrer(c0)].filter((n) => !n.travessia)) {
      const ca = c.p;
      const cb = proximoVertice(c).p;
      const x = cruzamento(sa, sb, ca, cb);
      if (!x) continue;
      const p = { x: sa.x + (sb.x - sa.x) * x.alfa, y: sa.y + (sb.y - sa.y) * x.alfa };
      const ns: No = { p, prox: s, ant: s, par: null, travessia: true, entrada: false, visitado: false, alfa: x.alfa };
      const nc: No = { p, prox: c, ant: c, par: null, travessia: true, entrada: false, visitado: false, alfa: x.beta };
      ns.par = nc;
      nc.par = ns;
      inserir(s, ns);
      inserir(c, nc);
      houve = true;
    }
  }

  // Sem travessia: ou o sujeito está todo dentro, ou todo fora.
  if (!houve) {
    if (dentro(sujeito[0]!, recorte)) return [sujeito.slice()];
    if (dentro(recorte[0]!, sujeito)) return [recorte.slice()];
    return [];
  }

  // ── Ato 2 · quem entra e quem sai ────────────────────────────────────────
  let estado = !dentro(s0.p, recorte);
  for (const n of percorrer(s0)) {
    if (n.travessia) {
      n.entrada = estado;
      estado = !estado;
    }
  }
  estado = !dentro(c0.p, sujeito);
  for (const n of percorrer(c0)) {
    if (n.travessia) {
      n.entrada = estado;
      estado = !estado;
    }
  }

  // ── Ato 3 · andar ────────────────────────────────────────────────────────
  const pecas: Ponto[][] = [];
  for (const partida of percorrer(s0)) {
    if (!partida.travessia || partida.visitado) continue;
    const peca: Ponto[] = [];
    let n = partida;
    let passos = 0;
    const LIMITE = (sujeito.length + recorte.length) * 4 + 64;
    do {
      n.visitado = true;
      if (n.par) n.par.visitado = true;
      const paraFrente = n.entrada;
      do {
        n = paraFrente ? n.prox : n.ant;
        peca.push(n.p);
        if (++passos > LIMITE) throw new Degenerado("a caminhada não fechou");
      } while (!n.travessia);
      n.visitado = true;
      if (!n.par) throw new Degenerado("travessia sem par");
      n = n.par;
    } while (n !== partida && passos <= LIMITE);
    const limpa = limpar(peca);
    if (limpa.length >= 3) pecas.push(limpa);
  }
  return pecas;
}

/** O que o recorte devolveu, com o que ele precisou fazer para devolver. */
export interface RecorteDePoligono {
  /** As peças do sujeito que estão dentro do recorte. Vazio = nada dentro. */
  pecas: Ponto[][];
  /** Quantos deslocamentos foram precisos contra a degenerescência. 0 = nenhum. */
  deslocamentos: number;
}

/**
 * A parte de `sujeito` que está dentro de `recorte`.
 *
 * Devolve `null` quando nem os oito deslocamentos resolveram a degenerescência —
 * e aí a quadra inteira é perda declarada, nunca peça torta.
 *
 * Os dois anéis são tratados como fechados e simples. A orientação não importa:
 * ela é normalizada para anti-horária na entrada, e as peças saem anti-horárias.
 */
export function recortarPoligono(sujeito: Ponto[], recorte: Ponto[]): RecorteDePoligono | null {
  const s = limpar(areaComSinal(sujeito as Anel) < 0 ? sujeito.slice().reverse() : sujeito.slice());
  const c = limpar(areaComSinal(recorte as Anel) < 0 ? recorte.slice().reverse() : recorte.slice());
  if (s.length < 3 || c.length < 3) return { pecas: [], deslocamentos: 0 };

  for (let k = 0; k < DESLOCAMENTOS.length; k++) {
    const d = DESLOCAMENTOS[k]!;
    const cd = d === 0 ? c : c.map((p) => ({ x: p.x + d, y: p.y + d * 0.7 }));
    try {
      const pecas = umaPassada(s, cd).map((peca) =>
        areaComSinal(peca as Anel) < 0 ? peca.slice().reverse() : peca,
      );
      return { pecas: pecas.filter((p) => Math.abs(areaComSinal(p as Anel)) > EPS_M), deslocamentos: k };
    } catch (e) {
      if (!(e instanceof Degenerado)) throw e;
    }
  }
  return null;
}
