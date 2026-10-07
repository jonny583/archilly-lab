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

import { REGRAS_DE_CONFIGURACAO, varrerConfiguracao } from "../src/varredura-de-configuracao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-57");

/** Todo arquivo que o git carrega. É daqui que o escopo começa, e não de uma lista minha. */
const doGit = (...args: string[]) =>
  execFileSync("git", ["-C", RAIZ, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\0")
    .filter((f) => f.length > 0);

const carregados = doGit("ls-files", "-z");

/** O que CONTA como configuração, por nome de arquivo. */
const EH_CONFIGURACAO = (f: string) =>
  /(^|\/)(tsconfig[^/]*\.json|[^/]*eslint[^/]*\.(js|cjs|mjs)|package\.json|bunfig\.toml|\.npmrc|\.nvmrc|\.gitignore|\.gitattributes|[^/]*\.ya?ml|\.editorconfig|[^/]*prettier[^/]*|Cargo\.toml|rust-toolchain\.toml|[^/]*\.lock|conferir\.sh)$/.test(
    f,
  );

/**
 * O que fica FORA da varredura, e **por quê**. Conjunto fechado: a trava reprova arquivo
 * de configuração que não esteja nem varrido nem nomeado aqui.
 */
const FORA: { casa: (f: string) => boolean; porque: string }[] = [
  {
    casa: (f) => f.startsWith("external-engines/symbios/upstream/"),
    porque:
      "é UPSTREAM e é INTOCÁVEL (§3): cópia exata do motor original, que não se edita. A configuração dele governa o projeto dele, não o verde deste repositório",
  },
  {
    casa: (f) => /(^|\/)[^/]*\.lock$/.test(f),
    porque:
      "lockfile não liga nem desliga conferência: ele PRENDE versão. Afrouxar versão é outra classe de risco, e não é a deste prompt",
  },
  {
    casa: (f) => /(^|\/)(Cargo\.toml|rust-toolchain\.toml)$/.test(f),
    porque:
      "governa a compilação do .wasm em Rust, que o verde cobre pela PRECONDIÇÃO (o .wasm existe ou o script reprova com a receita, D124) — e não por conferência de tipo",
  },
];

interface Linha {
  arquivo: string;
  varrido: boolean;
  porqueFora?: string;
  bytes?: number;
  linhas?: number;
  regrasQueOlharam?: string[];
}

/**
 * O lint do pacote REPROVA aviso? É o par do `regra-em-warn`, e é medido.
 *
 * Lido no `package.json` do pacote a que o arquivo pertence: com `--max-warnings 0`, uma
 * regra em `"warn"` é capaz de derrubar o passo; sem ele, não é.
 */
const lintReprovaAviso = (arquivo: string): boolean => {
  const pacote = arquivo.includes("/esteira/")
    ? "external-engines/esteira"
    : arquivo.includes("/testfit/")
      ? "external-engines/testfit"
      : null;
  if (!pacote) return false;
  const pj = JSON.parse(readFileSync(join(RAIZ, pacote, "package.json"), "utf8")) as {
    scripts?: Record<string, string>;
  };
  return /--max-warnings\s+0/.test(pj.scripts?.["lint"] ?? "");
};

const porArquivo: Linha[] = [];
const achados: ReturnType<typeof varrerConfiguracao>["achados"] = [];
let linhasLidas = 0;

for (const f of carregados.filter(EH_CONFIGURACAO).sort()) {
  const fora = FORA.find((x) => x.casa(f));
  if (fora) {
    porArquivo.push({ arquivo: f, varrido: false, porqueFora: fora.porque });
    continue;
  }
  const texto = readFileSync(join(RAIZ, f), "utf8");
  const r = varrerConfiguracao(texto, f, { lintReprovaAviso: lintReprovaAviso(f) });
  achados.push(...r.achados);
  linhasLidas += texto.split("\n").length;
  porArquivo.push({
    arquivo: f,
    varrido: true,
    bytes: texto.length,
    linhas: texto.split("\n").length,
    regrasQueOlharam: r.regrasQueOlharam,
  });
}

// ── E os arquivos de CÓDIGO, para as duas regras que vivem neles ────────────
//
// `teste-desligado` e `conferencia-desligada-por-arquivo` não moram em configuração: o
// `.only` e o `@ts-ignore` são desligadores que viajam no código. Ficar só na configuração
// responderia metade da pergunta.
//
// **E sem contar duas vezes:** os dois `eslint.config.js` são configuração E são `.js`.
// Na primeira versão desta ferramenta eles entraram nas duas passagens e o
// `regra-em-warn` saiu **4** onde eram **2**. *O volume era da minha régua, não da coisa*
// — a terceira vez dessa forma em dois prompts (D179, D193).
const jaVarridos = new Set(porArquivo.filter((l) => l.varrido).map((l) => l.arquivo));
const codigo = carregados.filter(
  (f) => /\.(ts|js)$/.test(f) && !f.includes("node_modules/") && !jaVarridos.has(f),
);
let linhasDeCodigo = 0;
for (const f of codigo) {
  const texto = readFileSync(join(RAIZ, f), "utf8");
  linhasDeCodigo += texto.split("\n").length;
  achados.push(...varrerConfiguracao(texto, f).achados);
}

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
  "conferencia-desligada-por-arquivo|external-engines/esteira/src/inventario-das-idas.ts":
    "`eslint-disable-next-line @typescript-eslint/no-unused-vars` sobre o ajudante `divida()`, que fica SEM USO de propósito: a categoria vazia é a prova de que ele era confissão com prazo. O motivo está escrito nas seis linhas acima dele, e é o único desligador por arquivo do repositório",
};

const porRegra: Record<string, number> = {};
for (const a of achados) porRegra[a.regra] = (porRegra[a.regra] ?? 0) + 1;

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
        arquivosQueOGitCarrega: carregados.length,
        configuracoesEncontradas: porArquivo.length,
        configuracoesVarridas: varridos,
        configuracoesForaDoEscopoNomeadas: foraDoEscopo,
        linhasDeConfiguracaoLidas: linhasLidas,
        arquivosDeCodigoVarridos: codigo.length,
        linhasDeCodigoLidas: linhasDeCodigo,
        regras: REGRAS_DE_CONFIGURACAO.length,
        porque:
          "o escopo começa no `git ls-files`, não numa lista minha — e o que ficou fora sai NOMEADO com o motivo (D164, a lição do LAB-47)",
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
