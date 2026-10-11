/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O CONJUNTO FECHADO DO `interpolador` — a resposta do dono do formato. (024-adendo, LAB-91)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O Generate mediu o bloco de terreno dos dois lados e achou **desacordo de VALORES**, não de
 * campo. A direção trouxe e disse, literal: *"quem decide é o dono do formato, e escolher por
 * conta própria seria fabricar o terceiro conjunto"* — e o dono deste campo é esta casa, porque a
 * lista fechada que publica `interpolador` como **obrigatório** é minha.
 *
 * # O que eu medi antes de decidir, e DUAS leituras mudaram de resposta
 *
 * | onde | o que a ORIGEM diz |
 * |---|---|
 * | `motor-testfit`, `src/lib/lab/formato-publicado.ts:142` | `interpolador: "bilinear" \| "idw"` |
 * | Generate, `src/lib/engine/indicadores-terreno.ts:146` | `type Interpolador = "idw" \| "linear" \| "natural" \| "krigagem" \| "nenhum"` |
 * | Generate: quem **ATRIBUI** um literal a `interpolador` | **ninguém** — `interpolador: "…"` dá zero no `.ts` da origem |
 * | Generate: `bilinear` em `.ts` | **zero** ocorrências |
 *
 * **A primeira leitura foi num clone velho e deu o contrário**: `krigagem` dava zero e eu quase
 * publiquei *"o Generate não enumera nada disso"*. O clone estava em `72cfab0` e a origem em
 * `8b7c157` — *o clone não é a origem*, terceira vez na mesma noite (D295).
 *
 * # A decisão, e ela é de MEDIÇÃO e não de gosto
 *
 * > **O conjunto fica FECHADO em `"bilinear" | "idw"`: os dois que esta família PRODUZ e que eu
 * > MEDI.** Valor que ninguém produz é valor que ninguém pode conferir — e inventar o terceiro
 * > conjunto seria exatamente o erro que a direção pediu para ninguém cometer.
 *
 * 1. **`"bilinear"` FICA, e NÃO é apelido de `"idw"`.** Medido no LAB-03/LAB-07 e registrado no
 *    D37: o de k vizinhos *"faz o bolo de casamento"* e o de produção não — a diferença é a razão
 *    de o campo existir, e o próprio campo diz *"ele muda o que a rampa quer dizer"*. **Apelidar
 *    seria apagar a única informação que ele carrega;**
 * 2. **`"nenhum"` é RECUSADO como valor.** Ausência de interpolação já tem forma neste formato:
 *    **`null`** — *terreno sem cota não tem indicador, e não se inventa um cheio de zeros* (D19),
 *    e `null` é "não medido" (D23). Aceitar `"nenhum"` criaria **duas formas de dizer a mesma
 *    coisa**, que é a segunda lista do D116;
 * 3. **`"linear"`, `"natural"` e `"krigagem"` entram no dia em que alguém os IMPLEMENTAR e
 *    MEDIR** — cada um com a medição do que ele faz com a rampa, que é a condição que o próprio
 *    campo declara. Hoje eles são **tipo sem produtor**: medido, **nenhum código do Generate
 *    atribui literal a `interpolador`**;
 * 4. **E o desacordo não morde hoje, o que é o que dá tempo de decidir:** sem produtor de literal
 *    do outro lado, não há valor atravessando. *É a classe GF-09 do Generate — campo com dois
 *    significados esperando o dia da divergência —, e o dia não chegou.*
 *
 * # O que isto PEDE ao vizinho, e o pedido vai em LISTA, nunca em commit lá (§4)
 *
 * Ao Generate: **estreitar o `Interpolador` para o que ele produz**, ou declarar os cinco como
 * **aspiracionais** no próprio tipo. Ao Parcelamento: nada — ele já está no conjunto fechado.
 */

/** O conjunto FECHADO, e é esta linha que a trava cobra. */
export const INTERPOLADORES_ACEITOS = ["bilinear", "idw"] as const;
export type Interpolador = (typeof INTERPOLADORES_ACEITOS)[number];

/** Os valores que o Generate declara hoje, medidos na ORIGEM dele em 11/10/2026. */
export const O_QUE_O_GENERATE_DECLARA = ["idw", "linear", "natural", "krigagem", "nenhum"] as const;

/** O que fica de fora, com o motivo por linha — *recusa sem motivo escrito volta por engano*. */
export const O_QUE_FICA_DE_FORA: readonly { valor: string; porque: string }[] = [
  {
    valor: "nenhum",
    porque:
      "ausência de interpolação já tem forma neste formato: `null`, que é 'não medido' (D23) — " +
      "aceitá-lo criaria duas formas de dizer a mesma coisa (D116)",
  },
  {
    valor: "linear",
    porque: "ninguém na família o implementa hoje: tipo sem produtor, e valor que ninguém produz ninguém confere",
  },
  {
    valor: "natural",
    porque: "idem: declarado no tipo do Generate e sem nenhum literal que o atribua, medido na origem",
  },
  {
    valor: "krigagem",
    porque: "idem — e é o que mais pede medição antes de entrar, porque muda o que a rampa quer dizer",
  },
] as const;

/** `"bilinear"` é apelido de `"idw"`? **Não**, e a resposta é medida (D37). */
export const BILINEAR_E_APELIDO_DE_IDW = false;

export interface ProblemaDoConjunto {
  tipo: "valor-fora-do-conjunto" | "apelido-indevido" | "sem-motivo";
  oQue: string;
}

/**
 * Um valor recebido é aceitável? **`null` é aceito** — é a forma de dizer *não medido*; o que não
 * se aceita é um nome novo entrando sem medição.
 */
export function conferirOInterpolador(valor: string | null): ProblemaDoConjunto[] {
  if (valor === null) return [];
  if ((INTERPOLADORES_ACEITOS as readonly string[]).includes(valor)) return [];
  const fora = O_QUE_FICA_DE_FORA.find((f) => f.valor === valor);
  return [
    {
      tipo: "valor-fora-do-conjunto",
      oQue:
        `\`${valor}\` não está no conjunto fechado (${INTERPOLADORES_ACEITOS.join(", ")})` +
        `${fora === undefined ? " e não está nem na lista de recusados, com motivo" : `: ${fora.porque}`}`,
    },
  ];
}
