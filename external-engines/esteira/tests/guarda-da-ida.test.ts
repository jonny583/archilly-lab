/**
 * A GUARDA DA IDA — e a quinta vez do ponto cego, a mais cara de todas. (LAB-30)
 *
 * ```sh
 * bun test tests/guarda-da-ida.test.ts
 * ```
 *
 * # O que ela achou no dia em que nasceu
 *
 * O motor do Laboratório de Parcelamento tem um campo de entrada chamado
 * `viaManual` — *"coluna vertebral desenhada à mão, quando houver"*. **A ida do Lab
 * nunca o preencheu.** Medido: preenchendo, `antonina-com-via` vai de **25 para 32
 * vias**, e a SAÍDA deixa de ser idêntica sem a via.
 *
 * E o Lab publicou, **duas vezes**, que *o motor* ignora via desenhada — o LAB-17 e
 * o LAB-23, este último *"provado por diferença"*. A prova era verdadeira e a
 * conclusão era falsa: a SAÍDA saía idêntica porque **a via nunca chegava ao motor**.
 *
 * **A diferença entre esta e as quatro anteriores:** as outras foram pegas antes de
 * sair. Esta já tinha saído para o chat, e ficou publicada por duas semanas.
 *
 * # Os quatro andares, na ordem em que doem
 *
 * | andar | o que prova |
 * |---|---|
 * | **1 · o mecanismo** | as três regras pegam o que prometem |
 * | **2 · a falsificação** | uma ida sabotada É pega — inclusive a sabotagem exata do `viaManual` |
 * | **3 · as idas de verdade** | hoje nenhuma das duas deixa de entregar o que o contrato traz |
 * | **4 · o D119 não volta** | a via desenhada chega ao motor, e muda o desenho |
 */
import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { rodarMotor } from "@testfit/api.ts";

import { idaParaOMotor } from "../../testfit/adapter/src/ida.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import {
  REGRAS_DA_IDA_QUE_REPROVAM,
  auditarIda,
  avisosQueImportam,
  caminhosDe,
  dividasDoLab,
  promessasNaoExercitadas,
  reprovamNaIda,
  valorEm,
} from "../src/guarda-da-ida.ts";
import { auditarIdaDoParcelamento, auditarIdaDoSymbios } from "../src/guarda-em-acao.ts";
import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import { IDA_DO_PARCELAMENTO, IDA_DO_SYMBIOS } from "../src/inventario-das-idas.ts";
import {
  linhasDaEntrada,
  lotesNaTestadaDeFrente,
  oQueAEsteiraPassaPronto,
  type P,
} from "../src/motores/comum.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const COM_VIA = join(RAIZ, "docs", "fixtures", "glebas-com-via-desenhada");
const PROMESSAS = join(RAIZ, "docs", "fixtures", "glebas-que-exercem-as-promessas");
const GLEBA = "sintetico-10ha-plano";

let antonina: EntradaMinima;
let comPromessas: EntradaMinima;
let comTestada: EntradaMinima;
beforeAll(() => {
  antonina = JSON.parse(readFileSync(join(COM_VIA, "antonina-com-via.entrada.json"), "utf8"));
  // As duas fixtures do LAB-40: a que exerce as quatro promessas e a da testada de
  // frente fora de Antonina. Elas entram aqui porque foi a primeira delas que fez
  // esta guarda falar — `acessos[].segmento.a` e `.b` sem destino escrito (D147).
  comPromessas = JSON.parse(readFileSync(join(PROMESSAS, "ensaio-com-promessas.entrada.json"), "utf8"));
  comTestada = JSON.parse(readFileSync(join(PROMESSAS, "ensaio-com-testada.entrada.json"), "utf8"));
});

// ═════════════════════ andar 1 · o mecanismo das três regras ═══════════════

