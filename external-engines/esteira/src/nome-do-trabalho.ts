/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NOME DE UM TRABALHO DE CI É UMA AFIRMAÇÃO. (item 017, LAB-84)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O trabalho `guardas que não precisam dos clones vizinhos (NÃO é o verde)` **afirma**, no
 * próprio nome, o que ele precisa — e até o LAB-84 **nenhuma régua conferia essa afirmação**.
 * Ela era falsa, e ninguém ia desmentir: o CI está com a execução automática desligada desde
 * 08/10, então a afirmação não quebra nada quando mente.
 *
 * > **Afirmação desligada não é afirmação falsa: é afirmação que ninguém vai desmentir** (D279).
 *
 * # A medição que decidiu, e ela é por EXECUÇÃO
 *
 * O item 017 proibiu a resposta barata: *"rodar a lista SEM os clones e ver quem reprova é a
 * resposta; ler o `import` é a hipótese."* Rodado numa cópia do repositório onde os três clones
 * irmãos não existem — que é exactamente o que o CI vê —, dos **30** arquivos da lista
 * **29 passam** e **UM** reprova: `commit-dos-vizinhos.test.ts`, com **4 travas de 14**.
 *
 * A prova está em `docs/provas/LAB-84/as-trinta-por-execucao.json`, arquivo por arquivo.
 *
 * # Por que ESTE módulo não substitui a medição
 *
 * A régua daqui é **estática**: ela lê o fonte e pergunta se o arquivo alcança a raiz de um
 * clone. É a **hipótese**, não a resposta — e fica dito, porque *guarda que não declara o
 * próprio buraco mente pelo silêncio*. A resposta mora na ferramenta `lab84`, que **executa**.
 * As duas existem de propósito: a ferramenta mede e a trava impede, e *conserto que entra num
 * instrumento só é meio conserto* (D231).
 */

/**
 * A trava que mora nesta régua. Está FORA do gate dela, e o porquê está na `conferirONome`:
 * guarda que lê uma medição de si mesma não tem lado bom alcançável (D283).
 */
export const A_TRAVA_DESTA_REGUA = "tests/nome-do-trabalho.test.ts";

/** O nome exato do trabalho que afirma não precisar dos clones. */
export const TRABALHO_SEM_CLONES = "guardas que não precisam dos clones vizinhos (NÃO é o verde)";

/**
 * Os arquivos de trava que **dependem de clone vizinho no disco**, medidos por EXECUÇÃO.
 *
 * Um arquivo entra aqui quando, rodado sem os clones irmãos, ele **reprova**. Nenhum deles pode
 * estar na lista do `TRABALHO_SEM_CLONES`.
 */
export const DEPENDEM_DE_CLONE: Record<string, string> = {
  "tests/commit-dos-vizinhos-com-clone.test.ts":
    "4 travas: os três lados do item 001 contra o `HEAD` de verdade do `motor-testfit` (caso " +
    "bom, caso ruim com `HEAD~1`, e prova sem carimbo), mais o carimbo da máquina de verdade do " +
    "LAB-83. Medidas por execução numa cópia sem os clones: as quatro reprovam, as outras 10 do " +
    "arquivo original passam — e foi por isso que o conserto MOVEU as quatro em vez de tirar o " +
    "arquivo inteiro",
};

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  POR QUE AQUI NÃO HÁ RÉGUA ESTÁTICA, e isso foi MEDIDO (D282)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A primeira versão desta régua tinha um braço estático: procurar no fonte de cada arquivo da
 * lista a frase `join(RAIZ, "..", "motor-testfit")`. Ele **acusou a própria trava que o
 * demonstra**, porque a fixture dela contém essa frase. Família do D142/D155/D257, a sétima
 * nesta casa.
 *
 * **E a cura da casa não serve aqui, medido nas duas:**
 *
 * | limpeza | o que faz | por que não serve |
 * |---|---|---|
 * | `soOCodigo()` | esvazia o conteúdo das strings | o alvo É uma string: a régua fica CEGA |
 * | `semComentarios()` | tira comentário e regex, guarda strings | a fixture também é string: acusa de novo |
 *
 * > **Quando o que você procura e o que você quer ignorar são a MESMA FORMA, não há régua
 * > estática que os separe** — `join(RAIZ, "..", "motor-testfit")` em código e a mesma frase
 * > dentro da fixture de um teste são o mesmo texto, e nenhuma limpeza desta casa os distingue.
 *
 * E a saída não é uma régua mais esperta: é a **outra pergunta**. O item 017 já tinha dito qual —
 * *"rodar a lista sem os clones é a RESPOSTA; ler o `import` é a hipótese"*. Então esta régua
 * **lê a medição por execução** (`docs/provas/LAB-84/as-trinta-por-execucao.json`) em vez de
 * reler o fonte: *ela confere o que aconteceu, não o que parece.*
 *
 * **O buraco, declarado:** a prova envelhece se ninguém rodar o `lab84`. Por isso a régua cobra
 * que a prova cubra **exatamente** a lista de hoje — arquivo novo no trabalho sem linha na prova
 * reprova, e é a mesma ideia do `alcance-das-provas`. *Guarda que não declara o próprio buraco
 * mente pelo silêncio.*
 */

/** Uma linha da medição por execução — o que a prova do LAB-84 publica por arquivo. */
export interface MedidaPorExecucao {
  arquivo: string;
  saida: number;
  asQueReprovam: string[];
}

export interface ProblemaDoNome {
  tipo:
    | "trabalho-nao-encontrado"
    | "lista-vazia"
    | "arquivo-que-depende-no-trabalho"
    | "arquivo-da-lista-nao-existe"
    | "declarado-que-nao-existe"
    | "sem-medicao"
    | "medido-reprovando-sem-clone";
  oQue: string;
}

