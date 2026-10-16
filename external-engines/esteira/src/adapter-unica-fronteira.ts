/**
 * ════════════════════════════════════════════════════════════════════════════
 *  `adapter/` É A ÚNICA FRONTEIRA — perguntado a quem importa. (LAB-135, item 900, D363)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `CLAUDE.md` §3, terceira linha da regra de ouro: *"**`adapter/` é a única fronteira.**"* O
 * `README.md` da raiz diz o que isso quer dizer: *"Só ele conhece detalhes do motor. Trocar o motor
 * não deve exigir mexer em nada fora dessa pasta."* A primeira linha ganhou trava no LAB-132 e a
 * quarta no LAB-06 e no LAB-134; **esta não tinha nenhuma** — medido por mutação no LAB-135: um arquivo
 * novo em `esteira/src/` importando `@testfit/api.ts`, e outro importando o motor por caminho
 * relativo (`../../../../motor-testfit/src/lib/lab/api.ts`, o que o D16 proíbe por escrito), não
 * derrubaram **nenhuma** trava que fale da regra. A única que caiu foi a prova do LAB-52, que conta
 * a árvore — e cai com qualquer arquivo novo.
 *
 * E a regra já estava quebrada: **onze** arquivos fora de um `adapter/` importavam o motor do
 * Laboratório de Parcelamento direto (três do `esteira/src/`, dois testes, quatro ferramentas da
 * esteira, um teste e uma ferramenta do próprio pacote `testfit/`). O conserto foi uma porta só,
 * `testfit/adapter/src/motor.ts`, que repassa as sete coisas que eles usavam.
 *
 * # Os LUGARES, e o que cada um pergunta
 *
 * Por LUGAR (D243): o código versionado de `external-engines/` (`git ls-files`), e os `paths` de
 * cada `tsconfig.json` — o apelido se LÊ de onde ele mora, nunca de uma lista escrita aqui (D310).
 * Os especificadores saem do `ts.preProcessFile`: **com** o `import type` e o `export type` (tipo do
 * motor fora do adaptador também obriga a mexer quando o motor muda), com o `export … from`, o
 * `import()` e o `require()`, e **sem** os comentários (D142, D257).
 *
 * | o especificador resolve para | e quem importa é | |
 * |---|---|---|
 * | `external-engines/<m>/upstream/` ou `archilly/` | o `adapter/` do mesmo `<m>`, ou o próprio motor | passa |
 * | um clone de motor (a tabela {@link MOTORES_DE_FORA}) | o `adapter/` daquele motor | passa |
 * | qualquer dos dois | qualquer outro arquivo | **reprova** |
 *
 * E a tabela é cobrada nos dois sentidos: apelido que sai do repositório e não é motor nem está em
 * {@link CLONES_QUE_NAO_SAO_MOTOR} reprova (o próximo clone nasce com dono), e motor de fora que o
 * próprio adaptador deixou de importar reprova (tabela velha).
 *
 * # O que ela NÃO cobra, dito
 *
 * - **O caminho do ARTEFATO do Symbios.** O `.wasm` é motor, e **vinte e sete** arquivos fora do
 *   `symbios/adapter/` escrevem o caminho dele (`archilly/wasm/target/…/archilly_symbios_wasm.wasm`)
 *   no código que roda, para ler os bytes e entregar ao `Motor.carregar` — nove testes e dezoito
 *   ferramentas, nenhum do `src/` (medido no LAB-135). É um texto que roda, não uma importação, e
 *   consertá-lo sem o `.wasm` nesta máquina seria mexer em teste que eu não posso rodar. Ficou
 *   medido no LAB-135 e proposto ao chat na `FILA.md`.
 * - **O `import.meta.resolve("@testfit/api.ts")`** do carimbo dos vizinhos (`commit-dos-vizinhos.ts`):
 *   ele pergunta **onde o clone mora** para ler o `git` dele, não usa nada do motor.
 * - **O Generate.** Ele é o juiz (Validator e Judge), não um motor de `external-engines/`, e a
 *   esteira o importa de propósito — a regra que fala dele é a quarta (LAB-134).
 * - **O texto** — `.md`, JSON de prova, comentário: citar o motor não é depender dele.
 */
