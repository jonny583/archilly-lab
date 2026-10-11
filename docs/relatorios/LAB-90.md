# LAB-90 · "Caixa vazia" era verdade? — a guarda, e a primeira que ela acusa é minha

**Prompt:** item **023** da caixa de entrada. · **Rodada:** despertador das 02:05 de 11/10/2026. ·
**Conferido aqui, não no GitHub** (§7).

---

## 1 · O item é um defeito da direção, e ela o mediu contra si

O `COMO_FUNCIONA.md` — documento que a direção escreveu e copiou nas **onze** casas — mandava, no
passo 1, *"leia esta pasta"*: **o disco**. E a pasta é escrita por **outra mão**, de hora em hora.

> *Um clone que nasceu antes da última escrita lê a caixa vazia **com item dentro**.*

Ela consertou a receita nas dez casas não-cegas e pediu **a guarda**, citando a A409 desta casa:
*"consertar o texto não é guarda"*.

---

## 2 · A régua, e ela é função pura (D296)

`src/caixa-vazia-era-verdade.ts`: dada a **lista de nomes** de `docs/caixa-de-entrada/` na árvore
do commit que declarou, responde se havia item **aberto** — `NNN.md` sem `-FEITO`, sem
`-RETIRADO` e sem o `COMO_FUNCIONA`, **que é a definição do próprio documento da direção**.

### O terceiro estado: eu recusei, e recusei porque MEDI

O item pediu `bloqueado` e avisou: *"se a distinção não for decidível por máquina, diga isso e
recuse em vez de adivinhar."* **Medido, não é decidível:**

| onde | o que existe no NOME |
|---|---|
| `archilly-propostas`, **toda** a história da caixa | só `NNN.md` e `NNN-FEITO.md` |
| `archilly-lab` (aqui) | só `NNN.md` e `NNN-FEITO.md` |
| a receita da direção | `-FEITO` e `-RETIRADO`, e nada mais |

Então `bloqueado` sai **`null`**. **Mas há uma distinção que É decidível**, e ela separa as
acusadas das legítimas sem adivinhar nada:

> **Item aberto com número MENOR que algum `-FEITO` foi PULADO** — a casa já passou por ele. **Item
> aberto que é o PRÓXIMO da fila é declaração falsa.**

### O que a régua respondeu, nas nove declarações que eu pude ler

| casa | commit | abertos | maior `-FEITO` | veredicto |
|---|---|---|---|---|
| Orçamento | `e701a6f` | `021.md` | 020 | **✗ falsa** |
| este Lab | `34bc00c` | `005.md` | 004 | **✗ falsa — e é minha** |
| Geo | `f0cb290` | `010.md` | — | `null` · **não é declaração** (§4) |
| Propostas | `bd84f13` | `007.md` + 3 adendos | 013 | `null` · já pulada, **não acusa** |
| Propostas | `612c161` | nenhum | 015 | ✓ verdadeira |
| este Lab | `2bc543f` · `1e7df13` · `8e8b74b` · `8236799` | nenhum | — | ✓ verdadeiras |

**2 falsas · 5 verdadeiras · 2 não decidíveis · 0 não lidas.** Os dois sentidos que o item exigiu
estão nos extremos da tabela: o `e701a6f` **falsa**, e uma `ok` **verdadeira**.

---

## 3 · A primeira declaração falsa que esta régua acusa é MINHA

`34bc00c` ("despertador-sem-item: a caixa esgotou") é um **merge**, e os dois pais contam tudo:

| pai | quando | a caixa aberta ali |
|---|---|---|
| o meu ramo, `de3288e` | **09/10 19:22:46Z** | **nenhum item** — só o `COMO_FUNCIONA` |
| o `main`, `de5e769` | **09/10 19:19:54Z** | **`005.md`**, escrito pela direção |

**Dois minutos e cinquenta e dois segundos.** Eu declarei a caixa vazia com o clone **velho por
2m52s**, e o merge trouxe o item para a árvore **do mesmo commit** em que eu disse que não havia
nada.

