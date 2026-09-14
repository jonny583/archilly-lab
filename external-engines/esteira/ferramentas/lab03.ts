#!/usr/bin/env bun
/**
 * LAB-03 — o que a interpolação do relevo faz com a rampa, e as glebas-padrão
 * com relevo.
 *
 * ```sh
 * bun ferramentas/lab03.ts
 * ```
 *
 * # Parte A — a correção de interpolação, medida na rampa
 *
 * A correção já está aplicada desde o LAB-01 (`alturas.ts`: interpolar entre
 * **cotas distintas**, não entre os k vizinhos mais próximos). O que nunca foi
 * medido é **o que ela muda na rampa das ruas** — o LAB-01 mediu o efeito no
 * campo de alturas (85 % → 0,3 % de células sobre um valor de curva), não no
 * traçado.
 *
 * O experimento: o MESMO motor, a MESMA semente, a MESMA gleba, sobre dois
 * mapas de alturas — o corrigido e o defeituoso (k = 6 vizinhos, que é o que o
 * Generate ainda usa). Tudo o mais idêntico.
 *
 * # Parte B — as glebas-padrão do Generate, com relevo
 *
 * Elas não têm topografia, e por isso o Symbios não as come (LAB-02, §6). Aqui
 * nascem as fixtures: a poligonal e os parâmetros do Generate, intocados, mais
 * um relevo **sintético e declarado**. A prova é o Symbios passando a rodar.
 *
 * **O Generate não é alterado.** A proposta de adotá-las lá vai no relatório.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { gerarRedeViaria, Motor, recortarPelaGleba } from "@symbios/index.ts";
import { montarAlturas, type MapaDeAlturas } from "@symbios/alturas.ts";
import type { Ponto, Terreno, Via } from "@symbios/contrato.ts";

import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { montarAlturasPorKVizinhos } from "../src/relevo-k-vizinhos.ts";
import { comRelevo, DESNIVEL_M, EQUIDISTANCIA_M } from "../src/fixtures-com-relevo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-03");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const GLEBAS_DO_GENERATE = join(RAIZ, "..", "urban-create-hub-41d93a4d", "docs", "glebas-padrao");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const PASSO_GRADE_M = 2;
const CARIMBO = "2026-09-14T00:00:00.000Z";

const n2 = (v: number) => Number(v.toFixed(2));
const pc = (a: number, b: number) => (b > 0 ? Number(((100 * a) / b).toFixed(2)) : 0);

// ────────────────────────────────── as duas estatísticas do campo de alturas

/**
 * As mesmas duas do LAB-01, agora sobre o mapa que o motor realmente comeu.
 *
 * - **sobre um valor de curva**: células a menos de 2 cm de uma cota de curva.
 *   Alto = terraço, a interpolação devolveu a cota da curva em vez de interpolar.
 * - **gradiente zero**: células sem inclinação nenhuma — a consequência que
 *   quebra o motor, porque campo tensorial lido de terreno plano não segue
 *   topografia.
 */
function estatisticasDoCampo(mapa: MapaDeAlturas) {
  let sobreCurva = 0;
  let validas = 0;
  for (const z of mapa.alturas) {
    if (!Number.isFinite(z)) continue;
    validas++;
    const d = Math.abs(z / EQUIDISTANCIA_M - Math.round(z / EQUIDISTANCIA_M)) * EQUIDISTANCIA_M;
    if (d < 0.02) sobreCurva++;
  }
  const grads: number[] = [];
  for (let iy = 1; iy < mapa.ny - 1; iy++) {
    for (let ix = 1; ix < mapa.nx - 1; ix++) {
      const at = (i: number, j: number) => mapa.alturas[j * mapa.nx + i]!;
      const gx = (at(ix + 1, iy) - at(ix - 1, iy)) / (2 * mapa.celula_m);
      const gy = (at(ix, iy + 1) - at(ix, iy - 1)) / (2 * mapa.celula_m);
      grads.push(Math.hypot(gx, gy) * 100);
    }
  }
  grads.sort((a, b) => a - b);
  const q = (t: number) => (grads.length ? grads[Math.floor((grads.length - 1) * t)]! : 0);
  return {
    celulas: validas,
    sobreValorDeCurva_pct: pc(sobreCurva, validas),
    gradienteZero_pct: pc(grads.filter((g) => g < 0.01).length, grads.length),
    declividade_pct: { p10: n2(q(0.1)), mediana: n2(q(0.5)), p90: n2(q(0.9)), maxima: n2(grads.at(-1) ?? 0) },
    cotas_m: { min: n2(mapa.cotaMin), max: n2(mapa.cotaMax) },
  };
}

