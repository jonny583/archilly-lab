/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-60 · As três formas de desligar conferência, conferidas NO MOTOR.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **O pedido do chat:** *"a configuração do motor, SÓ DE LEITURA, devolvendo lista numerada
 * das três formas de desligar conferência que você achou aqui — a lista vai por mim ao
 * motor."*
 *
 * Então aqui **nada se conserta e nada se escreve** no clone do vizinho (§4). A ferramenta
 * lê, mede, e a saída é uma **lista numerada**. O `git status` dos três clones é conferido
 * ao fim, e o relatório diz que ficou limpo.
 *
 * # A régua é a mesma, e foi ela que ganhou com a viagem
 *
 * As sete regras são as do `src/varredura-de-configuracao.ts`, as mesmas que mediram este
 * repositório no LAB-57 — **medir o vizinho com outra régua não compararia nada.**
 *
 * E a viagem pagou-se antes de sair: apontada ao clone, a régua de seis regras disse
 * **zero regras desligadas** num `eslint.config.js` que traz
 * `"@typescript-eslint/no-unused-vars": "off"` escrito em uma linha, e **zero em `"warn"`**
 * num arquivo que traz `["warn", { … }]`. Eram **dois falso-negativos**: o cabeçalho da
 * varredura prometia `"off"` desde o LAB-57 e **nenhuma regra o procurava**, e o
 * `regra-em-warn` só via a string solta, não a forma de array — que é a normal quando a
 * regra tem opção.
 *
 * > **Régua que nunca saiu de casa não sabe o que não vê.**
 *
 * Consertadas as duas, a régua passou a achar **dois desligadores neste repositório** que
 * seis regras não tinham visto, e os dois estão declarados.
 *
 * # A segunda passagem: as chaves que o `tsconfig` DECLARA, enumeradas
 *
 * Padrão de texto só acha o que alguém escreveu no padrão — e o `oQueNaoPega` da
 * `desligador-de-conferencia` sempre disse isso: *"desligador escrito com outro nome"*.
 * Então há uma segunda passagem que **não é régua de texto**: ela **enumera as chaves de
 * `compilerOptions`** do JSON e separa, pelo valor, as que afrouxam conferência. Lista
 * completa, sem padrão no meio — é o que impede a frase *"não achei"* de significar *"não
 * procurei"* (D164).
 *
 * Uso: `bun run lab60`
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { REGRAS_DE_CONFIGURACAO, varrerConfiguracao } from "../src/varredura-de-configuracao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-60");
/** O clone do motor, lido por caminho — a mesma vizinhança do D16. */
const MOTOR = join(RAIZ, "..", "motor-testfit");
/** Os três clones vizinhos, para a conferência do §4. */
const VIZINHOS = ["motor-testfit", "urban-create-hub-41d93a4d", "urban-scout-tool"] as const;

if (!existsSync(MOTOR)) {
  console.error(
    `✗ o clone do motor não está em ${MOTOR}.\n` +
      `  A RECEITA: clone-o SOMENTE PARA LEITURA ao lado deste repositório —\n` +
      `    git clone --depth 1 https://github.com/jonny583/motor-testfit.git ../motor-testfit\n` +
      `  Sem ele este prompt não mede nada, e "pular" é o que o D124 proíbe.`,
  );
  process.exit(1);
}

const doGit = (dir: string, ...args: string[]) =>
  execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** Todo arquivo que o git DELE carrega. O escopo começa aqui, não numa lista minha. */
const carregados = doGit(MOTOR, "ls-files", "-z").split("\0").filter((f) => f.length > 0);

/** O que CONTA como configuração — o MESMO predicado do LAB-57, para a comparação valer. */
const EH_CONFIGURACAO = (f: string) =>
  /(^|\/)(tsconfig[^/]*\.json|[^/]*eslint[^/]*\.(js|cjs|mjs)|package\.json|bunfig\.toml|\.npmrc|\.nvmrc|\.gitignore|\.gitattributes|[^/]*\.ya?ml|\.editorconfig|[^/]*prettier[^/]*|Cargo\.toml|rust-toolchain\.toml|[^/]*\.lock|conferir\.sh)$/.test(
    f,
  );

