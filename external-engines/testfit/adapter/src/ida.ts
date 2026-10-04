/**
 * IDA — a ENTRADA do contrato de motor v1 vira a entrada do motor do Testfit.
 *
 * ```text
 * archilly-motor-entrada  →  EntradaMotor { terreno, faixas, forcas, ... }
 * ```
 *
 * # O que esta tradução decide, e por quê
 *
 * O contrato e o motor falam de coisas parecidas com palavras diferentes, e em
 * três pontos eles não falam da mesma coisa. Onde não falam, a tradução escolhe
 * — e **registra a perda**, item a item. Uma ponte que descarta em silêncio faz
 * o julgamento medir um terreno que o usuário não entregou.
 *
 * As três escolhas:
 *
 * 1. **Ímã.** O contrato não tem o conceito. O motor pede um ímã de 0 a 3 por
 *    elemento (`Elemento.ima`). A regra adotada: restrição com `desconta: true`
 *    entra com ímã 3 (obriga o traçado a desviar), restrição que não desconta
 *    entra com 2 (prefere desviar), atração entra com 2. Não é o contrato
 *    dizendo — é a leitura mais fiel que cabe, e está declarada aqui para poder
 *    ser discutida.
 * 2. **Geometria que não é polígono.** O motor só entende restrição e atração
 *    como polígono (`Elemento.poligono`). Restrição em linha ou em ponto — e o
 *    contrato admite as duas — não tem como entrar. Vira perda, com o id.
 * 3. **Relevo.** O contrato admite três formas (`cotas`, `curvas`,
 *    `classesDeclividade`); o motor só tem `relevo?: {x,y,z}[]`. Grade entra
 *    direto; curva vira nuvem de vértices cotados; `classesDeclividade` é resumo
 *    estatístico e não tem para onde ir. Ver o aviso do §2.6 no relatório: a
 *    nuvem de vértices de curva é exatamente a entrada que provoca o defeito de
 *    interpolação que o LAB-01 encontrou.
 */
import type { Ponto } from "@testfit/geo.ts";
import type { Elemento, Faixa, Terreno } from "@testfit/tipos.ts";
import type { EntradaMotor } from "@testfit/api.ts";

import type { EntradaV1, GeometriaV1, Perda, PontoV1 } from "./contrato-v1.ts";

/**
 * As versões do contrato que esta ida lê. (LAB-26)
 *
 * **Era `"1"` cravado, e isso quebrou 14 testes em silêncio.** As glebas-padrão
 * que a suíte deste pacote carrega vêm do repositório do Generate, e elas
 * **viraram v2** quando ele publicou o contrato v2 — as três coisas que o Lab
 * pediu. A partir daquele dia a ida recusava a própria fixture, e ninguém viu,
 * porque o `bun test` que eu rodava era só o do pacote `esteira`.
 *
 * É o **gêmeo exato do D87**: o LAB-18 alargou esta mesma porta em
 * `esteira/src/gleba-v1.ts` e **não alargou esta**. Portão de versão em duas
 * terras envelhece numa delas — a mesma frase que o CLAUDE.md §1-A já diz sobre
 * o id do despertador.
 *
 * **Ler v2 aqui é seguro**, e não por otimismo: os campos que o v2 acrescentou
 * (`nascente`, `eixoDoCurso`, `rampaMaxima_pct`, `via_desenhada` separada de
 * `testada_de_frente`) são **adições**, e o que esta ida não conhece ela já
 * declara como perda, um por um. O risco de recusar é concreto e foi medido: a
 * suíte inteira.
 */
export const VERSOES_LIDAS = ["2", "1"] as const;

export interface ResultadoIda {
  entrada: EntradaMotor;
  perdas: Perda[];
}

/** Área de um anel, em m². */
function area(anel: Ponto[]): number {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2);
}

const paraPonto = (p: PontoV1): Ponto => ({ x: p.x, y: p.y });

/**
 * O anel externo de uma geometria de contrato, quando ela for área.
 *
 * Devolve `null` para linha e ponto — e é por isso que a perda é registrada por
 * quem chama: aqui não há contexto para dizer de qual restrição se trata.
 */
