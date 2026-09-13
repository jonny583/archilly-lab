/**
 * A ESTEIRA — terreno do contrato → motor do Testfit → parcelamento → julgamento.
 *
 * ```text
 * archilly-motor-entrada
 *        │  idaParaOMotor()
 *        ▼
 *   EntradaMotor  ──rodarMotor()──▶  SaidaMotor { opcoes[] }
 *                                          │  voltaParaOContrato()
 *                                          ▼
 *                                  archilly-motor-saida
 *                                          │  montarParcelamentoExterno()  ← do GENERATE
 *                                          ▼
 *                            esquema → Validator → Judge → relatório
 * ```
 *
 * # Por que o julgamento vem do Generate, e não daqui
 *
 * O LAB-07 é explícito: *"Nada de Validator próprio do Lab"*. O contrato diz a
 * mesma coisa pelo outro lado: ao devolver a SAÍDA, o Generate roda nela
 * **exatamente** o mesmo Validator e o mesmo Judge que roda nos motores dele —
 * sem versão leve, sem limiar mais frouxo por ser de fora.
 *
 * Um Validator do Lab seria pior que inútil: daria ao motor um "passou" que não
 * vale no cartório. Por isso este arquivo **importa** `montarParcelamentoExterno`
 * e `montarRelatorio` do Generate e não reimplementa nada. É também o que torna
 * o Lab uma esteira e não um segundo juiz.
 *
 * # A única dependência de layout que o Lab aceita
 *
 * Importar do Generate acopla o Lab ao caminho dos arquivos dele. O acoplamento
 * está confinado a este arquivo e aos aliases do `tsconfig.json`, e é o preço de
 * usar a régua do dono em vez de uma cópia dela. A alternativa — copiar o
 * Validator — seria a pior das duas: uma régua que diverge em silêncio.
 */
import { rodarMotor, type SaidaMotor } from "@testfit/api.ts";
import type { FormatoId } from "@testfit/tipos.ts";
import { medirPlano, fechamentoDeAreas, type Medidas } from "@testfit/medidas.ts";
import { configuracaoDaEntrada } from "@testfit/api.ts";
import type { Plano } from "@testfit/tipos.ts";

import {
  montarParcelamentoExterno,
  montarRelatorio,
  type RelatorioParaOMotor,
} from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { idaParaOMotor } from "./ida.ts";
import { voltaParaOContrato } from "./volta.ts";
import { apararVias, type ResultadoAparo } from "./aparo.ts";
import type { EntradaV1, Perda, SaidaV1 } from "./contrato-v1.ts";

/** A versão do motor do Testfit que a esteira está medindo. */
export const VERSAO_MOTOR_MEDIDA = "T00-A";

/**
 * Carimbo fixo no `geradoEm` da SAÍDA.
 *
 * O motor não põe data na saída **de propósito** (`docs/API_MOTOR.md`: "carimbo
 * de hora quebraria a comparação byte a byte e é justamente o que o LAB-07
 * precisa comparar"). O contrato, porém, exige `geradoEm`. A saída é o
 * contrato: quem carimba é a ponte, e o carimbo é **constante** para que dois
 * arquivos gerados da mesma entrada sejam idênticos byte a byte.
 *
 * Quando rodou de verdade fica no JSON de medições, do lado de fora.
 */
export const CARIMBO_FIXO = "2026-09-13T00:00:00.000Z";

export interface VarianteMedida {
  /** Posição no ranking do próprio motor, 1 = melhor nota dele. */
  posicaoNoMotor: number;
  formato: string;
  /** A assinatura da opção — a impressão digital do desenho, do próprio motor. */
  assinatura: string;
  notaDoMotor: number;
  saida: SaidaV1;
  /** O veredito do Validator e do Judge do Generate. `null` se o esquema recusou. */
  relatorio: RelatorioParaOMotor | null;
  /** Recusa de FORMATO, quando houver — acontece antes de qualquer julgamento. */
  recusa: { erros: string[]; avisos: string[] } | null;
  /**
   * A mesma variante **sem aparo**, para o relatório poder dizer o que o motor
   * entregou antes de o Lab consertar. `null` quando a passagem já foi fiel.
   */
  semAparo: { recusa: { erros: string[]; avisos: string[] } | null } | null;
  /** O tamanho do conserto, quando houve. */
  aparo: ResultadoAparo | null;
  /** A régua do próprio Testfit sobre o desenho pronto (a "dobra" dos lotes). */
  dobra: Medidas;
  fechamento: ReturnType<typeof fechamentoDeAreas>;
  perdasNaVolta: Perda[];
  /** Tempo de parede, em ms, da volta + julgamento desta variante. */
  ms: number;
}

export interface RodadaMedida {
  gleba: string;
  semente: number;
  variantesPedidas: number;
  /** Assinatura da rodada inteira — muda se qualquer variante mudar. */
  assinaturaDaRodada: string;
  perdasNaIda: Perda[];
  variantes: VarianteMedida[];
  tempos: { ida_ms: number; motor_ms: number; voltaEJulgamento_ms: number; total_ms: number };
  /** O que o motor avisou, por variante. */
  avisosDoMotor: string[];
}

