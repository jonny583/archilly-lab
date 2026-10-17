/**
 * **LAB-160 (item 900) · nenhum `.env`, `.pem` ou arquivo de credencial** (D388).
 *
 * ```sh
 * bun test tests/arquivo-de-credencial.test.ts
 * ```
 *
 * O `docs/SEGURANCA.md` afirma, desde o LF-FINAL (14/09/2026), que não há `.env`, `.pem` nem arquivo de credencial no
 * repositório — um `find` rodado uma vez, com três formas de nome. Nenhuma trava perguntava, e a varredura de segredos
 * não responde esta linha: ela lê conteúdo, e cinco de seis arquivos de credencial plantados passam por ela calados. O
 * motivo inteiro está no cabeçalho de `src/arquivo-de-credencial.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`. A metade da
 * história recusa no clone raso do CI, dizendo por quê (LAB-89).
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_LINHA,
  A_PAGINA,
  FORMAS,
  MODELOS_PERMITIDOS,
  O_QUE_ISTO_NAO_ALCANCA,
  conferirAArvore,
  conferirOsNomes,
  formaDeCredencial,
  nomesQueJaEntraram,
} from "../src/arquivo-de-credencial.ts";
import { lerPelaHistoria } from "../src/profundidade-da-historia.ts";
import { varrerTexto } from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

/**
 * Os seis arquivos de credencial plantados no LAB-160. O valor é montado em pedaços para a varredura de segredos não
 * acusar este arquivo (ver `exemploFalso` na régua dela).
 */
const V = ["k8Fq2Lm", "Zp9Xw3R", "t7Yv1Nb"].join("");
const PLANTADOS: readonly {
  caminho: string;
  texto: string;
  aVarreduraDeConteudoPega: boolean;
}[] = [
  {
    caminho: ".env",
    texto: `SUPABASE_SERVICE_ROLE_KEY=${V}\n`,
    aVarreduraDeConteudoPega: false,
  },
  {
    caminho: "hub/.env.local",
    texto: `DB_PASSWORD="${V}"\n`,
    aVarreduraDeConteudoPega: false,
  },
  {
    caminho: ".npmrc",
    texto: `//registry.npmjs.org/:_authToken=${V}\n`,
    aVarreduraDeConteudoPega: false,
  },
  {
    caminho: ".netrc",
    texto: `machine github.com login jonny password ${V}\n`,
    aVarreduraDeConteudoPega: false,
  },
  // O endereço vai em pedaços: escrito inteiro, a trava do "nada pago" (LAB-148) o lê como porta nova, e com razão.
  {
    caminho: ".git-credentials",
    texto: `${["https:", "", `jonny:${V}@github.com`].join("/")}\n`,
    aVarreduraDeConteudoPega: false,
  },
  {
    caminho: "chaves/id_ed25519",
    texto: `-----BEGIN OPENSSH ${"PRIVATE"} KEY-----\n${V}\n-----END OPENSSH ${"PRIVATE"} KEY-----\n`,
    aVarreduraDeConteudoPega: true,
  },
];

