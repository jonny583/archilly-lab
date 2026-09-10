/**
 * O adaptador: `gerarRedeViaria(terreno, parametros, seed)`.
 *
 * Uma função, tipada, que fecha a cadeia do LAB-01:
 *
 * ```text
 * terreno do Archilly (graus)
 *   → plano local em metros        (geo.ts)
 *   → mapa de alturas              (alturas.ts)
 *   → parâmetros do motor          (parametros.ts)
 *   → vias + quadras               (motor.ts → WebAssembly → symbios-tensor)
 *   → plano local em metros, com hierarquia e rampa
 *   → GeoJSON em WGS84             (geojson.ts)
 * ```
 *
 * # O que este adaptador NÃO faz, de propósito
 *
 * - **Não recorta pela gleba.** Mede quanto ficou fora e registra; o recorte é o
 *   LAB-02. Recortar aqui misturaria duas perguntas: "o motor devolve geometria
 *   utilizável?" e "o recorte funciona?".
 * - **Não aplica restrições.** APP, faixa não edificável e hidrografia viajam
 *   como carga e aparecem no diagnóstico. O motor não sabe o que são, e não deve.
 * - **Não parcela em lotes.** O LAB-00 estabeleceu que `BuildingLot` é pegada de
 *   edificação e que as parcelas são calculadas e descartadas pelo motor. Lote é
 *   do Archilly.
 * - **Não valida nem julga.** Validator é LAB-02, Judge é LAB-03.
 */
import {
  PARAMETROS_PADRAO,
  VERSAO_ADAPTADOR,
  type Diagnostico,
  type Parametros,
  type Ponto,
  type Quadra,
  type Resultado,
  type Terreno,
  type Via,
} from "./contrato.ts";
import { montarAlturas, paraArchilly, type MapaDeAlturas } from "./alturas.ts";
import {
  antiHorario,
  areaComSinal,
  areaPoligono,
  comprimento,
  dentroDoPoligono,
  perimetro,
} from "./geo.ts";
import { Motor, type RespostaMotor } from "./motor.ts";
import { resolverParametros, traduzirParaMotor } from "./parametros.ts";
import { sha256 } from "./hash.ts";

export * from "./contrato.ts";
export { Motor, Sessao } from "./motor.ts";
export { montarAlturas, cotaEm, paraArchilly, paraMotor } from "./alturas.ts";
export { calcularOrigem, projetar, reverter, areaPoligono, dentroDoPoligono } from "./geo.ts";
export { lerTerrenoGeo } from "./terreno-geo.ts";
export { paraGeoJSON } from "./geojson.ts";
export { resolverParametros } from "./parametros.ts";

/**
 * Tolerância da conferência de rampa, em pontos percentuais.
 *
 * Ver a doc de `Diagnostico.trechosAcimaDaRampa`: o clamp do motor pousa os
 * trechos exatamente sobre o limite pedido, e metade deles fica alguns
 * centésimos acima por aritmética de `f32`. Meio ponto percentual separa esse
 * ruído das violações reais, que no LAB-01 foram medidas em 50 % a 174 % e
 * estão todas em cruzamento (nó de grau 3 ou mais), onde o clamp por cadeia do
 * motor não chega.
 */
const TOLERANCIA_RAMPA_PP = 0.5;

/** Um cronômetro de parede, em milissegundos. */
const agora = (): number =>
  typeof performance !== "undefined" ? performance.now() : Number(process.hrtime.bigint()) / 1e6;

/**
 * Gera a rede viária (e, opcionalmente, as quadras) para um terreno do Archilly.
 *
 * @param motor instância já carregada — carregar o `.wasm` custa caro e não
 *   depende do terreno, então quem chama reaproveita entre execuções.
 * @param seed a mesma seed com o mesmo terreno e os mesmos parâmetros produz a
 *   mesma saída, byte a byte. O hash está no diagnóstico.
 */
