#!/usr/bin/env bun
/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-93 · item 026 — a D226 entregue, e as CINCO passagens dos `legais`.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O item 026 manda entregar os quatro campos novos de `Terreno["legais"]`, rodar
 * **as duas passagens** nas glebas-padrão e publicar o antes e o depois de cada
 * grandeza que se mover — e depois reler as **três perdas declaradas** desta ponte
 * à luz do resultado.
 *
 * São **cinco** passagens e não duas, pela razão escrita em `passagens-dos-legais.ts`:
 * duas respondem *se* algo se moveu, e só uma passagem por campo responde *qual campo*
 * moveu. A D226 entregou três de uma vez e atribuiu o delta ao campo errado.
 *
 * Uso: `bun run lab93`
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { carimbarVizinhos } from "../src/commit-dos-vizinhos.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import {
  AS_GRANDEZAS,
  AS_PASSAGENS,
  O_QUE_CADA_PASSAGEM_ENTREGA,
  aConta,
  medirAGleba,
  osDeltas,
  type MedidaDaGleba,
} from "../src/passagens-dos-legais.ts";
import {
  ONDE_ISTO_FOI_LIDO,
  OS_LEGAIS_POR_PADRAO,
  OS_QUATRO,
  O_QUE_O_CONTRATO_PUBLICA,
} from "../../testfit/adapter/src/legais-do-contrato.ts";
import { AS_TRES_SOB_SUSPEITA } from "../src/perdas-remedidas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures");
const PROVA = join(RAIZ, "docs", "provas", "LAB-93");
const SEMENTE = 20260913;

const ler = (pasta: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, pasta, `${id}.entrada.json`), "utf8"));

// ═══════ a fixture que faltava: a ÚNICA gleba que DECLARA rampa máxima ═══════
//
// Medido no LAB-93: `parametros.rampaMaxima_pct` vem `null` em **8 das 8** glebas, e
// por isso a passagem `so-rampa` entregou `null` e não mediu nada. Com a perda virando
// destino `traduzido`, a promessa passou a existir **sem gleba que a exercite** — e é
// essa a propriedade que a trava do LAB-40 cobra, nas duas direções.
//
// O valor é **8 %**, e ele é escolhido para ser DIFERENTE do corte declarado da família
// (15 %, `CORTES_DECLARADOS` do motor): com 15 a passagem entregaria exatamente o que já
// valia, e uma passagem que entrega o default mede a si mesma. Oito é **imposição
// conhecida de fixture, não regra de urbanismo** — a mesma disciplina do traçado imposto
// do LAB-17 e das fixtures do LAB-40 (D73): ela existe para ser um número contra o qual se
// mede, não para ser um bom parâmetro.
const CARIMBO = "2026-10-12T00:00:00.000Z";
const RAMPA_DA_FIXTURE = 8;

function fixtureComRampa(): EntradaMinima {
  const e = ler("glebas-padrao-com-relevo", "ensaio-47ha");
  return {
    ...e,
    projeto: { ...e.projeto, id: "ensaio-com-rampa", nome: "Ensaio 47 ha · com rampa máxima declarada" },
    archilly: {
      ...e.archilly,
      origem:
        "archilly-lab · LAB-93 · fixture: ensaio-47ha com `parametros.rampaMaxima_pct` DECLARADA " +
        `(${RAMPA_DA_FIXTURE} %) — a única gleba desta casa que o faz. Oito e não quinze de propósito: ` +
        "quinze é o corte declarado do próprio motor, e entregar o default mede a si mesmo. " +
        "Imposição conhecida de fixture, não regra de urbanismo (D73)",
      geradoEm: CARIMBO,
    } as EntradaMinima["archilly"],
    parametros: { ...e.parametros, rampaMaxima_pct: RAMPA_DA_FIXTURE },
  } as EntradaMinima;
}

const PASTA_DAS_PROMESSAS = join(FIXTURES, "glebas-que-exercem-as-promessas");
mkdirSync(PASTA_DAS_PROMESSAS, { recursive: true });
writeFileSync(
  join(PASTA_DAS_PROMESSAS, "ensaio-com-rampa.entrada.json"),
  `${JSON.stringify(fixtureComRampa(), null, 2)}\n`,
);

/** As oito glebas — a mesma lista que o LAB-40 varre, e ela vai declarada na prova. */
const GLEBAS: { id: string; entrada: () => EntradaMinima }[] = [
  { id: "completo", entrada: () => glebaDoLab("completo") },
  { id: "pequeno", entrada: () => glebaDoLab("pequeno") },
  { id: "sintetico-50ha-ondulado", entrada: () => glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: () => glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: () => ler("glebas-padrao-com-relevo", "ensaio-47ha") },
  { id: "geo-antonina", entrada: () => ler("glebas-padrao-com-relevo", "geo-antonina") },
  { id: "ensaio-com-via", entrada: () => ler("glebas-com-via-desenhada", "ensaio-com-via") },
  { id: "antonina-com-via", entrada: () => ler("glebas-com-via-desenhada", "antonina-com-via") },
  {
    id: "ensaio-com-rampa",
    entrada: () => ler("glebas-que-exercem-as-promessas", "ensaio-com-rampa"),
  },
];

console.log("══════════ LAB-93 · as cinco passagens dos `legais` ══════════");
console.log(`  glebas: ${GLEBAS.length} · passagens: ${AS_PASSAGENS.length} · semente ${SEMENTE}\n`);

