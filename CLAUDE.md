# CLAUDE.md — Archilly Lab

Regras permanentes deste repositório. **Leia antes de qualquer tarefa e obedeça em todas as
sessões.** Ao acordar: `docs/ONDE_PARAMOS.md` → `git log` → `docs/prompts/FILA.md` →
`docs/PENDENCIAS_JONNY.md`.

> **A HISTÓRIA de cada regra mora em [`docs/HISTORIA_DAS_REGRAS.md`](docs/HISTORIA_DAS_REGRAS.md)**
> — medições datadas, números de então, hipóteses descartadas, tabelas e trechos riscados. Aqui
> fica **só o que a sessão precisa para trabalhar hoje**, e cada regra aponta para a sua história.
> *Nenhuma regra saiu; o que saiu foi o relato* (item 028, LAB-95).

---

## 1 · A regra do RECADO — UM BLOCO SÓ por rodada

**Toda resposta sua para o chat é UM único bloco de código, e nada fora dele** — nem texto na
conversa acima, nem despedida, nem pergunta, nem link solto, nem um segundo bloco.

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

- **O recado vem PRIMEIRO**; tudo o mais vai **no mesmo bloco**, abaixo da linha de marca.
- **O teto de doze linhas é do RECADO, não do bloco:** o bloco pode ser longo, e **partir o bloco
  para caber nas doze linhas é o defeito, não o conserto**. Doze linhas é teto DO RECADO, não meta.
- **`<app>` é `MOTOR LAB (archilly-lab)`**, nunca `Lab`. **`<prompt>`** é o prompt em execução
  (`LAB-07`, `T-35` — a forma, não a sigla) **ou uma das seis classes de rodada**:
  `despertador-sem-item`, `fila-esgotada`, `fila-recusada`, `decisao-registrada`,
  `recado-recuperado`, `fora-de-fila`.
- **Linha sem conteúdo leva `—`, nunca some.**
- **Mais de um prompt sem ele voltar:** o bloco abre com `ACUMULADO — inclui os recados X, Y`.
- **O mesmo recado vai a [`docs/relatorios/RECADOS.md`](docs/relatorios/RECADOS.md)**, com data, em
  ordem, **inteiro e um por prompt**. *Recado que foi ao chat e não foi ao arquivo não existe
  amanhã.*

Vale para toda resposta, inclusive quando ela é só "não deu". *(história: §H1)*

---

## 1-C · Da Central — o texto da regra, gravado como veio

**Mandado pela Central em 08/10/2026, literal. Quando as duas divergirem, manda esta.**

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

**Esta regra é comportamento de sessão e NÃO espera o kit:** ela vale assim mesmo, e o kit,
quando chegar, é outro item.

**O Padrão Archilly NÃO MORA AQUI:** `docs/referencia/PADRAO_ARCHILLY.md` é **ponteiro**, e a
procedência — onde está, qual commit e qual **blob** foram lidos e quando — mora num lugar só,
`src/onde-esta-o-padrao.ts`. O `VERSAO.txt` não existe nesta árvore. *Documento normativo que esta
casa não pode manter atualizado não deve morar nela.*

> **REGRA DE FORMA SEM O SUJEITO ESCRITO MANDA NA COISA ERRADA.** Toda regra de forma desta página
> diz **de que** é o limite (`tests/limites-com-sujeito.test.ts`).

*(história: §H2)*

---

## 1-B · O BALANÇO vai para um arquivo

**Balanço é resposta que faz as contas** — de uma fila que acabou, de um conjunto de dívidas, do
estado do repositório; não é relatório de prompt nem recado de entrega.

- **Todo balanço é acrescentado a
  [`docs/relatorios/BALANCOS.md`](docs/relatorios/BALANCOS.md)**, com data, origem, o que continha,
  o que produziu e onde está a prova.
- **Balanço que já mora num recado não se copia:** entra no índice apontando para a seção do
  `RECADOS.md`.