/**
 * Os arquivos de trava que o trabalho roda, na ordem em que ele os lista.
 *
 * Lê o bloco `bun test \` do passo do trabalho. **Devolve lista vazia quando não acha** — e a
 * trava trata isso como problema, nunca como aprovação (D213).
 */
export function arquivosDoTrabalho(workflow: string, nomeDoTrabalho: string): string[] {
  const i = workflow.indexOf(nomeDoTrabalho);
  if (i < 0) return [];
  const depois = workflow.slice(i);
  const m = /bun test \\\n([\s\S]*?)(?=\n\s*\n|\n\s*#|$)/.exec(depois);
  if (m === null) return [];
  return [...m[1]!.matchAll(/(tests\/[\w.-]+\.test\.ts)/g)].map((x) => x[1]!);
}

/**
 * Confere a AFIRMAÇÃO do nome: nenhum arquivo que precisa de clone está na lista do trabalho.
 *
 * `existe` recebe caminhos relativos à raiz do repositório, e `medicao` são as linhas da prova
 * por execução do LAB-84 — a trava passa o disco e a prova, e é assim que ela confere a lista
 * **contra o que aconteceu** em vez de contra outra lista.
 */
export function conferirONome(
  workflow: string,
  existe: (caminho: string) => boolean,
  medicao: MedidaPorExecucao[],
): ProblemaDoNome[] {
  const medidas = new Map(medicao.map((m) => [m.arquivo, m]));
  const problemas: ProblemaDoNome[] = [];
  if (!workflow.includes(TRABALHO_SEM_CLONES)) {
    problemas.push({
      tipo: "trabalho-nao-encontrado",
      oQue:
        `o trabalho "${TRABALHO_SEM_CLONES}" não está no workflow — ou ele foi renomeado, e ` +
        "então a AFIRMAÇÃO mudou e esta régua tem de mudar com ela, ou ele saiu",
    });
    return problemas;
  }

  const lista = arquivosDoTrabalho(workflow, TRABALHO_SEM_CLONES);
  if (lista.length === 0) {
    problemas.push({
      tipo: "lista-vazia",
      oQue:
        "não achei a lista de arquivos do trabalho — e isso NÃO é aprovação: é a régua sem medir " +
        "nada, que é o pior jeito de uma guarda falhar (D213)",
    });
    return problemas;
  }

  for (const [arquivo, motivo] of Object.entries(DEPENDEM_DE_CLONE)) {
    if (!existe(`external-engines/esteira/${arquivo}`)) {
      problemas.push({
        tipo: "declarado-que-nao-existe",
        oQue: `\`${arquivo}\` está declarado como dependente de clone e não existe mais`,
      });
      continue;
    }
    if (lista.includes(arquivo)) {
      problemas.push({
        tipo: "arquivo-que-depende-no-trabalho",
        oQue:
          `\`${arquivo}\` está na lista de "${TRABALHO_SEM_CLONES}" e DEPENDE de clone: ${motivo}`,
      });
    }
  }

  // ── A OUTRA PONTA: a MEDIÇÃO por execução, não o fonte ──────────────────
  // Cada arquivo da lista tem de ter uma linha na prova do LAB-84, e ter saído com `exit 0`
  // rodando SEM os clones. É isto que confere a afirmação do nome — o resto é suspeita.
  for (const arquivo of lista) {
    const caminho = `external-engines/esteira/${arquivo}`;
    if (!existe(caminho)) {
      problemas.push({
        tipo: "arquivo-da-lista-nao-existe",
        oQue: `o trabalho lista \`${arquivo}\`, que não existe — o trabalho inteiro falha nele`,
      });
      continue;
    }
    const m = medidas.get(arquivo);
    if (m === undefined) {
      problemas.push({
        tipo: "sem-medicao",
        oQue:
          `\`${arquivo}\` está na lista do trabalho e NÃO tem linha na prova por execução do ` +
          "LAB-84 — rode `bun run lab84`. Arquivo no portão sem medição é afirmação sem prova, e " +
          "o CI desligado não vai desmenti-la",
      });
      continue;
    }
    if (arquivo === A_TRAVA_DESTA_REGUA) {
      // **O PONTO FIXO, e ele não se resolve com esperteza** (D283). A trava desta régua está na
      // lista do trabalho, e a régua cobra que todo arquivo da lista tenha saído verde na
      // medição — inclusive, portanto, a própria trava. Mas a medição roda a trava, que lê a
      // medição ANTERIOR: um vermelho dela se grava na prova e se realimenta para sempre.
      //
      // > **Guarda que lê uma medição de si mesma não tem lado bom alcançável** — o primeiro
      // > vermelho se torna permanente, e o conserto não é afrouxar a régua: é dizer QUE o
      // > arquivo dela está fora do próprio gate, e por quê.
      //
      // O que fica garantido sem ela: a **ferramenta mede este arquivo igual aos outros** e a
      // prova publica a linha dele — quem lê a prova vê o veredito —, e o verde completo o roda.
      // O que esta régua deixa de cobrar é só o `exit` da própria casa.
      continue;
    }
    if (m.saida !== 0) {
      problemas.push({
        tipo: "medido-reprovando-sem-clone",
        oQue:
          `\`${arquivo}\` está na lista de "${TRABALHO_SEM_CLONES}" e, MEDIDO sem os clones, ` +
          `saiu com exit ${m.saida}` +
          (m.asQueReprovam.length > 0 ? `: ${m.asQueReprovam.join(" · ")}` : ""),
      });
    }
  }

  return problemas;
}
