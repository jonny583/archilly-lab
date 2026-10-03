#!/usr/bin/env bun
/**
 * LAB-23 — a via desenhada à mão como coluna vertebral do traçado. (03/10/2026)
 *
 * ```sh
 * bun run lab23
 * ```
 *
 * # As duas perguntas, e a segunda é a que interessa
 *
 * **1 · O que MUDA quando a via vem do arquivo?** O LAB-17 mediu que os quatro
 * motores declaram ignorar via desenhada. Aqui isso é **provado por diferença**:
 * a mesma gleba com e sem a via no arquivo, e a SAÍDA comparada byte a byte.
 * Declaração é promessa; diferença é prova.
 *
 * **2 · Quanto VALERIA respeitá-la?** Esta é a pergunta nova, e só ficou
 * possível com a régua de rampa do LAB-21. A via que o urbanista traça está
 * **melhor ou pior assentada no terreno** que as que o motor inventa? Se a linha
 * da mão for mais mansa, respeitá-la é ganho de obra, e não só de gosto. Se for
 * mais íngreme, o motor está certo em contornar — e aí a "coluna vertebral"
 * custaria terraplenagem.
 *
 * **O Lab não decide qual das duas vence.** Ele mede as duas e põe lado a lado.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import type { Terreno } from "@symbios/contrato.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { linhasDaEntrada, type P, type Rodada } from "../src/motores/comum.ts";
import { mapaDaGleba, perfilDeRampa } from "../src/rampa.ts";
import {
  LIMITE_DA_RUA_PCT,
  indicadoresDeTerreno,
} from "../src/terreno-indicadores.ts";
import { rodarGenerate } from "../src/motores/generate.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-23");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-com-via-desenhada");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";
const n2 = (v: number | null) => (v == null ? null : Number(v.toFixed(2)));

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

/** As duas glebas de referência do LAB-17, as únicas com via desenhada. */
const GLEBAS = ["ensaio-com-via", "antonina-com-via"].map((id) => ({
  id,
  entrada: JSON.parse(readFileSync(join(FIXTURES, `${id}.entrada.json`), "utf8")) as EntradaMinima,
}));

const MOTORES = [
  { id: "generate-ortogonal", nome: "Generate · ortogonal" },
  { id: "generate-espinha", nome: "Generate · espinha" },
  { id: "parcelamento", nome: "Laboratório de Parcelamento" },
  { id: "symbios", nome: "Symbios + subdivisão do Lab" },
] as const;

function rodar(id: string, e: EntradaMinima): Rodada {
  if (id === "generate-ortogonal") return rodarGenerate(e, "ortogonal", CARIMBO);
  if (id === "generate-espinha") return rodarGenerate(e, "espinha", CARIMBO);
  if (id === "parcelamento") return rodarTestfit(e, SEMENTE);
  return rodarSymbios(wasm, e, SEMENTE, CARIMBO);
}

/** A mesma gleba sem as vias desenhadas — o controle da experiência. */
function semViaDesenhada(e: EntradaMinima): EntradaMinima {
  const { desenhadas } = linhasDaEntrada(e);
  const chaves = new Set(desenhadas.map((l) => JSON.stringify(l)));
  return {
    ...e,
    atracoes: (e.atracoes ?? []).filter((a) => {
      const g = (a as { geometria?: { pontos?: P[] } }).geometria;
      return !(g?.pontos && chaves.has(JSON.stringify(g.pontos)));
    }),
  };
}

/** Vias da SAÍDA, com a caixa — para medir rampa e área. */
function viasDaSaida(saida: unknown): { id: string; pontos: P[]; largura_m: number }[] {
  const s = saida as {
    vias?: { id?: string; pontos?: P[]; eixo?: P[]; largura_m?: number; caixa_m?: number }[];
  } | null;
  return (s?.vias ?? [])
    .map((v, i) => ({
      id: v.id ?? `v${i}`,
      pontos: v.eixo ?? v.pontos ?? [],
      largura_m: v.largura_m ?? v.caixa_m ?? 0,
    }))
    .filter((v) => v.pontos.length >= 2);
}

console.log(`[LAB-23] a via desenhada como coluna vertebral — o que muda, e quanto valeria`);

const linhas: Record<string, unknown>[] = [];

