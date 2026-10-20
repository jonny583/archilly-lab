/**
 * **LAB-209 (item 900) · a aferição do LAB-53 se refaz byte a byte (fora o `quando`) com o motor de 14/09 (`fe0c7a1`
 * a `244aae3`, e a ilha de `d2f71e4` a `66ece91`) e o Generate do contrato v1 a 03/10, 14h24 — e NÃO com nenhuma das
 * duas pontas da origem na hora da prova** (D437).
 *
 * ```sh
 * bun test tests/retrato-do-lab53.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `e1fbe61`, o motor e o Generate na história
 * deles) e roda **a ferramenta do Lab de então** (com `INVARIANTES_EXEMPLOS=100000`, sem o que ela recusa medir): nos
 * quatro cantos das duas janelas e nas duas pontas da ilha do motor tem de refazer a prova byte a byte, fora o
 * `quando` da raiz; no instante (as pontas da origem às 03h21 UTC de 07/10) tem de ACUSAR, e cada um dos dois
 * vizinhos do instante sozinho também — o achado; nas bordas tem de acusar, ou de não rodar por falta de módulo — os
 * dentes, que são commits de verdade dos vizinhos. O motivo inteiro está no cabeçalho de `src/retrato-do-lab53.ts`.
 * A prova não se toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e por
 * isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). Os
 * vizinhos só são lidos. Cada rodada leva de 10 a 40 segundos; são doze.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  A_FERRAMENTA,
  A_ILHA_DO_MOTOR,
  A_JANELA_DO_GENERATE,
  A_JANELA_DO_MOTOR,
  A_PROVA,
  FORA_DA_COMPARACAO,
  O_AMBIENTE,
  OS_COMMITS_RODADOS,
  O_RETRATO_DO_LAB53,
  semOQuandoDaRaiz,
} from "../src/retrato-do-lab53.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const TESTFIT = join(RAIZ, "external-engines", "testfit");
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  "motor-testfit": join(RAIZ, "..", "motor-testfit"),
  "urban-create-hub-41d93a4d": join(RAIZ, "..", "urban-create-hub-41d93a4d"),
};
const MINUTOS = 60_000;
const curto = (c: string) => c.slice(0, 7);
const LAB = O_RETRATO_DO_LAB53[0]!;
const M = A_JANELA_DO_MOTOR;
const I = A_ILHA_DO_MOTOR;
const G = A_JANELA_DO_GENERATE;
const TODOS = [M.primeiro, M.ultimo, M.oDoLab53, M.antes, M.depois, M.oDoInstante, I.primeiro, I.ultimo, I.antes, G.primeiro, G.ultimo, G.oDoLab53, G.antes, G.depois, G.oDoInstante];

describe("LAB-209 · o retrato escrito", () => {
  test("o Lab tem um commit; as duas janelas têm as duas bordas e o instante FORA; a ilha fica antes da borda de antes", () => {
    expect(O_RETRATO_DO_LAB53.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    for (const c of TODOS) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(new Set([M.primeiro, M.ultimo, M.antes, M.depois, M.oDoInstante, I.primeiro, I.ultimo, I.antes]).size).toBe(8);
    expect(new Set([G.primeiro, G.ultimo, G.antes, G.depois, G.oDoInstante]).size).toBe(5);
    expect(M.oInstanteEstaDentro).toBe(false);
    expect(G.oInstanteEstaDentro).toBe(false);
    for (const e of [OS_COMMITS_RODADOS.motor, OS_COMMITS_RODADOS.generate]) {
      expect(e.naoRodam + e.refazemNaIlha + e.acusamAntes + e.refazem + e.acusamDepois).toBe(e.commits);
      expect(e.refazem).toBeGreaterThan(0);
    }
    expect(OS_COMMITS_RODADOS.motor.rodadosPelaFerramenta).toBe(OS_COMMITS_RODADOS.motor.commits);
    const g = OS_COMMITS_RODADOS.generate;
    expect(g.commits - g.naoRodamPelaArvore).toBe(g.rodadosPelaFerramenta);
  });

  test("a ordem na história: ilha → borda de antes → janela → borda de depois → instante, nos dois vizinhos", () => {
    const anc = (nome: string, a: string, b: string) =>
      spawnSync("git", ["-C", ORIGEM[nome]!, "merge-base", "--is-ancestor", a, b]).status === 0;
    const m = "motor-testfit";
    for (const [a, b] of [
      [I.antes, I.primeiro],
      [I.primeiro, I.ultimo],
      [I.ultimo, M.antes],
      [M.antes, M.primeiro],
      [M.primeiro, M.oDoLab53],
      [M.oDoLab53, M.ultimo],
      [M.ultimo, M.depois],
      [M.depois, M.oDoInstante],
    ] as const)
      expect(anc(m, a, b), `motor: ${curto(a)} antes de ${curto(b)}`).toBe(true);
    const g = "urban-create-hub-41d93a4d";
    for (const [a, b] of [
      [G.antes, G.primeiro],
      [G.primeiro, G.oDoLab53],
      [G.oDoLab53, G.ultimo],
      [G.ultimo, G.depois],
      [G.depois, G.oDoInstante],
    ] as const)
      expect(anc(g, a, b), `Generate: ${curto(a)} antes de ${curto(b)}`).toBe(true);
  });

  test("a comparação deixa de fora só o `quando` da RAIZ — dos dois lados", () => {
    expect(FORA_DA_COMPARACAO).toEqual(["quando"]);
    const prova = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    const raiz = JSON.parse(prova) as Record<string, unknown>;
    expect(typeof raiz["quando"]).toBe("string");
    const outroCarimbo = prova.replace(String(raiz["quando"]), "2000-01-01T00:00:00.000Z");
    expect(outroCarimbo).not.toBe(prova);
    expect(semOQuandoDaRaiz(outroCarimbo)).toBe(semOQuandoDaRaiz(prova));
    expect(prova.length - semOQuandoDaRaiz(prova).length).toBe(`  "quando": "${String(raiz["quando"])}",\n`.length);
    const outroNumero = prova.replace('    "violacoes": 92,', '    "violacoes": 93,');
    expect(outroNumero).not.toBe(prova);
    expect(semOQuandoDaRaiz(outroNumero)).not.toBe(semOQuandoDaRaiz(prova));
    const fundo = '{\n  "a": {\n    "quando": "x",\n    "b": 1\n  }\n}';
    expect(semOQuandoDaRaiz(fundo)).toBe(fundo);
  });

  test("o commit do Lab é o único da prova e da ferramenta de então, e a prova cala os dois vizinhos", () => {
    const daHistoria = (caminho: string) =>
      execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", caminho], { encoding: "utf8" }).trim().split("\n");
    expect(daHistoria(join("docs", "provas", A_PROVA))).toEqual([LAB.commit]);
    expect(daHistoria(A_FERRAMENTA)[0], "a ferramenta mudou depois do LAB-53: a de então já não é a de hoje").toBe(LAB.commit);
    const texto = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    for (const c of TODOS) expect(texto).not.toContain(curto(c));
  });

  test("os dois instantes são mesmo as pontas da origem na hora da prova", () => {
    const hora = execFileSync("git", ["-C", RAIZ, "show", "-s", "--format=%cI", LAB.commit], { encoding: "utf8" }).trim();
    for (const [nome, c] of [
      ["motor-testfit", M.oDoInstante],
      ["urban-create-hub-41d93a4d", G.oDoInstante],
    ] as const) {
      const origem = ORIGEM[nome]!;
      if (!existsSync(origem)) throw new Error(`o clone ${nome} não está em ${origem}`);
      const ponta = execFileSync("git", ["-C", origem, "rev-list", "-1", "--first-parent", `--before=${hora}`, "origin/main"], { encoding: "utf8" }).trim();
      expect(ponta, `${nome}: a ponta da origem às ${hora} não é a escrita`).toBe(c);
    }
  });
});

describe("LAB-209 · as janelas, perguntadas à ferramenta", () => {
  let pasta = "";
  const arv = (nome: string) => join(pasta, nome);
  const lab = () => arv("archilly-lab");

  function por(nome: string, commit: string) {
    execFileSync("git", ["-C", arv(nome), "checkout", "-q", "-f", commit]);
    execFileSync("git", ["-C", arv(nome), "clean", "-q", "-fd"]);
  }

  /** Roda a ferramenta de então com os vizinhos nos commits dados e diz se ela rodou, se a prova saiu igual (fora o `quando`) e o que disse ao cair. */
  function rodarCom(m: string, g: string): { rodou: boolean; igual: boolean; queda: string } {
    por("motor-testfit", m);
    por("urban-create-hub-41d93a4d", g);
    const caminho = join(lab(), "docs", "provas", A_PROVA);
    execFileSync("git", ["-C", lab(), "checkout", "-q", "--", join("docs", "provas", A_PROVA)]);
    const antes = readFileSync(caminho, "utf8");
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, ...O_AMBIENTE },
    });
    const rodou = r.status === 0;
    const igual = rodou && semOQuandoDaRaiz(readFileSync(caminho, "utf8")) === semOQuandoDaRaiz(antes);
    const queda = rodou ? "" : `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
    console.log(
      `    [retrato-do-lab53] Lab ${curto(LAB.commit)} · motor ${curto(m)} · Generate ${curto(g)} · ${rodou ? (igual ? "a prova igual, byte a byte (fora o quando)" : "a prova difere") : "a ferramenta não rodou"}`,
    );
    return { rodou, igual, queda };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab53-retrato-"));
    const montar = (nome: string, commit: string, outros: string[]) => {
      const origem = ORIGEM[nome]!;
      if (!existsSync(origem)) throw new Error(`o clone ${nome} não está em ${origem} — clone-o só para leitura, com a história inteira`);
      execFileSync("git", ["clone", "-q", "--no-checkout", origem, arv(nome)]);
      for (const c of [commit, ...outros])
        if (spawnSync("git", ["-C", arv(nome), "cat-file", "-e", `${c}^{commit}`]).status !== 0)
          throw new Error(`o commit ${c} não está na história de ${origem} — desrase-o: git -C ${origem} fetch --unshallow origin`);
      execFileSync("git", ["-C", arv(nome), "checkout", "-q", commit]);
    };
    montar("archilly-lab", LAB.commit, []);
    montar("motor-testfit", M.oDoInstante, [M.primeiro, M.ultimo, M.antes, M.depois, I.primeiro, I.ultimo]);
    montar("urban-create-hub-41d93a4d", G.oDoInstante, [G.primeiro, G.ultimo, G.oDoLab53, G.antes, G.depois]);
    // As dependências de hoje, e o zod que o Generate importa, na node_modules dele (o git de lá a ignora).
    symlinkSync(join(ESTEIRA, "node_modules"), join(lab(), "external-engines", "esteira", "node_modules"));
    if (existsSync(join(TESTFIT, "node_modules")))
      symlinkSync(join(TESTFIT, "node_modules"), join(lab(), "external-engines", "testfit", "node_modules"));
    cpSync(join(ESTEIRA, "node_modules", "zod"), join(arv("urban-create-hub-41d93a4d"), "node_modules", "zod"), { recursive: true });
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "nos quatro cantos das duas janelas e nas duas pontas da ilha a ferramenta de então refaz a prova byte a byte, fora o `quando`",
    () => {
      const pares: Array<[string, string]> = [
        [M.primeiro, G.primeiro],
        [M.primeiro, G.ultimo],
        [M.ultimo, G.primeiro],
        [M.ultimo, G.ultimo],
        [I.primeiro, G.oDoLab53],
        [I.ultimo, G.oDoLab53],
      ];
      for (const [m, g] of pares)
        expect(
          { ...rodarCom(m, g), queda: "" },
          `com o motor em ${curto(m)} e o Generate em ${curto(g)} a ferramenta não refaz mais a prova: a janela está errada (D182: explica-se, não se regrava)`,
        ).toEqual({ rodou: true, igual: true, queda: "" });
    },
    20 * MINUTOS,
  );

  test(
    "no instante a ferramenta de então ACUSA — e cada vizinho do instante, sozinho, também",
    () => {
      for (const [m, g, porque] of [
        [M.oDoInstante, G.oDoInstante, M.porQueODoInstante],
        [M.oDoInstante, G.oDoLab53, `o motor do instante sozinho: ${M.porQueODoInstante}`],
        [M.oDoLab53, G.oDoInstante, `o Generate do instante sozinho: ${G.oQueDaDepois}`],
      ] as const) {
        const r = rodarCom(m, g);
        expect({ rodou: r.rodou, igual: r.igual }, porque).toEqual({ rodou: true, igual: false });
      }
    },
    20 * MINUTOS,
  );

  test(
    "nas bordas a ferramenta de então acusa, ou não roda por falta de módulo — os dentes, em commits de verdade",
    () => {
      for (const [m, g, porque] of [
        [M.antes, G.oDoLab53, M.oQueDaAntes],
        [M.depois, G.oDoLab53, M.oQueDaDepois],
        [M.oDoLab53, G.depois, G.oQueDaDepois],
      ] as const) {
        const r = rodarCom(m, g);
        expect({ rodou: r.rodou, igual: r.igual }, porque).toEqual({ rodou: true, igual: false });
      }
      for (const [m, g, porque, marca] of [
        [M.oDoLab53, G.antes, G.oQueDaAntes, G.aMarcaDaQueda],
        [I.antes, G.oDoLab53, I.oQueDaAntes, I.aMarcaDaQueda],
      ] as const) {
        const r = rodarCom(m, g);
        expect(r.rodou, porque).toBe(false);
        expect(r.queda, `${porque}: a queda tem de ser a falta de módulo, não outra`).toContain(marca);
      }
    },
    20 * MINUTOS,
  );
});
