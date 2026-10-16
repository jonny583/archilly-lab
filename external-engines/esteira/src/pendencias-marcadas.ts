/**
 * A PENDÊNCIA RESOLVIDA É MARCADA, NUNCA APAGADA — a regra do `CLAUDE.md` §5 que nunca teve guarda.
 * (LAB-124, item 900, a dívida própria, D352)
 *
 * # A regra, e o defeito medido em 16/10/2026
 *
 * O `CLAUDE.md` §5 diz: *"`docs/PENDENCIAS_JONNY.md` é escrito para leigo; item resolvido é
 * **marcado, nunca apagado**"*, e o alto da própria página repete: *"Item resolvido é marcado, nunca
 * apagado — para a decisão não se perder."* A única régua que lia a página por essa convenção era a
 * do LAB-85 (`o-que-o-gatilho-carrega.ts`), e ela pergunta por **uma** pendência só — a §11, do
 * segredo. Nenhum `.ts` perguntava pelas outras.
 *
 * Enumeradas por LUGAR — os títulos numerados da página (`## N ·` e `### N-X ·`), na `main` de
 * 16/10/2026 — são **19** pendências. E a história do arquivo (29 commits, clone desrasado): **nenhum
 * assunto foi apagado** — os títulos que não existem mais hoje são todos o mesmo assunto renumerado
 * (até 14/09) ou riscado depois de respondido, e os cinco que saíram da numeração moram, riscados, na
 * lista *"Já resolvidos"*. A metade *"nunca apagado"* estava cumprida por disciplina.
 *
 * **A metade *"marcado"* não estava.** A **§1** — *"Confirme o número: 'desproporcional' é 3 vezes,
 * ou 1,5 km?"* — foi respondida pelo Jonny em **02/10/2026** (D84), e a própria página diz isso na
 * lista *"Já resolvidos"* e no alto (*"e agora o número (D84)"*). O título da §1 ficou **sem marca
 * por 14 dias**, e o corpo dela ainda afirma *"Enquanto não vier, o que acontece: nenhuma travessia é
 * proposta"* — que é falso desde a D84. A mesma página dizia as duas coisas, e quem abre pela seção
 * lê a errada. *Regra sem guarda* e *mensagem fixa que afirma estado sem perguntar*, duas espécies
 * da dívida própria no mesmo título.
 *
 * # O que a régua cobra, e de onde veio cada exigência
 *
 * A fonte do estado de cada pendência é **uma lista escrita à mão** ({@link PENDENCIAS}), fechada
 * nos dois sentidos e com a fonte por linha — porque *se uma pendência está resolvida* não se lê do
 * texto: era exatamente o texto que mentia. A régua confere a lista contra a página:
 *
 * 1. **todo título numerado da página tem linha na lista** — pendência nova nasce declarada, com o
 *    estado; sem isso, a próxima nasce fora da guarda (`sem-linha-na-lista`);
 * 2. **toda linha da lista tem o título na página, com o mesmo assunto** — *nunca apagado*. O assunto
 *    é uma `chave` curta do título, que sobrevive ao risco e à marca de resposta
 *    (`apagada`, `assunto-trocado`);
 * 3. **número não se repete** — dois `## 5 ·` são duas pendências com um nome só (`numero-repetido`);
 * 4. **a resolvida tem a marca no título** — `~~` ou a palavra da resposta (*respondeu*, *respondido*,
 *    *confirmado*, *decidido*) **na mesma linha** (`resolvida-sem-marca`);
 * 5. **a parada diz que está parada** — `PARADA` no título, a forma das quatro do pedido de 12/10
 *    (`parada-sem-marca`);
 * 6. **a aberta não se diz resolvida** — o risco num título aberto é a mentira do outro lado
 *    (`aberta-com-marca`);
 * 7. **a lista *"Já resolvidos"*** (sem número): cada item dela está riscado, e cada assunto
 *    declarado em {@link JA_RESOLVIDOS} continua lá — nos dois sentidos (`resolvido-sem-risco`,
 *    `resolvido-apagado`, `resolvido-sem-linha`).
 *
 * # O que ela NÃO cobra, dito
 *
 * - **o corpo da seção.** A régua lê o título; o corpo da §1 que dizia *"enquanto não vier"* foi
 *   consertado à mão (uma nota no alto, o texto antigo intocado abaixo), e outro corpo que envelheça
 *   não é acusado;
 * - **se o estado da lista é o verdadeiro.** A lista é a declaração; quem a escreve é a sessão, a
 *   partir da resposta do Jonny. Ela impede que a página e a declaração divirjam — não que as duas
 *   errem juntas;
 * - ~~**a tabela *"Em cinco minutos"***, que numera as linhas dela (1, 2, 8) por outra conta e não tem
 *   número estável;~~ — **cobrada desde o LAB-125** (D353), por {@link conferirOsCincoMinutos}, logo
 *   abaixo: a numeração própria dela ficou declarada à mão, linha a linha, apontando para a pendência;
 * - **o histórico**: a régua lê a página de hoje. A medição dos 29 commits foi feita uma vez, no
 *   LAB-124, e está no relatório — repeti-la a cada verde exigiria a história inteira, e o portão sem
 *   clones roda em clone raso (D293).
 */

