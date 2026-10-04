/**
 * A ENTRADA do contrato de motor (v1 **e** v2) → o `Terreno` que o Symbios consome.
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

/**
 * AS VERSÕES DO CONTRATO QUE ESTA ESTEIRA LÊ, da mais nova para a mais velha.
 *
 * # Por que duas, e não só a nova (LAB-18)
 *
 * Porque é a regra que o próprio Generate adotou, e com a razão escrita no
 * contrato deles: *"quem lê tem de aguentar o outro lado evoluir — o
 * Laboratório e o Testfit vendorizam este contrato e não se atualizam no mesmo
 * dia que nós; recusar o arquivo da versão anterior faria a evolução do contrato
 * virar quebra de integração"*.
 *
 * O Lab deve a eles a mesma cortesia na direção contrária: as fixtures gravadas
 * em `docs/fixtures/` declaram `"1"`, e são **prova de medição antiga** — refazê-las
 * para caber na versão nova falsificaria a prova.
 *
 * # Como foi descoberto que o gate existia
 *
 * Ao revendorizar o v2, **cinco testes ficaram vermelhos** com
 * `esta esteira lê o contrato "1"; chegou versão "2"`. Não era defeito do
 * contrato novo: era **o gate do Lab**, que exigia igualdade exata em vez de
 * pertencer a um conjunto. O defeito estava aqui desde o LAB-08.
 */
export const VERSOES_LIDAS = ["2", "1"] as const;

/**
 * A VERSÃO DO CONTRATO QUE UM CONJUNTO DE ENTRADAS DECLARA. (LAB-43)
 *
 * O §7 manda toda prova de medição trazer a **versão do contrato**. Até o LAB-43 esse
 * valor era **escrito à mão** em catorze ferramentas — e em quatro delas estava
 * **errado**: `lab25`, `lab26`, `lab28` e `lab30` publicavam `"2"` quando **todas** as
 * glebas que elas medem declaram `"1"` (D146).
 *
 * **A etiqueta sai do medido, não do autor.** É a mesma disciplina do D104 (motivo de
 * perda não mora em comentário) aplicada a um campo de prova: valor à mão não se
 * revalida, e este envelheceu em quatro arquivos sem nada acusar — a guarda do §7
 * conferia que a chave **existe**, nunca que ela **corresponde**.
 *
 * **Ela REPROVA quando o conjunto é misto**, em vez de eleger a primeira: duas glebas de
 * contratos diferentes na mesma prova não têm uma versão só, e publicar uma delas
 * esconderia a outra. Prova misturada é outra prova.
 */
export function contratoDasEntradas(entradas: readonly { archilly: { versao: string } }[]): string {
  const versoes = [...new Set(entradas.map((e) => e.archilly.versao))];
  if (versoes.length === 0) {
    throw new Error("contratoDasEntradas: nenhuma entrada — não há contrato a declarar");
  }
  if (versoes.length > 1) {
    throw new Error(
      `contratoDasEntradas: as entradas declaram contratos diferentes (${versoes
        .map((v) => `"${v}"`)
        .join(", ")}) — uma prova só não pode carregar duas versões`,
    );
  }
  const unica = versoes[0]!;
  if (!(VERSOES_LIDAS as readonly string[]).includes(unica)) {
    throw new Error(
      `contratoDasEntradas: as entradas declaram o contrato "${unica}", que esta esteira não lê`,
    );
  }
  return unica;
}
export type VersaoLida = (typeof VERSOES_LIDAS)[number];

/**
 * O que a versão v1 **não carrega**, e que a v2 trouxe a pedido do Lab.
 *
 * Isto é declaração, não remendo: quando chega um arquivo v1, estes campos
 * **não existem**, e o que depende deles sai `null` — "não medido" —, nunca zero
 * (D23). Uma entrada v1 e uma v2 não fizeram a mesma prova, e quem lê a medição
 * tem de poder saber disso.
 */
export const FALTA_NA_V1 = [
  "restricoes[].tipo === \"app_nascente\" — a nascente chegava dentro de `app_hidrica`",
  "restricoes[].nascente — o PONTO da nascente, de onde se medem os 50 m",
  "restricoes[].eixoDoCurso — a LINHA do curso, sem a qual não há perpendicular",
  "atracoes[].tipo === \"via_desenhada\" | \"testada_de_frente\" — as duas chegavam como `via_existente`",
  "vias[].rampaMaxima_pct na SAÍDA — só havia a rampa média, que esconde o pior trecho",
] as const;

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
    /** v2 — o PONTO da nascente, obrigatório quando `tipo === "app_nascente"`. */
    nascente?: Ponto | null;
    /** v2 — o EIXO do curso d'água, para `app_hidrica` e `curso_dagua`. */
    eixoDoCurso?: Ponto[] | null;
  }[];
  atracoes: { id: string; geometria: { tipo: string } }[];
  acessos: unknown[];
  parametros: Record<string, number | null>;
}

export function glebaParaOSymbios(e: EntradaMinima): {
  terreno: Terreno;
  perdas: PerdaNaGleba[];
} {
  if (!(VERSOES_LIDAS as readonly string[]).includes(e.archilly.versao)) {
    throw new Error(
      `esta esteira lê o contrato ${VERSOES_LIDAS.map((v) => `"${v}"`).join(" e ")}; ` +
        `chegou versão "${e.archilly.versao}"`,
    );
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
