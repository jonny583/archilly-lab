/**
 * AS TRAVAS DO ACESSO SUGERIDO — as cinco regras do Jonny. (LAB-77, item 010 + adendo)
 *
 * O adendo trouxe **regra urbanística ditada por ele**, e regra de urbanismo não é escolha da
 * sessão (§4). Então estas travas não julgam a regra: elas cobram que **o código faça o que ela
 * diz**, e que o número dela **não more dentro da lógica** — *tudo tem padrão de fábrica que o
 * usuário pode mudar; é como o sal na panela, a gosto*.
 *
 * A trava que mais importa é a do §"a esquina é das RUAS": ela demonstra, com um anel de
 * quatro faces e **uma** face de rua, que o vértice entre a face de rua e o muro do vizinho
 * **não** é esquina. Era aí que a minha primeira leitura do adendo ia errar.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { P } from "../src/motores/comum.ts";
import {
  aRegraEstaEscrita,
  caminhoDoItemDaCaixa,
  comoARegraSeLe,
  lerItemDaCaixa,
} from "../src/texto-das-regras.ts";
import {
  FAIXA_EM_USO_m,
  FAIXA_QUANDO_OCUPA_A_QUADRA_m,
  MOTIVOS_DE_RECUSA,
  PADRAO_DA_FAIXA_DE_ESQUINA_m,
  REGRAS_DO_ACESSO,
  REGUA_DA_FAIXA,
  avaliarPosicoes,
  contarAsDeclaracoes,
  dentroDaFaixaDeEsquina,
  esquinasDeVia,
  limiteDaFaixaDeEsquina,
  perimetroDoAnel,
  sugerirAcesso,
  type DeclaracaoDaGleba,
  type PosicaoAvaliada,
} from "../src/acesso-sugerido.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
// Pelo NÚMERO e não pelo nome: `010-adendo.md` vira `010-adendo-FEITO.md` quando o item
// fecha, e esta trava quebrou exatamente assim no fim da própria rodada (D252).
const ADENDO = lerItemDaCaixa(RAIZ, "010-adendo");
const FONTE = readFileSync(join(RAIZ, "external-engines", "esteira", "src", "acesso-sugerido.ts"), "utf8");

/** Um quadrado de 100 m, no sentido anti-horário. Faces: 0=sul, 1=leste, 2=norte, 3=oeste. */
const QUADRADO: P[] = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];


/**
 * ── O ESTADO DE UM ITEM É O NOME DO ARQUIVO, e dois nomes são ambiguidade (LAB-80) ──
 *
 * Medido no próprio prompt: renomeei `013.md` para `013-FEITO.md` no ramo, e o `git merge` da
 * `origin/main` — que ainda tinha o original — **ressuscitou o `013.md`**. Os dois no disco, e a
 * busca por número devolvia o primeiro: **o item concluído voltaria a ser lido como pendente**, em
 * silêncio. A função passou a RECUSAR, e estas travas cobram as duas pontas.
 */
describe("o item da caixa achado pelo NÚMERO — e o nome ambíguo recusado", () => {
  const caixa = join(RAIZ, "docs", "caixa-de-entrada");

  test("acha o item concluído pelo número, com o sufixo -FEITO", () => {
    expect(caminhoDoItemDaCaixa(RAIZ, "013")).toContain("013-FEITO.md");
    expect(caminhoDoItemDaCaixa(RAIZ, "012")).toContain("012-FEITO.md");
  });

  test("número que não existe estoura dizendo onde procurou", () => {
    expect(() => caminhoDoItemDaCaixa(RAIZ, "999")).toThrow(/999/);
  });

  test("os DOIS nomes ao mesmo tempo é ERRO, não preferência pelo primeiro", () => {
    const intruso = join(caixa, "013.md");
    expect(existsSync(intruso), "o `013.md` voltou ao disco — veja a mensagem desta trava").toBe(false);
    writeFileSync(intruso, "# sósia do 013, criado por esta trava\n");
    try {
      expect(() => caminhoDoItemDaCaixa(RAIZ, "013")).toThrow(/DUAS vezes/);
    } finally {
      rmSync(intruso);
    }
    // E depois de tirar o sósia, volta a achar o certo: a recusa não deixa resíduo.
    expect(caminhoDoItemDaCaixa(RAIZ, "013")).toContain("013-FEITO.md");
  });
});

