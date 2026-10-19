/**
 * A PÁGINA DO ADAPTADOR DO SYMBIOS — o mapa da pasta, o que a função não faz, e os números perguntados ao dono. (LAB-191,
 * item 900, a dívida própria, D419)
 *
 * O `external-engines/symbios/adapter/README.md` nasceu no LAB-01 (10/09/2026) e só foi tocado uma vez depois (LAB-133,
 * a linha do npm). Nenhum código o lia: o LAB-187 contou três `README.md` sem leitor fora do `upstream/`, e este era o
 * quarto — o `o-trabalho-em-archilly.ts` o cita num comentário, e comentário não pergunta nada.
 *
 * # O que se mediu, por LUGAR (19/10/2026)
 *
 * | a página dizia | o que a casa tem |
 * |---|---|
 * | *"Estado: LAB-01 concluído."* | o adaptador cresceu no LAB-02 (`src/recorte.ts`, 14/09) e no LAB-05 (`src/poligono.ts`, 15/09) |
 * | o *Mapa dos arquivos*, nove em `src/` | o `git` carrega **onze** em `src/`: faltavam os dois do recorte |
 * | *"O que este adaptador NÃO faz"*: não recorta, não aplica restrições | verdade para `gerarRedeViaria`; o adaptador **exporta** `recortarPelaGleba`, que recorta pela gleba e pelas restrições com `desconta` |
 * | *"Validator é LAB-02, Judge é LAB-03"* | o Validator e o Judge são os do Generate (`CLAUDE.md` §4, D20); o LAB-02 foi o recorte e o LAB-03 a interpolação |
 * | *"≈ 38 % do comprimento de via"* | confere: `vias.fracaoForaDaGleba` 0,3758 na *Fazenda Recanto das Águas* de `outputs/lab01/medicoes.json` — sem dizer de onde |
 * | os seis padrões do contrato de entrada | conferem com o `PARAMETROS_PADRAO` de `src/contrato.ts` — sem trava entre os dois |
 * | *"o `NORMA_BR.via.caixaMinima` do Generate"* | **o nome nunca existiu**: no Generate é `NORMA_BR.viario.valor.caixaMinima`, desde o primeiro commit do `br.ts` (08/09); o erro estava também no `src/contrato.ts` |
 * | *"via a cada 15 m"* do upstream | confere: `minor_road_dist: 15.0` no `Default` de `TensorConfig` |
 *
 * Espécies da dívida própria: **mensagem fixa que afirma estado sem perguntar** e **número digitado à mão**.
 *
 * # O que este módulo pergunta
 *
 * 1. **o mapa, nos dois sentidos:** entre as marcas, todo arquivo que o `git` carrega na pasta (fora a página, e a
 *    bancada como uma pasta só, `ferramentas/navegador/`) tem linha, e toda linha nomeia o que existe;
 * 2. **o estado:** *"LAB-01 concluído"* só riscado;
 * 3. **o que a função não faz:** a seção nomeia `gerarRedeViaria`; o corpo dela em `src/index.ts` não recorta; a função
 *    de recorte que a página nomeia é definida em `src/recorte.ts`, exportada por `src/index.ts` e chamada pelo arquivo
 *    da esteira que a página aponta;
 * 4. **o Validator e o Judge:** *"Validator é LAB-02"* só riscado, e a página diz que são os do Generate;
 * 5. **os ≈ 38 %:** todo *"≈ N %"* da página é o arredondamento da fração do terreno nomeado, e o *"0,3758"* citado é a
 *    fração com quatro casas;
 * 6. **os padrões:** o bloco de código do contrato de entrada dá os seis valores do `PARAMETROS_PADRAO`;
 * 7. **os nomes do Generate:** os que o bloco cita (`// padrão — o X do Generate`) são os que o `src/contrato.ts` cita, e
 *    nenhum dos dois cita o nome que nunca existiu fora de risco — o clone do Generate, no verde completo, responde o
 *    resto ({@link conferirNoGenerate});
 * 8. **os 15 m do upstream:** o `minor_road_dist` do `Default` de `TensorConfig`;
 * 9. **os caminhos:** todo link e todo `docs/…`, `external-engines/…` ou `outputs/…` entre crases resolvem no `git`;
 * 10. **o cabeçalho de `src/index.ts`** (LAB-192, item 900, D420): o comentário que abre o arquivo repetia, desde o LAB-01,
 *    *"O que este adaptador NÃO faz"* — e o LAB-02 pôs o `export { recortarPelaGleba … }` no mesmo arquivo, num commit de
 *    uma linha (`d619067`), sem tocar nele — e *"Validator é LAB-02, Judge é LAB-03"*. A pergunta é a da página, feita ao
 *    comentário ({@link oCabecalho}): o título nomeia `gerarRedeViaria`; as duas frases velhas só riscadas; diz que o
 *    juiz é o do Generate; nomeia `recortarPelaGleba` e `./recorte.ts`; e aponta quem chama o recorte, um arquivo que o
 *    `git` carrega e que o chama no código.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, normalize } from "node:path";

import { comoARegraSeLe } from "./texto-das-regras.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PASTA = "external-engines/symbios/adapter/";
export const A_PAGINA = `${A_PASTA}README.md`;
export const O_INDEX = `${A_PASTA}src/index.ts`;
export const O_RECORTE = `${A_PASTA}src/recorte.ts`;
export const O_CONTRATO = `${A_PASTA}src/contrato.ts`;
export const A_BANCADA = "ferramentas/navegador/";
export const AS_MEDICOES = "outputs/lab01/medicoes.json";
export const O_TRACER = "external-engines/symbios/upstream/src/tracer.rs";

export const MARCA_ABRE = "<!-- o-mapa-do-adaptador (LAB-191) -->";
export const MARCA_FECHA = "<!-- /o-mapa-do-adaptador -->";

export const A_FUNCAO = "gerarRedeViaria";
export const A_FUNCAO_DO_RECORTE = "recortarPelaGleba";
export const O_TERRENO = "Fazenda Recanto das Águas";
export const A_PAGINA_DIZ_DO_JUIZ = "são os do Generate";
/** O que só vale riscado (`~~…~~`): a página pode guardar a frase velha, datada, mas não afirmá-la. */
export const SO_RISCADO: readonly string[] = ["LAB-01 concluído", "Validator é LAB-02", "## O que este adaptador NÃO faz"];
/** O nome que o Generate nunca teve (D419): fora de risco, só na frase que diz que ele nunca existiu. */
export const O_NOME_QUE_NUNCA_EXISTIU = "NORMA_BR.via.caixaMinima";
export const A_FRASE_DO_NOME = "que o Generate nunca teve";

