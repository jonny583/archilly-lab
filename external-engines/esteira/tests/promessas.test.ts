/**
 * AS QUATRO PROMESSAS QUE GLEBA NENHUMA EXERCITAVA. (LAB-35)
 *
 * ```sh
 * bun test tests/promessas.test.ts
 * ```
 *
 * # De onde isto veio
 *
 * O chat mandou: *"a guarda da ida cospe 310 avisos `mapa-velho`; confira se há
 * caso real escondido nesse volume e reduza o ruído."*
 *
 * Classificados os 310 por campo, **21 dos 68 campos avisavam em TODAS as sete
 * glebas** — e aí a ausência deixa de ser *"campo opcional que esta gleba não
 * exerce"* e passa a ser *"nenhuma gleba exerce isto"*. Dos 21, dezessete são
 * `perda` ou `interno` (nada tinha de chegar ao motor, a ausência não diz nada).
 *
 * **Quatro são PROMESSAS** — entradas `entregue` ou `traduzido` que o inventário
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
 * Estes testes **exercitam as quatro**, com entradas montadas aqui. É a única
 * forma de transformar *"nunca verificada"* em *"verificada"*.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { idaParaOMotor } from "../../testfit/adapter/src/ida.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const SEMENTE = 20260913;

const base = (): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8"));

const daIda = (e: EntradaMinima) =>
  idaParaOMotor(e as unknown as EntradaV1, { semente: SEMENTE }).entrada;

describe("as promessas do inventário da ida, exercitadas (LAB-35)", () => {
  test("`parametros.calcada_m` → `terreno.padroes`: a calçada declarada CHEGA ao motor", () => {
    const e = base();
    const sem = daIda(e);
    const com = daIda({ ...e, parametros: { ...e.parametros, calcada_m: 3.5 } });

    // O inventário promete `terreno.padroes` com `calcadaPrincipal` e
    // `calcadaSecundaria`. Nenhuma das sete glebas declara `calcada_m`, então até
    // aqui ninguém nunca conferiu se a promessa é verdadeira.
    // ── E o primeiro erro deste prompt foi MEU, aqui (D135) ─────────────────
    //
    // Eu escrevi `toBe(3.5)` e recebi `{ min: 3.5, max: 3.5 }`: o motor recebe
    // padrões como FAIXA, não como escalar. A promessa estava certa; a minha
    // asserção, errada. Um passo de distância de eu publicar "a calçada declarada
    // não chega ao motor", que é a forma do §6 pela oitava vez.
    type Faixa = { min: number; max: number };
    const p = (x: typeof com) => x.terreno.padroes as Record<string, Faixa> | undefined;
    expect(p(com), "a ida não montou `terreno.padroes`").toBeDefined();
    expect(p(com)!.calcadaPrincipal, "a calçada declarada não chegou").toEqual({ min: 3.5, max: 3.5 });
    expect(p(com)!.calcadaSecundaria).toEqual({ min: 3.5, max: 3.5 });
    // E a diferença é do campo, não de outra coisa: sem ele o valor é outro.
    expect(p(com)!.calcadaPrincipal).not.toEqual(p(sem)?.calcadaPrincipal);
  });

  test("`atracoes[].geometria.aneis` → `terreno.atracoes`: a atração como POLÍGONO chega como ímã", () => {
    // A perda declarada da ida diz, por escrito, que *"o motor recebe atração como
    // POLÍGONO (ímã)"*. Nenhuma gleba entrega atração poligonal — todas as
    // atrações das fixtures são LINHA. Então essa frase nunca foi posta à prova.
    const e = base();
    const anel = [
      { x: 100, y: 100 },
      { x: 200, y: 100 },
      { x: 200, y: 200 },
      { x: 100, y: 200 },
    ];
    const com = daIda({
      ...e,
      atracoes: [
        {
          id: "A1",
          tipo: "comercio",
          nome: "praça de comércio",
          geometria: { tipo: "poligono", aneis: [anel] },
        } as never,
      ],
    });
    const atracoes = com.terreno.atracoes ?? [];
    expect(atracoes.length, "a atração poligonal não chegou ao motor").toBe(1);
    expect(atracoes[0]!.id).toBe("A1");
    expect(atracoes[0]!.poligono.length, "o anel chegou vazio").toBeGreaterThanOrEqual(4);
  });

  test("`acessos[].segmento` → `terreno.acesso`: o acesso como SEGMENTO chega", () => {
    // Todas as sete glebas que declaram acesso o declaram como PONTO. O caminho do
    // segmento — que o contrato permite — nunca foi exercido.
    const e = base();
    const a = { x: 10, y: 20 };
    const b = { x: 30, y: 60 };
    const com = daIda({
      ...e,
      acessos: [{ id: "AC1", nome: "entrada", papel: "principal", segmento: { a, b } } as never],
    });
    expect(com.terreno.acesso, "o acesso como segmento não chegou").toBeDefined();
    // A ida traduz o segmento para o MEIO dele — é a tradução declarada no
    // inventário, e exercê-la é o ponto deste teste.
    expect(com.terreno.acesso!.x).toBeCloseTo((a.x + b.x) / 2, 6);
    expect(com.terreno.acesso!.y).toBeCloseTo((a.y + b.y) / 2, 6);
  });

  test("`gleba.furos` → `gleba.furos` no Symbios: o furo CHEGA ao terreno", () => {
    // Nenhuma das sete glebas tem furo. A ida do Symbios promete entregá-lo, e
    // ninguém nunca conferiu.
    const e = base();
    const furo = [
      { x: 300, y: 300 },
      { x: 360, y: 300 },
      { x: 360, y: 360 },
      { x: 300, y: 360 },
    ];
    // ── E o SEGUNDO erro meu, no mesmo prompt (D135) ────────────────────────
    //
    // Eu li `terreno.furos` e recebi `undefined` — e por um instante tinha nas
    // mãos "a ida do Symbios não entrega o furo", que seria defeito da ponte do
    // Lab, do tipo mais caro (D119). **O furo mora em `terreno.gleba.furos`**: no
    // Symbios a gleba é um `Poligono { externo, furos }`. A promessa estava certa
    // e o caminho do inventário também; errado estava o caminho do meu teste.
    const { terreno } = glebaParaOSymbios({ ...e, gleba: { ...e.gleba, furos: [furo] } });
    const t = terreno as { gleba: { externo: unknown[]; furos: { x: number; y: number }[][] } };
    expect(t.gleba.furos, "o furo da gleba não chegou ao terreno do Symbios").toBeDefined();
    expect(t.gleba.furos.length).toBe(1);
    expect(t.gleba.furos[0]!.length).toBeGreaterThanOrEqual(4);
    // E o furo é o que foi mandado, não um qualquer.
    expect(t.gleba.furos[0]![0]).toEqual({ x: 300, y: 300 });
  });
});
