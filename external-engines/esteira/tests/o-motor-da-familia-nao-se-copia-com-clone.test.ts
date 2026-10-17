/**
 * **LAB-146 (item 900) · o motor da família não se copia — perguntado aos clones de VERDADE** (D374).
 *
 * ```sh
 * bun test tests/o-motor-da-familia-nao-se-copia-com-clone.test.ts
 * ```
 *
 * Lê os arquivos de código **versionados** (`git ls-files`, nunca o disco) desta casa e dos dois clones da família que
 * ela lê por caminho — o Laboratório de Parcelamento e o Generate — e pergunta se algum arquivo daqui é cópia de um de
 * lá. Precisa dos clones, então mora no **verde completo**, não no portão sem clones. Sem um clone, **reprova** com a
 * receita — não pula (D124).
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { Arquivo } from "../src/adapter-unica-fronteira.ts";
import {
  ARGUMENTOS_DO_LS_FILES,
  CLONES_DA_FAMILIA,
  EXTENSOES_DE_CODIGO,
  conferirQueOMotorNaoSeCopia,
  lerOLsFiles,
} from "../src/o-motor-da-familia-nao-se-copia.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

function versionados(cwd: string): Arquivo[] {
  const saida = execFileSync("git", [...ARGUMENTOS_DO_LS_FILES], { cwd, encoding: "utf8", maxBuffer: 1 << 28 });
  return lerOLsFiles(saida)
    .filter((c) => EXTENSOES_DE_CODIGO.test(c) && existsSync(join(cwd, c)))
    .map((caminho) => ({ caminho, texto: readFileSync(join(cwd, caminho), "utf8") }));
}

describe("LAB-146 · nenhum arquivo desta casa é cópia de um motor da família", () => {
  const clones = CLONES_DA_FAMILIA.map((c) => ({ ...c, caminho: join(RAIZ, "..", c.pasta) }));

  for (const c of clones) {
    test(`o clone \`${c.pasta}\` está nesta máquina — sem ele, reprova com a receita`, () => {
      expect(
        existsSync(join(c.caminho, ".git")),
        `clone ausente: git clone https://github.com/jonny583/${c.pasta} ${c.caminho}`,
      ).toBe(true);
    });
  }

  test("nenhum problema — e o universo e a folga são publicados", () => {
    const r = conferirQueOMotorNaoSeCopia({
      casa: versionados(RAIZ),
      vizinhos: clones
        .filter((c) => existsSync(join(c.caminho, ".git")))
        .map((c) => ({ pasta: c.pasta, arquivos: versionados(c.caminho) })),
    });
    console.log(`    esta casa: ${r.universo.arquivosDaCasa} arquivo(s) de código`);
    for (const v of r.universo.vizinhos) console.log(`    ${v.pasta}: ${v.arquivos} arquivo(s) de código`);
    const m = r.maisParecidoSemDeclaracao;
    if (m) {
      console.log(
        `    o mais parecido sem declaração: ${m.arquivo} ~ ${m.com}: ${m.comum} de ${m.linhas} linhas ` +
          `(${Math.round(m.fracao * 100)} %)`,
      );
    }
    expect(r.universo.vizinhos.length).toBe(CLONES_DA_FAMILIA.length);
    expect(r.problemas).toEqual([]);
    // Medido no LAB-146: 15 % e 9 linhas. A folga até a régua (50 % / 30 linhas) é o que esta linha guarda de ver.
    expect(m).not.toBeNull();
  });
});
