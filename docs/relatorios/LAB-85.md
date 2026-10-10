# LAB-85 · O QUE O GATILHO CARREGA — e a conta que decidia estava na unidade errada

**Prompt:** item **018** da caixa de entrada. · **Rodada:** despertador das 21:05 de 10/10/2026. ·
**Conferido aqui, não no GitHub** (§7).

---

## 1 · O item pediu o número de NOVEMBRO, e novembro desmonta a premissa (D284)

O item foi explícito: *"o 136/136 é medição de outubro… o número que decide é o que acontece a
partir de 1º/11."* Medido na API do Actions, três execuções de dias diferentes:

| execução | evento | `run_duration_ms` | `billable.UBUNTU.total_ms` |
|---|---|---|---|
| `37751994616` | `push` | 9 000 | **0** |
| `37751249491` | `pull_request` | 49 000 | **0** |
| `37713910680` | `push` | 10 000 | **0** |

> **Os "136 minutos, 50 % de tudo" são minutos-TRABALHO CONSUMIDOS, e não dinheiro: o cobrado é
> ZERO.**

`archilly-lab` é público, e `ubuntu-latest` em repositório público é gratuito e não medido. A §7 do
`CLAUDE.md` **já dizia isso** — *"a parte deste repositório no estouro é ZERO, e isso é medição, não
desculpa"* — e a API confirma campo por campo.

**Então a escolha não é de dinheiro**, e o item autorizava parar na fronteira se fosse: em nenhum
dos três caminhos novembro custa um centavo.

> *A unidade em que eu contei o desperdício não era a unidade em que a conta é paga* — e as duas
> frases, a do D221 e a da §7, conviveram dois dias na mesma página sem ninguém notar que se
> contradizem. **Inclusive eu, que escrevi as duas.**

### E o trabalho condenado custa SETE SEGUNDOS

Medido passo a passo em duas execuções: `o verde completo` dura **5 a 7 s**, e a precondição falha
**3 a 4 s** depois do início. Todos os passos seguintes saem `skipped` — **ele nunca clona, nunca
instala, nunca roda a suíte.** O D124 funciona exatamente como desenhado.

---

## 2 · O custo REAL, e ele reconcilia duas frases desta casa que pareciam brigar

**136 de 136 execuções terminaram em `failure`**, sempre no mesmo passo.

> **Um sinal que ficou vermelho 136 de 136 vezes não é um alarme: é ruído de fundo.** O custo dele
> não se paga em minuto — paga-se em quantas vezes alguém aprendeu a ignorar o vermelho.

E isto **concilia o D221 com a §7**: *"um CI vermelho por falta de configuração é honesto"* e *"o
que está errado é agendar um trabalho que só pode falhar"* não brigam — **estão certas sobre coisas
diferentes.** O vermelho por falta de configuração é honesto **uma vez**; repetido 136 vezes sem
nada mudar, deixou de informar.

> *Honestidade de um sinal não é propriedade da primeira vez que ele acende: é propriedade da
> série.*

---

## 3 · A decisão, e os três caminhos com o que cada um PERDE

**O gatilho carrega só o trabalho 1.** No arquivo, no `verde-completo`:
`if: github.event_name == 'workflow_dispatch'`.

| caminho | ganha | perde |
|---|---|---|
| **só o trabalho 1** *(escolhido)* | o vermelho volta a informar: um vermelho novo passa a querer dizer que uma guarda de verdade quebrou | no dia em que o segredo nascer, ninguém é avisado se o verde completo quebrar, até alguém pôr o trabalho de volta — **e é isto que a trava cobra** |
| os dois, com o trabalho 2 condicionado ao **segredo** | volta sozinho no dia em que o segredo nascer | o contexto `secrets` **não existe num `if:` de trabalho**: exigiria um **terceiro** trabalho só para lê-lo, e com o CI desligado eu **não posso demonstrar** que a condição pega |
| os dois como hoje | nada a mexer | o vermelho continua ruído: 136 de 136, sempre o mesmo passo |

**O dinheiro empata nos três (R$ 0), então ele não decide.** O que decidiu foi a coluna que ninguém
tinha escrito — o sinal — e, entre o primeiro e o segundo caminho, uma regra de método:

> **Entre dois consertos, o que eu posso demonstrar nesta máquina vale mais do que o que eu só
> posso afirmar.** Uma condição não testada, num arquivo que ninguém executa, é a forma mais
> silenciosa de desligar um trabalho — e era exatamente disso que o item avisava.

`github.event_name` **está** disponível num `if:` de trabalho, e o efeito dele é conferível por
leitura: o trabalho sai do `push`/`pull_request` e fica no `workflow_dispatch`, que já estava ligado.

### A MARCA e o PRAZO, como o item exigiu

- **a marca:** a caixa de comentário do trabalho 2 **e** a §11 da página do Jonny;
- **o prazo é um EVENTO e não uma data** — no dia em que o segredo existir, a pendência é riscada e
  a condição **tem de sair**. *Prazo que não pode ser uma data ainda pode ser um evento, desde que
  alguém cobre o evento*;
- **o `verde.yml` entrou como o OITAVO lugar** da varredura por lugar: ele passou a ter uma coisa
  parada com condição de volta, e *lugar novo nasce quando algo novo fica parado*;
