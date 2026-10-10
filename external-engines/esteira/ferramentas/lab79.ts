/**
 * LAB-79 — O ALCANCE DAS PROVAS: quantas se conferem contra SI MESMAS. (item 012)
 *
 * O item 012 manda **medir antes de construir**, e a razão é esta:
 *
 * > *"Diga o número, e diga quantas são, para que 'verde' não volte a ser uma frase sobre um
 * > universo não medido."*
 *
 * Esta ferramenta mede o universo **mecanicamente**: ela varre `docs/provas/` e os arquivos de
 * teste, e descobre **quais travas nomeiam cada prova**. Nada aqui é declarado por mim — a lista
 * de quem cita quem sai da leitura dos arquivos, e é por isso que ela não envelhece junto com a
 * minha memória.
 *
 * **O que É declarado, e fica separado:** quais provas têm **escopo publicado** chave por chave.
 * Isso mora em `escopo-do-detector.ts` (as duas do LAB-49) e em `escopo-remedido.ts` (as que o
 * LAB-79 acrescentou), e a trava confere que cada nome declarado **existe** no disco.
 *
 * Uso: `bun run lab79`
 */

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { ESCOPO_DO_DETECTOR } from "../src/escopo-do-detector.ts";
import { ESCOPO_REMEDIDO } from "../src/escopo-remedido.ts";
import {
  O_QUE_A_PROVA_AFIRMA,
  aContaDoAlcanceFecha,
  medirOAlcance,
  podeSerRegerada,
  type ComoSeConfere,
  type ProvaMedida,
} from "../src/alcance-das-provas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVAS = join(RAIZ, "docs", "provas");
const SAIDA = join(PROVAS, "LAB-79");

/** Todo `.json` sob `docs/provas/`, pelo caminho relativo. */
function todasAsProvas(): string[] {
  const achadas: string[] = [];
  const andar = (dir: string): void => {
    for (const nome of readdirSync(dir)) {
      const cheio = join(dir, nome);
      if (statSync(cheio).isDirectory()) andar(cheio);
      else if (nome.endsWith(".json")) achadas.push(relative(PROVAS, cheio).split("\\").join("/"));
    }
  };
  andar(PROVAS);
  return achadas.sort();
}

/** Os arquivos de teste dos dois pacotes. */
function todosOsTestes(): { nome: string; corpo: string }[] {
  const saida: { nome: string; corpo: string }[] = [];
  for (const pacote of ["esteira", "testfit"]) {
    const dir = join(RAIZ, "external-engines", pacote, "tests");
    let nomes: string[];
    try {
      nomes = readdirSync(dir);
    } catch {
      continue; // pacote sem pasta de testes: não é zero, é ausência — e ela não inventa número
    }
    for (const n of nomes) {
      if (n.endsWith(".test.ts")) saida.push({ nome: n, corpo: readFileSync(join(dir, n), "utf8") });
    }
  }
  return saida;
}

/** A §7 — a trava que confere a FORMA (as chaves), e não o número. */
const A_TRAVA_DA_FORMA = "regras.test.ts";

const provasNoDisco = todasAsProvas();
const testes = todosOsTestes();
if (provasNoDisco.length === 0 || testes.length === 0) {
  throw new Error(
    `varredura vazia: ${provasNoDisco.length} provas e ${testes.length} testes — ` +
      "e zero aqui seria 'tudo conferido' sobre um universo que não foi lido",
  );
}

/** Quem cita a prova. Casa o caminho inteiro, ou a pasta E o nome do arquivo. */
function quemCita(caminho: string): string[] {
  const pasta = caminho.includes("/") ? caminho.slice(0, caminho.indexOf("/")) : "";
  const base = caminho.slice(caminho.lastIndexOf("/") + 1);
  return testes
    .filter((t) => t.corpo.includes(caminho) || (pasta !== "" && t.corpo.includes(pasta) && t.corpo.includes(base)))
    .map((t) => t.nome)
    .sort();
}

const comEscopo = new Set([...Object.keys(ESCOPO_DO_DETECTOR), ...Object.keys(ESCOPO_REMEDIDO)]);

