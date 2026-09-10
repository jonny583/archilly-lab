/**
 * Curvas de nível → mapa de alturas em grade regular.
 *
 * # Por que interpolar, e por quê assim
 *
 * O Geo entrega relevo como **curvas de nível** (feição `curva_nivel`, uma
 * polilinha por cota). O Symbios pede uma **grade regular**. A conversão é o
 * primeiro estágio do adaptador e, como todo estágio de reamostragem, é onde se
 * perde informação em silêncio se ninguém olhar.
 *
 * # O bolo de casamento, e por que este arquivo não usa k-vizinhos
 *
 * A primeira versão fazia inverso da distância sobre os **k vértices mais
 * próximos** — o método que o `criarModeloRelevo` do Generate
 * (`src/lib/engine/topografia.ts`) usa, e que parecia a escolha óbvia por ser a
 * mesma dos dois lados.
 *
 * Ela estava errada, e de um jeito que não aparece olhando o desenho. Os
 * vértices ao longo de uma curva de nível são muito mais próximos entre si do
 * que a distância entre duas curvas. Resultado: para quase toda célula, os seis
 * vizinhos mais próximos estão **todos na mesma curva**, e a média ponderada
 * deles é exatamente a cota daquela curva. O terreno interpolado vira um bolo de
 * casamento — terraços planos separados por degraus.
 *
 * Medido, antes da correção, no terreno de 50 ha com curvas de 2 m:
 * **85 % das células caíam a menos de 2 cm de um valor de curva** e
 * **73 % da grade tinha gradiente exatamente zero**. Um campo tensorial lido de
 * uma grade assim não segue a topografia: segue a borda dos degraus que a
 * interpolação inventou. Toda a premissa do motor — vias principais na curva de
 * nível, locais no gradiente — dependia de um relevo que não existia.
 *
 * O método correto para curvas de nível é **interpolar entre NÍVEIS distintos**,
 * não entre vértices. Para cada célula, acha-se a menor distância a cada cota
 * presente na vizinhança e interpola-se linearmente entre as duas cotas mais
 * próximas:
 *
 * ```text
 * z = (z1 · d2 + z2 · d1) / (d1 + d2)
 * ```
 *
 * Sobre uma curva, `d1 = 0` e o resultado é a cota dela — exato. Entre duas,
 * varia linearmente. O gradiente passa a existir em toda parte, que é a única
 * coisa que o campo tensorial pede.
 *
 * **O que NÃO foi feito:** triangulação (TIN) das curvas, que é o que software de
 * terraplenagem usa. A pergunta aqui não é "qual o volume de corte" — é "para
 * que lado desce o terreno". O erro deste método contra um TIN é menor que o erro
 * da própria curva de nível.
 *
 * # Fora da gleba
 *
 * A gleba não é retângulo e o Symbios gera sobre o retângulo inteiro. Três
 * caminhos foram considerados:
 *
 * 1. **rebaixar para um valor sentinela** — cria um penhasco artificial na borda
 *    da gleba, e penhasco é exatamente o que o campo tensorial segue. As vias
 *    passariam a acompanhar o contorno da gleba por artefato numérico, não por
 *    topografia;
 * 2. **deixar vazio (NaN)** — o motor não tem conceito de célula sem dado, e NaN
 *    propaga para a normal, matando o traçado;
 * 3. **extrapolar o relevo** — a mesma interpolação, sem olhar o polígono.
 *
 * Escolhido o 3: a grade é preenchida em toda a extensão, o relevo continua
 * suave na borda, e o adaptador devolve uma **máscara** do que caiu fora, para o
 * diagnóstico contar e o LAB-02 recortar. Extrapolar inventa relevo fora da
 * gleba, e inventar ali é inofensivo — aquela geometria vai ser descartada.
 */
import type { CurvaDeNivel, Poligono, Ponto, Terreno } from "./contrato.ts";
import { caixaDe, dentroDoPoligono } from "./geo.ts";

/**
 * Quantas cotas distintas a interpolação exige antes de parar de abrir anéis.
 *
 * Duas bastam para haver gradiente; a terceira existe para o caso de a célula
 * estar entre duas curvas de MESMA cota (o fundo de um vale, o topo de um morro),
 * onde só duas dariam gradiente zero de novo.
 */
