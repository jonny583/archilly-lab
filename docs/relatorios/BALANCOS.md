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

---

## 6 · O saldo da fila LAB-48 a LAB-52 — 07/10/2026

**Quarto balanço nascido dentro deste arquivo**, e o primeiro de uma fila que **fechou
cinco de cinco sem travar**.

| | |
|---|---|
| **origem** | o chat, em 06/10/2026, com o despertador reabilitado pela **sétima** vez e uma autorização nova: *"reescreva você mesma o prompt guardado do despertador… você tem a minha autorização para mantê-lo atualizado daqui em diante, sem me perguntar"* |
| **onde está o original** | **num arquivo**: [`../prompts/FILA.md`](../prompts/FILA.md), seção *A FILA DE 06/10/2026* |
| **o que continha** | **cinco** prompts: LAB-48 (achado novo do Generate) e LAB-49 a LAB-52 — **três deles tirados da minha própria lista de "proposto ao chat"**, e o LAB-52 trazido da Central |
| **o que produziu** | cinco PRs mesclados na `main` (#59 a #62 e o deste prompt), **catorze decisões** (D166 a D179) e os números abaixo |
| **estado** | ✅ os cinco executados e mesclados entre 06 e 07/10/2026 |

| prompt | o que ficou | o ponto cego / o achado de método |
|---|---|---|
| **LAB-48** | o diagnóstico das **128 violações** do motor padrão: quatro invariantes, **quatro culpados** — motor 54, **ponte deste Lab 36**, contrato do Generate 11, em aberto 27 (D166 a D169) | **D166, a 14ª vez do ponto cego**: a minha volta escrevia o **alvo** no campo cujo nome é **mínimo** |
| **LAB-49** | o **detector de prova velha** para LAB-25 e LAB-30, medindo da **fonte**, escopo publicado (**11 de 19** chaves), 4 sabotagens — **2 delas as mentiras históricas** (D170 a D172) | **D172**: a minha trava me reprovou por meio ponto e eu **medi mais em vez de baixar a régua** |
| **LAB-50** | a passagem externa lê a face como **RETA**, não como segmento — e **a gleba convexa de controle provou**: 0 m onde a côncava dá 1 805,6 m (D173 a D175) | **D174**: a **quarta previsão falhou** e matou **duas** explicações minhas, que ficaram escritas |
| **LAB-51** | o cabeçalho do `conferir.sh` que afirmava **não haver CI**, consertado com a história citada e com **guarda geral** (D177) | **D177**, a 4ª da família da régua que lê texto — **e a primeira pega ANTES de escrever a régua** |
| **LAB-52** | as duas varreduras da Central, e o achado de que **o detector estava MUDO** nos dois pacotes (D178, D179) | **D179**, a 5ª da mesma família — **e a primeira pega pela SABOTAGEM, não por mim** |

### Os números da fila

- **cinco prompts executados**, cinco PRs mesclados, entre 06 e 07/10/2026;
- a suíte foi de **416 para 447 travas**; o CI sem clones, de **98 para 114**;
- **catorze decisões**, D166 a D179;
- **uma vez o ponto cego da §6** (D166, a décima quarta), pega dentro do prompt — e **duas
  vezes a sub-família da régua que lê texto** (D177 e D179), levando-a a **cinco** casos;
- **quatro listas numeradas** para vizinhos — 5 itens para o Generate (LAB-48), 4 para o
  Parcelamento (LAB-48) e 3 para o Parcelamento (LAB-50) —, e **nenhum commit** em
  repositório vizinho;
- **três detectores que estavam calados passaram a morder**: o de prova velha (LAB-49), o de
  afirmação falsa sobre caminho (LAB-51) e as três regras type-aware do lint (LAB-52).

### O que esta fila mudou de natureza, e não só de número

**O LAB-48 é o que mais rendeu, e não pelo conserto — ele não consertou nada.** Ele separou
**culpado** de **conserto** e mostrou que arrumar 37 % das violações **não aprova uma única
gleba**. Essa conta é o que decide a ordem da próxima fila, e sem ela o chat teria gastado
conserto no lugar errado.

**E o LAB-50 deu mecanismo ao que o LAB-48 tinha atribuído em bloco:** 29 das 40 violações de
`geo-antonina` saem de **uma** função do motor do vizinho, e a prova é uma gleba de controle.

### O que esta fila ensinou sobre as minhas próprias réguas

**Três das catorze decisões são sobre a régua, não sobre o medido** — e as três têm a mesma
forma: *a régua acusou o que ela mesma não devia*. D172 (o escopo raspou por baixo da minha
trava), D177 (a régua ia reprovar o próprio conserto) e D179 (28 de 28 falso positivo, e a
trava lia o nome no comentário).

> **A régua que eu acabei de escrever é o primeiro lugar a desconfiar — e a sabotagem é o
> único jeito de saber.** Das cinco sabotagens desta fila, duas pegaram defeito meu que eu
> não tinha visto.

### O que espera decisão

A lista viva está na [`FILA.md`](../prompts/FILA.md), seção *Proposto ao chat*. As novas desta
fila: o **conserto das 36 violações que são a minha ponte** (com a guarda ao lado, D136); a
**correção da moldura do D159** nos três lugares onde ela saiu; as **27 violações `frente`
não atribuídas**; **por que o motor desenha via sobre a face que ele mesmo reservou** (D174 —
matei duas explicações e não tenho a terceira); e **ligar o `recommendedTypeChecked`
completo**, que são **646 achados** e é outro prompt.

---

## 7 · Os TRÊS números do mesmo diagnóstico — 07/10/2026

| | |
|---|---|
| **origem** | pedido pelo chat, **fora da fila**, como *"importante antes de prosseguir"* |
| **onde está o original** | **aqui** — é transcrição, não reconstrução. A mensagem do chat chegou **cortada** (ver o fim desta seção) |
| **o que continha** | três sessões mediram "o mesmo" e deram números diferentes: o Generate disse **69** em duas saídas e **103** nas cinco glebas, com **17** atribuídas ao motor; o Testfit rodou a esteira do Generate inteira e disse **181**; e este Lab disse **128** no LAB-48 e **92** depois do conserto do LAB-53 |
| **o que produziu** | a **ficha de medição deste Lab**, campo por campo, e as **cinco perguntas** que qualquer duas das três têm de responder igual antes de "divergência" querer dizer algo. Mais um prompt proposto ao chat |
| **onde está a prova** | [`../provas/LAB-53/violacoes-depois-do-conserto-da-ponte.json`](../provas/LAB-53/violacoes-depois-do-conserto-da-ponte.json) e [`../provas/LAB-48/violacoes-do-motor-padrao.json`](../provas/LAB-48/violacoes-do-motor-padrao.json) |

### A resposta curta, e ela não é "alguém errou"

> **Os quatro números não são o mesmo objeto medido quatro vezes.** Contagem de violação é
> uma **soma absoluta** sobre um conjunto de planos, não uma taxa — e nenhuma das quatro
> sessões declarou, junto do número, **sobre quantos planos** ela somou.

**Antes de dizer que três sessões discordam, confira se as três mediram a mesma coisa.** É a
§6 aplicada entre sessões, e é literalmente o D172 — *confira se os dois conjuntos medidos são
o mesmo* —, que já me custou uma conclusão errada dentro de casa.

### A ficha deste Lab, campo por campo — tudo medido, nada estimado

| campo | o que é aqui |
|---|---|
| **motor** | Laboratório de Parcelamento (`motor-testfit`), o motor **padrão** da tela unificada |
| **quem julga** | o Validator do **Generate**, importado (`verificarInvariantesPlano`) — sem versão leve, sem limiar mais frouxo (D20) |
| **caminho** | ida do Lab → motor → volta do Lab → `paraResultado` do Generate → Validator dele |
| **glebas** | **5**: `completo`, `sintetico-50ha-ondulado`, `sintetico-10ha-plano`, `ensaio-47ha`, `geo-antonina` |
| **PLANOS medidos** | **5 — UM por gleba**, o 1º do ranking do próprio motor. Ele gerou **86 candidatos** (7 · 19 · 20 · 20 · 20) e eu medi **5** |
| **variante vencedora** | ortogonal · espinha · espinha · espinha · **superquadra** |
| **lotes** | **2 317** · **quadras** 70 |
| **semente** | 20260913 · **contrato** da entrada `1`, da saída `2` |
| **tampa dos exemplos** | **levantada** (`INVARIANTES_EXEMPLOS=100000`), com precondição que ABORTA se `exemplos.length !== violacoes` |
| **número** | **92**, assim: `testada` 11 · `frente` 56 · `face-quadra` 14 · `via-sobre-lote` 11 |
| **estado da ponte** | **depois** do conserto do LAB-53, hoje às 03:10 UTC. Antes dele eram **128** |
| **taxa** | **3,97 %** dos 2 317 lotes carregam violação |

### As cinco perguntas, na ordem de quanto cada uma move o número

1. **QUANTOS PLANOS?** É a maior de longe. **181 contra 92 não é contradição** se os 181
   somam dezenas de planos: o meu 92 soma **cinco**. A unidade comparável é **por plano** e
   **por lote**, com a quebra por tipo de invariante — nunca o total cru.
2. **QUAL plano de cada gleba?** A minha escolha é o vencedor da **nota do próprio motor**, e
   essa escolha é violenta: em `geo-antonina` o vencedor é a **`superquadra`, com 33 lotes e
   ZERO quadras**, e ela carrega **40 das minhas 92** — 43 % do total num plano que tem 1,4 %
   dos lotes. Quem tiver medido a alternativa de **1 228 lotes** mediu outra Antonina. *(É a
   mesma escolha que está na lista do Jonny como "a nota preferir 33 ou 1 228".)*
3. **A TAMPA DOS EXEMPLOS estava levantada?** O relatório do Validator publica `violacoes`
   como **número** e só **cinco exemplos**, a menos que `INVARIANTES_EXEMPLOS` esteja posta —
   e foi o **próprio Generate** que deixou a tampa levantável. Quem contou **listando**
   exemplos sem levantá-la contou no máximo 5 por plano. É conferível em uma linha de cada
   lado, e é a razão mais provável de um número **baixo**.
4. **QUAL motor, e por qual ponte?** *"69 em duas saídas"* tem cara de **duas saídas
   guardadas**, e pode ser o motor do próprio Generate; o meu é o motor do Parcelamento
   **através do meu adaptador**. Isso importa porque as **36 violações fantasma do D166
   existiam SÓ no meu caminho** — nenhuma contagem do lado do Generate jamais as teve.
5. **ANTES OU DEPOIS de hoje às 03:10 UTC?** O conserto do LAB-53 derrubou **36**. Qualquer
   número medido contra a minha ponte antes disso traz 36 que **já não existem** — e o
   diagnóstico de antes ficou **intacto** em `LAB-48/`, de propósito, para a comparação
   sobreviver (D182).

### E as "17 atribuídas ao motor" do Generate não batem com as minhas 54 — isto é esperado

Eu atribuí **54 de 128** ao motor (42 %). Se o número deles é **17 de 103**, as duas
atribuições só seriam comparáveis se os dois tivessem medido o **mesmo plano da mesma gleba**
— e pela pergunta 2 isso é improvável. **Não trato a diferença como erro de ninguém enquanto
as cinco perguntas não tiverem a mesma resposta nos dois lados.**

### A mensagem chegou CORTADA, e isso fica dito

O texto do chat termina em *"O Testfit rodou a esteira do Generate inteira e disse 181, todas
de"* — e para aí. **Não completo a frase por dedução**: *"todas de um tipo só"* e *"todas de
uma gleba só"* levam a conclusões opostas, e inventar a metade que falta é o oposto de medir
(§6). O que falta está pedido no recado do dia.

---

## 8 · O saldo da fila LAB-53 a LAB-57 — 07/10/2026

| | |
|---|---|
| **origem** | fim de fila. A de 07/10/2026, mandada pelo chat com o despertador religado pela **oitava** vez |
| **onde está o original** | **aqui** — este é o saldo, escrito **junto do último prompt** e não depois, como a §1-B manda |
| **o que continha** | cinco prompts: três aprovados da minha lista de *"proposto ao chat"* e declarados **caminho crítico do MVP** pelo chat (LAB-53, 54, 55), mais a correção de moldura (LAB-56) e a varredura de configuração (LAB-57) |
| **o que produziu** | **as 92 violações todas atribuídas**, cinco relatórios, **17 decisões** (D180 a D196), **55 travas novas** e três consertos de configuração |
| **onde está a prova** | `docs/provas/LAB-53/`, `LAB-54/`, `LAB-55/`, `LAB-57/` e os relatórios `LAB-53.md` a `LAB-57.md` |

### Os cinco, e o que cada um moveu

| # | o que entregou | o número |
|---|---|---|
| **LAB-53** | o conserto das 36 violações que eram **a minha ponte** (o ALVO no campo cujo nome é MÍNIMO) | **128 → 92** |
| **LAB-54** | as **27 `frente`** não atribuídas, medidas com a régua **dele** | **23 motor + 4 régua** |
| **LAB-55** | por que a via cai **sobre a faixa reservada**: `util` governa o lote, a **divisa** governa a via | **a assimetria** `sobreposicao`=0 × `via-sobre-lote`=11 |
| **LAB-56** | a moldura do D159, corrigida em **cinco** documentos e **no gerador** | **5 + 1**, não os 3 contados |
| **LAB-57** | a varredura das configurações: **três** formas de desligar, e a segunda estava viva | **27** configurações, **11** varridas, **16** nomeadas |

### O que a fila FECHOU, e é a primeira vez desde o LAB-48

```
MOTOR ................... 81   CONTRATO (Generate) ..... 11   NÃO ATRIBUÍDAS ... 0   ← era 27
```

**E nenhuma das cinco glebas aprova.** O ranking da tela unificada só deixa de nascer vazio
quando as **81 do motor** tiverem conserto, e o conserto é **lá**. A conta do LAB-48, que o
chat adotou como calendário, continua de pé: *consertar 37 % das violações não aprova uma
gleba* — e agora está medido na prática, não previsto.

### O que esta fila ensinou sobre as minhas próprias travas

**Sete sabotagens pegaram defeito meu que eu não tinha visto, em cinco prompts** — e três
delas num prompt só:

| onde | o defeito da trava |
|---|---|
| D181 | ela comparava o campo com **o valor de hoje**, e a faixa degenerada fazia o sorteado coincidir com o limite |
| D186 | a precondição media **área**, e translação não muda área nenhuma |
| D187 | a varredura do LAB-52 teve o **primeiro achado verdadeiro** — e era no meu código novo |
| D192 | a régua casava a **minha própria frase de conserto**: régua que casa uma frase não distingue *X* de *não X* |
| D193 (três) | a **limpeza errada** das duas do D179; a varredura no **arquivo todo**; a janela de **25 linhas** num arquivo de uma linha por relatório |

> **Sabotar a própria trava deixou de ser zelo e passou a ser método — e o que ele acha, em
> cinco prompts de cinco, é sempre a MINHA régua antes do medido.**

### E TRÊS números meus estavam errados onde eu podia medi-los

| decisão | eu publiquei | medido |
|---|---|---|
| **D185** | *"oito das 27 a 0,2 m ou menos"* | **cinco** — e a lista estava impressa na linha de cima |
| **D191** | *"três lugares"* onde a moldura saiu | **cinco** documentos **e um gerador** |
| **D196** | *"20 erros"* com os dois flags ligados | **1 604**, com **quatro aqui** |

**As três foram achadas no prompt seguinte, por ir conferir.** O ponto cego da §6 foi de
**quatorze para dezesseis** linhas nesta fila, e a regra que elas acrescentam é curta: *conte
a lista, não a memória* — e isso vale para **quantos lugares** e **quantos erros**, não só
para quantos lotes.

### O que espera decisão

**O primeiro item é do chat, e está aberto:** a mensagem de 07/10 sobre os **três números
diferentes** chegou **cortada** em *"disse 181, todas de"*. A resposta medida está no **§7**
deste arquivo — **os quatro números não são o mesmo objeto** —, e falta o resto da frase ou as
cinco respostas das outras sessões para fechar a conta.

O resto está na [`FILA.md`](../prompts/FILA.md), seção *Proposto ao chat*. As novas desta
fila: a **reconciliação dos quatro números** (§7), o **`recommendedTypeChecked` completo** (646
achados, que o chat adiou para depois do MVP), e a **varredura de segredos passar a NOMEAR o
que é ignorado** — o `.gitignore` do upstream esconde `/.claude` e `.mcp.json`, que hoje não
existem, e upstream é intocável.

---

## 9 · O saldo da fila LAB-58 a LAB-61 — 07/10/2026

| | |
|---|---|
| **origem** | o chat, em 07/10/2026 à noite, **depois de aceitar a recusa da fila T-36…T-39** e redirecionar os três itens que eram do Lab |
| **onde está o original** | [`../prompts/FILA.md`](../prompts/FILA.md), seção *A FILA DE 07/10/2026 (segunda)*, com as palavras dele item por item |
| **o que continha** | quatro prompts: agrupar as 81 por mecanismo, o contrafactual de Antonina, a configuração do motor só de leitura, e a dívida própria |
| **estado** | ✅ **quatro de quatro**, executados e mesclados em 07/10/2026 (PRs #72, #74, #76 e #78) |
| **onde está a prova** | `docs/provas/LAB-58/` a `docs/provas/LAB-61/`, oito arquivos |

### A regra de família que nasceu antes da fila

> *"Erro meu, a fila T-36 a T-39 era do motor e você acertou em não executar. A sua regra está
> aceita e vira regra da família: **quem mede é quem vai consertar, e fila com numeração de um
> app não se executa noutro**."*

**É a primeira vez que uma recusa minha virou regra da família.** A fila anterior esgotou, o
chat mandou uma fila com numeração `T-xx` endereçada ao motor, e eu não a executei — quatro
coisas medidas diziam que era do vizinho, e a quinta era de método: *medição duplicada entre
sessões não dá confirmação, dá divergência*, que é o que produziu os quatro números do §7.

### Os quatro, e o que cada um moveu

| # | o que entregou | o número |
|---|---|---|
| **LAB-58** | as 81 violações do motor agrupadas por **MECANISMO**, em lista numerada | **SEIS** mecanismos, `MECANISMO-NAO-NOMEADO` em **zero** |
| **LAB-59** | o **contrafactual** de Antonina, as 20 candidatas por quatro cenários | **16 de 20** aprovam com os dois lados resolvidos — e a nota dele ainda prefere 33 |
| **LAB-60** | a configuração do motor, **só de leitura**, em lista numerada | as **três formas vivas**, e ele **não tem CI** |
| **LAB-61** | a **minha** lista de propostas, medida e consertada | **18 problemas → 0**; 5 itens executados seguiam abertos, 2 eram cópias |

### O que a fila FECHOU, e é a maior entrega dela

**A pendência do Jonny sobre preferir 33 ou 1 228 lotes.** O LAB-59 mediu as 20 candidatas de
`geo-antonina` pelo Validator do Generate em quatro cenários:

```
hoje ............  0 de 20 aprovam
só-o-contrato ...  0 de 20
só-o-motor ......  0 de 20
os-dois ......... 16 de 20   ← a ortogonal de 1.228 lotes ENTRE ELAS
```

E a nota **dele** continua preferindo a `superquadra` de **33** — 0,6226 contra 0,5881.

> **O que escolhe o plano pequeno é a RÉGUA DE NOTA, não a validade.** A decisão que sobra
> para o Jonny é urbanismo, não medição — e o item 7 da página dele foi marcado como **medido
> e fechado**, com a tabela dos quatro cenários em palavra de pessoa.

**As duas pontas são necessárias e nenhuma basta:** só o motor aprova zero, só o contrato
aprova zero. É a confirmação medida do `oQueBloqueiaCadaGleba` do LAB-58.

### A lista que vai ao motor, por mecanismo e em ordem de quantas glebas destrava

```
1 · o teto de face de quadra limita UM EIXO e deixa o outro correr ....... 14   2 glebas
2 · a quadra recebe fileira de lote em face que NÃO É RUA ................ 23   3 glebas
3 · o corte do último lote encurta a TESTADA e preserva o fundo .......... 11   3 glebas
4 · a fileira encosta na via só de ESGUELHA ...............................  4   1 gleba
5 · a faixa do lote externo é um SEMIPLANO ............................... 18   1 gleba
6 · a rede viária é aparada pela DIVISA e não por `util` ................. 11   1 gleba
```

**A ordem não é a do volume** (D197): `ensaio-47ha` é bloqueada por **um mecanismo só** — o
teto de face, 6 violações — e consertá-lo **zera uma gleba inteira, sozinho**. Três
mecanismos bloqueiam **quatro das cinco** glebas.

### Os números do repositório

| | ao abrir a fila | ao fechar |
|---|---|---|
| suíte | **505** travas | **584** travas (567 esteira + 17 testfit) |
| CI sem clones vizinhos | **114** | **193** |
| decisões | D196 era a última | **D206** |
| provas | — | **8** arquivos novos, em 4 pastas |

### O que esta fila ensinou, e as quatro lições são de MÉTODO

1. **Agrupamento só é medição se for partição** (D197): soma fechando, ninguém casando dois
   grupos, e órfã saindo **nomeada e caracterizada**, nunca como balde fechado.
2. **Valor POR OBJETO lido de prova feita sobre OUTRO objeto não é economia, é tabela que
   erra em silêncio** (D200) — e ela **se disfarça de D116**. O D116 proíbe remedir a mesma
   grandeza do mesmo objeto; medir a mesma grandeza de **outro** objeto é obrigação, e a
   prova antiga vira **calibração**.
3. **A trava que vale é a que reprova a frase que você ia publicar** (D201). No LAB-59 a soma
   fechava, os cenários eram monótonos e as contagens batiam — **com a resposta errada**. Só
   as duas travas **semânticas** caíram.
4. **Régua que nunca saiu de casa não sabe o que não vê** (D202). Apontada ao clone do motor,
   a varredura de configuração revelou **três falso-negativos meus** de uma vez.

### E CINCO vezes um número meu estava errado onde eu podia medi-lo

| onde | eu escrevi | era |
|---|---|---|
| LAB-58, relatório | *"68,3 m em **11** das 14"* | **10** das 14 |
| LAB-59, primeira medição | *"**1** de 20 aprovam"* | **16** de 20 |
| LAB-60, prova do LAB-57 | a prova dizia **1** | a ferramenta dizia **10** |
| LAB-61, limiar | *"1,00 e **0,88**"* | **1,00** e **1,00** |
| LAB-61, decisão | *"**três** sabotagens passaram"* | **quatro** |

**As cinco foram pegas dentro do próprio prompt**, e quatro delas pela ferramenta ou pela
trava — não pelo olho. *Número que o repositório guarda não se escreve de cabeça* (D185).

### As sabotagens, e QUATRO delas passaram antes de pegar

Nesta fila houve **nove** sabotagens. **Quatro** saíram `exit 0` e foram elas que
consertaram a régua: a calibração que media só os lotes de `frente` (D198), a trava do glob
com o `rules` fora da região comida (D203), a leitura de menção em vez de citação (D206) — e
a do LAB-54, de antes desta fila (D179). *O `exit 0` de uma sabotagem é o achado, não o
alívio.*

### O que espera decisão

- **do Jonny:** a régua de nota deve preferir poucos lotes grandes ou muitos lotes? Não há
  mais dúvida de desenhabilidade atrás disso;
- **do chat:** os **11** itens abertos da seção *Proposto ao chat*, cada um agora com o
  **motivo declarado** — 3 `prompt-novo`, 3 `nao-medido`, 2 `aguardando-outro-repositorio`,
  1 `depois-do-mvp`, 1 `aguardando-o-jonny`, 1 `escopo-novo`;
- **do motor e do Generate:** as duas listas numeradas, que vão pelo chat.

**O despertador foi DESLIGADO** (`enabled: false`), não apagado — é a regra que o chat
ratificou duas vezes em 07/10. O motivo está em
[`../ONDE_PARAMOS.md`](../ONDE_PARAMOS.md).

---

## 10 · O saldo da fila LAB-62 e LAB-63 — 08/10/2026

| | |
|---|---|
| **origem** | o chat, em 08/10/2026, **depois de aceitar o achado do LAB-61 como dívida dele** |
| **onde está o original** | [`../prompts/FILA.md`](../prompts/FILA.md), seção *A FILA DE 08/10/2026*, com as palavras dele item por item |
| **o que continha ao nascer** | **cinco** prompts: LAB-62 a LAB-66 |
| **o que continha ao fim** | **dois** — o chat somou os restantes, duas vezes, e a segunda substituiu a primeira |
| **estado** | ✅ **dois de dois**, executados e mesclados em 08/10/2026 (PRs #80, #82 e o deste prompt) |
| **onde está a prova** | `docs/provas/LAB-62/` e `docs/provas/LAB-63/`, quatro arquivos |

### Esta fila encolheu DUAS vezes, por ordem dele, e o registro de como

| quando | o que ele disse | o que virou |
|---|---|---|
| ao abrir | a fila de cinco, LAB-62 a LAB-66 | cinco itens |
| depois do LAB-62 | *"some dos dois prompts em 1 somente"* — **sem dizer qual par** | perguntei, a pergunta foi negada, e **eu escolhi**: LAB-64 + LAB-65, com o motivo declarado na fila (PR #82) |
| logo depois | *"melhor os vários prompts em 1 somente"* | os **quatro** restantes num só: o LAB-63 |

**A numeração não foi renumerada em nenhuma das duas vezes.** LAB-64, LAB-65 e LAB-66 ficaram
**riscados e não apagados**, com as palavras do chat sobre cada um no lugar onde estavam — porque
**212 decisões citam número de prompt**, e fila renumerada quebra toda citação que já saiu. É a
mesma regra da página do Jonny (§5) e da lista de propostas (D205).

**E a primeira soma não foi desfeita pela segunda: foi absorvida.** O motivo que a justificou — os
dois achados são a mesma varredura, e a D207 é um caso dos dois ao mesmo tempo — continua sendo o
motivo de eles serem **uma** parte do LAB-63, e não duas.

### O que a fila de dois prompts produziu

| | LAB-62 | LAB-63 |
|---|---|---|
| **o pedido** | as três listas que esperam pelo chat, dentro do recado | o que eu aceitei e nunca reconferi |
| **o que foi achado** | a lista do motor tinha **três posições que ninguém reproduzia**; e o que eu ia chamar de achado **já era a D197** | **2 de 6** símbolos apontavam para o arquivo errado no clone; a §6 declarava **16** e classificava **14** |
| **decisões** | D207, D208, D209 | D210, D211, D212, D213 |
| **travas novas** | 20 | 32 |
| **sabotagens** | 4, **nenhuma** passou | 4, **uma** passou — e achou buraco de verdade na guarda |

```
suíte .............. 604 → 636 travas (619 esteira + 17 testfit)
CI sem clones ...... 193 → 230
decisões ........... D206 → D213
provas novas ....... 4
```

### As duas lições desta fila, e as duas são sobre SILÊNCIO

**A primeira é do LAB-62, e é nova na casa:** *achado que repete decisão registrada não é achado,
é a decisão sem a citação.* Eu ia publicar como achado do dia o que a D197 decidira na véspera —
e isso teria dito ao chat que a lista mudou quando ela não mudou. A regra que sai dela: **antes de
escrever "o achado é", procurar o achado nas decisões.**

**A segunda é do LAB-63, e custou quatro vezes no mesmo prompt:** a régua nova não viu o que
estava lá **quatro vezes**, e nenhuma delas estourou — todas devolveram *"nada encontrado"*. E a
pior foi a da **guarda**: ao reescrever a §6 numa forma mais conferível, a régua passou a achar
zero classes e a imprimir *"tudo conferido"*.

> **Régua que não acha nada tem duas leituras — *está limpo* e *estou cega* — e só a segunda é
> segura de assumir por conta própria.**

Por isso palavra de número não reconhecida e partição não encontrada passaram a ser **problema**,
e não `continue`. *Foi o silêncio do `continue` que escondeu os quatro.*

### O que sobra para o chat, e é curto

- **os onze itens abertos** da seção *"Proposto ao chat"*, cada um com o motivo declarado —
  mandados dentro do recado do LAB-62, um por linha, para ele responder item a item;
- **as duas listas numeradas** que vão pelos vizinhos: os seis mecanismos do motor e as formas de
  desligar conferência dele, cada item dizendo **o que precisa ficar verdadeiro**, **com que
  frequência** e **o que não serve**;
- **a proposta de VGV com curva de preço por tamanho**, que entrou na página do Jonny com as três
  coisas que eu preciso dele para a conta não ser número inventado.

**O despertador foi DESLIGADO** (`enabled: false`), não apagado — o chat reusa o id.
