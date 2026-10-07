/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-59 · O CONTRAFACTUAL de Antonina: resolvido o quê, qual candidata aprova?
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **A pergunta do chat, nas palavras dele:** *"só candidata aprovada entra no ranking, então
 * meça se, com as 81 resolvidas, outra candidata passa a ser aprovável em Antonina."* E ele
 * disse para que serve: *"isso responde sozinho a pendência do Jonny sobre preferir 33 ou
 * 1.228 lotes, e responde sem tocar no motor."*
 *
 * # A pergunta mudou de forma por causa do LAB-58, e isso é medição, não escolha
 *
 * O LAB-58 mediu **o que bloqueia cada gleba**, e para `geo-antonina` a resposta tem duas
 * partes: **dois mecanismos do motor** (a faixa externa como semiplano, 18; a rede aparada só
 * pela divisa, 11) **mais 11 violações que são do contrato do Generate** — o campo de rua
 * pública existente que o `v1` não tem.
 *
 * > **"Resolvidas as 81" não zera Antonina.** Então o contrafactual não pode ser uma condição
 * > só: ele mede **as duas separadas**, e diz qual candidata aprova em cada combinação.
 *
 * # Como se mede sem tocar no motor
 *
 * O motor dele já gera **vinte** candidatas por rodada e as julga no ranking **dele**. O
 * `rodarTestfit` devolve só a primeira; aqui se leem **todas as julgadas**, pela mesma
 * montagem de opções (`variantesJulgadasDoTestfit` — D116: a `viaManual`, as
 * `facesLoteamento` e o aparo decidem o que o motor desenha, e duas montagens envelheceriam
 * em direções diferentes).
 *
 * Para cada candidata:
 *
 * 1. o **Validator do Generate** julga o plano dela — nenhuma régua minha;
 * 2. cada violação recebe **o mecanismo do LAB-58**, pelos mesmos predicados, com a mesma
 *    medição de distância ao contorno e a mesma calibração contra a função dele;
 * 3. a candidata **aprovaria** num cenário se **todas** as violações dela pertencerem ao que
 *    o cenário resolve. Zero violações fora do cenário ⇒ aprova.
 *
 * E o **ranking é dele**: entre as que aprovariam, a primeira é a de melhor `notaDoMotor`.
 * Este prompt **não escolhe variante** — seria o Lab decidindo pelo motor (§4).
 *
 * # Os cenários, e eles são declarados
 *
 * | cenário | o que se supõe resolvido |
 * |---|---|
 * | `hoje` | nada — é a aferição, e tem de reproduzir o número do LAB-53 |
 * | `so-o-contrato` | só o campo de rua pública existente do Generate |
 * | `so-o-motor` | só os seis mecanismos do motor (as 81) |
 * | `os-dois` | os seis mecanismos **e** o campo do contrato |
 *
 * Uso: `bun run lab59`  (a tampa de exemplos vai levantada pelo `package.json`)
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import { _testadaDoLote, superficiesDeFrente, verificarInvariantesPlano } from "@generate/engine/invariantes.ts";
import { divisaDoAcesso, faixaViaPublica } from "@generate/engine/espinha/fileira-fachada.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";
import { distanciaSegmento } from "@testfit/geo.ts";

import { contratoDasEntradas, type EntradaMinima } from "../src/gleba-v1.ts";
import { linhasDaEntrada, type P } from "../src/motores/comum.ts";
import { amostrasParaOPasso, densificar, probeMexeuNoObjeto } from "../src/probe-de-amostragem.ts";
import { variantesJulgadasDoTestfit } from "../src/motores/testfit.ts";
import {
  MECANISMOS,
  NAO_NOMEADO,
  atribuirMecanismo,
  type Limites,
  type ViolacaoMedida,
} from "../src/mecanismos-das-violacoes.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const PROVAS = join(RAIZ, "docs", "provas");
const SAIDA = join(PROVAS, "LAB-59");
const SEMENTE = 20260913;
const GLEBA = "geo-antonina";

const TOL_DELE_M = 0.75;
const PASSO_M = 0.25;
const MESMA_PROFUNDIDADE_M = 0.5;
const LIMITES: Limites = { tolDele_m: TOL_DELE_M, mesmaProfundidade_m: MESMA_PROFUNDIDADE_M };

