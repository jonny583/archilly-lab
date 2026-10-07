/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A VARREDURA DAS CONFIGURAÇÕES — quem desliga conferência sem avisar. (LAB-57)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-52 achou que os dois `eslint.config.js` traziam `projectService: false`, e que
 * **sem serviço de projeto toda regra que precisa de tipo fica MUDA — não avisa, não
 * reclama, simplesmente não roda** (D178). O chat pediu o resto da varredura: *existe
 * OUTRA configuração neste repositório que desliga conferência sem avisar?*
 *
 * # As três formas, e só a primeira é a óbvia
 *
 * 1. **a regra DESLIGADA** — `projectService: false`, `strict: false`, `"off"`. É a do
 *    D178, e é a que se procura primeiro;
 * 2. **a regra LIGADA QUE NÃO PODE REPROVAR** — `"warn"` num lint rodado sem
 *    `--max-warnings 0`. Ela aparece na saída, ninguém lê, e o passo sai verde;
 * 3. **o desligador SEM MOTIVO ESCRITO** — `skipLibCheck: true` numa linha sob um
 *    comentário que explica **outros dois flags**. Quem lê presume que o comentário cobre
 *    a linha de baixo, e o desligador atravessa sem declaração.
 *
 * A terceira é a mais escorregadia porque **não é falsa**: é silenciosa. É a forma do
 * D104 aplicada a configuração, e a razão de esta varredura existir em vez de uma leitura
 * à mão.
 *
 * # O que o LAB-60 achou AQUI, apontando esta régua para OUTRO repositório
 *
 * **Este cabeçalho prometia `"off"` desde o LAB-57, e nenhuma das seis regras o
 * procurava.** A promessa só foi desmentida quando a régua foi apontada ao clone do
 * motor: ela disse *"zero regras desligadas"* num `eslint.config.js` que traz
 * `"@typescript-eslint/no-unused-vars": "off"` escrito em uma linha.
 *
 * E a mesma viagem achou a segunda: `regra-em-warn` exigia a string **solta** depois dos
 * dois pontos, e **a forma de array é a normal quando a regra tem opção** — então
 * `["warn", { … }]` passava invisível.
 *
 * > **Régua que nunca saiu de casa não sabe o que não vê.** As duas eram falso NEGATIVO,
 * > a espécie que o D164 descreve: zero de régua parada é indistinguível de zero de
 * > árvore limpa.
 *
 * As duas foram consertadas no LAB-60, e o conserto achou **dois desligadores neste
 * repositório** que seis regras não tinham visto.
 *
 * # Qual limpeza cada pergunta pede — e o LAB-56 pagou para aprender
 *
 * O D179 criou duas funções e escreveu para que servem. **No LAB-56 eu peguei a errada**,
 * um prompt depois: `soOCodigo()` **esvazia o conteúdo das strings**, e a nota que eu
 * precisava examinar **era uma string**. A sabotagem passou por isso.
 *
 * > **`soOCodigo()` responde "o código FAZ isto?". `semComentarios()` responde "o texto
 * > DECLARA isto?". Ter as duas não basta: a PERGUNTA decide qual delas.**
 *
 * Aqui a pergunta é quase sempre a segunda — configuração é **declaração** —, então cada
 * regra diz, no campo `limpeza`, qual usa e por quê. Regra que não declara a limpeza é
 * regra que não sabe o que está medindo.
 */

import { semComentarios } from "./varredura-de-chamadas.ts";

/** Onde a regra procura, e com que limpeza. */
export type Limpeza = "cru" | "semComentarios";

export interface AchadoDeConfiguracao {
  regra: string;
  arquivo: string;
  linha: number;
  trecho: string;
}

export interface RegraDeConfiguracao {
  nome: string;
  /** Qual das três formas do cabeçalho esta regra persegue. */
  forma: "desligada" | "nao-pode-reprovar" | "sem-motivo-escrito";
  /** O que ela casa. */
  oQue: string;
  /** O que ela NÃO pega — sem isto a regra promete tudo. */
  oQueNaoPega: string;
  /** Quais arquivos ela examina, por sufixo de caminho. */
  arquivos: readonly string[];
  limpeza: Limpeza;
  /** Por que esta limpeza, e não a outra. */
  porqueEssaLimpeza: string;
  padrao: string;
  sinais: string;
  /** Um texto que a regra TEM de pegar — a trava exercita cada um. */
  exemploQuePega: () => string;
}

const linhaDe = (texto: string, i: number) => texto.slice(0, i).split("\n").length;

