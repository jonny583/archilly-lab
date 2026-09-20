/**
 * REGISTRO DE MOTORES — a peça que a tela unificada monta em volta. (LAB-06)
 *
 * # Para quem instala isto
 *
 * Esta peça é **para o Archilly Generate**, e é a sessão dele (GU-03) que a
 * instala. Ela foi escrita no Laboratório e vive fora de `external-engines/` de
 * propósito: **essa pasta inteira pode ser apagada**, e esta peça continua de
 * pé. Ver `README.md` ao lado.
 *
 * # O que ela resolve, e o que ela recusa a resolver
 *
 * A decisão de família (D68) diz: vários motores sob a mesma tela, **todos
 * visíveis e ligados por padrão**, **motor padrão = o do Laboratório de
 * Parcelamento**, **escolha do usuário salva**, e **só entra no ranking
 * candidata aprovada pelo Validator** — reprovada aparece **com o motivo**, não
 * com o resultado.
 *
 * Isto aqui é a parte que **não é tela**: o registro, o estado, e a regra do
 * ranking. Cor, ordem na página e onde fica o botão são do Generate.
 *
 * # As três regras do ranking, e por que a terceira existe
 *
 * 1. **Só entra quem o Validator aprova.** Sem versão leve e sem limiar mais
 *    frouxo por o motor ser de fora — é a mesma régua do motor da casa.
 * 2. **A reprovada aparece com o MOTIVO, nunca com o resultado.** O desenho
 *    dela não vai junto. Mostrar a geometria reprovada é convidar alguém a
 *    usá-la "só para ver", e o que se vê vira o que se aprova.
 * 3. **Nunca um ranking vazio em silêncio.** Se todas reprovarem, a tela diz
 *    **isso**, e mostra os motivos. Uma lista vazia sem explicação é lida como
 *    "o sistema não achou nada", quando o que houve foi "achou quatro e
 *    reprovou as quatro" — que é informação, e das boas.
 *
 * # O que esta peça NÃO importa, e é a prova de que o Lab pode sumir
 *
 * Nada de `external-engines/`, nada de `@symbios`, nada de `@testfit`, nada da
 * esteira. Os tipos abaixo são declarados **aqui**, não importados: quem
 * instalar a peça liga nela os motores que tiver, e o Laboratório é só um dos
 * lugares de onde eles podem vir. Um teste confere isso lendo os `import` deste
 * arquivo (`tests/entrega.test.ts`).
 */

/** O que o motor diz sobre si. Ver `CONTRATO_MOTOR_UNIFICADO_v1.md`, §5. */
export interface CapacidadesDoMotor {
  id: string;
  nome: string;
  versao: string;
  entrega: "lote" | "quadra";
  geometrias: string[];
  [outras: string]: unknown;
}

/** Uma coisa que o motor não soube fazer. Ver o contrato, §7. */
export interface NaoAtendidoDoMotor {
  campo: string;
  oQueChegou: string;
  postura: "recusei" | "ignorei" | "substitui";
  consequencia: string;
}

/** O que o motor devolve. Ver o contrato, §4. */
export interface ResultadoDoMotor {
  saida: unknown;
  indicadores: Record<string, number | null>;
  semente: number | null;
  geometria: string | null;
  naoAtendido: NaoAtendidoDoMotor[];
  ms: number;
}

/** Um motor que cumpre a porta. */
export interface MotorNaPorta {
  capacidades(): CapacidadesDoMotor;
  gerar(entrada: never): ResultadoDoMotor;
}

/**
 * O veredito do Validator sobre uma candidata.
 *
 * Quem instala a peça liga aqui o Validator **do Generate**. A peça não julga
 * nada por conta própria — e não poderia: o Lab não tem Validator, por decisão
 * (D20).
 */
export interface Veredito {
  aprovada: boolean;
  /** Por que reprovou, em português, para pessoa. Vazio quando aprovou. */
  motivos: string[];
  /** A nota do Judge, para ordenar as aprovadas. Maior é melhor. */
  nota: number | null;
}

