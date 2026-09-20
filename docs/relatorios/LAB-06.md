# LAB-06 — A PEÇA PRONTA, E O TESTE DE QUE O LAB PODE SUMIR

**Data:** 20/09/2026 · **Entrega:**
[`../../entrega/registro-de-motores/`](../../entrega/registro-de-motores/)
**Quem instala:** a sessão do **Generate**, no **GU-03**. O Lab não escreve no
repositório deles.

---

## O resultado em uma frase

**A peça está pronta, documentada e provada dos dois lados:** com motores de
mentira, para mostrar que ela não precisa do Laboratório; e com os **quatro
motores de verdade**, para mostrar que ela serve.

---

## 1 · O que a peça é

A parte **não-visual** da tela unificada: o registro dos motores, o botão
liga/desliga, a escolha do usuário e a regra do ranking. Um arquivo de código,
**sem dependência nenhuma** — nem npm, nem do Laboratório. Copiar a pasta é a
instalação.

| o que a D68 pede | como a peça entrega |
|---|---|
| vários motores sob a mesma tela | `RegistroDeMotores.registrar()` |
| **todos visíveis e ligados** por padrão | nascem ligados; desligar é ato do usuário |
| **motor padrão = o do Parcelamento** | `PADRAO_DE_FABRICA = "parcelamento"` |
| botão liga/desliga por motor | `ligar(id)` / `desligar(id)` |
| **escolha do usuário salva** | `estadoDoUsuario()` / `aplicarEstado()` |
| só entra no ranking quem o Validator aprova | `montarRanking(…, julgar)` |
| reprovada **com o motivo, nunca com o resultado** | o tipo `CandidataReprovada` **não tem** o campo |
| **nunca ranking vazio em silêncio** | `nenhumaAprovada` + `recado`, com três frases diferentes |

---

## 2 · O teste que dá nome ao prompt

*"…e o teste de que apagar o Lab inteiro não quebra o Generate."* Feito de dois
jeitos, porque um só não bastava:

**Por leitura.** Nenhum arquivo de `entrega/` importa `external-engines/`,
`@symbios`, `@testfit`, `@generate` ou a esteira — **e nem npm**. O teste lê os
`import` de cada arquivo e reprova se alguém acrescentar um. É o que pega a
dependência que entra sem ninguém perceber, seis meses depois.

**Por execução.** O registro roda com um **motor de mentira escrito dentro do
próprio teste**. Não é atalho: é o ponto. Se a peça precisasse do Laboratório
para funcionar, esse teste **não compilaria**.

A peça vive **fora de `external-engines/`** por isso. Dentro, ela sumiria junto
com a pasta que a regra de ouro manda poder apagar (CLAUDE.md §3).

---

## 3 · A parte que a D68 pedia e o contrato não cobria

O contrato de motor unificado para na porta — §10.4 dele diz *"nada aqui fala de
tela"*. **Como a candidata reprovada aparece** era, portanto, terra de ninguém.
A peça a resolve com três regras, e a terceira é a que ninguém pensa antes de
perder o usuário:

**1 · Só entra quem o Validator aprova.** Sem versão leve e sem limiar mais
frouxo por o motor ser de fora — é a mesma régua do motor da casa (D20).

**2 · A reprovada leva o MOTIVO e não leva o resultado.** O desenho não vai
junto, e **o tipo não tem o campo**: não é questão de lembrar de não mostrar.
Mostrar geometria reprovada é convidar alguém a usá-la "só para ver", e o que se
vê vira o que se aprova.

**3 · Nunca um ranking vazio em silêncio.** Se todas reprovarem, a tela **diz
isso** e mostra os motivos. E o recado distingue três situações que não se
parecem:

| situação | o que a tela diz |
|---|---|
| correram e todas reprovaram | *"Nenhuma das N propostas passou na conferência…"* |
| está tudo desligado | *"Todos os motores estão desligados. Ligue ao menos um…"* |
| não há motor instalado | *"Nenhum motor está instalado nesta tela."* |

Uma lista vazia sem explicação é lida como *"o sistema não achou nada"* — quando
o que houve foi *"achou quatro e reprovou as quatro"*, que é informação, e das
boas.

---

## 4 · Duas decisões de desenho que custaram pensar

### 4.1 · O estado salvo guarda os DESLIGADOS, não os ligados

Guardar os ligados parece natural e **perde informação**: um motor fora da lista
pode ser *"o usuário desligou"* ou *"não existia quando isto foi salvo"* — e as
duas pedem respostas **opostas**. A primeira tem de ser respeitada; a segunda tem
de nascer ligada, pela D68.

Guardando os **desligados**, a ambiguidade some: quem está na lista fica
desligado, quem não está fica ligado. **Motor novo nasce ligado sem ninguém
decidir nada**, e a escolha do usuário sobrevive à chegada dele. Dois testes
travam exatamente isso.

### 4.2 · Motor que estoura não derruba os outros

O contrato proíbe estourar (§7), **e a peça não confia**: ela envolve cada
geração e transforma a exceção em reprovação com o motivo.

Não é paranoia — **já aconteceu**: o Symbios estourava em gleba sem relevo, e foi
o teste da porta que o pegou (D66). Numa tela com vários motores lado a lado, um
que caia levando os outros é o pior defeito possível.

---

## 5 · A demonstração com os quatro motores de verdade

`bun run lab06`, em `ensaio-47ha`, com o Validator e o Judge do Generate ligados
na peça:

```text
  [x] Archilly Generate · candidata ortogonal
  [x] Archilly Generate · candidata espinha
  [x] Laboratório de Parcelamento  ← padrão
  [x] Symbios Tensor + subdivisão do Lab

  RANKING — 3 aprovada(s), 1 reprovada(s)
    1º Archilly Generate · candidata ortogonal · nota 974
    2º Archilly Generate · candidata espinha · nota 776
    3º Symbios Tensor + subdivisão do Lab · nota 214
    ✗ Laboratório de Parcelamento — o conferente achou 16 problema(s):
        10 de "testada", 6 de "face-quadra"
        (o desenho dela não é mostrado, de propósito)
```

As aprovadas levam as **ressalvas** ao lado — *"o traçado sai igual ao de um
terreno plano"*, *"a rede não é ancorada na entrada do terreno"*. Sem elas, o
urbanista compara três propostas achando que os três motores receberam a mesma
coisa. Não receberam.

### E um fato que a demonstração põe na mesa

**Nesta gleba, o motor PADRÃO é justamente o que o Validator reprova.** A D68 põe
o do Laboratório de Parcelamento como padrão; em `ensaio-47ha` ele sai com 16
violações e não entra no ranking, enquanto os outros três entram.

**Não é recomendação de produto** — é consequência medida, e a tela vai encontrá-la
no primeiro terreno. A peça já trata o caso sem quebrar: o padrão reprovado
aparece entre as reprovadas, com o motivo, e o usuário vê as três aprovadas.
**O que fazer a respeito é do chat e do Jonny**, e está proposto na fila.

Os números crus: [`../provas/LAB-06/ranking.json`](../provas/LAB-06/ranking.json).

---

## 6 · O que ficou provado

- **22 testes** só da peça, e o primeiro é o de apagar o Lab;
- **escolha do usuário salva e devolvida**, com motor novo nascendo ligado e
  motor que sumiu voltando em `esquecidos`, nunca em silêncio;
- **a peça não importa nada** — conferido por leitura de `import`, arquivo a
  arquivo;
- **nada foi escrito em repositório vizinho.** `git status` limpo nos três
  clones. A peça vai ao Generate **pelo chat**, e quem a instala é o GU-03.
