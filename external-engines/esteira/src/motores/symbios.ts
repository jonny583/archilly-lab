/**
 * O SYMBIOS, mais a subdivisão do Lab, na porta comum. (LAB-13)
 *
 * # O que está sendo medido aqui, e o nome certo disso
 *
 * O `symbios-tensor` faz **rede viária e quadras**. Ele não parcela em lote —
 * até o LAB-08 o Judge marcava 0 lotes para ele, porque ele entregava a etapa
 * anterior à dos outros dois.
 *
 * Quem faz o lote é o **esqueleto reto escrito no Lab** (LAB-04, D50). Então a
 * linha da tabela é **"Symbios + subdivisão do Lab"**, e não "Symbios" — a
 * mesma marca que o LAB-04 e o LAB-05 usaram. Comparar um motor com uma dupla
 * sem avisar seria trapaça de medição.
 *
 * # A configuração é a do LAB-05, e ela é a melhor que existe hoje
 *
 * Os dois consertos do recorte vêm **ligados** aqui: descartar a lasca pela D48
 * e recortar a quadra que atravessa a divisa. Eles são desligados por padrão no
 * adaptador (CLAUDE.md §4), e ligá-los aqui é escolha declarada — sem eles,
 * `geo-antonina` perde 128 quadras e 138 lotes, e a comparação mediria uma
 * versão do motor que o Lab já sabe superada.
 */
import { gerarRedeViaria, Motor, recortarPelaGleba } from "@symbios/index.ts";
import type { Terreno } from "@symbios/contrato.ts";
import { areaPoligono } from "@symbios/geo.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../gleba-v1.ts";
import { symbiosParaOContrato, type LoteParaOContrato } from "../symbios-para-contrato.ts";
import { lotearQuadra, type EixoDeVia } from "../lotear.ts";
import type { Rodada } from "./comum.ts";

const n2 = (v: number) => Number(v.toFixed(2));

export function rodarSymbios(
  motor: Motor,
  entrada: EntradaMinima,
  semente: number,
  geradoEm: string,
): Rodada {
  const { terreno, perdas } = glebaParaOSymbios(entrada);
  const t = terreno as Terreno;

  const p = entrada.parametros;
  const params = {
    areaMinLote_m2: p.areaMinLote_m2 ?? 200,
    areaAlvoLote_m2: p.areaAlvoLote_m2 ?? 360,
    areaMaxLote_m2: p.areaMaxLote_m2 ?? 600,
    testadaMinLote_m: p.testadaMinLote_m ?? 10,
  };

  const t0 = performance.now();
  const bruto = gerarRedeViaria(motor, t, {}, semente);
  const corte = recortarPelaGleba(bruto, t, {
    ladoDoLoteMinimo_m: Math.sqrt(params.areaMinLote_m2),
    recortarQuadraQueAtravessa: true,
  });

  const vias: EixoDeVia[] = corte.vias.map((v) => ({ pontos: v.pontos, largura_m: v.faixaDominio_m }));
  const lotes: LoteParaOContrato[] = [];
  let puladasPeloEsqueleto = 0;
  corte.quadras.forEach((q, iq) => {
    const r = lotearQuadra(q.pontos, params, vias);
    if (r.puladaPorEsqueleto) puladasPeloEsqueleto++;
    for (const l of r.lotes) {
      lotes.push({ quadraIndice: iq, pontos: l.pontos, area_m2: n2(l.area_m2), testada_m: n2(l.testada_m) });
    }
  });
  const ms = performance.now() - t0;

  const naoSoubeFazer: string[] = perdas.map((x) => `na ida: ${x.campo} — ${x.motivo}`);
  naoSoubeFazer.push("o motor não parcela em lote: quem subdivide a quadra é o esqueleto reto do Lab (D50)");
  if (puladasPeloEsqueleto > 0) {
    naoSoubeFazer.push(
      `${puladasPeloEsqueleto} de ${corte.quadras.length} quadras foram puladas: o esqueleto não fechou nelas (D51)`,
    );
  }
  if (corte.conectividade.fracaoNoMaior < 0.99) {
    naoSoubeFazer.push(
      `a rede saiu em ${corte.conectividade.componentes} pedaços, ` +
        `${(100 * corte.conectividade.fracaoNoMaior).toFixed(1)} % no maior`,
    );
  }
  if (entrada.atracoes?.length) {
    naoSoubeFazer.push(
      `${entrada.atracoes.length} atração(ões) na entrada não entram no traçado deste motor`,
    );
  }

  const areaQueDesconta = t.restricoes
    .filter((r) => r.desconta)
    .reduce((s, r) => s + areaPoligono(r.area), 0);

  const { saida } = symbiosParaOContrato(
    corte.vias,
    corte.quadras,
    {
      projetoId: entrada.projeto.id,
      glebaId: entrada.gleba.id,
      areaDaGleba_m2: areaPoligono(t.gleba),
      areaQueDesconta_m2: areaQueDesconta,
      semente,
      versaoMotor: "0.4.1 + subdivisão do Lab (LAB-13)",
      geradoEm,
      crs: entrada.crs as never,
      parametrosUsados: entrada.parametros,
    },
    lotes,
  );

  return { saida, ms, naoSoubeFazer, variante: "tensorial + esqueleto reto" };
}
