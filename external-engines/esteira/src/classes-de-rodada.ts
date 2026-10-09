/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A ÂNCORA DA RODADA SEM RELATÓRIO. (item 002 da caixa de entrada)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A trava do **D216** cobra que todo relatório `LAB-xx.md` tenha recado no arquivo. O buraco,
 * que eu mesma declarei no LAB-66: **rodada sem relatório não tem âncora para ela morder** — e
 * foi assim que o recado do PR #85 foi ao chat e não foi ao arquivo.
 *
 * > *Disciplina não é guarda.*
 *
 * # Por que a âncora não é o artefato, e isto foi MEDIDO antes de escolher
 *
 * | candidata | medida | veredicto |
 * |---|---|---|
 * | o número do **PR** | **42** mesclados na `main`, **4** citados em recado | reprovaria 38 rodadas legítimas |
 * | o **commit** da entrega | rodada que não produz commit não tem nenhum | o mesmo buraco, noutro lugar |
 * | a **data** no `RECADOS.md` | 0 dias com commit e sem recado — mas **dois recados no mesmo dia** são comuns | não distingue rodada de rodada: não teria pego o PR #85 |
 *
 * *Régua que depende de arquivo que pode não existir vai ter esse buraco de novo* — o item 002
 * avisou, e a medição confirmou.
 *
 * # A âncora é o PRÓPRIO RECADO, e ela sempre existe
 *
 * O campo `<prompt>` do cabeçalho já existe em todo recado. O que faltava é que `—` **não diz
 * nada**: ele serve igualmente para "rodada que não era prompt" e para "esqueci de dizer".
 *
 * Então `<prompt>` passa a ser **um `LAB-xx` ou uma CLASSE DE RODADA nomeada**, de vocabulário
 * fechado. A rodada sem relatório deixa de ser invisível: ela se declara.
 *
 * **E o histórico NÃO se reescreve** — o item proíbe, e com razão: *registro não se maquia.* As
 * dez que já estão lá com `—` são classificadas **pelo que o título delas já diz**, que é texto
 * que eu escrevi no dia. A régua LÊ o registro; ela não o corrige.
 *
 * **E não é lista de exceção**: não há nomes de recado aqui, só classes. Lista de exceção cresce
 * e ninguém a lê; classe se aplica a tudo que vier.
 */

/** Por que uma rodada pode não ter relatório. Conjunto fechado — a trava reprova um sétimo. */
export const CLASSES_DE_RODADA = [
  {
    id: "despertador-sem-item",
    oQue: "o despertador disparou e a fila não tinha item pronto (D62). Não há o que relatar",
    /** O que o título de um recado dessa classe diz. Padrões, não nomes (D137). */
    noTitulo: [/disparo sem item/i, /não tinha o que fazer/i],
  },
  {
    id: "fila-esgotada",
    oQue: "a fila acabou e o despertador foi desligado. O saldo mora no BALANCOS.md, não num relatório",
    noTitulo: [/fila .*esgot/i, /despertador parou/i],
  },
  {
    id: "fila-recusada",
    oQue: "a fila chegou e NÃO foi executada, com o motivo medido — recusa é entrega, e não gera relatório de prompt",
    noTitulo: [/não executada/i, /recusad/i],
  },
  {
    id: "decisao-registrada",
    oQue: "uma decisão do Jonny ou da família foi gravada sem prompt por trás dela",
    noTitulo: [/decisão d/i, /\bD\d\d\b —/],
  },
  {
    id: "recado-recuperado",
    oQue: "um recado que foi ao chat e não tinha chegado ao arquivo, recuperado e marcado como tal (D216)",
    noTitulo: [/recuperad/i],
  },
  {
    id: "fora-de-fila",
    oQue: "rodada a pedido direto do chat ou da Central, fora da fila — regra, levantamento ou conserto de forma",
    noTitulo: [/§\s*1/i, /da Central/i, /levantamento/i, /fora de fila/i],
  },
] as const;

