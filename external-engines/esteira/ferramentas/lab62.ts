/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-62 · As três listas que esperam pelo chat — GERADAS, não digitadas.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **O pedido do chat:** *"mande AQUI, dentro do próprio recado, as três coisas que esperam
 * por mim, porque é só o recado que chega até o chat."*
 *
 * # Por que isto é uma ferramenta, e não um texto que eu escrevo
 *
 * As três listas já existem **medidas** no repositório: os onze itens abertos saem da
 * `FILA.md` pela régua do LAB-61; os seis mecanismos e as contagens por gleba saem da prova
 * do LAB-58; as formas de desligar conferência saem da prova do LAB-60. Digitá-las de novo
 * é a forma do D185 — *"número que o próprio relatório lista ao lado não se escreve de
 * memória"*, e eu publiquei *"oito"* onde eram *"cinco"* fazendo exatamente isso.
 *
 * Então os blocos que vão ao chat são **saída desta ferramenta**, e ela reprova quando a
 * conta não fecha: onze abertos, seis mecanismos, as três formas cobertas uma vez cada,
 * nenhuma afirmação nomeando artefato, e todo número citado numa afirmação conferido contra
 * a prova que o mede.
 *
 * # O achado da ordem, e ele muda a lista que o chat leva
 *
 * O chat pediu os mecanismos *"em ordem de quantas glebas cada conserto destrava"*. A prova
 * do LAB-58 publica `glebasQueEleBloqueia`, que é **em quantas glebas ele aparece** — outra
 * pergunta. Medido aqui: por **destrave sozinho**, **um** mecanismo destrava **uma** gleba e
 * os outros cinco destravam **zero**, porque as outras quatro glebas têm dois ou três
 * mecanismos cada. As duas ordens vão nomeadas.
 *
 * Uso: `bun run lab62`
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  AFIRMACOES_DA_CONFERENCIA,
  AFIRMACOES_DOS_MECANISMOS,
  afirmacaoNomeiaArtefato,
} from "../src/as-tres-listas.ts";
import { MECANISMOS } from "../src/mecanismos-das-violacoes.ts";
import { lerPropostas, tituloDe } from "../src/varredura-das-propostas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-62");

const problemas: string[] = [];
function cobrar(condicao: boolean, oQue: string): void {
  if (!condicao) problemas.push(oQue);
}

// ── Lista 1 · os itens abertos, lidos da FILA pela régua do LAB-61 ──────────
const fila = readFileSync(join(RAIZ, "docs", "prompts", "FILA.md"), "utf8");
const propostas = lerPropostas(fila);
const abertos = propostas.filter((p) => !p.riscado);

const lista1 = abertos.map((p, i) => ({
  numero: i + 1,
  linhaNaFila: p.linha,
  titulo: tituloDe(p.texto),
  motivo: p.motivo,
}));

/**
 * **Quantos itens abertos a lista tem hoje.** O chat recebeu ONZE no LAB-62; em 08/10 entraram
 * mais DOIS, da rodada do orçamento de Actions — o trabalho de CI que não pode passar (D221) e o
 * commit do clone vizinho em toda prova (D223); em 09/10 foram a QUINZE.
 *
 * **15 → 16 no LAB-78**, e o motivo é este: o conserto do **sétimo mecanismo** entrou como
 * proposta com condição `aguardando-o-jonny` (D253). *Mexer no plantio muda o desenho, e desenho
 * espera o olho do Jonny* — então a proposta nasce aberta, de propósito.
 *
 * **16 → 17 no LAB-80:** a unificação das **cinco** leituras de *"esta linha afirma ou só
 * mostra?"* entrou com `prompt-novo` (D259). O LAB-80 fez a parte que cabia numa rodada e parou —
 * as outras três leituras tocam cinco arquivos e as travas de três deles.
 *
 * O número fica **declarado aqui e cobrado**: lista que cresce sem ninguém notar é a dívida que
 * o LAB-61 achou (D205). Mudá-lo é deliberado, e vem com o motivo escrito ao lado.
 */
const ABERTOS_ESPERADOS = 17;

cobrar(
  lista1.length === ABERTOS_ESPERADOS,
  `a lista tem ${lista1.length} itens abertos e o esperado declarado é ${ABERTOS_ESPERADOS} — ` +
    "se a mudança é de propósito, mude ABERTOS_ESPERADOS com o motivo escrito",
);
cobrar(
  lista1.every((i) => i.motivo !== null),
  "há item aberto sem motivo declarado, e o pedido do chat é 'com o motivo declarado de cada um'",
);

