/**
 * OS TRÊS MOTORES IMPLEMENTANDO A PORTA. (LAB-14)
 *
 * A prova de que o contrato é implementável não é o documento: são estes três
 * adaptadores, cada um declarando o que sabe fazer e sendo **desmentido por
 * medição** quando declara errado (`tests/porta.test.ts`).
 *
 * Cada `capacidades()` abaixo é uma afirmação falsificável, e **todas as
 * afirmações aqui vieram de medição**, não de leitura de código: o que o LAB-13
 * mediu nas cinco glebas é o que está declarado.
 */
import { Motor } from "@symbios/index.ts";

import type { EntradaMinima } from "../gleba-v1.ts";
import { linhasDaEntrada } from "../motores/comum.ts";
import { rodarGenerate, type Candidata } from "../motores/generate.ts";
import { rodarTestfit } from "../motores/testfit.ts";
import { rodarSymbios } from "../motores/symbios.ts";
import type {
  Capacidades,
  Entrada,
  Indicadores,
  MotorNaPorta,
  NaoAtendido,
  Resultado,
} from "./porta.ts";

/** Separa via desenhada de testada de frente — o remendo do LAB-13, §2. */
export const separar = (e: EntradaMinima) => {
  const { desenhadas, testadasDeFrente } = linhasDaEntrada(e);
  return { desenhadas, testadasDeFrente };
};

/** Os indicadores crus, lidos da SAÍDA v1. O que não há sai `null`. */
function indicadoresDa(saida: unknown): Indicadores {
  const s = saida as {
    lotes?: unknown[];
    quadras?: unknown[];
    vias?: { comprimento_m?: number; rampaMedia_pct?: number | null }[];
    indicadores?: { areaPrivativa_m2?: number; areaViaria_m2?: number };
  } | null;
  if (!s) {
    return {
      lotes: null, areaPrivativa_m2: null, areaViaria_m2: null,
      comprimentoDeVia_m: null, quadras: null, rampaMediaMaxima_pct: null,
    };
  }
  const vias = s.vias ?? [];
  // `rampaMedia_pct` é o que o contrato v1 carrega; máxima por via não existe
  // na SAÍDA — ver `Indicadores.rampaMediaMaxima_pct`.
  const rampas = vias.map((v) => v.rampaMedia_pct).filter((r): r is number => typeof r === "number");
  return {
    lotes: s.lotes?.length ?? null,
    areaPrivativa_m2: s.indicadores?.areaPrivativa_m2 ?? null,
    areaViaria_m2: s.indicadores?.areaViaria_m2 ?? null,
    comprimentoDeVia_m: vias.length ? vias.reduce((a, v) => a + (v.comprimento_m ?? 0), 0) : null,
    quadras: s.quadras?.length ?? null,
    // `null`, e não zero, quando o motor não calcula greide (D23).
    rampaMediaMaxima_pct: rampas.length ? Math.max(...rampas) : null,
  };
}

/** O que a entrada trouxe e o motor não lê vira `NaoAtendido`, nunca silêncio. */
function ignorados(e: Entrada, cap: Capacidades): NaoAtendido[] {
  const fora: NaoAtendido[] = [];
  const curvas = e.v1.relevo?.curvas?.length ?? 0;
  if (curvas > 0 && !cap.leRelevo) {
    fora.push({
      campo: "relevo.curvas",
      oQueChegou: `${curvas} curvas de nível`,
      postura: "ignorei",
      consequencia: "o traçado sai igual ao de um terreno plano; rampa e corte não foram considerados",
    });
  }
  if (e.viasDesenhadas.length > 0 && !cap.respeitaViaDesenhada) {
    fora.push({
      campo: "viasDesenhadas",
      oQueChegou: `${e.viasDesenhadas.length} via(s) traçada(s) à mão`,
      postura: "ignorei",
      consequencia: "a rua que o urbanista desenhou não aparece no resultado",
    });
  }
  if (e.testadasDeFrente.length > 0 && !cap.respeitaTestadaDeFrente) {
    fora.push({
      campo: "testadasDeFrente",
      oQueChegou: `${e.testadasDeFrente.length} testada(s) de frente`,
      postura: "ignorei",
      consequencia: "nenhum lote é posto de frente para a rua que já existe na divisa",
    });
  }
  if ((e.v1.acessos?.length ?? 0) > 0 && !cap.respeitaAcesso) {
    fora.push({
      campo: "acessos",
      oQueChegou: `${e.v1.acessos!.length} acesso(s)`,
      postura: "ignorei",
      consequencia: "a rede não é ancorada na entrada do terreno; ligá-la é trabalho de quem consumir",
    });
  }
  if (!cap.aceitaSemente) {
    fora.push({
      campo: "semente",
      oQueChegou: String(e.semente),
      postura: "ignorei",
      consequencia: "este motor tem um resultado só por entrada; pedir outra variante devolve a mesma",
    });
  }
  return fora;
}

// ══════════════════════════════════════════ o motor interno do Generate

/**
 * Uma candidata do motor interno. Cada uma entra como um motor na tela — é o
 * que a decisão de família pede: **todos visíveis, todos ligados por default**.
 */
