/**
 * LAB-76 — O REGISTRO DE MOTORES DO LAB: a procedência medida e o universo publicado. (D68)
 *
 * Esta ferramenta é a metade que MEDE. O dado (`dados/registro-de-motores.json`) diz **de onde**
 * se lê a versão de cada motor e **de que repositório** ele vem; quem vai ao disco e à origem é
 * esta ferramenta, ao rodar.
 *
 * **Por que o commit não está no dado:** porque ele muda sozinho. Os três clones vizinhos
 * estavam 18 a 23 commits atrás da origem quando o LAB-74 mediu, e 22 a 28 no dia seguinte, sem
 * ninguém tocar neles. Número gravado que ninguém revalida envelhece em silêncio (D104), e foi
 * assim que esta casa publicou disco como se fosse origem em seis recados (D241).
 *
 * **O `git fetch` é de leitura** — mexe só nas referências locais do clone, nenhum arquivo
 * rastreado muda, e o `git status` deles continua limpo (§4).
 *
 * E ela **publica o tamanho do universo** que leu, que é a trava que vale:
 *
 * > *Conferência que não publica o tamanho do universo que leu passa lendo zero.*
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { MOTOR_VERSAO } from "@testfit/contrato/tipos.ts";

import {
  carimbarVizinhos,
  conferirContraAOrigem,
  type ConferenciaDaOrigem,
} from "../src/commit-dos-vizinhos.ts";
import { MOTORES_DE_LOTE } from "../src/acesso.ts";
import * as inventario from "../src/inventario-das-pontes.ts";
import {
  conferirORegistro,
  lerORegistro,
  ligados,
  padraoDoLab,
  procedenciaDosMotores,
  universoLido,
} from "../src/registro-do-lab.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-76");

const registro = lerORegistro();

/**
 * Resolve a VERSÃO de onde o dado diz que ela se lê.
 *
 * São duas formas hoje, e as duas estão declaradas no dado — não adivinhadas aqui. Fonte nova
 * pede uma linha nova neste mapa **e** no dado, e é de propósito: resolvedor que "dá um jeito"
 * numa fonte que ninguém declarou é o comentário envelhecendo outra vez.
 */
const RESOLVEDORES: Record<string, () => string | null> = {
  "@testfit/contrato/tipos.ts · MOTOR_VERSAO": () => MOTOR_VERSAO,
  "external-engines/symbios/upstream/VERSION": () => {
    const caminho = join(RAIZ, "external-engines", "symbios", "upstream", "VERSION");
    if (!existsSync(caminho)) return null;
    const linha = readFileSync(caminho, "utf8")
      .split("\n")
      .find((l) => l.startsWith("Upstream version:"));
    if (linha === undefined) return null;
    const m = /Upstream version:\s*(\S+)/.exec(linha);
    return m?.[1] ?? null;
  },
};

interface VersaoDeMotor {
  motor: string;
  versao: string | null;
  /** `lida` = veio do motor; `declarada` = escrita à mão; `nao-medida` = não se leu. */
  origem: "lida" | "declarada" | "nao-medida";
  de: string | null;
}

const versoes: VersaoDeMotor[] = registro.motores.map((m): VersaoDeMotor => {
  const { versaoLidaDe, versaoDeclarada } = m.procedencia;
  if (versaoLidaDe !== null) {
    const r = RESOLVEDORES[versaoLidaDe];
    if (r === undefined) {
      return { motor: m.id, versao: null, origem: "nao-medida", de: versaoLidaDe };
    }
    const v = r();
    return {
      motor: m.id,
      versao: v,
      origem: v === null ? "nao-medida" : "lida",
      de: versaoLidaDe,
    };
  }
  if (versaoDeclarada !== null) {
    return { motor: m.id, versao: versaoDeclarada, origem: "declarada", de: null };
  }
  return { motor: m.id, versao: null, origem: "nao-medida", de: null };
});

