/**
 * O INVENTÁRIO DAS IDAS — um destino para cada campo que o contrato traz.
 * (LAB-30)
 *
 * Irmão do `inventario-das-pontes.ts`, no sentido contrário: lá era *"para onde foi
 * o que o motor publicou"*; aqui é *"para onde foi o que o contrato trouxe"*.
 *
 * # O que ele achou no dia em que nasceu
 *
 * Que o motor do Laboratório de Parcelamento tem `viaManual` — *"coluna vertebral
 * desenhada à mão"* — e **a ida nunca o preencheu**. O Lab publicou duas vezes que
 * *o motor* ignorava via desenhada. Medido: preenchendo, `antonina-com-via` vai de
 * **25 para 32 vias**. Está consertado, e esta é a entrada que o trava.
 *
 * # Como se mexe aqui
 *
 * `campo-novo-no-contrato` vermelho significa que **o contrato cresceu**. As duas
 * saídas honestas são as mesmas da ponte: fazer o campo chegar ao motor, ou declarar
 * a perda com o motivo medido. O que não é saída: pôr `interno` em dado de terreno
 * para calar o teste — `interno` é para escrituração do contrato (schema, ids,
 * carimbo), não para geometria.
 */
import type { DestinoNaIda } from "./guarda-da-ida.ts";

const entregue = (caminho: string): DestinoNaIda => ({ tipo: "entregue", caminho });
const traduzido = (caminho: string, como: string): DestinoNaIda => ({ tipo: "traduzido", caminho, como });
const perda = (motivo: string): DestinoNaIda => ({ tipo: "perda", motivo });
const interno = (motivo: string): DestinoNaIda => ({ tipo: "interno", motivo });
/** Blob opaco, descartado em bloco e com o motivo declarado. Ver `DestinoNaIda`. */
const perdaEmBloco = (motivo: string): DestinoNaIda => ({ tipo: "perda", motivo, cobreFilhos: true });
/** Dívida do Lab: o motor tem onde receber e a ida ainda não entrega. Ver `DestinoNaIda`. */
const divida = (onde: string, proposto: string): DestinoNaIda => ({ tipo: "divida", onde, proposto });

/** O que é escrituração do contrato nas duas idas, e não dado de terreno. */
const ESCRITURACAO: Record<string, DestinoNaIda> = {
  archilly: interno("schema e versão do contrato: a ida os confere e não os repassa"),
  projeto: interno("ids do projeto, para o relatório e para a volta"),
  "projeto.id": interno("idem"),
  "projeto.nome": interno("idem"),
  "archilly.schema": interno("idem"),
  "archilly.versao": interno("idem"),
  "archilly.origem": interno("quem gerou a ENTRADA — registro, não dado de terreno"),
  "archilly.geradoEm": interno("carimbo da ENTRADA; o do desenho é posto pela volta"),
};

// ═════════════════════════ a ida do Parcelamento ═══════════════════════════

