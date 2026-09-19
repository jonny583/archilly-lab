/**
 * A PORTA ÚNICA — o que qualquer motor precisa cumprir para rodar sob a tela
 * comum de parcelamento. (LAB-14)
 *
 * Este arquivo é a forma executável do
 * [`docs/CONTRATO_MOTOR_UNIFICADO_v1.md`](../../../../docs/CONTRATO_MOTOR_UNIFICADO_v1.md).
 * O documento é a especificação; isto aqui é o que compila, e é ele que os três
 * motores implementam de verdade em `src/porta/motores/`.
 *
 * # A ideia em uma frase
 *
 * **Um motor entra pela porta declarando o que sabe fazer, e o que ele declara é
 * conferível medindo.** Capacidade que não se pode desmentir é propaganda.
 *
 * # As três partes
 *
 * 1. **`Capacidades`** — o que o motor diz sobre si. Cada campo foi escolhido
 *    por ser **falsificável**: existe um experimento que prova a declaração
 *    falsa. `leRelevo: false` se desmente rodando a mesma gleba com e sem
 *    relevo — se a saída mudar, a declaração mentiu.
 * 2. **`Entrada`** — o que chega. É a ENTRADA do contrato de motor v1, mais a
 *    separação que o LAB-13 mediu faltar: **via desenhada à mão** e **testada de
 *    frente** chegam hoje com o mesmo tipo, e o motor não tem como distingui-las.
 * 3. **`Resultado`** — o que volta. O parcelamento no contrato v1, os
 *    indicadores em **número cru**, e o campo que faltava: **o que o motor não
 *    soube fazer**.
 *
 * # Por que "não sei fazer" é campo obrigatório
 *
 * Medido no LAB-13, nas cinco glebas: três dos quatro concorrentes **ignoram o
 * relevo**, os quatro **ignoram a atração**, um **não parcela em lote** e outro
 * **precisa do aparo do Lab** para o contrato aceitar o arquivo. Nenhuma dessas
 * faltas estava declarada em lugar nenhum — todas foram descobertas medindo, uma
 * a uma, e escritas à mão no adaptador de cada um.
 *
 * Numa tela com vários motores lado a lado isso deixa de ser inconveniente e
 * vira erro de leitura: o urbanista compara duas propostas achando que os dois
 * motores receberam a mesma coisa. **Ignorar em silêncio é o que a porta
 * proíbe** — ignorar declarando é permitido, e às vezes é a resposta certa.
 */
import type { EntradaMinima } from "../gleba-v1.ts";

/** Um ponto do plano, em metros. */
export interface Ponto {
  x: number;
  y: number;
}

/**
 * Os partidos de traçado que um motor pode oferecer.
 *
 * A lista é **aberta**: um motor pode declarar um nome que não está aqui, e a
 * tela o mostra como veio. Fechar o vocabulário obrigaria o contrato a mudar
 * toda vez que um motor inventa um partido, e o contrato mudar por causa de um
 * motor é o contrário do que ele serve.
 */
export type Geometria =
  | "ortogonal"
  | "espinha"
  | "pente"
  | "grelha"
  | "cluster"
  | "organico"
  | "radial"
  | "superquadra"
  | "tensorial"
  | (string & {});

/** O que o motor entrega como unidade final. */
export type Entrega = "lote" | "quadra";

/**
 * O que o motor diz sobre si mesmo.
 *
 * **Cada campo é falsificável**, e o `tests/porta.test.ts` falsifica todos: a
 * declaração é conferida contra o comportamento medido, motor por motor. Um
 * motor que declarar errado **quebra o teste**, não passa despercebido.
 */
export interface Capacidades {
  /** Identificação, para a tela e para o relatório. */
  id: string;
  nome: string;
  versao: string;

  /**
   * O motor entrega **lote** ou para na **quadra**?
   *
   * *Como se desmente:* `lote` com saída sem lote nenhum, ou `quadra` com lotes.
   *
   * Um motor de quadra **não é inferior** — ele entrega a etapa anterior. Quem
   * o puser na tela precisa saber que o lote virá de outro lugar (é o caso do
   * Symbios, cuja subdivisão é do Lab, D50).
   */
  entrega: Entrega;

