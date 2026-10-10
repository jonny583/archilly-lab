# 012 — a trava que confere a prova contra SI MESMA, e não a reexecuta

> **Vem do chat, 10/10/2026 às 04h55.** A sua caixa esgotou às 04:05 e você fez
> o certo: anotou a data e dormiu, sem desligar nada. A escolha deste item é
> **sua proposta**, saída do **LAB-60**, e está na `FILA.md` como *"não
> executado"*.

## Por que esta, entre as duas propostas abertas

A outra é a **D243** — escopar a varredura de custo por **destino** e não por
nome de arquivo, porque a lista nominal foi de **6 para 11 em três prompts** e
as duas últimas entradas são **relatórios**. Ela é boa, está certa, e é a
**próxima**. Escolhi esta primeiro por uma diferença de natureza:

- a D243 descreve uma varredura que vai **apodrecer devagar**, uma linha por
  relatório, **à vista de todos**;
- esta descreve uma trava que **não pode falhar**. Você mediu no LAB-60 que a
  prova do LAB-57 estava **velha no momento em que foi commitada** (1 contra 10)
  e que **nada no verde reprovou isso**.

> **Lista que cresce é dívida visível. Trava que confere consigo mesma é
> dívida invisível — e ela sai VERDE.**

E ela é a mesma doença que o chat tem escrita contra **si**: em 09/10 a minha
varredura disse *"Central sem novidade"* comparando o meu disco com o meu
próprio commit. **Régua que confere consigo mesma não confere nada.**

## O que fazer

**Primeiro, MEÇA o alcance antes de construir.** Quantas provas do repositório a
trava de hoje confere **contra si mesmas** — isto é, lendo o número gravado e
conferindo que o arquivo é coerente — em vez de **reexecutar** a varredura e
comparar? Diga o número, e diga **quantas são**, para que *"verde"* não volte a
ser uma frase sobre um universo não medido.

**Depois, a pergunta de projeto que você mesma trouxe, e ela é a parte difícil:**
quais provas podem ser **regeradas dentro da trava** sem ferir o **D182**, que
proíbe sobregravar prova *"antes"* com prova *"depois"*?

A régua que eu sugiro, e ela é sugestão, não ordem — **a decisão de desenho é
sua**:

- **prova de ESTADO DE AGORA** (quantos sítios existem hoje, quantas colunas o
  banco tem, quantas frases a varredura leu) **pode ser regerada**: ela afirma o
  presente, e presente velho é presente errado;
- **prova de EVENTO** (o antes de um conserto, a sabotagem que reprovou, a
  medição que motivou uma decisão) **nunca se regera**: ela afirma um momento, e
  regerá-la apaga o momento. É o D182 inteiro.

Se essa divisão não couber em alguma prova do repositório, **ela é o achado** —
escreva qual e por quê, em vez de forçá-la.

## Pare na fronteira se

- a trava nova quiser **escrever** dentro de `docs/provas/` sem que a divisão
  acima diga que aquela prova é de estado — aí é o D182, e o D182 não se
  afrouxa de madrugada;
- regerar alguma prova exigir rede, serviço pago ou o navegador — nada disso se
  contrata nem se liga sem o Jonny.

## A guarda da guarda, que aqui é obrigatória

Esta rodada constrói uma trava. Então ela **se quebra de propósito nos dois
sentidos**, e os dois casos ficam escritos: com a prova **em dia** tem de
passar; com a prova **velha de propósito** tem de reprovar **pelo nome da
prova**. Sem o segundo, você construiu uma segunda trava que confere consigo
mesma — o defeito, de novo, com mais código.

E ela **publica o tamanho do universo que leu**.

## Conferência

`./external-engines/conferir.sh` — os sete passos, com as duas guardas de
cobertura e precondição. **Declare "conferido aqui, não no GitHub"**: a execução
automática segue desligada desde 08/10, e a receita de religar é
`docs/COMO_RELIGAR_O_CI.md`, dois passos, que **não** se executa agora.

## Duas linhas de encerramento, para a sua FILA.md

1. **O desempate do D236 já veio, no item 008**, e a sua leitura estava certa:
   **anotar e dormir, nunca desligar**. A `CLAUDE.md` §1-A foi reescrita no
   chat e nas onze casas; risque o D236 apontando para a decisão nova.
2. **A D243 é o próximo item.** Não comece agora — ela é mudança de modelo de
   uma varredura de segurança, e isso não se faz na mesma rodada de outra coisa.

## A regra do chat até sábado às 15h

**Nenhuma pergunta ao Jonny.** O que for decisão dele vira linha em
`docs/PENDENCIAS_JONNY.md`, no nível de leigo, e o trabalho segue pelo caminho
mais conservador, dizendo por escrito o que você assumiu.
