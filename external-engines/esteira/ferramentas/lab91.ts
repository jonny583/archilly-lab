/**
 * LAB-91 · A varredura REGERADA, as duas espécies e o conjunto do interpolador.
 *
 * Uso: `bun run lab91`
 *
 * **Esta prova não mede gleba nenhuma** — mede provas, regras e um conjunto de valores —, e por
 * isso está na lista declarada de exceções do §7 (LAB-36).
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_ESPECIES,
  conferirALista,
  conferirRegerando,
} from "../src/regerar-a-varredura.ts";
import { medirOEscopo } from "../src/escopo-da-varredura.ts";
import { EH_FONTE_TS, medirAsChamadas } from "../src/escopo-das-chamadas.ts";
import {
  INTERPOLADORES_ACEITOS,
  O_QUE_FICA_DE_FORA,
  O_QUE_O_GENERATE_DECLARA,
} from "../src/conjunto-do-interpolador.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-91");
const ler = (p: string): string => readFileSync(join(RAIZ, p), "utf8");
const doGit = (...args: string[]): string[] =>
  execFileSync("git", ["-C", RAIZ, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\0")
    .filter((f) => f.length > 0);

type Achado = { arquivo: string; linha: number; regra: string };
const provaJson = (p: string): Record<string, unknown> =>
  JSON.parse(ler(join("docs", "provas", p))) as Record<string, unknown>;

// ── As duas varreduras, REEXECUTADAS ─────────────────────────────────────────
const config = medirOEscopo(doGit("ls-files", "-z"), (rel) => ler(rel));
const chamadas = medirAsChamadas(
  doGit("ls-files", "--cached", "--others", "--exclude-standard", "-z", "*.ts").filter(EH_FONTE_TS),
  (rel) => ler(rel),
);

const provaConfig = provaJson("LAB-57/varredura-de-configuracao.json");
const provaChamadas = provaJson("LAB-52/varredura-de-chamadas.json");

const desacordos = {
  "LAB-57/varredura-de-configuracao.json": conferirRegerando(
    { porRegra: provaConfig.totalPorRegra as Record<string, number>, achados: provaConfig.achados as Achado[] },
    { porRegra: config.porRegra, achados: config.achados as Achado[] },
  ),
  "LAB-52/varredura-de-chamadas.json": conferirRegerando(
    { porRegra: provaChamadas.porRegra as Record<string, number>, achados: provaChamadas.achados as Achado[] },
    { porRegra: chamadas.porRegra, achados: chamadas.achados as Achado[] },
  ),
};

const todasAsProvas = readdirSync(join(RAIZ, "docs", "provas"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .flatMap((pasta) =>
    readdirSync(join(RAIZ, "docs", "provas", pasta.name))
      .filter((f) => f.endsWith(".json"))
      .map((f) => `${pasta.name}/${f}`),
  );
const aLista = conferirALista(todasAsProvas);

console.log("══════════ LAB-91 · a varredura REGERADA ══════════");
for (const [prova, d] of Object.entries(desacordos)) {
  console.log(`  ${d.length === 0 ? "✓" : "✗"} ${prova} · ${d.length === 0 ? "bate regra por regra e achado por achado" : `${d.length} desacordo(s)`}`);
  for (const x of d) console.log(`      ${x.tipo} · ${x.oQue}`);
}
console.log(`\n  as espécies: ${AS_ESPECIES.filter((e) => e.especie === "funcao-da-arvore").length} função-da-árvore · ${AS_ESPECIES.filter((e) => e.especie === "fotografia").length} fotografia (nunca se regera, D182)`);
console.log(`  a lista fecha: faltando=${aLista.entradasSemArquivo.length} duplicadas=${aLista.duplicadas.length} regeradas-fora-da-especie=${aLista.regeradasSemEntrada.length}`);
console.log(`  provas no repositório: ${todasAsProvas.length}`);
console.log(`\n  o conjunto do interpolador: ${INTERPOLADORES_ACEITOS.join(" | ")} · fora: ${O_QUE_FICA_DE_FORA.map((f) => f.valor).join(", ")}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "a-varredura-regerada.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-91",
      oQue: "a varredura reexecutada e comparada com a prova commitada, regra por regra e achado por achado; as duas espécies de prova; e o conjunto fechado do interpolador",
      oQueIstoNaoMede:
        "não mede gleba, motor nem semente — mede provas, regras e um conjunto de valores, e está na lista de exceções do §7",
      quando: new Date().toISOString(),
      aPropostaExecutada: {
        origem: "LAB-60, aberta desde 07/10",
        oQueFaltava:
          "o D287 recontava o ESCOPO; o defeito do LAB-60 era em `totalPorRegra` (1 contra 10) — recontar o tamanho do universo não reconta o que a régua achou nele",
      },
      asVarredurasRegeradas: {
        "LAB-57/varredura-de-configuracao.json": {
          porRegraAgora: config.porRegra,
          achadosAgora: config.achados.length,
          desacordos: desacordos["LAB-57/varredura-de-configuracao.json"],
        },
        "LAB-52/varredura-de-chamadas.json": {
          porRegraAgora: chamadas.porRegra,
          achadosAgora: chamadas.achados.length,
          desacordos: desacordos["LAB-52/varredura-de-chamadas.json"],
        },
      },
      asDuasEspecies: AS_ESPECIES,
      aListaFecha: aLista,
      oConjuntoDoInterpolador: {
        aceitos: INTERPOLADORES_ACEITOS,
        foraComMotivo: O_QUE_FICA_DE_FORA,
        oQueOGenerateDeclara: O_QUE_O_GENERATE_DECLARA,
        emComum: O_QUE_O_GENERATE_DECLARA.filter((v) => (INTERPOLADORES_ACEITOS as readonly string[]).includes(v)),
        bilinearEApelido: false,
      },
      oDetalhe: {
        oAviso: "o Generate pediu: parem de ler `detalhe`, que é frase para a pessoa",
        medidoAqui: "nenhum lugar extrai número de `detalhe`; `ferramentas/lab48.ts:210` o COPIA para uma prova, e copiar não é extrair",
        viraProposta: false,
      },
      conferidoAqui: "verde na mão, não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-91/a-varredura-regerada.json`);
