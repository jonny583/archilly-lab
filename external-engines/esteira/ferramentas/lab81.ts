/**
 * LAB-81 — AS CINCO LEITURAS, TERMINADAS: uma casa, uma pergunta cada. (item 014, D259)
 *
 * O LAB-80 contou cinco respostas para *"esta linha afirma ou só mostra?"*, três dentro de
 * travas, e nenhuma conhecendo o bloco de código. Esta ferramenta publica a medição que decidiu
 * **como** terminá-las — e a medição é o que disse que **fazê-las iguais seria um desligamento**.
 *
 * Uso: `bun run lab81`
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { limitesSemSujeito, secoesDeRegra } from "../src/limites-com-sujeito.ts";
import {
  AS_LEITURAS,
  conferirAsLeituras,
  lugaresDaPagina,
  semCitacoes,
  semRiscadoNemCitado,
} from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-81");
const ler = (rel: string): string => readFileSync(join(RAIZ, rel), "utf8");

const A_MENTIRA = "# Não há CI neste repositório (não existe `.github/workflows/verde.yml`)";

function caminhosNaNegacao(linha: string, limpeza: (t: string) => string): string[] {
  const limpa = limpeza(linha);
  if (!/não existe|não há/i.test(limpa)) return [];
  return [...limpa.matchAll(/`([^`]+)`/g)].map((m) => m[1]!);
}

// ── O bloco de código dentro das seções de REGRA da CLAUDE.md ───────────────
const claudeMd = ler("CLAUDE.md");
const porSecao = secoesDeRegra(claudeMd).map(({ titulo, corpo }) => {
  const lug = lugaresDaPagina(corpo);
  return {
    secao: titulo,
    linhas: lug.length,
    emCitacao: lug.filter((l) => l === "citacao").length,
    emBlocoDeCodigo: lug.filter((l) => l === "bloco-de-codigo").length,
  };
});
const totais = porSecao.reduce(
  (a, s) => ({
    linhas: a.linhas + s.linhas,
    emCitacao: a.emCitacao + s.emCitacao,
    emBlocoDeCodigo: a.emBlocoDeCodigo + s.emBlocoDeCodigo,
  }),
  { linhas: 0, emCitacao: 0, emBlocoDeCodigo: 0 },
);

// ── A leitura de Markdown sobre um script de shell ──────────────────────────
const lugaresDoScript = lugaresDaPagina(ler("external-engines/conferir.sh"));

// ── A demonstração que decidiu a UMA diferente ──────────────────────────────
const aUmaDiferente = {
  oCaso: "a trava do LAB-51: o `conferir.sh` AFIRMA que um caminho não existe, e ele existe",
  comASemCitacoes: caminhosNaNegacao(A_MENTIRA, semCitacoes),
  comASemRiscadoNemCitado: caminhosNaNegacao(A_MENTIRA, semRiscadoNemCitado),
  oVeredicto:
    "a limpeza mais forte NEGA igual e acha ZERO caminhos: ela tira a crase, que é o DADO desta " +
    "trava. Forçá-la aqui seria um desligamento passando por conserto",
  aLeituraDeMarkdownAqui: `${lugaresDoScript.filter((l) => l !== "prosa").length} de ${lugaresDoScript.length} linhas são citação ou cerca — ou seja, nenhuma`,
};

const problemasDaTabela = conferirAsLeituras(ler);

console.log("\n═══ LAB-81 · as cinco leituras, terminadas ═══\n");
console.log(`leituras na tabela: ${AS_LEITURAS.length}, e a tabela bate com os import: ${problemasDaTabela.length === 0 ? "SIM" : problemasDaTabela.join("; ")}`);
for (const l of AS_LEITURAS) {
  console.log(`  ${l.leitura.padEnd(34)} ${l.instrumento.replace("external-engines/esteira/", "")}`);
}
console.log(`\nseções de REGRA da CLAUDE.md: ${totais.linhas} linhas · ${totais.emCitacao} em citação · ${totais.emBlocoDeCodigo} em bloco de código`);
for (const s of porSecao.filter((s) => s.emBlocoDeCodigo > 0)) {
  console.log(`  ${s.secao}: ${s.emBlocoDeCodigo} linhas em bloco de código`);
}
console.log(`\nveredito da régua dos limites, hoje: ${JSON.stringify(limitesSemSujeito(claudeMd))}`);
console.log("\na UMA declarada como diferente:");
console.log(`  com a semCitacoes dela ....... ${aUmaDiferente.comASemCitacoes.length} caminho(s) na mentira plantada`);
console.log(`  com a semRiscadoNemCitado .... ${aUmaDiferente.comASemRiscadoNemCitado.length} caminho(s) — CEGA`);
console.log(`  a leitura de Markdown ali ..... ${aUmaDiferente.aLeituraDeMarkdownAqui}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "as-leituras.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-81",
      oQue:
        "as CINCO leituras de \"esta linha afirma ou só mostra?\" terminadas num lugar só, cada uma " +
        "com a pergunta dela declarada e conferida contra o `import` de quem a chama — e UMA " +
        "declarada como diferente, com a medição que prova que ela precisa ser",
      oQueIstoNaoMede:
        "não roda motor nenhum e não mede gleba: o objeto são as LEITURAS de texto desta casa e os " +
        "arquivos que as chamam. Por isso está na lista declarada de exceções do §7",
      quando: new Date().toISOString(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      asLeituras: AS_LEITURAS,
      aTabelaBateComOsImports: problemasDaTabela.length === 0,
      problemasDaTabela,
      oBuracoComumDasCinco: {
        oQue: "nenhuma das cinco conhecia o BLOCO DE CÓDIGO",
        oCusto:
          "a varredura de custo acusou o RECADOS.md por duas linhas que são recado gravado (D259)",
        nasSecoesDeRegraDaClaudeMd: totais,
        porSecao,
      },
      aUmaDiferente,
      veredictoDaReguaDosLimites: limitesSemSujeito(claudeMd),
      aOrdemDaCentral:
        "provar primeiro que cada régua CONTINUA achando o que achava, e só depois que deixou de " +
        "achar o que não devia. Na ordem inversa, um desligamento passa por conserto — e foi " +
        "exatamente essa a armadilha desta rodada",
      oAchado:
        "a QUARTA forma de \"só mostra\" não é uma forma nova: é a descoberta de que uma das marcas " +
        "não é sempre \"só mostra\". A cerca, o `>` e o riscado nunca carregam o objeto da régua; A " +
        "CRASE CARREGA. É a única marca que às vezes é o DADO, e é por isso que a família tem seis " +
        "membros em vez de uma função",
      conferidoAqui: "sim, na máquina da sessão — não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-81/as-leituras.json\n`);
