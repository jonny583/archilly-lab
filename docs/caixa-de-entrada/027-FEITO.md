> ## ✅ FEITO — **LAB-94**, no disparo das 07:17 de 12/10/2026
>
> **Relatório:** [`docs/relatorios/LAB-94.md`](../relatorios/LAB-94.md) · **prova:**
> [`docs/provas/LAB-94/o-preco-do-setimo.json`](../provas/LAB-94/o-preco-do-setimo.json) ·
> **decisões:** D312 a D316.
>
> **O que foi feito, com arquivo e linha:**
>
> 1. **o preço, medido** — `external-engines/esteira/src/preco-do-setimo.ts` (a classificação, a
>    conta, e o rótulo da simulação) e `ferramentas/lab94.ts` (`bun run lab94`). **21 a 48 lotes
>    por candidata**, de uma fileira de 33 a 64; **1 196 em 40 candidatas**; **zero** em
>    `ensaio-com-testada`, que é o controle;
> 2. **a régua NÃO é nova, como você exigiu** — a `alemDaPonta` e a `projecaoDentroDaDivisa`
>    saíram de `ferramentas/lab78.ts` para `src/setimo-mecanismo.ts` para serem lidas por dois
>    instrumentos. **A prova do LAB-78 saiu idêntica, só a data mudou**;
> 3. **a segunda metade da frase era FALSA** — `frente` **não zerou em nenhuma das 40**: cai de
>    28–55 para 5–16. Retirando a fileira **inteira** ela vai a zero em **38 das 40**, e a
>    segunda retirada existe porque contar eu mesma quem faz frente seria reimplementar o
>    invariante dele (§4);
> 4. **o rótulo saiu como você cobrou** — `O_QUE_A_SIMULACAO_NAO_MEDE`, quatro linhas, na prova e
>    com trava que reprova se alguma delas **afirmar** teto ou piso;
> 5. **a pergunta do acabamento, em três camadas** — por ÁREA não alcança (0 de 1 196 abaixo do
>    mínimo); por FRENTE alcança todos; **mata ou funde eu não sei**, e a casa que pode medir está
>    nomeada. **E a porta já existe na origem dele** (`acabamento-externo.ts`, `acabarPlano`,
>    chamado pelo `parcelamento-externo.ts` atrás de `opcoes.acabamento`) **e não existe no clone
>    que esta casa compila**;
> 6. **a `FILA.md`** deixou de dizer *"medição que este prompt não fez"* e aponta para a prova; **a
>    §10 da página do Jonny foi reescrita** com o preço, a correção da frase e a recomendação
>    **mudada com a medição** — de *"pare a fileira"* para *"espere o acabamento do chassi"*;
> 7. **travas:** `tests/preco-do-setimo.test.ts` (19, no portão). Portão: 40 → **41 arquivos**,
>    666 → **685 travas**, medidas por execução.
>
> **Duas coisas que o item disse e a medição corrigiu, com respeito e com número:** a premissa de
> *"testada 0 m"* — os 1 196 têm **10,14 a 13,98 m** (o zero era de **um** lote acusado do LAB-78)
> — e *"o caminho externo não chama NENHUM passo"*, que **deixou de ser verdade** entre o item ser
> escrito e esta rodada.

# 027 — o PREÇO do sétimo mecanismo: meça quantos lotes o conserto custa, sem consertar nada

> **Vem da direção, 12/10/2026 às 00h38 UTC (varredura do chão).** **A escolha é
> SUA, não minha:** o recado do LAB-93 fecha dizendo *"o próximo da minha lista é o
> SÉTIMO MECANISMO das violações"*, e a §4 da minha rotina manda preferir a escolha
> que a casa já fundamentou.
>
> **Mas o conserto dele não é escolhível, e você mesmo escreveu por quê** — a
> `FILA.md`, na seção do LAB-78: *"o conserto não foi executado de propósito …
> mexer no plantio muda o desenho, e desenho espera o olho do Jonny. **Não é
> medição que falta: é uma pessoa que decide.**"*
>
> **Então este item não é o conserto: é o que falta para a decisão existir.** Na
> mesma seção, duas linhas abaixo, está o buraco, escrito pela sua mão:
>
> > *"**Quantos lotes se perdem é medição que este prompt não fez** — e prometer o
> > número sem medir seria a classe do D133."*
>
> **Uma decisão que espera um número que ninguém mediu não está esperando uma
> pessoa: está esperando uma medição.** Ele não pode responder *"encurta a fileira
> externa?"* sem saber se isso custa 2 lotes ou 200 — e hoje a página dele pede a
> resposta sem oferecer o preço. Medir é a coisa mais útil que esta casa faz com o
> sétimo mecanismo sem atravessar a fronteira do desenho.

## O que medir, e é só isto

**O preço, em lotes, de parar a fileira externa no fim da face declarada** — por
gleba e por candidata, nas nove glebas-padrão.

E, junto, a outra metade da frase que está na sua `FILA.md`: *"encurtá-la ao fim da
rua perde esses lotes **e zera a violação**"*. **Essa segunda metade é afirmação sem
medição igual à primeira.** Meça as duas:

1. **quantos lotes morrem** — os que hoje nascem **além da ponta** da face que a ida
   declara em `facesLoteamento`;
2. **a violação zera?** — tirados esses lotes, o Validator ainda acusa `frente`
   naquela candidata, ou o veredicto fica limpo?
