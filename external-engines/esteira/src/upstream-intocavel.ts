/**
 * O `upstream/` É INTOCÁVEL — e nada perguntava se ele tinha sido tocado. (LAB-132, item 900, a dívida própria, D360)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §3 (*"a regra de ouro"*) abre por ela: *"`upstream/` é intocável: cópia exata, commit e data
 * em `VERSION`; sem patch."* O trabalho acontece em `archilly/`; o `upstream/` é a cópia do motor de outra
 * pessoa, e é contra ele que toda medição do Symbios se compara — patch ali dentro é medir o motor dela com
 * a mão do Lab dentro, e sem rastro.
 *
 * O que existia lia o `VERSION` (`identidade.test.ts`, a versão e o nome) e **pulava** o `upstream/` nas
 * varreduras de texto (`mesmo-valor`, `mesmo-commit`, `nome-do-prompt`…, porque ele é intocável). Nada lia
 * **se ele continuava intocado**. Medido por mutação (16/10/2026), a suíte inteira da esteira com três
 * mudanças plantadas ao mesmo tempo no `external-engines/symbios/upstream/` — uma linha acrescentada ao
 * `src/lib.rs`, um arquivo novo `src/patch.rs` e a linha `Commit:` apagada do `VERSION` → **zero** falhas
 * novas (1 415 aprovadas, 9 reprovadas — as nove do `.wasm`, as mesmas de antes). *Regra sem guarda*, a
 * primeira espécie da dívida própria.
 *
 * # O que se mediu, por LUGAR
 *
 * - **as pastas**: todo arquivo versionado com um segmento `upstream` no caminho (`git ls-files`) — **uma**
 *   pasta, `external-engines/symbios/upstream`, 25 arquivos. O Laboratório de Parcelamento não tem
 *   `upstream/`, de propósito (D16: motor da família se lê do clone irmão);
 * - **a árvore**: o objeto de árvore do `git` dessa pasta no `HEAD` é `7ea7b17…` — **o mesmo** do commit que
 *   a trouxe (`f61be91`, LAB-00, 09/09/2026), e `git log` não acha outro commit que a tenha tocado;
 * - **o `VERSION`**: traz o commit do upstream (40 caracteres) e a data dele, e a data da cópia.
 *
 * # Como ela cobra
 *
 * 1. **toda pasta `upstream` versionada tem linha em {@link COPIAS_DE_UPSTREAM}**, e toda linha tem pasta —
 *    nos dois sentidos, como os ramos abertos (D349);
 * 2. **a árvore dela no `HEAD` é a registrada.** O objeto de árvore do `git` é o resumo de cada byte, nome e
 *    modo da pasta: mudar uma letra muda o número. Trocar a cópia por uma versão nova do motor é um ato
 *    deliberado — o `VERSION` novo e esta linha no **mesmo** commit, com a decisão;
 * 3. **nada na pasta difere do `HEAD`** (`git status --porcelain`): o patch ainda não enviado, e o arquivo
 *    novo não versionado. O que o `.gitignore` ignora (`target/`) é saída de build, não patch;
 * 4. **o `VERSION` diz o commit e a data** — a regra os pede por extenso, e é por eles que alguém refaz a
 *    cópia.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **que a cópia seja igual ao upstream DE VERDADE**: isso pede a rede e o repositório de outra pessoa. A
 *   régua confere que a cópia é a mesma **desde que entrou**; que ela entrou exata, quem atesta é o
 *   `VERSION` (*"NOT MODIFIED"*) e o commit que a trouxe;
 * - **a história**: só o `HEAD`. Um patch commitado e desfeito depois volta à mesma árvore e passa — o CI
 *   clona raso, e a régua passaria a responder o corte do clone (D293, D344). A história foi medida no
 *   relatório do LAB-132, não aqui — e, desde o LAB-163, é perguntada a cada verde completo, árvore a árvore,
 *   em `a-historia-do-upstream.ts`;
 * - **pasta de motor de fora com outro nome** (`vendor/`, `third_party/`): a regra da casa diz `upstream/`, e
 *   é esse o nome que a régua procura.
 */

/** A frase da regra, conferida no teste onde ela mora (o `CLAUDE.md` §3). */
export const A_REGRA = "`upstream/` é intocável: cópia exata, commit e data em `VERSION`; sem patch.";

/** Uma cópia de motor de fora, como entrou. */
export type CopiaDeUpstream = {
  /** A pasta, a partir da raiz do repositório. */
  pasta: string;
  /** O objeto de árvore do `git` da pasta (`git rev-parse HEAD:<pasta>`), conferido no `HEAD`. */
  arvore: string;
  /** O commit DESTA casa que a trouxe — de onde a árvore foi lida. */
  trazidaEm: string;
  /** Por que ela está aqui, em uma frase. */
  motivo: string;
};

/**
 * As cópias, uma por pasta. **Mudar uma árvore aqui é trocar a cópia do motor** — vai junto com o `VERSION`
 * novo e uma decisão no `DECISOES.md`, no mesmo commit.
 */