- **o gatilho NÃO foi religado.** A trava de 1º/11 continua sendo quem cobra.

---

## 4 · E a pendência que o item dizia existir NÃO existia (D285)

O item afirmou de passagem: *"o segredo `VIZINHOS_TOKEN` é dele — **está na sua página de pendências
desde o LAB-38**."*

**Medido: não estava.** `VIZINHOS_TOKEN` aparece em **16 arquivos** da árvore, e
`docs/PENDENCIAS_JONNY.md` **não é um deles** — *"token"* aparece **zero** vezes na página.

**E o LAB-38 pediu, no lugar errado.** A §7 dele diz *"o que fica proposto — e é uma coisa só, do
Jonny"*, e a linha seguinte é a confissão involuntária: *"a receita está no log do próprio workflow,
toda vez que ele falha."* O pedido ficou em **dois lugares que ele nunca lê** — um relatório técnico
e o log de um trabalho de CI — e desde **08/10** esse trabalho **não roda mais**.

**Quarenta e seis prompts** com a única coisa desta decisão que depende de uma pessoa escrita onde
essa pessoa não olha.

> **Pedido que mora só num relatório não chega a quem decide.** É o §1-B numa forma pior: **foi
> para um arquivo, e para o arquivo errado** — e arquivo errado é mais perigoso que nenhum arquivo,
> porque dá a sensação de que o pedido existe.

**E a prova de que dá:** o chat escreveu no item 018 que a pendência estava lá. Ele não inventou —
leu o LAB-38 e concluiu o passo que faltava. *Um pedido no lugar errado não fica só não feito: ele
passa a ser citado como feito.*

Consertado onde devia estar desde 19/09: a **§11** da página do Jonny, para leigo, com os três
passos, a alternativa (tornar os dois vizinhos públicos), a ressalva de segredo em repositório
público e o que **não** para enquanto ele não decidir.

**E a §5 mandou na redação:** a página não pode dizer o nome interno do motor do Parcelamento, e a
trava reprova — então o repositório dele é **descrito** em vez de nomeado. *Regra de nome que vale
mesmo quando atrapalha a instrução é regra; a que cede na primeira inconveniência é sugestão.*

---

## 5 · A trava nova acusou a decisão CORRETA, e foi a oitava da mesma família (D286)

A trava tem de garantir que o **trabalho 1 nunca** seja condicionado. A primeira versão procurava a
palavra `if:` entre o nome de um trabalho e o do outro — e **reprovou a decisão correta**, porque a
caixa de comentário que explica a condição diz *"o `if:` abaixo é essa decisão"*.

**Oitava da família do D142 / D155 / D257** — e a primeira **no mesmo dia** em que eu a escrevi como
decisão (D282, de poucas horas antes).

> **A pergunta decide o instrumento.** *"Este trabalho tem condição?"* é de **estrutura**, e o
> `Bun.YAML` responde pela chave; *"a condição está explicada?"* é de **texto**, e aí o comentário é
> o objeto e não o ruído. A mesma régua fazendo as duas erra uma.

**E há trava para a lição**, que de outro modo viraria comentário: uma trava afirma que o trecho
entre os dois nomes **contém** `if:` — isto é, que a régua de texto *estava* errada — e que a de
estrutura, na mesma pergunta, diz a verdade.

### A irmã dela, na mesma rodada: classe negada não é fronteira

A régua que lê se a pendência foi **resolvida** nasceu como `~~[^~]*VIZINHOS_TOKEN[^~]*~~` sobre a
página inteira, e **leu a página de hoje como resolvida** — com a pendência aberta. O `[^~]` não
para em fim de linha nem de seção: emendou um `~~` da §10 com outro da lista de resolvidos, com a
§11 no meio.

> **Classe negada não é fronteira.** `[^~]` diz *"qualquer coisa que não seja til"*, e parágrafos,
> seções e o arquivo inteiro cabem nisso.

Consertada linha a linha, e **com a régua velha exercida na trava**: ela tem de **achar** o falso
positivo, e a nova tem de **não** achar. *Conserto de régua sem a régua velha ao lado não prova que
havia defeito.*

### E a janela da marca saiu de uma âncora

A conferência da marca lia `slice(i - 1800, i + 200)` — **dependia do tamanho da caixa de
comentário**, e cresceria para mentira na primeira linha nova. Passou a sair de uma âncora declarada
no arquivo. *Janela medida em caracteres é coincidência com prazo de validade* — a doença do D264 e
do D278, agora num `slice`.

---

## 6 · Entrega

- **prova:** [`docs/provas/LAB-85/o-que-o-gatilho-carrega.json`](../provas/LAB-85/o-que-o-gatilho-carrega.json)
  — com o **id de cada execução e o nome de cada campo** da API, para qualquer um reconferir;
- **decisões:** **D284** (a unidade errada, os três caminhos, a decisão com marca e prazo), **D285**
  (o pedido no lugar errado por 46 prompts) e **D286** (a pergunta decide o instrumento);
- **o gatilho NÃO foi religado**, e nada em repositório vizinho;
- **a página do Jonny ganhou a §11**, que é o único desbloqueio de verdade desta rodada;
- **verde:** o comando único, **conferido aqui, não no GitHub**.