import { posix } from "node:path";

import ts from "typescript";

/** A regra, como mora no `CLAUDE.md` §3 — conferida por `aRegraEstaEscrita`. */
export const A_REGRA = "`adapter/` é a única fronteira.";

/** Os motores que moram FORA deste repositório, num clone irmão (D16). A raiz é relativa à raiz deste. */
export const MOTORES_DE_FORA: readonly { motor: string; raiz: string }[] = [
  { motor: "testfit", raiz: "../motor-testfit/" },
];

/** Os clones que a casa lê e que NÃO são motor — com o motivo. */
export const CLONES_QUE_NAO_SAO_MOTOR: readonly { raiz: string; motivo: string }[] = [
  {
    raiz: "../urban-create-hub-41d93a4d/",
    motivo:
      "o Generate: o dono do contrato, do Validator e do Judge — a esteira o importa de propósito, e a " +
      "regra que fala dele é a quarta da regra de ouro (LAB-134)",
  },
];

/** Um arquivo versionado deste repositório, com o caminho relativo à raiz dele. */
export interface Arquivo {
  caminho: string;
  texto: string;
}

/** Os `paths` de um `tsconfig.json`, com a pasta dele (relativa à raiz) e o `baseUrl`. */
export interface Configuracao {
  pasta: string;
  baseUrl: string;
  paths: Record<string, string[]>;
}

export type TipoDoProblema =
  | "universo-vazio"
  | "importa-o-motor"
  | "importa-outro-motor"
  | "apelido-sem-dono"
  | "motor-de-fora-sem-uso"
  | "nao-se-leu";

export interface Problema {
  tipo: TipoDoProblema;
  arquivo: string;
  detalhe: string;
}

export interface Resultado {
  /** Publicados, para o zero não passar (D213). */
  codigos: number;
  configuracoes: number;
  importacoes: number;
  problemas: Problema[];
}

const CODIGO = /\.(ts|tsx|js|jsx|mjs|cjs|mts|cts)$/;
const DENTRO = /^external-engines\/([^/]+)\/(upstream|archilly)\//;
const ADAPTADOR = /^external-engines\/([^/]+)\/adapter\//;

/** Lê um `tsconfig.json` com comentário, como o `tsc` lê. */
export function configuracaoDe(pasta: string, texto: string): Configuracao {
  const { config, error } = ts.parseConfigFileTextToJson(`${pasta}/tsconfig.json`, texto);
  if (error) throw new Error(`o tsconfig de ${pasta} não se lê`);
  const co = (config?.compilerOptions ?? {}) as { baseUrl?: string; paths?: Record<string, string[]> };
  return { pasta, baseUrl: co.baseUrl ?? ".", paths: co.paths ?? {} };
}

/** Os especificadores de um código — com tipo, sem comentário. */
export function especificadores(texto: string): string[] {
  return ts.preProcessFile(texto, true, true).importedFiles.map((f) => f.fileName);
}

/** O `tsconfig` que governa um arquivo: o da pasta-mãe mais funda. */
function configuracaoDoArquivo(caminho: string, configs: readonly Configuracao[]): Configuracao | null {
  return (
    configs
      .filter((c) => caminho.startsWith(`${c.pasta}/`))
      .sort((a, b) => b.pasta.length - a.pasta.length)[0] ?? null
  );
}

