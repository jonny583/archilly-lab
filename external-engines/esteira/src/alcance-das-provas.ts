/**
 * O ALCANCE DAS PROVAS — quantas se conferem contra SI MESMAS. (LAB-79, item 012)
 *
 * # A pergunta do item, e ela vem com uma advertência própria
 *
 * > *"Quantas provas do repositório a trava de hoje confere **contra si mesmas** — isto é, lendo
 * > o número gravado e conferindo que o arquivo é coerente — em vez de **reexecutar** a varredura
 * > e comparar? Diga o número, e diga **quantas são**, para que 'verde' não volte a ser uma frase
 * > sobre um universo não medido."*
 *
 * E o motivo de ser esta pergunta, e não outra:
 *
 * > **Lista que cresce é dívida visível. Trava que confere consigo mesma é dívida invisível — e
 * > ela sai VERDE.**
 *
 * Medido no LAB-60: a prova do LAB-57 estava **velha no momento em que foi commitada** (dizia 1,
 * a ferramenta dizia 10) e **nada no verde reprovou isso**.
 *
 * # A regra que esta casa já tinha, e que este módulo estende
 *
 * > **Detector mede da FONTE; não compara prova com prova** (D144).
 *
 * Ela nasceu no LAB-33, foi escrita no LAB-39 e tem escopo publicado em
 * `escopo-do-detector.ts` — para **DUAS** provas. O universo tem **sessenta e sete**.
 *
 * # As TRÊS classes, e a terceira é o ACHADO deste prompt
 *
 * O item sugeriu **duas** — *estado de agora* (regerável) e *evento* (nunca) — e disse: *"se essa
 * divisão não couber em alguma prova, **ela é o achado** — escreva qual e por quê, em vez de
 * forçá-la."* Ela não couberam, e o contra-exemplo é de um prompt atrás:
 *
 * **A prova do LAB-78 mede lotes de um plano gerado pelo motor de um VIZINHO, num commit dele.**
 * Ela parece estado de agora — mede o que existe. Mas regerá-la **muda o sujeito**: o LAB-59
 * mediu com `motor-testfit` em `4181e95`, o LAB-78 rodou em `6cf6396`, e **dois dos quatro lotes
 * deixaram de existir** — id de lote não sobrevive a mudança de plantio.
 *
 * > **PROVA MEDIDA CONTRA O CLONE DE UM VIZINHO NÃO É ESTADO DE AGORA NEM EVENTO: ela afirma o
 * > presente DE OUTRO REPOSITÓRIO, num commit dele.** Regerá-la em silêncio não atualiza a
 * > medição — **troca a pergunta** e some com a resposta antiga.
 *
 * Então ela se regera **declarando o commit**, e nunca sem ele. É a mesma lição do carimbo do
 * LAB-68 e do segundo eixo do LAB-74, agora aplicada a *quando* uma prova pode ser reescrita.
 */

/**
 * Como uma prova é conferida HOJE. **Fechado**, e as três primeiras são o que o item perguntou.
 *
 * - `remedida-da-fonte` — alguma trava reconfere o número **contra quem o produz** (D144);
 * - `so-a-forma` — só a §7 a toca: confere que as **chaves** estão lá. *Forma não é número*;
 * - `sem-trava` — nenhuma trava a nomeia. Não é "aprovada": é **não lida**;
 * - `remedida-sem-escopo-declarado` — alguma trava reconfere **parte** dela, e **qual parte não
 *   está publicada**. É o caso mais perigoso: parece conferida e ninguém sabe até onde.
 */
export const COMO_SE_CONFERE = [
  "remedida-da-fonte",
  "remedida-sem-escopo-declarado",
  "so-a-forma",
  "sem-trava",
] as const;
export type ComoSeConfere = (typeof COMO_SE_CONFERE)[number];

/**
 * O que a prova AFIRMA — e é isto que decide se ela pode ser regerada.
 *
 * - `estado-de-agora` — quantas coisas existem hoje. **Pode ser regerada**: presente velho é
 *   presente errado;
 * - `evento` — o antes de um conserto, a sabotagem que reprovou, a medição que motivou uma
 *   decisão. **Nunca se regera**: regerá-la apaga o momento. É o D182 inteiro;
 * - `estado-de-outro-repositorio` — **o achado deste prompt**: ela afirma o presente de um clone
 *   vizinho, num commit dele. Regera-se **declarando o commit**, e nunca sem ele.
 */
