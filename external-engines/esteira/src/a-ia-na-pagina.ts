/**
 * ════════════════════════════════════════════════════════════════════════════
 *  CHAVE DE IA SÓ NO SERVIDOR DA CENTRAL — "o Lab não chama IA", e a linha não nomeava nenhuma das quatro travas que o
 *  perguntam. (LAB-179, item 900, D407)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, tabela *Chaves e segredos*, do LF-FINAL (14/09/2026), dizia:
 *
 * > Chave de IA só no servidor da Central · ✅ **não se aplica** · o Lab não chama IA. Ver `ADOCAO_CENTRAL.md`
 *
 * Espécie: *mensagem fixa que afirma estado sem perguntar*. A frase é verdadeira, e é perguntada — mas por quatro travas
 * nascidas DEPOIS dela, que a linha não nomeava; quem a lê não tem como saber que ela é medida, nem por quem. Medido em
 * 18/10/2026, por LUGAR — os quatro jeitos de o Lab ter IA, cada um com a régua que o pergunta hoje:
 *
 * | pergunta | trava | desde | achados em 18/10 |
 * |---|---|---|---|
 * | a chave de IA na árvore | `varredura-de-segredos.ts` (as regras `chave-de-ia-*`) | LAB-47 | 0 |
 * | a chamada de IA no código | `destino-do-que-sai.ts` (`CHAMADA_PAGA_DE_IA`, do SDK do fornecedor à porta da Central) | LAB-80 | 0 |
 * | a porta de serviço pago | `nada-pago.ts` (dependência, variável de ambiente, endereço…) | LAB-148 | 0 |
 * | a rede no caminho do motor | `rede-em-execucao.ts` | LAB-158 | 0 |
 *
 * A régua da chamada nasceu no LAB-68, no `vazamento-de-custo.test.ts`, e mora no `destino-do-que-sai.ts` desde o LAB-80;
 * a tabela dá a casa de hoje, que é a que o módulo nomeia.
 *
 * # A régua
 *
 * 1. **A linha** nomeia as quatro travas, as quatro rodadas, esta trava e o LAB-179 (`linha-nao-nomeia`); escreve
 *    *"**K** formas de chave de IA"*, K o número de regras `chave-de-ia-*` da varredura de segredos, e *"**C** formas do
 *    import e da chamada"*, C o comprimento de `CHAMADA_PAGA_DE_IA` (`linha-numero-errado`); e não volta a ser só *"o
 *    Lab não chama IA"* sem nenhuma trava (`linha-sem-trava`, o caso da página de antes, acusado à parte para o recado
 *    dizer o que era).
 * 2. **A tabela** da seção *Reconferido no LAB-179* tem uma linha por trava, nem mais nem menos (`tabela-sem-trava`,
 *    `tabela-com-outra`); a rodada de cada uma é a que o módulo nomeia (`tabela-rodada-errada`); e a coluna dos achados é
 *    a que as quatro réguas acham na árvore (`tabela-numero-errado`).
 * 3. **Universo vazio** — alguma régua sem arquivo lido → `universo-vazio` (D213). Os quatro universos saem na medição.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CHAMADA_PAGA_DE_IA, chamadasPagasDeIA } from "./destino-do-que-sai.ts";
import { type Arquivo, conferirNadaPago } from "./nada-pago.ts";
import { conferirAArvore as aRedeNaArvore, noCaminhoDoMotor } from "./rede-em-execucao.ts";
import { REGRAS, arquivosQueOGitCarrega, varrer } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela que esta régua responde. */
export const A_LINHA = "| Chave de IA só no servidor da Central |";
export const O_PONTEIRO = "external-engines/esteira/src/a-ia-na-pagina.ts";
export const ESTA_RODADA = 179;
/** O título da seção da página que leva a tabela das quatro travas. */
export const A_SECAO = "## Reconferido no LAB-179";

export type Pergunta = "chave" | "chamada" | "porta" | "rede";

export interface Trava {
  pergunta: Pergunta;
  /** O caminho do módulo, como a página o escreve. */
  trava: string;
  /** A rodada em que a régua passou a morar no módulo — o módulo a nomeia. */
  desde: number;
}

const E = "external-engines/esteira/src/";
export const AS_TRAVAS: readonly Trava[] = [
  { pergunta: "chave", trava: `${E}varredura-de-segredos.ts`, desde: 47 },
  { pergunta: "chamada", trava: `${E}destino-do-que-sai.ts`, desde: 80 },
  { pergunta: "porta", trava: `${E}nada-pago.ts`, desde: 148 },
  { pergunta: "rede", trava: `${E}rede-em-execucao.ts`, desde: 158 },
];

/** As regras da varredura de segredos que são chave de IA. */
export const REGRAS_DE_CHAVE_DE_IA = REGRAS.filter((r) => r.nome.startsWith("chave-de-ia-"));