// ─────────────────────────────────────────────── rampa por trecho e por nó

const TOL = 0.01;
const chave = (p: Ponto) => `${Math.round(p.x / TOL)}:${Math.round(p.y / TOL)}`;

function grausDe(vias: Via[]): Map<string, number> {
  const g = new Map<string, number>();
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      for (const p of [v.pontos[i - 1]!, v.pontos[i]!]) g.set(chave(p), (g.get(chave(p)) ?? 0) + 1);
    }
  }
  return g;
}

/** Rampa por aresta, repartida por grau do nó — a definição do LAB-01 e do LAB-02. */
function rampas(vias: Via[], grau: Map<string, number>) {
  const aoLongo: number[] = [];
  const cruzamento: number[] = [];
  let compAoLongo = 0;
  let compCruz = 0;
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      const a = v.pontos[i - 1]!;
      const b = v.pontos[i]!;
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (d < 1e-6) continue;
      const r = (Math.abs(v.cotas_m[i]! - v.cotas_m[i - 1]!) / d) * 100;
      if (Math.max(grau.get(chave(a)) ?? 0, grau.get(chave(b)) ?? 0) >= 3) {
        cruzamento.push(r);
        compCruz += d;
      } else {
        aoLongo.push(r);
        compAoLongo += d;
      }
    }
  }
  const resumo = (xs: number[], comp: number) => {
    const o = [...xs].sort((a, b) => a - b);
    const q = (t: number) => (o.length ? o[Math.floor((o.length - 1) * t)]! : 0);
    return {
      arestas: o.length,
      comprimento_m: n2(comp),
      mediana_pct: n2(q(0.5)),
      p90_pct: n2(q(0.9)),
      p99_pct: n2(q(0.99)),
      maxima_pct: n2(o.at(-1) ?? 0),
      acimaDe10: o.filter((r) => r > 10.5).length,
      acimaDe10_pct: pc(o.filter((r) => r > 10.5).length, o.length),
    };
  };
  return {
    aoLongo: resumo(aoLongo, compAoLongo),
    cruzamento: resumo(cruzamento, compCruz),
    todas: resumo([...aoLongo, ...cruzamento], compAoLongo + compCruz),
  };
}

/**
 * Quanto a rede é uma GRADE, em fração do comprimento.
 *
 * # Por que esta medida é necessária
 *
 * Comparar rampa entre os dois interpoladores só faz sentido se os dois
 * produzirem a mesma espécie de traçado. Na gleba plana o defeituoso saiu com
 * rampa de cruzamento MENOR (11,44 % contra 15,44 %), o que pareceria uma
 * vitória dele — e não é: com 95 % da grade em gradiente zero, o campo
 * tensorial não tem direção para seguir e o motor **degenera em grade
 * ortogonal**. O próprio `alturas.ts` avisa disso no cabeçalho.
 *
 * Uma grade num terreno plano não tem rampa porque não há relevo, não porque o
 * traçado seja bom. Esta medida separa as duas coisas.
 *
 * # Como
 *
 * O azimute de cada aresta, dobrado para o intervalo de 0 a 90° (uma rua
 * norte-sul e uma leste-oeste são a mesma família numa grade). Acha-se a
 * direção dominante por histograma e mede-se quanto do comprimento cai a menos
 * de 5° dela ou da perpendicular. Numa grade perfeita isso dá 100 %; num
 * traçado que segue curva de nível, bem menos.
 */
function ortogonalidade(vias: Via[]): { fracaoNaGrade: number; direcaoDominante_graus: number } {
  const BALDES = 90;
  const hist = new Float64Array(BALDES);
  const arestas: { ang: number; d: number }[] = [];
  for (const v of vias) {
    for (let i = 1; i < v.pontos.length; i++) {
      const a = v.pontos[i - 1]!;
      const b = v.pontos[i]!;
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (d < 1e-6) continue;
      // Azimute dobrado para 0..90°: a grade tem duas famílias perpendiculares.
      const ang = ((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 360) % 90;
      arestas.push({ ang, d });
      hist[Math.min(BALDES - 1, Math.floor(ang))] += d;
    }
  }
  const total = arestas.reduce((s, e) => s + e.d, 0);
  if (total <= 0) return { fracaoNaGrade: 0, direcaoDominante_graus: 0 };

  let melhor = 0;
  for (let i = 1; i < BALDES; i++) if (hist[i]! > hist[melhor]!) melhor = i;
  const dominante = melhor + 0.5;

  // A menos de 5° da dominante — e, como o ângulo já está dobrado em 90°, a
  // perpendicular já está incluída, com a volta pelo zero.
  const perto = arestas
    .filter((e) => {
      const dif = Math.abs(e.ang - dominante);
      return Math.min(dif, 90 - dif) <= 5;
    })
    .reduce((s, e) => s + e.d, 0);

  return { fracaoNaGrade: Number((perto / total).toFixed(4)), direcaoDominante_graus: n2(dominante) };
}

// ═══════════════════════════════════════════════════════ PARTE A · o efeito

const motor = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });
mkdirSync(FIXTURES, { recursive: true });

