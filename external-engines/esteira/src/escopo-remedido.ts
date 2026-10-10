/**
 * O ESCOPO das provas que o LAB-79 passou a REMEDIR DA FONTE — publicado como DADO. (item 012)
 *
 * # Por que este arquivo existe
 *
 * O LAB-49 deu escopo publicado a **duas** provas (`escopo-do-detector.ts`). O LAB-79 mediu o
 * universo e achou **sessenta e sete**, das quais **vinte e quatro não eram lidas por trava
 * nenhuma** e **vinte e três só tinham a §7** conferindo que as chaves existem — *forma, não
 * número*.
 *
 * > **Lista que cresce é dívida visível. Trava que confere consigo mesma é dívida invisível — e
 * > ela sai VERDE.**
 *
 * Este arquivo acrescenta **cinco**, escolhidas por um critério declarado e não por gosto: são as
 * provas cujos números saem de **módulos deste repositório**, sem clone vizinho e sem motor —
 * portanto remedíveis dentro da trava, de graça, a cada verde.
 *
 * # A mesma régua do LAB-49, e as mesmas quatro palavras
 *
 * `medida` — a trava a reconfere **contra quem a produz** (D144).
 * `declarada` — etiqueta do prompt (nome, data, chão); conferi-la seria conferir texto.
 * `medidaEmParte` — parte é reconferida, e o texto diz **qual** e qual não.
 * `naoMedida` — **com o MOTIVO**, e o motivo é sempre custo ou dependência, nunca comodidade.
 *
 * **Cada `medida` daqui é implementada na trava `tests/alcance-das-provas.test.ts`.** Declaração
 * que diz `medida` e não remede nada é a dívida invisível com mais código — exatamente o que este
 * prompt existe para fechar.
 */
