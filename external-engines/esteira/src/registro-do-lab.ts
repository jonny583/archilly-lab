/**
 * O REGISTRO DE MOTORES DO LABORATÓRIO — quais motores esta casa conhece. (LAB-76, D68)
 *
 * # A primeira coisa que este arquivo tem de dizer é o que ele NÃO é
 *
 * A D68 pede três coisas: um registro, liga/desliga por motor, e um motor padrão. Antes de
 * escrever uma linha eu procurei quem já responde cada uma — porque a regra que o Jonny deu à
 * direção em 09/10/2026 é **nome novo para coisa que já tem nome na casa é custo sem benefício**.
 * Medido, **duas das três já existiam**:
 *
 * | o que a D68 pede | já existia? | onde |
 * |---|---|---|
 * | o que um motor é, como tipo | **sim** | `CapacidadesDoMotor`, `MotorNaPorta` (LAB-06) |
 * | liga/desliga por motor | **sim, para o HOSPEDEIRO** | `RegistroDeMotores.ligar/desligar` |
 * | **motor padrão** | **sim** | `PADRAO_DE_FABRICA` — e é importado aqui, não recopiado |
 * | a procedência de um REPOSITÓRIO vizinho | **sim** | `commit-dos-vizinhos.ts` (LAB-74) |
 * | **a procedência de um MOTOR** | **NÃO** | nada ligava motor → repositório → commit |
 * | **o estado como DADO** | **NÃO** | `MOTORES_DE_LOTE` é tupla em código |
 * | **o tamanho do universo lido** | **NÃO** | nenhuma medição dizia quantos havia |
 *
 * Então isto aqui **não é um registro novo**: é a **procedência** e o **estado** que faltavam,
 * mais a conta do universo. O que já tinha nome continua com o nome que tinha — e há trava que
 * reprova se o padrão ganhar uma segunda declaração nesta casa (D116).
 *
 * # E o que ele recusa a ser: uma cópia do inventário das pontes
 *
 * O inventário diz *o que cada campo faz na travessia*; o registro diz *que motores existem e
 * qual está ligado*. São perguntas diferentes, e copiar os campos para cá criaria a segunda
 * montagem que o D116 proíbe. O campo `oQuePrometeMoraEm` é um **ponteiro** para as constantes
 * do inventário, e uma trava confere que cada nome apontado **existe lá**.
 *
 * # Por que o commit NÃO está gravado no dado
 *
 * Porque ele muda sozinho. Os três clones vizinhos estavam **18 a 23 commits atrás** da origem
 * quando o LAB-74 mediu, e **22 a 28** um dia depois — ninguém tocou neles. Commit gravado em
 * arquivo que ninguém revalida envelhece em silêncio, que é o D104, e foi assim que esta casa
 * publicou disco como se fosse origem em **seis recados** (D241).
 *
 * Então o dado guarda **de onde se lê** a versão, e quem **mede** é a ferramenta, ao rodar. É o
 * mesmo desenho de `conferirContraAOrigem`: a função é pura e recebe a medição por parâmetro,
 * para a trava rodar sem os clones e a ferramenta medir de verdade.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PADRAO_DE_FABRICA } from "../../../entrega/registro-de-motores/registro.ts";

import type { ConferenciaDaOrigem, Vizinho } from "./commit-dos-vizinhos.ts";

/**
 * O estado de um motor no registro, e são TRÊS valores de propósito.
 *
 * **`so-referencia` não é `desligado`**, e juntar os dois seria perder a diferença que mais
 * importa aqui. `desligado` é *"está na casa e alguém o tirou da medição"*; `so-referencia` é
 * *"foi triado e recusado, nunca foi candidato"* — o PackingSolver por arquitetura de servidor,
 * o straight skeleton por licença copyleft. Um dia o desligado volta por decisão; o
 * só-referência volta por uma triagem nova.
 *
 * É a mesma disciplina do D23: zero é uma medição, `null` é "não medi". Dois estados onde há
 * três inventa a informação que falta.
 */