/** O que a tela mostra de uma candidata aprovada. */
export interface CandidataAprovada {
  motorId: string;
  nome: string;
  geometria: string | null;
  nota: number | null;
  indicadores: Record<string, number | null>;
  /** O desenho. Só existe em candidata aprovada. */
  resultado: ResultadoDoMotor;
  /** O que o motor não soube fazer — aparece ao lado, como ressalva. */
  ressalvas: NaoAtendidoDoMotor[];
  ms: number;
}

/**
 * O que a tela mostra de uma candidata reprovada.
 *
 * **Não tem `resultado`, e a falta é o ponto** — ver a regra 2 no cabeçalho.
 * O tipo não tem o campo; não é questão de lembrar de não mostrar.
 */
export interface CandidataReprovada {
  motorId: string;
  nome: string;
  geometria: string | null;
  /** Por que reprovou. Nunca vazio: reprovar sem motivo é defeito da peça. */
  motivos: string[];
  ressalvas: NaoAtendidoDoMotor[];
  ms: number;
}

/** O ranking pronto para a tela. */
export interface Ranking {
  /** Ordenadas pela nota do Judge, maior primeiro. */
  aprovadas: CandidataAprovada[];
  /** Na ordem em que correram. */
  reprovadas: CandidataReprovada[];
  /**
   * `true` quando **nenhuma** candidata passou.
   *
   * A tela **tem de dizer isso**, e mostrar as reprovadas com os motivos. Lista
   * vazia sem explicação é lida como "não achou nada" — e o que houve foi
   * "achou e reprovou".
   */
  nenhumaAprovada: boolean;
  /** A frase que a tela mostra quando `nenhumaAprovada`. Para pessoa. */
  recado: string | null;
  /** Motores registrados mas desligados pelo usuário — não correram. */
  desligados: string[];
}

/**
 * O estado que o usuário escolheu, e que o hospedeiro salva.
 *
 * # Por que ele guarda os DESLIGADOS, e não os ligados
 *
 * Guardar os ligados parece natural e **perde informação**: um motor que não
 * está na lista pode ser "o usuário desligou" ou "não existia quando isto foi
 * salvo", e as duas coisas pedem respostas opostas — a primeira tem de ser
 * respeitada, a segunda tem de nascer ligada (D68).
 *
 * Guardando os **desligados** a ambiguidade some: quem está na lista fica
 * desligado, quem não está fica ligado. Motor novo nasce ligado sem ninguém
 * precisar decidir nada, e a escolha do usuário sobrevive à chegada dele.
 */
export interface EstadoDoUsuario {
  /** Ids dos motores que o usuário desligou. */
  desligados: string[];
  /** Id do motor padrão. Vazio quando não há nenhum ligado. */
  padrao: string;
}

/** Como um motor aparece na lista da tela. */
export interface MotorNaLista {
  id: string;
  nome: string;
  versao: string;
  ligado: boolean;
  padrao: boolean;
  entrega: "lote" | "quadra";
  geometrias: string[];
}

/**
 * O id do motor que nasce como padrão, pela D68.
 *
 * *(`parcelamento` é o id do motor do **Laboratório de Parcelamento**. O nome de
 * repositório dele é interno e não aparece em texto voltado ao usuário.)*
 */
export const PADRAO_DE_FABRICA = "parcelamento";

/** O registro de motores. */
export class RegistroDeMotores {
  private readonly motores = new Map<string, MotorNaPorta>();
  private readonly desligadosPeloUsuario = new Set<string>();
  private padraoEscolhido: string | null = null;

  /**
   * Registra um motor.
   *
   * **Todos nascem ligados** — é o que a D68 manda. Quem quiser um motor
   * desligado por padrão desliga-o depois de registrar, e isso fica no estado
   * do usuário, não escondido no registro.
   */
  registrar(motor: MotorNaPorta): void {
    const c = motor.capacidades();
    if (!c.id) throw new Error("motor sem id não entra no registro: a tela o usa para separar os motores");
    if (this.motores.has(c.id)) {
      throw new Error(`já há um motor com o id "${c.id}"; dois motores com o mesmo id se confundem na tela`);
    }
    this.motores.set(c.id, motor);
  }

