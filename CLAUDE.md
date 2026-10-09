# CLAUDE.md — Archilly Lab

Regras permanentes deste repositório. **Leia antes de qualquer tarefa e obedeça
em todas as sessões.**

Ao acordar: `docs/ONDE_PARAMOS.md` → `git log` → `docs/prompts/FILA.md` →
`docs/PENDENCIAS_JONNY.md`.

---

## 1 · A regra do RECADO — UM BLOCO SÓ por rodada

**Toda resposta sua para o chat é UM único bloco de código** (entre três crases), e **nada fora
dele**: nem texto na conversa acima, nem despedida, nem pergunta, nem link solto, nem um segundo
bloco. O bloco abre com o recado e segue com tudo o mais que o Jonny precise copiar.

```
=== RECADO PARA O CHAT — <app> · <prompt> ===
Estado: ...
Feito: ...
Achados para outros apps ou Central: ...
Depende do Jonny: ...
Próximo na fila: ...
=== FIM ===

--- O QUE VAI JUNTO ---
<lista numerada, texto para colar noutro app, pedido a outro repositório…>
```

**O recado vem PRIMEIRO**, nas suas **doze linhas**, e logo abaixo, **no mesmo bloco**, separado
pela linha de marca `--- O QUE VAI JUNTO ---`, vai qualquer lista, texto para colar em outro lugar
ou pedido a outro repositório.

**O teto de doze linhas é do RECADO, não do bloco.** O bloco pode ser longo. **Partir o bloco para
caber nas doze linhas é o defeito, não o conserto** — *o custo é o número de cópias, não o tamanho
do texto.*

Vale para toda resposta, curta ou longa, boa notícia ou má — inclusive quando a resposta é só "não
deu". **`<app>` é o NOME DESTE APLICATIVO — `MOTOR LAB (archilly-lab)` —, e não a palavra `Lab`**: a Central mandou isso em 09/10, porque o chat recebe nove respostas parecidas e precisa saber de quem é cada uma, e a trava que casava `Lab` literal reprovou o primeiro cabeçalho certo (D228). `<prompt>` é o prompt em execução (`LAB-07`, `LAB-02`…) ou `—` quando não
houver nenhum. Linha sem conteúdo leva `—`, nunca some: o leitor precisa ver que a pergunta foi
feita e a resposta foi "nada". Doze linhas é teto DO RECADO, não meta — e não teto do bloco: era esta frase, sem o sujeito escrito, que me fez abrir quatro blocos (D218).

**Por quê, e foi medido em 08/10/2026:** o LAB-62 devolveu **quatro** blocos — três listas e o
recado — e o Jonny **atravessou cinco telas copiando um por um**, no celular. Ele chama de *prompt*
o que cola no chat do outro app, e pediu para unificar **duas vezes** antes de eu entender (D214,
D215). O recado existe para ele não caçar informação; **bloco a mais faz exatamente o que a regra
queria impedir.**

### Quando ele não voltou entre dois prompts: o bloco vem ACUMULADO

Se você rodar **mais de um prompt** sem ele responder, o bloco mais novo **acumula**, e abre
dizendo quais:

```
=== RECADO PARA O CHAT — Lab · LAB-64 ===
ACUMULADO — inclui os recados LAB-63, LAB-64
Estado: ...
```

**O recado completo de cada prompt continua indo INTEIRO para o arquivo**, um por um: o acumulado é
a forma de **entregar**, nunca a de **registrar**.

**O mesmo recado é acrescentado a
[`docs/relatorios/RECADOS.md`](docs/relatorios/RECADOS.md)**, com a data, em ordem cronológica.
Assim "me dá tudo desde o dia tal" vira uma leitura de arquivo, e não uma reconstrução a partir
dos relatórios. **Recado que foi ao chat e não foi ao arquivo não existe amanhã** — aconteceu em
08/10/2026, com o recado da própria regra do bloco, e agora **há guarda** (D216).

**E o `<prompt>` do cabeçalho é a ÂNCORA da rodada, inclusive da que não tem relatório** (D229):
ele é um prompt (`LAB-07`, `LF-FINAL`, `T-35` — a **forma**, não a sigla) **ou uma das seis
classes de rodada** de vocabulário fechado: `despertador-sem-item`, `fila-esgotada`,
`fila-recusada`, `decisao-registrada`, `recado-recuperado`, `fora-de-fila`. *Rodada que aconteceu
e não disse o que era é órfã, e a trava reprova* (`tests/classes-de-rodada.test.ts`). O buraco
que isto fecha era meu e estava **declarado**: até aqui, para essas rodadas *"o que restava era
disciplina"* — e **disciplina não é guarda**.

---

## 1-C · Da Central — o texto da regra, gravado como veio

**Mandado pela Central em 08/10/2026, para gravar neste `CLAUDE.md` em seção própria.** Está
**literal**, sem edição: a §1 acima é a minha aplicação dele, e esta seção é a **fonte**. Quando
as duas divergirem, manda esta.

