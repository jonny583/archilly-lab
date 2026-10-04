#!/usr/bin/env bun
/**
 * LAB-20 — a página de comparação, para quem não programa. (02/10/2026)
 *
 * ```sh
 * bun ferramentas/lab20.ts
 * ```
 *
 * # O problema que ela resolve
 *
 * A esteira só falava por linha de comando. Tudo o que o laboratório mediu até
 * aqui — cinco glebas, quatro motores, dez prompts — só aparecia para quem
 * abrisse um terminal e rodasse um `bun`. O Jonny é arquiteto e urbanista, não
 * programador, e **o que ele não consegue abrir, para ele não existe.**
 *
 * # Por que a página é MARKDOWN, e não HTML
 *
 * Porque o GitHub **renderiza Markdown no navegador** e mostra **HTML como
 * código-fonte**. Uma página `.html` no repositório daria ao Jonny uma tela de
 * `<table>` e `<td>` — o contrário de "olhar sem abrir terminal". Markdown é o
 * meio que ele **já usa**: `PENDENCIAS_JONNY.md` é lido assim, por link.
 *
 * Servir HTML de verdade exigiria **ligar o GitHub Pages**, que é configuração
 * de repositório e não está ligada. Isso está **proposto ao chat** na
 * `FILA.md`, não feito por minha conta.
 *
 * # Por que ela é GERADA, e não escrita à mão
 *
 * Tabela copiada à mão envelhece em silêncio: a medição muda, o texto fica. Há
 * teste (`tests/pagina.test.ts`) que regera a página e **reprova se o arquivo
 * do repositório estiver diferente** — então ou ela está em dia, ou a esteira
 * fica vermelha.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const ENTRADA = join(RAIZ, "docs", "provas", "LAB-19", "tabela.json");
const PAGINA = join(RAIZ, "docs", "COMPARACAO_DOS_MOTORES.md");

/** Os nomes das glebas, como uma pessoa os diria. */
const NOME_DA_GLEBA: Record<string, string> = {
  completo: "Terreno de teste completo — com áreas de preservação",
  "sintetico-50ha-ondulado": "Terreno sintético ondulado",
  "sintetico-10ha-plano": "Terreno sintético plano",
  "ensaio-47ha": "Gleba de ensaio do Archilly Generate",
  "geo-antonina": "Antonina (PR) — terreno real, levantado pelo Archilly Geo",
};

/**
 * Os nomes dos motores, como uma pessoa os diria.
 *
 * "Testfit" é nome interno (CLAUDE.md §5): aqui ele é **Laboratório de
 * Parcelamento**, e esta página é texto para o Jonny.
 */
const NOME_DO_MOTOR: Record<string, string> = {
  "generate-ortogonal": "Archilly Generate — traçado ortogonal",
  "generate-espinha": "Archilly Generate — traçado espinha de peixe",
  parcelamento: "Laboratório de Parcelamento",
  symbios: "Symbios (motor de fora) + divisão de lotes do laboratório",
};

const ORDEM = ["generate-ortogonal", "generate-espinha", "parcelamento", "symbios"] as const;

interface Forma {
  ok: number;
  aConferir: number;
  ruim: number;
  pctAConferir: number | null;
  pctRuim: number | null;
  utilMediana: number | null;
  utilPior: number | null;
  porClasse: Record<string, number>;
  comLadoCurvo: number;
}
interface Rampa {
  declaradoPeloMotor_pct: number | null;
  medida: boolean;
  porQueNaoMedida: string | null;
  mediaPonderada_pct: number | null;
  pior_pct: number | null;
  metrosAcimaDe: Record<string, number> | null;
  cruzamentos: number | null;
  cruzamentosAcimaDe: Record<string, number> | null;
}
interface Acesso {
  posicoes: number;
  posicoesMedidas: number;
  lotes: { minimo: number | null; maximo: number | null; mediana: number | null; amplitudePct: number | null };
  areaVendavel_m2: { minimo: number | null; maximo: number | null; amplitudePct: number | null };
  acessoDeclarado: { lotes: number | null; areaVendavel_m2: number | null } | null;
}
interface Terreno {
  medido: boolean;
  via: {
    comprimentoAcimaDoLimite_m: number;
    pctDoComprimento: number;
    areaAcimaDoLimite_m2: number;
    pctDaArea: number;
    pior: { id: string; valor_pct: number; onde: { x: number; y: number } } | null;
  } | null;
  lote: {
    areaAcimaDoLimite_m2: number;
    pctDaArea: number;
    lotesComParteAcima: number;
    reprovaPelaLei: boolean;
    pior: { id: string; valor_pct: number; onde: { x: number; y: number } } | null;
  } | null;
}
interface MotorNaProva {
  motor: string;
  ms: number;
  naoSoubeFazer: string[];
  recusadoPeloEsquema: string[] | null;
  lotes: number | null;
  areaVendavel_m2: number | null;
  pctPrivativa: number | null;
  violacoes: number | null;
  violacoesPorRegra: Record<string, number> | null;
  sobraSemLote_m2: number | null;
  pctDaMassaSemLote: number | null;
  forma: Forma | null;
  rampa: Rampa | null;
  terreno: Terreno | null;
  acesso: Acesso | null;
}
interface GlebaNaProva {
  gleba: string;
  areaDaGleba_m2: number;
  /**
   * O confronto do acesso, **calculado na medição** e não aqui.
   *
   * A primeira versão desta página recalculava a diferença entre motores com uma
   * referência própria, e dava números diferentes dos da ferramenta — `completo`
   * com +29 % num lugar e +70 % no outro. Duas réguas para a mesma grandeza é o
   * que o D20 proíbe, e eu o cometi numa grandeza minha (D116).
   */
  confrontoDoAcesso: {
    maiorAmplitude_pct: number;
    entreOsQuatroMotores_pct: number;
    entreOsMotoresDeLote_pct: number;
  };
  /**
   * A ORDEM dos motores é estável quando o acesso muda? (LAB-34)
   *
   * Medida na ferramenta, pela régua do `acesso.ts`. Esta página só a escreve —
   * e a escreve **debaixo de cada tabela**, que é onde a ordem aparece.
   */
  ordemDoAcesso: {
    posicoes: number;
    posicoesComparaveis: number;
    ordensDistintas: number;
    vencedores: string[];
    naoResponderam: Record<string, number>;
  };
  motores: Record<string, MotorNaProva>;
}
interface Prova {
  semente: number;
  contrato: string;
  regraDeForma: { aConferirAbaixoDe: number; ruimAbaixoDe: number };
  glebas: GlebaNaProva[];
}

