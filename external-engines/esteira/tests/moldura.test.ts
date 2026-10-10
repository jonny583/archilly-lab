/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-56 · A trava da moldura do D159 — e de qualquer moldura corrigida.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O D159 publicou que o lote da testada é *"de frente por uma régua e sem frente pela
 * outra, e as duas estão certas"*. **Medido no LAB-48 (D168), não são duas réguas: é UMA
 * régua e UM campo que falta** — o `invariantes.ts` do Generate aceita *"a RUA PÚBLICA,
 * quando existe"*, tem o campo e o usa.
 *
 * # Por que isto precisa de trava, e não de um `sed`
 *
 * **A frase saía de um GERADOR.** `src/motores/testfit.ts` a escrevia em `naoSoubeFazer`, e
 * dali ela ia para a `COMPARACAO_DOS_MOTORES.md` (três vezes) e para
 * `docs/provas/LAB-19/tabela.json`. Corrigir os documentos e deixar o gerador faria a frase
 * **voltar sozinha** na próxima `bun run lab19` — é a forma do D104 com uma máquina atrás.
 *
 * # E a trava tem DUAS metades, porque "apagar" não é "corrigir"
 *
 * 1. a frase não pode ser **AFIRMADA** em documento vivo nenhum;
 * 2. mas ela **tem de continuar escrita, riscada**, nos lugares onde saiu — apagá-la
 *    tiraria do registro a única coisa útil que ela tem (D161). **Sem a segunda metade,
 *    esta trava passaria com a história apagada**, que é o oposto do que o D161 decidiu.
 *
 * A limpeza é a do D177 um degrau adiante: lá era `semCitacoes()`, aqui é
 * `semRiscadoNemCitado()`, porque em Markdown o riscado (`~~…~~`) é a forma de dizer *"eu
 * estou mostrando o que eu disse de errado"*. **Varredura de texto mede o que o texto AFIRMA
 * e o que ele DIZ SOBRE SI, e só a primeira é o objeto** (D137, D142, D155, D177, D179).
 */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { semComentarios, soOCodigo } from "../src/varredura-de-chamadas.ts";
import { semRiscadoNemCitado } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ler = (rel: string) => readFileSync(join(RAIZ, rel), "utf8");

/**
 * A moldura errada, pelo fragmento que de fato SAIU — e **um só**.
 *
 * # Por que não são dois, e isto me reprovou antes de sair
 *
 * A primeira versão desta trava casava também `/duas réguas discord/`. Ela ficou
 * **vermelha no `DECISOES.md`** — e o que ela acusou foi a **minha própria correção**:
 *
 * > *"**Não são** duas réguas discordando: é UMA régua e UM campo que falta."*
 *
 * **Régua que casa uma frase não distingue "X" de "não X".** É a família do D137, D142,
 * D155, D177 e D179, pela sexta vez, e a correção não é afrouxar: é **casar só a forma que
 * de fato foi publicada** — `por uma régua`, que não aparece em negação nenhuma — e exigir a
 * causa certa por uma trava **positiva**, na segunda metade deste arquivo.
 *
 * **O buraco fica declarado:** quem escrever a moldura errada com outras palavras escapa
 * desta varredura. O preço é menor que o de reprovar o próprio conserto, que foi o que o
 * D177 pagou — e a trava positiva cobre o caso que importa, porque ela exige que a causa
 * certa esteja escrita.
 */
const MOLDURA = [/por uma régua/i];


/**
 * Os documentos VIVOS que carregavam a moldura, com o que cada um tem de continuar dizendo.
 *
 * `cita` é o fragmento da correção que precisa estar lá: sem ele, "corrigir" poderia ser
 * apagar o parágrafo inteiro.
 */
const ONDE_SAIU: { arquivo: string; cita: RegExp }[] = [
  { arquivo: "docs/relatorios/LAB-45.md", cita: /UMA régua e UM campo que falta/ },
  { arquivo: "docs/PENDENCIAS_JONNY.md", cita: /LINHA NA FICHA/ },
  // O marcador precisa caber em UMA linha: a janela é medida em linhas, e o texto deste
  // arquivo quebra "UMA\nrégua" no meio da frase. Régua que procura em linha não enxerga
  // frase partida — foi a primeira coisa que esta trava me cobrou.
  { arquivo: "docs/ONDE_PARAMOS.md", cita: /MOLDURA CORRIGIDA no LAB-56/ },
  { arquivo: "docs/DECISOES.md", cita: /O TÍTULO DESTA DECISÃO ESTÁ RISCADO/ },
  { arquivo: "docs/INDEX.md", cita: /foi CORRIGIDA no LAB-56/ },
];

/**
 * Onde a moldura PODE aparecer afirmada, com o motivo. **Conjunto fechado.**
 *
 * O `RECADOS.md` é o caso que mais importa: ele é o arquivo do que **saiu** para o chat, em
 * ordem. Reescrever um recado entregue seria falsificar o registro — a correção mora nos
 * documentos vivos, não no arquivo de remessa.
 */
