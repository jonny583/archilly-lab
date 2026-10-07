/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-58 · As 81 violações DO MOTOR agrupadas por MECANISMO.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-55 fechou a conta da atribuição: das 92 violações do Validator do Generate sobre o
 * motor PADRÃO da tela unificada, **81 são do motor e 11 são do contrato dele**, zero em
 * aberto. Mas "81 do motor" não é lista de conserto: é um número. **Esta ferramenta diz
 * QUANTOS MECANISMOS DISTINTOS produzem as 81 e quantas violações cada um responde**, para
 * virar a fila do motor.
 *
 * # O que NÃO se remede aqui
 *
 * As quatro provas anteriores respondem quatro perguntas, e repetir qualquer uma daria um
 * segundo número para a mesma pergunta — o que o **D116** proíbe. Então elas são **lidas**:
 *
 * | prova | o que ela dá |
 * |---|---|
 * | `LAB-53/violacoes-depois-do-conserto-da-ponte.json` | as **92**, uma a uma, e quais são do contrato |
 * | `LAB-54/frente-nao-atribuida.json` | a classe de cada `frente`, medida com a função DELE |
 * | `LAB-50/passagem-externa.json` | a distância de cada lote externo à **face entregue** |
 * | `LAB-55/via-sobre-a-faixa.json` | que a rede viária é aparada **só pela divisa** |
 *
 * # A CHAVE DA JUNÇÃO É (gleba, lote, TIPO) — e isso me pegou dentro deste prompt
 *
 * **Sete dos 85 lotes acusados têm mais de uma violação.** Numa exploração deste prompt eu
 * juntei a classe do LAB-54 pelo par `(gleba, lote)`, e o resultado **etiquetou 7
 * `via-sobre-lote` com a classe de uma `frente` do mesmo lote** — e a contagem saiu **18
 * onde eram 22**. É a família do **D172** (casar a etiqueta em vez da coisa) com uma forma
 * nova: *chave de junção curta mistura dois objetos que moram no mesmo lote.*
 *
 * # A medição nova, e ela é UMA: a distância do lote ao CONTORNO da via
 *
 * Dois mecanismos não estavam nomeados, e os dois se nomeiam com a mesma régua: **a que
 * distância este lote está da rua mais próxima?** (D161: *meça a distância em vez de ler o
 * id*.)
 *
 * A régua é a mesma do critério DELE — distância ao **contorno** da superfície viária —,
 * montada a partir do `distanciaSegmento` do próprio motor. Mas ela é minha, e por isso
 * **vem calibrada contra o veredicto dele**:
 *
 * > para **todos** os lotes acusados de `frente` ou `testada`, a minha distância tem de
 * > concordar com a classe que o LAB-54 mediu com a função dele — `d ≤ 0,75 m` onde ele
 * > classificou `regua-amostragem` (o lote encosta, a amostra do meio não viu), `d > 0,75 m`
 * > onde ele classificou `motor-sem-via-perto`. **Uma discordância e a ferramenta PARA.**
 *
 * **Isto não é zelo, é o D93 e o D127 de novo**: na primeira versão desta ferramenta eu usei
 * o `distanciaAoPoligono` do motor, que devolve **zero para ponto DENTRO** do polígono — e
 * ele disse "encosta na via" para seis lotes que estão **debaixo** do leito, onde a função
 * dele diz o contrário. *Régua que confunde "ao lado de" com "dentro de" não mede frente.*
 *
 * # A saída
 *
 * Um mecanismo por item, **numerado**, com: o que o motor faz, onde isso foi lido no código
 * dele (só de leitura), a prova que o sustenta, o predicado MEDIDO que decide se uma
 * violação é dele, e a contagem. O que nenhum predicado alcançar sai como
 * **`MECANISMO-NAO-NOMEADO`, com a contagem** — `null` é "não medido", zero é uma medição
 * (D23).
 *
 * Uso: `bun run lab58`  (a tampa de exemplos vai levantada pelo `package.json`)
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import { _testadaDoLote, superficiesDeFrente, verificarInvariantesPlano } from "@generate/engine/invariantes.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";
import { distanciaSegmento } from "@testfit/geo.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { contratoDasEntradas, type EntradaMinima } from "../src/gleba-v1.ts";
import type { P } from "../src/motores/comum.ts";
import { amostrasParaOPasso, densificar } from "../src/probe-de-amostragem.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { MECANISMOS, atribuirMecanismo, mecanismosQueCasam, type ViolacaoMedida } from "../src/mecanismos-das-violacoes.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const PROVAS = join(RAIZ, "docs", "provas");
const SAIDA = join(PROVAS, "LAB-58");
const SEMENTE = 20260913;

