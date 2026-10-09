/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O ESCOPO DE CADA INSTRUMENTO, DECLARADO. (item 003 da caixa de entrada)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Duas coisas leem o `RECADOS.md` e dizem se ele está certo, e **elas não conferem a mesma
 * coisa**. Isso saiu num recado do LAB-66 — e recado não é contrato:
 *
 * > *"Amanhã alguém roda só uma das duas e conclui que está coberto."*
 *
 * Por isso o escopo de cada uma mora **aqui**, em código que uma trava confere contra os
 * instrumentos rodando, e a leitura humana mora em
 * `docs/referencia/FERRAMENTA_E_TRAVA.md`. *Comentário não se revalida* (D104); tabela em
 * documento tampouco — então a tabela do documento é **conferida** contra esta declaração, e a
 * declaração é conferida contra os instrumentos rodando.
 *
 * # O que a diferença de escopo já custou, medido
 *
 * A Central mandou o `<app>` do cabeçalho virar o nome do aplicativo. A **trava** aprendeu no
 * mesmo dia (D228); a **ferramenta** não, porque ela não roda no verde. Resultado: a trava
 * verde e a ferramenta acusando `LAB-68, LAB-69` de não terem recado, com os dois tendo
 * (D231). *Escopo que ninguém declara não fica parado: ele se afasta.*
 *
 * # O nome do instrumento, e ele não se supõe
 *
 * O item 003 chama a ferramenta de `npm run quebrar`. **Esse script não existe neste
 * repositório** — nenhum dos dois `package.json` o declara. A ferramenta do par é
 * `npm run lab66` (`external-engines/esteira/ferramentas/lab66.ts`), e a trava é
 * `tests/recado.test.ts` com `tests/classes-de-rodada.test.ts`. *Identificador não se supõe*
 * — vale para id de despertador e vale para nome de comando.
 */

/** Quem confere. `ferramenta` roda à mão; `trava` roda dentro do `conferir.sh`. */
export type Instrumento = "ferramenta" | "trava";

export interface Verificacao {
  id: string;
  /** O que ela confere, em uma linha. */
  oQue: string;
  /** Quem a tem. Lista vazia é proibida: verificação de ninguém não é verificação. */
  quem: Instrumento[];
  /**
   * Ela **reprova** (muda o veredicto) ou só **mede** (imprime número)?
   *
   * A diferença importa mais do que parece: tudo que é **só da ferramenta** é medição, e
   * medição não barra entrega nenhuma.
   */
  reprova: boolean;
  /** Onde ela mora, para quem for conferir esta declaração contra o código. */
  onde: string;
  /**
   * A frase pela qual o documento a cita, **declarada e não adivinhada**.
   *
   * *A primeira versão desta trava escolhia a marca por heurística — a primeira palavra longa
   * da frase `oQue` — e reprovou o documento por falar de "bloco do arquivo" onde a declaração
   * diz "bloco de código". Régua que casa por palavra que ninguém escolheu mede ortografia*
   * (D137). A comparação é feita com o documento sem negrito e sem crase, em minúsculas.
   */
  marcaNoDocumento: string;
  /**
   * Quantos testes da trava a implementam. `0` quando ela é só da ferramenta.
   *
   * **Isto é o que impede esta declaração de envelhecer:** a soma tem de ser o número de
   * testes que os arquivos de trava realmente têm, contado neles. *Declaração que ninguém
   * confere contra a coisa rodando apodrece como comentário* (D104).
   */
  quantosTestes: number;
}

/** Os arquivos de teste que formam a TRAVA deste par. */
export const ARQUIVOS_DA_TRAVA = ["tests/recado.test.ts", "tests/classes-de-rodada.test.ts"];

/** A ferramenta do par, e o nome dela não se supõe. */
export const A_FERRAMENTA = {
  comando: "npm run lab66",
  arquivo: "ferramentas/lab66.ts",
  /** O que o item 003 chamou, e que não existe em nenhum `package.json` do repositório. */
  oNomeQueOItemSupos: "npm run quebrar",
  noVerde: false,
};

/**
 * As treze verificações do par, e de quem é cada uma.
 *
 * Conferido contra o código em `tests/escopo-dos-instrumentos.test.ts`: o número de testes
 * declarados aqui tem de ser o número de testes que os arquivos de trava realmente têm, e cada
 * caminho de reprovação da ferramenta tem de estar nesta lista.
 */
