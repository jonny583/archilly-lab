/**
 * AS REGRAS DO `CLAUDE.md` QUE ERAM SÓ AFIRMAÇÃO. (LAB-36)
 *
 * ```sh
 * bun test tests/regras.test.ts
 * ```
 *
 * # O pedido, e o que a varredura achou
 *
 * O chat mandou: *"as quatro regras sem teste que você listou viram guarda ou saem
 * do documento."*
 *
 * **A lista original não ficou gravada em lugar nenhum** — ela saiu num balanço
 * pedido fora da fila, foi para o chat e não para um arquivo. Isso é defeito do
 * mesmo tipo que este prompt conserta, então em vez de confiar na memória eu
 * **varri o `CLAUDE.md` de novo**, regra por regra, perguntando *"o que, hoje,
 * reprovaria se isto deixasse de ser verdade?"*.
 *
 * Deram **cinco**, não quatro — e **duas estavam FALSAS como escritas**:
 *
 * | regra | estado antes | o que foi feito |
 * |---|---|---|
 * | §4 *"não tem interface"* | **FALSA** — o HTML da bancada do navegador já existia | a regra declara a exceção, e a guarda conta os HTML |
 * | §7 *"prova com gleba, motor, semente e contrato **em cada arquivo**"* | **FALSA em 8 de 32** | a regra vale para prova de MEDIÇÃO, e as exceções viram lista declarada |
 * | §4 *"não reimplementa o Validator nem o Judge"* | verdadeira, sem guarda | guarda |
 * | §4 *"conserto do Lab vem desligado por padrão"* | verdadeira, sem guarda | guarda |
 * | §5 *"Testfit é nome interno"* | verdadeira, sem guarda | guarda |
 *
 * Mais uma sexta que é da mesma família e estava igualmente solta: §4 *"não escreve
 * em repositório vizinho"*.
 *
 * **Regra que ninguém pode desmentir não é regra, é slogan** — e duas delas já
 * tinham deixado de ser verdade sem que nada acusasse.
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVAS = join(RAIZ, "docs", "provas");

/** Lista todos os arquivos sob um diretório, recursivamente. */
function arquivos(dir: string, filtro: (f: string) => boolean): string[] {
  const achados: string[] = [];
  for (const nome of readdirSync(dir)) {
    if (nome === "node_modules" || nome === ".git" || nome === "target") continue;
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) achados.push(...arquivos(caminho, filtro));
    else if (filtro(nome)) achados.push(caminho);
  }
  return achados;
}

describe("§4 · não tem interface — e a única exceção é declarada", () => {
  const HTML_PERMITIDO = join(
    "external-engines", "symbios", "adapter", "ferramentas", "navegador", "index.html",
  );

  test("existe exatamente UM html no repositório, e é a bancada da prova no navegador", () => {
    // Antes do LAB-36 a regra dizia "não tem interface" e este arquivo já existia:
    // a regra era FALSA como escrita. Agora ela declara a exceção, e esta guarda
    // reprova um segundo HTML — que seria interface de verdade entrando sem aviso.
    const htmls = arquivos(join(RAIZ, "external-engines"), (f) => f.endsWith(".html"))
      .map((f) => f.slice(RAIZ.length + 1))
      .sort();
    expect(htmls, "html novo no repositório: ou é a bancada, ou a §4 deixou de valer").toEqual([
      HTML_PERMITIDO,
    ]);
  });

  test("a bancada não é produto: ela carrega o `.wasm` e publica números", () => {
    // O que distingue bancada de interface é o que a página FAZ. Esta carrega o
    // motor e publica medição; se um dia ela ganhar formulário de usuário, a
    // exceção deixa de se justificar.
    const html = readFileSync(join(RAIZ, HTML_PERMITIDO), "utf8");
    expect(html).toContain("prova.js");
    expect(html.toLowerCase()).not.toContain("<form");
    expect(html.toLowerCase()).not.toContain("<input");
  });
});

