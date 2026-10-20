/**
 * **LAB-221 (item 900) · as quatro sabotagens do LAB-59, REFEITAS a cada verde — no commit da prova e na ponta de hoje**
 * (D449).
 *
 * ```sh
 * bun test tests/sabotagem-do-lab59.test.ts
 * ```
 *
 * A prova `LAB-59/sabotagem.json` registra um ato — *"quebrei estas travas e elas reprovaram"* — que ninguém tinha
 * refeito; o LAB-217 achou, pelo fecho, que ele rodou o motor e o Generate. Esta trava refaz as quatro numa pasta
 * temporária, no par da prova e na ponta de hoje, e mais a reconstrução do *"antes da precondição"* da sabotagem 1;
 * exige que cada uma morda como a prova diz, sem curar nada, e mede pelo fecho (`vizinhosQueRoda`) qual delas roda
 * vizinho. A parte pura e o que fica fora estão em `src/sabotagem-do-lab59.ts`.
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e por
 * isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). Os
 * vizinhos não são tocados: tudo se clona por caminho, para uma pasta temporária, e a pasta some no fim.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { vizinhosQueRoda } from "../src/o-commit-do-vizinho-na-prova.ts";
import { falhasDoBun, sabotar } from "../src/sabotagem-do-lab31.ts";
import {
  A_PROVA,
  A_RECONSTRUCAO_DO_ANTES,
  A_SUITE,
  AS_TROCAS,
  OS_PARES,
  TESTES_DA_SUITE,
  aTrocaDaProva,
  aprovamNoOsDois,
  type Par,
  type Troca,
} from "../src/sabotagem-do-lab59.ts";

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
const PARES = Object.keys(OS_PARES) as Par[];

type Pegou = { exit: number; oQuePegou: string; oResultadoFalso?: string };
type Prova = {
  prompt: string;
  sabotagens: ({ n: number; onde: string; oQue: string } & (
    | { antesDaPrecondicao: Pegou; depoisDaPrecondicao: Pegou }
    | { resultado: Pegou }
  ))[];
};
const PROVA = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as Prova;
const daProva = (n: number) => PROVA.sabotagens.find((s) => s.n === n)!;
/** O que a prova diz da sabotagem: o `resultado`, ou o `depoisDaPrecondicao` (a 1); `antes` dá o de antes da precondição. */
const pegouNaProva = (n: number, antes = false): Pegou => {
  const s = daProva(n) as Record<string, unknown>;
  return (antes ? s["antesDaPrecondicao"] : (s["resultado"] ?? s["depoisDaPrecondicao"])) as Pegou;
};
/** Os trechos entre aspas simples de uma frase da prova — os nomes de travas que ela cita. */
const citados = (frase: string) => [...frase.matchAll(/\x27([^\x27]+)\x27/g)].map((m) => m[1]!);

describe("LAB-221 · a parte pura, nos dois sentidos", () => {
  test("as quatro trocas são as quatro da prova, pelo número e pelo `onde`, e o `exit` é o da prova", () => {
    expect(AS_TROCAS.map((t) => t.n)).toEqual(PROVA.sabotagens.map((s) => s.n));
    for (const t of AS_TROCAS) expect(aTrocaDaProva(PROVA, t), `sabotagem ${t.n}`).toBeNull();
    expect(aTrocaDaProva(PROVA, A_RECONSTRUCAO_DO_ANTES)).toBeNull();
    // a da ferramenta PARA; a que só escreve, sai bem; as da prova, a suíte reprova
    for (const t of AS_TROCAS) expect(pegouNaProva(t.n).exit, `sabotagem ${t.n}`).toBe(t.mede === "ferramenta-e-suite" ? 0 : 1);
    expect(pegouNaProva(1, true).exit).toBe(0);
  });

  test("O LADO RUIM: uma troca com outro número, outro `onde` ou outro arquivo reprova", () => {
    const t = AS_TROCAS[2]!;
    expect(aTrocaDaProva(PROVA, { ...t, n: 9 })).toContain("não tem a sabotagem");
    expect(aTrocaDaProva(PROVA, { ...t, ondeNaProva: `${t.arquivo} · cenarios[hoje].aPrimeiraNoRankingDELE` })).toContain("a prova diz");
    expect(aTrocaDaProva(PROVA, { ...t, arquivo: "docs/provas/LAB-58/sabotagem.json" })).toContain("não é o");
  });

  test("o que cada troca tem de derrubar e dizer está na frase da prova — os nomes citados, a conta, o 1 de 20", () => {
    const comAntes = [{ t: A_RECONSTRUCAO_DO_ANTES, p: pegouNaProva(1, true) }, ...AS_TROCAS.map((t) => ({ t, p: pegouNaProva(t.n) }))];
    for (const { t, p } of comAntes) {
      for (const frase of t.diz) expect(p.oQuePegou, `sabotagem ${t.n}`).toContain(frase);
      if (!t.derruba) continue;
      // cada trava citada pela prova está entre as derrubadas, pelo nome; e a conta "N de 20" é a da lista
      for (const c of citados(p.oQuePegou)) expect(t.derruba.some((d) => d.includes(c)), `sabotagem ${t.n}: "${c}"`).toBe(true);
      expect(p.oQuePegou, `sabotagem ${t.n}`).toMatch(new RegExp(`\\b${t.derruba.length}( travas?)? de ${TESTES_DA_SUITE}\\b`));
      if (t.aprovamDepois !== undefined) expect(p.oResultadoFalso, `sabotagem ${t.n}`).toContain(`os-dois: ${t.aprovamDepois} de 20`);
    }
  });

  test("a linha do `os-dois` se lê nos dois sentidos", () => {
    expect(aprovamNoOsDois('  os-dois        aprovam 16 de 20 · o ranking DELE escolheria "superquadra"')).toEqual({ aprovam: 16, de: 20 });
    expect(aprovamNoOsDois("  os-dois        aprovam  1 de 20 · …")).toEqual({ aprovam: 1, de: 20 });
    expect(aprovamNoOsDois("  so-o-motor     aprovam  0 de 20 · NENHUMA")).toBeNull();
  });
});

