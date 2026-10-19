/**
 * **LAB-197 (item 900) · a fotografia do LAB-48 se retira igual nos três commits que a tiraram** (D425).
 *
 * ```sh
 * bun test tests/fotografia-do-lab48.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores do retrato (o Lab, o motor e o Generate, nos
 * commits de {@link O_RETRATO_DO_LAB48}) e roda `ferramentas/lab48.ts` **de verdade**, duas vezes: a do Lab
 * de então (tem de dar a fotografia, fora o momento) e a do Lab de hoje (tem de não tocar a fotografia e de
 * gravar a aferição do LAB-53 igual à versionada). O motivo inteiro está no cabeçalho de
 * `src/fotografia-do-lab48.ts`.
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história
 * inteira**, e por isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo
 * (`./external-engines/conferir.sh`). Os vizinhos só são lidos — os clones nos commits do retrato são feitos
 * numa pasta temporária. Cada rodada do motor leva perto de um minuto e meio.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { AS_CHAVES_DO_MOMENTO, compararSemOMomento } from "../src/fotografia-no-commit-declarado.ts";
import { A_AFERICAO, A_FERRAMENTA, A_FOTOGRAFIA, O_RETRATO_DO_LAB48 } from "../src/fotografia-do-lab48.ts";
import { AS_ESPECIES } from "../src/regerar-a-varredura.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  "motor-testfit": join(RAIZ, "..", "motor-testfit"),
  "urban-create-hub-41d93a4d": join(RAIZ, "..", "urban-create-hub-41d93a4d"),
};
const lerJson = (p: string) => JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;
const fotografia = lerJson(join(RAIZ, "docs", "provas", A_FOTOGRAFIA));
const afericao = lerJson(join(RAIZ, "docs", "provas", A_AFERICAO));
const MINUTOS = 60_000;

describe("LAB-197 · o retrato escrito", () => {
  test("três commits, um por árvore, cada um com as quarenta casas e com a origem dita", () => {
    expect(O_RETRATO_DO_LAB48.map((c) => c.pasta)).toEqual(["archilly-lab", "motor-testfit", "urban-create-hub-41d93a4d"]);
    for (const c of O_RETRATO_DO_LAB48) {
      expect(c.commit, c.pasta).toMatch(/^[0-9a-f]{40}$/);
      expect(c.deOndeSeSabe.length, c.pasta).toBeGreaterThan(20);
    }
  });

  test("o commit do Lab é o da fotografia — a prova tem um commit só, e é ele", () => {
    const daProva = execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", join("docs", "provas", A_FOTOGRAFIA)], {
      encoding: "utf8",
    })
      .trim()
      .split("\n");
    expect(daProva).toEqual([O_RETRATO_DO_LAB48[0]!.commit]);
  });

  test("a prova segue na lista como fotografia, e o motivo dela nomeia o retrato", () => {
    const entrada = AS_ESPECIES.find((e) => e.prova === A_FOTOGRAFIA);
    expect(entrada?.especie).toBe("fotografia");
    for (const c of O_RETRATO_DO_LAB48) expect(entrada?.porque, c.pasta).toContain(c.commit.slice(0, 7));
  });
});

describe("LAB-197 · a fotografia do LAB-48, retirada pela ferramenta", () => {
  let pasta = "";
  const lab = () => join(pasta, "archilly-lab");

  /** Roda a ferramenta do Lab que estiver em `lab()`, e devolve o que ela gravou (ou `null`) nos dois destinos. */
  function rodar(): { fotografia: Record<string, unknown> | null; afericao: Record<string, unknown> | null } {
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      env: { ...process.env, INVARIANTES_EXEMPLOS: "100000" },
      maxBuffer: 64 * 1024 * 1024,
    });
    if (r.status !== 0) throw new Error(`a ferramenta não rodou (${r.status}): ${r.stderr}`);
    const mudou = execFileSync("git", ["-C", lab(), "status", "--porcelain", "--", "docs/provas"], { encoding: "utf8" });
    const ler = (p: string) => (mudou.includes(p) ? lerJson(join(lab(), "docs", "provas", p)) : null);
    return { fotografia: ler(A_FOTOGRAFIA), afericao: ler(A_AFERICAO) };
  }

  function poNo(commit: string) {
    execFileSync("git", ["-C", lab(), "checkout", "-q", "-f", commit]);
    execFileSync("git", ["-C", lab(), "clean", "-q", "-fd", "--", "docs/provas"]);
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab48-retrato-"));
    for (const c of O_RETRATO_DO_LAB48) {
      const origem = ORIGEM[c.pasta]!;
      if (!existsSync(origem)) throw new Error(`o clone ${c.pasta} não está em ${origem} — clone-o só para leitura, com a história inteira`);
      const destino = join(pasta, c.pasta);
      execFileSync("git", ["clone", "-q", "--no-checkout", origem, destino]);
      if (spawnSync("git", ["-C", destino, "cat-file", "-e", `${c.commit}^{commit}`]).status !== 0)
        throw new Error(`o commit ${c.commit} não está na história de ${origem} — desrase-o: git -C ${origem} fetch --unshallow origin`);
      execFileSync("git", ["-C", destino, "checkout", "-q", c.commit]);
    }
    // As dependências: as da esteira de hoje (o bun.lock é o mesmo desde o 9d28fd7), e o zod que o Generate
    // importa, copiado para a node_modules dele — pasta que o git de lá ignora, como no clone vizinho.
    symlinkSync(join(ESTEIRA, "node_modules"), join(lab(), "external-engines", "esteira", "node_modules"));
    cpSync(join(ESTEIRA, "node_modules", "zod"), join(pasta, "urban-create-hub-41d93a4d", "node_modules", "zod"), {
      recursive: true,
    });
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "a ferramenta do Lab de então, sobre os vizinhos do retrato, grava a fotografia — fora o momento",
    () => {
      poNo(O_RETRATO_DO_LAB48[0]!.commit);
      const r = rodar();
      expect(r.fotografia, "a ferramenta do 9d28fd7 não gravou o LAB-48").not.toBeNull();
      const total = r.fotografia!["total"] as { violacoes: number };
      console.log(
        `    [fotografia-do-lab48] Lab ${O_RETRATO_DO_LAB48.map((c) => c.commit.slice(0, 7)).join(" · ")} · ` +
          `${total.violacoes} violações · ${Object.keys(r.fotografia!).length - 1} chaves comparadas`,
      );
      expect(
        compararSemOMomento(fotografia, r.fotografia!),
        "nos três commits do retrato a ferramenta não refaz mais a fotografia: o retrato está errado, ou algo fora dele entrou na medição — explica-se num relatório, não se regera a fotografia (D182)",
      ).toEqual([]);
    },
    10 * MINUTOS,
  );

  test(
    "a ferramenta do Lab de hoje, sobre os mesmos vizinhos, não toca a fotografia e grava a aferição do LAB-53",
    () => {
      const hoje = execFileSync("git", ["-C", RAIZ, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
      poNo(hoje);
      const r = rodar();
      console.log(
        `    [fotografia-do-lab48] Lab ${hoje.slice(0, 7)} · LAB-48 ${r.fotografia ? "REGRAVADO" : "intocado"} · ` +
          `LAB-53 ${r.afericao ? `${(r.afericao["total"] as { violacoes: number }).violacoes} violações` : "não gravado"}`,
      );
      expect(
        r.fotografia,
        "a ferramenta de hoje regravou o LAB-48: o 'antes' deixou de ser fotografia da ponte de então, e o motivo da lista ficou falso",
      ).toBeNull();
      expect(r.afericao, "a ferramenta de hoje não gravou o LAB-53").not.toBeNull();
      expect(
        compararSemOMomento(afericao, r.afericao!),
        "com os vizinhos do retrato, a ferramenta de hoje não refaz a aferição do LAB-53",
      ).toEqual([]);
      expect([...AS_CHAVES_DO_MOMENTO]).toContain("quando");
    },
    10 * MINUTOS,
  );
});