export const ESCOPO_REMEDIDO: Record<string, Record<string, "medida" | "declarada" | string>> = {
  "item-003/escopo-dos-instrumentos.json": {
    prompt: "declarada",
    quando: "declarada",
    aPergunta: "declarada",
    oQueIstoMede: "declarada",
    ondeLer: "declarada",
    oEscopo:
      "medidaEmParte: `verificacoes`, `naIntersecao`, `soDaFerramenta` e `soDaTrava` são " +
      "RECONTADOS de `VERIFICACOES`, `aIntersecao()` e `soDa()`; a sub-chave `oAchadoDaConta` é " +
      "frase declarada, e redigitá-la aqui criaria a segunda cópia que o D116 proíbe",
    asQuatroSabotagens:
      "naoMedida: é o registro das quatro sabotagens RODADAS contra o `RECADOS.md` real — " +
      "refazê-lo é sabotar o arquivo de novo, e o conteúdo é EVENTO, não estado",
    oQueNinguemPega: "medida: recontado de `O_QUE_NINGUEM_PEGA`, inteiro",
    aLarguraDaDivergencia: "naoMedida: refazê-la é rodar a ferramenta contra o `RECADOS.md` inteiro — o `bun run lab70`",
    quantasDivergiram: "naoMedida: mesma execução da ferramenta",
    quaisDivergiram: "naoMedida: mesma execução da ferramenta",
    aGuardaREPROVA: "naoMedida: é o registro das sabotagens RODADAS; refazê-lo é sabotar o arquivo de novo",
    oNomeQueNaoSeSupoe: "declarada",
    oRecadosVoltouAoQueEra: "naoMedida: afirma o estado do arquivo ao fim daquela rodada — é EVENTO",
    problemas: "medida: a lista tem de continuar vazia, e a trava a reconfere pela própria conferência do escopo",
  },
  "item-004/conta-dos-disparos.json": {
    prompt: "declarada",
    quando: "declarada",
    aPergunta: "declarada",
    oQueIstoMede: "declarada",
    oIdNaoSeSupoe: "declarada",
    aConta:
      "medidaEmParte: os TOTAIS — quantos disparos e quantos em vazio — são RELIDOS do " +
      "`ONDE_PARAMOS.md` com o `lerAConta`, que é quem os produz; o texto de cada linha não. " +
      "**É a prova mais viva do repositório**, porque a conta cresce a cada disparo — e foi " +
      "exatamente ela que a trava nova pegou VELHA na primeira execução: dizia 5 disparos e 1 em " +
      "vazio, e a conta viva dizia 14 e 4",
    osDaCAIXA: "naoMedida: é o texto de cada linha da conta, e conferi-lo seria conferir texto",
    oPrecedenteDaFILA: "naoMedida: afirma o que a `FILA.md` dizia naquele dia — é EVENTO",
    oQuartoNumeroQueFicaDEFORA: "declarada",
    oQueOPrimeiroDiaJaMOSTROU: "naoMedida: é a leitura do primeiro dia, e reler hoje troca o sujeito",
    aGuardaREPROVA: "naoMedida: registro das sabotagens rodadas",
    problemas: "medida: tem de continuar vazia",
  },
  "LAB-76/registro-de-motores.json": {
    prompt: "declarada",
    quando: "declarada",
    oChao: "declarada",
    oQueIstoMede: "declarada",
    oQueIstoNaoMede: "declarada",
    porQueOSymbiosFicaForaDoLote: "declarada",
    padrao: "medida: reconferido contra `PADRAO_DE_FABRICA`, que é o ÚNICO nome do padrão nesta casa",
    universo: "medida: recontado com `universoLido` sobre o dado `dados/registro-de-motores.json`",
    motoresDeLote: "medida: reconferido contra `MOTORES_DE_LOTE`",
    conferencia: "medida: a conferência é REFEITA com `conferirORegistro` sobre o dado de hoje",
    versoes: "naoMedida: a versão do `parcelamento` é lida do clone vizinho por `@testfit` — precisa do clone, e o verde completo já o exige; aqui ficaria caro de graça",
    procedencia: "naoMedida: exige `git fetch` nos clones vizinhos — rede, e a trava não faz rede",
    osClonesVizinhos: "naoMedida: mesma razão da procedência",
  },
  "LAB-77/acesso-sugerido.json": {
    prompt: "declarada",
    quando: "declarada",
    oChao: "declarada",
    oQueIstoMede: "declarada",
    oQueIstoNaoMede: "declarada",
    porQueEssaFaixa: "declarada",
    oAchado: "declarada",
    asRegrasDoJonny: "medida: as cinco regras são recontadas de `REGRAS_DO_ACESSO`, com a marca de cada uma",
    aReguaDaFaixa: "medida: reconferida contra `REGUA_DA_FAIXA`",
    qualFaixaFoiUsada: "medida: reconferida contra `FAIXA_EM_USO_m`",
    quantasGlebas: "naoMedida: recontar as declarações das sete glebas exige `glebaDoLab`, que lê o clone vizinho",
    declaracoes: "naoMedida: mesma razão",
    limites: "naoMedida: o teto da faixa sai da geometria das sete glebas — mesma razão",
    varridas: "naoMedida: mesma razão",
    aSugestao: "medidaEmParte: que ela se RECUSA a sair é reconferido chamando `sugerirAcesso(null, …)`; os números das candidatas não",
  },
  "LAB-78/setimo-mecanismo.json": {
    prompt: "declarada",
    quando: "declarada",
    oChao: "declarada",
    oQueIstoMede: "declarada",
    gleba: "declarada",
    motor: "declarada",
    semente: "declarada",
    contrato: "declarada",
    contato_m: "medida: reconferido contra `CONTATO_m`",
    vereditos: "medidaEmParte: o VOCABULÁRIO de cada veredicto é reconferido contra `VEREDICTOS` e `DONOS`, e o veredicto de cada lote é REFEITO com `deQuemEhAViolacao` sobre os `acusados` gravados; as distâncias não",
    conta: "medida: a conta é REFEITA com `contarOsVereditos` sobre os vereditos gravados, e `aContaFecha` tem de dar verdadeiro",
    acusados: "naoMedida: as distâncias em metros exigem o motor rodando no clone vizinho — e, pior, o plano MUDA com o commit dele (é o achado do LAB-79)",
    aFaixa: "naoMedida: a geometria da faixa sai do clone do Generate",
    naoAchados: "naoMedida: afirma quais lotes não existiam NAQUELE commit do motor — é estado de OUTRO repositório",
  },
};