// ── Lista 2 · os seis mecanismos, nas DUAS ordens ──────────────────────────
interface ProvaDoLab58 {
  total: number;
  mecanismos: {
    id: string;
    emUmaLinha: string;
    violacoes: number;
    glebasQueEleBloqueia: number;
    porGleba: Record<string, number>;
  }[];
  oQueBloqueiaCadaGleba: {
    gleba: string;
    violacoes: number;
    mecanismosQueABloqueiam: string[];
    doContratoDoGenerate: number;
  }[];
}
const p58 = JSON.parse(
  readFileSync(join(RAIZ, "docs", "provas", "LAB-58", "mecanismos-das-81.json"), "utf8"),
) as ProvaDoLab58;

cobrar(
  p58.mecanismos.length === 6 && MECANISMOS.length === 6,
  `são SEIS mecanismos; a prova traz ${p58.mecanismos.length} e o módulo ${MECANISMOS.length}`,
);
cobrar(
  AFIRMACOES_DOS_MECANISMOS.length === 6,
  `faltam afirmações: ${AFIRMACOES_DOS_MECANISMOS.length} para 6 mecanismos`,
);

/**
 * **Destrava sozinho** = consertar SÓ este mecanismo leva a gleba a ZERO violação.
 *
 * Uma gleba zera quando ela não tem nenhum outro mecanismo **e** não tem violação do campo
 * que falta no contrato do Generate. É esta a leitura literal de *"destrava"*, e ela não é a
 * mesma coisa que *"aparece em"*.
 */
function glebasQueOConsertoDestrava(id: string): string[] {
  return p58.oQueBloqueiaCadaGleba.filter(
    (g) =>
      g.mecanismosQueABloqueiam.includes(id) &&
      g.mecanismosQueABloqueiam.length === 1 &&
      g.doContratoDoGenerate === 0,
  ).map((g) => g.gleba);
}

const comAsDuasOrdens = p58.mecanismos.map((m) => {
  const af = AFIRMACOES_DOS_MECANISMOS.find((a) => a.mecanismo === m.id);
  if (!af) throw new Error(`mecanismo sem afirmação escrita: ${m.id}`);
  const destrava = glebasQueOConsertoDestrava(m.id);
  return {
    id: m.id,
    emUmaLinha: m.emUmaLinha,
    violacoes: m.violacoes,
    glebasEmQueAparece: m.glebasQueEleBloqueia,
    glebasQueOConsertoDestravaSOZINHO: destrava.length,
    quais: destrava,
    porGleba: m.porGleba,
    oQuePrecisaFicarVerdadeiro: af.oQuePrecisaFicarVerdadeiro,
    comQueFrequencia: af.comQueFrequencia,
    oQueNaoServe: af.oQueNaoServe,
  };
});

for (const m of comAsDuasOrdens) {
  cobrar(
    m.glebasEmQueAparece === Object.keys(m.porGleba).length,
    `${m.id}: a prova diz que aparece em ${m.glebasEmQueAparece} glebas e lista ${Object.keys(m.porGleba).length}`,
  );
}
cobrar(
  comAsDuasOrdens.reduce((s, m) => s + m.violacoes, 0) === 81,
  `os seis mecanismos somam ${comAsDuasOrdens.reduce((s, m) => s + m.violacoes, 0)} e não 81`,
);

/** Por destrave sozinho, e o empate decide por alcance e depois por violações. */
const lista2 = [...comAsDuasOrdens].sort(
  (a, b) =>
    b.glebasQueOConsertoDestravaSOZINHO - a.glebasQueOConsertoDestravaSOZINHO ||
    b.glebasEmQueAparece - a.glebasEmQueAparece ||
    b.violacoes - a.violacoes,
);
/** Por alcance — a outra leitura, e ela dá outra ordem. */
const porAlcance = [...comAsDuasOrdens]
  .sort((a, b) => b.glebasEmQueAparece - a.glebasEmQueAparece || b.violacoes - a.violacoes)
  .map((m) => m.id);

cobrar(
  lista2[0]!.id !== porAlcance[0]!,
  "as duas ordens deram o MESMO primeiro: então o achado desta ferramenta não existe e a " +
    "distinção entre 'aparece em' e 'destrava' não precisava ser dita",
);

// ── Lista 3 · as formas de desligar conferência, com o contexto em primeiro ─
interface ProvaDoLab60 {
  temCI: boolean;
  oLintDele: { script: string; reprovaAviso: boolean };
  totalPorRegra: Record<string, number>;
  totalPorForma: Record<string, number>;
  oTsconfigEnumerado: {
    doMotor: { chaves: number; afrouxam: { chave: string; valor: boolean }[] }[];
  };
}
const p60 = JSON.parse(
  readFileSync(join(RAIZ, "docs", "provas", "LAB-60", "configuracao-do-motor.json"), "utf8"),
) as ProvaDoLab60;

