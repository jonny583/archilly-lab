/**
 * ════════════════════════════════════════════════════════════════════════════
 *  item 003 · FERRAMENTA E TRAVA NÃO PEGAM A MESMA COISA — medido por sabotagem.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O recado do LAB-66 disse que em duas das quatro sabotagens os dois instrumentos divergiram.
 * O chat concordou com a frase e recusou o lugar dela: *"recado não é contrato — amanhã alguém
 * roda só uma das duas e conclui que está coberto."*
 *
 * Esta ferramenta **refaz as quatro sabotagens de verdade**, no arquivo de verdade, rodando os
 * dois instrumentos em processo separado, e ainda mede a largura da divergência da nº 2 varrendo
 * os 61 relatórios um a um. Uso: `bun run lab70`
 *
 * # O arquivo volta ao que era, e isso é conferido por hash
 *
 * Ela escreve no `docs/relatorios/RECADOS.md`, que é **registro**. O texto original é lido para
 * a memória antes de qualquer coisa, devolvido num `finally`, e o `sha256` é comparado no fim —
 * se não bater, ela **reprova** dizendo isso. *Sabotagem que não desfaz a si mesma é estrago.*
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  O_QUE_NINGUEM_PEGA,
  SABOTAGENS,
  VERIFICACOES,
  aIntersecao,
  soDa,
} from "../src/escopo-dos-instrumentos.ts";

const ESTEIRA = join(import.meta.dirname, "..");
const RAIZ = join(ESTEIRA, "..", "..");
const RECADOS = join(RAIZ, "docs", "relatorios", "RECADOS.md");
const PROVA_66 = join(RAIZ, "docs", "provas", "LAB-66", "o-acumulado-dos-recados.json");
const PROVA = join(RAIZ, "docs", "provas", "item-003");

const original = readFileSync(RECADOS, "utf8");
const prova66Original = readFileSync(PROVA_66, "utf8");
const hash = (t: string) => createHash("sha256").update(t).digest("hex");
const hashOriginal = hash(original);

/** A saída sem as cores do terminal. O `\x1b` vai pelo código, que o lint aceita. */
const ESCAPE = String.fromCharCode(27);
const RE_COR = new RegExp(`${ESCAPE}\\[[0-9;]*m`, "g");
const semCor = (t: string) => t.replace(RE_COR, "");

/**
 * Roda um comando e devolve o código de saída e a saída inteira, **as duas correntes**.
 *
 * *A primeira versão lia só o `stdout`, e o `bun test` escreve o resumo `18 pass` no `stderr`:
 * a corrida limpa saiu como `exit 0, 0 testes`. Zero testes é o que uma suíte que NÃO EXISTE
 * devolve — e eu ia publicar isso como linha de base.*
 */
function rodar(comando: string, args: string[]): { exit: number; saida: string } {
  const r = spawnSync(comando, args, { cwd: ESTEIRA, encoding: "utf8" });
  return { exit: r.status ?? 1, saida: semCor(`${r.stdout ?? ""}${r.stderr ?? ""}`) };
}

const TRAVAS = ["tests/recado.test.ts", "tests/classes-de-rodada.test.ts"];

function rodarAFerramenta(): { exit: number; acusacao: string } {
  const r = rodar("bun", ["ferramentas/lab66.ts"]);
  const linhas = r.saida
    .split("\n")
    .filter((l) => l.trim().startsWith("·"))
    .map((l) => l.trim().replace(/^·\s*/, ""));
  return { exit: r.exit, acusacao: linhas.join(" | ") };
}