  /**
   * O traçado muda quando o relevo muda?
   *
   * *Como se desmente:* roda a mesma gleba com e sem curvas de nível. Declarou
   * `false` e a saída mudou — mentiu. Declarou `true` e a saída ficou idêntica —
   * mentiu também.
   */
  leRelevo: boolean;

  /**
   * O motor segue a via que o urbanista desenhou à mão dentro da gleba?
   *
   * *Como se desmente:* dá uma via desenhada e mede a aderência. Declarou
   * `true` e não seguiu — mentiu.
   */
  respeitaViaDesenhada: boolean;

  /**
   * O motor dá **lote de frente** para a testada de frente — a linha onde a
   * gleba encosta numa rua que já existe?
   *
   * É a outra metade do achado do LAB-13, §2: testada de frente não é via
   * desenhada, e o motor não deve pôr rua em cima dela.
   */
  respeitaTestadaDeFrente: boolean;

  /** O traçado nasce do ponto de acesso declarado na entrada? */
  respeitaAcesso: boolean;

  /** O motor tira da conta a restrição que desconta (APP, reserva legal)? */
  respeitaRestricao: boolean;

  /**
   * A semente muda o resultado?
   *
   * *Como se desmente:* duas sementes diferentes. Declarou `true` e as duas
   * saídas são idênticas — a semente não é lida. Declarou `false` e diferem —
   * há aleatório não declarado, que é pior.
   */
  aceitaSemente: boolean;

  /**
   * Mesma entrada, mesma saída, sempre.
   *
   * *Como se desmente:* roda duas vezes e compara a SAÍDA inteira. Não a
   * contagem de lotes: duas geometrias diferentes dão o mesmo número, e foi
   * assim que a régua de determinismo errou no LAB-08.
   */
  determinista: boolean;

  /** O motor calcula greide (cota ao longo da via)? */
  calculaGreide: boolean;

  /**
   * O motor **precisa** de relevo para rodar?
   *
   * Nasceu de o teste quebrar: o Symbios **estoura** numa gleba sem curva de
   * nível — *"tem 0 vértices cotados; o mapa de alturas pede pelo menos 3"*.
   * Não é defeito dele; é exigência, e exigência não declarada vira tela em
   * branco na frente do urbanista.
   *
   * Quem declara `true` e recebe gleba sem relevo **recusa**, pela porta, em vez
   * de estourar. Ver `Postura`.
   */
  exigeRelevo: boolean;

  /** Os partidos de traçado que ele oferece. Ao menos um. */
  geometrias: Geometria[];
}

/**
 * O que chega ao motor.
 *
 * É a ENTRADA do contrato de motor v1 — `terreno`, `restricoes`, `atracoes`,
 * `relevo` e `parametros` —, com **uma coisa a mais e uma separação**:
 *
 * - `viasDesenhadas` e `testadasDeFrente` chegam **separadas**. No contrato v1
 *   as duas vêm como `atracoes[].tipo = "via_existente"` e o motor não tem como
 *   distingui-las. Ver o LAB-13, §2, e a §3 do documento;
 * - `semente` é explícita, e o motor que não a lê **declara** isso em
 *   `Capacidades.aceitaSemente`, em vez de a ignorar em silêncio.
 */
export interface Entrada {
  /** A ENTRADA v1 inteira, como chegou. */
  v1: EntradaMinima;
  /** Rua traçada à mão DENTRO da gleba. O motor deve segui-la. */
  viasDesenhadas: Ponto[][];
  /** Linha sobre a divisa. O motor deve dar frente para ela, nunca rua. */
  testadasDeFrente: Ponto[][];
  /** A semente da rodada. */
  semente: number;
  /** O carimbo de tempo que vai na saída — fixo, para a saída ser comparável. */
  geradoEm: string;
}

/**
 * O que o motor faz quando não sabe fazer algo — e as três respostas legítimas.
 *
 * A quarta, **ignorar em silêncio**, é a única proibida.
 */
export type Postura =
  /** Não gerou nada, e disse por quê. A tela não mostra candidata. */
  | "recusei"
  /** Gerou ignorando o que não sabe ler, e disse o que ignorou. */
  | "ignorei"
  /** Gerou pondo outra coisa no lugar, e disse o quê. */
  | "substitui";

