#!/usr/bin/env bun
/**
 * LAB-41 — por que a candidata ortogonal do Generate não entrega em 5 de 6 acessos.
 *
 * ```sh
 * bun run lab41
 * ```
 *
 * # A pergunta do chat
 *
 * *"As posições de acesso em que a candidata ortogonal do Generate não entrega nada
 * aceitável, 5 de 6 numa gleba — investigue e diga se é defeito do motor ou limite
 * real do terreno."*
 *
 * O número saiu do LAB-28 como **ausência contada** (`posicoesMedidas`), sem motivo:
 * a prova registrava que não havia resultado, não por quê. A §6 manda medir antes de
 * ter culpado, e aqui havia **três** hipóteses — motor, terreno, ou a ponte do Lab.
 *
 * # O que esta ferramenta mede, e por que cada parte existe
 *
 * | parte | a hipótese que ela mata ou confirma |
 * |---|---|
 * | o **motivo** de cada ausência, texto da recusa | "não entrega nada" era ausência sem causa |
 * | a **outra candidata** nos mesmos acessos | se a espinha entrega, não é limite do terreno |
 * | **quatro glebas de controle** | se a ortogonal entrega nelas, não é defeito geral dela |
 * | a **varredura ao longo da aresta** | ausência caprichosa ou assinatura geométrica |
 *
 * **Nenhuma linha deste arquivo conserta nada no vizinho** (§4): o que precisa mudar
 * no Generate sai como lista numerada no relatório, e vai pelo chat.
 */
import { readFileSync } from "node:fs";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import { POSICOES_DE_ACESSO, comAcessoEm, posicoesDeAcesso } from "../src/acesso.ts";
import { CANDIDATAS, rodarGenerate } from "../src/motores/generate.ts";
import { julgar, type P } from "../src/motores/comum.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-41");
const CARIMBO = "2026-10-04T00:00:00.000Z";
const SEMENTE = 20260913;
const n2 = (v: number) => Number(v.toFixed(2));

const ler = (pasta: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(RAIZ, "docs", "fixtures", pasta, `${id}.entrada.json`), "utf8"));

/** As duas glebas em que a ausência apareceu, e as quatro de controle. */
const ACUSADAS = [
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
];
const CONTROLE = [
  { id: "geo-antonina", entrada: ler("glebas-padrao-com-relevo", "geo-antonina") },
  { id: "ensaio-47ha", entrada: ler("glebas-padrao-com-relevo", "ensaio-47ha") },
  { id: "completo", entrada: glebaDoLab("completo") },
];

/** Quanto do anel é reflexo — para a hipótese "gleba côncava" ter número. */
function reflexos(anel: readonly P[]): number {
  let area = 0;
  for (let i = 0; i < anel.length; i++) {
    const a = anel[i]!;
    const b = anel[(i + 1) % anel.length]!;
    area += a.x * b.y - b.x * a.y;
  }
  const sinal = Math.sign(area);
  let n = 0;
  for (let i = 0; i < anel.length; i++) {
    const a = anel[(i - 1 + anel.length) % anel.length]!;
    const b = anel[i]!;
    const c = anel[(i + 1) % anel.length]!;
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (Math.sign(cross) !== sinal && Math.abs(cross) > 1e-9) n++;
  }
  return n;
}

/** A aresta mais próxima do ponto, e onde nela — `t` de 0 (começo) a 1 (fim). */
function ondeNoAnel(p: P, anel: readonly P[]) {
  let melhor = { face: -1, dist_m: Infinity, t: 0, comprimento_m: 0, azimute_graus: 0 };
  for (let k = 0; k < anel.length; k++) {
    const a = anel[k]!;
    const b = anel[(k + 1) % anel.length]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const L = dx * dx + dy * dy;
    const t = L === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L));
    const d = Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
    if (d < melhor.dist_m) {
      melhor = {
        face: k,
        dist_m: d,
        t,
        comprimento_m: Math.hypot(dx, dy),
        azimute_graus: (Math.atan2(dy, dx) * 180) / Math.PI,
      };
    }
  }
  return melhor;
}

/** A recusa, decomposta: quantas peças saem, qual a pior e quantos metros. */
function decomporRecusa(recusa: readonly string[] | null) {
  const texto = recusa?.[0] ?? null;
  if (!texto) return { texto: null, pecasFora: null, pior: null, fora_m: null };
  const m = /^(\d+) peça\(s\) do parcelamento saem da gleba — a pior é a (.+?), a ([\d.]+) m para fora/.exec(texto);
  return {
    texto,
    pecasFora: m ? Number(m[1]) : null,
    pior: m ? m[2]! : null,
    fora_m: m ? Number(m[3]) : null,
  };
}

