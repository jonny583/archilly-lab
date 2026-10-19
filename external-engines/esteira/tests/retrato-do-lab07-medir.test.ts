/**
 * **LAB-202 (item 900) · as cinco provas do `medir.ts` do LAB-07 se refazem com o motor de 10/09 a 14/09 e o
 * Generate de 10/09 a 02/10, e não fora disso** (D430).
 *
 * ```sh
 * bun test tests/retrato-do-lab07-medir.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as três árvores (o Lab em `25b62e0`, o motor e o Generate na
 * história deles) e roda **a ferramenta do Lab de então**: no instante e nos quatro cantos das duas janelas tem
 * de refazer as cinco provas (as `.json` fora a hora, o `bun` e os tempos; a `.txt` fora o *"· tempos: …"*); nas
 * quatro bordas tem de NÃO refazer; e com a troca dos dentes na cópia do Generate tem de acusar. O motivo
 * inteiro está no cabeçalho de `src/retrato-do-lab07-medir.ts`. As provas não se tocam (D182).
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**,
 * e por isso NÃO está no portão sem clones do `verde.yml`: roda no verde completo
 * (`./external-engines/conferir.sh`). Os vizinhos só são lidos. Cada rodada leva perto de treze segundos.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  AS_PROVAS_JSON,
  A_FERRAMENTA,
  A_JANELA_DO_GENERATE,
  A_JANELA_DO_MOTOR,
  A_PROVA_TXT,
  A_TROCA_DOS_DENTES,
  FORA_DA_RAIZ,
  OS_ESTADOS_DO_GENERATE,
  O_RETRATO_DO_LAB07_MEDIR,
  diferencasForaDoTempo,
  eTempo,
  textoForaDoTempo,
  type Diferenca,
} from "../src/retrato-do-lab07-medir.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  "motor-testfit": join(RAIZ, "..", "motor-testfit"),
  "urban-create-hub-41d93a4d": join(RAIZ, "..", "urban-create-hub-41d93a4d"),
};
const lerProva = (p: string) => readFileSync(join(RAIZ, "docs", "provas", p), "utf8");
const provas = Object.fromEntries(AS_PROVAS_JSON.map((p) => [p, JSON.parse(lerProva(p)) as unknown]));
const provaTxt = lerProva(A_PROVA_TXT);
const MEDICOES = "LAB-07/medicoes.json";
const MINUTOS = 60_000;
const curto = (c: string) => c.slice(0, 7);
const [LAB] = O_RETRATO_DO_LAB07_MEDIR as [(typeof O_RETRATO_DO_LAB07_MEDIR)[0]];
const M = A_JANELA_DO_MOTOR;
const G = A_JANELA_DO_GENERATE;

describe("LAB-202 · o retrato escrito", () => {
  test("o Lab tem um commit, com as quarenta casas e a origem dita; as duas janelas têm as quatro bordas", () => {
    expect(O_RETRATO_DO_LAB07_MEDIR.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    expect(LAB.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(LAB.deOndeSeSabe.length).toBeGreaterThan(20);
    for (const j of [M, G]) {
      for (const c of [j.primeiro, j.ultimo, j.antes, j.depois, j.oDoInstante]) expect(c, j.pasta).toMatch(/^[0-9a-f]{40}$/);
      expect(new Set([j.primeiro, j.ultimo, j.antes, j.depois]).size, j.pasta).toBe(4);
      expect(j.oQueDaAntes.length + j.oQueDaDepois.length, j.pasta).toBeGreaterThan(40);
    }
    expect(OS_ESTADOS_DO_GENERATE).toHaveLength(10);
    expect(new Set(OS_ESTADOS_DO_GENERATE).size).toBe(10);
    for (const c of OS_ESTADOS_DO_GENERATE) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(OS_ESTADOS_DO_GENERATE[0]).toBe(G.ultimo);
    expect(OS_ESTADOS_DO_GENERATE.at(-1)).toBe(G.primeiro);
    expect(OS_ESTADOS_DO_GENERATE).not.toContain(G.antes);
    expect(OS_ESTADOS_DO_GENERATE).not.toContain(G.depois);
  });

  test("o commit do Lab é o único das cinco provas, e elas calam o motor e o Generate", () => {
    for (const p of [...AS_PROVAS_JSON, A_PROVA_TXT]) {
      const daHistoria = execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", join("docs", "provas", p)], { encoding: "utf8" })
        .trim()
        .split("\n");
      expect(daHistoria, p).toEqual([LAB.commit]);
    }
    const texto = JSON.stringify(provas) + provaTxt;
    for (const c of [M.primeiro, M.ultimo, M.oDoInstante, M.depois, G.ultimo, G.depois, ...OS_ESTADOS_DO_GENERATE])
      expect(texto).not.toContain(curto(c));
  });

  test("a comparação acusa o que muda e ignora só a hora, o chão e os tempos da rodada", () => {
    expect(FORA_DA_RAIZ).toEqual(["geradoEm", "ambiente"]);
    expect(["tempos", "ms", "motor_ms"].map(eTempo)).toEqual([true, true, true]);
    expect(["mesmo", "lotes", "msg"].map(eTempo)).toEqual([false, false, false]);
    const m = provas[MEDICOES] as Record<string, unknown> & {
      glebas: Record<string, { tempos: Record<string, number>; variantes: Array<Record<string, unknown>> }>;
    };
    expect(diferencasForaDoTempo(m, m)).toEqual([]);
    const outra = structuredClone(m);
    outra["geradoEm"] = "2000-01-01T00:00:00.000Z";
    (outra["ambiente"] as Record<string, unknown>)["bun"] = "0.0.0";
    const g = outra.glebas["ensaio-47ha"]!;
    g.tempos["motor_ms"] = 1;
    g.variantes[0]!["ms"] = 1;
    expect(diferencasForaDoTempo(m, outra)).toEqual([]);
    g.variantes[0]!["posicaoNoMotor"] = 99;
    expect(diferencasForaDoTempo(m, outra).map((d) => d.onde)).toEqual([".glebas.ensaio-47ha.variantes.0.posicaoNoMotor"]);
    // Só na raiz: um `geradoEm` mais fundo conta (as `.saida.json` têm carimbo fixo, e ele se compara).
    const s = provas["LAB-07/ensaio-47ha.saida.json"] as Record<string, unknown>;
    expect(diferencasForaDoTempo({ x: s }, { x: { ...s, geradoEm: "outro" } }).map((d) => d.onde)).toEqual([".x.geradoEm"]);
    // E na `.txt`, só o "· tempos: …" das linhas de perdas.
    expect(textoForaDoTempo(provaTxt)).not.toContain("tempos:");
    expect(textoForaDoTempo(provaTxt.replace("motor 427 ms", "motor 1 ms"))).toBe(textoForaDoTempo(provaTxt));
    expect(textoForaDoTempo(provaTxt.replace("perdas na ida: 3", "perdas na ida: 4"))).not.toBe(textoForaDoTempo(provaTxt));
  });
});

describe("LAB-202 · as duas janelas, perguntadas à ferramenta", () => {
  let pasta = "";
  const lab = () => join(pasta, "archilly-lab");
  const gen = () => join(pasta, "urban-create-hub-41d93a4d");
  const motor = () => join(pasta, "motor-testfit");

  /**
   * Põe o motor e o Generate nos commits, roda a ferramenta de então e devolve as diferenças nas cinco provas —
   * ou `null` se ela não rodar.
   */
  function rodarCom(commitDoMotor: string, commitDoGenerate: string, comOsDentes = false) {
    execFileSync("git", ["-C", motor(), "checkout", "-q", "-f", commitDoMotor]);
    execFileSync("git", ["-C", gen(), "checkout", "-q", "-f", commitDoGenerate]);
    if (comOsDentes) {
      const arq = join(gen(), A_TROCA_DOS_DENTES.arquivo);
      const t = readFileSync(arq, "utf8");
      expect(t.split(A_TROCA_DOS_DENTES.de).length - 1, "a troca dos dentes não casa uma vez").toBe(1);
      writeFileSync(arq, t.replace(A_TROCA_DOS_DENTES.de, A_TROCA_DOS_DENTES.para));
    }
    for (const p of AS_PROVAS_JSON) rmSync(join(lab(), "docs", "provas", p), { force: true });
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "testfit"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const rodou = r.status === 0 && AS_PROVAS_JSON.every((p) => existsSync(join(lab(), "docs", "provas", p)));
    let json: Diferenca[] | null = null;
    if (rodou) {
      json = [];
      for (const p of AS_PROVAS_JSON) {
        const d = diferencasForaDoTempo(provas[p], JSON.parse(readFileSync(join(lab(), "docs", "provas", p), "utf8")));
        json.push(...d.map((x) => ({ ...x, onde: `${p}${x.onde}` })));
      }
    }
    const txtIgual = rodou && textoForaDoTempo(r.stdout) === textoForaDoTempo(provaTxt);
    console.log(
      `    [retrato-do-lab07-medir] Lab ${curto(LAB.commit)} · motor ${curto(commitDoMotor)} · Generate ${curto(commitDoGenerate)}${comOsDentes ? " (apoio da via 0,75 → 0,5 m na cópia)" : ""} · ${json ? `${json.length} diferenças · a .txt ${txtIgual ? "igual" : "difere"}` : "a ferramenta não rodou"}`,
    );
    return json === null ? null : { json, txtIgual };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab07-medir-retrato-"));
    const montar = (nome: string, commit: string) => {
      const origem = ORIGEM[nome]!;
      if (!existsSync(origem)) throw new Error(`o clone ${nome} não está em ${origem} — clone-o só para leitura, com a história inteira`);
      const destino = join(pasta, nome);
      execFileSync("git", ["clone", "-q", "--no-checkout", origem, destino]);
      if (spawnSync("git", ["-C", destino, "cat-file", "-e", `${commit}^{commit}`]).status !== 0)
        throw new Error(`o commit ${commit} não está na história de ${origem} — desrase-o: git -C ${origem} fetch --unshallow origin`);
      execFileSync("git", ["-C", destino, "checkout", "-q", commit]);
    };
    montar("archilly-lab", LAB.commit);
    montar("motor-testfit", M.oDoInstante);
    montar("urban-create-hub-41d93a4d", G.oDoInstante);
    for (const [d, cs] of [
      [motor(), [M.primeiro, M.ultimo, M.antes, M.depois]],
      [gen(), [G.primeiro, G.ultimo, G.antes, G.depois]],
    ] as const)
      for (const c of cs)
        if (spawnSync("git", ["-C", d, "cat-file", "-e", `${c}^{commit}`]).status !== 0)
          throw new Error(`o commit ${c} não está na história de ${d} — desrase o clone vizinho`);
    // O zod que o Generate importa, na node_modules dele (o git de lá a ignora).
    cpSync(join(ESTEIRA, "node_modules", "zod"), join(gen(), "node_modules", "zod"), { recursive: true });
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "no instante e nos quatro cantos das duas janelas a ferramenta de então refaz as cinco provas",
    () => {
      const pares: Array<[string, string]> = [
        [M.oDoInstante, G.oDoInstante],
        [M.primeiro, G.primeiro],
        [M.primeiro, G.ultimo],
        [M.ultimo, G.primeiro],
        [M.ultimo, G.ultimo],
      ];
      for (const [m, g] of pares) {
        expect(
          rodarCom(m, g),
          `com o motor em ${curto(m)} e o Generate em ${curto(g)} a ferramenta não refaz mais as provas: a janela está errada (D182: explica-se, não se regrava)`,
        ).toEqual({ json: [], txtIgual: true });
      }
    },
    10 * MINUTOS,
  );

  test(
    "nas quatro bordas a ferramenta de então NÃO refaz as provas — as duas janelas são fechadas",
    () => {
      expect(rodarCom(M.antes, G.oDoInstante), `o motor em ${curto(M.antes)}: ${M.oQueDaAntes}`).toBeNull();
      const depoisDoMotor = rodarCom(M.depois, G.oDoInstante);
      expect(depoisDoMotor, `o motor em ${curto(M.depois)}: ${M.oQueDaDepois}`).not.toBeNull();
      expect(depoisDoMotor!.json.length, `com o motor em ${curto(M.depois)} a ferramenta refaz as provas: a janela do motor acaba depois do escrito`).toBeGreaterThan(0);
      expect(rodarCom(M.oDoInstante, G.antes), `o Generate em ${curto(G.antes)}: ${G.oQueDaAntes}`).toBeNull();
      expect(rodarCom(M.oDoInstante, G.depois), `o Generate em ${curto(G.depois)}: ${G.oQueDaDepois}`).toBeNull();
    },
    10 * MINUTOS,
  );

  test(
    "com o Generate no instante e a tolerância de apoio da via trocada na cópia, a comparação acusa — os dentes do Generate",
    () => {
      const d = rodarCom(M.oDoInstante, G.oDoInstante, true);
      expect(d, "a ferramenta não rodou com a troca dos dentes").not.toBeNull();
      expect(d!.json.length, "com o Validator trocado nada mudou: a comparação não enxerga o Generate").toBeGreaterThan(0);
      expect(d!.json.every((x) => x.onde.startsWith(`${MEDICOES}.`)), "a troca no Validator mudou valor fora da medicoes.json").toBe(true);
      expect(d!.txtIgual).toBe(false);
    },
    10 * MINUTOS,
  );
});
