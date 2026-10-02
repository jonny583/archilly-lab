#!/usr/bin/env bun
/**
 * LAB-20 — a página de comparação, para quem não programa. (02/10/2026)
 *
 * ```sh
 * bun ferramentas/lab20.ts
 * ```
 *
 * # O problema que ela resolve
 *
 * A esteira só falava por linha de comando. Tudo o que o laboratório mediu até
 * aqui — cinco glebas, quatro motores, dez prompts — só aparecia para quem
 * abrisse um terminal e rodasse um `bun`. O Jonny é arquiteto e urbanista, não
 * programador, e **o que ele não consegue abrir, para ele não existe.**
 *
 * # Por que a página é MARKDOWN, e não HTML
 *
 * Porque o GitHub **renderiza Markdown no navegador** e mostra **HTML como
 * código-fonte**. Uma página `.html` no repositório daria ao Jonny uma tela de
 * `<table>` e `<td>` — o contrário de "olhar sem abrir terminal". Markdown é o
 * meio que ele **já usa**: `PENDENCIAS_JONNY.md` é lido assim, por link.
 *
 * Servir HTML de verdade exigiria **ligar o GitHub Pages**, que é configuração
 * de repositório e não está ligada. Isso está **proposto ao chat** na
 * `FILA.md`, não feito por minha conta.
 *
 * # Por que ela é GERADA, e não escrita à mão
 *
 * Tabela copiada à mão envelhece em silêncio: a medição muda, o texto fica. Há
 * teste (`tests/pagina.test.ts`) que regera a página e **reprova se o arquivo
 * do repositório estiver diferente** — então ou ela está em dia, ou a esteira
 * fica vermelha.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ENTRADA = join(RAIZ, "docs", "provas", "LAB-19", "tabela.json");
const PAGINA = join(RAIZ, "docs", "COMPARACAO_DOS_MOTORES.md");

/** Os nomes das glebas, como uma pessoa os diria. */
const NOME_DA_GLEBA: Record<string, string> = {
  completo: "Terreno de teste completo — com áreas de preservação",
  "sintetico-50ha-ondulado": "Terreno sintético ondulado",
  "sintetico-10ha-plano": "Terreno sintético plano",
  "ensaio-47ha": "Gleba de ensaio do Archilly Generate",
  "geo-antonina": "Antonina (PR) — terreno real, levantado pelo Archilly Geo",
};

/**
 * Os nomes dos motores, como uma pessoa os diria.
 *
 * "Testfit" é nome interno (CLAUDE.md §5): aqui ele é **Laboratório de
 * Parcelamento**, e esta página é texto para o Jonny.
 */
const NOME_DO_MOTOR: Record<string, string> = {
  "generate-ortogonal": "Archilly Generate — traçado ortogonal",
  "generate-espinha": "Archilly Generate — traçado espinha de peixe",
  parcelamento: "Laboratório de Parcelamento",
  symbios: "Symbios (motor de fora) + divisão de lotes do laboratório",
};

const ORDEM = ["generate-ortogonal", "generate-espinha", "parcelamento", "symbios"] as const;

interface Forma {
  ok: number;
  aConferir: number;
  ruim: number;
  pctAConferir: number | null;
  pctRuim: number | null;
  utilMediana: number | null;
  utilPior: number | null;
  porClasse: Record<string, number>;
  comLadoCurvo: number;
}
interface MotorNaProva {
  motor: string;
  ms: number;
  naoSoubeFazer: string[];
  recusadoPeloEsquema: string[] | null;
  lotes: number | null;
  areaVendavel_m2: number | null;
  pctPrivativa: number | null;
  violacoes: number | null;
  violacoesPorRegra: Record<string, number> | null;
  sobraSemLote_m2: number | null;
  pctDaMassaSemLote: number | null;
  forma: Forma | null;
}
interface GlebaNaProva {
  gleba: string;
  areaDaGleba_m2: number;
  motores: Record<string, MotorNaProva>;
}
interface Prova {
  semente: number;
  contrato: string;
  regraDeForma: { aConferirAbaixoDe: number; ruimAbaixoDe: number };
  glebas: GlebaNaProva[];
}

const prova: Prova = JSON.parse(readFileSync(ENTRADA, "utf8"));

/** Número em português: vírgula decimal e ponto de milhar. */
function br(v: number, casas = 0): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}
const ha = (m2: number | null, casas = 2) => (m2 == null ? "—" : `${br(m2 / 1e4, casas)} ha`);
const pct = (v: number | null, casas = 1) => (v == null ? "—" : `${br(v, casas)} %`);

