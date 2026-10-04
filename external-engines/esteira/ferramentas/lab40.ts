#!/usr/bin/env bun
/**
 * LAB-40 — as fixtures que exercem as promessas, e a testada de frente FORA de Antonina.
 *
 * ```sh
 * bun run lab40
 * ```
 *
 * # O que estava errado
 *
 * O LAB-35 achou **quatro promessas do inventário da ida que gleba nenhuma
 * exercitava** — `parametros.calcada_m`, `atracoes[].geometria.aneis`,
 * `acessos[].segmento` e `gleba.furos` — e as provou **com entrada montada em
 * memória, dentro do teste**. O LAB-37 pagou a dívida da **testada de frente**, e
 * mediu nas **duas únicas glebas que têm testada, as duas de Antonina**, na **mesma
 * face** (a 0) e com o **mesmo comprimento** (180 m).
 *
 * O chat cobrou as duas metades: *"fixtures que exerçam as quatro promessas do
 * LAB-35 e a testada de frente fora de Antonina; sem isso tudo que você mediu vale
 * para uma gleba só."*
 *
 * **A diferença entre entrada em memória e fixture não é formal.** Entrada montada
 * no teste exercita o caminho **naquele teste**; quem roda a esteira inteira — a
 * tabela, o acesso, as duas guardas das pontes — continua sem passar por ele. Era o
 * que o próprio LAB-35 escreveu como pendência, e é o que esta ferramenta fecha.
 *
 * # As duas fixtures, e por que são duas e não uma
 *
 * As duas nascem de `ensaio-47ha` — um retângulo de **800 × 587,5 m**, 47 ha, quatro
 * vértices —, trocando **uma coisa de cada vez** sobre a mesma base. Retângulo de
 * propósito: as faces do perímetro têm índice e comprimento que se conferem de
 * cabeça, e a face é justamente o que a testada de frente endereça.
 *
 * | fixture | o que exerce |
 * |---|---|
 * | `ensaio-com-promessas` | as **quatro** promessas do LAB-35, juntas |
 * | `ensaio-com-testada` | a **testada de frente**, sozinha |
 *
 * **Separadas porque a segunda é MEDIÇÃO e a primeira é EXERCÍCIO.** O furo e a
 * atração poligonal mudam o desenho — o furo tira área, o ímã puxa o traçado —, e
 * medir *"o que a testada rende"* numa gleba com ímã responderia outra pergunta.
 * Para a promessa, o que importa é o campo **chegar**; para a testada, o que importa
 * é o **número**.
 *
 * # O que a testada desta fixture tem que a de Antonina não tinha
 *
 * - **face 1**, não a face 0 — índice diferente, e o índice é o que a ida entrega;
 * - **587,5 m** contra 180 m, numa gleba de 47 ha contra 142 ha;
 * - a linha corre **meio metro FORA da divisa**, e não sobre ela. As duas réguas que
 *   isso atravessa têm tolerâncias **diferentes e declaradas** — 1 m para classificar
 *   a linha como testada (`TOL_DIVISA_M`) e 1 m para a face contar como coberta
 *   (`TOL_DA_FACE_M`) —, e meio metro passa nas duas sem empatar com nenhuma.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { rodarEsteira } from "../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../testfit/adapter/src/contrato-v1.ts";

import { glebaDoLab } from "../src/gleba-do-lab.ts";
import type { EntradaMinima } from "../src/gleba-v1.ts";
import { auditarIdaDoParcelamento, auditarIdaDoSymbios } from "../src/guarda-em-acao.ts";
import { promessasNaoExercitadas } from "../src/guarda-da-ida.ts";
import { IDA_DO_PARCELAMENTO, IDA_DO_SYMBIOS } from "../src/inventario-das-idas.ts";
import {
  FRACAO_MINIMA_DA_FACE,
  TOL_DA_FACE_M,
  TOL_DIVISA_M,
  facesCobertasPelaLinha,
  linhasDaEntrada,
  lotesNaTestadaDeFrente,
  type P,
} from "../src/motores/comum.ts";
import { FORMATOS, VARIANTES } from "../src/motores/testfit.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FIXTURES = join(RAIZ, "docs", "fixtures");
const NOVAS = join(FIXTURES, "glebas-que-exercem-as-promessas");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-40");
const SEMENTE = 20260913;
const CARIMBO = "2026-10-04T17:00:00.000Z";
const n1 = (v: number) => Number(v.toFixed(1));

const ler = (pasta: string, id: string): EntradaMinima =>
  JSON.parse(readFileSync(join(FIXTURES, pasta, `${id}.entrada.json`), "utf8"));

const base = () => ler("glebas-padrao-com-relevo", "ensaio-47ha");

/**
 * O bloco `archilly` da fixture nova: o mesmo contrato da base, mais a procedência.
 *
 * A procedência vai no arquivo e não num `LEIA-ME` ao lado, por disciplina do D104:
 * texto que mora longe do dado não se revalida. E a **versão do contrato é a da
 * base**, nunca um literal — o D146 acabou de mostrar o que um literal escrito à
 * mão faz com uma etiqueta.
 */
