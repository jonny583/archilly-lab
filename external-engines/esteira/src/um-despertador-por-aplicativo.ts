/**
 * UM DESPERTADOR POR APLICATIVO; NUNCA SE TOCA NO DE OUTRO REPOSITÓRIO — e nada perguntava quais ids esta casa
 * escreve. (LAB-145, item 900, a dívida própria, D373)
 *
 * # A regra, e o lugar onde ela deixa marca
 *
 * O `CLAUDE.md` §1-A diz: *"Regra de família: **um despertador por aplicativo; nunca se toca no de outro
 * repositório.**"* A guarda que havia (`disparos-do-despertador.ts`, item 004) confere **um id só na seção** do
 * `ONDE_PARAMOS.md` — é a casa única do id VIVO. Nada lia o resto do repositório, nem a história, nem os vizinhos.
 *
 * Tocar num despertador **não deixa rastro aqui** (a conta é de fora da árvore). O que deixa rastro é o **id**: toda
 * vez que esta casa criou, religou, desligou ou apagou um despertador, o recado ou o relatório escreveu o id. Então a
 * regra é perguntável por três LUGARES:
 *
 * 1. **a árvore desta casa** — todo `trig_…` escrito num arquivo versionado é de um despertador DESTA casa, registrado
 *    em {@link OS_DESPERTADORES_DA_CASA}, ou é um id inventado de teste, declarado em {@link FICTICIOS}. Um id de outro
 *    repositório escrito aqui é o rastro do *"tocar no de outro"* — ou de um despertador nascido sem registro;
 * 2. **o registro, contra a história** — cada despertador tem onde nasceu e onde terminou, o trecho está no arquivo, e
 *    as vidas não se sobrepõem: **um por vez**, e **exatamente um vivo**, o mesmo que a seção do `ONDE_PARAMOS.md`
 *    declara;
 * 3. **os vizinhos** (com clone) — nenhum id do registro aparece na árvore do Generate, do Laboratório de Parcelamento
 *    ou do Geo. O despertador desta casa não é o de mais ninguém.
 *
 * # O que se mediu (17/10/2026), por LUGAR
 *
 * `git grep` na árvore inteira: **cinco** ids distintos, em **dez** arquivos. Quatro são desta casa; o quinto,
 * `trig_outroQualquer`, é inventado num teste do item 004. Os quatro, lidos na história: o `01DF…` (LF-01,
 * 14/09 → apagado em 15/09), o `01Ers…` (LAB-17 → apagado no LAB-16, 20/09), o `01R5…` (LAB-19 → apagado no
 * LAB-20, 02/10) e o `01Xw…` (criado 02/10, 23:35Z, vivo). **E há um quinto despertador da casa sem id escrito**:
 * o do LAB-18, criado no reforço do LAB-20 (*"Criei o despertador para executá-lo"*, 02/10 21:38Z) e apagado no fim do
 * LAB-18 (22:28Z) — nenhum arquivo guardou o id dele. Entra no registro com `id: null` (não medi, nunca zero — D23), e
 * a régua diz que não o alcança. Nos vizinhos: dois ids no Generate (6 arquivos), nove no Laboratório de Parcelamento (11), um no Geo (4) —
 * **nenhum** desta casa. Regra cumprida por disciplina, sem guarda: *regra sem guarda*.
 *
 * # O que esta régua decide, e é uma função pura
 *
 * Recebe os ids lidos por arquivo (desta casa e, se houver, de cada vizinho) e o texto dos arquivos de nascimento e de
 * fim; devolve os problemas e o universo lido. Ler o `git` é do chamador ({@link ARGUMENTOS_DO_GREP}, {@link lerOGrep}).
 */

/** A regra, como o `CLAUDE.md` §1-A a escreve — a trava confere que ela continua lá. */
export const A_REGRA = "um despertador por aplicativo; nunca se toca no de outro repositório.";

/** `git grep` sobre os arquivos versionados da árvore de trabalho: só o id, com o arquivo (separado por NUL), sem binário. */
export const ARGUMENTOS_DO_GREP = ["grep", "-I", "-o", "--null", "-E", "trig_[A-Za-z0-9]+"] as const;

/** Um trecho que tem de estar, literal, num arquivo da casa. */
export interface Rastro {
  arquivo: string;
  trecho: string;
}

