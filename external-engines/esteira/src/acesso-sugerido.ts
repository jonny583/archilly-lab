/**
 * O ACESSO SUGERIDO — as cinco regras que o Jonny ditou. (LAB-77, item 010 + adendo)
 *
 * # O adendo mudou a natureza do item, e a mudança é esta
 *
 * O item 010 pedia *varrer o perímetro a passo fixo* e chamar isso de universo de posições. O
 * adendo do Jonny diz, nas palavras dele, que isso está **errado**:
 *
 * > *"Verificar se é uma divisa que tem rua de acesso. Se não tem, não pode propor acesso vindo
 * > de muro que faz divisa com outro terreno."*
 *
 * Propor acesso por cima da divisa do vizinho é **o pior tipo de sugestão: plausível e
 * impossível**. Então o universo deixa de ser o perímetro e passa a ser *as faces que dão para
 * via pública, menos a faixa de esquina*.
 *
 * # E AS DUAS METADES DESSE UNIVERSO DEPENDEM DO MESMO DADO QUE FALTA
 *
 * A primeira metade é evidente: sem saber quais faces dão para rua, não há como filtrar as
 * faces. **A segunda não é, e foi o achado deste prompt:** *esquina* é onde duas **ruas** se
 * encontram, não onde o anel da gleba muda de direção. Um vértice entre uma face de rua e o muro
 * do vizinho **não é esquina** — é só um canto do terreno.
 *
 * > **A faixa de esquina não é geometria do anel: é geometria das RUAS.** Sem saber quais faces
 * > dão para via, nem o filtro das faces nem a faixa de esquina são calculáveis.
 *
 * **Medido nas sete glebas (não cinco — ver o relatório): ZERO declaram quais faces dão para via
 * pública.** Cinco das sete declaram `acessos: []`, vazio; as duas que declaram um acesso trazem
 * `segmento: null`, que é justamente o campo onde a face moraria.
 *
 * Por isso este módulo **recusa sugerir** quando o dado não está declarado, em vez de sugerir com
 * uma premissa inventada. *Não inventa dado* é a §4, e aqui inventar produziria exatamente a
 * sugestão que o Jonny chamou de impossível.
 *
 * # O que ele FAZ, então
 *
 * 1. guarda as cinco regras como **dado conferido por trava**, não como parágrafo;
 * 2. oferece a faixa de esquina como **parâmetro com padrão de fábrica** — 15 m no caso geral,
 *    25 m quando a gleba ocupa a quadra inteira —, porque a regra da família é *tudo tem padrão
 *    de fábrica que o usuário pode mudar; é como o sal na panela, a gosto*. O número **não mora
 *    dentro da lógica**;
 * 3. avalia posições devolvendo **`null` com o motivo**, nunca zero (D23): recusa não é queda;
 * 4. monta a sugestão **na frase dele** — *"se o acesso mudar para cá, você ganha N lotes"* —,
 *    com a posição do usuário **sempre em primeiro lugar e nunca contestada**;
 * 5. mede o **limite** do que a regra da esquina tira do perímetro, que é o que se pode medir
 *    sem o dado que falta: um teto e um piso, não um número único.
 */

import type { P } from "./motores/comum.ts";

/**
 * AS CINCO REGRAS, como o Jonny as ditou — dado, não parágrafo.
 *
 * Cada uma traz a marca que a liga ao texto do adendo, e a trava confere que a marca **está lá**.
 * Regra de família que mora só em prosa envelhece em silêncio (D104); e o §1-B já cobrou esta
 * casa por *"o que vai ao chat e não vai a um arquivo não existe amanhã"*.
 */
