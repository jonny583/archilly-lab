/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A ÂNCORA DA RODADA SEM RELATÓRIO — os dois lados. (item 002)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O buraco que eu declarei no LAB-66: *"rodada sem relatório não tem âncora para a trava morder,
 * e para essas o que resta é disciplina."* **Disciplina não é guarda.**
 *
 * A âncora escolhida é o **próprio recado** — o `<prompt>` do cabeçalho, que sempre existe —, e
 * ela foi escolhida DEPOIS de medir as outras: o PR reprovaria 38 rodadas legítimas de 42, o
 * commit tem o mesmo buraco, e a data não distingue duas rodadas no mesmo dia.
 *
 * E o histórico **não foi reescrito**: as dez que já estavam lá são classificadas pelo que o
 * título delas já diz. *A régua lê o registro; ela não o corrige.*
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CLASSES_DE_RODADA,
  ancorarRecado,
  lerRecados,
  promptsDoCabecalho,
} from "../src/classes-de-rodada.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const acumulado = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");
const ancoras = lerRecados(acumulado).map(ancorarRecado);

describe("item 002 · toda rodada tem âncora, inclusive a que não tem relatório", () => {
  test("O LADO BOM: nenhum recado do histórico fica órfão", () => {
    const orfaos = ancoras.filter((a) => a.ancora === "ORFAO");
    expect(orfaos.map((o) => o.titulo), orfaos.map((o) => o.titulo).join("\n")).toEqual([]);
  });

  /**
   * **O "dez" é do HISTÓRICO, e esta trava dizia só "dez" — caiu no primeiro recado novo da
   * classe**, que foi o disparo em vazio de 09/10. As dez são as que estão lá com `—` no campo
   * `<prompt>`, classificadas **pelo título**; as novas **declaram a classe no cabeçalho** e são
   * quantas vierem. *Contagem de histórico sem o sujeito escrito cresce junto com o presente e
   * reprova o certo* (D218, D237).
   */
  test("as DEZ do histórico levam `—` no cabeçalho, e cada uma tem a sua classe", () => {
    const semPrompt = ancoras.filter((a) => a.ancora !== "prompt");
    const comTravessao = semPrompt.filter((a) => a.prompt.trim() === "—");
    expect(comTravessao).toHaveLength(10);
    const declaradas = semPrompt.filter((a) => a.prompt.trim() !== "—");
    for (const a of declaradas) {
      // O tipo de `ancora` inclui `prompt` e `ORFAO`, que não são classes: a comparação é de
      // texto contra o vocabulário, e `ORFAO` já reprova na primeira trava deste bloco.
      expect(CLASSES_DE_RODADA.map((c) => c.id as string), a.titulo).toContain(a.ancora as string);
      expect(a.porque).toBe("a classe está declarada no próprio cabeçalho");
    }
    const porClasse = new Set(semPrompt.map((a) => a.ancora));
    // As seis classes existem porque as seis aconteceram; nenhuma nasceu vazia.
    expect([...porClasse].sort()).toEqual([
      "decisao-registrada",
      "despertador-sem-item",
      "fila-esgotada",
      "fila-recusada",
      "fora-de-fila",
      "recado-recuperado",
    ]);
  });

  test("o vocabulário é FECHADO, e cada classe diz o que é", () => {
    expect(CLASSES_DE_RODADA).toHaveLength(6);
    for (const c of CLASSES_DE_RODADA) {
      expect(c.oQue.length).toBeGreaterThan(30);
      expect(c.noTitulo.length).toBeGreaterThan(0);
    }
  });
});

describe("item 002 · O LADO RUIM: o órfão plantado reprova", () => {
  test("rodada que aconteceu e não disse o que era é ÓRFÃO", () => {
    const orfao = ancorarRecado({
      titulo: "09/10/2026 · uma rodada qualquer",
      prompt: "—",
    });
    expect(orfao.ancora).toBe("ORFAO");
    expect(orfao.porque).toContain("não disse o que era");
  });

  test("plantado NO ARQUIVO de verdade, a trava do lado bom cai", () => {
    const sabotado = `${acumulado}\n## 09/10/2026 · uma rodada qualquer\n\n\`\`\`\n=== RECADO PARA O CHAT — Lab · — ===\nEstado: x\n=== FIM ===\n\`\`\`\n`;
    const orfaos = lerRecados(sabotado).map(ancorarRecado).filter((a) => a.ancora === "ORFAO");
    expect(orfaos).toHaveLength(1);
    expect(orfaos[0]!.titulo).toContain("uma rodada qualquer");
  });

  test("classe FORA do vocabulário não vale — inventar nome não ancora", () => {
    const r = ancorarRecado({ titulo: "09/10 · rodada de arrumação", prompt: "arrumacao" });
    expect(r.ancora).toBe("ORFAO");
  });
});

describe("item 002 · a régua não repete o erro do LAB-13 e LAB-14", () => {
  test("o cabeçalho COMPOSTO continua ancorado pelo prompt", () => {
    expect(ancorarRecado({ titulo: "x", prompt: "LAB-13 e LAB-14" }).ancora).toBe("prompt");
  });

  test("prompt de OUTRA numeração também ancora — a forma, não a sigla", () => {
    for (const p of ["LF-01", "LF-FINAL", "LF-FINAL-2", "T-35", "LAB-07"]) {
      expect(promptsDoCabecalho(p), p).not.toEqual([]);
      expect(ancorarRecado({ titulo: "x", prompt: p }).ancora, p).toBe("prompt");
    }
  });

  test("e `—` NÃO vira prompt por acidente", () => {
    expect(promptsDoCabecalho("—")).toEqual([]);
  });
});