/** Os seis padrões do contrato de entrada, na ordem do `PARAMETROS_PADRAO`. */
export const OS_PADROES = [
  "espacamentoPrincipal_m",
  "espacamentoLocal_m",
  "rampaMaxima_pct",
  "faixaDominio_m",
  "passoGrade_m",
  "extrairQuadras",
] as const;

/** O que só vale riscado no cabeçalho de `src/index.ts` (LAB-192). */
export const SO_RISCADO_NO_CABECALHO: readonly string[] = ["Validator é LAB-02", "O que este adaptador NÃO faz"];

/**
 * O comentário que abre um arquivo TypeScript (o primeiro `/** … *\/`, antes de qualquer código), numa linha só: sem o
 * `*` da margem e com os espaços colapsados — a frase que quebra de linha no comentário se lê inteira. `null` se o arquivo
 * não abre com um.
 */
export function oCabecalho(ts: string): string | null {
  const m = /^\s*\/\*\*([\s\S]*?)\*\//.exec(ts);
  if (!m) return null;
  return (m[1] as string)
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, ""))
    .join("\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .trim();
}

/** O texto sem o que está riscado. */
export const semRiscado = (texto: string): string => texto.replace(/~~[\s\S]*?~~/g, "");

/** As linhas da tabela entre as marcas: o nome entre crases da primeira coluna. `null` se as marcas faltam. */
export function oMapa(pagina: string): string[] | null {
  const a = pagina.indexOf(MARCA_ABRE);
  const f = pagina.indexOf(MARCA_FECHA);
  if (a < 0 || f < 0 || f < a) return null;
  return pagina
    .slice(a + MARCA_ABRE.length, f)
    .split("\n")
    .map((l) => /^\|\s*`([^`]+)`\s*\|/.exec(l)?.[1])
    .filter((n): n is string => n !== undefined);
}

/** O que o mapa tem de nomear: o que o `git` carrega na pasta, fora a página, com a bancada como uma pasta só. */
export function oQueAPastaCarrega(caminhos: readonly string[]): string[] {
  const nomes = new Set<string>();
  for (const c of caminhos) {
    if (!c.startsWith(A_PASTA) || c === A_PAGINA) continue;
    const r = c.slice(A_PASTA.length);
    nomes.add(r.startsWith(A_BANCADA) ? A_BANCADA : r);
  }
  return [...nomes].sort();
}

/** Valor de um literal simples: número, `true`/`false`. `null` para o resto. */
function literal(v: string): number | boolean | null {
  const t = v.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  return /^-?\d+(?:\.\d+)?$/.test(t) ? Number(t) : null;
}

/** `chave: valor` dos seis padrões num trecho de código. */
export function osPadroesEm(codigo: string): Record<string, number | boolean | null> {
  const fora: Record<string, number | boolean | null> = {};
  for (const k of OS_PADROES) {
    const m = new RegExp(`\\b${k}\\s*:\\s*([^,\\n/]+)`).exec(codigo);
    fora[k] = m ? literal(m[1] as string) : null;
  }
  return fora;
}

/** O corpo do `PARAMETROS_PADRAO` do `contrato.ts`. `null` se não há. */
export const oPadraoDoContrato = (contrato: string): string | null =>
  /export const PARAMETROS_PADRAO[^=]*=\s*\{([\s\S]*?)\};/.exec(contrato)?.[1] ?? null;

/** O bloco `ts` da seção *Contrato de entrada* da página. `null` se não há. */
export function oBlocoDoContrato(pagina: string): string | null {
  const i = pagina.indexOf("## Contrato de entrada");
  if (i < 0) return null;
  return /```ts\n([\s\S]*?)\n```/.exec(pagina.slice(i))?.[1] ?? null;
}

/** Os nomes do Generate que o bloco da página cita, na forma `// padrão — o X do Generate`. */
export const osNomesDoBloco = (bloco: string): string[] =>
  [...bloco.matchAll(/\/\/ padrão — o ([A-Z_][\w.]*) do Generate/g)].map((m) => m[1] as string).sort();

