/**
 * VOLTA — o `Plano` do motor do Testfit vira a SAÍDA do contrato de motor v1.
 *
 * ```text
 * Plano { vias, quadras, lotes, areas, bolsoes, metricas }  →  archilly-motor-saida
 * ```
 *
 * # A regra que governa este arquivo
 *
 * **Não inventar dado.** O que o motor não devolve sai `null` e vira perda
 * registrada. A tentação é grande — o contrato tem campos que um plano bonito
 * preencheria com um palpite plausível — e o contrato antecipa a tentação onde
 * ela é mais cara: sobre `faceDeRua`, ele manda *"prefira `null` a chutar: um
 * `faceDeRua` mentiroso é pior que um incompleto, e o Validator mede a frente
 * por conta própria de qualquer forma"*. Aqui isso vale para tudo.
 *
 * # As quatro traduções que decidem o resultado
 *
 * 1. **A largura da via — e a calçada que não existe.** O contrato quer
 *    `largura_m` = caixa total (pista + calçadas), e é ela que o Generate usa
 *    para desenhar o leito e decidir se um lote tem frente. O motor guarda dois
 *    campos: `caixa_m` ("largura total da via, de meio-fio a meio-fio", diz a
 *    ajuda dele) e `calcada_m` ("largura da calçada em cada lado"). A soma
 *    parecia óbvia — e está errada.
 *
 *    **Medido:** a distância do vértice mais próximo de cada lote ao eixo mais
 *    próximo é **exatamente `caixa_m / 2`** (mediana 5,00 m para vias de
 *    `caixa_m = 10`; 223 dos 441 lotes no valor exato). Ou seja: o motor encosta
 *    o lote no meio-fio. **A calçada declarada não é reservada em lugar
 *    nenhum da geometria.**
 *
 *    Então `largura_m = caixa_m`, porque é o corredor que de fato existe.
 *    Declarar `caixa_m + 2 × calcada_m` foi a primeira versão deste arquivo, e o
 *    Validator devolveu o retrato do erro: **441 de 441 lotes sem frente e 429
 *    com leito de rua por cima**, porque o leito declarado invadia 3 m dentro de
 *    cada lote. O adaptador não pode declarar a calçada que o motor promete e
 *    não desenha — isso é item para o T02, e está no relatório.
 * 2. **`Lote.quadra` é índice 1-based em `plano.quadras`.** As duas listas
 *    percorrem `ordenadas` filtrando `usadas` na mesma ordem (ver `motor.ts`,
 *    laços em 412 e 443). `quadra: 0` significa lote sem quadra — travado ou
 *    externo —, e o contrato aceita `quadraId` vazio para esse caso.
 * 3. **Os bolsões viram `retorno`, não via.** É o que o contrato manda, e a
 *    razão dele é boa: no Generate o bulbo é superfície de FRENTE, a testada em
 *    arco é legal, e tratá-lo como leito reprovaria justamente o lote bem-feito.
 * 4. **`areaViaria_m2` do motor é residual.** Ele calcula
 *    `bruta − quadras − especiais`, não a área dos corredores. Num plano que não
 *    preenche a gleba, o "viário" engorda com terra que não é rua. O número
 *    atravessa como está — corrigi-lo aqui seria o adaptador inventando uma
 *    medição que o motor não fez — e a distorção vai medida no relatório.
 */
import { area } from "@testfit/geo.ts";
import type { Plano } from "@testfit/tipos.ts";
import type { AreaEspecial } from "@testfit/tipos.ts";

import {
  CONTRATO,
  type AreaEspecialV1,
  type EntradaV1,
  type LoteV1,
  type Perda,
  type PontoV1,
  type QuadraV1,
  type SaidaV1,
  type ViaV1,
} from "./contrato-v1.ts";

export interface ResultadoVolta {
  saida: SaidaV1;
  perdas: Perda[];
}

/**
 * De que tipo do contrato é cada área do motor.
 *
 * `null` marca o que **não tem para onde ir**. O contrato tem seis tipos
 * (`lazer`, `doacao`, `verde`, `app`, `institucional`, `retorno`) e o motor tem
 * oito, e os dois vocabulários não se sobrepõem nas pontas:
 *
 * - `comercio` são lotes comerciais — terra **privada**, que se vende. Não é
 *   área especial nenhuma das seis; declarar como `institucional` (a única que
 *   sobra) diria ao Generate que aquilo é doação ao município, o oposto do que é.
 * - `estacionamento` é "estacionamento e portaria" de condomínio: é área comum
 *   privada, e `institucional` diria a mesma mentira.
 *
 * Ambas saem como perda e a terra delas é absorvida em `areaNaoAproveitada_m2`,
 * que é honesto: o contrato não sabe o que ela é.
 */
