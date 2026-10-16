/**
 * O RECADO DIZ ONDE ESTÁ O DETALHE — e nada perguntava. (LAB-130, item 900, a dívida própria, D358)
 *
 * # A regra, e o que estava sem guarda
 *
 * O protocolo da caixa (`docs/caixa-de-entrada/COMO_FUNCIONA.md`, seção *"A RESPOSTA INTEIRA VAI PARA O
 * ARQUIVO"*, escrita pelo chat em 09/10/2026, commit `b0b537b`) manda duas coisas:
 *
 * > *"a resposta inteira da rodada […] **vai gravada**, em `docs/relatorios/<prompt>.md`"*
 * > *"o recado é o resumo; o relatório é o detalhe. Quem lê o recado e fica com dúvida abre o relatório —
 * > e é por isso que o recado precisa dizer **onde** está o detalhe."*
 *
 * A trava que havia anda no sentido contrário: o `recado.test.ts` cobra que **todo relatório tenha
 * recado**. Ninguém perguntava se **todo recado aponta o relatório** — e o relatório do próprio prompt.
 * Medido por mutação (16/10/2026), a suíte inteira da esteira, com três mudanças plantadas na página:
 * tirar *"relatório LAB-129"* do último recado, tirar *"Relatório: `docs/relatorios/LAB-92.md`"* do
 * primeiro que adotou a forma, e trocar *"relatório LAB-120"* por *"relatório LAB-119"* → **zero**
 * falhas (1 381 aprovadas e 9 reprovadas, as nove do `.wasm`, as mesmas de antes). *Regra sem guarda*,
 * a primeira espécie da dívida própria.
 *
 * # O que se mediu, por LUGAR
 *
 * O lugar é todo recado do `RECADOS.md` (o bloco que abre com `=== RECADO PARA O CHAT`) cujo `<prompt>`
 * é um prompt desta casa (`LAB-NNN`) e cuja seção é datada a partir do dia da regra:
 *
 * - **todos** têm o relatório em `docs/relatorios/<prompt>.md`, e o título dele é o do próprio prompt;
 * - do **LAB-92** (11/10/2026) em diante, **todos** dizem onde: `Relatório: docs/relatorios/LAB-NN.md`
 *   ou *"relatório LAB-NNN"*;
 * - **antes do LAB-92, nenhum** — 23 recados de 09/10 a 11/10 sem apontar; dois deles (LAB-68 e
 *   LAB-69) são do mesmo dia mas de ANTES do commit da regra. Os 23 são exceção declarada, um por um,
 *   em {@link EXCECOES_HISTORICAS}: o `RECADOS.md` é registro do que foi enviado, e não se reescreve.
 *
 * # As escolhas
 *
 * - **"Dizer onde" é nomear o arquivo** — `LAB-NNN.md` em qualquer forma de caminho — **ou a palavra
 *   *relatório* seguida do prompt** (`relatório LAB-129`, `Relatório: docs/relatorios/LAB-92.md`). As
 *   duas formas que a história usa, e só elas: *"ver o relatório"* sem nome não diz onde.
 * - **O relatório tem de existir e ser DESTE prompt** (o título `# LAB-NNN` na primeira linha):
 *   apontar `LAB-119` no recado do `LAB-120` aponta um lugar que existe — e é o lugar errado.
 * - **Só o recado com prompt `LAB-NNN`.** As classes (`despertador-sem-item`, `decisao-registrada`…) não
 *   têm relatório por protocolo — a caixa vazia é *"um recado de uma linha"* —, e ficam contadas e
 *   declaradas fora, não engolidas.
 * - **A data de corte é a do commit da regra** (`b0b537b`, 09/10/2026), escrita aqui e não lida do
 *   `git`: o CI clona raso, e uma trava que dependesse da história inteira passaria a responder o corte
 *   do clone (D293). O dia inteiro entra; os dois recados daquele dia que vieram antes do commit são
 *   exceção nomeada, com o motivo.
 * - **A exceção é conferida nos dois sentidos**: tem de continuar falhando (senão sobra perdão), tem de
 *   haver o recado, e o relatório dela tem de existir — o detalhe foi gravado, só o recado não disse.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se o relatório contém a resposta inteira** — o tamanho e as seções são juízo; ela cobra que o
 *   arquivo exista, seja do prompt e seja apontado;
 * - **o recado das classes** sem prompt `LAB-NNN` (contadas no `universo.semPrompt`);
 * - **o recado anterior a 09/10/2026** — a regra não existia;
 * - **o recado que foi ao chat e não ao arquivo.**
 */

import { lerOsRecados } from "./as-cinco-linhas-do-recado.ts";
import { PROMPT_DO_LAB } from "./nome-do-prompt.ts";

/** A frase da regra, conferida no teste onde ela mora (o `COMO_FUNCIONA.md` da caixa). */
export const A_REGRA = "e é por isso que o recado precisa dizer **onde** está o detalhe.";

/** O dia do commit `b0b537b`, que escreveu a regra no protocolo. `AAAA-MM-DD`, para comparar como texto. */
export const DIA_DA_REGRA = "2026-10-09";

export type TipoDeProblemaDoDetalhe = "relatorio-ausente" | "relatorio-de-outro-prompt" | "recado-nao-diz-onde";

export interface ProblemaDoDetalhe {
  /** A linha do cabeçalho do recado, contando de 1. */
  linha: number;
  prompt: string;
  tipo: TipoDeProblemaDoDetalhe;
  detalhe: string;
}