const carimbar = (e: EntradaMinima, origem: string) =>
  ({ ...e.archilly, origem, geradoEm: CARIMBO }) as EntradaMinima["archilly"];

// ═══════════════ as duas fixtures, montadas sobre a mesma base ═══════════════

/**
 * O furo: um quadrado de 100 m no miolo, 10 000 m².
 *
 * **E a área declarada cai para 460 000 m², que é a área DE VERDADE da gleba.**
 * Medido antes de escolher: o adaptador do Symbios compara `areaDeclarada_m2` com
 * `areaPoligono(gleba)`, que **desconta os furos**, e avisa acima de 2 % de
 * divergência. Os 10 000 m² do furo são **2,1 %** de 470 000 — declarar a área do
 * anel passaria raspando do avisador, e seria declarar um número que eu sei errado.
 */
const FURO: P[] = [
  { x: 300, y: 200 },
  { x: 400, y: 200 },
  { x: 400, y: 300 },
  { x: 300, y: 300 },
];

/** A atração POLIGONAL — o ímã que o motor recebe como polígono, não como linha. */
const ATRACAO: P[] = [
  { x: 100, y: 100 },
  { x: 200, y: 100 },
  { x: 200, y: 200 },
  { x: 100, y: 200 },
];

/**
 * O acesso como SEGMENTO, com o MEIO exatamente no ponto que a base declarava.
 *
 * De propósito: a ida traduz segmento para o meio dele, então esta fixture troca a
 * **forma** da declaração sem mover o acesso um centímetro. Se o número mudasse,
 * a diferença seria da tradução, e não do lugar.
 */
const ACESSO_A: P = { x: 380, y: 0 };
const ACESSO_B: P = { x: 420, y: 0 };

/** A testada de frente: meio metro FORA da face 1, de ponta a ponta. */
const TESTADA: P[] = [
  { x: 800.5, y: 0 },
  { x: 800.5, y: 587.5 },
];

function fixtureComPromessas(): EntradaMinima {
  const e = base();
  return {
    ...e,
    projeto: { ...e.projeto, id: "ensaio-com-promessas", nome: "Ensaio 47 ha · com as quatro promessas" },
    archilly: carimbar(
      e,
      "archilly-lab · LAB-40 · fixture: ensaio-47ha com as QUATRO promessas do LAB-35 exercitadas — " +
        "furo da gleba (100 m, 10 000 m², área declarada 460 000 = a do anel menos o furo), " +
        "calcada_m declarada (3,5 m), atração POLIGONAL (ímã de 100 m) e acesso como SEGMENTO " +
        "(meio em x=400, y=0, o mesmo ponto que a base declarava). Geometria, não projeto de urbanismo (D73)",
    ),
    gleba: { ...e.gleba, furos: [FURO], area_m2: 460_000 },
    parametros: { ...e.parametros, calcada_m: 3.5 },
    atracoes: [
      {
        id: "AT1",
        tipo: "comercio",
        nome: "Praça de comércio (atração poligonal)",
        geometria: { tipo: "poligono", aneis: [ATRACAO] },
      },
    ] as never,
    acessos: [
      { id: "A1", nome: "Acesso principal", papel: "principal", ponto: null, segmento: { a: ACESSO_A, b: ACESSO_B }, sugerido: false },
    ] as never,
  } as EntradaMinima;
}

