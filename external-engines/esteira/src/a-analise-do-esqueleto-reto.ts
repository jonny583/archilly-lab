/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A ANÁLISE DO ESQUELETO RETO — as duas fichas perguntadas à origem, as saídas que a página cita perguntadas ao
 *  arquivo que ela aponta, os lugares que repetem a ficha e a pasta. (LAB-172, item 900, D400)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A `docs/STRAIGHT_SKELETON_ANALYSIS.md` (LAB-00, 09/09/2026) tem leitor no código — o `esqueleto.ts` e o oráculo do
 * LAB-04 citam a §4.4 —, mas ninguém lia a **ficha** dela: dois repositórios de fora (commit, data, versão, licença do
 * invólucro, licença efetiva, as versões que o `install_libraries.sh` fixa, as opções de compilação, o tamanho do
 * `main.js`, o `Cargo.toml`) que seis lugares desta casa repetem. O LAB-171 deixou isso dito: *"a ficha dela não foi
 * reconferida nesta rodada"*.
 *
 * Medido em 18/10/2026 (`bun run lab172`, a prova em `docs/provas/LAB-172/esqueleto-reto-na-origem.json`): **as duas
 * fichas conferem** — os dois commits existem, com a data da página; as versões, as licenças (MIT no invólucro do A,
 * `GPL (v3 or later)` no `license.txt` do pacote da CGAL 5.6, `GPL-2.0-or-later` no `Cargo.toml` do B), as quatro
 * bibliotecas, as duas opções de compilação, os 1 053 613 bytes do `main.js`, o `no_std`, o `forbid`, a faixa
 * `-16384..=16383` e as funções que a página nomeia. O `HEAD` de hoje das duas origens **ainda é** o commit da ficha.
 *
 * **E o achado não estava na origem, estava aqui dentro:** a página diz *"Saída completa em `outputs/…`"* e cita, das
 * duas provas mínimas, quatro tempos (11,378 ms e 3,490 ms do CGAL; 14,551 µs e 8,82 µs do Rust) que **não estão** nos
 * dois arquivos que ela aponta — eles trazem 12,487 ms, 3,366 ms, 13,709 µs e 6,319 µs. Nasceram no mesmo commit
 * (`f61be91`): a página citou uma execução e guardou outra. A **geometria** é a mesma nas duas (os nós, as faces, a
 * frente de onda em 5), e é a geometria que o oráculo do LAB-04 usa — então o oráculo está de pé; o que muda é o
 * relato: o *"~400×"* da §4.5 vale para o L daquela execução (3,5 ms ÷ 8,8 µs) e não para o retângulo (≈ 780×), e nos
 * arquivos guardados dá ≈ 910× e ≈ 530×. A página ganha a nota datada; o texto do LAB-00 fica intocado.
 *
 * **Esta trava pergunta, a cada verde, sem clones e sem rede:**
 *
 *   1. as duas fichas da página contra a prova medida na origem — campo por campo; o campo que some é *sumido*, nunca
 *      acerto;
 *   2. as saídas: toda linha de geometria que a página cita está no arquivo de `outputs/` que ela aponta; todo tempo
 *      citado que o arquivo não tem só passa se a nota do LAB-172 existir e trouxer os tempos **do arquivo** (lidos dele,
 *      nunca digitados); e o `esperado` do oráculo do LAB-04 está nas duas saídas guardadas;
 *   3. os seis lugares que repetem a ficha, com a frase derivada dela;
 *   4. a pasta `external-engines/straight-skeleton/` tem só os seis arquivos próprios (os três `README.md` e as duas
 *      sondas) — nada de fora.
 *
 * **O que ela não alcança, dito:** a origem **de hoje** (só a ferramenta, com rede); a licença do GMP e do MPFR, que
 * moram nos pacotes que o script baixa e não no repositório (a página as cita como LGPL, e nada aqui confere); o que o
 * código de fora **faz** (nada foi compilado nem executado nesta rodada — os tempos e a geometria são os da execução do
 * LAB-00, guardados em `outputs/`); e o **julgamento** da análise (*"inviabiliza o uso comercial"*, *"reimplementar"*),
 * que é argumento, não número — e que é de quem decide, não desta casa.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const A_PAGINA = "docs/STRAIGHT_SKELETON_ANALYSIS.md";
export const A_PROVA = "docs/provas/LAB-172/esqueleto-reto-na-origem.json";
export const O_ORACULO = "docs/provas/LAB-04/oraculo.json";
export const SAIDA_CGAL = "outputs/straight_skeleton_cgal_wasm.txt";
export const SAIDA_RUST = "outputs/straight_skeleton_rust.txt";
export const REGISTRO = "external-engines/esteira/dados/registro-de-motores.json";