export interface ExcecaoDoDetalhe {
  prompt: string;
  motivo: string;
}

const ANTES_DO_COMMIT =
  "do mesmo dia da regra, mas enviado ANTES do commit dela (b0b537b, 09/10/2026 às 13h42 -0300): a regra ainda não existia";
const ANTES_DA_FORMA =
  "enviado depois da regra e sem dizer onde — o relatório existe; a forma 'Relatório: docs/relatorios/LAB-NN.md' só nasceu no LAB-92. O registro não se reescreve";

/**
 * **Vinte e três**, os recados de 09/10 a 11/10/2026 que não apontam o relatório. Todos têm o
 * relatório gravado; o que falta é só o ponteiro no recado. O LAB-80 está fora porque o dele aponta.
 */
export const EXCECOES_HISTORICAS: readonly ExcecaoDoDetalhe[] = [
  { prompt: "LAB-68", motivo: ANTES_DO_COMMIT },
  { prompt: "LAB-69", motivo: ANTES_DO_COMMIT },
  ...[70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91].map((n) => ({
    prompt: `LAB-${n}`,
    motivo: ANTES_DA_FORMA,
  })),
];

/** `dd/mm/aaaa` → `aaaa-mm-dd`; `null` se não for data. */
function iso(data: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(data);
  return m === null ? null : `${m[3]}-${m[2]}-${m[1]}`;
}

/** O recado aponta o relatório de `prompt`: o nome do arquivo, ou *relatório* seguido do prompt. */
export function dizOnde(corpo: string, prompt: string): boolean {
  const p = prompt.replace("-", "\\-");
  const arquivo = new RegExp(`(?<![\\w-])${p}\\.md\\b`);
  const palavra = new RegExp(`relat[óo]rio[:\\s\`]*(?:docs/relatorios/)?${p}(?!\\d)`, "i");
  return arquivo.test(corpo) || palavra.test(corpo);
}

/**
 * Confere o texto do `RECADOS.md` contra os relatórios. `relatorio(prompt)` devolve a PRIMEIRA linha
 * de `docs/relatorios/<prompt>.md`, ou `null` se o arquivo não existe — quem chama decide de onde ler.
 */
export function conferirOndeEstaODetalhe(
  texto: string,
  relatorio: (prompt: string) => string | null,
  excecoes: readonly ExcecaoDoDetalhe[] = EXCECOES_HISTORICAS,
): {
  universo: { recados: number; antesDaRegra: number; semPrompt: number; noAlcance: number };
  problemas: ProblemaDoDetalhe[];
  perdoados: ProblemaDoDetalhe[];
  /** Exceções sem problema a perdoar: o recado não existe no alcance, ou já aponta. */
  excecoesSemUso: ExcecaoDoDetalhe[];
  /** Exceções cujo relatório não existe — o perdão é do ponteiro, nunca do detalhe. */
  excecoesSemRelatorio: ExcecaoDoDetalhe[];
} {
  const linhas = texto.split("\n");
  const recados = lerOsRecados(texto);
  const problemas: ProblemaDoDetalhe[] = [];
  const perdoados: ProblemaDoDetalhe[] = [];
  const usadas = new Set<ExcecaoDoDetalhe>();
  let antesDaRegra = 0;
  let semPrompt = 0;
  let noAlcance = 0;

  for (const r of recados) {
    let dia: string | null = null;
    for (let i = r.linha - 2; i >= 0; i--) {
      const m = /^## (\d{2}\/\d{2}\/\d{4})\b/.exec(linhas[i]!);
      if (m !== null) {
        dia = iso(m[1]!);
        break;
      }
    }
    if (dia === null || dia < DIA_DA_REGRA) {
      antesDaRegra++;
      continue;
    }
    const campo = r.cabecalho.split(" · ").slice(1).join(" · ");
    const prompts = campo.match(new RegExp(`\\b${PROMPT_DO_LAB}\\b`, "g")) ?? [];
    if (prompts.length === 0) {
      semPrompt++;
      continue;
    }
    noAlcance++;
    const corpo = r.corpo.join("\n");
    for (const prompt of new Set(prompts)) {
      const achados: ProblemaDoDetalhe[] = [];
      const primeira = relatorio(prompt);
      if (primeira === null) {
        achados.push({ linha: r.linha, prompt, tipo: "relatorio-ausente", detalhe: `não existe docs/relatorios/${prompt}.md` });
      } else if (!new RegExp(`^# ${prompt}(?!\\d)`).test(primeira)) {
        achados.push({ linha: r.linha, prompt, tipo: "relatorio-de-outro-prompt", detalhe: `o título de ${prompt}.md é "${primeira.slice(0, 60)}"` });
      }
      if (!dizOnde(corpo, prompt)) {
        achados.push({ linha: r.linha, prompt, tipo: "recado-nao-diz-onde", detalhe: `o recado de ${prompt} não aponta docs/relatorios/${prompt}.md` });
      }
      for (const a of achados) {
        const e = excecoes.find((x) => x.prompt === prompt);
        if (e !== undefined && a.tipo === "recado-nao-diz-onde") {
          perdoados.push(a);
          usadas.add(e);
        } else problemas.push(a);
      }
    }
  }

  return {
    universo: { recados: recados.length, antesDaRegra, semPrompt, noAlcance },
    problemas,
    perdoados,
    excecoesSemUso: excecoes.filter((e) => !usadas.has(e)),
    excecoesSemRelatorio: excecoes.filter((e) => relatorio(e.prompt) === null),
  };
}
