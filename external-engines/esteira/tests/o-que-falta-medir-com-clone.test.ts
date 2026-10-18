/**
 * **LAB-168 (item 900) · o `docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md` perguntado ao código DOS VIZINHOS** (D396).
 *
 * ```sh
 * bun test tests/o-que-falta-medir-com-clone.test.ts
 * ```
 *
 * As afirmações da página sobre o Generate e o Laboratório de Parcelamento, perguntadas ao clone de cada um, na
 * `origin/main`. Precisa dos clones, então mora no **verde completo**, não no portão sem clones. Sem eles, **reprova**
 * — não pula (D124). O motivo inteiro está no cabeçalho de `src/o-que-falta-medir.ts`.
 */
import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { AS_AFIRMACOES, conferirNoDisco, DIRETORIO_DA_CASA } from "../src/o-que-falta-medir.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

describe("LAB-168 · a página, perguntada ao Generate e ao Laboratório de Parcelamento", () => {
  for (const casa of ["generate", "parcelamento"] as const) {
    test(`o clone de ${casa} está nesta máquina — sem ele, reprova com a receita`, () => {
      const dir = join(RAIZ, DIRETORIO_DA_CASA[casa]);
      expect(existsSync(join(dir, ".git")), `clone ausente: git clone https://github.com/jonny583/${dir.split("/").pop()} ${dir}`).toBe(
        true,
      );
    });
  }

  const r = conferirNoDisco(RAIZ, ["generate", "parcelamento"]);

  test("o universo é publicado, e não é zero", () => {
    console.log(`    ${r.afirmacoes} afirmações dos vizinhos · respostas ${JSON.stringify(r.respostas)}`);
    expect(r.afirmacoes).toBe(AS_AFIRMACOES.filter((a) => a.casa !== "lab").length);
    expect(r.afirmacoes).toBeGreaterThanOrEqual(4);
  });

  test("nenhum problema: a página diz o que o código de cada vizinho responde hoje", () => {
    expect(r.problemas).toEqual([]);
  });
});
