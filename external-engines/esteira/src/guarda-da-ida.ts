/**
 * A GUARDA DA IDA — o teste que reprova quando o Lab não entrega ao motor o que
 * o contrato trouxe. (LAB-30)
 *
 * # Por que ela existe, e o que ela achou no dia em que nasceu
 *
 * O LAB-25 fechou o sentido **motor → SAÍDA**: nenhum campo que o motor publica
 * pode ser descartado em silêncio. O sentido contrário ficou aberto, e o prompt do
 * LAB-30 o fechou. **Ela achou, no levantamento, a quinta vez do ponto cego da §6
 * — e a mais cara de todas:**
 *
 * > O motor do Laboratório de Parcelamento tem um campo de entrada chamado
 * > `viaManual` — *"coluna vertebral desenhada à mão, quando houver"*. **A ida do
 * > Lab nunca o preencheu.** Medido: preenchendo-o, `antonina-com-via` vai de **25
 * > para 32 vias** e a geometria muda.
 *
 * E o Lab publicou, duas vezes, que **o motor** ignora via desenhada (LAB-17 e
 * LAB-23, este último *"provado por diferença"* — a SAÍDA saía idêntica porque a
 * via **nunca chegava ao motor**). A diferença entre as quatro vezes anteriores e
 * esta: as outras foram pegas antes de sair; esta **já tinha saído para o chat**.
 *
 * # Como ela difere da guarda da SAÍDA
 *
 * Na SAÍDA os dois lados **compartilham nomes** (`rampaMedia_pct` nos dois), e por
 * isso a regra `campo-vazio` podia casar por nome e não acreditar no inventário.
 * **Na ida os nomes não se parecem** — `gleba.anel` vira `gleba.externo` —, então o
 * inventário declara o **caminho de destino** e a guarda o resolve no objeto que a
 * ida de fato produziu. Declaração que a guarda confere contra o objeto continua
 * sendo declaração conferida; o que ela não pode é ser conferida contra si mesma.
 *
 * # As três regras
 *
 * 1. **`campo-nao-entregue` — reprova.** O contrato trouxe valor e o destino
 *    declarado chegou vazio no motor. É a regra que pega o `viaManual`;
 * 2. **`campo-novo-no-contrato` — reprova.** O contrato trouxe um campo que o
 *    inventário não conhece. É a regra que pegaria a **v2** — `nascente` e
 *    `eixoDoCurso` entraram no contrato e nenhuma ida tinha destino para eles;
 * 3. **`mapa-velho` — avisa.** O inventário descreve campo que esta gleba não
 *    traz. Campo opcional falta de verdade, e guarda que grita à toa se desliga.
 */

/** Para onde vai, na entrada do motor, cada campo que o contrato traz. */
export type DestinoNaIda =
  /** Chega ao motor no caminho dado, com o mesmo sentido. */
  | { tipo: "entregue"; caminho: string; cobreFilhos?: true }
  /** Chega depois de conta ou tradução — o `como` diz qual. */
  | { tipo: "traduzido"; caminho: string; como: string; cobreFilhos?: true }
  /** O motor não tem onde receber. Perda declarada, com o motivo. */
  | { tipo: "perda"; motivo: string; cobreFilhos?: true }
  /** É escrituração do contrato, não dado de terreno (schema, ids, carimbo). */
  | { tipo: "interno"; motivo: string; cobreFilhos?: true }
  /**
   * **DÍVIDA DO LAB: o motor TEM onde receber e a ida ainda não entrega.**
   *
   * É o único destino que não é uma resposta — é uma confissão, e existe porque a
   * alternativa era pior. Chamar isto de `perda` seria mentir: `perda` quer dizer
   * *"o motor não tem onde receber"*, e aqui ele tem. Chamar de `entregue` seria
   * mentir mais. Deixar sem entrada no inventário faria a guarda reprovar, e uma
   * guarda vermelha por dívida conhecida vira guarda desligada.
   *
   * **Ela NÃO reprova, e é contada e publicada** — na prova, no relatório e no
   * recado ao chat, com o prompt proposto. `onde` nomeia o campo do motor que está
   * esperando; `proposto` diz o que falta fazer.
   */
  | { tipo: "divida"; onde: string; proposto: string; cobreFilhos?: true };

