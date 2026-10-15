/**
 * ════════════════════════════════════════════════════════════════════════════
 *  "É O MESMO COMMIT" TEM UMA DEFINIÇÃO SÓ — e o commit CURTO não é o commit.
 *  (LAB-111, item 900 — proposta do LAB-110: os outros vereditos de igualdade, D338)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O D337 deu ao *"confere"* uma igualdade única e deixou proposta a mesma pergunta para os outros
 * vereditos de igualdade que o D335 mediu: **como** cada ferramenta compara. O LAB-111 os mediu por
 * LUGAR — todo `.ts` versionado de `external-engines/`, fora `upstream/` — e nas provas de `docs/`:
 *
 * | veredito | onde é gravado | o que compara | nas provas | a definição serve? |
 * |---|---|---|---|---|
 * | `saoIguais` | `ferramentas/lab48.ts` | dois **números** (`===`): o mínimo de testada declarado e o que chega ao Validator | 10, 10 de 10 coerentes | **sim**: a pergunta é *"chegou o mesmo número?"*; arredondar seria esconder a conversão |
 * | `mesmoRotuloDeVariante` | `ferramentas/lab40.ts` | dois **rótulos** (formato e posição, `===`) | 3, 3 de 3 | **sim**: o nome diz rótulo, e o comentário ao lado diz por que não é *"mesmo partido"* |
 * | `divergem` (do carimbo) | `src/commit-dos-vizinhos.ts` | dois **commits curtos** (`!==` de texto) | 15, 15 de 15 — todos sem segunda linha | **NÃO** |
 * | `divergem` (do LAB-25) | `ferramentas/lab25.ts` | é uma **contagem** de faces, não um veredito | 5 | outro objeto, com o mesmo nome |
 *
 * E o mesmo texto curto é comparado num quarto lugar, sem nome de veredito: `conferirCarimbo`
 * (`gravado === agora`) decide entre `igual` e `mudou` — *"o vizinho ANDOU"*.
 *
 * # Por que o commit curto não é o commit
 *
 * `git rev-parse --short` devolve a **menor abreviação que o clone garante única**, e o tamanho
 * dela depende de **quantos objetos o clone tem**, não do commit. Medido no LAB-111 com o git desta
 * máquina (2.43.0), num repositório montado por `fast-import`: com **16 383** objetos o curto tem
 * **7** caracteres; com **16 386**, **8** — o salto é em 2¹⁴. E o mesmo commit, num clone raso do
 * mesmo repositório (3 objetos), volta a ter **7**: `5ec11575` no cheio, `5ec1157` no raso.
 *
 * Então duas leituras do **mesmo** commit dão textos diferentes quando:
 *
 * - **o tempo passa**: a prova gravou `68312eb` com o Generate a 11 703 objetos; quando ele passar de
 *   16 384, o `HEAD` de hoje, relido, será `68312ebX` — e `conferirCarimbo` dirá *"o vizinho ANDOU"*
 *   de um vizinho parado, em **toda** prova carimbada antes do salto;
 * - **os dois clones têm tamanhos diferentes**: o módulo resolvido num clone cheio e o caminho por
 *   convenção num clone raso — esta casa acordou com clone raso de novo no LAB-111, como do LAB-105
 *   ao LAB-110 — dão `divergem: true` para a mesma árvore.
 *
 * É a forma do D337 com outro objeto: **a representação comparada no lugar da identidade**. Lá os
 * bytes no lugar do valor; aqui o texto curto no lugar do commit. E a casa já tinha a resposta certa
 * num terceiro lugar — `oCommitGravadoAindaEOMesmo` (`src/onde-esta-o-padrao.ts`) compara por
 * **prefixo** —, então eram **duas definições** de *"o mesmo commit"* no mesmo repositório.
 *
 * Por isso a igualdade mora aqui ({@link mesmoCommit}), e os três lugares a chamam.
 *
 * # O que esta régua NÃO olha, e vai dito
 *
 * - **colisão de prefixo**: dois commits **diferentes** cujas abreviações uma é prefixo da outra.
 *   O git só garante a unicidade dentro do clone que imprimiu; entre um clone raso e um cheio, a
 *   chance é a de dois commits coincidirem nos primeiros 28 bits — uma em 2²⁸, perto de uma em
 *   268 milhões por par lido. Não é zero, e está dito; o remédio, se um dia valer o custo, é gravar o commit inteiro (`rev-parse HEAD`);
 * - a comparação de commits numa linha que não diz o nome do commit — a régua
 *   ({@link comparacoesDeCommitPorTexto}) lê **nomes** (`commit`, `gravado`, `agora`…), e nome é
 *   ortografia (D137); o sujeito escrito é o que a impede de acusar toda igualdade de texto, e é o
 *   seu limite;
 * - o arquivo que lê o commit **sem** `--short`: o commit inteiro tem tamanho fixo e o texto é a
 *   identidade (é o caso do gancho de envio, `src/antes-do-envio.ts`, que compara 40 contra 40);
 * - o `false` do `divergem` quando **não há segunda linha**: ele vem ao lado de
 *   `pelaConvencao: null`, e por isso se lê; mudar para nulo mudaria a forma de quinze provas, e
 *   não é a pergunta desta rodada.
 */

