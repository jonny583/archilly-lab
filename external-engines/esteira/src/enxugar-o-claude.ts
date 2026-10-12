/**
 * O INVENTÁRIO DAS REGRAS DA CASA — e a conta de que nenhuma se perdeu. (LAB-95, item 028)
 *
 * # Por que ele existe
 *
 * O item 028 mandou enxugar o `CLAUDE.md` — **a regra fica, a história muda de gaveta** — e pediu a
 * conferência que separa "enxugar" de "apagar":
 *
 * > *"**Confira por contagem** que nada se perdeu: toda regra que existia antes existe depois (no
 * > `CLAUDE.md`) e toda frase de história existe no arquivo novo."*
 *
 * **Contagem sem lista é slogan** (é o D307, e foi medido na mesma semana). Então a conta não é um
 * número no relatório: é **esta lista**, e cada linha dela é conferida nos **dois** arquivos.
 *
 * # A régua, e por que ela olha DOIS arquivos
 *
 * Cada regra traz uma **marca**: um trecho curto que existia no texto antigo **e** sobrevive no
 * texto novo. A conferência é dupla, e é isso que a torna uma conta em vez de uma declaração:
 *
 * - **a marca está em `docs/HISTORIA_DAS_REGRAS.md`** → a regra **existia antes** (a história é o
 *   texto antigo, literal, movido sem edição);
 * - **a marca está no `CLAUDE.md` de hoje** → a regra **continua valendo**.
 *
 * Faltar no primeiro é lista inventada; faltar no segundo é regra apagada. *Os dois lados importam,
 * e uma régua que olhasse só um deles aprovaria exatamente o erro que o item proíbe.*
 *
 * **E a leitura é a desta casa** (`aRegraEstaEscrita`): a marca se procura **como a frase se lê**,
 * não como está gravada — enxugar refluiu o texto, e quebra de linha no meio de uma frase foi o que
 * fez uma trava acusar a página de não trazer uma regra que estava ali (D248, D320).
 *
 * **E a comparação ignora a CAIXA das letras**, de propósito: encurtar uma regra move a frase para
 * o meio de outra, e aí a maiúscula de começo de frase vira minúscula. *Regra não muda de regra
 * porque a letra mudou de tamanho* — e exigir a caixa faria a conta reprovar por tipografia,
 * exatamente como exigir a linha idêntica faria por quebra de linha.
 */
import { aRegraEstaEscrita } from "./texto-das-regras.ts";

/** Uma regra da casa: onde ela mora, a marca que a identifica e a história dela. */
export interface RegraDaCasa {
  /** A seção do `CLAUDE.md` onde ela manda. */
  seccao: string;
  /** Trecho curto presente no texto ANTIGO e no NOVO — é por ele que a conta se faz. */
  marca: string;
  /** A seção da história que a explica. */
  historia: string;
}

/**
 * AS REGRAS, uma por linha. **Nenhuma pode sair sem que esta lista mude junto.**
 *
 * A lista é longa de propósito: ela é a conta. *Encurtá-la para caber numa tela seria trocar a
 * conferência pela aparência dela.*
 */