> Da Central, regra nova do Jonny, para o CLAUDE.md deste repositório.
> UM BLOCO SÓ POR RODADA: tudo o que o Jonny precisa copiar sai dentro
> de UM único bloco de código — o recado primeiro, e abaixo dele, NO
> MESMO BLOCO, qualquer lista, texto para colar em outro lugar ou
> pedido a outro repositório, separado por linha de marca. Nunca dois
> blocos, nunca um bloco e outro depois, e nunca texto a copiar na
> conversa acima do bloco: o que fica na conversa não chega ao chat, e
> três sessões já perderam texto assim. O LIMITE DE DOZE LINHAS É DO
> RECADO, NÃO DO BLOCO: o bloco pode ser longo quando precisa, e isso é
> melhor do que dividir, porque o custo dele é o número de cópias, não
> o tamanho — partir o bloco para caber nas doze linhas é o defeito,
> não o conserto. ACUMULADO: rodou mais de um prompt sem o Jonny
> voltar, o bloco mais novo abre com "ACUMULADO — inclui os recados X,
> Y e Z" e traz só o que ainda importa; ele copia só o último, e cada
> prompt continua gravando o recado COMPLETO no arquivo de recados do
> repositório. A razão: ele é o transporte entre as sessões e o chat,
> no celular, com o dedo, e cada bloco é uma travessia de tela. Medido:
> quatro blocos numa rodada custaram cinco telas. Padrão Archilly 2.6,
> regras 48, 49 e 50, DEC-159.

**Esta regra é comportamento de sessão e NÃO espera o kit.** Medido pela Central em 08/10: este
repositório está **sem cópia do Padrão Archilly e sem `VERSAO.txt`** — conferido aqui e é verdade,
nenhum dos dois existe na árvore. A regra vale assim mesmo; o kit, quando chegar, é outro item.

### O princípio por trás dela, e ele é maior que a regra (D218)

> **REGRA DE FORMA SEM O SUJEITO ESCRITO MANDA NA COISA ERRADA.**

A §1 dizia *"no máximo 12 linhas"* **sem dizer de quê**, e eu li como teto do **bloco**. Os quatro
blocos do LAB-62 foram **obediência a uma regra mal escrita, não desobediência** — e foi preciso o
Jonny pedir **duas vezes** para o defeito aparecer. Toda regra de forma desta página passa a dizer
**de que** é o limite, e **há guarda** (`tests/limites-com-sujeito.test.ts`).

---

## 1-B · O BALANÇO vai para um arquivo

**Balanço é resposta que faz as contas** — de uma fila que acabou, de um conjunto de
dívidas, do estado do repositório. Ele **não** é relatório de prompt nem recado de
entrega, e por isso não tinha onde morar.

**Todo balanço é acrescentado a
[`docs/relatorios/BALANCOS.md`](docs/relatorios/BALANCOS.md)**, com data, origem, o que
continha, o que produziu e onde está a prova. **Balanço que já mora num recado não se
copia**: entra no índice daquele arquivo, apontando para a seção do `RECADOS.md` — copiar
criaria a segunda montagem que o D116 proíbe. **Reconstrução sai etiquetada como
reconstrução**, com a fonte de cada linha.

**Por quê, medido:** em 03/10/2026 o chat pediu um balanço fora da fila; a resposta foi
para o chat e **não para um arquivo**. No dia seguinte ele mandou executar um item dela, e
a lista **não existia em lugar nenhum** — custou uma varredura inteira do `CLAUDE.md` para
recuperar cinco linhas, e ao recuperá-las elas eram **cinco, não quatro, e duas estavam
falsas** (D136, D137). Daí a regra, e daí a segunda metade dela: **balanço recuperado se
confere, não se obedece.**

> **O que vai ao chat e não vai a um arquivo não existe amanhã.**

**Há guarda** (`esteira/tests/balancos.test.ts`): os campos de cada entrada, o índice
apontando para seção que existe, os arquivos citados existindo, e a ordem cronológica.
Regra que ninguém pode desmentir é slogan (D136), e esta pode.

---

## 1-A · A fila é autônoma

`docs/prompts/FILA.md` é a **fila oficial**, escrita pelo chat. Este repositório
a executa **sozinho, em laço**, acordado por **um** despertador de 60 minutos
(minuto :05; o id vive em [`docs/ONDE_PARAMOS.md`](docs/ONDE_PARAMOS.md), não
aqui — id em duas terras envelhece numa delas). Regra de família: **um
despertador por aplicativo; nunca se toca no de outro repositório.**

- **Um prompt por despertador.** Se o anterior não fechou, termine-o antes de
  começar qualquer coisa nova.
- **Prompt fora da fila não existe.** O que faltar entra na fila como
  *"proposto ao chat"*, sem executar. Não ampliar escopo.
- O que depende do Jonny ou de outro repositório fica **"aguardando"**: pular
  para o seguinte e reavaliar a cada despertador.
- **Disparo sem item pronto: DESLIGAR o despertador** (D62 + D112). Vale tanto
  para a fila esgotada quanto para a fila que existe mas está toda
  *"aguardando"* — em qualquer dos dois casos, gravar o recado acumulado,
  escrever em `ONDE_PARAMOS` **o motivo** e **desligar** (`enabled: false`), nunca
  apagar. O chat o religa com fila nova.
  Medido: dos 7 disparos do despertador de 15/09, **4 não tiveram o que fazer**.
  **Esta linha dizia "apagar" até 07/10/2026, e estava falsa na prática:** eu
  desliguei em vez de apagar **seis vezes**, e o chat mandou **reabilitar em vez
  de recriar** sete — até ratificá-lo por escrito: *"pode desligar ao esgotar em
  vez de apagar; você está certa, e passa a ser assim daqui em diante."*
  **Apagar perde o id**, que é o que ele reusa; e o id vive em `ONDE_PARAMOS`.
  *Regra que a prática desmente seis vezes não é regra, é texto velho* (D104).

  **🟠 ESTA LINHA CONFLITA COM A REGRA DA CAIXA DE ENTRADA, e o conflito está
  DECLARADO em vez de resolvido por mim** (D236). Aqui diz **desligar**; a
  [`docs/caixa-de-entrada/COMO_FUNCIONA.md`](docs/caixa-de-entrada/COMO_FUNCIONA.md),
  escrita pelo chat em 09/10, diz *"grave um recado de uma linha dizendo 'caixa
  vazia', envie, e durma… anote a data numa linha do `ONDE_PARAMOS.md`"* — e **não
  manda desligar**. O item 004 fecha o cerco: *"ligar e desligar é do chat; o seu
  trabalho é a conta."*
  **Enquanto o chat não desempatar eu sigo a da CAIXA — anotar e dormir —, e o
  motivo é medido:** desligar servia quando o chat tinha de ser avisado para
  mandar fila nova; agora ele escreve na caixa **sem passar por mim**, e
  despertador desligado **nunca pega o item 005**. Desligar deixaria de proteger
  e passaria a travar. *Isto é leitura minha, não ratificação: o desempate é do
  chat, e está no recado.*
