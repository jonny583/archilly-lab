/**
 * Os testes da esteira do LAB-07.
 *
 * ```sh
 * bun test
 * ```
 *
 * O que eles cobrem, e por quê:
 *
 * - **ida e volta nas três glebas** — a verificação que o §4 do prompt exige.
 *   Terreno → motor → parcelamento → Validator/Judge, com o resultado chegando
 *   inteiro do outro lado.
 * - **determinismo** — duas execuções com a mesma semente dão o mesmo arquivo de
 *   contrato, byte a byte. É a propriedade que sustenta toda comparação futura:
 *   sem ela, "o motor mudou" e "a máquina mudou" ficam indistinguíveis.
 * - **as perdas são declaradas** — o que não atravessa a ponte tem de estar na
 *   lista, não sumir em silêncio.
 * - **o adaptador recusa o que tem de recusar** — versão errada, unidade errada,
 *   gleba degenerada.
 *
 * Os testes usam poucas variantes de propósito: a bateria tem de rodar em
 * segundos. A medição completa é `bun ferramentas/medir.ts`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  apararVias,
  idaParaOMotor,
  rodarEsteira,
  voltaParaOContrato,
  type EntradaV1,
} from "../adapter/src/index.ts";
import { glebaDoLab01 } from "../ferramentas/gleba-lab01.ts";
import { rodarMotor } from "@testfit/api.ts";

const GLEBAS = join(
  import.meta.dirname,
  "..", "..", "..", "..",
  "urban-create-hub-41d93a4d", "docs", "glebas-padrao",
);

const carregar = (id: string): EntradaV1 =>
  JSON.parse(readFileSync(join(GLEBAS, `${id}.entrada.json`), "utf8"));

const SEMENTE = 20260913;
const FORMATOS = ["ortogonal", "pente"] as const;

describe("ida — o contrato vira entrada do motor", () => {
  test("as três glebas atravessam a ida", () => {
    for (const entrada of [carregar("ensaio-47ha"), carregar("geo-antonina"), glebaDoLab01()]) {
      const { entrada: em, perdas } = idaParaOMotor(entrada, { semente: SEMENTE });
      expect(em.terreno.perimetro.length).toBeGreaterThanOrEqual(3);
      expect(em.terreno.areaBruta_m2).toBeGreaterThan(0);
      // A área do anel tem de bater com a declarada dentro de 0,1 %.
      expect(Math.abs(em.terreno.areaBruta_m2 - entrada.gleba.area_m2)).toBeLessThan(
        entrada.gleba.area_m2 * 0.001,
      );
      // Perda sem motivo escrito é perda que ninguém vai entender depois.
      for (const p of perdas) {
        expect(p.campo.length).toBeGreaterThan(0);
        expect(p.motivo.length).toBeGreaterThan(20);
        expect(["alta", "media", "baixa"]).toContain(p.gravidade);
      }
    }
  });

  test("a restrição que desconta entra com o ímã máximo", () => {
    const { entrada: em } = idaParaOMotor(carregar("geo-antonina"), { semente: SEMENTE });
    const queDescontam = em.terreno.restricoes.filter((r) => r.bloqueia);
    expect(queDescontam.length).toBeGreaterThan(0);
    for (const r of queDescontam) expect(r.ima).toBe(3);
  });

  test("atração em linha não entra, e a perda é registrada", () => {
    // A gleba de Antonina traz uma via existente como LINHA — a forma natural
    // dela, e justamente a que o motor não aceita.
    const entrada = carregar("geo-antonina");
    expect(entrada.atracoes.some((a) => a.geometria.tipo === "linha")).toBe(true);
    const { entrada: em, perdas } = idaParaOMotor(entrada, { semente: SEMENTE });
    expect(em.terreno.atracoes.length).toBe(0);
    expect(perdas.some((p) => p.campo.startsWith("atracoes") && p.gravidade === "alta")).toBe(true);
  });

  /**
   * **Este teste foi VIRADO no LAB-26, não apagado.**
   *
   * Ele exigia que a ida **recusasse** a versão "2", e estava certo quando foi
   * escrito: no LAB-07 o contrato tinha uma versão só. O Generate publicou o v2
   * — com as três coisas que o Laboratório pediu —, as glebas-padrão que este
   * arquivo carrega **viraram v2**, e a ida passou a recusar a própria fixture:
   * **14 de 14 testes vermelhos**, por duas semanas, invisíveis porque o
   * `bun test` do Lab rodava só o pacote `esteira`.
   *
   * Agora ele exige o contrário — que v2 **entre** — e que uma versão que
   * ninguém publicou (`"9"`) seja recusada, que é a metade da pergunta que
   * continua valendo. Virar em vez de apagar é o que a D90 decidiu: o teste
   * guarda a história de ter estado certo.
   */
  test("aceita as versões publicadas, recusa unidade e gleba degenerada", () => {
    const base = carregar("ensaio-47ha");
    expect(() =>
      idaParaOMotor({ ...base, archilly: { ...base.archilly, versao: "2" } }, { semente: 1 }),
    ).not.toThrow();
    expect(() =>
      idaParaOMotor({ ...base, archilly: { ...base.archilly, versao: "1" } }, { semente: 1 }),
    ).not.toThrow();
    expect(() =>
      idaParaOMotor({ ...base, archilly: { ...base.archilly, versao: "9" } }, { semente: 1 }),
    ).toThrow(/versão "9"/);
    expect(() =>
      idaParaOMotor({ ...base, crs: { ...base.crs, unidade: "ft" as "m" } }, { semente: 1 }),
    ).toThrow(/metro/);
    expect(() =>
      idaParaOMotor(
        { ...base, gleba: { ...base.gleba, anel: [{ x: 0, y: 0 }, { x: 1, y: 1 }] } },
        { semente: 1 },
      ),
    ).toThrow(/3 pontos/);
  });
});