describe("LAB-160 · a linha está escrita onde mora, e aponta para esta trava", () => {
  const pagina = readFileSync(join(RAIZ, A_PAGINA), "utf8");
  const linha = pagina.split("\n").find((l) => l.startsWith(A_LINHA));

  test("o SEGURANCA.md tem a linha, e ela diz com o que é conferida hoje", () => {
    expect(linha).toBeDefined();
    expect(linha).toContain("arquivo-de-credencial.ts");
  });

  test("as três formas da página estão na lista, e cada forma tem motivo", () => {
    for (const n of ["env", "pem", "credential"])
      expect(FORMAS.map((f) => f.nome)).toContain(n);
    for (const f of FORMAS) expect(f.motivo.length, f.nome).toBeGreaterThan(20);
    expect(new Set(FORMAS.map((f) => f.nome)).size).toBe(FORMAS.length);
  });

  test("o que a trava não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-160 · o que o git carrega hoje — o universo publicado", () => {
  test("nenhum caminho com nome de credencial", () => {
    const r = conferirAArvore(RAIZ);
    console.log(
      `[arquivo-de-credencial] ${r.lidos} caminhos que o git carrega · ${r.problemas.length} problema(s)`,
    );
    expect(r.problemas).toEqual([]);
    expect(r.lidos).toBeGreaterThan(700);
  });
});

describe("LAB-160 · a história — com ela inteira, ou RECUSADA dizendo por quê", () => {
  const raso = (() => {
    try {
      return (
        execFileSync(
          "git",
          ["-C", RAIZ, "rev-parse", "--is-shallow-repository"],
          { encoding: "utf8" },
        ).trim() === "true"
      );
    } catch {
      return null;
    }
  })();
  let nomes: string[] = [];
  const leitura = lerPelaHistoria(raso, () => {
    nomes = nomesQueJaEntraram(RAIZ);
    return String(nomes.length);
  });

  test("nenhum nome de credencial entrou num commit do HEAD", () => {
    console.log(
      `    a leitura: ${leitura.motivo} — ${leitura.oQueIssoQuerDizer.slice(0, 90)}`,
    );
    if (!leitura.podeAfirmar) {
      expect(leitura.valor).toBeNull();
      return;
    }
    const r = conferirOsNomes(nomes, "historia");
    console.log(
      `[arquivo-de-credencial] ${r.lidos} nomes que já entraram na história · ${r.problemas.length} problema(s)`,
    );
    expect(r.problemas).toEqual([]);
    // 762 em 17/10/2026, antes do commit do LAB-160; só cresce.
    expect(r.lidos).toBeGreaterThanOrEqual(762);
  });
});

describe("LAB-160 · os dois lados da régua", () => {
  test("os seis plantados reprovam pelo nome — e cinco deles passam calados pela varredura de conteúdo", () => {
    for (const p of PLANTADOS) {
      expect(formaDeCredencial(p.caminho), p.caminho).not.toBeNull();
      // Se isto mudar, a varredura de conteúdo melhorou: atualize a tabela do cabeçalho da régua.
      expect(
        varrerTexto(p.texto, p.caminho).length > 0,
        `${p.caminho}: a varredura de conteúdo`,
      ).toBe(p.aVarreduraDeConteudoPega);
    }
    expect(PLANTADOS.filter((p) => !p.aVarreduraDeConteudoPega)).toHaveLength(
      5,
    );
  });

  test("cada forma da lista acusa ao menos um nome — nenhuma régua morta", () => {
    const exemplos = [
      ".env",
      "a/servidor.pem",
      "credentials.json",
      "tls.key",
      "cert.p12",
      "app.jks",
      "chave.ppk",
      "id_rsa",
      ".npmrc",
      ".netrc",
      ".pypirc",
      ".htpasswd",
      ".dev.vars",
      "minha-service-account.json",
      ".secrets",
      "prod.tfvars",
      "cofre.kdbx",
    ];
    const acusadas = new Set(exemplos.map((e) => formaDeCredencial(e)?.nome));
    for (const f of FORMAS) expect(acusadas.has(f.nome), f.nome).toBe(true);
  });

  test("o caso válido que quase parece inválido passa", () => {
    for (const c of [
      ".env.exemplo",
      "hub/.env.example",
      "chaves/id_ed25519.pub",
      "src/keys.ts",
      "monkey.ts",
      "external-engines/esteira/src/arquivo-de-credencial.ts",
      "external-engines/esteira/src/varredura-de-segredos.ts",
      "external-engines/esteira/tests/segredos.test.ts",
      "docs/SEGURANCA.md",
      "environment.md",
      "keymap.json",
    ])
      expect(formaDeCredencial(c), c).toBeNull();
    expect(MODELOS_PERMITIDOS.length).toBe(1);
  });

  test("a árvore com um plantado reprova, nomeando o caminho; sem nenhum caminho, reprova por universo vazio", () => {
    const hoje = ["README.md", "external-engines/esteira/src/porta/porta.ts"];
    expect(conferirOsNomes(hoje, "git").problemas).toEqual([]);
    for (const p of PLANTADOS) {
      const r = conferirOsNomes([...hoje, p.caminho], "git");
      expect(r.problemas.map((x) => `${x.tipo}:${x.caminho}`)).toEqual([
        `credencial-no-git:${p.caminho}`,
      ]);
    }
    expect(
      conferirOsNomes(["a.ts", ".env"], "historia").problemas[0]!.tipo,
    ).toBe("credencial-na-historia");
    expect(conferirOsNomes([], "git").problemas.map((x) => x.tipo)).toEqual([
      "universo-vazio",
    ]);
  });

  test("a recusa da história no clone raso não devolve número", () => {
    const l = lerPelaHistoria(true, () => "999");
    expect(l.podeAfirmar).toBe(false);
    expect(l.valor).toBeNull();
  });
});
