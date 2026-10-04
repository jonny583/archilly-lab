/**
 * O teste da página do Jonny. (LAB-20)
 *
 * ```sh
 * bun test tests/pagina.test.ts
 * ```
 *
 * # Por que uma página de documentação virou teste
 *
 * Porque tabela copiada à mão **envelhece em silêncio**: a medição muda, o texto
 * fica, e quem lê não tem como saber. Este teste **regera a página do zero** e
 * reprova se o arquivo do repositório estiver diferente. Então ou ela está em
 * dia, ou a esteira fica vermelha — e vermelho alguém vê.
 *
 * É o mesmo remédio do teste do RECADO (LF-FINAL-2): o que não é medido volta a
 * acontecer.
 *
 * # O que mais ele fixa
 *
 * - **"Testfit" nunca aparece.** É nome interno (CLAUDE.md §5), e esta página é
 *   texto para o Jonny;
 * - **a página não recomenda motor.** O prompt do LAB-13 foi explícito, e o
 *   jeito de uma recomendação entrar é alguém escrever "o melhor" sem pensar;
 * - **os quatro motores e os cinco terrenos estão todos lá** — tabela que perde
 *   uma linha em silêncio é pior que tabela nenhuma.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = join(RAIZ, "docs", "COMPARACAO_DOS_MOTORES.md");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");

const lida = () => readFileSync(PAGINA, "utf8");

describe("a página de comparação", () => {
  test("o arquivo do repositório é exatamente o que o gerador produz hoje", () => {
    const antes = lida();
    execFileSync("bun", ["ferramentas/lab20.ts"], { cwd: ESTEIRA, stdio: "pipe" });
    expect(lida()).toBe(antes);
  });

  test("os cinco terrenos estão lá", () => {
    const p = lida();
    for (const g of [
      "completo",
      "sintetico-50ha-ondulado",
      "sintetico-10ha-plano",
      "ensaio-47ha",
      "geo-antonina",
    ]) {
      expect(p).toContain(`\`${g}\``);
    }
  });

  test("os quatro motores estão em cada quadro", () => {
    const p = lida();
    const nomes = [
      "Archilly Generate — traçado ortogonal",
      "Archilly Generate — traçado espinha de peixe",
      "Laboratório de Parcelamento",
      "Symbios (motor de fora)",
    ];
    for (const n of nomes) {
      // Cinco quadros, mais uma vez na seção do que o motor não soube fazer.
      const quantas = p.split(n).length - 1;
      expect(quantas).toBeGreaterThanOrEqual(6);
    }
  });

  test('"Testfit" não aparece — é nome interno', () => {
    expect(lida().toLowerCase()).not.toContain("testfit");
  });

  test("a página não recomenda motor", () => {
    const p = lida();
    expect(p).toContain("não diz qual motor é o melhor");
    // E nenhuma frase do tipo "o melhor motor é".
    expect(p).not.toMatch(/o melhor motor (é|e) /i);
    expect(p).not.toMatch(/recomend(o|amos|ado)/i);
  });

  test("a rampa aparece com média e pico SEPARADOS, e a página diz que a média esconde", () => {
    const p = lida();
    expect(p).toContain("| rampa média | rampa no pior trecho |");
    expect(p).toContain("A rampa das ruas: a média esconde o pior trecho");
    expect(p).toContain("Olhe sempre as duas colunas juntas");
    // E o exemplo do desencontro vem da medição, com nome de terreno e motor.
    expect(p).toContain("O caso em que as duas mais discordam");
    expect(p).toMatch(/\*\*\d+,\d+ vezes\*\*/);
  });

  test("a página NÃO inventa limite legal de rampa de via", () => {
    const p = lida();
    // Os 30 % da Lei 6.766 podem aparecer, mas só com o significado certo.
    expect(p).toContain("30 % de inclinação");
    expect(p).toContain("do TERRENO");
    expect(p).toContain("que é **outra coisa**");
    // E a pergunta fica aberta, não respondida por mim.
    expect(p).toContain("Qual é a inclinação máxima que você aceita numa rua?");
  });

  test("o bloco de terreno diz para que serve, e separa as duas forças", () => {
    const p = lida();
    expect(p).toContain("Terreno em declive: o que vai dar terraplenagem");
    expect(p).toContain("comparar planos");
    expect(p).toContain("estimar");
    // As duas forças, e a assimetria entre elas.
    expect(p).toContain("**reprova** — é a Lei 6.766/1979");
    expect(p).toContain("**só avisa**");
    expect(p).toContain('a coluna da rua não diz "passa" nem "não passa"');
  });

  test("o bloco de terreno traz o pior trecho e o pior lote com NOME", () => {
    const p = lida();
    const inicio = p.indexOf("| motor | rua acima de 15 % |");
    expect(inicio).toBeGreaterThan(-1);
    const bloco = p.slice(inicio, p.indexOf("\n\n", inicio));
    const linhas = bloco.split("\n").filter((l) => l.startsWith("| Archilly") || l.startsWith("| Laborat") || l.startsWith("| Symbios"));
    expect(linhas).toHaveLength(4);
    // Cada linha nomeia a peça pior, entre acentos graves.
    for (const l of linhas) expect(l).toMatch(/`[^`]+`.*`[^`]+`/);
  });

  test("o bloco de terreno diz que NÃO calcula volume de corte e aterro", () => {
    expect(lida()).toContain("não calcula volume de corte e aterro");
  });

  test("a régua de forma aparece com os dois limiares e com o aviso de que não aprova", () => {
    const p = lida();
    expect(p).toContain("85 %");
    expect(p).toContain("70 %");
    expect(p).toContain("não aprova nem reprova");
  });

  test("a página NOMEIA o Validator como quem aprova — pedido do chat em 02/10", () => {
    const p = lida();
    expect(p).toContain("Validator");
    expect(p).toContain("quem aprova é o Validator");
    // E diz, na própria legenda da coluna, que é ele que decide.
    expect(p).toContain("é ele que diz se a proposta passa");
  });

  test("a tabela das duas réguas vem da medição, não escrita à mão", () => {
    // Ela existe para provar que forma e Validator discordam. Se os números
    // fossem fixos no gerador, o exemplo envelheceria — e o exemplo é
    // justamente o que o leitor acredita (D82).
    const p = lida();
    const inicio = p.indexOf("| caso medido |");
    const bloco = p.slice(inicio, p.indexOf("\n\n", inicio));
    const linhas = bloco.split("\n").filter((l) => l.startsWith("| ") && l.includes(" · "));
    expect(linhas.length).toBe(4);
    // Duas pontas: reprovado pelo Validator com forma limpa, e o contrário.
    expect(linhas.filter((l) => l.endsWith("**nenhum** |")).length).toBe(2);
  });

  test("a entrada da rua tem seção, e a manchete é a MEDIDA, não a frase bonita", () => {
    // O LAB-28 mediu e a conclusão veio mais modesta que a manchete: "o acesso
    // pesa mais que a escolha do programa" vale em 2 dos 5 terrenos, não em
    // todos. A página tem de dizer as duas coisas — o número incondicional (a
    // mesma coisa desenhada duas vezes dá até o dobro) e a ressalva.
    const p = lida();
    expect(p).toContain("## A entrada da rua");
    expect(p).toContain("Mesmo terreno, mesmo programa");
    expect(p).toMatch(/Em \d+ dos \d+ terrenos a entrada pesa mais; nos outros, o/);
    // A ressalva de que a variação medida é um PISO não pode sumir: seis pontos
    // não varrem o perímetro, e sem isso o número finge ser exato.
    expect(p).toContain("a variação medida é o mínimo, não o máximo");
    // E a página não pode prometer que o melhor ponto existe na vida real.
    expect(p).toContain("o melhor ponto pode não existir na vida real");
  });

  test("a coluna do acesso está na tabela de cada terreno, e vem da prova", () => {
    const p = lida();
    expect(p).toContain("se a entrada da rua mudar");
    const prova = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-19", "tabela.json"), "utf8"),
    ) as {
      glebas: { motores: Record<string, { acesso?: { lotes: { amplitudePct: number | null } } }> }[];
    };
    // Todos os quatro motores, nas cinco glebas, têm o bloco medido — o `null`
    // aqui seria "não medido", e não é o caso de nenhum.
    for (const g of prova.glebas) {
      for (const m of Object.values(g.motores)) {
        expect(m.acesso).toBeDefined();
        expect(m.acesso!.lotes.amplitudePct).not.toBeNull();
      }
    }
    // O Symbios dá amplitude ZERO, e a página escreve isso por extenso em vez de
    // "+0 %", que se lê como erro de medição.
    expect(p).toContain("**não muda nada**");
  });

  test("o aviso da ORDEM está debaixo de CADA tabela, não só na seção do acesso", () => {
    // A cobrança do chat: "a tabela comparativa ordena os motores num único ponto
    // de acesso, e só a seção do acesso avisa que isso muda até 108 % — ponha o
    // aviso onde a ordem aparece, não escondido." (LAB-34)
    //
    // Esta trava exige o aviso **colado a cada quadro**, e exige que ele diga o
    // que foi MEDIDO naquela gleba — não um texto igual em todas, que é o jeito
    // de um aviso virar decoração.
    const p = lida();
    const prova = JSON.parse(
      readFileSync(join(RAIZ, "docs", "provas", "LAB-19", "tabela.json"), "utf8"),
    ) as {
      glebas: {
        gleba: string;
        ordemDoAcesso: { posicoesComparaveis: number; ordensDistintas: number; vencedores: string[] };
      }[];
    };

    // Contar por frase é frágil: o aviso da gleba estável usa outras palavras
    // ("aguenta a mudança de entrada") que o das instáveis ("de UM ponto de
    // entrada da rua"), e a primeira versão desta trava reprovou a PÁGINA por um
    // defeito do FILTRO — 4 de 5. A conferência que vale é por posição, abaixo:
    // cada quadro tem de ter o seu aviso colado.
    const avisos: string[] = [];

    for (const g of prova.glebas) {
      // O aviso tem de vir DEPOIS do título do terreno e ANTES do terreno seguinte.
      const inicio = p.indexOf(`identificação técnica do terreno: \`${g.gleba}\``);
      expect(inicio, `o quadro de ${g.gleba} não está na página`).toBeGreaterThan(-1);
      const trecho = p.slice(inicio, inicio + 4000);
      const aviso = trecho.split("\n").find((l) => l.startsWith("> "));
      expect(aviso, `${g.gleba}: nenhum aviso colado ao quadro`).toBeDefined();
      avisos.push(aviso!);

      const o = g.ordemDoAcesso;
      if (o.posicoesComparaveis < 2) {
        expect(aviso, `${g.gleba}: sem ponto comparável, o aviso tem de dizer que não dá para saber`)
          .toContain("não dá para dizer");
      } else if (o.ordensDistintas === 1) {
        expect(aviso, `${g.gleba}: a ordem é estável e o aviso tem de dizer isso`).toContain("aguenta");
        expect(aviso).toContain("não mudou");
      } else {
        expect(aviso, `${g.gleba}: a ordem muda e o aviso tem de dizer NÃO aguenta`).toContain(
          "NÃO aguenta",
        );
        expect(aviso).toContain(`**${o.ordensDistintas} ordens diferentes**`);
        if (o.vencedores.length > 1) {
          expect(aviso, `${g.gleba}: o primeiro lugar muda e o aviso tem de dizer`).toContain(
            "o primeiro lugar muda de programa",
          );
        }
      }
    }

    expect(avisos).toHaveLength(prova.glebas.length);
    // E os avisos NÃO podem ser o mesmo texto nas cinco: aviso igual em todo
    // lugar é o jeito de um aviso virar decoração — e uma das cinco glebas tem a
    // ordem ESTÁVEL, o que precisa aparecer.
    expect(new Set(avisos).size, "cinco avisos iguais significa que nenhum foi medido").toBeGreaterThan(1);
  });

  test("a queixa que EXPLICA um número está colada ao quadro, não só no fim (LAB-37)", () => {
    // O princípio do LAB-34, aplicado a outro número: a seção do fim agrupa as
    // queixas e ELIDE os números, então um 33 na coluna `lotes` ficava sem
    // explicação justamente onde é lido.
    const p = lida();
    const inicio = p.indexOf("identificação técnica do terreno: `geo-antonina`");
    expect(inicio).toBeGreaterThan(-1);
    const trecho = p.slice(inicio, inicio + 6000);
    expect(trecho, "a entrega da testada de frente tem de aparecer no quadro").toContain(
      "a testada de frente entrou como",
    );
    expect(trecho, "a escolha que custa lote tem de aparecer no quadro").toContain(
      "o RANKING DELE escolheu",
    );
    // E com os NÚMEROS, que é o que o agrupamento do fim da página come.
    expect(trecho).toContain("`facesLoteamento: [0]`");
    expect(trecho).not.toContain("com … lotes");
  });

  test("a legenda da coluna `Lotes` diz que o número é de UM ponto de entrada", () => {
    // Sem isto, a coluna que convida a ordenar não avisa nada por si.
    const p = lida();
    expect(p).toContain("naquele ponto de entrada da rua");
    expect(p).toContain("convida a ordenar");
  });

  test("a página NÃO escolhe a entrada — isso é decisão do Jonny", () => {
    const p = lida();
    expect(p).toContain("o laboratório não escolhe a entrada");
    expect(p.toLowerCase()).not.toContain("entre pelo ponto");
  });

  test("diz de onde vêm os números: semente, contrato e o arquivo de provas", () => {
    const p = lida();
    expect(p).toContain("20260913");
    expect(p).toContain("provas/LAB-19/tabela.json");
  });

  test("o número de identificação sobrevive ao agrupamento das queixas", () => {
    // Agrupar trocava os números por reticências, e comia `D51` e `LAB-08` —
    // justamente o ponteiro para o relatório. Ver o comentário no gerador.
    const p = lida();
    expect(p).toContain("(D51)");
    expect(p).toContain("LAB-08");
    expect(p).not.toContain("D…");
    expect(p).not.toContain("LAB-…");
  });
});
