#!/usr/bin/env bun
/**
 * LAB-06 — a peça de entrega, com os quatro motores de verdade ligados nela.
 *
 * ```sh
 * bun ferramentas/lab06.ts
 * ```
 *
 * # O que esta ferramenta prova
 *
 * Os testes de `tests/entrega.test.ts` provam a peça com motores **de mentira**,
 * de propósito: é assim que se mostra que ela não precisa do Laboratório.
 *
 * Aqui é a outra metade — **os quatro motores de verdade**, o Validator de
 * verdade, uma gleba de verdade, e o ranking que a tela mostraria. Se a peça só
 * funcionasse com motor de brinquedo, ela não serviria para nada.
 *
 * O que sai em `docs/provas/LAB-06/`: o ranking como a tela o receberia, com
 * aprovadas ordenadas, reprovadas **com o motivo e sem o desenho**, e o estado
 * do usuário salvo e devolvido.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";

import type { EntradaMinima } from "../src/gleba-v1.ts";
import { julgar } from "../src/motores/comum.ts";
import { entradaDaPorta } from "../src/porta/porta.ts";
import {
  motorDoGenerate,
  motorDoParcelamento,
  motorDoSymbios,
  separar,
} from "../src/porta/motores.ts";
import {
  montarRanking,
  RegistroDeMotores,
  type MotorNaPorta as MotorDaPeca,
  type ResultadoDoMotor,
  type Veredito,
} from "../../../entrega/registro-de-motores/registro.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-06");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-20T00:00:00.000Z";
const n2 = (v: number) => Number(v.toFixed(2));

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

/** A gleba da demonstração, e a entrada da porta para ela. */
const GLEBA = "ensaio-47ha";
const v1: EntradaMinima = JSON.parse(readFileSync(join(FIXTURES, `${GLEBA}.entrada.json`), "utf8"));
const entrada = entradaDaPorta(v1, SEMENTE, CARIMBO, separar);

/**
 * Os quatro motores, registrados na peça.
 *
 * A peça declara a sua própria `MotorNaPorta` e **não importa a do Lab** — é
 * isso que a deixa copiável. As duas descrevem a mesma coisa, então o motor do
 * Lab entra por conversão de tipo, e é só isso que a ponte precisa ser.
 */
const registro = new RegistroDeMotores();
for (const m of [
  motorDoGenerate("ortogonal"),
  motorDoGenerate("espinha"),
  motorDoParcelamento(),
  motorDoSymbios(wasm),
]) {
  registro.registrar(m as unknown as MotorDaPeca);
}

/** O Validator e o Judge do Generate, ligados na peça por quem a usa. */
const julgarComARegua = (r: ResultadoDoMotor): Veredito => {
  const v = julgar(r.saida, v1);
  if (v.recusa) {
    return { aprovada: false, motivos: v.recusa, nota: null };
  }
  if ((v.violacoes ?? 0) > 0) {
    const porRegra = Object.entries(v.porTipo ?? {})
      .map(([regra, n]) => `${n} de "${regra}"`)
      .join(", ");
    return {
      aprovada: false,
      motivos: [`o conferente achou ${v.violacoes} problema(s) no desenho: ${porRegra}`],
      nota: null,
    };
  }
  return { aprovada: true, motivos: [], nota: v.lotes ?? 0 };
};

console.log(`\n══════════ a tela, em ${GLEBA} ══════════`);
console.log("  motores registrados, como a lista da tela os mostra:");
for (const m of registro.listar()) {
  console.log(
    `    ${m.ligado ? "[x]" : "[ ]"} ${m.nome}${m.padrao ? "  ← padrão" : ""}` +
      `  · entrega ${m.entrega} · ${m.geometrias.length} geometria(s)`,
  );
}

const ranking = montarRanking(registro, entrada as never, julgarComARegua);

console.log(`\n  RANKING — ${ranking.aprovadas.length} aprovada(s), ${ranking.reprovadas.length} reprovada(s)`);
for (const [i, c] of ranking.aprovadas.entries()) {
  console.log(`    ${i + 1}º ${c.nome} · nota ${c.nota} · ${n2(c.ms)} ms`);
  for (const r of c.ressalvas) console.log(`        ⚠ ${r.campo}: ${r.consequencia}`);
}
for (const c of ranking.reprovadas) {
  console.log(`    ✗ ${c.nome} — ${c.motivos.join(" · ")}`);
  console.log(`        (o desenho dela não é mostrado, de propósito)`);
}
if (ranking.nenhumaAprovada) console.log(`  ${ranking.recado}`);

// ── a escolha do usuário: salvar, sair, voltar ───────────────────────────
registro.desligar("symbios");
registro.definirPadrao("generate-espinha");
const salvo = registro.estadoDoUsuario();

const registroNovo = new RegistroDeMotores();
for (const m of [
  motorDoGenerate("ortogonal"),
  motorDoGenerate("espinha"),
  motorDoParcelamento(),
  motorDoSymbios(wasm),
]) {
  registroNovo.registrar(m as unknown as MotorDaPeca);
}
const { esquecidos } = registroNovo.aplicarEstado(salvo);

console.log(`\n  a escolha do usuário, salva e devolvida:`);
console.log(`    salvo: ${JSON.stringify(salvo)}`);
console.log(`    devolvido: padrão ${registroNovo.padrao()} · desligados ${JSON.stringify(registroNovo.idsDesligados())} · esquecidos ${esquecidos.length}`);

writeFileSync(
  join(SAIDA, "ranking.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-06",
      geradoEm: CARIMBO,
      gleba: GLEBA,
      semente: SEMENTE,
      lista: registro.listar(),
      ranking: {
        aprovadas: ranking.aprovadas.map((c) => ({
          motorId: c.motorId,
          nome: c.nome,
          geometria: c.geometria,
          nota: c.nota,
          indicadores: c.indicadores,
          ressalvas: c.ressalvas,
          ms: n2(c.ms),
          // O desenho não entra no JSON de prova: ele é grande e já sai em
          // `docs/contratos/saidas/`. O que importa aqui é a FORMA do ranking.
          temResultado: true,
        })),
        reprovadas: ranking.reprovadas.map((c) => ({
          motorId: c.motorId,
          nome: c.nome,
          geometria: c.geometria,
          motivos: c.motivos,
          ressalvas: c.ressalvas,
          ms: n2(c.ms),
          // A prova de que a regra 2 vale: não há campo de resultado aqui.
          temResultado: Object.keys(c).includes("resultado"),
        })),
        nenhumaAprovada: ranking.nenhumaAprovada,
        recado: ranking.recado,
        desligados: ranking.desligados,
      },
      escolhaDoUsuario: { salvo, devolvido: registroNovo.estadoDoUsuario(), esquecidos },
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-06/ranking.json`);
