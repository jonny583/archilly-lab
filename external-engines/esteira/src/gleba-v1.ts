/**
 * A ENTRADA do contrato de motor v1 → o `Terreno` que o Symbios consome.
 *
 * # Por que este arquivo existe
 *
 * O LAB-01 alimentava o Symbios com `archilly-terreno` (GeoJSON do Geo); o
 * LAB-07 alimentava o outro motor com o **contrato de motor v1**. Eram dois
 * caminhos de entrada e, portanto, duas glebas diferentes — o que torna
 * impossível dizer se uma diferença de resultado veio do motor ou do terreno.
 *
 * O LAB-08 vai cobrar exatamente isso: *"mesmas glebas, mesmas sementes"*. Este
 * conversor é o que torna a frase verdadeira — a partir daqui, os dois motores
 * comem do mesmo prato.
 *
 * # O que se perde no caminho
 *
 * O `Terreno` do Symbios é mais pobre que a ENTRADA do contrato, e o que não
 * atravessa fica **declarado**, nunca silencioso — é a mesma disciplina do
 * `ida.ts` do LAB-07. O Symbios não tem acesso, não tem atração, não tem
 * parâmetro de lote: ele traça via e extrai quadra.
 */
import type {
  CurvaDeNivel,
  Poligono,
  Ponto,
  Restricao,
  Terreno,
} from "@symbios/contrato.ts";
import { calcularOrigem } from "@symbios/geo.ts";

/** O que não atravessou, com o motivo. Mesmo formato do LAB-07. */
export interface PerdaNaGleba {
  campo: string;
  oQueHavia: string;
  motivo: string;
  gravidade: "alta" | "media" | "baixa";
}

/** O mínimo da ENTRADA v1 que este conversor lê. */
export interface EntradaMinima {
  archilly: { schema: string; versao: string };
  projeto: { id: string; nome: string };
  crs: { codigo: string; unidade: string; origemGeografica: { lat: number; lon: number } | null };
  gleba: { id: string; nome: string; anel: Ponto[]; furos: Ponto[][]; area_m2: number };
  relevo: { curvas: { cota_m: number; pontos: Ponto[] }[] | null } | null;
  restricoes: {
    id: string;
    tipo: string;
    nome: string;
    desconta: boolean;
    geometria: { tipo: string; aneis?: Ponto[][]; pontos?: Ponto[]; ponto?: Ponto };
  }[];
  atracoes: { id: string; geometria: { tipo: string } }[];
  acessos: unknown[];
  parametros: Record<string, number | null>;
}

export function glebaParaOSymbios(e: EntradaMinima): {
  terreno: Terreno;
  perdas: PerdaNaGleba[];
} {
  if (e.archilly.versao !== "1") {
    throw new Error(`esta esteira lê o contrato "1"; chegou versão "${e.archilly.versao}"`);
  }
  if (e.crs.unidade !== "m") {
    throw new Error(`o núcleo é em metro; o CRS declarou "${e.crs.unidade}"`);
  }
  if (e.gleba.anel.length < 3) {
    throw new Error(`a gleba tem ${e.gleba.anel.length} ponto(s); um anel precisa de 3`);
  }

  const perdas: PerdaNaGleba[] = [];

  // A origem geográfica: o contrato pode trazê-la, e é ela que permite voltar a
  // graus no fim. Quando não vem, fica uma origem neutra e a saída é local — o
  // que o contrato já permite ao declarar `codigo: "local"`.
  const og = e.crs.origemGeografica;
  const origem = og
    ? calcularOrigem([{ lat: og.lat, lon: og.lon }])
    : calcularOrigem([{ lat: 0, lon: 0 }]);
  if (!og) {
    perdas.push({
      campo: "crs.origemGeografica",
      oQueHavia: "null",
      motivo:
        "sem origem geográfica não há como reverter o resultado para graus; a saída " +
        "fica em metros locais, que é o que o contrato permite ao declarar codigo local",
      gravidade: "media",
    });
  }

  const gleba: Poligono = {
    externo: e.gleba.anel.map((p) => ({ x: p.x, y: p.y })),
    furos: (e.gleba.furos ?? []).map((f) => f.map((p) => ({ x: p.x, y: p.y }))),
  };

  const curvas: CurvaDeNivel[] = (e.relevo?.curvas ?? []).map((c) => ({
    cota_m: c.cota_m,
    pontos: c.pontos.map((p) => ({ x: p.x, y: p.y })),
  }));
  if (curvas.length === 0) {
    perdas.push({
      campo: "relevo.curvas",
      oQueHavia: "[] ou null",
      motivo:
        "sem curva de nível o mapa de alturas sai plano, e o campo tensorial do Symbios " +
        "cai no regime de grade ortogonal — o motor roda, mas não segue topografia nenhuma",
      gravidade: "alta",
    });
  }

  const restricoes: Restricao[] = [];
  for (const [i, r] of e.restricoes.entries()) {
    if (r.geometria.tipo !== "poligono" || !r.geometria.aneis?.length) {
      perdas.push({
        campo: `restricoes[${i}].geometria`,
        oQueHavia: r.geometria.tipo,
        motivo:
          "o recorte do LAB-02 precisa de área; restrição em linha ou ponto não delimita " +
          "terra e não pode bloquear via sem que o Lab invente uma faixa de largura",
        gravidade: "alta",
      });
      continue;
    }
    const [externo, ...furos] = r.geometria.aneis;
    restricoes.push({
      id: r.id,
      nome: r.nome,
      categoria: r.tipo,
      desconta: r.desconta,
      area: {
        externo: externo!.map((p) => ({ x: p.x, y: p.y })),
        furos: furos.map((f) => f.map((p) => ({ x: p.x, y: p.y }))),
      },
    });
  }

  if (e.atracoes.length > 0) {
    perdas.push({
      campo: "atracoes",
      oQueHavia: `${e.atracoes.length} atração(ões)`,
      motivo:
        "o Symbios não tem conceito de atração: o traçado dele nasce do campo tensorial " +
        "do relevo, e não há onde pendurar um ímã",
      gravidade: "alta",
    });
  }
  if (e.acessos.length > 0) {
    perdas.push({
      campo: "acessos",
      oQueHavia: `${e.acessos.length} acesso(s)`,
      motivo:
        "o Symbios não recebe ponto de acesso; a rede dele não é ancorada em entrada " +
        "nenhuma, e ligar a rede ao acesso é trabalho de quem consumir a saída",
      gravidade: "alta",
    });
  }
  const deLote = ["areaMinLote_m2", "areaAlvoLote_m2", "areaMaxLote_m2", "testadaMinLote_m"];
  if (deLote.some((k) => e.parametros[k] != null)) {
    perdas.push({
      campo: "parametros (lote)",
      oQueHavia: deLote.filter((k) => e.parametros[k] != null).join(", "),
      motivo:
        "o Symbios traça via e extrai quadra; ele não parcela em lote, então todo " +
        "parâmetro de lote fica sem consumidor deste lado da ponte",
      gravidade: "media",
    });
  }

  return {
    terreno: {
      nome: e.gleba.nome || e.projeto.nome,
      origem,
      gleba,
      curvas,
      restricoes,
      areaDeclarada_m2: e.gleba.area_m2 ?? null,
      zonaUtm: null,
      procedencia: `contrato de motor v1 · projeto ${e.projeto.id}`,
    },
    perdas,
  };
}
