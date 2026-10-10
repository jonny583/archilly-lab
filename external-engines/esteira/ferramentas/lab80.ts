/**
 * LAB-80 — O DESTINO DO QUE SAI: a varredura de custo escopada por destino. (D243)
 *
 * O critério do teto da lista nominal **disparou** no item 007, e a §1-A mandou propor em vez de
 * executar. O chat escolheu esta proposta no item 012 — *"ela é boa, está certa, e é a próxima"*.
 *
 * Esta ferramenta publica a medição que decidiu o desenho: o universo, a partição por destino, e
 * **o que cada destino ofereceu à régua**. Nada aqui é lista escrita à mão — o destino sai da
 * estrutura do caminho, e os achados saem da leitura dos arquivos.
 *
 * # ESTA FERRAMENTA LÊ A PRÓPRIA PROVA, e por isso CONVERGE EM DUAS PASSAGENS
 *
 * A varredura lê **tudo que o git carrega** — e a prova que ela escreve está dentro disso. Então o
 * número que ela imprime é sobre a prova **anterior**, e mudar o que a prova contém exige rodá-la
 * **duas vezes** para o relato bater com o disco. Não é defeito: é a mesma ordem que o D256
 * descobriu nas provas de estado — *prova de estado se regera DEPOIS da última edição da fonte* —,
 * aqui com a fonte sendo a própria prova.
 *
 * > **Régua que se inclui no universo que mede não erra: ela atrasa uma passagem.** Quem a roda
 * > uma vez e lê o número está lendo o mundo de antes da própria escrita.
 *
 * Uso: `bun run lab80` (duas vezes, quando o conteúdo da prova mudar)
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_ONZE_ISENCOES,
  DESTINOS,
  PERDAS_DECLARADAS,
  RIGOR,
  SABOTAGEM,
  aContaDosDestinosFecha,
  arquivosDoGit,
  asDuasReguas,
  chamadasPagasDeIA,
  leuMenosDoQueAfirma,
  varrerOQueSai,
  vazaNoDestino,
  type Destino,
} from "../src/destino-do-que-sai.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-80");

const correr = (args: string[]): string =>
  execFileSync("git", args, { cwd: RAIZ, encoding: "utf8", maxBuffer: 64e6 });

const arquivos = arquivosDoGit(RAIZ, correr);
const varredura = varrerOQueSai(RAIZ, arquivos);
const chamadas = chamadasPagasDeIA(RAIZ, arquivos);

const aindaPrecisariam = AS_ONZE_ISENCOES.filter((f) =>
  varredura.achados.some((a) => a.arquivo === f),
);

/**
 * A sabotagem sai como **VEREDICTO, nunca como o texto plantado** — e isto foi medido contra
 * mim neste prompt: a primeira versão desta prova publicava as fixtures, e a varredura
 * **acusou a própria prova em 7 linhas**. Sexta vez da forma do D155 nesta trava (D262).
 *
 * É a mesma disciplina que o §4 já impõe ao segredo — *"registro nenhum repete mais de doze
 * caracteres"*. O texto plantado mora no código, que é varrido em posição de identificador; a
 * prova diz se a régua pegou, e quem quiser o texto abre `SABOTAGEM` em `src/`.
 */
const sabotagem = DESTINOS.map((d: Destino) => ({
  destino: d,
  aReguaPega: vazaNoDestino(d, SABOTAGEM[d].pega, d === "registro" ? "markdown" : undefined),
  aReguaPoupa: !vazaNoDestino(d, SABOTAGEM[d].naoPega, d === "registro" ? "markdown" : undefined),
  oTextoPlantado: "não vai à prova de propósito — mora em `SABOTAGEM`, em src/destino-do-que-sai.ts",
}));

