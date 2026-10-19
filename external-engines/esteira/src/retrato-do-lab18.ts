/**
 * **LAB-199 (item 900) · a prova do LAB-18 roda o motor do vizinho e não escreve o commit dele — achado por
 * medição, e é uma JANELA, não um commit** (D427).
 *
 * # O que estava escrito, e o que faltava
 *
 * A prova `docs/provas/LAB-18/contrato-v2.json` escreve o Generate (`generateEm`, `5b7e9b4`) e **cala o
 * motor** — o Laboratório de Parcelamento, que roda ali como o motor `parcelamento` e dá as rampas por via.
 * O LAB-198 contou: é uma das duas provas *"pela metade"* do retrato `OS_CALADOS_DE_HOJE`. O relatório do
 * LAB-18 nomeia o Generate e não o motor; o do LAB-22 (o commit `bf15af6`, que regravou a prova depois de a
 * ponte passar a carregar a rampa) não nomeia nenhum dos dois.
 *
 * # A janela, achada rodando a ferramenta — e a data, de novo, erra
 *
 * Rodada em 19/10/2026, em clones locais numa pasta de rascunho (os vizinhos não foram tocados): o Lab em
 * `bf15af6` (o último commit da prova), o Generate em `5b7e9b4` (o que a prova declara), e o motor em cada
 * commit da história de primeiro pai da `main` dele, de 13/09 a 03/10. **A ferramenta precisa do `.wasm` do
 * Symbios, que esta máquina não constrói** (falta o alvo do `rustup`); então roda-se `lab18.ts` **sem o
 * motor Symbios** — quatro trocas de texto exatas, feitas na cópia temporária — e compara-se a prova inteira
 * **fora as linhas `symbios`** de `rampaPorVia`:
 *
 * | o motor em | o que muda contra a prova |
 * |---|---|
 * | `c3644d1` (03/10, a ponta da origem antes do commit da prova) | **14** valores — `completo` com 36 vias onde a prova diz 26 |
 * | `6dcb241` … `ee7c438` (02/10 a 15/09) | **14** valores |
 * | `2160fce` (15/09, 20h41 — o T07 dele) | **9** valores — a primeira gleba já bate, a segunda não |
 * | **`244aae3`, `5da35ea`, `4b25add`, `4181e95`, `fe0c7a1`** (14/09) | **zero** — a prova, valor a valor |
 * | `648ae78` (14/09, 13h05) | **4** valores — a rampa de `completo` 5,31 % onde a prova diz 4,94 % |
 * | `66ece91` (14/09, 12h07) | **25** valores — o motor ainda não media rampa |
 *
 * - **A ponta da origem no instante da prova está errada**, como no LAB-197: o clone daquela máquina era
 *   **velho de três semanas**.
 * - **Cinco commits refazem a prova**, e a ferramenta não os distingue: o que se escreve é a **janela**, com
 *   as duas bordas medidas por fora (`648ae78` antes, `2160fce` depois). O mais provável dentro dela é
 *   `4181e95` — o clone que o LAB-53 conferiu no disco **três dias depois**, sem `fetch` no meio (o mesmo
 *   que a fotografia do LAB-48 confirmou) —, mas isso é coerência, não medição, e fica dito assim.
 * - **O Generate da prova se confirma** de passagem: com ele em `5b7e9b4`, as linhas do Generate e os campos
 *   do contrato batem nas cinco rodadas da janela.
 *
 * # O que este módulo faz
 *
 * {@link O_RETRATO_DO_LAB18} escreve as três árvores, com a janela do motor; a trava
 * (`tests/retrato-do-lab18.test.ts`) monta as três numa pasta temporária, por caminho, e roda a ferramenta do
 * Lab de então **quatro** vezes: nas duas pontas da janela (tem de dar zero) e nas duas bordas de fora (tem de
 * dar diferença) — a janela é a afirmação, e ela se prova pelos dois lados. **A prova não se toca** (D182).
 *
 * # O que ela NÃO alcança, dito
 *
 * - **as linhas do Symbios**: sem o `.wasm`, ficam fora da comparação — e o Symbios mora nesta casa
 *   (`upstream/` é cópia), então não é commit de vizinho;
 * - **os três commits do meio da janela** (`5da35ea`, `4b25add`, `4181e95`): a trava roda as duas pontas
 *   (`244aae3` e `fe0c7a1`), não o meio — a medição do meio está aqui e no D427;
 * - **qual dos cinco era o do disco**: nenhuma régua acha, e a prova não pode ser regravada para dizê-lo;
 * - **a versão do LAB-18 (`f6934da`)**: a ponte de então não carregava a rampa, então o motor só aparecia na
 *   contagem de vias — a prova de hoje é a do `bf15af6`.
 */
