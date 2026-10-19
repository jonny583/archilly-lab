/**
 * ════════════════════════════════════════════════════════════════════════════
 *  A PÁGINA DA BANCADA — o que a pasta carrega, quem roda cada arquivo, e a medição de 10/09 num lugar só. (LAB-188, item 900, D416)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `external-engines/symbios/adapter/ferramentas/navegador/README.md` nasceu no LAB-01 (10/09/2026) e diz o que a pasta
 * era naquele dia: uma página para abrir **à mão** — compilar, copiar, servir — e uma medição lida com o olho. Espécies
 * da dívida própria: *mensagem fixa que afirma estado sem perguntar* e *número digitado à mão*. Medido por LUGAR em
 * 19/10/2026:
 *
 * | a página | o que a árvore diz |
 * |---|---|
 * | descreve dois arquivos (`index.html` e `prova.js`) e a receita manual | o `git` carrega **quatro** além dela: o `prova-automatica.ts` (LAB-31) e o `rolagem-no-celular.ts` (LAB-182), que o `conferir.sh` roda a cada verde — e a página não nomeia nenhum dos dois |
 * | *"Medido em 10/09/2026"*: `193174 bytes`, `motor 0.4.1`, `6242 nós`, `6514 arestas`, `275 quadras` | os mesmos números estão **digitados de novo** no `DE_10_09` do `prova-automatica.ts`, que é o portão da prova automática, e gravados no `medidoEm_10_09_2026` da prova do LAB-31 — três lugares, nenhuma trava entre eles |
 * | *"Ela é JavaScript puro e não importa o adaptador"* | verdade, e ninguém perguntava |
 *
 * E um achado contra a conta do LAB-187, que deu esta página como *"sem leitor no código"*: o `rolagem-no-celular.ts`
 * a **lê** (`readFileSync(join(AQUI, "README.md"))`, o bloco de 10/09). A conta casava o caminho inteiro, e o leitor
 * o monta em pedaços — *régua que casa por nome exato mede ortografia* (D137).
 *
 * # O que se pergunta
 *
 * 1. **a pasta, nos dois sentidos:** a lista entre as marcas nomeia cada arquivo que o `git` carrega na pasta (fora a
 *    página), e nada além; e o `.wasm` que a página diz não versionado não está no `git`;
 * 2. **quem roda:** o item da lista diz `conferir.sh` se, e só se, o `conferir.sh` roda aquele arquivo (linha que não é
 *    comentário com `ferramentas/navegador/<arquivo>`);
 * 3. **a medição de 10/09 num lugar só:** os cinco números do bloco `text` da página são os do `DE_10_09` do
 *    `prova-automatica.ts` e os do `medidoEm_10_09_2026` da prova do LAB-31, campo a campo — e a página diz que
 *    são três lugares;
 * 4. **"não importa o adaptador":** enquanto a página o disser, o `prova.js` não tem `import` no código (estático ou
 *    dinâmico) e o `index.html` só carrega script da própria pasta;
 * 5. **o marshalling:** os dois nomes que a página dá (`archilly_alloc`, `archilly_free`) estão no `prova.js` e no
 *    `adapter/src/motor.ts`;
 * 6. **os caminhos:** todo link da página, todo `cd` dos blocos de comando (seguidos em ordem, como o terminal os
 *    seguiria) e todo `docs/…` entre crases resolvem no `git`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, normalize } from "node:path";

import { comoARegraSeLe } from "./texto-das-regras.ts";
import { soOCodigo } from "./varredura-de-chamadas.ts";
import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PASTA = "external-engines/symbios/adapter/ferramentas/navegador/";
export const A_PAGINA = `${A_PASTA}README.md`;
export const O_CONFERIR = "external-engines/conferir.sh";
export const A_PROVA_AUTOMATICA = `${A_PASTA}prova-automatica.ts`;
export const A_PROVA_DO_LAB31 = "docs/provas/LAB-31/navegador.json";
export const O_PROVA_JS = `${A_PASTA}prova.js`;
export const O_INDEX = `${A_PASTA}index.html`;
export const O_MOTOR_DO_ADAPTADOR = "external-engines/symbios/adapter/src/motor.ts";

export const MARCA_ABRE = "<!-- a-pasta-da-bancada (LAB-188) -->";
export const MARCA_FECHA = "<!-- /a-pasta-da-bancada -->";

/** O que a página afirma da importação — lido pelo `comoARegraSeLe`. */
export const A_PAGINA_DIZ_DO_ADAPTADOR = "não importa o adaptador";
/** O que a página afirma do `.wasm`. */
export const A_PAGINA_DIZ_DO_WASM = "O `.wasm` não é versionado";
/** O que a página afirma dos três lugares da medição. */
export const A_PAGINA_DIZ_DOS_TRES = "a mesma medição mora em três lugares";
/** Os nomes do marshalling que a página dá. */
export const O_MARSHALLING: readonly string[] = ["archilly_alloc", "archilly_free"];