const NIVEIS = 3;

/** O mapa de alturas pronto para o motor. */
export interface MapaDeAlturas {
  nx: number;
  ny: number;
  celula_m: number;
  /** Alturas em metros, row-major, `nx * ny` elementos. */
  alturas: Float32Array;
  /** `true` onde a célula cai dentro da gleba. */
  dentro: Uint8Array;
  /** Canto inferior-esquerdo do mundo do motor, em metros locais do Archilly. */
  origemMundo: Ponto;
  /** Fração de células fora da gleba, de 0 a 1. */
  fracaoFora: number;
  cotaMin: number;
  cotaMax: number;
}

/** Um ponto cotado extraído das curvas. */
interface PontoCotado {
  x: number;
  y: number;
  z: number;
  /** Índice da cota na lista de níveis distintos — o que separa curva de curva. */
  nivel: number;
}

/**
 * Grade de busca sobre os pontos cotados.
 *
 * Sem isso, cada célula varreria todos os vértices de todas as curvas: num
 * terreno de 50 ha com curvas de 1 m, são dezenas de milhares de vértices contra
 * centenas de milhares de células. A grade reduz a busca à vizinhança.
 */
class Indice {
  private readonly celulas = new Map<number, PontoCotado[]>();
  private readonly pontos: PontoCotado[];
  private readonly passo: number;
  private readonly minX: number;
  private readonly minY: number;
  private readonly nx: number;
  private readonly maxAnel: number;
  /** As cotas distintas, na ordem em que `PontoCotado.nivel` as indexa. */
  private readonly cotas: number[];
  /** Buffer de trabalho de `interpolar`, reaproveitado para não alocar por célula. */
  private readonly porNivel: Float64Array;

  constructor(pontos: PontoCotado[], passo: number, cotas: number[]) {
    this.pontos = pontos;
    this.cotas = cotas;
    this.porNivel = new Float64Array(cotas.length);
    const c = caixaDe(pontos);
    this.passo = Math.max(passo, 1e-6);
    this.minX = c.minX;
    this.minY = c.minY;
    this.nx = Math.max(1, Math.ceil((c.maxX - c.minX) / this.passo) + 1);
    const ny = Math.max(1, Math.ceil((c.maxY - c.minY) / this.passo) + 1);
    // Teto de anéis que cobre a grade toda: quem para a busca é o corte por
    // distância, não um limite arbitrário de anéis.
    this.maxAnel = this.nx + ny;
    for (const p of pontos) {
      const k = this.chave(p.x, p.y);
      const lista = this.celulas.get(k);
      if (lista) lista.push(p);
      else this.celulas.set(k, [p]);
    }
  }

  private chave(x: number, y: number): number {
    const ix = Math.floor((x - this.minX) / this.passo);
    const iy = Math.floor((y - this.minY) / this.passo);
    return iy * this.nx + ix;
  }