/** O estado de uma pendência, como a sessão o declara a partir da resposta do Jonny. */
export type EstadoDaPendencia =
  /** espera uma resposta dele */
  | "aberta"
  /** espera, por pedido dele (12/10/2026), o Lab entrar no Generate */
  | "parada"
  /** ele (ou o chat, por ele) respondeu; o título tem a marca */
  | "resolvida"
  /** não é pergunta: aviso, registro ou o que não depende dele */
  | "aviso";

export interface DeclaracaoDePendencia {
  /** o número do título — `"1"`, `"5-C"`, `"9-A"` */
  numero: string;
  /** um pedaço do título que diz o assunto e sobrevive ao risco e à marca */
  chave: string;
  estado: EstadoDaPendencia;
  /** de onde se sabe o estado — a decisão, a data da resposta, ou o que o título já diz */
  fonte: string;
}

/**
 * As pendências numeradas da página, uma por título. **Pendência nova entra aqui no mesmo commit em
 * que entra na página**; resolvida, muda o `estado` aqui **e** ganha a marca no título lá.
 */
export const PENDENCIAS: readonly DeclaracaoDePendencia[] = [
  { numero: "1", chave: "desproporcional", estado: "resolvida", fonte: "D84 — respondida pelo Jonny em 02/10/2026; título marcado no LAB-124" },
  { numero: "2", chave: "A rua que você desenha atravessa o rio", estado: "aviso", fonte: "D69 — o título diz: não é pergunta, é aviso" },
  { numero: "3", chave: "Pode haver ponte?", estado: "resolvida", fonte: "D61 — respondida em 15/09/2026" },
  { numero: "4", chave: "A calçada é da rua", estado: "resolvida", fonte: "confirmada pelo chat em 15/09/2026" },
  { numero: "5", chave: "não** depende de você", estado: "aviso", fonte: "o título: o que não depende dele" },
  { numero: "5-A", chave: "o que é um lote de forma ruim", estado: "resolvida", fonte: "respondida pelo chat em 02/10/2026" },
  { numero: "5-B", chave: "A régua de forma", estado: "parada", fonte: "pedido do Jonny, 12/10/2026" },
  { numero: "5-C", chave: "A inclinação máxima de uma RUA", estado: "resolvida", fonte: "respondida pelo Jonny em 03/10/2026" },
  { numero: "5-D", chave: "Como a pergunta estava antes da sua resposta", estado: "aviso", fonte: "registro da 5-C" },
  { numero: "6", chave: "O que o laboratório descobriu", estado: "aviso", fonte: "o que já foi repassado ou consertado" },
  { numero: "7", chave: "33 lotes tendo 1 228", estado: "parada", fonte: "pedido do Jonny, 12/10/2026" },
  { numero: "8", chave: "Ligar dado pago só onde há cliente", estado: "aberta", fonte: "a obra que ninguém tem ainda — nada agora, só saber que existe" },
  { numero: "9", chave: "As suas regras do acesso", estado: "resolvida", fonte: "respondidas pelo Jonny em 12/10/2026" },
  { numero: "9-A", chave: "pega a quadra toda", estado: "resolvida", fonte: "D323 — respondida em 12/10/2026" },
  { numero: "9-B", chave: "Os 15 metros se medem", estado: "resolvida", fonte: "D323 — respondida em 12/10/2026" },
  { numero: "9-C", chave: "E uma terceira coisa, que não é pergunta", estado: "aviso", fonte: "o título: não é pergunta" },
  { numero: "10", chave: "Dois lotes nascem na esquina sem rua na frente", estado: "parada", fonte: "pedido do Jonny, 12/10/2026" },
  { numero: "11", chave: "Uma senha que só você pode criar", estado: "parada", fonte: "pedido do Jonny, 12/10/2026 (e a régua do LAB-85 cobra a condição dela)" },
  { numero: "12", chave: "Em que REGIME a competição dos motores vai rodar", estado: "resolvida", fonte: "respondida pelo Jonny em 12/10/2026" },
];