const TIPO_DA_AREA: Record<AreaEspecial["tipo"], AreaEspecialV1["tipo"] | null> = {
  lazer: "lazer",
  doacao: "doacao",
  app: "app",
  appRio: "app",
  lago: "verde",
  arborizacao: "verde",
  comercio: null,
  estacionamento: null,
};

/** Quantos lados aproximam o bulbo circular do cul-de-sac. */
const LADOS_DO_BOLSAO = 24;

const pt = (p: { x: number; y: number }): PontoV1 => ({ x: p.x, y: p.y });

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(b.x - a.x, b.y - a.y);

/**
 * Escreve a SAÍDA do contrato a partir de um `Plano` do motor.
 *
 * @param entrada a ENTRADA que gerou o plano — dela vêm o CRS, os ids do projeto
 *   e da gleba, e os parâmetros que serão comparados com os aplicados.
 * @param semente a semente da rodada, para poder repetir.
 */
export function voltaParaOContrato(
  plano: Plano,
  entrada: EntradaV1,
  opcoes: { semente: number; versaoMotor: string; geradoEm?: string },
): ResultadoVolta {
  const perdas: Perda[] = [];

  // ------------------------------------------------------------------- vias
  const vias: ViaV1[] = plano.vias.map((v, i) => ({
    id: `V${i + 1}`,
    hierarquia: v.classe === "principal" ? "principal" : "secundaria",
    pontos: [pt(v.eixo[0]), pt(v.eixo[1])],
    // O corredor que EXISTE, medido: o lote encosta a `caixa_m / 2` do eixo.
    // Ver o cabeçalho — a calçada é declarada e não é reservada.
    largura_m: v.caixa_m,
    // O motor não calcula greide. `null` é a resposta honesta, e o contrato a
    // admite explicitamente ("pode ser null quando você não mediu").
    rampaMedia_pct: null,
  }));
  const calcadaDeclarada = plano.vias.reduce((s, v) => s + v.calcada_m * 2 * dist(v.eixo[0], v.eixo[1]), 0);
  if (calcadaDeclarada > 0) {
    perdas.push({
      campo: "vias[].calcada_m",
      oQueHavia: `calçadas declaradas que somam ${calcadaDeclarada.toFixed(0)} m² de terra`,
      motivo:
        "o motor declara `calcada_m` por via mas NÃO a reserva na geometria: medido, o vértice " +
        "mais próximo de cada lote fica a exatamente `caixa_m / 2` do eixo — o lote encosta no " +
        "meio-fio. `largura_m` sai como `caixa_m`, que é o corredor que existe. Declarar a " +
        "calçada prometida faria o leito invadir o lote e o Validator reprovaria lote bem-feito",
      gravidade: "alta",
    });
  }
  if (plano.vias.length > 0) {
    perdas.push({
      campo: "vias[].rampaMedia_pct",
      oQueHavia: `${plano.vias.length} via(s) sem cota`,
      motivo:
        "o motor não calcula greide — nenhuma via tem elevação em lugar nenhum do `Plano`. " +
        "Sai `null`, como o contrato permite, e toda a conferência de rampa fica com o Validator",
      gravidade: "alta",
    });
  }

  // ---------------------------------------------------------------- quadras
  const quadras: QuadraV1[] = plano.quadras.map((q, i) => ({
    id: `Q${i + 1}`,
    pontos: q.map(pt),
    area_m2: area(q),
  }));

  // ------------------------------------------------------------------ lotes
  //
  // `Lote.quadra` é 1-based em `plano.quadras`; 0 é lote sem quadra. Um índice
  // fora da lista não pode virar `Q<n>` — o contrato recusa lote apontando para
  // quadra inexistente, e com razão.
  const lotes: LoteV1[] = plano.lotes.map((l, i) => {
    const dentroDaLista = l.quadra >= 1 && l.quadra <= quadras.length;
    return {
      id: l.id || `L${i + 1}`,
      quadraId: dentroDaLista ? quadras[l.quadra - 1]!.id : "",
      pontos: l.poligono.map(pt),
      area_m2: l.area_m2,
      testada_m: l.testada_m,
      // O motor sabe a testada mas não guarda de QUAL via ela é frente. O
      // contrato manda preferir `null` a chutar.
      faceDeRua: null,
    };
  });
  const semQuadra = plano.lotes.filter((l) => l.quadra === 0).length;
  if (semQuadra > 0) {
    perdas.push({
      campo: "lotes[].quadraId",
      oQueHavia: `${semQuadra} lote(s) sem quadra (travados ou externos)`,
      motivo:
        "o motor marca `quadra: 0` para lote travado e para lote externo (virado à rua " +
        "existente). O contrato aceita `quadraId` vazio, então a informação não se perde — " +
        "mas a razão de estar sem quadra, sim",
      gravidade: "baixa",
    });
  }
  if (lotes.length > 0) {
    perdas.push({
      campo: "lotes[].faceDeRua",
      oQueHavia: `${lotes.length} lote(s)`,
      motivo:
        "o motor guarda a testada em metros mas não a via de frente; sai `null`, como o " +
        "contrato prefere. O Validator mede a frente por conta própria",
      gravidade: "baixa",
    });
  }
  const externos = plano.lotes.filter((l) => l.externo).length;
  if (externos > 0) {
    perdas.push({
      campo: "lotes[].externo",
      oQueHavia: `${externos} lote(s) externos (frente para rua existente)`,
      motivo:
        "a distinção loteamento × condomínio não existe no contrato; o lote externo vira lote " +
        "comum. O Generate não vai saber que aquela frente é para via pública de fora da gleba",
      gravidade: "media",
    });
  }

  // -------------------------------------------------------- áreas especiais
  const areasEspeciais: AreaEspecialV1[] = [];
  const semDestino = new Map<string, number>();

  plano.areas.forEach((a, i) => {
    const tipo = TIPO_DA_AREA[a.tipo];
    if (!tipo) {
      semDestino.set(a.tipo, (semDestino.get(a.tipo) ?? 0) + a.area_m2);
      return;
    }
    areasEspeciais.push({
      id: `AE${i + 1}`,
      tipo,
      pontos: a.poligono.map(pt),
      area_m2: a.area_m2,
    });
  });
  for (const [tipo, m2] of semDestino) {
    perdas.push({
      campo: `areas[] tipo "${tipo}"`,
      oQueHavia: `${m2.toFixed(0)} m²`,
      motivo:
        `o contrato tem seis tipos de área especial e "${tipo}" não é nenhum deles — é terra ` +
        "privada, e declará-la como `institucional` (a única que sobraria) diria ao Generate " +
        "que é doação ao município. A área foi absorvida em `areaNaoAproveitada_m2`",
      gravidade: "media",
    });
  }

  // Os bolsões de cul-de-sac, como `retorno`.
  plano.bolsoes.forEach((b, i) => {
    const pontos: PontoV1[] = [];
    for (let k = 0; k < LADOS_DO_BOLSAO; k++) {
      const t = (k / LADOS_DO_BOLSAO) * Math.PI * 2;
      pontos.push({ x: b.centro.x + Math.cos(t) * b.raio, y: b.centro.y + Math.sin(t) * b.raio });
    }
    areasEspeciais.push({
      id: `AR${i + 1}`,
      tipo: "retorno",
      pontos,
      area_m2: Math.PI * b.raio * b.raio,
    });
  });
  if (plano.bolsoes.length > 0) {
    perdas.push({
      campo: "bolsoes[]",
      oQueHavia: `${plano.bolsoes.length} bulbo(s) de retorno, como círculo {centro, raio}`,
      motivo:
        `o contrato quer polígono; cada círculo virou um ${LADOS_DO_BOLSAO}-ágono. A área do ` +
        "polígono é ~0,3 % menor que a do círculo, e é a do círculo que foi declarada",
      gravidade: "baixa",
    });
  }

  // --------------------------------------------------------- quadro de áreas
  //
  // Fecha por construção: o motor define `areaViaria = bruta − quadras −
  // especiais`, então bruta = privativa + sobra-das-quadras + especiais +
  // viária. O que sobra depois de tirar privativa, viária, lazer e APP é
  // exatamente a sobra dentro das quadras mais as áreas especiais que não têm
  // linha própria (doação, verde, comércio, estacionamento).
  const m = plano.metricas;
  const somaDe = (tipos: AreaEspecial["tipo"][]) =>
    plano.areas.filter((a) => tipos.includes(a.tipo)).reduce((s, a) => s + a.area_m2, 0);
  const areaLazer = somaDe(["lazer"]);
  const areaAPP = somaDe(["app", "appRio"]);
  const naoAproveitada = Math.max(
    0,
    m.areaBruta_m2 - m.areaPrivativa_m2 - m.areaViaria_m2 - areaLazer - areaAPP,
  );

  perdas.push({
    campo: "quadroDeAreas.areaViaria_m2",
    oQueHavia: `${m.areaViaria_m2.toFixed(0)} m²`,
    motivo:
      "o motor não mede a área dos corredores: ele calcula `bruta − quadras − especiais`. " +
      "Num plano que não preenche a gleba, este número engorda com terra que não é rua. " +
      "Atravessou como está — corrigi-lo aqui seria inventar uma medição que o motor não fez",
    gravidade: "media",
  });

  // ------------------------------------------------------- o que mais se perde
  if (plano.nota != null) {
    perdas.push({
      campo: "plano.nota / plano.notas",
      oQueHavia: `nota ${plano.nota.toFixed(3)} e ${Object.keys(plano.notas ?? {}).length} nota(s) por critério`,
      motivo:
        "a nota do próprio motor não tem campo no contrato, e isso é de propósito: quem julga " +
        "é o Judge do Generate. Fica fora, e o relatório do LAB-07 põe as duas lado a lado",
      gravidade: "baixa",
    });
  }
  if (plano.avisos?.length) {
    perdas.push({
      campo: "plano.avisos",
      oQueHavia: plano.avisos.join(" | "),
      motivo: "o contrato não tem canal para aviso do motor; os avisos ficam no relatório do Lab",
      gravidade: "media",
    });
  }
  perdas.push({
    campo: "plano.formato",
    oQueHavia: plano.formato,
    motivo:
      "o partido de traçado (ortogonal, espinha, radial…) não tem campo no contrato. Ele vai " +
      "embutido em `motor.versao` por este adaptador, para a opção não virar anônima na mesa",
    gravidade: "baixa",
  });

  const saida: SaidaV1 = {
    archilly: {
      schema: "archilly-motor-saida",
      versao: CONTRATO,
      origem: "archilly-lab · LAB-07",
      // O motor não põe data na saída de propósito (carimbo quebraria a
      // comparação byte a byte). O contrato exige `geradoEm`; quem carimba é
      // esta ponte, e o campo fica FORA da assinatura de determinismo.
      geradoEm: opcoes.geradoEm ?? new Date().toISOString(),
    },
    motor: {
      nome: "motor-testfit",
      versao: `${opcoes.versaoMotor}+${plano.formato}`,
      semente: String(opcoes.semente),
    },
    entrada: {
      projetoId: entrada.projeto.id ?? null,
      glebaId: entrada.gleba.id ?? null,
      contrato: CONTRATO,
    },
    // O MESMO CRS da entrada. Divergir aqui entrega o desenho noutro lugar do
    // mundo, e como os dois arquivos falam em metros nada na geometria
    // denunciaria a troca.
    crs: entrada.crs,
    vias,
    quadras,
    lotes,
    areasEspeciais,
    quadroDeAreas: {
      areaTotal_m2: m.areaBruta_m2,
      areaPrivativa_m2: m.areaPrivativa_m2,
      areaViaria_m2: m.areaViaria_m2,
      areaLazer_m2: areaLazer,
      areaAPP_m2: areaAPP,
      areaNaoAproveitada_m2: naoAproveitada,
    },
    // Os parâmetros que o motor DE FATO aplicou, lidos da amostra da variante.
    parametrosUsados: parametrosAplicados(plano, entrada),
  };

  return { saida, perdas };
}