function fixtureComTestada(): EntradaMinima {
  const e = base();
  return {
    ...e,
    projeto: { ...e.projeto, id: "ensaio-com-testada", nome: "Ensaio 47 ha · com testada de frente" },
    archilly: carimbar(
      e,
      "archilly-lab · LAB-40 · fixture: ensaio-47ha com TESTADA DE FRENTE fora de Antonina — " +
        "linha de 587,5 m meio metro FORA da face 1 do perímetro (x=800,5). " +
        "Face diferente (1, não 0), comprimento diferente (587,5 m, não 180) e linha fora da divisa, " +
        "não sobre ela. Geometria, não projeto de urbanismo (D73)",
    ),
    atracoes: [
      {
        id: "T1",
        tipo: "via_existente",
        nome: "Testada de frente L1",
        geometria: { tipo: "linha", pontos: TESTADA },
      },
    ] as never,
  } as EntradaMinima;
}

mkdirSync(NOVAS, { recursive: true });
const AS_NOVAS = [
  { id: "ensaio-com-promessas", entrada: fixtureComPromessas() },
  { id: "ensaio-com-testada", entrada: fixtureComTestada() },
];
for (const { id, entrada } of AS_NOVAS) {
  writeFileSync(join(NOVAS, `${id}.entrada.json`), `${JSON.stringify(entrada, null, 2)}\n`);
}

console.log("══════════ LAB-40 · as fixtures que exercem as promessas ══════════");
console.log(`  escritas: ${AS_NOVAS.map((x) => x.id).join(", ")}`);

// ═══════════ as promessas: exercitadas por qual gleba do repositório ═══════════

/**
 * As sete glebas de antes, e as duas novas.
 *
 * A lista é a mesma que a guarda da ida varre, e vai declarada na prova: *"a
 * promessa está exercitada"* é afirmação sobre um CONJUNTO de glebas, e conjunto
 * que não viaja com o número envelhece.
 */
const ANTES: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "pequeno", entrada: glebaDoLab("pequeno") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: ler("glebas-padrao-com-relevo", "ensaio-47ha") },
  { id: "geo-antonina", entrada: ler("glebas-padrao-com-relevo", "geo-antonina") },
  { id: "ensaio-com-via", entrada: ler("glebas-com-via-desenhada", "ensaio-com-via") },
  { id: "antonina-com-via", entrada: ler("glebas-com-via-desenhada", "antonina-com-via") },
];

/** As quatro promessas que o LAB-35 achou sem exercício nenhum. */
const AS_QUATRO = [
  { ida: "parcelamento", campo: "parametros.calcada_m" },
  { ida: "parcelamento", campo: "atracoes[].geometria.aneis" },
  { ida: "parcelamento", campo: "acessos[].segmento" },
  { ida: "symbios", campo: "gleba.furos" },
];

/** Por gleba: quais promessas ela NÃO exercita, nas duas idas. */
const naoExercitadasEm = (e: EntradaMinima) =>
  [auditarIdaDoParcelamento(e), auditarIdaDoSymbios(e)].flatMap((r) =>
    promessasNaoExercitadas(r.achados).map((a) => `${r.ida}·${a.campo}`),
  );

const varrer = (glebas: { id: string; entrada: EntradaMinima }[]) => {
  const porGleba: Record<string, string[]> = {};
  for (const g of glebas) porGleba[g.id] = naoExercitadasEm(g.entrada);
  const exercitada = (chave: string) => glebas.filter((g) => !porGleba[g.id]!.includes(chave)).map((g) => g.id);
  return { porGleba, exercitada };
};

