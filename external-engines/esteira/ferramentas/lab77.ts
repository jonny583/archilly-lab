/**
 * LAB-77 — O ACESSO SUGERIDO: o que as glebas declaram, e o que a regra da esquina tira.
 * (item 010 + adendo)
 *
 * O item 010 pedia a curva da sensibilidade ao acesso. **O adendo do Jonny mudou a natureza
 * dele**, e com isso mudou o que esta ferramenta tem de medir primeiro:
 *
 * > *"Se o laboratório não souber hoje quais faces dão para rua, isso é a primeira coisa a
 * > medir — e pode ser que as glebas-padrão não digam, o que é um achado sobre as glebas."*
 *
 * É o que ela mede. E o resultado é esse achado.
 *
 * **Ela não roda motor nenhum**, de propósito: a sensibilidade ao acesso já é medida pelo
 * `lab28` com `sensibilidadeAoAcesso` (LAB-28), e refazer aquilo aqui criaria a segunda montagem
 * que o D116 proíbe. O que falta não é a curva — é o **universo de posições válidas**, e ele
 * depende de um dado que nenhuma gleba desta casa declara.
 *
 * Uso: `bun run lab77`
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { POSICOES_DE_ACESSO, posicoesDeAcesso } from "../src/acesso.ts";
import {
  FAIXA_EM_USO_m,
  FAIXA_QUANDO_OCUPA_A_QUADRA_m,
  PADRAO_DA_FAIXA_DE_ESQUINA_m,
  REGRAS_DO_ACESSO,
  REGUA_DA_FAIXA,
  acessosDeclaradosDe,
  avaliarPosicoes,
  contarAsDeclaracoes,
  dentroDaFaixaDeEsquina,
  limiteDaFaixaDeEsquina,
  sugerirAcesso,
  type DeclaracaoDaGleba,
} from "../src/acesso-sugerido.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import type { P } from "../src/motores/comum.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-77");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const PROMESSAS = join(RAIZ, "docs", "fixtures", "glebas-que-exercem-as-promessas");

const lerFixture = (dir: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(dir, `${id}.entrada.json`), "utf8")) as EntradaMinima;

/**
 * AS SETE GLEBAS — e são SETE, não cinco.
 *
 * O item 010 diz *"as cinco glebas-padrão"* duas vezes. A lista da tabela do LAB-19 **tem sete
 * desde o LAB-45**, e é a mesma lista que o `lab28` mede. O número do item é de um estado
 * anterior do repositório, e dizer "cinco" aqui seria publicar o universo errado — a lição que o
 * LAB-76 acabou de pagar: *conferência que não publica o tamanho do universo que leu passa
 * lendo zero*.
 */
const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: lerFixture(FIXTURES, "ensaio-47ha") },
  { id: "geo-antonina", entrada: lerFixture(FIXTURES, "geo-antonina") },
  { id: "ensaio-com-promessas", entrada: lerFixture(PROMESSAS, "ensaio-com-promessas") },
  { id: "ensaio-com-testada", entrada: lerFixture(PROMESSAS, "ensaio-com-testada") },
];

// ── 1 · O QUE CADA GLEBA DECLARA ────────────────────────────────────────────────
const declaracoes: DeclaracaoDaGleba[] = GLEBAS.map(({ id, entrada }) => {
  const acessos = acessosDeclaradosDe(entrada.acessos);
  return {
    gleba: id,
    quantosAcessos: acessos.length,
    algumAcessoDizOSegmento: acessos.some((a) => a.segmento != null),
    // Não existe campo para isto no contrato v1. É o achado, e sai `null` — não `[]`.
    facesComVia: null,
  };
});
const conta = contarAsDeclaracoes(declaracoes);

// ── 2 · O LIMITE DO QUE A REGRA DA ESQUINA TIRA ─────────────────────────────────
//
// Um TETO e um PISO, porque o dado falta. O teto é o caso em que TODO vértice é esquina de rua;
// o piso é zero, o caso em que nenhum é. O valor verdadeiro está no intervalo, e não se aperta
// sem saber quais faces dão para via.
const limites = GLEBAS.map(({ id, entrada }) => {
  const anel = entrada.gleba.anel as P[];
  return {
    gleba: id,
    vertices: anel.length,
    a15: limiteDaFaixaDeEsquina(anel, PADRAO_DA_FAIXA_DE_ESQUINA_m, 1),
    a25: limiteDaFaixaDeEsquina(anel, FAIXA_QUANDO_OCUPA_A_QUADRA_m, 1),
  };
});

// ── 3 · AS SEIS POSIÇÕES QUE O LAB-28 VARRE, CONTRA A FAIXA ─────────────────────
//
// Quantas das seis cairiam dentro da faixa **no teto** (todo vértice sendo esquina). É um limite
// superior do estrago, não uma contagem: no piso, nenhuma cai.
const varridas = GLEBAS.map(({ id, entrada }) => {
  const anel = entrada.gleba.anel as P[];
  const pontos = posicoesDeAcesso(anel, POSICOES_DE_ACESSO);
  const todos = anel.map((_, i) => i);
  const noTeto = pontos.filter((p) => dentroDaFaixaDeEsquina(p, anel, todos, FAIXA_EM_USO_m)).length;
  const declarado = acessosDeclaradosDe(entrada.acessos)[0]?.ponto ?? null;
  return {
    gleba: id,
    posicoesVarridas: pontos.length,
    dentroDaFaixaNoTeto: noTeto,
    dentroDaFaixaNoPiso: 0,
    acessoDeclarado: declarado,
    acessoDeclaradoNaFaixaNoTeto:
      declarado === null
        ? null
        : dentroDaFaixaDeEsquina(declarado as P, anel, todos, FAIXA_EM_USO_m),
  };
});