export const REGRAS_DO_ACESSO = [
  {
    n: 1,
    nome: "é SUGESTÃO, nunca ordem",
    marcaNoAdendo: "É SUGESTÃO, nunca ordem",
    oQueDecide:
      "o acesso que o usuário escolheu FICA. O produto é uma frase do tipo 'se o acesso mudar " +
      "para cá, você ganha tantos lotes', e ele decide",
    tipo: "produto",
  },
  {
    n: 2,
    nome: "posição sem rua não é posição",
    marcaNoAdendo: "Posição sem rua não é posição",
    oQueDecide:
      "o universo de posições é só o das faces que dão para via pública. Varrer o perímetro " +
      "inteiro a passo fixo está ERRADO",
    tipo: "universo",
  },
  {
    n: 3,
    nome: "acesso não se faz perto de esquina",
    marcaNoAdendo: "Acesso não se faz perto de esquina",
    oQueDecide:
      "faixa de esquina com padrão de 15 m, e 25 m quando a frente da gleba ocupa a quadra " +
      "inteira — e 'quadra', na palavra dele (item 029), é o TRECHO DE RUA entre dois " +
      "cruzamentos, não o quarteirão. Medida a partir do encontro das duas ruas, ao longo de " +
      "cada uma. São PADRÃO sugerido, não lei, e não moram dentro do código",
    tipo: "universo",
  },
  {
    n: 4,
    nome: "se ele escolher a esquina, deixa",
    marcaNoAdendo: "Se ele escolher a esquina, deixa",
    oQueDecide:
      "a regra vale para o que o aplicativo SUGERE, não para o que ele PERMITE. Nada de recusar " +
      "nem corrigir por cima",
    tipo: "produto",
  },
  {
    n: 5,
    nome: "o usuário escolhe de quais ruas aceita acesso",
    marcaNoAdendo: "O usuário escolhe de quais ruas aceita acesso",
    oQueDecide:
      "isto NÃO é do laboratório: é tela, e a tela do loteamento é do Generate. Fica registrado " +
      "aqui como origem da ideia e vai para lá como item de relatório",
    tipo: "do-vizinho",
  },
] as const;

/**
 * A FAIXA DE ESQUINA — padrão de fábrica, e o número não mora na lógica.
 *
 * As palavras dele: *"no mínimo uns 15 metros da esquina de distância. Depende muito do tamanho
 * do terreno — se o terreno pegar aquela quadra toda só pra ele, pode estabelecer que mínimo de
 * 25 metros da esquina como regra a sugerir ao usuário."*
 *
 * **Os dois são PADRÃO SUGERIDO, não lei.** Entram por parâmetro em toda função deste módulo, e
 * há trava que confere que nenhuma função os embute.
 */
export const PADRAO_DA_FAIXA_DE_ESQUINA_m = 15;

/**
 * O caso em que a frente da gleba ocupa a quadra inteira — e "quadra" é TRECHO DE RUA.
 *
 * **Respondido por ele em 12/10/2026 (item 029, a pendência 9-A):** *"não é quadra no sentido de
 * quarteirão […] e sim quadra no sentido de rua com 100 metros aproximadamente. Rua na frente do
 * condomínio de 50 a 200 metros é uma quadra"*. Então os 25 m valem quando a frente da gleba
 * ocupa o trecho da rua **de um cruzamento ao outro**; fora disso, os 15 m. A minha recomendação
 * de antes — *"rua em todos os lados"* — **caiu**: ela respondia à pergunta errada.
 */
export const FAIXA_QUANDO_OCUPA_A_QUADRA_m = 25;

/**
 * Por que o laboratório usa 15 e DIZ que usou — e por que a resposta do 9-A não muda isto HOJE.
 *
 * O adendo é explícito: *"se a medição não souber responder, ela usa 15 m e diz que usou, em vez
 * de adivinhar"*. Com a resposta dele, reconhecer o caso dos 25 m passou a ser **uma conta, e não
 * uma pergunta**: a frente ocupa o trecho inteiro da rua? Mas a conta precisa de saber **onde a
 * rua tem cruzamento**, fora da gleba — e nenhuma gleba desta casa diz sequer quais faces dão para
 * rua. Sem o dado, 15 m, declarado. *A pergunta saiu da mesa dele; o dado continua faltando no
 * arquivo.*
 */
export const FAIXA_EM_USO_m = PADRAO_DA_FAIXA_DE_ESQUINA_m;

/**
 * Por que uma posição foi recusada. Vocabulário FECHADO.
 *
 * **Recusa não é zero** (D23): posição recusada sai `null` com o motivo, senão a curva afunda
 * num lugar onde não houve queda nenhuma, só ausência de medição — e o item 010 avisa disso com
 * todas as letras.
 */
export const MOTIVOS_DE_RECUSA = [
  "sem-via-publica",
  "dentro-da-faixa-de-esquina",
  "o-motor-recusou",
  "nao-declarado-quais-faces-dao-para-via",
] as const;
export type MotivoDeRecusa = (typeof MOTIVOS_DE_RECUSA)[number];