export interface OpcoesEsteira {
  semente?: number;
  variantes?: number;
  /** Quando dado, só estas variantes são traduzidas e julgadas (0-based). */
  apenas?: number[];
  /**
   * Aparar os eixos viários pelo perímetro antes de julgar.
   *
   * **Padrão `false` de propósito.** A passagem fiel é a que responde "o que o
   * motor entrega?", e a resposta medida é: um arquivo que o contrato recusa,
   * porque todas as vias saem da gleba. Com `true`, o Lab conserta (ver
   * `aparo.ts`) e o Validator consegue rodar — que é a única forma de obter os
   * números que o LAB-07 pede. O relatório traz as duas passagens.
   */
  aparar?: boolean;
  /**
   * Os partidos de traçado que disputam a rodada.
   *
   * Sem isto vale o padrão de fábrica do motor, que é `["ortogonal"]` — **um**
   * dos dez partidos do catálogo dele. Medir no padrão mede um décimo do motor.
   */
  formatos?: readonly FormatoId[];
}

const agora = () => performance.now();

/**
 * Roda a esteira inteira sobre uma ENTRADA do contrato.
 *
 * Julga **todas** as variantes, não só a escolhida. O LAB-07 pede as duas
 * opções ("a opção escolhida, ou todas as variantes") e todas é a que responde a
 * pergunta do §2.5: se o ranking do motor põe em primeiro um plano que o
 * Validator reprova, isso só aparece medindo o ranking inteiro.
 */
export function rodarEsteira(
  entrada: EntradaV1,
  opcoes: OpcoesEsteira = {},
): RodadaMedida {
  const semente = opcoes.semente ?? 20260913;
  const variantes = opcoes.variantes ?? 12;
  const t0 = agora();

  // ------------------------------------------------------------------- ida
  const tIda = agora();
  const { entrada: entradaMotor, perdas: perdasNaIda } = idaParaOMotor(entrada, {
    semente,
    variantes,
    ...(opcoes.formatos ? { formatos: [...opcoes.formatos] } : {}),
  });
  const ida_ms = agora() - tIda;

  // ----------------------------------------------------------------- motor
  const tMotor = agora();
  const saidaMotor: SaidaMotor = rodarMotor(entradaMotor);
  const motor_ms = agora() - tMotor;

  // A configuração que o motor de fato usou — é dela que sai a faixa contra a
  // qual a régua da "dobra" confere cada lote.
  const cfg = configuracaoDaEntrada(entradaMotor);

  // ------------------------------------------------- volta + julgamento
  const tVolta = agora();
  const medidas: VarianteMedida[] = [];
  const avisosDoMotor: string[] = [];

  saidaMotor.opcoes.forEach((opcao, i) => {
    if (opcoes.apenas && !opcoes.apenas.includes(i)) return;
    const tV = agora();
    const plano: Plano = opcao.plano;
    for (const a of plano.avisos ?? []) {
      const linha = `variante ${i + 1} (${plano.formato}): ${a}`;
      if (!avisosDoMotor.includes(linha)) avisosDoMotor.push(linha);
    }

    const { saida: saidaFiel, perdas } = voltaParaOContrato(plano, entrada, {
      semente,
      versaoMotor: VERSAO_MOTOR_MEDIDA,
      geradoEm: CARIMBO_FIXO,
    });

    // Quando se apara, a passagem FIEL é medida assim mesmo — é ela que diz o
    // que o motor entregou antes de o Lab encostar no desenho.
    let semAparo: VarianteMedida["semAparo"] = null;
    let aparo: ResultadoAparo | null = null;
    let saida = saidaFiel;
    if (opcoes.aparar) {
      const fiel = montarParcelamentoExterno(saidaFiel, {
        entrada: entrada as unknown as EntradaMotorV1,
      });
      semAparo = {
        recusa: fiel.conferencia.valido
          ? null
          : { erros: fiel.conferencia.erros, avisos: fiel.conferencia.avisos },
      };
      aparo = apararVias(saidaFiel, entrada.gleba.anel);
      saida = aparo.saida;
    }

    // ── A RÉGUA DO DONO. Esquema, Validator e Judge, os do Generate. ───────
    const leitura = montarParcelamentoExterno(saida, {
      entrada: entrada as unknown as EntradaMotorV1,
    });

    medidas.push({
      posicaoNoMotor: i + 1,
      formato: plano.formato,
      assinatura: opcao.assinatura,
      notaDoMotor: plano.nota,
      saida,
      relatorio: leitura.externo ? montarRelatorio(leitura.externo, null) : null,
      recusa: leitura.conferencia.valido
        ? null
        : { erros: leitura.conferencia.erros, avisos: leitura.conferencia.avisos },
      semAparo,
      aparo,
      dobra: medirPlano(plano, entradaMotor.terreno, cfg.faixas),
      fechamento: fechamentoDeAreas(plano),
      perdasNaVolta: perdas,
      ms: agora() - tV,
    });
  });
  const voltaEJulgamento_ms = agora() - tVolta;

  return {
    gleba: entrada.projeto.id ?? entrada.projeto.nome ?? "sem id",
    semente,
    variantesPedidas: variantes,
    assinaturaDaRodada: saidaMotor.assinatura,
    perdasNaIda,
    variantes: medidas,
    tempos: { ida_ms, motor_ms, voltaEJulgamento_ms, total_ms: agora() - t0 },
    avisosDoMotor,
  };
}
