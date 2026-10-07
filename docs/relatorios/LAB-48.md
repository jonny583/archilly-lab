# LAB-48 · As 128 violações do motor padrão, uma a uma — e os QUATRO culpados

**06/10/2026** · prompt da fila de 06/10, o primeiro, **prioridade**. **Diagnóstico, não
conserto** — nada foi consertado neste prompt, por ordem expressa do chat:

> *"Traga o diagnóstico antes de consertar qualquer coisa — o Generate está fazendo o mesmo
> diagnóstico do lado dele, e eu quero os dois para comparar."*

**A pergunta dele, em três partes:** quais são as violações, uma a uma; são do **motor** ou
da **régua**; e o conserto é **aqui ou lá**. E uma ressalva que ele mesmo pôs, e que virou o
método: *"pode ser que o Validator esteja medindo coisa que este motor nunca prometeu."*

---

## 0 · A resposta, antes da conta

**São 128 violações, quatro invariantes — e quatro culpados DIFERENTES.** Nenhuma das três
respostas que a pergunta oferecia serve sozinha.

| invariante | n | de quem é | o conserto é |
|---|---:|---|---|
| **`testada`** | **47** | **36 da PONTE DESTE REPOSITÓRIO** + 11 do motor | **36 aqui**, 11 lá |
| **`frente`** | **56** | 11 do **contrato + tradutor do Generate** · 18 do motor · **27 ainda não atribuídas** | 11 lá · 18 lá · 27 a medir |
| **`face-quadra`** | **14** | **do motor**, e a hipótese de ponte foi medida e morreu | lá |
| **`via-sobre-lote`** | **11** | **do motor** — a passagem externa dele | lá |

```
MOTOR ................ 54  (42 %)
PONTE DESTE LAB ...... 36  (28 %)   ← e eu ia publicar estas como defeito do motor
CONTRATO/TRADUTOR .... 11  ( 9 %)   ← no Generate
AINDA NÃO ATRIBUÍDAS . 27  (21 %)
```

**E a resposta à pergunta que importa — *"a tela nasceria com ranking vazio"* — é SIM, e
continua sim depois dos dois consertos de fora do motor.** Gleba por gleba, descontando as
36 da minha ponte e as 11 do contrato:

| gleba | hoje | depois dos consertos que NÃO são do motor | passa? |
|---|---:|---:|---|
| `completo` | 25 | **25** | não |
| `sintetico-50ha-ondulado` | 18 | **17** | não |
| `sintetico-10ha-plano` | 29 | **4** | não |
| `ensaio-47ha` | 16 | **6** | não |
| `geo-antonina` | 40 | **29** | não |

**Nenhuma das cinco limpa.** Consertar a minha ponte e o contrato do Generate derruba 47 das
128 e **não aprova uma única gleba**: o ranking só deixa de nascer vazio quando as 54 do
motor e as 27 em aberto tiverem resposta. Isto é o que o chat precisa saber antes de
escolher onde gastar o conserto.

---

## 1 · Como a medição foi feita, e a precondição que ela tem

A ferramenta é [`ferramentas/lab48.ts`](../../external-engines/esteira/ferramentas/lab48.ts)
(`bun run lab48`), e a prova é
[`docs/provas/LAB-48/violacoes-do-motor-padrao.json`](../provas/LAB-48/violacoes-do-motor-padrao.json).

**A rodada é a do Lab, sem nenhum ajuste** — a mesma `rodarTestfit` que a tabela publica.
Medir outra rodada responderia outra pergunta (D149).

**A tampa dos exemplos, e ela é uma precondição de verdade.** O relatório do Validator
publica `violacoes` como **número** e só **cinco exemplos** — o certo em produção, porque o
relatório viaja no payload do plano. O próprio Generate deixou a tampa levantável para quem
investiga (`INVARIANTES_EXEMPLOS`, criada na investigação A438 dele). Então a ferramenta a
levanta **e confere**: se `exemplos.length` não bater com `violacoes`, ela **para com a
receita**. *Medir "uma a uma" lendo 5 de 128 seria o D110 em miniatura.*