export interface DespertadorDaCasa {
  /** O id, como a conta o devolveu — ou `null` quando nenhum arquivo o guardou (não medi; nunca um id suposto). */
  id: string | null;
  /** `DD/MM/AAAA`. */
  nasceu: string;
  /** `DD/MM/AAAA`, ou `vivo`. */
  terminou: string;
  nascimento: Rastro;
  /** `null` só para o vivo. */
  fim: Rastro | null;
}

/**
 * OS DESPERTADORES QUE ESTA CASA TEVE, em ordem de nascimento. Lista fechada: despertador novo entra aqui no mesmo
 * commit em que o id aparece na árvore, e o vivo de antes ganha o `fim`.
 */
export const OS_DESPERTADORES_DA_CASA: readonly DespertadorDaCasa[] = [
  {
    id: "trig_01DFdwqF4nUDLQAod5w4WH1m",
    nasceu: "14/09/2026",
    terminou: "15/09/2026",
    nascimento: { arquivo: "docs/relatorios/LF-01.md", trecho: "| id | `trig_01DFdwqF4nUDLQAod5w4WH1m` |" },
    fim: { arquivo: "docs/relatorios/RECADOS.md", trecho: "não há despertador desde 15/09 às 07:06" },
  },
  {
    id: "trig_01ErsHXVhfTZziHEGGYcBjiJ",
    nasceu: "20/09/2026",
    terminou: "20/09/2026",
    nascimento: { arquivo: "docs/relatorios/LAB-17.md", trecho: "Criado: **`trig_01ErsHXVhfTZziHEGGYcBjiJ`**" },
    fim: { arquivo: "docs/relatorios/RECADOS.md", trecho: "Apaguei o despertador trig_01ErsHXVhfTZziHEGGYcBjiJ" },
  },
  {
    id: "trig_01R5tGpexnnGCHouc1aQGsi9",
    nasceu: "02/10/2026",
    terminou: "02/10/2026",
    nascimento: { arquivo: "docs/relatorios/RECADOS.md", trecho: "despertador trig_01R5tGpexnnGCHouc1aQGsi9 ligado" },
    fim: { arquivo: "docs/relatorios/RECADOS.md", trecho: "APAGUEI o despertador trig_01R5tGpexnnGCHouc1aQGsi9" },
  },
  {
    id: null,
    nasceu: "02/10/2026",
    terminou: "02/10/2026",
    nascimento: { arquivo: "docs/relatorios/RECADOS.md", trecho: "Criei o despertador para executá-lo" },
    fim: { arquivo: "docs/relatorios/RECADOS.md", trecho: "FILA ESGOTADA — apaguei o despertador (D62)" },
  },
  {
    id: "trig_01XwSkTLT9zmyprNZcUiWy7f",
    nasceu: "02/10/2026",
    terminou: "vivo",
    nascimento: { arquivo: "docs/ONDE_PARAMOS.md", trecho: "| criado em | 02/10/2026, 23:35Z |" },
    fim: null,
  },
];

/** Um id inventado num teste — não é de despertador nenhum, e por isso é declarado com o arquivo. */
export interface Ficticio {
  arquivo: string;
  id: string;
  motivo: string;
}

export const FICTICIOS: readonly Ficticio[] = [
  {
    arquivo: "external-engines/esteira/tests/disparos-em-vazio.test.ts",
    id: "trig_outroQualquer",
    motivo: "o segundo id da seção, que a trava do item 004 tem de acusar (D234)",
  },
  {
    arquivo: "external-engines/esteira/tests/um-despertador-por-aplicativo.test.ts",
    id: "trig_DeOutraCasa",
    motivo: "o id de um vizinho escrito nesta casa, que esta trava tem de acusar",
  },
];

/**
 * ESTE ARQUIVO é onde a lista dos fictícios mora — então ele escreve cada um deles uma vez, na declaração. É a única
 * exceção da árvore, e ela vale só para os ids de {@link FICTICIOS}: um id estranho que entrasse aqui fora da lista
 * continua acusado. (Abreviar um id real num comentário, com o prefixo, também é acusado: a primeira rodada desta régua
 * acusou quatro abreviações minhas neste cabeçalho, e elas saíram.)
 */
export const O_PROPRIO_ARQUIVO = "external-engines/esteira/src/um-despertador-por-aplicativo.ts";