const lista3 = AFIRMACOES_DA_CONFERENCIA.map((a) => ({ ...a }));

cobrar(lista3.length === 4, `a lista 3 é o contexto + as três formas: ${lista3.length} linhas`);
cobrar(lista3[0]!.formaDoLAB60 === null, "o chat pediu o 'não tem CI' em PRIMEIRO, e ele não está");
for (const forma of ["nao-pode-reprovar", "desligada", "sem-motivo-escrito"]) {
  cobrar(
    lista3.filter((l) => l.formaDoLAB60 === forma).length === 1,
    `a forma \`${forma}\` do LAB-60 aparece ${lista3.filter((l) => l.formaDoLAB60 === forma).length} vezes na lista 3, e tem de aparecer uma`,
  );
}

/** Os números que as afirmações citam, conferidos contra a prova que os mede (D185). */
cobrar(p60.temCI === false, "a prova do LAB-60 já diz que o motor TEM CI — a linha 1 ficou velha");
cobrar(
  p60.oLintDele.reprovaAviso === false,
  "a prova do LAB-60 diz que o lint dele JÁ reprova aviso — a linha 2 ficou velha",
);
cobrar(
  p60.totalPorRegra["regra-em-warn"] === 1,
  `a linha 2 diz '1 regra em warn' e a prova mede ${p60.totalPorRegra["regra-em-warn"]}`,
);
cobrar(
  p60.totalPorRegra["regra-em-off"] === 1,
  `a linha 3 fala de regra em off e a prova mede ${p60.totalPorRegra["regra-em-off"]}`,
);
cobrar(
  p60.oTsconfigEnumerado.doMotor[0]!.afrouxam.some((c) => c.chave === "skipLibCheck" && c.valor),
  "a linha 4 fala do desligador de conferência nas dependências e a prova não o lista mais",
);

// ── A guarda das afirmações: nenhuma nomeia artefato ───────────────────────
const nomeiam: { onde: string; porque: string }[] = [];
for (const a of AFIRMACOES_DOS_MECANISMOS) {
  const m = afirmacaoNomeiaArtefato(a.oQuePrecisaFicarVerdadeiro);
  if (m) nomeiam.push({ onde: `mecanismo ${a.mecanismo}`, porque: m });
}
for (const a of AFIRMACOES_DA_CONFERENCIA) {
  const m = afirmacaoNomeiaArtefato(a.oQuePrecisaFicarVerdadeiro);
  if (m) nomeiam.push({ onde: `conferência ${a.numero}`, porque: m });
}
cobrar(
  nomeiam.length === 0,
  `afirmação que nomeia artefato: ${nomeiam.map((n) => `${n.onde} (${n.porque})`).join("; ")}`,
);

// ── Os três blocos, do jeito que vão para o chat ───────────────────────────
const b1 = [
  `=== LISTA 1 de 3 — OS ${ABERTOS_ESPERADOS} ITENS ABERTOS, com o motivo declarado ===`,
  ...lista1.map((i) => `${String(i.numero).padStart(2)}. [${i.motivo}] ${i.titulo}`),
  "=== FIM DA LISTA 1 ===",
].join("\n");

const b2 = [
  "=== LISTA 2 de 3 — OS SEIS MECANISMOS DO MOTOR ===",
  "Ordem: por quantas glebas o conserto DESTRAVA (leva a zero). O outro número, 'aparece em',",
  "dá outra ordem — está ao lado de cada um, porque não são a mesma pergunta.",
  ...lista2.flatMap((m) => [
    "",
    `${m.glebasQueOConsertoDestravaSOZINHO > 0 ? "▲" : "·"} ${m.id}` +
      ` — destrava ${m.glebasQueOConsertoDestravaSOZINHO}${m.quais.length ? ` (${m.quais.join(", ")})` : ""},` +
      ` aparece em ${m.glebasEmQueAparece}, ${m.violacoes} violações`,
    `   o que é: ${m.emUmaLinha}`,
    `   PRECISA FICAR VERDADEIRO: ${m.oQuePrecisaFicarVerdadeiro}`,
    `   com que frequência: ${m.comQueFrequencia}`,
    `   NÃO serve: ${m.oQueNaoServe}`,
  ]),
  "",
  "Por que só um destrava: as outras quatro glebas têm DOIS ou TRÊS mecanismos cada, e uma",
  "delas tem mais 11 violações do campo que falta no contrato do Generate.",
  "=== FIM DA LISTA 2 ===",
].join("\n");

