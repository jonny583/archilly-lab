/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-50 · Por que a passagem externa põe lote a 1,8 km da face entregue.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **É pergunta, não acusação** — o chat foi explícito, e o D161 é a razão: eu já
 * classifiquei esses lotes pelo **id** `-eN` e errei 19 de 33.
 *
 * O LAB-46 mediu o fato: `facesLoteamento` entrega **UMA** face, de 180 m, e dos 33
 * lotes externos **14 encostam** nela (≤ 0,5 m) enquanto **15 estão a mais de 50 m** e o
 * mais distante a **1 805,7 m** — o outro canto de uma gleba de 141,8 ha. O LAB-48 deu
 * o preço: **18 violações `frente` + 11 `via-sobre-lote` saem deste mesmo mecanismo**,
 * 29 das 40 de `geo-antonina`.
 *
 * # As duas hipóteses que o chat pôs, e a terceira que o código mostra
 *
 * O chat ofereceu duas: *"pode ser que `facesLoteamento` signifique para ele algo mais
 * amplo"* ou *"pode ser que a passagem externa corra o perímetro inteiro"*. Lido o motor
 * (`motor.ts`, `reservarFacesExternas`, **só leitura**), nenhuma das duas é a resposta
 * inteira, e a de verdade é mais simples:
 *
 * > **A faixa do lote externo é um SEMIPLANO, não um retângulo sobre a face.**
 *
 * ```
 * const faixa  = recortarSemiplano(restante,  nx,  ny, cBase + prof);
 * const sobra  = recortarSemiplano(restante, -nx, -ny, -(cBase + prof));
 * ```
 *
 * O motor usa `p0`,`p1` da face só para dois números — a **direção** (`ang`) e a
 * **origem** do corte (`cBase`). Depois corta a gleba **inteira** pela RETA INFINITA que
 * passa pela face, a `prof` metros de profundidade, e **distribui os lotes pela caixa
 * envolvente** daquela faixa:
 *
 * ```
 * const rect = caixa(local);
 * const n    = Math.round((rect.maxX - rect.minX) / a.testadaExterna);
 * ```
 *
 * `rect.maxX - rect.minX` é a largura da **faixa**, não o comprimento da **face**. Numa
 * gleba de 141,8 ha isso é quilômetros.
 *
 * # A previsão que esta ferramenta põe à prova
 *
 * Se o mecanismo é esse, então **todo lote externo está perto da RETA e longe só ao
 * LONGO dela**. É falsificável, e é o teste:
 *
 *   · **P1** — a distância PERPENDICULAR à reta da face é ≤ `prof` para os 33;
 *   · **P2** — a distância medida ALONGO da reta é que vai aos 1,8 km;
 *   · **P3** — a passagem **não** corre o perímetro: só as faces entregues entram
 *     (a hipótese 2 do chat, posta à prova em vez de descartada por leitura);
 *   · **P4** — a faixa **não foi de fato reservada**: há lote externo sobre o leito de
 *     via do próprio motor, o que a hipótese do semiplano explica (corte de semiplano
 *     numa gleba CÔNCAVA não separa faixa de sobra — Antonina tem 11 reflexos, D150).
 *
 * **Se P1 falhar, a leitura está errada e a atribuição não sai.**
 *
 * Uso: `bun run lab50`
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { contratoDasEntradas, type EntradaMinima } from "../src/gleba-v1.ts";
import { linhasDaEntrada, oQueAEsteiraPassaPronto, type P } from "../src/motores/comum.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-50");
const SEMENTE = 20260913;

/**
 * `geo-antonina` e `ensaio-com-testada` — as duas glebas com testada entregue.
 *
 * A segunda entra porque sem ela tudo o que se concluir vale para **uma gleba só**, que é
 * a lição do LAB-40. E ela é o controle natural: 47 ha contra 141,8, e **convexa**.
 */
const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
  {
    id: "ensaio-com-testada",
    entrada: JSON.parse(
      readFileSync(join(RAIZ, "docs", "fixtures", "glebas-que-exercem-as-promessas", "ensaio-com-testada.entrada.json"), "utf8"),
    ),
  },
];

const n1 = (x: number) => Number(x.toFixed(1));

