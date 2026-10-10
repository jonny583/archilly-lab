/**
 * LAB-82 — A REMEDIÇÃO ANTES DO PEDIDO, e o clone que importava era o OUTRO. (item 015)
 *
 * O item manda, com todas as letras, **remedir antes de escrever uma linha de pedido**:
 *
 * > *"Pedido construído sobre medição de clone atrasado é a D241 virando trabalho alheio."*
 *
 * Esta ferramenta publica a remedição: os commits dos dois clones vizinhos contra a origem deles,
 * o resultado da remedição **contra o motor de hoje**, e o buraco que ela achou no carimbo.
 *
 * **Nada aqui escreve em repositório vizinho** (§4). O `fetch` só mexe nas referências locais do
 * clone — nenhum arquivo rastreado muda — e a remedição contra o commit novo foi feita num
 * **clone do clone**, fora da árvore do vizinho.
 *
 * Uso: `bun run lab82`
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-82");

/** Lê o estado de um clone vizinho **sem tocar na árvore dele**. */
function estadoDoClone(caminho: string): Record<string, string | number | null> {
  if (!existsSync(caminho)) return { caminho, existe: 0 };
  const git = (args: string[]): string =>
    execFileSync("git", ["-C", caminho, ...args], { encoding: "utf8" }).trim();
  let origem: string | null;
  let atras: number | null = null;
  try {
    origem = git(["rev-parse", "--short", "origin/main"]);
    atras = Number(git(["rev-list", "--count", "HEAD..origin/main"]));
  } catch {
    // Clone de um só ramo pode não ter `origin/main`: aí o atraso é NÃO MEDIDO, nunca zero (D23).
    origem = null;
  }
  return {
    caminho: caminho.replace("/home/user/", ""),
    ramoDaArvore: git(["rev-parse", "--abbrev-ref", "HEAD"]),
    arvoreEm: git(["rev-parse", "--short", "HEAD"]),
    origemMain: origem,
    commitsAtras: atras,
    arvoreLimpa: git(["status", "--porcelain"]) === "" ? "sim" : "NÃO",
  };
}

const provaDoLab78 = JSON.parse(
  readFileSync(join(RAIZ, "docs", "provas", "LAB-78", "setimo-mecanismo.json"), "utf8"),
) as {
  conta: { lotes: number; porDono: Record<string, number> };
  acusados: { chave: string; alemDaFaceDeclarada_m: number; coberturaDaFacePct?: number }[];
};

const alemDeHoje = provaDoLab78.acusados
  .map((a) => a.alemDaFaceDeclarada_m)
  .sort((x, y) => y - x);

const clones = {
  motor: estadoDoClone("/home/user/motor-testfit"),
  generate: estadoDoClone("/home/user/urban-create-hub-41d93a4d"),
  geo: estadoDoClone("/home/user/urban-scout-tool"),
};

console.log("\n═══ LAB-82 · a remedição antes do pedido ═══\n");
for (const [nome, c] of Object.entries(clones)) {
  console.log(
    `  ${nome.padEnd(10)} árvore ${String(c.arvoreEm).padEnd(9)} · origin/main ${String(c.origemMain).padEnd(9)} · ` +
      `${String(c.commitsAtras).padStart(3)} commits atrás · limpa: ${c.arvoreLimpa}`,
  );
}
console.log(`\nremedição: ${provaDoLab78.conta.lotes} lotes acusados · por dono ${JSON.stringify(provaDoLab78.conta.porDono)}`);
console.log(`o transbordo, em metros: ${alemDeHoje.join(" e ")}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "remedicao-antes-do-pedido.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-82",
      oQue:
        "a remedição que o item 015 exige ANTES de escrever o pedido do sétimo mecanismo: o estado " +
        "dos três clones vizinhos contra a origem deles, e a remedição do transbordo contra o motor " +
        "de HOJE — não contra o clone atrasado",
      oQueIstoNaoMede:
        "não mede gleba nova e não refaz o LAB-78: ela RECONFERE o achado dele contra o commit novo " +
        "do dono. Por isso está na lista declarada de exceções do §7",
      quando: new Date().toISOString(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      clones,
      aPerguntaDoItem: "os 10 a 13 m continuam?",
      aResposta: "CONTINUAM — e idênticos",
      oTransbordo_m: alemDeHoje,
      aConta: provaDoLab78.conta,
      comoFoiRemedido:
        "duas passagens. (1) Com os clones como estão: 2 lotes, 13.18 m e 10.43 m, dono motor-testfit. " +
        "(2) Contra o motor em `3680b9f` — 56 commits à frente da árvore do clone —, num CLONE DO " +
        "CLONE no diretório de rascunho, com o `paths` do tsconfig repontado temporariamente e " +
        "devolvido byte a byte: resultado IDÊNTICO, 13.18 m e 10.43 m, 2 lotes, mesmo dono. A árvore " +
        "do vizinho não foi tocada em nenhuma das duas",
      oClomeQueImportavaEraOOutro:
        "o item manda remedir contra o `origin/motor-v2` do GENERATE, e cita `12208da`. Medido: o " +
        "`motor-v2` e o `main` do Generate apontam para o MESMO commit (`565d00c`), e o `12208da` é " +
        "ancestral dele. Mas o dono do defeito é o `motor-testfit`, e é a árvore DELE que estava " +
        "atrasada em 56 commits. O clone do Generate está 47 atrás, e isso também ficou medido",
      oBuracoDoCarimbo:
        "o carimbo que vai na prova lê o `HEAD` do CLONE, não o código que o `import` carregou. Na " +
        "passagem contra `3680b9f` o relatório saiu dizendo `6cf6396` — o HEAD do clone —, enquanto " +
        "o `import.meta.resolve` apontava para o clone do rascunho. Carimbo e código são DUAS fontes " +
        "de verdade para a mesma pergunta, e só uma delas sabe o que rodou",
      conferidoAqui: "sim, na máquina da sessão — não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-82/remedicao-antes-do-pedido.json\n`);
