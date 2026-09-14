/**
 * O interpolador DEFEITUOSO, replicado para poder ser medido. (LAB-03)
 *
 * # Por que este arquivo existe
 *
 * O LAB-01 achou o defeito e o corrigiu em `alturas.ts`: interpolar relevo a
 * partir de vértices de curva de nível **pelos k vizinhos mais próximos** faz
 * com que quase toda amostra tenha todos os vizinhos **na mesma curva**, e a
 * média deles é a cota daquela curva. O terreno vira bolo de casamento —
 * terraços planos com degraus — e mediu-se 85 % das células sobre um valor de
 * curva e 73 % da grade com gradiente exatamente zero.
 *
 * O LAB-07 mediu que o `criarModeloRelevo` do **Generate** ainda tem o defeito:
 * 49,8 % e 17,3 %.
 *
 * O que nunca foi medido — e é o que o LAB-03 pede — é **o que isso faz com a
 * rampa das ruas**. Para medir, é preciso rodar o mesmo motor, com a mesma
 * semente, sobre os dois relevos. Este arquivo é a versão errada, viva o
 * bastante para servir de controle.
 *
 * # Por que ele mora aqui e não em `alturas.ts`
 *
 * Um interpolador defeituoso dentro do código de produção é uma armadilha: mais
 * cedo ou mais tarde alguém o liga sem querer. Aqui ele é ferramenta de
 * medição, na pasta de medição, e o nome do arquivo diz o que ele é. É o mesmo
 * caminho que o LAB-07 seguiu ao replicar o `campoRelevo` do outro motor para
 * poder medi-lo sem escrever no repositório dele.
 *
 * # O que é replicado, exatamente
 *
 * A geometria da grade — passo, folga, inversão de eixo, máscara de dentro —
 * é **idêntica** à de `montarAlturas`. Só a função que decide a cota de uma
 * célula muda. Qualquer outra diferença faria a comparação medir duas coisas ao
 * mesmo tempo.
 */
import type { MapaDeAlturas } from "@symbios/alturas.ts";
import type { Terreno } from "@symbios/contrato.ts";
import { caixaDe, dentroDoPoligono } from "@symbios/geo.ts";

/**
 * Quantos vizinhos a média usa.
 *
 * Seis é o número do `criarModeloRelevo` do Generate, medido no LAB-07. Usar o
 * mesmo número faz deste controle não só "um interpolador ruim", mas **o
 * interpolador que o Generate usa hoje**.
 */
const K = 6;

/** Um vértice cotado. */
interface Cotado {
  x: number;
  y: number;
  z: number;
}

/** Média ponderada pelo inverso do quadrado da distância dos K mais próximos. */
function interpolarPorKVizinhos(pontos: Cotado[], x: number, y: number): number {
  // Os K melhores por seleção direta: a nuvem é grande, mas K é 6, e manter um
  // heap para seis elementos custaria mais em código do que economiza em tempo.
  const melhores: { d2: number; z: number }[] = [];
  for (const p of pontos) {
    const d2 = (p.x - x) ** 2 + (p.y - y) ** 2;
    if (melhores.length < K) {
      melhores.push({ d2, z: p.z });
      melhores.sort((a, b) => a.d2 - b.d2);
    } else if (d2 < melhores[K - 1]!.d2) {
      melhores[K - 1] = { d2, z: p.z };
      melhores.sort((a, b) => a.d2 - b.d2);
    }
  }
  if (!melhores.length) return 0;
  if (melhores[0]!.d2 < 1e-12) return melhores[0]!.z;

  let num = 0;
  let den = 0;
  for (const m of melhores) {
    const w = 1 / m.d2;
    num += m.z * w;
    den += w;
  }
  return den > 0 ? num / den : 0;
}

/**
 * O mesmo mapa que `montarAlturas` faria, com o interpolador errado.
 *
 * O corpo abaixo é `montarAlturas` linha a linha — inclusive a inversão de eixo
 * e a folga — trocando só a chamada de interpolação.
 */
export function montarAlturasPorKVizinhos(
  terreno: Terreno,
  passoGrade_m: number,
): MapaDeAlturas {
  const pontos: Cotado[] = [];
  for (const c of terreno.curvas) {
    for (const p of c.pontos) pontos.push({ x: p.x, y: p.y, z: c.cota_m });
  }
  if (pontos.length < 3) {
    throw new Error(
      `o terreno "${terreno.nome}" tem ${pontos.length} vértices cotados; ` +
        "o mapa de alturas pede pelo menos 3",
    );
  }

  const caixa = caixaDe(terreno.gleba.externo);
  const folga = Math.max(20, passoGrade_m * 4);
  const minX = caixa.minX - folga;
  const minY = caixa.minY - folga;
  const nx = Math.max(2, Math.ceil((caixa.maxX - caixa.minX + 2 * folga) / passoGrade_m));
  const ny = Math.max(2, Math.ceil((caixa.maxY - caixa.minY + 2 * folga) / passoGrade_m));

  const alturas = new Float32Array(nx * ny);
  const dentro = new Uint8Array(nx * ny);
  let fora = 0;
  let cotaMin = Infinity;
  let cotaMax = -Infinity;

  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const x = minX + (ix + 0.5) * passoGrade_m;
      const yArchilly = minY + (iy + 0.5) * passoGrade_m;
      const z = interpolarPorKVizinhos(pontos, x, yArchilly);

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
