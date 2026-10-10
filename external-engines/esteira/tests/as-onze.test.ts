/**
 * A guarda da RECLASSIFICAÇÃO das onze provas de universo interno. (item 020, LAB-87)
 *
 * ```sh
 * bun test tests/as-onze.test.ts
 * ```
 *
 * O LAB-86 pôs **onze** provas na classe *"universo DENTRO desta casa"*, e o item 020 pediu as
 * dez restantes. Abertas uma a uma, **o denominador estava errado** — e não pelo motivo que o
 * item previu (*"se alguma depender de fora, ela sai"*): nenhuma dependia de fora.
 *
 * > **"O universo está dentro desta casa?" decide se recontar é BARATO. Ela não diz se recontar
 * > é POSSÍVEL, nem se é SIGNIFICATIVO.** Eu classifiquei pela conta e publiquei como se fosse
 * > pelo sentido — *"dentro"* era necessário e não suficiente.
 *
 * Esta trava cobra o que a prova do LAB-87 afirma: **a soma fecha, a lista não tem sobra nem
 * falta, cada prova citada existe, e cada classe diz o que a recontagem significa nela.**
 *
 * *Classificação sem guarda é a lista que o D104 descreve: ela envelhece igual a comentário — e
 * esta já envelheceu uma vez, em uma rodada.*
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-87", "as-onze-reclassificadas.json");

/** As três classes, em vocabulário FECHADO — uma quarta reprova. */
const CLASSES = ["estado-com-ferramenta", "registro-de-evento", "regerada-pelo-verde"] as const;

interface Linha {
  prova: string;
  classe: string;
  recontada: boolean;
  quando: string | null;
  porque: string;
}

interface ProvaDasOnze {
  umaPorUma: Linha[];
  asClasses: { classe: string; quantas: number; recontadas: number }[];
  aListaFecha: {
    asOnze: number;
    classificadas: number;
    faltando: string[];
    sobrando: string[];
    todasExistemNoDisco: boolean;
    soma: string;
  };
  oUniversoTotal: number;
}

const prova = () => JSON.parse(readFileSync(PROVA, "utf8")) as ProvaDasOnze;

describe("item 020 · as ONZE reclassificadas, e a soma fecha", () => {
  test("a prova existe — rode `bun run lab87`", () => {
    expect(existsSync(PROVA)).toBe(true);
  });

  test("são ONZE, a lista não tem falta nem sobra, e todas existem no disco", () => {
    const p = prova();
    expect(p.umaPorUma).toHaveLength(11);
    expect(p.aListaFecha.asOnze).toBe(11);
    expect(p.aListaFecha.classificadas).toBe(11);
    expect(p.aListaFecha.faltando).toEqual([]);
    expect(p.aListaFecha.sobrando).toEqual([]);
    expect(p.aListaFecha.todasExistemNoDisco).toBe(true);
    // E cada arquivo citado existe MESMO, conferido aqui contra o disco — não contra o
    // booleano que a ferramenta publicou. *Trava que acredita no campo da prova não confere
    // a prova: repete.*
    for (const l of p.umaPorUma) {
      expect(existsSync(join(RAIZ, "docs", "provas", l.prova)), l.prova).toBe(true);
    }
  });

  test("a SOMA fecha: 3 + 7 + 1 = 11, contado das linhas e não do texto", () => {
    const p = prova();
    const contado = new Map<string, number>();
    for (const l of p.umaPorUma) contado.set(l.classe, (contado.get(l.classe) ?? 0) + 1);
    expect([...contado.values()].reduce((a, b) => a + b, 0)).toBe(11);
    expect(contado.get("estado-com-ferramenta")).toBe(3);
    expect(contado.get("registro-de-evento")).toBe(7);
    expect(contado.get("regerada-pelo-verde")).toBe(1);
    // E o resumo publicado bate com as linhas — era aqui que o LAB-63 pegou uma soma que não
    // fechava (D212): *frase que se lê como partição e não soma é slogan*.
    for (const c of p.asClasses) {
      expect(c.quantas, c.classe).toBe(contado.get(c.classe) ?? -1);
    }
  });

  test("o vocabulário das classes é FECHADO — uma quarta reprova", () => {
    for (const l of prova().umaPorUma) {
      expect(CLASSES as readonly string[], `${l.prova}: classe fora do vocabulário`).toContain(
        l.classe,
      );
    }
  });

  test("as TRÊS de estado estão RECONTADAS, e dizem em que rodada", () => {
    const estado = prova().umaPorUma.filter((l) => l.classe === "estado-com-ferramenta");
    expect(estado).toHaveLength(3);
    for (const l of estado) {
      expect(l.recontada, `${l.prova}: de estado e não recontada`).toBe(true);
      expect(l.quando, `${l.prova}: recontada sem dizer quando`).not.toBeNull();
    }
    // As duas rodadas que as fizeram, nomeadas: a do 019 e as duas do 020.
    expect(estado.filter((l) => l.quando?.includes("LAB-86"))).toHaveLength(1);
    expect(estado.filter((l) => l.quando?.includes("LAB-87"))).toHaveLength(2);
  });

  test("as OITO que NÃO são desta forma dizem POR QUE, e não ficam como pendência", () => {
    // *Lista que encolhe porque o item era menor do que parecia é entrega; lista que encolhe
    // porque alguém desistiu é dívida — e a diferença tem de estar escrita.*
    const fora = prova().umaPorUma.filter((l) => l.classe !== "estado-com-ferramenta");
    expect(fora).toHaveLength(8);
    for (const l of fora) {
      expect(l.recontada, `${l.prova}: fora da forma e marcada como recontada`).toBe(false);
      expect(l.porque.length, `${l.prova}: fora da forma sem motivo escrito`).toBeGreaterThan(80);
      expect(l.quando, `${l.prova}: não recontada e com rodada declarada`).toBeNull();
    }
  });

  test("e as SETE de evento dizem que o número da árvore NÃO EXISTE nelas", () => {
    // Medido ao abrir: nenhuma das sete carrega número de topo. É o que torna a recontagem
    // sem objeto — e não apenas caro.
    const eventos = prova().umaPorUma.filter((l) => l.classe === "registro-de-evento");
    expect(eventos).toHaveLength(7);
    for (const l of eventos) {
      const d = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", l.prova), "utf8")) as Record<
        string,
        unknown
      >;
      const numerosNoTopo = Object.entries(d).filter(([, v]) => typeof v === "number");
      expect(numerosNoTopo, `${l.prova}: tem número de topo — não é só evento`).toEqual([]);
    }
  });
});
