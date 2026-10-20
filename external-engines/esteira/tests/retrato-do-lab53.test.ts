/**
 * **LAB-209 (item 900) · a aferição do LAB-53 se refaz byte a byte (fora o `quando`) com o motor de 14/09 (`fe0c7a1`
 * a `244aae3`) e o Generate de 02 e 03/10 (`5b70e5f` a `49d8e3e`) — e NÃO com nenhuma das duas pontas da origem na
 * hora da prova** (D437, corrigido no LAB-210, D438: a *ilha* do motor e o Generate do contrato v1 eram a ferramenta
 * gravando `LAB-48/` sem tocar a prova, e a trava, que só olhava a prova, os dava *"igual"*. Agora *"igual"* exige que a
 * ferramenta TENHA ESCRITO a prova, e o outro destino é vigiado).
 *
 * ```sh
 * bun test tests/retrato-do-lab53.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `e1fbe61`, o motor e o Generate na história
 * deles) e roda **a ferramenta do Lab de então** (com `INVARIANTES_EXEMPLOS=100000`, sem o que ela recusa medir): nos
 * quatro cantos das duas janelas tem de escrever a prova e refazê-la byte a byte, fora o `quando` da raiz; no instante
 * (as pontas da origem às 03h21 UTC de 07/10) tem de ACUSAR, e cada um dos dois vizinhos do instante sozinho também —
 * o achado; nas bordas tem de acusar, gravar noutro arquivo sem tocar a prova, ou não rodar por falta de módulo — os
 * dentes, que são commits de verdade dos vizinhos. O motivo inteiro está no cabeçalho de `src/retrato-do-lab53.ts`.
 * A prova não se toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e por
 * isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). Os
 * vizinhos só são lidos. Cada rodada leva de 10 a 40 segundos; são dezesseis.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  A_FERRAMENTA,
  A_JANELA_DO_GENERATE,
  A_JANELA_DO_MOTOR,
  A_PROVA,
  FORA_DA_COMPARACAO,
  O_AMBIENTE,
  O_OUTRO_DESTINO,
  O_QUE_GRAVA_NOUTRO,
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
const NM = O_QUE_GRAVA_NOUTRO.motor;
const NG = O_QUE_GRAVA_NOUTRO.generate;
const G = A_JANELA_DO_GENERATE;
const TODOS = [M.primeiro, M.ultimo, M.oDoLab53, M.antes, M.depois, M.oDoInstante, NM.primeiro, NM.ultimo, NM.naoRoda, G.primeiro, G.ultimo, G.oDoLab53, G.antes, G.depois, G.oDoInstante, NG.primeiro, NG.naoRoda];

describe("LAB-209 · o retrato escrito", () => {
  test("o Lab tem um commit; as duas janelas têm as duas bordas e o instante FORA; o que grava noutro arquivo fica antes delas", () => {
    expect(O_RETRATO_DO_LAB53.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    for (const c of TODOS) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(new Set([M.primeiro, M.ultimo, M.antes, M.depois, M.oDoInstante, NM.primeiro, NM.ultimo, NM.naoRoda]).size).toBe(8);
    expect(new Set([G.primeiro, G.ultimo, G.antes, G.depois, G.oDoInstante, NG.primeiro, NG.naoRoda]).size).toBe(7);
    // A borda de antes do Generate é o último que grava noutro arquivo: a janela começa logo depois dele.
    expect(G.antes).toBe(NG.ultimo);
    expect(M.oInstanteEstaDentro).toBe(false);
    expect(G.oInstanteEstaDentro).toBe(false);
    for (const e of [OS_COMMITS_RODADOS.motor, OS_COMMITS_RODADOS.generate]) {
      expect(e.naoRodam + e.gravamNoutro + e.acusamAntes + e.refazem + e.acusamDepois).toBe(e.commits);
      expect(e.refazem).toBeGreaterThan(0);
    }
    expect(OS_COMMITS_RODADOS.motor.rodadosPelaFerramenta).toBe(OS_COMMITS_RODADOS.motor.commits);
    const g = OS_COMMITS_RODADOS.generate;
    expect(g.commits - g.naoRodamPelaArvore).toBe(g.rodadosPelaFerramenta);
  });

  test("a ordem na história: não roda → grava noutro → borda de antes → janela → borda de depois → instante, nos dois vizinhos", () => {
    const anc = (nome: string, a: string, b: string) =>
      spawnSync("git", ["-C", ORIGEM[nome]!, "merge-base", "--is-ancestor", a, b]).status === 0;
    const m = "motor-testfit";
    for (const [a, b] of [
      [NM.naoRoda, NM.primeiro],
      [NM.primeiro, NM.ultimo],
      [NM.ultimo, M.antes],
      [M.antes, M.primeiro],
      [M.primeiro, M.oDoLab53],
      [M.oDoLab53, M.ultimo],
      [M.ultimo, M.depois],
      [M.depois, M.oDoInstante],
    ] as const)
      expect(anc(m, a, b), `motor: ${curto(a)} antes de ${curto(b)}`).toBe(true);
    const g = "urban-create-hub-41d93a4d";
    for (const [a, b] of [
      [NG.naoRoda, NG.primeiro],
      [NG.primeiro, G.antes],
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
    execFileSync("git", ["-C", arv(nome), "clean", "-q", "-fd", "-e", "node_modules"]);
  }

  /**
   * Roda a ferramenta de então com os vizinhos nos commits dados e diz se ela rodou, se ESCREVEU a prova, se a prova
   * saiu igual (fora o `quando`), se escreveu o outro destino e o que disse ao cair. **"Igual" exige ter escrito**: a
   * prova intocada não foi refeita (D438 — era o que fazia a ilha do LAB-209).
   */
  function rodarCom(m: string, g: string): { rodou: boolean; escreveu: boolean; igual: boolean; outro: boolean; queda: string } {
    por("motor-testfit", m);
    por("urban-create-hub-41d93a4d", g);
    const caminho = join(lab(), "docs", "provas", A_PROVA);
    const doOutro = join(lab(), "docs", "provas", O_OUTRO_DESTINO);
    execFileSync("git", ["-C", lab(), "checkout", "-q", "--", join("docs", "provas", A_PROVA), join("docs", "provas", O_OUTRO_DESTINO)]);
    const antes = readFileSync(caminho, "utf8");
    const outroAntes = readFileSync(doOutro, "utf8");
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, ...O_AMBIENTE },
    });
    const rodou = r.status === 0;
    const depois = readFileSync(caminho, "utf8");
    const escreveu = depois !== antes;
    const igual = rodou && escreveu && semOQuandoDaRaiz(depois) === semOQuandoDaRaiz(antes);
    const outro = readFileSync(doOutro, "utf8") !== outroAntes;
    const queda = rodou ? "" : `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
    const como = !rodou
      ? "a ferramenta não rodou"
      : !escreveu
        ? outro
          ? "gravou noutro arquivo (LAB-48), a prova intocada"
          : "não escreveu a prova nem o outro destino"
        : igual
          ? "a prova igual, byte a byte (fora o quando)"
          : "a prova difere";
    console.log(`    [retrato-do-lab53] Lab ${curto(LAB.commit)} · motor ${curto(m)} · Generate ${curto(g)} · ${como}`);
    return { rodou, escreveu, igual, outro, queda };
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
    montar("motor-testfit", M.oDoInstante, [M.primeiro, M.ultimo, M.antes, M.depois, NM.primeiro, NM.ultimo, NM.naoRoda]);
    montar("urban-create-hub-41d93a4d", G.oDoInstante, [G.primeiro, G.ultimo, G.oDoLab53, G.antes, G.depois, NG.primeiro, NG.naoRoda]);
    // As dependências de hoje, e o zod que o Generate importa, na node_modules dele (o git de lá a ignora).
    symlinkSync(join(ESTEIRA, "node_modules"), join(lab(), "external-engines", "esteira", "node_modules"));
    if (existsSync(join(TESTFIT, "node_modules")) && existsSync(join(lab(), "external-engines", "testfit")))
      symlinkSync(join(TESTFIT, "node_modules"), join(lab(), "external-engines", "testfit", "node_modules"));
    cpSync(join(ESTEIRA, "node_modules", "zod"), join(arv("urban-create-hub-41d93a4d"), "node_modules", "zod"), { recursive: true });
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "nos quatro cantos das duas janelas a ferramenta de então ESCREVE a prova e a refaz byte a byte, fora o `quando`",
    () => {
      const pares: Array<[string, string]> = [
        [M.primeiro, G.primeiro],
        [M.primeiro, G.ultimo],
        [M.ultimo, G.primeiro],
        [M.ultimo, G.ultimo],
      ];
      for (const [m, g] of pares)
        expect(
          { ...rodarCom(m, g), queda: "" },
          `com o motor em ${curto(m)} e o Generate em ${curto(g)} a ferramenta não refaz mais a prova: a janela está errada (D182: explica-se, não se regrava)`,
        ).toEqual({ rodou: true, escreveu: true, igual: true, outro: false, queda: "" });
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
        expect({ rodou: r.rodou, escreveu: r.escreveu, igual: r.igual }, porque).toEqual({ rodou: true, escreveu: true, igual: false });
      }
    },
    20 * MINUTOS,
  );

  test(
    "nas bordas a ferramenta de então acusa, grava noutro arquivo sem tocar a prova, ou não roda por falta de módulo — os dentes, em commits de verdade",
    () => {
      for (const [m, g, porque] of [
        [M.antes, G.oDoLab53, M.oQueDaAntes],
        [M.depois, G.oDoLab53, M.oQueDaDepois],
        [M.oDoLab53, G.depois, G.oQueDaDepois],
      ] as const) {
        const r = rodarCom(m, g);
        expect({ rodou: r.rodou, escreveu: r.escreveu, igual: r.igual }, porque).toEqual({ rodou: true, escreveu: true, igual: false });
      }
      // O que o LAB-209 contava como ilha e como janela do contrato v1: a ferramenta roda, grava LAB-48/ e não toca a prova (D438).
      for (const [m, g, porque] of [
        [NM.primeiro, G.oDoLab53, "o T01: a ponte se mede como não consertada"],
        [NM.ultimo, G.oDoLab53, "o merge seguinte ao T01: a ponte se mede como não consertada"],
        [M.oDoLab53, NG.primeiro, "o contrato v1: a ponte se mede como não consertada"],
        [M.oDoLab53, G.antes, G.oQueDaAntes],
      ] as const) {
        const r = rodarCom(m, g);
        expect({ rodou: r.rodou, escreveu: r.escreveu, outro: r.outro }, porque).toEqual({ rodou: true, escreveu: false, outro: true });
      }
      for (const [m, g, porque, marca] of [
        [M.oDoLab53, NG.naoRoda, NG.oQueDaNaoRoda, O_QUE_GRAVA_NOUTRO.aMarcaDaQueda],
        [NM.naoRoda, G.oDoLab53, NM.oQueDaNaoRoda, O_QUE_GRAVA_NOUTRO.aMarcaDaQueda],
      ] as const) {
        const r = rodarCom(m, g);
        expect(r.rodou, porque).toBe(false);
        expect(r.queda, `${porque}: a queda tem de ser a falta de módulo, não outra`).toContain(marca);
      }
    },
    20 * MINUTOS,
  );
});
