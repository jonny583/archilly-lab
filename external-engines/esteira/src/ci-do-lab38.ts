/**
 * **LAB-217 (item 900) · os três disparos do CI do LAB-38 — se o ato rodou código de vizinho, perguntado à ferramenta**
 * (D445).
 *
 * # O que estava escrito
 *
 * A lista de quem grava cada prova (`src/o-commit-do-vizinho-na-prova.ts`, LAB-198) põe `LAB-38/ci.json` entre os
 * registros de um ATO, com o motivo pronto da função `ATO(...)`:
 *
 * > *"o registro de um ATO, escrito à mão na rodada: os três disparos do CI, um deles sabotado. Não há ferramenta que o
 * > grave, e por isso ele não roda código de ninguém"*
 *
 * O *"e por isso"* é a falha: não ter ferramenta que grave a prova não diz nada sobre o que o ato rodou. O LAB-215 mediu
 * isso na sabotagem do LAB-31 e a frase caiu lá (a suíte do testfit roda o motor). O relatório dele deixou o candidato:
 * perguntar, uma a uma, as outras sabotagens registradas como ato. Esta é a mais velha.
 *
 * # O que a ferramenta respondeu (20/10/2026)
 *
 * Duas perguntas, a duas ferramentas:
 *
 * 1. **À API do GitHub, os passos de cada trabalho dos três disparos** (a resposta, como veio, está congelada em
 *    {@link OS_DISPAROS}). Nos três, o `verde-completo` parou na **precondição** (`failure`) e os dois passos de
 *    clone e o `./external-engines/conferir.sh` saíram **`skipped`** — o segredo `VIZINHOS_TOKEN` não existia. O
 *    trabalho `guardas-sem-clones` não tem passo de clone: um `checkout` do próprio Lab e um `bun test` em cinco
 *    arquivos.
 * 2. **Ao `git`, o que aqueles cinco arquivos rodam**, no commit de cada disparo (`527628f`, `21ee5d7`, `d0604e9`): o
 *    fecho dos `import` de execução — pela régua da casa, `vizinhosQueRoda` — mais as ferramentas que eles chamam por
 *    processo (`pagina.test.ts` roda `ferramentas/lab20.ts`). **Sete arquivos, nenhum vizinho**; os processos filhos são
 *    `git status` (na pasta do vizinho, se ela existir — e no runner não existia), `find` e `bun` no `lab20.ts`.
 *
 * **O motivo se sustenta — mas pelo motivo medido, não pelo escrito.** O ato não rodou código de ninguém porque o
 * trabalho que rodaria (o verde completo) parou antes do clone nos três disparos, e o que rodou não importa vizinho. A
 * sabotagem do disparo 3 (`verde.test.ts`) cai dentro do trabalho sem clones, e é ela que pinta o vermelho.
 *
 * # O que este módulo faz
 *
 * É a parte pura: {@link OS_DISPAROS} (a resposta da API, com a data), {@link osDisparosDaProva} (a resposta contra
 * o que a prova escreve: run, trabalho e conclusão), {@link oVerdeParouAntesDoClone} (nenhum passo de clone ou do
 * comando único rodou), {@link osArquivosDasGuardas} (os testes do trabalho sem clones, lidos do `verde.yml` do
 * commit) e {@link oQueOTesteRodaPorProcesso} (os comandos de processo filho de um arquivo). Quem lê o `git` e roda o
 * fecho é a trava, `tests/ci-do-lab38.test.ts`.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **a API não se pergunta de novo a cada verde**: a trava não tem rede (D386) nem credencial do GitHub. A resposta
 *   está congelada com a data; o que se refaz a cada verde é a parte do `git` e a coerência entre a resposta e o
 *   `verde.yml` de cada commit (os nomes dos passos, um a um);
 * - **o que o runner tinha instalado**: a régua lê o que o Lab importa e chama, não o `bun install` do runner. As
 *   dependências da `esteira` são pacotes do npm (o `bun.lock` não tem caminho de vizinho), não código da família;
 * - **o código do vizinho por TEXTO**: o `regras.test.ts` daquela época faz `git status` na pasta do vizinho quando
 *   ela existe. Ler a árvore de outro repositório não é rodar o código dele — e no runner a pasta não existia.
 */

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-38/ci.json";

/** Os dois trabalhos do `verde.yml` do LAB-38, pela chave e pelo nome que a API devolve. */
export const OS_TRABALHOS = {
  "guardas-sem-clones": "guardas que não precisam dos clones vizinhos (NÃO é o verde)",
  "verde-completo": "o verde completo (precisa do segredo VIZINHOS_TOKEN)",
} as const;
export type Trabalho = keyof typeof OS_TRABALHOS;

