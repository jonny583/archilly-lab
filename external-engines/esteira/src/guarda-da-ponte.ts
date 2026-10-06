/**
 * A GUARDA DA PONTE — o teste que reprova quando o Lab descarta o que o motor
 * publica. (LAB-25)
 *
 * # Por que este arquivo existe
 *
 * O §6 do `CLAUDE.md` manda **medir antes de atribuir**, e ele pegou o mesmo
 * ponto cego **três vezes**:
 *
 * | quando | o que eu ia dizer | o que era |
 * |---|---|---|
 * | D75 (LAB-17) | "o motor erra a classe da via desenhada" | a minha régua media **vértice**, não linha |
 * | D93/D94 (LAB-21) | "o motor entrega rampa de 161 %" | a minha régua media **dentro** do segmento |
 * | D98 (LAB-22) | "o Laboratório de Parcelamento não reporta o pico" | **esta ponte** jogava a medição dele no lixo |
 *
 * As três têm a mesma forma: **o Lab acusa o vizinho por um defeito do Lab.** E
 * a terceira é a pior, porque não houve engano de cálculo — houve um
 * **comentário envelhecendo em silêncio**. Em `volta.ts` estava escrito
 * *"o motor não calcula greide"*, e era verdade no dia em que foi escrito. O
 * motor passou a calcular no dia seguinte; o comentário continuou lá por quase
 * três semanas, e o Lab publicou `null` todo esse tempo.
 *
 * **Comentário não se revalida.** Teste se revalida. É só isso que este arquivo
 * é: a justificativa de cada campo descartado deixa de morar num comentário e
 * passa a morar num **inventário que o teste confere contra o motor rodando**.
 *
 * # As três regras
 *
 * 1. **`campo-vazio` — reprova.** Nenhum campo da SAÍDA pode sair `null`
 *    enquanto o motor publica valor para ele. É a regra que pega o D98, e ela
 *    **não depende do inventário estar certo**: o casamento é por nome, lido do
 *    objeto que o motor devolveu de verdade. Uma ponte que mentisse no
 *    inventário seria pega igual.
 * 2. **`campo-novo` — reprova.** Todo campo que o motor publica tem de estar no
 *    inventário, como `atravessa`, `traduzido`, `perda` ou `interno`. Quando o
 *    motor **ganha** um campo — que é exatamente o que aconteceu no D98 —, o
 *    inventário fica incompleto e o teste fica vermelho **no mesmo dia**, antes
 *    de qualquer relatório sair errado.
 * 3. **`mapa-velho` — avisa, não reprova.** Campo no inventário que não aparece
 *    em nenhuma amostra. Não reprova de propósito: campo opcional
 *    (`travado?`, `externo?`) falta legitimamente numa gleba e aparece noutra, e
 *    uma guarda que grita por isso é uma guarda que se aprende a desligar.
 *
 * # O que esta guarda NÃO faz
 *
 * - **Não confere a ida** (ENTRADA do contrato → entrada do motor). O mesmo
 *   mecanismo serve, e a falta está proposta ao chat na fila.
 * - **Não diz se o valor está certo**, só se ele foi perdido. Campo que
 *   atravessa com conta errada é outro problema, e a régua dele é o Validator.
 * - **Não alcança o que o motor não publica.** Capacidade que o motor tem e
 *   nenhum campo expõe continua invisível — é o limite que a porta do LAB-14 já
 *   declara.
 */

/** Para onde foi, na SAÍDA do contrato, um campo que o motor publica. */
export type Destino =
  /** Vira um campo da SAÍDA, com o mesmo sentido. */
  | { tipo: "atravessa"; contrato: string }
  /** Vira um campo da SAÍDA depois de conta ou tradução — o `como` diz qual. */
  | { tipo: "traduzido"; contrato: string; como: string }
  /** O contrato não tem onde pôr. Perda declarada, com o motivo. */
  | { tipo: "perda"; motivo: string }
  /** É mecânica interna do motor, não dado de desenho. */
  | { tipo: "interno"; motivo: string };

