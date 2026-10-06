# LAB-49 · O detector de prova velha para o LAB-25 e o LAB-30

**06/10/2026** · prompt da fila de 06/10, o segundo. Saiu da minha própria lista de
*"proposto ao chat"*, escrita no LAB-43 (D156).

## 1 · A dívida, e o que a falta dela custou

O **LAB-33** criou o detector de prova velha (D131) e o deu a **duas** provas — a do
LAB-23 e a do LAB-28. As outras ficaram sem, e **duas apodreceram em silêncio** até o
LAB-43 as regerar e descobrir (D156):

| prova | velha desde | a mentira que ela publicava |
|---|---|---|
| `LAB-30/guarda-da-ida.json` | **LAB-40** | o inventário da ida tinha ido de **72 para 74 campos**, e a prova dizia 72 |
| `LAB-25/guarda-da-ponte.json` | **LAB-37** | em `geo-antonina` a variante que o motor escolhe passou a ser a de **33 lotes** |

**Nenhuma das duas reprovou nada enquanto mentia.** Esse é o ponto inteiro:

> **Prova que ninguém reconfere é afirmação com data.**

## 2 · O detector mede da FONTE, não compara prova com prova

A regra é do LAB-39 (D144), e foi paga lá: duas provas saídas da **mesma fórmula** erram
juntas — erradas do mesmo jeito, batem, e o verde é falso. Então cada número é confrontado
com **quem o produz**:

| o que a trava confere | contra quem |
|---|---|
| `inventario.{parcelamento,symbios}` — campos e os quatro destinos | recontado de `IDA_DO_PARCELAMENTO` / `IDA_DO_SYMBIOS` |
| `idasAuditadas`, `pontesAuditadas` | `IDAS_AUDITADAS`, `PONTES_AUDITADAS` |
| o conjunto e a **ordem** das glebas | relidos das fixtures — 7 no LAB-30, 5 no LAB-25 |
| `contrato` | `contratoDasEntradas()` das entradas daquele conjunto (D146) |
| `semente` | a constante que as ferramentas usam |
| as **chaves** de `porRegra` | `REGRAS_DA_IDA` / `REGRAS_DA_PONTE` — ver §4 |
| `faceDeRua` de `geo-antonina` — lotes, nulos e publicados | **o motor rodando** |

**A trava de motor é uma só, e o preço dela é declarado:** uma rodada do Parcelamento em
`geo-antonina`, ~6 s. Ela existe porque é **exatamente** o campo que envelheceu no LAB-37.
*E o teto padrão de 5 s do `bun test` a reprovava por tempo* — reprovar pelo motivo errado
é pior que não reprovar, então o teto dela está escrito em 60 s, com o porquê ao lado.

## 3 · O ESCOPO sai como NÚMERO — **11 de 19** (D170)

Detector que confere três campos de vinte é o escopo estreito da Pesquisa com outro nome,
e foi o LAB-47 que me ensinou que **a defesa contra isso é publicar o número** (D164).

```
LAB-25/guarda-da-ponte.json   5/8  alcançadas · medida 4 · em parte 1 · declarada 2 · não medida 1
LAB-30/guarda-da-ida.json     6/11 alcançadas · medida 5 · em parte 1 · declarada 2 · não medida 3
TOTAL                        11/19
```

**Cada chave de primeiro nível das duas provas está classificada** em `medida`,
`medidaEmParte`, `declarada` ou `naoMedida` — esta última **com o motivo escrito** —, e a
lista mora em [`src/escopo-do-detector.ts`](../../external-engines/esteira/src/escopo-do-detector.ts),
**fora do teste**, porque número que só existe dentro de um teste não sai em prova nenhuma.

**Há trava nas duas direções:** chave nova na prova que ninguém classificou **reprova**, e
chave classificada que desapareceu da prova **reprova**. É o padrão da lista que se
revalida (LAB-36, LAB-43) — lista que ninguém reconfere envelhece igual a comentário (D104).

**O que NÃO é alcançado, e por quê** — quatro chaves, todas pelo mesmo motivo de custo:
`porRegra` nas **contagens**, `reprovamNoTotal`, `dividasDoLab` e
`promessasQueNenhumaGlebaExercita`. Recontá-las é **auditar as duas pontes/idas em todas as
glebas com os motores rodando** — é a ferramenta inteira dentro de um teste. Os valores que
importam (os zeros) já têm trava própria nas `guarda-da-ponte.test.ts` e
`guarda-da-ida.test.ts`.

## 4 · As regras das duas guardas viraram DADO (D171)

`RegraDaIda` e `Regra` são **uniões de tipo**, e **tipo não existe em tempo de execução**
(D157) — então o detector não tinha contra o que conferir o `porRegra` de uma prova.

Nasceram `REGRAS_DA_IDA` (5) e `REGRAS_DA_PONTE` (3), **ao lado das uniões e travadas a
elas em tempo de compilação**: se a lista e a união divergirem, **não compila**. É
literalmente o conserto do LAB-44, aplicado a um segundo lugar pelo mesmo motivo — e a
segunda vez que *"tipo não existe em tempo de execução"* custa uma guarda cega.

