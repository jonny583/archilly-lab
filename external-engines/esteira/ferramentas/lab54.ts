/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-54 · As 27 violações `frente` NÃO ATRIBUÍDAS — medidas com a régua DELE.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-48 fechou com **um pedaço sem culpado**, e disse isso em vez de escolher:
 *
 * > *"A minha régua é distância ao eixo menos meia-caixa, e a do Validator é
 * > `_testadaDoLote` contra as `superficiesDeFrente` dele. **As duas não são a mesma
 * > régua**, e usar a minha para dizer 'a régua dele erra em 8 casos' seria exatamente a
 * > forma do D93 e do D127."*
 *
 * Então aqui **nenhuma régua minha atribui nada.** A medição é a função do próprio
 * Generate, `_testadaDoLote`, sobre as superfícies que ele mesmo monta.
 *
 * # Como se pergunta "POR QUE ela devolve zero" sem trocar de régua
 *
 * A função dele decide assim: para cada aresta do lote, toma o **ponto do MEIO** dela e
 * pergunta se ele está a até **`TOL_APOIO_VIA_M` = 0,75 m** do **contorno** de alguma
 * superfície viária. Aresta cujo meio passa o teste é *frontal*; a testada é a maior
 * **sequência contígua** de arestas frontais. Zero arestas frontais ⇒ violação `frente`.
 *
 * **O meio da aresta é uma AMOSTRA.** Numa aresta de 40 m que encosta no leito só numa
 * ponta, o meio está a 20 m de lá — e a aresta inteira some do teste. Isso é hipótese, e
 * hipótese se mede.
 *
 * **O jeito de medir sem régua minha: DENSIFICAR o polígono.** Insiro vértices ao longo
 * de cada aresta — **a borda é a mesma, a área é a mesma**, só a amostragem muda — e
 * chamo a função DELE outra vez. Se ela passa a devolver testada > 0, então:
 *
 * > **o lote DE FATO encosta em superfície viária, e o que não encostava era a amostra.**
 *
 * E a conclusão é dele, não minha: foi o código dele que mudou de resposta sobre o mesmo
 * polígono. **Há precondição:** se a área mudar mais de 1 mm², o meu probe mexeu no
 * objeto, e a ferramenta **para**. Densificar que altera a geometria não é probe, é
 * conserto disfarçado.
 *
 * O negativo também é medido, e com resolução declarada: a passagem fina usa passo de
 * **0,25 m**, então "nenhuma amostra a ≤ 0,75 m do contorno" significa que **nenhum ponto
 * da borda** está a menos de ~0,62 m. Lote que continua zero ali é **do motor**: ele não
 * tem rua nenhuma perto.
 *
 * Uso: `bun run lab54`  (a tampa de exemplos vai levantada pelo `package.json`)
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import {
  _faixasViaQuadsComId,
  _interseccaoConvexa,
  _testadaDoLote,
  superficiesDeFrente,
  verificarInvariantesPlano,
} from "@generate/engine/invariantes.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { contratoDasEntradas, type EntradaMinima } from "../src/gleba-v1.ts";
import type { P } from "../src/motores/comum.ts";
import {
  amostrasParaOPasso,
  area as areaDe,
  densificar,
  probeMexeuNoObjeto,
} from "../src/probe-de-amostragem.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-54");
const SEMENTE = 20260913;

/** A tolerância DELE, copiada aqui só para o registro dizer contra o que mediu. */
const TOL_DELE_M = 0.75;
/** Passo da passagem fina, em metros. Decide a força do NEGATIVO. */
const PASSO_FINO_M = 0.25;

/**
 * O contrafactual do LAB-48/LAB-53, por lote — **não se remede aqui**.
 *
 * A pergunta *"esta violação sumiria com o campo `faixaViaPublica` que falta no contrato?"*
 * já foi medida, com a geometria do próprio Generate. Repetir a medição dentro deste prompt
 * daria um segundo número para a mesma pergunta, e dois números da mesma pergunta em dois
 * arquivos é o que o D116 proíbe. Então ele é **lido** da prova e cruzado por lote.
 */
const CONTRAFACTUAL_DO_LAB53: Map<string, boolean | null> = (() => {
  const m = new Map<string, boolean | null>();
  const arq = join(RAIZ, "docs", "provas", "LAB-53", "violacoes-depois-do-conserto-da-ponte.json");
  const prova = JSON.parse(readFileSync(arq, "utf8")) as {
    violacoes: { gleba: string; tipo: string; loteId: string | null; someComAFaixaViaPublica: boolean | null }[];
  };
  for (const v of prova.violacoes) {
    if (v.tipo === "frente" && v.loteId) m.set(`${v.gleba}|${v.loteId}`, v.someComAFaixaViaPublica);
  }
  return m;
})();

