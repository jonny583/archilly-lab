/**
 * **LAB-138 (item 900) · sem PR, mesclar com `--no-ff` e declarar** (D366).
 *
 * ```sh
 * bun test tests/mescla-declarada.test.ts
 * ```
 *
 * O `CLAUDE.md` §1-A manda, sem `mcp__github__*`, mesclar com `git merge --no-ff` na `main` e declarar (D29) — e duas
 * entregas desta casa entraram direto, sem mescla e sem dizer (LAB-102, LAB-114), com a suíte inteira verde. O motivo
 * inteiro, com a primeira linha da `main` contada por quem gravou cada commit, está no cabeçalho de
 * `src/mescla-declarada.ts`.
 *
 * Roda **sem clones** (lê o `git` e os arquivos desta casa, e monta um repositório temporário), e por isso está no
 * portão sem clones do `verde.yml`. No clone raso do CI a leitura da `main` **recusa** pelo LAB-89 (D295): a primeira
 * linha de um clone raso termina no corte, e o corte não tem pai — passaria por `raiz`.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { lerOsRecados } from "../src/as-cinco-linhas-do-recado.ts";
import {
  A_CAIXA,
  A_REGRA,
  DECLARACAO,
  EXCECOES_HISTORICAS,
  PRIMEIRO_PROMPT_COBRADO,
  QUEM_GRAVA_O_PR,
  argumentosDoLog,
  conferirADeclaracaoNoTexto,
  conferirAPrimeiraLinha,
  dizComoEntrou,
  lerALinha,
  monteDe,
  motivosDaMescla,
  type CommitDaLinha,
  type ExcecaoDaMescla,
} from "../src/mescla-declarada.ts";
import { lerPelaHistoria } from "../src/profundidade-da-historia.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RELATORIOS = join(RAIZ, "docs", "relatorios");
const git = (args: string[], cwd = RAIZ): string =>
  execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "ignore"] });

/** Um commit de mentira, gravado aqui, com um pai e um arquivo fora da caixa — cada teste o muda num ponto. */
const um = (mudar: Partial<CommitDaLinha> = {}): CommitDaLinha => ({
  hash: "a".repeat(40),
  pais: 1,
  quemGravou: "noreply@anthropic.com",
  assunto: "LAB-500 (item 900): uma entrega",
  arquivos: ["external-engines/esteira/src/x.ts", "docs/relatorios/LAB-500.md"],
  ...mudar,
});
const tipos = (cs: CommitDaLinha[], ex: readonly ExcecaoDaMescla[] = []) =>
  conferirAPrimeiraLinha(cs, ex).problemas.map((p) => `${p.hash.slice(0, 7)} ${p.tipo}`);

describe("LAB-138 · a regra está escrita onde mora", () => {
  test("o §1-A do CLAUDE.md, e a D29 diz ONDE se declara: no relatório e no recado", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
    const d29 = readFileSync(join(RAIZ, "docs", "DECISOES.md"), "utf8").split("## D30 ")[0]!.split("## D29 ")[1]!;
    expect(aRegraEstaEscrita(d29, "declarar isso no relatório e no recado")).toBe(true);
    expect(aRegraEstaEscrita(d29, "`git merge --no-ff`")).toBe(true);
  });
});

