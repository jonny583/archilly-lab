/**
 * A GUARDA RODANDO — as duas pontes auditadas com o motor de verdade. (LAB-25)
 *
 * A guarda só vale se olhar o objeto que o motor devolveu, não o tipo dele: tipo
 * é promessa, objeto é fato. Por isso aqui não há `import type` de contrato
 * nenhum para montar as amostras — o caminho é o mesmo que a esteira percorre,
 * e o que se lê são as chaves que **existem em tempo de execução**.
 *
 * Um só lugar monta isso, e o teste e a ferramenta do LAB-25 bebem dele: duas
 * montagens da mesma coisa envelheceriam em direções diferentes, que é o defeito
 * que esta guarda inteira existe para impedir.
 */
import { areaPoligono } from "@symbios/geo.ts";
import type { Motor } from "@symbios/index.ts";
import { rodarMotor } from "@testfit/api.ts";

import { CARIMBO_FIXO } from "../../testfit/adapter/src/esteira.ts";
import { idaParaOMotor } from "../../testfit/adapter/src/ida.ts";
import { voltaParaOContrato } from "../../testfit/adapter/src/volta.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { auditarPonte, type Achado } from "./guarda-da-ponte.ts";
import type { EntradaMinima } from "./gleba-v1.ts";
import {
  objetosDaPonteDoParcelamento,
  objetosDaPonteDoSymbios,
} from "./inventario-das-pontes.ts";
import { redeDoSymbios, VERSAO_DO_SYMBIOS } from "./motores/symbios.ts";
import { symbiosParaOContrato } from "./symbios-para-contrato.ts";

type Linha = Record<string, unknown>;

export interface PonteEmAcao {
  ponte: string;
  gleba: string;
  /** Quantas amostras de cada objeto entraram na auditoria. */
  amostras: Record<string, number>;
  achados: Achado[];
}

/** O partido de traçado da auditoria. Um só, porque a guarda olha CAMPO, não desenho. */
export const FORMATO_DA_GUARDA = "ortogonal" as const;

/**
 * A ponte do Laboratório de Parcelamento, auditada.
 *
 * A auditoria olha a SAÍDA **antes do aparo**: o aparo é conserto declarado do
 * Lab (CLAUDE.md §4) e mexe em geometria, não em campo. Auditar depois dele
 * mediria o conserto, não a tradução.
 */
export function auditarParcelamento(entrada: EntradaMinima, semente: number): PonteEmAcao {
  const v1 = entrada as unknown as EntradaV1;
  const { entrada: entradaMotor } = idaParaOMotor(v1, {
    semente,
    variantes: 1,
    formatos: [FORMATO_DA_GUARDA],
  });
  const saidaMotor = rodarMotor(entradaMotor);
  const plano = saidaMotor.opcoes[0]?.plano as unknown as Linha | undefined;
  if (!plano) {
    throw new Error("a guarda não tem o que auditar: o motor do Parcelamento não devolveu plano");
  }
  const { saida } = voltaParaOContrato(plano as never, v1, {
    semente,
    geradoEm: CARIMBO_FIXO,
    rotuloDoLab: "archilly-lab · guarda da ponte (LAB-25)",
  });
  const objetos = objetosDaPonteDoParcelamento(plano, saida as unknown as Linha);
  return {
    ponte: "parcelamento",
    gleba: entrada.projeto.id ?? "sem id",
    amostras: Object.fromEntries(objetos.map((o) => [o.nome, o.doMotor.length])),
    achados: auditarPonte("parcelamento", objetos),
  };
}

/** A ponte do Symbios, auditada. */
export function auditarSymbios(
  motor: Motor,
  entrada: EntradaMinima,
  semente: number,
  geradoEm = CARIMBO_FIXO,
): PonteEmAcao {
  const { t, corte } = redeDoSymbios(motor, entrada, semente);
  const { saida } = symbiosParaOContrato(corte.vias, corte.quadras, {
    projetoId: entrada.projeto.id,
    glebaId: entrada.gleba.id,
    areaDaGleba_m2: areaPoligono(t.gleba),
    areaQueDesconta_m2: 0,
    semente,
    versaoMotor: VERSAO_DO_SYMBIOS,
    acrescimoDoLab: "guarda da ponte (LAB-25)",
    geradoEm,
    crs: entrada.crs as never,
    parametrosUsados: entrada.parametros as never,
  });
  const objetos = objetosDaPonteDoSymbios(
    corte.vias as unknown as Linha[],
    corte.quadras as unknown as Linha[],
    saida as unknown as Linha,
  );
  return {
    ponte: "symbios",
    gleba: entrada.projeto.id ?? "sem id",
    amostras: Object.fromEntries(objetos.map((o) => [o.nome, o.doMotor.length])),
    achados: auditarPonte("symbios", objetos),
  };
}

/** As duas pontes, na mesma gleba. */
export function auditarAsPontes(
  motor: Motor,
  entrada: EntradaMinima,
  semente: number,
): PonteEmAcao[] {
  return [auditarParcelamento(entrada, semente), auditarSymbios(motor, entrada, semente)];
}
