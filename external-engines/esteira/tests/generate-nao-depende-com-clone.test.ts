/**
 * **LAB-134 (item 900) · o Generate nunca depende disto — perguntado ao clone de VERDADE** (D362).
 *
 * ```sh
 * bun test tests/generate-nao-depende-com-clone.test.ts
 * ```
 *
 * Lê os arquivos **versionados** do clone do Generate ao lado desta casa (`git ls-files`, nunca o
 * disco: o `node_modules/` de lá é da máquina) e pergunta, por LUGAR, se algum deles depende do Lab.
 * Precisa do clone, então mora no **verde completo**, não no portão sem clones. Sem o clone,
 * **reprova** — não pula (D124).
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { EXCECOES, conferirOGenerate, type ArquivoDoGenerate } from "../src/generate-nao-depende.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CLONE_DO_GENERATE = join(RAIZ, "..", "urban-create-hub-41d93a4d");

function lerOClone(): ArquivoDoGenerate[] | null {
  if (!existsSync(join(CLONE_DO_GENERATE, ".git"))) return null;
  const versionados = execFileSync("git", ["-C", CLONE_DO_GENERATE, "ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
  return versionados
    .filter((c) => existsSync(join(CLONE_DO_GENERATE, c)))
    .map((caminho) => ({ caminho, texto: readFileSync(join(CLONE_DO_GENERATE, caminho), "utf8") }));
}

describe("LAB-134 · o Generate de verdade não depende do Lab", () => {
  const arquivos = lerOClone();

  test("o clone do Generate está nesta máquina — sem ele, reprova com a receita", () => {
    expect(
      arquivos,
      `clone ausente: git clone https://github.com/jonny583/urban-create-hub-41d93a4d ${CLONE_DO_GENERATE}`,
    ).not.toBeNull();
  });

  const r = conferirOGenerate(arquivos ?? []);

  test("o universo: configurações, códigos e importações lidos — publicado, não zero", () => {
    console.log(
      `    ${r.configuracoes} configuração(ões) · ${r.codigos} códigos · ${r.importacoes} importações · ` +
        `${EXCECOES.length} exceção(ões) · ${r.problemas.length} problemas`,
    );
    // Contados no LAB-134, no Generate `18a7a6d`: 4 configurações, 608 códigos, 2 248 importações.
    expect(r.configuracoes).toBeGreaterThanOrEqual(3);
    expect(r.codigos).toBeGreaterThanOrEqual(400);
    expect(r.importacoes).toBeGreaterThanOrEqual(1000);
  });

  test("nenhum problema: nada importa o Lab, nenhuma configuração o cita, e a exceção vale", () => {
    expect(r.problemas).toEqual([]);
  });
});