/** A tolerância DELE, e a minha distância é calibrada contra ela. */
const TOL_DELE_M = 0.75;
/** Passo da amostragem da BORDA do lote, em metros. */
const PASSO_M = 0.25;
/** Quanto a maior aresta pode diferir da profundidade modal da fileira para ser "a mesma". */
const MESMA_PROFUNDIDADE_M = 0.5;

const comp = (a: P, b: P) => Math.hypot(b.x - a.x, b.y - a.y);
const n2 = (x: number) => Number(x.toFixed(2));

/**
 * Distância ao CONTORNO do polígono — **não** `distanciaAoPoligono`.
 *
 * A diferença é a que invalidou a primeira versão desta ferramenta: o
 * `distanciaAoPoligono` do motor devolve **0 para ponto dentro**, e aqui "dentro do leito"
 * é o oposto de "encosta na rua". Esta é a mesma fórmula do `_distAoContorno` dele, que
 * não é exportado, montada sobre o `distanciaSegmento` do motor.
 */
function distAoContorno(p: P, pol: readonly P[]): number {
  let melhor = Infinity;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    melhor = Math.min(melhor, distanciaSegmento(p, pol[j]! as never, pol[i]! as never));
  }
  return melhor;
}

/**
 * A testada RECONSTRUÍDA com a minha distância, para ser comparada com a dele.
 *
 * **Este bloco existe para ser REFUTADO, e nunca para julgar.** Ele não é um Validator leve
 * (§4): nenhuma violação deste prompt sai dele. Ele reconstrói o número que a função do
 * Generate devolve — meio de cada aresta a até 0,75 m do contorno, e a maior sequência
 * contígua de arestas frontais, com a soma total quando TODAS são frontais — usando a
 * **minha** distância. Se o meu número diferir do dele em qualquer lote acusado, a régua é
 * minha e está errada, e a ferramenta para.
 *
 * **Isto nasceu de uma sabotagem que PASSOU.** A primeira calibração comparava a minha
 * distância com a CLASSE que o LAB-54 mediu, e só nos lotes de `frente`. Trocar o
 * `distAoContorno` pelo `distanciaAoPoligono` — que devolve **zero para ponto dentro** —
 * saiu **exit 0**: a diferença entre as duas réguas só aparece em lote que está **debaixo**
 * do leito, e esses são os `via-sobre-lote`, que não têm classe no LAB-54. *A trava mediu
 * um escopo onde o defeito não podia aparecer* (D164), que é a forma do §6 com nome novo.
 */
function testadaReconstruida(pontos: readonly P[], superficies: readonly P[][]): number {
  const n = pontos.length;
  if (n < 3 || !superficies.length) return 0;
  const ehFrontal: boolean[] = [];
  const comps: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = pontos[i]!;
    const b = pontos[(i + 1) % n]!;
    comps.push(comp(a, b));
    const meio = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    ehFrontal.push(superficies.some((sup) => distAoContorno(meio, sup) <= TOL_DELE_M));
  }
  if (ehFrontal.every((f) => f)) return comps.reduce((acc, c) => acc + c, 0);
  const inicio = ehFrontal.indexOf(false);
  let maior = 0;
  let atual = 0;
  for (let k = 0; k < n; k++) {
    const i = (inicio + k) % n;
    if (ehFrontal[i]) {
      atual += comps[i]!;
      if (atual > maior) maior = atual;
    } else {
      atual = 0;
    }
  }
  return maior;
}

function conferirNumero(x: number, onde: string): number {
  if (!Number.isFinite(x)) {
    console.error(`✗ ${onde}: a medição devolveu \`${x}\`, que não é número — e um NaN aqui sairia como\n` +
      `  acusação a um mecanismo do motor do vizinho (D175).`);
    process.exit(1);
  }
  return x;
}

