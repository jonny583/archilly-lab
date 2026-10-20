/**
 * **LAB-219 (item 900) · as quatro sabotagens do LAB-58, REFEITAS a cada verde** (D447).
 *
 * ```sh
 * bun test tests/sabotagem-do-lab58.test.ts
 * ```
 *
 * A prova `LAB-58/sabotagem.json` registra um ato — *"quebrei estas travas e elas reprovaram"* — que ninguém tinha
 * refeito; o LAB-217 achou, pelo fecho, que ele rodou o motor e o Generate. Esta trava refaz as quatro numa pasta
 * temporária — a 1 (a da ferramenta) no par do LAB-58, as outras três no par da prova e na ponta de hoje —, exige que
 * cada uma morda como a prova diz, sem curar nada, e mede pelo fecho (`vizinhosQueRoda`) qual delas roda vizinho. A parte
 * pura e o que fica fora estão em `src/sabotagem-do-lab58.ts`.
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

import { vizinhosQueRoda } from "../src/o-commit-do-vizinho-na-prova.ts";
import { falhasDoBun, sabotar } from "../src/sabotagem-do-lab31.ts";
import {
  A_PROVA,
  A_SUITE,
  AS_TROCAS,
  OS_PARES,
  TESTES_DA_SUITE,
  aTrocaDaProva,
  type Par,
  type Troca,
} from "../src/sabotagem-do-lab58.ts";

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
  prompt: string;
  sabotagens: { n: number; onde: string; oQue: string; depoisDoConserto: { exit: number; oQuePegou: string } }[];
};
const PROVA = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as Prova;

describe("LAB-219 · a parte pura, nos dois sentidos", () => {
  test("as quatro trocas são as quatro da prova, pelo número e pelo `onde`, e cada uma morde com exit 1 na prova", () => {
    expect(AS_TROCAS.map((t) => t.n)).toEqual(PROVA.sabotagens.map((s) => s.n));
    for (const t of AS_TROCAS) expect(aTrocaDaProva(PROVA, t), `sabotagem ${t.n}`).toBeNull();
    for (const s of PROVA.sabotagens) expect(s.depoisDoConserto.exit, `sabotagem ${s.n}`).toBe(1);
  });

  test("O LADO RUIM: uma troca com outro número, outro `onde` ou outro arquivo reprova", () => {
    const t = AS_TROCAS[1]!;
    expect(aTrocaDaProva(PROVA, { ...t, n: 9 })).toContain("não tem a sabotagem");
    expect(aTrocaDaProva(PROVA, { ...t, ondeNaProva: "src/mecanismos-das-violacoes.ts · MECANISMOS[3].casa" })).toContain("a prova diz");
    expect(aTrocaDaProva(PROVA, { ...t, arquivo: "external-engines/esteira/src/outro.ts" })).toContain("não é o");
  });

  test("o que cada troca tem de dizer está na frase da prova — as contas medidas são as que a prova escreveu", () => {
    const pegou = (n: number) => PROVA.sabotagens.find((s) => s.n === n)!.depoisDoConserto.oQuePegou;
    expect(pegou(1)).toContain("15 lotes");
    expect(pegou(1)).toContain("a função DELE devolve 0 m e a MINHA distância reconstrói 13.16 m");
    expect(pegou(2)).toContain("4 violações");
    expect(pegou(3)).toContain(`1 trava de ${TESTES_DA_SUITE}`);
    expect(pegou(3)).toContain(AS_TROCAS[2]!.diz[0]!);
    expect(pegou(4)).toContain(`1 trava de ${TESTES_DA_SUITE}`);
  });
});

describe("LAB-219 · as sabotagens do LAB-58 REFEITAS, em pasta temporária", () => {
  let pasta = "";
  const arv = (par: Par, nome: string) => join(pasta, par, nome);
  const commitDe = (par: Par, nome: keyof (typeof OS_PARES)["o-de-hoje"]) => {
    const c = OS_PARES[par][nome];
    return c === "HEAD" ? git(ORIGEM[nome]!, "rev-parse", "HEAD") : c;
  };

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab58-sabotagem-"));
    for (const par of Object.keys(OS_PARES) as Par[]) {
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
      cpSync(join(ESTEIRA, "node_modules", "zod"), join(arv(par, GENERATE), "node_modules", "zod"), { recursive: true });
    }
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  /** Roda o que a troca mede e devolve o código de saída, o que foi dito e os testes reprovados (só a suíte). */
  const medir = (lab: string, t: Troca) => {
    const dir = join(lab, "external-engines", "esteira");
    const r =
      t.mede === "suite"
        ? spawnSync("bun", ["test", A_SUITE.slice("external-engines/esteira/".length)], { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
        : spawnSync("bun", ["ferramentas/lab58.ts"], {
            cwd: dir,
            encoding: "utf8",
            maxBuffer: 64 * 1024 * 1024,
            env: { ...process.env, INVARIANTES_EXEMPLOS: "100000" },
          });
    const saida = `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
    return { exit: r.status ?? -1, saida, falhas: falhasDoBun(saida) };
  };

  const mudados = (lab: string) =>
    execFileSync("git", ["-C", lab, "status", "--porcelain", "--untracked-files=all"], { encoding: "utf8" }) // sem trim: o "XY " da porcelana
      .split("\n")
      .filter((l) => l.trim() !== "" && !l.includes("node_modules"))
      .map((l) => l.slice(3));

  test(
    "cada sabotagem, em cada par dela, morde como a prova diz — exit 0 → 1, o que ela diz, os testes pelo nome — e não cura nada",
    () => {
      for (const t of AS_TROCAS) {
        for (const par of t.pares) {
          const lab = arv(par, "archilly-lab");
          const antes = medir(lab, t);
          execFileSync("git", ["-C", lab, "checkout", "-q", "--", "."]); // a ferramenta reescreve a prova dela ao sair bem
          const jaPara = t.jaParaEm?.[par];
          if (jaPara === undefined) expect(antes.exit, `${par} · sabotagem ${t.n}: tinha de estar de pé antes`).toBe(0);
          else {
            // LAB-220: fora da janela a ferramenta já para — pela lista, e não por nenhuma frase da sabotagem
            expect(antes.exit, `${par} · sabotagem ${t.n}: fora da janela a ferramenta já para`).toBe(1);
            expect(antes.saida, `${par} · sabotagem ${t.n}`).toContain(jaPara);
            for (const frase of t.diz) expect(antes.saida, `${par} · sabotagem ${t.n}: a frase da sabotagem antes dela`).not.toContain(frase);
          }
          const caminho = join(lab, t.arquivo);
          let texto = readFileSync(caminho, "utf8");
          for (const troca of t.trocas) {
            const s = sabotar(texto, troca);
            if (s === null) throw new Error(`${par} · sabotagem ${t.n}: "${troca.de}" não está UMA vez em ${t.arquivo}`);
            texto = s;
          }
          writeFileSync(caminho, texto);
          const depois = medir(lab, t);
          const sujos = mudados(lab);
          execFileSync("git", ["-C", lab, "checkout", "-q", "--", "."]);
          console.log(
            `    [sabotagem-do-lab58] ${par} · Lab ${curto(commitDe(par, "archilly-lab"))} · motor ${curto(commitDe(par, "motor-testfit"))} · Generate ${curto(commitDe(par, GENERATE))} · sabotagem ${t.n}: exit ${antes.exit} → ${depois.exit}${t.mede === "suite" ? `, ${depois.falhas.length} teste(s) derrubado(s)` : ""}`,
          );
          expect(depois.exit, `${par} · sabotagem ${t.n}: a sabotagem não mordeu`).toBe(1);
          for (const frase of t.diz) expect(depois.saida, `${par} · sabotagem ${t.n}`).toContain(frase);
          // e a parada MUDOU: a de antes (a lista) não aparece — a calibração vem antes dela na ferramenta
          if (jaPara !== undefined) expect(depois.saida, `${par} · sabotagem ${t.n}: a parada de antes ficou`).not.toContain(jaPara);
          // A ferramenta sabotada para sem escrever: o único arquivo mudado é o sabotado.
          expect(sujos, `${par} · sabotagem ${t.n}: escreveu fora do arquivo sabotado`).toEqual([t.arquivo]);
          if (t.mede === "suite") {
            expect(antes.falhas, `${par}: a suíte tinha de estar inteira de pé`).toEqual([]);
            expect(depois.falhas, `${par} · sabotagem ${t.n}: os testes derrubados`).toEqual([...t.derruba!].sort());
            expect(antes.saida, `${par}: a suíte tem ${TESTES_DA_SUITE} testes`).toMatch(new RegExp(`\\b${TESTES_DA_SUITE} pass\\b`));
          }
        }
      }
    },
    20 * MINUTOS,
  );

  test("a sabotagem 2 faz QUATRO violações casarem dois mecanismos, nos dois pares — a conta da prova", () => {
    const t = AS_TROCAS[1]!;
    for (const par of t.pares) {
      const lab = arv(par, "archilly-lab");
      const caminho = join(lab, t.arquivo);
      const original = readFileSync(caminho, "utf8");
      writeFileSync(caminho, sabotar(original, t.trocas[0]!)!);
      const { saida } = medir(lab, t);
      writeFileSync(caminho, original);
      const linha = saida.split("\n").find((l) => l.startsWith("error: casam com mais de um mecanismo: "));
      expect(linha, par).toBeDefined();
      const duplas = linha!.slice("error: casam com mais de um mecanismo: ".length).split(" | ");
      expect(duplas, `${par}: ${duplas.join(" ; ")}`).toHaveLength(4);
      for (const d of duplas) expect(d).toMatch(/^[\w-]+\|frente\|[\w-]+: fileira-sem-via-propria, fileira-encosta-na-via-so-de-esguelha$/);
    }
  });

  test("quem roda vizinho é medido pelo fecho de `import` (`vizinhosQueRoda`): a ferramenta roda o motor e o Generate; a suíte não sai do Lab", () => {
    for (const par of Object.keys(OS_PARES) as Par[]) {
      const lab = arv(par, "archilly-lab");
      for (const t of AS_TROCAS) {
        if (!t.pares.includes(par)) continue;
        const alvo = t.mede === "suite" ? A_SUITE : t.arquivo;
        const vizinhos = vizinhosQueRoda(alvo, lab);
        console.log(`    [sabotagem-do-lab58] ${par} · sabotagem ${t.n}: ${alvo.split("/").pop()} → ${vizinhos.length ? vizinhos.join(", ") : "só o Lab"}`);
        expect(vizinhos, `${par} · sabotagem ${t.n}: os vizinhos que ela roda`).toEqual(t.rodaVizinho ? [MOTOR, GENERATE].sort() : []);
      }
    }
  });
});