const prova: Prova = JSON.parse(readFileSync(ENTRADA, "utf8"));

/**
 * O resumo da estabilidade da ordem, para a seção do acesso. (LAB-34)
 *
 * **Lido da medição, não recalculado.** A régua é a `instabilidadeDaOrdem` do
 * `acesso.ts` e ela roda na ferramenta; aqui só se contam glebas. Recalcular
 * daria a segunda régua que o D116 puniu.
 */
const ordem = {
  total: prova.glebas.length,
  mudaAOrdem: prova.glebas.filter((g) => g.ordemDoAcesso.ordensDistintas > 1).length,
  mudaOVencedor: prova.glebas.filter((g) => g.ordemDoAcesso.vencedores.length > 1).length,
  estaveis: prova.glebas
    .filter((g) => g.ordemDoAcesso.ordensDistintas === 1 && g.ordemDoAcesso.posicoesComparaveis === 6)
    .map((g) => NOME_DA_GLEBA[g.gleba] ?? g.gleba),
};

/** Número em português: vírgula decimal e ponto de milhar. */
function br(v: number, casas = 0): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}
const ha = (m2: number | null, casas = 2) => (m2 == null ? "—" : `${br(m2 / 1e4, casas)} ha`);
const pct = (v: number | null, casas = 1) => (v == null ? "—" : `${br(v, casas)} %`);

/**
 * O que o Jonny vê nas duas colunas da rampa: a média e o pico, separados.
 *
 * **Separados é o ponto.** O chat pediu assim, e a razão está medida: a média
 * de uma rua dilui o trecho que inviabiliza a obra, e foi por isso que o pico
 * precisou entrar no contrato.
 */
function colunaDaRampa(r: Rampa | null): { media: string; pico: string } {
  if (!r || !r.medida) return { media: "—", pico: "—" };
  const m = r.mediaPonderada_pct;
  const p = r.pior_pct;
  const metros = r.metrosAcimaDe?.["15"] ?? 0;
  return {
    media: m == null ? "—" : `${br(m, 1)} %`,
    pico:
      p == null
        ? "—"
        : `**${br(p, 1)} %**` + (metros > 0 ? ` · ${br(metros)} m acima de 15 %` : ""),
  };
}

/**
 * O caso medido em que a média e o pico mais discordam.
 *
 * **Escolhido pela medição, não por mim.** Escrever os dois números à mão aqui
 * seria o defeito que a D82 combate, e pior: o exemplo é o que o leitor
 * acredita. Então ele sai do `tabela.json`, com o nome do terreno e do motor.
 */
function exemploDaRampa(): string[] {
  let pior: { rotulo: string; media: number; pico: number } | null = null;
  for (const g of prova.glebas) {
    for (const id of ORDEM) {
      const r = g.motores[id]?.rampa;
      if (!r?.medida || r.mediaPonderada_pct == null || r.pior_pct == null) continue;
      if (r.mediaPonderada_pct <= 0) continue;
      if (!pior || r.pior_pct / r.mediaPonderada_pct > pior.pico / pior.media) {
        pior = {
          rotulo: `${NOME_DO_MOTOR[id] ?? id}, em ${NOME_DA_GLEBA[g.gleba] ?? g.gleba}`,
          media: r.mediaPonderada_pct,
          pico: r.pior_pct,
        };
      }
    }
  }
  if (!pior) return ["Nenhum terreno medido tem relevo para comparar as duas."];
  const fator = pior.pico / pior.media;
  return [
    `O caso em que as duas mais discordam, entre tudo o que foi medido: **${pior.rotulo}**.`,
    `A média das ruas dele dá **${br(pior.media, 1)} %** — rua tranquila. O **pior`,
    `trecho** dessas mesmas ruas dá **${br(pior.pico, 1)} %**, ou seja **${br(fator, 1)} vezes**`,
    "mais. **O mesmo projeto, e dois números que contam histórias opostas.**",
  ];
}

