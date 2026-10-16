/**
 * **LAB-122 (item 900) · a rotina, perguntada ao GitHub, contra o gatilho e as páginas** (D350).
 *
 * ```sh
 * bun test tests/a-rotina-no-github-na-origem.test.ts
 * ```
 *
 * Pergunta à API pública (`GET /repos/{dono}/{repo}/actions/workflows`, **sem chave** — o
 * repositório é público, e esta trava não carrega segredo nenhum) o estado da rotina do
 * `.github/workflows/verde.yml`, e o cruza com o gatilho do arquivo e com as afirmações vivas da
 * árvore. Hoje a resposta é `disabled_manually`, id 374646435.
 *
 * Precisa da **rede** — por isso **não** entra na lista do `guardas-sem-clones`. Roda no verde
 * completo (`conferir.sh`).
 *
 * **Nada pula.** Sem rede, com a cota sem chave estourada (60 por hora) ou com a rotina ausente da
 * resposta, a trava **falha com o que leu**, em vez de aprovar por não ter perguntado.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { CAMINHO_DA_ROTINA, afirmacoesDaArvore, conferirARotina, lerARotina, repositorioDoRemoto } from "../src/a-rotina-no-github.ts";
import { gatilhoAutomaticoLigado } from "../src/o-ci-que-roda.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

describe("LAB-122 · a rotina do GitHub, perguntada", () => {
  test("o estado e o id que as páginas afirmam são os que o GitHub responde, e o par está inteiro", () => {
    const remoto = spawnSync("git", ["remote", "get-url", "origin"], { cwd: RAIZ, encoding: "utf8" });
    const repositorio = repositorioDoRemoto(remoto.stdout ?? "");
    if (!repositorio) throw new Error(`o 'origin' não é do GitHub (${(remoto.stdout ?? "").trim() || remoto.stderr}) — não sei a quem perguntar`);

    const url = `https://api.github.com/repos/${repositorio}/actions/workflows`;
    const r = spawnSync("curl", ["-sS", "-m", "30", "-H", "Accept: application/vnd.github+json", url], { encoding: "utf8", timeout: 45_000 });
    const resposta = r.stdout ?? "";
    const rotina = lerARotina(resposta);

    const arvore = execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8" })
      .split("\n")
      .filter((f) => f !== "" && existsSync(join(RAIZ, f)))
      .map((arquivo) => ({ arquivo, texto: readFileSync(join(RAIZ, arquivo), "utf8") }));
    const lidas = afirmacoesDaArvore(arvore, repositorio);
    const gatilho = gatilhoAutomaticoLigado(readFileSync(join(RAIZ, CAMINHO_DA_ROTINA), "utf8"));

    // O universo, publicado: "verde" sem o que foi perguntado não se distingue de "não perguntei" (D23).
    console.log(
      `[a-rotina-no-github] ${repositorio} · ${CAMINHO_DA_ROTINA}: ` +
        (rotina ? `'${rotina.estado}', id ${rotina.id}` : `NÃO SEI (${(resposta || r.stderr || "sem resposta").trim().slice(0, 160)})`) +
        ` · gatilho ${gatilho ? "ligado" : "comentado"} · ${lidas.afirmacoes.length} afirmação(ões) em ${lidas.lidos} arquivos vivos`,
    );

    expect(conferirARotina(gatilho, rotina, lidas.afirmacoes)).toEqual([]);
  });
});
