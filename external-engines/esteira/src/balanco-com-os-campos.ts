/**
 * O BALANÇO VAI AO ARQUIVO COM DATA, ORIGEM, CONTEÚDO E PROVA — E SÓ TRÊS DE ONZE ERAM PERGUNTADOS. (LAB-150, item
 * 900, a dívida própria, D378)
 *
 * # A regra, e o que a guardava
 *
 * O `CLAUDE.md` §1-B diz: *"Vai a `docs/relatorios/BALANCOS.md` com **data, origem, conteúdo e prova**."* E o próprio
 * `BALANCOS.md`, em *"Como este arquivo funciona"*, promete mais: *"Cada balanço traz: **data**, **origem**, **o que
 * ele continha**, **o que ele produziu** e **onde está a prova**."*
 *
 * A guarda do LAB-42 (`tests/balancos.test.ts`) olha só as entradas do §1 (`### 1.N · data — …`), e nelas só duas das
 * cinco coisas — `origem` e `o que produziu` — mais o *"onde está o original"*. Os oito saldos que nasceram dentro do
 * arquivo (`## 3` a `## 10`) não eram lidos, e `conteúdo` e `prova` não eram perguntados em entrada nenhuma. Tirar a
 * linha *"onde está a prova"* do §8, ou escrever um §11 sem tabela nenhuma, deixava a suíte inteira verde.
 *
 * # O que se mediu (17/10/2026), por LUGAR
 *
 * Um balanço mora num lugar só: um título do `BALANCOS.md` com número de seção e **data** (`### 1.1 · 03/10/2026 — …`,
 * `## 8 · O saldo da fila LAB-53 a LAB-57 — 07/10/2026`). O §2 é o índice dos que moram num recado, e não tem data no
 * título: não é entrada. Os campos moram na tabela de campos logo abaixo do título (`| **origem** | … |`), antes do
 * primeiro subtítulo.
 *
 * **Onze entradas. Duas completas (§7 e §8). Nove com campo faltando**, todas anteriores a esta trava:
 *
 * | entrada | falta |
 * |---|---|
 * | 1.1, 1.2, 1.3 | conteúdo e prova (a tabela tem origem, original e produziu — a forma do LAB-42) |
 * | 3, 4, 5 | os quatro: nasceram sem tabela de campos, o saldo é a própria tabela de prompts |
 * | 6 | prova |
 * | 9, 10 | o que produziu (há *estado* no lugar) |
 *
 * Congeladas em {@link FALTAVA_ANTES_DA_TRAVA}, com o motivo, porque o balanço é o registro do dia e não se reescreve
 * para passar (D118). **Balanço novo traz os cinco, sem exceção.**
 *
 * # O que ela NÃO alcança, dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */

/** A frase do `CLAUDE.md` §1-B que esta trava faz perguntar. */
export const A_REGRA = "com data, origem, conteúdo e prova";

/** O dia desta trava: entrada datada depois dele não se congela — traz os campos. */
export const DIA_DA_TRAVA = "2026-10-17";

/**
 * Os campos, com o nome que a casa escreve na tabela. A data não é campo de tabela: mora no título, e é o que faz o
 * título ser entrada. `conteudo` e `prova` são as duas palavras do `CLAUDE.md`; `produziu` é a promessa do próprio
 * arquivo.
 */
export const CAMPOS = {
  origem: /^origem$/,
  conteudo: /^o que (ele )?continha\b/,
  produziu: /^o que (ele )?produziu\b/,
  prova: /^onde est[áa] a prova\b/,
} as const;

export type Campo = keyof typeof CAMPOS;
export const NOMES_DOS_CAMPOS = Object.keys(CAMPOS) as Campo[];

export interface EntradaDeBalanco {
  /** O número da seção (`1.1`, `8`) — é a chave das declarações. */
  numero: string;
  linha: number;
  titulo: string;
  /** A data do título, em ISO (`2026-10-07`), ou `null` se ela não é um dia que existe. */
  data: string | null;
  campos: Campo[];
}

