/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O NOSSO CUSTO NÃO VAZA PARA O CLIENTE. (Central, 08/10/2026)
 *  Escopada por DESTINO desde o LAB-80 — sem lista de isenções. (D243)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **O achado é da Central:** a função de consulta de preço devolvia `custoMedido` e
 * `multiplicador` desde a migração 0001, nos dois modos, e **quem recebeu mostrou** — a tela de
 * Créditos do hub imprimia o custo vezes o fator para o cliente.
 *
 * Há **três níveis de dono**, e confundi-los estraga tela e banco: o **Admin dono do Archilly**
 * (define fator, preço e regra de cobrança, e é o único que vê o que pagamos), o **Admin do
 * escritório** e o **usuário comum**. *O que está dentro da conta nunca chega aos dois últimos.*
 *
 * # O que mudou no LAB-80, e por que
 *
 * Até aqui a trava isentava **11 arquivos por nome**, e o teto dessa lista tinha um critério:
 * *se ele subir sem que uma regra nova tenha sido escrita, o errado é o DESENHO.* **Ele
 * disparou** — as duas últimas entradas eram relatórios de prompt. Agora a pergunta é **para
 * onde a linha vai**: o desenho, os motivos e as medições moram em
 * `src/destino-do-que-sai.ts`, e aqui ficam as travas.
 *
 * **A lista nominal foi a ZERO**, e isso é medido: das 11 entradas do desenho velho, **nenhuma**
 * precisaria de isenção pela régua nova — inclusive **este arquivo**, que carrega os padrões e
 * as fixtures e agora é varrido como qualquer outro.
 */

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

import {
  CHAMADA_PAGA_DE_IA,
  DESTINOS,
  MARGEM_DE_DINHEIRO,
  NOMES_DO_NOSSO_CUSTO,
  RIGOR,
  SABOTAGEM,
  VALORES_DO_NOSSO_CUSTO,
  aContaDosDestinosFecha,
  arquivosDoGit,
  chamadasPagasDeIA,
  destinosDe,
  formaDoRegistro,
  varrerOQueSai,
  vazaNoDestino,
} from "../src/destino-do-que-sai.ts";
import { afirmadoNaLinha, lugaresDaPagina } from "../src/texto-das-regras.ts";
import { semLiteraisDeRegex, soOsNomesUsados } from "../src/varredura-de-chamadas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const correr = (args: string[]): string =>
  execFileSync("git", args, { cwd: RAIZ, encoding: "utf8", maxBuffer: 64e6 });

const arquivos = arquivosDoGit(RAIZ, correr);
const varredura = varrerOQueSai(RAIZ, arquivos);

describe("o nosso custo não vaza — escopado por destino (D243)", () => {
  test("o escopo é tudo que o git carrega, e o universo sai publicado", () => {
    expect(varredura.universo).toBeGreaterThan(100);
    expect(varredura.universo).toBe(arquivos.length);
  });

  test("a partição por destino SOMA o universo — partição que não soma não é partição", () => {
    expect(aContaDosDestinosFecha(varredura), JSON.stringify(varredura.porDestino)).toBe(true);
  });

  test("todo destino declara o rigor dele, e são os cinco do vocabulário", () => {
    expect(Object.keys(RIGOR).sort()).toEqual([...DESTINOS].sort());
    for (const d of DESTINOS) {
      expect(RIGOR[d].oQue.length, d).toBeGreaterThan(20);
    }
  });

  test("nenhum arquivo vaza custo, fator ou margem — em nenhum destino", () => {
    const linhas = varredura.achados.map((a) => `[${a.destino}] ${a.arquivo}:${a.linha} · ${a.regra}`);
    expect(linhas, linhas.join("\n")).toEqual([]);
  });

  test("este repositório não faz chamada paga de IA — medido em posição de identificador", () => {
    const chamadas = chamadasPagasDeIA(RAIZ, arquivos);
    expect(chamadas, chamadas.join("\n")).toEqual([]);
  });

  /**
   * **A lista nominal é ZERO, e esta trava é o que impede a volta dela.**
   *
   * A régua velha comprava a própria isenção: `vazamento-de-custo.test.ts` era a primeira linha
   * da lista. A prova de que o desenho novo não precisa disso é que **este arquivo está no
   * universo varrido** e não aparece nos achados.
   */
  test("a varredura varre A SI MESMA — sem isenção, sem lista, sem teto", () => {
    expect(varredura.isencoesNominais).toBe(0);
    for (const meu of [
      "external-engines/esteira/tests/vazamento-de-custo.test.ts",
      "external-engines/esteira/src/destino-do-que-sai.ts",
      "external-engines/esteira/src/cobranca-por-uso.ts",
    ]) {
      // A varredura só alcança o que o git CARREGA — arquivo novo entra no universo depois do
      // `git add`, e é essa a fronteira certa: o que o git não carrega não sai daqui.
      expect(
        arquivos.includes(meu),
        `${meu} não está no universo varrido — se o arquivo é novo, falta o \`git add\``,
      ).toBe(true);
      expect(
        varredura.achados.map((a) => a.arquivo),
        `${meu} voltou a ser acusado — a régua precisaria de isenção outra vez`,
      ).not.toContain(meu);
    }
  });
});

