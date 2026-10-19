/**
 * **LAB-200 (item 900) · a prova do LAB-78 roda o Generate e não escreve o commit dele — achado por medição, e
 * é uma janela ABERTA: a ferramenta não distingue Generate nenhum de 02/10 até hoje** (D428).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-78/setimo-mecanismo.json` (regravada pela última vez no LAB-94, `cdc71da`) escreve
 * o motor — `6cf6396`, no texto de `naoAchados` — e **cala o Generate**, que roda ali três vezes: a ponte
 * (`montarParcelamentoExterno`), a divisa (`divisaDoAcesso`) e a faixa (`faixaViaPublica`). O LAB-198 contou:
 * é a outra prova *"pela metade"* do retrato `OS_CALADOS_DE_HOJE`; a do LAB-18 foi achada no LAB-199.
 *
 * # A janela, achada rodando a ferramenta
 *
 * Rodada em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `cdc71da`, o motor em `6cf6396` (o que a prova escreve) e o Generate em cada estado da história de primeiro
 * pai da `main` dele. A ferramenta não precisa do Symbios, então roda **inteira**. Compara-se a prova valor a
 * valor, **fora `quando` e `oChao`** (a hora e a versão do `bun` da rodada, que nenhum commit decide):
 *
 * | o Generate em | o que muda contra a prova |
 * |---|---|
 * | `8223873` (02/10, 13h52 UTC) e antes | **a ferramenta nem roda** — a ponte recusa todas as candidatas (o contrato v2 entra no commit seguinte) |
 * | **`5b70e5f` (02/10, 14h11 UTC, o contrato v2) … `704a57a` (19/10, a ponta de hoje)** | **zero** — a prova, valor a valor |
 *
 * - **Coberta inteira, e não por amostra.** O fecho dos `import` da ferramenta dentro do Generate (`bun build
 *   --metafile`, em cinco pontos da janela, unidos: 36 arquivos de `src/`) mudou em **17** dos 229 commits da
 *   janela; os 17 deram zero ({@link OS_ESTADOS_DO_FECHO}). Os outros 212 têm o fecho igual a um dos 17.
 * - **A ponta do instante está dentro**: o Generate da origem às 07h21 UTC de 12/10 (o `quando` da prova) era
 *   `24ef624` — zero. Aqui, ao contrário do LAB-197 e do LAB-199, a data não erra; mas ela não erra porque a
 *   ferramenta não distingue nada, não porque acerte.
 * - **A comparação tem dentes**: com o Generate dentro da janela e o motor em `4181e95` (o do LAB-59), **7**
 *   valores mudam (um lote acusado a mais).
 * - **De passagem, sem ser a pergunta**: o motor da ponta do instante (`b01eee6`, 12/10) também refaz a prova
 *   — o motor escrito (`6cf6396`) refaz, e é o que a prova afirma; não se mediu a janela dele.
 *
 * # O que se escreve: a janela, com UMA borda
 *
 * O que a prova cala é **"o Generate a partir do contrato v2"**: `5b70e5f` em diante, até onde se mediu. Não
 * há borda de depois — e escrever um commit dentro da janela seria afirmar uma proveniência que a ferramenta
 * não dá. O provável, pelo instante, é `24ef624`; **coerência, não medição**, e fica dito assim.
 *
 * # O que este módulo faz
 *
 * {@link O_RETRATO_DO_LAB78} escreve o Lab e o motor; {@link A_JANELA_DO_GENERATE}, a janela. A trava
 * (`tests/retrato-do-lab78.test.ts`) monta as três árvores numa pasta temporária, por caminho, e roda a
 * ferramenta de então: no começo da janela, no instante e no último medido (tem de dar zero), na borda de
 * antes (tem de NÃO refazer) e com o motor trocado (tem de acusar). **A prova não se toca** (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **os 14 estados do meio** ({@link OS_ESTADOS_DO_FECHO}): medidos aqui e no D428, não a cada verde;
 * - **o Generate depois de `704a57a`**: a janela é aberta até onde se mediu; um commit novo do vizinho não entra
 *   na trava (que roda commits fixos), e a janela não se estende sozinha;
 * - **qual commit era o do disco**: nenhuma régua acha, e a prova não pode ser regravada para dizê-lo;
 * - **o fecho dos `import`**: contado em cinco pontos e unido; um arquivo que só existiu entre eles e não
 *   entrou em nenhum dos quatro escaparia à contagem dos 17 — não à trava, que roda a ferramenta;
 * - **as versões antigas da prova** (LAB-78 em `4eaae24`, LAB-82 em `245ccc4`): a prova de hoje é a do `cdc71da`.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-78/setimo-mecanismo.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab78.ts";

/** Os campos da prova que a rodada decide e nenhum commit decide: ficam fora da comparação. */
export const FORA_DA_COMPARACAO = ["quando", "oChao"] as const;

