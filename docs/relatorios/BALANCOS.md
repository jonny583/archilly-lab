# BALANÇOS DO ARCHILLY LAB

**O que é um balanço, aqui:** uma resposta que **faz as contas** — de uma fila que
acabou, de um conjunto de dívidas, do estado do repositório. Não é relatório de prompt
(esses vivem um por arquivo em `docs/relatorios/`) e não é recado de entrega (esses vivem
em [`RECADOS.md`](RECADOS.md), em ordem).

---

## Por que este arquivo existe

**Criado no LAB-42, por ordem do chat:** *"crie `docs/relatorios/BALANCOS.md` e registre
ali os balanços, inclusive os que foram só para o chat, para nenhuma lista precisar ser
re-derivada de novo."*

**O pedido nasceu de um prejuízo medido.** Em 03/10/2026 o chat pediu, **fora da fila**,
um balanço do que estava mal resolvido. A resposta foi para o chat e **não para um
arquivo**. No dia seguinte o chat mandou executar um item dela — *"as quatro regras sem
teste que você listou viram guarda ou saem do documento"* — e o primeiro achado do LAB-36
foi sobre o próprio pedido:

> **A lista não existia em lugar nenhum.** Custou uma varredura inteira do `CLAUDE.md`,
> regra por regra, para recuperar cinco linhas. E ao recuperá-las elas eram **cinco, não
> quatro — e duas estavam falsas** (D136, D137).

**A lição, e ela é a mesma do `RECADOS.md` aplicada ao que respondo fora da fila:**

> **O que vai ao chat e não vai a um arquivo não existe amanhã.**

E a segunda lição, que o LAB-36 acrescentou e que é a razão de este arquivo registrar
**também o que o balanço errou**: balanço recuperado **se confere, não se obedece**. O de
03/10 dizia "quatro regras"; eram cinco, e duas eram slogan.

---

## Como este arquivo funciona

- **Ordem cronológica**, o mais antigo primeiro, como o `RECADOS.md`.
- Cada balanço traz: **data**, **origem** (pedido pelo chat, fim de fila, ou minha
  iniciativa), **o que ele continha**, **o que ele produziu** e **onde está a prova**.
- **Balanço que foi só para o chat é transcrito ou reconstruído aqui** — e quando é
  reconstrução, **isso vai dito**, com a fonte de cada linha. Reconstrução sem a etiqueta
  de reconstrução é invenção com cara de registro.
- **Balanço que já mora num recado não é copiado**: entra no índice do §2, com a data e o
  título da seção do `RECADOS.md` que o carrega. Copiar criaria a segunda montagem que o
  D116 proíbe.
- **Há guarda** (`esteira/tests/balancos.test.ts`): toda entrada precisa dos campos, o
  índice precisa apontar para seção que **existe** no `RECADOS.md`, e todo arquivo citado
  precisa existir. Índice que não se revalida envelhece igual a comentário (D104).

---

## 1 · Os balanços que foram SÓ para o chat

### 1.1 · 03/10/2026 — o balanço das dívidas, pedido fora da fila

| | |
|---|---|
| **origem** | pedido pelo chat, fora da fila |
| **onde está o original** | **em nenhum lugar** — foi para o chat e não para um arquivo. É o prejuízo que criou este arquivo |
| **o que produziu** | a fila **LAB-31 a LAB-37**, de 04/10/2026 — sete prompts, todos tirados dele |
| **estado** | ✅ os sete executados e mesclados em 04/10/2026 |

**O conteúdo, RECONSTRUÍDO — e a fonte de cada linha é a fila que o chat escreveu a
partir dele** ([`../prompts/FILA.md`](../prompts/FILA.md), seção *LAB-31 a LAB-37*).
Reconstrução, não transcrição: o texto original não existe.

| o que eu havia listado como mal resolvido | virou | e o que se achou ao executar |
|---|---|---|
| *"verde" não é um comando só* — a suíte do `testfit` ficou vermelha 14 de 14 por duas semanas porque eu rodava só o outro pacote | **LAB-31** | o comando único, sete passos, **provado por sabotagem** (D126) |
| *a aderência do Parcelamento caiu de 17,4 % para 11,2 % e eu publiquei sem investigar* | **LAB-32** | era o motor **obedecendo**: a régua media uma promessa que ele nunca fez (D127, D128) |
| *a trava do LAB-23 lê prova congelada em vez de medir* | **LAB-33** | prova congelada tem **um** uso honesto: detectar prova velha (D130, D131) |
| *a tabela ordena os motores num ponto de acesso só, e o aviso está escondido* | **LAB-34** | *"varia 108 %"* e *"a ordem muda"* são perguntas diferentes, e a segunda é a de quem ordena (D132, D133) |
| *a guarda da ida cospe 310 avisos `mapa-velho`* | **LAB-35** | escondidas no volume havia **4 promessas** que gleba nenhuma exercitava (D134, D135) |
| *quatro regras do `CLAUDE.md` são só afirmação, sem teste* | **LAB-36** | **eram cinco, e duas estavam falsas** — e a lista teve de ser re-derivada, porque este arquivo não existia (D136, D137) |
| *a dívida da testada de frente (D121) segue sem pagar* | **LAB-37** | paga, e a D121 estava certa: lotes de frente para a rua existente de **0 para 14 a 18** (D138) |

