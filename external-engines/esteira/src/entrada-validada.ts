/**
 * A ENTRADA SE CONFERE ANTES DE ENTRAR NO NÚCLEO — e eram três portas, não duas. (LAB-159, D387)
 *
 * # A frase, e quem a escreveu
 *
 * O `docs/SEGURANCA.md`, no LF-FINAL (14/09/2026), na tabela *Execução*:
 *
 * > Entrada validada antes de entrar no núcleo · ✅ · versão do contrato, unidade (metro) e anel com ao menos 3
 * > pontos são recusados com mensagem legível — `ida.ts` e `gleba-v1.ts`, com teste
 *
 * Nenhuma trava a perguntava (espécie *mensagem fixa que afirma estado sem perguntar*, CLAUDE.md regra de família).
 *
 * # O que a medição respondeu (17/10/2026)
 *
 * Medido por LUGAR, o que entra no motor: toda função exportada de `esteira/src/motores/` (menos o `comum.ts`) que
 * recebe a `EntradaMinima` — **sete**. Cinco rodam motor (`rodarGenerate`, `redeDoSymbios`, `rodarSymbios`,
 * `rodarTestfit` e `variantesJulgadasDoTestfit`, que chega ao mesmo `rodarEsteira`), duas só traduzem parâmetro
 * (`parametrosDoGenerate`, `opcoesDaEsteiraDele`). Elas chegam ao núcleo por **três portas**:
 *
 * | porta | quem confere | estado em 17/10, antes do conserto |
 * |---|---|---|
 * | Laboratório de Parcelamento | `idaParaOMotor` (`testfit/adapter/src/ida.ts`) | as três recusas, as três com teste |
 * | Symbios | `glebaParaOSymbios` (`esteira/src/gleba-v1.ts`) | as três recusas; **só a da versão** com teste |
 * | **motor interno do Generate** | **ninguém** | **nenhuma recusa** |
 *
 * Rodado, na gleba `completo`: o `rodarGenerate` aceitou contrato `"9"` e `unidade: "ft"` e devolveu **1 606 lotes**
 * nas duas — o mesmo número da gleba em metro, porque o motor lê o número, não a unidade; o anel de 2 pontos voltou
 * sem plano, mas porque o motor não achou plano, não porque alguém recusou. A página nomeava duas portas e calava a
 * terceira — que existe desde o LAB-13 (19/09), cinco dias depois da página.
 *
 * # O conserto
 *
 * As três recusas saíram do `glebaParaOSymbios` para `recusaDaEntrada` (`gleba-v1.ts`), com as mensagens palavra por
 * palavra; o `glebaParaOSymbios` e o `rodarGenerate` perguntam a ela antes do motor. No Generate a recusa **não
 * estoura** (a porta proíbe): volta sem SAÍDA e com o motivo, e o motor não roda.
 *
 * # A trava, e as regras dela
 *
 * 1. **`porta-nao-declarada`** — função exportada de `motores/` que recebe `EntradaMinima` e não está em `PORTAS`
 *    nem em `NAO_SAO_PORTA`. É a regra que pega o quarto motor nascendo sem conferência.
 * 2. **`declarada-que-sumiu`** — a declaração aponta para função que o arquivo não tem.
 * 3. **`motor-antes-da-conferencia`** — na porta, a chamada que confere falta, ou vem DEPOIS da chamada ao motor.
 * 4. **`nao-porta-que-roda-motor`** — a função declarada "não é porta" chama um motor.
 * 5. **`recusa-que-falta`** — quem confere perdeu uma das três perguntas.
 * 6. **`universo-vazio`** — nenhuma função lida em `motores/` (D164).
 *
 * Lê só arquivos DESTE repositório, sem clones: entra no portão sem clones do `verde.yml`.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { semComentarios } from "./varredura-de-chamadas.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela *Execução* que esta trava pergunta. */
export const A_LINHA = "Entrada validada antes de entrar no núcleo";