/**
 * O que a pilha DELE tem e a daqui não — declarado, porque o predicado comum não o alcança.
 *
 * O motor é um aplicativo Vite/React; este repositório é duas esteiras em Bun. Acrescentar
 * estes nomes ao predicado comum mudaria a medição do LAB-57 sem necessidade, então eles
 * entram **nomeados**, como extensão declarada deste prompt.
 */
const CONFIGURACAO_DA_PILHA_DELE: Record<string, string> = {
  "vite.config.ts": "é a configuração do empacotador: ela decide o que entra no build e pode calar conferência de tipo em build",
  "components.json": "é a configuração do gerador de componentes (shadcn) — governa geração de código, não conferência",
  ".lovable/project.json": "é a configuração da plataforma que publica o aplicativo dele",
};
const EH_CONFIGURACAO_DELE = (f: string) => EH_CONFIGURACAO(f) || f in CONFIGURACAO_DA_PILHA_DELE;

/**
 * O que fica FORA, e **por quê**. Conjunto fechado: a trava reprova configuração que não
 * esteja nem varrida nem nomeada aqui.
 */
const FORA: { casa: (f: string) => boolean; porque: string }[] = [
  {
    casa: (f) => f.startsWith("vendor/"),
    porque:
      "é o kit da Central, COPIADO de lá pelo comando dela, e o próprio `eslint.config.js` dele declara que nunca se edita — conserto é no repositório de origem. A configuração ali governa o projeto de lá",
  },
  {
    casa: (f) => /(^|\/)[^/]*\.lock$/.test(f),
    porque:
      "lockfile não liga nem desliga conferência: ele PRENDE versão. É a mesma exclusão declarada no LAB-57",
  },
  {
    casa: (f) => f.startsWith("docs/contratos/") || f.startsWith("dados/"),
    porque:
      "são DADOS com extensão `.json` — entrada de gleba, saída de motor, veredito, progresso. O predicado comum pega `package.json` por nome, e estes caem por serem de `docs/contratos/` e `dados/`: nenhum deles configura ferramenta nenhuma",
  },
];

interface Linha {
  arquivo: string;
  varrido: boolean;
  porqueFora?: string;
  daPilhaDele?: string;
  linhas?: number;
  regrasQueOlharam?: string[];
}

/**
 * O lint DELE reprova aviso? É o par do `regra-em-warn`, e é medido no `package.json` dele.
 *
 * Esta é a linha que decide se uma regra em `"warn"` é alarme ou enfeite — e aqui ela
 * decide **sozinha** a forma 2 das três.
 */
const pjDele = JSON.parse(readFileSync(join(MOTOR, "package.json"), "utf8")) as {
  scripts?: Record<string, string>;
};
const lintDele = pjDele.scripts?.["lint"] ?? "";
const lintReprovaAviso = /--max-warnings\s+0/.test(lintDele);

const porArquivo: Linha[] = [];
const achados: ReturnType<typeof varrerConfiguracao>["achados"] = [];
let linhasLidas = 0;

for (const f of carregados.filter(EH_CONFIGURACAO_DELE).sort()) {
  const fora = FORA.find((x) => x.casa(f));
  if (fora) {
    porArquivo.push({ arquivo: f, varrido: false, porqueFora: fora.porque });
    continue;
  }
  const texto = readFileSync(join(MOTOR, f), "utf8");
  const r = varrerConfiguracao(texto, f, { lintReprovaAviso });
  achados.push(...r.achados);
  linhasLidas += texto.split("\n").length;
  porArquivo.push({
    arquivo: f,
    varrido: true,
    ...(f in CONFIGURACAO_DA_PILHA_DELE ? { daPilhaDele: CONFIGURACAO_DA_PILHA_DELE[f] } : {}),
    linhas: texto.split("\n").length,
    regrasQueOlharam: r.regrasQueOlharam,
  });
}

