#!/usr/bin/env bun
/**
 * LAB-32 — por que a aderência do Parcelamento CAIU quando eu entreguei a via.
 *
 * ```sh
 * bun ferramentas/lab32.ts
 * ```
 *
 * # O que se investiga
 *
 * O LAB-30 entregou a `viaManual` ao motor do Laboratório de Parcelamento (o
 * campo que a ida do Lab nunca preenchia, D119) e a aderência medida em
 * `antonina-com-via` **caiu de 17,4 % para 11,2 %**. Eu publiquei o número novo
 * sem investigar, e o chat cobrou — com razão: "entreguei a linha e ele passou a
 * segui-la MENOS" é um resultado suspeito, e resultado suspeito se mede antes de
 * ter culpado (§6).
 *
 * # As três perguntas, nesta ordem
 *
 * 1. **A variante é a mesma?** A variante que representa o motor é a de melhor
 *    nota DELE, entre as que o esquema aceita. Se entregar a via mudou qual
 *    vence, a comparação 17,4 → 11,2 é entre DOIS DESENHOS DIFERENTES, e a queda
 *    não diz nada sobre respeitar a via.
 * 2. **Por FORMATO, a aderência mudou?** Esta é a pergunta limpa: o mesmo partido
 *    de traçado, com e sem a via. Aqui não há troca de variante para confundir.
 * 3. **Por LINHA, quem caiu?** O motor recebe UMA coluna vertebral — a mais
 *    longa — e a aderência é medida contra as QUATRO linhas desenhadas. Se ele
 *    segue melhor a que recebeu e pior as outras três, a média cai sem que ele
 *    tenha piorado na linha que lhe foi dada.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import type { EntradaMinima } from "../src/gleba-v1.ts";
import {
  aderenciaAViaDesenhada,
  alinhamentoAViaDesenhada,
  linhasDaEntrada,
  lotesNaFaixaDaVia,
} from "../src/motores/comum.ts";
import { entradaDaPorta } from "../src/porta/porta.ts";
import { motorDoGenerate, motorDoParcelamento, motorDoSymbios, separar } from "../src/porta/motores.ts";
import { Motor } from "@symbios/index.ts";
import { comViasDesenhadas, tracadoImposto, type ViaDesenhada } from "../src/vias-desenhadas.ts";
import { FORMATOS, VARIANTES } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-32");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");

const SEMENTE = 20260913;
const CARIMBO = "2026-10-04T00:00:00.000Z";
const n1 = (v: number) => Number(v.toFixed(1));
const n3 = (v: number) => Number(v.toFixed(3));
const pct = (v: number | null) => (v == null ? "    —" : `${(100 * v).toFixed(1)} %`.padStart(7));

const wasm = await Motor.carregar(
  readFileSync(
    join(RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
      "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm"),
  ),
);
const motores = [
  motorDoGenerate("ortogonal"),
  motorDoGenerate("espinha"),
  motorDoParcelamento(),
  motorDoSymbios(wasm),
];

const BASES = [
  { id: "ensaio-com-via", base: "ensaio-47ha", secundarias: 3 },
  { id: "antonina-com-via", base: "geo-antonina", secundarias: 3 },
];

type P = { x: number; y: number };

/** As vias da SAÍDA, com a caixa — a mesma leitura do LAB-17. */
function viasDaSaida(saida: unknown): { pontos: P[]; largura_m: number }[] {
  const s = saida as { vias?: { eixo?: P[]; pontos?: P[]; largura_m?: number; caixa_m?: number }[] } | null;
  if (!s?.vias) return [];
  return s.vias
    .map((v) => ({ pontos: v.eixo ?? v.pontos ?? [], largura_m: v.largura_m ?? v.caixa_m ?? 10 }))
    .filter((v) => v.pontos.length >= 2);
}

const comprimento = (l: P[]) =>
  l.reduce((s, p, i) => (i === 0 ? 0 : s + Math.hypot(p.x - l[i - 1]!.x, p.y - l[i - 1]!.y)), 0);

const resultado: Record<string, unknown>[] = [];

