/**
 * TODA ENTREGA DECLARA "CONFERIDO AQUI, NÃO NO GITHUB" — e nada perguntava se ela declarava. (LAB-139, item 900, a
 * dívida própria, D367)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §7, sob *"O CI AUTOMÁTICO ESTÁ DESLIGADO desde 08/10/2026"*: *"**Toda entrega declara "conferido aqui,
 * não no GitHub"**"* — e o `docs/COMO_RELIGAR_O_CI.md` diz o porquê: *"Verde na mão e verde na nuvem são afirmações
 * diferentes: no Render um teste já ficou verde na mão e vermelho na nuvem."* Quem lê o recado no GitHub e vê *"verde"*
 * tem de saber **qual** verde.
 *
 * Cumprida por disciplina: do LAB-67 (o prompt que desligou o CI, 08/10/2026) ao LAB-138, todo recado de entrega diz a
 * frase. Medido por mutação em 16/10/2026: tirar a frase do recado do LAB-138 → a suíte inteira da esteira com **as
 * mesmas 9 falhas de sempre** (as do `.wasm`) e 1 552 aprovadas. *Regra sem guarda*, a primeira espécie da dívida
 * própria — e, diferente do §1-A (LAB-138) e do §3 (LAB-135), **não estava quebrada no recado**: estava quebrada num
 * relatório só (abaixo).
 *
 * # O que se mediu, por LUGAR
 *
 * Os dois lugares que a família lê para saber como uma entrega foi conferida: o **recado** (`docs/relatorios/
 * RECADOS.md`, o que o chat lê primeiro) e o **relatório** (`docs/relatorios/LAB-NN.md`, a resposta inteira, que a
 * `COMO_FUNCIONA.md` manda gravar). Em 16/10/2026, 150 recados no arquivo:
 *
 * | o que | quantos | declara? |
 * |---|---|---|
 * | recado de entrega do LAB-67 ao LAB-138 (um prompt pode ter dois recados: o LAB-95) | 73 | **73 de 73** |
 * | recado de classe (`despertador-sem-item`, `decisao-registrada`) | sem prompt | não é entrega — fora do alcance |
 * | relatório do LAB-67 ao LAB-138 | 72 | **71 de 72**, com a frase quebrada pela coluna em dois (LAB-75, LAB-81) |
 *
 * O que sobra é o **LAB-118**: o recado declara, o relatório não diz como foi conferido em lugar nenhum. Fica como
 * exceção nomeada em {@link EXCECOES_HISTORICAS} — relatório gravado é registro do que foi enviado, e não se reescreve
 * (a mesma regra do LAB-130 e do LAB-138).
 *
 * # Como ela cobra
 *
 * - **o alcance é a vida do CI desligado**: do {@link PRIMEIRO_PROMPT_COBRADO} (o LAB-67, que desligou) ao
 *   {@link ULTIMO_PROMPT_COBRADO}, que é `null` enquanto o gatilho estiver comentado. **No dia em que o gatilho voltar,
 *   o teste reprova até alguém escrever ali o último prompt do CI desligado** — a regra acaba, e quem a encerra tem de
 *   dizer onde; o contrário (o número escrito com o gatilho ainda comentado) também reprova;
 * - a frase se lê pelo {@link comoARegraSeLe} (sem a quebra da coluna, sem o negrito), **com acento e sem caixa**:
 *   *"Conferido aqui, não\n  no GitHub"* declara; *"conferido aqui"* sozinho não — é a metade que diz qual verde;
 * - **recado de classe não é cobrado**: o `<prompt>` dele não tem `LAB-NN`, e o universo publica quantos ficaram fora;
 * - a exceção se confere nos dois sentidos: tem de continuar perdoando alguém, e só perdoa o problema que ela nomeia.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se a declaração é verdadeira** — se a sessão rodou mesmo o `conferir.sh`. O recado que diz *"conferido aqui"* sem
 *   ter conferido passa. Isso é fraude, não esquecimento, e é o esquecimento que a régua pega;
 * - **o número do verde** (*"1 552 pass e 9 fail"*): tem outra trava, a do portão contado (LAB-84, LAB-98);
 * - **a mesma frase com outras palavras** (*"verificado localmente"*): é régua de palavra, e a casa escreveu sempre a
 *   mesma frase desde o LAB-67 — a palavra diferente é o que ela tem de recusar, não de adivinhar;
 * - **o commit da mescla**: o assunto diz *"mesclado por git direto (D29)"* (LAB-138), não como foi conferido; quem lê o
 *   assunto lê o `git`, e quem lê o `git` lê o recado ao lado.
 */
import { comoARegraSeLe } from "./texto-das-regras.ts";

/** A frase da regra, conferida no teste onde ela mora (o `CLAUDE.md` §7). */
export const A_REGRA = 'Toda entrega declara "conferido aqui, não no GitHub"';

/** A declaração, como a casa a escreve desde o LAB-67 — comparada sem caixa, com acento. */
export const DECLARACAO = "conferido aqui, não no GitHub";

/** O prompt que desligou o CI (08/10/2026) — o primeiro cujo recado e relatório têm de declarar. */
export const PRIMEIRO_PROMPT_COBRADO = 67;