describe("§7 · prova de MEDIÇÃO traz gleba, motor, semente e contrato", () => {
  /**
   * Os CONCEITOS, e os nomes que cada um aceita. (LAB-36)
   *
   * A primeira versão desta guarda exigia a chave `"gleba"` literal, e reprovou 13
   * de 32 provas — **por defeito da régua**: há prova que identifica a gleba em
   * `glebas` (plural), e arquivo de SAÍDA que a identifica em `entrada`, com a
   * versão do contrato dentro do bloco `archilly`. Exigir um nome só é medir
   * ortografia, não conteúdo. Com os nomes aceitos declarados, sobram **9**, e aí
   * cada uma é um caso de verdade.
   */
  const CONCEITOS: Record<string, string[]> = {
    gleba: ["gleba", "glebas", "entrada", "montadaSobre", "projeto"],
    semente: ["semente"],
    contrato: ["contrato", "contratoLidoPelaEsteira", "archilly", "contratoDeSaida"],
  };

  /**
   * Provas que **não medem gleba**, com o motivo. (LAB-36)
   *
   * Lista declarada, no espírito dos inventários das pontes: o que não cumpre a
   * regra **diz por que**, e a guarda confere a lista contra os arquivos. Exceção
   * que ninguém revalida envelhece igual a comentário (D104).
   */
  const NAO_MEDEM_GLEBA: Record<string, string> = {
    "LAB-04/oraculo.json":
      "oráculo de geometria: casos de esqueleto reto verificados contra a literatura, sem gleba",
    "LAB-07/diagnostico-relevo.json":
      "diagnóstico do interpolador do próprio Lab: compara nuvens de pontos, não roda motor — sem semente e sem contrato",
    "LAB-07/lab01-50ha-ondulado.entrada.json":
      "é uma ENTRADA guardada como prova do LAB-01, não uma medição: entrada não tem semente",
    "LAB-24/formato-proposto.json":
      "o formato proposto ao Generate e ao Orçamento: é contrato de dado, não medição",
    "LAB-26/varredura.json":
      "varredura de DECLARAÇÕES da porta: o objeto medido é a ficha de capacidades, não uma gleba",
    "LAB-31/navegador.json":
      "a prova no navegador mede o `.wasm` carregando em Chromium de verdade, sem terreno nenhum",
    "LAB-31/sabotagem.json":
      "o registro da sabotagem do comando único: mede o script e o código de saída, não terreno",
    "LAB-38/ci.json":
      "os três disparos do CI, com a sabotagem de propósito: mede o workflow e os códigos de saída dele, não terreno",
    "LAB-52/varredura-de-chamadas.json":
      "varre o CÓDIGO deste repositório atrás das duas classes que a Central nomeou — o objeto medido são 113 arquivos .ts, não terreno",
    "LAB-49/detector-de-prova-velha.json":
      "mede o ESCOPO do detector de prova velha e a sabotagem que prova que ele reprova: o objeto medido são duas provas e uma trava, não terreno",
    "LAB-57/varredura-de-configuracao.json":
      "varre a ÁRVORE DE CONFIGURAÇÃO deste repositório — 27 arquivos, 6 regras, as três formas de desligar conferência —, não terreno: não há gleba, motor nem semente no que ela mede",
    "LAB-68/as-duas-pilhas.json":
      "mede a ORIGEM das falhas do verde e o commit de cada clone vizinho — o objeto medido são a suíte e os clones, não terreno: não há gleba, motor nem semente no que ela mede",
    "LAB-66/o-acumulado-dos-recados.json":
      "mede o ACUMULADO DOS RECADOS deste repositório — blocos, cabeçalhos, relatórios com e sem recado —, não terreno: não há gleba, motor nem semente no que ela mede",
    "LAB-66/sabotagem.json":
      "o registro das quatro sabotagens das travas da regra do bloco único: mede a régua, a ferramenta e a suíte, não terreno",
    "LAB-63/o-que-eu-aceitei.json":
      "mede AFIRMAÇÕES e não terreno: os endereços que os seis mecanismos declaram no clone do motor, a aritmética da CLAUDE.md §6 e a varredura de contraexemplo nas DECISOES.md — não há gleba, motor nem semente no que ela mede",
    "LAB-63/sabotagem.json":
      "o registro das quatro sabotagens das travas do que eu aceitei: mede a régua, a ferramenta e a suíte, não terreno",
    "LAB-62/as-tres-listas.json":
      "monta as TRÊS LISTAS que vão ao chat a partir das provas que já mediram gleba — os onze itens da FILA, os seis mecanismos e as formas de desligar conferência do motor —, e o objeto medido é a LISTA, não terreno",
    "LAB-62/sabotagem.json":
      "o registro das quatro sabotagens das travas das três listas: mede a régua, a ferramenta e a suíte, não terreno",
    "LAB-61/a-minha-lista-de-propostas.json":
      "mede a MINHA LISTA DE PROPOSTAS na FILA.md — itens, riscados, abertos, motivos e cópias —, não terreno: não há gleba, motor nem semente no que ela mede",
    "LAB-61/sabotagem.json":
      "o registro das três sabotagens das travas da lista: mede a régua, a lista e a suíte, não terreno",
    "LAB-60/configuracao-do-motor.json":
      "lê a ÁRVORE DE CONFIGURAÇÃO do clone do motor — 369 arquivos, 7 regras, as três formas de desligar conferência —, não terreno: não há gleba, motor nem semente no que ela mede",
    "LAB-60/sabotagem.json":
      "o registro das duas sabotagens das travas da limpeza e das regras: mede a régua, a ferramenta e a suíte, não terreno",
    "LAB-59/sabotagem.json":
      "o registro das quatro sabotagens das travas do contrafactual: mede a ferramenta, a suíte e os códigos de saída, não terreno",
    "LAB-58/sabotagem.json":
      "o registro das quatro sabotagens das travas do agrupamento: mede a ferramenta, a suíte e os códigos de saída, não terreno",
    "LAB-47/varredura-de-segredos.json":
      "a varredura de segredos mede a ÁRVORE DE ARQUIVOS deste repositório — escopo, regras e achados —, não terreno: não há gleba, motor nem semente no que ela mede",
  };

  /**
   * Provas CONGELADAS de antes da regra, e o dado que falta a cada uma. (LAB-36)
   *
   * **Conjunto FECHADO**: há teste exigindo que ele não cresça. Não se regera prova
   * congelada para consertar etiqueta (D118) — então o dado que falta no arquivo
   * **mora aqui**, nomeado, em vez de ficar perdido.
   */
  const CONGELADAS_ANTES_DA_REGRA: Record<string, { falta: string; oValor: string }> = {
    "LAB-06/ranking.json": { falta: "contrato", oValor: "1 — contrato de motor v1, como diz o LAB-06.md" },
    "LAB-07/medicoes.json": { falta: "contrato", oValor: "1 — contrato de motor v1, como diz o LAB-07.md" },
  };

  const provas = arquivos(PROVAS, (f) => f.endsWith(".json")).map((f) => f.slice(PROVAS.length + 1));

  /** As chaves de um JSON, em qualquer profundidade. */
  function chavesDe(o: unknown, acc = new Set<string>()): Set<string> {
    if (Array.isArray(o)) for (const v of o.slice(0, 50)) chavesDe(v, acc);
    else if (o && typeof o === "object") {
      for (const [k, v] of Object.entries(o)) {
        acc.add(k);
        chavesDe(v, acc);
      }
    }
    return acc;
  }

  const faltaEm = (rel: string) => {
    const ks = chavesDe(JSON.parse(readFileSync(join(PROVAS, rel), "utf8")));
    return Object.entries(CONCEITOS)
      .filter(([, nomes]) => !nomes.some((n) => ks.has(n)))
      .map(([c]) => c);
  };

  test("toda prova de medição traz os três conceitos, pelos nomes aceitos", () => {
    const faltando: string[] = [];
    for (const rel of provas) {
      if (rel in NAO_MEDEM_GLEBA || rel in CONGELADAS_ANTES_DA_REGRA) continue;
      const falta = faltaEm(rel);
      if (falta.length) faltando.push(`${rel} (falta ${falta.join(", ")})`);
    }
    expect(faltando, "prova de medição incompleta — ou complete, ou declare a exceção").toEqual([]);
  });

  test("a lista de exceções não envelheceu: cada uma existe e CONTINUA precisando ser exceção", () => {
    // As duas metades: exceção que aponta para arquivo que não existe mais, e
    // exceção que passou a cumprir a regra. As duas são lista velha.
    const todas = { ...NAO_MEDEM_GLEBA, ...CONGELADAS_ANTES_DA_REGRA };
    const fantasmas = Object.keys(todas).filter((rel) => !existsSync(join(PROVAS, rel)));
    expect(fantasmas, "a lista cita prova que não existe mais").toEqual([]);

    const jaCumprem = Object.keys(todas).filter((rel) => faltaEm(rel).length === 0);
    expect(jaCumprem, "esta prova já cumpre a regra: tire-a da lista de exceções").toEqual([]);
  });

  test("toda exceção tem motivo escrito, e não é motivo vazio", () => {
    for (const [rel, motivo] of Object.entries(NAO_MEDEM_GLEBA)) {
      expect(motivo.length, `${rel}: exceção sem motivo é exceção sem revisão`).toBeGreaterThan(30);
    }
  });

  test("as congeladas são conjunto FECHADO, e o dado que falta está nomeado aqui", () => {
    // Se esta lista crescer, alguém publicou prova nova incompleta e a chamou de
    // "de antes da regra". Duas, e são do LAB-06 e do LAB-07.
    expect(Object.keys(CONGELADAS_ANTES_DA_REGRA).sort()).toEqual([
      "LAB-06/ranking.json",
      "LAB-07/medicoes.json",
    ]);
    for (const [rel, { falta, oValor }] of Object.entries(CONGELADAS_ANTES_DA_REGRA)) {
      // O que falta no arquivo tem de ser o que a guarda de fato acha faltando —
      // senão a lista descreve um arquivo que não é este.
      expect(faltaEm(rel), `${rel}: a lista diz que falta outra coisa`).toEqual([falta]);
      expect(oValor.length, `${rel}: declare o valor, ou o dado se perde`).toBeGreaterThan(10);
    }
  });
});

