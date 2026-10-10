/**
 * ════════════════════════════════════════════════════════════════════════════
 *  AS TRINTA E UMA, POR EXECUÇÃO. (item 017, LAB-84)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ```sh
 * bun run lab84
 * ```
 *
 * O item 017 proibiu a resposta barata, com todas as letras:
 *
 * > *"A medição é por EXECUÇÃO, não por leitura. Rodar a lista **sem os clones** e ver quem
 * > reprova é a resposta; ler o `import` é a hipótese."*
 *
 * Então esta ferramenta **copia o repositório** para um lugar onde os três clones irmãos não
 * existem — que é exatamente o que o CI vê, porque lá eles são clonados ao lado e aqui não são
 * clonados de jeito nenhum — e roda **cada arquivo da lista do trabalho**, um por um, guardando
 * o código de saída, os que passam e os que reprovam.
 *
 * **Por que a cópia, e não mover os clones:** mover ou renomear o clone do vizinho seria escrever
 * no vizinho, e a §4 não deixa. A cópia toca apenas o diretório de rascunho desta sessão.
 *
 * *E o número por arquivo é o que decide:* o total não separa *"um arquivo inteiro depende"* de
 * *"quatro travas de catorze dependem"*, e os dois consertos são diferentes.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { TRABALHO_SEM_CLONES, arquivosDoTrabalho } from "../src/nome-do-trabalho.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const WORKFLOW = join(RAIZ, ".github", "workflows", "verde.yml");
const PROVA = join(RAIZ, "docs", "provas", "LAB-84");

const VIZINHOS = ["motor-testfit", "urban-create-hub-41d93a4d", "urban-scout-tool"] as const;

const lista = arquivosDoTrabalho(readFileSync(WORKFLOW, "utf8"), TRABALHO_SEM_CLONES);
if (lista.length === 0) throw new Error("não achei a lista de arquivos do trabalho no workflow");
console.log(`  o trabalho "${TRABALHO_SEM_CLONES}"`);
console.log(`  lista ${lista.length} arquivos de trava\n`);

// ── A cópia SEM clones, que é o que o CI vê ────────────────────────────────
const base = process.env["TMPDIR"] ?? "/tmp";
const area = join(base, `lab84-sem-clones-${process.pid}`);
rmSync(area, { recursive: true, force: true });
mkdirSync(area, { recursive: true });
const copia = join(area, "archilly-lab");
cpSync(RAIZ, copia, { recursive: true });

// A precondição da medição: se um clone aparecer ao lado da cópia, a medição não mede nada.
for (const v of VIZINHOS) {
  if (existsSync(join(area, v))) {
    throw new Error(`o clone ${v} existe ao lado da cópia — a medição não estaria sem clones`);
  }
}
console.log("  cópia sem os três clones irmãos: pronta");
console.log(`  ${VIZINHOS.map((v) => `${v}: ausente`).join(" · ")}\n`);

const ESTEIRA = join(copia, "external-engines", "esteira");

interface MedidaDoArquivo {
  arquivo: string;
  saida: number;
  passam: number | null;
  /**
   * Quantas reprovaram — e **`null` quando o `bun` não imprimiu a linha**, nunca zero.
   *
   * A primeira versão escrevia `?? 0` aqui, e a varredura de chamadas desta casa acusou, com
   * razão: *"`?? 0` sobre o resultado de uma CHAMADA: a falha vira um número que parece certo"*.
   * Num arquivo que estourou antes de rodar trava nenhuma, `0 reprovam` com `exit 1` é uma
   * contradição publicada. **Zero é uma medição; `null` é "não medido"** (D23) — e foi a régua
   * da casa que pegou isto no meu próprio instrumento de medir.
   */
  reprovam: number | null;
  /** O nome de cada trava que reprovou sem os clones. */
  asQueReprovam: string[];
}