/** Os nomes do Generate que o `contrato.ts` cita, na forma `` `X` do `` + quebra possível + `Generate`, fora de risco. */
export const osNomesDoContrato = (contrato: string): string[] =>
  [...contrato.matchAll(/`([A-Z_][\w.]*)` do(?:\s|\*)+Generate/g)]
    .map((m) => m[1] as string)
    .filter((n) => n !== O_NOME_QUE_NUNCA_EXISTIU)
    .sort();

/** O corpo da função exportada `nome` num arquivo TypeScript: da declaração até o próximo `export` no começo de linha. */
export function corpoDa(nome: string, ts: string): string | null {
  const i = ts.search(new RegExp(`^export function ${nome}\\b`, "m"));
  if (i < 0) return null;
  const resto = ts.slice(i + 1);
  const f = resto.search(/^export /m);
  return f < 0 ? ts.slice(i) : ts.slice(i, i + 1 + f);
}

/** As linhas de código, sem comentário de linha nem de bloco. */
const soCodigo = (ts: string): string => ts.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

/** O `minor_road_dist` do `impl Default for TensorConfig`. `null` se não há. */
export function oLocalDoUpstream(tracer: string): number | null {
  const i = tracer.indexOf("impl Default for TensorConfig");
  if (i < 0) return null;
  const m = /minor_road_dist:\s*(\d+(?:\.\d+)?)/.exec(tracer.slice(i));
  return m ? Number(m[1]) : null;
}

/** A fração de via fora da gleba do terreno de nome `nome` nas medições do LAB-01. */
export function aFracao(medicoes: string, nome: string): number | null {
  try {
    const d = JSON.parse(medicoes) as { terrenos?: { terreno?: string; vias?: { fracaoForaDaGleba?: number } }[] };
    const t = (d.terrenos ?? []).find((x) => x.terreno === nome);
    return typeof t?.vias?.fracaoForaDaGleba === "number" ? t.vias.fracaoForaDaGleba : null;
  } catch {
    return null;
  }
}

export interface Resultado {
  naPasta: string[];
  noMapa: number;
  padroes: Record<string, number | boolean | null>;
  fracao: number | null;
  caminhosLidos: number;
  problemas: string[];
}

