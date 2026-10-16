/**
 * AS PASSAGENS DOS QUATRO CAMPOS DE `legais` — a medição da D226. (LAB-93, item 026)
 *
 * # A pergunta, e por que ela precisa de CINCO passagens e não de duas
 *
 * O item 026 pede *"as duas passagens, com e sem, e o antes e o depois de cada
 * grandeza que se mover"*. Duas passagens respondem **se** algo se move. Elas não
 * respondem **o quê** move — e foi exatamente aí que a D226 errou: entregou três
 * campos de uma vez, viu a rampa publicada cair de 21,63 % para 17,92 % e escreveu
 * que *"o motor ganhou a capacidade de limitar rampa"*.
 *
 * > **Campo com o nome parecido é o suspeito errado.** Para dizer de quem é um
 * > delta, entregue **um por vez**.
 *
 * Então são cinco: `sem`, `so-caixa`, `so-face`, `so-rampa` e `os-tres`. A quarta
 * premissa não entra em passagem nenhuma porque **não tem de onde vir** — o
 * `ParametrosV1` não publica `declividadeMaximaLote_pct`.
 *
 * # O instrumento que diz "o desenho mudou", e ele não é contagem
 *
 * Contar lotes responde *"mudou o número"*, não *"mudou o desenho"* — dois desenhos
 * diferentes podem dar o mesmo total. Quem responde é a **assinatura da rodada**, que
 * é do próprio motor: *"a impressão digital do desenho"*. Assinatura igual é desenho
 * igual, e aí qualquer diferença de número publicado seria defeito da ponte.
 *
 * Por isso cada passagem carrega as duas coisas, e a prova as publica juntas: a
 * assinatura decide **se**, as grandezas dizem **quanto**.
 */
import type { EntradaMinima } from "./gleba-v1.ts";
import { opcoesDaEsteiraDele } from "./motores/testfit.ts";
import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import type { EntradaV1, SaidaV1 } from "../../testfit/adapter/src/contrato-v1.ts";
import { impressao } from "../../testfit/adapter/src/motor.ts";
import {
  OS_QUATRO,
  type CampoLegal,
  type QuaisEntregar,
} from "../../testfit/adapter/src/legais-do-contrato.ts";

/** O nome de cada passagem, em vocabulário fechado. */
export const AS_PASSAGENS = ["sem", "so-caixa", "so-face", "so-rampa", "os-tres"] as const;
export type Passagem = (typeof AS_PASSAGENS)[number];

/** O que cada passagem entrega — e a lista é a mesma que a ida recebe. */
export const O_QUE_CADA_PASSAGEM_ENTREGA: Record<Passagem, QuaisEntregar> = {
  sem: false,
  "so-caixa": ["caixaViariaMinima_m"],
  "so-face": ["faceQuadraMaxima_m"],
  "so-rampa": ["rampaMaximaDeVia_pct"],
  "os-tres": ["caixaViariaMinima_m", "faceQuadraMaxima_m", "rampaMaximaDeVia_pct"],
};

/** O que uma passagem publica, e é isto que se compara com o `antes`. */
export interface MedidaDaPassagem {
  passagem: Passagem;
  /**
   * A impressão digital da RODADA, do próprio motor — e ela inclui os avisos.
   *
   * Fica publicada porque é o que a esteira publica, mas **não** é o instrumento
   * desta medição: ver `assinaturaDaGeometria`.
   */
  assinaturaDaRodada: string;
  /** A impressão digital só da GEOMETRIA publicada — o instrumento certo. */
  assinaturaDaGeometria: string | null;
  /** A variante que o ranking DELE escolheu. */
  formato: string | null;
  notaDoMotor: number | null;
  lotes: number | null;
  vias: number | null;
  quadras: number | null;
  /**
   * A PIOR rampa publicada em `vias[].rampaMaxima_pct`, em porcento.
   *
   * `null` quando nenhuma via publica rampa — e `null` aqui é **não medido**, nunca
   * zero (D23): gleba sem cota não tem rampa a medir.
   */
  piorRampaPublicada_pct: number | null;
  violacoes: number | null;
  aceito: boolean | null;
  /** Quantos avisos o motor emitiu — é por aqui que a `caixaViariaMinima_m` aparece. */
  avisosDoMotor: number;
  /** Os avisos que esta passagem tem e a passagem `sem` não tinha. */
  avisosQueNasceram: string[];
  /** Quantas perdas a ida declarou. */
  perdasNaIda: number;
}