describe("as três regras pegam o que prometem", () => {
  test("`campo-nao-entregue`: o contrato trouxe e o destino chegou vazio", () => {
    const a = reprovamNaIda(
      auditarIda({
        nome: "falsa",
        // O `gleba` entra porque a guarda cobra o pai também: inventário incompleto
        // é achado, e num teste de mentira isso é ruído — no código de verdade é o
        // que faz a regra 2 valer.
        inventario: {
          gleba: { tipo: "traduzido", caminho: "terreno", como: "o conjunto" },
          "gleba.anel": { tipo: "entregue", caminho: "terreno.perimetro" },
        },
        doContrato: { gleba: { anel: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }] } },
        doMotor: { terreno: { perimetro: [] } },
      }),
    );
    expect(a).toHaveLength(1);
    expect(a[0]!.regra).toBe("campo-nao-entregue");
    expect(a[0]!.destino).toBe("terreno.perimetro");
  });

  test("`campo-nao-entregue` NÃO acusa quando o contrato não trouxe nada", () => {
    // A metade que importa: campo vazio na ENTRADA é o contrato não trazendo, e a
    // ponte não tem culpa de não entregar o que não recebeu.
    expect(
      reprovamNaIda(
        auditarIda({
          nome: "falsa",
          inventario: {
            gleba: { tipo: "traduzido", caminho: "terreno", como: "o conjunto" },
            "gleba.anel": { tipo: "entregue", caminho: "terreno.perimetro" },
          },
          doContrato: { gleba: { anel: [] } },
          doMotor: { terreno: { perimetro: [] } },
        }),
      ),
    ).toHaveLength(0);
  });

  test("`campo-novo-no-contrato`: é a regra que pegaria a v2", () => {
    // `nascente` entrou no contrato v2 ao lado de `geometria`, DENTRO de uma
    // `restricoes` que já estava declarada. É por isso que a guarda achata os
    // caminhos dentro das listas: declarar só `restricoes` deixaria passar.
    const a = reprovamNaIda(
      auditarIda({
        nome: "falsa",
        inventario: { restricoes: { tipo: "entregue", caminho: "restricoes" } },
        doContrato: { restricoes: [{ nascente: { x: 1, y: 2 } }] },
        doMotor: { restricoes: [{ area: {} }] },
      }),
    );
    expect(a.some((x) => x.campo === "restricoes[].nascente")).toBe(true);
    expect(a.find((x) => x.campo === "restricoes[].nascente")!.regra).toBe(
      "campo-novo-no-contrato",
    );
  });

  test("`cobreFilhos` cala o blob opaco, e SÓ ele", () => {
    const comBlob = auditarIda({
      nome: "falsa",
      inventario: { geo: { tipo: "perda", motivo: "documento inteiro do Geo", cobreFilhos: true } },
      doContrato: { geo: { archilly: { schema: "x", versao: "1" }, features: [{ type: "F" }] } },
      doMotor: {},
    });
    expect(reprovamNaIda(comBlob)).toHaveLength(0);
    // Sem a marca, cada campo de dentro é cobrado — que é o comportamento normal.
    const semMarca = auditarIda({
      nome: "falsa",
      inventario: { geo: { tipo: "perda", motivo: "documento inteiro do Geo" } },
      doContrato: { geo: { archilly: { schema: "x" } } },
      doMotor: {},
    });
    expect(reprovamNaIda(semMarca).length).toBeGreaterThan(0);
  });

  test("`mapa-velho` avisa e NÃO reprova", () => {
    const todos = auditarIda({
      nome: "falsa",
      inventario: {
        gleba: { tipo: "traduzido", caminho: "terreno", como: "o conjunto" },
        "gleba.anel": { tipo: "entregue", caminho: "terreno.perimetro" },
        "restricoes[].nascente": { tipo: "perda", motivo: "v2 sem dado em gleba nenhuma" },
      },
      doContrato: { gleba: { anel: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] } },
      doMotor: { terreno: { perimetro: [{ x: 0, y: 0 }] } },
    });
    expect(todos.map((x) => x.regra)).toEqual(["mapa-velho"]);
    expect(reprovamNaIda(todos)).toHaveLength(0);
    expect(REGRAS_DA_IDA_QUE_REPROVAM).not.toContain("mapa-velho");
  });

  test("destino com ALTERNATIVAS aceita qualquer uma — e não inventa achado", () => {
    // A atração vai para `terreno.atracoes` quando é polígono e para `viaManual`
    // quando é a via desenhada. Exigir um caminho só produziria achado inventado —
    // e eu produzi um hoje, declarando `faixas` onde o destino é `terreno.padroes`.
    const o = {
      nome: "falsa" as const,
      inventario: {
        atracoes: { tipo: "traduzido" as const, caminho: "terreno.atracoes | viaManual", como: "x" },
      },
      // Sem campo de dentro: a lista com um objeto de uma chave faria a guarda
      // cobrar `atracoes[].id`, que é ela cumprindo a regra 2 e aqui é ruído.
      doContrato: { atracoes: [{}] },
    };
    expect(reprovamNaIda(auditarIda({ ...o, doMotor: { viaManual: [{ x: 0, y: 0 }] } }))).toHaveLength(0);
    expect(reprovamNaIda(auditarIda({ ...o, doMotor: { terreno: { atracoes: [{}] } } }))).toHaveLength(0);
    expect(reprovamNaIda(auditarIda({ ...o, doMotor: {} })).length).toBe(1);
  });

  test("`caminhosDe` para nas listas de pontos — geometria é folha", () => {
    const c = caminhosDe({ gleba: { anel: [{ x: 1, y: 2 }, { x: 3, y: 4 }] } });
    expect(c.has("gleba.anel")).toBe(true);
    expect(c.has("gleba.anel[].x")).toBe(false);
  });

  test("`valorEm` acha o primeiro valor NÃO vazio da lista", () => {
    const o = { restricoes: [{ nascente: null }, { nascente: { x: 1, y: 2 } }] };
    expect(valorEm(o, "restricoes.nascente")).toEqual({ x: 1, y: 2 });
    expect(valorEm(o, "restricoes.inexistente")).toBeUndefined();
  });
});

