/**
 * LAB-47 · A varredura de segredos, rodada na árvore de hoje.
 *
 * Duas fases, e são trabalhos diferentes (o chat foi explícito):
 *
 *   (a) **a medição do estado de hoje** — plantar segredo de formato real num
 *       arquivo versionado, rodar o verde e dizer se alguém acusou. Está no
 *       relatório: VERDE, 7 passos, 401 travas, exit 0, **ninguém acusou**;
 *   (b) **a varredura** — esta ferramenta e a trava ao lado dela.
 *
 * Ela não roda motor nenhum e não mede terreno: mede a **árvore**. Por isso a
 * prova dela está na lista de exceções do §7 (`regras.test.ts`), com o motivo.
 *
 * Uso:
 *
 *     bun run lab47            # varre e grava a prova
 *     bun run lab47 --so-ver   # varre e NÃO grava (para olhar antes)
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REGRAS, varrer } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dir, "../../..");
const DESTINO = join(RAIZ, "docs/provas/LAB-47");

const { escopo, achados } = varrer(RAIZ);

console.log("══════════ a varredura de segredos do LAB-47 ══════════");
console.log(`  escopo: ${escopo.arquivosVarridos} de ${escopo.arquivosQueOGitCarrega} arquivos que o git carrega`);
console.log(`          ${escopo.bytesVarridos.toLocaleString("pt-BR")} bytes · ${escopo.regras} regras`);
console.log(`  de fora: ${escopo.deFora.length} (binário ou grande demais) — e cada um sai nomeado na prova`);
console.log("");

for (const regra of REGRAS) {
  const n = achados.filter((a) => a.regra === regra.nome).length;
  console.log(`  ${n === 0 ? "✓" : "✗"} ${String(n).padStart(3)} · ${regra.nome}`);
}

console.log("");
if (achados.length === 0) {
  console.log("  NENHUM SEGREDO NA ÁRVORE.");
} else {
  console.log(`  ✗ ${achados.length} ACHADO(S) — e a amostra para no teto da regra, de propósito:`);
  for (const a of achados) console.log(`      ${a.arquivo}:${a.linha} · ${a.regra} · ${a.amostra}… (${a.caracteresCasados} car.)`);
}

if (!process.argv.includes("--so-ver")) {
  mkdirSync(DESTINO, { recursive: true });
  const prova = {
    prompt: "LAB-47",
    oQueIstoMede: "a árvore de hoje deste repositório, não terreno — ver a exceção declarada do §7",
    quando: new Date().toISOString(),
    faseA_aMedicaoDoEstadoDeHoje: {
      oQueFoiPlantado: "5 segredos de formato real num arquivo `src/` versionado, por 1 execução do verde",
      formatosPlantados: ["chave-de-ia-anthropic", "token-do-github", "chave-de-acesso-da-aws", "credencial-de-banco-em-url", "segredo-atribuido-a-um-nome-que-o-declara"],
      oComandoUnico: { passos: 7, travas: 401, exit: 0, veredito: "VERDE" },
      quemAcusou: null,
      lidoPorQuemNadaDisse: ["tsc --noEmit (o arquivo aparece no --listFiles)", "eslint (exit 0 no arquivo)"],
      doLadoDoServidor: "este repositório não tem GitHub Advanced Security habilitada — medido pela resposta do run_secret_scanning",
    },
    faseB_aVarredura: {
      /**
       * A prova que o chat pediu, nas duas metades e nas duas escalas. Os números
       * abaixo são de execuções reais, transcritos à mão como os da fase (a) — o
       * que esta ferramenta mede sozinha é o `escopo` e os `achados` logo adiante.
       */
      reprovaComAChaveEPassaSemEla: {
        porFormato: "13 de 13 — a trava monta o exemplo falso de CADA regra e exige que AQUELA regra o pegue",
        naTravaSozinha: { semAChave: "14 pass · 0 fail", comAChave: "13 pass · 1 FAIL", achados: 7, formatos: 5 },
        noComandoUnico: {
          mesmoArquivoPlantado: "external-engines/esteira/src/configuracao-do-provedor.ts",
          antesDoLAB47: { travas: 401, exit: 0, veredito: "VERDE — 7 passos" },
          depoisDoLAB47: { travas: 415, exit: 1, veredito: "NÃO ESTÁ VERDE — 1 passo falhou: esteira · test" },
        },
        aChaveFoiApagada: true,
        entrouEmAlgumCommit: false,
      },
      escopo,
      regras: REGRAS.map((r) => ({
        nome: r.nome,
        oQue: r.oQue,
        oQueNaoPega: r.oQueNaoPega,
        caracteresNaAmostra: r.caracteresNaAmostra,
      })),
      achados,
    },
  };
  writeFileSync(join(DESTINO, "varredura-de-segredos.json"), JSON.stringify(prova, null, 2) + "\n");
  console.log(`\n  docs/provas/LAB-47/varredura-de-segredos.json`);
}

process.exit(achados.length === 0 ? 0 : 1);