export const VERIFICACOES: Verificacao[] = [
  {
    id: "bloco-abre-com-recado",
    oQue: "todo bloco de código do `RECADOS.md` abre com `=== RECADO PARA O CHAT` (§1)",
    quem: ["ferramenta", "trava"],
    reprova: true,
    onde: "lab66.ts `abremComRecado` · recado.test.ts «UM BLOCO SÓ»",
    marcaNoDocumento: "abre com o recado",
    quantosTestes: 1,
  },
  {
    id: "relatorio-sem-recado",
    oQue: "todo relatório `docs/relatorios/LAB-xx.md` tem recado no arquivo citando aquele prompt (D216)",
    quem: ["ferramenta", "trava"],
    reprova: true,
    onde: "lab66.ts `semRecado` · recado.test.ts «TODO relatório de prompt tem recado»",
    marcaNoDocumento: "tem recado no arquivo",
    quantosTestes: 1,
  },
  {
    id: "conta-do-acumulado",
    oQue: "quantos blocos, cabeçalhos, cabeçalhos compostos e relatórios de prompt existem",
    quem: ["ferramenta"],
    reprova: false,
    onde: "lab66.ts — as quatro linhas do `console.log`",
    marcaNoDocumento: "quantos blocos, cabeçalhos, compostos e relatórios existem",
    quantosTestes: 0,
  },
  {
    id: "buraco-medido",
    oQue: "quantos recados têm `<prompt>` igual a `—`, que é o buraco da trava do D216",
    quem: ["ferramenta"],
    reprova: false,
    onde: "lab66.ts `semPromptNomeado`",
    marcaNoDocumento: "quantos recados têm <prompt> igual a",
    quantosTestes: 0,
  },
  {
    id: "prova-em-json",
    oQue: "gravar os números crus em `docs/provas/LAB-66/o-acumulado-dos-recados.json` (§7)",
    quem: ["ferramenta"],
    reprova: false,
    onde: "lab66.ts `writeFileSync`",
    marcaNoDocumento: "gravar os números crus em json",
    quantosTestes: 0,
  },
  {
    id: "marca-dentro-do-bloco",
    oQue: "a linha `--- O QUE VAI JUNTO ---` nunca aparece solta fora de um bloco (§1)",
    quem: ["trava"],
    reprova: true,
    onde: "recado.test.ts «o que vai junto fica DENTRO do bloco»",
    marcaNoDocumento: "nunca solto fora de um bloco",
    quantosTestes: 1,
  },
  {
    id: "acumulado-nomeia-quais",
    oQue: "bloco `ACUMULADO`, quando houver, nomeia na segunda linha quais recados ele junta",
    quem: ["trava"],
    reprova: true,
    onde: "recado.test.ts «bloco ACUMULADO … nomeia os recados»",
    marcaNoDocumento: "nomeia quais recados ele junta",
    quantosTestes: 1,
  },
  {
    id: "acumulado-aceita-fora-de-fila",
    oQue: "a régua do acumulado aceita rodada sem número (`§1`) e recusa lista sem item nomeado (D219)",
    quem: ["trava"],
    reprova: true,
    onde: "recado.test.ts «o ACUMULADO aceita rodada FORA DE FILA»",
    marcaNoDocumento: "aceita rodada sem número e recusa lista vaga",
    quantosTestes: 1,
  },
  {
    id: "a-trava-reprova-de-verdade",
    oQue: "prompt inventado não tem recado e o composto `LAB-13 e LAB-14` tem — os dois lados da régua (D217)",
    quem: ["trava"],
    reprova: true,
    onde: "recado.test.ts «a trava do recado ausente REPROVA de verdade»",
    marcaNoDocumento: "inventado reprova, composto passa",
    quantosTestes: 1,
  },
  {
    id: "cabecalho-e-fim",
    oQue: "cada recado abre no formato `— <app> · <prompt> ===` e fecha com `=== FIM ===` (D228)",
    quem: ["trava"],
    reprova: true,
    onde: "recado.test.ts «o acumulado tem recado, e cada um abre e fecha»",
    marcaNoDocumento: "fecha com === fim ===",
    quantosTestes: 1,
  },
  {
    id: "teto-de-doze-linhas",
    oQue: "o ÚLTIMO recado tem no máximo doze linhas — o teto é do recado, não do bloco (§1)",
    quem: ["trava"],
    reprova: true,
    onde: "recado.test.ts «O TETO»",
    marcaNoDocumento: "no máximo doze linhas",
    quantosTestes: 1,
  },
  {
    id: "cinco-perguntas",
    oQue: "o último recado responde aos cinco campos do formato",
    quem: ["trava"],
    reprova: true,
    onde: "recado.test.ts «o último recado responde às cinco perguntas»",
    marcaNoDocumento: "responde aos cinco campos do formato",
    quantosTestes: 1,
  },
  {
    id: "ancora-da-rodada",
    oQue: "todo recado tem âncora — um prompt ou uma das seis classes de rodada, vocabulário fechado (D229)",
    quem: ["trava"],
    reprova: true,
    onde: "classes-de-rodada.test.ts — as nove travas do item 002",
    marcaNoDocumento: "prompt ou classe de vocabulário fechado",
    quantosTestes: 9,
  },
];

export function soDa(quem: Instrumento): Verificacao[] {
  return VERIFICACOES.filter((v) => v.quem.length === 1 && v.quem[0] === quem);
}

export function aIntersecao(): Verificacao[] {
  return VERIFICACOES.filter((v) => v.quem.length === 2);
}

/** Quantos testes a trava inteira implementa, pela declaração. */
export function testesDeclarados(): number {
  return VERIFICACOES.reduce((soma, v) => soma + v.quantosTestes, 0);
}

