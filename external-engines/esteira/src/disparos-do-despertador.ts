/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A CONTA DOS DISPAROS DO DESPERTADOR. (item 004 da caixa de entrada)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O item 004 veio da família: *"mandei apagar o despertador e você desobedeceu com razão —
 * apagar perde o id e perde o histórico de disparo"*. No Orçamento isso custou uma medição: ele
 * descobriu que **nunca teve despertador próprio**, depois de procurar entre 19 rotinas da
 * conta. Daí a regra nova: **identificador não se supõe.**
 *
 * E daí esta conta, que é a parte que faltava:
 *
 * > **Disparo em vazio não é fracasso: é a medida de quanto a caixa de entrada fica sem
 * > abastecimento, e é ela que diz se o intervalo está certo.**
 *
 * # Por que isto é código e não só uma lista no documento
 *
 * Porque o item avisou o que acontece com lista sem a frase do que ela decide: *"em duas semanas
 * alguém apaga a lista por achar que é ruído"*. Então a lista tem a frase, **e** tem guarda: os
 * totais declarados contra as linhas contadas, a ordem das datas, a origem de cada hora em
 * vocabulário fechado, e **os dois sentidos** do cruzamento com o `RECADOS.md`.
 *
 * # A origem de cada hora, e por que ela é um campo
 *
 * *Número sem origem não vale.* Dos quatro disparos do primeiro dia, **dois** esta sessão leu a
 * notificação (`observado`) e **dois** saem do `cron` `:05` com o horário do religamento
 * (`derivado`), registrados no recado do LAB-69. Misturá-los sem dizer qual é qual seria
 * publicar hora inventada com a autoridade de hora medida.
 */

/**
 * A origem de uma hora da conta. Vocabulário FECHADO — a trava reprova um quarto.
 *
 * - `observado` — a notificação deste disparo chegou a esta sessão **na hora**;
 * - `derivado` — não chegou notificação; a hora sai do `cron` e está justificada num recado;
 * - `entregue-em-lote` — a notificação chegou **atrasada, junto de outras** (LAB-83, D277). Em
 *   10/10 **sete** disparos foram entregues no mesmo instante, o mais antigo com **seis horas** de
 *   espera, e a caixa tinha item o tempo todo.
 *
 * > **Disparo que o despertador manda e a sessão não recebe não é disparo em vazio: é disparo
 * > PERDIDO.** Contá-lo como vazio diria ao chat *"você não abastece"* quando o que houve foi *"eu
 * > não estava ouvindo"* — e é a conta dos vazios que decide o intervalo.
 *
 * *Classe nova que se mistura com a velha apaga a medição das duas*, e é por isso que esta entra
 * no vocabulário em vez de virar prosa na célula.
 */
export const ORIGENS = ["observado", "derivado", "entregue-em-lote"] as const;
export type Origem = (typeof ORIGENS)[number];

export interface DisparoDaConta {
  /** `DD/MM/AAAA`, como está no documento. */
  data: string;
  /** `HH:MM` em UTC. */
  hora: string;
  origem: Origem;
  /** O que o disparo achou na caixa. */
  achou: string;
  /** A rodada que ele moveu — ou `acumulou`, quando caiu em cima de item em curso. */
  rodada: string;
  /** O disparo não achou item nenhum pronto na caixa. */
  emVazio: boolean;
}

export interface ContaDosDisparos {
  linhas: DisparoDaConta[];
  /**
   * Os totais que o documento DECLARA, para conferir contra as linhas.
   *
   * `noRegistro` é o total de linhas; `observados`, `derivados` e `emLote` são **por origem**, e
   * é por isso que são quatro e não um: até o LAB-83 o único número conferido se chamava
   * *"observados"* e era comparado ao total — *rótulo de uma coisa com a conta de outra* (D281).
   */
  declarados: {
    noRegistro: number | null;
    observados: number | null;
    derivados: number | null;
    emLote: number | null;
    emVazio: number | null;
  };
  /** A frase do que o número decide — sem ela a lista vira ruído e alguém a apaga. */
  temAFraseDoQueDecide: boolean;
  /** Os `trig_...` citados na seção. Mais de um id distinto é o defeito do D234. */
  idsCitados: string[];
}

