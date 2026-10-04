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
import { auditarIda, type AchadoDaIda } from "./guarda-da-ida.ts";
import { IDA_DO_PARCELAMENTO, IDA_DO_SYMBIOS } from "./inventario-das-idas.ts";
import { oQueAEsteiraPassaPronto } from "./motores/comum.ts";
import { glebaParaOSymbios, type EntradaMinima } from "./gleba-v1.ts";
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


// ═══════════════════════════ a guarda da IDA (LAB-30) ══════════════════════

export interface IdaEmAcao {
  ida: string;
  gleba: string;
  achados: AchadoDaIda[];
}

/**
 * A ida do Laboratório de Parcelamento, auditada **como a esteira a chama**.
 *
 * Como a esteira a chama, e não como ela poderia ser chamada sozinha: é a esteira
 * que separa via desenhada de testada de frente (o remendo do LAB-13), e auditar a
 * ida sem essa separação mediria um caminho que ninguém percorre. O mesmo
 * princípio da guarda da SAÍDA, que audita a volta como a esteira a usa.
 */
export function auditarIdaDoParcelamento(entrada: EntradaMinima): IdaEmAcao {
  const v1 = entrada as unknown as EntradaV1;
  // ── A MESMA função que a esteira usa, e não uma cópia (LAB-37, D139) ───────
  //
  // Este arnês calculava só a coluna vertebral, e a esteira de verdade passa
  // também as faces da testada de frente. A guarda auditava, portanto, um caminho
  // que não era o caminho — e reprovou `atracoes` em `geo-antonina` dizendo que a
  // testada não chegava ao motor. Estava certa sobre o arnês e errada sobre a
  // esteira: guarda medindo outra coisa é pior que guarda reprovando à toa.
  const pronto = oQueAEsteiraPassaPronto(entrada);

  const { entrada: entradaMotor } = idaParaOMotor(v1, {
    semente: 1,
    variantes: 1,
    ...(pronto.viaManual ? { viaManual: pronto.viaManual } : {}),
    ...(pronto.facesLoteamento.length ? { facesLoteamento: pronto.facesLoteamento } : {}),
  });
  return {
    ida: "parcelamento",
    gleba: entrada.projeto.id ?? "sem id",
    achados: auditarIda({
      nome: "parcelamento",
      inventario: IDA_DO_PARCELAMENTO,
      doContrato: entrada as unknown as Linha,
      doMotor: entradaMotor as unknown as Linha,
    }),
  };
}

/** A ida do Symbios, auditada. */
export function auditarIdaDoSymbios(entrada: EntradaMinima): IdaEmAcao {
  const { terreno } = glebaParaOSymbios(entrada);
  return {
    ida: "symbios",
    gleba: entrada.projeto.id ?? "sem id",
    achados: auditarIda({
      nome: "symbios",
      inventario: IDA_DO_SYMBIOS,
      doContrato: entrada as unknown as Linha,
      doMotor: terreno as unknown as Linha,
    }),
  };
}

/** As duas idas, na mesma gleba. */
export const auditarAsIdas = (entrada: EntradaMinima): IdaEmAcao[] => [
  auditarIdaDoParcelamento(entrada),
  auditarIdaDoSymbios(entrada),
];
