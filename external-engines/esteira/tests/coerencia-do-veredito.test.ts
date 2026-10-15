/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O VEREDITO NÃO CONTRADIZ A EVIDÊNCIA AO LADO. (LAB-109, item 900, D336)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A proposta do LAB-108: *"`limpo` ⇔ `violacoes === 0`, `aceito` ⇔ sem violação/recusa/plano nulo,
 * `confere` ⇔ o publicado igual ao refeito: medidos hoje 392 de 392, e nada os cobra — um veredito
 * que contradiga o número ao lado passaria"*.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - cada regra aprova o veredito que a evidência dá e reprova o que ela contradiz — os dois lados,
 *   inclusive os que a árvore nunca mostrou (`confere: false`, `aceito: true` por recusa vazia);
 * - campo `limpo`/`aceito`/`confere` que não cai em regra nem em forma declarada reprova, e não
 *   booleano também — o nulo passa, como "não medido" (D23);
 * - todo `.json` versionado em `docs/` passa, com o universo e a conta por regra publicados.
 *
 * Lê só arquivo deste repositório e não importa clone: vai no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  canonico,
  conferirACoerencia,
  FORMAS_SEM_REGRA,
  lerACoerencia,
  REGRAS_DE_COERENCIA,
} from "../src/coerencia-do-veredito.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

