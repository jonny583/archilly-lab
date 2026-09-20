/**
 * AS GLEBAS DE REFERÊNCIA COM VIA DESENHADA À MÃO. (LAB-17)
 *
 * # Por que elas precisaram existir
 *
 * O LAB-13 foi mandado medir *"aderência a via desenhada à mão quando
 * aplicável"* e descobriu que **não era aplicável em nenhuma das cinco glebas**:
 * quatro não têm atração nenhuma, e a quinta tem uma **testada de frente** sobre
 * a divisa, que é outra coisa (D64).
 *
 * E é justamente o que a tela unificada precisa comparar: o urbanista traça a
 * via principal com a mão e quer ver **qual motor a respeita**. Sem gleba com
 * via desenhada, a pergunta não tem onde ser feita.
 *
 * # As duas, e por que duas
 *
 * - **`ensaio-com-via`** — o retângulo de 47 ha, onde o traçado imposto é
 *   **inequívoco**: uma principal no meio do lado maior e três secundárias
 *   perpendiculares. Se um motor falhar aqui, falha em qualquer lugar;
 * - **`antonina-com-via`** — o terreno real de 141,8 ha, com as três APP, e a
 *   principal **atravessando a APP hídrica de propósito**. É a gleba onde a
 *   **D69** tem o que dizer: a via desenhada é intenção explícita e atravessa a
 *   APP sem precisar de critério.
 *
 * # O que NÃO se inventou aqui
 *
 * O traçado é geométrico — meio do lado, perpendiculares igualmente espaçadas —
 * e **não é projeto de urbanismo**. Ele existe para ser uma **imposição
 * conhecida** contra a qual se mede aderência, não para ser um bom partido. Um
 * traçado "bonito" inventado por mim seria regra urbanística disfarçada de
 * fixture, e o CLAUDE.md §4 proíbe.
 */
import type { EntradaMinima } from "./gleba-v1.ts";

/** Um ponto, em metros. */
export interface P {
  x: number;
  y: number;
}

/** Uma via desenhada à mão, como ela entra na ENTRADA. */
export interface ViaDesenhada {
  id: string;
  nome: string;
  papel: "principal" | "secundaria";
  pontos: P[];
}

/** A caixa envolvente de um anel. */
function caixa(anel: P[]): { x0: number; y0: number; x1: number; y1: number } {
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
  return { x0, y0, x1, y1 };
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
 * Apara uma linha para ficar **dentro** da gleba, com folga da divisa.
 *
 * Sem isto, a via desenhada sairia do terreno e a aderência mediria contra uma
 * linha que motor nenhum poderia seguir sem violar a divisa. A folga é a mesma
 * do contrato, 5 cm, aqui arredondada para 1 m — é fixture, não geometria fina.
 */
function aparar(linha: P[], anel: P[], passo = 2): P[] {
  const dentroDaGleba: P[] = [];
  for (let i = 1; i < linha.length; i++) {
    const a = linha[i - 1]!;
    const b = linha[i]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    const n = Math.max(1, Math.ceil(d / passo));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      if (dentro(p, anel)) dentroDaGleba.push(p);
    }
  }
  if (dentroDaGleba.length < 2) return [];
  // Só as pontas: uma via desenhada à mão é uma reta, não uma nuvem de pontos.
  return [dentroDaGleba[0]!, dentroDaGleba[dentroDaGleba.length - 1]!];
}

/**
 * O traçado imposto: uma principal pelo meio, e `quantas` secundárias
 * perpendiculares a ela, igualmente espaçadas.
 *
 * A principal segue o **lado maior** da caixa da gleba — é a direção em que um
 * terreno comprido pede via principal, e é a escolha que menos inventa.
 */
export function tracadoImposto(anel: P[], quantas = 3): ViaDesenhada[] {
  const c = caixa(anel);
  const largura = c.x1 - c.x0;
  const altura = c.y1 - c.y0;
  const horizontal = largura >= altura;

  const vias: ViaDesenhada[] = [];

  // A principal, pelo meio do lado maior.
  const meio = horizontal ? (c.y0 + c.y1) / 2 : (c.x0 + c.x1) / 2;
  const principal = horizontal
    ? [{ x: c.x0, y: meio }, { x: c.x1, y: meio }]
    : [{ x: meio, y: c.y0 }, { x: meio, y: c.y1 }];
  const principalAparada = aparar(principal, anel);
  if (principalAparada.length === 2) {
    vias.push({
      id: "VD1",
      nome: "Via principal desenhada",
      papel: "principal",
      pontos: principalAparada,
    });
  }

  // As secundárias, perpendiculares, igualmente espaçadas ao longo da principal.
  for (let i = 1; i <= quantas; i++) {
    const t = i / (quantas + 1);
    const onde = horizontal ? c.x0 + (c.x1 - c.x0) * t : c.y0 + (c.y1 - c.y0) * t;
    const linha = horizontal
      ? [{ x: onde, y: c.y0 }, { x: onde, y: c.y1 }]
      : [{ x: c.x0, y: onde }, { x: c.x1, y: onde }];
    const aparada = aparar(linha, anel);
    if (aparada.length === 2) {
      vias.push({
        id: `VD${i + 1}`,
        nome: `Via secundária desenhada ${i}`,
        papel: "secundaria",
        pontos: aparada,
      });
    }
  }

  return vias;
}

/**
 * Põe as vias desenhadas numa ENTRADA v1, como `atracoes`.
 *
 * **O contrato v1 não tem tipo para "via desenhada à mão"** — ele tem
 * `via_existente`, que quer dizer duas coisas (D64). Aqui elas entram como
 * `via_existente` **dentro da gleba**, que é como a separação por medição as
 * reconhece; e o `papel` viaja no nome, porque o contrato também não tem campo
 * para ele.
 *
 * As duas faltas estão pedidas no §3 e no §10 do
 * `CONTRATO_MOTOR_UNIFICADO_v1.md`. Enquanto não vierem, **isto é remendo, e
 * está declarado como tal.**
 */
export function comViasDesenhadas(base: EntradaMinima, vias: ViaDesenhada[]): EntradaMinima {
  return {
    ...base,
    atracoes: [
      ...(base.atracoes ?? []),
      ...vias.map(
        (v) =>
          ({
            id: v.id,
            tipo: "via_existente",
            nome: `${v.nome} (${v.papel})`,
            geometria: { tipo: "linha", pontos: v.pontos },
          }) as never,
      ),
    ],
  };
}
