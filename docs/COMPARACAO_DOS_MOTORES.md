# Comparação dos motores de loteamento

**Esta página é gerada por medição.** Ela não é escrita à mão, e não pode ficar
desatualizada em silêncio: há teste que a regera e reprova se o arquivo estiver
diferente do que a medição diz hoje.

**Quatro motores, cinco terrenos, a mesma régua para todos.** A régua é o
**conferente do Archilly Generate** — o *Validator*, no nome que ele tem no
código — mais o contador de lotes dele. O laboratório **não tem régua
própria**, de propósito, para não haver como um motor de fora passar mais
fácil por ser de fora.

---

## Como ler os quadros

| coluna | o que ela diz |
|---|---|
| **Lotes** | quantos lotes o motor desenhou **naquele ponto de entrada da rua**. É a coluna que convida a ordenar os programas — e debaixo de cada quadro está dito se a ordem aguenta a entrada mudar. Em terreno nenhum ela é propriedade só do programa |
| **Área vendável** | a soma dos lotes, em hectares |
| **Virou lote** | quanto do terreno virou lote, em porcentagem. O resto é rua, praça, área de preservação e sobra |
| **Apontado pelo conferente** | quantas regras o desenho quebrou, na conta do conferente do Archilly Generate — o *Validator*. **Zero é o alvo, e é ele que diz se a proposta passa** |
| **Terra sem lote** | terra dentro da área loteável que não virou lote nem rua. É prejuízo |
| **Forma dos lotes** | ver a seção *A forma dos lotes*, logo abaixo |
| **Rampa média** | a inclinação média das ruas, pesada pelo comprimento de cada trecho |
| **Rampa no pior trecho** | a inclinação do **pior** pedaço de rua do projeto, e quantos metros de rua passam de 15 % |
| **Se a entrada da rua mudar** | ver a seção *A entrada da rua*, logo abaixo. É a coluna de maior efeito da tabela |
| **Tempo** | quanto o motor levou para desenhar |

## A entrada da rua: a mesma coisa, desenhada duas vezes, dá até o dobro

**Cada terreno foi desenhado seis vezes por programa, mudando só UMA coisa: por
onde a rua entra.** Mesmo terreno, mesmo programa, mesmas regras, mesma conta de
lotes feita pelo mesmo conferente. E o resultado muda assim:

**3.776 % mais lotes.** O maior caso medido:

- **terreno:** Antonina (PR) — terreno real, levantado pelo Archilly Geo
- **programa:** Laboratório de Parcelamento
- **o que mudou:** só o ponto por onde a rua entra

Esse número não depende de opinião nenhuma e não compara programas: é o **mesmo**
programa, duas vezes.

### E a entrada pesa mais que a escolha do programa?

**Às vezes — e é menos do que parece.** Posto lado a lado com o quanto os três
programas que entregam lote diferem entre si:

| terreno | o quanto muda só pela entrada | o quanto muda trocando de programa | o que pesa mais |
|---|---|---|---|
| Terreno de teste completo — com áreas de preservação | **+108 %** (Archilly Generate — traçado espinha de peixe) | +29 % | **a entrada** |
| Terreno sintético ondulado | **+17 %** (Laboratório de Parcelamento) | +96 % | o programa |
| Terreno sintético plano | **+28 %** (Laboratório de Parcelamento) | +45 % | o programa |
| Gleba de ensaio do Archilly Generate | **+53 %** (Laboratório de Parcelamento) | +63 % | o programa |
| Antonina (PR) — terreno real, levantado pelo Archilly Geo | **+3.776 %** (Laboratório de Parcelamento) | +4.921 % | o programa |

**Em 1 dos 5 terrenos a entrada pesa mais; nos outros, o
programa.** As duas coisas importam, e nenhuma das duas dispensa a outra — era o
que valia medir, e a resposta não foi a mais vistosa.

**E a pergunta de quem compara é outra: a ORDEM dos programas aguenta a entrada
mudar?** Medido, ela muda em **3 dos 5 terrenos**, e em
**2** deles muda até **quem fica em primeiro**. Em **Gleba de ensaio do Archilly Generate**
a ordem aguentou os seis pontos sem mudar nenhuma vez.

