/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-52 · As duas varreduras que a Central pediu — e o que cada motor alcança.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A Central achou duas coisas e mandou que eu varresse os meus atrás delas:
 *
 *   **(a)** *erro de chamada NÃO CONFERIDO que degrada para número que PARECE certo* —
 *   retorno ignorado, `catch` que engole, `Number(...)`/`parseFloat` que viram `NaN` e
 *   seguem, `??` que esconde falha, promessa sem `await`;
 *   **(b)** *função que recebe IDENTIFICADOR DE CONTA como argumento*, que ela
 *   classifica como furo de privacidade.
 *
 * # DOIS motores, e o escopo de cada um é declarado (D164)
 *
 * A metade mais perigosa de (a) — **promessa sem `await`** — **não se mede com regex**:
 * precisa de tipo. E há regra pronta para ela, `@typescript-eslint/no-floating-promises`.
 * **Medido: ela estava DESLIGADA nos dois pacotes**, porque os dois `eslint.config.js`
 * trazem `projectService: false`, e sem serviço de projeto **toda regra que precisa de
 * tipo fica muda** (D178).
 *
 * Então:
 *
 * | o quê | quem mede |
 * |---|---|
 * | promessa sem `await`, `await` em não-promessa, `async` sem `await` | o **lint com tipo** |
 * | `catch` que engole, `?? 0` sobre chamada, `Number(...)` sem conferência | **esta varredura** |
 * | identificador de conta em argumento | **esta varredura** |
 *
 * **O que esta varredura NÃO alcança, dito:** retorno ignorado de função de biblioteca
 * (não há como saber, sem tipo, se o valor importava) e qualquer coisa que dependa de
 * fluxo entre arquivos. Para isso o remédio é o lint tipado, não uma regex melhor.
 *
 * # A disciplina do D177, aplicada antes de escrever a régua
 *
 * > **Régua que varre texto mede o que o texto AFIRMA e o que ele DIZ SOBRE SI, e só a
 * > primeira é o objeto.**
 *
 * São **quatro** casos já (D137, D142, D155, D177). Então aqui o texto passa por
 * {@link soOCodigo} antes de qualquer casamento: fora comentários de linha e de bloco, e
 * **conteúdo** de string/template esvaziado (as aspas ficam, para a sintaxe não quebrar).
 * Sem isso, este próprio arquivo — que **cita** `catch {}` e `?? 0` ao explicá-los —
 * seria o primeiro acusado.
 */

/**
 * O texto **sem comentário**, com as strings intactas.
 *
 * Existe separado do {@link soOCodigo} por um defeito que a sabotagem pegou (D179): a
 * trava que confere se uma REGRA DE LINT está declarada precisa ler **o valor de uma
 * string** (`"@typescript-eslint/no-floating-promises": "error"`), e o `soOCodigo`
 * esvazia strings. Já o comentário tem de sair, senão o nome da regra citado na
 * explicação a faz passar — foi exatamente o que aconteceu.
 *
 * **As duas limpezas existem porque há duas perguntas:** *"o código FAZ isto?"* esvazia
 * strings; *"a configuração DECLARA isto?"* as preserva. Usar a errada é a quinta vez da
 * família do D137/D142/D155/D177.
 */