// ═══════════════ andar 2 · a guarda sabe ficar VERMELHA ════════════════════

describe("a falsificação — uma ida sabotada é pega", () => {
  /**
   * **O alcance da guarda genérica, dito com honestidade.**
   *
   * A linha do contrato tem **três** destinos possíveis no motor — ímã
   * (`terreno.atracoes`), coluna vertebral (`viaManual`) e face de loteamento
   * (`facesLoteamento`) — e **qual deles vale depende do tipo da atração**, que no
   * v1 só se descobre medindo a distância à divisa. A guarda genérica não sabe
   * escolher entre os três, e por isso `atracoes` entra como **dívida declarada**:
   * ela aponta que o motor espera e a ida não entrega tudo, sem reprovar.
   *
   * **Consequência que não escondo:** a guarda genérica **não** é o que impede o
   * D119 de voltar. O que impede são as duas travas específicas do andar 4 — a ida
   * preenche `viaManual`, e com ela o motor desenha diferente. Guarda genérica tem
   * alcance genérico; o caso específico pede trava específica.
   */
  test("a ida como ERA aparece como dívida, e a trava do D119 é a específica", () => {
    const { desenhadas } = linhasDaEntrada(antonina);
    expect(desenhadas.length).toBeGreaterThan(0);
    // A ida COMO ERA até o LAB-30: sem passar a coluna vertebral.
    const { entrada: comoEra } = idaParaOMotor(antonina as unknown as EntradaV1, {
      semente: 1,
      variantes: 1,
    });
    const todos = auditarIda({
      nome: "sabotada",
      inventario: IDA_DO_PARCELAMENTO,
      doContrato: antonina as unknown as Record<string, unknown>,
      doMotor: comoEra as unknown as Record<string, unknown>,
    });
    // ── E DESDE O LAB-37 ELA REPROVA, o que é a notícia boa (D138) ──────────
    //
    // Até o LAB-36 esta trava dizia "nada reprova — e é por isso que a trava
    // específica existe": com `atracoes` declarado como DÍVIDA, a guarda genérica
    // não podia morder, porque dívida não reprova. Paga a dívida, `atracoes` virou
    // ENTREGA com três destinos alternativos — e aí a ida como era, que não entrega
    // nenhum dos três, **é pega pela guarda genérica**.
    //
    // O alcance que o D121 custou (ele disse isso, por escrito) foi devolvido.
    const reprovam = reprovamNaIda(todos);
    expect(reprovam.length, "a ida como ERA tem de ser pega agora").toBeGreaterThan(0);
    expect(reprovam.map((x) => x.destino).join(" ")).toContain("viaManual");
    expect(reprovam.map((x) => x.destino).join(" ")).toContain("facesLoteamento");
    // E dívida nenhuma, porque não há mais.
    expect(dividasDoLab(todos)).toHaveLength(0);
  });

  test("apagar uma entrada do inventário reprova por `campo-novo-no-contrato`", () => {
    const sem = { ...IDA_DO_SYMBIOS };
    delete (sem as Record<string, unknown>)["gleba.anel"];
    const a = reprovamNaIda(
      auditarIda({
        nome: "sabotada",
        inventario: sem,
        doContrato: glebaDoLab(GLEBA) as unknown as Record<string, unknown>,
        doMotor: { gleba: { externo: [{ x: 0, y: 0 }] } },
      }),
    );
    expect(a.some((x) => x.campo === "gleba.anel" && x.regra === "campo-novo-no-contrato")).toBe(true);
  });
});