// ── A procedência, medida contra a ORIGEM e não contra o disco (LAB-74) ─────────
const origens = new Map<string, ConferenciaDaOrigem>();
for (const c of carimbarVizinhos()) {
  origens.set(
    c.repo,
    conferirContraAOrigem(c.repo, c.commit, c.origemMain ?? null, c.atrasPor ?? null),
  );
}

const procedencia = procedenciaDosMotores(registro, origens);
const universo = universoLido(registro);
const NOMES_DO_INVENTARIO = Object.keys(inventario).filter((n) => /^[A-Z_]+$/.test(n));
const conferencia = conferirORegistro(
  registro,
  ligados(registro).map((m) => m.id),
  MOTORES_DE_LOTE,
  NOMES_DO_INVENTARIO,
);

// ── O que vai à tela ───────────────────────────────────────────────────────────
console.log("\n═══ LAB-76 · O REGISTRO DE MOTORES DO LAB ═══\n");
console.log(`O UNIVERSO LIDO: ${universo.comoSeDiz}`);
console.log(`O motor padrão: \`${padraoDoLab(registro)}\` (PADRAO_DE_FABRICA, da peça do LAB-06)`);
console.log(
  `Na comparação de LOTE entram ${MOTORES_DE_LOTE.length} dos ${universo.ligados} ligados — ` +
    "o Symbios fica fora porque entrega QUADRA (D50), e isso não é estar desligado\n",
);

console.log("A PROCEDÊNCIA, motor a motor:");
for (const p of procedencia) {
  const v = versoes.find((x) => x.motor === p.motor);
  const versao = v?.versao === null || v === undefined ? "versão NÃO MEDIDA" : `versão ${v.versao} (${v.origem})`;
  console.log(`  · ${p.motor} [${p.veredito}] — ${versao}`);
  console.log(`      ${p.comoSeDiz}`);
}

console.log(`\nA CONFERÊNCIA: ${conferencia.ok ? "passa" : "REPROVA"}`);
if (!conferencia.ok) {
  console.log(`  fora do registro: ${conferencia.fora.join(", ") || "—"}`);
  console.log(`  ligados que a porta não produz: ${conferencia.prometidosQueNaoExistem.join(", ") || "—"}`);
  console.log(`  lote fora do registro: ${conferencia.loteForaDoRegistro.join(", ") || "—"}`);
  console.log(`  lote não ligado: ${conferencia.loteQueNaoEstaLigado.join(", ") || "—"}`);
  console.log(`  ponteiros sem destino: ${conferencia.apontamDesconhecido.map((a) => a.nome).join(", ") || "—"}`);
}

mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "registro-de-motores.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-76",
      oQueIstoMede:
        "o registro de motores do Lab (D68): quais motores esta casa conhece, a procedência de " +
        "cada um MEDIDA contra a origem (não contra o disco), de onde se lê a versão de cada um, " +
        "e o TAMANHO DO UNIVERSO — quantos motores havia e quantos estavam ligados",
      oQueIstoNaoMede:
        "nenhuma gleba. Esta prova não roda motor nenhum: ela confere o registro, e por isso " +
        "está na lista declarada de exceções do §7 (regras.test.ts)",
      quando: new Date().toISOString(),
      oChao: { bun: Bun.version, plataforma: process.platform },
      universo,
      padrao: padraoDoLab(registro),
      motoresDeLote: [...MOTORES_DE_LOTE],
      porQueOSymbiosFicaForaDoLote:
        "entrega QUADRA, e os lotes dele são da subdivisão do Lab (D50). Ficar fora da " +
        "comparação de lote NÃO é estar desligado — são duas perguntas diferentes",
      versoes,
      procedencia,
      conferencia,
      osClonesVizinhos: [...origens.values()],
    },
    null,
    2,
  )}\n`,
);
console.log(`\nprova: docs/provas/LAB-76/registro-de-motores.json\n`);
