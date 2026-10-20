/**
 * **LAB-198 (item 900) · as provas que rodam código de vizinho e não escrevem o commit dele — contadas por
 * LUGAR** (D426).
 *
 * # A regra que existia, e a guarda que não existia
 *
 * O LAB-79 (`src/alcance-das-provas.ts`) escreveu a terceira classe de prova — *"ela afirma o presente de um
 * CLONE VIZINHO, num commit dele"* — e a regra dela: **regera-se declarando o commit, e nunca sem ele**
 * (`podeSerRegerada`). A função tem teste; **o universo, nenhum**. Nenhuma trava perguntava QUAIS provas desta
 * casa rodam código de vizinho, nem quais delas escrevem o commit do vizinho que rodaram. O LAB-196 e o LAB-197
 * acharam o buraco duas vezes, prova a prova (a do LAB-60 escrevia o commit; a do LAB-48 não escrevia nenhum,
 * e foi preciso arqueologia para achá-los). Esta rodada **conta o buraco inteiro**, por lugar.
 *
 * # Os três lugares, e o que cada um responde
 *
 * 1. **Quem grava a prova** — {@link QUEM_GRAVA}, escrita à mão, uma linha por arquivo de `docs/provas/`, e
 *    **fechada nos dois sentidos** contra o disco. Não se adivinha pelo nome do arquivo: `medicoes.json` tem
 *    nove pastas e oito ferramentas, e os `*.saida.json` do LAB-07 saem de um molde (`${id}.saida.json`) que
 *    nenhuma busca por nome acha. O que não tem ferramenta (o registro de um ATO: as sabotagens, os disparos
 *    do CI, o oráculo do LAB-04) diz `null` e o motivo.
 * 2. **Que vizinho a ferramenta RODA** — medido, não escrito: o fecho dos `import` de execução da ferramenta,
 *    seguindo os caminhos relativos e os apelidos do `tsconfig.json` mais próximo; apelido que resolve para
 *    fora desta casa é vizinho. **`import type` não conta**: tipo não roda. Ler arquivo de vizinho por caminho
 *    (o LAB-60, o LAB-68) também não conta — é leitura, não execução; essas provas falam do vizinho, mas o
 *    código dele não correu.
 * 3. **Que commit a prova ESCREVE** — medido: todo trecho hexadecimal de 7 a 40 casas na prova que é um commit
 *    **na história do vizinho** (`git cat-file --batch-check`). Não basta parecer commit: tem de ser dele.
 *
 * O que falta numa prova é a diferença: vizinho que a ferramenta roda e cujo commit a prova não escreve.
 *
 * # Medido em 19/10/2026 (Lab `ae4a164`, motor `0684d78`, Generate `7302864`)
 *
 * O retrato está em {@link OS_CALADOS_DE_HOJE}, e a frase é a que a trava publica a cada verde completo:
 *
 * ```
 * 92 provas · 10 sem ferramenta · 38 gravadas por ferramenta que não roda vizinho ·
 * 44 rodam vizinho: 3 escrevem o commit de todos, 41 calam ao menos um
 * (31 calam motor-testfit · 40 calam urban-create-hub-41d93a4d)
 * ```
 *
 * As três que escrevem tudo são a do LAB-76 (roda só o motor, e escreve `6cf6396`) e as do LAB-93 e do LAB-94,
 * que já nasceram com `ondeOMotorFoiLido`. Duas escrevem metade: a do LAB-18 escreve o Generate (`5b7e9b4`) e
 * cala o motor; a do LAB-78 escreve o motor (`4181e95`, `6cf6396`) e cala o Generate — que roda ali como
 * Validator. **A regra do LAB-79 tinha 44 sujeitos, e três a cumpriam.**
 *
 * # Por que os calados ficam CONGELADOS, e não consertados aqui
 *
 * Escrever o commit DENTRO de uma prova já gravada é sobregravá-la (D182) — e o commit não se adivinha pela
 * data: o LAB-197 mediu que a ponta da origem no instante da prova do LAB-48 dá 221 violações onde a prova diz
 * 128. Achar o commit de cada uma é a arqueologia do LAB-196 e do LAB-197, uma prova por rodada, e o lugar de
 * escrevê-lo é AO LADO (como `src/fotografia-do-lab48.ts`). Então a lista de hoje é congelada **nos dois
 * sentidos**: prova nova que roda vizinho e cala o commit reprova (relatório novo sem exceção, como o D377);
 * prova da lista que passar a escrever o commit, ou cuja ferramenta deixar de rodar o vizinho, reprova pedindo
 * para sair da lista — *lista que não se revalida envelhece igual a comentário* (D104).
 *
 * # O que isto não alcança, dito
 *
 * - **se o commit escrito é o certo**: a régua diz que a prova nomeia um commit que existe na história do
 *   vizinho, não que a medição foi tirada nele — essa pergunta é a do LAB-196 (rodar a ferramenta no commit);
 * - **ferramenta que roda vizinho por processo** (`bun run` no clone, `spawn`): o fecho segue `import`, não
 *   processo filho; hoje nenhuma ferramenta que grava prova faz isso, e a lista fechada de {@link QUEM_GRAVA}
 *   é onde uma nova apareceria;
 * - **se a ferramenta de `QUEM_GRAVA` grava mesmo aquele arquivo**: a trava confere que ela existe e que nomeia
 *   a pasta da prova, não que a linha de escrita é aquela;
 * - **o Symbios**: `upstream/` é cópia DESTA casa, não clone vizinho — o que ele roda não entra na conta.
 *
 * # Os achados AO LADO (LAB-199, D427)
 *
 * O commit achado pela arqueologia não entra na prova (D182), e por isso a prova **continua** no retrato: ela
 * segue calando, e é verdade. O que muda é que o commit passou a estar escrito noutro lugar, com uma trava
 * que roda a ferramenta nele. {@link OS_ACHADOS_AO_LADO} diz qual prova, qual vizinho e em que módulo — e
 * {@link conferirOsAchadosAoLado} cobra que cada linha seja de uma prova do retrato calando aquele vizinho, e
 * que o módulo exista e nomeie a prova. A frase publica a conta: *"achados ao lado: N de M"*. As provas de hoje:
 * a do LAB-48 (motor e Generate, `src/fotografia-do-lab48.ts`), a do LAB-18 (o motor, numa **janela** de cinco
 * commits, `src/retrato-do-lab18.ts`) e a do LAB-78 (o Generate, numa janela **aberta** — do contrato v2 até
 * onde se mediu —, `src/retrato-do-lab78.ts`; LAB-200, D428). E as duas do diagnóstico de relevo do LAB-07 (o
 * Generate, numa janela **aberta** — do P43 na tela até onde se mediu —, `src/retrato-do-lab07-relevo.ts`;
 * LAB-201, D429). E as cinco do `medir.ts` do LAB-07 (o motor e o Generate, em duas janelas **fechadas** — o
 * motor de 10/09 a 14/09, o Generate do contrato v1 ao último antes do v2 —, `src/retrato-do-lab07-medir.ts`;
 * LAB-202, D430). E a guarda da IDA do LAB-30 (o motor e o Generate — que ela CARREGA e não CHAMA: com toda função
 * de topo dos dois envenenada, a prova sai igual —, `src/retrato-do-lab30.ts`; LAB-203, D431). E a testada de frente
 * do LAB-37 (o motor numa janela **fechada** de 14/09 — FORA do instante, que acusa — e o Generate numa **aberta**, do
 * contrato v2 até onde se mediu —, `src/retrato-do-lab37.ts`; LAB-204, D432). E as fixtures do LAB-40 (o mesmo
 * desenho: o motor numa janela **fechada** de 14/09, FORA do instante, e o Generate numa **aberta** —,
 * `src/retrato-do-lab40.ts`; LAB-205, D433). E a do LAB-41 (o Generate numa janela **fechada**, de 20/09 a 14/10,
 * com o instante DENTRO —, `src/retrato-do-lab41.ts`; LAB-206, D434). E a do LAB-46 (o motor numa janela **fechada**
 * de 14/09 — a mesma do LAB-37, FORA do instante — e o Generate numa **aberta**, do contrato v2 até onde se mediu —,
 * `src/retrato-do-lab46.ts`; LAB-207, D435). E a passagem externa do LAB-50 (o motor na MESMA janela fechada de 14/09,
 * FORA do instante, e o Generate numa **aberta**, do contrato v2 até onde se mediu —, `src/retrato-do-lab50.ts`;
 * LAB-208, D436). E a aferição do LAB-53 (o motor na MESMA janela **fechada** de 14/09 e o Generate numa **fechada**, do
 * contrato v2 a 03/10, com os DOIS instantes FORA —, `src/retrato-do-lab53.ts`; LAB-209, D437; a *ilha* do T01 e o
 * começo no contrato v1 que o LAB-209 escreveu eram a ferramenta gravando `LAB-48/`, corrigidos no LAB-210, D438):
 * E a atribuição das `frente` do LAB-54 (o motor na MESMA janela fechada de 14/09, FORA do instante, e o Generate numa
 * **aberta**, do contrato v2 até onde se mediu —, `src/retrato-do-lab54.ts`; LAB-211, D439). E a assimetria da faixa do
 * LAB-55 (o motor na MESMA janela fechada de 14/09, FORA do instante, e o Generate numa **aberta**, do contrato v2 até
 * onde se mediu —, `src/retrato-do-lab55.ts`; LAB-212, D440). E os mecanismos das 81 do LAB-58 (o motor na MESMA
 * janela fechada de 14/09 e o Generate na fechada do LAB-53, do contrato v2 a 03/10, com os DOIS instantes FORA — herdadas,
 * porque fora delas a ferramenta PARA —, `src/retrato-do-lab58.ts`; LAB-213, D441): vinte provas, trinta e cinco
 * silêncios.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, normalize, relative, sep } from "node:path";

/** Uma linha da lista à mão: quem grava cada arquivo de `docs/provas/`. */
export interface QuemGrava {
  /** O caminho dentro de `docs/provas/`. */
  prova: string;
  /** A ferramenta, relativa à raiz do Lab — ou `null` quando nenhuma ferramenta a grava. */
  ferramenta: string | null;
  /** Só para `null`: por que não há ferramenta. */
  porque?: string;
}

