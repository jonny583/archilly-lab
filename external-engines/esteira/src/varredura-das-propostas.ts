/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A VARREDURA DA MINHA PRÓPRIA LISTA DE PROPOSTAS. (LAB-61)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A seção *"Proposto ao chat — não executar"* da [`FILA.md`] é a **minha** lista: o que eu
 * achei e não executei, porque prompt fora da fila não existe (§1-A). **E ela é lida.**
 * Quatro das filas que o chat escreveu saíram dela — *"três dos cinco saíram da minha
 * própria lista"*, *"é a quarta fila seguida assim"*.
 *
 * > **Lista que o chat usa para escrever fila é dívida minha**, e lista que ninguém
 * > revalida envelhece igual a comentário (D104, D136).
 *
 * # O que isto mede, e por que precisava de régua
 *
 * Medido no LAB-61: de **14** itens abertos, **cinco já estavam executados** — dois deles
 * eram **cópias** de itens riscados **na mesma lista**. Se o chat tivesse lido a lista
 * naquele dia, poderia ter mandado de volta trabalho já entregue.
 *
 * Três classes de problema, e cada uma tem regra:
 *
 * 1. **riscado sem executor** — item marcado como feito que não diz QUAL prompt o fez. Sem
 *    isso, "✅" é promessa, não registro;
 * 2. **aberto sem motivo declarado** — item vivo que não diz POR QUE segue vivo. É o que
 *    deixa um item executado parecer pendente: ninguém tem o que reconferir;
 * 3. **cópia de item riscado** — e ela pede **DOIS sinais**, não um.
 *
 * # Por que a cópia precisa de dois sinais, e isso foi medido dentro do prompt
 *
 * A primeira versão desta régua casava **só pelo número da decisão**: item aberto que cita
 * uma decisão já citada num item riscado era cópia. Ela achou as duas cópias de verdade — e
 * **acusou uma terceira que não é cópia**: o item do `faceDeRua` nulo cita `D156` porque foi
 * o **LAB-43 que o achou**, o mesmo prompt que propôs o detector de prova velha. Mesma
 * origem, achado diferente.
 *
 * > **Régua que eu afrouxaria para caber no meu número é enfeite** (D172). Então ela foi
 * > **estreitada**: cópia é decisão compartilhada **E** título sobreposto acima do limiar
 * > declarado.
 *
 * E o título **não** se casa por igualdade: a cópia da passagem externa diz *"põe lote"* num
 * item e *"o motor põe lote"* no outro, e régua de título exato mede **ortografia** (D137).
 * O que se mede é **sobreposição de palavras significativas**, com o limiar escrito abaixo.
 *
 * O vocabulário do motivo é **fechado** (`MOTIVOS_DE_SEGUIR_ABERTO`): motivo que não está
 * na lista não vale, senão "segue aberto porque sim" passaria.
 */

/** Por que um item PODE seguir aberto. Conjunto fechado — e a trava reprova um sétimo. */
export const MOTIVOS_DE_SEGUIR_ABERTO = [
  {
    id: "prompt-novo",
    oQue: "é prompt novo, e prompt fora da fila não existe (§1-A). Só o chat o transforma em item de fila",
  },
  {
    id: "aguardando-o-jonny",
    oQue: "depende de decisão de uma pessoa, e mora em `PENDENCIAS_JONNY.md`",
  },
  {
    id: "aguardando-outro-repositorio",
    oQue: "depende de documento ou código que ainda não existe fora daqui",
  },
  {
    id: "escopo-novo",
    oQue: "é trabalho novo, não dívida: mexeria em coisa que ninguém pediu para mexer",
  },
  {
    id: "nao-medido",
    oQue: "é suspeita sem medição, e por isso não foi atribuída (§6)",
  },
  {
    id: "depois-do-mvp",
    oQue: "o chat o adiou por escrito para depois do MVP",
  },
] as const;

export type MotivoDeSeguirAberto = (typeof MOTIVOS_DE_SEGUIR_ABERTO)[number]["id"];

export interface Proposta {
  /** Linha onde o item começa, 1-based. */
  linha: number;
  /** O texto inteiro do item, já juntado das linhas de continuação. */
  texto: string;
  riscado: boolean;
  /** Qual prompt o executou — só em item riscado. */
  executadoPor: string | null;
  /** Os números de decisão que o item cita. É a chave da CÓPIA. */
  decisoes: string[];
  /** O motivo declarado de seguir aberto — só em item aberto. */
  motivo: MotivoDeSeguirAberto | null;
}