export const ORIGEM_A = "https://github.com/StrandedKitty/straight-skeleton";
export const COMMIT_A = "d68f08ad2da5eea7f58d451a94068d39cd2b3796";
export const ORIGEM_B = "https://github.com/lizelive/straight-skeleton";
export const COMMIT_B = "7ca4b0f563e9d8bb9cc306dd81192a51a4243286";
export const ORIGEM_CGAL = "https://github.com/CGAL/cgal";
export const LICENCA_DA_CGAL = "Straight_skeleton_2/package_info/Straight_skeleton_2/license.txt";

/** Os dois `#include` que a §3.1 cita. */
export const INCLUDES = [
  "CGAL/create_straight_skeleton_from_polygon_with_holes_2.h",
  "CGAL/Straight_skeleton_2/IO/print.h",
] as const;
/** As quatro bibliotecas do `install_libraries.sh`, como a variável dele se chama. */
export const BIBLIOTECAS = ["CGAL", "BOOST", "GMP", "MPFR"] as const;
export const OPCOES_DE_COMPILACAO = ["SINGLE_FILE", "ENVIRONMENT='web'"] as const;
/** O que a §4.2 nomeia do candidato B, e a forma que a ferramenta procura no código dele. */
export const NOMES_DO_B = {
  skeleton_constrained: "pub fn skeleton_constrained(",
  "residual()": "pub fn residual(",
  "arc.sources": "pub sources:",
  "RoofError::UnevenLimits": "UnevenLimits {",
  "-16384..=16383": "-16384..=16383",
} as const;

export interface CommitNaOrigem {
  pedido: string;
  existe: boolean;
  data: string | null;
  autor: string | null;
}

export interface ProvaNaOrigem {
  prompt: string;
  oQueIstoMede: string;
  quando: string;
  candidatoA: {
    origem: string;
    commit: CommitNaOrigem;
    versao: string | null;
    licenca: { primeiraLinha: string; direitos: string | null } | null;
    /** `null` quando o `main.cpp` não foi lido — nunca `false`, que pareceria medido (D23). */
    includes: Record<string, boolean | null>;
    bibliotecas: Record<string, string | null>;
    opcoesDeCompilacao: Record<string, boolean | null>;
    bytesDoMainJs: number | null;
    devolveNull: boolean | null;
    headDeHoje: { sha: string; data: string };
  };
  cgal: { origem: string; tag: string; arquivo: string; texto: string | null };
  candidatoB: {
    origem: string;
    commit: CommitNaOrigem;
    versao: string | null;
    licencaNoCargo: string | null;
    primeiraLinhaDoLicense: string | null;
    unsafeForbid: boolean | null;
    noStd: boolean | null;
    designMd: boolean;
    nomes: Record<string, boolean | null>;
    headDeHoje: { sha: string; data: string };
  };
}

// ─── 1 · a ficha ────────────────────────────────────────────────────────────────────────────────────────────────

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

export interface FichaDeUmCandidato {
  repositorio: string | null;
  versao: string | null;
  commit: string | null;
  /** O dia entre parênteses depois do commit. */
  dia: string | null;
}

export interface Ficha {
  a: FichaDeUmCandidato & {
    /** `MIT`, a palavra antes do parêntese. */
    licencaDoInvolucro: string | null;
    /** `2021-2023 StrandedKitty`, o que vem depois de `Copyright`. */
    direitos: string | null;
    licencaEfetiva: string | null;
    includes: string[];
    bibliotecas: Record<string, string>;
    opcoes: string[];
    /** `1,05`, o número antes de `MB`. */
    megabytes: string | null;
    /** A frase da §3.3: *"Erro: retorna `null`"*. */
    devolveNull: boolean;
    /** A URL e a frase que a §3.1 cita do `license.txt` da CGAL. */
    tagDaCgal: string | null;
    textoDaLicencaDaCgal: string | null;
  };
  b: FichaDeUmCandidato & {
    licenca: string | null;
    noStd: boolean;
    unsafeForbid: boolean;
    designMd: boolean;
    nomes: string[];
  };
  veredito: string | null;
}

const umCandidato = (bloco: string | null): FichaDeUmCandidato => {
  const commit = campo(bloco, "Commit");
  const m = commit === null ? null : /^([0-9a-f]{40})\s+\((\d{4}-\d{2}-\d{2})\)/.exec(commit);
  return {
    repositorio: campo(bloco, "Repositório"),
    versao: campo(bloco, "Versão"),
    commit: m ? m[1]! : null,
    dia: m ? m[2]! : null,
  };
};

