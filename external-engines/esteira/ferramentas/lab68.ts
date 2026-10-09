/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-68 · item 001 — as duas pilhas, e o carimbo do vizinho na prova.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O item 001 pede duas coisas: **separar as 11 falhas em duas pilhas com prova de cada uma** —
 * as que mudam quando o clone vizinho muda de commit e as que não —, e **gravar o commit de
 * cada clone dentro de toda prova que o use**.
 *
 * Esta ferramenta carimba. A separação foi feita **rodando**, e o resultado está aqui.
 *
 * Uso: `bun run lab68`
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  VIZINHOS,
  conferirContraAOrigem,
  type CarimboDeVizinho,
  type CarimboDoChao,
} from "../src/commit-dos-vizinhos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-68");

/**
 * O carimbo de hoje: o `HEAD` de cada clone, se ele estava limpo — **e o que a ORIGEM diz**.
 *
 * **O segundo eixo entrou no item 007, e entrou porque eu errei:** por seis recados eu publiquei
 * o `HEAD` do disco como *"o estado do vizinho"*, com os três clones **18 a 23 commits atrás**
 * da `origin/main` (D241). *O que está no disco não é o que está na origem.*
 *
 * **O `fetch` é de leitura**: ele mexe só nas referências locais do clone — nenhum arquivo
 * rastreado muda, e o `git status` dele continua limpo, o que a §4 exige e esta função confere.
 * **E nada é PUXADO:** atualizar o clone mudaria toda medição desta casa, e isso é prompt, não
 * conserto silencioso (D226).
 */
export function carimbarVizinhos(): CarimboDeVizinho[] {
  const carimbos: CarimboDeVizinho[] = [];
  for (const repo of VIZINHOS) {
    const caminho = join(RAIZ, "..", repo);
    if (!existsSync(join(caminho, ".git"))) continue;
    const git = (...a: string[]): string =>
      execFileSync("git", ["-C", caminho, ...a], { encoding: "utf8" }).trim();
    const tentar = (...a: string[]): string | null => {
      try {
        return git(...a);
      } catch {
        return null; // sem rede ou sem `origin`: NÃO MEDIDO, e não "em dia"
      }
    };
    tentar("fetch", "-q", "origin", "main");
    const origemMain = tentar("rev-parse", "--short", "origin/main");
    const atras = tentar("rev-list", "--count", "HEAD..origin/main");
    carimbos.push({
      repo,
      commit: git("rev-parse", "--short", "HEAD"),
      limpo: git("status", "--porcelain") === "",
      origemMain,
      atrasPor: atras === null ? null : Number(atras),
    });
  }
  return carimbos;
}

/** O chão em que a medição rodou — a variável que faltava (09/10). */
export const oChao: CarimboDoChao = { bun: Bun.version, plataforma: process.platform };

