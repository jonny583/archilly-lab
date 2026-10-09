/**
 * O teste da regra do RECADO. (LF-FINAL-2)
 *
 * ```sh
 * bun test
 * ```
 *
 * # Por que uma regra de documento virou teste
 *
 * O CLAUDE.md §1 fixa: o recado para o chat tem **no máximo 12 linhas**. É a
 * regra mais visível do repositório — o recado é o que o Jonny cola no chat do
 * outro aplicativo — e o LF-FINAL-2 a conferiu pela primeira vez.
 *
 * **Sete dos oito recados passaram do teto.** Nenhum por pouco: 16, 21, 19, 19,
 * 18, 19 e 16 linhas. A regra estava escrita, e ninguém a mediu.
 *
 * Por isso ela virou teste. Não adianta "prestar mais atenção": o que não é
 * medido volta a acontecer, e este repositório inteiro é sobre isso.
 *
 * # Por que o teste olha só o ÚLTIMO recado
 *
 * `RECADOS.md` é **registro do que foi enviado**, em ordem. Reescrever os sete
 * antigos para caberem no teto falsificaria o registro — eles foram enviados
 * assim, e a tabela do LF-FINAL-2 diz exatamente quais e de quanto passaram.
 *
 * O que o teste tem de impedir é o **próximo**. Olhando o último, ele morde toda
 * vez que um recado novo é escrito, sem precisar de lista de exceções que
 * envelhece.
 *
 * # Por que ele mora aqui
 *
 * `bun test` na esteira é o único corredor de teste do repositório. A regra é de
 * documento, o teste é de código, e o lugar do teste é onde ele roda.
 */
import { describe, expect, test } from "bun:test";

import { CLASSES_DE_RODADA } from "../src/classes-de-rodada.ts";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RECADOS = join(RAIZ, "docs", "relatorios", "RECADOS.md");

/**
 * Todos os recados do acumulado, em ordem, já sem as crases.
 *
 * **O recado ABRE o bloco** (§1, 08/10/2026), e o que o Jonny leva junto vem **abaixo dele, no
 * mesmo bloco**, depois da linha de marca. O teto de doze linhas é do **recado**, da marca de
 * abertura ao `=== FIM ===` — não do bloco, que pode ser longo.
 *
 * *Esta régua já esteve nas duas formas erradas no mesmo dia: primeiro exigindo que o bloco
 * **só** contivesse o recado, depois aceitando o recado em **qualquer** posição do bloco. A
 * regra que o chat escreveu é a do meio — o recado primeiro, e o resto abaixo (D215).*
 */