function rodarAsTravas(): { exit: number; quantasCaem: number; quais: string[]; total: number } {
  const r = rodar("bun", ["test", ...TRAVAS]);
  const quais = [...r.saida.matchAll(/^\(fail\)\s+(.+?)(?:\s+\[[\d.]+ms\])?$/gm)].map((m) =>
    m[1]!.trim(),
  );
  /**
   * O total **não cai para zero em silêncio**. `Number(undefined ?? 0)` daria `0`, e zero é o
   * que uma suíte que **não existe** devolve: foi assim que a corrida limpa desta ferramenta
   * saiu como `exit 0, 0 testes` na primeira versão, e eu ia publicar isso como linha de base.
   */
  const quantosPassaram = Number(/(\d+) pass/.exec(r.saida)?.[1]);
  if (!Number.isFinite(quantosPassaram)) {
    throw new Error(
      "não achei o resumo `N pass` na saída do `bun test` — sem ele o total seria um zero " +
        `inventado. Saída:\n${r.saida.slice(0, 400)}`,
    );
  }
  return { exit: r.exit, quantasCaem: quais.length, quais, total: quantosPassaram + quais.length };
}

// ── As quatro sabotagens, cada uma uma transformação do texto ──────────────

/**
 * A nº 2 roda DUAS VEZES, e é isso que explica o número do LAB-66.
 *
 * O recado disse *"a nº 2 só a ferramenta"* sem dizer **qual prompt** foi apagado — e o
 * veredicto depende disso: a régua da trava tem dois escapes de texto que a da ferramenta não
 * tem, e eles salvam o arquivo em 48 dos 61 relatórios. *Número sem origem não vale*, e esta é
 * a origem que faltava.
 */
const PROMPTS_DA_N2 = { foraDosEscapes: "LAB-69", dentroDosEscapes: "LAB-66" };

/** Apaga o bloco inteiro do recado de um prompt. */
function apagarOBlocoDoRecado(texto: string, prompt: string): string {
  const re = new RegExp(
    "```\\n=== RECADO PARA O CHAT[^\\n]*\\b" + prompt + "\\b[^\\n]*\\n[\\s\\S]*?\\n```\\n",
    "g",
  );
  const novo = texto.replace(re, "");
  if (novo === texto) throw new Error(`a sabotagem não achou o bloco de ${prompt}`);
  return novo;
}

const ESTRAGOS: { n: number; estragar: (t: string) => string }[] = [
  {
    n: 1,
    estragar: (t) =>
      t.replace(
        "```\n=== RECADO PARA O CHAT",
        "```\n1. uma lista que veio ANTES do recado\n=== RECADO PARA O CHAT",
      ),
  },
  { n: 2, estragar: (t) => apagarOBlocoDoRecado(t, PROMPTS_DA_N2.foraDosEscapes) },
  { n: 2.5, estragar: (t) => apagarOBlocoDoRecado(t, PROMPTS_DA_N2.dentroDosEscapes) },
  {
    n: 3,
    estragar: (t) => {
      const novo = t.replace("· LAB-13 e LAB-14 ===", "· LAB-13 ===");
      if (novo === t) throw new Error("a sabotagem 3 não achou o cabeçalho composto");
      return novo;
    },
  },
  {
    n: 4,
    estragar: (t) => {
      const ultimo = t.lastIndexOf("=== RECADO PARA O CHAT");
      const fimDaLinha = t.indexOf("\n", ultimo);
      return `${t.slice(0, fimDaLinha + 1)}ACUMULADO — inclui uns recados aí\n${t.slice(fimDaLinha + 1)}`;
    },
  },
];

interface Resultado {
  n: number;
  /** `LAB-69` ou `LAB-66` na nº 2, que roda nos dois lados dos escapes da trava. */
  variante: string | null;
  oQue: string;
  deveriaPegar: string;
  aFerramenta: { exit: number; pegou: boolean; acusacao: string };
  asTravas: { exit: number; pegou: boolean; quantasCaem: number; total: number; quais: string[] };
  divergiu: boolean;
  oMotivoDaDiferenca: string;
}

const resultados: Resultado[] = [];
const problemas: string[] = [];

