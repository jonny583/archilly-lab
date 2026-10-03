#!/usr/bin/env bun
/**
 * LAB-24 — o bloco de indicadores de terreno. (03/10/2026)
 *
 * ```sh
 * bun run lab24
 * ```
 *
 * # A resposta do Jonny, e as duas metades dela
 *
 * | o quê | limite | força |
 * |---|---|---|
 * | **LOTE** | **30 %** de declividade | **lei** (6.766/1979) — **reprova** |
 * | **RUA** | **15 %** de rampa | prática dele — **só avisa** |
 *
 * Nas palavras dele: *"trecho acima pode ser resolvido com terraplenagem ou com
 * mudança de traçado, e isso é decisão de projeto com custo, que o motor não
 * toma"*.
 *
 * # Para que serve
 *
 * **Comparar planos** e **estimar terraplenagem**. Não dá nota, e na via não diz
 * "passa" nem "não passa".
 *
 * # O que mais sai daqui
 *
 * O **formato proposto** para o Generate (tela) e o Orçamento (entrada de
 * custo), em `docs/provas/LAB-24/formato-proposto.json`. Ele vai ao Generate e
 * ao Orçamento **pelo chat** — o Lab não escreve nos repositórios deles.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import type { Terreno } from "@symbios/contrato.ts";
import { montarParcelamentoExterno } from "@generate/import/parcelamento-externo.ts";
import type { EntradaMotorV1 } from "@generate/contratos/motor-v1/index.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import type { P, Rodada } from "../src/motores/comum.ts";
import { mapaDaGleba } from "../src/rampa.ts";
import {
  FONTE_DOS_LIMITES,
  LIMITE_DA_RUA_PCT,
  LIMITE_DO_LOTE_PCT,
  indicadoresDeTerreno,
} from "../src/terreno-indicadores.ts";
import { rodarGenerate } from "../src/motores/generate.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-24");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
];

const MOTORES = [
  { id: "generate-ortogonal", nome: "Generate · ortogonal" },
  { id: "generate-espinha", nome: "Generate · espinha" },
  { id: "parcelamento", nome: "Laboratório de Parcelamento" },
  { id: "symbios", nome: "Symbios + subdivisão do Lab" },
] as const;

function rodar(id: string, e: EntradaMinima): Rodada {
  if (id === "generate-ortogonal") return rodarGenerate(e, "ortogonal", CARIMBO);
  if (id === "generate-espinha") return rodarGenerate(e, "espinha", CARIMBO);
  if (id === "parcelamento") return rodarTestfit(e, SEMENTE);
  return rodarSymbios(wasm, e, SEMENTE, CARIMBO);
}

/** Vias com a largura da caixa — é ela que transforma metro em metro quadrado. */
function viasDaSaida(saida: unknown): { id: string; pontos: P[]; largura_m: number }[] {
  const s = saida as {
    vias?: { id?: string; pontos?: P[]; eixo?: P[]; largura_m?: number; caixa_m?: number }[];
  } | null;
  return (s?.vias ?? [])
    .map((v, i) => ({
      id: v.id ?? `v${i}`,
      pontos: v.eixo ?? v.pontos ?? [],
      largura_m: v.largura_m ?? v.caixa_m ?? 0,
    }))
    .filter((v) => v.pontos.length >= 2 && v.largura_m > 0);
}

/** Os lotes, pelo mesmo caminho do `julgar` — a régua é uma só. */
function lotesDaSaida(saida: unknown, entrada: EntradaMinima): { id: string; pontos: P[] }[] {
  const l = montarParcelamentoExterno(saida as never, { entrada: entrada as unknown as EntradaMotorV1 });
  if (!l.conferencia.valido || !l.externo) return [];
  return (l.externo.resultado.lotes as { id?: string; pontos: P[] }[]).map((lo, i) => ({
    id: lo.id ?? `lote-${i}`,
    pontos: lo.pontos,
  }));
}

console.log(
  `[LAB-24] LOTE acima de ${LIMITE_DO_LOTE_PCT} % REPROVA (lei) · ` +
    `RUA acima de ${LIMITE_DA_RUA_PCT} % é AVISO (prática do Jonny)`,
);

const linhas: Record<string, unknown>[] = [];

