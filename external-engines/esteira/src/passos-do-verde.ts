/**
 * QUANTOS PASSOS O VERDE TEM, contado no `conferir.sh` e não lembrado. (LAB-101, item 900)
 *
 * # O defeito, medido em 13/10/2026
 *
 * Duas páginas vivas dizem por extenso quantos passos o comando único roda: o `CLAUDE.md` §7
 * (*"Ele roda cobertura, precondição (…), **sete passos**"*) e a linha do `conferir.sh` no
 * `docs/INDEX.md` (*"`typecheck`, `lint` e `test` nos **dois pacotes** mais a prova no navegador —
 * **sete passos**"*). O número está certo hoje — dois pacotes × três passos + a prova no navegador
 * = 7 —, e **nenhuma trava o conferia**. O `verde.test.ts` confere que os três passos de cada
 * pacote *existem* no script, não *quantos* são.
 *
 * O caminho do erro está escrito no próprio script: ele **descobre** todo `package.json` e manda
 * acrescentar o pacote novo a `COBERTOS`. No dia em que alguém obedecer, o verde passa a ter dez
 * passos, o script continua certo, e as duas páginas continuam dizendo sete — verdes.
 *
 * > **Número escrito por extenso é número digitado à mão.** A palavra não muda quando a lista muda.
 *
 * # O que este módulo faz
 *
 * - `contarOsPassosDoScript` lê o `conferir.sh` e conta: os `passo "…"` dentro do laço
 *   `for pacote in "${COBERTOS[@]}"` valem uma vez **por pacote coberto**; os de fora valem um.
 *   **`null` quando a forma não é reconhecida** (sem `COBERTOS`, sem laço, ou laço sem `done`),
 *   nunca zero (D23): script que eu não entendi não é script sem passos.
 * - `passosAfirmados` e `pacotesAfirmados` leem, num trecho de página, o número por extenso que
 *   vem antes de *"passos"* e de *"pacotes"*. **O trecho é escolhido pelo SUJEITO** (D218): o mesmo
 *   `CLAUDE.md` diz *"Religar são DOIS passos"* três linhas abaixo, e aquilo é outro objeto.
 *
 * # O que ele NÃO alcança, dito
 *
 * - as *"duas guardas antes deles"* do `INDEX.md` (cobertura e precondição) — não são chamadas a
 *   `passo`, e contar `passos_ruins+=` fora da função seria adivinhar o que é guarda;
 * - a menção de *"sete passos"* em relato datado (`LAB-31`, `LAB-47` no `INDEX.md`, `FILA.md`,
 *   `ONDE_PARAMOS.md`, itens `-FEITO` da caixa): é história, verdadeira na data, e não se reescreve;
 * - se o passo **roda** — isso é o `conferir.sh` rodado, não o texto dele.
 */
import { lerNumeroEmPalavra } from "./varredura-do-que-eu-aceitei.ts";

/** O que a leitura do script devolveu. */
export interface PassosDoScript {
  pacotes: number;
  porPacote: number;
  avulsos: number;
  total: number;
}

const CHAMADA = /^\s*passo\s+"/;

/** Conta os passos que o `conferir.sh` roda. `null` quando a forma não é a esperada. */
export function contarOsPassosDoScript(script: string): PassosDoScript | null {
  const cobertos = script.match(/^COBERTOS=\(([^)]*)\)/m);
  if (cobertos === null) return null;
  const pacotes = [...cobertos[1]!.matchAll(/"[^"]+"/g)].length;
  if (pacotes === 0) return null;

  const linhas = script.split("\n");
  const inicio = linhas.findIndex((l) => /^for pacote in "\$\{COBERTOS\[@\]\}"; do\s*$/.test(l));
  if (inicio < 0) return null;
  const fimRel = linhas.slice(inicio + 1).findIndex((l) => /^done\s*$/.test(l));
  if (fimRel < 0) return null;
  const fim = inicio + 1 + fimRel;

  let porPacote = 0;
  let avulsos = 0;
  linhas.forEach((l, i) => {
    if (!CHAMADA.test(l)) return;
    if (i > inicio && i < fim) porPacote += 1;
    else avulsos += 1;
  });
  if (porPacote === 0) return null;
  return { pacotes, porPacote, avulsos, total: pacotes * porPacote + avulsos };
}

/** O número por extenso que vem imediatamente antes de `<substantivo>`, ou `null`. */
function numeroAntesDe(trecho: string, substantivo: string): number | null {
  const plano = trecho.replace(/\*\*/g, "").replace(/\s+/g, " ");
  const m = plano.match(
    new RegExp(`(?:^|[^\\p{L}])(\\p{L}+(?: e \\p{L}+)?) ${substantivo}(?:[^\\p{L}]|$)`, "u"),
  );
  if (m === null) return null;
  // `vinte e duas` antes; se não compõe, a última palavra sozinha (`nos dois pacotes`).
  const composto = lerNumeroEmPalavra(m[1]!);
  if (composto !== null) return composto;
  return lerNumeroEmPalavra(m[1]!.split(" ").at(-1)!);
}

export const passosAfirmados = (trecho: string): number | null => numeroAntesDe(trecho, "passos");
export const pacotesAfirmados = (trecho: string): number | null =>
  numeroAntesDe(trecho, "pacotes");

/**
 * O parágrafo do `CLAUDE.md` que descreve o comando único: o que começa por *"Ele roda
 * cobertura"*, logo depois do bloco com `./external-engines/conferir.sh`. `null` se sumiu.
 */
export function trechoDoClaude(claude: string): string | null {
  const paragrafos = claude.split(/\n\s*\n/);
  return paragrafos.find((p) => p.trimStart().startsWith("Ele roda cobertura")) ?? null;
}

/** A linha da tabela do `INDEX.md` cuja ligação é o `conferir.sh`. `null` se sumiu. */
export function trechoDoIndex(index: string): string | null {
  return (
    index.split("\n").find((l) => l.startsWith("| [`../external-engines/conferir.sh`]")) ?? null
  );
}

/** Um desacordo, nomeando o lugar e a grandeza. */
export interface DesacordoDosPassos {
  onde: string;
  grandeza: "passos" | "pacotes";
  escrito: number | null;
  contado: number;
}

/**
 * Confere as duas páginas contra o script. Trecho que sumiu e número que não se lê **reprovam**
 * (`escrito: null`): régua que não acha o sujeito não pode sair verde.
 */
export function conferirOsPassos(
  contado: PassosDoScript,
  paginas: { claude: string; index: string },
): DesacordoDosPassos[] {
  const desacordos: DesacordoDosPassos[] = [];
  const claude = trechoDoClaude(paginas.claude);
  const index = trechoDoIndex(paginas.index);

  const conferir = (
    onde: string,
    trecho: string | null,
    grandeza: "passos" | "pacotes",
    esperado: number,
  ) => {
    const escrito =
      trecho === null
        ? null
        : grandeza === "passos"
          ? passosAfirmados(trecho)
          : pacotesAfirmados(trecho);
    if (escrito !== esperado) desacordos.push({ onde, grandeza, escrito, contado: esperado });
  };

  conferir("CLAUDE.md §7", claude, "passos", contado.total);
  conferir("docs/INDEX.md (linha do conferir.sh)", index, "passos", contado.total);
  conferir("docs/INDEX.md (linha do conferir.sh)", index, "pacotes", contado.pacotes);
  return desacordos;
}
