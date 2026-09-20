/**
 * A TRAVESSIA DESENHADA À MÃO — a D69 aplicada, e o que dela NÃO é aplicável. (LAB-17)
 *
 * # A regra, como o Jonny a deu
 *
 * > Via desenhada à mão pelo usuário é **intenção explícita** e vale sempre como
 * > atração — atravessa a APP mesmo sem cumprir o critério dos 3× / 1,5 km,
 * > inclusive quando desenhada sozinha sobre a APP. Exceções que não caem:
 * > **nascente nunca** (raio de 50 m intocável), e a travessia continua sendo a
 * > **mais curta e perpendicular possível ao curso** naquele ponto. Na tela,
 * > marcada *"desenhada por você — exige licença ambiental"*, e **item de custo**
 * > (ponte ou bueiro) na saída para o Orçamento.
 *
 * # O que deste arquivo É aplicável hoje, e o que NÃO É
 *
 * Duas metades da regra dependem de dado que **o contrato de motor v1 não
 * carrega**, e nenhuma delas se resolve com aproximação inventada:
 *
 * | parte da D69 | aplicável? | por quê |
 * |---|---|---|
 * | a via desenhada atravessa a APP | **sim** | a APP chega como polígono, e isso basta para achar a travessia |
 * | a travessia é a **mais curta** | **sim** | mede-se o trecho dentro da APP |
 * | marcada *"desenhada por você — exige licença ambiental"* | **sim** | é rótulo, e sai na saída |
 * | **item de custo** (ponte ou bueiro) | **sim** | comprimento e largura saem; o preço é do Orçamento |
 * | **perpendicular ao curso** | **NÃO** | o curso chega como **polígono de APP**, não como linha. Sem o eixo, "perpendicular" não tem a quê |
 * | **nascente: raio de 50 m intocável** | **NÃO** | o contrato v1 achata `app_nascente` em `app_hidrica`. A nascente chega **indistinguível** de qualquer APP, e o ponto dela não chega |
 *
 * **As duas não aplicáveis saem declaradas, não silenciadas** — e sem
 * aproximação. Chutar "a APP mais redonda deve ser a nascente" ou "o eixo é o
 * esqueleto do polígono" seria inventar dado, que é o que o CLAUDE.md §4 proíbe,
 * e seria pior que não fazer: daria um número em que alguém confiaria.
 *
 * Os dois pedidos ao Generate estão no §10.5 do
 * `CONTRATO_MOTOR_UNIFICADO_v1.md`.
 */
import type { EntradaMinima } from "./gleba-v1.ts";
import type { P } from "./motores/comum.ts";

/** O raio da nascente, em metros. Escrito, e hoje não aplicável — ver acima. */
export const RAIO_DA_NASCENTE_M = 50;

/** O que a D69 manda escrever ao lado da travessia, na tela. */
export const MARCA_DA_TRAVESSIA = "desenhada por você — exige licença ambiental";

/** Um trecho de via desenhada que cai dentro de uma restrição. */
export interface TravessiaDesenhada {
  /** A via desenhada de onde ele saiu. */
  viaId: string;
  /** A restrição atravessada, como ela chegou na entrada. */
  restricaoId: string;
  restricaoTipo: string;
  restricaoNome: string;
  /** Onde entra e onde sai. */
  entrada: P;
  saida: P;
  /** O comprimento do trecho dentro da restrição, em metros. */
  comprimento_m: number;
  /** A marca da tela. Sempre a mesma frase — ver `MARCA_DA_TRAVESSIA`. */
  marca: string;
}

/** O que não pôde ser verificado, e por quê. Nunca silenciado. */
export interface NaoVerificado {
  regra: string;
  porQue: string;
  oQueFaltaNoContrato: string;
}

/** Um item de custo para o Orçamento. */
export interface ItemDeCusto {
  viaId: string;
  restricaoId: string;
  /** `ponte` ou `bueiro` é decisão de hidráulica; aqui sai `null`. */
  obra: null;
  comprimento_m: number;
  largura_m: number | null;
  marca: string;
  /**
   * Por que `obra` sai `null`, e por que isso é a resposta certa.
   *
   * Escolher entre ponte e bueiro depende da vazão do curso, e a vazão não está
   * em lugar nenhum do que chega até aqui. Chutar pelo comprimento — *"curto é
   * bueiro, longo é ponte"* — daria um número em que o Orçamento confiaria.
   * `null` é "não medido", e zero seria uma medição (D23).
   */
  porQueSemObra: string;
}

/** O resultado da aplicação da D69 a uma gleba. */
export interface AplicacaoDaD69 {
  travessias: TravessiaDesenhada[];
  itensDeCusto: ItemDeCusto[];
  naoVerificado: NaoVerificado[];
}