// ═══════════════ andar 3 · as duas idas de verdade, hoje ═══════════════════

describe("as idas do Lab entregam o que o contrato traz", () => {
  test("a ida do Laboratório de Parcelamento está limpa, na gleba sintética", () => {
    const a = reprovamNaIda(auditarIdaDoParcelamento(glebaDoLab(GLEBA)).achados);
    expect(a.map((x) => `${x.regra} ${x.campo}`)).toEqual([]);
  });

  test("a ida do Symbios está limpa, na gleba sintética", () => {
    const a = reprovamNaIda(auditarIdaDoSymbios(glebaDoLab(GLEBA)).achados);
    expect(a.map((x) => `${x.regra} ${x.campo}`)).toEqual([]);
  });

  test("as duas estão limpas na gleba COM via desenhada — a que pegou o D119", () => {
    for (const r of [auditarIdaDoParcelamento(antonina), auditarIdaDoSymbios(antonina)]) {
      expect(reprovamNaIda(r.achados).map((x) => `${x.regra} ${x.campo}`), r.ida).toEqual([]);
    }
  });

  test("a nascente do v2 é PERDA DECLARADA nas duas, e não esquecimento", () => {
    // Ela não tem dado em gleba nenhuma (D88), então hoje isto é um aviso. Quando o
    // Geo passar a trazê-la, o aviso vira exigência — e é esse o ponto.
    for (const inv of [IDA_DO_PARCELAMENTO, IDA_DO_SYMBIOS]) {
      const d = inv["restricoes[].nascente"];
      expect(d).toBeDefined();
      expect(d!.tipo).toBe("perda");
      if (d!.tipo === "perda") expect(d!.motivo).toContain("v2");
    }
  });
});

// ═══════════════ andar 4 · o D119 não volta ════════════════════════════════

