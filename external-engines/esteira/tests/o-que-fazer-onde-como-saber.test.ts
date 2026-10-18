/**
 * **LAB-165 (item 900) · a pergunta que é dele vai com "o que fazer / onde / como saber que deu certo"** (D393).
 *
 * ```sh
 * bun test tests/o-que-fazer-onde-como-saber.test.ts
 * ```
 *
 * O protocolo da caixa (`COMO_FUNCIONA.md`, *"A RESPOSTA INTEIRA VAI PARA O ARQUIVO"*) lista três coisas que costumam
 * ficar só na tela. A segunda ganhou trava no LAB-164; a terceira — *"A pergunta que é dele. Vai para
 * `docs/PENDENCIAS_JONNY.md`, em português de leigo, com o que fazer / onde / como saber que deu certo"* — não tinha
 * nenhuma, e das quatro pendências que pedem alguma coisa a ele nenhuma dizia *como saber que deu certo*. Esta trava lê
 * a página de verdade e a régua dos dois lados. Roda **sem clones** (só lê arquivo deste repositório), e por isso está
 * no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  CABECA_DO_BLOCO,
  CONTEUDO_MINIMO,
  NAO_PEDEM,
  PARTES,
  conferirOQueFazerOndeComoSaber,
  lerOBloco,
  lerOsCorpos,
} from "../src/o-que-fazer-onde-como-saber.ts";
import { PENDENCIAS, type DeclaracaoDePendencia } from "../src/pendencias-marcadas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PAGINA = readFileSync(join(RAIZ, "docs", "PENDENCIAS_JONNY.md"), "utf8");
const PROTOCOLO = readFileSync(join(RAIZ, "docs", "caixa-de-entrada", "COMO_FUNCIONA.md"), "utf8");

const tipos = (pagina: string, pendencias?: readonly DeclaracaoDePendencia[], naoPedem = NAO_PEDEM): string[] =>
  conferirOQueFazerOndeComoSaber(pagina, pendencias ?? PENDENCIAS, naoPedem).problemas.map((p) => `${p.tipo}:${p.onde}`);

/** Troca exatamente uma ocorrência — mutação que não acha o alvo é mutação que não testa nada. */
function trocar(texto: string, de: string, para: string): string {
  const n = texto.split(de).length - 1;
  if (n !== 1) throw new Error(`a mutação esperava 1 ocorrência de ${JSON.stringify(de.slice(0, 60))}, achou ${n}`);
  return texto.replace(de, para);
}

/** A linha de uma parte dentro do bloco de uma pendência da página de hoje. */
function linhaDaParte(numero: string, rotulo: string): string {
  const c = lerOsCorpos(PAGINA).find((x) => x.numero === numero)!;
  const l = c.corpo.find((x) => x.startsWith(rotulo));
  if (!l) throw new Error(`a §${numero} de hoje não tem ${rotulo}`);
  return l;
}

const BLOCO_BOM = [
  CABECA_DO_BLOCO,
  "> - **o que fazer:** responder sim ou não à pergunta acima, numa frase.",
  "> - **onde:** na conversa com o chat, sem abrir nada aqui.",
  "> - **como saber que deu certo:** o título desta seção passa a dizer que você respondeu.",
].join("\n");

describe("LAB-165 · a regra está escrita onde mora", () => {
  test("o protocolo da caixa diz as três partes, e a nota aponta para a régua", () => {
    expect(PROTOCOLO).toContain(A_REGRA);
    expect(PROTOCOLO).toContain("o-que-fazer-onde-como-saber.ts");
  });

  test("as três partes, na ordem do protocolo", () => {
    expect(PARTES.map((p) => p.parte)).toEqual(["o-que-fazer", "onde", "como-saber"]);
  });
});