/** Os assuntos da lista *"Já resolvidos"*, que não têm número: cada um continua lá, riscado. */
export const JA_RESOLVIDOS: readonly string[] = [
  "Desvio desproporcional",
  "`cluster`, `organico` ou `radial`",
  "A superquadra nasce vazia",
  "Colar dois recados",
  "A calçada: sai do lote ou da rua?",
];

/** O título da seção sem número que guarda os resolvidos. */
export const TITULO_DOS_RESOLVIDOS = "## Já resolvidos";

export interface TituloDePendencia {
  numero: string;
  titulo: string;
  /** a linha do título na página, contada a partir de 1 */
  linha: number;
}

const TITULO_NUMERADO = /^#{2,3} (\d+(?:-[A-Z])?) · (.*)$/;

/** Os títulos numerados da página, na ordem em que aparecem. */
export function lerOsTitulos(pagina: string): TituloDePendencia[] {
  const titulos: TituloDePendencia[] = [];
  pagina.split("\n").forEach((l, i) => {
    const m = TITULO_NUMERADO.exec(l);
    if (m) titulos.push({ numero: m[1]!, titulo: m[2]!, linha: i + 1 });
  });
  return titulos;
}

/** A marca de resolvida: o risco, ou a palavra da resposta — sempre na linha do título. */
const MARCA_DE_RESOLVIDA = /~~[^~\n]+~~|\brespond(?:eu|id[oa]s?)\b|\bconfirmad[oa]\b|\bdecidid[oa]\b/i;
const MARCA_DE_PARADA = /\bPARADA\b/;

export function temMarcaDeResolvida(titulo: string): boolean {
  return MARCA_DE_RESOLVIDA.test(titulo);
}

/** Os itens da lista *"Já resolvidos"*: as linhas `- ` até o próximo título. */
export function lerOsResolvidos(pagina: string): string[] | null {
  const linhas = pagina.split("\n");
  const ini = linhas.findIndex((l) => l.startsWith(TITULO_DOS_RESOLVIDOS));
  if (ini < 0) return null;
  const itens: string[] = [];
  for (const l of linhas.slice(ini + 1)) {
    if (l.startsWith("#")) break;
    if (l.startsWith("- ")) itens.push(l);
  }
  return itens;
}

export type TipoDeProblemaDaPendencia =
  | "sem-linha-na-lista"
  | "apagada"
  | "assunto-trocado"
  | "numero-repetido"
  | "resolvida-sem-marca"
  | "parada-sem-marca"
  | "aberta-com-marca"
  | "sem-lista-de-resolvidos"
  | "resolvido-sem-risco"
  | "resolvido-apagado"
  | "resolvido-sem-linha";

export interface ProblemaDaPendencia {
  tipo: TipoDeProblemaDaPendencia;
  /** o número, ou o começo do item sem número */
  onde: string;
}

/**
 * Confere a página contra a declaração. Nunca lança: página sem títulos devolve um problema por
 * linha da lista (todas `apagada`), e não um verde.
 */