  /** Os motores, como a tela os lista. */
  listar(): MotorNaLista[] {
    const padrao = this.padrao();
    return [...this.motores.values()].map((m) => {
      const c = m.capacidades();
      return {
        id: c.id,
        nome: c.nome,
        versao: c.versao,
        ligado: !this.desligadosPeloUsuario.has(c.id),
        padrao: c.id === padrao,
        entrega: c.entrega,
        geometrias: c.geometrias,
      };
    });
  }

  /** O botão liga/desliga, por motor. */
  ligar(id: string): void {
    this.exigirRegistrado(id);
    this.desligadosPeloUsuario.delete(id);
  }

  /**
   * Desliga um motor.
   *
   * **Desligar o padrão é permitido**, e o padrão passa para o primeiro motor
   * ligado. Proibir seria prender o usuário a um motor que ele não quer ver só
   * porque alguém o marcou como padrão.
   */
  desligar(id: string): void {
    this.exigirRegistrado(id);
    this.desligadosPeloUsuario.add(id);
  }

  /** Escolhe o motor padrão. */
  definirPadrao(id: string): void {
    this.exigirRegistrado(id);
    this.padraoEscolhido = id;
  }

  /**
   * Qual é o padrão agora.
   *
   * A ordem: o que o usuário escolheu, se ainda estiver ligado; senão o
   * `PADRAO_DE_FABRICA`, se estiver registrado e ligado; senão o primeiro motor
   * ligado; e `null` se não houver nenhum ligado.
   */
  padrao(): string | null {
    const ligados = [...this.motores.keys()].filter((id) => !this.desligadosPeloUsuario.has(id));
    if (ligados.length === 0) return null;
    if (this.padraoEscolhido && ligados.includes(this.padraoEscolhido)) return this.padraoEscolhido;
    if (ligados.includes(PADRAO_DE_FABRICA)) return PADRAO_DE_FABRICA;
    return ligados[0] ?? null;
  }

  /**
   * O estado do usuário, para o hospedeiro salvar.
   *
   * É um objeto simples de propósito: o Generate o guarda onde guarda o resto
   * das preferências, e a peça não sabe nem precisa saber onde.
   */
  estadoDoUsuario(): EstadoDoUsuario {
    return { desligados: this.idsDesligados(), padrao: this.padrao() ?? "" };
  }

  /**
   * Devolve o registro ao estado que o usuário tinha salvo.
   *
   * **Motor novo, que não estava no estado salvo, nasce LIGADO** — é a D68, e
   * sai de graça por o estado guardar os desligados (ver `EstadoDoUsuario`).
   *
   * **Motor salvo que não existe mais não some em silêncio:** ele volta em
   * `esquecidos`. Se um dia reaparecer, quem instala decide se a escolha antiga
   * ressuscita — a peça não decide isso sozinha.
   */
  aplicarEstado(estado: EstadoDoUsuario): { esquecidos: string[] } {
    const conhecidos = new Set(this.motores.keys());
    const esquecidos = [
      ...estado.desligados.filter((id) => !conhecidos.has(id)),
      ...(estado.padrao && !conhecidos.has(estado.padrao) ? [estado.padrao] : []),
    ];

    this.desligadosPeloUsuario.clear();
    for (const id of estado.desligados) {
      if (conhecidos.has(id)) this.desligadosPeloUsuario.add(id);
    }
    this.padraoEscolhido = conhecidos.has(estado.padrao) ? estado.padrao : null;

    return { esquecidos: [...new Set(esquecidos)] };
  }

  private exigirRegistrado(id: string): void {
    if (!this.motores.has(id)) {
      throw new Error(`não há motor registrado com o id "${id}"`);
    }
  }

  /** Os motores que vão correr: os registrados e ligados. */
  ligados(): MotorNaPorta[] {
    return [...this.motores.entries()]
      .filter(([id]) => !this.desligadosPeloUsuario.has(id))
      .map(([, m]) => m);
  }

  /** Os ids desligados pelo usuário. */
  idsDesligados(): string[] {
    return [...this.motores.keys()].filter((id) => this.desligadosPeloUsuario.has(id));
  }
}