/** Os ids achados num arquivo. */
export interface IdsDoArquivo {
  arquivo: string;
  ids: string[];
}

export type TipoDeProblema =
  /** Um id na árvore que não é de despertador desta casa nem fictício declarado. */
  | "id-estranho"
  /** Um fictício declarado que não está mais no arquivo dele (a lista mentiria pelo silêncio). */
  | "ficticio-sumiu"
  /** O trecho de nascimento ou de fim não está no arquivo, ou o id não está no arquivo do nascimento. */
  | "sem-rastro"
  /** Dois despertadores vivos ao mesmo tempo: um nasceu antes de o anterior terminar. */
  | "dois-ao-mesmo-tempo"
  /** Nenhum vivo, mais de um, ou o vivo fora do fim da lista. */
  | "o-vivo"
  /** O vivo do registro não é o id que a seção do `ONDE_PARAMOS.md` declara. */
  | "o-vivo-nao-e-o-da-secao"
  /** Um id do registro aparece na árvore de um vizinho. */
  | "o-despertador-e-de-outro";

export interface Problema {
  tipo: TipoDeProblema;
  detalhe: string;
}

export interface Universo {
  arquivosComId: number;
  idsDistintos: number;
  /** Por vizinho lido: arquivos com id e ids distintos. Vazio quando a conferência roda sem clones. */
  vizinhos: { nome: string; arquivosComId: number; idsDistintos: number }[];
}

export interface Conferencia {
  problemas: Problema[];
  universo: Universo;
}

/** `DD/MM/AAAA` → `AAAAMMDD`, para comparar. */
const ordenavel = (d: string): string => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
  if (!m) throw new Error(`data fora do formato DD/MM/AAAA: ${d}`);
  return `${m[3]}${m[2]}${m[1]}`;
};

/**
 * Lê a saída de `git grep --null -o` (sem `-h`): cada linha é `arquivo\0id`. Uma linha sem `\0` é forma que a régua
 * não conhece — e lança, em vez de sumir.
 */
export function lerOGrep(saida: string): IdsDoArquivo[] {
  const porArquivo = new Map<string, Set<string>>();
  for (const linha of saida.split("\n")) {
    if (linha === "") continue;
    const i = linha.indexOf("\0");
    if (i < 0) throw new Error(`linha do git grep sem o separador: ${linha}`);
    const arquivo = linha.slice(0, i);
    const id = linha.slice(i + 1);
    if (!porArquivo.has(arquivo)) porArquivo.set(arquivo, new Set());
    porArquivo.get(arquivo)!.add(id);
  }
  return [...porArquivo].map(([arquivo, ids]) => ({ arquivo, ids: [...ids].sort() }));
}

export interface Entrada {
  /** Os ids desta casa, por arquivo. */
  casa: IdsDoArquivo[];
  /** O texto de cada arquivo citado pelo registro (nascimento e fim). Arquivo que não veio é `sem-rastro`. */
  textos: Record<string, string>;
  /** Os ids que a seção do `ONDE_PARAMOS.md` declara (`lerAConta(...).idsCitados`). */
  idsDaSecao: string[];
  /** Os vizinhos lidos. Omitido no portão sem clones. */
  vizinhos?: { nome: string; ids: IdsDoArquivo[] }[];
  registro?: readonly DespertadorDaCasa[];
  ficticios?: readonly Ficticio[];
}

