#!/usr/bin/env bun
/**
 * LAB-25 — a guarda que impede a quarta vez. (03/10/2026)
 *
 * ```sh
 * bun run lab25
 * ```
 *
 * # O que esta ferramenta mede
 *
 * **1 · As duas pontes do Lab, campo a campo, em cinco glebas.** Para cada
 * campo que o motor publica, para onde ele foi: atravessou, foi traduzido, é
 * perda declarada, ou é mecânica interna. O que não couber em nenhuma das
 * quatro é achado, e o teste reprova.
 *
 * **2 · O que o conserto do `faceDeRua` trouxe.** A guarda achou, na primeira
 * rodada, que a ponte do Laboratório de Parcelamento jogava fora a via de frente
 * que o motor mede desde o T02 dele. Consertado, a pergunta seguinte é de
 * medição, não de fé: **o número que estava sendo descartado estava certo?**
 *
 * A resposta vem de graça, porque o Generate **não acredita** no `faceDeRua` que
 * recebe — ele recalcula com a régua do próprio invariante
 * (`motor-v1/traducao.ts`, `faceMaisProxima`). São duas réguas independentes
 * medindo a mesma coisa, e aqui elas são postas uma contra a outra.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import { paraSaida } from "@generate/contratos/motor-v1/traducao.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import { emLinhas, reprovam, type Achado } from "../src/guarda-da-ponte.ts";
import { auditarParcelamento, auditarSymbios } from "../src/guarda-em-acao.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-25");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CONTRATO = "2";

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
];

/**
 * As duas réguas do `faceDeRua`, uma contra a outra.
 *
 * A do motor vem no campo. A do Generate vem de `paraSaida`, a função com que
 * **ele** escreve o campo para os planos dele: ela calcula `faceMaisProxima`
 * sobre a mesma faixa de leito do invariante. O caminho é
 * SAÍDA nossa → `paraResultado` → `paraSaida`, e os ids de via sobrevivem à
 * volta, medido — sem isso a comparação não teria como casar.
 *
 * Nota de medição, porque ela muda a leitura: `paraResultado` **descarta** o
 * `faceDeRua` que recebe de fora, e `paraSaida` o recalcula. Ou seja, o Generate
 * nunca confia no campo de um motor externo. Isso não torna o campo inútil —
 * quem o lê é a tela, a exportação e o Orçamento —, mas significa que encher o
 * campo **não muda o veredito do Judge**, e o relatório tem de dizer isso em
 * vez de vender ganho que não houve.
 *
 * O que interessa aqui não é "quem está certo", é **quanto as duas concordam**.
 * As réguas são diferentes de propósito: a do motor é *um dos dois lados do
 * comprimento da testada* (`face.ts` dele), e a do Generate é *a faixa de leito
 * mais perto de qualquer vértice do lote*. Num lote de esquina as duas podem
 * escolher ruas diferentes, e as duas estão certas.
 */