/**
 * ── POR QUE ISTO É UM VARREDOR E NÃO DUAS REGEX (LAB-60) ─────────────────────
 *
 * As duas regex que estavam aqui **comiam arquivo inteiro**, e o LAB-60 mediu isso
 * apontando a varredura ao `eslint.config.js` do motor do vizinho: ela devolveu **zero
 * regras em `"warn"`** e **zero em `"off"`** num arquivo que traz as duas escritas.
 *
 * **A causa é um glob.** `"**\/*.{ts,tsx}"` contém a sequência `/*`, e
 * `"scripts/**\/*.ts"` contém `*\/` — então o `/\/\*[\s\S]*?\*\//` casava **de dentro de
 * uma string até dentro de outra** e apagava tudo no meio, inclusive o bloco `rules`
 * inteiro. O mesmo valia, em menor grau, para os dois `eslint.config.js` desta casa:
 * `"node_modules/**"` tem `/*` e `"**\/*.d.ts"` tem `*\/`.
 *
 * > **Limpeza que não sabe onde a string começa não limpa: ela corta.** E o corte é um
 * > falso NEGATIVO — a espécie que o D164 descreve, em que zero de régua cega é
 * > indistinguível de zero de árvore limpa.
 *
 * Então aqui há um varredor que anda o texto uma vez, sabendo em que estado está: fora,
 * em comentário de linha, em comentário de bloco, ou dentro de `'`, `"` ou `` ` ``. O
 * comentário sai virando espaço, as novas linhas ficam (para o número da linha não
 * mentir), e o conteúdo de string é **preservado** — é o que separa esta função da
 * {@link soOCodigo}.
 *
 * **O que ele NÃO alcança, e vai dito:** literal de expressão regular. Distinguir um
 * literal de regex que contenha abre-comentário de uma simples divisão exige a gramática
 * inteira, e aqui não vale o preço — os padrões deste repositório moram em `String.raw`
 * (template), que o varredor acompanha.
 *
 * *E uma ironia que ficou registrada: a primeira versão deste comentário trazia o exemplo
 * do literal de regex escrito por extenso, e a sequência de fecha-comentário dentro dele
 * FECHOU o próprio comentário. O `tsc` pegou na hora — é o D175 do lado bom.*
 */
export function semComentarios(texto: string): string {
  const fora: string[] = [];
  type Estado = "fora" | "linha" | "bloco" | "'" | '"' | "`";
  let estado: Estado = "fora";
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]!;
    const d = texto[i + 1];
    if (estado === "fora") {
      if (c === "/" && d === "*") { estado = "bloco"; fora.push(" ", " "); i++; continue; }
      if (c === "/" && d === "/") { estado = "linha"; fora.push(" ", " "); i++; continue; }
      if (c === "'" || c === '"' || c === "`") { estado = c; fora.push(c); continue; }
      fora.push(c);
      continue;
    }
    if (estado === "linha") {
      if (c === "\n") { estado = "fora"; fora.push(c); continue; }
      fora.push(" ");
      continue;
    }
    if (estado === "bloco") {
      if (c === "*" && d === "/") { estado = "fora"; fora.push(" ", " "); i++; continue; }
      fora.push(c === "\n" ? c : " ");
      continue;
    }
    // Dentro de string: a barra invertida protege o próximo caractere.
    if (c === "\\") { fora.push(c, texto[i + 1] ?? ""); i++; continue; }
    if (c === estado) estado = "fora";
    fora.push(c);
  }
  return fora.join("");
}

/**
 * O texto só com CÓDIGO: sem comentário, sem literal de regex, e com o conteúdo das strings
 * esvaziado.
 *
 * # O LITERAL DE REGEX SAI PRIMEIRO, e a razão foi medida no LAB-80 (D267)
 *
 * O esvaziador de strings casa de uma aspa à próxima **através de quebras de linha**, e não sabe
 * que uma aspa pode morar **dentro de um literal de regex**. Aplicado a este próprio arquivo, que
 * declara uma classe de caracteres com as três aspas, ele casava **daquela aspa até muito depois**:
 * medido, **422 linhas viravam 164**, e tudo no meio desaparecia.
 *
 * O efeito não era um erro: era **cegueira silenciosa**. A varredura de chamadas deixou de achar o
 * único achado benigno deste arquivo — **de 1 para 0** — e um `?? 0` de verdade escrito ali
 * passaria igual. *Limpeza que não sabe onde a string começa não limpa: ela corta* — e o corte é
 * falso **negativo**, a espécie que o D164 descreve.
 *
 * A {@link semLiteraisDeRegex} entra **antes** do esvaziador e tira o literal inteiro, com as
 * aspas de dentro. Era este o buraco que o comentário desta família declarava e declinava de
 * fechar; fechá-lo deixou de ser preço e passou a ser correção.
 *
 * *Quem pegou foi a trava dos FANTASMAS da `chamadas.test.ts` — a que cobra que um benigno
 * declarado não DESAPAREÇA. Lista de benignos sem a metade "nenhum deles sumiu" teria aprovado o
 * silêncio.*
 */
