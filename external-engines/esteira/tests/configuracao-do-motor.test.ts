/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-60 · As travas da leitura da configuração do motor.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Três coisas aqui podem apodrecer, e cada uma tem trava:
 *
 * 1. **a §4** — este prompt lê o clone do vizinho, e a prova tem de registrar que os três
 *    ficaram **limpos**. Trava que só leia o relatório não serve: ela lê a PROVA, que sai
 *    da ferramenta;
 * 2. **o escopo** — *"não achei"* só vale alguma coisa com o número do que foi olhado ao
 *    lado (D164). Então a prova declara arquivos, linhas e chaves, e a trava exige que o
 *    que ficou fora esteja **nomeado**;
 * 3. **a limpeza** — a `semComentarios` passou a ser um varredor por causa deste prompt, e
 *    o caso que a quebrou é um **glob dentro de string**. Esse caso tem trava sintética, e
 *    é a mais importante do arquivo: sem ela, a régua volta a dar zero por cegueira.
 *
 * E uma quarta, que é de honestidade: **a lista numerada tem de dizer o que NÃO é item.**
 * Mandar ao vizinho quatro desligadores que têm motivo medido seria acusar sem medir.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { REGRAS_DE_CONFIGURACAO, varrerConfiguracao } from "../src/varredura-de-configuracao.ts";
import { semComentarios } from "../src/varredura-de-chamadas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-60", "configuracao-do-motor.json");

type Prova = {
  oClone: { caminho: string; head: string; ehSomenteLeitura: string };
  escopo: Record<string, number | string>;
  aReguaEhAMESMA: { qual: string; porque: string; oQueAVIAGEMCONSERTOU: string[] };
  oLintDele: { script: string; reprovaAviso: boolean };
  temCI: boolean;
  regras: { nome: string; forma: string; achados: number }[];
  totalPorRegra: Record<string, number>;
  totalPorForma: Record<string, number>;
  porArquivo: { arquivo: string; varrido: boolean; porqueFora?: string }[];
  achados: { regra: string; arquivo: string; linha: number; trecho: string }[];
  oTsconfigEnumerado: {
    doMotor: { arquivo: string; chaves: number; afrouxam: { chave: string; valor: unknown }[]; naoClassificadas: unknown[] }[];
    desteRepositorio: { arquivo: string; chaves: number; afrouxam: { chave: string; valor: unknown }[] }[];
  };
  osDesligadoresPorArquivo: { quantos: number; viramItem: number; lista: { arquivo: string; ehItemDeConserto: boolean }[] };
  aListaNumeradaParaOMotor: { numero: number; forma: string; oQue: string; oQueIssoSignificaNaPratica: string; oConserto: string }[];
  osClonesVizinhos: { clone: string; presente: boolean; alteracoes: number | null; head: string | null }[];
};
const prova = JSON.parse(readFileSync(PROVA, "utf8")) as Prova;

describe("LAB-60 · a §4: o clone do vizinho ficou LIMPO, e a prova registra", () => {
  test("zero alterações em todos os clones presentes", () => {
    const presentes = prova.osClonesVizinhos.filter((c) => c.presente);
    expect(presentes.length).toBeGreaterThan(0);
    for (const c of presentes) {
      expect(c.alteracoes, `${c.clone} saiu com alteração — a §4 proíbe escrever no vizinho`).toBe(0);
      expect(c.head).toBeTruthy();
    }
  });

  test("a prova DECLARA que a leitura foi só leitura, e qual commit foi lido", () => {
    expect(prova.oClone.ehSomenteLeitura).toContain("sim");
    expect(prova.oClone.head).toMatch(/^[0-9a-f]{40}$/);
  });

  test("a lista numerada NÃO contém conserto feito por mim — só o que o motor faria", () => {
    for (const i of prova.aListaNumeradaParaOMotor) {
      expect(i.oConserto.length, `item ${i.numero} sem conserto proposto`).toBeGreaterThan(0);
      expect(i.oQueIssoSignificaNaPratica.length).toBeGreaterThan(40);
    }
  });
});

describe("LAB-60 · o escopo sai como NÚMERO, e o que ficou fora é nomeado", () => {
  test("os números do escopo existem e não são zero", () => {
    for (const campo of [
      "arquivosQueOGitDeleCarrega",
      "configuracoesEncontradas",
      "configuracoesVarridas",
      "linhasDeConfiguracaoLidas",
      "arquivosDeCodigoVarridos",
      "linhasDeCodigoLidas",
      "chavesDeCompilerOptionsExaminadas",
      "regras",
    ]) {
      expect(Number(prova.escopo[campo]), `escopo.${campo}`).toBeGreaterThan(0);
    }
  });

  test("toda configuração encontrada está varrida OU nomeada com o motivo", () => {
    for (const l of prova.porArquivo) {
      if (l.varrido) continue;
      expect(l.porqueFora, `${l.arquivo} ficou fora sem motivo escrito`).toBeTruthy();
      expect(l.porqueFora!.length).toBeGreaterThan(30);
    }
    const varridos = prova.porArquivo.filter((l) => l.varrido).length;
    expect(varridos).toBe(Number(prova.escopo["configuracoesVarridas"]));
  });

  test("as contagens por regra são as da lista de achados, não números à parte", () => {
    const contado: Record<string, number> = {};
    for (const a of prova.achados) contado[a.regra] = (contado[a.regra] ?? 0) + 1;
    expect(prova.totalPorRegra).toEqual(contado);
    for (const r of prova.regras) expect(r.achados).toBe(contado[r.nome] ?? 0);
    expect(prova.regras.map((r) => r.nome)).toEqual(REGRAS_DE_CONFIGURACAO.map((r) => r.nome));
  });

  test("a enumeração do tsconfig é EXAUSTIVA: nada booleano fica sem classificação", () => {
    for (const t of prova.oTsconfigEnumerado.doMotor) {
      expect(t.chaves).toBeGreaterThan(0);
      // `naoClassificadas` pode ter itens — o que não pode é ela não existir.
      expect(Array.isArray(t.naoClassificadas)).toBe(true);
    }
  });
});