const b3 = [
  "=== LISTA 3 de 3 — DESLIGAR CONFERÊNCIA NO MOTOR (o 'não tem CI' em primeiro) ===",
  ...lista3.flatMap((l) => [
    "",
    `${l.numero}. ${l.oQue}${l.formaDoLAB60 ? ` [forma: ${l.formaDoLAB60}]` : " [contexto, e vale mais que as três]"}`,
    `   PRECISA FICAR VERDADEIRO: ${l.oQuePrecisaFicarVerdadeiro}`,
    `   com que frequência: ${l.comQueFrequencia}`,
    `   NÃO serve: ${l.oQueNaoServe}`,
  ]),
  "=== FIM DA LISTA 3 ===",
].join("\n");

mkdirSync(PROVA, { recursive: true });
writeFileSync(join(PROVA, "os-tres-blocos.txt"), `${b1}\n\n${b2}\n\n${b3}\n`);
writeFileSync(
  join(PROVA, "as-tres-listas.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-62",
      oQueIstoMede:
        "as três listas que o chat pediu dentro do recado, geradas das provas que as medem e " +
        "não digitadas: os onze itens abertos da FILA, os seis mecanismos do motor nas DUAS " +
        "ordens, e o contexto + as três formas de desligar conferência dele",
      aPergunta:
        "do chat: 'mande AQUI, dentro do próprio recado, as três coisas que esperam por mim, " +
        "porque é só o recado que chega até o chat'",
      quando: new Date().toISOString(),
      asFontes: {
        lista1: "docs/prompts/FILA.md, lido pela régua do LAB-61 (lerPropostas)",
        lista2: "docs/provas/LAB-58/mecanismos-das-81.json",
        lista3: "docs/provas/LAB-60/configuracao-do-motor.json",
      },
      oAchadoDaORDEM: {
        oQueOChatPediu: "em ordem de quantas glebas cada conserto destrava",
        oQueAProvaPublica:
          "`glebasQueEleBloqueia`, que é em quantas glebas o mecanismo APARECE — outra pergunta",
        porDESTRAVE: lista2.map((m) => m.id),
        porALCANCE: porAlcance,
        oPrimeiroMuda: `por destrave é \`${lista2[0]!.id}\`; por alcance é \`${porAlcance[0]!}\``,
        quantosDestravamAlgumaCoisa: lista2.filter((m) => m.glebasQueOConsertoDestravaSOZINHO > 0)
          .length,
        porque:
          "uma gleba só zera quando o último mecanismo dela cai; quatro das cinco têm dois ou " +
          "três, e `geo-antonina` tem mais 11 violações do campo que falta no contrato",
      },
      aRegraDasAFIRMACOES: {
        deOndeVeio:
          "o chat, pelo achado da Pesquisa (LAB-63): 'cada item diz o que precisa ficar " +
          "verdadeiro, não qual arquivo mexer'",
        aGuarda:
          "`afirmacaoNomeiaArtefato` reprova afirmação com separador de caminho ou extensão de " +
          "arquivo; nome de chave de configuração e nome de passo passam, porque são a coisa e " +
          "não o endereço",
        quantasAfirmacoes: AFIRMACOES_DOS_MECANISMOS.length + AFIRMACOES_DA_CONFERENCIA.length,
        quantasNomeiamArtefato: nomeiam.length,
      },
      aTensaoDoRECADO: {
        oQueOChatPediu: "os itens abertos 'um por linha', dentro do recado (eram ONZE no LAB-62; 13 em 08/10; 15 em 09/10, com os dois do item 001)",
        oTetoQueExiste: "12 linhas, CLAUDE.md §1, com trava em tests/recado.test.ts",
        comoFoiResolvido:
          "as três listas vão em blocos de código PRÓPRIOS, logo acima do recado, copiáveis um " +
          "por um; o recado, dentro do teto, diz quantos blocos são e o que cada um carrega",
      },
      lista1: { quantos: lista1.length, itens: lista1 },
      lista2: { quantos: lista2.length, itens: lista2 },
      lista3: { quantos: lista3.length, itens: lista3 },
      osBlocos: { arquivo: "docs/provas/LAB-62/os-tres-blocos.txt", linhas: `${b1}\n\n${b2}\n\n${b3}`.split("\n").length },
      problemas,
    },
    null,
    2,
  )}\n`,
);

console.log(b1);
console.log();
console.log(b2);
console.log();
console.log(b3);
console.log();
if (problemas.length > 0) {
  console.error(`\n  ${problemas.length} PROBLEMA(S):`);
  for (const p of problemas) console.error(`   · ${p}`);
  process.exit(1);
}
console.log("  tudo conferido · docs/provas/LAB-62/{as-tres-listas.json,os-tres-blocos.txt}");
