#!/usr/bin/env bun
/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-95 · item 028 — a conta do enxugar: nenhuma regra saiu, nenhuma linha se perdeu.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O item 028 mandou **enxugar o `CLAUDE.md`** e pediu a conferência que separa *encurtar* de
 * *apagar*: *"confira por contagem que nada se perdeu… escreva a conta no relatório (regras antes ×
 * depois; caracteres antes × depois nos dois arquivos)"*.
 *
 * Esta ferramenta faz as três contas e publica:
 *
 * 1. **caracteres**, antes e depois, nos dois arquivos;
 * 2. **regras**, pelo inventário declarado — cada uma conferida **no `CLAUDE.md` de hoje E na
 *    história**, que é o texto antigo movido literal;
 * 3. **linhas perdidas**: as do texto antigo que não estão em nenhum dos dois. *Esperado: zero —
 *    e qualquer linha aqui é uma linha apagada, que é a única forma de errar este item.*
 *
 * **O "antes" vem do GIT**, do commit anterior ao enxugar, e a profundidade é conferida: num clone
 * raso o objeto pode não existir, e aí a ferramenta **recusa** em vez de comparar com nada (D295).
 *
 * Uso: `bun run lab95`
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  AS_REGRAS,
  aContaDasRegras,
  conferirOInventario,
  linhasQueImportam,
  oQueSePerdeu,
} from "../src/enxugar-o-claude.ts";
import { ARQUIVO_DA_HISTORIA, SECAO_DO_PONTO_CEGO, aSecaoDaHistoria } from "../src/historia-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-95");

/** O commit em que o `CLAUDE.md` ainda era o diário — o "antes" desta conta. */
const O_COMMIT_DE_ANTES = "490c102";

