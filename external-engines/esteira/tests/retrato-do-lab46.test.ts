/**
 * **LAB-207 (item 900) · as três amostragens do LAB-46 se refazem byte a byte com o motor de 14/09 (`fe0c7a1` a
 * `244aae3`) e o Generate do contrato v2 em diante — e NÃO com o motor da origem na hora da prova** (D435).
 *
 * ```sh
 * bun test tests/retrato-do-lab46.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `c0b7c54`, o motor e o Generate na
 * história deles) e roda **a ferramenta do Lab de então**: nos quatro cantos das duas janelas tem de refazer a
 * prova byte a byte; no instante (a ponta da origem às 00h16 UTC de 05/10) tem de ACUSAR — o achado; e nas três
 * bordas tem de acusar — os dentes, que são commits de verdade dos vizinhos. O motivo inteiro está no cabeçalho de
 * `src/retrato-do-lab46.ts`. A prova não se toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e
 * por isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`).
 * Os vizinhos só são lidos. Cada rodada leva de 20 a 45 segundos; são oito.
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
  OS_COMMITS_RODADOS,
  O_RETRATO_DO_LAB46,
} from "../src/retrato-do-lab46.ts";

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
const LAB = O_RETRATO_DO_LAB46[0]!;
const M = A_JANELA_DO_MOTOR;
const G = A_JANELA_DO_GENERATE;

describe("LAB-207 · o retrato escrito", () => {
  test("o Lab tem um commit; o motor tem as duas bordas e o instante FORA; o Generate, a de antes e o instante dentro", () => {
    expect(O_RETRATO_DO_LAB46.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    for (const c of [M.primeiro, M.ultimo, M.antes, M.depois, M.oDoInstante, G.primeiro, G.ultimoMedido, G.antes, G.oDoInstante])
      expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(new Set([M.primeiro, M.ultimo, M.antes, M.depois, M.oDoInstante]).size).toBe(5);
    expect(M.oInstanteEstaDentro).toBe(false);
    expect(G.oInstanteEstaDentro).toBe(true);
    expect(G.depois).toBeNull();
    for (const e of [OS_COMMITS_RODADOS.motor, OS_COMMITS_RODADOS.generate]) {
      expect(e.naoRodam + e.acusamAntes + e.refazem + e.acusamDepois).toBe(e.commits);
      expect(e.refazem).toBeGreaterThan(0);
    }
    expect(OS_COMMITS_RODADOS.motor.rodadosPelaFerramenta).toBe(OS_COMMITS_RODADOS.motor.commits);
    const g = OS_COMMITS_RODADOS.generate;
    expect(g.commits - g.naoRodamPelaArvore).toBe(g.rodadosPelaFerramenta);
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

describe("LAB-207 · as janelas, perguntadas à ferramenta", () => {
  let pasta = "";
  const arv = (nome: string) => join(pasta, nome);
  const lab = () => arv("archilly-lab");

  function por(nome: string, commit: string) {
    execFileSync("git", ["-C", arv(nome), "checkout", "-q", "-f", commit]);
    execFileSync("git", ["-C", arv(nome), "clean", "-q", "-fd"]);
  }

  /** Roda a ferramenta de então com os vizinhos nos commits dados e diz se ela rodou e se a prova saiu igual, byte a byte. */
  function rodarCom(m: string, g: string): { rodou: boolean; igual: boolean } {
    por("motor-testfit", m);
    por("urban-create-hub-41d93a4d", g);
    execFileSync("git", ["-C", lab(), "checkout", "-q", "--", join("docs", "provas", A_PROVA)]);
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const rodou = r.status === 0;
    const igual = rodou && spawnSync("git", ["-C", lab(), "diff", "--quiet", "--", join("docs", "provas", A_PROVA)]).status === 0;
    console.log(
      `    [retrato-do-lab46] Lab ${curto(LAB.commit)} · motor ${curto(m)} · Generate ${curto(g)} · ${rodou ? (igual ? "a prova igual, byte a byte" : "a prova difere") : "a ferramenta não rodou"}`,
    );
    return { rodou, igual };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab46-retrato-"));
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
    "nos quatro cantos das duas janelas a ferramenta de então refaz a prova byte a byte",
    () => {
      const pares: Array<[string, string]> = [
        [M.primeiro, G.primeiro],
        [M.primeiro, G.ultimoMedido],
        [M.ultimo, G.primeiro],
        [M.ultimo, G.ultimoMedido],
      ];
      for (const [m, g] of pares)
        expect(
          rodarCom(m, g),
          `com o motor em ${curto(m)} e o Generate em ${curto(g)} a ferramenta não refaz mais a prova: a janela está errada (D182: explica-se, não se regrava)`,
        ).toEqual({ rodou: true, igual: true });
    },
    20 * MINUTOS,
  );

  test(
    "no instante (as pontas da origem na hora da prova) a ferramenta de então ACUSA — a prova é do motor de 14/09",
    () => {
      expect(rodarCom(M.oDoInstante, G.oDoInstante), `${M.porQueODoInstante}`).toEqual({ rodou: true, igual: false });
    },
    20 * MINUTOS,
  );

  test(
    "nas três bordas a ferramenta de então roda e acusa — os dentes, em commits de verdade",
    () => {
      expect(rodarCom(M.antes, G.oDoInstante), `o motor em ${curto(M.antes)}: ${M.oQueDaAntes}`).toEqual({ rodou: true, igual: false });
      expect(rodarCom(M.depois, G.oDoInstante), `o motor em ${curto(M.depois)}: ${M.oQueDaDepois}`).toEqual({ rodou: true, igual: false });
      expect(rodarCom(M.ultimo, G.antes), `o Generate em ${curto(G.antes)}: ${G.oQueDaAntes}`).toEqual({ rodou: true, igual: false });
    },
    20 * MINUTOS,
  );
});