const osClonesVizinhos = carimbarVizinhos();
mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "as-duas-pilhas.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-68",
      oQueIstoMede:
        "de onde vêm as 11 falhas do verde, separadas RODANDO e não deduzidas pelo nome do " +
        "arquivo — e o carimbo do commit de cada clone vizinho, que é o que faltava para a " +
        "pergunta 'o motor andou ou a minha ponte mudou?' ter resposta",
      aPergunta: "item 001 da caixa de entrada, que veio do meu próprio recado do LAB-67",
      quando: new Date().toISOString(),
      osClonesVizinhos,
      oChao,
      aCORRECAODO_D223: {
        oQueEuTinhaDITO:
          "'os clones vizinhos foram recriados em commits mais novos e o verde ficou vermelho' — " +
          "publicado no recado do LAB-67, no PR #90 e no ONDE_PARAMOS",
        oQueE:
          "FALSO na causa, verdadeiro no veredicto. As falhas não eram da entrega — isso o " +
          "`git stash` provou —, mas a causa que eu NOMEEI estava errada: nenhuma das 11 muda " +
          "com o commit do vizinho",
        comoFoiMedido:
          "quatro commits do motor (19/09, 05/10, 07/10a, 07/10b), dois do hub (05/10, 08/10) e " +
          "o meu próprio código no commit em que o verde estava VERDE (bb2fbcc) — resultado " +
          "idêntico em todos",
        aFamilia: "é o §6, décima oitava vez: veredicto certo, CAUSA errada — e a causa é o que saiu",
      },
      asDuasPilhas: {
        mudamComOCommitDoVizinho: {
          quantas: 0,
          deQuantas: 11,
          comoFoiProvado:
            "as que rodam o motor foram remedidas em 4 commits do motor e 2 do hub; o número " +
            "não se mexeu em nenhum",
        },
        naoMudam: [
          {
            quantas: 9,
            oQue: "`.wasm` ausente",
            quais: ["poligono", "relevo", "recorte", "coluna-vertebral", "contrato-v2", "porta", "identidade (2)", "guarda-da-ponte (arrasto)"],
            deQuemE:
              "DAQUI. É artefato de build do próprio repositório, não versionado de propósito, " +
              "e o contêiner o apagou ao reiniciar. Nenhuma relação com clone vizinho",
            consertado: "compilado com a receita do `conferir.sh` — 14,23 s",
            aLicao:
              "o `conferir.sh` PEGA isto na precondição e falha com a receita (D124). O `bun test` " +
              "sozinho não pega, e foi `bun test` que eu rodei no LAB-67 antes de atribuir",
          },
          {
            quantas: 2,
            oQue: "campo novo do motor sem destino escrito na ponte",
            quais: ["plano[].travessias", "plano[].indicadores"],
            deQuemE: "DAQUI, e é violação real da §4: a ponte os largava em SILÊNCIO",
            consertado:
              "destino escrito em `inventario-das-pontes.ts`, os dois como PERDA DECLARADA — " +
              "procurado `travessia` e `indicador` no contrato do Generate, as únicas citações " +
              "são da ENTRADA (restrição, `eixoDoCurso`), nunca da SAÍDA",
          },
          {
            quantas: 1,
            oQue: "a minha própria trava do LAB-67 casando consigo mesma",
            quais: ["vazamento-de-custo · chamada paga de IA"],
            deQuemE:
              "DAQUI, e nasceu ontem: o padrão procurava `PedidoIA`/`new OpenAI` no texto, e o " +
              "fonte da trava CARREGA esses nomes. Latente até o arquivo entrar no git",
            consertado:
              "passou a procurar no IMPORT e na CHAMADA (D142), e o fonte da própria régua saiu " +
              "do escopo, como os outros documentos que falam do assunto (D155)",
          },
          {
            quantas: 1,
            oQue: "NÃO ATRIBUÍDA — e fica dita assim",
            quais: ["testada-de-frente · 'fixada a amostragem, a frente troca lote de dentro'"],
            oNumero: "sem as faces 449 lotes, com as faces 492 — a trava exige com < sem",
            oQueJaFoiDESCARTADO:
              "não é o motor (4 commits, 19/09 a 07/10, mesmo 449→492), não é o hub (2 commits), " +
              "e não é mudança minha (o código de bb2fbcc, quando o verde estava verde, dá o mesmo)",
            oQueSOBRA:
              "o CHÃO: o contêiner trocou o Bun de 1.3.11 para 1.4.2 ao reiniciar. É a única " +
              "variável que sobrou depois de segurar quatro versões do motor, duas do hub e o " +
              "meu próprio código do commit verde — e a segunda medição que se moveu sozinha " +
              "(a rampa de `ensaio-com-via`, 21,63 % → 17,92 %) tem exatamente o mesmo padrão. " +
              "ATRIBUÍDO AO TOOLCHAIN, e NÃO PROVADO: provar exigiria voltar o Bun a 1.3.11, " +
              "que esta máquina não tem. O que está provado é o que foi DESCARTADO",
          },
        ],
      },
      aReguaDoCarimbo: {
        ondeMora: "external-engines/esteira/src/commit-dos-vizinhos.ts",
        oQueElaFAZ:
          "DIZ, não reprova: `igual`, `mudou` (com o de antes e o de agora), `nao-gravado` e " +
          "`clone-ausente`. Reprovar trataria 'o motor andou' como defeito meu, que é a confusão " +
          "que este item veio desfazer",
        porQue_naoGravado_naoEh_igual:
          "prova anterior ao carimbo é NÃO MEDIDA. Zero é uma medição, nulo é 'não medi' (D23)",
        osDoisLadosDemonstrados: {
          casoBom: "carimbo igual ao HEAD do clone de verdade → `igual`",
          casoRuim: "carimbo de um commit que EXISTE no histórico do motor e não é o HEAD → `mudou`",
          onde: "tests/commit-dos-vizinhos.test.ts, 8 travas, contra o clone real e não contra fixture",
        },
      },
      oQueNAOFoiFeito:
        "as provas ANTIGAS não foram carimbadas retroativamente. Carimbá-las exigiria regerá-las, " +
        "e regerar prova 'antes' com número 'depois' é o que o D182 proíbe. Elas saem `nao-gravado`, " +
        "que é a verdade sobre elas",
    },
    null,
    2,
  )}\n`,
);
console.log("  clones carimbados:");
for (const c of osClonesVizinhos) {
  const origem = conferirContraAOrigem(c.repo, c.commit, c.origemMain ?? null, c.atrasPor ?? null);
  console.log(
    `   · ${c.repo}@${c.commit} ${c.limpo ? "(limpo)" : "(SUJO)"} · origem: ${origem.veredito}` +
      (origem.veredito === "atras" ? ` por ${c.atrasPor} (origin/main@${c.origemMain})` : ""),
  );
}
console.log("\n  docs/provas/LAB-68/as-duas-pilhas.json");
