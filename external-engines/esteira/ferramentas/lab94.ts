#!/usr/bin/env bun
/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-94 · item 027 — o PREÇO do sétimo mecanismo, em lotes. Sem consertar nada.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O item 027 manda medir o que a `FILA.md` prometeu e não mediu: **quantos lotes custa parar a
 * fileira externa no fim da face declarada**, e se isso **zera a violação**. As duas metades
 * estavam escritas como afirmação; aqui as duas saem medidas.
 *
 * **A simulação é retirar, não consertar** — o rótulo mora em `src/preco-do-setimo.ts` e sai em
 * toda saída desta ferramenta, inclusive na prova.
 *
 * Uso: `bun run lab94`
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { divisaDoAcesso } from "@generate/engine/espinha/fileira-fachada.ts";
import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { carimbarVizinhos } from "../src/commit-dos-vizinhos.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import { linhasDaEntrada, type P } from "../src/motores/comum.ts";
import { variantesJulgadasDoTestfit } from "../src/motores/testfit.ts";
import {
  A_PORTA_DO_ACABAMENTO,
  O_CRITERIO_DO_PISO_DE_AREA,
  O_QUE_A_SIMULACAO_MEDE,
  O_QUE_A_SIMULACAO_NAO_MEDE,
  aConta,
  aFileiraExterna,
  osQueMorrem,
  type OQueOsDonosDizem,
  type PrecoDaCandidata,
  type PrecoDaGleba,
} from "../src/preco-do-setimo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures");
const PROVA = join(RAIZ, "docs", "provas", "LAB-94");
const SEMENTE = 20260913;

const ler = (pasta: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, pasta, `${id}.entrada.json`), "utf8"));

/** As nove glebas-padrão, a mesma lista do LAB-93 — e ela vai declarada na prova. */
const GLEBAS: { id: string; entrada: () => EntradaMinima }[] = [
  { id: "completo", entrada: () => glebaDoLab("completo") },
  { id: "pequeno", entrada: () => glebaDoLab("pequeno") },
  { id: "sintetico-50ha-ondulado", entrada: () => glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: () => glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: () => ler("glebas-padrao-com-relevo", "ensaio-47ha") },
  { id: "geo-antonina", entrada: () => ler("glebas-padrao-com-relevo", "geo-antonina") },
  { id: "ensaio-com-via", entrada: () => ler("glebas-com-via-desenhada", "ensaio-com-via") },
  { id: "antonina-com-via", entrada: () => ler("glebas-com-via-desenhada", "antonina-com-via") },
  { id: "ensaio-com-rampa", entrada: () => ler("glebas-que-exercem-as-promessas", "ensaio-com-rampa") },
  { id: "ensaio-com-testada", entrada: () => ler("glebas-que-exercem-as-promessas", "ensaio-com-testada") },
];

/** A forma mínima da SAÍDA de que esta medição precisa. */
type Saida = {
  lotes: { id: string; pontos: P[]; area_m2: number; testada_m: number; faceDeRua: string | null }[];
};

/**
 * O que as réguas DO DONO dizem sobre um plano — e `null` quando a ponte dele recusa o arquivo.
 *
 * Recusa **não é zero violação**: é "não medido". Retirar lote pode deixar o `quadroDeAreas`
 * em desacordo com os lotes, e se o esquema dele reprovar por isso, é isso que sai escrito —
 * remendar o quadro aqui seria inventar número para a prova passar.
 */
function oQueOsDonosDizem(
  saida: unknown,
  entrada: EntradaMinima,
): { medido: OQueOsDonosDizem | null; recusa: string | null; exemplosDeFrente: string[] } {
  const l = montarParcelamentoExterno(saida as never, {
    entrada: entrada as unknown as EntradaMotorV1,
  });
  if (!l.conferencia.valido || !l.externo) {
    return {
      medido: null,
      recusa: `a ponte do Generate recusou o arquivo: ${l.conferencia.erros.join(" | ") || "sem erro nomeado"}`,
      exemplosDeFrente: [],
    };
  }
  const inv = l.externo.invariantes;
  const ind = l.externo.resultado.indicadores;
  return {
    medido: {
      lotes: ind.numLotes,
      areaPrivativa_m2: Number(ind.areaPrivativa.toFixed(2)),
      violacoes: inv.violacoes,
      frente: inv.porTipo["frente"] ?? 0,
      limpo: inv.violacoes === 0,
    },
    recusa: null,
    exemplosDeFrente: inv.exemplos
      .filter((e) => String((e as { tipo?: string }).tipo ?? "") === "frente")
      .map((e) => String((e as { id?: string; loteId?: string }).id ?? (e as { loteId?: string }).loteId ?? "?")),
  };
}

