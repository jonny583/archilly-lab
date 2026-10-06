/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-49 · O detector de prova velha para o LAB-25 e o LAB-30.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * # Por que ele existe, e o preço que a falta dele cobrou
 *
 * O LAB-33 criou o detector de prova velha (D131) e o deu a **duas** provas — a do
 * LAB-23 e a do LAB-28. As outras ficaram sem, e **duas delas apodreceram em
 * silêncio** até o LAB-43 as regerar e descobrir (D156):
 *
 *   · a do **LAB-30** estava velha desde o LAB-40 — o inventário da ida foi de **72
 *     para 74 campos** e a prova continuou dizendo 72;
 *   · a do **LAB-25** estava velha desde o LAB-37 — em `geo-antonina` a variante que
 *     o motor escolhe passou a ser a de **33 lotes**.
 *
 * Nenhuma das duas reprovou nada enquanto mentia. **Prova que ninguém reconfere é
 * afirmação com data.**
 *
 * # A regra que o LAB-39 deixou, e que este arquivo obedece
 *
 * > **Detector mede da FONTE; não compara prova com prova** (D144).
 *
 * Duas provas saídas da mesma fórmula erram juntas — erradas do mesmo jeito, batem.
 * Então aqui cada número da prova é confrontado com **quem o produz**: o inventário
 * é recontado do módulo, o conjunto de glebas é relido das fixtures, e o que só o
 * motor sabe é **medido rodando o motor**.
 *
 * # O ESCOPO sai como NÚMERO, e há trava para ele não encolher (a lição do D164)
 *
 * Detector que confere três campos de vinte é o escopo estreito da Pesquisa com
 * outro nome. Então **cada chave de primeiro nível das duas provas está
 * classificada** em `medida`, `declarada` ou `naoMedida` — esta última **com o
 * motivo escrito** —, e há trava nas duas direções: chave nova na prova que ninguém
 * classificou **reprova**, e chave classificada que desapareceu da prova **reprova**.
 *
 * *Escopo não encolhe por decisão, encolhe por comodidade* (D164).
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ESCOPO_DO_DETECTOR as ESCOPO } from "../src/escopo-do-detector.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { contratoDasEntradas, type EntradaMinima } from "../src/gleba-v1.ts";
import { REGRAS_DA_IDA } from "../src/guarda-da-ida.ts";
import { REGRAS_DA_PONTE } from "../src/guarda-da-ponte.ts";
import { IDA_DO_PARCELAMENTO, IDA_DO_SYMBIOS, IDAS_AUDITADAS } from "../src/inventario-das-idas.ts";
import { PONTES_AUDITADAS } from "../src/inventario-das-pontes.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dir, "..", "..", "..");
const PADRAO = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const COM_VIA = join(RAIZ, "docs", "fixtures", "glebas-com-via-desenhada");
const SEMENTE = 20260913;

const ler = (d: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(d, `${id}.entrada.json`), "utf8"));
const prova = (p: string) => JSON.parse(readFileSync(join(RAIZ, "docs", "provas", p), "utf8"));

/**
 * As glebas de cada ferramenta, **relidas das fixtures** — não copiadas da prova.
 *
 * E a diferença entre as duas listas é o primeiro achado deste prompt: a do LAB-25
 * tem **cinco** e a do LAB-30 tem **sete**. Quem lê `promessasQueNenhumaGlebaExercita`
 * na prova do LAB-30 e o compara com o *"6 → 0"* do LAB-40 compara conjuntos
 * diferentes — o LAB-40 mediu **dez** glebas, com as duas fixtures novas.
 */
const CINCO = ["completo", "sintetico-50ha-ondulado", "sintetico-10ha-plano", "ensaio-47ha", "geo-antonina"];
const SETE = [...CINCO, "ensaio-com-via", "antonina-com-via"];

const entradaDe = (id: string): EntradaMinima =>
  id === "ensaio-com-via" || id === "antonina-com-via"
    ? ler(COM_VIA, id)
    : id === "ensaio-47ha" || id === "geo-antonina"
      ? ler(PADRAO, id)
      : glebaDoLab(id);

/** Conta um inventário por destino, do jeito que a ferramenta conta. */
const contar = (inv: Record<string, { tipo: string }>) => {
  const c: Record<string, number> = { entregue: 0, traduzido: 0, perda: 0, interno: 0 };
  for (const d of Object.values(inv)) c[d.tipo] = (c[d.tipo] ?? 0) + 1;
  return { campos: Object.keys(inv).length, ...c };
};


