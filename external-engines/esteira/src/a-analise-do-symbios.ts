/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A ANÁLISE DO SYMBIOS — a ficha perguntada à origem, a cópia perguntada byte a byte ao commit que ela diz ser, as
 *  dependências perguntadas ao registro delas e os módulos contados. (LAB-185, item 900, D413)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A `docs/SYMBIOS_ANALYSIS.md` (LAB-00, 09/09/2026) era a única página de análise de `docs/` sem leitor no código — o
 * LAB-171 e o LAB-172 perguntaram à origem as outras duas (a do PackingSolver e a do esqueleto reto), e o LAB-172 deixou
 * escrito: *"Das páginas de `docs/` sem leitor no código sobra a `SYMBIOS_ANALYSIS.md"*. Ela afirma, sem ninguém
 * perguntar:
 *
 *   - a **ficha** (§1): o repositório, a versão 0.4.1, o commit `c3f2875…` e a data dele, a licença MIT;
 *   - que a cópia em `upstream/` *"foi verificada arquivo a arquivo contra o `HEAD` do clone (`cmp` em todos os arquivos
 *     versionados): **idêntica**"* — o `cmp` do LAB-00, uma vez. A `upstream-intocavel.ts` (LAB-132) pergunta a cada
 *     verde que a cópia é a mesma **desde que entrou**, e diz no cabeçalho o que não cobra: *"que a cópia seja igual ao
 *     upstream DE VERDADE: isso pede a rede e o repositório de outra pessoa"*;
 *   - o **copyright** e a tabela das **dependências** (§2): versão e licença de cada uma, e *"mesmo autor"*;
 *   - a **arquitetura** (§3): *"Crate único (não é workspace), sem binários"*, *"`src/` tem 14 módulos"* e a lista deles.
 *
 * Medido em 18/10/2026 (`bun run lab185`, a prova em `docs/provas/LAB-185/symbios-na-origem.json`): **a ficha confere**
 * — o commit existe, com a data e o autor da página; o `Cargo.toml` dele diz 0.4.1 e MIT; o `LICENSE`, *"Copyright (c)
 * 2026 TheJanusStream"*. **A cópia é byte a byte o commit**: os 24 arquivos da árvore dele, com o mesmo objeto do `git`
 * (que é o resumo de cada byte) e o mesmo modo, e a cópia tem só um a mais, o `VERSION`, que é do Lab. As cinco
 * dependências, nas versões que os três `Cargo.lock` do Lab resolvem, têm no registro a licença da tabela, e a
 * `symbios-ground` foi publicada pelo mesmo autor do commit, com repositório na mesma conta. O `HEAD` de hoje da origem
 * **já não é** o commit da ficha — ela andou depois da análise, e a prova diz o de hoje, ao lado.
 *
 * **O achado estava aqui dentro:** *"`src/` tem 14 módulos"*, e a lista da própria página nomeia **13** — os 13
 * `pub mod` do `lib.rs`. O 14 é a conta de **arquivos** em `src/` (os 13 e o `lib.rs`). A página ganha a nota datada do
 * LAB-185; o texto do LAB-00 fica intocado (como no LAB-172).
 *
 * **Esta trava pergunta, a cada verde, sem clones e sem rede:**
 *
 *   1. a ficha da página contra a prova da origem e contra o `upstream/VERSION` — campo por campo; o campo que some é
 *      *sumido*, nunca acerto;
 *   2. a cópia: a árvore do `git` de `external-engines/symbios/upstream/` no `HEAD` contra a árvore do commit na prova —
 *      arquivo por arquivo, objeto e modo; arquivo a mais ou a menos acusa, e o único a mais permitido é o `VERSION`;
 *   3. o copyright e as licenças da §2 contra a prova; cada linha da tabela de dependências contra os três `Cargo.lock`
 *      (que têm de concordar), o `Cargo.toml` da cópia e a licença do registro, lida na prova;
 *   4. a §3: *"não é workspace, sem binários"* contra a prova; a lista de módulos contra os `pub mod` do `lib.rs` da
 *      cópia e da prova; e o número escrito — se não for o dos módulos, só passa com a nota do LAB-185 dizendo os dois
 *      números **lidos** (módulos e arquivos), nunca digitados;
 *   5. os lugares que repetem a ficha: a `TRIAGEM.md` (o commit curto, o dia e a licença), o `README.md` da raiz (a
 *      versão), a linha do `SEGURANCA.md` sobre a cópia (o commit inteiro e o nome desta trava) e o cabeçalho da
 *      `upstream-intocavel.ts` (que passa a apontar para cá o que não cobra).
 *
 * **O que ela não alcança, dito:** a origem **de hoje** (só a ferramenta, com rede); a linha *"Adapter: não escrito
 * (fase futura)"* da ficha, falsa desde o LAB-01 — é a proposta do LAB-152 ao chat (a página de cada motor dizer, pasta
 * por pasta, o que o `git` carrega), e fica para ela; o resto da página (§3.2 em diante: as saídas medidas, os números da
 * prova mínima, os riscos e o veredito), que é relato de execução e julgamento, de quem decide; e a licença das
 * dependências **das dependências** — a tabela diz as diretas, e só elas se perguntam.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const A_PAGINA = "docs/SYMBIOS_ANALYSIS.md";