/** Para onde o especificador aponta, relativo à raiz — ou `null` (pacote do `node_modules`). */
export function resolver(caminho: string, especificador: string, config: Configuracao | null): string | null {
  if (especificador.startsWith(".")) return posix.normalize(posix.join(posix.dirname(caminho), especificador));
  if (!config) return null;
  for (const [apelido, alvos] of Object.entries(config.paths)) {
    const prefixo = apelido.replace(/\*$/, "");
    const alvo = alvos[0];
    if (alvo === undefined || !especificador.startsWith(prefixo)) continue;
    const resto = apelido.endsWith("*") ? especificador.slice(prefixo.length) : "";
    return posix.normalize(posix.join(config.pasta, config.baseUrl, alvo.replace(/\*$/, "") + resto));
  }
  return null;
}

/** De que motor é o alvo, e se é motor — `null` quando não é. */
function motorDo(alvo: string): string | null {
  const dentro = DENTRO.exec(alvo);
  if (dentro) return dentro[1]!;
  return MOTORES_DE_FORA.find((m) => alvo.startsWith(m.raiz))?.motor ?? null;
}

/** A pergunta inteira. */
export function conferirAFronteira(arquivos: readonly Arquivo[], configs: readonly Configuracao[]): Resultado {
  const problemas: Problema[] = [];
  const codigos = arquivos.filter((a) => a.caminho.startsWith("external-engines/") && CODIGO.test(a.caminho));
  let importacoes = 0;

  if (codigos.length === 0 || configs.length === 0) {
    problemas.push({
      tipo: "universo-vazio",
      arquivo: "(o repositório)",
      detalhe: `${codigos.length} código(s) e ${configs.length} tsconfig(s) — nada a conferir não é conferido`,
    });
  }

  // O apelido que sai do repositório tem de ter dono: motor ou clone declarado.
  for (const c of configs) {
    for (const [apelido, alvos] of Object.entries(c.paths)) {
      for (const alvo of alvos) {
        const onde = posix.normalize(posix.join(c.pasta, c.baseUrl, alvo.replace(/\*$/, "")));
        if (!onde.startsWith("../")) continue;
        const temDono =
          MOTORES_DE_FORA.some((m) => onde.startsWith(m.raiz)) ||
          CLONES_QUE_NAO_SAO_MOTOR.some((n) => onde.startsWith(n.raiz));
        if (!temDono) problemas.push({ tipo: "apelido-sem-dono", arquivo: `${c.pasta}/tsconfig.json`, detalhe: `${apelido} → ${onde}` });
      }
    }
  }

  const usados = new Set<string>();
  for (const a of codigos) {
    if (DENTRO.test(a.caminho)) continue; // o motor importando a si mesmo
    let specs: string[];
    try {
      specs = especificadores(a.texto);
    } catch (e) {
      problemas.push({ tipo: "nao-se-leu", arquivo: a.caminho, detalhe: String(e).slice(0, 200) });
      continue;
    }
    importacoes += specs.length;
    const config = configuracaoDoArquivo(a.caminho, configs);
    const doAdaptador = ADAPTADOR.exec(a.caminho)?.[1] ?? null;
    for (const s of specs) {
      const alvo = resolver(a.caminho, s, config);
      if (alvo === null) continue;
      const motor = motorDo(alvo);
      if (motor === null) continue;
      if (doAdaptador === motor) {
        usados.add(motor);
      } else if (doAdaptador !== null) {
        problemas.push({ tipo: "importa-outro-motor", arquivo: a.caminho, detalhe: `${s} (motor ${motor})` });
      } else {
        problemas.push({ tipo: "importa-o-motor", arquivo: a.caminho, detalhe: `${s} (motor ${motor})` });
      }
    }
  }

  for (const m of MOTORES_DE_FORA) {
    if (codigos.length > 0 && !usados.has(m.motor)) {
      problemas.push({ tipo: "motor-de-fora-sem-uso", arquivo: `external-engines/${m.motor}/adapter/`, detalhe: m.raiz });
    }
  }

  return { codigos: codigos.length, configuracoes: configs.length, importacoes, problemas };
}
