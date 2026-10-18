/**
 * O SYMBIOS RODA EM NODE 22+ SEM NPM — e nada perguntava se ainda rodava. (LAB-133, item 900, a dívida própria, D361)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §7 diz: *"Duas pilhas convivem (D14, D17): Symbios em Node 22+ sem npm; LAB-07 em Bun."* A
 * D14 é a decisão por trás da primeira metade: o adaptador do Symbios é TypeScript rodado com
 * `node --experimental-strip-types`, **zero pacotes npm** — para rodar igual no Node e no navegador, e para o
 * Lab inteiro poder ser apagado sem desinstalar nada. E ela diz o preço: *"o que isso proíbe: `enum`,
 * `namespace` e propriedade de parâmetro em construtor — o modo de remoção de tipos do Node não os suporta"*.
 *
 * Só que **ninguém roda o adaptador no Node**: a esteira o importa pelo apelido `@symbios/*` e o roda no
 * **Bun**, que aceita `enum`, `namespace`, propriedade de parâmetro e import relativo sem extensão. Medido por
 * mutação (16/10/2026), a suíte inteira da esteira, o `typecheck` e o `lint` com três mudanças plantadas ao
 * mesmo tempo — um `enum`, uma classe com `constructor(private a: number)` e um `namespace` no `src/hash.ts`, e
 * um `import … from "../src/geo"` (sem extensão) no `ferramentas/gerar-terrenos.ts` → **nenhuma falha que
 * fale da regra**. Caíram duas, as duas contadoras do tamanho da árvore (`chamadas.test.ts`, LAB-52, e
 * `configuracao.test.ts`, LAB-57), que caem com **qualquer** linha a mais em qualquer arquivo; a mensagem delas
 * diz *"linhas 71 866 na árvore, 71 861 na prova"*. Enquanto isso o Node recusava o adaptador inteiro:
 * `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX — TypeScript enum is not supported in strip-only mode`.
 *
 * # O que se mediu, por LUGAR
 *
 * - **os arquivos**: todo `.ts` versionado em `external-engines/symbios/adapter/` — dezesseis (onze em `src/`,
 *   cinco em `ferramentas/`). Rodados um a um no Node 22.22 com `--experimental-strip-types`: os onze de
 *   `src/` e dois de `ferramentas/` carregam; dois leem o `.wasm` (que não se constrói aqui) e **um não roda no
 *   Node de propósito** — a `ferramentas/navegador/prova-automatica.ts`, que é `#!/usr/bin/env bun` e importa
 *   o `playwright` do pacote da esteira (LAB-31): é o passo do verde, não o adaptador;
 * - **os manifestos**: nenhum `package.json` em `external-engines/symbios/` fora do `upstream/`.
 *
 * # Como ela cobra
 *
 * 1. **o próprio Node tira os tipos de cada arquivo** (`node:module` · `stripTypeScriptTypes`, modo `strip`) —
 *    quem diz o que o Node aceita é o Node, não uma lista minha de sintaxes proibidas;
 * 2. **toda importação de verdade** (lida pelo `Bun.Transpiler`, que ignora comentário e texto entre aspas —
 *    a régua lê o `import`, não a menção: D142, D257) **é `node:`, módulo nativo do Node, ou relativa com
 *    extensão** — o Node não completa `./geo` para `./geo.ts` — **e aponta para arquivo que existe**;
 * 3. **pacote npm só na exceção declarada**, arquivo a arquivo e pacote a pacote, com o motivo — e a exceção
 *    que deixou de ser usada reprova (lista que não se revalida envelhece, D104);
 * 4. **nenhum `package.json`** em `external-engines/symbios/` fora do `upstream/` (que é do autor e intocável,
 *    D360).
 *
 * O teste ainda **roda** os onze de `src/` no Node de verdade — leitura de fonte é hipótese, rodada é dado
 * (D308).
 *
 * # O que ela NÃO cobra, dito
 *
 * - **o `import type`** de pacote: some na remoção de tipos, então o Node não precisa dele — e o
 *   `Bun.Transpiler` não o devolve. O adaptador hoje não tem nenhum;
 * - **o `.js` da página do navegador** (`ferramentas/navegador/prova.js`): roda no navegador, não no Node;
 * - **os dois arquivos que leem o `.wasm` rodarem até o fim**: a régua confere que o Node os aceita; rodá-los
 *   escreve medição e pede o artefato de build;
 * - **o Node 22 exato**: o teste exige 22 ou mais e o `stripTypeScriptTypes` (que nasceu no 22.13); se o Node
 *   da máquina for mais velho, reprova com a receita, nunca pula.
 */
import { builtinModules } from "node:module";
import { dirname, join, normalize } from "node:path";

/** A frase da regra, conferida no teste onde ela mora (o `CLAUDE.md` §7). */
export const A_REGRA = "Symbios em Node 22+ sem npm; LAB-07 em Bun.";

