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
import { MOTOR_VERSAO } from "@testfit/contrato/tipos.ts";

import { rodarSymbios, VERSAO_DO_SYMBIOS } from "../motores/symbios.ts";
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
    comprimentoDeVia_m: vias.length ? vias.reduce((a, v) => a + (v.comprimento_m ?? 0), 0) : null,
    quadras: s.quadras?.length ?? null,
    // `null`, e não zero, quando o motor não calcula greide (D23).
    rampaMediaMaxima_pct: rampas.length ? Math.max(...rampas) : null,
    // `null` aqui é "o motor não reporta o pico", não "o terreno é plano".
    rampaPior_pct: piores.length ? Math.max(...piores) : null,
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
    // Quem LÊ a via e não assenta nela não "ignorou": ele substituiu. A distinção
    // importa para quem lê o resultado — "não apareceu" e "entrou como coluna
    // vertebral e o traçado saiu por perto" são dois desenhos diferentes (LAB-30).
    fora.push(
      cap.leViaDesenhada
        ? {
            campo: "viasDesenhadas",
            oQueChegou: `${e.viasDesenhadas.length} via(s) traçada(s) à mão`,
            postura: "substitui",
            consequencia:
              "a mais longa entrou como coluna vertebral e mudou o traçado, mas as ruas " +
              "geradas não ficam SOBRE a linha desenhada — a aderência medida é baixa. As " +
              "outras linhas não entraram: o motor tem uma coluna vertebral só",
          }
        : {
            campo: "viasDesenhadas",
            oQueChegou: `${e.viasDesenhadas.length} via(s) traçada(s) à mão`,
            postura: "ignorei",
            consequencia: "a rua que o urbanista desenhou não aparece no resultado",
          },
    );
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
      relevoMudaOTracado: false,
      // Medido por diferença no LAB-23 e remedido no LAB-30: a SAÍDA destas duas
      // candidatas é byte a byte idêntica com e sem a via no arquivo.
      leViaDesenhada: false,
      respeitaViaDesenhada: false,
      // Medido no LAB-32, com a mesma régua dos outros três: a fração do
      // comprimento de eixo a menos de 10° da linha fica IDÊNTICA com e sem a via
      // (ortogonal 69,3 % nas duas, espinha 1,1 % nas duas, em `antonina-com-via`).
      // Não é desobediência: não há campo onde a linha entre.
      alinhaOPartidoAViaDesenhada: false,
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
      // ── A versão é a que o MOTOR publica (LAB-29, D117) ──────────────────
      //
      // Passou por três etapas, e vale lembrar as três: era `"T02"` aqui e
      // `"T00-A"` na esteira — duas respostas, nenhum teste conferindo (D108). O
      // LAB-26 as unificou numa só, e a unificação ainda era **rótulo de prompt
      // do Lab**. Agora é `MOTOR_VERSAO`, do próprio motor, e não há mais cópia
      // nenhuma para envelhecer.
      versao: MOTOR_VERSAO,
      entrega: "lote",
      // ── As duas respostas são DIFERENTES para este motor (LAB-22) ───────
      //
      // Ele **lê** o relevo: desde o T03 dele, de 14/09, mede a rampa média e
      // máxima de cada via a partir das cotas do terreno. E **não desvia** por
      // causa dela — medido no LAB-08, lote a lote: com e sem relevo, 599 e
      // 599 lotes, 1 391 e 1 391, geometria idêntica.
      //
      // Até o LAB-22 este motor declarava `leRelevo: false`, e a declaração
      // **passou de verdadeira a falsa sem ninguém mexer nela** — porque o que
      // mudou foi o motor, e a ponte do Lab levou três semanas para notar.
      leRelevo: true,
      relevoMudaOTracado: false,
      // ── As duas respostas DIFEREM aqui também, e a razão é um defeito meu ──
      //
      // Ele **lê** a via desenhada: o campo `viaManual` existe no motor desde
      // sempre, e desde o LAB-30 a ida do Lab o preenche — `antonina-com-via` vai
      // de 25 para 32 vias, e a SAÍDA deixa de ser idêntica sem a via.
      //
      // E ele **não assenta os eixos nela**: a aderência medida fica em 11 %. Ler
      // e seguir são perguntas diferentes, como `leRelevo` e `relevoMudaOTracado`
      // (D100) — e aqui elas só puderam ser separadas depois que a via começou a
      // chegar ao motor. Até o LAB-30 eu publicava que *o motor* ignorava a via
      // desenhada; quem a ignorava era a minha ponte (D119).
      leViaDesenhada: true,
      respeitaViaDesenhada: false,
      // ── A TERCEIRA resposta, e ela é SIM (LAB-32, D127) ─────────────────
      //
      // `respeitaViaDesenhada: false` acima é literalmente verdade — ele não
      // assenta eixo na linha. Mas o campo `viaManual` do motor faz outra coisa:
      // a DIREÇÃO da linha vira o ângulo base do partido (`anguloBase`), e a
      // faixa dela vira área bloqueada (`faixaDaViaManual`). As duas são
      // cumpridas, medidas em `antonina-com-via`: a 10°, ortogonal 0,0 → 72,9 %,
      // pente 0,0 → 82,7 %, loop 0,0 → 72,4 %; e lotes com o CENTRO dentro da
      // faixa vão a 0 em 10 de 10 partidos, nas duas glebas.
      //
      // Era a régua do Lab que media uma terceira coisa, e lia obediência como
      // queda: eu publiquei a aderência caindo de 17,4 % para 11,2 % quando
      // finalmente entreguei a via, sem investigar.
      alinhaOPartidoAViaDesenhada: true,
      respeitaTestadaDeFrente: false,
      // ── MEDIDO no LAB-26, e a declaração estava errada ───────────────────
      //
      // Dizia `false`. A ida deste adaptador **passa o acesso** ao motor
      // (`Terreno.acesso`, `ida.ts`), e o motor parte dali: movendo o acesso
      // 992,6 m entre os dois vértices mais distantes de `ensaio-47ha`, o
      // traçado muda e os lotes vão de **703 para 603** — 14 % de diferença.
      //
      // `respeitaAcesso` não tinha experimento nenhum até este prompt, e foi
      // justamente nele que a declaração estava falsa. É o argumento inteiro da
      // porta numa linha: campo sem experimento é campo que ninguém conferiu.
      respeitaAcesso: true,
      respeitaRestricao: true,
      aceitaSemente: true,
      determinista: true,
      // Ele CALCULA greide desde o T03 dele (14/09). O `null` que o LAB-07
      // mediu era da ponte do Lab, que descartava a medida — não do motor.
      calculaGreide: true,
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
      // A versão do UPSTREAM, citada ao `upstream/VERSION` e conferida por teste
      // (LAB-29). O "+ subdivisão do Lab" é do Lab e vive no `nome` acima, que é
      // rótulo de tela — a versão é do motor, e só dele.
      versao: VERSAO_DO_SYMBIOS,
      entrega: "lote",
      // É o único dos quatro que lê relevo: o traçado nasce do campo tensorial.
      leRelevo: true,
      // O traçado dele NASCE do campo tensorial do relevo: sem relevo ele
      // recusa, e com relevo diferente o traçado é outro.
      relevoMudaOTracado: true,
      // O Symbios não tem conceito de atração: o traçado dele nasce do campo
      // tensorial do relevo, e não há onde pendurar uma linha. Provado por
      // diferença no LAB-23 e remedido no LAB-30.
      leViaDesenhada: false,
      respeitaViaDesenhada: false,
      // Medido no LAB-32: alinhamento a 10° idêntico com e sem a via
      // (15,0 % nas duas, em `antonina-com-via`) — o Symbios não tem onde
      // pendurar uma linha, e isto é a terceira medição a dizer o mesmo.
      alinhaOPartidoAViaDesenhada: false,
      respeitaTestadaDeFrente: false,
      // MEDIDO no LAB-26, e aqui a declaração estava CERTA: movendo o acesso
      // 992,6 m em `ensaio-47ha`, a geometria sai **idêntica** e os lotes ficam
      // em 214. O motor não recebe ponto de acesso — a ida já declara a perda
      // (`gleba-v1.ts`), e ligar a rede ao acesso é trabalho de quem consumir.
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
