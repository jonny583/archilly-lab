/**
 * **LAB-168 (item 900) · o `docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md` perguntado ao código** (D396) — a metade SEM clones.
 *
 * ```sh
 * bun test tests/o-que-falta-medir.test.ts
 * ```
 *
 * A página afirmava o estado de três casas e ninguém perguntava; três das afirmações sobre os vizinhos e uma sobre o
 * próprio Lab estavam velhas (o motivo inteiro está no cabeçalho de `src/o-que-falta-medir.ts`). Aqui: as afirmações
 * sobre o LAB, contra a árvore desta casa, e a regra da conferência nos dois sentidos, numa árvore montada no teste.
 * As afirmações sobre o Generate e o Parcelamento moram em `o-que-falta-medir-com-clone.test.ts`.
 */
import { describe, expect, test } from "bun:test";
import { join } from "node:path";

import {
  AS_AFIRMACOES,
  type Afirmacao,
  amplitudeDaVariacaoGraus,
  conferir,
  conferirNoDisco,
  corpoDaChamada,
  foraDoRiscado,
  O_QUE_ISTO_NAO_ALCANCA,
  semComentarios,
} from "../src/o-que-falta-medir.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

describe("LAB-168 · a página, perguntada ao código do Lab", () => {
  const r = conferirNoDisco(RAIZ, ["lab"]);

  test("o universo é publicado, e não é zero", () => {
    console.log(`    ${r.afirmacoes} afirmações do Lab · respostas ${JSON.stringify(r.respostas)}`);
    expect(r.afirmacoes).toBeGreaterThanOrEqual(3);
    expect(Object.keys(r.respostas).length).toBe(r.afirmacoes);
  });

  test("nenhum problema: cada afirmação do Lab diz a resposta de hoje, e a velha só riscada", () => {
    expect(r.problemas).toEqual([]);
  });

  test("as respostas medidas em 18/10/2026: a ponte não passa o relevo; a identidade vem do motor; a ficha diz ±15°", () => {
    expect(r.respostas["generate-recebe-o-relevo-do-lab"]).toBe(false);
    expect(r.respostas["identidade-do-parcelamento-vem-do-motor"]).toBe(true);
    expect(r.respostas["a-ficha-diz-a-amplitude-certa"]).toBe(true);
  });

  test("as três casas têm afirmação, e os ids não se repetem", () => {
    const casas = new Set(AS_AFIRMACOES.map((a) => a.casa));
    expect([...casas].sort()).toEqual(["generate", "lab", "parcelamento"]);
    expect(new Set(AS_AFIRMACOES.map((a) => a.id)).size).toBe(AS_AFIRMACOES.length);
  });

  test("o que a trava não alcança está escrito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(3);
  });
});

describe("LAB-168 · as peças da pergunta, nos dois sentidos", () => {
  test("riscado sai, inclusive atravessando linha; o resto fica, com o espaço normalizado", () => {
    expect(foraDoRiscado("a ~~b\nc~~ d\n e")).toBe("a d e");
    expect(foraDoRiscado("sem risco")).toBe("sem risco");
  });

  test("comentário não responde a pergunta — mas o // logo depois de aspas ou de dois-pontos não é cortado", () => {
    expect(semComentarios("x // relevo: 1\ny")).not.toContain("relevo");
    expect(semComentarios("/* relevo: 1 */ y")).not.toContain("relevo");
    expect(semComentarios('const u = "//b";')).toContain('"//b"');
  });

  test("o corpo da chamada é o dos parênteses balanceados, e só o dela", () => {
    const c = "f(a(b), { relevo: m }); g({ relevo: x })";
    expect(corpoDaChamada(c, "f")).toBe("a(b), { relevo: m }");
    expect(corpoDaChamada(c, "h")).toBeNull();
  });

  test("a amplitude: π/6 vezes (r() − 0,5) é ±15°; π/3 é ±30°; outra forma é null", () => {
    const motor = (d: string, uso = "(r() - 0.5) * variacaoAngular(cfg)") =>
      `x = base + ${uso};\nfunction variacaoAngular(cfg: C): number {\n  return manual ? 0 : Math.PI / ${d};\n}\n`;
    expect(amplitudeDaVariacaoGraus(motor("6"))).toBe(15);
    expect(amplitudeDaVariacaoGraus(motor("3"))).toBe(30);
    expect(amplitudeDaVariacaoGraus(motor("6", "r() * variacaoAngular(cfg)"))).toBeNull();
    expect(amplitudeDaVariacaoGraus("function outra() {}\n")).toBeNull();
  });

  const A: Afirmacao = {
    id: "a",
    casa: "lab",
    arquivo: "x.ts",
    pergunta: "tem MARCA?",
    responde: (c) => c.includes("MARCA"),
    seSim: "o código tem a marca",
    seNao: "o código não tem a marca",
    velhas: ["a frase velha"],
  };
  const pag = (corpo: string) => `cita o-que-falta-medir.ts\n${corpo}`;
  const ler = (codigo: string | null) => () => codigo;
  const tipos = (pagina: string | null, codigo: string | null, afs: readonly Afirmacao[] = [A]) =>
    conferir(pagina, afs, ler(codigo)).problemas.map((p) => p.tipo);

  test("APROVA: a resposta de hoje, e a velha riscada — o caso que quase parece inválido", () => {
    expect(tipos(pag("o código tem a marca. ~~a frase velha~~"), "MARCA")).toEqual([]);
    expect(tipos(pag("o código não\ntem a marca"), "nada")).toEqual([]);
  });

  test("REPROVA: a resposta de hoje ausente", () => {
    expect(tipos(pag("nada"), "MARCA")).toContain("resposta-de-hoje-ausente");
  });

  test("REPROVA: o código mudou e a página continua dizendo a resposta de ontem", () => {
    const t = tipos(pag("o código tem a marca"), "sumiu");
    expect(t).toContain("resposta-de-hoje-ausente");
    expect(t).toContain("resposta-contraria-presente");
  });

  test("REPROVA: a frase velha sem riscar", () => {
    expect(tipos(pag("o código tem a marca. a frase velha"), "MARCA")).toEqual(["frase-velha-sem-riscar"]);
  });

  test("REPROVA: a página sem citar a trava, ausente, o arquivo ausente, o universo vazio", () => {
    expect(tipos("o código tem a marca", "MARCA")).toEqual(["afirmacao-sem-trava-citada"]);
    expect(tipos(null, "MARCA")).toEqual(["pagina-ausente"]);
    expect(tipos(pag("o código tem a marca"), null)).toEqual(["arquivo-ausente"]);
    expect(tipos(pag(""), "MARCA", [])).toEqual(["universo-vazio"]);
  });

  test("REPROVA: a trava citada só dentro do riscado não conta", () => {
    expect(tipos("~~o-que-falta-medir.ts~~ o código tem a marca", "MARCA")).toEqual(["afirmacao-sem-trava-citada"]);
  });
});