/** Os seis mecanismos do motor, como conjunto — o que o cenário "só o motor" resolve. */
const DO_MOTOR = new Set(MECANISMOS.map((m) => m.id));
/** O que o contrato do Generate resolve: a violação que some com o campo `faixaViaPublica`. */
const DO_CONTRATO = "contrato-do-generate-sem-campo-de-rua-publica";

const CENARIOS = [
  { id: "hoje", resolve: new Set<string>(), oQueSupoe: "nada — é a aferição, e tem de bater com o LAB-53" },
  { id: "so-o-contrato", resolve: new Set([DO_CONTRATO]), oQueSupoe: "só o campo de RUA PÚBLICA EXISTENTE no contrato de motor v1 do Generate" },
  { id: "so-o-motor", resolve: DO_MOTOR, oQueSupoe: "só os seis mecanismos do motor medidos no LAB-58 (as 81)" },
  { id: "os-dois", resolve: new Set([...DO_MOTOR, DO_CONTRATO]), oQueSupoe: "os seis mecanismos do motor E o campo do contrato" },
] as const;

const comp = (a: P, b: P) => Math.hypot(b.x - a.x, b.y - a.y);
const n2 = (x: number) => Number(x.toFixed(2));

/** Distância ao CONTORNO, a mesma do LAB-58 — e NÃO o `distanciaAoPoligono` (D198). */
function distAoContorno(p: P, pol: readonly P[]): number {
  let melhor = Infinity;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    melhor = Math.min(melhor, distanciaSegmento(p, pol[j]! as never, pol[i]! as never));
  }
  return melhor;
}

/** A testada reconstruída com a MINHA distância, para ser comparada com a dele (D198). */
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

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  AS DUAS MEDIÇÕES QUE EU IA LER DE PROVA, E POR QUE ELAS PASSARAM A SER MEDIDAS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A primeira versão deste prompt lia dois campos por lote das provas anteriores: a distância
 * à face entregue, do **LAB-50**, e a testada com amostragem fina, do **LAB-54**. Pelo D116
 * isso parecia certo — *não se remede o que outra prova já mediu*.
 *
 * **Estava errado, e o número disse na cara: 696 violações saíram
 * `MECANISMO-NAO-NOMEADO`, em 19 das 20 candidatas.** Entre elas as **40** da `ortogonal` de
 * 1 228 lotes, e eu estava a um passo de publicar *"nem resolvido tudo a de 1 228 aprova"* —
 * quando o que a medição dizia era *"ela tem 40 violações que a MINHA régua não nomeia"*.
 *
 * **A causa:** aquelas provas mediram **a candidata vencedora** de cada gleba. Os lotes
 * externos delas são `v19-eN`; os da `ortogonal` são `v1-eN`, e **não existem lá**. A
 * consulta devolvia `undefined`, o predicado caía, e a violação saía órfã.
 *
 * > **O D116 fala de remedir a MESMA grandeza do MESMO objeto. Ler de uma prova um valor
 * > POR OBJETO, para objetos que ela não contém, não é economia: é uma tabela de consulta
 * > que erra em silêncio** — e erra para o lado pior, o de atribuir ao desconhecido o que é
 * > falta de medição (D23).
 *
 * Então as duas passaram a ser **medidas aqui, para todas as candidatas** — e as provas
 * viraram o que de fato são: a **calibração**. Todo lote que o LAB-50 e o LAB-54 contêm tem
 * de receber aqui o mesmo número; uma divergência e a ferramenta para.
 */
function aoSegmentoDaFaceEntregue(pontos: readonly P[], linhas: readonly P[][]): number | null {
  if (!linhas.length) return null;
  let melhor = Infinity;
  for (const v of pontos) {
    for (const lin of linhas) {
      for (let i = 0; i + 1 < lin.length; i++) {
        melhor = Math.min(melhor, distanciaSegmento(v, lin[i]! as never, lin[i + 1]! as never));
      }
    }
  }
  return Number.isFinite(melhor) ? Number(melhor.toFixed(1)) : null;
}

function conferirNumero(x: number, onde: string): number {
  if (!Number.isFinite(x)) {
    console.error(`✗ ${onde}: a medição devolveu \`${x}\`, que não é número — e um NaN aqui sairia\n` +
      `  como acusação a uma candidata do motor do vizinho (D175).`);
    process.exit(1);
  }
  return x;
}

const entrada = JSON.parse(readFileSync(join(FIXTURES, `${GLEBA}.entrada.json`), "utf8")) as EntradaMinima;