/** O que o Jonny vê na coluna da forma. */
/**
 * O que o Jonny vê na coluna do acesso.
 *
 * A faixa de lotes entre o melhor e o pior ponto de entrada, e o quanto isso é.
 * **Não** o número do acesso declarado — esse já está na coluna "lotes", e repeti-lo
 * aqui faria a coluna parecer uma segunda contagem em vez de uma variação.
 */
function colunaDoAcesso(a: Acesso | null): string {
  if (!a || a.lotes.minimo == null || a.lotes.maximo == null) return "—";
  if (a.lotes.amplitudePct === 0) return "**não muda nada**";
  return `${br(a.lotes.minimo)} a ${br(a.lotes.maximo)} lotes · **+${br(a.lotes.amplitudePct ?? 0, 0)} %**`;
}

/**
 * Os números da seção do acesso, computados da prova — nunca escritos à mão.
 *
 * O D82 nasceu de prosa com número cravado envelhecendo na página, e o LAB-21
 * reincidiu nisso em prosa que falava com pessoa. Aqui a frase se monta do JSON.
 */
function exemploDoAcesso(): {
  linhas: string[];
  glebasEmQueOAcessoPesaMais: number;
  totalDeGlebas: number;
  maiorAmplitude: number;
  ondeFoiAMaior: string;
  quemVariouMais: string;
} {
  const linhas: string[] = [];
  let pesaMais = 0;
  let maiorDeTodas = 0;
  let ondeFoiAMaior = "";
  let quemVariouMais = "";

  for (const g of prova.glebas) {
    const nome = NOME_DA_GLEBA[g.gleba] ?? g.gleba;
    // Os dois números vêm da PROVA. A comparação é com os motores que entregam
    // lote por conta própria — o Symbios entrega quadra, e a distância entre ele e
    // um motor de lote é a distância entre duas etapas, não entre duas opções.
    const maiorAmplitude = g.confrontoDoAcesso.maiorAmplitude_pct;
    const entreMotores = g.confrontoDoAcesso.entreOsMotoresDeLote_pct;
    let quemVaria = "";
    for (const id of ORDEM) {
      const m = g.motores[id];
      if (!m?.acesso) continue;
      if ((m.acesso.lotes.amplitudePct ?? 0) === maiorAmplitude && !quemVaria) {
        quemVaria = NOME_DO_MOTOR[id] ?? id;
      }
    }
    if (maiorAmplitude > entreMotores) pesaMais++;
    if (maiorAmplitude > maiorDeTodas) {
      maiorDeTodas = maiorAmplitude;
      ondeFoiAMaior = nome;
      quemVariouMais = quemVaria;
    }
    linhas.push(
      `| ${nome} | **+${br(maiorAmplitude, 0)} %** (${quemVaria}) | +${br(entreMotores, 0)} % | ` +
        `${maiorAmplitude > entreMotores ? "**a entrada**" : "o programa"} |`,
    );
  }
  return {
    linhas,
    glebasEmQueOAcessoPesaMais: pesaMais,
    totalDeGlebas: prova.glebas.length,
    maiorAmplitude: maiorDeTodas,
    ondeFoiAMaior,
    quemVariouMais,
  };
}

function colunaDaForma(f: Forma | null): string {
  if (!f) return "—";
  if (f.aConferir === 0 && f.ruim === 0) return "**todos ok**";
  const partes: string[] = [];
  if (f.aConferir > 0) partes.push(`${br(f.aConferir)} a conferir (${pct(f.pctAConferir)})`);
  if (f.ruim > 0) partes.push(`**${br(f.ruim)} ruins (${pct(f.pctRuim)})**`);
  return partes.join(" · ");
}

/**
 * Os casos em que as duas réguas discordam mais — **achados na medição, não
 * escolhidos por mim**.
 *
 * Esta tabela existe para provar que forma de lote e veredito do Validator são
 * coisas diferentes. Escrever os números à mão aqui seria o defeito que a D82
 * combate na página inteira: a medição muda, o exemplo fica, e o exemplo é
 * justamente o que o leitor vai acreditar. Então eles saem do `tabela.json`.
 *
 * O critério é o desencontro: muitos apontamentos com pouca forma ruim, ou o
 * contrário. Dois de cada ponta.
 */
