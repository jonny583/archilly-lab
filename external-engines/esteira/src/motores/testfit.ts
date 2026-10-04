/**
 * O MOTOR DO LABORATÓRIO DE PARCELAMENTO, na porta comum. (LAB-13)
 *
 * Ele já tinha esteira própria, do LAB-07 e do LAB-08
 * (`external-engines/testfit/adapter/src/esteira.ts`), que roda **todas** as
 * variantes e as julga uma a uma. Aqui essa esteira é envelopada na mesma
 * assinatura dos outros dois, e a escolha de qual variante representa o motor
 * segue sendo **dele**, não minha: a de melhor nota no ranking dele, entre as
 * que o esquema aceitou.
 *
 * # Por que o aparo fica LIGADO aqui, e por que isso é declarado
 *
 * Sem aparo, este motor entrega eixos que saem da gleba e o contrato recusa o
 * arquivo inteiro — medido no LAB-07, 60 de 60 variantes. O LAB-08 mediu de
 * novo depois do T02: **0 de 20 recusadas**, e o aparo corta 0,32 % do
 * comprimento. Com tão pouco a aparar, deixá-lo ligado não maquia motor nenhum,
 * e permite medir as cinco glebas com o mesmo procedimento.
 *
 * **O que foi aparado sai na medição**, como `naoSoubeFazer`, para ninguém ler
 * a tabela achando que a passagem foi limpa quando não foi.
 */
import { rodarEsteira } from "../../../testfit/adapter/src/esteira.ts";
import type { EntradaV1 } from "../../../testfit/adapter/src/contrato-v1.ts";

import type { EntradaMinima } from "../gleba-v1.ts";
import { linhasDaEntrada, oQueAEsteiraPassaPronto, type Rodada } from "./comum.ts";

/**
 * Os dez partidos de traçado do catálogo dele.
 *
 * Rodar no padrão de fábrica mediria **um** deles (`ortogonal`), que é um
 * décimo do motor — a mesma razão do LAB-08.
 */
export const FORMATOS = [
  "ortogonal", "espinha", "pente", "diagonal", "loop",
  "cluster", "radial", "organico", "superquadra", "mioloVerde",
] as const;

/** Quantas variantes o motor gera por rodada. O mesmo número do LAB-08. */
export const VARIANTES = 20;