export const AS_REGRAS: readonly RegraDaCasa[] = [
  // ── §1 · o recado ─────────────────────────────────────────────────────────
  { seccao: "1", marca: "UM único bloco de código", historia: "H1" },
  { seccao: "1", marca: "O recado vem PRIMEIRO", historia: "H1" },
  { seccao: "1", marca: "O teto de doze linhas é do RECADO, não do bloco", historia: "H1" },
  { seccao: "1", marca: "partir o bloco", historia: "H1" },
  { seccao: "1", marca: "MOTOR LAB (archilly-lab)", historia: "H1" },
  { seccao: "1", marca: "despertador-sem-item", historia: "H1" },
  { seccao: "1", marca: "Linha sem conteúdo leva `—`, nunca some", historia: "H1" },
  { seccao: "1", marca: "ACUMULADO — inclui os recados", historia: "H1" },
  { seccao: "1", marca: "docs/relatorios/RECADOS.md", historia: "H1" },
  // ── §1-C · a fonte da Central, e a procedência do Padrão ──────────────────
  { seccao: "1-C", marca: "Quando as duas divergirem, manda esta", historia: "H2" },
  { seccao: "1-C", marca: "O LIMITE DE DOZE LINHAS É DO", historia: "H2" },
  { seccao: "1-C", marca: "NÃO espera o kit", historia: "H2" },
  { seccao: "1-C", marca: "o kit, quando chegar, é outro item", historia: "H2" },
  { seccao: "1-C", marca: "onde-esta-o-padrao.ts", historia: "H2" },
  { seccao: "1-C", marca: "não deve morar nela", historia: "H2" },
  { seccao: "1-C", marca: "REGRA DE FORMA SEM O SUJEITO ESCRITO MANDA NA COISA ERRADA", historia: "H2" },
  // ── §1-B · o balanço ──────────────────────────────────────────────────────
  { seccao: "1-B", marca: "Balanço é resposta que faz as contas", historia: "H3" },
  { seccao: "1-B", marca: "docs/relatorios/BALANCOS.md", historia: "H3" },
  { seccao: "1-B", marca: "Balanço que já mora num recado não se copia", historia: "H3" },
  { seccao: "1-B", marca: "Reconstrução sai etiquetada como reconstrução", historia: "H3" },
  { seccao: "1-B", marca: "O que vai ao chat e não vai a um arquivo não existe amanhã", historia: "H3" },
  // ── §1-A · a fila ─────────────────────────────────────────────────────────
  { seccao: "1-A", marca: "um despertador por aplicativo", historia: "H4" },
  { seccao: "1-A", marca: "Um prompt por despertador", historia: "H4" },
  { seccao: "1-A", marca: "Prompt fora da fila não existe", historia: "H4" },
  { seccao: "1-A", marca: "Não ampliar escopo", historia: "H4" },
  { seccao: "1-A", marca: "ANOTE A DATA, responda em UMA linha e DURMA — NÃO DESLIGUE", historia: "H4" },
  { seccao: "1-A", marca: "caixa-de-entrada/COMO_FUNCIONA.md", historia: "H4" },
  { seccao: "1-A", marca: "git merge --no-ff", historia: "H4" },
  { seccao: "1-A", marca: "~~DESLIGAR o despertador~~", historia: "H4" },
  { seccao: "1-A", marca: "MUDOU O MUNDO EMBAIXO DELA", historia: "H4" },
  // ── §3 · a regra de ouro ──────────────────────────────────────────────────
  { seccao: "3", marca: "é intocável", historia: "H6" },
  { seccao: "3", marca: "O trabalho acontece em `archilly/`", historia: "H6" },
  { seccao: "3", marca: "é a única fronteira", historia: "H6" },
  { seccao: "3", marca: "O Generate nunca depende disto", historia: "H6" },
  { seccao: "3", marca: "não ganha `upstream/`", historia: "H6" },
  // ── §4 · o que esta casa NUNCA faz ────────────────────────────────────────
  { seccao: "4", marca: "Não escreve em repositório vizinho", historia: "H7" },
  { seccao: "4", marca: "vira lista numerada em relatório", historia: "H7" },
  { seccao: "4", marca: "Não tem interface — com UMA exceção, declarada", historia: "H7" },
  { seccao: "4", marca: "Não reimplementa o Validator nem o Judge", historia: "H7" },
  { seccao: "4", marca: "Não conserta geometria em silêncio", historia: "H7" },
  { seccao: "4", marca: "Não inventa dado", historia: "H7" },
  { seccao: "4", marca: "Não descarta em silêncio campo que o motor publica", historia: "H7" },
  { seccao: "4", marca: "O motivo de uma perda não mora em comentário", historia: "H7" },
  { seccao: "4", marca: "Não carrega segredo na árvore", historia: "H7" },
  { seccao: "4", marca: "Registro nenhum repete mais de doze", historia: "H7" },
  { seccao: "4", marca: "Não decide urbanismo", historia: "H7" },
  { seccao: "4", marca: "Não contrata nada", historia: "H7" },
  // ── §4-A · uso, nunca mensalidade ─────────────────────────────────────────
  { seccao: "4-A", marca: "absolutamente todas", historia: "H8" },
  { seccao: "4-A", marca: "escolhe-se a de uso — mesmo que o", historia: "H8" },
  { seccao: "4-A", marca: "a ordenação é pelo custo na MENOR faixa de uso", historia: "H8" },
  { seccao: "4-A", marca: "a forma mais educada de aprovar uma despesa que", historia: "H8" },
  { seccao: "4-A", marca: "declarando operação e nunca preço", historia: "H8" },
  { seccao: "4-A", marca: "franquia mínima é mensalidade com outro nome", historia: "H8" },
  { seccao: "4-A", marca: "mensalidade que começa depois", historia: "H8" },
  { seccao: "4-A", marca: "cota gratuita de verdade não é mensalidade", historia: "H8" },
  { seccao: "4-A", marca: "ligada e desligada por recorte", historia: "H8" },
  { seccao: "4-A", marca: "nenhuma sessão contrata nada", historia: "H8" },
  { seccao: "4-A", marca: "campo que não existe não se esquece", historia: "H8" },
  { seccao: "4-A", marca: "não há nada pago neste repositório hoje", historia: "H8" },
  // ── §5 · nomes ────────────────────────────────────────────────────────────
  { seccao: "5", marca: "é nome interno", historia: "H9" },
  { seccao: "5", marca: "Laboratório de Parcelamento", historia: "H9" },
  { seccao: "5", marca: "escrito **para leigo**", historia: "H9" },
  { seccao: "5", marca: "marcado, nunca apagado", historia: "H9" },
  // ── §6 · medir antes de atribuir ──────────────────────────────────────────
  { seccao: "6", marca: "Resultado suspeito se mede antes de ter culpado", historia: "H10" },
  { seccao: "6", marca: "resultado desconfortável é resultado", historia: "H10" },
  { seccao: "6", marca: "régua que casa por nome exato mede ortografia", historia: "H10" },
  { seccao: "6", marca: "rótulo não é identidade", historia: "H10" },
  { seccao: "6", marca: "leitura de fonte é hipótese", historia: "H10" },
  { seccao: "6", marca: "consistência não é correção", historia: "H10" },
  // ── §7 · entrega ──────────────────────────────────────────────────────────
  { seccao: "7", marca: "PR mesclado na `main`", historia: "H11" },
  { seccao: "7", marca: "Medição é em metros e em dados", historia: "H11" },
  { seccao: "7", marca: "lista declarada de exceções", historia: "H11" },
  { seccao: "7", marca: "Duas pilhas convivem", historia: "H11" },
  { seccao: "7", marca: "./external-engines/conferir.sh", historia: "H11" },
  { seccao: "7", marca: "nada fica fora dele", historia: "H11" },
  { seccao: "7", marca: "VIZINHOS_TOKEN", historia: "H11" },
  { seccao: "7", marca: "COMO_RELIGAR_O_CI.md", historia: "H11" },
  { seccao: "7", marca: "conferido aqui, não no GitHub", historia: "H11" },
  { seccao: "7", marca: "em **um envio só**, no fim", historia: "H11" },
];

