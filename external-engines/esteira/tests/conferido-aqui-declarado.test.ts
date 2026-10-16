/**
 * **LAB-139 (item 900) · toda entrega declara "conferido aqui, não no GitHub"** (D367).
 *
 * ```sh
 * bun test tests/conferido-aqui-declarado.test.ts
 * ```
 *
 * O `CLAUDE.md` §7 manda, enquanto o CI automático estiver desligado, que toda entrega declare *"conferido aqui, não no
 * GitHub"* — e nada lia se ela declarava: tirar a frase do recado do LAB-138 deixava a suíte com as mesmas 9 falhas de
 * sempre. O motivo inteiro, com os recados e os relatórios contados, está no cabeçalho de
 * `src/conferido-aqui-declarado.ts`.
 *
 * Roda **sem clones** (lê o `RECADOS.md`, os relatórios, o `verde.yml` e o `CLAUDE.md` desta casa), e por isso está no
 * portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { lerOsRecados } from "../src/as-cinco-linhas-do-recado.ts";
import {
  A_REGRA,
  DECLARACAO,
  EXCECOES_HISTORICAS,
  PRIMEIRO_PROMPT_COBRADO,
  ULTIMO_PROMPT_COBRADO,
  conferirADeclaracao,
  declara,
  promptsDoCabecalho,
  type ExcecaoDaDeclaracao,
} from "../src/conferido-aqui-declarado.ts";
import { gatilhoAutomaticoLigado } from "../src/o-ci-que-roda.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RELATORIOS = join(RAIZ, "docs", "relatorios");
const RECADOS = readFileSync(join(RELATORIOS, "RECADOS.md"), "utf8");
const deVerdade = (p: string): string | null => {
  const f = join(RELATORIOS, `${p}.md`);
  return existsSync(f) ? readFileSync(f, "utf8") : null;
};

/** Um recado de mentira, de entrega — cada teste muda o `Estado:`. */
const bloco = (prompt: string, estado: string) => ({
  cabecalho: `=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · ${prompt} (item 900) ===`,
  corpo: [`Estado: ${estado}`, "Feito: a régua", "Achados para outros apps ou Central: —", "Depende do Jonny: nada", "Próximo na fila: o 900"],
});
const classe = {
  cabecalho: "=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===",
  corpo: ["Estado: caixa vazia"],
};
const BOM = `feito. Conferido aqui, não no GitHub: 1 pass`;
const relBom = (p: string) => `# ${p}\n\n**${DECLARACAO}.**`;
const ALCANCE = { desde: 500, ate: null };
const tipos = (
  rs: ReturnType<typeof bloco>[],
  rel: (p: string) => string | null = relBom,
  alcance: { desde: number; ate: number | null } = ALCANCE,
  ex: readonly ExcecaoDaDeclaracao[] = [],
) => conferirADeclaracao(rs, rel, alcance, ex).problemas.map((p) => `${p.prompt} ${p.tipo}`);

describe("LAB-139 · a regra está escrita onde mora, e o porquê ao lado", () => {
  test("o CLAUDE.md §7 e a receita de religar dizem a mesma frase", () => {
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"), A_REGRA)).toBe(true);
    expect(aRegraEstaEscrita(readFileSync(join(RAIZ, "docs", "COMO_RELIGAR_O_CI.md"), "utf8"), `Toda entrega passa a declarar "${DECLARACAO}"`)).toBe(true);
  });
});

describe("LAB-139 · o alcance é a vida do CI desligado — e quem religa diz onde a regra acabou", () => {
  const ligado = gatilhoAutomaticoLigado(readFileSync(join(RAIZ, ".github", "workflows", "verde.yml"), "utf8"));

  test("gatilho comentado ⇔ o último prompt cobrado ainda não foi escrito", () => {
    if (ligado) {
      expect(
        ULTIMO_PROMPT_COBRADO,
        "o gatilho do verde.yml voltou: a regra do §7 acabou — escreva em ULTIMO_PROMPT_COBRADO (src/conferido-aqui-declarado.ts) o último prompt que rodou com o CI desligado, e tire a frase do CLAUDE.md",
      ).not.toBeNull();
    } else {
      expect(ULTIMO_PROMPT_COBRADO, "o último prompt cobrado está escrito, e o gatilho continua comentado").toBeNull();
    }
  });

  test("o primeiro cobrado é o LAB-67, o prompt que desligou — e o recado dele diz que desligou", () => {
    expect(PRIMEIRO_PROMPT_COBRADO).toBe(67);
    const r = lerOsRecados(RECADOS).find((x) => promptsDoCabecalho(x.cabecalho).includes(67));
    expect(r, "o recado do LAB-67 sumiu do RECADOS.md").toBeDefined();
    expect(declara(r!.corpo.join("\n"))).toBe(true);
    // E o de antes dele não declara — o corte não é arbitrário: é onde a frase passou a existir.
    const antes = lerOsRecados(RECADOS).find((x) => promptsDoCabecalho(x.cabecalho).includes(66));
    expect(declara(antes!.corpo.join("\n"))).toBe(false);
  });
});

