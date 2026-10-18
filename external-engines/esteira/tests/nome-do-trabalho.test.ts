/**
 * A guarda da AFIRMAÇÃO do nome do trabalho de CI. (item 017, LAB-84)
 *
 * ```sh
 * bun test tests/nome-do-trabalho.test.ts
 * ```
 *
 * O item 017 pediu a trava que faltava: *"nenhuma régua confere hoje que o nome do trabalho
 * corresponda ao que ele precisa… e ela é a única coisa que impede isto de voltar, já que o CI
 * está desligado e não vai desmentir ninguém."*
 *
 * **Os dois lados, e nesta ordem:** primeiro que a afirmação de hoje é VERDADEIRA, depois que a
 * régua reprova cada jeito de ela ficar falsa. *Régua que só mostra o lado bom não prova que
 * mede; régua que só mostra o lado ruim não prova que deixa passar o certo.*
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DEPENDEM_DE_CLONE,
  type MedidaPorExecucao,
  TRABALHO_SEM_CLONES,
  arquivosDoTrabalho,
  conferirONome,
} from "../src/nome-do-trabalho.ts";

const RAIZ = join(import.meta.dirname, "..", "..", "..");
const WORKFLOW = join(RAIZ, ".github", "workflows", "verde.yml");

const PROVA = join(RAIZ, "docs", "provas", "LAB-84", "as-trinta-por-execucao.json");

const workflow = () => readFileSync(WORKFLOW, "utf8");
const existe = (c: string) => existsSync(join(RAIZ, c));

/** As linhas da medição por EXECUÇÃO — a prova do `lab84`, e não uma releitura do fonte. */
const medicao = (): MedidaPorExecucao[] =>
  (JSON.parse(readFileSync(PROVA, "utf8")) as { asTrintaEUma: MedidaPorExecucao[] }).asTrintaEUma;