describe("volta — o plano vira SAÍDA do contrato", () => {
  test("a largura da via é a caixa, não a caixa mais as calçadas", () => {
    // O lote encosta a `caixa_m / 2` do eixo: a calçada declarada não é
    // reservada. Declarar `caixa + 2 × calçada` fez o Validator reprovar 441 de
    // 441 lotes por falta de frente — ver volta.ts e o relatório.
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1 });
    for (const [i, v] of saida.vias.entries()) {
      expect(v.largura_m).toBe(plano.vias[i]!.caixa_m);
    }
  });

  test("lote aponta para quadra que existe, ou para nenhuma", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1 });
    const ids = new Set(saida.quadras.map((q) => q.id));
    for (const l of saida.lotes) {
      if (l.quadraId !== "") expect(ids.has(l.quadraId)).toBe(true);
    }
  });

  test("o CRS da saída é o mesmo da entrada", () => {
    const entrada = carregar("geo-antonina");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1 });
    expect(saida.crs).toEqual(entrada.crs);
    // VIRADO no LAB-26: a volta escreve **v2** desde o LAB-22, porque passou a
    // carregar `rampaMaxima_pct` por via. Este `toBe("1")` guardava a verdade do
    // LAB-07 e virou o alarme que ninguém ouviu — a suíte estava vermelha por
    // outro motivo, e este teste nunca chegou a reprovar a mudança.
    expect(saida.archilly.versao).toBe("2");
    expect(saida.entrada.contrato).toBe("2");
  });

  test("o quadro de áreas fecha na área bruta", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1 });
    const q = saida.quadroDeAreas;
    const soma =
      q.areaPrivativa_m2 + q.areaViaria_m2 + q.areaLazer_m2 + q.areaAPP_m2 + q.areaNaoAproveitada_m2;
    expect(Math.abs(soma - q.areaTotal_m2)).toBeLessThan(q.areaTotal_m2 * 0.001);
  });

  /**
   * **VIRADO no LAB-26, e esta é a virada que dói.**
   *
   * O nome dele era *"nada é inventado: faceDeRua e rampa saem nulos"*, e ele
   * exigia os dois `null`. Os dois `null` eram **defeito desta ponte**, não
   * honestidade: o motor mede a rampa desde o T03 dele (D98) e a via de frente
   * desde o T02 (D104). Este teste era a trava que teria mordido nas duas
   * ocasiões — e não mordeu, porque a suíte inteira já estava vermelha e
   * ninguém a rodava.
   *
   * **Nada é inventado continua valendo**, e é o que ele mede agora: o que a
   * ponte publica tem de vir do motor, e o `null` que sobra tem de ser `null` no
   * motor também.
   */
  test("nada é inventado: o que sai veio do motor, e o null do motor continua null", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1 });
    const ids = new Set(saida.vias.map((v) => v.id));

    // A via de frente: o motor dá índice, a ponte dá id — e nenhum id inventado.
    saida.lotes.forEach((l, i) => {
      const doMotor = plano.lotes[i]!.faceDeRua;
      if (doMotor == null) expect(l.faceDeRua).toBeNull();
      else expect(ids.has(l.faceDeRua!)).toBe(true);
    });
    // A rampa: atravessa como o motor a mediu, inclusive quando é `null`.
    saida.vias.forEach((v, i) => {
      expect(v.rampaMedia_pct).toBe(plano.vias[i]!.rampaMedia_pct);
      expect(v.rampaMaxima_pct).toBe(plano.vias[i]!.rampaMaxima_pct);
    });
  });
});