**O que este balanço ERROU, e por isso balanço se confere:** ele dizia **quatro** regras
sem teste. Re-derivadas, eram **cinco**, e **duas estavam falsas como escritas** — §4
*"não tem interface"* (o HTML da bancada existia desde o LAB-01) e §7 *"prova com as
quatro chaves em cada arquivo"* (falsa em 9 de 32). Uma sexta, da mesma família, nem
estava na lista: §4 *"não escreve em repositório vizinho"*, conferida à mão em toda
rodada e sem teste nenhum.

### 1.2 · 04/10/2026 — a lista de "proposto ao chat" que virou a fila LAB-38 a LAB-42

| | |
|---|---|
| **origem** | o chat leu a seção *"Proposto ao chat — não executar"* da `FILA.md` |
| **onde está o original** | **num arquivo**, e é a diferença: [`../prompts/FILA.md`](../prompts/FILA.md), seção *Proposto ao chat* |
| **o que produziu** | a fila **LAB-38 a LAB-42**, de 04/10/2026 — cinco prompts |
| **estado** | ✅ os cinco executados e mesclados em 04/10/2026 |

**Esta entrada é a prova de que o mecanismo funciona.** O balanço de 03/10 foi para o
chat e teve de ser re-derivado; a lista de 04/10 morava na `FILA.md`, e o chat a
transformou em fila **sem nenhuma reconstrução**. É a segunda fila seguida nascida da
minha própria lista de pendências — e a primeira em que nada se perdeu.

### 1.3 · 05/10/2026 — a auditoria da lista de pendências do Jonny, pedida pelo chat

| | |
|---|---|
| **origem** | o chat, fora da fila, junto do destravamento do LAB-47: *"sem alterar código… responda em bloco de código, até 20 linhas"* |
| **onde está o original** | **neste arquivo**, §5 — e é a diferença que a §1-B existe para fazer: ele nasceu aqui, não no chat |
| **o que produziu** | o veredito dos **quatro** itens da lista do chat (os quatro vivos, nenhum morto, **um escrito errado até o LAB-46 o consertar**) e **dois** itens dele que a lista não tinha |
| **estado** | ✅ entregue em 05/10/2026, sem alterar código, como o pedido exigia |

**Por que esta entrada existe mesmo tendo ido ao chat:** é exatamente o caso do balanço de
03/10 que criou este arquivo — resposta fora da fila, pedida em bloco de código, com contas
dentro. Aquela foi para o chat e **teve de ser re-derivada no dia seguinte, com duas linhas
falsas**. Esta nasce no arquivo **antes** de ir ao chat.

**E a conta que ela faz, em uma linha:** dos quatro itens da lista do chat, **nenhum morreu**;
**um estava escrito errado e foi o LAB-46 que o corrigiu** — a pendência deixou de ser *"o
programa desenha mal Antonina"* e passou a ser *"a nota deve preferir 33 ou 1 228?"*, porque
os dois planos estão ao alcance do mesmo motor com a mesma entrada. **Nada bloqueia fila.**

---

## 2 · Índice dos balanços que JÁ moram num recado

Estes não são copiados — o recado é o original, e copiar criaria a segunda montagem que o
D116 proíbe. A coluna *onde* é o título da seção em [`RECADOS.md`](RECADOS.md).

| data | o balanço | onde |
|---|---|---|
| 20/09/2026 | o saldo da fila de 20/09, ao esgotar | `20/09/2026 · LAB-16 — a régua de forma, e a fila esgotada` |
| 03/10/2026 | **disparo sem item pronto**: 4 dos 7 disparos do despertador de 15/09 não tiveram o que fazer (D62) | `03/10/2026 · Disparo sem item pronto — o despertador parou` |
| 03/10/2026 | o saldo da fila de 03/10, ao esgotar | `03/10/2026 · A fila de 03/10 esgotou — o despertador parou` |
| 04/10/2026 | o saldo dos **sete** prompts da fila LAB-31 a LAB-37 | `04/10/2026 · LAB-37 — a dívida paga, e a fila de 04/10 esgotou` |