try {
  console.log("  ANTES da sabotagem:");
  writeFileSync(RECADOS, original);
  const fLimpo = rodarAFerramenta();
  const tLimpo = rodarAsTravas();
  console.log(`   ferramenta: exit ${fLimpo.exit} · travas: exit ${tLimpo.exit}, ${tLimpo.total} testes`);
  if (fLimpo.exit !== 0) problemas.push("a ferramenta já reprova o arquivo LIMPO — nada abaixo vale");
  if (tLimpo.exit !== 0) problemas.push("as travas já reprovam o arquivo LIMPO — nada abaixo vale");

  for (const { n, estragar } of ESTRAGOS) {
    const declarada = SABOTAGENS.find((s) => s.n === Math.floor(n))!;
    const variante =
      n === 2
        ? PROMPTS_DA_N2.foraDosEscapes
        : n === 2.5
          ? PROMPTS_DA_N2.dentroDosEscapes
          : null;
    writeFileSync(RECADOS, estragar(original));
    const f = rodarAFerramenta();
    const t = rodarAsTravas();
    const r: Resultado = {
      n,
      variante,
      oQue: declarada.oQue + (variante === null ? "" : ` — apagando o de ${variante}`),
      deveriaPegar: declarada.deveriaPegar,
      aFerramenta: { exit: f.exit, pegou: f.exit !== 0, acusacao: f.acusacao },
      asTravas: {
        exit: t.exit,
        pegou: t.exit !== 0,
        quantasCaem: t.quantasCaem,
        total: t.total,
        quais: t.quais,
      },
      divergiu: (f.exit !== 0) !== (t.exit !== 0),
      oMotivoDaDiferenca: declarada.oMotivoDaDiferenca,
    };
    resultados.push(r);
    console.log(
      `  nº ${n}${variante === null ? "" : ` (${variante})`} · ferramenta ${r.aFerramenta.pegou ? "ACUSOU" : "calou"} · travas ${
        r.asTravas.pegou ? `ACUSARAM (${t.quantasCaem} de ${t.total})` : `calaram (0 de ${t.total})`
      }${r.divergiu ? "   ← DIVERGIU" : ""}`,
    );
    if (!r.aFerramenta.pegou && !r.asTravas.pegou) {
      problemas.push(`a sabotagem nº ${n}${variante === null ? "" : ` (${variante})`} passou pelos DOIS instrumentos`);
    }
  }
} finally {
  writeFileSync(RECADOS, original);
  writeFileSync(PROVA_66, prova66Original);
}

if (hash(readFileSync(RECADOS, "utf8")) !== hashOriginal) {
  console.error("\n  O RECADOS.md NÃO voltou ao que era — conserte à mão antes de qualquer commit");
  process.exit(1);
}

// ── A largura da divergência da nº 2, nos 61 relatórios, em processo ───────

/**
 * A régua de `relatorio-sem-recado` nas três formas: a da ferramenta, a da trava **antes** do
 * conserto do item 003, e a da trava **agora**.
 *
 * A da trava tinha **dois escapes de texto** vindos do conserto do D217 — `recados LAB-xx` e
 * `LAB-xx,` — que casavam o nome em qualquer lugar do arquivo. Esta varredura mede a largura
 * deles nos 61 relatórios, um a um, e é o número que decidiu alinhar em vez de documentar.
 */
function aRegua(
  texto: string,
  prompt: string,
): { ferramenta: boolean; travaAntes: boolean; travaAgora: boolean } {
  const cabecalhos = texto.match(/=== RECADO PARA O CHAT — [^·]+ · (.+?) ===/g) ?? [];
  const noCabecalho = cabecalhos.some((c) => new RegExp(`\\b${prompt}\\b`).test(c));
  return {
    ferramenta: noCabecalho,
    travaAntes:
      noCabecalho || texto.includes(`recados ${prompt}`) || texto.includes(`${prompt},`),
    travaAgora: noCabecalho,
  };
}

