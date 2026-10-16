/**
 * TODO PROMPT FECHA COM PROVAS EM `docs/provas/` — e nada perguntava onde estava a prova de cada um. (LAB-140, item
 * 900, a dívida própria, D368)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §7: *"**Todo prompt fecha com** relatório em `docs/relatorios/`, provas em `docs/provas/`, decisões em
 * `docs/DECISOES.md`, `FILA.md`, `ONDE_PARAMOS.md` e `INDEX.md` em dia, testes verdes e **PR mesclado na `main`**."*
 * Das sete coisas da frase, seis já tinham trava: o relatório (LAB-130), as decisões (LAB-131), a `FILA.md` (LAB-136),
 * o `ONDE_PARAMOS.md` (LAB-126), o `INDEX.md` (LAB-118), a mescla (LAB-138). **As provas não tinham nenhuma** — o
 * LAB-136 as deixou de fora dizendo *"há prompt que não mede nada"*, e é verdade; mas então a regra, como escrita, é
 * falsa, e nada dizia quantas vezes.
 *
 * Medido por mutação (16/10/2026), a suíte inteira da esteira com três mudanças plantadas ao mesmo tempo — uma pasta
 * `docs/provas/LAB-998/` de um prompt que não existe, uma pasta `docs/provas/LAB-44/` para um prompt cujo relatório
 * diz *"Não há `docs/provas/LAB-44/`"*, e a declaração do LAB-43 apagada → **uma** falha a mais, e ela não era de
 * nenhuma das três: era a §7 das chaves (`regras.test.ts`), porque o JSON plantado não trazia gleba, motor e semente.
 * Com as chaves, as três passariam. E o caso principal nem precisa de mutação: **os 44 prompts do LAB-96 ao LAB-139
 * fecharam sem pasta e sem dizer que não havia**, com a suíte verde.
 *
 * # O que se mediu, por LUGAR
 *
 * O universo são os relatórios `docs/relatorios/LAB-NN.md` (131 no LAB-139) e as pastas de `docs/provas/` (66):
 *
 * - **64** prompts têm a pasta `docs/provas/LAB-NN/`;
 * - **4** dizem que não têm — o LAB-42, o LAB-43, o LAB-44 e o LAB-45, de 05 e 06/10/2026, com a mesma frase:
 *   *"Não há `docs/provas/LAB-43/`, e isso vai declarado: a prova deste prompt são…"*. **A forma já existia**, nascida
 *   aqui, e caiu em desuso sem que nada a pedisse;
 * - **63** fecharam calados — nem pasta, nem frase. O LAB-14, o LAB-20, o LAB-22 e mais 16 até o LAB-75, e **todos** do
 *   LAB-96 ao LAB-139;
 * - as duas pastas que não são de prompt (`item-003`, `item-004`) são dos itens da caixa que as pediram, e os dois
 *   itens estão feitos.
 *
 * # A escolha, e a que descartei
 *
 * **A régua lê a regra como a casa já a cumpriu quatro vezes**: a prova de um prompt mora em `docs/provas/<prompt>/`,
 * ou o relatório dele diz, com o caminho, que não há. Prompt que não mede nada não fabrica JSON para cumprir a letra —
 * prova que só registra aparência é outra espécie de dívida —, mas também não se cala.
 *
 * **O alcance começa no LAB-140**, este prompt. Os 63 calados de antes **não são perdoados em silêncio**: o número é
 * publicado e congelado ({@link CALADOS_ANTES_DA_TRAVA}), e uma pasta antiga apagada o faz subir e reprova. Não
 * escrevi a frase nos 63 relatórios: dizer hoje onde estava a prova de um prompt de 19/09 é **reconstrução**, que sai
 * etiquetada e se confere (`CLAUDE.md` §1-B), e são 63. Se vale fazê-la, ou reescrever a frase do §7 para a forma que a
 * casa cumpre, ficou **proposto ao chat** (a regra mora no `CLAUDE.md`, que é dele).
 *
 * **Descartei** cobrar a pasta de todo prompt: 63 de 131 reprovariam, e a única saída seria JSON sem medição dentro.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se a pasta prova o que o relatório diz** — o conteúdo das provas de medição tem a §7 das chaves
 *   (`regras.test.ts`) e o alcance das provas (LAB-79); esta régua pergunta onde mora, não o que diz;
 * - **se a frase "não há" diz onde está a prova** — as quatro dizem (*"a prova deste prompt são…"*), e a régua lê só
 *   o caminho: o resto é leitura;
 * - **o recado** — a prova é do relatório; o recado é o resumo (`onde-esta-o-detalhe`, LAB-130);
 * - **arquivo solto na raiz de `docs/provas/`** além do `LEIA-ME.md` — nenhum hoje, e a régua é de pasta.
 */
import { comoARegraSeLe } from "./texto-das-regras.ts";

/** A metade da frase do §7 que esta régua cobra, como está escrita. */
export const A_REGRA = "provas em `docs/provas/`";

/** Este prompt — o primeiro cuja pasta ou declaração é cobrada. */
export const PRIMEIRO_PROMPT_COBRADO = 140;

/**
 * Os prompts de antes da trava que fecharam sem pasta e sem dizer — **63**, contados no LAB-140. Congelado: pasta antiga
 * apagada faz o número subir; declaração reconstruída o faz descer — as duas coisas são de propósito, e se escrevem aqui.
 */
export const CALADOS_ANTES_DA_TRAVA = 63;

