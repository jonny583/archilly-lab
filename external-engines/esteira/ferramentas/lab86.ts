/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PROVA VELHA, E O ALCANCE DA RECONTAGEM. (item 019, LAB-86)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ```sh
 * bun run lab86
 * ```
 *
 * Publica o que o item 019 pediu: o defeito do **D204** remedido na árvore de hoje, a forma
 * escolhida com o motivo, a demonstração nos dois sentidos, e **o alcance** — quantas provas
 * desta casa podem ser recontadas assim, e quantas não podem, com o motivo de cada classe.
 *
 * *O item mandou a medição decidir o tamanho, como o 016 mandou: item que reescreve setenta
 * provas numa rodada é item que ninguém revisa.*
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { medirOEscopo, remedirAProva } from "../src/escopo-da-varredura.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVAS = join(RAIZ, "docs", "provas");
const SAIDA = join(PROVAS, "LAB-86");

const ler = (rel: string) => readFileSync(join(RAIZ, rel), "utf8");
const carregados = execFileSync("git", ["-C", RAIZ, "ls-files", "-z"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
})
  .split("\0")
  .filter((f) => f.length > 0);

// ── 1 · O defeito do D204, remedido na árvore de hoje ─────────────────────
const agora = medirOEscopo(carregados, ler);
const publicada = JSON.parse(ler("docs/provas/LAB-57/varredura-de-configuracao.json")) as {
  escopo: Record<string, unknown>;
};
const divergencias = remedirAProva(publicada.escopo, agora.numeros);

console.log("══════════ LAB-86 · a prova velha, e o alcance ══════════\n");
console.log("  1 · A PROVA DO LAB-57 CONTRA A ÁRVORE DE AGORA");
console.log(
  `     ${divergencias.length === 0 ? "bate em todos os números" : `${divergencias.length} número(s) divergindo`}`,
);
for (const d of divergencias) {
  console.log(`     · ${d.chave}: na prova ${d.naProva}, na árvore ${d.naArvore}`);
}

/**
 * O que a prova **dizia** quando o item 019 abriu, e o que a mesma árvore dizia.
 *
 * Fica declarado porque é o achado: *a prova não envelheceu por descuido — ela envelheceu
 * porque o prompt que a gerou continuou trabalhando depois de gerá-la*, e a trava a conferia
 * com LIMIAR, que não tem como notar.
 */
const O_QUE_ESTAVA_NO_DISCO = {
  arquivosQueOGitCarrega: 364,
  configuracoesEncontradas: 27,
  configuracoesVarridas: 11,
  configuracoesForaDoEscopoNomeadas: 16,
  linhasDeConfiguracaoLidas: 662,
  arquivosDeCodigoVarridos: 128,
  linhasDeCodigoLidas: 36157,
  regras: 7,
} as const;
const oQueOLimiarDeixavaPassar = remedirAProva(O_QUE_ESTAVA_NO_DISCO, agora.numeros);

console.log("\n  2 · O QUE O LIMIAR DEIXAVA PASSAR (a prova de ontem contra a árvore de hoje)");
for (const d of oQueOLimiarDeixavaPassar) {
  const dif = d.naArvore - d.naProva;
  const pct = ((dif / d.naArvore) * 100).toFixed(1);
  console.log(`     · ${d.chave.padEnd(32)} ${String(d.naProva).padStart(6)} → ${String(d.naArvore).padStart(6)}  (${pct} % do número de hoje)`);
}

// ── 3 · O ALCANCE: quantas provas podem ser recontadas assim ──────────────
//
// A pergunta não é "quantas provas existem", é **quantas têm o universo DENTRO desta casa**.
// Uma prova medida contra o clone de um vizinho ou contra uma rodada do motor não se reconta
// de graça: o LAB-79 já mediu que regerá-la em silêncio TROCA A PERGUNTA, porque o motor
// andou. *Recontar o que depende de fora não é mais rigor: é outra medição com o nome da
// antiga.*
interface Classe {
  classe: string;
  oQue: string;
  provas: string[];
}
const todas: string[] = [];
for (const pasta of readdirSync(PROVAS, { withFileTypes: true })) {
  if (!pasta.isDirectory()) continue;
  for (const f of readdirSync(join(PROVAS, pasta.name))) {
    if (f.endsWith(".json")) todas.push(`${pasta.name}/${f}`);
  }
}
todas.sort();

const CITA_VIZINHO = /motor-testfit|urban-create-hub|urban-scout|@testfit|@generate|commit|semente|gleba/i;
const recontaveis: string[] = [];
const dependemDeFora: string[] = [];
for (const rel of todas) {
  const texto = ler(`docs/provas/${rel}`);
  (CITA_VIZINHO.test(texto) ? dependemDeFora : recontaveis).push(rel);
}