// ── As quatro sabotagens, e qual instrumento acusou cada uma ───────────────

export interface Sabotagem {
  n: number;
  /** O que foi estragado no `RECADOS.md`. É também a frase pela qual o documento a cita. */
  oQue: string;
  /** A verificação que **deveria** pegar. */
  deveriaPegar: string;
  /** Por que o instrumento que não pegou não pegou — nunca "não sei". */
  oMotivoDaDiferenca: string;
}

export const SABOTAGENS: Sabotagem[] = [
  {
    n: 1,
    oQue: "um bloco com a lista ACIMA do recado",
    deveriaPegar: "bloco-abre-com-recado",
    oMotivoDaDiferenca: "está na interseção — os dois têm a mesma régua, e os dois pegam",
  },
  {
    n: 2,
    oQue: "o recado de um prompt some do arquivo",
    deveriaPegar: "relatorio-sem-recado",
    oMotivoDaDiferenca:
      "os dois TINHAM a régua, mas a da trava era mais LARGA: o conserto do D217 lhe deu dois " +
      "escapes de texto (`recados LAB-xx` e `LAB-xx,`) que casavam o nome em qualquer lugar do " +
      "arquivo. Medido em 48 dos 61 relatórios, e CONSERTADO no item 003 — esta diferença não " +
      "era de propósito (D232). Por isso a nº 2 roda nos dois lados: apagando o recado de um " +
      "prompt fora dos escapes e de um dentro deles, que é a origem que faltava no LAB-66",
  },
  {
    n: 3,
    oQue: "o cabeçalho composto perde um dos dois prompts",
    deveriaPegar: "relatorio-sem-recado",
    oMotivoDaDiferenca: "está na interseção, e o prompt perdido não tem escape de texto para cair",
  },
  {
    n: 4,
    oQue: "bloco `ACUMULADO` sem nomear quais recados ele junta",
    deveriaPegar: "acumulado-nomeia-quais",
    oMotivoDaDiferenca: "é só da trava: a ferramenta nunca leu a segunda linha do recado",
  },
];

// ── A linha mais valiosa: o que NINGUÉM pega ──────────────────────────────

export interface Buraco {
  oQue: string;
  /** A frase pela qual o documento o cita, declarada e não adivinhada. */
  marcaNoDocumento: string;
  /** Por que nenhum dos dois morde. */
  porQue: string;
  /** O que faria pegar — sem isto, o buraco é lamento e não item. */
  oQueFariaPegar: string;
}

/**
 * **O que escapa dos DOIS.** É a parte que costuma faltar, e o item 003 disse exatamente isso.
 *
 * Nenhuma destas é hipótese: as três primeiras já aconteceram, com decisão numerada.
 */
export const O_QUE_NINGUEM_PEGA: Buraco[] = [
  {
    oQue: "recado que nunca foi escrito em rodada que não gera relatório nem commit",
    marcaNoDocumento: "recado que nunca foi escrito",
    porQue:
      "as duas réguas leem o que ESTÁ no arquivo. Rodada que não deixou rastro em lugar nenhum " +
      "não tem como ser cobrada por falta — foi assim que o recado do PR #85 se perdeu (D216)",
    oQueFariaPegar:
      "um contador de disparos do despertador fora do repositório, confrontado com o número de " +
      "recados do dia. É o item 004 da caixa de entrada, e ele abre essa conta",
  },
  {
    oQue: "recado gravado no arquivo e NÃO enviado ao GitHub",
    marcaNoDocumento: "recado gravado e não enviado",
    porQue:
      "os dois instrumentos rodam na minha máquina e leem o arquivo do disco. Commit sem `push` " +
      "fica verde nos dois, e o chat — que lê o `RECADOS.md` direto do GitHub — não vê nada",
    oQueFariaPegar:
      "comparar o `RECADOS.md` do disco com o do `origin/main` antes de fechar a entrega. " +
      "Nenhum dos dois faz isso hoje, e é o buraco de maior consequência da lista",
  },
  {
    oQue: "recado completo, bem formado, e FALSO",
    marcaNoDocumento: "recado completo, bem formado, e falso",
    porQue:
      "nenhuma das treze verificações lê o conteúdo contra a realidade: um `Estado:` que diz " +
      "verde com a suíte vermelha passa pelos dois. O D110 é isso por duas semanas",
    oQueFariaPegar:
      "nada mecânico que eu saiba escrever hoje. Está aqui por honestidade: o par confere FORMA " +
      "e PRESENÇA, nunca VERDADE — e quem ler o verde dos dois precisa saber disso",
  },
  {
    oQue: "os nove recados antigos que passaram do teto de doze linhas",
    marcaNoDocumento: "os nove recados antigos",
    porQue:
      "a trava do teto olha **só o último** recado, de propósito: `RECADOS.md` é registro do que " +
      "foi enviado, e reescrever o histórico para caber em régua nova falsificaria o registro",
    oQueFariaPegar:
      "nada — e não deve. Este é buraco **escolhido**, não esquecido, e a escolha está no " +
      "cabeçalho do `recado.test.ts`",
  },
];
