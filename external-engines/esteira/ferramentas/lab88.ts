/**
 * LAB-88 · A procedência do Padrão da família, e as três formas medidas.
 *
 * Uso: `bun run lab88`
 *
 * **Esta prova não mede gleba nenhuma** — ela mede documento e repositório, e por isso está na
 * lista declarada de exceções do §7 (LAB-36).
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_FONTE_DO_PADRAO,
  CAMINHO_DO_PONTEIRO,
  COMMIT_DA_COPIA_QUE_SAIU,
  OS_DOIS_TEXTOS_DA_3_0,
  conferirOPonteiro,
} from "../src/onde-esta-o-padrao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const SAIDA = join(RAIZ, "docs", "provas", "LAB-88");
const ler = (p: string): string | null => {
  try {
    return readFileSync(join(RAIZ, p), "utf8");
  } catch {
    return null;
  }
};

const problemas = conferirOPonteiro(ler(CAMINHO_DO_PONTEIRO));
const [antes, depois] = OS_DOIS_TEXTOS_DA_3_0;
const fracaoLinhas = (COMMIT_DA_COPIA_QUE_SAIU.linhas / A_FONTE_DO_PADRAO.linhas) * 100;
const fracaoBytes = (COMMIT_DA_COPIA_QUE_SAIU.bytes / A_FONTE_DO_PADRAO.bytes) * 100;

const AS_TRES_FORMAS = [
  {
    forma: 1,
    nome: "ponteiro com procedência",
    escolhida: true,
    porque:
      "o que esta casa pode manter é ONDE a coisa está, qual commit foi lido e quando — e o " +
      "ponteiro ficou no MESMO caminho, para nenhum link morrer e para o aviso estar onde quem " +
      "procura o Padrão chega",
    executavelSemRede: true,
  },
  {
    forma: 2,
    nome: "cópia com carimbo e guarda contra o commit da origem",
    escolhida: false,
    porque:
      "a fonte é PRIVADA e este repositório é PÚBLICO: o verde roda sem rede por desenho e o " +
      "trabalho de CI que roda em todo envio não tem segredo. A trava ficaria VERDE por não " +
      "achar o objeto, que é o D213 — e seria um TERCEIRO vizinho privado a pedir no §11",
    executavelSemRede: false,
  },
  {
    forma: 3,
    nome: "congelada e declarada, com o tamanho",
    escolhida: false,
    porque:
      "declarar a VERSÃO é declarar um rótulo, e o rótulo `3.0` cobre DOIS textos na origem " +
      "(+19 linhas, +1 314 bytes, mesmo número). Quem abrisse o arquivo leria 145 linhas com " +
      "cara de documento normativo, com o aviso no índice de outra página",
    executavelSemRede: true,
  },
] as const;

console.log("══════════ LAB-88 · onde está o Padrão da família ══════════");
console.log(`  fonte: ${A_FONTE_DO_PADRAO.repositorio} (${A_FONTE_DO_PADRAO.visibilidade}) · ${A_FONTE_DO_PADRAO.caminho}`);
console.log(`         Versão ${A_FONTE_DO_PADRAO.versao} · commit ${A_FONTE_DO_PADRAO.commit} · ${A_FONTE_DO_PADRAO.linhas.toLocaleString("pt-BR")} linhas`);
console.log(`  a cópia que saiu: ${COMMIT_DA_COPIA_QUE_SAIU.linhas} linhas = ${fracaoLinhas.toFixed(1)} % das linhas e ${fracaoBytes.toFixed(1)} % dos bytes`);
console.log(`  o rótulo "3.0" cobre DOIS textos: ${antes!.commit} (${antes!.linhas}) e ${depois!.commit} (${depois!.linhas})`);
console.log("");
for (const f of AS_TRES_FORMAS) {
  console.log(`  ${f.escolhida ? "✓ ESCOLHIDA" : "✗ recusada  "} forma ${f.forma} · ${f.nome}`);
}
console.log(`\n  o ponteiro: ${problemas.length === 0 ? "zero problemas" : `${problemas.length} problema(s)`}`);
for (const p of problemas) console.log(`      ${p.tipo} · ${p.oQue}`);

mkdirSync(SAIDA, { recursive: true });
writeFileSync(
  join(SAIDA, "onde-esta-o-padrao.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-88",
      oQue: "a procedência do Padrão da família e as três formas que o item 021 pôs na mesa, medidas",
      oQueIstoNaoMede:
        "não mede gleba, motor nem semente — mede documento e repositório, e está na lista de exceções do §7",
      quando: new Date().toISOString(),
      aFonte: A_FONTE_DO_PADRAO,
      aCopiaQueSaiu: { ...COMMIT_DA_COPIA_QUE_SAIU, fracaoDasLinhas: Number(fracaoLinhas.toFixed(1)), fracaoDosBytes: Number(fracaoBytes.toFixed(1)) },
      oRotuloCobreDoisTextos: {
        osDois: OS_DOIS_TEXTOS_DA_3_0,
        diferencaDeLinhas: depois!.linhas - antes!.linhas,
        diferencaDeBytes: depois!.bytes - antes!.bytes,
        oQueIssoDecide:
          "rótulo não é identidade (D148): só o commit identifica o texto — e a cópia vendorizada do " +
          "Parcelamento é byte a byte igual à PRIMEIRA das duas, já atrás sem o número mudar",
      },
      asTresFormas: AS_TRES_FORMAS,
      oPonteiro: { caminho: CAMINHO_DO_PONTEIRO, problemas },
      aCorrecaoDoD291:
        "o D291 dizia 03/10, PR #40; medido com história inteira é 4081c27, 14/09, PR #12 — o número errado " +
        "era o commit do CORTE de um clone raso (D293)",
      conferidoAqui: "verde na mão, não no GitHub (§7)",
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-88/onde-esta-o-padrao.json`);
