/**
 * **LAB-122 (item 900) · a rotina no GitHub — a régua pura, e as afirmações da árvore** (D350).
 *
 * ```sh
 * bun test tests/a-rotina-no-github.test.ts
 * ```
 *
 * Esta é a metade que roda **sem rede**, no portão sem clones: a régua dos dois lados, e as
 * afirmações vivas lidas da árvore, com o universo publicado. A metade que pergunta ao GitHub é
 * `tests/a-rotina-no-github-na-origem.test.ts`.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  type AfirmacaoDaRotina,
  CAMINHO_DA_ROTINA,
  DA_PROPRIA_REGUA,
  afirmacoesDaArvore,
  afirmacoesDaRotina,
  conferirARotina,
  lerARotina,
  repositorioDoRemoto,
  type RotinaNoGitHub,
} from "../src/a-rotina-no-github.ts";
import { gatilhoAutomaticoLigado } from "../src/o-ci-que-roda.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTA_CASA = "jonny583/archilly-lab";

/** A resposta da API como ela veio em 16/10/2026, só com os campos que a régua lê e um a mais. */
const RESPOSTA_DE_HOJE = JSON.stringify({
  total_count: 1,
  workflows: [{ id: 374646435, name: "verde", path: ".github/workflows/verde.yml", state: "disabled_manually" }],
});

const hoje: RotinaNoGitHub = { id: 374646435, caminho: CAMINHO_DA_ROTINA, estado: "disabled_manually" };
const religada: RotinaNoGitHub = { ...hoje, estado: "active" };
const diz = (estado: string, arquivo = "CLAUDE.md"): AfirmacaoDaRotina => ({ tipo: "estado", arquivo, linha: 1, estado });
const digita = (id: number, arquivo = "docs/COMO_RELIGAR_O_CI.md"): AfirmacaoDaRotina => ({ tipo: "id", arquivo, linha: 1, id });

describe("LAB-122 · a leitura da API — `null` quando não sei, nunca um estado inventado", () => {
  test("a resposta de hoje dá a rotina pelo CAMINHO", () => {
    expect(lerARotina(RESPOSTA_DE_HOJE)).toEqual(hoje);
  });

  test("sem a rotina daquele caminho, `null` — outra rotina não responde por ela", () => {
    const outra = JSON.stringify({ workflows: [{ id: 1, path: ".github/workflows/outra.yml", state: "active" }] });
    expect(lerARotina(outra)).toBeNull();
    expect(lerARotina(JSON.stringify({ workflows: [] }))).toBeNull();
  });

  test("resposta ilegível (a mensagem de cota estourada, HTML de erro) é `null`, não 'desligada'", () => {
    expect(lerARotina('{"message":"API rate limit exceeded"}')).toBeNull();
    expect(lerARotina("<html>502</html>")).toBeNull();
    expect(lerARotina("")).toBeNull();
  });

  test("o repositório sai do remoto, em https e em ssh; outro host é `null`", () => {
    expect(repositorioDoRemoto("https://github.com/jonny583/archilly-lab")).toBe(ESTA_CASA);
    expect(repositorioDoRemoto("https://github.com/jonny583/archilly-lab.git\n")).toBe(ESTA_CASA);
    expect(repositorioDoRemoto("git@github.com:jonny583/archilly-lab.git")).toBe(ESTA_CASA);
    expect(repositorioDoRemoto("http://127.0.0.1:9/git/jonny583/archilly-lab")).toBeNull();
  });
});

describe("LAB-122 · as afirmações num texto — o estado pelo nome da API, o id no endereço desta casa", () => {
  test("acha o estado e o id, com a linha", () => {
    const t = ["x", "a rotina `disabled_manually`:", "gh api -X PUT /repos/jonny583/archilly-lab/actions/workflows/374646435/enable"].join("\n");
    expect(afirmacoesDaRotina("a.md", t, ESTA_CASA)).toEqual([
      { tipo: "estado", arquivo: "a.md", linha: 2, estado: "disabled_manually" },
      { tipo: "id", arquivo: "a.md", linha: 3, id: 374646435 },
    ]);
  });

  test("o id de OUTRO repositório não é desta régua (o Geo tem os dele)", () => {
    const t = "gh api -X PUT /repos/jonny583/urban-scout-tool/actions/workflows/358305497/enable";
    expect(afirmacoesDaRotina("a.md", t, ESTA_CASA)).toEqual([]);
  });

  test("'desabilitada' em português NÃO é achada — o limite da régua de palavra, dito", () => {
    expect(afirmacoesDaRotina("a.md", "a rotina está desabilitada no GitHub", ESTA_CASA)).toEqual([]);
  });
});