/**
 * ── A GUARDA DA GUARDA, NOS DOIS SENTIDOS E POR DESTINO ─────────────────────
 *
 * *Régua nova nasce estreita demais, e às vezes larga demais — as duas coisas são o mesmo
 * defeito: ninguém a conferiu dos dois lados.* Então cada destino planta um vazamento que a
 * régua **tem** de pegar e uma frase da casa que ela **não pode** acusar, e a reprovação diz o
 * nome do destino.
 */
describe("a guarda da guarda — por destino, nos dois sentidos", () => {
  for (const d of DESTINOS) {
    test(`${d}: a régua PEGA o vazamento plantado`, () => {
      expect(vazaNoDestino(d, SABOTAGEM[d].pega), `${d} · ${SABOTAGEM[d].pega}`).toBe(true);
    });

    test(`${d}: a régua POUPA a frase da casa`, () => {
      expect(vazaNoDestino(d, SABOTAGEM[d].naoPega), `${d} · ${SABOTAGEM[d].naoPega}`).toBe(false);
    });
  }

  test("a régua do REGISTRO separa enunciar de vazar — e é a diferença toda", () => {
    // Enunciar: a frase que PROÍBE carrega os nomes que proíbe, e não traz número.
    expect(vazaNoDestino("registro", "custo, fator e margem nunca chegam ao usuário comum")).toBe(false);
    expect(vazaNoDestino("registro", "o multiplicador não chega ao usuário")).toBe(false);
    expect(vazaNoDestino("registro", "Custo por uso se repassa ao usuário com o multiplicador da família")).toBe(false);
    // Vazar: o mesmo nome COM o número.
    expect(vazaNoDestino("registro", "o multiplicador da família é 3")).toBe(true);
    expect(vazaNoDestino("registro", "a margem de lucro é 40 % sobre o custo")).toBe(true);
    expect(vazaNoDestino("registro", "custo × 3")).toBe(true);
  });

  /**
   * **O D137 outra vez, e desta vez contra a régua que eu acabei de escrever.**
   *
   * A primeira versão da régua do valor pedia só `fator` perto de número, e acusou **três**
   * linhas — todas a razão entre pico e média de uma rampa. São as linhas de verdade, copiadas
   * dos arquivos: *régua nova nasceu com a doença que a régua velha já tinha curado, um campo
   * ao lado.*
   */
  test("o FATOR geométrico não é acusado — seria medir ortografia (D137, segunda vez)", () => {
    for (const linha of [
      "**24,23 %** e pior **161,38 %**, fator de **6,7×**; `10ha-plano` dá 1,17 % contra",
      "15,44 %, fator de **13,2×**. Os dois indicadores ficam lado a lado, porque motor",
      "## 4 · A rampa: a média diluía o pico por um fator de 6 a 13",
    ]) {
      expect(vazaNoDestino("registro", linha), linha).toBe(false);
    }
  });

  test("a MARGEM geométrica não é acusada, em nenhum destino", () => {
    for (const linha of [
      "const margem = lado * 0.08;",
      "A grade cobre a caixa envolvente da gleba mais uma margem.",
      "a extensão vai de ponta a ponta dele com 15 m de margem",
      "retrato do erro, sem margem para dúvida",
    ]) {
      for (const d of DESTINOS) {
        expect(vazaNoDestino(d, linha), `${d} · ${linha}`).toBe(false);
      }
    }
  });

  test("os nomes crus continuam sendo pegos onde o rigor é máximo", () => {
    for (const texto of ['{ "custoMedido": 0.012 }', "const multiplicador = 3;", "custo × 3", "markup: 3"]) {
      expect(NOMES_DO_NOSSO_CUSTO.some((re) => re.test(texto)), texto).toBe(true);
      expect(vazaNoDestino("dado", texto), texto).toBe(true);
    }
    expect(MARGEM_DE_DINHEIRO.test("a margem de lucro é 40%")).toBe(true);
    expect(MARGEM_DE_DINHEIRO.test("preço com margem")).toBe(true);
  });

  test("a régua do VALOR exige o número — e o buraco disso fica declarado", () => {
    expect(VALORES_DO_NOSSO_CUSTO.some((re) => re.test("markup de 3"))).toBe(true);
    // DECLARADO: sem palavra de dinheiro na linha, "o fator é 3" escapa da régua do registro.
    // Fecha-se com proximidade de dinheiro ou não se fecha — afrouxar devolve as três linhas
    // geométricas da rampa, que é o que o teste acima proíbe.
    expect(vazaNoDestino("registro", "o fator é 3")).toBe(false);
    expect(vazaNoDestino("registro", "o fator sobre o custo é 3")).toBe(true);
  });

  test("a régua da chamada paga reprova o caso ruim E aprova o caso bom", () => {
    for (const r of [
      'import Anthropic from "@anthropic-ai/sdk";',
      'import OpenAI from "openai";',
      'const c = require("openai");',
      "const cliente = new Anthropic({ apiKey: k });",
      "const r = await central.ia.leitura({ paginas: 3 });",
      "const pedido: PedidoIA = { operacao: 'ia.texto' };",
    ]) {
      expect(CHAMADA_PAGA_DE_IA.some((re) => re.test(r)), r).toBe(true);
    }
    for (const b of [
      "// este repositório não usa PedidoIA nem central.ia",
      "o gateway da Central mede sozinho segundos de vídeo",
    ]) {
      expect(CHAMADA_PAGA_DE_IA.some((re) => re.test(soOsNomesUsados(b))), b).toBe(false);
    }
  });
});