/**
 * Os motivos que o vocabulário GUARDA e que nenhuma função produz HOJE — lista fechada, com o
 * motivo de cada um. (LAB-97, item 900)
 *
 * Até o LAB-97 o `"sem-via-publica"` estava nesta situação **sem estar declarado**: a palavra
 * existia, a regra 2 dizia o que ela decide, e nenhuma função a produzia — regra sem guarda, com
 * o nome no lugar da guarda. A trava agora cobra os DOIS sentidos: motivo fora desta lista tem de
 * ter quem o produza, e motivo nesta lista NÃO pode ter (senão a lista mente que está parado).
 */
export const MOTIVOS_RESERVADOS: readonly { motivo: MotivoDeRecusa; porque: string }[] = [
  {
    motivo: "o-motor-recusou",
    porque:
      "este módulo avalia posições SEM rodar motor (o LAB-77 não mede gleba no sentido do §7); " +
      "a recusa do motor só existe no dia em que a curva rodar o motor por posição",
  },
];

/**
 * Quais faces do anel dão para via pública, por índice de segmento.
 *
 * `null` é **"não declarado"**, e não "nenhuma": são coisas diferentes, e tratá-las igual seria
 * inventar a medição que falta. Nenhuma das sete glebas deste repositório declara isto hoje.
 */
export type FacesComVia = readonly number[] | null;

/** Comprimento de um segmento do anel. */
function comprimento(a: P, b: P): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** O perímetro do anel, em metros. */
export function perimetroDoAnel(anel: readonly P[]): number {
  let s = 0;
  for (let i = 0; i < anel.length; i++) {
    s += comprimento(anel[i]!, anel[(i + 1) % anel.length]!);
  }
  return s;
}

/**
 * AS ESQUINAS DE VIA — onde duas faces de RUA se encontram.
 *
 * É o coração do achado deste prompt. O vértice `i` do anel é o encontro do segmento `i-1` com o
 * segmento `i`; ele só é **esquina** quando **os dois** segmentos dão para via pública. Vértice
 * entre uma face de rua e o muro do vizinho é canto de terreno, não esquina — e a regra dos 15 m
 * é sobre esquina de rua.
 *
 * Devolve `null` quando as faces não foram declaradas: *não medido não é zero*. Se devolvesse
 * lista vazia, quem chamasse concluiria "não há esquina" e aplicaria a faixa a nada.
 */
export function esquinasDeVia(anel: readonly P[], faces: FacesComVia): number[] | null {
  if (faces === null) return null;
  if (anel.length < 3) return [];
  const comVia = new Set(faces);
  const esquinas: number[] = [];
  for (let i = 0; i < anel.length; i++) {
    const anterior = (i - 1 + anel.length) % anel.length;
    if (comVia.has(anterior) && comVia.has(i)) esquinas.push(i);
  }
  return esquinas;
}

/**
 * A RÉGUA DA FAIXA — ao longo da divisa, a partir do encontro das duas ruas. (item 029, 9-B)
 *
 * **Respondido por ele em 12/10/2026:** *"os 15 metros se medem da esquina — encontro de duas ruas
 * — e 15 metros deste encontro em sentido a cada rua. Nestes primeiros 15 metros não pode colocar
 * rua, simples assim."* É a recomendação *"andando pela divisa"* desta casa, **confirmada**. E o
 * motivo, que ele quis escrito: *"prefeitura nenhuma deixa acessar pela esquina"*.
 *
 * Até o item 029 a régua era **a linha reta até o vértice**, declarada como provisória. Ela foi
 * trocada, e a diferença **não é de arredondamento**: a reta **corta por dentro do terreno**. Numa
 * gleba estreita, um ponto da divisa do outro lado fica a 12,8 m da esquina em linha reta e a
 * 18 m andando — a reta o recusava, a régua dele o deixa. O caso está demonstrado nas travas.
 *
 * **Como se mede, por escrito, porque é escolha minha onde a resposta dele não alcança:**
 *
 * - o ponto é **projetado no anel** e vira uma posição de ARCO; as posições que esta casa avalia
 *   já estão sobre a divisa, e a projeção só existe para não recusar um ponto a milímetros dela;
 * - a distância é o **menor arco** entre o ponto e o vértice de esquina, nos dois sentidos — que é
 *   *"15 m deste encontro em sentido a cada rua"*;
 * - se a face de rua tem menos de 15 m, a caminhada **continua** pela face seguinte. É o lado
 *   conservador: a regra fala de 15 m de rua, e uma face curta não encurta a regra.
 */
