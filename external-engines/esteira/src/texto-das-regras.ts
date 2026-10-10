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
