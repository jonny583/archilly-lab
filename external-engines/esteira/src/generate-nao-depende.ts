/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O GENERATE NUNCA DEPENDE DISTO — perguntado ao GENERATE. (LAB-134, item 900, D362)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `CLAUDE.md` §3 fecha a regra de ouro por *"**O Generate nunca depende disto:**
 * `external-engines/` pode ser apagado."* A metade desta casa tem trava desde o LAB-06
 * (`entrega.test.ts`: nada de `entrega/` importa `external-engines/`). **A metade do Generate não
 * tinha nenhuma**: medido por mutação no LAB-134 — uma dependência `github:jonny583/archilly-lab`
 * no `package.json` dele, um `import` de `external-engines/esteira/src/forma.ts` no
 * `src/lib/contratos/motor-v1/index.ts` (o arquivo que esta casa compila) e a bateria
 * `scripts/diag-tudo.ts` citando o medidor que lê o Lab → **nenhuma** falha que fale da regra. O
 * `import` até **resolve**, porque os dois clones moram lado a lado; a única que caiu foi a do §4
 * (*"o clone está sujo"*), que não cai quando a mesma mudança chega **commitada** pela origem.
 *
 * # Os LUGARES onde uma dependência mora, e o que cada um pergunta
 *
 * Por LUGAR, não por frase (D243): a régua lê os arquivos **versionados** do Generate (`git
 * ls-files`, nunca o disco inteiro: o `node_modules/` de lá é da máquina) e só os que podem
 * carregar dependência.
 *
 * | lugar | o que reprova |
 * |---|---|
 * | `package.json`, `tsconfig*.json`, `jsconfig.json`, `.gitmodules` | o texto cita o Lab — é configuração, e configuração não tem comentário que absolva |
 * | `import`/`require`/`import()` de código | o especificador cita o Lab — lido pelo `Bun.Transpiler`, não por expressão regular |
 * | o resto do código, **sem os comentários** | um texto que roda (um caminho lido do disco) cita o Lab e não é exceção declarada |
 *
 * **O comentário não conta** (D142, D257): o Generate escreve *"clone o archilly-lab"* em
 * cabeçalho de script, e dizer isso não é depender. A menção que conta é a que sobra depois que o
 * `Bun.Transpiler` tira os comentários — a que **roda**.
 *
 * # A exceção, e as três condições dela
 *
 * Hoje há **uma** leitura do Lab no código do Generate: `scripts/medir-violacoes-do-testfit.ts`, o
 * medidor do GU-06, que lê as saídas que esta casa publica em `docs/contratos/saidas/`. Ela não é
 * dependência pelo que a regra protege, e a exceção só vale enquanto as três coisas forem verdade:
 *
 * 1. **não lê `external-engines/`** — é a pasta que a regra manda poder apagar;
 * 2. **nenhum outro arquivo de código ou configuração do Generate a cita pelo nome** — é o jeito de
 *    perguntar *"está fora da bateria?"* sem escrever a lista da bateria aqui (o `diag-tudo.ts` e
 *    os `scripts` do `package.json` são lugares desse universo);
 * 3. **ela ainda lê o Lab** — exceção que sobrou reprova, e a que perdeu o arquivo também.
 *
 * # O que ela NÃO cobra, dito
 *
 * - **Dependência por COPIAR.** Um arquivo do Lab colado dentro do Generate, sem citar o caminho,
 *   não é dependência de execução e a régua não o vê. Apagar o Lab não o quebra — que é o que a
 *   regra protege.
 * - **O nome do motor de fora** (`symbios`, `packingsolver`): o Generate depender do motor é outra
 *   pergunta, e motor não é o Lab.
 * - **Os `.md`** do Generate, e os dados (`*.json` que não são configuração, como o catálogo da
 *   família em `vendor/`): citar o repositório num documento ou num catálogo não é depender dele.
 * - **O `require()` como importação.** O `Bun.Transpiler.scan` não o devolve (medido nos três
 *   carregadores); o especificador sobra no código sem comentário e reprova como **leitura**
 *   (`le-o-lab-sem-excecao`) — reprova do mesmo jeito, com outro nome.
 * - **Os ramos que não são o `HEAD` do clone.** A régua lê o que está no `HEAD`; o carimbo do item
 *   001 diz se ele é a `origin/main`.
 */

/** A regra, como mora no `CLAUDE.md` §3 — conferida por {@link aRegraEstaEscrita}. */
export const A_REGRA = "O Generate nunca depende disto: `external-engines/` pode ser apagado.";

/** O que conta como citar o Lab. Sem distinguir caixa: `Archilly-Lab` também é o Lab. */
const CITA_O_LAB = /archilly-lab|external-engines/i;
/** O que a exceção nunca pode citar: a pasta que a regra manda poder apagar. */
const CITA_A_PASTA = /external-engines/i;

/** Os arquivos de configuração onde uma dependência mora. Pelo nome, em qualquer pasta. */
const CONFIGURACAO = /(^|\/)(package\.json|tsconfig[^/]*\.json|jsconfig\.json|\.gitmodules)$/;
/** O código: o que o `Bun.Transpiler` lê. */
const CODIGO = /\.(ts|tsx|js|jsx|mjs|cjs|mts|cts)$/;

