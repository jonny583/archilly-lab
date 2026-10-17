/**
 * OS INDICADORES CRUS DA SAÍDA v1 — fora de `motores.ts` para serem conferidos sem os motores. (LAB-147, D375)
 *
 * Moraram em `motores.ts` desde o LAB-14. Saíram para cá no LAB-147 porque `motores.ts` importa o Symbios e os dois
 * motores irmãos, e a única prova de que o comprimento de via não volta a ser zero inventado precisa rodar no
 * portão sem clones (`tests/nulo-nunca-zero.test.ts`). Nada mudou de comportamento além do comprimento de via.
 */
import type { Indicadores } from "./porta.ts";

/** Os indicadores crus, lidos da SAÍDA v1. O que não há sai `null`. */
export function indicadoresDa(saida: unknown): Indicadores {
  const s = saida as {
    lotes?: unknown[];
    quadras?: unknown[];
    vias?: {
      comprimento_m?: number;
      rampaMedia_pct?: number | null;
      rampaMaxima_pct?: number | null;
    }[];
    indicadores?: { areaPrivativa_m2?: number; areaViaria_m2?: number };
  } | null;
  if (!s) {
    return {
      lotes: null, areaPrivativa_m2: null, areaViaria_m2: null,
      comprimentoDeVia_m: null, quadras: null, rampaMediaMaxima_pct: null,
      rampaPior_pct: null,
    };
  }
  const vias = s.vias ?? [];
  // Duas réguas, de propósito: a v1 só carrega a média por via, e o v2 trouxe
  // a máxima. Ver `Indicadores.rampaMediaMaxima_pct` e `rampaPior_pct`.
  const num = (r: unknown): r is number => typeof r === "number";
  const rampas = vias.map((v) => v.rampaMedia_pct).filter(num);
  const piores = vias.map((v) => v.rampaMaxima_pct).filter(num);
  return {
    lotes: s.lotes?.length ?? null,
    areaPrivativa_m2: s.indicadores?.areaPrivativa_m2 ?? null,
    areaViaria_m2: s.indicadores?.areaViaria_m2 ?? null,
    // `null` se QUALQUER via vier sem comprimento (LAB-147, D375). Antes era `v.comprimento_m ?? 0`, e a via do
    // contrato v1 do Generate não TEM campo de comprimento: a soma dava zero em toda saída com via, e a prova do
    // LAB-06 gravou `comprimentoDeVia_m: 0` nas três aprovadas — 974, 776 e 214 lotes, sem um metro de rua.
    comprimentoDeVia_m:
      vias.length && vias.every((v) => typeof v.comprimento_m === "number")
        ? vias.reduce((a, v) => a + v.comprimento_m!, 0)
        : null,
    quadras: s.quadras?.length ?? null,
    // `null`, e não zero, quando o motor não calcula greide (D23).
    rampaMediaMaxima_pct: rampas.length ? Math.max(...rampas) : null,
    // `null` aqui é "o motor não reporta o pico", não "o terreno é plano".
    rampaPior_pct: piores.length ? Math.max(...piores) : null,
  };
}