function duasReguas(entrada: EntradaMinima) {
  const r = rodarTestfit(entrada, SEMENTE);
  if (!r.saida) return null;
  const saida = r.saida as { lotes: { id: string; faceDeRua: string | null }[] };
  const l = montarParcelamentoExterno(saida as never, {
    entrada: entrada as unknown as EntradaMotorV1,
  });
  if (!l.conferencia.valido || !l.externo) {
    return { recusa: l.conferencia.erros.slice(0, 3) };
  }
  const deles = paraSaida(l.externo.resultado, {
    motor: { nome: "regua-do-generate", versao: "0" },
    crs: (r.saida as unknown as { crs: never }).crs,
  });
  const doGenerate = new Map<string, string | null>(
    deles.lotes.map((x) => [x.id, x.faceDeRua]),
  );
  // A comparação casa por ID de via, então o que ela precisa é que o CONJUNTO de
  // ids sobreviva à volta — e não a ordem.
  //
  // Medido, porque a primeira versão deste campo comparou a ordem e acusou
  // "os ids não batem" em `completo` e em `geo-antonina`: o `paraResultado`
  // classifica uma das vias como principal e o `paraSaida` emite
  // `[...principal, ...secundarias]`, o que sobe aquela via para a frente da
  // lista (em `completo`, a V19). Os 26 ids são os mesmos 26. Comparar ordem
  // onde o casamento é por nome teria virado um achado inventado — a §6 de novo,
  // agora contra a minha própria régua de conferência.
  const ordenado = (v: { id: string }[]) => JSON.stringify(v.map((x) => x.id).sort());
  const nossasVias = (r.saida as unknown as { vias: { id: string }[] }).vias;
  const idsDeViaBatem = ordenado(deles.vias) === ordenado(nossasVias);
  const aOrdemDasViasMuda =
    JSON.stringify(deles.vias.map((v) => v.id)) !== JSON.stringify(nossasVias.map((v) => v.id));

  let publicados = 0;
  let nulosNaPonte = 0;
  let concordam = 0;
  let divergem = 0;
  let soOMotor = 0;
  let soOGenerate = 0;
  const exemplos: { lote: string; ponte: string | null; generate: string | null }[] = [];

  for (const lote of saida.lotes) {
    const g = doGenerate.get(lote.id) ?? null;
    if (lote.faceDeRua == null) nulosNaPonte++;
    else publicados++;
    if (lote.faceDeRua != null && g != null) {
      if (lote.faceDeRua === g) concordam++;
      else {
        divergem++;
        if (exemplos.length < 5) exemplos.push({ lote: lote.id, ponte: lote.faceDeRua, generate: g });
      }
    } else if (lote.faceDeRua != null) soOMotor++;
    else if (g != null) soOGenerate++;
  }

  return {
    idsDeViaBatem,
    aOrdemDasViasMuda,
    lotes: saida.lotes.length,
    publicadosPelaPonte: publicados,
    nulosNaPonte,
    concordam,
    divergem,
    soAPonteMediu: soOMotor,
    soOGenerateMediu: soOGenerate,
    concordanciaEntreOsQueAsDuasMediram:
      concordam + divergem > 0 ? Number(((100 * concordam) / (concordam + divergem)).toFixed(2)) : null,
    exemplosDeDivergencia: exemplos,
  };
}

const porGleba: Record<string, unknown> = {};
const todosOsAchados: Achado[] = [];

for (const { id, entrada } of GLEBAS) {
  console.log(`\n══════════ ${id} ══════════`);
  const pontes = [auditarParcelamento(entrada, SEMENTE), auditarSymbios(wasm, entrada, SEMENTE)];
  for (const p of pontes) {
    todosOsAchados.push(...p.achados);
    const r = reprovam(p.achados);
    console.log(
      `  ${p.ponte.padEnd(14)} amostras ${JSON.stringify(p.amostras)} · ` +
        `${r.length === 0 ? "nada descartado em silêncio" : `${r.length} ACHADO(S) QUE REPROVAM`}`,
    );
    for (const linha of emLinhas(r)) console.log(`     ${linha}`);
  }
  const faces = duasReguas(entrada);
  if (faces && "concordam" in faces) {
    console.log(
      `  faceDeRua · ponte publica ${faces.publicadosPelaPonte}/${faces.lotes}, ` +
        `o Generate concorda em ${faces.concordam} e diverge em ${faces.divergem} ` +
        `(${faces.concordanciaEntreOsQueAsDuasMediram ?? "—"} %)`,
    );
  } else if (faces) {
    console.log(`  faceDeRua · o esquema do Generate recusou: ${JSON.stringify(faces.recusa)}`);
  }
  porGleba[id] = {
    pontes: pontes.map((p) => ({
      ponte: p.ponte,
      amostras: p.amostras,
      achados: p.achados,
      reprovam: reprovam(p.achados).length,
    })),
    faceDeRua: faces,
  };
}

const porRegra = {
  "campo-vazio": todosOsAchados.filter((a) => a.regra === "campo-vazio").length,
  "campo-novo": todosOsAchados.filter((a) => a.regra === "campo-novo").length,
  "mapa-velho": todosOsAchados.filter((a) => a.regra === "mapa-velho").length,
};

writeFileSync(
  join(SAIDA, "guarda-da-ponte.json"),
  JSON.stringify(
    {
      prompt: "LAB-25",
      geradoEm: "2026-10-03",
      semente: SEMENTE,
      contrato: CONTRATO,
      pontesAuditadas: ["parcelamento", "symbios"],
      porRegra,
      reprovamNoTotal: reprovam(todosOsAchados).length,
      glebas: porGleba,
    },
    null,
    2,
  ) + "\n",
);

console.log(
  `\n${JSON.stringify(porRegra)} · reprovam: ${reprovam(todosOsAchados).length}\n` +
    `docs/provas/LAB-25/guarda-da-ponte.json`,
);
