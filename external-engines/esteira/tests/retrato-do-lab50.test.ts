/**
 * **LAB-208 (item 900) · a passagem externa do LAB-50 se refaz byte a byte (fora o `quando`) com o motor de 14/09
 * (`fe0c7a1` a `244aae3`) e o Generate do contrato v2 em diante — e NÃO com o motor da origem na hora da prova** (D436).
 *
 * ```sh
 * bun test tests/retrato-do-lab50.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `846b955`, o motor e o Generate na
 * história deles) e roda **a ferramenta do Lab de então**: nos quatro cantos das duas janelas tem de refazer a
 * prova byte a byte, fora o `quando` da raiz; no instante (a ponta da origem às 22h17 UTC de 06/10) tem de ACUSAR —
 * o achado; nas duas bordas do motor tem de acusar, e na do Generate tem de CAIR sem plano — os dentes, que são
 * commits de verdade dos vizinhos. O motivo inteiro está no cabeçalho de `src/retrato-do-lab50.ts`. A prova não se
 * toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e
 * por isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`).
 * Os vizinhos só são lidos. Cada rodada leva perto de 20 segundos; são oito.
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
  OS_COMMITS_RODADOS,
  O_RETRATO_DO_LAB50,
  semOQuandoDaRaiz,
} from "../src/retrato-do-lab50.ts";

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
const LAB = O_RETRATO_DO_LAB50[0]!;
const M = A_JANELA_DO_MOTOR;
const G = A_JANELA_DO_GENERATE;

describe("LAB-208 · o retrato escrito", () => {
  test("o Lab tem um commit; o motor tem as duas bordas e o instante FORA; o Generate, a de antes e o instante dentro", () => {
    expect(O_RETRATO_DO_LAB50.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    for (const c of [M.primeiro, M.ultimo, M.antes, M.depois, M.oDoInstante, G.primeiro, G.ultimoMedido, G.antes, G.oDoInstante])
      expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(new Set([M.primeiro, M.ultimo, M.antes, M.depois, M.oDoInstante]).size).toBe(5);
    expect(M.oInstanteEstaDentro).toBe(false);
    expect(G.oInstanteEstaDentro).toBe(true);
    expect(G.depois).toBeNull();
    for (const e of [OS_COMMITS_RODADOS.motor, OS_COMMITS_RODADOS.generate]) {
      expect(e.naoRodam + e.caem + e.acusamAntes + e.refazem + e.acusamDepois).toBe(e.commits);
      expect(e.refazem).toBeGreaterThan(0);
    }
    expect(OS_COMMITS_RODADOS.motor.rodadosPelaFerramenta).toBe(OS_COMMITS_RODADOS.motor.commits);
    const g = OS_COMMITS_RODADOS.generate;
    expect(g.commits - g.naoRodamPelaArvore).toBe(g.rodadosPelaFerramenta);
  });

  test("a comparação deixa de fora só o `quando` da RAIZ — dos dois lados", () => {
    expect(FORA_DA_COMPARACAO).toEqual(["quando"]);
    const prova = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    const raiz = JSON.parse(prova) as Record<string, unknown>;
    expect(typeof raiz["quando"]).toBe("string");
    // Só o carimbo da raiz trocado: igual.
    const outroCarimbo = prova.replace(String(raiz["quando"]), "2000-01-01T00:00:00.000Z");
    expect(outroCarimbo).not.toBe(prova);
    expect(semOQuandoDaRaiz(outroCarimbo)).toBe(semOQuandoDaRaiz(prova));
    // E o que sai é exatamente a linha do carimbo, nada mais.
    expect(prova.length - semOQuandoDaRaiz(prova).length).toBe(`  "quando": "${String(raiz["quando"])}",\n`.length);
    // Um número trocado: diferente.
    const outroNumero = prova.replace('"lotesExternos": 33', '"lotesExternos": 34');
    expect(outroNumero).not.toBe(prova);
    expect(semOQuandoDaRaiz(outroNumero)).not.toBe(semOQuandoDaRaiz(prova));
    // Um `quando` mais fundo (quatro espaços de recuo) conta.
    const fundo = '{\n  "a": {\n    "quando": "x",\n    "b": 1\n  }\n}';
    expect(semOQuandoDaRaiz(fundo)).toBe(fundo);
  });

  test("o commit do Lab é o único da prova, e a prova cala os dois vizinhos", () => {
    const daHistoria = execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", join("docs", "provas", A_PROVA)], { encoding: "utf8" })
      .trim()
      .split("\n");
    expect(daHistoria).toEqual([LAB.commit]);
    const texto = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    for (const c of [M.primeiro, M.ultimo, M.antes, M.depois, M.oDoInstante, G.primeiro, G.ultimoMedido, G.antes, G.oDoInstante])
      expect(texto).not.toContain(curto(c));
  });

  test("o instante do motor é mesmo a ponta da origem na hora da prova, e o do Generate também", () => {
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

describe("LAB-208 · as janelas, perguntadas à ferramenta", () => {
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
    });
    const rodou = r.status === 0;
    const igual = rodou && semOQuandoDaRaiz(readFileSync(caminho, "utf8")) === semOQuandoDaRaiz(antes);
    const queda = rodou ? "" : `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
    console.log(
      `    [retrato-do-lab50] Lab ${curto(LAB.commit)} · motor ${curto(m)} · Generate ${curto(g)} · ${rodou ? (igual ? "a prova igual, byte a byte (fora o quando)" : "a prova difere") : "a ferramenta caiu"}`,
    );
    return { rodou, igual, queda };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab50-retrato-"));
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
    montar("motor-testfit", M.oDoInstante, [M.primeiro, M.ultimo, M.antes, M.depois]);
    montar("urban-create-hub-41d93a4d", G.oDoInstante, [G.primeiro, G.ultimoMedido, G.antes]);
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
    "nos quatro cantos das duas janelas a ferramenta de então refaz a prova byte a byte, fora o `quando`",
    () => {
      const pares: Array<[string, string]> = [
        [M.primeiro, G.primeiro],
        [M.primeiro, G.ultimoMedido],
        [M.ultimo, G.primeiro],
        [M.ultimo, G.ultimoMedido],
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
    "no instante (as pontas da origem na hora da prova) a ferramenta de então ACUSA — a prova é do motor de 14/09",
    () => {
      const r = rodarCom(M.oDoInstante, G.oDoInstante);
      expect({ rodou: r.rodou, igual: r.igual }, `${M.porQueODoInstante}`).toEqual({ rodou: true, igual: false });
    },
    20 * MINUTOS,
  );

  test(
    "nas duas bordas do motor a ferramenta de então roda e acusa, e na do Generate ela cai sem plano — os dentes, em commits de verdade",
    () => {
      const a = rodarCom(M.antes, G.oDoInstante);
      expect({ rodou: a.rodou, igual: a.igual }, `o motor em ${curto(M.antes)}: ${M.oQueDaAntes}`).toEqual({ rodou: true, igual: false });
      const d = rodarCom(M.depois, G.oDoInstante);
      expect({ rodou: d.rodou, igual: d.igual }, `o motor em ${curto(M.depois)}: ${M.oQueDaDepois}`).toEqual({ rodou: true, igual: false });
      const g = rodarCom(M.ultimo, G.antes);
      expect(g.rodou, `o Generate em ${curto(G.antes)}: ${G.oQueDaAntes}`).toBe(false);
      expect(g.queda, `o Generate em ${curto(G.antes)}: a queda tem de ser a do motor sem plano, não outra`).toContain(G.aMarcaDaQueda);
    },
    20 * MINUTOS,
  );
});
