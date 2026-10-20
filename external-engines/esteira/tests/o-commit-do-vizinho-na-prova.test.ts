/**
 * **LAB-198 (item 900) · as provas que rodam código de vizinho e não escrevem o commit dele** (D426).
 *
 * ```sh
 * bun test tests/o-commit-do-vizinho-na-prova.test.ts
 * ```
 *
 * A regra do LAB-79 (`podeSerRegerada`): prova que afirma o presente de um clone vizinho regera-se declarando o
 * commit, e nunca sem ele. Esta trava pergunta ao universo inteiro de `docs/provas/`, por lugar: quem grava cada
 * prova (lista à mão, fechada nos dois sentidos), que vizinho a ferramenta roda (o fecho dos `import`), e que
 * commit da história do vizinho a prova escreve (`git cat-file`). O retrato de hoje — 41 provas que calam — fica
 * congelado nos dois sentidos. O motivo inteiro está no cabeçalho de `src/o-commit-do-vizinho-na-prova.ts`.
 *
 * **Precisa dos clones vizinhos `../motor-testfit` e `../urban-create-hub-41d93a4d`, com a história inteira**
 * (o commit escrito numa prova velha só existe na história), e por isso NÃO está no portão sem clones do
 * `verde.yml`: roda no verde completo (`./external-engines/conferir.sh`). Os vizinhos só são lidos.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  OS_ACHADOS_AO_LADO,
  type ProvaQueRodaVizinho,
  OS_CALADOS_DE_HOJE,
  QUEM_GRAVA,
  apelidosDoTsconfig,
  carregaOWasm,
  comoSeDiz,
  comoSeDizOQueEspera,
  conferirOsQueEsperamOWasm,
  osSilenciosSemAchado,
  conferirOsAchadosAoLado,
  conferirAListaDeQuemGrava,
  conferirOsCalados,
  contarAsProvas,
  importsDeExecucao,
  pareceCommit,
  vizinhosQueRoda,
} from "../src/o-commit-do-vizinho-na-prova.ts";
import { podeSerRegerada } from "../src/alcance-das-provas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVAS = join(RAIZ, "docs", "provas");
const MOTOR = "motor-testfit";
const GENERATE = "urban-create-hub-41d93a4d";

const noDisco: string[] = [];
for (const d of readdirSync(PROVAS)) {
  const q = join(PROVAS, d);
  if (statSync(q).isDirectory()) for (const f of readdirSync(q)) noDisco.push(`${d}/${f}`);
}
const textoDaProva = (p: string) => readFileSync(join(PROVAS, p), "utf8");
const lerDoLab = (f: string) => readFileSync(join(RAIZ, f), "utf8");

function historiaInteira(vizinho: string): void {
  const dir = join(RAIZ, "..", vizinho);
  if (!existsSync(join(dir, ".git"))) throw new Error(`falta o clone vizinho \`../${vizinho}\` ao lado do Lab`);
  const raso = execFileSync("git", ["-C", dir, "rev-parse", "--is-shallow-repository"]).toString().trim();
  if (raso === "true") {
    throw new Error(
      `o clone \`../${vizinho}\` é RASO: commit velho escrito numa prova não está nele, e a trava acusaria ` +
        `calado onde a prova escreve. Desrase-o (git -C ../${vizinho} fetch --unshallow origin) e rode de novo`,
    );
  }
}

/** O leitor de verdade: os trechos que são commit na história do vizinho, numa chamada só. */
function ehCommitDe(vizinho: string, trechos: string[]): string[] {
  historiaInteira(vizinho);
  const saida = execFileSync("git", ["-C", join(RAIZ, "..", vizinho), "cat-file", "--batch-check"], {
    input: trechos.map((t) => `${t}^{commit}`).join("\n") + "\n",
  })
    .toString()
    .trim()
    .split("\n");
  return trechos.filter((_, i) => !/missing|ambiguous/.test(saida[i] ?? "missing"));
}

const rodaDe = (f: string) => vizinhosQueRoda(f, RAIZ);

