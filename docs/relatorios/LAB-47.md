# LAB-47 · A chave de IA plantada no código — e a varredura que faltava

**05/10/2026** · prompt da fila de 04/10 (terceira), o quinto, **destravado pelo chat
em 05/10** depois de ter chegado cortado no verbo.

> *"O Render plantou uma chave de IA com formato real dentro do código e TODOS os testes
> passaram verdes — nada procurava segredo na árvore. Faça as duas coisas, nesta ordem,
> porque são trabalhos diferentes."*

Duas fases, na ordem que o chat pôs. **A ordem é o método:** medir primeiro, consertar
depois — se a varredura viesse antes, o estado de hoje ficaria sem número e eu estaria
provando a minha régua em vez de medir o repositório (§6).

E duas regras que a Pesquisa pagou para aprender, as duas aplicadas aqui:

1. **o que importa é o ESCOPO da varredura, não a existência dela** — a dela cobria três
   formatos e uma pasta só;
2. **o relatório nunca repete mais de doze caracteres do segredo**, senão a chave vaza no
   próprio registro.

---

## 1 · Fase (a) — a medição do estado de hoje. **Ninguém acusou.**

**O que foi plantado:** um arquivo novo e **versionado**,
`external-engines/esteira/src/configuracao-do-provedor.ts`, com **cinco segredos de
formato real** — todos inventados, nenhum real:

| o que | prefixo (12 caracteres, o teto) |
|---|---|
| chave de API de IA (Anthropic) | `sk-ant-api03` |
| token pessoal do GitHub | `ghp_8Qk2vLmX` |
| chave de acesso da AWS | `AKIAQ7XJ2MLV` |
| credencial de banco dentro da URL | `post`… |
| senha atribuída a um nome que a declara | `senh`… |

**O resultado, e é o do Render:**

```
VERDE — 7 passos, e a cobertura conferida.
387 pass · 0 fail (esteira) · 14 pass · 0 fail (testfit)   →  401 travas
exit 0
```

**E ele é pior do que "ninguém procurou":** o arquivo **foi lido** por dois dos sete
passos, e os dois o aprovaram.

- `tsc --noEmit` o compilou — conferido no `--listFiles`, ele está lá;
- `eslint src/configuracao-do-provedor.ts` → **exit 0**.

Não houve filtro, nem `.gitignore`, nem pasta escondida. **Os cinco segredos passaram pelo
verde inteiro sem uma palavra, porque nenhuma das 401 travas procurava segredo.**

**A rede do lado do servidor também não estava lá**, e isto está medido, não suposto:
`run_secret_scanning` neste repositório responde *"Repository does not have GitHub Advanced
Security enabled"*. O que **não** sei, e digo em vez de supor: a *push protection* de
padrões de parceiros em repositório público é mecanismo separado, e **medi-la exigiria
empurrar uma chave para o GitHub** — coisa que eu não faço, nem com chave falsa. Fica como
buraco declarado.

**Nada disto foi commitado.** O arquivo plantado viveu entre duas execuções do verde e foi
apagado; o `git rm --cached` e o `git status` estão abaixo, no §4.

---

## 2 · Fase (b) — a varredura. **O escopo é dado publicado, não promessa.**

Nasceram três coisas:

| o quê | onde |
|---|---|
| a régua | [`external-engines/esteira/src/varredura-de-segredos.ts`](../../external-engines/esteira/src/varredura-de-segredos.ts) |
| a ferramenta | [`external-engines/esteira/ferramentas/lab47.ts`](../../external-engines/esteira/ferramentas/lab47.ts) · `bun run lab47` |
| as travas | [`external-engines/esteira/tests/segredos.test.ts`](../../external-engines/esteira/tests/segredos.test.ts) |

### 2.1 · ONDE ela procura

**Tudo que o git carrega hoje** — `git ls-files --cached --others --exclude-standard`: o
rastreado **e** o que entraria no próximo `commit -a`, porque segredo recém-escrito e
ainda não rastreado é o caso mais comum de todos.

```
escopo: TODOS os arquivos que o git carrega, menos UM · 13 regras
de fora: 1 — outputs/lab01/navegador.png (binário: tem byte nulo)
na execução de 05/10/2026: 317 de 318 arquivos · 27.828.602 bytes
```

**A contagem exata vive na prova, não aqui**, e de propósito: ela muda a cada arquivo que
nasce no repositório. O que **não** muda é a forma do escopo — *tudo menos o binário, e o
binário sai nomeado*.