export const ESTADOS = ["ligado", "desligado", "so-referencia"] as const;
export type EstadoNoRegistro = (typeof ESTADOS)[number];

/** De onde o motor vem. A §3 e a exceção medida do D16 são as três respostas possíveis. */
export const TIPOS_DE_PROCEDENCIA = ["upstream", "familia-por-caminho", "nao-copiado"] as const;
export type TipoDeProcedencia = (typeof TIPOS_DE_PROCEDENCIA)[number];

export interface ProcedenciaDeclarada {
  tipo: TipoDeProcedencia;
  /** O repositório vizinho, quando o motor é lido por caminho (D16). `null` nos outros casos. */
  repo: string | null;
  /** O alias do `tsconfig` por onde ele entra, quando entra por código. */
  alias: string | null;
  /** O arquivo de onde a versão é LIDA — não a versão. `null` quando não se lê de lugar nenhum. */
  versaoLidaDe: string | null;
  /** A versão escrita à mão, quando o motor não publica uma. `null` quando ele publica. */
  versaoDeclarada: string | null;
}

export interface MotorNoRegistro {
  id: string;
  nome: string;
  estado: EstadoNoRegistro;
  /** Por que não está ligado. **Obrigatório** quando o estado não é `ligado`; `null` quando é. */
  porque: string | null;
  procedencia: ProcedenciaDeclarada;
  /** Ponteiro para as constantes do inventário das pontes. `null` = ponte não auditada. */
  oQuePrometeMoraEm: string[] | null;
}

export interface RegistroDoLab {
  contrato: string;
  motores: MotorNoRegistro[];
}

/** Onde o dado mora. Fora de `src`, porque é dado e não código. */
export const CAMINHO_DO_REGISTRO = join(import.meta.dirname, "..", "dados", "registro-de-motores.json");

/** O contrato que este leitor entende. Dado com outro contrato não se adivinha. */
export const CONTRATO_DO_REGISTRO = "registro-de-motores/1";

function exigirTexto(v: unknown, onde: string): string {
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`${onde}: esperava texto não vazio, veio ${JSON.stringify(v)}`);
  }
  return v;
}

function exigirTextoOuNulo(v: unknown, onde: string): string | null {
  if (v === null) return null;
  return exigirTexto(v, onde);
}

/**
 * Lê e CONFERE o registro.
 *
 * Ele reprova em vez de completar: campo torto aqui vira motor fantasma na medição, e um registro
 * que "dá um jeito" no dado ruim é um registro que mente com autoridade de conferência.
 */
