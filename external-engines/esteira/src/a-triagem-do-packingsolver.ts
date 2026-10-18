/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A TRIAGEM DO PACKINGSOLVER — a ficha, perguntada à origem, aos cinco lugares que a repetem e à árvore. (LAB-171, item 900, D399)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A `docs/PACKINGSOLVER_TRIAGEM.md` (LAB-00, 09/09/2026) era a última página de `docs/` sem leitor no código (contado
 * no LAB-167 e no LAB-170, por nome, nas três suítes). É relato datado — a triagem de um motor recusado —, mas carrega
 * duas espécies de afirmação que envelhecem:
 *
 *   - **a ficha de um repositório de fora** (commit, data, licença, opções do `CMakeLists.txt`, os seis tipos de
 *     problema, as opções da linha de comando, o `certificate.csv`), que **cinco** outros lugares desta casa repetem —
 *     o `README.md` da raiz (a tabela e a árvore), o `docs/TRIAGEM.md` (a §4 e o quadro-resumo), o
 *     `external-engines/packingsolver/README.md` e o registro de motores. *Número em vários lugares se cobra contra a
 *     MEDIÇÃO — consistência não é correção* (D311);
 *   - **o estado desta casa**: *"não foi copiado para `upstream/`"*, *"nada clonado"*, o `adapter/` *"vazio de
 *     propósito"*. O registro diz `nao-copiado` desde o LAB-76, e **nada perguntava à árvore** se era verdade — nem
 *     para o PackingSolver, nem para o straight skeleton, o outro `nao-copiado`.
 *
 * Medido em 18/10/2026 (`bun run lab171`, a prova em `docs/provas/LAB-171/packingsolver-na-origem.json`): **tudo o que
 * a página afirma confere** — o commit existe na origem, com a data e o autor da ficha; a licença é MIT com o
 * copyright da ficha; `CLP` e `HiGHS` ligados e `Knitro` desligado; as seis pastas de problema; as seis opções da
 * linha de comando e o certificado. O `HEAD` da origem de hoje é outro (2026-10-18), e a §6 diz *"um dia antes desta
 * triagem"* — relato datado, que fica como está; o número de hoje mora na prova, ao lado.
 *
 * **Esta trava pergunta, a cada verde, sem clones e sem rede:**
 *
 *   1. a ficha da página (o bloco da §1, a frase do `CMakeLists.txt`, a lista dos tipos, as opções em crase, o
 *      certificado, o veredito da §8) é lida, e cada campo bate com a prova medida na origem;
 *   2. cada um dos cinco lugares repete a ficha — commit, data, licença, veredito — e quem diz *"nada clonado"* diz;
 *   3. nenhum motor que o registro chama `nao-copiado` tem arquivo versionado em `upstream/`, e a pasta do
 *      PackingSolver tem só os dois `README.md` (o `adapter/` vazio de propósito).
 *
 * **O que ela não alcança, dito:** a origem **de hoje** (só a ferramenta, com rede, a pergunta; a trava lê a prova
 * gravada); o que o código de fora **faz** (a página e a prova leem nome de pasta, opção e texto — nada foi compilado
 * nem executado, e a frase *"sem prova de execução"* da página continua verdadeira); e o **julgamento** da triagem
 * (*"o acesso à via é fatal"*, *"um solver de trinta linhas basta"*), que é argumento, não número.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const A_PAGINA = "docs/PACKINGSOLVER_TRIAGEM.md";
export const A_PROVA = "docs/provas/LAB-171/packingsolver-na-origem.json";
export const ORIGEM_DO_PACKINGSOLVER =
  "https://github.com/fontanf/packingsolver";
/** O commit que a página fixa — a ferramenta busca só ele. A trava confere que é o da página. */
export const COMMIT_DA_TRIAGEM = "a7e533033d9c6ee3ff286513720afe6660b5989f";

export const OPCOES_DO_CMAKE = [
  "PACKINGSOLVER_USE_CLP",
  "PACKINGSOLVER_USE_HIGHS",
  "PACKINGSOLVER_USE_KNITRO",
] as const;
export const TIPOS_DE_PROBLEMA = [
  "rectangleguillotine",
  "rectangle",
  "box",
  "boxstacks",
  "onedimensional",
  "irregular",
] as const;
/** As opções da linha de comando que a página nomeia em crase. */
export const OPCOES_DA_CLI = [
  "number-of-stages",
  "min1cut",
  "max1cut",
  "min2cut",
  "max2cut",
  "time-limit",
] as const;