- **Reconstrução sai etiquetada como reconstrução**, com a fonte de cada linha — e **balanço
  recuperado se confere, não se obedece.**

> **O que vai ao chat e não vai a um arquivo não existe amanhã.**

*(história: §H3)*

---

## 1-A · A fila é autônoma

`docs/prompts/FILA.md` é a fila oficial; a **ida** vem da caixa de entrada, escrita pelo chat. Esta
casa executa **sozinha, em laço**, acordada por **um** despertador cujo id vive em
`docs/ONDE_PARAMOS.md`, não aqui. Regra de família: **um despertador por aplicativo; nunca se toca
no de outro repositório.**

- **Um prompt por despertador.** Se o anterior não fechou, termine-o primeiro.
- **Prompt fora da fila não existe:** o que faltar entra como *"proposto ao chat"*, sem executar.
  **Não ampliar escopo.**
- O que depende do Jonny ou de outro repositório fica **"aguardando"**: pular para o seguinte e
  reavaliar a cada despertador.
- **Disparo sem item pronto: ANOTE A DATA, responda em UMA linha e DURMA — NÃO DESLIGUE** (D244). A
  data vai na conta dos disparos em vazio do `ONDE_PARAMOS.md`, o recado de uma linha vai ao
  `RECADOS.md` e ao chat, e **o despertador fica como está** — *ligar e desligar é do chat; o meu
  trabalho é a conta.*
- **A regra mora em DOIS lugares que apontam um para o outro:** aqui e na
  [`docs/caixa-de-entrada/COMO_FUNCIONA.md`](docs/caixa-de-entrada/COMO_FUNCIONA.md).
- **Sem `mcp__github__*` ao acordar**, mesclar por git direto (`git merge --no-ff` na `main`) e
  **declarar isso no relatório e no recado** (D29).

**~~DESLIGAR o despertador~~ era a regra até 09/10/2026 e estava CERTA quando nasceu:** o
desligamento **era o aviso** de que a fila havia esgotado. Deixou de valer quando o chat passou a
escrever direto na caixa — *despertador desligado nunca pega o item que o chat escrever depois.*

> **REGRA QUE DEIXOU DE PROTEGER E PASSOU A TRAVAR NÃO MUDOU DE TEXTO — MUDOU O MUNDO EMBAIXO
> DELA.** Pergunte **que serviço ela presta hoje.**

*(história: §H4)*

---

## 2 · O que é este repositório

Laboratório de motores de loteamento para o **Archilly Generate**. A hipótese: motores externos
podem alimentar o Generate, no todo ou em partes, atrás de um adaptador isolado, **sempre passando
pelo Validator e pelo Judge dele**.

**Onde mora cada coisa:** `docs/INDEX.md` o índice de tudo · `docs/ONDE_PARAMOS.md` o estado —
comece aqui · **`docs/HISTORIA_DAS_REGRAS.md` a história das regras desta página** ·
`docs/prompts/FILA.md` o roteiro · `docs/caixa-de-entrada/` a ida · `docs/PENDENCIAS_JONNY.md` o
que depende de uma pessoa · `docs/DECISOES.md` as decisões numeradas · `docs/referencia/LABORATORIO.md`
a especificação · `docs/relatorios/` as medições, uma por prompt · `.../RECADOS.md` os recados em
ordem · `.../BALANCOS.md` os balanços (§1-B) · `docs/provas/` os números crus em JSON.

A família: **Geo** (`urban-scout-tool`) capta o terreno · **Generate**
(`urban-create-hub-41d93a4d`) gera, valida e julga · **Laboratório de Parcelamento**
(`motor-testfit`) gera ao vivo na tela · **este Lab** testa motores candidatos. *(história: §H5)*

---

## 3 · A regra de ouro

`upstream/` (original, intocado) → `archilly/` (cópia de trabalho) → `adapter/` (ponte) → Generate.

1. **`upstream/` é intocável:** cópia exata do motor original, commit e data em `VERSION`. Não se
   edita, não se aplica patch, não se "corrige".
