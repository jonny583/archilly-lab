/**
 * AS PROMESSAS DA IDA, EXERCITADAS POR GLEBA DO REPOSITÓRIO. (LAB-35, LAB-40)
 *
 * ```sh
 * bun test tests/promessas.test.ts
 * ```
 *
 * # De onde isto veio
 *
 * O chat mandou, no LAB-35: *"a guarda da ida cospe 310 avisos `mapa-velho`;
 * confira se há caso real escondido nesse volume e reduza o ruído."*
 *
 * Classificados os 310 por campo, **21 dos 68 campos avisavam em TODAS as sete
 * glebas** — e aí a ausência deixa de ser *"campo opcional que esta gleba não
 * exerce"* e passa a ser *"nenhuma gleba exerce isto"*. Dos 21, dezessete são
 * `perda` ou `interno` (nada tinha de chegar ao motor, a ausência não diz nada).
 *
 * **Quatro eram PROMESSAS** — entradas `entregue` ou `traduzido` que o inventário
 * faz e que **a guarda nunca verificou**:
 *
 * | ida | campo | destino prometido |
 * |---|---|---|
 * | parcelamento | `parametros.calcada_m` | `terreno.padroes` |
 * | parcelamento | `atracoes[].geometria.aneis` | `terreno.atracoes` |
 * | parcelamento | `acessos[].segmento` | `terreno.acesso` |
 * | symbios | `gleba.furos` | `gleba.furos` |
 *
 * **Por que isso é grave e não burocracia:** a regra `campo-nao-entregue` só morde
 * quando o contrato **traz valor**. Caminho de destino errado numa promessa que
 * gleba nenhuma exercita é **invisível** — é exatamente a forma do D119, em que a
 * ida tinha um campo e ninguém media se ele chegava.
 *
 * # O que o LAB-40 mudou aqui, e não é formalidade
 *
 * No LAB-35 estes testes montavam a entrada **em memória**, dentro do próprio
 * arquivo. Isso exercita o caminho **neste teste** — e quem roda a esteira inteira
 * (a tabela, o acesso, as duas guardas das pontes) continua sem passar por ele. O
 * chat cobrou: *"fixtures que exerçam as quatro promessas; sem isso tudo que você
 * mediu vale para uma gleba só."*
 *
 * Agora a entrada vem de **`docs/fixtures/glebas-que-exercem-as-promessas/`**, e
 * cada asserção é uma comparação entre **dois arquivos a uma variável de distância**
 * — `ensaio-47ha` e a mesma gleba com a promessa exercida. Apagar um campo da
 * fixture reprova aqui.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { idaParaOMotor } from "../../testfit/adapter/src/ida.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { auditarIdaDoParcelamento, auditarIdaDoSymbios } from "../src/guarda-em-acao.ts";
import { promessasNaoExercitadas } from "../src/guarda-da-ida.ts";
import { IDA_DO_PARCELAMENTO, IDA_DO_SYMBIOS } from "../src/inventario-das-idas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures");
const SEMENTE = 20260913;

const ler = (pasta: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, pasta, `${id}.entrada.json`), "utf8"));

/** A base e a mesma gleba com as quatro promessas exercidas — a uma variável. */
const base = () => ler("glebas-padrao-com-relevo", "ensaio-47ha");
const comPromessas = () => ler("glebas-que-exercem-as-promessas", "ensaio-com-promessas");

const daIda = (e: EntradaMinima) =>
  idaParaOMotor(e as unknown as EntradaV1, { semente: SEMENTE }).entrada;