export function gerarRedeViaria(
  motor: Motor,
  terreno: Terreno,
  parametros: Parametros = {},
  seed = 42,
): Resultado {
  const t0 = agora();
  const p = resolverParametros(parametros);
  const avisos: string[] = [];

  // ------------------------------------------------------- estágio: alturas
  const tAlturas = agora();
  const mapa = montarAlturas(terreno, p.passoGrade_m);
  const alturas_ms = agora() - tAlturas;

  const areaGleba = areaPoligono(terreno.gleba);
  conferirEscala(areaGleba, p, avisos);
  if (terreno.areaDeclarada_m2 != null) {
    const erro = Math.abs(areaGleba - terreno.areaDeclarada_m2) / terreno.areaDeclarada_m2;
    if (erro > 0.02) {
      avisos.push(
        `a área do polígono projetado (${areaGleba.toFixed(0)} m²) difere ` +
          `${(erro * 100).toFixed(1)} % da declarada pelo Geo ` +
          `(${terreno.areaDeclarada_m2.toFixed(0)} m²) — geometria é a verdade, a ` +
          "declaração é conferência",
      );
    }
  }
  if (mapa.cotaMax - mapa.cotaMin < 1) {
    avisos.push(
      `desnível de ${(mapa.cotaMax - mapa.cotaMin).toFixed(2)} m em toda a gleba: ` +
        "o motor vai cair no regime de grade ortogonal (campo tensorial sem gradiente)",
    );
  }

  const pedido = traduzirParaMotor(p, mapa, seed);

  // --------------------------------------------- estágios do motor, cronados
  let resposta: RespostaMotor;
  let vias_ms = 0;
  let racionalizacao_ms = 0;
  let quadras_ms = 0;

  try {
    resposta = motor.comSessao(pedido, mapa.alturas, (s) => {
      const t1 = agora();
      s.gerarVias();
      vias_ms = agora() - t1;

      const t2 = agora();
      s.racionalizar();
      racionalizacao_ms = agora() - t2;

      if (p.extrairQuadras) {
        const t3 = agora();
        s.extrairQuadras();
        quadras_ms = agora() - t3;
      }
      return s.resultado();
    });
  } catch (e) {
    throw new Error(
      `o motor falhou no terreno "${terreno.nome}" ` +
        `(grade ${mapa.nx}×${mapa.ny}, mundo ${(mapa.nx * mapa.celula_m).toFixed(0)}×` +
        `${(mapa.ny * mapa.celula_m).toFixed(0)} m): ${e instanceof Error ? e.message : e}`,
      { cause: e },
    );
  }
  if (!resposta.ok) {
    throw new Error(`o motor devolveu erro: ${resposta.erro ?? "sem detalhe"}`);
  }

  // --------------------------------------------- estágio: tradução de volta
  const tVolta = agora();
  const vias = montarVias(resposta, mapa, terreno, p);
  const quadras = montarQuadras(resposta, mapa, terreno);
  const traducaoDeVolta_ms = agora() - tVolta;

  const comprimentoTotal = vias.reduce((s, v) => s + v.comprimento_m, 0);
  const foraDeVias = vias.reduce((s, v) => s + v.comprimentoForaDaGleba_m, 0);
  const areaQuadras = quadras.reduce((s, q) => s + q.area_m2, 0);
  const areaQuadrasDentro = quadras.reduce((s, q) => s + q.area_m2 * q.fracaoDentroDaGleba, 0);
  const limite = p.rampaMaxima_pct + TOLERANCIA_RAMPA_PP;
  const acimaDaRampa = vias.filter((v) => v.rampaMaxima_pct > limite).length;
  const rampaMaximaObtida = vias.reduce((m, v) => Math.max(m, v.rampaMaxima_pct), 0);

  if (acimaDaRampa > 0) {
    avisos.push(
      `${acimaDaRampa} de ${vias.length} trecho(s) acima da rampa pedida de ` +
        `${p.rampaMaxima_pct} % (máxima obtida ${rampaMaximaObtida.toFixed(1)} %). ` +
        "O clamp do motor é por cadeia e não cobre os cruzamentos — a conferência " +
        "de rampa é do Validator, não do motor. Ver docs/relatorios/LAB01_ADAPTADOR.md",
    );
  }

  const diagnostico: Diagnostico = {
    terreno: terreno.nome,
    procedencia: terreno.procedencia,
    versaoMotor: resposta.versao_motor,
    versaoAdaptador: VERSAO_ADAPTADOR,
    seed,
    parametros: p,
    grade: {
      nx: mapa.nx,
      ny: mapa.ny,
      celula_m: mapa.celula_m,
      mundo_m: [mapa.nx * mapa.celula_m, mapa.ny * mapa.celula_m],
    },
    fracaoGradeForaDaGleba: mapa.fracaoFora,
    areaGleba_m2: areaGleba,
    areaDeclarada_m2: terreno.areaDeclarada_m2,
    cotas_m: { min: mapa.cotaMin, max: mapa.cotaMax },
    estagios: resposta.estagios,
    tempos: {
      alturas_ms,
      vias_ms,
      racionalizacao_ms,
      quadras_ms,
      traducaoDeVolta_ms,
      total_ms: agora() - t0,
    },
    hash: "",
    restricoes: terreno.restricoes.map((r) => ({
      id: r.id,
      nome: r.nome,
      categoria: r.categoria,
      desconta: r.desconta,
    })),
    comprimentoTotalVias_m: comprimentoTotal,
    trechosAcimaDaRampa: acimaDaRampa,
    rampaMaximaObtida_pct: rampaMaximaObtida,
    fracaoViasForaDaGleba: comprimentoTotal > 0 ? foraDeVias / comprimentoTotal : 0,
    fracaoQuadrasForaDaGleba: areaQuadras > 0 ? 1 - areaQuadrasDentro / areaQuadras : 0,
    avisos,
  };

  // O hash é da GEOMETRIA, não do diagnóstico: tempo de parede muda a cada
  // execução e envenenaria a prova de determinismo.
  diagnostico.hash = hashDaGeometria(vias, quadras);

  return { vias, quadras, diagnostico };
}

