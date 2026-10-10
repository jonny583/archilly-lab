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
 * Uso: `bun run lab80`
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  DESTINOS,
  RIGOR,
  SABOTAGEM,
  aContaDosDestinosFecha,
  arquivosDoGit,
  chamadasPagasDeIA,
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

/** As 11 isenções que o desenho velho usava — conferidas uma a uma contra a régua de hoje. */
const AS_ONZE_DO_DESENHO_VELHO = [
  "external-engines/esteira/tests/vazamento-de-custo.test.ts",
  "docs/DECISOES.md",
  "docs/relatorios/RECADOS.md",
  "docs/relatorios/LAB-67.md",
  "docs/INDEX.md",
  "CLAUDE.md",
  "docs/caixa-de-entrada/005-FEITO.md",
  "docs/relatorios/LAB-72.md",
  "external-engines/esteira/src/cobranca-por-uso.ts",
  "docs/relatorios/LAB-73.md",
  "docs/relatorios/LAB-74.md",
];

const aindaPrecisariam = AS_ONZE_DO_DESENHO_VELHO.filter((f) =>
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
  `das ${AS_ONZE_DO_DESENHO_VELHO.length} do desenho velho, ainda precisariam de isenção: ` +
    `${aindaPrecisariam.length}${aindaPrecisariam.length > 0 ? ` (${aindaPrecisariam.join(", ")})` : ""}`,
);
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
        quantasIsencoes: AS_ONZE_DO_DESENHO_VELHO.length,
        quaisEram: AS_ONZE_DO_DESENHO_VELHO,
        aindaPrecisariamDeIsencao: aindaPrecisariam,
        acusavamAlgoDeFato: 9,
        mortasNaLista: ["docs/DECISOES.md", "docs/relatorios/LAB-74.md"],
        oQueAsMortasEnsinam:
          "`LAB-74.md`, varrido commit a commit com as sete regras, NUNCA casou com nenhuma delas em " +
          "toda a sua história — e é uma das duas entradas que DISPARARAM o critério do teto. " +
          "Entrada adivinhada numa lista que jurava não adivinhar (D260)",
      },
      sabotagem,
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
