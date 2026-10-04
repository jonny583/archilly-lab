#!/usr/bin/env bun
/**
 * A PROVA NO NAVEGADOR, AUTOMÁTICA. (LAB-31)
 *
 * ```sh
 * bun ferramentas/navegador/prova-automatica.ts
 * ```
 *
 * # Por que ela existe
 *
 * A prova no navegador existia desde o LAB-01 e era **inteiramente manual**:
 * compilar o WASM, copiar o artefato, servir por HTTP, abrir o navegador e **ler
 * com o olho**. O `README.md` ao lado registra a única medição feita assim —
 * **10/09/2026, Chromium** — e ela nunca mais foi refeita.
 *
 * **Prova que depende de olho humano é prova que não roda.** É o mesmo defeito do
 * D110, uma camada mais funda: lá a suíte existia e ninguém a rodava; aqui a prova
 * existia e ninguém podia rodá-la sem ser uma pessoa.
 *
 * # O que ela faz, e o que NÃO faz
 *
 * Sobe a mesma página, no mesmo Chromium, e lê o resultado como **dado**
 * (`window.__prova`) em vez de prosa. Não substitui a página: ela continua
 * servível à mão, com o desenho na tela, que é o que um humano quer ver.
 *
 * **Ela não reconstrói o WASM.** O artefato não é versionado de propósito (ver o
 * `.gitignore`, que argumenta o porquê), e compilá-lo exige o alvo
 * `wasm32-unknown-unknown`, que não está instalado nesta máquina. Então a
 * precondição é **conferida e dita em voz alta**: faltando o arquivo, isto
 * **falha** com o comando exato para produzi-lo. Nunca pula.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "playwright";

/**
 * O Chromium desta máquina, e por que o caminho é explícito.
 *
 * O ambiente traz um Chromium pronto em `PLAYWRIGHT_BROWSERS_PATH`, e o pacote
 * `playwright` instalado pelo `bun add` espera **a revisão dele**, que não é a que
 * está aqui. Em vez de baixar um segundo navegador, aponta-se para o que existe.
 *
 * Faltando o caminho, cai no padrão do Playwright — e se nem ele achar, a função
 * `morrer` abaixo diz como instalar. **Em nenhum caminho isso pula em silêncio.**
 */
const CHROMIUM = process.env["PLAYWRIGHT_BROWSERS_PATH"]
  ? join(process.env["PLAYWRIGHT_BROWSERS_PATH"], "chromium")
  : null;

const AQUI = import.meta.dirname;
const RAIZ = join(AQUI, "..", "..", "..", "..", "..");
const WASM_CONSTRUIDO = join(
  RAIZ, "external-engines", "symbios", "archilly", "wasm", "target",
  "wasm32-unknown-unknown", "release", "archilly_symbios_wasm.wasm",
);
const WASM_DA_PAGINA = join(AQUI, "archilly_symbios_wasm.wasm");
const PROVAS = join(RAIZ, "docs", "provas", "LAB-31");

/** O que a medição de 10/09/2026 registrou, no `README.md` ao lado. */
const DE_10_09 = { versao_motor: "0.4.1", nos: 6242, arestas: 6514, quadras: 275, bytesDoWasm: 193174 };

function morrer(porque: string, comoResolver: string): never {
  console.error(`\n✗ a prova no navegador NÃO rodou: ${porque}\n\n${comoResolver}\n`);
  process.exit(1);
}

// ── A precondição, conferida e dita ───────────────────────────────────────────
if (!existsSync(WASM_CONSTRUIDO) && !existsSync(WASM_DA_PAGINA)) {
  morrer(
    "o `.wasm` do adaptador não existe nesta máquina",
    [
      "Ele é ARTEFATO DE BUILD e não é versionado de propósito (ver `.gitignore`).",
      "Para produzi-lo:",
      "",
      "  rustup target add wasm32-unknown-unknown",
      "  cd external-engines/symbios/archilly/wasm",
      "  RUSTFLAGS='--cfg getrandom_backend=\"custom\"' \\",
      "    cargo build --release --target wasm32-unknown-unknown",
    ].join("\n"),
  );
}
if (existsSync(WASM_CONSTRUIDO)) copyFileSync(WASM_CONSTRUIDO, WASM_DA_PAGINA);

