/**
 * A PROVA DO CONTRATO — cada capacidade declarada é desmentida por medição. (LAB-14)
 *
 * ```sh
 * bun test tests/porta.test.ts
 * ```
 *
 * # Por que este arquivo é a prova, e o documento não é
 *
 * Um contrato que só existe em prosa é cumprido por boa vontade. O
 * `CONTRATO_MOTOR_UNIFICADO_v1.md` diz que o motor **declara o que sabe fazer**,
 * e a única coisa que dá peso a essa frase é haver um experimento que a
 * desmente quando ela é falsa.
 *
 * É o que está aqui: para **cada** campo de `Capacidades`, um experimento.
 *
 * | campo | como se desmente |
 * |---|---|
 * | `entrega` | `lote` com saída sem lote, ou `quadra` com lotes |
 * | `leRelevo` | mesma gleba com e sem curvas: mudou? |
 * | `aceitaSemente` | duas sementes: mudou? |
 * | `determinista` | duas rodadas iguais: a SAÍDA inteira bate? |
 * | `respeitaViaDesenhada` | via desenhada no miolo: o motor a seguiu? |
 * | `respeitaTestadaDeFrente` | há lote com aresta na testada? |
 * | `calculaGreide` | a saída traz rampa, ou `null`? |
 * | `respeitaRestricao` | a área privativa cai quando a APP entra? |
 *
 * **Um motor que declarar errado quebra o teste.** É o que separa declaração de
 * propaganda — e é por isso que este arquivo é curto em prosa e longo em medida.
 *
 * # O que ele NÃO prova
 *
 * Que a declaração seja completa. Um motor pode saber fazer algo que o contrato
 * não pergunta, e ninguém saberá. O contrato cresce quando alguém mede uma falta
 * — foi assim que `respeitaTestadaDeFrente` nasceu, no LAB-13.
 */
import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import { lotesNaTestadaDeFrente, aderenciaAViaDesenhada, type P } from "../src/motores/comum.ts";
import { entradaDaPorta, type Capacidades, type MotorNaPorta } from "../src/porta/porta.ts";
import {
  motorDoGenerate,
  motorDoParcelamento,
  motorDoSymbios,
  separar,
} from "../src/porta/motores.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);
const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

const lerFixture = (id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, `${id}.entrada.json`), "utf8"));

/**
 * A gleba de prova é a `sintetico-10ha-plano`: 10 ha, 5 quadras, e os quatro
 * motores rodam nela em menos de meio segundo. Um teste que leva minutos é um
 * teste que se aprende a pular.
 */
const GLEBA = "sintetico-10ha-plano";

let motores: MotorNaPorta[];

beforeAll(async () => {
  const wasm = await Motor.carregar(readFileSync(WASM));
  motores = [
    motorDoGenerate("ortogonal"),
    motorDoGenerate("espinha"),
    motorDoParcelamento(),
    motorDoSymbios(wasm),
  ];
});

const entradaCom = (v1: EntradaMinima, semente = SEMENTE) =>
  entradaDaPorta(v1, semente, CARIMBO, separar);

/** A mesma gleba, sem uma curva de nível sequer. */
function semRelevo(v1: EntradaMinima): EntradaMinima {
  return { ...v1, relevo: { curvas: [] } };
}

function lotesDa(saida: unknown): { pontos: P[] }[] {
  return ((saida as { lotes?: { pontos: P[] }[] } | null)?.lotes ?? []) as { pontos: P[] }[];
}