/**
 * Roda os motores ligados e monta o ranking.
 *
 * `julgar` é o Validator **do Generate**, ligado por quem instala a peça. A peça
 * não julga por conta própria — e é isso que a mantém honesta: ela não tem como
 * afrouxar a régua nem para o motor da casa nem para o de fora.
 *
 * **Motor que estoura não derruba os outros.** O contrato o proíbe (§7), mas a
 * peça não confia: ela envolve cada `gerar` e transforma a exceção em reprovação
 * com o motivo. Numa tela com vários motores, um que caia levando os outros é o
 * pior defeito possível — e ele já aconteceu uma vez, com o Symbios em gleba
 * sem relevo.
 */
export function montarRanking(
  registro: RegistroDeMotores,
  entrada: never,
  julgar: (r: ResultadoDoMotor, c: CapacidadesDoMotor) => Veredito,
): Ranking {
  const aprovadas: CandidataAprovada[] = [];
  const reprovadas: CandidataReprovada[] = [];

  for (const motor of registro.ligados()) {
    const c = motor.capacidades();
    let r: ResultadoDoMotor;
    try {
      r = motor.gerar(entrada);
    } catch (erro) {
      reprovadas.push({
        motorId: c.id,
        nome: c.nome,
        geometria: null,
        motivos: [
          `o motor falhou ao gerar: ${erro instanceof Error ? erro.message : String(erro)}`,
        ],
        ressalvas: [],
        ms: 0,
      });
      continue;
    }

    // Recusa declarada pelo próprio motor: ele não gerou, e disse por quê.
    const recusa = r.naoAtendido.filter((x) => x.postura === "recusei");
    if (r.saida === null || recusa.length > 0) {
      reprovadas.push({
        motorId: c.id,
        nome: c.nome,
        geometria: r.geometria,
        motivos: recusa.length
          ? recusa.map((x) => x.consequencia)
          : ["o motor não produziu desenho para esta gleba"],
        ressalvas: r.naoAtendido.filter((x) => x.postura !== "recusei"),
        ms: r.ms,
      });
      continue;
    }

    const v = julgar(r, c);
    if (!v.aprovada) {
      reprovadas.push({
        motorId: c.id,
        nome: c.nome,
        geometria: r.geometria,
        // Reprovar sem motivo é defeito da peça, não do motor.
        motivos: v.motivos.length ? v.motivos : ["reprovada pelo Validator, sem motivo declarado"],
        ressalvas: r.naoAtendido,
        ms: r.ms,
      });
      continue;
    }

    aprovadas.push({
      motorId: c.id,
      nome: c.nome,
      geometria: r.geometria,
      nota: v.nota,
      indicadores: r.indicadores,
      resultado: r,
      ressalvas: r.naoAtendido,
      ms: r.ms,
    });
  }

  aprovadas.sort((a, b) => (b.nota ?? -Infinity) - (a.nota ?? -Infinity));

  const nenhumaAprovada = aprovadas.length === 0;
  return {
    aprovadas,
    reprovadas,
    nenhumaAprovada,
    recado: nenhumaAprovada ? recadoDeRankingVazio(reprovadas, registro) : null,
    desligados: registro.idsDesligados(),
  };
}

/**
 * A frase que a tela mostra quando nenhuma candidata passou.
 *
 * Escrita para pessoa, e ela distingue três situações que não se parecem:
 * ninguém correu porque está tudo desligado; correram e todas reprovaram;
 * não há motor registrado nenhum.
 */
function recadoDeRankingVazio(
  reprovadas: CandidataReprovada[],
  registro: RegistroDeMotores,
): string {
  if (registro.listar().length === 0) {
    return "Nenhum motor está instalado nesta tela.";
  }
  if (reprovadas.length === 0) {
    return (
      "Todos os motores estão desligados. Ligue ao menos um para ver propostas " +
      `de parcelamento (${registro.idsDesligados().length} desligado(s)).`
    );
  }
  return (
    `Nenhuma das ${reprovadas.length} propostas passou na conferência, e por isso ` +
    "nenhuma pode ser usada. Os motivos de cada uma estão abaixo — o desenho " +
    "reprovado não é mostrado de propósito."
  );
}