describe("o DESTINO sai da estrutura do caminho, não de uma lista", () => {
  const amostra = [
    "external-engines/symbios/adapter/ferramentas/navegador/index.html",
    "external-engines/symbios/adapter/ferramentas/navegador/prova.js",
    "external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts",
    "external-engines/symbios/upstream/src/lib.rs",
    "external-engines/symbios/upstream/VERSION",
    "docs/relatorios/LAB-80.md",
    "CLAUDE.md",
    "external-engines/esteira/src/destino-do-que-sai.ts",
    "docs/provas/LAB-80/destino-do-que-sai.json",
    "external-engines/conferir.sh",
  ];
  const d = destinosDe(amostra);

  test("a bancada e o que o navegador carrega são TELA; o driver do Playwright não é", () => {
    expect(d.get("external-engines/symbios/adapter/ferramentas/navegador/index.html")).toBe("tela");
    expect(d.get("external-engines/symbios/adapter/ferramentas/navegador/prova.js")).toBe("tela");
    // Roda em Node, não é desenhado: código.
    expect(d.get("external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts")).toBe("codigo");
  });

  test("`upstream/` vem ANTES de tudo — um .rs de lá não é código desta casa (§3)", () => {
    expect(d.get("external-engines/symbios/upstream/src/lib.rs")).toBe("upstream-intocavel");
    expect(d.get("external-engines/symbios/upstream/VERSION")).toBe("upstream-intocavel");
  });

  test("o `.md` é REGISTRO, o `.ts` e o `.sh` são código", () => {
    expect(d.get("docs/relatorios/LAB-80.md")).toBe("registro");
    expect(d.get("CLAUDE.md")).toBe("registro");
    expect(d.get("external-engines/esteira/src/destino-do-que-sai.ts")).toBe("codigo");
    expect(d.get("external-engines/conferir.sh")).toBe("codigo");
  });

  /**
   * **A PROVA é registro, e não dado** — `docs/` inteiro é onde a casa escreve os próprios
   * números. Dado é o que ENTRA (terreno) e o que SAI cru, fora de `docs/`.
   *
   * Isto não foi escolha de gosto: a primeira versão punha a prova em `dado`, varrido no cru, e
   * a varredura **acusou a própria prova do LAB-80 em 7 linhas** — as fixtures da sabotagem e a
   * prosa que explica a regra.
   */
  test("`docs/` inteiro é REGISTRO — a prova também; dado é o que entra e o que sai cru", () => {
    expect(d.get("docs/provas/LAB-80/destino-do-que-sai.json")).toBe("registro");
    const fora = destinosDe([
      "docs/provas/LAB-07/medir.txt",
      "docs/terrenos/completo.geojson",
      "outputs/symbios_probe.txt",
      "external-engines/esteira/package.json",
    ]);
    expect(fora.get("docs/provas/LAB-07/medir.txt")).toBe("registro");
    expect(fora.get("docs/terrenos/completo.geojson")).toBe("registro");
    expect(fora.get("outputs/symbios_probe.txt")).toBe("dado");
    expect(fora.get("external-engines/esteira/package.json")).toBe("dado");
  });

  test("todo arquivo do repositório recebe UM destino, e nenhum fica de fora", () => {
    const todos = destinosDe(arquivos);
    expect(todos.size).toBe(arquivos.length);
    for (const f of arquivos) {
      expect(DESTINOS, f).toContain(todos.get(f)!);
    }
  });

  test("um .html novo traz a pasta dele para o rigor máximo, sem lista para atualizar", () => {
    const comNovo = destinosDe(["pasta/nova/pagina.html", "pasta/nova/app.js", "pasta/nova/motor.ts"]);
    expect(comNovo.get("pasta/nova/pagina.html")).toBe("tela");
    expect(comNovo.get("pasta/nova/app.js")).toBe("tela");
    expect(comNovo.get("pasta/nova/motor.ts")).toBe("codigo");
  });
});