/**
 * As SETE regras, como dado — eram seis até o LAB-60 acrescentar a `regra-em-off`.
 *
 * Tipo não existe em tempo de execução (D157, D171): a lista é dado para a trava poder
 * contá-la, exercitá-la uma a uma e reprovar regra sem exemplo.
 */
export const REGRAS_DE_CONFIGURACAO: readonly RegraDeConfiguracao[] = [
  {
    nome: "lint-sem-max-warnings",
    forma: "nao-pode-reprovar",
    oQue: 'script de `lint` que chama o eslint SEM `--max-warnings 0` — com ele ausente, toda regra em "warn" é incapaz de reprovar o passo',
    oQueNaoPega: "lint chamado por outro nome de script, e eslint invocado de dentro de um .ts",
    arquivos: ["package.json"],
    limpeza: "cru",
    porqueEssaLimpeza: "JSON não tem comentário; o valor do script É o texto que importa",
    padrao: String.raw`"lint"\s*:\s*"([^"]*eslint[^"]*)"`,
    sinais: "g",
    exemploQuePega: () => '{ "scripts": { "lint": "eslint ." } }',
  },
  {
    nome: "regra-em-warn",
    forma: "nao-pode-reprovar",
    oQue: 'regra de lint declarada com `"warn"`: ela aparece na saída e NÃO reprova, a menos que o script traga `--max-warnings 0`',
    oQueNaoPega: 'regra que vem em "warn" de dentro de um conjunto `recommended` — essa não está escrita aqui e esta régua não a vê',
    arquivos: ["eslint.config.js"],
    limpeza: "semComentarios",
    porqueEssaLimpeza:
      "a pergunta é o que a CONFIGURAÇÃO DECLARA, e a declaração mora na string: `semComentarios()` tira o comentário e PRESERVA a string (D179, e o erro do LAB-56)",
    // ── A FORMA DE ARRAY ENTROU NO LAB-60, e ela estava INVISÍVEL ──────────
    //
    // Apontada ao clone do motor, esta régua disse **zero regras em `"warn"`** — e o
    // `eslint.config.js` dele traz `"react-refresh/only-export-components": ["warn", {…}]`.
    // O padrão exigia a string SOLTA depois dos dois pontos, e a forma de array é a
    // normal quando a regra tem opção. *Régua que só vê uma das duas sintaxes da mesma
    // declaração mede ortografia, não conteúdo* (D137).
    padrao: String.raw`"([^"]+)"\s*:\s*(?:"warn"|\[\s*"warn")`,
    sinais: "g",
    exemploQuePega: () => 'rules: { "no-explicit-any": "warn" }',
  },
  {
    nome: "desligador-de-conferencia",
    forma: "desligada",
    oQue: "chave que DESLIGA conferência: `skipLibCheck`/`allowJs`/`projectService: false`/`strict: false`/`noImplicitAny: false`",
    oQueNaoPega: "desligador escrito com outro nome, e opção de compilador que afrouxa sem ser booleana",
    arquivos: ["tsconfig.json", "eslint.config.js"],
    limpeza: "semComentarios",
    porqueEssaLimpeza:
      "o comentário ao lado é exatamente o que NÃO conta: a pergunta é se a chave está declarada, não se alguém falou dela",
    padrao: String.raw`"(skipLibCheck|allowJs)"\s*:\s*true|"(strict|noImplicitAny|projectService|noEmitOnError)"\s*:\s*false|(projectService)\s*:\s*false`,
    sinais: "g",
    exemploQuePega: () => '{ "compilerOptions": { "skipLibCheck": true } }',
  },
  {
    nome: "regra-em-off",
    forma: "desligada",
    oQue: 'regra de lint declarada com `"off"` — ela não roda, não avisa e não reprova; é a forma 1 do cabeçalho, e até o LAB-60 NENHUMA regra desta lista a procurava',
    oQueNaoPega:
      'regra que nasce desligada dentro de um conjunto `recommended`, e regra desligada por comentário `eslint-disable` — essa é da `conferencia-desligada-por-arquivo`',
    arquivos: ["eslint.config.js"],
    limpeza: "semComentarios",
    porqueEssaLimpeza: "a pergunta é o que a configuração DECLARA, e a declaração mora na string (D179)",
    padrao: String.raw`"([^"]+)"\s*:\s*(?:"off"|\[\s*"off")`,
    sinais: "g",
    exemploQuePega: () => 'rules: { "no-undef": "off" }',
  },
  {
    nome: "passo-que-engole-falha",
    forma: "nao-pode-reprovar",
    oQue: "passo de verde que não propaga erro: `|| true`, `continue-on-error`, `--passWithNoTests`, `exit 0` depois de falha",
    oQueNaoPega: "`set -e` ausente de propósito, que é o caso do `conferir.sh` e está declarado — ele acumula e sai 1 no fim",
    arquivos: ["package.json", "conferir.sh", "verde.yml"],
    limpeza: "cru",
    porqueEssaLimpeza: "num script, o que engole a falha é o texto executado — comentário nenhum o desfaz",
    padrao: String.raw`\|\|\s*true|continue-on-error\s*:\s*true|--passWithNoTests|\|\|\s*exit\s+0`,
    sinais: "g",
    exemploQuePega: () => 'passo "x" dir bun test || true',
  },
  {
    nome: "teste-desligado",
    forma: "desligada",
    oQue: "`.only(`, `.skip(`, `.todo(`, `xdescribe`, `xit(` — e o `.only` é o pior: ele reduz a suíte a um teste e o resto sai VERDE por não ter rodado",
    oQueNaoPega: "teste desligado por `if (...) return` no corpo, que nenhum padrão de nome alcança",
    arquivos: [".test.ts"],
    limpeza: "cru",
    porqueEssaLimpeza:
      "aqui a pergunta é a PRIMEIRA — o código FAZ isto? —, mas `soOCodigo()` apagaria o nome do teste e não o `.only`; o padrão casa a CHAMADA, que sobrevive às duas limpezas",
    padrao: String.raw`\b(?:describe|test|it)\.(only|skip|todo)\s*\(|\bx(?:describe|it)\s*\(`,
    sinais: "g",
    exemploQuePega: () => 'test.only("um só", () => {});',
  },
  {
    nome: "conferencia-desligada-por-arquivo",
    forma: "sem-motivo-escrito",
    oQue: "`@ts-ignore`, `@ts-nocheck` ou `eslint-disable` — o desligador de UMA linha, que não aparece em configuração nenhuma",
    oQueNaoPega: "`@ts-expect-error`, que REPROVA quando o erro deixa de existir e por isso não envelhece em silêncio",
    arquivos: [".ts", ".js"],
    limpeza: "cru",
    porqueEssaLimpeza: "ele VIVE num comentário: tirar os comentários antes cegaria a régua por completo",
    padrao: String.raw`@ts-ignore|@ts-nocheck|eslint-disable`,
    sinais: "g",
    exemploQuePega: () => "// @ts-ignore\nconst x: number = 'a';",
  },
] as const;