function anelDe(g: GeometriaV1): Ponto[] | null {
  if (g.tipo !== "poligono") return null;
  const externo = g.aneis[0];
  if (!externo || externo.length < 3) return null;
  return externo.map(paraPonto);
}

/**
 * Ímã do elemento, de 0 a 3, na didática do próprio motor: 3 obriga, 2 prefere,
 * 1 aceita.
 *
 * O contrato não traz ímã — ele traz `desconta`, que é uma afirmação legal
 * ("esta terra sai da área aproveitável"), não uma preferência de traçado.
 * Traduzir `desconta: true` para o ímã máximo é a leitura conservadora: manda o
 * motor desviar do que a lei já disse que não se ocupa.
 */
function imaDaRestricao(desconta: boolean): number {
  return desconta ? 3 : 2;
}

/**
 * Curvas de nível viram nuvem de vértices cotados.
 *
 * **Esta é a conversão que o §2.6 do LAB-07 manda vigiar.** O `campoRelevo` do
 * motor interpola por inverso da distância sobre TODOS os pontos recebidos; se a
 * nuvem for feita de vértices de curva de nível — muito mais densos ao longo de
 * uma curva do que entre duas —, a interpolação fica enviesada para a cota da
 * curva mais próxima. É a mesma família de defeito que o LAB-01 mediu e
 * corrigiu no adaptador do Symbios (docs/DECISOES.md, D08). O diagnóstico está
 * em `ferramentas/diagnostico-relevo.ts` e o número, no relatório.
 */
function relevoDoContrato(e: EntradaV1, perdas: Perda[]): { x: number; y: number; z: number }[] | undefined {
  const r = e.relevo;
  if (!r) return undefined;

  if (r.cotas && r.cotas.length >= 3) {
    return r.cotas.map((c) => ({ x: c.x, y: c.y, z: c.z }));
  }

  if (r.curvas && r.curvas.length > 0) {
    const pts: { x: number; y: number; z: number }[] = [];
    for (const c of r.curvas) for (const p of c.pontos) pts.push({ x: p.x, y: p.y, z: c.cota_m });
    if (pts.length >= 3) {
      perdas.push({
        campo: "relevo.curvas",
        oQueHavia: `${r.curvas.length} curva(s) de nível, ${pts.length} vértices cotados`,
        motivo:
          "o motor só aceita nuvem de pontos cotados; as curvas viram vértices soltos e a " +
          "informação de QUAL curva cada vértice pertence se perde. É a entrada que enviesa a " +
          "interpolação do motor (ver o diagnóstico de relevo no relatório)",
        gravidade: "media",
      });
      return pts;
    }
  }

  if (r.classesDeclividade && r.classesDeclividade.length > 0) {
    perdas.push({
      campo: "relevo.classesDeclividade",
      oQueHavia: r.classesDeclividade.map((c) => `${c.faixa}: ${c.percentual}%`).join("; "),
      motivo:
        "resumo estatístico da declividade; o motor não tem onde recebê-lo — ele só aceita " +
        "cotas com posição. Não há geometria a derivar daqui",
      gravidade: "baixa",
    });
  }
  if (r.fonteMdt || r.resolucao_m != null) {
    perdas.push({
      campo: "relevo.fonteMdt / relevo.resolucao_m",
      oQueHavia: `fonte "${r.fonteMdt ?? "—"}", resolução ${r.resolucao_m ?? "—"} m`,
      motivo:
        "o motor não expõe passo de grade nem procedência do MDT; o contrato pede que " +
        "`resolucao_m` seja respeitada como piso do passo, e não há onde declarar isso",
      gravidade: "media",
    });
  }
  return undefined;
}

/**
 * Traduz a ENTRADA do contrato para a entrada do motor do Testfit.
 *
 * @param semente a semente da rodada. Mesma entrada e mesma semente → mesmo
 *   desenho; é o que o determinismo do LAB-07 prova.
 */