> **A tese da direção está confirmada DENTRO desta casa, por medição e com o relógio.** *O disco
> não é a origem, e esta pasta é escrita por uma mão que não é a minha.*

---

## 4 · Dois achados contra o instrumento de quem me mandou o item (D297)

### A linha do Geo aponta o commit em que a casa ACERTOU

A árvore de `f0cb290` tem o `010.md` aberto — mas o **assunto** dele é *"correcao: a caixa NAO esta
vazia — o 010 chegou durante a rodada do 009"*, e o pai é *"merge: item 010 chegou do chat durante
o 009"*. **É a casa se corrigindo.**

> **A régua responde sobre a ÁRVORE, e a árvore não sabe o que o commit DIZ.** *O commit de
> declaração tem de ser escolhido por quem DECLARA, não por quem casa a palavra* — a família do
> **D155**, agora no instrumento da direção.

O conserto ficou **na régua**: `oAssuntoNegaACaixaVazia` → veredicto `nao-e-declaracao`, `null`. E
ela é régua de palavra **para recusar, nunca para acusar** — *falso positivo aqui faz a guarda
dizer "isto não é uma declaração", que é o lado seguro do erro* —, com os dois sentidos travados.

### E sobre o Geo eu RECUSO a pergunta seguinte

*"Então o Geo nunca declarou falso?"* — **não sei.** O clone dele é **raso** (`is-shallow=true`, e
`--depth=200` não o abriu), e ali o `git log --grep` deu **zero**. **Zero em clone raso não é
zero** (D295): é o corte. **E a linha da Pesquisa não foi conferida** — aquele repositório não está
clonado aqui, e *não repito como fato o que não medi.* Das quatro linhas: **duas** confirmadas,
**uma** corrigida, **uma** não medida.

### A trigésima linha da minha tabela: não

A direção ofereceu a linha. **Recusei**, e o motivo é o que a tabela é: ela conta **o ponto cego
desta casa**, e existe para eu reler **os meus** erros. *Tabela que mistura o meu erro com o alheio
deixa de ser a lista que me corrige e passa a ser um placar.* **Lista cuja utilidade é me acusar
não cresce com erro de terceiro** — o defeito dela está registrado no D297, com a medição.

---

## 5 · O limite vai na SAÍDA, em toda resposta

O item pediu com estas palavras: *"o limite na SAÍDA, sempre — inclusive no verde."*
`O_QUE_ISTO_NAO_ALCANCA` viaja em **todas** as leituras, com quatro buracos nomeados:

1. **não vê a casa CEGA** — sem commit não há árvore, e *ausência de declaração falsa é ausência de
   medição*;
2. **não vê o CLONE da casa**, só a origem — e é justamente o clone velho que causa o defeito;
3. **não decide BLOQUEIO** — sai `null`;
4. **não acha a declaração** — isso depende de história, e em clone raso **recusa** (D295).

---

## 6 · Entrega

- **prova:** [`docs/provas/LAB-90/caixa-vazia-era-verdade.json`](../provas/LAB-90/caixa-vazia-era-verdade.json)
  — as nove declarações, casa por casa, com veredicto, abertos, maior feito e o limite. Na **lista
  de exceções do §7**, com o motivo;
- **decisões:** **D296** (a guarda e a recusa) e **D297** (a correção da tabela da direção e a
  recusa da trigésima linha);
- **o portão sem clones:** 36 → **37 arquivos**, 592 → **604 travas**;
- **nada escrito em repositório vizinho.** Dois clones novos **só para leitura**
  (`archilly-budget-blueprint` e `archilly-propostas`), porque *nenhuma afirmação sobre outro
  repositório sai sem `git show` na mão*; os **seis** clones terminaram limpos — `motor-testfit`
  `6cf6396`, `urban-create-hub-41d93a4d` `72cfab0`, `urban-scout-tool` `550a438`,
  `archilly-central` `944c232`, `archilly-budget-blueprint` `ef067a8`, `archilly-propostas` `7cbe192`;
- **o gatilho NÃO foi religado**, **a D226 não foi tocada**, e **verde:** o comando único,
  **conferido aqui, não no GitHub**.
