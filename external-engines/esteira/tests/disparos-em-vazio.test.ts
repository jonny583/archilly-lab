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
   * **O conflito do D236 fica DECLARADO enquanto o chat não desempatar.** A §1-A manda
   * *desligar* no disparo sem item; a regra da caixa manda *anotar e dormir*. Eu não escolhi em
   * silêncio — as duas páginas apontam uma para a outra, e esta trava reprova se uma delas
   * perder a referência. *Conflito que não fica declarado é resolvido pela próxima sessão sem
   * que ninguém saiba.*
   */
  test("as duas páginas que conflitam apontam uma para a outra (D236)", () => {
    const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    const comoFunciona = readFileSync(
      join(RAIZ, "docs", "caixa-de-entrada", "COMO_FUNCIONA.md"),
      "utf8",
    );
    expect(claudeMd, "a §1-A não cita a regra da caixa").toContain("caixa-de-entrada/COMO_FUNCIONA.md");
    expect(claudeMd, "a §1-A não nomeia a decisão do conflito").toContain("D236");
    expect(comoFunciona, "a regra da caixa não cita a §1-A").toContain("§1-A");
    expect(comoFunciona, "a regra da caixa não nomeia a decisão do conflito").toContain("D236");
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
    c.declarados.observados = c.linhas.length + 1;
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