export interface ProvaNaOrigem {
  prompt: string;
  oQueIstoMede: string;
  quando: string;
  origem: string;
  commit: {
    pedido: string;
    existe: boolean;
    data: string | null;
    autor: string | null;
  };
  licenca: { primeiraLinha: string; direitos: string | null } | null;
  cmake: Record<string, "ON" | "OFF" | null>;
  tiposDeProblema: Record<string, boolean>;
  pastasDoSrc: string[];
  /** `null` quando o arquivo da linha de comando não foi lido — nunca `false`. */
  opcoesDaCli: Record<string, boolean | null>;
  certificadoNaCli: boolean | null;
  headDeHoje: { sha: string; data: string };
}

/** O que a página afirma, lido do texto dela. Campo que some é `null`, nunca vazio que passa. */
export interface Ficha {
  repositorio: string | null;
  commit: string | null;
  /** `2026-09-08 02:45:18 +0200`, sem o comentário entre parênteses. */
  data: string | null;
  /** `MIT`, a palavra antes da vírgula. */
  licenca: string | null;
  /** `Copyright (c) 2020 Florian Fontan`. */
  direitos: string | null;
  cmake: Record<string, "ON" | "OFF">;
  /** Os tipos da frase *"Seis tipos de problema: …"*, e o número por extenso dela. */
  tipos: string[];
  tiposPorExtenso: number | null;
  opcoesNomeadas: string[];
  certificado: boolean;
  veredito: string | null;
  naoCopiado: boolean;
}

const POR_EXTENSO: Record<string, number> = {
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
};

const campoDaFicha = (texto: string, nome: string): string | null => {
  const m = new RegExp(`^${nome}:\\s+(.+)$`, "m").exec(texto);
  return m ? m[1]!.trim() : null;
};

export function lerAFicha(texto: string): Ficha {
  const plano = texto.replace(/\s+/g, " ");
  const dataCrua = campoDaFicha(texto, "Data");
  const licencaCrua = campoDaFicha(texto, "Licença");
  const cmake: Record<string, "ON" | "OFF"> = {};
  for (const m of texto.matchAll(/`(PACKINGSOLVER_USE_[A-Z]+)=(ON|OFF)`/g))
    cmake[m[1]!] = m[2] as "ON" | "OFF";
  if (/Knitro[^)]{0,40}`OFF`/.test(plano))
    cmake.PACKINGSOLVER_USE_KNITRO = "OFF";
  const frase = /(\S+) tipos de problema: ([^.]+)\./.exec(plano);
  const tipos = frase
    ? [...frase[2]!.matchAll(/`([a-z]+)`/g)].map((m) => m[1]!)
    : [];
  const veredito = /## \d+\. Veredito\s+\*\*([^*]+?)\.?\*\*/.exec(texto);
  return {
    repositorio: campoDaFicha(texto, "Repositório"),
    commit: campoDaFicha(texto, "Commit"),
    data: dataCrua === null ? null : dataCrua.replace(/\s*\(.*$/, "").trim(),
    licenca: licencaCrua === null ? null : licencaCrua.split(",")[0]!.trim(),
    direitos:
      licencaCrua === null
        ? null
        : (/Copyright[^\n]*/.exec(licencaCrua)?.[0].trim() ?? null),
    cmake,
    tipos,
    tiposPorExtenso: frase
      ? (POR_EXTENSO[frase[1]!.toLowerCase()] ?? null)
      : null,
    opcoesNomeadas: OPCOES_DA_CLI.filter((o) =>
      new RegExp("`(--)?" + o + "[` ]").test(texto),
    ),
    certificado: texto.includes("certificate.csv"),
    veredito: veredito ? veredito[1]!.trim() : null,
    naoCopiado: /não foi copiado para `upstream\/`/.test(plano),
  };
}

export type TipoDeProblema =
  | "campo-que-sumiu"
  | "ficha-contra-a-origem"
  | "lugar-que-diverge"
  | "copiado-que-diz-nao-copiado"
  | "pasta-com-arquivo-a-mais";

export interface Problema {
  tipo: TipoDeProblema;
  onde: string;
  detalhe: string;
}

