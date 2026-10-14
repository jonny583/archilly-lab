/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PROVA DE DETERMINISMO GUARDA AS DUAS ASSINATURAS. (LAB-103, item 900, D330)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A dívida própria, espécie **"prova que só registra aparência"**. O `LEIA-ME.md` das provas
 * promete *"o determinismo é provado: a mesma entrada, duas vezes, dá a mesma SAÍDA byte a byte"*,
 * e **33 campos em seis provas** guardavam só o `true` — o veredito, sem o que se comparou. A
 * forma era a mesma com a régua certa e com a régua que errou no LAB-08.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - a prova que a casa grava **deriva** o veredito das duas assinaturas (não há por onde um
 *   `true` entrar sozinho);
 * - todo `.json` versionado em `docs/` com campo `determinis*` traz as duas assinaturas ao lado —
 *   ou é **fotografia declarada, com a contagem**; e fotografia que não acha mais o que declarou
 *   reprova;
 * - toda ferramenta de `ferramentas/` que calcula um `determinis*` o faz pela função única.
 *
 * E, desde o LAB-105 (D332), **a terceira pergunta** — *a outra semente muda a saída?* —, porque
 * duas execuções iguais também saem de um motor que ignora a entrada:
 *
 * - a função única exige a resposta (a saída da outra semente, ou o motivo de não haver semente) e
 *   deriva `sementeTemEfeito`;
 * - toda prova na forma desta casa (`oQueSeComparou`) traz a resposta — sem fotografia possível,
 *   porque nenhuma prova dessa forma existia antes da pergunta;
 * - toda chamada das ferramentas responde, com uma das duas formas escrita na chamada.
 *
 * Ela lê só arquivo deste repositório e não importa clone: vai no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  assinatura,
  conferirAsProvas,
  FOTOGRAFIAS,
  provaDeDeterminismo,
  provasSemAOutraSemente,
  vereditosSemEvidencia,
} from "../src/prova-de-determinismo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FERRAMENTAS = join(import.meta.dirname, "..", "ferramentas");