const relatorios = readdirSync(join(RAIZ, "docs", "relatorios"))
  .map((f) => /^(LAB-\d\d)\.md$/.exec(f)?.[1])
  .filter((p): p is string => p !== undefined)
  .sort();

const escapavamAntes: string[] = [];
const escapamAgora: string[] = [];
for (const p of relatorios) {
  const estragado = apagarOBlocoDoRecado(original, p);
  const v = aRegua(estragado, p);
  if (!v.ferramenta && v.travaAntes) escapavamAntes.push(p);
  if (!v.ferramenta && v.travaAgora) escapamAgora.push(p);
}

console.log(
  `\n  a largura da divergência: apagando o recado de cada um dos ${relatorios.length} relatórios,`,
);
console.log(
  `  a trava deixava passar ${escapavamAntes.length} que a ferramenta acusa; agora deixa ${escapamAgora.length}`,
);
console.log(`  os ${escapavamAntes.length}: ${escapavamAntes.join(", ")}`);

// ── A sabotagem DA GUARDA: ela reprova, e isso se prova estragando-a ──────
/**
 * *Régua nova nasce estreita demais, e às vezes larga demais — ela precisa **aprovar o caso bom
 * E reprovar o caso ruim**, os dois demonstrados.* O caso bom é a suíte verde acima. Estes são
 * os três casos ruins, um por invariante da guarda do item 003.
 */
const DOC = join(RAIZ, "docs", "referencia", "FERRAMENTA_E_TRAVA.md");
const DECL = join(ESTEIRA, "src", "escopo-dos-instrumentos.ts");
const docOriginal = readFileSync(DOC, "utf8");
const declOriginal = readFileSync(DECL, "utf8");

const SABOTAGENS_DA_GUARDA: { oQue: string; arquivo: string; de: string; para: string }[] = [
  {
    oQue: "o documento deixa de citar uma das treze verificações",
    arquivo: DOC,
    de: "responde aos **cinco campos** do formato",
    para: "responde ao que precisa",
  },
  {
    oQue: "a declaração passa a contar um teste de menos na âncora da rodada",
    arquivo: DECL,
    de: "quantosTestes: 9,",
    para: "quantosTestes: 8,",
  },
  {
    oQue: "o documento fica com o total VELHO de verificações",
    arquivo: DOC,
    de: "**Treze** verificações",
    para: "**Doze** verificações",
  },
];

const daGuarda: { oQue: string; exit: number; reprovou: boolean; quais: string[] }[] = [];
try {
  const limpo = rodar("bun", ["test", "tests/escopo-dos-instrumentos.test.ts"]);
  if (limpo.exit !== 0) problemas.push("a guarda do item 003 já reprova o caso BOM");
  for (const sab of SABOTAGENS_DA_GUARDA) {
    const base = sab.arquivo === DOC ? docOriginal : declOriginal;
    if (!base.includes(sab.de)) throw new Error(`a sabotagem da guarda não achou: ${sab.de}`);
    writeFileSync(sab.arquivo, base.replace(sab.de, sab.para));
    const r = rodar("bun", ["test", "tests/escopo-dos-instrumentos.test.ts"]);
    const quais = [...r.saida.matchAll(/^\(fail\)\s+(.+?)(?:\s+\[[\d.]+ms\])?$/gm)].map((m) =>
      m[1]!.trim(),
    );
    daGuarda.push({ oQue: sab.oQue, exit: r.exit, reprovou: r.exit !== 0, quais });
    console.log(`  guarda · ${sab.oQue}: exit ${r.exit}`);
    if (r.exit === 0) problemas.push(`a guarda NÃO reprovou: ${sab.oQue}`);
    writeFileSync(sab.arquivo, base);
  }
} finally {
  writeFileSync(DOC, docOriginal);
  writeFileSync(DECL, declOriginal);
}
if (
  hash(readFileSync(DOC, "utf8")) !== hash(docOriginal) ||
  hash(readFileSync(DECL, "utf8")) !== hash(declOriginal)
) {
  console.error("\n  o documento ou a declaração NÃO voltaram ao que eram — conserte à mão");
  process.exit(1);
}