describe("item 017 · o nome do trabalho de CI é uma AFIRMAÇÃO, e ela é conferida", () => {
  test("O LADO BOM: a afirmação de hoje é verdadeira — zero problemas", () => {
    expect(conferirONome(workflow(), existe, medicao()).map((p) => `${p.tipo}: ${p.oQue}`)).toEqual([]);
  });

  test("a lista do trabalho é achada, e tem os 46 arquivos que a medição rodou", () => {
    const lista = arquivosDoTrabalho(workflow(), TRABALHO_SEM_CLONES);
    // 30 quando a medição do LAB-84 começou, 31 com esta própria trava dentro, e 32 no LAB-85,
    // com a trava da decisão do gatilho (D284), e 33 no LAB-86, com a `configuracao.test.ts` —
    // que estava de fora desde sempre, e é limpa de clone: ela reconta a varredura sobre o
    // `git ls-files` DESTE repositório. E 34 no LAB-87, com a `as-onze.test.ts` — a guarda da
    // reclassificação das onze provas, que lê só `docs/provas/`. E 35 no LAB-88, com a
    // `padrao-da-familia.test.ts` — o ponteiro do Padrão da família, que lê um `.md` daqui e
    // nenhuma rede: *prova recontável que não roda no portão volta a envelhecer*, e procedência
    // é a mesma espécie. E 36 no LAB-89, com a `profundidade-da-historia.test.ts`, que é
    // HERMÉTICA de propósito — a profundidade entra injetada, e o clone raso de verdade fica na
    // ferramenta: *trava que clona no portão paga bateria para medir o que uma injeção mede.*
    // E 37 no LAB-90, com a `caixa-vazia.test.ts` — a guarda das declarações de caixa vazia,
    // também HERMÉTICA: as listas de nomes foram medidas nos clones pela ferramenta e entram
    // aqui como fixture, porque o portão não tem os clones.
    // E 38 no LAB-91, com a `regerar-a-varredura.test.ts` — a trava que REEXECUTA as duas
    // varreduras e compara regra por regra: ela lê só este repositório, e é a proposta do
    // LAB-60 (aberta desde 07/10) executada.
    // E 39 no LAB-92, com a `premissas-identicas.test.ts` — a medição do item 025: ela lê o
    // módulo e os `.geojson` desta casa, e nenhum clone.
    // E 42 no LAB-95, com a `enxugar-o-claude.test.ts` — a conta do item 028: dois `.md` desta
    // casa, um módulo puro e a prova em JSON, nenhum clone.
    // E 41 no LAB-94, com a `preco-do-setimo.test.ts` — a medição do item 027: módulo puro e a
    // prova em JSON, nenhum clone. A ferramenta dela roda o motor e por isso fica de fora.
    // E 40 no LAB-93, com a `legais-do-contrato.test.ts` — a medição do item 026: ela lê módulos
    // puros e a prova em JSON. A irmã dela, `assinatura-da-geometria.test.ts`, NÃO entra: usa a
    // `impressao` do motor, que é leitura do clone vizinho por caminho (D16).
    // E 43 no LAB-99, com a `caminhos-da-pagina.test.ts` — os caminhos que o `CLAUDE.md` cita,
    // conferidos contra a árvore DESTE repositório; nenhum clone.
    // E 44 no LAB-103, com a `prova-de-determinismo.test.ts` — os `.json` de `docs/` e o texto
    // das ferramentas DESTE repositório, um módulo puro; nenhum clone.
    // E 48 no LAB-109, com a `coerencia-do-veredito.test.ts` — os `.json` de `docs/` DESTE
    // repositório e um módulo puro; nenhum clone.
    // E 45 no LAB-104, com a `nome-do-prompt.test.ts` — os `.ts` versionados e os relatórios
    // DESTE repositório, lidos por `git ls-files` e `readdirSync`; nenhum clone.
    // E 46 no LAB-106, com a `antes-do-envio.test.ts` — a decisão do gancho do envio, um
    // repositório temporário criado na trava e o texto do gancho DESTE repositório; nenhum clone.
    // E 47 no LAB-108, com a `veredito-de-identidade.test.ts` — os `.json` de `docs/` e o texto
    // das ferramentas DESTE repositório, um módulo puro; nenhum clone.
    // E 49 no LAB-110, com a `mesmo-valor.test.ts` — os `.ts` versionados e a prova do LAB-39
    // DESTE repositório, lidos por `git ls-files`, e um módulo puro; nenhum clone.
    // E 50 no LAB-111, com a `mesmo-commit.test.ts` — os `.ts` versionados DESTE repositório e um
    // repositório temporário que a própria trava monta com `git fast-import`; nenhum clone.
    // E 51 no LAB-112, com a `numero-da-decisao.test.ts` — os `.ts` versionados, o `RECADOS.md` e a
    // `FILA.md` DESTE repositório, e três módulos puros; nenhum clone.
    // E 52 no LAB-113, com a `numero-do-item.test.ts` — os `.ts` versionados e a caixa de entrada
    // DESTE repositório, e dois módulos puros; nenhum clone.
    // E 53 no LAB-115, com a `numero-de-testes.test.ts` — os `.md` versionados DESTE repositório,
    // lidos por `git ls-files`, e um módulo puro; nenhum clone.
    // E 54 no LAB-116, com a `clone-da-maquina.test.ts` — a página do protocolo DESTE repositório e
    // repositórios `git` montados numa pasta descartável, por `file://`; nenhum clone vizinho.
    // E 55 no LAB-117, com a `nome-do-aplicativo.test.ts` — o `CLAUDE.md` e o `RECADOS.md` DESTE
    // repositório, e um módulo puro; nenhum clone.
    // E 56 no LAB-118, com a `o-indice.test.ts` — o `INDEX.md` e o `git ls-files` DESTE repositório,
    // e um módulo puro; nenhum clone.
    // O número anda quando o trabalho ganha ou perde arquivo, e
    // mudá-lo é deliberado: é a lista que a medição cobriu.
    // E 57 no LAB-119, com a `contagens-do-indice.test.ts` — o `INDEX.md` e arquivos DESTE repositório,
    // lidos como texto; nenhum clone.
    // E 58 no LAB-120, com a `contagens-do-claude.test.ts` — o `CLAUDE.md` e arquivos DESTE
    // repositório, lidos como texto; nenhum clone.
    // E 59 no LAB-121, com a `ramos-abertos.test.ts` — a régua pura e `docs/RAMOS_ABERTOS.md`,
    // lidos como texto; nenhum clone, nenhuma rede (a metade que pergunta à origem fica fora).
    // E 60 no LAB-122, com a `a-rotina-no-github.test.ts` — a régua pura e os arquivos DESTE
    // repositório, lidos por `git ls-files`; nenhum clone, nenhuma rede (a pergunta ao GitHub fica fora).
    // E 61 no LAB-123, com a `marca-de-feito.test.ts` — a régua pura e os `-FEITO.md` da caixa DESTE
    // repositório, lidos como texto; nenhum clone, nenhuma rede.
    // E 62 no LAB-124, com a `pendencias-marcadas.test.ts` — a régua pura e a página do Jonny DESTE
    // repositório, lida como texto; nenhum clone, nenhuma rede.
    // E 63 no LAB-126, com a `o-ultimo-prompt.test.ts` — a régua pura, o `ONDE_PARAMOS.md` e o
    // `RECADOS.md` DESTE repositório, lidos como texto; nenhum clone, nenhuma rede.
    // E 64 no LAB-127, com a `a-tarefa-do-novecentos.test.ts` — o `RECADOS.md`, o `900.md` e os
    // relatórios DESTE repositório, lidos como texto; nenhum clone, nenhuma rede.
    // E 65 no LAB-128, com a `a-data-do-recado.test.ts` — o `RECADOS.md` e o `CLAUDE.md` DESTE
    // repositório, lidos como texto; nenhum clone, nenhuma rede.
    // E 66 no LAB-129, com a `as-cinco-linhas-do-recado.test.ts` — o `RECADOS.md` e o `CLAUDE.md`
    // DESTE repositório, lidos como texto; nenhum clone, nenhuma rede.
    // E 67 no LAB-130, com a `onde-esta-o-detalhe.test.ts` — o `COMO_FUNCIONA.md`, o `RECADOS.md` e
    // os relatórios DESTE repositório, lidos como texto; nenhum clone, nenhuma rede.
    // E 68 no LAB-131, com a `a-sequencia-das-decisoes.test.ts` — o `DECISOES.md` e as páginas DESTE
    // repositório, lidos como texto; nenhum clone, nenhuma rede.
    // E 69 no LAB-132, com a `upstream-intocavel.test.ts` — o `git` DESTE repositório (`ls-files`,
    // `rev-parse HEAD:<pasta>`, `status`) e o `VERSION` do disco; nenhum clone, nenhuma rede.
    // E 70 no LAB-134, com a `generate-nao-depende.test.ts` — só um Generate de mentira escrito no
    // próprio teste e o `CLAUDE.md` DESTE repositório; a do clone mora no verde completo.
    // E 71 no LAB-135, com a `adapter-unica-fronteira.test.ts` — o código e os `tsconfig.json` DESTE
    // repositório (`git ls-files`); o apelido se resolve por aritmética de caminho, sem abrir clone.
    // E 72 no LAB-136, com a `a-fila-em-dia.test.ts` — a `FILA.md`, o `RECADOS.md` e a pasta da caixa
    // DESTE repositório; nenhum clone.
    // E 73 no LAB-138, com a `mescla-declarada.test.ts` — o `git` DESTE repositório (que no clone raso
    // recusa, D295) e um repositório temporário; nenhum clone.
    // E 74 no LAB-139, com a `conferido-aqui-declarado.test.ts` — o `RECADOS.md`, os relatórios, o `verde.yml` e o
    // `CLAUDE.md` DESTE repositório; nenhum clone.
    // E 75 no LAB-140, com a `onde-mora-a-prova.test.ts` — os relatórios, as pastas de provas, a caixa e o `CLAUDE.md`
    // DESTE repositório; nenhum clone.
    // E 76 no LAB-143, com a `medicao-em-metros.test.ts` — as provas JSON e os `.ts` versionados DESTE repositório,
    // lidos por `git ls-files`, e um módulo puro; nenhum clone.
    // E 77 no LAB-144, com a `um-item-por-entrega.test.ts` — a primeira linha da `main` DESTE repositório (recusa no
    // clone raso) e um repositório temporário; nenhum clone.
    // E 78 no LAB-145, com a `um-despertador-por-aplicativo.test.ts` — o `git grep` dos arquivos versionados DESTE
    // repositório e um módulo puro; a metade dos vizinhos mora na `-com-clone`, fora do trabalho.
    // E 79 no LAB-146, com a `o-motor-da-familia-nao-se-copia.test.ts` — o `git ls-files` DESTE repositório e dados
    // plantados; a comparação com os vizinhos de verdade mora na `-com-clone`, fora do trabalho.
    // E 80 no LAB-147, com a `nulo-nunca-zero.test.ts` — o `git ls-files` DESTE repositório, o texto de cada arquivo de
    // código e dados plantados; nenhum clone.
    // E 81 no LAB-148, com a `nada-pago.test.ts` — o `git ls-files` DESTE repositório (código, manifestos e rotinas),
    // o `CLAUDE.md` e dados plantados; nenhum clone.
    // E 82 no LAB-149, com a `pedido-ao-vizinho.test.ts` — os relatórios DESTE repositório, o `CLAUDE.md` e dados
    // plantados; nenhum clone.
    // E 83 no LAB-150, com a `balanco-com-os-campos.test.ts` — o `BALANCOS.md` DESTE repositório, o `CLAUDE.md` e
    // dados plantados; nenhum clone.
    // E 84 no LAB-151, com a `frase-vencida.test.ts` — a árvore DESTE repositório pelo `git ls-files`, o `CLAUDE.md` e
    // dados plantados; nenhum clone.
    // E 85 no LAB-152, com a `o-trabalho-em-archilly.test.ts` — o `git ls-files` e as páginas dos motores DESTE
    // repositório, o `CLAUDE.md` e dados plantados; nenhum clone.
    // E 86 no LAB-153, com a `a-unica-interface.test.ts` — o `git ls-files` DESTE repositório, o `CLAUDE.md` e dados
    // plantados; nenhum clone.
    // E 87 no LAB-154, com a `o-julgamento-vem-do-generate.test.ts` — o `git ls-files` DESTE repositório, a árvore
    // sintática de cada arquivo e dados plantados; não segue import para dentro de clone nenhum.
    // E 88 no LAB-155, com a `nome-interno.test.ts` — a página do Jonny, os arquivos desta casa a que ela manda, a
    // bancada e dados plantados; nenhum clone.
    // E 89 no LAB-156, com a `balanco-nao-se-copia.test.ts` — o `BALANCOS.md`, o `RECADOS.md`, o `CLAUDE.md` e dados
    // plantados; nenhum clone.
    // E 90 no LAB-157, com a `semente-e-carimbo.test.ts` — as provas de `docs/provas/`, o código de `external-engines/`
    // pela árvore sintática, a página das provas e dados plantados; nenhum clone.
    // E 91 no LAB-158, com a `rede-em-execucao.test.ts` — o código que o `git` carrega, o `docs/SEGURANCA.md` e dados
    // plantados; nenhum clone.
    // E 92 no LAB-159, com a `entrada-validada.test.ts` — o `git ls-files` DESTE repositório, as portas de
    // `motores/`, a `gleba-v1.ts`, a ida do Parcelamento, o `docs/SEGURANCA.md` e dados plantados; nenhum clone.
    // E 93 no LAB-160, com a `arquivo-de-credencial.test.ts` — o `git ls-files` e o `git log` DESTE repositório (a
    // história recusa no clone raso), o `docs/SEGURANCA.md` e nomes plantados; nenhum clone.
    // E 94 no LAB-161, com a `o-upstream-nao-sai-do-upstream.test.ts` — o `git ls-files` DESTE repositório, o
    // `docs/SEGURANCA.md` e dados plantados; nenhum clone.
    // E 95 no LAB-162, com a `nenhum-commit-nos-vizinhos.test.ts` — o `docs/SEGURANCA.md` e histórias plantadas;
    // nenhum clone (a história de verdade dos quatro mora na `-com-clone`, no verde completo).
    // E 96 no LAB-163, com a `a-historia-do-upstream.test.ts` — o `docs/SEGURANCA.md` e histórias plantadas; nenhum
    // clone, nenhuma história (a de verdade mora na `-com-historia`, no verde completo: o CI clona raso).
    // E 97 no LAB-164, com a `a-proposta-no-recado.test.ts` — o `COMO_FUNCIONA.md`, a `FILA.md`, o `RECADOS.md` e a
    // marca de FEITO dos itens da caixa; nenhum clone.
    // E 98 no LAB-165, com a `o-que-fazer-onde-como-saber.test.ts` — a página do Jonny e o `COMO_FUNCIONA.md`; nenhum
    // clone.
    // E 99 no LAB-166, com a `a-busca-das-chaves.test.ts` — o `git` desta casa e o `docs/SEGURANCA.md`; nenhum clone.
    // E 100 no LAB-167, com a `a-adocao-da-central.test.ts` — o `git` desta casa e o `docs/ADOCAO_CENTRAL.md`; a metade
    // que precisa dos clones mora na `a-adocao-da-central-com-clone.test.ts`, fora do portão.
    // E 101 no LAB-168, com a `o-que-falta-medir.test.ts` — as afirmações da página sobre o Lab; as dos vizinhos moram
    // na `o-que-falta-medir-com-clone.test.ts`, fora do portão.
    // E 102 no LAB-170, com a `a-especificacao.test.ts` — a `docs/referencia/LABORATORIO.md` e o `git ls-files` desta
    // casa; o commit de nascimento, quando o clone é raso, é dito e não lido.
    // E 103 no LAB-171, com a `a-triagem-do-packingsolver.test.ts` — a página, os cinco lugares, o registro, o
    // `git ls-files` desta casa e a prova gravada; a rede é só da ferramenta `lab171`, fora do portão.
    // E 104 no LAB-172, com a `a-analise-do-esqueleto-reto.test.ts` — a página, os seis lugares, o registro, as duas
    // saídas de `outputs/`, o oráculo do LAB-04, o `git ls-files` desta casa e a prova gravada; a rede é só da `lab172`.
    // E 105 no LAB-174, com a `o-lab-nao-tem-banco.test.ts` — o `git` desta casa e o `docs/SEGURANCA.md`; nenhum clone.
    // E 106 no LAB-175, com a `a-prova-de-navegador.test.ts` — o `git` desta casa, o `docs/SEGURANCA.md` e o produtor da
    // prova do LAB-31; nenhum clone.
    // E 107 no LAB-176, com a `o-wasm-nao-pede-nada.test.ts` — o `git` desta casa, o `docs/SEGURANCA.md`, o `conferir.sh`,
    // os dois instanciadores e as duas crates `cdylib`; nenhum clone.
    // E 108 no LAB-177, com a `os-vizinhos-no-relatorio.test.ts` — o `git` desta casa, os `docs/relatorios/LAB-<n>.md`, o
    // `docs/SEGURANCA.md` e a `regras.test.ts`; nenhum clone.
    // E 109 no LAB-178, com a `o-pedido-na-pagina.test.ts` — o `git` desta casa, o `docs/SEGURANCA.md`, os quatro
    // relatórios que a linha dava de exemplo e a régua do LAB-149; nenhum clone.
    // E 110 no LAB-179, com a `a-ia-na-pagina.test.ts` — o `git` desta casa, o `docs/SEGURANCA.md` e as quatro réguas
    // que perguntam a IA (a chave, a chamada, a porta paga, a rede); nenhum clone.
    // E 111 no LAB-180, com a `o-que-o-navegador-baixa.test.ts` — o `git` desta casa, o `docs/SEGURANCA.md`, a busca
    // do LAB-166 e a lista das pontes do LAB-176; nenhum clone.
    // E 112 no LAB-181, com a `as-cores-da-bancada.test.ts` — o `git` desta casa e o `docs/SEGURANCA.md`; nenhum clone.
    // E 113 no LAB-182, com a `a-rolagem-no-celular.test.ts` — o JSON da medição, o `docs/SEGURANCA.md` e o
    // `conferir.sh` desta casa; nenhum clone (quem abre o Chromium é o `conferir.sh`, antes).
    // E 114 no LAB-183, com a `nada-se-exporta.test.ts` — o `git` desta casa e o `docs/SEGURANCA.md`; nenhum clone.
    expect(lista).toHaveLength(114);
    // Sem duplicata: arquivo repetido roda duas vezes e paga a bateria duas vezes.
    expect(new Set(lista).size).toBe(lista.length);
  });

  test("o arquivo que PRECISA do clone existe, e NÃO está no trabalho", () => {
    const lista = arquivosDoTrabalho(workflow(), TRABALHO_SEM_CLONES);
    expect(Object.keys(DEPENDEM_DE_CLONE)).toEqual([
      "tests/commit-dos-vizinhos-com-clone.test.ts",
    ]);
    for (const arquivo of Object.keys(DEPENDEM_DE_CLONE)) {
      expect(existe(`external-engines/esteira/${arquivo}`)).toBe(true);
      expect(lista).not.toContain(arquivo);
    }
  });

  test("e o irmão dele, SEM as quatro travas, continua NO trabalho", () => {
    // Esta é a metade que a medição comprou: tirar o arquivo inteiro custaria as 10 travas
    // limpas de clone. Se alguém "simplificar" movendo o arquivo todo, esta trava reprova.
    const lista = arquivosDoTrabalho(workflow(), TRABALHO_SEM_CLONES);
    expect(lista).toContain("tests/commit-dos-vizinhos.test.ts");
  });
});

