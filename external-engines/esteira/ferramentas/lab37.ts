#!/usr/bin/env bun
/**
 * LAB-37 — a testada de frente entregue em `facesLoteamento`. (04/10/2026)
 *
 * ```sh
 * bun run lab37
 * ```
 *
 * # A dívida que este prompt paga
 *
 * A **testada de frente** — a linha onde a gleba encosta numa rua que já existe —
 * chega ao contrato como linha, e o motor do Laboratório de Parcelamento tem
 * `facesLoteamento` esperando por ela desde sempre. **A ida do Lab nunca entregou.**
 * Era a única `divida` declarada do inventário (D121), e a D121 dizia, por escrito,
 * que enquanto durasse, `respeitaTestadaDeFrente: false` era **dívida do Lab, não
 * limitação do motor**.
 *
 * # O que sai
 *
 * Por gleba com testada de frente: quais faces do perímetro a linha cobre e com que
 * fração, e o que muda na SAÍDA quando elas são entregues — lotes, e **quantos lotes
 * fazem frente para a testada**, que é a pergunta certa para uma linha sobre a
 * divisa (a errada é *"o motor seguiu esta linha?"*, que premiaria quem pusesse rua
 * em cima dela — D64).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import type { EntradaMinima } from "../src/gleba-v1.ts";
import {
  FRACAO_MINIMA_DA_FACE,
  TOL_DA_FACE_M,
  facesCobertasPelaLinha,
  linhasDaEntrada,
  lotesNaTestadaDeFrente,
  type P,
} from "../src/motores/comum.ts";
import { FORMATOS, VARIANTES } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-37");
const SEMENTE = 20260913;
const CARIMBO = "2026-10-04T00:00:00.000Z";
const n1 = (v: number) => Number(v.toFixed(1));
const n3 = (v: number) => Number(v.toFixed(3));

const ler = (pasta: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(RAIZ, "docs", "fixtures", pasta, `${id}.entrada.json`), "utf8"));

/** As duas glebas que têm testada de frente — medido, não suposto. */
const GLEBAS = [
  { id: "geo-antonina", entrada: ler("glebas-padrao-com-relevo", "geo-antonina") },
  { id: "antonina-com-via", entrada: ler("glebas-com-via-desenhada", "antonina-com-via") },
];

const comprimento = (l: P[]) =>
  l.reduce((s, p, i) => (i === 0 ? 0 : s + Math.hypot(p.x - l[i - 1]!.x, p.y - l[i - 1]!.y)), 0);

const glebas: Record<string, unknown>[] = [];

console.log("══════════ LAB-37 · a testada de frente em `facesLoteamento` ══════════");
console.log(`  régua: tolerância ${TOL_DA_FACE_M} m · fração mínima da face ${100 * FRACAO_MINIMA_DA_FACE} %`);