2. **O trabalho acontece em `archilly/`**, documentado.
3. **`adapter/` é a única fronteira:** só ele conhece detalhes do motor.
4. **O Generate nunca depende disto:** `external-engines/` pode ser apagado sem que ele sinta.

**Exceção medida (D16):** motor **da própria família não ganha `upstream/`** — é lido por caminho,
do clone irmão, e o caminho vive num lugar só: os `paths` do `tsconfig.json`. *(história: §H6)*

---

## 4 · O que este repositório NUNCA faz

- **Não escreve em repositório vizinho:** os clones são **somente para leitura**; conferir com
  `git status` ao fim de toda rodada e dizer no relatório que ficou limpo. **O que precisa mudar no
  vizinho vira lista numerada em relatório**, nunca commit lá.
- **Não tem interface — com UMA exceção, declarada:** a bancada da prova no navegador
  (`symbios/adapter/ferramentas/navegador/index.html`). **Há guarda contando os HTML.**
- **Não reimplementa o Validator nem o Judge:** são importados do Generate, sem versão leve e sem
  limiar mais frouxo por ser de fora (D20).
- **Não conserta geometria em silêncio:** conserto do Lab é **declarado**, vem **desligado por
  padrão**, e a medição sai **nas duas passagens**, com e sem.
- **Não inventa dado:** o que o motor não mede sai `null`, nunca zero — zero é uma medição (D23).
- **Não descarta em silêncio campo que o motor publica:** todo campo tem destino escrito em
  `src/inventario-das-pontes.ts` — *atravessa*, *traduzido*, *perda declarada* ou *mecânica
  interna* —, e a `guarda-da-ponte.ts` o confere **contra o motor rodando**. **O motivo de uma perda
  não mora em comentário:** comentário não se revalida (D98, D104).
- **Não carrega segredo na árvore:** nenhum valor literal de chave, token, senha ou credencial em
  arquivo que o git carregue. Há varredura (`src/varredura-de-segredos.ts`) sobre **tudo que o git
  carrega**, e o que sobra sai **nomeado com o motivo**. **Registro nenhum repete mais de doze
  caracteres** de um segredo.
- **Não decide urbanismo:** regra urbanística é do Jonny — vira item em `docs/PENDENCIAS_JONNY.md`.
- **Não contrata nada, e entre USO e MENSALIDADE escolhe USO** (D239, §4-A): nenhuma sessão abre
  conta, cadastra chave ou inicia teste. A sessão entrega a **comparação pronta**; quem gasta é uma
  pessoa.

*(história: §H7)*

---

## 4-A · Da família — cobrança por USO, nunca mensalidade

**Ordem direta do Jonny, 09/10/2026, gravada como D239.** Vale para **todos** os aplicativos da
família, todas as APIs e todas as sessões — a palavra dele foi *"absolutamente todas"*.

> **Entre uma API que cobra por USO e uma que cobra MENSALIDADE, escolhe-se a de uso — mesmo que o
> uso saia mais caro.**

As palavras dele, literais:

> *"Eu prefiro uma API que cobra por uso, mesmo que seja mais caro o uso, do que uma API que seja
> mensalidade. Isso vale para todas as APIs Archilly, todas, absolutamente todas, em todas as
> sessões. Melhor um custo mais alto, que quem vai pagar é o usuário e que a gente vai cobrar vezes
> 3, do que ter um custo mensal alto — porque daí fica me pressionando para arranjar cliente."*

**O motivo é de RITMO:** mensalidade paga-se igual com um cliente e com trezentos, e cada mês sem
venda vira pressão para vender. *Uma mensalidade contratada hoje é uma meta de vendas contratada
junto* — por isso a regra vale **mesmo quando a mensalidade é mais barata no papel.**

**As oito consequências** (em `src/cobranca-por-uso.ts`, conferidas contra esta seção):

