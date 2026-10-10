/**
 * AS TRAVAS DO ALCANCE DAS PROVAS. (LAB-79, item 012)
 *
 * O item 012 pediu duas coisas, nesta ordem, e a ordem era o recado:
 *
 * 1. **MEDIR o alcance antes de construir** — quantas provas se conferem contra SI MESMAS em vez
 *    de serem remedidas contra a fonte. *"Diga o número, e diga quantas são, para que 'verde' não
 *    volte a ser uma frase sobre um universo não medido."*
 * 2. **construir a trava**, e com a guarda da guarda OBRIGATÓRIA: com a prova em dia tem de
 *    passar, com a prova velha de propósito tem de reprovar **pelo nome da prova**.
 *
 * > **Lista que cresce é dívida visível. Trava que confere consigo mesma é dívida invisível — e
 * > ela sai VERDE.**
 *
 * Cada chave que o `ESCOPO_REMEDIDO` chama de `medida` é **remedida aqui**, contra o módulo que a
 * produz (D144). Declaração que diz `medida` e não remede nada seria a dívida invisível com mais
 * código — o defeito, de novo, que este prompt existe para fechar.
 */

import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { PADRAO_DE_FABRICA } from "../../../entrega/registro-de-motores/registro.ts";
import { MOTORES_DE_LOTE } from "../src/acesso.ts";
import {
  COMO_SE_CONFERE,
  O_QUE_A_PROVA_AFIRMA,
  aContaDoAlcanceFecha,
  medirOAlcance,
  podeSerRegerada,
  remedirUmaProva,
  type ComoSeConfere,
  type ProvaMedida,
  type ValorDaFonte,
} from "../src/alcance-das-provas.ts";
import {
  FAIXA_EM_USO_m,
  REGRAS_DO_ACESSO,
  REGUA_DA_FAIXA,
  sugerirAcesso,
} from "../src/acesso-sugerido.ts";
import { lerAConta } from "../src/disparos-do-despertador.ts";
import { ESCOPO_DO_DETECTOR } from "../src/escopo-do-detector.ts";
import {
  O_QUE_NINGUEM_PEGA,
  VERIFICACOES,
  aIntersecao,
  soDa,
} from "../src/escopo-dos-instrumentos.ts";
import { ESCOPO_REMEDIDO } from "../src/escopo-remedido.ts";
import { conferirORegistro, lerORegistro, ligados, universoLido } from "../src/registro-do-lab.ts";
import * as inventario from "../src/inventario-das-pontes.ts";
import {
  DONOS,
  VEREDICTOS,
  CONTATO_m,
  aContaFecha,
  contarOsVereditos,
  deQuemEhAViolacao,
  type LoteAcusado,
} from "../src/setimo-mecanismo.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const PROVAS = join(RAIZ, "docs", "provas");

const ler = (rel: string): Record<string, unknown> =>
  JSON.parse(readFileSync(join(PROVAS, rel), "utf8")) as Record<string, unknown>;

/** Todo `.json` sob `docs/provas/` — a mesma varredura da ferramenta. */
function todasAsProvas(): string[] {
  const achadas: string[] = [];
  const andar = (dir: string): void => {
    for (const nome of readdirSync(dir)) {
      const cheio = join(dir, nome);
      if (statSync(cheio).isDirectory()) andar(cheio);
      else if (nome.endsWith(".json")) achadas.push(relative(PROVAS, cheio).split("\\").join("/"));
    }
  };
  andar(PROVAS);
  return achadas.sort();
}

function todosOsTestes(): { nome: string; corpo: string }[] {
  const saida: { nome: string; corpo: string }[] = [];
  for (const pacote of ["esteira", "testfit"]) {
    const dir = join(RAIZ, "external-engines", pacote, "tests");
    let nomes: string[];
    try {
      nomes = readdirSync(dir);
    } catch {
      continue;
    }
    for (const n of nomes) {
      if (n.endsWith(".test.ts")) saida.push({ nome: n, corpo: readFileSync(join(dir, n), "utf8") });
    }
  }
  return saida;
}

const COM_ESCOPO = new Set([...Object.keys(ESCOPO_DO_DETECTOR), ...Object.keys(ESCOPO_REMEDIDO)]);