describe("a via desenhada chega ao motor, e muda o desenho", () => {
  test("a ida preenche `viaManual` com a linha mais longa", () => {
    const { desenhadas } = linhasDaEntrada(antonina);
    const comprimento = (l: P[]) =>
      l.reduce((s, p, i) => (i === 0 ? 0 : s + Math.hypot(p.x - l[i - 1]!.x, p.y - l[i - 1]!.y)), 0);
    const maisLonga = [...desenhadas].sort((a, b) => comprimento(b) - comprimento(a))[0]!;
    const { entrada } = idaParaOMotor(antonina as unknown as EntradaV1, {
      semente: 1,
      variantes: 1,
      viaManual: maisLonga,
    });
    expect((entrada as { viaManual?: P[] }).viaManual).toEqual(maisLonga);
  });

  test("com a via, o motor desenha diferente — medido, não declarado", () => {
    const { desenhadas } = linhasDaEntrada(antonina);
    const base = { semente: 20260913, variantes: 1, formatos: ["ortogonal"] as never };
    const sem = idaParaOMotor(antonina as unknown as EntradaV1, base).entrada;
    const com = idaParaOMotor(antonina as unknown as EntradaV1, {
      ...base,
      viaManual: desenhadas[0]!,
    }).entrada;
    const vias = (e: typeof sem) => rodarMotor(e).opcoes[0]!.plano.vias.length;
    // Medido no LAB-30: 25 vias sem a coluna vertebral, 32 com ela.
    expect(vias(com)).not.toBe(vias(sem));
  }, 120_000);

  test("mais de uma via desenhada: entra a mais longa e a perda é declarada", () => {
    const { desenhadas } = linhasDaEntrada(antonina);
    expect(desenhadas.length).toBeGreaterThan(1);
    const { perdas } = idaParaOMotor(antonina as unknown as EntradaV1, {
      semente: 1,
      variantes: 1,
      viaManual: desenhadas[0]!,
    });
    // O motor tem UMA coluna vertebral, e isso vai dito nos dois lugares: no
    // inventário, como destino, e na perda que a ida declara quando sobra linha.
    const d = IDA_DO_PARCELAMENTO["atracoes[].tipo"]!;
    expect(d.tipo, "virou entrega quando a dívida foi paga, no LAB-37").toBe("traduzido");
    if (d.tipo === "traduzido") expect(d.caminho).toContain("viaManual");
    expect(
      perdas.some((x) => x.campo.includes("atracoes") || x.campo.includes("via desenhada")),
      "sobrou linha desenhada e a ida não declarou a perda",
    ).toBe(true);
  });
});

