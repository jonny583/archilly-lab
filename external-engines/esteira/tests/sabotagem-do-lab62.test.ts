/**
 * **LAB-223 (item 900) · as quatro sabotagens do LAB-62, REFEITAS a cada verde — no commit da prova e na ponta de hoje**
 * (D451).
 *
 * ```sh
 * bun test tests/sabotagem-do-lab62.test.ts
 * ```
 *
 * A prova `LAB-62/sabotagem.json` registra um ato — *"quebrei estas travas e elas reprovaram"* — que ninguém tinha
 * refeito. Esta trava refaz as quatro numa pasta temporária, no commit da prova e na ponta de hoje, e mais a reconstrução
 * da ordem (a 2 depois da 1, sem restaurar a prova); exige que cada uma morda como medido — três como a prova diz, a 2 com
 * UMA trava e não três — e que a conta da prova só feche na ordem. A parte pura e o que fica fora estão em
 * `src/sabotagem-do-lab62.ts`.
 *
 * **Precisa do Lab com a história inteira** (o commit `d40b2c0`), e por isso NÃO está no portão sem clones do
 * `verde.yml`, que clona raso: roda no verde completo (`./external-engines/conferir.sh`). O ato não roda vizinho — e isso
 * se mede aqui, pelo fecho dos `import`. Tudo se clona por caminho, para uma pasta temporária, e a pasta some no fim.
 */
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { vizinhosQueRoda } from "../src/o-commit-do-vizinho-na-prova.ts";
import { falhasDoBun, sabotar } from "../src/sabotagem-do-lab31.ts";
import {
  A_DOIS_DEPOIS_DA_UM,
  A_FERRAMENTA,
  A_PROVA,
  A_SUITE,
  AS_TROCAS,
  O_QUE_A_FERRAMENTA_ESCREVE,
  OS_PARES,
  TESTES_DA_SUITE,
  aTrocaDaProva,
  frasesDaProva,
  type Par,
  type SabotagemDaProva,
  type Troca,
} from "../src/sabotagem-do-lab62.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ESTEIRA = join(RAIZ, "external-engines", "esteira");
const MINUTOS = 60_000;
const PARES = Object.keys(OS_PARES) as Par[];
const PROVA = JSON.parse(readFileSync(join(RAIZ, "docs", "provas", A_PROVA), "utf8")) as {
  prompt: string;
  oComando: string;
  sabotagens: SabotagemDaProva[];
};
const daProva = (n: number) => PROVA.sabotagens.find((s) => s.numero === n)!;
const trocaDe = (n: number) => AS_TROCAS.find((t) => t.numero === n)!;

describe("LAB-223 · a parte pura, nos dois sentidos", () => {
  test("as quatro trocas são as quatro da prova; três batem a conta sozinhas, e a 2 só na ordem", () => {
    expect(AS_TROCAS.map((t) => t.numero)).toEqual(PROVA.sabotagens.map((s) => s.numero));
    expect(PROVA.oComando).toBe(`bun run lab62 (exit) + bun test ${A_SUITE.slice("external-engines/esteira/".length)}`);
    for (const t of AS_TROCAS.filter((x) => x.numero !== 2)) expect(aTrocaDaProva(PROVA, t), `sabotagem ${t.numero}`).toBeNull();
    expect(aTrocaDaProva(PROVA, trocaDe(2))).toContain("a prova diz 3 de 20, a troca derruba 1");
    expect(aTrocaDaProva(PROVA, trocaDe(2), A_DOIS_DEPOIS_DA_UM.derruba)).toBeNull();
  });

  test("O LADO RUIM: outro número, outra conta ou outro denominador reprova", () => {
    const t = trocaDe(3);
    expect(aTrocaDaProva(PROVA, { ...t, numero: 9 })).toContain("não tem a sabotagem");
    expect(aTrocaDaProva(PROVA, { ...t, derruba: t.derruba.slice(1) })).toContain("a prova diz 4 de 20");
    const outra = { sabotagens: [{ ...daProva(3), travas: { fail: 4, de: 21 } }] };
    expect(aTrocaDaProva(outra, t)).toContain("conta de 21");
    const saiuBem = { sabotagens: [{ ...daProva(3), ferramenta: { ...daProva(3).ferramenta, exit: 0 } }] };
    expect(aTrocaDaProva(saiuBem, t)).toContain("saiu com 0");
  });

  test("a reconstrução da ordem é a 2 somada ao resto da 1 — e só a 1 derruba os dois nomes que sobram", () => {
    expect(A_DOIS_DEPOIS_DA_UM.derruba).toHaveLength(daProva(2).travas.fail);
    const sobram = A_DOIS_DEPOIS_DA_UM.derruba.filter((d) => !trocaDe(2).derruba.includes(d));
    for (const t of AS_TROCAS) {
      const tem = sobram.every((d) => t.derruba.includes(d));
      expect(tem, `sabotagem ${t.numero}`).toBe(t.numero === 1);
    }
    // a 2 é a única que para antes de escrever: as outras sobrescrevem a prova, e o resto delas não chega a ninguém
    expect(AS_TROCAS.filter((t) => !t.escreve).map((t) => t.numero)).toEqual([2]);
  });

  test("as frases da ferramenta partem no `·` da prova", () => {
    expect(frasesDaProva(daProva(4))).toHaveLength(2);
    expect(frasesDaProva(daProva(1))).toHaveLength(1);
  });
});

