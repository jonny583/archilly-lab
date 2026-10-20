/**
 * **LAB-215 (item 900) · a sabotagem do LAB-31, REFEITA a cada verde** (D443).
 *
 * ```sh
 * bun test tests/sabotagem-do-lab31.test.ts
 * ```
 *
 * A prova `LAB-31/sabotagem.json` registra um ato — *"quebrei estas travas e o comando único reprovou"* — e a única
 * trava sobre ela (`tests/verde.test.ts`) conferia a forma do JSON. Esta refaz as duas sabotagens de pacote numa pasta
 * temporária, em dois pares (o commit da prova com os vizinhos da hora dele, e a ponta de hoje com os clones do verde),
 * e exige que cada uma derrube os passos que a prova diz que caíram — e nada de cura. A parte pura está em
 * `src/sabotagem-do-lab31.ts`; o que fica fora (a sabotagem do navegador e o `exit` do comando único, os dois por causa
 * do `.wasm`) está dito lá.
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e por
 * isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). Os
 * vizinhos não são tocados: tudo se clona por caminho, para uma pasta temporária, e a pasta some no fim.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  A_PROVA,
  A_QUE_FICA_FORA,
  AS_TROCAS,
  aTrocaDaProva,
  falhasDoBun,
  oQueMordeu,
  sabotar,
  type Medicao,
  type Mordida,
  type Troca,
} from "../src/sabotagem-do-lab31.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const TESTFIT = join(RAIZ, "external-engines", "testfit");
const MOTOR = "motor-testfit";
const GENERATE = "urban-create-hub-41d93a4d";
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  [MOTOR]: join(RAIZ, "..", MOTOR),
  [GENERATE]: join(RAIZ, "..", GENERATE),
};
const MINUTOS = 60_000;
const curto = (c: string) => c.slice(0, 7);
const git = (dir: string, ...args: string[]) => execFileSync("git", ["-C", dir, ...args], { encoding: "utf8" }).trim();

type Prova = {
  sabotagens: { onde: string; oQue: string; frente: string }[];
  resultadoComASabotagem: { exit: number; passosQueFalharam: string[] };
};
const PROVA = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as Prova;

describe("LAB-215 · a parte pura, nos dois sentidos", () => {
  test("as duas trocas são as que a prova escreve — o texto que sai, inteiro, e o que entra", () => {
    for (const t of AS_TROCAS) expect(aTrocaDaProva(PROVA, t), t.onde).toBeNull();
  });

  test("O LADO RUIM: uma troca que não é a da prova reprova — o lugar, o texto que sai e o que entra", () => {
    const t = AS_TROCAS[0]!;
    expect(aTrocaDaProva(PROVA, { ...t, onde: "external-engines/esteira/tests/outro.test.ts" })).toContain("não sabota");
    expect(aTrocaDaProva(PROVA, { ...t, de: "expect(saida.motor.nome).toBe(OUTRO)" })).toContain("tira");
    expect(aTrocaDaProva(PROVA, { ...t, para: 'expect(saida.motor.nome).toBe("OUTRA")' })).toContain("põe");
  });

  test("a prova sabota TRÊS lugares: os dois daqui e o do navegador, que fica fora dito", () => {
    expect(PROVA.sabotagens.map((s) => s.onde).sort()).toEqual([...AS_TROCAS.map((t) => t.onde), A_QUE_FICA_FORA.onde].sort());
    expect(PROVA.resultadoComASabotagem.passosQueFalharam).toContain(A_QUE_FICA_FORA.passo);
  });

  test("`sabotar` troca uma ocorrência e SÓ uma: nenhuma ou duas devolvem null", () => {
    const t = { de: "a()", para: "b()" };
    expect(sabotar("x a() y", t)).toBe("x b() y");
    expect(sabotar("x y", t)).toBeNull();
    expect(sabotar("a() a()", t)).toBeNull();
  });

  test("`falhasDoBun` lê os nomes das reprovadas, sem o tempo, e ignora o resto", () => {
    const saida = "(pass) um [1.00ms]\n(fail) dois > três [0.37ms]\n  (fail) recuado não conta\n(fail) quatro\n";
    expect(falhasDoBun(saida)).toEqual(["dois > três", "quatro"]);
  });

  test("`oQueMordeu`: a sabotagem que não derruba nada é dita como tal — e a que cura, também", () => {
    const pe: Medicao = { falhas: ["velha"], lint: 0 };
    expect(oQueMordeu("esteira", pe, pe).passosDerrubados).toEqual([]);
    const m = oQueMordeu("esteira", pe, { falhas: ["nova"], lint: 1 });
    expect(m.derrubados).toEqual(["nova"]);
    expect(m.curados).toEqual(["velha"]);
    expect(m.passosDerrubados).toEqual(["esteira · test", "esteira · lint"]);
    // lint que já estava caído não é derrubado pela sabotagem
    expect(oQueMordeu("testfit", { falhas: [], lint: 1 }, { falhas: [], lint: 1 }).passosDerrubados).toEqual([]);
  });
});

describe("LAB-215 · a sabotagem do LAB-31 REFEITA, em pasta temporária, nos dois pares", () => {
  let pasta = "";
  const arv = (par: string, nome: string) => join(pasta, par, nome);

  /** Os vizinhos na ponta da origem ANTES da hora do commit da prova — o que a sessão do LAB-31 tinha, no máximo. */
  const LAB31 = git(RAIZ, "log", "--format=%H", "--diff-filter=A", "--", join("docs", "provas", A_PROVA)).split("\n").pop()!;
  const HORA = git(RAIZ, "show", "-s", "--format=%cI", LAB31);
  const naHora = (nome: string) => git(ORIGEM[nome]!, "rev-list", "-1", "--first-parent", `--before=${HORA}`, "origin/main");
  const PARES: Record<string, Record<string, string>> = {
    "o-da-prova": { "archilly-lab": LAB31, [MOTOR]: naHora(MOTOR), [GENERATE]: naHora(GENERATE) },
    "o-de-hoje": { "archilly-lab": git(RAIZ, "rev-parse", "HEAD"), [MOTOR]: git(ORIGEM[MOTOR]!, "rev-parse", "HEAD"), [GENERATE]: git(ORIGEM[GENERATE]!, "rev-parse", "HEAD") },
  };

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab31-sabotagem-"));
    for (const [par, commits] of Object.entries(PARES)) {
      for (const [nome, commit] of Object.entries(commits)) {
        const origem = ORIGEM[nome]!;
        if (!existsSync(origem)) throw new Error(`o clone ${nome} não está em ${origem} — clone-o só para leitura, com a história inteira`);
        if (spawnSync("git", ["-C", origem, "cat-file", "-e", `${commit}^{commit}`]).status !== 0)
          throw new Error(`o commit ${commit} não está na história de ${origem} — desrase-o: git -C ${origem} fetch --unshallow origin`);
        execFileSync("git", ["clone", "-q", "--no-checkout", origem, arv(par, nome)]);
        execFileSync("git", ["-C", arv(par, nome), "checkout", "-q", commit]);
      }
      const lab = arv(par, "archilly-lab");
      symlinkSync(join(ESTEIRA, "node_modules"), join(lab, "external-engines", "esteira", "node_modules"));
      symlinkSync(join(TESTFIT, "node_modules"), join(lab, "external-engines", "testfit", "node_modules"));
      cpSync(join(ESTEIRA, "node_modules", "zod"), join(arv(par, GENERATE), "node_modules", "zod"), { recursive: true });
    }
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  const medir = (lab: string, t: Troca): Medicao => {
    const dir = join(lab, "external-engines", t.pacote);
    const arquivo = t.onde.slice(`external-engines/${t.pacote}/`.length);
    const r = spawnSync("bun", ["test", arquivo], { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    const l = spawnSync(join(dir, "node_modules", ".bin", "eslint"), [arquivo, "--max-warnings", "0"], { cwd: dir, encoding: "utf8" });
    return { falhas: falhasDoBun(`${r.stdout ?? ""}\n${r.stderr ?? ""}`), lint: l.status ?? -1 };
  };

  const refazer = (par: string): Record<string, Mordida> => {
    const lab = arv(par, "archilly-lab");
    const fora: Record<string, Mordida> = {};
    for (const t of AS_TROCAS) {
      const antes = medir(lab, t);
      const caminho = join(lab, t.onde);
      const sabotado = sabotar(readFileSync(caminho, "utf8"), t);
      if (sabotado === null) throw new Error(`${par}: "${t.de}" não está UMA vez em ${t.onde}`);
      writeFileSync(caminho, sabotado);
      const depois = medir(lab, t);
      execFileSync("git", ["-C", lab, "checkout", "-q", "--", t.onde]);
      fora[t.onde] = oQueMordeu(t.pacote, antes, depois);
      console.log(
        `    [sabotagem-do-lab31] ${par} · Lab ${curto(PARES[par]!["archilly-lab"]!)} · motor ${curto(PARES[par]![MOTOR]!)} · Generate ${curto(PARES[par]![GENERATE]!)} · ${t.onde.split("/").pop()}: derruba ${fora[t.onde]!.passosDerrubados.join(", ") || "NADA"} (${fora[t.onde]!.derrubados.length} teste, lint ${antes.lint} → ${depois.lint})`,
      );
    }
    return fora;
  };

  test(
    "nos dois pares, cada sabotagem derruba os passos que a prova diz, um teste de pé cada, e não cura nada",
    () => {
      const resultados = Object.fromEntries(Object.keys(PARES).map((par) => [par, refazer(par)]));
      const daProva = PROVA.resultadoComASabotagem.passosQueFalharam.filter((p) => p !== A_QUE_FICA_FORA.passo).sort();
      for (const [par, porTroca] of Object.entries(resultados)) {
        const derrubados = Object.values(porTroca).flatMap((m) => m.passosDerrubados).sort();
        expect(derrubados, `${par}: os passos derrubados contra os da prova`).toEqual(daProva);
        for (const t of AS_TROCAS) {
          const m = porTroca[t.onde]!;
          expect(m.passosDerrubados, `${par} · ${t.onde}`).toEqual([...t.passos]);
          expect(m.derrubados, `${par} · ${t.onde}: um teste de pé derrubado`).toHaveLength(1);
          expect(m.curados, `${par} · ${t.onde}: a sabotagem não pode curar teste`).toEqual([]);
        }
      }
      // E o ato dá a MESMA resposta nos dois pares: os mesmos testes, pelo nome.
      const nomes = (par: string) => AS_TROCAS.map((t) => resultados[par]![t.onde]!.derrubados);
      expect(nomes("o-de-hoje")).toEqual(nomes("o-da-prova"));
    },
    20 * MINUTOS,
  );
});
