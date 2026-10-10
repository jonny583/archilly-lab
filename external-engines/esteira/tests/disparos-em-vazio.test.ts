/**
 * A guarda da CONTA DOS DISPAROS. (item 004 da caixa de entrada)
 *
 * ```sh
 * bun test tests/disparos-em-vazio.test.ts
 * ```
 *
 * O item 004 pediu três coisas e avisou o que acontece sem a terceira: *"deixe escrito o que o
 * número vai decidir — sem essa frase no arquivo, em duas semanas alguém apaga a lista por achar
 * que é ruído."* Então a frase é **cobrada**, como são cobrados os totais, a ordem, a origem de
 * cada hora e **os dois sentidos** do cruzamento com o `RECADOS.md`.
 *
 * *Régua nova nasce estreita demais, e às vezes larga demais — ela precisa aprovar o caso bom E
 * reprovar o caso ruim, os dois demonstrados.* Os dois estão aqui.
 */
import { describe, expect, test } from "bun:test";

import { comoARegraSeLe } from "../src/texto-das-regras.ts";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ancorarRecado, lerRecados } from "../src/classes-de-rodada.ts";
import {
  ORIGENS,
  conferirAConta,
  diaDe,
  diasDosRecadosEmVazio,
  lerAConta,
} from "../src/disparos-do-despertador.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ONDE_PARAMOS = join(RAIZ, "docs", "ONDE_PARAMOS.md");
const RECADOS = join(RAIZ, "docs", "relatorios", "RECADOS.md");

/** O dia em que a conta da caixa de entrada foi aberta. Antes disso é outro regime. */
const ABERTURA = "09/10/2026";

const ondeParamos = () => readFileSync(ONDE_PARAMOS, "utf8");
const recados = () => lerRecados(readFileSync(RECADOS, "utf8")).map(ancorarRecado);