describe("§4 · não reimplementa o Validator nem o Judge", () => {
  test("o julgamento vem do Generate, por importação", () => {
    // D20: sem versão leve, sem limiar mais frouxo por ser de fora. A forma de
    // desmentir é simples — o julgamento ser calculado aqui.
    const comum = readFileSync(join(import.meta.dirname, "..", "src", "motores", "comum.ts"), "utf8");
    expect(comum, "o Validator do Generate tem de ser IMPORTADO").toContain("@generate/");
  });

  test("nenhum arquivo do Lab define um validador próprio", () => {
    const fontes = arquivos(join(import.meta.dirname, "..", "src"), (f) => f.endsWith(".ts"));
    const suspeitos: string[] = [];
    for (const f of fontes) {
      const txt = readFileSync(f, "utf8");
      // Definir (não importar) algo chamado validador/judge é o que a regra proíbe.
      if (/(export )?(function|class) (validar|validador|Validator|Judge|julgarLocal)\b/.test(txt)) {
        suspeitos.push(f.slice(RAIZ.length + 1));
      }
    }
    expect(suspeitos, "isto é Validator próprio, e o D20 proíbe").toEqual([]);
  });
});

describe("§4 · conserto do Lab vem DESLIGADO por padrão", () => {
  test("o aparo só acontece se quem chama pedir", () => {
    // A regra: conserto do Lab é declarado e vem desligado. A forma de desmentir é
    // o padrão ser ligado — e aí uma medição sairia consertada sem ninguém pedir.
    const esteira = readFileSync(
      join(import.meta.dirname, "..", "..", "testfit", "adapter", "src", "esteira.ts"),
      "utf8",
    );
    expect(esteira, "o aparo tem de ser OPCIONAL no tipo").toContain("aparar?: boolean");
    expect(esteira, "o aparo só roda sob pedido").toContain("if (opcoes.aparar)");
    // E não pode haver valor-padrão ligando-o por trás.
    expect(esteira).not.toContain("aparar = true");
    expect(esteira).not.toContain("aparar ?? true");
  });

  test("quem liga o aparo DECLARA o que foi aparado", () => {
    // Ligar o conserto é permitido; ligar em silêncio não é. O motor do
    // Parcelamento liga, e publica o corte em `naoSoubeFazer`.
    const testfit = readFileSync(join(import.meta.dirname, "..", "src", "motores", "testfit.ts"), "utf8");
    expect(testfit).toContain("aparar: true");
    expect(testfit, "ligou o conserto e não publicou o tamanho dele").toContain("o Lab aparou");
  });
});