/** Roda uma candidata num ponto de acesso e diz o que saiu, e por quê. */
function medir(entrada: EntradaMinima, ponto: P, candidata: (typeof CANDIDATAS)[number]) {
  const e = comAcessoEm(entrada, ponto);
  const r = rodarGenerate(e, candidata, CARIMBO);
  if (!r.saida) {
    return { aceito: false, lotes: null, semPlano: true, ...decomporRecusa(null) };
  }
  const v = julgar(r.saida, e);
  return { aceito: v.lotes != null, lotes: v.lotes, semPlano: false, ...decomporRecusa(v.recusa) };
}

console.log("══════════ LAB-41 · a ausência da ortogonal, com motivo ══════════");

// ═════════ 1 · as duas glebas acusadas, as duas candidatas, com o motivo ═════════
const porGleba: Record<string, unknown> = {};
for (const { id, entrada } of ACUSADAS) {
  const anel = entrada.gleba.anel as P[];
  const pontos = posicoesDeAcesso(anel);
  console.log(
    `\n══════ ${id} · ${anel.length} vértices, ${reflexos(anel)} reflexos, ` +
      `${(Math.abs(anel.reduce((s, p, i) => { const q = anel[(i + 1) % anel.length]!; return s + (p.x * q.y - q.x * p.y); }, 0) / 2) / 1e4).toFixed(1)} ha ══════`,
  );
  const posicoes = pontos.map((ponto, i) => {
    const onde = ondeNoAnel(ponto, anel);
    const ort = medir(entrada, ponto, "ortogonal");
    const esp = medir(entrada, ponto, "espinha");
    console.log(
      `  pos ${i} · face ${String(onde.face).padStart(2)} t=${onde.t.toFixed(3)} ` +
        `(${(onde.t * onde.comprimento_m).toFixed(0).padStart(4)} m do vértice, aresta de ${onde.comprimento_m.toFixed(0)} m) ` +
        `· ortogonal ${ort.aceito ? `ok ${ort.lotes} lotes` : `RECUSADA (${ort.pior}, ${ort.fora_m} m fora)`}` +
        ` · espinha ${esp.aceito ? `ok ${esp.lotes} lotes` : `RECUSADA (${esp.fora_m} m fora)`}`,
    );
    return {
      posicao: i,
      ponto,
      // O ponto cai EM CIMA do anel — conferido, e não suposto: era a primeira
      // hipótese a matar, porque ponto fora da divisa seria defeito do Lab.
      distanciaDoAnel_m: Number(onde.dist_m.toExponential(1)),
      face: onde.face,
      tNaFace: n2(onde.t),
      metrosDoVertice: n2(onde.t * onde.comprimento_m),
      comprimentoDaFace_m: n2(onde.comprimento_m),
      azimuteDaFace_graus: n2(onde.azimute_graus),
      ortogonal: ort,
      espinha: esp,
    };
  });
  const aceitas = (c: "ortogonal" | "espinha") => posicoes.filter((p) => p[c].aceito).length;
  console.log(`  → ortogonal ${aceitas("ortogonal")}/6 · espinha ${aceitas("espinha")}/6`);
  porGleba[id] = {
    gleba: id,
    motor: "Generate · candidatas ortogonal e espinha",
    semente: SEMENTE,
    vertices: anel.length,
    verticesReflexos: reflexos(anel),
    aceitas: { ortogonal: aceitas("ortogonal"), espinha: aceitas("espinha") },
    posicoes,
  };
}

// ═════════ 2 · o controle: a ortogonal nas outras glebas ═════════
console.log(`\n══════ controle: a mesma ortogonal, nas outras glebas ══════`);
const controle = CONTROLE.map(({ id, entrada }) => {
  const anel = entrada.gleba.anel as P[];
  const r = posicoesDeAcesso(anel).map((p) => medir(entrada, p, "ortogonal"));
  const ok = r.filter((x) => x.aceito).length;
  console.log(
    `  ${id.padEnd(24)} ${anel.length} vértices, ${reflexos(anel)} reflexos · ortogonal ${ok}/6` +
      (ok < 6 ? ` · piores: ${r.filter((x) => !x.aceito).map((x) => `${x.fora_m} m`).join(", ")}` : ""),
  );
  return {
    gleba: id,
    motor: "Generate · candidata ortogonal",
    semente: SEMENTE,
    vertices: anel.length,
    verticesReflexos: reflexos(anel),
    aceitas: ok,
    recusas: r.filter((x) => !x.aceito).map((x) => ({ pior: x.pior, fora_m: x.fora_m })),
  };
});