describe("LAB-139 · a página de verdade", () => {
  test("o universo publicado, nenhum problema, e a exceção ainda perdoa — e só ela", () => {
    const r = conferirADeclaracao(lerOsRecados(RECADOS), deVerdade);
    const u = r.universo;
    console.log(
      `    ${u.recados} recados · ${u.deClasse} de classe · ${u.foraDoAlcance} antes do LAB-${PRIMEIRO_PROMPT_COBRADO} · ${u.noAlcance} no alcance · ${u.relatorios} relatórios · ${r.perdoados.length} perdoado · ${r.problemas.length} problemas`,
    );
    expect(r.problemas).toEqual([]);
    expect(r.excecoesSemUso).toEqual([]);
    expect(r.perdoados.map((p) => `${p.prompt} ${p.tipo}`)).toEqual(["LAB-118 relatorio-nao-declara"]);
    expect(u.deClasse + u.foraDoAlcance + u.noAlcance).toBe(u.recados);
    // Contados no LAB-139: 73 recados de entrega do LAB-67 ao LAB-138 (o LAB-95 tem dois) e 72 relatórios. Daqui em
    // diante só crescem.
    expect(u.noAlcance).toBeGreaterThanOrEqual(74);
    expect(u.relatorios).toBeGreaterThanOrEqual(73);
  });

  test("a exceção histórica é uma, nomeia um problema que existe, e o recado do mesmo prompt declara", () => {
    expect(EXCECOES_HISTORICAS).toHaveLength(1);
    const e = EXCECOES_HISTORICAS[0]!;
    expect(declara(deVerdade(e.prompt) ?? DECLARACAO)).toBe(false);
    const r = lerOsRecados(RECADOS).find((x) => promptsDoCabecalho(x.cabecalho).includes(Number(e.prompt.slice(4))));
    expect(declara(r!.corpo.join("\n"))).toBe(true);
  });
});

describe("LAB-139 · a régua, dos dois lados", () => {
  test("o que declara: a frase inteira, quebrada pela coluna ou em negrito, sem caixa", () => {
    expect(declara("Conferido aqui, não no GitHub")).toBe(true);
    expect(declara("**Conferido aqui, não\n  no GitHub** — e contra o disco")).toBe(true);
    expect(declara("Verde conferido aqui, não no\nGitHub;")).toBe(true);
    expect(declara("conferido aqui, NÃO NO GITHUB")).toBe(true);
  });

  test("o que NÃO declara: a metade, a palavra trocada, o sem acento, o verde do GitHub", () => {
    expect(declara("conferido aqui")).toBe(false);
    expect(declara("conferido aqui e no GitHub")).toBe(false);
    expect(declara("conferido aqui, nao no GitHub")).toBe(false);
    expect(declara("verificado localmente, não no GitHub")).toBe(false);
    expect(declara("conferido no GitHub")).toBe(false);
  });

  test("recado e relatório que declaram → passa; cada um que não declara → reprova pelo nome", () => {
    expect(tipos([bloco("LAB-500", BOM)])).toEqual([]);
    expect(tipos([bloco("LAB-500", "feito, verde")])).toEqual(["LAB-500 recado-nao-declara"]);
    expect(tipos([bloco("LAB-500", BOM)], () => "# LAB-500\n\nverde")).toEqual(["LAB-500 relatorio-nao-declara"]);
    expect(tipos([bloco("LAB-500", BOM)], () => null)).toEqual(["LAB-500 relatorio-ausente"]);
  });

  test("dois recados do mesmo prompt: cada recado é cobrado, o relatório uma vez só", () => {
    const r = conferirADeclaracao([bloco("LAB-500", BOM), bloco("LAB-500", "2º despertador")], () => "# x", ALCANCE, []);
    expect(r.problemas.map((p) => `${p.prompt} ${p.tipo}`)).toEqual(["LAB-500 relatorio-nao-declara", "LAB-500 recado-nao-declara"]);
    expect(r.universo.relatorios).toBe(1);
  });

  test("o de classe, o de antes e o de depois do fim não são cobrados — e são contados", () => {
    const r = conferirADeclaracao([classe, bloco("LAB-499", "verde"), bloco("LAB-601", "verde")], () => null, { desde: 500, ate: 600 }, []);
    expect(r.problemas).toEqual([]);
    expect(r.universo).toEqual({ recados: 3, deClasse: 1, foraDoAlcance: 2, noAlcance: 0, relatorios: 0 });
    // As bordas são do alcance: o primeiro e o último são cobrados.
    expect(tipos([bloco("LAB-500", "verde"), bloco("LAB-600", "verde")], relBom, { desde: 500, ate: 600 })).toEqual([
      "LAB-500 recado-nao-declara",
      "LAB-600 recado-nao-declara",
    ]);
  });

  test("o prompt se lê no campo <prompt>, não no nome do aplicativo nem no corpo", () => {
    expect(promptsDoCabecalho("=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-95 (item 028, 2º despertador) ===")).toEqual([95]);
    expect(promptsDoCabecalho("=== RECADO PARA O CHAT — LAB-77 · despertador-sem-item ===")).toEqual([]);
    expect(promptsDoCabecalho("=== RECADO PARA O CHAT — Lab · — ===")).toEqual([]);
  });

  test("a exceção perdoa só o problema que nomeia, e a que não perdoa ninguém sobra", () => {
    const ex: ExcecaoDaDeclaracao[] = [{ prompt: "LAB-500", tipo: "relatorio-nao-declara", motivo: "teste" }];
    expect(tipos([bloco("LAB-500", BOM)], () => "# x", ALCANCE, ex)).toEqual([]);
    expect(tipos([bloco("LAB-500", "verde")], () => "# x", ALCANCE, ex)).toEqual(["LAB-500 recado-nao-declara"]);
    expect(tipos([bloco("LAB-500", BOM)], () => null, ALCANCE, ex)).toEqual(["LAB-500 relatorio-ausente"]);
    const r = conferirADeclaracao([bloco("LAB-501", BOM)], relBom, ALCANCE, ex);
    expect(r.excecoesSemUso).toEqual(ex);
  });

  test("lista vazia não é verde mudo: o universo diz zero", () => {
    const r = conferirADeclaracao([], relBom);
    expect(r.problemas).toEqual([]);
    expect(r.universo.recados).toBe(0);
    expect(r.excecoesSemUso).toEqual([...EXCECOES_HISTORICAS]);
  });
});
