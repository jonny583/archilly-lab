/**
 * A CONFERÊNCIA DO CONFRONTO DO ACESSO — refeita dos números crus. (LAB-39)
 *
 * ```sh
 * bun run lab39
 * ```
 *
 * # Por que esta ferramenta existe
 *
 * A trava do D116 dizia *"a tabela do LAB-19 e a prova do LAB-28 trazem os mesmos
 * números"* — e o D131, varrendo as sete travas que leem `docs/provas/`, reprovou
 * **esta**: duas provas comparadas **entre si**, nenhuma medida. As duas saem da
 * mesma fórmula; erradas do mesmo jeito, ela passava.
 *
 * O conserto é refazer o agregado a partir do `porPosicao` que **cada arquivo**
 * carrega. Esta ferramenta é a prova em JSON dessa conferência: as 5 glebas × 4
 * motores × 6 posições de cada arquivo, o publicado ao lado do refeito, e o
 * veredito. **Nenhum motor roda aqui** — se rodasse, seriam 240 rodadas completas
 * com Validator e Judge, e a conferência custaria mais que a medição original.
 *
 * O que ela NÃO é: uma segunda medição do acesso. Quem mede o acesso é o LAB-28.
 * Esta aqui mede se o que ele publicou **segue dos números que ele publicou**.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  MOTORES_DE_LOTE,
  POSICOES_DE_ACESSO,
  agregadosDasPosicoes,
  confrontoDoAcesso,
  type ConfrontoDoAcesso,
  type RendimentoNoAcesso,
  type SensibilidadeAoAcesso,
} from "../src/acesso.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-39");
const CARIMBO = "2026-10-04T16:00:00.000Z";

interface BlocoDeMotor extends SensibilidadeAoAcesso {
  motor: string;
}

const tabela = JSON.parse(
  readFileSync(join(RAIZ, "docs", "provas", "LAB-19", "tabela.json"), "utf8"),
) as {
  semente: number;
  contrato: string;
  glebas: {
    gleba: string;
    confrontoDoAcesso: ConfrontoDoAcesso;
    motores: Record<string, { acesso: BlocoDeMotor }>;
  }[];
};
const lab28 = JSON.parse(
  readFileSync(join(RAIZ, "docs", "provas", "LAB-28", "acesso.json"), "utf8"),
) as {
  semente: number;
  contrato: string;
  glebas: Record<
    string,
    {
      motores: Record<string, BlocoDeMotor>;
      // Desde o LAB-44 os nomes são os da RÉGUA nos DOIS arquivos: a tradução que
      // morava aqui existia só porque esta prova publicava chaves próprias (D145).
      confronto: ConfrontoDoAcesso;
    }
  >;
};

const ARQUIVOS = [
  {
    arquivo: "LAB-19/tabela.json",
    regere: "bun run lab19",
    semente: tabela.semente,
    contrato: tabela.contrato,
    glebas: tabela.glebas.map((g) => ({
      gleba: g.gleba,
      motores: Object.fromEntries(Object.entries(g.motores).map(([k, v]) => [k, v.acesso])),
      publicado: g.confrontoDoAcesso,
    })),
  },
  {
    arquivo: "LAB-28/acesso.json",
    regere: "bun run lab28",
    semente: lab28.semente,
    contrato: lab28.contrato,
    glebas: Object.entries(lab28.glebas).map(([gleba, g]) => ({
      gleba,
      motores: g.motores,
      publicado: g.confronto,
    })),
  },
];

const sensDaProva = (b: {
  porPosicao: RendimentoNoAcesso[];
  acessoDeclarado: RendimentoNoAcesso | null;
}): SensibilidadeAoAcesso => ({
  ...agregadosDasPosicoes(b.porPosicao),
  amplitudeEhPiso: true,
  acessoDeclarado: b.acessoDeclarado,
  porPosicao: b.porPosicao,
});

const LOTE = [...MOTORES_DE_LOTE];
const saida: Record<string, unknown> = {};
let posicoesConferidas = 0;
let agregadosConferidos = 0;
let divergencias = 0;

console.log(
  "[LAB-39] o confronto do acesso, refeito dos números crus de cada arquivo.\n" +
    "          Nenhum motor roda: a conferência é sobre o que já está publicado.",
);

for (const a of ARQUIVOS) {
  console.log(`\n══════════ ${a.arquivo} ══════════`);
  const porGleba: Record<string, unknown> = {};
  for (const g of a.glebas) {
    const sens = Object.fromEntries(Object.entries(g.motores).map(([k, v]) => [k, sensDaProva(v)]));
    const refeito = confrontoDoAcesso(sens, LOTE);
    const confere = JSON.stringify(refeito) === JSON.stringify(g.publicado);

    const porMotor: Record<string, unknown> = {};
    for (const [mid, bloco] of Object.entries(g.motores)) {
      const ag = agregadosDasPosicoes(bloco.porPosicao);
      const pub = {
        posicoes: bloco.posicoes,
        posicoesMedidas: bloco.posicoesMedidas,
        lotes: bloco.lotes,
        areaVendavel_m2: bloco.areaVendavel_m2,
        melhorPonto: bloco.melhorPonto,
        piorPonto: bloco.piorPonto,
      };
      const ok = JSON.stringify(ag) === JSON.stringify(pub);
      posicoesConferidas += bloco.porPosicao.length;
      agregadosConferidos += 1;
      if (!ok) divergencias += 1;
      porMotor[mid] = {
        motor: bloco.motor,
        posicoesCruas: bloco.porPosicao.length,
        lotesCrus: bloco.porPosicao.map((r) => r.lotes),
        agregadoPublicado: pub,
        agregadoRefeitoDosCrus: ag,
        confere: ok,
      };
    }

    if (!confere) divergencias += 1;
    porGleba[g.gleba] = {
      gleba: g.gleba,
      confrontoPublicado: g.publicado,
      confrontoRefeitoDosCrus: refeito,
      confere,
      motores: porMotor,
    };
    console.log(
      `  ${g.gleba.padEnd(24)} confronto ${confere ? "confere" : "DIVERGE"} · ` +
        `maior amplitude ${refeito.maiorAmplitude_pct} % · entre os quatro ${refeito.entreOsQuatroMotores_pct} % · ` +
        `entre os de lote ${refeito.entreOsMotoresDeLote_pct} %`,
    );
  }
  saida[a.arquivo] = {
    arquivo: a.arquivo,
    regere: a.regere,
    semente: a.semente,
    contrato: a.contrato,
    glebas: porGleba,
  };
}

console.log(
  `\n  ${agregadosConferidos} agregados de motor e ${ARQUIVOS.length * 5} confrontos refeitos, ` +
    `sobre ${posicoesConferidas} posições cruas · divergências: ${divergencias}`,
);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "confronto-refeito.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-39",
      geradoEm: CARIMBO,
      // A semente e o contrato não são escolha desta ferramenta: eles vêm
      // declarados em cada arquivo conferido, e viajam por isso (§7).
      semente: tabela.semente,
      contrato: tabela.contrato,
      oQueEhMedido:
        "se o agregado publicado em cada prova SEGUE dos números crus que a própria prova carrega",
      oQueNaoEhMedido:
        "o acesso em si — quem mede isso é o LAB-28; aqui nenhum motor roda, e nenhuma gleba é desenhada de novo",
      posicoesDeAcesso: POSICOES_DE_ACESSO,
      motoresDeLote: LOTE,
      agregadosConferidos,
      posicoesCruasConferidas: posicoesConferidas,
      divergencias,
      aTravaAntiga: {
        oQueEla: "comparava a prova do LAB-19 com a prova do LAB-28",
        porQueNaoMedia:
          "as duas saem da MESMA fórmula; regeradas erradas do mesmo jeito, a comparação passava — e regerada só uma, ela ficava vermelha sem nada estar errado",
        veredito: "D131 a reprovou na varredura das sete travas que leem docs/provas/",
      },
      sabotagem: {
        oQue:
          "entreOsMotoresDeLote_pct da gleba `completo` na prova do LAB-19 trocado de 29.12 para 70 — justamente o número errado que o D116 publicou",
        comando: "bun test tests/acesso.test.ts",
        antes: { testes: 30, falhas: 0 },
        depois: { testes: 30, falhas: 3 },
        reprovou: true,
        arquivoRestaurado: true,
      },
      arquivos: saida,
    },
    null,
    2,
  )}\n`,
);
console.log(`\n${join("docs", "provas", "LAB-39", "confronto-refeito.json")}`);
