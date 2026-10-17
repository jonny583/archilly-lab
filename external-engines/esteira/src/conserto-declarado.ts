/**
 * O CONSERTO DO LAB SAI DITO NA MEDIÇÃO — e o do Symbios saía calado. (LAB-142, item 900, a dívida
 * própria, D370)
 *
 * # A regra, e o que estava sem guarda
 *
 * O `CLAUDE.md` §4 diz, numa linha só:
 *
 * > *"**Não conserta geometria em silêncio:** conserto declarado, desligado por padrão, medido nas
 * > duas passagens."*
 *
 * São **três** cláusulas, e a casa tem **dois** consertos de geometria: o **aparo** das vias do
 * Laboratório de Parcelamento (`testfit/adapter/src/aparo.ts`, LAB-07) e o **recorte** do Symbios
 * (`symbios/adapter/src/recorte.ts`, LAB-05 — a lasca da D48 e a quadra que atravessa a divisa).
 * A guarda do LAB-36 (`tests/regras.test.ts`, *"§4 · conserto do Lab vem DESLIGADO por padrão"*)
 * cobra **duas das seis casas**: o aparo desligado e o aparo declarado. Medido por mutação, com a
 * suíte inteira (17/10/2026, nesta máquina, sem o `.wasm`):
 *
 * | cláusula | aparo (Parcelamento) | recorte (Symbios) |
 * |---|---|---|
 * | declarado | trava do LAB-36 (*"o Lab aparou"*) | **nenhuma declaração existe** — o `rodarSymbios` liga os dois consertos e o `naoSoubeFazer` não diz nada deles |
 * | desligado por padrão | trava do LAB-36 | trava do LAB-05 (`poligono.test.ts`), que **depende do `.wasm`** — sem ele, acusada só pela contagem de bytes do LAB-52 |
 * | duas passagens | **sem trava** — `semAparo` deixado nulo passou a suíte inteira | medida no LAB-05 (`ferramentas/lab05.ts`, o `bruto` e o `bis`) |
 *
 * A casa do recorte declarado não era *"regra sem guarda"*: era **regra descumprida** — o motor da
 * comparação saía com as quadras recortadas e as lascas descartadas sem uma linha dizendo isso (o
 * próprio cabeçalho de `motores/symbios.ts` diz o que o conserto muda em `geo-antonina`). O aparo, ao
 * lado, sempre disse.
 *
 * # O que este módulo faz
 *
 * Uma função pura, {@link oQueORecorteConsertou}, que lê os contadores que o recorte **já** publica
 * (`lascasDescartadas`, `quadrasRecortadas`, `quadrasQueNaoRecortaram`) e devolve as linhas do
 * `naoSoubeFazer` — a mesma moldura do aparo. **Contador zero, linha nenhuma**: conserto que não
 * aconteceu não se declara, como o aparo, que só fala com `cortado > 0`.
 *
 * Pura de propósito: o `rodarSymbios` precisa do `.wasm` para rodar, e a trava desta regra não
 * pode depender dele (o `.wasm` falta nesta máquina, e as nove reprovações da linha de base são dele).
 *
 * # O que ela NÃO cobra, dito
 *
 * - **se o conserto devia estar ligado**: ligá-lo na comparação é escolha declarada no cabeçalho de
 *   `motores/symbios.ts`, e a regra permite ligar — proíbe ligar calado;
 * - **o número contra uma rodada de verdade do Symbios**: sem o `.wasm` não há rodada; a trava cobra
 *   a função com contadores montados à mão e que o `rodarSymbios` a chama;
 * - **as provas antigas** (`docs/provas/LAB-13`, `LAB-19`, `LAB-06`): são história, gravadas antes;
 *   a declaração vale da próxima rodada da comparação em diante.
 */
import type { ResultadoRecorte } from "@symbios/recorte.ts";

/** Os contadores do recorte que dizem o que o Lab consertou — e só eles. */
export type ContadoresDoConserto = Pick<
  ResultadoRecorte,
  | "lascasDescartadas"
  | "comprimentoDescartadoEmLascas_m"
  | "quadrasRecortadas"
  | "pecasDeQuadra"
  | "quadrasQueNaoRecortaram"
>;

/** O começo de toda linha que declara um conserto do Lab — o mesmo sujeito do aparo. */
export const SUJEITO_DO_CONSERTO = "o Lab ";

/**
 * As linhas que o `naoSoubeFazer` do Symbios leva quando o recorte consertou algo.
 *
 * Contador zero, linha nenhuma. A quadra que **não** recortou é perda (ela sai do desenho), e é
 * declarada com o mesmo sujeito: foi o conserto do Lab que a tirou.
 */
export function oQueORecorteConsertou(c: ContadoresDoConserto): string[] {
  const linhas: string[] = [];
  if (c.lascasDescartadas > 0) {
    linhas.push(
      `${SUJEITO_DO_CONSERTO}descartou ${c.lascasDescartadas} lasca(s) de corte ` +
        `(${c.comprimentoDescartadoEmLascas_m.toFixed(1)} m de eixo), mais curtas que o lado do ` +
        "lote mínimo — D48, LAB-05",
    );
  }
  if (c.quadrasRecortadas > 0) {
    linhas.push(
      `${SUJEITO_DO_CONSERTO}recortou ${c.quadrasRecortadas} quadra(s) que atravessavam a divisa, ` +
        `em ${c.pecasDeQuadra} peça(s) — LAB-05`,
    );
  }
  if (c.quadrasQueNaoRecortaram > 0) {
    linhas.push(
      `${SUJEITO_DO_CONSERTO}tirou ${c.quadrasQueNaoRecortaram} quadra(s) que atravessavam a divisa ` +
        "e o recorte não fechou — LAB-05",
    );
  }
  return linhas;
}
