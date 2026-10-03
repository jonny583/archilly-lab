# O que falta medir, motor por motor

**Documento para o chat levar ao Generate e ao Laboratório de Parcelamento.**
O Laboratório **não escreve nos repositórios deles** — isto é lista, não commit.

**Gerado pelo LAB-22, em 03/10/2026.** Tudo aqui é medido, com a gleba e o
número; nada é impressão.

**Atualizado pelo LAB-25, em 03/10/2026** — §1-A e §7. **E pelo LAB-27, no mesmo
dia** — §1-B e §1-C, com dois achados do LAB-26 que são sobre vocês. O LAB-27
manda manter este documento vivo e **avisar quando ele mudar**: mudou duas vezes
hoje, e o recado de cada prompt diz isso.

---

## O resumo, antes dos detalhes

A pergunta do prompt era *"só o Symbios reporta o pico; escreva o que falta a
cada um"*. **Medindo, a resposta mudou de forma:**

| motor | reporta rampa? | o que a medição mostrou |
|---|---|---|
| **Laboratório de Parcelamento** | **sim, e desde 14/09** | **a lacuna era minha** — o adaptador do Lab descartava a medida dele |
| **Symbios** (+ subdivisão do Lab) | sim | reporta, mas **superestima** — amostra fina demais |
| **Generate · ortogonal** | **não** | campo presente, `null` em todas as vias |
| **Generate · espinha** | **não** | idem |

**Dos quatro, dois reportam, e os dois reportam errado — em direções
opostas.** A causa é a mesma nos dois: **o passo de amostragem não está amarrado
à resolução do modelo de relevo.**

---

## 1 · Laboratório de Parcelamento — **a lacuna era do Lab, não do motor**

**O que eu ia reportar:** *"não reporta o pico; escreve saída v1"*.

**O que eu medi:** o motor **mede rampa média e máxima por via desde o T03
dele, de 14/09/2026**, em `src/lib/lab/relevo.ts`. O `Plano` dele carrega as
duas em cada via. **Quem jogava fora era a ponte do Laboratório**, que escrevia
`rampaMedia_pct: null` com a justificativa de que *"o motor não calcula greide —
nenhuma via tem elevação em lugar nenhum do Plano"*.

**Essa frase era verdadeira quando foi escrita, e deixou de ser.** Ficou três
semanas no código, e no LAB-18 eu a repassei ao chat como fato sobre vocês.
**Desculpem — era defeito meu, e está consertado:** a ponte agora lê as duas e
escreve saída **v2**.

**O que falta, de verdade:** uma coisa só, e é fina.

> **O passo de amostragem é fixo em 12 pedaços por via** (`AMOSTRAS_POR_VIA = 12`
> em `relevo.ts`), independente do comprimento. Medido na gleba `completo`: as
> vias têm **995 m de mediana** e até **1 880 m**, o que dá passo efetivo de
> **83 m a 157 m** — **17 a 31 vezes a célula do modelo de relevo**, que é de
> 5 m.
>
> **Consequência medida:** o motor declara pico de **16,84 %** onde o
> Laboratório, caminhando o eixo de 10 em 10 m, mede **51,54 %**. O passo longo
> **faz a média do morro** e esconde o trecho que inviabiliza a obra — que é
> justamente o que o pico existe para achar.
>
> **A sugestão:** trocar a contagem fixa por **passo em metros**, não maior que a
> célula do modelo de relevo. `AMOSTRAS = ceil(comprimento / passo)` em vez de
> `passo = comprimento / 12`.

**O que já está bom, e vale dizer:** a `media_pct` dele é **desnível entre as
pontas sobre o comprimento** — que é a definição certa de rampa média de um
trecho, e não a média aritmética das rampas dos pedaços. Essa parte está
melhor que a de muita ferramenta.

### 1-A · A MESMA coisa aconteceu de novo, com outro campo — e de novo era meu

**Acrescentado pelo LAB-25.** Vocês medem a **via de frente de cada lote** desde o
T02 (`face.ts`, e a tradução de vocês escreve o id em `contrato/traducao.ts:453`).
**A ponte do Laboratório escrevia `faceDeRua: null` em todos os lotes**, com o
comentário *"o motor sabe a testada mas não guarda de QUAL via ela é frente"* —
escrito antes do T02 e nunca mais conferido.

**Consertado, e com guarda:** a ponte traduz o índice no id (`i` → `V<i+1>`) e há
agora um teste que reprova quando a ponte descarta campo que o motor publica, para
não haver uma quinta vez (`guarda-da-ponte.ts`).

**O que isto diz a vocês, e é elogio:** o campo que estava sendo jogado fora
**estava bom**. Posto contra a régua independente do Generate — que recalcula a
frente pela faixa de leito do invariante dele —, ele concorda em **91,5 % a
99,8 %** dos lotes, nas cinco glebas. Onde divergem, as duas réguas estão certas:
a de vocês é *um dos dois lados do comprimento da testada*; a dele é *a faixa de
leito mais perto de qualquer vértice*. Num lote de esquina elas escolhem ruas
diferentes.

