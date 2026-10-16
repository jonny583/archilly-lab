/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PORTA DO MOTOR — tudo o que o resto da casa sabe do Laboratório de
 *  Parcelamento passa por aqui. (LAB-135, item 900, D363)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `CLAUDE.md` §3 diz *"`adapter/` é a única fronteira"*, e o `README.md` da raiz diz o que isso
 * quer dizer: *"Só ele conhece detalhes do motor. Trocar o motor não deve exigir mexer em nada fora
 * dessa pasta."* Até o LAB-135, **onze** arquivos fora do `adapter/` importavam o motor direto pelo
 * apelido `@testfit/` — três deles do código da esteira (`src/`). Trocar o motor exigia mexer neles.
 *
 * Agora eles importam **deste** arquivo, que só repassa. Nada aqui é tradução: é a lista, num lugar
 * só, do que a casa usa do motor sem passar pela ida e pela volta — e é o lugar que se mexe quando
 * o motor mudar o nome de uma dessas coisas.
 *
 * | o que | quem usa fora do adaptador |
 * |---|---|
 * | `rodarMotor` | a guarda em ação (LAB-25), a trava da ida, a ferramenta de medida |
 * | `impressao` | as passagens dos campos legais (LAB-93) |
 * | `MOTOR_NOME`, `MOTOR_VERSAO` | a porta (LAB-14), a trava de identidade, o LAB-76 |
 * | `distanciaSegmento`, `distanciaAoPoligono`, `pontoEmPoligono` | as ferramentas LAB-55, LAB-58, LAB-59 e a de medida |
 *
 * A trava é `external-engines/esteira/src/adapter-unica-fronteira.ts`: arquivo fora de um
 * `adapter/` que importa o motor reprova.
 */
export { rodarMotor, impressao } from "@testfit/api.ts";
export { MOTOR_NOME, MOTOR_VERSAO } from "@testfit/contrato/tipos.ts";
export { distanciaSegmento, distanciaAoPoligono, pontoEmPoligono } from "@testfit/geo.ts";
