# 010 — Quanto do resultado depende de ONDE ESTÁ O ACESSO

**Esta é a sua proposta do LAB-26 §2, e ela é a mais importante das suas
propostas de medição** — pela sua própria medida: *"mover o acesso mexe no
resultado MAIS QUE QUALQUER OUTRA ENTRADA que o Lab mede — 19% em lotes na
candidata ortogonal de `geo-antonina`"*.

E o resto da frase é o que faz dela um item: *"as cinco glebas declaram UM
acesso e ninguém mediu quanto o resultado depende dele"*.

## Por que isso é maior do que parece

Toda tabela comparativa que este laboratório publica compara motores **com o
acesso onde a gleba o declarou** — uma posição, escolhida por quem montou a
gleba, sem nenhuma medição por trás. Se o resultado se move 19% ao mover o
acesso, então **parte da distância que você mede entre dois motores pode ser a
posição do acesso, e não o motor**.

> **Entrada que ninguém variou é premissa disfarçada de dado.**

É a mesma família do que você já achou duas vezes: o eixo do terreno no Generate
(girar 1e-7° move a espinha em 273 lotes) e a largura da gleba (a ortogonal é
escada, a espinha é patamar). Nos dois casos a conclusão foi: **toda medição
declara em que condição foi feita.** Esta é a terceira condição, e ela não está
declarada em lugar nenhum.

## O que medir

Para cada uma das cinco glebas-padrão, **mover o acesso ao longo do perímetro**
e medir o que o laboratório já mede (lotes, área, violações, nota) em cada
posição. O **como** é seu — você conhece as glebas. Duas sugestões, e são
sugestões:

- varrer o perímetro a passo fixo é o mais honesto, porque não escolhe posições
  bonitas;
- os **vértices** da gleba merecem atenção própria: acesso em quina é um caso
  diferente de acesso no meio de uma face.

**Entregue a CURVA, não a média.** Média de uma grandeza que oscila esconde
exatamente o que se quer saber — e você já pagou por isso: *"a distância entre
as candidatas oscila de 1,8% a 13,7% sem que a espinha mude nada"*.

## O que a medição tem de responder, por escrito

1. **De quanto é a oscilação**, por gleba e por motor — em lotes, em área e em
   violações;
2. **se ela muda a ORDEM dos motores** em alguma gleba. Esta é a pergunta que
   decide se a tabela comparativa precisa de ressalva, e ela é diferente de
   "muda o número" (o seu D133: *em parte faltava dado, não mudava a ordem*);
3. **qual posição cada gleba declara hoje**, e se ela é boa, ruim ou mediana
   dentro da própria curva. Se a posição declarada for a melhor de todas, isso
   precisa estar dito — e seria um achado sobre as glebas, não sobre os motores.

## O cuidado, que é o seu próprio ponto cego

Dezenove vezes o defeito estava na sua régua antes de estar no medido. Aqui o
risco tem nome: **mover o acesso pode produzir gleba inválida** (acesso dentro
de uma restrição, acesso em ponto que o motor recusa), e **recusa não é zero**.
Posição recusada sai `null` com o motivo, nunca contada como "zero lotes" — senão
a curva afunda num lugar onde não há queda nenhuma, só ausência de medição.

## As cinco classes

Conferidas uma a uma: **não gasta dinheiro**; **tem volta** (é medição, grava
prova nova e não sobrescreve nenhuma — D182); **não muda promessa ao usuário**;
**não toca segurança nem dado pessoal**; **não é urbanismo nem negócio** — mover
o acesso **na medição** não propõe mover o acesso de nenhum projeto. Se a
medição concluir que alguma gleba-padrão deveria declarar outro acesso, isso
**não se muda**: vira linha na página do Jonny, porque gleba-padrão é a régua da
família.

=== FIM DO PROMPT ===
