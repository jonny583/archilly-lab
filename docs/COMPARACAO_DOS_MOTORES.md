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
| **Lotes** | quantos lotes o motor desenhou |
| **Área vendável** | a soma dos lotes, em hectares |
| **Virou lote** | quanto do terreno virou lote, em porcentagem. O resto é rua, praça, área de preservação e sobra |
| **Apontado pelo conferente** | quantas regras o desenho quebrou, na conta do conferente do Archilly Generate — o *Validator*. **Zero é o alvo, e é ele que diz se a proposta passa** |
| **Terra sem lote** | terra dentro da área loteável que não virou lote nem rua. É prejuízo |
| **Forma dos lotes** | ver a seção *A forma dos lotes*, logo abaixo |
| **Tempo** | quanto o motor levou para desenhar |

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
| Laboratório de Parcelamento · Terreno sintético plano | **29** | **nenhum** |
| Laboratório de Parcelamento · Terreno de teste completo — com áreas de preservação | **25** | **nenhum** |
| Symbios (motor de fora) + divisão de lotes do laboratório · Antonina (PR) — terreno real, levantado pelo Archilly Geo | **4** | **87** |
| Symbios (motor de fora) + divisão de lotes do laboratório · Terreno de teste completo — com áreas de preservação | **1** | **74** |

Ou seja: **um motor pode ter todos os lotes bem formados e ainda assim ser
reprovado pelo conferente**, e pode passar no conferente com lotes de forma
ruim. Somar as duas colunas numa nota só esconderia justamente isso.

---

## Terreno de teste completo — com áreas de preservação

**141,8 hectares** · identificação técnica do terreno: `completo`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | tempo |
|---|---:|---:|---:|---:|---:|---|---:|
| Archilly Generate — traçado ortogonal | 1.606 | 58,33 ha | 41,1 % | **nenhum** | 70,00 ha · 49,4 % | 2 a conferir (0,1 %) | 1,8 s |
| Archilly Generate — traçado espinha de peixe | 1.805 | 64,94 ha | 45,8 % | 1 | 52,92 ha · 37,3 % | 1 a conferir (0,1 %) · **35 ruins (1,9 %)** | 1,7 s |
| Laboratório de Parcelamento | 1.060 | 42,44 ha | 29,9 % | 25 | 19,44 ha · 13,7 % | 1 a conferir (0,1 %) | 5,5 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 932 | 28,73 ha | 20,3 % | 1 | 82,18 ha · 58,0 % | 308 a conferir (33,1 %) · **74 ruins (7,9 %)** | 6,0 s |

## Terreno sintético ondulado

**50,0 hectares** · identificação técnica do terreno: `sintetico-50ha-ondulado`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | tempo |
|---|---:|---:|---:|---:|---:|---|---:|
| Archilly Generate — traçado ortogonal | 1.003 | 36,37 ha | 72,7 % | **nenhum** | 5,34 ha · 10,7 % | **todos ok** | 0,4 s |
| Archilly Generate — traçado espinha de peixe | 788 | 28,51 ha | 57,0 % | **nenhum** | 10,61 ha · 21,2 % | **14 ruins (1,8 %)** | 0,4 s |
| Laboratório de Parcelamento | 501 | 19,99 ha | 40,0 % | 18 | 0,23 ha · 0,5 % | 4 a conferir (0,8 %) | 2,3 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 318 | 9,59 ha | 19,2 % | **nenhum** | 26,26 ha · 52,5 % | 125 a conferir (39,3 %) · **21 ruins (6,6 %)** | 1,4 s |

## Terreno sintético plano

**10,0 hectares** · identificação técnica do terreno: `sintetico-10ha-plano`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | tempo |
|---|---:|---:|---:|---:|---:|---|---:|
| Archilly Generate — traçado ortogonal | 171 | 6,28 ha | 62,8 % | **nenhum** | 2,12 ha · 21,1 % | **todos ok** | 0,1 s |
| Archilly Generate — traçado espinha de peixe | 137 | 5,00 ha | 50,0 % | **nenhum** | 2,65 ha · 26,4 % | **8 ruins (5,8 %)** | 0,1 s |
| Laboratório de Parcelamento | 124 | 4,90 ha | 49,0 % | 29 | 0,06 ha · 0,6 % | 4 a conferir (3,2 %) | 0,3 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 66 | 2,35 ha | 23,5 % | **nenhum** | 6,09 ha · 60,9 % | 15 a conferir (22,7 %) · **2 ruins (3,0 %)** | 0,5 s |

## Gleba de ensaio do Archilly Generate

**47,0 hectares** · identificação técnica do terreno: `ensaio-47ha`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | tempo |
|---|---:|---:|---:|---:|---:|---|---:|
| Archilly Generate — traçado ortogonal | 974 | 35,33 ha | 75,2 % | **nenhum** | 3,48 ha · 7,4 % | **todos ok** | 0,4 s |
| Archilly Generate — traçado espinha de peixe | 778 | 28,21 ha | 60,0 % | **nenhum** | 6,01 ha · 12,9 % | 2 a conferir (0,3 %) · **14 ruins (1,8 %)** | 0,4 s |
| Laboratório de Parcelamento | 599 | 23,82 ha | 50,7 % | 16 | 0,04 ha · 0,1 % | 9 a conferir (1,5 %) | 1,6 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 214 | 6,61 ha | 14,1 % | **nenhum** | 27,13 ha · 58,0 % | 73 a conferir (34,1 %) · **8 ruins (3,7 %)** | 0,8 s |

## Antonina (PR) — terreno real, levantado pelo Archilly Geo

**141,8 hectares** · identificação técnica do terreno: `geo-antonina`

| motor | lotes | área vendável | virou lote | apontado pelo conferente | terra sem lote | forma dos lotes | tempo |
|---|---:|---:|---:|---:|---:|---|---:|
| Archilly Generate — traçado ortogonal | 1.390 | 50,17 ha | 35,4 % | 1 | 79,45 ha · 56,1 % | **todos ok** | 0,5 s |
| Archilly Generate — traçado espinha de peixe | 1.657 | 59,62 ha | 42,1 % | **nenhum** | 67,49 ha · 47,6 % | **9 ruins (0,5 %)** | 0,5 s |
| Laboratório de Parcelamento | 1.386 | 55,50 ha | 39,2 % | 15 | 6,09 ha · 4,3 % | **todos ok** | 6,5 s |
| Symbios (motor de fora) + divisão de lotes do laboratório | 1.014 | 29,85 ha | 21,1 % | 4 | 65,15 ha · 46,0 % | 365 a conferir (36,0 %) · **87 ruins (8,6 %)** | 9,6 s |

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
- … de … variantes foram recusadas pelo esquema e ficaram fora do ranking — *em 3 de 5 terrenos*
- … atração(ões) na entrada não entram no traçado deste motor — *em 1 de 5 terrenos*

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
