# LAB-69 · item 002 — as rodadas sem âncora, e o número era meu

**09/10/2026** · item 002 da caixa de entrada · **conferido AQUI, não no GitHub**

---

## 1 · A resposta, em quatro linhas

| | |
|---|---|
| **o número** | eu disse **nove**; são **dez** — e a primeira contagem de hoje deu **treze**, por régua estreita (D230) |
| **a âncora** | o **`<prompt>` do cabeçalho**, escolhido depois de **medir** PR, commit e data (D229) |
| **o histórico** | **não foi reescrito** — as dez são classificadas pelo que o título delas já diz |
| **os dois lados** | 73 recados sem nenhum órfão · um órfão plantado **no arquivo de verdade** é pego |

---

## 2 · As dez, por data e classe — e nenhuma precisava de relatório

| # | data e título | classe | por que não tem relatório |
|---|---|---|---|
| 1 | 15/09 · Decisão do Jonny sobre a travessia | `decisao-registrada` | decisão dele, sem prompt atrás |
| 2 | 20/09 · A decisão de família gravada | `decisao-registrada` | idem |
| 3 | 20/09 · D69 — a via desenhada à mão | `decisao-registrada` | idem |
| 4 | 03/10 · Disparo sem item pronto | `despertador-sem-item` | não havia o que fazer (D62) |
| 5 | 03/10 · A fila de 03/10 esgotou | `fila-esgotada` | o saldo mora no `BALANCOS.md` |
| 6 | 05/10 · Disparo sem item — travou no LAB-47 | `despertador-sem-item` | idem |
| 7 | 05/10 · Disparo sem item — esgotou no LAB-47 | `despertador-sem-item` | idem |
| 8 | 07/10 noite · T-36 a T-39, **não executada** | `fila-recusada` | recusa é entrega, não prompt |
| 9 | 08/10 · §1, recado **recuperado** | `recado-recuperado` | o que ele registra é a própria falta (D216) |
| 10 | 08/10 · §1-C e o levantamento da Central | `fora-de-fila` | pedido direto, fora da fila |

**Nenhuma delas devia ter relatório** — e é por isso que a trava do D216 não as via: ela cobrava
o artefato errado.

---

## 3 · A âncora, escolhida DEPOIS de medir as outras (D229)

O item avisou: *"uma régua que depende de arquivo que pode não existir vai ter esse buraco de
novo."* Então medi as três candidatas antes de escolher:

| candidata | medida | veredicto |
|---|---|---|
| o número do **PR** | **42** mesclados na `main`, **4** citados em recado | reprovaria **38** legítimas |
| o **commit** da entrega | rodada que não produz commit não tem nenhum | o mesmo buraco |
| a **data** no `RECADOS.md` | **zero** dias com commit e sem recado — mas **dois recados no mesmo dia são comuns** | não distingue rodada de rodada: **não teria pego o PR #85** |

**A âncora é o `<prompt>` do cabeçalho**, que sempre existe. Ele passa a ser **um prompt ou uma
das seis classes de rodada**, de vocabulário fechado:

```
despertador-sem-item · fila-esgotada · fila-recusada
decisao-registrada   · recado-recuperado · fora-de-fila
```

`—` não ancorava nada: servia igualmente para *"não era prompt"* e para *"esqueci de dizer"*, e
era essa ambiguidade que escondia a rodada.

### Sem reescrever o registro, e sem lista de exceção

As dez já na casa são classificadas **pelo que o título delas diz** — texto que eu escrevi no
dia. *A régua lê o registro; ela não o corrige.* E a régua não tem nome de recado nenhum, só
classes: **lista de exceção cresce e ninguém a lê**, e o item proibiu as duas coisas.

---

## 4 · Os dois lados, demonstrados

| lado | como | resultado |
|---|---|---|
| **bom** | os **73** recados do histórico | **zero órfãos** |
| **ruim** | um recado plantado **no arquivo de verdade**, com `—` e título que não declara classe | pego, nomeado |
| **ruim** | classe **inventada** fora do vocabulário (`arrumacao`) | pego |

`external-engines/esteira/tests/classes-de-rodada.test.ts`, **9 travas**.

---

## 5 · O número era meu, e estava errado nos dois sentidos (D230)

O item me citou de volta: *"são 9 recados assim"*. **São dez** — a classe cresceu em 08/10 com a
rodada da §1-C, e eu não voltei para corrigir o número que já tinha saído.

E a **primeira contagem de hoje deu treze**, porque a régua chamou de órfãos o `LF-01`, o
`LF-FINAL` e o `LF-FINAL-2` — prompts de verdade, de outra numeração. Ela casava `LAB-\d\d`.

> **Terceiro precedente da mesma família em três dias:** D217 (o cabeçalho composto
> `LAB-13 e LAB-14`), D219 (o acumulado que proibia rodada fora de fila) e esta. **E o item 002
> mandou lembrar do primeiro, por escrito — e eu repeti mesmo assim.**

O que caracteriza um prompt é a **forma**, não a sigla. Os cinco formatos estão na trava.

> *Número que saiu num recado continua sendo meu depois de sair.* Eu só descobri que eram dez
> porque fui **recontar** em vez de confiar no que o item me devolveu.

---

## 6 · O que mudou no `CLAUDE.md`

A §1 passa a declarar as seis classes, e a frase *"o que resta é disciplina"* **saiu** — virou
trava. **Disciplina não é guarda.**

## 7 · O verde

```
VERDE — 7 passos · exit 0 · conferido AQUI, não no GitHub
clones: motor-testfit@6cf6396 · urban-create-hub@72cfab0 · urban-scout-tool@550a438
chão:   Bun 1.4.2
```