const antes = varrer(ANTES);
const depois = varrer([...ANTES, ...AS_NOVAS]);

console.log("\n  as quatro promessas do LAB-35, e quem as exercita:");
const promessas = AS_QUATRO.map((p) => {
  const chave = `${p.ida}·${p.campo}`;
  const a = antes.exercitada(chave);
  const d = depois.exercitada(chave);
  console.log(
    `    ${p.campo.padEnd(30)} antes: ${a.length ? a.join(", ") : "NENHUMA GLEBA"} → depois: ${d.join(", ")}`,
  );
  return { ...p, exercitadaAntesPor: a, exercitadaDepoisPor: d };
});

// ═══ e o número que vale mais que os quatro: promessa exercitada por NINGUÉM ═══
//
// Os quatro do LAB-35 eram a lista daquele dia. A pergunta que sobrevive ao prompt é
// outra: **das promessas que os dois inventários fazem, quantas nenhuma gleba do
// repositório exercita?** Essa conta sai dos INVENTÁRIOS, não dos achados — achado é
// o que falta, e eu quero o universo.
const universo = [
  ...Object.entries(IDA_DO_PARCELAMENTO).map(([campo, d]) => ({ ida: "parcelamento", campo, tipo: d.tipo })),
  ...Object.entries(IDA_DO_SYMBIOS).map(([campo, d]) => ({ ida: "symbios", campo, tipo: d.tipo })),
].filter((x) => x.tipo === "entregue" || x.tipo === "traduzido");

const semNinguem = (v: ReturnType<typeof varrer>) =>
  universo.filter((p) => v.exercitada(`${p.ida}·${p.campo}`).length === 0);

const nuncaAntes = semNinguem(antes);
const nuncaDepois = semNinguem(depois);
console.log(
  `\n  promessas dos inventários: ${universo.length} · exercitadas por NENHUMA gleba: ` +
    `${nuncaAntes.length} antes → ${nuncaDepois.length} depois`,
);
for (const p of nuncaDepois) console.log(`    ainda sem exercício: ${p.ida} · ${p.campo}`);

// ═════════════ a testada de frente, medida fora de Antonina ═════════════

const comTestada = AS_NOVAS[1]!.entrada;
const { desenhadas, testadasDeFrente } = linhasDaEntrada(comTestada);
const { faces, porFace } = facesCobertasPelaLinha(comTestada.gleba.anel, testadasDeFrente);
const comprimento = (l: P[]) =>
  l.reduce((s, p, i) => (i === 0 ? 0 : s + Math.hypot(p.x - l[i - 1]!.x, p.y - l[i - 1]!.y)), 0);

console.log(`\n══════ ensaio-com-testada · a medição ══════`);
console.log(
  `  linhas: ${testadasDeFrente.length} testada(s) de frente, ${desenhadas.length} desenhada(s)` +
    ` · régua: classificação ${TOL_DIVISA_M} m, face ${TOL_DA_FACE_M} m, fração mínima ${100 * FRACAO_MINIMA_DA_FACE} %`,
);
for (const f of porFace) {
  console.log(
    `    face ${String(f.face).padStart(2)} · ${f.comprimento_m.toFixed(1).padStart(6)} m · ` +
      `${(100 * f.fracaoCoberta).toFixed(0).padStart(3)} % ` +
      (f.fracaoCoberta >= FRACAO_MINIMA_DA_FACE ? "← ENTREGUE" : "(toque de vértice, fora)"),
  );
}
console.log(`  entregues ao motor: facesLoteamento = [${faces.join(", ")}]`);