function classificar(): ProvaMedida[] {
  const testes = todosOsTestes();
  return todasAsProvas().map((caminho): ProvaMedida => {
    const pasta = caminho.includes("/") ? caminho.slice(0, caminho.indexOf("/")) : "";
    const base = caminho.slice(caminho.lastIndexOf("/") + 1);
    const travas = testes
      .filter((t) => t.corpo.includes(caminho) || (pasta !== "" && t.corpo.includes(pasta) && t.corpo.includes(base)))
      .map((t) => t.nome)
      .sort();
    let comoSeConfere: ComoSeConfere;
    if (COM_ESCOPO.has(caminho)) comoSeConfere = "remedida-da-fonte";
    else if (travas.length === 0) comoSeConfere = "sem-trava";
    else if (travas.length === 1 && travas[0] === "regras.test.ts") comoSeConfere = "so-a-forma";
    else comoSeConfere = "remedida-sem-escopo-declarado";
    return { caminho, comoSeConfere, travas };
  });
}

describe("O UNIVERSO é medido e PUBLICADO — não é uma frase sobre um conjunto não lido", () => {
  const medidas = classificar();
  const alcance = medirOAlcance(medidas, COM_ESCOPO.size);

  test("a varredura não volta vazia — zero aqui seria 'tudo conferido' sobre nada", () => {
    expect(medidas.length).toBeGreaterThan(50);
    expect(todosOsTestes().length).toBeGreaterThan(20);
  });

  test("a conta FECHA: a soma por classe é o universo", () => {
    expect(aContaDoAlcanceFecha(alcance)).toBe(true);
    const soma = Object.values(alcance.porComoSeConfere).reduce((s, n) => s + n, 0);
    expect(soma).toBe(alcance.universo);
  });

  test("toda classe é do vocabulário FECHADO", () => {
    for (const m of medidas) expect(COMO_SE_CONFERE as readonly string[]).toContain(m.comoSeConfere);
  });

  test("a frase do universo DIZ os números — publicar a conta é a trava", () => {
    expect(alcance.comoSeDiz).toContain(`${alcance.universo} provas`);
    expect(alcance.comoSeDiz).toContain("sem trava nenhuma");
    expect(alcance.comoSeDiz).toContain("só a forma");
  });

  test("`sem-trava` NÃO é zero e não é aprovação — é prova NÃO LIDA, e o número fica à vista", () => {
    const semTrava = medidas.filter((m) => m.comoSeConfere === "sem-trava");
    // Se um dia isto for zero, ótimo — mas tem de ser por trava nova, não por a régua parar de ver.
    expect(semTrava.length).toBe(alcance.porComoSeConfere["sem-trava"]);
    for (const m of semTrava) expect(m.travas).toEqual([]);
  });

  test("toda prova com escopo publicado EXISTE no disco", () => {
    const noDisco = new Set(todasAsProvas());
    for (const c of COM_ESCOPO) {
      expect(noDisco.has(c), `o escopo declara \`${c}\` e ela não está no disco`).toBe(true);
    }
  });

  test("o LAB-79 AUMENTOU o alcance: de DUAS para SETE com escopo publicado", () => {
    expect(Object.keys(ESCOPO_DO_DETECTOR)).toHaveLength(2);
    expect(Object.keys(ESCOPO_REMEDIDO)).toHaveLength(5);
    expect(COM_ESCOPO.size).toBe(7);
    expect(alcance.porComoSeConfere["remedida-da-fonte"]).toBe(7);
  });
});