export function lerAFicha(texto: string): Ficha {
  const s3 = secao(texto, 3);
  const s4 = secao(texto, 4);
  const plano3 = (s3 ?? "").replace(/\s+/g, " ");
  const plano4 = (s4 ?? "").replace(/\s+/g, " ");
  const invol = campo(s3, "Licença do invólucro");
  const bibliotecas: Record<string, string> = {};
  const cgal = /`CGAL (\d+(?:\.\d+)+)`, fixada em `src\/core\/install_libraries\.sh`/.exec(plano3);
  if (cgal) bibliotecas.CGAL = cgal[1]!;
  for (const [nome, chave] of [
    ["GMP", "GMP"],
    ["MPFR", "MPFR"],
    ["Boost", "BOOST"],
  ] as const) {
    const m = new RegExp(`\\*\\*${nome} (\\d+(?:\\.\\d+)+)\\*\\*|${nome} (\\d+(?:\\.\\d+)+)`).exec(plano3);
    if (m) bibliotecas[chave] = (m[1] ?? m[2])!;
  }
  const url = /raw\.githubusercontent\.com\/CGAL\/cgal\/(v[\d.]+)\/(\S+)\s+→ "([^"]+)"/.exec(s3 ?? "");
  const mb = /\(`src\/core\/build\/main\.js`, (\d+,\d+) MB/.exec(plano3);
  const veredito = /\*\*Ambos os repositórios: ([^*]+?)\.\*\*/.exec(texto);
  return {
    a: {
      ...umCandidato(s3),
      licencaDoInvolucro: invol === null ? null : invol.split("(")[0]!.trim(),
      direitos: invol === null ? null : (/Copyright\s+([^)]+)\)/.exec(invol)?.[1]!.trim() ?? null),
      licencaEfetiva: campo(s3, "Licença efetiva")?.replace(/\s*←.*$/, "").trim() ?? null,
      includes: INCLUDES.filter((i) => (s3 ?? "").includes(`#include <${i}>`)),
      bibliotecas,
      opcoes: OPCOES_DE_COMPILACAO.filter((o) => plano3.includes(`-s ${o}`)),
      megabytes: mb ? mb[1]! : null,
      devolveNull: /\*\*Erro:\*\* retorna `null`/.test(plano3),
      tagDaCgal: url && url[2] === LICENCA_DA_CGAL ? url[1]! : null,
      textoDaLicencaDaCgal: url ? url[3]! : null,
    },
    b: {
      ...umCandidato(s4),
      licenca: campo(s4, "Licença")?.replace(/\s*←.*$/, "").trim() ?? null,
      noStd: plano4.includes("`no_std`"),
      unsafeForbid: plano4.includes('`unsafe_code = "forbid"`'),
      designMd: plano4.includes("`docs/DESIGN.md`"),
      // `RoofError::UnevenLimits` é citado na §6, e não na §4: os nomes se leem na página inteira.
      nomes: Object.keys(NOMES_DO_B).filter((n) => texto.includes("`" + n)),
    },
    veredito: veredito ? veredito[1]!.trim() : null,
  };
}

export type TipoDeProblema =
  | "campo-que-sumiu"
  | "ficha-contra-a-origem"
  | "geometria-que-a-saida-nao-tem"
  | "tempo-que-a-saida-nao-tem"
  | "oraculo-que-a-saida-nao-tem"
  | "lugar-que-diverge"
  | "pasta-com-arquivo-a-mais";

export interface Problema {
  tipo: TipoDeProblema;
  onde: string;
  detalhe: string;
}

/** `1053613` bytes → `1,05`, como a página escreve megabyte. */
export const emMegabytes = (bytes: number): string => (bytes / 1e6).toFixed(2).replace(".", ",");