export function conferirAsPendencias(
  pagina: string,
  pendencias: readonly DeclaracaoDePendencia[] = PENDENCIAS,
  jaResolvidos: readonly string[] = JA_RESOLVIDOS,
): { titulos: number; resolvidosSemNumero: number; problemas: ProblemaDaPendencia[] } {
  const problemas: ProblemaDaPendencia[] = [];
  const titulos = lerOsTitulos(pagina);
  const declarada = new Map(pendencias.map((p) => [p.numero, p]));

  const vistos = new Set<string>();
  for (const t of titulos) {
    if (vistos.has(t.numero)) problemas.push({ tipo: "numero-repetido", onde: t.numero });
    vistos.add(t.numero);
    if (!declarada.has(t.numero)) problemas.push({ tipo: "sem-linha-na-lista", onde: t.numero });
  }

  for (const p of pendencias) {
    const t = titulos.find((x) => x.numero === p.numero);
    if (!t) {
      problemas.push({ tipo: "apagada", onde: p.numero });
      continue;
    }
    if (!t.titulo.includes(p.chave)) {
      problemas.push({ tipo: "assunto-trocado", onde: p.numero });
      continue;
    }
    const marcada = temMarcaDeResolvida(t.titulo);
    if (p.estado === "resolvida" && !marcada) problemas.push({ tipo: "resolvida-sem-marca", onde: p.numero });
    if (p.estado === "parada" && !MARCA_DE_PARADA.test(t.titulo)) problemas.push({ tipo: "parada-sem-marca", onde: p.numero });
    if (p.estado === "aberta" && marcada) problemas.push({ tipo: "aberta-com-marca", onde: p.numero });
  }

  const resolvidos = lerOsResolvidos(pagina);
  if (resolvidos === null) {
    problemas.push({ tipo: "sem-lista-de-resolvidos", onde: TITULO_DOS_RESOLVIDOS });
  } else {
    for (const r of resolvidos) {
      if (!/^- ~~[^~]+~~/.test(r)) problemas.push({ tipo: "resolvido-sem-risco", onde: r.slice(0, 60) });
      if (!jaResolvidos.some((k) => r.includes(k))) problemas.push({ tipo: "resolvido-sem-linha", onde: r.slice(0, 60) });
    }
    for (const k of jaResolvidos) {
      if (!resolvidos.some((r) => r.includes(k))) problemas.push({ tipo: "resolvido-apagado", onde: k });
    }
  }

  return { titulos: titulos.length, resolvidosSemNumero: resolvidos?.length ?? 0, problemas };
}

/*
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 *  O RESUMO DO ALTO TAMBÉM AFIRMA ESTADO — a tabela "Em cinco minutos". (LAB-125, item 900, D353)
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 *
 * # O defeito, medido em 16/10/2026
 *
 * O LAB-124 pôs guarda nos **títulos** e declarou, por escrito, o que não alcançava: *"a tabela 'Em
 * cinco minutos' no alto, que numera as linhas dela (1, 2, 8) por outra conta. Vi, e ela ainda diz
 * 'Ficam faltando três coisas', duas delas paradas desde 12/10 (5-B e 7)"*. É a quinta espécie da
 * dívida própria — **mensagem fixa que afirma estado sem perguntar** — e está no lugar mais lido da
 * página: o resumo de cinco minutos, logo abaixo dos endereços.
 *
 * Lida por LUGAR, a seção tem **três linhas** de tabela e **uma** frase de contagem:
 *
 * | linha | assunto | a pendência | estado declarado | o que a linha dizia |
 * |---|---|---|---|---|
 * | 1 | a régua de forma de lote | 5-B | parada (12/10) | pede para *confirmar*, 2 min |
 * | 2 | os 33 lotes em Antonina | 7 | parada (12/10) | pede para *olhar*, 10 min |
 * | 8 | ligar dado pago só onde há cliente | 8 | aberta (nada agora) | *nada agora* |
 *
 * e *"Ficam faltando três coisas, e as duas primeiras são de olhar e dizer"* — **duas das três
 * estão paradas a pedido dele há quatro dias**, e a nota de 12/10, logo acima, diz que *"nada aqui
 * precisa de você agora"*. A mesma página, de novo, dizendo duas coisas; e quem lê só o resumo lê a
 * errada.
 *
 * # O que a régua cobra
 *
 * A numeração da tabela **não é** a das pendências (a linha `1` é a pendência `5-B`, a `2` é a `7`),
 * então a ligação não se lê do texto: mora numa declaração escrita à mão, {@link CINCO_MINUTOS},
 * fechada nos dois sentidos, e o estado vem de {@link PENDENCIAS} — **um lugar só para o estado**.
 *
 * 1. toda linha `| **N** |` da seção tem declaração, e toda declaração tem a linha, com o assunto
 *    (`cinco-minutos-sem-linha-na-lista`, `cinco-minutos-linha-apagada`, `cinco-minutos-assunto-trocado`);
 * 2. a declaração aponta para uma pendência que existe (`cinco-minutos-pendencia-desconhecida`);
 * 3. a linha de pendência **parada** diz `PARADA`; a de **resolvida** tem a marca; a de **aberta** não
 *    tem nenhuma das duas (`cinco-minutos-parada-sem-marca`, `cinco-minutos-resolvida-sem-marca`,
 *    `cinco-minutos-aberta-com-marca`);
 * 4. **a contagem**: toda frase *"fica(m) faltando N"* da seção que não esteja riscada diz o número
 *    de linhas cuja pendência está **aberta** — nem as paradas, nem as resolvidas
 *    (`cinco-minutos-contagem-errada`); número que a régua não lê é acusado, não aprovado
 *    (`cinco-minutos-contagem-ilegivel`);
 * 5. a seção existe (`cinco-minutos-sem-secao`).
 *
 * # O que ela NÃO cobra, dito
 *
 * - **o resto da prosa da seção** — os parágrafos da ponte e da inclinação são relato de respostas
 *   que já valem, e não afirmam o que falta;
 * - **uma contagem escrita de outro jeito** (*"resta uma"*, *"sobram duas"*): a régua lê o verbo da
 *   frase que existe, *faltar*. O teste publica quantas frases leu, e a página de hoje tem uma;
 * - **se o estado declarado é o verdadeiro** — o mesmo limite do LAB-124: a régua impede a tabela e a
 *   declaração de divergirem, não as duas de errarem juntas.
 */