/**
 * AS TRÊS AMOSTRAGENS — e a razão de serem três.
 *
 * Eu ia publicar *"aqui a entrega da testada NÃO custa lote"*, com uma comparação só:
 * **599 → 640, +41**. Escrita como teste, com o conjunto de variantes reduzido, a
 * mesma pergunta deu o **contrário**: **680 → 640, −40**.
 *
 * **Medido antes de atribuir (§6), e o defeito era da comparação:**
 *
 * | amostragem | sem as faces | com as faces | na testada |
 * |---|---|---|---|
 * | 2 variantes · espinha | 680 | 640 (**−40**) | 0 → 51 |
 * | 2 variantes · ortogonal | 441 | 437 (**−4**) | 2 → 50 |
 * | completo, 20 aceitas | 599 | 640 (**+41**) | 0 → 51 |
 *
 * **O que é estável é a FRENTE, não o total.** Em todas as três, a entrega põe lote
 * virado para a rua existente onde não havia nenhum. O total muda de sinal conforme a
 * amostragem — e a razão é que *"espinha, posição 1"* **não é a mesma variante** num
 * conjunto de 2 e num de 20: o rótulo bate, a geometria não. Daí os 680 e os 599 na
 * mesma gleba sem as faces.
 *
 * **Então a lição é sobre a régua, não sobre o motor:** posição no ranking é rótulo, e
 * rótulo não é identidade. Comparar totais entre amostragens diferentes compara dois
 * partidos — a mesma forma do D127 (medir o que o motor não promete) e do D133
 * (comparar onde faltava dado).
 *
 * As três vão publicadas, e o que cada uma responde vai escrito: fixada a amostragem,
 * **quanto a frente custa por dentro**; e, na completa, **o que o Lab publica**.
 */
const AMOSTRAGENS = [
  { rotulo: "2 variantes · espinha", variantes: 2, formatos: ["espinha"] as const },
  { rotulo: "2 variantes · ortogonal", variantes: 2, formatos: ["ortogonal"] as const },
  { rotulo: "completo (o que o Lab publica)", variantes: VARIANTES, formatos: FORMATOS },
];

const rodar = (a: (typeof AMOSTRAGENS)[number], comAsFaces: boolean) =>
  rodarEsteira(comTestada as unknown as EntradaV1, {
    semente: SEMENTE,
    variantes: a.variantes,
    aparar: true,
    formatos: [...a.formatos] as never,
    ...(comAsFaces && faces.length ? { facesLoteamento: faces } : {}),
  });

/** A variante que o MOTOR escolhe: a de melhor posição no ranking dele. */
const escolher = (r: ReturnType<typeof rodarEsteira>) =>
  r.variantes.filter((v) => v.relatorio).sort((a, b) => a.posicaoNoMotor - b.posicaoNoMotor)[0];

const medir = (v: ReturnType<typeof escolher>) => {
  if (!v) return null;
  const s = v.saida as unknown as { lotes: { pontos: P[] }[] };
  const frente = lotesNaTestadaDeFrente(s.lotes, testadasDeFrente);
  return {
    formato: v.formato,
    posicaoNoMotor: v.posicaoNoMotor,
    lotes: s.lotes.length,
    lotesNaTestada: frente?.lotes ?? null,
    comprimentoDaTestada_m: frente ? n1(frente.comprimentoDaTestada_m) : null,
  };
};

console.log(`  ── o que muda entregando a face 1, em TRÊS amostragens ──`);
const medicoes = AMOSTRAGENS.map((a) => {
  const sem = medir(escolher(rodar(a, false)));
  const com = medir(escolher(rodar(a, true)));
  // `mesmoRotulo`, e NÃO "mesmo partido": formato e posição no ranking são rótulo.
  // Medido nesta gleba, "espinha, posição 1" dá 680 lotes num conjunto de 2 variantes
  // e 599 num de 20 — mesmo rótulo, outra geometria. Chamar isso de "mesmo partido"
  // seria a régua afirmando identidade onde ela só viu etiqueta.
  const mesmoRotulo = sem?.formato === com?.formato && sem?.posicaoNoMotor === com?.posicaoNoMotor;
  console.log(
    `    ${a.rotulo.padEnd(32)} lotes ${String(sem?.lotes).padStart(4)} → ${String(com?.lotes).padStart(4)}` +
      ` (${(com && sem ? com.lotes - sem.lotes : 0) > 0 ? "+" : ""}${com && sem ? com.lotes - sem.lotes : "—"})` +
      ` · na testada ${String(sem?.lotesNaTestada).padStart(3)} → ${String(com?.lotesNaTestada).padStart(3)}` +
      ` · rótulo ${mesmoRotulo ? "igual" : "diferente"}`,
  );
  return {
    amostragem: a.rotulo,
    variantes: a.variantes,
    formatos: [...a.formatos],
    semAsFaces: sem,
    comAsFaces: com,
    deltaDeLotes: com && sem ? com.lotes - sem.lotes : null,
    mesmoRotuloDeVariante: mesmoRotulo,
  };
});

