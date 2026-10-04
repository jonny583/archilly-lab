#!/usr/bin/env bun
/**
 * LAB-28 — a sensibilidade ao acesso. (03/10/2026)
 *
 * ```sh
 * bun run lab28
 * ```
 *
 * # A pergunta, e por que ela é a mais importante da fila
 *
 * O LAB-26 descobriu, de raspão, que mover o ponto de acesso muda o resultado
 * **mais do que qualquer outra entrada que o Lab mede**. E as cinco glebas da
 * tabela comparativa declaram **um** acesso cada, sem ninguém medir quanto o
 * resultado depende dele.
 *
 * Isso tem uma consequência desconfortável para a tabela inteira: com o acesso
 * fixo, ela responde *"qual motor é melhor NESTE ponto de entrada"* e se
 * apresenta como *"qual motor é melhor"*. Se a amplitude do acesso for maior que
 * a diferença entre motores, **a tabela está comparando a coisa errada** — e esta
 * ferramenta existe para dizer se é o caso, com número.
 *
 * # Como se mede
 *
 * A régua é a `src/acesso.ts`: o acesso vai a **seis pontos igualmente espaçados
 * por comprimento de arco** no perímetro, o motor roda em cada um, e quem conta
 * lotes e área vendável é o **Validator do Generate**, o mesmo da tabela (D20).
 *
 * **A amplitude é piso, não valor exato** — seis pontos não varrem o perímetro.
 *
 * # O que esta ferramenta NÃO faz
 *
 * Não escolhe o acesso, e não diz que o melhor ponto é viável: onde a entrada pode
 * ficar depende da rua que existe do lado de fora, da faixa de domínio e da
 * licença. Por isso ela publica também o **acesso declarado na gleba** — o único
 * que alguém afirmou existir. A escolha é do Jonny (CLAUDE.md §4).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Motor } from "@symbios/index.ts";
import { areaPoligono } from "@symbios/geo.ts";
import type { Terreno } from "@symbios/contrato.ts";

import {
  MOTORES_DE_LOTE,
  POSICOES_DE_ACESSO,
  confrontoDoAcesso,
  sensibilidadeAoAcesso,
  type ConfrontoDoAcesso,
  type SensibilidadeAoAcesso,
} from "../src/acesso.ts";
import { glebaDoLab } from "../src/gleba-do-lab.ts";
import { contratoDasEntradas, glebaParaOSymbios, type EntradaMinima } from "../src/gleba-v1.ts";
import { julgar, type Rodada } from "../src/motores/comum.ts";
import { rodarGenerate } from "../src/motores/generate.ts";
import { rodarTestfit } from "../src/motores/testfit.ts";
import { rodarSymbios } from "../src/motores/symbios.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-28");
const FIXTURES = join(RAIZ, "docs", "fixtures", "glebas-padrao-com-relevo");
const PROMESSAS = join(RAIZ, "docs", "fixtures", "glebas-que-exercem-as-promessas");
const WASM = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);

const SEMENTE = 20260913;
const CARIMBO = "2026-09-19T00:00:00.000Z";

const n2 = (v: number | null) => (v == null ? null : Number(v.toFixed(2)));

const wasm = await Motor.carregar(readFileSync(WASM));
mkdirSync(SAIDA, { recursive: true });

/**
 * As MESMAS glebas da tabela do LAB-19 — sete desde o LAB-45.
 *
 * Elas têm de ser as mesmas, e isso não é arrumação: o detector de prova velha do
 * LAB-39 compara os números crus do acesso **desta** prova com os da tabela, e um
 * conjunto de glebas diferente quebra a comparação por fora. Quando a tabela ganha
 * gleba, esta prova ganha também — a alternativa seria **afrouxar a trava** para
 * caber a minha mudança, que é o contrário do que o D143 ensinou.
 */
const GLEBAS: { id: string; entrada: EntradaMinima }[] = [
  { id: "completo", entrada: glebaDoLab("completo") },
  { id: "sintetico-50ha-ondulado", entrada: glebaDoLab("sintetico-50ha-ondulado") },
  { id: "sintetico-10ha-plano", entrada: glebaDoLab("sintetico-10ha-plano") },
  { id: "ensaio-47ha", entrada: JSON.parse(readFileSync(join(FIXTURES, "ensaio-47ha.entrada.json"), "utf8")) },
  { id: "geo-antonina", entrada: JSON.parse(readFileSync(join(FIXTURES, "geo-antonina.entrada.json"), "utf8")) },
  { id: "ensaio-com-promessas", entrada: JSON.parse(readFileSync(join(PROMESSAS, "ensaio-com-promessas.entrada.json"), "utf8")) },
  { id: "ensaio-com-testada", entrada: JSON.parse(readFileSync(join(PROMESSAS, "ensaio-com-testada.entrada.json"), "utf8")) },
];

