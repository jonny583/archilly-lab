#!/usr/bin/env bun
/**
 * A BANCADA NO CELULAR — a página rola de lado? (LAB-182, item 900, D410)
 *
 * ```sh
 * cd external-engines/esteira && bun ../symbios/adapter/ferramentas/navegador/rolagem-no-celular.ts
 * ```
 *
 * # Por que ela existe
 *
 * O `docs/SEGURANCA.md`, seção *O que **não** foi conferido, e por quê*, do LF-FINAL (14/09/2026), dizia:
 *
 * > **Mobile sem rolagem lateral.** Idem: a bancada não é aberta no celular.
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. "Não é aberta" é hábito de quem usa, não propriedade da
 * página — e a regra da família (*nada estoura lateralmente no celular*) se responde com uma MEDIÇÃO: a largura do
 * conteúdo contra a largura da janela, a 390 px, como o Laboratório de Parcelamento mede a dele
 * (`scripts/provas.ts`, `viewport 390×844, isMobile`).
 *
 * # O que ela mede, e por que NÃO precisa do `.wasm`
 *
 * A página monta o mesmo esqueleto com ou sem o `.wasm`: título, texto, o `<pre>` do registro e o `<canvas>` de
 * 700×700. O `.wasm` só muda o que vai DENTRO do registro e do canvas. Então são dois estados, e os dois rodam
 * nesta máquina:
 *
 * 1. **como a página monta aqui** — sem o `.wasm` (não versionado; o alvo do `rustup` não instala), o `prova.js`
 *    lança no `WebAssembly.instantiate` e o registro fica vazio;
 * 2. **com o registro de 10/09/2026** — o texto medido no `README.md` ao lado, lido de lá (não digitado aqui),
 *    posto dentro do `<pre>`: as linhas mais largas que a página já mostrou.
 *
 * Cada estado em três larguras de celular (390, 360 e 320 px), com e sem a emulação de celular do Chromium — que
 * muda a resposta, porque a página não tem `<meta name="viewport">` (ver o JSON: `metaViewport`).
 *
 * **Sem servidor.** A página é entregue ao Chromium por `route`, lida do disco a cada pedido: nenhum `Bun.serve`,
 * nenhuma porta aberta — o servidor da bancada continua sendo um só, o do `prova-automatica.ts` (LAB-153).
 *
 * # O que reprova
 *
 * Sobra lateral maior que zero em qualquer caso (`scrollWidth > clientWidth` do documento). O `<pre>` que rola
 * DENTRO da própria caixa (`overflow-x: auto`) não empurra a página, e por isso é medido e publicado, não reprovado.
 * O erro da página (o `.wasm` ausente) é registrado e NÃO reprova: a pergunta aqui é a largura, e quem pergunta o
 * console é a `a-prova-de-navegador.ts` (LAB-175).
 *
 * O JSON leva a impressão (SHA-256) dos dois arquivos da bancada: a trava `a-rolagem-no-celular.ts` reprova se a
 * página mudar e esta prova não for refeita.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "playwright";

const CHROMIUM = process.env["PLAYWRIGHT_BROWSERS_PATH"]
  ? join(process.env["PLAYWRIGHT_BROWSERS_PATH"], "chromium")
  : null;

const AQUI = import.meta.dirname;
const RAIZ = join(AQUI, "..", "..", "..", "..", "..");
const PROVAS = join(RAIZ, "docs", "provas", "LAB-182");
/** Os dois arquivos que desenham a página — a impressão deles vai no JSON. */
const DA_PAGINA = ["index.html", "prova.js"] as const;
/** Endereço que não existe na rede: o Chromium só o recebe pelo `route`. */
const BASE = "http://bancada.invalid/";

/** As larguras: a da família (390×844, a do Laboratório de Parcelamento) e as duas menores comuns. */
const TELAS = [
  { largura: 390, altura: 844 },
  { largura: 360, altura: 740 },
  { largura: 320, altura: 568 },
] as const;

function morrer(porque: string): never {
  console.error(`\n✗ a medição da rolagem no celular NÃO rodou: ${porque}\n`);
  process.exit(1);
}

/** O registro de 10/09/2026, lido do `README.md` ao lado: o bloco `text` da seção *Medido em 10/09/2026*. */
function oRegistroDe1009(): string {
  const readme = readFileSync(join(AQUI, "README.md"), "utf8");
  const m = /## Medido em 10\/09\/2026[^\n]*\n+```text\n([\s\S]*?)\n```/.exec(readme);
  if (!m) morrer("o `README.md` da bancada não tem o bloco `text` da seção *Medido em 10/09/2026*");
  return m[1]!;
}

const impressao = (arquivo: string) =>
  createHash("sha256").update(readFileSync(join(AQUI, arquivo))).digest("hex");

type Medida = {
  /** `clientWidth` do documento: a largura em que a página é desenhada. */
  largura: number;
  /** `scrollWidth` do documento: até onde o conteúdo vai. */
  conteudo: number;
  /** conteudo − largura: o que rolaria de lado. Reprova acima de zero. */
  sobra: number;
  /** O `<pre>` do registro: até onde o texto vai, e quanto a caixa mostra (rola dentro dela, não na página). */
  registro: { conteudo: number; caixa: number };
  /** A largura com que o `<canvas>` de 700 px é desenhado. */
  canvas: number;
};

const registro = oRegistroDe1009();
const casos: {
  tela: string;
  emulaCelular: boolean;
  comoMonta: Medida;
  comORegistroDe1009: Medida;
  errosDaPagina: string[];
}[] = [];

