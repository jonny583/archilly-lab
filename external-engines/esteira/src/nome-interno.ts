/**
 * "TESTFIT" É NOME INTERNO — e a guarda olhava duas páginas, quando a página do Jonny o manda a mais. (LAB-155, item
 * 900, a dívida própria, D383)
 *
 * # A regra, e o que a guardava
 *
 * O `CLAUDE.md` §5:
 *
 * > *"**"Testfit" é nome interno**; para o usuário é **Laboratório de Parcelamento**."*
 *
 * A guarda é a do LAB-36 (`tests/regras.test.ts`, *"§5 · "Testfit" é nome interno"*): dois arquivos escritos à mão na
 * lista — `docs/PENDENCIAS_JONNY.md` e `docs/COMPARACAO_DOS_MOTORES.md` —, e a pergunta *"o texto contém `testfit`?"*.
 * Medido por mutação (LAB-155), antes desta trava: `Testfit` posto no título da bancada do navegador — a única interface
 * da casa (§4) — passou 25 de 25; `Test Fit` posto na página do Jonny passou 25 de 25. E o `README.md` da raiz, que o
 * GitHub mostra no primeiro endereço da página do Jonny (*"repositório"*), dizia **"motor do Testfit" seis vezes**, em
 * texto corrido, com a guarda verde.
 *
 * # O que se mediu, por LUGAR (17/10/2026)
 *
 * Texto *"voltado ao usuário"* não é uma lista que se lembra: é **onde a casa manda o Jonny**. Os lugares:
 *
 * | lugar | como se acha | classe |
 * |---|---|---|
 * | a página do Jonny | ela mesma | `pagina` |
 * | cada endereço desta casa que a página dele traz (`github.com/jonny583/archilly-lab/…`, ou caminho relativo) | os links da página | `pagina` ou `registro`, declarado |
 * | o endereço do repositório, sem caminho | o GitHub mostra o `README.md` da raiz | `pagina` |
 * | a bancada do navegador (§4) | a exceção de interface de `a-unica-interface.ts`, e o que ela carrega por `src=` | `pagina` |
 *
 * Em 17/10/2026, onze endereços na página do Jonny; dois são de fora da casa (as configurações do GitHub, do
 * `VIZINHOS_TOKEN`) e não são nossos; nove desta casa, em oito arquivos. Cobrados como `pagina`: a página dele, a
 * comparação dos motores, o `README.md`, e a bancada (`index.html` e o `prova.js` que ela carrega) — **seis arquivos**.
 * Declarados como `registro` (com motivo): o `ONDE_PARAMOS.md`, o `INDEX.md`, o `RECADOS.md` e quatro relatórios —
 * registros de trabalho, escritos na língua da casa e com história que não se reescreve.
 *
 * **O nome, e o que não é o nome.** `motor-testfit` é o endereço do repositório vizinho; `external-engines/testfit/` é
 * uma pasta. Isso é identificador, não nome dado ao usuário, e não se acusa: o que se acusa é a palavra **solta**, sem
 * hífen, barra, sublinhado, ponto ou crase colados nela, e fora de endereço. Pega `Testfit`, `TestFit`, `TESTFIT`,
 * `Test Fit` e `test-fit`.
 *
 * # O que este módulo faz
 *
 * {@link conferirONomeInterno} recebe a página do Jonny, um leitor de arquivo e as declarações, e acusa:
 *
 * - `nome-interno-na-pagina` — a palavra solta numa página cobrada, com a linha;
 * - `endereco-sem-classe` — um endereço desta casa que a página do Jonny traz e não está declarado nem como `pagina` nem
 *   como `registro` (lista fechada: link novo para ele é decisão, não descuido);
 * - `declarado-que-sumiu` — uma declaração que a página não traz mais, ou um arquivo que não existe (o outro sentido);
 * - `universo-vazio` — a página não traz endereço nenhum desta casa, ou não se lê (D164).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { EXCECAO } from "./a-unica-interface.ts";

/** A marca da regra no `CLAUDE.md` §5 — o teste confere que ela continua escrita. */
export const A_REGRA = '"Testfit" é nome interno';

