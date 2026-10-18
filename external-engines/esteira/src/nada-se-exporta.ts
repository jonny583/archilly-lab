/**
 * ════════════════════════════════════════════════════════════════════════════
 *  NADA DE EXPORTAR MOTOR OU CÓDIGO AO USUÁRIO — perguntado pelo LUGAR por onde ele sairia. (LAB-183, item 900, D411)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, tabela *Execução*, diz desde o LF-FINAL (14/09/2026):
 *
 * > Nada de exportar motor ou código ao usuário · ✅ **não se aplica** · o Lab não tem usuário nem exportação. O que ele
 * > publica são relatórios e JSON de medição
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. Era a última linha das tabelas da página sem trava nomeada.
 * A regra da família (*"nada de exportar o motor ou o código do produto ao usuário"*) fala de produto com usuário; o Lab
 * não tem usuário, mas tem **um repositório público** (o `verde.yml` o diz, D141) que lê por caminho três vizinhos
 * **privados** (D16). Então "exportar" aqui tem um sentido que a linha não dizia: **o que sai deste repositório sai para o
 * mundo**, e o código do produto da família não pode sair por ele.
 *
 * # Por onde motor ou código sairiam, e quem pergunta cada porta
 *
 * | porta | o que se pergunta | quem pergunta |
 * |---|---|---|
 * | `tela` | uma tela que entregue o motor a alguém | `a-unica-interface.ts` (LAB-153): só a bancada, ferramenta |
 * | `codigo-do-produto` | o motor da família (Generate, Laboratório de Parcelamento) copiado para cá | `o-motor-da-familia-nao-se-copia.ts` (LAB-146), com os clones |
 * | `pacote` | um pacote publicável: `package.json` sem `"private": true`, `Cargo.toml` sem `publish = false` | **esta régua** |
 * | `rotina` | uma rotina do GitHub que publica: ação de *release*, *pages*, *deploy* ou *upload*, e os comandos `publish`, `gh release`, `wrangler`, `vercel`, `netlify`, `docker push`, `git push` | **esta régua** |
 * | `binario` | um artefato compilado versionado: a extensão (`.wasm`, `.node`, `.so`, `.tgz`, `.crate`…), o `\0asm` no começo do arquivo, ou o `.wasm` em base64 dentro de texto | **esta régua** |
 * | `docs` | *"o que ele publica são relatórios e JSON de medição"*: toda a pasta `docs/` em `.md`, `.json`, `.geojson` ou `.txt` | **esta régua** |
 *
 * O `upstream/` fica fora das portas `pacote` e `binario` do lado de quem publica: é a cópia exata de um motor público
 * (MIT), intocável (LAB-132), e o `Cargo.toml` dele é o do autor — que publica no crates.io, como é dele.
 *
 * **Medido em 18/10/2026, antes do commit desta rodada:** 2 `package.json` (os dois com `"private": true`), 4 `Cargo.toml`
 * fora do `upstream/` — **dois sem `publish = false`**: o `straight-skeleton/archilly/probe-rust/` (que depende de um crate
 * GPL clonado num `/tmp`) e o `symbios/archilly/wasm-probe/` (a sonda do LAB-00); 1 rotina, nenhum passo que publique;
 * nenhum artefato compilado nos 800 e tantos caminhos; a pasta `docs/` em quatro formatos (238 `.md`, 104 `.json`, 4
 * `.geojson` — os terrenos de entrada —, 3 `.txt` — saídas de medição). Os dois `Cargo.toml` ganharam `publish = false`
 * nesta rodada: o `cargo` provavelmente já recusaria publicá-los (dependência por `path` sem versão), mas isso é
 * comportamento de ferramenta externa **não testado** aqui — e o campo escrito não depende dele.
 *
 * **Não há lista de exceções.** Um pacote que precise publicar, uma rotina que suba *pages*, uma captura de tela em
 * `docs/` — cada um é o dia em que a linha da página tem de ser refeita, e a trava reprova até isso acontecer.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela *Execução* que esta régua responde. */