describe("LAB-49 · o escopo do detector sai como número, e não encolhe", () => {
  for (const [arquivo, classificacao] of Object.entries(ESCOPO)) {
    test(`${arquivo}: toda chave da prova está classificada, e toda classificação existe`, () => {
      const chaves = Object.keys(prova(arquivo));
      const naoClassificadas = chaves.filter((k) => !(k in classificacao));
      expect(
        naoClassificadas,
        `${arquivo}: campo novo na prova que o detector não reconfere nem declara — classifique-o em ESCOPO`,
      ).toEqual([]);
      const fantasmas = Object.keys(classificacao).filter((k) => !chaves.includes(k));
      expect(fantasmas, `${arquivo}: o ESCOPO cita chave que já não existe na prova`).toEqual([]);
    });

    test(`${arquivo}: o que NÃO é medido tem motivo escrito, e não é motivo vazio`, () => {
      for (const [chave, como] of Object.entries(classificacao)) {
        if (como === "medida" || como === "declarada") continue;
        const conhecida = como.startsWith("naoMedida:") || como.startsWith("medidaEmParte:");
        expect(conhecida, `${chave}: classificação desconhecida — ${como}`).toBe(true);
        expect(como.length, `${chave}: sem motivo escrito é omissão com nome bonito`).toBeGreaterThan(40);
      }
    });
  }

  test("o detector alcança mais da metade das chaves das duas provas", () => {
    // O número que impede o encolhimento silencioso. Se um dia ele cair, cai numa
    // trava e não num silêncio — é a diferença entre o D164 e a varredura da Pesquisa.
    //
    // E o número saiu de 9 de 19 — RASPANDO por baixo da metade — na primeira versão
    // deste arquivo. O conserto não foi baixar a régua (o contrário do D143): foi
    // MEDIR MAIS, publicando as regras das duas guardas como dado para as chaves do
    // `porRegra` poderem ser conferidas.
    const todas = Object.values(ESCOPO).flatMap((c) => Object.values(c));
    const alcancadas = todas.filter((c) => c === "medida" || c.startsWith("medidaEmParte:")).length;
    expect(
      alcancadas,
      `o detector alcança ${alcancadas} de ${todas.length} chaves das duas provas`,
    ).toBeGreaterThan(todas.length / 2);
  });
});

describe("LAB-49 · a prova do LAB-30 (guarda da IDA) não está velha", () => {
  const p = prova("LAB-30/guarda-da-ida.json");

  test("o INVENTÁRIO publicado é o do módulo, campo por campo e destino por destino", () => {
    // É exatamente o que apodreceu: 72 → 74 campos, calado desde o LAB-40 (D156).
    expect(p.inventario.parcelamento, "o inventário da ida do parcelamento mudou — regere com `bun run lab30`")
      .toEqual(contar(IDA_DO_PARCELAMENTO));
    expect(p.inventario.symbios, "o inventário da ida do symbios mudou — regere com `bun run lab30`")
      .toEqual(contar(IDA_DO_SYMBIOS));
  });

  test("as idas auditadas são as declaradas no inventário", () => {
    expect(p.idasAuditadas).toEqual([...IDAS_AUDITADAS]);
  });

  test("as glebas da prova são as SETE que a ferramenta mede, na ordem dela", () => {
    expect(Object.keys(p.glebas), "o conjunto de glebas mudou — regere com `bun run lab30`").toEqual(SETE);
  });

  test("a semente e o contrato saem do medido", () => {
    expect(p.semente).toBe(SEMENTE);
    expect(p.contrato, "a etiqueta do contrato tem de sair das entradas medidas (D146)")
      .toBe(contratoDasEntradas(SETE.map(entradaDe)));
  });

  test("o `porRegra` traz exatamente as regras que a guarda da ida sabe emitir", () => {
    // Regra nova na guarda sem regerar a prova = prova que descreve uma guarda que
    // já não existe. É a metade barata do detector, e pega o caso mais provável.
    expect(Object.keys(p.porRegra).sort(), "as regras da ida mudaram — regere com `bun run lab30`")
      .toEqual([...REGRAS_DA_IDA].sort());
  });
});

describe("LAB-49 · a prova do LAB-25 (guarda da PONTE) não está velha", () => {
  const p = prova("LAB-25/guarda-da-ponte.json");

  test("as pontes auditadas são as declaradas no inventário", () => {
    expect(p.pontesAuditadas).toEqual([...PONTES_AUDITADAS]);
  });

  test("as glebas da prova são as CINCO que a ferramenta mede, na ordem dela", () => {
    expect(Object.keys(p.glebas), "o conjunto de glebas mudou — regere com `bun run lab25`").toEqual(CINCO);
  });

  test("a semente e o contrato saem do medido", () => {
    expect(p.semente).toBe(SEMENTE);
    expect(p.contrato).toBe(contratoDasEntradas(CINCO.map(entradaDe)));
  });

  test("o `porRegra` traz exatamente as regras que a guarda da ponte sabe emitir", () => {
    expect(Object.keys(p.porRegra).sort(), "as regras da ponte mudaram — regere com `bun run lab25`")
      .toEqual([...REGRAS_DA_PONTE].sort());
  });

  test("o `faceDeRua` de geo-antonina bate com o motor RODANDO — é o que apodreceu", () => {
    // Esta é a única trava deste arquivo que roda motor, e o preço é declarado:
    // uma rodada do Parcelamento em `geo-antonina`, ~6 s. Ela existe porque é
    // EXATAMENTE o campo que envelheceu no LAB-37 sem ninguém ver (D156): a
    // variante que o ranking do motor escolhe passou a ser a de 33 lotes.
    const r = rodarTestfit(entradaDe("geo-antonina"), SEMENTE);
    const saida = r.saida as { lotes: { id: string; faceDeRua: string | null }[] };
    const f = p.glebas["geo-antonina"].faceDeRua;
    expect(f.lotes, "a contagem de lotes da variante escolhida mudou — regere com `bun run lab25`")
      .toBe(saida.lotes.length);
    expect(f.nulosNaPonte, "quantos lotes a ponte publica com `faceDeRua: null` mudou — regere com `bun run lab25`")
      .toBe(saida.lotes.filter((l) => l.faceDeRua == null).length);
    expect(f.publicadosPelaPonte, "quantos lotes a ponte publica COM face mudou — regere com `bun run lab25`")
      .toBe(saida.lotes.filter((l) => l.faceDeRua != null).length);
    // 60 s de teto: a rodada do Parcelamento em `geo-antonina` leva ~6 s nesta
    // máquina, e o teto padrão de 5 s do `bun test` a reprovava por tempo — que é
    // reprovar pelo motivo errado.
  }, 60_000);
});