/** Onde moram as funções que levam a entrada a um motor. */
export const PASTA_DOS_MOTORES = "external-engines/esteira/src/motores/";
/** O `comum.ts` não recebe entrada: é a régua comum (tipos, área, julgamento pelo Generate). */
export const FORA_DO_UNIVERSO = ["external-engines/esteira/src/motores/comum.ts"] as const;

/** As chamadas que rodam um núcleo de motor. Qualquer uma delas, numa função, faz dela porta. */
export const CHAMADAS_DE_MOTOR = ["gerarPlano(", "gerarRedeViaria(", "rodarMotor(", "rodarEsteira("] as const;

export interface Porta {
  arquivo: string;
  funcao: string;
  /** A chamada que confere (ou entrega a quem confere), e que tem de vir ANTES do motor. */
  conferencia: string;
  /** A primeira chamada ao motor, que a conferência tem de anteceder. */
  motor: string;
}

/**
 * As portas medidas em 17/10/2026. `rodarEsteira` é do pacote do Laboratório de Parcelamento, mas mora neste
 * repositório (`testfit/adapter/src/esteira.ts`) e é por ela que o `idaParaOMotor` roda.
 */
export const PORTAS: readonly Porta[] = [
  { arquivo: "external-engines/esteira/src/motores/generate.ts", funcao: "rodarGenerate", conferencia: "recusaDaEntrada(", motor: "gerarPlano(" },
  { arquivo: "external-engines/esteira/src/motores/symbios.ts", funcao: "redeDoSymbios", conferencia: "glebaParaOSymbios(", motor: "gerarRedeViaria(" },
  { arquivo: "external-engines/esteira/src/motores/symbios.ts", funcao: "rodarSymbios", conferencia: "redeDoSymbios(", motor: "redeDoSymbios(" },
  { arquivo: "external-engines/esteira/src/motores/testfit.ts", funcao: "rodarTestfit", conferencia: "rodarEsteira(", motor: "rodarEsteira(" },
  { arquivo: "external-engines/esteira/src/motores/testfit.ts", funcao: "variantesJulgadasDoTestfit", conferencia: "rodarEsteira(", motor: "rodarEsteira(" },
  { arquivo: "external-engines/testfit/adapter/src/esteira.ts", funcao: "rodarEsteira", conferencia: "idaParaOMotor(", motor: "rodarMotor(" },
];

/** Recebem a entrada e NÃO rodam motor — só traduzem parâmetro. Declaradas com o motivo. */
export const NAO_SAO_PORTA: readonly { arquivo: string; funcao: string; porque: string }[] = [
  {
    arquivo: "external-engines/esteira/src/motores/generate.ts",
    funcao: "parametrosDoGenerate",
    porque: "traduz os parâmetros da gleba para os do motor; quem o chama é o rodarGenerate, depois de conferir",
  },
  {
    arquivo: "external-engines/esteira/src/motores/testfit.ts",
    funcao: "opcoesDaEsteiraDele",
    porque: "monta as opções da esteira dele; a entrada só chega ao motor pelo rodarEsteira, que confere",
  },
];

/** Quem confere, e as três perguntas que cada um tem de fazer (o texto do código, sem comentário). */
export const QUEM_CONFERE: readonly { arquivo: string; funcao: string; perguntas: Record<string, RegExp> }[] = [
  {
    arquivo: "external-engines/esteira/src/gleba-v1.ts",
    funcao: "recusaDaEntrada",
    perguntas: {
      versao: /VERSOES_LIDAS[^;]*\.includes\(\s*e\.archilly\.versao\s*\)/,
      unidade: /e\.crs\.unidade\s*!==\s*"m"/,
      anel: /e\.gleba\.anel\.length\s*<\s*3/,
    },
  },
  {
    arquivo: "external-engines/esteira/src/gleba-v1.ts",
    funcao: "glebaParaOSymbios",
    perguntas: { "pergunta a recusaDaEntrada": /recusaDaEntrada\(\s*e\s*\)/ },
  },
  {
    arquivo: "external-engines/testfit/adapter/src/ida.ts",
    funcao: "idaParaOMotor",
    perguntas: {
      versao: /VERSOES_LIDAS[^;]*\.includes\(\s*e\.archilly\.versao\s*\)/,
      unidade: /e\.crs\.unidade\s*!==\s*"m"/,
      anel: /perimetro\.length\s*<\s*3/,
    },
  },
];