// Nota de como esta lista encolheu: o `LAB-54.md` estava aqui, porque ele fala de OUTRAS
// duas réguas (a minha e a do `_testadaDoLote`, que ali de fato discordam num lote). Ao
// estreitar a varredura para a frase que SAIU, ele deixou de ser acusado — e a trava da
// exceção fantasma o expulsou da lista no mesmo instante. É a guarda do LAB-36 mordendo
// dentro do prompt que a escreveu.
const PODE: Record<string, string> = {
  "docs/relatorios/RECADOS.md":
    "é o arquivo do que SAIU para o chat, em ordem cronológica: reescrever recado entregue seria falsificar o registro. A correção mora nos documentos vivos",
  "docs/relatorios/LAB-48.md":
    "é o relatório que ACHOU o erro (D168): ele cita a frase para corrigi-la, e a citação é o objeto dele",
  "docs/relatorios/LAB-56.md":
    "é o relatório desta correção: ele cita a moldura errada para mostrar o que foi trocado",
};

describe("LAB-56 · a moldura errada não é AFIRMADA em documento vivo", () => {
  for (const { arquivo } of ONDE_SAIU) {
    test(`${arquivo}: a frase só aparece riscada ou citada`, () => {
      const limpo = semRiscadoNemCitado(ler(arquivo));
      for (const re of MOLDURA) {
        expect(
          re.test(limpo),
          `${arquivo} AFIRMA a moldura errada fora de riscado e de citação — são UMA régua e UM campo que falta (D168)`,
        ).toBe(false);
      }
    });
  }

  test("a página gerada e a prova do LAB-19 não a carregam mais", () => {
    // Estes dois são SAÍDA do gerador: se a frase estiver aqui, ela voltou pela máquina.
    for (const arquivo of ["docs/COMPARACAO_DOS_MOTORES.md", "docs/provas/LAB-19/tabela.json"]) {
      for (const re of MOLDURA) {
        expect(re.test(ler(arquivo)), `${arquivo}: a moldura voltou — regere com \`bun run lab19\` e \`lab20\``).toBe(
          false,
        );
      }
    }
  });

  /**
   * **A LIMPEZA CERTA AQUI É `semComentarios()`, E EU USEI A OUTRA (D193).**
   *
   * A primeira versão deste teste usava `soOCodigo()`, que **esvazia o conteúdo das
   * strings** — e a nota do gerador É uma string: o conteúdo dela é exatamente o texto
   * publicado. Sabotei o gerador para voltar a escrever a moldura errada e **esta
   * asserção passou**, porque a frase estava dentro de uma string e o `soOCodigo()` a
   * havia apagado.
   *
   * É a lição do D179 aplicada ao contrário por mim mesma, um prompt depois de escrevê-la:
   * **`soOCodigo()` responde "o código FAZ isto?"; `semComentarios()` responde "o texto
   * DECLARA isto?"** — e aqui a pergunta é a segunda, porque o que viaja para a página é
   * a declaração, não a execução. *Usar a limpeza errada é a mesma família do nome lido no
   * lugar errado da gramática.*
   */
  test("o GERADOR não a escreve — e no comentário dele ela pode ficar", () => {
    const fonte = ler("external-engines/esteira/src/motores/testfit.ts");
    for (const re of MOLDURA) {
      // `semComentarios()`: tira o comentário e PRESERVA a string — é a string que viaja.
      expect(
        re.test(semComentarios(fonte)),
        "o gerador voltou a ESCREVER a moldura errada na nota que vai para a página e para a prova",
      ).toBe(false);
    }
    // E o comentário TEM de continuar guardando a história (D177 ao contrário: o texto que
    // fala SOBRE o erro não é o erro).
    expect(
      /por uma régua/i.test(fonte),
      "o comentário do gerador deixou de guardar a história da frase errada",
    ).toBe(true);
    // E a nota que ele gera tem de dizer a causa certa.
    expect(fonte, "o gerador não nomeia mais o campo que falta").toContain("faixaViaPublica");
    expect(fonte).toContain("CONTRATO");
    // A prova de que a limpeza escolhida é a que enxerga string: o `soOCodigo()` NÃO
    // enxergaria, e dizer isso aqui impede a troca silenciosa de volta.
    expect(
      /por uma régua/i.test(soOCodigo(fonte)),
      "o `soOCodigo()` passou a enxergar conteúdo de string — a escolha de limpeza deste teste mudou de sentido",
    ).toBe(false);
  });
});