**Por isso o aviso não mora só aqui:** debaixo de cada quadro de terreno está
escrito se a ordem daquele quadro aguenta a entrada mudar — porque é ali que a
ordem aparece, e ninguém devia precisar rolar até esta seção para descobrir.

### O que isso significa para quem compra terreno

**Por onde a entrada pode passar é parte do preço do terreno, e se descobre antes
de comprar, olhando a rua que já existe do lado de fora.** Dois terrenos do mesmo
tamanho e do mesmo preço não valem o mesmo se um só admite entrada pelo canto
ruim: a diferença cai direto no número de lotes que se vende.

**Três cuidados, para o número não ser lido além do que ele é:**

1. **o melhor ponto pode não existir na vida real.** O laboratório põe a entrada
   em seis pontos da volta do terreno **sem perguntar se há rua ali fora**. Se o
   melhor ponto cai no fundo, onde não passa ninguém, ele não serve — e a coluna
   continua útil, porque mostra quanto se perde por não poder usá-lo;
2. **a variação medida é o mínimo, não o máximo.** Seis pontos não cobrem a volta
   inteira do terreno; o melhor e o pior ponto de verdade podem estar entre dois
   dos seis. A diferença real é **igual ou maior** que a publicada;
3. **o laboratório não escolhe a entrada.** Onde ela pode ficar depende da rua de
   fora, da faixa que a prefeitura exige e da licença — é decisão de projeto, e
   é sua. O laboratório só mede quanto ela custa.

## A rampa das ruas: a média esconde o pior trecho

**Olhe sempre as duas colunas juntas, e a segunda primeiro.** A rampa média de
um projeto pode ser mansa e confortável, e ainda assim haver um pedaço de rua
que não se constrói sem corte e aterro — porque a média dilui o trecho ruim no
meio de todos os outros.

O caso em que as duas mais discordam, entre tudo o que foi medido: **Symbios (motor de fora) + divisão de lotes do laboratório, em Antonina (PR) — terreno real, levantado pelo Archilly Geo**.
A média das ruas dele dá **3,3 %** — rua tranquila. O **pior
trecho** dessas mesmas ruas dá **27,7 %**, ou seja **8,5 vezes**
mais. **O mesmo projeto, e dois números que contam histórias opostas.**

**Qual é a inclinação máxima que você aceita numa rua?** Isso é decisão sua, e
ainda não está respondida — está em [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md).
A lei que a família tem escrita (Lei 6.766/1979) fala de **30 % de inclinação
do TERRENO** para poder lotear, que é **outra coisa**: uma rua pode ser cortada
numa encosta forte e ficar suave, e uma encosta suave pode receber uma rua
mal resolvida. Por isso a tabela mostra os números e não dá veredito.

## A forma dos lotes

A régua é simples: desenha-se **o menor retângulo que cabe em volta do lote**,
em qualquer inclinação, e vê-se **quanto desse retângulo o lote aproveita**.
Um lote retangular aproveita 100 %. Um triângulo, 50 %.

- aproveita **85 % ou mais** → está **ok**;
- aproveita **menos de 85 %** → **a conferir**;
- aproveita **menos de 70 %** → **ruim**.

**Esta linha foi decidida no chat, e está esperando o seu OK** — é o item que
sobrou em [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md). Até você confirmar, ela
vale para o trabalho não parar; se o número que você tem na cabeça for outro, é
só dizer qual.

### Esta coluna INFORMA; quem aprova é o Validator

**A coluna da forma não aprova nem reprova nada.** Quem diz se uma proposta
passa é o **conferente do Archilly Generate — o Validator** —, e **forma de
lote não é uma regra dele**. São duas réguas diferentes, e os quadros abaixo
provam que elas não andam juntas:

| caso medido | apontado pelo Validator | lotes de forma ruim |
|---|---:|---:|
| Laboratório de Parcelamento · Antonina (PR) — terreno real, levantado pelo Archilly Geo | **40** | **nenhum** |
| Laboratório de Parcelamento · Terreno sintético plano | **29** | **nenhum** |
| Symbios (motor de fora) + divisão de lotes do laboratório · Antonina (PR) — terreno real, levantado pelo Archilly Geo | **4** | **87** |
| Symbios (motor de fora) + divisão de lotes do laboratório · Terreno de teste completo — com áreas de preservação | **1** | **74** |