export function conferir(caminhos: readonly string[], ler: (c: string) => string | null): Resultado {
  const problemas: string[] = [];
  const carrega = new Set(caminhos);
  const resolve = (alvo: string) => carrega.has(alvo) || caminhos.some((c) => c.startsWith(`${alvo}/`));
  const naPasta = oQueAPastaCarrega(caminhos);
  const pagina = ler(A_PAGINA);
  const fora = (): Resultado => ({ naPasta, noMapa: 0, padroes: {}, fracao: null, caminhosLidos: 0, problemas });
  if (pagina === null) {
    problemas.push(`${A_PAGINA}: a página não existe`);
    return fora();
  }
  if (naPasta.length === 0) problemas.push(`${A_PASTA}: o git não carrega nada além da página — universo vazio (D213)`);
  const viva = semRiscado(pagina);
  const diz = (f: string) => comoARegraSeLe(viva).includes(comoARegraSeLe(f));

  // 1 · o mapa, nos dois sentidos
  const mapa = oMapa(pagina);
  if (mapa === null) problemas.push(`${A_PAGINA}: sem as marcas do mapa dos arquivos`);
  for (const n of naPasta) if (!(mapa ?? []).includes(n)) problemas.push(`${A_PAGINA}: o mapa não nomeia ${n}, que o git carrega na pasta`);
  for (const n of mapa ?? []) if (!naPasta.includes(n)) problemas.push(`${A_PAGINA}: o mapa nomeia ${n}, que o git não carrega na pasta`);
  if (mapa !== null && new Set(mapa).size !== mapa.length) problemas.push(`${A_PAGINA}: o mapa repete um nome`);

  // 2 e 4 · o que só vale riscado
  for (const f of SO_RISCADO) if (viva.includes(f)) problemas.push(`${A_PAGINA}: afirma «${f}» fora de risco`);
  if (!diz(A_PAGINA_DIZ_DO_JUIZ)) problemas.push(`${A_PAGINA}: não diz que o Validator e o Judge ${A_PAGINA_DIZ_DO_JUIZ} («${A_PAGINA_DIZ_DO_JUIZ}»)`);

  // 3 · o que a função não faz
  if (!/^## O que `gerarRedeViaria` NÃO faz/m.test(pagina)) problemas.push(`${A_PAGINA}: a seção do que não faz não nomeia \`${A_FUNCAO}\``);
  const index = ler(O_INDEX);
  if (index === null) problemas.push(`${O_INDEX}: não existe`);
  else {
    const corpo = corpoDa(A_FUNCAO, index);
    if (corpo === null) problemas.push(`${O_INDEX}: não define ${A_FUNCAO}`);
    else if (/\brecortar\w*\s*\(/.test(soCodigo(corpo))) problemas.push(`${O_INDEX}: ${A_FUNCAO} chama um recorte, e a página diz que ela não recorta`);
    if (!new RegExp(`^export \\{[^}]*\\b${A_FUNCAO_DO_RECORTE}\\b[^}]*\\} from "\\./recorte\\.ts"`, "m").test(index))
      problemas.push(`${O_INDEX}: não exporta ${A_FUNCAO_DO_RECORTE} de ./recorte.ts, e a página o dá como função deste adaptador`);
  }
  const recorte = ler(O_RECORTE);
  if (recorte === null) problemas.push(`${O_RECORTE}: não existe`);
  else if (corpoDa(A_FUNCAO_DO_RECORTE, recorte) === null) problemas.push(`${O_RECORTE}: não define ${A_FUNCAO_DO_RECORTE}`);
  if (!viva.includes(`\`${A_FUNCAO_DO_RECORTE}\``)) problemas.push(`${A_PAGINA}: não nomeia a função do recorte, \`${A_FUNCAO_DO_RECORTE}\``);
  const quemChama = /chama\s+depois\s+\(`(external-engines\/[^`]+)`\)/.exec(viva)?.[1] ?? null;
  if (quemChama === null) problemas.push(`${A_PAGINA}: não aponta quem chama o recorte («chama depois (\`external-engines/…\`)»)`);
  else {
    const t = ler(quemChama);
    if (t === null) problemas.push(`${A_PAGINA}: aponta ${quemChama} como quem chama o recorte, e ele não existe`);
    else if (!new RegExp(`\\b${A_FUNCAO_DO_RECORTE}\\s*\\(`).test(soCodigo(t)))
      problemas.push(`${quemChama}: não chama ${A_FUNCAO_DO_RECORTE}, e a página diz que chama`);
  }

  // 5 · os ≈ 38 %
  const medicoes = ler(AS_MEDICOES);
  if (medicoes === null) problemas.push(`${AS_MEDICOES}: não existe`);
  const fracao = medicoes === null ? null : aFracao(medicoes, O_TERRENO);
  if (medicoes !== null && fracao === null) problemas.push(`${AS_MEDICOES}: sem vias.fracaoForaDaGleba do terreno ${O_TERRENO}`);
  if (!viva.includes(O_TERRENO)) problemas.push(`${A_PAGINA}: não nomeia o terreno da fração (${O_TERRENO})`);
  const aprox = [...comoARegraSeLe(viva).matchAll(/≈ (\d+) %/g)].map((m) => Number(m[1]));
  if (aprox.length === 0) problemas.push(`${A_PAGINA}: sem o «≈ N %» da via fora da gleba`);
  if (fracao !== null) {
    for (const n of aprox) if (n !== Math.round(fracao * 100)) problemas.push(`${A_PAGINA}: diz ≈ ${n} %, e a medição dá ${fracao} (${Math.round(fracao * 100)} %)`);
    const citada = /\b0,(\d{4})\b/.exec(viva)?.[1];
    if (citada === undefined) problemas.push(`${A_PAGINA}: não cita a fração medida com quatro casas`);
    else if (Number(`0.${citada}`) !== fracao) problemas.push(`${A_PAGINA}: cita 0,${citada}, e a medição dá ${fracao}`);
  }

  // 6 · os padrões
  const bloco = oBlocoDoContrato(pagina);
  if (bloco === null) problemas.push(`${A_PAGINA}: sem o bloco de código do contrato de entrada`);
  const padroes = bloco === null ? {} : osPadroesEm(bloco);
  const contrato = ler(O_CONTRATO);
  if (contrato === null) problemas.push(`${O_CONTRATO}: não existe`);
  const corpoPadrao = contrato === null ? null : oPadraoDoContrato(contrato);
  if (contrato !== null && corpoPadrao === null) problemas.push(`${O_CONTRATO}: sem o PARAMETROS_PADRAO`);
  if (bloco !== null && corpoPadrao !== null) {
    const doContrato = osPadroesEm(corpoPadrao);
    for (const k of OS_PADROES) {
      if (doContrato[k] === null) problemas.push(`${O_CONTRATO}: o PARAMETROS_PADRAO não traz ${k}`);
      else if (padroes[k] !== doContrato[k]) problemas.push(`${A_PAGINA}: o bloco diz ${k} = ${padroes[k]}, e o PARAMETROS_PADRAO diz ${doContrato[k]}`);
    }
  }

  // 7 · os nomes do Generate
  const nomesDoBloco = bloco === null ? [] : osNomesDoBloco(bloco);
  const nomesDoContrato = contrato === null ? [] : osNomesDoContrato(contrato);
  if (bloco !== null && nomesDoBloco.length === 0) problemas.push(`${A_PAGINA}: o bloco não cita nome nenhum do Generate`);
  if (contrato !== null && nomesDoBloco.join() !== nomesDoContrato.join())
    problemas.push(`${A_PAGINA}: o bloco cita ${nomesDoBloco.join(", ") || "nada"} do Generate, e o ${O_CONTRATO} cita ${nomesDoContrato.join(", ") || "nada"}`);
  // O nome errado pode ficar escrito como história, desde que cada menção venha com a frase que diz que ele nunca existiu.
  for (const [c, t] of [[A_PAGINA, pagina], [O_CONTRATO, contrato]] as const) {
    if (t === null) continue;
    const lida = comoARegraSeLe(semRiscado(t).replace(/^\s*\*\s?/gm, ""));
    const vezes = lida.split(O_NOME_QUE_NUNCA_EXISTIU).length - 1;
    const ditas = lida.split(A_FRASE_DO_NOME).length - 1;
    if (vezes > ditas) problemas.push(`${c}: cita ${O_NOME_QUE_NUNCA_EXISTIU}, um nome que o Generate nunca teve, sem dizê-lo`);
  }

  // 8 · os 15 m do upstream
  const quinze = /via a cada (\d+) m/.exec(viva)?.[1];
  if (quinze !== undefined) {
    const tracer = ler(O_TRACER);
    const local = tracer === null ? null : oLocalDoUpstream(tracer);
    if (local === null) problemas.push(`${O_TRACER}: sem o minor_road_dist do Default de TensorConfig`);
    else if (local !== Number(quinze)) problemas.push(`${A_PAGINA}: diz via a cada ${quinze} m no upstream, e o Default dá ${local}`);
  } else problemas.push(`${A_PAGINA}: não diz o espaçamento do upstream («via a cada N m»)`);

  // 9 · os caminhos
  let caminhosLidos = 0;
  for (const l of [...pagina.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1] as string)) {
    if (/^[a-z]+:/i.test(l) || l.startsWith("#")) continue;
    caminhosLidos++;
    const alvo = normalize(A_PASTA + l).replace(/\/$/, "");
    if (!resolve(alvo)) problemas.push(`${A_PAGINA}: o link ${l} não resolve em nada que o git carrega (${alvo})`);
  }
  for (const c of [...pagina.matchAll(/`((?:docs|external-engines|outputs)\/[^`\s]+)`/g)].map((m) => m[1] as string)) {
    caminhosLidos++;
    if (!resolve(c.replace(/\/$/, ""))) problemas.push(`${A_PAGINA}: ${c} não existe no git`);
  }

  // 10 · o cabeçalho de src/index.ts (LAB-192)
  if (index !== null) {
    const cab = oCabecalho(index);
    if (cab === null) problemas.push(`${O_INDEX}: não abre com o comentário de cabeçalho`);
    else {
      const linha = cab.replace(/\s+/g, " ");
      const vivo = semRiscado(linha);
      if (!/^# O que `gerarRedeViaria` NÃO faz/m.test(cab)) problemas.push(`${O_INDEX}: o cabeçalho não nomeia \`${A_FUNCAO}\` no título do que não faz`);
      for (const f of SO_RISCADO_NO_CABECALHO) if (vivo.includes(f)) problemas.push(`${O_INDEX}: o cabeçalho afirma «${f}» fora de risco`);
      if (!vivo.includes(A_PAGINA_DIZ_DO_JUIZ)) problemas.push(`${O_INDEX}: o cabeçalho não diz que o Validator e o Judge ${A_PAGINA_DIZ_DO_JUIZ}`);
      if (!vivo.includes(`\`${A_FUNCAO_DO_RECORTE}\``)) problemas.push(`${O_INDEX}: o cabeçalho não nomeia a função do recorte, \`${A_FUNCAO_DO_RECORTE}\``);
      if (!vivo.includes("`./recorte.ts`")) problemas.push(`${O_INDEX}: o cabeçalho não diz onde o recorte mora (\`./recorte.ts\`)`);
      const chama = /chama depois \(`(external-engines\/[^`]+)`\)/.exec(vivo)?.[1] ?? null;
      if (chama === null) problemas.push(`${O_INDEX}: o cabeçalho não aponta quem chama o recorte («chama depois (\`external-engines/…\`)»)`);
      else {
        const t = ler(chama);
        if (t === null) problemas.push(`${O_INDEX}: o cabeçalho aponta ${chama} como quem chama o recorte, e ele não existe`);
        else if (!new RegExp(`\\b${A_FUNCAO_DO_RECORTE}\\s*\\(`).test(soCodigo(t)))
          problemas.push(`${chama}: não chama ${A_FUNCAO_DO_RECORTE}, e o cabeçalho de ${O_INDEX} diz que chama`);
      }
    }
  }

  return { naPasta, noMapa: (mapa ?? []).length, padroes, fracao, caminhosLidos, problemas };
}

