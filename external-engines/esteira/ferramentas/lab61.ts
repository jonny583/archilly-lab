/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-61 · A dívida própria com o que sobrou — e o que sobrou era A LISTA.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **O pedido do chat, nas palavras dele:** *"continue a dívida própria com o que sobrou."*
 *
 * # Onde estava a dívida, e a resposta foi medida, não escolhida
 *
 * Procurei dívida minha onde ela é declarada: a categoria `divida` do inventário das idas
 * (**vazia** desde o LAB-37, D138), as perdas declaradas da ponte (que são perdas, não
 * dívidas), `TODO`/`FIXME` no código (**zero** — o repositório não usa) e a seção
 * *"Proposto ao chat — não executar"* da `FILA.md`.
 *
 * **A dívida estava na última, e ela é a pior possível: a lista que o CHAT LÊ.** Quatro das
 * filas que ele escreveu saíram dela — *"três dos cinco saíram da minha própria lista"*, *"é
 * a quarta fila seguida assim"*. Medido:
 *
 * > **De 14 itens abertos, CINCO já estavam executados — e DOIS eram cópias de itens
 * > riscados na mesma lista.** Se o chat tivesse lido a lista naquele dia, poderia ter
 * > mandado de volta trabalho já entregue.
 *
 * Não é hipótese de apodrecimento: é o apodrecimento, com linha e número.
 *
 * # O que esta ferramenta mede
 *
 * A régua mora em `src/varredura-das-propostas.ts` e cobra cinco coisas: item riscado diz
 * **qual prompt** o executou; item aberto diz **por que** segue aberto, de um vocabulário
 * **fechado**; nenhum item aberto é **cópia** de um riscado; nenhum motivo foge do
 * vocabulário; e nenhuma proposta vive **só em prosa**, fora da lista que o chat lê.
 *
 * Uso: `bun run lab61`
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  MOTIVOS_DE_SEGUIR_ABERTO,
  SOBREPOSICAO_MINIMA_DO_TITULO,
  conferirPropostas,
  lerPropostas,
  secoesDePropostaEmProsa,
  sobreposicaoDeTitulo,
  tituloDe,
} from "../src/varredura-das-propostas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FILA = join(RAIZ, "docs", "prompts", "FILA.md");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-61");

const texto = readFileSync(FILA, "utf8");
const itens = lerPropostas(texto);
const prosa = secoesDePropostaEmProsa(texto);
const problemas = conferirPropostas(itens, prosa);

const abertos = itens.filter((i) => !i.riscado);
const riscados = itens.filter((i) => i.riscado);
const porMotivo: Record<string, number> = {};
for (const i of abertos) porMotivo[String(i.motivo)] = (porMotivo[String(i.motivo)] ?? 0) + 1;

/**
 * ── O ESTADO DE ANTES, LIDO DO GIT — e não da minha memória ─────────────────
 *
 * O conserto está na árvore de trabalho, então medir "antes" aqui exigiria lembrar. O git
 * tem a árvore de antes, e é dela que o número sai: `git show <commit>:docs/prompts/FILA.md`.
 * *Número que o repositório guarda não se escreve de cabeça* (D185).
 */