describe("as promessas do inventário da ida, exercitadas por FIXTURE (LAB-35, LAB-40)", () => {
  test("a fixture é a base a UMA variável de distância, e não outra gleba", () => {
    // Sem isto, a fixture poderia derivar para outra gleba e as comparações abaixo
    // mediriam duas coisas ao mesmo tempo.
    const a = base();
    const b = comPromessas();
    expect(JSON.stringify(b.gleba.anel)).toBe(JSON.stringify(a.gleba.anel));
    expect(JSON.stringify(b.relevo)).toBe(JSON.stringify(a.relevo));
    expect(b.archilly.versao).toBe(a.archilly.versao);
    // A procedência mora NO arquivo, não num LEIA-ME ao lado (D104).
    expect((b.archilly as unknown as { origem: string }).origem).toContain("LAB-40");
  });

  test("`parametros.calcada_m` → `terreno.padroes`: a calçada declarada CHEGA ao motor", () => {
    const sem = daIda(base());
    const com = daIda(comPromessas());

    // ── E o primeiro erro do LAB-35 foi MEU, aqui (D135) ────────────────────
    //
    // Eu escrevi `toBe(3.5)` e recebi `{ min: 3.5, max: 3.5 }`: o motor recebe
    // padrões como FAIXA, não como escalar. A promessa estava certa; a minha
    // asserção, errada. Um passo de distância de eu publicar "a calçada declarada
    // não chega ao motor", que é a forma do §6.
    type Faixa = { min: number; max: number };
    const p = (x: typeof com) => x.terreno.padroes as Record<string, Faixa> | undefined;
    expect(comPromessas().parametros.calcada_m, "a fixture deixou de declarar a calçada").toBe(3.5);
    expect(p(com), "a ida não montou `terreno.padroes`").toBeDefined();
    expect(p(com)!.calcadaPrincipal, "a calçada declarada não chegou").toEqual({ min: 3.5, max: 3.5 });
    expect(p(com)!.calcadaSecundaria).toEqual({ min: 3.5, max: 3.5 });
    // E a diferença é do campo, não de outra coisa: sem ele o valor é outro.
    expect(p(com)!.calcadaPrincipal).not.toEqual(p(sem)?.calcadaPrincipal);
  });

  test("`atracoes[].geometria.aneis` → `terreno.atracoes`: a atração como POLÍGONO chega como ímã", () => {
    // A perda declarada da ida diz, por escrito, que *"o motor recebe atração como
    // POLÍGONO (ímã)"*. Nenhuma gleba de antes entregava atração poligonal — todas
    // as atrações das outras fixtures são LINHA. Essa frase nunca foi posta à prova.
    const com = daIda(comPromessas());
    const atracoes = com.terreno.atracoes ?? [];
    expect(atracoes.length, "a atração poligonal não chegou ao motor").toBe(1);
    expect(atracoes[0]!.id).toBe("AT1");
    expect(atracoes[0]!.poligono.length, "o anel chegou vazio").toBeGreaterThanOrEqual(4);
    // E a base, sem atração nenhuma, não inventa uma.
    expect((daIda(base()).terreno.atracoes ?? []).length).toBe(0);
  });

  test("`acessos[].segmento` → `terreno.acesso`: o acesso como SEGMENTO chega, no MEIO", () => {
    // Todas as glebas de antes que declaram acesso o declaram como PONTO. O caminho
    // do segmento — que o contrato permite — nunca foi exercido.
    //
    // A fixture põe o MEIO do segmento no mesmo ponto que a base declarava: assim a
    // comparação mede a tradução da FORMA, e não uma mudança de lugar.
    const seg = (comPromessas().acessos as unknown as { segmento: { a: { x: number; y: number }; b: { x: number; y: number } } }[])[0]!.segmento;
    const com = daIda(comPromessas());
    expect(com.terreno.acesso, "o acesso como segmento não chegou").toBeDefined();
    expect(com.terreno.acesso!.x).toBeCloseTo((seg.a.x + seg.b.x) / 2, 6);
    expect(com.terreno.acesso!.y).toBeCloseTo((seg.a.y + seg.b.y) / 2, 6);
    // O mesmo ponto que a base entrega pelo caminho do PONTO — a forma mudou, o
    // lugar não.
    const semAcesso = daIda(base()).terreno.acesso;
    expect(com.terreno.acesso!.x).toBeCloseTo(semAcesso!.x, 6);
    expect(com.terreno.acesso!.y).toBeCloseTo(semAcesso!.y, 6);
  });

  test("`gleba.furos` → `gleba.furos` no Symbios: o furo CHEGA ao terreno", () => {
    // ── E o SEGUNDO erro meu, no mesmo prompt (D135) ────────────────────────
    //
    // Eu li `terreno.furos` e recebi `undefined` — e por um instante tinha nas
    // mãos "a ida do Symbios não entrega o furo", que seria defeito da ponte do
    // Lab, do tipo mais caro (D119). **O furo mora em `terreno.gleba.furos`**: no
    // Symbios a gleba é um `Poligono { externo, furos }`. A promessa estava certa
    // e o caminho do inventário também; errado estava o caminho do meu teste.
    const e = comPromessas();
    expect(e.gleba.furos.length, "a fixture deixou de trazer o furo").toBe(1);
    const { terreno } = glebaParaOSymbios(e);
    const t = terreno as { gleba: { externo: unknown[]; furos: { x: number; y: number }[][] } };
    expect(t.gleba.furos, "o furo da gleba não chegou ao terreno do Symbios").toBeDefined();
    expect(t.gleba.furos.length).toBe(1);
    expect(t.gleba.furos[0]!.length).toBeGreaterThanOrEqual(4);
    // E o furo é o que foi mandado, não um qualquer.
    expect(t.gleba.furos[0]![0]).toEqual(e.gleba.furos[0]![0]);
    // A base não tem furo, e isso é o outro lado da comparação.
    expect(base().gleba.furos.length).toBe(0);
  });

  test("a área DECLARADA da fixture com furo é a do anel MENOS o furo", () => {
    // Medido antes de escolher: o adaptador do Symbios compara `areaDeclarada_m2`
    // com a área do polígono, que **desconta os furos**, e avisa acima de 2 %. Os
    // 10 000 m² do furo são 2,1 % de 470 000 — declarar a área do anel passaria
    // raspando do avisador e seria declarar um número que eu sei errado.
    const e = comPromessas();
    const furo = e.gleba.furos[0]!;
    const areaDoFuro = Math.abs(
      furo.reduce((s, p, i) => {
        const q = furo[(i + 1) % furo.length]!;
        return s + (p.x * q.y - q.x * p.y);
      }, 0) / 2,
    );
    expect(areaDoFuro).toBeCloseTo(10_000, 6);
    expect(e.gleba.area_m2).toBeCloseTo(base().gleba.area_m2 - areaDoFuro, 6);
  });
});

