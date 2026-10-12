# LAB-94 · O preço do sétimo mecanismo: **21 a 48 lotes por candidata** — e a frase "zera a violação" é falsa

**Prompt:** item **027** da caixa de entrada. · **Rodada:** despertador das **07:17 de
12/10/2026** (UTC). · **Conferido aqui, não no GitHub** (§7).

---

## 1 · O que o item pediu, e por que ele estava certo em pedir

A `FILA.md` prometia duas coisas sobre o sétimo mecanismo, e **as duas estavam escritas sem
medição**: *"encurtá-la ao fim da rua perde esses lotes e zera a violação"* e, duas linhas abaixo,
a confissão — *"quantos lotes se perdem é medição que este prompt não fez"*.

> **Uma decisão que espera um número que ninguém mediu não está esperando uma pessoa: está
> esperando uma medição.** A página do Jonny perguntava se a fileira externa encurta e **não
> oferecia o preço** — e ninguém decide entre perder 2 lotes e perder 200 sem saber qual é.

---

## 2 · O preço (D312)

Cinco grandezas por candidata, **dez** glebas, e a simulação é **retirar**: os lotes da fileira
externa que hoje nascem **além da ponta** da face declarada saem do plano publicado, e nada é
posto no lugar.

| | |
|---|---|
| **o preço por candidata** | **21 a 48 lotes** — de uma fileira que tem **33 a 64** |
| **no total medido** | **1 196 lotes**, em **40** candidatas |
| **glebas que declaram face** | **3 de 10** (D316) |
| **`geo-antonina`** | 20 candidatas, 20 com retirada, **598 lotes** |
| **`antonina-com-via`** | 20 candidatas, 20 com retirada, **598 lotes** |
| **`ensaio-com-testada`** | 20 candidatas, **zero** — a face declarada cobre a fileira inteira |

**O caso que mais muda a decisão:** a candidata que o **ranking do próprio motor põe em primeiro**
em Antonina tem **33 lotes**, e **todos os 33** são da fileira externa — parando na face ela fica
com **12**. É a mesma superquadra do D140, agora com o preço ao lado.

---

## 3 · A segunda metade da frase era FALSA, e a correção é medida

| | antes | depois de parar na face | retirando a fileira INTEIRA |
|---|---|---|---|
| violações de `frente` | 28–55 | **5–16** | **0 em 38 das 40** · 1 nas outras duas |
| violações totais | 40–100 | 13–26 | — |

> **A violação de `frente` NÃO zerou em nenhuma das 40.** Ela cai muito e sobra.

E a pergunta que isso abre — *"o que sobra é da fileira externa ou não?"* — **não se responde
contando eu mesmo quem faz frente**: isso seria reimplementar o invariante do Generate, e a §4
proíbe com todas as letras. Responde-se com uma **segunda retirada, pela régua dele**: tirada a
fileira inteira, `frente` vai a **zero em 38 das 40**.

> **"Parar no fim da face" e "não ter fileira externa" não são a mesma coisa**, e a diferença é de
> 5 a 16 violações por candidata. A primeira melhora muito; só a segunda resolve, e ela é outro
> desenho — que é do Jonny, não meu.

---

## 4 · O rótulo é parte da entrega: **nem teto, nem piso** (D313)

A simulação **retira e não replanta**. O conserto de verdade mexe no plantio, e plantio que para
mais cedo pode **replantar diferente** daí para a frente.

> **Chamar este número de "teto da perda" seria hipótese sobre o plantio** — a coisa que esta casa
> não roda. O item avisou antes de eu errar: *"diga o que a simulação mede e pare aí"*. É a lição
> do LAB-93, doze horas antes: **leitura de fonte é hipótese; rodada é dado.**

O rótulo mora em `src/preco-do-setimo.ts`, **viaja na prova**, e a trava cobra que nenhuma linha
dele **afirme** ser teto ou piso.

**E a régua não é nova, como o item exigiu:** o *"além da ponta"* é a `alemDaPonta` do LAB-78, que
**mudou de arquivo** (da ferramenta para `src/setimo-mecanismo.ts`) para ser lida por dois
instrumentos. A prova do LAB-78 saiu **idêntica** — só a data mudou.

---

## 5 · A pergunta do acabamento: as duas metades, e uma delas é "não sei" (D314)

O item cruzou esta medição com a do Generate e perguntou se algum passo de acabamento **mata ou
arruma** um lote que nasce além da face. E foi honesto: *"não estou afirmando que mata — estou
dizendo que não sei."*

| camada | veredicto | como eu sei |
|---|---|---|
| **por ÁREA** | **não alcança** — 0 de 1 196 abaixo do mínimo (218,76 a 581,03 m², mínimo 200) | medido nos nossos lotes |
| **por FRENTE** | **alcança TODOS** — os 1 196 publicam `faceDeRua: null`, e o invariante `frente` DELE os conta | medido nos nossos lotes |
| **mata ou funde?** | **não sei** — o passo tenta fundir no vizinho antes de descartar | só rodando o passo |

> **O nome do passo declara UMA das duas condições.** Ele se chama *piso de área* e o critério é
> `area >= areaMin` **E** `testadaContraVias(...) > 0` — o comentário dele é explícito: *"lote sem
> NENHUMA frente é tão invendável quanto lote abaixo do mínimo"*. A hipótese que chegou até mim
> estava formulada pela metade que **não** morde.