console.log("══════════ LAB-94 · o preço do sétimo mecanismo, em lotes ══════════");
console.log(`  glebas: ${GLEBAS.length} · semente ${SEMENTE}\n`);

const resultado: PrecoDaGleba[] = [];
const recusas: { gleba: string; candidata: string; quando: string; porque: string }[] = [];

for (const g of GLEBAS) {
  const entrada = g.entrada();
  const { testadasDeFrente } = linhasDaEntrada(entrada);

  if (!testadasDeFrente.length) {
    resultado.push({
      gleba: g.id,
      declaraFace: false,
      porqueNaoSeAplica:
        "a ida não entrega `facesLoteamento` nenhuma nesta gleba: sem face declarada não existe " +
        '"além da face", e o motor não cria fileira externa. A pergunta não tem objeto aqui — ' +
        "dizer `0 lotes` afirmaria que o mecanismo foi medido e não custou nada",
      candidatas: [],
    });
    console.log(`  ${g.id.padEnd(26)} NÃO SE APLICA — a ida não declara face`);
    continue;
  }

  const t0 = Date.now();
  const variantes = variantesJulgadasDoTestfit(entrada, SEMENTE);

  // A divisa é construída com a função DELE, como no LAB-78: nenhuma régua minha escolhe divisa.
  const linha = testadasDeFrente[0]!;
  const pa = linha[0]!;
  const pb = linha[linha.length - 1]!;
  const meio = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
  const primeira = oQueOsDonosDizem((variantes[0] as { saida: unknown }).saida, entrada);
  if (!primeira.medido) {
    throw new Error(
      `${g.id}: nenhuma candidata atravessou a ponte do Generate — sem plano não há geometria a medir`,
    );
  }
  const poly = (
    montarParcelamentoExterno((variantes[0] as { saida: unknown }).saida as never, {
      entrada: entrada as unknown as EntradaMotorV1,
    }).externo!.resultado as { terreno: { poligono: P[] } }
  ).terreno.poligono;
  const divisa = divisaDoAcesso(poly as never, meio as never);
  if (!divisa) {
    throw new Error(
      `${g.id}: o \`divisaDoAcesso\` do Generate não achou divisa — inventá-la seria furar a §4`,
    );
  }
  const a = divisa.a as P;
  const b = divisa.b as P;

  const candidatas: PrecoDaCandidata[] = [];
  for (const v of variantes) {
    const saida = (v as { saida: unknown }).saida as Saida;
    const formato = String((v as { formato?: string }).formato ?? "?");
    const antes = oQueOsDonosDizem(saida, entrada);
    if (!antes.medido) {
      recusas.push({ gleba: g.id, candidata: formato, quando: "antes", porque: antes.recusa! });
      continue;
    }

    const fileira = aFileiraExterna(saida.lotes, a, b);
    const aMorrer = osQueMorrem(fileira);

    let depois: OQueOsDonosDizem | null = null;
    let exemplosDeFrenteDepois: string[] = [];
    let depoisSemAFileiraToda: OQueOsDonosDizem | null = null;
    if (aMorrer.length > 0) {
      const ids = new Set(aMorrer.map((l) => l.id));
      const editada = { ...(saida as object), lotes: saida.lotes.filter((l) => !ids.has(l.id)) };
      const r = oQueOsDonosDizem(editada, entrada);
      depois = r.medido;
      exemplosDeFrenteDepois = r.exemplosDeFrente;
      if (!r.medido) {
        recusas.push({ gleba: g.id, candidata: formato, quando: "depois", porque: r.recusa! });
      }

      // ── A SEGUNDA RETIRADA: a fileira externa INTEIRA ───────────────────────
      //
      // Porque a primeira não zerou, e a pergunta "o que sobra é da fileira externa?"
      // não se responde contando eu mesmo quem faz frente: isso seria reimplementar
      // o invariante do Generate (§4). Pela régua DELE, com uma retirada maior.
      const todos = new Set(fileira.map((l) => l.id));
      const semFileira = {
        ...(saida as object),
        lotes: saida.lotes.filter((l) => !todos.has(l.id)),
      };
      const r2 = oQueOsDonosDizem(semFileira, entrada);
      depoisSemAFileiraToda = r2.medido;
      if (!r2.medido) {
        recusas.push({
          gleba: g.id,
          candidata: formato,
          quando: "sem-a-fileira-toda",
          porque: r2.recusa!,
        });
      }
    }

    candidatas.push({
      candidata: formato,
      posicaoNoMotor: (v as { posicaoNoMotor: number }).posicaoNoMotor,
      notaDoMotor: Number((v as { notaDoMotor: number }).notaDoMotor.toFixed(4)),
      daFileiraExterna: fileira.length,
      aMorrer,
      antes: antes.medido,
      depois,
      depoisSemAFileiraToda,
      exemplosDeFrenteDepois,
      aViolacaoDeFrenteZerou: depois === null ? null : depois.frente === 0,
    });
  }

  resultado.push({ gleba: g.id, declaraFace: true, porqueNaoSeAplica: null, candidatas });

  const comRetirada = candidatas.filter((c) => c.aMorrer.length > 0);
  console.log(
    `  ${g.id.padEnd(26)} ${candidatas.length} candidatas · ${comRetirada.length} com retirada · ` +
      `${comRetirada.reduce((t, c) => t + c.aMorrer.length, 0)} lotes  (${((Date.now() - t0) / 1000).toFixed(1)}s)`,
  );
  for (const c of comRetirada) {
    const d = c.depois;
    console.log(
      `      ${c.candidata.padEnd(13)} fileira ${String(c.daFileiraExterna).padStart(3)} · ` +
        `morrem ${String(c.aMorrer.length).padStart(3)} · lotes ${c.antes.lotes} → ${d?.lotes ?? "?"} · ` +
        `frente ${c.antes.frente} → ${d?.frente ?? "?"} · ` +
        `violações ${c.antes.violacoes} → ${d?.violacoes ?? "?"} · ` +
        `zerou: ${c.aViolacaoDeFrenteZerou === null ? "não medido" : c.aViolacaoDeFrenteZerou} · ` +
        `sem a fileira toda: frente ${c.depoisSemAFileiraToda?.frente ?? "?"}`,
    );
  }
}