function jsonsVersionadosEmDocs() {
  return execFileSync("git", ["ls-files", "docs/**/*.json"], { cwd: RAIZ, encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((arquivo) => ({ arquivo, json: JSON.parse(readFileSync(join(RAIZ, arquivo), "utf8")) as unknown }));
}

const incoerentes = (json: unknown) => lerACoerencia(json).incoerentes.map((a) => a.caminho);

describe("o veredito não contradiz a evidência ao lado (LAB-109, D336)", () => {
  test("limpo e aceito pelas violações: os dois lados de cada um", () => {
    expect(incoerentes({ limpo: true, violacoes: 0 })).toEqual([]);
    expect(incoerentes({ limpo: false, violacoes: 3 })).toEqual([]);
    expect(incoerentes({ limpo: true, violacoes: 3 })).toEqual(["limpo"]);
    expect(incoerentes({ limpo: false, violacoes: 0 })).toEqual(["limpo"]);
    // a forma do LAB-07 e do LAB-93: violações E lotes — quem decide é o Validator, não a contagem
    expect(incoerentes({ aceito: true, violacoes: 0, lotes: 120 })).toEqual([]);
    expect(incoerentes({ aceito: true, violacoes: 2, lotes: 120 })).toEqual(["aceito"]);
    expect(incoerentes({ aceito: false, violacoes: 2, lotes: 120 })).toEqual([]);
  });

  test("aceito pela recusa e pelo plano nulo: inclusive o lado que a árvore nunca mostrou", () => {
    expect(incoerentes({ aceito: false, recusa: ["sem-via-publica"] })).toEqual([]);
    expect(incoerentes({ aceito: true, recusa: ["sem-via-publica"] })).toEqual(["aceito"]);
    // a árvore só tem `false` com recusa — o `true` com a recusa vazia é o lado provado aqui
    expect(incoerentes({ aceito: true, recusa: [] })).toEqual([]);
    expect(incoerentes({ aceito: false, recusa: [] })).toEqual(["aceito"]);
    expect(incoerentes({ aceito: true, lotes: 40, fora_m: null })).toEqual([]);
    expect(incoerentes({ aceito: false, lotes: null, fora_m: 3.2 })).toEqual([]);
    expect(incoerentes({ aceito: true, lotes: null, fora_m: 3.2 })).toEqual(["aceito"]);
    expect(incoerentes({ aceito: false, lotes: 40, fora_m: null })).toEqual(["aceito"]);
  });

  test("confere pela igualdade profunda: a ordem das chaves não conta, o valor conta", () => {
    const publicado = { lotes: 12, porFaixa: { a: 1, b: [2, 3] } };
    const mesmaCoisaOutraOrdem = { porFaixa: { b: [2, 3], a: 1 }, lotes: 12 };
    expect(canonico(publicado)).toBe(canonico(mesmaCoisaOutraOrdem));
    expect(incoerentes({ confere: true, agregadoPublicado: publicado, agregadoRefeitoDosCrus: mesmaCoisaOutraOrdem })).toEqual([]);
    const umNumeroAMais = { ...publicado, porFaixa: { a: 1, b: [2, 4] } };
    expect(incoerentes({ confere: true, agregadoPublicado: publicado, agregadoRefeitoDosCrus: umNumeroAMais })).toEqual(["confere"]);
    // o `false` de `confere` nunca apareceu na árvore: este é o lado provado
    expect(incoerentes({ confere: false, agregadoPublicado: publicado, agregadoRefeitoDosCrus: umNumeroAMais })).toEqual([]);
    expect(incoerentes({ confere: false, confrontoPublicado: [1], confrontoRefeitoDosCrus: [1] })).toEqual(["confere"]);
    // a ordem de uma LISTA conta: [2, 3] não é [3, 2]
    expect(canonico([2, 3])).not.toBe(canonico([3, 2]));
  });

  test("a régua acha o veredito em qualquer profundidade, e diz onde", () => {
    const json = { glebas: [{ julgamento: { depois: { validator: { limpo: true, violacoes: 1 } } } }], resumo: { aceito: true, violacoes: 0 } };
    expect(incoerentes(json)).toEqual(["glebas[0].julgamento.depois.validator.limpo"]);
    expect(lerACoerencia(json).vereditos).toBe(2);
  });

  test("forma sem regra: a do clone vizinho e o nulo passam DECLARADOS; a forma nova, e o veredito que não é booleano, reprovam", () => {
    const clone = { repo: "motor-testfit", commit: "d00a86e", origemMain: "d00a86e", limpo: true };
    const l = lerACoerencia(clone);
    expect(l.semForma).toEqual([]);
    expect(l.porRegra).toEqual({ "sem regra: limpo do clone vizinho": 1 });
    // a forma que ninguém declarou não passa por não haver regra
    expect(lerACoerencia({ aceito: true, nota: 7 }).semForma.map((a) => a.caminho)).toEqual(["aceito"]);
    expect(lerACoerencia({ limpo: true }).semForma.map((a) => a.caminho)).toEqual(["limpo"]);
    expect(lerACoerencia({ limpo: "sim", violacoes: 0 }).semForma[0]!.porque).toMatch(/não é booleano/);
    // o caso válido que quase parece inválido: o nulo é "não medido" (D23) — a passagem sem
    // relatório de `passagens-dos-legais.ts` — e passa, contado à parte
    const naoMedido = lerACoerencia({ passagem: "p3", aceito: null, violacoes: null });
    expect(naoMedido.semForma).toEqual([]);
    expect(naoMedido.incoerentes).toEqual([]);
    expect(naoMedido.porRegra).toEqual({ "sem regra: não medido (null, D23)": 1 });
    // e a forma do clone não engole o veredito do Validator: com violações, a regra decide
    expect(incoerentes({ ...clone, violacoes: 2 })).toEqual(["limpo"]);
    for (const f of FORMAS_SEM_REGRA) expect(f.porque.length, f.nome).toBeGreaterThan(40);
  });

  test("conferir publica o universo e prefixa o arquivo", () => {
    const r = conferirACoerencia([
      { arquivo: "docs/provas/LAB-1/a.json", json: [{ limpo: true, violacoes: 0 }] },
      { arquivo: "docs/provas/LAB-2/b.json", json: { x: { aceito: true, recusa: ["r"] } } },
    ]);
    expect(r.lidos).toBe(2);
    expect(r.vereditos).toBe(2);
    expect(r.incoerentes.map((a) => a.caminho)).toEqual(["docs/provas/LAB-2/b.json · x.aceito"]);
    expect(r.porRegra).toEqual({ "limpo ⇔ violacoes === 0": 1, "aceito ⇔ recusa vazia": 1 });
  });

  test("a árvore de hoje: nenhum veredito contradiz a evidência, nenhum fica sem forma — e a conta por regra, publicada", () => {
    const r = conferirACoerencia(jsonsVersionadosEmDocs());
    const resumo = `lidos ${r.lidos} JSON de docs/, ${r.vereditos} vereditos; por regra: ${JSON.stringify(r.porRegra)}`;
    expect(r.lidos, resumo).toBeGreaterThan(50);
    // toda regra confere ALGUM veredito da árvore — regra que não lê nada é regra desligada
    for (const regra of REGRAS_DE_COERENCIA) expect(r.porRegra[regra.nome] ?? 0, `${regra.nome} — ${resumo}`).toBeGreaterThan(0);
    for (const f of FORMAS_SEM_REGRA) expect(r.porRegra[`sem regra: ${f.nome}`] ?? 0, `${f.nome} — ${resumo}`).toBeGreaterThan(0);
    expect(r.incoerentes, `veredito que contradiz a evidência ao lado — ${resumo}`).toEqual([]);
    expect(r.semForma, `veredito sem regra nem forma declarada — ${resumo}`).toEqual([]);
  });
});