export function motorDoGenerate(candidata: Candidata): MotorNaPorta {
  return {
    capacidades: () => ({
      id: `generate-${candidata}`,
      nome: `Archilly Generate · candidata ${candidata}`,
      versao: "1",
      entrega: "lote",
      // Medido no LAB-13: com e sem relevo, saída idêntica nas cinco glebas.
      leRelevo: false,
      respeitaViaDesenhada: false,
      respeitaTestadaDeFrente: false,
      respeitaAcesso: true,
      respeitaRestricao: true,
      // Os vereditos da casa trazem `semente: null` — ele não tem semente.
      aceitaSemente: false,
      determinista: true,
      calculaGreide: false,
      exigeRelevo: false,
      geometrias: [candidata],
    }),
    gerar(e: Entrada): Resultado {
      const cap = this.capacidades();
      const r = rodarGenerate(e.v1, candidata, e.geradoEm);
      const naoAtendido = ignorados(e, cap);
      if (!r.saida) {
        naoAtendido.push({
          campo: "—",
          oQueChegou: "a gleba inteira",
          postura: "recusei",
          consequencia: `a candidata "${candidata}" não produziu plano para esta gleba`,
        });
      }
      return {
        saida: r.saida,
        indicadores: indicadoresDa(r.saida),
        semente: null,
        geometria: candidata,
        naoAtendido,
        ms: r.ms,
      };
    },
  };
}

// ══════════════════════════════════════ o Laboratório de Parcelamento

export function motorDoParcelamento(): MotorNaPorta {
  return {
    capacidades: () => ({
      id: "parcelamento",
      nome: "Laboratório de Parcelamento",
      versao: "T02",
      entrega: "lote",
      // Medido no LAB-08, lote a lote: com e sem relevo, 599 e 599; 1391 e 1391.
      leRelevo: false,
      respeitaViaDesenhada: false,
      respeitaTestadaDeFrente: false,
      respeitaAcesso: false,
      respeitaRestricao: true,
      aceitaSemente: true,
      determinista: true,
      // Ele não calcula greide: o LAB-07 mediu `rampaMedia_pct` saindo `null`.
      calculaGreide: false,
      exigeRelevo: false,
      geometrias: [
        "ortogonal", "espinha", "pente", "diagonal", "loop",
        "cluster", "radial", "organico", "superquadra", "mioloVerde",
      ],
    }),
    gerar(e: Entrada): Resultado {
      const cap = this.capacidades();
      const r = rodarTestfit(e.v1, e.semente);
      const naoAtendido = ignorados(e, cap);
      // O aparo é conserto DO LAB, não do motor — e por isso é declarado aqui.
      for (const x of r.naoSoubeFazer) {
        if (!x.startsWith("o Lab aparou")) continue;
        naoAtendido.push({
          campo: "vias (fora da gleba)",
          oQueChegou: x,
          postura: "substitui",
          consequencia: "sem o aparo do Lab o contrato recusaria o arquivo inteiro",
        });
      }
      if (!r.saida) {
        naoAtendido.push({
          campo: "—",
          oQueChegou: "a gleba inteira",
          postura: "recusei",
          consequencia: "nenhuma das variantes dele passou no esquema do contrato",
        });
      }
      return {
        saida: r.saida,
        indicadores: indicadoresDa(r.saida),
        semente: e.semente,
        geometria: r.variante?.split(" ")[0] ?? null,
        naoAtendido,
        ms: r.ms,
      };
    },
  };
}

// ═══════════════════════════════════════════════ o Symbios, com o Lab

/**
 * O Symbios **não parcela em lote** — quem subdivide a quadra dele é o esqueleto
 * reto do Lab (D50).
 *
 * Aqui ele entra declarando `entrega: "lote"`, e isso **não é mentira**: a porta
 * é da dupla, e o nome diz isso. Quem quiser o motor sozinho o encontra
 * declarando `entrega: "quadra"` — o campo existe justamente para essa diferença
 * caber no contrato.
 */
export function motorDoSymbios(wasm: Motor): MotorNaPorta {
  return {
    capacidades: () => ({
      id: "symbios",
      nome: "Symbios Tensor + subdivisão do Lab",
      versao: "0.4.1 + LAB-04",
      entrega: "lote",
      // É o único dos quatro que lê relevo: o traçado nasce do campo tensorial.
      leRelevo: true,
      respeitaViaDesenhada: false,
      respeitaTestadaDeFrente: false,
      respeitaAcesso: false,
      respeitaRestricao: true,
      aceitaSemente: true,
      determinista: true,
      // Ele é o único dos quatro que entrega greide (LAB-08).
      calculaGreide: true,
      // E precisa de relevo: sem curva de nível ele não monta o mapa de alturas.
      exigeRelevo: true,
      geometrias: ["tensorial"],
    }),
    gerar(e: Entrada): Resultado {
      const cap = this.capacidades();
      const t0 = performance.now();
      let r;
      try {
        r = rodarSymbios(wasm, e.v1, e.semente, e.geradoEm);
      } catch (erro) {
        // A porta proíbe estourar: o que ele não consegue fazer volta como
        // recusa, com a razão escrita. Aqui é o caso do `exigeRelevo`.
        return {
          saida: null,
          indicadores: indicadoresDa(null),
          semente: e.semente,
          geometria: null,
          naoAtendido: [
            {
              campo: "relevo.curvas",
              oQueChegou: `${e.v1.relevo?.curvas?.length ?? 0} curvas de nível`,
              postura: "recusei",
              consequencia: `este motor precisa de relevo para traçar: ${erro instanceof Error ? erro.message : String(erro)}`,
            },
          ],
          ms: performance.now() - t0,
        };
      }
      const naoAtendido = ignorados(e, cap);
      naoAtendido.push({
        campo: "lotes",
        oQueChegou: "os parâmetros de lote da gleba",
        postura: "substitui",
        consequencia:
          "o motor entrega via e quadra; quem subdivide a quadra em lote é o esqueleto reto do Lab (D50)",
      });
      return {
        saida: r.saida,
        indicadores: indicadoresDa(r.saida),
        semente: e.semente,
        geometria: "tensorial",
        naoAtendido,
        ms: r.ms,
      };
    },
  };
}
