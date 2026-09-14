/**
 * RECORTE — a rede viária aparada pela gleba e pelas restrições. (LAB-02)
 *
 * # O defeito que este arquivo repara, medido
 *
 * O Symbios gera sobre um **retângulo** — a caixa envolvente do mapa de alturas
 * — e a gleba é irregular. O LAB-01 mediu a conta: **38 % do comprimento de via
 * nasce fora da divisa**, e aquele relatório registrou a ressalva 2 exatamente
 * assim. Não é cosmético: é asfalto orçado em terra que não é do
 * empreendimento, e o esquema do contrato de motor recusa o arquivo por isso
 * antes de qualquer julgamento.
 *
 * O LAB-07 mediu o mesmo defeito no outro motor, 25 % a 40 %, **sem nenhum
 * parentesco entre os dois**. Dois motores independentes errando igual é sinal
 * de que o recorte é responsabilidade da esteira, não de cada motor.
 *
 * # O que ele recorta, e por quê
 *
 * - **Pela gleba**, incluindo os **furos**: `dentroDoPoligono` já trata furo
 *   como fora, e é o mesmo teste que o resto do adaptador usa. Uma segunda
 *   noção de "dentro" seria duas respostas para a mesma pergunta.
 * - **Pelas restrições**, como geometria de verdade. Quais bloqueiam **não é
 *   escolha do Lab**: a regra vem do campo `desconta` que o Geo já carimba, e
 *   que o contrato dele define como "esta área desconta da área líquida". Terra
 *   que não conta para a área líquida não recebe rua. Inventar aqui uma lista
 *   de categorias proibidas seria inventar regra urbanística, que é do Jonny.
 *
 * # Por que ele NÃO é o `apararVias` do outro adaptador
 *
 * O aparo do LAB-07 recorta um **segmento de dois pontos** e fica com o maior
 * pedaço contínuo — devolver dois pedaços inventaria uma via que o motor não
 * desenhou. Aqui a via é uma **polilinha** com dezenas de vértices cotados, e
 * quando ela sai e volta a entrar **os dois trechos de dentro são estrada que o
 * motor desenhou**. Ficar só com o maior jogaria fora rua de verdade. Então
 * aqui todos os trechos livres sobrevivem, cada um virando uma via com id
 * próprio — e a fragmentação que isso causa é medida, não escondida
 * (`conectividade`).
 *
 * # A cota nos pontos de corte
 *
 * Quando um corte cai no meio de um segmento, a cota do ponto novo é
 * **interpolada linearmente entre as duas cotas conhecidas daquele segmento** —
 * que é exatamente a superfície que o próprio motor assume entre dois nós. Não
 * se reamostra o mapa de alturas: isso poderia dar ao ponto de corte uma cota
 * que não está na reta entre os vizinhos, criando um degrau artificial e uma
 * rampa que o motor nunca produziu.
 *
 * # O que ele não faz
 *
 * **Não recorta quadra que atravessa a divisa.** Uma quadra inteiramente fora é
 * descartada — isso é inequívoco, e não inventa geometria. Uma quadra que
 * atravessa ficaria precisando de interseção polígono × polígono côncavo, e o
 * contrato já trata quadra fora da divisa como **exceção declarada** (vira
 * aviso, não recusa). Recortá-la mudaria a área dela, que é número que o
 * Validator mede. Fica medido e declarado; o recorte de quadra é proposta para
 * o chat, não decisão minha.
 */
import type { Poligono, Ponto, Quadra, Resultado, Terreno, Via } from "./contrato.ts";
import { areaPoligono, comprimento, dentroDoPoligono } from "./geo.ts";

/** A folga de divisa do contrato de motor: 5 cm. */
const FOLGA_M = 0.05;

/**
 * Passo de varredura para achar as travessias, em metros.
 *
 * Meio metro acha toda travessia que importa numa rede de loteamento; a posição
 * exata dela não sai daqui — sai da bisseção, que refina para o centímetro.
 */
const PASSO_M = 0.5;

/** Quantas bisseções depois de achar a travessia. 2^-12 × 0,5 m ≈ 0,1 mm. */
const BISSECOES = 12;

/** Uma área onde a rua não pode passar. */
export interface AreaBloqueada {
  id: string;
  nome: string;
  categoria: string;
  area_m2: number;
}