/** `EntradaV1` do contrato → `EntradaMotor` do Laboratório de Parcelamento. */
export const IDA_DO_PARCELAMENTO: Record<string, DestinoNaIda> = {
  ...ESCRITURACAO,
  crs: traduzido("terreno.origem", "o CRS vira a origem do terreno do motor"),
  "crs.codigo": traduzido("terreno.origem", "idem"),
  "crs.unidade": interno("a ida recusa o arquivo se não for metro; não há o que repassar"),
  "crs.origemGeografica": perda(
    "sem origem geográfica não há como reverter o resultado para graus; a saída fica em " +
      "metros locais, que é o que o contrato permite ao declarar `codigo: local`",
  ),
  "crs.origemGeografica.lat": perda("idem — a latitude de origem não atravessa"),
  "crs.origemGeografica.lon": perda("idem — a longitude de origem não atravessa"),
  gleba: traduzido("terreno.perimetro", "o anel da gleba vira o perímetro do terreno"),
  "gleba.id": interno("identificação, não geometria"),
  "gleba.nome": traduzido("terreno.nome", "o nome viaja"),
  "gleba.anel": entregue("terreno.perimetro"),
  "gleba.furos": perda(
    "o motor tem um perímetro só (`Terreno.perimetro: Ponto[]`); gleba com furo entra como " +
      "o anel externo, e o furo vira área que o motor acha livre. Declarado por gravidade alta",
  ),
  "gleba.area_m2": perda(
    "a área DECLARADA não entra: o motor calcula a dele do anel. Quando as duas divergem " +
      "mais de 0,1 % a ida anota — a geometria é a verdade, a declaração é conferência",
  ),
  relevo: traduzido("terreno.relevo", "as curvas viram o modelo de relevo do motor"),
  "relevo.curvas": entregue("terreno.relevo"),
  "relevo.curvas[].cota_m": entregue("terreno.relevo"),
  "relevo.curvas[].pontos": entregue("terreno.relevo"),
  restricoes: traduzido("terreno.restricoes", "cada restrição vira área travada ou ímã negativo"),
  "restricoes[].id": entregue("terreno.restricoes"),
  "restricoes[].tipo": traduzido("terreno.restricoes", "o vocabulário do contrato vira o do motor"),
  "restricoes[].nome": entregue("terreno.restricoes"),
  "restricoes[].desconta": traduzido(
    "terreno.restricoes",
    "`desconta: true` vira ímã máximo — é o que faz a restrição sair da conta de área",
  ),
  "restricoes[].geometria": traduzido("terreno.restricoes", "o anel vira o polígono travado"),
  "restricoes[].geometria.tipo": interno("qual forma veio; a ida escolhe o caminho por ela"),
  "restricoes[].geometria.aneis": entregue("terreno.restricoes"),
  "restricoes[].geometria.ponto.x": interno("coordenada do ponto, quando a restrição é ponto"),
  "restricoes[].geometria.ponto.y": interno("idem"),
  "restricoes[].geometria.pontos": perda(
    "restrição como LINHA não entra: o motor só entende restrição como polígono. Declarado",
  ),
  "restricoes[].geometria.ponto": perda("idem, restrição como ponto"),
  "restricoes[].nascente": perda(
    "**v2, e sem dado em gleba nenhuma** (D88): o ponto da nascente não tem onde entrar — o " +
      "motor não conhece raio de proteção. A regra dos 50 m está escrita e marcada como não " +
      "aplicável até o contrato TRAZER a nascente, e quando trouxer isto aqui fica vermelho",
  ),
  "restricoes[].eixoDoCurso": perda(
    "**v2**: o eixo do curso d'água não tem onde entrar; o motor recebe a APP como polígono",
  ),
  "restricoes[].baseLegal": perda("a base legal é texto para o relatório, não geometria"),
  // Cada parâmetro se declara, um por um — e é de propósito: o dia em que o
  // contrato acrescentar um, esta lista fica vermelha e alguém decide onde ele vai.
  // Os três que não cabem no motor já eram perda declarada antes desta guarda.
  "parametros.areaMinLote_m2": traduzido("terreno.padroes", "o mínimo da faixa `areaLote`"),
  "parametros.areaAlvoLote_m2": traduzido(
    "terreno.padroes",
    "o alvo vira o teto da faixa `testada` (um lote de área alvo com profundidade razoável); " +
      "o motor mira dentro da faixa, não num alvo",
  ),
  "parametros.areaMaxLote_m2": traduzido("terreno.padroes", "o máximo da faixa `areaLote`"),
  "parametros.testadaMinLote_m": traduzido("terreno.padroes", "o mínimo da faixa `testada`"),
  "parametros.caixaPrincipal_m": traduzido("terreno.padroes", "faixa degenerada `caixaPrincipal`"),
  "parametros.caixaSecundaria_m": traduzido("terreno.padroes", "faixa degenerada `caixaSecundaria`"),
  "parametros.calcada_m": traduzido("terreno.padroes", "`calcadaPrincipal` e `calcadaSecundaria`"),
  "parametros.faceQuadraMax_m": traduzido("terreno.padroes", "faixa `comprimentoQuadra`"),
  "parametros.pctLazer": traduzido("terreno.padroes", "faixa `lazerPct`"),
  "parametros.pctAPP": traduzido("terreno.padroes", "faixa `appPct`"),
  "parametros.caixaViariaMin_m": perda(
    "o motor usa as caixas explícitas e não tem um piso independente. Vira perda declarada " +
      "só quando o mínimo é MAIOR que a menor caixa — aí o contrato se contradiz",
  ),
  "parametros.pctAreaPublica": perda(
    "o motor não reserva área pública por porcentagem; ele reserva por ímã de conteúdo",
  ),
  "parametros.rampaMaxima_pct": perda("o motor não limita rampa — ele mede, desde o T03 dele"),
  // ── Três destinos, e o terceiro é uma DÍVIDA (LAB-30) ─────────────────────
  //
  // Atração como **polígono** vira ímã em `terreno.atracoes`. **Via desenhada**
  // vira a coluna vertebral em `viaManual` — consertado neste prompt. E a
  // **testada de frente**, que também chega como linha, tem onde ir no motor:
  // `facesLoteamento` — *"faces do perímetro que recebem lotes virados para a rua
  // existente"* — e a ida **ainda não a entrega**.
  //
  // Isso é dívida do Lab, não limite do motor, e por isso não entra como `perda`:
  // `perda` quer dizer que o motor não tem onde receber, e aqui ele tem. Mapear a
  // linha para QUAIS faces do perímetro ela cobre é geometria nova, e prompt novo.
  atracoes: divida(
    "terreno.atracoes · viaManual · facesLoteamento",
    "a testada de frente chega como linha e o motor tem `facesLoteamento` esperando por ela; " +
      "falta mapear a linha para as faces do perímetro que ela cobre. Proposto ao chat no " +
      "LAB-30 — e enquanto não for feito, `respeitaTestadaDeFrente: false` é dívida do Lab, " +
      "não limitação do motor",
  ),
  "atracoes[].id": divida("terreno.atracoes · viaManual · facesLoteamento", "ver `atracoes`"),
  // **O campo que o LAB-30 consertou — e metade dele continua dívida.**
  //
  // `via_desenhada` (v2) vira a coluna vertebral; no v1 ela chega como
  // `via_existente`, indistinguível da testada de frente, e quem separa é o remendo
  // do LAB-13, na esteira, que passa a linha pronta. A outra metade do tipo — a
  // testada de frente — espera em `facesLoteamento`. Ver `atracoes`.
  "atracoes[].tipo": divida(
    "viaManual · terreno.atracoes · facesLoteamento",
    "o tipo decide o destino, e um dos três destinos ainda não é entregue: ver `atracoes`",
  ),
  "atracoes[].nome": divida("terreno.atracoes · viaManual · facesLoteamento", "ver `atracoes`"),
  "atracoes[].geometria": divida(
    "terreno.atracoes · viaManual · facesLoteamento",
    "ver `atracoes`: polígono vira ímã, via desenhada vira coluna vertebral, e a testada de " +
      "frente ainda não tem quem a entregue",
  ),
  "atracoes[].geometria.tipo": interno("qual forma veio"),
  "atracoes[].geometria.aneis": entregue("terreno.atracoes"),
  "atracoes[].geometria.pontos": divida(
    "viaManual · facesLoteamento",
    "atração como LINHA: desde o LAB-30 a via desenhada vai para `viaManual`. As outras " +
      "linhas (ponto de interesse, outra) continuam sem destino, e a perda é declarada",
  ),
  acessos: traduzido("terreno.acesso", "o acesso principal vira o ponto de partida do traçado"),
  "acessos[].id": interno("identificação do acesso"),
  "acessos[].nome": interno("rótulo para pessoa"),
  "acessos[].papel": traduzido("terreno.acesso", "o motor recebe UM acesso; vale o `principal`"),
  "acessos[].ponto": entregue("terreno.acesso"),
  "acessos[].ponto.x": entregue("terreno.acesso.x"),
  "acessos[].ponto.y": entregue("terreno.acesso.y"),
  "acessos[].segmento": traduzido(
    "terreno.acesso",
    "o motor tem um ÚNICO ponto de acesso; um segmento é uma testada inteira liberada, e o " +
      "meio dela é o palpite menos errado. A perda vai declarada, com gravidade alta",
  ),
  "acessos[].sugerido": perda(
    "o motor não distingue acesso marcado de palpite do Geo; o traçado parte dali como se " +
      "fosse decisão do usuário. O contrato carrega essa marca justamente para não calá-la",
  ),
  // ── Uma entrada ERRADA deste inventário, e a correção (LAB-30) ────────────
  //
  // A primeira versão declarou o destino como `faixas`, e a guarda acusou: *"o
  // contrato trouxe `parametros` e `faixas` chegou vazio"*. **Achado inventado.** As
  // faixas do motor são montadas pela ida e entregues em `terreno.padroes` — o
  // `EntradaMotor.faixas` existe, mas é calibragem de quem chama, não dado de gleba.
  //
  // Medido antes de atribuir, e o culpado era a régua nova. Terceira vez hoje que
  // isso acontece (D114, D116, esta) — e as três vezes o que salvou foi conferir o
  // achado contra o objeto em vez de acreditar nele.
  parametros: traduzido(
    "terreno.padroes",
    "os parâmetros da gleba viram as faixas do motor, dentro do terreno: onde o contrato dá " +
      "mínimo e máximo a faixa nasce deles, e onde dá um valor só ela é degenerada",
  ),
  geo: perdaEmBloco(
    "o documento `archilly-terreno` inteiro do Geo. O motor tem leitor próprio para ele, mas " +
      "a entrada por esta ponte é o contrato: matrícula, CAR, INCRA e zoneamento ficam fora",
  ),
  regiaoNormativa: perda("o motor não muda de norma por região"),
};