// ── AS PROVAS ANTERIORES, LIDAS (D116) ──────────────────────────────────────
type V53 = {
  gleba: string;
  tipo: string;
  loteId: string | null;
  valor: number | null;
  detalhe: string;
  idDizExterno: boolean;
  someComAFaixaViaPublica: boolean | null;
  facesDaQuadra: number[] | null;
};
const prova53 = JSON.parse(
  readFileSync(join(PROVAS, "LAB-53", "violacoes-depois-do-conserto-da-ponte.json"), "utf8"),
) as { total: { violacoes: number; porTipo: Record<string, number> }; violacoes: V53[] };

const prova54 = JSON.parse(readFileSync(join(PROVAS, "LAB-54", "frente-nao-atribuida.json"), "utf8")) as {
  violacoes: { gleba: string; loteId: string; classe: string; testadaComPassoFino_m: number; viraViolacaoDeTestada: boolean }[];
};
/** A classe do LAB-54 vale para `frente` e só para ela: a chave leva o TIPO. */
const CLASSE_54 = new Map(prova54.violacoes.map((v) => [`${v.gleba}|frente|${v.loteId}`, v]));

const prova50 = JSON.parse(readFileSync(join(PROVAS, "LAB-50", "passagem-externa.json"), "utf8")) as {
  glebas: { gleba: string; lotes: { lote: string; aoSegmentoDaTestada_m: number }[] }[];
};
const AO_SEGMENTO_50 = new Map<string, number>();
for (const g of prova50.glebas) for (const l of g.lotes) AO_SEGMENTO_50.set(`${g.gleba}|${l.lote}`, l.aoSegmentoDaTestada_m);

const prova55 = JSON.parse(readFileSync(join(PROVAS, "LAB-55", "via-sobre-a-faixa.json"), "utf8")) as {
  viasCulpadas: { gleba: string; via: string; aparadaPelaDivisa: boolean }[];
};

const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
];

// ── A MEDIÇÃO NOVA ──────────────────────────────────────────────────────────
const medidas: ViolacaoMedida[] = [];
const discordancias: string[] = [];
const porGleba: Record<string, unknown>[] = [];