describe("as cinco regras estão no adendo, e a trava confere contra o TEXTO dele", () => {
  test("são cinco, numeradas de 1 a 5", () => {
    expect(REGRAS_DO_ACESSO.length).toBe(5);
    expect(REGRAS_DO_ACESSO.map((r) => r.n)).toEqual([1, 2, 3, 4, 5]);
  });

  test("a marca de cada regra EXISTE no texto do adendo", () => {
    for (const r of REGRAS_DO_ACESSO) {
      expect(aRegraEstaEscrita(ADENDO, r.marcaNoAdendo), `a marca da regra ${r.n} não está no adendo`).toBe(true);
    }
  });

  test("a regra 5 está marcada como do VIZINHO — é tela, e a tela é do Generate", () => {
    const r5 = REGRAS_DO_ACESSO.find((r) => r.n === 5);
    expect(r5?.tipo).toBe("do-vizinho");
    expect(r5?.oQueDecide).toContain("Generate");
  });

  test("cada regra diz o que DECIDE, em frase e não em rótulo", () => {
    for (const r of REGRAS_DO_ACESSO) {
      expect(r.oQueDecide.split(" ").length).toBeGreaterThan(6);
    }
  });
});

describe("a faixa de esquina é PARÂMETRO, e o número não mora na lógica", () => {
  test("os dois padrões são 15 e 25, como ele ditou", () => {
    expect(PADRAO_DA_FAIXA_DE_ESQUINA_m).toBe(15);
    expect(FAIXA_QUANDO_OCUPA_A_QUADRA_m).toBe(25);
    // Lido pelo `comoARegraSeLe`: no adendo isto está como `**15\n> metros**` — quebra de
    // linha, marca de citação E negrito, os três no meio do número. Quarta vez desta forma,
    // e o conserto já existia num teste; agora mora em `src/` (D248).
    expect(aRegraEstaEscrita(ADENDO, "no mínimo uns 15 metros da esquina")).toBe(true);
    expect(aRegraEstaEscrita(ADENDO, "mínimo de 25 metros da esquina")).toBe(true);
  });

  test("o laboratório usa 15 e DIZ que usa — não adivinha a quadra inteira", () => {
    expect(FAIXA_EM_USO_m).toBe(PADRAO_DA_FAIXA_DE_ESQUINA_m);
  });

  /**
   * A trava de ESTRUTURA, e ela é a lição do item 006 aplicada aqui.
   *
   * Não basta escrever "o número não mora na lógica": tira-se o lugar onde ele moraria. Toda
   * função que depende da faixa **recebe `faixa_m` por parâmetro**, e nenhuma delas tem 15 ou 25
   * escrito no corpo. A régua casa o corpo das funções, não o arquivo inteiro — porque as
   * CONSTANTES declaradas no topo têm de poder dizer 15 e 25, e são elas o padrão de fábrica.
   */
  test("nenhuma função embute 15 nem 25 no corpo — o número entra por parâmetro", () => {
    const corpos = [...FONTE.matchAll(/^export function [\s\S]*?^}/gm)].map((m) => m[0]);
    expect(corpos.length).toBeGreaterThan(4);
    for (const corpo of corpos) {
      const semComentario = corpo.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      expect(semComentario).not.toMatch(/\b15\b/);
      expect(semComentario).not.toMatch(/\b25\b/);
    }
  });

  test("a régua da faixa está DECLARADA, porque qual delas vale é pendência do Jonny", () => {
    expect(REGUA_DA_FAIXA).toBe("linha-reta-ate-o-vertice");
    expect(aRegraEstaEscrita(ADENDO, "se a faixa de esquina se mede ao longo da divisa ou em linha reta")).toBe(true);
  });
});