/**
 * **`cobreFilhos` existe para blob opaco, e só para ele.**
 *
 * O `geo` do contrato é o documento `archilly-terreno` INTEIRO do Archilly Geo —
 * dezenas de caminhos aninhados, descartados em bloco e com o motivo declarado.
 * Exigir uma linha de inventário para cada um deles transformaria o inventário numa
 * cópia do tipo, que é o que ele não deve ser.
 *
 * **Fora disso, cada campo se declara.** Em especial os IRMÃOS: foi assim que a v2
 * acrescentou `nascente` ao lado de `geometria`, dentro de uma `restricoes` que já
 * estava declarada — e é justamente esse caso que a regra 2 precisa pegar. Pôr
 * `cobreFilhos` em `restricoes` calaria a guarda exatamente onde ela serve.
 */

export interface ObjetoDaIda {
  /** Nome da ida, para o achado: `parcelamento` ou `symbios`. */
  nome: string;
  /** Um destino para CADA caminho que o contrato traz. */
  inventario: Record<string, DestinoNaIda>;
  /** A ENTRADA do contrato, como chegou. */
  doContrato: Record<string, unknown>;
  /** A entrada do motor, como a ida a produziu. */
  doMotor: Record<string, unknown>;
}

export type RegraDaIda =
  | "campo-nao-entregue"
  | "campo-novo-no-contrato"
  /**
   * **O inventário PROMETE entregar este campo, e esta gleba não o exerce.** (LAB-35)
   *
   * Avisa, e é o aviso que importa: promessa que gleba nenhuma exercita é promessa
   * que a guarda **nunca verificou**. Um caminho de destino errado numa entrada
   * `entregue` ou `traduzido` é invisível — a regra `campo-nao-entregue` só morde
   * quando o contrato TRAZ valor. Exatamente a forma do D119.
   */
  | "promessa-nao-exercitada"
  /**
   * O inventário descreve campo que esta gleba não traz, e o destino dele é
   * **`perda` ou `interno`** — nada tinha de chegar ao motor.
   *
   * **É o aviso que não importa**, e separá-lo foi o LAB-35: dos 310 avisos que a
   * guarda cuspia, a esmagadora maioria era disto. Fica registrado na prova e fora
   * do relatório por padrão.
   */
  | "mapa-velho"
  /** Dívida declarada do Lab: o motor tem onde receber e a ida ainda não entrega. */
  | "divida-do-lab";

/** As regras que reprovam. `mapa-velho` fica fora, de propósito. */
export const REGRAS_DA_IDA_QUE_REPROVAM: readonly RegraDaIda[] = [
  "campo-nao-entregue",
  "campo-novo-no-contrato",
];

export interface AchadoDaIda {
  ida: string;
  /** O caminho no contrato, como `restricoes[].nascente`. */
  campo: string;
  regra: RegraDaIda;
  /** O caminho de destino, quando o inventário declarou um. */
  destino?: string;
  diagnostico: string;
  exemplo?: unknown;
}

const vazio = (v: unknown): boolean =>
  v === null ||
  v === undefined ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0);

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Os caminhos que um objeto traz, achatados, com um exemplo de valor.
 *
 * - objeto desce até `profundidade`;
 * - **lista de objetos vira `campo[]`** e a união das chaves dos elementos — é o
 *   que faz a guarda ver `restricoes[].nascente`, que é exatamente a forma dos
 *   campos que a v2 acrescentou. Achatar só o primeiro nível teria deixado passar
 *   justamente o caso que motivou esta guarda;
 * - lista de números ou de pontos **para** (é folha): `gleba.anel` é um caminho,
 *   não quinhentos.
 */
export function caminhosDe(
  obj: Record<string, unknown>,
  profundidade = 3,
  prefixo = "",
): Map<string, unknown> {
  const fora = new Map<string, unknown>();
  for (const [k, v] of Object.entries(obj)) {
    const caminho = prefixo ? `${prefixo}.${k}` : k;
    if (Array.isArray(v) && v.some(ehObjeto) && profundidade > 1) {
      // A união das chaves dos elementos, com o primeiro valor não vazio de cada.
      const uniao = new Map<string, unknown>();
      for (const item of v) {
        if (!ehObjeto(item)) continue;
        for (const [ik, iv] of caminhosDe(item, profundidade - 1)) {
          if (!uniao.has(ik) || (vazio(uniao.get(ik)) && !vazio(iv))) uniao.set(ik, iv);
        }
      }
      // Uma lista de pontos ({x, y}) é geometria, e geometria é folha.
      const soCoordenadas = [...uniao.keys()].every((ik) => ik === "x" || ik === "y");
      if (soCoordenadas) {
        fora.set(caminho, v);
        continue;
      }
      fora.set(caminho, v);
      for (const [ik, iv] of uniao) fora.set(`${caminho}[].${ik}`, iv);
      continue;
    }
    if (ehObjeto(v) && profundidade > 1) {
      fora.set(caminho, v);
      for (const [ik, iv] of caminhosDe(v, profundidade - 1, caminho)) fora.set(ik, iv);
      continue;
    }
    fora.set(caminho, v);
  }
  return fora;
}