function jsonsVersionadosEmDocs() {
  const lista = execFileSync("git", ["ls-files", "docs/**/*.json"], { cwd: RAIZ, encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);
  return lista.map((arquivo) => ({ arquivo, json: JSON.parse(readFileSync(join(RAIZ, arquivo), "utf8")) as unknown }));
}

/** As atribuições `const determinis… = …;` de uma ferramenta, com o lado direito. */
export function calculosDeDeterminismo(texto: string): { nome: string; ladoDireito: string }[] {
  return [...texto.matchAll(/const\s+(determinis\w*)\s*=\s*([^;]+);/g)].map((m) => ({
    nome: m[1]!,
    ladoDireito: m[2]!.trim(),
  }));
}

describe("a prova de determinismo guarda as duas assinaturas (LAB-103, D330)", () => {
  test("a função única: o veredito SAI das assinaturas, e diverge quando a saída diverge", () => {
    const igual = provaDeDeterminismo("a saída", { lotes: [1, 2] }, { lotes: [1, 2] }, { semSemente: "a computação deste teste não sorteia" });
    expect(igual.identicas).toBe(true);
    expect(igual.assinaturaExecucao1).toMatch(/^[0-9a-f]{16}$/);
    expect(igual.assinaturaExecucao1).toBe(igual.assinaturaExecucao2);

    const outra = provaDeDeterminismo("a saída", { lotes: [1, 2] }, { lotes: [2, 1] }, { semSemente: "a computação deste teste não sorteia" });
    expect(outra.identicas).toBe(false);
    expect(outra.assinaturaExecucao1).not.toBe(outra.assinaturaExecucao2);
    // A forma gravada passa pela própria régua — a casa não grava o que ela mesma reprovaria.
    expect(vereditosSemEvidencia({ glebas: [{ determinismo: outra }] })).toEqual([]);
    expect(assinatura({ a: 1 })).toBe(assinatura({ a: 1 }));
  });

  test("a régua acha o veredito sem evidência, em qualquer profundidade e em qualquer roupa", () => {
    const json = {
      glebas: [
        { subdivisao: { lotes: 10, determinismo: true } },
        { motores: { symbios: { determinismo: false } } },
      ],
      determinista: "ok",
      determinismoComHashSo: "2709e86fed2b7181",
      determinismoVazio: { semente: 7 },
    };
    expect(vereditosSemEvidencia(json)).toEqual([
      "glebas[0].subdivisao.determinismo",
      "glebas[1].motores.symbios.determinismo",
      "determinista",
      "determinismoComHashSo",
      "determinismoVazio",
    ]);
  });

  test("o caso válido que quase parece inválido: booleano AO LADO das duas assinaturas passa", () => {
    // a forma do LAB-07 (`testfit/ferramentas/medir.ts`)
    const lab07 = {
      determinismo: {
        semente: 20260913,
        assinaturaExecucao1: "2709e86fed2b7181",
        assinaturaExecucao2: "2709e86fed2b7181",
        assinaturaOutraSemente: "87d0bc7338f406f1",
        saidaDoContratoIdentica: true,
      },
    };
    // a forma do Symbios (`symbios/adapter/ferramentas/medir.ts`): o booleano com o nome do campo
    const symbios = {
      determinismo: { seed42_execucao1: "a1b2c3d4e5f60718", seed42_execucao2: "a1b2c3d4e5f60718", deterministico: true },
    };
    // e campo que só CONTÉM a palavra no meio não é campo de determinismo
    const outroNome = { semDeterminismo: true, oQueDeterminismoProva: "texto" };
    expect(vereditosSemEvidencia(lab07)).toEqual([]);
    expect(vereditosSemEvidencia(symbios)).toEqual([]);
    expect(vereditosSemEvidencia(outroNome)).toEqual([]);
  });

  test("lado ruim: prova nova com o true sozinho reprova pelo arquivo e pelo caminho", () => {
    const r = conferirAsProvas([{ arquivo: "docs/provas/LAB-999/x.json", json: { determinismo: true } }], []);
    expect(r.semEvidencia).toEqual(["docs/provas/LAB-999/x.json · determinismo"]);
  });

  test("lado bom: fotografia declarada passa — e veredito ACIMA da contagem declarada reprova", () => {
    const foto = [{ prova: "docs/provas/LAB-1/m.json", vereditos: 1, porque: "o dia" }];
    const umSo = { glebas: [{ determinismo: true }] };
    expect(conferirAsProvas([{ arquivo: "docs/provas/LAB-1/m.json", json: umSo }], foto).semEvidencia).toEqual([]);

    const dois = { glebas: [{ determinismo: true }, { determinismo: true }] };
    expect(conferirAsProvas([{ arquivo: "docs/provas/LAB-1/m.json", json: dois }], foto).semEvidencia).toHaveLength(2);
  });

  test("o outro sentido: fotografia que não acha mais o que declarou é lista que envelheceu", () => {
    const foto = [{ prova: "docs/provas/LAB-1/m.json", vereditos: 2, porque: "o dia" }];
    const regerada = { glebas: [{ determinismo: provaDeDeterminismo("a saída", 1, 1, { semSemente: "a computação deste teste não sorteia" }) }] };
    const r = conferirAsProvas([{ arquivo: "docs/provas/LAB-1/m.json", json: regerada }], foto);
    expect(r.fotografiasQueEnvelheceram).toEqual(["docs/provas/LAB-1/m.json: declarados 2, achados 0"]);
    expect(conferirAsProvas([], foto).fotografiasQueEnvelheceram).toEqual([
      "docs/provas/LAB-1/m.json: declarados 2, achados o arquivo não foi lido",
    ]);
  });

  test("toda ferramenta que calcula um determinis* o faz pela função única", () => {
    const arquivos = execFileSync("git", ["ls-files", "*.ts"], { cwd: FERRAMENTAS, encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    const calculos = arquivos.flatMap((a) =>
      calculosDeDeterminismo(readFileSync(join(FERRAMENTAS, a), "utf8")).map((c) => ({ arquivo: a, ...c })),
    );
    const resumo = `${arquivos.length} ferramentas lidas, ${calculos.length} cálculos de determinismo`;
    expect(calculos.length, resumo).toBeGreaterThanOrEqual(7);
    expect(
      calculos.filter((c) => !c.ladoDireito.startsWith("provaDeDeterminismo(")).map((c) => `${c.arquivo} · ${c.nome}`),
      `estes cálculos gravam o veredito sem as assinaturas — ${resumo}`,
    ).toEqual([]);
    // a régua de texto, dos dois lados
    expect(calculosDeDeterminismo("const determinismo = a === b;")[0]!.ladoDireito).toBe("a === b");
    expect(calculosDeDeterminismo('const determinista = provaDeDeterminismo("x", a, b, c);')[0]!.ladoDireito).toMatch(
      /^provaDeDeterminismo\(/,
    );
  });

  test("a árvore de hoje: nenhum veredito sem evidência fora das fotografias — e o universo, publicado", () => {
    const r = conferirAsProvas(jsonsVersionadosEmDocs());
    const declarados = FOTOGRAFIAS.reduce((s, f) => s + f.vereditos, 0);
    const resumo =
      `lidos ${r.lidos} JSON de docs/, ${r.falamDeDeterminismo} falam de determinismo; ` +
      `${FOTOGRAFIAS.length} fotografias com ${declarados} vereditos declarados`;
    expect(r.lidos, resumo).toBeGreaterThan(50);
    expect(r.falamDeDeterminismo, resumo).toBeGreaterThan(FOTOGRAFIAS.length);
    expect(r.semEvidencia, `veredito de determinismo sem as duas assinaturas — ${resumo}`).toEqual([]);
    expect(r.fotografiasQueEnvelheceram, `fotografias que não batem mais — ${resumo}`).toEqual([]);
  });

  // ── A terceira pergunta (LAB-105, D332) ─────────────────────────────────────────────
  test("a terceira pergunta: a outra semente — sementeTemEfeito SAI da assinatura, nos dois sentidos", () => {
    const muda = provaDeDeterminismo("a saída", { lotes: [1] }, { lotes: [1] }, { outraSemente: 8, saida: { lotes: [2] } });
    expect(muda).toMatchObject({ identicas: true, outraSemente: 8, sementeTemEfeito: true });
    if (!("assinaturaOutraSemente" in muda)) throw new Error("a forma com a outra semente não gravou a assinatura");
    expect(muda.assinaturaOutraSemente).toMatch(/^[0-9a-f]{16}$/);
    expect(muda.assinaturaOutraSemente).not.toBe(muda.assinaturaExecucao1);

    // o motor que IGNORA a entrada: as três iguais — gravado, não reprovado (o Lab mede, D20)
    const ignora = provaDeDeterminismo("a saída", { lotes: [1] }, { lotes: [1] }, { outraSemente: 8, saida: { lotes: [1] } });
    expect(ignora).toMatchObject({ identicas: true, sementeTemEfeito: false });

    // sem semente: o motivo vai gravado; motivo que não diz nada não passa
    const sem = provaDeDeterminismo("a saída", 1, 1, { semSemente: "a subdivisão não sorteia" });
    expect(sem).toMatchObject({ identicas: true, semSemente: "a subdivisão não sorteia" });
    expect("sementeTemEfeito" in sem).toBe(false);
    expect(() => provaDeDeterminismo("a saída", 1, 1, { semSemente: " " })).toThrow(/POR QUE/);

    // as duas formas passam pelas duas réguas
    for (const p of [muda, ignora, sem]) {
      expect(vereditosSemEvidencia({ determinismo: p })).toEqual([]);
      expect(provasSemAOutraSemente({ determinismo: p })).toEqual([]);
    }
  });

  test("a régua da terceira pergunta: prova da casa sem a resposta reprova — e o que ela NÃO lê", () => {
    const semResposta = {
      glebas: [
        {
          determinismo: {
            oQueSeComparou: "a saída",
            assinaturaExecucao1: "2709e86fed2b7181",
            assinaturaExecucao2: "2709e86fed2b7181",
            identicas: true,
          },
        },
      ],
    };
    expect(provasSemAOutraSemente(semResposta)).toEqual(["glebas[0].determinismo"]);
    // meia resposta é resposta nenhuma: a assinatura sem o veredito, o veredito sem a assinatura, motivo vazio
    const base = semResposta.glebas[0]!.determinismo;
    expect(provasSemAOutraSemente({ d: { ...base, assinaturaOutraSemente: "87d0bc7338f406f1" } })).toEqual(["d"]);
    expect(provasSemAOutraSemente({ d: { ...base, sementeTemEfeito: true } })).toEqual(["d"]);
    expect(provasSemAOutraSemente({ d: { ...base, semSemente: "" } })).toEqual(["d"]);
    expect(provasSemAOutraSemente({ d: { ...base, assinaturaOutraSemente: "ok", sementeTemEfeito: true } })).toEqual(["d"]);

    // o caso válido que quase parece inválido: as formas escritas à mão (LAB-07, Symbios) e as
    // fotografias da D330 não são da forma desta casa — não se cobra delas a pergunta que nasceu depois
    const lab07 = {
      determinismo: {
        semente: 20260913,
        assinaturaExecucao1: "2709e86fed2b7181",
        assinaturaExecucao2: "2709e86fed2b7181",
        saidaDoContratoIdentica: true,
      },
    };
    expect(provasSemAOutraSemente(lab07)).toEqual([]);
    expect(provasSemAOutraSemente({ glebas: [{ determinismo: true }] })).toEqual([]);

    const r = conferirAsProvas([{ arquivo: "docs/provas/LAB-999/x.json", json: semResposta }], []);
    expect(r.provasNaFormaDaCasa).toBe(1);
    expect(r.semAOutraSemente).toEqual(["docs/provas/LAB-999/x.json · glebas[0].determinismo"]);
  });

  test("toda chamada das ferramentas responde a terceira pergunta, com a forma escrita na chamada", () => {
    const arquivos = execFileSync("git", ["ls-files", "*.ts"], { cwd: FERRAMENTAS, encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    const chamadas = arquivos.flatMap((a) =>
      calculosDeDeterminismo(readFileSync(join(FERRAMENTAS, a), "utf8"))
        .filter((c) => c.ladoDireito.startsWith("provaDeDeterminismo("))
        .map((c) => ({ arquivo: a, ...c, responde: respondeAOutraSemente(c.ladoDireito) })),
    );
    const formas = { outraSemente: 0, semSemente: 0, delegada: 0 };
    for (const c of chamadas) if (c.responde) formas[c.responde]++;
    const resumo =
      `${chamadas.length} chamadas em ${arquivos.length} ferramentas: ${formas.outraSemente} rodam a outra semente, ` +
      `${formas.semSemente} dizem por que não há, ${formas.delegada} delegam a uma função que decide por motor`;
    expect(chamadas.length, resumo).toBeGreaterThanOrEqual(7);
    expect(
      chamadas.filter((c) => !c.responde).map((c) => `${c.arquivo} · ${c.nome}`),
      `estas chamadas não respondem se a outra semente muda a saída — ${resumo}`,
    ).toEqual([]);
    // as duas formas existem na árvore: nem todo motor tem semente, e nem todo motor deixa de ter
    expect(formas.outraSemente, resumo).toBeGreaterThan(0);
    expect(formas.semSemente, resumo).toBeGreaterThan(0);
    // a régua de texto, dos dois lados
    expect(respondeAOutraSemente('provaDeDeterminismo("x", a, b)')).toBeNull();
    expect(respondeAOutraSemente('provaDeDeterminismo("x", a, b, { semSemente: "não sorteia" })')).toBe("semSemente");
    expect(respondeAOutraSemente('provaDeDeterminismo("x", a, b, { outraSemente: S + 1, saida: c })')).toBe("outraSemente");
    expect(respondeAOutraSemente('provaDeDeterminismo("x", a, b, aOutraSemente(m.id, e))')).toBe("delegada");
  });

  test("a árvore de hoje: toda prova na forma da casa responde a terceira pergunta — e o universo, publicado", () => {
    const r = conferirAsProvas(jsonsVersionadosEmDocs());
    const resumo = `lidos ${r.lidos} JSON de docs/, ${r.provasNaFormaDaCasa} provas na forma da casa`;
    expect(r.lidos, resumo).toBeGreaterThan(50);
    expect(r.semAOutraSemente, `provas sem a resposta da outra semente — ${resumo}`).toEqual([]);
  });
});

/**
 * Qual das formas a chamada usa para a terceira pergunta: o objeto com `outraSemente:` ou com
 * `semSemente:` escrito na chamada, ou a função `aOutraSemente(` (o `lab13.ts`, que decide motor a
 * motor — o Generate não tem semente). `null` é chamada que não responde.
 */
export function respondeAOutraSemente(chamada: string): "outraSemente" | "semSemente" | "delegada" | null {
  if (/\boutraSemente\s*:/.test(chamada)) return "outraSemente";
  if (/\bsemSemente\s*:/.test(chamada)) return "semSemente";
  if (/\baOutraSemente\(/.test(chamada)) return "delegada";
  return null;
}