describe("A ESQUINA É DAS RUAS, não do anel — o achado deste prompt", () => {
  test("vértice entre face de RUA e muro do vizinho NÃO é esquina", () => {
    // Só a face 0 (sul) dá para rua. Os vértices 0 e 1 encostam nela, mas do outro lado
    // de cada um está um muro — então nenhum dos dois é esquina de rua.
    expect(esquinasDeVia(QUADRADO, [0])).toEqual([]);
  });

  test("duas faces de rua VIZINHAS fazem UMA esquina, no vértice entre elas", () => {
    // Faces 0 (sul) e 1 (leste) dão para rua; elas se encontram no vértice 1.
    expect(esquinasDeVia(QUADRADO, [0, 1])).toEqual([1]);
  });

  test("duas faces de rua OPOSTAS não fazem esquina nenhuma", () => {
    expect(esquinasDeVia(QUADRADO, [0, 2])).toEqual([]);
  });

  test("gleba cercada de rua nos quatro lados tem as QUATRO esquinas", () => {
    expect(esquinasDeVia(QUADRADO, [0, 1, 2, 3])).toEqual([0, 1, 2, 3]);
  });

  test("faces NÃO DECLARADAS devolvem `null`, não lista vazia — não medido não é zero (D23)", () => {
    expect(esquinasDeVia(QUADRADO, null)).toBe(null);
    // E a diferença importa: lista vazia seria lida como "não há esquina".
    expect(esquinasDeVia(QUADRADO, [])).toEqual([]);
  });

  test("a faixa mede do vértice, e pega dentro e não pega fora", () => {
    const esquinas = esquinasDeVia(QUADRADO, [0, 1])!;
    expect(dentroDaFaixaDeEsquina({ x: 95, y: 0 }, QUADRADO, esquinas, 15)).toBe(true);
    expect(dentroDaFaixaDeEsquina({ x: 50, y: 0 }, QUADRADO, esquinas, 15)).toBe(false);
    // E o valor da faixa MUDA o veredito: é parâmetro, não constante escondida.
    expect(dentroDaFaixaDeEsquina({ x: 80, y: 0 }, QUADRADO, esquinas, 15)).toBe(false);
    expect(dentroDaFaixaDeEsquina({ x: 80, y: 0 }, QUADRADO, esquinas, 25)).toBe(true);
  });
});

describe("recusa é `null` COM O MOTIVO, nunca zero", () => {
  const pontos: P[] = [
    { x: 50, y: 0 },
    { x: 98, y: 0 },
  ];

  test("o motivo é vocabulário FECHADO", () => {
    for (const a of avaliarPosicoes(QUADRADO, pontos, [0, 1], 15)) {
      if (a.motivo !== null) expect(MOTIVOS_DE_RECUSA as readonly string[]).toContain(a.motivo);
    }
  });

  test("posição recusada sai com `lotes` NULO — zero afundaria a curva sem queda nenhuma", () => {
    for (const a of avaliarPosicoes(QUADRADO, pontos, [0, 1], 15)) {
      if (!a.valida) {
        expect(a.lotes).toBe(null);
        expect(a.motivo).not.toBe(null);
      }
    }
  });

  test("sem as faces declaradas, TODA posição é recusada com o motivo que nomeia a falta", () => {
    const as = avaliarPosicoes(QUADRADO, pontos, null, 15);
    expect(as.every((a) => !a.valida)).toBe(true);
    expect(as.every((a) => a.motivo === "nao-declarado-quais-faces-dao-para-via")).toBe(true);
  });

  test("REGRA 4 — a posição do usuário atravessa, mesmo dentro da faixa", () => {
    const naEsquina = { x: 98, y: 0 };
    const as = avaliarPosicoes(QUADRADO, [naEsquina], [0, 1], 15, [naEsquina]);
    expect(as[0]?.doUsuario).toBe(true);
    expect(as[0]?.valida).toBe(true);
    expect(as[0]?.motivo).toBe(null);
  });

  test("REGRA 4 — e ela atravessa até quando as faces não foram declaradas", () => {
    const dele = { x: 50, y: 0 };
    const as = avaliarPosicoes(QUADRADO, [dele], null, 15, [dele]);
    expect(as[0]?.valida).toBe(true);
    expect(as[0]?.motivo).toBe(null);
  });
});

