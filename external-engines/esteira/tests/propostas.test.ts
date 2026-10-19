/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-61 · As travas da minha própria lista de propostas.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * A seção *"Proposto ao chat — não executar"* da `FILA.md` é a minha lista de dívida, **e é
 * o que o chat lê para escrever fila** — quatro filas saíram dela. Medido no LAB-61: de 14
 * itens abertos, **cinco já estavam executados**, e **dois eram cópias de itens riscados na
 * mesma lista**.
 *
 * > **Lista que o chat usa para escrever fila é dívida minha**, e lista que ninguém
 * > revalida envelhece igual a comentário (D104, D136).
 *
 * A trava que importa é a primeira: **zero problemas na lista de hoje**. As outras
 * exercitam a régua com casos sintéticos, porque uma régua que só é exercida pelo documento
 * de hoje cala no dia em que o documento mudar de forma.
 */

import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  MOTIVOS_DE_SEGUIR_ABERTO,
  SOBREPOSICAO_MINIMA_DO_TITULO,
  citaAOrigem,
  conferirPropostas,
  lerPropostas,
  secoesDePropostaEmProsa,
  secoesRiscadasDeProposta,
  sobreposicaoDeTitulo,
  tituloDe,
} from "../src/varredura-das-propostas.ts";
import { oPromptDoItem } from "../src/a-proposta-no-recado.ts";
import { PROMPT_DO_LAB } from "../src/nome-do-prompt.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FILA = readFileSync(join(RAIZ, "docs", "prompts", "FILA.md"), "utf8");

/** O número do item da caixa → o prompt que o fechou, pela marca de FEITO — a mesma tradução do LAB-164 (LAB-194). */
const CAIXA = join(RAIZ, "docs", "caixa-de-entrada");
const ITENS = new Map<string, string>();
for (const f of readdirSync(CAIXA)) {
  const m = /^(\d{3,})-FEITO\.md$/.exec(f);
  if (m === null) continue;
  const p = oPromptDoItem(readFileSync(join(CAIXA, f), "utf8").split("\n")[0]!);
  if (p !== null) ITENS.set(m[1]!, p);
}
const PROVA = JSON.parse(
  readFileSync(join(RAIZ, "docs", "provas", "LAB-61", "a-minha-lista-de-propostas.json"), "utf8"),
) as {
  antes: { itens: number; problemas: number; porClasse: Record<string, number>; asSobreposicoesMedidas: { marca: string; sobreposicao: number | null }[] };
  agora: {
    itens: number;
    riscados: number;
    abertos: number;
    problemas: number;
    abertosPorMotivo: Record<string, number>;
    secoesDePropostaEmProsa: { linha: number; prompt: string }[];
  };
  aRegua: { oLimiarDoTitulo: number; oQueCobra: string[] };
  oQueFoiPAGO: string[];
};

