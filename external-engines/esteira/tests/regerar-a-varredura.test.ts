/**
 * **item 024 · a trava que REGERA a varredura — a proposta do LAB-60, executada.**
 *
 * ```sh
 * bun test tests/regerar-a-varredura.test.ts
 * ```
 *
 * A trava do LAB-86 reconta o **ESCOPO** de uma prova (quantos arquivos, quantas linhas). O
 * defeito que o LAB-60 mediu **não estava no escopo**: estava em `totalPorRegra` — `1` na prova
 * commitada contra **`10`** na mesma árvore —, e nos `achados`.
 *
 * > *Recontar o tamanho do universo não reconta o que a régua achou nele.*
 *
 * Esta trava **reexecuta a varredura** e exige que a prova bata, regra por regra e achado por
 * achado. Ela não lê clone vizinho nenhum — só este repositório —, e por isso vai no trabalho de
 * CI que roda sem segredo.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  AS_ESPECIES,
  conferirALista,
  conferirRegerando,
} from "../src/regerar-a-varredura.ts";
import { medirOEscopo } from "../src/escopo-da-varredura.ts";
import { EH_FONTE_TS, medirAsChamadas } from "../src/escopo-das-chamadas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (p: string): string => readFileSync(join(RAIZ, p), "utf8");
const provaJson = (p: string): Record<string, unknown> =>
  JSON.parse(ler(join("docs", "provas", p))) as Record<string, unknown>;
const doGit = (...args: string[]): string[] =>
  execFileSync("git", ["-C", RAIZ, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\0")
    .filter((f) => f.length > 0);

type Achado = { arquivo: string; linha: number; regra: string };

describe("item 024 · a varredura de CONFIGURAÇÃO regerada, regra por regra", () => {
  /** A MESMA função que a ferramenta chama — duas implementações da mesma pergunta divergem (D231). */
  const regerar = (): { porRegra: Record<string, number>; achados: Achado[] } => {
    const m = medirOEscopo(doGit("ls-files", "-z"), (rel) => ler(rel));
    return { porRegra: m.porRegra, achados: m.achados as Achado[] };
  };

  test("O LADO BOM: a prova do LAB-57 bate com a varredura REEXECUTADA — por regra e por achado", () => {
    const prova = provaJson("LAB-57/varredura-de-configuracao.json");
    const desacordos = conferirRegerando(
      { porRegra: prova.totalPorRegra as Record<string, number>, achados: prova.achados as Achado[] },
      regerar(),
    );
    expect(desacordos.map((d) => `${d.tipo}: ${d.oQue}`)).toEqual([]);
  });

  /**
   * **O LADO RUIM, e é o defeito do LAB-60 reproduzido:** a prova com a contagem de ANTES
   * (`conferencia-desligada-por-arquivo: 1` onde a árvore acha outro número) tem de reprovar
   * **nomeando a regra**.
   */
  test("O LADO RUIM: contagem por regra de outro commit REPROVA, e a linha nomeia a regra", () => {
    const agora = regerar();
    const alguma = Object.keys(agora.porRegra)[0]!;
    const comContagemVelha = {
      porRegra: { ...agora.porRegra, [alguma]: (agora.porRegra[alguma] ?? 0) + 9 },
      achados: agora.achados,
    };
    const desacordos = conferirRegerando(comContagemVelha, agora);
    expect(desacordos).toHaveLength(1);
    expect(desacordos[0]!.tipo).toBe("contagem-por-regra");
    expect(desacordos[0]!.oQue).toContain(alguma);
  });

  test("O LADO RUIM: achado que a árvore acha e a prova não traz REPROVA (e o contrário também)", () => {
    const agora = regerar();
    const semOPrimeiro = { porRegra: agora.porRegra, achados: agora.achados.slice(1) };
    const d1 = conferirRegerando(semOPrimeiro, agora);
    expect(d1.some((d) => d.tipo === "achado-a-mais")).toBe(true);

    const comUmInventado = {
      porRegra: agora.porRegra,
      achados: [...agora.achados, { arquivo: "inventado.json", linha: 1, regra: "regra-em-off" }],
    };
    const d2 = conferirRegerando(comUmInventado, agora);
    expect(d2.some((d) => d.tipo === "achado-a-menos")).toBe(true);
  });

  test("prova SEM a contagem por regra não passa calada — é o D213", () => {
    const d = conferirRegerando({ achados: [] }, regerar());
    expect(d.some((x) => x.tipo === "chave-ausente")).toBe(true);
  });
});

