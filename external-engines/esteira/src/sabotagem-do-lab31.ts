/**
 * **LAB-215 (item 900) · a sabotagem do LAB-31 refeita — o motivo de não regerá-la, perguntado à ferramenta** (D443).
 *
 * # O que estava escrito
 *
 * A lista das espécies de prova (`src/regerar-a-varredura.ts`, item 024) põe `LAB-31/sabotagem.json` entre as
 * **fotografias**, com o motivo:
 *
 * > *"registra um ATO ('quebrei esta trava e o exit foi 0 → 1'): regerar seria REFAZER a sabotagem, que é outro ato
 * > (D289)"*
 *
 * É a última das quatro fotografias que rodam aqui sem o `.wasm` (o LAB-196 perguntou a do LAB-60, o LAB-197 a do
 * LAB-48; a do LAB-02 roda o Symbios). O LAB-195 deixou escrito que os outros motivos com a forma *"regerar faria X"*
 * seriam perguntados um a um, e o LAB-196 nomeou esta: *"retirá-lo é refazer a sabotagem"*. Ninguém a tinha refeito
 * desde 04/10/2026, e a única trava sobre ela (`tests/verde.test.ts`) confere a FORMA do JSON — três sabotagens,
 * `exit` 0 e 1 —, nunca o ato. Uma prova que só registra aparência.
 *
 * # O que a ferramenta respondeu (20/10/2026, em clones locais numa pasta temporária)
 *
 * Refeitas as duas sabotagens de pacote, com o texto que a prova escreve, em dois pares:
 *
 * | o Lab em | motor · Generate | o que a sabotagem derruba |
 * |---|---|---|
 * | `c8f5c22` (o commit da prova) | a ponta da origem antes da hora dele (`6f69ebc` · `1f13bff`) | `esteira · test` (1 teste novo), `esteira · lint`, `testfit · test` (1 teste novo) |
 * | a ponta de hoje | os clones do verde | **o mesmo** — os mesmos dois testes, pelo nome, e o lint |
 *
 * Os três passos que a prova diz que falharam (fora o do navegador) são os três que a sabotagem derruba, nos dois
 * pares. O motivo **se sustenta pela metade**: refazer é outro ato, sim — mas o ato refeito dá a mesma resposta, e
 * por isso ele se confere sem tocar na prova (o D182 fica de pé: o que se sabota é rascunho numa pasta temporária).
 *
 * # O que este módulo faz
 *
 * É a parte pura: {@link AS_TROCAS} (as duas sabotagens, conferidas contra o texto da prova por
 * {@link aTrocaDaProva}), {@link sabotar} (troca uma ocorrência e só uma, ou devolve `null`), {@link falhasDoBun}
 * (os nomes dos testes reprovados, lidos da saída) e {@link oQueMordeu} (antes contra depois). Quem cria a pasta,
 * clona e roda é a trava, `tests/sabotagem-do-lab31.test.ts`, no verde completo.
 *
 * # O que ela NÃO alcança, dito
 *
 * - **a terceira sabotagem**, a da prova no navegador (`prova.js`, `quadras: r.quadras.length → 999999`): carrega o
 *   `.wasm` do Symbios, ausente nesta máquina — o `rustup target add wasm32-unknown-unknown` cai antes de baixar
 *   (*"unsuccessful tunnel"*), como nas rodadas anteriores. Não perguntada;
 * - **o código de saída do comando único**: sem o `.wasm`, `./external-engines/conferir.sh` já sai 1 ANTES da
 *   sabotagem, e por isso o `exit 0 → 1` da prova não se refaz aqui. O que se refaz é o passo a passo — cada teste
 *   que a sabotagem derruba estava de pé antes dela (o passo `esteira · test` inteiro já está caído pelas nove do
 *   `.wasm`; o teste que a sabotagem derruba não é nenhuma delas);
 * - **o lint do pacote inteiro**: a trava passa o `eslint` só no arquivo sabotado, antes e depois. Os outros arquivos
 *   não mudam, então o veredicto do passo muda se e só se o do arquivo muda — mas é o arquivo que se mede;
 * - **os outros pares de commits**: só o da hora da prova e o de hoje. Que o ato dê o mesmo no meio não está medido.
 */

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-31/sabotagem.json";

/** Uma sabotagem de pacote: onde, o texto que sai, o que entra, e os passos do comando único que ela tem de derrubar. */
export interface Troca {
  onde: string;
  /** O pacote, relativo a `external-engines/`. */
  pacote: "esteira" | "testfit";
  de: string;
  para: string;
  /** Os passos do `conferir.sh`, pelo nome que a prova escreve em `passosQueFalharam`. */
  passos: readonly string[];
}