describe("LAB-61 · a lista de HOJE não tem problema — é a trava que importa", () => {
  const itens = lerPropostas(FILA);
  const prosa = secoesDePropostaEmProsa(FILA, ITENS);
  const problemas = conferirPropostas(itens, prosa, secoesRiscadasDeProposta(FILA, ITENS));

  test("zero problemas, e o erro nomeia cada um", () => {
    expect(
      problemas.map((p) => `L${p.linha} [${p.classe}] ${p.oQue}`),
      "a lista que o chat lê voltou a apodrecer",
    ).toEqual([]);
  });

  test("a lista existe e tem item — régua parada sobre lista vazia daria zero igual", () => {
    expect(itens.length).toBeGreaterThan(10);
    expect(itens.filter((i) => i.riscado).length).toBeGreaterThan(0);
    expect(itens.filter((i) => !i.riscado).length).toBeGreaterThan(0);
  });

  test("todo item riscado diz QUAL prompt o executou", () => {
    for (const i of itens.filter((x) => x.riscado)) {
      expect(i.executadoPor, `L${i.linha}: riscado sem executor`).toMatch(new RegExp(`^${PROMPT_DO_LAB}$`));
    }
  });

  test("todo item aberto declara o motivo, e o motivo está no vocabulário", () => {
    const ids = new Set(MOTIVOS_DE_SEGUIR_ABERTO.map((m) => m.id));
    for (const i of itens.filter((x) => !x.riscado)) {
      expect(i.motivo, `L${i.linha}: aberto sem motivo`).not.toBeNull();
      expect(ids.has(i.motivo!), `L${i.linha}: motivo "${i.motivo}" fora do vocabulário`).toBe(true);
    }
  });

  test("toda seção de proposta em PROSA é citada por item da lista, NA ORIGEM", () => {
    for (const s of prosa) {
      expect(
        itens.some((i) => citaAOrigem(i.texto, s.prompt)),
        `a proposta do ${s.prompt} (L${s.linha}) vive só em prosa — o chat a acharia por sorte`,
      ).toBe(true);
    }
  });

  test("a citação é a de ORIGEM, não uma menção qualquer — a sabotagem PASSOU por isso", () => {
    // O caminho da prova MENCIONA o prompt e NÃO é citação de origem. Foi exatamente o que
    // deixou a terceira sabotagem deste prompt passar com exit 0 (D142 outra vez).
    expect(citaAOrigem("- **Uma coisa** (LAB-59). resto", "LAB-59")).toBe(true);
    expect(citaAOrigem("- **Uma coisa** (LAB-59, D204). resto", "LAB-59")).toBe(true);
    expect(citaAOrigem("- **Uma coisa** (do prompt anterior). ver `docs/provas/LAB-59/x.json`", "LAB-59")).toBe(false);
  });

  test("a prova bate com a lista de hoje — contado, não declarado", () => {
    expect(PROVA.agora.itens).toBe(itens.length);
    expect(PROVA.agora.riscados).toBe(itens.filter((i) => i.riscado).length);
    expect(PROVA.agora.abertos).toBe(itens.filter((i) => !i.riscado).length);
    expect(PROVA.agora.problemas).toBe(0);
    const porMotivo: Record<string, number> = {};
    for (const i of itens.filter((x) => !x.riscado)) porMotivo[String(i.motivo)] = (porMotivo[String(i.motivo)] ?? 0) + 1;
    expect(PROVA.agora.abertosPorMotivo).toEqual(porMotivo);
    // As seções de prosa também — pela ORIGEM, não pela linha, que anda a cada rodada (LAB-194).
    expect(PROVA.agora.secoesDePropostaEmProsa.map((x) => x.prompt)).toEqual(prosa.map((x) => x.prompt));
  });
});

describe("LAB-61 · a régua exercida por caso SINTÉTICO, não só pelo documento de hoje", () => {
  const SEC = "## Proposto ao chat — não executar";
  const monte = (...itens: string[]) => `${SEC}\n\n${itens.join("\n\n")}\n\n## outra coisa\n`;

  test("riscado sem executor REPROVA", () => {
    const p = conferirPropostas(lerPropostas(monte("- ~~**Uma coisa feita** (D99)~~ — pronto.")));
    expect(p.map((x) => x.classe)).toContain("riscado-sem-executor");
  });

  test("aberto sem motivo REPROVA", () => {
    const p = conferirPropostas(lerPropostas(monte("- **Uma coisa pendente** (D98). Falta medir.")));
    expect(p.map((x) => x.classe)).toContain("aberto-sem-motivo");
  });

  test("motivo fora do vocabulário REPROVA", () => {
    const p = conferirPropostas(
      lerPropostas(monte("- **Uma coisa pendente** (D98). **Segue aberto:** `porque-eu-quero`")),
    );
    expect(p.map((x) => x.classe)).toContain("motivo-fora-do-vocabulario");
  });

  test("aberto COM motivo do vocabulário passa", () => {
    const p = conferirPropostas(lerPropostas(monte("- **Uma coisa pendente** (D98). **Segue aberto:** `nao-medido`")));
    expect(p).toEqual([]);
  });

  test("a CÓPIA reprova — e precisa dos DOIS sinais", () => {
    // Mesma decisão E título sobreposto: é cópia.
    const copia = conferirPropostas(
      lerPropostas(
        monte(
          "- ~~**Por que a passagem externa põe lote longe da face** (D77)~~ — ✅ **executado no LAB-50**: pronto.",
          "- **Por que a passagem externa do motor põe lote longe da face** (D77). **Segue aberto:** `nao-medido`",
        ),
      ),
    );
    expect(copia.map((x) => x.classe)).toContain("copia-de-item-riscado");

    // Mesma decisão e título SEM sobreposição: NÃO é cópia — é o caso do `faceDeRua`.
    const naoEh = conferirPropostas(
      lerPropostas(
        monte(
          "- ~~**Por que a passagem externa põe lote longe da face** (D77)~~ — ✅ **executado no LAB-50**: pronto.",
          "- **O campo nulo nos trinta lotes daquela gleba** (D77). **Segue aberto:** `nao-medido`",
        ),
      ),
    );
    expect(naoEh.map((x) => x.classe)).not.toContain("copia-de-item-riscado");
  });

  test("título sem decisão compartilhada NÃO é cópia, mesmo igualzinho", () => {
    const p = conferirPropostas(
      lerPropostas(
        monte(
          "- ~~**A mesma frase exata do título** (D11)~~ — ✅ **executado no LAB-50**: pronto.",
          "- **A mesma frase exata do título** (D12). **Segue aberto:** `escopo-novo`",
        ),
      ),
    );
    expect(p.map((x) => x.classe)).not.toContain("copia-de-item-riscado");
  });

  test("a sobreposição mede PALAVRA, não ortografia — e os números deste prompt estão na prova", () => {
    expect(sobreposicaoDeTitulo("Por que a passagem externa põe lote longe", "Por que a passagem externa do motor põe lote longe")).toBe(1);
    expect(sobreposicaoDeTitulo("O campo nulo nos trinta lotes", "Por que a passagem externa põe lote longe")).toBeLessThan(SOBREPOSICAO_MINIMA_DO_TITULO);
    const medidas = PROVA.antes.asSobreposicoesMedidas;
    expect(medidas.filter((m) => m.sobreposicao === 1)).toHaveLength(2);
    expect(medidas.filter((m) => m.sobreposicao === 0)).toHaveLength(1);
  });

  test("o título é o primeiro NEGRITO, e o riscado não atrapalha", () => {
    expect(tituloDe("- ~~**O título** (D1)~~ — ✅")).toBe("O título");
    expect(tituloDe("- **O título** (D1). resto")).toBe("O título");
  });

  test("a seção acaba no próximo título — as outras seções de prosa não entram", () => {
    const itens = lerPropostas(`## Proposto ao chat — não executar\n\n- **Um** (D1). **Segue aberto:** \`nao-medido\`\n\n### Outra seção\n\n- **Dois** (D2).\n`);
    expect(itens).toHaveLength(1);
  });
});