describe("aparo — o conserto declarado", () => {
  test("apara só as vias e encurta a rede", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    const { saida } = voltaParaOContrato(plano, entrada, { semente: 1 });
    const r = apararVias(saida, entrada.gleba.anel);

    expect(r.comprimentoAparado_m).toBeLessThan(r.comprimentoOriginal_m);
    // Lote, quadra e área especial saem intactos — aparar um lote mudaria a
    // área e a testada dele, que são o que o Validator vai medir.
    expect(r.saida.lotes).toEqual(saida.lotes);
    expect(r.saida.quadras).toEqual(saida.quadras);
    expect(r.saida.areasEspeciais).toEqual(saida.areasEspeciais);
  });
});

describe("a esteira inteira", () => {
  test("ida e volta com julgamento, nas três glebas", () => {
    for (const entrada of [carregar("ensaio-47ha"), carregar("geo-antonina"), glebaDoLab01()]) {
      const r = rodarEsteira(entrada, {
        semente: SEMENTE,
        variantes: 2,
        aparar: true,
        formatos: [...FORMATOS],
      });
      expect(r.variantes.length).toBe(2);
      for (const v of r.variantes) {
        // ATÉ O T02, este teste exigia `not.toBeNull()`: no LAB-07, as 60 de 60
        // variantes eram recusadas pelo esquema sem o aparo, porque 25 % a 40 %
        // do comprimento de via nascia fora da divisa. O T02 consertou isso —
        // medido no LAB-08: 0 de 20 recusadas em `ensaio-47ha`, 2 de 20 em
        // `geo-antonina`, e o aparo do Lab passou a cortar 0,3 % em vez de 38 %.
        //
        // O teste não some: ele passa a guardar a propriedade que interessa
        // agora — que o aparo é OPCIONAL e o resultado com ele passa no esquema.
        // Apagar a linha perderia a memória de por que o aparo existe.
        expect(v.recusa).toBeNull();
        expect(v.relatorio).not.toBeNull();
        expect(v.relatorio!.judge.numLotes).toBeGreaterThan(0);
        expect(v.relatorio!.validator.violacoes).toBeGreaterThanOrEqual(0);
      }
    }
  }, 120_000);

  test("determinismo: mesma semente, mesmo arquivo de contrato", () => {
    const entrada = carregar("ensaio-47ha");
    const opcoes = { variantes: 2, aparar: true, formatos: [...FORMATOS] };
    const a = rodarEsteira(entrada, { ...opcoes, semente: SEMENTE });
    const b = rodarEsteira(entrada, { ...opcoes, semente: SEMENTE });
    const c = rodarEsteira(entrada, { ...opcoes, semente: SEMENTE + 1 });

    const texto = (r: typeof a) => JSON.stringify(r.variantes.map((v) => v.saida));
    expect(texto(a)).toBe(texto(b));
    expect(texto(a)).not.toBe(texto(c));
    expect(a.assinaturaDaRodada).toBe(b.assinaturaDaRodada);
  }, 120_000);

  test("rodar não altera o terreno recebido", () => {
    const entrada = carregar("ensaio-47ha");
    const antes = JSON.stringify(entrada);
    rodarEsteira(entrada, { semente: SEMENTE, variantes: 1, formatos: [...FORMATOS] });
    expect(JSON.stringify(entrada)).toBe(antes);
  }, 60_000);
});

