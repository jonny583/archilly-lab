/**
 * **item 022 · a pergunta do clone raso virou GUARDA, e ela recusa em vez de responder.**
 *
 * ```sh
 * bun test tests/profundidade-da-historia.test.ts
 * ```
 *
 * O critério da direção: *"a prova é de sentido invertido — num clone raso montado de propósito,
 * a régua tem de RECUSAR; num completo, tem de deixar passar"*, e *"`null` é não medido, nunca um
 * commit plausível"*.
 *
 * **Estas travas são herméticas de propósito:** elas não clonam nada e não leem rede. O clone
 * raso de verdade, montado com `file://`, está na ferramenta `lab89` e na prova dela — aqui a
 * régua é exercida com a profundidade **injetada**, nos três estados possíveis.
 *
 * **E há um motivo medido para isso:** o `.github/workflows/verde.yml` usa `actions/checkout@v4`
 * **sem `fetch-depth`**, cujo padrão é **1** — ou seja, **o portão roda num clone raso**. Uma
 * trava que exigisse história inteira do repositório real reprovaria ali, por um motivo que não é
 * defeito nenhum. *Guarda que confunde "não posso afirmar" com "a afirmação está errada" reprova
 * o ambiente em vez de medir a coisa.*
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PERGUNTA,
  O_QUE_IDENTIFICA_O_QUE,
  O_QUE_O_CORTE_RESPONDEU,
  lerPelaHistoria,
} from "../src/profundidade-da-historia.ts";
import {
  A_FONTE_DO_PADRAO,
  oCommitGravadoAindaEOMesmo,
  reconferirOCommitDaFonte,
} from "../src/onde-esta-o-padrao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

describe("item 022 · a régua RECUSA em clone raso, nos três estados da pergunta", () => {
  /** O que a régua **não** pode fazer: devolver um commit sem história que o sustente. */
  const UM_COMMIT_PLAUSIVEL = "944c232";

  test("O LADO RUIM: clone RASO → recusa, `valor` é null e o motivo é nomeado", () => {
    const r = lerPelaHistoria(true, () => UM_COMMIT_PLAUSIVEL);
    expect(r.podeAfirmar).toBe(false);
    expect(r.valor).toBeNull();
    expect(r.motivo).toBe("clone-raso");
    expect(r.oQueIssoQuerDizer).toContain("CORTE");
  });

  test("a recusa NÃO MEDE — o `medir` nem é chamado, para não haver a tentação", () => {
    let chamou = 0;
    lerPelaHistoria(true, () => {
      chamou += 1;
      return UM_COMMIT_PLAUSIVEL;
    });
    expect(chamou).toBe(0);
  });

  test("profundidade DESCONHECIDA também recusa — não medido não é medido (D23)", () => {
    const r = lerPelaHistoria(null, () => UM_COMMIT_PLAUSIVEL);
    expect(r.podeAfirmar).toBe(false);
    expect(r.valor).toBeNull();
    expect(r.motivo).toBe("profundidade-desconhecida");
    expect(r.oQueIssoQuerDizer).toContain("D23");
  });

  test("O LADO BOM: história INTEIRA → mede, e devolve o valor que o `medir` deu", () => {
    const r = lerPelaHistoria(false, () => "67d18d5");
    expect(r.podeAfirmar).toBe(true);
    expect(r.valor).toBe("67d18d5");
    expect(r.motivo).toBe("historia-inteira");
  });

  test("história inteira e caminho SEM commit → recusa, e não inventa", () => {
    for (const vazio of [null, ""]) {
      const r = lerPelaHistoria(false, () => vazio);
      expect(r.podeAfirmar).toBe(false);
      expect(r.valor).toBeNull();
      expect(r.motivo).toBe("caminho-sem-historia");
    }
  });

  /** A propriedade que importa: **nenhum** estado de recusa devolve valor. */
  test("em NENHUMA recusa sai valor — a propriedade, e não um caso", () => {
    for (const ehRaso of [true, null] as const) {
      for (const medido of [UM_COMMIT_PLAUSIVEL, "deadbee", null] as const) {
        const r = lerPelaHistoria(ehRaso, () => medido);
        expect(r.podeAfirmar, `${String(ehRaso)}/${String(medido)}`).toBe(false);
        expect(r.valor, `${String(ehRaso)}/${String(medido)}`).toBeNull();
      }
    }
  });
});