const divergiram = resultados.filter((r) => r.divergiu);

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "escopo-dos-instrumentos.json"),
  `${JSON.stringify(
    {
      prompt: "item 003 da caixa de entrada",
      oQueIstoMede:
        "o escopo da ferramenta contra o escopo da trava, com as quatro sabotagens refeitas " +
        "de verdade e nomeando qual instrumento acusou cada uma",
      aPergunta:
        "do chat: a frase do recado do LAB-66 está certa, mas mora num recado — ninguém lê " +
        "recado antes de rodar um instrumento só",
      quando: new Date().toISOString(),
      oNomeQueNaoSeSupoe: {
        oItemChamou: "npm run quebrar",
        existeNesteRepositorio: false,
        oNomeDeVerdade: "npm run lab66 (external-engines/esteira/ferramentas/lab66.ts)",
        comoConferi: "os dois package.json do repositório; nenhum declara o script `quebrar`",
      },
      oEscopo: {
        verificacoes: VERIFICACOES.length,
        naIntersecao: aIntersecao().map((v) => v.id),
        soDaFerramenta: soDa("ferramenta").map((v) => v.id),
        soDaTrava: soDa("trava").map((v) => v.id),
        oAchadoDaConta:
          "a ferramenta REPROVA exatamente a interseção: tudo que é só dela é medição, " +
          "não reprovação. Quem roda só a ferramenta não ganha nenhuma verificação que a " +
          "trava não tenha — ganha dois números",
      },
      asQuatroSabotagens: resultados,
      quantasDivergiram: divergiram.length,
      quaisDivergiram: divergiram.map((r) => r.n),
      aLarguraDaDivergencia: {
        oQue:
          "apagando o bloco do recado de cada relatório, em quantos a régua da TRAVA deixava " +
          "passar o que a régua da FERRAMENTA acusa",
        relatoriosVarridos: relatorios.length,
        escapavamAntesDoConserto: escapavamAntes.length,
        escapamAgora: escapamAgora.length,
        quaisEscapavam: escapavamAntes,
        aCausa:
          "os dois escapes de texto que o conserto do D217 deu à trava — `recados LAB-xx` e " +
          "`LAB-xx,` — e que a ferramenta não tem",
        oConserto:
          "saíram no item 003 (D232). O caso que o D217 queria salvar — o cabeçalho composto " +
          "`LAB-13 e LAB-14` — já é salvo pela borda de palavra DENTRO do campo `<prompt>`, e " +
          "o teste «a trava do recado ausente REPROVA de verdade» prova os dois lados",
      },
      aGuardaREPROVA: {
        oQue:
          "régua precisa aprovar o caso bom E reprovar o caso ruim, os dois demonstrados. O " +
          "caso bom é a suíte verde; estes são os três casos ruins",
        osCasosRuins: daGuarda,
        oDocumentoEADeclaracaoVoltaram: true,
      },
      oQueNinguemPega: O_QUE_NINGUEM_PEGA,
      oRecadosVoltouAoQueEra: true,
      ondeLer: "docs/referencia/FERRAMENTA_E_TRAVA.md",
      problemas,
    },
    null,
    2,
  )}\n`,
);

console.log(`\n  divergiram: ${divergiram.length} de ${resultados.length} — nº ${divergiram.map((r) => r.n).join(", nº ")}`);
console.log(`  docs/provas/item-003/escopo-dos-instrumentos.json`);
if (problemas.length > 0) {
  console.error(`\n  ${problemas.length} PROBLEMA(S):`);
  for (const p of problemas) console.error(`   · ${p}`);
  process.exit(1);
}
console.log("  o RECADOS.md voltou ao que era (sha256 conferido) · zero problemas");
