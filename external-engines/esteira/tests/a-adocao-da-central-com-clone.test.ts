/**
 * **LAB-167 (item 900) · o pacote da Central nunca está no caminho de execução — perguntado aos clones de VERDADE**
 * (D395).
 *
 * ```sh
 * bun test tests/a-adocao-da-central-com-clone.test.ts
 * ```
 *
 * As duas declarações de tipo (`tipos/archilly-central.d.ts`) dizem que o pacote só aparece *"no programa de tipos"*.
 * Até o LAB-167 a prova era `bun test` passar — e passar só dizia que a instalação no clone do Generate tinha falhado
 * (o registro de lá responde 403 nesta máquina). Aqui a pergunta é o fecho das importações de valor, a partir do
 * `include` de cada pacote, com os `paths` que levam aos clones. O motivo inteiro está no cabeçalho de
 * `src/a-adocao-da-central.ts`.
 *
 * Precisa dos clones, então mora no **verde completo**, não no portão sem clones. Sem eles, **reprova** — não pula
 * (D124).
 */
import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { fechoDeImportacoes } from "../src/a-adocao-da-central.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CLONES = ["urban-create-hub-41d93a4d", "motor-testfit"].map((r) => join(RAIZ, "..", r));

describe("LAB-167 · o fecho de valor dos dois pacotes não chega à Central", () => {
  test("os clones estão nesta máquina — sem eles, reprova com a receita", () => {
    for (const c of CLONES) {
      expect(existsSync(join(c, ".git")), `clone ausente: git clone https://github.com/jonny583/${c.split("/").pop()} ${c}`).toBe(
        true,
      );
    }
  });

  // Medidos no LAB-167, em 18/10/2026 (Generate `ebdb078`, Laboratório de Parcelamento `57261f2`):
  //   esteira — valor 424 arquivos, 73 de fora (56 Generate + 17 Laboratório), 0 chegadas · com tipos 454, 1 chegada
  //             (`src/lib/design/cores.ts` do Generate, por um `import type` em `src/lib/diretrizes/types.ts`)
  //   testfit — valor  88 arquivos, os mesmos 73 de fora, 0 chegadas · com tipos 119, a mesma chegada
  const PISOS = { esteira: { arquivos: 300, deFora: 40 }, testfit: { arquivos: 60, deFora: 40 } } as const;

  for (const pacote of ["esteira", "testfit"] as const) {
    const dir = join(RAIZ, "external-engines", pacote);
    const valor = fechoDeImportacoes(dir, false);
    const comTipos = fechoDeImportacoes(dir, true);

    test(`${pacote}: o universo é publicado, e não é zero`, () => {
      console.log(
        `    ${pacote}: valor ${valor.arquivos} arquivos (${valor.deFora} de fora) · ${valor.chegadas.length} chegadas · ` +
          `com tipos ${comTipos.arquivos} arquivos · ${comTipos.chegadas.length} chegada(s)` +
          comTipos.chegadas.map((c) => ` [${c.arquivo} ← ${c.via}]`).join(""),
      );
      expect(valor.arquivos).toBeGreaterThanOrEqual(PISOS[pacote].arquivos);
      expect(valor.deFora).toBeGreaterThanOrEqual(PISOS[pacote].deFora);
      expect(comTipos.arquivos).toBeGreaterThanOrEqual(valor.arquivos);
    });

    test(`${pacote}: nenhum caminho da família deixou de resolver`, () => {
      expect(valor.naoResolvidos).toEqual([]);
    });

    test(`${pacote}: o fecho de VALOR não chega ao pacote — o caminho de execução não o carrega`, () => {
      expect(valor.chegadas).toEqual([]);
    });
  }
});
