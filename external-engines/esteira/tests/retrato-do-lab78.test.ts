/**
 * **LAB-200 (item 900) · a prova do LAB-78 se refaz com qualquer Generate do contrato v2, e não antes dele** (D428).
 *
 * ```sh
 * bun test tests/retrato-do-lab78.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `cdc71da`, o motor em `6cf6396`, o
 * Generate na história dele) e roda **a ferramenta do Lab de então** cinco vezes: no começo da janela, no
 * instante da prova e no último commit medido tem de refazer a prova valor a valor (fora `quando` e `oChao`);
 * na borda de antes tem de NÃO refazer; e com o motor trocado pelo do LAB-59 tem de acusar — os dentes da
 * comparação. O motivo inteiro está no cabeçalho de `src/retrato-do-lab78.ts`. A prova não se toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**,
 * e por isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo
 * (`./external-engines/conferir.sh`). Os vizinhos só são lidos. Cada rodada leva perto de vinte segundos.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  A_FERRAMENTA,
  A_JANELA_DO_GENERATE,
  A_PROVA,
  FORA_DA_COMPARACAO,
  OS_ESTADOS_DO_FECHO,
  O_MOTOR_DOS_DENTES,
  O_RETRATO_DO_LAB78,
  diferencasForaDaRodada,
} from "../src/retrato-do-lab78.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const TESTFIT = join(RAIZ, "external-engines", "testfit");
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  "motor-testfit": join(RAIZ, "..", "motor-testfit"),
  "urban-create-hub-41d93a4d": join(RAIZ, "..", "urban-create-hub-41d93a4d"),
};
const prova = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as Record<string, unknown>;
const MINUTOS = 60_000;
const curto = (c: string) => c.slice(0, 7);
const [LAB, MOTOR] = O_RETRATO_DO_LAB78 as [(typeof O_RETRATO_DO_LAB78)[0], (typeof O_RETRATO_DO_LAB78)[0]];
const J = A_JANELA_DO_GENERATE;

describe("LAB-200 · o retrato escrito", () => {
  test("o Lab e o motor têm um commit cada, com as quarenta casas e a origem dita; a janela tem começo, borda de antes e nenhuma de depois", () => {
    expect(O_RETRATO_DO_LAB78.map((c) => c.pasta)).toEqual(["archilly-lab", "motor-testfit"]);
    for (const c of O_RETRATO_DO_LAB78) {
      expect(c.commit, c.pasta).toMatch(/^[0-9a-f]{40}$/);
      expect(c.deOndeSeSabe.length, c.pasta).toBeGreaterThan(20);
    }
    const todos = [J.primeiro, J.ultimoMedido, J.antes, J.oDoInstante, ...OS_ESTADOS_DO_FECHO, O_MOTOR_DOS_DENTES];
    for (const c of todos) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(J.depois).toBeNull();
    expect(OS_ESTADOS_DO_FECHO).toHaveLength(17);
    expect(new Set(OS_ESTADOS_DO_FECHO).size).toBe(17);
    expect(OS_ESTADOS_DO_FECHO.at(-1)).toBe(J.primeiro);
    expect(OS_ESTADOS_DO_FECHO).not.toContain(J.antes);
    expect(O_MOTOR_DOS_DENTES).not.toBe(MOTOR.commit);
  });

  test("o commit do Lab é o último da prova, e o do motor é o que a prova escreve", () => {
    const daProva = execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", join("docs", "provas", A_PROVA)], { encoding: "utf8" })
      .trim()
      .split("\n");
    expect(daProva[0]).toBe(LAB.commit);
    // A prova cita dois motores (o do LAB-59 e o seu); o seu é o da frase "esta rodada roda em".
    expect(JSON.stringify(prova["naoAchados"])).toContain(`esta rodada roda em \`${curto(MOTOR.commit)}\``);
    // E a prova cala o Generate: nenhum commit dos da janela aparece nela.
    const texto = JSON.stringify(prova);
    for (const c of [J.primeiro, J.oDoInstante, J.ultimoMedido, ...OS_ESTADOS_DO_FECHO]) expect(texto).not.toContain(curto(c));
  });

  test("a comparação acusa o que muda e ignora só a hora e o chão da rodada", () => {
    expect(FORA_DA_COMPARACAO).toEqual(["quando", "oChao"]);
    expect(diferencasForaDaRodada(prova, prova)).toEqual([]);
    const outra = structuredClone(prova) as Record<string, unknown> & { conta: { lotes: number }; oChao: { bun: string } };
    outra["quando"] = "2000-01-01T00:00:00.000Z";
    outra.oChao.bun = "0.0.0";
    expect(diferencasForaDaRodada(prova, outra)).toEqual([]);
    outra.conta.lotes = 99;
    expect(diferencasForaDaRodada(prova, outra).map((d) => d.onde)).toEqual([".conta.lotes"]);
    // Só na raiz: um `quando` mais fundo conta.
    (outra as Record<string, unknown>)["aFaixa"] = { ...(prova["aFaixa"] as object), quando: "x" };
    expect(diferencasForaDaRodada(prova, outra).map((d) => d.onde)).toEqual([".aFaixa.quando", ".conta.lotes"]);
  });
});

describe("LAB-200 · a janela do Generate, perguntada à ferramenta", () => {
  let pasta = "";
  const lab = () => join(pasta, "archilly-lab");
  const gen = () => join(pasta, "urban-create-hub-41d93a4d");
  const motor = () => join(pasta, "motor-testfit");

  /** Põe o Generate e o motor nos commits, roda a ferramenta de então e devolve as diferenças — ou `null` se ela não rodar. */
  function rodarCom(commitDoGenerate: string, commitDoMotor = MOTOR.commit) {
    execFileSync("git", ["-C", gen(), "checkout", "-q", "-f", commitDoGenerate]);
    execFileSync("git", ["-C", motor(), "checkout", "-q", "-f", commitDoMotor]);
    const destino = join(lab(), "docs", "provas", A_PROVA);
    rmSync(destino, { force: true });
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const rodou = r.status === 0 && existsSync(destino);
    const d = rodou ? diferencasForaDaRodada(prova, JSON.parse(readFileSync(destino, "utf8"))) : null;
    console.log(
      `    [retrato-do-lab78] Lab ${curto(LAB.commit)} · motor ${curto(commitDoMotor)} · Generate ${curto(commitDoGenerate)} · ${d ? `${d.length} diferenças` : "a ferramenta não rodou"}`,
    );
    return d;
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab78-retrato-"));
    const montar = (nome: string, commit: string) => {
      const origem = ORIGEM[nome]!;
      if (!existsSync(origem)) throw new Error(`o clone ${nome} não está em ${origem} — clone-o só para leitura, com a história inteira`);
      const destino = join(pasta, nome);
      execFileSync("git", ["clone", "-q", "--no-checkout", origem, destino]);
      if (spawnSync("git", ["-C", destino, "cat-file", "-e", `${commit}^{commit}`]).status !== 0)
        throw new Error(`o commit ${commit} não está na história de ${origem} — desrase-o: git -C ${origem} fetch --unshallow origin`);
      execFileSync("git", ["-C", destino, "checkout", "-q", commit]);
    };
    montar("archilly-lab", LAB.commit);
    montar("motor-testfit", MOTOR.commit);
    montar("urban-create-hub-41d93a4d", J.oDoInstante);
    for (const c of [J.primeiro, J.ultimoMedido, J.antes])
      if (spawnSync("git", ["-C", gen(), "cat-file", "-e", `${c}^{commit}`]).status !== 0)
        throw new Error(`o commit ${c} não está na história do Generate — desrase o clone vizinho`);
    if (spawnSync("git", ["-C", motor(), "cat-file", "-e", `${O_MOTOR_DOS_DENTES}^{commit}`]).status !== 0)
      throw new Error(`o commit ${O_MOTOR_DOS_DENTES} não está na história do motor — desrase o clone vizinho`);
    // As dependências de hoje, e o zod que o Generate importa, na node_modules dele (o git de lá a ignora).
    symlinkSync(join(ESTEIRA, "node_modules"), join(lab(), "external-engines", "esteira", "node_modules"));
    if (existsSync(join(TESTFIT, "node_modules")))
      symlinkSync(join(TESTFIT, "node_modules"), join(lab(), "external-engines", "testfit", "node_modules"));
    cpSync(join(ESTEIRA, "node_modules", "zod"), join(gen(), "node_modules", "zod"), { recursive: true });
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "no começo da janela, no instante da prova e no último medido a ferramenta de então refaz a prova, valor a valor",
    () => {
      for (const c of [J.primeiro, J.oDoInstante, J.ultimoMedido]) {
        expect(rodarCom(c), `com o Generate em ${curto(c)} a ferramenta não refaz mais a prova: a janela está errada (D182: explica-se, não se regrava)`).toEqual([]);
      }
    },
    10 * MINUTOS,
  );

  test(
    "na borda de antes a ferramenta de então NÃO refaz a prova — a janela tem começo",
    () => {
      const d = rodarCom(J.antes);
      expect(d === null || d.length > 0, `com o Generate em ${curto(J.antes)} a ferramenta refaz a prova: a janela começa antes do escrito`).toBe(true);
    },
    10 * MINUTOS,
  );

  test(
    "com o Generate dentro da janela e o motor trocado, a comparação acusa — os dentes",
    () => {
      const d = rodarCom(J.oDoInstante, O_MOTOR_DOS_DENTES);
      expect(d, "a ferramenta não rodou com o motor trocado").not.toBeNull();
      expect(d!.length, `com o motor em ${curto(O_MOTOR_DOS_DENTES)} nada mudou: a comparação não enxerga o plano`).toBeGreaterThan(0);
    },
    10 * MINUTOS,
  );
});
