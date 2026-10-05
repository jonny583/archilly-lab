/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-47 · A trava que faltava: SEGREDO NA ÁRVORE.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O Render plantou uma chave de IA com formato real dentro do código e todos os
 * testes passaram verdes. **Medido aqui, na fase (a) do LAB-47, deu igual:** cinco
 * segredos de formato real num arquivo `src/` versionado, e o comando único saiu
 * **VERDE, 7 passos, 401 travas, exit 0**. O `tsc` e o `eslint` leram o arquivo e
 * aprovaram. Nenhuma das 401 travas procurava segredo — então nenhuma achou.
 *
 * Estas travas são a fase (b). O que elas protegem, e por que cada uma existe:
 *
 *   · **a árvore de hoje está limpa** — é a trava que morde amanhã;
 *   · **cada formato declarado é PROVADO com um exemplo falso** — regra que
 *     ninguém exercita é promessa não exercitada (D135), e numa varredura de
 *     segredo isso é pior: ela fica verde por não procurar;
 *   · **o escopo não se auto-exclui.** O jeito óbvio de a régua ficar verde é
 *     pular o arquivo que a incomoda — e a Pesquisa já pagou por escopo estreito
 *     (três formatos, uma pasta). Então há trava exigindo que a varredura passe
 *     **pelo próprio fonte dela e por este arquivo**;
 *   · **o teto de doze caracteres** é trava, não convenção: a prova e o relatório
 *     são varridos pela própria varredura que descrevem.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  MAXIMO_DE_CARACTERES_NA_AMOSTRA,
  REGRAS,
  VALORES_QUE_NAO_SAO_SEGREDO,
  arquivosQueOGitCarrega,
  varrer,
  varrerTexto,
} from "../src/varredura-de-segredos.ts";

const RAIZ = join(import.meta.dir, "../../..");
const FONTE_DA_REGUA = "external-engines/esteira/src/varredura-de-segredos.ts";
const ESTE_ARQUIVO = "external-engines/esteira/tests/segredos.test.ts";
const PROVA = "docs/provas/LAB-47/varredura-de-segredos.json";

/** A varredura da árvore real, uma vez para todas as travas que a usam. */
const naArvore = varrer(RAIZ);

describe("LAB-47 · a árvore não carrega segredo", () => {
  test("a varredura PASSA na árvore de hoje — zero achados", () => {
    expect(
      naArvore.achados,
      "segredo na árvore: rode `bun run lab47` para ver, e TROQUE A CHAVE antes de apagá-la do arquivo",
    ).toEqual([]);
  });

  test("a varredura REPROVA com o segredo plantado — um exemplo por formato declarado", () => {
    // É a prova que o chat pediu, feita **por formato**: uma varredura que
    // reprova um formato e cala nos outros doze é o escopo estreito da Pesquisa.
    const pasta = mkdtempSync(join(tmpdir(), "lab47-"));
    try {
      const semNada = varrer(pasta, ["limpo.txt"]);
      writeFileSync(join(pasta, "limpo.txt"), "nada aqui, só texto\n");
      expect(varrer(pasta, ["limpo.txt"]).achados, "achou segredo onde não há").toEqual([]);
      expect(semNada.escopo.deFora.length, "arquivo que não existe tem de sair declarado, não pulado").toBe(1);

      for (const regra of REGRAS) {
        const alvo = `plantado-${regra.nome}.txt`;
        // **Cru, e não `JSON.stringify`.** A primeira versão desta trava escapava o
        // exemplo, e com isso a regra da senha deixou de casar: o `\"` que o escape
        // produz não é a aspa que o padrão procura. A trava reprovou a régua por um
        // defeito do arnês — a forma do D139.
        writeFileSync(join(pasta, alvo), `linha antes\n${regra.exemploFalso()}\nlinha depois\n`);
        const nomes = varrer(pasta, [alvo]).achados.map((a) => a.regra);
        expect(nomes, `o formato '${regra.nome}' foi declarado e a varredura NÃO o pega`).toContain(regra.nome);
        rmSync(join(pasta, alvo));
      }
    } finally {
      rmSync(pasta, { recursive: true, force: true });
    }
  });

  test("as quatro famílias que o chat nomeou têm regra: chave de IA, token, senha, credencial de banco", () => {
    const nomes = REGRAS.map((r) => r.nome);
    const familias: Record<string, (n: string) => boolean> = {
      "chave de IA": (n) => n.startsWith("chave-de-ia-"),
      token: (n) => n.includes("token"),
      senha: (n) => n === "segredo-atribuido-a-um-nome-que-o-declara",
      "credencial de banco": (n) => n === "credencial-de-banco-em-url",
    };
    for (const [familia, casa] of Object.entries(familias)) {
      expect(nomes.filter(casa).length, `a família '${familia}' foi pedida e não tem regra`).toBeGreaterThan(0);
    }
  });
});