describe("item 017 · O LADO RUIM: cada jeito de a afirmação ficar falsa REPROVA", () => {
  test("pôr o arquivo que depende de clone na lista do trabalho REPROVA", () => {
    const estragado = workflow().replace(
      "            tests/commit-dos-vizinhos.test.ts \\",
      "            tests/commit-dos-vizinhos.test.ts \\\n" +
        "            tests/commit-dos-vizinhos-com-clone.test.ts \\",
    );
    expect(estragado).not.toBe(workflow());
    const p = conferirONome(estragado, existe, medicao());
    expect(p.map((x) => x.tipo)).toContain("arquivo-que-depende-no-trabalho");
    // E a mensagem traz o MOTIVO medido, não só o nome: quem conserta precisa saber quais travas.
    expect(p.map((x) => x.oQue).join(" ")).toContain("4 travas");
  });

  test("RENOMEAR o trabalho REPROVA — a afirmação mudou, e a régua tem de mudar com ela", () => {
    const estragado = workflow().replace(TRABALHO_SEM_CLONES, "guardas rápidas");
    const p = conferirONome(estragado, existe, medicao());
    expect(p.map((x) => x.tipo)).toEqual(["trabalho-nao-encontrado"]);
  });

  test("lista que a régua não acha é PROBLEMA, não aprovação", () => {
    const soONome = `jobs:\n  x:\n    name: ${TRABALHO_SEM_CLONES}\n    steps: []\n`;
    const p = conferirONome(soONome, existe, medicao());
    expect(p.map((x) => x.tipo)).toEqual(["lista-vazia"]);
  });

  test("arquivo listado que não existe REPROVA — o trabalho inteiro falharia nele", () => {
    const estragado = workflow().replace(
      "tests/pagina.test.ts \\",
      "tests/arquivo-que-nunca-existiu.test.ts \\",
    );
    expect(estragado).not.toBe(workflow());
    const p = conferirONome(estragado, existe, medicao());
    expect(p.map((x) => x.tipo)).toContain("arquivo-da-lista-nao-existe");
  });

  test("arquivo no trabalho SEM linha na medição REPROVA — afirmação sem prova", () => {
    // A régua não relê o fonte: ela cobra a MEDIÇÃO por execução. Arquivo novo no portão sem
    // ninguém ter rodado o `lab84` é exatamente o caso em que o CI desligado não desmente nada.
    const semEsse = medicao().filter((m) => m.arquivo !== "tests/pagina.test.ts");
    const p = conferirONome(workflow(), existe, semEsse);
    expect(p.map((x) => x.tipo)).toContain("sem-medicao");
    expect(p.map((x) => x.oQue).join(" ")).toContain("bun run lab84");
  });

  test("arquivo no trabalho que a medição viu REPROVANDO sem clone REPROVA", () => {
    // É o caso que o LAB-84 achou de verdade, e o único que decide a afirmação do nome.
    const comUmVermelho = medicao().map((m) =>
      m.arquivo === "tests/pagina.test.ts"
        ? { ...m, saida: 1, asQueReprovam: ["uma trava qualquer que precisa do clone"] }
        : m,
    );
    const p = conferirONome(workflow(), existe, comUmVermelho);
    expect(p.map((x) => x.tipo)).toContain("medido-reprovando-sem-clone");
    // A mensagem traz QUAL trava reprovou: número sozinho manda recontar à mão (D272).
    expect(p.map((x) => x.oQue).join(" ")).toContain("precisa do clone");
  });

  test("declarado que deixou de existir REPROVA — lista que não se revalida envelhece", () => {
    const p = conferirONome(workflow(), (c) => !c.includes("com-clone") && existe(c), medicao());
    expect(p.map((x) => x.tipo)).toContain("declarado-que-nao-existe");
  });
});