describe("LAB-61 · o ANTES é lido do git, e a prova registra o que foi pago", () => {
  test("o antes tinha problema, e o agora não — senão este prompt não pagou nada", () => {
    expect(PROVA.antes.problemas).toBeGreaterThan(0);
    expect(PROVA.agora.problemas).toBe(0);
    expect(PROVA.antes.porClasse["copia-de-item-riscado"]).toBeGreaterThan(0);
  });

  test("a prova diz o que foi PAGO, item por item", () => {
    expect(PROVA.oQueFoiPAGO.length).toBeGreaterThanOrEqual(3);
    expect(PROVA.oQueFoiPAGO.join(" ")).toContain("LAB-53");
  });

  test("a régua declara o que cobra, e o limiar é o do módulo", () => {
    expect(PROVA.aRegua.oQueCobra.length).toBe(5);
    expect(PROVA.aRegua.oLimiarDoTitulo).toBe(SOBREPOSICAO_MINIMA_DO_TITULO);
  });
});

describe("LAB-194 · a origem pode ser um ITEM da caixa, e a seção de prosa riscada também fecha o assunto", () => {
  const SEC = "## Proposto ao chat — não executar";
  const comLista = (prosa: string, ...itens: string[]) => `${prosa}\n\n${SEC}\n\n${itens.join("\n\n")}\n\n## outra coisa\n`;
  const confere = (f: string, mapa: ReadonlyMap<string, string> = new Map()) =>
    conferirPropostas(lerPropostas(f), secoesDePropostaEmProsa(f, mapa), secoesRiscadasDeProposta(f, mapa));

  test("a FILA de ANTES (blob de fbde269) reprova com TRÊS — as duas seções saídas de item e o sétimo aberto", () => {
    const antes = execFileSync("git", ["-C", RAIZ, "show", "fbde269:docs/prompts/FILA.md"], { encoding: "utf8" });
    const p = confere(antes, ITENS).map((x) => x.classe).sort();
    expect(p).toEqual(["aberto-de-secao-riscada", "proposta-que-vive-so-em-prosa", "proposta-que-vive-so-em-prosa"]);
    // e a régua de ANTES do LAB-194 a aprovava — era isso o buraco
    const linhas = antes.split("\n");
    const soAsDeLab = secoesDePropostaEmProsa(antes).filter((s) => linhas[s.linha - 1]!.includes("saído do LAB-"));
    expect(soAsDeLab.map((s) => s.prompt)).toEqual(["LAB-78"]);
    expect(conferirPropostas(lerPropostas(antes), soAsDeLab)).toEqual([]);
  });

  test("seção saída de ITEM é vista: o prompt entre parênteses vence, senão a marca de FEITO traduz", () => {
    expect(secoesDePropostaEmProsa("### Proposto ao chat, saído do item 029 (LAB-96) — x")).toEqual([{ linha: 1, prompt: "LAB-96" }]);
    expect(secoesDePropostaEmProsa("### Proposto ao chat, saído do item 004 — x", new Map([["004", "LAB-71"]]))).toEqual([
      { linha: 1, prompt: "LAB-71" },
    ]);
    expect(secoesDePropostaEmProsa("### Proposto ao chat, saído do item 0040 — x", new Map([["004", "LAB-71"]]))).toEqual([
      { linha: 1, prompt: "item 0040" },
    ]);
  });

  test("seção saída de item, sem citação na lista, REPROVA; citada na origem, passa", () => {
    const prosa = "### Proposto ao chat, saído do item 029 (LAB-96) — duas coisas";
    expect(confere(comLista(prosa, "- **Outra** (LAB-90). **Segue aberto:** `nao-medido`")).map((x) => x.classe)).toEqual([
      "proposta-que-vive-so-em-prosa",
    ]);
    expect(confere(comLista(prosa, "- **Uma das duas** (LAB-96, 12/10). **Segue aberto:** `prompt-novo`"))).toEqual([]);
  });

  test("item sem tradução REPROVA como item sem prompt — a régua não adivinha, e não cobra citação de um nome inventado", () => {
    const f = comLista("### Proposto ao chat, saído do item 004 — x", "- **Outra** (LAB-90). **Segue aberto:** `nao-medido`");
    expect(confere(f).map((x) => x.classe)).toEqual(["secao-de-item-sem-prompt"]);
    expect(confere(f, new Map([["004", "LAB-71"]])).map((x) => x.classe)).toEqual(["proposta-que-vive-so-em-prosa"]);
  });

  test("a seção RISCADA não é cobrada de citação — o assunto fechou", () => {
    const f = comLista("### ~~Proposto ao chat, saído do item 004 — x~~ — ✅ feito", "- **Outra** (LAB-90). **Segue aberto:** `nao-medido`");
    expect(confere(f, new Map([["004", "LAB-71"]]))).toEqual([]);
  });

  test("item ABERTO da mesma origem e do mesmo assunto de uma seção riscada REPROVA — os DOIS sinais", () => {
    const riscada = "### ~~Proposto ao chat, saído do LAB-59 — o SÉTIMO MECANISMO, se houver~~ — ✅ **medido no LAB-78**";
    expect(secoesRiscadasDeProposta(riscada)).toEqual([{ linha: 1, prompt: "LAB-59", titulo: "o SÉTIMO MECANISMO, se houver" }]);
    const aberto = "- **O SÉTIMO MECANISMO DE ANTONINA, SE HOUVER** (LAB-59). **Segue aberto:** `prompt-novo`";
    expect(confere(comLista(riscada, aberto)).map((x) => x.classe)).toEqual(["aberto-de-secao-riscada"]);
    // mesma origem, assunto outro: passa (é o caso do LAB-78, que saiu da medição do sétimo e é outra coisa)
    expect(confere(comLista(riscada, "- **PARAR A FILEIRA NO FIM DA FACE** (LAB-59). **Segue aberto:** `aguardando-o-jonny`"))).toEqual([]);
    // mesmo assunto, origem só MENCIONADA (no caminho da prova), não citada: passa — a origem é a gramática do D142
    expect(
      confere(comLista(riscada, "- **O SÉTIMO MECANISMO DE ANTONINA, SE HOUVER** (07/10). ver `docs/provas/LAB-59/x.json`. **Segue aberto:** `prompt-novo`")),
    ).toEqual([]);
    // e RISCADO, o item não é acusado
    expect(confere(comLista(riscada, "- ~~**O SÉTIMO MECANISMO DE ANTONINA, SE HOUVER** (LAB-59)~~ — ✅ **executado no LAB-78**."))).toEqual([]);
  });

  test("hoje: as seções de prosa ABERTAS são as do LAB-78 e do item 029 — e a do item 004 está riscada", () => {
    expect(secoesDePropostaEmProsa(FILA, ITENS).map((x) => x.prompt)).toEqual(["LAB-78", "LAB-96"]);
    expect(secoesRiscadasDeProposta(FILA, ITENS).map((x) => x.prompt)).toContain("LAB-71");
    expect(ITENS.get("004")).toBe("LAB-71");
  });
});
