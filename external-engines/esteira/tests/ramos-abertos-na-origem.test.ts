/**
 * **LAB-121 (item 900) · os ramos da ORIGEM contra `docs/RAMOS_ABERTOS.md`** (D349).
 *
 * ```sh
 * bun test tests/ramos-abertos-na-origem.test.ts
 * ```
 *
 * Pergunta à origem (`git ls-remote --heads origin`) quais ramos existem e, para cada um, se a
 * ponta já está inteira na `main` da origem (`git merge-base --is-ancestor`). Precisa da **rede**
 * e da **história** — por isso **não** entra na lista do `guardas-sem-clones`: o
 * `actions/checkout` traz a ponta sem a história, e todo ramo sairia *"não sei"*. Roda no verde
 * completo (`conferir.sh`).
 *
 * **Nada pula.** Sem rede, sem `origin` ou sem o objeto da ponta no clone, a trava **falha com a
 * receita** (`git fetch origin`, e desrasar), em vez de aprovar por não ter lido. E publica o
 * universo que leu: quantos ramos, quais mesclados.
 */
import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { RAMO_PRINCIPAL, conferirOsRamos, lerAPagina, lerOsRamosDaOrigem, type RamoNaOrigem } from "../src/ramos-abertos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const RECEITA =
  "rode, na raiz: `git fetch -q origin` e, se o clone for raso, `git fetch -q --unshallow origin` " +
  "(o passo 0 do docs/caixa-de-entrada/COMO_FUNCIONA.md)";

function git(...args: string[]): { ok: boolean; saida: string } {
  const r = spawnSync("git", args, { cwd: RAIZ, encoding: "utf8", timeout: 60_000 });
  return { ok: r.status === 0, saida: (r.stdout ?? "") + (r.stderr ?? "") };
}

describe("LAB-121 · os ramos da origem, cruzados com a página", () => {
  test("todo ramo não mesclado tem linha, e toda linha é de ramo aberto — o universo publicado", () => {
    const ls = git("ls-remote", "--heads", "origin");
    if (!ls.ok) throw new Error(`não li a origem (${ls.saida.trim()}) — ${RECEITA}`);
    const ramos = lerOsRamosDaOrigem(ls.saida);
    const principal = ramos.find((r) => r.nome === RAMO_PRINCIPAL);
    // Sem a main, a leitura veio errada (ou de outro repositório): reprova, nunca 'nenhum ramo'.
    if (!principal) throw new Error(`a origem não tem '${RAMO_PRINCIPAL}' — a leitura não é desta casa`);

    const origem: RamoNaOrigem[] = ramos.map((r) => {
      if (r.nome === RAMO_PRINCIPAL) return { nome: r.nome, mesclado: true };
      const temOs2 = git("cat-file", "-e", `${r.sha}^{commit}`).ok && git("cat-file", "-e", `${principal.sha}^{commit}`).ok;
      if (!temOs2) return { nome: r.nome, mesclado: null };
      return { nome: r.nome, mesclado: git("merge-base", "--is-ancestor", r.sha, principal.sha).ok };
    });

    const linhas = lerAPagina(readFileSync(join(RAIZ, "docs", "RAMOS_ABERTOS.md"), "utf8"));
    expect(linhas).not.toBeNull();

    // O universo, publicado: "verde" sem o que foi lido não se distingue de "não li" (D23).
    console.log(
      `[ramos-abertos] ${origem.length} ramo(s) na origem: ` +
        origem.map((r) => `${r.nome} (${r.mesclado === null ? "não sei" : r.mesclado ? "mesclado" : "ABERTO"})`).join(", ") +
        ` · ${linhas!.length} linha(s) na página`,
    );

    const problemas = conferirOsRamos(origem, linhas!);
    if (problemas.some((p) => p.tipo === "nao-sei-se-mesclou")) console.log(`[ramos-abertos] ${RECEITA}`);
    expect(problemas).toEqual([]);
  });
});