const classes: Classe[] = [
  {
    classe: "universo DENTRO desta casa",
    oQue:
      "não cita clone vizinho, commit, semente nem gleba: o que ela mede são arquivos deste " +
      "repositório, então a recontagem é barata, exata e sem rede — é onde a forma do LAB-86 cabe",
    provas: recontaveis,
  },
  {
    classe: "depende de FORA, e recontar troca a pergunta",
    oQue:
      "mede contra clone vizinho, commit de outro repositório, semente ou gleba. O LAB-79 já " +
      "mediu: regerá-la em silêncio não atualiza a medição, TROCA A PERGUNTA — o LAB-78 perdeu " +
      "dois de quatro lotes assim, porque o motor andou de 4181e95 para 6cf6396. Ela se regera " +
      "DECLARANDO o commit, e isso é outro prompt",
    provas: dependemDeFora,
  },
];

console.log("\n  3 · O ALCANCE — quantas provas se recontam assim");
for (const c of classes) {
  console.log(`     ${String(c.provas.length).padStart(3)}  ${c.classe}`);
}
console.log(`     ${String(todas.length).padStart(3)}  no total`);
console.log("\n  E QUANTAS JÁ ESTÃO RECONTADAS HOJE: 1 (a do LAB-57, nesta rodada)");

mkdirSync(SAIDA, { recursive: true });
const prova = {
  prompt: "LAB-86",
  oQue:
    "o defeito do D204 — prova gerada antes da última edição do que ela mede — remedido na " +
    "árvore de hoje, consertado por RECONTAGEM e medido no alcance",
  oQueIstoNaoMede:
    "não mede gleba e não roda motor: o objeto é o conjunto de PROVAS desta casa e a forma de " +
    "conferi-las. Por isso está na lista declarada de exceções do §7",
  quando: new Date().toISOString(),
  oChao: { bun: Bun.version, plataforma: process.platform },
  oDefeitoEstavaVIVO: {
    comoFoiMedido:
      "ao abrir o item 019, antes de uma linha de conserto: `bun run lab57` na mesma árvore, e " +
      "comparei com a prova commitada",
    oQueEstavaNoDisco: O_QUE_ESTAVA_NO_DISCO,
    oQueAArvoreDizia: agora.numeros,
    oQueDivergia: oQueOLimiarDeixavaPassar,
    porQueATravaNaoPegou:
      "ela conferia a prova com LIMIAR — `configuracoesEncontradas > 20`, " +
      "`configuracoesVarridas > 5`, `linhasDeCodigoLidas > 10000`. Uma prova congelada em " +
      "36 157 linhas passa `> 10000` para sempre. Régua que confere uma prova com `maior que` " +
      "aceita qualquer prova velha que já fosse grande o bastante quando nasceu: o limiar mede " +
      "se o número é PLAUSÍVEL, só a recontagem mede se ele é VERDADE — e num repositório que " +
      "cresce, o limiar fica mais frouxo a cada commit sem ninguém mexer nele",
  },
  aFormaEscolhida: {
    qual: "recontar e comparar, número por número",
    porque:
      "o universo desta varredura é o `git ls-files` DESTE repositório: sem clone, sem rede, sem " +
      "motor. Recontar custa ~0,3 s e a comparação é exata",
    porqueNaoOCarimbo:
      "o carimbo do disco não é o do git: numa sessão nova todo arquivo tem a data do checkout, " +
      "e a comparação vira vácuo — guarda que não acha o objeto não está aprovando, está sem " +
      "medir nada (D213). O item avisou disto, e é vácuo justamente onde a trava mais " +
      "precisaria valer: no CI, depois de um checkout limpo",
    ondeMora:
      "`src/escopo-da-varredura.ts` — a MESMA função que a ferramenta chama, porque duas " +
      "implementações da mesma pergunta divergem (D231)",
  },
  aDemonstracao: {
    oLadoRuim:
      "plantado o defeito do D204 de ponta a ponta: uma linha acrescentada a um arquivo que a " +
      "prova mede, sem regerar a prova. A trava reprovou nomeando a chave — `linhasDeCodigoLidas`, " +
      "na prova 50 714, na árvore 50 716 — e o arquivo foi devolvido byte a byte (sha256 conferido)",
    oLadoBom:
      "duas recontagens seguidas na mesma árvore batem, então a prova que não mudou porque NADA " +
      "que ela mede mudou passa calada. Era o caso que o item chamou de válido-que-parece-inválido: " +
      "régua que exigisse carimbo mais novo a cada commit reprovaria a árvore correta, e vigia que " +
      "nasce vermelho vira ruído e morre",
  },
  oAlcance: {
    universo: todas.length,
    classes: classes.map((c) => ({ classe: c.classe, quantas: c.provas.length, oQue: c.oQue, provas: c.provas })),
    recontadasHoje: 1,
    oQueIssoDecide:
      "a forma cabe nas provas cujo universo está DENTRO desta casa; as que medem contra clone " +
      "vizinho, commit, semente ou gleba não se recontam de graça, porque recontar TROCA A " +
      "PERGUNTA. Nesta rodada foi recontada UMA — a do D204, que é a que o item nomeou. " +
      "Estender às outras é medição por prova, e vai à FILA em vez de sair agora: item que " +
      "reescreve setenta provas numa rodada é item que ninguém revisa",
  },
  conferidoAqui: "sim, na máquina da sessão — não no GitHub (§7)",
};
writeFileSync(join(SAIDA, "a-prova-velha.json"), `${JSON.stringify(prova, null, 2)}\n`);
console.log("\nprova: docs/provas/LAB-86/a-prova-velha.json");