/** A pasta do adaptador do Symbios, a partir da raiz. */
export const ADAPTADOR = "external-engines/symbios/adapter";

/** A pasta do motor de fora, a partir da raiz — os manifestos são procurados nela, fora do `upstream/`. */
export const SYMBIOS = "external-engines/symbios";

/** O Node mais velho que a regra admite. */
export const NODE_MINIMO = 22;

/** Um arquivo que importa pacote npm de propósito, e por quê. */
export type ExcecaoDePacote = {
  /** O arquivo, a partir da raiz. */
  arquivo: string;
  /** Os pacotes que ele importa — exatamente estes. */
  pacotes: readonly string[];
  motivo: string;
};

/** As exceções, uma por arquivo. **Acrescentar uma é decisão**, com o motivo e no `DECISOES.md`. */
export const EXCECOES_DE_PACOTE: readonly ExcecaoDePacote[] = [
  {
    arquivo: `${ADAPTADOR}/ferramentas/navegador/prova-automatica.ts`,
    pacotes: ["playwright"],
    motivo:
      "é o passo `prova no navegador` do `conferir.sh` (LAB-31): roda no Bun, de dentro da esteira " +
      "(`#!/usr/bin/env bun`), com o `playwright` do `package.json` dela — não é o adaptador, e o Node nunca o carrega",
  },
  {
    arquivo: `${ADAPTADOR}/ferramentas/navegador/rolagem-no-celular.ts`,
    pacotes: ["playwright"],
    motivo:
      "é o passo `rolagem no celular` do `conferir.sh` (LAB-182, D410): roda no Bun, de dentro da esteira " +
      "(`#!/usr/bin/env bun`), com o `playwright` do `package.json` dela — mede a bancada, não é o adaptador, e o Node nunca o carrega",
  },
];

/** Um arquivo lido: o caminho a partir da raiz, e as importações que o `Bun.Transpiler` acha nele. */
export type ArquivoLido = { caminho: string; importacoes: readonly string[] };

/** As importações de verdade de um código TypeScript — sem comentário, sem texto entre aspas, sem `import type`. */
export function importacoesDe(codigo: string): string[] {
  const t = new Bun.Transpiler({ loader: "ts" });
  // O `scanImports` não aceita a linha `#!` no topo (medido: "Unexpected #!"), e o Node aceita — as
  // ferramentas a têm. Ela vira comentário do mesmo tamanho.
  const semShebang = codigo.startsWith("#!") ? `//${codigo.slice(2)}` : codigo;
  return t.scanImports(semShebang).map((i) => i.path);
}

const NATIVOS = new Set(builtinModules);

/** `node:fs` e `fs` são do Node; `./x.ts` é relativo; o resto é pacote. */
export function tipoDaImportacao(especificador: string): "node" | "relativo" | "pacote" {
  if (especificador.startsWith("node:") || NATIVOS.has(especificador)) return "node";
  if (especificador.startsWith("./") || especificador.startsWith("../") || especificador.startsWith("/")) {
    return "relativo";
  }
  return "pacote";
}

/** O nome do pacote de um especificador: `@a/b/c` → `@a/b`, `a/b` → `a`. */
export function nomeDoPacote(especificador: string): string {
  const partes = especificador.split("/");
  return especificador.startsWith("@") ? partes.slice(0, 2).join("/") : partes[0]!;
}

/** As extensões com que o Node resolve um import relativo sem adivinhar. */
const EXTENSOES = [".ts", ".mts", ".js", ".mjs"];

export type ProblemaDoNode = {
  tipo:
    | "sintaxe-que-o-node-nao-tira"
    | "sem-veredito-do-node"
    | "pacote-npm"
    | "relativo-sem-extensao"
    | "relativo-quebrado"
    | "manifesto-npm"
    | "excecao-sem-arquivo"
    | "excecao-que-sobrou";
  arquivo: string;
  detalhe: string;
};

/** O que a régua lê de fora — ela é pura. */
export type OQueSeLeu = {
  /** `git ls-files`, da raiz. */
  versionados: readonly string[];
  /** Os `.ts` do adaptador, com as importações de cada um. */
  arquivos: readonly ArquivoLido[];
  /** O veredito do Node para cada arquivo: `null` se ele tira os tipos, ou o erro dele. */
  vereditoDoNode: (caminho: string) => string | null | undefined;
  /** Se um caminho (a partir da raiz) existe. */
  existe: (caminho: string) => boolean;
};

/** Os `.ts` versionados do adaptador. */
export function arquivosDoAdaptador(versionados: readonly string[]): string[] {
  return versionados.filter((f) => f.startsWith(`${ADAPTADOR}/`) && f.endsWith(".ts")).sort();
}

