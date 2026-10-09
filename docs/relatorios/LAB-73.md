# LAB-73 · item 006 — a trava forte é a estrutura, e a minha é de palavra

**09/10/2026** · item 006 da caixa de entrada · `claude/stoic-ritchie-ijzqy3`

**O pedido:** três coisas medidas pela Pesquisa de Mercado depois de eu gravar a regra do item
005 — a trava de estrutura contra a de palavra, as condições de volta escritas sob a regra
antiga, e o requisito de arquitetura do recorte.

---

## 1 · As três respostas, medidas

| a pergunta | a resposta |
|---|---|
| a minha trava é **palavra** ou **estrutura**? | **palavra** — e dos **12** compromissos de formato real ela pega **4**: **8 escapam** |
| existe **tipo** onde a mensalidade caberia? | **não há onde** — zero campos de recorrência em todo `.ts` que o git carrega |
| há **condição de volta** que seja uma conta? | **zero**, de **quinze** condições declaradas |
| o **recorte** por estado/conta/operação? | **não há fonte paga aqui para recortar** — dimensionado em `PENDENCIAS_JONNY.md` §8 |

---

## 2 · A lição da Pesquisa está certa, e o exemplo dela sobre mim estava errado

> *"Não escreva 'recusar mensalidade' numa conferência. Tire o campo onde a mensalidade caberia.
> Campo que não existe não se esquece."*

O item diz que *"franquia mínima e teste grátis passam por qualquer varredura de texto — nenhum
dos dois diz mensalidade"*. **Na minha régua não passam:** há padrão para os dois, e a trava do
item 005 já provava isso com eles plantados.

**Mas medido, o problema é pior do que o exemplo.** Dos **doze** compromissos mensais de formato
real declarados em `src/trava-de-estrutura.ts`, a régua de palavra pega **quatro**:

```
PEGA (4) ..... assinatura mensal de R$ 400 · plano Starter: R$ 99/mês
               franquia mínima de R$ 100 · free trial, then US$ 20

ESCAPAM (8) .. Starter plan: 1.000 consultas incluídas, renovação automática
               compromisso mínimo de 50 chamadas por mês
               contrato anual com faturamento recorrente
               US$ 10 de mínimo de faturamento no período
               o plano inclui 5.000 requisições; excedente cobrado à parte
               licença por assento, renovada automaticamente
               pacote pré-pago de créditos que expiram em 30 dias
               teste de 14 dias, cartão obrigatório
```

> *Exemplo errado com conclusão certa continua valendo — e conferir o exemplo é o que mede o
> tamanho real do problema.* **A §4-A passou a dizer, com a palavra, que a trava é de palavra e
> não de estrutura, e quanto ela deixa passar.**

---

## 3 · A resposta de estrutura aqui é "não há onde", e foi varrida

**Nenhum campo de recorrência declarado em tipo nenhum**, em todo `.ts` e `.tsx` que o git
carrega. Não existe neste aplicativo um tipo que represente preço de fonte paga: não há
mensalidade, franquia nem mínimo **a tirar**, porque não há onde caberiam. O item diz que essa
resposta é válida — e ela está medida, não suposta.

**A régua casa DECLARAÇÃO DE CAMPO, não menção**, e foi preciso: `assinatura` aparece **sete
vezes** aqui e é a **assinatura de determinismo** de uma rodada do motor — o hash que prova que a
mesma semente devolve o mesmo plano. *Uma régua de palavra acusaria as sete.*

---

## 4 · E a régua de ESTRUTURA caiu no defeito da régua de palavra (D240)

Ela incluía `plano` entre os nomes de recorrência — *plano* é palavra de cobrança em todo lugar —
e acusou **`plano: Plano`**, duas vezes, em `testfit/adapter/src/volta.ts`: **o plano de
loteamento, o objeto central deste repositório inteiro.**

> **"Campo que não existe não se esquece" é verdade — mas campo cujo NOME eu adivinhei tem a
> mesma doença, só mudada de lugar: do texto para o identificador.**

É a **décima nona** ocorrência do ponto cego da §6, pega dentro do prompt pela própria trava.
`plano` e `planoId` saíram; ficaram só os nomes sem outro significado nesta casa. A §6 foi
atualizada: **19 linhas, 19 declarado, 10 + 4 + 2 + 2 + 1 = 19**, com a guarda da aritmética
conferindo linha por linha.