/** As glebas com relevo de verdade — as mesmas do LAB-02, para o elo. */
const DO_LAB = ["completo", "sintetico-50ha-ondulado", "sintetico-10ha-plano"];

const parteA: Record<string, unknown>[] = [];

console.log("═══════════ PARTE A · a interpolação, medida na rampa ═══════════");

for (const id of DO_LAB) {
  const { terreno } = glebaParaOSymbios(glebaDoLab(id));
  const t = terreno as Terreno;

  const mapaCorrigido = montarAlturas(t, PASSO_GRADE_M);
  const mapaDefeituoso = montarAlturasPorKVizinhos(t, PASSO_GRADE_M);

  // MESMO motor, MESMA semente, MESMA gleba. Só o mapa muda.
  const corrigido = gerarRedeViaria(motor, t, { passoGrade_m: PASSO_GRADE_M }, SEMENTE, mapaCorrigido);
  const defeituoso = gerarRedeViaria(motor, t, { passoGrade_m: PASSO_GRADE_M }, SEMENTE, mapaDefeituoso);

  // Recortado, porque é assim que a rede sai do LAB-02 — medir a rede crua
  // misturaria o defeito de interpolação com a via que nasce fora da gleba.
  const cC = recortarPelaGleba(corrigido, t);
  const cD = recortarPelaGleba(defeituoso, t);

  const registro = {
    prompt: "LAB-03",
    parte: "A",
    gleba: id,
    motor: "symbios-tensor",
    versaoMotor: "0.4.1",
    semente: SEMENTE,
    contrato: "1",
    passoGrade_m: PASSO_GRADE_M,
    campoDeAlturas: {
      corrigido: estatisticasDoCampo(mapaCorrigido),
      kVizinhos: estatisticasDoCampo(mapaDefeituoso),
    },
    rede: {
      corrigido: { trechos: cC.vias.length, comprimento_m: n2(cC.comprimentoDepois_m) },
      kVizinhos: { trechos: cD.vias.length, comprimento_m: n2(cD.comprimentoDepois_m) },
    },
    rampa: {
      corrigido: rampas(cC.vias, grausDe(cC.vias)),
      kVizinhos: rampas(cD.vias, grausDe(cD.vias)),
    },
    // A pergunta que a rampa sozinha não responde: os dois traçados são da
    // mesma espécie? Ver o cabeçalho de `ortogonalidade`.
    grade: {
      corrigido: ortogonalidade(cC.vias),
      kVizinhos: ortogonalidade(cD.vias),
    },
  };
  parteA.push(registro);

  const cc = registro.campoDeAlturas;
  const rr = registro.rampa;
  console.log(`\n─── ${id}`);
  console.log(`  CAMPO   sobre valor de curva: ${cc.corrigido.sobreValorDeCurva_pct} %  vs  ${cc.kVizinhos.sobreValorDeCurva_pct} % (k=6)`);
  console.log(`          gradiente zero:       ${cc.corrigido.gradienteZero_pct} %  vs  ${cc.kVizinhos.gradienteZero_pct} % (k=6)`);
  console.log(`          declividade p10:      ${cc.corrigido.declividade_pct.p10} %  vs  ${cc.kVizinhos.declividade_pct.p10} % (k=6)`);
  console.log(`  REDE    trechos: ${registro.rede.corrigido.trechos} vs ${registro.rede.kVizinhos.trechos} · ${registro.rede.corrigido.comprimento_m} m vs ${registro.rede.kVizinhos.comprimento_m} m`);
  console.log(`  RAMPA ao longo    máx ${rr.corrigido.aoLongo.maxima_pct} % vs ${rr.kVizinhos.aoLongo.maxima_pct} % · acima de 10 %: ${rr.corrigido.aoLongo.acimaDe10_pct} % vs ${rr.kVizinhos.aoLongo.acimaDe10_pct} %`);
  console.log(`  RAMPA cruzamento  máx ${rr.corrigido.cruzamento.maxima_pct} % vs ${rr.kVizinhos.cruzamento.maxima_pct} % · acima de 10 %: ${rr.corrigido.cruzamento.acimaDe10_pct} % vs ${rr.kVizinhos.cruzamento.acimaDe10_pct} %`);
  console.log(`  RAMPA todas       mediana ${rr.corrigido.todas.mediana_pct} % vs ${rr.kVizinhos.todas.mediana_pct} % · p99 ${rr.corrigido.todas.p99_pct} % vs ${rr.kVizinhos.todas.p99_pct} %`);
  console.log(`  GRADE   comprimento na direção dominante ±5°: ${(registro.grade.corrigido.fracaoNaGrade * 100).toFixed(1)} %  vs  ${(registro.grade.kVizinhos.fracaoNaGrade * 100).toFixed(1)} % (k=6)`);
}

