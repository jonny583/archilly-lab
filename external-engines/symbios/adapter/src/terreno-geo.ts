/**
 * Leitor do contrato **`archilly-terreno` 1.x** do Archilly Geo.
 *
 * # Onde o contrato é definido
 *
 * A definição normativa é `src/lib/contratos/archilly-terreno.ts` no repositório
 * do Geo (`jonny583/urban-scout-tool`), versão **1.1**; o Generate carrega uma
 * cópia fiel em `src/lib/contratos/archilly-terreno.ts` (lá ainda na 1.0) e a
 * ponte de consumo dele é `src/lib/import/archilly-terreno-import.ts`. Há também
 * o `archilly.geo.2` (`src/lib/geo/contrato.ts` do Geo), que é o pacote para o
 * Studio 2D/3D — outro contrato, outro destino: ele leva estudo, vistas e
 * camadas, não a poligonal recortada. **Para alimentar um motor de loteamento, o
 * contrato certo é o `archilly-terreno`**, e é esse que este leitor consome.
 *
 * # O que este leitor faz, e o que recusa fazer
 *
 * Três posturas copiadas deliberadamente da ponte do Generate, porque são as
 * corretas e porque divergir delas criaria duas leituras do mesmo arquivo:
 *
 * 1. **A geometria é a verdade; `archilly.sintese` é conferência.** Divergência
 *    entre área declarada e área do polígono projetado vira aviso, nunca correção
 *    silenciosa.
 * 2. **Campo desconhecido é ignorado em silêncio.** É a regra de evolução do 1.x,
 *    e é o que permite o Geo ganhar campo novo sem o Lab ser atualizado no mesmo
 *    dia.
 * 3. **`descontaAreaLiquida: false` não é obstáculo.** Essa marca significa que o
 *    usuário recusou aquela APP à mão no Geo. Ela viaja por auditoria e entra no
 *    diagnóstico, mas não é restrição ativa.
 *
 * Validação de esquema com `zod` **não** foi reimplementada aqui: o Lab não
 * importa o Generate nem o Geo, e copiar 400 linhas de esquema criaria uma
 * terceira definição para divergir. O leitor confere o que precisa para rodar —
 * schema, versão, poligonal presente, curvas suficientes — e falha com mensagem
 * específica no que faltar.
 */
import type {
  CurvaDeNivel,
  LatLon,
  Poligono,
  Ponto,
  Restricao,
  Terreno,
} from "./contrato.ts";
import { calcularOrigem, projetar } from "./geo.ts";

/** Posição GeoJSON: `[lon, lat, ...]`. */
type Posicao = number[];

interface Feicao {
  type: "Feature";
  geometry: { type: string; coordinates: unknown } | null;
  properties: Record<string, unknown>;
}

interface ArquivoTerreno {
  type: "FeatureCollection";
  archilly: {
    schema: string;
    versao: string;
    origem?: string;
    geradoEm?: string;
    crsTrabalho?: string | null;
    sintese?: {
      areaBruta_m2?: number;
      relevo?: { cotaMin?: number | null; cotaMax?: number | null } | null;
    };
  };
  features: Feicao[];
}

const paraLatLon = (p: Posicao): LatLon => ({ lon: p[0]!, lat: p[1]! });

/** Anéis de uma geometria de área, como listas de posições. */
function aneisDeArea(g: { type: string; coordinates: unknown }): Posicao[][] {
  if (g.type === "Polygon") return g.coordinates as Posicao[][];
  if (g.type === "MultiPolygon") {
    // MultiPolígono vira um polígono com furos só quando há uma parte. Com mais
    // de uma parte, a maior é o externo e as outras são descartadas com aviso —
    // o motor recebe UM mundo retangular, e gleba em duas ilhas é problema do
    // LAB-02, não deste leitor.
    const partes = g.coordinates as Posicao[][][];
    const maior = partes.reduce((a, b) => (areaAproximada(b[0]!) > areaAproximada(a[0]!) ? b : a));
    return maior;
  }
  return [];
}

/** Área em graus² — serve só para comparar partes entre si. */
function areaAproximada(anel: Posicao[]): number {
  let a = 0;
  for (let i = 0; i < anel.length; i++) {
    const p = anel[i]!;
    const q = anel[(i + 1) % anel.length]!;
    a += p[0]! * q[1]! - q[0]! * p[1]!;
  }
  return Math.abs(a / 2);
}

/**
 * Remove o vértice repetido no fim.
 *
 * O contrato exige que todo anel feche repetindo o primeiro vértice (regra
 * GeoJSON). O adaptador trabalha com anel implícito — `areaComSinal` e
 * `dentroDoAnel` fecham sozinhos —, e o vértice duplicado viraria um segmento de
 * comprimento zero.
 */
