/**
 * O MOTOR DE FORA NÃO SAI DO `upstream/` — e nada perguntava se ele tinha saído. (LAB-161, item 900, a dívida própria, D389)
 *
 * # A linha da página, e a metade que estava sem guarda
 *
 * O `docs/SEGURANCA.md`, tabela *Integridade do que foi copiado*, diz desde o LF-FINAL (14/09/2026):
 *
 * > Nenhum motor copiado para fora de `upstream/` · ✅ · `external-engines/testfit/` e `external-engines/esteira/` não
 * > contêm código de motor — só a ponte (D16)
 *
 * As duas outras linhas da tabela têm trava desde o LAB-132 (`upstream-intocavel.ts`: a árvore do `git` da pasta é a
 * registrada, então nem um byte do motor nem da licença muda sem reprovar). Esta não tinha. O comando ao lado é uma
 * frase sobre duas pastas, e as duas são as erradas para a pergunta: o motor de fora que o Lab copiou é o **Symbios**, e
 * o lugar onde uma cópia dele nasceria é ao lado do `upstream/`, em `symbios/archilly/` — onde o Lab escreve Rust contra
 * ele. O LAB-146 (`o-motor-da-familia-nao-se-copia.ts`) compara esta casa com os motores **da família**; o `upstream/`
 * entra lá do lado da casa, nunca como o comparado.
 *
 * **Medido por mutação (17/10/2026):** o `upstream/src/rationalize.rs` copiado byte a byte para
 * `symbios/archilly/wasm/src/racionalizar.rs`, adicionado ao `git`, e a suíte inteira da esteira com os clones → **uma**
 * falha nova, a de contagem de árvore do LAB-57, que acusa QUALQUER arquivo novo e não diz por quê. O `cargo` não
 * acusaria nada: o arquivo não entra na árvore de módulos. *Mensagem fixa que afirma estado sem perguntar*.
 *
 * # O que se mediu, por LUGAR
 *
 * O comparado são os arquivos de código de **toda** pasta `upstream/` que o `git` versiona ({@link pastasDeUpstream}, do
 * LAB-132 — motor de fora que entrar amanhã entra aqui sem ninguém lembrar); o lado da casa é todo arquivo de código
 * versionado **fora** delas. Mesma medida do LAB-146 ({@link linhasDeCodigo}, os mesmos limites), porque é a mesma
 * pergunta com outro comparado. Resultado de 17/10: 18 arquivos de código no `upstream/` do Symbios (2 159 linhas
 * significativas), 354 da casa; **nenhum idêntico**, e o mais parecido é o `symbios/archilly/wasm-probe/src/lib.rs` —
 * 3 de 8 linhas em comum com `examples/full_city.rs` (a chamada à API pública do motor, que quem usa o motor escreve
 * igual a quem o documenta). **A linha é verdadeira**; faltava a pergunta.
 *
 * # A outra metade: o Lab LÊ o motor do `upstream/`
 *
 * Não copiar só fecha se o Lab, quando usa o motor, usa **aquele** — o conferido byte a byte. Todo `Cargo.toml` fora do
 * `upstream/` que depende do pacote de um `upstream/` (o nome vem do `[package]` do próprio `upstream/Cargo.toml`) tem de
 * apontar para ele por `path`. Medido: três (`probe/`, `wasm-probe/`, `wasm/`), os três com `path = "../../upstream"`.
 * Trocado por `symbios-tensor = "0.4"`, o `cargo` baixaria do crates.io um motor que ninguém conferiu, e o
 * `upstream-intocavel` continuaria verde, conferindo uma pasta que ninguém compila.
 *
 * # Como ela cobra
 *
 * 1. **arquivo idêntico** a um do `upstream/` → `copia-inteira`;
 * 2. **parecido demais** → `copia-do-upstream`, com os limites do LAB-146 ({@link ehCopia});
 * 3. **dependência que não é o `upstream/`** → `dependencia-fora-do-upstream`;
 * 4. **nenhuma pasta `upstream/`**, ou uma sem arquivo de código → `universo-vazio` / `upstream-vazio`: comparar contra
 *    nada dá zero igual a árvore limpa (D164).
 *
 * # O que ela NÃO cobra, dito
 *
 * O mesmo texto vai na saída ({@link O_QUE_ISTO_NAO_ALCANCA}).
 */