export interface Medicao {
  /** Achados de cada pergunta na árvore. */
  achados: Record<Pergunta, number>;
  /** Quantos arquivos cada régua leu — publicado, porque `every` sobre vazio é verdade. */
  lidos: Record<Pergunta, number>;
  /** O texto de cada módulo de trava, para conferir a rodada que ele nomeia (`null`: o `git` não o carrega). */
  modulos: Record<Pergunta, string | null>;
}

const CODIGO_DO_NADA_PAGO = /\.(ts|tsx|js|mjs|cjs|rs|html|sh|bash|ya?ml)$|(^|\/)package\.json$|(^|\/)Cargo\.toml$/;

/** As quatro réguas, rodadas na árvore de verdade. */
export function medir(raiz: string): Medicao {
  const arquivos = arquivosQueOGitCarrega(raiz);
  const ler = (c: string): string | null => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  };

  const segredos = varrer(raiz, arquivos);
  const nomesDeIA = new Set(REGRAS_DE_CHAVE_DE_IA.map((r) => r.nome));
  const chave = segredos.achados.filter((a) => nomesDeIA.has(a.regra)).length;

  const lidosDaChamada = arquivos.filter((f) => /\.(?:ts|tsx|js|mjs)$/.test(f)).length;
  const chamada = chamadasPagasDeIA(raiz, arquivos).length;

  const doNadaPago: Arquivo[] = [];
  for (const caminho of arquivos.filter((c) => CODIGO_DO_NADA_PAGO.test(c))) {
    const texto = ler(caminho);
    if (texto !== null) doNadaPago.push({ caminho, texto });
  }
  // Sem o `CLAUDE.md` a régua das portas não se roda: é o universo dela que some, e isso se diz (lidos = 0), em vez de
  // passar um texto vazio que ela leria como "a frase sumiu".
  const claude = ler("CLAUDE.md");
  const portas = claude === null ? null : conferirNadaPago(doNadaPago, claude);

  const rede = aRedeNaArvore(raiz);

  const carregados = new Set(arquivos);
  const modulo = (p: Pergunta) => {
    const c = AS_TRAVAS.find((t) => t.pergunta === p)!.trava;
    return carregados.has(c) ? ler(c) : null;
  };
  return {
    achados: {
      chave,
      chamada,
      porta: portas === null ? 0 : portas.pagas.length,
      rede: rede.achados.filter((a) => noCaminhoDoMotor(a.caminho)).length,
    },
    lidos: {
      chave: segredos.escopo.arquivosVarridos,
      chamada: lidosDaChamada,
      porta: portas === null ? 0 : doNadaPago.length,
      rede: rede.lidos,
    },
    modulos: { chave: modulo("chave"), chamada: modulo("chamada"), porta: modulo("porta"), rede: modulo("rede") },
  };
}

/** A linha da página, ou `null`. */
export function aLinha(pagina: string): string | null {
  return pagina.split("\n").find((l) => l.startsWith(A_LINHA)) ?? null;
}

