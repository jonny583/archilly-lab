/**
 * ════════════════════════════════════════════════════════════════════════════
 *  "O PUBLICADO CONFERE COM O REFEITO" TEM UMA DEFINIÇÃO SÓ. (LAB-110, item 900, D337)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A proposta do LAB-109: *"as ferramentas que gravam o veredito. A régua do D336 lê a prova
 * gravada; o código que a grava não é cobrado"*. O motivo inteiro está no cabeçalho de
 * `src/mesmo-valor.ts`.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - a igualdade única: a ordem das chaves não conta, a das listas conta, um número a mais reprova;
 * - **o defeito, demonstrado e não lembrado**: com a forma velha (bytes), o mesmo agregado em outra
 *   ordem de chaves dava *"diverge"*, e a régua do D336 acusava a prova de se contradizer; com a
 *   igualdade única as duas concordam;
 * - a prova real do LAB-39, com as chaves do agregado publicado embaralhadas em memória, continua
 *   *"confere"*;
 * - a régua da comparação por texto acha a forma velha quando a linha fala do publicado, e **não**
 *   acha o determinismo (a mesma função duas vezes, onde os bytes são a pergunta certa);
 * - o censo de quem grava `limpo`/`aceito`/`confere` é fechado, com a contagem, e quem compara o
 *   publicado chama a igualdade única;
 * - a árvore de hoje: zero comparações por texto do publicado, zero gravadores sem origem, e as
 *   exceções conferidas nos dois sentidos — com o universo publicado.
 *
 * Lê só arquivo deste repositório e não importa clone: vai no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { lerACoerencia } from "../src/coerencia-do-veredito.ts";
import {
  EXCECOES_DE_IGUALDADE_POR_TEXTO,
  GRAVADORES_DE_VEREDITO,
  conferirIgualdadePorTexto,
  conferirOsGravadores,
  gravacoesDeVeredito,
  igualdadePorTextoDoPublicado,
  mesmoValor,
} from "../src/mesmo-valor.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/** O universo: todo `.ts` versionado em `external-engines/`, menos `upstream/` (intocável, §3). */
function universo(): { arquivo: string; texto: string }[] {
  return execFileSync("git", ["ls-files", "external-engines/**/*.ts", "external-engines/*.ts"], {
    cwd: RAIZ,
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter((a) => a && !a.includes("/upstream/"))
    .map((arquivo) => ({ arquivo, texto: readFileSync(join(RAIZ, arquivo), "utf8") }));
}
const ehTrava = (a: string) => a.includes("/tests/") || a.endsWith(".test.ts");

/** O mesmo valor com as chaves na ordem inversa — nada mexido além da ordem. */
function aoContrario(x: unknown): unknown {
  if (Array.isArray(x)) return x.map(aoContrario);
  if (x !== null && typeof x === "object") {
    return Object.fromEntries(Object.entries(x as Record<string, unknown>).reverse().map(([k, v]) => [k, aoContrario(v)]));
  }
  return x;
}

/** A forma VELHA do `lab39` e do `acesso.test.ts`, reproduzida para demonstrar o lado ruim. */
const pelaFormaVelha = (publicado: unknown, refeito: unknown) => JSON.stringify(refeito) === JSON.stringify(publicado);

describe("LAB-110 · o publicado confere com o refeito por uma igualdade só (D337)", () => {
  test("a igualdade única: a ordem das chaves não conta, a das listas conta, e um número a mais reprova", () => {
    const agregado = { posicoes: 12, lotes: [30, 31], melhorPonto: { x: 1, y: 2 } };
    expect(mesmoValor(agregado, aoContrario(agregado))).toBe(true);
    expect(mesmoValor({ lotes: [30, 31] }, { lotes: [31, 30] })).toBe(false);
    expect(mesmoValor(agregado, { ...agregado, posicoes: 13 })).toBe(false);
    expect(mesmoValor(agregado, { ...agregado, extra: 0 })).toBe(false);
    expect(mesmoValor(null, null)).toBe(true);
    expect(mesmoValor(0, null)).toBe(false);
  });

  test("O DEFEITO, DEMONSTRADO: pela forma velha a ferramenta dizia 'diverge' e o D336 acusava a prova", () => {
    const refeito = { posicoes: 12, posicoesMedidas: 12, lotes: 30, areaVendavel_m2: 9000.5 };
    const publicado = aoContrario(refeito);
    // a forma velha: os mesmos números, outra ordem → "diverge"
    const velho = pelaFormaVelha(publicado, refeito);
    expect(velho).toBe(false);
    const provaVelha = { agregadoPublicado: publicado, agregadoRefeitoDosCrus: refeito, confere: velho };
    expect(lerACoerencia(provaVelha).incoerentes.map((i) => i.caminho)).toEqual(["confere"]);
    // a igualdade única: a ferramenta e a régua concordam
    const provaNova = { ...provaVelha, confere: mesmoValor(publicado, refeito) };
    expect(provaNova.confere).toBe(true);
    expect(lerACoerencia(provaNova).incoerentes).toEqual([]);
  });

  test("a prova real do LAB-39, com as chaves do publicado embaralhadas em memória, continua 'confere'", () => {
    const prova = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", "LAB-39", "confronto-refeito.json"), "utf8")) as {
      arquivos: Record<string, { glebas: Record<string, { motores: Record<string, { agregadoPublicado: unknown; agregadoRefeitoDosCrus: unknown; confere: boolean }> }> }>;
    };
    let conferidos = 0;
    let pelaVelhaDivergiriam = 0;
    for (const a of Object.values(prova.arquivos)) {
      for (const g of Object.values(a.glebas)) {
        for (const m of Object.values(g.motores)) {
          const embaralhado = aoContrario(m.agregadoPublicado);
          expect(mesmoValor(embaralhado, m.agregadoRefeitoDosCrus)).toBe(m.confere);
          if (!pelaFormaVelha(embaralhado, m.agregadoRefeitoDosCrus)) pelaVelhaDivergiriam += 1;
          conferidos += 1;
        }
      }
    }
    // o universo, publicado: os 56 agregados do D336 — e pela forma velha os 56 divergiriam
    expect(conferidos).toBe(56);
    expect(pelaVelhaDivergiriam).toBe(56);
  });

  test("a régua da comparação por texto: acha a forma velha no publicado, não acha o determinismo nem o comentário", () => {
    expect(igualdadePorTextoDoPublicado("const ok = JSON.stringify(ag) === JSON.stringify(pub);")).toEqual([1]);
    expect(
      igualdadePorTextoDoPublicado("x;\nif (JSON.stringify(refeito) !== JSON.stringify(g.publicado)) {}"),
    ).toEqual([2]);
    expect(
      igualdadePorTextoDoPublicado("expect(JSON.stringify(confronto(s))).toBe(JSON.stringify(g.publicado));"),
    ).toEqual([1]);
    // o caso válido que quase parece inválido: determinismo — a mesma função duas vezes, bytes
    expect(igualdadePorTextoDoPublicado("expect(JSON.stringify(b.lotes)).toBe(JSON.stringify(a.lotes));")).toEqual([]);
    expect(igualdadePorTextoDoPublicado("// JSON.stringify(refeito) === JSON.stringify(publicado)")).toEqual([]);
    expect(igualdadePorTextoDoPublicado("const ok = mesmoValor(ag, pub);")).toEqual([]);
  });

  test("o censo de quem grava: a gravação conta, a declaração de tipo não", () => {
    expect(gravacoesDeVeredito("  limpo: r.validator.limpo,")).toEqual([1]);
    expect(gravacoesDeVeredito("return { aceito: false, lotes: null };")).toEqual([1]);
    expect(gravacoesDeVeredito("      confere,\n")).toEqual([1]);
    expect(gravacoesDeVeredito("  limpo: boolean;\n  aceito: boolean | null;")).toEqual([]);
    expect(gravacoesDeVeredito("// limpo: true")).toEqual([]);
    // o lado ruim, nos dois sentidos da lista fechada
    const novo = conferirOsGravadores([{ arquivo: "external-engines/esteira/ferramentas/lab999.ts", texto: "x = { limpo: true };" }]);
    expect(novo.semOrigem).toEqual([{ arquivo: "external-engines/esteira/ferramentas/lab999.ts", linhas: [1] }]);
    expect(novo.contagemQueMudou.length).toBe(GRAVADORES_DE_VEREDITO.length);
    const semAUnica = conferirOsGravadores([
      { arquivo: "external-engines/esteira/ferramentas/lab39.ts", texto: "a = { confere: x };\nb = { confere: y };" },
    ]);
    expect(semAUnica.semAIgualdadeUnica).toEqual(["external-engines/esteira/ferramentas/lab39.ts"]);
  });

  test("A ÁRVORE DE HOJE: nenhuma comparação por texto do publicado, nenhum gravador sem origem", () => {
    const todos = universo();
    const texto = conferirIgualdadePorTexto(todos);
    expect(texto.lidos, "o universo: todo .ts versionado de external-engines/, fora upstream/").toBeGreaterThan(200);
    expect(texto.achados, "compara o publicado por TEXTO — use mesmoValor (D337)").toEqual([]);
    expect(texto.excecoesVelhas, "exceção que não tem mais a forma").toEqual([]);
    expect(EXCECOES_DE_IGUALDADE_POR_TEXTO.length).toBe(1);

    const codigo = todos.filter((a) => !ehTrava(a.arquivo));
    const g = conferirOsGravadores(codigo);
    expect(g.lidos, "o universo do censo: o código, sem as travas").toBeGreaterThan(150);
    expect(g.semOrigem, "grava veredito e não diz de onde ele vem").toEqual([]);
    expect(g.contagemQueMudou, "a contagem declarada envelheceu").toEqual([]);
    expect(g.semAIgualdadeUnica, "compara o publicado sem a igualdade única").toEqual([]);
    expect(g.gravacoes).toBe(GRAVADORES_DE_VEREDITO.reduce((s, x) => s + x.linhas, 0));
    expect(g.gravacoes).toBe(15);
    for (const x of GRAVADORES_DE_VEREDITO) expect(x.porque.length, x.arquivo).toBeGreaterThan(20);
  });
});