/**
 * O último prompt do CI desligado. **`null` enquanto o gatilho do `verde.yml` estiver comentado**; quem religar escreve
 * aqui o número do último prompt que rodou sem ele, e o teste cobra as duas metades (ligado ⇔ número escrito).
 */
export const ULTIMO_PROMPT_COBRADO: number | null = null;

export type TipoDoProblema = "recado-nao-declara" | "relatorio-nao-declara" | "relatorio-ausente";

export interface ProblemaDaDeclaracao {
  prompt: string;
  tipo: TipoDoProblema;
  detalhe: string;
}

export interface ExcecaoDaDeclaracao {
  prompt: string;
  /** O único problema que ela perdoa. */
  tipo: TipoDoProblema;
  motivo: string;
}

/** **Uma**, medida em 16/10/2026 — o relatório do LAB-118. */
export const EXCECOES_HISTORICAS: readonly ExcecaoDaDeclaracao[] = [
  {
    prompt: "LAB-118",
    tipo: "relatorio-nao-declara",
    motivo:
      "o LAB-118, 15/10/2026: o recado declara (\"Conferido aqui, não no GitHub\"), o relatório não diz como foi conferido em lugar nenhum — o defeito que esta régua existe para pegar. Relatório gravado não se reescreve",
  },
];

/** O texto declara como foi conferido? Pela leitura da regra (sem quebra de coluna, sem negrito), sem caixa. */
export function declara(texto: string): boolean {
  return comoARegraSeLe(texto).toLowerCase().includes(DECLARACAO.toLowerCase());
}

/** Os números `LAB-NN` do campo `<prompt>` de um cabeçalho de recado (o que vem depois do primeiro ` · `). */
export function promptsDoCabecalho(cabecalho: string): number[] {
  const campo = cabecalho.split(" · ").slice(1).join(" · ");
  return [...new Set([...campo.matchAll(/\bLAB-(\d{2,})\b/g)].map((m) => Number(m[1])))];
}

/**
 * Confere o `RECADOS.md` (lido por `lerOsRecados`, LAB-129) e os relatórios dos prompts no alcance.
 * `relatorio(prompt)` devolve o texto de `docs/relatorios/<prompt>.md`, ou `null`. Publica o universo, para que
 * *"nenhum problema"* nunca seja *"nenhum recado lido"* (D213).
 */
export function conferirADeclaracao(
  recados: readonly { cabecalho: string; corpo: readonly string[] }[],
  relatorio: (prompt: string) => string | null,
  alcance: { desde: number; ate: number | null } = { desde: PRIMEIRO_PROMPT_COBRADO, ate: ULTIMO_PROMPT_COBRADO },
  excecoes: readonly ExcecaoDaDeclaracao[] = EXCECOES_HISTORICAS,
): {
  universo: { recados: number; deClasse: number; foraDoAlcance: number; noAlcance: number; relatorios: number };
  problemas: ProblemaDaDeclaracao[];
  perdoados: ProblemaDaDeclaracao[];
  /** Exceção que não perdoou nada: o prompt saiu do alcance, ou o problema dele não é o que ela nomeia. */
  excecoesSemUso: ExcecaoDaDeclaracao[];
} {
  const noAlcance = (n: number): boolean => n >= alcance.desde && (alcance.ate === null || n <= alcance.ate);
  const achados: ProblemaDaDeclaracao[] = [];
  const relatoriosVistos = new Set<string>();
  let deClasse = 0;
  let foraDoAlcance = 0;
  let cobrados = 0;

  for (const r of recados) {
    const numeros = promptsDoCabecalho(r.cabecalho);
    if (numeros.length === 0) {
      deClasse++;
      continue;
    }
    const daqui = numeros.filter(noAlcance);
    if (daqui.length === 0) {
      foraDoAlcance++;
      continue;
    }
    cobrados++;
    const corpo = r.corpo.join("\n");
    for (const n of daqui) {
      const prompt = `LAB-${n}`;
      if (!declara(corpo)) {
        achados.push({ prompt, tipo: "recado-nao-declara", detalhe: `o recado de ${prompt} (${r.cabecalho.slice(0, 80)}) não diz "${DECLARACAO}"` });
      }
      if (relatoriosVistos.has(prompt)) continue;
      relatoriosVistos.add(prompt);
      const texto = relatorio(prompt);
      if (texto === null) achados.push({ prompt, tipo: "relatorio-ausente", detalhe: `não existe docs/relatorios/${prompt}.md` });
      else if (!declara(texto)) {
        achados.push({ prompt, tipo: "relatorio-nao-declara", detalhe: `o relatório de ${prompt} não diz "${DECLARACAO}"` });
      }
    }
  }

  const problemas: ProblemaDaDeclaracao[] = [];
  const perdoados: ProblemaDaDeclaracao[] = [];
  const usadas = new Set<ExcecaoDaDeclaracao>();
  for (const p of achados) {
    const e = excecoes.find((x) => x.prompt === p.prompt && x.tipo === p.tipo);
    if (e === undefined) problemas.push(p);
    else {
      perdoados.push(p);
      usadas.add(e);
    }
  }

  return {
    universo: { recados: recados.length, deClasse, foraDoAlcance, noAlcance: cobrados, relatorios: relatoriosVistos.size },
    problemas,
    perdoados,
    excecoesSemUso: excecoes.filter((e) => !usadas.has(e)),
  };
}
