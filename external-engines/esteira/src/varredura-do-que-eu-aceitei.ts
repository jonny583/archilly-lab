/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O QUE EU ACEITEI E NUNCA RECONFERI. (LAB-63)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O chat somou quatro prompts num só, e os três achados que ele trouxe são o **mesmo achado
 * visto de três lados**:
 *
 * | de quem | a frase |
 * |---|---|
 * | Pesquisa | **pedido que nomeia o artefato volta pela metade** |
 * | Render | **dívida aceita é acusação não revisada** — sete de vinte e oito nunca foram dívida |
 * | Central | **contraexemplo tratado como exceção é regra que continua errando** |
 *
 * Os três dizem: *afirmação que entrou na casa sem régua não sai mais*. Aqui ela tem **duas**
 * formas, e cada uma ganha régua própria abaixo.
 *
 * # Forma 1 · a acusação que nomeia um ENDEREÇO no repositório do vizinho
 *
 * Cada um dos seis mecanismos do LAB-58 declara `ondeNoMotor` — arquivo e nome no clone do
 * `motor-testfit`. **Essas são acusações contra o motor de um vizinho, e elas já saíram:** no
 * relatório, no recado e na lista que o chat leva. **Nada no verde conferia o endereço.**
 *
 * Medido no LAB-63: de **seis** endereços, **dois** não resolvem para onde a coisa que eles
 * nomeiam é **definida** — o `apararRedeViaria` mora em `aparo.ts` e o `aplicarCulDeSac` em
 * `formatos.ts`, e o endereço dizia `motor.ts` nos dois, que é onde eles são **chamados**.
 *
 * > **O endereço é exatamente o "artefato" que o LAB-62 mandou não nomear** — e quando ele é
 * > nomeado de todo jeito, tem de **resolver**. Endereço que leva a uma chamada e não à
 * > definição manda quem recebe procurar no arquivo errado: é o *pedido pela metade* da
 * > Pesquisa, do lado de quem acusa.
 *
 * # Forma 2 · a REGRA DA CASA cuja aritmética não fecha
 *
 * A `CLAUDE.md` §6 é a página que eu leio antes de toda tarefa. Ela declara **dezesseis**
 * ocorrências do ponto cego, lista **dezesseis** linhas — e então **classifica catorze**:
 * *"NOVE foram réguas minhas, duas foram a ponte e três foram caminho errado"*. Mais: **duas
 * das decisões citadas nas categorias não são linha da tabela**, e uma frase ainda diz *"três
 * das quinze vezes"* num texto que diz dezesseis em todo o resto.
 *
 * **Nenhuma dessas três coisas é erro de fato — são erros de FECHAMENTO**, e é por isso que
 * duraram: cada frase, lida sozinha, está certa. A §1-B já diz o remédio com as palavras
 * certas — *"regra que ninguém pode desmentir é slogan (D136), e esta pode"* — e essa regra
 * **não podia** ser desmentida, porque nada a somava.
 */

/** Um endereço no repositório de um vizinho, como um mecanismo o declara. */
export interface EnderecoNoVizinho {
  /** O repositório, como o texto o nomeia (`motor-testfit`). */
  repositorio: string;
  /** O caminho do arquivo, relativo à raiz do clone. */
  arquivo: string;
  /**
   * Os nomes que o endereço cita e que **têm de ser definidos** naquele arquivo.
   *
   * Só entram aqui os nomes em forma de identificador — `reservarFacesExternas`. Uma descrição
   * em português (*"a montagem das quadras"*) **não** é nome, e sai em `descricoes`: ela não se
   * confere por definição, e tratá-la como identificador faria a régua acusar ortografia (D137).
   */
  simbolos: string[];
  /** Os trechos em prosa do endereço, que a régua NÃO cobra como definição. */
  descricoes: string[];
}

/**
 * Lê **todos** os endereços de um `ondeNoMotor`, separados por `;`.
 *
 * Um mecanismo pode morar em dois arquivos — e **tem de poder dizê-lo**: era o campo com UM
 * arquivo só que me fez escrever `motor.ts · apararRedeViaria e aplicarCulDeSac` quando os dois
 * moram em `aparo.ts` e `formatos.ts`. *Campo que não cabe a verdade força a mentira curta.*
 */
export function lerEnderecos(ondeNoMotor: string): EnderecoNoVizinho[] {
  return ondeNoMotor
    .split(";")
    .map((p) => lerEndereco(p.trim()))
    .filter((e): e is EnderecoNoVizinho => e !== null);
}