export const O_QUE_A_PROVA_AFIRMA = ["estado-de-agora", "evento", "estado-de-outro-repositorio"] as const;
export type OQueAProvaAfirma = (typeof O_QUE_A_PROVA_AFIRMA)[number];

export interface ProvaMedida {
  /** O caminho dentro de `docs/provas/`. */
  caminho: string;
  comoSeConfere: ComoSeConfere;
  /** As travas que a nomeiam, medidas lendo os arquivos de teste. */
  travas: string[];
}

export interface AlcanceDasProvas {
  universo: number;
  pastas: number;
  porComoSeConfere: Record<string, number>;
  /** Quantas têm **escopo publicado** chave por chave. Hoje: as duas do `escopo-do-detector`. */
  comEscopoPublicado: number;
  semEscopoPublicado: number;
  /** A frase para o relatório e o recado: ela DIZ os números, porque o número é a resposta. */
  comoSeDiz: string;
}

/**
 * A conta, e ela **fecha**: a soma por classe é o universo.
 *
 * *Conferência que não publica o tamanho do universo que leu passa lendo zero* — a lição do
 * LAB-76, e o item 012 a cobra com todas as letras.
 */
export function medirOAlcance(
  provas: readonly ProvaMedida[],
  comEscopoPublicado: number,
): AlcanceDasProvas {
  const porComoSeConfere: Record<string, number> = {};
  for (const c of COMO_SE_CONFERE) porComoSeConfere[c] = 0;
  for (const p of provas) {
    porComoSeConfere[p.comoSeConfere] = (porComoSeConfere[p.comoSeConfere] ?? 0) + 1;
  }
  const pastas = new Set(provas.map((p) => p.caminho.split("/")[0])).size;
  const soForma = porComoSeConfere["so-a-forma"] ?? 0;
  const semTrava = porComoSeConfere["sem-trava"] ?? 0;
  return {
    universo: provas.length,
    pastas,
    porComoSeConfere,
    comEscopoPublicado,
    semEscopoPublicado: provas.length - comEscopoPublicado,
    comoSeDiz:
      `${provas.length} provas em ${pastas} pastas · ` +
      `${porComoSeConfere["remedida-da-fonte"]} remedidas da fonte com escopo publicado · ` +
      `${porComoSeConfere["remedida-sem-escopo-declarado"]} remedidas em parte SEM escopo declarado · ` +
      `${soForma} só a forma (§7) · ${semTrava} sem trava nenhuma · ` +
      `${provas.length - comEscopoPublicado} sem escopo publicado`,
  };
}

/** A soma por classe bate com o universo? Partição que não fecha não é partição (D212). */
export function aContaDoAlcanceFecha(a: AlcanceDasProvas): boolean {
  const soma = Object.values(a.porComoSeConfere).reduce((s, n) => s + n, 0);
  return soma === a.universo && a.comEscopoPublicado + a.semEscopoPublicado === a.universo;
}

/**
 * Uma prova pode ser REGERADA dentro de uma trava?
 *
 * **Esta função é a fronteira do D182, e ela diz NÃO por padrão.** O item 012 manda parar na
 * fronteira se a trava quiser escrever em `docs/provas/` sem que a divisão diga que aquela prova
 * é de estado — *"e o D182 não se afrouxa de madrugada"*.
 */
export interface VeredictoDaRegeneracao {
  pode: boolean;
  porque: string;
}