/** O que cada fonte diz, por prova. **Cada `medida` do escopo aparece aqui.** */
function aFonteDe(caminho: string): ValorDaFonte[] {
  if (caminho === "item-003/escopo-dos-instrumentos.json") {
    // A FORMA sai da prova e os NÚMEROS saem dos módulos. A primeira versão desta fonte
    // inventou a forma — contagens onde a prova traz LISTAS DE ids — e as três chaves
    // reprovaram de uma vez. *Medir antes de atribuir vale para a minha própria régua.*
    const prova = ler("item-003/escopo-dos-instrumentos.json");
    const escopoNaProva = (prova.oEscopo ?? {}) as Record<string, unknown>;
    return [
      {
        chave: "oEscopo",
        daFonte: {
          ...escopoNaProva,
          verificacoes: VERIFICACOES.length,
          naIntersecao: aIntersecao().map((v) => v.id),
          soDaFerramenta: soDa("ferramenta").map((v) => v.id),
          soDaTrava: soDa("trava").map((v) => v.id),
        },
      },
      { chave: "oQueNinguemPega", daFonte: O_QUE_NINGUEM_PEGA },
      { chave: "problemas", daFonte: [] },
    ];
  }
  if (caminho === "item-004/conta-dos-disparos.json") {
    // Os TOTAIS da conta, relidos de quem os produz. O objeto `aConta` inteiro carrega o texto
    // de cada linha, e conferi-lo seria conferir texto — por isso a chave é `medidaEmParte` e a
    // fonte aqui é a parte que ENVELHECE: os dois números.
    const conta = lerAConta(readFileSync(join(RAIZ, "docs", "ONDE_PARAMOS.md"), "utf8"));
    const prova = ler("item-004/conta-dos-disparos.json");
    const naProva = (prova.aConta ?? {}) as { declarados?: unknown };
    return [
      { chave: "aConta", daFonte: { ...naProva, declarados: conta.declarados } },
      { chave: "problemas", daFonte: [] },
    ];
  }
  if (caminho === "LAB-76/registro-de-motores.json") {
    const reg = lerORegistro();
    const nomes = Object.keys(inventario).filter((n) => /^[A-Z_]+$/.test(n));
    return [
      { chave: "padrao", daFonte: PADRAO_DE_FABRICA },
      { chave: "universo", daFonte: universoLido(reg) },
      { chave: "motoresDeLote", daFonte: [...MOTORES_DE_LOTE] },
      {
        chave: "conferencia",
        daFonte: conferirORegistro(reg, ligados(reg).map((m) => m.id), MOTORES_DE_LOTE, nomes),
      },
    ];
  }
  if (caminho === "LAB-77/acesso-sugerido.json") {
    return [
      { chave: "asRegrasDoJonny", daFonte: REGRAS_DO_ACESSO },
      { chave: "aReguaDaFaixa", daFonte: REGUA_DA_FAIXA },
      { chave: "qualFaixaFoiUsada", daFonte: FAIXA_EM_USO_m },
    ];
  }
  if (caminho === "LAB-78/setimo-mecanismo.json") {
    // A conta é REFEITA: os veredictos saem de `deQuemEhAViolacao` sobre os `acusados` gravados,
    // e a conta deles de `contarOsVereditos`. Nada aqui lê o número gravado para compará-lo
    // consigo mesmo — é a diferença que este prompt existe para fazer.
    const prova = ler("LAB-78/setimo-mecanismo.json");
    const refeitos = (prova.acusados as LoteAcusado[]).map((a2) => deQuemEhAViolacao(a2));
    return [
      { chave: "contato_m", daFonte: CONTATO_m },
      { chave: "conta", daFonte: contarOsVereditos(refeitos) },
    ];
  }
  throw new Error(`sem fonte declarada para \`${caminho}\` — e adivinhar aqui seria inventar dado`);
}