// ═════════════════════════════ a ida do Symbios ════════════════════════════

/** `EntradaMinima` do contrato → `Terreno` do adaptador do Symbios. */
export const IDA_DO_SYMBIOS: Record<string, DestinoNaIda> = {
  ...ESCRITURACAO,
  crs: traduzido("origem", "o CRS vira a origem do terreno"),
  "crs.codigo": traduzido("origem", "idem"),
  "crs.unidade": interno("a ida recusa o que não for metro"),
  "crs.origemGeografica": perda(
    "sem origem geográfica não há como reverter para graus; a saída fica em metros locais",
  ),
  "crs.origemGeografica.lat": perda("idem"),
  "crs.origemGeografica.lon": perda("idem"),
  gleba: traduzido("gleba", "o anel e os furos viram o polígono da gleba"),
  "gleba.id": interno("identificação"),
  "gleba.nome": traduzido("nome", "o nome viaja"),
  "gleba.anel": entregue("gleba.externo"),
  "gleba.furos": entregue("gleba.furos"),
  "gleba.area_m2": traduzido(
    "areaDeclarada_m2",
    "entra como INFORMAÇÃO, nunca como cálculo — o motor mede a dele do anel",
  ),
  relevo: traduzido("curvas", "as curvas de nível viram o campo tensorial, que é o traçado dele"),
  "relevo.curvas": entregue("curvas"),
  "relevo.curvas[].cota_m": entregue("curvas"),
  "relevo.curvas[].pontos": entregue("curvas"),
  restricoes: entregue("restricoes"),
  "restricoes[].baseLegal": perda("a base legal é texto para o relatório, não geometria"),
  "restricoes[].geometria.ponto.x": interno("coordenada, quando a restrição é ponto"),
  "restricoes[].geometria.ponto.y": interno("idem"),
  "restricoes[].id": entregue("restricoes"),
  "restricoes[].tipo": traduzido("restricoes", "o tipo do contrato vira a categoria do motor"),
  "restricoes[].nome": entregue("restricoes"),
  "restricoes[].desconta": entregue("restricoes"),
  "restricoes[].geometria": traduzido("restricoes", "o anel vira a área da restrição"),
  "restricoes[].geometria.tipo": interno("qual forma veio"),
  "restricoes[].geometria.aneis": entregue("restricoes"),
  "restricoes[].geometria.pontos": perda("restrição como linha não entra: o motor quer polígono"),
  "restricoes[].geometria.ponto": perda("idem, como ponto"),
  "restricoes[].nascente": perda(
    "**v2, e sem dado em gleba nenhuma** (D88). O Symbios não conhece raio de proteção",
  ),
  "restricoes[].eixoDoCurso": perda("**v2**: o eixo do curso d'água não tem onde entrar"),
  geo: perdaEmBloco(
    "o documento `archilly-terreno` inteiro do Geo: o Symbios recebe o terreno já traduzido " +
      "em metros locais, e o documento do Geo não atravessa esta ponte",
  ),
  regiaoNormativa: perda("o Symbios não conhece norma por região: o traçado dele é geométrico"),
  atracoes: perdaEmBloco(
    "o Symbios **não tem conceito de atração**: o traçado dele nasce do campo tensorial do " +
      "relevo, e não há onde pendurar um ímã. É a perda mais honesta das duas idas — ela não " +
      "é esquecimento, é a arquitetura do motor",
  ),
  acessos: perdaEmBloco(
    "o motor não recebe ponto de acesso: a rede dele não é ancorada em entrada nenhuma, e " +
      "ligar a rede ao acesso é trabalho de quem consumir a saída. Provado por diferença no " +
      "LAB-26 — mover o acesso não muda um lote",
  ),
  parametros: perdaEmBloco(
    "o Symbios traça via e extrai quadra; ele não parcela em lote, então todo parâmetro de " +
      "lote fica sem consumidor deste lado da ponte",
  ),
};

/** As idas que esta guarda cobre, pelo nome que aparece no achado. */
export const IDAS_AUDITADAS = ["parcelamento", "symbios"] as const;
