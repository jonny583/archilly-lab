/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-57 · O resto da varredura do D178 — e o ESCOPO sai como número.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A pergunta do chat: *existe OUTRA configuração neste repositório que desliga
 * conferência sem avisar?*
 *
 * O LAB-47 ensinou que **numa varredura o que importa é o escopo, não a existência**: um
 * zero de régua parada é indistinguível de um zero de árvore limpa (D164). Então esta
 * ferramenta começa por **contar**: quantos arquivos de configuração o git carrega,
 * quantos entraram na varredura, e **o que ficou fora sai nomeado com o motivo**.
 *
 * Uso: `bun run lab57`
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { DA_OUTRA_MAO, FONTES_DA_PROPRIA_REGUA, medirOEscopo } from "../src/escopo-da-varredura.ts";
import { REGRAS_DE_CONFIGURACAO } from "../src/varredura-de-configuracao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-57");

/** Todo arquivo que o git carrega. É daqui que o escopo começa, e não de uma lista minha. */
const doGit = (...args: string[]) =>
  execFileSync("git", ["-C", RAIZ, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\0")
    .filter((f) => f.length > 0);

const carregados = doGit("ls-files", "-z");

// ── A MEDIÇÃO MORA NO `src/escopo-da-varredura.ts` (LAB-86, D287) ─────────
//
// Ela estava escrita AQUI, e a trava conferia a prova com **limiar** (`> 10000` linhas).
// Resultado medido ao abrir o item 019: a prova commitada dizia 128 arquivos e 36 157
// linhas, e a mesma árvore dizia **187** e **50 714** — velha por semanas, com a trava
// verde. *Régua que confere uma prova com `maior que` aceita qualquer prova velha que já
// fosse grande o bastante quando nasceu.*
//
// Agora a ferramenta e a trava chamam **a mesma função**: a trava reconta e compara número
// por número, então a prova não pode mais ficar velha em silêncio. Escrever a recontagem
// dentro da trava criaria duas implementações da mesma pergunta — *e duas listas para a
// mesma pergunta divergem* (D231).
const medicao = medirOEscopo(carregados, (rel) => readFileSync(join(RAIZ, rel), "utf8"));
const { porArquivo, achados, porRegra } = medicao;
const linhasLidas = medicao.numeros.linhasDeConfiguracaoLidas;
const linhasDeCodigo = medicao.numeros.linhasDeCodigoLidas;
const codigo = { length: medicao.numeros.arquivosDeCodigoVarridos };

/** Arquivos IGNORADOS que existem em disco — eles não são varridos por ninguém. */
const ignorados = execFileSync("git", ["-C", RAIZ, "status", "--ignored", "--porcelain"], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
})
  .split("\n")
  .filter((l) => l.startsWith("!! "))
  .map((l) => l.slice(3))
  .filter((f) => !f.includes("node_modules"));

/**
 * Os achados que SOBRAM, cada um com o motivo. **Conjunto fechado** — a trava reprova um
 * quarto e reprova também um destes que desaparecer (D104: lista que não se revalida
 * envelhece igual a comentário).
 */
const DECLARADOS: Record<string, string> = {
  "desligador-de-conferencia|external-engines/esteira/tsconfig.json":
    "`skipLibCheck: true`, agora DECLARADO no próprio arquivo: medido com `false` dá ZERO erros, e fica ligado porque sem ele uma atualização de `@types/*` derruba o verde por erro dentro de dependência, que ninguém aqui conserta",
  "desligador-de-conferencia|external-engines/testfit/tsconfig.json":
    "o mesmo `skipLibCheck: true`, com a mesma medição (zero erros com `false`) e a mesma declaração escrita no arquivo — os dois pacotes andam juntos de propósito (D86: alargar numa terra e não na outra foi defeito três vezes)",
  "regra-em-off|external-engines/esteira/eslint.config.js":
    "`\"no-undef\": \"off\"`, e o motivo está escrito no próprio arquivo desde o LAB-60: em TypeScript o compilador já acusa nome não definido, e o `no-undef` do eslint não conhece os tipos — ele dá falso positivo em `globalThis`, em tipo só-de-tipo e em declaração de ambiente. É o que o próprio `typescript-eslint` recomenda desligar",
  "regra-em-off|external-engines/testfit/eslint.config.js":
    "o mesmo `\"no-undef\": \"off\"`, com o mesmo motivo escrito no arquivo — os dois pacotes andam juntos de propósito (D86)",
  "conferencia-desligada-por-arquivo|external-engines/esteira/src/inventario-das-idas.ts":
    "`eslint-disable-next-line @typescript-eslint/no-unused-vars` sobre o ajudante `divida()`, que fica SEM USO de propósito: a categoria vazia é a prova de que ele era confissão com prazo. O motivo está escrito nas seis linhas acima dele, e é o único desligador por arquivo do repositório",
};

const varridos = porArquivo.filter((l) => l.varrido).length;
const foraDoEscopo = porArquivo.filter((l) => !l.varrido).length;

console.log("══════════ LAB-57 · a varredura das configurações ══════════");
console.log(`  configuração que o git carrega: ${porArquivo.length}`);
console.log(`  varridas: ${varridos} · fora do escopo, nomeadas: ${foraDoEscopo}`);
console.log(`  linhas de configuração lidas: ${linhasLidas} · arquivos de código: ${codigo.length} (${linhasDeCodigo} linhas)`);
console.log(`  regras: ${REGRAS_DE_CONFIGURACAO.length}`);
console.log("");
for (const r of REGRAS_DE_CONFIGURACAO) {
  console.log(`  ${r.nome.padEnd(36)} ${String(porRegra[r.nome] ?? 0).padStart(3)}  (${r.forma})`);
}
console.log("");
for (const a of achados) console.log(`  → ${a.arquivo}:${a.linha}  ${a.regra}  ${a.trecho.replace(/\s+/g, " ")}`);
console.log("");
console.log(`  arquivos IGNORADOS presentes em disco (ninguém varre): ${ignorados.length}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "varredura-de-configuracao.json"),
  JSON.stringify(
    {
      prompt: "LAB-57",
      oQueIstoMede:
        "quais configurações deste repositório desligam conferência — nas três formas: a regra DESLIGADA, " +
        "a regra LIGADA QUE NÃO PODE REPROVAR, e o desligador SEM MOTIVO ESCRITO",
      aPergunta: "do chat: existe OUTRA configuração neste repositório que desliga conferência sem avisar?",
      quando: new Date().toISOString(),
      escopo: {
        // **Os números saem da MEDIÇÃO, não de contas repetidas aqui** — é esta chave que a
        // trava reconta e compara, uma a uma (D287).
        ...medicao.numeros,
        porque:
          "o escopo começa no `git ls-files`, não numa lista minha — e o que ficou fora sai NOMEADO com o motivo (D164, a lição do LAB-47)",
        // O que sai da CONTA do universo (não da varredura), com o motivo — LAB-107, D334.
        foraDaContaDoUniverso: DA_OUTRA_MAO.map((x) => x.porque),
      },
      regras: REGRAS_DE_CONFIGURACAO.map((r) => ({
        nome: r.nome,
        forma: r.forma,
        oQue: r.oQue,
        oQueNaoPega: r.oQueNaoPega,
        arquivos: r.arquivos,
        limpeza: r.limpeza,
        porqueEssaLimpeza: r.porqueEssaLimpeza,
        achados: porRegra[r.nome] ?? 0,
      })),
      porArquivo,
      oFonteDaPropriaReguaForaDoEscopo: FONTES_DA_PROPRIA_REGUA,
      achados,
      arquivosIgnoradosPresentesEmDisco: ignorados,
      oQueOsIgnORADOSSignificam:
        "são artefato de build (`target/` do Rust e o `.wasm` do navegador), e o `.gitignore` do " +
        "UPSTREAM ignora `/.claude` e `.mcp.json` — dois nomes que costumam carregar credencial. " +
        "Medido: nenhum dos dois existe em disco. A varredura de segredos lê `git ls-files " +
        "--exclude-standard`, então se um dia existirem ali ela NÃO os verá, e upstream é intocável (§3)",
      totalPorRegra: porRegra,
      declarados: DECLARADOS,
      naoDeclarados: achados
        .filter((a) => !(`${a.regra}|${a.arquivo}` in DECLARADOS))
        .map((a) => `${a.regra}|${a.arquivo}`),
      oQueFoiCONSERTADONesteProMPT: [
        "`\"lint\": \"eslint .\"` → `eslint . --max-warnings 0` nos DOIS pacotes: sem a bandeira, toda regra em `\"warn\"` era incapaz de reprovar o passo. Medido antes: ZERO avisos, então nada estava escondido — mas o mecanismo estava vivo, e é a segunda forma do D178",
        "o `skipLibCheck: true` dos dois `tsconfig.json` ganhou MOTIVO ESCRITO, com a medição (zero erros com `false`) e a condição de revisitar",
        "o comentário que dizia `20 erros` foi remedido: são **1 604**, com **1 600** no repositório do Generate e **QUATRO AQUI** — e a frase `o código deste adaptador passou com os dois flags ligados` estava FALSA por quatro. Riscada, não apagada (D161)",
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-57/varredura-de-configuracao.json`);
