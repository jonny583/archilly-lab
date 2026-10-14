/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O VEREDITO "IDÊNTICO" GUARDA AS DUAS ASSINATURAS. (LAB-108, item 900, D335)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A proposta 2 do LAB-103: *"a mesma pergunta para os outros vereditos booleanos das provas
 * (`limpo`, `aceito`, `confere`, `desenhoIdentico`…): a evidência está ao lado, ou só o
 * veredito?"*. Medido nos 100 JSON de `docs/`: `limpo`, `aceito` e `confere` guardam a evidência
 * e batem com ela (151, 171 e 70 de 70); **`desenhoIdentico` (40) e `saidaIdenticaSemAVia` (8)
 * comparam duas assinaturas e não gravam nenhuma** — a forma do D330 com outro nome de campo.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - a forma única deriva o veredito das duas assinaturas, e recusa o que não é assinatura;
 * - todo `.json` versionado em `docs/` com campo `*identic*` traz as duas assinaturas ao lado —
 *   ou é fotografia declarada, com a contagem; e fotografia que não acha mais o que declarou
 *   reprova;
 * - nenhuma ferramenta de `ferramentas/` escreve um campo `*identic*` à mão: todos saem da função.
 *
 * Lê só arquivo deste repositório e não importa clone: vai no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { provaDeDeterminismo } from "../src/prova-de-determinismo.ts";
import {
  assinatura,
  conferirAsIdentidades,
  FOTOGRAFIAS_DE_IDENTIDADE,
  identidadesSemEvidencia,
  vereditoDeIdentidade,
} from "../src/veredito-de-identidade.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FERRAMENTAS = join(import.meta.dirname, "..", "ferramentas");