export interface Medicao {
  versao_motor: string | null;
  nos: number | null;
  arestas: number | null;
  quadras: number | null;
  bytesDoWasm: number | null;
}
export const CAMPOS: readonly (keyof Medicao)[] = ["versao_motor", "nos", "arestas", "quadras", "bytesDoWasm"];

const num = (m: RegExpExecArray | null) => (m ? Number(m[1]) : null);

/** O bloco `text` da seção *Medido em 10/09/2026*, como o `rolagem-no-celular.ts` o lê. `null` se não há. */
export function oBlocoDe1009(pagina: string): string | null {
  return /## Medido em 10\/09\/2026[^\n]*\n+```text\n([\s\S]*?)\n```/.exec(pagina)?.[1] ?? null;
}

/** Os cinco números do bloco de 10/09. */
export function aMedicaoDaPagina(bloco: string): Medicao {
  return {
    versao_motor: /\bmotor (\d+\.\d+\.\d+)\b/.exec(bloco)?.[1] ?? null,
    nos: num(/\b(\d+) nós\b/u.exec(bloco)),
    arestas: num(/\b(\d+) arestas\b/.exec(bloco)),
    quadras: num(/\b(\d+) quadras\b/.exec(bloco)),
    bytesDoWasm: num(/\bwasm: (\d+) bytes\b/.exec(bloco)),
  };
}

/** O objeto `DE_10_09` do `prova-automatica.ts`, campo a campo. `null` se a constante não está lá. */
export function aMedicaoDaProva(fonte: string): Medicao | null {
  const corpo = /\bconst DE_10_09\s*=\s*\{([^}]*)\}/.exec(fonte)?.[1];
  if (corpo === undefined) return null;
  return {
    versao_motor: /\bversao_motor:\s*"([^"]*)"/.exec(corpo)?.[1] ?? null,
    nos: num(/\bnos:\s*(\d+)/.exec(corpo)),
    arestas: num(/\barestas:\s*(\d+)/.exec(corpo)),
    quadras: num(/\bquadras:\s*(\d+)/.exec(corpo)),
    bytesDoWasm: num(/\bbytesDoWasm:\s*(\d+)/.exec(corpo)),
  };
}

/** O `medidoEm_10_09_2026` da prova gravada do LAB-31. `null` se não há. */
export function aMedicaoGravada(json: string): Medicao | null {
  let dado: unknown;
  try {
    dado = JSON.parse(json);
  } catch {
    return null;
  }
  const m = (dado as { medidoEm_10_09_2026?: Record<string, unknown> }).medidoEm_10_09_2026;
  if (m === undefined || m === null || typeof m !== "object") return null;
  const n = (v: unknown) => (typeof v === "number" ? v : null);
  return {
    versao_motor: typeof m["versao_motor"] === "string" ? m["versao_motor"] : null,
    nos: n(m["nos"]),
    arestas: n(m["arestas"]),
    quadras: n(m["quadras"]),
    bytesDoWasm: n(m["bytesDoWasm"]),
  };
}