// ── A PROVA DO LAB-53, LIDA: a aferição tem de bater com ela ────────────────
const prova53 = JSON.parse(
  readFileSync(join(PROVAS, "LAB-53", "violacoes-depois-do-conserto-da-ponte.json"), "utf8"),
) as { glebas: { gleba: string; variante: string; violacoes: number }[]; violacoes: { gleba: string; tipo: string }[] };
const doLab53 = prova53.glebas.find((g) => g.gleba === GLEBA);
if (!doLab53) {
  console.error(`✗ a prova do LAB-53 não tem a gleba ${GLEBA}`);
  process.exit(1);
}

/**
 * O contrafactual do campo que falta, na prova do LAB-53 — **CALIBRAÇÃO**, não fonte.
 *
 * Esta era a TERCEIRA consulta por lote a uma prova da candidata vencedora, e deu o mesmo
 * defeito das outras duas: 237 das 238 órfãs eram lotes externos sobre a rua entregue —
 * exatamente a forma das 11 do contrato — e saíam órfãs só porque os ids delas (`v1-eN`,
 * `v2-eN`…) não existem na prova, que mediu `v19-eN`.
 */
const SOME_COM_A_FAIXA_53 = new Map<string, boolean | null>();
{
  const p = JSON.parse(
    readFileSync(join(PROVAS, "LAB-53", "violacoes-depois-do-conserto-da-ponte.json"), "utf8"),
  ) as { violacoes: { gleba: string; tipo: string; loteId: string | null; someComAFaixaViaPublica: boolean | null }[] };
  for (const v of p.violacoes) SOME_COM_A_FAIXA_53.set(`${v.gleba}|${v.tipo}|${v.loteId ?? ""}`, v.someComAFaixaViaPublica);
}
/** A distância de cada lote externo à face entregue, na prova do LAB-50 — CALIBRAÇÃO. */
const AO_SEGMENTO_50 = new Map<string, number>();
{
  const p = JSON.parse(readFileSync(join(PROVAS, "LAB-50", "passagem-externa.json"), "utf8")) as {
    glebas: { gleba: string; lotes: { lote: string; aoSegmentoDaTestada_m: number }[] }[];
  };
  for (const g of p.glebas) for (const l of g.lotes) AO_SEGMENTO_50.set(`${g.gleba}|${l.lote}`, l.aoSegmentoDaTestada_m);
}
/** A classe e a testada fina do LAB-54, por lote de `frente` — CALIBRAÇÃO. */
const CLASSE_54 = new Map<string, { classe: string; testadaComPassoFino_m: number }>();
{
  const p = JSON.parse(readFileSync(join(PROVAS, "LAB-54", "frente-nao-atribuida.json"), "utf8")) as {
    violacoes: { gleba: string; loteId: string; classe: string; testadaComPassoFino_m: number }[];
  };
  for (const v of p.violacoes) CLASSE_54.set(`${v.gleba}|frente|${v.loteId}`, v);
}

// ── AS VINTE CANDIDATAS ─────────────────────────────────────────────────────
/** As linhas de testada de frente da ENTRADA — a face que o Lab entrega ao motor. */
const TESTADAS_DA_ENTRADA = linhasDaEntrada(entrada).testadasDeFrente as unknown as P[][];
const julgadas = variantesJulgadasDoTestfit(entrada, SEMENTE);
const discordancias: string[] = [];
const linhas: Record<string, unknown>[] = [];

