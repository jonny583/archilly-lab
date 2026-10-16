/**
 * **LAB-140 (item 900) · todo prompt fecha com provas em `docs/provas/` — ou diz que não há** (D368).
 *
 * ```sh
 * bun test tests/onde-mora-a-prova.test.ts
 * ```
 *
 * O `CLAUDE.md` §7 manda que todo prompt feche com *"provas em `docs/provas/`"*, e nada perguntava: os 44 prompts do
 * LAB-96 ao LAB-139 fecharam sem pasta e sem dizer que não havia, com a suíte verde. O motivo inteiro, com os
 * relatórios e as pastas contados, está no cabeçalho de `src/onde-mora-a-prova.ts`.
 *
 * Roda **sem clones** (lê os relatórios, as pastas de provas, a caixa de entrada e o `CLAUDE.md` desta casa), e por
 * isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  CALADOS_ANTES_DA_TRAVA,
  PRIMEIRO_PROMPT_COBRADO,
  conferirOndeMoraAProva,
  declaraQueNaoHa,
} from "../src/onde-mora-a-prova.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RELATORIOS = join(RAIZ, "docs", "relatorios");
const PROVAS = join(RAIZ, "docs", "provas");
const CAIXA = join(RAIZ, "docs", "caixa-de-entrada");

function contarArquivos(dir: string): number {
  let n = 0;
  for (const nome of readdirSync(dir)) {
    const c = join(dir, nome);
    n += statSync(c).isDirectory() ? contarArquivos(c) : 1;
  }
  return n;
}

const relatoriosDeVerdade = (): Map<number, string> => {
  const m = new Map<number, string>();
  for (const f of readdirSync(RELATORIOS)) {
    const r = /^LAB-(\d+)\.md$/.exec(f);
    if (r) m.set(Number(r[1]), readFileSync(join(RELATORIOS, f), "utf8"));
  }
  return m;
};
const pastasDeVerdade = (): Map<string, number> => {
  const m = new Map<string, number>();
  for (const nome of readdirSync(PROVAS)) {
    const c = join(PROVAS, nome);
    if (statSync(c).isDirectory()) m.set(nome, contarArquivos(c));
  }
  return m;
};
const itensFeitos = (): Set<string> =>
  new Set(
    readdirSync(CAIXA)
      .map((f) => /^(\d{3,})(?:-adendo(?:-\d+)?)?-FEITO\.md$/.exec(f)?.[1])
      .filter((x): x is string => x !== undefined),
  );

const FRASE = (n: number) => `**Não há \`docs/provas/LAB-${n}/\`, e isso vai declarado:** a prova são as travas.`;
const tipos = (
  rel: [number, string][],
  pastas: [string, number][] = [],
  itens: string[] = [],
  desde = 500,
) => conferirOndeMoraAProva(new Map(rel), new Map(pastas), new Set(itens), desde).problemas.map((p) => `${p.onde} ${p.tipo}`);

describe("LAB-140 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §7 diz \"provas em `docs/provas/`\" na frase do \"Todo prompt fecha com\"", () => {
    const claude = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    expect(aRegraEstaEscrita(claude, `Todo prompt fecha com relatório em \`docs/relatorios/\`, ${A_REGRA}`)).toBe(true);
  });
});

describe("LAB-140 · a página de verdade", () => {
  test("o universo publicado, nenhum problema, e os calados de antes são os 63 contados", () => {
    const r = conferirOndeMoraAProva(relatoriosDeVerdade(), pastasDeVerdade(), itensFeitos());
    const u = r.universo;
    console.log(
      `    ${u.relatorios} relatórios · ${u.comPasta} com pasta · ${u.declaram} dizem que não há · ${u.caladosAntes} calados antes do LAB-${PRIMEIRO_PROMPT_COBRADO} · ${u.cobrados} cobrados · ${u.pastas} pastas (${u.pastasDeItem} de item) · ${r.problemas.length} problemas`,
    );
    expect(r.problemas).toEqual([]);
    expect(u.caladosAntes, "um prompt antigo mudou de lado — pasta apagada ou declaração reconstruída; escreva em CALADOS_ANTES_DA_TRAVA, com o motivo").toBe(CALADOS_ANTES_DA_TRAVA);
    expect(u.comPasta + u.declaram + u.caladosAntes).toBe(u.relatorios);
    // Contados no LAB-140: 131 relatórios até o LAB-139, 64 com pasta, 4 declarando. Daqui em diante só crescem.
    expect(u.relatorios).toBeGreaterThanOrEqual(132);
    expect(u.comPasta).toBeGreaterThanOrEqual(64);
    expect(u.declaram).toBeGreaterThanOrEqual(5);
    expect(u.cobrados).toBeGreaterThanOrEqual(1);
  });

  test("os quatro que já diziam são o LAB-42 ao LAB-45 — a forma nasceu aqui — e este prompt é o quinto", () => {
    const r = conferirOndeMoraAProva(relatoriosDeVerdade(), pastasDeVerdade(), itensFeitos());
    const declaram = [...r.comoFechou].filter(([, c]) => c === "declara-que-nao-ha").map(([n]) => n);
    expect(declaram.slice(0, 5)).toEqual([42, 43, 44, 45, 140]);
  });

  test("o corte não é arbitrário: o LAB-139, o último antes da trava, fechou calado", () => {
    const r = conferirOndeMoraAProva(relatoriosDeVerdade(), pastasDeVerdade(), itensFeitos());
    expect(r.comoFechou.get(139)).toBe("calado");
    expect(PRIMEIRO_PROMPT_COBRADO).toBe(140);
  });
});

describe("LAB-140 · a régua, dos dois lados", () => {
  test("o que declara: a frase das quatro, com ou sem crase, quebrada pela coluna, em negrito, sem caixa", () => {
    expect(declaraQueNaoHa(FRASE(43), 43)).toBe(true);
    expect(declaraQueNaoHa("**Não houve prova em `docs/provas/LAB-42/`, e isso vai declarado:**", 42)).toBe(true);
    expect(declaraQueNaoHa("o detector passou. **Não há\n`docs/provas/LAB-44/`:** a prova", 44)).toBe(true);
    expect(declaraQueNaoHa("NÃO HÁ docs/provas/LAB-7/ neste prompt", 7)).toBe(true);
  });

  test("o que NÃO declara: outra pasta, o sem acento, o afirmativo, a pasta sem o número", () => {
    expect(declaraQueNaoHa(FRASE(44), 45)).toBe(false);
    expect(declaraQueNaoHa("Nao ha `docs/provas/LAB-45/`", 45)).toBe(false);
    expect(declaraQueNaoHa("Há `docs/provas/LAB-45/`", 45)).toBe(false);
    expect(declaraQueNaoHa("Não há `docs/provas/`", 45)).toBe(false);
    expect(declaraQueNaoHa("Não há `docs/provas/LAB-450/`", 45)).toBe(false);
  });

  test("com pasta → passa; com a frase → passa; calado no alcance → reprova; calado antes → contado, não cobrado", () => {
    expect(tipos([[500, "# LAB-500"]], [["LAB-500", 1]])).toEqual([]);
    expect(tipos([[500, FRASE(500)]])).toEqual([]);
    expect(tipos([[500, "# LAB-500\n\nverde"]])).toEqual(["LAB-500 sem-pasta-e-sem-declaracao"]);
    const r = conferirOndeMoraAProva(new Map([[499, "# LAB-499"]]), new Map(), new Set(), 500);
    expect(r.problemas).toEqual([]);
    expect(r.universo.caladosAntes).toBe(1);
    expect(r.universo.cobrados).toBe(0);
  });

  test("dizer que não há e ter a pasta → reprova, em qualquer prompt, antes ou depois do corte", () => {
    expect(tipos([[500, FRASE(500)]], [["LAB-500", 2]])).toEqual(["LAB-500 declara-e-tem-pasta"]);
    expect(tipos([[44, FRASE(44)]], [["LAB-44", 1]])).toEqual(["LAB-44 declara-e-tem-pasta"]);
    // E no universo ele conta pela PASTA: o arquivo é o fato, a frase é que errou.
    const r = conferirOndeMoraAProva(new Map([[500, FRASE(500)]]), new Map([["LAB-500", 2]]), new Set(), 500);
    expect(r.comoFechou.get(500)).toBe("com-pasta");
  });

  test("pasta de prompt sem relatório, de item não feito, sem dono, ou vazia → reprova pelo nome", () => {
    expect(tipos([], [["LAB-998", 1]])).toEqual(["LAB-998 pasta-sem-relatorio"]);
    expect(tipos([], [["item-003", 1]], ["003"])).toEqual([]);
    expect(tipos([], [["item-031", 1]], ["003"])).toEqual(["item-031 pasta-de-item-sem-item"]);
    expect(tipos([], [["rascunho", 1]])).toEqual(["rascunho pasta-sem-dono"]);
    expect(tipos([[500, "x"]], [["LAB-500", 0]])).toEqual(["LAB-500 pasta-vazia"]);
  });

  test("o universo soma: com pasta + dizem + calados antes + calados cobrados = relatórios", () => {
    const r = conferirOndeMoraAProva(
      new Map([
        [1, "x"],
        [2, FRASE(2)],
        [3, "y"],
        [600, "z"],
      ]),
      new Map([["LAB-01", 1]]),
      new Set(),
      500,
    );
    expect(r.universo).toMatchObject({ relatorios: 4, comPasta: 1, declaram: 1, caladosAntes: 1, cobrados: 1 });
    expect(r.problemas.map((p) => p.tipo)).toEqual(["sem-pasta-e-sem-declaracao"]);
  });
});
