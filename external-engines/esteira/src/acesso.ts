/**
 * A SENSIBILIDADE AO ACESSO — quanto o resultado depende de ONDE entra a rua.
 * (LAB-28)
 *
 * # Por que esta régua existe
 *
 * O LAB-26 foi varrer as capacidades declaradas da porta e achou que
 * `respeitaAcesso` **não tinha experimento nenhum** — e que era justamente nele
 * que a declaração estava falsa (D109). Ao escrever o experimento, apareceu um
 * número que não era o assunto do prompt e é maior que ele:
 *
 * > Mover o ponto de acesso muda o resultado **mais do que qualquer outra
 * > entrada que o Lab mede**. Na candidata ortogonal do Generate, em
 * > `geo-antonina`, de **1 723 a 1 390 lotes** — 19 %.
 *
 * E as cinco glebas da tabela declaram **um** acesso cada, sem ninguém medir
 * quanto o resultado depende dele. Uma tabela que compara motores com o acesso
 * fixo responde *"qual motor é melhor NESTE ponto de entrada"* — e apresenta isso
 * como *"qual motor é melhor"*.
 *
 * # Como se mede, e o que o número é
 *
 * O acesso é posto em **{@link POSICOES_DE_ACESSO} pontos igualmente espaçados
 * por comprimento de arco** no perímetro da gleba, e o motor roda em cada um. O
 * que sai é a **amplitude**: quanto o melhor ponto rende acima do pior, em lotes
 * e em área vendável.
 *
 * **A amplitude medida é um PISO, não o valor verdadeiro.** Seis pontos não
 * varrem o perímetro: o melhor e o pior ponto reais podem cair entre duas
 * amostras, e aí a sensibilidade de verdade é **maior** que a publicada. Dizer
 * "amplitude de 19 %" sem dizer isso seria vender precisão que a amostra não tem.
 *
 * # Por que seis, e não trinta
 *
 * Cada posição é uma rodada completa do motor **mais** o Validator e o Judge do
 * Generate — a régua é a do dono, sempre (D20). Em `geo-antonina`, 141,8 ha, isso
 * é da ordem de 17 s por posição somando os quatro motores. Trinta posições
 * poriam a tabela em meia hora de execução e ninguém a regeraria; seis cabem, e a
 * ressalva do piso fica escrita em vez de o número fingir ser exato.
 *
 * # O que esta régua NÃO faz
 *
 * - **Não escolhe o acesso.** Onde a entrada pode ficar é decisão de projeto e de
 *   licença — dá na rua que existe, respeita a faixa de domínio, atravessa ou não
 *   o curso d'água. O Lab mede a consequência; a escolha é do Jonny (CLAUDE.md §4).
 * - **Não diz que o melhor ponto é viável.** O ponto de maior rendimento pode cair
 *   onde não há rua nenhuma do lado de fora. Por isso a medição publica também o
 *   **acesso declarado na gleba**, que é o único que alguém afirmou existir.
 */
import type { P } from "./motores/comum.ts";
import type { EntradaMinima } from "./gleba-v1.ts";

/**
 * Quantos pontos de acesso entram na varredura.
 *
 * Seis, por custo — ver o cabeçalho. O número é declarado e viaja na prova, para
 * que ninguém compare uma amplitude de seis pontos com outra de trinta.
 */
export const POSICOES_DE_ACESSO = 6;