const E = "external-engines/esteira/ferramentas";
const T = "external-engines/testfit/ferramentas";
const N = "external-engines/symbios/adapter/ferramentas/navegador";

const ATO = (o: string) =>
  `o registro de um ATO, escrito à mão na rodada: ${o}. Não há ferramenta que o grave, e por isso ele não roda código de ninguém`;

/**
 * **A lista, fechada nos dois sentidos contra `docs/provas/`** (o `LEIA-ME.md` fica fora: é página, não
 * prova). Conferida contra a busca por nome e contra o molde de cada ferramenta em 19/10/2026.
 */
export const QUEM_GRAVA: readonly QuemGrava[] = [
  { prova: "LAB-02/completo.saida-cortada.json", ferramenta: `${E}/lab02.ts` },
  { prova: "LAB-02/medicoes.json", ferramenta: `${E}/lab02.ts` },
  { prova: "LAB-02/sintetico-10ha-plano.saida-cortada.json", ferramenta: `${E}/lab02.ts` },
  { prova: "LAB-02/sintetico-50ha-ondulado.saida-cortada.json", ferramenta: `${E}/lab02.ts` },
  { prova: "LAB-03/medicoes.json", ferramenta: `${E}/lab03.ts` },
  { prova: "LAB-04/medicoes.json", ferramenta: `${E}/lab04.ts` },
  {
    prova: "LAB-04/oraculo.json",
    ferramenta: null,
    porque:
      "o oráculo do esqueleto reto, gravado no LAB-04 com os casos da literatura; nenhum arquivo de código desta casa o escreve — os que o nomeiam (`lab87.ts`, `a-analise-do-esqueleto-reto.ts`) só o leem",
  },
  { prova: "LAB-05/medicoes.json", ferramenta: `${E}/lab05.ts` },
  { prova: "LAB-06/ranking.json", ferramenta: `${E}/lab06.ts` },
  { prova: "LAB-07/diagnostico-relevo.json", ferramenta: `${T}/diagnostico-relevo.ts` },
  { prova: "LAB-07/diagnostico-relevo.txt", ferramenta: `${T}/diagnostico-relevo.ts` },
  { prova: "LAB-07/ensaio-47ha.saida.json", ferramenta: `${T}/medir.ts` },
  { prova: "LAB-07/geo-antonina.saida.json", ferramenta: `${T}/medir.ts` },
  { prova: "LAB-07/lab01-50ha-ondulado.entrada.json", ferramenta: `${T}/gleba-lab01.ts` },
  { prova: "LAB-07/lab01-50ha-ondulado.saida.json", ferramenta: `${T}/medir.ts` },
  { prova: "LAB-07/medicoes.json", ferramenta: `${T}/medir.ts` },
  { prova: "LAB-07/medir.txt", ferramenta: `${T}/medir.ts` },
  { prova: "LAB-08/medicoes.json", ferramenta: `${E}/lab08.ts` },
  { prova: "LAB-13/medicoes.json", ferramenta: `${E}/lab13.ts` },
  { prova: "LAB-16/forma.json", ferramenta: `${E}/lab16.ts` },
  { prova: "LAB-17/medicoes.json", ferramenta: `${E}/lab17.ts` },
  { prova: "LAB-18/contrato-v2.json", ferramenta: `${E}/lab18.ts` },
  { prova: "LAB-19/tabela.json", ferramenta: `${E}/lab19.ts` },
  { prova: "LAB-21/rampa.json", ferramenta: `${E}/lab21.ts` },
  { prova: "LAB-23/coluna-vertebral.json", ferramenta: `${E}/lab23.ts` },
  { prova: "LAB-24/formato-proposto.json", ferramenta: `${E}/lab24.ts` },
  { prova: "LAB-24/terreno.json", ferramenta: `${E}/lab24.ts` },
  { prova: "LAB-25/guarda-da-ponte.json", ferramenta: `${E}/lab25.ts` },
  { prova: "LAB-26/varredura.json", ferramenta: `${E}/lab26.ts` },
  { prova: "LAB-28/acesso.json", ferramenta: `${E}/lab28.ts` },
  { prova: "LAB-30/guarda-da-ida.json", ferramenta: `${E}/lab30.ts` },
  { prova: "LAB-31/navegador.json", ferramenta: `${N}/prova-automatica.ts` },
  { prova: "LAB-31/sabotagem.json", ferramenta: null, porque: ATO("a sabotagem do comando único") },
  { prova: "LAB-32/aderencia.json", ferramenta: `${E}/lab32.ts` },
  { prova: "LAB-37/testada-de-frente.json", ferramenta: `${E}/lab37.ts` },
  { prova: "LAB-38/ci.json", ferramenta: null, porque: ATO("os três disparos do CI, um deles sabotado") },
  { prova: "LAB-39/confronto-refeito.json", ferramenta: `${E}/lab39.ts` },
  { prova: "LAB-40/fixtures.json", ferramenta: `${E}/lab40.ts` },
  { prova: "LAB-41/ortogonal-fora-da-gleba.json", ferramenta: `${E}/lab41.ts` },
  { prova: "LAB-46/antonina-tres-amostragens.json", ferramenta: `${E}/lab46.ts` },
  { prova: "LAB-47/varredura-de-segredos.json", ferramenta: `${E}/lab47.ts` },
  { prova: "LAB-48/violacoes-do-motor-padrao.json", ferramenta: `${E}/lab48.ts` },
  { prova: "LAB-49/detector-de-prova-velha.json", ferramenta: `${E}/lab49.ts` },
  { prova: "LAB-50/passagem-externa.json", ferramenta: `${E}/lab50.ts` },
  { prova: "LAB-52/varredura-de-chamadas.json", ferramenta: `${E}/lab52.ts` },
  // O LAB-53 tirou o destino da medição do `lab48.ts` (`ponteConsertada`): hoje é ele que grava o "depois".
  { prova: "LAB-53/violacoes-depois-do-conserto-da-ponte.json", ferramenta: `${E}/lab48.ts` },
  { prova: "LAB-54/frente-nao-atribuida.json", ferramenta: `${E}/lab54.ts` },
  { prova: "LAB-55/via-sobre-a-faixa.json", ferramenta: `${E}/lab55.ts` },
  { prova: "LAB-57/varredura-de-configuracao.json", ferramenta: `${E}/lab57.ts` },
  { prova: "LAB-58/mecanismos-das-81.json", ferramenta: `${E}/lab58.ts` },
  { prova: "LAB-58/sabotagem.json", ferramenta: null, porque: ATO("as quatro sabotagens das travas do agrupamento") },
  { prova: "LAB-59/contrafactual-de-antonina.json", ferramenta: `${E}/lab59.ts` },
  { prova: "LAB-59/sabotagem.json", ferramenta: null, porque: ATO("as quatro sabotagens das travas do contrafactual") },
  { prova: "LAB-60/configuracao-do-motor.json", ferramenta: `${E}/lab60.ts` },
  { prova: "LAB-60/sabotagem.json", ferramenta: null, porque: ATO("as duas sabotagens das travas da limpeza") },
  { prova: "LAB-61/a-minha-lista-de-propostas.json", ferramenta: `${E}/lab61.ts` },
  { prova: "LAB-61/sabotagem.json", ferramenta: null, porque: ATO("as três sabotagens das travas da lista") },
  { prova: "LAB-62/as-tres-listas.json", ferramenta: `${E}/lab62.ts` },
  { prova: "LAB-62/os-tres-blocos.txt", ferramenta: `${E}/lab62.ts` },
  { prova: "LAB-62/sabotagem.json", ferramenta: null, porque: ATO("as quatro sabotagens das travas das três listas") },
  { prova: "LAB-63/o-que-eu-aceitei.json", ferramenta: `${E}/lab63.ts` },
  { prova: "LAB-63/sabotagem.json", ferramenta: null, porque: ATO("as quatro sabotagens das travas do que eu aceitei") },
  { prova: "LAB-66/o-acumulado-dos-recados.json", ferramenta: `${E}/lab66.ts` },
  { prova: "LAB-66/sabotagem.json", ferramenta: null, porque: ATO("as quatro sabotagens das travas do bloco único") },
  { prova: "LAB-68/as-duas-pilhas.json", ferramenta: `${E}/lab68.ts` },
  { prova: "LAB-76/registro-de-motores.json", ferramenta: `${E}/lab76.ts` },
  { prova: "LAB-77/acesso-sugerido.json", ferramenta: `${E}/lab77.ts` },
  { prova: "LAB-78/setimo-mecanismo.json", ferramenta: `${E}/lab78.ts` },
  { prova: "LAB-79/alcance-das-provas.json", ferramenta: `${E}/lab79.ts` },
  { prova: "LAB-80/destino-do-que-sai.json", ferramenta: `${E}/lab80.ts` },
  { prova: "LAB-81/as-leituras.json", ferramenta: `${E}/lab81.ts` },
  { prova: "LAB-82/remedicao-antes-do-pedido.json", ferramenta: `${E}/lab82.ts` },
  { prova: "LAB-83/carimbo-do-modulo-resolvido.json", ferramenta: `${E}/lab83.ts` },
  { prova: "LAB-84/as-trinta-por-execucao.json", ferramenta: `${E}/lab84.ts` },
  { prova: "LAB-85/o-que-o-gatilho-carrega.json", ferramenta: `${E}/lab85.ts` },
  { prova: "LAB-86/a-prova-velha.json", ferramenta: `${E}/lab86.ts` },
  { prova: "LAB-87/as-onze-reclassificadas.json", ferramenta: `${E}/lab87.ts` },
  { prova: "LAB-88/onde-esta-o-padrao.json", ferramenta: `${E}/lab88.ts` },
  { prova: "LAB-89/a-pergunta-virou-guarda.json", ferramenta: `${E}/lab89.ts` },
  { prova: "LAB-90/caixa-vazia-era-verdade.json", ferramenta: `${E}/lab90.ts` },
  { prova: "LAB-91/a-varredura-regerada.json", ferramenta: `${E}/lab91.ts` },
  { prova: "LAB-92/premissas-identicas.json", ferramenta: `${E}/lab92.ts` },
  { prova: "LAB-93/as-cinco-passagens.json", ferramenta: `${E}/lab93.ts` },
  { prova: "LAB-94/o-preco-do-setimo.json", ferramenta: `${E}/lab94.ts` },
  { prova: "LAB-95/nada-se-perdeu.json", ferramenta: `${E}/lab95.ts` },
  { prova: "LAB-171/packingsolver-na-origem.json", ferramenta: `${E}/lab171.ts` },
  { prova: "LAB-172/esqueleto-reto-na-origem.json", ferramenta: `${E}/lab172.ts` },
  { prova: "LAB-173/rodadas-sem-linha.json", ferramenta: `${E}/lab173.ts` },
  { prova: "LAB-182/navegador-celular.json", ferramenta: `${N}/rolagem-no-celular.ts` },
  { prova: "LAB-185/symbios-na-origem.json", ferramenta: `${E}/lab185.ts` },
  { prova: "item-003/escopo-dos-instrumentos.json", ferramenta: `${E}/lab70.ts` },
  { prova: "item-004/conta-dos-disparos.json", ferramenta: `${E}/lab71.ts` },
];

