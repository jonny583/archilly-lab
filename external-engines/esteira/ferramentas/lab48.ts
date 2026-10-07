/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-48 · As 128 violações do motor PADRÃO, uma a uma. DIAGNÓSTICO, não conserto.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O chat trouxe o achado do Generate: o motor do **Laboratório de Parcelamento** é o
 * motor **padrão** da tela unificada, e **reprova no Validator do Generate nas cinco
 * glebas**. Como só entra no ranking candidata aprovada, a tela nasceria com **ranking
 * vazio**.
 *
 * E ele foi explícito sobre o método:
 *
 * > *"Traga o diagnóstico antes de consertar qualquer coisa — o Generate está fazendo o
 * > mesmo diagnóstico do lado dele, e eu quero os dois para comparar."*
 *
 * **Por isso esta ferramenta não conserta nada.** Ela não toca na ponte, não muda a ida
 * e não afrouxa régua nenhuma: ela **mede**, violação por violação, e classifica cada
 * uma em MOTOR, RÉGUA, PONTE ou CONTRATO.
 *
 * # As três coisas que ela faz, e a terceira é a que responde a pergunta
 *
 *   1. **a lista inteira.** O `julgar()` do Lab guarda só `porTipo` e **três** exemplos;
 *      aqui o Validator é chamado direto e as 128 saem **nomeadas, com o lote e o valor**;
 *   2. **a distância, não o rótulo.** Para cada lote acusado de `frente` ou `testada`, a
 *      **distância medida** até a testada de frente entregue. É a lição do D161: eu já
 *      classifiquei lote por `-eN` uma vez e errei 19 de 33;
 *   3. **o CONTRAFACTUAL, e ele é o diagnóstico.** O Validator do Generate aceita um
 *      campo `faixaViaPublica` — *"a RUA PÚBLICA, quando existe… o lote de loteamento faz
 *      frente para ela por definição, e ela corre por FORA do terreno"*. Medido: o
 *      tradutor `paraResultado` do **próprio Generate** nunca o preenche, e o contrato de
 *      motor v1 **não tem campo** onde um motor o declare. Então aqui ele é preenchido
 *      **com a função do próprio Generate** (`faixaViaPublica`), sobre a divisa que o
 *      **próprio Generate** escolhe (`divisaDoAcesso`), e o Validator roda de novo.
 *
 *      A diferença entre as duas rodadas é **quantas das 128 são o campo que falta**, e
 *      não defeito de ninguém. Nada disso fica ligado: é medição de contrafactual, com a
 *      ponte intacta.
 *
 * # A PRECONDIÇÃO, e ela FALHA em vez de pular (D124)
 *
 * O relatório do Validator publica `violacoes` como **número** e só **5 exemplos**: o
 * relatório viaja no payload do plano, e 5 é o certo em produção. O próprio Generate
 * deixou a tampa levantável para quem está medindo — a variável `INVARIANTES_EXEMPLOS`,
 * que ele criou na investigação A438 dele, por este mesmo motivo.
 *
 * **Ela é lida quando o módulo carrega**, então tem de vir do ambiente, antes do
 * `import`. É o que o `package.json` faz. E esta ferramenta **confere** que a lista veio
 * inteira: se `exemplos.length` não bater com `violacoes`, ela **para com a receita** —
 * ler 5 de 128 e publicar "as violações, uma a uma" seria a mentira do D110 em miniatura.
 *
 * Uso: `bun run lab48`
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import { verificarInvariantesPlano } from "@generate/engine/invariantes.ts";
import { divisaDoAcesso, faixaViaPublica } from "@generate/engine/espinha/fileira-fachada.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { contratoDasEntradas, type EntradaMinima } from "../src/gleba-v1.ts";
import { linhasDaEntrada, type P } from "../src/motores/comum.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-48");
const SEMENTE = 20260913;

/** As CINCO glebas originais — as mesmas do achado do chat, na mesma ordem. */
const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
];

/** Distância de um polígono a um conjunto de linhas, em metros. `null` sem linha. */
function distanciaAteALinha(pontos: readonly P[], linhas: readonly P[][]): number | null {
  if (!linhas.length) return null;
  const dSeg = (p: P, a: P, b: P) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const n = dx * dx + dy * dy;
    const t = n === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / n));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  };
  let melhor = Infinity;
  for (const v of pontos) {
    for (const linha of linhas) {
      for (let i = 1; i < linha.length; i++) melhor = Math.min(melhor, dSeg(v, linha[i - 1]!, linha[i]!));
    }
  }
  return Number(melhor.toFixed(1));
}

const porTipo = (vs: { tipo: string }[]) => {
  const c: Record<string, number> = {};
  for (const v of vs) c[v.tipo] = (c[v.tipo] ?? 0) + 1;
  return c;
};