**E o contrafactual é geometria DELES, não minha.** Onde eu precisei perguntar *"e se o campo
que falta estivesse preenchido?"*, a faixa é construída pela função `faixaViaPublica()` **do
Generate**, sobre a divisa que o `divisaDoAcesso()` **do Generate** escolhe. Nenhuma régua
minha entra no contrafactual — e isso importa, porque um contrafactual com régua minha
mediria a minha opinião.

---

## 2 · `testada` — 47 · **TRINTA E SEIS SÃO A MINHA PONTE** (D166)

**É a décima quarta vez do ponto cego da §6, e foi pega dentro do prompt.** Eu estava a um
passo de escrever *"o motor padrão desenha 47 lotes com testada abaixo da mínima"*.

### O que a régua diz

```
testada 11.45 < 11.70820393249937        (47 vezes, em 4 das 5 glebas)
```

O limite efetivo é `testadaMin × 0,98`, e **o déficit mediano é 1,94 cm**. Lotes de
**316,7 m² para cima**, contra uma área mínima de 200. Isto não tem cara de lote ruim.

### E o número 11,70820393249937 não é declarado por ninguém

**A entrada declara `testadaMinLote_m = 10` m — nas cinco glebas.** O que chega ao Validator
é **11,7082…**, e esse número tem origem exata:

```
ida.ts:379   testadaAlvo = max(10, √(360/2)) = max(10, 13,4164) = 13,4164
ida.ts:380   padroes["testada"] = faixa(10 , 13,4164)
             → o meio dessa faixa é (10 + 13,4164)/2 = 5 + 3√5 = 11,70820393249937
```

**É o ALVO de testada da variante** — o valor que o motor sorteia dentro da faixa que a
**minha ida** monta. E a **minha volta** o escreve em
`parametrosUsados.testadaMinLote_m` — o campo cujo nome é **MÍNIMO**:

```ts
// external-engines/testfit/adapter/src/volta.ts, em `parametrosAplicados`
areaMinLote_m2:   doContrato.areaMinLote_m2,          // ← certo: o mínimo é do contrato
areaAlvoLote_m2:  areaLote ?? doContrato.areaAlvoLote_m2,  // ← certo: o alvo é o sorteado
areaMaxLote_m2:   doContrato.areaMaxLote_m2,
testadaMinLote_m: testada ?? doContrato.testadaMinLote_m,  // ← ERRADO: o alvo no mínimo
```

**A própria função escreve, quatro linhas acima, a regra que a quinta linha quebra:**

> *"Mínimo e máximo continuam sendo os do contrato: o motor não os relaxa, ele mira dentro
> deles. **O que ele escolhe é o ALVO.**"*

**E há um motivo para o defeito existir, que é o achado de contrato:** o contrato de motor
v1 tem `areaMinLote_m2` **e** `areaAlvoLote_m2`, mas para a testada tem **só o mínimo**. O
alvo sorteado não tinha onde morar — e foi morar no mínimo.

### A prova: 36 das 47 somem com o mínimo declarado

Rodando o Validator com `params.testadaMin` **= 10 m, o que a entrada declara**:

| | n | o que são |
|---|---:|---|
| **somem** | **36** | testada de ~11,45 m, que passa os 10 m declarados com 1,45 m de folga |
| **sobram** | **11** | testada de **3,56 · 6,39 · 6,81 · 7,75 · 8,14 · 8,41 · 8,41 · 8,45 · 8,49 · 8,88 · 9,59 m** — abaixo dos 10 m declarados, e essas são **do motor** |

**Conserto:** as 36 são **AQUI**, e são uma linha — `testadaMinLote_m` tem de sair do
contrato, como o `areaMinLote_m2` já sai. **Não executado**, porque o chat pediu o
diagnóstico antes. E vai junto um item para o Generate: **o contrato precisa de
`testadaAlvoLote_m`**, senão o alvo volta a não ter onde morar.

