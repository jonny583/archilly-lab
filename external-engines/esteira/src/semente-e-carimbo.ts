/**
 * A SEMENTE É A MESMA EM TODAS AS PROVAS, E O `geradoEm` É CARIMBO FIXO — duas frases da página que explica as provas, e
 * nenhuma régua as perguntava. (LAB-157, item 900, a dívida própria, D385)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `docs/provas/LEIA-ME.md` — a página que diz como ler as provas, e para onde o `CLAUDE.md` §7 manda quem mede — afirma
 * duas coisas sobre **todas** as provas:
 *
 * > *"**A semente é a mesma em todos** (`20260913`)"*
 * >
 * > *"**`geradoEm` é carimbo fixo** nas provas, de propósito — carimbo de hora real quebraria a comparação byte a byte"*
 *
 * As outras frases da página têm trava: a etiqueta do LAB-29 (`identidade.test.ts`), o determinismo com as duas
 * assinaturas (`prova-de-determinismo.ts`, LAB-103/105), o `null` que não é zero (`nulo-nunca-zero.ts`, LAB-147), a
 * versão do contrato em cada arquivo (as chaves do §7, `regras.test.ts`). **Estas duas não tinham nenhuma** — `grep` por
 * `geradoEm` e por *"carimbo fixo"* nas travas da esteira: nada lia as provas por elas. É a quinta espécie da dívida
 * própria, *mensagem fixa que afirma estado sem perguntar*: a página diz *"todos"* e ninguém conta.
 *
 * # O que se mediu (17/10/2026), por LUGAR
 *
 * O universo é todo `.json` versionado em `docs/provas/` — **84** arquivos —, percorridos chave a chave:
 *
 * - **`semente`**: 111 valores numéricos em 41 arquivos, **todos `20260913`**. A primeira frase é verdadeira;
 * - **`geradoEm`**: 34 valores (27 no alto do arquivo, 7 em `archilly.geradoEm` das SAÍDAS do contrato). **33** têm a
 *   forma de carimbo escolhido à mão — a data só (`2026-10-03`) ou a hora cheia (`2026-10-04T16:00:00.000Z`). **Um** tem
 *   a forma do relógio: `docs/provas/LAB-07/medicoes.json`, **`2026-09-13T14:31:44.835Z`**, com milissegundo.
 *
 * E por LUGAR o código que os escreve (todo `.ts`/`.js` versionado de `external-engines/` fora de `upstream/` e dos
 * testes, pela árvore sintática): as ferramentas do LAB-02 ao LAB-93 gravam `geradoEm: CARIMBO` ou uma data escrita; **duas
 * linhas leem o relógio para o `geradoEm`**:
 *
 * | linha | o que é |
 * |---|---|
 * | `testfit/ferramentas/medir.ts:257` | `geradoEm: new Date().toISOString()` — a que escreveu a prova do LAB-07 |
 * | `testfit/adapter/src/volta.ts:382` | `opcoes.geradoEm ?? new Date().toISOString()` — a queda de quem chama sem carimbo |
 *
 * **A primeira não é descuido: é desenho, com o nome trocado.** O `adapter/src/esteira.ts` diz, ao lado do
 * `CARIMBO_FIXO`: *"Quando rodou de verdade fica no JSON de medições, do lado de fora."* O LAB-07 gravou a hora real de
 * propósito — e usou para ela **a mesma chave** que a SAÍDA usa para o carimbo constante. Do LAB-47 em diante a casa deu
 * à hora real outro nome, `quando` (46 vezes nas provas), e o `geradoEm` ficou só com o carimbo. A página generalizou a
 * convenção nova para todas as provas, e a do LAB-07 ficou desmentindo-a calada. **Regra quase cumprida, guarda ausente,
 * e a página afirmando "todas" sem a exceção.**
 *
 * # O conserto, e o que não se regera
 *
 * - **a ferramenta**: o `medir.ts` passa a gravar a hora real em `quando` — o nome que a casa usa para isso desde o
 *   LAB-47 —, e o `geradoEm` sai dele. Muda o nome de um campo de metadado, nenhum número;
 * - **a prova do LAB-07 não se regera** (D182, D288: regerar é outra medição com o nome da antiga, e os números dela são
 *   citados nos relatórios do LAB-07 e do LAB-08). Fica como está, **declarada** em {@link CARIMBOS_DE_RELOGIO_DECLARADOS}
 *   com o motivo, e a página passa a citá-la;
 * - **a queda do `volta.ts`** fica, declarada em {@link RELOGIO_DECLARADO_NO_CODIGO}: quem grava prova passa o carimbo
 *   (`adapter/src/esteira.ts` e `esteira/src/guarda-em-acao.ts`), e quem cai nela são os testes do pacote, que não
 *   gravam nada. Trocá-la por um carimbo inventado seria fabricar uma data (D23).
 *
 * # Como ela cobra, nos dois sentidos
 *
 * 1. **toda `semente` numérica das provas é {@link SEMENTE_DA_CASA}** (`semente-diferente`), e o número escrito na página
 *    é o mesmo (`pagina-com-outra-semente`) — a página não pode dizer um e as provas outro;
 * 2. **todo `geradoEm` das provas tem a forma do carimbo escolhido** ({@link ehCarimboFixo}) — salvo o declarado
 *    (`carimbo-de-relogio`);
 * 3. **nenhum `geradoEm` do código lê o relógio** — `new Date()` sem argumento, `Date.now()`, `performance.now()` dentro
 *    do valor da propriedade, da variável ou do parâmetro com esse nome — salvo o declarado (`relogio-no-codigo`);
 * 4. **declaração que não acha mais o que declarou reprova** (`declaracao-sem-achado`): lista que não se revalida
 *    envelhece igual a comentário (D104);
 * 5. **a página diz as duas frases e cita cada prova declarada** (`pagina-sem-a-frase`, `pagina-cala-a-excecao`) —
 *    *"todos"* sem a exceção é a mentira por silêncio que esta régua nasceu para acabar;
 * 6. **publica o universo lido** — provas, sementes, carimbos, arquivos de código — e reprova universo vazio: *"verde:
 *    nenhum de 0"* se denuncia sozinho.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

import { aRegraEstaEscrita } from "./texto-das-regras.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

/** As duas frases da página que esta trava cobra — conferidas nela, para a trava saber de onde vem. */
export const A_FRASE_DA_SEMENTE = "A semente é a mesma em todos";
export const A_FRASE_DO_CARIMBO = "`geradoEm` é carimbo fixo";

