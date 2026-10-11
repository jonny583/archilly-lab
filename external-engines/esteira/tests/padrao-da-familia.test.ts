/**
 * **item 021 · o ponteiro do Padrão da família, conferido pelos dois lados.** (LAB-88)
 *
 * ```sh
 * bun test tests/padrao-da-familia.test.ts
 * ```
 *
 * A direção ofereceu três formas e o critério dela foi explícito: *"está escrito qual das três
 * formas você escolheu e por quê; a procedência está gravada onde a forma escolhida pede; e, se
 * tiver ficado trava, ela reprova pelos dois lados."*
 *
 * A forma escolhida é a **1 — ponteiro com procedência**, e o motivo está em
 * `src/onde-esta-o-padrao.ts`, com as medições que o decidiram (D292). Estas travas não leem
 * clone nenhum: só este repositório — e por isso vão no trabalho de CI que roda sem segredo.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_FONTE_DO_PADRAO,
  CAMINHO_DO_PONTEIRO,
  COMMIT_DA_COPIA_QUE_SAIU,
  OS_DOIS_TEXTOS_DA_3_0,
  O_TITULO_DO_PADRAO,
  conferirOPonteiro,
} from "../src/onde-esta-o-padrao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (p: string): string | null => {
  try {
    return readFileSync(join(RAIZ, p), "utf8");
  } catch {
    return null;
  }
};

describe("item 021 · o ponteiro diz a procedência inteira", () => {
  const ponteiro = ler(CAMINHO_DO_PONTEIRO);

  test("O LADO BOM: o ponteiro de hoje não deve nada — zero problemas", () => {
    expect(conferirOPonteiro(ponteiro)).toEqual([]);
  });

  test("e ele NÃO é mais a cópia: o título do Padrão não abre o arquivo", () => {
    expect(ponteiro).not.toBeNull();
    expect(ponteiro!).not.toContain(O_TITULO_DO_PADRAO);
    expect(ponteiro!.split("\n").length).toBeLessThan(COMMIT_DA_COPIA_QUE_SAIU.linhas);
  });

  test("O LADO RUIM: ponteiro sem o COMMIT reprova, e a linha nomeia o campo", () => {
    const semOCommit = ponteiro!.replaceAll(A_FONTE_DO_PADRAO.commit, "(apagado)");
    const problemas = conferirOPonteiro(semOCommit);
    expect(problemas.map((p) => p.tipo)).toContain("campo-ausente");
    expect(problemas.some((p) => p.oQue.includes(A_FONTE_DO_PADRAO.commit))).toBe(true);
  });

  /**
   * *Procedência sem o commit é procedência de RÓTULO* — e esta trava existe porque a medição
   * do próprio item mostrou que o rótulo `3.0` cobre dois textos.
   */
  test("O LADO RUIM: cada campo exigido, apagado um a um, acusa", () => {
    const campos = [
      A_FONTE_DO_PADRAO.repositorio,
      A_FONTE_DO_PADRAO.caminho,
      A_FONTE_DO_PADRAO.versao,
      A_FONTE_DO_PADRAO.commit,
      A_FONTE_DO_PADRAO.lidoEm,
      A_FONTE_DO_PADRAO.comoSeLe,
      COMMIT_DA_COPIA_QUE_SAIU.commit,
    ];
    for (const valor of campos) {
      const sem = ponteiro!.replaceAll(valor, "(apagado)");
      expect(conferirOPonteiro(sem).length, valor).toBeGreaterThan(0);
    }
  });

  test("O LADO RUIM: a cópia de volta no lugar do ponteiro acusa `e-a-copia-de-novo`", () => {
    const recolada = `${O_TITULO_DO_PADRAO}\nVersão 1 · 13/09/2026\n${ponteiro!}`;
    expect(conferirOPonteiro(recolada).map((p) => p.tipo)).toContain("e-a-copia-de-novo");
  });

  test("ponteiro ausente NÃO passa calado — é o D213, guarda que não acha o objeto", () => {
    expect(conferirOPonteiro(null)).toEqual([
      { tipo: "ponteiro-ausente", oQue: `\`${CAMINHO_DO_PONTEIRO}\` não existe` },
    ]);
  });
});