// ── A etiqueta sai do MEDIDO, não da minha mão (LAB-43, D146) ─────────────
//
// Aqui estava `const CONTRATO = "2"`, escrito à mão — e **errado**: todas as glebas
// que esta ferramenta mede declaram `archilly.versao: "1"`, e entrada nenhuma do
// repositório é `"2"`. A esteira LÊ `["2","1"]`; nada que ela mede É `"2"`.
//
// `contratoDasEntradas` mora no `gleba-v1.ts` e **reprova conjunto misto** em vez de
// eleger a primeira: duas versões numa prova só esconderiam uma delas. Fica DEPOIS da
// lista de glebas, porque ela é a fonte.
const CONTRATO = contratoDasEntradas(GLEBAS.map((g) => g.entrada));

const MOTORES = [
  { id: "generate-ortogonal", nome: "Generate · candidata ortogonal" },
  { id: "generate-espinha", nome: "Generate · candidata espinha" },
  { id: "parcelamento", nome: "Laboratório de Parcelamento" },
  { id: "symbios", nome: "Symbios + subdivisão do Lab" },
] as const;

function rodar(id: string, e: EntradaMinima): Rodada {
  if (id === "generate-ortogonal") return rodarGenerate(e, "ortogonal", CARIMBO);
  if (id === "generate-espinha") return rodarGenerate(e, "espinha", CARIMBO);
  if (id === "parcelamento") return rodarTestfit(e, SEMENTE);
  return rodarSymbios(wasm, e, SEMENTE, CARIMBO);
}

console.log(
  `[LAB-28] o acesso em ${POSICOES_DE_ACESSO} pontos do perímetro, por comprimento de arco.\n` +
    "          A amplitude é PISO: o melhor e o pior ponto reais podem cair entre duas amostras.",
);

const porGleba: Record<string, unknown> = {};
/**
 * Para a conclusão: a amplitude do acesso contra a diferença entre motores.
 *
 * **Os nomes são os da RÉGUA** (`ConfrontoDoAcesso`), e não mais os deste arquivo
 * (LAB-44, D145). Até aqui esta prova publicava `amplitudeDoAcesso_pct` e a tabela do
 * LAB-19 publicava `maiorAmplitude_pct` — **as mesmas três contas com chaves
 * diferentes em dois arquivos que o Jonny lê lado a lado**. Dois nomes para um número é
 * meio caminho para dois números, e é assim que o D116 começou.
 */
const confrontos: (ConfrontoDoAcesso & { gleba: string })[] = [];

for (const { id, entrada } of GLEBAS) {
  const { terreno } = glebaParaOSymbios(entrada);
  const areaGleba = areaPoligono((terreno as Terreno).gleba);
  console.log(`\n══════════ ${id} · ${(areaGleba / 1e4).toFixed(1)} ha ══════════`);
  console.log(
    `  ${"motor".padEnd(30)} ${"lotes".padStart(13)} ${"+%".padStart(7)} ` +
      `${"vendável (ha)".padStart(15)} ${"+%".padStart(7)} ${"declarado".padStart(10)}`,
  );

  const motores: Record<string, unknown> = {};
  const sens: Record<string, SensibilidadeAoAcesso> = {};
  const lotesComAcessoDeclarado: number[] = [];

  for (const m of MOTORES) {
    const t0 = performance.now();
    const s = sensibilidadeAoAcesso(entrada, (x) => {
      const r = rodar(m.id, x);
      const v = r.saida ? julgar(r.saida, x) : null;
      return { lotes: v?.lotes ?? null, areaVendavel_m2: n2(v?.areaPrivativa_m2 ?? null) };
    });
    const ms = performance.now() - t0;
    sens[m.id] = s;
    motores[m.id] = { motor: m.nome, ms: n2(ms), ...s };

    const decl = s.acessoDeclarado?.lotes ?? null;
    if (decl != null) lotesComAcessoDeclarado.push(decl);

    const faixa = `${s.lotes.minimo ?? "—"}–${s.lotes.maximo ?? "—"}`;
    const vend =
      s.areaVendavel_m2.minimo == null
        ? "—"
        : `${(s.areaVendavel_m2.minimo / 1e4).toFixed(2)}–${(s.areaVendavel_m2.maximo! / 1e4).toFixed(2)}`;
    console.log(
      `  ${m.nome.padEnd(30)} ${faixa.padStart(13)} ${String(s.lotes.amplitudePct ?? "—").padStart(7)} ` +
        `${vend.padStart(15)} ${String(s.areaVendavel_m2.amplitudePct ?? "—").padStart(7)} ` +
        `${String(decl ?? "—").padStart(10)}`,
    );
  }

  // ── O confronto, e por que ele sai em DUAS versões ────────────────────────
  //
  // De um lado, quanto um MESMO motor varia só mudando a entrada da rua. Do
  // outro, quanto os motores diferem entre si no acesso que a gleba declara (ou,
  // sem acesso declarado, na primeira posição amostrada — e isso vai dito).
  //
  // **A primeira versão desta conta comparou os quatro, e a comparação estava
  // contaminada**: o Symbios entrega QUADRA, e os lotes dele vêm da subdivisão do
  // Lab (D50). Pôr "Symbios + subdivisão" ao lado de um motor de lote infla a
  // diferença entre motores — em `ensaio-47ha` ela dá 355 %, que não é uma
  // escolha que alguém faça entre dois loteamentos, é a distância entre duas
  // etapas de projeto.
  //
  // Então saem as duas, e a segunda é a que responde à pergunta de verdade —
  // *"trocar o programa que desenha rende mais que mudar a entrada?"*. As duas vão
  // publicadas, para ninguém dizer que eu escolhi a que dava a manchete melhor.
  // A fórmula mora na régua (`acesso.ts`), não aqui: a página do Jonny e esta
  // ferramenta tinham duas, e davam dois confrontos para a mesma gleba (D116). E
  // desde o LAB-39 a MONTAGEM das três contas também mora lá — inclusive a lista
  // dos motores de lote, que aqui estava declarada e na ferramenta do LAB-19
  // escrita como `MOTORES.filter(… !== "symbios")`.
  //
  // E os nomes das chaves publicadas são os DA RÉGUA (LAB-44): o objeto vai inteiro,
  // sem renomear no caminho. Renomear ao publicar é o que criava o segundo nome.
  const confronto = confrontoDoAcesso(sens, MOTORES_DE_LOTE);
  const maiorAmplitude = confronto.maiorAmplitude_pct;
  const entreQuatro = confronto.entreOsQuatroMotores_pct;
  const entreOsDeLote = confronto.entreOsMotoresDeLote_pct;
  void lotesComAcessoDeclarado;

  confrontos.push({ gleba: id, ...confronto });
  console.log(
    `  → maior amplitude do ACESSO ${maiorAmplitude} % · entre os quatro motores ${entreQuatro} % · ` +
      `entre os três que entregam LOTE ${entreOsDeLote} %` +
      `${maiorAmplitude > entreOsDeLote ? "  ← aqui o acesso pesa mais" : ""}`,
  );

  porGleba[id] = {
    areaDaGleba_m2: n2(areaGleba),
    temAcessoDeclarado: (entrada.acessos?.length ?? 0) > 0,
    motores,
    confronto,
  };
}