**Nenhuma pasta é excluída, e nem o fonte da própria régua.** Há trava exigindo que a
varredura passe pelo próprio fonte dela e pelo próprio arquivo de teste dela: auto-exclusão
é como um escopo encolhe em silêncio, e é o conserto que qualquer um faria se a régua
reprovasse o arquivo que a descreve.

Para isso ser possível, **todo exemplo falso é montado em pedaços** (`"sk" + "-ant-" + …`),
e há uma segunda trava exigindo que o fonte e o teste **não contenham o literal**. É a
lição do D155 pelo avesso: *código que fala de um formato não é uma ocorrência dele* — e a
única maneira honesta de garantir isso é o texto não conter a ocorrência, em vez de a régua
tentar adivinhar a diferença.

### 2.2 · O QUE ela procura — treze regras, e cada uma diz o que NÃO pega

As quatro famílias que o chat nomeou, e **nenhuma delas é um formato só** — há trava
exigindo que as quatro existam:

| família | regras |
|---|---|
| **chave de IA** | `chave-de-ia-anthropic`, `chave-de-ia-openai`, `chave-de-ia-google` |
| **token** | `token-do-github`, `token-do-slack`, `token-da-stripe`, `token-do-npm`, `jwt-assinado` |
| **senha** | `segredo-atribuido-a-um-nome-que-o-declara` |
| **credencial de banco** | `credencial-de-banco-em-url` |
| (e o resto que apareceu pedindo) | `chave-de-acesso-da-aws`, `segredo-de-cliente-do-google`, `chave-privada-em-pem` |

**Cada regra declara o buraco dela** (`oQueNaoPega`), e há trava exigindo que o buraco
esteja escrito. Os três buracos do conjunto, ditos de uma vez:

- **não lê o histórico do git.** Mede a árvore de hoje. Segredo que entrou e saiu num
  commit antigo continua no histórico, e para isso o remédio é **rotação da chave**, não
  varredura;
- **não mede entropia.** Segredo sem formato reconhecível **e** sem nome que o declare
  passa;
- **a regra da senha lê o NOME, não o valor.** `const x = "…"` com uma senha dentro passa.

### 2.3 · O jeito CERTO de escrever um segredo não é acusado

`token: "${{ secrets.VIZINHOS_TOKEN }}"` é **correto**, e uma varredura que grita nele é
varredura que ninguém lê. Então há a lista `VALORES_QUE_NAO_SAO_SEGREDO`, **cada entrada
com o motivo escrito** e com trava exigindo o motivo — interpolação, `process.env`,
marcador de formatação, valor já mascarado, valor que se declara exemplo.

**Medido: zero falso positivo na árvore inteira — 317 arquivos e 27,8 MB**, com o `verde.yml` deste
repositório dentro do escopo — e ele é justamente um arquivo cheio de `TOKEN` e de
`secrets.`.

### 2.4 · O teto de doze caracteres é TRAVA, não convenção

E ele não é um número só: **cada regra declara quantos caracteres cabem na amostra dela**,
porque os doze não valem o mesmo para todas. Em `sk-ant-…` os doze primeiros são o
**prefixo público do formato** e não revelam nada; **numa senha atribuída a um nome, os
doze primeiros são a senha**. Então a regra de prefixo mostra 12 e as duas que casam dentro
do segredo — a senha e a credencial na URL — mostram **4**.

Três travas: nenhuma regra acima de 12; a amostra de um achado real para no teto da regra;
e o achado publica `caracteresCasados`, **que informa sem revelar**.

**E o fecho se fecha sozinho:** a varredura cobre `docs/provas/` e `docs/relatorios/`,
então **um relatório que repetisse o segredo seria reprovado pela própria varredura que o
relatório descreve**. Há trava varrendo este arquivo e a prova do LAB-47.

---

## 3 · A prova que o chat pediu: reprova COM a chave, passa SEM ela

**Duas metades, e as duas estão medidas.**

**Passa sem ela** — `bun run lab47` na árvore limpa: **0 achados em 13 regras**, exit 0,
e isso virou a trava permanente (*"a varredura PASSA na árvore de hoje"*).

**Reprova com ela** — e em duas escalas:

1. **por formato, treze de treze.** A trava monta o exemplo falso de **cada** regra num
   diretório temporário e exige que **aquela** regra o pegue. Uma varredura que reprova um
   formato e cala nos outros doze é o escopo estreito da Pesquisa, e esta trava é o que
   impede isso de acontecer sem ninguém ver;