// ── 4 · A SUGESTÃO — e ela se RECUSA a sair ─────────────────────────────────────
const posicoesDeExemplo = (() => {
  const g = GLEBAS[4]!; // geo-antonina, uma das duas que declaram acesso
  const anel = g.entrada.gleba.anel as P[];
  const pontos = posicoesDeAcesso(anel, POSICOES_DE_ACESSO);
  const dele = acessosDeclaradosDe(g.entrada.acessos)[0]?.ponto;
  return avaliarPosicoes(anel, pontos, null, FAIXA_EM_USO_m, dele ? [dele as P] : []);
})();
const aSugestao = sugerirAcesso(null, 100, posicoesDeExemplo);

// ── O que vai à tela ────────────────────────────────────────────────────────────
console.log("\n═══ LAB-77 · O ACESSO SUGERIDO (item 010 + adendo) ═══\n");
console.log(`AS GLEBAS: ${conta.comoSeDiz}`);
console.log(
  `  (o item diz "as cinco glebas-padrão" — são SETE desde o LAB-45, e é a mesma lista do lab28)\n`,
);

console.log("O QUE CADA UMA DECLARA:");
for (const d of declaracoes) {
  console.log(
    `  · ${d.gleba.padEnd(26)} acessos: ${d.quantosAcessos} · segmento: ` +
      `${d.algumAcessoDizOSegmento ? "SIM" : "não"} · faces com via: ` +
      `${d.facesComVia === null ? "NÃO DECLARADO" : String(d.facesComVia.length)}`,
  );
}

console.log(`\nO LIMITE DA REGRA DA ESQUINA (régua: ${REGUA_DA_FAIXA}, faixa em uso ${FAIXA_EM_USO_m} m):`);
for (const l of limites) {
  console.log(
    `  · ${l.gleba.padEnd(26)} ${l.vertices} vértices · ${l.a15.perimetro_m} m · ` +
      `15 m → 0 a ${l.a15.tetoPctDoPerimetro} % · 25 m → 0 a ${l.a25.tetoPctDoPerimetro} %`,
  );
}

console.log(`\nAS ${POSICOES_DE_ACESSO} POSIÇÕES QUE O LAB-28 VARRE, CONTRA A FAIXA (no teto):`);
for (const v of varridas) {
  const dec =
    v.acessoDeclaradoNaFaixaNoTeto === null
      ? "não declara acesso"
      : v.acessoDeclaradoNaFaixaNoTeto
        ? "o acesso DECLARADO cairia na faixa"
        : "o acesso declarado fica fora da faixa";
  console.log(`  · ${v.gleba.padEnd(26)} ${v.dentroDaFaixaNoTeto}/${v.posicoesVarridas} na faixa · ${dec}`);
}

console.log("\nA SUGESTÃO:");
console.log(`  frase: ${aSugestao.frase ?? "— NENHUMA"}`);
console.log(`  porque não: ${aSugestao.porqueNao ?? "—"}`);

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "acesso-sugerido.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-77",
      oQueIstoMede:
        "o que as sete glebas desta casa DECLARAM sobre o acesso e sobre quais faces dão para " +
        "via pública, e o LIMITE (teto e piso) do que a regra da esquina do Jonny tira do " +
        "perímetro de cada uma. É medição de DECLARAÇÃO e de GEOMETRIA DO ANEL",
      oQueIstoNaoMede:
        "não roda motor nenhum e não mede gleba no sentido do §7: a curva da sensibilidade ao " +
        "acesso já é medida pelo lab28 (LAB-28), e refazê-la aqui seria a segunda montagem do " +
        "D116. Por isso esta prova está na lista declarada de exceções do §7",
      quando: new Date().toISOString(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      asRegrasDoJonny: REGRAS_DO_ACESSO,
      aReguaDaFaixa: REGUA_DA_FAIXA,
      qualFaixaFoiUsada: FAIXA_EM_USO_m,
      porQueEssaFaixa:
        "o adendo manda usar 15 m e DIZER que usou, em vez de adivinhar se a gleba ocupa a " +
        "quadra inteira — reconhecer isso é pendência do Jonny",
      quantasGlebas: conta,
      declaracoes,
      limites,
      varridas,
      aSugestao,
      oAchado:
        "ZERO das sete glebas declaram quais faces dão para via pública, e CINCO das sete não " +
        "declaram acesso nenhum (acessos: []). As duas que declaram trazem segmento: null, que " +
        "é justamente o campo onde a face moraria. E o achado maior: a FAIXA DE ESQUINA também " +
        "não é calculável, porque esquina é o encontro de duas RUAS e não um vértice do anel — " +
        "as duas metades do universo de posições dependem do mesmo dado que falta",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-77/acesso-sugerido.json\n`);
