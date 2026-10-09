/**
 * A guarda do item 003: **o escopo declarado contra os instrumentos rodando.**
 *
 * ```sh
 * bun test tests/escopo-dos-instrumentos.test.ts
 * ```
 *
 * O item 003 recusou o lugar da frase, não a frase: *"recado não é contrato — amanhã alguém roda
 * só uma das duas e conclui que está coberto."* Então o escopo foi para
 * `docs/referencia/FERRAMENTA_E_TRAVA.md`, e **documento também envelhece**. Esta trava é o que
 * impede: ela conta os testes nos arquivos de trava, conta os caminhos de reprovação na
 * ferramenta, e cobra que o documento cite tudo o que a declaração tem.
 *
 * *Lista que não se revalida envelhece igual a comentário* (D104).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ARQUIVOS_DA_TRAVA,
  A_FERRAMENTA,
  O_QUE_NINGUEM_PEGA,
  SABOTAGENS,
  VERIFICACOES,
  aIntersecao,
  soDa,
  testesDeclarados,
} from "../src/escopo-dos-instrumentos.ts";

const ESTEIRA = join(import.meta.dirname, "..");
const RAIZ = join(ESTEIRA, "..", "..");
const DOC = join(RAIZ, "docs", "referencia", "FERRAMENTA_E_TRAVA.md");

const ler = (p: string) => readFileSync(p, "utf8");
/**
 * O documento **sem negrito e sem crase**, em minúsculas: é assim que as marcas declaradas são
 * procuradas nele. *Documento é para ler, então ele leva marcação; a marca é o conteúdo.*
 */
const doc = () => ler(DOC).replace(/[*`]/g, "").toLowerCase();

/** Quantos `test(` um arquivo de teste tem de verdade. */
function quantosTestes(arquivo: string): number {
  return (ler(join(ESTEIRA, arquivo)).match(/^\s*test\(/gm) ?? []).length;
}

describe("item 003 · a declaração contra os instrumentos", () => {
  test("a soma dos testes declarados é a que os arquivos de trava têm", () => {
    const reais = ARQUIVOS_DA_TRAVA.reduce((s, a) => s + quantosTestes(a), 0);
    expect(reais).toBeGreaterThan(0);
    expect(
      testesDeclarados(),
      `a declaração soma ${testesDeclarados()} testes e os arquivos de trava têm ${reais}`,
    ).toBe(reais);
  });

  /**
   * **A ferramenta reprova EXATAMENTE a interseção**, e é o achado da conta: tudo o que é só
   * dela mede e não reprova. Se ela ganhar um caminho de reprovação novo, esta trava cai antes
   * de o documento mentir.
   */
  test("os caminhos de reprovação da ferramenta são a interseção, e nada mais", () => {
    const fonte = ler(join(ESTEIRA, A_FERRAMENTA.arquivo));
    const empurroes = (fonte.match(/problemas\.push\(/g) ?? []).length;
    expect(empurroes).toBe(aIntersecao().length);
    for (const v of soDa("ferramenta")) expect(v.reprova).toBe(false);
  });

  test("o nome que o item supôs NÃO existe, e o de verdade existe", () => {
    const pacotes = [
      join(ESTEIRA, "package.json"),
      join(RAIZ, "external-engines", "testfit", "package.json"),
    ].map((p) => JSON.parse(ler(p)) as { scripts?: Record<string, string> });
    const script = A_FERRAMENTA.oNomeQueOItemSupos.replace(/^npm run /, "");
    expect(pacotes.some((p) => p.scripts?.[script] !== undefined)).toBe(false);
    expect(pacotes[0]!.scripts?.[A_FERRAMENTA.comando.replace(/^npm run /, "")]).toBeDefined();
  });

  test("nenhuma verificação fica sem instrumento, e nenhum id se repete", () => {
    for (const v of VERIFICACOES) expect(v.quem.length, `sem instrumento: ${v.id}`).toBeGreaterThan(0);
    expect(new Set(VERIFICACOES.map((v) => v.id)).size).toBe(VERIFICACOES.length);
  });

  test("a partição fecha: interseção + só da ferramenta + só da trava = o total", () => {
    expect(aIntersecao().length + soDa("ferramenta").length + soDa("trava").length).toBe(
      VERIFICACOES.length,
    );
  });

  /**
   * **A soma é invariante FRACA** (D212): ela fecharia com uma verificação a mais numa classe e
   * uma a menos noutra. Então o documento é cobrado **linha por linha**.
   */
  test("o documento cita TODA verificação, TODA sabotagem e TODO buraco", () => {
    const t = doc();
    const marca = (x: string) => x.replace(/[*`]/g, "").toLowerCase();
    for (const v of VERIFICACOES) {
      expect(t, `o documento não cita ${v.id}`).toContain(marca(v.marcaNoDocumento));
    }
    for (const s of SABOTAGENS) {
      expect(t, `sabotagem nº ${s.n} ausente do documento`).toContain(marca(s.oQue));
    }
    for (const b of O_QUE_NINGUEM_PEGA) {
      expect(t, `buraco ausente do documento: ${b.oQue}`).toContain(marca(b.marcaNoDocumento));
    }
  });

  test("o documento declara o total certo de verificações, por extenso", () => {
    const porExtenso: Record<number, string> = { 12: "doze", 13: "treze", 14: "catorze" };
    const palavra = porExtenso[VERIFICACOES.length];
    expect(palavra, `escreva ${VERIFICACOES.length} por extenso no mapa desta trava`).toBeDefined();
    expect(doc()).toContain(`${palavra} verificações`);
    // E o total VELHO não fica largado em outra frase — foi o defeito do §6 (D212).
    for (const [n, p] of Object.entries(porExtenso)) {
      if (Number(n) === VERIFICACOES.length) continue;
      expect(doc(), `o documento ainda conta "${p} verificações"`).not.toContain(
        `${p} verificações`,
      );
    }
  });

  test("todo buraco diz o que faria pegar — buraco sem isso é lamento", () => {
    expect(O_QUE_NINGUEM_PEGA.length).toBeGreaterThan(0);
    for (const b of O_QUE_NINGUEM_PEGA) {
      expect(b.porQue.length, b.oQue).toBeGreaterThan(40);
      expect(b.oQueFariaPegar.length, b.oQue).toBeGreaterThan(20);
    }
  });

  test("toda sabotagem nomeia o motivo da diferença — nunca 'não sei'", () => {
    expect(SABOTAGENS.length).toBe(4);
    for (const s of SABOTAGENS) {
      expect(s.oMotivoDaDiferenca.length, `sabotagem ${s.n}`).toBeGreaterThan(40);
      expect(VERIFICACOES.map((v) => v.id)).toContain(s.deveriaPegar);
    }
  });

  /**
   * **Quem rodou um só encontra escrito que não está coberto.** É o critério de "deu certo" do
   * item 003, e sem isto o documento só é achado por quem já sabe que ele existe.
   */
  test("os DOIS instrumentos apontam para o documento na saída", () => {
    const caminho = "docs/referencia/FERRAMENTA_E_TRAVA.md";
    expect(ler(join(ESTEIRA, A_FERRAMENTA.arquivo))).toContain(caminho);
    expect(ler(join(RAIZ, "external-engines", "conferir.sh"))).toContain(caminho);
  });

  test("a ferramenta está FORA do verde, como a declaração diz", () => {
    const verde = ler(join(RAIZ, "external-engines", "conferir.sh"));
    expect(A_FERRAMENTA.noVerde).toBe(false);
    expect(verde).not.toContain(A_FERRAMENTA.arquivo);
  });
});
