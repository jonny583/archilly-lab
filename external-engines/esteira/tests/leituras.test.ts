/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A FAMÍLIA DAS LEITURAS — "esta linha afirma ou só mostra?" (item 014, D259)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ```sh
 * bun test
 * ```
 *
 * O LAB-80 contou **cinco** respostas para a mesma pergunta nesta casa, três dentro de travas, e
 * **nenhuma conhecia o bloco de código** — que é onde moram os recados.
 *
 * > **Cinco respostas para a mesma pergunta não são cinco réguas: são uma régua que ninguém
 * > terminou.**
 *
 * **Terminar não era fazer as cinco iguais.** O item 014 pôs a fronteira — *"cinco iguais por
 * conveniência é pior que quatro iguais e uma declarada"* —, e a medição encontrou exatamente uma
 * que precisa ser diferente. As travas abaixo seguem **a ordem da Central**: primeiro que cada
 * régua **continua achando o que achava**, depois que **deixou de achar o que não devia**. *Na
 * ordem inversa, um desligamento passa por conserto.*
 */

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_LEITURAS,
  conferirAsLeituras,
  lugaresDaPagina,
  semCitacoes,
  semRiscadoNemCitado,
  soAProsa,
} from "../src/texto-das-regras.ts";
import { soOsNomesUsados } from "../src/varredura-de-chamadas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (rel: string): string => readFileSync(join(RAIZ, rel), "utf8");

/** A mentira que o LAB-51 existe para pegar, e a citação dela que tem de passar. */
const A_MENTIRA = "# Não há CI neste repositório (não existe `.github/workflows/verde.yml`)";
const A_CITACAO = '# O cabeçalho dizia *"não existe `.github/workflows`"* — falso desde o LAB-38';

