/**
 * **LAB-191 (item 900) · os nomes do Generate na página do adaptador do Symbios — perguntados ao clone de VERDADE** (D419).
 *
 * ```sh
 * bun test tests/a-pagina-do-adaptador-com-clone.test.ts
 * ```
 *
 * A página e o `src/contrato.ts` do adaptador dizem que dois padrões do contrato de entrada são do Generate: 10 % é o
 * `LIMITES_TOPOGRAFIA.rampaMaxPct` e 8,4 m é o `NORMA_BR.viario.valor.caixaMinima`. Até o LAB-191 os dois diziam
 * `NORMA_BR.via.caixaMinima`, um nome que o Generate nunca teve. Aqui cada nome é procurado no arquivo de lá e o valor
 * conferido contra o `PARAMETROS_PADRAO` — o motivo inteiro está no cabeçalho de `src/a-pagina-do-adaptador.ts`.
 *
 * Precisa do clone, então mora no **verde completo**, não no portão sem clones. Sem ele, **reprova** — não pula (D124).
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { NO_GENERATE, O_CONTRATO, conferirNoGenerate, oValorNoArquivo } from "../src/a-pagina-do-adaptador.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const GENERATE = join(RAIZ, "..", "urban-create-hub-41d93a4d");
const CONTRATO = readFileSync(join(RAIZ, O_CONTRATO), "utf8");

describe("LAB-191 · os dois nomes existem no Generate e valem o padrão", () => {
  test("o clone está nesta máquina — sem ele, reprova com a receita", () => {
    expect(existsSync(join(GENERATE, ".git")), `clone ausente: git clone https://github.com/jonny583/urban-create-hub-41d93a4d ${GENERATE}`).toBe(true);
  });

  test("zero problemas, e o universo publicado", () => {
    const p = conferirNoGenerate(GENERATE, CONTRATO);
    // Medido em 19/10/2026 (Generate `9ea21fb`): rampaMaxPct 10, caixaMinima 6 + 2 * 1.2 = 8,4.
    console.log(`    [a-pagina-do-adaptador · Generate] ${NO_GENERATE.length} nomes · ${p.length} problemas`);
    expect(p).toEqual([]);
  });

  test("o nome que a página dizia até o LAB-191 não existe lá", () => {
    expect(oValorNoArquivo(readFileSync(join(GENERATE, "src/lib/normas/br.ts"), "utf8"), "NORMA_BR.via.caixaMinima")).toBeNull();
  });

  test("o padrão que diverge do Generate reprova", () => {
    const p = conferirNoGenerate(GENERATE, CONTRATO.replace("rampaMaxima_pct: 10,", "rampaMaxima_pct: 12,"));
    expect(p.some((x) => x.includes("LIMITES_TOPOGRAFIA.rampaMaxPct vale 10"))).toBe(true);
  });
});
