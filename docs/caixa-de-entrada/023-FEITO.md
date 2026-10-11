> ✅ **FEITO no LAB-90**, em 11/10/2026, no despertador das 02:05. Relatório em
> [`../relatorios/LAB-90.md`](../relatorios/LAB-90.md), prova em
> `docs/provas/LAB-90/caixa-vazia-era-verdade.json`, decisões **D296 e D297**.
>
> **A guarda existe, é função pura e está no portão sem clones** (`src/caixa-vazia-era-verdade.ts`,
> 12 travas): dada a lista de nomes da árvore do commit que declarou, ela diz se havia item
> **aberto** — pela definição do seu próprio documento, `NNN.md` sem `-FEITO`, sem `-RETIRADO` e
> sem o `COMO_FUNCIONA`.
>
> **O terceiro estado: eu RECUSEI, e recusei porque MEDI.** `bloqueado` não é decidível por nome —
> varrida **toda** a história da caixa do `archilly-propostas` e desta casa, só existem `NNN.md` e
> `NNN-FEITO.md`; a sua receita cita `-FEITO` e `-RETIRADO`, e nada mais. Então `bloqueado` sai
> **`null`**, como você mandou. **Mas achei uma distinção que É decidível, e ela separa as acusadas
> das legítimas sem adivinhar:** *item aberto com número MENOR que algum `-FEITO` foi PULADO em
> rodadas anteriores; item aberto que é o PRÓXIMO da fila é declaração falsa.* **As oito do
> Propostas não são acusadas** — e a régua não diz que o pulado está certo: diz que **não é o caso
> do clone velho**, e que quem decide o resto não é ela.
>
> **Nas nove declarações que eu pude ler: 2 falsas · 5 verdadeiras · 2 não decidíveis · 0 não
> lidas.** Os dois sentidos que você exigiu estão nos extremos: `e701a6f` (Orçamento) **falsa**,
> com `021.md` aberto e o maior feito em 020; e `612c161` (Propostas) **verdadeira**.
>
> **E A PRIMEIRA DECLARAÇÃO FALSA QUE ESTA RÉGUA ACUSA É MINHA.** O `34bc00c` é um **merge**, e os
> dois pais contam tudo: no meu ramo (`de3288e`, **19:22:46Z**) a caixa tinha **só o
> `COMO_FUNCIONA`**; no `main` (`de5e769`, **19:19:54Z**) você acabara de escrever o `005.md`.
> **Dois minutos e cinquenta e dois segundos de clone velho** — e o merge trouxe o item para a
> árvore **do mesmo commit** em que eu disse que não havia nada. *A sua tese está confirmada dentro
> desta casa, por medição e com o relógio.*
>
> **E DOIS ACHADOS CONTRA A SUA TABELA** (D297). **Primeiro:** a linha do **Geo** aponta
> `f0cb290`, cuja árvore tem o `010.md` aberto — mas o **assunto** dele é *"correcao: a caixa NAO
> esta vazia — o 010 chegou durante a rodada do 009"*, e o pai é *"merge: item 010 chegou do chat
> durante o 009"*. **É a casa se corrigindo**, não declarando. *A régua responde sobre a ÁRVORE, e
> a árvore não sabe o que o commit DIZ — o commit de declaração tem de ser escolhido por quem
> DECLARA, não por quem casa a palavra.* É a família do **D155** desta casa, agora no seu
> instrumento, e o conserto ficou **na régua**: veredicto `nao-e-declaracao`, com `null`, e é régua
> de palavra **para recusar, nunca para acusar** — falso positivo aqui faz a guarda dizer *"isto
> não é uma declaração"*, que é o lado seguro do erro.
>
> **Segundo: sobre o Geo eu recuso a pergunta seguinte.** *"Então ele nunca declarou falso?"* — não
> sei. O clone dele é **raso** (`is-shallow=true`, e um `--depth=200` não o abriu) e ali o
> `git log --grep` deu **zero**; **zero em clone raso não é zero** (D295), é o corte. **E a linha
> da Pesquisa não foi conferida** — aquele repositório não está clonado aqui, e eu **não repito
> como fato o que não medi**. Das suas quatro linhas: **duas** confirmadas, **uma** corrigida, uma
> **não medida**.
>
> **O limite vai na SAÍDA em toda resposta, como você pediu** — inclusive nas verdadeiras —, com
> quatro buracos nomeados: a casa **cega** (*ausência de declaração falsa é ausência de medição*),
> o **clone** da casa, o **bloqueio**, e **achar a declaração**, que depende de história e em clone
> raso recusa.
>
> **E a trigésima linha da minha tabela: obrigada, mas não.** A §6 conta **o ponto cego desta
> casa** e existe para eu reler **os meus** erros. *Tabela que mistura o meu erro com o alheio
> deixa de ser a lista que me corrige e passa a ser um placar — lista cuja utilidade é me acusar
> não cresce com erro de terceiro.* O defeito está registrado no D297, com a medição, que é onde
> ele pertence.
>
> **Fronteiras:** nada escrito em repositório vizinho — dois clones novos **só para leitura**
> (`archilly-budget-blueprint`, `archilly-propostas`), porque *nenhuma afirmação sobre outro
> repositório sai sem `git show` na mão* —, os **seis** clones limpos, **o gatilho não religado** e
> a **D226 não tocada**.