describe("a dívida declarada — a confissão que não vira desculpa", () => {
  test("`divida` NÃO reprova, e aparece contada", () => {
    // O motor TEM `facesLoteamento` esperando a testada de frente, e a ida ainda
    // não a entrega. Chamar isso de `perda` seria mentir — `perda` quer dizer que o
    // motor não tem onde receber. Então a dívida é um destino próprio: ela não
    // reprova, e **é publicada**, na prova, no relatório e no recado ao chat.
    const a = auditarIda({
      nome: "falsa",
      inventario: {
        atracoes: { tipo: "divida", onde: "facesLoteamento", proposto: "mapear a linha" },
      },
      doContrato: { atracoes: [{}] },
      doMotor: {},
    });
    expect(reprovamNaIda(a)).toHaveLength(0);
    expect(dividasDoLab(a)).toHaveLength(1);
    expect(dividasDoLab(a)[0]!.destino).toBe("facesLoteamento");
    expect(dividasDoLab(a)[0]!.diagnostico).toContain("mapear a linha");
    expect(REGRAS_DA_IDA_QUE_REPROVAM).not.toContain("divida-do-lab");
  });

  test("A DÍVIDA FOI PAGA: `atracoes` é ENTREGA, e nomeia os três destinos", () => {
    // Virada no LAB-37, e virada porque a dívida foi paga — não porque o sinal
    // incomodava (a lição do LAB-33). Os três destinos agora existem: ímã para
    // polígono, `viaManual` para via desenhada, `facesLoteamento` para testada de
    // frente.
    const d = IDA_DO_PARCELAMENTO["atracoes"];
    expect(d!.tipo, "a dívida foi paga no LAB-37: isto é entrega, não confissão").toBe("traduzido");
    if (d!.tipo === "traduzido") {
      expect(d!.caminho).toContain("facesLoteamento");
      expect(d!.caminho).toContain("viaManual");
      expect(d!.caminho).toContain("terreno.atracoes");
    }
  });

  test("não há dívida declarada em NENHUM dos dois inventários — e isso é medido", () => {
    // A categoria existe e está vazia. Se alguém declarar dívida nova, esta trava
    // não reprova — o que reprova é a dívida não ser publicada (abaixo).
    const dividas = [
      ...Object.entries(IDA_DO_PARCELAMENTO),
      ...Object.entries(IDA_DO_SYMBIOS),
    ].filter(([, d]) => d.tipo === "divida");
    expect(dividas.map(([c]) => c), "dívida nova: publique-a na prova e no recado").toEqual([]);
  });

  test("a prova do LAB-30 publica a conta da dívida — zero hoje, e o campo existe", () => {
    // O campo **continua na prova** com zero: *"não há dívida"* e *"ninguém mediu"*
    // são respostas opostas, e sumir com o campo leria como a segunda (D23).
    const prova = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-30", "guarda-da-ida.json"), "utf8"),
    ) as { reprovamNoTotal: number; dividasDoLab: string[]; porRegra: Record<string, number> };
    expect(prova.reprovamNoTotal).toBe(0);
    expect(prova.dividasDoLab, "a dívida foi paga no LAB-37").toEqual([]);
    expect(prova.porRegra["divida-do-lab"], "o campo tem de existir, mesmo zerado").toBe(0);
    expect(Object.keys(prova.porRegra)).toContain("divida-do-lab");
  });

  test("a TESTADA DE FRENTE chega ao motor, e lote faz frente para ela — medido", () => {
    // A trava do que a dívida prometia. `geo-antonina` é a gleba com testada de
    // frente (180 m, face 0 do perímetro coberta a 100 %).
    // `antonina-com-via` é a fixture já carregada que tem testada de frente: a
    // `glebaDoLab` lê de `docs/terrenos/`, onde a Antonina não mora.
    const e = antonina;
    const { testadasDeFrente } = linhasDaEntrada(e);
    expect(testadasDeFrente.length, "a fixture precisa ter testada de frente").toBe(1);

    const pronto = oQueAEsteiraPassaPronto(e);
    expect(pronto.facesLoteamento, "a esteira tem de passar a face coberta").toEqual([0]);

    // E o motor usa: lotes com aresta na testada vão de zero a mais de dez.
    const r = rodarEsteira(e as unknown as EntradaV1, {
      semente: 20260913,
      variantes: 2,
      aparar: true,
      formatos: ["ortogonal"],
    });
    const rCom = rodarEsteira(e as unknown as EntradaV1, {
      semente: 20260913,
      variantes: 2,
      aparar: true,
      formatos: ["ortogonal"],
      facesLoteamento: pronto.facesLoteamento,
    });
    const lotesDe = (x: typeof r) =>
      (x.variantes.filter((v) => v.relatorio)[0]!.saida as unknown as { lotes: { pontos: P[] }[] }).lotes;
    const sem = lotesNaTestadaDeFrente(lotesDe(r), testadasDeFrente)!;
    const com = lotesNaTestadaDeFrente(lotesDe(rCom), testadasDeFrente)!;
    expect(sem.lotes, "sem as faces não havia lote de frente para a rua existente").toBe(0);
    expect(com.lotes, "com as faces o motor tem de pôr lote de frente").toBeGreaterThan(10);
  }, 120_000);
});

// ═════════════════ andar 5 · o ruído separado do sinal (LAB-35) ════════════

