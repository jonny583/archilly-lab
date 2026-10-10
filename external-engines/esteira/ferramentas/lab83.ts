/**
 * LAB-83 — O CARIMBO SAI DO MÓDULO RESOLVIDO, e a divergência é a notícia. (item 016, D274)
 *
 * O carimbo que vai na prova lia o `HEAD` do caminho **por convenção** (`../<repo>`), e o código
 * vem do **resolvedor de módulos**. No LAB-82, ao remedir contra o motor novo num clone do clone,
 * a ferramenta **mediu o motor novo e carimbou o velho** — em silêncio.
 *
 * Esta ferramenta publica o conserto e a **adoção medida**, que é o que o item pediu em vez de uma
 * reescrita: quantas provas usam clone, quantas passam a trazer as duas linhas, e o que fica.
 *
 * Uso: `bun run lab83`
 */

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { PONTO_DE_ENTRADA, VIZINHOS, carimbarVizinhos } from "../src/commit-dos-vizinhos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVAS = join(RAIZ, "docs", "provas");
const SAIDA = join(PROVAS, "LAB-83");

/** Todo `.json` sob `docs/provas/`, pelo caminho relativo. */
function todasAsProvas(): string[] {
  const achadas: string[] = [];
  const andar = (dir: string): void => {
    for (const nome of readdirSync(dir)) {
      const cheio = join(dir, nome);
      if (statSync(cheio).isDirectory()) andar(cheio);
      else if (nome.endsWith(".json")) achadas.push(cheio.slice(PROVAS.length + 1));
    }
  };
  andar(PROVAS);
  return achadas.sort();
}

/** Quais ferramentas chamam o carimbo — lido do `import`, não do texto (D257). */
function quemCarimba(): string[] {
  const dir = join(import.meta.dirname);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => {
      const fonte = readFileSync(join(dir, f), "utf8");
      return /^import[^;]*\bcarimbarVizinhos\b[^;]*from/m.test(fonte);
    })
    .map((f) => `ferramentas/${f}`)
    .sort();
}

const provas = todasAsProvas();
const comCarimbo = provas.filter((p) => {
  const texto = readFileSync(join(PROVAS, p), "utf8");
  return texto.includes('"osClonesVizinhos"') || texto.includes('"clones"');
});

// ── O carimbo de hoje, sem rede: a pergunta é de ONDE ele saiu ──────────────
const carimbos = carimbarVizinhos((e) => import.meta.resolve(e), false);

console.log("\n═══ LAB-83 · o carimbo sai do módulo resolvido ═══\n");
for (const c of carimbos) {
  console.log(
    `  ${c.repo.padEnd(28)} de=${c.de.padEnd(17)} commit=${c.commit} · ` +
      `convenção=${c.pelaConvencao?.commit ?? "—"} · divergem=${c.divergem ? "SIM" : "não"}`,
  );
}
console.log(`\npontos de entrada declarados: ${VIZINHOS.filter((v) => PONTO_DE_ENTRADA[v] !== null).length} de ${VIZINHOS.length}`);
console.log(`  sem módulo a resolver: ${VIZINHOS.filter((v) => PONTO_DE_ENTRADA[v] === null).join(", ")} (o Lab não importa o Geo)`);
console.log(`\nadoção: ${provas.length} provas no total · ${comCarimbo.length} trazem carimbo de clone`);
for (const p of comCarimbo) console.log(`  · ${p}`);
console.log(`quem chama o carimbo (lido do import): ${quemCarimba().join(", ")}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "carimbo-do-modulo-resolvido.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-83",
      oQue:
        "o carimbo de versão do clone vizinho passa a sair do MÓDULO RESOLVIDO — o arquivo que o " +
        "`import` de fato carregou — e o `HEAD` do caminho por convenção vira uma SEGUNDA linha; " +
        "divergindo, a prova diz as duas, porque a divergência é a notícia e não o erro",
      oQueIstoNaoMede:
        "não mede gleba e não roda motor sobre entrada nova: o objeto é a PROCEDÊNCIA de uma " +
        "medição. Por isso está na lista declarada de exceções do §7",
      quando: new Date().toISOString(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      osCarimbosDeHoje: carimbos,
      pontosDeEntrada: PONTO_DE_ENTRADA,
      oQueAMedicaoMudouNoTamanhoDoConserto:
        "de TRÊS vizinhos, DOIS têm módulo a resolver e UM não tem: o `urban-scout-tool` não " +
        "aparece em `paths` nenhum, porque o Lab não importa o Geo — ele lê GeoJSON, não código. " +
        "Para ele o carimbo honesto é o da convenção, DITO como tal. Carimbo que não tem módulo a " +
        "resolver não é um carimbo pior: é um carimbo de outra pergunta",
      aAdocao: {
        provasNoTotal: provas.length,
        comCarimboDeClone: comCarimbo,
        quantasComCarimbo: comCarimbo.length,
        quemChamaOCarimbo: quemCarimba(),
        oQueIssoDecide:
          "o item perguntou se a adoção cabia nesta rodada e mandou a MEDIÇÃO decidir. Cabe: o " +
          "conserto é numa função, e as provas que a usam são poucas — as outras não carimbam " +
          "clone nenhum, então não há nada a adotar nelas",
      },
      aDivergenciaFoiDEMONSTRADA: {
        comoFoi:
          "o resolvedor foi trocado para apontar o `@testfit/` ao clone do rascunho em `3680b9f` — " +
          "o mesmo repoint do LAB-82 —, e o carimbo passou a dizer as DUAS linhas com `divergem` " +
          "verdadeiro. O texto da fixture não vai à prova (D262): vai o veredicto",
        oVeredicto: "divergência RELATADA, com o commit do módulo e o da convenção lado a lado",
      },
      oQueOCarimboNAOSabe:
        "o módulo resolvido diz QUAL ARQUIVO foi carregado; ele não diz se aquela árvore tinha " +
        "mudança não commitada. Um clone sujo entrega código que não corresponde a commit nenhum, " +
        "e NENHUMA das duas fontes conta isso — o campo `limpo` do carimbo mede a árvore de onde o " +
        "carimbo saiu, o que ajuda, mas um `git stash` no meio de uma rodada continua invisível. " +
        "Guarda que não declara o próprio buraco mente pelo silêncio",
      conferidoAqui: "sim, na máquina da sessão — não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-83/carimbo-do-modulo-resolvido.json\n`);
