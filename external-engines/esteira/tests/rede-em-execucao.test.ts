/**
 * **LAB-158 (item 900) · o Lab não faz chamada de rede em execução** (D386).
 *
 * ```sh
 * bun test tests/rede-em-execucao.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` afirma, desde o LF-FINAL (14/09/2026), que o Lab *"não faz chamada de rede em execução"* e que
 * não há *"nenhum `fetch`, nenhum `http`"*. Nenhuma trava perguntava. Medido por LUGAR: a frase é verdadeira para o
 * caminho do motor, e a segunda é falsa como foi escrita — sete redes fora do motor, que a página calava. O motivo
 * inteiro, com as quatro portas contadas, está no cabeçalho de `src/rede-em-execucao.ts`.
 *
 * Roda **sem clones** (lê o `git ls-files` DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_FRASE,
  A_PAGINA,
  DECLARADAS,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirAArvore,
  conferirARedeEmExecucao,
  noCaminhoDoMotor,
  redeNoArquivo,
} from "../src/rede-em-execucao.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const PORTA = "external-engines/esteira/src/porta/porta.ts";
const ADAPTADOR = "external-engines/testfit/adapter/src/ponte.ts";
const FERRAMENTA = "external-engines/esteira/ferramentas/labX.ts";

/** Um repositório de mentira: as declarações de hoje com o texto que as satisfaz, mais o motor limpo. */
function hoje(): Record<string, string> {
  const arvore: Record<string, string> = {
    [PORTA]: `export const somar = (a: number, b: number) => a + b;\n`,
    [ADAPTADOR]: `import { readFileSync } from "node:fs";\nexport const ler = (c: string) => readFileSync(c, "utf8");\n`,
  };
  for (const d of DECLARADAS) {
    const uma =
      d.forma === "chamada"
        ? `await fetch("./a.wasm");\n`
        : d.forma === "processo"
          ? `spawnSync("git", ["ls-remote", "origin"]);\n`
          : d.forma === "modulo"
            ? `import { get } from "node:https";\n`
            : `git fetch -q origin\n`;
    arvore[d.caminho] = (arvore[d.caminho] ?? "") + uma.repeat(d.quantas);
  }
  return arvore;
}
const conferir = (arvore: Record<string, string>) =>
  conferirARedeEmExecucao(Object.keys(arvore), (c) => arvore[c] ?? null).problemas.map((p) => `${p.tipo}:${p.caminho}`);

describe("LAB-158 · a frase está escrita onde mora, e a página diz o que a árvore tem", () => {
  const pagina = readFileSync(join(RAIZ, A_PAGINA), "utf8");

  test("o SEGURANCA.md diz que o Lab não faz chamada de rede em execução", () => {
    expect(aRegraEstaEscrita(pagina, A_FRASE)).toBe(true);
  });

  test("a página aponta para esta trava e a linha da tabela diz onde vale o 'nenhum fetch, nenhum http'", () => {
    expect(pagina).toContain("external-engines/esteira/src/rede-em-execucao.ts");
    const linha = pagina.split("\n").find((l) => l.startsWith("| Nada de rede em execução"));
    expect(linha).toBeDefined();
    expect(linha).toContain("No caminho do motor");
  });

  test("cada declaração tem classe, motivo e mora fora do caminho do motor", () => {
    for (const d of DECLARADAS) {
      expect(d.motivo.length).toBeGreaterThan(30);
      expect(d.quantas).toBeGreaterThan(0);
      expect(noCaminhoDoMotor(d.caminho)).toBe(false);
    }
  });
});

describe("LAB-158 · a árvore de hoje", () => {
  test("nenhuma rede no caminho do motor, e toda rede de fora declarada — o universo publicado", () => {
    const r = conferirAArvore(RAIZ);
    const total = r.achados.reduce((s, a) => s + a.quantas, 0);
    console.log(
      `[rede-em-execucao] ${r.lidos} arquivos de código lidos · ${r.doMotor} no caminho do motor · ` +
        `${total} rede(s) em ${r.achados.length} par(es) arquivo-forma · ${r.problemas.length} problema(s)`,
    );
    expect(r.problemas).toEqual([]);
    expect(r.lidos).toBeGreaterThan(300);
    expect(r.doMotor).toBeGreaterThan(40);
  });
});