Ou seja: **um motor pode ter todos os lotes bem formados e ainda assim ser
reprovado pelo conferente**, e pode passar no conferente com lotes de forma
ruim. Somar as duas colunas numa nota só esconderia justamente isso.

---

## Terreno de teste completo — com áreas de preservação

**141,8 hectares** · identificação técnica do terreno: `completo`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | rampa média | rampa no pior trecho | se a entrada da rua mudar | tempo |
|---|---:|---:|---:|---:|---:|---|---:|---|---|---:|
| Archilly Generate — traçado ortogonal | 1.606 | 58,33 ha | 41,1 % | **nenhum** | 70,00 ha · 49,4 % | 2 a conferir (0,1 %) | 6,1 % | **34,7 %** · 1.183 m acima de 15 % | 998 a 1.654 lotes · **+66 %** | 2,1 s |
| Archilly Generate — traçado espinha de peixe | 1.805 | 64,94 ha | 45,8 % | 1 | 52,92 ha · 37,3 % | 1 a conferir (0,1 %) · **35 ruins (1,9 %)** | 7,0 % | **46,7 %** · 2.397 m acima de 15 % | 860 a 1.791 lotes · **+108 %** | 1,9 s |
| Laboratório de Parcelamento | 1.060 | 42,44 ha | 29,9 % | 25 | 19,44 ha · 13,7 % | 1 a conferir (0,1 %) | 7,7 % | **51,5 %** · 3.468 m acima de 15 % | 962 a 1.114 lotes · **+16 %** | 6,3 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 932 | 28,73 ha | 20,3 % | 1 | 82,18 ha · 58,0 % | 308 a conferir (33,1 %) · **74 ruins (7,9 %)** | 7,2 % | **41,8 %** · 5.492 m acima de 15 % | **não muda nada** | 6,0 s |

> ⚠️ **Esta tabela é de UM ponto de entrada da rua, e a ordem dela NÃO aguenta outro.** Movendo só o ponto por onde a rua entra, nos 4 pontos comparáveis apareceram **3 ordens diferentes**, e **o primeiro lugar muda de programa**: Archilly Generate — traçado espinha de peixe e Archilly Generate — traçado ortogonal ganham cada um em pelo menos um ponto. Nos pontos restantes, **Archilly Generate — traçado espinha de peixe** não entregou desenho válido em 2 pontos — o que também é resposta: naquela entrada, aquele programa não desenha nada aceitável. **Ordenar os programas por esta tabela é ordenar por onde a rua entra.**

## Terreno sintético ondulado

**50,0 hectares** · identificação técnica do terreno: `sintetico-50ha-ondulado`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | rampa média | rampa no pior trecho | se a entrada da rua mudar | tempo |
|---|---:|---:|---:|---:|---:|---|---:|---|---|---:|
| Archilly Generate — traçado ortogonal | 1.003 | 36,37 ha | 72,7 % | **nenhum** | 5,34 ha · 10,7 % | **todos ok** | 4,2 % | **14,0 %** | **não muda nada** | 0,5 s |
| Archilly Generate — traçado espinha de peixe | 788 | 28,51 ha | 57,0 % | **nenhum** | 10,61 ha · 21,2 % | **14 ruins (1,8 %)** | 4,2 % | **20,6 %** · 10 m acima de 15 % | 736 a 805 lotes · **+9 %** | 0,4 s |
| Laboratório de Parcelamento | 501 | 19,99 ha | 40,0 % | 18 | 0,23 ha · 0,5 % | 4 a conferir (0,8 %) | 4,5 % | **18,8 %** · 33 m acima de 15 % | 510 a 596 lotes · **+17 %** | 2,3 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 318 | 9,59 ha | 19,2 % | **nenhum** | 26,26 ha · 52,5 % | 125 a conferir (39,3 %) · **21 ruins (6,6 %)** | 4,7 % | **25,6 %** · 118 m acima de 15 % | **não muda nada** | 1,4 s |

> ⚠️ **Esta tabela é de UM ponto de entrada da rua, e aqui não dá para dizer se a ordem aguenta outro.** Dos 6 pontos testados, só 1 teve os quatro programas entregando desenho válido ao mesmo tempo. Nos pontos restantes, **Archilly Generate — traçado ortogonal** não entregou desenho válido em 5 pontos; **Archilly Generate — traçado espinha de peixe** não entregou desenho válido em 1 ponto — o que também é resposta: naquela entrada, aquele programa não desenha nada aceitável. **Não ordene os programas por esta tabela sem ver a seção _A entrada da rua_.**

