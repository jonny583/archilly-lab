#!/usr/bin/env bun
/**
 * LAB-13 — os três motores, cinco glebas, uma régua só.
 *
 * ```sh
 * bun ferramentas/lab13.ts
 * ```
 *
 * # O que esta ferramenta é, e o que ela não é
 *
 * É a **base de comparação** para a decisão de família de unificar a tela de
 * parcelamento com vários motores por baixo. Mesmas cinco glebas, mesmos
 * parâmetros, mesmas sementes, uma tabela.
 *
 * **Não é recomendação de produto.** O prompt foi explícito, e a razão é boa:
 * "qual motor é melhor" depende do que se quer do terreno, e isso é do Jonny e
 * do chat. O que sai daqui são números e uma leitura curta do que cada motor
 * faz melhor — a conclusão é de quem lê.
 *
 * # O que garante que a comparação é honesta
 *
 * - **a mesma régua para os três**: Validator, Judge e `medirSobras`, todos do
 *   Generate, e todos alcançados pelo mesmo caminho — o motor entrega SAÍDA v1,
 *   o `montarParcelamentoExterno` a lê, e só então se mede. Inclusive o motor
 *   interno do Generate dá essa volta (ver `src/motores/generate.ts`);
 * - **a mesma entrada**: as cinco glebas declaram os mesmos parâmetros, e isso
 *   é conferido e sai no JSON;
 * - **cada motor escolhe por si**: o do Generate roda as duas candidatas
 *   isoladas; o do Laboratório de Parcelamento escolhe pelo ranking dele; o
 *   Symbios tem um traçado só;
 * - **o que cada motor não soube fazer sai escrito**, por gleba. É o campo que
 *   impede a tabela de mentir por omissão — um motor que ignora o relevo e um
 *   que o lê não fizeram a mesma prova.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import { areaPoligono } from "@symbios/geo.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import type { Terreno } from "@symbios/contrato.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import {
  aderenciaAViaDesenhada,
  julgar,
  linhasDaEntrada,
  type Rodada,
  type Veredito,
} from "../src/motores/comum.ts";
import { rodarGenerate } from "../src/motores/generate.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-13");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

const n2 = (v: number) => Number(v.toFixed(2));
const n3 = (v: number) => Number(v.toFixed(3));
const pc = (a: number, b: number) => (b > 0 ? Number(((100 * a) / b).toFixed(2)) : 0);

const motorWasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

/** As cinco glebas. As três do LAB-02 e as duas glebas-padrão com relevo. */
const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
];

/** Os motores na mesa, na ordem em que aparecem na tabela. */
const MOTORES = [
  { id: "generate-ortogonal", nome: "Generate · candidata ortogonal" },
  { id: "generate-espinha", nome: "Generate · candidata espinha" },
  { id: "parcelamento", nome: "Laboratório de Parcelamento" },
  { id: "symbios", nome: "Symbios + subdivisão do Lab" },
] as const;

type MotorId = (typeof MOTORES)[number]["id"];

function rodar(id: MotorId, entrada: EntradaMinima): Rodada {
  if (id === "generate-ortogonal") return rodarGenerate(entrada, "ortogonal", CARIMBO);
  if (id === "generate-espinha") return rodarGenerate(entrada, "espinha", CARIMBO);
  if (id === "parcelamento") return rodarTestfit(entrada, SEMENTE);
  return rodarSymbios(motorWasm, entrada, SEMENTE, CARIMBO);
}

/** As vias da SAÍDA, para medir aderência à via desenhada à mão. */
function viasDaSaida(saida: unknown): { pontos: { x: number; y: number }[]; largura_m: number }[] {
  const s = saida as { vias?: { eixo?: { x: number; y: number }[]; pontos?: { x: number; y: number }[]; largura_m?: number; caixa_m?: number }[] } | null;
  if (!s?.vias) return [];
  return s.vias
    .map((v) => ({
      pontos: v.eixo ?? v.pontos ?? [],
      largura_m: v.largura_m ?? v.caixa_m ?? 10,
    }))
    .filter((v) => v.pontos.length >= 2);
}

const linhas: Record<string, unknown>[] = [];

// Conferência de que a comparação é legítima: os parâmetros têm de ser iguais.
const assinaturaDosParametros = JSON.stringify(GLEBAS[0]!.entrada.parametros);
for (const g of GLEBAS) {
  if (JSON.stringify(g.entrada.parametros) !== assinaturaDosParametros) {
    console.error(`[LAB-13] ABORTADO: "${g.id}" declara parâmetros diferentes das outras glebas.`);
    console.error("A comparação exige os MESMOS parâmetros; medir com parâmetros diferentes é medir outra coisa.");
    process.exit(1);
  }
}
console.log(`[LAB-13] os mesmos parâmetros nas cinco glebas, conferido: ${assinaturaDosParametros}`);

