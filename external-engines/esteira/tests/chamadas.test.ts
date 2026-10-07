/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-52 · As travas das duas varreduras da Central.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A mais importante delas não é nenhuma das varreduras: é a que confere que **as três
 * regras type-aware continuam LIGADAS nos dois pacotes**.
 *
 * **Porque foi assim que elas se perderam.** Os dois `eslint.config.js` traziam
 * `projectService: false`, e sem serviço de projeto **toda** regra que precisa de tipo
 * fica muda — **não avisa, não reclama, simplesmente não roda**. É a forma do D123 (a
 * prova no navegador que ninguém rodava) num lugar onde ninguém pensa em olhar: dentro da
 * configuração do lint.
 *
 * Uma regra desligada em silêncio é pior que uma regra ausente, porque o verde continua
 * verde e ninguém procura.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

import {
  AUSENCIA_NAO_E_ERRO,
  NOMES_DE_IDENTIFICADOR_DE_CONTA,
  REGRAS_DE_CHAMADA,
  semComentarios,
  soOCodigo,
  varrerUmArquivo,
} from "../src/varredura-de-chamadas.ts";

const RAIZ = join(import.meta.dir, "..", "..", "..");
const FONTE = "external-engines/esteira/src/varredura-de-chamadas.ts";
const ESTE = "external-engines/esteira/tests/chamadas.test.ts";

/** As três regras que só funcionam com tipo, e os dois pacotes que as declaram. */
const REGRAS_COM_TIPO = [
  "@typescript-eslint/no-floating-promises",
  "@typescript-eslint/no-misused-promises",
  "@typescript-eslint/require-await",
] as const;
const PACOTES = ["external-engines/esteira", "external-engines/testfit"] as const;