describe("item 004 · a conta dos disparos do despertador", () => {
  test("O LADO BOM: a conta do ONDE_PARAMOS fecha, e sem nenhum problema", () => {
    const conta = lerAConta(ondeParamos());
    expect(conta.linhas.length, "a seção da conta não foi achada").toBeGreaterThan(0);
    const problemas = conferirAConta(conta, diasDosRecadosEmVazio(recados()), ABERTURA);
    expect(problemas.map((p) => `${p.tipo}: ${p.oQue}`)).toEqual([]);
  });

  test("a seção diz o que o número vai DECIDIR — o item 004 cobra essa frase", () => {
    expect(lerAConta(ondeParamos()).temAFraseDoQueDecide).toBe(true);
  });

  test("um id só na seção — e é o que a CONTA respondeu, não um suposto", () => {
    const conta = lerAConta(ondeParamos());
    expect(conta.idsCitados).toEqual(["trig_01XwSkTLT9zmyprNZcUiWy7f"]);
  });

  test("toda linha tem a origem declarada, e o vocabulário é FECHADO", () => {
    for (const l of lerAConta(ondeParamos()).linhas) {
      expect(ORIGENS as readonly string[], `${l.data} ${l.hora}`).toContain(l.origem);
    }
  });

  /**
   * O precedente da FILA é lido do registro **pela régua**, não digitado. Se alguém acrescentar
   * um recado dessa classe, ele aparece aqui sem ninguém mexer em código — e o cruzamento do
   * lado bom continua valendo porque o precedente é de OUTRO regime, anterior à abertura.
   */
  /**
   * **O conflito do D236 foi DESEMPATADO pelo chat no item 008 (D244): anote e durma, não
   * desligue.** A §1-A mandava desligar e estava certa quando nasceu — o desligamento **era o
   * aviso** de que a fila havia esgotado. Deixou de valer quando o chat passou a escrever na
   * caixa direto: *despertador desligado nunca pega o item que o chat escrever depois.*
   *
   * > **REGRA QUE DEIXOU DE PROTEGER E PASSOU A TRAVAR NÃO MUDOU DE TEXTO — MUDOU O MUNDO
   * > EMBAIXO DELA.**
   *
   * Esta trava guarda as duas metades: a regra nova **escrita nos dois lugares**, e o motivo da
   * velha **preservado** — *regra revogada sem o motivo escrito volta por engano.*
   */
  test("a regra do disparo em vazio é ANOTE E DURMA, nos dois lugares (D244)", () => {
    const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    const comoFunciona = readFileSync(
      join(RAIZ, "docs", "caixa-de-entrada", "COMO_FUNCIONA.md"),
      "utf8",
    );
    // **Texto de documento vem QUEBRADO em linhas, e a marca literal mede a quebra junto com o
    // conteúdo** — foi o defeito do LAB-74 §5, e ele voltou nesta mesma trava uma hora depois:
    // a lição está escrita como `MUDOU O\n  > MUNDO EMBAIXO DELA`. Normalizar o espaço antes de
    // comparar é o conserto, e é o que a guarda do item 003 já fazia. *Duas vezes em dois
    // prompts é padrão, não azar.*
    // E a marca do bloco de citação (`>`) também sobrevive à normalização do espaço: a frase
    // está dentro de um `>`, quebrada em duas linhas, e o `>` cai no meio dela. Tira-se os dois.
    // O normalizador SUBIU para `src/texto-das-regras.ts` no LAB-77 (D248): ele estava aqui,
    // inline, e a trava do item 010 reescreveu o mesmo erro por não saber que o conserto
    // existia. Conserto que mora dentro de um teste conserta um teste.
    const semQuebra = comoARegraSeLe;
    for (const [onde, texto] of [["§1-A", claudeMd], ["a regra da caixa", comoFunciona]] as const) {
      expect(texto, `${onde} não nomeia o desempate`).toContain("D244");
      expect(semQuebra(texto), `${onde} não traz a lição da regra que passou a travar`).toContain(
        "MUDOU O MUNDO EMBAIXO DELA",
      );
    }
    // A §1-A aponta para a regra da caixa, e a da caixa para a §1-A: nenhuma das duas sozinha.
    expect(claudeMd).toContain("caixa-de-entrada/COMO_FUNCIONA.md");
    expect(comoFunciona).toContain("§1-A");
    // O motivo da regra VELHA fica preservado, riscado e não apagado.
    expect(claudeMd).toContain("~~DESLIGAR o despertador~~");
    expect(claudeMd).toContain("era o aviso");
  });

  /**
   * **E ela REPROVA se a §1-A voltar a mandar desligar.** O item 008 pediu alinhar a trava, e
   * alinhar aqui é isto: a frase imperativa antiga não pode reaparecer fora do risco.
   */
  test("a §1-A não manda mais DESLIGAR — e voltar a mandar REPROVA", () => {
    const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    const secao = /\n## 1-A · [^\n]*\n([\s\S]*?)(?=\n## )/.exec(claudeMd)?.[1] ?? "";
    expect(secao.length, "a §1-A não foi achada pelo título").toBeGreaterThan(500);
    // A ordem antiga, como ordem: `**DESLIGAR o despertador**` sem o risco em volta.
    const ordemAntiga = /(?<!~~)\*\*DESLIGAR o despertador\*\*/.test(secao);
    expect(ordemAntiga, "a §1-A voltou a MANDAR desligar — o desempate do D244 diz o contrário").toBe(
      false,
    );
    expect(secao.replace(/\s+/g, " ")).toContain("NÃO DESLIGUE");
  });

  test("o precedente da FILA sai do registro, e são TRÊS — todos ANTES da abertura", () => {
    const dias = diasDosRecadosEmVazio(recados());
    // A comparação é pelo dia NORMALIZADO. `"03/10/2026" < "09/10/2026"` em texto dá o resultado
    // certo por acidente — dia primeiro ordena errado no mês seguinte, e régua que acerta por
    // acidente é régua errada esperando a data virar.
    const antes = dias.filter((d) => diaDe(d) < diaDe(ABERTURA));
    expect(antes.length).toBe(3);
    expect(new Set(antes)).toEqual(new Set(["03/10/2026", "05/10/2026"]));
  });

  /**
   * **Esta trava exigia que NENHUM recado da classe fosse do regime da caixa, e ela estava certa
   * só enquanto o caso não acontecia** — caiu no primeiro disparo em vazio, no mesmo dia em que
   * a conta abriu. O recado da classe no regime da caixa não é exceção: ele é **o parceiro do
   * cruzamento**, e quem confere que ele tem linha é o `conferirAConta`. *Régua escrita contra o
   * caso que ainda não veio proíbe o caso legítimo quando ele vem* (D217, D219, D228).
   */
  test("do regime da CAIXA em diante, cada recado da classe é o parceiro do cruzamento", () => {
    const dias = diasDosRecadosEmVazio(recados());
    const naCaixa = dias.filter((d) => diaDe(d) >= diaDe(ABERTURA));
    const vazios = lerAConta(ondeParamos()).linhas.filter((l) => l.emVazio);
    expect(new Set(naCaixa.map(diaDe))).toEqual(new Set(vazios.map((l) => diaDe(l.data))));
  });
});