export type ClasseDeRodada = (typeof CLASSES_DE_RODADA)[number]["id"];

export interface RecadoDoArquivo {
  /** O cabeçalho da seção, que é o texto que eu escrevi no dia. */
  titulo: string;
  /** O campo `<prompt>` do cabeçalho do bloco. */
  prompt: string;
}

export interface AncoraDoRecado {
  titulo: string;
  prompt: string;
  /** `prompt` quando o `<prompt>` nomeia um LAB-xx; senão a classe deduzida do título. */
  ancora: "prompt" | ClasseDeRodada | "ORFAO";
  porque: string;
}

/**
 * Os prompts que o cabeçalho nomeia — pode ser mais de um (`LAB-13 e LAB-14`).
 *
 * **E não são só os `LAB-xx`**: a primeira versão desta função casava `LAB-\d\d` e chamou de
 * ÓRFÃOS o `LF-01`, o `LF-FINAL` e o `LF-FINAL-2` — que são prompts de verdade, de outra
 * numeração. É o **terceiro** precedente da mesma família, e o item 002 mandou lembrar dele com
 * todas as letras: *régua que casa por nome exato mede ortografia, não conteúdo* (D137, D217).
 *
 * O que caracteriza um prompt é a **forma**: letras maiúsculas, hífen, e um sufixo que pode ser
 * número ou palavra — `LAB-07`, `LF-FINAL-2`, `T-35`. Não é a sigla.
 */
export function promptsDoCabecalho(prompt: string): string[] {
  return prompt.match(/\b[A-Z]{1,4}-[A-Z0-9]+(?:-[A-Z0-9]+)?\b/g) ?? [];
}

/**
 * A âncora de um recado: o prompt que ele nomeia, ou a classe de rodada que o título declara.
 *
 * **Órfão** é o recado que não nomeia prompt **e** cujo título não cai em nenhuma classe — ou
 * seja, uma rodada que aconteceu e não disse o que era. É exatamente o caso que a trava do D216
 * não via.
 */
export function ancorarRecado(r: RecadoDoArquivo): AncoraDoRecado {
  if (promptsDoCabecalho(r.prompt).length > 0) {
    return {
      ...r,
      ancora: "prompt",
      porque: `o cabeçalho nomeia ${promptsDoCabecalho(r.prompt).join(", ")}`,
    };
  }
  // O `<prompt>` já pode trazer a classe, quando o recado é novo e nasceu com ela.
  const declarada = CLASSES_DE_RODADA.find((c) => r.prompt.includes(c.id));
  if (declarada) {
    return { ...r, ancora: declarada.id, porque: "a classe está declarada no próprio cabeçalho" };
  }
  const pelaTitulo = CLASSES_DE_RODADA.filter((c) => c.noTitulo.some((p) => p.test(r.titulo)));
  if (pelaTitulo.length >= 1) {
    return {
      ...r,
      ancora: pelaTitulo[0]!.id,
      porque: `o título declara a classe: ${pelaTitulo[0]!.oQue}`,
    };
  }
  return {
    ...r,
    ancora: "ORFAO",
    porque:
      "o cabeçalho não nomeia prompt e o título não declara classe nenhuma — rodada que " +
      "aconteceu e não disse o que era",
  };
}

/** Lê os recados do acumulado: o título da seção e o `<prompt>` do bloco logo abaixo. */
export function lerRecados(acumulado: string): RecadoDoArquivo[] {
  const fora: RecadoDoArquivo[] = [];
  for (const pedaco of acumulado.split("\n## ").slice(1)) {
    const titulo = pedaco.split("\n")[0]!.trim();
    const m = /=== RECADO PARA O CHAT — [^·]+ · (.+?) ===/.exec(pedaco);
    if (m) fora.push({ titulo, prompt: m[1]!.trim() });
  }
  return fora;
}