describe("LAB-60 · a LIMPEZA, e o caso que a quebrou — a trava mais importante daqui", () => {
  /**
   * O glob dentro de string. Um padrão de arquivo com duas estrelas e barra traz a
   * sequência de **abre-comentário**, e um que termine em estrela-barra traz a de
   * **fecha** — e a limpeza antiga apagava **tudo no meio**, inclusive o bloco `rules`.
   * O texto do caso é montado em pedaços, abaixo, para este próprio arquivo não ser o
   * caso que ele mede.
   */
  const ABRE = "/" + "*";
  const FECHA = "*" + "/";
  //
  // **A ORDEM IMPORTA, e a primeira versão desta trava errou nela.** Sob a sabotagem que
  // devolve a limpeza antiga, o texto abaixo tem de REPROVAR — e a primeira versão
  // passava, porque eu havia posto o bloco `rules` DEPOIS do segundo glob, fora da região
  // que a regex comia. No arquivo do motor a ordem é: glob com abre, `rules`, glob com
  // fecha. *Trava que passa quando o defeito volta é enfeite* (D172).
  const comGlob =
    'export default [\n' +
    '  { files: ["**' + ABRE + '.{ts,tsx}"],\n' +
    '    rules: { "no-undef": "off", "x/y": ["warn", {}] } },\n' +
    '  { files: ["scripts/**' + ABRE + '.ts"] },\n' +
    "];\n";

  test("o glob NÃO é confundido com comentário: as duas regras sobrevivem à limpeza", () => {
    const limpo = semComentarios(comGlob);
    expect(limpo).toContain('"no-undef": "off"');
    expect(limpo).toContain('["warn"');
  });

  test("e a varredura ACHA as duas nesse texto — era zero antes do LAB-60", () => {
    const { achados } = varrerConfiguracao(comGlob, "eslint.config.js", { lintReprovaAviso: false });
    const regras = achados.map((a) => a.regra);
    expect(regras).toContain("regra-em-off");
    expect(regras).toContain("regra-em-warn");
  });

  test("comentário de verdade continua saindo, e a NOVA LINHA fica (o número da linha não mente)", () => {
    const t = 'a\n' + ABRE + ' tirado\nainda tirado ' + FECHA + '\n"no-undef": "off"\n';
    const limpo = semComentarios(t);
    expect(limpo).not.toContain("tirado");
    expect(limpo).toContain('"no-undef": "off"');
    expect(limpo.split("\n").length).toBe(t.split("\n").length);
  });

  test("comentário de linha sai, e `https://` não é confundido com ele", () => {
    const t = '// fora\nconst u = "https://x/y";\n';
    const limpo = semComentarios(t);
    expect(limpo).not.toContain("fora");
    expect(limpo).toContain("https://x/y");
  });

  test("a string PRESERVA o conteúdo — é o que separa esta limpeza da `soOCodigo`", () => {
    expect(semComentarios('const s = "' + ABRE + ' isto é string ' + FECHA + '";')).toContain("isto é string");
  });

  test("a prova DECLARA o que a viagem consertou na régua", () => {
    expect(prova.aReguaEhAMESMA.oQueAVIAGEMCONSERTOU.length).toBeGreaterThanOrEqual(2);
    expect(prova.aReguaEhAMESMA.oQueAVIAGEMCONSERTOU.join(" ")).toContain("off");
  });
});

describe("LAB-60 · as três formas, medidas no motor", () => {
  test("as três formas da varredura têm regra que as persegue", () => {
    const formas = new Set(REGRAS_DE_CONFIGURACAO.map((r) => r.forma));
    expect([...formas].sort()).toEqual(["desligada", "nao-pode-reprovar", "sem-motivo-escrito"]);
  });

  test("o par do `regra-em-warn` é MEDIDO no package.json dele, não presumido", () => {
    expect(prova.oLintDele.script).toContain("eslint");
    expect(prova.oLintDele.reprovaAviso).toBe(/--max-warnings\s+0/.test(prova.oLintDele.script));
  });

  test("os desligadores por arquivo saem CLASSIFICADOS antes de virarem item", () => {
    const d = prova.osDesligadoresPorArquivo;
    expect(d.lista).toHaveLength(d.quantos);
    expect(d.lista.filter((x) => x.ehItemDeConserto)).toHaveLength(d.viramItem);
  });
});