describe("§5 · \"Testfit\" é nome interno", () => {
  const PARA_O_USUARIO = ["docs/PENDENCIAS_JONNY.md", "docs/COMPARACAO_DOS_MOTORES.md"];

  test("texto voltado ao usuário nunca diz Testfit", () => {
    for (const rel of PARA_O_USUARIO) {
      const txt = readFileSync(join(RAIZ, rel), "utf8");
      expect(txt.toLowerCase(), `${rel}: "Testfit" é nome interno (§5)`).not.toContain("testfit");
    }
  });

  test("e diz o nome certo — a regra não é só proibir, é nomear", () => {
    const pagina = readFileSync(join(RAIZ, "docs", "COMPARACAO_DOS_MOTORES.md"), "utf8");
    expect(pagina).toContain("Laboratório de Parcelamento");
  });
});

describe("§4 · não escreve em repositório vizinho", () => {
  test("os clones somente-leitura estão limpos, e o ambiente é um dos dois declarados", () => {
    // ── O CI ACHOU UM DEFEITO AQUI NO PRIMEIRO DISPARO (LAB-38, D143) ────────
    //
    // A primeira versão desta trava exigia `conferidos.length > 0` e
    // `toContain("motor-testfit")`, com o comentário "zero clones conferidos
    // significaria que algo mudou de lugar". **No runner do CI não há clone
    // nenhum** — e não há por um motivo legítimo: ele roda só as travas que não
    // dependem dos vizinhos. A asserção acusava o ambiente de um defeito que era
    // da asserção.
    //
    // **E a proteção contra o falso verde que eu queria aqui já existe, e é
    // estrutural:** o verde completo NÃO PASSA sem os clones — o `typecheck` e
    // mais de 300 travas quebram na hora. Nenhum teste precisa afirmar isso.
    //
    // Então esta trava mede o que pode medir: clone que existe está limpo, e o
    // ambiente é um dos DOIS declarados, nunca um meio estado.
    const VIZINHOS = ["motor-testfit", "urban-create-hub-41d93a4d", "urban-scout-tool"];
    const casa = join(RAIZ, "..");
    const conferidos: string[] = [];
    const sujos: string[] = [];
    for (const v of VIZINHOS) {
      const dir = join(casa, v);
      if (!existsSync(join(dir, ".git"))) continue;
      conferidos.push(v);
      const saida = execFileSync("git", ["-C", dir, "status", "--porcelain"], { encoding: "utf8" });
      if (saida.trim().length > 0) sujos.push(`${v}: ${saida.trim().split("\n").length} arquivo(s)`);
    }
    // Isto vale SEMPRE, e é o coração da §4.
    expect(sujos, "o Lab escreveu em repositório vizinho — a §4 proíbe").toEqual([]);

    // E o ambiente é um dos dois, nunca pela metade: ou tem o clone do motor (e aí
    // a suíte inteira pode rodar), ou não tem nenhum (e aí só estas travas rodam).
    // Ter o Generate sem o motor, ou vice-versa, é ambiente quebrado — e o verde
    // falharia por motivo obscuro, que é o que o D124 manda evitar.
    if (!conferidos.includes("motor-testfit")) {
      expect(
        conferidos,
        "ambiente pela metade: há clone vizinho mas falta o do motor, que o tsconfig lê",
      ).toEqual([]);
    }
  });
});