/**
 * As funções exportadas de nível de topo de um arquivo, cada uma com o seu texto (assinatura e corpo, sem
 * comentário). O corpo vai até a primeira linha que é só `}` — é como estes arquivos se escrevem; se um dia não
 * for, a função seguinte entra no corpo da anterior e a conferência pega chamada demais, nunca de menos.
 */
export function funcoesExportadas(texto: string): Map<string, string> {
  const limpo = semComentarios(texto);
  const saida = new Map<string, string>();
  const re = /^export (?:async )?function (\w+)\s*[<(]/gm;
  for (let m = re.exec(limpo); m; m = re.exec(limpo)) {
    const inicio = m.index;
    const fecho = /\n\}[ \t]*(?:\n|$)/g;
    fecho.lastIndex = inicio;
    const f = fecho.exec(limpo);
    saida.set(m[1]!, limpo.slice(inicio, f ? f.index + 2 : undefined));
  }
  return saida;
}

export type TipoDeProblema =
  | "porta-nao-declarada"
  | "declarada-que-sumiu"
  | "motor-antes-da-conferencia"
  | "nao-porta-que-roda-motor"
  | "recusa-que-falta"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  arquivo: string;
  funcao: string;
  detalhe: string;
}

export interface Resultado {
  /** Funções exportadas lidas em `motores/` (o universo). */
  funcoesLidas: number;
  /** Delas, as que recebem a entrada. */
  recebemAEntrada: number;
  problemas: Problema[];
  resumo: string;
}

export function conferirAsPortasDaEntrada(arquivos: readonly string[], ler: (c: string) => string | null): Resultado {
  const problemas: Problema[] = [];
  const cache = new Map<string, Map<string, string> | null>();
  const funcoesDe = (arquivo: string) => {
    if (!cache.has(arquivo)) {
      const t = ler(arquivo);
      cache.set(arquivo, t === null ? null : funcoesExportadas(t));
    }
    return cache.get(arquivo)!;
  };

  // O universo: toda função exportada de `motores/`.
  const doUniverso = arquivos
    .filter((c) => c.startsWith(PASTA_DOS_MOTORES) && /\.ts$/.test(c) && !c.endsWith(".test.ts"))
    .filter((c) => !(FORA_DO_UNIVERSO as readonly string[]).includes(c))
    .sort();
  let funcoesLidas = 0;
  let recebemAEntrada = 0;
  const declaradas = new Set([...PORTAS, ...NAO_SAO_PORTA].map((d) => `${d.arquivo}#${d.funcao}`));
  for (const arquivo of doUniverso) {
    const fs = funcoesDe(arquivo);
    if (!fs) continue;
    for (const [nome, corpo] of fs) {
      funcoesLidas++;
      const assinatura = corpo.slice(0, corpo.indexOf("{") === -1 ? undefined : corpo.indexOf("{"));
      const recebe = /\bEntradaMinima\b/.test(assinatura);
      const rodaMotor = CHAMADAS_DE_MOTOR.some((c) => corpo.includes(c));
      if (recebe) recebemAEntrada++;
      if ((recebe || rodaMotor) && !declaradas.has(`${arquivo}#${nome}`)) {
        problemas.push({
          tipo: "porta-nao-declarada",
          arquivo,
          funcao: nome,
          detalhe: recebe
            ? "recebe a EntradaMinima e não está em PORTAS nem em NAO_SAO_PORTA"
            : "chama um motor e não está em PORTAS",
        });
      }
    }
  }
  if (funcoesLidas === 0) {
    problemas.push({ tipo: "universo-vazio", arquivo: PASTA_DOS_MOTORES, funcao: "—", detalhe: "nenhuma função lida" });
  }

  for (const p of PORTAS) {
    const corpo = funcoesDe(p.arquivo)?.get(p.funcao);
    if (corpo === undefined) {
      problemas.push({ tipo: "declarada-que-sumiu", arquivo: p.arquivo, funcao: p.funcao, detalhe: "porta declarada que o arquivo não tem" });
      continue;
    }
    const iConfere = corpo.indexOf(p.conferencia);
    const iMotor = corpo.indexOf(p.motor);
    if (iConfere === -1 || iMotor === -1 || iConfere > iMotor) {
      problemas.push({
        tipo: "motor-antes-da-conferencia",
        arquivo: p.arquivo,
        funcao: p.funcao,
        detalhe:
          iConfere === -1
            ? `não chama ${p.conferencia}`
            : iMotor === -1
              ? `não chama ${p.motor} — a porta mudou de motor e a declaração não`
              : `chama ${p.motor} antes de ${p.conferencia}`,
      });
    }
  }

  for (const n of NAO_SAO_PORTA) {
    const corpo = funcoesDe(n.arquivo)?.get(n.funcao);
    if (corpo === undefined) {
      problemas.push({ tipo: "declarada-que-sumiu", arquivo: n.arquivo, funcao: n.funcao, detalhe: "declarada como não-porta e o arquivo não a tem" });
      continue;
    }
    const chamada = CHAMADAS_DE_MOTOR.find((c) => corpo.includes(c));
    if (chamada) {
      problemas.push({ tipo: "nao-porta-que-roda-motor", arquivo: n.arquivo, funcao: n.funcao, detalhe: `chama ${chamada}` });
    }
  }

  for (const q of QUEM_CONFERE) {
    const corpo = funcoesDe(q.arquivo)?.get(q.funcao);
    if (corpo === undefined) {
      problemas.push({ tipo: "declarada-que-sumiu", arquivo: q.arquivo, funcao: q.funcao, detalhe: "quem confere sumiu" });
      continue;
    }
    for (const [pergunta, re] of Object.entries(q.perguntas)) {
      if (!re.test(corpo)) {
        problemas.push({ tipo: "recusa-que-falta", arquivo: q.arquivo, funcao: q.funcao, detalhe: `não pergunta: ${pergunta}` });
      }
    }
  }

  return {
    funcoesLidas,
    recebemAEntrada,
    problemas,
    resumo:
      `${doUniverso.length} arquivo(s) de motores/ lidos · ${funcoesLidas} função(ões) exportada(s) · ` +
      `${recebemAEntrada} recebem a entrada · ${PORTAS.length} porta(s) declarada(s) · ${problemas.length} problema(s)`,
  };
}