### E a premissa do item sobre a testada não se sustenta

Ele falou de *"um lote com testada 0 m"*. Medido: os 1 196 têm **10,14 a 13,98 m**. O
`testadaDele_m: 0` era do `v16-e15` do LAB-78 — **um** lote acusado, não a fileira. O motor
reporta testada e diz `faceDeRua: null` no mesmo lote, e as duas coisas convivem: quem decide *"tem
frente?"* é o invariante do Generate, não o número da testada.

---

## 6 · A porta do acabamento JÁ EXISTE na origem dele (D315)

O item citou a medição que o Generate publicou às 22h18 de 11/10: *"o caminho do motor EXTERNO não
chama NENHUM"*. **Isso deixou de ser verdade entre o item ser escrito e esta rodada.**

Na **origem** dele (`c6048f8`): `src/lib/engine/acabamento-externo.ts`, com `acabarPlano`, chamado
pelo `parcelamento-externo.ts` **entre a montagem e o Validator**, atrás de `opcoes.acabamento`.
Com a opção ligada, **o veredicto passa a ser do plano que o chassi entrega**. No clone que esta
casa compila (`72cfab0`) **o arquivo não existe**.

> **O clone não é a origem — e aqui a diferença não é de data, é de CAPACIDADE.** Quarta vez na
> família do D295, e a primeira em que o que falta no clone é uma **função inteira**.

**E a conta dos passos muda de número sem contradição:** o `024-O-CHASSI.md` contou **16 de 17**
passos que **poderiam** rodar; a porta entregue **aplica 13** e declara **4 fora**. *Número de
inventário e número de porta respondem perguntas diferentes, e 13 + 4 = 17 fecha com os dois.*

---

## 7 · Sete das dez glebas não declaram face (D316)

Só **três** declaram `facesLoteamento`. As outras sete saem com `declaraFace: false` e o motivo
escrito, **não com zero**.

> **Zero é uma medição; "a pergunta não tem objeto aqui" é outra coisa.** Publicar `0 lotes` nas
> sete diria que o mecanismo foi medido nelas e não custou nada, e quem lesse a soma concluiria que
> o preço é pequeno porque sete glebas o diluem.

E a terceira que declara face é o **controle**: em `ensaio-com-testada` o preço é **zero de
verdade** — a régua não acusa à toa.

---

## 8 · O que fica pedido, e o pedido NÃO é commit (§4)

**Ao Generate (o chassi):**

1. **rodar o `piso-de-area` sobre estes 1 196 lotes e dizer quantos ele FUNDE e quantos DESCARTA**
   — a porta é de vocês, e esta casa não pode: o arquivo não existe no clone que ela compila;
2. **o nome do passo conta metade do critério.** *"Piso de área"* é piso de área **e de frente**, e
   quem lê de fora formula a pergunta pela metade errada — aconteceu neste item;
3. **dizer se `opcoes.acabamento` vai ficar opt-in**, porque disso depende se o veredicto que esta
   esteira publica é do plano do motor ou do plano acabado. *São duas afirmações diferentes, e o
   rótulo da opção na mesa é o que separa as duas.*

**Ao Parcelamento:** nada novo. O sétimo mecanismo continua sendo dele, e o preço de consertá-lo
está medido — mas se o acabamento do chassi alcança os mesmos lotes, **o conserto pode não ser
necessário**, e essa é a conta que a página do Jonny passa a mostrar.

**Ao Jonny**, em linguagem de leigo, na §10 **reescrita**: o preço das três opções, a correção da
frase que eu mesma escrevi (*"zera o defeito"* — não zera) e **a recomendação mudada com a
medição**: de *"pare a fileira"* para *"espere o acabamento do chassi"*.

---

## 9 · Entrega

- **prova:** [`docs/provas/LAB-94/o-preco-do-setimo.json`](../provas/LAB-94/o-preco-do-setimo.json)
  — as cinco grandezas por candidata, a lista dos lotes com os metros, as duas retiradas, a
  pergunta do acabamento em três camadas e o que a simulação **não** mede;
- **decisões:** **D312** (o preço e a frase falsa), **D313** (o rótulo: nem teto nem piso),
  **D314** (piso de área **e de frente**), **D315** (a porta existe na origem e não no clone) e
  **D316** (sete glebas sem objeto);
- **a régua mudou de arquivo e não de número:** `alemDaPonta` e `projecaoDentroDaDivisa` saíram de
  `ferramentas/lab78.ts` para `src/setimo-mecanismo.ts`, e a prova do LAB-78 saiu idêntica;
- **o portão sem clones:** 40 → **41 arquivos**, 666 → **685 travas**, medidas por execução;
- **nada escrito em repositório vizinho** — leitura na **origem** do `urban-create-hub`
  (`c6048f8`) e do `motor-testfit`; os **seis** clones limpos;
- **nada consertado:** o plantio não foi tocado, nem atrás de opção; o acabamento **não** foi
  implementado aqui (o item proibiu, e seria a segunda implementação do acabamento dele);
- **o gatilho do CI não foi religado**;
- **verde:** o comando único, **conferido aqui, não no GitHub**.