## Terreno sintético plano

**10,0 hectares** · identificação técnica do terreno: `sintetico-10ha-plano`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | rampa média | rampa no pior trecho | se a entrada da rua mudar | tempo |
|---|---:|---:|---:|---:|---:|---|---:|---|---|---:|
| Archilly Generate — traçado ortogonal | 171 | 6,28 ha | 62,8 % | **nenhum** | 2,12 ha · 21,1 % | **todos ok** | 0,9 % | **1,4 %** | 169 a 185 lotes · **+9 %** | 0,1 s |
| Archilly Generate — traçado espinha de peixe | 137 | 5,00 ha | 50,0 % | **nenhum** | 2,65 ha · 26,4 % | **8 ruins (5,8 %)** | 0,9 % | **1,8 %** | 123 a 141 lotes · **+15 %** | 0,1 s |
| Laboratório de Parcelamento | 124 | 4,90 ha | 49,0 % | 29 | 0,06 ha · 0,6 % | 4 a conferir (3,2 %) | 0,7 % | **1,2 %** | 112 a 143 lotes · **+28 %** | 0,3 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 66 | 2,35 ha | 23,5 % | **nenhum** | 6,09 ha · 60,9 % | 15 a conferir (22,7 %) · **2 ruins (3,0 %)** | 0,8 % | **2,0 %** | **não muda nada** | 0,5 s |

> ⚠️ **Esta tabela é de UM ponto de entrada da rua, e a ordem dela NÃO aguenta outro.** Movendo só o ponto por onde a rua entra, nos 3 pontos comparáveis apareceram **2 ordens diferentes**, embora o primeiro lugar seja sempre o mesmo (Archilly Generate — traçado ortogonal). Nos pontos restantes, **Archilly Generate — traçado ortogonal** não entregou desenho válido em 3 pontos — o que também é resposta: naquela entrada, aquele programa não desenha nada aceitável. **Ordenar os programas por esta tabela é ordenar por onde a rua entra.**

## Gleba de ensaio do Archilly Generate

**47,0 hectares** · identificação técnica do terreno: `ensaio-47ha`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | rampa média | rampa no pior trecho | se a entrada da rua mudar | tempo |
|---|---:|---:|---:|---:|---:|---|---:|---|---|---:|
| Archilly Generate — traçado ortogonal | 974 | 35,33 ha | 75,2 % | **nenhum** | 3,48 ha · 7,4 % | **todos ok** | 5,8 % | **17,6 %** · 150 m acima de 15 % | 960 a 1.024 lotes · **+7 %** | 0,4 s |
| Archilly Generate — traçado espinha de peixe | 778 | 28,21 ha | 60,0 % | **nenhum** | 6,01 ha · 12,9 % | 2 a conferir (0,3 %) · **14 ruins (1,8 %)** | 5,5 % | **22,9 %** · 287 m acima de 15 % | 721 a 745 lotes · **+3 %** | 0,4 s |
| Laboratório de Parcelamento | 599 | 23,82 ha | 50,7 % | 16 | 0,04 ha · 0,1 % | 9 a conferir (1,5 %) | 5,1 % | **17,9 %** · 66 m acima de 15 % | 459 a 703 lotes · **+53 %** | 1,6 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 214 | 6,61 ha | 14,1 % | **nenhum** | 27,13 ha · 58,0 % | 73 a conferir (34,1 %) · **8 ruins (3,7 %)** | 5,4 % | **22,8 %** · 556 m acima de 15 % | **não muda nada** | 0,8 s |

> ✅ **A ordem desta tabela aguenta a mudança de entrada.** Movendo o ponto por onde a rua entra pelos 6 pontos comparáveis, a ordem dos programas **não mudou nenhuma vez** — os números mudam, a ordem não.

## Antonina (PR) — terreno real, levantado pelo Archilly Geo