export const REGUA_DA_FAIXA = "ao-longo-da-divisa-a-partir-do-encontro-das-ruas" as const;

/** Onde o ponto cai no anel, em ARCO a partir do vértice 0, e o arco de cada vértice. */
function arcosNoAnel(ponto: P, anel: readonly P[]): { s: number; acum: number[]; perimetro: number } {
  const n = anel.length;
  const acum: number[] = [0];
  for (let i = 0; i < n; i++) acum.push(acum[i]! + comprimento(anel[i]!, anel[(i + 1) % n]!));
  let melhor = Number.POSITIVE_INFINITY;
  let s = 0;
  for (let i = 0; i < n; i++) {
    const a = anel[i]!;
    const b = anel[(i + 1) % n]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const l2 = dx * dx + dy * dy;
    const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((ponto.x - a.x) * dx + (ponto.y - a.y) * dy) / l2));
    const d = Math.hypot(a.x + dx * t - ponto.x, a.y + dy * t - ponto.y);
    if (d < melhor) {
      melhor = d;
      s = acum[i]! + t * Math.sqrt(l2);
    }
  }
  return { s, acum, perimetro: acum[n]! };
}

/**
 * A posição está dentro da faixa de esquina? — andando pela divisa, nunca em linha reta.
 */
export function dentroDaFaixaDeEsquina(
  ponto: P,
  anel: readonly P[],
  esquinas: readonly number[],
  faixa_m: number,
): boolean {
  if (anel.length < 2 || esquinas.length === 0) return false;
  const { s, acum, perimetro } = arcosNoAnel(ponto, anel);
  for (const i of esquinas) {
    const sv = acum[i];
    if (sv === undefined || i >= anel.length) continue;
    const d = Math.abs(s - sv);
    if (Math.min(d, perimetro - d) <= faixa_m) return true;
  }
  return false;
}

/**
 * A RÉGUA VELHA, guardada só para a comparação antes/depois do item 029 — não decide nada.
 *
 * Fica exportada porque a prova do item 029 põe as duas lado a lado nas sete glebas, e refazer a
 * reta dentro da ferramenta seria a segunda montagem (D116).
 */
export function dentroDaFaixaEmLinhaReta(
  ponto: P,
  anel: readonly P[],
  esquinas: readonly number[],
  faixa_m: number,
): boolean {
  for (const i of esquinas) {
    const v = anel[i];
    if (v === undefined) continue;
    if (Math.hypot(ponto.x - v.x, ponto.y - v.y) <= faixa_m) return true;
  }
  return false;
}

/** 1 mm: o empate de projeção num vértice. Não é a faixa — é a régua do "mesmo ponto". */
const TOLERANCIA_DO_EMPATE_m = 0.001;

/**
 * A posição está sobre uma face que dá para via pública? — a REGRA 2, com guarda. (LAB-97)
 *
 * *"Posição sem rua não é posição"*: quem decide é a face onde o ponto cai, e o ponto é
 * **projetado no anel** como na régua da faixa — uma posição a milímetros da divisa não muda de
 * face por arredondamento.
 *
 * **A escolha que a regra não responde, por escrito:** o ponto que cai EXATAMENTE num vértice
 * pertence às duas faces que se encontram nele, e está sobre via se UMA delas der para rua. É o
 * fim da testada de rua, e o fim da testada ainda é rua. O lado conservador — recusar o vértice
 * entre rua e muro — não protege nada que a faixa de esquina já não proteja onde há esquina, e
 * onde não há esquina recusaria a ponta de uma rua de verdade. A tolerância do empate é de 1 mm,
 * a mesma ordem do `TOL_DIVISA_M` do Generate.
 *
 * `faces` não aceita `null` aqui: a falta de declaração é OUTRO motivo, e quem chama decide antes.
 */
