/**
 * BALANÇO QUE JÁ MORA NUM RECADO NÃO SE COPIA — E NADA PERGUNTAVA. (LAB-156, item 900, a dívida própria, D384)
 *
 * # A regra, e o que a guardava
 *
 * O `CLAUDE.md` §1-B diz: *"**Balanço que já mora num recado não se copia:** aponta-se para ele."* E o próprio
 * `BALANCOS.md`, em *"Como este arquivo funciona"*, explica o porquê: *"Copiar criaria a segunda montagem que o D116
 * proíbe."*
 *
 * A frase tem duas metades, e só uma tinha guarda:
 *
 * - **"aponta-se para ele"** — a guarda do LAB-42 (`tests/balancos.test.ts`, *"o índice do §2 não aponta para o
 *   vazio"*) confere que toda seção citada no índice do §2 existe no `RECADOS.md`, com o título igual;
 * - **"não se copia"** — nada. Medido por mutação: as linhas `Estado:` e `Feito:` do recado do LAB-37 (o quarto
 *   balanço do índice, 1 406 caracteres) coladas no §2 do `BALANCOS.md` deixaram a suíte inteira da esteira como
 *   estava, 1 840 aprovadas e as 9 reprovações do `.wasm` de sempre.
 *
 * # O que se mediu (17/10/2026), por LUGAR
 *
 * Os dois lugares são os dois arquivos: o `BALANCOS.md` (44 444 bytes) e o `RECADOS.md` (576 813 bytes). Cópia é
 * **texto igual nos dois**, lido como a regra se lê ({@link comoARegraSeLe}: sem a marca de citação, sem negrito, com
 * o espaço e a quebra de linha colapsados — a largura da coluna não pode esconder uma cópia).
 *
 * Contando os trechos contíguos em comum, seção por seção do `BALANCOS.md`, por tamanho da janela:
 *
 * | janela | trechos em comum | o maior | o que são |
 * |---|---|---|---|
 * | 40 | 64 | 155 | frases-lema da casa, endereços, meias frases repetidas pela mesma mão |
 * | 60 | 22 | 155 | idem |
 * | 80 | 8 | 155 | sete frases de 81 a 98 caracteres que a mesma mão escreveu nos dois, e o de 155 |
 * | 100 | **1** | 155 | o de 155 |
 * | 120 | **1** | 155 | o de 155 |
 * | 160 | 0 | — | — |
 *
 * **O único trecho de 120 ou mais tem 155 caracteres e corre no sentido CONTRÁRIO ao da regra.** É a lista das cinco
 * propostas do saldo do §6 (*"o conserto das 36 violações que são a minha ponte (com a guarda ao lado, D136); a
 * correção da moldura do D159 nos três lugares onde ela saiu; …"*), que nasceu no `BALANCOS.md` e que o recado do
 * LAB-52 (07/10/2026) repetiu na linha *Próximo na fila*, **depois de apontar** para ela (*"O saldo dos cinco está no
 * BALANCOS.md §6"*). O balanço mora no arquivo e o recado aponta — é a regra cumprida, com o recado dizendo o que vem
 * a seguir. Declarado em {@link COPIAS_DECLARADAS}, com o motivo; o recado enviado não se reescreve (D118).
 *
 * **E uma primeira medição minha disse zero, errada:** lida a cru (com o negrito), a mesma conta dava zero trechos de
 * 120 — o `BALANCOS.md` tem `**correção da moldura do D159**` e o recado não tem negrito. **Cópia com ênfase
 * diferente é cópia**; por isso a régua lê como a regra se lê.
 *
 * **Regra verdadeira, guarda ausente.** A janela da trava é {@link JANELA} = 120: entre o maior trecho da mão que
 * repete as próprias frases (98) e o de uma cópia de balanço, que é parágrafo (o da mutação tinha 1 406). Abaixo de
 * 100 a régua mediria a mão, e isso não é segunda montagem de balanço nenhum.
 *
 * # O caso válido que quase parece inválido
 *
 * O índice do §2 **cita o título** da seção do `RECADOS.md` que carrega cada balanço — é exatamente o *"aponta-se
 * para ele"*. O título está nos dois arquivos, por definição. Os de hoje têm de 55 a 63 caracteres; o maior título do
 * `RECADOS.md` já passa de 110, e um título longo citado no índice seria acusado de cópia por cumprir a regra. Por
 * isso **o título citado entre crases que é título de seção do `RECADOS.md` sai antes de comparar** — só ele, e só
 * quando é igual.
 *
 * # O que ela NÃO alcança, dito na saída ({@link O_QUE_ISTO_NAO_ALCANCA})
 */