/**
 * O QUE HAVIA PARA ENTREGAR nesta gleba, campo por campo.
 *
 * Existe porque sem isto a medição mente por omissão: uma passagem que entregou
 * `null` e não moveu nada **não é prova de que o campo não move nada** — é prova de
 * que não havia o que entregar. *Antes de dizer que um número não mudou, confira se
 * ele existe* (§6).
 */
export function oQueHaviaParaEntregar(
  entrada: EntradaMinima,
): Record<CampoLegal["campo"], number | null> {
  const p = entrada.parametros as unknown as Record<string, number | null | undefined>;
  const v = (c: CampoLegal): number | null => {
    if (!c.oContratoPublica || c.doContrato === null) return null;
    const x = p[c.doContrato];
    return typeof x === "number" && Number.isFinite(x) ? x : null;
  };
  return Object.fromEntries(OS_QUATRO.map((c) => [c.campo, v(c)])) as Record<
    CampoLegal["campo"],
    number | null
  >;
}

/** O resultado de uma gleba: a passagem `sem` e o que cada campo moveu. */
export interface MedidaDaGleba {
  gleba: string;
  semente: number;
  /** O valor que o contrato desta gleba traz para cada um dos quatro campos. */
  haviaParaEntregar: Record<CampoLegal["campo"], number | null>;
  passagens: MedidaDaPassagem[];
  /** Quais passagens têm GEOMETRIA diferente da `sem` — essas mudaram o desenho. */
  mudaramODesenho: Passagem[];
  /**
   * Quais mudaram a assinatura da RODADA e **não** a geometria.
   *
   * É a lista que separa *"o motor passou a avisar"* de *"o traçado saiu outro"* — e
   * é a lista que faltava quando a D226 atribuiu um delta ao campo errado.
   */
  soMudaramAVISO: Passagem[];
}

/**
 * A IMPRESSÃO DIGITAL DA GEOMETRIA PUBLICADA — e ela existe porque a da rodada MENTE
 * para esta pergunta.
 *
 * A `assinaturaDaRodada` que a esteira publica é `impressao(plano)` do próprio motor,
 * e o `Plano` dele carrega `avisos`, `metricas`, `nota` e `indicadores` ao lado da
 * geometria. **Então ela muda quando o motor só passou a AVISAR** — foi o que
 * aconteceu na primeira passada desta medição: `so-caixa` mudou a assinatura em
 * `ensaio-com-via` com lotes, vias, quadras e pior rampa **idênticos**, e eu estava a
 * um passo de publicar que entregar a caixa viária mínima muda o desenho.
 *
 * > **Assinatura de RODADA não é assinatura de DESENHO.** Impressão digital só
 * > responde à pergunta de quem sabe o que entrou nela.
 *
 * Esta projeta a SAÍDA no que é geometria — eixo e caixa de via, anel de quadra,
 * anel de lote — e usa a `impressao` DO MOTOR, não uma régua minha: o milímetro, a
 * ordenação de chaves e o −0 já são decisões dele, e refazê-las aqui daria dois
 * números para a mesma grandeza (D116).
 */
export function assinaturaDaGeometria(saida: SaidaV1 | null): string | null {
  if (!saida) return null;
  return impressao({
    vias: saida.vias.map((v) => ({ id: v.id, h: v.hierarquia, w: v.largura_m, p: v.pontos })),
    quadras: saida.quadras.map((q) => ({ id: q.id, p: q.pontos })),
    lotes: saida.lotes.map((l) => ({ id: l.id, p: l.pontos })),
    areas: saida.areasEspeciais.map((a) => ({ id: a.id, t: a.tipo, p: a.pontos })),
  });
}

const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

/** A pior rampa publicada na SAÍDA — a grandeza que a D226 citou. */
export function piorRampaPublicada(saida: unknown): number | null {
  const vias = (saida as { vias?: { rampaMaxima_pct?: number | null }[] } | null)?.vias ?? [];
  const medidas = vias.map((v) => num(v.rampaMaxima_pct)).filter((v): v is number => v !== null);
  return medidas.length ? Math.max(...medidas) : null;
}