- **O despertador nasceu sem conectores do GitHub.** Se ao acordar não houver
  `mcp__github__*`, mesclar por git direto (`git merge --no-ff` na `main`) e
  **declarar isso no relatório e no recado** (D29).

---

## 2 · O que é este repositório

Laboratório de motores de loteamento para o **Archilly Generate**. A hipótese:
motores externos podem alimentar o Generate, no todo ou em partes, atrás de um
adaptador isolado, **sempre passando pelo Validator e pelo Judge dele**.

| onde | o quê |
|---|---|
| `docs/INDEX.md` | o índice de tudo — onde está a coisa |
| `docs/ONDE_PARAMOS.md` | o estado do laboratório — comece por aqui |
| `docs/prompts/FILA.md` | o roteiro, LAB-00 em diante |
| `docs/PENDENCIAS_JONNY.md` | só o que depende de uma pessoa |
| `docs/DECISOES.md` | as decisões, numeradas, com o porquê |
| `docs/referencia/LABORATORIO.md` | a especificação (Etapas A a G) |
| `docs/relatorios/` | as medições, um arquivo por prompt |
| `docs/relatorios/RECADOS.md` | todos os recados para o chat, em ordem |
| `docs/relatorios/BALANCOS.md` | os balanços, em ordem — o que faz as contas (§1-B) |
| `docs/provas/` | os números crus, em JSON |

A família: **Geo** (`urban-scout-tool`) capta o terreno · **Generate**
(`urban-create-hub-41d93a4d`) gera, valida e julga · **Laboratório de
Parcelamento** (`motor-testfit`) gera ao vivo na tela · **este Lab** testa
motores candidatos.

---

## 3 · A regra de ouro

```text
UPSTREAM              ARCHILLY               ADAPTER              ARCHILLY
(original,     ──>    (cópia de       ──>    (ponte)      ──>     GENERATE
 intocado)             trabalho)
```

1. **`upstream/` é intocável.** Cópia exata do motor original, commit e data em
   `VERSION`. Não se edita, não se aplica patch, não se "corrige".
2. **O trabalho acontece em `archilly/`**, documentado.
3. **`adapter/` é a única fronteira.** Só ele conhece detalhes do motor.
4. **O Generate nunca depende disto.** `external-engines/` inteiro pode ser
   apagado sem que ele sinta.

**Exceção medida (D16):** motor **da própria família** não ganha `upstream/`. Ele
é lido por caminho, do clone irmão, e o caminho vive num lugar só — os `paths`
do `tsconfig.json` do adaptador. Copiá-lo criaria uma segunda cópia envelhecendo
em silêncio.

---

## 4 · O que este repositório NUNCA faz

- **Não escreve em repositório vizinho.** Geo, Generate e o motor do Testfit são
  clonados **somente para leitura**. Conferir com `git status` neles ao fim de
  toda rodada, e dizer no relatório que ficou limpo.
- **O que precisa mudar no vizinho vira lista numerada em relatório**, nunca
  commit lá.
- **Não tem interface — com UMA exceção, declarada** (LAB-36). Prova aqui é teste,
  JSON e captura de plot quando ajudar. O único HTML do repositório é a **bancada
  da prova no navegador**
  (`external-engines/symbios/adapter/ferramentas/navegador/index.html`): ela não é
  produto, é onde o `.wasm` do Symbios é carregado em Chromium de verdade (D123).
  **Há guarda contando os HTML**, e um segundo reprova — antes do LAB-36 esta regra
  era falsa como estava escrita, porque esse arquivo já existia.
- **Não reimplementa o Validator nem o Judge.** Eles são importados do Generate.
  Sem versão leve, sem limiar mais frouxo por ser de fora (D20).
- **Não conserta geometria em silêncio.** Conserto do Lab é declarado, vem
  desligado por padrão, e a medição sai nas duas passagens — com e sem.
- **Não inventa dado.** O que o motor não mede sai `null`, nunca zero. Zero é uma
  medição; `null` é "não medido" (D23).
- **Não descarta em silêncio campo que o motor publica.** Todo campo que um motor
  entrega tem destino escrito no inventário da ponte
  (`external-engines/esteira/src/inventario-das-pontes.ts`): *atravessa*,
  *traduzido*, *perda declarada* ou *mecânica interna*. A
  `guarda-da-ponte.ts` confere o inventário **contra o motor rodando**, e
  reprova em dois casos: campo da SAÍDA que sai `null` enquanto o motor publica
  valor, e campo novo do motor sem destino escrito. **O motivo de uma perda não
  mora em comentário** — comentário não se revalida, e foi assim que o Lab
  publicou `null` por três semanas e atribuiu a falta ao motor do vizinho (D98,
  D104).
