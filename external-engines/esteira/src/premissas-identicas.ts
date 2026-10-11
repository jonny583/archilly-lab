/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A ESTEIRA COMPARA MOTORES SOB PREMISSAS IDÊNTICAS? — a medição. (item 025, LAB-92)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O chassi foi decidido: *"o Generate é a cabine do avião… o que roda na cabine, principal, tem
 * que ser o Testfit"*, e *"todos têm que estar na mesma base"*. Isso promove esta casa de
 * ferramenta de laboratório a **régua da competição** — e a pergunta desta rodada é a única que
 * só ela pode responder:
 *
 * > **Hoje, a esteira compara motores sob premissas IDÊNTICAS?** **Não.** Medido por LUGAR:
 * > **K = 17** premissas caem no **padrão de fábrica de quem recebe** — 4 nos dois motores do
 * > Generate e 13 no Parcelamento —, e o Symbios **não recebe premissa nenhuma.**
 *
 * E o adendo-2 trouxe o peso: o dono do produto **nunca quis o default** (*"eu acho que isso o
 * usuário tem que pôr, não a gente… tinha que ser tudo zerado"*). Então o K não é higiene: é um
 * defeito que ele reconhece — e **o K de MOTOR é o que quebra a comparação**, porque *o de tela o
 * usuário vê e corrige; o de motor é invisível.*
 *
 * > **Premissa omitida não é premissa ausente: é premissa inventada por quem recebe** — e cada
 * > motor inventa a sua. *Dois motores comparados assim competem em campos diferentes, e o
 * > ranking mente com aparência de rigor.*
 *
 * # Nada aqui é conserto
 *
 * O conserto é do chassi (as premissas num lugar só) e dos donos dos motores. Esta casa **mede e
 * pede**, e o pedido sai em lista no relatório — *nunca commit em repositório vizinho* (§4).
 */

/** De onde o valor de uma premissa vem, quando o motor roda pela esteira. */
export type OrigemDaPremissa =
  /** A esteira passa o valor explicitamente. */
  | "da-esteira"
  /** A esteira não passa, e **quem recebe inventa** — o K. */
  | "default-do-motor"
  /** A esteira passaria, mas o motor **não tem onde receber**: é pedido ao dono do contrato. */
  | "motor-nao-recebe";

export interface PremissaPorMotor {
  motor: string;
  premissa: string;
  origem: OrigemDaPremissa;
  /** O valor que o default de quem recebe usa, quando ele é conhecido. */
  oDefault?: string;
  porque: string;
}

/**
 * **As premissas que a esteira passa**, medidas no `src/gleba-do-lab.ts` — o bloco `PARAMETROS`
 * das glebas-padrão. **Treze**, das quais **três chegam `null`**.
 */
export const O_QUE_A_ESTEIRA_PASSA = [
  "areaMinLote_m2",
  "areaAlvoLote_m2",
  "areaMaxLote_m2",
  "testadaMinLote_m",
  "caixaViariaMin_m",
  "caixaPrincipal_m",
  "caixaSecundaria_m",
  "calcada_m",
  "faceQuadraMax_m",
  "pctAreaPublica",
  "pctAPP",
  "pctLazer",
  "rampaMaxima_pct",
] as const;

/** As três que a esteira passa como `null` — *declarar não medido é diferente de não passar*. */
export const AS_QUE_VAO_NULAS = ["calcada_m", "pctAreaPublica", "rampaMaxima_pct"] as const;

/**
 * **O K, premissa por premissa e motor por motor** — a lista que o adendo-2 pediu em vez da
 * conta agregada: *"K = 3 não diz o que consertar; APP, lazer e perfil de lote, no motor tal, diz"*.
 *
 * **Como foi medido, e é por LUGAR:**
 *
 * - **Generate** (`generate-ortogonal`, `generate-espinha`): `src/motores/generate.ts` monta os
 *   parâmetros com `{ ...PARAMS_PADRAO_V1, …8 campos do contrato }`. O `PARAMS_PADRAO_V1` da
 *   ORIGEM (`src/lib/engine/gerar-v1.ts:456`) tem **12** campos — então **4 nunca vêm da
 *   esteira**;
 * - **Parcelamento**: a ida (`testfit/adapter/src/ida.ts`) preenche **9** das **22** chaves de
 *   `ChaveFaixa` (`motor-testfit/src/lib/lab/tipos.ts:124`), e o tipo diz, no próprio comentário,
 *   que os padrões do arquivo *"sobrepõem o default de fábrica"* — logo **13 ficam de fábrica**;
 * - **Symbios**: `parametros` é `perdaEmBloco` no inventário das idas — ele **não parcela em
 *   lote**, então nenhuma premissa de lote tem consumidor do outro lado da ponte.
 */
export const O_K: readonly PremissaPorMotor[] = [
  // ── Generate: 4 campos do `PARAMS_PADRAO_V1` que a esteira nunca sobrescreve ──
  {
    motor: "generate-ortogonal | generate-espinha",
    premissa: "testadaMinimaLegal",
    origem: "default-do-motor",
    oDefault: "NORMA_BR.testadaMinimaLegal.valor",
    porque: "o limite LEGAL da testada vem da norma embutida no motor, e o contrato não o traz: o motor julga a si mesmo contra um número que a esteira não passou",
  },
  {
    motor: "generate-ortogonal | generate-espinha",
    premissa: "raioBulbo",
    origem: "default-do-motor",
    oDefault: "7.5",
    porque: "o raio do bulbo de cul-de-sac muda a área que a via consome, e a esteira não o passa",
  },
  {
    motor: "generate-ortogonal | generate-espinha",
    premissa: "larguraEntrada",
    origem: "default-do-motor",
    oDefault: "20",
    porque: "a largura da entrada do loteamento consome frente de gleba e a esteira não a passa",
  },
  {
    motor: "generate-ortogonal | generate-espinha",
    premissa: "regimeFachada",
    origem: "default-do-motor",
    oDefault: '"condominio"',
    porque:
      "é o default mais pesado dos quatro: ele decide se o lote dá frente para RUA PÚBLICA ou " +
      "para via de condomínio — e isso muda o que conta como violação de testada. A esteira " +
      "compara dois motores do Generate em regime de condomínio sem nunca o ter pedido",
  },
  // ── Parcelamento: 13 das 22 ChaveFaixa ficam de fábrica ───────────────────
  ...(
    [
      ["tolerancia", "a folga que o motor aceita sobre as faixas — ela decide quantos lotes passam raspando"],
      ["appRioPct", "a faixa de APP de curso d'água, por porcentagem"],
      ["doacaoPct", "a porcentagem de doação ao município: terra que sai do loteável"],
      ["doacaoTestadaMin", "a testada mínima da área doada"],
      ["lagosPct", "a porcentagem de lagos"],
      ["arborizacaoPct", "a porcentagem de arborização"],
      ["pctCulDeSac", "quanto do traçado pode ser cul-de-sac — e o mecanismo nº 5 das violações depende dele"],
      ["interferenciaRelevo", "o quanto o relevo pode torcer o traçado"],
      ["ladoSuperquadra", "o lado da superquadra, no partido que a usa"],
      ["numRadiais", "o número de radiais, no partido radial"],
      ["curvatura", "a curvatura permitida nas vias"],
      ["testadaExterna", "a testada mínima dos lotes da fileira EXTERNA — e o sétimo mecanismo mora aqui"],
      ["areaLoteExterna", "a área dos lotes da fileira externa"],
    ] as const
  ).map(([premissa, porque]) => ({
    motor: "parcelamento",
    premissa,
    origem: "default-do-motor" as const,
    porque: `${porque}. A ida não preenche esta chave, e o tipo do motor diz que o arquivo "sobrepõe o default de fábrica" — sem arquivo, fábrica`,
  })),
] as const as readonly PremissaPorMotor[];

/**
 * **O caso válido que quase parece inválido** (o item nomeou): premissa que o motor **não tem como
 * receber** não é premissa inventada — é campo que o contrato não publica, ou consumidor que não
 * existe. **Isto é pedido ao dono do contrato, não achado contra o motor.**
 */
export const O_QUE_O_MOTOR_NAO_RECEBE: readonly PremissaPorMotor[] = [
  {
    motor: "parcelamento",
    premissa: "caixaViariaMin_m",
    origem: "motor-nao-recebe",
    porque: "o motor usa as caixas explícitas e não tem um piso independente (perda declarada na ida)",
  },
  {
    motor: "parcelamento",
    premissa: "pctAreaPublica",
    origem: "motor-nao-recebe",
    porque: "ele não reserva área pública por porcentagem: reserva por ímã de conteúdo",
  },
  {
    motor: "parcelamento",
    premissa: "rampaMaxima_pct",
    origem: "motor-nao-recebe",
    porque: "o motor não limita rampa — ele mede, desde o T03 dele",
  },
  {
    motor: "generate-ortogonal | generate-espinha",
    premissa: "calcada_m · pctAreaPublica · rampaMaxima_pct",
    origem: "motor-nao-recebe",
    porque:
      "os três não entram em `GerarV1Params`: a calçada vive embutida no default da caixa " +
      "(`CALCADA_PADRAO_V1`), a área pública por porcentagem não existe no motor, e a rampa ele " +
      "mede sem limitar. A esteira os passa `null`, e `null` aqui é honesto",
  },
  {
    motor: "symbios",
    premissa: "TODAS as 13",
    origem: "motor-nao-recebe",
    porque:
      "`parametros` é perda EM BLOCO na ida: o Symbios traça via e extrai quadra, não parcela em " +
      "lote. Comparar o ranking de lote dele com os outros é comparar um motor que recebeu ZERO " +
      "premissas — e isto é o limite mais importante desta medição",
  },
] as const;

/** A conta, declarada: N, M, K — e o que ela decide. */
export function aConta(): {
  N: number;
  M: number;
  K: number;
  nulas: number;
  porMotor: Record<string, number>;
} {
  const porMotor: Record<string, number> = {};
  for (const k of O_K) porMotor[k.motor] = (porMotor[k.motor] ?? 0) + 1;
  return {
    N: O_QUE_A_ESTEIRA_PASSA.length,
    M: O_QUE_A_ESTEIRA_PASSA.length - AS_QUE_VAO_NULAS.length,
    K: O_K.length,
    nulas: AS_QUE_VAO_NULAS.length,
    porMotor,
  };
}

/**
 * **O que a esteira NÃO consegue igualar** — e *"não consigo" nomeado vale mais que uma
 * comparação que finge paridade*.
 */
export const O_QUE_EU_NAO_CONSIGO_IGUALAR: readonly string[] = [
  "o default de FÁBRICA de quem recebe: a esteira só pode passar o que o contrato publica, e o que ela não passa o motor inventa. Enquanto o K > 0, a paridade depende de cada dono",
  "o SYMBIOS em métrica de lote: ele não recebe premissa de lote nenhuma e não parcela — a comparação dele é de via e quadra, e qualquer ranking de lote que o inclua está somando coisas diferentes",
  "o `regimeFachada` do Generate: a esteira não tem como pedir regime de LOTEAMENTO, e os dois motores dele correm em `condominio` por default — o que muda o que conta como violação de testada",
  "a TOLERÂNCIA do Parcelamento: é a chave que decide quantos lotes passam raspando, e ela não existe no contrato de motor v1 — então nem é possível igualá-la por fora",
  "o número que o próprio dono recusa: `pctAPP: 15` e `pctLazer: 10` são o default do Generate, e a esteira os passa EXPLICITAMENTE nas glebas-padrão. Igualar assim é igualar no número que ele nunca quis",
];

/**
 * **As DUAS formas de entrada de área declarada** (adendo-2), e a esteira passa as duas — com uma
 * ressalva medida que é a parte interessante.
 */
export const AS_DUAS_FORMAS = {
  poligonoDesenhado: {
    aEsteiraPassa: true,
    onde: "`restricoes[]` e `atracoes[]` do contrato → `terreno.restricoes`/`terreno.atracoes` no Parcelamento, `restricoes` no Generate",
    medidoNasGlebas: "só `completo.geojson` traz área declarada como polígono (`app` e `reserva_legal`); as outras TRÊS glebas-padrão não trazem nenhuma",
  },
  porcentagem: {
    aEsteiraPassa: true,
    onde: "`parametros.pctAPP`/`pctLazer` → `appPct`/`lazerPct` no Parcelamento, `opcoes.pctAPP`/`pctLazer` no Generate",
    medidoNasGlebas: "TODAS as quatro glebas-padrão recebem 15 % e 10 %, porque o bloco `PARAMETROS` é um só",
  },
  /** O achado que ninguém pediu, e é o mais útil dos dois. */
  oProblema:
    "na gleba `completo` as DUAS formas chegam juntas — a APP desenhada E 15 % de APP — e NADA declara qual manda. " +
    "Cada motor resolve o empate sozinho, e isso é a mesma injustiça do K numa camada acima: " +
    "um polígono tem LUGAR, uma porcentagem não, e somar os dois é contar a mesma terra duas vezes",
} as const;

/**
 * **Motor COMPOSTO** (adendo-1): a esteira presupõe um motor por rodada?
 *
 * Medido no `src/porta/motores.ts`: a porta expõe **três** implementações, cada uma com `id`
 * próprio (`generate-<candidata>`, `parcelamento`, `symbios`), e cada rodada chama **uma**. Um
 * motor composto **caberia** na porta — seria uma quarta implementação com `id` próprio chamando
 * duas —, e a medição, o ranking e o juiz continuariam funcionando, porque **tudo é indexado por
 * `id`**.
 *
 * > **O que falta não é encaixe: é a regra de JUNÇÃO.** Quando dois motores devolvem plano para a
 * > mesma gleba, alguém tem de decidir **de quem é cada parte** — e isso não é instrumento, é
 * > desenho. *A esteira mede o que o `id` entregar; ela não sabe dizer qual metade do plano é de
 * > quem.*
 */
export const MOTOR_COMPOSTO = {
  aPortaAceita: true,
  oQueFalta: "a regra de JUNÇÃO: de quem é cada parte do plano quando dois motores respondem pela mesma gleba",
  porque: "a porta indexa tudo por `id` e cada rodada chama uma implementação; compor é escrever uma quarta que chame duas — o encaixe não impede, e a decisão de junção não é instrumento",
} as const;