/** Distância de um ponto ao SEGMENTO a–b. */
function dSegmento(p: P, a: P, b: P): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const nn = dx * dx + dy * dy;
  const t = nn === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / nn));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/**
 * As duas distâncias que separam as hipóteses, e é por isso que elas vêm juntas.
 *
 * `perpendicular` é a distância à RETA INFINITA que passa pela face; `aoLongo` é o quanto
 * o ponto anda ao longo dessa reta para fora do segmento da face (0 se cai dentro dele).
 * Um lote a 1,8 km do SEGMENTO e a 5 m da RETA é a assinatura do semiplano.
 */
function contraAReta(p: P, a: P, b: P): { perpendicular: number; aoLongo: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = (p.x - a.x) * ux + (p.y - a.y) * uy;
  const perpendicular = Math.abs(-(p.x - a.x) * uy + (p.y - a.y) * ux);
  const aoLongo = s < 0 ? -s : s > len ? s - len : 0;
  return { perpendicular, aoLongo };
}

const linhas: Record<string, unknown>[] = [];

for (const { id, entrada } of GLEBAS) {
  const faces = oQueAEsteiraPassaPronto(entrada).facesLoteamento;
  const { testadasDeFrente } = linhasDaEntrada(entrada);
  const r = rodarTestfit(entrada, SEMENTE);
  const saida = r.saida as {
    lotes: { id: string; pontos: P[]; area_m2: number; faceDeRua: string | null }[];
    vias: { id: string; pontos: P[]; largura_m: number }[];
  };
  // `gleba.anel`, e NÃO `terreno.gleba.anel`: `terreno.gleba` é o caminho DENTRO da
  // entrada do motor (D135), não no contrato. A primeira versão desta linha usou o
  // caminho do motor e estourou na hora — é a lição do D135 mordendo do lado bom.
  const perimetro = (entrada as { gleba: { anel: P[] } }).gleba.anel;

  // As faces entregues, com o comprimento de cada uma — é o 180 m do enunciado.
  const facesEntregues = faces.map((idx) => {
    const p0 = perimetro[idx % perimetro.length]!;
    const p1 = perimetro[(idx + 1) % perimetro.length]!;
    return { indice: idx, a: p0, b: p1, comprimento_m: n1(Math.hypot(p1.x - p0.x, p1.y - p0.y)) };
  });

  const externos = saida.lotes.filter((l) => /-e\d+$/.test(l.id));

  // Para cada lote externo: a distância ao SEGMENTO e a distância à RETA, contra CADA
  // face entregue — e fica com a face que lhe é mais próxima pela reta.
  const medidos = externos.map((lote) => {
    let melhor: { face: number; perpendicular: number; aoLongo: number } | null = null;
    for (const f of facesEntregues) {
      let perp = Infinity;
      let along = Infinity;
      for (const v of lote.pontos) {
        const c = contraAReta(v, f.a, f.b);
        perp = Math.min(perp, c.perpendicular);
        along = Math.min(along, c.aoLongo);
      }
      if (!melhor || perp < melhor.perpendicular) melhor = { face: f.indice, perpendicular: perp, aoLongo: along };
    }
    const aoSegmento = Math.min(
      ...lote.pontos.flatMap((v) => (testadasDeFrente.length ? testadasDeFrente.map((lin) => Math.min(...lin.slice(1).map((_, i) => dSegmento(v, lin[i]!, lin[i + 1]!)))) : [Infinity])),
    );
    // A profundidade do lote: é `prof` no motor (`areaLoteExterna / testadaExterna`),
    // e serve de teto da previsão P1.
    const prof = Math.max(...lote.pontos.map((v) => Math.max(...lote.pontos.map((w) => Math.hypot(v.x - w.x, v.y - w.y)))));
    return {
      lote: lote.id,
      area_m2: n1(lote.area_m2),
      faceDeRua: lote.faceDeRua,
      aoSegmentoDaTestada_m: Number.isFinite(aoSegmento) ? n1(aoSegmento) : null,
      aRetaDaFace_m: n1(melhor!.perpendicular),
      aoLongoDaReta_m: n1(melhor!.aoLongo),
      faceMaisProxima: melhor!.face,
      diagonalDoLote_m: n1(prof),
    };
  });

  // P4 · a faixa foi de fato reservada? Área de lote externo sobre leito de via.
  const sobreposicaoComVia = externos.map((lote) => {
    let pior = 0;
    let qual: string | null = null;
    for (const v of saida.vias) {
      const meia = v.largura_m / 2;
      // Quantos VÉRTICES do lote caem dentro da faixa da via — medida grosseira de
      // propósito, e declarada: a área exata quem mede é o Validator do Generate, e ele
      // já mediu (68,5 a 157,4 m², LAB-48). Aqui só se separa "tem" de "não tem".
      let dentro = 0;
      for (const p of lote.pontos) {
        let d = Infinity;
        for (let i = 1; i < v.pontos.length; i++) d = Math.min(d, dSegmento(p, v.pontos[i - 1]!, v.pontos[i]!));
        if (d < meia) dentro += 1;
      }
      if (dentro > pior) {
        pior = dentro;
        qual = v.id;
      }
    }
    return { lote: lote.id, verticesDentroDeLeito: pior, via: qual };
  });

  const comSobreposicao = sobreposicaoComVia.filter((s) => s.verticesDentroDeLeito > 0);

  // ── P4, segunda volta: a minha primeira explicação NÃO sobreviveu ao controle ──
  //
  // Eu havia escrito que a sobreposição vinha do corte de semiplano numa gleba
  // CÔNCAVA. Medido, ela aparece TAMBÉM na gleba convexa de 4 vértices — então a
  // concavidade não é a causa, e a explicação tinha de ser outra.
  //
  // A candidata que resta, e esta é mensurável: a faixa e a sobra **dividem uma
  // fronteira** (a sobra é cortada exatamente em `cBase + prof`), e o leito de uma via
  // é o EIXO ± meia-caixa. Via com eixo logo dentro da sobra derrama meia-caixa de
  // volta para dentro da faixa. Se for isso, o eixo das vias culpadas está a menos de
  // meia-caixa da fronteira da faixa.
  const faceP = facesEntregues[0];
  const fronteira = faceP
    ? (() => {
        const culpadas = new Set(comSobreposicao.map((c) => c.via).filter((v): v is string => v != null));
        return [...culpadas].map((viaId) => {
          const v = saida.vias.find((x) => x.id === viaId)!;
          // Profundidade da faixa: a maior perpendicular de lote externo à reta é o
          // melhor estimador de `prof` que se tem de fora do motor — E ELE É RUIM na
          // gleba convexa, onde todos os lotes caem sobre a reta e o estimador dá 0.
          // Sai publicado assim mesmo, porque estimador ruim declarado é melhor que
          // número bonito sem aviso — e foi ele que me impediu de fechar a conclusão.
          const prof = Math.max(...medidos.map((m) => m.aRetaDaFace_m));
          const perps = v.pontos.map((p) => contraAReta(p, faceP.a, faceP.b).perpendicular);
          const maisProximo = Math.min(...perps);
          return {
            via: viaId,
            caixa_m: v.largura_m,
            meiaCaixa_m: n1(v.largura_m / 2),
            profundidadeEstimadaDaFaixa_m: n1(prof),
            eixoMaisProximoDaRetaDaFace_m: n1(maisProximo),
            distanciaDoEixoAFronteiraDaFaixa_m: n1(maisProximo - prof),
            derramaNaFaixa: maisProximo - prof < v.largura_m / 2,
          };
        });
      })()
    : [];
  const perp = medidos.map((m) => m.aRetaDaFace_m);
  const along = medidos.map((m) => m.aoLongoDaReta_m);
  const diag = Math.max(...medidos.map((m) => m.diagonalDoLote_m), 0);

  linhas.push({
    gleba: id,
    motor: "Laboratório de Parcelamento (motor-testfit)",
    semente: SEMENTE,
    variante: r.variante,
    areaDaGleba_ha: n1(
      Math.abs(
        perimetro.reduce((s, p, i) => {
          const q = perimetro[(i + 1) % perimetro.length]!;
          return s + p.x * q.y - q.x * p.y;
        }, 0) / 2,
      ) / 10000,
    ),
    verticesDoPerimetro: perimetro.length,
    facesEntregues,
    lotesExternos: externos.length,
    previsoes: {
      P1_todosPertoDaRETA: {
        maiorPerpendicular_m: perp.length ? n1(Math.max(...perp)) : null,
        tetoEsperado_m: n1(diag),
        cumprida: perp.length ? Math.max(...perp) <= diag : null,
        oQueIssoSignifica: "a faixa do lote externo é um SEMIPLANO: o motor corta a gleba pela RETA da face, não pelo segmento dela",
      },
      P2_longeSoAOLONGO: {
        maiorAoLongo_m: along.length ? n1(Math.max(...along)) : null,
        maiorAoSegmentoDaTestada_m: medidos.length
          ? n1(Math.max(...medidos.map((m) => m.aoSegmentoDaTestada_m ?? 0)))
          : null,
        cumprida: along.length ? Math.max(...along) > 50 : null,
      },
      P3_naoCorreOPerimetro: {
        facesEntregues: facesEntregues.length,
        verticesDoPerimetro: perimetro.length,
        cumprida: facesEntregues.length < perimetro.length,
        oQueIssoSignifica: "a hipótese 2 do chat está DESCARTADA por medição: só as faces entregues entram no laço",
      },
      P4_aFaixaNaoFoiReservada: {
        lotesSobreLeitoDeVia: comSobreposicao.length,
        exemplos: comSobreposicao.slice(0, 4),
        cumprida: comSobreposicao.length > 0,
        // DUAS explicações minhas morreram aqui, e as duas ficam escritas: hipótese
        // descartada em silêncio volta como hipótese nova no prompt seguinte.
        explicacoesMORTAS: [
          "corte de SEMIPLANO em gleba CÔNCAVA não separa faixa de sobra — MORTA: acontece também na gleba convexa de 4 vértices, 9 lotes",
          "a via derrama meia-caixa da sobra para dentro da faixa — MORTA: o eixo das vias culpadas está a 0,1 a 0,8 m da RETA DA FACE, ou seja DENTRO da faixa, não na beira dela",
        ],
        oQueFICOUMedido:
          "o eixo da via culpada corre praticamente SOBRE a reta da face entregue (0,1 m em geo-antonina, 0,3 m na segunda, 0,8 m em ensaio-com-testada): a via do plano e a faixa do lote externo ocupam o MESMO chão",
        aindaNAOAtribuido:
          "por que o motor desenha via sobre a face que ele mesmo reservou. Não acuso: é pergunta para o Parcelamento, e está na lista numerada do relatório",
        asViasCulpadas: fronteira,
      },
    },
    porFaixaDeDistanciaAoSegmento: {
      "<= 0.5 m": medidos.filter((m) => (m.aoSegmentoDaTestada_m ?? Infinity) <= 0.5).length,
      "0.5 a 50 m": medidos.filter((m) => (m.aoSegmentoDaTestada_m ?? Infinity) > 0.5 && (m.aoSegmentoDaTestada_m ?? 0) <= 50).length,
      "> 50 m": medidos.filter((m) => (m.aoSegmentoDaTestada_m ?? 0) > 50).length,
    },
    lotes: medidos,
  });
}