const navegador = await chromium
  .launch(CHROMIUM && existsSync(CHROMIUM) ? { executablePath: CHROMIUM } : {})
  .catch((e: unknown) => morrer(`o Chromium não abriu — ${e instanceof Error ? e.message : String(e)}`));

let metaViewport: boolean | null = null;
try {
  for (const t of TELAS) {
    for (const emula of [true, false]) {
      const contexto = await navegador.newContext({
        viewport: { width: t.largura, height: t.altura },
        isMobile: emula,
        hasTouch: emula,
      });
      await contexto.route("**/*", async (rota) => {
        const url = new URL(rota.request().url());
        const arquivo = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
        const cheio = join(AQUI, arquivo);
        if (!url.href.startsWith(BASE) || arquivo.includes("..") || !existsSync(cheio)) {
          await rota.fulfill({ status: 404, body: "" });
          return;
        }
        const tipo = arquivo.endsWith(".js") ? "text/javascript" : arquivo.endsWith(".wasm") ? "application/wasm" : "text/html";
        await rota.fulfill({ status: 200, contentType: tipo, body: readFileSync(cheio) });
      });
      const pagina = await contexto.newPage();
      const erros: string[] = [];
      const primeiroErro = new Promise<void>((resolver) =>
        pagina.on("pageerror", (e) => {
          erros.push(String(e.message).split("\n")[0]!.slice(0, 120));
          resolver();
        }),
      );
      await pagina.goto(BASE, { waitUntil: "load" });
      // O `prova.js` é módulo com `await` no topo: termina com `__provaConcluida` (com o `.wasm`) ou com o erro da
      // página (sem ele). Espera-se pelo PRIMEIRO dos dois, nunca por um tempo arbitrário.
      await Promise.race([
        primeiroErro,
        pagina.waitForFunction("window.__provaConcluida === true", null, { timeout: 30_000 }),
      ]).catch(() => undefined);
      if (erros.length === 0 && !(await pagina.evaluate("window.__provaConcluida === true")))
        morrer("a página não terminou em 30 s: nem `__provaConcluida`, nem erro");

      const medir = () =>
        pagina.evaluate(() => {
          const d = document.documentElement;
          const pre = document.getElementById("log")!;
          const canvas = document.getElementById("tela")!;
          return {
            largura: d.clientWidth,
            conteudo: d.scrollWidth,
            sobra: d.scrollWidth - d.clientWidth,
            registro: { conteudo: pre.scrollWidth, caixa: pre.clientWidth },
            canvas: Math.round(canvas.getBoundingClientRect().width),
          };
        });
      const comoMonta = await medir();
      if (metaViewport === null)
        metaViewport = await pagina.evaluate(() => document.querySelector('meta[name="viewport"]') !== null);
      await pagina.evaluate((t) => {
        document.getElementById("log")!.textContent = t;
      }, registro);
      const comORegistroDe1009 = await medir();
      casos.push({ tela: `${t.largura}×${t.altura}`, emulaCelular: emula, comoMonta, comORegistroDe1009, errosDaPagina: erros });
      await contexto.close();
    }
  }
} finally {
  await navegador.close();
}

const sobras = casos.flatMap((c) =>
  (["comoMonta", "comORegistroDe1009"] as const)
    .filter((e) => c[e].sobra > 0)
    .map((e) => `${c.tela}${c.emulaCelular ? " (celular)" : ""}, ${e}: sobra ${c[e].sobra} px`),
);
const maiorSobra = Math.max(...casos.flatMap((c) => [c.comoMonta.sobra, c.comORegistroDe1009.sobra]));

mkdirSync(PROVAS, { recursive: true });
writeFileSync(
  join(PROVAS, "navegador-celular.json"),
  JSON.stringify(
    {
      prompt: "LAB-182",
      oQueEh: "a bancada aberta em largura de celular, no Chromium: a página rola de lado?",
      navegador: "Chromium (Playwright), página entregue por route, sem servidor",
      impressaoDaPagina: Object.fromEntries(DA_PAGINA.map((a) => [a, impressao(a)])),
      metaViewport,
      casos,
      maiorSobra,
      // O `.wasm` NÃO entra: ele muda o que vai dentro do registro e do canvas, não o esqueleto. O registro de 10/09
      // é a forma de medir o registro cheio sem ele.
      oQueNaoEhConferido: [
        "o desenho do canvas com o .wasm (ele só pinta dentro dos 700×700 que já se medem aqui)",
        "o registro inteiro que o prova.js escreveria com o .wasm (as linhas de exports, sessão e estágios não estão no README de 10/09)",
        "outros navegadores (Safari, Firefox): só o Chromium desta máquina",
        "o tamanho da letra no celular: sem <meta name=\"viewport\">, a página é desenhada em 980 px e encolhida — não rola, mas fica pequena",
      ],
    },
    null,
    2,
  ) + "\n",
);

console.log(
  `rolagem no celular: ${casos.length} casos × 2 estados · maior sobra ${maiorSobra} px · ` +
    `meta viewport ${metaViewport ? "sim" : "não"} · registro de 10/09 rola dentro da caixa ` +
    `(${casos[0]!.comORegistroDe1009.registro.conteudo} px em ${casos[0]!.comORegistroDe1009.registro.caixa})`,
);
if (sobras.length) {
  console.error("\n✗ a bancada ROLA DE LADO no celular:");
  for (const s of sobras) console.error(`   ${s}`);
  process.exit(1);
}
console.log("docs/provas/LAB-182/navegador-celular.json");