const ganhaDosQuatro = confrontos.filter((c) => c.maiorAmplitude_pct > c.entreOsQuatroMotores_pct).length;
const ganhaDosDeLote = confrontos.filter((c) => c.maiorAmplitude_pct > c.entreOsMotoresDeLote_pct).length;
const maiorDeTodas = Math.max(...confrontos.map((c) => c.maiorAmplitude_pct));

console.log(
  `\n══════════ a conclusão, e ela é mais modesta que a manchete ══════════\n` +
    `  O MESMO motor, no MESMO terreno, varia até +${maiorDeTodas} % em lotes só mudando a entrada da rua.\n` +
    `  Isso é incondicional, e é o número que importa.\n` +
    `  Mas "o acesso pesa mais que a escolha do motor" NÃO é geral: vale em ` +
    `${ganhaDosDeLote} das ${confrontos.length} glebas\n` +
    `  comparando os três motores que entregam lote, e em ${ganhaDosQuatro} das ${confrontos.length} ` +
    `comparando os quatro.`,
);

writeFileSync(
  join(SAIDA, "acesso.json"),
  JSON.stringify(
    {
      prompt: "LAB-28",
      geradoEm: "2026-10-03",
      semente: SEMENTE,
      contrato: CONTRATO,
      posicoesDeAcesso: POSICOES_DE_ACESSO,
      amplitudeEhPiso: true,
      comoSeMede:
        `o acesso vai a ${POSICOES_DE_ACESSO} pontos igualmente espaçados por comprimento de arco no ` +
        "perímetro da gleba; o motor roda em cada um e quem conta lotes e área vendável é o " +
        "Validator do Generate, o mesmo da tabela comparativa",
      ressalva:
        `a amplitude é um PISO: ${POSICOES_DE_ACESSO} pontos não varrem o perímetro, e o melhor e o ` +
        "pior ponto reais podem cair entre duas amostras",
      maiorAmplitudeDeTodas_pct: maiorDeTodas,
      glebasEmQueOAcessoPesaMaisQueOsQuatroMotores: ganhaDosQuatro,
      glebasEmQueOAcessoPesaMaisQueOsMotoresDeLote: ganhaDosDeLote,
      porQueDuasContas:
        "a diferença entre os QUATRO motores inclui o Symbios, que entrega quadra e cujos lotes " +
        "vêm da subdivisão do Lab (D50) — isso infla a conta até 355 %, que não é escolha de " +
        "projeto. A conta entre os três que entregam lote é a que responde \"trocar o programa " +
        "rende mais que mudar a entrada?\". As duas saem publicadas",
      glebas: porGleba,
      confrontos,
    },
    null,
    2,
  ) + "\n",
);

console.log("\ndocs/provas/LAB-28/acesso.json");