/** O inventário de um objeto do motor e as amostras que o provam. */
export interface ObjetoAuditado {
  /** Nome do objeto no vocabulário do motor: `via`, `lote`, `quadra`… */
  nome: string;
  /** Um destino para CADA campo que o motor publica neste objeto. */
  inventario: Record<string, Destino>;
  /** As amostras como o motor as devolveu. */
  doMotor: readonly Record<string, unknown>[];
  /**
   * As amostras correspondentes na SAÍDA do contrato, **na mesma ordem**.
   *
   * A ordem importa: a regra `campo-vazio` compara linha a linha, e é assim que
   * ela distingue *"o motor não mediu esta via"* de *"a ponte perdeu a medição
   * desta via"*.
   */
  doContrato: readonly Record<string, unknown>[];
}

export type Regra = "campo-vazio" | "campo-novo" | "mapa-velho";

/**
 * **As regras da ponte, como DADO.** (LAB-49) — mesma razão da `REGRAS_DA_IDA`: tipo não
 * existe em tempo de execução (D157), e sem a lista o detector de prova velha não pode
 * conferir o `porRegra` de uma prova contra o que a guarda sabe emitir. A trava de tipo
 * abaixo faz a lista e a união morrerem juntas.
 */
export const REGRAS_DA_PONTE = ["campo-vazio", "campo-novo", "mapa-velho"] as const;
type MesmaUniaoDaPonte<A extends string, B extends string> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : never
  : never;
const _regrasDaPonteConferidas: MesmaUniaoDaPonte<(typeof REGRAS_DA_PONTE)[number], Regra> = true;
void _regrasDaPonteConferidas;

/** As regras que reprovam. `mapa-velho` fica fora, de propósito. */
export const REGRAS_QUE_REPROVAM: readonly Regra[] = ["campo-vazio", "campo-novo"];

export interface Achado {
  ponte: string;
  objeto: string;
  campo: string;
  regra: Regra;
  /** Quantas amostras exibem o achado, e de quantas. */
  amostras: { comAchado: number; total: number };
  /** Uma frase que diz o que fazer, não só o que há. */
  diagnostico: string;
  /** Um valor de exemplo, para quem for consertar não precisar rodar nada. */
  exemplo?: unknown;
}

const vazio = (v: unknown): boolean => v === null || v === undefined;

/**
 * De qual campo do motor vem cada campo do contrato, pelo inventário.
 *
 * Um campo do contrato pode ter mais de uma fonte (duas medições que viram uma
 * só); todas entram, e basta uma trazer valor para a perda ser real.
 */
function fontesDoContrato(inventario: Record<string, Destino>): Map<string, string[]> {
  const fontes = new Map<string, string[]>();
  for (const [campo, d] of Object.entries(inventario)) {
    if (d.tipo !== "atravessa" && d.tipo !== "traduzido") continue;
    const lista = fontes.get(d.contrato) ?? [];
    lista.push(campo);
    fontes.set(d.contrato, lista);
  }
  return fontes;
}

