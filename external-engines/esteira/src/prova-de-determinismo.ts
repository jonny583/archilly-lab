/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PROVA DE DETERMINISMO GUARDA AS DUAS ASSINATURAS, e não só o `true`.
 *  (LAB-103, item 900 — a dívida própria, espécie "prova que só registra aparência", D330)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/provas/LEIA-ME.md` promete: *"o determinismo é provado: a mesma entrada, duas vezes,
 * dá a mesma SAÍDA byte a byte"*. O `CLAUDE.md` §7 cobra *"determinismo provado"* em toda
 * medição. **Medido por LUGAR** — todo `.json` versionado em `docs/`, 100 arquivos —, a
 * promessa aparece em duas formas:
 *
 * | forma | onde | o que o arquivo deixa conferir |
 * |---|---|---|
 * | **a evidência** | `LAB-07/medicoes.json` (`assinaturaExecucao1`, `assinaturaExecucao2`, `assinaturaOutraSemente`) | as duas assinaturas: quem lê compara, e vê que a outra semente **muda** a saída |
 * | **só o veredito** | `LAB-04`, `LAB-05`, `LAB-08`, `LAB-13`, `LAB-40` e `LAB-46` — **33** campos `"determinismo": true` / `"determinista": true` | nada. O arquivo diz que passou, e não guarda o que se comparou |
 *
 * **Um `true` é a aparência da prova, não a prova.** E não é defeito teórico: *"foi assim que a
 * régua de determinismo errou no LAB-08"* (`src/motores/comum.ts`) — a primeira versão comparava
 * 20 variantes com 3, e o campo publicado tinha a
 * **mesma forma** com a régua certa e com a errada. *Zero perfeito é tão suspeito quanto número
 * absurdo* — e um `true` sozinho não deixa nem fazer a pergunta.
 *
 * # O que este módulo faz
 *
 * - `provaDeDeterminismo` — a forma ÚNICA de gravar a prova: o **que** se comparou, as **duas
 *   assinaturas** (SHA-256 do JSON, 16 caracteres, a mesma largura das do LAB-07) e o veredito
 *   **derivado** delas. As seis ferramentas que gravavam o `true` passaram a chamá-la.
 * - `vereditosSemEvidencia` — a régua: anda num JSON e acha todo campo `determinis*` booleano
 *   cujo objeto não traga **duas assinaturas** ao lado. Devolve o caminho.
 * - `conferirAsProvas` — os dois sentidos contra a lista fechada `FOTOGRAFIAS`: veredito sem
 *   evidência fora da lista reprova; **entrada da lista que não acha mais o que declarou
 *   reprova** (lista que não se revalida envelhece igual a comentário, D104). E publica o
 *   universo lido.
 *
 * # Por que as 33 de hoje NÃO foram regeradas
 *
 * São **fotografias** (D182, D299): a medição do motor daquele dia (14/09 a 05/10/2026), com o
 * clone daquele dia, e quatro das seis ferramentas carregam o Symbios, cujo `.wasm` não é
 * versionado. Regerar seria
 * outra medição com o nome da antiga (D288). Ficam como estão, **declaradas uma a uma com a
 * contagem**, e a próxima vez que alguém rodar a ferramenta a prova sai com as assinaturas.
 */
import { createHash } from "node:crypto";

/** A prova gravada: o que se comparou, as duas assinaturas e o veredito que sai delas. */
export interface ProvaDeDeterminismo {
  /** O objeto da comparação, em palavras — *"a saída inteira"*, *"as vias e o hash"*. */
  oQueSeComparou: string;
  assinaturaExecucao1: string;
  assinaturaExecucao2: string;
  /** **Derivado** das duas assinaturas, nunca informado à parte. */
  identicas: boolean;
}

/** SHA-256 do JSON, nos 16 primeiros caracteres — a largura das assinaturas do LAB-07. */
export function assinatura(valor: unknown): string {
  return createHash("sha256").update(JSON.stringify(valor)).digest("hex").slice(0, 16);
}

/**
 * A prova de determinismo, com a evidência dentro. O veredito **sai das assinaturas**: não há
 * parâmetro por onde um `true` entre sem as duas ao lado.
 */
export function provaDeDeterminismo(
  oQueSeComparou: string,
  execucao1: unknown,
  execucao2: unknown,
): ProvaDeDeterminismo {
  const assinaturaExecucao1 = assinatura(execucao1);
  const assinaturaExecucao2 = assinatura(execucao2);
  return {
    oQueSeComparou,
    assinaturaExecucao1,
    assinaturaExecucao2,
    identicas: assinaturaExecucao1 === assinaturaExecucao2,
  };
}

/** O nome de campo que a régua lê: `determinismo`, `deterministico`, `determinismoSymbios`… */
const CAMPO = /^determinis/i;
/** Uma assinatura: texto hexadecimal de 8 caracteres ou mais (as daqui têm 16; SHA-256, 64). */
const ASSINATURA = /^[0-9a-f]{8,}$/i;

/** Quantas assinaturas um objeto traz nos campos de primeiro nível. */
function assinaturasNoObjeto(o: Record<string, unknown>): number {
  return Object.values(o).filter((v) => typeof v === "string" && ASSINATURA.test(v)).length;
}

/**
 * Acha todo veredito de determinismo **sem a evidência ao lado**: campo `determinis*` com valor
 * booleano, texto ou número (*"ok"*, *"provado"* e um hash só são o mesmo `true` com outra
 * roupa), num objeto que não traz duas assinaturas; ou campo `determinis*` que é objeto sem
 * duas assinaturas dentro. Devolve o caminho de cada um, à moda `glebas[0].subdivisao.determinismo`.
 *
 * **O caso válido que quase parece inválido:** o `deterministico: true` do Symbios e o
 * `identicas` desta casa são booleanos **com** as duas assinaturas no mesmo objeto — passam.
 */
export function vereditosSemEvidencia(json: unknown): string[] {
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
      if (CAMPO.test(k)) {
        // Booleano, texto ou número: um veredito dito, que só vale com as duas assinaturas ao lado.
        const dito = typeof v === "boolean" || typeof v === "string" || typeof v === "number";
        if (dito && !comEvidencia) achados.push(aqui);
        if (v !== null && typeof v === "object" && !Array.isArray(v)) {
          if (assinaturasNoObjeto(v as Record<string, unknown>) < 2) achados.push(aqui);
        }
      }
      andar(v, aqui);
    }
  };
  andar(json, "");
  return achados;
}

/**
 * **As fotografias, fechadas e com a contagem.** Cada linha declara QUANTOS vereditos sem
 * evidência o arquivo tem — se o número mudar para mais, é veredito novo; para menos, a linha
 * envelheceu. As duas coisas reprovam.
 */
export const FOTOGRAFIAS: readonly { prova: string; vereditos: number; porque: string }[] = [
  {
    prova: "docs/provas/LAB-04/medicoes.json",
    vereditos: 2,
    porque:
      "a subdivisão do LAB-04 sobre o Symbios, medida em 15/09 com o motor e o .wasm daquele dia; " +
      "regerar é outra medição (D182, D288) — a ferramenta já grava as assinaturas na próxima",
  },
  {
    prova: "docs/provas/LAB-05/medicoes.json",
    vereditos: 5,
    porque: "o recorte do LAB-05 sobre o Symbios, fotografia de 15/09; idem",
  },
  {
    prova: "docs/provas/LAB-08/medicoes.json",
    vereditos: 4,
    porque:
      "os dois motores do LAB-08, 14/09 — e é a prova da régua que ERROU (20 variantes contra 3): o " +
      "true publicado tinha a mesma forma antes e depois do conserto, que é o defeito desta espécie",
  },
  {
    prova: "docs/provas/LAB-13/medicoes.json",
    vereditos: 20,
    porque: "os quatro motores do LAB-13 nas cinco glebas, 19/09, com os clones daquele dia; idem",
  },
  {
    prova: "docs/provas/LAB-40/fixtures.json",
    vereditos: 1,
    porque:
      "a testada de frente do Parcelamento nas fixtures, 04/10, contra o clone daquele dia; " +
      "regerar é medir o motor de hoje com o nome da medição de ontem (D288)",
  },
  {
    prova: "docs/provas/LAB-46/antonina-tres-amostragens.json",
    vereditos: 1,
    porque: "as três amostragens de Antonina, 05/10, contra o clone daquele dia; idem",
  },
];

export interface ProvaLida {
  arquivo: string;
  json: unknown;
}

export interface ConferenciaDasProvas {
  /** O universo, publicado: quantos JSON a régua leu. */
  lidos: number;
  /** Quantos deles falam de determinismo, com ou sem evidência. */
  falamDeDeterminismo: number;
  /** Veredito sem evidência fora das fotografias, ou acima da contagem declarada. */
  semEvidencia: string[];
  /** Fotografia cuja contagem não bate mais — a lista envelheceu. */
  fotografiasQueEnvelheceram: string[];
}

/** Algum campo `determinis*` em qualquer profundidade? */
function falaDeDeterminismo(json: unknown): boolean {
  if (Array.isArray(json)) return json.some(falaDeDeterminismo);
  if (json === null || typeof json !== "object") return false;
  return Object.entries(json as Record<string, unknown>).some(
    ([k, v]) => CAMPO.test(k) || falaDeDeterminismo(v),
  );
}

/** Os dois sentidos contra a lista fechada, e o universo lido. */
export function conferirAsProvas(
  provas: readonly ProvaLida[],
  fotografias: typeof FOTOGRAFIAS = FOTOGRAFIAS,
): ConferenciaDasProvas {
  const semEvidencia: string[] = [];
  const contagem = new Map<string, number>();
  let falam = 0;
  for (const p of provas) {
    if (falaDeDeterminismo(p.json)) falam++;
    const achados = vereditosSemEvidencia(p.json);
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
  return { lidos: provas.length, falamDeDeterminismo: falam, semEvidencia, fotografiasQueEnvelheceram };
}