export function sobreFaceComVia(ponto: P, anel: readonly P[], faces: readonly number[]): boolean {
  const n = anel.length;
  if (n < 2) return false;
  const distancias: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = anel[i]!;
    const b = anel[(i + 1) % n]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const l2 = dx * dx + dy * dy;
    const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((ponto.x - a.x) * dx + (ponto.y - a.y) * dy) / l2));
    distancias.push(Math.hypot(a.x + dx * t - ponto.x, a.y + dy * t - ponto.y));
  }
  const menor = Math.min(...distancias);
  const comVia = new Set(faces);
  return distancias.some((d, i) => d <= menor + TOLERANCIA_DO_EMPATE_m && comVia.has(i));
}

/** Uma posição avaliada. `lotes` é `null` sempre que `motivo` não é `null`. */
export interface PosicaoAvaliada {
  ponto: P;
  valida: boolean;
  motivo: MotivoDeRecusa | null;
  lotes: number | null;
  /** `true` só na posição que a gleba declara — a do usuário. Ela nunca é contestada. */
  doUsuario: boolean;
}

/**
 * Avalia posições contra as regras 2 e 3, SEM rodar motor — e a 2 ganhou guarda no LAB-97.
 *
 * A posição do usuário entra com `doUsuario: true` e **atravessa sempre**: a regra 4 diz *"já se
 * o usuário escolher um ponto na esquina, deixa ele"* — a faixa vale para o que se **sugere**,
 * não para o que se **permite**. Ela sai marcada, nunca recusada.
 */
export function avaliarPosicoes(
  anel: readonly P[],
  pontos: readonly P[],
  faces: FacesComVia,
  faixa_m: number,
  doUsuario: readonly P[] = [],
): PosicaoAvaliada[] {
  const esquinas = esquinasDeVia(anel, faces);
  const ehDoUsuario = (p: P): boolean =>
    doUsuario.some((u) => u.x === p.x && u.y === p.y);

  return pontos.map((ponto): PosicaoAvaliada => {
    const minha = ehDoUsuario(ponto);
    if (minha) {
      // Regra 4: a escolha dele atravessa. Nem a faixa nem a falta de dado a recusam.
      return { ponto, valida: true, motivo: null, lotes: null, doUsuario: true };
    }
    if (faces === null || esquinas === null) {
      return {
        ponto,
        valida: false,
        motivo: "nao-declarado-quais-faces-dao-para-via",
        lotes: null,
        doUsuario: false,
      };
    }
    // Regra 2 ANTES da 3: posição sobre o muro do vizinho não é posição, e dizer que ela foi
    // recusada "por estar perto da esquina" daria o motivo errado a quem lê a curva.
    if (!sobreFaceComVia(ponto, anel, faces)) {
      return { ponto, valida: false, motivo: "sem-via-publica", lotes: null, doUsuario: false };
    }
    if (dentroDaFaixaDeEsquina(ponto, anel, esquinas, faixa_m)) {
      return { ponto, valida: false, motivo: "dentro-da-faixa-de-esquina", lotes: null, doUsuario: false };
    }
    return { ponto, valida: true, motivo: null, lotes: null, doUsuario: false };
  });
}

/**
 * O LIMITE do que a regra da esquina tira do perímetro — um TETO e um PISO, não um número.
 *
 * Isto é o que se pode medir **sem** o dado que falta, e por isso existe. Sem saber quais faces
 * dão para via:
 *
 * - **o piso é ZERO** — se nenhum vértice for encontro de duas ruas, não há esquina e a regra não
 *   tira nada;
 * - **o teto é o caso em que TODO vértice é esquina de rua** — a união das faixas em volta de
 *   todos os vértices.
 *
 * O valor verdadeiro está no intervalo, e **não se aperta sem o dado**. *Intervalo é medição;
 * número único inventado não é.*
 *
 * O teto é calculado por amostragem do perímetro a passo declarado, e não por fórmula fechada,
 * porque faixas de vértices vizinhos **se sobrepõem** em divisa recortada — somar os
 * `2 × faixa_m` contaria o mesmo trecho duas vezes e daria teto acima de 100 %.
 */
export interface LimiteDaFaixa {
  faixa_m: number;
  perimetro_m: number;
  /** O passo da amostragem, declarado: ninguém compara um teto de 1 m com outro de 10 m. */
  passo_m: number;
  amostras: number;
  /** Amostras dentro da faixa no caso em que todo vértice é esquina. */
  amostrasNoTeto: number;
  tetoPctDoPerimetro: number;
  pisoPctDoPerimetro: 0;
  /** A frase que vai ao relatório: o número sozinho seria lido como medição exata. */
  comoSeDiz: string;
}