export function conferirContraAOrigem(f: Ficha, p: ProvaNaOrigem): Problema[] {
  const out: Problema[] = [];
  const falta = (c: string) => out.push({ tipo: "campo-que-sumiu", onde: A_PAGINA, detalhe: c });
  const diverge = (c: string, pagina: unknown, origem: unknown) =>
    out.push({
      tipo: "ficha-contra-a-origem",
      onde: A_PAGINA,
      detalhe: `${c}: a página diz ${JSON.stringify(pagina)}, a origem ${JSON.stringify(origem)}`,
    });
  const umLado = (rotulo: string, c: FichaDeUmCandidato, origem: string, commit: CommitNaOrigem, versao: string | null) => {
    for (const [k, v] of Object.entries(c)) if (v === null) falta(`${rotulo} ${k}`);
    if (c.repositorio !== null && c.repositorio !== origem) diverge(`${rotulo} repositório`, c.repositorio, origem);
    if (c.commit !== null && (c.commit !== commit.pedido || !commit.existe)) diverge(`${rotulo} commit`, c.commit, commit);
    if (c.dia !== null && c.dia !== (commit.data ?? "").slice(0, 10)) diverge(`${rotulo} data`, c.dia, commit.data);
    if (c.versao !== null && c.versao !== versao) diverge(`${rotulo} versão`, c.versao, versao);
  };

  // O candidato A.
  const A = p.candidatoA;
  umLado("A", f.a, A.origem, A.commit, A.versao);
  if (f.a.licencaDoInvolucro === null) falta("A licença do invólucro");
  else if (A.licenca === null || A.licenca.primeiraLinha !== `${f.a.licencaDoInvolucro} License`)
    diverge("A licença do invólucro", f.a.licencaDoInvolucro, A.licenca?.primeiraLinha ?? null);
  if (f.a.direitos === null) falta("A direitos");
  else if ((A.licenca?.direitos ?? "").replace(/^Copyright\s+(\(c\)\s+)?/, "") !== f.a.direitos)
    diverge("A direitos", f.a.direitos, A.licenca?.direitos ?? null);
  for (const i of INCLUDES) {
    if (!f.a.includes.includes(i)) falta(`A #include ${i}`);
    else if (A.includes[i] !== true) diverge(`A #include ${i}`, "existe", A.includes[i] ?? null);
  }
  for (const b of BIBLIOTECAS) {
    const pag = f.a.bibliotecas[b];
    const ori = A.bibliotecas[b] ?? null;
    if (pag === undefined) falta(`A ${b}`);
    // A página escreve `Boost 1.81` e o script `1.81.0`: a versão da página é prefixo, ponto a ponto.
    else if (ori === null || !(ori === pag || ori.startsWith(`${pag}.`))) diverge(`A ${b}`, pag, ori);
  }
  for (const o of OPCOES_DE_COMPILACAO) {
    if (!f.a.opcoes.includes(o)) falta(`A -s ${o}`);
    else if (A.opcoesDeCompilacao[o] !== true) diverge(`A -s ${o}`, "existe", A.opcoesDeCompilacao[o] ?? null);
  }
  if (f.a.megabytes === null) falta("A tamanho do main.js");
  else if (A.bytesDoMainJs === null || emMegabytes(A.bytesDoMainJs) !== f.a.megabytes)
    diverge("A tamanho do main.js", `${f.a.megabytes} MB`, A.bytesDoMainJs);
  if (!f.a.devolveNull) falta("A erro devolve null");
  else if (A.devolveNull !== true) diverge("A erro devolve null", true, A.devolveNull);

  // A CGAL: a tag tem de ser a versão que o script fixa, e o texto, o do arquivo.
  if (f.a.tagDaCgal === null || f.a.textoDaLicencaDaCgal === null) falta("CGAL license.txt");
  else {
    if (f.a.tagDaCgal !== p.cgal.tag) diverge("CGAL tag", f.a.tagDaCgal, p.cgal.tag);
    if (`v${A.bibliotecas.CGAL ?? "?"}` !== f.a.tagDaCgal) diverge("CGAL tag contra o script", f.a.tagDaCgal, A.bibliotecas.CGAL ?? null);
    if (f.a.textoDaLicencaDaCgal !== p.cgal.texto) diverge("CGAL licença", f.a.textoDaLicencaDaCgal, p.cgal.texto);
  }
  if (f.a.licencaEfetiva === null) falta("A licença efetiva");
  else if (!/^GPL v3 ou posterior$/.test(f.a.licencaEfetiva) || p.cgal.texto !== "GPL (v3 or later)")
    diverge("A licença efetiva", f.a.licencaEfetiva, p.cgal.texto);

  // O candidato B.
  const B = p.candidatoB;
  umLado("B", f.b, B.origem, B.commit, B.versao);
  if (f.b.licenca === null) falta("B licença");
  else if (f.b.licenca !== B.licencaNoCargo) diverge("B licença", f.b.licenca, B.licencaNoCargo);
  // *"o `LICENSE` é a GPLv2 completa"*: a primeira linha dele, e a versão.
  if (f.b.licenca !== null && !/^GNU GENERAL PUBLIC LICENSE Version 2,/.test(B.primeiraLinhaDoLicense ?? ""))
    diverge("B LICENSE", "a GPLv2 completa", B.primeiraLinhaDoLicense);
  for (const [nome, naPagina, naOrigem] of [
    ["B no_std", f.b.noStd, B.noStd],
    ["B unsafe_code forbid", f.b.unsafeForbid, B.unsafeForbid],
    ["B docs/DESIGN.md", f.b.designMd, B.designMd],
  ] as const) {
    if (!naPagina) falta(nome);
    else if (naOrigem !== true) diverge(nome, "existe", naOrigem);
  }
  for (const n of Object.keys(NOMES_DO_B)) {
    if (!f.b.nomes.includes(n)) falta(`B ${n}`);
    else if (B.nomes[n] !== true) diverge(`B ${n}`, "existe", B.nomes[n] ?? null);
  }
  if (f.veredito === null) falta("veredito");
  return out;
}

