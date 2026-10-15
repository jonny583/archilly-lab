/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NÚMERO DO ITEM DA CAIXA NÃO TEM TETO DE CASAS. (LAB-113, item 030, D340)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A convenção respondida pela direção no item 030: **três casas no mínimo, sem teto**; o **`900` é
 * reservado** (a *"lista própria"*, nunca `-FEITO`); e *"o menor ainda não feito"* é comparação
 * **numérica**. O motivo inteiro está no cabeçalho de `src/numero-do-item.ts`.
 *
 * O que estas travas cobram, nos dois sentidos:
 *
 * - a forma única aceita três, quatro e mais casas, com os sufixos que existem, e recusa `09.md`;
 * - os três casos que o item mandou: `1000.md` ao lado do `030.md` (o menor é o `030`); `900.md`
 *   sozinho (caixa sem item da direção); `09.md` (fora da forma) — e as formas velhas, reproduzidas
 *   aqui, erravam os dois primeiros (o caso ruim fica demonstrado, não lembrado);
 * - a ordem é de fila, nunca de texto, e o reservado só é o próximo quando não há outro;
 * - o histórico sai igual: na caixa de hoje, todo nome que a forma velha lia sai com o mesmo
 *   número e a mesma identidade;
 * - nenhum `.ts` versionado em `external-engines/` que fale da caixa volta a ler o número com teto
 *   no CÓDIGO, fora das exceções declaradas — e exceção que não o tem mais reprova.
 *
 * Lê só arquivo deste repositório e não importa clone: vai no portão sem clones.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { aCaixaEstavaVazia, ehItemAberto, numeroDoItem } from "../src/caixa-vazia-era-verdade.ts";
import {
  EXCECOES_DE_TETO_NO_ITEM,
  ITEM_DA_CAIXA,
  ITEM_RESERVADO,
  conferirTetoNoItem,
  itensEmOrdem,
  larguraDosAlgarismos,
  lerNomeDoItem,
  proximoItem,
  tetoNoItemDoCodigo,
} from "../src/numero-do-item.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CAIXA = join(RAIZ, "docs", "caixa-de-entrada");

/** As formas velhas, reproduzidas — para o lado ruim ser demonstrado e não lembrado. */
const VELHA = {
  ehItemAberto: (nome: string) =>
    /^\d{3}(-[A-Za-z0-9-]+)?\.md$/.test(nome) && !/-FEITO\.md$/i.test(nome) && !/-RETIRADO\.md$/i.test(nome),
  numeroDoItem: (nome: string) => {
    const m = /^(\d{3})/.exec(nome);
    return m ? Number(m[1]) : null;
  },
  numeroDe: (nome: string) => {
    const m = /^(\d{3}(?:-adendo)?)(?:-FEITO)?\.md$/.exec(nome);
    return m ? m[1]! : null;
  },
};