describe("as leituras que o desenho usa, conferidas dos dois lados", () => {
  test("o lugar da linha na página: cerca, citação e prosa", () => {
    const pagina = ["prosa nua", "> citada", "```", "dentro do bloco", "```", "prosa de novo"].join("\n");
    expect(lugaresDaPagina(pagina)).toEqual([
      "prosa",
      "citacao",
      "bloco-de-codigo",
      "bloco-de-codigo",
      "bloco-de-codigo",
      "prosa",
    ]);
  });

  test("o nome entre crases está sendo NOMEADO, não afirmado", () => {
    // As duas linhas de verdade que sobravam depois da cerca e da citação: nos dois casos o
    // nome está entre crases, e o número vem de `D137` — um NÚMERO DE DECISÃO.
    const comCrase = "medir **ortografia**, que é o D137: a régua só conta `margem` quando a linha traz lucro";
    expect(afirmadoNaLinha(comCrase, /\bmargem\b/)).toBe(false);
    expect(afirmadoNaLinha("a margem de lucro é 40 %", /\bmargem\b/)).toBe(true);
  });

  /**
   * **A limpeza certa para Markdown é a cegueira certa para JSON** (D261).
   *
   * Em Markdown as aspas são citação e saem; em JSON são sintaxe, e toda chave está entre elas.
   * Ler uma prova com a limpeza de Markdown apagaria a chave junto com o valor — e um vazamento
   * de verdade passaria em silêncio, que é a espécie de falso negativo do D164.
   */
  test("a prova é lida CRUA, e a página em Markdown pela posição", () => {
    const comoEmJson = '  "custoMedido": 0.012,';
    expect(vazaNoDestino("registro", comoEmJson, "dados")).toBe(true);
    // A MESMA linha lida como Markdown escapa, porque as aspas viram citação. É o motivo de
    // `formaDoRegistro` existir — e a prova de que uma limpeza só não serve às duas formas.
    expect(vazaNoDestino("registro", comoEmJson, "markdown")).toBe(false);
    expect(formaDoRegistro("docs/provas/LAB-80/destino-do-que-sai.json")).toBe("dados");
    expect(formaDoRegistro("docs/relatorios/LAB-80.md")).toBe("markdown");
  });

  test("a frase que ENUNCIA a regra passa nas duas formas — ela não traz número", () => {
    const enuncia = "custo, fator e margem nunca chegam ao usuário comum";
    expect(vazaNoDestino("registro", enuncia, "markdown")).toBe(false);
    expect(vazaNoDestino("registro", enuncia, "dados")).toBe(false);
  });

  test("o literal de regex não é USO do nome — e a divisão sobrevive", () => {
    expect(soOsNomesUsados("const r = /\\bmultiplicador\\b/;")).not.toContain("multiplicador");
    expect(soOsNomesUsados("return /markup/i.test(s);")).not.toContain("markup");
    expect(soOsNomesUsados("const multiplicador = 3;")).toContain("multiplicador");
    expect(semLiteraisDeRegex("const m = a / b;")).toBe("const m = a / b;");
    expect(semLiteraisDeRegex("const n = total / 2 + outro / 3;")).toBe("const n = total / 2 + outro / 3;");
  });
});