import { comoARegraSeLe } from "./texto-das-regras.ts";

/** A frase do `CLAUDE.md` §1-B que esta trava faz perguntar. */
export const A_REGRA = "Balanço que já mora num recado não se copia: aponta-se para ele";

/** O tamanho do trecho igual que é cópia. Ver a tabela do cabeçalho. */
export const JANELA = 120;

export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "cópia PARAFRASEADA: a régua acha texto igual; o mesmo balanço reescrito com outras palavras passa — a segunda montagem por paráfrase só se acha lendo",
  "trecho igual com menos de 120 caracteres: abaixo disso a régua mediria a mão que repete as próprias frases (ver a tabela do cabeçalho)",
  "balanço copiado para outro arquivo que não o BALANCOS.md (um relatório de prompt, o ONDE_PARAMOS): a regra do §1-B fala do arquivo de balanços",
  "se o balanço que mora num recado ESTÁ no índice do §2: isto é a outra metade da frase, e é da guarda do LAB-42 (tests/balancos.test.ts), que só confere que o índice aponta para seção que existe — não que todo balanço de recado entrou nele",
  "o que é ou não é balanço: a régua compara o arquivo de balanços inteiro com o arquivo de recados inteiro, e não precisa decidir",
];

/**
 * Os trechos em comum que a casa declarou, com o motivo. Casam pela seção e pelo começo; se o trecho deixar de
 * existir, a declaração vira fantasma e reprova ({@link ResultadoDaCopia.declaracoesSemTrecho}). O tamanho declarado
 * é teto: o trecho crescer é cópia nova.
 */
export const COPIAS_DECLARADAS: readonly {
  secao: string;
  comeco: string;
  tamanhoMaximo: number;
  motivo: string;
}[] = [
  {
    secao: "6 · O saldo da fila LAB-48 a LAB-52 — 07/10/2026",
    comeco: "guarda ao lado, D136); a correção da moldura do D159",
    tamanhoMaximo: 155,
    motivo:
      "sentido contrário ao da regra: a lista das cinco propostas nasceu neste saldo, e o recado do LAB-52 (07/10/2026) apontou para o §6 e a repetiu no 'Próximo na fila'; o recado enviado não se reescreve (D118)",
  },
];

export interface TrechoCopiado {
  /** O título da seção do `BALANCOS.md` onde o trecho está (`## 2 · …`), ou `(cabeçalho)` antes da primeira. */
  secao: string;
  /** Tamanho do trecho contíguo em comum, em caracteres, depois de lido como a regra se lê. */
  tamanho: number;
  /** O começo do trecho, para quem for consertar achar o lugar. */
  comeco: string;
}

export interface ResultadoDaCopia {
  /** O universo: seções do `BALANCOS.md` lidas, caracteres comparados dos dois lados e janelas conferidas. */
  secoes: number;
  caracteresDoBalanco: number;
  caracteresDosRecados: number;
  janelas: number;
  /** Quantos títulos citados no índice saíram antes de comparar (o caso válido). */
  titulosCitados: number;
  /** Todos os trechos em comum de {@link JANELA} ou mais, declarados ou não. */
  trechos: TrechoCopiado[];
  /** Os que nenhuma declaração cobre — é o que reprova. */
  copias: TrechoCopiado[];
  /** Declarações que não acharam o trecho delas — exceção fantasma, também reprova. */
  declaracoesSemTrecho: string[];
}

