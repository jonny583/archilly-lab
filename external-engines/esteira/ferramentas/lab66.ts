/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-66 · A dívida própria com o que sobrou — e o que sobrou era o §1.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O chat escreveu a regra do **bloco único** e mandou seguir a fila. A dívida que sobrou é
 * a da minha própria entrega:
 *
 * 1. eu implementei a regra **ao contrário** — o recado por último, as listas acima. O chat
 *    quer o **recado primeiro**, e a linha de marca separando o que vai junto;
 * 2. a **D214 nasceu com a origem errada**, dizendo que a leitura errada foi só minha;
 * 3. **o recado daquele próprio prompt não chegou ao `RECADOS.md`** — a §1-B acontecendo com
 *    o prompt que consertava a §1;
 * 4. e a trava que eu escrevi para pegar o nº 3 **acusou o precedente**: ela casava o nome do
 *    prompt **exato**, e o LAB-13/LAB-14 têm um recado **para os dois**.
 *
 * Esta ferramenta mede o estado do acumulado depois do conserto, e **reprova** quando ele volta
 * a quebrar. Uso: `bun run lab66`
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-66");

const texto = readFileSync(join(RAIZ, "docs", "relatorios", "RECADOS.md"), "utf8");
const problemas: string[] = [];

const blocos = texto.match(/```\n[\s\S]*?\n```/g) ?? [];
const abremComRecado = blocos.filter((b) => b.startsWith("```\n=== RECADO PARA O CHAT"));
if (abremComRecado.length !== blocos.length) {
  problemas.push(
    `${blocos.length - abremComRecado.length} bloco(s) do acumulado não abrem com o recado (§1)`,
  );
}

/** O campo `<prompt>` de cada cabeçalho. Pode ser composto: `LAB-13 e LAB-14`. */
const cabecalhos = [...texto.matchAll(/=== RECADO PARA O CHAT — Lab · (.+?) ===/g)].map(
  (m) => m[1]!,
);
const compostos = cabecalhos.filter((c) => /LAB-\d\d[\s\S]*LAB-\d\d/.test(c));

const relatorios = readdirSync(join(RAIZ, "docs", "relatorios"))
  .map((f) => /^(LAB-\d\d)\.md$/.exec(f)?.[1])
  .filter((p): p is string => p !== undefined)
  .sort();
const semRecado = relatorios.filter((p) => !cabecalhos.some((c) => new RegExp(`\\b${p}\\b`).test(c)));
if (semRecado.length > 0) {
  problemas.push(`prompt(s) com relatório e SEM recado no arquivo: ${semRecado.join(", ")}`);
}

/**
 * **O buraco da trava, declarado e medido.** Rodada sem relatório — a regra do bloco único foi
 * uma — não tem âncora para a trava morder. O número de recados cujo `<prompt>` é `—` é a
 * medida desse buraco: para esses, o que resta é disciplina, e esconder isso seria pior que
 * não ter trava (D216).
 */
const semPromptNomeado = cabecalhos.filter((c) => c.trim() === "—").length;

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "o-acumulado-dos-recados.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-66",
      oQueIstoMede:
        "o estado do acumulado de recados depois da regra do bloco único: todo bloco abrindo " +
        "com o recado, todo relatório de prompt com recado no arquivo, e o buraco da trava medido",
      aPergunta: "do chat: a regra do bloco único, e seguir a fila com a dívida própria do que sobrou",
      quando: new Date().toISOString(),
      aRegraDoChat: {
        oBloco: "um só por rodada; o recado PRIMEIRO, nas suas doze linhas; o resto abaixo, no mesmo bloco, depois da linha de marca",
        oTeto: "doze linhas é do RECADO e não do bloco — partir o bloco para caber nas doze é o defeito, não o conserto",
        oAcumulado: "rodando mais de um prompt sem ele voltar, o bloco abre com `ACUMULADO — inclui os recados X, Y e Z`; o recado completo de cada prompt continua indo inteiro para o arquivo",
      },
      oAcumulado: {
        blocos: blocos.length,
        abremComRecado: abremComRecado.length,
        cabecalhos: cabecalhos.length,
        cabecalhosCompostos: compostos,
        relatoriosDePrompt: relatorios.length,
        relatoriosSemRecado: semRecado,
      },
      oBuracoDaTravaDECLARADO: {
        oQue: "rodada SEM relatório não tem âncora para a trava morder — foi assim que o recado da própria regra do bloco se perdeu",
        quantosRecadosSemPromptNomeado: semPromptNomeado,
        oQueResta: "disciplina: o recado vai ao arquivo no MESMO commit em que vai ao chat",
      },
      oPrecedenteQueEuACUSEI: {
        oQue: "a primeira versão da trava casava `— Lab · LAB-13 ===` exato e acusou LAB-13 e LAB-14 de não terem recado",
        oQueEra: "têm UM recado para os dois, de 19/09/2026, com o cabeçalho `— Lab · LAB-13 e LAB-14 ===`",
        porQueDOI: "o acusado era o PRECEDENTE da forma ACUMULADA que o chat acabou de escrever na §1 — a prática inventou a forma três semanas antes da regra",
        aFamilia: "décima sétima ocorrência do ponto cego do §6, e oitava da sub-família da régua que varre texto (D137, D217)",
      },
      oQueNAOFoiFeito:
        "o `RECADOS.md` NÃO foi reescrito para a forma nova: ele é registro do que foi enviado, e " +
        "registro não se maquia para caber em régua nova. O recado perdido entrou MARCADO como recuperado",
      problemas,
    },
    null,
    2,
  )}\n`,
);

console.log(`  blocos: ${blocos.length} · abrem com o recado: ${abremComRecado.length}`);
console.log(`  cabeçalhos: ${cabecalhos.length} · compostos: ${compostos.length} [${compostos.join(" | ")}]`);
console.log(`  relatórios de prompt: ${relatorios.length} · sem recado: ${semRecado.length}`);
console.log(`  recados sem prompt nomeado (o buraco da trava): ${semPromptNomeado}`);
console.log(`\n  docs/provas/LAB-66/o-acumulado-dos-recados.json`);
if (problemas.length > 0) {
  console.error(`\n  ${problemas.length} PROBLEMA(S):`);
  for (const p of problemas) console.error(`   · ${p}`);
  process.exit(1);
}
console.log("  tudo conferido · zero problemas");