/** A página. */
export const A_PAGINA = "docs/provas/LEIA-ME.md";

/** A semente da casa, a que a página escreve entre crases. */
export const SEMENTE_DA_CASA = 20260913;

/**
 * A forma do carimbo escolhido à mão: a data só, ou a data com hora e minuto cheios (segundo zero, milissegundo zero).
 * O relógio de verdade cai nela uma vez em sessenta mil — e a régua pergunta a forma, não a intenção.
 */
export function ehCarimboFixo(valor: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(valor) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00(\.000)?Z$/.test(valor);
}

/** Um valor lido numa prova: o arquivo, o caminho da chave dentro dele, o valor. */
export interface ValorNaProva {
  arquivo: string;
  caminho: string;
  valor: string | number;
}

/** Percorre um JSON e devolve toda `semente` numérica e todo `geradoEm` em texto, com o caminho. */
export function lerSementesECarimbos(
  arquivo: string,
  json: unknown,
): { sementes: ValorNaProva[]; carimbos: ValorNaProva[] } {
  const sementes: ValorNaProva[] = [];
  const carimbos: ValorNaProva[] = [];
  const andar = (o: unknown, caminho: string): void => {
    if (Array.isArray(o)) {
      o.forEach((v, i) => andar(v, `${caminho}[${i}]`));
      return;
    }
    if (o === null || typeof o !== "object") return;
    for (const [chave, v] of Object.entries(o)) {
      const aqui = caminho === "" ? chave : `${caminho}.${chave}`;
      if (chave === "semente" && typeof v === "number") sementes.push({ arquivo, caminho: aqui, valor: v });
      if (chave === "geradoEm" && typeof v === "string") carimbos.push({ arquivo, caminho: aqui, valor: v });
      andar(v, aqui);
    }
  };
  andar(json, "");
  return { sementes, carimbos };
}

/** Uma leitura do relógio dentro do valor de um `geradoEm`, no código. */
export interface RelogioNoCodigo {
  arquivo: string;
  linha: number;
  trecho: string;
}

const NOME = "geradoEm";

