/**
 * A tradução: urbanismo → vocabulário do motor.
 *
 * **Este é o único arquivo do adaptador onde os nomes do Symbios aparecem.** É o
 * ponto de isolamento da especificação: trocar o Symbios por outro motor de rede
 * viária deve tocar aqui e em `motor.ts`, e em nada mais.
 *
 * # O que foi decidido, e por quê
 *
 * Os defaults do upstream — via principal a cada 40 m, local a cada 15 m — são de
 * cidade de jogo. O LAB-00 mediu o que eles produzem: 1 563 "quadras" de área
 * mediana 97 m², que é tamanho de lote. Eles **não vazam** para a interface do
 * adaptador; quem não passa parâmetro recebe 200 × 80 m, que a mesma medição
 * mostrou dar quadras de 3 439 m² medianos e rodar 37× mais rápido.
 *
 * Os parâmetros que o urbanista **não** deve ter de conhecer são derivados do
 * espaçamento, não fixados: passo de integração, raio de snap, filetes e
 * tolerância de simplificação todos escalam com o tamanho da quadra. Fixá-los
 * faria o adaptador funcionar numa escala e falhar nas outras.
 */
import {
  PARAMETROS_PADRAO,
  type Parametros,
  type ParametrosResolvidos,
} from "./contrato.ts";

/** O pedido que o módulo WebAssembly espera, já no vocabulário do motor. */
export interface PedidoMotor {
  nx: number;
  ny: number;
  celula_m: number;
  seed: number;
  dist_principal_m: number;
  dist_local_m: number;
  passo_integracao_m: number;
  raio_snap_m: number;
  inercia_tracador: number;
  max_passos_traco: number;
  tolerancia_rdp_m: number;
  raio_filete_principal_m: number;
  raio_filete_local_m: number;
  segmentos_filete: number;
  passes_suavizacao_cota: number;
  rampa_maxima: number;
  tolerancia_convergencia: number;
}

/** Preenche o que faltou e recusa o que não faz sentido. */
export function resolverParametros(p: Parametros = {}): ParametrosResolvidos {
  const r: ParametrosResolvidos = { ...PARAMETROS_PADRAO, ...limparIndefinidos(p) };

  const positivo = (nome: keyof ParametrosResolvidos, v: number) => {
    if (!Number.isFinite(v) || v <= 0) {
      throw new Error(`${nome} precisa ser um número positivo; veio ${v}`);
    }
  };
  positivo("espacamentoPrincipal_m", r.espacamentoPrincipal_m);
  positivo("espacamentoLocal_m", r.espacamentoLocal_m);
  positivo("rampaMaxima_pct", r.rampaMaxima_pct);
  positivo("faixaDominio_m", r.faixaDominio_m);
  positivo("passoGrade_m", r.passoGrade_m);

  if (r.espacamentoLocal_m > r.espacamentoPrincipal_m) {
    throw new Error(
      "a via local não pode estar mais espaçada que a principal " +
        `(local ${r.espacamentoLocal_m} m, principal ${r.espacamentoPrincipal_m} m)`,
    );
  }
  if (r.espacamentoLocal_m < r.faixaDominio_m * 2) {
    throw new Error(
      `espaçamento local de ${r.espacamentoLocal_m} m não cabe duas caixas de ` +
        `${r.faixaDominio_m} m — a quadra nasceria menor que as ruas que a cercam`,
    );
  }
  return r;
}

/** `{ a: undefined }` sobrescreveria o padrão com `undefined`; aqui não. */
function limparIndefinidos(p: Parametros): Parametros {
  return Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined));
}

/**
 * Traduz os parâmetros de urbanismo para o pedido do motor.
 *
 * Cada derivação abaixo tem uma razão, e as razões são o conteúdo desta função:
 *
 * - **passo de integração** — um vigésimo do espaçamento local, entre 1 e 5 m. É
 *   o passo do integrador RK2 que traça a streamline: grande demais corta curva,
 *   pequeno demais multiplica nós (e o estágio de racionalização é O(N²), então
 *   nó a mais custa quadrado). Um vigésimo dá ~20 pontos por vão de quadra.
 * - **raio de snap** — 60 % da caixa da via. Dois traços que passam mais perto
 *   que isso são a mesma rua, e têm de virar um nó só; snap maior que a caixa
 *   começaria a fundir ruas que de fato são duas.
 * - **tolerância RDP** — um décimo da caixa. Endireita o tremido do traçador sem
 *   cortar curva de verdade: 0,84 m numa caixa de 8,4 m é menos que a precisão da
 *   própria curva de nível.
 * - **filetes** — raio de curva de concordância. Proporcionais ao espaçamento (um
 *   décimo do principal, um oitavo do local), com piso de 6 m, que é a ordem do
 *   raio de giro de um veículo de serviço em esquina urbana.
 * - **passos de traço** — o traço precisa poder cruzar a gleba inteira; daí o
 *   limite vir da diagonal do mundo dividida pelo passo, com folga de 50 %.
 *   Fixar 300 (o default do upstream) truncaria via em gleba grande.
 */
export function traduzirParaMotor(
  p: ParametrosResolvidos,
  grade: { nx: number; ny: number; celula_m: number },
  seed: number,
): PedidoMotor {
  const caixa = p.faixaDominio_m;
  const passo = Math.min(5, Math.max(1, p.espacamentoLocal_m / 20));
  const diagonal = Math.hypot(grade.nx * grade.celula_m, grade.ny * grade.celula_m);

  return {
    nx: grade.nx,
    ny: grade.ny,
    celula_m: grade.celula_m,
    seed,
    dist_principal_m: p.espacamentoPrincipal_m,
    dist_local_m: p.espacamentoLocal_m,
    passo_integracao_m: passo,
    raio_snap_m: caixa * 0.6,
    // O default do upstream (0,8). Momento alto resiste ao ruído do relevo
    // interpolado, que é exatamente o que uma curva de nível reamostrada tem.
    inercia_tracador: 0.8,
    max_passos_traco: Math.ceil((diagonal / passo) * 1.5),
    tolerancia_rdp_m: caixa / 10,
    raio_filete_principal_m: Math.max(6, p.espacamentoPrincipal_m / 10),
    raio_filete_local_m: Math.max(6, p.espacamentoLocal_m / 8),
    segmentos_filete: 6,
    passes_suavizacao_cota: 10,
    // A conversão de porcento para fração. O motor pensa em 0,10; o urbanista,
    // em 10 %.
    rampa_maxima: p.rampaMaxima_pct / 100,
    // O upstream documenta que 0,0 dá saída bit-idêntica à de antes da #63; o
    // default dele é 1e-2. Mantido o default: a convergência antecipada é o que
    // torna a racionalização viável, e o determinismo provado no LAB-00 foi
    // medido com ela ligada.
    tolerancia_convergencia: 1e-2,
  };
}