type Linha = Record<string, unknown>;
const porGleba: Linha[] = [];
const todasAsViolacoes: Linha[] = [];

for (const { id, entrada } of GLEBAS) {
  // A rodada é a do Lab, sem nenhum ajuste: a mesma `rodarTestfit` que a tabela
  // publica. Medir outra rodada responderia outra pergunta (D149).
  const r = rodarTestfit(entrada, SEMENTE);
  const l = montarParcelamentoExterno(r.saida as never, {
    entrada: entrada as unknown as EntradaMotorV1,
  });
  if (!l.conferencia.valido || !l.externo) {
    porGleba.push({ gleba: id, recusadoPeloEsquema: l.conferencia.erros.slice(0, 3) });
    continue;
  }
  const res = l.externo.resultado;
  const antes = verificarInvariantesPlano(res);
  if (antes.exemplos.length !== antes.violacoes) {
    console.error(
      `✗ ${id}: o Validator devolveu ${antes.violacoes} violações e só ${antes.exemplos.length} exemplos.\n` +
        `  A tampa de exemplos está baixa, e medir 'uma a uma' com ela baixa é mentira.\n` +
        `  Rode assim:  INVARIANTES_EXEMPLOS=100000 bun ferramentas/lab48.ts\n` +
        `  (é a variável que o PRÓPRIO Generate criou para investigar — ver invariantes.ts)`,
    );
    process.exit(1);
  }

  // ── O CONTRAFACTUAL: e a faixa é construída pelo Generate, não por mim ────
  const { testadasDeFrente } = linhasDaEntrada(entrada);
  const poly = res.terreno.poligono as P[];
  let faixa: P[] | null = null;
  let divisaDe: string | null = null;
  if (testadasDeFrente.length) {
    // O meio da testada entregue serve de ponto de acesso, e é o `divisaDoAcesso`
    // DO GENERATE que escolhe a divisa e decide o lado de dentro. Nenhuma régua
    // minha entra aqui: a geometria do contrafactual é inteiramente dele.
    const linha = testadasDeFrente[0]!;
    const a = linha[0]!;
    const b = linha[linha.length - 1]!;
    const meio = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const divisa = divisaDoAcesso(poly, meio);
    if (divisa) {
      faixa = faixaViaPublica(divisa, 8) as P[];
      divisaDe = `testada entregue, ${linha.length} ponto(s); divisa escolhida pelo divisaDoAcesso do Generate (${divisa.comprimento.toFixed(1)} m)`;
    }
  }
  const depois = faixa
    ? verificarInvariantesPlano({ ...res, faixaViaPublica: [faixa] } as never)
    : null;

  // ── CONTRAFACTUAL 2: o mínimo DECLARADO na entrada, em vez do derivado ────
  //
  // O Validator confere cada lote contra `params.testadaMin`, que o tradutor do
  // Generate tira de `parametrosUsados.testadaMinLote_m` — *"o que você de fato
  // aplicou"*. Medido: a entrada declara **10 m**, e o que chega ao Validator é
  // **11,708…** — o ALVO sorteado da variante, não o mínimo. Então aqui o mínimo
  // volta a ser o declarado, e a diferença diz quantas das acusações são isso.
  const minimoDeclarado = (entrada as { parametros?: { testadaMinLote_m?: number } }).parametros?.testadaMinLote_m ?? null;
  const comOMinimoDeclarado =
    minimoDeclarado != null && minimoDeclarado !== res.params.testadaMin
      ? verificarInvariantesPlano({ ...res, params: { ...res.params, testadaMin: minimoDeclarado } } as never)
      : null;
  const sobramComOMinimo = comOMinimoDeclarado
    ? new Set(comOMinimoDeclarado.exemplos.map((v) => `${v.tipo}|${v.loteId}`))
    : null;

  // ── A geometria da QUADRA acusada, para o `face-quadra` ser atribuível ────
  const quadraPorId = new Map(res.quadras.map((q) => [q.id, q]));
  const facesDe = (pontos: readonly P[]) => {
    const f: number[] = [];
    for (let i = 0; i < pontos.length; i++) {
      const u = pontos[i]!;
      const v = pontos[(i + 1) % pontos.length]!;
      f.push(Number(Math.hypot(v.x - u.x, v.y - u.y).toFixed(1)));
    }
    return f.sort((x, y) => y - x);
  };

  // ── Distância do lote ao EIXO de via mais próximo, com a largura dela ─────
  //
  // Para separar "o lote não tem rua nenhuma perto" de "tem rua e a régua não a
  // vê". Sem isto, `frente` fora de Antonina ficaria sem atribuição.
  const vias = [...res.rede.principal, ...res.rede.secundarias];
  const viaMaisProxima = (pontos: readonly P[]) => {
    // `largura` sai `null` quando a via não a declara — nunca 0. Zero é uma
    // medição ("via sem caixa"), e `null` é "não medido" (D23). As cinco glebas
    // declaram todas, e as larguras medidas foram 10 e 11,5 m.
    let melhor: { id: string; d: number; largura: number | null } | null = null;
    for (const v of vias) {
      const d = distanciaAteALinha(pontos, [v.pontos as P[]]);
      if (d != null && (!melhor || d < melhor.d)) melhor = { id: v.id, d, largura: v.largura ?? null };
    }
    return melhor;
  };

  const lotePorId = new Map(res.lotes.map((lo) => [lo.id, lo]));
  const aindaAcusado = depois ? new Set(depois.exemplos.map((v) => `${v.tipo}|${v.loteId}`)) : null;

  for (const v of antes.exemplos) {
    const lote = v.loteId ? lotePorId.get(v.loteId) : undefined;
    todasAsViolacoes.push({
      gleba: id,
      tipo: v.tipo,
      loteId: v.loteId ?? null,
      detalhe: v.detalhe ?? null,
      valor: v.valor ?? null,
      // O id diz "externo"; a distância diz ONDE. As duas saem, e só a segunda vale (D161).
      idDizExterno: v.loteId ? /-e\d+$/.test(v.loteId) : null,
      distanciaAteATestada_m: lote ? distanciaAteALinha(lote.pontos as P[], testadasDeFrente) : null,
      area_m2: lote ? Number(lote.area.toFixed(1)) : null,
      someComAFaixaViaPublica: aindaAcusado ? !aindaAcusado.has(`${v.tipo}|${v.loteId}`) : null,
      someComOMinimoDeclarado: sobramComOMinimo ? !sobramComOMinimo.has(`${v.tipo}|${v.loteId}`) : null,
      // Só para `frente`/`testada`: há rua perto deste lote, e a quantos metros?
      viaMaisProxima: lote && (v.tipo === "frente" || v.tipo === "testada") ? viaMaisProxima(lote.pontos as P[]) : null,
      // Só para `face-quadra`: as faces da quadra acusada, da maior para a menor.
      facesDaQuadra: v.tipo === "face-quadra" && v.loteId && quadraPorId.has(v.loteId)
        ? facesDe(quadraPorId.get(v.loteId)!.pontos as P[]).slice(0, 6)
        : null,
    });
  }

  porGleba.push({
    gleba: id,
    variante: r.variante,
    lotes: res.lotes.length,
    quadras: res.quadras.length,
    testadasDeFrenteNaEntrada: testadasDeFrente.length,
    violacoes: antes.violacoes,
    porTipo: antes.porTipo,
    contrafactual: faixa
      ? {
          faixaConstruidaPor: "faixaViaPublica() do Generate, largura 8 m",
          divisa: divisaDe,
          violacoes: depois!.violacoes,
          porTipo: depois!.porTipo,
          quantasSomem: antes.violacoes - depois!.violacoes,
        }
      : { naoHaTestadaNaEntrada: true, porque: "sem rua pública declarada não há faixa a construir" },
    parametros: {
      testadaMin_m: res.params.testadaMin,
      areaMin_m2: res.params.areaMin,
      temLoteamentoFachada: Boolean(res.params.loteamentoFachada),
      temLotesFrente: Boolean(res.params.lotesFrente),
    },
    lotesComBandeiraDeFachada: res.lotes.filter((lo) => (lo as { deLoteamentoFachada?: boolean }).deLoteamentoFachada).length,
    oMinimoDeTestada: {
      declaradoNaEntrada_m: minimoDeclarado,
      queChegaAoValidator_m: res.params.testadaMin,
      saoIguais: minimoDeclarado === res.params.testadaMin,
      limiteEfetivo_m: Number((res.params.testadaMin * 0.98).toFixed(4)),
      deOndeVem: "parametrosUsados.testadaMinLote_m da SAÍDA, preenchido pelo `parametrosAplicados` do adaptador do Lab (volta.ts)",
      contrafactual: comOMinimoDeclarado
        ? { violacoes: comOMinimoDeclarado.violacoes, porTipo: comOMinimoDeclarado.porTipo }
        : null,
    },
    oTetoDeFaceDeQuadra: {
      declaradoNaEntrada_m: (entrada as { parametros?: { faceQuadraMax_m?: number } }).parametros?.faceQuadraMax_m ?? null,
      queChegaAoValidator_m: res.params.faceQuadraMax ?? null,
      entregueAoMotorPelaIda: "sim — `padroes.comprimentoQuadra` fixado em faixa(teto, teto), ver ida.ts:387",
    },
  });
}