export function limiteDaFaixaDeEsquina(
  anel: readonly P[],
  faixa_m: number,
  passo_m = 1,
  regua: (ponto: P, anel: readonly P[], esquinas: readonly number[], faixa_m: number) => boolean = dentroDaFaixaDeEsquina,
): LimiteDaFaixa {
  const perimetro = perimetroDoAnel(anel);
  if (anel.length < 3 || perimetro <= 0 || passo_m <= 0) {
    throw new Error(
      "limiteDaFaixaDeEsquina: anel com menos de 3 pontos, perímetro nulo ou passo não positivo — " +
        "e devolver zero aqui seria publicar 'a regra não tira nada' sem ter medido",
    );
  }

  const todosOsVertices = anel.map((_, i) => i);
  let amostras = 0;
  let dentro = 0;
  let andado = 0;

  for (let i = 0; i < anel.length; i++) {
    const a = anel[i]!;
    const b = anel[(i + 1) % anel.length]!;
    const d = comprimento(a, b);
    while (andado < d) {
      const t = d === 0 ? 0 : andado / d;
      const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      amostras += 1;
      if (regua(p, anel, todosOsVertices, faixa_m)) dentro += 1;
      andado += passo_m;
    }
    andado -= d;
  }

  const teto = amostras === 0 ? 0 : Number(((100 * dentro) / amostras).toFixed(2));
  return {
    faixa_m,
    perimetro_m: Number(perimetro.toFixed(2)),
    passo_m,
    amostras,
    amostrasNoTeto: dentro,
    tetoPctDoPerimetro: teto,
    pisoPctDoPerimetro: 0,
    comoSeDiz:
      `com faixa de ${faixa_m} m, a regra da esquina tira entre **0 %** e **${teto} %** do ` +
      `perímetro de ${perimetro.toFixed(0)} m. O intervalo é o resultado: sem saber quais faces ` +
      "dão para via pública, não há como apertá-lo — esquina é encontro de duas RUAS, não " +
      "vértice do anel",
  };
}

/** A sugestão, ou a recusa de sugerir. */
export interface Sugestao {
  /** `null` quando não há o que sugerir — e `porqueNao` diz por quê. */
  frase: string | null;
  ganhoEmLotes: number | null;
  ponto: P | null;
  porqueNao: string | null;
}

/**
 * MONTA A SUGESTÃO, ou RECUSA sugerir — e a recusa é o caso de hoje.
 *
 * A frase sai no formato dele: *"se o acesso mudar para cá, você ganha N lotes"*. Ela só se monta
 * quando há **ganho positivo** sobre o que o acesso do usuário rende: sugerir uma posição que
 * rende igual ou menos não é sugestão, é ruído.
 *
 * **E ela recusa sugerir quando as faces com via não foram declaradas** — porque qualquer ponto
 * proposto poderia estar sobre a divisa do vizinho, que é a sugestão *plausível e impossível*
 * que o adendo proíbe. Recusar é o único jeito honesto: o dado não existe em gleba nenhuma desta
 * casa, e inventá-lo seria furar a §4.
 */
export function sugerirAcesso(
  faces: FacesComVia,
  rendimentoDoUsuario: number | null,
  candidatas: readonly PosicaoAvaliada[],
): Sugestao {
  const nada = (porqueNao: string): Sugestao => ({
    frase: null,
    ganhoEmLotes: null,
    ponto: null,
    porqueNao,
  });

  if (faces === null) {
    return nada(
      "NÃO HÁ O QUE SUGERIR: nenhuma gleba desta casa declara quais faces dão para via pública, " +
        "e sem isso qualquer ponto proposto pode estar sobre a divisa do vizinho — a sugestão " +
        "plausível e impossível que o adendo proíbe. A curva continua medível; o PRODUTO não",
    );
  }
  if (rendimentoDoUsuario === null) {
    return nada(
      "a gleba não declara acesso, então não há com o que comparar: sugestão é um GANHO sobre a " +
        "escolha do usuário, e sem a escolha dele o número não tem referência",
    );
  }

  const melhor = candidatas
    .filter((c) => c.valida && !c.doUsuario && c.lotes !== null)
    .reduce<PosicaoAvaliada | null>((a, c) => (a === null || c.lotes! > a.lotes! ? c : a), null);

  if (melhor === null) return nada("nenhuma posição válida foi medida");

  const ganho = melhor.lotes! - rendimentoDoUsuario;
  if (ganho <= 0) {
    return nada(
      `a melhor posição válida rende ${melhor.lotes} lotes contra os ${rendimentoDoUsuario} do ` +
        "acesso escolhido: não há ganho, e sugerir mudança sem ganho é ruído",
    );
  }

  return {
    frase: `se o acesso mudar para cá, você ganha ${ganho} lote${ganho === 1 ? "" : "s"}`,
    ganhoEmLotes: ganho,
    ponto: melhor.ponto,
    porqueNao: null,
  };
}