/** O estado da rede depois do corte, do ponto de vista de quem anda nela. */
export interface Conectividade {
  /** Quantos pedaços desligados a rede tem. 1 = tudo se alcança. */
  componentes: number;
  /** Comprimento do maior pedaço, em metros. */
  maiorComponente_m: number;
  /** Fração do comprimento total que está no maior pedaço, de 0 a 1. */
  fracaoNoMaior: number;
  /** Vias que não se alcançam a partir do maior pedaço. */
  viasIsoladas: number;
  /** Comprimento dessas vias, em metros. */
  comprimentoIsolado_m: number;
}

/** Antes e depois, para a tabela do relatório. */
export interface ResultadoRecorte {
  vias: Via[];
  quadras: Quadra[];
  bloqueios: AreaBloqueada[];
  viasAntes: number;
  viasDepois: number;
  viasDescartadas: number;
  /** Vias que viraram mais de um trecho porque saíam e voltavam. */
  viasFragmentadas: number;
  comprimentoAntes_m: number;
  comprimentoDepois_m: number;
  comprimentoForaDaGlebaAntes_m: number;
  comprimentoForaDaGlebaDepois_m: number;
  comprimentoEmRestricaoAntes_m: number;
  comprimentoEmRestricaoDepois_m: number;
  quadrasAntes: number;
  quadrasDepois: number;
  quadrasDescartadas: number;
  /** Quadras que sobraram atravessando a divisa — a exceção declarada. */
  quadrasAtravessando: number;
  /** A rede depois do corte. */
  conectividade: Conectividade;
  /** A mesma régua na rede crua — é ela que diz o que o corte custou. */
  conectividadeAntes: Conectividade;
  /** Comprimento dos trechos com menos de 5 m — as lascas do corte. */
  comprimentoEmLascas_m: number;
  lascas: number;
}

/** Interpola um ponto e a cota dele ao longo de um segmento. */
function em(a: Ponto, b: Ponto, ca: number, cb: number, t: number): [Ponto, number] {
  return [{ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, ca + (cb - ca) * t];
}

/**
 * Onde, entre `t0` e `t1`, o segmento cruza a fronteira do livre.
 *
 * Bisseção simples: `t0` e `t1` têm estados opostos, e a cada passo o intervalo
 * cai pela metade. Doze passos sobre meio metro chegam a décimo de milímetro —
 * muito além de qualquer levantamento, e barato.
 */
function travessia(
  a: Ponto,
  b: Ponto,
  livre: (p: Ponto) => boolean,
  t0: number,
  t1: number,
): number {
  let lo = t0;
  let hi = t1;
  const estadoLo = livre(em(a, b, 0, 0, lo)[0]);
  for (let k = 0; k < BISSECOES; k++) {
    const mid = (lo + hi) / 2;
    if (livre(em(a, b, 0, 0, mid)[0]) === estadoLo) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Quantos metros de uma polilinha caem numa região, por amostragem. */
function comprimentoOnde(
  pontos: Ponto[],
  dentro: (p: Ponto) => boolean,
  passo = 2,
): number {
  let total = 0;
  for (let i = 1; i < pontos.length; i++) {
    const a = pontos[i - 1]!;
    const b = pontos[i]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d < 1e-9) continue;
    const n = Math.max(1, Math.ceil(d / passo));
    const fatia = d / n;
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      if (dentro({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })) total += fatia;
    }
  }
  return total;
}

/** Recalcula comprimento e rampas de um trecho já cortado. */
function refazerMedidas(pontos: Ponto[], cotas: number[]): Pick<
  Via,
  "comprimento_m" | "rampaMedia_pct" | "rampaMaxima_pct"
> {
  const comp = comprimento(pontos);
  let rampaMax = 0;
  for (let i = 1; i < pontos.length; i++) {
    const d = Math.hypot(pontos[i]!.x - pontos[i - 1]!.x, pontos[i]!.y - pontos[i - 1]!.y);
    if (d < 1e-6) continue;
    const r = (Math.abs(cotas[i]! - cotas[i - 1]!) / d) * 100;
    if (r > rampaMax) rampaMax = r;
  }
  const desnivel = Math.abs((cotas.at(-1) ?? 0) - (cotas[0] ?? 0));
  return {
    comprimento_m: comp,
    rampaMedia_pct: comp > 1e-6 ? (desnivel / comp) * 100 : 0,
    rampaMaxima_pct: rampaMax,
  };
}

/**
 * Quebra uma via nos trechos que ficam inteiramente na área livre.
 *
 * Cada trecho sai com os vértices originais que sobreviveram, mais os pontos de
 * corte nas pontas, recuados de `FOLGA_M` para dentro.
 */
function recortarVia(via: Via, livre: (p: Ponto) => boolean): Via[] {
  const { pontos, cotas_m } = via;
  const trechos: { pontos: Ponto[]; cotas: number[] }[] = [];
  let atual: { pontos: Ponto[]; cotas: number[] } | null = null;

  const abrir = (p: Ponto, c: number) => {
    atual = { pontos: [p], cotas: [c] };
  };
  const seguir = (p: Ponto, c: number) => {
    if (atual) {
      atual.pontos.push(p);
      atual.cotas.push(c);
    }
  };
  const fechar = () => {
    if (atual && atual.pontos.length >= 2) trechos.push(atual);
    atual = null;
  };

  if (livre(pontos[0]!)) abrir(pontos[0]!, cotas_m[0]!);

  for (let i = 1; i < pontos.length; i++) {
    const a = pontos[i - 1]!;
    const b = pontos[i]!;
    const ca = cotas_m[i - 1]!;
    const cb = cotas_m[i]!;
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d < 1e-9) continue;

    const n = Math.max(1, Math.ceil(d / PASSO_M));
    let tAnterior = 0;
    let estadoAnterior = livre(a);

    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const estado = livre(em(a, b, ca, cb, t)[0]);
      if (estado !== estadoAnterior) {
        const tc = travessia(a, b, livre, tAnterior, t);
        // Recua a folga do contrato para o lado de dentro, sempre.
        const recuo = FOLGA_M / d;
        if (estadoAnterior) {
          // saindo: fecha um pouco antes da divisa
          const [p, c] = em(a, b, ca, cb, Math.max(0, tc - recuo));
          seguir(p, c);
          fechar();
        } else {
          // entrando: abre um pouco depois da divisa
          const [p, c] = em(a, b, ca, cb, Math.min(1, tc + recuo));
          abrir(p, c);
        }
        estadoAnterior = estado;
      }
      tAnterior = t;
    }
    if (estadoAnterior) seguir(b, cb);
  }
  fechar();

  return trechos
    .map((t, k) => ({
      ...via,
      id: trechos.length > 1 ? `${via.id}-${k + 1}` : via.id,
      pontos: t.pontos,
      cotas_m: t.cotas,
      ...refazerMedidas(t.pontos, t.cotas),
      saiDaGleba: false,
      comprimentoForaDaGleba_m: 0,
    }))
    .filter((v) => v.comprimento_m > 1e-6);
}