describe("LAB-221 · as sabotagens do LAB-59 REFEITAS, em pasta temporária", () => {
  let pasta = "";
  const arv = (par: Par, nome: string) => join(pasta, par, nome);
  const commitDe = (par: Par, nome: keyof (typeof OS_PARES)["o-de-hoje"]) => {
    const c = OS_PARES[par][nome];
    return c === "HEAD" ? git(ORIGEM[nome]!, "rev-parse", "HEAD") : c;
  };

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab59-sabotagem-"));
    for (const par of PARES) {
      for (const nome of Object.keys(OS_PARES[par]) as (keyof (typeof OS_PARES)["o-de-hoje"])[]) {
        const origem = ORIGEM[nome]!;
        const commit = commitDe(par, nome);
        if (!existsSync(origem)) throw new Error(`o clone ${nome} não está em ${origem} — clone-o só para leitura, com a história inteira`);
        if (spawnSync("git", ["-C", origem, "cat-file", "-e", `${commit}^{commit}`]).status !== 0)
          throw new Error(`o commit ${commit} não está na história de ${origem} — desrase-o: git -C ${origem} fetch --unshallow origin`);
        execFileSync("git", ["clone", "-q", "--no-checkout", origem, arv(par, nome)]);
        execFileSync("git", ["-C", arv(par, nome), "checkout", "-q", commit]);
      }
      const lab = arv(par, "archilly-lab");
      symlinkSync(join(ESTEIRA, "node_modules"), join(lab, "external-engines", "esteira", "node_modules"));
      if (existsSync(join(TESTFIT, "node_modules")) && existsSync(join(lab, "external-engines", "testfit")))
        symlinkSync(join(TESTFIT, "node_modules"), join(lab, "external-engines", "testfit", "node_modules"));
      mkdirSync(join(arv(par, GENERATE), "node_modules"), { recursive: true });
      cpSync(join(ESTEIRA, "node_modules", "zod"), join(arv(par, GENERATE), "node_modules", "zod"), { recursive: true });
    }
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  const rodar = (dir: string, args: string[]) => {
    const r = spawnSync("bun", args, {
      cwd: dir,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, INVARIANTES_EXEMPLOS: "100000" },
    });
    return { exit: r.status ?? -1, saida: `${r.stdout ?? ""}\n${r.stderr ?? ""}` };
  };
  const suite = (lab: string) => {
    const r = rodar(join(lab, "external-engines", "esteira"), ["test", A_SUITE.slice("external-engines/esteira/".length)]);
    return { ...r, falhas: falhasDoBun(r.saida) };
  };
  const ferramenta = (lab: string) => rodar(join(lab, "external-engines", "esteira"), ["ferramentas/lab59.ts"]);
  const mudados = (lab: string) =>
    execFileSync("git", ["-C", lab, "status", "--porcelain", "--untracked-files=all"], { encoding: "utf8" }) // sem trim: o "XY " da porcelana
      .split("\n")
      .filter((l) => l.trim() !== "" && !l.includes("node_modules"))
      .map((l) => l.slice(3))
      .sort();
  const PROVA_DO_CONTRAFACTUAL = "docs/provas/LAB-59/contrafactual-de-antonina.json";

  /** Aplica a troca, mede como ela pede, devolve a árvore e o que se viu. */
  const sabotarEMedir = (par: Par, t: Troca) => {
    const lab = arv(par, "archilly-lab");
    const caminho = join(lab, t.arquivo);
    let texto = readFileSync(caminho, "utf8");
    for (const troca of t.trocas) {
      const s = sabotar(texto, troca);
      if (s === null) throw new Error(`${par} · sabotagem ${t.n}: "${troca.de}" não está UMA vez em ${t.arquivo}`);
      texto = s;
    }
    writeFileSync(caminho, texto);
    const f = t.mede === "suite" ? null : ferramenta(lab);
    const sujos = mudados(lab);
    const s = t.mede === "ferramenta" ? null : suite(lab);
    execFileSync("git", ["-C", lab, "checkout", "-q", "--", "."]);
    return { f, s, sujos };
  };

  test(
    "o ANTES, nos dois pares: a ferramenta sai bem e escreve, e as 20 travas aprovam o que ela escreveu — inclusive na ponta de hoje, onde ela escreve OUTRA",
    () => {
      for (const par of PARES) {
        const lab = arv(par, "archilly-lab");
        const s0 = suite(lab);
        expect(s0.falhas, `${par}: a suíte sobre a prova gravada`).toEqual([]);
        expect(s0.saida, `${par}: a suíte tem ${TESTES_DA_SUITE} testes`).toMatch(new RegExp(`\\b${TESTES_DA_SUITE} pass\\b`));
        const f = ferramenta(lab);
        const sujos = mudados(lab);
        const s = suite(lab);
        execFileSync("git", ["-C", lab, "checkout", "-q", "--", "."]);
        const os2 = aprovamNoOsDois(f.saida);
        console.log(
          `    [sabotagem-do-lab59] ${par} · Lab ${curto(commitDe(par, "archilly-lab"))} · motor ${curto(commitDe(par, MOTOR))} · Generate ${curto(commitDe(par, GENERATE))} · sem sabotagem: ferramenta exit ${f.exit}, os-dois ${os2?.aprovam} de ${os2?.de}, suíte ${s.falhas.length} reprovado(s)`,
        );
        expect(f.exit, `${par}: a ferramenta sem sabotagem`).toBe(0);
        expect(sujos, `${par}: a ferramenta escreve a prova dela, e só ela`).toEqual([PROVA_DO_CONTRAFACTUAL]);
        if (par === "o-da-prova") expect(os2, par).toEqual({ aprovam: 16, de: 20 });
        expect(s.falhas, `${par}: as travas sobre o que a ferramenta escreveu`).toEqual([]);
      }
    },
    10 * MINUTOS,
  );

  test(
    "cada sabotagem, nos dois pares, morde como a prova diz — e a reconstrução do antes da precondição também",
    () => {
      for (const t of [A_RECONSTRUCAO_DO_ANTES, ...AS_TROCAS]) {
        const rotulo = t === A_RECONSTRUCAO_DO_ANTES ? `${t.n} sem a precondição (reconstrução)` : `${t.n}`;
        for (const par of PARES) {
          const { f, s, sujos } = sabotarEMedir(par, t);
          const os2 = f ? aprovamNoOsDois(f.saida) : null;
          console.log(
            `    [sabotagem-do-lab59] ${par} · sabotagem ${rotulo}:${f ? ` ferramenta exit ${f.exit}${os2 ? `, os-dois ${os2.aprovam} de ${os2.de}` : ""};` : ""}${s ? ` suíte ${s.falhas.length} de ${TESTES_DA_SUITE} reprovado(s)` : ""}`,
          );
          if (f) for (const frase of t.diz) expect(f.saida, `${par} · sabotagem ${rotulo}`).toContain(frase);
          if (t.mede === "ferramenta") {
            expect(f!.exit, `${par} · sabotagem ${rotulo}: a ferramenta tinha de PARAR`).toBe(1);
            expect(sujos, `${par} · sabotagem ${rotulo}: parou sem escrever`).toEqual([t.arquivo]);
          }
          if (t.mede === "ferramenta-e-suite") {
            expect(f!.exit, `${par} · sabotagem ${rotulo}: a ferramenta sai bem, e escreve o falso`).toBe(0);
            expect(os2, `${par} · sabotagem ${rotulo}`).toEqual({ aprovam: t.aprovamDepois!, de: 20 });
            expect(sujos, `${par} · sabotagem ${rotulo}`).toEqual([PROVA_DO_CONTRAFACTUAL, t.arquivo].sort());
          }
          if (t.mede === "suite") expect(sujos, `${par} · sabotagem ${rotulo}`).toEqual([t.arquivo]);
          if (s) {
            expect(s.exit, `${par} · sabotagem ${rotulo}: a suíte não reprovou`).toBe(1);
            expect(s.falhas, `${par} · sabotagem ${rotulo}: os testes derrubados`).toEqual([...t.derruba!].sort());
          }
        }
      }
    },
    20 * MINUTOS,
  );

  test("quem roda vizinho é medido pelo fecho de `import` (`vizinhosQueRoda`): a ferramenta roda o motor e o Generate; a suíte não sai do Lab", () => {
    for (const par of PARES) {
      const lab = arv(par, "archilly-lab");
      for (const t of AS_TROCAS) {
        const alvos = t.mede === "suite" ? [A_SUITE] : t.mede === "ferramenta" ? [t.arquivo] : [t.arquivo, A_SUITE];
        const vizinhos = [...new Set(alvos.flatMap((a) => vizinhosQueRoda(a, lab)))].sort();
        console.log(`    [sabotagem-do-lab59] ${par} · sabotagem ${t.n}: ${alvos.map((a) => a.split("/").pop()).join(" + ")} → ${vizinhos.length ? vizinhos.join(", ") : "só o Lab"}`);
        expect(vizinhos, `${par} · sabotagem ${t.n}: os vizinhos que ela roda`).toEqual(t.rodaVizinho ? [MOTOR, GENERATE].sort() : []);
      }
    }
  });
});