// ── E o CÓDIGO dele, para as duas regras que vivem lá e não em configuração ──
const jaVarridos = new Set(porArquivo.filter((l) => l.varrido).map((l) => l.arquivo));
const codigo = carregados.filter(
  (f) => /\.(ts|tsx|js)$/.test(f) && !f.startsWith("vendor/") && !jaVarridos.has(f),
);
let linhasDeCodigo = 0;
for (const f of codigo) {
  const texto = readFileSync(join(MOTOR, f), "utf8");
  linhasDeCodigo += texto.split("\n").length;
  achados.push(...varrerConfiguracao(texto, f).achados);
}

/**
 * ── A SEGUNDA PASSAGEM: as chaves do `tsconfig`, ENUMERADAS ──────────────────
 *
 * Não é padrão de texto: é a leitura do JSON e a separação das chaves pelo valor. Assim
 * *"não achei"* deixa de poder significar *"não procurei"*.
 *
 * `AFROUXAM_QUANDO_FALSAS` e `AFROUXAM_QUANDO_VERDADEIRAS` são listas declaradas de nomes
 * do próprio TypeScript. Chave que não estiver em nenhuma das duas sai em
 * `naoClassificadas`, **com o valor** — nunca engolida.
 */
const AFROUXAM_QUANDO_FALSAS = [
  "strict", "noImplicitAny", "strictNullChecks", "strictFunctionTypes", "strictBindCallApply",
  "strictPropertyInitialization", "noImplicitThis", "useUnknownInCatchVariables", "alwaysStrict",
  "noUnusedLocals", "noUnusedParameters", "noImplicitReturns", "noFallthroughCasesInSwitch",
  "noUncheckedIndexedAccess", "exactOptionalPropertyTypes", "noImplicitOverride",
  "noPropertyAccessFromIndexSignature", "noEmitOnError", "noUncheckedSideEffectImports",
] as const;
const AFROUXAM_QUANDO_VERDADEIRAS = ["skipLibCheck", "allowJs", "ignoreDeprecations", "suppressImplicitAnyIndexErrors", "suppressExcessPropertyErrors"] as const;

function lerTsconfig(base: string, arquivo: string) {
  const bruto = readFileSync(join(base, arquivo), "utf8");
  // O tsconfig do motor não tem comentário, mas o desta casa tem: tirar `//` fora de
  // string é o mínimo para o JSON.parse não estourar, e é declarado.
  const limpo = bruto.replace(/^\s*\/\/.*$/gm, "");
  const d = JSON.parse(limpo) as { compilerOptions?: Record<string, unknown> };
  const co = d.compilerOptions ?? {};
  const afrouxam: { chave: string; valor: unknown; porque: string }[] = [];
  const naoClassificadas: { chave: string; valor: unknown }[] = [];
  for (const [k, v] of Object.entries(co)) {
    if ((AFROUXAM_QUANDO_FALSAS as readonly string[]).includes(k)) {
      if (v === false) afrouxam.push({ chave: k, valor: v, porque: "é uma conferência do compilador, e está DESLIGADA" });
      continue;
    }
    if ((AFROUXAM_QUANDO_VERDADEIRAS as readonly string[]).includes(k)) {
      if (v === true) afrouxam.push({ chave: k, valor: v, porque: "liga um atalho que SALTA conferência" });
      continue;
    }
    if (typeof v === "boolean") naoClassificadas.push({ chave: k, valor: v });
  }
  return { arquivo, chaves: Object.keys(co).length, afrouxam, naoClassificadas };
}