/** Um passo, como a API o devolve: o nome e a conclusão. */
export interface Passo {
  nome: string;
  conclusao: "success" | "failure" | "skipped";
}

/** Um disparo: o run, o commit em que ele rodou e os passos de cada trabalho. */
export interface Disparo {
  n: number;
  run: number;
  commit: string;
  trabalhos: Record<Trabalho, { conclusao: "success" | "failure"; passos: readonly Passo[] }>;
}

const P = (nome: string, conclusao: Passo["conclusao"]): Passo => ({ nome, conclusao });
const PRECONDICAO = "precondição — o segredo que dá acesso aos dois clones privados";
const CLONE_MOTOR = "clonar o motor do Laboratório de Parcelamento (somente leitura)";
const CLONE_GENERATE = "clonar o Archilly Generate (somente leitura)";
const COMANDO_UNICO = "./external-engines/conferir.sh";
const TESTES = "as travas que não dependem de clone vizinho";

/** Os passos que rodariam código de vizinho, ou o trariam para a máquina: os dois clones e o comando único. */
export const OS_PASSOS_DO_VIZINHO = [CLONE_MOTOR, CLONE_GENERATE, COMANDO_UNICO] as const;

/** O `verde-completo` de um disparo em que a precondição caiu: tudo depois dela pulado. */
const verdeSemSegredo = (): Disparo["trabalhos"]["verde-completo"] => ({
  conclusao: "failure",
  passos: [
    P(PRECONDICAO, "failure"),
    P(CLONE_MOTOR, "skipped"),
    P(CLONE_GENERATE, "skipped"),
    P("Run oven-sh/setup-bun@v2", "skipped"),
    P("compilar o `.wasm` do Symbios", "skipped"),
    P("instalar o Chromium da prova no navegador", "skipped"),
    P("instalar as dependências do pacote `testfit`", "skipped"),
    P(COMANDO_UNICO, "skipped"),
  ],
});

const guardas = (c: "success" | "failure"): Disparo["trabalhos"]["guardas-sem-clones"] => ({
  conclusao: c,
  passos: [
    P("Run oven-sh/setup-bun@v2", "success"),
    P("instalar dependências do pacote `esteira`", "success"),
    P(TESTES, c),
  ],
});

/**
 * **A resposta da API do GitHub, perguntada em 20/10/2026** (`list_workflow_jobs` de cada run). Só os passos que o
 * `verde.yml` declara — os de máquina (`Set up job`, `Run actions/checkout@v4`, os `Post Run`, `Complete job`) ficam
 * fora, porque não são do workflow. O `checkout` também saiu `success` nos seis trabalhos: é o do próprio Lab.
 */
export const OS_DISPAROS: readonly Disparo[] = [
  {
    n: 1,
    run: 37209442979,
    commit: "527628fbc0b5116dd62139e10b131116d26281e1",
    trabalhos: { "guardas-sem-clones": guardas("failure"), "verde-completo": verdeSemSegredo() },
  },
  {
    n: 2,
    run: 37209625506,
    commit: "21ee5d71f4b05c6dbd1e08d7c94c1baf36220c97",
    trabalhos: { "guardas-sem-clones": guardas("success"), "verde-completo": verdeSemSegredo() },
  },
  {
    n: 3,
    run: 37209732926,
    commit: "d0604e9feae8b8a4536965961012c8b83ff055e5",
    trabalhos: { "guardas-sem-clones": guardas("failure"), "verde-completo": verdeSemSegredo() },
  },
] as const;

/** O que a prova escreve de cada disparo. */
export interface ProvaDoCi {
  disparos: readonly { n: number; run: number; resultado: Record<string, string> }[];
}

/** A resposta da API contra a prova: os mesmos runs, na mesma ordem, e a mesma conclusão de cada trabalho. */
export function osDisparosDaProva(prova: ProvaDoCi, disparos: readonly Disparo[]): string[] {
  const out: string[] = [];
  if (prova.disparos.length !== disparos.length) {
    out.push(`a prova tem ${prova.disparos.length} disparos, a resposta ${disparos.length}`);
  }
  for (const d of disparos) {
    const p = prova.disparos.find((x) => x.n === d.n);
    if (!p) {
      out.push(`o disparo ${d.n} não está na prova`);
      continue;
    }
    if (p.run !== d.run) out.push(`disparo ${d.n}: a prova diz run ${p.run}, a resposta ${d.run}`);
    for (const t of Object.keys(OS_TRABALHOS) as Trabalho[]) {
      if (p.resultado[t] !== d.trabalhos[t].conclusao) {
        out.push(`disparo ${d.n}, ${t}: a prova diz ${p.resultado[t]}, a resposta ${d.trabalhos[t].conclusao}`);
      }
    }
  }
  return out;
}

