/**
 * ════════════════════════════════════════════════════════════════════════════
 *  O VEREDITO "IDÊNTICO" GUARDA AS DUAS ASSINATURAS QUE COMPAROU.
 *  (LAB-108, item 900 — proposta 2 do LAB-103: os outros vereditos booleanos das provas, D335)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O LAB-103 (D330) achou 33 `"determinismo": true` sem as duas assinaturas e deixou a pergunta
 * para os outros vereditos booleanos das provas: **a evidência está ao lado, ou só o veredito?**
 * Medido por LUGAR — todo `.json` versionado em `docs/`, 100 arquivos, **2 262 campos booleanos
 * em 138 nomes** —, os quatro que a proposta nomeou deram respostas diferentes:
 *
 * | veredito | campos | a evidência ao lado | o veredito bate com ela |
 * |---|---|---|---|
 * | `limpo` (do Validator) | 151 | `violacoes` (número), `porTipo`, `exemplos` | **151 de 151** (`limpo` ⇔ `violacoes === 0`) |
 * | `limpo` (do clone vizinho) | 12 | `commit`, `origemMain` — a evidência de *limpo* é a lista vazia | não há o que conferir: os 12 são `true` |
 * | `aceito` | 171 | `violacoes` (92), `recusa` (13) ou `lotes` (66) | **171 de 171** |
 * | `confere` | 70 | `agregadoPublicado` e `agregadoRefeitoDosCrus` (ou `confronto*`) | **70 de 70** (recalculado) |
 * | **`desenhoIdentico`** | **40** | **nenhuma**: compara `vSem.assinatura === vCom.assinatura` e **não grava as duas** | os números ao lado (lotes, vias, aderência) são **necessários e não suficientes** |
 *
 * E a mesma forma em **um** nome que a proposta não nomeou: `saidaIdenticaSemAVia` (LAB-23,
 * **8** campos) compara `JSON.stringify` das duas saídas e grava só o `true`/`false`.
 *
 * **É a forma exata do D330, com outro nome de campo:** um veredito de igualdade entre duas
 * saídas, sem as duas saídas resumidas ao lado. Três de quatro vereditos nomeados guardam a
 * evidência e concordam com ela; **o veredito de IDENTIDADE é o que não guarda** — e é o único
 * cuja evidência não cabe num número: *"o mesmo número de lotes"* não é *"o mesmo desenho"*.
 *
 * # O que este módulo faz
 *
 * - `vereditoDeIdentidade` — a forma ÚNICA de gravar o veredito: as **duas assinaturas**
 *   (`assinaturaSem`, `assinaturaCom`) e o veredito, com o nome de campo que a prova já usa,
 *   **derivado** delas. As três ferramentas (`lab23`, `lab32`, `lab37`) passaram a chamá-la.
 * - `identidadesSemEvidencia` — a régua: campo cujo nome contém `identic` (booleano, texto ou
 *   número) num objeto sem duas assinaturas ao lado.
 * - `conferirAsIdentidades` — os dois sentidos contra a lista fechada `FOTOGRAFIAS_DE_IDENTIDADE`,
 *   com a contagem; e o universo publicado.
 *
 * # O que esta régua NÃO alcança, dito
 *
 * - veredito de igualdade com **outro nome** (`mesmoRotuloDeVariante`, `saoIguais`, `divergem`) —
 *   régua de palavra. Os três foram medidos nesta rodada e **têm** a evidência ao lado (os dois
 *   rótulos; os dois mínimos de testada; os dois commits), mas a régua não os cobra;
 * - **o que** foi comparado: duas assinaturas iguais de um objeto errado passam;
 * - ferramentas fora de `esteira/ferramentas/`.
 */
import { assinatura } from "./prova-de-determinismo.ts";

export { assinatura };

/**
 * O veredito de identidade com a evidência dentro. Recebe as duas assinaturas **já calculadas**
 * (a do motor, quando ele publica uma; `assinatura(saida)` desta casa, quando não) e devolve o
 * campo com o nome que a prova usa, **derivado** delas — não há parâmetro por onde um `true`
 * entre sozinho.
 */
export function vereditoDeIdentidade<C extends string>(
  campo: C,
  assinaturaSem: string,
  assinaturaCom: string,
): { [K in C]: boolean } & { assinaturaSem: string; assinaturaCom: string } {
  for (const a of [assinaturaSem, assinaturaCom]) {
    if (!ASSINATURA.test(a)) {
      throw new Error(`vereditoDeIdentidade: "${a}" não é uma assinatura (hexadecimal, 8 caracteres ou mais)`);
    }
  }
  return { [campo]: assinaturaSem === assinaturaCom, assinaturaSem, assinaturaCom } as {
    [K in C]: boolean;
  } & { assinaturaSem: string; assinaturaCom: string };
}

