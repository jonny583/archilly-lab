import { existsSync, readFileSync } from "node:fs";

/**
 * COMO SE LÊ UMA REGRA ESCRITA EM MARKDOWN — num lugar só. (LAB-77)
 *
 * # Por que este arquivo existe, e o preço de ele não ter existido
 *
 * Meia dúzia de travas desta casa conferem que uma lição, uma ordem ou uma regra **está escrita**
 * num arquivo `.md`. Todas elas casam texto, e todas tropeçam na mesma coisa: **o texto da regra
 * está quebrado em linhas, e muitas vezes dentro de um bloco de citação**, então o literal que a
 * trava procura não existe em lugar nenhum — mesmo com a regra perfeitamente escrita.
 *
 * Isso já aconteceu **quatro vezes**, e as três primeiras estão registradas:
 *
 * | quando | o literal | o que o arquivo tinha |
 * |---|---|---|
 * | LAB-74 §5 | `"se chama pela pergunta que ele espera"` | quebrado em duas linhas |
 * | LAB-75 §6 | `"MUDOU O MUNDO EMBAIXO DELA"` | quebrado **dentro de um `>`** |
 * | item 008 | a mesma trava, uma hora depois | idem |
 * | LAB-77 | `"15 metros"` do adendo | `**15\n> metros**` — quebra **e** `>` **e** `**` |
 *
 * **E o conserto já existia, inline, dentro de `disparos-em-vazio.test.ts`** — escrito no LAB-75,
 * e não reusado no LAB-77 porque ninguém sabia que estava lá. É o D116 na forma mais pura: *a
 * mesma pergunta respondida em dois lugares*, com o segundo lugar reescrevendo o erro que o
 * primeiro já tinha consertado.
 *
 * > **Conserto que mora dentro de um teste conserta um teste.** O que mais de uma trava precisa
 * > chamar mora em `src/` — a mesma lição que o D247 tirou das ferramentas, agora das travas.
 */

/**
 * O texto de uma regra como ela **se lê**, não como está gravada.
 *
 * Tira, nesta ordem e por este motivo:
 *
 * 1. a **marca do bloco de citação** (`>`) no começo de cada linha — ela cai no MEIO de uma
 *    frase citada que o Markdown quebrou, e nenhuma régua espera encontrá-la ali;
 * 2. o **negrito** (`**`) — a ênfase cai dentro de palavras e números (`**15\n> metros**`), e
 *    quem escreveu a regra enfatizou o que quis, não o que a trava procura;
 * 3. a **quebra de linha e o espaço repetido** — a largura da coluna de um `.md` é escolha de
 *    quem escreve, e não deve mudar o que uma trava enxerga.
 *
 * **O que ela NÃO tira:** acento, caixa e pontuação. Quem conferir *"15 metros"* tem de aceitar
 * a quebra de linha, mas não tem direito de aceitar *"15 metro"* — afrouxar a régua até tudo
 * passar é o contrário de consertá-la.
 */