/**
 * COMO O CONTRATO v1 DECLARA UM ACESSO — e `acessos` é `unknown[]` no tipo da esteira.
 *
 * Por isso há um leitor explícito aqui: `unknown[]` não se lê por engano, e inventar a forma
 * seria o D23 outra vez. O que o contrato de fato traz, medido nas sete glebas:
 *
 * - `ponto` — um par `{x, y}`, a posição do acesso. Quatro glebas usam;
 * - `segmento` — **um TRECHO da divisa, `{a, b}`**, e não um índice de face. **Uma** gleba usa
 *   (`ensaio-com-promessas`, com `ponto: null`), e esse é o idioma que o contrato já tem para
 *   dizer *"o acesso fica neste pedaço da divisa"*.
 *
 * **E nenhum dos dois diz quais faces dão para VIA PÚBLICA** — são campos sobre onde o acesso
 * está, não sobre onde há rua. É a diferença que o adendo cobra, e ela não tem campo.
 */
export interface AcessoDeclarado {
  id?: string;
  ponto?: { x: number; y: number } | null;
  /** O trecho da divisa, `{a, b}` — o idioma que o contrato já usa. Não é índice de face. */
  segmento?: { a: { x: number; y: number }; b: { x: number; y: number } } | null;
}

/** Lê a lista de acessos de uma entrada, que no tipo da esteira é `unknown[]`. */
export function acessosDeclaradosDe(acessos: readonly unknown[]): AcessoDeclarado[] {
  return acessos.map((a) => (typeof a === "object" && a !== null ? (a as AcessoDeclarado) : {}));
}

/**
 * O QUE AS GLEBAS DECLARAM — e o que isto mede é a FALTA.
 *
 * Igual ao relevo, que nenhuma das glebas-padrão trazia: a resposta é sobre as **glebas**, não
 * sobre os motores. O item 010 previu este caso e mandou medi-lo primeiro.
 */
export interface DeclaracaoDaGleba {
  gleba: string;
  quantosAcessos: number;
  /** `true` quando algum acesso declara o `segmento` — o TRECHO da divisa, não a face. */
  algumAcessoDizOSegmento: boolean;
  /** As faces que dão para via pública, se a gleba as declarar. Nenhuma declara hoje. */
  facesComVia: FacesComVia;
}

export interface ContaDasDeclaracoes {
  glebas: number;
  comAlgumAcesso: number;
  semAcessoNenhum: number
  comSegmentoDeclarado: number;
  comFacesComVia: number;
  comoSeDiz: string;
}

export function contarAsDeclaracoes(ds: readonly DeclaracaoDaGleba[]): ContaDasDeclaracoes {
  const comAlgumAcesso = ds.filter((d) => d.quantosAcessos > 0).length;
  const comSegmento = ds.filter((d) => d.algumAcessoDizOSegmento).length;
  const comFaces = ds.filter((d) => d.facesComVia !== null).length;
  return {
    glebas: ds.length,
    comAlgumAcesso,
    semAcessoNenhum: ds.length - comAlgumAcesso,
    comSegmentoDeclarado: comSegmento,
    comFacesComVia: comFaces,
    comoSeDiz:
      `${ds.length} glebas · ${comAlgumAcesso} declaram algum acesso · ` +
      `${ds.length - comAlgumAcesso} declaram NENHUM · ${comSegmento} dizem o segmento · ` +
      `${comFaces} dizem quais faces dão para via pública`,
  };
}