// ── 2 · que vizinho a ferramenta RODA ─────────────────────────────────────────

/** Tira os comentários de bloco e de linha, sem tocar em `//` dentro de string de uma linha só. */
export function semComentarios(codigo: string): string {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((l) => (/^\s*\/\//.test(l) ? "" : l))
    .join("\n");
}

/**
 * Os especificadores de módulo que o arquivo carrega **em execução**: `import … from`, `export … from`,
 * `import "x"` e `import("x")`. Sai o que é só tipo — `import type`, `export type` e a chave em que todo
 * nome começa por `type`.
 */
export function importsDeExecucao(codigo: string): string[] {
  const c = semComentarios(codigo);
  const out: string[] = [];
  const estatico = /\b(import|export)\s+(type\s+)?([^;'"]*?)\s*from\s*["']([^"']+)["']/g;
  for (const m of c.matchAll(estatico)) {
    if (m[2]) continue;
    const nomes = (m[3] ?? "").trim();
    const chave = /^\{([\s\S]*)\}$/.exec(nomes);
    if (chave) {
      const itens = (chave[1] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      if (itens.length > 0 && itens.every((s) => /^type\s/.test(s))) continue;
    }
    out.push(m[4]!);
  }
  for (const m of c.matchAll(/(?:^|[;\n])\s*import\s*["']([^"']+)["']/g)) out.push(m[1]!);
  for (const m of c.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)) out.push(m[1]!);
  return out;
}

/** Os apelidos (`paths`) de um `tsconfig.json`, que tem comentário e por isso não é JSON. */
export function apelidosDoTsconfig(texto: string): { prefixo: string; alvo: string }[] {
  const out: { prefixo: string; alvo: string }[] = [];
  const bloco = /"paths"\s*:\s*\{([\s\S]*?)\}/.exec(semComentarios(texto));
  if (!bloco) return out;
  for (const m of (bloco[1] ?? "").matchAll(/"([^"]+)\*"\s*:\s*\[\s*"([^"]+)\*"/g)) {
    out.push({ prefixo: m[1]!, alvo: m[2]! });
  }
  // o prefixo mais longo primeiro: `@/` não pode engolir `@generate/`
  return out.sort((a, b) => b.prefixo.length - a.prefixo.length);
}

function tsconfigMaisProximo(arquivo: string, raiz: string): string | null {
  let d = dirname(arquivo);
  while (d.startsWith(raiz)) {
    const t = join(d, "tsconfig.json");
    if (existsSync(t)) return t;
    const acima = dirname(d);
    if (acima === d) break;
    d = acima;
  }
  return null;
}

function resolverArquivo(base: string): string | null {
  for (const c of [base, `${base}.ts`, join(base, "index.ts")]) {
    if (existsSync(c) && statSync(c).isFile() && c.endsWith(".ts")) return c;
  }
  return null;
}

/**
 * **O fecho dos `import` de execução** de uma ferramenta: segue o caminho relativo e o apelido que resolve
 * DENTRO desta casa; apelido que resolve para FORA é um vizinho, e ali o fecho para (o que o vizinho importa
 * é dele). Devolve os nomes das pastas dos vizinhos — o nome do clone ao lado do Lab.
 */
export function vizinhosQueRoda(ferramenta: string, raiz: string): string[] {
  const raizN = normalize(raiz);
  const vizinhos = new Set<string>();
  const vistos = new Set<string>();
  const pilha = [normalize(join(raizN, ferramenta))];
  const cacheApelidos = new Map<string, { prefixo: string; alvo: string; dir: string }[]>();
  while (pilha.length > 0) {
    const arq = pilha.pop()!;
    if (vistos.has(arq)) continue;
    vistos.add(arq);
    const ts = tsconfigMaisProximo(arq, raizN);
    let apelidos: { prefixo: string; alvo: string; dir: string }[] = [];
    if (ts) {
      if (!cacheApelidos.has(ts)) {
        cacheApelidos.set(
          ts,
          apelidosDoTsconfig(readFileSync(ts, "utf8")).map((a) => ({ ...a, dir: dirname(ts) })),
        );
      }
      apelidos = cacheApelidos.get(ts)!;
    }
    for (const spec of importsDeExecucao(readFileSync(arq, "utf8"))) {
      let destino: string | null = null;
      if (spec.startsWith(".")) destino = normalize(join(dirname(arq), spec));
      else {
        const a = apelidos.find((x) => spec.startsWith(x.prefixo));
        if (a) destino = normalize(join(a.dir, a.alvo + spec.slice(a.prefixo.length)));
      }
      if (destino === null) continue; // pacote (`node:fs`, `bun:test`, `zod`): não é vizinho
      const rel = relative(raizN, destino);
      if (rel.startsWith("..")) {
        vizinhos.add(rel.split(sep)[1]!);
        continue;
      }
      const r = resolverArquivo(destino);
      if (r) pilha.push(r);
    }
  }
  return [...vizinhos].sort();
}

// ── 3 · que commit a prova ESCREVE ────────────────────────────────────────────

/** Os trechos que PARECEM commit: 7 a 40 casas hexadecimais, com letra e algarismo, isolados. */
export function pareceCommit(texto: string): string[] {
  const out = new Set<string>();
  for (const m of texto.matchAll(/(?<![0-9a-zA-Z])[0-9a-f]{7,40}(?![0-9a-zA-Z])/g)) {
    if (/[a-f]/.test(m[0]) && /[0-9]/.test(m[0])) out.add(m[0]);
  }
  return [...out].sort();
}

// ── a conta ──────────────────────────────────────────────────────────────────

/** Uma prova que roda código de vizinho e o que ela escreve dele. */
export interface ProvaQueRodaVizinho {
  prova: string;
  ferramenta: string;
  roda: string[];
  /** Por vizinho, os commits da história dele que a prova escreve. */
  escreve: Record<string, string[]>;
  /** Os vizinhos que rodaram e cujo commit a prova cala. */
  cala: string[];
}

/**
 * Monta a conta, com o leitor de commits injetado: `ehCommitDe(vizinho, trechos)` devolve os trechos que são
 * commit na história daquele vizinho. Assim a sabotagem planta uma história sem clone nenhum.
 */
export function contarAsProvas(
  lista: readonly QuemGrava[],
  rodaDe: (ferramenta: string) => string[],
  textoDe: (prova: string) => string,
  ehCommitDe: (vizinho: string, trechos: string[]) => string[],
): ProvaQueRodaVizinho[] {
  const cacheRoda = new Map<string, string[]>();
  const out: ProvaQueRodaVizinho[] = [];
  for (const { prova, ferramenta } of lista) {
    if (ferramenta === null) continue;
    if (!cacheRoda.has(ferramenta)) cacheRoda.set(ferramenta, rodaDe(ferramenta));
    const roda = cacheRoda.get(ferramenta)!;
    if (roda.length === 0) continue;
    const trechos = pareceCommit(textoDe(prova));
    const escreve: Record<string, string[]> = {};
    for (const v of roda) escreve[v] = trechos.length === 0 ? [] : ehCommitDe(v, trechos);
    out.push({ prova, ferramenta, roda, escreve, cala: roda.filter((v) => escreve[v]!.length === 0) });
  }
  return out;
}

const MOTOR = "motor-testfit";
const GENERATE = "urban-create-hub-41d93a4d";

/**
 * **O retrato de 19/10/2026: as 41 provas que rodam vizinho e calam o commit dele**, com os vizinhos calados.
 * Congelado nos dois sentidos (o motivo está no cabeçalho). Sair daqui é o conserto; entrar é o defeito.
 */
export const OS_CALADOS_DE_HOJE: Readonly<Record<string, readonly string[]>> = {
  "LAB-02/completo.saida-cortada.json": [GENERATE],
  "LAB-02/medicoes.json": [GENERATE],
  "LAB-02/sintetico-10ha-plano.saida-cortada.json": [GENERATE],
  "LAB-02/sintetico-50ha-ondulado.saida-cortada.json": [GENERATE],
  "LAB-04/medicoes.json": [GENERATE],
  "LAB-05/medicoes.json": [GENERATE],
  "LAB-06/ranking.json": [MOTOR, GENERATE],
  "LAB-07/diagnostico-relevo.json": [GENERATE],
  "LAB-07/diagnostico-relevo.txt": [GENERATE],
  "LAB-07/ensaio-47ha.saida.json": [MOTOR, GENERATE],
  "LAB-07/geo-antonina.saida.json": [MOTOR, GENERATE],
  "LAB-07/lab01-50ha-ondulado.saida.json": [MOTOR, GENERATE],
  "LAB-07/medicoes.json": [MOTOR, GENERATE],
  "LAB-07/medir.txt": [MOTOR, GENERATE],
  "LAB-08/medicoes.json": [MOTOR, GENERATE],
  "LAB-13/medicoes.json": [MOTOR, GENERATE],
  "LAB-16/forma.json": [MOTOR, GENERATE],
  "LAB-17/medicoes.json": [MOTOR, GENERATE],
  "LAB-18/contrato-v2.json": [MOTOR],
  "LAB-19/tabela.json": [MOTOR, GENERATE],
  "LAB-21/rampa.json": [MOTOR, GENERATE],
  "LAB-23/coluna-vertebral.json": [MOTOR, GENERATE],
  "LAB-24/formato-proposto.json": [MOTOR, GENERATE],
  "LAB-24/terreno.json": [MOTOR, GENERATE],
  "LAB-25/guarda-da-ponte.json": [MOTOR, GENERATE],
  "LAB-26/varredura.json": [MOTOR, GENERATE],
  "LAB-28/acesso.json": [MOTOR, GENERATE],
  "LAB-30/guarda-da-ida.json": [MOTOR, GENERATE],
  "LAB-32/aderencia.json": [MOTOR, GENERATE],
  "LAB-37/testada-de-frente.json": [MOTOR, GENERATE],
  "LAB-40/fixtures.json": [MOTOR, GENERATE],
  "LAB-41/ortogonal-fora-da-gleba.json": [GENERATE],
  "LAB-46/antonina-tres-amostragens.json": [MOTOR, GENERATE],
  "LAB-48/violacoes-do-motor-padrao.json": [MOTOR, GENERATE],
  "LAB-50/passagem-externa.json": [MOTOR, GENERATE],
  "LAB-53/violacoes-depois-do-conserto-da-ponte.json": [MOTOR, GENERATE],
  "LAB-54/frente-nao-atribuida.json": [MOTOR, GENERATE],
  "LAB-55/via-sobre-a-faixa.json": [MOTOR, GENERATE],
  "LAB-58/mecanismos-das-81.json": [MOTOR, GENERATE],
  "LAB-59/contrafactual-de-antonina.json": [MOTOR, GENERATE],
  "LAB-78/setimo-mecanismo.json": [GENERATE],
};

/** Um defeito da conta, sempre com o nome da prova. */
export interface Problema {
  tipo:
    | "prova-sem-linha"
    | "linha-sem-prova"
    | "ferramenta-que-nao-existe"
    | "ferramenta-que-nao-nomeia-a-pasta"
    | "null-sem-motivo"
    | "cala-e-nao-esta-na-lista"
    | "esta-na-lista-e-nao-cala-mais"
    | "achado-de-quem-nao-cala"
    | "achado-sem-modulo"
    | "achado-que-nao-nomeia-a-prova";
  prova: string;
  oQue: string;
}

/** A lista à mão contra o disco e contra as ferramentas: os dois sentidos. */
export function conferirAListaDeQuemGrava(
  lista: readonly QuemGrava[],
  provasNoDisco: readonly string[],
  ferramentaExiste: (f: string) => boolean,
  textoDaFerramenta: (f: string) => string,
): Problema[] {
  const out: Problema[] = [];
  const naLista = new Set(lista.map((l) => l.prova));
  const noDisco = new Set(provasNoDisco);
  for (const p of provasNoDisco) {
    if (!naLista.has(p)) {
      out.push({ tipo: "prova-sem-linha", prova: p, oQue: `\`docs/provas/${p}\` não tem linha em QUEM_GRAVA: diga a ferramenta que a grava, ou \`null\` e o motivo` });
    }
  }
  for (const l of lista) {
    if (!noDisco.has(l.prova)) {
      out.push({ tipo: "linha-sem-prova", prova: l.prova, oQue: `QUEM_GRAVA tem \`${l.prova}\`, e ela não está em \`docs/provas/\`` });
      continue;
    }
    if (l.ferramenta === null) {
      if (!l.porque || l.porque.trim().length < 20) {
        out.push({ tipo: "null-sem-motivo", prova: l.prova, oQue: `\`${l.prova}\` diz que nenhuma ferramenta a grava e não diz por quê` });
      }
      continue;
    }
    if (!ferramentaExiste(l.ferramenta)) {
      out.push({ tipo: "ferramenta-que-nao-existe", prova: l.prova, oQue: `a ferramenta \`${l.ferramenta}\` de \`${l.prova}\` não existe` });
      continue;
    }
    const pasta = l.prova.split("/")[0]!;
    if (!textoDaFerramenta(l.ferramenta).includes(pasta)) {
      out.push({ tipo: "ferramenta-que-nao-nomeia-a-pasta", prova: l.prova, oQue: `\`${l.ferramenta}\` não nomeia a pasta \`${pasta}\`: não é ela quem grava \`${l.prova}\`` });
    }
  }
  return out;
}

/** A conta contra o retrato congelado: os dois sentidos. */
export function conferirOsCalados(
  conta: readonly ProvaQueRodaVizinho[],
  retrato: Readonly<Record<string, readonly string[]>>,
): Problema[] {
  const out: Problema[] = [];
  const calamHoje = new Map(conta.filter((c) => c.cala.length > 0).map((c) => [c.prova, c]));
  for (const [prova, c] of calamHoje) {
    const congelado = retrato[prova];
    const novos = c.cala.filter((v) => !(congelado ?? []).includes(v));
    if (novos.length > 0) {
      out.push({
        tipo: "cala-e-nao-esta-na-lista",
        prova,
        oQue:
          `\`${prova}\` roda código de ${novos.join(" e ")} (por \`${c.ferramenta}\`) e não escreve o commit dele. ` +
          "Prova que afirma o presente de um vizinho regera-se declarando o commit, e nunca sem ele (LAB-79): escreva o commit na prova ao gravá-la",
      });
    }
  }
  for (const [prova, vizinhos] of Object.entries(retrato)) {
    const c = calamHoje.get(prova);
    const jaNaoCala = vizinhos.filter((v) => !(c?.cala ?? []).includes(v));
    if (jaNaoCala.length > 0) {
      out.push({
        tipo: "esta-na-lista-e-nao-cala-mais",
        prova,
        oQue:
          `\`${prova}\` está no retrato calando ${jaNaoCala.join(" e ")}, e hoje não cala mais (escreve o commit, ou a ferramenta deixou de rodá-lo): ` +
          "tire-a de OS_CALADOS_DE_HOJE — o conserto se registra saindo da lista",
      });
    }
  }
  return out;
}

/**
 * **Os commits achados AO LADO da prova** (LAB-197, LAB-199): por prova do retrato, por vizinho calado, o
 * módulo (relativo à esteira) que escreve o commit — ou a janela — achado rodando a ferramenta de então.
 */
export const OS_ACHADOS_AO_LADO: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "LAB-07/diagnostico-relevo.json": { [GENERATE]: "src/retrato-do-lab07-relevo.ts" },
  "LAB-07/diagnostico-relevo.txt": { [GENERATE]: "src/retrato-do-lab07-relevo.ts" },
  "LAB-07/ensaio-47ha.saida.json": { [MOTOR]: "src/retrato-do-lab07-medir.ts", [GENERATE]: "src/retrato-do-lab07-medir.ts" },
  "LAB-07/geo-antonina.saida.json": { [MOTOR]: "src/retrato-do-lab07-medir.ts", [GENERATE]: "src/retrato-do-lab07-medir.ts" },
  "LAB-07/lab01-50ha-ondulado.saida.json": { [MOTOR]: "src/retrato-do-lab07-medir.ts", [GENERATE]: "src/retrato-do-lab07-medir.ts" },
  "LAB-07/medicoes.json": { [MOTOR]: "src/retrato-do-lab07-medir.ts", [GENERATE]: "src/retrato-do-lab07-medir.ts" },
  "LAB-07/medir.txt": { [MOTOR]: "src/retrato-do-lab07-medir.ts", [GENERATE]: "src/retrato-do-lab07-medir.ts" },
  "LAB-18/contrato-v2.json": { [MOTOR]: "src/retrato-do-lab18.ts" },
  "LAB-30/guarda-da-ida.json": { [MOTOR]: "src/retrato-do-lab30.ts", [GENERATE]: "src/retrato-do-lab30.ts" },
  "LAB-37/testada-de-frente.json": { [MOTOR]: "src/retrato-do-lab37.ts", [GENERATE]: "src/retrato-do-lab37.ts" },
  "LAB-40/fixtures.json": { [MOTOR]: "src/retrato-do-lab40.ts", [GENERATE]: "src/retrato-do-lab40.ts" },
  "LAB-41/ortogonal-fora-da-gleba.json": { [GENERATE]: "src/retrato-do-lab41.ts" },
  "LAB-46/antonina-tres-amostragens.json": { [MOTOR]: "src/retrato-do-lab46.ts", [GENERATE]: "src/retrato-do-lab46.ts" },
  "LAB-50/passagem-externa.json": { [MOTOR]: "src/retrato-do-lab50.ts", [GENERATE]: "src/retrato-do-lab50.ts" },
  "LAB-53/violacoes-depois-do-conserto-da-ponte.json": { [MOTOR]: "src/retrato-do-lab53.ts", [GENERATE]: "src/retrato-do-lab53.ts" },
  "LAB-54/frente-nao-atribuida.json": { [MOTOR]: "src/retrato-do-lab54.ts", [GENERATE]: "src/retrato-do-lab54.ts" },
  "LAB-55/via-sobre-a-faixa.json": { [MOTOR]: "src/retrato-do-lab55.ts", [GENERATE]: "src/retrato-do-lab55.ts" },
  "LAB-58/mecanismos-das-81.json": { [MOTOR]: "src/retrato-do-lab58.ts", [GENERATE]: "src/retrato-do-lab58.ts" },
  "LAB-78/setimo-mecanismo.json": { [GENERATE]: "src/retrato-do-lab78.ts" },
  "LAB-48/violacoes-do-motor-padrao.json": { [MOTOR]: "src/fotografia-do-lab48.ts", [GENERATE]: "src/fotografia-do-lab48.ts" },
};

/** Cada achado ao lado é de uma prova do retrato, calando aquele vizinho, num módulo que existe e nomeia a prova. */
export function conferirOsAchadosAoLado(
  achados: Readonly<Record<string, Readonly<Record<string, string>>>>,
  retrato: Readonly<Record<string, readonly string[]>>,
  textoDoModulo: (modulo: string) => string | null,
): Problema[] {
  const out: Problema[] = [];
  for (const [prova, porVizinho] of Object.entries(achados)) {
    for (const [vizinho, modulo] of Object.entries(porVizinho)) {
      if (!(retrato[prova] ?? []).includes(vizinho)) {
        out.push({ tipo: "achado-de-quem-nao-cala", prova, oQue: `\`${prova}\` tem achado ao lado para ${vizinho}, e o retrato não a dá calando ${vizinho}` });
        continue;
      }
      const texto = textoDoModulo(modulo);
      if (texto === null) out.push({ tipo: "achado-sem-modulo", prova, oQue: `o módulo \`${modulo}\` do achado de \`${prova}\` não existe` });
      else if (!texto.includes(prova.split("/")[0]!)) {
        out.push({ tipo: "achado-que-nao-nomeia-a-prova", prova, oQue: `\`${modulo}\` não nomeia \`${prova}\`: não é ali que o commit dela está escrito` });
      }
    }
  }
  return out;
}

/** A frase que a trava publica: o universo e as partes, que fecham. */
export function comoSeDiz(
  totalNoDisco: number,
  semFerramenta: number,
  conta: readonly ProvaQueRodaVizinho[],
  achados: Readonly<Record<string, Readonly<Record<string, string>>>> = {},
): string {
  const calam = conta.filter((c) => c.cala.length > 0).length;
  const porVizinho: Record<string, number> = {};
  for (const c of conta) for (const v of c.cala) porVizinho[v] = (porVizinho[v] ?? 0) + 1;
  const vizinhos = Object.entries(porVizinho)
    .sort()
    .map(([v, n]) => `${n} calam ${v}`)
    .join(" · ");
  return (
    `${totalNoDisco} provas · ${semFerramenta} sem ferramenta · ${totalNoDisco - semFerramenta - conta.length} gravadas por ferramenta que não roda vizinho · ` +
    `${conta.length} rodam vizinho: ${conta.length - calam} escrevem o commit de todos, ${calam} calam ao menos um (${vizinhos})` +
    (Object.keys(achados).length === 0
      ? ""
      : ` · achados ao lado: ${Object.values(achados).reduce((n, v) => n + Object.keys(v).length, 0)} de ${conta.reduce((n, c) => n + c.cala.length, 0)} silêncios`)
  );
}