- **Não carrega segredo na árvore.** Chave de IA, token, senha, credencial de banco:
  nenhum valor literal em arquivo que o git carregue. **Há varredura**
  (`esteira/src/varredura-de-segredos.ts`, 13 regras), e o que importa nela é o **escopo**,
  não a existência: ela varre **tudo que o git carrega** — nem uma pasta de fora, nem o
  fonte dela própria —, e o que sobra sai **nomeado com o motivo**. Antes do LAB-47 esta
  regra não era falsa, era **não medida**: plantados cinco segredos de formato real num
  arquivo `src/`, o verde saiu **VERDE, 7 passos, 401 travas, exit 0**, com o `tsc` e o
  `eslint` lendo o arquivo e aprovando (D163). **Registro nenhum repete mais de doze
  caracteres** de um segredo — e menos ainda quando os doze primeiros são a senha e não o
  prefixo do formato.
- **Não decide urbanismo.** Regra urbanística é do Jonny: vira item em
  `docs/PENDENCIAS_JONNY.md`, não escolha minha.
- **Não contrata nada, e entre USO e MENSALIDADE escolhe USO** — regra de família
  do Jonny, 09/10/2026, *"todas as APIs Archilly, absolutamente todas, em todas as
  sessões"* (D239). Nenhuma sessão abre conta, cadastra chave ou inicia teste; o
  que a sessão entrega é a **comparação pronta**, e quem gasta é uma pessoa. O
  texto dele e o que a regra decide estão na **§4-A**, e **há guarda**
  (`tests/custo-por-uso.test.ts`).

---

## 4-A · Da família — cobrança por USO, nunca mensalidade

**Ordem direta do Jonny, 09/10/2026, trazida pelo chat no item 005 da caixa de entrada; gravada
como D239.** Vale para **todos** os aplicativos da família, todas as APIs e todas as sessões — a
palavra dele foi *"absolutamente todas"*. Está aqui porque o item mandou gravá-la **onde ela não
se perca**, e porque *o que vai ao chat e não vai a um arquivo não existe amanhã* (§1-B).

> **Entre uma API que cobra por USO e uma que cobra MENSALIDADE, escolhe-se a de uso — mesmo que
> o uso saia mais caro.**

As palavras dele, **literais**:

> *"Eu prefiro uma API que cobra por uso, mesmo que seja mais caro o uso, do que uma API que seja
> mensalidade. Isso vale para todas as APIs Archilly, todas, absolutamente todas, em todas as
> sessões. Melhor um custo mais alto, que quem vai pagar é o usuário e que a gente vai cobrar
> vezes 3, do que ter um custo mensal alto — porque daí fica me pressionando para arranjar
> cliente."*

> *"O Archilly está nascendo para resolver os meus problemas. Quando ele for para o mercado,
> ótimo e saudável, mas sem pressa de que eu saia de um cliente para cem."*

### O motivo não é financeiro, é de RITMO

**Custo fixo transforma a agenda do dono em cobrança por clientes.** Mensalidade paga-se igual
com um cliente e com trezentos: o custo nasce **antes** da receita, e cada mês sem venda vira
pressão para vender. Custo por uso nasce **junto** com a receita — sem cliente, não há conta.

> **Uma mensalidade contratada hoje é uma meta de vendas contratada junto.** É por isso que a
> regra vale **mesmo quando a mensalidade é a opção mais barata no papel.**

### O que ela decide, e as oito consequências estão declaradas em código

`external-engines/esteira/src/cobranca-por-uso.ts`, conferidas contra esta seção por trava:

1. **A ordenação é pelo custo na MENOR faixa de uso** — nunca por preço de tabela. Toda
   comparação de fonte paga traz **três linhas**: o custo por estudo com **3**, com **20** e com
   **200** clientes. A primeira decide se entra; as outras dizem quando passa a fazer sentido;
2. **Conta feita com o volume que se gostaria de ter é a forma mais educada de aprovar uma
   despesa que não se sustenta** — e isto foi medido **contra mim**, no mesmo dia: eu escrevi
   *"R$ 400 por mês ÷ 200 estudos = R$ 2 por estudo"* e ele corrigiu — com **três** clientes
   aquilo é **R$ 133 por estudo**. *O mesmo número aprovava e reprovava a despesa; só mudou a
   premissa de volume, que eu tinha inventado*;
3. **Custo por uso se repassa ao usuário com o multiplicador da família**, pela porta de créditos
   da Central, **declarando operação e nunca preço** — e **custo, fator e margem nunca chegam ao
   usuário comum** (a §4 já guarda isso, e a varredura é `tests/vazamento-de-custo.test.ts`);
4. **Franquia mínima é mensalidade com outro nome.** *"Pague só o que usar, com mínimo de
   R$ 100/mês"* é R$ 100/mês;
5. **Teste grátis que vira cobrança é mensalidade que começa depois.** Não se inicia — nem para
   testar;
6. **Cota gratuita de verdade não é mensalidade** e pode entrar, desde que o aplicativo **nunca**
   ultrapasse a faixa livre sozinho;
7. **Fonte paga tem de poder ser ligada e desligada por recorte** — por estado, por conta, por
   operação —, **sem tocar em código**: é o que permite acender só onde há cliente. Isto é
   **estrutura, não despesa**;
8. **Nenhuma sessão contrata nada.** Não abre conta, não cadastra chave, não inicia teste. A
   decisão de gastar é de **uma pessoa**, fonte a fonte.

