/**
 * ════════════════════════════════════════════════════════════════════════════
 *  NENHUMA CHAVE SENSÍVEL NO REPOSITÓRIO — a busca da página, perguntada a cada verde. (LAB-166, item 900, D394)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, do LF-FINAL (14/09/2026), afirma na tabela *Chaves e segredos*, primeira linha:
 *
 * > Nenhuma chave sensível no repositório · ✅ **limpo** · `grep -rE "<a busca>"` sobre todo `.ts`, `.js`, `.json` e
 * > `.rs` fora de `node_modules` e de `upstream/` — **zero ocorrências**
 *
 * (A busca está em {@link A_FONTE}; não a escrevo inteira neste comentário pelo mesmo motivo de a montar em pedaços:
 * escrita inteira, ela se acharia a si mesma — ver {@link NOMES}.)
 *
 * Um comando rodado uma vez, e nenhuma trava o perguntava de novo (espécie *mensagem fixa que afirma estado sem
 * perguntar*). **E o "zero" ficou falso em 05/10/2026**, no LAB-47, que escreveu o espaço reservado da documentação no
 * teste da varredura de segredos; e o LAB-68 (09/10) acrescentou o exemplo de chamada a provedor de IA no teste do
 * vazamento de custo. Refeito em 18/10/2026, o comando da página dá **duas** ocorrências — nenhuma é chave. A linha
 * dizia "zero" havia treze dias, e nada acusou.
 *
 * # A varredura de segredos não responde esta linha
 *
 * Ela existe desde o LAB-47 e é outra pergunta: lê **formato** (o prefixo de cada provedor) e o **nome que se
 * declara** com um valor literal. A busca da página lê o **nome**, sem olhar o valor. Medido em 18/10/2026, com o
 * `varrerTexto` dela sobre oito linhas plantadas com um valor de 21 caracteres alfanuméricos (o de sempre, montado em
 * pedaços): **as oito passaram caladas** — a constante de chave, o campo de chave do cliente, o cabeçalho de
 * autorização com o portador, a constante de segredo, a variável do Vite num JSON. A busca da página acusa **sete**; a
 * oitava, o segredo do JWT colado depois de `JWT_`, escapa das duas — o `\b` não separa `_` do nome, a mesma doença que o
 * LAB-160 achou na varredura com o `DB_` da senha. Duas razões para a varredura calar, as duas dela:
 *
 *   · o cabeçalho de autorização e o portador não estão na lista de nomes da regra do nome que se declara;
 *   · o valor alfanumérico que começa por letra cai no perdão *"identificador de código, não valor"*
 *     (`VALORES_QUE_NAO_SAO_SEGREDO`, a última linha) — e é exatamente a forma de muita chave de verdade.
 *
 * A segunda é um buraco da varredura, não desta linha: vai à `FILA.md` como proposta ao chat (LAB-166), porque mexer
 * no perdão muda a resposta de outra trava, e o item 900 é uma tarefa por disparo. Esta trava fecha a linha da página.
 *
 * # O universo
 *
 * Duas medidas, as duas publicadas:
 *
 *   · **a da página** — o que o `git` carrega, com as quatro extensões dela, fora de `node_modules/` e de toda pasta
 *     `upstream/`. É o comando escrito, refeito;
 *   · **a larga** — tudo o que o `git` carrega em texto, fora o `.md`: o `.mjs`, o `.html` e o `.js` da bancada, o
 *     `.yml` da rotina, o `.sh` do verde, o gancho do envio, o `.toml`, e o `upstream/` também. A chave mora onde o
 *     código mora, e a página só nomeava quatro extensões. O `.md` sai, com o motivo: é onde a casa **fala** destes
 *     nomes (a própria página escreve a busca), e nome em texto corrido não é chave.
 *
 * Toda ocorrência tem de estar declarada uma a uma em {@link DECLARADAS}, com o arquivo, um trecho da linha e o
 * motivo — e só se declara texto de teste de trava (`/tests/`): é o único lugar da casa onde se escreve o nome de
 * propósito, para provar que a régua aprova o caso bom. Declarada que sumiu também reprova: a lista não envelhece
 * calada.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela, como está escrito na página. */
export const A_LINHA = "| Nenhuma chave sensível no repositório";

