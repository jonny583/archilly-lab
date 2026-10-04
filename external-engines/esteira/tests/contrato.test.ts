/**
 * A ETIQUETA DO CONTRATO SAI DO MEDIDO. (LAB-43)
 *
 * ```sh
 * bun test tests/contrato.test.ts
 * ```
 *
 * # O defeito que estas travas impedem
 *
 * O §7 manda toda prova de medição trazer a **versão do contrato**. Até o LAB-43 esse
 * valor era **escrito à mão** em catorze ferramentas — e em quatro delas estava
 * **errado**: `lab25`, `lab26`, `lab28` e `lab30` publicavam `"2"` quando **todas** as
 * glebas que elas medem declaram `"1"`, e **entrada nenhuma** do repositório é `"2"`
 * (D146).
 *
 * **A guarda do §7 não pegava, e o motivo importa:** ela confere que a chave `contrato`
 * **existe**, nunca que ela **corresponde ao medido**. Chave presente com valor errado
 * passa — é medir ortografia, não conteúdo, a mesma forma do D137.
 *
 * # Por que a trava é sobre a FERRAMENTA, e não sobre a prova
 *
 * Conferir uma prova publicada contra as glebas que ela mediu exigiria saber **quais**
 * glebas cada prova mediu, e isso nem sempre está no arquivo. A causa, porém, é
 * verificável de forma estática: **nenhuma ferramenta deve escrever o literal**. Quem
 * escreve a etiqueta é a entrada.
 *
 * As ferramentas antigas, cujas provas **não foram regeradas** (D118: prova congelada não
 * se regera para consertar etiqueta), ficam numa **lista declarada** — e a lista se
 * revalida: cada literal dela tem de ser igual à versão que **todas** as entradas do
 * repositório declaram. No dia em que entrar uma entrada `"2"`, a lista reprova e cada
 * caso vira decisão, em vez de envelhecer em silêncio.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { VERSOES_LIDAS, contratoDasEntradas } from "../src/gleba-v1.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FERRAMENTAS = join(import.meta.dirname, "..", "ferramentas");
const FIXTURES = join(RAIZ, "docs", "fixtures");

/**
 * O arquivo SEM comentários — e esta função existe por um erro meu, no próprio LAB-43.
 *
 * A primeira versão destas travas casou `/contrato: "\d+"/` no texto cru e **reprovou
 * `lab25.ts`, que eu acabara de consertar** — porque o comentário que explica o conserto
 * **cita** `const CONTRATO = "2"` para dizer que era isso que estava ali.
 *
 * **É a terceira vez da mesma sub-família:** o D137 (a régua exigia a chave `"gleba"`
 * literal), o D142 (a régua leu a menção de `@generate/` em vez do `import`) e esta. A
 * lição não muda: **procure o nome no lugar da gramática onde ele significa aquilo** — e
 * comentário é onde um nome significa *"eu estou falando sobre"*, não *"eu faço"*.
 */
function semComentarios(texto: string): string {
  return texto.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");
}

/** Toda entrada de contrato guardada no repositório, com o caminho. */
function todasAsEntradas(): { onde: string; versao: string }[] {
  const achadas: { onde: string; versao: string }[] = [];
  const andar = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) andar(p);
      else if (e.name.endsWith(".entrada.json")) {
        const d = JSON.parse(readFileSync(p, "utf8")) as { archilly?: { versao?: string } };
        if (d.archilly?.versao) achadas.push({ onde: p.slice(RAIZ.length + 1), versao: d.archilly.versao });
      }
    }
  };
  andar(FIXTURES);
  // As glebas sintéticas não são arquivo de entrada: nascem do `glebaDoLab`, que lê
  // GeoJSON. Elas entram pela função, que é onde a versão delas é declarada.
  for (const nome of ["completo", "pequeno", "sintetico-50ha-ondulado", "sintetico-10ha-plano"]) {
    achadas.push({ onde: `glebaDoLab("${nome}")`, versao: glebaDoLab(nome).archilly.versao });
  }
  return achadas;
}

describe("a versão do contrato que o repositório de fato tem", () => {
  test("TODA entrada declara a mesma versão, e a esteira a lê", () => {
    const entradas = todasAsEntradas();
    expect(entradas.length, "nenhuma entrada encontrada — a varredura quebrou").toBeGreaterThan(5);
    const versoes = [...new Set(entradas.map((e) => e.versao))];
    expect(
      versoes,
      `as entradas declaram versões diferentes: ${JSON.stringify(entradas)}`,
    ).toEqual(["1"]);
    expect(VERSOES_LIDAS as readonly string[]).toContain(versoes[0]!);
  });

  test("`contratoDasEntradas` tira a etiqueta do medido, e REPROVA conjunto misto", () => {
    expect(contratoDasEntradas([{ archilly: { versao: "1" } }])).toBe("1");
    expect(contratoDasEntradas([{ archilly: { versao: "2" } }])).toBe("2");
    // Misto reprova em vez de eleger a primeira: duas versões numa prova só
    // esconderiam uma delas.
    expect(() =>
      contratoDasEntradas([{ archilly: { versao: "1" } }, { archilly: { versao: "2" } }]),
    ).toThrow(/contratos diferentes/);
    expect(() => contratoDasEntradas([])).toThrow(/nenhuma entrada/);
    // E versão que esta esteira não lê também reprova.
    expect(() => contratoDasEntradas([{ archilly: { versao: "9" } }])).toThrow(/não lê/);
  });
});