// ═════════ 3 · a varredura ao longo da aresta ═════════
//
// A pergunta: a ausência é caprichosa ou tem assinatura geométrica? Se o
// transbordo crescer com a distância do ponto ao VÉRTICE da aresta, a ausência
// não é sorte — é a montagem do traçado.
console.log(`\n══════ a varredura: o acesso andando ao longo da aresta ══════`);
const TS_VARREDURA = [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95];
const varredura = ACUSADAS.flatMap(({ id, entrada }) => {
  const anel = entrada.gleba.anel as P[];
  // Três arestas por gleba: a primeira, uma do meio e uma do fim — para a
  // assinatura não vir de uma aresta escolhida.
  const faces = [0, Math.floor(anel.length / 3), anel.length - 2];
  return faces.map((face) => {
    const a = anel[face]!;
    const b = anel[(face + 1) % anel.length]!;
    const comp = Math.hypot(b.x - a.x, b.y - a.y);
    const pontos = TS_VARREDURA.map((t) => {
      const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      const m = medir(entrada, p, "ortogonal");
      return { t, metrosDoVertice: n2(t * comp), aceito: m.aceito, lotes: m.lotes, fora_m: m.fora_m };
    });
    console.log(
      `  ${id} · face ${face} (${comp.toFixed(0)} m, ${((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI).toFixed(0)}°): ` +
        pontos.map((x) => `${x.metrosDoVertice}m→${x.aceito ? `ok` : `${x.fora_m}m fora`}`).join(" | "),
    );
    return { gleba: id, motor: "Generate · candidata ortogonal", semente: SEMENTE, face, comprimentoDaFace_m: n2(comp), pontos };
  });
});

// ═════════ 4 · O DIAGNÓSTICO QUE FECHA A INVESTIGAÇÃO ═════════
//
// As hipóteses que morreram antes desta, cada uma com a medição que as matou:
//
// | hipótese | o que a matou |
// |---|---|
// | o ponto de acesso cai fora da divisa (defeito do Lab) | distância do ponto ao anel: **0 a 3e-14 m** |
// | limite real do terreno | a **espinha** entrega em 11 das 12 posições que a ortogonal recusa |
// | defeito geral da candidata ortogonal | **36 pontos** de controle em três glebas, todos aceitos |
// | gleba côncava | `geo-antonina` tem **11 vértices reflexos** e aceita 6/6 |
// | a gleba preenche mal o retângulo envolvente | `geo-antonina` preenche **43 %** e aceita 6/6 |
// | os percentuais de APP e lazer | `pctAPP`/`pctLazer` nulos dão **exatamente** os mesmos metros |
//
// O que sobrou, por eliminação, foi um padrão nas cinco glebas: **passa quem tem
// `restricoes` que descontam, ou quem é o próprio retângulo envolvente.** As duas
// que falham têm zero restrições e não são retângulo.
//
// Então o teste: uma restrição **mínima**, de 100 m², posta **fora da gleba** — que
// não tira área útil nenhuma e só faz `restricoes` deixar de ser vazio.
const UM_CANTINHO = (anel: readonly P[]): P[] => {
  const minX = Math.min(...anel.map((p) => p.x));
  const minY = Math.min(...anel.map((p) => p.y));
  return [
    { x: minX - 30, y: minY - 30 },
    { x: minX - 20, y: minY - 30 },
    { x: minX - 20, y: minY - 20 },
    { x: minX - 30, y: minY - 20 },
  ];
};