/** O que o Jonny vê na coluna da forma. */
function colunaDaForma(f: Forma | null): string {
  if (!f) return "—";
  if (f.aConferir === 0 && f.ruim === 0) return "**todos ok**";
  const partes: string[] = [];
  if (f.aConferir > 0) partes.push(`${br(f.aConferir)} a conferir (${pct(f.pctAConferir)})`);
  if (f.ruim > 0) partes.push(`**${br(f.ruim)} ruins (${pct(f.pctRuim)})**`);
  return partes.join(" · ");
}

const L: string[] = [];
const push = (...linhas: string[]) => L.push(...linhas);

push(
  "# Comparação dos motores de loteamento",
  "",
  "**Esta página é gerada por medição.** Ela não é escrita à mão, e não pode ficar",
  "desatualizada em silêncio: há teste que a regera e reprova se o arquivo estiver",
  "diferente do que a medição diz hoje.",
  "",
  "**Quatro motores, cinco terrenos, a mesma régua para todos.** A régua é o",
  "conferente e o contador de lotes do **Archilly Generate** — o laboratório não",
  "tem régua própria, de propósito, para não haver como passar mais fácil por ser",
  "de fora.",
  "",
  "---",
  "",
  "## Como ler os quadros",
  "",
  "| coluna | o que ela diz |",
  "|---|---|",
  "| **Lotes** | quantos lotes o motor desenhou |",
  "| **Área vendável** | a soma dos lotes, em hectares |",
  "| **Virou lote** | quanto do terreno virou lote, em porcentagem. O resto é rua, praça, área de preservação e sobra |",
  "| **Apontado pelo conferente** | quantas regras do Archilly Generate o desenho quebrou. **Zero é o alvo** |",
  "| **Terra sem lote** | terra dentro da área loteável que não virou lote nem rua. É prejuízo |",
  "| **Forma dos lotes** | ver a seção *A forma dos lotes*, logo abaixo |",
  "| **Tempo** | quanto o motor levou para desenhar |",
  "",
  "## A forma dos lotes",
  "",
  "A régua é simples: desenha-se **o menor retângulo que cabe em volta do lote**,",
  "em qualquer inclinação, e vê-se **quanto desse retângulo o lote aproveita**.",
  "Um lote retangular aproveita 100 %. Um triângulo, 50 %.",
  "",
  `- aproveita **${br(100 * prova.regraDeForma.aConferirAbaixoDe)} % ou mais** → está **ok**;`,
  `- aproveita **menos de ${br(100 * prova.regraDeForma.aConferirAbaixoDe)} %** → **a conferir**;`,
  `- aproveita **menos de ${br(100 * prova.regraDeForma.ruimAbaixoDe)} %** → **ruim**.`,
  "",
  "**Esta linha foi decidida no chat, e está esperando o seu OK** — está no item 2",
  "de [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md). Até você confirmar, ela vale",
  "para o trabalho não parar.",
  "",
  "**Atenção a uma coisa que esta coluna não faz:** ela não aprova nem reprova",
  "nada. Quem diz se uma proposta passa é o conferente do Archilly Generate, e",
  "forma de lote não é regra dele. Um motor pode ter **todos os lotes ok e muitos",
  "apontamentos do conferente** — e o contrário também acontece.",
  "",
  "---",
  "",
);

for (const g of prova.glebas) {
  const nome = NOME_DA_GLEBA[g.gleba] ?? g.gleba;
  push(
    `## ${nome}`,
    "",
    `**${br(g.areaDaGleba_m2 / 1e4, 1)} hectares** · identificação técnica do terreno: \`${g.gleba}\``,
    "",
    "| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | tempo |",
    "|---|---:|---:|---:|---:|---:|---|---:|",
  );
  for (const id of ORDEM) {
    const m = g.motores[id];
    if (!m) continue;
    if (m.recusadoPeloEsquema) {
      push(
        `| ${NOME_DO_MOTOR[id] ?? id} | — | — | — | **não entregou desenho válido** | — | — | ${br(m.ms / 1000, 1)} s |`,
      );
      continue;
    }
    push(
      `| ${NOME_DO_MOTOR[id] ?? id} | ${br(m.lotes ?? 0)} | ${ha(m.areaVendavel_m2)} | ` +
        `${pct(m.pctPrivativa)} | ${m.violacoes === 0 ? "**nenhum**" : br(m.violacoes ?? 0)} | ` +
        `${ha(m.sobraSemLote_m2)} · ${pct(m.pctDaMassaSemLote)} | ${colunaDaForma(m.forma)} | ` +
        `${br(m.ms / 1000, 1)} s |`,
    );
  }
  push("");
}