const RE_SECAO = /\n# [^\n]*CONTA DOS DISPAROS[^\n]*\n([\s\S]*?)(?=\n# )/;

/** O dia de uma data `DD/MM/AAAA`, comparável. */
export function diaDe(data: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data.trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

/**
 * Lê a conta da seção do `ONDE_PARAMOS.md`.
 *
 * **A seção não se acha por número** (`§`) nem por posição: ela se acha pelo TÍTULO. Seção
 * numerada muda de número quando alguém insere outra acima, e a régua passa a ler o vazio — e
 * *guarda que não acha o objeto não está aprovando: está sem medir nada* (D213).
 */
export function lerAConta(ondeParamos: string): ContaDosDisparos {
  const secao = RE_SECAO.exec(ondeParamos)?.[1] ?? "";
  const linhas: DisparoDaConta[] = [];
  for (const l of secao.split("\n")) {
    // **A CLASSE DE ORIGEM ACEITA HÍFEN, e isto é o conserto do D281.** No LAB-83 eu pus
    // `entregue-em-lote` no vocabulário e **não** aqui: `[a-z]+` para no `-`, a linha inteira
    // deixava de casar, e as SETE linhas novas ficaram **invisíveis para esta régua** — o verde
    // passou porque ela não as viu. *Vocabulário que cresce e régua de linha que não cresce com
    // ele é guarda que fica cega exatamente na classe nova.*
    const m = /^\|\s*(\d{2}\/\d{2}\/\d{4})\s*\|\s*(\d{2}:\d{2})\s*\|\s*([a-z-]+)\s*\|([^|]*)\|([^|]*)\|/.exec(l);
    if (!m) continue;
    const achou = m[4]!.trim();
    linhas.push({
      data: m[1]!,
      hora: m[2]!,
      origem: m[3]! as Origem,
      achou,
      rodada: m[5]!.trim(),
      // **COM FRONTEIRA DE PALAVRA, e isto é a outra metade do D281.** Sem o `\b` o `vazio`
      // casava dentro de `esVAZIOu`, e a célula *"a caixa só esvaziou às 19:17"* — que diz
      // justamente que a caixa TINHA item — era contada como disparo em vazio. Medido: das cinco
      // linhas em vazio de verdade, **todas as cinco** dizem *"nada na caixa"*, e **nenhuma** usa a
      // palavra `vazio`; a alternativa que criou o falso positivo não pegava nem uma linha legítima.
      emVazio: /\b(?:vazia?|nada|sem item)\b/i.test(achou),
    });
  }
  // **CADA CLASSE TEM O SEU NÚMERO DECLARADO, e antes do LAB-83 só um era conferido.** O
  // primeiro deles se chamava *"disparos observados"* e esta régua o comparava com o **total de
  // linhas** — nome de uma coisa, conta de outra, e fechava porque as sete linhas em lote eram
  // invisíveis. Agora o rótulo diz `disparos no registro`, e `observados`, `derivados` e
  // `entregues em lote` são conferidos **por origem** (D281).
  const noRegistro = /disparos no registro:\s*(\d+)/.exec(secao)?.[1];
  const observados = /\bobservados:\s*(\d+)/.exec(secao)?.[1];
  const derivados = /\bderivados:\s*(\d+)/.exec(secao)?.[1];
  const emLote = /entregues em lote:\s*(\d+)/.exec(secao)?.[1];
  const emVazio = /em vazio:\s*(\d+)/.exec(secao)?.[1];
  const n = (s: string | undefined) => (s === undefined ? null : Number(s));
  return {
    linhas,
    declarados: {
      noRegistro: n(noRegistro),
      observados: n(observados),
      derivados: n(derivados),
      emLote: n(emLote),
      emVazio: n(emVazio),
    },
    temAFraseDoQueDecide: /não é fracasso/.test(secao) && /intervalo/.test(secao),
    idsCitados: [...new Set(secao.match(/trig_[A-Za-z0-9]+/g) ?? [])],
  };
}

export interface ProblemaDaConta {
  tipo:
    | "secao-nao-encontrada"
    | "total-declarado-diferente-das-linhas"
    | "datas-fora-de-ordem"
    | "origem-fora-do-vocabulario"
    | "sem-a-frase-do-que-decide"
    | "mais-de-um-id"
    | "vazio-sem-recado"
    | "recado-sem-linha";
  oQue: string;
}

/**
 * Confere a conta — e **os dois sentidos do cruzamento** com os recados.
 *
 * `vaziosNosRecados` são os dias que a régua das classes de rodada (item 002) acha no
 * `RECADOS.md` com a classe `despertador-sem-item` **no regime da caixa de entrada**, isto é, de
 * `aberturaDaConta` em diante. O precedente da FILA fica fora: *somar duas séries diferentes é
 * o erro da §6*, e a seção diz isso por escrito.
 */
export function conferirAConta(
  conta: ContaDosDisparos,
  vaziosNosRecados: string[],
  aberturaDaConta: string,
): ProblemaDaConta[] {
  const problemas: ProblemaDaConta[] = [];
  if (conta.linhas.length === 0) {
    problemas.push({
      tipo: "secao-nao-encontrada",
      oQue:
        "a seção da conta dos disparos não foi achada no ONDE_PARAMOS, ou está sem nenhuma " +
        "linha — e isso NÃO é aprovação: é a régua sem medir nada",
    });
    return problemas;
  }

  if (conta.declarados.noRegistro !== conta.linhas.length) {
    problemas.push({
      tipo: "total-declarado-diferente-das-linhas",
      oQue: `a seção declara ${conta.declarados.noRegistro} disparos no registro e a tabela tem ${conta.linhas.length} linhas`,
    });
  }

  // **E agora cada CLASSE é conferida contra as linhas dela.** Sem isto, um número por classe é
  // prosa: os `7` entregues em lote do LAB-83 passaram horas no documento sem régua nenhuma, e as
  // linhas que eles contavam eram justamente as que a régua não sabia ler. *Número de classe sem
  // régua da classe é o lugar onde uma classe nova vai envelhecer.*
  const porOrigem: Record<string, number> = { observado: 0, derivado: 0, "entregue-em-lote": 0 };
  for (const l of conta.linhas) porOrigem[l.origem] = (porOrigem[l.origem] ?? 0) + 1;
  const porClasse: [string, number | null, number][] = [
    ["observados", conta.declarados.observados, porOrigem["observado"]!],
    ["derivados", conta.declarados.derivados, porOrigem["derivado"]!],
    ["entregues em lote", conta.declarados.emLote, porOrigem["entregue-em-lote"]!],
  ];
  for (const [nome, declarado, contado] of porClasse) {
    if (declarado !== contado) {
      problemas.push({
        tipo: "total-declarado-diferente-das-linhas",
        oQue: `a seção declara ${declarado} ${nome} e a tabela tem ${contado} linha(s) com essa origem`,
      });
    }
  }
  const vazios = conta.linhas.filter((l) => l.emVazio);
  if (conta.declarados.emVazio !== vazios.length) {
    // **A mensagem NOMEIA as linhas que ela contou, e o motivo é medido** (LAB-81): a classe de
    // uma rodada sai da PALAVRA na coluna "o que achou" — `vazio`, `nada` ou `sem item` —, que é
    // uma convenção real, declarada no `ONDE_PARAMOS.md` ao lado desta régua (D265). Ela me pegou
    // **duas vezes em duas rodadas**, e nas duas o número sozinho não dizia QUAL linha era.
    //
    // > **Régua que acusa uma CONTA tem de nomear as parcelas.** Dizer "declara 5 e a tabela tem
    // > 6" manda recontar seis linhas à mão; dizer quais seis resolve em um olhar — e quando a
    // > classificação vem de uma palavra em prosa, a parcela é a única coisa que explica o número.
    const quais = vazios.map((l) => `${l.data} ${l.hora}`).join(", ");
    problemas.push({
      tipo: "total-declarado-diferente-das-linhas",
      oQue:
        `a seção declara ${conta.declarados.emVazio} em vazio e a tabela tem ${vazios.length} — ` +
        `as que a régua contou como em vazio são: ${quais}. A classe sai da palavra "vazio", ` +
        `"nada" ou "sem item" na coluna do que achou, que é a convenção declarada ao lado da conta`,
    });
  }

  const chaves = conta.linhas.map((l) => `${diaDe(l.data)} ${l.hora}`);
  for (let i = 1; i < chaves.length; i += 1) {
    if (chaves[i]! < chaves[i - 1]!) {
      problemas.push({
        tipo: "datas-fora-de-ordem",
        oQue: `a linha ${chaves[i]} vem depois de ${chaves[i - 1]} na tabela, e é anterior`,
      });
    }
  }

  for (const l of conta.linhas) {
    if (!(ORIGENS as readonly string[]).includes(l.origem)) {
      problemas.push({
        tipo: "origem-fora-do-vocabulario",
        oQue: `a linha ${l.data} ${l.hora} tem origem "${l.origem}", fora de ${ORIGENS.join(", ")}`,
      });
    }
  }

  if (!conta.temAFraseDoQueDecide) {
    problemas.push({
      tipo: "sem-a-frase-do-que-decide",
      oQue:
        "a seção não diz o que o número vai decidir — e o item 004 avisou o que acontece sem " +
        "isso: em duas semanas alguém apaga a lista por achar que é ruído",
    });
  }

  if (conta.idsCitados.length > 1) {
    problemas.push({
      tipo: "mais-de-um-id",
      oQue: `a seção cita ${conta.idsCitados.length} ids de despertador: ${conta.idsCitados.join(", ")} — id em duas terras envelhece numa delas`,
    });
  }

  // ── Os DOIS sentidos do cruzamento ───────────────────────────────────────
  const diasVazios = new Set(vazios.map((l) => diaDe(l.data)));
  const diasDosRecados = new Set(
    vaziosNosRecados.map((d) => diaDe(d)).filter((d) => d >= diaDe(aberturaDaConta)),
  );
  for (const dia of diasVazios) {
    if (!diasDosRecados.has(dia)) {
      problemas.push({
        tipo: "vazio-sem-recado",
        oQue: `há disparo em vazio em ${dia} e nenhum recado da classe despertador-sem-item nesse dia`,
      });
    }
  }
  for (const dia of diasDosRecados) {
    if (!diasVazios.has(dia)) {
      problemas.push({
        tipo: "recado-sem-linha",
        oQue: `há recado da classe despertador-sem-item em ${dia} e nenhuma linha em vazio na conta`,
      });
    }
  }
  return problemas;
}

/**
 * Os dias dos recados cuja classe de rodada é `despertador-sem-item`, lidos do registro.
 *
 * **A data sai do TÍTULO que está no arquivo**, que é texto que eu escrevi no dia — não de uma
 * lista digitada aqui. *A régua lê o registro; ela não o corrige* (D229), e lista de nomes de
 * recado dentro de código é exceção disfarçada.
 */
export function diasDosRecadosEmVazio(
  recados: { titulo: string; ancora: string }[],
): string[] {
  return recados
    .filter((r) => r.ancora === "despertador-sem-item")
    .map((r) => /(\d{2}\/\d{2}\/\d{4})/.exec(r.titulo)?.[1] ?? "")
    .filter((d) => d !== "");
}
