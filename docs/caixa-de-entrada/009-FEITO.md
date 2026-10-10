# 009 — O LAB-06: o registro de motores, que é o item mais VELHO da sua fila

**Por que este item, e não outro:** o Jonny estabeleceu em 09/10/2026 a ordem de
escolha da família — **primeiro o mais importante; em caso de empate ou dúvida,
o mais VELHO**. Entre as suas propostas, o LAB-06 é o mais velho **e** é decisão
de família já tomada (**D68**), que pede três coisas e que nenhum motor novo
consegue entrar sem elas.

As suas próprias palavras na fila: *"é o outro passo óbvio — o LAB-06 da fila
original já era, palavra por palavra, o que a D68 pede"*.

## O que a D68 pede, e é isto que se faz

1. **Um registro de motores** — a lista de quais motores este laboratório
   conhece, com o que cada um é: nome, origem (`upstream/` ou da família por
   caminho), versão ou commit medido, e **o que ele promete** (quais campos do
   contrato ele de fato publica).
2. **Liga e desliga por motor** — poder medir a esteira com um motor fora, sem
   tirar código nenhum e sem editar a esteira.
3. **Motor padrão** — qual deles responde quando ninguém escolhe.

## O que o registro NÃO é, e isto importa mais que o resto

**Não é uma cópia do inventário das pontes.** O inventário diz *o que cada campo
faz na travessia*; o registro diz *que motores existem e qual está ligado*. Se
você se pegar escrevendo campo a campo no registro, parou no lugar errado — e aí
a regra que vale é a que o Jonny acabou de dar à direção:

> **Nome novo para coisa que já tem nome na casa é custo sem benefício.** Antes
> de criar estrutura nova, procure a que já responde a pergunta.

**E o registro não decide nada sozinho.** Ligar ou desligar um motor **muda toda
medição desta casa** — é o seu próprio D226. Então: o estado do registro é
**dado**, não código (requisito que a Viabilidade mediu hoje: *"com o catálogo
dentro do build, trocar uma chave é um envio"*), e **o motor padrão de hoje
continua sendo o de hoje**. Mudar o padrão é prompt, não conserto silencioso.

## A trava que vem com ele

Pelo menos estas, e a terceira é a que vale:

1. todo motor que a esteira roda **está no registro**;
2. todo motor do registro tem a procedência medida, com a distância até a origem
   (o segundo eixo do carimbo que você criou no LAB-74 — *árvore limpa quer
   dizer "eu não mexi", não "está atual"*);
3. **motor desligado não entra em medição nenhuma**, e o relatório diz quantos
   motores havia e quantos estavam ligados. *Conferência que não publica o
   tamanho do universo que leu passa lendo zero.*

## As cinco classes

Conferidas uma a uma: **não gasta dinheiro** (nada pago aqui); **tem volta** (é
estrutura de leitura, nenhuma medição é sobrescrita); **não muda promessa ao
usuário** (este repositório não tem tela); **não toca segurança nem dado
pessoal**; **não é urbanismo nem negócio** — é arquitetura de laboratório, e a
decisão de família já está tomada na D68.

**Mas uma fronteira existe e você para nela:** se fazer isto exigir **mudar o
motor padrão** ou **desligar um motor** que hoje entra nas medições, você
**descreve o que mudaria e não muda**. Isso é prompt do chat.

=== FIM DO PROMPT ===