describe("§7 · o CI existe, e a lista dele não é mentira (LAB-38)", () => {
  const CI = join(RAIZ, ".github", "workflows", "verde.yml");

  test("existe workflow, e ele roda o comando único", () => {
    // Até o LAB-38 não havia nenhum, e a dívida estava escrita no D125: o comando
    // existia, estava provado por sabotagem, e NADA o executava sozinho.
    expect(existsSync(CI), "o CI do LAB-38 desapareceu").toBe(true);
    const y = readFileSync(CI, "utf8");
    expect(y, "o trabalho do verde tem de rodar o comando único, não um pedaço dele").toContain(
      "./external-engines/conferir.sh",
    );
  });

  test("§1-B existe, e o arquivo que ela manda alimentar existe", () => {
    // ── Regra que ninguém pode desmentir é slogan (D136) ─────────────────────
    //
    // A §1-B nasceu no LAB-42 e manda todo balanço para um arquivo. Sem trava, ela
    // seria exatamente o que o LAB-36 achou em duas regras do §4 e do §7: afirmação
    // sem nada que reprove quando deixar de ser verdade.
    const claude = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
    expect(claude, "a §1-B saiu do CLAUDE.md").toContain("## 1-B · O BALANÇO vai para um arquivo");
    expect(claude, "a §1-B tem de nomear o arquivo").toContain("docs/relatorios/BALANCOS.md");
    expect(
      existsSync(join(RAIZ, "docs", "relatorios", "BALANCOS.md")),
      "a §1-B manda alimentar um arquivo que não existe",
    ).toBe(true);
    // A lição que é a razão da regra viaja com ela — a mesma disciplina do §4 sobre
    // motivo de perda não morar em comentário (D104).
    expect(claude, "a razão da §1-B tem de estar escrita nela").toContain(
      "O que vai ao chat e não vai a um arquivo não existe amanhã",
    );
  });

  test("dentro do `verde.yml`, TODO 'NN travas' é o mesmo número (LAB-47)", () => {
    // A trava de concordância abaixo casa só a frase VIVA, e por bom motivo: há
    // relatório antigo citando o número de então. Mas isso deixou um buraco DENTRO
    // do próprio workflow — a receita que ele imprime quando falta o segredo dizia
    // "protege 64 travas" enquanto o comentário no alto dizia 83. Dois números no
    // mesmo arquivo, e o arquivo não tem história para preservar: aqui todos têm de
    // bater. Achado ao acrescentar a trava do LAB-47.
    const texto = readFileSync(join(RAIZ, ".github/workflows/verde.yml"), "utf8");
    const ns = [...texto.matchAll(/(\d+)\s*\n?#?\s*travas/g)].map((m) => m[1]);
    expect(ns.length, "o workflow deixou de citar o número de travas").toBeGreaterThan(1);
    expect(new Set(ns).size, `o verde.yml cita números diferentes de travas: ${ns.join(", ")}`).toBe(1);
  });

  test("o número de travas do trabalho sem clones é o MESMO em todo lugar que o cita", () => {
    // ── Um número copiado em quatro arquivos é a forma do D116 (LAB-42) ──────
    //
    // "as 64 travas" nasceu no LAB-38 e foi colado no `CLAUDE.md`, no
    // `ONDE_PARAMOS`, na `FILA` e no comentário do próprio YAML. No LAB-42 entrou um
    // arquivo de teste novo na lista e o número virou **74** — em quatro lugares, à
    // mão. Número com quatro casas envelhece em três delas.
    //
    // Esta trava não calcula o número (contar `test(` com regex mediria texto, não
    // suíte); ela exige que as quatro cópias **concordem**, que é exatamente o
    // apodrecimento que aconteceria.
    //
    // **O que esta trava NÃO faz, e vai dito:** ela não confere se o número é o
    // VERDADEIRO — para isso teria de rodar a suíte, e contar `test(` com regex
    // mediria texto. Ela confere que as quatro cópias **concordam**, que é o
    // apodrecimento que de fato aconteceu: o LAB-42 pôs um arquivo na lista e as
    // quatro cópias precisaram da minha mão. O valor é meu para atualizar; a
    // divergência é dela para acusar.
    //
    // E a PRIMEIRA versão dela reprovou por defeito dela mesma: eu casei por
    // `"NN travas que leem arquivo"` e a `FILA.md` dizia só `"protege NN travas"` —
    // régua medindo UMA DAS FRASES em vez do número, a forma do D137. O conserto é
    // declarar a frase canônica e exigi-la nos quatro: régua que casa por frase tem de
    // dizer qual frase, e a frase tem de estar escrita nos quatro lugares.
    const onde: Record<string, string> = {
      "CLAUDE.md": readFileSync(join(RAIZ, "CLAUDE.md"), "utf8"),
      "docs/ONDE_PARAMOS.md": readFileSync(join(RAIZ, "docs", "ONDE_PARAMOS.md"), "utf8"),
      "docs/prompts/FILA.md": readFileSync(join(RAIZ, "docs", "prompts", "FILA.md"), "utf8"),
      ".github/workflows/verde.yml": readFileSync(CI, "utf8"),
    };
    const achados: Record<string, string[]> = {};
    for (const [arquivo, texto] of Object.entries(onde)) {
      // Só a frase VIVA, a que fala do trabalho do CI — e não qualquer "NN travas"
      // perdido no histórico do arquivo.
      achados[arquivo] = [
        ...texto.matchAll(/(\d+) travas que (?:leem arquivo do próprio repositório|não)/g),
      ].map((m) => m[1]!);
    }
    for (const [arquivo, ns] of Object.entries(achados)) {
      expect(ns.length, `${arquivo}: a frase do número de travas do CI desapareceu`).toBe(1);
    }
    const distintos = [...new Set(Object.values(achados).flat())];
    expect(
      distintos,
      `o número de travas do CI divergiu entre os arquivos: ${JSON.stringify(achados)}`,
    ).toHaveLength(1);
  });

  test("a lista do trabalho `guardas-sem-clones` só tem testes que NÃO precisam dos clones", () => {
    // Esta é a trava que impede o CI de virar FALSO VERDE: se alguém puser na
    // lista um teste que importa `@generate/*` ou `@testfit/*`, o trabalho passa a
    // falhar no CI por falta de clone — ou, pior, alguém "conserta" afrouxando.
    const y = readFileSync(CI, "utf8");
    const listados = [...y.matchAll(/tests\/([\w.-]+\.test\.ts)/g)].map((m) => m[1]!);
    expect(listados.length, "a lista do trabalho sem clones ficou vazia").toBeGreaterThan(0);

    const pasta = import.meta.dirname;
    for (const nome of new Set(listados)) {
      const caminho = join(pasta, nome);
      expect(existsSync(caminho), `o CI lista ${nome}, que não existe`).toBe(true);
      // ── E a régua tem de olhar o `from`, não a MENÇÃO (LAB-38) ───────────
      //
      // A primeira versão disto usava `fonte.includes("@generate/")` e reprovou
      // **este próprio arquivo**: ele cita `@generate/` como TEXTO, na trava que
      // confere que o `comum.ts` importa o Validator de lá. Medir menção em vez de
      // importação é a mesma forma do D137, e é a segunda vez que ela me pega — a
      // régua agora lê o especificador do `import`.
      const fonte = readFileSync(caminho, "utf8");
      const importados = [...fonte.matchAll(/^\s*import[^;]*?from\s+["']([^"']+)["']/gm)].map(
        (m) => m[1]!,
      );
      const proibidos = ["@generate/", "@testfit/", "@symbios/", "../../testfit/"];
      const presos = importados.filter((i) => proibidos.some((pr) => i.startsWith(pr)));
      expect(
        presos,
        `${nome} está na lista do trabalho que roda SEM os clones, e importa daqui`,
      ).toEqual([]);
    }
  });

  test("a precondição do segredo FALHA, e não pula — e traz a receita", () => {
    const y = readFileSync(CI, "utf8");
    expect(y, "sem o segredo o trabalho tem de sair com erro").toContain("exit 1");
    // A receita, para quem lê o log não ficar sem saber o que fazer (D124).
    expect(y).toContain("personal-access-tokens");
    expect(y).toContain("Contents: Read-only");
    expect(y).toContain("VIZINHOS_TOKEN");
    // E nada de engolir falha.
    expect(y).not.toContain("continue-on-error");
    expect(y).not.toContain("|| true");
  });

  test("o CI diz, por escrito, que o trabalho sem clones NÃO é o verde", () => {
    // Nome que engana é pior que CI nenhum: alguém leria o check verde como "o
    // repositório está verde", que é a mentira que o D110 custou duas semanas.
    const y = readFileSync(CI, "utf8");
    expect(y).toContain("NÃO é o verde");
  });
});
