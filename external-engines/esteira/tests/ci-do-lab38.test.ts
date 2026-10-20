/**
 * **LAB-218 (item 900) · os três disparos do CI do LAB-38 — o ato rodou código de vizinho?** (D446)
 *
 * ```sh
 * bun test tests/ci-do-lab38.test.ts
 * ```
 *
 * A prova `LAB-38/ci.json` registra um ato — três disparos do CI, um sabotado —, e a lista de quem grava as provas
 * dizia *"não há ferramenta que o grave, e por isso ele não roda código de ninguém"*. Esta trava pergunta: a resposta
 * da API do GitHub (congelada em `src/ci-do-lab38.ts`, com a data) contra a prova e contra o `verde.yml` do commit de
 * cada disparo, e o fecho do que o trabalho sem clones rodou, lido do `git` naquele commit.
 *
 * **Precisa da história do Lab** (os três commits são de 04/10/2026): no clone raso da máquina do disparo, a receita do
 * `COMO_FUNCIONA.md` (LAB-116) desrasa antes. Não precisa dos vizinhos — e por isso não lê nenhum —, mas também NÃO
 * está no portão sem clones do `verde.yml`: o `checkout` dele é raso. Roda no verde completo.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

import {
  A_PROVA,
  OS_DISPAROS,
  OS_PASSOS_DO_VIZINHO,
  OS_PROCESSOS_INOCENTES,
  OS_TRABALHOS,
  oQueOTesteRodaPorProcesso,
  osArquivosDasGuardas,
  osDisparosDaProva,
  oVerdeParouAntesDoClone,
  passosDoWorkflow,
  type Disparo,
  type ProvaDoCi,
  type Trabalho,
} from "../src/ci-do-lab38.ts";
import { semComentarios, vizinhosQueRoda } from "../src/o-commit-do-vizinho-na-prova.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = "external-engines/esteira";
const PROVA = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as ProvaDoCi;
const temCommit = (c: string) => spawnSync("git", ["-C", RAIZ, "cat-file", "-e", `${c}^{commit}`]).status === 0;
const doCommit = (c: string, caminho: string) =>
  execFileSync("git", ["-C", RAIZ, "show", `${c}:${caminho}`], { encoding: "utf8", maxBuffer: 1 << 26 });

describe("LAB-218 · a parte pura, nos dois sentidos", () => {
  test("a resposta da API bate com a prova: os mesmos três runs e a conclusão de cada trabalho", () => {
    expect(osDisparosDaProva(PROVA, OS_DISPAROS)).toEqual([]);
  });

  test("O LADO RUIM: run trocado, conclusão trocada e disparo a menos reprovam, pelo nome", () => {
    const d1 = OS_DISPAROS[0]!;
    const run = [{ ...d1, run: 1 }, ...OS_DISPAROS.slice(1)];
    expect(osDisparosDaProva(PROVA, run)).toEqual([`disparo 1: a prova diz run ${d1.run}, a resposta 1`]);
    const virado: Disparo = {
      ...d1,
      trabalhos: { ...d1.trabalhos, "guardas-sem-clones": { ...d1.trabalhos["guardas-sem-clones"], conclusao: "success" } },
    };
    expect(osDisparosDaProva(PROVA, [virado, ...OS_DISPAROS.slice(1)])).toEqual([
      "disparo 1, guardas-sem-clones: a prova diz failure, a resposta success",
    ]);
    expect(osDisparosDaProva(PROVA, OS_DISPAROS.slice(1))).toEqual(["a prova tem 3 disparos, a resposta 2"]);
  });

  test("nos três disparos, nenhum passo de vizinho rodou: os clones e o comando único saíram `skipped`", () => {
    for (const d of OS_DISPAROS) expect(oVerdeParouAntesDoClone(d), `disparo ${d.n}`).toEqual([]);
  });

  test("O LADO RUIM: um clone que rodou, um passo que sumiu e um clone no trabalho sem clones reprovam", () => {
    const d = OS_DISPAROS[1]!;
    const v = d.trabalhos["verde-completo"];
    const rodou: Disparo = {
      ...d,
      trabalhos: {
        ...d.trabalhos,
        "verde-completo": { ...v, passos: v.passos.map((p) => (p.nome === OS_PASSOS_DO_VIZINHO[0] ? { ...p, conclusao: "success" } : p)) },
      },
    };
    expect(oVerdeParouAntesDoClone(rodou)).toEqual([`disparo 2: o passo "${OS_PASSOS_DO_VIZINHO[0]}" RODOU (success)`]);
    const sumiu: Disparo = {
      ...d,
      trabalhos: { ...d.trabalhos, "verde-completo": { ...v, passos: v.passos.filter((p) => p.nome !== OS_PASSOS_DO_VIZINHO[2]) } },
    };
    expect(oVerdeParouAntesDoClone(sumiu)).toEqual([`disparo 2: o verde completo não tem o passo "${OS_PASSOS_DO_VIZINHO[2]}"`]);
    const g = d.trabalhos["guardas-sem-clones"];
    const intruso: Disparo = {
      ...d,
      trabalhos: { ...d.trabalhos, "guardas-sem-clones": { ...g, passos: [...g.passos, { nome: OS_PASSOS_DO_VIZINHO[1], conclusao: "success" }] } },
    };
    expect(oVerdeParouAntesDoClone(intruso)).toEqual([`disparo 2: o trabalho sem clones tem o passo "${OS_PASSOS_DO_VIZINHO[1]}"`]);
  });

  test("os processos filhos: comando e primeiro argumento literais; a linha de shell sai como `<shell>`", () => {
    expect(oQueOTesteRodaPorProcesso(`execFileSync("bun", ["ferramentas/lab20.ts"], { cwd })`)).toEqual([
      { comando: "bun", primeiro: "ferramentas/lab20.ts" },
    ]);
    expect(oQueOTesteRodaPorProcesso(`execFileSync("git", ["-C", dir, "status"])`)).toEqual([{ comando: "git", primeiro: "-C" }]);
    expect(oQueOTesteRodaPorProcesso(`spawnSync("find", [RAIZ])`)).toEqual([{ comando: "find", primeiro: null }]);
    expect(oQueOTesteRodaPorProcesso("execSync(`bun x`); await $`ls`")).toEqual([
      { comando: "<shell>", primeiro: null },
      { comando: "<shell>", primeiro: null },
    ]);
    expect(oQueOTesteRodaPorProcesso(`import { execFileSync } from "node:child_process";`)).toEqual([]);
  });
});

describe("LAB-218 · o que o ato rodou, perguntado ao `git` no commit de cada disparo", () => {
  const pasta = mkdtempSync(join(tmpdir(), "lab218-"));
  const faltam = OS_DISPAROS.filter((d) => !temCommit(d.commit)).map((d) => d.commit.slice(0, 7));

  beforeAll(() => {
    if (faltam.length > 0) return;
    for (const d of OS_DISPAROS) {
      const destino = join(pasta, d.commit.slice(0, 7), "archilly-lab");
      mkdirSync(destino, { recursive: true });
      const tar = spawnSync("git", ["-C", RAIZ, "archive", "--format=tar", d.commit], { maxBuffer: 1 << 30 });
      expect(tar.status, tar.stderr?.toString()).toBe(0);
      const x = spawnSync("tar", ["-x", "-C", destino], { input: tar.stdout, maxBuffer: 1 << 30 });
      expect(x.status, x.stderr?.toString()).toBe(0);
    }
  });
  afterAll(() => rmSync(pasta, { recursive: true, force: true }));

  test("os três commits estão na história do Lab (no clone raso, desrase pela receita do LAB-116)", () => {
    expect(faltam, "git fetch -q --unshallow origin — a receita do COMO_FUNCIONA.md (LAB-116, D344)").toEqual([]);
  });

  test("a resposta da API casa com o `verde.yml` de cada commit, passo a passo e pelo nome", () => {
    for (const d of OS_DISPAROS) {
      const yml = doCommit(d.commit, ".github/workflows/verde.yml");
      for (const t of Object.keys(OS_TRABALHOS) as Trabalho[]) {
        expect(d.trabalhos[t].passos.map((p) => p.nome), `disparo ${d.n}, ${t}`).toEqual(passosDoWorkflow(yml, t));
      }
      expect(yml, "o nome do trabalho que a API devolve").toContain(`name: ${OS_TRABALHOS["verde-completo"]}`);
    }
  });

  test("o trabalho sem clones roda os mesmos cinco arquivos nos três commits", () => {
    const listas = OS_DISPAROS.map((d) => osArquivosDasGuardas(doCommit(d.commit, ".github/workflows/verde.yml")));
    for (const l of listas) expect(l).toEqual(listas[0]!);
    expect(listas[0]!.length).toBe(5);
  });

  test("O ATO: o fecho do que o trabalho sem clones rodou não alcança vizinho nenhum, nos três commits", () => {
    expect(faltam).toEqual([]);
    for (const d of OS_DISPAROS) {
      const lab = join(pasta, d.commit.slice(0, 7), "archilly-lab");
      const yml = readFileSync(join(lab, ".github/workflows/verde.yml"), "utf8");
      const pilha = osArquivosDasGuardas(yml).map((f) => `${ESTEIRA}/${f}`);
      const raizes = new Set<string>();
      const vizinhos = new Set<string>();
      const vistos = new Set<string>();
      const estranhos: string[] = [];
      while (pilha.length > 0) {
        const r = pilha.pop()!;
        if (raizes.has(r)) continue;
        raizes.add(r);
        const antes = new Set(vistos);
        for (const v of vizinhosQueRoda(r, lab, vistos)) vizinhos.add(v);
        for (const arq of [...vistos].filter((a) => !antes.has(a))) {
          for (const p of oQueOTesteRodaPorProcesso(semComentarios(readFileSync(arq, "utf8")))) {
            if (p.comando === "bun" && p.primeiro?.endsWith(".ts")) pilha.push(`${ESTEIRA}/${p.primeiro}`);
            else if (!(p.comando in OS_PROCESSOS_INOCENTES)) estranhos.push(`${relative(lab, arq)}: ${p.comando}`);
          }
        }
      }
      console.log(
        `    [ci-do-lab38] disparo ${d.n} · ${d.commit.slice(0, 7)} · ${vistos.size} arquivos no fecho, ` +
          `${raizes.size} raízes (${[...raizes].map((r) => r.replace(`${ESTEIRA}/`, "")).sort().join(", ")}) · vizinhos: ${vizinhos.size}`,
      );
      expect([...vizinhos], `disparo ${d.n}`).toEqual([]);
      expect(estranhos, `disparo ${d.n}`).toEqual([]);
      expect(vistos.size, "o fecho leu alguma coisa").toBeGreaterThan(5);
      expect([...raizes], "a ferramenta que o pagina.test.ts chama entrou").toContain(`${ESTEIRA}/ferramentas/lab20.ts`);
    }
  });

  test("O LADO RUIM do fecho: um teste plantado que importa o motor é achado como vizinho", () => {
    expect(faltam).toEqual([]);
    const d = OS_DISPAROS[2]!;
    const lab = join(pasta, d.commit.slice(0, 7), "archilly-lab");
    const plantado = `${ESTEIRA}/tests/plantado-lab218.test.ts`;
    const texto = `import { gerar } from "@testfit/motor.ts";\nimport { x } from "../src/nada.ts";\n`;
    writeFileSync(join(lab, plantado), texto);
    expect(vizinhosQueRoda(plantado, lab)).toEqual(["motor-testfit"]);
  });
});