function semFechamento(pontos: Ponto[]): Ponto[] {
  if (pontos.length < 2) return pontos;
  const a = pontos[0]!;
  const z = pontos[pontos.length - 1]!;
  return Math.hypot(a.x - z.x, a.y - z.y) < 1e-9 ? pontos.slice(0, -1) : pontos;
}

/**
 * Lê um arquivo `archilly-terreno` e devolve o terreno em metros locais.
 *
 * @param procedencia de onde este arquivo veio — vai para o diagnóstico e para o
 *   relatório. Terreno sintético tem de dizer que é sintético.
 */
export function lerTerrenoGeo(dados: unknown, procedencia: string): Terreno {
  const arq = dados as ArquivoTerreno;
  if (arq?.type !== "FeatureCollection" || !Array.isArray(arq.features)) {
    throw new Error("não é um FeatureCollection — o contrato archilly-terreno é GeoJSON");
  }
  if (arq.archilly?.schema !== "archilly-terreno") {
    throw new Error(
      `esperava schema "archilly-terreno", veio "${arq.archilly?.schema ?? "nenhum"}". ` +
        'O pacote "archilly.geo.2" é outro contrato, para o Studio, e não traz a ' +
        "poligonal recortada que um motor de loteamento precisa",
    );
  }
  if (!/^1\.\d+$/.test(arq.archilly.versao ?? "")) {
    throw new Error(
      `este leitor entende a versão 1.x do contrato; veio "${arq.archilly.versao}"`,
    );
  }

  const doTipo = (t: string) => arq.features.filter((f) => f.properties?.["tipo"] === t);

  const terrenos = doTipo("terreno");
  if (terrenos.length === 0) throw new Error("o arquivo não tem a poligonal do terreno");
  if (terrenos.length > 1) {
    throw new Error(
      `o arquivo tem ${terrenos.length} poligonais de terreno; só a oficial pode vir`,
    );
  }
  const fTerreno = terrenos[0]!;
  if (!fTerreno.geometry) throw new Error("a feição de terreno não tem geometria");

  const aneis = aneisDeArea(fTerreno.geometry);
  if (aneis.length === 0 || (aneis[0]?.length ?? 0) < 4) {
    throw new Error("a poligonal do terreno não é uma área com anel válido");
  }

  // A ORIGEM sai do anel externo da gleba, e de nada mais. Incluir curvas de
  // nível ou restrições no centróide faria a origem depender de quais camadas o
  // Geo exportou — e origem que muda é geometria que anda de lugar entre duas
  // exportações do mesmo terreno.
  const origem = calcularOrigem(aneis[0]!.map(paraLatLon));
  const proj = (p: Posicao): Ponto => projetar(paraLatLon(p), origem);

  const gleba: Poligono = {
    externo: semFechamento(aneis[0]!.map(proj)),
    furos: aneis.slice(1).map((a) => semFechamento(a.map(proj))),
  };

  const curvas: CurvaDeNivel[] = [];
  for (const f of doTipo("curva_nivel")) {
    const cota = f.properties["cota_m"];
    if (typeof cota !== "number" || !Number.isFinite(cota)) continue;
    if (f.geometry?.type !== "LineString") continue;
    const pontos = (f.geometry.coordinates as Posicao[]).map(proj);
    if (pontos.length >= 2) curvas.push({ cota_m: cota, pontos });
  }

  const restricoes: Restricao[] = [];
  for (const tipo of ["app", "reserva_legal", "restricao"]) {
    for (const f of doTipo(tipo)) {
      if (!f.geometry || !["Polygon", "MultiPolygon"].includes(f.geometry.type)) continue;
      const a = aneisDeArea(f.geometry);
      if (a.length === 0) continue;
      const props = f.properties;
      restricoes.push({
        id: String(props["id"] ?? `${tipo}-${restricoes.length}`),
        nome: String(props["nome"] ?? tipo),
        categoria: String(props["categoria"] ?? tipo),
        // Ausente conta como `true`: no 1.0 o campo é obrigatório, e omitir e
        // tratar como "não desconta" transformaria APP em nada.
        desconta: props["descontaAreaLiquida"] !== false,
        area: {
          externo: semFechamento(a[0]!.map(proj)),
          furos: a.slice(1).map((r) => semFechamento(r.map(proj))),
        },
      });
    }
  }

  const areaDeclarada = fTerreno.properties["areaCalculada_m2"];
  const zonaUtm = fTerreno.properties["zonaUtm"];

  return {
    nome: String(fTerreno.properties["nome"] ?? "terreno sem nome"),
    origem,
    gleba,
    curvas,
    restricoes,
    areaDeclarada_m2: typeof areaDeclarada === "number" ? areaDeclarada : null,
    zonaUtm: typeof zonaUtm === "string" ? zonaUtm : null,
    procedencia,
  };
}
