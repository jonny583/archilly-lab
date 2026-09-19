/**
 * O MOTOR DO LABORATÓRIO DE PARCELAMENTO, na porta comum. (LAB-13)
 *
 * Ele já tinha esteira própria, do LAB-07 e do LAB-08
 * (`external-engines/testfit/adapter/src/esteira.ts`), que roda **todas** as
 * variantes e as julga uma a uma. Aqui essa esteira é envelopada na mesma
 * assinatura dos outros dois, e a escolha de qual variante representa o motor
 * segue sendo **dele**, não minha: a de melhor nota no ranking dele, entre as
 * que o esquema aceitou.
 *
 * # Por que o aparo fica LIGADO aqui, e por que isso é declarado
 *
 * Sem aparo, este motor entrega eixos que saem da gleba e o contrato recusa o
 * arquivo inteiro — medido no LAB-07, 60 de 60 variantes. O LAB-08 mediu de
 * novo depois do T02: **0 de 20 recusadas**, e o aparo corta 0,32 % do
 * comprimento. Com tão pouco a aparar, deixá-lo ligado não maquia motor nenhum,
 * e permite medir as cinco glebas com o mesmo procedimento.
 *
 * **O que foi aparado sai na medição**, como `naoSoubeFazer`, para ninguém ler
 * a tabela achando que a passagem foi limpa quando não foi.
 */
import { rodarEsteira } from "../../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../../testfit/adapter/src/contrato-v1.ts";

import type { EntradaMinima } from "../gleba-v1.ts";
import type { Rodada } from "./comum.ts";

/**
 * Os dez partidos de traçado do catálogo dele.
 *
 * Rodar no padrão de fábrica mediria **um** deles (`ortogonal`), que é um
 * décimo do motor — a mesma razão do LAB-08.
 */
export const FORMATOS = [
  "ortogonal", "espinha", "pente", "diagonal", "loop",
  "cluster", "radial", "organico", "superquadra", "mioloVerde",
] as const;

/** Quantas variantes o motor gera por rodada. O mesmo número do LAB-08. */
export const VARIANTES = 20;

export function rodarTestfit(entrada: EntradaMinima, semente: number): Rodada {
  const t0 = performance.now();
  const r = rodarEsteira(entrada as unknown as EntradaV1, {
    semente,
    variantes: VARIANTES,
    aparar: true,
    formatos: [...FORMATOS],
  });
  const ms = performance.now() - t0;

  const naoSoubeFazer: string[] = [];

  // A escolha é do motor: melhor nota DELE, entre as que o esquema aceitou.
  const julgadas = r.variantes.filter((v) => v.relatorio);
  const escolhida = julgadas.sort((a, b) => a.posicaoNoMotor - b.posicaoNoMotor)[0];

  const recusadas = r.variantes.length - julgadas.length;
  if (recusadas > 0) {
    naoSoubeFazer.push(
      `${recusadas} de ${r.variantes.length} variantes foram recusadas pelo esquema e ficaram fora do ranking`,
    );
  }
  // `comprimentoAparado_m` é o que RESTOU depois do aparo, não o que saiu — o
  // corte é a diferença. Ler o campo pelo nome dava "aparou 99,68 % do
  // comprimento" na primeira passada, que é o complemento de 0,32 % e um
  // absurdo na cara: ninguém apara 99 % de uma rede e ainda a julga.
  const original = r.variantes.reduce((s, v) => s + (v.aparo?.comprimentoOriginal_m ?? 0), 0);
  const restou = r.variantes.reduce((s, v) => s + (v.aparo?.comprimentoAparado_m ?? 0), 0);
  const cortado = original - restou;
  if (cortado > 0) {
    naoSoubeFazer.push(
      `o Lab aparou ${cortado.toFixed(1)} m de eixo que saía da gleba ` +
        `(${original > 0 ? ((100 * cortado) / original).toFixed(2) : "?"} % do comprimento) — ` +
        "sem isso o contrato recusa o arquivo",
    );
  }
  if ((entrada.relevo?.curvas?.length ?? 0) > 0) {
    naoSoubeFazer.push(
      "o relevo da gleba não muda o traçado deste motor — medido no LAB-08, lote a lote",
    );
  }
  if (entrada.atracoes?.length) {
    naoSoubeFazer.push(
      `${entrada.atracoes.length} atração(ões) na entrada não entram no traçado deste motor`,
    );
  }

  if (!escolhida) {
    return { saida: null, ms, naoSoubeFazer: [...naoSoubeFazer, "nenhuma variante passou no esquema"], variante: null };
  }

  return {
    saida: escolhida.saida,
    ms,
    naoSoubeFazer,
    variante: `${escolhida.formato} (1º de ${julgadas.length} no ranking dele)`,
  };
}