export function idaParaOMotor(
  e: EntradaV1,
  opcoes: {
    semente: number;
    variantes?: number;
    formatos?: EntradaMotor["formatos"];
    /**
     * A **coluna vertebral desenhada à mão**, quando quem chama souber qual é.
     *
     * Nasceu no LAB-30, e a razão é desconfortável: o motor tem o campo
     * `viaManual` — *"coluna vertebral desenhada à mão, quando houver"* — **e esta
     * ida nunca o preencheu**. O Lab publicou duas vezes que *o motor* ignora via
     * desenhada (LAB-17, LAB-23); medido, quem a ignorava era esta ponte.
     *
     * **Por que vem por opção e não só daqui:** no contrato **v2** a via desenhada
     * tem tipo próprio (`via_desenhada`), e aí esta ida a lê sozinha. No **v1** ela
     * chega como `via_existente`, que é o mesmo tipo da testada de frente — e
     * separar as duas exige medir a distância à divisa, que é o remendo do LAB-13 e
     * mora na esteira. Reescrevê-lo aqui seria a segunda régua que o D20 proíbe e o
     * D116 acabou de punir; então quem já sabe separar **passa pronto**.
     */
    viaManual?: Ponto[] | null;
    /**
     * **As faces do perímetro que recebem lote virado para a rua existente.**
     *
     * Paga a última dívida declarada do inventário (D121, LAB-37). A **testada de
     * frente** chega ao contrato como linha, e o motor tem `facesLoteamento`
     * esperando: *"índices das faces do perímetro que recebem lotes voltados para a
     * rua"*. Esta ida nunca entregou.
     *
     * **Por que vem por opção, como a `viaManual`:** no v1 a testada de frente e a
     * via desenhada chegam com o MESMO tipo (`via_existente`), e separá-las exige
     * medir a distância à divisa — régua que mora na esteira (remendo do LAB-13).
     * Mapear a linha para as faces é a `facesCobertasPelaLinha`, que mora lá pelo
     * mesmo motivo: duas réguas para a mesma grandeza é o que o D116 puniu.
     */
    facesLoteamento?: number[] | null;
  } = {
    semente: 20260913,
  },
): ResultadoIda {
  const perdas: Perda[] = [];

  if (e.archilly?.schema !== "archilly-motor-entrada") {
    throw new Error(
      `Esperava o schema "archilly-motor-entrada" e veio "${e.archilly?.schema ?? "nenhum"}".`,
    );
  }
  if (!(VERSOES_LIDAS as readonly string[]).includes(e.archilly.versao)) {
    throw new Error(
      `Contrato de motor versão "${e.archilly.versao}" — este adaptador entende ` +
        `${VERSOES_LIDAS.map((v) => `"${v}"`).join(" e ")}.`,
    );
  }
  if (e.crs.unidade !== "m") {
    throw new Error(`O contrato só fala metro; veio unidade "${e.crs.unidade}".`);
  }

  const perimetro = e.gleba.anel.map(paraPonto);
  if (perimetro.length < 3) throw new Error("A gleba precisa de pelo menos 3 pontos.");

  // ------------------------------------------------------------------ furos
  if (e.gleba.furos.length > 0) {
    perdas.push({
      campo: "gleba.furos",
      oQueHavia: `${e.gleba.furos.length} furo(s) na gleba`,
      motivo:
        "o motor recebe o perímetro como anel simples (`Terreno.perimetro: Poligono`) e não " +
        "tem onde declarar vazio interno. O traçado vai passar por cima do furo",
      gravidade: "alta",
    });
  }

  // ---------------------------------------------------------------- acessos
  const principal = e.acessos.find((a) => a.papel === "principal") ?? e.acessos[0];
  let acesso: Ponto | null = null;
  if (principal) {
    if (principal.ponto) {
      acesso = paraPonto(principal.ponto);
    } else if (principal.segmento) {
      // O motor só tem UM ponto de acesso. Um segmento é uma testada inteira
      // liberada; o meio dela é o palpite menos errado, e a perda fica anotada.
      const a = paraPonto(principal.segmento.a);
      const b = paraPonto(principal.segmento.b);
      acesso = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      perdas.push({
        campo: `acessos[${e.acessos.indexOf(principal)}].segmento`,
        oQueHavia: `segmento de ${Math.hypot(b.x - a.x, b.y - a.y).toFixed(1)} m`,
        motivo:
          "o motor tem um ÚNICO ponto de acesso (`Terreno.acesso: Ponto | null`); o segmento " +
          "virou o ponto médio. Uma testada liberada de 200 m passa a ser tratada como portão",
        gravidade: "alta",
      });
    }
  }
  if (e.acessos.length > 1) {
    perdas.push({
      campo: "acessos",
      oQueHavia: `${e.acessos.length} acessos (${e.acessos.map((a) => a.papel).join(", ")})`,
      motivo: "o motor só recebe um; os demais foram descartados",
      gravidade: "media",
    });
  }
  if (principal?.sugerido) {
    perdas.push({
      campo: `acessos[0].sugerido`,
      oQueHavia: "true — ninguém marcou o acesso, o Geo pôs o meio da testada de frente",
      motivo:
        "o motor não distingue acesso marcado de palpite; o traçado vai partir dali como se " +
        "fosse decisão do usuário. O contrato faz questão de carregar essa marca justamente " +
        "para não deixar o palpite calado",
      gravidade: "media",
    });
  }

  // ------------------------------------------------- restrições e atrações
  const restricoes: Elemento[] = [];
  const atracoes: Elemento[] = [];

  e.restricoes.forEach((r, i) => {
    const anel = anelDe(r.geometria);
    if (!anel) {
      perdas.push({
        campo: `restricoes[${i}] (${r.id})`,
        oQueHavia: `${r.tipo} "${r.nome}" como ${r.geometria.tipo}`,
        motivo:
          "o motor só entende restrição como polígono (`Elemento.poligono`); linha e ponto não " +
          "têm como entrar. Esta terra NÃO foi respeitada pelo traçado",
        gravidade: "alta",
      });
      return;
    }
    restricoes.push({
      id: r.id,
      rotulo: r.nome,
      papel: "restricao",
      poligono: anel,
      bloqueia: r.desconta,
      ima: imaDaRestricao(r.desconta),
    });
    if (r.baseLegal) {
      perdas.push({
        campo: `restricoes[${i}].baseLegal`,
        oQueHavia: r.baseLegal,
        motivo:
          "o `Elemento` do motor não tem campo de base legal; a restrição entra sem o " +
          "inciso que a sustenta. Não muda o desenho — muda o que se pode escrever no memorial",
        gravidade: "baixa",
      });
    }
    if (r.geometria.tipo === "poligono" && r.geometria.aneis.length > 1) {
      perdas.push({
        campo: `restricoes[${i}].geometria.aneis`,
        oQueHavia: `${r.geometria.aneis.length} anéis (o externo mais ${r.geometria.aneis.length - 1} furo(s))`,
        motivo: "o motor recebe um anel simples por elemento; os furos foram descartados",
        gravidade: "media",
      });
    }
  });

  e.atracoes.forEach((a, i) => {
    const anel = anelDe(a.geometria);
    if (!anel) {
      perdas.push({
        campo: `atracoes[${i}] (${a.id})`,
        oQueHavia: `${a.tipo} "${a.nome}" como ${a.geometria.tipo}`,
        // ── Este motivo era FALSO desde sempre, e o LAB-30 o corrigiu ─────────
        //
        // Ele dizia que a atração como LINHA *"é justamente a que não entra"*. O
        // motor tem `viaManual` — coluna vertebral desenhada à mão — desde sempre;
        // o que não entrava era por esta ponte não a preencher. E o Lab publicou
        // duas vezes que o MOTOR ignorava via desenhada (D119).
        //
        // Agora a linha desenhada entra como coluna vertebral, e esta perda vale
        // para o que de fato não tem destino: atração como linha que **não** é via
        // desenhada (ponto de interesse, outra), e a segunda linha desenhada em
        // diante — o motor tem uma coluna vertebral só.
        motivo:
          "o motor recebe atração como POLÍGONO (ímã) e **uma** via desenhada como linha " +
          "(`viaManual`, a coluna vertebral). Esta linha não é nenhuma das duas coisas: ou " +
          "não é via desenhada, ou é a segunda em diante — e aí não há onde entrar",
        gravidade: "alta",
      });
      return;
    }
    atracoes.push({
      id: a.id,
      rotulo: a.nome,
      papel: "atracao",
      poligono: anel,
      bloqueia: false,
      ima: 2,
    });
  });

  // -------------------------------------------------------------- parâmetros
  //
  // As faixas do motor são intervalos {min,max}; os parâmetros do contrato são
  // valores. Onde o contrato dá mínimo e máximo (área do lote), a faixa nasce
  // deles; onde dá só um valor, a faixa é degenerada (min = max).
  const p = e.parametros;
  const padroes: Partial<Record<string, Faixa>> = {};
  const faixa = (min: number, max: number): Faixa => ({ min, max });

  padroes["areaLote"] = faixa(p.areaMinLote_m2, p.areaMaxLote_m2);
  // A testada tem mínimo no contrato e nenhum máximo. O teto vem da geometria:
  // um lote de área máxima com a testada mínima já é o mais profundo admissível;
  // o mais largo é o que usa toda a área com a profundidade mínima razoável.
  // Sem um teto o motor sortearia testadas absurdas, então ele sai do alvo.
  const testadaAlvo = Math.max(p.testadaMinLote_m, Math.sqrt(p.areaAlvoLote_m2 / 2));
  padroes["testada"] = faixa(p.testadaMinLote_m, Math.max(p.testadaMinLote_m, testadaAlvo));
  if (p.caixaPrincipal_m != null) padroes["caixaPrincipal"] = faixa(p.caixaPrincipal_m, p.caixaPrincipal_m);
  if (p.caixaSecundaria_m != null) padroes["caixaSecundaria"] = faixa(p.caixaSecundaria_m, p.caixaSecundaria_m);
  if (p.calcada_m != null) {
    padroes["calcadaPrincipal"] = faixa(p.calcada_m, p.calcada_m);
    padroes["calcadaSecundaria"] = faixa(p.calcada_m, p.calcada_m);
  }
  if (p.faceQuadraMax_m != null) padroes["comprimentoQuadra"] = faixa(p.faceQuadraMax_m, p.faceQuadraMax_m);
  if (p.pctLazer != null) padroes["lazerPct"] = faixa(p.pctLazer, p.pctLazer);
  if (p.pctAPP != null) padroes["appPct"] = faixa(p.pctAPP, p.pctAPP);

  if (p.pctAreaPublica != null) {
    perdas.push({
      campo: "parametros.pctAreaPublica",
      oQueHavia: `${p.pctAreaPublica} %`,
      motivo:
        "o motor tem `doacaoPct` (doação) e `lazerPct` (lazer) separados e nenhum agregado de " +
        "área pública; somar os dois aqui inventaria uma repartição que o contrato não deu",
      gravidade: "media",
    });
  }
  if (p.rampaMaxima_pct != null) {
    perdas.push({
      campo: "parametros.rampaMaxima_pct",
      oQueHavia: `${p.rampaMaxima_pct} %`,
      motivo:
        "o motor não limita rampa de via — ele não calcula greide. A conferência de rampa fica " +
        "inteiramente com o Validator",
      gravidade: "alta",
    });
  }
  if (p.caixaViariaMin_m != null && p.caixaPrincipal_m != null && p.caixaSecundaria_m != null) {
    // Informativo: as duas caixas explícitas já cobrem o mínimo. Só vira perda
    // se o mínimo for MAIOR que alguma delas — aí o contrato se contradiz e
    // quem tem de saber é quem lê o relatório.
    const menor = Math.min(p.caixaPrincipal_m, p.caixaSecundaria_m);
    if (p.caixaViariaMin_m > menor) {
      perdas.push({
        campo: "parametros.caixaViariaMin_m",
        oQueHavia: `${p.caixaViariaMin_m} m, maior que a menor caixa declarada (${menor} m)`,
        motivo:
          "o motor usa as caixas explícitas e não tem um piso independente; o mínimo do " +
          "contrato ficou sem quem o cobre",
        gravidade: "media",
      });
    }
  }

  // --------------------------------------------------------------- o terreno
  const terreno: Terreno = {
    nome: e.projeto.nome ?? e.gleba.nome ?? "gleba sem nome",
    perimetro,
    acesso,
    restricoes,
    atracoes,
    legais: {
      loteMinimo_m2: p.areaMinLote_m2,
      testadaMinima_m: p.testadaMinLote_m,
    },
    padroes: padroes as Terreno["padroes"],
    origemPadroes: Object.fromEntries(
      Object.keys(padroes).map((k) => [k, "arquivo" as const]),
    ) as Terreno["origemPadroes"],
    // A área do ANEL, não a declarada. O contrato traz `gleba.area_m2`, e a
    // ponte do Generate é explícita: a geometria é a verdade, a declaração é
    // conferência. Divergência vira aviso, nunca correção silenciosa.
    areaBruta_m2: area(perimetro),
    origem: `contrato de motor v1 · ${e.projeto.id ?? "sem id"}`,
  };
  const relevo = relevoDoContrato(e, perdas);
  if (relevo) terreno.relevo = relevo;

  if (Math.abs(terreno.areaBruta_m2 - e.gleba.area_m2) > e.gleba.area_m2 * 0.001) {
    perdas.push({
      campo: "gleba.area_m2",
      oQueHavia: `${e.gleba.area_m2.toFixed(2)} m² declarados`,
      motivo:
        `a área do anel dá ${terreno.areaBruta_m2.toFixed(2)} m². A geometria é a verdade e foi ` +
        "ela que seguiu; a declaração fica como conferência",
      gravidade: "baixa",
    });
  }

  // ---------------------------------------------------- o que não tem destino
  if (e.geo != null) {
    perdas.push({
      campo: "geo",
      oQueHavia: "o documento `archilly-terreno` inteiro do Archilly Geo",
      motivo:
        "o motor tem um leitor próprio de `archilly-terreno` (`importarTerreno`), mas a " +
        "entrada dele por esta ponte é o contrato, não o documento do Geo. Matrícula, CAR, " +
        "INCRA, zoneamento e testadas com papel ficam de fora do desenho",
      gravidade: "media",
    });
  }
  if (e.regiaoNormativa && e.regiaoNormativa !== "BR") {
    perdas.push({
      campo: "regiaoNormativa",
      oQueHavia: e.regiaoNormativa,
      motivo: "o motor não muda de norma por região",
      gravidade: "baixa",
    });
  }

  // ───────────────────────── a coluna vertebral desenhada (LAB-30) ──────────
  //
  // O v2 dá tipo próprio à via desenhada, e aí esta ida a lê sozinha; no v1 ela
  // vem como `via_existente`, indistinguível da testada de frente, e quem chama
  // passa pronto (ver a opção). **O motor só tem UMA coluna vertebral**: entre
  // várias desenhadas vai a mais longa, e as outras saem como perda declarada —
  // escolher a mais longa é escolha do Lab, e por isso vai dita.
  const desenhadasDoV2 = (e.atracoes ?? [])
    .filter((a) => a.tipo === "via_desenhada" && a.geometria.tipo === "linha")
    .map((a) => ("pontos" in a.geometria ? a.geometria.pontos : []).map(paraPonto))
    .filter((l) => l.length >= 2);
  const candidatas = opcoes.viaManual ? [opcoes.viaManual] : desenhadasDoV2;
  const comprimento = (l: Ponto[]) =>
    l.reduce((s, p, i) => (i === 0 ? 0 : s + Math.hypot(p.x - l[i - 1]!.x, p.y - l[i - 1]!.y)), 0);
  const viaManual = candidatas.length
    ? [...candidatas].sort((a, b) => comprimento(b) - comprimento(a))[0]!
    : null;
  if (candidatas.length > 1) {
    perdas.push({
      campo: "atracoes (via desenhada)",
      oQueHavia: `${candidatas.length} vias desenhadas`,
      motivo:
        "o motor tem UMA coluna vertebral (`viaManual: Ponto[] | null`). Entrou a mais longa " +
        `(${comprimento(viaManual!).toFixed(1)} m); as outras ${candidatas.length - 1} não têm ` +
        "onde entrar. A escolha pela mais longa é do Lab, não do motor",
      gravidade: "media",
    });
  }

  const entrada: EntradaMotor = {
    terreno,
    semente: opcoes.semente,
    ...(opcoes.variantes != null ? { variantes: opcoes.variantes } : {}),
    ...(opcoes.formatos ? { formatos: opcoes.formatos } : {}),
    ...(viaManual ? { viaManual } : {}),
    // ── A testada de frente, finalmente entregue (LAB-37) ──────────────────
    ...(opcoes.facesLoteamento?.length ? { facesLoteamento: opcoes.facesLoteamento } : {}),
  };

  return { entrada, perdas };
}