/** O que o `ondeNoMotor` separa com `·`: repositório · arquivo · o resto. */
export function lerEndereco(ondeNoMotor: string): EnderecoNoVizinho | null {
  const partes = ondeNoMotor.split("·").map((p) => p.trim());
  if (partes.length < 2) return null;
  const [repositorio, arquivo, ...resto] = partes;
  const simbolos: string[] = [];
  const descricoes: string[] = [];
  /**
   * **O parêntese sai ANTES da divisão, e isto foi medido** (LAB-63): a primeira versão dividia
   * primeiro e limpava depois, então `reservarFacesExternas (lido, não tocado)` virava dois
   * pedaços — `reservarFacesExternas (lido` e `não tocado)` — e o primeiro, com parêntese
   * sobrando, deixava de parecer identificador. **QUATRO dos seis símbolos iam para `descricoes`
   * e nunca eram conferidos**, em silêncio: falso negativo, a família do D202.
   */
  const semParenteses = resto.join(" · ").replace(/\([^)]*\)/g, " ");
  for (const trecho of semParenteses.split(/,|\be\b/)) {
    const limpo = trecho.trim();
    if (limpo === "") continue;
    // Identificador: uma palavra só, em camelCase ou minúscula, sem espaço nem acento.
    if (/^[a-z][A-Za-z0-9_]*$/.test(limpo)) simbolos.push(limpo);
    else descricoes.push(limpo);
  }
  return { repositorio: repositorio!, arquivo: arquivo!, simbolos, descricoes };
}

/** Por que um endereço não resolve. `null` quando ele resolve. */
export type FalhaDeEndereco =
  | { tipo: "arquivo-ausente"; arquivo: string }
  | { tipo: "simbolo-nao-definido-aqui"; simbolo: string; arquivo: string; ondeEstaDefinido: string | null };

/**
 * Confere um endereço contra o clone: o arquivo existe, e **cada símbolo é DEFINIDO nele**.
 *
 * `lerArquivo` devolve o fonte de um caminho relativo ao clone, ou `null` se não existir;
 * `procurarDefinicao` devolve o caminho onde o símbolo é definido, varrendo o clone. Os dois
 * entram por parâmetro para a régua ser testável sem clone nenhum.
 *
 * **Definida, e não mencionada:** o símbolo tem de aparecer depois de `function`, `const`,
 * `let`, `class` ou `type` — é o D142, e aqui ele é o coração da régua, porque o endereço
 * errado era exatamente um arquivo onde o nome **aparece** (na chamada) sem estar definido.
 */
export function conferirEndereco(
  endereco: EnderecoNoVizinho,
  lerArquivo: (caminho: string) => string | null,
  procurarDefinicao: (simbolo: string) => string | null,
): FalhaDeEndereco[] {
  const fonte = lerArquivo(endereco.arquivo);
  if (fonte === null) return [{ tipo: "arquivo-ausente", arquivo: endereco.arquivo }];
  const falhas: FalhaDeEndereco[] = [];
  for (const simbolo of endereco.simbolos) {
    if (!defineSimbolo(fonte, simbolo)) {
      falhas.push({
        tipo: "simbolo-nao-definido-aqui",
        simbolo,
        arquivo: endereco.arquivo,
        ondeEstaDefinido: procurarDefinicao(simbolo),
      });
    }
  }
  return falhas;
}

