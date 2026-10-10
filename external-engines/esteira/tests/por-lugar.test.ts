/**
 * A guarda do item 007: **por LUGAR, não por frase** — e o disco não é a origem.
 *
 * ```sh
 * bun test tests/por-lugar.test.ts
 * ```
 *
 * O critério de "deu certo" do item: *"nenhuma afirmação sua sobre outro repositório saiu sem um
 * `git show origin/…` na mão, e a varredura das condições de volta foi feita por LUGAR — com a
 * lista dos lugares escrita, para quem vier depois saber onde você olhou."*
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { VIZINHOS, conferirContraAOrigem } from "../src/commit-dos-vizinhos.ts";
import {
  LUGARES,
  QUANTAS_CONDICOES,
  conferirAsAfirmacoesSobreADisco,
  conferirOsLugares,
} from "../src/lugares-das-condicoes.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (p: string): string | null => {
  try {
    return readFileSync(join(RAIZ, p), "utf8");
  } catch {
    return null;
  }
};

describe("item 007 · a varredura por LUGAR, e a lista está escrita", () => {
  test("O LADO BOM: os OITO lugares existem e cada um ainda traz a sua marca", () => {
    // 7 → 8 no LAB-85: o `verde.yml` passou a ter uma coisa parada com condição de volta (D284).
    expect(LUGARES).toHaveLength(8);
    expect(conferirOsLugares(ler).map((p) => `${p.tipo}: ${p.oQue}`)).toEqual([]);
  });

  /**
   * **A conta que corrige o item 006.** Lá eu publiquei *"zero de quinze"* — as quinze eram as
   * etiquetas de **um** lugar. Por lugar são **vinte e uma** condições em **oito** lugares, e o
   * veredicto (nenhuma é CONTA) sobreviveu; a cobertura não. *O meu "zero" estava certo por não
   * haver nenhuma, não por a varredura alcançar.*
   */
  test("são VINTE E UMA condições em OITO lugares, e a varredura de frase alcançava QUINZE", () => {
    expect(QUANTAS_CONDICOES.naFila).toBe(14);
    // 6 → 7 no LAB-85: o oitavo lugar é o `verde.yml`, e ele não é a FILA.
    expect(QUANTAS_CONDICOES.foraDaFila).toBe(7);
    expect(QUANTAS_CONDICOES.total).toBe(21);
    // O número da varredura de FRASE é HISTÓRICO — o que ela alcançou no item 006 — e por isso
    // NÃO anda quando a `FILA.md` anda.
    expect(QUANTAS_CONDICOES.queAVarreduraDeFraseAlcancou).toBe(15);
    // A conta que fecha é esta, e é a única que é invariante:
    expect(QUANTAS_CONDICOES.naFila + QUANTAS_CONDICOES.foraDaFila).toBe(QUANTAS_CONDICOES.total);
    // E a identidade `frase + foraDaFila === total` valia só porque `naFila` era 15 NAQUELE DIA.
    // Ela quebrou no LAB-78, quando a FILA foi a 16 — era COINCIDÊNCIA, não invariante, e uma
    // trava que casa coincidência reprova no dia em que o mundo anda sem nada ter piorado.
    //
    // E AQUI MORAVAM AS OUTRAS DUAS, as duas com o MESMO número histórico de um lado:
    // `naFila - 15 === 1` (quebrou no LAB-80, D264) e depois `naFila > 15`, que eu escrevi no
    // lugar dela justificando-a com *"a FILA só cresce"*. **Medido no LAB-83: ela não só
    // cresce** — `naFila` fez 15 → 16 → 17 → 16 → 17 → 16 → 17, e as duas descidas foram por
    // ENTREGA (LAB-81 e LAB-83), e uma TERCEIRA no LAB-84. O `> 15` sobrevivia por UM, e uma
    // entrega mais o reprovava sem
    // nada ter piorado: a terceira coincidência da mesma função, e a primeira cuja JUSTIFICATIVA
    // ESCRITA é que estava falsa (D278). Ela saiu, e nada tomou o lugar dela — a relação entre a
    // fila de hoje e um número de ontem não é invariante nenhuma, é a medição de hoje, e ela já
    // está na linha de cima. *Coincidência consertada com outra coincidência é a mesma trava com
    // uma vida mais longa.*
  });

  test("NENHUMA das condições é uma CONTA, e nenhuma contradiz a regra de família", () => {
    expect(LUGARES.filter((l) => l.tipo === "conta")).toEqual([]);
    expect(LUGARES.filter((l) => l.contradizARegra)).toEqual([]);
  });

  test("todo lugar é um ARQUIVO, nunca um padrão — e cada tipo é do vocabulário", () => {
    for (const l of LUGARES) {
      expect(l.lugar, l.lugar).not.toContain("*");
      expect(l.oQueEstaParado.length, l.lugar).toBeGreaterThan(20);
      expect(l.aCondicao.length, l.lugar).toBeGreaterThan(20);
    }
    expect(new Set(LUGARES.map((l) => l.lugar)).size).toBe(LUGARES.length);
  });

  test("O LADO RUIM: lugar que sumiu, marca que saiu e CONTA declarada REPROVAM", () => {
    expect(conferirOsLugares(() => null).map((p) => p.tipo)).toEqual(
      LUGARES.map(() => "lugar-ausente"),
    );
    expect(conferirOsLugares(() => "texto sem marca nenhuma").every((p) => p.tipo === "marca-ausente")).toBe(true);
  });
});

