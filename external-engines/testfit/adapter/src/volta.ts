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
 * 4. **A identidade no contrato é a que o motor publica** (LAB-29). `motor.nome` e
 *    `motor.versao` vêm de `MOTOR_NOME` e `MOTOR_VERSAO`, do próprio motor. O que o
 *    Lab acrescenta é o `+<formato>`, para a opção não virar anônima na mesa, e o
 *    rótulo da rodada, que vai em `archilly.origem`.
 * 5. **`areaViaria_m2` do motor é residual.** Ele calcula
 *    `bruta − quadras − especiais`, não a área dos corredores. Num plano que não
 *    preenche a gleba, o "viário" engorda com terra que não é rua. O número
 *    atravessa como está — corrigi-lo aqui seria o adaptador inventando uma
 *    medição que o motor não fez — e a distorção vai medida no relatório.
 */
import { area } from "@testfit/geo.ts";
import { MOTOR_NOME, MOTOR_VERSAO } from "@testfit/contrato/tipos.ts";
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
  /**
   * `versaoMotor` **não existe mais** (LAB-29): a versão é do motor, lida de
   * `MOTOR_VERSAO`. Quem quiser marcar a rodada usa `rotuloDoLab`, que vai em
   * `archilly.origem` — o campo de quem rodou.
   */
  opcoes: { semente: number; geradoEm?: string; rotuloDoLab?: string },
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
    // ── O motor MEDE as duas rampas, e este adaptador as jogava fora ──────
    //
    // Até o LAB-22 aqui estava `rampaMedia_pct: null`, com a justificativa de
    // que *"o motor não calcula greide"*. Era verdade quando o LAB-07 escreveu
    // esta ponte, e **deixou de ser em 14/09**, quando o T03 do motor passou a
    // medir rampa média e máxima por via a partir das cotas do terreno.
    //
    // A ponte não percebeu, e por quase três semanas o Lab publicou `null` —
    // e, pior, reportou ao chat que *"o Laboratório de Parcelamento não reporta
    // o pico"*. O que não reportava era **esta ponte**. Medido no LAB-22.
    rampaMedia_pct: v.rampaMedia_pct,
    rampaMaxima_pct: v.rampaMaxima_pct,
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
  // A perda que existia aqui foi APAGADA no LAB-22, porque o motor passou a
  // medir. O que sobra é a perda de VERDADE: quando a gleba não traz cota, o
  // motor devolve `null`, e aí sim não há greide — mas a razão é a gleba, não o
  // motor, e dizer "o motor não calcula" seria culpar o lado errado.
  const semRampa = plano.vias.filter((v) => v.rampaMedia_pct == null).length;
  if (semRampa > 0) {
    perdas.push({
      campo: "vias[].rampaMedia_pct",
      oQueHavia: `${semRampa} de ${plano.vias.length} via(s) sem rampa medida`,
      motivo:
        "o motor mede a rampa a partir das cotas do terreno (T03 dele); sem cota na ENTRADA " +
        "ele devolve `null`, que é a resposta certa. A falta é da gleba, não do motor",
      gravidade: semRampa === plano.vias.length ? "alta" : "baixa",
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
      // ── A QUARTA VEZ DO MESMO PONTO CEGO, e quem a pegou foi a guarda ─────
      //
      // Até o LAB-25 aqui estava `faceDeRua: null`, com o comentário *"o motor
      // sabe a testada mas não guarda de QUAL via ela é frente"*. Ele mede
      // **desde o T02** (`face.ts` dele), e a tradução própria dele escreve
      // exatamente isto (`contrato/traducao.ts:453`). O comentário não
      // envelheceu sozinho: ele foi escrito antes do T02 e nunca mais foi
      // conferido — a mesma forma do D98.
      //
      // Quem apontou não fui eu: foi a `guarda-da-ponte.ts`, na primeira
      // rodada, em 110 de 110 lotes (D104). É para isso que ela existe.
      //
      // O motor dá o ÍNDICE em `plano.vias`; o contrato quer o id. A numeração
      // é a mesma que as vias acima receberam, então `i` → `V<i+1>`. Índice
      // fora da lista sai `null`: o esquema do Generate recusa o arquivo
      // inteiro quando um lote aponta para via que não está nele, e inventar um
      // id seria trocar um campo incompleto por um campo mentiroso.
      faceDeRua:
        l.faceDeRua != null && l.faceDeRua >= 0 && l.faceDeRua < vias.length
          ? vias[l.faceDeRua]!.id
          : null,
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
  // A perda que existia aqui era FALSA, e ficou falsa por três semanas: ela
  // dizia que o motor não guardava a via de frente. Guarda desde o T02. O que
  // sobra é a perda de verdade — os lotes em que o PRÓPRIO motor não mediu.
  const semFace = plano.lotes.filter((l) => l.faceDeRua == null).length;
  if (semFace > 0) {
    perdas.push({
      campo: "lotes[].faceDeRua",
      oQueHavia: `${semFace} de ${plano.lotes.length} lote(s) sem via de frente medida`,
      motivo:
        "o motor devolve `null` quando nenhuma via está a uma distância plausível da frente " +
        "do lote (`face.ts` dele, D19 dele). `null` é não medido, e o Validator do Generate " +
        "mede a frente por conta própria com a régua dele",
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
      // Quem RODOU, que é diferente de quem É. O rótulo do prompt do Lab mora
      // aqui desde o LAB-29 — antes ele se disfarçava de versão do motor.
      origem: opcoes.rotuloDoLab ?? "archilly-lab · LAB-07",
      // O motor não põe data na saída de propósito (carimbo quebraria a
      // comparação byte a byte). O contrato exige `geradoEm`; quem carimba é
      // esta ponte, e o campo fica FORA da assinatura de determinismo.
      geradoEm: opcoes.geradoEm ?? new Date().toISOString(),
    },
    // ── A IDENTIDADE É DO MOTOR, não etiqueta minha (LAB-29, D117) ─────────
    //
    // Estava `nome: "motor-testfit"` — o nome do REPOSITÓRIO — e
    // `versao: "T00-A+<formato>"`, que é **rótulo de prompt do Lab**, não versão
    // de motor nenhum. O motor publica as duas, em `contrato/tipos.ts`:
    // `MOTOR_NOME = "laboratorio-de-parcelamento"` e `MOTOR_VERSAO`, com a nota
    // *"sobe quando o desenho muda de forma que o Generate veja"*.
    //
    // Mesma forma do D104, um nível acima: o Lab inventando onde o motor publica.
    // Aqui não há sequer tradução a fazer — é importar.
    //
    // **O `+<formato>` fica**, e é a única coisa que o Lab acrescenta: sem ele a
    // opção vira anônima na mesa do Generate, que mostra
    // `externo · <nome> v<versão>`. O rótulo do Lab vai em `origem`, que é o campo
    // de quem RODOU — não de quem é.
    motor: {
      nome: MOTOR_NOME,
      versao: `${MOTOR_VERSAO}+${plano.formato}`,
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
    parametrosUsados: parametrosAplicados(plano, entrada, perdas),
  };

  return { saida, perdas };
}

/**
 * Os parâmetros que o motor de fato aplicou nesta variante.
 *
 * O contrato diz que `parametrosUsados` é "o que você **de fato** aplicou", e
 * que o relatório aponta quando ele diverge do pedido. Por isso o que o motor
 * ESCOLHE sai de `plano.amostra` — os valores sorteados dentro das faixas para
 * ESTA variante —, e não da ENTRADA. Copiar a entrada de volta faria os dois
 * sempre baterem, e o campo perderia a única função que tem.
 *
 * # Mas MÍNIMO e MÁXIMO não são escolha do motor — e isso custou 36 violações
 *
 * **Esta função já escrevia a regra, e quebrava-a em três campos.** O comentário
 * dizia *"mínimo e máximo continuam sendo os do contrato: o motor não os relaxa,
 * ele mira dentro deles — o que ele escolhe é o ALVO"*, e logo abaixo
 * `testadaMinLote_m`, `caixaViariaMin_m` e `faceQuadraMax_m` recebiam o valor
 * **sorteado**.
 *
 * O preço, medido no LAB-48: a entrada declara `testadaMinLote_m = 10` m nas
 * cinco glebas; o alvo sorteado da variante é **11,70820393249937** m (o meio da
 * faixa que a ida monta, `(10 + √(360/2))/2`); e era esse número que chegava ao
 * Validator do Generate **no campo cujo nome é MÍNIMO**. O Validator então media
 * o motor contra **o próprio alvo dele**, com 2 % de folga, e reprovava **47
 * lotes de 316 m² por um déficit mediano de 1,94 cm**. Trinta e seis dos 47 eram
 * esta função — não o motor (D166).
 *
 * > **Campo cujo nome diz MÍNIMO e cujo valor é um ALVO não é um campo errado: é
 * > uma acusação automática.**
 *
 * # As três saídas possíveis para um campo MIN/MAX, e nenhuma outra
 *
 * 1. **do contrato** — o valor idêntico ao que a ENTRADA declarou. É o caso
 *    normal: o limite é de quem o declarou, e o motor mirou dentro dele;
 * 2. **`null`** — o motor não honra aquele limite. `null` é "não aplicado", e
 *    publicar o número do contrato aqui seria **inventar obediência**, que é o
 *    erro simétrico deste que o LAB-53 conserta;
 * 3. **nunca o sorteado.** O que o motor sorteia é alvo, e alvo mora em campo de
 *    alvo — ou vira perda declarada, quando o contrato v1 não tem o campo.
 *
 * **Há guarda ao lado** (`tests/esteira.test.ts`, "§LAB-53"): ela roda a volta
 * duas vezes com a mesma ENTRADA e duas amostras diferentes, e exige que **todo
 * campo MIN/MAX fique parado** enquanto o campo de ALVO **se move**. Ela mede
 * dependência, não ortografia — a lição das cinco réguas de nome do §6.
 */
function parametrosAplicados(
  plano: Plano,
  entrada: EntradaV1,
  perdas: Perda[],
): SaidaV1["parametrosUsados"] {
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

  // ── O alvo sorteado que NÃO tem onde morar, e a perda é medida ────────────
  //
  // O contrato v1 tem o trio MIN/ALVO/MAX **só para a área do lote**. Para a
  // testada e para a face de quadra ele tem um limite e nada mais, então o alvo
  // da variante não atravessa. **A perda só é declarada quando o alvo de fato
  // DIFERE do limite** — o `comprimentoQuadra` costuma não diferir, porque a ida
  // monta `faixa(faceQuadraMax_m, faceQuadraMax_m)`, degenerada. Perda que grita
  // onde não há perda ensina a ignorar a lista.
  const SEM_CAMPO_DE_ALVO: [string, number | null, number | null, string][] = [
    ["testada", testada, doContrato.testadaMinLote_m, "testadaAlvoLote_m"],
    ["comprimentoQuadra", comprimentoQuadra, doContrato.faceQuadraMax_m, "faceQuadraAlvo_m"],
  ];
  for (const [chave, alvo, limite, campoQueFalta] of SEM_CAMPO_DE_ALVO) {
    if (alvo == null || limite == null || alvo === limite) continue;
    perdas.push({
      campo: `parametrosUsados.${campoQueFalta}`,
      oQueHavia: `o alvo sorteado desta variante para \`${chave}\`: ${alvo} m (o limite declarado é ${limite} m)`,
      motivo:
        "o contrato de motor v1 tem o trio MIN/ALVO/MAX só para a área do lote; para a " +
        `testada e para a face de quadra ele tem um limite e nenhum alvo, então \`${campoQueFalta}\` ` +
        "não existe onde escrever. Até o LAB-53 este valor era escrito no campo do LIMITE, e o " +
        "Validator do Generate passava a medir o motor contra o próprio alvo dele: 36 das 47 " +
        "violações `testada` do LAB-48 eram isto, e não o motor (D166). O campo que falta está " +
        "na lista numerada para o Generate",
      gravidade: "media",
    });
  }

  return {
    // ── MÍNIMO e MÁXIMO vêm do CONTRATO. Os três últimos vieram do sorteio até
    // o LAB-53, e eram uma acusação automática (D166). ──────────────────────
    areaMinLote_m2: doContrato.areaMinLote_m2,
    areaMaxLote_m2: doContrato.areaMaxLote_m2,
    testadaMinLote_m: doContrato.testadaMinLote_m,
    caixaViariaMin_m: doContrato.caixaViariaMin_m,
    faceQuadraMax_m: doContrato.faceQuadraMax_m,

    // ── O que o motor ESCOLHE, e é por isto que o campo existe ─────────────
    //
    // `areaAlvoLote_m2` é o único alvo com campo no contrato v1. As três caixas
    // não são limite nenhum: são a medida que o motor aplicou, e o sorteado é a
    // resposta certa para elas. Nada se perde em `caixaViariaMin_m` passar a vir
    // do contrato — os valores sorteados continuam saindo, em
    // `caixaPrincipal_m` e `caixaSecundaria_m`, que é onde eles significam o que
    // são.
    areaAlvoLote_m2: areaLote ?? doContrato.areaAlvoLote_m2,
    caixaPrincipal_m: caixaP,
    caixaSecundaria_m: caixaS,
    calcada_m: calcadaP,
    pctAreaPublica: null,
    pctAPP: num("appPct"),
    pctLazer: num("lazerPct"),
    // O motor não limita rampa. `null` diz isso, e é diferente de dizer 10 % —
    // é a saída 2 do cabeçalho: publicar aqui o número do contrato seria
    // inventar uma obediência que o motor não tem.
    rampaMaxima_pct: null,
  };
}
