/**
 * LAB-78 — O SÉTIMO MECANISMO, SE ELE EXISTIR: motor ou faixa? (item 011)
 *
 * O LAB-59 deixou **quatro** candidatas de Antonina fora, uma violação cada, sem mecanismo. A
 * minha frase propôs a pergunta — *"pode ser um sétimo mecanismo do motor, ou a largura e a
 * divisa da faixa do Generate"* — e o item 011 manda **descobrir qual**, medindo.
 *
 * # O que esta ferramenta mede, e o que ela NÃO refaz
 *
 * Ela **não** reconta violações: o LAB-58 nomeia mecanismo e o LAB-59 fez o contrafactual.
 * Refazer aquilo seria a segunda montagem do D116. Ela mede **o que faltava** para decidir o
 * dono de cada uma das quatro:
 *
 * 1. a **largura** real da faixa do Generate contra a que o Lab construiu — `Math.max(8,
 *    larguraEntrada / 2)` com `larguraEntrada = 20` dá **10 m**, e o LAB-48 construiu **8**;
 * 2. o **alcance** da faixa: `divisaDoAcesso` devolve UM segmento do anel, e um lote fora da
 *    extensão dele não tem faixa na frente. Mede-se projetando o lote na reta da divisa;
 * 3. a distância do lote à faixa **nas duas larguras**, para a largura entrar como CONTROLE.
 *
 * **A geometria da faixa e da divisa é inteiramente DELE** (`divisaDoAcesso`, `faixaViaPublica`):
 * nenhuma régua minha escolhe divisa nem constrói faixa aqui. A minha parte é a distância, e ela
 * usa o `distSeg` que já existe nesta casa.
 *
 * Uso: `bun run lab78`
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { divisaDoAcesso, faixaViaPublica } from "@generate/engine/espinha/fileira-fachada.ts";
import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import type { EntradaMinima } from "../src/gleba-v1.ts";
import { distSeg, linhasDaEntrada, type P } from "../src/motores/comum.ts";
import { variantesJulgadasDoTestfit } from "../src/motores/testfit.ts";
import {
  CONTATO_m,
  aContaFecha,
  contarOsVereditos,
  deQuemEhAViolacao,
  type LoteAcusado,
  type VereditoDoLote,
} from "../src/setimo-mecanismo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-78");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const GLEBA = "geo-antonina";
const SEMENTE = 20260913;

/**
 * A LARGURA QUE O GENERATE USA, lida do fonte dele e não escolhida aqui.
 *
 * `gerar-v1-motor.ts` chama `faixaViaPublica(divisa, Math.max(8, larguraEntradaOrt / 2))`, e
 * `larguraEntradaOrt = params.larguraEntrada ?? PARAMS_PADRAO_V1.larguraEntrada ?? 20`. O
 * padrão dele é **20**, então a largura é **10**.
 *
 * O Lab construiu **8** no LAB-48 e no LAB-59 — e é por isso que as duas entram na medição.
 */
const LARGURA_DO_LAB = 8;
const LARGURA_DO_GENERATE = Math.max(8, 20 / 2);

/** As quatro que o LAB-59 deixou sem mecanismo, com o formato da candidata de cada uma. */
const AS_QUATRO = [
  { candidata: "espinha", loteId: "v12-l1093", tipo: "testada" as const },
  { candidata: "cluster", loteId: "v16-e15", tipo: "frente" as const },
  { candidata: "mioloVerde", loteId: "v20-e18", tipo: "frente" as const },
  { candidata: "pente", loteId: "v3-e19", tipo: "frente" as const },
];

const n2 = (v: number): number => Number(v.toFixed(2));

/** A menor distância entre dois polígonos, pelos dois sentidos. `distSeg` é o primitivo da casa. */
function entrePoligonos(a: readonly P[], b: readonly P[]): number {
  let d = Infinity;
  for (const p of a) for (let i = 0; i < b.length; i++) d = Math.min(d, distSeg(p, b[i]!, b[(i + 1) % b.length]!));
  for (const p of b) for (let i = 0; i < a.length; i++) d = Math.min(d, distSeg(p, a[i]!, a[(i + 1) % a.length]!));
  return d;
}

/**
 * A projeção do lote cai DENTRO da extensão da divisa `[a, b]`?
 *
 * Projeta-se cada vértice do lote no parâmetro `t` da reta `a→b`. Se **algum** `t` cai em
 * `[0, 1]`, há faixa na frente de parte do lote. Se **nenhum** cai, o lote está inteiramente
 * além da ponta do segmento — e a faixa não está na frente dele de jeito nenhum.
 *
 * É o teste do **alcance**, e é o que separa "a faixa é estreita" de "a faixa não está aqui".
 */
