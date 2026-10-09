# LAB-75 · item 008 — o desempate chegou, e chegou três minutos depois de eu dizer que a caixa estava vazia

**09/10/2026** · item 008 da caixa de entrada · `claude/stoic-ritchie-ijzqy3`

**O pedido:** o chat desempatou o **D236** — *no disparo sem item pronto, anote a data, responda em
uma linha e durma; **não desligue** o despertador* — e mandou gravar o motivo da regra velha, riscar
o D236, alinhar a trava e dizer no recado se o despertador estivesse desligado.

---

## 1 · A resposta, em quatro linhas

| | |
|---|---|
| **o desempate** | vale a regra da **CAIXA**: anotar e dormir. A §1-A foi corrigida, com a ordem antiga **riscada e não apagada** |
| **o motivo da velha, preservado** | desligar **era o aviso** de que a fila havia esgotado — e era bom: 4 dos 7 disparos de 15/09 não tiveram o que fazer |
| **o que mudou** | o **mecanismo**: o chat passou a escrever na caixa direto. *Despertador desligado nunca pega o item que o chat escrever depois* |
| **o despertador** | **não está desligado** — `enabled: true`, disparou às 23:05Z, próximo 00:05Z. E **eu não o toquei** |

**D244** registra o desempate; o **D236** está **riscado** apontando para ela.

---

## 2 · A lição, que é maior que o caso

> **REGRA QUE DEIXOU DE PROTEGER E PASSOU A TRAVAR NÃO MUDOU DE TEXTO — MUDOU O MUNDO EMBAIXO
> DELA.** Toda regra que existe para **avisar alguém** morre no dia em que esse alguém passa a
> enxergar sozinho. Ao ler uma regra antiga, pergunte **que serviço ela presta hoje**, não só o que
> ela manda fazer.

E o dano que ela teria causado era **silencioso**: *uma caixa com item e um despertador desligado
têm exatamente a mesma aparência de uma caixa vazia.*

---

## 3 · O que eu acertei foi NÃO desempatar, e o chat disse isso

> *"Você fez a pergunta certa e fez o que era certo fazer: **não desempatou sozinha**, porque mexer
> no `enabled` é o que o item 004 proíbe."*

Eu seguia esta mesma regra desde o item 004 — **declarada como leitura minha, não como
ratificação**. *A diferença entre as duas coisas é todo o valor deste item:* a prática era a mesma,
e o que faltava era quem respondesse por ela.

---

## 4 · E o item chegou TRÊS MINUTOS depois de eu dizer que a caixa estava vazia

| hora UTC | o que aconteceu |
|---|---|
| 23:05:53 | o despertador dispara; a caixa está vazia **de verdade** — sete feitos, nada novo |
| ~23:06 | eu confiro na `origin/main`, gravo a linha na conta e escrevo o recado de uma linha |
| **23:08:55** | **o chat escreve `008`, `009`, `010` e `010-adendo`** |
| ~23:1x | **a conferência na hora de ENVIAR acha os quatro** — e o recado ainda não tinha ido |

> **A disciplina do D238 funcionou na primeira vez que foi usada de verdade.** Em vez de mandar
> *"escreva o 008"* com o 008 já escrito — que foi exatamente o erro de 19:55 —, o recado foi
> corrigido **antes de sair**.

**A linha das 23:05 na conta FICA**, porque ela está certa: naquele minuto a caixa estava vazia. *O
disparo em vazio é um fato do minuto em que ele acontece.* O que se corrige é o que **ainda não
foi dito**.

---

## 5 · O que NÃO foi feito

- **o despertador não foi tocado** — nem para ligar, nem para desligar, nem no `cron`, nem no
  prompt guardado;
- **a regra velha não foi apagada**: está riscada, com o motivo e o mecanismo que mudou;
- **os itens 009 e 010 não foram executados** — um item por despertador (§1-A). Eles são do
  próximo disparo, e o `010` traz um **adendo com regra urbanística ditada pelo Jonny**, que é a
  classe que para e vira pergunta;
- **o CI não foi religado**, segue `disabled_manually` até 1º/11. **Verde conferido aqui, não no
  GitHub;**
- **nada foi escrito em repositório vizinho.**

## 6 · E uma régua minha repetiu o defeito de UMA HORA ANTES

A trava nova casava a lição por literal — `"MUDOU O MUNDO EMBAIXO DELA"` — e a frase está
**quebrada em duas linhas, dentro de um bloco de citação**: `MUDOU O` / `> MUNDO EMBAIXO DELA`.
Ela reprovou o texto **certo**.

É o **mesmo defeito do LAB-74 §5**, uma hora depois, e agora com a marca de citação por cima.
*Duas vezes em dois prompts é padrão, não azar* — a comparação passa a **normalizar o espaço e
tirar o `>`** antes de casar, que é o que a guarda do item 003 já fazia.

## 7 · E uma SEGUNDA régua reprovou o certo: o ACUMULADO não conhecia as classes

O bloco desta rodada é o primeiro **acumulado** que junta um `despertador-sem-item` com um prompt
— e a régua do acumulado só conhecia `LAB-xx` e `§x`. Ela **reprovou o acumulado certo**, porque
nasceu no item 002… **antes** das classes de rodada existirem como valor de `<prompt>`.

> *Régua escrita contra uma forma só proíbe a outra que existe de verdade* — **quarta vez da mesma
> forma** (D217, D219, D228, D237, e esta).

Consertada lendo a lista de `CLASSES_DE_RODADA`, **não repetindo os seis nomes num literal**: se o
vocabulário mudar, a régua muda com ele. E com os dois lados demonstrados, inclusive um acumulado
misto de três itens.

**Duas réguas minhas reprovaram o certo nesta rodada**, e as duas pelo mesmo motivo de fundo: cada
uma conhecia só o mundo que existia no dia em que foi escrita.

## 8 · O verde

**`./external-engines/conferir.sh` · `exit 0` · 7 passos · 726 travas na esteira + 17 no
testfit.** O `guardas-sem-clones` do CI vai de **336 para 337**. **Conferido aqui, não no
GitHub** — e contra os commits do **disco** dos vizinhos, que estão 20 a 27 atrás da origem.

## 9 · Os clones vizinhos ficaram limpos — com os dois números

| clone | disco | origem | estado |
|---|---|---|---|
| `motor-testfit` | `6cf6396` | `e76cad0` | **27 atrás** · 0 alterações |
| `urban-create-hub-41d93a4d` | `72cfab0` | `292757c` | **20 atrás** · 0 alterações |
| `urban-scout-tool` | `550a438` | `f7e51a6` | **24 atrás** · 0 alterações |