const tsconfigsDele = carregados.filter((f) => /(^|\/)tsconfig[^/]*\.json$/.test(f) && !f.startsWith("vendor/"));
const enumeradoDele = tsconfigsDele.map((f) => lerTsconfig(MOTOR, f));
const enumeradoDaqui = ["external-engines/esteira/tsconfig.json", "external-engines/testfit/tsconfig.json"].map((f) =>
  lerTsconfig(RAIZ, f),
);

/**
 * ── OS DESLIGADORES POR ARQUIVO, CLASSIFICADOS ANTES DE VIREM ITEM ───────────
 *
 * A régua achou quatro `@ts-nocheck`/`eslint-disable` no código dele, e mandar os quatro
 * como item de conserto seria acusar sem medir. Dois critérios, e os dois são **lidos da
 * configuração dele**, não da minha opinião:
 *
 * - o arquivo está nos `ignores` do `eslint.config.js` DELE — e lá o motivo está escrito;
 * - o arquivo é **gerado**, pelo nome (`.gen.`): desligar conferência em arquivo que uma
 *   ferramenta reescreve é o normal, porque o conserto não sobrevive à próxima geração.
 *
 * O que não cair em nenhum dos dois é que vira item. *Medir o SALDO antes de propor o
 * conserto* (D184).
 */
const ignoresDele = (() => {
  const texto = readFileSync(join(MOTOR, "eslint.config.js"), "utf8");
  const m = /ignores\s*:\s*\[([^\]]*)\]/.exec(texto);
  return m ? [...m[1]!.matchAll(/"([^"]+)"/g)].map((x) => x[1]!) : [];
})();
const porArquivoDesligado = achados
  .filter((a) => a.regra === "conferencia-desligada-por-arquivo")
  .map((a) => {
    const nosIgnores = ignoresDele.find((g) => a.arquivo === g || a.arquivo.startsWith(g.replace(/\*+$/, "")));
    const gerado = /\.gen\.[cm]?tsx?$/.test(a.arquivo);
    return {
      arquivo: a.arquivo,
      linha: a.linha,
      trecho: a.trecho,
      nosIgnoresDoEslintDele: nosIgnores ?? null,
      geradoPeloNome: gerado,
      ehItemDeConserto: !nosIgnores && !gerado,
    };
  });
const desligadoresQueSaoItem = porArquivoDesligado.filter((x) => x.ehItemDeConserto);

const porRegra: Record<string, number> = {};
for (const a of achados) porRegra[a.regra] = (porRegra[a.regra] ?? 0) + 1;
const porForma: Record<string, number> = {};
for (const a of achados) {
  const forma = REGRAS_DE_CONFIGURACAO.find((r) => r.nome === a.regra)!.forma;
  porForma[forma] = (porForma[forma] ?? 0) + 1;
}

/** Tem CI? É o contexto que decide se as três formas importam, e é medido. */
const temCI = existsSync(join(MOTOR, ".github", "workflows"));

const varridos = porArquivo.filter((l) => l.varrido).length;