const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
];

const comprimento = (a: P, b: P) => Math.hypot(b.x - a.x, b.y - a.y);

/**
 * A testada que a função DELE devolve — com a conferência que a varredura do LAB-52 cobrou.
 *
 * **Quem achou isto foi a minha própria trava**, no verde deste prompt: a regra
 * `numero-sem-conferir` acusou `const testadaFina = Number(…)` sem nenhum
 * `Number.isFinite` no arquivo. E ela estava certa, porque aqui a degradação é **uma
 * acusação publicável**:
 *
 * > `NaN > 0` é `false`, então um `NaN` vindo daqui faria o lote ser classificado
 * > **`motor-sem-via-perto`** — isto é, o Lab acusaria o motor do vizinho por um número que
 * > não é número.
 *
 * É exatamente a classe (a) que a Central nomeou — *erro não conferido que degrada para
 * número que PARECE certo* — e a forma do D175: **o caminho errado que estoura é barato; o
 * que devolve silêncio é uma acusação publicável.** Então aqui ele **estoura**.
 */
function testadaDele(pontos: readonly P[], superficies: P[][], onde: string): number {
  const t = _testadaDoLote(pontos as never, superficies as never);
  if (!Number.isFinite(t)) {
    console.error(
      `✗ ${onde}: o \`_testadaDoLote\` do Generate devolveu \`${t}\`, que não é número.\n` +
        `  Sem conferir, \`${t} > 0\` seria \`false\` e este lote sairia classificado como\n` +
        `  'motor-sem-via-perto' — uma acusação ao motor do vizinho feita por um NaN.`,
    );
    process.exit(1);
  }
  return t;
}

type Linha = Record<string, unknown>;
const porGleba: Linha[] = [];
const todos: Linha[] = [];
const precondicoes: string[] = [];