/** O título da seção de resumo do alto da página. */
export const TITULO_DOS_CINCO_MINUTOS = "## Em cinco minutos";

export interface LinhaDosCincoMinutos {
  /** o número em negrito da primeira coluna — a conta da tabela, que não é a das pendências */
  linha: string;
  /** um pedaço do texto da linha que diz o assunto */
  chave: string;
  /** o número da pendência de {@link PENDENCIAS} de que a linha fala */
  pendencia: string;
}

/**
 * As linhas da tabela *"Em cinco minutos"*, cada uma apontando para a pendência dela. **Linha nova
 * na tabela entra aqui no mesmo commit**; o estado não se escreve aqui — vem de {@link PENDENCIAS}.
 */
export const CINCO_MINUTOS: readonly LinhaDosCincoMinutos[] = [
  { linha: "1", chave: "régua de forma de lote", pendencia: "5-B" },
  { linha: "2", chave: "**33 lotes**", pendencia: "7" },
  { linha: "8", chave: "ligar e desligar a fonte paga", pendencia: "8" },
];

/** Os números por extenso que a frase de contagem usa. */
const POR_EXTENSO: Readonly<Record<string, number>> = {
  nenhuma: 0, nenhum: 0, nada: 0, zero: 0,
  um: 1, uma: 1, dois: 2, duas: 2, "três": 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10,
};

export function lerNumeroPorExtenso(palavra: string): number | null {
  const p = palavra.toLowerCase();
  if (/^\d+$/.test(p)) return Number(p);
  return POR_EXTENSO[p] ?? null;
}

const LINHA_DA_TABELA = /^\| \*\*(\d+(?:-[A-Z])?)\*\* \|(.*)$/;
const RISCADO = /~~[^~\n]+~~/g;
const CONTAGEM = /\b[Ff]ica(?:m)? faltando \**(\S+?)\**(?=[\s,.:;]|$)/g;

export interface SecaoDosCincoMinutos {
  linhas: { linha: string; texto: string }[];
  /** as frases de contagem fora do risco: a palavra como está e o número que ela diz (`null`: ilegível) */
  contagens: { palavra: string; n: number | null }[];
}