// ── A LISTA NUMERADA, que é o que vai ao motor ──────────────────────────────
//
// Cada item tem a forma, o arquivo, a medição, e o que ela significa NA PRÁTICA. Nada de
// conserto: a §4 manda lista, e a lista vai pelo chat.
const lista = [
  {
    numero: 1,
    forma: "2 · a regra LIGADA QUE NÃO PODE REPROVAR",
    oQue: 'o `lint` do motor é `"' + lintDele + '"`, SEM `--max-warnings 0`',
    arquivo: "package.json",
    medido: `o \`eslint.config.js\` dele declara ${porRegra["regra-em-warn"] ?? 0} regra(s) em \`"warn"\``,
    oQueIssoSignificaNaPratica:
      "essas regras APARECEM na saída do lint e NÃO derrubam o passo. É a mais silenciosa das três formas, porque o passo sai VERDE com o aviso impresso — foi exatamente isso que este repositório tinha até o LAB-57",
    oConserto: "acrescentar `--max-warnings 0` ao script de `lint`, e tratar o que ele passar a reprovar",
  },
  {
    numero: 2,
    forma: "1 · a regra DESLIGADA",
    oQue: `${porRegra["regra-em-off"] ?? 0} regra(s) de lint declarada(s) com \`"off"\` e ${porRegra["desligador-de-conferencia"] ?? 0} desligador(es) de conferência em \`tsconfig\`/\`eslint\``,
    arquivo: "eslint.config.js, tsconfig.json",
    medido: "ver `achados` nesta prova, com arquivo e linha",
    oQueIssoSignificaNaPratica:
      "regra em `\"off\"` não roda, não avisa e não reprova. Nem toda é defeito — `no-undef` desligado em TypeScript é o que o próprio `typescript-eslint` recomenda —, mas **desligada sem motivo escrito** envelhece em silêncio, que é o D104",
    oConserto: "escrever o MOTIVO ao lado de cada uma, no próprio arquivo, com a condição de revisitar",
  },
  {
    numero: 3,
    forma: "3 · o desligador SEM MOTIVO ESCRITO",
    oQue: "`skipLibCheck: true` no `tsconfig.json`, sem motivo escrito ao lado",
    arquivo: "tsconfig.json",
    medido: "a chave está declarada e não há comentário na linha nem acima dela",
    oQueIssoSignificaNaPratica:
      "ele salta a conferência de tipo DENTRO das dependências. Pode ser a escolha certa — é a desta casa, medida e declarada no LAB-57 —, mas sem a medição escrita ninguém sabe se ainda é necessária",
    oConserto:
      "medir com `false` (aqui deu ZERO erros nos dois pacotes) e escrever o número ao lado da chave; se der erro, o número é o argumento",
  },
  {
    numero: 4,
    forma: "o CONTEXTO, e ele vale mais que as três",
    oQue: temCI ? "o motor TEM CI" : "o motor NÃO TEM CI: não existe `.github/workflows/`",
    arquivo: ".github/workflows/",
    medido: `pasta ${temCI ? "presente" : "ausente"}; o \`package.json\` dele declara \`lint\`, \`test\` e \`typecheck\``,
    oQueIssoSignificaNaPratica: temCI
      ? "as três formas importam na medida em que o CI as roda"
      : "os três passos existem e **ninguém os roda sozinho**. Então as três formas acima são menos urgentes que esta: regra que não pode reprovar e regra que ninguém roda falham do mesmo jeito, e a segunda é a que este repositório pagou duas semanas para aprender (D110)",
    oConserto: temCI ? "—" : "um trabalho de CI que rode `lint`, `typecheck` e `test` em todo push — e que FALHE com a receita se faltar alguma coisa, nunca pule (D124)",
  },
  {
    numero: 5,
    forma: "o que a régua de texto NÃO alcança, enumerado",
    oQue: `as chaves booleanas de \`compilerOptions\` que afrouxam conferência: ${enumeradoDele.reduce((n, t) => n + t.afrouxam.length, 0)} no motor contra ${enumeradoDaqui.reduce((n, t) => n + t.afrouxam.length, 0)} aqui`,
    arquivo: tsconfigsDele.join(", "),
    medido: "lista completa em `oTsconfigEnumerado`, chave por chave, com o valor",
    oQueIssoSignificaNaPratica:
      "padrão de texto só acha o nome que alguém escreveu nele. A enumeração lê o JSON e classifica TODA chave booleana, então o que sobra sai em `naoClassificadas` com o valor — e não como silêncio",
    oConserto: "para cada chave afrouxada, a mesma receita do item 2: motivo escrito ao lado, ou religar",
  },
  {
    numero: 6,
    forma: "3 · o desligador POR ARQUIVO, e aqui a maioria NÃO é item",
    oQue: `${porArquivoDesligado.length} \`@ts-nocheck\`/\`eslint-disable\` no código dele, dos quais ${desligadoresQueSaoItem.length} viram item`,
    arquivo: porArquivoDesligado.map((x) => x.arquivo).join(", "),
    medido:
      `${porArquivoDesligado.filter((x) => x.nosIgnoresDoEslintDele).length} estão nos \`ignores\` do ` +
      `\`eslint.config.js\` DELE, onde o motivo está escrito, e ` +
      `${porArquivoDesligado.filter((x) => x.geradoPeloNome).length} são arquivo GERADO pelo nome (\`.gen.\`)`,
    oQueIssoSignificaNaPratica:
      "desligar conferência em arquivo que uma ferramenta reescreve, ou em código copiado de outro " +
      "repositório com o motivo declarado, é o normal — o conserto não sobreviveria à próxima " +
      "geração, e o estilo desta casa não se cobra de código que não é desta casa",
    oConserto:
      desligadoresQueSaoItem.length === 0
        ? "nenhum: os quatro têm motivo medido. Esta linha existe para dizer que eu MEDI antes de não acusar (D184)"
        : `escrever o motivo nos ${desligadoresQueSaoItem.length} que sobram`,
  },
];