/** O nome de campo que a régua lê: `desenhoIdentico`, `saidaIdenticaSemAVia`, `identicas`… */
const CAMPO = /identic/i;
/** Uma assinatura: a mesma régua do D330 — hexadecimal, 8 caracteres ou mais. */
const ASSINATURA = /^[0-9a-f]{8,}$/i;

function assinaturasNoObjeto(o: Record<string, unknown>): number {
  return Object.values(o).filter((v) => typeof v === "string" && ASSINATURA.test(v)).length;
}

/**
 * Acha todo veredito de identidade **sem as duas assinaturas ao lado**. Devolve o caminho.
 *
 * **O caso válido que quase parece inválido:** `identicas` da prova de determinismo desta casa e
 * `saidaDoContratoIdentica` do LAB-07 são booleanos **com** as duas assinaturas no mesmo objeto —
 * passam.
 */
export function identidadesSemEvidencia(json: unknown): string[] {
  const achados: string[] = [];
  const andar = (x: unknown, caminho: string): void => {
    if (Array.isArray(x)) {
      x.forEach((v, i) => andar(v, `${caminho}[${i}]`));
      return;
    }
    if (x === null || typeof x !== "object") return;
    const o = x as Record<string, unknown>;
    const comEvidencia = assinaturasNoObjeto(o) >= 2;
    for (const [k, v] of Object.entries(o)) {
      const aqui = caminho ? `${caminho}.${k}` : k;
      const dito = typeof v === "boolean" || typeof v === "string" || typeof v === "number";
      if (CAMPO.test(k) && dito && !comEvidencia) achados.push(aqui);
      andar(v, aqui);
    }
  };
  andar(json, "");
  return achados;
}

/**
 * **As fotografias, fechadas e com a contagem** (a forma do D330). Cada linha declara quantos
 * vereditos sem evidência o arquivo tem: para mais, é veredito novo; para menos, a linha
 * envelheceu. As duas coisas reprovam.
 */
export const FOTOGRAFIAS_DE_IDENTIDADE: readonly { prova: string; vereditos: number; porque: string }[] = [
  {
    prova: "docs/provas/LAB-23/coluna-vertebral.json",
    vereditos: 8,
    porque:
      "a coluna vertebral do LAB-23 (quatro motores, duas glebas), com o .wasm e os clones daquele " +
      "dia; regerar é outra medição com o nome da antiga (D182, D288) — a ferramenta já grava as assinaturas na próxima",
  },
  {
    prova: "docs/provas/LAB-32/aderencia.json",
    vereditos: 20,
    porque: "a aderência à via desenhada do LAB-32, contra o Parcelamento daquele dia; idem",
  },
  {
    prova: "docs/provas/LAB-37/testada-de-frente.json",
    vereditos: 20,
    porque: "a testada de frente do LAB-37, contra o Parcelamento daquele dia; idem",
  },
];

export interface ConferenciaDasIdentidades {
  /** O universo, publicado: quantos JSON a régua leu. */
  lidos: number;
  /** Quantos campos de identidade ela achou, com ou sem evidência. */
  vereditosDeIdentidade: number;
  semEvidencia: string[];
  fotografiasQueEnvelheceram: string[];
}

function contarCampos(json: unknown): number {
  if (Array.isArray(json)) return json.reduce((s: number, v) => s + contarCampos(v), 0);
  if (json === null || typeof json !== "object") return 0;
  return Object.entries(json as Record<string, unknown>).reduce(
    (s: number, [k, v]) =>
      s + (CAMPO.test(k) && (typeof v === "boolean" || typeof v === "string" || typeof v === "number") ? 1 : 0) + contarCampos(v),
    0,
  );
}

/** Os dois sentidos contra a lista fechada, e o universo lido. */
export function conferirAsIdentidades(
  provas: readonly { arquivo: string; json: unknown }[],
  fotografias: typeof FOTOGRAFIAS_DE_IDENTIDADE = FOTOGRAFIAS_DE_IDENTIDADE,
): ConferenciaDasIdentidades {
  const semEvidencia: string[] = [];
  const contagem = new Map<string, number>();
  let campos = 0;
  for (const p of provas) {
    campos += contarCampos(p.json);
    const achados = identidadesSemEvidencia(p.json);
    contagem.set(p.arquivo, achados.length);
    if (achados.length === 0) continue;
    const foto = fotografias.find((f) => f.prova === p.arquivo);
    if (!foto || achados.length > foto.vereditos) {
      for (const a of achados) semEvidencia.push(`${p.arquivo} · ${a}`);
    }
  }
  const fotografiasQueEnvelheceram = fotografias
    .filter((f) => (contagem.get(f.prova) ?? 0) < f.vereditos)
    .map((f) => `${f.prova}: declarados ${f.vereditos}, achados ${contagem.get(f.prova) ?? "o arquivo não foi lido"}`);
  return { lidos: provas.length, vereditosDeIdentidade: campos, semEvidencia, fotografiasQueEnvelheceram };
}
