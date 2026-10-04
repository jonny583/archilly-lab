/**
 * Os testes da via desenhada como coluna vertebral. (LAB-23, **refeitos no
 * LAB-33**)
 *
 * ```sh
 * bun test tests/coluna-vertebral.test.ts
 * ```
 *
 * # Por que este arquivo foi refeito, e não só corrigido
 *
 * O chat mandou: *"a trava do LAB-23 continua lendo prova congelada em vez de
 * medir; conserte de verdade, não vire o sinal."* Era isso mesmo.
 *
 * **A história completa, porque ela é a melhor aula do repositório:**
 *
 *   1. no **LAB-23** este arquivo tinha um teste chamado *"NENHUM motor muda a
 *      saída quando a via sai do arquivo"*, e um comentário que se orgulhava:
 *      *"se um dia um motor passar a respeitar a via, este teste morde antes de
 *      qualquer relatório sair errado"*;
 *   2. **o relatório saiu errado, duas vezes**, e o teste não mordeu. A SAÍDA do
 *      Laboratório de Parcelamento era idêntica com e sem a via porque **a ida do
 *      Lab nunca entregava a via ao motor** — o campo `viaManual` existe nele
 *      desde sempre (D119);
 *   3. no **LAB-30** eu *virei o sinal*: passei a exigir que o Parcelamento
 *      mudasse. **E isso não consertou nada**, porque o teste continuava lendo
 *      `docs/provas/LAB-23/coluna-vertebral.json` — um arquivo. Teste de
 *      falsificação que lê prova congelada não falsifica: ele **repete**. Era
 *      afirmação sobre JSON, não sobre motor.
 *
 * # O que mudou agora (D130)
 *
 * **Os motores RODAM aqui.** Todas as asserções saem de medição feita neste
 * processo — as oito rodadas (duas glebas × quatro motores × com e sem a via)
 * vivem num memo, para rodar uma vez cada.
 *
 * **E a prova congelada deixou de ser a fonte da verdade para virar o que ela
 * sempre devia ter sido: um DETECTOR DE PROVA VELHA.** O último teste compara o
 * medido agora com o publicado em `docs/provas/`, e reprova se divergirem. Assim
 * o arquivo tem função — avisar que precisa ser regerado — sem nunca mais ser
 * quem responde à pergunta.
 *
 * **A ambiguidade que derrubou a primeira versão fica travada à parte:** *"saída
 * idêntica"* significa **duas** coisas — *o motor ignora a linha* ou *a ponte não
 * a entrega* —, e sem separá-las o teste passa nas duas. O primeiro teste abaixo
 * mede a ponte, direto na ida.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import type { Terreno } from "@symbios/contrato.ts";

import { idaParaOMotor } from "../../testfit/adapter/src/ida.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { linhasDaEntrada, type P, type Rodada } from "../src/motores/comum.ts";
import { mapaDaGleba, perfilDeRampa } from "../src/rampa.ts";
import { rodarGenerate } from "../src/motores/generate.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-com-via-desenhada");
const PROVA = join(RAIZ, "docs", "provas", "LAB-23", "coluna-vertebral.json");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

// Os mesmos da ferramenta: semente e carimbo iguais, ou a comparação com a prova
// publicada mediria duas coisas ao mesmo tempo.
const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";
const GLEBAS = ["ensaio-com-via", "antonina-com-via"] as const;
const MOTORES = ["generate-ortogonal", "generate-espinha", "parcelamento", "symbios"] as const;
const n2 = (v: number | null) => (v == null ? null : Number(v.toFixed(2)));

const ler = (id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, `${id}.entrada.json`), "utf8"));

/** O mesmo controle da ferramenta: tira só as vias desenhadas. */
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

// ─────────────────────────── as rodadas, medidas uma vez ────────────────────
//
// São oito: duas glebas × quatro motores × com e sem a via. O memo existe porque
// medir de verdade custa — a rodada de `antonina-com-via` leva ~22 s por
// passagem — e esse custo é o preço de o teste responder pelo motor e não por um
// arquivo.
//
// `Motor.carregar` é ASSÍNCRONO, e a primeira versão disto o memoizou sem
// `await`: o memo guardou a PROMESSA e o Symbios morreu com
// "motor.comSessao is not a function". Top-level await resolve, e custa o
// mesmo — o `.wasm` tem 193 KB.
const wasm = await Motor.carregar(readFileSync(WASM));