export function soOCodigo(texto: string): string {
  let fora = semLiteraisDeRegex(semComentarios(texto));
  // O conteúdo das strings sai; as aspas ficam. Uma string que contenha `catch {}`
  // é um nome de regra ou um exemplo, nunca um `catch` que engole.
  fora = fora.replace(/(["'`])(?:\\.|(?!\1)[\s\S])*\1/g, (m) => m[0] + " ".repeat(Math.max(0, m.length - 2)) + m[0]);
  return fora;
}

/**
 * As palavras depois das quais uma barra começa um LITERAL DE REGEX, e não uma divisão.
 *
 * Sem elas, `return /x/.test(s)` seria lido como divisão, porque o caractere anterior é
 * letra. *Régua que decide por um caractere só erra na palavra-chave.*
 */
/** As três aspas, num Set — porque dentro de um literal de regex elas cegam o varredor (D267). */
const ASPAS = new Set(["'", '"', "`"]);

const ANTES_DE_REGEX = new Set([
  "return", "typeof", "case", "in", "of", "new", "delete", "void", "do", "else", "yield", "await",
]);

/**
 * O texto **sem literal de expressão regular** — o conteúdo do literal vira espaço.
 *
 * # Por que esta terceira limpeza existe, e o preço que ela cobra está medido
 *
 * O comentário desta família declarava este buraco e declinava de fechá-lo: *"literal de
 * expressão regular… aqui não vale o preço — os padrões deste repositório moram em
 * `String.raw`"*. **Para a configuração isso era verdade. Para a varredura de custo não é**
 * (D258): os nomes do nosso custo moram em literais de regex nus, e por isso a trava do
 * vazamento **acusava a si mesma em 13 linhas** e comprava a isenção com o próprio nome numa
 * lista. *A pergunta mudou, e quando a pergunta muda o preço de uma limpeza muda com ela.*
 *
 * > **Esta responde a uma TERCEIRA pergunta: "o código USA este nome?"** — e um padrão que
 * > PROCURA um nome não o usa. `semComentarios()` responde *"o texto declara isto?"*;
 * > `soOCodigo()`, *"o código faz isto?"*; esta, *"o código usa este nome?"*.
 *
 * Compõe-se **depois** da {@link soOCodigo}: com o conteúdo das strings já esvaziado, nenhuma
 * barra de dentro de string chega aqui.
 *
 * **O que ela não alcança, e vai dito:** literal que não fecha na mesma linha fica intacto, e
 * a decisão entre regex e divisão é feita pelo caractere anterior mais a lista
 * {@link ANTES_DE_REGEX} — não pela gramática. O erro possível é apagar uma divisão, e apagar
 * só produz falso NEGATIVO; acusação falsa, não. É a espécie que o D164 descreve, e é por isso
 * que as travas desta casa plantam o vazamento em **posição de identificador**, onde limpeza
 * nenhuma o alcança.
 */
export function semLiteraisDeRegex(texto: string): string {
  const fora: string[] = [];
  let i = 0;
  while (i < texto.length) {
    const c = texto[i]!;
    if (c !== "/") {
      fora.push(c);
      i++;
      continue;
    }
    let k = fora.length - 1;
    while (k >= 0 && /\s/.test(fora[k]!)) k--;
    const anterior = k >= 0 ? fora[k]! : "(";
    let palavra = "";
    for (let m = k; m >= 0 && /\w/.test(fora[m]!); m--) palavra = fora[m]! + palavra;
    // **As aspas NÃO entram num literal de regex aqui, e o motivo é grave** (D267): a
    // {@link semComentarios} não conhece literal de regex, então uma aspa dentro de uma classe de
    // caracteres a joga em estado de string e **dessincroniza o varredor até o fim do arquivo**.
    // A primeira versão desta linha era `/[\w)\]` mais as três aspas `/`, e a varredura de
    // chamadas **parou de achar o único achado benigno deste arquivo** — de 1 para 0, em silêncio.
    // Quem pegou foi a trava dos FANTASMAS da `chamadas.test.ts`, que cobra que um benigno
    // declarado não desapareça. *Régua cega dá zero igual a árvore limpa* (D164).
    const fechaValor = /[\w)\]]/.test(anterior) || ASPAS.has(anterior);
    const ehRegex = !fechaValor || ANTES_DE_REGEX.has(palavra);
    if (!ehRegex) {
      fora.push(c);
      i++;
      continue;
    }
    let j = i + 1;
    let emClasse = false;
    let fechou = false;
    while (j < texto.length && texto[j] !== "\n") {
      const d = texto[j]!;
      if (d === "\\") {
        j += 2;
        continue;
      }
      if (d === "[") emClasse = true;
      else if (d === "]") emClasse = false;
      else if (d === "/" && !emClasse) {
        fechou = true;
        break;
      }
      j++;
    }
    if (!fechou) {
      fora.push(c);
      i++;
      continue;
    }
    for (let m = i; m <= j; m++) fora.push(" ");
    i = j + 1;
  }
  return fora.join("");
}

/** O texto só com os nomes que o código USA: sem comentário, sem string e sem padrão. */
export function soOsNomesUsados(texto: string): string {
  return semLiteraisDeRegex(soOCodigo(texto));
}

export type RegraDeChamada = {
  nome: string;
  familia: "erro-nao-conferido" | "identificador-de-conta";
  oQue: string;
  oQueNaoPega: string;
  padrao: string;
  sinais: string;
  /** Um exemplo que a regra DEVE pegar — montado em pedaços, pela lição do LAB-47. */
  exemploQuePega: () => string;
};

/** Nomes de parâmetro que a Central classifica como identificador de conta. */
export const NOMES_DE_IDENTIFICADOR_DE_CONTA = [
  "userid", "user_id", "usuarioid", "usuario_id", "accountid", "account_id",
  "contaid", "conta_id", "clienteid", "cliente_id", "customerid", "tenantid",
  "tenant_id", "email", "e_mail", "cpf", "cnpj", "ssn", "telefone", "phone",
  "assinante", "subscriberid", "ownerid", "owner_id", "accountuuid", "sub",
] as const;

/**
 * Chamadas em que **ausência não é erro** — e por isso `?? 0` nelas é o jeito CERTO.
 *
 * **Medido, e é o achado de método deste prompt:** a primeira versão da regra
 * `degrada-chamada-para-numero` deu **28 achados**, e **28 de 28 eram falso positivo** —
 * `at` 16, `get` 10, mais dois casos de serialização. `Array.prototype.at(-1)` num vetor
 * vazio e `Map.prototype.get(k)` numa chave que falta **não falharam**: eles disseram
 * "não tem", e `?? 0` é a resposta declarada para isso.
 *
 * A classe que a Central nomeou é *"erro de chamada NÃO CONFERIDO"* — **erro**. Estreitar
 * a regra para o alvo que ela mesma declara não é afrouxá-la (o contrário do D143/D172):
 * é a pergunta do D127 feita antes de acusar — **a chamada que eu casei sinaliza falha?**
 *
 * **O buraco, declarado:** uma função PRÓPRIA chamada `get…`/`at…` que falhe de verdade
 * escapa. É o preço de a lista casar por nome, e ele é menor que o de 28 acusações falsas.
 */
export const AUSENCIA_NAO_E_ERRO = ["at", "get", "pop", "shift", "find", "findLast", "match", "shiftOut"] as const;

export const REGRAS_DE_CHAMADA: readonly RegraDeChamada[] = [
  {
    nome: "catch-que-engole",
    familia: "erro-nao-conferido",
    oQue: "`catch` de corpo vazio: o erro desaparece e a execução segue como se nada houvesse",
    oQueNaoPega: "`catch` que registra o erro e segue — esse é escolha declarada, não engolir; e `catch` cujo corpo é longo",
    padrao: String.raw`\bcatch\s*(?:\([^)]*\))?\s*\{\s*\}`,
    sinais: "g",
    exemploQuePega: () => "try { f(); } " + "cat" + "ch { }",
  },
  {
    nome: "catch-que-devolve-numero",
    familia: "erro-nao-conferido",
    oQue: "`catch` cujo corpo só devolve um número ou zero — o erro vira um valor que PARECE medido",
    oQueNaoPega: "`catch` que devolve `null`, que é a resposta honesta deste repositório (D23)",
    padrao: String.raw`\bcatch\s*(?:\([^)]*\))?\s*\{\s*return\s+-?\d+(?:\.\d+)?\s*;?\s*\}`,
    sinais: "g",
    exemploQuePega: () => "try { f(); } " + "cat" + "ch (e) { return 0; }",
  },
  {
    nome: "degrada-chamada-para-numero",
    familia: "erro-nao-conferido",
    oQue: "`?? 0` ou `|| 0` sobre o resultado de uma CHAMADA: a falha vira um número que parece certo",
    oQueNaoPega:
      "`?? 0` sobre PROPRIEDADE ou variável; a crase vazia, que quebra o literal onde este padrão mora (dito em vez de escondido); e as chamadas de AUSÊNCIA DECLARADA da lista `AUSENCIA_NAO_E_ERRO` — ver o porquê lá, medido em 28 falsos positivos",
    padrao: "\\b[A-Za-z_$][\\w$.]*\\s*\\([^()\\n]*\\)\\s*(?:\\?\\?|\\|\\|)\\s*(?:0|''|\"\")",
    sinais: "g",
    exemploQuePega: () => "const x = medir" + "() ?? 0",
  },
  {
    nome: "numero-sem-conferir",
    familia: "erro-nao-conferido",
    oQue: "`Number(...)`/`parseFloat`/`parseInt` guardado num nome que o arquivo NUNCA confere com `Number.isFinite`, `isNaN` ou `Number.isNaN`",
    oQueNaoPega: "conversão usada na hora, sem nome; e conferência feita em OUTRO arquivo — sem tipo não há como seguir o valor",
    padrao: String.raw`\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*(?:Number|parseFloat|parseInt)\s*\(`,
    sinais: "g",
    exemploQuePega: () => "const n = Num" + "ber(entrada); return n * 2;",
  },
  {
    nome: "identificador-de-conta-em-argumento",
    familia: "identificador-de-conta",
    oQue: "parâmetro de função cujo nome é identificador de pessoa ou de conta — o furo de privacidade que a Central nomeou",
    oQueNaoPega: "identificador que viaja dentro de um OBJETO (`opcoes.userId`), e nome que não está na lista declarada",
    padrao: String.raw`\b(?:function\s+[A-Za-z_$][\w$]*\s*|=>\s*|\(\s*)\(?([^()]{0,400})\)`,
    sinais: "g",
    exemploQuePega: () => "function cobrar(user" + "Id: string) {}",
  },
  {
    nome: "identificador-de-conta-em-campo",
    familia: "identificador-de-conta",
    oQue: "CAMPO de interface ou de objeto cujo nome é identificador de pessoa ou de conta — fecha o buraco que a regra do argumento deixa aberto",
    oQueNaoPega: "identificador guardado sob um nome que não está na lista declarada, e identificador que só existe em tempo de execução",
    padrao: String.raw`^\s*(?:readonly\s+)?([A-Za-z_$][\w$]*)\s*[?]?\s*:`,
    sinais: "gm",
    // O exemplo é MULTILINHA de propósito: o padrão ancora o campo no começo da
    // linha (`^\s*nome:`), que é como campo de interface de fato aparece — e foi a
    // trava "cada regra é exercitada pelo exemplo dela" que cobrou isto, com o
    // exemplo de uma linha só dando zero.
    exemploQuePega: () => "interface X {\n  user" + "Id: string;\n}",
  },
] as const;

export type AchadoDeChamada = {
  regra: string;
  familia: string;
  arquivo: string;
  linha: number;
  trecho: string;
};

export type EscopoDaVarreduraDeChamadas = {
  arquivos: number;
  linhas: number;
  bytes: number;
  regras: number;
  /** Quantos parâmetros de função foram efetivamente examinados pela regra (b). */
  parametrosExaminados: number;
  /** Quantos CAMPOS de objeto foram examinados — a segunda régua de (b). */
  camposExaminados: number;
};

const linhaDe = (texto: string, i: number) => texto.slice(0, i).split("\n").length;

/** Varre UM arquivo. O texto entra cru e é limpo aqui, uma vez. */
export function varrerUmArquivo(
  bruto: string,
  arquivo: string,
): { achados: AchadoDeChamada[]; parametros: number; campos: number } {
  const codigo = soOCodigo(bruto);
  const achados: AchadoDeChamada[] = [];
  let parametros = 0;
  let campos = 0;

  for (const regra of REGRAS_DE_CHAMADA) {
    const padrao = new RegExp(regra.padrao, regra.sinais);

    if (regra.nome === "identificador-de-conta-em-argumento") {
      // A lista de parâmetros é partida em nomes, e cada nome é comparado com a
      // lista declarada. Contar os parâmetros examinados é o que faz do ZERO um
      // zero medido, e não um silêncio (D164).
      for (const m of codigo.matchAll(padrao)) {
        for (const bruta of (m[1] ?? "").split(",")) {
          const nome = bruta.trim().split(/[:=]/)[0]?.trim().replace(/^\.\.\./, "").replace(/[?]/g, "") ?? "";
          if (!nome || !/^[A-Za-z_$][\w$]*$/.test(nome)) continue;
          parametros += 1;
          if ((NOMES_DE_IDENTIFICADOR_DE_CONTA as readonly string[]).includes(nome.toLowerCase())) {
            achados.push({ regra: regra.nome, familia: regra.familia, arquivo, linha: linhaDe(codigo, m.index), trecho: nome });
          }
        }
      }
      continue;
    }

    if (regra.nome === "numero-sem-conferir") {
      for (const m of codigo.matchAll(padrao)) {
        const nome = m[1]!;
        const conferido = new RegExp(String.raw`(?:Number\.isFinite|Number\.isNaN|isNaN)\s*\(\s*${nome}\b|\b${nome}\s*(?:!==?|===?)\s*(?:null|undefined)|Number\.isFinite\(\s*${nome}`).test(codigo);
        if (!conferido) achados.push({ regra: regra.nome, familia: regra.familia, arquivo, linha: linhaDe(codigo, m.index), trecho: nome });
      }
      continue;
    }

    if (regra.nome === "identificador-de-conta-em-campo") {
      for (const m of codigo.matchAll(padrao)) {
        const nome = m[1]!;
        campos += 1;
        if ((NOMES_DE_IDENTIFICADOR_DE_CONTA as readonly string[]).includes(nome.toLowerCase())) {
          achados.push({ regra: regra.nome, familia: regra.familia, arquivo, linha: linhaDe(codigo, m.index), trecho: nome });
        }
      }
      continue;
    }

    for (const m of codigo.matchAll(padrao)) {
      if (regra.nome === "degrada-chamada-para-numero") {
        // A chamada que eu casei sinaliza FALHA? Se o nome dela está na lista de
        // ausência declarada, não — e acusá-la seria acusar o jeito certo.
        const chamada = /([A-Za-z_$][\w$]*)\s*\(/.exec(m[0])?.[1] ?? "";
        if ((AUSENCIA_NAO_E_ERRO as readonly string[]).includes(chamada)) continue;
      }
      achados.push({
        regra: regra.nome,
        familia: regra.familia,
        arquivo,
        linha: linhaDe(codigo, m.index),
        trecho: m[0].replace(/\s+/g, " ").slice(0, 80),
      });
    }
  }

  return { achados, parametros, campos };
}