/** O Lab e o motor: um commit cada, com de onde se sabe. */
export const O_RETRATO_DO_LAB78: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "cdc71da74edc3f49491a99883d88323679a1c160",
    deOndeSeSabe: "o último commit da prova (`git log`: 4eaae24 no LAB-78, 245ccc4 no LAB-82, cdc71da no LAB-94)",
  },
  {
    pasta: "motor-testfit",
    commit: "6cf6396dd0af759cffba4006442f1242c2d69888",
    deOndeSeSabe: "escrito na própria prova (`naoAchados`: \"esta rodada roda em `6cf6396`\"), e a ferramenta do cdc71da refaz a prova nele",
  },
];

/**
 * **A janela do Generate**: de `primeiro` (o contrato v2) até `ultimoMedido` (a ponta da origem em 19/10/2026),
 * a ferramenta do `cdc71da` refaz a prova; em `antes` ela nem roda. Não há borda de depois.
 */
export const A_JANELA_DO_GENERATE = {
  pasta: "urban-create-hub-41d93a4d",
  primeiro: "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
  ultimoMedido: "704a57ac4aead331f21ab7d2f4abeb712c694820",
  antes: "8223873a05794411521ac3f4b13e46758ccf6627",
  oQueDaAntes: "a ferramenta não roda: a ponte recusa todas as candidatas, antes do contrato v2",
  depois: null,
  oDoInstante: "24ef6249e9cf81def78579e6428089388ac875d2",
  porQueODoInstante:
    "a ponta da origem às 07h21 UTC de 12/10, o `quando` da prova — coerência, não medição: a ferramenta não o distingue dos outros",
} as const;

/**
 * Os 17 commits da janela em que o fecho dos `import` da ferramenta dentro do Generate mudou — do mais novo
 * ao mais velho, o último é o `primeiro` da janela. Os 17 refazem a prova (medido em 19/10/2026, D428).
 */
export const OS_ESTADOS_DO_FECHO: readonly string[] = [
  "18df3a8c0c888c2216786f9e58a0a26eaac1a622",
  "b84f8f4776260c75f2e888e19258715b462dbda3",
  "b1a2d59ff9cf9af1f80229a42247817e4687a6a7",
  "36f285a0399bb8ecce21630871361ae952be21e7",
  "45bf520541cb4a4dcbd254ed1f8a58d65b7b0cd9",
  "9d0e97c162d395f73fcc0e088c33ce52e39a1e77",
  "12959c75c5ca71d29f1d1b11ffdcda4c7d97e07d",
  "8b6e9d59c9e4c87a155745ec928afcb3f02790ed",
  "565d00c5a11371bf894de88b7a0407d5d32b2f30",
  "09cd4c0ef4c36cfb87822682716a8f57dbb75f00",
  "7330cc72ca940951979aecccbad162f573813fcf",
  "a06befa6192e0361bc7e395ea5f2697b44f2492f",
  "2c1fab3817fbd46e1b7158fb31b247f9dc206896",
  "641addb0d572a833d91583e40848f7c4cf05135b",
  "49d8e3e4d6d7c3f6e2daed6ef4fb5f67c5b54996",
  "b4c33cc9da51e2c4cf8fef5bdbc04410ffb33003",
  "5b70e5ff6ea1bfe9a7dbac62b48f9ee12df3ef3c",
];

/** O motor que dá os dentes da trava: o do LAB-59, que a prova diz que andou. */
export const O_MOTOR_DOS_DENTES = "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae";

/** Um caminho em que a prova e uma rodada diferem. */
export interface Diferenca {
  onde: string;
  naProva: unknown;
  naRodada: unknown;
}

/** Compara a prova com uma rodada, valor a valor, tirando só {@link FORA_DA_COMPARACAO} da raiz. */
export function diferencasForaDaRodada(prova: unknown, rodada: unknown): Diferenca[] {
  const limpar = (x: unknown): unknown => {
    const c = structuredClone(x) as Record<string, unknown>;
    for (const k of FORA_DA_COMPARACAO) delete c[k];
    return c;
  };
  const out: Diferenca[] = [];
  const andar = (onde: string, a: unknown, b: unknown) => {
    if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b)) {
      if (Array.isArray(a) && Array.isArray(b) && a.length !== b.length) {
        out.push({ onde, naProva: `${a.length} itens`, naRodada: `${b.length} itens` });
        return;
      }
      const ka = a as Record<string, unknown>;
      const kb = b as Record<string, unknown>;
      for (const k of [...new Set([...Object.keys(ka), ...Object.keys(kb)])].sort()) andar(`${onde}.${k}`, ka[k], kb[k]);
      return;
    }
    if (a !== b) out.push({ onde, naProva: a, naRodada: b });
  };
  andar("", limpar(prova), limpar(rodada));
  return out;
}
