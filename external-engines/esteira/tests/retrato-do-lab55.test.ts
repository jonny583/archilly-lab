/**
 * **LAB-212 (item 900) · a assimetria da faixa do LAB-55 se refaz byte a byte (fora o `quando`) com o motor de 14/09
 * (`fe0c7a1` a `244aae3`) e o Generate do contrato v2 em diante — e NÃO com o motor da origem na hora da prova**
 * (D440).
 *
 * ```sh
 * bun test tests/retrato-do-lab55.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `2d4052b`, o motor e o Generate na história
 * deles) e roda **a ferramenta do Lab de então** (com `INVARIANTES_EXEMPLOS=100000`, como o `bun run lab55`): nos
 * quatro cantos das duas janelas e no par de clones que o LAB-55 nomeia tem de refazer a prova byte a byte, fora o
 * `quando` da raiz; no instante (as pontas da origem às 05h23 UTC de 07/10) tem de ACUSAR, e o motor do instante
 * sozinho também, enquanto o Generate do instante sozinho refaz — o achado; nas duas bordas do motor tem de acusar, e
 * na de antes do Generate também, com o plano recusado pelo esquema — os dentes, que são commits de verdade dos
 * vizinhos. O motivo inteiro está no cabeçalho de `src/retrato-do-lab55.ts`. A prova não se toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e por
 * isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). Os
 * vizinhos só são lidos. Cada rodada leva perto de 6 segundos; são onze.
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
  A_MUDANCA_DA_FERRAMENTA,
  A_PROVA,
  FORA_DA_COMPARACAO,
  O_AMBIENTE,
  OS_COMMITS_RODADOS,
  O_RETRATO_DO_LAB55,
  semOQuandoDaRaiz,
} from "../src/retrato-do-lab55.ts";

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
const LAB = O_RETRATO_DO_LAB55[0]!;
const M = A_JANELA_DO_MOTOR;
const G = A_JANELA_DO_GENERATE;
const TODOS = [M.primeiro, M.ultimo, M.oDoLab55, M.antes, M.depois, M.oDoInstante, G.primeiro, G.ultimoMedido, G.oDoLab55, G.antes, G.oDoInstante];

describe("LAB-212 · o retrato escrito", () => {
  test("o Lab tem um commit; o motor tem as duas bordas e o instante FORA; o Generate, a de antes e o instante dentro", () => {
    expect(O_RETRATO_DO_LAB55.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    for (const c of TODOS) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(new Set([M.primeiro, M.ultimo, M.antes, M.depois, M.oDoInstante]).size).toBe(5);
    expect(new Set([G.primeiro, G.ultimoMedido, G.antes, G.oDoInstante]).size).toBe(4);
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

  test("a ordem na história: borda de antes → janela → borda de depois → instante, nos dois vizinhos", () => {
    const anc = (nome: string, a: string, b: string) =>
      spawnSync("git", ["-C", ORIGEM[nome]!, "merge-base", "--is-ancestor", a, b]).status === 0;
    for (const [a, b] of [
      [M.antes, M.primeiro],
      [M.primeiro, M.oDoLab55],
      [M.oDoLab55, M.ultimo],
      [M.ultimo, M.depois],
      [M.depois, M.oDoInstante],
    ] as const)
      expect(anc("motor-testfit", a, b), `motor: ${curto(a)} antes de ${curto(b)}`).toBe(true);
    for (const [a, b] of [
      [G.antes, G.primeiro],
      [G.primeiro, G.oDoLab55],
      [G.oDoLab55, G.oDoInstante],
      [G.oDoInstante, G.ultimoMedido],
    ] as const)
      expect(anc("urban-create-hub-41d93a4d", a, b), `Generate: ${curto(a)} antes de ${curto(b)}`).toBe(true);
  });

  test("a comparação deixa de fora só o `quando` da RAIZ — dos dois lados", () => {
    expect(FORA_DA_COMPARACAO).toEqual(["quando"]);
    const prova = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    const raiz = JSON.parse(prova) as Record<string, unknown>;
    expect(typeof raiz["quando"]).toBe("string");
    // Só o carimbo da raiz trocado: igual.
    const outroCarimbo = prova.replace(String(raiz["quando"]), "2000-01-01T00:00:00.000Z");
    expect(outroCarimbo).not.toBe(prova);
    expect(semOQuandoDaRaiz(outroCarimbo)).toBe(semOQuandoDaRaiz(prova));
    // E o que sai é exatamente a linha do carimbo, nada mais.
    expect(prova.length - semOQuandoDaRaiz(prova).length).toBe(`  "quando": "${String(raiz["quando"])}",\n`.length);
    // Um número trocado: diferente.
    const outroNumero = prova.replace('      "viaSobreLote": 15,', '      "viaSobreLote": 16,');
    expect(outroNumero).not.toBe(prova);
    expect(semOQuandoDaRaiz(outroNumero)).not.toBe(semOQuandoDaRaiz(prova));
    // Um `quando` mais fundo (quatro espaços de recuo) conta.
    const fundo = '{\n  "a": {\n    "quando": "x",\n    "b": 1\n  }\n}';
    expect(semOQuandoDaRaiz(fundo)).toBe(fundo);
  });

  test("o commit do Lab é o único da prova; a ferramenta mudou depois uma linha de `import`, e a prova cala os dois vizinhos", () => {
    const daHistoria = (caminho: string) =>
      execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", caminho], { encoding: "utf8" }).trim().split("\n");
    expect(daHistoria(join("docs", "provas", A_PROVA))).toEqual([LAB.commit]);
    expect(daHistoria(A_FERRAMENTA), "a ferramenta mudou de novo depois do LAB-135: releia a de então contra a de hoje").toEqual([
      A_MUDANCA_DA_FERRAMENTA.commit,
      LAB.commit,
    ]);
    // A mudança do LAB-135 é UMA linha tirada e UMA posta — a do `import` —, e nada mais.
    const diff = execFileSync("git", ["-C", RAIZ, "diff", "--unified=0", LAB.commit, A_MUDANCA_DA_FERRAMENTA.commit, "--", A_FERRAMENTA], {
      encoding: "utf8",
    })
      .split("\n")
      .filter((l) => /^[-+]/.test(l) && !/^(---|\+\+\+) /.test(l));
    expect(diff).toEqual([`-${A_MUDANCA_DA_FERRAMENTA.antes}`, `+${A_MUDANCA_DA_FERRAMENTA.depois}`]);
    const texto = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    for (const c of TODOS) expect(texto).not.toContain(curto(c));
  });

  test("os dois instantes são mesmo as pontas da origem na hora da prova", () => {
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

describe("LAB-212 · as janelas, perguntadas à ferramenta", () => {
  let pasta = "";
  const arv = (nome: string) => join(pasta, nome);
  const lab = () => arv("archilly-lab");

  function por(nome: string, commit: string) {
    execFileSync("git", ["-C", arv(nome), "checkout", "-q", "-f", commit]);
    execFileSync("git", ["-C", arv(nome), "clean", "-q", "-fd", "-e", "node_modules"]);
  }

  /** Roda a ferramenta de então com os vizinhos nos commits dados e diz se ela rodou, se a prova saiu igual (fora o `quando`), e o texto novo. */
  function rodarCom(m: string, g: string): { rodou: boolean; igual: boolean; novo: string } {
    por("motor-testfit", m);
    por("urban-create-hub-41d93a4d", g);
    const caminho = join(lab(), "docs", "provas", A_PROVA);
    execFileSync("git", ["-C", lab(), "checkout", "-q", "--", join("docs", "provas", A_PROVA)]);
    const antes = readFileSync(caminho, "utf8");
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, ...O_AMBIENTE },
    });
    const rodou = r.status === 0;
    const novo = rodou ? readFileSync(caminho, "utf8") : `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
    // A ferramenta tem UM destino, escrito sempre com o `quando` da hora: `quando` velho é prova que ela não escreveu (D438).
    const escreveu = rodou && (JSON.parse(novo) as { quando?: string }).quando !== (JSON.parse(antes) as { quando?: string }).quando;
    if (rodou) expect(escreveu, `com o motor em ${curto(m)} e o Generate em ${curto(g)} a ferramenta rodou e NÃO escreveu a prova`).toBe(true);
    const igual = escreveu && semOQuandoDaRaiz(novo) === semOQuandoDaRaiz(antes);
    // E ela não escreve noutro lugar: na árvore do Lab, o único arquivo mudado é a prova (D438: vigia-se todo arquivo).
    const mudados = execFileSync("git", ["-C", lab(), "status", "--porcelain", "--untracked-files=all"], { encoding: "utf8" })
      .split("\n")
      .filter((l) => l.trim() !== "" && !l.includes("node_modules"))
      .map((l) => l.slice(3));
    expect(mudados.filter((f) => f !== join("docs", "provas", A_PROVA)), "a ferramenta escreveu fora da prova").toEqual([]);
    console.log(
      `    [retrato-do-lab55] Lab ${curto(LAB.commit)} · motor ${curto(m)} · Generate ${curto(g)} · ${rodou ? (igual ? "a prova igual, byte a byte (fora o quando)" : "a prova difere") : "a ferramenta não rodou"}`,
    );
    return { rodou, igual, novo };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab55-retrato-"));
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
    montar("motor-testfit", M.oDoInstante, [M.primeiro, M.ultimo, M.oDoLab55, M.antes, M.depois]);
    montar("urban-create-hub-41d93a4d", G.oDoInstante, [G.primeiro, G.ultimoMedido, G.oDoLab55, G.antes]);
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
    "nos quatro cantos das duas janelas e no par de clones do LAB-55 a ferramenta de então refaz a prova byte a byte, fora o `quando`",
    () => {
      const pares: Array<[string, string]> = [
        [M.primeiro, G.primeiro],
        [M.primeiro, G.ultimoMedido],
        [M.ultimo, G.primeiro],
        [M.ultimo, G.ultimoMedido],
        [M.oDoLab55, G.oDoLab55],
      ];
      for (const [m, g] of pares) {
        const r = rodarCom(m, g);
        expect(
          { rodou: r.rodou, igual: r.igual },
          `com o motor em ${curto(m)} e o Generate em ${curto(g)} a ferramenta não refaz mais a prova: a janela está errada (D182: explica-se, não se regrava)`,
        ).toEqual({ rodou: true, igual: true });
      }
    },
    20 * MINUTOS,
  );

  test(
    "no instante a ferramenta de então ACUSA, e o motor do instante sozinho também — o Generate do instante sozinho refaz",
    () => {
      for (const [m, g] of [
        [M.oDoInstante, G.oDoInstante],
        [M.oDoInstante, G.oDoLab55],
      ] as const) {
        const r = rodarCom(m, g);
        expect({ rodou: r.rodou, igual: r.igual }, M.porQueODoInstante).toEqual({ rodou: true, igual: false });
      }
      const g = rodarCom(M.oDoLab55, G.oDoInstante);
      expect({ rodou: g.rodou, igual: g.igual }, "o Generate do instante está DENTRO da janela dele").toEqual({ rodou: true, igual: true });
    },
    20 * MINUTOS,
  );

  test(
    "nas duas bordas do motor a ferramenta de então acusa, e na de antes do Generate também, com o plano recusado pelo esquema — os dentes",
    () => {
      for (const [m, porque] of [
        [M.antes, M.oQueDaAntes],
        [M.depois, M.oQueDaDepois],
      ] as const) {
        const r = rodarCom(m, G.oDoLab55);
        expect({ rodou: r.rodou, igual: r.igual }, `o motor em ${curto(m)}: ${porque}`).toEqual({ rodou: true, igual: false });
      }
      const g = rodarCom(M.oDoLab55, G.antes);
      expect({ rodou: g.rodou, igual: g.igual }, `o Generate em ${curto(G.antes)}: ${G.oQueDaAntes}`).toEqual({ rodou: true, igual: false });
      expect(g.novo, `o Generate em ${curto(G.antes)}: a diferença tem de ser a recusa pelo esquema, não outra`).toContain(G.aMarcaDaRecusa);
    },
    20 * MINUTOS,
  );
});
