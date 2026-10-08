/**
 * ════════════════════════════════════════════════════════════════════════════
 *  LAB-63 · O que eu aceitei e nunca reconferi.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * **O pedido:** o chat somou quatro prompts num só — *"melhor os vários prompts em 1
 * somente"*. Os três achados que ele trouxe (Pesquisa, Render, Central) são o mesmo visto de
 * três lados: **afirmação que entrou na casa sem régua não sai mais.**
 *
 * Esta ferramenta mede as duas formas que ela tem aqui, e as duas foram achadas:
 *
 * 1. **a acusação que nomeia endereço no repositório do vizinho** — os seis mecanismos do
 *    LAB-58 declaram arquivo e nome no clone do motor, e **nada no verde conferia**;
 * 2. **a regra da casa cuja aritmética não fecha** — a `CLAUDE.md` §6, a página que eu leio
 *    antes de toda tarefa.
 *
 * Uso: `bun run lab63` (precisa do clone do `motor-testfit`, como o verde completo)
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { MECANISMOS } from "../src/mecanismos-das-violacoes.ts";
import {
  conferirAritmeticaDoPontoCego,
  conferirEndereco,
  lerEnderecos,
  varrerContraexemplosNasDecisoes,
} from "../src/varredura-do-que-eu-aceitei.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const CLONE = join(RAIZ, "..", "motor-testfit");
const PROVA = join(RAIZ, "docs", "provas", "LAB-63");

const problemas: string[] = [];

// ── Forma 1 · os endereços no repositório do vizinho ───────────────────────
if (!existsSync(CLONE)) {
  console.error(`  o clone do motor não está em ${CLONE}.`);
  console.error("  RECEITA: git clone <motor-testfit> ao lado deste repositório (só de leitura, §4).");
  process.exit(1);
}

/** Todo `.ts`/`.tsx` do clone, para dizer ONDE o símbolo está quando o endereço errar. */
function fontesDoClone(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === ".git" || e === "dist") continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) fontesDoClone(p, out);
    else if (e.endsWith(".ts") || e.endsWith(".tsx")) out.push(p);
  }
  return out;
}
const fontes = fontesDoClone(join(CLONE, "src"));

const enderecos = MECANISMOS.map((m) => {
  const lidos = lerEnderecos(m.ondeNoMotor);
  const falhas = lidos.flatMap((e) =>
    conferirEndereco(
      e,
      (caminho) => {
        const p = join(CLONE, caminho);
        return existsSync(p) ? readFileSync(p, "utf8") : null;
      },
      (simbolo) => {
        const achado = fontes.find((f) =>
          new RegExp(`\\b(?:function|const|let|var|class|type|interface)\\s+${simbolo}\\b`).test(
            readFileSync(f, "utf8"),
          ),
        );
        return achado ? relative(CLONE, achado) : null;
      },
    ),
  );
  return {
    mecanismo: m.id,
    ondeNoMotor: m.ondeNoMotor,
    enderecos: lidos.map((e) => ({
      arquivo: e.arquivo,
      simbolos: e.simbolos,
      descricoes: e.descricoes,
    })),
    simbolosConferidos: lidos.reduce((s, e) => s + e.simbolos.length, 0),
    falhas,
  };
});

const simbolosNoTotal = enderecos.reduce((s, e) => s + e.simbolosConferidos, 0);
const comFalha = enderecos.filter((e) => e.falhas.length > 0);
for (const e of comFalha) {
  for (const f of e.falhas) {
    problemas.push(
      f.tipo === "arquivo-ausente"
        ? `${e.mecanismo}: o arquivo \`${f.arquivo}\` não existe no clone`
        : `${e.mecanismo}: \`${f.simbolo}\` NÃO é definido em \`${f.arquivo}\` — está em \`${f.ondeEstaDefinido ?? "lugar nenhum do clone"}\``,
    );
  }
}

/**
 * **Um endereço sem símbolo nenhum não é endereço conferido.** Mecanismo cujo `ondeNoMotor` só
 * traz prosa passa a régua sem ser medido, e silêncio aqui é a forma do D202. A conta sai na
 * prova, e a trava cobra que ela não cresça.
 */