export function conferirAArvore(raiz: string): Resultado {
  const ler = (c: string) => {
    const p = join(raiz, c);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  return conferir(arquivosQueOGitCarrega(raiz), ler);
}

/** Onde mora cada nome no Generate, e o que ele tem de valer — o padrão do contrato de entrada que o cita. */
export const NO_GENERATE = [
  { nome: "LIMITES_TOPOGRAFIA.rampaMaxPct", arquivo: "src/lib/engine/topografia.ts", padrao: "rampaMaxima_pct" },
  { nome: "NORMA_BR.viario.valor.caixaMinima", arquivo: "src/lib/normas/br.ts", padrao: "faixaDominio_m" },
] as const;

/**
 * Uma conta de números com `+ - * /`, sem parênteses (o `6 + 2 * 1.2` da norma), com a precedência de sempre. `null` se
 * tem outra coisa — nome, parêntese, sinal sobrando. Não executa texto: soma de produtos, lida à mão.
 */
export function aConta(expr: string): number | null {
  const pedacos = expr.trim().split(/\s*([+-])\s*/);
  let total = 0;
  for (let i = 0; i < pedacos.length; i += 2) {
    const termo = pedacos[i] as string;
    const sinal = i === 0 ? "+" : pedacos[i - 1];
    const fatores = termo.split(/\s*([*/])\s*/);
    let v = Number.NaN;
    for (let j = 0; j < fatores.length; j += 2) {
      const f = fatores[j] as string;
      if (!/^\d+(?:\.\d+)?$/.test(f)) return null;
      v = j === 0 ? Number(f) : fatores[j - 1] === "*" ? v * Number(f) : v / Number(f);
    }
    total += sinal === "-" ? -v : v;
  }
  return Number.isFinite(total) ? Math.round(total * 1e9) / 1e9 : null;
}

/**
 * O valor de um caminho `A.b.c` (a constante e as chaves) num arquivo TypeScript do Generate: acha `export const A`, e
 * desce chave a chave pelo primeiro `chave:` depois da anterior, dentro do objeto. Lê texto, não executa o arquivo.
 */
export function oValorNoArquivo(ts: string, caminho: string): number | null {
  const [constante, ...chaves] = caminho.split(".");
  const i = ts.search(new RegExp(`^export const ${constante}\\b`, "m"));
  if (i < 0 || chaves.length === 0) return null;
  let resto = ts.slice(i);
  for (const [n, chave] of chaves.entries()) {
    const m = new RegExp(`\\b${chave}\\s*:\\s*`).exec(resto);
    if (!m) return null;
    resto = resto.slice(m.index + m[0].length);
    if (n === chaves.length - 1) return aConta(/^([^,}\n]+)/.exec(resto)?.[1] ?? "");
  }
  return null;
}