const TITULO_DE_ENTRADA = /^(#{2,3})\s+(\d+(?:\.\d+)?)\s*·\s*(.*\b(\d{2})\/(\d{2})\/(\d{4})\b.*)$/;
const LINHA_DE_CAMPO = /^\|\s*\*\*([^*|]+)\*\*\s*\|/;

function dataISO(d: string, m: string, a: string): string | null {
  const dia = Number(d);
  const mes = Number(m);
  const ano = Number(a);
  if (!Number.isFinite(dia) || !Number.isFinite(mes) || !Number.isFinite(ano)) return null;
  const t = new Date(Date.UTC(ano, mes - 1, dia));
  if (t.getUTCFullYear() !== ano || t.getUTCMonth() !== mes - 1 || t.getUTCDate() !== dia) return null;
  return `${a}-${m}-${d}`;
}

/** As entradas de balanço do texto, com os campos que a tabela delas traz. Blocos de código não contam. */
export function entradasDoBalanco(texto: string): EntradaDeBalanco[] {
  const linhas = texto.split("\n");
  const entradas: EntradaDeBalanco[] = [];
  let bloco = false;
  let atual: EntradaDeBalanco | null = null;
  let lendoCampos = false;
  for (let i = 0; i < linhas.length; i++) {
    const l = linhas[i]!;
    if (/^\s*```/.test(l)) {
      bloco = !bloco;
      continue;
    }
    if (bloco) continue;
    if (/^#{1,6}\s/.test(l)) {
      const t = TITULO_DE_ENTRADA.exec(l);
      if (t) {
        atual = {
          numero: t[2]!,
          linha: i + 1,
          titulo: t[3]!.trim(),
          data: dataISO(t[4]!, t[5]!, t[6]!),
          campos: [],
        };
        entradas.push(atual);
        lendoCampos = true;
      } else {
        // O primeiro subtítulo fecha a tabela de campos: tabela mais abaixo é conteúdo, não campo.
        lendoCampos = false;
      }
      continue;
    }
    if (!atual || !lendoCampos) continue;
    const c = LINHA_DE_CAMPO.exec(l);
    if (!c) continue;
    const nome = c[1]!.trim().toLowerCase();
    for (const campo of NOMES_DOS_CAMPOS)
      if (CAMPOS[campo].test(nome) && !atual.campos.includes(campo)) atual.campos.push(campo);
  }
  return entradas;
}

export interface Congelada {
  faltam: readonly Campo[];
  motivo: string;
}

/**
 * As entradas que já faltavam campo antes desta trava. Não se reescreve balanço antigo para passar (D118): congela-se
 * exatamente o que falta, com o motivo, e a lista só desce — campo acrescentado depois faz a declaração sobrar.
 */
export const FALTAVA_ANTES_DA_TRAVA: Readonly<Record<string, Congelada>> = {
  "1.1": {
    faltam: ["conteudo", "prova"],
    motivo:
      "balanço que foi só para o chat, reconstruído no LAB-42: o conteúdo está no corpo (a tabela RECONSTRUÍDA) e não há prova, porque o original não existe",
  },
  "1.2": {
    faltam: ["conteudo", "prova"],
    motivo:
      "a lista de proposto ao chat de 04/10: o conteúdo é a seção da FILA.md que o campo 'onde está o original' aponta, e a tabela é a forma do LAB-42",
  },
  "1.3": {
    faltam: ["conteudo", "prova"],
    motivo:
      "a auditoria das pendências de 05/10: o conteúdo e a conta moram no §5 deste arquivo, que o campo 'onde está o original' aponta",
  },
  "3": {
    faltam: ["origem", "conteudo", "produziu", "prova"],
    motivo:
      "o primeiro saldo nascido dentro do arquivo (LAB-42), sem tabela de campos: o saldo é a própria tabela de prompts, e a forma de campos só veio no §6",
  },
  "4": {
    faltam: ["origem", "conteudo", "produziu", "prova"],
    motivo:
      "o segundo saldo nascido dentro do arquivo (LAB-47), na forma do §3: tabela de prompts e números da fila, sem tabela de campos",
  },
  "5": {
    faltam: ["origem", "conteudo", "produziu", "prova"],
    motivo:
      "a auditoria das pendências de 05/10, cuja tabela de campos mora no §1.3, que aponta para cá: o §5 é o corpo dela",
  },
  "6": {
    faltam: ["prova"],
    motivo:
      "o saldo da fila LAB-48 a LAB-52, o primeiro com tabela de campos: a linha 'onde está a prova' só nasceu no §7, no mesmo dia",
  },
  "9": {
    faltam: ["produziu"],
    motivo:
      "o saldo da fila LAB-58 a LAB-61: a tabela trocou 'o que produziu' por 'estado', e o que a fila produziu está na seção 'O que a fila FECHOU'",
  },
  "10": {
    faltam: ["produziu"],
    motivo:
      "o saldo da fila de 08/10: a tabela trocou 'o que produziu' por 'estado' e 'o que continha ao fim', na forma do §9",
  },
};

export type TipoDoProblema =
  | "campo-faltando"
  | "data-que-nao-existe"
  | "excecao-depois-da-trava"
  | "declaracao-que-sobra"
  | "motivo-curto"
  | "universo-vazio";

export interface ProblemaDoBalanco {
  onde: string;
  tipo: TipoDoProblema;
  detalhe: string;
}

export interface ResultadoDoBalanco {
  entradas: EntradaDeBalanco[];
  completas: number;
  problemas: ProblemaDoBalanco[];
}

/** Confere o texto do `BALANCOS.md`. */
export function conferirOsCamposDoBalanco(
  texto: string,
  congeladas: Readonly<Record<string, Congelada>> = FALTAVA_ANTES_DA_TRAVA,
  diaDaTrava: string = DIA_DA_TRAVA,
): ResultadoDoBalanco {
  const entradas = entradasDoBalanco(texto);
  const problemas: ProblemaDoBalanco[] = [];
  if (entradas.length === 0)
    problemas.push({
      onde: "BALANCOS.md",
      tipo: "universo-vazio",
      detalhe: "nenhuma entrada de balanço lida — a régua não leu nada (D164)",
    });

  const porNumero = new Map(entradas.map((e) => [e.numero, e]));
  let completas = 0;
  for (const e of entradas) {
    const onde = `BALANCOS.md:${e.linha} (§${e.numero})`;
    if (e.data === null)
      problemas.push({ onde, tipo: "data-que-nao-existe", detalhe: `"${e.titulo}": a data do título não é um dia` });
    const faltam = NOMES_DOS_CAMPOS.filter((c) => !e.campos.includes(c));
    if (faltam.length === 0) {
      completas++;
      continue;
    }
    const congelada = congeladas[e.numero];
    if (congelada) {
      if (e.data !== null && e.data > diaDaTrava)
        problemas.push({
          onde,
          tipo: "excecao-depois-da-trava",
          detalhe: `entrada de ${e.data}, depois da trava (${diaDaTrava}) — balanço novo não se congela, traz os campos`,
        });
      const novos = faltam.filter((c) => !congelada.faltam.includes(c));
      if (novos.length > 0)
        problemas.push({
          onde,
          tipo: "campo-faltando",
          detalhe: `falta ${novos.join(", ")} além do que estava congelado — o CLAUDE.md §1-B manda data, origem, conteúdo e prova`,
        });
      continue;
    }
    problemas.push({
      onde,
      tipo: "campo-faltando",
      detalhe: `"${e.titulo}" não traz ${faltam.join(", ")} na tabela de campos — o CLAUDE.md §1-B manda data, origem, conteúdo e prova`,
    });
  }

  for (const [numero, c] of Object.entries(congeladas)) {
    if (c.motivo.trim().length < 40)
      problemas.push({ onde: `§${numero}`, tipo: "motivo-curto", detalhe: "motivo com menos de 40 caracteres" });
    const e = porNumero.get(numero);
    if (!e) {
      problemas.push({ onde: `§${numero}`, tipo: "declaracao-que-sobra", detalhe: "a entrada não existe mais" });
      continue;
    }
    const jaTem = c.faltam.filter((campo) => e.campos.includes(campo));
    if (jaTem.length > 0)
      problemas.push({
        onde: `§${numero}`,
        tipo: "declaracao-que-sobra",
        detalhe: `congelada sem ${jaTem.join(", ")}, e o campo existe — a lista desce com a árvore`,
      });
  }
  return { entradas, completas, problemas };
}

/** O que esta régua não alcança — dito, para não mentir pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se o que o campo diz é verdade: a régua confere que a linha existe na tabela de campos, não o conteúdo dela",
  "o balanço que foi só para o chat e nunca chegou ao arquivo — o que não está nele não se lê (é o prejuízo do LAB-36)",
  "o balanço que mora num recado (o índice do §2): esse tem a guarda do LAB-42, que confere que a seção existe",
  "entrada escrita com título sem número de seção ou sem data: a régua reconhece a entrada pela forma do título",
  "campo escrito fora da tabela de campos, em prosa ou abaixo do primeiro subtítulo: não conta",
  "a etiqueta de reconstrução com a fonte de cada linha: é a guarda do LAB-42, só no balanço de 03/10",
];