1. **a ordenação é pelo custo na MENOR faixa de uso**, nunca por tabela: toda comparação traz
   **três** linhas — com **3**, **20** e **200** clientes;
2. conta com o volume que se gostaria de ter é **a forma mais educada de aprovar uma despesa que
   não se sustenta**: eu escrevi *"R$ 2 por estudo"* e com três clientes aquilo é **R$ 133**;
3. repassa-se pela porta de créditos da Central, **declarando operação e nunca preço**;
4. **franquia mínima é mensalidade com outro nome**;
5. teste grátis que vira cobrança é **mensalidade que começa depois**: não se inicia;
6. **cota gratuita de verdade não é mensalidade**, se o aplicativo nunca ultrapassar a faixa livre;
7. fonte paga tem de poder ser **ligada e desligada por recorte**, sem tocar em código;
8. **nenhuma sessão contrata nada:** quem decide gastar é **uma pessoa**, fonte a fonte.

**A minha trava é de palavra, não de estrutura, e está medido:** dos doze compromissos mensais de
`src/trava-de-estrutura.ts`, a régua pega quatro — **8 dos 12 escapam**. *Não escreva "recusar
mensalidade" numa conferência; tire o campo onde ela caberia — **campo que não existe não se
esquece***. A resposta de estrutura aqui é **"não há onde"**: nenhum campo de recorrência declarado.
**E o que a guarda NÃO pega:** **não há nada pago neste repositório hoje**, então ela só alcança
**texto** — contratar acontece **fora da árvore**, num navegador, com um cartão. *Guarda que não
declara o próprio buraco mente pelo silêncio.*

*(história: §H8)*

---

## 5 · Nomes

**"Testfit" é nome interno** — repositório, código, sessão, relatório técnico. Em texto voltado ao
usuário (inclusive `docs/PENDENCIAS_JONNY.md`) ele se chama **Laboratório de Parcelamento**.

`docs/PENDENCIAS_JONNY.md` é escrito **para leigo**: o Jonny é arquiteto e urbanista, não
programador. **Item resolvido é marcado, nunca apagado.** Dívida técnica do código não entra ali.
*(história: §H9)*

---

## 6 · Medir antes de atribuir

> **Resultado suspeito se mede antes de ter culpado** — e resultado desconfortável é resultado.

**O ponto cego desta casa já se repetiu TRINTA E TRÊS vezes**, sempre *o Lab a um passo de acusar o
motor de um vizinho por um defeito do Lab*: **trinta e três de trinta e três vezes o defeito estava
do meu lado** — régua, ponte, caminho, minha cabeça, instrumento ou leitura tomada por medição —, e
em doze delas a régua era o teste que eu acabara de escrever. **A tabela das trinta e três e a
aritmética que fecha moram na história, e lá são cobradas por trava**
(`tests/aritmetica-da-regra.test.ts`).

**Antes de atribuir, a lista:**

- **confira o CAMINHO e a FORMA do que você lê** antes de acusar a ponte (D18, D119);
- **número que mudou: confira se ele existe** (D133);
- **régua que casa por nome exato mede ortografia** (D137); em código, procure o nome no `import`
  (D142, D257), e **tire os comentários antes** (D155);
- **rótulo não é identidade: meça a distância** (D148, D161);
- **confira quem escreveu o limite** antes de acusar quem o furou (D98, D166);
- **número impresso ao lado se conta, não se lembra** (D185);
- **frase de `.md` se lê pelo normalizador de `src/texto-das-regras.ts`**, nunca à mão (D248, D304);
- **booleano responde ONDE; só o quanto responde DE QUEM** (D254);
- **régua nova nasce com a doença que a velha já curou, um campo ao lado** (D263);
- **a prova de uma régua não repete o que a régua proíbe** (D262);
- **em clone raso o `git log` responde o CORTE; o blob identifica o texto** (D293, D294), e ao clone
  pode faltar **função inteira** (D315);