for (const { id, entrada } of GLEBAS) {
  const r = rodarTestfit(entrada, SEMENTE);
  const l = montarParcelamentoExterno(r.saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) {
    porGleba.push({ gleba: id, recusadoPeloEsquema: l.conferencia.erros.slice(0, 3) });
    continue;
  }
  const res = l.externo.resultado;
  const rel = verificarInvariantesPlano(res);
  if (rel.exemplos.length !== rel.violacoes) {
    console.error(
      `✗ ${id}: ${rel.violacoes} violações e só ${rel.exemplos.length} exemplos.\n` +
        `  Rode assim:  INVARIANTES_EXEMPLOS=100000 bun ferramentas/lab54.ts`,
    );
    process.exit(1);
  }

  // ── AS SUPERFÍCIES SÃO AS DELE, montadas como o invariante as monta ──────
  const vias = [...res.rede.principal, ...res.rede.secundarias];
  const superficies = [
    ...superficiesDeFrente(vias, res.culDeSacs ?? []),
    ...((res.faixaViaPublica ?? []) as P[][]),
  ] as P[][];
  const quadsDeVia = _faixasViaQuadsComId(vias);

  const lotePorId = new Map(res.lotes.map((lo) => [lo.id, lo]));
  const acusados = rel.exemplos.filter((v) => v.tipo === "frente");

  const classes: Record<string, number> = {};
  for (const v of acusados) {
    const lote = v.loteId ? lotePorId.get(v.loteId) : undefined;
    if (!lote) continue;
    const pts = lote.pontos as P[];
    const arestas = pts.map((a, i) => Number(comprimento(a, pts[(i + 1) % pts.length]!).toFixed(2)));
    const maior = Math.max(...arestas);

    // 1 · A ACUSAÇÃO, refeita com a função DELE: tem de dar zero.
    const comoEsta = testadaDele(pts, superficies, `${id}/${v.loteId} como está`);

    // 2 · A ESCADA: o menor número de amostras por aresta que faz a resposta DELE virar.
    let kQueVira: number | null = null;
    let testadaQuandoVira: number | null = null;
    for (const k of [2, 4, 8, 16, 32, 64, 128]) {
      const denso = densificar(pts, k);
      // PRECONDIÇÃO: densificar não pode mudar a geometria.
      const mexeu = probeMexeuNoObjeto(pts, denso);
      if (mexeu !== null) {
        precondicoes.push(`${id}/${v.loteId}: densificar MEXEU no objeto (k=${k}) — ${mexeu}`);
        break;
      }
      const t = testadaDele(denso, superficies, `${id}/${v.loteId} k=${k}`);
      if (t > 0) {
        kQueVira = k;
        testadaQuandoVira = Number(t.toFixed(2));
        break;
      }
    }

    // 3 · A PASSAGEM FINA: passo de 0,25 m, que é o que dá força ao negativo.
    const kFino = amostrasParaOPasso(maior, PASSO_FINO_M);
    const testadaFina = testadaDele(densificar(pts, kFino), superficies, `${id}/${v.loteId} fino`);

    // 4 · QUAL aresta era a frontal perdida — densificando UMA de cada vez.
    const arestasQueViram: number[] = [];
    if (testadaFina > 0) {
      for (let i = 0; i < pts.length; i++) {
        const k = amostrasParaOPasso(arestas[i]!, PASSO_FINO_M);
        if (testadaDele(densificar(pts, k, i), superficies, `${id}/${v.loteId} aresta ${i}`) > 0) {
          arestasQueViram.push(i);
        }
      }
    }

    // 5 · O lote está SOBRE um leito? (a hipótese do "engolido", com a função dele)
    let areaSobreLeito = 0;
    for (const q of quadsDeVia) {
      const inter = _interseccaoConvexa(pts as never, q.quad as never);
      if (inter) areaSobreLeito += areaDe(inter as P[]);
    }

    // ── A SEGUNDA METADE, e sem ela a conclusão sairia pela metade ──────────
    //
    // Se a amostragem fosse fina, a função dele devolveria testada > 0 e a violação
    // `frente` sumiria. **Mas sumir não é passar:** o invariante seguinte compara essa
    // mesma testada com o mínimo, e com a MESMA troca de régua por lote de fachada que o
    // original faz. Então a pergunta é se a violação DESAPARECE ou só TROCA DE ETIQUETA.
    const pl = res.params as {
      testadaMin: number;
      lotesFrente?: { testadaMinM?: number };
      loteamentoFachada?: { testadaMin?: number };
    };
    const lo = lote as unknown as { loteFrente?: boolean; deLoteamentoFachada?: boolean };
    const testadaMinUsada =
      (lo.loteFrente ? pl.lotesFrente?.testadaMinM : undefined) ??
      (lo.deLoteamentoFachada ? pl.loteamentoFachada?.testadaMin : undefined) ??
      pl.testadaMin;
    const viraViolacaoDeTestada = testadaFina > 0 && testadaFina < testadaMinUsada * 0.98;

    const classe =
      comoEsta > 0
        ? "NAO-REPRODUZIU"
        : testadaFina > 0
          ? "regua-amostragem-no-meio-da-aresta"
          : "motor-sem-via-perto";
    classes[classe] = (classes[classe] ?? 0) + 1;

    todos.push({
      gleba: id,
      loteId: v.loteId ?? null,
      area_m2: Number((lote.area as number).toFixed(1)),
      arestas_m: arestas,
      maiorAresta_m: Number(maior.toFixed(2)),
      // Tudo abaixo é a função DELE respondendo, não régua minha.
      testadaComoEsta_m: Number(comoEsta.toFixed(2)),
      kQueVira,
      testadaQuandoVira_m: testadaQuandoVira,
      testadaComPassoFino_m: Number(testadaFina.toFixed(2)),
      passoFino_m: PASSO_FINO_M,
      amostrasPorAresta_passagemFina: kFino,
      arestasQueViramFrontais: arestasQueViram,
      areaSobreLeitoDeVia_m2: Number(areaSobreLeito.toFixed(2)),
      // O limiar é DELE, com a mesma troca de régua por lote de fachada do invariante.
      testadaMinUsada_m: testadaMinUsada,
      viraViolacaoDeTestada,
      // Lido da prova do LAB-53, não remedido aqui (D116).
      someComAFaixaViaPublica_LAB53: CONTRAFACTUAL_DO_LAB53.get(`${id}|${v.loteId}`) ?? null,
      classe,
    });
  }

  porGleba.push({
    gleba: id,
    variante: r.variante,
    lotes: res.lotes.length,
    violacoesFrente: acusados.length,
    porClasse: classes,
    superficiesDeFrente: superficies.length,
    temFaixaViaPublica: (res.faixaViaPublica ?? []).length > 0,
  });
}

if (precondicoes.length) {
  console.error("✗ PRECONDIÇÃO FALHOU — o probe mexeu na geometria:");
  for (const p of precondicoes) console.error(`  ${p}`);
  process.exit(1);
}

const classesTotais: Record<string, number> = {};
for (const t of todos) classesTotais[String(t.classe)] = (classesTotais[String(t.classe)] ?? 0) + 1;

/**
 * O SALDO LÍQUIDO de consertar a amostragem — e é ele que diz se vale a pena.
 *
 * `trocaDeEtiqueta`: a `frente` sumiria e uma `testada` nasceria no mesmo lote.
 * `violacaoQueSOME`: a `frente` sumiria e nada nasceria — lote que passaria a ser legal.
 */