/**
 * Quantos METROS o lote avança além da ponta de `[a, b]` — zero quando está dentro.
 *
 * **Este número é o que decidiu o prompt.** A projeção dizia *que* o lote estava fora; sem o
 * *quanto*, eu atribuí a violação à faixa do vizinho. Medido, são 13,18 m e 10,43 m virando o
 * canto — o lote está na face SEGUINTE, e não há rua declarada ali.
 */
function alemDaPonta(lote: readonly P[], a: P, b: P): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) throw new Error("divisa degenerada: sem reta não há projeção");
  const comp = Math.sqrt(len2);
  let maior = 0;
  for (const p of lote) {
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
    if (t < 0) maior = Math.max(maior, -t * comp);
    else if (t > 1) maior = Math.max(maior, (t - 1) * comp);
  }
  return maior;
}

function projecaoDentroDaDivisa(lote: readonly P[], a: P, b: P): boolean {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) {
    throw new Error("divisa degenerada: a e b coincidem — sem reta não há projeção, e zero aqui mentiria");
  }
  for (const p of lote) {
    const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2;
    if (t >= 0 && t <= 1) return true;
  }
  return false;
}

// ── A medição ──────────────────────────────────────────────────────────────────
const entrada = JSON.parse(readFileSync(join(FIXTURES, `${GLEBA}.entrada.json`), "utf8")) as EntradaMinima;
const { testadasDeFrente } = linhasDaEntrada(entrada);
if (!testadasDeFrente.length) {
  throw new Error("a entrada de Antonina não declara testada de frente — sem face entregue não há o que medir");
}

/** O resultado do plano, como o LAB-59 o declara — mesma forma, num lugar só. */
type Plano = {
  lotes: { id: string; quadraId?: string; pontos: P[] }[];
  terreno: { poligono: P[] };
  params: { testadaMin: number };
  faixaViaPublica?: P[][];
};

const variantes = variantesJulgadasDoTestfit(entrada, SEMENTE);

/**
 * O plano de uma candidata, pela PONTE do Generate — a mesma do LAB-59.
 *
 * `variantesJulgadasDoTestfit` devolve a saída do motor; quem a põe na forma do Generate é o
 * `montarParcelamentoExterno` dele. Ler `v.externo` direto da variante foi a minha primeira
 * tentativa e estourou: a variante não tem `externo`, a PONTE é que o produz.
 */
function planoDa(formato: string): Plano | null {
  const cand = variantes.find((v) => String((v as { formato?: string }).formato) === formato);
  if (!cand) return null;
  const l = montarParcelamentoExterno(
    (cand as { saida: unknown }).saida as never,
    { entrada: entrada as unknown as EntradaMotorV1 },
  );
  if (!l.conferencia.valido || !l.externo) return null;
  return l.externo.resultado as never as Plano;
}

// A divisa e as duas faixas, construídas com as funções DELE.
const linha = testadasDeFrente[0]!;
const pa = linha[0]!;
const pb = linha[linha.length - 1]!;
const meio = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };

const primeiroPlano = planoDa(String((variantes[0] as { formato?: string })?.formato ?? ""));
if (!primeiroPlano) {
  throw new Error("nenhuma candidata atravessou a ponte do Generate — sem plano não há geometria a medir");
}
const poly = primeiroPlano.terreno.poligono;
const divisa = divisaDoAcesso(poly as never, meio as never);
if (!divisa) {
  throw new Error("o `divisaDoAcesso` do Generate não achou divisa — sem ela não há faixa, e inventá-la seria furar a §4");
}
/**
 * A COBERTURA: quanto da face entregue a faixa cobre.
 *
 * `divisaDoAcesso` devolve UM segmento do anel. Se a face entregue atravessa vários, a faixa
 * cobre a fração deste. É o número que transforma "o alcance é curto" em medição.
 */
let comprimentoDaFace = 0;
for (const l of testadasDeFrente) {
  for (let i = 0; i + 1 < l.length; i++) comprimentoDaFace += Math.hypot(l[i + 1]!.x - l[i]!.x, l[i + 1]!.y - l[i]!.y);
}
if (comprimentoDaFace <= 0) {
  throw new Error("a face entregue mede zero — sem comprimento não há cobertura, e zero aqui mentiria");
}
const coberturaPct = n2((100 * divisa.comprimento) / comprimentoDaFace);