describe("LAB-56 · e a história NÃO foi apagada — a segunda metade da trava", () => {
  for (const { arquivo, cita } of ONDE_SAIU) {
    test(`${arquivo}: mostra a frase riscada E diz a causa certa`, () => {
      const t = ler(arquivo);
      expect(/~~/.test(t), `${arquivo}: nenhum riscado — a frase foi APAGADA em vez de corrigida (D161)`).toBe(true);
      expect(cita.test(t), `${arquivo}: riscou sem dizer o que é certo — correção sem causa é só um corte`).toBe(true);
    });
  }

  /**
   * **O LIMITE É COBRADO NO BLOCO DA CORREÇÃO, e o bloco é medido (D193).**
   *
   * Duas versões desta trava passaram por uma sabotagem antes de morder, e as duas falhas
   * eram **de escopo da minha régua**, não do texto:
   *
   * 1. a primeira procurava `29`, `11` e `18` **no arquivo todo**, e o `INDEX.md` tem
   *    dezenas de linhas com `11` e `18` em outros assuntos (`LAB-11`, contagens, datas);
   * 2. a segunda usou uma janela de **25 linhas** — e no `INDEX.md`, que é uma tabela de
   *    uma linha por relatório, 25 linhas são **25 outros relatórios**.
   *
   * *O volume era da minha régua, não da coisa* — a lição do D179, duas vezes seguidas.
   * Agora a janela é a **unidade semântica**: o parágrafo, ou a LINHA quando o texto é
   * linha de tabela. Ela para na linha vazia e **não atravessa outra linha de tabela**.
   */
  const janelaDaCorrecao = (linhas: string[], i: number): string => {
    const ehOutraLinhaDeTabela = (k: number) => k !== i && linhas[k]!.trimStart().startsWith("|");
    let a = i;
    while (a > 0 && linhas[a - 1]!.trim() !== "" && !ehOutraLinhaDeTabela(a - 1)) a--;
    let b = i;
    while (b + 1 < linhas.length && linhas[b + 1]!.trim() !== "" && !ehOutraLinhaDeTabela(b + 1)) b++;
    return linhas.slice(a, b + 1).join("\n");
  };

  test("o LIMITE da correção aparece no BLOCO dela — parágrafo, ou a linha se for tabela", () => {
    // Sem o limite, a correção vira o erro simétrico: "é só o campo que falta". Medido no
    // LAB-54: das 29 de Antonina, 11 somem com o campo e 18 NÃO — essas são do motor.
    for (const { arquivo, cita } of ONDE_SAIU) {
      const linhas = ler(arquivo).split("\n");
      const i = linhas.findIndex((l) => cita.test(l));
      expect(i, `${arquivo}: o marcador da correção não está em linha nenhuma`).toBeGreaterThan(-1);
      const bloco = janelaDaCorrecao(linhas, i);
      for (const n of ["29", "11", "18"]) {
        expect(
          new RegExp(`\\b${n}\\b`).test(bloco),
          `${arquivo}: o bloco da correção (${bloco.split("\n").length} linha(s)) não diz o ${n} — ` +
            "sem as 29 acusadas, as 11 que somem e as 18 que não, a correção vira o erro simétrico",
        ).toBe(true);
      }
    }
  });

  test("a lista de quem PODE afirmar é fechada, e cada um tem motivo", () => {
    for (const [arquivo, porque] of Object.entries(PODE)) {
      expect(porque.length, `${arquivo}: exceção sem motivo é omissão com nome bonito`).toBeGreaterThan(40);
      // E a exceção tem de continuar PRECISANDO ser exceção (D136/LAB-36).
      const t = ler(arquivo);
      expect(
        MOLDURA.some((re) => re.test(t)),
        `${arquivo}: está na lista de exceções e já não cita a moldura — tire-o da lista`,
      ).toBe(true);
    }
  });
});

describe("LAB-56 · a limpeza faz o que diz, medida em texto sintético", () => {
  test("riscado sai, afirmação fica", () => {
    expect(semRiscadoNemCitado("~~por uma régua~~ e nada mais")).not.toMatch(/por uma régua/);
    expect(semRiscadoNemCitado("isto é por uma régua, afirmado")).toMatch(/por uma régua/);
  });

  test("riscado de VÁRIAS linhas sai inteiro — é a forma que o Jonny lê", () => {
    const bloco = "> ~~linha um\n> por uma régua\n> linha três~~\n>\n> e a correção";
    expect(semRiscadoNemCitado(bloco)).not.toMatch(/por uma régua/);
    expect(semRiscadoNemCitado(bloco)).toMatch(/e a correção/);
  });

  test("literal entre crases sai — é o nome de um padrão, não uma afirmação", () => {
    const linha = "a régua casava `por uma régua` e ficou vermelha";
    expect(semRiscadoNemCitado(linha)).not.toMatch(/por uma régua/);
    expect(semRiscadoNemCitado(linha)).toMatch(/ficou vermelha/);
  });

  test("citação sai nas três formas, e o resto da linha fica", () => {
    for (const forma of ['*"por uma régua"*', '**"por uma régua"**', '"por uma régua"']) {
      const linha = `eu escrevi ${forma} e estava errado`;
      expect(semRiscadoNemCitado(linha), forma).not.toMatch(/por uma régua/);
      expect(semRiscadoNemCitado(linha), forma).toMatch(/estava errado/);
    }
  });
});