import type { CommitDoRetrato } from "./fotografia-do-lab48.ts";

/** A prova, relativa a `docs/provas/`. */
export const A_PROVA = "LAB-18/contrato-v2.json";

/** A ferramenta, relativa à raiz do repositório. */
export const A_FERRAMENTA = "external-engines/esteira/ferramentas/lab18.ts";

/** O Lab e o Generate: um commit cada, com de onde se sabe. */
export const O_RETRATO_DO_LAB18: readonly CommitDoRetrato[] = [
  {
    pasta: "archilly-lab",
    commit: "bf15af6e77270c4f814e16e7ecc4365d8e1ca70a",
    deOndeSeSabe: "o último commit da prova (`git log`: f6934da no LAB-18, bf15af6 no LAB-22, que a regravou com a rampa)",
  },
  {
    pasta: "urban-create-hub-41d93a4d",
    commit: "5b7e9b4bac07fa6d1f12a0d1f85864eea274a098",
    deOndeSeSabe: "escrito na própria prova (`generateEm`), e a ferramenta do bf15af6 refaz as linhas do Generate nele",
  },
];

/**
 * **A janela do motor**: os commits da história de primeiro pai da `main` do Laboratório de Parcelamento em
 * que a ferramenta do `bf15af6` refaz a prova (fora o Symbios), do mais novo ao mais velho, e as duas bordas
 * de fora, onde ela já não refaz.
 */
export const A_JANELA_DO_MOTOR = {
  pasta: "motor-testfit",
  refazem: [
    "244aae34726532d8a2e6ea382c77419c52232879",
    "5da35eaa838fa0efdffca352c539b35709549511",
    "4b25add3c8d134a2d8c67a67491a38c9190c1d42",
    "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
    "fe0c7a15dd23e361e10f7aa70e16a84f051afbd1",
  ],
  depois: "2160fcea3dc8165408ac207c1388a49904c06185",
  antes: "648ae78c711d010a94e0fc236382def6afed9b59",
  oMaisProvavel: "4181e95af4256b4c477a5ddcb19ee2aea7aaeaae",
  porQueOMaisProvavel:
    "é o clone que o LAB-53 conferiu no disco três dias depois, sem fetch no meio — coerência, não medição",
} as const;

/**
 * As trocas que tiram o Symbios da ferramenta, na cópia temporária: cada `de` tem de aparecer **uma vez** no
 * texto da ferramenta do `bf15af6`, senão a cópia não é a ferramenta de então menos o Symbios.
 */
export const SEM_O_SYMBIOS: readonly { de: string; para: string }[] = [
  { de: 'import { Motor } from "@symbios/index.ts";\n', para: "" },
  { de: "const wasm = await Motor.carregar(readFileSync(WASM));\n", para: "" },
  { de: "  motorDoSymbios(wasm),\n", para: "" },
  { de: "  motorDoSymbios,\n", para: "" },
];

/** Tira o Symbios do texto da ferramenta; lança se alguma troca não casar exatamente uma vez. */
export function semOSymbios(texto: string): string {
  let out = texto;
  for (const { de, para } of SEM_O_SYMBIOS) {
    const n = out.split(de).length - 1;
    if (n !== 1) throw new Error(`a troca ${JSON.stringify(de)} casou ${n} vezes na ferramenta — esperava uma`);
    out = out.replace(de, para);
  }
  return out;
}

/** Um caminho em que a prova e uma rodada diferem (de `diferencasForaDoSymbios`). */
export interface Diferenca {
  onde: string;
  naProva: unknown;
  naRodada: unknown;
}

/** Compara a prova com uma rodada, valor a valor, tirando as linhas `symbios` de `rampaPorVia`. */
export function diferencasForaDoSymbios(prova: unknown, rodada: unknown): Diferenca[] {
  const limpar = (x: unknown): unknown => {
    const c = structuredClone(x) as { rampaPorVia?: { motores: Record<string, unknown> }[] };
    for (const g of c.rampaPorVia ?? []) delete g.motores["symbios"];
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