/** A pergunta que precisa do clone do Generate: cada nome existe lá, e vale o padrão do contrato de entrada. */
export function conferirNoGenerate(raizDoGenerate: string, contrato: string): string[] {
  const problemas: string[] = [];
  const corpo = oPadraoDoContrato(contrato);
  const padroes = corpo === null ? {} : osPadroesEm(corpo);
  for (const { nome, arquivo, padrao } of NO_GENERATE) {
    const p = join(raizDoGenerate, arquivo);
    if (!existsSync(p)) {
      problemas.push(`Generate: ${arquivo} não existe`);
      continue;
    }
    const v = oValorNoArquivo(readFileSync(p, "utf8"), nome);
    if (v === null) problemas.push(`Generate: ${nome} não existe em ${arquivo}`);
    else if (v !== padroes[padrao]) problemas.push(`Generate: ${nome} vale ${v}, e o PARAMETROS_PADRAO dá ${padrao} = ${padroes[padrao]}`);
  }
  return problemas;
}

export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se a coluna «O que faz» do mapa descreve o arquivo: a régua confere o nome, não a descrição ao lado",
  "se o LAB que a página dá a cada arquivo (LAB-02, LAB-05) é o do commit que o criou: medido à mão no LAB-191, não perguntado ao git",
  "se o ≈ 38 % é verdade HOJE: é história do LAB-01 (D118), e a medição não se refaz sem o `.wasm`, que esta máquina não constrói",
  "a receita de instalar e executar: é do LAB-133 (`node-sem-npm.ts`) e do LAB-176 (`o-wasm-nao-pede-nada.ts`), não desta régua",
  "o resto do cabeçalho de `src/index.ts` (a cadeia do LAB-01, o lote, os nomes de arquivo da cadeia): a régua do LAB-192 pergunta só o título, as duas frases riscadas, o juiz e o recorte",
  "a mesma frase velha noutros lugares: o `README.md` da raiz (*\"O Adapter do Symbios … não recorta pela gleba … cada uma dessas coisas é de um prompt adiante\"*), o comentário de `Restricao` em `src/contrato.ts` e a `observacao` de `src/geojson.ts` (*\"o recorte é o LAB-02\"*), que sai na prova congelada `outputs/lab01/` (D118) — candidatos, escritos no relatório do LAB-192",
  "os nomes do Generate no `docs/DECISOES.md` (D13) e no `docs/relatorios/LAB01_ADAPTADOR.md`: são história, e a D419 diz o nome certo",
];