/** Ponto dentro de um anel, por cruzamentos de raio. */
function dentro(p: P, anel: P[]): boolean {
  let d = false;
  for (let i = 0, j = anel.length - 1; i < anel.length; j = i++) {
    const a = anel[i]!;
    const b = anel[j]!;
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) d = !d;
  }
  return d;
}

/**
 * Acha onde as vias desenhadas atravessam as restrições, e aplica a D69.
 *
 * `largura_m` é a caixa da via, para o item de custo. Vem dos parâmetros da
 * gleba; quando não houver, sai `null` — **nunca um valor de fábrica**, porque
 * largura inventada vira preço inventado no Orçamento.
 */
export function aplicarD69(
  entrada: EntradaMinima,
  viasDesenhadas: { id: string; pontos: P[] }[],
  largura_m: number | null,
): AplicacaoDaD69 {
  const PASSO_M = 1;
  const travessias: TravessiaDesenhada[] = [];

  for (const via of viasDesenhadas) {
    for (const r of entrada.restricoes) {
      const anel = r.geometria.aneis?.[0];
      if (!anel || anel.length < 3) continue;

      // Caminha a via de metro em metro e recorta os trechos que caem dentro.
      let entrou: P | null = null;
      let ultimo: P | null = null;
      let comprimento = 0;

      const fechar = () => {
        if (entrou && ultimo && comprimento > 0) {
          travessias.push({
            viaId: via.id,
            restricaoId: r.id,
            restricaoTipo: r.tipo,
            restricaoNome: r.nome,
            entrada: entrou,
            saida: ultimo,
            comprimento_m: comprimento,
            marca: MARCA_DA_TRAVESSIA,
          });
        }
        entrou = null;
        ultimo = null;
        comprimento = 0;
      };

      for (let i = 1; i < via.pontos.length; i++) {
        const a = via.pontos[i - 1]!;
        const b = via.pontos[i]!;
        const d = Math.hypot(b.x - a.x, b.y - a.y);
        const n = Math.max(1, Math.ceil(d / PASSO_M));
        for (let k = 0; k <= n; k++) {
          const t = k / n;
          const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
          if (dentro(p, anel)) {
            if (!entrou) entrou = p;
            else comprimento += Math.hypot(p.x - ultimo!.x, p.y - ultimo!.y);
            ultimo = p;
          } else if (entrou) {
            fechar();
          }
        }
      }
      fechar();
    }
  }

  const itensDeCusto: ItemDeCusto[] = travessias.map((t) => ({
    viaId: t.viaId,
    restricaoId: t.restricaoId,
    obra: null,
    comprimento_m: t.comprimento_m,
    largura_m,
    marca: t.marca,
    porQueSemObra:
      "escolher entre ponte e bueiro depende da vazão do curso, que não chega no contrato; " +
      "chutar pelo comprimento daria um número em que o Orçamento confiaria",
  }));

  return {
    travessias,
    itensDeCusto,
    naoVerificado: naoVerificavelHoje(entrada),
  };
}

/**
 * As duas metades da D69 que hoje **não podem ser verificadas**, com a razão.
 *
 * Elas saem **sempre** que há travessia — não só quando dá problema. Uma regra
 * que só aparece quando é violada é uma regra que o leitor supõe cumprida.
 */
export function naoVerificavelHoje(entrada: EntradaMinima): NaoVerificado[] {
  const temHidrica = entrada.restricoes.some((r) => r.tipo === "app_hidrica" || r.tipo === "curso_dagua");
  const fora: NaoVerificado[] = [];

  fora.push({
    regra: `nascente: raio de ${RAIO_DA_NASCENTE_M} m intocável, nem o desenho a vence`,
    porQue:
      "a nascente chega INDISTINGUÍVEL de qualquer outra APP hídrica, e o ponto dela não chega — " +
      "não há de onde medir os 50 m",
    oQueFaltaNoContrato:
      "`app_nascente` como tipo próprio no enum de `restricoes`, e a geometria de PONTO da nascente. " +
      "Existe no `archilly-terreno` e no importador do Generate; o contrato v1 a achata em `app_hidrica`",
  });

  fora.push({
    regra: "a travessia é a mais curta e PERPENDICULAR ao curso naquele ponto",
    porQue: temHidrica
      ? "o curso d'água chega como POLÍGONO de APP, não como linha — sem o eixo, 'perpendicular' não tem a quê"
      : "não há restrição hídrica nesta gleba, e mesmo que houvesse o eixo do curso não viaja no contrato",
    oQueFaltaNoContrato: "a geometria de LINHA do curso d'água, além do polígono da APP",
  });

  return fora;
}