/**
 * O valor num caminho, aceitando `a[].b` como *"algum elemento de `a` tem `b`"*.
 *
 * Devolve o primeiro valor **não vazio** que encontrar: a pergunta da guarda é
 * *"chegou alguma coisa?"*, e um elemento preenchido entre dez vazios é resposta
 * afirmativa — o que falta ali é problema do motor, não da ponte.
 */
export function valorEm(obj: unknown, caminho: string): unknown {
  // Um destino pode ter ALTERNATIVAS, separadas por `|`: a atração do contrato vai
  // para `terreno.atracoes` quando é polígono e para `viaManual` quando é a via
  // desenhada. Exigir um caminho só faria a guarda acusar a ponte de perder o campo
  // sempre que a gleba trouxesse a outra forma — achado inventado, e eu já produzi
  // um hoje (ver a nota de `parametros` no inventário).
  if (caminho.includes("|")) {
    for (const alternativa of caminho.split("|")) {
      const v = valorEm(obj, alternativa.trim());
      if (v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)) return v;
    }
    return undefined;
  }
  let atual: unknown = obj;
  for (const parte of caminho.split(".")) {
    if (atual == null) return undefined;
    if (parte.endsWith("[]")) {
      const lista = (atual as Record<string, unknown>)[parte.slice(0, -2)];
      if (!Array.isArray(lista)) return undefined;
      atual = lista;
      continue;
    }
    if (Array.isArray(atual)) {
      const achado = atual
        .map((item) => (ehObjeto(item) ? item[parte] : undefined))
        .find((v) => !vazio(v));
      atual = achado;
      continue;
    }
    if (!ehObjeto(atual)) return undefined;
    atual = atual[parte];
  }
  return atual;
}

/** Algum ancestral do caminho está declarado com `cobreFilhos`? */
function cobertoPorAncestral(
  campo: string,
  inventario: Record<string, DestinoNaIda>,
): boolean {
  const partes = campo.split(".");
  for (let i = partes.length - 1; i >= 1; i--) {
    const ancestral = partes.slice(0, i).join(".");
    for (const chave of [ancestral, ancestral.replace(/\[\]$/, "")]) {
      if (inventario[chave]?.cobreFilhos) return true;
    }
  }
  return false;
}