const memo = new Map<string, Rodada>();
function rodada(gleba: string, motor: string, comAVia: boolean): Rodada {
  const chave = `${gleba}·${motor}·${comAVia}`;
  const guardada = memo.get(chave);
  if (guardada) return guardada;
  const base = ler(gleba);
  const e = comAVia ? base : semViaDesenhada(base);
  const r =
    motor === "generate-ortogonal"
      ? rodarGenerate(e, "ortogonal", CARIMBO)
      : motor === "generate-espinha"
        ? rodarGenerate(e, "espinha", CARIMBO)
        : motor === "parcelamento"
          ? rodarTestfit(e, SEMENTE)
          : rodarSymbios(wasm, e, SEMENTE, CARIMBO);
  memo.set(chave, r);
  return r;
}

/** A linha da mão, medida pela MESMA régua das vias dos motores. */
function rampaDaLinhaDaMao(gleba: string) {
  const e = ler(gleba);
  const { terreno } = glebaParaOSymbios(e);
  const mapa = mapaDaGleba(terreno as Terreno);
  const caixa = typeof e.parametros.caixaPrincipal_m === "number" ? e.parametros.caixaPrincipal_m : 0;
  const linhas = linhasDaEntrada(e).desenhadas.map((pontos, i) => ({
    id: `desenhada-${i + 1}`,
    pontos,
    largura_m: caixa,
  }));
  return perfilDeRampa(linhas, mapa);
}

function rampaDoMotor(gleba: string, motor: string) {
  const e = ler(gleba);
  const { terreno } = glebaParaOSymbios(e);
  const mapa = mapaDaGleba(terreno as Terreno);
  return perfilDeRampa(viasDaSaida(rodada(gleba, motor, true).saida), mapa);
}

describe("o controle da experiência é cirúrgico", () => {
  test("tira as vias desenhadas, e só elas", () => {
    const e = ler("antonina-com-via");
    const antes = linhasDaEntrada(e);
    expect(antes.desenhadas.length).toBe(4);
    expect(antes.testadasDeFrente.length).toBe(1);

    const depois = linhasDaEntrada(semViaDesenhada(e));
    expect(depois.desenhadas).toHaveLength(0);
    // A testada de frente FICA: ela não é via desenhada (D64), e apagá-la faria
    // a comparação medir duas coisas ao mesmo tempo.
    expect(depois.testadasDeFrente).toHaveLength(1);
  });

  test("na gleba sem testada, sobra atração nenhuma", () => {
    const e = ler("ensaio-com-via");
    expect(linhasDaEntrada(e).desenhadas).toHaveLength(4);
    const d = linhasDaEntrada(semViaDesenhada(e));
    expect(d.desenhadas).toHaveLength(0);
    expect(d.testadasDeFrente).toHaveLength(0);
  });
});

describe("a PONTE entrega a linha ao motor — a metade que faltava (LAB-33)", () => {
  // Sem esta separação, "saída idêntica" passa tanto quando o motor ignora a
  // linha quanto quando a ponte não a entrega, e foi a segunda que aconteceu
  // por três semanas (D119). Aqui a ida é medida DIRETO, sem motor no meio.
  const linha: P[] = [{ x: 10, y: 10 }, { x: 400, y: 10 }];

  function entradaV1(comViaDesenhada: boolean): EntradaV1 {
    const e = ler("antonina-com-via") as unknown as EntradaV1;
    return {
      ...e,
      archilly: { ...e.archilly, versao: "2" },
      atracoes: comViaDesenhada
        ? [{ id: "VD", tipo: "via_desenhada", nome: "principal", geometria: { tipo: "linha", pontos: linha } } as never]
        : [],
    };
  }

  test("no contrato v2 a ida lê a via desenhada SOZINHA e preenche `viaManual`", () => {
    const { entrada } = idaParaOMotor(entradaV1(true), { semente: SEMENTE });
    expect(entrada.viaManual, "a ida não entregou a coluna vertebral ao motor").toBeDefined();
    expect(entrada.viaManual).toEqual(linha);
  });

  test("sem via desenhada no arquivo, `viaManual` NÃO é inventada", () => {
    const { entrada } = idaParaOMotor(entradaV1(false), { semente: SEMENTE });
    expect(entrada.viaManual ?? null).toBeNull();
  });

  test("quem já sabe separar passa pronto, e a ida respeita o que recebeu", () => {
    // No v1 a via desenhada e a testada de frente têm o MESMO tipo, e separá-las
    // exige medir a distância à divisa — régua que mora na esteira (D20, D116).
    const outra: P[] = [{ x: 0, y: 0 }, { x: 100, y: 100 }];
    const { entrada } = idaParaOMotor(entradaV1(true), { semente: SEMENTE, viaManual: outra });
    expect(entrada.viaManual).toEqual(outra);
  });
});