> **Campo cujo nome diz MÍNIMO e cujo valor é um ALVO não é um campo errado: é uma acusação
> automática.** Nenhum motor sobrevive a ser medido contra o próprio alvo com 2 % de folga.

---

## 3 · `frente` — 56 · três situações, e a distância separa as três

O rótulo é *"sem frente para rua"* — o invariante exige que alguma aresta do lote encoste
numa superfície de via.

### 3.1 · As 29 de `geo-antonina`: 11 são o contrato, 18 são o motor

As 29 são lotes da passagem externa do motor. **E a distância medida separa-as em duas
famílias limpas** — a lição do D161, que me custou uma publicação errada por ter classificado
pelo id `-eN`:

| distância até a testada entregue | n | some com `faixaViaPublica`? |
|---|---:|---|
| **0 m** (encostam) | **11** | **sim, as 11** |
| 15,7 · 28,9 · 42,1 · 55,2 · 68,4 · 81,6 · 94,7 · 107,9 · 121,1 · 134,2 · 147,4 · 160,6 · 173,7 · 186,9 · 200,1 · 213,2 · 226,4 · **1 805,7** m | **18** | **não, nenhuma** |

**As 11 são o CONTRATO, e o Generate já tem o conceito pronto.** O `invariantes.ts` dele diz,
por extenso:

> *"Superfícies onde um lote pode fazer frente: faixa de via + bulbo de retorno + **a RUA
> PÚBLICA, quando existe**. (…) O lote de loteamento faz frente para ela **por definição**, e
> ela corre **por FORA** do terreno: tratá-la como leito reprovaria exatamente o lote
> bem-feito."*

O campo existe (`resultado.faixaViaPublica`), o invariante o usa, e há até uma bandeira por
lote (`deLoteamentoFachada`) que troca o mínimo de testada pelo do regime de fachada.
**Medido: nada disso chega.** O tradutor `paraResultado` do **próprio Generate** nunca
preenche `faixaViaPublica`, e nenhum dos 2 299 lotes das cinco glebas traz a bandeira —
**zero**. E não é esquecimento do tradutor: **o contrato de motor v1 não tem campo onde um
motor declare a rua pública existente**, então não há o que traduzir.

**Isto CORRIGE o que eu publiquei no D159**, e a correção é fina. Eu escrevi que *"o mesmo
lote é 'de frente para a rua existente' por uma régua e 'sem frente para rua' pela outra"* —
como se fossem **duas réguas discordando**. **Não são.** A régua do Generate **concorda** com
o motor: ela aceitaria esses lotes se soubesse que a rua existe. Há **uma** régua e **um
campo que falta**. A metade do D159 que estava certa continua certa (o contrato não tem como
dizer); a moldura de *"duas réguas"* estava errada, e saiu em três lugares — relatório do
LAB-45, item 7 do Jonny e a nota da tabela comparativa.

**As 18 são o MOTOR**, e são exatamente a pergunta do LAB-50, agora com número: a passagem
externa põe lote a **15,7 m até 1 805,7 m** da única face entregue. Faixa de rua pública
nenhuma alcança um lote a 1,8 km. **Não amplio escopo aqui** — o LAB-50 é o próximo da fila.

### 3.2 · As 27 fora de Antonina: **não atribuídas, e digo isso em vez de escolher**

Nenhuma é externa. Medida a **distância ao eixo da via mais próxima**, com a largura dela:

| | |
|---|---|
| distância ao eixo | **5,0 a 39,2 m** (mediana 16,8) |
| caixa das vias | 10 e 11,5 m |
| **distância menos meia-caixa** | **−0,05 · 0,0 · 0,0 · 0,0 · 0,2 · 1,2 · 1,6 · 3,1 · 5,6 · 5,9 · 11,1 · 11,8 …** |