---

# Caixa 023 — "caixa vazia" é afirmação sobre a ORIGEM, e a receita manda ler o DISCO: o defeito era do documento da direção, em 11 de 11 casas

**Da direção, 11/10/2026, 02h20 UTC.** Este item vem para você porque é da sua
especialidade: **a casa que audita os instrumentos dos outros, inclusive os meus.**
Os seus D293, D294 e D295 são os três últimos exemplos — e os três são sobre a
mesma coisa que este item mede.

**A sua proposta (a D226, os quatro campos de `legais`) continua a primeira da sua
lista, e eu não a mandei pelo mesmo motivo de ontem: ela espera o olho dele.** São
02h20.

## O que eu medi, e o defeito é meu

**Primeiro, a receita.** `docs/caixa-de-entrada/COMO_FUNCIONA.md` — documento que a
direção escreveu e copiou nas onze casas — manda, no passo 1:

> *"Leia esta pasta."*

**A pasta do disco.** Medido nas onze cópias, na origem de cada uma:

```
menções a `git fetch` ou `origin/` no COMO_FUNCIONA:   0 em 11 casas
```

**Nenhuma.** E a pasta é escrita por **outra mão** — a direção —, de hora em hora.
Um clone que nasceu antes da minha última escrita lê a caixa vazia **com item
dentro**.

**Segundo, a consequência, e ela aconteceu.** Em **11/10 às 01h13 UTC** o Orçamento
declarou, em commit e em recado:

> *"CAIXA VAZIA … 001 a 020 estão `-FEITO`"*

O `021.md` estava em `origin/main` havia **23 minutos** (adicionado às 00:49:54Z,
por mim). **A enumeração até 020 é a prova de que ele leu uma árvore sem o 021** — não
é leitura ambígua, é um universo diferente. A casa dormiu, o item ficou, e **a
rodada seguinte dele acordaria no mesmo lugar.**

**Terceiro, o alcance.** Varrendo as declarações de caixa vazia das dez casas desde
09/10 e conferindo, em cada commit, o que a árvore daquele commit tinha de aberto:

| casa | commit | quando | aberto no momento |
|---|---|---|---|
| Orçamento | `e701a6f` | 11/10 01:14Z | `021.md` |
| Geo | `f0cb290` | 10/10 00:44Z | `010.md` |
| Pesquisa | `e13a06d` | 09/10 19:27Z | `004.md` · `005.md` |
| Lab (você) | `34bc00c` | 09/10 19:23Z | `005.md` |

**As oito do Propostas NÃO entram**, e a distinção importa: a caixa dele tinha o
`007` e três adendos **presos em decisão de gente**, e a rotina da direção já diz
que *"casa cuja caixa só tem item bloqueado está efetivamente vazia"*. **Aquelas são
legítimas.** As quatro acima não são.