/**
 * Avisa quando o espaçamento pedido não cabe na gleba.
 *
 * Uma gleba de 450 m² com via local a cada 80 m não produz rede nenhuma, e o
 * silêncio seria pior que o aviso: quem lê "0 vias" precisa saber que o problema
 * é de escala, não do motor.
 */
function conferirEscala(areaGleba_m2: number, p: { espacamentoLocal_m: number }, avisos: string[]) {
  const ladoEquivalente = Math.sqrt(areaGleba_m2);
  if (ladoEquivalente < p.espacamentoLocal_m * 2) {
    avisos.push(
      `a gleba tem ~${ladoEquivalente.toFixed(0)} m de lado equivalente e o espaçamento ` +
        `local pedido é ${p.espacamentoLocal_m} m: não cabem duas quadras, e a rede vai ` +
        "sair pobre ou vazia — é limitação de escala, não do motor",
    );
  }
}

/**
 * Grafo do motor → trechos de via no plano local do Archilly.
 *
 * # Por que virar cadeias, e não uma via por aresta
 *
 * O motor devolve um grafo de arestas curtas: o traçado é integrado em passos de
 * poucos metros, então uma avenida de 300 m chega como dezenas de arestas. Uma
 * via por aresta daria "1 200 vias de 4 m cada" — número que não descreve nada e
 * que o Judge não sabe comparar.
 *
 * A conversão junta arestas em **cadeias**: caminha o grafo enquanto o nó tem
 * grau 2 e o tipo não muda, e corta em cruzamento ou troca de hierarquia. O que
 * sai é "uma avenida, 312 m, rampa média 4,2 %", que é a unidade em que o
 * urbanismo pensa e em que o `TrechoViario` do Generate é escrito.
 */