describe("AS CINCO novas são REMEDIDAS contra a fonte, chave por chave (D144)", () => {
  for (const caminho of Object.keys(ESCOPO_REMEDIDO)) {
    test(`${caminho} — em dia, e o escopo cobre as duas direções`, () => {
      const prova = ler(caminho);
      const problemas = remedirUmaProva(caminho, prova, ESCOPO_REMEDIDO[caminho]!, aFonteDe(caminho));
      expect(problemas.map((p) => `${p.tipo} · ${p.chave} · ${p.oQue}`)).toEqual([]);
    });
  }

  test("toda chave `medida` do escopo tem fonte implementada aqui — declaração não fica solta", () => {
    for (const [caminho, escopo] of Object.entries(ESCOPO_REMEDIDO)) {
      const comFonte = new Set(aFonteDe(caminho).map((f) => f.chave));
      for (const [chave, classe] of Object.entries(escopo)) {
        if (classe === "medida" || classe.startsWith("medida:")) {
          expect(comFonte.has(chave), `${caminho}: \`${chave}\` é \`medida\` e não tem fonte na trava`).toBe(true);
        }
      }
    }
  });

  test("o veredicto de cada lote do LAB-78 é REFEITO, e a conta dele fecha", () => {
    const prova = ler("LAB-78/setimo-mecanismo.json");
    const acusados = prova.acusados as LoteAcusado[];
    const gravados = prova.vereditos as { chave: string; veredicto: string; dono: string }[];
    expect(acusados.length).toBeGreaterThan(0);
    expect(gravados.length).toBe(acusados.length);
    const refeitos = acusados.map((a) => deQuemEhAViolacao(a));
    for (const r of refeitos) {
      const g = gravados.find((x) => x.chave === r.chave);
      expect(g, `o lote \`${r.chave}\` não está nos vereditos gravados`).toBeTruthy();
      expect(g!.veredicto, `LAB-78: o veredicto de \`${r.chave}\` mudou`).toBe(r.veredicto);
      expect(g!.dono).toBe(r.dono);
      expect(VEREDICTOS as readonly string[]).toContain(r.veredicto);
      expect(DONOS as readonly string[]).toContain(r.dono);
    }
    expect(aContaFecha(contarOsVereditos(refeitos))).toBe(true);
  });

  test("que a sugestão do LAB-77 se RECUSA a sair é refeito chamando a função", () => {
    const prova = ler("LAB-77/acesso-sugerido.json");
    const gravada = prova.aSugestao as { frase: string | null; porqueNao: string | null };
    const refeita = sugerirAcesso(null, 100, []);
    expect(gravada.frase).toBe(null);
    expect(refeita.frase).toBe(null);
    expect(gravada.porqueNao).toContain("divisa do vizinho");
    expect(refeita.porqueNao).toContain("divisa do vizinho");
  });
});

describe("A GUARDA DA GUARDA — a prova velha REPROVA, e pelo NOME dela", () => {
  test("prova em dia PASSA — o outro sentido, sem o qual isto não prova nada", () => {
    for (const caminho of Object.keys(ESCOPO_REMEDIDO)) {
      const problemas = remedirUmaProva(caminho, ler(caminho), ESCOPO_REMEDIDO[caminho]!, aFonteDe(caminho));
      expect(problemas, `${caminho} devia passar em dia`).toEqual([]);
    }
  });

  test("NÚMERO VELHO reprova, e a mensagem traz o NOME da prova e a chave", () => {
    const caminho = "item-004/conta-dos-disparos.json";
    const velha = { ...ler(caminho), aConta: { observados: 1, emVazio: 0 } };
    const problemas = remedirUmaProva(caminho, velha, ESCOPO_REMEDIDO[caminho]!, aFonteDe(caminho));
    expect(problemas).toHaveLength(1);
    expect(problemas[0]?.tipo).toBe("numero-velho");
    expect(problemas[0]?.prova).toBe(caminho);
    expect(problemas[0]?.chave).toBe("aConta");
    expect(problemas[0]?.oQue).toContain("PROVA VELHA");
    expect(problemas[0]?.oQue).toContain(caminho);
    expect(problemas[0]?.oQue).toContain("não ajuste o número à mão");
  });

  test("o número velho do LAB-60 é EXATAMENTE este caso — 1 contra 10, e o verde não via", () => {
    // A prova do LAB-57 dizia 1 e a ferramenta dizia 10 (D195). Com a régua de hoje, isso
    // reprova pelo nome do arquivo em vez de sair verde.
    const problemas = remedirUmaProva(
      "LAB-57/varredura-de-configuracao.json",
      { quantos: 1 },
      { quantos: "medida" },
      [{ chave: "quantos", daFonte: 10 }],
    );
    expect(problemas).toHaveLength(1);
    expect(problemas[0]?.oQue).toContain("diz 1 and".replace(" and", "")); // o valor da prova
    expect(problemas[0]?.oQue).toContain("FONTE diz 10");
    expect(problemas[0]?.prova).toBe("LAB-57/varredura-de-configuracao.json");
  });

  test("CHAVE NOVA na prova sem ninguém classificar reprova (D164)", () => {
    const caminho = "LAB-78/setimo-mecanismo.json";
    const comChaveNova = { ...ler(caminho), umaChaveQueNinguemClassificou: 42 };
    const problemas = remedirUmaProva(caminho, comChaveNova, ESCOPO_REMEDIDO[caminho]!, aFonteDe(caminho));
    expect(problemas.map((p) => p.tipo)).toContain("chave-da-prova-sem-escopo");
    expect(problemas.find((p) => p.tipo === "chave-da-prova-sem-escopo")?.prova).toBe(caminho);
  });

  test("CHAVE do escopo que saiu da prova reprova — o escopo não envelhece calado", () => {
    const caminho = "LAB-77/acesso-sugerido.json";
    const semUma = { ...ler(caminho) };
    delete semUma.aReguaDaFaixa;
    const problemas = remedirUmaProva(caminho, semUma, ESCOPO_REMEDIDO[caminho]!, aFonteDe(caminho));
    expect(problemas.map((p) => p.tipo)).toContain("escopo-sem-chave");
  });
});