for (const { id, entrada } of GLEBAS) {
  const { desenhadas, testadasDeFrente } = linhasDaEntrada(entrada);
  const { faces, porFace } = facesCobertasPelaLinha(entrada.gleba.anel, testadasDeFrente);
  const coluna = desenhadas.length
    ? [...desenhadas].sort((a, b) => comprimento(b) - comprimento(a))[0]!
    : null;

  console.log(`\n══════ ${id} ══════`);
  console.log(
    `  perímetro ${entrada.gleba.anel.length} faces · testada(s) de frente ${testadasDeFrente.length}` +
      ` (${testadasDeFrente.map((t) => `${comprimento(t).toFixed(0)} m`).join(", ")})`,
  );
  console.log(`  faces TOCADAS pela linha, com a fração coberta:`);
  for (const f of porFace) {
    console.log(
      `    face ${String(f.face).padStart(2)} · ${f.comprimento_m.toFixed(0).padStart(4)} m · ` +
        `${(100 * f.fracaoCoberta).toFixed(0).padStart(3)} % ` +
        (f.fracaoCoberta >= FRACAO_MINIMA_DA_FACE ? "← ENTREGUE" : "(toque de vértice, fora)"),
    );
  }
  console.log(`  entregues ao motor: facesLoteamento = [${faces.join(", ")}]`);

  // ── As duas rodadas: sem as faces (como era) e com elas ────────────────────
  const rodar = (comAsFaces: boolean) =>
    rodarEsteira(entrada as unknown as EntradaV1, {
      semente: SEMENTE,
      variantes: VARIANTES,
      aparar: true,
      formatos: [...FORMATOS],
      ...(coluna ? { viaManual: coluna } : {}),
      ...(comAsFaces && faces.length ? { facesLoteamento: faces } : {}),
    });

  const escolher = (r: ReturnType<typeof rodarEsteira>) =>
    r.variantes.filter((v) => v.relatorio).sort((a, b) => a.posicaoNoMotor - b.posicaoNoMotor)[0];

  const sem = escolher(rodar(false));
  const com = escolher(rodar(true));

  const medir = (v: typeof com) => {
    if (!v) return null;
    const s = v.saida as unknown as { lotes: { pontos: P[] }[] };
    const frente = lotesNaTestadaDeFrente(s.lotes, testadasDeFrente);
    return {
      formato: v.formato,
      lotes: s.lotes.length,
      lotesNaTestada: frente?.lotes ?? null,
      comprimentoDaTestada_m: frente ? n1(frente.comprimentoDaTestada_m) : null,
    };
  };

  const mSem = medir(sem);
  const mCom = medir(com);
  console.log(`  ── o que muda entregando as faces ──`);
  console.log(`    sem as faces: ${mSem?.formato} · ${mSem?.lotes} lotes · ${mSem?.lotesNaTestada} na testada`);
  console.log(`    com as faces: ${mCom?.formato} · ${mCom?.lotes} lotes · ${mCom?.lotesNaTestada} na testada`);

  // Por partido, para a comparação não depender da troca de variante (LAB-32).
  const porFormato: Record<string, unknown>[] = [];
  const rSem = rodar(false);
  const rCom = rodar(true);
  console.log(`  ── por partido: lotes na testada, sem → com ──`);
  for (const f of FORMATOS) {
    const vSem = rSem.variantes.find((v) => v.formato === f && v.relatorio);
    const vCom = rCom.variantes.find((v) => v.formato === f && v.relatorio);
    if (!vSem || !vCom) continue;
    const a = lotesNaTestadaDeFrente(
      (vSem.saida as unknown as { lotes: { pontos: P[] }[] }).lotes, testadasDeFrente,
    );
    const b = lotesNaTestadaDeFrente(
      (vCom.saida as unknown as { lotes: { pontos: P[] }[] }).lotes, testadasDeFrente,
    );
    const identico = vSem.assinatura === vCom.assinatura;
    console.log(
      `    ${f.padEnd(13)} ${String(a?.lotes ?? "—").padStart(3)} → ${String(b?.lotes ?? "—").padStart(3)}` +
        `   (lotes ${(vSem.saida as unknown as { lotes: unknown[] }).lotes.length} → ` +
        `${(vCom.saida as unknown as { lotes: unknown[] }).lotes.length})${identico ? "   desenho IDÊNTICO" : ""}`,
    );
    porFormato.push({
      formato: f,
      lotesNaTestadaSemAsFaces: a?.lotes ?? null,
      lotesNaTestadaComAsFaces: b?.lotes ?? null,
      lotesSemAsFaces: (vSem.saida as unknown as { lotes: unknown[] }).lotes.length,
      lotesComAsFaces: (vCom.saida as unknown as { lotes: unknown[] }).lotes.length,
      desenhoIdentico: identico,
    });
  }

  glebas.push({
    prompt: "LAB-37",
    gleba: id,
    semente: SEMENTE,
    contrato: "1",
    motor: "laboratorio-de-parcelamento",
    regua: {
      toleranciaDaFace_m: TOL_DA_FACE_M,
      fracaoMinimaDaFace: FRACAO_MINIMA_DA_FACE,
      porQueAFracao:
        "sem ela a face vizinha, que toca a linha no vértice compartilhado, sairia como coberta — a lição do D75",
    },
    testadasDeFrente: testadasDeFrente.map((t) => ({ comprimento_m: n1(comprimento(t)) })),
    facesDoPerimetro: entrada.gleba.anel.length,
    facesTocadas: porFace.map((f) => ({
      face: f.face,
      comprimento_m: n1(f.comprimento_m),
      fracaoCoberta: n3(f.fracaoCoberta),
      entregue: f.fracaoCoberta >= FRACAO_MINIMA_DA_FACE,
    })),
    facesLoteamentoEntregues: faces,
    escolhaDoMotor: { semAsFaces: mSem, comAsFaces: mCom },
    porFormato,
  });
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "testada-de-frente.json"),
  `${JSON.stringify({ prompt: "LAB-37", geradoEm: CARIMBO, semente: SEMENTE, contrato: "1", glebas }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-37/testada-de-frente.json`);