export const PAGINA_DO_JONNY = "docs/PENDENCIAS_JONNY.md";

export type Classe = "pagina" | "registro";

/** Cada arquivo desta casa a que a página do Jonny o manda, com a classe e o motivo. Lista fechada. */
export const DECLARADOS: readonly { caminho: string; classe: Classe; motivo: string }[] = [
  { caminho: "README.md", classe: "pagina", motivo: "o GitHub mostra o README da raiz no endereço do repositório, o primeiro da página dele" },
  { caminho: "docs/COMPARACAO_DOS_MOTORES.md", classe: "pagina", motivo: "a página dos motores, escrita para ele (LAB-27), cinco endereços na página dele" },
  { caminho: "docs/ONDE_PARAMOS.md", classe: "registro", motivo: "o registro de onde a casa parou: língua da casa, e a história embaixo não se reescreve" },
  { caminho: "docs/INDEX.md", classe: "registro", motivo: "o índice dos arquivos: nomeia pasta e arquivo, que são identificadores" },
  { caminho: "docs/relatorios/RECADOS.md", classe: "registro", motivo: "os recados à direção, gravados inteiros e com data; não se reescreve recado enviado" },
  { caminho: "docs/relatorios/LAB-05.md", classe: "registro", motivo: "relatório técnico de medição, citado como fonte de uma pendência" },
  { caminho: "docs/relatorios/LAB-07.md", classe: "registro", motivo: "relatório técnico de medição, citado como fonte de uma pendência" },
  { caminho: "docs/relatorios/LAB-37.md", classe: "registro", motivo: "relatório técnico de medição, citado como fonte de uma pendência" },
  { caminho: "docs/relatorios/LAB-59.md", classe: "registro", motivo: "relatório técnico de medição, citado como fonte de uma pendência" },
];

/** A palavra solta: sem hífen, barra, sublinhado, ponto, crase ou letra colados dos dois lados. */
const SOLTA = /(?<![\w\-/.`])test[ -]?fit(?![\w\-/`]|\.\w)/giu;
/** Endereço não é texto: um URL inteiro, e o destino de um link Markdown. */
const ENDERECO = /https?:\/\/[^\s)>"']+|\]\([^)]*\)/g;

/** As linhas (contadas de 1) onde a palavra aparece solta, fora de endereço. */
export function ondeONomeAparece(texto: string): { linha: number; trecho: string }[] {
  const saida: { linha: number; trecho: string }[] = [];
  texto.split("\n").forEach((l, i) => {
    const limpa = l.replace(ENDERECO, (m) => " ".repeat(m.length));
    for (const m of limpa.matchAll(SOLTA)) saida.push({ linha: i + 1, trecho: l.slice(Math.max(0, m.index - 30), m.index + 40).trim() });
  });
  return saida;
}