export function rodarTestfit(entrada: EntradaMinima, semente: number): Rodada {
  const t0 = performance.now();
  // ── A COLUNA VERTEBRAL DESENHADA, que eu nunca entreguei (LAB-30, D119) ────
  //
  // O motor tem `viaManual` desde sempre, e a ida do Lab nunca a preencheu —
  // então o Lab publicou, duas vezes, que **o motor** ignora via desenhada
  // (LAB-17 e LAB-23). Medido: preenchendo-a, `antonina-com-via` vai de 25 para 32
  // vias. Quem ignorava era a ponte.
  //
  // A separação entre via desenhada e testada de frente mora aqui, no remendo do
  // LAB-13 (`linhasDaEntrada`), porque o contrato **v1** manda as duas com o mesmo
  // tipo. Quem sabe separar é que passa pronto — reescrever o remendo dentro do
  // adaptador seria a segunda régua que o D20 proíbe.
  const { testadasDeFrente } = linhasDaEntrada(entrada);
  const { viaManual: colunaVertebral } = oQueAEsteiraPassaPronto(entrada);

  // ── A TESTADA DE FRENTE, a última dívida declarada (LAB-37, D121) ─────────
  //
  // Ela chega como linha e o motor tem `facesLoteamento` esperando: *"índices das
  // faces do perímetro que recebem lotes voltados para a rua"*. A ida do Lab nunca
  // entregou — era a única `divida` do inventário.
  //
  // O mapeamento mora na `facesCobertasPelaLinha`, no `comum.ts`, pelo mesmo motivo
  // que a separação mora aqui: régua duplicada dá dois números para a mesma
  // grandeza (D116). Os dois parâmetros dela são declarados, e o da fração mínima é
  // a lição do D75 — a face vizinha toca a linha no VÉRTICE e não é testada.
  const faces = oQueAEsteiraPassaPronto(entrada).facesLoteamento;

  const r = rodarEsteira(entrada as unknown as EntradaV1, {
    semente,
    variantes: VARIANTES,
    aparar: true,
    formatos: [...FORMATOS],
    ...(colunaVertebral ? { viaManual: colunaVertebral } : {}),
    ...(faces.length ? { facesLoteamento: faces } : {}),
  });
  const ms = performance.now() - t0;

  const naoSoubeFazer: string[] = [];

  // A escolha é do motor: melhor nota DELE, entre as que o esquema aceitou.
  const julgadas = r.variantes.filter((v) => v.relatorio);
  const escolhida = julgadas.sort((a, b) => a.posicaoNoMotor - b.posicaoNoMotor)[0];

  const recusadas = r.variantes.length - julgadas.length;
  if (recusadas > 0) {
    naoSoubeFazer.push(
      `${recusadas} de ${r.variantes.length} variantes foram recusadas pelo esquema e ficaram fora do ranking`,
    );
  }
  // `comprimentoAparado_m` é o que RESTOU depois do aparo, não o que saiu — o
  // corte é a diferença. Ler o campo pelo nome dava "aparou 99,68 % do
  // comprimento" na primeira passada, que é o complemento de 0,32 % e um
  // absurdo na cara: ninguém apara 99 % de uma rede e ainda a julga.
  const original = r.variantes.reduce((s, v) => s + (v.aparo?.comprimentoOriginal_m ?? 0), 0);
  const restou = r.variantes.reduce((s, v) => s + (v.aparo?.comprimentoAparado_m ?? 0), 0);
  const cortado = original - restou;
  if (cortado > 0) {
    naoSoubeFazer.push(
      `o Lab aparou ${cortado.toFixed(1)} m de eixo que saía da gleba ` +
        `(${original > 0 ? ((100 * cortado) / original).toFixed(2) : "?"} % do comprimento) — ` +
        "sem isso o contrato recusa o arquivo",
    );
  }
  if ((entrada.relevo?.curvas?.length ?? 0) > 0) {
    naoSoubeFazer.push(
      "o relevo da gleba não muda o traçado deste motor — medido no LAB-08, lote a lote",
    );
  }
  if (entrada.atracoes?.length) {
    // ── A frase era falsa em duas pontas desde o LAB-30 (LAB-37) ─────────────
    //
    // Ela dizia que NENHUMA atração entra no traçado. Desde o LAB-30 a via
    // desenhada entra como coluna vertebral, e desde este prompt a testada de
    // frente entra como `facesLoteamento`. O que de fato não entra é o resto.
    const entram = (colunaVertebral ? 1 : 0) + (faces.length ? testadasDeFrente.length : 0);
    const sobram = entrada.atracoes.length - entram;
    if (colunaVertebral) {
      naoSoubeFazer.push("a via desenhada entrou como coluna vertebral do traçado (`viaManual`)");
    }
    if (faces.length) {
      naoSoubeFazer.push(
        `a testada de frente entrou como ${faces.length} face(s) do perímetro ` +
          `(\`facesLoteamento: [${faces.join(", ")}]\`) — lote virado para a rua existente`,
      );
    }
    if (sobram > 0) {
      naoSoubeFazer.push(
        `${sobram} atração(ões) na entrada não entram no traçado deste motor`,
      );
    }
  }

  // ── QUANDO A ESCOLHA DELE CUSTA LOTE, isso vai dito (LAB-37, D140) ────────
  //
  // A variante que representa o motor é a de melhor nota DELE — regra do Lab desde
  // o LAB-13, e ela não muda aqui: escolher por mim seria o Lab decidindo pelo
  // motor. Mas entregue a testada de frente em `geo-antonina`, o ranking dele passou
  // a preferir um partido `superquadra` com **33 lotes** sobre um `ortogonal` com
  // **1 228** — nota 0,6226 contra 0,5881.
  //
  // Publicar 33 lotes sem dizer isso seria número que engana: quem lê a tabela
  // concluiria que o motor desenha mal a gleba, quando o que houve foi o ranking
  // dele preferir outra coisa. O corte é DECLARADO — o dobro —, e a linha sai só
  // quando há diferença grande, para não virar ruído em toda rodada.
  const CORTE_DA_DIFERENCA = 2;
  if (escolhida) {
    const maisLotes = julgadas.reduce((a, b) =>
      ((b.saida as { lotes?: unknown[] }).lotes?.length ?? 0) >
      ((a.saida as { lotes?: unknown[] }).lotes?.length ?? 0)
        ? b
        : a,
    );
    const nEscolhida = (escolhida.saida as { lotes?: unknown[] }).lotes?.length ?? 0;
    const nMais = (maisLotes.saida as { lotes?: unknown[] }).lotes?.length ?? 0;
    if (nMais >= CORTE_DA_DIFERENCA * Math.max(1, nEscolhida)) {
      naoSoubeFazer.push(
        `o RANKING DELE escolheu "${escolhida.formato}" com ${nEscolhida} lotes (nota ` +
          `${escolhida.notaDoMotor.toFixed(4)}); entre as aceitas, "${maisLotes.formato}" dá ` +
          `${nMais} lotes (nota ${maisLotes.notaDoMotor.toFixed(4)}). A escolha da variante é ` +
          "do motor, não do Lab — e aqui ela custa lote",
      );
    }
  }

  // ── O LOTE DA TESTADA NÃO TEM VIA DO PLANO, e isso vai dito (LAB-45) ──────
  //
  // Medido em `ensaio-com-testada`: entregue a face da rua existente, o motor cria
  // **51** lotes externos (ids `…-eN`), e **os 51** publicam `faceDeRua: null` — o
  // próprio motor diz que eles não fazem frente para via NENHUMA do plano, porque a
  // rua deles **já existe e está fora da gleba**. O Validator do Generate, cuja regra
  // `frente` é *"nenhuma aresta encosta em via"*, acusa **47** deles.
  //
  // Então o mesmo lote é **"de frente para a rua existente"** por uma régua e **"sem
  // frente para rua"** pela outra, e as duas estão certas sobre o que medem. Publicar
  // as violações sem esta linha faria o número ler como defeito do motor — é o
  // princípio do LAB-34, a razão colada ao número.
  if (escolhida && faces.length) {
    const lotes = (escolhida.saida as { lotes?: { id: string; faceDeRua?: string | null }[] }).lotes ?? [];
    const externos = lotes.filter((l) => /-e\d+$/.test(l.id));
    const semVia = externos.filter((l) => l.faceDeRua == null).length;
    if (externos.length) {
      naoSoubeFazer.push(
        `${externos.length} lote(s) externo(s) nasceram da testada, e ${semVia} deles publicam ` +
          "`faceDeRua: null` — a rua deles JÁ EXISTE e está fora da gleba, então não há via do " +
          "plano para apontar. O invariante `frente` do Generate (\"nenhuma aresta encosta em " +
          'via") conta esses lotes como violação: o mesmo lote é "de frente para a rua ' +
          'existente" por uma régua e "sem frente para rua" pela outra',
      );
    }
  }

  if (!escolhida) {
    return { saida: null, ms, naoSoubeFazer: [...naoSoubeFazer, "nenhuma variante passou no esquema"], variante: null };
  }

  return {
    saida: escolhida.saida,
    ms,
    naoSoubeFazer,
    variante: `${escolhida.formato} (1º de ${julgadas.length} no ranking dele)`,
  };
}