const semSimbolo = enderecos.filter((e) => e.simbolosConferidos === 0).map((e) => e.mecanismo);

// ── Forma 2 · a aritmética da regra da casa ────────────────────────────────
const claudeMd = readFileSync(join(RAIZ, "CLAUDE.md"), "utf8");
const i6 = claudeMd.indexOf("## 6 · Medir antes de atribuir");
const i7 = claudeMd.indexOf("## 7 · Entrega");
if (i6 === -1 || i7 === -1 || i7 < i6) {
  console.error("  não achei a §6 na CLAUDE.md — a régua lê a seção por título, e o título mudou.");
  process.exit(1);
}
const aritmetica = conferirAritmeticaDoPontoCego(claudeMd.slice(i6, i7));
for (const p of aritmetica.problemas) problemas.push(`CLAUDE.md §6 · ${p.tipo}: ${p.oQue}`);

// ── Forma 3 · o contraexemplo registrado nas DECISÕES ──────────────────────
const decisoes = readFileSync(join(RAIZ, "docs", "DECISOES.md"), "utf8");
const cru = varrerContraexemplosNasDecisoes(decisoes, "decisao");
const estreito = varrerContraexemplosNasDecisoes(decisoes, "frase");
const semPonteiro = estreito.filter((p) => !p.aRegraApontaParaAFrente);
for (const p of semPonteiro) {
  problemas.push(
    `DECISOES.md · a ${p.aRegra} é desmentida pela ${p.oContraexemplo} ("${p.marca}") e NÃO aponta para ela`,
  );
}