/** Audita um objeto: as três regras, na ordem em que doem. */
export function auditarObjeto(ponte: string, o: ObjetoAuditado): Achado[] {
  const achados: Achado[] = [];
  const total = o.doMotor.length;
  const fontes = fontesDoContrato(o.inventario);

  // ── Regra 1 · campo-vazio ────────────────────────────────────────────────
  //
  // Para cada campo da SAÍDA que sai `null`, pergunta ao MOTOR se ele tinha o
  // número. O casamento é por nome — o do inventário quando há, e o nome
  // idêntico quando não há. O nome idêntico é o que torna a regra independente
  // do inventário: era assim que `rampaMedia_pct` estava nos dois lados (D98).
  const camposDoContrato = new Set<string>();
  for (const linha of o.doContrato) for (const k of Object.keys(linha)) camposDoContrato.add(k);

  for (const campoC of camposDoContrato) {
    const candidatos = fontes.get(campoC) ?? [];
    if (!candidatos.includes(campoC)) candidatos.push(campoC);
    let comAchado = 0;
    let exemplo: unknown;
    let culpado = "";
    const n = Math.min(o.doContrato.length, o.doMotor.length);
    for (let i = 0; i < n; i++) {
      if (!vazio(o.doContrato[i]![campoC])) continue;
      for (const campoM of candidatos) {
        const v = o.doMotor[i]![campoM];
        if (vazio(v)) continue;
        comAchado++;
        if (exemplo === undefined) {
          exemplo = v;
          culpado = campoM;
        }
        break;
      }
    }
    if (comAchado > 0) {
      achados.push({
        ponte,
        objeto: o.nome,
        campo: `${o.nome}[].${campoC}`,
        regra: "campo-vazio",
        amostras: { comAchado, total },
        diagnostico:
          `a SAÍDA sai \`null\` em ${comAchado} de ${total} ${o.nome}(s), e o motor publica ` +
          `\`${culpado}\` com valor nessas mesmas linhas. A ponte está descartando medição ` +
          "do motor — o campo tem de atravessar, ou o motivo tem de dizer por que o valor " +
          "do motor não serve (e aí ele não é perda, é recusa declarada)",
        exemplo,
      });
    }
  }

  // ── Regra 2 · campo-novo ─────────────────────────────────────────────────
  const publicados = new Map<string, unknown>();
  for (const linha of o.doMotor) {
    for (const [k, v] of Object.entries(linha)) {
      if (!publicados.has(k) || (vazio(publicados.get(k)) && !vazio(v))) publicados.set(k, v);
    }
  }
  for (const [campoM, exemplo] of publicados) {
    if (campoM in o.inventario) continue;
    achados.push({
      ponte,
      objeto: o.nome,
      campo: `${o.nome}[].${campoM}`,
      regra: "campo-novo",
      amostras: { comAchado: o.doMotor.filter((l) => campoM in l).length, total },
      diagnostico:
        `o motor publica \`${campoM}\` e o inventário da ponte não o conhece. Ou ele ` +
        "atravessa para a SAÍDA, ou entra no inventário como perda declarada com o motivo. " +
        "Campo novo do motor passando em silêncio é exatamente o D98",
      exemplo,
    });
  }

  // ── Regra 3 · mapa-velho (avisa) ─────────────────────────────────────────
  for (const campoM of Object.keys(o.inventario)) {
    if (publicados.has(campoM)) continue;
    achados.push({
      ponte,
      objeto: o.nome,
      campo: `${o.nome}[].${campoM}`,
      regra: "mapa-velho",
      amostras: { comAchado: 0, total },
      diagnostico:
        `o inventário descreve \`${campoM}\` e nenhuma amostra o traz. Pode ser campo ` +
        "opcional que esta gleba não exerce — por isso isto avisa e não reprova",
    });
  }

  return achados;
}

/** Audita uma ponte inteira. */
export function auditarPonte(ponte: string, objetos: readonly ObjetoAuditado[]): Achado[] {
  return objetos.flatMap((o) => auditarObjeto(ponte, o));
}

/** Só os achados que reprovam. É o que o teste olha. */
export const reprovam = (achados: readonly Achado[]): Achado[] =>
  achados.filter((a) => REGRAS_QUE_REPROVAM.includes(a.regra));

/** Uma linha por achado, legível no terminal e no relatório. */
export function emLinhas(achados: readonly Achado[]): string[] {
  return achados.map(
    (a) => `[${a.regra}] ${a.ponte} · ${a.campo} (${a.amostras.comAchado}/${a.amostras.total}) — ${a.diagnostico}`,
  );
}
