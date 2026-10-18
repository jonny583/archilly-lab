/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O QUE FALTA MEDIR — a página pergunta ao código de cada casa, e não mais à data em que foi escrita. (LAB-168, item 900, D396)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md` nasceu no LAB-22 (03/10/2026) como **documento vivo para o chat levar aos
 * vizinhos** e não foi tocado desde o LAB-37 (04/10). Três arquivos de código o citavam — e nenhum perguntava o que ele
 * afirma: `frase-vencida.ts` só o usa como FONTE de uma frase velha de outro lugar, `numero-de-testes.ts` só declara o
 * trecho *"dois testes"*, e `inventario-das-pontes.ts` só aponta para ele. Espécie *mensagem fixa que afirma estado sem
 * perguntar*, e dirigida a outras casas: o que ela diz errado vira pedido errado no repositório de alguém.
 *
 * Remedido linha a linha em 18/10/2026 (Generate `8d5c0b0`, Laboratório de Parcelamento `5e279ac`):
 *
 * | o que a página dizia | medido | quem |
 * |---|---|---|
 * | Parcelamento: *"o passo é fixo em 12 pedaços por via (`AMOSTRAS_POR_VIA = 12`)"*, *"o que falta, de verdade"* | **falso desde 03/10/2026, o mesmo dia da página**: o T-11 deles (`3702828`) trocou a contagem fixa por `PASSO_DE_AMOSTRA_M = 5` e `ceil(comprimento / passo)` — exatamente a sugestão | Parcelamento |
 * | Generate (ortogonal e espinha): *"não mede, e o campo está lá"*, *"o que falta: o cálculo"* | **falso desde antes de a página nascer**: o `paraSaida` deles mede a rampa desde 02/10/2026 (`5b70e5f`, *"as três coisas que o Laboratório pediu"*) quando recebe `relevo` — e **a ponte do Lab não o passa** (`motores/generate.ts`). É a quarta vez da história do §1-A, agora no Generate | Lab |
 * | Parcelamento: *"cada variante sorteia ±30°"* | **o dobro do código**: `(r() - 0.5) * Math.PI / 6`, com `r` em [0, 1), é **±15°** (uma janela de 30°), assim desde 10/09/2026 | Lab (a conta) |
 * | §1-C: *"A ponte do Lab ignora as duas e escreve `motor-testfit`… continua sendo a minha etiqueta"* | **falso desde o LAB-29** (D117): a volta importa `MOTOR_NOME` e `MOTOR_VERSAO` do motor | Lab |
 * | §1-C: *"`MOTOR_VERSAO` em `1.0`"* | verdadeiro, ainda | Parcelamento |
 *
 * # O que esta trava pergunta
 *
 * Cada afirmação de {@link AS_AFIRMACOES} é uma pergunta a UM arquivo de código de UMA casa, que responde sim ou não; a
 * página tem de trazer o trecho da resposta de hoje (`seSim` ou `seNao`) **fora de riscado** — e o trecho velho de cada
 * uma (`velhas`), se aparecer, só **dentro** de `~~…~~`. Riscar, não apagar: a página é lida por quem já recebeu o
 * pedido velho, e precisa ver o que mudou.
 *
 * As da casa `lab` são do portão sem clones; as do `generate` e do `parcelamento` leem o clone vizinho e moram no verde
 * completo (`o-que-falta-medir-com-clone.test.ts`) — sem o clone, reprova (D124).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const A_PAGINA = "docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md";

export type Casa = "lab" | "generate" | "parcelamento";

/** Onde mora cada casa, a partir da raiz do Lab. */
export const DIRETORIO_DA_CASA: Readonly<Record<Casa, string>> = {
  lab: ".",
  generate: join("..", "urban-create-hub-41d93a4d"),
  parcelamento: join("..", "motor-testfit"),
};

export interface Afirmacao {
  id: string;
  casa: Casa;
  /** O arquivo de código que responde, relativo à casa. */
  arquivo: string;
  /** A pergunta, em uma frase, para quem lê a falha. */
  pergunta: string;
  responde: (codigo: string) => boolean;
  /** O trecho que a página tem de trazer, fora de riscado, quando a resposta é sim. */
  seSim: string;
  /** Idem, quando a resposta é não. */
  seNao: string;
  /** Trechos que já foram verdade e não são mais: só podem aparecer riscados. */
  velhas: readonly string[];
}

/** Tira os comentários de linha e de bloco — para a pergunta não ser respondida por um comentário. */
export function semComentarios(codigo: string): string {
  return codigo.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1");
}

/** O corpo de uma chamada `nome(…)`, pelo balanço dos parênteses; `null` se não há. */
export function corpoDaChamada(codigo: string, nome: string): string | null {
  const i = codigo.search(new RegExp(`\\b${nome}\\s*\\(`));
  if (i < 0) return null;
  const abre = codigo.indexOf("(", i);
  let nivel = 0;
  for (let j = abre; j < codigo.length; j++) {
    if (codigo[j] === "(") nivel++;
    else if (codigo[j] === ")" && --nivel === 0) return codigo.slice(abre + 1, j);
  }
  return null;
}

/** A amplitude, em graus, de `(r() - 0.5) * <expr>` na função `variacaoAngular` — `null` se a forma mudou. */
export function amplitudeDaVariacaoGraus(codigo: string): number | null {
  const c = semComentarios(codigo);
  const f = c.match(/function\s+variacaoAngular\s*\([^)]*\)[^{]*\{([\s\S]*?)\n\}/);
  if (!f) return null;
  const m = f[1]!.match(/:\s*Math\.PI\s*\/\s*(\d+(?:\.\d+)?)\s*;/);
  if (!m) return null;
  if (!/\(\s*r\(\)\s*-\s*0\.5\s*\)\s*\*\s*variacaoAngular\(/.test(c)) return null;
  return 180 / Number(m[1]) / 2;
}

export const AS_AFIRMACOES: readonly Afirmacao[] = [
  {
    id: "generate-recebe-o-relevo-do-lab",
    casa: "lab",
    arquivo: "external-engines/esteira/src/motores/generate.ts",
    pergunta: "a ponte do Lab passa `relevo` ao `paraSaida` do Generate?",
    responde: (c) => /\brelevo\s*:/.test(corpoDaChamada(semComentarios(c), "paraSaida") ?? ""),
    seSim: "a ponte do Lab passa o relevo ao `paraSaida` de vocês",
    seNao: "a ponte do Lab não passa o relevo ao `paraSaida` de vocês",
    velhas: [],
  },
  {
    id: "identidade-do-parcelamento-vem-do-motor",
    casa: "lab",
    arquivo: "external-engines/testfit/adapter/src/volta.ts",
    pergunta: "a volta do Laboratório de Parcelamento escreve `MOTOR_NOME` e `MOTOR_VERSAO` do motor?",
    responde: (c) => {
      const s = semComentarios(c);
      return /import\s*\{[^}]*\bMOTOR_NOME\b[^}]*\}\s*from\s*["']@testfit\/contrato\/tipos\.ts["']/.test(s) &&
        /\bnome\s*:\s*MOTOR_NOME\b/.test(s) && !/["']motor-testfit["']/.test(s);
    },
    seSim: "a volta do Lab escreve o `MOTOR_NOME` e o `MOTOR_VERSAO` de vocês desde o LAB-29",
    seNao: "a volta do Lab não escreve o `MOTOR_NOME` de vocês",
    velhas: ["A ponte do Lab ignora as duas", "continua sendo **a minha etiqueta, não a sua**"],
  },
  {
    id: "a-ficha-diz-a-amplitude-certa",
    casa: "lab",
    arquivo: "external-engines/esteira/src/porta/porta.ts",
    pergunta: "a ficha de capacidades diz ±15° (e não ±30°) para o sorteio do ângulo?",
    responde: (c) => c.includes("±15°") && !c.includes("±30°"),
    seSim: "a ficha de capacidades do Lab diz ±15°",
    seNao: "a ficha de capacidades do Lab ainda diz ±30°",
    velhas: [],
  },
  {
    id: "generate-mede-a-rampa-com-relevo",
    casa: "generate",
    arquivo: "src/lib/contratos/motor-v1/traducao.ts",
    pergunta: "o `paraSaida` do Generate aceita `relevo` e mede a rampa de cada via com `rampaDaVia`?",
    responde: (c) => {
      const s = semComentarios(c);
      return /\brelevo\?\s*:\s*ModeloRelevo\b/.test(s) && /rampaDaVia\s*\(\s*v\.pontos\s*,\s*o\.relevo\s*\)/.test(s);
    },
    seSim: "o `paraSaida` de vocês mede a rampa de cada via quando recebe `relevo`",
    seNao: "o `paraSaida` de vocês não mede a rampa",
    velhas: ["**não mede, e o campo está lá**", "**O que falta:** o cálculo", "O pedido não é mudar o `null` — é medir"],
  },
  {
    id: "parcelamento-amostra-por-metro",
    casa: "parcelamento",
    arquivo: "src/lib/lab/relevo.ts",
    pergunta: "o relevo do Parcelamento amostra por METRO (`PASSO_DE_AMOSTRA_M`), sem contagem fixa por via?",
    responde: (c) => {
      const s = semComentarios(c);
      return /export const PASSO_DE_AMOSTRA_M\s*=\s*\d/.test(s) && !/AMOSTRAS_POR_VIA/.test(s) &&
        /Math\.ceil\(\s*comprimento\s*\//.test(s);
    },
    seSim: "o passo de vocês é em metros desde o T-11",
    seNao: "o passo de vocês não é em metros",
    velhas: ["**O passo de amostragem é fixo em 12 pedaços por via**", "**O que falta, de verdade:** uma coisa só"],
  },
  {
    id: "parcelamento-sorteia-quinze-graus",
    casa: "parcelamento",
    arquivo: "src/lib/lab/motor.ts",
    pergunta: "o `variacaoAngular` do Parcelamento dá ±15° em cima do ângulo base?",
    responde: (c) => amplitudeDaVariacaoGraus(c) === 15,
    seSim: "cada variante sorteia **±15°** em cima dele",
    seNao: "o sorteio do ângulo de vocês não é mais ±15°",
    velhas: ["cada variante sorteia **±30°** em cima dele", "sortear ±30° em cima de uma intenção explícita"],
  },
  {
    id: "parcelamento-versao-um",
    casa: "parcelamento",
    arquivo: "src/lib/lab/contrato/tipos.ts",
    pergunta: "o `MOTOR_VERSAO` do Parcelamento ainda é \"1.0\"?",
    responde: (c) => /export const MOTOR_VERSAO\s*=\s*"1\.0"/.test(semComentarios(c)),
    seSim: "O `MOTOR_VERSAO` de vocês continua em **`1.0`**",
    seNao: "O `MOTOR_VERSAO` de vocês subiu",
    velhas: [],
  },
];

/** O texto sem os trechos riscados (`~~…~~`, que podem atravessar linha), e com o espaço normalizado. */
export function foraDoRiscado(texto: string): string {
  return normalizar(texto.replace(/~~[\s\S]*?~~/g, " "));
}

export function normalizar(t: string): string {
  return t.replace(/\s+/g, " ");
}

export type TipoDeProblema =
  | "pagina-ausente"
  | "arquivo-ausente"
  | "resposta-de-hoje-ausente"
  | "resposta-contraria-presente"
  | "frase-velha-sem-riscar"
  | "afirmacao-sem-trava-citada"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  afirmacao: string;
  detalhe: string;
}

export interface Resultado {
  afirmacoes: number;
  respostas: Record<string, boolean>;
  problemas: Problema[];
}

/**
 * Confere a página contra as afirmações dadas, com o código de cada uma lido por `ler` (relativo à raiz do Lab;
 * `null` = ausente). Função pura sobre `ler`, para o teste montar a árvore que quiser.
 */
export function conferir(
  pagina: string | null,
  afirmacoes: readonly Afirmacao[],
  ler: (casa: Casa, arquivo: string) => string | null,
): Resultado {
  const problemas: Problema[] = [];
  const respostas: Record<string, boolean> = {};
  if (pagina === null) {
    return { afirmacoes: afirmacoes.length, respostas, problemas: [{ tipo: "pagina-ausente", afirmacao: "—", detalhe: A_PAGINA }] };
  }
  if (afirmacoes.length === 0) {
    problemas.push({ tipo: "universo-vazio", afirmacao: "—", detalhe: "nenhuma afirmação para perguntar" });
  }
  const vivo = foraDoRiscado(pagina);
  if (!vivo.includes("o-que-falta-medir.ts")) {
    problemas.push({ tipo: "afirmacao-sem-trava-citada", afirmacao: "—", detalhe: "a página não aponta a trava que a pergunta" });
  }
  for (const a of afirmacoes) {
    const codigo = ler(a.casa, a.arquivo);
    if (codigo === null) {
      problemas.push({ tipo: "arquivo-ausente", afirmacao: a.id, detalhe: `${a.casa}: ${a.arquivo}` });
      continue;
    }
    const sim = a.responde(codigo);
    respostas[a.id] = sim;
    const hoje = normalizar(sim ? a.seSim : a.seNao);
    const contraria = normalizar(sim ? a.seNao : a.seSim);
    if (!vivo.includes(hoje)) {
      problemas.push({ tipo: "resposta-de-hoje-ausente", afirmacao: a.id, detalhe: `${a.pergunta} → ${sim ? "sim" : "não"}; a página não diz "${hoje}"` });
    }
    if (vivo.includes(contraria)) {
      problemas.push({ tipo: "resposta-contraria-presente", afirmacao: a.id, detalhe: `a página diz "${contraria}", sem riscar` });
    }
    for (const v of a.velhas) {
      if (vivo.includes(normalizar(v))) {
        problemas.push({ tipo: "frase-velha-sem-riscar", afirmacao: a.id, detalhe: `"${v}"` });
      }
    }
  }
  return { afirmacoes: afirmacoes.length, respostas, problemas };
}

/** Lê do disco: a página do Lab, e o código das casas pedidas (as outras ficam fora da conferência). */
export function conferirNoDisco(raizDoLab: string, casas: readonly Casa[]): Resultado {
  const p = join(raizDoLab, A_PAGINA);
  const pagina = existsSync(p) ? readFileSync(p, "utf8") : null;
  const escolhidas = AS_AFIRMACOES.filter((a) => casas.includes(a.casa));
  return conferir(pagina, escolhidas, (casa, arquivo) => {
    const f = join(raizDoLab, DIRETORIO_DA_CASA[casa], arquivo);
    return existsSync(f) ? readFileSync(f, "utf8") : null;
  });
}

export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "os NÚMEROS medidos da página (picos de rampa, aderências, contagens de lote): são medição datada do prompt que os escreveu, não estado — não se refazem a cada verde",
  "se os vizinhos LERAM a página: o que a página afirma é perguntado; se o chat a levou, não",
  "afirmação nova escrita na página sem entrar em AS_AFIRMACOES: a trava pergunta o que lista, e não descobre frase",
  "um `//` no meio de um texto entre aspas (não logo depois da aspa nem de dois-pontos) é lido como comentário e corta o resto da linha: a pergunta pode responder 'não' por isso — o lado seguro, porque a página reprova",
  "a forma de cada pergunta é uma expressão sobre o código de hoje: se o vizinho reescrever a função com outro nome, a pergunta responde 'não' e a página reprova — o que é o lado seguro, mas não é uma resposta sobre o comportamento",
];
