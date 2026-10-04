/**
 * A TESTADA DE FRENTE ENTREGUE EM `facesLoteamento`. (LAB-37)
 *
 * ```sh
 * bun test tests/testada-de-frente.test.ts
 * ```
 *
 * # A dívida que estas travas guardam
 *
 * A **testada de frente** — a linha onde a gleba encosta numa rua que já existe —
 * chega ao contrato como linha, e o motor do Laboratório de Parcelamento tem
 * `facesLoteamento` esperando desde sempre: *"índices das faces do perímetro que
 * recebem lotes voltados para a rua"*. **A ida do Lab nunca entregou**, e isso foi a
 * única `divida` declarada do inventário, do LAB-30 ao LAB-37 (D121).
 *
 * A D121 dizia, por escrito, que enquanto durasse, `respeitaTestadaDeFrente: false`
 * era **dívida do Lab, não limitação do motor**. **Medido, ela estava certa.**
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import { idaParaOMotor } from "../../testfit/adapter/src/ida.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import type { EntradaMinima } from "../src/gleba-v1.ts";
import {
  FRACAO_MINIMA_DA_FACE,
  TOL_DA_FACE_M,
  facesCobertasPelaLinha,
  linhasDaEntrada,
  lotesNaTestadaDeFrente,
  oQueAEsteiraPassaPronto,
  type P,
} from "../src/motores/comum.ts";
import { motorDoParcelamento } from "../src/porta/motores.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SEMENTE = 20260913;
const antonina = (): EntradaMinima =>
  JSON.parse(
    readFileSync(join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo", "geo-antonina.entrada.json"), "utf8"),
  );

describe("a régua das faces cobertas (LAB-37)", () => {
  // Um quadrado de 100 m, no sentido anti-horário: face 0 é a de baixo.
  const quadrado: P[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];

  test("linha colada numa face entrega aquela face, e só ela", () => {
    const r = facesCobertasPelaLinha(quadrado, [[{ x: 0, y: 0 }, { x: 100, y: 0 }]]);
    expect(r.faces).toEqual([0]);
  });

  test("LINHA QUE TOCA SÓ O VÉRTICE não entrega face nenhuma — a lição do D75", () => {
    // Esta é a trava que impede a régua de repetir o D75, em que uma régua de
    // vértice pôs três de quatro vias desenhadas no balde errado. Uma linha curta
    // encostada no canto toca DUAS faces, e não é testada de nenhuma.
    const r = facesCobertasPelaLinha(quadrado, [[{ x: -5, y: 0 }, { x: 2, y: 0 }]]);
    expect(r.faces, "2 m de uma face de 100 m não é testada de frente").toEqual([]);
    // E o toque aparece no detalhe, contado — some do veredito, não da medição.
    expect(r.porFace.some((f) => f.face === 0 && f.fracaoCoberta > 0)).toBe(true);
  });

  test("a fração mínima é o corte, e é DECLARADA", () => {
    expect(FRACAO_MINIMA_DA_FACE).toBe(0.5);
    expect(TOL_DA_FACE_M).toBe(1);
    // Metade da face: entra. Logo abaixo da metade: não entra.
    const metade = facesCobertasPelaLinha(quadrado, [[{ x: 0, y: 0 }, { x: 60, y: 0 }]]);
    expect(metade.faces).toEqual([0]);
    const quase = facesCobertasPelaLinha(quadrado, [[{ x: 0, y: 0 }, { x: 40, y: 0 }]]);
    expect(quase.faces).toEqual([]);
  });

  test("a tolerância separa a linha colada da linha longe", () => {
    const colada = facesCobertasPelaLinha(quadrado, [[{ x: 0, y: 0.5 }, { x: 100, y: 0.5 }]]);
    expect(colada.faces, "50 cm é dentro da tolerância de 1 m").toEqual([0]);
    const longe = facesCobertasPelaLinha(quadrado, [[{ x: 0, y: 10 }, { x: 100, y: 10 }]]);
    expect(longe.faces, "10 m da divisa não é testada de frente").toEqual([]);
  });

  test("sem linha, ou sem anel, a régua não inventa face", () => {
    expect(facesCobertasPelaLinha(quadrado, []).faces).toEqual([]);
    expect(facesCobertasPelaLinha([], [[{ x: 0, y: 0 }, { x: 1, y: 1 }]]).faces).toEqual([]);
  });
});

describe("a ponte entrega as faces, e UM lugar só as calcula (LAB-37, D139)", () => {
  test("em `geo-antonina` a linha de 180 m cobre a face 0, a 100 %", () => {
    const e = antonina();
    const { testadasDeFrente } = linhasDaEntrada(e);
    expect(testadasDeFrente.length).toBe(1);
    const r = facesCobertasPelaLinha(e.gleba.anel, testadasDeFrente);
    expect(r.faces).toEqual([0]);
    const f0 = r.porFace.find((f) => f.face === 0)!;
    expect(f0.fracaoCoberta).toBeCloseTo(1, 2);
    // A face 19 encosta no vértice e fica FORA, que é o ponto da fração mínima.
    const f19 = r.porFace.find((f) => f.face === 19);
    if (f19) expect(f19.fracaoCoberta).toBeLessThan(FRACAO_MINIMA_DA_FACE);
  });

  test("a ida ENTREGA `facesLoteamento` quando a esteira as passa", () => {
    const e = antonina();
    const pronto = oQueAEsteiraPassaPronto(e);
    const { entrada } = idaParaOMotor(e as unknown as EntradaV1, {
      semente: SEMENTE,
      facesLoteamento: pronto.facesLoteamento,
    });
    expect(entrada.facesLoteamento).toEqual([0]);
  });

  test("sem faces passadas, a ida NÃO inventa `facesLoteamento`", () => {
    const { entrada } = idaParaOMotor(antonina() as unknown as EntradaV1, { semente: SEMENTE });
    expect(entrada.facesLoteamento ?? null).toBeNull();
  });

  test("a esteira e o arnês da guarda calculam a MESMA coisa — num lugar só", () => {
    // O defeito que isto trava: o `rodarTestfit` calculava a coluna vertebral e as
    // faces, e o arnês da guarda calculava só a coluna. A guarda auditava um
    // caminho que não era o caminho, e reprovou `atracoes` em `geo-antonina`
    // dizendo que a testada não chegava. Duas montagens da mesma coisa envelhecem
    // em direções diferentes — é o D116, dentro da guarda que existe para isso.
    const fonte = readFileSync(join(import.meta.dirname, "..", "src", "guarda-em-acao.ts"), "utf8");
    expect(fonte, "o arnês da guarda tem de usar a função única").toContain(
      "oQueAEsteiraPassaPronto",
    );
    const testfit = readFileSync(join(import.meta.dirname, "..", "src", "motores", "testfit.ts"), "utf8");
    expect(testfit, "a esteira tem de usar a mesma função").toContain("oQueAEsteiraPassaPronto");
  });
});

describe("o motor RESPEITA a testada — e a D121 estava certa (LAB-37, D138)", () => {
  test("`respeitaTestadaDeFrente` virou `true`, e é medido", () => {
    expect(motorDoParcelamento().capacidades().respeitaTestadaDeFrente).toBe(true);
  });

  test("lotes com aresta na testada vão de ZERO a mais de dez", () => {
    const e = antonina();
    const { testadasDeFrente } = linhasDaEntrada(e);
    const faces = oQueAEsteiraPassaPronto(e).facesLoteamento;
    const rodar = (comAsFaces: boolean) =>
      rodarEsteira(e as unknown as EntradaV1, {
        semente: SEMENTE,
        variantes: 2,
        aparar: true,
        formatos: ["ortogonal"],
        ...(comAsFaces ? { facesLoteamento: faces } : {}),
      });
    const lotesDe = (r: ReturnType<typeof rodarEsteira>) =>
      (r.variantes.filter((v) => v.relatorio)[0]!.saida as unknown as { lotes: { pontos: P[] }[] }).lotes;

    const sem = lotesNaTestadaDeFrente(lotesDe(rodar(false)), testadasDeFrente)!;
    const com = lotesNaTestadaDeFrente(lotesDe(rodar(true)), testadasDeFrente)!;
    expect(sem.lotes, "sem as faces, nenhum lote fazia frente para a rua existente").toBe(0);
    expect(com.lotes, "com as faces, o motor tem de pôr lote de frente").toBeGreaterThan(10);
    // E a testada medida é a mesma nas duas: a régua não mudou, a entrega mudou.
    expect(com.comprimentoDaTestada_m).toBeCloseTo(sem.comprimentoDaTestada_m, 6);
  }, 120_000);

  test("a escolha da variante segue sendo do MOTOR — e quando custa lote, sai dito", () => {
    // A regra não mudou: representa o motor a de melhor nota DELE. Em Antonina,
    // entregue a testada, o ranking dele passou a preferir 33 lotes sobre 1 228 —
    // e publicar 33 sem a razão seria número que engana (D140).
    // As duas linhas vivem no `naoSoubeFazer` do `rodarTestfit`, que é o campo que
    // a página do Jonny lê — e não no `naoAtendido` da porta, que é para o que o
    // motor NÃO atendeu. A primeira versão deste teste olhou o campo errado.
    const r = rodarTestfit(antonina(), SEMENTE);
    const ditas = r.naoSoubeFazer.join(" · ");
    expect(ditas, "a entrega da testada tem de sair declarada").toContain("testada de frente entrou");
    expect(ditas, "a escolha que custa lote tem de sair declarada").toContain("RANKING DELE escolheu");
  }, 120_000);
});