**141,8 hectares** · identificação técnica do terreno: `geo-antonina`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | rampa média | rampa no pior trecho | se a entrada da rua mudar | tempo |
|---|---:|---:|---:|---:|---:|---|---:|---|---|---:|
| Archilly Generate — traçado ortogonal | 1.390 | 50,17 ha | 35,4 % | 1 | 79,45 ha · 56,1 % | **todos ok** | 3,0 % | **24,5 %** · 4 m acima de 15 % | 1.346 a 1.941 lotes · **+44 %** | 0,8 s |
| Archilly Generate — traçado espinha de peixe | 1.657 | 59,62 ha | 42,1 % | **nenhum** | 67,49 ha · 47,6 % | **9 ruins (0,5 %)** | 3,6 % | **23,0 %** · 20 m acima de 15 % | 1.478 a 1.917 lotes · **+30 %** | 0,6 s |
| Laboratório de Parcelamento | 33 | 1,03 ha | 0,7 % | 40 | 8,32 ha · 5,9 % | 1 a conferir (3,0 %) | 3,5 % | **16,2 %** · 10 m acima de 15 % | 33 a 1.279 lotes · **+3.776 %** | 5,9 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 1.014 | 29,85 ha | 21,1 % | 4 | 65,15 ha · 46,0 % | 365 a conferir (36,0 %) · **87 ruins (8,6 %)** | 3,3 % | **27,7 %** · 46 m acima de 15 % | **não muda nada** | 9,4 s |

> ⚠️ **Esta tabela é de UM ponto de entrada da rua, e a ordem dela NÃO aguenta outro.** Movendo só o ponto por onde a rua entra, nos 6 pontos comparáveis apareceram **2 ordens diferentes**, e **o primeiro lugar muda de programa**: Archilly Generate — traçado espinha de peixe e Archilly Generate — traçado ortogonal ganham cada um em pelo menos um ponto. **Ordenar os programas por esta tabela é ordenar por onde a rua entra.**

> **Laboratório de Parcelamento:** a testada de frente entrou como 1 face(s) do perímetro (`facesLoteamento: [0]`) — lote virado para a rua existente.

> **Laboratório de Parcelamento:** o RANKING DELE escolheu "superquadra" com 33 lotes (nota 0.6226); entre as aceitas, "ortogonal" dá 1228 lotes (nota 0.5881). A escolha da variante é do motor, não do Lab — e aqui ela custa lote.

---

## Terreno em declive: o que vai dar terraplenagem

**Para que este quadro serve:** **comparar planos** e **estimar
terraplenagem**. Os metros e metros quadrados abaixo são o que vira volume de
corte e aterro no orçamento.

**Os dois limites não têm a mesma força, e você mesmo separou as duas:**

| o quê | limite | o que acontece |
|---|---|---|
| **Lote** | **30 %** de inclinação do terreno | **reprova** — é a Lei 6.766/1979 |
| **Rua** | **15 %** de inclinação | **só avisa** — o trecho se resolve com terraplenagem ou mudando o traçado, e isso é decisão de projeto, com custo |

**Por isso a coluna da rua não diz "passa" nem "não passa".** Ela diz
*quanto*, para quem for pôr preço.

### Terreno de teste completo — com áreas de preservação

| motor | rua acima de 15 % | lote acima de 30 % | pior trecho de rua | pior lote |
|---|---|---|---|---|
| Archilly Generate — traçado ortogonal | 1.202 m · 12.236 m² · **9,7 %** do total | 5.704 m² · 0,98 % · 95 lotes · **REPROVA** | 31,8 % em `VT-02` | 50,9 % em `L372` |
| Archilly Generate — traçado espinha de peixe | 2.179 m · 22.781 m² · **10,9 %** do total | 7.153 m² · 1,10 % · 113 lotes · **REPROVA** | 48,9 % em `VR-01` | 52,2 % em `L1655` |
| Laboratório de Parcelamento | 3.441 m · 34.851 m² · **13,9 %** do total | 3.595 m² · 0,85 % · 67 lotes · **REPROVA** | 36,7 % em `V13` | 45,1 % em `v1-l635` |
| Symbios (motor de fora) + divisão de lotes do laboratório | 5.183 m · 43.539 m² · **14,3 %** do total | 2.938 m² · 1,02 % · 49 lotes · **REPROVA** | 52,0 % em `via-198` | 51,5 % em `L924` |

### Terreno sintético ondulado