function montarVias(
  r: RespostaMotor,
  mapa: MapaDeAlturas,
  terreno: Terreno,
  p: { faixaDominio_m: number },
): Via[] {
  const total = r.nos.length;
  const incidentes: number[][] = Array.from({ length: total }, () => []);
  r.arestas.forEach(([a, b], i) => {
    incidentes[a]!.push(i);
    incidentes[b]!.push(i);
  });

  // Grau contado por TIPO: um nó onde a principal cruza a local tem grau 2 em
  // cada tipo, e encadear através dele produziria uma via que troca de
  // hierarquia no meio.
  const grauDoTipo = (no: number, tipo: number) =>
    incidentes[no]!.filter((e) => r.arestas[e]![2] === tipo).length;

  const usada = new Uint8Array(r.arestas.length);
  const vias: Via[] = [];

  const oposto = (e: number, no: number) => {
    const [a, b] = r.arestas[e]!;
    return a === no ? b : a;
  };

  /** Caminha de `no` para fora por `aresta`, acumulando nós na cadeia. */
  const seguir = (noInicial: number, arestaInicial: number, tipo: number): number[] => {
    const cadeia = [noInicial];
    let no = noInicial;
    let e = arestaInicial;
    for (;;) {
      usada[e] = 1;
      no = oposto(e, no);
      cadeia.push(no);
      if (grauDoTipo(no, tipo) !== 2) break;
      const proxima = incidentes[no]!.find((x) => r.arestas[x]![2] === tipo && !usada[x]);
      if (proxima === undefined) break;
      e = proxima;
    }
    return cadeia;
  };

  // Primeiro as cadeias que começam em ponta ou cruzamento — essas têm começo e
  // fim bem definidos.
  for (let e = 0; e < r.arestas.length; e++) {
    if (usada[e]) continue;
    const [a, b, tipo] = r.arestas[e]!;
    for (const no of [a, b]) {
      if (usada[e]) break;
      if (grauDoTipo(no, tipo) !== 2) vias.push(montarVia(seguir(no, e, tipo), vias.length));
    }
  }
  // O que restou são ciclos fechados — anel viário, volta de quadra. Começa em
  // qualquer nó; não há ponta.
  for (let e = 0; e < r.arestas.length; e++) {
    if (usada[e]) continue;
    const [a, , tipo] = r.arestas[e]!;
    vias.push(montarVia(seguir(a, e, tipo), vias.length));
  }

  function montarVia(cadeia: number[], indice: number): Via {
    const pontos: Ponto[] = [];
    const cotas: number[] = [];
    for (const n of cadeia) {
      const [x, z, cota] = r.nos[n]!;
      pontos.push(paraArchilly(mapa, x, z));
      cotas.push(cota);
    }
    const comp = comprimento(pontos);

    // Rampa: a razão entre desnível e distância de cada segmento, em porcento. É
    // a mesma definição de declividade que o Generate e a lei usam, e é por isso
    // que o número é comparável com a faixa que o Geo mediu no mesmo lugar.
    let rampaMax = 0;
    for (let i = 1; i < pontos.length; i++) {
      const d = Math.hypot(pontos[i]!.x - pontos[i - 1]!.x, pontos[i]!.y - pontos[i - 1]!.y);
      if (d < 1e-6) continue;
      const r2 = (Math.abs(cotas[i]! - cotas[i - 1]!) / d) * 100;
      if (r2 > rampaMax) rampaMax = r2;
    }
    const desnivel = Math.abs((cotas.at(-1) ?? 0) - (cotas[0] ?? 0));
    const rampaMedia = comp > 1e-6 ? (desnivel / comp) * 100 : 0;

    return {
      id: `via-${indice}`,
      tipo: tipoDaCadeia(cadeia) === 0 ? "principal" : "local",
      pontos,
      cotas_m: cotas,
      comprimento_m: comp,
      rampaMedia_pct: rampaMedia,
      rampaMaxima_pct: rampaMax,
      faixaDominio_m: p.faixaDominio_m,
      saiDaGleba: pontos.some((q) => !dentroDoPoligono(q, terreno.gleba)),
      comprimentoForaDaGleba_m: comprimentoFora(pontos, terreno),
    };
  }

  /** O tipo da cadeia é o tipo da primeira aresta que liga os dois nós dela. */
  function tipoDaCadeia(cadeia: number[]): number {
    if (cadeia.length < 2) return 1;
    const [a, b] = [cadeia[0]!, cadeia[1]!];
    const e = r.arestas.findIndex(
      ([x, y]) => (x === a && y === b) || (x === b && y === a),
    );
    return e >= 0 ? r.arestas[e]![2] : 1;
  }

  return vias.filter((v) => v.pontos.length >= 2 && v.comprimento_m > 1e-6);
}