const faixa8 = faixaViaPublica(divisa, LARGURA_DO_LAB) as P[];
const faixa10 = faixaViaPublica(divisa, LARGURA_DO_GENERATE) as P[];

const acusados: LoteAcusado[] = [];
const naoAchados: string[] = [];

for (const q of AS_QUATRO) {
  const res = planoDa(q.candidata);
  if (!res) {
    naoAchados.push(`${q.candidata}: a candidata não está entre as julgadas, ou o esquema a recusou`);
    continue;
  }
  const lote = res.lotes.find((x) => x.id === q.loteId);
  if (!lote) {
    // NÃO é zero: é falta de medição, e ela sai com o porquê medido ao lado (D23).
    const externos = res.lotes.filter((x) => x.id.includes("-e")).length;
    naoAchados.push(
      `${q.candidata}/${q.loteId}: o lote NÃO está no plano desta rodada — a candidata tem ` +
        `${res.lotes.length} lotes (${externos} externos). O LAB-59 mediu com \`motor-testfit\` em ` +
        "`4181e95` e esta rodada roda em `6cf6396`: o motor ANDOU entre as duas, e id de lote não " +
        "sobrevive a mudança de plantio. Remedir exige o commit daquela rodada, e isso é prompt",
    );
    continue;
  }
  const pts = lote.pontos;

  // A distância à face entregue e às faixas. A da via interna vem da prova do LAB-59:
  // ela é medida lá contra o contorno das vias DAQUELA rodada, e remedi-la aqui com outra
  // régua daria dois números para a mesma grandeza (D116).
  let aFaceEntregue = Infinity;
  for (const l of testadasDeFrente) {
    for (const p of pts) {
      for (let i = 0; i + 1 < l.length; i++) aFaceEntregue = Math.min(aFaceEntregue, distSeg(p, l[i]!, l[i + 1]!));
    }
  }

  acusados.push({
    chave: `${GLEBA}|${q.tipo}|${q.loteId}`,
    candidata: q.candidata,
    tipo: q.tipo,
    externo: q.loteId.includes("-e"),
    dAoContornoDaVia_m: null, // preenchido abaixo, da prova do LAB-59
    aoSegmentoDaFaceEntregue_m: n2(aFaceEntregue),
    testadaDele_m: null,
    testadaComPassoFino_m: null,
    testadaMin_m: res.params.testadaMin,
    projecaoDentroDaDivisa: projecaoDentroDaDivisa(pts, divisa.a as P, divisa.b as P),
    alemDaFaceDeclarada_m: n2(alemDaPonta(pts, divisa.a as P, divisa.b as P)),
    coberturaDaFacePct: coberturaPct,
    aFaixaDe8_m: n2(entrePoligonos(pts, faixa8)),
    aFaixaDe10_m: n2(entrePoligonos(pts, faixa10)),
  });
}

// ── Os números que o LAB-59 já mediu: lidos, não remedidos (D116) ──────────────
const prova59 = JSON.parse(
  readFileSync(join(RAIZ, "docs", "provas", "LAB-59", "contrafactual-de-antonina.json"), "utf8"),
) as { candidatas: { formato: string; oQueAsNaoNomeadasTemEmComum?: { lista?: Record<string, unknown>[] } }[] };

for (const c of prova59.candidatas) {
  for (const L of c.oQueAsNaoNomeadasTemEmComum?.lista ?? []) {
    const alvo = acusados.find((a) => a.chave === L.chave);
    if (!alvo) continue;
    alvo.dAoContornoDaVia_m = (L.dAoContornoDaVia_m as number | null) ?? null;
    alvo.testadaDele_m = (L.testadaDele_m as number | null) ?? null;
    alvo.testadaComPassoFino_m = (L.testadaComPassoFino_m as number | null) ?? null;
  }
}

const vereditos: VereditoDoLote[] = acusados.map((a) => deQuemEhAViolacao(a));
const conta = contarOsVereditos(vereditos);
if (!aContaFecha(conta)) {
  throw new Error(`a conta dos veredictos NÃO fecha: ${JSON.stringify(conta)}`);
}

