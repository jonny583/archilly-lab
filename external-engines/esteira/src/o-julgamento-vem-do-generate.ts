/**
 * NÃO REIMPLEMENTA O VALIDATOR NEM O JUDGE — e a guarda só perguntava a uma pasta, por cinco nomes, numa forma de
 * escrever função. (LAB-154, item 900, a dívida própria, D382)
 *
 * # A regra, e o que a guardava
 *
 * O `CLAUDE.md` §4: *"**Não reimplementa o Validator nem o Judge** (D20)."* A D20 diz onde o julgamento mora:
 * `montarParcelamentoExterno` (o esquema e o Validator) e `montarRelatorio` (o Judge), **importados** de
 * `@generate/import/parcelamento-externo.ts`.
 *
 * A guarda é a do LAB-36 (`tests/regras.test.ts`, *"§4 · não reimplementa o Validator nem o Judge"*), e tem duas travas:
 *
 * 1. o `comum.ts` **contém o texto** `@generate/` — menção, não importação (a forma do D137, que a própria
 *    `regras.test.ts` já tinha pago no LAB-38 noutra trava);
 * 2. nenhum `.ts` de `esteira/src/` diz `function`/`class` seguido de um de cinco nomes (`validar`, `validador`,
 *    `Validator`, `Judge`, `julgarLocal`).
 *
 * **Medido por mutação (LAB-154), antes de escrever esta trava:** uma função de julgamento própria no adaptador do
 * Symbios e outra, em forma de seta, em `esteira/src/`, as duas postas no `git`, passaram a `regras.test.ts` (25 de 25). E
 * o `comum.ts` com o import do Generate trocado por um Validator e um Judge **locais**, que aprovam tudo, tipados pelo
 * `typeof` do Generate e sem gravar `limpo`: na suíte inteira com os clones, **as únicas falhas novas foram duas de
 * contagem de linhas e bytes** (LAB-52 e LAB-57), que caem com qualquer mudança de código. Gravando `limpo: true`, cai
 * também a LAB-110 (*"grava veredito e não diz de onde ele vem"*). Nenhum teste que olha veredito acusou um veredito
 * falso no ponto por onde passa todo julgamento da esteira.
 *
 * # O que se mediu, por LUGAR (17/10/2026)
 *
 * O universo é o código que o `git` carrega (`git ls-files`, fora `node_modules/` e `upstream/`): **335 arquivos
 * TypeScript/JavaScript** antes desta trava (o módulo e o teste dela somam dois) e **5 Rust** (`archilly/`). Lido pela árvore sintática do TypeScript, não por
 * texto.
 *
 * - **Quem importa o julgamento do Generate:** 18 arquivos — o `comum.ts`, o `esteira.ts` do adaptador do Laboratório
 *   de Parcelamento, quinze ferramentas e a `guarda-da-ponte.test.ts` —, todos por `import`, todos do mesmo
 *   especificador. Outros três o citam em comentário (`lab13.ts`, `mesmo-valor.ts`, o README do adaptador), e citar não
 *   é importar.
 * - **Quem define função com nome de julgamento** (`julga…`, `valida…`, `validator`, `judge`, `juiz`): **oito**. Sete
 *   chegam ao Generate pela cadeia de chamadas — os `julgar` do `comum.ts` e de quatro ferramentas chamam
 *   `montarParcelamentoExterno` e `montarRelatorio` direto; o `julgarComARegua` do LAB-06 chama o `julgar` do
 *   `comum.ts`; o `variantesJulgadasDoTestfit` chama o `rodarEsteira` do adaptador, que chama os dois. **Um não chega**:
 *   o `julgarPorLotes` de `tests/entrega.test.ts` — *"um Validator de mentira"*, escrito ali **de propósito** para provar
 *   que a peça `entrega/` roda sem nada do Lab (LAB-06). É a exceção declarada.
 * - **Rust:** nenhuma `fn` com nome de julgamento.
 *
 * A regra está **verdadeira**. A guarda é que perguntava a uma pasta, por nome exato, e confiava numa menção.
 *
 * # O que este módulo faz
 *
 * {@link conferirAOrigemDoVeredito} lê cada arquivo do universo, monta o mapa de definições e de importações, e calcula — até
 * parar de mudar — quais funções **chegam** ao julgamento do Generate pela cadeia de chamadas. Acusa:
 *
 * - `julgamento-proprio` — função com nome de julgamento que não chega ao Generate e não é a exceção;
 * - `simbolo-redefinido` — uma definição desta casa com o nome de um dos dois símbolos do julgamento (a mutação do
 *   `comum.ts` acima: o nome é o mesmo, a função é outra);
 * - `ponto-sem-importacao` — o `comum.ts`, o ponto por onde passa o julgamento da esteira, não **importa** os dois símbolos
 *   do especificador (importação lida na árvore, não menção);
 * - `excecao-que-sumiu` — linha da exceção que não acha mais a função, ou cuja função passou a chegar ao Generate (o outro
 *   sentido, D104);
 * - `universo-vazio` — nenhum arquivo de código lido (D164).
 */
import { readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import ts from "typescript";

import { semComentarios } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

/** A marca da regra no `CLAUDE.md` §4 — o teste confere que ela continua escrita. */
export const A_REGRA = "Não reimplementa o Validator nem o Judge";

/** Onde o julgamento mora, pela D20. */
export const O_JULGAMENTO = {
  especificador: "@generate/import/parcelamento-externo.ts",
  simbolos: ["montarParcelamentoExterno", "montarRelatorio"] as readonly string[],
} as const;

/** O ponto por onde passa todo julgamento da esteira (D20, LAB-06). */
export const O_PONTO = "external-engines/esteira/src/motores/comum.ts";

/** O nome de julgamento. Prefixo de palavra em qualquer lugar do identificador: `julgar`, `variantesJulgadas`, `ValidatorX`. */
export const VOCABULARIO = /(julga|julgu|valida|validator|judge|juiz)/i;

/** Os apelidos desta casa que apontam para DENTRO dela (os outros — `@generate/`, `@testfit/`, `@/` — são clones). */
const APELIDOS_DA_CASA: Record<string, string> = {
  "@symbios/": "external-engines/symbios/adapter/src/",
};

/** A exceção declarada, por arquivo e nome. */
export const EXCECAO: readonly { caminho: string; nome: string; motivo: string }[] = [
  {
    caminho: "external-engines/esteira/tests/entrega.test.ts",
    nome: "julgarPorLotes",
    motivo:
      "dublê de teste: a peça `entrega/` recebe o veredito por injeção, e o teste prova que ela roda com um Validator de mentira, sem nada do Lab (LAB-06, D68)",
  },
];

const CODIGO_TS = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/i;
const CODIGO_RS = /\.rs$/i;
const fora = (c: string) => /(^|\/)node_modules\//.test(c) || /(^|\/)upstream\//.test(c);

export type TipoDeProblema =
  | "julgamento-proprio"
  | "simbolo-redefinido"
  | "ponto-sem-importacao"
  | "excecao-que-sumiu"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  caminho: string;
  nome?: string;
  detalhe: string;
}

export interface Definicao {
  caminho: string;
  nome: string;
  linha: number;
  /** Os nomes chamados no corpo (só a chamada por identificador: `f(…)`, e o identificador passado como argumento). */
  chama: string[];
}

export interface Resultado {
  /** Arquivos de código lidos: TypeScript/JavaScript e Rust. */
  lidos: { ts: number; rs: number };
  /** Arquivos que importam os dois símbolos do julgamento do especificador da D20. */
  importam: string[];
  /** Funções com nome de julgamento, e se chegam ao Generate. */
  comNomeDeJulgamento: { caminho: string; nome: string; chega: boolean }[];
  problemas: Problema[];
}

/** O que o arquivo importa: nome local → { de onde, nome lá }. E o que ele re-exporta. */
interface Ligacoes {
  importa: Map<string, { especificador: string; nome: string }>;
  reexporta: { especificador: string; nome: string | null; comoNome: string | null }[];
}