export function comoARegraSeLe(texto: string): string {
  return texto
    .split("\n")
    .map((l) => l.replace(/^\s*>\s?/, ""))
    .join(" ")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** A regra está escrita neste texto? Lê pelo {@link comoARegraSeLe}. */
export function aRegraEstaEscrita(texto: string, oQueProcurar: string): boolean {
  return comoARegraSeLe(texto).includes(comoARegraSeLe(oQueProcurar));
}

/**
 * LÊ UM ITEM DA CAIXA DE ENTRADA PELO NÚMERO — porque o NOME dele muda. (LAB-77, D252)
 *
 * Um item entra como `010.md` e, quando é executado, vira `010-FEITO.md`. **Uma trava que o
 * cita pelo nome quebra no instante em que o item é concluído** — e foi exatamente o que
 * aconteceu no LAB-77: a trava lia `010-adendo.md`, eu marquei o item como feito no fim da
 * rodada, e o arquivo de teste passou a **estourar ao carregar**. O verde caiu com
 * `765 pass · 1 fail`, e o "fail" não era um teste: era o arquivo inteiro não abrindo.
 *
 * > **Trava que cita um item pelo NOME do arquivo tem um prazo: o dia em que o item é
 * > concluído.** Cita-se pelo NÚMERO, que é o que não muda.
 *
 * E havia precedente nos dois sentidos, o que é o sinal do D116: `trava-de-estrutura.test.ts`
 * já casava por prefixo (`startsWith(".../006")`) e sobreviveu, enquanto `custo-por-uso` e
 * `vazamento-de-custo` gravaram `005-FEITO.md` **literal** — elas nasceram depois da renomeação
 * e por isso nunca sentiram o problema. Duas respostas para a mesma pergunta, e só uma aguenta
 * a próxima renomeação.
 */
export function caminhoDoItemDaCaixa(raiz: string, numero: string): string {
  const dir = `${raiz}/docs/caixa-de-entrada`;
  const candidatos = [`${dir}/${numero}.md`, `${dir}/${numero}-FEITO.md`];
  const achados = candidatos.filter((c) => existsSync(c));
  // **OS DOIS AO MESMO TEMPO É ERRO, não preferência** (LAB-80). Medido no próprio prompt: eu
  // renomeei `013.md` para `013-FEITO.md` no ramo, e o `git merge` da `origin/main` — que ainda
  // tinha o original — **ressuscitou o `013.md`**. Os dois no disco, e esta função devolvia o
  // primeiro: o item concluído voltaria a ser lido como PENDENTE, em silêncio.
  //
  // > **Renomear num ramo e mesclar a origem que tem o nome antigo recria o nome antigo.** O
  // > estado de um item é o NOME do arquivo, e dois nomes para o mesmo número não são um estado:
  // > são uma ambiguidade — que se recusa, nunca se resolve por ordem de lista.
  if (achados.length > 1) {
    throw new Error(
      `o item "${numero}" da caixa de entrada existe DUAS vezes — ${achados.join(" e ")}. O ` +
        "estado de um item é o nome do arquivo, e dois nomes são ambiguidade: apague o que não " +
        "vale. Costuma ser um `git merge` da origem que ressuscitou o nome antigo depois de um " +
        "renomear no ramo",
    );
  }
  for (const c of achados) {
    return c;
  }
  throw new Error(
    `o item "${numero}" da caixa de entrada não foi encontrado — procurei por ` +
      `${candidatos.join(" e ")}. Item some da caixa quando o chat o apaga; item RENOMEADO ` +
      "continua lá, e é isso que esta função existe para atravessar",
  );
}

/** O texto de um item da caixa, achado pelo número e lido como a regra se lê. */
export function lerItemDaCaixa(raiz: string, numero: string): string {
  return readFileSync(caminhoDoItemDaCaixa(raiz, numero), "utf8");
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ONDE UMA LINHA ESTÁ NA PÁGINA — e por que isso decide o que ela AFIRMA. (LAB-80)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Em Markdown a **posição** de uma frase muda o que ela diz. A mesma linha, dentro de um
 * bloco de citação, é fonte de fora; dentro de um bloco de código, é um exemplo; em prosa
 * nua, é uma afirmação de quem escreve.
 *
 * # Isto já tinha CINCO respostas nesta casa, e o LAB-80 as contou (D259)
 *
 * | onde | o que lê | para quem |
 * |---|---|---|
 * | `src/limites-com-sujeito.ts` | `semCitacoes()` — tira a LINHA de citação | a aritmética da regra |
 * | `tests/moldura.test.ts` | `semRiscadoNemCitado()` — riscado, crase e citação curta | a moldura |
 * | `tests/verde.test.ts` | um `semCitacoes` local, só citação curta | o aviso do CI |
 * | `src/trava-de-estrutura.ts` | `/^\s*>/` inline | as condições de conta |
 * | `src/texto-das-regras.ts` | `comoARegraSeLe()` — tira o `>` do MEIO da frase | toda trava que cita regra |
 *
 * **Nenhuma delas conhecia o BLOCO DE CÓDIGO**, e é ele que guarda os recados — o que fez a
 * varredura de custo acusar o `RECADOS.md` por duas linhas que são recado gravado.
 *
 * > **Cinco respostas para "esta linha afirma ou só mostra?" não são cinco réguas: são uma
 * > régua que ninguém terminou.** O D116 proíbe a segunda montagem da mesma pergunta; aqui
 * > havia a quinta.
 *
 * A unificação das cinco **não** foi feita neste prompt — está na `FILA.md` como proposta, com
 * esta contagem. O que foi feito é o que o item exigia: a leitura que a varredura de custo
 * precisa mora **aqui**, com as outras que já moravam, em vez de nascer a sexta dentro de uma
 * trava (D248).
 */

/** Onde uma linha de Markdown está. `prosa` é o único lugar onde a linha AFIRMA. */
export type LugarNaPagina = "citacao" | "bloco-de-codigo" | "prosa";

/**
 * O lugar de **cada linha** do texto, na ordem.
 *
 * A linha da cerca (` ``` `) conta como bloco: ela é marcação, nunca afirmação. Cerca sem
 * par deixa o resto do arquivo em `bloco-de-codigo`, e isso é de propósito — bloco aberto é
 * bloco até o fim da página, que é como o Markdown o desenha.
 */
export function lugaresDaPagina(texto: string): LugarNaPagina[] {
  let dentroDeBloco = false;
  return texto.split("\n").map((linha) => {
    if (/^\s*(?:```|~~~)/.test(linha)) {
      dentroDeBloco = !dentroDeBloco;
      return "bloco-de-codigo";
    }
    if (dentroDeBloco) return "bloco-de-codigo";
    if (/^\s*>/.test(linha)) return "citacao";
    return "prosa";
  });
}

/**
 * Tira o que o texto MOSTRA — como erro, como citação ou como literal — e deixa o que ele
 * AFIRMA.
 *
 * Em Markdown há **três** formas de mostrar sem afirmar, e as três saem:
 *
 * - `~~…~~` — o **riscado**: a forma de exibir o próprio erro (D161);
 * - `*"…"*`, `**"…"**`, `"…"` — a **citação**, como no `semCitacoes()` do D177;
 * - crases — o **literal**: ali a frase é o nome de um padrão, não a opinião de quem
 *   escreve. **Esta terceira entrou porque a trava me reprovou:** o texto do D192 lista os
 *   padrões que a régua casava, entre crases, e a régua leu os nomes dos próprios padrões
 *   dela como afirmação. É a quarta vez do D177 naquele prompt.
 *
 * **O buraco fica declarado:** afirmação disfarçada de citação, de riscado ou de literal
 * escapa. O preço é menor que o de reprovar o próprio conserto — e a trava **positiva**, que
 * exige a causa certa escrita, é o que cobre o caso que importa.
 *
 * *Morava em `tests/moldura.test.ts` até o LAB-80, e veio para cá quando uma segunda trava
 * precisou da mesma leitura — a regra deste arquivo (D248).*
 */
export function semRiscadoNemCitado(texto: string): string {
  return texto
    .replace(/~~[\s\S]*?~~/g, " ")
    .replace(/`+[^`\n]*`+/g, " ")
    .replace(/\*+"[^"]*"\*+/g, " ")
    .replace(/"[^"\n]*"/g, " ");
}

/**
 * O termo é **afirmado** nesta linha, ou só mostrado?
 *
 * Afirmado é o que sobra depois de sair o riscado, a crase e a citação curta. É a pergunta
 * que separar *"a régua só conta `margem` quando…"* — onde o nome está entre crases porque
 * está sendo **nomeado** — de *"a margem de lucro é 40 %"*, que é o objeto.
 */
export function afirmadoNaLinha(linha: string, termo: RegExp): boolean {
  return termo.test(semRiscadoNemCitado(linha));
}

/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A FAMÍLIA DAS LEITURAS — terminada no LAB-81 (item 014, D259)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-80 contou **cinco** respostas para *"esta linha afirma ou só mostra?"* nesta casa, três
 * delas dentro de travas, e nenhuma conhecendo o **bloco de código** — que é onde moram os
 * recados. A frase ficou:
 *
 * > **Cinco respostas para a mesma pergunta não são cinco réguas: são uma régua que ninguém
 * > terminou.**
 *
 * # Terminar NÃO era fazer as cinco iguais, e a medição é o que decidiu
 *
 * O item 014 pôs a fronteira: *"se alguma das três precisa ser mais frouxa ou mais rígida que as
 * outras, escreva o motivo ao lado dela e deixe-a de fora. **Cinco iguais por conveniência é pior
 * que quatro iguais e uma declarada.**"*
 *
 * **Uma precisa.** A trava do LAB-51 varre o `conferir.sh` — um script de shell — procurando
 * frases que AFIRMAM que algo não existe, e o **caminho entre crases é o DADO dela**:
 *
 * | limpeza | a mentira plantada | a citação plantada |
 * |---|---|---|
 * | `semCitacoes` (a dela) | nega ✔ · acha `.github/workflows/verde.yml` ✔ | passa ✔ |
 * | `semRiscadoNemCitado` | nega ✔ · acha **NENHUM caminho** ✘ | passa ✔ |
 *
 * A limpeza mais forte **cega a trava no caso exato para que ela foi escrita**, porque tira a
 * crase. E `lugaresDaPagina()` sobre aquele `.sh` devolve **0 citação e 0 bloco de código em 147
 * linhas**: a leitura de Markdown ali é um **nada**, não um ganho.
 *
 * > **Unificar é dar UM LUGAR às leituras e UMA PERGUNTA a cada uma — não dar a mesma resposta a
 * > perguntas diferentes.** A limpeza que remove o dado de quem a chama não é mais rigorosa: é
 * > **um desligamento passando por conserto** (item 014, e é a ordem da Central: provar primeiro
 * > que a régua **continua achando o que achava**).
 *
 * # O que cada uma responde, e é por isto que pegar a errada é difícil agora
 *
 * - {@link lugaresDaPagina} — *"ONDE esta linha está?"* Só Markdown; num `.sh` é um nada;
 * - {@link soAProsa} — *"quais linhas AFIRMAM?"* Tira citação **e bloco de código**. É a que
 *   fechou o buraco comum das cinco;
 * - {@link semCitacoes} — *"o texto afirma isto, quando a CRASE É O DADO?"* Tira só a aspas
 *   curta. **A crase sobrevive de propósito**;
 * - {@link semRiscadoNemCitado} — *"o texto afirma isto, quando a crase é RUÍDO?"* Tira riscado,
 *   crase e aspas curta;
 * - {@link comoARegraSeLe} — *"a regra ESTÁ ESCRITA?"* Normaliza `>`, negrito e quebra de linha;
 * - {@link afirmadoNaLinha} — a composta, para quem já sabe que a linha é prosa.
 */

/**
 * As linhas que AFIRMAM — fora a citação e **fora o bloco de código**.
 *
 * É a leitura que faltava às cinco, e o buraco era comum a todas: **nenhuma via o bloco de
 * código**, e foi por isso que a varredura de custo acusou o `RECADOS.md` por duas linhas que são
 * **recado gravado** (D259). A linha da cerca sai também — ela é marcação, nunca afirmação.
 *
 * Devolve o texto com as linhas que não são prosa **esvaziadas, não removidas**: o número da
 * linha não pode mentir para quem reportar o achado. *Limpeza que encurta o texto faz a régua
 * apontar para a linha errada* — e esta casa já pagou por número de linha mentiroso.
 */
export function soAProsa(texto: string): string {
  const lugares = lugaresDaPagina(texto);
  return texto
    .split("\n")
    .map((linha, i) => (lugares[i] === "prosa" ? linha : ""))
    .join("\n");
}

/**
 * O texto sem a **aspas curta**, com a crase INTACTA.
 *
 * *"A régua confere afirmações de inexistência contra o disco, e a primeira versão dela ia
 * reprovar o arquivo que eu acabara de consertar — porque o cabeçalho novo CITA a frase falsa"*
 * (LAB-51). Morava dentro de `tests/verde.test.ts`, e veio para cá no LAB-81.
 *
 * **A crase não sai, e isto é a declaração do item 014:** quem chama esta leitura procura o
 * **caminho entre crases** na frase que nega. Tirar a crase cegaria a trava no caso exato para
 * que ela existe — medido, com a mentira plantada: a limpeza mais forte acha **zero** caminhos
 * onde esta acha o certo.
 */
export function semCitacoes(texto: string): string {
  return texto.replace(/\*"[^"]*"\*/g, " ").replace(/"[^"\n]*"/g, " ");
}

/** Quem lê, o que ela responde, e **por que não a vizinha**. Conferida contra os `import`. */
export interface Leitura {
  /** O arquivo que chama. */
  instrumento: string;
  /** O nome que ele chama, e a trava confere que o `import` dele o traz. */
  leitura: string;
  /** A pergunta que esta leitura responde para este instrumento. */
  aPergunta: string;
  /** Por que NÃO a mais forte. Vazio só para quem usa a mais forte. */
  porQueNaoAOutra: string;
}

/**
 * **A tabela das leituras, declarada — e conferida contra os `import` por trava.**
 *
 * *Tabela em documento envelhece igual a comentário* (D104), e esta casa já mediu o preço de uma
 * leitura que se afasta sem ninguém declarar (D231). Então a tabela mora em código e a trava a
 * confere **contra o que cada arquivo de fato importa**, lendo o `import` e não o texto (D257).
 */
export const AS_LEITURAS: readonly Leitura[] = [
  {
    instrumento: "external-engines/esteira/src/limites-com-sujeito.ts",
    leitura: "soAProsa",
    aPergunta:
      "quais frases das seções de regra da CLAUDE.md são REGRA MINHA — e não a citação literal da Central, nem o exemplo dentro de um bloco de código",
    porQueNaoAOutra:
      "ela precisa da LINHA inteira, não de um termo: o objeto é a frase, e a frase se parte em sentenças depois. E o bloco de código entrou aqui no LAB-81 — são 20 linhas nas seções de regra, 17 na §1, que são o MOLDE do recado e não regra sobre o recado",
  },
  {
    instrumento: "external-engines/esteira/src/trava-de-estrutura.ts",
    leitura: "lugaresDaPagina + afirmadoNaLinha",
    aPergunta:
      "há condição de CONTA escrita num `.md` que o git carrega — e escrita por mim, não reportada de outro",
    porQueNaoAOutra:
      "precisa das DUAS: o lugar da linha (citação não é condição desta casa) e o que a linha afirma dentro dela (o termo entre aspas curtas está sendo reportado). Esquecer a primeira foi o D266",
  },
  {
    instrumento: "external-engines/esteira/src/destino-do-que-sai.ts",
    leitura: "lugaresDaPagina + afirmadoNaLinha",
    aPergunta: "há VALOR do nosso custo afirmado em prosa nua de um arquivo do registro",
    porQueNaoAOutra:
      "mesma razão do irmão acima, e com um limite declarado: em JSON as aspas são SINTAXE, então a prova é lida crua (D261)",
  },
  {
    instrumento: "external-engines/esteira/tests/verde.test.ts",
    leitura: "semCitacoes",
    aPergunta:
      "o `conferir.sh` AFIRMA que algum caminho não existe, enquanto ele existe no disco (LAB-51)",
    porQueNaoAOutra:
      "A CRASE É O DADO: a régua extrai o caminho de dentro dela. A limpeza mais forte acha ZERO caminhos na mentira plantada, e `lugaresDaPagina` sobre um `.sh` devolve 0 de 147 — ali ela é um nada, não um ganho. É a UMA declarada do item 014",
  },
  {
    instrumento: "external-engines/esteira/tests/moldura.test.ts",
    leitura: "semRiscadoNemCitado",
    aPergunta: "algum documento vivo ainda AFIRMA a moldura errada do D159",
    porQueNaoAOutra:
      "aqui a crase é RUÍDO: o texto do D192 lista entre crases os padrões que a régua casa, e sem tirá-los a régua lia os próprios padrões dela como afirmação",
  },
  {
    instrumento: "external-engines/esteira/tests/disparos-em-vazio.test.ts",
    leitura: "comoARegraSeLe",
    aPergunta: "a regra do disparo em vazio está ESCRITA nos dois lugares que a §1-A manda",
    porQueNaoAOutra:
      "a pergunta não é o que o texto afirma, é se a frase está lá: então o `>`, o negrito e a quebra de linha saem de DENTRO da frase, em vez de a linha sair (D248)",
  },
];

/**
 * A tabela bate com os `import` de verdade?
 *
 * Devolve o que está errado, nomeando o instrumento. Confere **o `import`**, não o texto — *régua
 * que lê o arquivo inteiro mede o que o código DIZ; régua que lê o `import` mede o que ele PODE
 * FAZER* (D257).
 */
export function conferirAsLeituras(
  ler: (arquivo: string) => string,
): string[] {
  const problemas: string[] = [];
  for (const l of AS_LEITURAS) {
    let fonte: string;
    try {
      fonte = ler(l.instrumento);
    } catch {
      problemas.push(`${l.instrumento}: declarado na tabela e NÃO existe no disco`);
      continue;
    }
    const linhaDoImport = fonte
      .split("\n")
      .filter((linha) => /^import\s/.test(linha) || /from "\.\.?\/.*texto-das-regras\.ts"/.test(linha))
      .join(" ");
    for (const nome of l.leitura.split(" + ")) {
      if (!linhaDoImport.includes(nome)) {
        problemas.push(
          `${l.instrumento}: a tabela diz que ele lê por \`${nome}\` e o \`import\` dele não traz esse nome`,
        );
      }
    }
    if (l.aPergunta.length < 30) problemas.push(`${l.instrumento}: a pergunta declarada é curta demais para dizer algo`);
    if (l.porQueNaoAOutra.length < 30) problemas.push(`${l.instrumento}: não diz por que não a leitura vizinha`);
  }
  return problemas;
}
