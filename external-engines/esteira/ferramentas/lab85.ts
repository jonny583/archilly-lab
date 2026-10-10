/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O QUE O GATILHO CARREGA — a conta dos três caminhos. (item 018, LAB-85)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ```sh
 * bun run lab85
 * ```
 *
 * O item 018 pediu *"o número de NOVEMBRO, não o de outubro"*. A medição de novembro veio da
 * **API do Actions**, nesta rodada, e está gravada aqui com o **id de cada execução e o nome de
 * cada campo**, para qualquer um reconferir: *número declarado sem a fonte é número meu.*
 *
 * **Esta ferramenta NÃO refaz a chamada à API.** O CI está desligado e a API é rede; a trava desta
 * casa não faz rede e a ferramenta não precisa. O que ela faz é publicar a medição com a
 * procedência e **recalcular o que se deriva dela** — a conta dos três caminhos —, mais a
 * conferência da decisão contra os arquivos de hoje.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  CAMINHOS,
  CONDICAO_DO_VERDE_COMPLETO,
  DATA_DO_PRAZO,
  PORQUE_PELO_EVENTO,
  conferirOQueOGatilhoCarrega,
  jobsDoWorkflow,
} from "../src/o-que-o-gatilho-carrega.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-85");

/**
 * As execuções medidas na API, com o id e o campo de cada número.
 *
 * `billableMs` é `billable.UBUNTU.total_ms` de `GET /actions/runs/{id}/timing`; `duracaoMs` é
 * `run_duration_ms` do mesmo campo. As durações de trabalho vêm de `GET /actions/runs/{id}/jobs`,
 * dos campos `started_at` e `completed_at`.
 */
const EXECUCOES_MEDIDAS = [
  {
    id: 37751994616,
    quando: "2026-10-08T08:45:45Z",
    evento: "push",
    conclusao: "failure",
    duracaoMs: 9000,
    billableMs: 0,
    trabalhos: [
      { nome: "guardas-sem-clones", conclusao: "success", segundos: 6 },
      { nome: "verde-completo", conclusao: "failure", segundos: 5, precondicaoFalhouEmS: 3 },
    ],
  },
  {
    id: 37751249491,
    quando: "2026-10-08T08:39:08Z",
    evento: "pull_request",
    conclusao: "failure",
    duracaoMs: 49000,
    billableMs: 0,
    trabalhos: [
      { nome: "guardas-sem-clones", conclusao: "success", segundos: 11 },
      { nome: "verde-completo", conclusao: "failure", segundos: 7, precondicaoFalhouEmS: 4 },
    ],
  },
  {
    id: 37713910680,
    quando: "2026-10-08T01:38:11Z",
    evento: "push",
    conclusao: "failure",
    duracaoMs: 10000,
    billableMs: 0,
    trabalhos: [{ nome: "(não detalhado)", conclusao: "—", segundos: null }],
  },
] as const;

const workflow = readFileSync(join(RAIZ, ".github", "workflows", "verde.yml"), "utf8");
const pagina = readFileSync(join(RAIZ, "docs", "PENDENCIAS_JONNY.md"), "utf8");

console.log("  AS EXECUÇÕES MEDIDAS NA API, e o campo de cada número:\n");
console.log("    execução       evento        conclusão   duração   COBRADO");
for (const e of EXECUCOES_MEDIDAS) {
  console.log(
    `    ${String(e.id).padEnd(14)} ${e.evento.padEnd(13)} ${e.conclusao.padEnd(11)} ` +
      `${String(e.duracaoMs / 1000).padStart(5)} s   ${e.billableMs} ms`,
  );
}
const todosZero = EXECUCOES_MEDIDAS.every((e) => e.billableMs === 0);
console.log(`\n  cobrado em TODAS as execuções medidas: ${todosZero ? "ZERO" : "NÃO É ZERO"}`);

console.log("\n  OS TRÊS CAMINHOS, e o dinheiro empata nos três:\n");
for (const c of CAMINHOS) {
  console.log(`    ${c.escolhido ? "→" : " "} ${c.nome}  (${c.custoEmNovembro})`);
}