### A MINHA TRAVA É DE PALAVRA, NÃO DE ESTRUTURA — e isto está medido (item 006)

A Pesquisa de Mercado mediu e o chat trouxe a lição que vale mais que a regra:

> **Não escreva "recusar mensalidade" numa conferência. Tire o campo onde a mensalidade caberia.
> Campo que não existe não se esquece.**

**A minha é de palavra**, e o preço disso está contado: dos **doze** compromissos mensais de
formato real declarados em `src/trava-de-estrutura.ts`, a régua de palavra pega **quatro** —
**8 dos 12 escapam**, entre eles *"compromisso mínimo de 50 chamadas por mês"*, *"contrato anual
com faturamento recorrente"* e *"teste de 14 dias, cartão obrigatório"*.

**O exemplo do item estava errado a meu respeito, e a conclusão dele certa:** ele disse que
*"franquia mínima e teste grátis passam por qualquer varredura de texto"* — na minha **não
passam**, há padrão para os dois. Medido, o problema é **pior** do que o exemplo: são outros oito.

### E a resposta de ESTRUTURA aqui é "não há onde"

**Varrido todo o `.ts` que o git carrega: nenhum campo de recorrência declarado em tipo nenhum.**
Não existe neste aplicativo um tipo que represente preço de fonte paga — não há mensalidade,
franquia nem mínimo a tirar, porque não há onde eles caberiam. *Resposta válida, e o item diz
que é.*

**A régua de estrutura casa DECLARAÇÃO DE CAMPO, não menção** — e foi preciso: `assinatura`
aparece **sete vezes** aqui e é a **assinatura de determinismo** de uma rodada do motor. E ela
perdeu dois nomes por medição: `plano` e `planoId` saíram depois de acusarem `plano: Plano` —
**o plano de loteamento**, o objeto central deste repositório (D240).

> **A régua de estrutura não é imune ao defeito da régua de palavra:** *campo cujo NOME eu
> adivinhei* tem a mesma doença, só mudada de lugar — do texto para o identificador.

### O que a guarda NÃO pega, e isto fica dito

**Não há nada pago neste repositório hoje** — a trava do custo já mede isso no `import` e na
chamada. Então a varredura de palavra só alcança **texto**: um compromisso mensal **escrito** num
arquivo que o git carrega. **Contratar de verdade acontece fora da árvore**, num navegador, com
um cartão, e nenhuma régua daqui alcança. *Guarda que não declara o próprio buraco mente pelo
silêncio* — a consequência nº 8 existe exatamente porque este buraco não fecha com código.

**E as CONDIÇÕES DE VOLTA foram varridas:** são **quinze** condições de abertura declaradas na
`FILA.md`, e **nenhuma é uma conta** — todas esperam pessoa, repositório, prompt novo ou medição
(`prompt-novo`, `nao-medido`, `aguardando-outro-repositorio`, `escopo-novo`, `depois-do-mvp`,
`aguardando-o-jonny`). **Zero** falam de volume, de ponto de equilíbrio ou de *"quando
compensar"* — e zero é resposta, medida, não suposta.

---

## 5 · Nomes

**"Testfit" é nome interno** — repositório, código, sessão, relatório técnico.
Em texto voltado ao usuário (inclusive `docs/PENDENCIAS_JONNY.md`) ele se chama
**Laboratório de Parcelamento**.

`docs/PENDENCIAS_JONNY.md` é escrito **para leigo**: o Jonny é arquiteto e
urbanista, não programador. Item resolvido é marcado, **nunca apagado**. Dívida
técnica do código não entra ali — essa é minha.

---

## 6 · Medir antes de atribuir

A disciplina que mais rendeu até aqui, e a razão de duas conclusões erradas
terem sido desfeitas a tempo:

> **Resultado suspeito se mede antes de ter culpado.**

No LAB-07, "441 de 441 lotes sem frente" parecia defeito grave do motor; medida
a distância do lote ao eixo, era **bug do adaptador** (D18). No LAB-01, o relevo
em terraços parecia dado ruim; medido, era o **interpolador do próprio Lab**.
Nos dois casos a atribuição apressada teria virado item de conserto no
repositório errado.

Resultado desconfortável é resultado: "não consegui compilar" está registrado no
`SYMBIOS_ANALYSIS.md`, §10.

**O ponto cego tem forma, e ela já se repetiu DEZENOVE vezes** — sempre *o Lab a um
passo de acusar o motor de um vizinho por um defeito do Lab*:

| quando | o que eu ia dizer | o que era |
|---|---|---|
| D18 (LAB-07) | "441 de 441 lotes sem frente" | distância medida errado pelo adaptador |
| D75 (LAB-17) | "o motor erra a classe da via desenhada" | a régua media **vértice**, não linha |
| D93/D94 (LAB-21) | "o motor entrega rampa de 161 %" | a régua media **dentro** do segmento |
| D98 (LAB-22) | "o Parcelamento não reporta o pico" | a **ponte do Lab** jogava a medição dele fora |
| D119 (LAB-30) | "o motor ignora a via desenhada" | a **ida do Lab** nunca entregava a via |
| D127/D128 (LAB-32) | "entreguei a via e ele passou a segui-la menos" | a régua media uma coisa **que o motor não promete** |
| D133 (LAB-34) | "a ordem dos motores muda em 4 das 5 glebas" | em parte **faltava dado**, não mudava a ordem |
| D135 (LAB-35) | "a ida não entrega o furo da gleba" | o furo mora em **`terreno.gleba.furos`**, e o caminho errado era do meu teste |
| D137 (LAB-36) | "um terço das provas viola a §7" | a régua exigia a chave `"gleba"` **literal** e media **ortografia**, não conteúdo |
| D142 (LAB-38) | "este teste importa do Generate e não podia" | a régua leu **menção** da palavra, e não o `import` |
| D148 (LAB-40) | "aqui a entrega da testada não custa lote" | a régua comparou dois partidos pelo **rótulo** da variante |
| D155 (LAB-43) | "esta ferramenta ainda escreve o literal do contrato" | a régua leu o **comentário** que explicava o conserto |
| D161 (LAB-46) | "os 33 lotes são todos da beira da rua existente" | eu contei o **id** `-eN`, e só **14 de 33** encostam |
| D166 (LAB-48) | "o motor padrão desenha 47 lotes com testada abaixo da mínima" | **36 dos 47**: a minha ponte escreveu o **ALVO** sorteado no campo cujo nome é **MÍNIMO** |
| D185 (LAB-54) | "oito das 27 estão a 0,2 m ou menos da borda do leito" | **cinco** — e a lista com os números estava **impressa na linha de cima do próprio relatório** |
| D190 (LAB-55) | "a hierarquia da via culpada não é observável de fora" | ela mora na **SAÍDA**; eu a li no `resultado` **interno** do Generate e saiu `null` em 4 de 4 |
| D217 (08/10) | "o LAB-13 e o LAB-14 não têm recado no arquivo" | têm **um recado para os dois**, e a régua casava o nome **exato** — o acusado era o **precedente** da regra nova |
| D231 (item 003) | "o LAB-68 e o LAB-69 não têm recado no arquivo" | têm: a **ferramenta** ainda casava `— Lab · ` literal, e o conserto do D228 só entrou na **trava** |
| D240 (item 006) | "há campo de mensalidade em `volta.ts`" | é `plano: Plano` — **o plano de loteamento**, o objeto central desta casa: a régua de ESTRUTURA adivinhou o nome |

A quarta foi diferente das três primeiras: não houve erro de conta, houve um
**comentário envelhecendo em silêncio**. Daí a guarda do §4 — e a quarta vez
dessa forma, o `faceDeRua` do D104, **não fui eu que achei: foi ela**.

**A quinta é a mais cara: já tinha saído para o chat**, duas vezes, como defeito
do motor do vizinho (D119). **A sexta tem lição nova:** antes de eleger a régua,
perguntar *"o que este campo faz no motor?"* — `viaManual` dá o **ângulo** do
partido e bloqueia a **faixa** da linha; nunca prometeu pôr rua em cima dela, e
medir obediência pela promessa errada faz o obediente parecer desobediente.

**As dezenove, classificadas, e a soma fecha** — cada linha da tabela em exatamente uma
classe, com a decisão nomeada para qualquer um refazer a conta:

| quantas | a classe | quais |
|---|---|---|
| **DEZ** | régua minha acusando a si mesma | D75, D93/D94, D127/D128, D137, D142, D148, D155, D217, D231, D240 |
| **QUATRO** | a ponte ou a ida do Lab corrompendo a medição | D18, D98, D119, D166 |
| **DUAS** | caminho errado de leitura | D135, D190 |
| **DUAS** | a minha cabeça, contando de memória o que estava impresso ao lado | D161, D185 |
| **UMA** | dado que faltava, e não número que mudou | D133 |

10 + 4 + 2 + 2 + 1 = **19**. **Esta linha dizia "NOVE foram réguas minhas, duas foram a ponte e
três foram caminho errado" até 08/10/2026, e 9 + 2 + 3 = 14:** duas das dezesseis não tinham
classe, e a frase se lia como partição. Medido e refeito no LAB-63, com guarda que soma
(D212). Ela também citava **D104** e **D175** como membros, e nenhuma das duas é linha da
tabela — elas são decisões *irmãs*, citadas no texto abaixo, e não ocorrências do ponto cego.

**TREZE** foram pegas **dentro do próprio prompt**, antes de sair (D128, D133, D135, D137, D142,
D148, D155, D166, D185, D190, D217, D231, D240).

**A décima oitava é a nona da sub-família da régua que varre texto, e ela tem lição nova: o
conserto entrou em UM instrumento só.** A Central mandou o `<app>` do cabeçalho virar o nome do
aplicativo; a **trava** aprendeu no mesmo dia (D228) e a **ferramenta** não, porque ela não roda
no verde. Resultado medido no item 003: a trava **verde** e a ferramenta acusando `LAB-68, LAB-69`
de não terem recado — e os dois **têm**. *Conserto de régua que não é aplicado em todos os
instrumentos que leem a mesma coisa é meio conserto, e o instrumento que ficou de fora passa a
mentir com a autoridade de quem conferia* (D231). O que isto fecha está escrito num lugar só:
[`docs/referencia/FERRAMENTA_E_TRAVA.md`](docs/referencia/FERRAMENTA_E_TRAVA.md).

**A décima nona fecha um ciclo que começou no mesmo dia, e é a lição mais útil do item 006:** a
Pesquisa mandou *"não escreva 'recusar mensalidade' numa conferência — tire o campo onde ela
caberia; campo que não existe não se esquece"*. Certo. Mas a régua de **estrutura** que eu
escrevi para isso incluiu `plano` entre os nomes de recorrência e **acusou `plano: Plano`**, duas
vezes, em `testfit/adapter/src/volta.ts` — **o plano de loteamento, o objeto central deste
repositório inteiro.** *A régua de estrutura não é imune ao defeito da régua de palavra: campo
cujo NOME eu adivinhei tem a mesma doença, só mudada de lugar — do texto para o identificador*
(D240). Os dois nomes ambíguos saíram, e ficaram só os que não têm outro significado nesta casa.