/** Uma coisa que o motor não soube fazer, dita por inteiro. */
export interface NaoAtendido {
  /** O campo da entrada que ele não soube usar. */
  campo: string;
  /** O que chegou nele, em uma linha. */
  oQueChegou: string;
  /** O que o motor fez a respeito. */
  postura: Postura;
  /** O que isso custa a quem lê o resultado. Em português, para pessoa. */
  consequencia: string;
}

/**
 * Os indicadores, em **número cru**.
 *
 * Número cru, e não texto formatado, porque quem formata é a tela — §9.3 do
 * Padrão. O que o motor não mede sai `null`, **nunca zero**: zero é uma medição,
 * `null` é "não medido" (D23). O Symbios mede greide e o do Parcelamento não; se
 * os dois saíssem zero, a tela diria que os dois medem e que um deu plano.
 */
export interface Indicadores {
  lotes: number | null;
  areaPrivativa_m2: number | null;
  areaViaria_m2: number | null;
  comprimentoDeVia_m: number | null;
  quadras: number | null;
  /**
   * A **maior rampa média** entre as vias, em porcento. `null` quando o motor
   * não calcula greide.
   *
   * **Média, e não máxima, porque o contrato v1 não carrega a máxima.** A SAÍDA
   * tem `vias[].rampaMedia_pct` e nada mais; `rampaMaxima_pct` só existe na
   * ENTRADA, como o limite que o usuário pede. Nenhum motor consegue reportar o
   * pico por este contrato — e o pico é o que reprova: o LAB-02 mediu 161 % num
   * cruzamento, diluído numa média mansa.
   *
   * **É achado aberto para o Generate**, já repassado pelo chat, e a razão de o
   * documento pedir `rampaMaxima_pct` por via na v2.
   */
  rampaMediaMaxima_pct: number | null;
}

/** O que volta do motor. */
export interface Resultado {
  /** O parcelamento na SAÍDA do contrato de motor v1. `null` se recusou. */
  saida: unknown;
  /** Os indicadores, crus. */
  indicadores: Indicadores;
  /** A semente efetivamente usada. `null` quando o motor não lê semente. */
  semente: number | null;
  /** Qual partido de traçado saiu, quando o motor tem mais de um. */
  geometria: Geometria | null;
  /** O que ele não soube fazer. Vazio = fez tudo o que a entrada pedia. */
  naoAtendido: NaoAtendido[];
  /** Tempo de parede do motor, em milissegundos. */
  ms: number;
}

/**
 * A porta. Quem a implementa roda sob a tela comum.
 *
 * Duas funções, e a primeira é a que faz a diferença: **o motor se declara antes
 * de rodar**. A tela monta a lista de motores, mostra o que cada um sabe fazer e
 * decide o que pedir a quem — sem ter de rodar nenhum para descobrir.
 */
export interface MotorNaPorta {
  capacidades(): Capacidades;
  /**
   * Gera, e **nunca estoura**.
   *
   * Motor que lança exceção derruba a tela comum — e numa tela com vários
   * motores lado a lado ele derruba os outros junto. O que ele não consegue
   * fazer volta como `Resultado` com `postura: "recusei"` e a razão escrita.
   *
   * Isto não é preferência de estilo: o teste da porta roda a gleba plana
   * contra os quatro, e foi assim que se descobriu que o Symbios estourava.
   */
  gerar(entrada: Entrada): Resultado;
}

/**
 * Monta a `Entrada` da porta a partir de uma ENTRADA v1 crua.
 *
 * É aqui que a separação entre via desenhada e testada de frente acontece, **por
 * medição e não por nome** — a linha cujo ponto médio está a menos de 1 m da
 * divisa é testada de frente. Enquanto o contrato v1 não tiver o tipo separado,
 * é esta função que supre a falta, e o documento registra que ela é remendo.
 */
export function entradaDaPorta(
  v1: EntradaMinima,
  semente: number,
  geradoEm: string,
  separar: (e: EntradaMinima) => { desenhadas: Ponto[][]; testadasDeFrente: Ponto[][] },
): Entrada {
  const { desenhadas, testadasDeFrente } = separar(v1);
  return { v1, viasDesenhadas: desenhadas, testadasDeFrente, semente, geradoEm };
}