// ═══════════════════════════════════════════════ PARTE B · as fixtures

console.log("\n═══════════ PARTE B · as glebas-padrão do Generate, com relevo ═══════════");

const parteB: Record<string, unknown>[] = [];

for (const id of ["ensaio-47ha", "geo-antonina"]) {
  const base: EntradaMinima = JSON.parse(
    readFileSync(join(GLEBAS_DO_GENERATE, `${id}.entrada.json`), "utf8"),
  );
  const antes = base.relevo?.curvas?.length ?? 0;
  const f = comRelevo(base);

  writeFileSync(
    join(FIXTURES, `${id}.entrada.json`),
    `${JSON.stringify(f.entrada, null, 1)}\n`,
    "utf8",
  );

  // A PROVA: o Symbios passa a rodar. Antes ele recusava.
  const { terreno } = glebaParaOSymbios(f.entrada);
  const t = terreno as Terreno;
  const r = gerarRedeViaria(motor, t, { passoGrade_m: PASSO_GRADE_M }, SEMENTE);
  const corte = recortarPelaGleba(r, t);
  const g = grausDe(corte.vias);

  const registro = {
    prompt: "LAB-03",
    parte: "B",
    gleba: id,
    fonte: "poligonal, restrições e parâmetros do Generate; relevo SINTÉTICO declarado",
    superficie: "ondulado(0, 20, raioEquivalente/3) — gerador do LAB-01",
    area_m2: n2(base.gleba.area_m2),
    curvasAntes: antes,
    curvas: f.curvas,
    verticesCotados: f.verticesCotados,
    equidistancia_m: EQUIDISTANCIA_M,
    desnivelPedido_m: DESNIVEL_M,
    desnivelObtido_m: n2(f.desnivelObtido_m),
    escalaDoRelevo_m: n2(f.escala_m),
    motorRoda: true,
    rede: {
      trechosAntesDoCorte: corte.viasAntes,
      trechos: corte.viasDepois,
      comprimento_m: n2(corte.comprimentoDepois_m),
      foraDaGleba_pct: pc(corte.comprimentoForaDaGlebaDepois_m, corte.comprimentoDepois_m),
      quadras: corte.quadrasDepois,
      conectividade: corte.conectividade,
    },
    rampa: rampas(corte.vias, g),
  };
  parteB.push(registro);

  console.log(`\n─── ${id} · ${(base.gleba.area_m2 / 1e4).toFixed(1)} ha`);
  console.log(`  curvas: ${antes} → ${f.curvas} (${f.verticesCotados} vértices cotados, ${EQUIDISTANCIA_M} em ${EQUIDISTANCIA_M} m)`);
  console.log(`  desnível obtido: ${n2(f.desnivelObtido_m)} m · escala ${n2(f.escala_m)} m`);
  console.log(`  O MOTOR RODA: ${registro.rede.trechos} trechos, ${registro.rede.comprimento_m} m, ${registro.rede.quadras} quadras`);
  console.log(`  fora da gleba depois do corte: ${registro.rede.foraDaGleba_pct} %`);
  console.log(`  rampa cruzamento máx ${registro.rampa.cruzamento.maxima_pct} % · ao longo máx ${registro.rampa.aoLongo.maxima_pct} %`);
}

writeFileSync(
  join(SAIDA, "medicoes.json"),
  `${JSON.stringify({ prompt: "LAB-03", geradoEm: CARIMBO, semente: SEMENTE, parteA, parteB }, null, 2)}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-03/medicoes.json`);
console.log(`docs/fixtures/glebas-padrao-com-relevo/`);
