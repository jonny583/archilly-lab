/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PASTA DE TESTES DO SYMBIOS — "vazio nesta fase", e o adaptador nasceu no dia seguinte. (LAB-187, item 900, D415)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `external-engines/symbios/tests/README.md` nasceu no LAB-00 (09/09/2026) e nunca mais foi tocado. Ele dizia:
 *
 * > *"Vazio nesta fase. […] Os testes que a especificação exige (`test_minimal`, `test_coordinates`,
 * > `test_output_conversion`, `test_validator_compatibility`) pressupõem um Adapter, que só nasce na Etapa C. Serão
 * > escritos aqui quando houver o que testar."*
 *
 * O adaptador nasceu no LAB-01 (10/09/2026, `069fd29`), e os testes dele nasceram do LAB-02 em diante (14/09/2026) — na
 * suíte da esteira, não aqui. A pasta continua vazia, e é por isso que a frase envelheceu calada: o que ela dizia da
 * pasta seguiu verdade, e o que dizia do mundo em volta dela deixou de ser. Espécie da regra 16: **mensagem fixa que
 * afirma estado sem perguntar** — e nenhuma régua lia a página (o LAB-187 contou: zero leitores no código).
 *
 * # As cinco perguntas, por LUGAR
 *
 * 1. **A pasta** — o que o `git` carrega em {@link A_PASTA}. A página afirma {@link A_PASTA_DIZ}; a régua confere que é
 *    só ela. Teste novo posto ali reprova até a página dizer outra coisa.
 * 2. **O adaptador** — se o `git` carrega código em {@link O_ADAPTADOR}, a página não pode afirmar (fora do riscado, da
 *    crase e da citação) que ele ainda vai nascer ({@link AS_FORMAS_VELHAS}).
 * 3. **Os testes do adaptador** — a lista entre as marcas {@link MARCA_ABRE} e {@link MARCA_FECHA} é conferida **nos
 *    dois sentidos** contra os `*.test.ts` de {@link A_SUITE} que carregam o `.wasm` da ponte ({@link CARREGA_O_WASM}):
 *    arquivo que carrega e a lista não nomeia, e nome da lista que não carrega (ou não existe), reprovam.
 * 4. **Os caminhos** — todo caminho entre crases que começa em `../` resolve, a partir da pasta, num caminho que o `git`
 *    carrega (arquivo, ou pasta com algum arquivo).
 * 5. **Os quatro nomes da especificação** — cada um está em {@link A_ESPECIFICACAO} e na página; e a página diz
 *    ({@link A_PAGINA_DIZ_DOS_NOMES}) que nenhum teste desta casa tem esses nomes. A régua confere: nenhum `*.test.ts` e
 *    nenhum `.rs` fora do `upstream/` os escreve. No dia em que um escrever, a página tem de mudar.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, normalize } from "node:path";

import { comoARegraSeLe, semRiscadoNemCitado } from "./texto-das-regras.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PASTA = "external-engines/symbios/tests/";
export const A_PAGINA = `${A_PASTA}README.md`;
export const O_ADAPTADOR = "external-engines/symbios/adapter/src/";
export const A_SUITE = "external-engines/esteira/tests/";
export const A_ESPECIFICACAO = "docs/referencia/LABORATORIO.md";

/** O que a página afirma da pasta — lido pelo `comoARegraSeLe`, crase incluída. */
export const A_PASTA_DIZ = "O que o `git` carrega nesta pasta: só este `README.md`.";
/** O que a página afirma dos quatro nomes. */
export const A_PAGINA_DIZ_DOS_NOMES = "não existem como nome de teste em lugar nenhum desta casa";

export const MARCA_ABRE = "<!-- os-testes-do-adaptador (LAB-187) -->";
export const MARCA_FECHA = "<!-- /os-testes-do-adaptador -->";