/**
 * Os parâmetros que o motor de fato aplicou nesta variante.
 *
 * O contrato diz que `parametrosUsados` é "o que você **de fato** aplicou", e
 * que o relatório aponta quando ele diverge do pedido. Por isso os números saem
 * de `plano.amostra` — os valores sorteados dentro das faixas para ESTA
 * variante —, e não da ENTRADA. Copiar a entrada de volta faria os dois sempre
 * baterem, e o campo perderia a única função que tem.
 */
function parametrosAplicados(plano: Plano, entrada: EntradaV1): SaidaV1["parametrosUsados"] {
  const a = plano.amostra ?? {};
  const doContrato = entrada.parametros;
  const num = (chave: string): number | null => {
    const v = a[chave];
    return typeof v === "number" && Number.isFinite(v) ? v : null;
  };

  const areaLote = num("areaLote");
  const testada = num("testada");
  const caixaP = num("caixaPrincipal");
  const caixaS = num("caixaSecundaria");
  const calcadaP = num("calcadaPrincipal");
  const comprimentoQuadra = num("comprimentoQuadra");

  return {
    // Mínimo e máximo continuam sendo os do contrato: o motor não os relaxa,
    // ele mira dentro deles. O que ele escolhe é o ALVO.
    areaMinLote_m2: doContrato.areaMinLote_m2,
    areaAlvoLote_m2: areaLote ?? doContrato.areaAlvoLote_m2,
    areaMaxLote_m2: doContrato.areaMaxLote_m2,
    testadaMinLote_m: testada ?? doContrato.testadaMinLote_m,
    caixaViariaMin_m: Math.min(
      caixaP ?? doContrato.caixaViariaMin_m,
      caixaS ?? doContrato.caixaViariaMin_m,
    ),
    caixaPrincipal_m: caixaP,
    caixaSecundaria_m: caixaS,
    calcada_m: calcadaP,
    faceQuadraMax_m: comprimentoQuadra,
    pctAreaPublica: null,
    pctAPP: num("appPct"),
    pctLazer: num("lazerPct"),
    // O motor não limita rampa. `null` diz isso, e é diferente de dizer 10 %.
    rampaMaxima_pct: null,
  };
}