/** 1 · a ficha contra a prova medida na origem. */
export function conferirContraAOrigem(f: Ficha, p: ProvaNaOrigem): Problema[] {
  const out: Problema[] = [];
  const falta = (campo: string) =>
    out.push({ tipo: "campo-que-sumiu", onde: A_PAGINA, detalhe: campo });
  const diverge = (campo: string, pagina: unknown, origem: unknown) =>
    out.push({
      tipo: "ficha-contra-a-origem",
      onde: A_PAGINA,
      detalhe: `${campo}: a página diz ${JSON.stringify(pagina)}, a origem ${JSON.stringify(origem)}`,
    });

  for (const [campo, v] of Object.entries({
    repositorio: f.repositorio,
    commit: f.commit,
    data: f.data,
    licenca: f.licenca,
    direitos: f.direitos,
    veredito: f.veredito,
  })) {
    if (v === null) falta(campo);
  }
  if (f.repositorio !== null && f.repositorio !== p.origem)
    diverge("repositório", f.repositorio, p.origem);
  if (f.commit !== null && (f.commit !== p.commit.pedido || !p.commit.existe))
    diverge("commit", f.commit, p.commit);
  if (f.data !== null && f.data !== p.commit.data)
    diverge("data", f.data, p.commit.data);
  if (
    f.licenca !== null &&
    !(p.licenca?.primeiraLinha ?? "").startsWith(`${f.licenca} `)
  )
    diverge("licença", f.licenca, p.licenca?.primeiraLinha ?? null);
  if (f.direitos !== null && f.direitos !== p.licenca?.direitos)
    diverge("direitos", f.direitos, p.licenca?.direitos ?? null);

  for (const o of OPCOES_DO_CMAKE) {
    if (!(o in f.cmake)) falta(`cmake ${o}`);
    else if (f.cmake[o] !== p.cmake[o])
      diverge(o, f.cmake[o], p.cmake[o] ?? null);
  }

  if (f.tipos.length === 0) falta("tipos de problema");
  if (f.tiposPorExtenso !== null && f.tiposPorExtenso !== f.tipos.length)
    out.push({
      tipo: "ficha-contra-a-origem",
      onde: A_PAGINA,
      detalhe: `a frase diz ${f.tiposPorExtenso} tipos por extenso e lista ${f.tipos.length}`,
    });
  for (const t of f.tipos)
    if (!p.pastasDoSrc.includes(t))
      diverge(`tipo ${t}`, "existe", "não há a pasta");
  const problemasNaOrigem = p.pastasDoSrc.filter(
    (x) => x !== "algorithms" && x !== "CMakeLists.txt",
  );
  for (const t of problemasNaOrigem)
    if (!f.tipos.includes(t)) diverge(`tipo ${t}`, "não diz", "a pasta existe");

  for (const o of OPCOES_DA_CLI) {
    if (!f.opcoesNomeadas.includes(o)) falta(`opção ${o}`);
    else if (p.opcoesDaCli[o] !== true)
      diverge(`opção ${o}`, "existe", p.opcoesDaCli[o] ?? null);
  }
  if (!f.certificado) falta("certificate.csv");
  else if (p.certificadoNaCli !== true)
    diverge("certificate.csv", "existe", "a linha de comando não fala dele");
  if (!f.naoCopiado) falta("não foi copiado para `upstream/`");
  return out;
}

/** 2 · os cinco lugares que repetem a ficha, e o que cada um tem de dizer — derivado da ficha, nunca digitado. */
export function oQueCadaLugarDiz(
  f: Ficha,
): { arquivo: string; diz: string[] }[] {
  const curto = (f.commit ?? "?").slice(0, 7);
  const dia = (f.data ?? "?").slice(0, 10);
  const lic = f.licenca ?? "?";
  const ver = f.veredito ?? "?";
  return [
    {
      arquivo: "external-engines/packingsolver/README.md",
      diz: [
        `Commit:       ${f.commit ?? "?"}  (${dia})`,
        `Licença:      ${lic}`,
        `Veredito:     ${ver}`,
        "Nada foi clonado para `upstream/`",
      ],
    },
    {
      arquivo: "external-engines/packingsolver/adapter/README.md",
      diz: ["Vazio de propósito"],
    },
    {
      arquivo: "docs/TRIAGEM.md",
      diz: [
        `${f.repositorio ?? "?"}\` · commit \`${curto}\` (${dia})`,
        `**${lic}** · C++`,
        `### Veredito: **${ver}**`,
        `| PackingSolver | ${lic} | não (servidor) | não executado | ${ver} |`,
      ],
    },
    {
      arquivo: "README.md",
      diz: [
        `| [PackingSolver](${A_PAGINA}) | ${lic} | não (servidor) | ${ver} |`,
        "packingsolver/                ← nada clonado",
      ],
    },
    {
      arquivo: "external-engines/esteira/dados/registro-de-motores.json",
      // O registro se lê pelo motor, não pelo texto: `"estado": "so-referencia"` também é a linha do straight skeleton.
      diz: [
        "estado=so-referencia",
        "procedencia=nao-copiado",
        "Nada foi clonado para upstream/",
        A_PAGINA,
      ],
    },
  ];
}