console.log("\n═══ LAB-80 · o destino do que sai ═══\n");
console.log(`universo (o que o git carrega): ${varredura.universo}`);
for (const d of DESTINOS) {
  console.log(
    `  ${d.padEnd(19)} ${String(varredura.porDestino[d]).padStart(3)} arquivos · ` +
      `${String(varredura.linhasLidas[d]).padStart(6)} linhas lidas · régua: ${RIGOR[d].regras}`,
  );
}
console.log(`  a conta fecha: ${aContaDosDestinosFecha(varredura) ? "SIM" : "NÃO"}`);
console.log(`\nachados de vazamento: ${varredura.achados.length}`);
for (const a of varredura.achados) console.log(`  [${a.destino}] ${a.arquivo}:${a.linha}`);
console.log(`chamada paga de IA: ${chamadas.length}`);
console.log(`\nisenções nominais do desenho novo: ${varredura.isencoesNominais}`);
console.log(
  `das ${AS_ONZE_ISENCOES.length} do desenho velho, ainda precisariam de isenção: ` +
    `${aindaPrecisariam.length}${aindaPrecisariam.length > 0 ? ` (${aindaPrecisariam.join(", ")})` : ""}`,
);
const lado = asDuasReguas(RAIZ, arquivos);
const leuMenos = leuMenosDoQueAfirma(varredura);
console.log(`\nleu menos do que afirma: ${leuMenos.length === 0 ? "não — todo destino ofereceu linha" : leuMenos.join("; ")}`);
console.log("\nas duas réguas, lado a lado (só os arquivos que alguma acusa):");
console.log("  velha  nova  isento?  arquivo");
for (const l of lado) {
  console.log(`  ${String(l.aVelhaAcusava).padStart(5)} ${String(l.aNovaAcusa).padStart(5)}  ${l.eraIsentoPorNome ? "SIM    " : "não    "}  ${l.arquivo}`);
}
console.log("\nPERDAS DECLARADAS — o que a régua nova NÃO vê mais:");
for (const perda of PERDAS_DECLARADAS) {
  console.log(`  · [${perda.ondeDoia}] ${perda.oQue}`);
  console.log(`      escaparia: ${perda.frazeQueEscapa}`);
}
console.log("\nsabotagem, nos dois sentidos:");
for (const s of sabotagem) {
  console.log(`  ${s.destino.padEnd(19)} pega o plantado: ${s.aReguaPega ? "SIM" : "NÃO"} · poupa a frase da casa: ${s.aReguaPoupa ? "SIM" : "NÃO"}`);
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "destino-do-que-sai.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-80",
      oQue:
        "a varredura de custo escopada por DESTINO e não por nome de arquivo (D243): cada arquivo " +
        "que o git carrega recebe um destino pela ESTRUTURA do caminho, e o destino decide o rigor. " +
        "O `registro` — onde a casa escreve a própria regra — é varrido só pelo VALOR, e só em prosa " +
        "nua; os outros quatro, pelo nome e pelo valor",
      oQueIstoNaoMede:
        "não roda motor nenhum e não mede gleba: o objeto é o conjunto de ARQUIVOS que o git " +
        "carrega. Por isso está na lista declarada de exceções do §7",
      quando: new Date().toISOString(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      universo: varredura.universo,
      porDestino: varredura.porDestino,
      linhasLidas: varredura.linhasLidas,
      aContaFecha: aContaDosDestinosFecha(varredura),
      rigorDeCadaDestino: RIGOR,
      achados: varredura.achados,
      chamadaPagaDeIA: chamadas,
      isencoesNominais: varredura.isencoesNominais,
      oDesenhoVelho: {
        quantasIsencoes: AS_ONZE_ISENCOES.length,
        quaisEram: [...AS_ONZE_ISENCOES],
        aindaPrecisariamDeIsencao: aindaPrecisariam,
        acusavamAlgoDeFato: 9,
        mortasNaLista: ["docs/DECISOES.md", "docs/relatorios/LAB-74.md"],
        oQueAsMortasEnsinam:
          "`LAB-74.md`, varrido commit a commit com as sete regras, NUNCA casou com nenhuma delas em " +
          "toda a sua história — e é uma das duas entradas que DISPARARAM o critério do teto. " +
          "Entrada adivinhada numa lista que jurava não adivinhar (D260)",
      },
      sabotagem,
      leuMenosDoQueAfirma: leuMenos,
      asDuasReguasLadoALado: lado,
      // **A prova publica O QUE e ONDE, nunca o MOTIVO nem a frase que escapa** — e isto é o D262
      // pela terceira vez nesta rodada: o motivo de uma perda **cita a frase proibida** para
      // explicar por que ela deixou de ser acusada, e a prova em JSON **não tem marca de citação**
      // para protegê-la. O texto inteiro mora em dois lugares que podem carregá-lo: `PERDAS_DECLARADAS`
      // em `src/` (código, lido em posição de identificador) e o §3-A do relatório (Markdown, onde a
      // crase e a aspas curtas são a proteção).
      //
      // > **As duas formas do registro não podem carregar a mesma coisa:** o Markdown pode citar a
      // > frase proibida porque tem como marcar citação; o JSON não tem, e por isso não pode.
      perdasDeclaradas: PERDAS_DECLARADAS.map((perda) => ({
        oQue: perda.oQue,
        ondeDoia: perda.ondeDoia,
        oMotivoEAFraseQueEscapa:
          "não vão à prova de propósito (D262): o motivo CITA a frase proibida, e JSON não tem marca " +
          "de citação. Estão em `PERDAS_DECLARADAS`, em src/destino-do-que-sai.ts, e no §3-A do relatório",
      })),
      aFronteiraDoItem013:
        "o item 013 proíbe entregar isto como melhoria: mudança de modelo de varredura de segurança " +
        "pode encolher o que ela vê, e o que encolheu sai como PERDA. São três, e cada uma traz a " +
        "frase concreta que escaparia — a trava roda AS DUAS réguas sobre essa frase, a velha tem de " +
        "pegar e a nova tem de deixar passar. Perda declarada que ninguém demonstra é perda suposta",
      oAchado:
        "a frase que PROÍBE o vazamento enumera numa linha os três nomes que ela proíbe, então toda " +
        "régua de proximidade a morde — e ela tem de estar escrita em todo lugar onde a regra vale. " +
        "A lista de isenções não media vazamento: media quantas vezes a casa repetiu a própria " +
        "regra. A palavra do D243 é VALOR, e é o NÚMERO na linha que separa enunciar de vazar",
      conferidoAqui: "sim, na máquina da sessão — não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-80/destino-do-que-sai.json\n`);