const git = (...args: string[]) =>
  execFileSync("git", args, { cwd: RAIZ, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

if (git("rev-parse", "--is-shallow-repository").trim() === "true") {
  console.error(
    "  clone RASO: o `git show` do commit de antes pode não existir aqui, e comparar com nada " +
      "daria 'zero linhas perdidas' sem ter lido o antes. Rode num clone com história (D295).",
  );
  process.exit(1);
}

const antigo = git("show", `${O_COMMIT_DE_ANTES}:CLAUDE.md`);
const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
const historia = readFileSync(join(RAIZ, ARQUIVO_DA_HISTORIA), "utf8");

const sha = (t: string) => createHash("sha256").update(t).digest("hex");

const problemas = conferirOInventario(claudeMd, historia);
const perdidas = oQueSePerdeu(antigo, claudeMd, historia);
const conta = aContaDasRegras();

const META = 15_000;
const caracteres = {
  claudeMd: { antes: antigo.length, depois: claudeMd.length },
  historia: { antes: 0, depois: historia.length },
  cortePct: Number((100 * (1 - claudeMd.length / antigo.length)).toFixed(1)),
  meta: META,
  chegouNaMeta: claudeMd.length <= META,
  quantoFalta: Math.max(0, claudeMd.length - META),
};

/**
 * O CHÃO, medido por pedaço — porque *"não chegou"* sem o número é adjetivo.
 *
 * O que não se corta nem se edita: as duas citações que a família mandou gravar **literais**, o
 * molde do recado, o comando do verde e a lista de onde mora cada coisa.
 */
function pedaco(de: string, ate: string): number {
  const i = claudeMd.indexOf(de);
  const j = claudeMd.indexOf(ate, i);
  return i < 0 || j < 0 ? 0 : j + ate.length - i;
}
const oChao = {
  "citação literal da Central": pedaco("> Da Central, regra nova", "regras 48, 49 e 50, DEC-159."),
  "citação literal do Jonny": pedaco('> *"Eu prefiro uma API', 'arranjar cliente."*'),
  "molde do recado": pedaco("```\n=== RECADO", "--- O QUE VAI JUNTO ---\n<lista"),
  "comando do verde": pedaco("```sh", "conferir.sh"),
  "onde mora cada coisa": pedaco("**Onde mora cada coisa:**", "em JSON."),
};
const somaDoChao = Object.values(oChao).reduce((a, b) => a + b, 0);

console.log("══════════ LAB-95 · a conta do enxugar ══════════\n");
console.log(`  CLAUDE.md:  ${antigo.length} → ${claudeMd.length} caracteres (−${caracteres.cortePct} %)`);
console.log(`  história:   0 → ${historia.length} caracteres (${ARQUIVO_DA_HISTORIA})`);
console.log(`  meta ${META}: ${caracteres.chegouNaMeta ? "ALCANÇADA" : `NÃO — faltam ${caracteres.quantoFalta}`}`);
console.log(`\n  regras no inventário: ${conta.total}`);
for (const [s, n] of Object.entries(conta.porSeccao)) console.log(`    §${s.padEnd(4)} ${n}`);
console.log(`\n  problemas do inventário: ${problemas.length}`);
for (const p of problemas) console.log(`    ${p.tipo} · ${p.marca}`);
console.log(`  linhas do texto antigo que se perderam: ${perdidas.length}`);
for (const l of perdidas.slice(0, 10)) console.log(`    PERDIDA: ${l.slice(0, 110)}`);
console.log(`\n  o chão (não se corta nem se edita): ${somaDoChao} caracteres`);
for (const [k, v] of Object.entries(oChao)) console.log(`    ${String(v).padStart(5)}  ${k}`);

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "nada-se-perdeu.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-95",
      aPergunta:
        "item 028 da caixa de entrada: enxugar o `CLAUDE.md` movendo a história para " +
        `${ARQUIVO_DA_HISTORIA}, sem perder regra nenhuma — e CONFERIR POR CONTAGEM que nada se perdeu`,
      oQueIstoMede:
        "as três contas que o item pediu: caracteres antes × depois nos dois arquivos, regras " +
        "antes × depois pelo inventário declarado (cada marca conferida NO CLAUDE.MD DE HOJE E NA " +
        "HISTÓRIA, que é o texto antigo movido literal) e as linhas do texto antigo que não estão " +
        "em nenhum dos dois",
      quando: new Date().toISOString(),
      oChaoDaMedicao: {
        oCommitDeAntes: O_COMMIT_DE_ANTES,
        sha256DoAntes: sha(antigo),
        sha256DoClaudeDeHoje: sha(claudeMd),
        sha256DaHistoria: sha(historia),
        cloneRaso: false,
        bun: Bun.version,
      },
      caracteres,
      linhasQueImportam: {
        antes: linhasQueImportam(antigo).length,
        claudeMdDepois: linhasQueImportam(claudeMd).length,
        historia: linhasQueImportam(historia).length,
      },
      regras: { ...conta, problemas },
      aListaDeRegras: AS_REGRAS,
      linhasPerdidas: perdidas,
      oChaoPorPedaco: { ...oChao, soma: somaDoChao },
      aGuardaQueMudouDeAlvo: {
        quais: [
          "tests/aritmetica-da-regra.test.ts — a tabela do ponto cego é história e foi para " +
            `${ARQUIVO_DA_HISTORIA} ${SECAO_DO_PONTO_CEGO}`,
          "ferramentas/lab63.ts — a prova dessa aritmética, pela MESMA função (src/historia-das-regras.ts)",
          "tests/limites-com-sujeito.test.ts — a narrativa que ela usava como objeto saiu, e a " +
            "sabotagem dela foi REFEITA: ela achava o fim da frase por um texto que o enxugar tirou",
          "tests/trava-de-estrutura.test.ts — lia a frase CRUA e o refluxo a quebrou: passou a " +
            "ler pelo normalizador desta casa",
        ],
        aSecaoAindaExiste: aSecaoDaHistoria(historia, SECAO_DO_PONTO_CEGO) !== null,
      },
      oQueIstoNaoAlcanca: [
        "não mede se a regra ficou CLARA — mede se ela ficou. Clareza é leitura de pessoa, e " +
          "quem decide é quem lê a página na próxima sessão",
        "a comparação de linhas é por TEXTO normalizado em espaço e ignora a caixa das letras nas " +
          "marcas: encurtar move a frase para o meio de outra, e exigir caixa ou quebra de linha " +
          "faria a conta reprovar por tipografia (D248)",
        "o inventário é uma LISTA ESCRITA À MÃO: ela cobre as regras que eu nomeei, e regra que " +
          "eu não inscrevi nela não é conferida por ela — é o mesmo buraco que toda lista declarada " +
          "desta casa tem, e ele fica dito",
      ],
      naoConsertaNada:
        "nada de comportamento mudou: nenhum código de produto, nenhuma tarefa agendada, nenhum " +
        "`vendor/`. O que mudou foi onde o texto mora — e quatro guardas mudaram de alvo, com a " +
        "sabotagem de uma delas refeita",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-95/nada-se-perdeu.json`);
if (problemas.length > 0 || perdidas.length > 0) process.exit(1);