/** Perímetro do anel, em metros. */
function perimetro(anel: readonly P[]): number {
  let s = 0;
  for (let i = 0; i < anel.length; i++) {
    const a = anel[i]!;
    const b = anel[(i + 1) % anel.length]!;
    s += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return s;
}

/**
 * `n` pontos igualmente espaçados **por comprimento de arco** no perímetro.
 *
 * Por arco, e não por vértice: um anel de levantamento tem os vértices
 * amontoados onde a divisa é recortada e esparsos onde ela é reta, e tomar
 * `anel[i * k]` poria quase todas as amostras no mesmo canto do terreno. É o
 * mesmo erro de forma que o D75 e o D93 pegaram, nas duas vezes em que uma régua
 * minha mediu vértice onde devia medir linha.
 */
export function posicoesDeAcesso(anel: readonly P[], n = POSICOES_DE_ACESSO): P[] {
  const total = perimetro(anel);
  if (anel.length < 3 || total <= 0 || n < 1) return [];
  const passo = total / n;
  const saida: P[] = [];
  let alvo = 0;
  let andado = 0;
  for (let i = 0; i < anel.length && saida.length < n; i++) {
    const a = anel[i]!;
    const b = anel[(i + 1) % anel.length]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    while (saida.length < n && alvo <= andado + d) {
      const t = d === 0 ? 0 : (alvo - andado) / d;
      saida.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      alvo += passo;
    }
    andado += d;
  }
  return saida;
}

/**
 * A mesma gleba com o acesso num ponto dado.
 *
 * Substitui a lista inteira em vez de acrescentar: dois acessos é outra pergunta,
 * e o adaptador do Laboratório de Parcelamento já declara que descarta os demais.
 */
export function comAcessoEm(e: EntradaMinima, ponto: P): EntradaMinima {
  return {
    ...e,
    acessos: [
      { id: "A1", nome: "Acesso principal", papel: "principal", ponto, segmento: null, sugerido: false },
    ],
  };
}

/** O que um motor rende num ponto de acesso. `null` = o esquema recusou. */
export interface RendimentoNoAcesso {
  ponto: P;
  lotes: number | null;
  areaVendavel_m2: number | null;
}

/** A amplitude de uma grandeza entre as posições. */
export interface Amplitude {
  minimo: number | null;
  maximo: number | null;
  mediana: number | null;
  /** `maximo − minimo`. */
  amplitude: number | null;
  /** A amplitude como porcentagem do MÍNIMO: "o melhor ponto rende X % acima do pior". */
  amplitudePct: number | null;
}

export interface SensibilidadeAoAcesso {
  /** Quantas posições entraram, e quantas o esquema aceitou. */
  posicoes: number;
  posicoesMedidas: number;
  /** A ressalva, viajando com o número: a amplitude é um piso. */
  amplitudeEhPiso: true;
  lotes: Amplitude;
  areaVendavel_m2: Amplitude;
  /** O ponto de maior e de menor rendimento em LOTES, entre os amostrados. */
  melhorPonto: P | null;
  piorPonto: P | null;
  /**
   * O que o acesso **declarado na gleba** rende — `null` quando a gleba não
   * declara nenhum.
   *
   * É o único ponto que alguém afirmou existir, e por isso ele não se mistura com
   * os amostrados: os seis são hipóteses do Lab; este é dado.
   */
  acessoDeclarado: RendimentoNoAcesso | null;
  /** Cada posição, crua, para a prova ser auditável. */
  porPosicao: RendimentoNoAcesso[];
}

const mediana = (v: number[]): number | null => {
  if (!v.length) return null;
  const o = [...v].sort((a, b) => a - b);
  const m = Math.floor(o.length / 2);
  return o.length % 2 ? o[m]! : (o[m - 1]! + o[m]!) / 2;
};

function amplitudeDe(valores: (number | null)[], casas: number): Amplitude {
  const v = valores.filter((x): x is number => typeof x === "number");
  if (!v.length) {
    return { minimo: null, maximo: null, mediana: null, amplitude: null, amplitudePct: null };
  }
  const n = (x: number) => Number(x.toFixed(casas));
  const minimo = Math.min(...v);
  const maximo = Math.max(...v);
  return {
    minimo: n(minimo),
    maximo: n(maximo),
    mediana: n(mediana(v)!),
    amplitude: n(maximo - minimo),
    // Sobre o MÍNIMO, de propósito: a frase que o número responde é "o melhor
    // ponto rende quanto acima do pior". Sobre a média, a mesma diferença daria
    // um número menor e uma frase que ninguém faz.
    amplitudePct: minimo > 0 ? Number(((100 * (maximo - minimo)) / minimo).toFixed(2)) : null,
  };
}

/**
 * Mede a sensibilidade ao acesso de UM motor numa gleba.
 *
 * @param medir roda o motor e devolve o que interessa. Fica fora de propósito:
 *   quem julga é o Validator e o Judge do Generate, e esta régua não os conhece.
 */
/**
 * O QUE SE DERIVA DAS POSIÇÕES CRUAS — a conta, num lugar só.
 *
 * Tudo o que uma {@link SensibilidadeAoAcesso} publica, tirando o que não é
 * conta: as posições cruas, o rendimento no acesso declarado e a ressalva do
 * piso. Serve a dois leitores, e é por isso que ela existe separada:
 *
 * 1. a própria {@link sensibilidadeAoAcesso}, que roda o motor e agrega;
 * 2. quem **confere uma prova já publicada** sem rodar motor nenhum — refazendo
 *    a conta a partir do `porPosicao` que o arquivo carrega.
 *
 * O segundo leitor é o conserto do LAB-39: a trava do D116 comparava a prova do
 * LAB-19 com a do LAB-28 e **não media nada** — duas provas regeradas erradas do
 * mesmo jeito passavam. Agora cada arquivo é conferido contra os números crus
 * **dele**, e a fórmula da conferência é esta, a mesma que produziu o número.
 */
export interface AgregadosDoAcesso {
  posicoes: number;
  posicoesMedidas: number;
  lotes: Amplitude;
  areaVendavel_m2: Amplitude;
  melhorPonto: P | null;
  piorPonto: P | null;
}

export function agregadosDasPosicoes(
  porPosicao: readonly RendimentoNoAcesso[],
): AgregadosDoAcesso {
  const comLote = porPosicao.filter((r) => r.lotes != null);
  // O `reduce` com `>` estrito guarda o PRIMEIRO em caso de empate, de propósito:
  // sem isso o melhor ponto de uma gleba com dois pontos de igual rendimento
  // mudaria de nome a cada regeração, e o determinismo da prova ia embora.
  const melhor = comLote.reduce<RendimentoNoAcesso | null>(
    (a, r) => (a == null || r.lotes! > a.lotes! ? r : a),
    null,
  );
  const pior = comLote.reduce<RendimentoNoAcesso | null>(
    (a, r) => (a == null || r.lotes! < a.lotes! ? r : a),
    null,
  );
  return {
    posicoes: porPosicao.length,
    posicoesMedidas: comLote.length,
    lotes: amplitudeDe(porPosicao.map((r) => r.lotes), 0),
    areaVendavel_m2: amplitudeDe(porPosicao.map((r) => r.areaVendavel_m2), 2),
    melhorPonto: melhor?.ponto ?? null,
    piorPonto: pior?.ponto ?? null,
  };
}

export function sensibilidadeAoAcesso(
  entrada: EntradaMinima,
  medir: (e: EntradaMinima) => { lotes: number | null; areaVendavel_m2: number | null },
  n = POSICOES_DE_ACESSO,
): SensibilidadeAoAcesso {
  const pontos = posicoesDeAcesso(entrada.gleba.anel as P[], n);
  const porPosicao: RendimentoNoAcesso[] = pontos.map((ponto) => ({
    ponto,
    ...medir(comAcessoEm(entrada, ponto)),
  }));

  const declarado = (entrada.acessos ?? []) as { ponto?: P }[];
  const pontoDeclarado = declarado[0]?.ponto ?? null;
  const ag = agregadosDasPosicoes(porPosicao);

  // Campo por campo, e não um espalhamento: a ordem das chaves é a ordem em que
  // elas saem no JSON das provas, e trocá-la poria diferença de arquivo inteiro
  // na primeira regeração — ruído onde o leitor procura mudança de número.
  return {
    posicoes: ag.posicoes,
    posicoesMedidas: ag.posicoesMedidas,
    amplitudeEhPiso: true,
    lotes: ag.lotes,
    areaVendavel_m2: ag.areaVendavel_m2,
    melhorPonto: ag.melhorPonto,
    piorPonto: ag.piorPonto,
    acessoDeclarado: pontoDeclarado
      ? { ponto: pontoDeclarado, ...medir(entrada) }
      : null,
    porPosicao,
  };
}

/**
 * A referência de uma sensibilidade: **o rendimento no acesso que a gleba
 * declara**, ou, quando ela não declara nenhum, **na primeira posição amostrada**.
 *
 * Esta função existe porque a primeira versão do LAB-28 tinha **duas** respostas
 * para ela: a ferramenta caía na primeira posição amostrada e a página do Jonny
 * caía no número da linha da tabela (que é a gleba rodando como ela veio, sem
 * acesso nenhum nas três sintéticas). Deu dois confrontos diferentes para a mesma
 * gleba — `completo` com +29 % num lugar e +70 % no outro.
 *
 * **É exatamente o defeito que o D20 proíbe no Validator**, cometido por mim numa
 * grandeza minha. Agora a fórmula mora aqui, e quem a quiser importa.
 */
export function referenciaDe(s: SensibilidadeAoAcesso): number | null {
  return s.acessoDeclarado?.lotes ?? s.porPosicao[0]?.lotes ?? null;
}

/**
 * A amplitude de um conjunto de valores, em porcentagem **do mínimo**.
 *
 * A mesma conta de `amplitudePct`, pela mesma razão: a frase que o número responde
 * é *"o maior é quanto acima do menor"*.
 */
export function amplitudePctDe(valores: readonly (number | null)[]): number {
  const v = valores.filter((x): x is number => typeof x === "number");
  if (v.length < 2) return 0;
  const min = Math.min(...v);
  if (min <= 0) return 0;
  return Number(((100 * (Math.max(...v) - min)) / min).toFixed(2));
}

/**
 * OS MOTORES QUE ENTREGAM **LOTE** por conta própria.
 *
 * O Symbios fica fora porque entrega **quadra**, e os lotes dele são da subdivisão
 * do Lab (D50): pôr "Symbios + subdivisão" ao lado de um motor de lote infla a
 * diferença entre motores — em `ensaio-47ha` ela dá 355 %, que não é uma escolha
 * entre dois loteamentos, é a distância entre duas etapas de projeto.
 *
 * **A lista mora aqui porque ela estava escrita de DUAS formas** (LAB-39): a
 * ferramenta do LAB-28 declarava os três nomes e a do LAB-19 escrevia
 * `MOTORES.filter((m) => m.id !== "symbios")`. Hoje as duas dão o mesmo conjunto;
 * no dia em que entrar um quinto motor que entrega quadra, uma inclui e a outra
 * não — e volta o D116, duas respostas para a mesma pergunta.
 */
export const MOTORES_DE_LOTE = ["generate-ortogonal", "generate-espinha", "parcelamento"] as const;

/**
 * O CONFRONTO DO ACESSO: *"mudar a entrada da rua pesa mais que trocar o
 * programa que desenha?"* — as três contas, montadas num lugar só.
 *
 * O D116 já havia trazido as **fórmulas** (`referenciaDe`, `amplitudePctDe`) para
 * cá; a **montagem** continuou em dois arquivos, e com ela a lista dos motores de
 * lote em duas grafias. Isto fecha o buraco um nível acima — e dá ao teste do
 * LAB-39 uma conta só com que refazer o agregado de uma prova publicada.
 *
 * As três saem juntas de propósito: a primeira é quanto um MESMO motor varia só
 * mudando a entrada; a segunda e a terceira são quanto os motores diferem entre
 * si na mesma referência, com e sem o Symbios. As duas vão publicadas para
 * ninguém dizer que eu escolhi a que dava a manchete melhor.
 */
/**
 * OS NOMES DAS TRÊS CONTAS, em UM lugar — e por que eles são DADO e não só tipo.
 *
 * Tipo de TypeScript não existe em tempo de execução, e era disso que o defeito
 * precisava para sobreviver: as mesmas três contas saíam com **chaves diferentes em dois
 * arquivos publicados** — `amplitudeDoAcesso_pct` na prova do LAB-28 e
 * `maiorAmplitude_pct` na tabela do LAB-19 (D145). Dois nomes para um número é meio
 * caminho para dois números, e foi exatamente assim que o D116 começou.
 *
 * Com a lista aqui, **a guarda pode conferir o arquivo publicado** contra ela, e o
 * compilador garante que a lista e a interface não divirjam (ver `_chavesConferidas`).
 */
export const CHAVES_DO_CONFRONTO = [
  "maiorAmplitude_pct",
  "entreOsQuatroMotores_pct",
  "entreOsMotoresDeLote_pct",
] as const;

export interface ConfrontoDoAcesso {
  /** A maior amplitude que um MESMO motor exibe só mudando o acesso. */
  maiorAmplitude_pct: number;
  /** A diferença entre os quatro motores, na referência de cada um. */
  entreOsQuatroMotores_pct: number;
  /** A mesma diferença só entre os que entregam lote — a que responde à pergunta. */
  entreOsMotoresDeLote_pct: number;
}

/**
 * A trava de TIPO entre a lista e a interface: se uma ganhar ou perder chave sem a
 * outra, isto **não compila**. É a mesma disciplina do D116 — um lugar só —, agora com o
 * compilador cobrando em vez de mim lembrando.
 */
type ChaveDaLista = (typeof CHAVES_DO_CONFRONTO)[number];
type MesmasChaves<A extends string, B extends string> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : never
  : never;
const _chavesConferidas: MesmasChaves<ChaveDaLista, keyof ConfrontoDoAcesso> = true;
void _chavesConferidas;

export function confrontoDoAcesso(
  porMotor: Readonly<Record<string, SensibilidadeAoAcesso>>,
  motoresDeLote: readonly string[] = MOTORES_DE_LOTE,
): ConfrontoDoAcesso {
  const todos = Object.values(porMotor);
  // `?? 0` e não "pula": motor que não rendeu lote em posição nenhuma tem
  // amplitude `null`, e isso é zero de variação medida, não ausência de conta.
  const amplitudes = todos.map((x) => x.lotes.amplitudePct ?? 0);
  return {
    maiorAmplitude_pct: amplitudes.length ? Math.max(...amplitudes) : 0,
    entreOsQuatroMotores_pct: amplitudePctDe(todos.map((x) => referenciaDe(x))),
    entreOsMotoresDeLote_pct: amplitudePctDe(
      motoresDeLote.map((id) => (porMotor[id] ? referenciaDe(porMotor[id]!) : null)),
    ),
  };
}

/**
 * A ORDEM DOS MOTORES É ESTÁVEL quando o acesso muda? (LAB-34)
 *
 * # Por que esta régua existe
 *
 * A tabela comparativa põe os quatro motores lado a lado **num único ponto de
 * acesso** — e quem lê a coluna *lotes* ordena os motores com os olhos. O aviso de
 * que esse número varia (até **108 %**, D113) morava **só na seção do acesso**,
 * páginas abaixo de onde a ordem aparece. O chat cobrou: *"ponha o aviso onde a
 * ordem aparece, não escondido."*
 *
 * **Mas "varia 108 %" e "a ordem muda" são afirmações diferentes**, e a segunda é a
 * que importa para quem compara. Um motor pode variar muito e continuar sempre na
 * frente. Então a régua mede a ordem, não a amplitude.
 *
 * # A armadilha que esta régua tem de evitar, e por que ela é do §6
 *
 * Nem todo motor responde em toda posição de acesso: no `sintetico-50ha-ondulado`
 * a candidata ortogonal do Generate entrega desenho aceito pelo contrato em **1 de
 * 6** posições. Contar ordens incluindo essas posições diz *"a ordem muda"* quando
 * o que aconteceu foi **um motor sair da comparação** — duas coisas diferentes, e a
 * primeira contagem que eu fiz misturava as duas (dava 4 de 5 glebas em vez de 3).
 *
 * Então: a ordem só é comparada nas **posições em que TODOS responderam**, e as
 * ausências saem ao lado, contadas e nomeadas (`naoResponderam`) — porque *"este
 * motor não desenha nada aceitável se a rua entrar aqui"* também é resposta.
 */
export interface InstabilidadeDaOrdem {
  /** Quantas posições de acesso foram amostradas. */
  posicoes: number;
  /** As posições em que **todos** os motores responderam — as únicas comparáveis. */
  posicoesComparaveis: number;
  /** A ordem (ids, do mais lotes para o menos) em cada posição comparável. */
  ordens: string[][];
  /** Quantas ordens DISTINTAS aparecem. 1 = a ordem é estável. */
  ordensDistintas: number;
  /** Quem ficou em primeiro, em alguma posição. Mais de um = o vencedor muda. */
  vencedores: string[];
  /** Por motor, em quantas posições ele não entregou desenho aceito. */
  naoResponderam: Record<string, number>;
}

export function instabilidadeDaOrdem(
  porMotor: Readonly<Record<string, SensibilidadeAoAcesso>>,
): InstabilidadeDaOrdem {
  const ids = Object.keys(porMotor);
  const posicoes = ids.length ? Math.max(...ids.map((m) => porMotor[m]!.porPosicao.length)) : 0;

  const ordens: string[][] = [];
  for (let i = 0; i < posicoes; i++) {
    const nesta = ids.map((m) => ({ id: m, lotes: porMotor[m]!.porPosicao[i]?.lotes ?? null }));
    // Só as posições em que TODOS responderam entram na conta da ordem.
    if (nesta.some((x) => x.lotes == null)) continue;
    ordens.push([...nesta].sort((a, b) => b.lotes! - a.lotes!).map((x) => x.id));
  }

  const vistas = new Set(ordens.map((o) => o.join(">")));
  const naoResponderam: Record<string, number> = {};
  for (const m of ids) {
    const faltam = porMotor[m]!.posicoes - porMotor[m]!.posicoesMedidas;
    if (faltam > 0) naoResponderam[m] = faltam;
  }

  return {
    posicoes,
    posicoesComparaveis: ordens.length,
    ordens,
    ordensDistintas: vistas.size,
    vencedores: [...new Set(ordens.map((o) => o[0]!))],
    naoResponderam,
  };
}