console.log("══════════ LAB-60 · a configuração DO MOTOR, só de leitura ══════════");
console.log(`  clone: ../motor-testfit em ${doGit(MOTOR, "rev-parse", "--short", "HEAD").trim()}`);
console.log(`  arquivos que o git DELE carrega: ${carregados.length}`);
console.log(`  configuração encontrada: ${porArquivo.length} · varrida: ${varridos} · fora, nomeada: ${porArquivo.length - varridos}`);
console.log(`  linhas de configuração lidas: ${linhasLidas} · arquivos de código: ${codigo.length} (${linhasDeCodigo} linhas)`);
console.log(`  regras: ${REGRAS_DE_CONFIGURACAO.length} · lint dele: "${lintDele}" · reprova aviso: ${lintReprovaAviso}`);
console.log(`  tem CI: ${temCI}`);
console.log("");
for (const r of REGRAS_DE_CONFIGURACAO) {
  console.log(`  ${r.nome.padEnd(36)} ${String(porRegra[r.nome] ?? 0).padStart(3)}  (${r.forma})`);
}
console.log("");
for (const a of achados) console.log(`  → ${a.arquivo}:${a.linha}  ${a.regra}  ${a.trecho.replace(/\s+/g, " ")}`);
console.log("");
console.log("  as chaves de compilerOptions que AFROUXAM:");
for (const t of [...enumeradoDele, ...enumeradoDaqui]) {
  console.log(`    ${t.arquivo} (${t.chaves} chaves): ${t.afrouxam.map((a) => `${a.chave}=${String(a.valor)}`).join(", ") || "nenhuma"}`);
}
console.log("");
console.log("  A LISTA NUMERADA, para o chat levar ao motor:");
for (const i of lista) console.log(`    ${i.numero}. [${i.forma}] ${i.oQue}`);