const arquivosTs = () =>
  execFileSync("git", ["-C", RAIZ, "ls-files", "--cached", "--others", "--exclude-standard", "-z", "*.ts"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\0")
    .filter((f) => f.length > 0 && !f.includes("node_modules/") && !f.endsWith(".d.ts"));

const varrerTudo = () => {
  const achados = [];
  let parametros = 0;
  let campos = 0;
  for (const rel of arquivosTs()) {
    const r = varrerUmArquivo(readFileSync(join(RAIZ, rel), "utf8"), rel);
    achados.push(...r.achados);
    parametros += r.parametros;
    campos += r.campos;
  }
  return { achados, parametros, campos };
};

/**
 * Os achados CONHECIDOS e BENIGNOS, cada um com o motivo. **Conjunto fechado**: a trava
 * reprova um quarto, e reprova também um destes que desaparecer — lista que não se
 * revalida envelhece igual a comentário (D104).
 */
const BENIGNOS: Record<string, string> = {
  "degrada-chamada-para-numero|external-engines/esteira/src/varredura-de-chamadas.ts":
    "o `?? \"\"` é sobre uma cadeia opcional (`[0]?.trim()`) dentro desta própria varredura: ausência de parâmetro é normal, e o padrão casa a chamada vizinha",
  "degrada-chamada-para-numero|entrega/registro-de-motores/registro.ts":
    "`this.padrao() ?? \"\"` serializa 'não há motor padrão' como string vazia, para o hospedeiro salvar — é valor declarado, não erro engolido",
  "numero-sem-conferir|external-engines/symbios/adapter/ferramentas/medir.ts":
    "`Number(receita.id.match(/(\\d+)ha/)![1])` numa ferramenta de diagnóstico: o id é literal, montado no mesmo arquivo por escadaDeTamanho([10,50,100,200]), e se faltasse o `!` ESTOURA em vez de degradar — não é a classe da Central (D175)",
};

describe("LAB-52 · as três regras type-aware continuam LIGADAS", () => {
  for (const pacote of PACOTES) {
    test(`${pacote}: o lint pede TIPO (projectService) e declara as três regras`, () => {
      const cfg = readFileSync(join(RAIZ, pacote, "eslint.config.js"), "utf8");
      expect(soOCodigo(cfg), `${pacote}: o lint voltou a rodar SEM tipo, e as regras ficaram mudas`)
        .toContain("projectService: true");
      // **O nome tem de estar NO LUGAR DA GRAMÁTICA onde ele significa "regra
      // ligada"** — `"<regra>": "error"` —, e NÃO em qualquer lugar do arquivo. A
      // primeira versão desta trava usava `toContain(regra)` e PASSOU com a regra
      // removida, porque o comentário que a explica cita o nome dela. Quem pegou foi a
      // sabotagem, não eu (D179). É a quinta vez da família do D137/D142/D155/D177.
      const semCom = semComentarios(cfg);
      for (const regra of REGRAS_COM_TIPO) {
        expect(
          new RegExp(`"${regra.replace(/[/-]/g, (c) => "\\" + c)}"\\s*:\\s*"(?:error|warn)"`).test(semCom),
          `${pacote}: a regra ${regra} não está LIGADA (citá-la em comentário não liga nada)`,
        ).toBe(true);
      }
    });
  }

  test("o `projectService: false` não volta por descuido em pacote nenhum", () => {
    // A forma exata de perder as três de novo: trocar `true` por `false` para o lint
    // ficar rápido. O preço do tipo está medido (0,85 s → 7,9 s no esteira) e está no
    // relatório; se alguém quiser desligá-lo, que desligue EXPLICITAMENTE e mexa aqui.
    for (const pacote of PACOTES) {
      const cfg = soOCodigo(readFileSync(join(RAIZ, pacote, "eslint.config.js"), "utf8"));
      expect(cfg, `${pacote}: voltou a \`projectService: false\``).not.toContain("projectService: false");
    }
  });
});

describe("LAB-52 · a varredura de texto, e o que ela acha hoje", () => {
  const { achados } = varrerTudo();

  test("todo achado é um dos BENIGNOS declarados — e nenhum deles desapareceu", () => {
    const chaves = achados.map((a) => `${a.regra}|${a.arquivo}`);
    const novos = chaves.filter((k) => !(k in BENIGNOS));
    expect(novos, "achado NOVO: ou é caso real e vira conserto, ou é benigno e entra em BENIGNOS com o motivo").toEqual([]);
    const fantasmas = Object.keys(BENIGNOS).filter((k) => !chaves.includes(k));
    expect(fantasmas, "a lista de benignos cita achado que já não existe — tire-o").toEqual([]);
  });

  test("todo benigno tem motivo escrito, e não é motivo vazio", () => {
    for (const [k, porque] of Object.entries(BENIGNOS)) {
      expect(porque.length, `${k}: benigno sem motivo é omissão com nome bonito`).toBeGreaterThan(40);
    }
  });

  test("cada regra declarada é EXERCITADA pelo exemplo dela", () => {
    // Regra que nada exercita fica verde por não procurar — e numa varredura isso é
    // indistinguível de "está limpo" (a lição do LAB-47).
    for (const regra of REGRAS_DE_CHAMADA) {
      const nomes = varrerUmArquivo(regra.exemploQuePega(), "exemplo.ts").achados.map((a) => a.regra);
      expect(nomes, `a regra '${regra.nome}' foi declarada e o exemplo dela NÃO é pego`).toContain(regra.nome);
    }
  });

  test("toda regra diz o que é e o que NÃO pega", () => {
    for (const regra of REGRAS_DE_CHAMADA) {
      expect(regra.oQue.length, `${regra.nome}: sem dizer o que casa`).toBeGreaterThan(20);
      expect(regra.oQueNaoPega.length, `${regra.nome}: regra sem buraco declarado promete tudo`).toBeGreaterThan(20);
    }
  });

  test("o fonte da varredura e este teste NÃO são acusados pelos padrões que citam", () => {
    // D177/D155: os dois arquivos CITAM `catch {}`, `?? 0` e os nomes de identificador
    // ao explicá-los. Sem o `soOCodigo()` eles seriam os primeiros acusados.
    for (const alvo of [FONTE, ESTE]) {
      const meus = achados.filter((a) => a.arquivo === alvo && !(`${a.regra}|${alvo}` in BENIGNOS));
      expect(meus, `${alvo}: a régua acusou o arquivo que a descreve`).toEqual([]);
    }
  });
});

describe("LAB-52 · o ZERO de identificador de conta é MEDIDO, não silêncio", () => {
  const { achados, parametros, campos } = varrerTudo();

  test("nenhum parâmetro nem campo é identificador de pessoa ou de conta", () => {
    expect(achados.filter((a) => a.familia === "identificador-de-conta")).toEqual([]);
  });

  test("e as DUAS réguas de fato examinaram volume — zero de régua parada não vale", () => {
    // É a diferença entre "não achei" e "não procurei" (D164). Se um dia estes números
    // caírem, caem numa trava e não num silêncio.
    expect(parametros, `só ${parametros} parâmetros examinados — a régua parou de olhar`).toBeGreaterThan(3000);
    expect(campos, `só ${campos} campos examinados — a régua parou de olhar`).toBeGreaterThan(2500);
    expect(NOMES_DE_IDENTIFICADOR_DE_CONTA.length).toBeGreaterThan(20);
  });
});

describe("LAB-52 · a lista de ausência-não-é-erro, que estreitou a régua", () => {
  test("ela existe, é curta e cada nome é um método de ausência declarada", () => {
    // 28 falsos positivos viraram 2 por causa dela, e a conta está no relatório.
    expect(AUSENCIA_NAO_E_ERRO.length).toBeGreaterThan(4);
    for (const nome of AUSENCIA_NAO_E_ERRO) expect(nome).toMatch(/^[a-zA-Z]+$/);
  });

  test("o idioma CERTO não é acusado: `at(-1) ?? 0` e `get(k) ?? 0` passam", () => {
    const certos = "const u = v.at(-1) ?? 0;\nconst n = m.get(k) ?? 0;\n";
    expect(varrerUmArquivo(certos, "certo.ts").achados).toEqual([]);
  });

  test("e a chamada que PODE falhar continua acusada", () => {
    const errado = "const x = calcularRampa(via) ?? 0;\n";
    const nomes = varrerUmArquivo(errado, "errado.ts").achados.map((a) => a.regra);
    expect(nomes, "estreitar a régua não pode cegá-la").toContain("degrada-chamada-para-numero");
  });

  test("a prova do LAB-52 existe e traz o escopo como número", () => {
    const p = join(RAIZ, "docs/provas/LAB-52/varredura-de-chamadas.json");
    expect(existsSync(p), "rode `bun run lab52`").toBe(true);
    const prova = JSON.parse(readFileSync(p, "utf8"));
    expect(prova.escopo.regras, "regra nova sem regerar a prova — rode `bun run lab52`").toBe(REGRAS_DE_CHAMADA.length);
    expect(prova.escopo.arquivos).toBeGreaterThan(100);
    expect(prova.doisMotores.oLintComTipo.estavaLigada).toBe(false);
  });
});
