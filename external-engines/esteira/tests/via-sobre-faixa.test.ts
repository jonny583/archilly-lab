/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-55 · As travas do mecanismo da via sobre a faixa reservada.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **A trava que importa é a ASSIMETRIA**, porque é ela que é a resposta:
 *
 * > `sobreposicao` = **0** (o LOTE respeitou a faixa) ao lado de `via-sobre-lote` = **11**
 * > (a VIA não respeitou). A faixa é buraco no domínio do lote e não é buraco no domínio
 * > da via.
 *
 * Se algum dia o motor passar a recortar a rede viária por `util`, estas travas ficam
 * vermelhas — e é o sinal certo: a explicação do LAB-55 deixou de valer porque o defeito
 * foi consertado.
 *
 * **E as duas explicações MORTAS do LAB-50 têm trava própria.** Hipótese descartada em
 * silêncio volta como hipótese nova no prompt seguinte (D174), e já voltou uma vez.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA_55 = join(RAIZ, "docs", "provas", "LAB-55", "via-sobre-a-faixa.json");
const PROVA_50 = join(RAIZ, "docs", "provas", "LAB-50", "passagem-externa.json");

interface Culpada {
  gleba: string;
  via: string;
  hierarquia: string | null;
  comprimento_m: number;
  pontaA_aoPerimetro_m: number;
  pontaB_aoPerimetro_m: number;
  pontaA_dentroDeLoteExterno: boolean;
  pontaB_dentroDeLoteExterno: boolean;
  aparadaPelaDivisa: boolean;
  fracaoDoEixoDentroDaFaixa: number;
  atravessaEContinua: boolean;
  distanciaDoAcesso_m: number | null;
  lotesQueEleInvade: string[];
}
interface Prova55 {
  glebas: {
    gleba: string;
    convexa: boolean;
    vias: number;
    viasQueEntramNaFaixa: number;
    viaSobreLote: number;
    lotesExternos: number;
    sobreposicao_LAB53: number | null;
    sobreposicao_porque: string;
    bulbosDeRetornoNaSaida: number;
    oRecorteDeViaPorUtilRodou: string;
  }[];
  viasCulpadas: Culpada[];
}

const prova = (): Prova55 => {
  expect(existsSync(PROVA_55), "rode `bun run lab55`").toBe(true);
  return JSON.parse(readFileSync(PROVA_55, "utf8")) as Prova55;
};

describe("LAB-55 · a ASSIMETRIA é a resposta", () => {
  test("o LOTE respeitou a faixa — `sobreposicao` é ZERO em geo-antonina", () => {
    // É o que MATA a candidata do corte degenerado: se `restante` tivesse ficado
    // inteiro, quadra e lote teriam nascido sobre a faixa e haveria sobreposição
    // entre interno e externo. Zero diz que o `util` excluiu a faixa, para o lote.
    const g = prova().glebas.find((x) => x.gleba === "geo-antonina")!;
    expect(
      g.sobreposicao_LAB53,
      "deixou de ser zero: o corte degenerado voltou a ser candidata, e a explicação do LAB-55 mudou",
    ).toBe(0);
    expect(g.sobreposicao_porque).toContain("LAB-53");
  });

  test("e a VIA não respeitou — `via-sobre-lote` é maior que zero nas duas glebas", () => {
    for (const g of prova().glebas) {
      expect(g.viaSobreLote, `${g.gleba}: sem violação não há o que explicar`).toBeGreaterThan(0);
      expect(g.lotesExternos).toBeGreaterThan(0);
    }
  });

  test("o controle CONVEXO também tem — a concavidade segue irrelevante (D174)", () => {
    const c = prova().glebas.find((x) => x.convexa);
    expect(c, "o controle convexo saiu da medição, e sem ele tudo vale para uma gleba só").toBeDefined();
    expect(
      c!.viaSobreLote,
      "o controle convexo zerou: a explicação da concavidade voltaria a ser candidata",
    ).toBeGreaterThan(0);
  });
});