const medidas: ProvaMedida[] = provasNoDisco.map((caminho): ProvaMedida => {
  const travas = quemCita(caminho);
  let comoSeConfere: ComoSeConfere;
  if (comEscopo.has(caminho)) comoSeConfere = "remedida-da-fonte";
  else if (travas.length === 0) comoSeConfere = "sem-trava";
  else if (travas.length === 1 && travas[0] === A_TRAVA_DA_FORMA) comoSeConfere = "so-a-forma";
  else comoSeConfere = "remedida-sem-escopo-declarado";
  return { caminho, comoSeConfere, travas };
});

const alcance = medirOAlcance(medidas, comEscopo.size);
if (!aContaDoAlcanceFecha(alcance)) {
  throw new Error(`a conta do alcance NÃO fecha: ${JSON.stringify(alcance)}`);
}

// ── Os nomes declarados existem no disco? Declaração que aponta para nada é pior que silêncio ──
const declaradosQueNaoExistem = [...comEscopo].filter((c) => !provasNoDisco.includes(c));

// ── A fronteira do D182, exercida nos três casos ────────────────────────────────
const aFronteira = O_QUE_A_PROVA_AFIRMA.flatMap((afirma) =>
  [true, false].map((comCommit) => ({
    afirma,
    commitDoVizinhoDeclarado: comCommit,
    ...podeSerRegerada(afirma, comCommit),
  })),
);

// ── O que vai à tela ───────────────────────────────────────────────────────────
console.log("\n═══ LAB-79 · O ALCANCE DAS PROVAS (item 012) ═══\n");
console.log(`O UNIVERSO: ${alcance.comoSeDiz}\n`);

console.log("POR COMO SE CONFERE:");
for (const [k, n] of Object.entries(alcance.porComoSeConfere)) {
  console.log(`  ${String(n).padStart(3)} · ${k}`);
}
console.log(`  ${String(alcance.universo).padStart(3)} · TOTAL (a conta fecha)\n`);

console.log("AS QUE TÊM ESCOPO PUBLICADO, chave por chave:");
for (const c of [...comEscopo].sort()) {
  const de = Object.keys(ESCOPO_DO_DETECTOR).includes(c) ? "LAB-49" : "LAB-79";
  console.log(`  · ${c.padEnd(46)} (${de})`);
}
if (declaradosQueNaoExistem.length) {
  console.log("\n  ✗ DECLARADAS E AUSENTES DO DISCO:");
  for (const c of declaradosQueNaoExistem) console.log(`      ${c}`);
}

console.log("\nSEM TRAVA NENHUMA — não é 'aprovada', é NÃO LIDA:");
for (const p of medidas.filter((m) => m.comoSeConfere === "sem-trava")) console.log(`  · ${p.caminho}`);

console.log("\nSÓ A FORMA (a §7 confere as CHAVES, não o número):");
for (const p of medidas.filter((m) => m.comoSeConfere === "so-a-forma")) console.log(`  · ${p.caminho}`);

console.log("\nA FRONTEIRA DO D182 — o que pode ser regerado:");
for (const f of aFronteira) {
  console.log(`  ${f.pode ? "PODE " : "NÃO  "} ${f.afirma} · commit do vizinho declarado: ${f.commitDoVizinhoDeclarado}`);
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "alcance-das-provas.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-79",
      oQueIstoMede:
        "quantas provas deste repositório são remedidas CONTRA A FONTE e quantas só se conferem " +
        "contra si mesmas — a §7 lendo as chaves — ou não são lidas por trava nenhuma. A lista de " +
        "quem cita quem é MECÂNICA: sai da leitura dos arquivos de teste, não da minha memória",
      oQueIstoNaoMede:
        "não roda motor nenhum e não mede gleba: o objeto é o conjunto de PROVAS e as travas que " +
        "as leem. Por isso está na lista declarada de exceções do §7",
      quando: new Date().toISOString(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      alcance,
      comEscopoPublicado: [...comEscopo].sort(),
      declaradosQueNaoExistem,
      aFronteiraDoD182: aFronteira,
      oAchado:
        "a divisão de DUAS classes que o item sugeriu (estado de agora / evento) não cobre todas: " +
        "prova medida contra o CLONE DE UM VIZINHO afirma o presente de OUTRO repositório, num " +
        "commit dele. Regerá-la em silêncio não atualiza a medição — TROCA A PERGUNTA. O LAB-78 " +
        "perdeu dois de quatro lotes exatamente assim, porque o motor andou de 4181e95 para " +
        "6cf6396. Ela se regera DECLARANDO o commit, e nunca sem ele",
      provas: medidas,
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-79/alcance-das-provas.json\n`);