/** O valor lê o relógio? `new Date()` sem argumento, `Date.now()`, `performance.now()` — em qualquer ponto dele. */
function leORelogio(no: ts.Node): boolean {
  let sim = false;
  const ver = (n: ts.Node): void => {
    if (sim) return;
    if (ts.isNewExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "Date") {
      if (!n.arguments || n.arguments.length === 0) {
        sim = true;
        return;
      }
    }
    if (
      ts.isCallExpression(n) &&
      ts.isPropertyAccessExpression(n.expression) &&
      n.expression.name.text === "now" &&
      ts.isIdentifier(n.expression.expression) &&
      (n.expression.expression.text === "Date" || n.expression.expression.text === "performance")
    ) {
      sim = true;
      return;
    }
    ts.forEachChild(n, ver);
  };
  ver(no);
  return sim;
}

/**
 * A régua do código: pela árvore sintática (comentário e texto entre aspas não contam, D142/D257), toda propriedade,
 * variável ou parâmetro chamado `geradoEm` cujo valor lê o relógio.
 */
export function relogioNoCarimbo(arquivo: string, fonte: string): RelogioNoCodigo[] {
  const achados: RelogioNoCodigo[] = [];
  const sf = ts.createSourceFile(arquivo, fonte, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const registrar = (n: ts.Node, valor: ts.Node): void => {
    if (!leORelogio(valor)) return;
    const { line } = sf.getLineAndCharacterOfPosition(n.getStart(sf));
    achados.push({ arquivo, linha: line + 1, trecho: n.getText(sf).replace(/\s+/g, " ").slice(0, 120) });
  };
  const andar = (n: ts.Node): void => {
    if (ts.isPropertyAssignment(n) && ts.isIdentifier(n.name) && n.name.text === NOME) registrar(n, n.initializer);
    if (ts.isPropertyAssignment(n) && ts.isStringLiteral(n.name) && n.name.text === NOME) registrar(n, n.initializer);
    if (
      (ts.isVariableDeclaration(n) || ts.isParameter(n) || ts.isBindingElement(n)) &&
      ts.isIdentifier(n.name) &&
      n.name.text === NOME &&
      n.initializer
    ) {
      registrar(n, n.initializer);
    }
    if (
      ts.isBinaryExpression(n) &&
      n.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ((ts.isIdentifier(n.left) && n.left.text === NOME) ||
        (ts.isPropertyAccessExpression(n.left) && n.left.name.text === NOME))
    ) {
      registrar(n, n.right);
    }
    ts.forEachChild(n, andar);
  };
  andar(sf);
  return achados;
}

/** Uma prova cujo `geradoEm` é a hora real, declarada: o arquivo, o caminho da chave, o valor de hoje e o motivo. */
export interface CarimboDeRelogioDeclarado {
  arquivo: string;
  caminho: string;
  valor: string;
  motivo: string;
}

/** As provas com o relógio no `geradoEm`. Uma — e ela não se regera. */
export const CARIMBOS_DE_RELOGIO_DECLARADOS: readonly CarimboDeRelogioDeclarado[] = [
  {
    arquivo: "docs/provas/LAB-07/medicoes.json",
    caminho: "geradoEm",
    valor: "2026-09-13T14:31:44.835Z",
    motivo:
      "a hora real da medição do LAB-07, gravada de propósito (`testfit/adapter/src/esteira.ts`: \"quando rodou de " +
      "verdade fica no JSON de medições\") sob a chave que a SAÍDA usa para o carimbo constante — do LAB-47 em diante a " +
      "hora real se chama `quando`. Não se regera: é o registro da medição daquele dia, citado nos relatórios do LAB-07 " +
      "e do LAB-08 (D182, D288); a ferramenta grava `quando` desde o LAB-157",
  },
];

/** Uma linha de código que lê o relógio para o `geradoEm`, declarada: o arquivo, o trecho que a acha e o motivo. */
export interface RelogioDeclarado {
  arquivo: string;
  trecho: string;
  motivo: string;
}

/** O código que pode ler o relógio para o `geradoEm`. Uma linha — a queda, não o caminho de quem grava prova. */
export const RELOGIO_DECLARADO_NO_CODIGO: readonly RelogioDeclarado[] = [
  {
    arquivo: "external-engines/testfit/adapter/src/volta.ts",
    trecho: "opcoes.geradoEm ?? new Date().toISOString()",
    motivo:
      "a queda de quem chama `voltaParaOContrato` sem carimbo: quem grava prova passa o carimbo (`adapter/src/esteira.ts` " +
      "com o `CARIMBO_FIXO`, `esteira/src/guarda-em-acao.ts` com o dela), e quem cai na queda são os testes do pacote, " +
      "que não gravam nada. Trocá-la por uma data constante seria inventar quando a saída nasceu (D23)",
  },
];

/** O que entra na régua do código: `.ts`/`.tsx`/`.js`/`.mjs` de `external-engines/`, fora do `upstream/` e dos testes. */
export function entraNoCodigo(caminho: string): boolean {
  if (!caminho.startsWith("external-engines/")) return false;
  if (!/\.(ts|tsx|js|mjs)$/.test(caminho)) return false;
  if (caminho.includes("/upstream/") || caminho.includes("/node_modules/")) return false;
  if (caminho.includes("/tests/") || /\.test\.(ts|tsx|js|mjs)$/.test(caminho)) return false;
  return true;
}

/** O que entra na régua das provas: todo `.json` de `docs/provas/`. */
export function entraNasProvas(caminho: string): boolean {
  return caminho.startsWith("docs/provas/") && caminho.endsWith(".json");
}

export type TipoDoProblema =
  | "semente-diferente"
  | "carimbo-de-relogio"
  | "relogio-no-codigo"
  | "declaracao-sem-achado"
  | "pagina-sem-a-frase"
  | "pagina-com-outra-semente"
  | "pagina-cala-a-excecao"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDoProblema;
  detalhe: string;
}