describe("item 007 · o DISCO não é a ORIGEM", () => {
  test("`atras` DIZ quantos commits, e o número vai na frase", () => {
    const r = conferirContraAOrigem("motor-testfit", "6cf6396", "0f00c1a", 23);
    expect(r.veredito).toBe("atras");
    expect(r.oQueIssoQuerDizer).toContain("23 commit(s) ATRÁS");
    expect(r.oQueIssoQuerDizer).toContain("0f00c1a");
  });

  test("`em-dia` só quando a distância é ZERO", () => {
    expect(conferirContraAOrigem("urban-scout-tool", "abc1234", "abc1234", 0).veredito).toBe("em-dia");
  });

  /** **Sem `git fetch` não há origem**, e não medido não é em dia (D23). */
  test("sem a origem o veredicto é `origem-desconhecida`, nunca `em-dia`", () => {
    for (const caso of [
      ["abc1234", null, null],
      [null, "abc1234", 0],
      ["abc1234", "def5678", null],
    ] as const) {
      const r = conferirContraAOrigem("urban-create-hub-41d93a4d", caso[0], caso[1], caso[2]);
      expect(r.veredito, JSON.stringify(caso)).toBe("origem-desconhecida");
      expect(r.oQueIssoQuerDizer).toContain("NÃO MEDIDO");
    }
  });

  test("clone à frente da origem é `a-frente`, e é estranho num clone só de leitura", () => {
    const r = conferirContraAOrigem("motor-testfit", "aaa1111", "bbb2222", -3);
    expect(r.veredito).toBe("a-frente");
  });

  test("o veredicto da origem NUNCA reprova — ele diz, como o do primeiro eixo", () => {
    for (const v of VIZINHOS) {
      const r = conferirContraAOrigem(v, "aaa1111", "bbb2222", 10);
      expect(r.oQueIssoQuerDizer.length).toBeGreaterThan(40);
      expect(r.repo).toBe(v);
    }
  });
});