/** Os títulos de seção do `RECADOS.md` (`## dd/mm/aaaa · …`), como estão escritos. */
export function titulosDosRecados(recados: string): Set<string> {
  return new Set([...recados.matchAll(/^## (.+)$/gm)].map((m) => m[1]!.trim()));
}

/** As seções `## ` do `BALANCOS.md`, com o título; o que vem antes da primeira é o `(cabeçalho)`. */
function secoes(texto: string): { titulo: string; corpo: string }[] {
  const partes = texto.split(/^(?=## )/m);
  return partes.map((p) => {
    const t = /^## (.+)$/m.exec(p);
    return { titulo: t && p.startsWith("## ") ? t[1]!.trim() : "(cabeçalho)", corpo: p };
  });
}

/**
 * Os trechos do `BALANCOS.md` que estão, iguais, no `RECADOS.md` — {@link JANELA} caracteres ou mais, lidos como a
 * regra se lê. O título de recado citado entre crases sai antes (o *"aponta-se para ele"*).
 */
export function conferirQueOBalancoNaoSeCopia(
  balancos: string,
  recados: string,
  janela: number = JANELA,
  declaradas: typeof COPIAS_DECLARADAS = COPIAS_DECLARADAS,
): ResultadoDaCopia {
  const titulos = titulosDosRecados(recados);
  const r = comoARegraSeLe(recados);
  // Filtro barato antes do `includes` caro: o começo da janela tem de existir no `RECADOS.md`. Exato — só descarta o
  // que o `includes` também descartaria.
  const PREFIXO = Math.min(32, janela);
  const comecos = new Set<string>();
  for (let i = 0; i + PREFIXO <= r.length; i++) comecos.add(r.slice(i, i + PREFIXO));
  const resultado: ResultadoDaCopia = {
    secoes: 0,
    caracteresDoBalanco: 0,
    caracteresDosRecados: r.length,
    janelas: 0,
    titulosCitados: 0,
    trechos: [],
    copias: [],
    declaracoesSemTrecho: [],
  };
  for (const s of secoes(balancos)) {
    resultado.secoes++;
    // O título citado vira um separador que não existe em recado nenhum: a janela não o atravessa.
    const semTitulos = s.corpo.replace(/`([^`\n]+)`/g, (inteiro, dentro: string) => {
      if (!titulos.has(dentro.trim())) return inteiro;
      resultado.titulosCitados++;
      return "\u0000";
    });
    const b = comoARegraSeLe(semTitulos);
    resultado.caracteresDoBalanco += b.length;
    let inicio = -1;
    let fim = -1;
    const fechar = () => {
      if (inicio < 0) return;
      resultado.trechos.push({
        secao: s.titulo,
        tamanho: fim + janela - inicio,
        comeco: b.slice(inicio, inicio + 80).trim(),
      });
      inicio = -1;
    };
    for (let i = 0; i + janela <= b.length; i++) {
      resultado.janelas++;
      const pedaco = b.slice(i, i + janela);
      if (!pedaco.includes("\u0000") && comecos.has(pedaco.slice(0, PREFIXO)) && r.includes(pedaco)) {
        if (inicio < 0) inicio = i;
        fim = i;
      } else fechar();
    }
    fechar();
  }
  const usadas = new Set<number>();
  for (const t of resultado.trechos) {
    const k = declaradas.findIndex(
      (d) => d.secao === t.secao && t.comeco.startsWith(d.comeco) && t.tamanho <= d.tamanhoMaximo,
    );
    if (k < 0) resultado.copias.push(t);
    else usadas.add(k);
  }
  declaradas.forEach((d, k) => {
    if (!usadas.has(k)) resultado.declaracoesSemTrecho.push(`§${d.secao} · ${d.comeco}`);
  });
  return resultado;
}
