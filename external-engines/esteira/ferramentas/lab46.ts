#!/usr/bin/env bun
/**
 * LAB-46 — as TRÊS AMOSTRAGENS em Antonina: o 33 contra 1 228 é caso único?
 *
 * ```sh
 * bun run lab46
 * ```
 *
 * # A pergunta, e quem a fez
 *
 * O chat, aprovando a fila: *"medir em Antonina as três amostragens do D148 — é o que
 * decide se o 33 contra 1.228 é caso único ou a mesma troca vista de outro ângulo. **O
 * Jonny quer ver este resultado.**"*
 *
 * # O que o D148 mediu, e onde
 *
 * Em `ensaio-com-testada`, entregar a face da rua existente muda o total de lotes **com
 * sinal diferente conforme a amostragem**:
 *
 * | amostragem | sem as faces | com as faces |
 * |---|---|---|
 * | 2 variantes · espinha | 680 | 640 (**−40**) |
 * | 2 variantes · ortogonal | 441 | 437 (**−4**) |
 * | completo, 20 aceitas | 599 | 640 (**+41**) |
 *
 * **O que é estável é a FRENTE, não o total** — e a causa não é o motor: *"espinha,
 * posição 1"* não é a mesma variante num conjunto de 2 e num de 20, então o rótulo bate
 * e a geometria não (D148). **Posição no ranking é rótulo, e rótulo não é identidade.**
 *
 * # E o que o LAB-45 já respondeu, antes deste prompt
 *
 * Metade da pergunta caiu com a regeração da tabela (D159): em `geo-antonina` o partido
 * que o ranking escolheu tem **33 lotes, e os 33 são EXTERNOS** — `faceDeRua: null` em
 * todos, 29 acusados pelo invariante `frente` do Generate. **O plano não tem um único
 * lote no miolo**, e os 33 somam 1,03 ha (~310 m² cada): a leitura *"produto de poucos
 * lotes grandes"* já estava enfraquecida.
 *
 * **O que falta, e é o que esta ferramenta mede:** se o 33 aparece nas TRÊS amostragens
 * ou só na completa. Se só na completa, ele é **artefato da escolha da variante** e não
 * do que a entrega faz com o desenho.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { contratoDasEntradas, type EntradaMinima } from "../src/gleba-v1.ts";
import {
  linhasDaEntrada,
  lotesNaTestadaDeFrente,
  oQueAEsteiraPassaPronto,
  type P,
} from "../src/motores/comum.ts";
import { FORMATOS, VARIANTES } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-46");
const SEMENTE = 20260913;
const CARIMBO = "2026-10-05T00:30:00.000Z";

/**
 * **`geo-antonina`, e só ela.** É a gleba do número do item 7.
 *
 * `antonina-com-via` **não entra**, e vai dito: ela tem **via desenhada** além da
 * testada, e a via desenhada muda o ângulo do partido (D127). Duas variáveis de uma vez
 * responderiam outra pergunta — é a disciplina do D149.
 */
const GLEBA = "geo-antonina";
const entrada: EntradaMinima = JSON.parse(
  readFileSync(join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo", `${GLEBA}.entrada.json`), "utf8"),
);

const AMOSTRAGENS = [
  { rotulo: "2 variantes · espinha", variantes: 2, formatos: ["espinha"] as const },
  { rotulo: "2 variantes · ortogonal", variantes: 2, formatos: ["ortogonal"] as const },
  { rotulo: "completo (o que o Lab publica)", variantes: VARIANTES, formatos: FORMATOS },
];

const { testadasDeFrente } = linhasDaEntrada(entrada);
const faces = oQueAEsteiraPassaPronto(entrada).facesLoteamento;

const rodar = (a: (typeof AMOSTRAGENS)[number], comAsFaces: boolean) =>
  rodarEsteira(entrada as unknown as EntradaV1, {
    semente: SEMENTE,
    variantes: a.variantes,
    aparar: true,
    formatos: [...a.formatos] as never,
    ...(comAsFaces && faces.length ? { facesLoteamento: faces } : {}),
  });

/**
 * A DISTÂNCIA de cada lote à testada — e esta função existe por um erro meu que
 * **já havia saído** (LAB-46, D161).
 *
 * No LAB-45 eu publiquei que *"os 33 lotes são, todos os 33, lotes da beira da rua que
 * já existe"*, e pus isso no item 7 do Jonny. A base era o **id** do lote: o motor
 * chama de `…-eN` os lotes da passagem externa, e eu contei nome.
 *
 * **Medido: dos 33, só 14 encostam na testada** (≤ 0,5 m). Quinze estão a **mais de
 * 50 m**, e o mais distante a **1 805,7 m** — o outro canto de uma gleba de 141,8 ha.
 *
 * > **`-eN` é rótulo. Distância é a coisa.** É a mesma família do D148 (posição no
 * > ranking não é identidade) e do D155 (comentário não é código) — e esta é a terceira
 * > vez que eu classifico pelo NOME em vez de medir.
 */
const distanciaAteATestada = (pontos: readonly P[]): number => {
  const dSeg = (p: P, a: P, b: P) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const L = dx * dx + dy * dy;
    const t = L === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L));
    return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t));
  };
  let d = Infinity;
  for (const p of pontos) {
    for (const linha of testadasDeFrente) {
      for (let i = 1; i < linha.length; i++) d = Math.min(d, dSeg(p, linha[i - 1]!, linha[i]!));
    }
  }
  return d;
};