/** Audita uma ida: as três regras. */
export function auditarIda(o: ObjetoDaIda): AchadoDaIda[] {
  const achados: AchadoDaIda[] = [];
  const doContrato = caminhosDe(o.doContrato);

  // ── A dívida declarada, antes de tudo: ela é contada, não reprova ─────────
  for (const [campo, destino] of Object.entries(o.inventario)) {
    if (destino.tipo !== "divida") continue;
    if (!doContrato.has(campo) || vazio(doContrato.get(campo))) continue;
    achados.push({
      ida: o.nome,
      campo,
      regra: "divida-do-lab",
      destino: destino.onde,
      diagnostico:
        `o contrato trouxe \`${campo}\` e o motor TEM onde recebê-lo (\`${destino.onde}\`) — ` +
        `a ida do Lab ainda não entrega. Dívida declarada: ${destino.proposto}`,
      exemplo: doContrato.get(campo),
    });
  }

  // ── Regra 1 · campo-nao-entregue ─────────────────────────────────────────
  for (const [campo, destino] of Object.entries(o.inventario)) {
    if (destino.tipo !== "entregue" && destino.tipo !== "traduzido") continue;
    const valor = doContrato.get(campo);
    if (!doContrato.has(campo) || vazio(valor)) continue; // o contrato não trouxe
    if (!vazio(valorEm(o.doMotor, destino.caminho))) continue; // chegou
    achados.push({
      ida: o.nome,
      campo,
      regra: "campo-nao-entregue",
      destino: destino.caminho,
      diagnostico:
        `o contrato trouxe \`${campo}\` com valor e o destino declarado ` +
        `(\`${destino.caminho}\`) chegou VAZIO no motor. Ou a ida passa o campo, ou o ` +
        "inventário tem de dizer por que o motor não o recebe — e aí é perda declarada, " +
        "não esquecimento",
      exemplo: valor,
    });
  }

  // ── Regra 2 · campo-novo-no-contrato ─────────────────────────────────────
  for (const [campo, exemplo] of doContrato) {
    if (campo in o.inventario) continue;
    // Um caminho sob um ancestral marcado `cobreFilhos` não é campo novo — e só
    // esse caso, que é o do blob opaco. Ver a nota em `DestinoNaIda`.
    if (cobertoPorAncestral(campo, o.inventario)) continue;
    achados.push({
      ida: o.nome,
      campo,
      regra: "campo-novo-no-contrato",
      diagnostico:
        `o contrato traz \`${campo}\` e o inventário da ida não o conhece. Ou ele chega ao ` +
        "motor, ou entra como perda declarada com o motivo. Campo novo do contrato passando " +
        "em silêncio é como a v2 trouxe a nascente e nenhuma ida a viu",
      exemplo,
    });
  }

  // ── Regra 3 · o inventário descreve e a gleba não traz (avisa) ───────────
  //
  // **Partida em duas no LAB-35**, porque as duas metades não têm o mesmo peso:
  //
  //   · se o destino é `perda` ou `interno`, **nada tinha de chegar** ao motor e a
  //     ausência não diz nada → `mapa-velho`, o aviso que não importa;
  //   · se o destino é `entregue` ou `traduzido`, o inventário **promete** algo, e
  //     esta gleba não põe a promessa à prova → `promessa-nao-exercitada`. Promessa
  //     que gleba nenhuma exercita é promessa que a guarda nunca verificou, e
  //     caminho errado ali é invisível (a regra 1 só morde com valor no contrato).
  //
  // Medido ao partir: dos 310 avisos, 4 promessas não eram exercitadas por NENHUMA
  // das sete glebas — `atracoes[].geometria.aneis` e `acessos[].segmento` e
  // `parametros.calcada_m` no Parcelamento, e `gleba.furos` no Symbios.
  for (const [campo, destino] of Object.entries(o.inventario)) {
    if (doContrato.has(campo) && !vazio(doContrato.get(campo))) continue;
    if (destino.tipo === "divida") continue; // a dívida já tem regra própria
    const promete = destino.tipo === "entregue" || destino.tipo === "traduzido";
    achados.push({
      ida: o.nome,
      campo,
      regra: promete ? "promessa-nao-exercitada" : "mapa-velho",
      ...(promete ? { destino: destino.caminho } : {}),
      diagnostico: promete
        ? `o inventário PROMETE levar \`${campo}\` a \`${destino.caminho}\` e esta gleba não ` +
          "traz o campo — a promessa não foi posta à prova aqui. Se nenhuma gleba a exercer, a " +
          "guarda nunca a verificou, e caminho errado numa promessa é invisível (D134)"
        : `o inventário descreve \`${campo}\` como ${destino.tipo} e esta gleba não o traz. ` +
          "Nada tinha de chegar ao motor, então a ausência não diz nada — é o aviso que não importa",
    });
  }

  return achados;
}

/** As dívidas declaradas: o que o motor espera e a ida ainda não entrega. */
export const dividasDoLab = (a: readonly AchadoDaIda[]): AchadoDaIda[] =>
  a.filter((x) => x.regra === "divida-do-lab");

/**
 * As promessas que esta gleba não exercitou. (LAB-35)
 *
 * Agregadas entre glebas, as que aparecem em **todas** são as que a guarda nunca
 * verificou — e é essa a lista que merece olho.
 */
export const promessasNaoExercitadas = (a: readonly AchadoDaIda[]): AchadoDaIda[] =>
  a.filter((x) => x.regra === "promessa-nao-exercitada");

/**
 * Os avisos que importam: tudo menos o `mapa-velho`. (LAB-35)
 *
 * **Guarda que grita à toa se desliga**, e a desta cuspia 310 linhas por rodada.
 * O `mapa-velho` continua gravado na prova — some do relatório, não da medição.
 */
export const avisosQueImportam = (a: readonly AchadoDaIda[]): AchadoDaIda[] =>
  a.filter((x) => x.regra !== "mapa-velho");

/** Só os achados que reprovam. É o que o teste olha. */
export const reprovamNaIda = (a: readonly AchadoDaIda[]): AchadoDaIda[] =>
  a.filter((x) => REGRAS_DA_IDA_QUE_REPROVAM.includes(x.regra));

/** Uma linha por achado, legível no terminal e no relatório. */
export const emLinhasDaIda = (a: readonly AchadoDaIda[]): string[] =>
  a.map((x) => `[${x.regra}] ${x.ida} · ${x.campo}${x.destino ? ` → ${x.destino}` : ""} — ${x.diagnostico}`);