> ~~**Oito estão a 0,2 m ou menos da borda do leito** — uma delas **encostando**
> (−0,05 m).~~ **FALSO, corrigido no LAB-54 (D185): são CINCO.** A lista está impressa na
> linha de cima deste próprio relatório — `−0,05 · 0,0 · 0,0 · 0,0 · 0,2 · 1,2 · 1,6 · 3,1 ·
> …` —, e cinco dela são ≤ 0,2 m; o **oito** é a contagem até **3,1 m**. Eu escrevi o número
> **de memória, com a lista ao lado**. *Riscado e não apagado* (D161) — e a parte útil é que
> **a régua do Generate confirma 4 dos 5**: o quinto, `v12-l469`, está a exatamente 0,2 m
> pela minha régua e **continua sem frente** pela dele. *Número que o próprio relatório
> lista ao lado não se escreve de memória.*

As outras estão 1,2 a 11,8 m **recuadas**, e essas não têm frente nenhuma: é lote de miolo.

**E as 27 foram ATRIBUÍDAS no LAB-54** — veja
[`LAB-54.md`](LAB-54.md): **23 do motor** (borda a mais de 0,62 m de qualquer superfície
viária, 0 m² sobre leito) e **4 da régua, só no RÓTULO dela** — o lote encosta, com 2,04 a
4,16 m de frontagem, e consertar a amostragem **não derruba violação nenhuma**: as 4 só
trocariam `frente` por `testada` (D184).

**Por que eu paro aqui e não atribuo:** a minha régua é *distância ao eixo menos meia-caixa*,
e a do Validator é `_testadaDoLote` contra as `superficiesDeFrente` dele — que incluem bulbo
de retorno e têm a tolerância `TOL_APOIO_VIA_M` de 0,75 m. **As duas não são a mesma régua**,
e usar a minha para dizer *"a régua dele erra em 8 casos"* seria exatamente a forma do D93 e
do D127. O que falta é **uma** medição: a testada que o `_testadaDoLote` calcula para esses
oito, contra a superfície que ele mesmo monta. **Fica declarado como o que falta**, e é o
único pedaço das 128 sem culpado.

---

## 4 · `face-quadra` — 14 · **do motor**, e a hipótese de ponte morreu medida (D167)

O rótulo é *"em quadra com face acima do teto legal"*, e o teto é **200 m** — número redondo,
**declarado na entrada** das cinco glebas.

**Os dois lados concordam sobre o teto, e isso está medido:**

- a entrada declara `faceQuadraMax_m = 200`;
- a **minha ida entrega**: `padroes["comprimentoQuadra"] = faixa(200, 200)` — faixa **fixa**,
  não há como o motor sortear outro valor (`ida.ts:387`);
- o que chega ao Validator também é **200**.

**E as quadras acusadas não são marginais:**

| gleba | faces da quadra acusada (as duas maiores) |
|---|---|
| `sintetico-50ha-ondulado` | 381/354 · 351/313 · 412/385 · 361/354 · 416/413 · 395/357 · 352/340 · 400/312 |
| `ensaio-47ha` | **597/586 · 570/558 · 597/597 · 556/544 · 597/597 · 597/597** |

As faces curtas de todas elas são **59 a 112 m** — a profundidade da fileira. As longas são
**1,8 a 3,0 vezes o teto**.

### A hipótese que eu tinha de descartar antes de acusar o motor

*"E se as quadras chegassem fundidas pela minha ponte?"* — três quadras de 199 m viradas uma
de 597 m na tradução dariam exatamente este número, e a culpa seria minha. **Medido na SAÍDA
CRUA do motor, sem o Generate no meio:**