/** A seção *"Em cinco minutos"*: do título até o próximo título `## `. `null` se não existe. */
export function lerOsCincoMinutos(pagina: string): SecaoDosCincoMinutos | null {
  const linhas = pagina.split("\n");
  const ini = linhas.findIndex((l) => l.startsWith(TITULO_DOS_CINCO_MINUTOS));
  if (ini < 0) return null;
  const secao: SecaoDosCincoMinutos = { linhas: [], contagens: [] };
  for (const l of linhas.slice(ini + 1)) {
    if (l.startsWith("## ")) break;
    const m = LINHA_DA_TABELA.exec(l);
    if (m) secao.linhas.push({ linha: m[1]!, texto: m[2]! });
    for (const c of l.replace(RISCADO, "").matchAll(CONTAGEM)) {
      secao.contagens.push({ palavra: c[1]!, n: lerNumeroPorExtenso(c[1]!) });
    }
  }
  return secao;
}

export type TipoDeProblemaDosCincoMinutos =
  | "cinco-minutos-sem-secao"
  | "cinco-minutos-sem-linha-na-lista"
  | "cinco-minutos-linha-apagada"
  | "cinco-minutos-assunto-trocado"
  | "cinco-minutos-pendencia-desconhecida"
  | "cinco-minutos-parada-sem-marca"
  | "cinco-minutos-resolvida-sem-marca"
  | "cinco-minutos-aberta-com-marca"
  | "cinco-minutos-contagem-errada"
  | "cinco-minutos-contagem-ilegivel";

export interface ProblemaDosCincoMinutos {
  tipo: TipoDeProblemaDosCincoMinutos;
  onde: string;
}

/**
 * Confere a tabela *"Em cinco minutos"* contra as declarações. Nunca lança; página sem a seção é um
 * problema, não um verde.
 */
export function conferirOsCincoMinutos(
  pagina: string,
  cincoMinutos: readonly LinhaDosCincoMinutos[] = CINCO_MINUTOS,
  pendencias: readonly DeclaracaoDePendencia[] = PENDENCIAS,
): { linhas: number; contagens: number; abertas: number; problemas: ProblemaDosCincoMinutos[] } {
  const problemas: ProblemaDosCincoMinutos[] = [];
  const secao = lerOsCincoMinutos(pagina);
  if (secao === null) {
    return { linhas: 0, contagens: 0, abertas: 0, problemas: [{ tipo: "cinco-minutos-sem-secao", onde: TITULO_DOS_CINCO_MINUTOS }] };
  }
  const declaradas = new Map(cincoMinutos.map((c) => [c.linha, c]));
  const estado = new Map(pendencias.map((p) => [p.numero, p.estado]));

  for (const l of secao.linhas) {
    if (!declaradas.has(l.linha)) problemas.push({ tipo: "cinco-minutos-sem-linha-na-lista", onde: l.linha });
  }

  let abertas = 0;
  for (const c of cincoMinutos) {
    const e = estado.get(c.pendencia);
    if (e === undefined) {
      problemas.push({ tipo: "cinco-minutos-pendencia-desconhecida", onde: `${c.linha}→${c.pendencia}` });
      continue;
    }
    const l = secao.linhas.find((x) => x.linha === c.linha);
    if (!l) {
      problemas.push({ tipo: "cinco-minutos-linha-apagada", onde: c.linha });
      continue;
    }
    if (e === "aberta") abertas++;
    if (!l.texto.includes(c.chave)) {
      problemas.push({ tipo: "cinco-minutos-assunto-trocado", onde: c.linha });
      continue;
    }
    const parada = MARCA_DE_PARADA.test(l.texto);
    const resolvida = temMarcaDeResolvida(l.texto);
    if (e === "parada" && !parada) problemas.push({ tipo: "cinco-minutos-parada-sem-marca", onde: c.linha });
    if (e === "resolvida" && !resolvida) problemas.push({ tipo: "cinco-minutos-resolvida-sem-marca", onde: c.linha });
    if (e === "aberta" && (parada || resolvida)) problemas.push({ tipo: "cinco-minutos-aberta-com-marca", onde: c.linha });
  }

  for (const k of secao.contagens) {
    if (k.n === null) problemas.push({ tipo: "cinco-minutos-contagem-ilegivel", onde: k.palavra });
    else if (k.n !== abertas) problemas.push({ tipo: "cinco-minutos-contagem-errada", onde: `${k.palavra}≠${abertas}` });
  }

  return { linhas: secao.linhas.length, contagens: secao.contagens.length, abertas, problemas };
}