describe("a SUGESTÃO — e hoje ela se recusa a sair", () => {
  const candidatas = (lotes: (number | null)[]): PosicaoAvaliada[] =>
    lotes.map((l, i) => ({
      ponto: { x: i * 10, y: 0 },
      valida: true,
      motivo: null,
      lotes: l,
      doUsuario: false,
    }));

  test("sem as faces declaradas, NÃO HÁ O QUE SUGERIR — e o motivo nomeia o impossível", () => {
    const s = sugerirAcesso(null, 100, candidatas([120]));
    expect(s.frase).toBe(null);
    expect(s.ganhoEmLotes).toBe(null);
    expect(s.porqueNao).toContain("divisa do vizinho");
  });

  test("a frase sai NO FORMATO DELE quando há ganho", () => {
    const s = sugerirAcesso([0, 1], 100, candidatas([112, 103]));
    expect(s.frase).toBe("se o acesso mudar para cá, você ganha 12 lotes");
    expect(s.ganhoEmLotes).toBe(12);
    expect(aRegraEstaEscrita(ADENDO, "se o acesso mudar para cá, você ganha")).toBe(true);
  });

  test("um lote é singular — a frase é para pessoa", () => {
    expect(sugerirAcesso([0, 1], 100, candidatas([101])).frase).toBe(
      "se o acesso mudar para cá, você ganha 1 lote",
    );
  });

  test("ganho zero ou negativo NÃO vira sugestão — mudança sem ganho é ruído", () => {
    expect(sugerirAcesso([0, 1], 100, candidatas([100])).frase).toBe(null);
    expect(sugerirAcesso([0, 1], 100, candidatas([90])).frase).toBe(null);
    expect(sugerirAcesso([0, 1], 100, candidatas([90])).porqueNao).toContain("não há ganho");
  });

  test("gleba sem acesso declarado não tem referência de ganho", () => {
    const s = sugerirAcesso([0, 1], null, candidatas([120]));
    expect(s.frase).toBe(null);
    expect(s.porqueNao).toContain("não declara acesso");
  });

  test("a posição do USUÁRIO nunca é sugerida de volta para ele", () => {
    const cs: PosicaoAvaliada[] = [
      { ponto: { x: 0, y: 0 }, valida: true, motivo: null, lotes: 200, doUsuario: true },
      { ponto: { x: 50, y: 0 }, valida: true, motivo: null, lotes: 110, doUsuario: false },
    ];
    const s = sugerirAcesso([0, 1], 100, cs);
    expect(s.ganhoEmLotes).toBe(10);
    expect(s.ponto).toEqual({ x: 50, y: 0 });
  });
});

