/**
 * **LAB-124 (item 900) · a pendência resolvida é marcada, nunca apagada** (D352).
 *
 * ```sh
 * bun test tests/pendencias-marcadas.test.ts
 * ```
 *
 * O `CLAUDE.md` §5 manda que item resolvido da página do Jonny seja *"marcado, nunca apagado"*, e
 * nenhuma régua perguntava isso de todas as pendências — só a do LAB-85, de uma. A §1 estava
 * respondida desde 02/10 (D84) e sem marca no título. Esta trava lê a página de verdade e a régua
 * dos dois lados. Roda **sem clones** (só lê arquivo deste repositório), e por isso está no portão
 * sem clones do `verde.yml`.
 *
 * **LAB-125 (item 900) · o resumo do alto também afirma estado** (D353): a tabela *"Em cinco
 * minutos"*, que o LAB-124 declarou não alcançar, dizia *"Ficam faltando três coisas"* com duas
 * paradas desde 12/10. Os três últimos blocos desta trava a cobram.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CINCO_MINUTOS,
  JA_RESOLVIDOS,
  PENDENCIAS,
  conferirAsPendencias,
  conferirOsCincoMinutos,
  lerNumeroPorExtenso,
  lerOsCincoMinutos,
  lerOsResolvidos,
  lerOsTitulos,
  temMarcaDeResolvida,
} from "../src/pendencias-marcadas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, "docs", "PENDENCIAS_JONNY.md"), "utf8");

const tipos = (pagina: string): string[] => conferirAsPendencias(pagina).problemas.map((p) => `${p.tipo}:${p.onde}`);

describe("LAB-124 · a página de verdade — toda pendência declarada, nenhuma apagada, toda resolvida marcada", () => {
  const r = conferirAsPendencias(PAGINA);

  test("o universo: a régua leu os mesmos títulos numerados que uma contagem ingênua conta, e não zero", () => {
    // A contagem ingênua: todo título que começa por algarismo, MENOS os datados (o "## 12/10/2026 —"
    // do alto da página é a nota de uma resposta, não uma pendência — medido na primeira rodada).
    const ingenua = PAGINA.split("\n").filter((l) => /^#{2,3} \d/.test(l) && !/^#{2,3} \d{2}\/\d{2}\/\d{4}/.test(l)).length;
    console.log(
      `    ${r.titulos} títulos numerados · ${PENDENCIAS.length} declarados · ` +
        `${r.resolvidosSemNumero} resolvidos sem número · ${r.problemas.length} problemas`,
    );
    expect(r.titulos).toBe(ingenua);
    expect(r.titulos).toBeGreaterThanOrEqual(19);
    expect(r.resolvidosSemNumero).toBe(JA_RESOLVIDOS.length);
  });

  test("nenhum problema — e a lista diz QUAIS, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("a §1, o defeito que criou a régua: está resolvida (D84) e o título tem a marca", () => {
    const p1 = PENDENCIAS.find((p) => p.numero === "1")!;
    expect(p1.estado).toBe("resolvida");
    expect(p1.fonte).toContain("D84");
    const t1 = lerOsTitulos(PAGINA).find((t) => t.numero === "1")!;
    expect(temMarcaDeResolvida(t1.titulo)).toBe(true);
  });

  test("a §11 é a mesma pendência que a régua do LAB-85 lê, e as duas dizem PARADA/aberta igual", () => {
    // A régua do LAB-85 trata a §11 como aberta enquanto o título não traz `~~`; aqui ela é `parada`.
    const p11 = PENDENCIAS.find((p) => p.numero === "11")!;
    expect(p11.estado).toBe("parada");
    const t11 = lerOsTitulos(PAGINA).find((t) => t.numero === "11")!;
    expect(t11.titulo).not.toContain("~~");
  });

  test("a declaração não tem número repetido, e toda linha diz a fonte", () => {
    expect(new Set(PENDENCIAS.map((p) => p.numero)).size).toBe(PENDENCIAS.length);
    for (const p of PENDENCIAS) expect(p.fonte.length, p.numero).toBeGreaterThan(10);
  });
});

describe("LAB-124 · a régua dos dois lados — cada defeito plantado na página é acusado pelo nome", () => {
  const trocar = (de: string, para: string): string => {
    expect(PAGINA.includes(de), de).toBe(true);
    return PAGINA.replace(de, para);
  };

  test("a §1 sem a marca (a página como estava até o LAB-124) → resolvida-sem-marca:1", () => {
    const antes = trocar(
      '## 1 · ~~Confirme o número: "desproporcional" é 3 vezes, ou 1,5 km?~~ — **você respondeu em 02/10/2026**',
      '## 1 · Confirme o número: "desproporcional" é 3 vezes, ou 1,5 km?',
    );
    expect(tipos(antes)).toEqual(["resolvida-sem-marca:1"]);
  });

  test("uma pendência APAGADA → apagada", () => {
    const linha = PAGINA.split("\n").find((l) => l.startsWith("## 8 · "))!;
    expect(tipos(trocar(linha, "## Uma seção qualquer"))).toEqual(["apagada:8"]);
  });

  test("uma pendência NOVA sem linha na declaração → sem-linha-na-lista", () => {
    const nova = `${PAGINA}\n## 13 · Uma pergunta nova\n\nTexto.\n`;
    expect(tipos(nova)).toEqual(["sem-linha-na-lista:13"]);
  });

  test("o número reaproveitado para OUTRO assunto → assunto-trocado (e não passa por ter o número)", () => {
    const linha = PAGINA.split("\n").find((l) => l.startsWith("## 8 · "))!;
    expect(tipos(trocar(linha, "## 8 · Outra coisa, com o mesmo número"))).toEqual(["assunto-trocado:8"]);
  });

  test("dois títulos com o mesmo número → numero-repetido", () => {
    const linha = PAGINA.split("\n").find((l) => l.startsWith("## 8 · "))!;
    expect(tipos(trocar(linha, `${linha}\n\n${linha}`))).toEqual(["numero-repetido:8"]);
  });

  test("a parada que perdeu o PARADA do título → parada-sem-marca", () => {
    const linha = PAGINA.split("\n").find((l) => l.startsWith("## 10 · "))!;
    expect(tipos(trocar(linha, linha.replace(/ · ⏸ .*$/, "")))).toEqual(["parada-sem-marca:10"]);
  });

  test("a aberta riscada (a mentira do outro lado) → aberta-com-marca", () => {
    const linha = PAGINA.split("\n").find((l) => l.startsWith("## 8 · "))!;
    const riscada = linha.replace("## 8 · ", "## 8 · ~~").replace(/$/, "~~ — **respondido**");
    expect(tipos(trocar(linha, riscada))).toEqual(["aberta-com-marca:8"]);
  });

  test("um item de 'Já resolvidos' apagado → resolvido-apagado", () => {
    const linha = PAGINA.split("\n").find((l) => l.includes("A superquadra nasce vazia"))!;
    expect(tipos(trocar(`${linha}\n`, ""))).toEqual(["resolvido-apagado:A superquadra nasce vazia"]);
  });

  test("um item de 'Já resolvidos' sem o risco → resolvido-sem-risco", () => {
    const linha = PAGINA.split("\n").find((l) => l.includes("A superquadra nasce vazia"))!;
    const r = tipos(trocar(linha, linha.replaceAll("~~", "")));
    expect(r).toHaveLength(1);
    expect(r[0]).toStartWith("resolvido-sem-risco:");
  });

  test("um item novo em 'Já resolvidos' que a declaração não conhece → resolvido-sem-linha", () => {
    const r = tipos(trocar(`${"## Já resolvidos"} — não precisa fazer nada\n`, `## Já resolvidos — não precisa fazer nada\n\n- ~~**Outra coisa**~~ — fechado.\n`));
    expect(r).toHaveLength(1);
    expect(r[0]).toStartWith("resolvido-sem-linha:");
  });

  test("a página sem a lista de resolvidos não é verde → sem-lista-de-resolvidos", () => {
    expect(tipos(trocar("## Já resolvidos", "## Outros"))).toEqual(["sem-lista-de-resolvidos:## Já resolvidos"]);
  });

  test("a página vazia não é verde: cada declarada sai como apagada", () => {
    const r = conferirAsPendencias("");
    expect(r.titulos).toBe(0);
    expect(r.problemas.filter((p) => p.tipo === "apagada")).toHaveLength(PENDENCIAS.length);
  });
});

describe("LAB-124 · a marca de resolvida — o caso válido que quase parece inválido", () => {
  test("a marca vale por risco OU pela palavra da resposta, na linha do título", () => {
    expect(temMarcaDeResolvida("~~A calçada é da rua~~ — **confirmado pelo chat em 15/09/2026**")).toBe(true);
    expect(temMarcaDeResolvida("A inclinação máxima de uma RUA — **você respondeu em 03/10. Obrigado.**")).toBe(true);
    expect(temMarcaDeResolvida("A pergunta que o chat respondeu: o que é um lote de forma ruim")).toBe(true);
    expect(temMarcaDeResolvida("Ligar dado pago só onde há cliente — a obra que ninguém tem ainda")).toBe(false);
  });

  test("`~~` solto não é risco: precisa fechar na mesma linha", () => {
    expect(temMarcaDeResolvida("uma pergunta ~~ sem fechar")).toBe(false);
  });

  test("'respondendo' ou 'correspondeu' não são a palavra da resposta", () => {
    expect(temMarcaDeResolvida("O que eu estou respondendo")).toBe(false);
    expect(temMarcaDeResolvida("A área que correspondeu ao lote")).toBe(false);
  });

  test("o título DATADO não é pendência: `## 12/10/2026 — …` fica fora", () => {
    expect(lerOsTitulos("## 12/10/2026 — você respondeu seis coisas\n## 3 · uma pergunta\n")).toEqual([
      { numero: "3", titulo: "uma pergunta", linha: 2 },
    ]);
  });

  test("os resolvidos são lidos só até o próximo título — o item de outra seção não entra", () => {
    const texto = "## Já resolvidos\n\n- ~~**a**~~\n\n## Outra\n\n- b\n";
    expect(lerOsResolvidos(texto)).toEqual(["- ~~**a**~~"]);
  });
});

const cinco = (pagina: string): string[] => conferirOsCincoMinutos(pagina).problemas.map((p) => `${p.tipo}:${p.onde}`);

describe("LAB-125 · a tabela 'Em cinco minutos' de verdade — cada linha aponta a pendência, e a contagem é a das abertas", () => {
  const r = conferirOsCincoMinutos(PAGINA);

  test("o universo: as linhas da tabela, contadas de um jeito ingênuo, e a frase de contagem — nenhum é zero", () => {
    const secao = PAGINA.slice(PAGINA.indexOf("## Em cinco minutos"));
    const ate = secao.slice(0, secao.indexOf("\n## ", 1));
    const ingenua = ate.split("\n").filter((l) => /^\| \*\*\d/.test(l)).length;
    console.log(`    ${r.linhas} linhas na tabela · ${CINCO_MINUTOS.length} declaradas · ${r.contagens} frase(s) de contagem · ${r.abertas} aberta(s) · ${r.problemas.length} problemas`);
    expect(r.linhas).toBe(ingenua);
    expect(r.linhas).toBeGreaterThanOrEqual(3);
    expect(r.contagens).toBeGreaterThanOrEqual(1);
  });

  test("nenhum problema — e a lista diz QUAIS, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("as linhas 1 e 2 são as pendências 5-B e 7, paradas desde 12/10; a 8 é a única aberta", () => {
    const de = (l: string): string => CINCO_MINUTOS.find((c) => c.linha === l)!.pendencia;
    expect([de("1"), de("2"), de("8")]).toEqual(["5-B", "7", "8"]);
    const estado = (n: string): string => PENDENCIAS.find((p) => p.numero === n)!.estado;
    expect([estado("5-B"), estado("7"), estado("8")]).toEqual(["parada", "parada", "aberta"]);
    expect(r.abertas).toBe(1);
  });

  test("a frase antiga continua na página, riscada — nunca apagada", () => {
    expect(PAGINA).toContain("~~**Ficam faltando três coisas, e as duas primeiras são de olhar e dizer:**~~");
  });
});

describe("LAB-125 · a régua dos cinco minutos dos dois lados — cada defeito plantado é acusado pelo nome", () => {
  const trocar = (de: string, para: string): string => {
    expect(PAGINA.includes(de), de).toBe(true);
    return PAGINA.replace(de, para);
  };
  const MARCA_1 = " ⏸ **PARADA até o Lab entrar no Generate** (pedido seu, 12/10/2026; é a 5-B) ·";
  const MARCA_2 = " ⏸ **PARADA até o Lab entrar no Generate** (pedido seu, 12/10/2026) ·";
  const NOTA = PAGINA.slice(PAGINA.indexOf("> **Nota de 16/10/2026 (LAB-125)"), PAGINA.indexOf("~~**Ficam faltando três"));

  test("a página como estava até o LAB-125 → as duas paradas sem marca, e a contagem errada", () => {
    let antes = trocar(MARCA_1, "");
    antes = antes.replace(MARCA_2, "");
    antes = antes.replace(NOTA, "");
    antes = antes.replace("~~**Ficam faltando três coisas, e as duas primeiras são de olhar e dizer:**~~", "**Ficam faltando três coisas, e as duas primeiras são de olhar e dizer:**");
    expect(cinco(antes)).toEqual([
      "cinco-minutos-parada-sem-marca:1",
      "cinco-minutos-parada-sem-marca:2",
      "cinco-minutos-contagem-errada:três≠1",
    ]);
  });

  test("a frase riscada não conta — só a que está fora do risco", () => {
    expect(cinco(trocar(NOTA, ""))).toEqual([]);
    expect(lerOsCincoMinutos(trocar(NOTA, ""))!.contagens).toEqual([]);
  });

  test("a contagem que não bate com as abertas → contagem-errada", () => {
    expect(cinco(trocar("**fica faltando uma** coisa", "**fica faltando duas** coisas"))).toEqual(["cinco-minutos-contagem-errada:duas≠1"]);
  });

  test("a contagem que a régua não lê é acusada, não aprovada → contagem-ilegivel", () => {
    expect(cinco(trocar("**fica faltando uma** coisa", "**fica faltando umas** coisas"))).toEqual(["cinco-minutos-contagem-ilegivel:umas"]);
  });

  test("uma linha nova na tabela sem declaração → sem-linha-na-lista", () => {
    const linha8 = PAGINA.split("\n").find((l) => l.startsWith("| **8** |"))!;
    expect(cinco(trocar(linha8, `${linha8}\n| **9** | outra coisa | 1 min | nada |`))).toEqual(["cinco-minutos-sem-linha-na-lista:9"]);
  });

  test("uma linha declarada que sumiu da tabela → linha-apagada (e a contagem acusa junto)", () => {
    const linha8 = PAGINA.split("\n").find((l) => l.startsWith("| **8** |"))!;
    expect(cinco(trocar(`${linha8}\n`, ""))).toEqual(["cinco-minutos-linha-apagada:8", "cinco-minutos-contagem-errada:uma≠0"]);
  });

  test("a linha com o número certo e outro assunto → assunto-trocado", () => {
    const linha8 = PAGINA.split("\n").find((l) => l.startsWith("| **8** |"))!;
    expect(cinco(trocar(linha8, "| **8** | uma coisa qualquer | 1 min | nada |"))).toEqual(["cinco-minutos-assunto-trocado:8"]);
  });

  test("a aberta marcada como parada (a mentira do outro lado) → aberta-com-marca", () => {
    expect(cinco(trocar("| **8** | **Uma obra", "| **8** | ⏸ **PARADA** · **Uma obra"))).toEqual(["cinco-minutos-aberta-com-marca:8"]);
  });

  test("a linha que aponta para uma pendência resolvida tem de ter a marca → resolvida-sem-marca", () => {
    const declaracao = CINCO_MINUTOS.map((c) => (c.linha === "8" ? { ...c, pendencia: "1" } : c));
    const p = conferirOsCincoMinutos(PAGINA, declaracao).problemas.map((x) => `${x.tipo}:${x.onde}`);
    expect(p).toEqual(["cinco-minutos-resolvida-sem-marca:8", "cinco-minutos-contagem-errada:uma≠0"]);
  });

  test("a declaração que aponta para pendência que não existe → pendencia-desconhecida", () => {
    const declaracao = [...CINCO_MINUTOS, { linha: "8", chave: "x", pendencia: "99" }];
    const p = conferirOsCincoMinutos(PAGINA, declaracao).problemas.map((x) => x.tipo);
    expect(p).toContain("cinco-minutos-pendencia-desconhecida");
  });

  test("a página sem a seção não é verde → sem-secao", () => {
    expect(cinco(trocar("## Em cinco minutos", "## Outra coisa"))).toEqual(["cinco-minutos-sem-secao:## Em cinco minutos"]);
  });

  test("a tabela é lida só até o próximo título — uma linha `| **N** |` de outra seção não entra", () => {
    const fora = `${PAGINA}\n## 99 · uma seção\n\n| **5** | fora | 1 | x |\n`;
    expect(lerOsCincoMinutos(fora)!.linhas.map((l) => l.linha)).toEqual(["1", "2", "8"]);
  });
});

describe("LAB-125 · a contagem por extenso — o caso válido que quase parece inválido", () => {
  test("lê o extenso nos dois gêneros, o algarismo, e recusa o resto", () => {
    expect([lerNumeroPorExtenso("uma"), lerNumeroPorExtenso("um"), lerNumeroPorExtenso("duas"), lerNumeroPorExtenso("Três")]).toEqual([1, 1, 2, 3]);
    expect(lerNumeroPorExtenso("nenhuma")).toBe(0);
    expect(lerNumeroPorExtenso("4")).toBe(4);
    expect(lerNumeroPorExtenso("umas")).toBeNull();
  });

  test("o negrito em volta do número não atrapalha, e 'fica' e 'ficam' valem igual", () => {
    const t = (frase: string): unknown => lerOsCincoMinutos(`## Em cinco minutos\n\n${frase}\n`)!.contagens;
    expect(t("Ficam faltando **três** coisas")).toEqual([{ palavra: "três", n: 3 }]);
    expect(t("e por isso **fica faltando uma** coisa")).toEqual([{ palavra: "uma", n: 1 }]);
    expect(t("Fica faltando nada.")).toEqual([{ palavra: "nada", n: 0 }]);
  });
});