/** As duas sabotagens de pacote do LAB-31, com o texto inteiro. A terceira (navegador) carrega o `.wasm` e fica fora. */
export const AS_TROCAS: readonly Troca[] = [
  {
    onde: "external-engines/esteira/tests/identidade.test.ts",
    pacote: "esteira",
    de: "expect(saida.motor.nome).toBe(MOTOR_NOME)",
    para: 'expect(saida.motor.nome).toBe("SABOTAGEM-LAB-31")',
    passos: ["esteira · test", "esteira · lint"],
  },
  {
    onde: "external-engines/testfit/tests/esteira.test.ts",
    pacote: "testfit",
    de: 'expect(saida.archilly.versao).toBe("2")',
    para: 'expect(saida.archilly.versao).toBe("SABOTAGEM-LAB-31")',
    passos: ["testfit · test"],
  },
] as const;

/** A sabotagem que fica fora, e por quê — dita, não esquecida. */
export const A_QUE_FICA_FORA = {
  onde: "external-engines/symbios/adapter/ferramentas/navegador/prova.js",
  passo: "prova no navegador (Chromium)",
  porque: "carrega o `.wasm` do Symbios, artefato de build ausente nesta máquina",
} as const;

/**
 * A troca bate com o que a prova escreve? O `oQue` da prova tem a forma `"<antes> → <o que entra>"`: o `antes` tem
 * de ser o `de` inteiro, e o `para` tem de terminar no que entra. Devolve o motivo do desacordo, ou `null`.
 */
export function aTrocaDaProva(prova: { sabotagens: readonly { onde: string; oQue: string }[] }, troca: Troca): string | null {
  const s = prova.sabotagens.find((x) => x.onde === troca.onde);
  if (!s) return `a prova não sabota ${troca.onde}`;
  const partes = s.oQue.split(" → ");
  if (partes.length !== 2) return `o oQue de ${troca.onde} não tem a forma "antes → depois"`;
  const [antes, depois] = partes as [string, string];
  if (antes !== troca.de) return `${troca.onde}: a prova tira "${antes}", a troca tira "${troca.de}"`;
  if (!troca.para.endsWith(depois)) return `${troca.onde}: a prova põe "${depois}", a troca põe "${troca.para}"`;
  return null;
}

/** Troca a ÚNICA ocorrência de `de` por `para`. Nenhuma ou mais de uma → `null`: sabotar o lugar errado não é sabotar. */
export function sabotar(texto: string, troca: Pick<Troca, "de" | "para">): string | null {
  const i = texto.indexOf(troca.de);
  if (i === -1 || texto.indexOf(troca.de, i + 1) !== -1) return null;
  return texto.slice(0, i) + troca.para + texto.slice(i + troca.de.length);
}

/** Os nomes dos testes reprovados numa saída do `bun test` — as linhas `(fail) <nome> [<tempo>]`, sem o tempo. */
export function falhasDoBun(saida: string): string[] {
  return saida
    .split("\n")
    .filter((l) => l.startsWith("(fail) "))
    .map((l) => l.slice("(fail) ".length).replace(/\s*\[[^\]]*\]\s*$/, ""))
    .sort();
}

/** Uma medição de um pacote: os testes reprovados e o código de saída do `eslint` no arquivo sabotado. */
export interface Medicao {
  falhas: readonly string[];
  lint: number;
}

/** O que a sabotagem mudou: os testes que ela derrubou, os que ela curou (tem de ser nenhum), e o lint antes e depois. */
export interface Mordida {
  derrubados: string[];
  curados: string[];
  lintAntes: number;
  lintDepois: number;
  /** Os passos do comando único que passaram de pé a caídos. */
  passosDerrubados: string[];
}

export function oQueMordeu(pacote: Troca["pacote"], antes: Medicao, depois: Medicao): Mordida {
  const a = new Set(antes.falhas);
  const d = new Set(depois.falhas);
  const derrubados = [...d].filter((f) => !a.has(f)).sort();
  const curados = [...a].filter((f) => !d.has(f)).sort();
  const passosDerrubados: string[] = [];
  if (derrubados.length > 0) passosDerrubados.push(`${pacote} · test`);
  if (antes.lint === 0 && depois.lint !== 0) passosDerrubados.push(`${pacote} · lint`);
  return { derrubados, curados, lintAntes: antes.lint, lintDepois: depois.lint, passosDerrubados };
}
