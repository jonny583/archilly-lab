/**
 * **LAB-162 (item 900) · nenhum commit, nenhum push nos vizinhos — perguntado à história de VERDADE** (D390).
 *
 * ```sh
 * bun test tests/nenhum-commit-nos-vizinhos-com-clone.test.ts
 * ```
 *
 * Lê a história inteira da origem (`git log --remotes=origin`) desta casa e dos três vizinhos que ela lê — o
 * Laboratório de Parcelamento, o Generate e o Geo — e pergunta se alguma sessão que trabalhou aqui aparece lá. Precisa
 * dos clones, com a história inteira, então mora no **verde completo**, não no portão sem clones. Sem um clone, ou com
 * um clone raso, **reprova** com a receita — não pula (D124, D293).
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { VIZINHOS } from "../src/commit-dos-vizinhos.ts";
import {
  argumentosDoGitLog,
  conferirNenhumCommitNosVizinhos,
  lerOGitLog,
  type Historia,
} from "../src/nenhum-commit-nos-vizinhos.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

function historiaDe(repo: string, cwd: string, comCaminhos: boolean): Historia {
  const git = (a: string[]) => execFileSync("git", a, { cwd, encoding: "utf8", maxBuffer: 1 << 28 });
  return {
    repo,
    rasa: git(["rev-parse", "--is-shallow-repository"]).trim() === "true",
    commits: lerOGitLog(git(argumentosDoGitLog(comCaminhos))),
  };
}

describe("LAB-162 · nenhuma sessão desta casa na história de um vizinho", () => {
  const vizinhos = VIZINHOS.map((v) => ({ repo: v, caminho: join(RAIZ, "..", v) }));

  for (const v of vizinhos) {
    test(`o clone \`${v.repo}\` está nesta máquina — sem ele, reprova com a receita`, () => {
      expect(
        existsSync(join(v.caminho, ".git")),
        `clone ausente: git clone https://github.com/jonny583/${v.repo} ${v.caminho}`,
      ).toBe(true);
    });
  }

  test("nenhum problema — e o universo é publicado", () => {
    const r = conferirNenhumCommitNosVizinhos({
      casa: historiaDe("archilly-lab", RAIZ, true),
      vizinhos: vizinhos
        .filter((v) => existsSync(join(v.caminho, ".git")))
        .map((v) => historiaDe(v.repo, v.caminho, false)),
    });
    const u = r.universo;
    console.log(
      `    esta casa: ${u.commitsDaCasa} commit(s), ${u.daCasaComSessao} com rodapé; ${u.sessoesDaCasa} sessão(ões) da ` +
        `casa, ${u.sessoesDaDirecao} da direção`,
    );
    for (const v of u.vizinhos) {
      console.log(
        `    ${v.repo}: ${v.commits} commit(s), ${v.comSessao} com rodapé; ${v.sessoesEmComumComADirecao} sessão(ões) ` +
          `em comum, todas da direção`,
      );
    }
    expect(r.problemas).toEqual([]);
    // O universo de hoje, com folga: se a leitura encolher (o `--remotes` errado, o formato quebrado), o número cai aqui.
    expect(u.commitsDaCasa).toBeGreaterThan(400);
    expect(u.sessoesDaCasa).toBeGreaterThan(50);
    expect(u.sessoesDaDirecao).toBeGreaterThan(5);
    for (const v of u.vizinhos) expect(v.comSessao).toBeGreaterThan(100);
  });
});