for (const [i, cand] of julgadas.entries()) {
  const l = montarParcelamentoExterno(cand.saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) {
    // Candidata que o ESQUEMA recusa não entra no ranking dele, e por isso não entra aqui.
    linhas.push({
      posicaoNoRankingDele: i + 1,
      formato: cand.formato,
      notaDoMotor: cand.notaDoMotor,
      recusadaPeloEsquema: l.conferencia.erros.slice(0, 3),
    });
    continue;
  }
  const res = l.externo.resultado as never as {
    lotes: { id: string; quadraId?: string; pontos: P[]; area: number }[];
    quadras: { id: string; pontos: P[] }[];
    rede: { principal: unknown[]; secundarias: unknown[] };
    culDeSacs?: unknown[];
    faixaViaPublica?: P[][];
    terreno: { poligono: P[] };
    params: { testadaMin: number; faceQuadraMax: number };
  };
  const rel = verificarInvariantesPlano(res as never);
  if (rel.exemplos.length !== rel.violacoes) {
    console.error(`✗ ${cand.formato}: ${rel.violacoes} violações e só ${rel.exemplos.length} exemplos.\n` +
      `  Rode assim:  INVARIANTES_EXEMPLOS=100000 bun ferramentas/lab59.ts`);
    process.exit(1);
  }

  // ── O CONTRAFACTUAL DO CONTRATO, MEDIDO para ESTA candidata ─────────────
  //
  // A geometria é inteiramente do Generate — `divisaDoAcesso` escolhe a divisa e decide o
  // lado de dentro, `faixaViaPublica` constrói a faixa —, e quem diz se a violação some é o
  // Validator dele, rodando outra vez. É o procedimento do LAB-48/LAB-53, aplicado às VINTE
  // candidatas em vez de só à vencedora: é esse "em vez de" que estava faltando.
  const comFaixa = (() => {
    if (!TESTADAS_DA_ENTRADA.length) return null;
    const linha = TESTADAS_DA_ENTRADA[0]!;
    const a = linha[0]!;
    const b = linha[linha.length - 1]!;
    const divisa = divisaDoAcesso(res.terreno.poligono as never, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } as never);
    if (!divisa) return null;
    const faixa = faixaViaPublica(divisa, 8) as P[];
    const depois = verificarInvariantesPlano({ ...res, faixaViaPublica: [faixa] } as never);
    return new Set(depois.exemplos.map((v) => `${v.tipo}|${v.loteId}`));
  })();

  const sup = [
    ...superficiesDeFrente([...res.rede.principal, ...res.rede.secundarias] as never, (res.culDeSacs ?? []) as never),
    ...((res.faixaViaPublica ?? []) as P[][]),
  ] as P[][];
  const porId = new Map(res.lotes.map((x) => [x.id, x]));
  const lotesDaQuadra = new Map<string, number>();
  for (const lo of res.lotes) lotesDaQuadra.set(lo.quadraId ?? "—", (lotesDaQuadra.get(lo.quadraId ?? "—") ?? 0) + 1);
  const profDaQuadra = new Map<string, number>();
  for (const q of res.quadras) {
    const cont = new Map<number, number>();
    for (const lo of res.lotes.filter((x) => x.quadraId === q.id)) {
      const m = conferirNumero(
        Number(Math.max(...lo.pontos.map((a, k) => comp(a, lo.pontos[(k + 1) % lo.pontos.length]!))).toFixed(1)),
        `${cand.formato}/${q.id} profundidade modal`,
      );
      cont.set(m, (cont.get(m) ?? 0) + 1);
    }
    let melhor: number | null = null;
    let n = -1;
    for (const [v, c] of cont) if (c > n) { n = c; melhor = v; }
    profDaQuadra.set(q.id, melhor ?? Number.NaN);
  }

  const porMecanismo: Record<string, number> = {};
  const naoNomeadas: string[] = [];
  /**
   * O QUE AS NÃO NOMEADAS TÊM EM COMUM — porque "órfã" não pode ser caixa fechada.
   *
   * A conclusão deste prompt depende disto: dizer *"só a superquadra aprova"* sem dizer **o
   * que sobra nas outras** faria a frase soar como "as outras são insalváveis", quando a
   * medição diz *"as outras guardam violações que a minha régua não nomeia"*. Então o balde
   * sai **caracterizado**: tipo, dentro ou fora, e a distância medida (D23).
   */
  const orfas: Record<string, unknown>[] = [];
  for (const v of rel.exemplos) {
    const chave = `${GLEBA}|${v.tipo}|${v.loteId ?? ""}`;
    let medida: ViolacaoMedida;
    if (v.tipo === "face-quadra") {
      const q = res.quadras.find((x) => x.id === v.loteId);
      const faces = q ? q.pontos.map((a, k) => n2(comp(a, q.pontos[(k + 1) % q.pontos.length]!))) : null;
      const pr = profDaQuadra.get(v.loteId ?? "");
      medida = {
        gleba: GLEBA, tipo: v.tipo, loteId: v.loteId ?? null, chave, externo: false, quadraId: v.loteId ?? null,
        facesDaQuadra_m: faces,
        facesAcimaDoTeto: faces ? faces.filter((f) => f > res.params.faceQuadraMax).length : null,
        facesAbaixoDoTeto: faces ? faces.filter((f) => f <= res.params.faceQuadraMax).length : null,
        tetoDeFace_m: res.params.faceQuadraMax,
        dAoContornoDaVia_m: null, verticesDoLote: null, arestas_m: null, maiorAresta_m: null,
        profundidadeModalDaFileira_m: pr !== undefined && Number.isFinite(pr) ? pr : null,
        lotesNaQuadra: lotesDaQuadra.get(v.loteId ?? "—") ?? null, testadaDele_m: null,
        testadaMin_m: res.params.testadaMin, aoSegmentoDaFaceEntregue_m: null,
        classe_LAB54: null, testadaComPassoFino_m: null, doContratoDoGenerate: false,
      };
    } else {
      const lo = porId.get(v.loteId ?? "");
      if (!lo) { console.error(`✗ ${chave}: o Validator acusou um lote que não existe na saída.`); process.exit(1); }
      const pts = lo.pontos;
      const arestas = pts.map((a, k) => comp(a, pts[(k + 1) % pts.length]!));
      const maior = Math.max(...arestas);
      const denso = densificar(pts, amostrasParaOPasso(maior, PASSO_M));
      let d = Infinity;
      for (const pp of denso) for (const sf of sup) d = Math.min(d, distAoContorno(pp, sf));
      conferirNumero(d, `${chave} distância ao contorno`);
      const testadaDele = conferirNumero(_testadaDoLote(pts as never, sup as never), `${chave} testada DELE`);
      // A CALIBRAÇÃO do D198, em TODO lote acusado — o escopo é o que faltava lá.
      const recon = conferirNumero(testadaReconstruida(pts, sup), `${chave} testada reconstruída`);
      if (Math.abs(recon - testadaDele) > 1e-6) {
        discordancias.push(`${cand.formato}/${chave}: ele devolve ${n2(testadaDele)} m e a minha distância reconstrói ${n2(recon)} m`);
      }
      const pr = profDaQuadra.get(lo.quadraId ?? "");

      // ── A TESTADA COM AMOSTRAGEM FINA, medida aqui com a função DELE ──────
      const denso2 = densificar(pts, amostrasParaOPasso(maior, PASSO_M));
      const mexeu = probeMexeuNoObjeto(pts, denso2);
      if (mexeu !== null) {
        console.error(`✗ ${cand.formato}/${chave}: densificar MEXEU no objeto — ${mexeu}`);
        process.exit(1);
      }
      const testadaFina = conferirNumero(_testadaDoLote(denso2 as never, sup as never), `${chave} testada fina`);
      const aoSegmento = aoSegmentoDaFaceEntregue(pts, TESTADAS_DA_ENTRADA);

      // ── A PRECONDIÇÃO QUE FECHA O CAMINHO SILENCIOSO (D175, D198) ────────
      //
      // Se a entrada entrega face e este lote é externo, a distância **existe**. `null` ali
      // só pode ser falta de medição — e falta de medição aqui não estoura: ela faz o
      // predicado do mecanismo 1 cair, a violação sair `MECANISMO-NAO-NOMEADO`, e o
      // contrafactual publicar **o contrário da verdade**. Foi exatamente isso que as duas
      // sabotagens deste prompt reproduziram, as duas com `exit 0`.
      //
      // *Caminho errado que estoura é barato; o que devolve `null` é uma acusação
      // publicável.* Então aqui ele estoura.
      if (TESTADAS_DA_ENTRADA.length && /-e\d+$/.test(lo.id) && aoSegmento === null) {
        console.error(
          `✗ ${cand.formato}/${chave}: lote EXTERNO sem distância à face entregue, com a entrada\n` +
            `  entregando ${TESTADAS_DA_ENTRADA.length} linha(s) de testada. \`null\` aqui não é "não há":\n` +
            `  é "não medi" — e faz o mecanismo 1 cair e a violação sair NÃO NOMEADA.`,
        );
        process.exit(1);
      }

      // ── A CALIBRAÇÃO contra as provas, onde elas CONTÊM o lote ────────────
      const c54 = CLASSE_54.get(chave);
      if (c54 && Math.abs(c54.testadaComPassoFino_m - Number(testadaFina.toFixed(2))) > 0.01) {
        discordancias.push(
          `${cand.formato}/${chave}: o LAB-54 mediu testada fina ${c54.testadaComPassoFino_m} m e aqui deu ${n2(testadaFina)} m`,
        );
      }
      const d50 = AO_SEGMENTO_50.get(`${GLEBA}|${lo.id}`);
      if (d50 !== undefined && aoSegmento !== null && Math.abs(d50 - aoSegmento) > 0.1) {
        discordancias.push(
          `${cand.formato}/${chave}: o LAB-50 mediu ${d50} m até a face entregue e aqui deu ${aoSegmento} m`,
        );
      }

      medida = {
        gleba: GLEBA, tipo: v.tipo, loteId: v.loteId ?? null, chave,
        externo: /-e\d+$/.test(lo.id), quadraId: lo.quadraId ?? null,
        facesDaQuadra_m: null, facesAcimaDoTeto: null, facesAbaixoDoTeto: null,
        tetoDeFace_m: res.params.faceQuadraMax,
        dAoContornoDaVia_m: n2(d), verticesDoLote: pts.length, arestas_m: arestas.map(n2),
        maiorAresta_m: n2(maior),
        profundidadeModalDaFileira_m: pr !== undefined && Number.isFinite(pr) ? pr : null,
        lotesNaQuadra: lotesDaQuadra.get(lo.quadraId ?? "—") ?? null,
        testadaDele_m: n2(testadaDele), testadaMin_m: res.params.testadaMin,
        aoSegmentoDaFaceEntregue_m: aoSegmento,
        classe_LAB54: c54?.classe ?? null, testadaComPassoFino_m: n2(testadaFina),
        doContratoDoGenerate: false,
      };
    }

    // ── A QUEM ESTA VIOLAÇÃO PERTENCE ───────────────────────────────────────
    //
    // O contrato do Generate vem PRIMEIRO, e isso é a ordem do LAB-53: a violação que
    // SOME com o campo `faixaViaPublica` é dele, e as 11 de Antonina são assim. Só o que
    // resta vai aos predicados do LAB-58.
    const someComAFaixa = comFaixa ? !comFaixa.has(`${v.tipo}|${v.loteId}`) : null;
    const no53 = SOME_COM_A_FAIXA_53.get(chave);
    if (no53 !== undefined && no53 !== null && someComAFaixa !== null && no53 !== someComAFaixa) {
      discordancias.push(
        `${cand.formato}/${chave}: o LAB-53 mediu someComAFaixaViaPublica=${no53} e aqui deu ${someComAFaixa}`,
      );
    }
    const dono = someComAFaixa === true ? DO_CONTRATO : atribuirMecanismo(medida, LIMITES);
    porMecanismo[dono] = (porMecanismo[dono] ?? 0) + 1;
    if (dono === NAO_NOMEADO) {
      naoNomeadas.push(chave);
      orfas.push({
        chave, tipo: medida.tipo, externo: medida.externo,
        dAoContornoDaVia_m: medida.dAoContornoDaVia_m,
        aoSegmentoDaFaceEntregue_m: medida.aoSegmentoDaFaceEntregue_m,
        testadaDele_m: medida.testadaDele_m, testadaComPassoFino_m: medida.testadaComPassoFino_m,
        testadaMin_m: medida.testadaMin_m, verticesDoLote: medida.verticesDoLote,
        quadraId: medida.quadraId, profundidadeModalDaFileira_m: medida.profundidadeModalDaFileira_m,
      });
    }
  }

  const cenarios: Record<string, { violacoesQueRestam: number; aprovaria: boolean; oQueAindaBloqueia: string[] }> = {};
  for (const c of CENARIOS) {
    const restam = Object.entries(porMecanismo).filter(([k]) => !c.resolve.has(k));
    cenarios[c.id] = {
      violacoesQueRestam: restam.reduce((s, [, n]) => s + n, 0),
      aprovaria: restam.length === 0,
      oQueAindaBloqueia: restam.map(([k, n]) => `${k} (${n})`).sort(),
    };
  }

  linhas.push({
    posicaoNoRankingDele: i + 1,
    formato: cand.formato,
    notaDoMotor: cand.notaDoMotor,
    lotes: res.lotes.length,
    quadras: res.quadras.length,
    lotesExternos: res.lotes.filter((x) => /-e\d+$/.test(x.id)).length,
    violacoesHoje: rel.violacoes,
    porTipo: rel.porTipo,
    porMecanismo,
    naoNomeadas,
    oQueAsNaoNomeadasTemEmComum: orfas.length
      ? {
          quantas: orfas.length,
          porTipo: orfas.reduce<Record<string, number>>((acc, o) => { acc[String(o["tipo"])] = (acc[String(o["tipo"])] ?? 0) + 1; return acc; }, {}),
          externas: orfas.filter((o) => o["externo"] === true).length,
          internas: orfas.filter((o) => o["externo"] === false).length,
          aDistanciaAoContorno_m: (() => {
            const ds = orfas.map((o) => o["dAoContornoDaVia_m"]).filter((x): x is number => typeof x === "number");
            return ds.length ? { min: Math.min(...ds), max: Math.max(...ds) } : null;
          })(),
          encostamNaVia: orfas.filter((o) => typeof o["dAoContornoDaVia_m"] === "number" && (o["dAoContornoDaVia_m"] as number) <= TOL_DELE_M).length,
          comTestadaFinaACIMADoMinimo: orfas.filter((o) => typeof o["testadaComPassoFino_m"] === "number" && (o["testadaComPassoFino_m"] as number) >= (o["testadaMin_m"] as number)).length,
          lista: orfas,
        }
      : null,
    cenarios,
  });
}

