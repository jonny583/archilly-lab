/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-57 · As travas da varredura das configurações.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **A que mais importa é a do `--max-warnings 0`.** Sem ela, o conserto deste prompt se
 * desfaz com uma edição de uma palavra, e o repositório volta a ter regras de lint que
 * **aparecem na saída e não reprovam** — a segunda forma do D178, e a mais silenciosa das
 * três, porque o passo sai verde com o aviso impresso.
 */

import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  REGRAS_DE_CONFIGURACAO,
  varrerConfiguracao,
} from "../src/varredura-de-configuracao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-57", "varredura-de-configuracao.json");
const PACOTES = ["external-engines/esteira", "external-engines/testfit"] as const;
const ler = (rel: string) => readFileSync(join(RAIZ, rel), "utf8");

describe("LAB-57 · o lint REPROVA aviso, nos dois pacotes", () => {
  for (const pacote of PACOTES) {
    test(`${pacote}: o script de lint traz \`--max-warnings 0\``, () => {
      const pj = JSON.parse(ler(`${pacote}/package.json`)) as { scripts?: Record<string, string> };
      const lint = pj.scripts?.["lint"] ?? "";
      expect(lint, `${pacote}: sem script de lint`).toContain("eslint");
      expect(
        /--max-warnings\s+0/.test(lint),
        `${pacote}: o lint voltou a rodar SEM \`--max-warnings 0\` — e aí toda regra em "warn" ` +
          "aparece na saída e NÃO reprova o passo. É a segunda forma do D178",
      ).toBe(true);
    });
  }

  test("e a régua REFLETE isso: com a bandeira, `regra-em-warn` deixa de acusar", () => {
    // O par é medido, não presumido: a MESMA linha de configuração significa duas coisas
    // opostas, e quem decide é o script do pacote.
    const cfg = 'rules: { "@typescript-eslint/no-explicit-any": "warn" }';
    expect(
      varrerConfiguracao(cfg, "eslint.config.js", { lintReprovaAviso: false }).achados.map((a) => a.regra),
    ).toContain("regra-em-warn");
    expect(
      varrerConfiguracao(cfg, "eslint.config.js", { lintReprovaAviso: true }).achados.map((a) => a.regra),
    ).not.toContain("regra-em-warn");
  });
});

describe("LAB-57 · o `skipLibCheck` tem MOTIVO ESCRITO, nos dois", () => {
  for (const pacote of PACOTES) {
    test(`${pacote}: o desligador é declarado, com a medição ao lado`, () => {
      const t = ler(`${pacote}/tsconfig.json`);
      if (!/"skipLibCheck":\s*true/.test(t)) return; // desligado de vez: melhor ainda
      expect(
        /skipLibCheck/.test(t.split('"skipLibCheck"')[0]!),
        `${pacote}: \`skipLibCheck: true\` voltou a ficar SEM o próprio nome no motivo — ` +
          "era a forma do D104 em configuração: o comentário acima falava de OUTROS dois flags",
      ).toBe(true);
      expect(t, `${pacote}: o motivo não traz a medição`).toMatch(/ZERO erros/);
    });
  }

  test("o número do comentário dos dois flags foi REMEDIDO e está riscado", () => {
    for (const pacote of PACOTES) {
      const t = ler(`${pacote}/tsconfig.json`);
      expect(t, `${pacote}: o 20 velho não está riscado`).toContain("~~");
      expect(t, `${pacote}: falta o número remedido`).toContain("1 604");
      expect(t, `${pacote}: falta dizer quantos são AQUI`).toMatch(/QUATRO AQUI/);
    }
  });
});

