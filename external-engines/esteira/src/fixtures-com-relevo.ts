/**
 * As glebas-padrão do Generate, com relevo, como FIXTURES do Lab. (LAB-03)
 *
 * # Por que elas precisam existir
 *
 * O LAB-02 mediu a consequência de um achado do LAB-07: as duas glebas-padrão
 * do Generate (`ensaio-47ha` e `geo-antonina`) têm `relevo` com `curvas: []` e
 * `cotas: null` — **nenhuma das duas carrega topografia**. O Symbios é um motor
 * de campo tensorial sobre mapa de alturas: sem cotas ele nem monta a grade, e
 * o adaptador recusa em vez de fabricar terreno plano e fingir que mediu.
 *
 * Enquanto isso durar, **os dois motores não pisam na mesma terra**, e o LAB-08
 * — *"mesmas glebas, mesmas sementes"* — é impossível de honrar.
 *
 * # O que é inventado, e como fica declarado
 *
 * A poligonal, as restrições, os acessos e os parâmetros são **os do Generate,
 * intocados**. O que o Lab acrescenta é só o `relevo`, e ele é **sintético e
 * declarado**: a superfície analítica `ondulado` do gerador do LAB-01, a mesma
 * que produziu `sintetico-50ha-ondulado`. Cada arquivo diz isso em
 * `archilly.origem` e em `relevo.fonteMdt`, para que ninguém confunda a fixture
 * com levantamento.
 *
 * **O Generate não é alterado.** Estas fixtures vivem no Lab. A proposta de
 * adotá-las lá vai no relatório, para o chat repassar.
 *
 * # A escala do relevo não é escolhida no olho
 *
 * A amplitude sai do tamanho da própria gleba: `escala` é o raio equivalente
 * dividido por 3, o que dá duas a três ondulações na largura do terreno —
 * densidade de morro e vale que um loteamento de verdade encontra. Fixar um
 * número em metros faria a mesma superfície virar uma planície numa gleba de
 * 140 ha e um sertão de penhascos numa de 10 ha.
 */
import {
  costurar,
  ondulado,
  segmentosDaIsolinha,
  type Relevo,
} from "../../symbios/adapter/ferramentas/terrenos.ts";

import type { EntradaMinima } from "./gleba-v1.ts";

/** Equidistância das curvas, em metros. A mesma dos terrenos do LAB-01. */
export const EQUIDISTANCIA_M = 2;

/** O desnível total que a superfície produz, em metros. */
export const DESNIVEL_M = 40;

export interface Fixture {
  entrada: EntradaMinima;
  curvas: number;
  verticesCotados: number;
  desnivelObtido_m: number;
  escala_m: number;
}

/**
 * Acrescenta relevo sintético declarado a uma ENTRADA v1, sem tocar em mais nada.
 */
export function comRelevo(base: EntradaMinima): Fixture {
  const anel = base.gleba.anel;
  const xs = anel.map((p) => p.x);
  const ys = anel.map((p) => p.y);
  const caixa = {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };

  // O raio equivalente da gleba dita a escala — ver o cabeçalho.
  const raio = Math.sqrt(base.gleba.area_m2 / Math.PI);
  const escala = Math.max(30, raio / 3);
  const relevo: Relevo = ondulado(0, DESNIVEL_M / 2, escala);

  // Amostra a superfície para achar a faixa de cotas de verdade dentro da caixa.
  let zMin = Infinity;
  let zMax = -Infinity;
  const passo = Math.max(2, Math.min(caixa.maxX - caixa.minX, caixa.maxY - caixa.minY) / 120);
  for (let y = caixa.minY; y <= caixa.maxY; y += passo) {
    for (let x = caixa.minX; x <= caixa.maxX; x += passo) {
      const z = relevo(x, y);
      if (z < zMin) zMin = z;
      if (z > zMax) zMax = z;
    }
  }

  const curvas: { cota_m: number; pontos: { x: number; y: number }[] }[] = [];
  const primeira = Math.ceil(zMin / EQUIDISTANCIA_M) * EQUIDISTANCIA_M;
  for (let cota = primeira; cota <= zMax; cota += EQUIDISTANCIA_M) {
    const segs = segmentosDaIsolinha(relevo, cota, caixa, passo);
    for (const linha of costurar(segs, passo / 4)) {
      if (linha.length < 2) continue;
      curvas.push({ cota_m: cota, pontos: linha.map(([x, y]) => ({ x, y })) });
    }
  }

  const vertices = curvas.reduce((s, c) => s + c.pontos.length, 0);

  return {
    entrada: {
      ...base,
      archilly: {
        ...base.archilly,
        // Quem lê o arquivo tem de saber, na primeira linha, o que é sintético.
        ...({
          origem:
            "archilly-lab · LAB-03 · fixture: poligonal e parâmetros do Generate, " +
            "RELEVO SINTÉTICO declarado (superfície analítica `ondulado` do gerador do LAB-01)",
        } as Record<string, string>),
      },
      relevo: { curvas },
    },
    curvas: curvas.length,
    verticesCotados: vertices,
    desnivelObtido_m: zMax - zMin,
    escala_m: escala,
  };
}