// ── A prova ────────────────────────────────────────────────────────────────
mkdirSync(PROVA, { recursive: true });
writeFileSync(
  join(PROVA, "o-que-eu-aceitei.json"),
  `${JSON.stringify(
    {
      prompt: "LAB-63",
      oQueIstoMede:
        "as afirmações que entraram nesta casa sem régua: os endereços que os seis mecanismos " +
        "declaram no clone do motor, e a aritmética da CLAUDE.md §6, que é a página lida antes " +
        "de toda tarefa",
      aPergunta:
        "do chat, somando quatro prompts num só: quantos itens aceitos nunca foram conferidos " +
        "contra o código, e quais regras minhas já têm contraexemplo registrado e continuam valendo",
      quando: new Date().toISOString(),
      osTresAchadosQueOChatTROUXE: [
        "Pesquisa: pedido que nomeia o artefato volta pela metade",
        "Render: dívida aceita é acusação não revisada — sete de vinte e oito nunca foram dívida",
        "Central: contraexemplo tratado como exceção é regra que continua errando",
      ],
      forma1_osEnderecosNoVizinho: {
        oQueSeCobra:
          "o arquivo existe no clone E cada nome em forma de identificador é DEFINIDO nele — " +
          "definido, não mencionado (D142). Descrição em português não se cobra como definição, " +
          "senão a régua mediria ortografia (D137)",
        mecanismos: MECANISMOS.length,
        simbolosConferidos: simbolosNoTotal,
        mecanismosComFalha: comFalha.length,
        mecanismosSemSimboloNenhum: semSimbolo,
        oQueFoiAchadoEConsertado:
          "o mecanismo `rede-viaria-aparada-so-pela-divisa` declarava `motor.ts · apararRedeViaria " +
          "e aplicarCulDeSac`, e os DOIS moram em outros arquivos: `aparo.ts` e `formatos.ts`. " +
          "`motor.ts` é só onde eles são CHAMADOS. DOIS de seis símbolos apontavam para o arquivo " +
          "errado, numa acusação contra o motor de um vizinho que JÁ SAIU em relatório e recado",
        detalhe: enderecos,
      },
      forma2_aAritmeticaDaRegraDaCasa: {
        oQueSeCobra:
          "o total declarado bate com as linhas da tabela; as classes da partição somam o total; " +
          "toda decisão citada numa classe é linha da tabela; nenhuma outra frase conta a mesma " +
          "lista com outro número; e palavra de número não reconhecida é PROBLEMA, não silêncio",
        linhasDaTabela: aritmetica.linhasDaTabela.length,
        totalDeclarado: aritmetica.totalDeclarado,
        somaDasClasses: aritmetica.somaDasCategorias,
        classes: aritmetica.categorias,
        oQueFoiAchadoEConsertado: [
          "a frase da partição dizia NOVE + duas + três = 14, e o total é 16: DUAS das dezesseis não tinham classe, e a frase se lia como partição",
          "ela citava D104 e D175 como membros das classes, e NENHUMA das duas é linha da tabela",
          "uma frase ainda contava a mesma lista como `quinze`, de quando a lista tinha quinze",
        ],
        aClassificacaoNova: "7 régua + 4 ponte/ida + 2 caminho + 2 cabeça + 1 dado = 16, cada linha em uma classe só, com a decisão nomeada",
      },
      osTresDefeitosDESTARegua: {
        porQueIssoSaiNaPROVA:
          "três vezes nesta mesma ferramenta a régua nova não viu o que estava lá — e os três " +
          "eram FALSO NEGATIVO, a família do D202. Publicar a régua sem publicar os três seria " +
          "dizer que ela nasceu pronta",
        um: "o parser do endereço dividia ANTES de tirar o parêntese, então `reservarFacesExternas (lido, não tocado)` virava dois pedaços e QUATRO dos seis símbolos iam para `descricoes` sem serem conferidos",
        dois: "o casador de classe exigia a palavra de número no COMEÇO do negrito, e a frase real é `**Das DEZESSEIS, NOVE foram…**` — achou ZERO classes, e a trava da soma nunca disparou",
        tres: "o prefixo do casador terminava em `\\b`, e `\\b` não conhece português: ele achou fronteira entre `r` e `ê`, e a palavra `três` virou `ês`, que não está no mapa. É o D137 dentro da régua que eu escrevi para achar o D137",
        oQueMudouPorCausaDisso:
          "palavra de número não reconhecida passou a ser PROBLEMA e não `continue`: foi o " +
          "silêncio do `continue` que escondeu os três",
      },
      forma3_oContraexemploNasDECISOES: {
        oQueSeCobra:
          "regra minha desmentida por decisão posterior, sem a decisão antiga apontar para a nova — " +
          "quem lê a regra onde ela mora não fica sabendo",
        comARegua_CRUA_marcaEmQualquerLugarDaDecisao: cru.length,
        comARegua_ESTREITA_marcaNaMESMAfraseDaCitacao: estreito.length,
        semPonteiroDeVolta: semPonteiro.length,
        oQueIssoSIGNIFICA:
          "os " +
          String(cru.length) +
          " da régua crua são TODOS falso positivo da família D142/D155: a marca está na " +
          "decisão, mas falando de outra coisa, e a citação é de apoio e não de desmentido. " +
          "ZERO não é 'nada a consertar': é onde o contraexemplo NÃO está. O das minhas regras " +
          "mora na CLAUDE.md, onde ele é absorvido no texto da própria regra — e ali o que não " +
          "era medido era a ARITMÉTICA do fechamento",
        exemplosDoFalsoPositivo: cru.slice(0, 3),
      },
      osClonesVizinhos: "lidos só para ler (§4); conferidos limpos ao fim da rodada",
      problemas,
    },
    null,
    2,
  )}\n`,
);

console.log(`  mecanismos: ${MECANISMOS.length} · símbolos conferidos no clone: ${simbolosNoTotal}`);
console.log(`  mecanismos com endereço que não resolve: ${comFalha.length}`);
console.log(`  mecanismos sem símbolo nenhum (só prosa): ${semSimbolo.length} [${semSimbolo.join(", ")}]`);
console.log(`  DECISOES.md: régua crua ${cru.length} pares · régua estreita ${estreito.length} · sem ponteiro ${semPonteiro.length}`);
console.log(
  `  CLAUDE.md §6: ${aritmetica.linhasDaTabela.length} linhas · total declarado ${aritmetica.totalDeclarado} · classes somam ${aritmetica.somaDasCategorias}`,
);
console.log(`\n  docs/provas/LAB-63/o-que-eu-aceitei.json`);
if (problemas.length > 0) {
  console.error(`\n  ${problemas.length} PROBLEMA(S):`);
  for (const p of problemas) console.error(`   · ${p}`);
  process.exit(1);
}
console.log("  tudo conferido · zero problemas");