function medir(arquivo: string): MedidaDoArquivo {
  let texto: string;
  let saida = 0;
  try {
    texto = execFileSync("bun", ["test", arquivo], {
      cwd: ESTEIRA,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    saida = err.status ?? 1;
    texto = `${err.stdout ?? ""}${err.stderr ?? ""}`;
  }
  const n = (re: RegExp) => {
    const m = [...texto.matchAll(re)].at(-1);
    return m === undefined ? null : Number(m[1]);
  };
  return {
    arquivo,
    saida,
    passam: n(/^\s*(\d+) pass/gm),
    reprovam: n(/^\s*(\d+) fail/gm),
    asQueReprovam: [...texto.matchAll(/^\(fail\) (.+?) \[[\d.]+m?s\]$/gm)].map((m) =>
      m[1]!.replace(/\s+/g, " ").trim(),
    ),
  };
}

const medidas = lista.map((a) => {
  const m = medir(a);
  const marca = m.saida === 0 ? "   " : " ✗ ";
  // `?` e não `0` nas duas colunas: a linha que o `bun` não imprimiu não se preenche com zero.
  const num = (v: number | null) => String(v ?? "?").padStart(3);
  console.log(
    `${marca}${m.arquivo.replace("tests/", "").padEnd(38)} ` +
      `passam ${num(m.passam)} · reprovam ${num(m.reprovam)} · exit ${m.saida}`,
  );
  return m;
});

const reprovam = medidas.filter((m) => m.saida !== 0);
rmSync(area, { recursive: true, force: true });

console.log(`\n  ${medidas.length - reprovam.length} de ${medidas.length} passam SEM os clones`);
for (const m of reprovam) {
  const total = m.passam === null || m.reprovam === null ? "?" : m.passam + m.reprovam;
  console.log(`  ✗ ${m.arquivo}: ${m.reprovam ?? "?"} de ${total} travas`);
  for (const t of m.asQueReprovam) console.log(`      · ${t}`);
}

mkdirSync(PROVA, { recursive: true });
const prova = {
  prompt: "LAB-84",
  oQue:
    `os ${lista.length} arquivos do trabalho de CI "${TRABALHO_SEM_CLONES}" rodados POR ` +
    "EXECUÇÃO numa cópia do repositório sem os três clones irmãos, arquivo por arquivo — a " +
    "medição que o D279 declarou não ter feito e sem a qual não se escolhe entre os dois consertos",
  oQueIstoNaoMede:
    "não mede gleba e não roda motor: o objeto é o conjunto de ARQUIVOS DE TRAVA e o que cada " +
    "um precisa para rodar. Por isso está na lista declarada de exceções do §7",
  quando: new Date().toISOString(),
  oChao: { bun: Bun.version, plataforma: process.platform },
  comoFoiMedido:
    "cópia do repositório num diretório onde os três clones irmãos NÃO existem — conferido " +
    "antes de medir, e a ferramenta estoura se algum aparecer —, e `bun test <arquivo>` um a um, " +
    "guardando o código de saída. Nada foi movido nem renomeado no vizinho (§4)",
  porQueNaoPorLeitura:
    "o item 017 proibiu: rodar a lista sem os clones é a RESPOSTA, ler o `import` é a HIPÓTESE. " +
    "E a diferença apareceu no número: o D279 disse DUAS travas, lidas do fonte; executadas são " +
    "QUATRO, e três delas são anteriores à minha rodada",
  oTrabalho: TRABALHO_SEM_CLONES,
  quantosArquivos: medidas.length,
  quantosPassamSemClone: medidas.length - reprovam.length,
  asTrintaEUma: medidas,
  oQueIssoDecide:
    reprovam.length === 0
      ? "a afirmação do nome do trabalho é VERDADEIRA: todos os arquivos da lista passam sem os clones"
      : `a afirmação é FALSA por ${reprovam.length} arquivo(s): ${reprovam.map((m) => m.arquivo).join(", ")}`,
  conferidoAqui: "sim, na máquina da sessão — não no GitHub (§7)",
};
writeFileSync(join(PROVA, "as-trinta-por-execucao.json"), `${JSON.stringify(prova, null, 2)}\n`);
console.log(`\nprova: docs/provas/LAB-84/as-trinta-por-execucao.json`);