function desencontros(): string[] {
  const casos: { rotulo: string; viol: number; ruim: number }[] = [];
  for (const g of prova.glebas) {
    for (const id of ORDEM) {
      const m = g.motores[id];
      if (!m || m.recusadoPeloEsquema || m.violacoes == null || !m.forma) continue;
      casos.push({
        rotulo: `${NOME_DO_MOTOR[id] ?? id} · ${NOME_DA_GLEBA[g.gleba] ?? g.gleba}`,
        viol: m.violacoes,
        ruim: m.forma.ruim,
      });
    }
  }
  // Muito apontamento e forma limpa: a régua do Validator morde, a da forma não.
  const reprovaSemFormaRuim = casos
    .filter((c) => c.viol > 0 && c.ruim === 0)
    .sort((a, b) => b.viol - a.viol)
    .slice(0, 2);
  // Forma ruim e Validator quieto: o contrário exato.
  const formaRuimSemReprova = casos
    .filter((c) => c.ruim > 0)
    .sort((a, b) => b.ruim - a.ruim || a.viol - b.viol)
    .slice(0, 2);

  const linha = (c: { rotulo: string; viol: number; ruim: number }) =>
    `| ${c.rotulo} | ${c.viol === 0 ? "**nenhum**" : `**${br(c.viol)}**`} | ` +
    `${c.ruim === 0 ? "**nenhum**" : `**${br(c.ruim)}**`} |`;

  return [...reprovaSemFormaRuim, ...formaRuimSemReprova].map(linha);
}

const acesso = exemploDoAcesso();

const L: string[] = [];
const push = (...linhas: string[]) => L.push(...linhas);