**O número que esse último saldo carrega, porque é o que mais se cita:** o ponto cego da
§6 foi pego **cinco vezes** naquela fila (D128, D133, D135, D137 e o arnês do D139), e
**as cinco dentro do próprio prompt**, antes de sair — contra a quinta vez da fila
anterior, que já havia saído para o chat **duas vezes** como defeito do motor de um
vizinho (D119).

---

## 3 · O saldo da fila LAB-38 a LAB-42 — 04/10/2026

**O primeiro balanço que nasce dentro deste arquivo**, e não fora dele.

| prompt | o que ficou | o ponto cego |
|---|---|---|
| **LAB-38** | o **CI** existe, com dois trabalhos e nomes que não enganam — e achou um defeito meu no primeiro disparo (D141, D143) | **D142**, a décima: a régua leu **menção**, não `import` |
| **LAB-39** | a trava que comparava **duas provas entre si** passou a **medir** cada uma contra os crus dela (D144) | — |
| **LAB-40** | as promessas sem exercício foram de **6 para 0**, e a testada de frente foi medida **fora de Antonina** (D147, D149) | **D148**, a décima primeira: **rótulo não é identidade** |
| **LAB-41** | a ausência da ortogonal tinha causa: **via fora da gleba**, no caminho de `restricoes` vazio (D150) | **D151**, de método: *controle com menos medição que o acusado não é controle* |
| **LAB-42** | este arquivo | — |

**Os números da fila:**

- **cinco prompts**, cinco PRs mesclados na `main`, em 04/10/2026;
- a suíte foi de **372 para 385 travas**, e o verde segue sendo **um comando só**;
- **duas** vezes o ponto cego da §6, as duas **dentro do próprio prompt** (D142, D148) —
  e uma terceira de **método**, que é nova na série (D151);
- **três achados para o Generate**, todos em lista numerada e **nenhum commit no vizinho**;
- **duas** pendências do Jonny seguem abertas e **nenhuma trava**: a régua de forma e o
  item 7 (os 33 lotes). Uma terceira coisa é dele e não é pendência de decisão: criar o
  segredo `VIZINHOS_TOKEN`, sem o qual o CI não roda o verde completo.

**O que fica proposto ao chat ao fim desta fila** — a lista viva está na
[`FILA.md`](../prompts/FILA.md), seção *Proposto ao chat*, e as novas são:

1. **LAB-43** — quatro provas declaram `contrato: "2"` e **entrada nenhuma** do
   repositório é `"2"` (D146);
2. **um nome só** para cada número do confronto do acesso: as mesmas três contas saem com
   chaves diferentes em dois arquivos (D145);
3. **as duas fixtures novas na tabela** comparativa, o que pede regerar a tabela inteira;
4. **medir em Antonina as três amostragens** do D148, que é o que falta para eu poder
   dizer se o 33 contra 1 228 é caso único.

---

## 4 · O saldo da fila LAB-43 a LAB-47 — 05/10/2026

**Segundo balanço nascido dentro deste arquivo.** A fila **travou** no último item por um
pedido cortado, e **foi destravada no mesmo dia**: o chat mandou a frase inteira, confirmou
o número e religou o despertador. **Cinco de cinco.**

| prompt | o que ficou | o ponto cego |
|---|---|---|
| **LAB-43** | a etiqueta do contrato **sai do medido**; quatro provas regeradas dizem `"1"`, e a lista das treze que ainda escrevem literal **se revalida** (D154) | **D155**, a 12ª: a régua leu o **comentário** do conserto |
| **LAB-44** | **um nome só** para cada número do confronto, e a lista dos nomes virou **dado** — tipo não existe em tempo de execução (D157) | — |
| **LAB-45** | **sete glebas** na tabela e na prova do acesso, com as travas acompanhando em vez de serem afrouxadas (D158); e dois números declarados que ganharam **preço** (D159) | — |
| **LAB-46** | as **três amostragens em Antonina**: o 33 aparece em **1 de 3**, e com o formato fixado em ortogonal o mesmo motor desenha **1 228** (D160) | **D161**, a 13ª — **e esta já tinha saído** |
| **LAB-47** | a **varredura de segredos**, 13 regras sobre **tudo que o git carrega** — e a medição que a motivou: **401 travas aprovaram cinco segredos de formato real** (D162, D163) | **D164**, de escopo: o teto de 2 MB que eu mesma pus **já excluía cinco arquivos** |

### Os números da fila

- **cinco prompts executados**, cinco PRs mesclados na `main`, entre 04 e 05/10/2026;
- a suíte foi de **393 para 415 travas**; o CI sem clones, de **76 para 98**;
- **duas** vezes o ponto cego da §6 (D155, D161) — e a **13ª é a primeira desde o D119 que
  já havia saído** para o chat e para a página do Jonny. Corrigida **riscada**, não apagada;