describe("item 004 · O LADO RUIM: a guarda reprova", () => {
  const conta = () => lerAConta(ondeParamos());

  test("total declarado diferente das linhas contadas REPROVA", () => {
    const c = conta();
    // Desde o D281 o número do TOTAL se chama `noRegistro`: o que se chamava `observados` era
    // comparado com o total de linhas, e agora é a conta da ORIGEM `observado`.
    c.declarados.noRegistro = c.linhas.length + 1;
    const p = conferirAConta(c, diasDosRecadosEmVazio(recados()), ABERTURA);
    expect(p.map((x) => x.tipo)).toContain("total-declarado-diferente-das-linhas");
  });

  test("data fora de ordem REPROVA", () => {
    const c = conta();
    c.linhas = [...c.linhas].reverse();
    const p = conferirAConta(c, diasDosRecadosEmVazio(recados()), ABERTURA);
    expect(p.map((x) => x.tipo)).toContain("datas-fora-de-ordem");
  });

  test("origem fora do vocabulário REPROVA — hora sem origem é hora inventada", () => {
    const c = conta();
    c.linhas = [{ ...c.linhas[0]!, origem: "mais ou menos" as never }];
    c.declarados.observados = 1;
    const p = conferirAConta(c, diasDosRecadosEmVazio(recados()), ABERTURA);
    expect(p.map((x) => x.tipo)).toContain("origem-fora-do-vocabulario");
  });

  test("SENTIDO 1: disparo em vazio sem recado da classe REPROVA", () => {
    const c = conta();
    c.linhas = [{ ...c.linhas[0]!, achou: "nada na caixa", emVazio: true }];
    c.declarados.observados = 1;
    c.declarados.emVazio = 1;
    const p = conferirAConta(c, [], ABERTURA);
    expect(p.map((x) => x.tipo)).toContain("vazio-sem-recado");
  });

  test("SENTIDO 2: recado da classe sem linha em vazio na conta REPROVA", () => {
    // O dia do estrago é um que a conta NÃO tem — `09/10` passou a ter linha em vazio no
    // primeiro disparo vazio, e o estrago virou um caso legítimo.
    const c = conta();
    const diaQueNaoExiste = "31/12/2026";
    expect(c.linhas.some((l) => l.data === diaQueNaoExiste)).toBe(false);
    const p = conferirAConta(c, [diaQueNaoExiste], ABERTURA);
    expect(p.map((x) => x.tipo)).toContain("recado-sem-linha");
  });

  test("seção ausente é PROBLEMA, não aprovação", () => {
    const p = conferirAConta(lerAConta("# OUTRA COISA\n\nnada aqui\n"), [], ABERTURA);
    expect(p.map((x) => x.tipo)).toEqual(["secao-nao-encontrada"]);
  });

  test("a frase do que o número decide, se sair, REPROVA", () => {
    const c = conta();
    c.temAFraseDoQueDecide = false;
    const p = conferirAConta(c, diasDosRecadosEmVazio(recados()), ABERTURA);
    expect(p.map((x) => x.tipo)).toContain("sem-a-frase-do-que-decide");
  });

  test("um segundo id na seção REPROVA — é o defeito do D234", () => {
    const c = conta();
    c.idsCitados = ["trig_01XwSkTLT9zmyprNZcUiWy7f", "trig_outroQualquer"];
    const p = conferirAConta(c, diasDosRecadosEmVazio(recados()), ABERTURA);
    expect(p.map((x) => x.tipo)).toContain("mais-de-um-id");
  });
});

