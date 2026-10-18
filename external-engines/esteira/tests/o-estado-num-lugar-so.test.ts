/**
 * **LAB-186 (item 900) · o estado do despertador mora num lugar só — perguntado fora dele, a cada verde** (D414).
 *
 * ```sh
 * bun test tests/o-estado-num-lugar-so.test.ts
 * ```
 *
 * O `README.md` da raiz dizia, desde 14/09/2026, que a fila estava esgotada e o despertador apagado — falso desde 15/09,
 * e o item 004 (D234) tinha posto o estado num lugar só sem nada que perguntasse os outros. O motivo inteiro está no
 * cabeçalho de `src/o-estado-num-lugar-so.ts`.
 *
 * Roda **sem clones** (lê o `git` DESTE repositório), e por isso está no portão sem clones do `verde.yml`. As frases
 * plantadas abaixo estão dentro de strings de um `.ts`, que a régua não lê (só `.md`).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  A_PORTA,
  A_PORTA_CITA,
  AS_FORMAS,
  OS_DIARIOS,
  O_LUGAR,
  O_QUE_ISTO_NAO_ALCANCA,
  afirmacoesDeEstado,
  conferir,
  conferirAArvore,
  oBlocoDaPorta,
} from "../src/o-estado-num-lugar-so.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");

const PORTA_BOA = [
  "# archilly-lab",
  "",
  "> **O estado não mora nesta página.** A caixa: [`docs/caixa-de-entrada/COMO_FUNCIONA.md`](x)",
  "> e a conta dos disparos no [`docs/ONDE_PARAMOS.md`](y).",
  "",
  "texto",
  "",
].join("\n");
const VELHA = "> **A fila autônoma está esgotada desde 14/09/2026** — os cinco prompts dela\n> foram executados e mesclados, e o despertador foi apagado.\n";

const diarios = OS_DIARIOS.filter((d) => d.lugar.endsWith(".md")).map((d) => d.lugar);
const BASE: Record<string, string> = Object.fromEntries([
  [A_PORTA, PORTA_BOA],
  ["docs/INDEX.md", "# índice\n"],
  ...diarios.map((d) => [d, "o despertador foi apagado em 14/09, e a fila está esgotada.\n"]),
]);
const rodar = (extra: Record<string, string> = {}) => {
  const arvore = new Map(Object.entries({ ...BASE, ...extra }));
  return conferir([...arvore.keys()], (c) => arvore.get(c) ?? null, (c) => arvore.has(c));
};

describe("LAB-186 · o que o git carrega hoje — o estado só no lugar único, e o universo publicado", () => {
  test("nenhum .md fora dos diários afirma o estado, e a porta cita onde ele mora", () => {
    const r = conferirAArvore(RAIZ);
    console.log(`[o-estado-num-lugar-so] ${r.lidos} .md lidos · ${r.diarios} nos diários · ${r.achados.length} achado(s) · ${r.problemas.length} problema(s)`);
    expect(r.problemas).toEqual([]);
    // Medido em 18/10/2026: 33 `.md` lidos e 223 nos diários. Se encolherem, a régua passou a ler menos (D164).
    expect(r.lidos).toBeGreaterThanOrEqual(33);
    expect(r.diarios).toBeGreaterThanOrEqual(223);
  });

  test("o lugar único ainda diz que é o único", () => {
    expect(readFileSync(join(RAIZ, O_LUGAR), "utf8")).toContain("Este é o ÚNICO lugar do repositório que diz o estado do despertador agora.");
  });

  test("o que a trava não alcança está dito", () => {
    expect(O_QUE_ISTO_NAO_ALCANCA.length).toBeGreaterThanOrEqual(5);
  });
});

describe("LAB-186 · a régua acusa o caso ruim", () => {
  test("a porta de antes: as duas formas e o bloco sem a caixa — três problemas", () => {
    const r = rodar({ [A_PORTA]: `# archilly-lab\n\n${VELHA}> [\`docs/ONDE_PARAMOS.md\`](x)\n` });
    expect(r.achados.map((a) => a.forma).sort()).toEqual(["despertador", "fila-esgotada"]);
    expect(r.problemas.length).toBe(3);
  });

  test("a frase quebrada na coluna e em negrito ainda é afirmação", () => {
    expect(afirmacoesDeEstado("x.md", "e o **despertador\nfoi desligado** ontem").map((a) => a.forma)).toEqual(["despertador"]);
  });

  test("um README novo, que nenhuma lista nomeia, é lido — o universo é o lugar, não a lista", () => {
    const r = rodar({ "external-engines/motor-novo/README.md": "O despertador está religado.\n" });
    expect(r.achados.map((a) => a.arquivo)).toEqual(["external-engines/motor-novo/README.md"]);
  });

  test("o diário declarado que some do disco é acusado", () => {
    const arvore = new Map(Object.entries(BASE));
    arvore.delete("docs/DECISOES.md");
    const r = conferir([...arvore.keys()], (c) => arvore.get(c) ?? null, (c) => arvore.has(c));
    expect(r.problemas.join(" ")).toContain("docs/DECISOES.md: declarado como diário e não existe");
  });

  test("a porta sem bloco no topo é acusada, e cada caminho que ela tem de citar também", () => {
    expect(rodar({ [A_PORTA]: "# archilly-lab\n\ntexto\n" }).problemas).toContain(`${A_PORTA}: sem o bloco do topo`);
    for (const alvo of A_PORTA_CITA) {
      const r = rodar({ [A_PORTA]: PORTA_BOA.replace(alvo, "outro.md") });
      expect(r.problemas).toContain(`${A_PORTA}: o bloco do topo não cita ${alvo}`);
    }
  });
});

describe("LAB-186 · a régua aprova o caso bom", () => {
  test("a árvore mínima passa, com a frase datada nos diários", () => {
    expect(rodar().problemas).toEqual([]);
  });

  test("riscado, citado e entre crases não é afirmação", () => {
    for (const bom of [
      "este bloco dizia ~~a fila autônoma está esgotada~~",
      'o item dizia *"o despertador foi apagado"*',
      "a regra `o despertador está desligado` mudou",
      "o despertador acorda a casa; ligar e desligar é do chat",
    ]) {
      expect(afirmacoesDeEstado("x.md", bom), bom).toEqual([]);
    }
  });

  test("o upstream e o node_modules ficam fora do universo", () => {
    const r = rodar({
      "external-engines/symbios/upstream/README.md": "the despertador está ligado",
      "external-engines/esteira/node_modules/x/README.md": "a fila está esgotada",
    });
    expect(r.problemas).toEqual([]);
  });

  test("o bloco da porta é o da citação do topo, e só ele", () => {
    expect(oBlocoDaPorta(PORTA_BOA)).toContain("docs/ONDE_PARAMOS.md");
    expect(oBlocoDaPorta(PORTA_BOA)).not.toContain("texto");
    expect(AS_FORMAS.length).toBe(2);
  });
});
