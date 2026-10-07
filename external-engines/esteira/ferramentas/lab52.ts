/**
 * LAB-52 · As duas varreduras da Central, rodadas — e o escopo como número.
 *
 * Uso: `bun run lab52`
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { NOMES_DE_IDENTIFICADOR_DE_CONTA, REGRAS_DE_CHAMADA, varrerUmArquivo, type AchadoDeChamada } from "../src/varredura-de-chamadas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-52");

const arquivos = execFileSync("git", ["-C", RAIZ, "ls-files", "--cached", "--others", "--exclude-standard", "-z", "*.ts"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
})
  .split("\0")
  .filter((f) => f.length > 0 && !f.includes("node_modules/") && !f.endsWith(".d.ts"));

const achados: AchadoDeChamada[] = [];
let linhas = 0;
let bytes = 0;
let parametros = 0;
let campos = 0;

for (const rel of arquivos) {
  const bruto = readFileSync(join(RAIZ, rel), "utf8");
  linhas += bruto.split("\n").length;
  bytes += Buffer.byteLength(bruto);
  const r = varrerUmArquivo(bruto, rel);
  achados.push(...r.achados);
  parametros += r.parametros;
  campos += r.campos;
}

const porRegra: Record<string, number> = {};
for (const r of REGRAS_DE_CHAMADA) porRegra[r.nome] = achados.filter((a) => a.regra === r.nome).length;

console.log("══════════ LAB-52 · as duas varreduras da Central ══════════");
console.log(`  escopo: ${arquivos.length} arquivos .ts · ${linhas.toLocaleString("pt-BR")} linhas · ${bytes.toLocaleString("pt-BR")} bytes`);
console.log(`          ${REGRAS_DE_CHAMADA.length} regras de texto · ${parametros.toLocaleString("pt-BR")} parâmetros e ${campos.toLocaleString("pt-BR")} campos de objeto examinados`);
console.log("");
for (const r of REGRAS_DE_CHAMADA) {
  const n = porRegra[r.nome]!;
  console.log(`  ${n === 0 ? "✓" : "✗"} ${String(n).padStart(3)} · ${r.nome}`);
}
if (achados.length) {
  console.log("\n  os achados, um a um:");
  for (const a of achados) console.log(`      ${a.arquivo}:${a.linha} · ${a.regra} · ${a.trecho}`);
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "varredura-de-chamadas.json"),
  JSON.stringify(
    {
      prompt: "LAB-52",
      oQueIstoMede: "o código TypeScript deste repositório atrás das duas classes que a Central nomeou — não mede terreno",
      quando: new Date().toISOString(),
      aOrigem: "achado da Central: (a) erro de chamada não conferido que degrada para número que PARECE certo; (b) função que recebe identificador de conta como argumento",
      doisMotores: {
        porque: "a metade mais perigosa de (a) — promessa sem `await` — NÃO se mede com regex: precisa de tipo",
        oLintComTipo: {
          regraQueImporta: "@typescript-eslint/no-floating-promises",
          estavaLigada: false,
          porque: "os dois `eslint.config.js` traziam `projectService: false`, e sem serviço de projeto TODA regra que precisa de tipo fica muda",
          medidoLigando: { achadosDaRegra: 0, totalDeProblemasTipados: 646 },
          provadoPorSabotagem: "promessa sem await plantada num arquivo temporário → a regra ACUSOU; então o zero sobre a árvore é zero MEDIDO, não silêncio",
        },
        estaVarredura: { regras: REGRAS_DE_CHAMADA.length, oQueAlcanca: "o que regex vê honestamente: `catch` que engole, `?? 0` sobre chamada, `Number(...)` sem conferência, e o nome do parâmetro" },
      },
      escopo: { arquivos: arquivos.length, linhas, bytes, regras: REGRAS_DE_CHAMADA.length, parametrosExaminados: parametros, camposExaminados: campos },
      regras: REGRAS_DE_CHAMADA.map((r) => ({ nome: r.nome, familia: r.familia, oQue: r.oQue, oQueNaoPega: r.oQueNaoPega })),
      nomesDeIdentificadorProcurados: [...NOMES_DE_IDENTIFICADOR_DE_CONTA],
      porRegra,
      achados,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-52/varredura-de-chamadas.json`);