describe("item 024 · a varredura de CHAMADAS regerada, regra por regra", () => {
  const regerar = (): { porRegra: Record<string, number>; achados: Achado[] } => {
    const arquivos = doGit("ls-files", "--cached", "--others", "--exclude-standard", "-z", "*.ts").filter(EH_FONTE_TS);
    const m = medirAsChamadas(arquivos, (rel) => ler(rel));
    return { porRegra: m.porRegra, achados: m.achados as Achado[] };
  };

  test("O LADO BOM: a prova do LAB-52 bate com a varredura REEXECUTADA", () => {
    const prova = provaJson("LAB-52/varredura-de-chamadas.json");
    const desacordos = conferirRegerando(
      { porRegra: prova.porRegra as Record<string, number>, achados: prova.achados as Achado[] },
      regerar(),
    );
    expect(desacordos.map((d) => `${d.tipo}: ${d.oQue}`)).toEqual([]);
  });

  test("O LADO RUIM: a mesma sabotagem de contagem reprova aqui também", () => {
    const agora = regerar();
    const alguma = Object.keys(agora.porRegra)[0]!;
    const d = conferirRegerando(
      { porRegra: { ...agora.porRegra, [alguma]: 99 }, achados: agora.achados },
      agora,
    );
    expect(d.some((x) => x.tipo === "contagem-por-regra" && x.oQue.includes("99"))).toBe(true);
  });
});

describe("item 024 · as duas espécies, e a lista fecha nos dois sentidos", () => {
  /**
   * **Sem `catch` que engole, e isto é medição contra mim:** a primeira versão deste bloco
   * tinha um `try { … } catch { /* LEIA-ME.md não é pasta *\/ }`, e a varredura de chamadas que
   * esta mesma rodada regera **acusou a linha na hora** — `catch-que-engole`, neste arquivo.
   * *A régua da casa pegou o código que eu acabara de escrever, e a resposta certa não é
   * regerar a prova: é não engolir erro.* O `withFileTypes` responde a mesma pergunta sem
   * esconder nada.
   */
  const todasAsProvas = readdirSync(join(RAIZ, "docs", "provas"), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((pasta) =>
      readdirSync(join(RAIZ, "docs", "provas", pasta.name))
        .filter((f) => f.endsWith(".json"))
        .map((f) => `${pasta.name}/${f}`),
    );

  test("toda entrada da lista aponta para uma prova que EXISTE", () => {
    const { entradasSemArquivo } = conferirALista(todasAsProvas);
    expect(entradasSemArquivo).toEqual([]);
  });

  test("nenhuma prova em duas espécies, e nenhuma `regeradaPelaTrava` fora da espécie certa", () => {
    const { duplicadas, regeradasSemEntrada } = conferirALista(todasAsProvas);
    expect(duplicadas).toEqual([]);
    expect(regeradasSemEntrada).toEqual([]);
  });

  /**
   * **A resposta à pergunta de projeto, cobrada:** cada entrada tem espécie **e** motivo, e o
   * motivo de uma `fotografia` tem de dizer **por que regerar seria o defeito** — é o D182.
   */
  test("cada entrada traz espécie e MOTIVO, e as fotografias citam o que regerar estragaria", () => {
    for (const e of AS_ESPECIES) {
      expect(e.porque.length, e.prova).toBeGreaterThan(60);
      if (e.especie === "fotografia") {
        expect(
          /antes|ATO|MESMA|outra coisa|outro ato|sujeito/.test(e.porque),
          `${e.prova}: a fotografia tem de dizer o que a regeração estragaria`,
        ).toBe(true);
      }
    }
    expect(AS_ESPECIES.filter((e) => e.especie === "funcao-da-arvore").length).toBeGreaterThanOrEqual(3);
    expect(AS_ESPECIES.filter((e) => e.especie === "fotografia").length).toBeGreaterThanOrEqual(3);
  });

  /** E o D182 está citado no módulo — *regra revogada sem o motivo escrito volta por engano*. */
  test("o módulo cita o D182 e diz que fotografia NÃO se regera", () => {
    const modulo = ler("external-engines/esteira/src/regerar-a-varredura.ts");
    expect(modulo).toContain("D182");
    expect(modulo).toContain("nunca");
  });
});