import { semComentarios } from "./varredura-de-chamadas.ts";

/** Uma abreviação de commit que o git aceita por padrão: de 7 a 64 algarismos hexadecimais. */
const ABREVIACAO = /^[0-9a-f]{7,64}$/;

/**
 * **A** igualdade de *"é o mesmo commit"*: o mesmo texto, ou — sendo os dois abreviações de commit
 * (7 a 64 hexadecimais) — o mais curto é **prefixo** do mais longo. O tamanho do curto não é
 * informação sobre o commit: é informação sobre o clone que o imprimiu.
 */
export function mesmoCommit(a: string, b: string): boolean {
  const x = a.trim().toLowerCase();
  const y = b.trim().toLowerCase();
  if (x === y) return true;
  if (!ABREVIACAO.test(x) || !ABREVIACAO.test(y)) return false;
  return x.length < y.length ? y.startsWith(x) : x.startsWith(y);
}

/** O arquivo lê o commit CURTO: chama `rev-parse` com `--short`, no código e não no comentário. */
export function leOCommitCurto(texto: string): boolean {
  return /["']--short(?:=\d+)?["']/.test(semComentarios(texto));
}

/** Os nomes que, nesta casa, guardam um commit lido do git. */
const NOME_DE_COMMIT = /^(?:commit|gravado|agora|daConvencao|origemMain|head|cabeca|anterior|arvoreEm)$/i;

/** Dois operandos de `===`/`!==`, numa linha; cada um, um nome com acesso por ponto. */
const COMPARACAO =
  /([A-Za-z_$][\w$]*(?:\??\.[A-Za-z_$][\w$]*)*)\s*[!=]==\s*([A-Za-z_$][\w$]*(?:\??\.[A-Za-z_$][\w$]*)*)/g;

/** O último segmento de `a.b?.c` — `c`. */
const ultimo = (nome: string): string => nome.split(/\??\./).pop() ?? nome;

/**
 * As linhas (1-based) em que o CÓDIGO — sem comentário — compara **dois commits por texto**: os
 * dois lados de um `===`/`!==` têm nome de commit. O sujeito está escrito: um commit contra um
 * commit, e não toda igualdade da linha.
 */
export function comparacoesDeCommitPorTexto(texto: string): number[] {
  return semComentarios(texto)
    .split("\n")
    .flatMap((l, i) =>
      [...l.matchAll(COMPARACAO)].some((m) => NOME_DE_COMMIT.test(ultimo(m[1]!)) && NOME_DE_COMMIT.test(ultimo(m[2]!)))
        ? [i + 1]
        : [],
    );
}

/**
 * Onde a forma fica, de propósito. **Uma só: a trava desta régua**, que reproduz a forma velha para
 * demonstrar o lado ruim em vez de lembrá-lo. Conferida nos dois sentidos: exceção que não tem mais
 * a forma reprova.
 */
export const EXCECOES_DE_COMMIT_POR_TEXTO: readonly {
  arquivo: string;
  motivo: string;
}[] = [
  {
    arquivo: "external-engines/esteira/tests/mesmo-commit.test.ts",
    motivo: "a trava desta régua reproduz a forma velha para demonstrar o lado ruim, em vez de lembrá-lo",
  },
];

/**
 * Confere um universo `{ arquivo, texto }`: **só os arquivos que leem o commit curto** entram na
 * régua (o sujeito: é o curto que muda de tamanho), e o resultado diz quantos foram.
 */
export function conferirCommitPorTexto(arquivos: readonly { arquivo: string; texto: string }[]): {
  lidos: number;
  leemOCurto: string[];
  achados: { arquivo: string; linhas: number[] }[];
  excecoesVelhas: string[];
} {
  const excecoes = new Set(EXCECOES_DE_COMMIT_POR_TEXTO.map((e) => e.arquivo));
  const leemOCurto: string[] = [];
  const achados: { arquivo: string; linhas: number[] }[] = [];
  const comAForma = new Set<string>();
  for (const { arquivo, texto } of arquivos) {
    if (!leOCommitCurto(texto)) continue;
    leemOCurto.push(arquivo);
    const linhas = comparacoesDeCommitPorTexto(texto);
    if (linhas.length === 0) continue;
    comAForma.add(arquivo);
    if (!excecoes.has(arquivo)) achados.push({ arquivo, linhas });
  }
  return {
    lidos: arquivos.length,
    leemOCurto,
    achados,
    excecoesVelhas: [...excecoes].filter((e) => !comAForma.has(e)),
  };
}