/** Desembrulha `(x)`, `x as T`, `x satisfies T` até a expressão. */
function desembrulhar(e: ts.Expression): ts.Expression {
  let x = e;
  while (ts.isParenthesizedExpression(x) || ts.isAsExpression(x) || ts.isSatisfiesExpression(x)) x = x.expression;
  return x;
}

function nomeDe(n: ts.PropertyName | ts.BindingName | undefined): string | null {
  if (!n) return null;
  if (ts.isIdentifier(n) || ts.isStringLiteral(n) || ts.isPrivateIdentifier(n)) return n.text;
  return null;
}

/** Os nomes chamados dentro de um nó. */
function chamadasEm(no: ts.Node): string[] {
  const nomes = new Set<string>();
  const visitar = (n: ts.Node) => {
    if (ts.isCallExpression(n) || ts.isNewExpression(n)) {
      const alvo = desembrulhar(n.expression);
      if (ts.isIdentifier(alvo)) nomes.add(alvo.text);
      for (const a of n.arguments ?? []) {
        const arg = desembrulhar(a);
        if (ts.isIdentifier(arg)) nomes.add(arg.text);
      }
    }
    ts.forEachChild(n, visitar);
  };
  visitar(no);
  return [...nomes];
}

/** Lê um arquivo TypeScript/JavaScript: as definições de função e as ligações de import/export. */
export function lerArquivo(caminho: string, texto: string): { definicoes: Definicao[]; ligacoes: Ligacoes } {
  const fonte = ts.createSourceFile(caminho, texto, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const definicoes: Definicao[] = [];
  const ligacoes: Ligacoes = { importa: new Map(), reexporta: [] };
  const linha = (n: ts.Node) => fonte.getLineAndCharacterOfPosition(n.getStart(fonte)).line + 1;
  const definir = (nome: string | null, corpo: ts.Node | undefined, no: ts.Node) => {
    if (nome && corpo) definicoes.push({ caminho, nome, linha: linha(no), chama: chamadasEm(corpo) });
  };
  const ehFuncao = (e: ts.Expression | undefined): e is ts.ArrowFunction | ts.FunctionExpression | ts.ClassExpression => {
    if (!e) return false;
    const x = desembrulhar(e);
    return ts.isArrowFunction(x) || ts.isFunctionExpression(x) || ts.isClassExpression(x);
  };

  const visitar = (n: ts.Node) => {
    if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier)) {
      const especificador = n.moduleSpecifier.text;
      const nb = n.importClause?.namedBindings;
      if (nb && ts.isNamedImports(nb))
        for (const el of nb.elements)
          ligacoes.importa.set(el.name.text, { especificador, nome: (el.propertyName ?? el.name).text });
      if (n.importClause?.name) ligacoes.importa.set(n.importClause.name.text, { especificador, nome: "default" });
    } else if (ts.isExportDeclaration(n) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
      const especificador = n.moduleSpecifier.text;
      if (!n.exportClause) ligacoes.reexporta.push({ especificador, nome: null, comoNome: null });
      else if (ts.isNamedExports(n.exportClause))
        for (const el of n.exportClause.elements)
          ligacoes.reexporta.push({ especificador, nome: (el.propertyName ?? el.name).text, comoNome: el.name.text });
    } else if (ts.isFunctionDeclaration(n)) {
      definir(n.name?.text ?? null, n.body, n);
    } else if (ts.isClassDeclaration(n)) {
      definir(n.name?.text ?? null, n, n);
    } else if (ts.isVariableDeclaration(n) && ehFuncao(n.initializer)) {
      definir(nomeDe(n.name), n.initializer, n);
    } else if (ts.isMethodDeclaration(n) || ts.isGetAccessorDeclaration(n)) {
      definir(nomeDe(n.name), n.body, n);
    } else if ((ts.isPropertyAssignment(n) || ts.isPropertyDeclaration(n)) && ehFuncao(n.initializer)) {
      definir(nomeDe(n.name), n.initializer, n);
    }
    ts.forEachChild(n, visitar);
  };
  visitar(fonte);
  return { definicoes, ligacoes };
}