describe("LAB-57 · as regras e o escopo", () => {
  test("cada regra é EXERCITADA pelo exemplo dela", () => {
    for (const r of REGRAS_DE_CONFIGURACAO) {
      const nomes = varrerConfiguracao(r.exemploQuePega(), r.arquivos[0]!).achados.map((a) => a.regra);
      expect(nomes, `a regra '${r.nome}' foi declarada e o exemplo dela NÃO é pego`).toContain(r.nome);
    }
  });

  test("toda regra diz o que casa, o que NÃO pega, e QUAL LIMPEZA usa — com o porquê", () => {
    // A última é a lição do LAB-56: ter as duas ferramentas não basta, a pergunta decide
    // qual delas. Regra que não declara a limpeza não sabe o que está medindo.
    for (const r of REGRAS_DE_CONFIGURACAO) {
      expect(r.oQue.length, `${r.nome}: sem dizer o que casa`).toBeGreaterThan(20);
      expect(r.oQueNaoPega.length, `${r.nome}: regra sem buraco declarado promete tudo`).toBeGreaterThan(20);
      expect(["cru", "semComentarios"]).toContain(r.limpeza);
      expect(r.porqueEssaLimpeza.length, `${r.nome}: limpeza escolhida sem motivo`).toBeGreaterThan(30);
      expect(["desligada", "nao-pode-reprovar", "sem-motivo-escrito"]).toContain(r.forma);
    }
    // As TRÊS formas têm de estar cobertas: ficar só na "desligada" responderia a
    // pergunta do D178 e não a do chat.
    const formas = new Set(REGRAS_DE_CONFIGURACAO.map((r) => r.forma));
    expect(formas.size, "a varredura deixou de cobrir uma das três formas").toBe(3);
  });

  test("a prova existe, traz o ESCOPO como número e nada fica fora sem motivo", () => {
    expect(existsSync(PROVA), "rode `bun run lab57`").toBe(true);
    const p = JSON.parse(readFileSync(PROVA, "utf8")) as {
      escopo: Record<string, number | string>;
      porArquivo: { arquivo: string; varrido: boolean; porqueFora?: string }[];
      naoDeclarados: string[];
      declarados: Record<string, string>;
      regras: { nome: string; achados: number }[];
    };
    expect(p.escopo["configuracoesEncontradas"]).toBeGreaterThan(20);
    expect(p.escopo["configuracoesVarridas"]).toBeGreaterThan(5);
    expect(p.escopo["linhasDeCodigoLidas"]).toBeGreaterThan(10000);
    expect(p.regras.length).toBe(REGRAS_DE_CONFIGURACAO.length);
    // Tudo que ficou fora tem motivo escrito — é o que separa "não achei" de "não procurei".
    for (const l of p.porArquivo) {
      if (l.varrido) continue;
      expect(l.porqueFora?.length ?? 0, `${l.arquivo}: fora do escopo SEM motivo`).toBeGreaterThan(40);
    }
    // E todo achado que sobra é declarado, com motivo.
    expect(p.naoDeclarados, "achado NOVO: ou vira conserto, ou entra em DECLARADOS com o motivo").toEqual([]);
    for (const [k, porque] of Object.entries(p.declarados)) {
      expect(porque.length, `${k}: declarado sem motivo é omissão com nome bonito`).toBeGreaterThan(40);
    }
  });

  test("as duas formas que NÃO existem aqui saem como ZERO MEDIDO", () => {
    // Zero de régua parada é indistinguível de zero de árvore limpa (D164). Estas duas
    // regras olham arquivo de verdade e não acham nada — e é isso que o zero significa.
    const p = JSON.parse(readFileSync(PROVA, "utf8")) as { regras: { nome: string; achados: number }[] };
    const por = new Map(p.regras.map((r) => [r.nome, r.achados]));
    expect(por.get("passo-que-engole-falha"), "apareceu passo que engole falha no verde").toBe(0);
    expect(por.get("teste-desligado"), "apareceu `.only`/`.skip`/`.todo` na suíte — o `.only` reduz a suíte a UM teste").toBe(0);
    expect(por.get("lint-sem-max-warnings")).toBe(0);
    expect(por.get("regra-em-warn")).toBe(0);
  });
});

describe("LAB-57 · o `conferir.sh` NÃO tem `set -e`, e isso é CERTO", () => {
  test("ele acumula a falha e sai 1 no fim — o contrário seria parar no primeiro erro", () => {
    // É o contra-exemplo do prompt: ausência de `set -e` parece o defeito da classe e é a
    // decisão certa aqui, porque o §7 exige a lista inteira de passos ruins.
    const sh = ler("external-engines/conferir.sh");
    expect(sh).toContain("set -u");
    expect(sh, "passou a usar `set -e`: o verde pararia no primeiro passo e esconderia o resto").not.toMatch(
      /^set -e/m,
    );
    expect(sh, "a falha deixou de ser acumulada").toMatch(/falhou=1/);
    expect(sh, "o script deixou de sair 1 quando algo falha").toMatch(/exit 1/);
    expect(sh, "algum passo passou a engolir a falha").not.toMatch(/\|\|\s*true/);
  });
});