/** As linhas da tabela da seção: `| <pergunta> | `<trava>` | LAB-n | achados |` → caminho, rodada e achados. */
export function aTabela(pagina: string): Map<string, { desde: number; achados: number }> | null {
  const linhas = pagina.split("\n");
  const i = linhas.findIndex((l) => l.startsWith(A_SECAO));
  if (i < 0) return null;
  const t = new Map<string, { desde: number; achados: number }>();
  for (let j = i + 1; j < linhas.length && !/^##\s/.test(linhas[j]!); j++) {
    const m = /^\|[^|]+\|\s*`([^`]+)`[^|]*\|\s*LAB-(\d+)\s*\|\s*(\d+)\s*\|/.exec(linhas[j]!);
    if (m) t.set(m[1]!, { desde: Number(m[2]), achados: Number(m[3]) });
  }
  return t;
}

export type TipoDeProblema =
  | "linha-ausente"
  | "linha-sem-trava"
  | "linha-nao-nomeia"
  | "linha-numero-errado"
  | "tabela-ausente"
  | "tabela-sem-trava"
  | "tabela-com-outra"
  | "tabela-rodada-errada"
  | "tabela-numero-errado"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

/** A conferência da página contra a medição. */
export function conferirAPagina(pagina: string | null, medicao: Medicao): Problema[] {
  const problemas: Problema[] = [];
  for (const t of AS_TRAVAS) {
    if (medicao.lidos[t.pergunta] === 0)
      problemas.push({ tipo: "universo-vazio", detalhe: `a régua da ${t.pergunta} não leu arquivo nenhum — verde sobre zero não é verde` });
    if (medicao.modulos[t.pergunta] === null)
      problemas.push({ tipo: "universo-vazio", detalhe: `o git não carrega ${t.trava}, a trava da ${t.pergunta}` });
  }

  const linha = pagina === null ? null : aLinha(pagina);
  if (linha === null) {
    problemas.push({ tipo: "linha-ausente", detalhe: `o ${A_PAGINA} não tem a linha que começa por "${A_LINHA}"` });
  } else {
    if (!AS_TRAVAS.some((t) => linha.includes(t.trava)))
      problemas.push({
        tipo: "linha-sem-trava",
        detalhe: `a linha afirma que o Lab não chama IA e não nomeia trava nenhuma que o pergunte`,
      });
    const nomes = [...AS_TRAVAS.flatMap((t) => [t.trava, `LAB-${t.desde}`]), O_PONTEIRO, `LAB-${ESTA_RODADA}`];
    for (const n of nomes)
      if (!new RegExp(`${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![0-9])`).test(linha))
        problemas.push({ tipo: "linha-nao-nomeia", detalhe: `a linha da chave de IA não nomeia ${n}` });
    const numeros: [RegExp, number, string][] = [
      [/\*\*(\d+)\*\* formas de chave de IA/, REGRAS_DE_CHAVE_DE_IA.length, "formas de chave de IA"],
      [/\*\*(\d+)\*\* formas do import e da chamada/, CHAMADA_PAGA_DE_IA.length, "formas do import e da chamada"],
    ];
    for (const [re, k, oQue] of numeros) {
      const escrito = re.exec(linha);
      if (!escrito || Number(escrito[1]) !== k)
        problemas.push({
          tipo: "linha-numero-errado",
          detalhe: `a linha tem de escrever "**${k}** ${oQue}"; escreve ${escrito ? `"**${escrito[1]}**"` : "outra coisa"}`,
        });
    }
  }

  const tabela = pagina === null ? null : aTabela(pagina);
  if (tabela === null) {
    problemas.push({ tipo: "tabela-ausente", detalhe: `o ${A_PAGINA} não tem a seção "${A_SECAO}"` });
  } else {
    const curto = (c: string) => c.slice(E.length);
    for (const t of AS_TRAVAS) {
      const escrito = tabela.get(curto(t.trava)) ?? tabela.get(t.trava);
      if (!escrito) {
        problemas.push({ tipo: "tabela-sem-trava", detalhe: `a tabela não tem a linha de ${curto(t.trava)}` });
        continue;
      }
      if (escrito.desde !== t.desde)
        problemas.push({ tipo: "tabela-rodada-errada", detalhe: `${curto(t.trava)}: a tabela escreve LAB-${escrito.desde}, a trava é do LAB-${t.desde}` });
      const modulo = medicao.modulos[t.pergunta];
      if (modulo !== null && !new RegExp(`\\bLAB-${t.desde}(?![0-9])`).test(modulo))
        problemas.push({ tipo: "tabela-rodada-errada", detalhe: `${curto(t.trava)} não nomeia o LAB-${t.desde} que a tabela lhe dá` });
      if (escrito.achados !== medicao.achados[t.pergunta])
        problemas.push({
          tipo: "tabela-numero-errado",
          detalhe: `${curto(t.trava)}: a tabela escreve ${escrito.achados} achados, a régua acha ${medicao.achados[t.pergunta]}`,
        });
    }
    const conhecidas = new Set(AS_TRAVAS.flatMap((t) => [t.trava, curto(t.trava)]));
    for (const c of tabela.keys())
      if (!conhecidas.has(c)) problemas.push({ tipo: "tabela-com-outra", detalhe: `a tabela tem a linha de ${c}, que não é uma das quatro travas` });
  }
  return problemas;
}

/** A árvore de verdade. */
export function conferirAArvore(raiz: string): { medicao: Medicao; problemas: Problema[] } {
  const medicao = medir(raiz);
  let pagina: string | null;
  try {
    pagina = readFileSync(join(raiz, A_PAGINA), "utf8");
  } catch {
    pagina = null;
  }
  return { medicao, problemas: conferirAPagina(pagina, medicao) };
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "IA de fornecedor que nenhuma das quatro réguas conhece pelo nome: a chamada é procurada pelos SDKs e pela porta da Central que `CHAMADA_PAGA_DE_IA` lista, a chave pelos três formatos da varredura; o que fica é a porta — um SDK novo é dependência nova, um endereço novo é endereço novo, e a `nada-pago.ts` reprova toda porta não declarada, mas quem a declara escolhe a classe",
  "a régua da chamada lê `.ts`, `.tsx`, `.js` e `.mjs`: um cliente de IA em Rust ou em script de shell só aparece pela porta (a dependência no `Cargo.toml`, o endereço, a rede), não pelo import",
  "contratar fora da árvore: conta aberta, chave cadastrada num painel — não deixa rastro aqui (é o que o `CLAUDE.md` §4-A diz da `nada-pago.ts`)",
  "o que o `ADOCAO_CENTRAL.md` diz do gateway de IA: é outra página, e a `a-adocao-da-central.ts` (LAB-167) é quem a lê",
  "os clones vizinhos: se o Generate ou o Geo chamam IA, é deles",
];
