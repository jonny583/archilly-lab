/**
 * **LAB-201 (item 900) · o diagnóstico de relevo do LAB-07 se refaz com qualquer Generate do P43 na tela em
 * diante, e não antes dele** (D429).
 *
 * ```sh
 * bun test tests/retrato-do-lab07-relevo.test.ts
 * ```
 *
 * Monta, numa pasta temporária e por caminho, as duas árvores (o Lab em `25b62e0`, o Generate na história
 * dele) e roda **a ferramenta do Lab de então** cinco vezes: no começo da janela, no instante das provas e no
 * último commit medido tem de refazer as duas provas (a `.json` valor a valor, fora os `ms`; a `.txt` linha a
 * linha, fora o *"— N ms"*); na borda de antes tem de NÃO refazer; e com o número de vizinhos do modelo do
 * Generate trocado na cópia tem de acusar — os dentes da comparação. O motivo inteiro está no cabeçalho de
 * `src/retrato-do-lab07-relevo.ts`. As provas não se tocam (D182).
 *
 * **Precisa do clone vizinho `../urban-create-hub-41d93a4d`, com a história inteira**, e por isso NÃO está no
 * portão sem clones do `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). O vizinho só é
 * lido. Cada rodada leva perto de cinco segundos.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  AS_PROVAS,
  A_FERRAMENTA,
  A_JANELA_DO_GENERATE,
  A_TROCA_DOS_DENTES,
  BLOCOS_COM_TEMPO,
  OS_ESTADOS_DO_FECHO,
  O_RETRATO_DO_LAB07_RELEVO,
  diferencasForaDoTempo,
  textoForaDoTempo,
} from "../src/retrato-do-lab07-relevo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ORIGEM: Record<string, string> = {
  "archilly-lab": RAIZ,
  "urban-create-hub-41d93a4d": join(RAIZ, "..", "urban-create-hub-41d93a4d"),
};
const [PROVA_JSON, PROVA_TXT] = AS_PROVAS;
const prova = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", PROVA_JSON), "utf8")) as Record<string, unknown>;
const provaTxt = readFileSync(join(RAIZ, "docs", "provas", PROVA_TXT), "utf8");
const MINUTOS = 60_000;
const curto = (c: string) => c.slice(0, 7);
const LAB = O_RETRATO_DO_LAB07_RELEVO[0]!;
const J = A_JANELA_DO_GENERATE;

describe("LAB-201 · o retrato escrito", () => {
  test("o Lab tem um commit, com as quarenta casas e a origem dita; a janela tem começo, borda de antes e nenhuma de depois", () => {
    expect(O_RETRATO_DO_LAB07_RELEVO.map((c) => c.pasta)).toEqual(["archilly-lab"]);
    expect(LAB.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(LAB.deOndeSeSabe.length).toBeGreaterThan(20);
    for (const c of [J.primeiro, J.ultimoMedido, J.antes, J.oDoInstante, ...OS_ESTADOS_DO_FECHO]) expect(c).toMatch(/^[0-9a-f]{40}$/);
    expect(J.depois).toBeNull();
    expect(OS_ESTADOS_DO_FECHO).toHaveLength(5);
    expect(new Set(OS_ESTADOS_DO_FECHO).size).toBe(5);
    expect(OS_ESTADOS_DO_FECHO.at(-1)).toBe(J.primeiro);
    expect(OS_ESTADOS_DO_FECHO).not.toContain(J.antes);
  });

  test("o commit do Lab é o único das duas provas e da ferramenta, e as provas calam o Generate", () => {
    for (const p of [join("docs", "provas", PROVA_JSON), join("docs", "provas", PROVA_TXT), A_FERRAMENTA]) {
      const daHistoria = execFileSync("git", ["-C", RAIZ, "log", "--format=%H", "--", p], { encoding: "utf8" }).trim().split("\n");
      expect(daHistoria, p).toEqual([LAB.commit]);
    }
    const texto = JSON.stringify(prova) + provaTxt;
    for (const c of [J.primeiro, J.oDoInstante, J.ultimoMedido, J.antes, ...OS_ESTADOS_DO_FECHO]) expect(texto).not.toContain(curto(c));
  });

  test("a comparação acusa o que muda e ignora só o tempo de cada interpolador", () => {
    expect(BLOCOS_COM_TEMPO).toEqual(["testfit", "generate", "lab01Corrigido"]);
    expect(diferencasForaDoTempo(prova, prova)).toEqual([]);
    const outra = structuredClone(prova) as Record<string, Record<string, unknown>>;
    for (const b of BLOCOS_COM_TEMPO) outra[b]!["ms"] = 1;
    expect(diferencasForaDoTempo(prova, outra)).toEqual([]);
    outra["generate"]!["sobreValorDeCurva"] = 1;
    expect(diferencasForaDoTempo(prova, outra).map((d) => d.onde)).toEqual([".generate.sobreValorDeCurva"]);
    // Só o `ms` dos três blocos: um `ms` noutro lugar conta.
    outra["nuvem"]!["ms"] = 1;
    expect(diferencasForaDoTempo(prova, outra).map((d) => d.onde)).toEqual([".generate.sobreValorDeCurva", ".nuvem.ms"]);
    // E na `.txt`, só o "— N ms" do fim da linha.
    expect(textoForaDoTempo(provaTxt)).not.toMatch(/ ms$/m);
    expect(textoForaDoTempo(provaTxt.replace("443 ms", "1 ms"))).toBe(textoForaDoTempo(provaTxt));
    expect(textoForaDoTempo(provaTxt.replace("49.8 %", "49.9 %"))).not.toBe(textoForaDoTempo(provaTxt));
  });
});

describe("LAB-201 · a janela do Generate, perguntada à ferramenta", () => {
  let pasta = "";
  const lab = () => join(pasta, "archilly-lab");
  const gen = () => join(pasta, "urban-create-hub-41d93a4d");

  /** Põe o Generate no commit, roda a ferramenta de então e devolve as diferenças nas duas provas — ou `null` se ela não rodar. */
  function rodarCom(commitDoGenerate: string, comOsDentes = false) {
    execFileSync("git", ["-C", gen(), "checkout", "-q", "-f", commitDoGenerate]);
    if (comOsDentes) {
      const arq = join(gen(), A_TROCA_DOS_DENTES.arquivo);
      const t = readFileSync(arq, "utf8");
      expect(t.split(A_TROCA_DOS_DENTES.de).length - 1, "a troca dos dentes não casa uma vez").toBe(1);
      writeFileSync(arq, t.replace(A_TROCA_DOS_DENTES.de, A_TROCA_DOS_DENTES.para));
    }
    const destino = join(lab(), "docs", "provas", PROVA_JSON);
    rmSync(destino, { force: true });
    const r = spawnSync("bun", [join(lab(), A_FERRAMENTA)], {
      cwd: join(lab(), "external-engines", "testfit"),
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const rodou = r.status === 0 && existsSync(destino);
    const d = rodou ? diferencasForaDoTempo(prova, JSON.parse(readFileSync(destino, "utf8"))) : null;
    const txtIgual = rodou && textoForaDoTempo(r.stdout) === textoForaDoTempo(provaTxt);
    console.log(
      `    [retrato-do-lab07-relevo] Lab ${curto(LAB.commit)} · Generate ${curto(commitDoGenerate)}${comOsDentes ? " (vizinhos 6 → 7 na cópia)" : ""} · ${d ? `${d.length} diferenças · a .txt ${txtIgual ? "igual" : "difere"}` : "a ferramenta não rodou"}`,
    );
    return d === null ? null : { json: d, txtIgual };
  }

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab07-relevo-retrato-"));
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
    montar("urban-create-hub-41d93a4d", J.oDoInstante);
    for (const c of [J.primeiro, J.ultimoMedido, J.antes])
      if (spawnSync("git", ["-C", gen(), "cat-file", "-e", `${c}^{commit}`]).status !== 0)
        throw new Error(`o commit ${c} não está na história do Generate — desrase o clone vizinho`);
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  test(
    "no começo da janela, no instante das provas e no último medido a ferramenta de então refaz as duas provas",
    () => {
      for (const c of [J.primeiro, J.oDoInstante, J.ultimoMedido]) {
        expect(rodarCom(c), `com o Generate em ${curto(c)} a ferramenta não refaz mais as provas: a janela está errada (D182: explica-se, não se regrava)`).toEqual({
          json: [],
          txtIgual: true,
        });
      }
    },
    10 * MINUTOS,
  );

  test(
    "na borda de antes a ferramenta de então NÃO refaz a prova — a janela tem começo",
    () => {
      const d = rodarCom(J.antes);
      expect(d === null || d.json.length > 0, `com o Generate em ${curto(J.antes)} a ferramenta refaz a prova: a janela começa antes do escrito`).toBe(true);
    },
    10 * MINUTOS,
  );

  test(
    "com o Generate no instante e o número de vizinhos do modelo trocado na cópia, a comparação acusa — os dentes",
    () => {
      const d = rodarCom(J.oDoInstante, true);
      expect(d, "a ferramenta não rodou com a troca dos dentes").not.toBeNull();
      expect(d!.json.length, "com o modelo do Generate trocado nada mudou: a comparação não enxerga o Generate").toBeGreaterThan(0);
      expect(d!.json.every((x) => x.onde.startsWith(".generate.")), "a troca no Generate mudou valor fora do bloco dele").toBe(true);
      expect(d!.txtIgual).toBe(false);
    },
    10 * MINUTOS,
  );
});