for (const { id, entrada } of GLEBAS) {
  const r = rodarTestfit(entrada, SEMENTE);
  const l = montarParcelamentoExterno(r.saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) {
    console.error(`✗ ${id}: o esquema recusou a saída — ${l.conferencia.erros.slice(0, 2).join("; ")}`);
    process.exit(1);
  }
  const res = l.externo.resultado as never as {
    lotes: { id: string; quadraId?: string; pontos: P[]; area: number }[];
    quadras: { id: string; pontos: P[] }[];
    rede: { principal: unknown[]; secundarias: unknown[] };
    culDeSacs?: unknown[];
    faixaViaPublica?: P[][];
    params: { testadaMin: number; faceQuadraMax: number };
  };
  const rel = verificarInvariantesPlano(res as never);
  if (rel.exemplos.length !== rel.violacoes) {
    console.error(`✗ ${id}: ${rel.violacoes} violações e só ${rel.exemplos.length} exemplos.\n` +
      `  Rode assim:  INVARIANTES_EXEMPLOS=100000 bun ferramentas/lab58.ts`);
    process.exit(1);
  }

  // As superfícies são as DELE, montadas como o invariante as monta.
  const sup = [
    ...superficiesDeFrente([...res.rede.principal, ...res.rede.secundarias] as never, (res.culDeSacs ?? []) as never),
    ...((res.faixaViaPublica ?? []) as P[][]),
  ] as P[][];

  const porId = new Map(res.lotes.map((x) => [x.id, x]));
  const lotesDaQuadra = new Map<string, number>();
  for (const lo of res.lotes) lotesDaQuadra.set(lo.quadraId ?? "—", (lotesDaQuadra.get(lo.quadraId ?? "—") ?? 0) + 1);

  /** A profundidade da fileira é MEDIDA: a moda da maior aresta entre os lotes da quadra. */
  const profDaQuadra = new Map<string, number>();
  for (const q of res.quadras) {
    const cont = new Map<number, number>();
    for (const lo of res.lotes.filter((x) => x.quadraId === q.id)) {
      // O número passa pela conferência AQUI, e não lá embaixo sob outro nome: um NaN de
      // coordenada viraria chave de mapa, a moda sairia NaN, e a profundidade da fileira é
      // o que decide dois dos seis mecanismos. A varredura do LAB-52 cobrou isto neste
      // arquivo, e ela estava certa — o valor era conferido, mas sob o nome `prof`, longe
      // daqui (D187: régua cujo achado é real não se declara benigno).
      const m = conferirNumero(
        Number(Math.max(...lo.pontos.map((a, i) => comp(a, lo.pontos[(i + 1) % lo.pontos.length]!))).toFixed(1)),
        `${id}/${q.id} profundidade modal da fileira`,
      );
      cont.set(m, (cont.get(m) ?? 0) + 1);
    }
    let melhor: number | null = null;
    let n = -1;
    for (const [v, c] of cont) if (c > n) { n = c; melhor = v; }
    profDaQuadra.set(q.id, melhor ?? Number.NaN);
  }

  for (const v of rel.exemplos) {
    const chave = `${id}|${v.tipo}|${v.loteId ?? ""}`;
    if (v.tipo === "face-quadra") {
      const q = res.quadras.find((x) => x.id === v.loteId);
      const faces = q ? q.pontos.map((a, i) => n2(comp(a, q.pontos[(i + 1) % q.pontos.length]!))) : null;
      medidas.push({
        gleba: id, tipo: v.tipo, loteId: v.loteId ?? null, chave,
        externo: false, quadraId: v.loteId ?? null,
        facesDaQuadra_m: faces,
        facesAcimaDoTeto: faces ? faces.filter((f) => f > res.params.faceQuadraMax).length : null,
        facesAbaixoDoTeto: faces ? faces.filter((f) => f <= res.params.faceQuadraMax).length : null,
        tetoDeFace_m: res.params.faceQuadraMax,
        dAoContornoDaVia_m: null, verticesDoLote: null, arestas_m: null, maiorAresta_m: null,
        // A profundidade da fileira DESTA quadra — é ela que diz se a face curta é o eixo
        // que o teto pegou (duas fileiras costas com costas) ou outra coisa.
        profundidadeModalDaFileira_m: (() => {
          const pr = profDaQuadra.get(v.loteId ?? "");
          return pr !== undefined && Number.isFinite(pr) ? pr : null;
        })(),
        lotesNaQuadra: lotesDaQuadra.get(v.loteId ?? "—") ?? null, testadaDele_m: null,
        testadaMin_m: res.params.testadaMin, aoSegmentoDaFaceEntregue_m: null,
        classe_LAB54: null, testadaComPassoFino_m: null, doContratoDoGenerate: false,
      });
      continue;
    }

    const lo = porId.get(v.loteId ?? "");
    if (!lo) { console.error(`✗ ${chave}: o Validator acusou um lote que não existe na saída.`); process.exit(1); }
    const pts = lo.pontos;
    const arestas = pts.map((a, i) => comp(a, pts[(i + 1) % pts.length]!));
    const maior = Math.max(...arestas);

    // A BORDA inteira amostrada a 0,25 m, contra o CONTORNO de cada superfície.
    const denso = densificar(pts, amostrasParaOPasso(maior, PASSO_M));
    let d = Infinity;
    for (const p of denso) for (const s of sup) d = Math.min(d, distAoContorno(p, s));
    conferirNumero(d, `${chave} distância ao contorno`);

    const testadaDele = conferirNumero(_testadaDoLote(pts as never, sup as never), `${chave} testada DELE`);
    const classe54 = CLASSE_54.get(chave);

    // ── A CALIBRAÇÃO: a minha distância tem de REPRODUZIR o número dele ─────
    //
    // Em TODO lote acusado, não só nos de `frente` — foi a estreiteza do escopo que deixou
    // uma sabotagem passar. A tolerância é numérica, não de medição: as duas contas são a
    // mesma, só a função de distância muda.
    const reconstruida = conferirNumero(testadaReconstruida(pts, sup), `${chave} testada reconstruída`);
    if (Math.abs(reconstruida - testadaDele) > 1e-6) {
      discordancias.push(
        `${chave}: a função DELE devolve ${n2(testadaDele)} m e a MINHA distância reconstrói ` +
          `${n2(reconstruida)} m — a régua é minha e está errada`,
      );
    }
    if (classe54) {
      const encostaPelaMinhaRegua = d <= TOL_DELE_M;
      const encostaPelaDele = classe54.classe === "regua-amostragem-no-meio-da-aresta";
      if (encostaPelaMinhaRegua !== encostaPelaDele) {
        discordancias.push(
          `${chave}: a minha distância diz d=${n2(d)} m (${encostaPelaMinhaRegua ? "encosta" : "não encosta"}) ` +
            `e o LAB-54, com a função DELE, classificou '${classe54.classe}'`,
        );
      }
    }

    const prof = profDaQuadra.get(lo.quadraId ?? "") ?? null;
    medidas.push({
      gleba: id, tipo: v.tipo, loteId: v.loteId ?? null, chave,
      externo: /-e\d+$/.test(lo.id),
      quadraId: lo.quadraId ?? null,
      facesDaQuadra_m: null, facesAcimaDoTeto: null, facesAbaixoDoTeto: null,
      tetoDeFace_m: res.params.faceQuadraMax,
      dAoContornoDaVia_m: n2(d),
      verticesDoLote: pts.length,
      arestas_m: arestas.map(n2),
      maiorAresta_m: n2(maior),
      profundidadeModalDaFileira_m: prof !== null && Number.isFinite(prof) ? prof : null,
      lotesNaQuadra: lotesDaQuadra.get(lo.quadraId ?? "—") ?? null,
      testadaDele_m: n2(testadaDele),
      testadaMin_m: res.params.testadaMin,
      aoSegmentoDaFaceEntregue_m: AO_SEGMENTO_50.get(`${id}|${lo.id}`) ?? null,
      classe_LAB54: classe54?.classe ?? null,
      testadaComPassoFino_m: classe54?.testadaComPassoFino_m ?? null,
      doContratoDoGenerate: false,
    });
  }

  porGleba.push({
    gleba: id,
    variante: r.variante,
    lotes: res.lotes.length,
    quadras: res.quadras.length,
    violacoes: rel.violacoes,
    porTipo: rel.porTipo,
  });
}