/**
 * Os nomes da busca da página, **em pedaços**. Escritos inteiros, entre `(` e `|`, eles casam a própria busca — e este
 * arquivo seria a terceira ocorrência. É a lição da varredura (`exemploFalso`) pelo mesmo lado: código que FALA de um
 * nome não é ocorrência dele, e a maneira honesta de garantir isso é o fonte não conter a ocorrência.
 */
export const NOMES: readonly string[] = [
  "api" + "Key",
  "api" + "_key",
  "API" + "_KEY",
  "SEC" + "RET",
  "Bea" + "rer ",
  "Author" + "ization",
  "sk" + "-[A-Za-z0-9]{20}",
  "VI" + "TE_[A-Z_]+",
];

/** A busca da página, como ela a escreve (sem o escape do `|` da tabela). */
export const A_FONTE = String.raw`\b(` + NOMES.join("|") + String.raw`)\b`;

/** As extensões da página. */
export const EXTENSOES_DA_PAGINA: readonly string[] = [".ts", ".js", ".json", ".rs"];

export interface Declarada {
  arquivo: string;
  /** Um pedaço da linha, para casar a ocorrência sem número de linha (que anda). */
  trecho: string;
  motivo: string;
}

/**
 * As ocorrências que não são chave, uma a uma. Os trechos vão em pedaços pelo mesmo motivo de {@link NOMES}.
 */
export const DECLARADAS: readonly Declarada[] = [
  {
    arquivo: "external-engines/esteira/tests/segredos.test.ts",
    trecho: "<a sua chave aqui>",
    motivo:
      "o caso válido que quase parece inválido da varredura de segredos (LAB-47): o espaço reservado de documentação, que a regra do nome que se declara tem de perdoar — o valor é `<…>`, não chave",
  },
  {
    arquivo: "external-engines/esteira/tests/vazamento-de-custo.test.ts",
    trecho: "({ " + "api" + "Key: k })",
    motivo:
      "o exemplo de chamada a provedor de IA que a trava do vazamento de custo (LAB-68) tem de reprovar — o valor é a variável `k`, não chave",
  },
];

export interface Ocorrencia {
  arquivo: string;
  linha: number;
  /** Só o NOME que casou — nunca o resto da linha, que pode trazer o valor (o registro não repete segredo). */
  nome: string;
}

export type TipoDeProblema =
  | "ocorrencia-nao-declarada"
  | "declarada-que-sumiu"
  | "declarada-fora-de-teste"
  | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

export interface Resultado {
  /** Quantos arquivos foram lidos em cada universo — publicado, porque `every` sobre lista vazia é verdade. */
  lidosNaPagina: number;
  lidosNaLarga: number;
  /** O que ficou de fora da larga, por quê, contado. */
  deFora: { binario: number; md: number; naoLido: number };
  ocorrenciasNaPagina: Ocorrencia[];
  ocorrenciasNaLarga: Ocorrencia[];
  problemas: Problema[];
}

const extensao = (c: string): string => {
  const nome = c.split("/").pop() ?? c;
  const i = nome.lastIndexOf(".");
  return i <= 0 ? "" : nome.slice(i).toLowerCase();
};

/** O universo da página: as quatro extensões, fora de `node_modules/` e de toda pasta `upstream/`. */
export const naPagina = (c: string): boolean =>
  EXTENSOES_DA_PAGINA.includes(extensao(c)) &&
  !c.split("/").includes("node_modules") &&
  !c.split("/").includes("upstream");

/** As ocorrências da busca num texto, linha a linha. */
export function buscarNoTexto(texto: string, arquivo: string): Ocorrencia[] {
  const saida: Ocorrencia[] = [];
  const linhas = texto.split("\n");
  for (let i = 0; i < linhas.length; i++) {
    const re = new RegExp(A_FONTE, "g");
    for (const m of (linhas[i] ?? "").matchAll(re)) saida.push({ arquivo, linha: i + 1, nome: m[1] ?? m[0] });
  }
  return saida;
}

/**
 * A conferência sobre arquivos já lidos. `textos` é `caminho → conteúdo` (ou `null` para binário, `undefined` para não
 * lido) — separado da leitura para o teste plantar uma árvore de mentira.
 */