for (const { id, base, secundarias } of BASES) {
  const original: EntradaMinima = JSON.parse(
    readFileSync(join(FIXTURES, `${base}.entrada.json`), "utf8"),
  );
  const vias = tracadoImposto(original.gleba.anel, secundarias);
  const v1 = comViasDesenhadas({ ...original, projeto: { ...original.projeto, id } }, vias);

  const { desenhadas } = linhasDaEntrada(v1);
  const colunaVertebral = desenhadas.length
    ? [...desenhadas].sort((a, b) => comprimento(b) - comprimento(a))[0]!
    : null;

  console.log(`\n══════════════════════ ${id} ══════════════════════`);
  console.log(
    `  traçado imposto: ${vias.length} linhas (${comprimento(vias.flatMap((v) => v.pontos)) > 0 ? "" : ""}` +
      `${vias.map((v) => `${v.id} ${n1(comprimento(v.pontos))} m`).join(" · ")})`,
  );
  console.log(
    `  linhas que a régua reconhece como DESENHADAS: ${desenhadas.length} de ${vias.length}` +
      ` · coluna vertebral entregue ao motor: ${colunaVertebral ? `${n1(comprimento(colunaVertebral))} m` : "nenhuma"}`,
  );

  // ── As duas rodadas: sem a via (como era até o LAB-30) e com ela ──────────
  const rodar = (comAVia: boolean) =>
    rodarEsteira(v1 as unknown as EntradaV1, {
      semente: SEMENTE,
      variantes: VARIANTES,
      aparar: true,
      formatos: [...FORMATOS],
      ...(comAVia && colunaVertebral ? { viaManual: colunaVertebral } : {}),
    });

  const sem = rodar(false);
  const com = rodar(true);

  const escolher = (r: ReturnType<typeof rodarEsteira>) =>
    r.variantes.filter((v) => v.relatorio).sort((a, b) => a.posicaoNoMotor - b.posicaoNoMotor)[0];

  const eSem = escolher(sem);
  const eCom = escolher(com);
  const aderSem = eSem ? aderenciaAViaDesenhada(v1, viasDaSaida(eSem.saida)).fracao : null;
  const aderCom = eCom ? aderenciaAViaDesenhada(v1, viasDaSaida(eCom.saida)).fracao : null;

  // ── 1 · A variante que representa o motor é a mesma? ─────────────────────
  console.log(`\n  ── 1 · a variante escolhida pelo RANKING DO MOTOR ──`);
  console.log(`    sem a via: ${(eSem?.formato ?? "—").padEnd(14)} nota ${eSem?.notaDoMotor ?? "—"} · aderência ${pct(aderSem)}`);
  console.log(`    com a via: ${(eCom?.formato ?? "—").padEnd(14)} nota ${eCom?.notaDoMotor ?? "—"} · aderência ${pct(aderCom)}`);
  const trocouDeVariante = eSem?.formato !== eCom?.formato || eSem?.assinatura !== eCom?.assinatura;
  console.log(`    ${trocouDeVariante ? "⚠ TROCOU de desenho" : "mesmo desenho"}`);

  // ── 2 · Por FORMATO: o mesmo partido, com e sem a via ───────────────────
  console.log(`\n  ── 2 · por FORMATO — o mesmo partido, com e sem a via ──`);
  console.log(`    ${"formato".padEnd(14)} ${"sem".padStart(7)} ${"com".padStart(7)}   Δ        vias (sem→com)`);
  const porFormato: Record<string, unknown>[] = [];
  for (const f of FORMATOS) {
    const vSem = sem.variantes.find((v) => v.formato === f && v.relatorio);
    const vCom = com.variantes.find((v) => v.formato === f && v.relatorio);
    if (!vSem || !vCom) {
      console.log(`    ${f.padEnd(14)} ${(!vSem ? "recusada" : "—").padStart(7)} ${(!vCom ? "recusada" : "—").padStart(7)}`);
      porFormato.push({ formato: f, sem: null, com: null, obs: "variante recusada pelo esquema numa das rodadas" });
      continue;
    }
    const aSem = aderenciaAViaDesenhada(v1, viasDaSaida(vSem.saida)).fracao;
    const aCom = aderenciaAViaDesenhada(v1, viasDaSaida(vCom.saida)).fracao;
    const nSem = viasDaSaida(vSem.saida).length;
    const nCom = viasDaSaida(vCom.saida).length;
    const d = aSem != null && aCom != null ? aCom - aSem : null;
    console.log(
      `    ${f.padEnd(14)} ${pct(aSem)} ${pct(aCom)}  ${d == null ? "   —" : `${d >= 0 ? "+" : ""}${(100 * d).toFixed(1)} pp`.padStart(8)}` +
        `   ${nSem} → ${nCom}${vSem.assinatura === vCom.assinatura ? "   (desenho IDÊNTICO)" : ""}`,
    );
    porFormato.push({
      formato: f,
      aderenciaSemAVia: aSem == null ? null : n3(aSem),
      aderenciaComAVia: aCom == null ? null : n3(aCom),
      viasSemAVia: nSem,
      viasComAVia: nCom,
      desenhoIdentico: vSem.assinatura === vCom.assinatura,
      notaDoMotorSem: vSem.notaDoMotor,
      notaDoMotorCom: vCom.notaDoMotor,
    });
  }

  // ── 2-A · O QUE O CAMPO DO MOTOR PROMETE, medido ───────────────────────
  //
  // Lido no motor (`motor-testfit/src/lib/lab/motor.ts`, só leitura): `viaManual`
  // faz DUAS coisas, e nenhuma é "assentar eixo na linha":
  //
  //   1. `anguloBase()` — a direção da linha passa a ser o **ângulo base do
  //      partido inteiro**, no lugar do ângulo da caixa envolvente;
  //   2. `faixaDaViaManual()` — a caixa dela mais as calçadas viram **área
  //      bloqueada antes de qualquer lote nascer**.
  //
  // Então a régua de aderência do Lab — *"há eixo gerado a menos de meia caixa
  // deste ponto da linha?"* — mede uma coisa que este motor **não promete**. As
  // duas réguas abaixo medem as duas que ele promete. Os cortes de ângulo são
  // DECLARADOS, não limite inventado (§4).
  const CORTES_DE_ANGULO = [5, 10, 20];
  const anguloDaLinha = colunaVertebral
    ? Math.atan2(
        colunaVertebral[colunaVertebral.length - 1]!.y - colunaVertebral[0]!.y,
        colunaVertebral[colunaVertebral.length - 1]!.x - colunaVertebral[0]!.x,
      )
    : null;

  const alinhamento = (saida: unknown, corte: number) =>
    alinhamentoAViaDesenhada(colunaVertebral, viasDaSaida(saida), corte);

  const lotesSobreALinha = (saida: unknown) => {
    const caixa = typeof v1.parametros.caixaPrincipal_m === "number" ? v1.parametros.caixaPrincipal_m : 10;
    return lotesNaFaixaDaVia(
      colunaVertebral,
      (saida as { lotes?: { pontos: P[] }[] } | null)?.lotes ?? [],
      Math.max(3, caixa / 2),
    );
  };

  console.log(`\n  ── 2-A · as DUAS promessas do campo \`viaManual\`, medidas ──`);
  console.log(`    (a) alinhar o partido à direção da linha — fração do comprimento de eixo`);
  const alinhamentos: Record<string, unknown>[] = [];
  for (const f of FORMATOS) {
    const vSem = sem.variantes.find((v) => v.formato === f && v.relatorio);
    const vCom = com.variantes.find((v) => v.formato === f && v.relatorio);
    if (!vSem || !vCom) continue;
    const linhaTxt = CORTES_DE_ANGULO.map((c) => {
      const aS = alinhamento(vSem.saida, c);
      const aC = alinhamento(vCom.saida, c);
      return `${c}°: ${pct(aS)} → ${pct(aC)}`;
    }).join("  ");
    console.log(`      ${f.padEnd(13)} ${linhaTxt}`);
    alinhamentos.push({
      formato: f,
      porCorte: Object.fromEntries(
        CORTES_DE_ANGULO.map((c) => [
          `${c}graus`,
          { semAVia: alinhamento(vSem.saida, c), comAVia: alinhamento(vCom.saida, c) },
        ]),
      ),
      lotesNaFaixaSemAVia: lotesSobreALinha(vSem.saida),
      lotesNaFaixaComAVia: lotesSobreALinha(vCom.saida),
    });
  }
  console.log(`    (b) manter a faixa da linha livre de lote — INVASÃO é o centro do lote dentro da faixa`);
  console.log(`        ${"formato".padEnd(13)} ${"centro dentro".padStart(16)}   ${"(só encostam)".padStart(16)}`);
  for (const a of alinhamentos) {
    const s = a.lotesNaFaixaSemAVia as { centroDentro: number; soEncostam: number } | null;
    const c = a.lotesNaFaixaComAVia as { centroDentro: number; soEncostam: number } | null;
    console.log(
      `        ${String(a.formato).padEnd(13)} ${`${s?.centroDentro ?? "—"} → ${c?.centroDentro ?? "—"}`.padStart(16)}` +
        `   ${`${s?.soEncostam ?? "—"} → ${c?.soEncostam ?? "—"}`.padStart(16)}`,
    );
  }

  // ── 3 · Por LINHA: quem caiu, a entregue ou as outras? ──────────────────
  console.log(`\n  ── 3 · por LINHA desenhada — a entregue ao motor vs. as outras ──`);
  const porLinha: Record<string, unknown>[] = [];
  for (const via of vias) {
    const soEsta = comViasDesenhadas({ ...original, projeto: { ...original.projeto, id } }, [via as ViaDesenhada]);
    const ehAColuna =
      colunaVertebral != null &&
      Math.abs(comprimento(via.pontos) - comprimento(colunaVertebral)) < 0.01 &&
      Math.abs(via.pontos[0]!.x - colunaVertebral[0]!.x) < 0.01;
    const aSem = eSem ? aderenciaAViaDesenhada(soEsta, viasDaSaida(eSem.saida)).fracao : null;
    const aCom = eCom ? aderenciaAViaDesenhada(soEsta, viasDaSaida(eCom.saida)).fracao : null;
    const reconhecida = linhasDaEntrada(soEsta).desenhadas.length > 0;
    console.log(
      `    ${via.id} ${via.papel.padEnd(11)} ${n1(comprimento(via.pontos)).toString().padStart(7)} m` +
        ` ${ehAColuna ? "← ENTREGUE" : "           "} ${pct(aSem)} → ${pct(aCom)}` +
        (reconhecida ? "" : "   (a régua a lê como TESTADA DE FRENTE, fora da conta)"),
    );
    porLinha.push({
      id: via.id,
      papel: via.papel,
      comprimento_m: n1(comprimento(via.pontos)),
      entregueAoMotor: ehAColuna,
      reconhecidaComoDesenhada: reconhecida,
      aderenciaSemAVia: aSem == null ? null : n3(aSem),
      aderenciaComAVia: aCom == null ? null : n3(aCom),
    });
  }

  // ── 4 · Os QUATRO motores: quem alinha o partido à linha? ───────────────
  //
  // A declaração nova (`alinhaOPartidoAViaDesenhada`) tem de ser MEDIDA nos
  // quatro, não só naquele em que eu achei o efeito. Foi exatamente o erro do
  // LAB-26: eu apliquei `respeitaAcesso: true` aos dois motores de uma vez,
  // e o valor medido do Symbios era `false`.
  //
  // A comparação é a mesma do experimento do `leViaDesenhada`: a gleba COM as
  // linhas desenhadas no arquivo e a mesma gleba SEM elas.
  console.log(`\n  ── 4 · os QUATRO motores — alinhamento a 10°, sem a via → com a via ──`);
  const semLinhas = { ...original, projeto: { ...original.projeto, id } };
  const eCom4 = entradaDaPorta(v1, SEMENTE, CARIMBO, separar);
  const eSem4 = entradaDaPorta(semLinhas, SEMENTE, CARIMBO, separar);
  const osQuatro: Record<string, unknown>[] = [];
  for (const m of motores) {
    const cap = m.capacidades();
    const rSem = m.gerar(eSem4);
    const rCom = m.gerar(eCom4);
    const aSem = alinhamento(rSem.saida, 10);
    const aCom = alinhamento(rCom.saida, 10);
    const alinha = aSem != null && aCom != null && aCom - aSem > 0.1;
    console.log(
      `    ${cap.nome.padEnd(38)} ${pct(aSem)} → ${pct(aCom)}` +
        `   ${alinha ? "ALINHA" : "não alinha"}  (declara leViaDesenhada: ${cap.leViaDesenhada ? "sim" : "não"})`,
    );
    osQuatro.push({
      motor: cap.id,
      nome: cap.nome,
      alinhamento10graus_semAVia: aSem == null ? null : n3(aSem),
      alinhamento10graus_comAVia: aCom == null ? null : n3(aCom),
      alinhaOPartidoMedido: alinha,
      declaraLeViaDesenhada: cap.leViaDesenhada,
      declaraRespeitaViaDesenhada: cap.respeitaViaDesenhada,
    });
  }

  resultado.push({
    prompt: "LAB-32",
    gleba: id,
    montadaSobre: base,
    semente: SEMENTE,
    contrato: "1",
    motor: "laboratorio-de-parcelamento",
    linhasDesenhadas: desenhadas.length,
    linhasNoTracado: vias.length,
    colunaVertebralEntregue_m: colunaVertebral ? n1(comprimento(colunaVertebral)) : null,
    escolhaDoMotor: {
      semAVia: eSem ? { formato: eSem.formato, nota: eSem.notaDoMotor, assinatura: eSem.assinatura, aderencia: aderSem == null ? null : n3(aderSem) } : null,
      comAVia: eCom ? { formato: eCom.formato, nota: eCom.notaDoMotor, assinatura: eCom.assinatura, aderencia: aderCom == null ? null : n3(aderCom) } : null,
      trocouDeDesenho: trocouDeVariante,
    },
    porFormato,
    asDuasPromessasDoCampo: {
      oQueOCampoFazNoMotor:
        "anguloBase(): a direcao da linha vira o angulo base do partido inteiro; faixaDaViaManual(): a caixa dela mais as calcadas viram area bloqueada antes de qualquer lote nascer. Nenhuma das duas assenta eixo na linha",
      cortesDeAngulo_graus: CORTES_DE_ANGULO,
      anguloDaLinha_graus: anguloDaLinha == null ? null : n1((anguloDaLinha * 180) / Math.PI),
      porFormato: alinhamentos,
    },
    porLinha,
    osQuatroMotores: osQuatro,
  });
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "aderencia.json"),
  `${JSON.stringify({ prompt: "LAB-32", geradoEm: CARIMBO, semente: SEMENTE, glebas: resultado }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-32/aderencia.json`);