describe("LAB-165 · a página de verdade — toda pendência que pede tem as três partes", () => {
  const r = conferirOQueFazerOndeComoSaber(PAGINA);

  test("o universo: 19 pendências lidas, as que pedem são as abertas e as paradas de PENDENCIAS, e não zero", () => {
    const pedemNaDeclaracao = PENDENCIAS.filter((p) => p.estado === "aberta" || p.estado === "parada").length;
    console.log(`    ${r.pendencias} pendências · ${r.pedem} pedem · ${r.comBloco} com o bloco · ${r.porExcecao} por exceção · ${r.problemas.length} problemas`);
    expect(r.pendencias).toBe(PENDENCIAS.length);
    expect(r.pedem).toBe(pedemNaDeclaracao);
    expect(r.pedem).toBe(5);
    expect(r.comBloco + r.porExcecao).toBe(r.pedem);
  });

  test("nenhum problema — e a lista diz QUAIS, se houver", () => {
    expect(r.problemas).toEqual([]);
  });

  test("as quatro que pediam e não diziam 'como saber' — 5-B, 7, 10 e 11 — têm o bloco inteiro", () => {
    for (const n of ["5-B", "7", "10", "11"]) {
      const b = lerOBloco(lerOsCorpos(PAGINA).find((c) => c.numero === n)!.corpo);
      expect(b, n).not.toBeNull();
      for (const p of PARTES) expect(b!.partes[p.parte], `${n}:${p.parte}`).toHaveLength(1);
    }
  });

  test("a §11 diz onde, com os dois endereços, e como saber, pelo nome que ele vai ver", () => {
    expect(linhaDaParte("11", "> - **onde:**")).toContain("https://github.com/jonny583/archilly-lab/settings/secrets/actions");
    expect(linhaDaParte("11", "> - **como saber que deu certo:**")).toContain("VIZINHOS_TOKEN");
  });

  test("a exceção (a §8) se confere: o trecho está no corpo, e ela está aberta", () => {
    for (const e of NAO_PEDEM) {
      expect(e.motivo.length).toBeGreaterThan(30);
      expect(lerOsCorpos(PAGINA).find((c) => c.numero === e.numero)!.corpo.join("\n")).toContain(e.trecho);
      expect(PENDENCIAS.find((p) => p.numero === e.numero)!.estado).toBe("aberta");
    }
  });
});

describe("LAB-165 · a régua reprova — mutações na página de hoje, uma por problema", () => {
  test("sem o bloco na §7 → sem-bloco", () => {
    const c = lerOsCorpos(PAGINA).find((x) => x.numero === "7")!;
    const ini = c.corpo.indexOf(CABECA_DO_BLOCO);
    let fim = ini;
    while (c.corpo[fim + 1]?.startsWith(">")) fim++;
    const bloco = c.corpo.slice(ini, fim + 1).join("\n");
    expect(tipos(trocar(PAGINA, bloco, ""))).toEqual(["sem-bloco:7"]);
  });

  test("sem cada parte, uma de cada vez, na §11 → falta-<parte>", () => {
    for (const p of PARTES) {
      expect(tipos(trocar(PAGINA, `${linhaDaParte("11", p.rotulo)}\n`, ""))).toEqual([`falta-${p.parte}:11`]);
    }
  });

  test("a parte com o rótulo e sem conteúdo (o traço, ou poucas letras) → falta-<parte>", () => {
    expect(tipos(trocar(PAGINA, linhaDaParte("7", "> - **onde:**"), "> - **onde:** —"))).toEqual(["falta-onde:7"]);
    expect(tipos(trocar(PAGINA, linhaDaParte("7", "> - **onde:**"), "> - **onde:** no chat."))).toEqual(["falta-onde:7"]);
    expect("no chat.".length).toBeLessThan(CONTEUDO_MINIMO);
    // o enchimento: comprido bastante, e sem uma letra — traço, ponto e espaço não são conteúdo
    const enchimento = "— — — — . . . . — — — — . . . .";
    expect(enchimento.length).toBeGreaterThanOrEqual(CONTEUDO_MINIMO);
    expect(tipos(trocar(PAGINA, linhaDaParte("7", "> - **onde:**"), `> - **onde:** ${enchimento}`))).toEqual(["falta-onde:7"]);
  });

  test("a parte repetida, e a cabeça repetida → parte-repetida", () => {
    const l = linhaDaParte("5-B", "> - **o que fazer:**");
    expect(tipos(trocar(PAGINA, l, `${l}\n${l}`))).toEqual(["parte-repetida:5-B:o-que-fazer"]);
    // a seção que vem depois da 5-B na página é a 5-A (a ordem da página não é a dos números)
    expect(tipos(trocar(PAGINA, "## 5-A · ", `${BLOCO_BOM}\n\n## 5-A · `))).toEqual(["parte-repetida:5-B:cabeça", "parte-repetida:5-B:o-que-fazer", "parte-repetida:5-B:onde", "parte-repetida:5-B:como-saber"]);
  });

  test("a parte FORA do bloco (separada por linha em branco) não conta → falta-<parte>", () => {
    const l = linhaDaParte("11", "> - **como saber que deu certo:**");
    expect(tipos(trocar(PAGINA, l, `\n${l}`))).toEqual(["falta-como-saber:11"]);
  });

  test("o sentido de volta: o bloco numa resolvida (§3) e num aviso (§2) → bloco-em-quem-nao-pede", () => {
    expect(tipos(trocar(PAGINA, "## 4 · ", `${BLOCO_BOM}\n\n## 4 · `))).toEqual(["bloco-em-quem-nao-pede:3"]);
    expect(tipos(trocar(PAGINA, "## 3 · ", `${BLOCO_BOM}\n\n## 3 · `))).toEqual(["bloco-em-quem-nao-pede:2"]);
  });

  test("a exceção sem o trecho, e a exceção que ganhou bloco → excecao-sem-trecho, excecao-com-bloco", () => {
    expect(tipos(trocar(PAGINA, "Isto não é pergunta e não trava nada", "Isto trava"))).toEqual(["excecao-sem-trecho:8"]);
    expect(tipos(trocar(PAGINA, "## 7 · ", `${BLOCO_BOM}\n\n## 7 · `))).toEqual(["excecao-com-bloco:8"]);
  });

  test("a exceção que sobra — pendência resolvida, ou que não existe → excecao-desconhecida", () => {
    const sobra = [...NAO_PEDEM, { numero: "3", trecho: "x", motivo: "uma exceção de uma pendência já respondida" }];
    expect(tipos(PAGINA, PENDENCIAS, sobra)).toEqual(["excecao-desconhecida:3"]);
    const inventada = [...NAO_PEDEM, { numero: "99", trecho: "x", motivo: "uma exceção de uma pendência que não existe" }];
    expect(tipos(PAGINA, PENDENCIAS, inventada)).toEqual(["excecao-desconhecida:99"]);
  });

  test("a pendência que passa a pedir (a §12 reaberta na declaração) sem bloco → sem-bloco", () => {
    const reaberta = PENDENCIAS.map((p) => (p.numero === "12" ? { ...p, estado: "aberta" as const } : p));
    expect(tipos(PAGINA, reaberta)).toEqual(["sem-bloco:12"]);
  });

  test("o bloco no resumo do alto, fora de pendência → bloco-solto", () => {
    const r = tipos(trocar(PAGINA, "## Em cinco minutos\n", `## Em cinco minutos\n\n${BLOCO_BOM}\n`));
    expect(r).toHaveLength(1);
    expect(r[0]).toMatch(/^bloco-solto:linha \d+$/);
  });

  test("página sem pendência numerada → universo-vazio, e não verde", () => {
    expect(tipos("# Pendências\n\nNada.\n")).toEqual(["universo-vazio:docs/PENDENCIAS_JONNY.md"]);
    expect(tipos("")).toEqual(["universo-vazio:docs/PENDENCIAS_JONNY.md"]);
  });
});