/** A árvore de verdade: o `git ls-files` DESTE repositório. */
export function conferirAArvore(raiz: string, arquivos: readonly string[]): Resultado {
  return conferirAsPortasDaEntrada(arquivos, (c) => {
    try {
      return readFileSync(join(raiz, c), "utf8");
    } catch {
      return null;
    }
  });
}

/** O que esta trava NÃO alcança, dito. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "porta fora de `esteira/src/motores/`: uma ferramenta que chame `gerarPlano` direto, sem passar por `motores/`, não entra no universo",
  "a QUALIDADE da recusa: a trava confere que as três perguntas estão escritas e vêm antes do motor; que a recusa funciona, quem prova é o teste do comportamento (este arquivo de teste, para a `recusaDaEntrada`; `motores.test.ts`, com os clones, para o `rodarGenerate`; `testfit/tests/esteira.test.ts`, para a ida)",
  "o `schema` do arquivo: só a ida do Laboratório de Parcelamento o pergunta; a página não o promete, e a trava não o cobra",
  "a porta comum (`porta/motores.ts`) ESTOURAR com a recusa da ida do Laboratório de Parcelamento: medido em 17/10, `motorDoParcelamento().gerar` com `unidade: \"ft\"` lança em vez de devolver `recusei`, e a porta promete nunca estourar — proposto ao chat (LAB-159), não consertado aqui",
  "a porta comum do Symbios rotular a recusa: o `catch` dele chama toda exceção de `relevo.curvas`, então a recusa de versão ou unidade sai com o campo errado — proposto ao chat junto com a anterior",
  "o motor do VIZINHO por dentro: o que o `gerarPlano` faz com a entrada é dele",
];