export function lerORegistro(caminho: string = CAMINHO_DO_REGISTRO): RegistroDoLab {
  const cru: unknown = JSON.parse(readFileSync(caminho, "utf8"));
  if (typeof cru !== "object" || cru === null) throw new Error(`${caminho}: não é um objeto`);
  const obj = cru as Record<string, unknown>;

  const contrato = exigirTexto(obj.contrato, `${caminho} · contrato`);
  if (contrato !== CONTRATO_DO_REGISTRO) {
    throw new Error(
      `${caminho}: contrato "${contrato}", e este leitor entende "${CONTRATO_DO_REGISTRO}". ` +
        "Dado de outro contrato não se adivinha",
    );
  }

  if (!Array.isArray(obj.motores)) throw new Error(`${caminho} · motores: esperava lista`);

  const motores = obj.motores.map((m: unknown, i: number): MotorNoRegistro => {
    const onde = `${caminho} · motores[${i}]`;
    if (typeof m !== "object" || m === null) throw new Error(`${onde}: não é um objeto`);
    const r = m as Record<string, unknown>;

    const estado = exigirTexto(r.estado, `${onde}.estado`);
    if (!(ESTADOS as readonly string[]).includes(estado)) {
      throw new Error(`${onde}.estado: "${estado}" não é um dos ${ESTADOS.join(" | ")}`);
    }

    const porque = exigirTextoOuNulo(r.porque, `${onde}.porque`);
    if (estado !== "ligado" && porque === null) {
      throw new Error(
        `${onde}: estado "${estado}" sem \`porque\`. Motor fora da medição sem motivo escrito é ` +
          "exatamente o comentário que envelhece em silêncio (D104) — com o agravante de mudar a conta",
      );
    }
    if (estado === "ligado" && porque !== null) {
      throw new Error(`${onde}: estado "ligado" não leva \`porque\` — não há o que justificar`);
    }

    if (typeof r.procedencia !== "object" || r.procedencia === null) {
      throw new Error(`${onde}.procedencia: esperava objeto`);
    }
    const p = r.procedencia as Record<string, unknown>;
    const tipo = exigirTexto(p.tipo, `${onde}.procedencia.tipo`);
    if (!(TIPOS_DE_PROCEDENCIA as readonly string[]).includes(tipo)) {
      throw new Error(
        `${onde}.procedencia.tipo: "${tipo}" não é um dos ${TIPOS_DE_PROCEDENCIA.join(" | ")}`,
      );
    }

    const versaoLidaDe = exigirTextoOuNulo(p.versaoLidaDe, `${onde}.procedencia.versaoLidaDe`);
    const versaoDeclarada = exigirTextoOuNulo(p.versaoDeclarada, `${onde}.procedencia.versaoDeclarada`);
    if (versaoLidaDe !== null && versaoDeclarada !== null) {
      throw new Error(
        `${onde}.procedencia: tem \`versaoLidaDe\` E \`versaoDeclarada\`. São duas respostas para ` +
          "a mesma pergunta (D116): ou a versão se lê do motor, ou ela foi escrita à mão",
      );
    }

    let oQuePrometeMoraEm: string[] | null = null;
    if (r.oQuePrometeMoraEm !== null) {
      if (!Array.isArray(r.oQuePrometeMoraEm)) {
        throw new Error(`${onde}.oQuePrometeMoraEm: esperava lista de nomes ou null`);
      }
      oQuePrometeMoraEm = r.oQuePrometeMoraEm.map((n: unknown, j: number) =>
        exigirTexto(n, `${onde}.oQuePrometeMoraEm[${j}]`),
      );
    }

    return {
      id: exigirTexto(r.id, `${onde}.id`),
      nome: exigirTexto(r.nome, `${onde}.nome`),
      estado: estado as EstadoNoRegistro,
      porque,
      procedencia: {
        tipo: tipo as TipoDeProcedencia,
        repo: exigirTextoOuNulo(p.repo, `${onde}.procedencia.repo`),
        alias: exigirTextoOuNulo(p.alias, `${onde}.procedencia.alias`),
        versaoLidaDe,
        versaoDeclarada,
      },
      oQuePrometeMoraEm,
    };
  });

  const vistos = new Set<string>();
  for (const m of motores) {
    if (vistos.has(m.id)) throw new Error(`${caminho}: dois motores com o id "${m.id}"`);
    vistos.add(m.id);
  }

  return { contrato, motores };
}

/**
 * O MOTOR PADRÃO, e ele vem de `PADRAO_DE_FABRICA` — não daqui.
 *
 * O padrão tem **um** nome nesta casa, na peça do LAB-06, e esta função o importa. Declará-lo
 * também no dado seria a segunda resposta para a mesma pergunta (D116): no dia em que as duas
 * divergissem, metade do repositório leria uma e metade a outra.
 *
 * Ela **confere** que o padrão é um motor conhecido e ligado, e **reprova** se não for — padrão
 * apontando para motor que não corre é um ranking vazio esperando acontecer.
 */