describe("LAB-165 · a régua aprova — o caso válido que quase parece inválido", () => {
  const casa = (corpo: string) =>
    conferirOQueFazerOndeComoSaber(`# P\n\n## 1 · Uma pergunta\n\n${corpo}\n`, [
      { numero: "1", chave: "Uma pergunta", estado: "aberta", fonte: "teste", dono: "urbanismo-ou-negocio" },
    ], []).problemas.map((p) => p.tipo);

  test("o bloco dentro de um ### sem número da pendência (como o 'O que eu preciso de você' da §11) conta", () => {
    expect(casa(`Texto.\n\n### O que eu preciso de você\n\n${BLOCO_BOM}\n`)).toEqual([]);
  });

  test("uma linha a mais no bloco (a nota de que está parada) e um endereço dentro da parte não atrapalham", () => {
    const comNota = BLOCO_BOM.replace(CABECA_DO_BLOCO, `${CABECA_DO_BLOCO}\n> *Está parada a seu pedido.*`).replace(
      "na conversa com o chat",
      "em <https://github.com/settings/personal-access-tokens/new>",
    );
    expect(casa(comNota)).toEqual([]);
  });

  test("o corpo de uma pendência para no título numerado de baixo: o bloco da 1-A (resolvida) não é o da 1", () => {
    const pagina = `# P\n\n## 1 · Uma pergunta\n\nTexto.\n\n### 1-A · ~~Uma parte já respondida~~\n\n${BLOCO_BOM}\n`;
    const r = conferirOQueFazerOndeComoSaber(pagina, [
      { numero: "1", chave: "Uma pergunta", estado: "aberta", fonte: "teste", dono: "urbanismo-ou-negocio" },
      { numero: "1-A", chave: "Uma parte", estado: "resolvida", fonte: "teste", dono: "urbanismo-ou-negocio" },
    ], []).problemas.map((p) => `${p.tipo}:${p.onde}`);
    expect(r).toEqual(["sem-bloco:1", "bloco-em-quem-nao-pede:1-A"]);
  });

  test("e o inválido que quase parece válido: as três palavras na prosa, sem o bloco, NÃO contam", () => {
    expect(casa("O que fazer: responder. Onde: no chat. Como saber que deu certo: o título muda.")).toEqual(["sem-bloco"]);
  });
});