const COMMIT_DE_ANTES = "961890b";
const antes = (() => {
  try {
    const t = execFileSync("git", ["-C", RAIZ, "show", `${COMMIT_DE_ANTES}:docs/prompts/FILA.md`], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const i = lerPropostas(t);
    const pr = secoesDePropostaEmProsa(t);
    const p = conferirPropostas(i, pr);
    // As sobreposições dos três casos, medidas na árvore de ANTES.
    const risc = i.filter((x) => x.riscado);
    const casos = ["passagem externa do motor", "DETECTOR DE PROVA VELHA", "faceDeRua"].map((marca) => {
      const alvo = i.find((x) => !x.riscado && x.texto.includes(marca));
      if (!alvo) return { marca, sobreposicao: null, com: null };
      const melhor = risc
        .filter((r) => r.decisoes.some((d) => alvo.decisoes.includes(d)))
        .map((r) => ({ linha: r.linha, s: sobreposicaoDeTitulo(tituloDe(alvo.texto), tituloDe(r.texto)) }))
        .sort((a, b) => b.s - a.s)[0];
      return { marca, sobreposicao: melhor?.s ?? null, com: melhor?.linha ?? null };
    });
    return {
      commit: COMMIT_DE_ANTES,
      itens: i.length,
      riscados: risc.length,
      abertos: i.length - risc.length,
      problemas: p.length,
      porClasse: p.reduce<Record<string, number>>((acc, x) => {
        acc[x.classe] = (acc[x.classe] ?? 0) + 1;
        return acc;
      }, {}),
      lista: p.map((x) => ({ linha: x.linha, classe: x.classe, oQue: x.oQue })),
      asSobreposicoesMedidas: casos,
    };
  } catch (e) {
    console.error(`✗ não consegui ler a FILA.md do commit ${COMMIT_DE_ANTES}: ${String(e)}`);
    console.error("  O 'antes' deste prompt é MEDIDO do git, não lembrado — sem ele a ferramenta para.");
    process.exit(1);
  }
})();

console.log("══════════ LAB-61 · a minha própria lista de propostas ══════════");
console.log(`  ANTES (commit ${antes.commit}): ${antes.itens} itens · ${antes.riscados} riscados · ${antes.abertos} abertos · ${antes.problemas} problemas`);
console.log(`    por classe: ${JSON.stringify(antes.porClasse)}`);
for (const c of antes.asSobreposicoesMedidas) {
  console.log(`    sobreposição de título "${c.marca}": ${c.sobreposicao === null ? "—" : c.sobreposicao} (limiar ${SOBREPOSICAO_MINIMA_DO_TITULO})`);
}
console.log(`  AGORA: ${itens.length} itens · ${riscados.length} riscados · ${abertos.length} abertos · ${problemas.length} problemas`);
console.log(`    abertos por motivo: ${JSON.stringify(porMotivo)}`);
console.log(`    seções de proposta em prosa: ${prosa.length}, todas citadas pela lista`);
if (problemas.length) {
  console.error("\n✗ A LISTA AINDA TEM PROBLEMA:");
  for (const p of problemas) console.error(`  L${p.linha} [${p.classe}] ${p.oQue}`);
  process.exit(1);
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "a-minha-lista-de-propostas.json"),
  JSON.stringify(
    {
      prompt: "LAB-61",
      oQueIstoMede:
        "a saúde da seção 'Proposto ao chat — não executar' da FILA.md, que é a MINHA lista de " +
        "dívida e é o que o chat lê para escrever fila — quatro filas saíram dela",
      aPergunta: "do chat: continue a dívida própria com o que sobrou",
      quando: new Date().toISOString(),
      ondeEuPROCUREIDIVIDA: {
        "inventario-das-idas.ts · categoria `divida`": "VAZIA desde o LAB-37 (D138) — era a testada de frente, e foi paga",
        "inventario-das-pontes.ts · `perda`": "são perdas DECLARADAS, com motivo medido: não são dívida",
        "TODO/FIXME/XXX no código": "ZERO — este repositório não usa marcador de dívida em comentário, e é de propósito (D104)",
        "FILA.md · 'Proposto ao chat — não executar'": "AQUI estava a dívida, e é a pior: a lista que o CHAT LÊ",
      },
      aRegua: {
        onde: "src/varredura-das-propostas.ts",
        oQueCobra: [
          "item riscado diz QUAL prompt o executou (✅ **executado no LAB-xx**)",
          "item aberto diz POR QUE segue aberto (**Segue aberto:** `motivo`), de vocabulário FECHADO",
          "nenhum item aberto é CÓPIA de um riscado — dois sinais: decisão compartilhada E título sobreposto",
          "nenhum motivo foge do vocabulário",
          "nenhuma proposta vive SÓ EM PROSA, fora da lista que o chat lê",
        ],
        aCopiaPedeDOISSinais:
          "a primeira versão casava só pelo número da decisão, e acusou uma TERCEIRA que não é cópia " +
          "(o `faceDeRua` cita D156 porque foi o LAB-43 que o achou, o mesmo prompt que propôs o " +
          "detector). Régua que eu afrouxaria para caber no meu número é enfeite (D172): foi ESTREITADA",
        oLimiarDoTitulo: SOBREPOSICAO_MINIMA_DO_TITULO,
        porqueNaoEhIgualdade:
          "a cópia da passagem externa diz 'põe lote' num item e 'o motor põe lote' no outro — régua " +
          "de título exato mede ORTOGRAFIA (D137)",
        oVocabulario: MOTIVOS_DE_SEGUIR_ABERTO,
      },
      antes,
      agora: {
        itens: itens.length,
        riscados: riscados.length,
        abertos: abertos.length,
        problemas: problemas.length,
        abertosPorMotivo: porMotivo,
        secoesDePropostaEmProsa: prosa,
      },
      oQueFoiPAGO: [
        "CINCO itens abertos que já estavam executados foram riscados COM o prompt que os fez: o conserto da ponte (LAB-53), a passagem externa (LAB-50), o detector de prova velha (LAB-49), um nome só para cada número (LAB-44) e o CI do comando único (LAB-38)",
        "DOIS deles eram CÓPIA de itens riscados na MESMA lista, e isso está dito em cada um",
        "os NOVE que seguem abertos ganharam o motivo DECLARADO, de vocabulário fechado",
        "as DUAS propostas que viviam só em prosa (LAB-59 e LAB-60) entraram na lista, porque proposta que o chat acha por sorte não é proposta",
      ],
      itens: itens.map((i) => ({
        linha: i.linha,
        titulo: tituloDe(i.texto),
        riscado: i.riscado,
        executadoPor: i.executadoPor,
        motivo: i.motivo,
        decisoes: i.decisoes,
      })),
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-61/a-minha-lista-de-propostas.json`);