import { posix } from "node:path";

import type { Arquivo } from "./adapter-unica-fronteira.ts";
import {
  BLOCO_COPIADO,
  EXTENSOES_DE_CODIGO,
  LIMIAR_DA_FRACAO,
  MINIMO_DE_LINHAS,
  linhasDeCodigo,
} from "./o-motor-da-familia-nao-se-copia.ts";
import { pastasDeUpstream } from "./upstream-intocavel.ts";

/** A linha do `docs/SEGURANCA.md` que esta régua responde, conferida por `aRegraEstaEscrita`. */
export const A_LINHA = "Nenhum motor copiado para fora de `upstream/`";

/** O ponteiro que a linha passa a carregar. */
export const O_PONTEIRO = "external-engines/esteira/src/o-upstream-nao-sai-do-upstream.ts";

/** O que esta régua NÃO alcança — publicado na saída, para o silêncio não parecer cobertura. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "a cópia REESCRITA: nomes trocados, linhas reordenadas ou o motor traduzido de Rust para TypeScript passam — a régua " +
    "compara linhas iguais, não comportamento (a mesma fronteira do LAB-146)",
  "a cópia de menos de 30 linhas num arquivo que é mais da metade outra coisa",
  "o que não é código: `.md`, JSON e dado copiados do `upstream/` não são lidos",
  "a dependência que não é Rust: um `package.json` que puxasse o motor por npm não é lido (o Symbios não publica " +
    "pacote npm, e o `.wasm` do Lab é compilado de `archilly/wasm/`, que esta régua confere)",
  "o motor que NÃO tem `upstream/`: a sondagem do straight-skeleton (`straight-skeleton/archilly/probe-rust/`) aponta " +
    "por `path` para uma pasta fora do repositório, de propósito — é avaliação, não motor adotado, e não há o que comparar",
  "a história: só os arquivos de hoje",
];

/** Os limites do LAB-146, os mesmos. */
export const ehCopia = (comum: number, linhas: number): boolean =>
  (comum >= MINIMO_DE_LINHAS && comum / linhas >= LIMIAR_DA_FRACAO) || comum >= BLOCO_COPIADO;

export type TipoDoProblema =
  | "copia-inteira"
  | "copia-do-upstream"
  | "dependencia-fora-do-upstream"
  | "upstream-vazio"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDoProblema;
  arquivo: string;
  oQue: string;
}

export interface Parecenca {
  arquivo: string;
  /** `pasta-do-upstream/caminho`. */
  com: string;
  comum: number;
  linhas: number;
  fracao: number;
}

export interface Dependencia {
  /** O `Cargo.toml` da casa. */
  manifesto: string;
  pacote: string;
  /** A pasta para onde o `path` aponta, resolvida a partir da raiz; `null` se não há `path`. */
  aponta: string | null;
}

export interface Resultado {
  problemas: Problema[];
  universo: {
    pastasDeUpstream: { pasta: string; pacote: string | null; arquivosDeCodigo: number }[];
    arquivosDaCasa: number;
    manifestosLidos: number;
  };
  dependencias: Dependencia[];
  /** A maior parecença — a folga que sobra até a régua acusar. `null` se nada se parece. */
  maisParecido: Parecenca | null;
  naoAlcanca: readonly string[];
}

/** O `name` do `[package]` de um `Cargo.toml`, ou `null`. */
export function nomeDoPacote(cargo: string): string | null {
  let secao = "";
  for (const cru of cargo.split("\n")) {
    const l = cru.trim();
    const s = l.match(/^\[([^\]]+)\]$/);
    if (s) {
      secao = s[1]!.trim();
      continue;
    }
    if (secao !== "package") continue;
    const m = l.match(/^name\s*=\s*"([^"]+)"/);
    if (m) return m[1]!;
  }
  return null;
}

