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
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { DA_OUTRA_MAO, medirOEscopo, remedirAProva } from "../src/escopo-da-varredura.ts";
import {
  REGRAS_DE_CONFIGURACAO,
  varrerConfiguracao,
} from "../src/varredura-de-configuracao.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVA = join(RAIZ, "docs", "provas", "LAB-57", "varredura-de-configuracao.json");
const PACOTES = ["external-engines/esteira", "external-engines/testfit"] as const;
const ler = (rel: string) => readFileSync(join(RAIZ, rel), "utf8");

/**
 * O escopo RECONTADO na árvore de agora — o universo começa no `git ls-files`, que é o
 * LUGAR, e não numa lista escrita aqui: *lista à mão não vê o arquivo que nasceu depois
 * dela*, e aí a trava fica verde por não ter olhado.
 *
 * **Sem rede e sem clone vizinho:** o `ls-files` é deste repositório, e a varredura lê
 * arquivos dele. Custa ~0,3 s, e é por isso que a forma escolhida foi recontar e não
 * comparar carimbos — *o carimbo do disco não é o do git, e numa sessão nova todo arquivo
 * tem a data do checkout* (D287).
 */
const carregadosDeAgora = (): string[] =>
  execFileSync("git", ["-C", RAIZ, "ls-files", "-z"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\0")
    .filter((f) => f.length > 0);
const escopoDeAgora = () => medirOEscopo(carregadosDeAgora(), ler);

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
    // ── O LIMIAR SAIU, E A RECONTAGEM ENTROU (LAB-86, D287) ───────────────
    //
    // Aqui estava `configuracoesEncontradas > 20`, `configuracoesVarridas > 5` e
    // `linhasDeCodigoLidas > 10000`. **Medido ao abrir o item 019: a prova commitada dizia
    // 128 arquivos de código e 36 157 linhas, e a mesma árvore dizia 187 e 50 714** — velha
    // por semanas, e os três limiares passavam folgados.
    //
    // > **Régua que confere uma prova com `maior que` aceita qualquer prova velha que já
    // > fosse grande o bastante quando nasceu.** O limiar mede se o número é PLAUSÍVEL; só a
    // > recontagem mede se ele é VERDADE — e num repositório que cresce, o limiar fica mais
    // > frouxo a cada commit, sem ninguém mexer nele.
    //
    // A recontagem vive no `src/escopo-da-varredura.ts`, a MESMA função que a ferramenta
    // chama: duas implementações da mesma pergunta divergiriam (D231).
    expect(remedirAProva(p.escopo, escopoDeAgora().numeros)).toEqual([]);
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

  /**
   * ── OS DOIS SENTIDOS DA RECONTAGEM (item 019, D287) ──────────────────────
   *
   * O item pediu os dois, com a sabotagem: a trava tem de **reprovar** uma prova gerada
   * antes de uma edição, e **passar calada** na prova gerada depois.
   *
   * **E o caso válido que quase parece inválido está aqui**, porque ele é o que mata este
   * tipo de vigia: a prova que **não mudou porque nada que ela mede mudou** PASSA. Uma régua
   * que exigisse carimbo mais novo a cada commit reprovaria a árvore correta, e *vigia que
   * nasce vermelho vira ruído e morre.*
   */
  test("O LADO RUIM: prova com UM número velho REPROVA, e diz qual", () => {
    const agora = escopoDeAgora().numeros;
    // O estrago é exatamente o do D204: o número que a prova carrega é o de UMA EDIÇÃO
    // ATRÁS. Aqui, uma linha de código a menos.
    const velha = { ...agora, linhasDeCodigoLidas: agora.linhasDeCodigoLidas - 1 };
    const achou = remedirAProva(velha, agora);
    expect(achou).toHaveLength(1);
    expect(achou[0]?.chave).toBe("linhasDeCodigoLidas");
    expect(achou[0]?.naProva).toBe(agora.linhasDeCodigoLidas - 1);
    expect(achou[0]?.naArvore).toBe(agora.linhasDeCodigoLidas);
  });

  test("O LADO RUIM: o número que o LIMIAR deixava passar REPROVA agora", () => {
    // Este é o caso MEDIDO: a prova commitada dizia 128 arquivos e 36 157 linhas, e a árvore
    // dizia 187 e 50 714. Os limiares (`> 20`, `> 5`, `> 10000`) passavam folgados nos três.
    const agora = escopoDeAgora().numeros;
    const comoEstavaNoDisco = {
      ...agora,
      arquivosDeCodigoVarridos: 128,
      // Na prova de então a chave era `arquivosQueOGitCarrega`, o TOTAL; desde o LAB-107 o
      // universo se conta sem a escrita da outra mão, com outro nome (D334). O 364 era o
      // total e não serve de valor para a chave nova — aqui fica só para dizer que divergia.
      arquivosQueOGitCarregaForaDaCaixa: 364,
      linhasDeCodigoLidas: 36157,
    };
    const achou = remedirAProva(comoEstavaNoDisco, agora);
    expect(achou.map((x) => x.chave).sort()).toEqual([
      "arquivosDeCodigoVarridos",
      "arquivosQueOGitCarregaForaDaCaixa",
      "linhasDeCodigoLidas",
    ]);
    // E a régua VELHA, aqui inline, aprovava os três — é o que prova que havia defeito.
    expect(comoEstavaNoDisco.linhasDeCodigoLidas).toBeGreaterThan(10000);
    expect(comoEstavaNoDisco.arquivosDeCodigoVarridos).toBeGreaterThan(20);
  });

  test("O LADO RUIM: chave que a prova NÃO TRAZ é velha, e não 'igual'", () => {
    // Prova de um formato antigo, sem a chave. Faltar não é bater — *zero é medição, null é
    // "não medi"* (D23), e aqui a ausência tem de reprovar.
    const agora = escopoDeAgora().numeros;
    const semAChave: Record<string, unknown> = { ...agora };
    delete semAChave["regras"];
    expect(remedirAProva(semAChave, agora).map((x) => x.chave)).toEqual(["regras"]);
  });

  test("O LADO BOM que quase parece ruim: prova que não mudou porque NADA mudou PASSA", () => {
    // Duas recontagens seguidas na mesma árvore batem — então a trava não reprova a árvore
    // correta só porque houve um commit. É isto que separa a recontagem do carimbo.
    const a = escopoDeAgora().numeros;
    const b = escopoDeAgora().numeros;
    expect(remedirAProva(a, b)).toEqual([]);
    expect(a).toEqual(b);
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

/**
 * ── LAB-107 · A ESCRITA DA OUTRA MÃO SAI DA CONTA, nos dois sentidos (D334) ──
 *
 * Medido: 15 de 15 escritas da direção na caixa deixavam esta prova vermelha, e só pelo número
 * do universo. A régua nova tem de **passar calada** no item novo da caixa e **continuar
 * reprovando** tudo o que a velha pegava de verdade — o arquivo desta casa que entrou depois da
 * prova (o LAB-98 e o LAB-104), e o desligador escondido na pasta da outra mão.
 *
 * Cada caso planta UM arquivo no universo de agora e reconta: o `ler` devolve texto vazio para o
 * plantado, que não existe no disco.
 */
describe("LAB-107 · a escrita da outra mão sai da CONTA, não da varredura", () => {
  const medirCom = (plantado: string, texto = "") => {
    const base = carregadosDeAgora();
    const lerComPlantado = (rel: string) => (rel === plantado ? texto : ler(rel));
    return {
      antes: medirOEscopo(base, ler).numeros,
      depois: medirOEscopo([...base, plantado], lerComPlantado).numeros,
    };
  };

  test("O LADO BOM: item NOVO da direção na caixa NÃO deixa a prova velha", () => {
    // É o caso das 15: `docs/caixa-de-entrada/030.md` escrito noutro clone.
    const { antes, depois } = medirCom("docs/caixa-de-entrada/030.md", "# 030 — um item\n");
    expect(remedirAProva(antes, depois)).toEqual([]);
  });

  test("O LADO BOM que quase parece ruim: o adendo também, com nome que não é número", () => {
    const { antes, depois } = medirCom("docs/caixa-de-entrada/029-adendo-2.md");
    expect(remedirAProva(antes, depois)).toEqual([]);
  });

  test("O LADO RUIM: arquivo desta casa fora da caixa AINDA reprova — o caso do LAB-104", () => {
    // O LAB-104 saiu com a prova contando 587 e a árvore 588: um arquivo desta casa entrou
    // depois de a prova ser gerada. Isso a régua nova não pode deixar de ver.
    const { antes, depois } = medirCom("docs/relatorios/LAB-999.md");
    expect(remedirAProva(antes, depois).map((x) => x.chave)).toEqual(["arquivosQueOGitCarregaForaDaCaixa"]);
  });

  test("O LADO RUIM: ao lado da caixa, mas fora dela, reprova — o prefixo é a pasta inteira", () => {
    const { antes, depois } = medirCom("docs/caixa-de-entrada-velha/001.md");
    expect(remedirAProva(antes, depois).map((x) => x.chave)).toEqual(["arquivosQueOGitCarregaForaDaCaixa"]);
  });

  test("O LADO RUIM: CÓDIGO posto na caixa é contado E varrido — o desligador não se esconde lá", () => {
    const { antes, depois } = medirCom("docs/caixa-de-entrada/truque.ts", "// @ts-ignore\nexport {};\n");
    const chaves = remedirAProva(antes, depois).map((x) => x.chave).sort();
    expect(chaves).toContain("arquivosQueOGitCarregaForaDaCaixa");
    expect(chaves).toContain("arquivosDeCodigoVarridos");
    expect(depois.arquivosDeCodigoVarridos).toBe(antes.arquivosDeCodigoVarridos + 1);
  });

  test("O LADO RUIM: CONFIGURAÇÃO posta na caixa é contada E encontrada", () => {
    const { antes, depois } = medirCom("docs/caixa-de-entrada/verde.yml", "on: push\n");
    const chaves = remedirAProva(antes, depois).map((x) => x.chave);
    expect(chaves).toContain("arquivosQueOGitCarregaForaDaCaixa");
    expect(chaves).toContain("configuracoesEncontradas");
  });

  test("a exceção é UMA, tem motivo escrito, e a prova a publica", () => {
    expect(DA_OUTRA_MAO).toHaveLength(1);
    expect(DA_OUTRA_MAO[0]!.porque.length).toBeGreaterThan(80);
    const p = JSON.parse(readFileSync(PROVA, "utf8")) as { escopo: Record<string, unknown> };
    expect(p.escopo["foraDaContaDoUniverso"]).toEqual(DA_OUTRA_MAO.map((x) => x.porque));
    // E a chave velha, o TOTAL, não volta para a prova: chave que muda de sentido muda de nome.
    expect(p.escopo["arquivosQueOGitCarrega"]).toBeUndefined();
  });

  test("o universo de agora TEM caixa — senão o lado bom passaria por não haver o que tirar", () => {
    const carregados = carregadosDeAgora();
    const daCaixa = carregados.filter((f) => DA_OUTRA_MAO.some((x) => x.casa(f)));
    expect(daCaixa.length, "nenhum arquivo da caixa no `git ls-files`: a exceção não mediu nada").toBeGreaterThan(10);
    expect(escopoDeAgora().numeros.arquivosQueOGitCarregaForaDaCaixa).toBe(carregados.length - daCaixa.length);
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