if (discordancias.length) {
  console.error(`✗ CALIBRAÇÃO FALHOU em ${discordancias.length} lote(s) — a minha distância discorda da função DELE:`);
  for (const x of discordancias) console.error(`  ${x}`);
  console.error("  Régua que discorda do veredicto que ela deveria explicar não explica nada (D93, D127).");
  process.exit(1);
}

// ── QUAIS SÃO AS 81: as 92 menos as do CONTRATO, lidas do LAB-53 ────────────
const DO_CONTRATO = new Set<string>();
for (const v of prova53.violacoes) {
  if (v.someComAFaixaViaPublica === true) DO_CONTRATO.add(`${v.gleba}|${v.tipo}|${v.loteId ?? ""}`);
}
const naProva53 = new Set(prova53.violacoes.map((v) => `${v.gleba}|${v.tipo}|${v.loteId ?? ""}`));
for (const m of medidas) m.doContratoDoGenerate = DO_CONTRATO.has(m.chave);

// A medição de hoje tem de ser a MESMA lista do LAB-53 — prova velha que mudou de número
// é prova velha (D133/LAB-49), e aqui isso sai nomeado em vez de passar.
const soAqui = medidas.filter((m) => !naProva53.has(m.chave)).map((m) => m.chave);
const soNoLab53 = [...naProva53].filter((k) => !medidas.some((m) => m.chave === k));
if (soAqui.length || soNoLab53.length) {
  console.error(`✗ a lista de hoje não é a lista do LAB-53: ${soAqui.length} só aqui, ${soNoLab53.length} só lá.`);
  for (const k of [...soAqui.slice(0, 5), ...soNoLab53.slice(0, 5)]) console.error(`  ${k}`);
  process.exit(1);
}

const doMotor = medidas.filter((m) => !m.doContratoDoGenerate);

/**
 * OS LOTES COM DUAS VIOLAÇÕES — e aqui a trava deste prompt me pediu uma conclusão mais
 * estreita, não um limiar mais largo (D189/D172).
 *
 * Eu ia escrever *"sete dos 85 lotes têm mais de uma violação, por isso a chave curta
 * erra"*. A trava mediu **dentro das 81** e devolveu **zero**: nas 81 do motor, cada lote
 * carrega **uma** violação. Medido onde a junção de fato acontece — nas **92** —, os sete
 * existem, e são **exatamente** os sete cuja `frente` é do CONTRATO e cuja `via-sobre-lote`
 * é do MOTOR.
 *
 * > **A chave curta não erra em qualquer lugar: ela erra exatamente na fronteira entre o
 * > que é do contrato e o que é do motor** — que é a única fronteira que este prompt
 * > precisa acertar. Daí os 18 onde eram 22.
 */
