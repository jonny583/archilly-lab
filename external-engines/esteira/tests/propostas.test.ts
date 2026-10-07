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
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  MOTIVOS_DE_SEGUIR_ABERTO,
  SOBREPOSICAO_MINIMA_DO_TITULO,
  citaAOrigem,
  conferirPropostas,
  lerPropostas,
  secoesDePropostaEmProsa,
  sobreposicaoDeTitulo,
  tituloDe,
} from "../src/varredura-das-propostas.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const FILA = readFileSync(join(RAIZ, "docs", "prompts", "FILA.md"), "utf8");
const PROVA = JSON.parse(
  readFileSync(join(RAIZ, "docs", "provas", "LAB-61", "a-minha-lista-de-propostas.json"), "utf8"),
) as {
  antes: { itens: number; problemas: number; porClasse: Record<string, number>; asSobreposicoesMedidas: { marca: string; sobreposicao: number | null }[] };
  agora: { itens: number; riscados: number; abertos: number; problemas: number; abertosPorMotivo: Record<string, number> };
  aRegua: { oLimiarDoTitulo: number; oQueCobra: string[] };
  oQueFoiPAGO: string[];
};

describe("LAB-61 · a lista de HOJE não tem problema — é a trava que importa", () => {
  const itens = lerPropostas(FILA);
  const prosa = secoesDePropostaEmProsa(FILA);
  const problemas = conferirPropostas(itens, prosa);

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
      expect(i.executadoPor, `L${i.linha}: riscado sem executor`).toMatch(/^LAB-\d\d$/);
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