export function conferirOsTextos(
  textos: ReadonlyMap<string, string | null | undefined>,
  declaradas: readonly Declarada[] = DECLARADAS,
): Resultado {
  const deFora = { binario: 0, md: 0, naoLido: 0 };
  const ocorrenciasNaPagina: Ocorrencia[] = [];
  const ocorrenciasNaLarga: Ocorrencia[] = [];
  const linhasDe = new Map<string, string[]>();
  let lidosNaPagina = 0;
  let lidosNaLarga = 0;

  for (const [c, t] of textos) {
    if (extensao(c) === ".md") {
      deFora.md += 1;
      continue;
    }
    if (t === undefined) {
      deFora.naoLido += 1;
      continue;
    }
    if (t === null) {
      deFora.binario += 1;
      continue;
    }
    const achadas = buscarNoTexto(t, c);
    lidosNaLarga += 1;
    ocorrenciasNaLarga.push(...achadas);
    if (naPagina(c)) {
      lidosNaPagina += 1;
      ocorrenciasNaPagina.push(...achadas);
    }
    if (achadas.length > 0) linhasDe.set(c, t.split("\n"));
  }

  const problemas: Problema[] = [];
  if (lidosNaPagina === 0 || lidosNaLarga === 0)
    problemas.push({
      tipo: "universo-vazio",
      detalhe: `lidos ${lidosNaPagina} na página e ${lidosNaLarga} na larga — verde sobre zero não é verde`,
    });

  const usadas = new Set<number>();
  for (const o of ocorrenciasNaLarga) {
    const linha = linhasDe.get(o.arquivo)?.[o.linha - 1] ?? "";
    const i = declaradas.findIndex((d) => d.arquivo === o.arquivo && linha.includes(d.trecho));
    if (i < 0) {
      problemas.push({
        tipo: "ocorrencia-nao-declarada",
        detalhe: `${o.arquivo}:${o.linha}: o nome \`${o.nome}\` da busca da página. Se é chave, tire do git — e a chave está vazada e se troca; se não é, declare em DECLARADAS com o motivo`,
      });
      continue;
    }
    usadas.add(i);
  }
  declaradas.forEach((d, i) => {
    if (!d.arquivo.split("/").includes("tests"))
      problemas.push({
        tipo: "declarada-fora-de-teste",
        detalhe: `${d.arquivo}: só se declara texto de teste de trava; fora de \`tests/\` o nome é código, e o lugar dele é variável de ambiente`,
      });
    if (!usadas.has(i))
      problemas.push({
        tipo: "declarada-que-sumiu",
        detalhe: `${d.arquivo}: o trecho declarado não tem mais ocorrência da busca — tire a linha de DECLARADAS`,
      });
  });

  return { lidosNaPagina, lidosNaLarga, deFora, ocorrenciasNaPagina, ocorrenciasNaLarga, problemas };
}

/** A árvore de verdade: o que o `git` desta casa carrega hoje. */
export function conferirAArvore(raiz: string): Resultado {
  const textos = new Map<string, string | null | undefined>();
  for (const c of arquivosQueOGitCarrega(raiz)) {
    if (extensao(c) === ".md") {
      textos.set(c, "");
      continue;
    }
    try {
      const bruto = readFileSync(join(raiz, c));
      textos.set(c, bruto.includes(0) ? null : bruto.toString("utf8"));
    } catch {
      textos.set(c, undefined);
    }
  }
  return conferirOsTextos(textos);
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "chave guardada num nome que não está na busca (`const x = \"…\"`, `SUPABASE_SERVICE_ROLE_KEY`): a pergunta é pelos oito nomes da página; o formato é da varredura de segredos (LAB-47), e o que ela perdoa como identificador também escapa daqui",
  "o nome colado depois de `_` (`JWT_` + o segredo, `DB_` + a chave): o `\\b` da busca da página não separa `_` de letra, e esta trava pergunta a busca da página letra por letra — fechar o buraco é mudar a busca, e a página com ela (proposto ao chat no LAB-166, junto com o perdão da varredura)",
  "o `.md`: a casa fala destes nomes em texto corrido (a própria página escreve a busca), e a chave colada num relatório só a varredura de segredos lê — ela cobre `docs/`",
  "o binário (o `.png`): não tem linha de texto onde um nome more",
  "a história: chave que entrou e saiu num commit antigo continua no GitHub, e esta trava lê a árvore de hoje — como a varredura de segredos, que declara o mesmo buraco; o remédio é trocar a chave",
  "o que o `.gitignore` deixa no disco: não sai daqui, e é o jeito certo de ter uma chave local",
  "os repositórios vizinhos: são deles, e o Lab não escreve neles",
];