describe("§2.5 — a superquadra nasce vazia", () => {
  test("o formato superquadra não produz lote nenhum, e o plano vazio lidera", () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, {
      semente: SEMENTE,
      variantes: 6,
      formatos: ["superquadra"],
    });
    const s = rodarMotor(em);
    const vazias = s.opcoes.filter((o) => o.plano.metricas.lotes === 0).length;
    expect(vazias).toBe(s.opcoes.length);
    expect(s.opcoes[0]!.plano.metricas.lotes).toBe(0);
    // E mesmo assim ele recebe nota — é isso que o põe em primeiro.
    expect(s.opcoes[0]!.plano.nota).toBeGreaterThan(0);
  }, 60_000);
});

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  §LAB-53 — a guarda do campo MIN/MAX, ao lado do conserto
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **Ela existe por 36 violações.** Até o LAB-53, `parametrosAplicados` escrevia o
 * valor **sorteado** da variante em `testadaMinLote_m`, `caixaViariaMin_m` e
 * `faceQuadraMax_m` — campos cujo nome é LIMITE. A entrada declarava
 * `testadaMinLote_m = 10` m; o que chegava ao Validator do Generate era
 * **11,70820393249937** m, o alvo da variante; e o Validator reprovava **47
 * lotes** por um déficit mediano de **1,94 cm**, dos quais **36 eram esta ponte
 * e não o motor** (LAB-48, D166).
 *
 * **O que ela mede, e por que não é régua de nome.** Ela não confere ortografia
 * de campo nem lê comentário: ela roda a volta **duas vezes, com a mesma
 * ENTRADA e duas amostras diferentes**, e exige que todo campo MIN/MAX **fique
 * parado** enquanto o campo de ALVO **se move**. É dependência medida, não nome
 * casado — a lição das cinco réguas de nome do §6 (D137, D142, D155, D177,
 * D179).
 *
 * **As duas metades importam.** Sem a segunda — o alvo que se move — esta trava
 * passaria com a função devolvendo a ENTRADA inteira de volta, que é o erro
 * simétrico: `parametrosUsados` perderia a única função que tem.
 *
 * **E a varredura é por NOME sobre as chaves REAIS do objeto**, não sobre uma
 * lista escrita aqui: campo MIN/MAX novo no contrato entra na trava sozinho.
 * Lista que não se revalida envelhece igual a comentário (D104).
 */