if (discordancias.length) {
  console.error(`✗ CALIBRAÇÃO FALHOU em ${discordancias.length} lote(s) — a minha distância discorda da função DELE:`);
  for (const x of discordancias.slice(0, 10)) console.error(`  ${x}`);
  console.error("  Régua que discorda do veredicto que ela deveria explicar não explica nada (D93, D127, D198).");
  process.exit(1);
}

// ── A AFERIÇÃO: a candidata nº 1 tem de reproduzir o número do LAB-53 ───────
const primeira = linhas.find((x) => x["posicaoNoRankingDele"] === 1);
if (!primeira || primeira["violacoesHoje"] !== doLab53.violacoes) {
  console.error(
    `✗ a aferição falhou: o LAB-53 mediu ${doLab53.violacoes} violações na variante "${doLab53.variante}" ` +
      `de ${GLEBA}, e aqui a 1ª do ranking ("${String(primeira?.["formato"])}") deu ` +
      `${String(primeira?.["violacoesHoje"])}.\n` +
      `  Contrafactual que não reproduz o presente não mede futuro nenhum.`,
  );
  process.exit(1);
}

const aprovaveis = (cen: string) =>
  linhas.filter((x) => (x["cenarios"] as Record<string, { aprovaria: boolean }> | undefined)?.[cen]?.aprovaria);