/** Os arquivos desta casa a que a página manda — o repositório sem caminho é o `README.md`. */
export function enderecosDaCasa(pagina: string): string[] {
  const achados = new Set<string>();
  for (const m of pagina.matchAll(/https?:\/\/github\.com\/jonny583\/archilly-lab(?:\/blob\/[^/\s)>]+\/([^\s)>#]+))?(?=[\s)>#]|$)/g))
    achados.add(m[1] ?? "README.md");
  for (const m of pagina.matchAll(/\]\((?!https?:|#|mailto:)([^)\s#]+)/g)) {
    const partes = ["docs", ...m[1]!.split("/")];
    const pilha: string[] = [];
    for (const p of partes) {
      if (p === "..") pilha.pop();
      else if (p !== ".") pilha.push(p);
    }
    achados.add(pilha.join("/"));
  }
  return [...achados].sort();
}

/** O que a bancada é: as páginas da exceção de interface, e os arquivos que cada uma carrega por `src=`. */
export function arquivosDaBancada(ler: (c: string) => string | null): string[] {
  const saida: string[] = [];
  for (const e of EXCECAO.filter((x) => x.porta === "pagina")) {
    saida.push(e.caminho);
    const dir = e.caminho.slice(0, e.caminho.lastIndexOf("/") + 1);
    const html = ler(e.caminho);
    if (html === null) continue; // a página que sumiu sai como `declarado-que-sumiu` na conferência
    for (const m of html.matchAll(/\bsrc\s*=\s*["'](\.\/)?([^"':]+)["']/g)) saida.push(dir + m[2]);
  }
  return saida;
}

export type TipoDeProblema = "nome-interno-na-pagina" | "endereco-sem-classe" | "declarado-que-sumiu" | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  caminho: string;
  detalhe: string;
}

export interface Resultado {
  /** Endereços desta casa que a página do Jonny traz. */
  enderecos: number;
  /** Arquivos lidos como página cobrada (a página dele incluída). */
  paginasLidas: string[];
  problemas: Problema[];
}

/** A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null` se não existe. */
export function conferirONomeInterno(
  ler: (caminho: string) => string | null,
  declarados: typeof DECLARADOS = DECLARADOS,
): Resultado {
  const problemas: Problema[] = [];
  const pagina = ler(PAGINA_DO_JONNY);
  const enderecos = pagina === null ? [] : enderecosDaCasa(pagina);
  if (pagina === null || enderecos.length === 0)
    problemas.push({ tipo: "universo-vazio", caminho: PAGINA_DO_JONNY, detalhe: "a página do Jonny não se lê, ou não traz endereço desta casa" });

  const porCaminho = new Map(declarados.map((d) => [d.caminho, d]));
  for (const e of enderecos)
    if (!porCaminho.has(e))
      problemas.push({ tipo: "endereco-sem-classe", caminho: e, detalhe: `a página do Jonny manda a ${e}, e ele não está declarado como pagina nem como registro` });
  for (const d of declarados) {
    if (!enderecos.includes(d.caminho))
      problemas.push({ tipo: "declarado-que-sumiu", caminho: d.caminho, detalhe: `${d.caminho} está declarado, e a página do Jonny não manda mais a ele` });
    else if (ler(d.caminho) === null)
      problemas.push({ tipo: "declarado-que-sumiu", caminho: d.caminho, detalhe: `${d.caminho} está declarado, e o arquivo não existe` });
  }

  const cobradas = [PAGINA_DO_JONNY, ...declarados.filter((d) => d.classe === "pagina" && enderecos.includes(d.caminho)).map((d) => d.caminho)];
  for (const b of arquivosDaBancada(ler)) {
    if (ler(b) === null) problemas.push({ tipo: "declarado-que-sumiu", caminho: b, detalhe: `a bancada carrega ${b}, e o arquivo não existe` });
    else cobradas.push(b);
  }
  const paginasLidas: string[] = [];
  for (const c of cobradas) {
    const texto = ler(c);
    if (texto === null) continue;
    paginasLidas.push(c);
    for (const o of ondeONomeAparece(texto))
      problemas.push({ tipo: "nome-interno-na-pagina", caminho: `${c}:${o.linha}`, detalhe: `"Testfit" é nome interno (§5); para ele é Laboratório de Parcelamento — «${o.trecho}»` });
  }
  return { enderecos: enderecos.length, paginasLidas, problemas };
}

/** A árvore de verdade: o disco desta casa. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirONomeInterno((c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "o que o chat (a direção) repassa ao Jonny a partir dos recados: os recados são `registro`, e a palavra ali é a pasta `testfit/` ou o repositório `motor-testfit`; o que a direção escreve a ele é da casa dela",
  "página aberta a partir de outra página cobrada (um link dentro do README): o universo é o que a página DO JONNY traz, um salto",
  "o nome escrito de outro jeito que não test-fit (abreviação, erro de digitação): a régua pega as cinco grafias que a casa já escreveu",
  "texto que a bancada monta em tempo de execução a partir de dado (o nome de um motor vindo do `.wasm`): a régua lê o texto do arquivo",
];