const porLoteNas92 = new Map<string, { tipo: string; doContrato: boolean }[]>();
for (const m of medidas) {
  const k = `${m.gleba}|${m.loteId}`;
  const arr = porLoteNas92.get(k) ?? [];
  arr.push({ tipo: m.tipo, doContrato: m.doContratoDoGenerate });
  porLoteNas92.set(k, arr);
}
const comDuas = [...porLoteNas92.entries()].filter(([, v]) => v.length > 1);
const comDuasNaFronteira = comDuas.filter(
  ([, v]) => v.some((x) => x.doContrato) && v.some((x) => !x.doContrato),
);
const comDuasEntreAs81 = [...porLoteNas92.entries()].filter(
  ([, v]) => v.filter((x) => !x.doContrato).length > 1,
).length;

// ── A ATRIBUIÇÃO ────────────────────────────────────────────────────────────
const LIMITES = { tolDele_m: TOL_DELE_M, mesmaProfundidade_m: MESMA_PROFUNDIDADE_M };
const duplas = doMotor
  .map((m) => ({ chave: m.chave, casam: mecanismosQueCasam(m, LIMITES) }))
  .filter((x) => x.casam.length > 1);
if (duplas.length) {
  console.error(`✗ ${duplas.length} violação(ões) casam com MAIS DE UM mecanismo — isso é dupla contagem:`);
  for (const d of duplas) console.error(`  ${d.chave}: ${d.casam.join(", ")}`);
  console.error("  Lista que conta a mesma violação duas vezes faz o motor consertar duas vezes, ou nenhuma.");
  process.exit(1);
}
const atribuidas = doMotor.map((m) => ({ ...m, mecanismo: atribuirMecanismo(m, LIMITES) }));
const porMecanismo = new Map<string, typeof atribuidas>();
for (const a of atribuidas) {
  const arr = porMecanismo.get(a.mecanismo) ?? [];
  arr.push(a);
  porMecanismo.set(a.mecanismo, arr);
}

