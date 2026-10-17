/**
 * O TRABALHO ACONTECE EM `archilly/`, DOCUMENTADO — e a página do Symbios dizia um projeto onde havia três. (LAB-152,
 * item 900, a dívida própria, D380)
 *
 * # A regra, e o que a guardava
 *
 * O `CLAUDE.md` §3, a regra de ouro, item 2:
 *
 * > *"**O trabalho acontece em `archilly/`**, documentado."*
 *
 * Os outros três itens do §3 têm trava: o `upstream/` intocável (`upstream-intocavel.ts`, LAB-132), o `adapter/` como
 * única fronteira (`adapter-unica-fronteira.ts`, LAB-135) e o Generate que não depende disto (`generate-nao-depende.ts`,
 * LAB-134). Este só se conferia **escrito** (`enxugar-o-claude.ts`, item 028, a marca *"O trabalho acontece em
 * `archilly/`"*). Nada perguntava se o que mora em `archilly/` está dito em algum lugar.
 *
 * # O que se mediu, por LUGAR (17/10/2026)
 *
 * `git ls-files`: **dois** motores têm `archilly/`, com **cinco** projetos (a pasta logo abaixo de `archilly/`).
 * Um motor documenta o que mora ali em **um de dois lugares** — os dois que a casa já usa:
 *
 * | motor | lugar | projetos que existem | projetos que o lugar nomeia |
 * |---|---|---|---|
 * | `straight-skeleton` | `archilly/README.md`, uma seção `## \`<p>/\`` por projeto | `probe-cgal-wasm/`, `probe-rust/` | os dois |
 * | `symbios` | a linha `archilly/` da tabela *Pastas* do `README.md` do motor | `probe/`, `wasm/`, `wasm-probe/` | **só `probe/`** |
 *
 * A linha do Symbios foi escrita no LAB-00 (*"Contém `probe/`, o arranjo de medição do LAB-00"*), e ficou: o
 * `wasm-probe/` nasceu no mesmo LAB-00 com `README.md` próprio, e o `wasm/` — **a ponte que o navegador carrega** —
 * nasceu no LAB-01, documentado só no `adapter/README.md`. **Regra descumprida**, de mensagem fixa que afirma estado sem
 * perguntar (quinta espécie da dívida própria): consertada a linha, e esta trava passa a perguntar.
 *
 * # O que este módulo faz
 *
 * {@link conferirOTrabalhoEmArchilly} recebe a lista do que o `git` carrega e um leitor de arquivo, e para cada motor
 * com `archilly/`:
 *
 * - `sem-lugar` — o motor não tem nenhum dos dois lugares (nem `archilly/README.md`, nem a linha `archilly/` na página);
 * - `projeto-calado` — um projeto que existe e nenhum lugar nomeia;
 * - `nomeado-sem-existir` — o lugar nomeia um projeto que não existe (o outro sentido: a página que conta um projeto
 *   apagado mente do mesmo jeito);
 * - `universo-vazio` — nenhum motor com `archilly/` (D164: o vigia que não vigia nada não sai verde).
 *
 * O nome é o que está entre crases e acaba em barra (`` `wasm/` ``), uma pasta só, fora as três da anatomia
 * (`upstream/`, `archilly/`, `adapter/`), que a linha cita para dizer de quem depende.
 *
 * # O que ela NÃO alcança, dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

/** A marca da regra no `CLAUDE.md` §3 — o teste confere que ela continua escrita. */
export const A_REGRA = "O trabalho acontece em `archilly/`";

/** As três pastas da regra de ouro: citadas na linha para dizer de quem depende, nunca projeto. */
export const ANATOMIA = new Set(["upstream", "archilly", "adapter"]);

export type TipoDeProblema = "sem-lugar" | "projeto-calado" | "nomeado-sem-existir" | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  motor: string;
  projeto?: string;
  detalhe: string;
}

export interface MotorComArchilly {
  motor: string;
  projetos: string[];
  /** Onde o motor diz o que mora em `archilly/`, e o que cada lugar nomeia. */
  lugares: { lugar: string; nomeia: string[] }[];
}

export interface Resultado {
  motores: MotorComArchilly[];
  projetos: number;
  problemas: Problema[];
}

const PROJETO = /^external-engines\/([^/]+)\/archilly\/([^/]+)\/./;
const NOME_ENTRE_CRASES = /`([A-Za-z0-9._-]+)\/`/g;

/** Os projetos de cada motor: a pasta logo abaixo de `archilly/` que tem ao menos um arquivo versionado. */
export function projetosPorMotor(arquivos: readonly string[]): Map<string, string[]> {
  const m = new Map<string, Set<string>>();
  for (const f of arquivos) {
    const r = PROJETO.exec(f);
    if (!r) continue;
    const [, motor, projeto] = r;
    if (!m.has(motor!)) m.set(motor!, new Set());
    m.get(motor!)!.add(projeto!);
  }
  // O motor com `archilly/` mas sem projeto (só um README solto) também é motor com `archilly/`.
  for (const f of arquivos) {
    const r = /^external-engines\/([^/]+)\/archilly\/[^/]+$/.exec(f);
    if (r && !m.has(r[1]!)) m.set(r[1]!, new Set());
  }
  return new Map([...m].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, [...v].sort()]));
}

