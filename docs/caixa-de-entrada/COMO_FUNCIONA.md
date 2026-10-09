# Caixa de entrada — o chat escreve aqui, você lê daqui

Experiência da família Archilly, começando por este repositório em 09/10/2026.
O Lab foi escolhido porque é **público**: a conferência automática dele é gratuita,
então um erro no desenho deste ciclo não custa dinheiro a ninguém.

## O que mudou

Até ontem o Jonny era o transporte nas duas direções: copiava o prompt do chat
para cá, e copiava o recado daqui para o chat. Ele estava desanimando de "virar
pombo correio", e tinha razão.

**A volta já está resolvida:** o chat lê `docs/relatorios/RECADOS.md` direto do
GitHub. Ele nunca mais copia recado. Isso impõe uma obrigação a você —
**gravou o recado, ENVIA**. Trabalho que fica só na sua máquina é trabalho que
ninguém vê, e agora isso deixou de ser descuido e passou a ser silêncio.

**A ida é o que esta pasta resolve.** O chat escreve os pedidos aqui. Você os lê
quando acorda.

## Como você trabalha

A cada despertador:

1. Leia esta pasta. Os arquivos são numerados: `001.md`, `002.md`, …
2. Pegue **o menor número ainda não feito**. Um por despertador.
3. Faça o trabalho, com as provas que o item exigir.
4. No fim do item, renomeie o arquivo para `001-FEITO.md` e escreva no topo dele
   o que foi feito, com arquivo e linha.
5. Grave o recado em `docs/relatorios/RECADOS.md` e **envie**.
6. Volte a dormir. Não invente item que não está aqui.

Se a caixa estiver vazia, **não invente trabalho**: grave um recado de uma linha
dizendo "caixa vazia", envie, e durma. Despertador que acorda e não acha nada é
informação, não fracasso — anote a data numa linha do `ONDE_PARAMOS.md`, que é
a medição que faltava.

## O que você NÃO faz sozinho

Estas cinco classes **param e viram pergunta**, em `docs/PENDENCIAS_JONNY.md`,
e você segue para o item seguinte da caixa em vez de esperar:

1. **Gasta dinheiro do Jonny**, qualquer valor.
2. **Não se desfaz** — apagar, publicar, mandar mensagem, mexer em conta.
3. **Muda o que o usuário vê como promessa** — preço, prazo, o que o aplicativo
   diz que faz.
4. **Toca segurança, dado de pessoa ou condição comercial** (quanto custa para
   nós, qual é o fator, qual é a margem — isso nunca desce ao navegador).
5. **É decisão de urbanismo ou de negócio.** Essas são dele por definição.

Fora dessas cinco, decida e siga.

## O que vai para ramo em vez da main

O que você não tem **certeza** não entra na main. Vai para um ramo, e **o ramo se
chama pela pergunta que ele espera**, não pelo que ele faz — `espera-definicao-de-
quadra`, não `ajuste-invariante`. Mantenha a lista dos ramos abertos, com a
pergunta de cada um, em `docs/RAMOS_ABERTOS.md`. Sem isso, em duas semanas há
sete ramos e ninguém lembra o que cada um esperava.

## O que não mudou

Tudo o que já valia continua valendo, e nada aqui revoga o `CLAUDE.md`:

- **Número sem origem não vale.** Zero é uma medição, nulo é "não medi", e
  indefinido é "perguntei errado".
- **Régua nova nasce estreita demais, e às vezes larga demais** — as duas coisas
  são o mesmo defeito: ninguém a conferiu dos dois lados. Ela precisa **aprovar o
  caso bom E reprovar o caso ruim**, os dois demonstrados, antes de virar trava.
- **Um envio por entrega**, não um por arquivo.
- **Quem mede é quem vai consertar.** Não escreva no repositório de ninguém.
- **Identificador não se supõe**: mandou mexer em despertador, responda o id.

## Enquanto o orçamento do GitHub estiver estourado

A conta de Actions da família estourou em 08/10 e a cota gratuita volta em
**1º de novembro**. **Este repositório é público e não paga** — por isso ele é o
teste. Mesmo assim, prove na sua máquina e declare em cada entrega
**"conferido aqui, não no GitHub"**, porque é assim que a família inteira está
trabalhando e o hábito tem de ser o mesmo.
