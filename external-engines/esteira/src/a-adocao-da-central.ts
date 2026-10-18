/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O LAB NÃO ADOTA A CENTRAL — a página pergunta ao código, e não mais a si mesma. (LAB-167, item 900, D395)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/ADOCAO_CENTRAL.md` nasceu no LF-FINAL (14/09/2026) e nunca mais foi tocado: **nenhum** arquivo de código o
 * citava (contado em 18/10/2026, por nome, nas três suítes). Ele afirma, em tabela e em prosa, seis estados — e nenhum
 * era perguntado (espécie *mensagem fixa que afirma estado sem perguntar*). Remedidos um a um em 18/10/2026:
 *
 * | o que a página dizia | medido | quem pergunta hoje |
 * |---|---|---|
 * | *"não há tela"*, *"não há interface"*, *"hoje ele não pode [ganhar tela], por regra"* | **falso desde o primeiro dia**: a bancada do navegador existe desde 10/09/2026 (LAB-01, `069fd29`), quatro dias antes da página; é a exceção declarada (D381) | `a-unica-interface.ts` (LAB-153) |
 * | *"não há chamada paga. Nenhuma IA, nenhuma API"* | verdadeiro | `nada-pago.ts` (LAB-148) e `rede-em-execucao.ts` (LAB-158) |
 * | *"não há chave nenhuma aqui… conferido em `SEGURANCA.md`, com o comando"* | verdadeiro, e o comando dava duas onde a página dizia zero | `a-busca-das-chaves.ts` (LAB-166) |
 * | *"o clone do Generate traz `vendor/archilly-central/` só com documentos, sem código"* | **falso hoje**: 40 entradas, `package.json` 0.48.0 e `dist/` com o código do kit (o `dist/` entrou lá em 14/09/2026, `33311c3`) | — é estado do vizinho; a frase sai da página e das duas declarações |
 * | *"o Lab não importa nada da Central em tempo de execução"* | **verdadeiro, e agora medido**: ver abaixo | **esta trava** |
 * | *"as duas declarações de tipo declaram o pacote, e isso não é adoção"* | verdadeiro: dois arquivos, idênticos | **esta trava** |
 *
 * # As duas perguntas desta trava
 *
 * **1. Sem clones — o Lab não adota.** Por LUGAR, em tudo o que o `git` desta casa carrega, fora de `upstream/`:
 *
 *   · nenhum arquivo de código (`.ts`, `.tsx`, `.mts`, `.cts`, `.js`, `.mjs`, `.cjs`, `.jsx`) importa o pacote — nem
 *     por `import`, nem por `export … from`, nem por `import()`, nem por `require`, nem só o tipo;
 *   · nenhum `package.json` o tem como dependência, de nenhuma das quatro espécies;
 *   · só os dois arquivos de {@link AS_DECLARACOES} o declaram (`declare module`), e os dois são idênticos — uma
 *     terceira declaração, ou uma que divergiu, é adoção começando por outra porta;
 *   · a página aponta para cada trava de {@link A_PAGINA_APONTA}, e cada uma existe no disco.
 *
 * **2. Com clones — o pacote nunca está no caminho de execução.** As duas declarações dizem que o pacote só aparece
 * *"no programa de tipos"*. A pergunta é o **fecho das importações de valor**: partindo de todo arquivo que o
 * `tsconfig.json` de cada pacote (esteira, testfit) inclui, seguindo cada importação que não é só de tipo, com a
 * resolução DAQUELE `tsconfig` (os `paths` que levam aos clones vizinhos), até onde ela for. Medido em 18/10/2026,
 * Generate `ebdb078`, Laboratório de Parcelamento `57261f2`, com os arquivos do LAB-167 já na árvore:
 *
 *   · esteira: **424** arquivos no fecho de valor, **73** de fora (56 do Generate, 17 do Laboratório de
 *     Parcelamento), **zero** importações do pacote;
 *   · testfit: **88** arquivos, os mesmos **73** de fora, **zero**;
 *   · e, contando também as importações só de tipo, o fecho chega a **454** e **119** arquivos e **acha** o pacote,
 *     uma vez: `src/lib/design/cores.ts` do Generate, alcançado por `src/lib/diretrizes/types.ts` com `import type`.
 *     É exatamente o que a declaração afirma — o `tsc` chega lá, a execução não — e é a prova de que o instrumento
 *     enxerga o pacote quando ele está no caminho.
 *
 * O fecho de valor é **largo de propósito**: uma importação sem a palavra `type` cujos nomes só servem de tipo conta
 * como valor, embora o Bun a apague ao transpilar. Então *"zero no fecho de valor"* implica zero na execução; o
 * contrário não vale, e não é perguntado.
 *
 * Por que perguntar isto agora, se a suíte passa: **porque ela passa por acaso.** O Generate não tem `node_modules` no
 * clone (o registro dele responde 403 nesta máquina), então uma importação de valor do pacote **quebraria** a suíte —
 * e o dia em que uma máquina instalar as dependências de lá, o kit entra na execução do Lab calado, com o código de
 * contas, créditos e design de outra casa. A pergunta não pode depender de a instalação falhar.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import ts from "typescript";

export const A_PAGINA = "docs/ADOCAO_CENTRAL.md";
export const O_PACOTE = "@archilly/central";

/** As duas declarações de tipo do pacote — as únicas. */
export const AS_DECLARACOES: readonly string[] = [
  "external-engines/esteira/tipos/archilly-central.d.ts",
  "external-engines/testfit/tipos/archilly-central.d.ts",
];

/** As travas que respondem as linhas da página. Cada uma tem de aparecer no texto dela, e existir. */
export const A_PAGINA_APONTA: readonly { arquivo: string; responde: string }[] = [
  { arquivo: "external-engines/esteira/src/a-adocao-da-central.ts", responde: "nada importa o pacote, nem em execução" },
  { arquivo: "external-engines/esteira/src/a-unica-interface.ts", responde: "a tela: uma exceção, a bancada" },
  { arquivo: "external-engines/esteira/src/nada-pago.ts", responde: "nenhuma chamada paga" },
  { arquivo: "external-engines/esteira/src/rede-em-execucao.ts", responde: "nenhuma chamada de rede, nenhuma IA" },
  { arquivo: "external-engines/esteira/src/a-busca-das-chaves.ts", responde: "nenhuma chave" },
];

export const EXTENSOES_DE_CODIGO: readonly string[] = [".ts", ".tsx", ".mts", ".cts", ".js", ".mjs", ".cjs", ".jsx"];
const ESPECIES_DE_DEPENDENCIA = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

export const ehDaCentral = (especificador: string): boolean =>
  especificador === O_PACOTE || especificador.startsWith(`${O_PACOTE}/`);

const ehCodigo = (c: string): boolean => EXTENSOES_DE_CODIGO.some((e) => c.endsWith(e));
const foraDoUniverso = (c: string): boolean => /(^|\/)(upstream|node_modules)\//.test(c);

export type Forma = "import" | "export" | "import()" | "require";

export interface Importacao {
  especificador: string;
  forma: Forma;
  /** Só tipo: `import type`, `export type`, ou todos os nomes marcados com `type`. */
  soTipo: boolean;
  linha: number;
}

function soTipoNaDeclaracao(n: ts.ImportDeclaration | ts.ExportDeclaration): boolean {
  if (ts.isExportDeclaration(n)) {
    if (n.isTypeOnly) return true;
    const ec = n.exportClause;
    return !!ec && ts.isNamedExports(ec) && ec.elements.length > 0 && ec.elements.every((e) => e.isTypeOnly);
  }
  const c = n.importClause;
  if (!c) return false; // `import "x"`: efeito colateral, é valor
  if (c.isTypeOnly) return true;
  if (c.name) return false;
  const nb = c.namedBindings;
  if (!nb || ts.isNamespaceImport(nb)) return false;
  return nb.elements.length > 0 && nb.elements.every((e) => e.isTypeOnly);
}

/** Toda importação de um arquivo de código, pela árvore sintática — comentário e texto não contam. */
export function importacoesDe(caminho: string, texto: string): Importacao[] {
  const sf = ts.createSourceFile(caminho, texto, ts.ScriptTarget.ES2022, true, scriptKind(caminho));
  const achadas: Importacao[] = [];
  const linha = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
  const visitar = (n: ts.Node): void => {
    if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
      achadas.push({
        especificador: n.moduleSpecifier.text,
        forma: ts.isImportDeclaration(n) ? "import" : "export",
        soTipo: soTipoNaDeclaracao(n),
        linha: linha(n),
      });
    } else if (ts.isCallExpression(n) && n.arguments.length > 0 && ts.isStringLiteralLike(n.arguments[0]!)) {
      const arg = n.arguments[0] as ts.StringLiteralLike;
      if (n.expression.kind === ts.SyntaxKind.ImportKeyword) {
        achadas.push({ especificador: arg.text, forma: "import()", soTipo: false, linha: linha(n) });
      } else if (ts.isIdentifier(n.expression) && n.expression.text === "require") {
        achadas.push({ especificador: arg.text, forma: "require", soTipo: false, linha: linha(n) });
      }
    } else if (ts.isImportTypeNode(n) && ts.isLiteralTypeNode(n.argument) && ts.isStringLiteral(n.argument.literal)) {
      // `typeof import("x")` num tipo: só tipo, mas é importação do pacote.
      achadas.push({ especificador: n.argument.literal.text, forma: "import()", soTipo: true, linha: linha(n) });
    }
    n.forEachChild(visitar);
  };
  visitar(sf);
  return achadas;
}

/** O arquivo declara o módulo do pacote (`declare module "@archilly/central"`)? */
export function declaraOPacote(caminho: string, texto: string): boolean {
  const sf = ts.createSourceFile(caminho, texto, ts.ScriptTarget.ES2022, true, scriptKind(caminho));
  return sf.statements.some((s) => ts.isModuleDeclaration(s) && ts.isStringLiteral(s.name) && ehDaCentral(s.name.text));
}

function scriptKind(caminho: string): ts.ScriptKind {
  if (caminho.endsWith(".tsx")) return ts.ScriptKind.TSX;
  if (caminho.endsWith(".jsx")) return ts.ScriptKind.JSX;
  if (/\.(m|c)?js$/.test(caminho)) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

// ── 1 · Sem clones: o Lab não adota ─────────────────────────────────────────

export type TipoDeProblema =
  | "importa-o-pacote"
  | "depende-do-pacote"
  | "declaracao-fora-do-lugar"
  | "declaracao-que-sumiu"
  | "declaracoes-diferentes"
  | "pagina-nao-aponta"
  | "trava-apontada-nao-existe"
  | "pagina-ausente"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  arquivo: string;
  detalhe: string;
}

export interface ResultadoDoLab {
  codigos: number;
  importacoes: number;
  pacotes: number;
  declaracoes: string[];
  problemas: Problema[];
}

/**
 * A pergunta 1 sobre textos já lidos (`caminho` relativo à raiz → conteúdo). `existe` responde se uma trava apontada
 * está no disco; os testes o trocam.
 */
export function conferirOsTextosDoLab(
  textos: ReadonlyMap<string, string>,
  existe: (caminho: string) => boolean,
): ResultadoDoLab {
  const problemas: Problema[] = [];
  let codigos = 0;
  let importacoes = 0;
  let pacotes = 0;
  const declaracoes: string[] = [];

  for (const [caminho, texto] of [...textos].sort(([a], [b]) => a.localeCompare(b))) {
    if (foraDoUniverso(caminho)) continue;
    if (ehCodigo(caminho)) {
      codigos++;
      const imps = importacoesDe(caminho, texto);
      importacoes += imps.length;
      for (const i of imps.filter((x) => ehDaCentral(x.especificador))) {
        problemas.push({
          tipo: "importa-o-pacote",
          arquivo: `${caminho}:${i.linha}`,
          detalhe: `${i.forma} de "${i.especificador}"${i.soTipo ? " (só tipo — ainda assim é adoção)" : ""}`,
        });
      }
      if (declaraOPacote(caminho, texto)) declaracoes.push(caminho);
    } else if (caminho === "package.json" || caminho.endsWith("/package.json")) {
      pacotes++;
      let json: Record<string, unknown>;
      try {
        json = JSON.parse(texto) as Record<string, unknown>;
      } catch {
        continue; // um package.json que não é JSON reprova noutros lugares (bun install); aqui não há o que ler
      }
      for (const especie of ESPECIES_DE_DEPENDENCIA) {
        const deps = json[especie];
        if (deps && typeof deps === "object" && Object.keys(deps).some(ehDaCentral)) {
          problemas.push({ tipo: "depende-do-pacote", arquivo: caminho, detalhe: `"${O_PACOTE}" em ${especie}` });
        }
      }
    }
  }

  for (const d of declaracoes.filter((d) => !AS_DECLARACOES.includes(d))) {
    problemas.push({
      tipo: "declaracao-fora-do-lugar",
      arquivo: d,
      detalhe: `declara "${O_PACOTE}" fora das duas declarações de AS_DECLARACOES`,
    });
  }
  for (const d of AS_DECLARACOES.filter((d) => !declaracoes.includes(d))) {
    problemas.push({ tipo: "declaracao-que-sumiu", arquivo: d, detalhe: "não está na árvore, ou deixou de declarar o pacote" });
  }
  const [a, b] = AS_DECLARACOES;
  if (a && b && textos.has(a) && textos.has(b) && textos.get(a) !== textos.get(b)) {
    problemas.push({ tipo: "declaracoes-diferentes", arquivo: b, detalhe: `difere de ${a}` });
  }

  const pagina = textos.get(A_PAGINA);
  if (pagina === undefined) {
    problemas.push({ tipo: "pagina-ausente", arquivo: A_PAGINA, detalhe: "a página não está na árvore" });
  } else {
    for (const { arquivo } of A_PAGINA_APONTA) {
      if (!pagina.includes(arquivo)) {
        problemas.push({ tipo: "pagina-nao-aponta", arquivo: A_PAGINA, detalhe: `não cita ${arquivo}` });
      }
      if (!existe(arquivo)) {
        problemas.push({ tipo: "trava-apontada-nao-existe", arquivo, detalhe: "apontada pela página, ausente do disco" });
      }
    }
  }

  if (codigos === 0 || pacotes === 0) {
    problemas.push({ tipo: "universo-vazio", arquivo: "(árvore)", detalhe: `${codigos} códigos e ${pacotes} package.json lidos` });
  }
  return { codigos, importacoes, pacotes, declaracoes, problemas };
}

/** A árvore de verdade: o que o `git` desta casa carrega. */
export function conferirOLab(raiz: string): ResultadoDoLab {
  const listados = execFileSync("git", ["-C", raiz, "ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\0")
    .filter(Boolean);
  const textos = new Map<string, string>();
  for (const c of listados) {
    if (foraDoUniverso(c)) continue;
    if (!(ehCodigo(c) || c.endsWith("package.json") || c === A_PAGINA)) continue;
    const absoluto = join(raiz, c);
    if (existsSync(absoluto)) textos.set(c, readFileSync(absoluto, "utf8"));
  }
  return conferirOsTextosDoLab(textos, (c) => existsSync(join(raiz, c)));
}

// ── 2 · Com clones: o fecho das importações ─────────────────────────────────

export interface ChegadaAoPacote {
  arquivo: string;
  especificador: string;
  /** O arquivo que trouxe `arquivo` para o fecho (`(raiz)` se ele é do `include`). */
  via: string;
}

export interface Fecho {
  arquivos: number;
  /** Arquivos do fecho fora desta casa (nos clones vizinhos). */
  deFora: number;
  chegadas: ChegadaAoPacote[];
  /** Especificadores relativos ou de `paths` que não resolveram — publicados, nunca engolidos. */
  naoResolvidos: string[];
}

/**
 * O fecho das importações a partir do `include` do `tsconfig.json` de `dirDoPacote`, com a resolução dele.
 * `comTipos: false` segue só as de valor (o caminho de execução, largo); `true` segue todas (o programa de tipos).
 * Pacote externo (`node_modules`) e `.d.ts` param o fecho: são o chão, não código desta família.
 */
export function fechoDeImportacoes(dirDoPacote: string, comTipos: boolean): Fecho {
  const caminhoDoCfg = resolve(dirDoPacote, "tsconfig.json");
  const lido = ts.readConfigFile(caminhoDoCfg, ts.sys.readFile);
  const cfg = ts.parseJsonConfigFileContent(lido.config, ts.sys, dirname(caminhoDoCfg));
  const host = ts.createCompilerHost(cfg.options);
  const trouxe = new Map<string, string>();
  const fila = cfg.fileNames.filter((f) => !f.endsWith(".d.ts"));
  for (const f of fila) trouxe.set(f, "(raiz)");
  const chegadas: ChegadaAoPacote[] = [];
  const naoResolvidos: string[] = [];
  const casa = resolve(dirDoPacote, "..", "..");
  // O que é DESTA família: relativo, ou um prefixo de `paths` do próprio tsconfig. Não resolver isso é publicado.
  const prefixos = Object.keys(cfg.options.paths ?? {}).map((k) => k.replace(/\*$/, ""));
  const daFamilia = (e: string) => e.startsWith(".") || prefixos.some((p) => p.length > 0 && e.startsWith(p));
  const rel = (f: string) => relative(casa, f);

  for (let i = 0; i < fila.length; i++) {
    const f = fila[i]!;
    for (const imp of importacoesDe(f, readFileSync(f, "utf8"))) {
      if (imp.soTipo && !comTipos) continue;
      if (ehDaCentral(imp.especificador)) {
        chegadas.push({ arquivo: rel(f), especificador: imp.especificador, via: rel(trouxe.get(f) ?? "(raiz)") });
        continue;
      }
      const r = ts.resolveModuleName(imp.especificador, f, cfg.options, host).resolvedModule;
      if (!r) {
        if (daFamilia(imp.especificador)) {
          naoResolvidos.push(`${rel(f)} → ${imp.especificador}`);
        }
        continue;
      }
      if (r.isExternalLibraryImport || r.resolvedFileName.endsWith(".d.ts")) continue;
      if (!trouxe.has(r.resolvedFileName)) {
        trouxe.set(r.resolvedFileName, f);
        fila.push(r.resolvedFileName);
      }
    }
  }
  const deFora = [...trouxe.keys()].filter((f) => rel(f).startsWith("..")).length;
  return { arquivos: trouxe.size, deFora, chegadas, naoResolvidos };
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "importação montada em tempo de execução (`import(nome)` com o nome numa variável): o fecho segue o texto literal, e a casa não tem nenhuma hoje — o que entra por ali, só a execução diria",
  "as ferramentas do Symbios em Node puro (`.mjs` sem `tsconfig`): entram na pergunta 1 (ninguém importa o pacote), mas não no fecho da pergunta 2, que parte do `include` dos dois pacotes Bun",
  "adotar sem importar o nome — copiar o código do kit para dentro da casa com outro nome: isso é cópia, e a pergunta é das travas de cópia (`o-motor-da-familia-nao-se-copia.ts`, LAB-146), que olham motor, não o kit",
  "o estado do `vendor/` do Generate: é do vizinho, e a página deixou de afirmá-lo — se um dia o Lab precisar dele, quem mede é quem precisa",
  "se adotar a Central é a decisão certa: a página diz por que não, e o que mudaria; mudar de ideia é do chat, e esta trava reprovaria no primeiro import, de propósito",
];
