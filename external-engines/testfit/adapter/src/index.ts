/**
 * O adaptador do LAB-07 — o motor do Testfit na esteira do contrato de motor v1.
 *
 * Três peças, em ordem de uso:
 *
 * | peça | o que faz |
 * |---|---|
 * | `idaParaOMotor` | ENTRADA do contrato → entrada do motor, com as perdas da ida |
 * | `voltaParaOContrato` | `Plano` do motor → SAÍDA do contrato, com as perdas da volta |
 * | `rodarEsteira` | a cadeia inteira, já com o Validator e o Judge do Generate |
 *
 * Ver `external-engines/testfit/README.md` e `docs/relatorios/LAB-07.md`.
 */
export * from "./contrato-v1.ts";
export { idaParaOMotor, type ResultadoIda } from "./ida.ts";
export { voltaParaOContrato, type ResultadoVolta } from "./volta.ts";
export { apararVias, type ResultadoAparo } from "./aparo.ts";
export {
  rodarEsteira,
  CARIMBO_FIXO,
  VERSAO_MOTOR_MEDIDA,
  type OpcoesEsteira,
  type RodadaMedida,
  type VarianteMedida,
} from "./esteira.ts";