export function conferirOsDespertadores(e: Entrada): Conferencia {
  const registro = e.registro ?? OS_DESPERTADORES_DA_CASA;
  const ficticios = e.ficticios ?? FICTICIOS;
  const problemas: Problema[] = [];
  const daCasa = new Set(registro.map((d) => d.id).filter((id): id is string => id !== null));

  // 1 · a árvore: todo id é da casa ou fictício declarado no arquivo dele
  for (const { arquivo, ids } of e.casa) {
    for (const id of ids) {
      if (daCasa.has(id)) continue;
      if (ficticios.some((f) => f.arquivo === arquivo && f.id === id)) continue;
      if (arquivo === O_PROPRIO_ARQUIVO && ficticios.some((f) => f.id === id)) continue;
      problemas.push({
        tipo: "id-estranho",
        detalhe: `${arquivo}: ${id} não é despertador desta casa nem fictício declarado — é de outro repositório, ou nasceu sem registro`,
      });
    }
  }
  for (const f of ficticios) {
    const la = e.casa.find((a) => a.arquivo === f.arquivo);
    if (!la?.ids.includes(f.id)) {
      problemas.push({ tipo: "ficticio-sumiu", detalhe: `${f.arquivo}: o fictício ${f.id} não está mais lá` });
    }
  }

  // 2 · o registro contra a história
  for (const d of registro) {
    const nome = d.id ?? `o sem id, nascido em ${d.nasceu}`;
    for (const r of [d.nascimento, d.fim]) {
      if (r === null) continue;
      const texto = e.textos[r.arquivo];
      if (texto === undefined || !texto.includes(r.trecho)) {
        problemas.push({ tipo: "sem-rastro", detalhe: `${nome}: "${r.trecho}" não está em ${r.arquivo}` });
      }
    }
    if (d.id !== null && !(e.textos[d.nascimento.arquivo] ?? "").includes(d.id)) {
      problemas.push({ tipo: "sem-rastro", detalhe: `${nome}: o id não está no arquivo do nascimento` });
    }
    if ((d.terminou === "vivo") !== (d.fim === null)) {
      problemas.push({ tipo: "sem-rastro", detalhe: `${nome}: vivo sem fim, ou fim sem ter terminado — um dos dois` });
    }
  }
  const vivos = registro.filter((d) => d.terminou === "vivo");
  if (vivos.length !== 1 || registro.at(-1)?.terminou !== "vivo") {
    problemas.push({ tipo: "o-vivo", detalhe: `${vivos.length} vivo(s); tem de ser um só, e o último da lista` });
  }
  for (let i = 1; i < registro.length; i++) {
    const antes = registro[i - 1]!;
    const agora = registro[i]!;
    const fimDeAntes = antes.terminou === "vivo" ? "99999999" : ordenavel(antes.terminou);
    if (ordenavel(agora.nasceu) < fimDeAntes) {
      problemas.push({
        tipo: "dois-ao-mesmo-tempo",
        detalhe: `${agora.id ?? "o sem id"} nasceu em ${agora.nasceu}, e ${antes.id ?? "o sem id"} só terminou em ${antes.terminou}`,
      });
    }
  }
  const vivo = vivos[0]?.id ?? null;
  if (vivo === null || e.idsDaSecao.length !== 1 || e.idsDaSecao[0] !== vivo) {
    problemas.push({
      tipo: "o-vivo-nao-e-o-da-secao",
      detalhe: `o registro diz ${vivo ?? "nenhum"}; a seção do ONDE_PARAMOS diz ${e.idsDaSecao.join(", ") || "nenhum"}`,
    });
  }

  // 3 · os vizinhos: nenhum id desta casa na árvore deles
  for (const v of e.vizinhos ?? []) {
    for (const { arquivo, ids } of v.ids) {
      for (const id of ids) {
        if (daCasa.has(id)) {
          problemas.push({ tipo: "o-despertador-e-de-outro", detalhe: `${v.nome}: ${arquivo} escreve ${id}` });
        }
      }
    }
  }

  const distintos = (xs: IdsDoArquivo[]) => new Set(xs.flatMap((x) => x.ids)).size;
  return {
    problemas,
    universo: {
      arquivosComId: e.casa.length,
      idsDistintos: distintos(e.casa),
      vizinhos: (e.vizinhos ?? []).map((v) => ({ nome: v.nome, arquivosComId: v.ids.length, idsDistintos: distintos(v.ids) })),
    },
  };
}

/** O que esta régua NÃO alcança — vai na saída da trava, para ninguém ler o verde como mais do que ele é. */
export const O_QUE_ISTO_NAO_ALCANCA = [
  "o TOQUE em si: mexer num despertador é um ato na conta, fora da árvore — a régua lê o id que o ato deixa escrito, e um toque que não escrevesse id nenhum passa",
  "o despertador sem id escrito: o do LAB-18 (02/10) está no registro com id null, conferido pelo trecho, não pelo id",
  "a hora: as vidas se comparam pela DATA; dois despertadores do mesmo dia que se sobrepusessem por horas passam",
  "os vizinhos que não estão clonados aqui: lê o Generate, o Laboratório de Parcelamento e o Geo; as outras oito casas e a direção não",
  "o id que um vizinho escreve no histórico e já apagou da árvore: lê a árvore de hoje de cada um, não a história",
] as const;