push(
  "# Comparação dos motores de loteamento",
  "",
  "**Esta página é gerada por medição.** Ela não é escrita à mão, e não pode ficar",
  "desatualizada em silêncio: há teste que a regera e reprova se o arquivo estiver",
  "diferente do que a medição diz hoje.",
  "",
  "**Quatro motores, cinco terrenos, a mesma régua para todos.** A régua é o",
  "**conferente do Archilly Generate** — o *Validator*, no nome que ele tem no",
  "código — mais o contador de lotes dele. O laboratório **não tem régua",
  "própria**, de propósito, para não haver como um motor de fora passar mais",
  "fácil por ser de fora.",
  "",
  "---",
  "",
  "## Como ler os quadros",
  "",
  "| coluna | o que ela diz |",
  "|---|---|",
  "| **Lotes** | quantos lotes o motor desenhou **naquele ponto de entrada da rua**. É a coluna que convida a ordenar os programas — e debaixo de cada quadro está dito se a ordem aguenta a entrada mudar. Em terreno nenhum ela é propriedade só do programa |",
  "| **Área vendável** | a soma dos lotes, em hectares |",
  "| **Virou lote** | quanto do terreno virou lote, em porcentagem. O resto é rua, praça, área de preservação e sobra |",
  "| **Apontado pelo conferente** | quantas regras o desenho quebrou, na conta do conferente do Archilly Generate — o *Validator*. **Zero é o alvo, e é ele que diz se a proposta passa** |",
  "| **Terra sem lote** | terra dentro da área loteável que não virou lote nem rua. É prejuízo |",
  "| **Forma dos lotes** | ver a seção *A forma dos lotes*, logo abaixo |",
  "| **Rampa média** | a inclinação média das ruas, pesada pelo comprimento de cada trecho |",
  "| **Rampa no pior trecho** | a inclinação do **pior** pedaço de rua do projeto, e quantos metros de rua passam de 15 % |",
  "| **Se a entrada da rua mudar** | ver a seção *A entrada da rua*, logo abaixo. É a coluna de maior efeito da tabela |",
  "| **Tempo** | quanto o motor levou para desenhar |",
  "",
  "## A entrada da rua: a mesma coisa, desenhada duas vezes, dá até o dobro",
  "",
  "**Cada terreno foi desenhado seis vezes por programa, mudando só UMA coisa: por",
  "onde a rua entra.** Mesmo terreno, mesmo programa, mesmas regras, mesma conta de",
  "lotes feita pelo mesmo conferente. E o resultado muda assim:",
  "",
  `**${br(acesso.maiorAmplitude, 0)} % mais lotes.** O maior caso medido:`,
  "",
  `- **terreno:** ${acesso.ondeFoiAMaior}`,
  `- **programa:** ${acesso.quemVariouMais}`,
  `- **o que mudou:** só o ponto por onde a rua entra`,
  "",
  "Esse número não depende de opinião nenhuma e não compara programas: é o **mesmo**",
  "programa, duas vezes.",
  "",
  "### E a entrada pesa mais que a escolha do programa?",
  "",
  "**Às vezes — e é menos do que parece.** Posto lado a lado com o quanto os três",
  "programas que entregam lote diferem entre si:",
  "",
  "| terreno | o quanto muda só pela entrada | o quanto muda trocando de programa | o que pesa mais |",
  "|---|---|---|---|",
  ...acesso.linhas,
  "",
  `**Em ${acesso.glebasEmQueOAcessoPesaMais} dos ${acesso.totalDeGlebas} terrenos a entrada pesa mais; nos outros, o`,
  "programa.** As duas coisas importam, e nenhuma das duas dispensa a outra — era o",
  "que valia medir, e a resposta não foi a mais vistosa.",
  "",
  // ── A pergunta de quem COMPARA, e ela é outra (LAB-34) ────────────────────
  //
  // "Varia 108 %" e "a ordem muda" são afirmações diferentes: um programa pode
  // variar muito e continuar sempre na frente. Quem lê a coluna `lotes` dos
  // quadros ordena os programas, e é essa pergunta que precisa de resposta —
  // colada a cada quadro, que é onde a ordem aparece.
  `**E a pergunta de quem compara é outra: a ORDEM dos programas aguenta a entrada`,
  `mudar?** Medido, ela muda em **${ordem.mudaAOrdem} dos ${ordem.total} terrenos**, e em`,
  `**${ordem.mudaOVencedor}** deles muda até **quem fica em primeiro**. Em ${ordem.estaveis.length === 0 ? "nenhum" : `**${ordem.estaveis.join("**, **")}**`}`,
  `a ordem aguentou os seis pontos sem mudar nenhuma vez.`,
  "",
  "**Por isso o aviso não mora só aqui:** debaixo de cada quadro de terreno está",
  "escrito se a ordem daquele quadro aguenta a entrada mudar — porque é ali que a",
  "ordem aparece, e ninguém devia precisar rolar até esta seção para descobrir.",
  "",
  "### O que isso significa para quem compra terreno",
  "",
  "**Por onde a entrada pode passar é parte do preço do terreno, e se descobre antes",
  "de comprar, olhando a rua que já existe do lado de fora.** Dois terrenos do mesmo",
  "tamanho e do mesmo preço não valem o mesmo se um só admite entrada pelo canto",
  "ruim: a diferença cai direto no número de lotes que se vende.",
  "",
  "**Três cuidados, para o número não ser lido além do que ele é:**",
  "",
  "1. **o melhor ponto pode não existir na vida real.** O laboratório põe a entrada",
  "   em seis pontos da volta do terreno **sem perguntar se há rua ali fora**. Se o",
  "   melhor ponto cai no fundo, onde não passa ninguém, ele não serve — e a coluna",
  "   continua útil, porque mostra quanto se perde por não poder usá-lo;",
  "2. **a variação medida é o mínimo, não o máximo.** Seis pontos não cobrem a volta",
  "   inteira do terreno; o melhor e o pior ponto de verdade podem estar entre dois",
  "   dos seis. A diferença real é **igual ou maior** que a publicada;",
  "3. **o laboratório não escolhe a entrada.** Onde ela pode ficar depende da rua de",
  "   fora, da faixa que a prefeitura exige e da licença — é decisão de projeto, e",
  "   é sua. O laboratório só mede quanto ela custa.",
  "",
  "## A rampa das ruas: a média esconde o pior trecho",
  "",
  "**Olhe sempre as duas colunas juntas, e a segunda primeiro.** A rampa média de",
  "um projeto pode ser mansa e confortável, e ainda assim haver um pedaço de rua",
  "que não se constrói sem corte e aterro — porque a média dilui o trecho ruim no",
  "meio de todos os outros.",
  "",
  ...exemploDaRampa(),
  "",
  "**Qual é a inclinação máxima que você aceita numa rua?** Isso é decisão sua, e",
  "ainda não está respondida — está em [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md).",
  "A lei que a família tem escrita (Lei 6.766/1979) fala de **30 % de inclinação",
  "do TERRENO** para poder lotear, que é **outra coisa**: uma rua pode ser cortada",
  "numa encosta forte e ficar suave, e uma encosta suave pode receber uma rua",
  "mal resolvida. Por isso a tabela mostra os números e não dá veredito.",
  "",
  "## A forma dos lotes",
  "",
  "A régua é simples: desenha-se **o menor retângulo que cabe em volta do lote**,",
  "em qualquer inclinação, e vê-se **quanto desse retângulo o lote aproveita**.",
  "Um lote retangular aproveita 100 %. Um triângulo, 50 %.",
  "",
  `- aproveita **${br(100 * prova.regraDeForma.aConferirAbaixoDe)} % ou mais** → está **ok**;`,
  `- aproveita **menos de ${br(100 * prova.regraDeForma.aConferirAbaixoDe)} %** → **a conferir**;`,
  `- aproveita **menos de ${br(100 * prova.regraDeForma.ruimAbaixoDe)} %** → **ruim**.`,
  "",
  "**Esta linha foi decidida no chat, e está esperando o seu OK** — é o item que",
  "sobrou em [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md). Até você confirmar, ela",
  "vale para o trabalho não parar; se o número que você tem na cabeça for outro, é",
  "só dizer qual.",
  "",
  "### Esta coluna INFORMA; quem aprova é o Validator",
  "",
  "**A coluna da forma não aprova nem reprova nada.** Quem diz se uma proposta",
  "passa é o **conferente do Archilly Generate — o Validator** —, e **forma de",
  "lote não é uma regra dele**. São duas réguas diferentes, e os quadros abaixo",
  "provam que elas não andam juntas:",
  "",
  "| caso medido | apontado pelo Validator | lotes de forma ruim |",
  "|---|---:|---:|",
  ...desencontros(),
  "",
  "Ou seja: **um motor pode ter todos os lotes bem formados e ainda assim ser",
  "reprovado pelo conferente**, e pode passar no conferente com lotes de forma",
  "ruim. Somar as duas colunas numa nota só esconderia justamente isso.",
  "",
  "---",
  "",
);