/**
 * Roda UMA passagem, pela montagem desta casa — nunca por uma montagem própria.
 *
 * A escolha da variante continua sendo do motor (melhor nota DELE entre as que o
 * esquema aceitou), como em toda medição desta esteira desde o LAB-13: escolher aqui
 * seria o Lab decidindo pelo motor no meio de uma medição sobre premissa.
 */
export function rodarPassagem(
  entrada: EntradaMinima,
  semente: number,
  passagem: Passagem,
  avisosDaSem?: readonly string[],
): { medida: MedidaDaPassagem; avisos: string[] } {
  const r = rodarEsteira(entrada as unknown as EntradaV1, {
    ...opcoesDaEsteiraDele(entrada, semente),
    entregarOsLegais: O_QUE_CADA_PASSAGEM_ENTREGA[passagem],
  });
  const julgadas = r.variantes.filter((v) => v.relatorio);
  const escolhida = julgadas.sort((a, b) => a.posicaoNoMotor - b.posicaoNoMotor)[0] ?? null;
  const saida = escolhida?.saida ?? null;
  const antes = new Set(avisosDaSem ?? []);
  return {
    avisos: [...r.avisosDoMotor],
    medida: {
      passagem,
      assinaturaDaRodada: r.assinaturaDaRodada,
      assinaturaDaGeometria: assinaturaDaGeometria(saida),
      formato: escolhida?.formato ?? null,
      notaDoMotor: escolhida ? escolhida.notaDoMotor : null,
      lotes: saida ? ((saida as { lotes?: unknown[] }).lotes?.length ?? null) : null,
      vias: saida ? ((saida as { vias?: unknown[] }).vias?.length ?? null) : null,
      quadras: saida ? ((saida as { quadras?: unknown[] }).quadras?.length ?? null) : null,
      piorRampaPublicada_pct: piorRampaPublicada(saida),
      violacoes: escolhida?.relatorio ? escolhida.relatorio.validator.violacoes : null,
      aceito: escolhida?.relatorio ? escolhida.relatorio.aceito : null,
      avisosDoMotor: r.avisosDoMotor.length,
      avisosQueNasceram: avisosDaSem ? r.avisosDoMotor.filter((a) => !antes.has(a)) : [],
      perdasNaIda: r.perdasNaIda.length,
    },
  };
}

/** As cinco passagens de uma gleba, com a `sem` primeiro — ela é a referência. */
export function medirAGleba(
  entrada: EntradaMinima,
  gleba: string,
  semente: number,
): MedidaDaGleba {
  const sem = rodarPassagem(entrada, semente, "sem");
  const resto = AS_PASSAGENS.filter((p) => p !== "sem").map(
    (p) => rodarPassagem(entrada, semente, p, sem.avisos).medida,
  );
  const passagens = [sem.medida, ...resto];
  return {
    gleba,
    semente,
    haviaParaEntregar: oQueHaviaParaEntregar(entrada),
    passagens,
    mudaramODesenho: resto
      .filter((p) => p.assinaturaDaGeometria !== sem.medida.assinaturaDaGeometria)
      .map((p) => p.passagem),
    soMudaramAVISO: resto
      .filter(
        (p) =>
          p.assinaturaDaGeometria === sem.medida.assinaturaDaGeometria &&
          p.assinaturaDaRodada !== sem.medida.assinaturaDaRodada,
      )
      .map((p) => p.passagem),
  };
}

/** Uma grandeza que se moveu numa gleba, com o antes e o depois. */
export interface Delta {
  gleba: string;
  passagem: Passagem;
  grandeza: string;
  antes: number | string | null;
  depois: number | string | null;
}

/** As grandezas comparadas, e a lista é fechada de propósito. */
export const AS_GRANDEZAS = [
  "formato",
  "notaDoMotor",
  "lotes",
  "vias",
  "quadras",
  "piorRampaPublicada_pct",
  "violacoes",
  "avisosDoMotor",
  "perdasNaIda",
] as const;