/** Uma leitura do Lab que o Generate faz de propósito, com o motivo. */
export interface ExcecaoDeLeitura {
  arquivo: string;
  motivo: string;
}

export const EXCECOES: readonly ExcecaoDeLeitura[] = [
  {
    arquivo: "scripts/medir-violacoes-do-testfit.ts",
    motivo:
      "o medidor do GU-06, rodado à mão: lê as saídas que o Lab publica em docs/contratos/saidas/ e, sem a pasta, " +
      "sai com código 2 e a receita — o próprio cabeçalho diz que ele não entra na bateria",
  },
];

/** Um arquivo versionado do Generate, com o texto dele. */
export interface ArquivoDoGenerate {
  caminho: string;
  texto: string;
}

export type TipoDoProblema =
  | "universo-vazio"
  | "configuracao-cita-o-lab"
  | "importa-o-lab"
  | "le-o-lab-sem-excecao"
  | "excecao-le-external-engines"
  | "excecao-citada-por-outro"
  | "excecao-sobrou"
  | "excecao-sem-arquivo"
  | "nao-se-leu";

export interface Problema {
  tipo: TipoDoProblema;
  arquivo: string;
  detalhe: string;
}

export interface Resultado {
  /** Quantos arquivos de configuração e de código foram lidos — publicado, para o zero não passar. */
  configuracoes: number;
  codigos: number;
  importacoes: number;
  problemas: Problema[];
}

function carregadorDe(caminho: string): "ts" | "tsx" {
  return /\.(tsx|jsx)$/.test(caminho) ? "tsx" : "ts";
}

/** A pergunta inteira, sobre os arquivos versionados do Generate (os que não são lugar são ignorados). */
export function conferirOGenerate(
  arquivos: readonly ArquivoDoGenerate[],
  excecoes: readonly ExcecaoDeLeitura[] = EXCECOES,
): Resultado {
  const problemas: Problema[] = [];
  const configs = arquivos.filter((a) => CONFIGURACAO.test(a.caminho));
  const codigos = arquivos.filter((a) => CODIGO.test(a.caminho));
  let importacoes = 0;

  // Lista vazia não aprova (D213): o vigia que não leu nada sai VERDE.
  if (configs.length === 0 || codigos.length === 0) {
    problemas.push({
      tipo: "universo-vazio",
      arquivo: "(o clone)",
      detalhe: `${configs.length} arquivo(s) de configuração e ${codigos.length} de código — nada a conferir não é conferido`,
    });
  }

  for (const a of configs) {
    if (CITA_O_LAB.test(a.texto)) {
      problemas.push({ tipo: "configuracao-cita-o-lab", arquivo: a.caminho, detalhe: a.texto.match(CITA_O_LAB)![0] });
    }
  }

  const leemOLab = new Set<string>();
  /** O texto que RODA de cada código: sem comentário — é nele que se procura quem cita a exceção. */
  const semComentario = new Map<string, string>();
  for (const a of codigos) {
    const t = new Bun.Transpiler({ loader: carregadorDe(a.caminho) });
    try {
      const { imports } = t.scan(a.texto);
      importacoes += imports.length;
      for (const i of imports) {
        if (CITA_O_LAB.test(i.path)) problemas.push({ tipo: "importa-o-lab", arquivo: a.caminho, detalhe: i.path });
      }
      const roda = t.transformSync(a.texto);
      semComentario.set(a.caminho, roda);
      if (CITA_O_LAB.test(roda)) leemOLab.add(a.caminho);
    } catch (e) {
      problemas.push({ tipo: "nao-se-leu", arquivo: a.caminho, detalhe: String(e).slice(0, 200) });
    }
  }

  const declaradas = new Map(excecoes.map((e) => [e.arquivo, e]));
  for (const caminho of leemOLab) {
    if (problemas.some((p) => p.arquivo === caminho && p.tipo === "importa-o-lab")) continue;
    if (!declaradas.has(caminho)) {
      problemas.push({ tipo: "le-o-lab-sem-excecao", arquivo: caminho, detalhe: "um texto que roda cita o Lab" });
    }
  }

  for (const e of excecoes) {
    const roda = semComentario.get(e.arquivo);
    if (roda === undefined) {
      problemas.push({ tipo: "excecao-sem-arquivo", arquivo: e.arquivo, detalhe: "a exceção não tem mais o arquivo" });
      continue;
    }
    if (!leemOLab.has(e.arquivo)) {
      problemas.push({ tipo: "excecao-sobrou", arquivo: e.arquivo, detalhe: "o arquivo não cita mais o Lab" });
    }
    if (CITA_A_PASTA.test(roda)) {
      problemas.push({ tipo: "excecao-le-external-engines", arquivo: e.arquivo, detalhe: "a pasta que pode ser apagada" });
    }
    const nome = e.arquivo.split("/").pop()!.replace(CODIGO, "");
    for (const outro of [...configs.map((c) => [c.caminho, c.texto] as const), ...semComentario.entries()]) {
      if (outro[0] !== e.arquivo && outro[1].includes(nome)) {
        problemas.push({ tipo: "excecao-citada-por-outro", arquivo: e.arquivo, detalhe: `citado em ${outro[0]}` });
      }
    }
  }

  return { configuracoes: configs.length, codigos: codigos.length, importacoes, problemas };
}