function nomes(texto: string): string[] {
  const s = new Set<string>();
  for (const r of texto.matchAll(NOME_ENTRE_CRASES)) if (!ANATOMIA.has(r[1]!)) s.add(r[1]!);
  return [...s].sort();
}

/** Lugar 1: `archilly/README.md`, os títulos de seção que começam por `` `<p>/` ``. */
export function nomeadosNoReadmeDeArchilly(texto: string): string[] {
  const titulos = texto.split("\n").filter((l) => /^#{2,6}\s+`[A-Za-z0-9._-]+\/`/.test(l));
  return nomes(titulos.map((l) => l.replace(/^#+\s+(`[^`]+`).*$/, "$1")).join("\n"));
}

/** Lugar 2: a linha da tabela da página do motor cuja primeira célula é `` `archilly/` ``. */
export function linhaDeArchilly(texto: string): string | null {
  return texto.split("\n").find((l) => /^\|\s*`archilly\/`\s*\|/.test(l)) ?? null;
}

export function nomeadosNaLinha(linha: string): string[] {
  return nomes(linha.replace(/^\|\s*`archilly\/`\s*\|/, ""));
}

/**
 * A conferência. `ler` devolve o texto do caminho (relativo à raiz) ou `null` se o arquivo não existe.
 */
export function conferirOTrabalhoEmArchilly(
  arquivos: readonly string[],
  ler: (caminho: string) => string | null,
): Resultado {
  const porMotor = projetosPorMotor(arquivos);
  const problemas: Problema[] = [];
  const motores: MotorComArchilly[] = [];
  if (porMotor.size === 0)
    problemas.push({ tipo: "universo-vazio", motor: "—", detalhe: "nenhum motor com `archilly/` no que o git carrega" });

  const carregados = new Set(arquivos);
  for (const [motor, projetos] of porMotor) {
    const base = `external-engines/${motor}`;
    const lugares: MotorComArchilly["lugares"] = [];

    const readme = `${base}/archilly/README.md`;
    const textoReadme = carregados.has(readme) ? ler(readme) : null;
    if (textoReadme !== null) lugares.push({ lugar: readme, nomeia: nomeadosNoReadmeDeArchilly(textoReadme) });

    const pagina = `${base}/README.md`;
    const textoPagina = carregados.has(pagina) ? ler(pagina) : null;
    const linha = textoPagina === null ? null : linhaDeArchilly(textoPagina);
    if (linha !== null) lugares.push({ lugar: `${pagina} (a linha \`archilly/\`)`, nomeia: nomeadosNaLinha(linha) });

    motores.push({ motor, projetos, lugares });

    if (lugares.length === 0) {
      problemas.push({
        tipo: "sem-lugar",
        motor,
        detalhe: `nem ${readme}, nem a linha \`archilly/\` na tabela de ${pagina}`,
      });
      continue;
    }
    const nomeados = new Set(lugares.flatMap((l) => l.nomeia));
    for (const p of projetos)
      if (!nomeados.has(p))
        problemas.push({
          tipo: "projeto-calado",
          motor,
          projeto: p,
          detalhe: `${base}/archilly/${p}/ existe, e nem ${lugares.map((l) => l.lugar).join(" nem ")} o nomeia`,
        });
    for (const l of lugares)
      for (const n of l.nomeia)
        if (!projetos.includes(n))
          problemas.push({
            tipo: "nomeado-sem-existir",
            motor,
            projeto: n,
            detalhe: `${l.lugar} nomeia \`${n}/\`, e não há ${base}/archilly/${n}/ no que o git carrega`,
          });
  }
  return { motores, projetos: motores.reduce((s, m) => s + m.projetos.length, 0), problemas };
}

/** A árvore de verdade: o `git ls-files` desta casa e o disco. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirOTrabalhoEmArchilly(arquivosQueOGitCarrega(raiz), (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se a descrição de cada projeto é verdadeira: a régua pergunta se ele é NOMEADO, não se o que se diz dele confere",
  "o README próprio de cada projeto: o `wasm-probe/` tem, o `probe/` e o `wasm/` não, e os dois lugares do motor bastam",
  "as outras linhas da tabela Pastas do Symbios (`adapter/`, o cabeçalho \"Adapter: não escrito\"): falsas desde o LAB-01, são de outra regra do §3, propostas ao chat no LAB-152",
  "pasta que só existe no disco (o `target/` do cargo, ignorado): o universo é o que o git carrega",
  "trabalho do Lab feito FORA de `archilly/` (num `adapter/`, na esteira): a regra diz onde ele acontece para o motor de fora, e o `adapter/` tem a trava do LAB-135",
];