/**
 * Componentes conexos da rede, unindo vias que compartilham **qualquer**
 * vértice — não só as pontas.
 *
 * # A primeira versão media errado, e o "antes" a desmascarou
 *
 * A versão original unia duas vias quando uma **ponta** de uma encostava numa
 * **ponta** da outra. Ela acusou 290 componentes na rede cortada, com apenas
 * 1,8 % do comprimento no maior — o que teria virado a manchete "o recorte
 * destrói a conectividade".
 *
 * Antes de atribuir, medi o **antes**: a rede CRUA, sem corte nenhum, dava
 * **472 componentes** pela mesma régua. Uma rede viária recém-gerada não é 472
 * pedaços soltos — logo o defeito era da régua.
 *
 * A causa: `montarVias` quebra as cadeias **por tipo** (`grauDoTipo`), então um
 * nó onde uma local cruza uma principal tem grau 2 em cada tipo e a principal
 * **passa reto por ele**. A local termina ali, no **meio** da principal, e uma
 * comparação ponta-com-ponta não vê esse cruzamento — que é a maioria deles.
 *
 * Com a régua certa, a rede crua dá 22 componentes com **99,8 %** do
 * comprimento no maior: é uma rede só, como tinha de ser.
 *
 * A tolerância de 1 cm é de arredondamento de coordenada, não de projeto: os
 * vértices que se encontram vêm do MESMO nó do motor e são bit a bit iguais na
 * prática; a tolerância existe para o caso de a projeção os separar no último
 * dígito.
 */