describe("nenhuma ferramenta NOVA escreve o literal do contrato", () => {
  /**
   * As ferramentas que ainda escrevem o literal, com a prova NÃO regerada.
   *
   * **Conjunto fechado e revalidado:** o valor de cada uma tem de ser igual à versão
   * que todas as entradas declaram, e nenhuma ferramenta nova pode entrar. Regerar
   * prova congelada só para consertar etiqueta é o que o D118 proíbe — então o valor
   * fica aqui, conferido, em vez de perdido.
   */
  const AINDA_COM_LITERAL: Record<string, string> = {
    "lab02.ts": "prova de 14/09, não regerada (D118)",
    "lab03.ts": "prova de 14/09, não regerada (D118)",
    "lab04.ts": "oráculo de geometria, não mede gleba — a etiqueta é decorativa ali",
    "lab05.ts": "prova de 15/09, não regerada (D118)",
    "lab08.ts": "prova de 14/09, não regerada (D118)",
    "lab13.ts": "prova de 19/09, não regerada (D118)",
    "lab16.ts": "prova de 20/09, não regerada (D118)",
    "lab17.ts": "prova de 20/09, não regerada (D118)",
    "lab19.ts": "a tabela: o literal ACERTA, e a regeração dela é o LAB-45",
    "lab21.ts": "prova de 03/10, não regerada (D118)",
    "lab24.ts": "prova de 03/10, não regerada (D118)",
    "lab32.ts": "prova de 04/10, não regerada (D118)",
    "lab37.ts": "prova de 04/10, não regerada (D118)",
  };

  const comLiteral = () => {
    const achadas: Record<string, string[]> = {};
    for (const f of readdirSync(FERRAMENTAS).filter((x) => x.endsWith(".ts"))) {
      // Sem comentários, de propósito: o que interessa é o que a ferramenta ESCREVE
      // na prova, não o que o comentário dela menciona (ver `semComentarios`).
      const vs = [
        ...semComentarios(readFileSync(join(FERRAMENTAS, f), "utf8")).matchAll(
          /contrato: "(\d+)"/g,
        ),
      ].map((m) => m[1]!);
      if (vs.length) achadas[f] = vs;
    }
    return achadas;
  };

  test("as QUATRO que estavam erradas agora derivam a etiqueta da entrada", () => {
    for (const f of ["lab25.ts", "lab26.ts", "lab28.ts", "lab30.ts"]) {
      const fonte = semComentarios(readFileSync(join(FERRAMENTAS, f), "utf8"));
      expect(fonte, `${f} tem de usar a conta única`).toContain("contratoDasEntradas(");
      expect(fonte, `${f} voltou a escrever o literal`).not.toMatch(/contrato: "\d+"/);
      expect(fonte, `${f} não pode ter o CONTRATO literal de volta`).not.toMatch(
        /const CONTRATO = "\d+"/,
      );
    }
  });

  test("a lista das que ainda escrevem literal é FECHADA e não cresce", () => {
    const achadas = Object.keys(comLiteral()).sort();
    expect(
      achadas,
      "ferramenta nova escrevendo o literal do contrato: use `contratoDasEntradas`",
    ).toEqual(Object.keys(AINDA_COM_LITERAL).sort());
  });

  test("todo literal da lista é igual à versão que as entradas declaram", () => {
    // É o que faz a lista se revalidar: no dia em que entrar uma entrada `"2"`, isto
    // reprova e cada caso vira decisão, em vez de envelhecer em silêncio.
    const aVersao = [...new Set(todasAsEntradas().map((e) => e.versao))][0]!;
    const errados: string[] = [];
    for (const [f, vs] of Object.entries(comLiteral())) {
      for (const v of vs) if (v !== aVersao) errados.push(`${f}: "${v}" (as entradas são "${aVersao}")`);
    }
    expect(errados, "literal de contrato que não corresponde ao que o repositório mede").toEqual([]);
  });

  test("toda exceção tem motivo escrito, e não é motivo vazio", () => {
    for (const [f, motivo] of Object.entries(AINDA_COM_LITERAL)) {
      expect(motivo.length, `${f}: exceção sem motivo é exceção sem revisão`).toBeGreaterThan(20);
    }
  });
});

describe("as quatro provas regeradas trazem a etiqueta certa", () => {
  test("LAB-25, LAB-26, LAB-28 e LAB-30 declaram o contrato que mediram", () => {
    const aVersao = [...new Set(todasAsEntradas().map((e) => e.versao))][0]!;
    for (const [rel] of [
      ["LAB-25/guarda-da-ponte.json"],
      ["LAB-26/varredura.json"],
      ["LAB-28/acesso.json"],
      ["LAB-30/guarda-da-ida.json"],
    ]) {
      const d = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", rel!), "utf8")) as {
        contrato?: string;
      };
      expect(d.contrato, `${rel}: a etiqueta do contrato`).toBe(aVersao);
    }
  });
});
