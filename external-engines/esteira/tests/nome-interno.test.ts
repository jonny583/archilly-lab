/**
 * **LAB-155 (item 900) · "Testfit" é nome interno** (D383).
 *
 * ```sh
 * bun test tests/nome-interno.test.ts
 * ```
 *
 * O `CLAUDE.md` §5 diz que *"Testfit"* é nome interno, e que para o usuário é *Laboratório de Parcelamento*. A guarda do
 * LAB-36 olhava dois arquivos escritos à mão e a grafia `testfit`: passou a bancada do navegador com `Testfit` no título,
 * a página do Jonny com `Test Fit`, e o `README.md` — que o GitHub mostra no primeiro endereço da página dele — dizia
 * *"motor do Testfit"* seis vezes. O motivo inteiro, com os lugares contados, está no cabeçalho de `src/nome-interno.ts`.
 *
 * Roda **sem clones** (lê só arquivos DESTE repositório), e por isso está no portão sem clones do `verde.yml`.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_REGRA,
  DECLARADOS,
  O_QUE_ISTO_NAO_ALCANCA,
  PAGINA_DO_JONNY,
  arquivosDaBancada,
  conferirAArvore,
  conferirONomeInterno,
  enderecosDaCasa,
  ondeONomeAparece,
} from "../src/nome-interno.ts";
import { aRegraEstaEscrita } from "../src/texto-das-regras.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CASA = "https://github.com/jonny583/archilly-lab";
const BANCADA = "external-engines/symbios/adapter/ferramentas/navegador/index.html";
const SCRIPT = "external-engines/symbios/adapter/ferramentas/navegador/prova.js";

/** Uma casa de mentira, do tamanho da de hoje: a página do Jonny traz os nove endereços declarados. */
function hoje(): Record<string, string> {
  const links = DECLARADOS.map((d) =>
    d.caminho === "README.md" ? `- repositório: <${CASA}>` : `- [${d.caminho}](${CASA}/blob/main/${d.caminho})`,
  ).join("\n");
  const casa: Record<string, string> = {
    [PAGINA_DO_JONNY]: `# Pendências\n\nO Laboratório de Parcelamento.\n\n${links}\n- token: <https://github.com/settings/personal-access-tokens/new>\n`,
    [BANCADA]: `<!doctype html><title>bancada</title><script type="module" src="./prova.js"></script>\n`,
    [SCRIPT]: `document.getElementById("log").textContent = "";\n`,
  };
  for (const d of DECLARADOS) casa[d.caminho] = `# ${d.caminho}\n\nO motor do Laboratório de Parcelamento, em \`external-engines/testfit/\`.\n`;
  return casa;
}
const conferir = (casa: Record<string, string>) =>
  conferirONomeInterno((c) => casa[c] ?? null).problemas.map((p) => `${p.tipo}:${p.caminho}`);

describe("LAB-155 · a regra está escrita onde mora", () => {
  test("o CLAUDE.md §5 diz que Testfit é nome interno, e diz o nome certo", () => {
    const claude = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    expect(aRegraEstaEscrita(claude, A_REGRA)).toBe(true);
    expect(claude).toContain("Laboratório de Parcelamento");
  });

  test("cada declarado tem classe e motivo, e não há caminho repetido", () => {
    for (const d of DECLARADOS) expect(d.motivo.length, d.caminho).toBeGreaterThan(20);
    expect(new Set(DECLARADOS.map((d) => d.caminho)).size).toBe(DECLARADOS.length);
  });
});

describe("LAB-155 · a casa de hoje", () => {
  const r = conferirAArvore(RAIZ);

  test("a página do Jonny traz nove endereços desta casa, todos declarados, e nenhum problema", () => {
    expect(r.problemas).toEqual([]);
    expect(r.enderecos).toBe(9);
  });

  test("lê seis páginas cobradas: a dele, a comparação, o README e a bancada com o script que ela carrega", () => {
    expect(r.paginasLidas).toEqual([
      PAGINA_DO_JONNY,
      "README.md",
      "docs/COMPARACAO_DOS_MOTORES.md",
      BANCADA,
      SCRIPT,
    ]);
  });

  test("o README diz o nome certo — a regra não é só proibir, é nomear", () => {
    expect(readFileSync(join(RAIZ, "README.md"), "utf8")).toContain("Laboratório de Parcelamento");
  });

  test("o buraco está declarado", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(3);
  });
});