- **leitura de fonte é hipótese; rodada é dado** (D308);
- **prefixo mede onde o arquivo mora; a pergunta era o que ele ALCANÇA** (D310);
- **número em vários lugares se cobra contra a MEDIÇÃO** — *consistência não é correção* (D311);
- **régua do vizinho com nome de uma só condição: leia o critério inteiro** (D314);
- **instrumento mais estreito que o medido dá o número para o lado otimista** (D266);
- **meça o SALDO antes de propor conserto:** errar o rótulo e acertar o veredicto não é errar (D184).

*(história: §H10 — as trinta e três, uma a uma, com o que eu ia dizer e o que era)*

---

## 7 · Entrega

**Todo prompt fecha com:** relatório em `docs/relatorios/`, provas em `docs/provas/`, decisões
numeradas em `docs/DECISOES.md` com o porquê, `FILA.md`, `ONDE_PARAMOS.md` e `INDEX.md`
atualizados, testes verdes, e **PR mesclado na `main`**. Relatório não volta ao chat — volta o
RECADO, que também vai ao `RECADOS.md`.

**Medição é em metros e em dados:** JSON em `docs/provas/<prompt>/`, e **toda prova que mede uma
gleba** traz gleba, motor, semente e versão do contrato, com determinismo provado. **Prova que não
mede gleba entra numa lista declarada de exceções**, com o motivo, e a guarda reprova nos dois
sentidos: prova de medição sem as chaves, e exceção que **deixou de precisar** ser exceção.

**Duas pilhas convivem, de propósito** (D14, D17): o Symbios roda em **Node 22+ sem dependência
npm**; o do LAB-07, em **Bun**, porque compila fonte de três repositórios ao mesmo tempo.

**"Verde" é UM comando, e ele roda tudo:**

```sh
./external-engines/conferir.sh
```

Sete passos (`typecheck`, `lint` e `test` em `esteira` e em `testfit`, mais a **prova no
navegador**) e, antes deles, **cobertura** (`package.json` fora da lista reprova) e **precondição**
(sem o `.wasm` ele **reprova com a receita**, nunca "pula"). Ele **roda todos os passos mesmo
depois de um falhar**, **nada fica fora dele**, e que ele **reprova** está provado por sabotagem
(D126). *Suíte que ninguém roda não protege nada — e ainda cala os alarmes que ela tinha.*

**O CI** (`.github/workflows/verde.yml`) tem **dois trabalhos e nomes que não enganam**: o das
**698 travas que leem arquivo do próprio repositório**, sem segredo, e **o verde completo**, que
precisa do segredo `VIZINHOS_TOKEN` para os dois clones privados — e sem ele **falha com a
receita**, não pula. *Um CI vermelho por falta de configuração é honesto; um CI verde que não roda o
verde é a mentira que o D110 custou duas semanas.*

### 🔴 A EXECUÇÃO AUTOMÁTICA DO CI ESTÁ DESLIGADA desde 08/10/2026

O orçamento de Actions da família estourou; a cota zera em **1º/11/2026**. O gatilho de
`push`/`pull_request` está **comentado** e a rotina, **`disabled_manually`**. **A receita de
religar mora num lugar só:** [`docs/COMO_RELIGAR_O_CI.md`](docs/COMO_RELIGAR_O_CI.md) — **são DOIS
passos**, descomentar **e** reabilitar.

**Toda entrega declara "conferido aqui, não no GitHub"** (*verde na mão e verde na nuvem são
afirmações diferentes*), e **quem roda o verde completo sou eu, antes do commit**. A trava
`gatilho-do-verde` **reprova a partir de 1º/11/2026**: *desligamento sem prazo vira desligamento
permanente.*

### UM ENVIO POR ENTREGA

**Commitar quantas vezes quiser é de graça; `git push` é que custa.** Os commits de uma entrega —
código, prova, relatório, decisão, recado — saem em **um envio só**, no fim. *A maior alavanca não
é o desenho da rotina, é o número de envios.*

*(história: §H11)*