describe("§LAB-53 — MÍNIMO e MÁXIMO vêm do contrato, nunca do sorteio", () => {
  const prepararDuasAmostras = () => {
    const entrada = carregar("ensaio-47ha");
    const { entrada: em } = idaParaOMotor(entrada, { semente: SEMENTE, variantes: 1 });
    const plano = rodarMotor(em).opcoes[0]!.plano;
    // A segunda amostra é a primeira com TUDO dobrado. Nenhum motor roda com
    // ela — e nem precisa: a pergunta é se a ponte COPIA o sorteio para um campo
    // de limite, e para responder isso basta a ponte.
    const outro = { ...plano, amostra: Object.fromEntries(
      Object.entries(plano.amostra).map(([k, v]) => [k, v * 2]),
    ) };
    return {
      entrada,
      plano,
      a: voltaParaOContrato(plano, entrada, { semente: 1 }).saida.parametrosUsados,
      b: voltaParaOContrato(outro, entrada, { semente: 1 }).saida.parametrosUsados,
    };
  };

  test("todo campo de LIMITE é o do contrato, ou `null` de não-aplicado", () => {
    const { entrada, a } = prepararDuasAmostras();
    const limites = Object.keys(a).filter((k) => /Min|Max/i.test(k));
    // Se este número cair, a varredura parou de olhar e não é que o contrato
    // mudou: é a diferença entre "não achei" e "não procurei" (D164).
    expect(limites.length, "a varredura de campos MIN/MAX não achou campo nenhum").toBeGreaterThan(4);
    for (const k of limites) {
      const valor = (a as unknown as Record<string, number | null>)[k]!;
      const doContrato = (entrada.parametros as unknown as Record<string, number | null>)[k]!;
      expect(
        valor === doContrato || valor === null,
        `${k}: vale ${valor}, e o contrato declarou ${doContrato}. Campo cujo nome diz LIMITE ` +
          "e cujo valor é outro é uma acusação automática (D166)",
      ).toBe(true);
    }
  });

  test("dobrada a amostra, nenhum LIMITE se move — e o ALVO se move", () => {
    const { a, b } = prepararDuasAmostras();
    for (const k of Object.keys(a).filter((x) => /Min|Max/i.test(x))) {
      const va = (a as unknown as Record<string, number | null>)[k];
      const vb = (b as unknown as Record<string, number | null>)[k];
      expect(vb, `${k}: o campo de LIMITE mudou com o SORTEIO — é o defeito do D166 de volta`).toBe(va);
    }
    // A outra metade: a ponte não pode ter virado uma cópia da entrada.
    expect(a.areaAlvoLote_m2).not.toBe(b.areaAlvoLote_m2);
    expect(b.areaAlvoLote_m2).toBe(a.areaAlvoLote_m2! * 2);
    expect(b.caixaPrincipal_m).toBe(a.caixaPrincipal_m! * 2);
  });

  test("o alvo sorteado SEM campo no contrato sai como perda declarada", () => {
    // O contrato v1 tem o trio MIN/ALVO/MAX só para a área do lote. O alvo de
    // testada da variante (11,708… contra os 10 m declarados) não tem onde
    // morar, e deixar de escrevê-lo no campo do MÍNIMO não pode virar silêncio:
    // ele sai na lista de perdas, com o número.
    const { entrada, plano } = prepararDuasAmostras();
    const { perdas } = voltaParaOContrato(plano, entrada, { semente: 1 });
    const daTestada = perdas.filter((p) => p.campo === "parametrosUsados.testadaAlvoLote_m");
    expect(daTestada.length, "o alvo de testada sumiu sem perda declarada").toBe(1);
    expect(daTestada[0]!.oQueHavia).toContain(String(plano.amostra["testada"]));
    expect(daTestada[0]!.motivo.length).toBeGreaterThan(20);
    // E a perda NÃO é declarada onde não há perda: a ida entrega
    // `comprimentoQuadra` como faixa degenerada (200, 200), então o sorteado é o
    // limite e nada se perde. Perda que grita onde não há perda ensina a ignorar
    // a lista.
    const tetoDeclarado = entrada.parametros.faceQuadraMax_m;
    expect(tetoDeclarado, "a gleba de teste deixou de declarar o teto de face de quadra").not.toBeNull();
    expect(plano.amostra["comprimentoQuadra"]).toBe(tetoDeclarado!);
    expect(perdas.some((p) => p.campo === "parametrosUsados.faceQuadraAlvo_m")).toBe(false);
  });
});
