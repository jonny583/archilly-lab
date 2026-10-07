# LAB-56 · A moldura do D159 corrigida — e ela saía de um GERADOR

**07/10/2026** · prompt da fila de 07/10, o quarto. Saiu da minha lista de *"proposto ao
chat"*, escrita no LAB-48 (D168), e é **entrega**, não diagnóstico: o diagnóstico já estava
feito.

---

## 0 · O que estava errado, e o que continua certo

Eu publiquei, no D159:

> ~~*"O mesmo lote é 'de frente para a rua existente' por uma régua e 'sem frente para rua'
> pela outra — e as duas estão certas sobre o que medem."*~~

**Não são duas réguas.** Lido o `invariantes.ts` do Generate (D168), a régua dele
**concorda** com o motor: ela aceita, por extenso, *"a RUA PÚBLICA, quando existe"* como
superfície de frente; o campo existe (`resultado.faixaViaPublica`), o invariante o usa, e há
até bandeira por lote (`deLoteamentoFachada`) que troca o mínimo de testada.

> **Há UMA régua e UM campo que falta** — o contrato de motor v1 não tem onde um motor
> declare a rua pública existente, então o tradutor do próprio Generate não tem o que
> traduzir.

**A metade que estava certa continua certa:** o contrato não tem como dizer, e os lotes são
contados como violação. **E a correção tem limite, medido no LAB-54:** em `geo-antonina`, das
29 acusadas, **11 somem** com o campo preenchido e **18 NÃO** — essas 18 estão a **15,7 a
1 805,7 m** da face entregue e são do motor. *Dizer "é só o campo que falta" seria trocar um
erro por outro.*

---

## 1 · Eram CINCO lugares e um GERADOR, não três

O chat pediu *"a correção da moldura nos três lugares onde ela saiu"*. **Contados, são cinco
documentos vivos — e a raiz é uma máquina.**

| onde | o que é | como foi corrigido |
|---|---|---|
| `esteira/src/motores/testfit.ts` | **o GERADOR** da nota | a nota reescrita; a frase antiga fica **no comentário**, com a história |
| `docs/COMPARACAO_DOS_MOTORES.md` (3×) | **gerado** por `bun run lab20` | regerado |
| `docs/provas/LAB-19/tabela.json` | **gerado** por `bun run lab19` | regerado |
| `docs/relatorios/LAB-45.md` | o relatório que a publicou | **riscado**, com a causa certa e o limite |
| `docs/PENDENCIAS_JONNY.md` item 7 | a página do Jonny, **para leigo** | **riscado**, reescrito sem jargão |
| `docs/ONDE_PARAMOS.md` | a seção do LAB-45 | **riscado**, com a causa certa |
| `docs/DECISOES.md` · D159 | a decisão | **título riscado**, decisão mantida (D90) |
| `docs/INDEX.md` | a linha de índice do LAB-45 | **riscado** na própria linha |

**E o achado do prompt é o gerador.** A frase saía de `naoSoubeFazer` em
`src/motores/testfit.ts` e dali ia para a página comparativa **três vezes** e para a prova do
LAB-19. **Corrigir os documentos e deixar o gerador faria a frase voltar sozinha na próxima
`bun run lab19`** — é a forma do D104 com uma máquina atrás, e nenhuma varredura de documento
teria avisado, porque no instante seguinte à regeração o documento estaria "correto" de novo
por um ciclo.

> **Moldura que sai de gerador não se corrige no documento: corrige-se no gerador, e os
> documentos se regeram.**

### Dois lugares NÃO foram tocados, e isso é decisão

- **`docs/relatorios/RECADOS.md`** — é o arquivo do que **saiu** para o chat, em ordem
  cronológica. **Reescrever um recado entregue seria falsificar o registro.** A correção mora
  nos documentos vivos; o recado de 04/10 continua dizendo o que eu disse naquele dia;
- **`docs/relatorios/LAB-48.md`** — é o relatório que **achou** o erro. Ele cita a frase para
  corrigi-la, e a citação é o objeto dele.

As duas estão numa **lista fechada de exceções**, cada uma com o motivo, e a guarda reprova
exceção que **deixou de precisar** ser exceção.

---

## 2 · A página do Jonny, reescrita sem jargão

A §5 manda: `PENDENCIAS_JONNY.md` é **para leigo**, *"Testfit"* lá se chama **Laboratório de
Parcelamento**, e item resolvido é **marcado, nunca apagado**. O item 7 agora diz, em
português de arquiteto:

> **O que falta é uma LINHA NA FICHA que os dois programas usam para conversar.** Hoje o
> Laboratório de Parcelamento **não tem onde escrever** *"aqui fora tem uma rua"*, então o
> conferidor não recebe o aviso e conta o lote como se não houvesse rua nenhuma. É falta de
> um campo, não briga de critério.

E com o limite, porque sem ele a correção engana na direção oposta: **11 dos 29** passariam a
ser aceitos; **os outros 18** estão de 15 metros a 1,8 km da rua, e aí o problema é do
desenho. O item 7 já trazia uma correção riscada (o 33 × 14 do D161) — **agora são duas,
empilhadas, e as duas à vista.**

---

## 3 · A guarda, e ela tem DUAS metades porque apagar não é corrigir

`external-engines/esteira/tests/moldura.test.ts`, **18 travas**:

1. **a frase não é AFIRMADA** em nenhum dos cinco documentos vivos, nem na página gerada, nem
   na prova, nem no **código** do gerador (`soOCodigo()`, que esvazia string e comentário);
2. **mas ela continua escrita, riscada**, nos cinco — e cada um tem de dizer **a causa
   certa**. Sem esta metade, a trava passaria com a história **apagada**, que é o oposto do
   que o D161 decidiu. *Correção sem causa é só um corte;*
3. **onde o número 29 aparece, o limite aparece junto** (11 somem, 18 não) — senão a correção
   vira o erro simétrico;
4. **o comentário do gerador TEM de continuar guardando a frase** — é o D177 ao contrário: o
   texto que fala *sobre* o erro não é o erro;
5. e a limpeza `semRiscadoNemCitado()` é medida em **texto sintético**: riscado de uma linha,
   riscado de várias linhas com `>` no meio, e citação nas três formas.

### A trava reprovou a MINHA PRÓPRIA CORREÇÃO (D192)

A primeira versão casava dois padrões: `por uma régua` **e** `duas réguas discord`. Ela ficou
**vermelha no `DECISOES.md`**, e o que ela acusou foi a frase que eu acabara de escrever para
consertar:

> *"**Não são** duas réguas discordando: é UMA régua e UM campo que falta."*

> **Régua que casa uma frase não distingue "X" de "não X".**

É a **sexta** vez da família do D137/D142/D155/D177/D179, e a terceira em que o defeito é a
régua reprovando o conserto que a motivou. **A correção não foi afrouxar:** foi casar **só a
forma que de fato saiu** — `por uma régua`, que não aparece em negação nenhuma — e cobrar a
causa certa por uma trava **positiva**. O buraco fica declarado: quem reescrever a moldura
errada com outras palavras escapa da varredura, e a trava positiva é o que cobre o caso que
importa.

### E mais TRÊS defeitos da trava, todos de ESCOPO (D193)

A trava passou por **três** sabotagens antes de morder, e nenhuma das falhas era do texto
medido — **eram da minha régua**:

| a falha | o que a revelou | a lição |
|---|---|---|
| usei **`soOCodigo()`**, que esvazia o conteúdo das strings | sabotei o gerador para escrever a frase **dentro da string** e a trava **PASSOU** | a nota **é** uma string: a pergunta é *"o texto DECLARA isto?"* ⇒ **`semComentarios()`** |
| procurei os números **no arquivo todo** | o `INDEX.md` tem dezenas de linhas com `11` e `18` em outros assuntos | *o volume era da minha régua, não da coisa* (D179) |
| troquei por janela de **25 linhas** | o `INDEX.md` é tabela de **uma linha por relatório** | a janela é a **unidade semântica**: parágrafo, ou a linha se for tabela |

**A primeira é a mais instrutiva, e a lição tinha um prompt de idade.** O D179 separou as
duas limpezas e escreveu para que serve cada uma — e eu peguei a errada no prompt seguinte.
*Ter as duas ferramentas não basta: a pergunta decide qual delas.*

**As cinco sabotagens, e o estado final:**

| sabotagem | antes | agora |
|---|---|---|
| 1 · o gerador volta a escrever a frase na string | **PASSOU** 🔴 | reprova |
| 2 · o comentário do gerador apaga a história | reprova | reprova |
| 3 · o `LAB-45` apaga o parágrafo em vez de riscar | reprova | reprova |
| 4 · o `INDEX` mantém as 29 e tira o 11 e o 18 | **PASSOU DUAS VEZES** 🔴 | reprova, com a janela medida em **1 linha** |
| 5 · o `PENDENCIAS` risca sem dizer a causa | reprova | reprova |