// ── O servidor: `file://` não serve, o `fetch` de wasm exige HTTP ─────────────
const PORTA = 8099;
const servidor = Bun.serve({
  port: PORTA,
  fetch(req) {
    const caminho = new URL(req.url).pathname;
    const arquivo = caminho === "/" ? "index.html" : caminho.slice(1);
    const cheio = join(AQUI, arquivo);
    if (!existsSync(cheio)) return new Response("não achei", { status: 404 });
    const tipo = arquivo.endsWith(".wasm")
      ? "application/wasm"
      : arquivo.endsWith(".js")
        ? "text/javascript"
        : "text/html";
    return new Response(readFileSync(cheio), { headers: { "content-type": tipo } });
  },
});

type Prova = {
  ok: boolean;
  versao_motor: string;
  nos: number;
  arestas: number;
  quadras: number;
  bytesDoWasm: number;
  ms: number;
};

let prova: Prova | null = null;
let erroNaPagina: string | null = null;
const log: string[] = [];

try {
  const navegador = await chromium.launch(
    CHROMIUM && existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {},
  );
  const pagina = await navegador.newPage();
  pagina.on("console", (m) => log.push(`[${m.type()}] ${m.text()}`));
  pagina.on("pageerror", (e) => {
    erroNaPagina = String(e);
  });
  await pagina.goto(`http://127.0.0.1:${PORTA}/`, { waitUntil: "load" });
  // O `__provaConcluida` é a última linha da página; esperar por ele é esperar
  // pelo fim do trabalho, e não por um tempo arbitrário que um dia não basta.
  await pagina.waitForFunction("window.__provaConcluida === true", null, { timeout: 60_000 });
  prova = (await pagina.evaluate("window.__prova")) as Prova;
  await navegador.close();
} catch (e) {
  servidor.stop(true);
  morrer(
    `o Chromium não rodou a página — ${e instanceof Error ? e.message : String(e)}`,
    erroNaPagina
      ? `A página lançou: ${erroNaPagina}`
      : [
          "Se o navegador não foi encontrado, instale-o:",
          "",
          "  cd external-engines/esteira && bunx playwright install chromium",
        ].join("\n"),
  );
}
servidor.stop(true);

if (!prova) morrer("a página terminou sem publicar `window.__prova`", log.join("\n"));

// ── A conferência: o que a página deu contra o que o LAB-01 mediu ────────────
const divergencias: string[] = [];
if (!prova.ok) divergencias.push("o motor devolveu `ok: false`");
for (const [campo, esperado] of Object.entries(DE_10_09)) {
  const achado = (prova as unknown as Record<string, unknown>)[campo];
  if (achado !== esperado) divergencias.push(`${campo}: esperado ${esperado}, veio ${achado}`);
}

mkdirSync(PROVAS, { recursive: true });
writeFileSync(
  join(PROVAS, "navegador.json"),
  JSON.stringify(
    {
      prompt: "LAB-31",
      oQueEh: "o .wasm do adaptador do Symbios carregando e rodando em Chromium de verdade",
      navegador: "Chromium (Playwright)",
      medidoAgora: prova,
      medidoEm_10_09_2026: DE_10_09,
      divergencias,
      // O tempo NÃO entra na conferência: ele muda de máquina para máquina, e um
      // teste que reprova por lentidão é um teste que se aprende a ignorar.
      oQueNaoEhConferido: ["ms (tempo de parede, varia por máquina)"],
    },
    null,
    2,
  ) + "\n",
);

console.log(
  `prova no navegador: ok=${prova.ok} · motor ${prova.versao_motor} · ${prova.nos} nós · ` +
    `${prova.arestas} arestas · ${prova.quadras} quadras · ${prova.bytesDoWasm} bytes · ${prova.ms} ms`,
);
if (divergencias.length) {
  console.error(`\n✗ a prova no navegador DIVERGIU do que o LAB-01 mediu:`);
  for (const d of divergencias) console.error(`   ${d}`);
  process.exit(1);
}
console.log("docs/provas/LAB-31/navegador.json");