/**
 * Nenhum passo de vizinho rodou: no `verde-completo`, cada um de {@link OS_PASSOS_DO_VIZINHO} existe e saiu
 * `skipped`; no `guardas-sem-clones`, nenhum deles existe. Devolve o que desmente isso.
 */
export function oVerdeParouAntesDoClone(d: Disparo): string[] {
  const out: string[] = [];
  const verde = d.trabalhos["verde-completo"].passos;
  for (const nome of OS_PASSOS_DO_VIZINHO) {
    const p = verde.find((x) => x.nome === nome);
    if (!p) out.push(`disparo ${d.n}: o verde completo não tem o passo "${nome}"`);
    else if (p.conclusao !== "skipped") out.push(`disparo ${d.n}: o passo "${nome}" RODOU (${p.conclusao})`);
  }
  for (const p of d.trabalhos["guardas-sem-clones"].passos) {
    if ((OS_PASSOS_DO_VIZINHO as readonly string[]).includes(p.nome)) {
      out.push(`disparo ${d.n}: o trabalho sem clones tem o passo "${p.nome}"`);
    }
  }
  return out;
}

/**
 * Os nomes dos passos de um trabalho no `verde.yml` (os `- name:` dentro dele), na ordem. Passo sem `name` (os
 * `- uses:` da máquina) não entra — é o mesmo recorte de {@link OS_DISPAROS}, exceto o `setup-bun`, que a API
 * nomeia `Run oven-sh/setup-bun@v2` e que aqui sai como `uses:oven-sh/setup-bun@v2`.
 */
export function passosDoWorkflow(yml: string, trabalho: Trabalho): string[] {
  const linhas = yml.split("\n");
  const ini = linhas.findIndex((l) => l === `  ${trabalho}:`);
  if (ini === -1) return [];
  const out: string[] = [];
  for (let i = ini + 1; i < linhas.length; i++) {
    const l = linhas[i]!;
    if (/^ {2}\S/.test(l)) break; // o próximo trabalho
    const nome = /^ {6}- name:\s*(.+?)\s*$/.exec(l);
    if (nome) out.push(nome[1]!.replace(/^["']|["']$/g, ""));
    const usa = /^ {6}- uses:\s*(\S+)/.exec(l);
    if (usa && usa[1]!.startsWith("oven-sh/setup-bun")) out.push(`Run ${usa[1]!}`);
  }
  return out;
}

/** Os arquivos de teste que o trabalho `guardas-sem-clones` passa ao `bun test`, relativos à `esteira`. */
export function osArquivosDasGuardas(yml: string): string[] {
  const linhas = yml.split("\n");
  const ini = linhas.findIndex((l) => l === "  guardas-sem-clones:");
  if (ini === -1) return [];
  const out: string[] = [];
  for (let i = ini + 1; i < linhas.length; i++) {
    const l = linhas[i]!;
    if (/^ {2}\S/.test(l)) break;
    if (/^\s*#/.test(l)) continue;
    for (const m of l.matchAll(/(?:^|\s)(tests\/[\w./-]+\.test\.ts)\b/g)) out.push(m[1]!);
  }
  return out;
}

/** Um processo filho que um arquivo chama: o comando e o primeiro argumento. */
export interface Processo {
  comando: string;
  primeiro: string | null;
}

/**
 * Os processos filhos que um arquivo chama por `execFileSync`/`spawnSync`/`spawn`, com o comando literal e o primeiro
 * argumento literal. `execSync` e o `$` do Bun passam uma linha de shell, e saem com o comando `"<shell>"` — quem chama
 * a régua decide o que fazer com eles (aqui: reprovar, porque o que a linha roda não se lê sem rodar).
 */
export function oQueOTesteRodaPorProcesso(codigo: string): Processo[] {
  const out: Processo[] = [];
  const re = /\b(?:execFileSync|spawnSync|spawn)\(\s*["']([^"']+)["']\s*(?:,\s*\[\s*(?:["']([^"']*)["'])?)?/g;
  for (const m of codigo.matchAll(re)) out.push({ comando: m[1]!, primeiro: m[2] ?? null });
  const linhasDeShell = codigo.match(/\bexecSync\(|\bBun\.\$`|(?<![\w.])\$`/g) ?? [];
  for (let i = 0; i < linhasDeShell.length; i++) out.push({ comando: "<shell>", primeiro: null });
  return out;
}

/** Os comandos de processo filho que não rodam código de vizinho, e por quê. Fora desta lista, a trava reprova. */
export const OS_PROCESSOS_INOCENTES: Readonly<Record<string, string>> = {
  git: "o `git` lê história e árvore — `status` na pasta do vizinho é ler, não rodar o código dele",
  find: "o `find` lista caminhos",
};