/**
 * O contexto que decide se um achado é acusação ou registro.
 *
 * `lintReprovaAviso` é o par do `regra-em-warn`: uma regra em `"warn"` **pode** reprovar
 * quando o script do lint traz `--max-warnings 0`. Sem esse par, a mesma linha de
 * configuração significa duas coisas opostas — e **qual delas é medida, não opinada.**
 */
export interface ContextoDaVarredura {
  lintReprovaAviso?: boolean;
}

/** Varre UM arquivo com as regras que o examinam. */
export function varrerConfiguracao(
  texto: string,
  arquivo: string,
  contexto: ContextoDaVarredura = {},
): { achados: AchadoDeConfiguracao[]; regrasQueOlharam: string[] } {
  const achados: AchadoDeConfiguracao[] = [];
  const regrasQueOlharam: string[] = [];
  for (const regra of REGRAS_DE_CONFIGURACAO) {
    if (!regra.arquivos.some((suf) => arquivo.endsWith(suf))) continue;
    regrasQueOlharam.push(regra.nome);
    const alvo = regra.limpeza === "semComentarios" ? semComentarios(texto) : texto;
    for (const m of alvo.matchAll(new RegExp(regra.padrao, regra.sinais))) {
      // O `lint-sem-max-warnings` só acusa quando a bandeira NÃO está lá.
      if (regra.nome === "lint-sem-max-warnings" && /--max-warnings\s+0/.test(m[1] ?? "")) continue;
      // E o `regra-em-warn` deixa de acusar quando o lint do pacote REPROVA aviso: aí a
      // regra em `"warn"` é capaz de derrubar o passo, e a forma "não pode reprovar"
      // deixou de existir. O par é medido pelo chamador, não presumido aqui.
      if (regra.nome === "regra-em-warn" && contexto.lintReprovaAviso === true) continue;
      achados.push({
        regra: regra.nome,
        arquivo,
        linha: linhaDe(alvo, m.index),
        trecho: (m[0] ?? "").slice(0, 80),
      });
    }
  }
  return { achados, regrasQueOlharam };
}