export const A_PROVA = "docs/provas/LAB-185/symbios-na-origem.json";
export const A_COPIA = "external-engines/symbios/upstream";
export const O_VERSION = `${A_COPIA}/VERSION`;
export const O_CARGO_DA_COPIA = `${A_COPIA}/Cargo.toml`;
export const O_LIB_DA_COPIA = `${A_COPIA}/src/lib.rs`;
/** Os três projetos Rust do Lab que dependem do Symbios — os `Cargo.lock` deles dizem a versão resolvida de cada crate. */
export const OS_LOCKS = [
  "external-engines/symbios/archilly/probe/Cargo.lock",
  "external-engines/symbios/archilly/wasm-probe/Cargo.lock",
  "external-engines/symbios/archilly/wasm/Cargo.lock",
] as const;
/** O arquivo que o Lab acrescentou à cópia, e o único que pode estar nela sem estar no commit. */
export const DO_LAB = "VERSION";
export const A_TRAVA = "external-engines/esteira/src/a-analise-do-symbios.ts";

export const ORIGEM = "https://github.com/TheJanusStream/symbios-tensor";
export const COMMIT = "c3f287556b98cc616d4263d163e6643ae32111ff";

export interface LinhaDaArvore {
  modo: string;
  objeto: string;
  caminho: string;
}

export interface DependenciaNoRegistro {
  crate: string;
  /** A versão que a ferramenta pediu ao registro: a do `Cargo.lock` da ponte. */
  versao: string;
  licenca: string | null;
  publicadaPor: string | null;
  repositorio: string | null;
}

export interface ProvaNaOrigem {
  prompt: string;
  oQueIstoMede: string;
  quando: string;
  origem: string;
  commit: { pedido: string; existe: boolean; data: string | null; autor: string | null };
  versao: string | null;
  licencaNoCargo: string | null;
  /** A primeira linha do `LICENSE` e a linha do copyright. */
  licenca: { primeiraLinha: string; direitos: string | null } | null;
  workspace: boolean | null;
  binarios: boolean | null;
  /** Os `pub mod` do `src/lib.rs` do commit, na ordem dele. */
  modulos: string[] | null;
  arquivosEmSrc: number;
  /** `git ls-tree -r` do commit: modo, objeto e caminho de cada arquivo. */
  arvore: LinhaDaArvore[];
  dependencias: DependenciaNoRegistro[];
  headDeHoje: { sha: string; data: string };
}