describe("a prova por diferença — MEDIDA AQUI, com os motores rodando (LAB-33)", () => {
  test("o Parcelamento MUDA a saída quando a via está no arquivo", () => {
    for (const gleba of GLEBAS) {
      const com = JSON.stringify(rodada(gleba, "parcelamento", true).saida);
      const sem = JSON.stringify(rodada(gleba, "parcelamento", false).saida);
      expect(com, `${gleba}: a via chega ao motor desde o LAB-30 e a saída tem de mudar`).not.toBe(sem);
    }
  }, 180_000);

  test("os outros três NÃO mudam a saída — e isto é prova, não declaração", () => {
    for (const gleba of GLEBAS) {
      for (const motor of MOTORES) {
        if (motor === "parcelamento") continue;
        const com = JSON.stringify(rodada(gleba, motor, true).saida);
        const sem = JSON.stringify(rodada(gleba, motor, false).saida);
        expect(com, `${motor} em ${gleba} mudou a saída`).toBe(sem);
      }
    }
  }, 180_000);
});

describe("a linha da mão contra as vias dos motores — medida aqui (LAB-33)", () => {
  test("a mesma régua mede as duas, e nenhuma sai `null`", () => {
    for (const gleba of GLEBAS) {
      const dela = rampaDaLinhaDaMao(gleba);
      expect(dela.medida, `${gleba}: a linha da mão não foi medida`).toBe(true);
      expect(dela.rampaPior_pct).not.toBeNull();
      for (const motor of MOTORES) {
        expect(rampaDoMotor(gleba, motor).rampaPior_pct, `${motor} em ${gleba}`).not.toBeNull();
      }
    }
  }, 180_000);

  test("em `antonina-com-via` a linha da mão é MAIS MANSA que as quatro", () => {
    const dela = rampaDaLinhaDaMao("antonina-com-via").rampaPior_pct!;
    for (const motor of MOTORES) {
      expect(dela, `a linha da mão devia ser mais mansa que ${motor}`).toBeLessThan(
        rampaDoMotor("antonina-com-via", motor).rampaPior_pct!,
      );
    }
  }, 180_000);

  test("em `ensaio-com-via` ela é MAIS ÍNGREME que as quatro — e isso também está medido", () => {
    // A resposta depende da gleba, e o relatório diz isso. Fixar as duas pontas
    // impede que uma leitura cômoda sobreviva à medição.
    const dela = rampaDaLinhaDaMao("ensaio-com-via").rampaPior_pct!;
    for (const motor of MOTORES) {
      expect(dela, `a linha da mão devia ser mais íngreme que ${motor}`).toBeGreaterThan(
        rampaDoMotor("ensaio-com-via", motor).rampaPior_pct!,
      );
    }
  }, 180_000);
});

describe("a prova publicada não envelheceu — o único uso honesto do arquivo (LAB-33)", () => {
  // Aqui o JSON NÃO responde à pergunta: ele é comparado com o medido agora. Se
  // divergir, a prova em `docs/provas/` está velha e precisa de `bun run lab23`
  // — que é a única coisa que um arquivo congelado pode dizer com honestidade.
  const prova = JSON.parse(readFileSync(PROVA, "utf8")) as {
    semente: number;
    glebas: {
      gleba: string;
      viasDesenhadas: number;
      aLinhaDaMao: { medida: boolean; rampaPior_pct: number | null };
      motores: Record<string, { saidaIdenticaSemAVia: boolean; rampaDoMotor: { pior_pct: number | null } }>;
    }[];
  };

  test("a semente da prova é a que este teste usa", () => {
    // Sem isto a comparação abaixo poderia acusar "prova velha" quando o que
    // mudou foi a semente, que é outra conversa.
    expect(prova.semente).toBe(SEMENTE);
  });

  test("os números publicados batem com os medidos agora", () => {
    expect(prova.glebas).toHaveLength(2);
    for (const g of prova.glebas) {
      expect(g.viasDesenhadas, `${g.gleba}: a contagem de vias desenhadas mudou`).toBe(
        linhasDaEntrada(ler(g.gleba)).desenhadas.length,
      );
      expect(g.aLinhaDaMao.rampaPior_pct, `${g.gleba}: a rampa da linha da mão mudou — regere com bun run lab23`)
        .toBe(n2(rampaDaLinhaDaMao(g.gleba).rampaPior_pct));
      for (const [motor, m] of Object.entries(g.motores)) {
        const com = JSON.stringify(rodada(g.gleba, motor, true).saida);
        const sem = JSON.stringify(rodada(g.gleba, motor, false).saida);
        expect(m.saidaIdenticaSemAVia, `${motor} em ${g.gleba}: a prova diz outra coisa que o medido`).toBe(
          com === sem,
        );
        expect(m.rampaDoMotor.pior_pct, `${motor} em ${g.gleba}: a rampa publicada está velha`).toBe(
          n2(rampaDoMotor(g.gleba, motor).rampaPior_pct),
        );
      }
    }
  }, 180_000);
});