const total = porTipo(todasAsViolacoes as { tipo: string }[]);
const somem = todasAsViolacoes.filter((v) => v.someComAFaixaViaPublica === true).length;
const somemComOMinimo = todasAsViolacoes.filter((v) => v.someComOMinimoDeclarado === true).length;

console.log("══════════ LAB-48 · as violações do motor padrão, uma a uma ══════════");
for (const g of porGleba) {
  console.log(`  ${String(g.gleba).padEnd(24)} ${String(g.violacoes).padStart(3)} · ${JSON.stringify(g.porTipo)}`);
  const c = g.contrafactual as { quantasSomem?: number; violacoes?: number } | undefined;
  if (c?.quantasSomem !== undefined) {
    console.log(`  ${"".padEnd(24)} com faixaViaPublica: ${c.violacoes} (somem ${c.quantasSomem})`);
  }
}
console.log("");
console.log(`  TOTAL: ${todasAsViolacoes.length} violações · ${JSON.stringify(total)}`);
console.log(`  somem com o campo que falta (faixaViaPublica): ${somem}`);
console.log(`  somem com o MÍNIMO DECLARADO na entrada (10 m, não o alvo 11,708): ${somemComOMinimo}`);
console.log(`  lotes com a bandeira deLoteamentoFachada: ${porGleba.reduce((s, g) => s + Number(g.lotesComBandeiraDeFachada ?? 0), 0)}`);