describe("LAB-47 · o ESCOPO, que é o que importa", () => {
  test("o escopo é tudo que o git carrega — nem só o rastreado, nem uma pasta só", () => {
    const doGit = arquivosQueOGitCarrega(RAIZ);
    const comGitDireto = execFileSync("git", ["-C", RAIZ, "ls-files", "--cached", "--others", "--exclude-standard"], {
      encoding: "utf8",
    })
      .split("\n")
      .filter((s) => s.length > 0);
    expect(doGit.length).toBe(comGitDireto.length);
    expect(naArvore.escopo.arquivosQueOGitCarrega).toBe(doGit.length);
    expect(naArvore.escopo.arquivosVarridos + naArvore.escopo.deFora.length).toBe(doGit.length);
    expect(naArvore.escopo.arquivosVarridos, "árvore varrida vazia é varredura que não rodou").toBeGreaterThan(200);
  });

  test("a varredura NÃO se auto-exclui: ela passa pelo próprio fonte e por este teste", () => {
    // Auto-exclusão é como um escopo encolhe em silêncio, e é o conserto que
    // qualquer um faria se a régua reprovasse o fonte dela. Aqui ela não precisa:
    // os exemplos falsos são montados em pedaços, de propósito.
    const doGit = new Set(arquivosQueOGitCarrega(RAIZ));
    for (const alvo of [FONTE_DA_REGUA, ESTE_ARQUIVO]) {
      expect(doGit.has(alvo), `${alvo}: fora do que o git carrega — o escopo deixou de o alcançar`).toBe(true);
      expect(naArvore.escopo.deFora.map((f) => f.arquivo), `${alvo} saiu do escopo da varredura`).not.toContain(alvo);
    }
  });

  test("nem o fonte da régua nem este teste contêm o literal de um segredo", () => {
    // A metade que faz a trava acima ser possível. Se um dia alguém escrever o
    // exemplo inteiro aqui, esta trava morde ANTES de a outra ficar vermelha.
    for (const alvo of [FONTE_DA_REGUA, ESTE_ARQUIVO]) {
      const achados = varrerTexto(readFileSync(join(RAIZ, alvo), "utf8"), alvo);
      expect(achados, `${alvo}: monte o exemplo em pedaços — ver 'exemploFalso' na régua`).toEqual([]);
    }
  });

  test("todo arquivo de fora do escopo sai NOMEADO e com motivo — nunca pulado em silêncio", () => {
    for (const fora of naArvore.escopo.deFora) {
      expect(fora.arquivo.length).toBeGreaterThan(0);
      expect(fora.porque.length, `${fora.arquivo}: fora do escopo sem motivo escrito`).toBeGreaterThan(10);
    }
  });
});

describe("LAB-47 · o teto de doze caracteres, que é trava e não convenção", () => {
  test("nenhuma regra declara amostra maior que doze", () => {
    expect(MAXIMO_DE_CARACTERES_NA_AMOSTRA).toBe(12);
    for (const regra of REGRAS) {
      expect(regra.caracteresNaAmostra, `${regra.nome}: amostra acima do teto`).toBeLessThanOrEqual(12);
      expect(regra.caracteresNaAmostra).toBeGreaterThan(0);
    }
  });

  test("a amostra de um achado real para no teto da regra", () => {
    const pasta = mkdtempSync(join(tmpdir(), "lab47-amostra-"));
    try {
      for (const regra of REGRAS) {
        writeFileSync(join(pasta, "x.txt"), `${regra.exemploFalso()}\n`);
        for (const a of varrer(pasta, ["x.txt"]).achados) {
          const teto = REGRAS.find((r) => r.nome === a.regra)!.caracteresNaAmostra;
          expect(a.amostra.length, `${a.regra}: a amostra passou do teto`).toBeLessThanOrEqual(teto);
          expect(a.caracteresCasados, "o tamanho do casado informa sem revelar").toBeGreaterThan(a.amostra.length);
        }
      }
    } finally {
      rmSync(pasta, { recursive: true, force: true });
    }
  });

  test("a PROVA do LAB-47 é varrida pela varredura que ela descreve — e está limpa", () => {
    // O fecho da regra do chat: se o relatório ou a prova repetissem o segredo,
    // a própria varredura os reprovaria, porque `docs/` está no escopo.
    expect(existsSync(join(RAIZ, PROVA)), "a prova do LAB-47 não existe: rode `bun run lab47`").toBe(true);
    expect(varrerTexto(readFileSync(join(RAIZ, PROVA), "utf8"), PROVA)).toEqual([]);
    expect(varrerTexto(readFileSync(join(RAIZ, "docs/relatorios/LAB-47.md"), "utf8"), "LAB-47.md")).toEqual([]);
  });

  test("a prova não envelheceu: o número de regras dela é o da régua de hoje", () => {
    // Detector de prova velha (D131): regra nova sem regerar a prova é prova
    // que descreve uma varredura que já não existe.
    const prova = JSON.parse(readFileSync(join(RAIZ, PROVA), "utf8"));
    expect(prova.faseB_aVarredura.escopo.regras, "regere a prova: `bun run lab47`").toBe(REGRAS.length);
    expect(prova.faseB_aVarredura.regras.map((r: { nome: string }) => r.nome)).toEqual(REGRAS.map((r) => r.nome));
  });
});

describe("LAB-47 · as regras dizem o que NÃO pegam", () => {
  test("toda regra tem o que é e o buraco dela escritos", () => {
    for (const regra of REGRAS) {
      expect(regra.oQue.length, `${regra.nome}: regra sem dizer o que casa`).toBeGreaterThan(20);
      expect(regra.oQueNaoPega.length, `${regra.nome}: regra sem buraco declarado é regra que promete tudo`).toBeGreaterThan(20);
    }
  });

  test("todo valor perdoado pela regra do nome tem motivo escrito", () => {
    for (const { padrao, porque } of VALORES_QUE_NAO_SAO_SEGREDO) {
      expect(porque.length, `${padrao}: perdão sem motivo é perdão sem revisão`).toBeGreaterThan(20);
    }
  });

  test("o jeito CERTO de escrever um segredo não é acusado", () => {
    const certos = [
      'token: "${{ secrets.VIZINHOS_TOKEN }}"',
      'senha: "process.env.SENHA_DO_BANCO"',
      'apiKey: "<a sua chave aqui>"',
      'password: "exemplo-nao-use"',
    ];
    for (const linha of certos) {
      expect(varrerTexto(linha, "certo.ts"), `acusou o jeito certo: ${linha}`).toEqual([]);
    }
  });
});