console.log(`══════════ LAB-59 · o contrafactual de ${GLEBA} ══════════`);
console.log(`  candidatas julgadas (as que entram no ranking dele): ${julgadas.length}`);
console.log(`  aferição: a 1ª do ranking é "${String(primeira["formato"])}" com ${String(primeira["violacoesHoje"])} violações — o LAB-53 mediu ${doLab53.violacoes} ✓`);
console.log("");
console.log("  pos  formato          lotes   viol   hoje  só-contrato  só-motor  os-dois");
for (const x of linhas) {
  const c = x["cenarios"] as Record<string, { aprovaria: boolean }> | undefined;
  if (!c) { console.log(`  ${String(x["posicaoNoRankingDele"]).padStart(3)}  ${String(x["formato"]).padEnd(14)}  RECUSADA PELO ESQUEMA`); continue; }
  const s = (k: string) => (c[k]!.aprovaria ? "APROVA" : "  —   ");
  console.log(
    `  ${String(x["posicaoNoRankingDele"]).padStart(3)}  ${String(x["formato"]).padEnd(14)} ${String(x["lotes"]).padStart(6)} ${String(x["violacoesHoje"]).padStart(6)}  ${s("hoje")}  ${s("so-o-contrato")}      ${s("so-o-motor")}   ${s("os-dois")}`,
  );
}
console.log("");
for (const c of CENARIOS) {
  const ap = aprovaveis(c.id);
  const campeao = ap[0];
  console.log(
    `  ${c.id.padEnd(14)} aprovam ${String(ap.length).padStart(2)} de ${julgadas.length}` +
      (campeao ? ` · o ranking DELE escolheria "${String(campeao["formato"])}" com ${String(campeao["lotes"])} lotes (nota ${Number(campeao["notaDoMotor"]).toFixed(4)})` : " · NENHUMA"),
  );
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "contrafactual-de-antonina.json"),
  JSON.stringify(
    {
      prompt: "LAB-59",
      oQueIstoMede:
        "quais das candidatas julgadas de geo-antonina passariam a APROVAR em cada cenário de " +
        "conserto, e qual delas o ranking DO MOTOR escolheria então — para responder se preferir " +
        "33 lotes a 1.228 é consequência das violações ou da nota dele",
      quando: new Date().toISOString(),
      gleba: GLEBA,
      motor: "Laboratório de Parcelamento (motor-testfit) — o motor PADRÃO da tela unificada",
      semente: SEMENTE,
      contrato: contratoDasEntradas([entrada]),
      aEscolhaEhDELE:
        "este prompt NÃO escolhe variante: ele ordena pela `notaDoMotor` e diz qual seria a " +
        "primeira entre as que aprovariam. Escolher por mim seria o Lab decidindo pelo motor (§4)",
      aAfericao: {
        oQue: "a 1ª do ranking tem de reproduzir o número do LAB-53 nesta gleba",
        oLab53: { variante: doLab53.variante, violacoes: doLab53.violacoes },
        medidoAqui: { formato: primeira["formato"], violacoes: primeira["violacoesHoje"] },
        porque: "contrafactual que não reproduz o presente não mede futuro nenhum",
      },
      aCalibracao: {
        qual: "em TODO lote acusado, a minha distância ao CONTORNO reconstrói o número do `_testadaDoLote` dele (teto 1e-6 m)",
        porqueOEscopoEhTODOS: "no LAB-58 uma sabotagem passou porque a calibração olhava só os lotes de `frente` (D198)",
        eMais:
          "a testada com amostragem fina e a distância à face entregue são MEDIDAS aqui para as " +
          "vinte candidatas, e as provas do LAB-54 e do LAB-50 são a CALIBRAÇÃO: todo lote que elas " +
          "contêm tem de receber aqui o mesmo número (teto 0,01 m e 0,1 m)",
        aTerceiraMedicaoViva:
          "o contrafactual do campo `faixaViaPublica` TAMBÉM é medido por candidata, com o " +
          "`divisaDoAcesso` e o `faixaViaPublica` do Generate e o Validator dele rodando outra " +
          "vez — e a prova do LAB-53 calibra a vencedora. Era a terceira consulta por lote a uma " +
          "prova da candidata VENCEDORA, e deu o mesmo defeito: 237 das 238 órfãs eram lotes " +
          "externos sobre a rua entregue, a forma exata das 11 do contrato",
        porqueNaoSaoLIDAS:
          "a primeira versão deste prompt as lia das provas, e 696 violações em 19 das 20 candidatas " +
          "saíram MECANISMO-NAO-NOMEADO — entre elas as 40 da `ortogonal` de 1.228 lotes. Aquelas " +
          "provas mediram a candidata VENCEDORA: os lotes externos dela são `v19-eN`, os da ortogonal " +
          "são `v1-eN`, e não existem lá. O D116 fala de remedir a MESMA grandeza do MESMO objeto; " +
          "ler de uma prova um valor POR OBJETO, para objetos que ela não contém, é tabela de " +
          "consulta que erra em silêncio — e erra para o lado de atribuir ao desconhecido o que é " +
          "falta de medição (D23)",
        discordancias: discordancias.length,
      },
      aOrdemDaATRIBUICAO: {
        qual: "o contrato do Generate vem PRIMEIRO; só o que resta vai aos predicados do LAB-58",
        porque:
          "é a ordem do LAB-53: a violação que SOME com o campo `faixaViaPublica` é do contrato, " +
          "e as 11 de Antonina são assim. Atribuir ao motor uma violação que o campo faz desaparecer " +
          "seria acusar o vizinho por um campo que falta no OUTRO vizinho",
      },
      cenarios: CENARIOS.map((c) => {
        const ap = aprovaveis(c.id);
        return {
          id: c.id,
          oQueSupoe: c.oQueSupoe,
          resolve: [...c.resolve],
          quantasAprovam: ap.length,
          deQuantas: julgadas.length,
          aPrimeiraNoRankingDELE: ap[0]
            ? { formato: ap[0]["formato"], lotes: ap[0]["lotes"], notaDoMotor: ap[0]["notaDoMotor"], posicaoNoRankingDele: ap[0]["posicaoNoRankingDele"] }
            : null,
          todasQueAprovam: ap.map((x) => ({ formato: x["formato"], lotes: x["lotes"], notaDoMotor: x["notaDoMotor"] })),
        };
      }),
      candidatas: linhas,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-59/contrafactual-de-antonina.json`);