/**
 * As dependências de um `Cargo.toml` com um destes nomes, em toda seção de dependência (`[dependencies]`,
 * `[dev-dependencies]`, `[build-dependencies]`, `[target.….dependencies]`), na forma de uma linha
 * (`nome = { path = "…" }` ou `nome = "0.4"`) e na de tabela (`[dependencies.nome]` com `path = "…"` embaixo).
 */
export function dependenciasDe(
  cargo: string,
  pacotes: readonly string[],
): { pacote: string; path: string | null }[] {
  const achadas: { pacote: string; path: string | null }[] = [];
  let secao = "";
  let tabelaDe: { pacote: string; path: string | null } | null = null;
  const ehSecaoDeDependencia = (s: string) => /(^|\.)(dev-|build-)?dependencies$/.test(s);
  for (const cru of cargo.split("\n")) {
    const l = cru.replace(/#.*$/, "").trim();
    const s = l.match(/^\[([^\]]+)\]$/);
    if (s) {
      secao = s[1]!.trim();
      tabelaDe = null;
      const t = secao.match(/^(?:.*\.)?(?:dev-|build-)?dependencies\.([A-Za-z0-9_-]+)$/);
      if (t && pacotes.includes(t[1]!)) {
        tabelaDe = { pacote: t[1]!, path: null };
        achadas.push(tabelaDe);
      }
      continue;
    }
    if (tabelaDe) {
      const p = l.match(/^path\s*=\s*"([^"]+)"/);
      if (p) tabelaDe.path = p[1]!;
      continue;
    }
    if (!ehSecaoDeDependencia(secao)) continue;
    const m = l.match(/^([A-Za-z0-9_-]+)\s*=\s*(.*)$/);
    if (!m || !pacotes.includes(m[1]!)) continue;
    const p = m[2]!.match(/\bpath\s*=\s*"([^"]+)"/);
    achadas.push({ pacote: m[1]!, path: p ? p[1]! : null });
  }
  return achadas;
}

export interface Entrada {
  /** Todos os arquivos versionados que interessam: código e `Cargo.toml`, de dentro e de fora do `upstream/`. */
  versionados: readonly Arquivo[];
}

/**
 * Confere que nenhum motor de fora saiu do seu `upstream/`. Função pura: recebe os textos, não lê disco — a trava a roda
 * com o `git ls-files` de verdade e com dados plantados.
 */
