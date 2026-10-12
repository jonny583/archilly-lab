/**
 * ONDE A HISTÓRIA DAS REGRAS MORA — e quem a lê, lê daqui. (LAB-95, item 028)
 *
 * # Por que este módulo existe
 *
 * O item 028 mandou enxugar o `CLAUDE.md`: a regra fica em uma ou duas frases, e **a história muda
 * de gaveta** para `docs/HISTORIA_DAS_REGRAS.md`. O item também avisou o que isso quebra:
 *
 * > *"O verde tem de ficar verde: ou a frase guardada continua no `CLAUDE.md` (em forma curta), ou
 * > **a guarda passa a ler o arquivo novo** — e, se mudou de alvo, a sabotagem dela é refeita e
 * > continua mordendo."*
 *
 * **Duas guardas liam a §6 do `CLAUDE.md` pelo título:** a trava da aritmética do ponto cego
 * (`tests/aritmetica-da-regra.test.ts`) e a ferramenta que publica a prova dela
 * (`ferramentas/lab63.ts`). A tabela das trinta e três **é história** e foi para a gaveta nova —
 * então as duas passam a ler **daqui**, pela mesma função.
 *
 * *Duas leituras do mesmo alvo em dois arquivos é o que o D231 custou: o conserto entrou num
 * instrumento só, e o que ficou de fora passou a mentir com a autoridade de quem conferia.*
 *
 * # E ela RECUSA em vez de devolver vazio
 *
 * Seção não achada devolve `null`, nunca `""`. Uma seção vazia faria a régua da aritmética dizer
 * *"zero problemas"* sobre um texto que ela não leu — e **régua que aprova o que não leu é pior do
 * que régua que falta** (a mesma escolha do `src/profundidade-da-historia.ts`, D295).
 */

/** Onde a história mora, a partir da raiz do repositório. */
export const ARQUIVO_DA_HISTORIA = "docs/HISTORIA_DAS_REGRAS.md";

/** O título da seção que guarda a tabela das trinta e três e a aritmética que fecha. */
export const SECAO_DO_PONTO_CEGO = "## H10 ·";

/**
 * A seção da história que começa em `titulo` e acaba no próximo `## ` — ou `null`.
 *
 * O corte é no próximo título de mesmo nível, como a régua do `CLAUDE.md` fazia: a seção leva
 * consigo os `###` de dentro dela, e não leva a seguinte.
 */
export function aSecaoDaHistoria(texto: string, titulo: string): string | null {
  const i = texto.indexOf(titulo);
  if (i < 0) return null;
  const resto = texto.slice(i);
  const j = resto.indexOf("\n## ", 1);
  return j < 0 ? resto : resto.slice(0, j);
}
