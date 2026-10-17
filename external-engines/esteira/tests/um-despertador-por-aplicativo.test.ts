/**
 * **LAB-145 (item 900) · um despertador por aplicativo; nunca se toca no de outro repositório** (D373).
 *
 * ```sh
 * bun test tests/um-despertador-por-aplicativo.test.ts
 * ```
 *
 * O `CLAUDE.md` §1-A manda a regra de família, e a única guarda era o *"um id só na seção"* do item 004. Esta lê todo id
 * de tarefa agendada escrito na árvore desta casa contra o registro dos despertadores que ela teve, e o registro contra
 * a história. O motivo inteiro, com a medição, está no cabeçalho de `src/um-despertador-por-aplicativo.ts`.
 *
 * Roda **sem clones** (lê só este repositório) e por isso está no portão sem clones do `verde.yml`. A metade dos
 * vizinhos mora em `um-despertador-por-aplicativo-com-clone.test.ts`, no verde completo.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { lerAConta } from "../src/disparos-do-despertador.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";
import {
  A_REGRA,
  ARGUMENTOS_DO_GREP,
  FICTICIOS,
  OS_DESPERTADORES_DA_CASA,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirOsDespertadores,
  lerOGrep,
  type DespertadorDaCasa,
  type Entrada,
} from "../src/um-despertador-por-aplicativo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** `git grep` sai com 1 quando não acha nada — e isso é universo vazio, não erro. */
function grepDosIds(cwd: string): string {
  try {
    return execFileSync("git", [...ARGUMENTOS_DO_GREP], { cwd, encoding: "utf8", maxBuffer: 1 << 28 });
  } catch (e) {
    const err = e as { status?: number; stdout?: string };
    if (err.status === 1) return "";
    throw e;
  }
}

function aEntradaDeHoje(): Entrada {
  const arquivos = new Set(
    OS_DESPERTADORES_DA_CASA.flatMap((d) => [d.nascimento.arquivo, ...(d.fim ? [d.fim.arquivo] : [])]),
  );
  const textos = Object.fromEntries([...arquivos].map((a) => [a, readFileSync(join(RAIZ, a), "utf8")]));
  return {
    casa: lerOGrep(grepDosIds(RAIZ)),
    textos,
    idsDaSecao: lerAConta(readFileSync(join(RAIZ, "docs", "ONDE_PARAMOS.md"), "utf8")).idsCitados,
  };
}

const tipos = (e: Entrada) => conferirOsDespertadores(e).problemas.map((p) => p.tipo);
const comRegistro = (f: (r: DespertadorDaCasa[]) => DespertadorDaCasa[]): Entrada => ({
  ...aEntradaDeHoje(),
  registro: f(OS_DESPERTADORES_DA_CASA.map((d) => ({ ...d }))),
});

describe("LAB-145 · a regra está escrita onde mora", () => {
  test("o §1-A do CLAUDE.md", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
  });
});

describe("LAB-145 · a casa de hoje", () => {
  const r = conferirOsDespertadores(aEntradaDeHoje());

  test("O LADO BOM: nenhum problema — e o universo é publicado, não zero", () => {
    console.log(
      `    ${r.universo.arquivosComId} arquivo(s) com id · ${r.universo.idsDistintos} id(s) distinto(s) · ` +
        `${OS_DESPERTADORES_DA_CASA.length} despertador(es) no registro · ${FICTICIOS.length} fictício(s) · ` +
        `${r.problemas.length} problema(s)`,
    );
    for (const x of O_QUE_ISTO_NAO_ALCANCA) console.log(`    NÃO alcança: ${x}`);
    expect(r.problemas).toEqual([]);
    // Contados no LAB-145: antes dele, 5 ids (4 da casa, 1 fictício) em 10 arquivos; ele soma o módulo e este teste.
    expect(r.universo.idsDistintos).toBeGreaterThanOrEqual(6);
    expect(r.universo.arquivosComId).toBeGreaterThanOrEqual(11);
  });

  test("um vivo só, e é o da seção do ONDE_PARAMOS — o item 004 e esta trava dizem o mesmo id", () => {
    const vivos = OS_DESPERTADORES_DA_CASA.filter((d) => d.terminou === "vivo");
    expect(vivos.length).toBe(1);
    expect(aEntradaDeHoje().idsDaSecao).toEqual([vivos[0]!.id!]);
  });

  test("o despertador sem id é declarado com null, e a régua diz que não o alcança", () => {
    expect(OS_DESPERTADORES_DA_CASA.filter((d) => d.id === null).length).toBe(1);
    expect(O_QUE_ISTO_NAO_ALCANCA.some((x) => x.includes("id null"))).toBe(true);
  });
});