**A décima sexta é a terceira da família do CAMINHO, e a segunda do lado ruim dela:** o
caminho errado **não estourou, devolveu `null`** — e `null` num campo que *classifica* não
fica quieto, vira frase no relatório. *Caminho errado que devolve `null` é uma acusação
publicável, e quando o campo é o que classifica, a acusação é contra quem publica o campo*
(D175, D190).

**A décima quinta é a mais simples e a mais humilhante:** eu contei **de cabeça** uma lista
que estava **impressa na linha de cima** do meu próprio relatório, e publiquei *"oito"* onde
eram *"cinco"*. Não foi régua errada, não foi caminho errado, não foi comentário
envelhecendo. *Número que o próprio relatório lista ao lado não se escreve de memória* — e
ela foi corrigida **riscando**, com a medição ao lado (D161, D185).

**A décima quarta é a mais caseira de todas, e é a que mais explica:** a entrada declarava
testada mínima de **10 m**, a minha ida sorteava o **alvo** da variante numa faixa, e a minha
volta escrevia esse alvo em `testadaMinLote_m` — **o campo cujo nome é mínimo**. O Validator
então media o motor contra **o próprio alvo dele**, com 2 % de folga, e o acusava por
**1,94 cm** em lotes de 316 m². *Campo cujo nome diz MÍNIMO e cujo valor é um ALVO não é um
campo errado: é uma acusação automática.*

**A décima terceira é a exceção, e é a mais cara desde o D119: ela JÁ TINHA SAÍDO** — no
relatório do LAB-45, no recado ao chat e na página do Jonny. Eu disse que os 33 lotes de
Antonina eram *"todos da beira da rua que já existe"* contando o **id** `-eN` do motor;
medido, **14 de 33** encostam, e o mais distante está a **1 805,7 m**. Foi corrigida com
a medição ao lado, não apagada (D161).

**E três delas são a MESMA sub-família** — régua que varre código e casa o nome no lugar
errado da gramática (D137, D142, D155). A terceira reprovou o arquivo que eu **acabara de
consertar**, porque o comentário do conserto **citava** o defeito: varredura estática em
texto de código mede **o que o código faz** e **o que ele diz sobre si**, e só uma delas é
o objeto.

**A regra que as dezenove ensinam, e ela é curta:**

> **Antes de acusar a ponte de não entregar, confira o CAMINHO e a FORMA do que
> você está lendo**; antes de dizer que um número mudou, confira se ele
> **existe**; e antes de acusar em volume, pergunte se a sua régua aceita os
> **nomes que a coisa de fato usa** — régua que casa por nome exato mede
> ortografia, não conteúdo — e quando a régua procura um nome em código, procure-o
> **no lugar da gramática onde ele significa aquilo** (num `import`, não no arquivo
> inteiro); e antes de comparar duas medições, confira se o que você casou é a
> **coisa** ou só a **etiqueta** dela — posição num ranking é rótulo, e rótulo não é
> identidade; e antes de acusar um motor de **furar um limite**, confira **quem escreveu o
> limite** que a régua está usando — três vezes o número acusador saiu da minha própria ponte
> e não de quem declarou a regra (D98, D104, D166); e quando a régua varre CÓDIGO, tire os comentários antes — comentário é
> onde um nome significa *"eu estou falando sobre"*, não *"eu faço"*; e quando você for
> dizer **onde** uma coisa está, meça a **distância** — id, prefixo e nome de passagem são
> rótulo, e três das dezenove vezes eu classifiquei pelo nome em vez de medir (D148, D155,
> D161); e quando o número já está impresso ao lado, **conte a lista, não a memória** (D185).
> **Dezenove de dezenove vezes o defeito estava do MEU lado — na régua, na ponte, no
> caminho ou na minha cabeça — antes de estar no medido**, e em sete delas a régua era o teste
> que eu acabara de escrever.

**E há um irmão do ponto cego que não é defeito meu nem do medido, e custa igual** (D184):
**régua que erra o RÓTULO e acerta o VEREDICTO não é régua errada.** Eu estava a um passo de
abrir um conserto na régua do Generate por *"errar em 11 das 56"*, e medido o saldo o conserto
derrubaria **zero** violações — as 11 só trocariam `frente` por `testada`. *Medir o SALDO
antes de propor o conserto* é o que separa um item de contagem de um item de mensagem.

---

## 7 · Entrega

Todo prompt fecha com: relatório em `docs/relatorios/`, provas em
`docs/provas/`, decisões numeradas em `docs/DECISOES.md` com o porquê,
`docs/prompts/FILA.md`, `docs/ONDE_PARAMOS.md` e `docs/INDEX.md` atualizados,
testes verdes, e **PR mesclado na `main`**. Relatório não volta para o chat —
volta o RECADO, que também é acrescentado ao `RECADOS.md`.

Medição é **em metros** e **em dados**: JSON em `docs/provas/<prompt>/`, e **toda
prova que mede uma gleba** traz gleba, motor, semente e versão do contrato, com
determinismo provado.