| motor | rua acima de 15 % | lote acima de 30 % | pior trecho de rua | pior lote |
|---|---|---|---|---|
| Archilly Generate — traçado ortogonal | 10 m · 118 m² · **0,1 %** do total | **nenhum** | 16,6 % em `VP-01` | 19,8 % em `L91` |
| Archilly Generate — traçado espinha de peixe | 12 m · 117 m² · **0,1 %** do total | **nenhum** | 22,1 % em `VT-11` | 19,8 % em `L564` |
| Laboratório de Parcelamento | 30 m · 301 m² · **0,4 %** do total | **nenhum** | 17,5 % em `V8` | 19,8 % em `v12-l227` |
| Symbios (motor de fora) + divisão de lotes do laboratório | 96 m · 810 m² · **0,6 %** do total | **nenhum** | 17,1 % em `via-108` | 18,2 % em `L75` |

### Terreno sintético plano

| motor | rua acima de 15 % | lote acima de 30 % | pior trecho de rua | pior lote |
|---|---|---|---|---|
| Archilly Generate — traçado ortogonal | 0 m · 0 m² · **0,0 %** do total | **nenhum** | 1,6 % em `VS-03` | 1,3 % em `L30` |
| Archilly Generate — traçado espinha de peixe | 0 m · 0 m² · **0,0 %** do total | **nenhum** | 1,6 % em `VR-02` | 1,3 % em `L94` |
| Laboratório de Parcelamento | 0 m · 0 m² · **0,0 %** do total | **nenhum** | 1,1 % em `V6` | 1,3 % em `v12-l58` |
| Symbios (motor de fora) + divisão de lotes do laboratório | 0 m · 0 m² · **0,0 %** do total | **nenhum** | 1,4 % em `via-10` | 1,3 % em `L2` |

### Gleba de ensaio do Archilly Generate

| motor | rua acima de 15 % | lote acima de 30 % | pior trecho de rua | pior lote |
|---|---|---|---|---|
| Archilly Generate — traçado ortogonal | 206 m · 2.062 m² · **2,9 %** do total | **nenhum** | 21,1 % em `VS-04` | 20,4 % em `L656` |
| Archilly Generate — traçado espinha de peixe | 308 m · 3.168 m² · **3,4 %** do total | **nenhum** | 27,1 % em `VT-07` | 20,4 % em `L425` |
| Laboratório de Parcelamento | 50 m · 496 m² · **0,8 %** do total | **nenhum** | 18,3 % em `V9` | 20,4 % em `v12-l482` |
| Symbios (motor de fora) + divisão de lotes do laboratório | 700 m · 5.880 m² · **4,5 %** do total | **nenhum** | 22,4 % em `via-29-2` | 19,1 % em `L144` |

### Antonina (PR) — terreno real, levantado pelo Archilly Geo

| motor | rua acima de 15 % | lote acima de 30 % | pior trecho de rua | pior lote |
|---|---|---|---|---|
| Archilly Generate — traçado ortogonal | 0 m · 0 m² · **0,0 %** do total | **nenhum** | 13,8 % em `VS-06` | 19,6 % em `L660` |
| Archilly Generate — traçado espinha de peixe | 0 m · 0 m² · **0,0 %** do total | **nenhum** | 14,3 % em `VS-contorno-26` | 18,0 % em `L195` |
| Laboratório de Parcelamento | 10 m · 115 m² · **0,1 %** do total | **nenhum** | 16,2 % em `V2` | 13,9 % em `v19-e11` |
| Symbios (motor de fora) + divisão de lotes do laboratório | 157 m · 1.320 m² · **0,3 %** do total | **nenhum** | 26,0 % em `via-48` | 20,3 % em `L1006` |

**O "pior trecho" e o "pior lote" vêm com o nome da peça**, para você achar
no desenho. As coordenadas exatas estão em
[`provas/LAB-24/terreno.json`](provas/LAB-24/terreno.json).

**O que este quadro NÃO faz:** não calcula volume de corte e aterro. Isso pede
o perfil da rua já projetado, que nenhum motor da família entrega hoje. O que
sai aqui é **a área e o comprimento sujeitos a terraplenagem** — a entrada da
conta, não o resultado dela.

---

## O que cada motor NÃO soube fazer

Esta seção existe para os quadros acima não mentirem por omissão. **Dois
motores que receberam o mesmo terreno podem não ter feito a mesma prova** — se
um lê o relevo e o outro não, comparar os dois sem dizer isso é injusto com o
que leu.