describe("as provas que rodam código de vizinho e o commit dele (LAB-198, D426)", () => {
  test("a lista de QUEM GRAVA fecha com o disco nos dois sentidos, e cada ferramenta nomeia a pasta", () => {
    const problemas = conferirAListaDeQuemGrava(QUEM_GRAVA, noDisco, (f) => existsSync(join(RAIZ, f)), lerDoLab);
    expect(problemas).toEqual([]);
    expect(QUEM_GRAVA.length).toBe(noDisco.length);
    expect(noDisco.length).toBeGreaterThan(0);
  });

  test("…e reprova pelo nome: prova sem linha, linha sem prova, ferramenta errada, null sem motivo", () => {
    const sem = QUEM_GRAVA.filter((l) => l.prova !== "LAB-48/violacoes-do-motor-padrao.json");
    expect(conferirAListaDeQuemGrava(sem, noDisco, () => true, lerDoLab).map((p) => p.tipo)).toEqual(["prova-sem-linha"]);
    const fantasma = [...QUEM_GRAVA, { prova: "LAB-999/nada.json", ferramenta: null, porque: "uma linha plantada de propósito na sabotagem" }];
    expect(conferirAListaDeQuemGrava(fantasma, noDisco, () => true, lerDoLab).map((p) => p.tipo)).toEqual(["linha-sem-prova"]);
    const trocada = QUEM_GRAVA.map((l) =>
      l.prova === "LAB-48/violacoes-do-motor-padrao.json" ? { ...l, ferramenta: "external-engines/esteira/ferramentas/lab47.ts" } : l,
    );
    const r = conferirAListaDeQuemGrava(trocada, noDisco, (f) => existsSync(join(RAIZ, f)), lerDoLab);
    expect(r.map((p) => [p.tipo, p.prova])).toEqual([["ferramenta-que-nao-nomeia-a-pasta", "LAB-48/violacoes-do-motor-padrao.json"]]);
    const mudo = QUEM_GRAVA.map((l) => (l.prova === "LAB-38/ci.json" ? { prova: l.prova, ferramenta: null } : l));
    expect(conferirAListaDeQuemGrava(mudo, noDisco, () => true, lerDoLab).map((p) => p.tipo)).toEqual(["null-sem-motivo"]);
  });

  test("o fecho dos import: `import type` não roda, apelido de fora é vizinho, o prefixo longo vence", () => {
    expect(importsDeExecucao(`import type { A } from "@generate/x.ts";`)).toEqual([]);
    expect(importsDeExecucao(`import { type A, type B } from "@generate/x.ts";`)).toEqual([]);
    expect(importsDeExecucao(`import { type A, b } from "@generate/x.ts";`)).toEqual(["@generate/x.ts"]);
    expect(importsDeExecucao(`export type { A } from "./a.ts";\nexport { b } from "./b.ts";`)).toEqual(["./b.ts"]);
    expect(importsDeExecucao(`// import { a } from "@testfit/a.ts";\nconst m = await import("./c.ts");`)).toEqual(["./c.ts"]);
    const ap = apelidosDoTsconfig(lerDoLab("external-engines/esteira/tsconfig.json"));
    expect(ap[ap.length - 1]!.prefixo).toBe("@/");
    expect(ap.map((a) => a.prefixo)).toContain("@generate/");
    // os dois lados, numa ferramenta de cada: a do LAB-48 roda os dois vizinhos; a do LAB-57 não roda nenhum
    expect(rodaDe("external-engines/esteira/ferramentas/lab48.ts")).toEqual([MOTOR, GENERATE]);
    expect(rodaDe("external-engines/esteira/ferramentas/lab57.ts")).toEqual([]);
    // ler arquivo do vizinho por CAMINHO não é rodá-lo: o LAB-60 lê a configuração do motor, sem import
    expect(rodaDe("external-engines/esteira/ferramentas/lab60.ts")).toEqual([]);
  });

  test("parecer commit não basta: tem de ser da história do vizinho", () => {
    expect(pareceCommit(`"a": "4181e95", "b": "1234567", "c": "abcdefa", "d": "4181e95x"`)).toEqual(["4181e95"]);
    // `ae4a164` é commit do Lab, não do Generate: não conta como commit do Generate
    expect(ehCommitDe(GENERATE, ["ae4a164", "5b7e9b4"])).toEqual(["5b7e9b4"]);
    expect(ehCommitDe(MOTOR, ["4181e95", "5b7e9b4"])).toEqual(["4181e95"]);
  });

  const conta = contarAsProvas(QUEM_GRAVA, rodaDe, textoDaProva, ehCommitDe);

  test("a conta de hoje bate com o retrato congelado, nos dois sentidos — e publica o universo", () => {
    expect(conferirOsCalados(conta, OS_CALADOS_DE_HOJE)).toEqual([]);
    const frase = comoSeDiz(noDisco.length, QUEM_GRAVA.filter((l) => l.ferramenta === null).length, conta, OS_ACHADOS_AO_LADO);
    console.log(`  ${frase}`);
    expect(frase).toContain(`${noDisco.length} provas`);
    expect(conta.length).toBeGreaterThan(0);
    // as que cumprem a regra do LAB-79 estão nomeadas, e a regra diz que só elas se regeram
    const cumprem = conta.filter((c) => c.cala.length === 0).map((c) => c.prova);
    expect(cumprem).toEqual(["LAB-76/registro-de-motores.json", "LAB-93/as-cinco-passagens.json", "LAB-94/o-preco-do-setimo.json"]);
    for (const c of conta) {
      expect(podeSerRegerada("estado-de-outro-repositorio", c.cala.length === 0).pode).toBe(c.cala.length === 0);
    }
  });

  test("sabotagem 1 · prova nova que roda vizinho e cala o commit: reprova pelo nome", () => {
    const semUma = { ...OS_CALADOS_DE_HOJE };
    delete semUma["LAB-48/violacoes-do-motor-padrao.json"];
    const r = conferirOsCalados(conta, semUma);
    expect(r.map((p) => [p.tipo, p.prova])).toEqual([["cala-e-nao-esta-na-lista", "LAB-48/violacoes-do-motor-padrao.json"]]);
  });

  test("sabotagem 2 · prova da lista que passa a escrever o commit: reprova pedindo para sair da lista", () => {
    const comCommit = (p: string) =>
      p === "LAB-48/violacoes-do-motor-padrao.json" ? `${textoDaProva(p)}\n{"motor": "4181e95", "generate": "5b7e9b4"}` : textoDaProva(p);
    const outra = contarAsProvas(QUEM_GRAVA, rodaDe, comCommit, ehCommitDe);
    const r = conferirOsCalados(outra, OS_CALADOS_DE_HOJE);
    expect(r.map((p) => [p.tipo, p.prova])).toEqual([["esta-na-lista-e-nao-cala-mais", "LAB-48/violacoes-do-motor-padrao.json"]]);
  });

  test("sabotagem 3 · um commit do LAB escrito na prova não a tira do retrato (não é do vizinho)", () => {
    const comLab = (p: string) => (p === "LAB-48/violacoes-do-motor-padrao.json" ? `${textoDaProva(p)}\n"9d28fd7"` : textoDaProva(p));
    expect(conferirOsCalados(contarAsProvas(QUEM_GRAVA, rodaDe, comLab, ehCommitDe), OS_CALADOS_DE_HOJE)).toEqual([]);
  });
});