/**
 * OS AVISOS QUE EXPLICAM UM NÚMERO DO QUADRO. (LAB-37)
 *
 * **O princípio é o do LAB-34, aplicado a outro número:** *"ponha o aviso onde o
 * número aparece, não escondido"*. A seção *"o que cada motor NÃO soube fazer"*, no
 * fim da página, agrupa as queixas e **elide os números** — então um 33 na coluna
 * `lotes` ficava sem explicação justamente onde ele é lido.
 *
 * Nasceu de um caso concreto: entregue a testada de frente em Antonina, o ranking do
 * próprio Laboratório de Parcelamento passou a preferir um partido de **33 lotes**
 * sobre um de **1 228**. O número é fiel, e sem a razão ele engana.
 *
 * **Só sobem as queixas que explicam um número do quadro** — não a lista inteira,
 * que é longa e tem o seu lugar no fim da página.
 */
const EXPLICAM_UM_NUMERO = ["o RANKING DELE escolheu", "a testada de frente entrou como"];

function avisosDoQuadro(g: GlebaNaProva): string[] {
  const linhas: string[] = [];
  for (const id of ORDEM) {
    for (const q of g.motores[id]?.naoSoubeFazer ?? []) {
      if (!EXPLICAM_UM_NUMERO.some((m) => q.startsWith(m))) continue;
      linhas.push(`> **${NOME_DO_MOTOR[id] ?? id}:** ${q}.`);
    }
  }
  return linhas;
}

/**
 * O AVISO DEBAIXO DA TABELA — onde a ordem aparece. (LAB-34)
 *
 * O número de lotes acima é de **um** ponto de acesso. Quem lê a coluna ordena os
 * motores com os olhos, e o aviso de que esse número varia morava **páginas
 * abaixo**, na seção do acesso. Agora ele nasce aqui, colado na tabela, e com o
 * que de fato foi medido nesta gleba: não *"varia tanto por cento"*, mas **a ordem
 * muda ou não muda**, que é a pergunta de quem compara.
 */
function avisoDaOrdem(g: GlebaNaProva): string {
  const o = g.ordemDoAcesso;
  const ausentes = Object.entries(o.naoResponderam);
  const nota = ausentes.length
    ? " Nos pontos restantes, " +
      ausentes
        .map(([id, n]) => `**${NOME_DO_MOTOR[id] ?? id}** não entregou desenho válido em ${n} ponto${n > 1 ? "s" : ""}`)
        .join("; ") +
      " — o que também é resposta: naquela entrada, aquele programa não desenha nada aceitável."
    : "";

  if (o.posicoesComparaveis < 2) {
    return (
      `> ⚠️ **Esta tabela é de UM ponto de entrada da rua, e aqui não dá para dizer se a ordem ` +
      `aguenta outro.** Dos ${o.posicoes} pontos testados, só ${o.posicoesComparaveis} teve os quatro ` +
      `programas entregando desenho válido ao mesmo tempo.${nota} **Não ordene os programas por esta ` +
      `tabela sem ver a seção _A entrada da rua_.**`
    );
  }

  if (o.ordensDistintas === 1) {
    return (
      `> ✅ **A ordem desta tabela aguenta a mudança de entrada.** Movendo o ponto por onde a rua ` +
      `entra pelos ${o.posicoesComparaveis} pontos comparáveis, a ordem dos programas **não mudou ` +
      `nenhuma vez** — os números mudam, a ordem não.${nota}`
    );
  }

  const vencedores = o.vencedores.map((id) => NOME_DO_MOTOR[id] ?? id);
  const oVencedorMuda = vencedores.length > 1;
  return (
    `> ⚠️ **Esta tabela é de UM ponto de entrada da rua, e a ordem dela NÃO aguenta outro.** ` +
    `Movendo só o ponto por onde a rua entra, nos ${o.posicoesComparaveis} pontos comparáveis ` +
    `apareceram **${o.ordensDistintas} ordens diferentes**` +
    (oVencedorMuda
      ? `, e **o primeiro lugar muda de programa**: ${vencedores.join(" e ")} ganham cada um em pelo ` +
        `menos um ponto.`
      : `, embora o primeiro lugar seja sempre o mesmo (${vencedores[0]}).`) +
    `${nota} **Ordenar os programas por esta tabela é ordenar por onde a rua entra.**`
  );
}