/** Carregar o `.wasm` da ponte é chamar a porta do adaptador. */
export const CARREGA_O_WASM = /\bMotor\.carregar\s*\(/;

export const OS_NOMES_DA_ESPECIFICACAO: readonly string[] = [
  "test_minimal",
  "test_coordinates",
  "test_output_conversion",
  "test_validator_compatibility",
];

/** As frases que dizem que o adaptador (ou os testes dele aqui) ainda vão nascer. Leem o parágrafo já normalizado. */
export const AS_FORMAS_VELHAS: readonly { id: string; padrao: RegExp }[] = [
  { id: "adapter-por-nascer", padrao: /\badapter\b[^.]{0,60}\b(?:só nasce|ainda não existe|não escrito|nasce na etapa)/i },
  { id: "testes-por-escrever", padrao: /\bserão escritos aqui\b/i },
  { id: "vazio-nesta-fase", padrao: /\bvazi[oa] nesta fase\b/i },
];

/**
 * Os arquivos que escrevem os quatro nomes de propósito e não são teste do motor: esta régua e a prova dela. Cada um
 * com o motivo; a régua confere que cada um existe.
 */
export const QUEM_ESCREVE_OS_NOMES_DE_PROPOSITO: readonly { arquivo: string; motivo: string }[] = [
  { arquivo: "external-engines/esteira/src/a-pasta-de-testes-do-symbios.ts", motivo: "a régua que pergunta os nomes" },
  {
    arquivo: "external-engines/esteira/tests/a-pasta-de-testes-do-symbios.test.ts",
    motivo: "a prova da régua planta os nomes num teste sintético, para ver a régua acusar",
  },
];

const foraDoUniverso = (c: string) => c.includes("node_modules/") || c.split("/").includes("upstream");

/** Os nomes entre as marcas, um por item de lista, entre crases. `null` se as marcas faltam. */
export function aListaDaPagina(texto: string): string[] | null {
  const a = texto.indexOf(MARCA_ABRE);
  const f = texto.indexOf(MARCA_FECHA);
  if (a < 0 || f < 0 || f < a) return null;
  return texto
    .slice(a + MARCA_ABRE.length, f)
    .split("\n")
    .map((l) => /^\s*-\s+`([^`]+)`/.exec(l)?.[1])
    .filter((n): n is string => n !== undefined);
}

/** Os caminhos entre crases que começam em `../`. */
export function osCaminhosRelativos(texto: string): string[] {
  return [...texto.matchAll(/`(\.\.\/[^`\s]+)`/g)].map((m) => m[1] as string);
}

export interface Resultado {
  naPasta: string[];
  testesLidos: number;
  carregamOWasm: string[];
  naLista: string[];
  codigoLido: number;
  problemas: string[];
}

