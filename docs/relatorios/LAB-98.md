# LAB-98 — O número de travas do portão: 698 em seis lugares, 719 rodadas (item 900, dívida própria)

**Data:** 13/10/2026, disparo das 07:07 UTC · **Decisão:** D325 · **Conferido aqui, não no GitHub.**

## 1 · De onde veio a tarefa

A caixa só tinha o **900**, contado na `origin/main` depois do `git fetch`. O LAB-97 deixou escrito
que as propostas da `FILA.md` que não esperam ninguém tinham acabado — a do LAB-78 espera o olho do
Jonny, a 2 do LAB-96 muda o contrato de saída (proposta ao chat), a 3 espera dado do arquivo de
terreno — e que **o próximo disparo procura na dívida própria antes de anotar vazio**. Fiz isso.

**A espécie achada: número digitado à mão.** O `CLAUDE.md` §7 diz *"o das **698 travas que leem
arquivo do próprio repositório**"*. Rodei a lista.

## 2 · O defeito, medido antes do conserto

```
bun test <os 42 arquivos do trabalho guardas-sem-clones>
 719 pass · 0 fail · Ran 719 tests across 42 files.
```

| onde | dizia |
|---|---|
| `CLAUDE.md` §7 | 698 |
| `docs/ONDE_PARAMOS.md` (tabela dos trabalhos do CI) | 698 |
| `docs/prompts/FILA.md` (LAB-38) | 698 |
| `.github/workflows/verde.yml`, comentário do alto | 698 |
| `.github/workflows/verde.yml`, receita impressa | 698 |
| `docs/provas/LAB-84/as-trinta-por-execucao.json`, `quantasTravasNaLista` | 698 (medido 12/10, 16:36) |

**E as duas travas que vigiam o número estavam VERDES** — demonstrado, não suposto: com a prova
velha no lugar, `regras.test.ts -t "MESMO em todo lugar"` deu **1 pass · 0 fail**. Elas eram de
concordância: as cópias entre si (LAB-42) e as cópias contra a prova do LAB-84 (LAB-93, D311). A
prova é medida à mão por `bun run lab84`, e o LAB-96 e o LAB-97 puseram 21 travas em arquivos da
lista (o `acesso-sugerido.test.ts` foi de 52 para 65 só no LAB-97) sem rodá-la.

## 3 · O que foi feito, arquivo por arquivo

| arquivo | o que mudou |
|---|---|
| `external-engines/esteira/src/contar-as-travas.ts` | novo: `lerARodada` lê *"Ran N tests across M files."* (`null` sem a linha, nunca zero — D23); `conferirAContagem` nomeia cada lugar que diverge |
| `external-engines/esteira/tests/contar-as-travas.test.ts` | novo, **7 travas**: três da leitura, três da comparação (lado bom, lado ruim com o 698 de hoje, `null` reprova) e **a recontagem**: roda a lista, exige arquivos rodados = arquivos da lista, e confere as cinco cópias e a prova |
| `external-engines/esteira/src/regerar-a-varredura.ts` | a prova do LAB-84 entrou em `AS_ESPECIES` como função da árvore, regerada pela trava — só a soma |
| `docs/provas/LAB-84/as-trinta-por-execucao.json` | regerada por `bun run lab84`: **42 de 42 passam sem os clones**, 719 travas |
| `CLAUDE.md`, `ONDE_PARAMOS.md`, `FILA.md`, `verde.yml` (2×) | 698 → **719**, contado |
| `docs/provas/LAB-52`, `LAB-57`, `item-004` | regeradas por estado: os dois arquivos novos mudam o tamanho do universo das varreduras (nenhum achado novo), e a linha nova da conta dos disparos |

## 4 · A trava, dos dois lados

- **Lado ruim, o estado real de antes** (prova em 698): a trava nova **reprova** e nomeia os seis
  lugares — `CLAUDE.md: escrito 698, contado 719`, …, `as-trinta-por-execucao.json: escrito 698,
  contado 719`. A trava velha, no mesmo estado, **passava**.
- **Lado ruim, só as cópias velhas** (prova já regerada): reprova nas cinco cópias e deixa a prova.
- **Lado bom, depois do conserto:** 7 pass.

## 5 · As escolhas que a regra não responde, e as que descartei

**A trava fica FORA da lista que ela roda.** Rodar a lista de dentro de um arquivo da lista é a
lista se rodando a si mesma; há trava que reprova se alguém a puser lá. Ela roda no verde completo
(`conferir.sh`), que é onde o número se escreve e se commita. Custa ~10 s na suíte.

**Descartei contar `test(` por regex.** Mede texto, não suíte: as duas formas que tentei deram
**688** e **739**, contra **719** rodadas — há travas dentro de laço `for`. A própria trava do LAB-42
já dizia isso em comentário, e por isso nunca recontou.

**Descartei tirar o número do texto.** Seria a saída honesta se não houvesse como medir; havendo, o
número escrito passa a ser cobrado e deixa de envelhecer calado.

**A prova do LAB-84 é regerada só na soma.** O *"passam sem clone"* depende de ambiente (cópia sem os
vizinhos) e continua sendo da ferramenta; o motivo está na linha de `AS_ESPECIES`.

## 6 · Conferido aqui, não no GitHub

`./external-engines/conferir.sh` nesta máquina, com os três vizinhos clonados com a história inteira
(eram clones rasos; aprofundei) e no `origin/main` (Generate `4910ca8`, Laboratório de Parcelamento
`b1c4d03`, Geo `0749b49`), `git status` limpo nos três ao fim:

- esteira **1 008 pass · 9 fail** (eram 1 001 · 9; +7 travas); as 9 são as mesmas do LAB-97, todas do
  `.wasm` do Symbios, que não existe nesta máquina;
- testfit **17 · 0**; typecheck e lint limpos nos dois pacotes;
- precondição do `.wasm` e prova de navegador falham **antes e depois**, iguais.

Receita da máquina nova, a mesma do LAB-96: `bun install --frozen-lockfile` na esteira e no testfit,
e o `zod` no clone do Generate por `npm pack zod@3` extraído em `node_modules/zod`.

## 7 · O que fica

- **Nada depende do Jonny.**
- **Proposto ao chat, nada novo.**
- Para o próximo disparo só com o 900: a dívida própria tem outras espécies a varrer — o caminho que
  achou esta foi **rodar o número que um arquivo afirma** em vez de ler a trava que diz vigiá-lo.