/** `fn nome` com nome de julgamento, num arquivo Rust, sem comentário. */
export function funcoesRustDoVocabulario(texto: string): string[] {
  return [...semComentarios(texto).matchAll(/\bfn\s+([A-Za-z_][A-Za-z0-9_]*)/g)]
    .map((m) => m[1]!)
    .filter((n) => VOCABULARIO.test(n));
}

/** Resolve um especificador relativo ou apelido da casa para um caminho do universo; `null` se é clone ou pacote. */
function resolver(de: string, especificador: string, existe: (c: string) => boolean): string | null {
  let base: string | null = null;
  if (especificador.startsWith("./") || especificador.startsWith("../")) base = normalize(join(dirname(de), especificador));
  else
    for (const [apelido, pasta] of Object.entries(APELIDOS_DA_CASA))
      if (especificador.startsWith(apelido)) base = pasta + especificador.slice(apelido.length);
  if (base === null) return null;
  for (const c of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, base.replace(/\.js$/, ".ts")])
    if (existe(c)) return c;
  return null;
}

/** A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null` se não existe. */
export function conferirAOrigemDoVeredito(
  arquivos: readonly string[],
  ler: (caminho: string) => string | null,
  excecao: typeof EXCECAO = EXCECAO,
): Resultado {
  const universo = arquivos.filter((c) => !fora(c) && (CODIGO_TS.test(c) || CODIGO_RS.test(c))).sort();
  const noUniverso = new Set(universo);
  const problemas: Problema[] = [];
  const lidos = { ts: 0, rs: 0 };
  const porArquivo = new Map<string, { definicoes: Definicao[]; ligacoes: Ligacoes }>();
  const rust: { caminho: string; nome: string }[] = [];

  for (const c of universo) {
    const texto = ler(c);
    if (texto === null) continue;
    if (CODIGO_RS.test(c)) {
      lidos.rs++;
      for (const nome of funcoesRustDoVocabulario(texto)) rust.push({ caminho: c, nome });
      continue;
    }
    lidos.ts++;
    porArquivo.set(c, lerArquivo(c, texto));
  }
  if (lidos.ts + lidos.rs === 0)
    problemas.push({ tipo: "universo-vazio", caminho: "—", detalhe: "nenhum arquivo de código lido" });

  const existe = (c: string) => noUniverso.has(c);
  const JULGAMENTO = "<o julgamento do Generate>";
  const chave = (c: string, n: string) => `${c}#${n}`;

  /** O que um nome, usado em `c`, quer dizer: uma chave de definição, o julgamento, ou nada que se saiba. */
  const significado = (c: string, nome: string, visto = new Set<string>()): string | null => {
    const k = chave(c, nome);
    if (visto.has(k)) return null;
    visto.add(k);
    const arq = porArquivo.get(c);
    if (!arq) return null;
    if (arq.definicoes.some((d) => d.nome === nome)) return k;
    const imp = arq.ligacoes.importa.get(nome);
    if (imp) {
      if (imp.especificador === O_JULGAMENTO.especificador && O_JULGAMENTO.simbolos.includes(imp.nome)) return JULGAMENTO;
      const alvo = resolver(c, imp.especificador, existe);
      return alvo ? significado(alvo, imp.nome, visto) : null;
    }
    for (const r of arq.ligacoes.reexporta) {
      if (r.comoNome !== null && r.comoNome !== nome) continue;
      if (r.especificador === O_JULGAMENTO.especificador && O_JULGAMENTO.simbolos.includes(r.nome ?? nome)) return JULGAMENTO;
      const alvo = resolver(c, r.especificador, existe);
      const s = alvo ? significado(alvo, r.nome ?? nome, visto) : null;
      if (s) return s;
    }
    return null;
  };

  // A cadeia de chamadas, até parar de mudar.
  const todas = [...porArquivo.values()].flatMap((a) => a.definicoes);
  const chega = new Set<string>();
  for (let mudou = true; mudou; ) {
    mudou = false;
    for (const d of todas) {
      const k = chave(d.caminho, d.nome);
      if (chega.has(k)) continue;
      if (
        d.chama.some((n) => {
          const s = significado(d.caminho, n);
          return s === JULGAMENTO || (s !== null && chega.has(s));
        })
      ) {
        chega.add(k);
        mudou = true;
      }
    }
  }

  const importam = [...porArquivo.entries()]
    .filter(([, a]) =>
      O_JULGAMENTO.simbolos.some((s) => {
        const i = a.ligacoes.importa.get(s);
        return i?.especificador === O_JULGAMENTO.especificador && i.nome === s;
      }),
    )
    .map(([c]) => c);

  const ponto = porArquivo.get(O_PONTO);
  const faltam = O_JULGAMENTO.simbolos.filter((s) => {
    const i = ponto?.ligacoes.importa.get(s);
    return !(i && i.especificador === O_JULGAMENTO.especificador && i.nome === s);
  });
  if (faltam.length)
    problemas.push({
      tipo: "ponto-sem-importacao",
      caminho: O_PONTO,
      detalhe: `o ponto do julgamento não importa ${faltam.join(" e ")} de ${O_JULGAMENTO.especificador}`,
    });

  for (const d of todas)
    if (O_JULGAMENTO.simbolos.includes(d.nome))
      problemas.push({
        tipo: "simbolo-redefinido",
        caminho: d.caminho,
        nome: d.nome,
        detalhe: `${d.caminho}:${d.linha} define ${d.nome}, o nome do julgamento do Generate — a D20 manda importar`,
      });

  const comNomeDeJulgamento: Resultado["comNomeDeJulgamento"] = [
    ...todas
      .filter((d) => VOCABULARIO.test(d.nome))
      .map((d) => ({ caminho: d.caminho, nome: d.nome, chega: chega.has(chave(d.caminho, d.nome)) })),
    ...rust.map((r) => ({ ...r, chega: false })),
  ];
  const declarada = (c: string, n: string) => excecao.some((e) => e.caminho === c && e.nome === n);
  for (const f of comNomeDeJulgamento)
    if (!f.chega && !declarada(f.caminho, f.nome))
      problemas.push({
        tipo: "julgamento-proprio",
        caminho: f.caminho,
        nome: f.nome,
        detalhe: `${f.caminho} define ${f.nome}, com nome de julgamento, e ela não chega a ${O_JULGAMENTO.simbolos.join(" nem a ")} pela cadeia de chamadas`,
      });
  for (const e of excecao)
    if (!comNomeDeJulgamento.some((f) => f.caminho === e.caminho && f.nome === e.nome && !f.chega))
      problemas.push({
        tipo: "excecao-que-sumiu",
        caminho: e.caminho,
        nome: e.nome,
        detalhe: `a exceção declara ${e.nome} em ${e.caminho} como julgamento próprio, e ele não existe mais ou passou a chegar ao Generate`,
      });

  return { lidos, importam, comNomeDeJulgamento, problemas };
}

/** A árvore de verdade: o `git ls-files` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirAOrigemDoVeredito(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "julgamento próprio com nome que não é de julgamento (`conferirPlano`, `nota`): a pergunta é pelo vocabulário; o que o pega é o ponto (`comum.ts`) ter de importar os dois símbolos e nenhum nome desta casa poder redefini-los",
  "a chamada por propriedade ou por namespace (`gen.montarRelatorio(…)`, `obj.julgar(…)`): a cadeia segue a chamada por identificador e o identificador passado como argumento; hoje nenhum julgamento da casa chega por outra forma",
  "o veredito do Generate RECALCULADO depois de chamado (chamar `montarRelatorio` e trocar a nota por outra conta): chegar ao Generate é condição, não prova de fidelidade — a fidelidade do número é das travas de prova (LAB-25, LAB-110)",
  "código em `upstream/`: é cópia intocável de motor de terceiro, que pode conferir a si mesmo; o julgamento que a regra proíbe é o do Lab",
  "Rust: só o nome (`fn`), sem cadeia de chamadas — o julgamento do Generate é TypeScript e não se chama de Rust; hoje há zero `fn` com nome de julgamento",
];