export function padraoDoLab(reg: RegistroDoLab): string {
  const m = reg.motores.find((x) => x.id === PADRAO_DE_FABRICA);
  if (!m) {
    throw new Error(
      `o padrão desta casa é "${PADRAO_DE_FABRICA}" (PADRAO_DE_FABRICA) e ele não está no ` +
        "registro. Ou o dado perdeu um motor, ou o padrão mudou sem ninguém dizer",
    );
  }
  if (m.estado !== "ligado") {
    throw new Error(
      `o padrão "${PADRAO_DE_FABRICA}" está "${m.estado}" no registro. Mudar o padrão é prompt, ` +
        "não efeito colateral de desligar um motor",
    );
  }
  return PADRAO_DE_FABRICA;
}

/** Os motores que entram em medição: os ligados, e só eles. */
export function ligados(reg: RegistroDoLab): MotorNoRegistro[] {
  return reg.motores.filter((m) => m.estado === "ligado");
}

/**
 * O TAMANHO DO UNIVERSO LIDO — a trava que vale, e a frase que vai ao relatório.
 *
 * > *Conferência que não publica o tamanho do universo que leu passa lendo zero.*
 *
 * É o buraco que esta casa já pagou duas vezes com outro nome: a suíte do `testfit` vermelha por
 * duas semanas porque eu rodava só o outro pacote (D110), e o `exit 0, 0 testes` que eu li como
 * verde (item 003). Nos dois casos **a conferência não disse quantos itens havia** — e zero é o
 * que uma leitura vazia devolve sem reclamar.
 */
export interface UniversoDoRegistro {
  conhecidos: number;
  ligados: number;
  desligados: number;
  soReferencia: number;
  /** A frase para o relatório e para o recado. Ela DIZ os números, porque o número é o aviso. */
  comoSeDiz: string;
}

export function universoLido(reg: RegistroDoLab): UniversoDoRegistro {
  const conta = (e: EstadoNoRegistro): number => reg.motores.filter((m) => m.estado === e).length;
  const lig = conta("ligado");
  const des = conta("desligado");
  const ref = conta("so-referencia");
  return {
    conhecidos: reg.motores.length,
    ligados: lig,
    desligados: des,
    soReferencia: ref,
    comoSeDiz:
      `${reg.motores.length} motores conhecidos · ${lig} ligados · ${des} desligados · ` +
      `${ref} só-referência (triados e recusados)`,
  };
}

/**
 * TRAVA 1 — todo motor que a esteira roda está no registro.
 *
 * `idsDaPorta` são os ids que as fábricas de `porta/motores.ts` produzem, e `idsDeLote` é a
 * `MOTORES_DE_LOTE` do `acesso.ts`. Os dois entram por parâmetro para esta função não arrastar o
 * motor inteiro — e para a trava rodar sem os clones vizinhos.
 *
 * **Ela confere as duas direções**, e a segunda é a que pega o caso difícil: motor que a esteira
 * roda e o registro não conhece (medição fantasma), e motor `ligado` no registro que a porta não
 * produz (registro prometendo o que não existe).
 */
export interface ConferenciaDoRegistro {
  fora: string[];
  prometidosQueNaoExistem: string[];
  loteForaDoRegistro: string[];
  loteQueNaoEstaLigado: string[];
  apontamDesconhecido: { motor: string; nome: string }[];
  ok: boolean;
}

export function conferirORegistro(
  reg: RegistroDoLab,
  idsDaPorta: readonly string[],
  idsDeLote: readonly string[],
  nomesDoInventario: readonly string[],
): ConferenciaDoRegistro {
  const conhecidos = new Set(reg.motores.map((m) => m.id));
  const ligadosIds = new Set(ligados(reg).map((m) => m.id));

  const fora = idsDaPorta.filter((id) => !conhecidos.has(id));
  const prometidosQueNaoExistem = [...ligadosIds].filter((id) => !idsDaPorta.includes(id));
  const loteForaDoRegistro = idsDeLote.filter((id) => !conhecidos.has(id));
  const loteQueNaoEstaLigado = idsDeLote.filter((id) => conhecidos.has(id) && !ligadosIds.has(id));

  const apontamDesconhecido: { motor: string; nome: string }[] = [];
  for (const m of reg.motores) {
    for (const nome of m.oQuePrometeMoraEm ?? []) {
      if (!nomesDoInventario.includes(nome)) apontamDesconhecido.push({ motor: m.id, nome });
    }
  }

  return {
    fora,
    prometidosQueNaoExistem,
    loteForaDoRegistro,
    loteQueNaoEstaLigado,
    apontamDesconhecido,
    ok:
      fora.length === 0 &&
      prometidosQueNaoExistem.length === 0 &&
      loteForaDoRegistro.length === 0 &&
      loteQueNaoEstaLigado.length === 0 &&
      apontamDesconhecido.length === 0,
  };
}