const jobs = jobsDoWorkflow(workflow);
const problemas = conferirOQueOGatilhoCarrega(workflow, pagina);
console.log(`\n  a condição no arquivo: ${String(jobs?.["verde-completo"]?.if)}`);
console.log(`  o trabalho 1 tem condição? ${jobs?.["guardas-sem-clones"]?.if === undefined ? "não" : "SIM — defeito"}`);
console.log(`  problemas na decisão de hoje: ${problemas.length === 0 ? "nenhum" : problemas.length}`);
for (const p of problemas) console.log(`   · ${p.tipo}: ${p.oQue}`);

mkdirSync(PROVA, { recursive: true });
const prova = {
  prompt: "LAB-85",
  oQue:
    "a decisão sobre o que o gatilho automático do CI carrega quando ele voltar em " +
    `${DATA_DO_PRAZO}, com a conta dos três caminhos e a medição de NOVEMBRO que o item 018 ` +
    "exigiu — por execução da API do Actions, não por lembrança do número de outubro",
  oQueIstoNaoMede:
    "não mede gleba e não roda motor: o objeto é a CONFIGURAÇÃO do CI e o custo de cada caminho. " +
    "Por isso está na lista declarada de exceções do §7",
  quando: new Date().toISOString(),
  oChao: { bun: Bun.version, plataforma: process.platform },
  deOndeVemCadaNumero:
    "API do Actions nesta rodada: `billable.UBUNTU.total_ms` e `run_duration_ms` de " +
    "`/actions/runs/{id}/timing`; `started_at`/`completed_at` de `/actions/runs/{id}/jobs`. Os " +
    "ids estão em `asExecucoesMedidas` para qualquer um reconferir",
  asExecucoesMedidas: EXECUCOES_MEDIDAS,
  oCobradoEhZero: todosZero,
  oQueAMedicaoMoveu: [
    "os '136 minutos, 50 % de tudo' do D221 são minutos-TRABALHO consumidos, não dinheiro: o " +
      "cobrado é ZERO em 3 de 3 execuções medidas, porque o repositório é público e " +
      "`ubuntu-latest` em repositório público é gratuito e não medido. Novembro custa R$ 0 em " +
      "qualquer caminho, então a escolha NÃO é de dinheiro — e o item autorizava parar na " +
      "fronteira se fosse",
    "o trabalho condenado dura 5 a 7 s e a precondição falha 3 a 4 s depois do início, com todo " +
      "o resto `skipped`: ele nunca clona, nunca instala, nunca roda a suíte. O D124 funciona " +
      "exatamente como desenhado",
    "a pendência do `VIZINHOS_TOKEN` NÃO estava na página do Jonny, ao contrário do que o item " +
      "afirmou: zero ocorrências de 'token' nela. O LAB-38 propôs isto no RELATÓRIO, em 19/09, e " +
      "nunca na página — 46 prompts com o pedido no lugar errado",
  ],
  oCustoREAL:
    "136 de 136 execuções terminaram em `failure`, sempre no mesmo passo. Um sinal que ficou " +
    "vermelho 136 de 136 vezes não é alarme, é ruído de fundo — e o custo dele não se paga em " +
    "minuto, paga-se em quantas vezes alguém aprendeu a ignorar o vermelho",
  osTresCaminhos: CAMINHOS,
  aDecisao: {
    condicao: CONDICAO_DO_VERDE_COMPLETO,
    porqueNaoPeloSegredo: PORQUE_PELO_EVENTO,
    marca: "a caixa de comentário do trabalho 2 e a §11 da página do Jonny",
    prazo:
      "é um EVENTO e não uma data: no dia em que o segredo existir, a pendência é riscada e a " +
      "condição TEM DE SAIR — e a trava cobra esse sentido também",
    oGatilhoFoiReligado: false,
  },
  aConferencia: { problemas, condicaoNoArquivo: jobs?.["verde-completo"]?.if ?? null },
  conferidoAqui: "sim, na máquina da sessão — não no GitHub (§7)",
};
writeFileSync(join(PROVA, "o-que-o-gatilho-carrega.json"), `${JSON.stringify(prova, null, 2)}\n`);
console.log("\nprova: docs/provas/LAB-85/o-que-o-gatilho-carrega.json");