**Nada a fazer do lado de vocês.** Está aqui porque o documento é de contas
honestas, e duas delas em três semanas eram minhas.

### 1-B · O Laboratório estava dizendo, por escrito, que o motor de vocês ignora o acesso

**Acrescentado pelo LAB-27, do achado do LAB-26.** A porta comum do Lab publica
uma ficha de capacidades por motor — é ela que uma tela com vários motores lado a
lado leria para dizer ao urbanista o que cada um sabe fazer. Na ficha de vocês
estava `respeitaAcesso: false`.

**É falso, e medido.** Movendo o ponto de acesso entre os dois vértices mais
distantes do anel:

| gleba | acesso movido | lotes |
|---|---:|---|
| `ensaio-47ha` | 992,6 m | **703 → 603** |
| `geo-antonina` | 2 255,3 m | 1 454 → 1 393 |
| `sintetico-10ha-plano` | 504,5 m | **112 → 138** |

A ida do adaptador do Lab **passa o acesso** ao `Terreno.acesso` de vocês desde o
LAB-07, e o traçado parte dali. **A declaração errada era do Lab**, no arquivo do
Lab — vocês não declaram nada a respeito, e o motor faz a coisa certa.

**Por que vale um aviso e não só um conserto silencioso:** aquela ficha é
**voltada para fora**. Enquanto ela dizia `false`, qualquer leitura da porta do
Lab atribuiria ao motor de vocês uma limitação que ele não tem. Corrigido para
`true`, com experimento que o desmente se voltar a mentir.

**Nada a fazer do lado de vocês.** De novo.

### 1-C · Vocês publicam nome e versão, e a ponte do Lab escreve outros

**Acrescentado pelo LAB-27, do achado do LAB-26.** Vocês publicam a própria
identidade, em `src/lib/lab/contrato/tipos.ts`:

```ts
export const MOTOR_NOME = "laboratorio-de-parcelamento" as const;
export const MOTOR_VERSAO = "1.0" as const;
```

**A ponte do Lab ignora as duas** e escreve, na SAÍDA que julga vocês,
`motor.nome = "motor-testfit"` (o nome do repositório) e uma versão que é **rótulo
de prompt do Lab** — estava `"T00-A"` na esteira e `"T02"` na porta, duas respostas
para a mesma pergunta, nenhum teste conferindo. Hoje é uma só, e há experimento;
mas continua sendo **a minha etiqueta, não a sua**.

**É a mesma forma do §1-A, um nível acima:** o Lab inventando onde vocês publicam.
**A correção de raiz é ler de lá**, e ela está **proposta ao chat** em vez de feita,
porque muda a identidade que viaja no contrato — alcança provas congeladas do
LAB-02 e do LAB-07 e o rótulo que o Generate mostra na mesa (`externo · <motor>
v<versão>`).

**O que isto pede de vocês: nada — mas confirmem uma coisa.** O `MOTOR_VERSAO`
diz *"sobe quando o desenho muda de forma que o Generate veja"*. Ele está em
**`1.0`** desde quando? Entre o T00-A e o T05 o desenho mudou de forma visível ao
Generate **mais de uma vez** — o greide do T03 e a via de frente do T02 são as
duas que o Lab mediu. Se a versão não subiu nessas, ela não serve para o Lab
saber que precisa remedir, e é justamente para isso que eu quero usá-la.

---

## 2 · Symbios + subdivisão do Lab — **reporta, e superestima**

**Este é defeito do adaptador do Laboratório**, e já está consertado no que o
Lab publica. Fica aqui porque a causa é instrutiva e pode repetir-se.

> O `refazerMedidas`, em `recorte.ts`, calculava `rampaMaxima_pct` como o máximo
> de `|Δcota| / d` **entre vértices consecutivos**. As vias do Symbios têm
> **mediana de segmento de 0,47 m**, e **5 353 de 7 436** abaixo de 1 m.
>
> **Dividir o degrau de uma grade de 5 m por um segmento de 15 cm dá 1 053 %.**
> Foi o que apareceu, e foi assim que o defeito foi achado.
>
> **Consequência medida:** declarava **161,38 %** onde o pico real é **41,84 %**;
> e em `sintetico-10ha-plano`, **praticamente plana**, declarava **15,44 %** onde
> o pico é **1,96 %**.

**A regra que sai disso, e serve para os dois lados:** o passo tem de ser
**amarrado à resolução do relevo** — nem maior (faz a média do morro), nem menor
(mede o degrau da grade). E a medida deve **caminhar o eixo por comprimento de
arco**, atravessando vértice: a densidade de vértices é escolha de quem desenhou,
não propriedade da rua.

---

## 3 · Generate · candidata ortogonal — **não mede, e o campo está lá**

