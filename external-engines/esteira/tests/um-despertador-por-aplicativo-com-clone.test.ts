/**
 * **LAB-145 (item 900) · o despertador desta casa não é o de mais ninguém — perguntado aos clones de VERDADE** (D373).
 *
 * ```sh
 * bun test tests/um-despertador-por-aplicativo-com-clone.test.ts
 * ```
 *
 * Lê os ids de tarefa agendada escritos nos arquivos **versionados** (`git grep`, nunca o disco) dos três clones que
 * esta casa tem ao lado — o Generate, o Laboratório de Parcelamento e o Geo — e pergunta se algum é de um despertador
 * desta casa. Precisa dos clones, então mora no **verde completo**, não no portão sem clones. Sem um clone, **reprova**
 * com a receita — não pula (D124).
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { lerAConta } from "../src/disparos-do-despertador.ts";
import {
  ARGUMENTOS_DO_GREP,
  OS_DESPERTADORES_DA_CASA,
  conferirOsDespertadores,
  lerOGrep,
} from "../src/um-despertador-por-aplicativo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const OS_VIZINHOS = [
  { nome: "Generate", pasta: "urban-create-hub-41d93a4d" },
  { nome: "Laboratório de Parcelamento", pasta: "motor-testfit" },
  { nome: "Geo", pasta: "urban-scout-tool" },
] as const;

function grepDosIds(cwd: string): string {
  try {
    return execFileSync("git", [...ARGUMENTOS_DO_GREP], { cwd, encoding: "utf8", maxBuffer: 1 << 28 });
  } catch (e) {
    if ((e as { status?: number }).status === 1) return "";
    throw e;
  }
}

describe("LAB-145 · os vizinhos de verdade não escrevem o despertador desta casa", () => {
  const presentes = OS_VIZINHOS.map((v) => ({ ...v, caminho: join(RAIZ, "..", v.pasta) }));

  for (const v of presentes) {
    test(`o clone do ${v.nome} está nesta máquina — sem ele, reprova com a receita`, () => {
      expect(
        existsSync(join(v.caminho, ".git")),
        `clone ausente: git clone https://github.com/jonny583/${v.pasta} ${v.caminho}`,
      ).toBe(true);
    });
  }

  test("nenhum problema, nos três — e o universo de cada um é publicado", () => {
    const arquivos = new Set(
      OS_DESPERTADORES_DA_CASA.flatMap((d) => [d.nascimento.arquivo, ...(d.fim ? [d.fim.arquivo] : [])]),
    );
    const r = conferirOsDespertadores({
      casa: lerOGrep(grepDosIds(RAIZ)),
      textos: Object.fromEntries([...arquivos].map((a) => [a, readFileSync(join(RAIZ, a), "utf8")])),
      idsDaSecao: lerAConta(readFileSync(join(RAIZ, "docs", "ONDE_PARAMOS.md"), "utf8")).idsCitados,
      vizinhos: presentes
        .filter((v) => existsSync(join(v.caminho, ".git")))
        .map((v) => ({ nome: v.nome, ids: lerOGrep(grepDosIds(v.caminho)) })),
    });
    for (const v of r.universo.vizinhos) {
      console.log(`    ${v.nome}: ${v.arquivosComId} arquivo(s) com id · ${v.idsDistintos} id(s) distinto(s)`);
    }
    expect(r.universo.vizinhos.length).toBe(OS_VIZINHOS.length);
    // Contados no LAB-145: Generate 2 ids em 6 arquivos, Laboratório de Parcelamento 9 em 11, Geo 1 em 4 — todos casas que têm despertador.
    for (const v of r.universo.vizinhos) expect(v.idsDistintos).toBeGreaterThanOrEqual(1);
    expect(r.problemas).toEqual([]);
  });
});