**A regra vale para prova de MEDIÇÃO, e a diferença é guardada** (LAB-36): há provas
que não medem gleba nenhuma — o oráculo de geometria do LAB-04, a varredura de
declarações do LAB-26, a prova no navegador e a da sabotagem do LAB-31, o formato
proposto do LAB-24. Elas estão numa **lista declarada de exceções**, cada uma com o
motivo, e a guarda reprova em dois casos: prova de medição sem as chaves, e exceção
na lista que **deixou de precisar** ser exceção. Lista que não se revalida envelhece
igual a comentário (D104) — até o LAB-36 esta regra dizia *"em cada arquivo"* e era
**falsa em 8 de 32**.

Duas pilhas convivem, de propósito (D14, D17): o adaptador do Symbios roda em
**Node 22+ sem dependência npm**; o do LAB-07 roda em **Bun**, porque compila
fonte TypeScript de três repositórios ao mesmo tempo.

**"Verde" é UM comando, e ele roda tudo:**

```sh
./external-engines/conferir.sh
```

Sete passos: `typecheck`, `lint` e `test` em **`esteira`** e em **`testfit`**, mais a
**prova no navegador** — o `.wasm` do Symbios carregando em Chromium de verdade. Antes
dos sete, duas guardas:

- **cobertura** — o script **descobre** todo `package.json` do repositório e **reprova**
  se achar um que não esteja na lista dele (D122). Pacote novo não nasce de fora;
- **precondição** — o `.wasm` não é versionado, e se faltar o script **reprova com a
  receita de compilá-lo**, nunca "pula" (D124).

E ele **roda todos os passos mesmo depois de um falhar**: quem conserta quer a lista
inteira, não o primeiro erro.

**Nada fica fora dele.** Duas vezes "testes verdes" foi meia verdade aqui: a suíte do
`testfit` ficou **vermelha, 14 de 14, por duas semanas** porque eu rodava só o outro
pacote, e dois daqueles testes eram as travas das minhas próprias correções (D110); e a
prova no navegador, cuja última etapa era **ler os números com o olho**, rodou **uma
vez em 10/09/2026** e nunca mais (D123). Suíte que ninguém roda não protege nada — e
ainda cala os alarmes que ela mesma tinha.

Que ele **reprova** está provado por sabotagem, não por confiança: um teste quebrado de
propósito em cada frente, `exit 0 → exit 1` (D126, `docs/provas/LAB-31/sabotagem.json`).

**E desde o LAB-38 existe CI** (`.github/workflows/verde.yml`), com **dois trabalhos e
nomes que não enganam** (D141):

- **`guardas que não precisam dos clones vizinhos (NÃO é o verde)`** roda em todo push,
  sem segredo: as 336 travas que leem arquivo do próprio repositório — página do Jonny
  atualizada, formato do RECADO, cobertura do `conferir.sh`, as regras desta página — e
  as de geometria pura. É pouco em número e **muito** em tipo de apodrecimento;
- **`o verde completo`** precisa do segredo `VIZINHOS_TOKEN`, porque o comando único lê
  **dois clones privados** por caminho (D16) e este repositório é público: o
  `GITHUB_TOKEN` do Actions não os alcança. Sem o segredo ele **falha com a receita**, e
  **não pula** (D124).

> **Um CI vermelho por falta de configuração é honesto; um CI verde que não roda o verde
> é a mentira que o D110 custou duas semanas.**

Enquanto o segredo não existir, **quem roda o verde completo sou eu, antes do commit**.

### 🔴 A EXECUÇÃO AUTOMÁTICA DO CI ESTÁ DESLIGADA desde 08/10/2026

O orçamento de Actions da **família** estourou e o Jonny decidiu não comprar mais; a cota zera
em **1º/11/2026**. O gatilho de `push`/`pull_request` está **comentado** e a rotina está
**`disabled_manually`** no GitHub. **A receita de religar mora num lugar só:**
[`docs/COMO_RELIGAR_O_CI.md`](docs/COMO_RELIGAR_O_CI.md) — e **são DOIS passos**, descomentar
**e** reabilitar; quem fizer só o primeiro vai concluir que o GitHub está quebrado.

**A parte deste repositório no estouro é ZERO, e isso é medição, não desculpa:** `archilly-lab`
é **público**, e Actions em `ubuntu-latest` é gratuito e não medido em repositório público —
**136 execuções, 272 trabalhos, 272 minutos, 272 de 272 em `ubuntu-latest`**. Desligado assim
mesmo, por ordem da família e porque **metade desses minutos era desperdício puro** (D220).

**Toda entrega passa a declarar "conferido aqui, não no GitHub".** *Verde na mão e verde na
nuvem são afirmações diferentes.* **Há trava** (`tests/gatilho-do-verde.test.ts`): ela cobra a
receita enquanto o gatilho estiver comentado, cobra que o aviso SAIA quando ele voltar, e
**REPROVA a partir de 1º/11/2026** — *desligamento sem prazo vira desligamento permanente.*

### UM ENVIO POR ENTREGA — os commits de uma entrega vão num `push` só

**Medido na família:** o Render enviou **131 vezes em 5 dias** para cerca de **7 entregas** —
relatório, memória e recado em envios separados, cada um pagando uma bateria inteira. Medido
aqui: **136 execuções para 92 commits**, e **44 commits rodaram duas vezes** porque `push` e
`pull_request` disparam no mesmo SHA.

> **Nenhum desenho de rotina compensa enviar de commit em commit.** A maior alavanca não é o
> desenho da rotina, é o **número de envios**.

Commitar quantas vezes quiser é de graça; **`git push` é que custa**. Os commits de uma entrega
— código, prova, relatório, decisão, recado — saem em **um envio só**, no fim.