export const A_LINHA = "| Nada de exportar motor ou código ao usuário |";
export const O_PONTEIRO = "external-engines/esteira/src/nada-se-exporta.ts";
export const ESTA_RODADA = 183;
/** O título da seção da página que leva a tabela das portas. */
export const A_SECAO = "## Reconferido no LAB-183";

export type Porta = "pacote" | "rotina" | "binario" | "docs";
export const AS_PORTAS: readonly Porta[] = [
  "pacote",
  "rotina",
  "binario",
  "docs",
];

const E = "external-engines/esteira/src/";
/** As duas portas que outra régua já pergunta — a linha as nomeia, e o módulo de cada uma nomeia a rodada. */
export const AS_VIZINHAS: readonly {
  porta: string;
  trava: string;
  desde: number;
}[] = [
  { porta: "tela", trava: `${E}a-unica-interface.ts`, desde: 153 },
  {
    porta: "codigo-do-produto",
    trava: `${E}o-motor-da-familia-nao-se-copia.ts`,
    desde: 146,
  },
];

/** Os formatos que a pasta `docs/` pode carregar: o que a linha da página diz que o Lab publica. */
export const FORMATOS_DE_DOCS: readonly string[] = [
  ".md",
  ".json",
  ".geojson",
  ".txt",
];

/** O artefato compilado, pela extensão. */
export const EXTENSAO_DE_ARTEFATO =
  /\.(wasm|node|so|dylib|dll|exe|a|o|rlib|lib|tgz|crate|whl|jar|zip|tar|gz|bz2|xz|7z)$/i;

/** O começo de um `.wasm` (`\0asm`) e o mesmo começo em base64, montado em dois pedaços para este arquivo não ser achado de si mesmo. */
const MAGICA_DO_WASM = Buffer.from([0x00, 0x61, 0x73, 0x6d]);
export const WASM_EM_BASE64 = ["AGF", "zbQ"].join("");

/** As ações do GitHub que publicam alguma coisa para fora do repositório. */
export const ACOES_QUE_PUBLICAM: readonly string[] = [
  "actions/upload-artifact",
  "actions/upload-pages-artifact",
  "actions/deploy-pages",
  "actions/configure-pages",
  "actions/create-release",
  "softprops/action-gh-release",
  "ncipollo/release-action",
  "peaceiris/actions-gh-pages",
  "JamesIves/github-pages-deploy-action",
  "cloudflare/wrangler-action",
  "cloudflare/pages-action",
  "amondnet/vercel-action",
  "nwtgck/actions-netlify",
  "docker/build-push-action",
];

/** Os comandos que publicam, dentro de um `run:`. */
export const COMANDOS_QUE_PUBLICAM =
  /\b(?:(?:npm|bun|pnpm|yarn)\s+publish|cargo\s+publish|gh\s+release|wrangler\s+(?:deploy|publish|pages)|vercel\b|netlify\s+deploy|gh-pages\b|docker\s+push|git\s+push)\b/;

export interface Achado {
  porta: Porta;
  caminho: string;
  oQue: string;
}

export interface Resultado {
  caminhos: number;
  lidos: {
    packageJson: number;
    cargoToml: number;
    rotinas: number;
    binario: number;
    docs: number;
  };
  /** Quantos arquivos a pasta `docs/` carrega em cada formato — impresso pelo teste. */
  formatosDeDocs: Record<string, number>;
  achados: Achado[];
}

const noUpstream = (c: string) => c.split("/").includes("upstream");
const noNodeModules = (c: string) => c.split("/").includes("node_modules");
const ehPackageJson = (c: string) => /(^|\/)package\.json$/.test(c);
const ehCargoToml = (c: string) => /(^|\/)Cargo\.toml$/.test(c);
const ehRotina = (c: string) => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(c);
const extensao = (c: string) => {
  const nome = c.slice(c.lastIndexOf("/") + 1);
  const i = nome.lastIndexOf(".");
  return i <= 0 ? "" : nome.slice(i).toLowerCase();
};