/** Os itens entre as marcas: o nome entre crases que abre o item, e o texto inteiro dele. `null` se as marcas faltam. */
export function aListaDaPagina(texto: string): { nome: string; linha: string }[] | null {
  const a = texto.indexOf(MARCA_ABRE);
  const f = texto.indexOf(MARCA_FECHA);
  if (a < 0 || f < 0 || f < a) return null;
  const itens: { nome: string; linha: string }[] = [];
  for (const l of texto.slice(a + MARCA_ABRE.length, f).split("\n")) {
    const m = /^\s*-\s+`([^`]+)`/.exec(l);
    if (m) itens.push({ nome: m[1] as string, linha: l });
    else if (itens.length > 0 && /^\s{2,}\S/.test(l)) itens[itens.length - 1]!.linha += ` ${l.trim()}`;
  }
  return itens;
}

/** Os arquivos da pasta que o `conferir.sh` roda: linha que não é comentário, com `ferramentas/navegador/<arquivo>`. */
export function oQueOConferirRoda(conferir: string): string[] {
  const nomes = new Set<string>();
  for (const l of conferir.split("\n")) {
    if (/^\s*#/.test(l)) continue;
    for (const m of l.matchAll(/ferramentas\/navegador\/([\w.-]+)/g)) nomes.add(m[1] as string);
  }
  return [...nomes].sort();
}

/** Os alvos dos links da página que não são endereço de fora. */
export function osLinks(pagina: string): string[] {
  return [...pagina.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1] as string).filter((l) => !/^[a-z]+:/i.test(l) && !l.startsWith("#"));
}

/** Os `cd` dos blocos de comando, cada um resolvido a partir do anterior, como o terminal os seguiria. */
export function osCds(pagina: string): string[] {
  const resolvidos: string[] = [];
  for (const bloco of pagina.matchAll(/```(?:shell|sh|bash)\n([\s\S]*?)\n```/g)) {
    let onde = A_PASTA.replace(/\/$/, "");
    for (const m of (bloco[1] as string).matchAll(/(?:^|[;&|]\s*|\n\s*)cd\s+([^\s;&|]+)/g)) {
      onde = normalize(`${onde}/${m[1]}`).replace(/\/$/, "");
      resolvidos.push(onde);
    }
  }
  return resolvidos;
}

/** Os caminhos `docs/…` entre crases. */
export function osDocs(pagina: string): string[] {
  return [...pagina.matchAll(/`(docs\/[^`\s]+)`/g)].map((m) => m[1] as string);
}

export interface Resultado {
  naPasta: string[];
  oConferirRoda: string[];
  daPagina: Medicao | null;
  daProva: Medicao | null;
  gravada: Medicao | null;
  caminhosLidos: number;
  problemas: string[];
}