**E uma QUARTA vez do D177, no fim:** escrito o texto do D192 — que **lista entre crases os
padrões que a régua casava** —, a trava reprovou o `DECISOES.md`, lendo **o nome do próprio
padrão dela** como afirmação. Em Markdown há **três** formas de mostrar sem afirmar: o
riscado, a citação e o **literal entre crases**. As três saem na limpeza agora, cada uma com
o motivo, e há unidade sintética para cada forma.

### E a guarda da exceção fantasma mordeu no mesmo prompt

Ao estreitar o padrão, o `LAB-54.md` **deixou de ser acusado** — ele fala de **outras** duas
réguas (a minha e o `_testadaDoLote`, que ali de fato discordam num lote). A trava da exceção
fantasma o **expulsou da lista** no mesmo instante. *É a guarda do LAB-36 mordendo dentro do
prompt que a escreveu* — e é o tipo de coisa que uma lista escrita à mão esconderia por
semanas.

---

## 4 · O que NÃO mudou, e vale dizer

**Nenhum número mudou.** As 92 violações seguem 92, a atribuição segue a do LAB-55 (81 do
motor, 11 do contrato, zero não atribuídas), e a tabela comparativa saiu com **os mesmos
números** — só a nota ao pé mudou de texto. Este prompt é **moldura**, não medição: corrige
como o número é lido, não o número.

**Nada foi escrito no vizinho.** Os três clones foram conferidos ao fim da rodada e estão
limpos (§4): `motor-testfit` em `4181e95`, `urban-create-hub-41d93a4d` em `5b7e9b4`,
`urban-scout-tool` em `f38dc0c`, `git status` vazio nos três.

**Para o Generate, o item segue vivo e sem mudança** (já numerado no LAB-53 e no LAB-54): o
contrato de motor v1 precisa de campo onde um motor declare a **rua pública existente** —
sem ele, o `faixaViaPublica` do Validator fica vazio e 11 lotes de Antonina são acusados por
um aviso que ninguém tem onde dar.

---

## 5 · Entrega

| o quê | onde |
|---|---|
| o gerador corrigido | [`src/motores/testfit.ts`](../../external-engines/esteira/src/motores/testfit.ts) |
| as travas (17) | [`tests/moldura.test.ts`](../../external-engines/esteira/tests/moldura.test.ts) |
| os cinco documentos | `LAB-45.md` · `PENDENCIAS_JONNY.md` · `ONDE_PARAMOS.md` · `DECISOES.md` (D159) · `INDEX.md` |
| os dois gerados | [`COMPARACAO_DOS_MOTORES.md`](../COMPARACAO_DOS_MOTORES.md) · [`provas/LAB-19/tabela.json`](../provas/LAB-19/tabela.json) |

**Este prompt não tem prova nova em `docs/provas/`, de propósito:** ele não mede gleba
nenhuma — ele corrige texto e regera dois arquivos que já existem. Inventar um JSON para ter
um JSON seria o contrário do §7, e é o mesmo caso declarado do LAB-51.

A suíte vai de **476 para 494 travas**; o CI sem clones **continua em 114** (a trava nova lê
arquivos do próprio repositório, mas importa o `soOCodigo()` de `src/`, e o arquivo de teste
fica fora daquele trabalho por coerência com os demais do LAB-54/LAB-55).

## 6 · As decisões

- **D191** — **moldura que sai de gerador não se corrige no documento: corrige-se no gerador,
  e os documentos se regeram.** A frase do D159 saía de `naoSoubeFazer` em
  `src/motores/testfit.ts` e ia para a página comparativa **três vezes** e para a prova do
  LAB-19. Eram **cinco** documentos vivos e **um gerador**, não os três que eu havia contado
  — *contar a lista, não a memória* (D185), aplicado no prompt seguinte ao que criou a regra.
  **E a correção é riscada, não apagada, em todos os cinco** (D161), com a causa certa e com
  o **limite** medido (11 somem, 18 não), porque *"é só o campo que falta"* é o erro
  simétrico. Duas exceções declaradas: o `RECADOS.md`, que é o arquivo do que **saiu** e não
  se reescreve, e o `LAB-48.md`, que é o relatório que achou o erro;
- **D192** — **régua que casa uma frase não distingue "X" de "não X".** A trava desta
  correção casava `duas réguas discord` e ficou vermelha na **minha própria frase de
  conserto** (*"não são duas réguas discordando"*). Sexta vez da família do
  D137/D142/D155/D177/D179. A correção foi **casar só a forma que de fato saiu** e cobrar a
  causa certa por uma trava **positiva** — e a guarda da exceção fantasma, no mesmo instante,
  **expulsou o `LAB-54.md` da lista** por ter deixado de precisar ser exceção. *Varredura de
  texto que precisa entender negação não é varredura: é interpretação, e essa não cabe num
  regex.*