```
ensaio-47ha · variante espinha · 6 quadras · 599 lotes
  Q1  faces=[596.9, 586.2, 69.4, 59.7]  lotes=101
  Q2  faces=[570.3, 558.0, 69.4, 68.3]  lotes=97
  Q3  faces=[596.9, 596.9, 69.4, 69.4]  lotes=102
  Q4  faces=[556.2, 543.9, 69.4, 68.3]  lotes=95
  Q5  faces=[596.9, 596.9, 69.4, 69.4]  lotes=102
  Q6  faces=[596.9, 596.9, 69.4, 69.4]  lotes=102
```

**O motor entrega seis quadras de ~597 × 69 m, com ~100 lotes cada.** A ponte não fundiu
nada: ela recebeu seis e passou seis. **Hipótese morta, e morta por medição.**

### Por que o motor faz isso, lido no código dele (só leitura)

O formato espinha corta **num eixo só**:

```ts
// motor-testfit, formatos.ts:320
const faceQuadra = Math.max(60, a.comprimentoQuadra);
const nCortes = Math.max(1, Math.round(larg / (faceQuadra + a.caixaSecundaria)));
```

O `comprimentoQuadra` governa o **espaçamento dos cortes transversais**. A outra dimensão da
quadra é **o corrimento da fileira**, que vem da geometria da gleba e **não passa por esse
teto**. Daí 597 × 69: o 69 é cortado, o 597 não.

**Mesmo assim, a atribuição é do motor, e não da régua.** Perguntei *"o que este campo faz no
motor?"* — a pergunta do D127 — e a resposta é *"corta um eixo"*. Mas o parâmetro chama-se
**"Tamanho da quadra"** no painel dele, com limites de 100 a 220 m, e **face de quadra de
597 m é problema urbanístico de verdade, não artefato de medição**: quem pede quadra de 200 m
não está pedindo um eixo de 200 m. A régua do Generate mede a regra certa. **Conserto: lá, no
motor do Parcelamento** — aparar também o corrimento da fileira.

---

## 5 · `via-sobre-lote` — 11 · **do motor**, e nenhum contrafactual os salva

Todos os 11 são lotes da passagem externa de `geo-antonina` (`v19-e5` a `v19-e15`), todos a
**0 m** da testada, e todos com o mesmo detalhe:

```
v19-e5   intersecta leito de via V2 em  68.5 m²
v19-e6   intersecta leito de via V2 em 137.1 m²
v19-e7   intersecta leito de via V2 em 157.4 m²
v19-e8   intersecta leito de via V2 em 157.4 m²   (… 11 no total)
```

**O lote está em cima do leito de uma via que o próprio motor desenhou**, de 68,5 a 157,4 m².
Os dois contrafactuais foram rodados e **nenhum dos 11 some**: não é a rua pública que falta
(ela entra só como superfície de frente, nunca como leito — o Generate é explícito), nem o
mínimo de testada.

**Conserto: lá.** E vale notar o parentesco: as 11 `via-sobre-lote` e as 18 `frente` distantes
são **a mesma passagem externa** do motor, vista por dois invariantes. **29 das 40 violações
de Antonina saem de um único mecanismo do motor** — o que faz do LAB-50 o prompt mais rendoso
da fila, e não por acaso ele é o próximo.

---

## 6 · Para o Generate — lista numerada, nada escrito lá

**Nada foi escrito no vizinho.** Os três clones foram conferidos ao fim da rodada e estão
limpos, como manda o §4.

1. **`paraResultado` não preenche `faixaViaPublica`** (`contratos/motor-v1/traducao.ts:291`).
   O invariante o usa e o tradutor nunca o põe — e **não é esquecimento dele**: o contrato de
   motor v1 não tem campo de origem. **Custo medido: 11 violações `frente` em `geo-antonina`,
   em lotes a 0 m da rua existente** — lotes bem-feitos reprovados.
2. **O contrato de motor v1 precisa de um campo para a RUA PÚBLICA EXISTENTE** na SAÍDA — a
   faixa, ou as faces do perímetro que fazem frente para ela. Sem isso o item 1 não tem
   conserto possível.