export function conferir(caminhos: readonly string[], ler: (c: string) => string | null): Resultado {
  const problemas: string[] = [];
  const carrega = new Set(caminhos);
  const resolve = (alvo: string) => carrega.has(alvo) || caminhos.some((c) => c.startsWith(`${alvo}/`));
  const naPasta = caminhos.filter((c) => c.startsWith(A_PASTA) && c !== A_PAGINA).map((c) => c.slice(A_PASTA.length));
  const vazio: Resultado = { naPasta, oConferirRoda: [], daPagina: null, daProva: null, gravada: null, caminhosLidos: 0, problemas };
  const pagina = ler(A_PAGINA);
  if (pagina === null) {
    problemas.push(`${A_PAGINA}: a página não existe`);
    return vazio;
  }
  const lida = comoARegraSeLe(pagina);
  if (naPasta.length === 0) problemas.push(`${A_PASTA}: o git não carrega nada além da página — universo vazio (D213)`);

  // 1 · a pasta, nos dois sentidos
  const lista = aListaDaPagina(pagina);
  if (lista === null) problemas.push(`${A_PAGINA}: sem as marcas da lista da pasta`);
  const nomes = (lista ?? []).map((i) => i.nome);
  for (const n of naPasta) if (!nomes.includes(n)) problemas.push(`${A_PAGINA}: a lista não nomeia ${n}, que o git carrega na pasta`);
  for (const n of nomes) if (!naPasta.includes(n)) problemas.push(`${A_PAGINA}: a lista nomeia ${n}, que o git não carrega na pasta`);
  if (new Set(nomes).size !== nomes.length) problemas.push(`${A_PAGINA}: a lista repete um nome`);
  if (!lida.includes(A_PAGINA_DIZ_DO_WASM)) problemas.push(`${A_PAGINA}: não diz que o .wasm não é versionado («${A_PAGINA_DIZ_DO_WASM}»)`);
  else for (const n of naPasta) if (n.endsWith(".wasm")) problemas.push(`${A_PAGINA}: diz que o .wasm não é versionado, e o git carrega ${n}`);

  // 2 · quem roda
  const conferirSh = ler(O_CONFERIR);
  if (conferirSh === null) problemas.push(`${O_CONFERIR}: não existe`);
  const oConferirRoda = conferirSh === null ? [] : oQueOConferirRoda(conferirSh);
  for (const n of oConferirRoda) if (!naPasta.includes(n)) problemas.push(`${O_CONFERIR}: roda ${n}, que o git não carrega na pasta`);
  for (const item of lista ?? []) {
    const diz = item.linha.includes("`conferir.sh`");
    const roda = oConferirRoda.includes(item.nome);
    if (roda && !diz) problemas.push(`${A_PAGINA}: o item ${item.nome} não diz que o \`conferir.sh\` o roda, e roda`);
    if (diz && !roda) problemas.push(`${A_PAGINA}: o item ${item.nome} diz que o \`conferir.sh\` o roda, e não roda`);
  }

  // 3 · a medição de 10/09 num lugar só
  const bloco = oBlocoDe1009(pagina);
  const daPagina = bloco === null ? null : aMedicaoDaPagina(bloco);
  if (daPagina === null) problemas.push(`${A_PAGINA}: sem o bloco \`text\` da seção *Medido em 10/09/2026*`);
  const fonte = ler(A_PROVA_AUTOMATICA);
  const daProva = fonte === null ? null : aMedicaoDaProva(fonte);
  if (daProva === null) problemas.push(`${A_PROVA_AUTOMATICA}: sem a constante DE_10_09`);
  const json = ler(A_PROVA_DO_LAB31);
  const gravada = json === null ? null : aMedicaoGravada(json);
  if (gravada === null) problemas.push(`${A_PROVA_DO_LAB31}: sem o medidoEm_10_09_2026`);
  if (daPagina !== null) {
    for (const c of CAMPOS) {
      if (daPagina[c] === null) problemas.push(`${A_PAGINA}: o bloco de 10/09 não traz ${c}`);
      if (daProva !== null && daProva[c] !== daPagina[c])
        problemas.push(`${A_PROVA_AUTOMATICA}: DE_10_09.${c} = ${daProva[c]}, e a página diz ${daPagina[c]}`);
      if (gravada !== null && gravada[c] !== daPagina[c])
        problemas.push(`${A_PROVA_DO_LAB31}: medidoEm_10_09_2026.${c} = ${gravada[c]}, e a página diz ${daPagina[c]}`);
    }
  }
  if (!lida.includes(A_PAGINA_DIZ_DOS_TRES)) problemas.push(`${A_PAGINA}: não diz que a medição de 10/09 mora em três lugares («${A_PAGINA_DIZ_DOS_TRES}»)`);
  else for (const lugar of ["prova-automatica.ts", A_PROVA_DO_LAB31]) if (!pagina.includes(lugar)) problemas.push(`${A_PAGINA}: diz três lugares e não nomeia ${lugar}`);

  // 4 · "não importa o adaptador"
  if (lida.includes(A_PAGINA_DIZ_DO_ADAPTADOR)) {
    const js = ler(O_PROVA_JS);
    if (js === null) problemas.push(`${O_PROVA_JS}: não existe`);
    else if (/\bimport\b/.test(soOCodigo(js))) problemas.push(`${O_PROVA_JS}: tem import no código, e a página diz que não importa o adaptador`);
    const html = ler(O_INDEX);
    if (html === null) problemas.push(`${O_INDEX}: não existe`);
    else
      for (const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
        const alvo = normalize(A_PASTA + (m[1] as string));
        if (/^[a-z]+:/i.test(m[1] as string) || !alvo.startsWith(A_PASTA))
          problemas.push(`${O_INDEX}: carrega script de fora da pasta (${m[1]}), e a página diz que não importa o adaptador`);
        else if (!carrega.has(alvo)) problemas.push(`${O_INDEX}: carrega ${m[1]}, que o git não carrega`);
      }
  } else problemas.push(`${A_PAGINA}: não diz se importa o adaptador («${A_PAGINA_DIZ_DO_ADAPTADOR}»)`);

  // 5 · o marshalling
  // Arquivo que falta não vira texto vazio: diz-se que falta (o `prova.js` já foi dito acima, se a página o pergunta).
  const js = ler(O_PROVA_JS);
  const motor = ler(O_MOTOR_DO_ADAPTADOR);
  if (motor === null) problemas.push(`${O_MOTOR_DO_ADAPTADOR}: não existe`);
  for (const nome of O_MARSHALLING) {
    if (!pagina.includes(nome)) problemas.push(`${A_PAGINA}: não nomeia ${nome}`);
    if (js !== null && !js.includes(nome)) problemas.push(`${O_PROVA_JS}: não usa ${nome}, que a página dá como o contrato`);
    if (motor !== null && !motor.includes(nome))
      problemas.push(`${O_MOTOR_DO_ADAPTADOR}: não usa ${nome}, que a página dá como o mesmo contrato`);
  }

  // 6 · os caminhos
  let caminhosLidos = 0;
  for (const link of osLinks(pagina)) {
    caminhosLidos++;
    const alvo = normalize(A_PASTA + link).replace(/\/$/, "");
    if (!resolve(alvo)) problemas.push(`${A_PAGINA}: o link ${link} não resolve em nada que o git carrega (${alvo})`);
  }
  for (const cd of osCds(pagina)) {
    caminhosLidos++;
    if (!resolve(cd)) problemas.push(`${A_PAGINA}: o cd chega a ${cd}, que o git não carrega`);
  }
  for (const d of osDocs(pagina)) {
    caminhosLidos++;
    if (!resolve(d.replace(/\/$/, ""))) problemas.push(`${A_PAGINA}: ${d} não existe no git`);
  }

  return { naPasta, oConferirRoda, daPagina, daProva, gravada, caminhosLidos, problemas };
}

export function conferirAArvore(raiz: string): Resultado {
  const ler = (c: string) => {
    const p = join(raiz, c);
    return existsSync(p) ? readFileSync(p, "utf8") : null;
  };
  return conferir(arquivosQueOGitCarrega(raiz), ler);
}

export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "se a medição de 10/09 é VERDADE hoje: a régua confere que os três lugares dizem o mesmo, não que o .wasm de hoje dá aqueles números — isso é a prova automática, que sem o .wasm nesta máquina não roda",
  "se a receita manual (compilar, copiar, servir) ainda funciona: a régua confere que os `cd` chegam a pastas que existem, não que o `cargo build` compila",
  "o que cada arquivo da lista FAZ: a régua confere o nome e a menção ao `conferir.sh`, não a descrição ao lado",
  "o import do adaptador por outro caminho que não `import` no `prova.js` nem `<script src>` no `index.html` (um `fetch` de código e `eval`, por exemplo)",
  "a frase do `index.html` sobre o LAB-05 (\"o LAB-05 é que cobra a prova completa\"): é da tela da bancada, não desta página",
];