for (const g of prova.glebas) {
  const nome = NOME_DA_GLEBA[g.gleba] ?? g.gleba;
  push(
    `## ${nome}`,
    "",
    `**${br(g.areaDaGleba_m2 / 1e4, 1)} hectares** · identificação técnica do terreno: \`${g.gleba}\``,
    "",
    "| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | rampa média | rampa no pior trecho | se a entrada da rua mudar | tempo |",
    "|---|---:|---:|---:|---:|---:|---|---:|---|---|---:|",
  );
  for (const id of ORDEM) {
    const m = g.motores[id];
    if (!m) continue;
    if (m.recusadoPeloEsquema) {
      push(
        `| ${NOME_DO_MOTOR[id] ?? id} | — | — | — | **não entregou desenho válido** | — | — | — | — | — | ${br(m.ms / 1000, 1)} s |`,
      );
      continue;
    }
    const rampa = colunaDaRampa(m.rampa);
    push(
      `| ${NOME_DO_MOTOR[id] ?? id} | ${br(m.lotes ?? 0)} | ${ha(m.areaVendavel_m2)} | ` +
        `${pct(m.pctPrivativa)} | ${m.violacoes === 0 ? "**nenhum**" : br(m.violacoes ?? 0)} | ` +
        `${ha(m.sobraSemLote_m2)} · ${pct(m.pctDaMassaSemLote)} | ${colunaDaForma(m.forma)} | ` +
        `${rampa.media} | ${rampa.pico} | ${colunaDoAcesso(m.acesso)} | ${br(m.ms / 1000, 1)} s |`,
    );
  }
  push("", avisoDaOrdem(g), "");
  for (const l of avisosDoQuadro(g)) push(l, "");
}

// ── O bloco de terreno: rua avisa, lote reprova ───────────────────────────
push(
  "---",
  "",
  "## Terreno em declive: o que vai dar terraplenagem",
  "",
  "**Para que este quadro serve:** **comparar planos** e **estimar",
  "terraplenagem**. Os metros e metros quadrados abaixo são o que vira volume de",
  "corte e aterro no orçamento.",
  "",
  "**Os dois limites não têm a mesma força, e você mesmo separou as duas:**",
  "",
  "| o quê | limite | o que acontece |",
  "|---|---|---|",
  "| **Lote** | **30 %** de inclinação do terreno | **reprova** — é a Lei 6.766/1979 |",
  "| **Rua** | **15 %** de inclinação | **só avisa** — o trecho se resolve com terraplenagem ou mudando o traçado, e isso é decisão de projeto, com custo |",
  "",
  "**Por isso a coluna da rua não diz \"passa\" nem \"não passa\".** Ela diz",
  "*quanto*, para quem for pôr preço.",
  "",
);
for (const g of prova.glebas) {
  const comDado = ORDEM.filter((id) => g.motores[id]?.terreno?.medido);
  if (comDado.length === 0) continue;
  push(
    `### ${NOME_DA_GLEBA[g.gleba] ?? g.gleba}`,
    "",
    "| motor | rua acima de 15 % | lote acima de 30 % | pior trecho de rua | pior lote |",
    "|---|---|---|---|---|",
  );
  for (const id of comDado) {
    const t = g.motores[id]!.terreno!;
    const v = t.via;
    const lo = t.lote;
    const rua = v
      ? `${br(v.comprimentoAcimaDoLimite_m)} m · ${br(v.areaAcimaDoLimite_m2)} m² · **${br(v.pctDoComprimento, 1)} %** do total`
      : "—";
    const lote = lo
      ? lo.lotesComParteAcima === 0
        ? "**nenhum**"
        : `${br(lo.areaAcimaDoLimite_m2)} m² · ${br(lo.pctDaArea, 2)} % · ${br(lo.lotesComParteAcima)} lotes · **REPROVA**`
      : "—";
    const piorV = v?.pior ? `${br(v.pior.valor_pct, 1)} % em \`${v.pior.id}\`` : "—";
    const piorL = lo?.pior ? `${br(lo.pior.valor_pct, 1)} % em \`${lo.pior.id}\`` : "—";
    push(`| ${NOME_DO_MOTOR[id] ?? id} | ${rua} | ${lote} | ${piorV} | ${piorL} |`);
  }
  push("");
}
push(
  "**O \"pior trecho\" e o \"pior lote\" vêm com o nome da peça**, para você achar",
  "no desenho. As coordenadas exatas estão em",
  "[`provas/LAB-24/terreno.json`](provas/LAB-24/terreno.json).",
  "",
  "**O que este quadro NÃO faz:** não calcula volume de corte e aterro. Isso pede",
  "o perfil da rua já projetado, que nenhum motor da família entrega hoje. O que",
  "sai aqui é **a área e o comprimento sujeitos a terraplenagem** — a entrada da",
  "conta, não o resultado dela.",
  "",
);

