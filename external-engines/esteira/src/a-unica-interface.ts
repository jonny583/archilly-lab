/**
 * NÃO TEM INTERFACE — COM UMA EXCEÇÃO, DECLARADA — e a guarda só olhava um tipo de arquivo numa pasta. (LAB-153, item
 * 900, a dívida própria, D381)
 *
 * # A regra, e o que a guardava
 *
 * O `CLAUDE.md` §4:
 *
 * > *"**Não tem interface — com UMA exceção, declarada:** a bancada do navegador
 * > (`external-engines/symbios/adapter/ferramentas/navegador/index.html`), com guarda contando HTML."*
 *
 * (assim até o LAB-153; desde ele a frase diz *"com guarda contando página, componente e servidor em tudo o que o `git`
 * carrega (D381)"*.)
 *
 * A guarda é a do LAB-36 (`tests/regras.test.ts`, *"existe exatamente UM html no repositório"*). O título diz
 * **repositório**; o código varre o **disco** só sob `external-engines/`, e só arquivo que acaba em `.html`. Medido por
 * mutação (LAB-153), com os dois arquivos postos no `git`: uma página `docs/painel/index.html` com formulário e um
 * componente `external-engines/testfit/adapter/src/Painel.tsx` — **a guarda passou os dois**, 25 de 25. Guarda estreita:
 * a regra é do repositório inteiro, e interface não é só `.html`.
 *
 * # O que se mediu, por LUGAR (17/10/2026)
 *
 * Interface entra na árvore por **três portas**, e enumerei as três no que o `git` carrega (`git ls-files`, a árvore
 * inteira, `upstream/` e `docs/` incluídos):
 *
 * | porta | o que é | o que se lê | achados hoje |
 * |---|---|---|---|
 * | `pagina` | arquivo de página: `.html`, `.htm`, `.xhtml` | o nome | 1 — a bancada |
 * | `componente` | arquivo de componente de tela: `.tsx`, `.jsx`, `.vue`, `.svelte`, `.astro` | o nome | 0 |
 * | `servidor` | código que sobe servidor de página: `Bun.serve(`, `createServer(` | o código, sem comentário e sem string | 1 — `prova-automatica.ts`, o servidor da bancada |
 *
 * Os dois achados são **a exceção declarada**, e são dois arquivos, não um: a bancada é a página **e** o servidor local
 * que a prova automática sobe para abri-la (LAB-03). A regra estava **verdadeira**; a guarda é que não perguntava ao
 * repositório.
 *
 * # O que este módulo faz
 *
 * {@link conferirAUnicaInterface} recebe a lista do que o `git` carrega e um leitor de arquivo, e acusa:
 *
 * - `interface-fora-da-excecao` — um arquivo de qualquer das três portas que não é a exceção declarada;
 * - `excecao-que-sumiu` — um arquivo da exceção que não existe mais no que o `git` carrega, ou deixou de ser da porta que
 *   o declara (o outro sentido: exceção que ninguém percorre é a lista que envelhece calada);
 * - `universo-vazio` — o `git` não carrega arquivo nenhum (D164).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { soOCodigo } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

/** A marca da regra no `CLAUDE.md` §4 — o teste confere que ela continua escrita. */
export const A_REGRA = "Não tem interface — com UMA exceção, declarada";

export type Porta = "pagina" | "componente" | "servidor";