const medidas: MedidaDaGleba[] = [];
for (const g of GLEBAS) {
  const t0 = Date.now();
  const m = medirAGleba(g.entrada(), g.id, SEMENTE);
  medidas.push(m);
  const desenho = m.mudaramODesenho.length ? m.mudaramODesenho.join(", ") : "NENHUMA";
  const aviso = m.soMudaramAVISO.length ? m.soMudaramAVISO.join(", ") : "nenhuma";
  console.log(
    `  ${g.id.padEnd(26)} desenho mudou em: ${desenho.padEnd(34)} só aviso: ${aviso}` +
      `  (${((Date.now() - t0) / 1000).toFixed(1)}s)`,
  );
}

const deltas = medidas.flatMap(osDeltas);
const conta = aConta(medidas);

console.log("\n  a conta, campo por campo — e “não medido” é uma das respostas:");
for (const c of conta.porCampo) {
  console.log(
    `    ${c.campo.padEnd(30)} glebas com valor: ${String(c.glebasComValor).padStart(2)}/${conta.glebas}` +
      `  desenho: ${c.mudaramODesenho}  só aviso: ${c.soMudaramAviso}  → ${c.veredicto}`,
  );
}

console.log(`\n  deltas (grandeza que se moveu): ${deltas.length}`);
for (const d of deltas) {
  console.log(
    `    ${d.gleba.padEnd(26)} ${d.passagem.padEnd(10)} ${d.grandeza.padEnd(24)} ` +
      `${String(d.antes)} → ${String(d.depois)}`,
  );
}

console.log("\n  as três perdas sob suspeita, remedidas:");
for (const p of AS_TRES_SOB_SUSPEITA) {
  console.log(`    ${p.campo.padEnd(34)} ${p.veredicto}`);
}

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "as-cinco-passagens.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-93",
      aPergunta:
        "item 026 da caixa de entrada: entregue os quatro campos de `legais` e meça as duas " +
        "passagens — e releia as três perdas declaradas desta ponte à luz do resultado",
      oQueIstoMede:
        "o que cada um dos quatro campos de `Terreno[\"legais\"]` muda quando a ponte para de " +
        "omiti-lo: cinco passagens por gleba (sem · só-caixa · só-face · só-rampa · os-três), " +
        "com a impressão digital da GEOMETRIA publicada como instrumento — e não a da rodada, " +
        "que inclui os avisos do motor e por isso muda quando nada no traçado mudou",
      quando: new Date().toISOString(),
      semente: SEMENTE,
      glebas: GLEBAS.map((g) => g.id),
      contratoLidoPelaEsteira: GLEBAS[0]!.entrada().archilly.versao,
      osClonesVizinhos: carimbarVizinhos(),
      ondeOMotorFoiLido: ONDE_ISTO_FOI_LIDO,
      oChao: { bun: Bun.version, plataforma: process.platform },

      osQuatroCampos: OS_QUATRO,
      oQueOContratoPublica: O_QUE_O_CONTRATO_PUBLICA,
      oQueAEsteiraPassaAUsar: OS_LEGAIS_POR_PADRAO,
      oQueCadaPassagemEntrega: O_QUE_CADA_PASSAGEM_ENTREGA,
      asGrandezasComparadas: AS_GRANDEZAS,

      aConta: conta,
      porGleba: medidas,
      osDeltas: deltas,
      asTresPerdasSobSuspeita: AS_TRES_SOB_SUSPEITA,

      aPerguntaDoItem: {
        houve: "a esteira compara motores sob premissa que ELA passou, ou sob o default de quem recebe?",
        resposta:
          "dos quatro campos, UM foi medido de verdade (`caixaViariaMinima_m`): entregue, o motor " +
          "ganhou aviso em 9 de 9 glebas e a GEOMETRIA ficou idêntica. Os outros dois foram " +
          "entregues e não moveram NADA, cada um por um motivo medido: `faceQuadraMax_m` já " +
          "chegava por `padroes.comprimentoQuadra` como faixa degenerada, então `min(alvo, legal)` " +
          "é `min(200, 200)`; e `rampaMaxima_pct` não tem consumidor dentro do motor — quem o lê " +
          "em `src/` é só a `cortesDoArquivo`, que ninguém em `src/` chama. E o quarto não tem de " +
          "onde vir: o `ParametrosV1` não publica a origem dele",
      },
      oQueIstoNaoAlcanca: [
        "a quarta premissa (`declividadeMaximaDeLote_pct`) não entra em passagem nenhuma: o " +
          "`ParametrosV1` não publica `declividadeMaximaLote_pct`, então não há valor a entregar " +
          "— e `null` aqui é NÃO MEDIDO, nunca zero (D23)",
        "a rampa foi medida com UMA gleba só, e ela é fixture desta casa: `ensaio-com-rampa`, " +
          "8 %. As outras oito trazem `null`. “Nada se moveu” sobre a rampa vale para esta " +
          "gleba e para este motor, e o motivo estrutural (nenhum chamador de `cortesDoArquivo` " +
          "em `src/`) é o que faz a conclusão viajar, não o número de glebas",
        "o número da D226 (rampa publicada de 21,63 % → 17,92 % em `ensaio-com-via`) NÃO foi " +
          "reproduzido: com o motor de hoje e a montagem desta casa, a geometria é idêntica nas " +
          "cinco passagens em 9 de 9 glebas. O que a D226 mediu não está medido aqui, e dizer " +
          "“era isto” sem reproduzir seria inventar a causa de um número que eu não tenho",
        "isto mede a passagem do campo, não a correção do limite: QUAL limite a competição usa " +
          "é decisão de urbanismo e está na página do Jonny",
      ],
      naoConsertaNada:
        "nenhum motor foi melhorado e nenhuma geometria foi corrigida: a ponte passou a entregar " +
        "premissa que o motor já aceitava, e o efeito medido saiu publicado nas cinco passagens",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-93/as-cinco-passagens.json`);