/** Quadras do motor → polígonos no plano local, com área e fração dentro. */
function montarQuadras(r: RespostaMotor, mapa: MapaDeAlturas, terreno: Terreno): Quadra[] {
  const out: Quadra[] = [];
  for (const [i, perim] of r.quadras.entries()) {
    if (perim.length < 3) continue;
    const pontos = perim.map((n) => {
      const [x, z] = r.nos[n]!;
      return paraArchilly(mapa, x, z);
    });
    const area = Math.abs(areaComSinal(pontos));
    if (area < 1e-6) continue;

    out.push({
      id: `quadra-${i}`,
      // GeoJSON pede anel externo anti-horário; o motor devolve horário.
      pontos: antiHorario(pontos),
      area_m2: area,
      perimetro_m: perimetro(pontos),
      fracaoDentroDaGleba: fracaoDentro(pontos, terreno),
    });
  }
  return out;
}

/**
 * Quantos metros de uma polilinha caem fora da gleba.
 *
 * Cada segmento é amostrado a passo fixo e cada amostra responde por sua fatia do
 * comprimento. Amostragem, e não recorte geométrico, pela mesma razão de
 * `fracaoDentro`: o número aqui é estatística para o relatório — "quanto o LAB-02
 * vai ter de recortar" —, e meia-interseção agora criaria duas respostas para a
 * mesma pergunta.
 */
function comprimentoFora(pontos: Ponto[], terreno: Terreno): number {
  // Um passo de 2 m: mais fino que isso não muda a estatística e custa tempo num
  // terreno com dezenas de milhares de metros de via.
  const PASSO = 2;
  let fora = 0;
  for (let i = 1; i < pontos.length; i++) {
    const a = pontos[i - 1]!;
    const b = pontos[i]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d < 1e-9) continue;
    const n = Math.max(1, Math.ceil(d / PASSO));
    const fatia = d / n;
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const q = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      if (!dentroDoPoligono(q, terreno.gleba)) fora += fatia;
    }
  }
  return fora;
}

/**
 * Quanto de um polígono cai dentro da gleba, por amostragem.
 *
 * Amostragem, e não interseção geométrica, porque o número aqui é **estatística
 * para o relatório**: "quanto vai ser recortado no LAB-02". A interseção de
 * verdade é o trabalho do LAB-02, e fazer meia-interseção agora só criaria duas
 * respostas para a mesma pergunta.
 */
function fracaoDentro(pontos: Ponto[], terreno: Terreno): number {
  const AMOSTRAS = 8;
  let dentro = 0;
  let total = 0;
  const c = pontos.reduce((s, q) => ({ x: s.x + q.x / pontos.length, y: s.y + q.y / pontos.length }), {
    x: 0,
    y: 0,
  });
  for (const p of pontos) {
    for (let k = 0; k < AMOSTRAS; k++) {
      const t = (k + 0.5) / AMOSTRAS;
      const q = { x: c.x + (p.x - c.x) * t, y: c.y + (p.y - c.y) * t };
      total++;
      if (dentroDoPoligono(q, terreno.gleba)) dentro++;
    }
  }
  return total > 0 ? dentro / total : 0;
}

/**
 * Hash da geometria devolvida — a prova de determinismo.
 *
 * As coordenadas entram com **seis casas** (precisão de micrômetro, muito além do
 * que qualquer levantamento tem) em vez de cruas: `f32` → `f64` → texto pode
 * variar no último bit entre plataformas sem que a geometria tenha mudado, e um
 * hash que acusa diferença onde não há é um hash que ninguém confia.
 */
function hashDaGeometria(vias: Via[], quadras: Quadra[]): string {
  const n = (v: number) => v.toFixed(6);
  const partes: string[] = [];
  for (const v of vias) {
    partes.push(
      `V|${v.tipo}|${v.pontos.map((p) => `${n(p.x)},${n(p.y)}`).join(";")}|` +
        v.cotas_m.map(n).join(";"),
    );
  }
  for (const q of quadras) {
    partes.push(`Q|${q.pontos.map((p) => `${n(p.x)},${n(p.y)}`).join(";")}`);
  }
  return sha256(partes.join("\n"));
}

export { PARAMETROS_PADRAO };
