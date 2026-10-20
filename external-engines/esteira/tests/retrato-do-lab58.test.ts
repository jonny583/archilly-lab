/**
 * **LAB-213 (item 900) · os mecanismos das 81 do LAB-58 se refazem byte a byte (fora o `quando`) com o motor de 14/09
 * (`fe0c7a1` a `244aae3`) e o Generate de `5b70e5f` a `49d8e3e` — a janela do LAB-53, herdada — e, fora dela, a
 * ferramenta de então PARA sem escrever** (D441).
 *
 * ```sh
 * bun test tests/retrato-do-lab58.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `d8d8a72`, o motor e o Generate na história
 * deles) e roda **a ferramenta do Lab de então** (com `INVARIANTES_EXEMPLOS=100000`, como o `bun run lab58`): nos
 * quatro cantos das duas janelas e no par de clones que o LAB-58 nomeia tem de refazer a prova byte a byte, fora o
 * `quando` da raiz; no instante (as pontas da origem às 11h01 UTC de 07/10), e em cada vizinho dele sozinho, tem de
 * PARAR com a lista diferente da do LAB-53 — o achado; nas quatro bordas tem de parar, cada uma com a SUA mensagem, e
 * no T01 (o esquema) e numa falta de módulo de cada vizinho também — os dentes, que são commits de verdade. Em toda
 * rodada: *"igual"* exige que a ferramenta tenha ESCRITO a prova (o `quando` novo), *"para"* exige que ela NÃO a tenha
 * escrito, e a árvore do Lab não pode ter outro arquivo mudado (D438). O motivo inteiro está no cabeçalho de
 * `src/retrato-do-lab58.ts`. A prova não se toca (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**, e por
 * isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). Os
 * vizinhos só são lidos. Cada rodada leva de 12 a 35 segundos; são quinze.
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
  AS_PARADAS,
  A_PROVA,
  FORA_DA_COMPARACAO,
  O_AMBIENTE,
  OS_COMMITS_RODADOS,
  O_RETRATO_DO_LAB58,
  semOQuandoDaRaiz,
} from "../src/retrato-do-lab58.ts";

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
const LAB = O_RETRATO_DO_LAB58[0]!;
const M = A_JANELA_DO_MOTOR;
const G = A_JANELA_DO_GENERATE;
const DO_MOTOR = [M.primeiro, M.ultimo, M.oDoLab58, M.antes, M.depois, M.recusa, M.naoRoda, M.oDoInstante];
const DO_GENERATE = [G.primeiro, G.ultimo, G.oDoLab58, G.antes, G.depois, G.naoRoda, G.oDoInstante];
const TODOS = [...DO_MOTOR, ...DO_GENERATE];

describe("LAB-213 · o retrato escrito", () => {
  test("o Lab tem um commit; as duas janelas são fechadas, com as bordas, e os dois instantes FORA", () => {
    expect(O_RETRATO_DO_LAB58.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    for (const c of TODOS) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(new Set(DO_MOTOR).size).toBe(DO_MOTOR.length);
    expect(new Set(DO_GENERATE).size).toBe(DO_GENERATE.length);
    expect(M.oInstanteEstaDentro).toBe(false);
    expect(G.oInstanteEstaDentro).toBe(false);
    for (const e of [OS_COMMITS_RODADOS.motor, OS_COMMITS_RODADOS.generate]) {
      expect(e.naoRodam + e.paramAntes + e.refazem + e.paramDepois).toBe(e.commits);
      expect(e.refazem).toBeGreaterThan(0);
    }
    expect(OS_COMMITS_RODADOS.motor.rodadosPelaFerramenta).toBe(OS_COMMITS_RODADOS.motor.commits);
    const g = OS_COMMITS_RODADOS.generate;
    expect(g.commits - g.naoRodamPelaArvore).toBe(g.rodadosPelaFerramenta);
    expect(new Set(Object.values(AS_PARADAS)).size).toBe(3);
  });

  test("a ordem na história: não roda → recusa → borda de antes → janela → borda de depois → instante, nos dois vizinhos", () => {
    const anc = (nome: string, a: string, b: string) =>
      spawnSync("git", ["-C", ORIGEM[nome]!, "merge-base", "--is-ancestor", a, b]).status === 0;
    for (const [a, b] of [
      [M.naoRoda, M.recusa],
      [M.recusa, M.antes],
      [M.antes, M.primeiro],
      [M.primeiro, M.oDoLab58],
      [M.oDoLab58, M.ultimo],
      [M.ultimo, M.depois],
      [M.depois, M.oDoInstante],
    ] as const)
      expect(anc("motor-testfit", a, b), `motor: ${curto(a)} antes de ${curto(b)}`).toBe(true);
    for (const [a, b] of [
      [G.naoRoda, G.antes],
      [G.antes, G.primeiro],
      [G.primeiro, G.oDoLab58],
      [G.oDoLab58, G.ultimo],
      [G.ultimo, G.depois],
      [G.depois, G.oDoInstante],
    ] as const)
      expect(anc("urban-create-hub-41d93a4d", a, b), `Generate: ${curto(a)} antes de ${curto(b)}`).toBe(true);
  });

  test("a comparação deixa de fora só o `quando` da RAIZ — dos dois lados", () => {
    expect(FORA_DA_COMPARACAO).toEqual(["quando"]);
    const prova = readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8");
    const raiz = JSON.parse(prova) as Record<string, unknown>;
    expect(typeof raiz["quando"]).toBe("string");
    const outroCarimbo = prova.replace(String(raiz["quando"]), "2000-01-01T00:00:00.000Z");
    expect(outroCarimbo).not.toBe(prova);
    expect(semOQuandoDaRaiz(outroCarimbo)).toBe(semOQuandoDaRaiz(prova));
    expect(prova.length - semOQuandoDaRaiz(prova).length).toBe(`  "quando": "${String(raiz["quando"])}",\n`.length);
    const outroNumero = prova.replace('"semente": 20260913,', '"semente": 20260914,');
    expect(outroNumero).not.toBe(prova);
    expect(semOQuandoDaRaiz(outroNumero)).not.toBe(semOQuandoDaRaiz(prova));
    const fundo = '{\n  "a": {\n    "quando": "x",\n    "b": 1\n  }\n}';
    expect(semOQuandoDaRaiz(fundo)).toBe(fundo);
  });

  test("o commit do Lab é o único da prova; a ferramenta de então é a dele, e a prova cala os dois vizinhos", () => {
    const daHistoria = (caminho: string) =>
      execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", caminho], { encoding: "utf8" }).trim().split("\n");
    expect(daHistoria(join("docs", "provas", A_PROVA))).toEqual([LAB.commit]);
    // A ferramenta nasceu no commit da prova; o que mudou depois (o import da porta, LAB-135) não entra: roda-se a de então.
    expect(daHistoria(A_FERRAMENTA).at(-1)).toBe(LAB.commit);
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

describe("LAB-213 · as janelas, perguntadas à ferramenta", () => {
  let pasta = "";
  const arv = (nome: string) => join(pasta, nome);
  const lab = () => arv("archilly-lab");

  function por(nome: string, commit: string) {
    execFileSync("git", ["-C", arv(nome), "checkout", "-q", "-f", commit]);
    execFileSync("git", ["-C", arv(nome), "clean", "-q", "-fd", "-e", "node_modules"]);
  }

  /**
   * Roda a ferramenta de então com os vizinhos nos commits dados. `igual` só vale se ela escreveu a prova (o `quando`
   * novo) e o texto, fora o `quando`, é o mesmo; `parou` só vale se ela saiu com erro e NÃO escreveu. `saida` é o que
   * ela disse (para a mensagem de parada).
   */
  function rodarCom(m: string, g: string): { igual: boolean; parou: boolean; saida: string } {
    por("motor-testfit", m);
    por("urban-create-hub-41d93a4d", g);
    const caminho = join(lab(), "docs", "provas", A_PROVA);
    execFileSync("git", ["-C", lab(), "checkout", "-q", "--", join("docs", "provas")]);
    const antes = readFileSync(caminho, "utf8");
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "esteira"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, ...O_AMBIENTE },
    });
    const depois = readFileSync(caminho, "utf8");
    const escreveu = depois !== antes;
    const rodou = r.status === 0;
    expect(rodou, `com o motor em ${curto(m)} e o Generate em ${curto(g)}: saiu bem ${rodou}, escreveu ${escreveu}`).toBe(escreveu);
    if (rodou)
      expect((JSON.parse(depois) as { quando?: string }).quando, "rodou e não escreveu a prova").not.toBe(
        (JSON.parse(antes) as { quando?: string }).quando,
      );
    const igual = rodou && semOQuandoDaRaiz(depois) === semOQuandoDaRaiz(antes);
    const parou = !rodou && !escreveu;
    // Na árvore do Lab, o único arquivo que pode mudar é a prova (D438: vigia-se todo arquivo).
    const mudados = execFileSync("git", ["-C", lab(), "status", "--porcelain", "--untracked-files=all"], { encoding: "utf8" })
      .split("\n")
      .filter((l) => l.trim() !== "" && !l.includes("node_modules"))
      .map((l) => l.slice(3));
    expect(mudados.filter((f) => f !== join("docs", "provas", A_PROVA)), "a ferramenta escreveu fora da prova").toEqual([]);
    console.log(
      `    [retrato-do-lab58] Lab ${curto(LAB.commit)} · motor ${curto(m)} · Generate ${curto(g)} · ${igual ? "a prova igual, byte a byte (fora o quando)" : parou ? "a ferramenta parou sem escrever" : "a prova difere"}`,
    );
    return { igual, parou, saida: `${r.stdout ?? ""}\n${r.stderr ?? ""}` };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab58-retrato-"));
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
    montar("motor-testfit", M.oDoInstante, DO_MOTOR);
    montar("urban-create-hub-41d93a4d", G.oDoInstante, DO_GENERATE);
    symlinkSync(join(ESTEIRA, "node_modules"), join(lab(), "external-engines", "esteira", "node_modules"));
    if (existsSync(join(TESTFIT, "node_modules")) && existsSync(join(lab(), "external-engines", "testfit")))
      symlinkSync(join(TESTFIT, "node_modules"), join(lab(), "external-engines", "testfit", "node_modules"));
    cpSync(join(ESTEIRA, "node_modules", "zod"), join(arv("urban-create-hub-41d93a4d"), "node_modules", "zod"), { recursive: true });
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "nos quatro cantos das duas janelas e no par de clones do LAB-58 a ferramenta de então refaz a prova byte a byte, fora o `quando`",
    () => {
      const pares: Array<[string, string]> = [
        [M.primeiro, G.primeiro],
        [M.primeiro, G.ultimo],
        [M.ultimo, G.primeiro],
        [M.ultimo, G.ultimo],
        [M.oDoLab58, G.oDoLab58],
      ];
      for (const [m, g] of pares)
        expect(
          rodarCom(m, g).igual,
          `com o motor em ${curto(m)} e o Generate em ${curto(g)} a ferramenta não refaz mais a prova: a janela está errada (D182: explica-se, não se regrava)`,
        ).toBe(true);
    },
    20 * MINUTOS,
  );

  test(
    "no instante a ferramenta de então PARA com a lista diferente da do LAB-53 — e cada vizinho do instante, sozinho, também",
    () => {
      for (const [m, g, msg] of [
        [M.oDoInstante, G.oDoInstante, null],
        [M.oDoInstante, G.oDoLab58, M.aParadaDeDepois],
        [M.oDoLab58, G.oDoInstante, G.aParadaDeDepois],
      ] as const) {
        const r = rodarCom(m, g);
        expect(r.parou, `motor ${curto(m)} · Generate ${curto(g)}: ${M.porQueODoInstante}`).toBe(true);
        expect(r.saida).toContain(AS_PARADAS.lista);
        if (msg) expect(r.saida).toContain(msg);
      }
    },
    20 * MINUTOS,
  );

  test(
    "nas quatro bordas a ferramenta de então para, cada uma com a SUA mensagem; e no T01 e numa falta de módulo de cada vizinho também — os dentes",
    () => {
      const casos: Array<[string, string, string, string]> = [
        [M.antes, G.oDoLab58, AS_PARADAS.lista, M.aParadaDeAntes],
        [M.depois, G.oDoLab58, AS_PARADAS.lista, M.aParadaDeDepois],
        [M.oDoLab58, G.antes, AS_PARADAS.esquema, AS_PARADAS.esquema],
        [M.oDoLab58, G.depois, AS_PARADAS.lista, G.aParadaDeDepois],
        [M.recusa, G.oDoLab58, AS_PARADAS.esquema, AS_PARADAS.esquema],
        [M.naoRoda, G.oDoLab58, AS_PARADAS.faltaModulo, AS_PARADAS.faltaModulo],
        [M.oDoLab58, G.naoRoda, AS_PARADAS.faltaModulo, AS_PARADAS.faltaModulo],
      ];
      for (const [m, g, tipo, exata] of casos) {
        const r = rodarCom(m, g);
        expect(r.parou, `motor ${curto(m)} · Generate ${curto(g)}: tinha de parar sem escrever`).toBe(true);
        expect(r.saida, `motor ${curto(m)} · Generate ${curto(g)}: a parada é outra`).toContain(tipo);
        expect(r.saida, `motor ${curto(m)} · Generate ${curto(g)}: a contagem da parada é outra`).toContain(exata);
      }
    },
    20 * MINUTOS,
  );
});