// ── O que cada motor não soube fazer ──────────────────────────────────────
push(
  "---",
  "",
  "## O que cada motor NÃO soube fazer",
  "",
  "Esta seção existe para os quadros acima não mentirem por omissão. **Dois",
  "motores que receberam o mesmo terreno podem não ter feito a mesma prova** — se",
  "um lê o relevo e o outro não, comparar os dois sem dizer isso é injusto com o",
  "que leu.",
  "",
  "**As frases são do próprio motor, não minhas.** Cada um declara o que deixou de",
  "fazer, nas palavras dele — por isso algumas são técnicas. Onde a mesma queixa",
  "apareceu com números diferentes em cada terreno, os números saíram e entrou",
  "**em quantos dos cinco terrenos** ela apareceu; os números exatos estão nos",
  `relatórios técnicos. O total de terrenos é ${prova.glebas.length}.`,
  "",
);
/**
 * Junta queixas que são a mesma coisa com números diferentes.
 *
 * Sem isto a seção virava uma lista de dez linhas quase iguais — "1 de 20
 * variantes", "13 de 20 variantes", "2 de 20 variantes" — e uma lista que o
 * leitor desiste de ler não informa nada. Agrupar é só agrupar: a frase
 * continua sendo a do motor, com os números trocados por reticências.
 */
function agruparQueixas(queixas: string[][]): { frase: string; terrenos: number }[] {
  // O número que vem depois de letra ou hífen fica: é identificador, não
  // medida. Sem esta ressalva, `D51` virava `D…` e `LAB-08` virava `LAB-…`, e
  // perder o código é perder o único ponteiro que a frase dá para o relatório.
  const NUMERO_DE_MEDIDA = /(?<![A-Za-z\d-])\d+([.,]\d+)?/g;
  const porChave = new Map<string, { frase: string; terrenos: Set<number> }>();
  for (const [i, lista] of queixas.entries()) {
    for (const q of lista) {
      const chave = q.replace(NUMERO_DE_MEDIDA, "#");
      const frase = q.replace(NUMERO_DE_MEDIDA, "…");
      const achado = porChave.get(chave);
      if (achado) achado.terrenos.add(i);
      else porChave.set(chave, { frase: frase === q ? q : frase, terrenos: new Set([i]) });
    }
  }
  return [...porChave.values()]
    .map((v) => ({ frase: v.frase, terrenos: v.terrenos.size }))
    .sort((a, b) => b.terrenos - a.terrenos || a.frase.localeCompare(b.frase, "pt-BR"));
}

for (const id of ORDEM) {
  const queixas = prova.glebas.map((g) => g.motores[id]?.naoSoubeFazer ?? []);
  const agrupadas = agruparQueixas(queixas);
  push(`**${NOME_DO_MOTOR[id] ?? id}**`, "");
  if (agrupadas.length === 0) push("- declarou ter atendido tudo o que recebeu.", "");
  else {
    for (const a of agrupadas) {
      const onde =
        a.terrenos === prova.glebas.length
          ? "em todos os terrenos"
          : `em ${a.terrenos} de ${prova.glebas.length} terrenos`;
      push(`- ${a.frase} — *${onde}*`);
    }
    push("");
  }
}

// ── O que esta página não diz ─────────────────────────────────────────────
push(
  "---",
  "",
  "## O que esta página NÃO diz",
  "",
  "**Ela não diz qual motor é o melhor.** E não é modéstia: *melhor* depende do",
  "que se quer do terreno. O motor que faz mais lotes é o que deixa mais terra",
  "sem lote; o que deixa menos sobra é o que o conferente mais aponta. Quem",
  "escolhe é você.",
  "",
  "**Ela não é uma proposta de projeto.** São desenhos de máquina, feitos com os",
  "mesmos parâmetros nos cinco terrenos para que a comparação fosse honesta —",
  "não para que algum deles fosse um bom partido urbanístico.",
  "",
  "## De onde vêm os números",
  "",
  `- **semente:** \`${prova.semente}\` — a mesma em todos, e provada: rodar duas`,
  "  vezes dá o mesmo desenho, bit por bit;",
  `- **versão do contrato de motor:** \`${prova.contrato}\`;`,
  "- **números crus:** [`provas/LAB-19/tabela.json`](provas/LAB-19/tabela.json);",
  "- **como refazer:** `bun ferramentas/lab19.ts` e depois `bun ferramentas/lab20.ts`,",
  "  dentro de `external-engines/esteira/`;",
  "- **os relatórios técnicos**, prompt por prompt: [`INDEX.md`](INDEX.md).",
  "",
);

writeFileSync(PAGINA, `${L.join("\n")}`, "utf8");
console.log(`docs/COMPARACAO_DOS_MOTORES.md · ${L.length} linhas`);