/** As faixas de distância, declaradas — para o número não depender de um corte meu. */
const FAIXAS_M = [0.5, 1, 5, 20, 50] as const;

function porFaixaDeDistancia(lotes: readonly { pontos: P[] }[]) {
  const ds = lotes.map((l) => distanciaAteATestada(l.pontos));
  const faixas: Record<string, number> = {};
  let ant = 0;
  for (const f of FAIXAS_M) {
    faixas[`<= ${f} m`] = ds.filter((d) => d > ant && d <= f).length;
    ant = f;
  }
  faixas[`> ${ant} m`] = ds.filter((d) => d > ant).length;
  return {
    faixas,
    encostamNaTestada: ds.filter((d) => d <= FAIXAS_M[0]).length,
    distanciaMaxima_m: ds.length ? Number(Math.max(...ds).toFixed(1)) : null,
  };
}

/** A variante que o MOTOR escolhe: a de melhor posição no ranking dele. */
const escolher = (r: ReturnType<typeof rodarEsteira>) =>
  r.variantes.filter((v) => v.relatorio).sort((a, b) => a.posicaoNoMotor - b.posicaoNoMotor)[0];

const medir = (v: ReturnType<typeof escolher>) => {
  if (!v) return null;
  const s = v.saida as unknown as { lotes: { id: string; faceDeRua: string | null; pontos: P[] }[] };
  const frente = lotesNaTestadaDeFrente(s.lotes, testadasDeFrente);
  // Os lotes EXTERNOS, que o LAB-45 mostrou serem a chave do caso de Antonina.
  const externos = s.lotes.filter((l) => /-e\d+$/.test(l.id));
  return {
    formato: v.formato,
    aceitas: 0,
    lotes: s.lotes.length,
    // `lotesExternos` conta o ID (`…-eN`), que é como o motor nomeia a passagem
    // externa — e NÃO é o mesmo que "encostado na testada". A diferença é o D161.
    lotesExternos: externos.length,
    externosSemViaDoPlano: externos.filter((l) => l.faceDeRua == null).length,
    naoRotuladosComoExternos: s.lotes.length - externos.length,
    lotesNaTestada: frente?.lotes ?? null,
    // A geometria, que é o que vale: quantos de fato encostam, e por faixa.
    distanciaDosExternos: porFaixaDeDistancia(externos),
    distanciaDeTodos: porFaixaDeDistancia(s.lotes),
  };
};

console.log(`══════════ LAB-46 · as três amostragens em ${GLEBA} ══════════`);
console.log(`  testada(s) de frente: ${testadasDeFrente.length} · facesLoteamento = [${faces.join(", ")}]`);