/**
 * TRAVA 2 — todo motor do registro tem a procedência medida, com a distância até a origem.
 *
 * A medição entra por parâmetro, como em `conferirContraAOrigem`: `origens` é o que a ferramenta
 * leu com `git fetch` + `rev-list --count`, por repositório. Aqui só se CRUZA.
 *
 * **O veredito é por motor, e `nao-medido` não é `em-dia`** — é o D23 outra vez. Motor de
 * `upstream/` tem a procedência num arquivo versionado e não tem origem a consultar: o veredito
 * dele é `carimbado-no-upstream`, que é uma resposta, não uma falta.
 */
export type VereditoDaProcedencia =
  | "medida-contra-a-origem"
  | "carimbado-no-upstream"
  | "nao-copiado"
  | "nao-medida";

export interface ProcedenciaDeMotor {
  motor: string;
  veredito: VereditoDaProcedencia;
  repo: string | null;
  head: string | null;
  origemMain: string | null;
  atrasPor: number | null;
  comoSeDiz: string;
}

export function procedenciaDosMotores(
  reg: RegistroDoLab,
  origens: ReadonlyMap<Vizinho | string, ConferenciaDaOrigem>,
): ProcedenciaDeMotor[] {
  return reg.motores.map((m): ProcedenciaDeMotor => {
    const base = { motor: m.id, repo: m.procedencia.repo };

    if (m.procedencia.tipo === "nao-copiado") {
      return {
        ...base,
        veredito: "nao-copiado",
        head: null,
        origemMain: null,
        atrasPor: null,
        comoSeDiz:
          `\`${m.id}\` não foi copiado para cá — nada a medir, e isso é uma resposta: ` +
          "a triagem recusou seguir, e o motivo está no registro",
      };
    }

    if (m.procedencia.tipo === "upstream") {
      const onde = m.procedencia.versaoLidaDe;
      if (onde === null) {
        return {
          ...base,
          veredito: "nao-medida",
          head: null,
          origemMain: null,
          atrasPor: null,
          comoSeDiz: `\`${m.id}\` diz vir de \`upstream/\` e não diz de que arquivo se lê a versão`,
        };
      }
      return {
        ...base,
        veredito: "carimbado-no-upstream",
        head: null,
        origemMain: null,
        atrasPor: null,
        comoSeDiz:
          `\`${m.id}\` tem a procedência carimbada em \`${onde}\`, que é versionado aqui e ` +
          "intocável (§3) — não há origem a consultar, e isso NÃO é o mesmo que não medido",
      };
    }

    const repo = m.procedencia.repo;
    const c = repo === null ? undefined : origens.get(repo);
    if (repo === null || c === undefined) {
      return {
        ...base,
        veredito: "nao-medida",
        head: null,
        origemMain: null,
        atrasPor: null,
        comoSeDiz:
          `\`${m.id}\` é lido por caminho e a origem do repositório dele não foi medida. ` +
          "NÃO MEDIDO, e isso não é o mesmo que em dia (D23, D241)",
      };
    }

    return {
      ...base,
      veredito: "medida-contra-a-origem",
      head: c.head,
      origemMain: c.origemMain,
      atrasPor: c.atrasPor,
      comoSeDiz: `\`${m.id}\` vem de ${c.oQueIssoQuerDizer}`,
    };
  });
}