console.log("══════════ LAB-58 · as 81 do motor, por MECANISMO ══════════");
console.log(`  as 92 do LAB-53: ${prova53.total.violacoes} · ${JSON.stringify(prova53.total.porTipo)}`);
console.log(`  do CONTRATO do Generate: ${medidas.length - doMotor.length} · DO MOTOR: ${doMotor.length}`);
console.log("");
const lista = MECANISMOS.map((mec, i) => {
  const quais = porMecanismo.get(mec.id) ?? [];
  const porGlebaDoMec: Record<string, number> = {};
  for (const q of quais) porGlebaDoMec[q.gleba] = (porGlebaDoMec[q.gleba] ?? 0) + 1;
  console.log(`  ${String(i + 1).padStart(2)}. ${mec.id.padEnd(34)} ${String(quais.length).padStart(3)} violações · ${JSON.stringify(porGlebaDoMec)}`);
  /**
   * As distâncias DENTRO do mecanismo — porque "um mecanismo" não quer dizer "uma distância".
   *
   * No `fileira-sem-via-propria` elas vão de 1,24 m a uma profundidade de fileira inteira, e
   * a ponta de cima é o que nomeia o mecanismo: o lote está a uma fileira da rua que serve a
   * fileira gêmea. Publicar só a contagem esconderia isso.
   */
  const ds = quais.map((q) => q.dAoContornoDaVia_m).filter((x): x is number => x !== null);
  /**
   * AS FACES, dentro do mecanismo do teto — para não dizer "68,3 m em 11 das 14" de cabeça.
   *
   * O D185 é exatamente isto: um número que o relatório pode listar ao lado não se escreve de
   * memória. Aqui a conta sai da lista.
   */
  const comFaces = quais.filter((q) => q.facesDaQuadra_m !== null);
  const faces = comFaces.length
    ? (() => {
        const curtas: number[] = [];
        const longas: number[] = [];
        let duasFileiras = 0;
        for (const q of comFaces) {
          const fs = q.facesDaQuadra_m!;
          for (const f of fs) (f > q.tetoDeFace_m ? longas : curtas).push(f);
          const prof = q.profundidadeModalDaFileira_m;
          if (prof !== null && fs.some((f) => f <= q.tetoDeFace_m && Math.abs(f - 2 * prof) <= 1)) duasFileiras += 1;
        }
        return {
          quadras: comFaces.length,
          aCurta_m: { min: Math.min(...curtas), max: Math.max(...curtas) },
          aLonga_m: { min: Math.min(...longas), max: Math.max(...longas) },
          teto_m: comFaces[0]!.tetoDeFace_m,
          quadrasEmQueACurtaEhDUASFILEIRAS: duasFileiras,
          deQuantas: comFaces.length,
        };
      })()
    : null;
  const naProfundidade = quais.filter(
    (q) =>
      q.dAoContornoDaVia_m !== null &&
      q.profundidadeModalDaFileira_m !== null &&
      Math.abs(q.dAoContornoDaVia_m - q.profundidadeModalDaFileira_m) <= MESMA_PROFUNDIDADE_M,
  ).length;
  return {
    numero: i + 1,
    id: mec.id,
    emUmaLinha: mec.emUmaLinha,
    oQueOMotorFaz: mec.oQueOMotorFaz,
    ondeNoMotor: mec.ondeNoMotor,
    aProvaQueSustenta: mec.aProvaQueSustenta,
    oPredicadoMedido: mec.oPredicadoMedido,
    violacoes: quais.length,
    tipos: [...new Set(quais.map((q) => q.tipo))].sort(),
    porGleba: porGlebaDoMec,
    aDistanciaAteAVia_m: ds.length ? { min: Math.min(...ds), max: Math.max(...ds), aUmaProfundidadeDeFileira: naProfundidade } : null,
    asFacesDaQuadra: faces,
    glebasQueEleBloqueia: Object.keys(porGlebaDoMec).length,
    lotes: quais.map((q) => q.chave),
  };
});
/**
 * O QUE BLOQUEIA CADA GLEBA — e é esta coluna que ordena a fila do motor.
 *
 * Nenhuma das cinco glebas aprova (LAB-55), e o ranking da tela unificada só deixa de nascer
 * vazio quando a candidata vencedora ficar sem violação. Então "quantas violações cada
 * mecanismo responde" não basta: o que decide a ordem é **quantas GLEBAS cada mecanismo
 * destrava, e quais mecanismos ainda sobram naquela gleba depois**.
 */
const bloqueios = porGleba.map((g) => {
  const gleba = String(g["gleba"]);
  const daGleba = atribuidas.filter((a) => a.gleba === gleba);
  const contagem: Record<string, number> = {};
  for (const a of daGleba) contagem[a.mecanismo] = (contagem[a.mecanismo] ?? 0) + 1;
  const doContrato = medidas.filter((m) => m.gleba === gleba && m.doContratoDoGenerate).length;
  return {
    gleba,
    variante: g["variante"],
    violacoes: g["violacoes"],
    mecanismosQueABloqueiam: Object.keys(contagem).sort(),
    porMecanismo: contagem,
    doContratoDoGenerate: doContrato,
    oQueFaltaParaZERAR:
      Object.keys(contagem).length + (doContrato > 0 ? 1 : 0) === 0
        ? "nada — esta gleba já zera"
        : `${Object.keys(contagem).length} mecanismo(s) do motor` + (doContrato > 0 ? ` + o campo que falta no contrato do Generate (${doContrato} violações)` : ""),
  };
});