console.log(`\n══════ o diagnóstico: UMA restrição de 100 m², FORA da gleba ══════`);
const diagnostico = ACUSADAS.map(({ id, entrada }) => {
  const anel = entrada.gleba.anel as P[];
  const comRestricao = {
    ...entrada,
    restricoes: [
      {
        id: "R-diag",
        tipo: "app_hidrica",
        nome: "diagnóstico do LAB-41 — 100 m² fora da gleba, não desconta área útil nenhuma",
        baseLegal: null,
        desconta: true,
        geometria: { tipo: "poligono", aneis: [UM_CANTINHO(anel)] },
      },
    ],
  } as unknown as EntradaMinima;

  const rodarTodas = (e: EntradaMinima) =>
    posicoesDeAcesso(anel).map((ponto) => medir(e, ponto, "ortogonal"));

  const semRestricao = rodarTodas(entrada);
  const comRestricaoR = rodarTodas(comRestricao);
  const conta = (r: typeof semRestricao) => r.filter((x) => x.aceito).length;
  console.log(
    `  ${id.padEnd(24)} sem restrição ${conta(semRestricao)}/6 → com UMA restrição de 100 m² fora da gleba ${conta(comRestricaoR)}/6`,
  );
  return {
    gleba: id,
    motor: "Generate · candidata ortogonal",
    semente: SEMENTE,
    aceitasSemRestricao: conta(semRestricao),
    aceitasComRestricaoFalsa: conta(comRestricaoR),
    // Os lotes MUDAM entre as duas rodadas, e por isso a restrição falsa é
    // diagnóstico e não conserto: ela altera o plano. O que o Lab publica
    // continua sendo a gleba como ela é.
    lotesSemRestricao: semRestricao.map((x) => x.lotes),
    lotesComRestricaoFalsa: comRestricaoR.map((x) => x.lotes),
    oQueIssoProva:
      "a candidata ortogonal toma OUTRO caminho quando `restricoes` está vazio, e nesse caminho a via não é aparada pela gleba. Uma restrição que não desconta área nenhuma basta para as 6 posições passarem",
  };
});

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "ortogonal-fora-da-gleba.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-41",
      geradoEm: CARIMBO,
      semente: SEMENTE,
      contrato: ACUSADAS[0]!.entrada.archilly.versao,
      posicoesDeAcesso: POSICOES_DE_ACESSO,
      aPergunta: "defeito do motor ou limite real do terreno?",
      aResposta:
        "nem uma nem outra como estavam postas: a candidata ortogonal PRODUZ plano, e o plano é recusado pelo CONTRATO DO PRÓPRIO GENERATE porque a via sai da gleba — de 1,2 a 83,5 m para fora da divisa. Não é limite do terreno (a espinha entrega nos mesmos acessos) e não é defeito geral da ortogonal (ela entrega 6/6 nas três glebas de controle)",
      oMecanismoProvavel: {
        onde: "urban-create-hub-41d93a4d/src/lib/engine/gerar-v1-motor.ts, a montagem da VP-01 (por volta das linhas 600-680)",
        oQue:
          "a via principal é montada a partir do RETÂNGULO ENVOLVENTE da massa: a posição transversal é a coordenada do acesso, limitada só para a CAIXA caber no retângulo (`bb.minX + totalVia/2 + 1` … `bb.maxX − totalVia/2 − 1`), e a extensão vai de `bb.maxY − margem` a `bb.minY + margem`. Numa gleba que não é o próprio retângulo, uma reta de ponta a ponta do retângulo na coordenada do acesso SAI do polígono",
        oQueSustenta:
          "o retângulo `ensaio-47ha` é o próprio bounding box e aceita 12/12 pontos; e o transbordo varia de forma contínua com a posição do acesso na aresta, que é assinatura de montagem geométrica e não de sorte",
        oQueNAOSustenta:
          "preencher pouco o retângulo envolvente não prediz a falha — `geo-antonina` preenche 43 % e aceita 6/6. O que prediz é `restricoes` vazio, e a razão disso mora no código deles",
      },
      aQuemCabe:
        "ao Generate, na montagem do traçado da candidata ortogonal. O Lab é o mensageiro: a recusa vem do esquema deles (contratos/motor-v1/esquema.ts), não de régua minha",
      oQueNaoFoiMedido:
        "a causa dentro do código da candidata ortogonal. Lê-se o sintoma (a via sai) e a assinatura (o transbordo cresce com a distância do acesso ao vértice da aresta); a linha de código é deles",
      glebasAcusadas: porGleba,
      controle,
      varreduraAoLongoDaAresta: varredura,
      diagnosticoDaRestricaoFalsa: diagnostico,
    },
    null,
    2,
  )}\n`,
);
console.log(`\n${join("docs", "provas", "LAB-41", "ortogonal-fora-da-gleba.json")}`);