/** O antes e o depois de cada grandeza que se moveu — e só as que se moveram. */
export function osDeltas(m: MedidaDaGleba): Delta[] {
  const sem = m.passagens.find((p) => p.passagem === "sem")!;
  const deltas: Delta[] = [];
  for (const p of m.passagens) {
    if (p.passagem === "sem") continue;
    for (const g of AS_GRANDEZAS) {
      const a = sem[g] as number | string | null;
      const d = p[g] as number | string | null;
      if (a !== d) deltas.push({ gleba: m.gleba, passagem: p.passagem, grandeza: g, antes: a, depois: d });
    }
  }
  return deltas;
}

/** O que a medição respondeu sobre um campo — e "não medido" é uma das respostas. */
export type VeredictoDoCampo =
  /** Entregue com valor em pelo menos uma gleba, e a geometria publicada mudou. */
  | "entregue-mudou-o-desenho"
  /** Entregue com valor, geometria idêntica, e o motor passou a AVISAR. */
  | "entregue-so-passou-a-avisar"
  /** Entregue com valor e nada se moveu — nem geometria, nem aviso. */
  | "entregue-nada-se-moveu"
  /** Nenhuma gleba declara o campo: a passagem entregou `null` e NÃO MEDIU nada. */
  | "nao-havia-o-que-entregar"
  /** O contrato não publica a origem: não há passagem possível. */
  | "o-contrato-nao-publica";

export interface ContaDoCampo {
  campo: CampoLegal["campo"];
  /** A passagem que entrega só este campo — `null` para o que não tem passagem. */
  passagem: Passagem | null;
  /** Em quantas glebas o contrato traz valor para ele. */
  glebasComValor: number;
  mudaramODesenho: number;
  soMudaramAviso: number;
  veredicto: VeredictoDoCampo;
  /** O que a lista `OS_QUATRO` declarou ANTES de rodar — a hipótese. */
  aListaDeclarava: CampoLegal["oQueOMotorFaz"];
}

/** A passagem que entrega só aquele campo, quando existe. */
export const A_PASSAGEM_DE: Partial<Record<CampoLegal["campo"], Passagem>> = {
  caixaViariaMinima_m: "so-caixa",
  faceQuadraMaxima_m: "so-face",
  rampaMaximaDeVia_pct: "so-rampa",
};

/**
 * A CONTA que responde o item, campo por campo.
 *
 * Ela é **medida**, não lida do `OS_QUATRO`: a lista declara o que eu li no fonte do
 * motor, e esta função declara o que a esteira **viu acontecer**. Quando as duas
 * discordarem, quem manda é esta — *a declaração é a hipótese; a rodada é o dado.*
 *
 * E ela tem o veredicto `nao-havia-o-que-entregar` porque, medido, é o caso de um dos
 * três: `rampaMaxima_pct` vem `null` em 8 das 8 glebas. *Passagem que entregou nada e
 * não moveu nada não mediu o campo — mediu a gleba.*
 */
export function aConta(medidas: readonly MedidaDaGleba[]): {
  glebas: number;
  porCampo: ContaDoCampo[];
} {
  const porCampo = OS_QUATRO.map((c): ContaDoCampo => {
    const passagem = A_PASSAGEM_DE[c.campo] ?? null;
    const glebasComValor = medidas.filter((m) => m.haviaParaEntregar[c.campo] !== null).length;
    const mudaramODesenho = passagem
      ? medidas.filter((m) => m.mudaramODesenho.includes(passagem)).length
      : 0;
    const soMudaramAviso = passagem
      ? medidas.filter((m) => m.soMudaramAVISO.includes(passagem)).length
      : 0;
    const veredicto: VeredictoDoCampo = !c.oContratoPublica
      ? "o-contrato-nao-publica"
      : glebasComValor === 0
        ? "nao-havia-o-que-entregar"
        : mudaramODesenho > 0
          ? "entregue-mudou-o-desenho"
          : soMudaramAviso > 0
            ? "entregue-so-passou-a-avisar"
            : "entregue-nada-se-moveu";
    return {
      campo: c.campo,
      passagem,
      glebasComValor,
      mudaramODesenho,
      soMudaramAviso,
      veredicto,
      aListaDeclarava: c.oQueOMotorFaz,
    };
  });
  return { glebas: medidas.length, porCampo };
}