/** O `[package]` de um `Cargo.toml` diz `publish = false`? (`null`: não há `[package]` — é um *workspace*.) */
export function cargoNaoPublica(texto: string): boolean | null {
  let naPackage = false;
  let viuPackage = false;
  for (const crua of texto.split("\n")) {
    const linha = crua.replace(/#.*$/, "").trim();
    const tabela = /^\[([^\]]+)\]$/.exec(linha);
    if (tabela) {
      naPackage = tabela[1]!.trim() === "package";
      viuPackage ||= naPackage;
      continue;
    }
    if (naPackage && /^publish\s*=\s*false$/.test(linha)) return true;
  }
  return viuPackage ? false : null;
}

/** O `package.json` diz `"private": true`? (`null`: não é JSON.) */
export function packageNaoPublica(texto: string): boolean | null {
  try {
    const j = JSON.parse(texto) as { private?: unknown };
    return j !== null && typeof j === "object" && j.private === true;
  } catch {
    return null;
  }
}

/** As linhas de uma rotina, sem os comentários de YAML, com o que publica. */
export function oQueARotinaPublica(texto: string): string[] {
  const fora: string[] = [];
  for (const crua of texto.split("\n")) {
    if (/^\s*#/.test(crua)) continue;
    const linha = crua.replace(/\s#\s.*$/, "");
    const uses = /\buses:\s*["']?([^@"'\s]+)/.exec(linha);
    if (uses && ACOES_QUE_PUBLICAM.includes(uses[1]!)) fora.push(uses[1]!);
    const cmd = COMANDOS_QUE_PUBLICAM.exec(linha);
    if (cmd) fora.push(cmd[0]);
  }
  return fora;
}

/** O que cada porta acha num arquivo, dados o caminho, o texto e os primeiros bytes. */
export function conferirOsArquivos(
  caminhos: readonly string[],
  ler: (caminho: string) => Buffer | null,
): Resultado {
  const r: Resultado = {
    caminhos: caminhos.length,
    lidos: { packageJson: 0, cargoToml: 0, rotinas: 0, binario: 0, docs: 0 },
    formatosDeDocs: {},
    achados: [],
  };
  for (const c of caminhos) {
    if (noNodeModules(c)) continue;
    const bytes = ler(c);

    if (c.startsWith("docs/")) {
      r.lidos.docs++;
      const ext = extensao(c);
      r.formatosDeDocs[ext || "(sem extensão)"] =
        (r.formatosDeDocs[ext || "(sem extensão)"] ?? 0) + 1;
      if (!FORMATOS_DE_DOCS.includes(ext))
        r.achados.push({
          porta: "docs",
          caminho: c,
          oQue: `formato "${ext || "sem extensão"}" na pasta que publica`,
        });
    }

    if (noUpstream(c)) continue;

    if (EXTENSAO_DE_ARTEFATO.test(c))
      r.achados.push({
        porta: "binario",
        caminho: c,
        oQue: `artefato "${extensao(c)}"`,
      });
    if (bytes !== null) {
      r.lidos.binario++;
      if (bytes.length >= 4 && bytes.subarray(0, 4).equals(MAGICA_DO_WASM))
        r.achados.push({
          porta: "binario",
          caminho: c,
          oQue: "um .wasm (começa por \\0asm)",
        });
      else if (bytes.includes(WASM_EM_BASE64, 0, "utf8"))
        r.achados.push({
          porta: "binario",
          caminho: c,
          oQue: "um .wasm em base64 dentro de texto",
        });
    }
    if (bytes === null) continue;
    const texto = bytes.toString("utf8");

    if (ehPackageJson(c)) {
      r.lidos.packageJson++;
      const p = packageNaoPublica(texto);
      if (p !== true)
        r.achados.push({
          porta: "pacote",
          caminho: c,
          oQue:
            p === null ? "package.json que não é JSON" : 'sem "private": true',
        });
    }
    if (ehCargoToml(c)) {
      r.lidos.cargoToml++;
      if (cargoNaoPublica(texto) === false)
        r.achados.push({
          porta: "pacote",
          caminho: c,
          oQue: "[package] sem publish = false",
        });
    }
    if (ehRotina(c)) {
      r.lidos.rotinas++;
      for (const o of oQueARotinaPublica(texto))
        r.achados.push({ porta: "rotina", caminho: c, oQue: o });
    }
  }
  return r;
}

export function medir(raiz: string): Resultado {
  return conferirOsArquivos(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c));
    } catch {
      return null;
    }
  });
}