function jsonsVersionadosEmDocs() {
  return execFileSync("git", ["ls-files", "docs/**/*.json"], { cwd: RAIZ, encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((arquivo) => ({ arquivo, json: JSON.parse(readFileSync(join(RAIZ, arquivo), "utf8")) as unknown }));
}

/**
 * As propriedades `*identic*: <valor>` escritas à mão num texto de ferramenta. O tipo
 * (`{ identicas: boolean }`, um cast de leitura) não é gravação, e fica de fora.
 */
export function gravacoesDeIdentidade(texto: string): { nome: string; ladoDireito: string }[] {
  return [...texto.matchAll(/\b(\w*identic\w*)\s*:\s*([^,}\n]+)/gi)]
    .map((m) => ({ nome: m[1]!, ladoDireito: m[2]!.trim() }))
    .filter((g) => g.ladoDireito !== "boolean");
}

describe("o veredito de identidade guarda as duas assinaturas (LAB-108, D335)", () => {
  test("a forma única: o veredito SAI das assinaturas, com o nome de campo que a prova usa", () => {
    const igual = vereditoDeIdentidade("desenhoIdentico", "2fad01d9da66bf8f", "2fad01d9da66bf8f");
    expect(igual).toEqual({ desenhoIdentico: true, assinaturaSem: "2fad01d9da66bf8f", assinaturaCom: "2fad01d9da66bf8f" });
    const outro = vereditoDeIdentidade("saidaIdenticaSemAVia", assinatura({ lotes: [1] }), assinatura({ lotes: [2] }));
    expect(outro.saidaIdenticaSemAVia).toBe(false);
    // o que não é assinatura não entra — um `true` não se disfarça de hash
    expect(() => vereditoDeIdentidade("desenhoIdentico", "sim", "sim")).toThrow(/não é uma assinatura/);
    // a forma gravada passa pela própria régua
    expect(identidadesSemEvidencia({ porFormato: [{ formato: "espinha", ...igual }, outro] })).toEqual([]);
  });

  test("a régua acha o veredito sem evidência, em qualquer profundidade e em qualquer roupa", () => {
    const json = {
      glebas: [{ porFormato: [{ formato: "espinha", lotesSemAsFaces: 10, lotesComAsFaces: 10, desenhoIdentico: true }] }],
      motores: { g: { saidaIdenticaSemAVia: false } },
      identico: "sim",
      comUmaSo: { desenhoIdentico: true, assinaturaSem: "2fad01d9da66bf8f" },
    };
    expect(identidadesSemEvidencia(json)).toEqual([
      "glebas[0].porFormato[0].desenhoIdentico",
      "motores.g.saidaIdenticaSemAVia",
      "identico",
      "comUmaSo.desenhoIdentico",
    ]);
  });

  test("o caso válido que quase parece inválido: os números iguais ao lado NÃO são evidência; as assinaturas, sim", () => {
    // as duas formas de determinismo — a desta casa e a do LAB-07 — têm `identic*` E as assinaturas
    const daCasa = provaDeDeterminismo("a saída", 1, 1, { semSemente: "a computação deste teste não sorteia" });
    const lab07 = {
      assinaturaExecucao1: "2709e86fed2b7181",
      assinaturaExecucao2: "2709e86fed2b7181",
      saidaDoContratoIdentica: true,
    };
    expect(identidadesSemEvidencia({ determinismo: daCasa })).toEqual([]);
    expect(identidadesSemEvidencia({ determinismo: lab07 })).toEqual([]);
    // e o objeto que tem TODOS os números iguais dos dois lados, mas não as assinaturas, reprova:
    // o mesmo número de lotes não é o mesmo desenho
    const soNumeros = { viasSemAVia: 12, viasComAVia: 12, aderenciaSemAVia: 0.259, aderenciaComAVia: 0.259, desenhoIdentico: false };
    expect(identidadesSemEvidencia(soNumeros)).toEqual(["desenhoIdentico"]);
  });

  test("lado ruim: prova nova com o veredito sozinho reprova pelo arquivo e pelo caminho", () => {
    const r = conferirAsIdentidades([{ arquivo: "docs/provas/LAB-999/x.json", json: { desenhoIdentico: true } }], []);
    expect(r.semEvidencia).toEqual(["docs/provas/LAB-999/x.json · desenhoIdentico"]);
  });

  test("lado bom: fotografia declarada passa — e veredito ACIMA da contagem declarada reprova", () => {
    const foto = [{ prova: "docs/provas/LAB-1/m.json", vereditos: 1, porque: "o dia" }];
    expect(conferirAsIdentidades([{ arquivo: "docs/provas/LAB-1/m.json", json: [{ desenhoIdentico: true }] }], foto).semEvidencia).toEqual([]);
    const dois = [{ desenhoIdentico: true }, { desenhoIdentico: false }];
    expect(conferirAsIdentidades([{ arquivo: "docs/provas/LAB-1/m.json", json: dois }], foto).semEvidencia).toHaveLength(2);
  });

  test("o outro sentido: fotografia que não acha mais o que declarou é lista que envelheceu", () => {
    const foto = [{ prova: "docs/provas/LAB-1/m.json", vereditos: 2, porque: "o dia" }];
    const regerada = [vereditoDeIdentidade("desenhoIdentico", "aaaaaaaa", "aaaaaaaa")];
    expect(conferirAsIdentidades([{ arquivo: "docs/provas/LAB-1/m.json", json: regerada }], foto).fotografiasQueEnvelheceram).toEqual([
      "docs/provas/LAB-1/m.json: declarados 2, achados 0",
    ]);
    expect(conferirAsIdentidades([], foto).fotografiasQueEnvelheceram).toEqual([
      "docs/provas/LAB-1/m.json: declarados 2, achados o arquivo não foi lido",
    ]);
  });

  test("nenhuma ferramenta escreve um campo *identic* à mão — todos saem da função única", () => {
    const arquivos = execFileSync("git", ["ls-files", "*.ts"], { cwd: FERRAMENTAS, encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    const textos = arquivos.map((a) => ({ arquivo: a, texto: readFileSync(join(FERRAMENTAS, a), "utf8") }));
    const aMao = textos.flatMap(({ arquivo, texto }) =>
      gravacoesDeIdentidade(texto).map((g) => `${arquivo} · ${g.nome}: ${g.ladoDireito}`),
    );
    const chamadas = textos.reduce((s, { texto }) => s + (texto.match(/vereditoDeIdentidade\(/g) ?? []).length, 0);
    const resumo = `${arquivos.length} ferramentas lidas, ${chamadas} chamadas da função única`;
    expect(chamadas, resumo).toBeGreaterThanOrEqual(3);
    expect(aMao, `estas ferramentas gravam o veredito sem as assinaturas — ${resumo}`).toEqual([]);
    // a régua de texto, dos dois lados: a gravação à mão é achada; o tipo de um cast, não
    expect(gravacoesDeIdentidade("      desenhoIdentico: vSem.assinatura === vCom.assinatura,")).toHaveLength(1);
    expect(gravacoesDeIdentidade("      saidaIdenticaSemAVia: igual,")[0]!.ladoDireito).toBe("igual");
    expect(gravacoesDeIdentidade("(linha.determinismo as { identicas: boolean }).identicas")).toEqual([]);
  });

  test("a árvore de hoje: nenhum veredito de identidade sem evidência fora das fotografias — e o universo, publicado", () => {
    const r = conferirAsIdentidades(jsonsVersionadosEmDocs());
    const declarados = FOTOGRAFIAS_DE_IDENTIDADE.reduce((s, f) => s + f.vereditos, 0);
    const resumo =
      `lidos ${r.lidos} JSON de docs/, ${r.vereditosDeIdentidade} vereditos de identidade; ` +
      `${FOTOGRAFIAS_DE_IDENTIDADE.length} fotografias com ${declarados} declarados`;
    expect(r.lidos, resumo).toBeGreaterThan(50);
    // há vereditos COM evidência no universo (o LAB-07), senão o lado bom passaria por não haver o que ler
    expect(r.vereditosDeIdentidade, resumo).toBeGreaterThan(declarados);
    expect(r.semEvidencia, `veredito de identidade sem as duas assinaturas — ${resumo}`).toEqual([]);
    expect(r.fotografiasQueEnvelheceram, `fotografias que não batem mais — ${resumo}`).toEqual([]);
  });
});