describe("LAB-122 · a régua — os dois lados demonstrados", () => {
  test("O LADO BOM, o de hoje: gatilho comentado, rotina desabilitada, todos dizem o mesmo", () => {
    expect(conferirARotina(false, hoje, [diz("disabled_manually"), digita(374646435)])).toEqual([]);
  });

  test("O LADO BOM, religado pelos DOIS passos: gatilho ligado, rotina active, nenhuma frase de desligada", () => {
    expect(conferirARotina(true, religada, [digita(374646435)])).toEqual([]);
  });

  test("não sei o estado → reprova; nunca aprova por não ter lido (D23)", () => {
    expect(conferirARotina(false, null, [diz("disabled_manually")]).map((p) => p.tipo)).toEqual(["nao-sei-o-estado"]);
  });

  test("SÓ O PASSO 1 (gatilho descomentado, rotina desabilitada) → o passo pela metade", () => {
    expect(conferirARotina(true, hoje, [diz("disabled_manually")]).map((p) => p.tipo)).toEqual(["passo-pela-metade"]);
  });

  test("SÓ O PASSO 2 (rotina reabilitada, gatilho comentado) → o passo pela metade, e as frases mentem", () => {
    expect(conferirARotina(false, religada, [diz("disabled_manually")]).map((p) => p.tipo)).toEqual([
      "passo-pela-metade",
      "estado-afirmado-que-nao-e",
    ]);
  });

  test("a frase diz um estado e a API outro → reprova, com o lugar", () => {
    const p = conferirARotina(false, hoje, [diz("disabled_manually"), diz("disabled_inactivity", "x.md")]);
    expect(p).toEqual([{ tipo: "estado-afirmado-que-nao-e", onde: "x.md:1 diz 'disabled_inactivity', a API diz 'disabled_manually'" }]);
  });

  test("o id digitado não é o da rotina → reprova (a rotina recriada ganha id novo)", () => {
    expect(conferirARotina(false, hoje, [diz("disabled_manually"), digita(374646436)]).map((p) => p.tipo)).toEqual([
      "id-que-nao-e-da-rotina",
    ]);
  });

  test("O ESPELHO: rotina desabilitada e ninguém dizendo → reprova ('verde: nenhuma de 0')", () => {
    expect(conferirARotina(false, hoje, [digita(374646435)]).map((p) => p.tipo)).toEqual(["desligada-sem-quem-diga"]);
    expect(conferirARotina(false, hoje, []).map((p) => p.tipo)).toEqual(["desligada-sem-quem-diga"]);
  });
});

describe("LAB-122 · a árvore de hoje — e o universo lido, publicado", () => {
  const arvore = execFileSync("git", ["ls-files"], { cwd: RAIZ, encoding: "utf8" })
    .split("\n")
    .filter((f) => f !== "" && existsSync(join(RAIZ, f)))
    .map((arquivo) => ({ arquivo, texto: readFileSync(join(RAIZ, arquivo), "utf8") }));
  const r = afirmacoesDaArvore(arvore, ESTA_CASA);

  test("as afirmações vivas concordam ENTRE SI — o que se confere sem rede", () => {
    const estados = new Set(r.afirmacoes.flatMap((a) => (a.tipo === "estado" ? [a.estado] : [])));
    const ids = new Set(r.afirmacoes.flatMap((a) => (a.tipo === "id" ? [a.id] : [])));
    console.log(
      `[a-rotina-no-github] lidos ${r.lidos} arquivos vivos (${r.deRelato} de relato fora): ` +
        `${r.afirmacoes.filter((a) => a.tipo === "estado").length} afirmação(ões) de estado ${[...estados].join(",") || "—"}, ` +
        `${r.afirmacoes.filter((a) => a.tipo === "id").length} id(s) ${[...ids].join(",") || "—"}`,
    );
    // Concordar entre si não é estar certo (D311): a verdade é da trava viva. Mas duas páginas
    // que discordam estão erradas em pelo menos uma, e isso não precisa de rede.
    expect(estados.size).toBeLessThanOrEqual(1);
    expect(ids.size).toBeLessThanOrEqual(1);
  });

  test("os lugares que motivaram a régua, pelo gatilho: comentado, os três dizem o estado; ligado, nenhum", () => {
    // Sem rede, o gatilho é o que se sabe do par; a trava viva confere a outra metade. Sem estes
    // três no universo, ela aprova por não ler — e no dia de religar a frase SAI deles.
    const gatilho = gatilhoAutomaticoLigado(readFileSync(join(RAIZ, CAMINHO_DA_ROTINA), "utf8"));
    const dizem = new Set(r.afirmacoes.flatMap((a) => (a.tipo === "estado" ? [a.arquivo] : [])));
    for (const f of ["CLAUDE.md", ".github/workflows/verde.yml", "docs/COMO_RELIGAR_O_CI.md"]) expect(dizem.has(f)).toBe(!gatilho);
  });

  test("a lista da própria régua, nos dois sentidos: cada arquivo existe e fala da rotina", () => {
    for (const f of DA_PROPRIA_REGUA) {
      expect(existsSync(join(RAIZ, f))).toBe(true);
      expect(afirmacoesDaRotina(f, readFileSync(join(RAIZ, f), "utf8"), ESTA_CASA).length).toBeGreaterThan(0);
    }
  });
});