describe("LAB-155 · o LADO BOM: o que não é nome não se acusa", () => {
  test("a casa de mentira, do tamanho da de hoje, passa limpa", () => {
    expect(conferir(hoje())).toEqual([]);
  });

  test("pasta, repositório vizinho, crase e endereço são identificadores", () => {
    for (const t of [
      "a pasta external-engines/testfit/ e o adaptador",
      "o repositório motor-testfit, clonado ao lado",
      "o arquivo `testfit.ts` e o `bun test` do testfit/",
      "<https://github.com/jonny583/motor-testfit>",
      "[o vizinho](https://github.com/jonny583/motor-testfit/blob/main/README.md)",
      "o ensaio test_fit_v2 e a variável testfitAtivo",
    ])
      expect(ondeONomeAparece(t), t).toEqual([]);
  });

  test("a palavra num link de FORA da casa não vira endereço desta casa", () => {
    expect(enderecosDaCasa(`<https://github.com/jonny583/motor-testfit>\n<${CASA}>`)).toEqual(["README.md"]);
  });
});

describe("LAB-155 · o LADO RUIM: cada mutação é acusada", () => {
  test("as cinco grafias, soltas, são acusadas com a linha", () => {
    for (const t of ["o motor do Testfit.", "o TestFit", "TESTFIT", "o Test Fit da página", "**test-fit**"])
      expect(ondeONomeAparece(`linha um\n${t}`).map((o) => o.linha), t).toEqual([2]);
  });

  test("Testfit na página do Jonny é acusado", () => {
    const c = hoje();
    c[PAGINA_DO_JONNY] += "\nO Testfit respondeu.\n";
    expect(conferir(c)).toEqual([`nome-interno-na-pagina:${PAGINA_DO_JONNY}:16`]);
  });

  test("Testfit no título da bancada é acusado — a mutação que a guarda do LAB-36 passava", () => {
    const c = hoje();
    c[BANCADA] = c[BANCADA]!.replace("<title>bancada", "<title>Testfit · bancada");
    expect(conferir(c)).toEqual([`nome-interno-na-pagina:${BANCADA}:1`]);
  });

  test("Testfit no script que a bancada carrega é acusado", () => {
    const c = hoje();
    c[SCRIPT] += 'log("motor do Testfit");\n';
    expect(conferir(c)).toEqual([`nome-interno-na-pagina:${SCRIPT}:2`]);
  });

  test("Testfit no README é acusado — o achado desta rodada", () => {
    const c = hoje();
    c["README.md"] += "| LAB-07 · **motor do Testfit** |\n";
    expect(conferir(c)).toEqual(["nome-interno-na-pagina:README.md:4"]);
  });

  test("Testfit num REGISTRO não é acusado: o registro é declarado, com motivo", () => {
    const c = hoje();
    c["docs/ONDE_PARAMOS.md"] += "o motor do Testfit, em 03/10\n";
    expect(conferir(c)).toEqual([]);
  });

  test("um endereço novo na página do Jonny, sem classe, é acusado", () => {
    const c = hoje();
    c[PAGINA_DO_JONNY] += `\n- [nova](${CASA}/blob/main/docs/NOVA.md)\n`;
    expect(conferir(c)).toEqual(["endereco-sem-classe:docs/NOVA.md"]);
  });

  test("um endereço relativo também conta, resolvido a partir de docs/", () => {
    const c = hoje();
    c[PAGINA_DO_JONNY] += "\n- [nova](./relatorios/LAB-99.md) e [raiz](../CLAUDE.md)\n";
    expect(conferir(c)).toEqual(["endereco-sem-classe:CLAUDE.md", "endereco-sem-classe:docs/relatorios/LAB-99.md"]);
  });

  test("o outro sentido: declarado que a página não traz mais é acusado", () => {
    const c = hoje();
    c[PAGINA_DO_JONNY] = c[PAGINA_DO_JONNY]!.replace(/.*LAB-59\.md.*\n/, "");
    expect(conferir(c)).toEqual(["declarado-que-sumiu:docs/relatorios/LAB-59.md"]);
  });

  test("declarado cujo arquivo não existe é acusado", () => {
    const c = hoje();
    delete c["docs/INDEX.md"];
    expect(conferir(c)).toEqual(["declarado-que-sumiu:docs/INDEX.md"]);
  });

  test("o script que a bancada carrega e não existe é acusado", () => {
    const c = hoje();
    delete c[SCRIPT];
    expect(conferir(c)).toEqual([`declarado-que-sumiu:${SCRIPT}`]);
    expect(arquivosDaBancada((x) => c[x] ?? null)).toEqual([BANCADA, SCRIPT]);
  });

  test("a página do Jonny que não se lê, ou sem endereço da casa, é universo vazio (D164)", () => {
    const sem = hoje();
    delete sem[PAGINA_DO_JONNY];
    expect(conferir(sem)).toContain(`universo-vazio:${PAGINA_DO_JONNY}`);
    const vazia = hoje();
    vazia[PAGINA_DO_JONNY] = "# Pendências\n\nnada.\n";
    expect(conferir(vazia)[0]).toBe(`universo-vazio:${PAGINA_DO_JONNY}`);
  });
});