// Determinismo provado, e não prometido: a mesma entrada, a mesma semente, duas vezes.
const umaDeNovo = medir(escolher(rodar(AMOSTRAGENS[2]!, true)));
const determinista = JSON.stringify(umaDeNovo) === JSON.stringify(medicoes[2]!.comAsFaces);
console.log(`    determinismo (amostragem completa, com as faces): ${determinista ? "ok" : "FALHOU"}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "fixtures.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-40",
      geradoEm: CARIMBO,
      semente: SEMENTE,
      contrato: comTestada.archilly.versao,
      oQueEhMedido:
        "se as quatro promessas do LAB-35 passam a ser exercitadas por gleba do repositório, e o que a testada de frente rende FORA de Antonina",
      fixturesEscritas: AS_NOVAS.map((x) => ({
        gleba: x.id,
        arquivo: `docs/fixtures/glebas-que-exercem-as-promessas/${x.id}.entrada.json`,
        origem: (x.entrada.archilly as unknown as { origem: string }).origem,
      })),
      glebasVarridas: { antes: ANTES.map((g) => g.id), depois: [...ANTES, ...AS_NOVAS].map((g) => g.id) },
      promessas,
      promessasSemExercicio: {
        asQuatroDoLab35: {
          antes: promessas.filter((p) => p.exercitadaAntesPor.length === 0).length,
          depois: promessas.filter((p) => p.exercitadaDepoisPor.length === 0).length,
        },
        // O número que sobrevive ao prompt: das promessas que os inventários fazem,
        // quantas gleba nenhuma exercita. Sai do inventário, não dos achados.
        todasAsPromessas: {
          total: universo.length,
          semExercicioAntes: nuncaAntes.map((p) => `${p.ida}·${p.campo}`),
          semExercicioDepois: nuncaDepois.map((p) => `${p.ida}·${p.campo}`),
        },
      },
      testadaDeFrente: {
        gleba: "ensaio-com-testada",
        motor: "Laboratório de Parcelamento",
        regua: {
          toleranciaDaClassificacao_m: TOL_DIVISA_M,
          toleranciaDaFace_m: TOL_DA_FACE_M,
          fracaoMinimaDaFace: FRACAO_MINIMA_DA_FACE,
        },
        linha: {
          comprimento_m: n1(comprimento(TESTADA)),
          distanciaDaDivisa_m: 0.5,
          classificadaComo: testadasDeFrente.length === 1 ? "testada de frente" : "OUTRA COISA",
        },
        porFace: porFace.map((f) => ({ ...f, comprimento_m: n1(f.comprimento_m) })),
        facesLoteamento: faces,
        oQueEhEstavel:
          "a FRENTE: nas três amostragens a entrega põe lote virado para a rua existente onde não havia (0 → 51, 2 → 50, 0 → 51)",
        oQueNaoEhEstavel:
          "o TOTAL de lotes: −40 na espinha com 2 variantes, −4 na ortogonal com 2, +41 no conjunto completo. `espinha, posição 1` não é a mesma variante num conjunto de 2 e num de 20 — o rótulo bate e a geometria não (680 contra 599 na mesma gleba sem as faces). Posição no ranking é rótulo, e rótulo não é identidade",
        medicoes,
        determinista,
      },
    },
    null,
    2,
  )}\n`,
);
console.log(`\n${join("docs", "provas", "LAB-40", "fixtures.json")}`);