## 5 · Provado por SABOTAGEM — e duas delas são as mentiras históricas (D126)

Detector que nunca reprovou é confiança, não prova. Quatro sabotagens, cada uma desfeita em
seguida:

| sabotagem | antes | depois | histórica? |
|---|---|---|---|
| inventário da ida: **74 campos viram 72** | 15 pass · 0 fail | **14 pass · 1 fail** · exit 1 | **sim** — a mentira exata do D156 |
| `porRegra` da ida perde a regra `divida-do-lab` | 15 · 0 | **14 · 1** · exit 1 | não |
| `faceDeRua` de `geo-antonina`: **33 lotes viram 1 228** | 15 · 0 | **14 · 1** · exit 1 | **sim** — a mentira do LAB-37 |
| campo novo na prova, fora do `ESCOPO` | 15 · 0 | **14 · 1** · exit 1 | não |

**Depois de restaurar tudo: 15 pass · 0 fail · exit 0.**

**Duas das quatro não são invenções minhas: são o que as provas de fato publicavam.** O
detector foi apontado para o passado e **morderia nos dois casos** — que é o único teste
honesto de um detector de prova velha.

## 6 · O que o prompt achou contra mim, e os dois são de método

### 6.1 · O escopo raspou por baixo da metade, e eu quase baixei a régua (D172)

A primeira versão deu **9 de 19** — e a minha própria trava *"o detector alcança mais da
metade"* reprovou por **meio ponto**. A tentação foi óbvia: trocar `> metade` por
`>= metade`, ou tirar a trava.

**O conserto foi MEDIR MAIS** — publicar as regras das duas guardas como dado (§4) e
reconferir as chaves do `porRegra`, o que levou o número a **11 de 19**. É o contrário
exato do D143: *lá o CI pegou uma trava que só valia na minha máquina e eu a consertei sem
afrouxar; aqui a trava pegou o meu escopo e o conserto foi o escopo crescer, não a trava
encolher.*

> **Régua que eu afrouxo quando ela me reprova não é régua, é enfeite.**

### 6.2 · Eu quase declarei velha uma prova que não está (a forma do D133/D151)

A prova do LAB-30 publica `promessasQueNenhumaGlebaExercita` com **6 entradas**, e o LAB-40
publicou que esse número tinha ido de **6 para 0**. Em cima disso eu tinha nas mãos *"a
prova do LAB-30 está velha nesse campo também"*.

**Medido: não está.** A ferramenta do LAB-30 mede **sete** glebas; o *"6 → 0"* do LAB-40 foi
medido sobre **dez**, com as duas fixtures que aquele prompt criou. **São conjuntos
diferentes**, e comparar os dois números é comparar coisas que não se comparam — a forma
exata do D133 (eu contei posições em que um motor não respondeu) e do D151 (controle com
menos medição que o acusado).

**E a lição virou código:** a classificação daquele campo no `ESCOPO` carrega o aviso por
escrito, para quem for comparar na próxima vez ler antes de concluir. *O conjunto medido é
parte do número.*

## 7 · Entrega

| o quê | onde |
|---|---|
| a trava, 15 travas | [`tests/prova-velha.test.ts`](../../external-engines/esteira/tests/prova-velha.test.ts) |
| o escopo, como dado | [`src/escopo-do-detector.ts`](../../external-engines/esteira/src/escopo-do-detector.ts) |
| as regras como dado | `REGRAS_DA_IDA` e `REGRAS_DA_PONTE`, com trava de tipo |
| a ferramenta | [`ferramentas/lab49.ts`](../../external-engines/esteira/ferramentas/lab49.ts) · `bun run lab49` |
| a prova | [`docs/provas/LAB-49/detector-de-prova-velha.json`](../provas/LAB-49/detector-de-prova-velha.json) |

**A prova não mede gleba** — mede duas provas e uma trava —, então entrou na **lista
declarada de exceções** do §7, com o motivo escrito.

**A trava NÃO entra no trabalho do CI que roda sem os clones vizinhos**, e o motivo é
medido: ela roda o motor do Parcelamento, que é clone privado. O número de travas daquele
trabalho **continua 98**. *Pôr lá uma trava que precisa de clone seria o D143 de novo —
verdadeira nesta máquina e falsa no runner.*

**Nada foi escrito em repositório vizinho**; os três clones foram conferidos e estão limpos.

## 8 · As decisões

- **D170** — o detector de prova velha alcança as provas do LAB-25 e do LAB-30, **medindo
  da fonte** (D144), com o **escopo publicado como número** (11 de 19), cada chave
  classificada, motivo escrito para o que não é alcançado e trava nas duas direções;
- **D171** — as regras das duas guardas passam a ser **dado** (`REGRAS_DA_IDA`,
  `REGRAS_DA_PONTE`) com trava de tipo: **segunda vez** que *"tipo não existe em tempo de
  execução"* custa uma guarda cega (D157);
- **D172** — **régua que eu afrouxo quando ela me reprova não é régua, é enfeite**: o escopo
  deu 9 de 19 e raspou por baixo da minha própria trava; o conserto foi medir mais, até 11.