describe("NENHUMA promessa dos inventários fica sem gleba que a exerça (LAB-40)", () => {
  /**
   * A trava que sobrevive ao prompt.
   *
   * Os quatro campos do LAB-35 eram a lista **daquele dia**. A propriedade que vale
   * amanhã é outra: *das promessas que os dois inventários fazem, nenhuma pode ficar
   * sem uma gleba do repositório que a exercite* — senão caminho de destino errado
   * volta a ser invisível.
   *
   * **Ela morde nas duas direções:** promessa nova no inventário sem fixture que a
   * exerça, e fixture mutilada que deixe de exercer uma promessa.
   *
   * Custo: **51 ms** para 10 glebas × 2 idas — a auditoria da ida monta a entrada do
   * motor, não roda o motor.
   */
  const GLEBAS = (): EntradaMinima[] => [
    glebaDoLab("completo"),
    glebaDoLab("pequeno"),
    glebaDoLab("sintetico-50ha-ondulado"),
    glebaDoLab("sintetico-10ha-plano"),
    ler("glebas-padrao-com-relevo", "ensaio-47ha"),
    ler("glebas-padrao-com-relevo", "geo-antonina"),
    ler("glebas-com-via-desenhada", "ensaio-com-via"),
    ler("glebas-com-via-desenhada", "antonina-com-via"),
    ler("glebas-que-exercem-as-promessas", "ensaio-com-promessas"),
    ler("glebas-que-exercem-as-promessas", "ensaio-com-testada"),
  ];

  /** O universo: toda entrada `entregue` ou `traduzido` dos dois inventários. */
  const universo = [
    ...Object.entries(IDA_DO_PARCELAMENTO).map(([campo, d]) => ({ ida: "parcelamento", campo, tipo: d.tipo })),
    ...Object.entries(IDA_DO_SYMBIOS).map(([campo, d]) => ({ ida: "symbios", campo, tipo: d.tipo })),
  ].filter((x) => x.tipo === "entregue" || x.tipo === "traduzido");

  test("as 60 promessas dos dois inventários têm, cada uma, gleba que a exerce", () => {
    const glebas = GLEBAS();
    const naoExercitadas = new Map<string, number>();
    for (const g of glebas) {
      for (const r of [auditarIdaDoParcelamento(g), auditarIdaDoSymbios(g)]) {
        for (const a of promessasNaoExercitadas(r.achados)) {
          const k = `${r.ida}·${a.campo}`;
          naoExercitadas.set(k, (naoExercitadas.get(k) ?? 0) + 1);
        }
      }
    }
    // Promessa sem exercício = a que TODAS as glebas deixaram de trazer.
    const semNinguem = universo
      .filter((p) => (naoExercitadas.get(`${p.ida}·${p.campo}`) ?? 0) >= glebas.length)
      .map((p) => `${p.ida}·${p.campo}`);
    expect(universo.length, "o universo de promessas mudou — confira a conta do LAB-40").toBe(60);
    expect(
      semNinguem,
      "promessa que gleba nenhuma exercita: ou a fixture perdeu o campo, ou a promessa nova precisa de uma",
    ).toEqual([]);
  }, 120_000);

  test("as duas idas NÃO reprovam nas glebas novas — inclusive nos irmãos do segmento", () => {
    // O primeiro achado da fixture, antes de medir número nenhum: `acessos[].segmento`
    // estava declarado e as pontas `a` e `b` **não**, e a regra `campo-novo-no-contrato`
    // nunca falou porque gleba nenhuma declarava acesso como segmento (D147).
    for (const id of ["ensaio-com-promessas", "ensaio-com-testada"]) {
      const g = ler("glebas-que-exercem-as-promessas", id);
      for (const r of [auditarIdaDoParcelamento(g), auditarIdaDoSymbios(g)]) {
        const reprovam = r.achados.filter(
          (a) => a.regra === "campo-nao-entregue" || a.regra === "campo-novo-no-contrato",
        );
        expect(reprovam.map((a) => `${a.campo}:${a.regra}`), `${id} · ${r.ida}`).toEqual([]);
      }
    }
  }, 120_000);

  test("os dois irmãos do segmento estão declarados, e com destino de verdade", () => {
    for (const campo of ["acessos[].segmento.a", "acessos[].segmento.b"]) {
      const d = IDA_DO_PARCELAMENTO[campo];
      expect(d, `${campo} sem destino escrito no inventário`).toBeDefined();
      expect(d!.tipo).toBe("traduzido");
      expect((d as { caminho: string }).caminho).toBe("terreno.acesso");
    }
  });
});