/**
 * Quanto dois títulos têm de se sobrepor para serem **o mesmo assunto**.
 *
 * Medido nos três casos deste prompt, na árvore de ANTES do conserto: as duas cópias de
 * verdade dão **1,00** e **1,00**; o falso positivo do `faceDeRua` dá **0,00**. O limiar
 * fica em **0,6** — longe das duas pontas, e o número de cada caso sai na prova para ninguém
 * precisar confiar nele.
 *
 * *Este comentário dizia "1,00 e 0,88" na primeira versão, escrito de cabeça. Medido, são
 * dois 1,00 — e foi a própria ferramenta que desmentiu, dentro do prompt (D185).*
 */
export const SOBREPOSICAO_MINIMA_DO_TITULO = 0.6;

/** O título do item: o primeiro trecho em negrito, que é como esta lista sempre os abre. */
export function tituloDe(texto: string): string {
  const m = /\*\*(.+?)\*\*/.exec(texto.replace(/^- ~*/, ""));
  return m ? m[1]! : texto.replace(/^- ~*/, "").slice(0, 80);
}

/** Palavras que contam na sobreposição: as de quatro letras ou mais, sem marcação. */
function palavrasDe(titulo: string): Set<string> {
  return new Set(
    titulo
      .toLowerCase()
      .replace(/[`*_]/g, " ")
      .split(/[^0-9a-zà-ÿ]+/)
      .filter((w) => w.length >= 4),
  );
}

/** Sobreposição = interseção sobre o MENOR dos dois conjuntos. Zero quando um é vazio. */
export function sobreposicaoDeTitulo(a: string, b: string): number {
  const pa = palavrasDe(a);
  const pb = palavrasDe(b);
  if (pa.size === 0 || pb.size === 0) return 0;
  let n = 0;
  for (const w of pa) if (pb.has(w)) n += 1;
  return Number((n / Math.min(pa.size, pb.size)).toFixed(2));
}

/** A marca fixa do motivo, no fim do item aberto. Forma única, para a régua não adivinhar. */
const MARCA_DO_MOTIVO = /\*\*Segue aberto:\*\*\s*`([a-z-]+)`/;
/** A marca do executor, no item riscado. */
const MARCA_DO_EXECUTOR = /✅\s*\*\*executad[oa] no (LAB-\d\d)\*\*/;

/**
 * Lê os itens da seção cujo título casa `tituloDaSecao`.
 *
 * A seção acaba no próximo título de qualquer nível — e não no fim do arquivo: a `FILA.md`
 * tem **sete** seções cujo título fala de proposta, e só uma é a LISTA. As outras seis são
 * prosa, e contá-las como lista daria zero itens em seis lugares e esconderia a única que
 * importa.
 */
export function lerPropostas(texto: string, tituloDaSecao = "## Proposto ao chat — não executar"): Proposta[] {
  const linhas = texto.split("\n");
  const ini = linhas.findIndex((l) => l.startsWith(tituloDaSecao));
  if (ini < 0) return [];
  let fim = linhas.length;
  for (let j = ini + 1; j < linhas.length; j++) {
    if (/^#{1,4} /.test(linhas[j]!)) {
      fim = j;
      break;
    }
  }
  const itens: Proposta[] = [];
  let atual: { linha: number; partes: string[] } | null = null;
  const fechar = () => {
    if (!atual) return;
    const texto = atual.partes.join(" ").replace(/\s+/g, " ").trim();
    const riscado = texto.startsWith("- ~~");
    const exec = MARCA_DO_EXECUTOR.exec(texto);
    const mot = MARCA_DO_MOTIVO.exec(texto);
    itens.push({
      linha: atual.linha,
      texto,
      riscado,
      executadoPor: exec ? exec[1]! : null,
      decisoes: [...new Set([...texto.matchAll(/\bD(\d{2,3})\b/g)].map((m) => `D${m[1]}`))].sort(),
      motivo: mot ? (mot[1] as MotivoDeSeguirAberto) : null,
    });
    atual = null;
  };
  for (let j = ini + 1; j < fim; j++) {
    const l = linhas[j]!;
    if (l.startsWith("- ")) {
      fechar();
      atual = { linha: j + 1, partes: [l] };
    } else if (atual && l.startsWith("  ")) {
      atual.partes.push(l.trim());
    }
  }
  fechar();
  return itens;
}

export interface ProblemaDeProposta {
  classe:
    | "riscado-sem-executor"
    | "aberto-sem-motivo"
    | "copia-de-item-riscado"
    | "motivo-fora-do-vocabulario"
    | "proposta-que-vive-so-em-prosa";
  linha: number;
  oQue: string;
}

/**
 * As propostas que nasceram em PROSA, numa seção `### Proposto ao chat, saído do LAB-xx`.
 *
 * **O buraco que isto fecha:** a LISTA é o que o chat lê para escrever fila — quatro filas
 * saíram dela. Proposta que mora só numa seção de prosa, no meio de duzentas linhas de
 * relatório, é proposta que o chat encontra por sorte. Então cada seção dessas tem de ser
 * **citada por algum item da lista**.
 *
 * **E "citada" é no lugar da gramática onde o nome significa origem, não em qualquer lugar.**
 * A primeira versão aceitava `texto.includes("LAB-59")`, e a sabotagem do LAB-61 **PASSOU**:
 * tirei a citação de origem do item e ele continuou aprovado, porque o nome do prompt
 * aparecia no **caminho da prova** (`docs/provas/LAB-59/…`). *Régua que lê MENÇÃO em vez da
 * citação é o D142* — lá ela leu a palavra em vez do `import`; aqui, o caminho de arquivo em
 * vez da origem. A citação de origem é a forma que esta lista sempre usou: `(LAB-xx` entre
 * parênteses, logo depois do título.
 */
export function citaAOrigem(texto: string, prompt: string): boolean {
  return new RegExp(`\\(${prompt}\\b`).test(texto);
}
export function secoesDePropostaEmProsa(texto: string): { linha: number; prompt: string }[] {
  const linhas = texto.split("\n");
  const achados: { linha: number; prompt: string }[] = [];
  for (const [i, l] of linhas.entries()) {
    const m = /^#{2,4} Proposto ao chat, saído do (LAB-\d\d)/.exec(l);
    if (m) achados.push({ linha: i + 1, prompt: m[1]! });
  }
  return achados;
}

/** As classes de problema, medidas. Lista vazia é a única saída aceitável. */
export function conferirPropostas(
  itens: readonly Proposta[],
  prosa: readonly { linha: number; prompt: string }[] = [],
): ProblemaDeProposta[] {
  const p: ProblemaDeProposta[] = [];
  const vocabulario = new Set<string>(MOTIVOS_DE_SEGUIR_ABERTO.map((m) => m.id));
  const riscados = itens.filter((i) => i.riscado);
  for (const i of itens) {
    const curto = i.texto.replace(/^- ~*/, "").slice(0, 90);
    if (i.riscado) {
      if (!i.executadoPor) {
        p.push({
          classe: "riscado-sem-executor",
          linha: i.linha,
          oQue: `item riscado sem dizer QUAL prompt o executou: "${curto}…"`,
        });
      }
      continue;
    }
    if (!i.motivo) {
      p.push({
        classe: "aberto-sem-motivo",
        linha: i.linha,
        oQue: `item aberto sem \`**Segue aberto:** \`motivo\`\`: "${curto}…"`,
      });
    } else if (!vocabulario.has(i.motivo)) {
      p.push({
        classe: "motivo-fora-do-vocabulario",
        linha: i.linha,
        oQue: `motivo \`${i.motivo}\` não está em MOTIVOS_DE_SEGUIR_ABERTO: "${curto}…"`,
      });
    }
    // A CÓPIA pede os DOIS sinais: decisão compartilhada E título sobreposto.
    for (const r of riscados) {
      const comuns = i.decisoes.filter((d) => r.decisoes.includes(d));
      if (comuns.length === 0) continue;
      const sobre = sobreposicaoDeTitulo(tituloDe(i.texto), tituloDe(r.texto));
      if (sobre < SOBREPOSICAO_MINIMA_DO_TITULO) continue;
      p.push({
        classe: "copia-de-item-riscado",
        linha: i.linha,
        oQue:
          `cita ${comuns.join(", ")} e o título se sobrepõe ${sobre} ao do item RISCADO da linha ` +
          `${r.linha} (limiar ${SOBREPOSICAO_MINIMA_DO_TITULO}) — é cópia: "${curto}…"`,
      });
    }
  }
  for (const s of prosa) {
    if (!itens.some((i) => citaAOrigem(i.texto, s.prompt))) {
      p.push({
        classe: "proposta-que-vive-so-em-prosa",
        linha: s.linha,
        oQue: `a seção de proposta do ${s.prompt} não é citada por item nenhum da lista — o chat a acharia por sorte`,
      });
    }
  }
  return p;
}
