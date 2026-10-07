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
export function semComentarios(texto: string): string {
  let fora = texto.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  fora = fora.replace(/(^|[^:])\/\/[^\n]*/g, (m, p1: string) => p1 + " ".repeat(m.length - p1.length));
  return fora;
}

/** O texto só com CÓDIGO: sem comentário, e com o conteúdo das strings esvaziado. */
export function soOCodigo(texto: string): string {
  let fora = semComentarios(texto);
  // O conteúdo das strings sai; as aspas ficam. Uma string que contenha `catch {}`
  // é um nome de regra ou um exemplo, nunca um `catch` que engole.
  fora = fora.replace(/(["'`])(?:\\.|(?!\1)[\s\S])*\1/g, (m) => m[0] + " ".repeat(Math.max(0, m.length - 2)) + m[0]);
  return fora;
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