**As frases são do próprio motor, não minhas.** Cada um declara o que deixou de
fazer, nas palavras dele — por isso algumas são técnicas. Onde a mesma queixa
apareceu com números diferentes em cada terreno, os números saíram e entrou
**em quantos dos cinco terrenos** ela apareceu; os números exatos estão nos
relatórios técnicos. O total de terrenos é 5.

**Archilly Generate — traçado ortogonal**

- o relevo da gleba não foi usado: este motor não lê curva de nível no traçado — *em todos os terrenos*
- a gleba não declarou acesso; o motor escolheu um sozinho, e o traçado depende dessa escolha — *em 3 de 5 terrenos*
- … atração(ões) na entrada não entram no traçado deste motor — *em 1 de 5 terrenos*

**Archilly Generate — traçado espinha de peixe**

- o relevo da gleba não foi usado: este motor não lê curva de nível no traçado — *em todos os terrenos*
- a gleba não declarou acesso; o motor escolheu um sozinho, e o traçado depende dessa escolha — *em 3 de 5 terrenos*
- … atração(ões) na entrada não entram no traçado deste motor — *em 1 de 5 terrenos*

**Laboratório de Parcelamento**

- o Lab aparou … m de eixo que saía da gleba (… % do comprimento) — sem isso o contrato recusa o arquivo — *em todos os terrenos*
- o relevo da gleba não muda o traçado deste motor — medido no LAB-08, lote a lote — *em todos os terrenos*
- … de … variantes foram recusadas pelo esquema e ficaram fora do ranking — *em 2 de 5 terrenos*
- a testada de frente entrou como … face(s) do perímetro (`facesLoteamento: […]`) — lote virado para a rua existente — *em 1 de 5 terrenos*
- o RANKING DELE escolheu "superquadra" com … lotes (nota …); entre as aceitas, "ortogonal" dá … lotes (nota …). A escolha da variante é do motor, não do Lab — e aqui ela custa lote — *em 1 de 5 terrenos*

**Symbios (motor de fora) + divisão de lotes do laboratório**

- … de … quadras foram puladas: o esqueleto não fechou nelas (D51) — *em todos os terrenos*
- na ida: parametros (lote) — o Symbios traça via e extrai quadra; ele não parcela em lote, então todo parâmetro de lote fica sem consumidor deste lado da ponte — *em todos os terrenos*
- o motor não parcela em lote: quem subdivide a quadra é o esqueleto reto do Lab (D50) — *em todos os terrenos*
- a rede saiu em … pedaços, … % no maior — *em 4 de 5 terrenos*
- na ida: acessos — o Symbios não recebe ponto de acesso; a rede dele não é ancorada em entrada nenhuma, e ligar a rede ao acesso é trabalho de quem consumir a saída — *em 2 de 5 terrenos*
- … atração(ões) na entrada não entram no traçado deste motor — *em 1 de 5 terrenos*
- na ida: atracoes — o Symbios não tem conceito de atração: o traçado dele nasce do campo tensorial do relevo, e não há onde pendurar um ímã — *em 1 de 5 terrenos*
- na ida: crs.origemGeografica — sem origem geográfica não há como reverter o resultado para graus; a saída fica em metros locais, que é o que o contrato permite ao declarar codigo local — *em 1 de 5 terrenos*

---

## O que esta página NÃO diz

**Ela não diz qual motor é o melhor.** E não é modéstia: *melhor* depende do
que se quer do terreno. O motor que faz mais lotes é o que deixa mais terra
sem lote; o que deixa menos sobra é o que o conferente mais aponta. Quem
escolhe é você.

**Ela não é uma proposta de projeto.** São desenhos de máquina, feitos com os
mesmos parâmetros nos cinco terrenos para que a comparação fosse honesta —
não para que algum deles fosse um bom partido urbanístico.

## De onde vêm os números

- **semente:** `20260913` — a mesma em todos, e provada: rodar duas
  vezes dá o mesmo desenho, bit por bit;
- **versão do contrato de motor:** `1`;
- **números crus:** [`provas/LAB-19/tabela.json`](provas/LAB-19/tabela.json);
- **como refazer:** `bun ferramentas/lab19.ts` e depois `bun ferramentas/lab20.ts`,
  dentro de `external-engines/esteira/`;
- **os relatórios técnicos**, prompt por prompt: [`INDEX.md`](INDEX.md).