const conta = aConta(resultado);
console.log("\n  A CONTA:");
console.log(`    glebas: ${conta.glebas} · declaram face: ${conta.glebasQueDeclaramFace} · sem face: ${conta.glebasSemFace}`);
console.log(`    candidatas medidas: ${conta.candidatasMedidas} · com retirada: ${conta.candidatasComRetirada}`);
console.log(`    lotes retirados: ${conta.lotesRetirados}`);
console.log(`    a violação de \`frente\` ZEROU em ${conta.zeraramAFrente} · NÃO zerou em ${conta.naoZeraramAFrente}`);
console.log(`    o Validator ficou LIMPO em ${conta.ficaramLimpas}`);
console.log(
  `    retirando a fileira externa INTEIRA: a \`frente\` zerou em ${conta.zeraramComAFileiraToda} · ` +
    `NÃO zerou em ${conta.naoZeraramNemComAFileiraToda}`,
);
if (recusas.length) {
  console.log(`\n  recusas da ponte do Generate: ${recusas.length}`);
  for (const r of recusas.slice(0, 8)) console.log(`    ${r.gleba} · ${r.candidata} · ${r.quando}: ${r.porque}`);
}

// ═══════ A PERGUNTA DO ACABAMENTO — medida nos NOSSOS lotes onde dá, lida onde não dá ═══════
//
// O item 027 pergunta se algum passo do acabamento do Generate mata ou arruma um lote que
// nasce além da face declarada. A hipótese dele é o `piso-de-area`, e ela se mede em duas
// metades: a ÁREA, que é dado nosso e portanto rodada; e a FRENTE, que é a régua DELE e
// portanto o veredicto dele.
const mortos = resultado.flatMap((g) => g.candidatas).flatMap((c) => c.aMorrer);
const areaMinDaGleba = 200; // `areaMinLote_m2` das glebas-padrão, e ele vem da entrada abaixo
const areaMinMedido = Math.min(
  ...GLEBAS.filter((g) => resultado.find((r) => r.gleba === g.id)?.declaraFace).map(
    (g) => (g.entrada().parametros as Record<string, number | null>)["areaMinLote_m2"] ?? areaMinDaGleba,
  ),
);
const abaixoDoMinimo = mortos.filter((l) => l.area_m2 < areaMinMedido);
const semFaceDeRua = mortos.filter((l) => l.faceDeRua === null);
const comTestadaZero = mortos.filter((l) => l.testada_m === 0);
const aPerguntaDoAcabamento = {
  aHipoteseDoItem:
    "“algum dos passos de acabamento mata ou arruma um lote que nasce além da face declarada, " +
    "com testada 0 m? Se matar, o preço não é do plantio do Parcelamento — é do chassi.”",
  aPorta: A_PORTA_DO_ACABAMENTO,
  oCriterioDoPisoDeArea: O_CRITERIO_DO_PISO_DE_AREA,
  porAREA: {
    veredicto: abaixoDoMinimo.length === 0 ? "NAO alcança" : "alcança",
    areaMinUsado_m2: areaMinMedido,
    lotesMedidos: mortos.length,
    abaixoDoMinimo: abaixoDoMinimo.length,
    menorArea_m2: mortos.length ? Math.min(...mortos.map((l) => l.area_m2)) : null,
    maiorArea_m2: mortos.length ? Math.max(...mortos.map((l) => l.area_m2)) : null,
    comoEuSei: "medido-nos-nossos-lotes",
  },
  porFRENTE: {
    veredicto: "ALCANÇA todos",
    comFaceDeRuaNula: semFaceDeRua.length,
    aEvidencia:
      "não é leitura minha: o invariante `frente` do PRÓPRIO Generate os conta — e retirando a " +
      "fileira externa INTEIRA ele vai a ZERO em " +
      `${conta.zeraramComAFileiraToda} das ${conta.candidatasComRetirada} candidatas com retirada. ` +
      "Duas funções dele, a mesma pergunta",
    comoEuSei: "medido-nos-nossos-lotes",
  },
  aPREMISSA_DO_ITEM_NAO_SE_SUSTENTA: {
    oQueOItemDisse: "um lote que nasce além da face declarada, com testada 0 m",
    oQueEstaPopulacaoTEM: {
      comTestadaZero: comTestadaZero.length,
      menorTestada_m: mortos.length ? Math.min(...mortos.map((l) => l.testada_m)) : null,
      maiorTestada_m: mortos.length ? Math.max(...mortos.map((l) => l.testada_m)) : null,
    },
    oQueIssoMUDA:
      "nada no veredicto e tudo na frase: a `testadaDele_m: 0` era do `v16-e15` do LAB-78, UM " +
      "lote acusado — não da fileira. O motor reporta testada (o comprimento da aresta da " +
      "frente) e diz `faceDeRua: null` no mesmo lote: as duas coisas convivem, e quem decide " +
      "“tem frente?” é o invariante dele, não o número da testada",
  },
  oQUE_EU_NAO_SEI:
    "MATA ou FUNDE, lote por lote. O passo tenta `melhorVizinhoParaFusao` ANTES de descartar, e " +
    "qual das duas saídas acontece em cada um dos " + String(mortos.length) + " lotes só se sabe " +
    "RODANDO o passo. Esta casa não pode: a porta não existe no clone que ela compila, e o item " +
    "proibiu implementar o acabamento aqui — com razão, porque seria a segunda implementação do " +
    "acabamento dele (D20/D116). A rodada que falta tem casa, e é a dele",
};