function medirConectividade(vias: Via[]): Conectividade {
  const TOL_M = 0.01;
  const pai = vias.map((_, i) => i);
  const achar = (i: number): number => (pai[i] === i ? i : (pai[i] = achar(pai[i]!)));
  const unir = (i: number, j: number) => {
    const a = achar(i);
    const b = achar(j);
    if (a !== b) pai[a] = b;
  };

  // Índice por célula: toda via que toca a mesma célula compartilha o nó.
  const porCelula = new Map<string, number[]>();
  vias.forEach((v, i) => {
    for (const p of v.pontos) {
      const chave = `${Math.round(p.x / TOL_M)}:${Math.round(p.y / TOL_M)}`;
      const lista = porCelula.get(chave);
      if (lista) {
        if (!lista.includes(i)) lista.push(i);
      } else porCelula.set(chave, [i]);
    }
  });
  for (const lista of porCelula.values()) {
    for (let k = 1; k < lista.length; k++) unir(lista[0]!, lista[k]!);
  }

  const porGrupo = new Map<number, number>();
  vias.forEach((v, i) => {
    const g = achar(i);
    porGrupo.set(g, (porGrupo.get(g) ?? 0) + v.comprimento_m);
  });

  const total = vias.reduce((s, v) => s + v.comprimento_m, 0);
  let maior = 0;
  let grupoMaior = -1;
  for (const [g, c] of porGrupo) {
    if (c > maior) {
      maior = c;
      grupoMaior = g;
    }
  }
  const isoladas = vias.filter((_, i) => achar(i) !== grupoMaior);

  return {
    componentes: porGrupo.size,
    maiorComponente_m: maior,
    fracaoNoMaior: total > 0 ? maior / total : 0,
    viasIsoladas: isoladas.length,
    comprimentoIsolado_m: isoladas.reduce((s, v) => s + v.comprimento_m, 0),
  };
}

/** Comprimento abaixo do qual um trecho é uma lasca do corte, para diagnóstico. */
const LASCA_M = 5;

/**
 * Recorta a rede viária pela gleba e pelas restrições que descontam.
 *
 * Nada é inventado: só se tira. Quem escolhe o que bloqueia é o `desconta` do
 * Geo, não o Lab.
 */
export function recortarPelaGleba(r: Resultado, terreno: Terreno): ResultadoRecorte {
  const bloqueadas: Poligono[] = terreno.restricoes.filter((x) => x.desconta).map((x) => x.area);
  const bloqueios: AreaBloqueada[] = terreno.restricoes
    .filter((x) => x.desconta)
    .map((x) => ({
      id: x.id,
      nome: x.nome,
      categoria: x.categoria,
      area_m2: areaPoligono(x.area),
    }));

  const naGleba = (p: Ponto) => dentroDoPoligono(p, terreno.gleba);
  const bloqueado = (p: Ponto) => bloqueadas.some((b) => dentroDoPoligono(p, b));
  const livre = (p: Ponto) => naGleba(p) && !bloqueado(p);

  const foraAntes = r.vias.reduce((s, v) => s + comprimentoOnde(v.pontos, (p) => !naGleba(p)), 0);
  const emRestricaoAntes = r.vias.reduce((s, v) => s + comprimentoOnde(v.pontos, bloqueado), 0);
  const comprimentoAntes = r.vias.reduce((s, v) => s + v.comprimento_m, 0);

  const vias: Via[] = [];
  let fragmentadas = 0;
  let descartadas = 0;
  for (const v of r.vias) {
    const pedacos = recortarVia(v, livre);
    if (pedacos.length > 1) fragmentadas++;
    if (pedacos.length === 0) descartadas++;
    vias.push(...pedacos);
  }

  const foraDepois = vias.reduce((s, v) => s + comprimentoOnde(v.pontos, (p) => !naGleba(p)), 0);
  const emRestricaoDepois = vias.reduce((s, v) => s + comprimentoOnde(v.pontos, bloqueado), 0);

  // Quadras: descarta as que estão inteiramente fora; mede as que atravessam.
  const quadras = r.quadras.filter((q) => q.fracaoDentroDaGleba > 0);
  const atravessando = quadras.filter((q) => q.fracaoDentroDaGleba < 1).length;

  const lascas = vias.filter((v) => v.comprimento_m < LASCA_M);

  return {
    vias,
    quadras,
    bloqueios,
    viasAntes: r.vias.length,
    viasDepois: vias.length,
    viasDescartadas: descartadas,
    viasFragmentadas: fragmentadas,
    comprimentoAntes_m: comprimentoAntes,
    comprimentoDepois_m: vias.reduce((s, v) => s + v.comprimento_m, 0),
    comprimentoForaDaGlebaAntes_m: foraAntes,
    comprimentoForaDaGlebaDepois_m: foraDepois,
    comprimentoEmRestricaoAntes_m: emRestricaoAntes,
    comprimentoEmRestricaoDepois_m: emRestricaoDepois,
    quadrasAntes: r.quadras.length,
    quadrasDepois: quadras.length,
    quadrasDescartadas: r.quadras.length - quadras.length,
    quadrasAtravessando: atravessando,
    conectividade: medirConectividade(vias),
    conectividadeAntes: medirConectividade(r.vias),
    comprimentoEmLascas_m: lascas.reduce((s, v) => s + v.comprimento_m, 0),
    lascas: lascas.length,
  };
}