/** O universo: todo `.ts` versionado em `external-engines/`, menos `upstream/` (intocável, §3). */
function universo(): { arquivo: string; texto: string }[] {
  return execFileSync("git", ["ls-files", "external-engines/**/*.ts", "external-engines/*.ts"], {
    cwd: RAIZ,
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter((a) => a && !a.includes("/upstream/"))
    .map((arquivo) => ({ arquivo, texto: readFileSync(join(RAIZ, arquivo), "utf8") }));
}

describe("LAB-113 · a forma única do nome do item (D340)", () => {
  const inteira = new RegExp(`^${ITEM_DA_CAIXA}$`);

  test("O LADO BOM: três casas ou mais, sem teto — e os sufixos que existem", () => {
    for (const n of ["001", "030", "899", "900", "901", "999", "1000", "1001"]) expect(inteira.test(n), n).toBe(true);
    const casos: [string, number, string, string][] = [
      ["030.md", 30, "", "aberto"],
      ["1000.md", 1000, "", "aberto"],
      ["010-adendo-FEITO.md", 10, "-adendo", "feito"],
      ["025-adendo-2-FEITO.md", 25, "-adendo-2", "feito"],
      ["031-bis.md", 31, "-bis", "aberto"],
      ["005-RETIRADO.md", 5, "", "retirado"],
      ["001-feito.md", 1, "", "feito"],
    ];
    for (const [nome, numero, sufixo, estado] of casos) {
      expect(lerNomeDoItem(nome), nome).toMatchObject({ numero, sufixo, estado });
    }
  });

  test("O LADO RUIM: duas casas, nenhuma, outra extensão e outra palavra NÃO são item — recusa", () => {
    const semFim = `${"9".repeat(400)}.md`;
    for (const nome of ["09.md", "9.md", "a030.md", "030.txt", "030-.md", "COMO_FUNCIONA.md", "README.md", semFim]) {
      expect(lerNomeDoItem(nome), nome).toBeNull();
      expect(ehItemAberto(nome), nome).toBe(false);
      expect(numeroDoItem(nome), nome).toBeNull();
    }
  });

  test("a identidade: o estado não muda o item, o sufixo muda, e o número é NÚMERO", () => {
    const id = (n: string) => lerNomeDoItem(n)!.identidade;
    expect(id("013-FEITO.md")).toBe(id("013.md"));
    expect(id("013-RETIRADO.md")).toBe(id("013.md"));
    expect(id("010-adendo.md")).not.toBe(id("010.md"));
    expect(id("1000.md")).not.toBe(id("100.md"));
    // Dois nomes para o mesmo número são o mesmo item — a guarda do D273 os acusa.
    expect(id("0030.md")).toBe(id("030.md"));
  });
});

describe("LAB-113 · os três casos que o item 030 mandou", () => {
  test("`1000.md` aberto ao lado do `030.md`: o menor é o `030` — e a caixa NÃO está vazia", () => {
    const nomes = ["029-FEITO.md", "030.md", "1000.md", "900.md", "COMO_FUNCIONA.md"];
    expect(proximoItem(nomes)!.nome).toBe("030.md");
    expect(ehItemAberto("1000.md")).toBe(true);
    expect(numeroDoItem("1000.md")).toBe(1000);
    const r = aCaixaEstavaVazia(nomes);
    expect(r.veredicto).toBe("aberta-com-o-proximo");
    expect(r.abertos).toEqual(["030.md", "1000.md"]);
    // A forma velha, reproduzida: o `1000` não era item, e lia `100`.
    expect(VELHA.ehItemAberto("1000.md")).toBe(false);
    expect(VELHA.numeroDoItem("1000.md")).toBe(100);
  });

  test("e com tudo até o 899 feito, o `1000` é O PRÓXIMO — a forma velha declarava a caixa VAZIA", () => {
    const nomes = ["030-FEITO.md", "899-FEITO.md", "900.md", "1000.md", "COMO_FUNCIONA.md"];
    expect(proximoItem(nomes)!.nome).toBe("1000.md");
    const r = aCaixaEstavaVazia(nomes);
    expect(r.veredicto).toBe("aberta-com-o-proximo");
    expect(r.declaracaoEraVerdadeira).toBe(false);
    // A forma velha, reproduzida: o único aberto da direção ficava fora — "vazia", e verdadeira.
    expect(nomes.filter(VELHA.ehItemAberto)).toEqual(["900.md"]);
  });

  test("`900.md` sozinho: caixa SEM item da direção — a declaração de vazia é VERDADEIRA", () => {
    const nomes = ["028-FEITO.md", "029-FEITO.md", "900.md", "COMO_FUNCIONA.md"];
    const r = aCaixaEstavaVazia(nomes);
    expect(r.veredicto).toBe("vazia");
    expect(r.declaracaoEraVerdadeira).toBe(true);
    expect(r.porque).toContain(String(ITEM_RESERVADO));
    // O 900 é o que se faz quando não há outro — é o próximo, mas não é item da direção.
    expect(proximoItem(nomes)!.numero).toBe(ITEM_RESERVADO);
    // O defeito, demonstrado: contado como item comum, o 900 é maior que todo -FEITO e
    // passaria por "o próximo" — a declaração verdadeira de hoje sairia FALSA.
    const feitos = nomes.map(VELHA.numeroDoItem).filter((n): n is number => n !== null && n !== 900);
    expect(VELHA.ehItemAberto("900.md") && 900 > Math.max(...feitos)).toBe(true);
  });

  test("`09.md`: duas casas, fora da forma — não é item, e a caixa só com ele não tem item", () => {
    expect(lerNomeDoItem("09.md")).toBeNull();
    expect(proximoItem(["09.md", "COMO_FUNCIONA.md"])).toBeNull();
    expect(aCaixaEstavaVazia(["009-FEITO.md", "09.md"]).veredicto).toBe("vazia");
  });
});

describe("LAB-113 · a ordem é de FILA, nunca de texto", () => {
  test("em texto `1000` < `900` < `901`; na fila, `900`, `901`, `1000`", () => {
    const nomes = ["901.md", "1000.md", "900.md"];
    expect([...nomes].sort()).toEqual(["1000.md", "900.md", "901.md"]);
    expect(itensEmOrdem(nomes).map((i) => i.nome)).toEqual(["900.md", "901.md", "1000.md"]);
  });

  test("no empate, o item antes do adendo, e o adendo antes do adendo-2", () => {
    const nomes = ["010-adendo-2.md", "010-adendo.md", "010.md", "009-bis.md"];
    expect(itensEmOrdem(nomes).map((i) => i.nome)).toEqual(["009-bis.md", "010.md", "010-adendo.md", "010-adendo-2.md"]);
  });

  test("o reservado só é o próximo quando não há outro: `900` + `901` → `901`", () => {
    expect(proximoItem(["900.md", "901.md"])!.nome).toBe("901.md");
    expect(proximoItem(["900.md", "901-FEITO.md"])!.nome).toBe("900.md");
    expect(proximoItem(["901-FEITO.md"])).toBeNull();
  });
});

describe("LAB-113 · o histórico sai IGUAL", () => {
  const nomes = readdirSync(CAIXA);

  test("na caixa de hoje, todo nome que a forma velha lia sai com o MESMO número e o mesmo estado", () => {
    expect(nomes.length, "o universo da caixa").toBeGreaterThan(30);
    let lidos = 0;
    for (const nome of nomes) {
      if (VELHA.numeroDe(nome) === null && !VELHA.ehItemAberto(nome)) continue;
      lidos += 1;
      expect(numeroDoItem(nome), nome).toBe(VELHA.numeroDoItem(nome));
      expect(ehItemAberto(nome), nome).toBe(VELHA.ehItemAberto(nome));
    }
    expect(lidos).toBeGreaterThan(30);
  });

  test("a guarda do número repetido agrupa igual — e o que ela passa a ver a mais é o que a velha não lia", () => {
    const velhos = new Map<string, string>();
    for (const nome of nomes) {
      const v = VELHA.numeroDe(nome);
      if (v !== null) velhos.set(nome, v);
    }
    // Dois nomes no mesmo grupo velho estão no mesmo grupo novo, e vice-versa.
    const lista = [...velhos.keys()];
    for (const a of lista) {
      for (const b of lista) {
        const juntosVelho = velhos.get(a) === velhos.get(b);
        const juntosNovo = lerNomeDoItem(a)!.identidade === lerNomeDoItem(b)!.identidade;
        expect(juntosNovo, `${a} · ${b}`).toBe(juntosVelho);
      }
    }
    // E o que a forma nova lê a mais é só o que a velha não sabia ler: sufixo que não é `-adendo`,
    // `-RETIRADO`, ou quatro casas — nunca um nome de três casas que ela lia.
    const aMais = nomes.filter((n) => lerNomeDoItem(n) !== null && !velhos.has(n));
    for (const n of aMais) {
      const i = lerNomeDoItem(n)!;
      const foraDaVelha = (i.sufixo !== "" && i.sufixo !== "-adendo") || i.estado === "retirado" || i.numero >= 1000;
      expect(foraDaVelha, n).toBe(true);
    }
  });

  test("o próximo da caixa de hoje é o menor aberto da direção, em ordem NUMÉRICA", () => {
    const abertos = itensEmOrdem(nomes).filter((i) => i.estado === "aberto");
    const daDirecao = abertos.filter((i) => i.numero !== ITEM_RESERVADO);
    const p = proximoItem(nomes);
    if (daDirecao.length > 0) expect(p!.numero).toBe(Math.min(...daDirecao.map((i) => i.numero)));
    else expect(p?.numero ?? null).toBe(abertos.length > 0 ? ITEM_RESERVADO : null);
  });
});

describe("LAB-113 · o teto não renasce no código", () => {
  test("a largura de cada leitura — o teto é o que conta", () => {
    expect(larguraDosAlgarismos(String.raw`\d{3}(-`)).toMatchObject({ min: 3, max: 3 });
    expect(larguraDosAlgarismos(String.raw`\d\d\d)`)).toMatchObject({ min: 3, max: 3 });
    expect(larguraDosAlgarismos(String.raw`[0-9]{3,4}`)).toMatchObject({ min: 3, max: 4 });
    expect(larguraDosAlgarismos(String.raw`\d{3,}`)).toMatchObject({ min: 3, max: Infinity });
    expect(larguraDosAlgarismos(String.raw`\d+`)).toMatchObject({ min: 1, max: Infinity });
    expect(larguraDosAlgarismos("caixa")).toBeNull();
  });

  test("a régua acha as grafias com teto, num programa que fala da caixa", () => {
    const ruins = [
      String.raw`const a = /^\d{3}(-[A-Za-z0-9-]+)?\.md$/; const p = "caixa-de-entrada";`,
      String.raw`const b = /^(\d{3})/.exec(n); const f = "-FEITO";`,
      String.raw`const c = /^([0-9]{3})-FEITO/;`,
      String.raw`const d = /^\d\d\d-RETIRADO/;`,
      String.raw`const e = /^\d{3,4}\.md$/; const p = "caixa-de-entrada";`,
      'const g = new RegExp("^\\\\d{3}-FEITO");',
    ];
    for (const r of ruins) expect(tetoNoItemDoCodigo(r), r).toEqual([1]);
  });

  test("e NÃO acha o que quase parece: sem teto, teto de duas, fora do sujeito, escrita, comentário", () => {
    const boas = [
      String.raw`const a = /^\d{3,}-FEITO/;`,
      "const b = new RegExp(`^(${ITEM_DA_CAIXA})-FEITO`);",
      String.raw`const c = /^(\d+)-FEITO/;`,
      String.raw`const d = /\d{2}:\d{2}/; const f = "-FEITO";`,
      'const e = `${String(n).padStart(3, "0")}-FEITO.md`;',
    ];
    for (const b of boas) expect(tetoNoItemDoCodigo(b), b).toEqual([]);
    // Fora do sujeito: a mesma forma num programa que não fala da caixa não é desta régua.
    expect(tetoNoItemDoCodigo(String.raw`const ano = /\d{4}/;`)).toEqual([]);
    // E o sujeito se lê no CÓDIGO: a pasta citada só num comentário não põe o programa nele.
    expect(tetoNoItemDoCodigo(String.raw`const a = /^\d{3}\.md$/; // caixa-de-entrada`)).toEqual([]);
    // Comentário é relato; a linha de código depois dele é contada.
    expect(tetoNoItemDoCodigo("// era `^\\d{3}`\nconst f = '-FEITO';")).toEqual([]);
    expect(tetoNoItemDoCodigo("/** era `\\d{3}` */\nconst y = /^\\d{3}-FEITO/;")).toEqual([2]);
  });

  test("a árvore de hoje: zero achados fora das exceções, e nenhuma exceção velha", () => {
    const u = universo();
    expect(u.length, "o universo").toBeGreaterThan(200);
    for (const quem of [
      "external-engines/esteira/src/caixa-vazia-era-verdade.ts",
      "external-engines/esteira/tests/leituras.test.ts",
      "external-engines/esteira/src/texto-das-regras.ts",
    ]) {
      expect(u.some((a) => a.arquivo === quem), `${quem} fora do universo`).toBe(true);
    }
    const r = conferirTetoNoItem(u);
    // O tamanho do que a régua leu de fato: régua que lê zero programas do sujeito sai verde.
    expect(r.doSujeito, "programas que falam da caixa").toBeGreaterThan(10);
    expect(r.achados, JSON.stringify(r.achados)).toEqual([]);
    expect(r.excecoesVelhas).toEqual([]);
  });

  test("o lado ruim na árvore: a forma velha plantada na régua da caixa vazia é achada", () => {
    const u = universo().map((a) =>
      a.arquivo.endsWith("src/caixa-vazia-era-verdade.ts")
        ? { ...a, texto: `${a.texto}\nexport const velha = (n: string) => /^(\\d{3})/.exec(n);\n` }
        : a,
    );
    const r = conferirTetoNoItem(u);
    expect(r.achados.map((a) => a.arquivo)).toEqual(["external-engines/esteira/src/caixa-vazia-era-verdade.ts"]);
  });

  test("toda exceção diz o motivo, e a exceção curada vira acusação", () => {
    for (const e of EXCECOES_DE_TETO_NO_ITEM) expect(e.motivo.length, e.arquivo).toBeGreaterThan(40);
    const u = universo().map((a) =>
      a.arquivo.endsWith("tests/disparos-em-vazio.test.ts") ? { ...a, texto: "export {};\n" } : a,
    );
    expect(conferirTetoNoItem(u).excecoesVelhas).toEqual(["external-engines/esteira/tests/disparos-em-vazio.test.ts"]);
  });
});