const PAGINA = /\.(html?|xhtml)$/i;
const COMPONENTE = /\.(tsx|jsx|vue|svelte|astro)$/i;
const CODIGO = /\.(ts|mts|cts|js|mjs|cjs)$/i;
/** Subir servidor: o `Bun.serve` e o `createServer` do `node:http`/`node:https`. Lido no código sem comentário e string. */
const SOBE_SERVIDOR = /\bBun\s*\.\s*serve\s*\(|\bcreateServer\s*\(/;

/** A exceção declarada: a bancada do navegador, a página e o servidor local que a abre. */
export const EXCECAO: readonly { caminho: string; porta: Porta; motivo: string }[] = [
  {
    caminho: "external-engines/symbios/adapter/ferramentas/navegador/index.html",
    porta: "pagina",
    motivo: "a bancada: carrega o `.wasm` do Symbios e publica números, sem formulário (LAB-03, declarada no LAB-36)",
  },
  {
    caminho: "external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts",
    porta: "servidor",
    motivo: "o servidor local que a prova automática sobe para abrir a bancada no Chromium e ler os números (LAB-03)",
  },
];

export type TipoDeProblema = "interface-fora-da-excecao" | "excecao-que-sumiu" | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  caminho: string;
  porta?: Porta;
  detalhe: string;
}

export interface Resultado {
  /** Quantos arquivos o `git` carrega — o tamanho do universo lido. */
  universo: number;
  /** Quantos arquivos de código foram lidos à procura de servidor. */
  codigoLido: number;
  achados: { caminho: string; porta: Porta }[];
  problemas: Problema[];
}

/** A porta pelo nome do arquivo, ou `null` se o nome não diz. */
export function portaPeloNome(caminho: string): Porta | null {
  if (PAGINA.test(caminho)) return "pagina";
  if (COMPONENTE.test(caminho)) return "componente";
  return null;
}

/** O código sobe servidor de página? Comentário e string não contam. */
export function sobeServidor(texto: string): boolean {
  return SOBE_SERVIDOR.test(soOCodigo(texto));
}

const ehDependencia = (c: string) => /(^|\/)node_modules\//.test(c);

/** A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null` se não existe. */
export function conferirAUnicaInterface(
  arquivos: readonly string[],
  ler: (caminho: string) => string | null,
  excecao: typeof EXCECAO = EXCECAO,
): Resultado {
  const universo = arquivos.filter((c) => !ehDependencia(c));
  const problemas: Problema[] = [];
  const achados: Resultado["achados"] = [];
  let codigoLido = 0;
  if (universo.length === 0)
    problemas.push({ tipo: "universo-vazio", caminho: "—", detalhe: "o git não carrega arquivo nenhum" });

  for (const c of [...universo].sort()) {
    const pelo = portaPeloNome(c);
    if (pelo) {
      achados.push({ caminho: c, porta: pelo });
      continue;
    }
    if (!CODIGO.test(c)) continue;
    const texto = ler(c);
    if (texto === null) continue;
    codigoLido++;
    if (sobeServidor(texto)) achados.push({ caminho: c, porta: "servidor" });
  }

  const declarados = new Map(excecao.map((e) => [e.caminho, e.porta]));
  for (const a of achados)
    if (declarados.get(a.caminho) !== a.porta)
      problemas.push({
        tipo: "interface-fora-da-excecao",
        caminho: a.caminho,
        porta: a.porta,
        detalhe: `${a.caminho} é ${a.porta} e não é a bancada declarada no CLAUDE.md §4`,
      });
  for (const e of excecao)
    if (!achados.some((a) => a.caminho === e.caminho && a.porta === e.porta))
      problemas.push({
        tipo: "excecao-que-sumiu",
        caminho: e.caminho,
        porta: e.porta,
        detalhe: `a exceção declara ${e.caminho} como ${e.porta}, e o git não carrega isso`,
      });

  return { universo: universo.length, codigoLido, achados, problemas };
}

/** A árvore de verdade: o `git ls-files` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirAUnicaInterface(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se a bancada GANHOU formulário ou tela de usuário: isso é a guarda do LAB-36 (`<form` no index.html), que continua valendo",
  "interface escrita dentro de um `.ts` sem JSX e sem servidor (montar HTML numa string e gravar no disco): a porta é o arquivo que nasce, e ele cai na porta `pagina` quando entra no git",
  "servidor por outra biblioteca (`express()`, `Deno.serve`, `listen` de um framework): nenhuma está nas dependências desta casa; a porta pergunta pelas duas formas que o Bun e o Node trazem",
  "arquivo que só existe no disco e o .gitignore esconde (o `target/` do cargo, `node_modules/`): o universo é o que o git carrega",
];
