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
  MOTIVOS_RESERVADOS,
  PADRAO_DA_FAIXA_DE_ESQUINA_m,
  REGRAS_DO_ACESSO,
  REGUA_DA_FAIXA,
  avaliarPosicoes,
  contarAsDeclaracoes,
  dentroDaFaixaDeEsquina,
  dentroDaFaixaEmLinhaReta,
  esquinasDeVia,
  limiteDaFaixaDeEsquina,
  perimetroDoAnel,
  sobreFaceComVia,
  sugerirAcesso,
  type DeclaracaoDaGleba,
  type PosicaoAvaliada,
} from "../src/acesso-sugerido.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
// Pelo NÚMERO e não pelo nome: `010-adendo.md` vira `010-adendo-FEITO.md` quando o item
// fecha, e esta trava quebrou exatamente assim no fim da própria rodada (D252).
const ADENDO = lerItemDaCaixa(RAIZ, "010-adendo");
// O item 029 traz as respostas dele ao 9-A e ao 9-B; achado pelo NÚMERO, como o adendo (D252).
const ITEM_029 = lerItemDaCaixa(RAIZ, "029");
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

  test("a régua da faixa é a DELE desde o item 029: ao longo de cada rua, a partir do encontro", () => {
    expect(REGUA_DA_FAIXA).toBe("ao-longo-da-divisa-a-partir-do-encontro-das-ruas");
    // A pergunta que o adendo deixou aberta…
    expect(aRegraEstaEscrita(ADENDO, "se a faixa de esquina se mede ao longo da divisa ou em linha reta")).toBe(true);
    // …e a resposta, no texto do item que a trouxe.
    expect(
      aRegraEstaEscrita(ITEM_029, "os 15 m se medem a partir do encontro das duas ruas, ao longo de cada uma"),
    ).toBe(true);
  });

  test("e 'quadra' é TRECHO DE RUA — a regra 3 diz isso, e o item 029 é de onde veio", () => {
    expect(aRegraEstaEscrita(ITEM_029, "trecho de rua entre dois cruzamentos")).toBe(true);
    const r3 = REGRAS_DO_ACESSO.find((r) => r.n === 3);
    expect(r3?.oQueDecide).toContain("TRECHO DE RUA");
    expect(r3?.oQueDecide).toContain("ao longo de cada uma");
  });
});

/**
 * A REGUA DO 9-B — andar pela divisa NÃO é a linha reta, e a diferença se demonstra. (item 029)
 *
 * Gleba estreita de 100 × 10 m, rua no sul (face 0) e no leste (face 1): a esquina é o vértice 1,
 * em (100, 0). O ponto (92, 10) está na divisa do NORTE, do outro lado do terreno.
 *
 * - em linha reta ele fica a √(8² + 10²) = 12,8 m da esquina — a reta o RECUSAVA;
 * - andando pela divisa são 10 m subindo o leste e mais 8 m pelo norte = 18 m — a régua dele o
 *   DEIXA. A reta cortava por dentro do terreno, que é exatamente o que ele não mede.
 */