// ─── 2 · as saídas que a página cita, contra o arquivo que ela aponta ─────────────────────────────────────────

/** Os blocos ```text``` de uma subseção, de `### a` até `### b`, juntos. */
const blocosDeTexto = (texto: string, a: string, b: string): string => {
  const i = texto.indexOf(`### ${a}`);
  const j = texto.indexOf(`### ${b}`);
  if (i < 0 || j < i) return "";
  return [...texto.slice(i, j).matchAll(/```text\n([\s\S]*?)```/g)].map((m) => m[1]!).join("\n");
};
const semEspaco = (t: string): string => t.replace(/\s+/g, "");

/** Os tempos de um texto — `11.378 ms`, `14.551µs` —, como estão escritos. */
export const tempos = (t: string): string[] => [...t.matchAll(/(\d+\.\d+) ?(ms|µs)/g)].map((m) => m[0]);

/** O que a página cita das duas saídas: a geometria (comparada sem espaço) e os tempos. */
export function oQueAPaginaCita(texto: string): { arquivo: string; geometria: string[]; tempos: string[] }[] {
  const cgal = blocosDeTexto(texto, "3.2", "3.3");
  const rust = blocosDeTexto(texto, "4.3", "4.4");
  const geoCgal = [
    ...[...cgal.matchAll(/\d+: \[\d+, \d+, \d+\]/g)].map((m) => m[0]),
    // `polygons: [0,4,3] [1,5,4,0]` — cada face, sem o índice que a saída põe na frente.
    ...[...cgal.matchAll(/polygons: ((?:\[[\d,]+\]\s*)+)/g)].flatMap((m) => [...m[1]!.matchAll(/\[[\d,]+\]/g)].map((x) => x[0])),
  ];
  const geoRust = [
    ...[...rust.matchAll(/nós=\d+ arcos=\d+/g)].map((m) => m[0]),
    ...[...rust.matchAll(/nó \d+: pos=\(\d+,\d+\) offset=[\d.]+ boundary=(?:true|false)/g)].map((m) => m[0]),
    // `nó 6: (45,15) nó 7: (15,15)` — a forma curta; na saída é `nó 6: pos=(45,15)`.
    ...[...rust.matchAll(/nó (\d+): \((\d+,\d+)\)/g)].map((m) => `nó ${m[1]}: pos=(${m[2]})`),
    ...[...rust.matchAll(/arco \d+: sources=\[[^\]]+\]/g)].map((m) => m[0]),
    ...[...rust.matchAll(/residual \d+: \[[^\]]+\]/g)].map((m) => m[0]),
    ...[...rust.matchAll(/16000x8000 aceito; skeleton: Ok\(\d+\)/g)].map((m) => m[0]),
  ];
  return [
    { arquivo: SAIDA_CGAL, geometria: geoCgal, tempos: tempos(cgal) },
    { arquivo: SAIDA_RUST, geometria: geoRust, tempos: tempos(rust) },
  ];
}

