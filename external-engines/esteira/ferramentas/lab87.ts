/**
 * ════════════════════════════════════════════════════════════════════════════
 *  AS ONZE, RECLASSIFICADAS — e "dentro" não era suficiente. (item 020, LAB-87)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ```sh
 * bun run lab87
 * ```
 *
 * O item 020 pediu as **dez** provas restantes das onze que o LAB-86 classificou como
 * *"universo DENTRO desta casa"*, e **convidou explicitamente a corrigir o denominador**:
 * *"se alguma das dez, ao ser aberta, mostrar que depende de fora, ela SAI — medição que
 * descobre que o próprio denominador estava errado é entrega, não desvio."*
 *
 * **Aberto uma a uma, o denominador estava errado — e não pelo motivo previsto.** Nenhuma
 * delas dependia de fora. O que havia era uma pergunta que a minha classificação do LAB-86
 * **nunca fez**:
 *
 * > **"O universo está dentro desta casa?" decide se recontar é BARATO. Ela não diz se
 * > recontar é POSSÍVEL, nem se é SIGNIFICATIVO.** Eu classifiquei pela conta e publiquei
 * > como se fosse pelo sentido — e *"dentro"* era necessário e não suficiente.
 *
 * As quatro classes que apareceram ao abrir, e cada uma pede coisa diferente:
 *
 * | classe | quantas | o que a recontagem significa |
 * |---|---|---|
 * | medição de ESTADO, com ferramenta | **3** | a prova afirma um número sobre a árvore de agora: recontar é a conferência. **É a forma do D287** |
 * | registro de EVENTO | **7** | a prova afirma *"eu quebrei X e o exit foi 0 → 1"*. Não há número da árvore: recontar seria **refazer a sabotagem**, outro ato |
 * | regerada pelo VERDE a cada rodada | **1** | a prova no navegador é reescrita por `conferir.sh` em toda execução: ela **não pode** ficar velha |
 *
 * 3 + 7 + 1 = **11**, e a soma fecha.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVAS = join(RAIZ, "docs", "provas");
const SAIDA = join(PROVAS, "LAB-87");
const ler = (rel: string) => readFileSync(join(RAIZ, rel), "utf8");

/** As onze que o LAB-86 pôs na classe "universo dentro desta casa". */
const AS_ONZE = [
  "LAB-04/oraculo.json",
  "LAB-31/navegador.json",
  "LAB-31/sabotagem.json",
  "LAB-52/varredura-de-chamadas.json",
  "LAB-57/varredura-de-configuracao.json",
  "LAB-58/sabotagem.json",
  "LAB-59/sabotagem.json",
  "LAB-60/sabotagem.json",
  "LAB-61/sabotagem.json",
  "LAB-63/sabotagem.json",
  "LAB-66/sabotagem.json",
] as const;

interface Classificada {
  prova: string;
  classe: "estado-com-ferramenta" | "registro-de-evento" | "regerada-pelo-verde";
  recontada: boolean;
  quando: string | null;
  porque: string;
}

const CLASSES: Classificada[] = [
  {
    prova: "LAB-57/varredura-de-configuracao.json",
    classe: "estado-com-ferramenta",
    recontada: true,
    quando: "LAB-86 (item 019)",
    porque:
      "publica o escopo da varredura de configuração sobre o `git ls-files`. Estava VELHA por " +
      "semanas (364 → 498 arquivos), e a trava conferia com limiar",
  },
  {
    prova: "LAB-52/varredura-de-chamadas.json",
    classe: "estado-com-ferramenta",
    recontada: true,
    quando: "LAB-87 (item 020)",
    porque:
      "publica o escopo da varredura de chamadas sobre todo `.ts` que existe e não é ignorado. " +
      "Estava VELHA em 40 %: 114 → 191 arquivos, 32 114 → 52 245 linhas, com QUATRO limiares na " +
      "trava. **E o universo dela é outro**: usa `--others`, então ela envelhece assim que um " +
      "arquivo EXISTE — antes de qualquer `git add`",
  },
  {
    prova: "LAB-04/oraculo.json",
    classe: "estado-com-ferramenta",
    recontada: true,
    quando: "LAB-87 (item 020)",
    porque:
      "**não tem gerador**: varrido todo `.ts` e `.sh` que o git carrega, nada a escreve — foi " +
      "escrita à mão uma vez, no PR #40, e nunca mais relida. Prova sem gerador não envelhece " +
      "por o prompt continuar trabalhando: envelhece porque NADA no mundo a obriga a concordar " +
      "com o código. A reimplementação é função pura sobre duas fixtures fixas, então a trava " +
      "recomputa e compara o `medido`; o `esperado` NÃO se reconta, porque vem de duas " +
      "implementações independentes de fora desta casa",
  },
  ...(
    [
      "LAB-31/sabotagem.json",
      "LAB-58/sabotagem.json",
      "LAB-59/sabotagem.json",
      "LAB-60/sabotagem.json",
      "LAB-61/sabotagem.json",
      "LAB-63/sabotagem.json",
      "LAB-66/sabotagem.json",
    ] as const
  ).map(
    (prova): Classificada => ({
      prova,
      classe: "registro-de-evento",
      recontada: false,
      quando: null,
      porque:
        "registra um ATO: `quebrei esta trava de propósito e o exit foi 0 → 1`. Medido, nenhuma " +
        "delas carrega número de topo sobre a árvore — não há o que recontar. Recontar seria " +
        "REFAZER a sabotagem, que é outro ato, custa o verde inteiro e mexe em arquivo. *Prova " +
        "de evento se confere pela existência e pela forma, não pela recontagem*",
    }),
  ),
  {
    prova: "LAB-31/navegador.json",
    classe: "regerada-pelo-verde",
    recontada: false,
    quando: null,
    porque:
      "o `conferir.sh` a reescreve em TODA execução (é o sétimo passo, o `.wasm` em Chromium de " +
      "verdade). Ela não pode ficar velha: o verde a regera antes de qualquer commit. *O `ms` " +
      "dela muda a cada rodada, e é ruído de relógio — não medição que ande*",
  },
];