describe("item 021 · as medições que escolheram a forma 1 estão escritas", () => {
  /**
   * **A medição que mata a forma 3:** o mesmo rótulo em dois textos. Se um dia os dois commitem
   * o mesmo tamanho, esta trava cai — e cair é certo, porque o argumento era o tamanho.
   *
   * **E desde o LAB-89 ela compara BLOB, não commit** (D294): o nome do commit depende da
   * profundidade do clone de quem lê, e o blob não.
   */
  test("o rótulo `3.0` cobre DOIS textos, e eles diferem pelo BLOB", () => {
    expect(OS_DOIS_TEXTOS_DA_3_0).toHaveLength(2);
    const [antes, depois] = OS_DOIS_TEXTOS_DA_3_0;
    expect(antes!.blob).not.toBe(depois!.blob);
    expect(antes!.blob).toHaveLength(40);
    expect(depois!.linhas - antes!.linhas).toBe(19);
    expect(depois!.bytes - antes!.bytes).toBe(1314);
  });

  /**
   * **O commit que CONFIRMA não é o que ENTREGA** — e é por isso que o `96dbc9b` que eu
   * publiquei no LAB-88 estava errado: ele devolve o blob sem tê-lo entregado.
   */
  test("os commits que só CONFIRMAM o texto estão nomeados, e não viram a entrega", () => {
    const [antes] = OS_DOIS_TEXTOS_DA_3_0;
    expect(antes!.entreguePor).toBe("67d18d5");
    expect([...antes!.confirmadoSemEntregarPor]).toEqual(["96dbc9b", "170a28f"]);
    expect([...antes!.confirmadoSemEntregarPor]).not.toContain(antes!.entreguePor);
  });

  test("a cópia que saiu era uma FRAÇÃO do vigente, e a conta fecha nas duas unidades", () => {
    const porLinha = (COMMIT_DA_COPIA_QUE_SAIU.linhas / A_FONTE_DO_PADRAO.linhas) * 100;
    const porByte = (COMMIT_DA_COPIA_QUE_SAIU.bytes / A_FONTE_DO_PADRAO.bytes) * 100;
    expect(porLinha).toBeCloseTo(8.4, 1);
    expect(porByte).toBeCloseTo(11.8, 1);
    const texto = ler(CAMINHO_DO_PONTEIRO)!;
    expect(texto).toContain("8,4 %");
    expect(texto).toContain("11,8 %");
  });

  /**
   * **A fonte é PRIVADA e este repositório é PÚBLICO** — é esta linha que mata a forma 2, e ela
   * é medição: a §11 da página do Jonny já pede segredo para DOIS vizinhos privados.
   */
  test("a forma 2 cai pela visibilidade, e o motivo está declarado", () => {
    expect(A_FONTE_DO_PADRAO.visibilidade).toBe("privado");
    const modulo = ler("external-engines/esteira/src/onde-esta-o-padrao.ts")!;
    expect(modulo).toContain("privado");
    expect(modulo).toContain("D213");
  });

  /**
   * E a correção do número que eu publiquei ontem: a cópia entrou em **14/09**, no PR #12, e
   * **não** em 03/10 no PR #40 — o erro saiu de um **clone raso** (D293).
   */
  test("o commit do histórico é o da conferência do LF-FINAL, e tocou o arquivo UMA vez", () => {
    expect(COMMIT_DA_COPIA_QUE_SAIU.pr).toBe(12);
    expect(COMMIT_DA_COPIA_QUE_SAIU.quando).toBe("2026-09-14");
    expect(COMMIT_DA_COPIA_QUE_SAIU.commitsQueATocaram).toBe(1);
    const decisoes = ler("docs/DECISOES.md")!;
    expect(decisoes).toContain("D293");
    expect(decisoes).toContain("clone raso");
  });
});