// ── ONDE A PROVA MORA SAI DA MEDIÇÃO, não de quem roda a ferramenta ────────
//
// Esta mesma ferramenta responde duas perguntas em dois momentos: o DIAGNÓSTICO
// do LAB-48, com a ponte ainda escrevendo o alvo no campo do mínimo, e a
// AFERIÇÃO do LAB-53, depois do conserto. Se as duas escrevessem no mesmo
// arquivo, a segunda rodada apagaria a primeira — e a comparação "antes ×
// depois", que é o que o chat pediu para pôr ao lado do diagnóstico do Generate,
// deixaria de existir.
//
// **E o estado da ponte é MEDIDO, não declarado.** O campo `ehDiagnostico`
// dizia, em texto fixo, *"nada foi consertado, e a ponte não foi tocada"* — uma
// legenda que o conserto do LAB-53 tornaria falsa em silêncio, que é a forma
// exata do D104. Agora quem responde é `oMinimoDeTestada.saoIguais`, gleba por
// gleba: o mínimo que chega ao Validator é o declarado na entrada, ou não é.
const medidas = porGleba
  .map((g) => (g.oMinimoDeTestada as { saoIguais?: boolean } | undefined)?.saoIguais)
  .filter((v): v is boolean => typeof v === "boolean");
// **Gleba recusada pelo esquema não vota.** E se NENHUMA foi medida, a resposta
// não é "consertada": é "não medida" — a diferença que o D164 cobra.
const ponteConsertada = medidas.length > 0 && medidas.every((v) => v);
const DESTINO = ponteConsertada ? join(RAIZ, "docs", "provas", "LAB-53") : SAIDA;
const ARQUIVO = ponteConsertada
  ? "violacoes-depois-do-conserto-da-ponte.json"
  : "violacoes-do-motor-padrao.json";

mkdirSync(DESTINO, { recursive: true });
writeFileSync(
  join(DESTINO, ARQUIVO),
  JSON.stringify(
    {
      prompt: ponteConsertada ? "LAB-53" : "LAB-48",
      oQueIstoMede: "as violações do Validator do Generate sobre o motor PADRÃO da tela unificada, uma a uma, nas cinco glebas originais",
      ehDiagnostico: ponteConsertada
        ? "não — esta é a AFERIÇÃO do LAB-53: a ponte já põe o MÍNIMO do contrato em `parametrosUsados`, " +
          "e o número aqui é o que sobra depois disso. O diagnóstico de antes está em docs/provas/LAB-48/."
        : "sim — nada foi consertado, e a ponte não foi tocada. O contrafactual é medição, não ajuste.",
      ponteConsertada,
      comoSeiDisso:
        "medido, não declarado: `oMinimoDeTestada.saoIguais` em cada gleba — o mínimo que chega ao " +
        "Validator contra o declarado na ENTRADA. Era 11,70820393249937 contra 10 m até o LAB-53 (D166)",
      quando: new Date().toISOString(),
      motor: "Laboratório de Parcelamento (motor-testfit) — o motor PADRÃO da tela unificada",
      semente: SEMENTE,
      contrato: contratoDasEntradas(GLEBAS.map((g) => g.entrada)),
      glebas: porGleba,
      total: {
        violacoes: todasAsViolacoes.length,
        porTipo: total,
        somemComAFaixaViaPublica: somem,
        somemComOMinimoDeclaradoNaEntrada: somemComOMinimo,
      },
      violacoes: todasAsViolacoes,
    },
    null,
    2,
  ) + "\n",
);
console.log(`\n  docs/provas/${ponteConsertada ? "LAB-53" : "LAB-48"}/${ARQUIVO}`);