---

## 5 · As condições de volta: ZERO de quinze, e zero é resposta

| o que | quantas |
|---|---|
| condições de abertura declaradas na `FILA.md` | **15** |
| …que são uma **conta** (volume, ponto de equilíbrio, *"quando compensar"*) | **ZERO** |

As quinze são: `prompt-novo` (6), `nao-medido` (3), `aguardando-outro-repositorio` (3),
`escopo-novo` (1), `depois-do-mvp` (1), `aguardando-o-jonny` (1) — **todas esperam pessoa,
repositório, prompt novo ou medição.** Nenhuma espera um número de vendas.

**E a régua desta varredura também precisou de conserto antes de sair:** a primeira versão casava
`se o volume` e **acusou a linha da própria §6** — *"pergunte se o volume é da coisa ou da sua
régua"* —, que fala de **volume de acusação**, não de vendas. Agora o volume tem de vir **perto de
pagar, compensar ou dinheiro**.

**E ela contava duas vezes a mesma linha** quando dois padrões mordiam juntos — o que inflaria
exatamente o número que o item pediu. Uma linha conta **uma** condição.

---

## 6 · O recorte: aqui não há o que recortar, e o tamanho está na página do Jonny

A regra pede que fonte paga possa ser ligada e desligada **por recorte**, sem tocar em código.
Medido pelo chat em três aplicativos: o liga/desliga existe, o recorte **não**.

**Neste laboratório não há fonte paga nenhuma** — logo não há recorte a fazer. O que fica é o
dimensionamento, em `docs/PENDENCIAS_JONNY.md` **§8**, escrito para leigo: **pequeno aqui** (um
arquivo de configuração lido na hora de rodar, mais o catálogo sabendo dizer *"paga, ligada aqui,
desligada ali"*), **médio a grande na família**, e só vale a pena **quando houver a primeira fonte
paga**. *É obra, não conserto — e obra espera o Jonny.*

---

## 7 · Quatro arquivos que ENUNCIAM a proibição foram acusados pela régua que a cumpre

Quinta vez da forma do **D155** na mesma lista, e num par de prompts: a §4-A escreve *"custo,
fator e margem nunca chegam ao usuário comum"*; a consequência nº 3 em código diz *"o
multiplicador não chega ao usuário"*; o relatório do 005 descreve o achado; e o item 006 cita
*"quando compensar"* para dizer que isso é condição de conta.

A lista nominal de exceções foi de **6 para 9** — e **ganhou um critério, não só um número**:

> **O teto sobe quando a regra passa a ser ESCRITA em mais um lugar, e cada entrada nomeia qual
> regra enuncia. Se ele subir sem que uma regra nova tenha sido escrita, o que está errado é o
> DESENHO da lista, não o número** — e aí a varredura precisa aprender a diferença entre prosa e
> produto.

## 8 · O que NÃO foi feito

- **nada foi contratado**, nenhuma conta aberta, nenhuma chave cadastrada, nenhum teste iniciado;
- **nenhum número de preço foi inventado**, e nenhum valor de vocabulário fechado: as palavras das
  réguas são as que as réguas conhecem;
- **o recorte não foi construído** — é obra, está dimensionada, e espera o Jonny;
- **o CI não foi religado**, segue `disabled_manually` até 1º/11. **Verde conferido aqui, não no
  GitHub;**
- **nada foi escrito em repositório vizinho**;
- **não há prova em `docs/provas/`**: as três respostas deste item são medidas **pela suíte**, que
  é onde elas se revalidam a cada verde. *Prova inventada para cumprir a §7 seria dado inventado.*

## 9 · O verde

**`./external-engines/conferir.sh` · `exit 0` · 7 passos · 714 travas na esteira + 17 no
testfit.** A trava nova entrou também no `guardas-sem-clones` do CI, que vai de **315 para 325**.
**Conferido aqui, não no GitHub.**

## 10 · Os clones vizinhos ficaram limpos

`git status` nos três: **0 alterações** em `urban-scout-tool`, `urban-create-hub-41d93a4d` e
`motor-testfit`.
