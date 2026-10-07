/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-55 · Por que o motor desenha via SOBRE a faixa que ele mesmo reservou.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-50 deixou isto **NÃO ATRIBUÍDO**, de propósito, e matou duas explicações minhas
 * (D174) — as duas estão escritas em `docs/provas/LAB-50/passagem-externa.json`, campo
 * `explicacoesMORTAS`, e **não se ressuscitam sem medição nova**:
 *
 *  1. *"corte de semiplano numa gleba CÔNCAVA não separa faixa de sobra"* — morta pelo
 *     controle: acontece igual na gleba **convexa** de 4 vértices;
 *  2. *"o leito é eixo ± meia-caixa, então a via logo dentro da sobra derrama de volta"* —
 *     morta por medição: o eixo das vias culpadas está a **0,1 a 0,8 m** da RETA da face,
 *     isto é **dentro** da faixa, e não na beira dela.
 *
 * # A terceira, e esta é lida no código do motor (só leitura)
 *
 * ```ts
 * // motor.ts:194  — a faixa sai da gleba disponível
 * const { restante, externos } = reservarFacesExternas(terreno, cfg, a, id);
 * // motor.ts:198  — e é `restante` que vira o chão do traçado
 * const util = erodir(rotacionar(restante, -a.angulo, centro), 0);
 * …
 * // formatos.ts:436, 589, 671…  — QUADRA e LOTE nascem recortados por `util`
 * const q = quadraRet(util, rect, a.areaLote);
 * …
 * // motor.ts:247  — e a REDE VIÁRIA é aparada por… a DIVISA
 * const vias = apararRedeViaria(viasBrutas, terreno.perimetro);
 * ```
 *
 * > **`util` governa onde nasce LOTE. A DIVISA governa onde fica VIA. A faixa reservada é
 * > um buraco no domínio do lote e não é buraco nenhum no domínio da via.**
 *
 * E há um segundo andar, no `aplicarCulDeSac` (`formatos.ts:826`), o **único** lugar onde
 * uma via chega a ser recortada por `util`:
 *
 * ```ts
 * if (pct <= 0) return { vias: s.vias, bolsoes };           // ← com 0 %, NENHUMA é recortada
 * const vias0 = util
 *   ? s.vias.map((v) => (v.classe === "secundaria" ? recortarVia(v, util) : v))
 *   : s.vias;                                               // ← e a PRINCIPAL nunca é
 * ```
 *
 * # Como isto se mede sem régua minha, e sem precisar do `prof`
 *
 * O LAB-50 registrou que **`prof` não é observável de fora** (item 3 da lista dele). Então
 * a faixa não é reconstruída aqui: **ela é lida nos lotes externos publicados**, que são o
 * que o motor de fato assentou nela.
 *
 * **Sobre o id `-eN`:** ele diz **O QUE** o lote é — a marca que `reservarFacesExternas`
 * estampa (`id: \`${id}-e${n}\``) — e **não onde ele está**. O D161 me custou uma publicação
 * errada por eu ter lido o id como posição; a lição foi *medir a distância para dizer ONDE*,
 * não *parar de ler o id para saber O QUE*.
 *
 * As quatro medições, e a segunda é a que decide:
 *
 *  1. **`sobreposicao` = 0** nas cinco glebas, lido da prova do LAB-53 (não remedido aqui,
 *     D116). Se o corte tivesse saído degenerado e `restante` ficado inteiro, QUADRA e LOTE
 *     teriam nascido sobre a faixa e haveria `sobreposicao` entre interno e externo. **Zero
 *     mata a candidata do corte degenerado** — o `util` excluiu a faixa, para o lote;
 *  2. **onde a via culpada TERMINA.** Se ela foi aparada pela DIVISA, a ponta dela está
 *     **sobre o perímetro** (distância ≈ 0). Se tivesse sido recortada por `util`, pararia
 *     na borda interna da faixa, longe do perímetro. *É a medida que separa "aparada pela
 *     divisa" de "recortada pelo útil";*
 *  3. **quantas vias entram na faixa, de todas** — uma é acidente, várias é sistema;
 *  4. **a candidata do ACESSO**, do chat: a distância do ponto de acesso a cada via culpada.
 *     Se a culpada não for a via de acesso, a candidata morre.
 *
 * E o controle **convexo** entra de novo, porque sem ele tudo vale para uma gleba só.
 *
 * Uso: `bun run lab55`
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import {
  _faixasViaQuadsComId,
  _interseccaoConvexa,
  verificarInvariantesPlano,
} from "@generate/engine/invariantes.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";
// As duas funções de geometria são DO MOTOR: é a geometria dele que decide onde
// os lotes dele estão, e importá-las é o D16 (motor da família se lê por caminho).
import { distanciaAoPoligono, pontoEmPoligono } from "@testfit/geo.ts";