**Medido:** a saída é **v2**, o campo `rampaMaxima_pct` está presente **em todas
as vias**, e **em todas ele é `null`**. O `rampaMedia_pct` também.

**O que falta:** o cálculo. O dado de entrada existe — as glebas trazem curva de
nível, e o Lab mede o pico das vias de vocês sem pedir nada a mais:

| gleba | pior trecho de via, medido pelo Lab |
|---|---:|
| `completo` | **34,71 %** |
| `geo-antonina` | 24,48 % |
| `ensaio-47ha` | 17,56 % |
| `sintetico-50ha-ondulado` | 14,00 % |
| `sintetico-10ha-plano` | 1,36 % |

**E `null` está certo enquanto não medirem.** Zero seria pior: zero é uma
medição, e diria "rua plana" (D23). O pedido não é mudar o `null` — é medir.

**Uma nota que pode poupar trabalho:** vocês têm `declividade(p)` em
`engine/topografia.ts`. O que falta é percorrê-la ao longo do eixo com passo
fixo, não o modelo.

---

## 4 · Generate · candidata espinha — **idem, e é a que mais precisa**

Mesma situação da ortogonal: campo presente, `null` em todas as vias.

**Por que esta é a mais urgente das duas:** ela é a que tem **o pior terreno
sob as ruas** entre as candidatas de vocês.

| gleba | ortogonal | **espinha** |
|---|---:|---:|
| `completo` | 34,71 % | **46,70 %** |
| `ensaio-47ha` | 17,56 % | **22,90 %** |
| `sintetico-50ha-ondulado` | 14,00 % | **20,58 %** |

E em metros de rua acima de 15 % — o limite que o Jonny confirmou como prática
dele —, em `completo`: **1 202 m** na ortogonal contra **2 179 m** na espinha.

---

## 5 · A regra única, para os quatro

**O passo de amostragem da rampa deve ser dado em METROS e não exceder a célula
do modelo de relevo.** Nem contagem fixa por via (faz a média do morro), nem
vértice a vértice (mede a grade).

**E o eixo deve ser caminhado por comprimento de arco**, atravessando vértices.

**Medido nos dois motores que reportam:** o passo errado erra por **2,5× a 7,9×**
para cima (vértice a vértice) ou por **3×** para baixo (contagem fixa). Nenhum
dos dois erros é visível sem uma segunda régua — e os dois têm a cara de um
número certo.

---

## 6 · Uma coisa que o Laboratório pede para si mesmo

Este documento existe porque **a declaração de capacidade de um motor pode
envelhecer sem ninguém mexer nela**. O Parcelamento declarava `calculaGreide:
false` e `leRelevo: false`; as duas eram verdade em 13/09 e passaram a ser
mentira em 14/09, quando **o motor melhorou**.

**O que o Lab fez a respeito:** a capacidade `leRelevo` foi **partida em duas**,
porque o Parcelamento é o primeiro motor em que as duas respostas diferem — ele
**lê** o relevo (mede a rampa) e **não desvia** por ele (traça idêntico). E há
teste de falsificação para cada uma das duas.

**Foi esse teste que pegou a declaração vencida**, no instante em que a ponte
passou a carregar a rampa. É o melhor argumento que tenho a favor de declaração
falsificável: ela não depende de alguém lembrar.

**E o argumento ficou mais forte depois do LAB-26**, que contou quantas das 15
declarações da ficha tinham de fato um experimento: **três não tinham nenhum**, e a
declaração falsa estava **justamente numa delas** (o `respeitaAcesso` do §1-B). Agora
cada campo aponta para o nome do teste que o desmente, e dois testes de varredura
exigem que todo campo tenha cobertura e que todo teste citado exista de verdade.

**O que isto vale para vocês, se quiserem a ideia emprestada:** declaração sem
experimento não é declaração conservadora, é declaração não conferida — e a
estatística aqui foi brutal, um em três.


---

## 7 · Para o Generate, uma coisa pequena e medida

**Acrescentado pelo LAB-25.** O `paraResultado` descarta o `faceDeRua` que chega de
um motor externo, e o `paraSaida` o recalcula com a régua do invariante. **Isso
está certo** — a régua da casa é a régua da casa, e é o mesmo argumento do D20 do
Laboratório.

**Só uma observação de contrato:** como o campo é descartado na leitura, um motor
externo não tem como saber se o que ele declarou foi aceito ou substituído. Hoje
isso é invisível. **Um aviso em `conferencia.avisos`** do tipo *"o `faceDeRua` de
N lotes foi recalculado e divergiu do declarado"* fecharia a volta: o motor de
fora aprenderia que a régua dele discorda da de vocês, que é informação que ele
não tem de nenhuma outra forma.

**Medido, para dar tamanho ao pedido:** nas cinco glebas, a divergência entre as
duas réguas vai de **1 lote em 599** (`ensaio-47ha`) a **117 em 1 386**
(`geo-antonina`).
