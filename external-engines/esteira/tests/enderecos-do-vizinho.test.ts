/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-63 · As travas do endereço que eu declaro no repositório do vizinho.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Cada um dos seis mecanismos do LAB-58 declara `ondeNoMotor` — arquivo e nome no clone do
 * `motor-testfit`. **São acusações contra o motor de um vizinho, e elas já saíram**: no
 * relatório, no recado e na lista que o chat leva. **Nada no verde conferia o endereço.**
 *
 * Medido no LAB-63: o mecanismo `rede-viaria-aparada-so-pela-divisa` dizia
 * `motor.ts · apararRedeViaria e aplicarCulDeSac`, e os **dois** moram em outros arquivos —
 * `motor.ts` é só onde eles são **chamados**.
 *
 * > **Endereço que leva à chamada e não à definição manda quem recebe procurar no arquivo
 * > errado.** É o *pedido pela metade* da Pesquisa, do lado de quem acusa.
 *
 * Estas travas **leem o clone vizinho**, então elas rodam no verde completo e **não** no
 * trabalho de CI que roda sem segredo. Leitura só (§4).
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { MECANISMOS } from "../src/mecanismos-das-violacoes.ts";
import {
  conferirEndereco,
  defineSimbolo,
  lerEndereco,
  lerEnderecos,
} from "../src/varredura-do-que-eu-aceitei.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CLONE = join(RAIZ, "..", "motor-testfit");

function fontes(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".git" || e === "dist") continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) fontes(p, out);
    else if (e.endsWith(".ts") || e.endsWith(".tsx")) out.push(p);
  }
  return out;
}
const todos = fontes(join(CLONE, "src"));
const ler = (caminho: string): string | null => {
  const p = join(CLONE, caminho);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
};
const procurar = (simbolo: string): string | null => {
  const achado = todos.find((f) => defineSimbolo(readFileSync(f, "utf8"), simbolo));
  return achado ? relative(CLONE, achado) : null;
};

describe("LAB-63 · todo endereço que eu declaro no vizinho RESOLVE", () => {
  test("o clone está lá — e se não estiver, isto FALHA com a receita, nunca pula (D124)", () => {
    expect(existsSync(join(CLONE, "src", "lib", "lab"))).toBe(true);
  });

  for (const m of MECANISMOS) {
    test(`${m.id}: arquivo existe e cada símbolo é DEFINIDO nele`, () => {
      const enderecos = lerEnderecos(m.ondeNoMotor);
      expect(enderecos.length).toBeGreaterThan(0);
      for (const e of enderecos) {
        expect(e.repositorio).toBe("motor-testfit");
        expect(conferirEndereco(e, ler, procurar)).toEqual([]);
      }
    });
  }

  test("os seis juntos conferem SEIS símbolos — endereço só de prosa não é endereço medido", () => {
    const simbolos = MECANISMOS.flatMap((m) =>
      lerEnderecos(m.ondeNoMotor).flatMap((e) => e.simbolos),
    );
    expect(simbolos).toHaveLength(6);
    const soProsa = MECANISMOS.filter(
      (m) => lerEnderecos(m.ondeNoMotor).every((e) => e.simbolos.length === 0),
    ).map((m) => m.id);
    expect(soProsa).toEqual(["face-de-quadra-limitada-num-eixo-so"]);
  });

  test("toda prova citada por um mecanismo existe no disco", () => {
    for (const m of MECANISMOS) {
      for (const caminho of m.aProvaQueSustenta.match(/docs\/provas\/[\w./-]+\.json/g) ?? []) {
        expect(existsSync(join(RAIZ, caminho))).toBe(true);
      }
    }
  });
});

describe("LAB-63 · a régua do endereço reprova o endereço errado", () => {
  test("o defeito ACHADO neste prompt, replantado, é pego", () => {
    const errado = lerEndereco("motor-testfit · src/lib/lab/motor.ts · apararRedeViaria (lido)")!;
    const falhas = conferirEndereco(errado, ler, procurar);
    expect(falhas).toHaveLength(1);
    expect(falhas[0]).toEqual({
      tipo: "simbolo-nao-definido-aqui",
      simbolo: "apararRedeViaria",
      arquivo: "src/lib/lab/motor.ts",
      ondeEstaDefinido: "src/lib/lab/aparo.ts",
    });
  });

  test("arquivo que não existe no clone reprova por conta própria", () => {
    const fantasma = lerEndereco("motor-testfit · src/lib/lab/nao-existe.ts · quadraRet")!;
    expect(conferirEndereco(fantasma, ler, procurar)).toEqual([
      { tipo: "arquivo-ausente", arquivo: "src/lib/lab/nao-existe.ts" },
    ]);
  });

  test("DEFINIDO e não MENCIONADO: `motor.ts` cita os dois nomes e não define nenhum", () => {
    const motor = ler("src/lib/lab/motor.ts")!;
    expect(motor).toContain("apararRedeViaria");
    expect(motor).toContain("aplicarCulDeSac");
    expect(defineSimbolo(motor, "apararRedeViaria")).toBe(false);
    expect(defineSimbolo(motor, "aplicarCulDeSac")).toBe(false);
    expect(defineSimbolo(motor, "reservarFacesExternas")).toBe(true);
  });

  test("o parser tira o parêntese ANTES de dividir — eram 4 símbolos perdidos em silêncio", () => {
    const e = lerEndereco("motor-testfit · a.ts · reservarFacesExternas (lido, não tocado)")!;
    expect(e.simbolos).toEqual(["reservarFacesExternas"]);
    expect(e.descricoes).toEqual([]);
  });

  test("descrição em português sai como descrição, e não como símbolo a cobrar", () => {
    const e = lerEndereco("motor-testfit · a.ts · a montagem das quadras (lida, não tocada)")!;
    expect(e.simbolos).toEqual([]);
    expect(e.descricoes).toEqual(["a montagem das quadras"]);
  });

  test("dois endereços num campo só, separados por `;`", () => {
    const dois = lerEnderecos("r · a.ts · umNome ; r · b.ts · outroNome");
    expect(dois.map((e) => [e.arquivo, e.simbolos])).toEqual([
      ["a.ts", ["umNome"]],
      ["b.ts", ["outroNome"]],
    ]);
  });
});