describe("LAB-145 · os dois lados — cada mutação é acusada", () => {
  test("1 · o id de outra casa escrito num arquivo desta REPROVA", () => {
    const e = aEntradaDeHoje();
    e.casa = [...e.casa, { arquivo: "docs/ONDE_PARAMOS.md", ids: ["trig_DeOutraCasa"] }];
    expect(tipos(e)).toContain("id-estranho");
  });

  test("2 · o fictício fora do arquivo onde foi declarado REPROVA — a declaração é por arquivo", () => {
    const e = aEntradaDeHoje();
    e.casa = [...e.casa, { arquivo: "docs/relatorios/RECADOS.md", ids: [FICTICIOS[0]!.id] }];
    expect(tipos(e)).toContain("id-estranho");
  });

  test("3 · o fictício que saiu do arquivo dele REPROVA — a lista não mente pelo silêncio", () => {
    const e = aEntradaDeHoje();
    e.casa = e.casa.filter((a) => !a.ids.includes(FICTICIOS[0]!.id));
    expect(tipos(e)).toContain("ficticio-sumiu");
  });

  test("4 · o trecho do fim apagado do arquivo REPROVA", () => {
    const e = aEntradaDeHoje();
    const fim = OS_DESPERTADORES_DA_CASA[1]!.fim!;
    e.textos = { ...e.textos, [fim.arquivo]: e.textos[fim.arquivo]!.replace(fim.trecho, "") };
    expect(tipos(e)).toContain("sem-rastro");
  });

  test("5 · dois vivos REPROVA", () => {
    expect(tipos(comRegistro((r) => r.map((d, i) => (i === 2 ? { ...d, terminou: "vivo", fim: null } : d))))).toContain(
      "o-vivo",
    );
  });

  test("6 · um despertador que nasce antes de o anterior terminar REPROVA", () => {
    expect(tipos(comRegistro((r) => r.map((d, i) => (i === 1 ? { ...d, nasceu: "14/09/2026" } : d))))).toContain(
      "dois-ao-mesmo-tempo",
    );
  });

  test("7 · a seção do ONDE_PARAMOS com outro id REPROVA", () => {
    const e = aEntradaDeHoje();
    e.idsDaSecao = ["trig_DeOutraCasa"];
    expect(tipos(e)).toContain("o-vivo-nao-e-o-da-secao");
  });

  test("8 · o id de um despertador da casa na árvore de um vizinho REPROVA", () => {
    const e = aEntradaDeHoje();
    e.vizinhos = [{ nome: "um vizinho", ids: [{ arquivo: "docs/ONDE_PARAMOS.md", ids: [OS_DESPERTADORES_DA_CASA[4]!.id!] }] }];
    expect(tipos(e)).toContain("o-despertador-e-de-outro");
  });

  test("9 · despertador apagado do registro com o id ainda na árvore REPROVA — o registro não encolhe calado", () => {
    expect(tipos(comRegistro((r) => r.filter((_, i) => i !== 0)))).toContain("id-estranho");
  });

  test("o caso válido que quase parece inválido: o mesmo id repetido em vários arquivos da casa passa", () => {
    const e = aEntradaDeHoje();
    const vivo = OS_DESPERTADORES_DA_CASA[4]!.id!;
    expect(e.casa.filter((a) => a.ids.includes(vivo)).length).toBeGreaterThan(1);
    expect(conferirOsDespertadores(e).problemas).toEqual([]);
  });

  test("a leitura do grep: linha sem separador é forma desconhecida e LANÇA, não some", () => {
    const [a, b] = ["trig_DeOutraCasa", FICTICIOS[0]!.id].sort() as [string, string];
    expect(() => lerOGrep(`docs/x.md:${a}\n`)).toThrow();
    expect(lerOGrep(`docs/x.md\0${b}\ndocs/x.md\0${a}\n`)).toEqual([{ arquivo: "docs/x.md", ids: [a, b] }]);
  });
});