export function conferirQueOUpstreamNaoSai(e: Entrada): Resultado {
  const problemas: Problema[] = [];
  const pastas = pastasDeUpstream(e.versionados.map((a) => a.caminho));
  const dentroDe = (caminho: string) => pastas.find((p) => caminho.startsWith(`${p}/`)) ?? null;
  const codigo = (a: Arquivo) => EXTENSOES_DE_CODIGO.test(a.caminho);

  if (pastas.length === 0) {
    problemas.push({
      tipo: "universo-vazio",
      arquivo: "(nenhum)",
      oQue: "nenhuma pasta `upstream/` versionada: comparar contra nada dá zero igual a árvore limpa (D164)",
    });
  }

  // o índice do `upstream/`: linha → arquivos de lá que a têm; e o texto inteiro, para a cópia idêntica
  const indice = new Map<string, Set<string>>();
  const inteiros = new Map<string, string>();
  const universoDasPastas: Resultado["universo"]["pastasDeUpstream"] = [];
  const pacotePorPasta = new Map<string, string>();
  for (const pasta of pastas) {
    const deLa = e.versionados.filter((a) => a.caminho.startsWith(`${pasta}/`));
    const lidos = deLa.filter(codigo);
    const cargo = deLa.find((a) => a.caminho === `${pasta}/Cargo.toml`);
    const pacote = cargo ? nomeDoPacote(cargo.texto) : null;
    if (pacote) pacotePorPasta.set(pasta, pacote);
    universoDasPastas.push({ pasta, pacote, arquivosDeCodigo: lidos.length });
    if (lidos.length === 0) {
      problemas.push({
        tipo: "upstream-vazio",
        arquivo: pasta,
        oQue: `nenhum arquivo de código lido em \`${pasta}\`: comparar contra nada dá zero igual a árvore limpa (D164)`,
      });
    }
    for (const a of lidos) {
      if (linhasDeCodigo(a.texto).size > 0 && !inteiros.has(a.texto)) inteiros.set(a.texto, a.caminho);
      for (const l of linhasDeCodigo(a.texto)) {
        let s = indice.get(l);
        if (!s) indice.set(l, (s = new Set()));
        s.add(a.caminho);
      }
    }
  }

  // 1 e 2 · a cópia
  const casa = e.versionados.filter((a) => codigo(a) && dentroDe(a.caminho) === null);
  let maisParecido: Parecenca | null = null;
  for (const a of casa) {
    const igual = inteiros.get(a.texto);
    if (igual !== undefined) {
      problemas.push({ tipo: "copia-inteira", arquivo: a.caminho, oQue: `idêntico a \`${igual}\`` });
      continue;
    }
    const linhas = linhasDeCodigo(a.texto);
    if (linhas.size === 0) continue;
    const conta = new Map<string, number>();
    for (const l of linhas) for (const v of indice.get(l) ?? []) conta.set(v, (conta.get(v) ?? 0) + 1);
    for (const [com, comum] of conta) {
      const p: Parecenca = { arquivo: a.caminho, com, comum, linhas: linhas.size, fracao: comum / linhas.size };
      if (ehCopia(comum, linhas.size)) {
        problemas.push({
          tipo: "copia-do-upstream",
          arquivo: a.caminho,
          oQue:
            `${comum} de ${linhas.size} linhas de código (${Math.round(p.fracao * 100)} %) iguais às de \`${com}\`: ` +
            "o motor de fora mora no `upstream/`, intocado; o Lab o usa por dependência, não por cópia (CLAUDE.md §3)",
        });
      } else if (
        maisParecido === null ||
        p.fracao > maisParecido.fracao ||
        (p.fracao === maisParecido.fracao && p.comum > maisParecido.comum)
      ) {
        maisParecido = p;
      }
    }
  }

  // 3 · a dependência
  const pacotes = [...pacotePorPasta.values()];
  const pastaDoPacote = new Map([...pacotePorPasta].map(([pasta, pacote]) => [pacote, pasta]));
  const manifestos = e.versionados.filter((a) => posix.basename(a.caminho) === "Cargo.toml" && dentroDe(a.caminho) === null);
  const dependencias: Dependencia[] = [];
  for (const m of manifestos) {
    for (const d of dependenciasDe(m.texto, pacotes)) {
      const aponta = d.path === null ? null : posix.normalize(posix.join(posix.dirname(m.caminho), d.path));
      dependencias.push({ manifesto: m.caminho, pacote: d.pacote, aponta });
      const certa = pastaDoPacote.get(d.pacote)!;
      if (aponta !== certa) {
        problemas.push({
          tipo: "dependencia-fora-do-upstream",
          arquivo: m.caminho,
          oQue:
            `\`${d.pacote}\` ${aponta === null ? "sem `path`" : `aponta para \`${aponta}\``}, e o motor conferido é ` +
            `\`${certa}\`: o \`cargo\` usaria um motor que o \`upstream-intocavel\` não confere`,
        });
      }
    }
  }

  return {
    problemas,
    universo: { pastasDeUpstream: universoDasPastas, arquivosDaCasa: casa.length, manifestosLidos: manifestos.length },
    dependencias,
    maisParecido,
    naoAlcanca: O_QUE_ISTO_NAO_ALCANCA,
  };
}