2. **na árvore de verdade, com o arquivo do §1 replantado:**

```
SEM a chave:  14 pass · 0 fail
COM a chave:  13 pass · 1 FAIL
  → "a varredura PASSA na árvore de hoje — zero achados"
  → 7 achados em 5 formatos, todos em src/configuracao-do-provedor.ts

e o comando único, com o MESMO arquivo plantado:
  antes do LAB-47:  VERDE — 7 passos · 401 travas · exit 0
  depois:           NÃO ESTÁ VERDE — 415 travas · exit 1 · ✗ esteira · test
```

**As três contagens de travas são de três momentos, e nenhuma é arredondamento:** **401** é
a suíte na medição da fase (a); **415**, na execução da sabotagem, já com as 14 travas
novas; **416**, ao fim do prompt — a trava do §6 abaixo nasceu **depois** da sabotagem.

Os **7** achados para **5** segredos não são erro de conta: a chave da Anthropic casa em
**duas** regras, porque `sk-ant-` é caso particular de `sk-`. **Sobreposição não é falso
positivo — é rede dupla**, e ela tem valor: se um dia o corpo da chave ficar mais curto que
os 80 caracteres que a regra específica exige, a regra genérica ainda a pega.

---

## 4 · A chave foi apagada, e isso está conferido

```
$ git rm --cached external-engines/esteira/src/configuracao-do-provedor.ts
$ rm external-engines/esteira/src/configuracao-do-provedor.ts
$ git grep -c "configuracao-do-provedor" -- .
(nenhuma referência pendente)
$ bun run lab47
NENHUM SEGREDO NA ÁRVORE.
```

**Ela nunca entrou num commit**, então também não entrou no histórico — que é o buraco que
a varredura não cobre e que, se tivesse sido commitada, só a rotação da chave resolveria.

**E isso foi conferido depois da mescla, pelo CAMINHO:**

```
$ git log --all --oneline -- external-engines/esteira/src/configuracao-do-provedor.ts
(vazio — o caminho nunca existiu em commit nenhum)
$ git ls-tree -r --name-only origin/main | grep -c configuracao-do-provedor
0
```

**A primeira conferência que eu tentei foi a errada, e pela décima vez da mesma família:**
`git log -S"configuracao-do-provedor"` **acusou o commit do LAB-47** — porque esse commit
acrescenta o **nome** do arquivo ao relatório e à prova, e o `-S` conta ocorrências do
texto, não do arquivo. É o D155 outra vez, agora no meu comando de verificação: *nome em
prosa não é a coisa*. A régua certa é o **caminho**, e ela diz vazio.

---

## 5 · O achado deste prompt, e ele é contra mim

**A minha primeira versão da régua tinha o defeito da Pesquisa.**

Pus um teto de **2 MB por arquivo**, por comodidade, e a varredura saiu dizendo
*"310 de 316"*. Os seis de fora eram **cinco saídas de geometria de `geo-antonina`** —
**13 MB**, que a máquina lê em menos de um segundo, e exatamente o tipo de arquivo onde
ninguém olha linha por linha.

Eu tinha acabado de escrever no alto do arquivo que *"o que importa é o escopo"*, e **o
escopo que eu mesma havia escrito já excluía cinco arquivos sem um motivo que se
sustentasse**. O número virou 64 MB — **parede contra arquivo absurdo, não filtro de
rotina** —, e hoje o único arquivo fora do escopo é um `.png`.

**O que isso ensina, e é por que vale um número** (D164): *escopo não encolhe por decisão,
encolhe por comodidade.* Nenhum alarme teria soado — a varredura ficaria verde, com treze
regras e um relatório bonito, **e cinco arquivos nunca lidos**. O que a pegou foi a
varredura **publicar o escopo como dado** em vez de afirmá-lo em prosa: `310 de 316` é um
número que dá para olhar e desconfiar; *"varre a árvore toda"* não é.

---

### 5.1 · E o arnês mediu o caminho errado — a forma do D139

A trava *"reprova com o segredo plantado"* **reprovou a régua**, e o defeito era do arnês:
eu escrevia o exemplo falso no arquivo temporário com `JSON.stringify`, e o escape
transformava `senha: "…"` em `senha: \"…\"`. A aspa que a regra procura **deixou de estar
ali** — a régua estava certa e o teste a acusava.