  /**
   * Interpola a cota em (x, y) entre as cotas distintas mais próximas.
   *
   * Ver a explicação do bolo de casamento no topo do arquivo: o que se busca não
   * são os pontos mais próximos, são os **níveis** mais próximos. A busca guarda a
   * menor distância encontrada para cada cota e para quando tem níveis suficientes
   * e o anel seguinte já não pode melhorar o mais próximo deles.
   */
  interpolar(x: number, y: number): number {
    // Menor distância² a cada nível visto até agora. `Infinity` = ainda não visto.
    const melhor = this.porNivel;
    melhor.fill(Infinity);
    let distintos = 0;
    let melhorGeral = Infinity;

    const ix = Math.floor((x - this.minX) / this.passo);
    const iy = Math.floor((y - this.minY) / this.passo);

    for (let anel = 0; anel <= this.maxAnel; anel++) {
      // Corte: nada no anel `anel` está a menos de `(anel - 1) * passo`. Com
      // níveis suficientes já achados e o mais próximo deles mais perto que isso,
      // nenhum anel adiante muda a resposta.
      if (distintos >= NIVEIS && anel > 1) {
        const minimoDoAnel = (anel - 1) * this.passo;
        if (minimoDoAnel * minimoDoAnel > melhorGeral) break;
      }
      for (let dy = -anel; dy <= anel; dy++) {
        for (let dx = -anel; dx <= anel; dx++) {
          if (anel > 0 && Math.abs(dx) !== anel && Math.abs(dy) !== anel) continue;
          const lista = this.celulas.get((iy + dy) * this.nx + (ix + dx));
          if (!lista) continue;
          for (const p of lista) {
            const d2 = (p.x - x) ** 2 + (p.y - y) ** 2;
            if (d2 >= melhor[p.nivel]!) continue;
            if (melhor[p.nivel] === Infinity) distintos++;
            melhor[p.nivel] = d2;
            // `melhorGeral` acompanha o pior dos níveis que já valem a pena, para
            // o corte acima; usar o melhor de todos pararia cedo demais.
            if (distintos >= NIVEIS) {
              melhorGeral = this.segundaMenor(melhor);
            }
          }
        }
      }
    }

    // Os dois níveis mais próximos, por distância.
    let i1 = -1;
    let i2 = -1;
    for (let i = 0; i < melhor.length; i++) {
      if (melhor[i] === Infinity) continue;
      if (i1 < 0 || melhor[i]! < melhor[i1]!) {
        i2 = i1;
        i1 = i;
      } else if (i2 < 0 || melhor[i]! < melhor[i2]!) {
        i2 = i;
      }
    }

    if (i1 < 0) return 0; // nuvem vazia — `montarAlturas` já recusa esse caso
    const d1 = Math.sqrt(melhor[i1]!);
    if (i2 < 0 || d1 < 1e-9) return this.cotas[i1]!;

    const d2 = Math.sqrt(melhor[i2]!);
    const z1 = this.cotas[i1]!;
    const z2 = this.cotas[i2]!;
    // Linear na distância: sobre a curva devolve a cota dela, entre duas varia
    // proporcionalmente. É a definição de interpolação entre curvas de nível.
    return (z1 * d2 + z2 * d1) / (d1 + d2);
  }

  /** A segunda menor distância do vetor — o critério de corte da busca. */
  private segundaMenor(v: Float64Array): number {
    let a = Infinity;
    let b = Infinity;
    for (const x of v) {
      if (x < a) {
        b = a;
        a = x;
      } else if (x < b) {
        b = x;
      }
    }
    return b;
  }
}

/**
 * Os vértices de todas as curvas, com o índice do nível de cada um.
 *
 * Várias curvas compartilham a mesma cota — um morro e outro morro na mesma
 * altura são duas polilinhas e um só nível. É a COTA que define o nível, não a
 * polilinha: é isso que faz a interpolação entre níveis funcionar quando a curva
 * se fecha em torno de um cume.
 */
function nuvem(curvas: CurvaDeNivel[]): { pontos: PontoCotado[]; cotas: number[] } {
  const indicePorCota = new Map<number, number>();
  const cotas: number[] = [];
  const pontos: PontoCotado[] = [];
  for (const c of curvas) {
    let nivel = indicePorCota.get(c.cota_m);
    if (nivel === undefined) {
      nivel = cotas.length;
      indicePorCota.set(c.cota_m, nivel);
      cotas.push(c.cota_m);
    }
    for (const p of c.pontos) pontos.push({ x: p.x, y: p.y, z: c.cota_m, nivel });
  }
  return { pontos, cotas };
}

/**
 * Monta o mapa de alturas de um terreno.
 *
 * A grade cobre a caixa envolvente da gleba mais uma margem. A margem existe
 * porque o traçador precisa de campo tensorial definido *em volta* da borda para
 * não terminar traço na beirada do mundo: sem folga, toda via morreria no limite
 * do retângulo e a rede chegaria truncada na divisa da gleba — que é justamente
 * onde ela tem de estar bem resolvida.
 */