export interface EntradaDaConferencia {
  provas: readonly { arquivo: string; json: unknown }[];
  codigo: readonly { arquivo: string; fonte: string }[];
  pagina: string;
}

export interface ResultadoDaConferencia {
  provas: number;
  sementes: number;
  arquivosComSemente: number;
  carimbos: number;
  carimbosFixos: number;
  arquivosDeCodigo: number;
  relogiosNoCodigo: RelogioNoCodigo[];
  problemas: Problema[];
}

/** A conferência inteira, pura: as provas, o código e a página entram já lidos. */
export function conferirASementeEOCarimbo(
  e: EntradaDaConferencia,
  carimbosDeclarados: readonly CarimboDeRelogioDeclarado[] = CARIMBOS_DE_RELOGIO_DECLARADOS,
  relogiosDeclarados: readonly RelogioDeclarado[] = RELOGIO_DECLARADO_NO_CODIGO,
): ResultadoDaConferencia {
  const problemas: Problema[] = [];

  // ── a página ────────────────────────────────────────────────────────────
  for (const frase of [A_FRASE_DA_SEMENTE, A_FRASE_DO_CARIMBO]) {
    if (!aRegraEstaEscrita(e.pagina, frase)) {
      problemas.push({ tipo: "pagina-sem-a-frase", detalhe: `a página não diz mais "${frase}" — de onde vem a régua?` });
    }
  }
  const numeros = [...e.pagina.matchAll(/semente é a mesma em todos\*{0,2}\s*\(`(\d+)`\)/gi)].map((m) => Number(m[1]));
  if (numeros.length === 0 && aRegraEstaEscrita(e.pagina, A_FRASE_DA_SEMENTE)) {
    problemas.push({ tipo: "pagina-com-outra-semente", detalhe: "a página diz que a semente é a mesma e não diz qual" });
  }
  for (const n of numeros) {
    if (n !== SEMENTE_DA_CASA) {
      problemas.push({
        tipo: "pagina-com-outra-semente",
        detalhe: `a página escreve ${n}; a semente das provas é ${SEMENTE_DA_CASA}`,
      });
    }
  }
  for (const d of carimbosDeclarados) {
    const relativo = d.arquivo.replace(/^docs\/provas\//, "");
    if (!e.pagina.includes(relativo)) {
      problemas.push({
        tipo: "pagina-cala-a-excecao",
        detalhe: `a página diz que o \`geradoEm\` é fixo e não cita \`${relativo}\`, que não é`,
      });
    }
  }

  // ── as provas ───────────────────────────────────────────────────────────
  let sementes = 0;
  let carimbos = 0;
  let carimbosFixos = 0;
  const comSemente = new Set<string>();
  const declaradosAchados = new Set<CarimboDeRelogioDeclarado>();
  for (const p of e.provas) {
    const lido = lerSementesECarimbos(p.arquivo, p.json);
    for (const s of lido.sementes) {
      sementes++;
      comSemente.add(s.arquivo);
      if (s.valor !== SEMENTE_DA_CASA) {
        problemas.push({
          tipo: "semente-diferente",
          detalhe: `${s.arquivo} · ${s.caminho} = ${s.valor}, e a página diz que é ${SEMENTE_DA_CASA} em todos`,
        });
      }
    }
    for (const c of lido.carimbos) {
      carimbos++;
      if (ehCarimboFixo(String(c.valor))) {
        carimbosFixos++;
        continue;
      }
      const d = carimbosDeclarados.find(
        (x) => x.arquivo === c.arquivo && x.caminho === c.caminho && x.valor === c.valor,
      );
      if (d) {
        declaradosAchados.add(d);
        continue;
      }
      problemas.push({
        tipo: "carimbo-de-relogio",
        detalhe: `${c.arquivo} · ${c.caminho} = ${c.valor} — a hora real mora em \`quando\`; o \`geradoEm\` é carimbo fixo`,
      });
    }
  }
  for (const d of carimbosDeclarados) {
    if (!declaradosAchados.has(d)) {
      problemas.push({
        tipo: "declaracao-sem-achado",
        detalhe: `${d.arquivo} · ${d.caminho} está declarada com o relógio e não tem mais ${d.valor} — a declaração sobra`,
      });
    }
  }

  // ── o código ────────────────────────────────────────────────────────────
  const relogiosNoCodigo: RelogioNoCodigo[] = [];
  const relogiosAchados = new Set<RelogioDeclarado>();
  for (const c of e.codigo) {
    for (const r of relogioNoCarimbo(c.arquivo, c.fonte)) {
      relogiosNoCodigo.push(r);
      const d = relogiosDeclarados.find((x) => x.arquivo === r.arquivo && r.trecho.includes(x.trecho));
      if (d) {
        relogiosAchados.add(d);
        continue;
      }
      problemas.push({
        tipo: "relogio-no-codigo",
        detalhe: `${r.arquivo}:${r.linha} · ${r.trecho} — o \`geradoEm\` lê o relógio; a hora real vai em \`quando\``,
      });
    }
  }
  for (const d of relogiosDeclarados) {
    if (!relogiosAchados.has(d)) {
      problemas.push({
        tipo: "declaracao-sem-achado",
        detalhe: `${d.arquivo} está declarado lendo o relógio no \`geradoEm\` e não lê mais — a declaração sobra`,
      });
    }
  }

  if (e.provas.length === 0 || e.codigo.length === 0 || sementes === 0 || carimbos === 0) {
    problemas.push({
      tipo: "universo-vazio",
      detalhe: `provas ${e.provas.length} · código ${e.codigo.length} · sementes ${sementes} · carimbos ${carimbos}`,
    });
  }

  return {
    provas: e.provas.length,
    sementes,
    arquivosComSemente: comSemente.size,
    carimbos,
    carimbosFixos,
    arquivosDeCodigo: e.codigo.length,
    relogiosNoCodigo,
    problemas,
  };
}

/** A árvore de verdade: o que o `git` carrega, lido do disco. */
export function lerAArvore(raiz: string): EntradaDaConferencia {
  const arquivos = arquivosQueOGitCarrega(raiz);
  return {
    provas: arquivos
      .filter(entraNasProvas)
      .map((arquivo) => ({ arquivo, json: JSON.parse(readFileSync(join(raiz, arquivo), "utf8")) as unknown })),
    codigo: arquivos
      .filter(entraNoCodigo)
      .map((arquivo) => ({ arquivo, fonte: readFileSync(join(raiz, arquivo), "utf8") })),
    pagina: readFileSync(join(raiz, A_PAGINA), "utf8"),
  };
}

/** O que esta régua NÃO alcança — dito, para a guarda não mentir pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o carimbo com OUTRO NOME: só a chave `geradoEm` é perguntada; `quando` é a hora real por convenção, e as outras " +
    "chaves de data (`aConta.disparos[].data`, `quandoOCommitFoiFeito`) são relato, não carimbo",
  "o relógio que chega ao `geradoEm` por VARIÁVEL de outro nome (`const agora = new Date(); … geradoEm: agora`): a " +
    "régua lê o valor escrito ali, não segue a variável",
  "os TESTES: carimbam o que quiserem, porque não gravam prova — a queda do `volta.ts` existe para eles",
  "a semente com OUTRO NOME (`sementeDoMotor`, `outraSemente`): só a chave `semente` numérica; a terceira pergunta do " +
    "determinismo (a outra semente) tem a régua dela, `prova-de-determinismo.ts`",
  "SE o carimbo escolhido é o do dia da medição: a forma diz que alguém o escolheu, não que escolheu bem",
  "o JSON fora de `docs/provas/` (`docs/contratos/saidas/`, `outputs/`): a frase da página é sobre as provas",
];