import { contratoDasEntradas, type EntradaMinima } from "../src/gleba-v1.ts";
import { linhasDaEntrada, oQueAEsteiraPassaPronto, type P } from "../src/motores/comum.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { area } from "../src/probe-de-amostragem.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-55");
const SEMENTE = 20260913;
/** Passo da amostragem do eixo, em metros. Declarado porque é o que dá força ao número. */
const PASSO_M = 0.25;
/** "A ponta está SOBRE o perímetro" — a tolerância, em metros, e ela é generosa. */
const NA_DIVISA_M = 1.0;

const GLEBAS: { id: string; convexa: boolean; entrada: EntradaMinima }[] = [
  { id: "geo-antonina", convexa: false, entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
  {
    id: "ensaio-com-testada",
    convexa: true,
    entrada: JSON.parse(
      readFileSync(join(RAIZ, "docs", "fixtures", "glebas-que-exercem-as-promessas", "ensaio-com-testada.entrada.json"), "utf8"),
    ),
  },
];

/** `sobreposicao` por gleba, LIDO da prova do LAB-53 — não remedido aqui (D116). */
const SOBREPOSICAO_NO_LAB53: Record<string, number> = (() => {
  const p = JSON.parse(
    readFileSync(join(RAIZ, "docs", "provas", "LAB-53", "violacoes-depois-do-conserto-da-ponte.json"), "utf8"),
  ) as { glebas: { gleba: string; porTipo?: Record<string, number> }[] };
  const m: Record<string, number> = {};
  for (const g of p.glebas) m[g.gleba] = g.porTipo?.["sobreposicao"] ?? 0;
  return m;
})();

const n2 = (x: number) => Number(x.toFixed(2));
const comp = (a: P, b: P) => Math.hypot(b.x - a.x, b.y - a.y);

type Linha = Record<string, unknown>;
const porGleba: Linha[] = [];
const culpadas: Linha[] = [];

for (const { id, convexa, entrada } of GLEBAS) {
  const faces = oQueAEsteiraPassaPronto(entrada).facesLoteamento;
  const { testadasDeFrente } = linhasDaEntrada(entrada);
  const r = rodarTestfit(entrada, SEMENTE);
  if (!r.saida) {
    porGleba.push({ gleba: id, semSaida: r.naoSoubeFazer });
    continue;
  }
  const l = montarParcelamentoExterno(r.saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) {
    porGleba.push({ gleba: id, recusadoPeloEsquema: l.conferencia.erros.slice(0, 3) });
    continue;
  }
  const res = l.externo.resultado;
  const rel = verificarInvariantesPlano(res);
  if (rel.exemplos.length !== rel.violacoes) {
    console.error(`✗ ${id}: ${rel.violacoes} violações e só ${rel.exemplos.length} exemplos.`);
    console.error(`  Rode assim:  INVARIANTES_EXEMPLOS=100000 bun ferramentas/lab55.ts`);
    process.exit(1);
  }

  // A HIERARQUIA vem da SAÍDA, não do `resultado` interno do Generate: é lá que
  // o contrato a publica (`hierarquia`), e a `TrechoViario` dele não a carrega.
  // Ler `v.hierarquia` do resultado dava `null` em 4 de 4 — e `null` silencioso
  // num campo que decide a atribuição é o D23 pelo avesso.
  const hierarquiaPorId = new Map(
    ((r.saida as { vias?: { id: string; hierarquia?: string }[] }).vias ?? []).map((v) => [v.id, v.hierarquia ?? null]),
  );
  // ── O SEGUNDO ANDAR, e ele é medível de fora: HOUVE cul-de-sac? ──────────
  //
  // `aplicarCulDeSac` é o ÚNICO lugar onde uma via chega a ser recortada por
  // `util`, e ele começa com `if (pct <= 0) return { vias: s.vias, bolsoes }` —
  // com 0 % NENHUMA via é recortada, nem secundária. O bulbo de retorno só nasce
  // nesse caminho, e o contrato o publica como área especial `retorno`: então
  // **zero `retorno` na SAÍDA é a prova, de fora, de que o recorte não rodou.**
  const retornos = ((r.saida as { areasEspeciais?: { tipo: string }[] }).areasEspeciais ?? []).filter(
    (ae) => ae.tipo === "retorno",
  ).length;
  const perim = (entrada.gleba?.anel ?? []) as P[];
  const acessos = (entrada.acessos ?? []) as { papel?: string; ponto?: P | null }[];
  const principal = acessos.find((a) => a.papel === "principal") ?? acessos[0];
  const acesso: P | null = principal?.ponto ?? null;

  // ── A FAIXA É LIDA NOS LOTES EXTERNOS PUBLICADOS ─────────────────────────
  //
  // O id `-eN` é a marca que o motor estampa — ele diz O QUE o lote é. ONDE ele
  // está é medido, nunca lido do id (D161).
  const externos = res.lotes.filter((lo) => /-e\d+$/.test(lo.id));
  const vias = [...res.rede.principal, ...res.rede.secundarias];
  const quads = _faixasViaQuadsComId(vias);

  // Os pares (lote externo, via) com interseção, pela função DO GENERATE.
  const pares: { lote: string; via: string; m2: number }[] = [];
  for (const lo of externos) {
    for (const q of quads) {
      const inter = _interseccaoConvexa(lo.pontos as never, q.quad as never);
      const m2 = inter ? area(inter as P[]) : 0;
      if (m2 > 0.5) pares.push({ lote: lo.id, via: q.id, m2: n2(m2) });
    }
  }

  /** Fração do eixo da via que cai DENTRO de algum lote externo, com a função do motor. */
  const dentroDaFaixa = (eixo: readonly P[]): { fracao: number; amostras: number; dentro: number } => {
    const a = eixo[0]!;
    const b = eixo[eixo.length - 1]!;
    const n = Math.max(2, Math.ceil(comp(a, b) / PASSO_M));
    let dentro = 0;
    for (let k = 0; k <= n; k++) {
      const p = { x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n };
      if (externos.some((lo) => pontoEmPoligono(p, lo.pontos as never))) dentro++;
    }
    return { fracao: n2(dentro / (n + 1)), amostras: n + 1, dentro };
  };

  // Quantas de TODAS as vias entram na faixa — uma é acidente, várias é sistema.
  let viasQueEntram = 0;
  for (const v of vias) if (dentroDaFaixa(v.pontos as P[]).dentro > 0) viasQueEntram++;

  const idsCulpadas = [...new Set(pares.map((p) => p.via))];
  for (const viaId of idsCulpadas) {
    const v = vias.find((x) => x.id === viaId);
    if (!v) continue;
    const eixo = v.pontos as P[];
    const p0 = eixo[0]!;
    const p1 = eixo[eixo.length - 1]!;
    const f = dentroDaFaixa(eixo);
    culpadas.push({
      gleba: id,
      via: viaId,
      hierarquia: hierarquiaPorId.get(viaId) ?? null,
      largura_m: (v as { largura?: number }).largura ?? null,
      comprimento_m: n2(comp(p0, p1)),
      // ── A MEDIDA QUE DECIDE: onde a via TERMINA ────────────────────────
      pontaA_aoPerimetro_m: n2(distanciaAoPoligono(p0, perim as never)),
      pontaB_aoPerimetro_m: n2(distanciaAoPoligono(p1, perim as never)),
      // A ponta terminou SOBRE terra reservada? É a forma mais crua do achado:
      // a via acaba na divisa, e a divisa ali é dentro da faixa do lote externo.
      pontaA_dentroDeLoteExterno: externos.some((lo) => pontoEmPoligono(p0, lo.pontos as never)),
      pontaB_dentroDeLoteExterno: externos.some((lo) => pontoEmPoligono(p1, lo.pontos as never)),
      aparadaPelaDivisa:
        distanciaAoPoligono(p0, perim as never) <= NA_DIVISA_M ||
        distanciaAoPoligono(p1, perim as never) <= NA_DIVISA_M,
      // Parte do eixo sobre a faixa reservada, e parte fora dela.
      fracaoDoEixoDentroDaFaixa: f.fracao,
      amostrasDoEixo: f.amostras,
      atravessaEContinua: f.fracao > 0 && f.fracao < 0.98,
      // A candidata do chat: a via culpada é a via de ACESSO?
      distanciaDoAcesso_m: acesso ? n2(Math.min(distanciaAoPoligono(acesso, [p0, p1, p0] as never), comp(acesso, p0), comp(acesso, p1))) : null,
      lotesQueEleInvade: pares.filter((p) => p.via === viaId).map((p) => `${p.lote} (${p.m2} m²)`),
    });
  }

  porGleba.push({
    gleba: id,
    convexa,
    variante: r.variante,
    facesEntregues: faces?.length ?? 0,
    testadasDeFrenteNaEntrada: testadasDeFrente.length,
    lotesExternos: externos.length,
    vias: vias.length,
    viasQueEntramNaFaixa: viasQueEntram,
    bulbosDeRetornoNaSaida: retornos,
    oRecorteDeViaPorUtilRodou:
      retornos > 0
        ? "sim, o caminho do cul-de-sac rodou — e mesmo assim só a via SECUNDÁRIA seria recortada"
        : "NÃO: zero bulbo de retorno na SAÍDA ⇒ `pctCulDeSac` é 0 e o `aplicarCulDeSac` retornou antes de recortar via nenhuma",
    viaSobreLote: rel.porTipo["via-sobre-lote"] ?? 0,
    // Lido do LAB-53: é o que mata a candidata do corte degenerado.
    // `null` aqui é "não medido", nunca zero (D23) — e o motivo sai escrito, porque
    // número ausente sem motivo é o silêncio que o §4 proíbe.
    sobreposicao_LAB53: SOBREPOSICAO_NO_LAB53[id] ?? null,
    sobreposicao_porque:
      id in SOBREPOSICAO_NO_LAB53
        ? "lido da prova do LAB-53, não remedido aqui (D116)"
        : "NÃO MEDIDO: esta gleba é o controle convexo e não está entre as cinco do LAB-48/LAB-53",
    paresLoteVia: pares.length,
    passoDaAmostragem_m: PASSO_M,
  });
}

console.log("══════════ LAB-55 · por que a via cai sobre a faixa reservada ══════════");
for (const g of porGleba) {
  console.log(
    `  ${String(g.gleba).padEnd(20)} ${g.convexa ? "convexa" : "côncava"} · externos=${g.lotesExternos} · vias=${g.vias} · ` +
      `entram na faixa=${g.viasQueEntramNaFaixa}/${g.vias} · via-sobre-lote=${g.viaSobreLote} · ` +
      `sobreposicao=${g.sobreposicao_LAB53 ?? "não medido"} · bulbos=${g.bulbosDeRetornoNaSaida}`,
  );
}
console.log("");
for (const c of culpadas) {
  console.log(
    `  ${String(c.gleba).padEnd(20)} ${String(c.via).padEnd(4)} ${String(c.hierarquia).padEnd(11)} ` +
      `comp=${String(c.comprimento_m).padStart(7)} m · pontas ao perímetro: ${c.pontaA_aoPerimetro_m} / ${c.pontaB_aoPerimetro_m} m · ` +
      `ponta em lote externo: ${c.pontaA_dentroDeLoteExterno ? "sim" : "não"}/${c.pontaB_dentroDeLoteExterno ? "sim" : "não"} · ` +
      `eixo na faixa=${c.fracaoDoEixoDentroDaFaixa} · acesso a ${c.distanciaDoAcesso_m} m · invade ${(c.lotesQueEleInvade as string[]).length} lote(s)`,
  );
}

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "via-sobre-a-faixa.json"),
  JSON.stringify(
    {
      prompt: "LAB-55",
      oQueIstoMede:
        "por que a rede viária do motor ocupa a faixa que `reservarFacesExternas` tirou da gleba — " +
        "com a faixa lida nos lotes externos publicados, e o Validator do Generate como juiz",
      aHipotese:
        "`util` (a gleba menos a faixa) governa onde nasce QUADRA e LOTE (formatos.ts, `quadraRet(util, …)`), " +
        "e a REDE VIÁRIA é aparada por `apararRedeViaria(vias, terreno.perimetro)` — pela DIVISA, não por `util`. " +
        "A faixa é buraco no domínio do lote e não é buraco no domínio da via. O único recorte de via por `util` " +
        "está no `aplicarCulDeSac`, só para via SECUNDÁRIA e só quando pctCulDeSac > 0 (formatos.ts:826)",
      asDuasExplicacoesMORTAS: [
        "concavidade (D174) — acontece igual na gleba CONVEXA de 4 vértices",
        "derrame de meia-caixa (D174) — o eixo culpado está a 0,1 a 0,8 m da RETA da face, DENTRO da faixa",
      ],
      comoAFaixaFoiLida:
        "nos LOTES EXTERNOS publicados (id `-eN`, a marca que o motor estampa). `prof` não é observável de fora " +
        "(LAB-50, item 3), então a faixa não foi reconstruída. O id diz O QUE o lote é; ONDE ele está é medido (D161)",
      quando: new Date().toISOString(),
      motor: "Laboratório de Parcelamento (motor-testfit) — o motor PADRÃO da tela unificada",
      semente: SEMENTE,
      contrato: contratoDasEntradas(GLEBAS.map((g) => g.entrada)),
      glebas: porGleba,
      viasCulpadas: culpadas,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/LAB-55/via-sobre-a-faixa.json`);