export function montarAlturas(
  terreno: Terreno,
  passoGrade_m: number,
  margem_m = 0,
): MapaDeAlturas {
  const { pontos, cotas } = nuvem(terreno.curvas);
  if (pontos.length < 3) {
    throw new Error(
      `o terreno "${terreno.nome}" tem ${pontos.length} vértices cotados; ` +
        "o mapa de alturas pede pelo menos 3 — sem relevo o traçador degenera",
    );
  }
  if (cotas.length < 2) {
    throw new Error(
      `o terreno "${terreno.nome}" tem uma só cota (${cotas[0]} m) em todas as ` +
        "curvas: sem dois níveis não há gradiente, e o traçador degenera em grade",
    );
  }

  const caixa = caixaDe(terreno.gleba.externo);
  // Uma folga proporcional ao espaçamento das vias, com piso: o traçador precisa
  // de campo em volta da divisa.
  const folga = margem_m > 0 ? margem_m : Math.max(20, passoGrade_m * 4);
  const minX = caixa.minX - folga;
  const minY = caixa.minY - folga;
  const larguraM = caixa.maxX - caixa.minX + 2 * folga;
  const alturaM = caixa.maxY - caixa.minY + 2 * folga;

  const nx = Math.max(2, Math.ceil(larguraM / passoGrade_m));
  const ny = Math.max(2, Math.ceil(alturaM / passoGrade_m));

  const indice = new Indice(pontos, Math.max(passoGrade_m * 4, 10), cotas);
  const alturas = new Float32Array(nx * ny);
  const dentro = new Uint8Array(nx * ny);
  let fora = 0;
  let cotaMin = Infinity;
  let cotaMax = -Infinity;

  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      // Centro da célula, em metros locais do Archilly.
      const x = minX + (ix + 0.5) * passoGrade_m;
      const yArchilly = minY + (iy + 0.5) * passoGrade_m;
      const z = indice.interpolar(x, yArchilly);

      // A INVERSÃO DE EIXO. O Archilly tem y para o sul; o Symbios tem Z para o
      // norte visual. A linha `iy` da grade do motor corresponde à linha
      // `ny-1-iy` do Archilly. Fazer isso aqui, na escrita da grade, e não na
      // leitura do resultado, mantém o resto do adaptador com uma só convenção.
      const iMotor = (ny - 1 - iy) * nx + ix;
      alturas[iMotor] = z;
      const estaDentro = dentroDoPoligono({ x, y: yArchilly }, terreno.gleba);
      dentro[iMotor] = estaDentro ? 1 : 0;
      if (!estaDentro) fora++;
      if (z < cotaMin) cotaMin = z;
      if (z > cotaMax) cotaMax = z;
    }
  }

  return {
    nx,
    ny,
    celula_m: passoGrade_m,
    alturas,
    dentro,
    origemMundo: { x: minX, y: minY },
    fracaoFora: fora / (nx * ny),
    cotaMin,
    cotaMax,
  };
}

/**
 * Motor → Archilly: um ponto do mundo do Symbios de volta ao plano local.
 *
 * Desfaz a inversão de eixo aplicada em `montarAlturas`. É o inverso exato, e é
 * o que a prova de ida e volta verifica.
 */
export function paraArchilly(mapa: MapaDeAlturas, xMotor: number, zMotor: number): Ponto {
  const alturaMundo = mapa.ny * mapa.celula_m;
  return {
    x: mapa.origemMundo.x + xMotor,
    y: mapa.origemMundo.y + (alturaMundo - zMotor),
  };
}

/** Archilly → motor. Inverso de `paraArchilly`; existe para a prova. */
export function paraMotor(mapa: MapaDeAlturas, p: Ponto): { x: number; z: number } {
  const alturaMundo = mapa.ny * mapa.celula_m;
  return {
    x: p.x - mapa.origemMundo.x,
    z: alturaMundo - (p.y - mapa.origemMundo.y),
  };
}

/** A cota interpolada num ponto do plano local — para conferir contra o Geo. */
export function cotaEm(mapa: MapaDeAlturas, p: Ponto): number | null {
  const m = paraMotor(mapa, p);
  const ix = Math.floor(m.x / mapa.celula_m);
  const iz = Math.floor(m.z / mapa.celula_m);
  if (ix < 0 || iz < 0 || ix >= mapa.nx || iz >= mapa.ny) return null;
  return mapa.alturas[iz * mapa.nx + ix] ?? null;
}

/** A gleba ajuda a decidir se um ponto do motor está dentro. */
export function pontoDentroDaGleba(p: Ponto, gleba: Poligono): boolean {
  return dentroDoPoligono(p, gleba);
}