// ── A conferência da própria lista: nada a mais, nada a menos ─────────────
const classificadas = new Set(CLASSES.map((c) => c.prova));
const faltando = AS_ONZE.filter((p) => !classificadas.has(p));
const sobrando = CLASSES.filter((c) => !(AS_ONZE as readonly string[]).includes(c.prova));
const existemNoDisco = CLASSES.filter((c) => {
  try {
    ler(`docs/provas/${c.prova}`);
    return true;
  } catch {
    return false;
  }
});

const porClasse = new Map<string, number>();
for (const c of CLASSES) porClasse.set(c.classe, (porClasse.get(c.classe) ?? 0) + 1);

console.log("══════════ LAB-87 · as onze, reclassificadas ══════════\n");
console.log("  classe                      quantas  recontadas");
for (const [classe, quantas] of porClasse) {
  const rec = CLASSES.filter((c) => c.classe === classe && c.recontada).length;
  console.log(`  ${classe.padEnd(26)} ${String(quantas).padStart(5)} ${String(rec).padStart(11)}`);
}
console.log(`  ${"TOTAL".padEnd(26)} ${String(CLASSES.length).padStart(5)} ${String(CLASSES.filter((c) => c.recontada).length).padStart(11)}`);
console.log(`\n  a lista fecha: faltando ${faltando.length}, sobrando ${sobrando.length}`);
console.log(`  todas existem no disco: ${existemNoDisco.length} de ${CLASSES.length}`);

// ── E o universo total, recontado do disco ────────────────────────────────
const todas: string[] = [];
for (const pasta of readdirSync(PROVAS, { withFileTypes: true })) {
  if (!pasta.isDirectory()) continue;
  for (const f of readdirSync(join(PROVAS, pasta.name))) {
    if (f.endsWith(".json")) todas.push(`${pasta.name}/${f}`);
  }
}
console.log(`  provas no repositório, contadas do disco: ${todas.length}`);

mkdirSync(SAIDA, { recursive: true });
const prova = {
  prompt: "LAB-87",
  oQue:
    "as ONZE provas que o LAB-86 classificou como de universo interno, abertas uma a uma e " +
    "RECLASSIFICADAS — e o denominador estava errado, pelo motivo que a classificação do LAB-86 " +
    "não perguntava",
  oQueIstoNaoMede:
    "não mede gleba e não roda motor: o objeto é o conjunto de PROVAS desta casa e o que a " +
    "recontagem significa em cada uma. Por isso está na lista declarada de exceções do §7",
  quando: new Date().toISOString(),
  oChao: { bun: Bun.version, plataforma: process.platform },
  oQueODenominadorEscondia:
    '"O universo está dentro desta casa?" decide se recontar é BARATO. Ela não diz se recontar ' +
    "é POSSÍVEL, nem se é SIGNIFICATIVO. Eu classifiquei pela conta e publiquei como se fosse " +
    'pelo sentido — "dentro" era necessário e não suficiente. Aberta uma a uma, nenhuma das dez ' +
    "dependia de fora (a hipótese que o item previu); o que havia eram TRÊS espécies diferentes " +
    "de prova dentro da mesma classe",
  asClasses: [...porClasse].map(([classe, quantas]) => ({
    classe,
    quantas,
    recontadas: CLASSES.filter((c) => c.classe === classe && c.recontada).length,
  })),
  aListaFecha: {
    asOnze: AS_ONZE.length,
    classificadas: CLASSES.length,
    faltando,
    sobrando: sobrando.map((c) => c.prova),
    todasExistemNoDisco: existemNoDisco.length === CLASSES.length,
    soma: `${[...porClasse.values()].join(" + ")} = ${CLASSES.length}`,
  },
  umaPorUma: CLASSES,
  oUniversoTotal: todas.length,
  oQueIssoDecide:
    "a forma do D287 (recontar e comparar) cabe em TRÊS provas, e as três estão recontadas: a " +
    "do LAB-57 no item 019, e a do LAB-52 e a do LAB-04 agora. As outras OITO não ficam para " +
    "depois — elas NÃO SÃO DESTA FORMA, e isso é diferente de pendência: sete registram evento " +
    "e uma é regerada pelo verde a cada rodada. *Lista que encolhe porque o item era menor do " +
    "que parecia é entrega; lista que encolhe porque alguém desistiu é dívida — e a diferença " +
    "tem de estar escrita*",
  conferidoAqui: "sim, na máquina da sessão — não no GitHub (§7)",
};
writeFileSync(join(SAIDA, "as-onze-reclassificadas.json"), `${JSON.stringify(prova, null, 2)}\n`);
console.log("\nprova: docs/provas/LAB-87/as-onze-reclassificadas.json");
