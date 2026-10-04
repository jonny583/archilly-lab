/**
 * A GUARDA DO `BALANCOS.md`. (LAB-42)
 *
 * ```sh
 * bun test tests/balancos.test.ts
 * ```
 *
 * # Por que um arquivo de prosa ganha guarda
 *
 * O `BALANCOS.md` nasceu de um prejuízo medido: o balanço que o chat pediu fora da
 * fila em 03/10 foi para o chat e **não para um arquivo**, e no dia seguinte a lista
 * dele teve de ser **re-derivada** com uma varredura inteira do `CLAUDE.md` — e ao
 * ser recuperada ela era **cinco linhas, não quatro, e duas estavam falsas** (D136,
 * D137).
 *
 * Um arquivo criado para impedir isso tem **o mesmo apodrecimento que ele combate**:
 *
 * - um índice que aponta para uma seção do `RECADOS.md` que mudou de título vira
 *   referência morta, e aí o balanço "está registrado" sem estar;
 * - uma entrada sem data ou sem origem não diz **se foi reconstruída**, e
 *   reconstrução sem etiqueta é invenção com cara de registro;
 * - um caminho de arquivo citado que deixou de existir é a mesma coisa que a exceção
 *   fantasma que a guarda do §7 reprova (LAB-36).
 *
 * **O `RECADOS.md` tem a trava do teto de 12 linhas desde o LF-FINAL-2, e ela morde
 * toda vez que um recado novo é escrito.** Esta é a dele.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const BALANCOS = join(RAIZ, "docs", "relatorios", "BALANCOS.md");
const RECADOS = join(RAIZ, "docs", "relatorios", "RECADOS.md");

const balancos = () => readFileSync(BALANCOS, "utf8");

describe("o `BALANCOS.md` existe e diz o que é", () => {
  test("o arquivo existe, e traz a razão de existir — não só a lista", () => {
    expect(existsSync(BALANCOS), "o BALANCOS.md é a resposta ao LAB-42").toBe(true);
    const t = balancos();
    // A frase que é a razão do arquivo. Se ela sair, o arquivo virou lista sem
    // memória de por que a lista existe — e foi a memória que custou a varredura.
    expect(t, "a lição do LAB-36 tem de viajar no arquivo").toContain(
      "O que vai ao chat e não vai a um arquivo não existe amanhã",
    );
    // E a segunda, que é a razão de registrar também o que o balanço errou.
    expect(t.toLowerCase(), "balanço recuperado se confere, não se obedece").toContain(
      "se confere, não se obedece",
    );
  });

  test("toda entrada de balanço traz data, origem e o que produziu", () => {
    const t = balancos();
    // As entradas do §1 são as que não têm outro lugar onde morar: elas precisam dos
    // campos no próprio arquivo, porque não há recado para consultar.
    const entradas = [...t.matchAll(/^### (\d+\.\d+) · (\d{2}\/\d{2}\/\d{4}) — (.+)$/gm)];
    expect(entradas.length, "o §1 tem de ter entrada de balanço").toBeGreaterThan(0);
    for (const e of entradas) {
      const titulo = e[0]!;
      const depois = t.slice(t.indexOf(titulo) + titulo.length).split(/^### /m)[0]!;
      for (const campo of ["**origem**", "**o que produziu**"]) {
        expect(depois, `${titulo}: falta o campo ${campo}`).toContain(campo);
      }
      // "onde está o original" é o campo que distingue transcrição de reconstrução,
      // e é o único que não se pode deduzir depois.
      expect(depois, `${titulo}: falta dizer onde está o original`).toContain(
        "onde está o original",
      );
    }
  });

  test("balanço RECONSTRUÍDO diz que é reconstrução, e cita a fonte", () => {
    const t = balancos();
    // O balanço de 03/10 não tem original. O registro dele é legítimo só enquanto
    // disser isso — senão ele passa a valer como transcrição, e aí o erro das "quatro
    // regras" voltaria a circular como se tivesse sido o que eu escrevi.
    const i = t.indexOf("03/10/2026 — o balanço das dívidas");
    expect(i, "o balanço de 03/10 é a razão do arquivo e tem de estar nele").toBeGreaterThan(-1);
    const bloco = t.slice(i).split(/^### /m)[0]!;
    expect(bloco.toUpperCase(), "diga que é reconstrução").toContain("RECONSTRU");
    expect(bloco, "e diga de onde cada linha veio").toContain("FILA.md");
    expect(bloco.toUpperCase(), "e o que o balanço ERROU, porque é o motivo de conferir").toContain(
      "ERROU",
    );
  });
});

describe("o índice do §2 não aponta para o vazio", () => {
  /** Os títulos de seção do `RECADOS.md`, como eles estão escritos lá. */
  const secoesDoRecados = (): string[] =>
    [...readFileSync(RECADOS, "utf8").matchAll(/^## (.+)$/gm)].map((m) => m[1]!.trim());

  test("toda seção citada no índice EXISTE no RECADOS.md, com o título igual", () => {
    // É a trava que impede a referência morta: recado renomeado derruba este teste em
    // vez de derrubar o registro em silêncio.
    const citadas = [...balancos().matchAll(/`(\d{2}\/\d{2}\/\d{4} · [^`]+)`/g)].map((m) => m[1]!);
    expect(citadas.length, "o índice do §2 tem de citar recado").toBeGreaterThan(0);
    const existentes = secoesDoRecados();
    const mortas = citadas.filter((c) => !existentes.includes(c));
    expect(mortas, "o índice cita seção que não existe no RECADOS.md").toEqual([]);
  });

  test("todo arquivo citado no BALANCOS existe", () => {
    // Mesma família da exceção fantasma que a guarda do §7 reprova (LAB-36).
    const alvos = [...balancos().matchAll(/\]\((\.\.?\/[^)#]+)\)/g)].map((m) => m[1]!);
    expect(alvos.length).toBeGreaterThan(0);
    const faltando = alvos.filter(
      (rel) => !existsSync(join(RAIZ, "docs", "relatorios", rel)),
    );
    expect(faltando, "o BALANCOS cita arquivo que não existe").toEqual([]);
  });

  test("as entradas estão em ordem cronológica", () => {
    // Ordem é o que faz "me dá tudo desde o dia tal" ser uma leitura e não uma
    // reconstrução — a mesma razão do RECADOS.md.
    const datas = [...balancos().matchAll(/^\| (\d{2})\/(\d{2})\/(\d{4}) \|/gm)].map(
      (m) => `${m[3]}-${m[2]}-${m[1]}`,
    );
    expect(datas.length, "o índice tem de ter datas").toBeGreaterThan(1);
    expect([...datas].sort(), "o índice do §2 saiu de ordem").toEqual(datas);
  });
});