describe("item 022 · a porta da procedência passa pela pergunta", () => {
  test("reconferir em clone raso recusa, e o veredicto do commit gravado é `null`", () => {
    const leitura = reconferirOCommitDaFonte(true, () => "944c232");
    expect(leitura.valor).toBeNull();
    expect(oCommitGravadoAindaEOMesmo(leitura)).toBeNull();
  });

  test("com história inteira o veredicto é booleano — e bate com o gravado", () => {
    const igual = reconferirOCommitDaFonte(false, () => `${A_FONTE_DO_PADRAO.commit}0ab1`);
    expect(oCommitGravadoAindaEOMesmo(igual)).toBe(true);
    const outro = reconferirOCommitDaFonte(false, () => "944c2325f96e");
    expect(oCommitGravadoAindaEOMesmo(outro)).toBe(false);
  });

  /**
   * **O repositório REAL, com os dois desfechos aceitos e um terceiro reprovado.** No portão o
   * clone é raso e a resposta certa é a recusa; aqui na mão é a medição. O que esta trava proíbe
   * é o terceiro caso: valor devolvido sem história para sustentá-lo.
   */
  test("sobre ESTE repositório, o desfecho é medição OU recusa — nunca valor sem história", () => {
    const ehRaso = ((): boolean | null => {
      try {
        return execFileSync("git", ["-C", RAIZ, "rev-parse", "--is-shallow-repository"], {
          encoding: "utf8",
        }).trim() === "true";
      } catch {
        return null;
      }
    })();
    const leitura = lerPelaHistoria(ehRaso, () => {
      try {
        return execFileSync("git", ["-C", RAIZ, "log", "-1", "--format=%h", "--", "CLAUDE.md"], {
          encoding: "utf8",
        }).trim();
      } catch {
        return null;
      }
    });
    if (leitura.podeAfirmar) {
      expect(leitura.motivo).toBe("historia-inteira");
      expect(leitura.valor).not.toBeNull();
    } else {
      expect(leitura.valor).toBeNull();
      expect(["clone-raso", "profundidade-desconhecida", "caminho-sem-historia"]).toContain(
        leitura.motivo,
      );
    }
  });
});

describe("item 022 · o que o CORTE respondeu, e o que identifica o quê", () => {
  /**
   * As três respostas desta semana para o **mesmo arquivo do mesmo repositório** — e só a
   * terceira está na história inteira dele. *Duas profundidades diferentes dão nomes diferentes,
   * e cada uma é internamente coerente.*
   */
  test("as três respostas estão declaradas, e só UMA está na história do arquivo", () => {
    expect(O_QUE_O_CORTE_RESPONDEU).toHaveLength(3);
    const naHistoria = O_QUE_O_CORTE_RESPONDEU.filter((r) => r.estaNaHistoriaDoArquivo);
    expect(naHistoria).toHaveLength(1);
    expect(naHistoria[0]!.respondeu).toBe("67d18d5");
    // E os dois nomes falsos são DIFERENTES entre si: o corte não é um nome, é uma função
    // da profundidade.
    const falsos = O_QUE_O_CORTE_RESPONDEU.filter((r) => !r.estaNaHistoriaDoArquivo);
    expect(new Set(falsos.map((f) => f.respondeu)).size).toBe(2);
  });

  test("o rótulo, o commit e o blob têm cada um o seu objeto declarado", () => {
    expect(O_QUE_IDENTIFICA_O_QUE.blob).toContain("TEXTO");
    expect(O_QUE_IDENTIFICA_O_QUE.commit).toContain("ENTREGA");
    expect(O_QUE_IDENTIFICA_O_QUE.rotulo).toContain("dois");
  });

  /** A pergunta mora num lugar só, e o módulo a escreve por extenso (D231). */
  test("a pergunta está escrita, e o módulo a nomeia", () => {
    expect(A_PERGUNTA).toBe("git rev-parse --is-shallow-repository");
    const modulo = readFileSync(
      join(RAIZ, "external-engines", "esteira", "src", "profundidade-da-historia.ts"),
      "utf8",
    );
    expect(modulo).toContain("fetch-depth");
    expect(modulo).toContain("D23");
  });

  /** E o CI desta casa roda num clone raso — medido no arquivo, não suposto. */
  test("o `verde.yml` não pede profundidade: o portão É um clone raso", () => {
    const workflow = readFileSync(join(RAIZ, ".github", "workflows", "verde.yml"), "utf8");
    expect(workflow).toContain("actions/checkout@v4");
    expect(workflow).not.toContain("fetch-depth");
  });
});
