/**
 * **LAB-144 (item 900) · um prompt por despertador, e o anterior aberto se termina primeiro** (D372).
 *
 * ```sh
 * bun test tests/um-item-por-entrega.test.ts
 * ```
 *
 * O `CLAUDE.md` §1-A manda *"Um prompt por despertador; o anterior aberto se termina primeiro"*, e nenhuma trava lia o
 * rastro que essa regra deixa: o item da caixa que vira `-FEITO` num commit da primeira linha da `main`. O motivo
 * inteiro, com a medição, está no cabeçalho de `src/um-item-por-entrega.ts`.
 *
 * Roda **sem clones** (lê o `git` desta casa e monta um repositório temporário) e por isso está no portão sem clones do
 * `verde.yml`. No clone raso a leitura da `main` **recusa** pela D295.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { lerPelaHistoria } from "../src/profundidade-da-historia.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";
import {
  A_REGRA,
  EXCECOES,
  O_QUE_ISTO_NAO_ALCANCA,
  argumentosDoLog,
  conferirAsEntregas,
  lerOsPassos,
  type PassoDaCaixa,
} from "../src/um-item-por-entrega.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const git = (args: string[], cwd = RAIZ): string =>
  execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });

let n = 0;
const passo = (adicionados: string[], removidos: string[] = [], assunto = "um passo"): PassoDaCaixa => ({
  hash: (++n).toString(16).padStart(40, "0"),
  assunto,
  adicionados,
  removidos,
});
const fechar = (nome: string): PassoDaCaixa => passo([nome.replace(/\.md$/, "-FEITO.md")], [nome], `fecha ${nome}`);
const tipos = (ps: PassoDaCaixa[]) => conferirAsEntregas(ps).problemas.map((p) => p.tipo);

describe("LAB-144 · a regra está escrita onde mora", () => {
  test("o §1-A do CLAUDE.md, e o 900.md diz que ele nunca se fecha", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
    const novecentos = readFileSync(join(RAIZ, "docs", "caixa-de-entrada", "900.md"), "utf8");
    expect(aRegraEstaEscrita(novecentos, "Este item nunca se fecha. NÃO o renomeie para `-FEITO`.")).toBe(true);
  });
});

describe("LAB-144 · os dois lados da régua", () => {
  test("O LADO BOM: um item por passo, em ordem — e o item com os seus adendos é UM pedido", () => {
    const ps = [
      passo(["001.md", "002.md", "900.md"]),
      fechar("001.md"),
      passo(["002-adendo.md"]),
      passo(["002-FEITO.md", "002-adendo-FEITO.md"], ["002.md", "002-adendo.md"]),
    ];
    const r = conferirAsEntregas(ps);
    expect(r.problemas).toEqual([]);
    expect(r.ordem).toEqual([1, 2]);
    expect(r.universo).toEqual({ passos: 4, entregasQueFecham: 2, numerosFechados: 2, arquivosFechados: 3, abertosHoje: 0 });
  });

  test("O LADO RUIM: dois números numa entrega → acusa", () => {
    const ps = [passo(["001.md", "002.md"]), passo(["001-FEITO.md", "002-FEITO.md"], ["001.md", "002.md"])];
    expect(tipos(ps)).toEqual(["dois-itens-numa-entrega"]);
    // E o 001, que fecha no mesmo passo, não é o anterior pulado do 002: o defeito é um só, e tem nome.
  });

  test("O LADO RUIM: fechar o 003 com o 002 aberto → pulou o anterior", () => {
    const ps = [passo(["002.md", "003.md"]), fechar("003.md")];
    const r = conferirAsEntregas(ps);
    expect(r.problemas.map((p) => p.tipo)).toEqual(["pulou-o-anterior"]);
    expect(r.problemas[0]!.detalhe).toContain("002.md");
    expect(r.universo.abertosHoje).toBe(1);
  });

  test("O LADO RUIM: o 900 virar -FEITO → acusa, e não conta como o anterior de ninguém", () => {
    expect(tipos([passo(["900.md"]), fechar("900.md")])).toEqual(["fechou-o-reservado"]);
    // O 900 aberto não é o anterior do 901.
    expect(tipos([passo(["900.md", "901.md"]), fechar("901.md")])).toEqual([]);
  });

  test("a ordem é NUMÉRICA: o 999 aberto é o anterior do 1000 (em texto, `1000` vem antes)", () => {
    expect(tipos([passo(["999.md", "1000.md"]), fechar("1000.md")])).toEqual(["pulou-o-anterior"]);
    expect(tipos([passo(["999.md", "1000.md"]), fechar("999.md")])).toEqual([]);
  });

  test("O CASO QUE QUASE PARECE INVÁLIDO: a colisão do LAB-82 — o aberto com o número de um item já feito", () => {
    // O 013 se terminou; a direção escreveu outro 013.md; a entrega o renumerou para 015 e fechou.
    const ps = [passo(["013.md"]), fechar("013.md"), passo(["014.md"]), fechar("014.md"), passo(["013.md"])];
    ps.push(passo(["015-FEITO.md"], ["013.md"], "LAB-82"));
    const r = conferirAsEntregas(ps);
    expect(r.problemas).toEqual([]);
    expect(r.colisoes).toHaveLength(1);
    expect(r.colisoes[0]).toContain("013.md");
    // E o adendo aberto de um item feito NÃO é colisão: tem outra identidade, e é o anterior.
    const comAdendo = [passo(["013.md"]), fechar("013.md"), passo(["013-adendo.md", "014.md"]), fechar("014.md")];
    expect(tipos(comAdendo)).toEqual(["pulou-o-anterior"]);
  });

  test("o RETIRADO não é aberto, e o arquivo que já estava -FEITO não fecha de novo", () => {
    expect(tipos([passo(["001.md", "002.md"]), passo(["001-RETIRADO.md"], ["001.md"]), fechar("002.md")])).toEqual([]);
    const r = conferirAsEntregas([passo(["001.md"]), fechar("001.md"), passo(["001-FEITO.md"], ["001-FEITO.md"])]);
    expect(r.universo.entregasQueFecham).toBe(1);
  });

  test("exceção: perdoa só o hash e o tipo dela — e a que não perdoa nada reprova", () => {
    const ps = [passo(["002.md", "003.md"]), fechar("003.md")];
    const hash = ps[1]!.hash.slice(0, 7);
    const certa = conferirAsEntregas(ps, [{ hash, tipo: "pulou-o-anterior", motivo: "teste" }]);
    expect(certa.problemas).toEqual([]);
    expect(certa.perdoados).toHaveLength(1);
    const outroTipo = conferirAsEntregas(ps, [{ hash, tipo: "dois-itens-numa-entrega", motivo: "teste" }]);
    expect(outroTipo.problemas).toHaveLength(1);
    expect(outroTipo.excecoesSemUso).toHaveLength(1);
    const curta = conferirAsEntregas(ps, [{ hash: hash.slice(0, 4), tipo: "pulou-o-anterior", motivo: "teste" }]);
    expect(curta.problemas).toHaveLength(1);
  });
});

describe("LAB-144 · a leitura do git, num repositório de verdade", () => {
  test("a entrega por mescla --no-ff aparece no passo da MESCLA, contra o primeiro pai", () => {
    const dir = mkdtempSync(join(tmpdir(), "lab144-"));
    try {
      const g = (...a: string[]) => git(["-c", "user.name=t", "-c", "user.email=t@t", ...a], dir);
      g("init", "-q", "-b", "main");
      mkdirSync(join(dir, "docs", "caixa-de-entrada"), { recursive: true });
      const caixa = (nome: string) => join(dir, "docs", "caixa-de-entrada", nome);
      writeFileSync(caixa("001.md"), "um\n");
      writeFileSync(caixa("002.md"), "dois\n");
      writeFileSync(join(dir, "fora.txt"), "fora\n");
      g("add", "-A");
      g("commit", "-q", "-m", "caixa: 001 e 002");
      g("checkout", "-q", "-b", "entrega/001");
      g("mv", "docs/caixa-de-entrada/001.md", "docs/caixa-de-entrada/001-FEITO.md");
      g("commit", "-q", "-m", "LAB-1 (item 001)");
      g("checkout", "-q", "main");
      g("merge", "-q", "--no-ff", "-m", "LAB-1: mesclado", "entrega/001");
      writeFileSync(join(dir, "fora.txt"), "mudou\n");
      g("commit", "-q", "-am", "fora da caixa");

      const passos = lerOsPassos(git(argumentosDoLog("main"), dir));
      expect(passos.map((p) => p.assunto)).toEqual(["caixa: 001 e 002", "LAB-1: mesclado"]);
      expect(passos[1]!.adicionados).toEqual(["001-FEITO.md"]);
      expect(passos[1]!.removidos).toEqual(["001.md"]);
      expect(conferirAsEntregas(passos).ordem).toEqual([1]);

      // Sem `--first-parent`, a entrega aparece no commit do RAMO e a mescla não traz nada: a régua leria quem
      // trabalhou, não o que a main recebeu. É a peça que não pode sair.
      const semAPeca = argumentosDoLog("main").filter((a) => a !== "--first-parent");
      // (Ordenado: no mesmo segundo, sem a primeira linha, nem a ordem dos commits é a da main.)
      expect(lerOsPassos(git(semAPeca, dir)).map((p) => p.assunto).sort()).toEqual([
        "LAB-1 (item 001)",
        "LAB-1: mesclado",
        "caixa: 001 e 002",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("LAB-144 · a primeira linha da main de verdade", () => {
  const raso = (() => {
    try {
      return git(["rev-parse", "--is-shallow-repository"]).trim() === "true";
    } catch {
      return null;
    }
  })();
  const leitura = lerPelaHistoria(raso, () => {
    try {
      return git(argumentosDoLog("main"));
    } catch {
      return null; // sem `main` local (o CI chega com o HEAD destacado): não há linha a afirmar
    }
  });

  test("lida com a história inteira — ou RECUSADA, dizendo por quê (nunca um valor do corte)", () => {
    console.log(`    a leitura: ${leitura.motivo} — ${leitura.oQueIssoQuerDizer.slice(0, 90)}`);
    if (!leitura.podeAfirmar) expect(leitura.valor).toBeNull();
    else expect(leitura.motivo).toBe("historia-inteira");
  });

  test("o universo publicado, a ordem 001, 002, … sem buraco, e nenhum problema", () => {
    if (!leitura.podeAfirmar) return; // a recusa está afirmada acima
    const r = conferirAsEntregas(lerOsPassos(leitura.valor!));
    const u = r.universo;
    console.log(
      `    ${u.passos} passos na caixa · ${u.entregasQueFecham} entregas que fecham · ${u.numerosFechados} números · ` +
        `${u.arquivosFechados} arquivos -FEITO · ${r.colisoes.length} colisão · ${u.abertosHoje} abertos hoje · ` +
        `${r.problemas.length} problemas`,
    );
    for (const o of O_QUE_ISTO_NAO_ALCANCA) console.log(`    NÃO alcança: ${o.slice(0, 100)}`);
    expect(r.problemas).toEqual([]);
    expect(r.excecoesSemUso).toEqual([]);
    expect(EXCECOES).toEqual([]);
    // Medido no LAB-144 (17/10/2026): 30 entregas, 001 a 030, 34 arquivos. Só crescem — e crescem em ordem.
    expect(u.entregasQueFecham).toBeGreaterThanOrEqual(30);
    expect(u.arquivosFechados).toBeGreaterThanOrEqual(34);
    expect(r.ordem.slice(0, 30)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect([...r.ordem].sort((a, b) => a - b)).toEqual(r.ordem);
    expect(u.numerosFechados).toBe(u.entregasQueFecham); // um por entrega, de novo, pela conta
  });

  test("a colisão do LAB-82 é a única, e é a que o 015-FEITO.md declara no topo", () => {
    if (!leitura.podeAfirmar) return;
    const r = conferirAsEntregas(lerOsPassos(leitura.valor!));
    expect(r.colisoes).toEqual(["306954d 013.md"]);
    const topo = readFileSync(join(RAIZ, "docs", "caixa-de-entrada", "015-FEITO.md"), "utf8").split("\n")[0]!;
    expect(topo).toContain("RENUMERADO PARA 015 POR COLISÃO");
  });
});