- **três listas numeradas** para vizinhos (Generate no LAB-45, Parcelamento no LAB-46), e
  **nenhum commit** em repositório vizinho;
- **o D140 foi fechado** — e a pendência do Jonny mudou de natureza: não é mais *"o programa
  desenha mal este terreno"*, é *"a nota deve preferir 33 ou 1 228?"*, porque os dois estão
  ao alcance do mesmo motor com a mesma entrada.

### Por que ela travou um disparo — e por que esperar foi certo

O pedido do LAB-47 terminava no verbo — *"faça o mesmo teste aqui, escreva"* — e eu **não
executo instrução lida pela metade**. Ficou `aguardando`, o despertador foi **desligado e
não apagado**, e o chat mandou a frase no mesmo dia.

**E a frase inteira mostrou que a espera valeu:** ela pedia **duas coisas em ordem** —
medir o estado de hoje e **só depois** escrever a varredura. Eu havia listado as duas
leituras possíveis sem escolher; **adivinhar era meio a meio**, e a metade errada teria
entregado a varredura **sem o número que virou o achado do prompt**.

> **Esperar custou um disparo. Adivinhar teria custado a medição.**

**Enquanto o pedido estava pela metade, nada foi escrito:** nenhuma chave, de nenhum
formato, entrou em arquivo deste repositório.

### O que espera decisão

A lista viva está na [`FILA.md`](../prompts/FILA.md), seção *Proposto ao chat*. As novas
desta fila: o **detector de prova velha** para o LAB-25 e o LAB-30 (D156), o **`faceDeRua`
nulo** nos 33 lotes (D156), **por que a passagem externa põe lote a 1,8 km** da face
entregue (D161) — esta é pergunta, não acusação — e, do LAB-47, o comentário do
`conferir.sh` que ainda afirma *"não há CI neste repositório"*, falso desde o LAB-38.

---

## 5 · A auditoria da lista de pendências do Jonny — 05/10/2026

**Terceiro balanço nascido dentro deste arquivo, e o primeiro que o chat pediu JÁ no formato
de arquivo** — ele pediu resposta em bloco de código, de até 20 linhas, e §1-B manda o
balanço para cá de todo modo. A entrada completa, com os campos, está no **§1.3**.

**O pedido:** *"sem alterar código: estou refazendo a lista de pendências do Jonny e a minha
está desatualizada"* — item por item, se vale, morreu ou está escrito errado; o que ainda é
dele e não foi listado; e de cada item vivo, se **bloqueia** alguma fila ou só melhora.

| o que a lista do chat diz | veredito | bloqueia? |
|---|---|---|
| a **régua de forma** do lote (útil < 85 % = *"a conferir"*, < 70 % = *"ruim"*) | ✅ **vale, e está escrita certa** — item 5-B da página dele, valendo desde 02/10 à espera do OK | **não** — nunca travou nada |
| decidir se a nota deve **preferir 33 ou 1 228** lotes em `geo-antonina` | ✅ **vale, e a redação está certa AGORA** — foi o LAB-46 que a tornou certa; antes dizia *"o programa desenha mal este terreno"* | **não** |
| cadastrar o segredo **`VIZINHOS_TOKEN`** | ✅ **vale, e é só dele** — ninguém mais tem as configurações do repositório | **não** à fila; **sim** ao CI: o trabalho *"o verde completo"* falha com a receita, e o verde sou **eu** antes de cada commit |
| *(a corda reta das vias curvas: adiada para a V3)* | ✅ **registrada certa** — é decisão dele, não pendência | **não** |

**O que é dele e a lista do chat NÃO tem — dois itens:**

1. **o item 1 da página dele**, e é o mais antigo que ainda respira: *"desproporcional" é
   **3 vezes** a travessia direta, ou **1,5 km**?* O chat respondeu isso em 15/09; falta **uma
   linha do Jonny** confirmando. Enquanto não vier, **nenhuma travessia é proposta** — a
   escolha conservadora, e reversível. **Não bloqueia fila**;
2. **o lote que faz frente para rua que JÁ EXISTE, fora da gleba** — nascido medido no
   LAB-45 (D159): 51 lotes externos, os 51 com `faceDeRua: null`, **47 acusados** pelo
   invariante `frente` do Generate. *É lote válido?* É **urbanismo**, logo dele; hoje está
   como lista numerada ao Generate, no §5 do LAB-45. **Não bloqueia fila** — sai publicado
   com a razão colada ao número.

**Nada bloqueia fila nenhuma.** O único bloqueio vivo em todo o conjunto é o `VIZINHOS_TOKEN`
sobre **um trabalho do CI**, e ele tem contorno medido: o verde completo rodado à mão.