describe("LAB-199 · os commits achados AO LADO da prova", () => {
  const ESTEIRA_ = join(import.meta.dirname, "..");
  const textoDoModulo = (m: string) => (existsSync(join(ESTEIRA_, m)) ? readFileSync(join(ESTEIRA_, m), "utf8") : null);

  test("cada achado é de uma prova do retrato, calando aquele vizinho, num módulo que existe e nomeia a prova", () => {
    expect(conferirOsAchadosAoLado(OS_ACHADOS_AO_LADO, OS_CALADOS_DE_HOJE, textoDoModulo)).toEqual([]);
    expect(Object.keys(OS_ACHADOS_AO_LADO).sort()).toEqual([
      "LAB-07/diagnostico-relevo.json",
      "LAB-07/diagnostico-relevo.txt",
      "LAB-07/ensaio-47ha.saida.json",
      "LAB-07/geo-antonina.saida.json",
      "LAB-07/lab01-50ha-ondulado.saida.json",
      "LAB-07/medicoes.json",
      "LAB-07/medir.txt",
      "LAB-18/contrato-v2.json",
      "LAB-30/guarda-da-ida.json",
      "LAB-37/testada-de-frente.json",
      "LAB-40/fixtures.json",
      "LAB-41/ortogonal-fora-da-gleba.json",
      "LAB-46/antonina-tres-amostragens.json",
      "LAB-48/violacoes-do-motor-padrao.json",
      "LAB-50/passagem-externa.json",
      "LAB-53/violacoes-depois-do-conserto-da-ponte.json",
      "LAB-54/frente-nao-atribuida.json",
      "LAB-55/via-sobre-a-faixa.json",
      "LAB-58/mecanismos-das-81.json",
      "LAB-59/contrafactual-de-antonina.json",
      "LAB-78/setimo-mecanismo.json",
    ]);
  });

  test("reprova pelo nome nos três defeitos plantados", () => {
    const tipos = (a: Record<string, Record<string, string>>) =>
      conferirOsAchadosAoLado(a, OS_CALADOS_DE_HOJE, textoDoModulo).map((p) => p.tipo);
    // o LAB-18 escreve o Generate: achado ao lado do Generate é de quem não cala
    expect(tipos({ "LAB-18/contrato-v2.json": { "urban-create-hub-41d93a4d": "src/retrato-do-lab18.ts" } })).toEqual(["achado-de-quem-nao-cala"]);
    expect(tipos({ "LAB-18/contrato-v2.json": { "motor-testfit": "src/nao-existe.ts" } })).toEqual(["achado-sem-modulo"]);
    expect(tipos({ "LAB-18/contrato-v2.json": { "motor-testfit": "src/fotografia-do-lab48.ts" } })).toEqual(["achado-que-nao-nomeia-a-prova"]);
  });

  test("a frase conta os achados contra os silêncios", () => {
    const conta: ProvaQueRodaVizinho[] = [
      { prova: "A/a.json", ferramenta: "f", roda: ["m", "g"], escreve: { m: [], g: [] }, cala: ["m", "g"] },
      { prova: "B/b.json", ferramenta: "f", roda: ["m"], escreve: { m: ["1234abc"] }, cala: [] },
    ];
    expect(comoSeDiz(3, 1, conta, { "A/a.json": { m: "x" } })).toEndWith("· achados ao lado: 1 de 2 silêncios");
    expect(comoSeDiz(3, 1, conta)).not.toContain("achados ao lado");
  });
});