/** A nota datada do LAB-172 na página — o parágrafo que diz que os tempos citados não são os do arquivo. */
export const notaDoLab172 = (texto: string): string | null => {
  // O fim é a linha em branco ou o fim do texto — `$` com a bandeira `m` seria o fim da PRIMEIRA linha.
  const m = /^> \*\*Medido contra a origem em 18\/10\/2026 \(LAB-172[\s\S]*?(?=\n\n|(?![\s\S]))/m.exec(texto);
  return m ? m[0].replace(/\n> ?/g, " ").replace(/\s+/g, " ") : null;
};

export function conferirAsSaidas(texto: string, ler: (c: string) => string | null): Problema[] {
  const out: Problema[] = [];
  const nota = notaDoLab172(texto);
  for (const { arquivo, geometria, tempos: citados } of oQueAPaginaCita(texto)) {
    const saida = ler(arquivo);
    if (saida === null) {
      out.push({ tipo: "geometria-que-a-saida-nao-tem", onde: arquivo, detalhe: "a página aponta o arquivo, e ele não existe" });
      continue;
    }
    if (geometria.length === 0)
      out.push({ tipo: "campo-que-sumiu", onde: A_PAGINA, detalhe: `nenhuma linha de geometria citada de ${arquivo}` });
    // A face, na saída, vem com o índice na frente (`0: [0, 4, 3]`); sem espaço, o `[0,4,3]` está dentro.
    const corrido = semEspaco(saida);
    for (const g of geometria)
      if (!corrido.includes(semEspaco(g)))
        out.push({ tipo: "geometria-que-a-saida-nao-tem", onde: A_PAGINA, detalhe: `${JSON.stringify(g)} não está em ${arquivo}` });
    // Tempo é medição de uma execução: o citado que o arquivo não tem só passa se a nota disser os do arquivo.
    const daSaida = tempos(saida);
    const faltam = citados.filter((t) => !daSaida.includes(t));
    if (faltam.length === 0) continue;
    if (nota === null) {
      out.push({
        tipo: "tempo-que-a-saida-nao-tem",
        onde: A_PAGINA,
        detalhe: `${faltam.join(", ")} citados, e ${arquivo} traz ${daSaida.join(", ")} — sem a nota que diz isso`,
      });
      continue;
    }
    for (const t of [...faltam, ...daSaida])
      if (!nota.includes(t))
        out.push({
          tipo: "tempo-que-a-saida-nao-tem",
          onde: A_PAGINA,
          detalhe: `a nota do LAB-172 não cita ${JSON.stringify(t)} (${daSaida.includes(t) ? "do arquivo" : "da página"} ${arquivo})`,
        });
  }
  return out;
}

interface Oraculo {
  esperado: Record<string, { nos: [number, number][]; offset_m: number; frenteEm5: [number, number][] }>;
}

/** O pedaço de uma saída que é de um caso: do cabeçalho dele até o próximo `---`. */
const pedaco = (saida: string, cabecalho: RegExp): string | null => {
  const i = saida.search(cabecalho);
  if (i < 0) return null;
  const resto = saida.slice(i + 3);
  const fim = resto.search(/\n--- /);
  return fim < 0 ? resto : resto.slice(0, fim);
};
export const CASOS_DO_ORACULO: Record<string, { cgal: RegExp; rust: RegExp }> = {
  "retangulo-60x30": { cgal: /--- RETANGULO 60x30 ---/, rust: /--- RETÂNGULO 60x30 ---/ },
  "L-60x60-recorte-30x30": { cgal: /--- POLIGONO EM L/, rust: /--- POLÍGONO EM L/ },
};

/** O `esperado` do oráculo do LAB-04 está nas duas saídas guardadas — o oráculo é delas, não de quem o digitou. */
export function conferirOOraculo(oraculo: Oraculo, cgal: string, rust: string): Problema[] {
  const out: Problema[] = [];
  const casos = Object.keys(oraculo.esperado);
  if (casos.length === 0) out.push({ tipo: "oraculo-que-a-saida-nao-tem", onde: O_ORACULO, detalhe: "nenhum caso no esperado" });
  for (const caso of casos) {
    const esp = oraculo.esperado[caso]!;
    const cab = CASOS_DO_ORACULO[caso];
    const pc = cab ? pedaco(cgal, cab.cgal) : null;
    const pr = cab ? pedaco(rust, cab.rust) : null;
    const acusa = (detalhe: string) => out.push({ tipo: "oraculo-que-a-saida-nao-tem", onde: O_ORACULO, detalhe: `${caso}: ${detalhe}` });
    if (pc === null || pr === null) {
      acusa("o caso não está nas duas saídas");
      continue;
    }
    const internosRust = [...pr.matchAll(/pos=\((-?\d+),(-?\d+)\) offset=([\d.]+) boundary=false/g)].map(
      (m) => [Number(m[1]), Number(m[2]), Number(m[3])] as const,
    );
    // Na saída do CGAL as faces também são `N: [a, b, c]`: os vértices são só o que vem antes de `polygons`.
    const internosCgal = [...pc.split("polygons")[0]!.matchAll(/\d+: \[(-?\d+), (-?\d+), (\d+(?:\.\d+)?)\]/g)]
      .map((m) => [Number(m[1]), Number(m[2]), Number(m[3])] as const)
      .filter((v) => v[2] > 0);
    for (const [nome, internos] of [
      ["Rust", internosRust],
      ["CGAL", internosCgal],
    ] as const) {
      if (internos.length !== esp.nos.length) acusa(`${nome} tem ${internos.length} nós internos, o esperado ${esp.nos.length}`);
      for (const [x, y] of esp.nos)
        if (!internos.some((v) => v[0] === x && v[1] === y && v[2] === esp.offset_m))
          acusa(`${nome} não tem o nó (${x},${y}) no offset ${esp.offset_m}`);
    }
    const frente = `residual 0: [${esp.frenteEm5.map(([x, y]) => `(${x}, ${y})`).join(", ")}]`;
    if (!pr.includes(frente)) acusa(`Rust não tem a frente em 5 ${frente}`);
  }
  return out;
}

// ─── 3 · os lugares que repetem a ficha ───────────────────────────────────────────────────────────────────────

/** A licença efetiva como os lugares a abreviam: `GPLv3+` e `GPLv2+` (ou o identificador inteiro do B). */
const abreviada = (l: string | null): string =>
  l === null ? "?" : /^GPL v(\d) ou posterior$/.test(l) ? `GPLv${/v(\d)/.exec(l)![1]}+` : /^GPL-(\d)\.0-or-later$/.test(l) ? `GPLv${/-(\d)/.exec(l)![1]}+` : l;

export function oQueCadaLugarDiz(f: Ficha): { arquivo: string; diz: string[] }[] {
  const ver = f.veredito ?? "?";
  const efA = abreviada(f.a.licencaEfetiva);
  const efB = abreviada(f.b.licenca);
  return [
    {
      arquivo: "docs/TRIAGEM.md",
      diz: [
        `\`${f.a.repositorio ?? "?"}\` · commit \`${(f.a.commit ?? "?").slice(0, 7)}\``,
        `(${f.a.dia ?? "?"}) · invólucro **${f.a.licencaDoInvolucro ?? "?"}**, efetivo **${efA}**`,
        `(CGAL ${f.a.bibliotecas.CGAL ?? "?"}, fixada em`,
        `CGAL/cgal/${f.a.tagDaCgal ?? "?"}/${LICENCA_DA_CGAL}`,
        `→ "${f.a.textoDaLicencaDaCgal ?? "?"}"`,
        `(${f.a.megabytes ?? "?"} MB`,
        `\`${f.b.repositorio ?? "?"}\` · commit \`${(f.b.commit ?? "?").slice(0, 7)}\``,
        `(${f.b.dia ?? "?"}) · **${f.b.licenca ?? "?"}**`,
        `\`license = "${f.b.licenca ?? "?"}"\``,
        `| straight-skeleton (CGAL/WASM) | **${efA}** |`,
        `| straight-skeleton (Rust) | **${efB}** |`,
        `### Veredito: **${ver}**`,
      ],
    },
    {
      arquivo: "README.md",
      diz: [
        `| [straight-skeleton (CGAL/WASM)](${A_PAGINA}) | **${efA}** | contamina | ${ver} |`,
        `| [straight-skeleton (Rust)](${A_PAGINA}) | **${efB}** | contamina | ${ver} |`,
        "straight-skeleton/            ← nada clonado: licença impeditiva",
      ],
    },
    {
      arquivo: "external-engines/straight-skeleton/README.md",
      diz: [
        "**Nada foi clonado para `upstream/`.",
        `| \`${(f.a.repositorio ?? "?").replace("https://github.com/", "")}\` (CGAL via WASM) | **${efA}**`,
        `| \`${(f.b.repositorio ?? "?").replace("https://github.com/", "")}\` (crate Rust) | **${f.b.licenca ?? "?"}**`,
        ver,
      ],
    },
    {
      arquivo: "external-engines/straight-skeleton/archilly/README.md",
      diz: [
        `git clone ${f.b.repositorio ?? "?"}.git`,
        `git clone ${f.a.repositorio ?? "?"}.git`,
        `(${f.b.licenca ?? "?"})`,
        ...f.a.opcoes.map((o) => `-s ${o}`),
      ],
    },
    {
      arquivo: "external-engines/esteira/src/esqueleto/esqueleto.ts",
      diz: [
        `\`${(f.a.repositorio ?? "?").replace("https://github.com/", "")}\``,
        `(CGAL, ${efA})`,
        `\`${(f.b.repositorio ?? "?").replace("https://github.com/", "")}\` (Rust, ${efB})`,
      ],
    },
    {
      arquivo: REGISTRO,
      // O registro se lê pelo motor, não pelo texto (a lição do LAB-171).
      diz: ["estado=so-referencia", "procedencia=nao-copiado", "Nada foi clonado", A_PAGINA],
    },
  ];
}

export function oMotorNoRegistro(json: string, id: string): string | null {
  let motores: { id?: unknown; estado?: unknown; porque?: unknown; procedencia?: { tipo?: unknown } }[];
  try {
    motores = (JSON.parse(json) as { motores?: typeof motores }).motores ?? [];
  } catch {
    return null;
  }
  const m = motores.find((x) => x.id === id);
  if (!m) return null;
  return [`estado=${String(m.estado)}`, `procedencia=${String(m.procedencia?.tipo)}`, `porque=${String(m.porque)}`].join("\n");
}

export function conferirOsLugares(f: Ficha, ler: (c: string) => string | null): Problema[] {
  const out: Problema[] = [];
  for (const { arquivo, diz } of oQueCadaLugarDiz(f)) {
    const cru = ler(arquivo);
    const texto = cru !== null && arquivo === REGISTRO ? oMotorNoRegistro(cru, "straight-skeleton") : cru;
    if (texto === null) {
      out.push({ tipo: "lugar-que-diverge", onde: arquivo, detalhe: "o arquivo não existe (ou, no registro, o motor não está nele)" });
      continue;
    }
    const corrido = texto.replace(/\s+/g, " ");
    for (const d of diz)
      if (!corrido.includes(d.replace(/\s+/g, " ")))
        out.push({ tipo: "lugar-que-diverge", onde: arquivo, detalhe: `não diz ${JSON.stringify(d)}` });
  }
  return out;
}

// ─── 4 · a pasta ──────────────────────────────────────────────────────────────────────────────────────────────

/** O que a pasta pode ter: os três `README.md` e as duas sondas, código próprio do LAB-00 que só chama a API de fora. */
export const ARQUIVOS_DA_PASTA = [
  "external-engines/straight-skeleton/README.md",
  "external-engines/straight-skeleton/adapter/README.md",
  "external-engines/straight-skeleton/archilly/README.md",
  "external-engines/straight-skeleton/archilly/probe-cgal-wasm/probe.mjs",
  "external-engines/straight-skeleton/archilly/probe-rust/Cargo.toml",
  "external-engines/straight-skeleton/archilly/probe-rust/src/main.rs",
] as const;

export function conferirAPasta(versionados: readonly string[]): Problema[] {
  const out: Problema[] = [];
  const naPasta = versionados.filter((c) => c.startsWith("external-engines/straight-skeleton/"));
  for (const c of naPasta)
    if (!(ARQUIVOS_DA_PASTA as readonly string[]).includes(c))
      out.push({ tipo: "pasta-com-arquivo-a-mais", onde: c, detalhe: "a análise recusou os dois; a pasta é README e sonda própria" });
  for (const c of ARQUIVOS_DA_PASTA)
    if (!naPasta.includes(c))
      out.push({ tipo: "pasta-com-arquivo-a-mais", onde: c, detalhe: "o README aponta este arquivo, e o git não o carrega" });
  return out;
}

// ─── tudo ─────────────────────────────────────────────────────────────────────────────────────────────────────

export interface Resultado {
  ficha: Ficha;
  prova: ProvaNaOrigem;
  citado: ReturnType<typeof oQueAPaginaCita>;
  versionados: number;
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
  const exigir = (c: string): string => {
    const t = ler(c);
    // O que some não é "nada a conferir": é a conferência que não aconteceu.
    if (t === null) throw new Error(`${c}: não existe — a análise não se confere sem ele`);
    return t;
  };
  const pagina = exigir(A_PAGINA);
  const ficha = lerAFicha(pagina);
  const prova = JSON.parse(exigir(A_PROVA)) as ProvaNaOrigem;
  const oraculo = JSON.parse(exigir(O_ORACULO)) as Oraculo;
  const versionados = execFileSync("git", ["ls-files"], { cwd: raiz, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
    .split("\n")
    .filter(Boolean);
  return {
    ficha,
    prova,
    citado: oQueAPaginaCita(pagina),
    versionados: versionados.length,
    problemas: [
      ...conferirContraAOrigem(ficha, prova),
      ...conferirAsSaidas(pagina, ler),
      ...conferirOOraculo(oraculo, exigir(SAIDA_CGAL), exigir(SAIDA_RUST)),
      ...conferirOsLugares(ficha, ler),
      ...conferirAPasta(versionados),
    ],
  };
}