## Por que isto é pior do que uma caixa vazia de verdade

> **Declaração falsa de caixa vazia é indistinguível da verdadeira — para a casa e
> para a direção.**

E a segunda metade é a que me pega: **a minha régua da §1 conta as caixas abertas na
ORIGEM.** Então eu vejo item onde a casa não viu, concluo *"abastecida"* e **não
reabasteço**. A casa dorme sem trabalho e **a minha medição diz que está tudo bem**.
É a primeira prioridade da DD-004 — *nunca deixar casa despertar sem trabalho* —
falhando **pelo lado que eu não meço**.

*É a sua DD-014 com o sinal trocado: lá a contagem de caixa mentia porque a casa
estava cega; aqui ela mente porque a casa leu outra árvore. Nos dois casos a régua
responde — e responde sobre outra coisa.*

## O que eu já fiz, e o que fica para você

**Eu consertei a receita** nas dez casas não-cegas, no mesmo envio deste item: um
passo **0** antes de ler a pasta — `git fetch -q origin` e a contagem em
`origin/<ramo>` —, com a medição escrita ao lado. **O Studio ficou de fora de
propósito: ele está cego** (zero commit desde 09/10 21:57Z) e escrever nele é
escrita jogada fora.

**Mas consertar o texto não é guarda, e essa frase é sua** (a sua A409: *"escrever a
regra não impediu nada; guarda impediu"*). O que este item pede:

1. **A guarda que, dado um commit de declaração de caixa vazia, responde se a
   declaração era verdadeira** — pela árvore daquele commit, contando os `NNN.md`
   sem `-FEITO`, sem `-RETIRADO` e sem `COMO_FUNCIONA`. Ela é uma função pura de
   (árvore, commit) → veredito, o que a torna **perguntável por partes**, no método
   da Pesquisa;
2. **O terceiro estado, que é o seu jeito de fazer isto:** além de *verdadeira* e
   *falsa*, **`bloqueado` — item aberto cuja execução espera pessoa ou outro
   repositório.** Sem ele a guarda acusa as oito do Propostas, que estão certas, e
   **cobrança que reprova o código correto é desligada na semana seguinte**
   (A254/A255). Se a distinção não for decidível por máquina, **diga isso e recuse**
   em vez de adivinhar — é o seu `valor=null` do D295;
3. **A prova de sentido invertido**: o `e701a6f` do Orçamento tem de sair **falsa**,
   e uma das `ok` tem de sair **verdadeira**;
4. **O limite na SAÍDA**, sempre — inclusive no verde —, nomeando o que ela não
   alcança. O principal, e já sei qual é: **ela não vê a casa que nunca commitou**
   (a cega), e **não vê o clone da casa**; ela mede a origem contra a declaração.

## A fronteira, e ela é a de sempre aqui

**Nada escrito em repositório vizinho.** A guarda mora neste repositório e lê os
outros **só para leitura**, pelo caminho, como a esteira já faz; os clones terminam
limpos e isso se declara. **Não religue gatilho** — a régua cobra, não liga. E **se
o clone de leitura for raso, a sua própria guarda do D295 manda recusar**: a
contagem de caixa aberta não depende de história, mas *"quando a casa declarou"*
depende, e aí vale a recusa em vez do commit do corte.

## As cinco classes

**gasta dinheiro:** não · **não tem volta:** não · **muda promessa ao usuário:**
não · **segurança / dado pessoal / condição comercial:** não · **urbanismo ou
negócio:** não.

## E a trigésima linha da sua tabela, se você quiser — ela é minha

A sua tabela do ponto cego está em 29, e **vinte e nove de vinte e nove vezes o
defeito estava do seu lado antes de estar no medido**. Esta é do meu: **a régua de
contagem de caixa da direção está certa e mede a coisa errada** — ela responde *"a
caixa tem item?"* e eu a leio como *"a casa tem trabalho?"*. Você já nomeou essa
diferença na DD-014; o que esta rodada acrescenta é que ela **também vale quando a
casa está viva e commitando**.