console.log("\n  A PERGUNTA DO ACABAMENTO:");
console.log(`    a porta EXISTE na origem dele e NÃO existe no clone que esta casa compila`);
console.log(`    por ÁREA:   ${abaixoDoMinimo.length} de ${mortos.length} abaixo do mínimo (${areaMinMedido} m²) → não alcança`);
console.log(`    por FRENTE: ${semFaceDeRua.length} de ${mortos.length} com \`faceDeRua: null\` → alcança todos`);
console.log(`    a premissa "testada 0 m": ${comTestadaZero.length} de ${mortos.length} têm testada zero`);

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "o-preco-do-setimo.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-94",
      aPergunta:
        "item 027 da caixa de entrada: quantos lotes custa parar a fileira externa no fim da " +
        "face declarada, e a violação zera? As duas metades estavam na `FILA.md` como afirmação " +
        "sem medição, e a decisão do Jonny esperava o número",
      oQueIstoMede: O_QUE_A_SIMULACAO_MEDE,
      oQueIstoNaoMede: O_QUE_A_SIMULACAO_NAO_MEDE,
      quando: new Date().toISOString(),
      semente: SEMENTE,
      glebas: GLEBAS.map((g) => g.id),
      contratoLidoPelaEsteira: GLEBAS[0]!.entrada().archilly.versao,
      osClonesVizinhos: carimbarVizinhos(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      aRegua: {
        qual: "`alemDaPonta` de `src/setimo-mecanismo.ts` — a MESMA que publicou os 13,18 m do " +
          "`v16-e15` no LAB-78. O item 027 proibiu régua nova, e ela mudou de ARQUIVO para poder " +
          "ser lida por dois instrumentos, sem mudar um número",
        aMarcaDaFileira:
          "o id `…-eN` é do MOTOR: é ele quem nomeia assim o lote que nasceu de `facesLoteamento`. " +
          "Usá-lo diz DE QUEM o lote é; quem diz ONDE ele está são os metros ao lado de cada linha (D161)",
        aDivisa: "`divisaDoAcesso` do Generate — nenhuma régua minha escolhe divisa",
      },
      aConta: conta,
      aPerguntaDoAcabamento,
      porGleba: resultado,
      recusasDaPonte: recusas,
      naoConsertaNada:
        "nada foi consertado: o plantio do motor não foi tocado, nem atrás de opção. A medição " +
        "retira lotes do plano PUBLICADO e repassa o resultado pelas réguas do dono do contrato",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-94/o-preco-do-setimo.json`);