describe("LAB-216 · os silêncios sem achado ao lado, e por que esperam (D444)", () => {
  const semAchado = osSilenciosSemAchado(OS_CALADOS_DE_HOJE, OS_ACHADOS_AO_LADO);

  test("a lista sai do retrato menos os achados — e cada uma espera o .wasm, perguntado à ferramenta", () => {
    expect(conferirOsQueEsperamOWasm(semAchado, QUEM_GRAVA, lerDoLab)).toEqual([]);
    const frase = comoSeDizOQueEspera(semAchado);
    console.log(`  ${frase}`);
    // o universo publicado, e não a faixa à mão "08 a 28": as que calam sem achado, uma a uma
    expect(frase).toBe(
      "sem achado ao lado: 34 silêncios em 20 provas (LAB-02, 04, 05, 06, 08, 13, 16, 17, 19, 21, 23, 24, 25, 26, 28, 32), e todas esperam o .wasm",
    );
    // fecha com a conta da trava: silêncios do retrato = achados + sem achado
    const silencios = Object.values(OS_CALADOS_DE_HOJE).reduce((n, v) => n + v.length, 0);
    const achados = Object.values(OS_ACHADOS_AO_LADO).reduce((n, v) => n + Object.keys(v).length, 0);
    expect(semAchado.reduce((n, s) => n + s.vizinhos.length, 0)).toBe(silencios - achados);
  });

  // a porta escrita em pedaços: este arquivo não carrega o .wasm, e a régua do LAB-187 conta quem a escreve inteira
  const PORTA = ["Motor", "carregar("].join(".");
  test("a porta do .wasm em código: comentário e outro nome não contam", () => {
    expect(carregaOWasm(`const wasm = await ${PORTA}readFileSync(WASM));`)).toBe(true);
    expect(carregaOWasm(`// const wasm = await ${PORTA}x);\nconst y = 1;`)).toBe(false);
    expect(carregaOWasm(`/* ${PORTA}x) */ carregarMotor(x);`)).toBe(false);
  });

  test("sabotagem · silêncio sem achado numa ferramenta que não carrega o .wasm: reprova pelo nome", () => {
    // a do LAB-08 com a carga tirada: ela rodaria aqui, e "espera o .wasm" seria trabalho deixado na mesa
    const semCarga = (f: string) => (f.endsWith("/lab08.ts") ? lerDoLab(f).replace(/Motor\.carregar\(/g, "carregar(") : lerDoLab(f));
    expect(conferirOsQueEsperamOWasm(semAchado, QUEM_GRAVA, semCarga).map((p) => [p.tipo, p.prova])).toEqual([
      ["silencio-sem-achado-que-nao-espera-o-wasm", "LAB-08/medicoes.json"],
    ]);
    // e prova sem ferramenta no silêncio também reprova (não há o que esperar)
    const lista = QUEM_GRAVA.map((l) => (l.prova === "LAB-32/aderencia.json" ? { prova: l.prova, ferramenta: null, porque: "plantado na sabotagem, de propósito" } : l));
    expect(conferirOsQueEsperamOWasm(semAchado, lista, lerDoLab).map((p) => p.prova)).toEqual(["LAB-32/aderencia.json"]);
  });

  test("um achado novo encolhe a lista: a frase não é escrita, é contada", () => {
    const mais = { ...OS_ACHADOS_AO_LADO, "LAB-08/medicoes.json": { [MOTOR]: "x", [GENERATE]: "x" } };
    expect(comoSeDizOQueEspera(osSilenciosSemAchado(OS_CALADOS_DE_HOJE, mais))).toStartWith("sem achado ao lado: 32 silêncios em 19 provas (LAB-02, 04, 05, 06, 13,");
  });
});