/** O nome do prompt como a casa o escreve: dois dígitos no mínimo (`LAB-02`, `LAB-140`). */
export function nomeDoPrompt(n: number): string {
  return `LAB-${String(n).padStart(2, "0")}`;
}

export type ComoFechou = "com-pasta" | "declara-que-nao-ha" | "calado";

export type TipoDoProblema =
  | "sem-pasta-e-sem-declaracao"
  | "declara-e-tem-pasta"
  | "pasta-sem-relatorio"
  | "pasta-de-item-sem-item"
  | "pasta-sem-dono"
  | "pasta-vazia";

export interface ProblemaDaProva {
  onde: string;
  tipo: TipoDoProblema;
  detalhe: string;
}

/**
 * O relatório diz que o prompt não tem pasta de provas? Pela leitura da regra (sem quebra de coluna, sem negrito), sem
 * caixa, **com acento**, e **com o caminho da própria pasta** — *"não há `docs/provas/LAB-44/`"* no relatório do
 * LAB-45 não declara nada sobre o LAB-45.
 */
export function declaraQueNaoHa(texto: string, prompt: number): boolean {
  const t = comoARegraSeLe(texto).toLowerCase();
  for (const m of t.matchAll(/não (?:há|houve)(?: prova em)? `?docs\/provas\/lab-(\d+)\/?`?/g)) {
    if (Number(m[1]) === prompt) return true;
  }
  return false;
}

/**
 * Confere os relatórios e as pastas de provas. Pura: quem chama lê o disco.
 *
 * - `relatorios`: número do prompt → texto de `docs/relatorios/LAB-NN.md`;
 * - `pastas`: nome de cada pasta de `docs/provas/` → quantos arquivos ela tem (recursivo);
 * - `itensFeitos`: os números (`"003"`) dos itens da caixa marcados `-FEITO`.
 *
 * Publica o universo, para que *"nenhum problema"* nunca seja *"nenhum relatório lido"* (D213).
 */
export function conferirOndeMoraAProva(
  relatorios: ReadonlyMap<number, string>,
  pastas: ReadonlyMap<string, number>,
  itensFeitos: ReadonlySet<string>,
  desde: number = PRIMEIRO_PROMPT_COBRADO,
): {
  universo: {
    relatorios: number;
    comPasta: number;
    declaram: number;
    caladosAntes: number;
    cobrados: number;
    pastas: number;
    pastasDeItem: number;
  };
  comoFechou: Map<number, ComoFechou>;
  problemas: ProblemaDaProva[];
} {
  const problemas: ProblemaDaProva[] = [];
  const comoFechou = new Map<number, ComoFechou>();
  let caladosAntes = 0;
  let cobrados = 0;

  for (const [n, texto] of [...relatorios].sort((a, b) => a[0] - b[0])) {
    const prompt = nomeDoPrompt(n);
    const temPasta = pastas.has(prompt);
    const declara = declaraQueNaoHa(texto, n);
    if (n >= desde) cobrados++;
    if (temPasta && declara) {
      problemas.push({
        onde: prompt,
        tipo: "declara-e-tem-pasta",
        detalhe: `o relatório de ${prompt} diz que não há docs/provas/${prompt}/, e a pasta existe`,
      });
    }
    const como: ComoFechou = temPasta ? "com-pasta" : declara ? "declara-que-nao-ha" : "calado";
    comoFechou.set(n, como);
    if (como === "calado") {
      if (n >= desde) {
        problemas.push({
          onde: prompt,
          tipo: "sem-pasta-e-sem-declaracao",
          detalhe: `${prompt} fechou sem docs/provas/${prompt}/ e o relatório não diz "Não há \`docs/provas/${prompt}/\`" (CLAUDE.md §7)`,
        });
      } else caladosAntes++;
    }
  }

  let pastasDeItem = 0;
  for (const [nome, arquivos] of [...pastas].sort((a, b) => a[0].localeCompare(b[0]))) {
    const doPrompt = /^LAB-(\d+)$/.exec(nome);
    const doItem = /^item-(\d{3,})$/.exec(nome);
    if (arquivos === 0) {
      problemas.push({ onde: nome, tipo: "pasta-vazia", detalhe: `docs/provas/${nome}/ não tem arquivo nenhum` });
    }
    if (doPrompt) {
      if (!relatorios.has(Number(doPrompt[1]))) {
        problemas.push({
          onde: nome,
          tipo: "pasta-sem-relatorio",
          detalhe: `docs/provas/${nome}/ existe e não há docs/relatorios/${nome}.md — prova de um prompt que não existe`,
        });
      }
    } else if (doItem) {
      pastasDeItem++;
      if (!itensFeitos.has(doItem[1]!)) {
        problemas.push({
          onde: nome,
          tipo: "pasta-de-item-sem-item",
          detalhe: `docs/provas/${nome}/ existe e o item ${doItem[1]} da caixa não está feito`,
        });
      }
    } else {
      problemas.push({
        onde: nome,
        tipo: "pasta-sem-dono",
        detalhe: `docs/provas/${nome}/ não é de prompt (LAB-NN) nem de item da caixa (item-NNN)`,
      });
    }
  }

  const contar = (c: ComoFechou): number => [...comoFechou.values()].filter((x) => x === c).length;
  return {
    universo: {
      relatorios: relatorios.size,
      comPasta: contar("com-pasta"),
      declaram: contar("declara-que-nao-ha"),
      caladosAntes,
      cobrados,
      pastas: pastas.size,
      pastasDeItem,
    },
    comoFechou,
    problemas,
  };
}