export function podeSerRegerada(
  afirma: OQueAProvaAfirma,
  commitDoVizinhoDeclarado: boolean,
): VeredictoDaRegeneracao {
  if (afirma === "evento") {
    return {
      pode: false,
      porque:
        "é prova de EVENTO: ela afirma um momento — o antes de um conserto, a sabotagem que " +
        "reprovou, a medição que motivou uma decisão. Regerá-la APAGA o momento, e é o D182 inteiro",
    };
  }
  if (afirma === "estado-de-outro-repositorio") {
    if (!commitDoVizinhoDeclarado) {
      return {
        pode: false,
        porque:
          "ela afirma o presente de um CLONE VIZINHO e o commit dele NÃO está declarado. Regerar " +
          "assim não atualiza a medição: TROCA A PERGUNTA em silêncio — o LAB-78 perdeu dois de " +
          "quatro lotes exatamente assim, porque o motor andou de `4181e95` para `6cf6396`",
      };
    }
    return {
      pode: true,
      porque:
        "ela afirma o presente de um clone vizinho E o commit dele está declarado na prova: a " +
        "regeração diz contra o quê foi medida, e quem comparar duas versões vê o sujeito mudar",
    };
  }
  return {
    pode: true,
    porque: "é prova de ESTADO DE AGORA: ela afirma o presente, e presente velho é presente errado",
  };
}

/**
 * O VALOR QUE A FONTE DIZ — um por chave `medida` do escopo declarado.
 *
 * Quem monta esta lista é a trava, chamando os módulos que PRODUZEM cada número. Este módulo
 * não importa fonte nenhuma de propósito: assim ele fica puro, e a sabotagem pode plantar uma
 * prova velha sem precisar mexer em módulo nenhum.
 */
export interface ValorDaFonte {
  chave: string;
  daFonte: unknown;
}

export interface ProblemaDaProva {
  tipo: "chave-ausente-na-prova" | "numero-velho" | "chave-da-prova-sem-escopo" | "escopo-sem-chave";
  /** O NOME da prova, sempre — é o que o item 012 exige da reprovação. */
  prova: string;
  chave: string;
  oQue: string;
}

/**
 * REMEDE uma prova contra a fonte, e reprova **pelo nome da prova**.
 *
 * O item 012 é explícito sobre a guarda da guarda: *"com a prova em dia tem de passar; com a
 * prova velha de propósito tem de reprovar **pelo nome da prova**"*. Por isso cada problema
 * carrega `prova` — uma reprovação que não diz qual arquivo está velho manda quem conserta
 * procurar.
 *
 * Confere também os **dois sentidos do escopo** (a lição do D164, *escopo não encolhe por
 * decisão, encolhe por comodidade*): chave do escopo que não está na prova, e chave da prova que
 * ninguém classificou.
 */
export function remedirUmaProva(
  caminho: string,
  prova: Record<string, unknown>,
  escopo: Record<string, string>,
  daFonte: readonly ValorDaFonte[],
): ProblemaDaProva[] {
  const problemas: ProblemaDaProva[] = [];

  for (const chave of Object.keys(escopo)) {
    if (!(chave in prova)) {
      problemas.push({
        tipo: "escopo-sem-chave",
        prova: caminho,
        chave,
        oQue: `o escopo classifica \`${chave}\`, e a prova não a tem — ou a prova mudou de forma, ou o escopo envelheceu`,
      });
    }
  }
  for (const chave of Object.keys(prova)) {
    if (!(chave in escopo)) {
      problemas.push({
        tipo: "chave-da-prova-sem-escopo",
        prova: caminho,
        chave,
        oQue: `a prova traz \`${chave}\` e NINGUÉM a classificou: escopo que não cresce com a prova encolhe sozinho (D164)`,
      });
    }
  }

  for (const { chave, daFonte: esperado } of daFonte) {
    if (!(chave in prova)) {
      problemas.push({
        tipo: "chave-ausente-na-prova",
        prova: caminho,
        chave,
        oQue: `a fonte tem \`${chave}\` para remedir e a prova não a traz`,
      });
      continue;
    }
    const naProva = JSON.stringify(prova[chave]);
    const naFonte = JSON.stringify(esperado);
    if (naProva !== naFonte) {
      problemas.push({
        tipo: "numero-velho",
        prova: caminho,
        chave,
        oQue:
          `PROVA VELHA em \`${caminho}\`: a chave \`${chave}\` diz ${naProva} e a FONTE diz ` +
          `${naFonte}. Regere a prova com a ferramenta dela — não ajuste o número à mão`,
      });
    }
  }

  return problemas;
}