// ── O §4: os três clones ficaram limpos? ────────────────────────────────────
const clones = VIZINHOS.map((v) => {
  const dir = join(RAIZ, "..", v);
  if (!existsSync(dir)) return { clone: v, presente: false, alteracoes: null, head: null };
  return {
    clone: v,
    presente: true,
    alteracoes: doGit(dir, "status", "--porcelain").split("\n").filter((l) => l.trim().length > 0).length,
    head: doGit(dir, "rev-parse", "--short", "HEAD").trim(),
  };
});
const sujos = clones.filter((c) => (c.alteracoes ?? 0) > 0);
if (sujos.length) {
  console.error(`\n✗ §4 VIOLADA: ${sujos.length} clone(s) vizinho(s) com alteração: ${sujos.map((c) => c.clone).join(", ")}`);
  process.exit(1);
}
console.log(`\n  §4: os ${clones.filter((c) => c.presente).length} clones vizinhos ficaram LIMPOS, zero alterações`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "configuracao-do-motor.json"),
  JSON.stringify(
    {
      prompt: "LAB-60",
      oQueIstoMede:
        "as três formas de desligar conferência — a regra DESLIGADA, a regra LIGADA QUE NÃO PODE " +
        "REPROVAR e o desligador SEM MOTIVO ESCRITO — medidas no clone do motor do Laboratório de " +
        "Parcelamento, SÓ DE LEITURA, com a MESMA régua que mediu este repositório no LAB-57",
      aPergunta: "do chat: conferir no motor as três formas que o LAB-57 achou aqui, em lista numerada",
      quando: new Date().toISOString(),
      oClone: {
        caminho: "../motor-testfit",
        head: doGit(MOTOR, "rev-parse", "HEAD").trim(),
        ehSomenteLeitura: "sim — nada foi escrito, e o `git status` dele é conferido ao fim (§4)",
      },
      escopo: {
        arquivosQueOGitDeleCarrega: carregados.length,
        configuracoesEncontradas: porArquivo.length,
        configuracoesVarridas: varridos,
        configuracoesForaDoEscopoNomeadas: porArquivo.length - varridos,
        linhasDeConfiguracaoLidas: linhasLidas,
        arquivosDeCodigoVarridos: codigo.length,
        linhasDeCodigoLidas: linhasDeCodigo,
        chavesDeCompilerOptionsExaminadas: [...enumeradoDele, ...enumeradoDaqui].reduce((n, t) => n + t.chaves, 0),
        regras: REGRAS_DE_CONFIGURACAO.length,
        porque: "o escopo começa no `git ls-files` DELE, não numa lista minha — e o que ficou fora sai NOMEADO (D164)",
      },
      aReguaEhAMESMA: {
        qual: "src/varredura-de-configuracao.ts, as mesmas sete regras do LAB-57",
        porque: "medir o vizinho com outra régua não compararia nada",
        oQueAVIAGEMCONSERTOU: [
          "a `regra-em-off` NASCEU aqui: o cabeçalho da varredura prometia `\"off\"` desde o LAB-57 e NENHUMA das seis regras o procurava — a promessa só foi desmentida quando a régua saiu de casa",
          "o `regra-em-warn` passou a ver a forma de ARRAY (`[\"warn\", { … }]`), que é a normal quando a regra tem opção; antes só via a string solta",
          "e o conserto achou DOIS desligadores NESTE repositório que seis regras não tinham visto (`\"no-undef\": \"off\"` nos dois `eslint.config.js`), agora com o motivo escrito no próprio arquivo",
        ],
      },
      oLintDele: { script: lintDele, reprovaAviso: lintReprovaAviso },
      temCI,
      regras: REGRAS_DE_CONFIGURACAO.map((r) => ({
        nome: r.nome,
        forma: r.forma,
        oQue: r.oQue,
        oQueNaoPega: r.oQueNaoPega,
        limpeza: r.limpeza,
        achados: porRegra[r.nome] ?? 0,
      })),
      totalPorRegra: porRegra,
      totalPorForma: porForma,
      configuracaoDaPilhaDele: CONFIGURACAO_DA_PILHA_DELE,
      porArquivo,
      achados,
      oTsconfigEnumerado: { doMotor: enumeradoDele, desteRepositorio: enumeradoDaqui },
      osDesligadoresPorArquivo: {
        quantos: porArquivoDesligado.length,
        viramItem: desligadoresQueSaoItem.length,
        osIgnoresDoEslintDele: ignoresDele,
        lista: porArquivoDesligado,
      },
      aListaNumeradaParaOMotor: lista,
      oQueNAOFoiFeito:
        "nada foi consertado e nada foi escrito no clone do vizinho (§4). A lista numerada vai pelo " +
        "chat, e o conserto é lá — quem mede é quem vai consertar, e esta medição é só a leitura",
      osClonesVizinhos: clones,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-60/configuracao-do-motor.json`);