É a quarta vez que um arnês meu mede um caminho que não é o caminho (D139, D151, D158,
esta), e a lição é a mesma: **o que o teste escreve no disco não é o que eu acho que
escrevi.** Consertado escrevendo cru, com o motivo em comentário ao lado — e as treze
regras passaram.

---

## 6 · O que entra no verde e no CI

A trava nova entra nos dois, e pelos dois caminhos certos:

- **no verde**, por `bun test` do pacote `esteira` — o comando único não precisou mudar;
- **no CI**, no trabalho `guardas que não precisam dos clones vizinhos (NÃO é o verde)`,
  porque ela lê **arquivo do próprio repositório** e não importa `@generate/*` nem
  `@testfit/*` (conferido por trava). O número de travas daquele trabalho foi de **83 para
  98**, e a trava de concordância do LAB-42 obrigou a atualizar os **quatro** lugares que o
  citam. A suíte inteira foi de **401 para 416**.

**E ali apareceu um número velho que ninguém tinha visto** (D165): dentro do PRÓPRIO
`verde.yml`, a receita que ele imprime quando falta o segredo dizia *"protege 64 travas"*
enquanto o comentário no alto do mesmo arquivo dizia **83**. A trava de concordância do
LAB-42 não o pegava porque ela casa **só a frase viva** — e com razão, já que há relatório
antigo citando o número de então. Mas o `verde.yml` **não tem história para preservar**:
ali todos os números têm de bater. Virou trava (`dentro do verde.yml, TODO 'NN travas' é o
mesmo número`), e ela mordeu na hora: a frase estava quebrada em duas linhas, com o número
numa e a palavra na outra, e **foi reescrita para que a régua a alcance** — o número não
foi afrouxado para caber na régua, foi a frase que se arrumou.

---

## 7 · Para o chat, e para os outros aplicativos da família

**Isto não é achado deste repositório — é achado do método, e vale para todos.** A lista,
numerada, para o chat levar:

1. **a pergunta não é "temos varredura?", é "qual é o escopo dela?"** — publiquem o escopo
   como **número** (*"316 de 317 arquivos, 27,8 MB, 13 regras, 1 de fora e o motivo"*). A
   da Pesquisa cobria três formatos e uma pasta; a minha primeira versão já excluía cinco
   arquivos por um teto que eu pusera por comodidade;
2. **toda regra declarada precisa de um exemplo que a exercite.** Varredura de segredo é o
   pior lugar possível para uma promessa não exercitada (D135): ela fica **verde por não
   procurar**, que é indistinguível de "está limpo";
3. **a régua não se exclui do escopo dela.** Monte os exemplos em pedaços para que ela possa
   varrer o próprio fonte;
4. **doze caracteres**, e **por regra** — nos formatos com prefixo os doze primeiros são
   públicos; numa senha, são a senha. Publiquem o **tamanho** do casado, que informa sem
   revelar;
5. **perdoem o jeito certo, com o motivo escrito.** `${{ secrets.X }}` e `process.env.X`
   não são achados, e varredura que grita no código correto é varredura que ninguém lê;
6. **digam o que a varredura NÃO faz.** A nossa não lê o histórico do git: segredo que foi
   commitado e apagado **continua lá**, e o remédio é **rotação da chave**, não varredura;
7. **do lado do servidor, confiram antes de contar com ele.** Este repositório **não tem
   GitHub Advanced Security habilitada** — a rede que todo mundo supõe existir, aqui, não
   existia.

**Nada foi escrito em repositório vizinho.** Os três clones foram conferidos ao fim da
rodada e estão limpos (`git status` em cada um), como manda o §4.

---

## 8 · As decisões

- **D162** — a varredura de segredos existe, e o **escopo dela é dado publicado**: tudo que
  o git carrega, sem pasta excluída e sem auto-exclusão, com o que ficou de fora nomeado e
  com motivo;
- **D163** — a medição da fase (a): **o verde aprovou cinco segredos de formato real**, 7
  passos e 401 travas, com `tsc` e `eslint` lendo o arquivo e aprovando. O relatório guarda
  no máximo **doze** caracteres de cada um;
- **D164** — **escopo não encolhe por decisão, encolhe por comodidade**: o teto de 2 MB que
  eu mesma pus excluía cinco arquivos e 13 MB, e o que o pegou foi publicar o escopo como
  número;
- **D165** — número citado **duas vezes no mesmo arquivo** tem de bater nas duas, e o
  `verde.yml` dizia 64 num lugar e 83 no outro. A concordância do LAB-42 cobre quatro
  arquivos e **não cobria dentro de um deles**.