for (const { id, entrada } of GLEBAS) {
  const { terreno } = glebaParaOSymbios(entrada);
  const mapa = mapaDaGleba(terreno as Terreno);
  console.log(`\n══════════ ${id} ══════════`);

  const porMotor: Record<string, unknown> = {};
  for (const m of MOTORES) {
    const r = rodar(m.id, entrada);
    const vias = viasDaSaida(r.saida);
    const lotes = r.saida ? lotesDaSaida(r.saida, entrada) : [];
    const ind = indicadoresDeTerreno(vias, lotes, mapa);
    porMotor[m.id] = { motor: m.nome, indicadores: ind };

    if (!ind.medido) {
      console.log(`  ${m.nome.padEnd(30)} NÃO MEDIDO — ${ind.porQueNaoMedido}`);
      continue;
    }
    const v = ind.via;
    const lo = ind.lote;
    console.log(
      `  ${m.nome.padEnd(30)} VIA: ${v ? `${v.comprimentoAcimaDoLimite_m.toFixed(0)} m e ` +
        `${v.areaAcimaDoLimite_m2.toFixed(0)} m² acima de ${LIMITE_DA_RUA_PCT} % ` +
        `(${v.pctDoComprimento.toFixed(1)} % do comprimento, ${v.pctDaArea.toFixed(1)} % da área)` : "—"}`,
    );
    console.log(
      `  ${" ".padEnd(30)} LOTE: ${lo ? `${lo.areaAcimaDoLimite_m2.toFixed(0)} m² acima de ${LIMITE_DO_LOTE_PCT} % ` +
        `(${lo.pctDaArea.toFixed(2)} % da área vendável) · ${lo.lotesComParteAcima} lotes com parte acima, ` +
        `${lo.lotesPrincipalmenteAcima} na maior parte · ${lo.reprovaPelaLei ? "REPROVA pela lei" : "não reprova"}` : "—"}`,
    );
    if (v?.pior) {
      console.log(`  ${" ".padEnd(30)} pior trecho de via: ${v.pior.valor_pct} % em ${v.pior.id} · (${v.pior.onde.x}, ${v.pior.onde.y})`);
    }
    if (lo?.pior) {
      console.log(`  ${" ".padEnd(30)} pior lote: ${lo.pior.valor_pct} % em ${lo.pior.id} · (${lo.pior.onde.x}, ${lo.pior.onde.y})`);
    }
  }

  linhas.push({ prompt: "LAB-24", gleba: id, semente: SEMENTE, contrato: "1", motores: porMotor });
}

writeFileSync(
  join(SAIDA, "terreno.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-24",
      geradoEm: CARIMBO,
      semente: SEMENTE,
      contrato: "1",
      limites: {
        lote_pct: LIMITE_DO_LOTE_PCT,
        rua_pct: LIMITE_DA_RUA_PCT,
        forca: {
          lote: "REPROVA — é limite legal",
          rua: "AVISA — não reprova; o trecho se resolve com terraplenagem ou mudança de traçado",
        },
        fonte: FONTE_DOS_LIMITES,
      },
      paraQueServe: ["comparar planos", "estimar terraplenagem"],
      oQueNaoFaz:
        "não calcula volume de corte e aterro: isso pede o greide projetado, que nenhum motor da família entrega. " +
        "O que sai aqui é a área e o comprimento SUJEITOS a terraplenagem, que é a entrada do cálculo.",
      glebas: linhas,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
// ── o formato proposto, com uma instância de verdade dentro ───────────────
//
// Uma proposta de formato sem exemplo preenchido é um convite a interpretar
// errado. Este arquivo leva o esquema E o caso medido de `completo`, que é a
// única gleba onde os dois limites têm o que dizer.
const exemplo = (linhas.find((l) => l.gleba === "completo")?.motores as Record<string, { indicadores: unknown }>)?.[
  "generate-espinha"
]?.indicadores;

writeFileSync(
  join(SAIDA, "formato-proposto.json"),
  `${JSON.stringify(
    {
      archilly: { schema: "archilly-indicadores-de-terreno", versao: "1" },
      proposto_por: "archilly-lab · LAB-24 · 03/10/2026",
      vai_ao_generate_e_ao_orcamento: "pelo chat — o Lab não escreve nos repositórios deles",
      paraQuemServeCadaCampo: {
        tela_do_generate: [
          "via.pctDoComprimento e via.pctDaArea — um número por plano, comparável entre motores",
          "lote.reprovaPelaLei — a única linha que dá veredito, e dá porque é lei",
          "via.pior e lote.pior — têm `onde`, para a tela destacar o ponto no desenho",
        ],
        entrada_de_custo_do_orcamento: [
          "via.areaAcimaDoLimite_m2 — m² de leito sujeito a terraplenagem",
          "via.comprimentoAcimaDoLimite_m — metros lineares, para serviço medido por metro",
          "lote.areaAcimaDoLimite_m2 — m² de lote sujeito a terraplenagem",
        ],
      },
      limites: {
        lote_pct: LIMITE_DO_LOTE_PCT,
        rua_pct: LIMITE_DA_RUA_PCT,
        forca: { lote: "REPROVA", rua: "AVISA" },
        fonte: FONTE_DOS_LIMITES,
      },
      unidades: {
        comprimento: "metro",
        area: "metro quadrado",
        declividade: "porcento",
        onde: "ponto no CRS da ENTRADA, em metros locais",
      },
      regras: [
        "`null` é NÃO MEDIDO, nunca zero — gleba sem duas cotas de relevo devolve medido=false com o motivo",
        "nenhum campo de via dá veredito: a decisão de terraplenar ou mudar o traçado é de projeto, com custo",
        "`lote.reprovaPelaLei` é o ÚNICO veredito do bloco",
        "não há volume de corte e aterro aqui: isso pede o greide projetado, que nenhum motor entrega",
      ],
      exemplo: {
        gleba: "completo",
        motor: "generate-espinha",
        indicadores: exemplo,
      },
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`\ndocs/provas/LAB-24/terreno.json`);
console.log(`docs/provas/LAB-24/formato-proposto.json`);