/** Os `package.json` versionados no Symbios, fora do `upstream/`. */
export function manifestosNoSymbios(versionados: readonly string[]): string[] {
  return versionados.filter(
    (f) =>
      f.startsWith(`${SYMBIOS}/`) &&
      !f.startsWith(`${SYMBIOS}/upstream/`) &&
      (f.endsWith("/package.json") || f.endsWith("/package-lock.json") || f.endsWith("/bun.lock")),
  );
}

export function conferirONodeSemNpm(
  lido: OQueSeLeu,
  excecoes: readonly ExcecaoDePacote[] = EXCECOES_DE_PACOTE,
): { arquivos: number; importacoes: number; problemas: ProblemaDoNode[] } {
  const problemas: ProblemaDoNode[] = [];
  const porArquivo = new Map(excecoes.map((e) => [e.arquivo, e]));
  const usados = new Map<string, Set<string>>();
  let importacoes = 0;

  for (const { caminho, importacoes: lista } of lido.arquivos) {
    const veredito = lido.vereditoDoNode(caminho);
    if (veredito === undefined) {
      problemas.push({ tipo: "sem-veredito-do-node", arquivo: caminho, detalhe: "o Node não foi perguntado sobre este arquivo" });
    } else if (veredito !== null) {
      problemas.push({ tipo: "sintaxe-que-o-node-nao-tira", arquivo: caminho, detalhe: veredito });
    }

    for (const esp of lista) {
      importacoes++;
      const tipo = tipoDaImportacao(esp);
      if (tipo === "pacote") {
        const pacote = nomeDoPacote(esp);
        const excecao = porArquivo.get(caminho);
        if (excecao?.pacotes.includes(pacote)) {
          if (!usados.has(caminho)) usados.set(caminho, new Set());
          usados.get(caminho)!.add(pacote);
        } else {
          problemas.push({ tipo: "pacote-npm", arquivo: caminho, detalhe: `importa \`${esp}\` — pacote npm` });
        }
      } else if (tipo === "relativo") {
        if (!EXTENSOES.some((x) => esp.endsWith(x))) {
          problemas.push({
            tipo: "relativo-sem-extensao",
            arquivo: caminho,
            detalhe: `importa \`${esp}\` — o Node não completa a extensão`,
          });
        } else {
          const alvo = normalize(join(dirname(caminho), esp));
          if (!lido.existe(alvo)) {
            problemas.push({ tipo: "relativo-quebrado", arquivo: caminho, detalhe: `importa \`${esp}\` — \`${alvo}\` não existe` });
          }
        }
      }
    }
  }

  for (const manifesto of manifestosNoSymbios(lido.versionados)) {
    problemas.push({ tipo: "manifesto-npm", arquivo: manifesto, detalhe: "manifesto de pacote no Symbios — a regra é sem npm" });
  }

  const lidos = new Set(lido.arquivos.map((a) => a.caminho));
  for (const e of excecoes) {
    if (!lidos.has(e.arquivo)) {
      problemas.push({ tipo: "excecao-sem-arquivo", arquivo: e.arquivo, detalhe: "exceção declarada para arquivo que não está no adaptador" });
      continue;
    }
    for (const p of e.pacotes) {
      if (!usados.get(e.arquivo)?.has(p)) {
        problemas.push({ tipo: "excecao-que-sobrou", arquivo: e.arquivo, detalhe: `\`${p}\` está na exceção e o arquivo não o importa mais` });
      }
    }
  }

  return { arquivos: lido.arquivos.length, importacoes, problemas };
}

/** O que o Node desta máquina responde: a versão, se tem o removedor de tipos, e o veredito de cada código. */
export type RespostaDoNode = { versao: string; temORemovedor: boolean; vereditos: Record<string, string | null> };

/** O programa que o Node roda: lê `{caminho: código}` da entrada e devolve a {@link RespostaDoNode}. */
export const PERGUNTA_AO_NODE = [
  "const m = require('node:module');",
  "let s = '';",
  "process.stdin.on('data', (d) => (s += d)).on('end', () => {",
  "  const codigos = JSON.parse(s);",
  "  const r = { versao: process.versions.node, temORemovedor: typeof m.stripTypeScriptTypes === 'function', vereditos: {} };",
  "  if (r.temORemovedor) for (const [k, v] of Object.entries(codigos)) {",
  "    try { m.stripTypeScriptTypes(v, { mode: 'strip' }); r.vereditos[k] = null; }",
  "    catch (e) { r.vereditos[k] = (e.code || 'ERRO') + ': ' + String(e.message).split('\\n')[0]; }",
  "  }",
  "  process.stdout.write(JSON.stringify(r));",
  "});",
].join("\n");

/** A versão maior de `22.22.0`. */
export function versaoMaior(versao: string): number {
  return Number(versao.split(".")[0]);
}
