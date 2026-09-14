/**
 * O resultado do Symbios → a SAÍDA do contrato de motor v1.
 *
 * # O que este motor entrega, e o que ele não entrega
 *
 * O Symbios faz **rede viária** (Uso B) e **quadras** (Uso C). Ele **não
 * parcela em lote**. Então a SAÍDA sai com `lotes: []`, e isso não é buraco
 * disfarçado: é o que o motor é. Medido na esteira do LAB-02, o Validator do
 * Generate **julga um parcelamento sem lote sem reclamar do vazio** — ele mede
 * o que existe: contorno, face de quadra, polígono simples, sobreposição.
 *
 * O Judge vai dar `numLotes: 0`. Isso é correto e é a notícia: enquanto não
 * houver subdivisão de quadra (o LAB-04, o straight skeleton), o Symbios não
 * disputa com um motor que faz lote — ele entrega a etapa anterior.
 *
 * # O que NÃO é inventado
 *
 * - **`rampaMedia_pct`**: o Symbios mede, então vai preenchida. É o contrário
 *   do outro motor, que não calcula greide e sai `null` (LAB-07, §7).
 * - **`lotes`, `areasEspeciais`**: vazios, não fabricados.
 * - **`areaPrivativa_m2`**: zero de verdade — não há lote.
 * - **`areaViaria_m2`**: comprimento × faixa de domínio, com o cruzamento
 *   contado duas vezes onde duas vias se cruzam. É **estimativa declarada**, e
 *   o contrário disso seria construir o leito como polígono, que é geometria
 *   que o motor não desenhou.
 */
import type { Quadra, Via } from "@symbios/contrato.ts";

/** Um ponto do contrato. */
export interface PontoV1 {
  x: number;
  y: number;
}

/** O mínimo da SAÍDA v1 que esta esteira escreve. */
export interface SaidaMinima {
  archilly: { schema: "archilly-motor-saida"; versao: string; origem: string; geradoEm: string };
  motor: { nome: string; versao: string; semente: string | null };
  entrada: { projetoId: string | null; glebaId: string | null; contrato: string };
  crs: { codigo: string; unidade: "m"; origemGeografica: { lat: number; lon: number } | null };
  vias: {
    id: string;
    hierarquia: "principal" | "secundaria" | "local" | "acesso";
    pontos: PontoV1[];
    largura_m: number;
    rampaMedia_pct: number | null;
  }[];
  quadras: { id: string; pontos: PontoV1[]; area_m2: number }[];
  lotes: never[];
  areasEspeciais: never[];
  quadroDeAreas: {
    areaTotal_m2: number;
    areaPrivativa_m2: number;
    areaViaria_m2: number;
    areaLazer_m2: number;
    areaAPP_m2: number;
    areaNaoAproveitada_m2: number;
  };
  parametrosUsados: Record<string, number | null>;
}

export interface OpcoesVolta {
  projetoId: string;
  glebaId: string;
  areaDaGleba_m2: number;
  /** Área das restrições que descontam, em m². Vira `areaAPP_m2`. */
  areaQueDesconta_m2: number;
  semente: number;
  versaoMotor: string;
  geradoEm: string;
  crs: { codigo: string; unidade: "m"; origemGeografica: { lat: number; lon: number } | null };
  parametrosUsados: Record<string, number | null>;
}

/** O que não atravessou a volta, com o motivo. */
export interface PerdaNaVolta {
  campo: string;
  oQueHavia: string;
  motivo: string;
  gravidade: "alta" | "media" | "baixa";
}

export function symbiosParaOContrato(
  vias: Via[],
  quadras: Quadra[],
  o: OpcoesVolta,
): { saida: SaidaMinima; perdas: PerdaNaVolta[] } {
  const perdas: PerdaNaVolta[] = [];

  const comprimentoTotal = vias.reduce((s, v) => s + v.comprimento_m, 0);
  const areaViaria = vias.reduce((s, v) => s + v.comprimento_m * v.faixaDominio_m, 0);
  if (vias.length > 0) {
    perdas.push({
      campo: "quadroDeAreas.areaViaria_m2",
      oQueHavia: `${comprimentoTotal.toFixed(0)} m de eixo`,
      motivo:
        "o motor devolve EIXO, não leito: a área viária aqui é comprimento × faixa de " +
        "domínio, e onde duas vias se cruzam o cruzamento é contado duas vezes. " +
        "Construir o leito como polígono seria desenhar geometria que o motor não fez",
      gravidade: "media",
    });
  }

  perdas.push({
    campo: "lotes",
    oQueHavia: "nada",
    motivo:
      "o Symbios traça via e extrai quadra; ele não subdivide quadra em lote. A " +
      "subdivisão é o LAB-04 (straight skeleton). O Judge vai marcar 0 lotes, e é " +
      "verdade — não é falha da ponte",
    gravidade: "alta",
  });

  perdas.push({
    campo: "areasEspeciais",
    oQueHavia: "nada",
    motivo:
      "o motor não reserva lazer, doação nem institucional: ele não conhece esses " +
      "conceitos. Inventá-los aqui daria ao quadro de áreas um número que ninguém mediu",
    gravidade: "media",
  });

  const naoAproveitada = Math.max(
    0,
    o.areaDaGleba_m2 - areaViaria - o.areaQueDesconta_m2,
  );

  return {
    saida: {
      archilly: {
        schema: "archilly-motor-saida",
        versao: "1",
        origem: `archilly-lab · esteira · Symbios ${o.versaoMotor}`,
        geradoEm: o.geradoEm,
      },
      motor: { nome: "symbios-tensor", versao: o.versaoMotor, semente: String(o.semente) },
      entrada: { projetoId: o.projetoId, glebaId: o.glebaId, contrato: "1" },
      crs: o.crs,
      vias: vias.map((v) => ({
        id: v.id,
        // O Symbios distingue contorno × gradiente, que é principal × local. O
        // contrato tem quatro níveis; usar os dois que existem é mais honesto
        // que espalhar por quatro para parecer completo.
        hierarquia: v.tipo === "principal" ? ("principal" as const) : ("local" as const),
        pontos: v.pontos.map((p) => ({ x: p.x, y: p.y })),
        largura_m: v.faixaDominio_m,
        rampaMedia_pct: v.rampaMedia_pct,
      })),
      quadras: quadras.map((q) => ({
        id: q.id,
        pontos: q.pontos.map((p) => ({ x: p.x, y: p.y })),
        area_m2: q.area_m2,
      })),
      lotes: [],
      areasEspeciais: [],
      quadroDeAreas: {
        areaTotal_m2: o.areaDaGleba_m2,
        areaPrivativa_m2: 0,
        areaViaria_m2: areaViaria,
        areaLazer_m2: 0,
        areaAPP_m2: o.areaQueDesconta_m2,
        areaNaoAproveitada_m2: naoAproveitada,
      },
      parametrosUsados: o.parametrosUsados,
    },
    perdas,
  };
}

/** Só para o relatório: a área de quadra que o motor extraiu. */
export const areaDeQuadras = (quadras: Quadra[]): number =>
  quadras.reduce((s, q) => s + q.area_m2, 0);