describe("a régua do 9-B: ao longo da divisa, e a reta corta por dentro (item 029)", () => {
  const ESTREITA: P[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 10 },
    { x: 0, y: 10 },
  ];
  const esquinas = esquinasDeVia(ESTREITA, [0, 1])!;

  test("o caso que DIFERE: a reta recusa, a régua dele deixa", () => {
    expect(esquinas).toEqual([1]);
    const doOutroLado = { x: 92, y: 10 };
    expect(dentroDaFaixaEmLinhaReta(doOutroLado, ESTREITA, esquinas, 15)).toBe(true);
    expect(dentroDaFaixaDeEsquina(doOutroLado, ESTREITA, esquinas, 15)).toBe(false);
  });

  test("e o outro sentido: andando, ainda DENTRO dos 15 m, é recusado pelas duas", () => {
    // 10 m subindo o leste + 4 m pelo norte = 14 m.
    const perto = { x: 96, y: 10 };
    expect(dentroDaFaixaDeEsquina(perto, ESTREITA, esquinas, 15)).toBe(true);
    expect(dentroDaFaixaEmLinhaReta(perto, ESTREITA, esquinas, 15)).toBe(true);
  });

  test("a medida é ao longo de CADA uma das duas ruas, nos dois sentidos do encontro", () => {
    // Pela rua do sul: 14 m dentro, 16 m fora.
    expect(dentroDaFaixaDeEsquina({ x: 86, y: 0 }, ESTREITA, esquinas, 15)).toBe(true);
    expect(dentroDaFaixaDeEsquina({ x: 84, y: 0 }, ESTREITA, esquinas, 15)).toBe(false);
    // Pela rua do leste: ela só tem 10 m; o ponto a 5 m dela está dentro.
    expect(dentroDaFaixaDeEsquina({ x: 100, y: 5 }, ESTREITA, esquinas, 15)).toBe(true);
  });

  test("na divisa reta as duas réguas CONCORDAM — a troca não mexe onde não havia o que mexer", () => {
    for (const x of [50, 80, 84, 85, 86, 95, 99]) {
      const p = { x, y: 0 };
      expect(dentroDaFaixaDeEsquina(p, QUADRADO, [1], 15)).toBe(dentroDaFaixaEmLinhaReta(p, QUADRADO, [1], 15));
    }
  });

  test("ponto a milímetros da divisa é projetado nela, e não muda de veredito", () => {
    expect(dentroDaFaixaDeEsquina({ x: 92, y: 10.001 }, ESTREITA, esquinas, 15)).toBe(false);
    expect(dentroDaFaixaDeEsquina({ x: 96, y: 9.999 }, ESTREITA, esquinas, 15)).toBe(true);
  });

  test("sem esquina nenhuma, nada está na faixa — e a régua não inventa uma", () => {
    expect(dentroDaFaixaDeEsquina({ x: 100, y: 0 }, ESTREITA, [], 15)).toBe(false);
  });

  /**
   * O teto do LIMITE. A reta nunca dá MENOS que a régua dele (a reta é sempre ≤ o arco), e numa
   * divisa recortada dá MAIS: uma fenda de 10 m de largura com um vértice no meio de uma parede
   * põe a parede da frente a 14 m em linha reta e a 80 m andando.
   */
  test("o teto do LIMITE mede com a régua dele: nunca acima da reta, e abaixo dela na fenda", () => {
    const FENDA: P[] = [
      { x: 0, y: 0 },
      { x: 200, y: 0 },
      { x: 200, y: 100 },
      { x: 105, y: 100 },
      { x: 105, y: 20 },
      { x: 95, y: 20 },
      { x: 95, y: 60 }, // vértice no meio da parede oeste da fenda
      { x: 95, y: 100 },
      { x: 0, y: 100 },
    ];
    // A parede da frente, em (105, 50): 14,1 m da quina (95, 60) pela reta, 80 m andando.
    expect(dentroDaFaixaEmLinhaReta({ x: 105, y: 50 }, FENDA, [6], 15)).toBe(true);
    expect(dentroDaFaixaDeEsquina({ x: 105, y: 50 }, FENDA, [6], 15)).toBe(false);

    for (const anel of [QUADRADO, ESTREITA, FENDA]) {
      const dele = limiteDaFaixaDeEsquina(anel, 15, 1);
      const reta = limiteDaFaixaDeEsquina(anel, 15, 1, dentroDaFaixaEmLinhaReta);
      expect(dele.tetoPctDoPerimetro).toBeLessThanOrEqual(reta.tetoPctDoPerimetro);
    }
    const dele = limiteDaFaixaDeEsquina(FENDA, 15, 1);
    const reta = limiteDaFaixaDeEsquina(FENDA, 15, 1, dentroDaFaixaEmLinhaReta);
    expect(dele.tetoPctDoPerimetro).toBeLessThan(reta.tetoPctDoPerimetro);
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

/**
 * ── A REGRA 2 GANHOU GUARDA (LAB-97, item 900) ──
 *
 * Até aqui o motivo `"sem-via-publica"` existia no vocabulário e nenhuma função o produzia: com as
 * faces DECLARADAS, uma posição sobre o muro do vizinho passava como válida — a sugestão
 * *plausível e impossível* que o adendo proíbe, a um dado de distância de sair. Estas travas
 * demonstram os dois lados (aprova o caso bom, reprova o ruim) e a do vocabulário cobra que
 * nenhuma palavra volte a ficar sem quem a produza sem estar declarada.
 */
describe("REGRA 2 — posição sem rua não é posição, e agora o código recusa (LAB-97)", () => {
  // Só o sul (0) e o leste (1) dão para rua; norte (2) e oeste (3) são muro de vizinho.
  const RUAS = [0, 1];

  test("o caso RUIM: posição no muro do vizinho é recusada com o motivo da regra 2", () => {
    const noMuro = { x: 50, y: 100 };
    const [a] = avaliarPosicoes(QUADRADO, [noMuro], RUAS, 15);
    expect(a?.valida).toBe(false);
    expect(a?.motivo).toBe("sem-via-publica");
    expect(a?.lotes).toBe(null);
  });

  test("o caso BOM: posição na rua, longe da esquina, continua válida", () => {
    const [a] = avaliarPosicoes(QUADRADO, [{ x: 50, y: 0 }], RUAS, 15);
    expect(a?.valida).toBe(true);
    expect(a?.motivo).toBe(null);
  });

  test("a regra 2 vem ANTES da 3: no muro perto da esquina, o motivo é o muro", () => {
    // (100, 105) não existe no anel; (95, 100) fica no muro norte a 5 m do vértice 2, que NÃO é
    // esquina (norte é muro). E (0, 5) fica no muro oeste a 5 m do vértice 0, que também não é.
    for (const p of [{ x: 95, y: 100 }, { x: 0, y: 5 }]) {
      expect(avaliarPosicoes(QUADRADO, [p], RUAS, 15)[0]?.motivo).toBe("sem-via-publica");
    }
  });

  test("ponto a milímetros da divisa é projetado nela: o muro continua muro, a rua continua rua", () => {
    expect(sobreFaceComVia({ x: 50, y: 99.999 }, QUADRADO, RUAS)).toBe(false);
    expect(sobreFaceComVia({ x: 50, y: 0.001 }, QUADRADO, RUAS)).toBe(true);
  });

  test("o VÉRTICE entre rua e muro é o fim da testada de rua — e conta como rua (escolha escrita)", () => {
    // Vértice 0: entre o oeste (muro) e o sul (rua). Vértice 3: entre o norte e o oeste, dois muros.
    expect(sobreFaceComVia({ x: 0, y: 0 }, QUADRADO, RUAS)).toBe(true);
    expect(sobreFaceComVia({ x: 0, y: 100 }, QUADRADO, RUAS)).toBe(false);
  });

  test("faces declaradas VAZIAS ('nenhuma rua') recusam tudo pela regra 2 — e não pela falta de dado", () => {
    const as = avaliarPosicoes(QUADRADO, [{ x: 50, y: 0 }, { x: 100, y: 50 }], [], 15);
    expect(as.every((a) => a.motivo === "sem-via-publica")).toBe(true);
  });

  test("REGRA 4 — a escolha do usuário atravessa até no muro do vizinho", () => {
    const dele = { x: 50, y: 100 };
    const [a] = avaliarPosicoes(QUADRADO, [dele], RUAS, 15, [dele]);
    expect(a?.valida).toBe(true);
    expect(a?.doUsuario).toBe(true);
  });

  test("e a SUGESTÃO nunca aponta para o muro, por mais lotes que ele renda", () => {
    const avaliadas = avaliarPosicoes(QUADRADO, [{ x: 50, y: 100 }, { x: 50, y: 0 }], RUAS, 15).map(
      (a, i): PosicaoAvaliada => ({ ...a, lotes: a.valida ? [999, 10][i]! : null }),
    );
    const s = sugerirAcesso(RUAS, 5, avaliadas);
    expect(s.ponto).toEqual({ x: 50, y: 0 });
    expect(s.ganhoEmLotes).toBe(5);
  });
});

describe("o VOCABULÁRIO de recusa não tem palavra órfã — nos dois sentidos (LAB-97)", () => {
  // O corpo do módulo SEM a declaração do vocabulário e sem a lista dos reservados: é onde um
  // motivo PRODUZIDO aparece. Procura-se o literal ao lado de `motivo:`, a forma em que a função
  // o devolve — o nome dentro de comentário não produz nada.
  const corpo = FONTE.replace(/export const MOTIVOS_DE_RECUSA[\s\S]*?\] as const;/, "")
    .replace(/export const MOTIVOS_RESERVADOS[\s\S]*?\];\n/, "");
  const produz = (m: string): boolean => new RegExp(`motivo:\\s*"${m}"`).test(corpo);
  const reservados = new Set(MOTIVOS_RESERVADOS.map((r) => r.motivo));

  test("o recorte achou os dois blocos — senão a trava leria a própria declaração como produção", () => {
    expect(corpo.length).toBeLessThan(FONTE.length);
    expect(corpo).not.toContain("export const MOTIVOS_DE_RECUSA");
    expect(corpo).not.toContain("export const MOTIVOS_RESERVADOS");
  });

  test("todo motivo NÃO reservado tem quem o produza", () => {
    const orfaos = MOTIVOS_DE_RECUSA.filter((m) => !reservados.has(m) && !produz(m));
    expect(orfaos).toEqual([]);
  });

  test("todo motivo RESERVADO não tem — senão a lista mente que ele está parado", () => {
    const vivos = [...reservados].filter(produz);
    expect(vivos).toEqual([]);
  });

  test("cada reservado diz POR QUÊ, e está no vocabulário", () => {
    for (const r of MOTIVOS_RESERVADOS) {
      expect(MOTIVOS_DE_RECUSA as readonly string[]).toContain(r.motivo);
      expect(r.porque.length).toBeGreaterThan(40);
    }
  });

  test("a trava tem DENTES: tirada a produção da regra 2, ela acusa o órfão", () => {
    const sabotado = corpo.replace(/motivo:\s*"sem-via-publica"/g, 'motivo: "x"');
    const orfaos = MOTIVOS_DE_RECUSA.filter(
      (m) => !reservados.has(m) && !new RegExp(`motivo:\\s*"${m}"`).test(sabotado),
    );
    expect(orfaos).toEqual(["sem-via-publica"]);
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