const medicoes = AMOSTRAGENS.map((a) => {
  const rSem = rodar(a, false);
  const rCom = rodar(a, true);
  const sem = medir(escolher(rSem));
  const com = medir(escolher(rCom));
  const aceitasSem = rSem.variantes.filter((v) => v.relatorio).length;
  const aceitasCom = rCom.variantes.filter((v) => v.relatorio).length;
  console.log(
    `\n  ${a.rotulo}\n` +
      `    sem as faces: ${aceitasSem} aceita(s) · escolhida "${sem?.formato}" · ` +
      `${sem?.lotes} lotes (${sem?.lotesExternos} rotulados "-eN", ${sem?.distanciaDosExternos.encostamNaTestada} encostam na testada) · na testada ${sem?.lotesNaTestada}\n` +
      `    com as faces: ${aceitasCom} aceita(s) · escolhida "${com?.formato}" · ` +
      `${com?.lotes} lotes (${com?.lotesExternos} rotulados "-eN", ${com?.distanciaDosExternos.encostamNaTestada} encostam na testada) · na testada ${com?.lotesNaTestada}\n` +
      `    → delta do total: ${com && sem ? (com.lotes - sem.lotes > 0 ? "+" : "") + (com.lotes - sem.lotes) : "—"}` +
      `${com && com.lotesExternos === com.lotes ? "  ← TODO LOTE DO PLANO É DA PASSAGEM EXTERNA" : ""}`,
  );
  return {
    amostragem: a.rotulo,
    variantes: a.variantes,
    formatos: [...a.formatos],
    aceitasSemAsFaces: aceitasSem,
    aceitasComAsFaces: aceitasCom,
    semAsFaces: sem ? { ...sem, aceitas: aceitasSem } : null,
    comAsFaces: com ? { ...com, aceitas: aceitasCom } : null,
    deltaDeLotes: com && sem ? com.lotes - sem.lotes : null,
    oPlanoFicouSoDeLoteExterno: com ? com.lotesExternos === com.lotes : null,
  };
});

// Determinismo provado, não prometido.
const deNovo = medir(escolher(rodar(AMOSTRAGENS[2]!, true)));
const determinista = JSON.stringify(deNovo) === JSON.stringify(medicoes[2]!.comAsFaces && {
  ...medicoes[2]!.comAsFaces,
  aceitas: 0,
});
console.log(`\n  determinismo (amostragem completa, com as faces): ${determinista ? "ok" : "CONFERIR"}`);

const soNaCompleta = medicoes.filter((m) => m.oPlanoFicouSoDeLoteExterno === true).map((m) => m.amostragem);
console.log(
  `\n══════════ a resposta ══════════\n` +
    `  o plano SÓ DE LOTE EXTERNO aparece em ${soNaCompleta.length} das 3 amostragens` +
    `${soNaCompleta.length ? `: ${soNaCompleta.join("; ")}` : ""}`,
);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "antonina-tres-amostragens.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-46",
      geradoEm: CARIMBO,
      gleba: GLEBA,
      motor: "Laboratório de Parcelamento",
      semente: SEMENTE,
      contrato: contratoDasEntradas([entrada]),
      aPergunta:
        "o 33 contra 1 228 é caso único de Antonina, ou a mesma troca do D148 vista de outro ângulo?",
      oQueOLab45JaRespondeu:
        "o partido escolhido na amostragem completa tem 33 lotes, todos da passagem EXTERNA do motor (id `-eN`), 29 acusados pelo invariante `frente` do Generate, e somando 1,03 ha (~310 m² cada). A leitura `produto de poucos lotes grandes` já estava enfraquecida (D159)",
      oQueOLab45DISSE_ERRADO_eEsteCorrige:
        "eu disse que os 33 eram `todos lotes da beira da rua que já existe`, contando o ID `-eN` em vez de medir. MEDIDO: só 14 encostam na testada (<= 0,5 m); 15 estão a mais de 50 m e o mais distante a 1 805,7 m, o outro canto da gleba. `-eN` é rótulo; distância é a coisa (D161)",
      oQueNaoFoiMedido:
        "`antonina-com-via` — ela tem via desenhada ALÉM da testada, e a via desenhada muda o ângulo do partido (D127). Duas variáveis de uma vez responderiam outra pergunta",
      facesLoteamento: faces,
      medicoes,
      planoSoDeLoteExterno: { em: soNaCompleta, de: medicoes.length },
      determinista,
    },
    null,
    2,
  )}\n`,
);
console.log(`\n${join("docs", "provas", "LAB-46", "antonina-tres-amostragens.json")}`);
