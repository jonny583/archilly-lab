/**
 * O ESCOPO do detector de prova velha do LAB-49 — publicado como DADO.
 *
 * Mora aqui, e não dentro do teste, por um motivo medido: a lição do D164 é que
 * **escopo se publica como número**, e número que só existe dentro de um teste não
 * sai em prova nenhuma. Daqui ele serve às duas pontas — a trava
 * (`tests/prova-velha.test.ts`) e a ferramenta que o publica (`ferramentas/lab49.ts`).
 */

/**
 * A classificação de cada chave das duas provas. **É o escopo, publicado.**
 *
 * `medida` — a trava do LAB-49 (`tests/prova-velha.test.ts`) a reconfere contra a FONTE.
 * `declarada` — é etiqueta do prompt (nome, data), e conferi-la seria conferir texto.
 * `medidaEmParte` — parte dela é reconferida, e o texto diz QUAL parte e qual não.
 * `naoMedida` — com o MOTIVO, e o motivo é sempre custo ou dependência, nunca
 * comodidade. Cada uma destas é dívida visível, não omissão.
 */
export const ESCOPO_DO_DETECTOR: Record<string, Record<string, "medida" | "declarada" | string>> = {
  "LAB-25/guarda-da-ponte.json": {
    prompt: "declarada",
    geradoEm: "declarada",
    semente: "medida",
    contrato: "medida",
    pontesAuditadas: "medida",
    glebas: "medida",
    porRegra: "medidaEmParte: as CHAVES são reconferidas contra `REGRAS_DA_PONTE`, que é a lista de regras que a guarda sabe emitir; as CONTAGENS não, porque recontá-las é auditar as 2 pontes nas 5 glebas com os motores rodando — o `bun run lab25` inteiro",
    reprovamNoTotal: "naoMedida: mesma auditoria completa do `porRegra`; e o valor que importa (zero) tem trava própria na `guarda-da-ponte.test.ts`",
  },
  "LAB-30/guarda-da-ida.json": {
    prompt: "declarada",
    geradoEm: "declarada",
    semente: "medida",
    contrato: "medida",
    idasAuditadas: "medida",
    inventario: "medida",
    glebas: "medida",
    porRegra: "medidaEmParte: as CHAVES são reconferidas contra `REGRAS_DA_IDA`; as CONTAGENS não, porque recontá-las é o `bun run lab30` inteiro",
    reprovamNoTotal: "naoMedida: mesma auditoria completa; o zero tem trava própria na `guarda-da-ida.test.ts`",
    dividasDoLab: "naoMedida: mesma auditoria completa; a categoria está vazia desde o LAB-37 e a `guarda-da-ida.test.ts` cobre o caso",
    promessasQueNenhumaGlebaExercita: "naoMedida: mesma auditoria completa — e CUIDADO ao comparar com o \\\"6 → 0\\\" do LAB-40: ele mediu DEZ glebas, esta prova mede SETE",
  },
};