for (const { id, entrada } of GLEBAS) {
  const { terreno } = glebaParaOSymbios(entrada);
  const mapa = mapaDaGleba(terreno as Terreno);
  const { desenhadas } = linhasDaEntrada(entrada);
  const controle = semViaDesenhada(entrada);

  // ── A via DESENHADA, medida pela mesma régua das vias dos motores ───────
  //
  // A caixa é a `caixaPrincipal_m` dos parâmetros da gleba: é a largura que
  // essa via teria se fosse construída. Sem parâmetro, sai `null` e a área não
  // é calculada — largura inventada vira preço inventado (D69).
  const caixa = typeof entrada.parametros.caixaPrincipal_m === "number"
    ? entrada.parametros.caixaPrincipal_m
    : null;
  const viasDesenhadas = desenhadas.map((pontos, i) => ({
    id: `desenhada-${i + 1}`,
    pontos,
    largura_m: caixa ?? 0,
  }));
  const rampaDaDesenhada = perfilDeRampa(viasDesenhadas, mapa);
  const terrenoDaDesenhada = caixa
    ? indicadoresDeTerreno(viasDesenhadas, [], mapa)
    : null;

  console.log(`\n══════════ ${id} ══════════`);
  console.log(
    `  vias desenhadas no arquivo: ${desenhadas.length} · caixa dos parâmetros: ${caixa == null ? "não declarada" : `${caixa} m`}`,
  );
  if (rampaDaDesenhada.medida) {
    console.log(
      `  A LINHA DA MÃO, medida: média ${rampaDaDesenhada.rampaMediaPonderada_pct} % · ` +
        `pior trecho ${rampaDaDesenhada.rampaPior_pct} %` +
        (terrenoDaDesenhada?.via
          ? ` · ${terrenoDaDesenhada.via.comprimentoAcimaDoLimite_m.toFixed(0)} m ` +
            `(${terrenoDaDesenhada.via.pctDoComprimento.toFixed(1)} %) acima de ${LIMITE_DA_RUA_PCT} %`
          : ""),
    );
  }

  const porMotor: Record<string, unknown> = {};
  for (const m of MOTORES) {
    const com = rodar(m.id, entrada);
    const sem = rodar(m.id, controle);

    // ── 1 · a prova por diferença ───────────────────────────────────────
    const igual = JSON.stringify(com.saida) === JSON.stringify(sem.saida);

    // ── 2 · a comparação de assentamento no terreno ──────────────────────
    const doMotor = perfilDeRampa(viasDaSaida(com.saida), mapa);

    porMotor[m.id] = {
      motor: m.nome,
      declarouRespeitar: com.naoSoubeFazer.every((x) => !x.includes("desenhada")) ? null : false,
      // A prova: com e sem a via no arquivo, a saída é a mesma?
      saidaIdenticaSemAVia: igual,
      rampaDoMotor: {
        media_pct: n2(doMotor.rampaMediaPonderada_pct),
        pior_pct: n2(doMotor.rampaPior_pct),
      },
      ms: n2(com.ms),
    };

    console.log(
      `  ${m.nome.padEnd(30)} saída ${igual ? "IDÊNTICA" : "DIFERENTE"} sem a via · ` +
        `rampa dele: média ${doMotor.rampaMediaPonderada_pct} % · pior ${doMotor.rampaPior_pct} %`,
    );
  }

  linhas.push({
    prompt: "LAB-23",
    gleba: id,
    semente: SEMENTE,
    contrato: entrada.archilly.versao,
    viasDesenhadas: desenhadas.length,
    caixaDosParametros_m: caixa,
    aLinhaDaMao: {
      medida: rampaDaDesenhada.medida,
      porQueNaoMedida: rampaDaDesenhada.porQueNaoMedida,
      comprimento_m: n2(rampaDaDesenhada.comprimentoTotal_m),
      rampaMedia_pct: n2(rampaDaDesenhada.rampaMediaPonderada_pct),
      rampaPior_pct: n2(rampaDaDesenhada.rampaPior_pct),
      metrosAcimaDoLimiteDaRua: terrenoDaDesenhada?.via?.comprimentoAcimaDoLimite_m ?? null,
      pctAcimaDoLimiteDaRua: terrenoDaDesenhada?.via?.pctDoComprimento ?? null,
    },
    motores: porMotor,
  });
}

writeFileSync(
  join(SAIDA, "coluna-vertebral.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-23",
      geradoEm: CARIMBO,
      semente: SEMENTE,
      limiteDaRua_pct: LIMITE_DA_RUA_PCT,
      oQueEstaMedido: {
        provaPorDiferenca:
          "a mesma gleba com e sem a via desenhada no arquivo, SAÍDA comparada byte a byte. " +
          "Declaração é promessa; diferença é prova",
        assentamentoNoTerreno:
          "a rampa da linha da mão contra a rampa das vias que o motor inventou, pela mesma régua",
      },
      oQueNaoEstaMedido:
        "se respeitar a via desenhada daria mais lote, menos sobra ou menos violação: isso exige " +
        "um motor que a respeite, e nenhum dos quatro respeita. O que se mede aqui é o CUSTO DE " +
        "TERRENO da escolha, não o ganho de projeto",
      glebas: linhas,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-23/coluna-vertebral.json`);