describe("A FRONTEIRA DO D182 — e a TERCEIRA classe é o achado", () => {
  test("estado de agora PODE ser regerado", () => {
    const v = podeSerRegerada("estado-de-agora", false);
    expect(v.pode).toBe(true);
    expect(v.porque).toContain("presente velho é presente errado");
  });

  test("EVENTO nunca se regera — é o D182 inteiro", () => {
    for (const comCommit of [true, false]) {
      const v = podeSerRegerada("evento", comCommit);
      expect(v.pode).toBe(false);
      expect(v.porque).toContain("D182");
    }
  });

  test("estado de OUTRO REPOSITÓRIO só com o commit declarado — o achado do LAB-79", () => {
    expect(podeSerRegerada("estado-de-outro-repositorio", false).pode).toBe(false);
    expect(podeSerRegerada("estado-de-outro-repositorio", false).porque).toContain("TROCA A PERGUNTA");
    expect(podeSerRegerada("estado-de-outro-repositorio", true).pode).toBe(true);
  });

  test("as três classes são vocabulário fechado, e as três têm veredicto", () => {
    expect(O_QUE_A_PROVA_AFIRMA).toHaveLength(3);
    for (const a of O_QUE_A_PROVA_AFIRMA) {
      for (const c of [true, false]) {
        const v = podeSerRegerada(a, c);
        expect(typeof v.pode).toBe("boolean");
        expect(v.porque.split(" ").length).toBeGreaterThan(8);
      }
    }
  });

  /**
   * A FRONTEIRA do item 012: *"pare se a trava nova quiser **escrever** dentro de
   * `docs/provas/`"*. Esta trava confere isso em si mesma — e a primeira versão dela **se
   * acusou**: ela varria o próprio fonte procurando `writeFileSync`, e o fonte contém a
   * palavra porque é ela que a proíbe. **É o D142 e o D155 outra vez**, na trava recém
   * escrita.
   *
   * O conserto é o que o §6 já manda: *procure o nome no lugar da gramática onde ele
   * significa aquilo — num `import`, não no arquivo inteiro*. Escrever em disco exige
   * IMPORTAR o escritor, então é a linha do `import` que decide.
   */
  test("NADA nesta trava escreve em `docs/provas/` — e a régua olha o IMPORT (D142)", () => {
    const fonte = readFileSync(join(RAIZ, "external-engines", "esteira", "tests", "alcance-das-provas.test.ts"), "utf8");
    const importsDeFs = [...fonte.matchAll(/^import \{([^}]*)\} from "node:fs";$/gm)].map((m) => m[1]!);
    expect(importsDeFs.length, "esta trava tem de importar de `node:fs` para ler as provas").toBeGreaterThan(0);
    for (const lista of importsDeFs) {
      const nomes = lista.split(",").map((n) => n.trim()).filter(Boolean);
      expect(nomes.sort()).toEqual(["readFileSync", "readdirSync", "statSync"]);
    }
  });
});