export type TipoDeProblema =
  | "exportavel"
  | "universo-vazio"
  | "linha-ausente"
  | "linha-nao-nomeia"
  | "linha-sem-formato"
  | "linha-afirmacao-antiga"
  | "tabela-ausente"
  | "tabela-sem-porta"
  | "tabela-com-outra"
  | "tabela-numero-errado"
  | "vizinha-sem-rodada";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

/** A frase de 14/09, que a linha não pode mais dizer sozinha. */
export const A_FRASE_ANTIGA =
  "o Lab não tem usuário nem exportação. O que ele publica são relatórios e JSON de medição";

const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A tabela da seção: `| <porta> | … | <achados> |` → achados. */
export function aTabela(pagina: string): Map<string, number> | null {
  const linhas = pagina.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(A_SECAO));
  if (i < 0) return null;
  const t = new Map<string, number>();
  for (let j = i + 1; j < linhas.length && !/^##\s/.test(linhas[j]!); j++) {
    const m = /^\|\s*`([a-z-]+)`\s*\|.*\|\s*\*{0,2}(\d+)\*{0,2}\s*\|\s*$/.exec(
      linhas[j]!,
    );
    if (m) t.set(m[1]!, Number(m[2]));
  }
  return t;
}

/**
 * A conferência inteira: a árvore (nenhum achado, nenhuma porta sem leitura), a linha da página (nomeia esta trava, a
 * rodada, as duas vizinhas e os formatos de `docs/`, e não repete a frase de 14/09 como estava) e a tabela da seção.
 * `modulos` é o texto de cada trava vizinha (`null`: o `git` não a carrega).
 */
export function conferir(
  r: Resultado,
  pagina: string | null,
  modulos: Record<string, string | null>,
): Problema[] {
  const problemas: Problema[] = [];
  for (const a of r.achados)
    problemas.push({
      tipo: "exportavel",
      detalhe: `${a.porta}: ${a.caminho} — ${a.oQue}. A linha "Nada de exportar motor ou código ao usuário" do ${A_PAGINA} deixa de ser verdade; refaça-a antes`,
    });
  if (r.caminhos === 0)
    problemas.push({
      tipo: "universo-vazio",
      detalhe: "o git não carrega caminho nenhum",
    });
  for (const [k, n] of Object.entries(r.lidos))
    if (n === 0)
      problemas.push({
        tipo: "universo-vazio",
        detalhe: `a porta lê ${k} e não leu nenhum — verde sobre zero não é verde`,
      });
  for (const v of AS_VIZINHAS) {
    const m = modulos[v.trava] ?? null;
    if (m === null)
      problemas.push({
        tipo: "universo-vazio",
        detalhe: `o git não carrega ${v.trava}, a trava da porta ${v.porta}`,
      });
    else if (!new RegExp(`\\bLAB-${v.desde}(?![0-9])`).test(m))
      problemas.push({
        tipo: "vizinha-sem-rodada",
        detalhe: `${v.trava} não nomeia o LAB-${v.desde} que a página lhe dá`,
      });
  }

  const linha =
    pagina === null
      ? null
      : (pagina.split("\n").find((l) => l.startsWith(A_LINHA)) ?? null);
  if (linha === null) {
    problemas.push({
      tipo: "linha-ausente",
      detalhe: `o ${A_PAGINA} não tem a linha que começa por "${A_LINHA}"`,
    });
  } else {
    const nomes = [
      O_PONTEIRO,
      `LAB-${ESTA_RODADA}`,
      ...AS_VIZINHAS.flatMap((v) => [v.trava, `LAB-${v.desde}`]),
    ];
    for (const n of nomes)
      if (!new RegExp(`${escapar(n)}(?![0-9])`).test(linha))
        problemas.push({
          tipo: "linha-nao-nomeia",
          detalhe: `a linha não nomeia ${n}`,
        });
    for (const f of FORMATOS_DE_DOCS)
      if (!linha.includes(`\`${f}\``))
        problemas.push({
          tipo: "linha-sem-formato",
          detalhe: `a linha não diz que docs/ carrega \`${f}\``,
        });
    if (linha.includes(A_FRASE_ANTIGA))
      problemas.push({
        tipo: "linha-afirmacao-antiga",
        detalhe:
          "a linha ainda diz, como em 14/09, só que o Lab não tem usuário nem exportação — sem dizer por onde se perguntou",
      });
  }

  const tabela = pagina === null ? null : aTabela(pagina);
  if (tabela === null) {
    problemas.push({
      tipo: "tabela-ausente",
      detalhe: `o ${A_PAGINA} não tem a seção "${A_SECAO}"`,
    });
  } else {
    for (const p of AS_PORTAS) {
      const escrito = tabela.get(p);
      const medido = r.achados.filter((a) => a.porta === p).length;
      if (escrito === undefined)
        problemas.push({
          tipo: "tabela-sem-porta",
          detalhe: `a tabela não tem a porta ${p}`,
        });
      else if (escrito !== medido)
        problemas.push({
          tipo: "tabela-numero-errado",
          detalhe: `${p}: a tabela escreve ${escrito} achados, a régua acha ${medido}`,
        });
    }
    for (const k of tabela.keys())
      if (!AS_PORTAS.includes(k as Porta))
        problemas.push({
          tipo: "tabela-com-outra",
          detalhe: `a tabela tem a porta ${k}, que não é desta régua`,
        });
  }
  return problemas;
}