// ── O que vai à tela ───────────────────────────────────────────────────────────
console.log("\n═══ LAB-78 · O SÉTIMO MECANISMO, SE ELE EXISTIR (item 011) ═══\n");
console.log(`A FAIXA: o Lab construiu ${LARGURA_DO_LAB} m; o GENERATE constrói ${LARGURA_DO_GENERATE} m`);
console.log(
  `  (\`Math.max(8, larguraEntrada / 2)\` com \`larguraEntrada = 20\` de padrão — lido do fonte dele)\n`,
);
console.log(
  `A DIVISA que o \`divisaDoAcesso\` dele escolheu: ${divisa.comprimento.toFixed(1)} m, de um anel de ` +
    `${poly.length} vértices · a face entregue tem ${linha.length} ponto(s) e ` +
    `${comprimentoDaFace.toFixed(1)} m`,
);
console.log(
  `  ► A FAIXA COBRE ${coberturaPct} % DA FACE ENTREGUE — um segmento do anel, não a face\n`,
);

if (naoAchados.length) {
  console.log("NÃO ACHADOS (e isso NÃO é zero — é falta de medição):");
  for (const n of naoAchados) console.log(`  ✗ ${n}`);
  console.log("");
}

console.log(`AS QUATRO, uma a uma (contato = ${CONTATO_m} m):\n`);
for (const v of vereditos) {
  const a = acusados.find((x) => x.chave === v.chave)!;
  console.log(`  · ${v.candidata} · ${v.chave}`);
  console.log(
    `      face entregue ${a.aoSegmentoDaFaceEntregue_m} m · via interna ${a.dAoContornoDaVia_m} m · ` +
      `faixa8 ${a.aFaixaDe8_m} m · faixa10 ${a.aFaixaDe10_m} m · ` +
      `projeção na divisa ${String(a.projecaoDentroDaDivisa)}`,
  );
  console.log(`      testada dele ${a.testadaDele_m} m · fina ${a.testadaComPassoFino_m} m · mín ${a.testadaMin_m} m`);
  console.log(`      ► ${v.veredicto.toUpperCase()} (dono: ${v.dono})`);
  console.log(`        ${v.aEvidencia}`);
  console.log("");
}

console.log(`A CONTA: ${conta.comoSeDiz}`);
console.log(`  por dono: ${JSON.stringify(conta.porDono)}`);

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "setimo-mecanismo.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-78",
      gleba: GLEBA,
      motor: "parcelamento",
      semente: SEMENTE,
      contrato: entrada.archilly.versao,
      oQueIstoMede:
        "de quem é cada uma das QUATRO violações que o LAB-59 deixou sem mecanismo em Antonina: " +
        "do plantio do motor (sétimo mecanismo) ou da faixa de via pública do Generate (largura " +
        "ou alcance). Mede a distância em METROS de cada lote à face entregue, à via interna e à " +
        "faixa nas DUAS larguras, mais a projeção do lote na extensão da divisa",
      quando: new Date().toISOString(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      aFaixa: {
        larguraQueOLabConstruiu_m: LARGURA_DO_LAB,
        larguraQueOGenerateConstroi_m: LARGURA_DO_GENERATE,
        deOndeSaiONumeroDele:
          "gerar-v1-motor.ts: faixaViaPublica(divisa, Math.max(8, larguraEntradaOrt / 2)), com " +
          "larguraEntradaOrt = params.larguraEntrada ?? PARAMS_PADRAO_V1.larguraEntrada ?? 20",
        porQueALarguraNaoPodeSerAExplicacao:
          "faixaViaPublica cola o quadrilátero do lado de FORA da divisa e o estende para fora. A " +
          "borda de dentro dela É a divisa. Alargar afasta a borda externa e não aproxima nada do " +
          "lado de dentro — por isso a largura entra como CONTROLE e tem de sair indiferente",
        aCobertura: {
          comprimentoDaFaceEntregue_m: n2(comprimentoDaFace),
          comprimentoDaDivisa_m: n2(divisa.comprimento),
          coberturaPct,
          oQueIssoQuerDizer:
            "a faixa de via pública cobre esta fração da face que a entrada entrega. O resto da " +
            "face não tem faixa nenhuma na frente — e lote plantado ali não tem como ter frente",
        },
        aDivisaEscolhida: {
          comprimento_m: n2(divisa.comprimento),
          a: divisa.a,
          b: divisa.b,
          escolhidaPor: "divisaDoAcesso do Generate — nenhuma régua do Lab escolhe divisa aqui",
        },
      },
      contato_m: CONTATO_m,
      acusados,
      vereditos,
      conta,
      naoAchados,
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-78/setimo-mecanismo.json\n`);