describe("O LIMITE da faixa — um TETO e um PISO, porque o dado falta", () => {
  test("o piso é zero e o teto é medido, com o passo declarado", () => {
    const l = limiteDaFaixaDeEsquina(QUADRADO, 15, 1);
    expect(l.pisoPctDoPerimetro).toBe(0);
    expect(l.perimetro_m).toBe(400);
    expect(l.passo_m).toBe(1);
    expect(l.amostras).toBeGreaterThan(0);
    // Quatro vértices, faixa de 15 m: 8 trechos de 15 m em 400 m de perímetro = 30 %.
    expect(l.tetoPctDoPerimetro).toBeGreaterThan(25);
    expect(l.tetoPctDoPerimetro).toBeLessThan(35);
  });

  test("faixa maior tira mais — e o teto responde ao parâmetro", () => {
    const a = limiteDaFaixaDeEsquina(QUADRADO, 15, 1);
    const b = limiteDaFaixaDeEsquina(QUADRADO, 25, 1);
    expect(b.tetoPctDoPerimetro).toBeGreaterThan(a.tetoPctDoPerimetro);
  });

  test("a frase DIZ que é intervalo — número sozinho seria lido como medição exata", () => {
    const l = limiteDaFaixaDeEsquina(QUADRADO, 15, 1);
    expect(l.comoSeDiz).toContain("entre **0 %**");
    expect(l.comoSeDiz).toContain("encontro de duas RUAS");
  });

  test("anel degenerado ESTOURA — devolver zero seria publicar 'a regra não tira nada'", () => {
    expect(() => limiteDaFaixaDeEsquina([{ x: 0, y: 0 }], 15, 1)).toThrow(/menos de 3 pontos/);
    expect(() => limiteDaFaixaDeEsquina(QUADRADO, 15, 0)).toThrow(/passo não positivo/);
  });

  test("o perímetro do quadrado de 100 m é 400 m — a conta base confere", () => {
    expect(perimetroDoAnel(QUADRADO)).toBeCloseTo(400, 6);
  });
});