3. **O contrato precisa de `testadaAlvoLote_m`.** Ele tem `areaMinLote_m2` **e**
   `areaAlvoLote_m2`, mas para a testada só o mínimo — e foi essa assimetria que fez a minha
   ponte escrever o alvo no campo do mínimo (§2). **Enquanto o campo não existir, qualquer
   motor que sorteie a testada dentro de uma faixa corre o mesmo risco.**
4. **`paraResultado` não propaga `deLoteamentoFachada` nem `loteFrente`**, e o invariante usa
   as duas para trocar o mínimo de testada e os limites de área. Medido: **0 de 2 299 lotes**
   chegam com a bandeira.
5. **Sugestão, não exigência:** `RelatorioInvariantes` publica `violacoes` como número e 5
   exemplos. A variável `INVARIANTES_EXEMPLOS` resolveu para mim, mas **ela não está
   documentada no contrato** — quem for diagnosticar de fora não vai descobri-la. Uma linha no
   contrato basta.

## 6-A · Para o Laboratório de Parcelamento — lista numerada

1. **`comprimentoQuadra` corta um eixo só** (`formatos.ts:320, 194, 655`). Com o teto fixado
   em 200 m, a saída traz quadras de **597 × 69 m**. Aparar também o corrimento da fileira.
   **Custo medido: 14 violações `face-quadra`.**
2. **A passagem externa põe lote sobre o leito da própria via do motor** — 11 casos em
   `geo-antonina`, de 68,5 a 157,4 m². **Custo medido: 11 `via-sobre-lote`.**
3. **A passagem externa põe lote a até 1 805,7 m da face entregue** em `facesLoteamento`.
   **Custo medido: 18 `frente`.** É pergunta antes de acusação — o LAB-50 vai medir se
   `facesLoteamento` significa para ele algo mais amplo.
4. **Onze lotes com testada de 3,56 a 9,59 m**, contra os 10 m que a entrada declara —
   6 em `sintetico-50ha-ondulado`, 3 em `sintetico-10ha-plano`, 2 em `completo`. Estes são
   abaixo do mínimo **declarado**, não do alvo: são violação de verdade.

---

## 7 · O que eu NÃO fiz, e é de propósito

- **nenhum conserto.** A linha da volta que troca o alvo pelo mínimo **continua como está**, a
  ponte não foi tocada, e os dois contrafactuais rodam **dentro da ferramenta de medição**, sem
  mudar comportamento nenhum. O chat quer comparar dois diagnósticos, e diagnóstico que já vem
  consertado não serve de comparação: não se sabe mais o que ele mediu;
- **não corrigi a moldura do D159 nos três lugares onde ela saiu** — relatório do LAB-45, item
  7 do Jonny, nota da tabela. A correção está escrita aqui no §3.1 e virou decisão (D168),
  mas mexer na página do Jonny e na tabela é entrega, não diagnóstico. **Proposto ao chat**;
- **não atribuí as 27** do §3.2. Falta uma medição e ela está nomeada.

---

## 8 · As decisões

- **D166** — **a DÉCIMA QUARTA vez do ponto cego, e 36 de 128 eram minhas:** a volta do Lab
  escreve o **alvo** sorteado no campo `testadaMinLote_m`, cujo nome é **mínimo**, e o
  Validator — corretamente — mede o motor contra o próprio alvo dele com 2 % de folga;
- **D167** — **hipótese de ponte se mata com medição, não com argumento:** as quadras de
  597 m podiam ser três quadras fundidas pela minha tradução; medida a saída **crua** do
  motor, são seis quadras de 597 × 69 m com ~100 lotes cada;
- **D168** — **a correção da moldura do D159:** não são *"duas réguas discordando"*. A régua
  do Generate **concorda** com o motor e aceitaria os lotes; o que falta é **um campo**;
- **D169** — **o diagnóstico separa culpado de conserto, e os dois consertos de fora do motor
  não aprovam uma única gleba.** 47 das 128 saem com eles, e as cinco continuam reprovando.
