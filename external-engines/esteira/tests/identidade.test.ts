/**
 * A IDENTIDADE QUE VIAJA NO CONTRATO — e por que ela não pode ser minha. (LAB-29)
 *
 * ```sh
 * bun test tests/identidade.test.ts
 * ```
 *
 * # O que estava errado
 *
 * A SAÍDA do Laboratório de Parcelamento dizia
 * `motor: { nome: "motor-testfit", versao: "T00-A+ortogonal" }`. As duas eram
 * **minhas**: `motor-testfit` é o nome do **repositório** dele, e `T00-A` é o nome
 * de um **prompt do Lab**. O motor publica as duas, e com uma nota explícita na
 * versão — *"sobe quando o desenho muda de forma que o Generate veja"*.
 *
 * Mesma forma do **D104**, um nível acima: o Lab inventando onde o motor publica.
 * E com a consequência que o D108 mediu — o rótulo envelheceu no lugar, dizendo
 * "T00-A" enquanto o motor ia ao T05, e escrito **em dois arquivos** com valores
 * diferentes.
 *
 * # O que estes testes travam
 *
 * 1. **a identidade é importada, não escrita.** Para o Parcelamento isso é
 *    literal: o teste confere que a SAÍDA traz o que o módulo do motor exporta;
 * 2. **a cópia do Symbios é conferida contra a fonte.** O motor dele é WASM
 *    compilado de Rust, e não há o que importar — então o Lab guarda uma constante
 *    e **este teste lê o `upstream/VERSION`** e reprova se os dois divergirem.
 *    `upstream/` é intocável (CLAUDE.md §3), e intocável não quer dizer ilegível;
 * 3. **o que é do Lab não se disfarça de identidade do motor.** O acréscimo do Lab
 *    vai em `archilly.origem`, que é o campo de quem **rodou**.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { MOTOR_NOME, MOTOR_VERSAO } from "@testfit/contrato/tipos.ts";
import { Motor } from "@symbios/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import {
  ACRESCIMO_DO_LAB,
  NOME_DO_SYMBIOS,
  VERSAO_DO_SYMBIOS,
} from "../src/motores/symbios.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { motorDoParcelamento, motorDoSymbios } from "../src/porta/motores.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const VERSION = join(RAIZ, "external-engines", "symbios", "upstream", "VERSION");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);
const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

type Saida = {
  archilly: { origem: string };
  motor: { nome: string; versao: string; semente: string | null };
};

describe("o Laboratório de Parcelamento — a identidade é IMPORTADA", () => {
  const saida = rodarTestfit(glebaDoLab("sintetico-10ha-plano"), SEMENTE).saida as Saida;

  test("`motor.nome` é o nome que o MOTOR publica, não o do repositório", () => {
    expect(saida.motor.nome).toBe(MOTOR_NOME);
    // A trava que importa: o nome do repositório não volta sorrateiramente.
    expect(saida.motor.nome).not.toBe("motor-testfit");
  });

  test("`motor.versao` começa pela versão que o MOTOR publica", () => {
    expect(saida.motor.versao.startsWith(MOTOR_VERSAO)).toBe(true);
    // E não por rótulo de prompt do Lab. "T00-A" era o nome de um prompt meu.
    expect(saida.motor.versao).not.toContain("T0");
  });

  test("o `+<formato>` é a ÚNICA coisa que o Lab acrescenta à versão", () => {
    // Ele fica de propósito: a mesa do Generate mostra `externo · <nome> v<versão>`,
    // e sem o partido as dez variantes do motor viram dez linhas idênticas.
    const [versao, ...resto] = saida.motor.versao.split("+");
    expect(versao).toBe(MOTOR_VERSAO);
    expect(resto).toHaveLength(1);
    expect(resto[0]!.length).toBeGreaterThan(0);
  });

  test("o rótulo do Lab vai em `archilly.origem`, não na versão", () => {
    expect(saida.archilly.origem).toContain("archilly-lab");
    expect(saida.motor.versao).not.toContain("archilly-lab");
  });

  test("a porta declara a MESMA versão que a SAÍDA carrega", () => {
    // É o experimento do LAB-26 visto de perto: duas terras, uma envelhece. Agora
    // as duas leem a mesma constante, do motor.
    expect(motorDoParcelamento().capacidades().versao).toBe(MOTOR_VERSAO);
    expect(saida.motor.versao.startsWith(motorDoParcelamento().capacidades().versao)).toBe(true);
  });
});

describe("o Symbios — a cópia é conferida contra o `upstream/VERSION`", () => {
  const version = readFileSync(VERSION, "utf8");

  test("a versão que o Lab guarda é a que o upstream declara", () => {
    // O arquivo diz: "Upstream version:  0.4.1 (Cargo.toml)".
    const achado = /Upstream version:\s*([^\s(]+)/.exec(version);
    expect(achado, "o `upstream/VERSION` mudou de formato e esta régua não o lê mais").not.toBeNull();
    expect(achado![1]).toBe(VERSAO_DO_SYMBIOS);
  });

  test("o nome que o Lab guarda é o que o upstream declara", () => {
    // "Engine:            Symbios Tensor (symbios-tensor)".
    const achado = /Engine:\s*.*\(([^)]+)\)/.exec(version);
    expect(achado).not.toBeNull();
    expect(achado![1]).toBe(NOME_DO_SYMBIOS);
  });

  test("a SAÍDA traz a versão do MOTOR, sem o acréscimo do Lab", async () => {
    const wasm = await Motor.carregar(readFileSync(WASM));
    const saida = rodarSymbios(
      wasm,
      glebaDoLab("sintetico-10ha-plano"),
      SEMENTE,
      CARIMBO,
    ).saida as Saida;
    expect(saida.motor.nome).toBe(NOME_DO_SYMBIOS);
    expect(saida.motor.versao).toBe(VERSAO_DO_SYMBIOS);
    // O que o Lab acrescenta está declarado — em `origem`, que é de quem rodou.
    expect(saida.motor.versao).not.toContain("subdivisão");
    expect(saida.archilly.origem).toContain(ACRESCIMO_DO_LAB);
  });

  test("a porta declara a versão do motor; o acréscimo fica no NOME de tela", async () => {
    const wasm = await Motor.carregar(readFileSync(WASM));
    const c = motorDoSymbios(wasm).capacidades();
    expect(c.versao).toBe(VERSAO_DO_SYMBIOS);
    // O nome de tela pode e deve dizer que a dupla existe: é ele que o urbanista lê.
    expect(c.nome).toContain("subdivisão do Lab");
  });
});

describe("o que o LAB-29 NÃO reescreveu", () => {
  test("as provas congeladas do LAB-02 e do LAB-07 guardam o rótulo antigo", () => {
    // Elas são o REGISTRO de uma medição feita então, com o motor de então.
    // Regerá-las apagaria a medição para consertar uma etiqueta — e a etiqueta
    // errada está explicada no `docs/provas/LEIA-ME.md`, que esta trava exige.
    const leiaMe = readFileSync(join(RAIZ, "docs", "provas", "LEIA-ME.md"), "utf8");
    expect(leiaMe).toContain("T00-A");
    expect(leiaMe).toContain("LAB-29");
    // E ele tem de dizer onde está a identidade de verdade, senão não serve.
    expect(leiaMe).toContain("MOTOR_VERSAO");
  });
});