function recados(): string[][] {
  const texto = readFileSync(RECADOS, "utf8");
  const achados: string[][] = [];
  const re = /```\n(=== RECADO PARA O CHAT[\s\S]*?=== FIM ===)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto)) !== null) achados.push(m[1]!.trim().split("\n"));
  return achados;
}

/**
 * O cabeçalho do recado: `=== RECADO PARA O CHAT — <app> · <prompt> ===`.
 *
 * **O `<app>` deixou de ser sempre `Lab` em 09/10** — a Central mandou que a primeira palavra
 * do cabeçalho seja o NOME DO APLICATIVO, porque o chat recebe nove respostas parecidas e
 * precisa saber de quem é cada uma. A régua antiga casava `— Lab · ` literal e **reprovou o
 * cabeçalho correto** na primeira vez que ele apareceu.
 *
 * É a **terceira** vez em dois dias que uma régua minha nega o caso legítimo que ela não tinha
 * visto (D217, D219, e esta). *Régua nova nasce estreita demais, e o primeiro uso real é que
 * mostra onde.*
 */
const CABECALHO = /^=== RECADO PARA O CHAT — .+ · .+ ===$/;

/** A linha que separa o recado do que vai junto, dentro do mesmo bloco. */
const MARCA_DO_QUE_VAI_JUNTO = "--- O QUE VAI JUNTO ---";

/**
 * A marca do bloco acumulado, quando mais de um prompt rodou sem o chat voltar.
 *
 * **Ela aceita rodada FORA DE FILA, e a primeira versão não aceitava** (D219): só casava
 * `LAB-xx`, e uma rodada sem número — como as duas da regra do bloco, §1 e §1-C — não tinha
 * como ser nomeada. *Régua escrita contra uma forma só proíbe a outra que existe de verdade*,
 * e foi a mesma falta que fez a trava do D217 acusar o `LAB-13 e LAB-14`.
 *
 * Os separadores são `, ` e ` e `, porque é assim que a lista se escreve em português.
 */
/**
 * **E ela passou a aceitar CLASSE DE RODADA, no item 008** — `despertador-sem-item` e as outras
 * cinco. A régua nasceu antes das classes (item 002) e só conhecia `LAB-xx` e `§x`: no primeiro
 * bloco acumulado que juntou um disparo em vazio com um prompt, **ela reprovou o acumulado
 * certo**. É a quarta vez da mesma forma — *régua escrita contra uma forma só proíbe a outra que
 * existe de verdade* (D217, D219, D228, D237) —, e a lista das classes vem de
 * `CLASSES_DE_RODADA`, não de um literal repetido aqui.
 */
const ITEM_DO_ACUMULADO = String.raw`(?:LAB-\d\d|§[\w-]+|${CLASSES_DE_RODADA.map((c) => c.id).join("|")})`;
const MARCA_DO_ACUMULADO = new RegExp(
  `^ACUMULADO — inclui os recados ${ITEM_DO_ACUMULADO}(?:(?:, | e )${ITEM_DO_ACUMULADO})*$`,
);

describe("a regra do RECADO — CLAUDE.md §1", () => {
  test("UM BLOCO SÓ: todo bloco do acumulado ABRE com o recado", () => {
    const texto = readFileSync(RECADOS, "utf8");
    const blocos = texto.match(/```\n[\s\S]*?\n```/g) ?? [];
    const malFormados = blocos.filter((b) => !b.startsWith("```\n=== RECADO PARA O CHAT"));
    expect(
      malFormados.length,
      `${malFormados.length} bloco(s) que não abrem com o recado — o recado vem PRIMEIRO (§1)`,
    ).toBe(0);
  });

  test("o que vai junto fica DENTRO do bloco, depois da linha de marca", () => {
    const texto = readFileSync(RECADOS, "utf8");
    // A marca só pode aparecer dentro de um bloco de código, nunca solta no documento.
    const foraDeBloco = texto
      .split(/```[\s\S]*?```/)
      .some((pedaco) => pedaco.includes(MARCA_DO_QUE_VAI_JUNTO));
    expect(foraDeBloco, "a marca do que vai junto apareceu FORA de um bloco").toBe(false);
  });

  test("bloco ACUMULADO, quando houver, nomeia os recados que ele junta", () => {
    for (const r of recados()) {
      const segunda = r[1] ?? "";
      if (!segunda.startsWith("ACUMULADO")) continue;
      expect(segunda, `acumulado mal formado: ${segunda}`).toMatch(MARCA_DO_ACUMULADO);
    }
  });

  test("o ACUMULADO aceita rodada FORA DE FILA, que não tem número de prompt", () => {
    expect("ACUMULADO — inclui os recados LAB-62, LAB-63, §1 e §1-C").toMatch(MARCA_DO_ACUMULADO);
    expect("ACUMULADO — inclui os recados LAB-07").toMatch(MARCA_DO_ACUMULADO);
    // E CLASSE DE RODADA, que é o caso que ela reprovava no item 008.
    expect("ACUMULADO — inclui os recados despertador-sem-item e LAB-75").toMatch(
      MARCA_DO_ACUMULADO,
    );
    expect("ACUMULADO — inclui os recados fila-esgotada, LAB-07 e fora-de-fila").toMatch(
      MARCA_DO_ACUMULADO,
    );
    // E não aceita mush: lista sem item nomeado continua reprovando.
    expect("ACUMULADO — inclui uns recados aí").not.toMatch(MARCA_DO_ACUMULADO);
    expect("ACUMULADO — inclui os recados vários").not.toMatch(MARCA_DO_ACUMULADO);
  });

  /**
   * **O prompt do cabeçalho pode ser COMPOSTO, e a primeira versão desta trava não sabia disso.**
   *
   * Ela casava `— Lab · LAB-13 ===` exato e acusou LAB-13 e LAB-14 de não terem recado. Têm: um
   * **recado só para os dois**, de 19/09/2026, com o cabeçalho `— Lab · LAB-13 e LAB-14 ===`.
   * *Régua que casa por nome exato mede ortografia, não conteúdo* (D137) — e o acusado era o
   * **precedente** da forma ACUMULADA que o chat acabou de escrever na §1 (D217).
   */
  test("TODO relatório de prompt tem recado no arquivo, inclusive dentro de um acumulado", () => {
    const texto = readFileSync(RECADOS, "utf8");
    const cabecalhos = texto.match(/=== RECADO PARA O CHAT — [^·]+ · (.+?) ===/g) ?? [];
    const relatorios = readdirSync(join(RAIZ, "docs", "relatorios"))
      .map((f) => /^(LAB-\d\d)\.md$/.exec(f)?.[1])
      .filter((p): p is string => p !== undefined);
    expect(relatorios.length).toBeGreaterThan(20);
    expect(cabecalhos.length).toBeGreaterThan(20);
    // **Os dois escapes de texto saíram no item 003, e eles NÃO eram de propósito.** O conserto
    // do D217 deu a esta régua `!texto.includes(\`recados ${p}\`)` e `!texto.includes(\`${p},\`)`,
    // que casam o nome do prompt em QUALQUER lugar do arquivo — inclusive no corpo de outro
    // recado. Medido: apagando o bloco do recado de cada relatório, um a um, eles deixavam
    // passar **48 dos 61**, e a ferramenta acusava os 48. O caso que o D217 queria salvar — o
    // cabeçalho composto `LAB-13 e LAB-14` — já é salvo pela borda de palavra DENTRO do campo
    // `<prompt>`, e o teste seguinte prova os dois lados. *Régua nova nasce estreita demais, e
    // às vezes larga demais: as duas coisas são o mesmo defeito, ninguém a conferiu dos dois
    // lados* (D232).
    const semRecado = relatorios.filter(
      (p) => !cabecalhos.some((c) => new RegExp(`\\b${p}\\b`).test(c)),
    );
    expect(
      semRecado,
      `prompt(s) com relatório e SEM recado no arquivo: ${semRecado.join(", ")}`,
    ).toEqual([]);
  });

  test("a trava do recado ausente REPROVA de verdade — prompt inventado não tem recado", () => {
    const texto = readFileSync(RECADOS, "utf8");
    const cabecalhos = texto.match(/=== RECADO PARA O CHAT — [^·]+ · (.+?) ===/g) ?? [];
    expect(cabecalhos.some((c) => /\bLAB-99\b/.test(c))).toBe(false);
    expect(cabecalhos.some((c) => /\bLAB-13\b/.test(c))).toBe(true);
    expect(cabecalhos.some((c) => /\bLAB-14\b/.test(c))).toBe(true);
  });


  test("o acumulado tem recado, e cada um abre e fecha com a marca certa", () => {
    const todos = recados();
    expect(todos.length).toBeGreaterThan(0);
    for (const r of todos) {
      expect(r[0]).toMatch(CABECALHO);
      expect(r[r.length - 1]).toBe("=== FIM ===");
    }
  });

  test("O TETO: o último recado tem no máximo 12 linhas", () => {
    const todos = recados();
    const ultimo = todos[todos.length - 1]!;
    // A mensagem do erro traz o recado inteiro: quem quebrar isto tem de ver o
    // que escreveu, não só o número.
    expect(ultimo.length, `o último recado tem ${ultimo.length} linhas:\n${ultimo.join("\n")}`)
      .toBeLessThanOrEqual(12);
  });

  test("o último recado responde às cinco perguntas do formato", () => {
    const ultimo = recados().at(-1)!.join("\n");
    for (const campo of [
      "Estado:",
      "Feito:",
      "Achados para outros apps ou Central:",
      "Depende do Jonny:",
      "Próximo na fila:",
    ]) {
      expect(ultimo).toContain(campo);
    }
  });
});