/** O que a trava do LAB-51 de fato faz: achar o caminho DENTRO da crase, na linha que nega. */
function caminhosNaNegacao(linha: string, limpeza: (t: string) => string): string[] {
  const limpa = limpeza(linha);
  if (!/não existe|não há/i.test(limpa)) return [];
  return [...limpa.matchAll(/`([^`]+)`/g)].map((m) => m[1]!);
}

describe("a ordem da Central — PRIMEIRO que ela continua achando", () => {
  test("`semCitacoes` acha o caminho na mentira — é o caso do LAB-51", () => {
    expect(caminhosNaNegacao(A_MENTIRA, semCitacoes)).toEqual([".github/workflows/verde.yml"]);
  });

  test("`soAProsa` não encurta o texto — o número da linha não pode mentir", () => {
    const pagina = "prosa um\n> citada\n```\ndentro\n```\nprosa dois";
    expect(soAProsa(pagina).split("\n")).toHaveLength(pagina.split("\n").length);
    expect(soAProsa(pagina).split("\n")[0]).toBe("prosa um");
    expect(soAProsa(pagina).split("\n")[5]).toBe("prosa dois");
  });
});

describe("a ordem da Central — DEPOIS que ela deixou de achar o que não devia", () => {
  test("`semCitacoes` não acha nada na CITAÇÃO da mentira", () => {
    expect(caminhosNaNegacao(A_CITACAO, semCitacoes)).toEqual([]);
  });

  test("`soAProsa` esvazia citação e bloco de código, e só eles", () => {
    const pagina = "afirmo\n> cito\n```\nmostro\n```\nafirmo de novo";
    const linhas = soAProsa(pagina).split("\n");
    expect(linhas).toEqual(["afirmo", "", "", "", "", "afirmo de novo"]);
  });
});

/**
 * ── A UMA QUE É DIFERENTE, E A DIFERENÇA SAI MEDIDA ─────────────────────────
 *
 * O item 014 manda parar na fronteira se alguma leitura **precisa** ser diferente, e escrever o
 * motivo ao lado dela. Esta é a prova de que ela precisa — não a opinião de que precisa.
 */
describe("a UMA declarada como diferente, e por que (item 014)", () => {
  test("a limpeza mais forte CEGA a trava do LAB-51 no caso exato dela", () => {
    // Ela nega nos dois casos: até aqui as duas limpezas empatam...
    expect(/não existe|não há/i.test(semRiscadoNemCitado(A_MENTIRA))).toBe(true);
    // ...mas o DADO desta trava é o caminho entre crases, e a mais forte tira a crase.
    expect(
      caminhosNaNegacao(A_MENTIRA, semRiscadoNemCitado),
      "a `semRiscadoNemCitado` passou a preservar a crase — a UMA declarada perdeu o motivo, e a tabela tem de ser refeita",
    ).toEqual([]);
  });

  test("a leitura de Markdown é um NADA num script de shell — 0 de 147", () => {
    const script = ler("external-engines/conferir.sh");
    const lugares = lugaresDaPagina(script);
    expect(lugares.length).toBeGreaterThan(100);
    expect(lugares.filter((l) => l !== "prosa"), "um `.sh` ganhou citação ou cerca de Markdown").toEqual([]);
  });
});

describe("a tabela das leituras bate com os `import` de verdade", () => {
  test("zero problemas — cada instrumento importa a leitura que a tabela declara", () => {
    const problemas = conferirAsLeituras(ler);
    expect(problemas, problemas.join("\n")).toEqual([]);
  });

  test("a tabela cobre as SEIS leituras, e cada entrada diz por que não a vizinha", () => {
    expect(AS_LEITURAS.length).toBeGreaterThanOrEqual(6);
    expect(new Set(AS_LEITURAS.map((l) => l.instrumento)).size).toBe(AS_LEITURAS.length);
  });

  test("a régua da tabela REPROVA de verdade — instrumento que não importa o que diz importar", () => {
    const mentirosa = conferirAsLeituras((rel) =>
      rel.endsWith("verde.test.ts") ? "// nenhum import aqui\n" : ler(rel),
    );
    expect(mentirosa.join(" ")).toContain("verde.test.ts");
    const inexistente = conferirAsLeituras((rel) => {
      if (rel.endsWith("moldura.test.ts")) throw new Error("sumiu");
      return ler(rel);
    });
    expect(inexistente.join(" ")).toContain("moldura.test.ts");
  });
});

/**
 * ── A GUARDA QUE IMPEDE A SEXTA DE NASCER ───────────────────────────────────
 *
 * O problema do D259 não foi uma leitura errada: foi **uma leitura nova nascendo dentro de cada
 * trava que precisava dela**. Unificar sem esta guarda conserta o passado e deixa o futuro igual.
 *
 * A régua lê **os nomes que o código USA** (`soOsNomesUsados`), não o texto: um comentário que
 * *cite* `semCitacoes` ao explicar onde ela mora não é uma definição nova (D257).
 */
describe("nenhuma leitura nova nasce fora do lugar único", () => {
  const CASA = "external-engines/esteira/src/texto-das-regras.ts";
  const NOMES = ["semCitacoes", "semRiscadoNemCitado", "soAProsa", "lugaresDaPagina", "comoARegraSeLe"];

  test("as leituras são DEFINIDAS só em `texto-das-regras.ts`", () => {
    const arquivos = execFileSync("git", ["ls-files", "*.ts"], { cwd: RAIZ, encoding: "utf8", maxBuffer: 64e6 })
      .split("\n")
      .filter((f) => f.trim() !== "" && f !== CASA);
    const forasteiras: string[] = [];
    for (const f of arquivos) {
      const usado = soOsNomesUsados(ler(f));
      for (const nome of NOMES) {
        // Definição é `const nome =` ou `function nome(`. `import`, chamada e re-export não são.
        if (new RegExp(String.raw`\b(?:const|let|var)\s+${nome}\s*=|\bfunction\s+${nome}\s*\(`).test(usado)) {
          forasteiras.push(`${f} define \`${nome}\` — a leitura mora em ${CASA} (D259)`);
        }
      }
    }
    expect(forasteiras, forasteiras.join("\n")).toEqual([]);
  });

  test("a guarda da sexta REPROVA de verdade, plantada", () => {
    const plantado = soOsNomesUsados('const semCitacoes = (t: string) => t.replace(/x/g, " ");');
    expect(/\b(?:const|let|var)\s+semCitacoes\s*=/.test(plantado)).toBe(true);
    // E o que ela NÃO pega: importar, chamar, e citar o nome num comentário.
    for (const bom of [
      'import { semCitacoes } from "../src/texto-das-regras.ts";',
      "const limpa = semCitacoes(linha);",
      "// a `semCitacoes` mora em texto-das-regras.ts",
      'export { soAProsa } from "./texto-das-regras.ts";',
    ]) {
      expect(/\b(?:const|let|var)\s+semCitacoes\s*=|\bfunction\s+semCitacoes\s*\(/.test(soOsNomesUsados(bom)), bom).toBe(false);
    }
  });
});