/** A árvore de verdade. */
export function conferirAArvore(raiz: string): {
  resultado: Resultado;
  problemas: Problema[];
} {
  const resultado = medir(raiz);
  const ler = (c: string) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  };
  const carregados = new Set(arquivosQueOGitCarrega(raiz));
  const modulos = Object.fromEntries(
    AS_VIZINHAS.map((v) => [
      v.trava,
      carregados.has(v.trava) ? ler(v.trava) : null,
    ]),
  );
  return { resultado, problemas: conferir(resultado, ler(A_PAGINA), modulos) };
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o repositório É público: o código desta casa (a esteira, os adaptadores, as provas) está à vista de quem abrir o GitHub, de propósito (D141). A régua pergunta se ele vira PRODUTO entregue a alguém — pacote, release, página publicada, binário —, não se ele pode ser lido",
  "o código do produto da família copiado para cá é a porta `codigo-do-produto`, e quem a pergunta é a `o-motor-da-familia-nao-se-copia.ts` (LAB-146), só com os clones e só contra as pastas de motor que ela lista; o contrato copiado (D14) é tipo, não motor, e fica fora dela",
  "a permissão do `GITHUB_TOKEN` da rotina: o `verde.yml` não declara `permissions:`, e a padrão depende da configuração do repositório no GitHub, que não se lê daqui. A régua procura o PASSO que publica, não a permissão de publicar",
  "ação de publicar que a lista `ACOES_QUE_PUBLICAM` não conhece pelo nome, e comando de publicar escondido num script que a rotina chama: a régua lê a rotina, não o que ela executa",
  "publicar fora da árvore: ligar o GitHub Pages ou criar uma release no painel não deixa arquivo aqui (o *Proposto ao chat: ligar o GitHub Pages*, de 02/10, segue esperando o chat)",
  "um artefato compilado sem extensão conhecida e que não seja `.wasm`: a mágica de bytes só é perguntada para o `.wasm`, o único binário que esta casa produz",
  "o conteúdo de `docs/`: um `.json` ou um `.md` com código do produto dentro passa pela porta `docs`, que pergunta o FORMATO; o código do motor da família dentro deles é o LAB-146 que veria, e ele lê só arquivo de código",
  "os clones vizinhos: o que o Generate, o Laboratório de Parcelamento ou o Geo publicam é deles",
];