3. **o que mais se move** — área privativa, a nota do juiz e a **posição no
   ranking**. Se a candidata sobe ou desce de lugar ao perder lotes, isso é parte do
   preço e não aparece na contagem.

## A régua já existe — e o item 011 a construiu

**Não escreva régua nova** (a sua lição 11h, e você a quebrou duas vezes no dia em
que a escreveu). O `alemDaFaceDeclarada_m` está medido e publicado em
[`docs/provas/LAB-78/setimo-mecanismo.json`](../provas/LAB-78/setimo-mecanismo.json)
— **13,18 m** no `v16-e15` do cluster, com `projecaoDentroDaDivisa: false`,
`testadaDele_m: 0` e `aoSegmentoDaFaceEntregue_m: 0,19`. É essa régua que define
*"além da ponta"*, e é ela que diz quais lotes entram na conta.

**O que o LAB-78 mediu foi UMA gleba (`geo-antonina`) e QUATRO acusados.** O que
falta é a conta nas nove, com a lista por gleba e por candidata — porque *"em pelo
menos duas das 20"*, que é o que a `FILA.md` diz hoje, é contagem sem a lista ao
lado, e você acabou de escrever no LAB-93 que isso **é a forma mais barata de um
número envelhecer**.

## A fronteira: isto é SIMULAÇÃO, e o rótulo é parte da entrega

**Você não pode consertar o motor** — ele é do Parcelamento, lido na origem, e a §4
da sua casa proíbe escrever em vizinho. Então a medição é feita **removendo os lotes
do plano entregue** e repassando o resultado pelo Validator e pelo juiz.

**E isso NÃO é o conserto, por uma razão que tem de sair escrita no relatório:** o
conserto de verdade mexe no **plantio**, e plantio que para mais cedo pode **replantar
diferente** daí para a frente. A simulação mede *"os lotes que hoje estão além da
face, retirados, e nada posto no lugar"*.

> **Não chame isso de teto nem de piso sem medir que é.** A tentação é escrever *"é
> o limite superior da perda"* — e isso é **hipótese sobre o plantio**, que é
> justamente a coisa que esta casa não roda. **Diga o que a simulação mede e pare
> aí.** Se você tiver como mostrar, com número, que o replantio não pode recuperar
> lote nenhum, então o rótulo passa a caber — e aí ele é medido, não suposto.

É a lição que você escreveu doze horas atrás, no LAB-93: **leitura de fonte é
hipótese; rodada é dado.**

## E a pergunta que a direção acrescenta — ela pode tornar o conserto DESNECESSÁRIO

**Cruzando a sua medição com a que o Generate entregou ontem às 22h18** (item 024
dele, `docs/relatorios/024-O-CHASSI.md`), aparece uma hipótese que nenhuma das duas
casas podia ver sozinha:

> **O Generate tem DEZESSEIS passos de acabamento que rodam sobre o plano entregue,
> e o caminho do motor EXTERNO não chama NENHUM.** Medido por ele:
> `src/lib/contratos/motor-v1/traducao.ts` (`paraResultado`) **traduz e para** —
> depois dele vêm o Validator e o juiz, e mais nada. Entre os dezesseis estão o
> **piso de área**, o **aparo na divisa**, a **repescagem de face vazia** e a
> **quadra para o lote órfão**.

**A pergunta:** algum desses dezesseis passos **mata ou arruma** um lote que nasce
além da face declarada, com testada **0 m**? Se matar, o preço do sétimo mecanismo
**não é do plantio do Parcelamento** — é do chassi que ainda não chama o acabamento,
e a decisão que está na página dele pode nem precisar ser tomada.

**E eu não estou afirmando que mata — estou dizendo que não sei, e que a sua é a
casa que mede isso.** O `eliminarLotesAbaixoDoMinimo` confere **área**, e um lote de
testada zero pode ter área legal: nesse caso o passo passa por ele e a hipótese cai.
**Responda com rodada, e se a resposta for "nenhum dos dezesseis o toca", escreva
isso** — é o que fecha a pergunta em vez de deixá-la viva.

Você tem os dezesseis nomeados na tabela do `024-O-CHASSI.md`, e o Validator que
você já importa é o mesmo. **Não implemente o acabamento aqui** — isso é obra do
Generate, e já está na caixa dele como item `025`, escrito neste mesmo envio.

## O que esta rodada NÃO faz

- **não conserta o plantio** — nem atrás de opção, nem desligado por padrão;
- **não escreve nada no `motor-testfit` nem no `urban-create-hub`** — leitura na
  origem, e os clones limpos no fim, como sempre;
- **não decide urbanismo:** se a fileira externa encurta continua sendo dele. O que
  muda é que, respondido este item, ele decide **com o preço na mão**;
- **não religa o CI** — a régua cobra, não liga.

## Como eu sei que deu certo

O número existe, por gleba e por candidata, com a lista dos lotes ao lado da
contagem; a segunda metade (*"zera a violação"*) sai **medida** em vez de afirmada;
o rótulo da simulação diz o que ela mede e não promete teto que não foi medido; a
pergunta do acabamento sai **respondida ou declarada sem resposta**; e a linha da
`FILA.md` que hoje diz *"medição que este prompt não fez"* passa a apontar para a
prova.

**Conferido aqui, não no GitHub** — e diga isso, como sempre.

=== FIM DO PROMPT ===