describe("LAB-55 · a assinatura do aparo pela DIVISA", () => {
  test("toda via culpada tem as DUAS pontas sobre o perímetro", () => {
    // É a medida que separa "aparada pela divisa" de "recortada pelo útil": se
    // `util` a tivesse recortado, ela pararia na borda INTERNA da faixa, longe
    // do perímetro.
    const cs = prova().viasCulpadas;
    expect(cs.length, "nenhuma via culpada: a prova está vazia").toBeGreaterThan(0);
    for (const c of cs) {
      expect(c.aparadaPelaDivisa, `${c.gleba}/${c.via}: não termina na divisa`).toBe(true);
      expect(c.pontaA_aoPerimetro_m, `${c.gleba}/${c.via}: ponta A longe do perímetro`).toBeLessThanOrEqual(1);
      expect(c.pontaB_aoPerimetro_m, `${c.gleba}/${c.via}: ponta B longe do perímetro`).toBeLessThanOrEqual(1);
    }
  });

  test("toda via culpada termina DENTRO de um lote externo, numa das pontas", () => {
    for (const c of prova().viasCulpadas) {
      expect(
        c.pontaA_dentroDeLoteExterno || c.pontaB_dentroDeLoteExterno,
        `${c.gleba}/${c.via}: nenhuma ponta cai em lote externo — a forma crua do achado mudou`,
      ).toBe(true);
    }
  });

  test("ela ATRAVESSA a faixa e continua — é via do plano, não via desenhada na faixa", () => {
    for (const c of prova().viasCulpadas) {
      expect(c.atravessaEContinua, `${c.gleba}/${c.via}: o eixo está todo dentro ou todo fora da faixa`).toBe(true);
      expect(c.fracaoDoEixoDentroDaFaixa).toBeGreaterThan(0);
      expect(c.fracaoDoEixoDentroDaFaixa).toBeLessThan(0.98);
    }
  });

  test("o recorte de via por `util` NÃO rodou: zero bulbo de retorno na SAÍDA", () => {
    // `aplicarCulDeSac` é o único lugar que recortaria via por `util`, e ele
    // começa com `if (pct <= 0) return`. O bulbo só nasce nesse caminho, então
    // zero bulbo é a prova, de fora, de que ele não rodou — e é o que explica
    // uma via SECUNDÁRIA estar entre as culpadas.
    for (const g of prova().glebas) {
      expect(g.bulbosDeRetornoNaSaida).toBe(0);
      expect(g.oRecorteDeViaPorUtilRodou).toContain("NÃO");
    }
  });

  test("não é TODA via: são poucas de muitas, e isso também é a explicação", () => {
    // Nenhum recorte existe, então passa a via que o partido por acaso traçou
    // por ali. Se fosse "toda via entra", a explicação seria outra.
    for (const g of prova().glebas) {
      expect(g.viasQueEntramNaFaixa).toBeGreaterThan(0);
      expect(g.viasQueEntramNaFaixa, `${g.gleba}: TODAS as vias entram — outro mecanismo`).toBeLessThan(g.vias);
    }
  });
});

describe("LAB-55 · as candidatas MORTAS ficam mortas, e escritas", () => {
  /**
   * **Esta trava me reprovou, e a correção foi medir a AFIRMAÇÃO CERTA.**
   *
   * A primeira versão dizia *"a pior infratora de CADA gleba está a mais de 50 m do
   * acesso"* — e ficou vermelha, porque em `geo-antonina` a pior infratora (`V2`, 8 lotes)
   * passa a **9,55 m** do ponto de acesso. Afrouxar o limiar para 5 m seria a régua-enfeite
   * do D172.
   *
   * **O que os números sustentam é outra frase, e ela basta:** a candidata do acesso não
   * pode ser *o mecanismo*, porque em **toda** gleba há via culpada **longe** do acesso — e
   * no controle convexo a **pior de todas** está a **382 m** dele. Não afirmo que o acesso
   * não tem parte na `V2`: afirmo que ele não explica as outras.
   */
  test("a candidata do ACESSO não é o mecanismo: em toda gleba há culpada LONGE dele", () => {
    const porGleba = new Map<string, Culpada[]>();
    for (const c of prova().viasCulpadas) {
      porGleba.set(c.gleba, [...(porGleba.get(c.gleba) ?? []), c]);
    }
    expect(porGleba.size, "uma gleba só não mata candidata nenhuma").toBeGreaterThan(1);
    for (const [gleba, cs] of porGleba) {
      for (const c of cs) {
        expect(c.distanciaDoAcesso_m, `${gleba}/${c.via}: sem a distância do acesso não há medição`).not.toBeNull();
      }
      const longe = cs.filter((c) => c.distanciaDoAcesso_m! > 50);
      expect(
        longe.length,
        `${gleba}: TODAS as culpadas estão a menos de 50 m do acesso — a candidata do acesso voltou a ser candidata`,
      ).toBeGreaterThan(0);
    }
    // E a pior de todas, no controle convexo, está longe: é o número que mais pesa.
    const noControle = (porGleba.get("ensaio-com-testada") ?? []).slice().sort(
      (a, b) => b.lotesQueEleInvade.length - a.lotesQueEleInvade.length,
    )[0];
    expect(noControle, "o controle convexo saiu da medição").toBeDefined();
    expect(
      noControle!.distanciaDoAcesso_m!,
      "a pior infratora do controle ficou perto do acesso — a candidata do acesso voltou",
    ).toBeGreaterThan(100);
  });

  test("as duas explicações MORTAS do LAB-50 continuam escritas na prova dele (D174)", () => {
    // Hipótese descartada em silêncio volta como hipótese nova no prompt seguinte.
    const p50 = JSON.parse(readFileSync(PROVA_50, "utf8")) as {
      glebas: { previsoes?: { P4_aFaixaNaoFoiReservada?: { explicacoesMORTAS?: unknown[] } } }[];
    };
    const comMortas = p50.glebas.filter(
      (g) => (g.previsoes?.P4_aFaixaNaoFoiReservada?.explicacoesMORTAS ?? []).length >= 2,
    );
    expect(comMortas.length, "as explicações mortas do LAB-50 sumiram da prova dele").toBeGreaterThan(0);
  });

  test("e a prova do LAB-55 as repete, para quem ler só ela não ressuscitá-las", () => {
    const p = JSON.parse(readFileSync(PROVA_55, "utf8")) as { asDuasExplicacoesMORTAS?: string[] };
    expect(p.asDuasExplicacoesMORTAS?.length, "a prova do LAB-55 não diz o que já morreu").toBe(2);
    expect(p.asDuasExplicacoesMORTAS!.join(" ")).toContain("CONVEXA");
  });
});