describe("a regra 3 partida: promessa não exercitada × mapa-velho", () => {
  /** Uma ida de mentira com um campo de cada destino, e a gleba trazendo nada. */
  const auditarVazia = () =>
    auditarIda({
      nome: "falsa",
      inventario: {
        promete: { tipo: "entregue", caminho: "terreno.promete" },
        traduz: { tipo: "traduzido", caminho: "terreno.traduz", como: "uma conta" },
        perde: { tipo: "perda", motivo: "o motor não tem onde receber" },
        escritura: { tipo: "interno", motivo: "é carimbo do contrato" },
      },
      doContrato: {},
      doMotor: {},
    });

  test("campo que o inventário PROMETE e a gleba não traz vira `promessa-nao-exercitada`", () => {
    // É o aviso que importa: promessa que gleba nenhuma exercita é promessa que a
    // guarda NUNCA verificou — e caminho errado ali é invisível, porque a regra 1
    // só morde quando o contrato traz valor. A forma do D119.
    const p = promessasNaoExercitadas(auditarVazia()).map((a) => a.campo).sort();
    expect(p).toEqual(["promete", "traduz"]);
  });

  test("campo de `perda` ou `interno` que a gleba não traz vira `mapa-velho`, e cala", () => {
    const a = auditarVazia();
    const velhos = a.filter((x) => x.regra === "mapa-velho").map((x) => x.campo).sort();
    expect(velhos).toEqual(["escritura", "perde"]);
    // `avisosQueImportam` é o que o relatório lê: o mapa-velho continua gravado na
    // prova e sai do relatório. Guarda que grita à toa se desliga, e esta cuspia
    // 310 linhas por rodada (D134).
    expect(avisosQueImportam(a).map((x) => x.campo).sort()).toEqual(["promete", "traduz"]);
  });

  test("promessa EXERCITADA não vira aviso nenhum", () => {
    const a = auditarIda({
      nome: "falsa",
      inventario: { promete: { tipo: "entregue", caminho: "terreno.promete" } },
      doContrato: { promete: 7 },
      doMotor: { terreno: { promete: 7 } },
    });
    expect(a).toHaveLength(0);
  });

  test("a dívida declarada NÃO vira mapa-velho quando a gleba não traz o campo", () => {
    // Antes do LAB-35 ela virava: 24 dos 310 avisos eram entradas de dívida em
    // glebas que não trazem o campo. Não há o que confessar se o contrato não
    // trouxe nada — a regra da dívida só fala quando há valor.
    const a = auditarIda({
      nome: "falsa",
      inventario: {
        devo: { tipo: "divida", onde: "terreno.devo", proposto: "entregar isto um dia" },
      },
      doContrato: {},
      doMotor: {},
    });
    expect(a).toHaveLength(0);
  });

  test("nas QUATRO glebas que esta trava roda, NADA reprova e o ruído some do relatório", () => {
    // O nome dizia "nas sete glebas" e a lista tinha **duas** — rótulo prometendo
    // mais do que a trava faz, que é a família de defeito do LAB-39. Corrigido no
    // LAB-40, e com as duas fixtures novas dentro: a varredura das dez glebas mora no
    // `promessas.test.ts`, e esta aqui guarda o caso que importa de perto.
    const glebas: EntradaMinima[] = [glebaDoLab(GLEBA), antonina, comPromessas, comTestada];
    for (const g of glebas) {
      for (const r of [auditarIdaDoParcelamento(g), auditarIdaDoSymbios(g)]) {
        expect(reprovamNaIda(r.achados)).toHaveLength(0);
        // O que fica no relatório é só promessa não exercitada e dívida — e nunca
        // mais a enxurrada de `mapa-velho`.
        for (const a of avisosQueImportam(r.achados)) {
          expect(["promessa-nao-exercitada", "divida-do-lab"]).toContain(a.regra);
        }
      }
    }
  }, 120_000);
});
