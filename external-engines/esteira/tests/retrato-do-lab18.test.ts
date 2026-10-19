/**
 * **LAB-199 (item 900) · a prova do LAB-18 se refaz numa janela do motor, e não fora dela** (D427).
 *
 * ```sh
 * bun test tests/retrato-do-lab18.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `bf15af6`, o Generate em `5b7e9b4`, o
 * motor na história dele) e roda **a ferramenta do Lab de então, sem o Symbios** (o `.wasm` não se constrói
 * nesta máquina; as trocas estão em `SEM_O_SYMBIOS`) quatro vezes: nas duas pontas da janela tem de refazer a
 * prova valor a valor, fora as linhas `symbios`; nas duas bordas de fora tem de NÃO refazer. O motivo inteiro
 * está no cabeçalho de `src/retrato-do-lab18.ts`. A prova não se toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**,
 * e por isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo
 * (`./external-engines/conferir.sh`). Os vizinhos só são lidos. Cada rodada leva perto de cinquenta segundos.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { A_FERRAMENTA, A_JANELA_DO_MOTOR, A_PROVA, O_RETRATO_DO_LAB18, diferencasForaDoSymbios, semOSymbios } from "../src/retrato-do-lab18.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  "motor-testfit": join(RAIZ, "..", "motor-testfit"),
  "urban-create-hub-41d93a4d": join(RAIZ, "..", "urban-create-hub-41d93a4d"),
};
const prova = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as Record<string, unknown>;
const MINUTOS = 60_000;
const curto = (c: string) => c.slice(0, 7);

describe("LAB-199 · o retrato escrito", () => {
  test("o Lab e o Generate têm um commit cada, com as quarenta casas e a origem dita; a janela tem cinco e duas bordas", () => {
    expect(O_RETRATO_DO_LAB18.map((c) => c.pasta)).toEqual(["archilly-lab", "urban-create-hub-41d93a4d"]);
    for (const c of O_RETRATO_DO_LAB18) {
      expect(c.commit, c.pasta).toMatch(/^[0-9a-f]{40}$/);
      expect(c.deOndeSeSabe.length, c.pasta).toBeGreaterThan(20);
    }
    const todos = [...A_JANELA_DO_MOTOR.refazem, A_JANELA_DO_MOTOR.antes, A_JANELA_DO_MOTOR.depois];
    for (const c of todos) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(new Set(todos).size).toBe(7);
    expect(A_JANELA_DO_MOTOR.refazem).toContain(A_JANELA_DO_MOTOR.oMaisProvavel);
  });

  test("o commit do Lab é o último da prova, e o do Generate é o que a prova escreve", () => {
    const daProva = execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", join("docs", "provas", A_PROVA)], { encoding: "utf8" })
      .trim()
      .split("\n");
    expect(daProva[0]).toBe(O_RETRATO_DO_LAB18[0]!.commit);
    expect(prova["generateEm"]).toBe(O_RETRATO_DO_LAB18[1]!.commit);
  });

  test("a comparação acusa o que muda fora do Symbios e ignora só o Symbios", () => {
    expect(diferencasForaDoSymbios(prova, prova)).toEqual([]);
    const outra = structuredClone(prova) as { rampaPorVia: { motores: Record<string, Record<string, unknown>> }[] };
    outra.rampaPorVia[0]!.motores["symbios"]!["vias"] = 1;
    expect(diferencasForaDoSymbios(prova, outra)).toEqual([]);
    outra.rampaPorVia[0]!.motores["parcelamento"]!["vias"] = 1;
    expect(diferencasForaDoSymbios(prova, outra).map((d) => d.onde)).toEqual([".rampaPorVia.0.motores.parcelamento.vias"]);
  });

  test("as trocas que tiram o Symbios casam uma vez cada na ferramenta de então, e reprovam se não casarem", () => {
    const deEntao = execFileSync("git", ["-C", RAIZ, "show", `${O_RETRATO_DO_LAB18[0]!.commit}:${A_FERRAMENTA}`], { encoding: "utf8" });
    const sem = semOSymbios(deEntao);
    expect(sem).not.toContain("motorDoSymbios");
    expect(sem).not.toContain("Motor.carregar");
    expect(() => semOSymbios(sem)).toThrow(/casou 0 vezes/);
  });
});

describe("LAB-199 · a janela do motor, perguntada à ferramenta", () => {
  let pasta = "";
  const lab = () => join(pasta, "archilly-lab");
  const motor = () => join(pasta, "motor-testfit");
  const copia = () => join(lab(), "external-engines", "esteira", "ferramentas", "lab18-sem-o-symbios.ts");

  /** Põe o motor no commit, roda a cópia sem o Symbios e devolve as diferenças contra a prova. */
  function rodarCom(commitDoMotor: string) {
    execFileSync("git", ["-C", motor(), "checkout", "-q", "-f", commitDoMotor]);
    const destino = join(lab(), "docs", "provas", A_PROVA);
    unlinkSync(destino);
    const r = spawnSync("bun", [copia()], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    if (r.status !== 0) throw new Error(`a ferramenta não rodou com o motor em ${curto(commitDoMotor)} (${r.status}): ${r.stderr}`);
    if (!existsSync(destino)) throw new Error(`a ferramenta rodou e não gravou ${A_PROVA}`);
    const d = diferencasForaDoSymbios(prova, JSON.parse(readFileSync(destino, "utf8")));
    console.log(`    [retrato-do-lab18] Lab ${curto(O_RETRATO_DO_LAB18[0]!.commit)} · motor ${curto(commitDoMotor)} · Generate ${curto(O_RETRATO_DO_LAB18[1]!.commit)} · ${d.length} diferenças fora do Symbios`);
    return d;
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab18-retrato-"));
    const montar = (nome: string, commit: string, ramo?: string) => {
      const origem = ORIGEM[nome]!;
      if (!existsSync(origem)) throw new Error(`o clone ${nome} não está em ${origem} — clone-o só para leitura, com a história inteira`);
      const destino = join(pasta, nome);
      execFileSync("git", ["clone", "-q", "--no-checkout", origem, destino]);
      if (spawnSync("git", ["-C", destino, "cat-file", "-e", `${commit}^{commit}`]).status !== 0)
        throw new Error(`o commit ${commit} não está na história de ${origem} — desrase-o: git -C ${origem} fetch --unshallow origin`);
      // A ferramenta lê `generateEm` de `.git/refs/heads/main`: o Generate entra num ramo `main` solto no commit.
      execFileSync("git", ["-C", destino, "checkout", "-q", ...(ramo ? ["-B", ramo] : []), commit]);
    };
    montar("archilly-lab", O_RETRATO_DO_LAB18[0]!.commit);
    montar("urban-create-hub-41d93a4d", O_RETRATO_DO_LAB18[1]!.commit, "main");
    montar("motor-testfit", A_JANELA_DO_MOTOR.oMaisProvavel);
    for (const c of [...A_JANELA_DO_MOTOR.refazem, A_JANELA_DO_MOTOR.antes, A_JANELA_DO_MOTOR.depois])
      if (spawnSync("git", ["-C", motor(), "cat-file", "-e", `${c}^{commit}`]).status !== 0)
        throw new Error(`o commit ${c} não está na história do motor — desrase o clone vizinho`);
    // As dependências: as da esteira de hoje, e o zod que o Generate importa, na node_modules dele (o git de lá a ignora).
    symlinkSync(join(ESTEIRA, "node_modules"), join(lab(), "external-engines", "esteira", "node_modules"));
    cpSync(join(ESTEIRA, "node_modules", "zod"), join(pasta, "urban-create-hub-41d93a4d", "node_modules", "zod"), { recursive: true });
    writeFileSync(copia(), semOSymbios(readFileSync(join(lab(), A_FERRAMENTA), "utf8")));
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "nas duas pontas da janela a ferramenta de então refaz a prova, valor a valor, fora o Symbios",
    () => {
      const r = A_JANELA_DO_MOTOR.refazem;
      for (const c of [r[0]!, r[r.length - 1]!]) {
        expect(rodarCom(c), `com o motor em ${curto(c)} a ferramenta não refaz mais a prova: a janela está errada (D182: explica-se, não se regrava)`).toEqual([]);
      }
    },
    10 * MINUTOS,
  );

  test(
    "nas duas bordas de fora a ferramenta de então NÃO refaz a prova — a janela tem os dois lados",
    () => {
      for (const c of [A_JANELA_DO_MOTOR.depois, A_JANELA_DO_MOTOR.antes]) {
        expect(rodarCom(c).length, `com o motor em ${curto(c)} a ferramenta refaz a prova: a janela é maior do que a escrita`).toBeGreaterThan(0);
      }
    },
    10 * MINUTOS,
  );
});