/** O símbolo é DEFINIDO neste fonte — não só citado nele. */
export function defineSimbolo(fonte: string, simbolo: string): boolean {
  const nome = simbolo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b(?:function|const|let|var|class|type|interface)\\s+${nome}\\b`).test(fonte);
}

// ── A aritmética da regra da casa ──────────────────────────────────────────

/** As palavras de número que a §6 usa para contar ocorrências do ponto cego. */
export const NUMEROS_EM_PALAVRA: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  "três": 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  catorze: 14,
  quatorze: 14,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezoito: 18,
  dezenove: 19,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  "cinquënta": 50,
};

/**
 * LÊ UMA PALAVRA DE NÚMERO, inclusive COMPOSTA — `"vinte e duas"`. (LAB-77)
 *
 * **O mapa de literais parou de bastar no dia em que o registro passou de vinte.** A §6 chegou a
 * `VINTE E DUAS` e a régua devolveu `null`: ela procurava a palavra inteira numa tabela que ia
 * até `vinte`, e o `totalDeclarado` saiu nulo — *a trava do total simplesmente deixou de medir*,
 * que é o pior jeito de uma guarda falhar (o mesmo defeito que o LAB-63 pegou duas vezes nesta
 * mesma régua).
 *
 * > **Régua que conta até vinte numa lista que cresce é régua com data de validade.**
 *
 * Agora a leitura é **compositiva**: `<dezena> e <unidade>` soma as duas partes. Mapa de
 * literais para o que não compõe (até vinte), composição para o resto — e assim a próxima
 * ocorrência do ponto cego não derruba a guarda que conta as ocorrências do ponto cego.
 */
export function lerNumeroEmPalavra(palavra: string): number | null {
  const limpo = palavra.trim().toLowerCase().replace(/\s+/g, " ");
  const direto = NUMEROS_EM_PALAVRA[limpo];
  if (direto !== undefined) return direto;

  const partes = limpo.split(" e ").map((x) => x.trim());
  if (partes.length !== 2) return null;
  const dezena = NUMEROS_EM_PALAVRA[partes[0]!];
  const unidade = NUMEROS_EM_PALAVRA[partes[1]!];
  if (dezena === undefined || unidade === undefined) return null;
  // Só `vinte e duas` e irmãs: `dez e seis` não é português, e `vinte e trinta` não é número.
  if (dezena < 20 || dezena % 10 !== 0 || unidade < 1 || unidade > 9) return null;
  return dezena + unidade;
}

export interface ProblemaDeAritmetica {
  tipo:
    | "total-declarado-diferente-das-linhas"
    | "categorias-nao-somam-o-total"
    | "citada-na-categoria-sem-ser-linha"
    | "total-velho-em-outra-frase"
    | "palavra-de-numero-nao-reconhecida"
    | "particao-nao-encontrada"
    | "linha-sem-classe"
    | "linha-em-mais-de-uma-classe";
  oQue: string;
}

export interface AritmeticaDoPontoCego {
  linhasDaTabela: string[];
  /** As decisões que cada linha da tabela nomeia — `D93/D94` dá duas. */
  decisoesDasLinhas: string[];
  totalDeclarado: number | null;
  categorias: { quanto: number; oQue: string; decisoesCitadas: string[] }[];
  somaDasCategorias: number;
  problemas: ProblemaDeAritmetica[];
}

/**
 * Lê a §6 e confere se ela **fecha**: o total declarado bate com as linhas, as categorias
 * somam o total, toda decisão citada numa categoria é linha da tabela, e nenhuma outra frase
 * conta a mesma lista com outro número.
 *
 * Esta régua existe porque a §1-B diz, da própria §6, que *"regra que ninguém pode desmentir é
 * slogan (D136), e esta pode"* — e até aqui ela **não podia**.
 */
export function conferirAritmeticaDoPontoCego(secao6: string): AritmeticaDoPontoCego {
  const linhasDaTabela = secao6
    .split("\n")
    .filter((l) => /^\|\s*D\d/.test(l))
    .map((l) => l.split("|")[1]!.trim());

  const decisoesDasLinhas = linhasDaTabela.flatMap((l) => l.match(/D\d+/g) ?? []);

  const totalDeclarado = (() => {
    // `[\w\s]+?` e não `[\w]+`: a frase chegou a "se repetiu VINTE E DUAS vezes", e uma régua
    // de UMA palavra devolvia `null` — a trava do total deixava de medir em silêncio (LAB-77).
    const m = /se repetiu ([A-Za-zÇÃÉÊçãéê]+(?:\s+[A-Za-zÇÃÉÊçãéê]+)*?) vezes/.exec(secao6);
    return m ? lerNumeroEmPalavra(m[1]!) : null;
  })();

  /** Uma categoria: "NOVE foram réguas minhas…", "duas foram a ponte… (D98/D104 e D166)". */
  const categorias: AritmeticaDoPontoCego["categorias"] = [];
  /**
   * **A palavra de número não abre o negrito, e isto também foi medido** (LAB-63): a frase real
   * é `**Das DEZESSEIS, NOVE foram réguas minhas…**`, com `Das DEZESSEIS,` dentro do mesmo
   * negrito. A primeira versão exigia a palavra no começo e achou **ZERO categorias** — então a
   * trava da soma nunca disparava, e o achado de verdade (catorze de dezesseis) passava batido.
   * Segundo falso negativo da mesma régua, no mesmo prompt.
   */
  const re = /\*\*(?:[^*]*?[,:;]\s*)?([^*]+?) foram ([^*]+?)\*\*((?:\s*\([^)]*\))?)/g;
  const palavrasNaoReconhecidas: string[] = [];
  for (const m of secao6.matchAll(re)) {
    const quanto = lerNumeroEmPalavra(m[1]!);
    if (quanto === null) {
      palavrasNaoReconhecidas.push(m[1]!);
      continue;
    }
    categorias.push({
      quanto,
      oQue: m[2]!.trim(),
      decisoesCitadas: (m[3] ?? "").match(/D\d+/g) ?? [],
    });
  }

  const problemas: ProblemaDeAritmetica[] = [];
  if (totalDeclarado !== null && totalDeclarado !== linhasDaTabela.length) {
    problemas.push({
      tipo: "total-declarado-diferente-das-linhas",
      oQue: `a §6 declara ${totalDeclarado} ocorrências e a tabela tem ${linhasDaTabela.length} linhas`,
    });
  }

  /**
   * A partição vive numa **tabela declarada**, e não numa frase.
   *
   * **A primeira versão lia a frase** `**Das DEZESSEIS, NOVE foram réguas minhas…**`, e quando
   * eu reescrevi a §6 como tabela — para a classificação ficar conferível linha por linha — a
   * régua passou a achar **ZERO classes e a dizer "tudo conferido"**. *Guarda que não acha a
   * partição não está aprovando a partição: está sem medir nada.* Por isso zero classes é
   * **problema**, e não aprovação.
   *
   * A tabela é `| **SETE** | régua minha acusando a si mesma | D75, D93/D94, … |`. Outras
   * contagens da §6 (quantas foram pegas dentro do prompt, quantas são da sub-família da régua
   * de texto) **não** são partição e não entram na soma — somá-las mediria o que não é.
   */
  const daParticao: AritmeticaDoPontoCego["categorias"] = [];
  for (const linha of secao6.split("\n")) {
    const m = /^\|\s*\*\*([^*]+)\*\*\s*\|([^|]*)\|([^|]*)\|/.exec(linha);
    if (!m) continue;
    const quanto = lerNumeroEmPalavra(m[1]!);
    if (quanto === null) {
      palavrasNaoReconhecidas.push(m[1]!.trim());
      continue;
    }
    daParticao.push({
      quanto,
      oQue: m[2]!.trim(),
      decisoesCitadas: m[3]!.match(/D\d+(?:\/D\d+)?/g)?.flatMap((d) => d.split("/")) ?? [],
    });
  }
  const somaDasCategorias = daParticao.reduce((s, c) => s + c.quanto, 0);

  // A palavra desconhecida vira PROBLEMA aqui, DEPOIS da tabela: na primeira versão este
  // laço vinha antes dela, e a palavra que a tabela não reconhecia chegava tarde demais para
  // entrar na lista. Guarda que confere na ordem errada confere o vazio.
  for (const palavra of palavrasNaoReconhecidas) {
    problemas.push({
      tipo: "palavra-de-numero-nao-reconhecida",
      oQue:
        `a §6 conta uma categoria com a palavra "${palavra}", que não está em NUMEROS_EM_PALAVRA — ` +
        `então ela NÃO entrou na soma. Silêncio aqui é falso negativo, e foi assim que três ` +
        `defeitos desta régua passaram no LAB-63`,
    });
  }

  if (daParticao.length === 0) {
    problemas.push({
      tipo: "particao-nao-encontrada",
      oQue:
        "a §6 não traz a tabela da partição na forma que a régua lê — e isso NÃO é aprovação: " +
        "é a régua sem medir nada. Foi exatamente assim que ela disse 'tudo conferido' com zero " +
        "classes lidas, no LAB-63, depois de eu reescrever a seção",
    });
  }
  if (totalDeclarado !== null && daParticao.length > 0 && somaDasCategorias !== totalDeclarado) {
    problemas.push({
      tipo: "categorias-nao-somam-o-total",
      oQue:
        `as categorias da partição somam ${somaDasCategorias} (${daParticao.map((c) => c.quanto).join(" + ")}) ` +
        `e o total declarado é ${totalDeclarado} — ${totalDeclarado - somaDasCategorias} ocorrência(s) sem categoria`,
    });
  }

  /**
   * **A soma é invariante FRACA, e isto foi medido por sabotagem** (LAB-63): trocando `SETE` por
   * `NOVE` e apagando a classe de duas linhas, a soma volta a fechar em 16 e **duas linhas ficam
   * sem classe**. A ferramenta ficou calada; só uma trava pegou. Então a partição se cobra
   * **linha por linha**: cada linha da tabela em exatamente uma classe.
   */
  const classificadas = daParticao.flatMap((c) => c.decisoesCitadas);
  for (const d of decisoesDasLinhas) {
    const quantas = classificadas.filter((x) => x === d).length;
    if (quantas === 0) {
      problemas.push({
        tipo: "linha-sem-classe",
        oQue: `a linha ${d} da tabela não está em nenhuma classe da partição`,
      });
    } else if (quantas > 1) {
      problemas.push({
        tipo: "linha-em-mais-de-uma-classe",
        oQue: `a linha ${d} aparece em ${quantas} classes da partição`,
      });
    }
  }

  const linhasPorDecisao = new Set(decisoesDasLinhas);
  for (const c of daParticao) {
    for (const d of c.decisoesCitadas) {
      if (!linhasPorDecisao.has(d)) {
        problemas.push({
          tipo: "citada-na-categoria-sem-ser-linha",
          oQue: `a categoria "${c.oQue}" cita ${d}, que NÃO é linha da tabela das ${linhasDaTabela.length}`,
        });
      }
    }
  }

  if (totalDeclarado !== null) {
    for (const m of secao6.matchAll(/d[ae]s ([A-Za-zÇÃÉÊçãéê]+) (?:vezes|ocorrências)/gi)) {
      const n = NUMEROS_EM_PALAVRA[m[1]!.toLowerCase()];
      if (n !== undefined && n !== totalDeclarado) {
        problemas.push({
          tipo: "total-velho-em-outra-frase",
          oQue: `uma frase conta a mesma lista como "${m[1]}" (${n}) e o total declarado é ${totalDeclarado}`,
        });
      }
    }
  }

  return {
    linhasDaTabela,
    decisoesDasLinhas,
    totalDeclarado,
    categorias: daParticao,
    somaDasCategorias,
    problemas,
  };
}

// ── A terceira varredura: contraexemplo registrado nas DECISÕES ────────────

/**
 * As marcas de que uma frase **desmente** uma regra, e não só a menciona.
 *
 * Fechadas de propósito: marca aberta ("errei", "mudou") casaria metade do arquivo.
 */
export const MARCAS_DE_CONTRAEXEMPLO = [
  "estava falsa",
  "era falsa",
  "estava errada",
  "era falso",
  "contraexemplo",
  "deixou de ser verdade",
  "era mentira",
  "desmentida",
] as const;

export interface ParDeContraexemplo {
  /** A decisão cuja regra é desmentida. */
  aRegra: string;
  /** A decisão que a desmente. */
  oContraexemplo: string;
  marca: string;
  frase: string;
  /** A decisão antiga aponta para a nova? Sem isso, quem lê a regra não sabe. */
  aRegraApontaParaAFrente: boolean;
}

/**
 * Varre `DECISOES.md` atrás de **regra minha desmentida por decisão posterior**.
 *
 * `escopo` decide o que conta como desmentir, e a diferença entre os dois é o achado:
 *
 * - `"decisao"` — a marca em **qualquer lugar** da decisão posterior que cita a anterior. É a
 *   régua crua, e ela acha **25 pares** — todos falso positivo da família D142/D155: a marca
 *   está lá, mas falando de outra coisa, e a citação é de apoio e não de desmentido;
 * - `"frase"` — a marca **na mesma frase** da citação. Acha **zero**.
 *
 * > **Zero não é "nada a consertar": é onde o contraexemplo NÃO está.** O das minhas regras
 * > morava na `CLAUDE.md`, onde ele é absorvido no texto da própria regra — e ali a aritmética
 * > do fechamento é que não era medida.
 */
export function varrerContraexemplosNasDecisoes(
  decisoes: string,
  escopo: "decisao" | "frase",
): ParDeContraexemplo[] {
  const blocos = decisoes.split(/\n## (D\d+) · /);
  const corpo = new Map<string, string>();
  const ordem: string[] = [];
  for (let i = 1; i < blocos.length; i += 2) {
    corpo.set(blocos[i]!, blocos[i + 1]!);
    ordem.push(blocos[i]!);
  }
  const numero = (d: string): number => Number(d.slice(1));
  const pares: ParDeContraexemplo[] = [];
  for (const dj of ordem) {
    const texto = corpo.get(dj)!;
    const pedacos =
      escopo === "frase" ? texto.split(/(?<=[.!?:])\s+|\n\n/) : [texto];
    for (const pedaco of pedacos) {
      const baixo = pedaco.toLowerCase();
      const marca = MARCAS_DE_CONTRAEXEMPLO.find((m) => baixo.includes(m));
      if (marca === undefined) continue;
      const citadas = new Set(pedaco.match(/\bD\d+\b/g) ?? []);
      for (const di of citadas) {
        if (!corpo.has(di) || numero(di) >= numero(dj)) continue;
        pares.push({
          aRegra: di,
          oContraexemplo: dj,
          marca,
          frase: pedaco.trim().replace(/\s+/g, " ").slice(0, 160),
          aRegraApontaParaAFrente: corpo.get(di)!.includes(dj),
        });
      }
    }
  }
  return pares;
}