for (const { id, entrada } of GLEBAS) {
  const { terreno } = glebaParaOSymbios(entrada);
  const areaGleba = areaPoligono((terreno as Terreno).gleba);
  const { desenhadas, testadasDeFrente } = linhasDaEntrada(entrada);

  console.log(`\n══════════ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha ══════════`);
  console.log(
    `  restrições ${entrada.restricoes.filter((r) => r.desconta).length} · ` +
      `curvas de nível ${entrada.relevo?.curvas?.length ?? 0} · ` +
      `vias desenhadas à mão ${desenhadas.length} · testadas de frente ${testadasDeFrente.length}`,
  );

  const porMotor: Record<string, unknown> = {};

  for (const m of MOTORES) {
    const r = rodar(m.id, entrada);
    const v: Veredito = r.saida ? julgar(r.saida, entrada) : {
      recusa: ["o motor não produziu saída"], lotes: null, areaPrivativa_m2: null,
      violacoes: null, porTipo: null, exemplos: [], sobras: null, forma: null,
      frenteNaTestada: null,
    };

    // Determinismo: a mesma entrada, duas vezes, comparando a SAÍDA inteira.
    const bis = rodar(m.id, entrada);
    const determinismo = JSON.stringify(bis.saida) === JSON.stringify(r.saida);

    const ader = aderenciaAViaDesenhada(entrada, viasDaSaida(r.saida));

    porMotor[m.id] = {
      motor: m.nome,
      variante: r.variante,
      ms: n2(r.ms),
      determinismo,
      naoSoubeFazer: r.naoSoubeFazer,
      recusadoPeloEsquema: v.recusa,
      lotes: v.lotes,
      areaVendavel_m2: v.areaPrivativa_m2 == null ? null : n2(v.areaPrivativa_m2),
      pctPrivativa: v.areaPrivativa_m2 == null ? null : pc(v.areaPrivativa_m2, areaGleba),
      violacoes: v.violacoes,
      violacoesPorRegra: v.porTipo,
      exemplosDeViolacao: v.exemplos,
      sobras: v.sobras
        ? {
            passoMalha_m: v.sobras.passoMalha_m,
            areaSemLote_m2: n2(v.sobras.areaSobra_m2),
            pctDaMassa: pc(v.sobras.areaSobra_m2, v.sobras.massa_m2),
            pecas: v.sobras.pecas,
            maiorPeca_m2: v.sobras.maiorPeca_m2 == null ? null : n2(v.sobras.maiorPeca_m2),
            massa_m2: n2(v.sobras.massa_m2),
            lote_m2: n2(v.sobras.lote_m2),
            leito_m2: n2(v.sobras.leito_m2),
          }
        : null,
      forma: v.forma
        ? {
            lotes: v.forma.lotes,
            // Pela caixa GIRADA — a régua que não pune quem gira o lote pela rua.
            naoRetangulares: v.forma.girada.naoRetangulares,
            irregularidadeMediana: n3(v.forma.girada.mediana),
            irregularidadeP90: n3(v.forma.girada.p90),
            irregularidadeMaxima: n3(v.forma.girada.maxima),
            // Pela caixa dos EIXOS — a fórmula do Generate, para continuidade.
            porEixos: {
              naoRetangulares: v.forma.eixos.naoRetangulares,
              mediana: n3(v.forma.eixos.mediana),
            },
          }
        : null,
      aderenciaAViaDesenhada: {
        // `null` quando não há via desenhada nesta gleba — nunca zero (D23).
        // Nas cinco glebas de hoje ele é `null` em TODAS: ver o relatório.
        fracao: ader.fracao == null ? null : n3(ader.fracao),
        linhasDesenhadas: ader.linhas,
        comprimentoDesenhado_m: n2(ader.comprimento_m),
        toleranciaMedia_m: ader.toleranciaMedia_m == null ? null : n2(ader.toleranciaMedia_m),
      },
      // A pergunta CERTA para a linha que corre sobre a divisa.
      frenteNaTestadaDeFrente: v.frenteNaTestada,
    };


    const linha1 = v.recusa
      ? `RECUSADO PELO ESQUEMA — ${v.recusa[0]}`
      : `${String(v.lotes).padStart(5)} lotes · ${((v.areaPrivativa_m2 ?? 0) / 1e4).toFixed(2)} ha (${pc(v.areaPrivativa_m2 ?? 0, areaGleba)} %) · ` +
        `${v.violacoes} violações ${JSON.stringify(v.porTipo)}`;
    console.log(`  ${m.nome.padEnd(32)} ${linha1}`);
    if (!v.recusa) {
      console.log(
        `  ${" ".repeat(32)} sobra ${((v.sobras?.areaSobra_m2 ?? 0) / 1e4).toFixed(2)} ha em ${v.sobras?.pecas} peças · ` +
          `irregulares ${v.forma?.girada.naoRetangulares}/${v.forma?.lotes} (mediana ${n3(v.forma?.girada.mediana ?? 0)}) · ` +
          `${n2(r.ms)} ms · determinismo ${determinismo ? "OK" : "FALHOU"}` +
          (ader.fracao == null ? "" : ` · aderência à via desenhada ${(100 * ader.fracao).toFixed(1)} %`) +
          (v.frenteNaTestada ? ` · ${v.frenteNaTestada.lotes} lotes de frente para a testada` : ""),
      );
    }
    for (const x of r.naoSoubeFazer) console.log(`  ${" ".repeat(32)} ⚠ ${x}`);
  }

  linhas.push({
    prompt: "LAB-13",
    gleba: id,
    semente: SEMENTE,
    contrato: "1",
    areaDaGleba_m2: n2(areaGleba),
    parametros: entrada.parametros,
    restricoesQueDescontam: entrada.restricoes.filter((r) => r.desconta).length,
    curvasDeNivel: entrada.relevo?.curvas?.length ?? 0,
    viasDesenhadasAMao: desenhadas.length,
    testadasDeFrente: testadasDeFrente.length,
    motores: porMotor,
  });
}

writeFileSync(
  join(SAIDA, "medicoes.json"),
  `${JSON.stringify({ prompt: "LAB-13", geradoEm: CARIMBO, semente: SEMENTE, glebas: linhas }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-13/medicoes.json`);