export type TipoDeProblema =
  | "ficha-difere"
  | "ficha-sumida"
  | "version-difere"
  | "commit-nao-existe"
  | "copia-difere"
  | "falta-na-copia"
  | "sobra-na-copia"
  | "copia-vazia"
  | "licenca-difere"
  | "dependencia-difere"
  | "dependencia-sem-prova"
  | "locks-discordam"
  | "arquitetura-difere"
  | "modulos-diferem"
  | "numero-sem-nota"
  | "nota-errada"
  | "lugar-nao-diz";

export interface Problema {
  tipo: TipoDeProblema;
  onde: string;
  detalhe: string;
}

// ─── a leitura da página ────────────────────────────────────────────────────────────────────────────────────────

/** O texto entre `## N.` e o próximo `## `. */
export function secao(texto: string, n: number): string | null {
  const m = new RegExp(`^## ${n}\\. [^\\n]*\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m").exec(texto);
  return m ? m[1]! : null;
}

const campo = (bloco: string | null, nome: string): string | null => {
  if (bloco === null) return null;
  const m = new RegExp(`^${nome}:\\s+(.+)$`, "m").exec(bloco);
  return m ? m[1]!.trim() : null;
};

export interface LinhaDeDependencia {
  crates: string[];
  versao: string;
  licenca: string;
}

export interface Ficha {
  upstream: string | null;
  versao: string | null;
  commit: string | null;
  data: string | null;
  licenca: string | null;
  direitos: string | null;
  dependencias: LinhaDeDependencia[];
  naoEWorkspace: boolean;
  semBinarios: boolean;
  /** O número escrito em *"`src/` tem N módulos"*. */
  numeroDeModulos: number | null;
  /** Os nomes da lista *"Módulos: `tensor` (…), …"*. */
  modulos: string[];
  /** O parágrafo da nota do LAB-185, se houver. */
  nota: string | null;
}

export function lerAFicha(texto: string): Ficha {
  const s1 = secao(texto, 1);
  const bloco = s1 === null ? null : (/```text\n([\s\S]*?)```/.exec(s1)?.[1] ?? null);
  // Seção que falta é seção sumida: as linhas dela não existem, e cada conferência acusa o que não leu.
  const s2 = secao(texto, 2);
  const s3 = secao(texto, 3);
  const linhasDa2 = s2 === null ? [] : s2.split("\n");
  const dependencias: LinhaDeDependencia[] = [];
  for (const l of linhasDa2) {
    const celulas = l.split("|").map((c) => c.trim());
    if (celulas.length < 5 || !celulas[1]!.startsWith("`")) continue;
    dependencias.push({
      crates: [...celulas[1]!.matchAll(/`([^`]+)`/g)].map((m) => m[1]!),
      versao: celulas[2]!,
      licenca: celulas[3]!,
    });
  }
  const lista = s3 === null ? null : (/^Módulos:([\s\S]*?)(?:\n\n|(?![\s\S]))/m.exec(s3)?.[1] ?? null);
  const semParenteses = lista === null ? "" : lista.replace(/\([^)]*\)/g, "");
  const nota = /^> \*\*Medido contra a origem em [^\n]*LAB-185[\s\S]*?(?=\n\n|(?![\s\S]))/m.exec(texto)?.[0] ?? null;
  return {
    upstream: campo(bloco, "Upstream"),
    versao: campo(bloco, "Versão upstream"),
    commit: campo(bloco, "Commit"),
    data: campo(bloco, "Data do commit"),
    licenca: campo(bloco, "Licença"),
    direitos: s2 === null ? null : (/`(Copyright \(c\) [^`]+)`/.exec(s2)?.[1] ?? null),
    dependencias,
    naoEWorkspace: s3 !== null && /não é workspace/.test(s3),
    semBinarios: s3 !== null && /sem binários/.test(s3),
    numeroDeModulos: (() => {
      const m = s3 === null ? null : /`src\/` tem (\d+)\s+módulos/.exec(s3);
      return m ? Number(m[1]) : null;
    })(),
    modulos: [...semParenteses.matchAll(/`([^`]+)`/g)].map((m) => m[1]!),
    nota,
  };
}

/** Os `pub mod` de um `lib.rs`, na ordem. */
export const osModulos = (lib: string): string[] => [...lib.matchAll(/^pub mod (\w+);$/gm)].map((m) => m[1]!);

/** Um campo `Nome:   valor` do `VERSION`. */
export const doVersion = (version: string, nome: string): string | null =>
  new RegExp(`^${nome}:\\s+(.+)$`, "m").exec(version)?.[1]!.trim() ?? null;

// ─── 1 · a ficha contra a origem e contra o VERSION ─────────────────────────────────────────────────────────────

export function conferirAFicha(ficha: Ficha, prova: ProvaNaOrigem, version: string | null): Problema[] {
  const p: Problema[] = [];
  const onde = `${A_PAGINA} §1`;
  if (!prova.commit.existe) p.push({ tipo: "commit-nao-existe", onde: A_PROVA, detalhe: `${prova.commit.pedido} não está na origem` });
  const pares: [string, string | null, string | null][] = [
    ["Upstream", ficha.upstream, prova.origem],
    ["Versão upstream", ficha.versao, prova.versao],
    ["Commit", ficha.commit, prova.commit.pedido],
    ["Data do commit", ficha.data, prova.commit.data],
    ["Licença", ficha.licenca, prova.licencaNoCargo],
  ];
  for (const [nome, escrito, medido] of pares) {
    if (escrito === null) p.push({ tipo: "ficha-sumida", onde, detalhe: `o campo "${nome}" sumiu da ficha` });
    else if (escrito !== medido) p.push({ tipo: "ficha-difere", onde, detalhe: `${nome}: a página diz "${escrito}", a origem "${medido}"` });
  }
  if (version === null) {
    p.push({ tipo: "version-difere", onde: O_VERSION, detalhe: "o VERSION da cópia não foi lido" });
  } else {
    const doV: [string, string | null, string | null][] = [
      ["Upstream repo", doVersion(version, "Upstream repo"), prova.origem],
      ["Upstream version", doVersion(version, "Upstream version")?.split(" ")[0] ?? null, prova.versao],
      ["Commit", doVersion(version, "Commit"), prova.commit.pedido],
      ["Commit date", doVersion(version, "Commit date"), prova.commit.data],
      ["License", doVersion(version, "License")?.split(" ")[0] ?? null, prova.licencaNoCargo],
    ];
    for (const [nome, escrito, medido] of doV)
      if (escrito !== medido) p.push({ tipo: "version-difere", onde: O_VERSION, detalhe: `${nome}: o VERSION diz "${escrito}", a origem "${medido}"` });
  }
  return p;
}

// ─── 2 · a cópia, byte a byte, contra a árvore do commit ────────────────────────────────────────────────────────

/** Lê `git ls-tree -r` (já sem o prefixo da pasta). */
export function lerArvore(saida: string): LinhaDaArvore[] {
  return saida
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const [cabeca, caminho] = l.split("\t");
      const [modo, , objeto] = cabeca!.split(" ");
      return { modo: modo!, objeto: objeto!, caminho: caminho! };
    });
}

export function conferirACopia(copia: LinhaDaArvore[], prova: ProvaNaOrigem): Problema[] {
  const p: Problema[] = [];
  if (copia.length === 0 || prova.arvore.length === 0)
    return [{ tipo: "copia-vazia", onde: A_COPIA, detalhe: `a cópia tem ${copia.length} arquivos e a árvore da prova ${prova.arvore.length}` }];
  const naCopia = new Map(copia.map((l) => [l.caminho, l]));
  const naOrigem = new Map(prova.arvore.map((l) => [l.caminho, l]));
  for (const [caminho, o] of naOrigem) {
    const c = naCopia.get(caminho);
    if (c === undefined) p.push({ tipo: "falta-na-copia", onde: `${A_COPIA}/${caminho}`, detalhe: "está no commit e não na cópia" });
    else if (c.objeto !== o.objeto || c.modo !== o.modo)
      p.push({ tipo: "copia-difere", onde: `${A_COPIA}/${caminho}`, detalhe: `cópia ${c.modo} ${c.objeto}, commit ${o.modo} ${o.objeto}` });
  }
  for (const caminho of naCopia.keys())
    if (!naOrigem.has(caminho) && caminho !== DO_LAB)
      p.push({ tipo: "sobra-na-copia", onde: `${A_COPIA}/${caminho}`, detalhe: "está na cópia e não no commit — e não é o VERSION do Lab" });
  return p;
}

// ─── 3 · a licença e as dependências ────────────────────────────────────────────────────────────────────────────

/** A licença como o registro a escreve (`MIT OR Apache-2.0`), na forma da tabela (`MIT/Apache-2.0`). */
export const comoATabelaEscreve = (spdx: string): string => spdx.replace(/ OR /g, "/");

/** A versão resolvida de uma crate num `Cargo.lock`. */
export function noLock(lock: string, crate: string): string | null {
  const m = new RegExp(`^name = "${crate.replace(/[-_]/g, "[-_]")}"\\nversion = "([^"]+)"`, "m").exec(lock);
  return m ? m[1]! : null;
}

/** A exigência de uma crate no `[dependencies]` do `Cargo.toml` (`"0.9"` ou `{ version = "0.32", … }`). */
export function noCargo(cargo: string, crate: string): string | null {
  const deps = /^\[dependencies\]\n([\s\S]*?)(?=^\[|(?![\s\S]))/m.exec(cargo)?.[1] ?? "";
  const m = new RegExp(`^${crate} = (?:"([^"]+)"|\\{[^}]*version = "([^"]+)")`, "m").exec(deps);
  return m ? (m[1] ?? m[2])! : null;
}

/** `a` é prefixo de `b` por componente (`0.9` de `0.9.5`, e não `0.4` de `0.41`). */
export const prefixo = (a: string, b: string): boolean => {
  const x = a.split(".");
  const y = b.split(".");
  return x.length <= y.length && x.every((c, i) => c === y[i]);
};

export function conferirAsDependencias(
  ficha: Ficha,
  prova: ProvaNaOrigem,
  locks: Record<string, string | null>,
  cargo: string | null,
): Problema[] {
  const p: Problema[] = [];
  const onde = `${A_PAGINA} §2`;
  if (ficha.direitos === null) p.push({ tipo: "ficha-sumida", onde, detalhe: "o copyright sumiu da §2" });
  else if (ficha.direitos !== prova.licenca?.direitos)
    p.push({ tipo: "licenca-difere", onde, detalhe: `a página diz "${ficha.direitos}", o LICENSE "${prova.licenca?.direitos ?? null}"` });
  if (prova.licenca?.primeiraLinha !== `${prova.licencaNoCargo} License`)
    p.push({ tipo: "licenca-difere", onde: A_PROVA, detalhe: `o LICENSE abre com "${prova.licenca?.primeiraLinha ?? null}" e o Cargo.toml diz ${prova.licencaNoCargo}` });
  if (ficha.dependencias.length === 0) p.push({ tipo: "ficha-sumida", onde, detalhe: "a tabela de dependências sumiu" });
  const autor = prova.commit.autor;
  const conta = /github\.com\/([^/]+)\//.exec(prova.origem)?.[1] ?? null;
  for (const linha of ficha.dependencias) {
    for (const crate of linha.crates) {
      const versoes = OS_LOCKS.map((l) => (locks[l] ? noLock(locks[l]!, crate) : null));
      const resolvida = versoes[0] ?? null;
      if (versoes.some((v) => v !== resolvida) || resolvida === null) {
        p.push({ tipo: "locks-discordam", onde: crate, detalhe: `os três Cargo.lock dizem ${versoes.join(", ")}` });
        continue;
      }
      const exigida = cargo === null ? null : noCargo(cargo, crate);
      if (exigida === null || !prefixo(exigida, resolvida))
        p.push({ tipo: "dependencia-difere", onde: `${O_CARGO_DA_COPIA}`, detalhe: `${crate}: o Cargo.toml exige "${exigida}" e o lock resolve ${resolvida}` });
      if (!prefixo(linha.versao, resolvida))
        p.push({ tipo: "dependencia-difere", onde, detalhe: `${crate}: a tabela diz ${linha.versao}, o lock resolve ${resolvida}` });
      const reg = prova.dependencias.find((d) => d.crate === crate);
      if (reg === undefined || reg.versao !== resolvida || reg.licenca === null) {
        p.push({ tipo: "dependencia-sem-prova", onde: A_PROVA, detalhe: `${crate} ${resolvida} não está na prova com a licença` });
        continue;
      }
      const mesmoAutor = /\(mesmo autor\)/.test(linha.licenca);
      const licencaDaTabela = linha.licenca.replace(/\s*\(mesmo autor\)/, "").trim();
      if (licencaDaTabela !== comoATabelaEscreve(reg.licenca))
        p.push({ tipo: "dependencia-difere", onde, detalhe: `${crate}: a tabela diz ${licencaDaTabela}, o registro "${reg.licenca}"` });
      if (mesmoAutor && (reg.publicadaPor !== autor || conta === null || !(reg.repositorio ?? "").includes(`github.com/${conta}/`)))
        p.push({ tipo: "dependencia-difere", onde, detalhe: `${crate}: "mesmo autor", e o registro diz ${reg.publicadaPor} em ${reg.repositorio} (o commit é de ${autor})` });
    }
  }
  return p;
}

// ─── 4 · a arquitetura e os módulos ─────────────────────────────────────────────────────────────────────────────

export function conferirOsModulos(ficha: Ficha, prova: ProvaNaOrigem, libDaCopia: string | null): Problema[] {
  const p: Problema[] = [];
  const onde = `${A_PAGINA} §3`;
  if (!ficha.naoEWorkspace || !ficha.semBinarios) p.push({ tipo: "ficha-sumida", onde, detalhe: "a frase \"não é workspace, sem binários\" sumiu" });
  if (prova.workspace !== false || prova.binarios !== false)
    p.push({ tipo: "arquitetura-difere", onde, detalhe: `a origem diz workspace ${prova.workspace}, binários ${prova.binarios}` });
  const daOrigem = prova.modulos ?? [];
  const daCopia = libDaCopia === null ? [] : osModulos(libDaCopia);
  const ordenar = (l: string[]): string => [...l].sort().join(",");
  if (daOrigem.length === 0 || ordenar(daOrigem) !== ordenar(daCopia))
    p.push({ tipo: "modulos-diferem", onde: O_LIB_DA_COPIA, detalhe: `origem [${daOrigem.join(", ")}], cópia [${daCopia.join(", ")}]` });
  if (ordenar(ficha.modulos) !== ordenar(daOrigem))
    p.push({ tipo: "modulos-diferem", onde, detalhe: `a lista da página [${ficha.modulos.join(", ")}], o lib.rs [${daOrigem.join(", ")}]` });
  if (ficha.numeroDeModulos === null) p.push({ tipo: "ficha-sumida", onde, detalhe: "o número de módulos sumiu" });
  else if (ficha.numeroDeModulos !== daOrigem.length) {
    if (ficha.nota === null)
      p.push({ tipo: "numero-sem-nota", onde, detalhe: `a página diz ${ficha.numeroDeModulos} módulos, o lib.rs declara ${daOrigem.length}, e não há a nota do LAB-185` });
    else {
      const nota = ficha.nota.replace(/\n> /g, " ");
      for (const dito of [`${daOrigem.length} \`pub mod\``, `${prova.arquivosEmSrc} arquivos`])
        if (!nota.includes(dito)) p.push({ tipo: "nota-errada", onde: `${A_PAGINA} (nota do LAB-185)`, detalhe: `a nota não diz "${dito}"` });
    }
  }
  if (ficha.nota !== null && !ficha.nota.replace(/\n> /g, " ").includes(A_TRAVA))
    p.push({ tipo: "nota-errada", onde: `${A_PAGINA} (nota do LAB-185)`, detalhe: `a nota não nomeia ${A_TRAVA}` });
  return p;
}

// ─── 5 · os lugares que repetem a ficha ─────────────────────────────────────────────────────────────────────────

export interface Lugar {
  caminho: string;
  diz: string[];
}

/** O que cada lugar tem de dizer, derivado da ficha (nunca digitado). */
export function oQueCadaLugarDiz(ficha: Ficha): Lugar[] {
  const curto = (ficha.commit ?? "?").slice(0, 7);
  const dia = (ficha.data ?? "?").split(" ")[0]!;
  return [
    { caminho: "docs/TRIAGEM.md", diz: [`\`${curto}\` (${dia}) · **${ficha.licenca ?? "?"}**`] },
    { caminho: "README.md", diz: [`symbios-tensor ${ficha.versao ?? "?"}, INTOCADO`] },
    { caminho: "docs/SEGURANCA.md", diz: [`contra \`${ficha.commit ?? "?"}\``, A_TRAVA.replace("external-engines/esteira/", "")] },
    { caminho: "external-engines/esteira/src/upstream-intocavel.ts", diz: ["a-analise-do-symbios.ts"] },
  ];
}

export function conferirOsLugares(ficha: Ficha, ler: (c: string) => string | null): Problema[] {
  const p: Problema[] = [];
  for (const l of oQueCadaLugarDiz(ficha)) {
    const texto = ler(l.caminho);
    for (const frase of l.diz)
      if (texto === null || !texto.includes(frase)) p.push({ tipo: "lugar-nao-diz", onde: l.caminho, detalhe: `não diz "${frase}"` });
  }
  return p;
}

// ─── tudo junto ─────────────────────────────────────────────────────────────────────────────────────────────────

export interface Resultado {
  ficha: Ficha;
  prova: ProvaNaOrigem;
  copia: LinhaDaArvore[];
  problemas: Problema[];
}

export function conferirAAnalise(raiz: string): Resultado {
  const ler = (c: string): string | null => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  };
  const pagina = ler(A_PAGINA);
  const textoDaProva = ler(A_PROVA);
  // Sem a página ou sem a prova não há o que conferir — e conferir o vazio passaria (D23): falha, dizendo qual.
  if (pagina === null || textoDaProva === null) throw new Error(`faltou ${pagina === null ? A_PAGINA : A_PROVA}`);
  const ficha = lerAFicha(pagina);
  const prova = JSON.parse(textoDaProva) as ProvaNaOrigem;
  const saida = execFileSync("git", ["ls-tree", "-r", "HEAD", `${A_COPIA}/`], { cwd: raiz, encoding: "utf8" });
  const copia = lerArvore(saida.replaceAll(`\t${A_COPIA}/`, "\t"));
  const locks = Object.fromEntries(OS_LOCKS.map((l) => [l, ler(l)]));
  const problemas = [
    ...conferirAFicha(ficha, prova, ler(O_VERSION)),
    ...conferirACopia(copia, prova),
    ...conferirAsDependencias(ficha, prova, locks, ler(O_CARGO_DA_COPIA)),
    ...conferirOsModulos(ficha, prova, ler(O_LIB_DA_COPIA)),
    ...conferirOsLugares(ficha, ler),
  ];
  return { ficha, prova, copia, problemas };
}
