/**
 * O MOTOR INTERNO DO GENERATE, entrando pela mesma porta que os de fora. (LAB-13)
 *
 * # Por que ele dá a volta inteira
 *
 * O motor da casa produz `ResultadoMotor` direto, e medi-lo por aí seria mais
 * curto. Não se faz: ele seria o **único dos três a não atravessar o contrato**,
 * e qualquer perda de tradução ficaria invisível justamente no motor de
 * referência. Aqui ele sai em SAÍDA v1, como os outros, e é a SAÍDA que é
 * julgada.
 *
 * # As duas candidatas, medidas separadas
 *
 * `gerarPlano` é o **juiz** de duas candidatas — a ortogonal e a espinha — e
 * devolve a vencedora. Medir só a vencedora esconderia metade do motor, então
 * cada uma roda isolada, pelo quinto argumento posicional.
 *
 * **Esse quinto argumento é posicional de propósito, e o próprio Generate
 * documenta por quê:** passá-lo dentro de `opcoes` é aceito em silêncio e não
 * isola nada — as duas candidatas rodam e volta o plano do juiz. Custou-lhes
 * uma medição errada (A254). Aqui ele vai no lugar certo, e o rótulo de cada
 * linha da tabela diz qual candidata é.
 */
import { gerarPlano, PARAMS_PADRAO_V1 } from "@generate/engine/gerar-v1.ts";
import type { GerarV1Params } from "@generate/engine/gerar-v1.ts";
import type { ResultadoMotor } from "@generate/engine/gerar-v1-motor.ts";
import { paraSaida } from "@generate/contratos/motor-v1/traducao.ts";

import type { EntradaMinima } from "../gleba-v1.ts";
import type { P, Rodada } from "./comum.ts";

/** As duas candidatas que o motor interno oferece. */
export const CANDIDATAS = ["ortogonal", "espinha"] as const;
export type Candidata = (typeof CANDIDATAS)[number];

/**
 * Os parâmetros da gleba, traduzidos para os do motor interno.
 *
 * O que a gleba não declara fica com o padrão do próprio Generate — e não com
 * um padrão meu. Inventar valor aqui seria medir o motor deles com parâmetro
 * que o produto nunca usa.
 */
export function parametrosDoGenerate(entrada: EntradaMinima): GerarV1Params {
  const p = entrada.parametros;
  const n = (v: number | null | undefined, padrao: number | undefined) =>
    typeof v === "number" && Number.isFinite(v) ? v : (padrao ?? 0);
  return {
    ...PARAMS_PADRAO_V1,
    areaMin: n(p.areaMinLote_m2, PARAMS_PADRAO_V1.areaMin),
    areaAlvo: n(p.areaAlvoLote_m2, PARAMS_PADRAO_V1.areaAlvo),
    areaMax: n(p.areaMaxLote_m2, PARAMS_PADRAO_V1.areaMax),
    testadaMin: n(p.testadaMinLote_m, PARAMS_PADRAO_V1.testadaMin),
    larguraRua: n(p.caixaViariaMin_m, PARAMS_PADRAO_V1.larguraRua),
    caixaPrincipal: n(p.caixaPrincipal_m, PARAMS_PADRAO_V1.caixaPrincipal),
    caixaSecundaria: n(p.caixaSecundaria_m, PARAMS_PADRAO_V1.caixaSecundaria),
    faceQuadraMax: n(p.faceQuadraMax_m, PARAMS_PADRAO_V1.faceQuadraMax),
  };
}

/** Cala o motor: ele fala muito no console, e a medição não é sobre isso. */
function semRuido<T>(f: () => T): T {
  const log = console.log;
  const warn = console.warn;
  const info = console.info;
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  try {
    return f();
  } finally {
    console.log = log;
    console.warn = warn;
    console.info = info;
  }
}

/**
 * Roda uma candidata do motor interno e devolve a SAÍDA no contrato v1.
 *
 * `semente` entra na assinatura e **não é usada**: o motor interno não tem
 * semente — os vereditos da casa trazem `semente: null`. Declarar isso é o
 * ponto, não escondê-lo: o campo existe na porta, e este motor diz que não o lê.
 */
export function rodarGenerate(
  entrada: EntradaMinima,
  candidata: Candidata,
  geradoEm: string,
): Rodada {
  const anel: P[] = entrada.gleba.anel.map((p) => ({ x: p.x, y: p.y }));
  const restricoes: P[][] = entrada.restricoes
    .filter((r) => r.desconta)
    .map((r) => r.geometria.aneis?.[0] ?? [])
    .filter((a) => a.length >= 3);
  const acesso = (entrada.acessos?.[0] as { ponto?: P } | undefined)?.ponto;

  const naoSoubeFazer: string[] = [];
  if (!acesso) {
    naoSoubeFazer.push(
      "a gleba não declarou acesso; o motor escolheu um sozinho, e o traçado depende dessa escolha",
    );
  }
  if ((entrada.relevo?.curvas?.length ?? 0) > 0) {
    naoSoubeFazer.push(
      "o relevo da gleba não foi usado: este motor não lê curva de nível no traçado",
    );
  }
  if (entrada.atracoes?.length) {
    naoSoubeFazer.push(
      `${entrada.atracoes.length} atração(ões) na entrada não entram no traçado deste motor`,
    );
  }

  const params = parametrosDoGenerate(entrada);
  const opcoes = {
    pctAPP: typeof entrada.parametros.pctAPP === "number" ? entrada.parametros.pctAPP : undefined,
    pctLazer:
      typeof entrada.parametros.pctLazer === "number" ? entrada.parametros.pctLazer : undefined,
    // `valorM2` entra porque o script de glebas-padrão do Generate o passa, e
    // sem ele esta esteira dava 1657 lotes em `geo-antonina` contra os 1656 do
    // veredito publicado por eles. Um lote de diferença bastaria para alguém
    // procurar defeito onde havia só uma opção a menos na chamada.
    valorM2: 400,
  };

  const t0 = performance.now();
  const plano = semRuido(() =>
    gerarPlano(
      anel,
      params,
      { acessoOverride: acesso, restricoes },
      opcoes,
      // ⚠️ posicional — ver o cabeçalho.
      { ortogonal: candidata === "ortogonal", espinha: candidata === "espinha" },
    ),
  );
  const ms = performance.now() - t0;

  if (!plano) {
    return {
      saida: null,
      ms,
      naoSoubeFazer: [...naoSoubeFazer, `a candidata "${candidata}" não produziu plano`],
      variante: candidata,
    };
  }

  const saida = paraSaida(plano as ResultadoMotor, {
    motor: { nome: `archilly-generate-${candidata}`, versao: "1", semente: null },
    crs: entrada.crs as never,
    entrada: { projetoId: entrada.projeto.id, glebaId: entrada.gleba.id },
    geradoEm,
  });

  return { saida, ms, naoSoubeFazer, variante: candidata };
}