/**
 * ── DOIS ITENS NÃO PODEM DIVIDIR UM NÚMERO (D273) ───────────────────────────
 *
 * O número é a IDENTIDADE de um item da caixa — é por ele que as travas o acham, justamente porque
 * o NOME muda quando o item é concluído (D252). No LAB-82 o chat escreveu um item novo como
 * `013.md` com o `013-FEITO.md` já no disco, e a `main` ficou **vermelha**.
 *
 * **Mas ela só ficou vermelha porque uma trava PERGUNTAVA pelo `013`.** A guarda do D268 estoura
 * quando alguém busca o número colidido; uma colisão num número que ninguém busca **passaria em
 * silêncio** — e passaria até o dia em que o item fosse concluído e não houvesse nome livre para
 * ele.
 *
 * > **Guarda que depende de alguém perguntar pelo caso não cobre o caso: cobre a pergunta.** Esta
 * > varre a pasta inteira e não espera pergunta nenhuma.
 */
describe("a caixa de entrada não tem número repetido (D273)", () => {
  const CAIXA = join(RAIZ, "docs", "caixa-de-entrada");

  /** O número de um item, do nome do arquivo: `013.md`, `013-FEITO.md` e `010-adendo.md` → `013`, `013`, `010-adendo`. */
  const numeroDe = (nome: string): string | null => {
    const m = /^(\d{3}(?:-adendo)?)(?:-FEITO)?\.md$/.exec(nome);
    return m ? m[1]! : null;
  };

  test("cada número aparece UMA vez, feito ou aberto", () => {
    const porNumero = new Map<string, string[]>();
    for (const nome of readdirSync(CAIXA)) {
      const n = numeroDe(nome);
      if (n === null) continue;
      porNumero.set(n, [...(porNumero.get(n) ?? []), nome]);
    }
    const repetidos = [...porNumero.entries()]
      .filter(([, arquivos]) => arquivos.length > 1)
      .map(([n, arquivos]) => `${n}: ${arquivos.join(" e ")}`);
    expect(
      repetidos,
      "dois itens dividem um número — eles não são um item com dois nomes, são dois itens com uma " +
        "identidade. Mova o mais novo para o próximo número livre, com o conteúdo intocado (D273):\n" +
        repetidos.join("\n"),
    ).toEqual([]);
    // E a varredura achou os itens de verdade: zero de zero não é aprovação.
    expect(porNumero.size).toBeGreaterThan(10);
  });

  test("a régua do número repetido REPROVA de verdade, e sabe ler o adendo", () => {
    expect(numeroDe("013.md")).toBe("013");
    expect(numeroDe("013-FEITO.md")).toBe("013");
    expect(numeroDe("010-adendo-FEITO.md")).toBe("010-adendo");
    // O adendo NÃO colide com o item: são dois objetos, e o nome diz isso.
    expect(numeroDe("010-FEITO.md")).not.toBe(numeroDe("010-adendo-FEITO.md"));
    // E o que não é item não entra na conta.
    expect(numeroDe("COMO_FUNCIONA.md")).toBeNull();
  });
});