describe("LAB-158 · as quatro portas, uma por uma", () => {
  test("chamada: fetch, WebSocket, XMLHttpRequest, Bun.serve e createServer — e não em comentário nem em string", () => {
    expect(redeNoArquivo("a.ts", `const r = await fetch(url);\n`)).toEqual(["chamada"]);
    expect(redeNoArquivo("a.ts", `const s = new WebSocket(u);\nconst x = new XMLHttpRequest();\n`)).toEqual([
      "chamada",
      "chamada",
    ]);
    expect(redeNoArquivo("a.ts", `Bun.serve({ port: 0 });\ncreateServer(() => {});\n`)).toEqual(["chamada", "chamada"]);
    expect(redeNoArquivo("a.ts", `// fetch(url)\nconst s = "fetch(url)";\nconst t = \`fetch(url)\`;\n`)).toEqual([]);
  });

  test("modulo: o import de http/https/net (com e sem node:), o require e o import dinâmico; o Rust de rede", () => {
    expect(redeNoArquivo("a.ts", `import { request } from "node:https";\n`)).toEqual(["modulo"]);
    expect(redeNoArquivo("a.ts", `import net from 'net';\n`)).toEqual(["modulo"]);
    expect(redeNoArquivo("a.js", `const h = require("http");\n`)).toEqual(["modulo"]);
    expect(redeNoArquivo("a.mjs", `const h = await import("node:dgram");\n`)).toEqual(["modulo"]);
    expect(redeNoArquivo("a.ts", `import { readFileSync } from "node:fs";\nconst p = "http";\n`)).toEqual([]);
    expect(redeNoArquivo("a.rs", `use std::net::TcpStream;\n`)).toEqual(["modulo", "modulo"]);
    expect(redeNoArquivo("a.rs", `let r = reqwest::get(u);\n`)).toEqual(["modulo"]);
    expect(redeNoArquivo("a.rs", `// use std::net;\nlet s = "TcpStream";\n`)).toEqual([]);
  });

  test("processo: o argumento de rede em posição de argumento; não em mensagem, não em campo, não em file://", () => {
    expect(redeNoArquivo("a.ts", `execFileSync("git", ["fetch", "origin"]);\n`)).toEqual(["processo"]);
    expect(redeNoArquivo("a.ts", `spawnSync("curl", ["-sS", u]);\n`)).toEqual(["processo"]);
    expect(redeNoArquivo("a.ts", `tentar('push', 'origin');\n`)).toEqual(["processo"]);
    expect(redeNoArquivo("a.ts", `throw new Error("rode git fetch");\nconst e = { evento: "push" };\n`)).toEqual([]);
    expect(redeNoArquivo("a.ts", `execFileSync("git", ["clone", \`file://\${o}\`, d]);\n`)).toEqual([]);
    expect(redeNoArquivo("a.ts", `const exemplo = 'execFileSync("git", ["fetch"])';\n`)).toEqual([]);
  });

  test("shell: curl, wget e o subcomando de rede logo depois do git; o nome do gancho não é push; comentário não conta", () => {
    expect(redeNoArquivo("x.sh", `git fetch -q origin\ncurl -s u\n`)).toEqual(["shell", "shell"]);
    expect(redeNoArquivo("x.sh", `git -C "$R" ls-remote origin\n`)).toEqual(["shell"]);
    expect(redeNoArquivo("x.sh", `git -C "$R" config --get core.hooksPath "$G/pre-push"\n`)).toEqual([]);
    expect(redeNoArquivo("x.sh", `# git push origin main\n`)).toEqual([]);
    expect(redeNoArquivo("ganchos/pre-push", `git push --no-verify\n`)).toEqual(["shell"]);
    expect(redeNoArquivo("x.sh", `git clone file:///tmp/a b\n`)).toEqual([]);
  });

  test("o que não é código não é lido", () => {
    expect(redeNoArquivo("a.md", `await fetch(url)\n`)).toEqual([]);
    expect(redeNoArquivo("a.json", `{"x": "fetch("}\n`)).toEqual([]);
  });
});

describe("LAB-158 · os dois sentidos, demonstrados", () => {
  test("a árvore de mentira de hoje passa", () => {
    expect(conferir(hoje())).toEqual([]);
  });

  test("rede no caminho do motor reprova — na porta, no adaptador, no upstream", () => {
    const a = hoje();
    a[PORTA] += `const r = await fetch("./exemplo");\n`;
    expect(conferir(a)).toEqual([`rede-no-caminho-do-motor:${PORTA}`]);
    const b = hoje();
    b[ADAPTADOR] += `import { get } from "node:https";\n`;
    expect(conferir(b)).toEqual([`rede-no-caminho-do-motor:${ADAPTADOR}`]);
    const c = hoje();
    c["external-engines/symbios/upstream/src/lib.rs"] = `use std::net::UdpSocket;\n`;
    expect(conferir(c)).toEqual(["rede-no-caminho-do-motor:external-engines/symbios/upstream/src/lib.rs"]);
  });

  test("declarar uma rede no motor não a absolve", () => {
    const a = hoje();
    a[PORTA] += `await fetch("./x");\n`;
    const declaradas = [...DECLARADAS, { caminho: PORTA, forma: "chamada" as const, quantas: 1, classe: "servidor-local" as const, motivo: "m".repeat(40) }];
    const r = conferirARedeEmExecucao(Object.keys(a), (c) => a[c] ?? null, declaradas);
    expect(r.problemas.map((p) => p.tipo)).toEqual(["rede-no-caminho-do-motor"]);
  });

  test("rede nova fora do motor, sem declaração, reprova — e uma a mais num arquivo declarado também", () => {
    const a = hoje();
    a[FERRAMENTA] = `execFileSync("git", ["pull", "origin", "main"]);\n`;
    expect(conferir(a)).toEqual([`rede-nao-declarada:${FERRAMENTA}`]);
    const b = hoje();
    const d = DECLARADAS.find((x) => x.forma === "processo")!;
    b[d.caminho] += `spawnSync("git", ["fetch", "origin"]);\n`;
    expect(conferir(b)).toEqual([`rede-nao-declarada:${d.caminho}`]);
  });

  test("declaração cuja rede sumiu reprova (a lista que envelhece calada)", () => {
    const a = hoje();
    const d = DECLARADAS[0]!;
    a[d.caminho] = `export const nada = 1;\n`;
    expect(conferir(a)).toEqual([`declarada-que-sumiu:${d.caminho}`]);
    const b = hoje();
    delete b[DECLARADAS[2]!.caminho];
    expect(conferir(b)).toEqual([`declarada-que-sumiu:${DECLARADAS[2]!.caminho}`]);
  });

  test("o universo vazio não sai verde (D164)", () => {
    expect(conferir({})).toContain("universo-vazio:—");
  });
});

describe("LAB-158 · o buraco, dito", () => {
  test("a trava declara o que não alcança", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
    expect(O_QUE_ISTO_NAO_ALCANCA.join("\n")).toContain("verde.yml");
  });
});