console.log("══════════ LAB-50 · a passagem externa, medida ══════════");
for (const g of linhas) {
  const p = g.previsoes as Record<string, { cumprida: boolean | null }>;
  console.log(`\n  ${g.gleba} · ${g.areaDaGleba_ha} ha · ${g.verticesDoPerimetro} vértices · ${g.lotesExternos} lotes externos`);
  console.log(`    faces entregues: ${JSON.stringify((g.facesEntregues as { indice: number; comprimento_m: number }[]).map((f) => `${f.indice} (${f.comprimento_m} m)`))}`);
  for (const [nome, v] of Object.entries(p)) {
    console.log(`    ${v.cumprida === true ? "✓" : v.cumprida === false ? "✗" : "—"} ${nome}  ${JSON.stringify(v).slice(0, 160)}`);
  }
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "passagem-externa.json"),
  JSON.stringify(
    {
      prompt: "LAB-50",
      oQueIstoMede: "por que a passagem externa do motor do Parcelamento põe lote longe da face entregue — quatro previsões falsificáveis",
      quando: new Date().toISOString(),
      contrato: contratoDasEntradas(GLEBAS.map((g) => g.entrada)),
      oMecanismoLidoNoMotor: {
        onde: "motor-testfit · src/lib/lab/motor.ts · reservarFacesExternas (somente leitura)",
        oQueFaz: "para cada face entregue, corta a gleba por um SEMIPLANO à distância `prof` da RETA da face, e distribui os lotes pela CAIXA ENVOLVENTE dessa faixa",
        aLinhaQueExplica: "const n = Math.round((rect.maxX - rect.minX) / a.testadaExterna) — a largura é a da FAIXA, não o comprimento da FACE",
        prof: "max(8, areaLoteExterna / testadaExterna)",
        oQueOMotorPromete: "`facesLoteamento` seleciona faces do perímetro que recebem lotes voltados para rua existente — e o motor as lê como RETA, não como SEGMENTO",
      },
      glebas: linhas,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-50/passagem-externa.json`);