/**
 * **A RÉGUA DE LINHA LÊ AS TRÊS CLASSES, E A PALAVRA DO VAZIO TEM FRONTEIRA.** (LAB-83, D281)
 *
 * Duas cegueiras medidas na mesma rodada, as duas minhas, as duas nascidas horas antes:
 *
 * 1. eu pus `entregue-em-lote` no vocabulário (D277) e **não** na régua de linha, que casava
 *    `[a-z]+` e **parava no hífen** — as SETE linhas novas ficaram invisíveis, e o verde passou
 *    porque a régua não as viu;
 * 2. a palavra do vazio não tinha `\b`, e `vazio` casou dentro de **`esVAZIOu`** numa célula que
 *    dizia justamente que a caixa **tinha** item.
 *
 * **Na ordem da Central:** primeiro que a régua CONTINUA achando o que achava, depois que deixou
 * de achar o que não devia. Na ordem inversa, um desligamento passa por conserto.
 */
describe("D281 · a régua de linha lê as TRÊS classes, e o vazio tem fronteira de palavra", () => {
  const conta = () => lerAConta(ondeParamos());

  test("O LADO BOM, PRIMEIRO: as três origens são lidas, a de hífen inclusive", () => {
    const c = conta();
    const porOrigem = new Map<string, number>();
    for (const l of c.linhas) porOrigem.set(l.origem, (porOrigem.get(l.origem) ?? 0) + 1);
    // Todas as origens lidas estão no vocabulário, e a de hífen aparece de fato — sem ela esta
    // trava aprovaria uma régua que simplesmente não lê a classe nova.
    for (const o of porOrigem.keys()) expect(ORIGENS as readonly string[]).toContain(o);
    expect(porOrigem.get("entregue-em-lote")).toBeGreaterThan(0);
    expect(porOrigem.get("observado")).toBeGreaterThan(0);
  });

  test("O LADO BOM: a conta de hoje continua sem problema nenhum", () => {
    expect(conferirAConta(conta(), diasDosRecadosEmVazio(recados()), ABERTURA)).toEqual([]);
  });

  test("uma linha com origem de HÍFEN é parseada — e a antiga `[a-z]+` a perdia", () => {
    const comHifen = lerAConta(
      "\n# A CONTA DOS DISPAROS\n\n" +
        "| 10/10/2026 | 12:05 | entregue-em-lote | idem | não houve rodada |\n" +
        "\n# FIM\n",
    );
    expect(comHifen.linhas).toHaveLength(1);
    expect(comHifen.linhas[0]!.origem).toBe("entregue-em-lote");
    // E a prova de que isto não é de graça: a régua VELHA, aqui inline, não acha nada nela.
    const velha = /^\|\s*(\d{2}\/\d{2}\/\d{4})\s*\|\s*(\d{2}:\d{2})\s*\|\s*([a-z]+)\s*\|/;
    expect(velha.test("| 10/10/2026 | 12:05 | entregue-em-lote | idem |")).toBe(false);
  });

  test("`esvaziou` NÃO é disparo em vazio, e `nada na caixa` É", () => {
    const secao = (achou: string) =>
      lerAConta(
        "\n# A CONTA DOS DISPAROS\n\n" +
          `| 10/10/2026 | 19:06 | observado | ${achou} | item 016 |\n` +
          "\n# FIM\n",
      ).linhas[0]!.emVazio;
    // O caso que me pegou: a célula diz que a caixa TINHA item até esvaziar.
    expect(secao("chegou na hora — a caixa só esvaziou às 19:17")).toBe(false);
    // E os três sentidos que a convenção declara continuam valendo:
    expect(secao("**nada na caixa** — os dezesseis feitos")).toBe(true);
    expect(secao("a caixa estava vazia")).toBe(true);
    expect(secao("disparo sem item pronto")).toBe(true);
  });

  test("cada CLASSE tem o número dela conferido, e não só o total", () => {
    const c = conta();
    // O total fica certo e UMA classe mente: antes do D281 isto passava, porque só o total era
    // conferido — e o número por classe era prosa que ninguém media.
    c.declarados.emLote = c.declarados.emLote! + 3;
    const p = conferirAConta(c, diasDosRecadosEmVazio(recados()), ABERTURA);
    expect(p.map((x) => x.tipo)).toContain("total-declarado-diferente-das-linhas");
    expect(p.map((x) => x.oQue).join(" ")).toContain("entregues em lote");
  });

  test("o total do registro deixa de bater e REPROVA, pelo nome novo", () => {
    const c = conta();
    c.declarados.noRegistro = c.linhas.length + 5;
    const p = conferirAConta(c, diasDosRecadosEmVazio(recados()), ABERTURA);
    expect(p.map((x) => x.oQue).join(" ")).toContain("disparos no registro");
  });
});