/**
 * **LAB-87 · a declaração sobre a ÁRVORE se confere contra a ÁRVORE** (D291).
 *
 * O LUGAR `CLAUDE.md` desta lista dizia, até 10/10/2026, que *"a cópia do Padrão Archilly e o
 * `VERSAO.txt` não existem na árvore"* — e a §1-C escrevia a mesma coisa com as palavras
 * **"conferido aqui e é verdade"**. Medido: o `VERSAO.txt` de fato não existe, **e a cópia
 * existe** desde 03/10 (PR #40), listada pelo `docs/INDEX.md` como *"cópia trazida"*.
 *
 * > **Declaração minha sobre o que a árvore TEM ou NÃO TEM é a mais fácil de todas de conferir, e
 * > por isso é a mais vergonhosa de deixar sem guarda** — não precisa de clone, de rede, de motor
 * > nem de semente: precisa de um `existsSync`. O que faltava não era instrumento, era a pergunta.
 *
 * **E a primeira régua que eu escrevi aqui lia a FRASE** — procurava *"não existe na árvore"*
 * perto do nome do arquivo — e **não pegou o defeito**, porque a mesma frase fala de dois
 * arquivos com veredictos opostos. O veredicto virou **campo declarado**, e a régua pergunta ao
 * disco: *não escreva uma régua que adivinhe o veredicto dentro da prosa — declare o veredicto.*
 */
describe("LAB-87 · o que a lista diz sobre a árvore, conferido no disco", () => {
  const existeNoDisco = (caminho: string): boolean => existsSync(join(RAIZ, caminho));

  test("O LADO BOM: as afirmações de hoje concordam com o disco", () => {
    expect(conferirAsAfirmacoesSobreADisco(LUGARES, existeNoDisco)).toEqual([]);
  });

  test("e há afirmação para conferir — lista sem campo nenhum passa por vácuo", () => {
    const comCampo = LUGARES.filter((l) => (l.oQueODiscoDeveDizer ?? []).length > 0);
    expect(comCampo.length).toBeGreaterThanOrEqual(1);
    expect(comCampo.flatMap((l) => l.oQueODiscoDeveDizer!).length).toBe(2);
  });

  test("O LADO RUIM: a afirmação ANTIGA reprova, e a linha NOMEIA o arquivo e os dois lados", () => {
    const comoEra = LUGARES.map((l) =>
      l.lugar === "CLAUDE.md"
        ? {
            ...l,
            oQueODiscoDeveDizer: [
              { arquivo: "docs/referencia/PADRAO_ARCHILLY.md", existe: false },
              { arquivo: "VERSAO.txt", existe: false },
            ],
          }
        : l,
    );
    const problemas = conferirAsAfirmacoesSobreADisco(comoEra, existeNoDisco);
    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain("PADRAO_ARCHILLY.md");
    expect(problemas[0]).toContain("NÃO existe");
    expect(problemas[0]).toContain("o disco diz que ele EXISTE");
  });

  test("e o outro sentido do erro também é pego: afirmar que EXISTE o que não existe", () => {
    const inventado = [
      { ...LUGARES[0]!, oQueODiscoDeveDizer: [{ arquivo: "VERSAO.txt", existe: true }] },
    ];
    expect(conferirAsAfirmacoesSobreADisco(inventado, existeNoDisco)[0]).toContain(
      "o disco diz que ele NÃO existe",
    );
  });

  /**
   * E o aviso do número congelado **não mora dentro da cópia**: a única coisa que ela promete é
   * ser byte a byte igual à do `motor-testfit`, e escrever o aviso lá dentro quebraria a promessa.
   * Então ele mora no `docs/INDEX.md`, e é lá que a trava o cobra.
   */
  test("o número congelado da cópia está declarado no `INDEX.md`, e NÃO dentro da cópia", () => {
    const indice = ler("docs/INDEX.md");
    expect(indice).not.toBeNull();
    expect(indice!).toContain("congelada na Versão 1");
    expect(indice!).toContain("3.0");

    const copia = ler("docs/referencia/PADRAO_ARCHILLY.md");
    expect(copia).not.toBeNull();
    expect(copia!).not.toContain("congelada na Versão 1");
    expect(copia!).not.toContain("D291");
  });
});