// ── O que cada motor não soube fazer ──────────────────────────────────────
push(
  "---",
  "",
  "## O que cada motor NÃO soube fazer",
  "",
  "Esta seção existe para os quadros acima não mentirem por omissão. **Dois",
  "motores que receberam o mesmo terreno podem não ter feito a mesma prova** — se",
  "um lê o relevo e o outro não, comparar os dois sem dizer isso é injusto com o",
  "que leu.",
  "",
  "**As frases são do próprio motor, não minhas.** Cada um declara o que deixou de",
  "fazer, nas palavras dele — por isso algumas são técnicas. Onde a mesma queixa",
  "apareceu com números diferentes em cada terreno, os números saíram e entrou",
  "**em quantos dos cinco terrenos** ela apareceu; os números exatos estão nos",
  `relatórios técnicos. O total de terrenos é ${prova.glebas.length}.`,
  "",
);
/**
 * Junta queixas que são a mesma coisa com números diferentes.
 *
 * Sem isto a seção virava uma lista de dez linhas quase iguais — "1 de 20
 * variantes", "13 de 20 variantes", "2 de 20 variantes" — e uma lista que o
 * leitor desiste de ler não informa nada. Agrupar é só agrupar: a frase
 * continua sendo a do motor, com os números trocados por reticências.
 */
function agruparQueixas(queixas: string[][]): { frase: string; terrenos: number }[] {
  // O número que vem depois de letra ou hífen fica: é identificador, não
  // medida. Sem esta ressalva, `D51` virava `D…` e `LAB-08` virava `LAB-…`, e
  // perder o código é perder o único ponteiro que a frase dá para o relatório.
  const NUMERO_DE_MEDIDA = /(?<![A-Za-z\d-])\d+([.,]\d+)?/g;
  const porChave = new Map<string, { frase: string; terrenos: Set<number> }>();
  for (const [i, lista] of queixas.entries()) {
    for (const q of lista) {
      const chave = q.replace(NUMERO_DE_MEDIDA, "#");
      const frase = q.replace(NUMERO_DE_MEDIDA, "…");
      const achado = porChave.get(chave);
      if (achado) achado.terrenos.add(i);
      else porChave.set(chave, { frase: frase === q ? q : frase, terrenos: new Set([i]) });
    }
  }
  return [...porChave.values()]
    .map((v) => ({ frase: v.frase, terrenos: v.terrenos.size }))
    .sort((a, b) => b.terrenos - a.terrenos || a.frase.localeCompare(b.frase, "pt-BR"));
}

for (const id of ORDEM) {
  const queixas = prova.glebas.map((g) => g.motores[id]?.naoSoubeFazer ?? []);
  const agrupadas = agruparQueixas(queixas);
  push(`**${NOME_DO_MOTOR[id] ?? id}**`, "");
  if (agrupadas.length === 0) push("- declarou ter atendido tudo o que recebeu.", "");
  else {
    for (const a of agrupadas) {
      const onde =
        a.terrenos === prova.glebas.length
          ? "em todos os terrenos"
          : `em ${a.terrenos} de ${prova.glebas.length} terrenos`;
      push(`- ${a.frase} — *${onde}*`);
    }
    push("");
  }
}

// ── O que esta página não diz ─────────────────────────────────────────────
push(
  "---",
  "",
  "## O que esta página NÃO diz",
  "",
  "**Ela não diz qual motor é o melhor.** E não é modéstia: *melhor* depende do",
  "que se quer do terreno. O motor que faz mais lotes é o que deixa mais terra",
  "sem lote; o que deixa menos sobra é o que o conferente mais aponta. Quem",
  "escolhe é você.",
  "",
  "**Ela não é uma proposta de projeto.** São desenhos de máquina, feitos com os",
  "mesmos parâmetros nos cinco terrenos para que a comparação fosse honesta —",
  "não para que algum deles fosse um bom partido urbanístico.",
  "",
  "## De onde vêm os números",
  "",
  `- **semente:** \`${prova.semente}\` — a mesma em todos, e provada: rodar duas`,
  "  vezes dá o mesmo desenho, bit por bit;",
  `- **versão do contrato de motor:** \`${prova.contrato}\`;`,
  "- **números crus:** [`provas/LAB-19/tabela.json`](provas/LAB-19/tabela.json);",
  "- **como refazer:** `bun ferramentas/lab19.ts` e depois `bun ferramentas/lab20.ts`,",
  "  dentro de `external-engines/esteira/`;",
  "- **os relatórios técnicos**, prompt por prompt: [`INDEX.md`](INDEX.md).",
  "",
);

writeFileSync(PAGINA, `${L.join("\n")}`, "utf8");
console.log(`docs/COMPARACAO_DOS_MOTORES.md · ${L.length} linhas`);