/** Um problema da conferência — e cada tipo diz de que lado a conta não fechou. */
export interface ProblemaDoInventario {
  tipo: "regra-sumiu-do-claude" | "marca-nao-existia-antes" | "historia-sem-secao";
  marca: string;
  oQue: string;
}

/**
 * A conferência dos dois lados.
 *
 * `claudeMd` é a página de hoje; `historia` é o arquivo novo, que contém o texto antigo literal.
 */
export function conferirOInventario(
  claudeMd: string,
  historia: string,
): ProblemaDoInventario[] {
  const problemas: ProblemaDoInventario[] = [];
  const hoje = claudeMd.toLowerCase();
  const antes = historia.toLowerCase();
  for (const r of AS_REGRAS) {
    const marca = r.marca.toLowerCase();
    if (!aRegraEstaEscrita(hoje, marca)) {
      problemas.push({
        tipo: "regra-sumiu-do-claude",
        marca: r.marca,
        oQue: `a regra da §${r.seccao} não está mais no CLAUDE.md — enxugar é encurtar, não apagar`,
      });
    }
    if (!aRegraEstaEscrita(antes, marca)) {
      problemas.push({
        tipo: "marca-nao-existia-antes",
        marca: r.marca,
        oQue:
          `a marca da §${r.seccao} não aparece na história — ou a lista inventou uma regra, ou a ` +
          "história perdeu o texto antigo",
      });
    }
    if (!historia.includes(`## ${r.historia} ·`)) {
      problemas.push({
        tipo: "historia-sem-secao",
        marca: r.marca,
        oQue: `a §${r.seccao} aponta para ${r.historia}, e essa seção não existe na história`,
      });
    }
  }
  return problemas;
}

/** A conta por seção, para o relatório dizer número e não adjetivo. */
export function aContaDasRegras(): { total: number; porSeccao: Record<string, number> } {
  const porSeccao: Record<string, number> = {};
  for (const r of AS_REGRAS) porSeccao[r.seccao] = (porSeccao[r.seccao] ?? 0) + 1;
  return { total: AS_REGRAS.length, porSeccao };
}

/**
 * As linhas de um texto que **carregam conteúdo** — é o universo da conta de "nada se perdeu".
 *
 * Fora: linha vazia, régua horizontal e linha de tabela de formatação. *Linha de enfeite não é
 * história, e exigi-la faria a conta reprovar por pontuação.*
 */
export function linhasQueImportam(texto: string): string[] {
  return texto
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l !== "" && l !== "---" && !/^\|[\s|:-]*\|$/.test(l));
}

/**
 * As linhas do texto ANTIGO que não estão nem no novo `CLAUDE.md` nem na história.
 *
 * A comparação é por linha normalizada em espaço, porque o enxugar **refluiu** o texto: exigir a
 * linha idêntica reprovaria por quebra de linha, que é exatamente o erro do D248.
 *
 * **A história foi montada movendo as seções inteiras, literais** — então o esperado é lista vazia,
 * e qualquer linha aqui é uma linha que foi **apagada**, que é a única forma de errar este item.
 */
export function oQueSePerdeu(antigo: string, novo: string, historia: string): string[] {
  const juntos = `${novo}\n${historia}`.replace(/\s+/g, " ");
  return linhasQueImportam(antigo).filter((l) => !juntos.includes(l));
}