describe("LAB-223 · as sabotagens do LAB-62 REFEITAS, em pasta temporária", () => {
  let pasta = "";
  const arv = (par: Par) => join(pasta, par);
  const commitDe = (par: Par) => (OS_PARES[par] === "HEAD" ? execFileSync("git", ["-C", RAIZ, "rev-parse", "HEAD"], { encoding: "utf8" }).trim() : OS_PARES[par]);

  beforeAll(() => {
    pasta = mkdtempSync(join(tmpdir(), "lab62-sabotagem-"));
    for (const par of PARES) {
      const commit = commitDe(par);
      if (spawnSync("git", ["-C", RAIZ, "cat-file", "-e", `${commit}^{commit}`]).status !== 0)
        throw new Error(`o commit ${commit} não está na história do Lab — desrase-o: git fetch --unshallow origin`);
      execFileSync("git", ["clone", "-q", "--no-checkout", RAIZ, arv(par)]);
      execFileSync("git", ["-C", arv(par), "checkout", "-q", commit]);
      symlinkSync(join(ESTEIRA, "node_modules"), join(arv(par), "external-engines", "esteira", "node_modules"));
    }
  });

  afterAll(() => {
    if (pasta) rmSync(pasta, { recursive: true, force: true });
  });

  const rodar = (dir: string, args: string[]) => {
    const r = spawnSync("bun", args, { cwd: dir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    return { exit: r.status ?? -1, saida: `${r.stdout ?? ""}\n${r.stderr ?? ""}` };
  };
  const esteira = (lab: string) => join(lab, "external-engines", "esteira");
  const suite = (lab: string) => {
    const r = rodar(esteira(lab), ["test", A_SUITE.slice("external-engines/esteira/".length)]);
    return { ...r, falhas: falhasDoBun(r.saida) };
  };
  const ferramenta = (lab: string) => rodar(esteira(lab), [A_FERRAMENTA.slice("external-engines/esteira/".length)]);
  const mudados = (lab: string) =>
    execFileSync("git", ["-C", lab, "status", "--porcelain", "--untracked-files=all"], { encoding: "utf8" }) // sem trim: o "XY " da porcelana
      .split("\n")
      .filter((l) => l.trim() !== "" && !l.includes("node_modules"))
      .map((l) => l.slice(3))
      .sort();
  const aplicar = (lab: string, t: Troca) => {
    const caminho = join(lab, t.arquivo);
    let texto = readFileSync(caminho, "utf8");
    for (const troca of t.trocas) {
      const s = sabotar(texto, troca);
      if (s === null) throw new Error(`sabotagem ${t.numero}: "${troca.de}" não está UMA vez em ${t.arquivo}`);
      texto = s;
    }
    writeFileSync(caminho, texto);
  };
  const restaurar = (lab: string, ...caminhos: string[]) =>
    execFileSync("git", ["-C", lab, "checkout", "-q", "--", ...(caminhos.length ? caminhos : ["."])]);

  test(
    "o ANTES, nos dois pares: a suíte aprova a prova gravada, e a ferramenta sai bem, reescreve só a dela, e as 20 aprovam",
    () => {
      for (const par of PARES) {
        const lab = arv(par);
        const s0 = suite(lab);
        expect(s0.falhas, `${par}: a suíte sobre a prova gravada`).toEqual([]);
        expect(s0.saida, `${par}: a suíte tem ${TESTES_DA_SUITE} testes`).toMatch(new RegExp(`\\b${TESTES_DA_SUITE} pass\\b`));
        const f = ferramenta(lab);
        const sujos = mudados(lab);
        const s = suite(lab);
        restaurar(lab);
        console.log(`    [sabotagem-do-lab62] ${par} · Lab ${commitDe(par).slice(0, 7)} · sem sabotagem: ferramenta exit ${f.exit}, escreveu ${sujos.length}, suíte ${s.falhas.length} reprovado(s)`);
        expect(f.exit, `${par}: a ferramenta sem sabotagem`).toBe(0);
        // o carimbo de hora muda a `as-tres-listas.json`; os blocos saem iguais aos gravados
        expect(sujos, `${par}: a ferramenta reescreve a prova dela, e só ela`).toEqual([O_QUE_A_FERRAMENTA_ESCREVE[0]]);
        expect(s.falhas, `${par}: as travas sobre o que a ferramenta escreveu`).toEqual([]);
      }
    },
    5 * MINUTOS,
  );

  test(
    "cada sabotagem, sozinha e nos dois pares, para a ferramenta com a frase da prova e derruba as travas medidas — a 2, UMA",
    () => {
      for (const t of AS_TROCAS) {
        for (const par of PARES) {
          const lab = arv(par);
          aplicar(lab, t);
          const f = ferramenta(lab);
          const sujos = mudados(lab);
          const s = suite(lab);
          restaurar(lab);
          console.log(`    [sabotagem-do-lab62] ${par} · sabotagem ${t.numero}: ferramenta exit ${f.exit}, ${t.escreve ? "escreveu" : "parou sem escrever"}; suíte ${s.falhas.length} de ${TESTES_DA_SUITE} reprovado(s) (a prova: ${daProva(t.numero).travas.fail})`);
          expect(f.exit, `${par} · sabotagem ${t.numero}: a ferramenta tinha de reprovar`).toBe(1);
          for (const frase of frasesDaProva(daProva(t.numero))) expect(f.saida, `${par} · sabotagem ${t.numero}`).toContain(frase);
          expect(sujos, `${par} · sabotagem ${t.numero}: o que ficou escrito`).toEqual(
            (t.escreve ? [...O_QUE_A_FERRAMENTA_ESCREVE, t.arquivo] : [t.arquivo]).sort(),
          );
          expect(s.exit, `${par} · sabotagem ${t.numero}: a suíte não reprovou`).toBe(1);
          expect(s.falhas, `${par} · sabotagem ${t.numero}: os testes derrubados`).toEqual([...t.derruba].sort());
        }
      }
    },
    10 * MINUTOS,
  );

  test(
    "na ORDEM da prova (a 2 logo depois da 1, sem restaurar a prova), a 2 dá os três da prova — a dela e as duas da 1",
    () => {
      const um = AS_TROCAS.find((t) => t.numero === A_DOIS_DEPOIS_DA_UM.antes)!;
      const dois = AS_TROCAS.find((t) => t.numero === A_DOIS_DEPOIS_DA_UM.sabotagem)!;
      for (const par of PARES) {
        const lab = arv(par);
        aplicar(lab, um);
        expect(ferramenta(lab).exit, `${par}: a 1`).toBe(1);
        restaurar(lab, um.arquivo); // a fonte volta; a prova que a 1 escreveu fica
        aplicar(lab, dois);
        const f = ferramenta(lab);
        const s = suite(lab);
        restaurar(lab);
        console.log(`    [sabotagem-do-lab62] ${par} · sabotagem 2 depois da 1 (reconstrução da ordem): ferramenta exit ${f.exit}; suíte ${s.falhas.length} de ${TESTES_DA_SUITE} reprovado(s) (a prova: ${daProva(2).travas.fail})`);
        expect(f.exit, par).toBe(1);
        expect(s.falhas, `${par}: os três da prova, pelo nome`).toEqual([...A_DOIS_DEPOIS_DA_UM.derruba]);
        expect(s.falhas.length, par).toBe(daProva(2).travas.fail);
      }
    },
    5 * MINUTOS,
  );

  test("o ato não roda vizinho — medido pelo fecho de `import` (`vizinhosQueRoda`), nos dois pares", () => {
    for (const par of PARES) {
      const vizinhos = [...new Set([A_FERRAMENTA, A_SUITE].flatMap((a) => vizinhosQueRoda(a, arv(par))))].sort();
      console.log(`    [sabotagem-do-lab62] ${par} · lab62.ts + tres-listas.test.ts → ${vizinhos.length ? vizinhos.join(", ") : "só o Lab"}`);
      expect(vizinhos, par).toEqual([]);
    }
  });
});