/** A entrada de um motor no registro, como linhas `campo=valor` — ou `null` quando o motor não está lá. */
export function oMotorNoRegistro(json: string, id: string): string | null {
  let motores: {
    id?: unknown;
    estado?: unknown;
    porque?: unknown;
    procedencia?: { tipo?: unknown };
  }[];
  try {
    motores = (JSON.parse(json) as { motores?: typeof motores }).motores ?? [];
  } catch {
    return null;
  }
  const m = motores.find((x) => x.id === id);
  if (!m) return null;
  return [
    `estado=${String(m.estado)}`,
    `procedencia=${String(m.procedencia?.tipo)}`,
    `porque=${String(m.porque)}`,
  ].join("\n");
}

export function conferirOsLugares(
  f: Ficha,
  ler: (arquivo: string) => string | null,
): Problema[] {
  const out: Problema[] = [];
  for (const { arquivo, diz } of oQueCadaLugarDiz(f)) {
    const cru = ler(arquivo);
    const texto =
      cru !== null && arquivo.endsWith(".json")
        ? oMotorNoRegistro(cru, "packingsolver")
        : cru;
    if (texto === null) {
      out.push({
        tipo: "lugar-que-diverge",
        onde: arquivo,
        detalhe:
          "o arquivo não existe (ou, no registro, o motor não está nele)",
      });
      continue;
    }
    for (const d of diz)
      if (!texto.includes(d))
        out.push({
          tipo: "lugar-que-diverge",
          onde: arquivo,
          detalhe: `não diz ${JSON.stringify(d)}`,
        });
  }
  return out;
}

/** 3 · a árvore: `nao-copiado` não tem `upstream/`, e a pasta do PackingSolver tem só os dois README. */
export const ARQUIVOS_DA_PASTA = [
  "external-engines/packingsolver/README.md",
  "external-engines/packingsolver/adapter/README.md",
];

export function conferirAArvore(
  naoCopiados: readonly string[],
  versionados: readonly string[],
): Problema[] {
  const out: Problema[] = [];
  for (const id of naoCopiados) {
    const dentro = versionados.filter((c) =>
      c.startsWith(`external-engines/${id}/upstream/`),
    );
    if (dentro.length > 0)
      out.push({
        tipo: "copiado-que-diz-nao-copiado",
        onde: `external-engines/${id}/upstream/`,
        detalhe: `o registro diz nao-copiado e o git carrega ${dentro.length} arquivo(s): ${dentro.slice(0, 3).join(", ")}`,
      });
  }
  for (const c of versionados.filter((x) =>
    x.startsWith("external-engines/packingsolver/"),
  ))
    if (!ARQUIVOS_DA_PASTA.includes(c))
      out.push({
        tipo: "pasta-com-arquivo-a-mais",
        onde: c,
        detalhe: "a triagem não recomendou seguir; a pasta é só README",
      });
  return out;
}

export interface Resultado {
  ficha: Ficha;
  prova: ProvaNaOrigem;
  naoCopiados: string[];
  versionados: number;
  problemas: Problema[];
}

export function conferirATriagem(raiz: string): Resultado {
  const ler = (c: string): string | null => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  };
  const exigir = (c: string): string => {
    const t = ler(c);
    // A página, a prova ou o registro que some não é "nada a conferir": é a conferência que não aconteceu.
    if (t === null)
      throw new Error(`${c}: não existe — a triagem não se confere sem ele`);
    return t;
  };
  const ficha = lerAFicha(exigir(A_PAGINA));
  const prova = JSON.parse(exigir(A_PROVA)) as ProvaNaOrigem;
  const registro = JSON.parse(
    exigir("external-engines/esteira/dados/registro-de-motores.json"),
  ) as {
    motores?: { id: string; procedencia: { tipo: string } }[];
  };
  const naoCopiados = (registro.motores ?? [])
    .filter((m) => m.procedencia.tipo === "nao-copiado")
    .map((m) => m.id);
  const versionados = execFileSync("git", ["ls-files"], {
    cwd: raiz,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\n")
    .filter(Boolean);
  return {
    ficha,
    prova,
    naoCopiados,
    versionados: versionados.length,
    problemas: [
      ...conferirContraAOrigem(ficha, prova),
      ...conferirOsLugares(ficha, ler),
      ...conferirAArvore(naoCopiados, versionados),
    ],
  };
}