export const COPIAS_DE_UPSTREAM: readonly CopiaDeUpstream[] = [
  {
    pasta: "external-engines/symbios/upstream",
    arvore: "7ea7b17aadf2fa9fb998a8ce7eb0a39b590dd21b",
    trazidaEm: "f61be91",
    motivo: "Symbios Tensor 0.4.1, copiado no LAB-00 (09/09/2026); o trabalho do Lab mora em `archilly/`.",
  },
];

/** As pastas `upstream` que o repositório versiona: todo caminho com um segmento `upstream`, cortado nele. */
export function pastasDeUpstream(arquivosVersionados: readonly string[]): string[] {
  const pastas = new Set<string>();
  for (const arquivo of arquivosVersionados) {
    const partes = arquivo.split("/");
    const i = partes.indexOf("upstream");
    // `upstream` como último segmento é um ARQUIVO com esse nome, não uma pasta.
    if (i >= 0 && i < partes.length - 1) pastas.add(partes.slice(0, i + 1).join("/"));
  }
  return [...pastas].sort();
}

/** O commit do upstream (40 caracteres) e uma data `AAAA-MM-DD`, cada um numa linha própria do `VERSION`. */
export function oVersionDiz(version: string): { commit: string | null; data: string | null } {
  const commit = version.match(/^\s*Commit\s*:\s*([0-9a-f]{40})\s*$/im);
  const data = version.match(/^\s*(?:Commit date|Cloned at)\s*:\s*(\d{4}-\d{2}-\d{2})/im);
  return { commit: commit?.[1] ?? null, data: data?.[1] ?? null };
}

export type ProblemaDoUpstream = {
  tipo:
    | "pasta-sem-registro"
    | "registro-sem-pasta"
    | "arvore-mudou"
    | "mudanca-na-pasta"
    | "sem-version"
    | "version-sem-commit"
    | "version-sem-data";
  pasta: string;
  detalhe: string;
};

/** O que a régua lê do repositório, de fora — ela é pura. */
export type OQueORepositorioDiz = {
  /** `git ls-files`, da raiz. */
  versionados: readonly string[];
  /** `git rev-parse HEAD:<pasta>`, ou `null` se a pasta não está no `HEAD`. */
  arvoreNoHead: (pasta: string) => string | null;
  /** `git status --porcelain -- <pasta>`, uma linha por arquivo. */
  diferencas: (pasta: string) => readonly string[];
  /** O texto do `<pasta>/VERSION`, ou `null` se não existe. */
  version: (pasta: string) => string | null;
};

export function conferirOUpstream(
  repo: OQueORepositorioDiz,
  registro: readonly CopiaDeUpstream[] = COPIAS_DE_UPSTREAM,
): { pastas: string[]; arquivos: number; problemas: ProblemaDoUpstream[] } {
  const pastas = pastasDeUpstream(repo.versionados);
  const problemas: ProblemaDoUpstream[] = [];
  const registradas = new Map(registro.map((c) => [c.pasta, c]));

  for (const pasta of pastas) {
    const copia = registradas.get(pasta);
    if (!copia) {
      problemas.push({
        tipo: "pasta-sem-registro",
        pasta,
        detalhe: `cópia de motor sem linha em COPIAS_DE_UPSTREAM — a árvore dela é ${repo.arvoreNoHead(pasta) ?? "?"}`,
      });
    } else {
      const noHead = repo.arvoreNoHead(pasta);
      if (noHead !== copia.arvore) {
        problemas.push({
          tipo: "arvore-mudou",
          pasta,
          detalhe: `a árvore no HEAD é ${noHead ?? "(ausente)"}, e a cópia registrada é ${copia.arvore} — patch no upstream`,
        });
      }
    }
    const sujas = repo.diferencas(pasta);
    if (sujas.length > 0) {
      problemas.push({ tipo: "mudanca-na-pasta", pasta, detalhe: `difere do HEAD: ${sujas.join(" · ")}` });
    }
    const version = repo.version(pasta);
    if (version === null) {
      problemas.push({ tipo: "sem-version", pasta, detalhe: "a pasta não tem `VERSION`" });
    } else {
      const diz = oVersionDiz(version);
      if (!diz.commit) problemas.push({ tipo: "version-sem-commit", pasta, detalhe: "o `VERSION` não diz o commit" });
      if (!diz.data) problemas.push({ tipo: "version-sem-data", pasta, detalhe: "o `VERSION` não diz a data" });
    }
  }

  for (const copia of registro) {
    if (!pastas.includes(copia.pasta)) {
      problemas.push({
        tipo: "registro-sem-pasta",
        pasta: copia.pasta,
        detalhe: "linha em COPIAS_DE_UPSTREAM sem pasta versionada — a cópia saiu e o registro ficou",
      });
    }
  }

  const arquivos = repo.versionados.filter((a) => pastas.some((p) => a.startsWith(`${p}/`))).length;
  return { pastas, arquivos, problemas };
}
