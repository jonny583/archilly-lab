/**
 * **LAB-203 (item 900) · a guarda da IDA do LAB-30 se refaz byte a byte com qualquer motor desde `d2f71e4` e
 * qualquer Generate desde `22502b3` — porque não chama função nenhuma de nenhum dos dois** (D431).
 *
 * ```sh
 * bun test tests/retrato-do-lab30.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `c8a1013`, o motor e o Generate no
 * instante) e roda **a ferramenta do Lab de então**: no instante e nos quatro cantos tem de refazer a prova byte a
 * byte; nas duas bordas de antes tem de NÃO rodar; com toda função de topo dos `src/lib/` dos dois vizinhos
 * envenenada na cópia tem de refazer igual — e o veneno tem de estar vivo (chamar uma função de cada vizinho
 * explode); e com o destino de `gleba.furos` trocado na cópia do Lab tem de acusar — os dentes. O motivo inteiro
 * está no cabeçalho de `src/retrato-do-lab30.ts`. A prova não se toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e
 * por isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`).
 * Os vizinhos só são lidos. Cada rodada leva perto de um segundo.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  A_FERRAMENTA,
  A_JANELA_DO_GENERATE,
  A_JANELA_DO_MOTOR,
  A_PROVA,
  A_TROCA_DOS_DENTES,
  O_RETRATO_DO_LAB30,
  O_VENENO_VIVO,
  envenenarAsFuncoes,
} from "../src/retrato-do-lab30.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  "motor-testfit": join(RAIZ, "..", "motor-testfit"),
  "urban-create-hub-41d93a4d": join(RAIZ, "..", "urban-create-hub-41d93a4d"),
};
const MINUTOS = 60_000;
const curto = (c: string) => c.slice(0, 7);
const LAB = O_RETRATO_DO_LAB30[0]!;
const M = A_JANELA_DO_MOTOR;
const G = A_JANELA_DO_GENERATE;

describe("LAB-203 · o retrato escrito", () => {
  test("o Lab tem um commit; cada janela tem começo, ponta medida, borda de antes e nenhuma de depois", () => {
    expect(O_RETRATO_DO_LAB30.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    for (const j of [M, G]) {
      for (const c of [j.primeiro, j.ultimoMedido, j.antes, j.oDoInstante]) expect(c).toMatch(/^[0-9a-f]{40}$/);
      expect(j.depois).toBeNull();
      expect(j.refazem).toBeLessThan(j.rodados);
      expect(new Set([j.primeiro, j.ultimoMedido, j.antes]).size).toBe(3);
    }
    expect([M.pasta, G.pasta]).toEqual(["motor-testfit", "urban-create-hub-41d93a4d"]);
  });

  test("o commit do Lab é o último da prova, e a prova cala os dois vizinhos", () => {
    const daHistoria = execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", join("docs", "provas", A_PROVA)], { encoding: "utf8" })
      .trim()
      .split("\n");
    expect(daHistoria[0]).toBe(LAB.commit);
    const texto = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    for (const j of [M, G]) for (const c of [j.primeiro, j.ultimoMedido, j.antes, j.oDoInstante]) expect(texto).not.toContain(curto(c));
  });

  test("o veneno entra no corpo de toda função de topo — e só no corpo", () => {
    const fonte = [
      "import { x } from './x';",
      "export function a(p: number): number {",
      "  return p;",
      "}",
      "function b(",
      "  p: { q: number },",
      "): {",
      "  r: number;",
      "} {",
      "  return { r: p.q };",
      "}",
      "export function c(p: string): string;",
      "export function c(p: number): number;",
      "export function c(p: unknown): unknown {",
      "  return p;",
      "}",
      "export async function d() { return 1; }",
      "const e = () => 1;",
      "class F { g() { return 2; } }",
    ].join("\n");
    const { texto, quantas } = envenenarAsFuncoes(fonte, "x:");
    expect(quantas).toBe(4);
    const linhas = texto.split("\n");
    const depoisDe = (l: string) => linhas[linhas.indexOf(l) + 1];
    expect(depoisDe("export function a(p: number): number {")).toBe('  throw new Error("VENENO x:a");');
    expect(depoisDe("): {")).toBe("  r: number;"); // o tipo de retorno literal não é o corpo
    expect(depoisDe("} {")).toBe('  throw new Error("VENENO x:b");');
    expect(depoisDe("export function c(p: string): string;")).toBe("export function c(p: number): number;"); // sobrecarga
    expect(depoisDe("export function c(p: unknown): unknown {")).toBe('  throw new Error("VENENO x:c");');
    expect(linhas).toContain('export async function d() { throw new Error("VENENO x:d"); return 1; }'); // de uma linha só
    // o que ele NÃO alcança, dito no módulo: arrow e método ficam como estão
    expect(texto).toContain("const e = () => 1;\nclass F { g() { return 2; } }");
    expect(envenenarAsFuncoes("const z = 1;\n").quantas).toBe(0);
  });
});

describe("LAB-203 · as janelas, perguntadas à ferramenta", () => {
  let pasta = "";
  const arv = (nome: string) => join(pasta, nome);
  const lab = () => arv("archilly-lab");

  function por(nome: string, commit: string) {
    execFileSync("git", ["-C", arv(nome), "checkout", "-q", "-f", commit]);
    execFileSync("git", ["-C", arv(nome), "clean", "-q", "-fdx"]);
  }

  /** Roda a ferramenta de então e diz se ela rodou e se a prova saiu igual, byte a byte. */
  function rodar(rotulo: string): { rodou: boolean; igual: boolean } {
    execFileSync("git", ["-C", lab(), "checkout", "-q", "--", join("docs", "provas", A_PROVA)]);
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const rodou = r.status === 0;
    const igual = rodou && spawnSync("git", ["-C", lab(), "diff", "--quiet", "--", join("docs", "provas", A_PROVA)]).status === 0;
    console.log(`    [retrato-do-lab30] Lab ${curto(LAB.commit)} · ${rotulo} · ${rodou ? (igual ? "a prova igual, byte a byte" : "a prova difere") : "a ferramenta não rodou"}`);
    return { rodou, igual };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab30-retrato-"));
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
    montar(M.pasta, M.oDoInstante, [M.primeiro, M.ultimoMedido, M.antes]);
    montar(G.pasta, G.oDoInstante, [G.primeiro, G.ultimoMedido, G.antes]);
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "no instante e nos quatro cantos a ferramenta de então refaz a prova byte a byte",
    () => {
      const pares: [string, string][] = [
        [M.oDoInstante, G.oDoInstante],
        [M.primeiro, G.primeiro],
        [M.primeiro, G.ultimoMedido],
        [M.ultimoMedido, G.primeiro],
        [M.ultimoMedido, G.ultimoMedido],
      ];
      for (const [m, g] of pares) {
        por(M.pasta, m);
        por(G.pasta, g);
        expect(rodar(`motor ${curto(m)} · Generate ${curto(g)}`), `motor ${curto(m)} × Generate ${curto(g)}: a janela está errada (D182: explica-se, não se regrava)`).toEqual({
          rodou: true,
          igual: true,
        });
      }
    },
    10 * MINUTOS,
  );

  test(
    "nas duas bordas de antes a ferramenta de então não roda — cada janela tem começo",
    () => {
      por(M.pasta, M.antes);
      por(G.pasta, G.oDoInstante);
      expect(rodar(`motor ${curto(M.antes)} (borda) · Generate ${curto(G.oDoInstante)}`).rodou).toBe(false);
      por(M.pasta, M.oDoInstante);
      por(G.pasta, G.antes);
      expect(rodar(`motor ${curto(M.oDoInstante)} · Generate ${curto(G.antes)} (borda)`).rodou).toBe(false);
    },
    10 * MINUTOS,
  );

  test(
    "com toda função de topo dos dois vizinhos envenenada na cópia a prova sai igual — e o veneno está vivo",
    () => {
      por(M.pasta, M.oDoInstante);
      por(G.pasta, G.oDoInstante);
      let quantas = 0;
      const andar = (d: string) => {
        for (const n of readdirSync(d)) {
          const p = join(d, n);
          if (statSync(p).isDirectory()) {
            if (n !== "__tests__" && n !== "node_modules") andar(p);
          } else if (n.endsWith(".ts") && !n.endsWith(".d.ts") && !n.endsWith(".test.ts")) {
            const r = envenenarAsFuncoes(readFileSync(p, "utf8"), `${n}:`);
            if (r.quantas) writeFileSync(p, r.texto);
            quantas += r.quantas;
          }
        }
      };
      for (const nome of [M.pasta, G.pasta]) andar(join(arv(nome), "src", "lib"));
      console.log(`    [retrato-do-lab30] ${quantas} funções envenenadas nos dois vizinhos`);
      expect(quantas, "o veneno quase não entrou: a forma das funções dos vizinhos mudou").toBeGreaterThan(1000);
      expect(rodar("motor e Generate do instante, envenenados")).toEqual({ rodou: true, igual: true });

      // O veneno está vivo: a mesma árvore, chamando uma função de cada vizinho, explode.
      const sonda = join(lab(), "external-engines", "esteira", "sonda-do-veneno.ts");
      for (const v of O_VENENO_VIVO) {
        writeFileSync(sonda, `import { ${v.funcao} } from "${v.alias}";\n(${v.funcao} as (...a: unknown[]) => unknown)();\n`);
        const r = spawnSync("bun", [sonda], { cwd: join(lab(), "external-engines", "esteira"), encoding: "utf8" });
        expect(r.status, `${v.funcao} não explodiu: o veneno não está vivo em ${v.pasta}`).not.toBe(0);
        // A mensagem do erro, não o trecho de código que o `bun` imprime acima dela.
        expect(r.stderr + r.stdout, `${v.funcao} explodiu, mas não pelo veneno`).toMatch(new RegExp(`^error: VENENO \\S+:${v.funcao}$`, "m"));
      }
      rmSync(sonda, { force: true });
      por(M.pasta, M.oDoInstante);
      por(G.pasta, G.oDoInstante);
    },
    10 * MINUTOS,
  );

  test(
    "com o destino de gleba.furos trocado na cópia do Lab, a comparação acusa — os dentes",
    () => {
      por(M.pasta, M.oDoInstante);
      por(G.pasta, G.oDoInstante);
      const arq = join(lab(), A_TROCA_DOS_DENTES.arquivo);
      const t = readFileSync(arq, "utf8");
      expect(t.split(A_TROCA_DOS_DENTES.de).length - 1, "a troca dos dentes não casa uma vez").toBe(1);
      writeFileSync(arq, t.replace(A_TROCA_DOS_DENTES.de, A_TROCA_DOS_DENTES.para));
      const r = rodar("os dois no instante, com o destino de gleba.furos trocado no Lab");
      writeFileSync(arq, t);
      expect(r).toEqual({ rodou: true, igual: false });
    },
    10 * MINUTOS,
  );
});
