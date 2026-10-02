/**
 * Os testes do contrato v2. (LAB-18)
 *
 * ```sh
 * bun test tests/contrato-v2.test.ts
 * ```
 *
 * O que eles fixam, e por quê:
 *
 * - **a esteira lê v2 E v1**, e a razão é a regra que o próprio Generate
 *   escreveu: *"quem lê tem de aguentar o outro lado evoluir"*. As fixtures em
 *   `docs/fixtures/` declaram `"1"` e são **prova de medição antiga**;
 * - **versão desconhecida continua sendo recusada**. Aceitar duas versões não é
 *   aceitar qualquer uma: v3 tem de estourar, e com a mensagem dizendo quais
 *   ela lê;
 * - **a saída do Symbios carrega a rampa máxima**, que ele já media desde o
 *   LAB-02 e não tinha onde escrever (D67);
 * - **o pico não é a média**, e a diferença é de ordem de grandeza: `completo`
 *   dá média 24,2 % e pico 161,4 %. Um teste que só olhasse a média aprovaria
 *   uma rua que não se constrói;
 * - **`rampaPior_pct` sai `null` quando o motor não reporta** — e `null` não
 *   quer dizer terreno plano (D23).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { FALTA_NA_V1, VERSOES_LIDAS, glebaParaOSymbios } from "../src/gleba-v1.ts";
import { entradaDaPorta, type Indicadores } from "../src/porta/porta.ts";
import {
  motorDoGenerate,
  motorDoParcelamento,
  motorDoSymbios,
  separar,
} from "../src/porta/motores.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);
const wasm = await Motor.carregar(readFileSync(WASM));

const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

describe("as versões que a esteira lê", () => {
  test("lê a v2 e a v1, da mais nova para a mais velha", () => {
    expect(VERSOES_LIDAS).toEqual(["2", "1"]);
  });

  test("uma entrada v1 passa — as fixtures gravadas são prova antiga", () => {
    const e = glebaDoLab("completo");
    expect(e.archilly.versao).toBe("1");
    expect(() => glebaParaOSymbios(e)).not.toThrow();
  });

  test("uma entrada v2 passa", () => {
    const e = { ...glebaDoLab("completo") };
    e.archilly = { ...e.archilly, versao: "2" };
    expect(() => glebaParaOSymbios(e)).not.toThrow();
  });

  test("uma versão que ela NÃO lê estoura, e a mensagem diz quais ela lê", () => {
    const e = { ...glebaDoLab("completo") };
    e.archilly = { ...e.archilly, versao: "3" };
    expect(() => glebaParaOSymbios(e)).toThrow(/lê o contrato "2" e "1"/);
    expect(() => glebaParaOSymbios(e)).toThrow(/chegou versão "3"/);
  });

  test("o que a v1 não carrega fica declarado, não suposto", () => {
    expect(FALTA_NA_V1.length).toBeGreaterThanOrEqual(5);
    const tudo = FALTA_NA_V1.join(" ");
    for (const campo of ["app_nascente", "nascente", "eixoDoCurso", "via_desenhada", "rampaMaxima_pct"]) {
      expect(tudo).toContain(campo);
    }
  });
});

// Os quatro motores rodam UMA vez, aqui, e os testes leem o resultado.
//
// Gerar dentro de cada `test` custava de 2 a 7 segundos por motor na gleba de
// 141,8 ha, e três testes estouravam o teto de 5 s do `bun test` — tempo de
// motor, não de defeito. Um teste que falha por relógio ensina a ignorar
// vermelho.
const entrada = entradaDaPorta(glebaDoLab("completo"), SEMENTE, CARIMBO, separar);
const doSymbios = motorDoSymbios(wasm).gerar(entrada);
const semPico = [
  motorDoGenerate("ortogonal"),
  motorDoGenerate("espinha"),
  motorDoParcelamento(),
].map((m) => ({ id: m.capacidades().id, r: m.gerar(entrada) }));

describe("a rampa por via: a média que diluía, e o pico que o v2 deixou passar", () => {
  test("a saída do Symbios declara v2 e carrega a rampa máxima", () => {
    const s = doSymbios.saida as { archilly: { versao: string }; vias: { rampaMaxima_pct: number | null }[] };
    expect(s.archilly.versao).toBe("2");
    expect(s.vias.length).toBeGreaterThan(0);
    for (const v of s.vias) expect(typeof v.rampaMaxima_pct).toBe("number");
  });

  test("o PICO é muito maior que a média — é o número que reprova a obra", () => {
    const i = doSymbios.indicadores as Indicadores;
    expect(i.rampaMediaMaxima_pct).not.toBeNull();
    expect(i.rampaPior_pct).not.toBeNull();
    // Medido no LAB-18 em `completo`: média 24,23 % e pico 161,38 %.
    expect(i.rampaPior_pct!).toBeGreaterThan(100);
    expect(i.rampaPior_pct!).toBeGreaterThan(5 * i.rampaMediaMaxima_pct!);
  });

  test("quem não reporta o pico sai null — e null não é terreno plano", () => {
    expect(semPico).toHaveLength(3);
    for (const { id, r } of semPico) {
      const i = r.indicadores as Indicadores;
      expect(i.rampaPior_pct, `${id} deveria sair null`).toBeNull();
      expect(i.rampaPior_pct).not.toBe(0);
    }
  });
});