const queViramTotal = todos.filter((t) => t.classe === "regua-amostragem-no-meio-da-aresta");
const trocaDeEtiqueta = queViramTotal.filter((t) => t.viraViolacaoDeTestada === true).length;
const violacaoQueSOME = queViramTotal.length - trocaDeEtiqueta;

console.log("══════════ LAB-54 · as violações `frente`, com a régua DELE ══════════");
for (const g of porGleba) {
  console.log(
    `  ${String(g.gleba).padEnd(24)} frente=${String(g.violacoesFrente).padStart(3)} · ${JSON.stringify(g.porClasse)}`,
  );
}
console.log("");
console.log(`  TOTAL de \`frente\`: ${todos.length} · ${JSON.stringify(classesTotais)}`);
console.log(`  dos que VIRAM com amostragem fina: ${trocaDeEtiqueta} só TROCAM de etiqueta (viram \`testada\`) e ${violacaoQueSOME} de fato SOMEM`);
const viram = todos.filter((t) => t.classe === "regua-amostragem-no-meio-da-aresta");
if (viram.length) {
  const ks = [...new Set(viram.map((t) => t.kQueVira))].sort((a, b) => Number(a) - Number(b));
  console.log(`  amostras por aresta que bastaram: ${JSON.stringify(ks)}`);
  console.log(
    `  testada que aparece: ${Math.min(...viram.map((t) => Number(t.testadaComPassoFino_m))).toFixed(2)} a ` +
      `${Math.max(...viram.map((t) => Number(t.testadaComPassoFino_m))).toFixed(2)} m`,
  );
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "frente-nao-atribuida.json"),
  JSON.stringify(
    {
      prompt: "LAB-54",
      oQueIstoMede:
        "por que a função `_testadaDoLote` DO GENERATE devolve zero nos lotes acusados de `frente`, " +
        "medido com a função dele sobre as superfícies que ele mesmo monta — nenhuma régua do Lab atribui aqui",
      aReguaEhDele: {
        funcao: "_testadaDoLote (src/lib/engine/invariantes.ts do Generate)",
        superficies: "superficiesDeFrente(vias, culDeSacs) + faixaViaPublica, como o invariante as monta",
        tolerancia_m: TOL_DELE_M,
        comoEleDecide:
          "para cada aresta, o PONTO DO MEIO dela a até 0,75 m do CONTORNO de alguma superfície; " +
          "a testada é a maior sequência contígua de arestas frontais",
      },
      oProbe: {
        oQue: "densificar o polígono — inserir vértices ao longo das arestas, mesma borda e mesma área",
        porque:
          "muda só a AMOSTRAGEM, e a resposta volta a ser dada pela função DELE. Se ela vira, o lote " +
          "encostava e o que não encostava era a amostra",
        precondicoes: [
          "a ÁREA não pode mudar (teto 1e-6 m²)",
          "e TODO ponto novo tem de estar SOBRE a borda original (teto 1e-9 m) — esta segunda " +
            "nasceu de uma sabotagem: deslocar todos os pontos em 1 cm é uma TRANSLAÇÃO, não muda " +
            "área nenhuma, e seria o pior erro possível num probe que mede DISTÂNCIA até o leito (D186)",
        ],
        forcaDoNegativo: `passo de ${PASSO_FINO_M} m ⇒ nenhuma amostra a ≤ ${TOL_DELE_M} m significa nenhum ponto da borda a menos de ~${(TOL_DELE_M - PASSO_FINO_M / 2).toFixed(2)} m`,
      },
      quando: new Date().toISOString(),
      motor: "Laboratório de Parcelamento (motor-testfit) — o motor PADRÃO da tela unificada",
      semente: SEMENTE,
      contrato: contratoDasEntradas(GLEBAS.map((g) => g.entrada)),
      glebas: porGleba,
      total: {
        violacoesFrente: todos.length,
        porClasse: classesTotais,
        saldoDeConsertarAAmostragem: {
          frenteQueSumiria: queViramTotal.length,
          dasQuaisSoTrocamDeEtiqueta: trocaDeEtiqueta,
          dasQuaisDeFatoSOMEM: violacaoQueSOME,
          porque:
            "a testada que aparece com amostragem fina é a frontagem REAL do lote; se ela ficar " +
            "abaixo do mínimo declarado, o invariante seguinte acusa `testada` no mesmo lote — a " +
            "violação troca de nome e não de existência",
        },
      },
      violacoes: todos,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-54/frente-nao-atribuida.json`);
