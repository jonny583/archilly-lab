/**
 * **LAB-224 (item 900) · as duas sabotagens do LAB-60, REFEITAS a cada verde — no commit da prova e na ponta de hoje**
 * (D452).
 *
 * ```sh
 * bun test tests/sabotagem-do-lab60.test.ts
 * ```
 *
 * A prova `LAB-60/sabotagem.json` registra um ato — *"quebrei estas travas e elas reprovaram"* — que ninguém tinha
 * refeito. Esta trava refaz as duas numa pasta temporária, no commit da prova e na ponta de hoje, com o motor no commit
 * que a prova leu; exige que cada uma morda como medido — as da prova no commit dela, e a do LAB-57 a mais hoje, na 1 —,
 * que a conta da 2 só feche com a ferramenta rodada antes da suíte, e que o ato leia o motor e não rode código dele. A
 * parte pura e o que fica fora estão em `src/sabotagem-do-lab60.ts`.
 *
 * **Precisa do Lab com a história inteira** (o commit `ce19bfc`) **e do clone do motor ao lado, com o commit `4181e95`**,
 * e por isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`).
 * Tudo se clona por caminho, para uma pasta temporária, e a pasta some no fim; o clone vizinho só é lido.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { vizinhosQueRoda } from "../src/o-commit-do-vizinho-na-prova.ts";
import { falhasDoBun, sabotar } from "../src/sabotagem-do-lab31.ts";
import {
  A_DOIS_SEM_A_FERRAMENTA,
  A_DO_LAB57,
  A_FERRAMENTA,
  A_MAIS_HOJE,
  A_PROVA,
  AS_SUITES,
  AS_TROCAS,
  O_MOTOR_DA_PROVA,
  O_QUE_A_FERRAMENTA_ESCREVE,
  OS_PARES,
  TESTES_DO_LAB60,
  aTrocaDaProva,
  oQueAProvaConta,
  type Par,
  type SabotagemDaProva,
  type Troca,
} from "../src/sabotagem-do-lab60.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const O_MOTOR_VIZINHO = join(RAIZ, "..", "motor-testfit");
const MINUTOS = 60_000;
const PARES = Object.keys(OS_PARES) as Par[];
const PROVA = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as {
  prompt: string;
  sabotagens: SabotagemDaProva[];
  oQueAFERRAMENTAnaoPega: string;
};
const trocaDe = (n: number) => AS_TROCAS.find((t) => t.numero === n)!;
const noArquivo = (nomes: readonly string[], prefixo: string) => nomes.filter((n) => n.startsWith(prefixo));
const DO_LAB60 = "LAB-60 · ";

describe("LAB-224 · a parte pura, nos dois sentidos", () => {
  test("as duas trocas são as duas da prova, e cada uma bate a conta dela", () => {
    expect(PROVA.prompt).toBe("LAB-60");
    expect(AS_TROCAS.map((t) => t.numero)).toEqual(PROVA.sabotagens.map((s) => s.n));
    expect(PROVA.oQueAFERRAMENTAnaoPega).toContain("exit 0");
    for (const t of AS_TROCAS) expect(aTrocaDaProva(PROVA, t, t.derruba), `sabotagem ${t.numero}`).toBeNull();
    // a 1 conta só o arquivo do LAB-60 (o denominador 16); a 2 nomeia uma do LAB-57
    expect(noArquivo(trocaDe(1).derruba, DO_LAB60)).toHaveLength(3);
    expect(trocaDe(2).derruba).toContain(A_DO_LAB57);
  });

  test("O LADO RUIM: outro número, outra conta, nome que não é trecho, ou a ferramenta reprovando, reprova", () => {
    const t = trocaDe(1);
    expect(aTrocaDaProva(PROVA, { numero: 9 }, t.derruba)).toContain("não tem a sabotagem");
    expect(aTrocaDaProva(PROVA, t, t.derruba.slice(1))).toContain("a prova diz 3, caíram 2");
    expect(aTrocaDaProva(PROVA, t, [...t.derruba, A_DO_LAB57])).toContain("caíram 4");
    expect(aTrocaDaProva(PROVA, trocaDe(2), [...trocaDe(2).derruba.slice(0, 1), "outro teste qualquer"])).toContain("é trecho de 0");
    const s1 = PROVA.sabotagens[0]!;
    const reprovou = { sabotagens: [{ ...s1, depoisDeCorrigirAOrdem: { ...s1.depoisDeCorrigirAOrdem!, exit: 1 } }] };
    expect(aTrocaDaProva(reprovou, t, t.derruba)).toContain("saiu com 1");
    const outra = { sabotagens: [{ ...s1, depoisDeCorrigirAOrdem: { exit: 0, oQuePegou: "3 travas de 17: 'a', 'b' e 'c'" } }] };
    expect(aTrocaDaProva(outra, t, t.derruba)).toContain("conta de 17");
    // a 2 sem a ferramenta derruba três: a prova não fecha com essa ordem
    expect(aTrocaDaProva(PROVA, trocaDe(2), A_DOIS_SEM_A_FERRAMENTA.derruba)).toContain("a prova diz 2, caíram 3");
  });

  test("a frase da prova se lê: número, denominador quando há, e os nomes entre aspas", () => {
    expect(oQueAProvaConta("3 travas de 16: 'a', 'b' e 'c'")).toEqual({ fail: 3, de: 16, nomes: ["a", "b", "c"] });
    expect(oQueAProvaConta("2 travas: 'a' e, no LAB-57, 'b'")).toEqual({ fail: 2, de: null, nomes: ["a", "b"] });
    expect(oQueAProvaConta("nenhuma trava")).toBeNull();
  });

  test("o que hoje cai a mais é só a do LAB-57, e só na 1", () => {
    expect(A_MAIS_HOJE[1]).toEqual([A_DO_LAB57]);
    expect(A_MAIS_HOJE[2]).toEqual([]);
    for (const t of AS_TROCAS) for (const a of A_MAIS_HOJE[t.numero]!) expect(t.derruba).not.toContain(a);
  });
});

describe("LAB-224 · as sabotagens do LAB-60 REFEITAS, em pasta temporária", () => {
  let pasta = "";
  const lab = (par: Par) => join(pasta, par, "archilly-lab");
  const motor = (par: Par) => join(pasta, par, "motor-testfit");
  const commitDe = (par: Par) =>
    OS_PARES[par] === "HEAD" ? execFileSync("git", ["-C", RAIZ, "rev-parse", "HEAD"], { encoding: "utf8" }).trim() : OS_PARES[par];

  beforeAll(() => {
    if (!existsSync(O_MOTOR_VIZINHO))
      throw new Error(`o clone do motor não está em ${O_MOTOR_VIZINHO} — clone-o ao lado, com a história inteira, só para leitura`);
    if (spawnSync("git", ["-C", O_MOTOR_VIZINHO, "cat-file", "-e", `${O_MOTOR_DA_PROVA}^{commit}`]).status !== 0)
      throw new Error(`o commit ${O_MOTOR_DA_PROVA} não está no clone do motor — desrase-o: git -C ../motor-testfit fetch --unshallow origin`);
    pasta = mkdtempSync(join(tmpdir(), "lab60-sabotagem-"));
    for (const par of PARES) {
      const commit = commitDe(par);
      if (spawnSync("git", ["-C", RAIZ, "cat-file", "-e", `${commit}^{commit}`]).status !== 0)
        throw new Error(`o commit ${commit} não está na história do Lab — desrase-o: git fetch --unshallow origin`);
      mkdirSync(join(pasta, par));
      execFileSync("git", ["clone", "-q", "--no-checkout", RAIZ, lab(par)]);
      execFileSync("git", ["-C", lab(par), "checkout", "-q", commit]);
      symlinkSync(join(ESTEIRA, "node_modules"), join(lab(par), "external-engines", "esteira", "node_modules"));
      execFileSync("git", ["clone", "-q", "--no-checkout", O_MOTOR_VIZINHO, motor(par)]);
      execFileSync("git", ["-C", motor(par), "checkout", "-q", O_MOTOR_DA_PROVA]);
    }
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  const rodar = (dir: string, args: string[]) => {
    const r = spawnSync("bun", args, { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    return { exit: r.status ?? -1, saida: `${r.stdout ?? ""}\n${r.stderr ?? ""}` };
  };
  const esteira = (l: string) => join(l, "external-engines", "esteira");
  const curto = (a: string) => a.slice("external-engines/esteira/".length);
  const suite = (l: string) => {
    const r = rodar(esteira(l), ["test", ...AS_SUITES.map(curto)]);
    return { ...r, falhas: falhasDoBun(r.saida) };
  };
  const ferramenta = (l: string) => rodar(esteira(l), [curto(A_FERRAMENTA)]);
  const mudados = (dir: string) =>
    execFileSync("git", ["-C", dir, "status", "--porcelain", "--untracked-files=all"], { encoding: "utf8" }) // sem trim: o "XY "
      .split("\n")
      .filter((l) => l.trim() !== "" && !l.includes("node_modules"))
      .map((l) => l.slice(3))
      .sort();
  const aplicar = (l: string, t: Troca) => {
    const caminho = join(l, t.arquivo);
    const s = sabotar(readFileSync(caminho, "utf8"), t);
    if (s === null) throw new Error(`sabotagem ${t.numero}: o trecho não está UMA vez em ${t.arquivo}`);
    writeFileSync(caminho, s);
  };
  const restaurar = (l: string) => execFileSync("git", ["-C", l, "checkout", "-q", "--", "."]);

  test(
    "o ANTES, nos dois pares: a suíte aprova a prova gravada; a ferramenta sai bem, reescreve só a dela, e a suíte aprova",
    () => {
      for (const par of PARES) {
        const l = lab(par);
        const s0 = suite(l);
        expect(s0.falhas, `${par}: a suíte sobre a prova gravada`).toEqual([]);
        expect(s0.exit, par).toBe(0);
        const f = ferramenta(l);
        const sujos = mudados(l);
        const s = suite(l);
        restaurar(l);
        console.log(`    [sabotagem-do-lab60] ${par} · Lab ${commitDe(par).slice(0, 7)} · motor ${O_MOTOR_DA_PROVA.slice(0, 7)} · sem sabotagem: ferramenta exit ${f.exit}, escreveu ${sujos.length}, suíte ${s.falhas.length} reprovado(s)`);
        expect(f.exit, `${par}: a ferramenta sem sabotagem`).toBe(0);
        expect(sujos, `${par}: a ferramenta reescreve a prova dela, e só ela`).toEqual([O_QUE_A_FERRAMENTA_ESCREVE]);
        expect(s.falhas, `${par}: as travas sobre o que a ferramenta escreveu`).toEqual([]);
        expect(mudados(motor(par)), `${par}: o motor só foi lido`).toEqual([]);
      }
    },
    5 * MINUTOS,
  );

  test(
    "cada sabotagem, nos dois pares, com a ferramenta antes da suíte: exit 0, e caem as da prova — hoje, na 1, também a do LAB-57",
    () => {
      for (const t of AS_TROCAS) {
        for (const par of PARES) {
          const l = lab(par);
          aplicar(l, t);
          const f = ferramenta(l);
          const sujos = mudados(l);
          const s = suite(l);
          restaurar(l);
          const esperado = [...t.derruba, ...(par === "o-de-hoje" ? A_MAIS_HOJE[t.numero]! : [])].sort();
          console.log(`    [sabotagem-do-lab60] ${par} · sabotagem ${t.numero}: ferramenta exit ${f.exit}; suíte ${s.falhas.length} reprovado(s), ${noArquivo(s.falhas, DO_LAB60).length} de ${TESTES_DO_LAB60} no arquivo do LAB-60`);
          expect(f.exit, `${par} · sabotagem ${t.numero}: a ferramenta não vê a cegueira (a prova: exit 0)`).toBe(0);
          expect(sujos, `${par} · sabotagem ${t.numero}: o que ficou escrito`).toEqual([O_QUE_A_FERRAMENTA_ESCREVE, t.arquivo].sort());
          expect(s.exit, `${par} · sabotagem ${t.numero}: a suíte não reprovou`).toBe(1);
          expect(s.falhas, `${par} · sabotagem ${t.numero}: os testes derrubados`).toEqual(esperado);
          if (par === "o-da-prova") expect(aTrocaDaProva(PROVA, t, s.falhas), `sabotagem ${t.numero}`).toBeNull();
          expect(mudados(motor(par)), `${par}: o motor só foi lido`).toEqual([]);
        }
      }
    },
    10 * MINUTOS,
  );

  test(
    "a ORDEM, pela conta: a 2 com a suíte lendo a prova GRAVADA (sem a ferramenta) derruba três — a conta da prova é a de ferramenta → suíte",
    () => {
      const t = trocaDe(A_DOIS_SEM_A_FERRAMENTA.sabotagem);
      for (const par of PARES) {
        const l = lab(par);
        aplicar(l, t);
        const s = suite(l);
        restaurar(l);
        console.log(`    [sabotagem-do-lab60] ${par} · sabotagem 2 sem a ferramenta: suíte ${s.falhas.length} reprovado(s) (a prova: 2)`);
        expect(s.falhas, par).toEqual([...A_DOIS_SEM_A_FERRAMENTA.derruba]);
      }
    },
    5 * MINUTOS,
  );

  test(
    "o vizinho: o ato LÊ o motor (sem ele a ferramenta para com exit 1) e não roda código dele (o fecho dos `import`)",
    () => {
      for (const par of PARES) {
        const vizinhos = [...new Set([A_FERRAMENTA, ...AS_SUITES].flatMap((a) => vizinhosQueRoda(a, lab(par))))].sort();
        const fora = `${motor(par)}.fora`;
        renameSync(motor(par), fora);
        let f: { exit: number; saida: string };
        try {
          f = ferramenta(lab(par));
        } finally {
          renameSync(fora, motor(par));
        }
        const sujos = mudados(lab(par));
        restaurar(lab(par));
        console.log(`    [sabotagem-do-lab60] ${par} · fecho: ${vizinhos.length ? vizinhos.join(", ") : "só o Lab"}; sem o motor: exit ${f.exit}`);
        expect(vizinhos, par).toEqual([]);
        expect(f.exit, `${par}: sem o motor`).toBe(1);
        expect(f.saida, par).toContain("o clone do motor não está em");
        expect(sujos, `${par}: sem o motor, nada se escreve`).toEqual([]);
      }
    },
    5 * MINUTOS,
  );
});