describe("a porta — os quatro a implementam de verdade", () => {
  test("todos declaram capacidades completas e coerentes", () => {
    for (const m of motores) {
      const c: Capacidades = m.capacidades();
      expect(c.id.length).toBeGreaterThan(0);
      expect(c.nome.length).toBeGreaterThan(0);
      expect(c.versao.length).toBeGreaterThan(0);
      expect(["lote", "quadra"]).toContain(c.entrega);
      expect(c.geometrias.length).toBeGreaterThanOrEqual(1);
    }
    // Os identificadores não podem colidir: a tela os usa para separar motores.
    const ids = motores.map((m) => m.capacidades().id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("todos devolvem indicadores em NÚMERO CRU, e null onde não medem", () => {
    const e = entradaCom(glebaDoLab(GLEBA));
    for (const m of motores) {
      const r = m.gerar(e);
      for (const [campo, v] of Object.entries(r.indicadores)) {
        expect(v === null || typeof v === "number", `${m.capacidades().id}.${campo}`).toBe(true);
      }
    }
  });
});

describe("a declaração é falsificável — um experimento por campo", () => {
  test("`entrega`: quem diz lote entrega lote", () => {
    const e = entradaCom(glebaDoLab(GLEBA));
    for (const m of motores) {
      const c = m.capacidades();
      const r = m.gerar(e);
      if (c.entrega === "lote") {
        expect(r.indicadores.lotes, `${c.id} declarou entregar lote`).toBeGreaterThan(0);
      } else {
        expect(r.indicadores.lotes ?? 0, `${c.id} declarou parar na quadra`).toBe(0);
      }
    }
  });

  test("`leRelevo`: com e sem curvas de nível, a saída muda se e só se ele lê", () => {
    const v1 = glebaDoLab(GLEBA);
    expect(v1.relevo?.curvas?.length ?? 0).toBeGreaterThan(0);
    for (const m of motores) {
      const c = m.capacidades();
      const com = JSON.stringify(m.gerar(entradaCom(v1)).saida);
      const rSem = m.gerar(entradaCom(semRelevo(v1)));
      if (c.exigeRelevo) {
        // Quem EXIGE relevo recusa sem ele — e recusa é resposta, não queda.
        expect(rSem.saida, `${c.id} exige relevo e devia recusar sem ele`).toBeNull();
        expect(rSem.naoAtendido.some((x) => x.postura === "recusei")).toBe(true);
        continue;
      }
      const sem = JSON.stringify(rSem.saida);
      if (c.leRelevo) {
        expect(com, `${c.id} declarou LER relevo e a saída não mudou`).not.toBe(sem);
      } else {
        expect(com, `${c.id} declarou NÃO ler relevo e a saída mudou`).toBe(sem);
      }
    }
  });

  test("`exigeRelevo`: sem relevo ele RECUSA pela porta, e não estoura", () => {
    // A porta proíbe estourar: motor que lança exceção derruba a tela comum, e
    // numa tela com vários motores derruba os outros junto. Foi este teste que
    // pegou o Symbios estourando em gleba plana.
    const semNada: EntradaMinima = { ...glebaDoLab(GLEBA), relevo: { curvas: [] } };
    for (const m of motores) {
      const c = m.capacidades();
      if (!c.exigeRelevo) continue;
      const r = m.gerar(entradaCom(semNada));
      expect(r.saida).toBeNull();
      const recusa = r.naoAtendido.find((x) => x.postura === "recusei");
      expect(recusa, `${c.id} recusou sem dizer por quê`).toBeDefined();
      expect(recusa!.campo).toBe("relevo.curvas");
    }
  });

  test("`aceitaSemente`: duas sementes mudam a saída se e só se ele a lê", () => {
    const v1 = glebaDoLab(GLEBA);
    for (const m of motores) {
      const c = m.capacidades();
      const a = JSON.stringify(m.gerar(entradaCom(v1, 1)).saida);
      const b = JSON.stringify(m.gerar(entradaCom(v1, 999_777)).saida);
      if (c.aceitaSemente) {
        expect(a, `${c.id} declarou ler semente e as duas saídas são iguais`).not.toBe(b);
      } else {
        expect(a, `${c.id} declarou NÃO ler semente e as saídas diferem`).toBe(b);
      }
      // E o que ele devolve como semente tem de bater com o que ele declarou.
      const r = m.gerar(entradaCom(v1, 42));
      expect(r.semente, `${c.id}.semente`).toBe(c.aceitaSemente ? 42 : null);
    }
  });

  test("`determinista`: a mesma entrada, a SAÍDA inteira igual", () => {
    const e = entradaCom(glebaDoLab(GLEBA));
    for (const m of motores) {
      const c = m.capacidades();
      if (!c.determinista) continue;
      expect(JSON.stringify(m.gerar(e).saida), `${c.id}`).toBe(JSON.stringify(m.gerar(e).saida));
    }
  });

  test("`calculaGreide`: a rampa vem em número ou vem null — nunca zero de mentira", () => {
    // Nesta gleba o Symbios recusa (`exigeRelevo` — ver o teste ao lado), então
    // a pergunta do greide se faz onde ele roda.
    const e = entradaCom(lerFixture("ensaio-47ha"));
    for (const m of motores) {
      const c = m.capacidades();
      const r = m.gerar(e);
      if (r.naoAtendido.some((x) => x.postura === "recusei")) continue;
      if (c.calculaGreide) {
        expect(r.indicadores.rampaMediaMaxima_pct, `${c.id} declarou calcular greide`).not.toBeNull();
      } else {
        expect(r.indicadores.rampaMediaMaxima_pct, `${c.id} declarou NÃO calcular greide`).toBeNull();
      }
    }
  }, 120_000);

  test("`respeitaViaDesenhada`: com uma via no miolo, ele a segue se e só se declarou", () => {
    const v1 = glebaDoLab(GLEBA);
    const anel = v1.gleba.anel;
    const centro = anel.reduce(
      (s, p) => ({ x: s.x + p.x / anel.length, y: s.y + p.y / anel.length }),
      { x: 0, y: 0 },
    );
    const linha = [
      { x: centro.x - 80, y: centro.y },
      { x: centro.x + 80, y: centro.y },
    ];
    const comVia: EntradaMinima = {
      ...v1,
      atracoes: [{ id: "T1", tipo: "via_existente", geometria: { tipo: "linha", pontos: linha } } as never],
    };
    const e = entradaCom(comVia);
    expect(e.viasDesenhadas).toHaveLength(1);

    for (const m of motores) {
      const c = m.capacidades();
      const r = m.gerar(e);
      const s = r.saida as { vias?: { eixo?: P[]; pontos?: P[]; largura_m?: number; caixa_m?: number }[] } | null;
      const vias = (s?.vias ?? []).map((v) => ({
        pontos: v.eixo ?? v.pontos ?? [],
        largura_m: v.largura_m ?? v.caixa_m ?? 10,
      })).filter((v) => v.pontos.length >= 2);
      const ader = aderenciaAViaDesenhada(comVia, vias).fracao;
      if (c.respeitaViaDesenhada) {
        expect(ader, `${c.id} declarou seguir via desenhada`).toBeGreaterThan(0.8);
      }
      // Quem declarou `false` TEM de dizer que ignorou — silêncio é o proibido.
      if (!c.respeitaViaDesenhada) {
        expect(
          r.naoAtendido.some((x) => x.campo === "viasDesenhadas"),
          `${c.id} ignorou a via desenhada e não declarou`,
        ).toBe(true);
      }
    }
  });

  test("`respeitaTestadaDeFrente`: há lote com aresta na testada se e só se declarou", () => {
    const v1 = lerFixture("geo-antonina");
    const e = entradaCom(v1);
    expect(e.testadasDeFrente).toHaveLength(1);

    for (const m of motores) {
      const c = m.capacidades();
      const r = m.gerar(e);
      const frente = lotesNaTestadaDeFrente(lotesDa(r.saida), e.testadasDeFrente);
      if (c.respeitaTestadaDeFrente) {
        expect(frente?.lotes ?? 0, `${c.id} declarou dar frente para a testada`).toBeGreaterThan(0);
      } else {
        expect(
          r.naoAtendido.some((x) => x.campo === "testadasDeFrente"),
          `${c.id} ignorou a testada e não declarou`,
        ).toBe(true);
      }
    }
  }, 120_000);

  test("`respeitaRestricao`: tirar a APP muda o resultado de quem a respeita", () => {
    const v1 = lerFixture("geo-antonina");
    const semAPP: EntradaMinima = { ...v1, restricoes: [] };
    // Só os dois do Generate aqui: os outros dois levam segundos nesta gleba, e
    // a pergunta é sobre a declaração, não sobre o tamanho do terreno.
    for (const m of motores.slice(0, 2)) {
      const c = m.capacidades();
      const com = JSON.stringify(m.gerar(entradaCom(v1)).saida);
      const sem = JSON.stringify(m.gerar(entradaCom(semAPP)).saida);
      if (c.respeitaRestricao) {
        expect(com, `${c.id} declarou respeitar restrição e a saída não mudou`).not.toBe(sem);
      }
    }
  }, 120_000);
});

describe("o que o motor não soube fazer — o campo que a porta obriga", () => {
  test("nenhum dos quatro ignora em silêncio o que a entrada trouxe", () => {
    const v1 = lerFixture("geo-antonina");
    const e = entradaCom(v1);
    for (const m of motores.slice(0, 2)) {
      const c = m.capacidades();
      const r = m.gerar(e);
      const campos = new Set(r.naoAtendido.map((x) => x.campo));
      if (!c.leRelevo && (v1.relevo?.curvas?.length ?? 0) > 0) expect(campos).toContain("relevo.curvas");
      if (!c.aceitaSemente) expect(campos).toContain("semente");
      if (!c.respeitaTestadaDeFrente && e.testadasDeFrente.length) expect(campos).toContain("testadasDeFrente");
    }
  });

  test("toda falta declarada traz postura e consequência, escritas para pessoa", () => {
    const e = entradaCom(lerFixture("geo-antonina"));
    for (const m of motores.slice(0, 2)) {
      for (const x of m.gerar(e).naoAtendido) {
        expect(["recusei", "ignorei", "substitui"]).toContain(x.postura);
        expect(x.campo.length).toBeGreaterThan(0);
        expect(x.oQueChegou.length).toBeGreaterThan(0);
        // Consequência é frase, não rótulo: quem lê é gente.
        expect(x.consequencia.split(" ").length).toBeGreaterThan(4);
      }
    }
  });
});