const naoNomeadas = porMecanismo.get("MECANISMO-NAO-NOMEADO") ?? [];
console.log(`      ${"MECANISMO-NAO-NOMEADO".padEnd(38)} ${String(naoNomeadas.length).padStart(3)} violações`);
console.log("");
console.log(`  MECANISMOS DISTINTOS COM VIOLAÇÃO: ${lista.filter((x) => x.violacoes > 0).length} de ${MECANISMOS.length} predicados`);
console.log(`  soma das atribuídas: ${lista.reduce((s, x) => s + x.violacoes, 0)} + ${naoNomeadas.length} não nomeadas = ${doMotor.length}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "mecanismos-das-81.json"),
  JSON.stringify(
    {
      prompt: "LAB-58",
      oQueIstoMede:
        "quantos MECANISMOS distintos do motor produzem as 81 violações que são dele, e quantas " +
        "violações cada um responde — para virar a fila de conserto do motor",
      quando: new Date().toISOString(),
      motor: "Laboratório de Parcelamento (motor-testfit) — o motor PADRÃO da tela unificada",
      semente: SEMENTE,
      contrato: contratoDasEntradas(GLEBAS.map((g) => g.entrada)),
      aChaveDaJuncao: {
        qual: "(gleba, tipo, loteId)",
        porque:
          "juntar por (gleba, loteId) etiqueta uma `via-sobre-lote` com a classe de uma `frente` do " +
          "mesmo lote, e numa exploração deste prompt isso deu 18 onde eram 22",
        lotesComMaisDeUmaViolacao_nas92: comDuas.length,
        delesNaFronteiraContratoXMotor: comDuasNaFronteira.length,
        lotesComMaisDeUmaViolacao_entreAs81: comDuasEntreAs81,
        oQueIssoDiz:
          "nas 81 do motor, cada lote carrega UMA violação — a chave curta não erra lá. Ela erra " +
          "exatamente na FRONTEIRA entre o que é do contrato e o que é do motor, que é a única " +
          "fronteira que este prompt precisa acertar (D189: a trava pediu conclusão mais estreita, " +
          "não limiar mais largo)",
        quais: comDuas.map(([k, v]) => ({ lote: k, tipos: v.map((x) => `${x.tipo}${x.doContrato ? " (contrato)" : " (motor)"}`) })),
      },
      aMedicaoNova: {
        qual: "a distância da BORDA do lote ao CONTORNO da superfície viária mais próxima",
        comoFoiMontada:
          "a mesma fórmula do `_distAoContorno` do Generate (que não é exportado), sobre o " +
          "`distanciaSegmento` do próprio motor; a borda do lote amostrada a " + PASSO_M + " m",
        naoEhODistanciaAoPoligono:
          "o `distanciaAoPoligono` do motor devolve ZERO para ponto DENTRO do polígono, e aqui " +
          "'dentro do leito' é o oposto de 'encosta na rua' — a primeira versão desta ferramenta " +
          "usou esse e disse 'encosta' para seis lotes que estão DEBAIXO da via",
        calibracao:
          "em TODO lote acusado, a minha distância tem de RECONSTRUIR o número que a função " +
          "`_testadaDoLote` dele devolve (teto 1e-6 m); e nos de `frente` ela tem ainda de " +
          "concordar com a classe que o LAB-54 mediu com a função dele — d ≤ " + TOL_DELE_M +
          " m onde ele disse 'regua-amostragem', d > " + TOL_DELE_M + " m onde ele disse " +
          "'motor-sem-via-perto'",
        porQueOEscopoEhTODOS:
          "a primeira calibração olhava só os de `frente`, e uma sabotagem PASSOU: trocar a " +
          "distância ao CONTORNO pela `distanciaAoPoligono`, que devolve zero para ponto DENTRO, " +
          "só muda a resposta em lote que está DEBAIXO do leito — e esses são `via-sobre-lote`, " +
          "que não têm classe no LAB-54. Trava cujo escopo exclui o lugar do defeito não é trava",
        discordancias: discordancias.length,
      },
      asProvasLidas: {
        "LAB-53": "as 92, uma a uma, e quais são do contrato do Generate (`someComAFaixaViaPublica`)",
        "LAB-54": "a classe de cada `frente`, medida com a função dele",
        "LAB-50": "a distância de cada lote externo à face entregue",
        "LAB-55": `a rede viária aparada só pela divisa (${prova55.viasCulpadas.filter((v) => v.aparadaPelaDivisa).length} de ${prova55.viasCulpadas.length} vias culpadas com as duas pontas na divisa)`,
      },
      total: {
        as92: prova53.total.violacoes,
        doContratoDoGenerate: medidas.length - doMotor.length,
        doMotor: doMotor.length,
        mecanismosDistintosComViolacao: lista.filter((x) => x.violacoes > 0).length,
        naoNomeadas: naoNomeadas.length,
      },
      glebas: porGleba,
      oQueBloqueiaCadaGleba: bloqueios,
      mecanismos: lista,
      naoNomeadas: naoNomeadas.map((q) => ({ chave: q.chave, tipo: q.tipo, porQueNenhumPredicadoPegou: q })),
      violacoes: atribuidas,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-58/mecanismos-das-81.json`);