describe("LAB-138 · a primeira linha da main de verdade", () => {
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

  test("o universo publicado, e nenhum problema além dos quatro perdoados um por um", () => {
    if (!leitura.podeAfirmar) return; // a recusa está afirmada acima
    const r = conferirAPrimeiraLinha(lerALinha(leitura.valor!));
    const u = r.universo;
    console.log(
      `    ${u.commits} commits na primeira linha · ${u.raiz} raiz · ${u["pela-interface"]} pelo GitHub · ` +
        `${u["so-a-caixa"]} só a caixa · ${u["mescla-declarada"]} mesclas declaradas · ${r.perdoados.length} perdoados · ` +
        `${r.problemas.length} problemas`,
    );
    expect(r.problemas).toEqual([]);
    expect(r.excecoesSemUso).toEqual([]);
    expect(r.perdoados.map((p) => p.hash.slice(0, 7)).sort()).toEqual(EXCECOES_HISTORICAS.map((e) => e.hash).sort());
    // Contados no LAB-138 (16/10/2026, antes da mescla dele): 201, 1, 123, 32, 41. Os do GitHub e a raiz não mudam mais
    // enquanto a casa não abrir PR; os outros só crescem.
    expect(u.raiz).toBe(1);
    expect(u["pela-interface"]).toBe(123);
    expect(u["so-a-caixa"]).toBeGreaterThanOrEqual(32);
    expect(u["mescla-declarada"]).toBeGreaterThanOrEqual(41);
    expect(u.commits).toBe(Object.entries(u).filter(([k]) => k !== "commits").reduce((s, [, v]) => s + v, 0));
  });

  test("as duas entregas que entraram direto, lidas da história: um pai, gravadas aqui, fora da caixa", () => {
    if (!leitura.podeAfirmar) return;
    const linha = lerALinha(leitura.valor!);
    for (const h of ["7d0e635", "b6b32bb"]) {
      const c = linha.find((x) => x.hash.startsWith(h))!;
      expect(c).toBeDefined();
      expect(monteDe(c)).toBe("entrega-sem-mescla");
      expect(c.arquivos.length).toBeGreaterThanOrEqual(16);
    }
    // E os nove PRs do LAB-39 ao LAB-47, sem "(#N)" no assunto, são do GitHub — quem grava decide, não o assunto.
    const semNumero = linha.filter((c) => monteDe(c) === "pela-interface" && c.pais === 2 && !/\(#\d+\)|Merge pull request/.test(c.assunto));
    expect(semNumero.length).toBe(9);
  });
});

describe("LAB-138 · os cinco montes, e os dois que são problema", () => {
  test("o LAB-102, replantado sem exceção: um pai, gravado aqui → entrega sem mescla", () => {
    expect(tipos([um()])).toEqual(["aaaaaaa entrega-sem-mescla"]);
  });

  test("a mesma entrega por mescla --no-ff que DIZ → passa; que não diz → mescla sem declaração", () => {
    expect(tipos([um({ pais: 2, assunto: `LAB-500 (item 900): uma entrega — ${DECLARACAO}` })])).toEqual([]);
    expect(tipos([um({ pais: 2 })])).toEqual(["aaaaaaa mescla-sem-declaracao"]);
    // A frase tem de estar inteira: "mesclado por git direto" sem a decisão não é a declaração escrita.
    expect(tipos([um({ pais: 2, assunto: "LAB-500: mesclado por git direto" })])).toEqual(["aaaaaaa mescla-sem-declaracao"]);
  });

  test("o caso válido que quase parece inválido: um pai, sem frase, gravado pelo GitHub → PR espremido, passa", () => {
    expect(tipos([um({ quemGravou: QUEM_GRAVA_O_PR })])).toEqual([]);
    expect(tipos([um({ quemGravou: "NoReply@GitHub.com ", pais: 2 })])).toEqual([]);
    // E o "(#N)" no assunto NÃO é PR: escrevê-lo num commit local não o faz passar.
    expect(tipos([um({ assunto: "LAB-500: uma entrega (#999)" })])).toEqual(["aaaaaaa entrega-sem-mescla"]);
  });

  test("a direção escrevendo só na caixa → passa; a caixa e UM arquivo fora → é entrega sem mescla", () => {
    expect(tipos([um({ arquivos: [`${A_CAIXA}031.md`, `${A_CAIXA}COMO_FUNCIONA.md`] })])).toEqual([]);
    expect(tipos([um({ arquivos: [`${A_CAIXA}031.md`, "docs/INDEX.md"] })])).toEqual(["aaaaaaa entrega-sem-mescla"]);
    // A pasta tem de ser a caixa mesmo, não um nome que comece igual.
    expect(tipos([um({ arquivos: ["docs/caixa-de-entrada-velha/031.md"] })])).toEqual(["aaaaaaa entrega-sem-mescla"]);
  });

  test("o commit vazio, de um pai, não é 'só a caixa' — é entrega sem mescla", () => {
    expect(tipos([um({ arquivos: [] })])).toEqual(["aaaaaaa entrega-sem-mescla"]);
  });

  test("sem pai → raiz, e não é problema", () => {
    expect(monteDe(um({ pais: 0 }))).toBe("raiz");
    expect(tipos([um({ pais: 0 })])).toEqual([]);
  });
});

describe("LAB-138 · a exceção, nos dois sentidos", () => {
  const e: ExcecaoDaMescla = { hash: "aaaaaaa", tipo: "entrega-sem-mescla", motivo: "teste" };

  test("perdoa o commit que nomeia, e só o problema que nomeia", () => {
    const r = conferirAPrimeiraLinha([um()], [e]);
    expect(r.problemas).toEqual([]);
    expect(r.perdoados.length).toBe(1);
    expect(tipos([um({ pais: 2 })], [e])).toEqual(["aaaaaaa mescla-sem-declaracao"]);
  });

  test("a que não perdoou nada sobra — o commit não está na linha, ou já não tem problema", () => {
    expect(conferirAPrimeiraLinha([], [e]).excecoesSemUso).toEqual([e]);
    expect(conferirAPrimeiraLinha([um({ quemGravou: QUEM_GRAVA_O_PR })], [e]).excecoesSemUso).toEqual([e]);
  });

  test("hash de menos de sete caracteres não casa com nada", () => {
    expect(tipos([um()], [{ ...e, hash: "aaaaaa" }])).toEqual(["aaaaaaa entrega-sem-mescla"]);
  });

  test("as quatro históricas: hashes distintos, de sete caracteres, todas do tipo 'entrega-sem-mescla', com motivo", () => {
    expect(new Set(EXCECOES_HISTORICAS.map((x) => x.hash)).size).toBe(4);
    for (const x of EXCECOES_HISTORICAS) {
      expect(x.hash).toMatch(/^[0-9a-f]{7}$/);
      expect(x.tipo).toBe("entrega-sem-mescla");
      expect(x.motivo.length).toBeGreaterThan(40);
    }
  });
});

describe("LAB-138 · o git de verdade, num repositório montado aqui", () => {
  test("a mescla --no-ff declarada, a sem frase, a entrega direta e a escrita da caixa — cada uma no seu monte", () => {
    const dir = mkdtempSync(join(tmpdir(), "lab138-"));
    try {
      const g = (...a: string[]) => git(["-c", "user.name=t", "-c", "user.email=t@t", ...a], dir);
      g("init", "-q", "-b", "main");
      const escrever = (f: string) => {
        mkdirSync(join(dir, f, ".."), { recursive: true });
        writeFileSync(join(dir, f), f + Math.random());
        g("add", f);
      };
      escrever("a.txt");
      g("commit", "-q", "-m", "início");
      g("checkout", "-q", "-b", "entrega");
      escrever("b.txt");
      g("commit", "-q", "-m", "LAB-1: b");
      g("checkout", "-q", "main");
      g("merge", "-q", "--no-ff", "-m", `LAB-1: b — ${DECLARACAO}`, "entrega");
      g("checkout", "-q", "-b", "outra");
      escrever("c.txt");
      g("commit", "-q", "-m", "LAB-2: c");
      g("checkout", "-q", "main");
      g("merge", "-q", "--no-ff", "-m", "LAB-2: c", "outra");
      escrever("d.txt");
      g("commit", "-q", "-m", "LAB-3: d direto");
      escrever(`${A_CAIXA}031.md`);
      g("commit", "-q", "-m", "caixa 031");

      const linha = lerALinha(g(...argumentosDoLog("main")));
      expect(linha.map((c) => `${c.assunto.split(" ")[0]} ${monteDe(c)}`)).toEqual([
        "caixa so-a-caixa",
        "LAB-3: entrega-sem-mescla",
        "LAB-2: mescla-sem-declaracao",
        "LAB-1: mescla-declarada",
        "início raiz",
      ]);
      // A mescla vem com os arquivos que ela traz em relação ao PRIMEIRO pai — o que o `--first-parent` mostra.
      expect(linha[2]!.arquivos).toEqual(["c.txt"]);
      // E o alcance do envio: só o que vai, não a história.
      const base = linha[3]!.hash;
      expect(lerALinha(g(...argumentosDoLog(`${base}..main`))).length).toBe(3);
      expect(motivosDaMescla(lerALinha(g(...argumentosDoLog(`${base}..main`))))).toHaveLength(2);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("o gancho do envio chama a régua sobre a primeira linha do que vai", () => {
    const ferramenta = readFileSync(join(import.meta.dirname, "..", "ferramentas", "antes-do-envio.ts"), "utf8");
    expect(ferramenta).toContain("motivosDaMescla(lerALinha(git([");
    expect(ferramenta).toContain("argumentosDoLog(alcance)");
    expect(motivosDaMescla([um()])[0]).toContain("§1-A");
  });
});

describe("LAB-138 · a outra metade: o recado e o relatório dizem como a entrega entrou", () => {
  const RECADOS = readFileSync(join(RELATORIOS, "RECADOS.md"), "utf8");
  const deVerdade = (p: string): string | null => {
    const f = join(RELATORIOS, `${p}.md`);
    return existsSync(f) ? readFileSync(f, "utf8") : null;
  };
  const bloco = (prompt: string, feito: string) => ({
    cabecalho: `=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · ${prompt} (item 900) ===`,
    corpo: ["Estado: feito", `Feito: ${feito}`, "Achados para outros apps ou Central: —", "Depende do Jonny: nada", "Próximo na fila: o 900"],
  });
  const comDeclaracao = (p: string) => (p === "LAB-500" ? `# LAB-500\n\n${DECLARACAO}` : null);
  const tiposT = (rs: ReturnType<typeof bloco>[], rel: (p: string) => string | null) =>
    conferirADeclaracaoNoTexto(rs, rel).problemas.map((p) => `${p.prompt} ${p.tipo}`);

  test("a página de verdade: o universo publicado, e nenhum problema do LAB-138 em diante", () => {
    const r = conferirADeclaracaoNoTexto(lerOsRecados(RECADOS), deVerdade);
    const u = r.universo;
    console.log(`    ${u.recados} recados · ${u.antes} antes do LAB-${PRIMEIRO_PROMPT_COBRADO} · ${u.semPrompt} de classe · ${u.noAlcance} no alcance · ${r.problemas.length} problemas`);
    expect(r.problemas).toEqual([]);
    expect(u.antes + u.semPrompt + u.noAlcance).toBe(u.recados);
    // Contados no LAB-138: os de antes não mudam mais; o deste prompt é o primeiro do alcance.
    expect(u.antes).toBe(130);
    expect(u.noAlcance).toBeGreaterThanOrEqual(1);
  });

  test("o que se diz: a declaração inteira, ou o número do PR", () => {
    expect(dizComoEntrou(`Estado: feito, ${DECLARACAO}`)).toBe(true);
    expect(dizComoEntrou("PR #106 mesclado")).toBe(true);
    expect(dizComoEntrou("mesclado na main")).toBe(false);
    expect(dizComoEntrou("o PR # vai depois")).toBe(false);
    expect(dizComoEntrou("mesclado por git direto")).toBe(false);
  });

  test("recado do alcance que não diz → reprova; o relatório que não diz → reprova; sem relatório → reprova", () => {
    expect(tiposT([bloco("LAB-500", `a régua; ${DECLARACAO}`)], comDeclaracao)).toEqual([]);
    expect(tiposT([bloco("LAB-500", "a régua")], comDeclaracao)).toEqual(["LAB-500 recado-nao-diz-como-entrou"]);
    expect(tiposT([bloco("LAB-500", `a régua; ${DECLARACAO}`)], () => "# LAB-500\n\nmesclado")).toEqual([
      "LAB-500 relatorio-nao-diz-como-entrou",
    ]);
    expect(tiposT([bloco("LAB-500", `a régua; ${DECLARACAO}`)], () => null)).toEqual(["LAB-500 relatorio-ausente"]);
  });

  test("o recado de antes do corte e o de classe não são cobrados — e são contados", () => {
    const antes = bloco(`LAB-${PRIMEIRO_PROMPT_COBRADO - 1}`, "a régua");
    const classe = { ...bloco("despertador-sem-item", "—"), cabecalho: "=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===" };
    const r = conferirADeclaracaoNoTexto([antes, classe], () => null);
    expect(r.problemas).toEqual([]);
    expect(r.universo).toEqual({ recados: 2, antes: 1, semPrompt: 1, noAlcance: 0 });
    // O primeiro cobrado é ESTE prompt, e o corte é dele.
    expect(tiposT([bloco(`LAB-${PRIMEIRO_PROMPT_COBRADO}`, "a régua")], () => `# x\n${DECLARACAO}`)).toEqual([
      `LAB-${PRIMEIRO_PROMPT_COBRADO} recado-nao-diz-como-entrou`,
    ]);
  });
});