export function conferir(caminhos: readonly string[], ler: (c: string) => string | null): Resultado {
  const problemas: string[] = [];
  const carrega = new Set(caminhos);
  const pagina = ler(A_PAGINA);

  // 1 · a pasta
  const naPasta = caminhos.filter((c) => c.startsWith(A_PASTA));
  if (pagina === null) {
    problemas.push(`${A_PAGINA}: a página não existe`);
    return { naPasta, testesLidos: 0, carregamOWasm: [], naLista: [], codigoLido: 0, problemas };
  }
  const lida = comoARegraSeLe(pagina);
  if (!lida.includes(A_PASTA_DIZ)) problemas.push(`${A_PAGINA}: não diz o que o git carrega na pasta («${A_PASTA_DIZ}»)`);
  else if (naPasta.length !== 1 || naPasta[0] !== A_PAGINA)
    problemas.push(`${A_PAGINA}: diz «só este README.md», e o git carrega ${naPasta.length} arquivo(s) na pasta: ${naPasta.join(", ")}`);

  // 2 · o adaptador
  const adaptador = caminhos.filter((c) => c.startsWith(O_ADAPTADOR));
  if (adaptador.length > 0) {
    for (const paragrafo of pagina.split(/\n\s*\n/)) {
      const p = semRiscadoNemCitado(comoARegraSeLe(paragrafo));
      for (const f of AS_FORMAS_VELHAS) {
        const m = f.padrao.exec(p);
        if (m) problemas.push(`${A_PAGINA}: diz que ainda vai nascer (${f.id}), e o git carrega ${adaptador.length} arquivo(s) em ${O_ADAPTADOR} — «${m[0]}»`);
      }
    }
  }

  // 3 · os testes do adaptador, nos dois sentidos
  const testes = caminhos.filter((c) => c.startsWith(A_SUITE) && c.endsWith(".test.ts"));
  const carregamOWasm: string[] = [];
  for (const t of testes) {
    const texto = ler(t);
    if (texto === null) problemas.push(`${t}: o git carrega e não se leu`);
    else if (CARREGA_O_WASM.test(texto)) carregamOWasm.push(t.slice(A_SUITE.length));
  }
  if (carregamOWasm.length === 0) problemas.push(`${A_SUITE}: nenhum teste carrega o .wasm — universo vazio (D213)`);
  const lista = aListaDaPagina(pagina);
  if (lista === null) problemas.push(`${A_PAGINA}: sem as marcas da lista dos testes do adaptador`);
  const naLista = lista ?? [];
  for (const n of carregamOWasm) if (!naLista.includes(n)) problemas.push(`${A_PAGINA}: a lista não nomeia ${n}, que carrega o .wasm`);
  for (const n of naLista) {
    if (!carrega.has(A_SUITE + n)) problemas.push(`${A_PAGINA}: a lista nomeia ${n}, que o git não carrega em ${A_SUITE}`);
    else if (!carregamOWasm.includes(n)) problemas.push(`${A_PAGINA}: a lista nomeia ${n}, que não carrega o .wasm`);
  }
  if (new Set(naLista).size !== naLista.length) problemas.push(`${A_PAGINA}: a lista repete um nome`);

  // 4 · os caminhos
  for (const rel of osCaminhosRelativos(pagina)) {
    const alvo = normalize(A_PASTA + rel).replace(/\/$/, "");
    if (!carrega.has(alvo) && !caminhos.some((c) => c.startsWith(`${alvo}/`)))
      problemas.push(`${A_PAGINA}: o caminho ${rel} não resolve em nada que o git carrega (${alvo})`);
  }

  // 5 · os quatro nomes
  const especificacao = ler(A_ESPECIFICACAO);
  if (especificacao === null) problemas.push(`${A_ESPECIFICACAO}: a especificação não existe`);
  for (const nome of OS_NOMES_DA_ESPECIFICACAO) {
    if (especificacao !== null && !especificacao.includes(nome)) problemas.push(`${A_ESPECIFICACAO}: não tem ${nome}`);
    if (!pagina.includes(nome)) problemas.push(`${A_PAGINA}: não nomeia ${nome}`);
  }
  const diz = lida.includes(A_PAGINA_DIZ_DOS_NOMES);
  if (!diz) problemas.push(`${A_PAGINA}: não diz se os quatro nomes existem como teste («${A_PAGINA_DIZ_DOS_NOMES}»)`);
  const deProposito = new Set(QUEM_ESCREVE_OS_NOMES_DE_PROPOSITO.map((q) => q.arquivo));
  let codigoLido = 0;
  for (const c of caminhos) {
    if (foraDoUniverso(c) || deProposito.has(c) || !(c.endsWith(".test.ts") || c.endsWith(".rs"))) continue;
    const texto = ler(c);
    if (texto === null) continue;
    codigoLido++;
    for (const nome of OS_NOMES_DA_ESPECIFICACAO)
      if (new RegExp(`\\b${nome}\\b`).test(texto) && diz) problemas.push(`${c}: escreve ${nome}, e a página diz que nenhum teste tem esse nome`);
  }
  for (const q of QUEM_ESCREVE_OS_NOMES_DE_PROPOSITO) if (!carrega.has(q.arquivo)) problemas.push(`${q.arquivo}: declarado e o git não carrega`);

  return { naPasta, testesLidos: testes.length, carregamOWasm, naLista, codigoLido, problemas };
}

export function conferirAArvore(raiz: string): Resultado {
  const ler = (c: string) => {
    const p = join(raiz, c);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  return conferir(arquivosQueOGitCarrega(raiz), ler);
}

export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se os testes da lista TESTAM o adaptador direito: a régua pergunta quem carrega o .wasm, não o que cada teste cobre — e sem o .wasm nesta máquina eles reprovam na carga",
  "a correspondência entre os quatro nomes da especificação e os arquivos da lista: não está feita, e a página diz isso em vez de inventá-la",
  "o teste do adaptador que não carrega o .wasm (o que testa uma função pura do `adapter/src/` sem o motor): a régua conta pela porta `Motor.carregar(`",
  "o adaptador dito com outras palavras (\"ainda não há ponte\"): a régua casa as formas da lista, e forma nova entra nela",
  "a linha `tests/` da tabela de `external-engines/symbios/README.md`: é da anatomia das pastas, a proposta do LAB-152, que espera o chat",
];