describe("O QUE AS GLEBAS DECLARAM — e a resposta é a FALTA", () => {
  /** As duas glebas que são fixture JSON: lidas sem clone vizinho. */
  const FIXTURES = [
    ["ensaio-47ha", join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo", "ensaio-47ha.entrada.json")],
    ["geo-antonina", join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo", "geo-antonina.entrada.json")],
  ] as const;

  test("as duas fixtures declaram UM acesso, e nenhuma diz o SEGMENTO", () => {
    for (const [nome, caminho] of FIXTURES) {
      const e = JSON.parse(readFileSync(caminho, "utf8")) as {
        acessos: { segmento: unknown }[];
      };
      expect(e.acessos.length).toBe(1);
      expect(e.acessos[0]?.segmento).toBe(null);
      expect(nome.length).toBeGreaterThan(0);
    }
  });

  test("NENHUMA fixture declara quais faces dão para via pública", () => {
    for (const [, caminho] of FIXTURES) {
      const e = JSON.parse(readFileSync(caminho, "utf8")) as Record<string, unknown>;
      // Não há campo para isso no contrato v1 — e é esse o achado.
      expect(Object.keys(e)).not.toContain("facesComVia");
      expect(Object.keys(e)).not.toContain("vias");
    }
  });

  test("a conta das declarações fecha, e a frase DIZ os números", () => {
    const ds: DeclaracaoDaGleba[] = [
      { gleba: "a", quantosAcessos: 1, algumAcessoDizOSegmento: false, facesComVia: null },
      { gleba: "b", quantosAcessos: 0, algumAcessoDizOSegmento: false, facesComVia: null },
      { gleba: "c", quantosAcessos: 0, algumAcessoDizOSegmento: false, facesComVia: null },
    ];
    const c = contarAsDeclaracoes(ds);
    expect(c.glebas).toBe(3);
    expect(c.comAlgumAcesso).toBe(1);
    expect(c.semAcessoNenhum).toBe(2);
    expect(c.comAlgumAcesso + c.semAcessoNenhum).toBe(c.glebas);
    expect(c.comFacesComVia).toBe(0);
    expect(c.comoSeDiz).toContain("3 glebas");
    expect(c.comoSeDiz).toContain("declaram NENHUM");
  });
});

/**
 * O NORMALIZADOR DAS REGRAS — e ele nasceu de a trava acima ter errado primeiro. (D248)
 *
 * A trava dos 15 m procurava o literal e **reprovou o adendo certo**: no arquivo a regra está
 * como `**15\n> metros**` — quebra de linha, marca de citação e negrito, os três dentro do
 * número. **Quarta vez desta forma nesta casa** (LAB-74 §5, LAB-75 §6, item 008, e esta), e o
 * conserto **já existia** — inline, dentro de `disparos-em-vazio.test.ts`, escrito no LAB-75.
 *
 * Agora mora em `src/`, e as duas travas o chamam. *Conserto que mora dentro de um teste
 * conserta um teste.*
 */
describe("o normalizador das regras — num lugar só (D248)", () => {
  test("tira a marca de citação que cai no MEIO da frase", () => {
    expect(comoARegraSeLe("uma lição que\n> continua aqui")).toBe("uma lição que continua aqui");
  });

  test("tira o negrito que cai dentro do número", () => {
    expect(comoARegraSeLe("no mínimo uns **15\n> metros** da esquina")).toBe(
      "no mínimo uns 15 metros da esquina",
    );
  });

  test("os três defeitos juntos, que é o caso real do adendo", () => {
    expect(aRegraEstaEscrita("que **mínimo de\n> 25 metros** da esquina", "mínimo de 25 metros")).toBe(true);
  });

  test("NÃO afrouxa o que não é espaço: acento e palavra continuam valendo", () => {
    expect(aRegraEstaEscrita("15 metros da esquina", "15 metro da esquina")).toBe(false);
    expect(aRegraEstaEscrita("faixa de esquina", "faixa de esquinas")).toBe(false);
  });

  test("normaliza os DOIS lados — quem procura também pode ter quebrado a linha", () => {
    expect(aRegraEstaEscrita("no mínimo uns **15\n> metros**", "no mínimo uns 15\nmetros")).toBe(true);
  });
});

/**
 * O ITEM DA CAIXA SE ACHA PELO NÚMERO, não pelo nome. (D252)
 *
 * Esta trava existe porque a de cima quebrou. Ela lia `010-adendo.md`; eu marquei o item como
 * feito no fim da rodada, o arquivo virou `010-adendo-FEITO.md`, e **o arquivo de teste passou a
 * estourar ao carregar** — o verde caiu com `765 pass · 1 fail`, e o `fail` não era um teste:
 * era o arquivo inteiro não abrindo.
 *
 * > **Trava que cita um item pelo NOME do arquivo tem um prazo: o dia em que o item é
 * > concluído.**
 */
describe("o item da caixa se acha pelo NÚMERO (D252)", () => {
  test("acha o item 010, que hoje está renomeado para FEITO", () => {
    const c = caminhoDoItemDaCaixa(RAIZ, "010-adendo");
    expect(c.endsWith("010-adendo-FEITO.md") || c.endsWith("010-adendo.md")).toBe(true);
    expect(lerItemDaCaixa(RAIZ, "010-adendo").length).toBeGreaterThan(100);
  });

  test("acha tanto o pendente quanto o concluído — a renomeação não derruba a trava", () => {
    // O `010` e o `010-adendo` já fecharam; o `COMO_FUNCIONA` nunca é renomeado. Os três têm de
    // ser achados pela mesma função, sem a trava saber em que estado o item está.
    expect(() => lerItemDaCaixa(RAIZ, "010")).not.toThrow();
    expect(() => lerItemDaCaixa(RAIZ, "009")).not.toThrow();
  });

  test("item que não existe ESTOURA com o que foi procurado — não devolve vazio", () => {
    expect(() => lerItemDaCaixa(RAIZ, "999")).toThrow(/não foi encontrado/);
    // E a mensagem diz os DOIS caminhos tentados, para quem conserta não ter de adivinhar.
    expect(() => lerItemDaCaixa(RAIZ, "999")).toThrow(/999\.md e .*999-FEITO\.md/);
  });
});
