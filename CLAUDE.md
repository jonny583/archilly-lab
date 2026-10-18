# CLAUDE.md — Archilly Lab

Regras permanentes deste repositório. **Leia antes de qualquer tarefa e obedeça
em todas as sessões.** Ao acordar: `docs/ONDE_PARAMOS.md` → `git log` → `docs/prompts/FILA.md` →
`docs/PENDENCIAS_JONNY.md`.

> **A HISTÓRIA de cada regra mora em [`docs/HISTORIA_DAS_REGRAS.md`](docs/HISTORIA_DAS_REGRAS.md)**;
> aqui fica só o que se usa hoje, com o ponteiro `§H`. *Nenhuma regra saiu; saiu o relato* (item 028).

---

## 1 · A regra do RECADO — UM BLOCO SÓ por rodada

**Toda resposta ao chat é UM único bloco de código, e nada fora dele** — nem texto acima, nem
despedida, nem segundo bloco.

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

- **O recado vem PRIMEIRO**; o resto vai **no mesmo bloco**, abaixo da linha de marca.
- **O teto de doze linhas é do RECADO, não do bloco:** **partir o bloco** para caber é o defeito.
  Doze linhas é teto DO RECADO, não meta.
- **`<app>` é `MOTOR LAB (archilly-lab)`**, nunca `Lab`; **`<prompt>`** é o prompt (`LAB-07`) ou uma classe:
  `despertador-sem-item`, `fila-esgotada`, `fila-recusada`, `decisao-registrada`,
  `recado-recuperado`, `fora-de-fila`.
- **Linha sem conteúdo leva `—`, nunca some.**
- **Mais de um prompt sem ele voltar:** o bloco abre com `ACUMULADO — inclui os recados X, Y`.
- **O recado vai também, inteiro e com data, a [`docs/relatorios/RECADOS.md`](docs/relatorios/RECADOS.md).**

*(história: §H1)*

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

É comportamento de sessão e **NÃO espera o kit**; o kit, quando chegar, é outro item.

**O Padrão Archilly não mora aqui:** a procedência (onde, commit, blob, quando) mora só em
`external-engines/esteira/src/onde-esta-o-padrao.ts`. *Documento normativo que esta casa não
mantém não deve morar nela.*

> **REGRA DE FORMA SEM O SUJEITO ESCRITO MANDA NA COISA ERRADA**
> (`external-engines/esteira/tests/limites-com-sujeito.test.ts`).

*(história: §H2)*

---

## 1-B · O BALANÇO vai para um arquivo

**Balanço é resposta que faz as contas** (de uma fila, de dívidas, do repositório). Vai a
[`docs/relatorios/BALANCOS.md`](docs/relatorios/BALANCOS.md) com data, origem, conteúdo e prova.
**Balanço que já mora num recado não se copia:** aponta-se para ele, com guarda comparando o balanço
com o recado (D384). **Reconstrução sai etiquetada
como reconstrução**, com a fonte de cada linha, e se confere, não se obedece.

> **O que vai ao chat e não vai a um arquivo não existe amanhã.** *(história: §H3)*

---

## 1-A · A fila é autônoma

`docs/prompts/FILA.md` é a fila; a ida vem da caixa de entrada, escrita pelo chat. A casa executa
sozinha, acordada por um despertador cujo id vive no `ONDE_PARAMOS.md`. Regra de família: **um
despertador por aplicativo; nunca se toca no de outro repositório.**

- **Um prompt por despertador**; o anterior aberto se termina primeiro.
- **Prompt fora da fila não existe:** o que faltar vai como *"proposto ao chat"*. **Não ampliar
  escopo.** O que espera o Jonny ou outro repositório fica *"aguardando"*.
- **Disparo sem item pronto: ANOTE A DATA, responda em UMA linha e DURMA — NÃO DESLIGUE** (D244).
  A data vai à conta dos disparos em vazio; ligar e desligar é do chat.
- A regra mora aqui e na [`docs/caixa-de-entrada/COMO_FUNCIONA.md`](docs/caixa-de-entrada/COMO_FUNCIONA.md),
  que se apontam.
- **Sem `mcp__github__*`**, mesclar com `git merge --no-ff` na `main` e declarar (D29).

**~~DESLIGAR o despertador~~ valia até 09/10/2026:** o desligamento era o aviso de fila esgotada, e
deixou de servir quando o chat passou a escrever direto na caixa.

> **REGRA QUE DEIXOU DE PROTEGER E PASSOU A TRAVAR NÃO MUDOU DE TEXTO — MUDOU O MUNDO EMBAIXO
> DELA.** *(história: §H4)*

---

## 2 · O que é este repositório

Laboratório de motores de loteamento para o **Archilly Generate**: motores externos o alimentam
atrás de um adaptador isolado, **sempre pelo Validator e pelo Judge dele**.

**Onde mora cada coisa:** `docs/INDEX.md` índice · `docs/ONDE_PARAMOS.md` estado ·
`docs/HISTORIA_DAS_REGRAS.md` história · `docs/prompts/FILA.md` roteiro · `docs/caixa-de-entrada/`
ida · `docs/PENDENCIAS_JONNY.md` o que é dele · `docs/DECISOES.md` decisões ·
`docs/referencia/LABORATORIO.md` especificação · `docs/relatorios/` medições, `RECADOS.md` e
`BALANCOS.md` · `docs/provas/` números em JSON.

Família: **Geo** (`urban-scout-tool`) capta · **Generate** (`urban-create-hub-41d93a4d`) gera,
valida e julga · **Laboratório de Parcelamento** (`motor-testfit`) gera na tela · **este Lab**
testa motores. *(história: §H5)*

---

## 3 · A regra de ouro

`upstream/` → `archilly/` → `adapter/` → Generate.

1. **`upstream/` é intocável:** cópia exata, commit e data em `VERSION`; sem patch.
2. **O trabalho acontece em `archilly/`**, documentado.
3. **`adapter/` é a única fronteira.**
4. **O Generate nunca depende disto:** `external-engines/` pode ser apagado.

Motor da própria família **não ganha `upstream/`** (D16): lê-se do clone irmão pelos `paths` do
`tsconfig.json`. *(história: §H6)*

---

## 4 · O que este repositório NUNCA faz

- **Não escreve em repositório vizinho:** clones só leitura, `git status` limpo ao fim; o que o
  vizinho precisa **vira lista numerada em relatório**.
- **Não tem interface — com UMA exceção, declarada:** a bancada do navegador
  (`external-engines/symbios/adapter/ferramentas/navegador/index.html`), com guarda contando página, componente e servidor em tudo o que o `git` carrega (D381).
- **Não reimplementa o Validator nem o Judge** (D20), com guarda seguindo a cadeia de chamadas até o
  Generate em tudo o que o `git` carrega (D382).
- **Não conserta geometria em silêncio:** conserto declarado, desligado por padrão, medido nas duas
  passagens.
- **Não inventa dado:** o não medido sai `null`, nunca zero (D23).
- **Não descarta em silêncio campo que o motor publica:** destino em
  `external-engines/esteira/src/inventario-das-pontes.ts`, conferido contra o motor rodando.
  **O motivo de uma perda não mora em comentário** (D98, D104).
- **Não carrega segredo na árvore** (`external-engines/esteira/src/varredura-de-segredos.ts`).
  **Registro nenhum repete mais de doze** caracteres de um segredo.
- **Não decide urbanismo:** vai a `docs/PENDENCIAS_JONNY.md`.
- **Não contrata nada, e entre USO e MENSALIDADE escolhe USO** (D239, §4-A).

*(história: §H7)*

---

## 4-A · Da família — cobrança por USO, nunca mensalidade

**Ordem do Jonny, 09/10/2026 (D239), para todas as APIs — *"absolutamente todas"*:**

> **Entre uma API que cobra por USO e uma que cobra MENSALIDADE, escolhe-se a de uso — mesmo que o
> uso saia mais caro.**

> *"Eu prefiro uma API que cobra por uso, mesmo que seja mais caro o uso, do que uma API que seja
> mensalidade. Isso vale para todas as APIs Archilly, todas, absolutamente todas, em todas as
> sessões. Melhor um custo mais alto, que quem vai pagar é o usuário e que a gente vai cobrar vezes
> 3, do que ter um custo mensal alto — porque daí fica me pressionando para arranjar cliente."*

O motivo é de **ritmo**: mensalidade contratada é meta de vendas contratada junto. As oito
consequências (`external-engines/esteira/src/cobranca-por-uso.ts`):

1. **a ordenação é pelo custo na MENOR faixa de uso**: três linhas, com **3**, **20** e **200** clientes;
2. volume desejado é **a forma mais educada de aprovar uma despesa que não se sustenta** (*"R$ 2 por
   estudo"* com três clientes é **R$ 133**);
3. repasse pela porta de créditos da Central, **declarando operação e nunca preço**;
4. **franquia mínima é mensalidade com outro nome**;
5. teste grátis que vira cobrança é **mensalidade que começa depois**;
6. **cota gratuita de verdade não é mensalidade**, se nunca passar da faixa livre;
7. fonte paga **ligada e desligada por recorte**, sem código;
8. **nenhuma sessão contrata nada.**

A trava é **de palavra, não de estrutura**: a régua pega 4 dos 12 compromissos de
`external-engines/esteira/src/trava-de-estrutura.ts` — **8 dos 12 escapam**. A resposta é
**"não há onde"**: *campo que não existe não se esquece*. E **não há nada pago neste repositório hoje**, então a guarda só alcança
texto: contratar acontece fora da árvore. *Guarda que não declara o próprio buraco mente pelo
silêncio.* *(história: §H8)*

---

## 5 · Nomes

**"Testfit" é nome interno**; para o usuário é **Laboratório de Parcelamento**, com guarda lendo onde
a página do Jonny o manda e a bancada (D383).
`docs/PENDENCIAS_JONNY.md` é escrito **para leigo**; item resolvido é **marcado, nunca apagado**, e
dívida técnica não entra lá. *(história: §H9)*

---

## 6 · Medir antes de atribuir

> **Resultado suspeito se mede antes de ter culpado** — e resultado desconfortável é resultado.

**Trinta e três de trinta e três vezes** o Lab esteve a um passo de acusar um vizinho, e o
defeito era do Lab — a tabela e a aritmética, travadas, moram na história. **Antes de atribuir:**

- confira o CAMINHO e a FORMA do que você lê (D18, D119); número que mudou: ele existe? (D133);
- régua que casa por nome exato mede ortografia (D137); em código, o nome no `import` e sem
  comentários (D142, D155, D257);
- rótulo não é identidade: meça a distância (D148, D161); confira quem escreveu o limite (D98, D166);
- número impresso ao lado se conta, não se lembra (D185); frase de `.md` pelo normalizador de
  `external-engines/esteira/src/texto-das-regras.ts` (D248, D304);
- booleano responde ONDE; só o quanto responde DE QUEM (D254);
- régua nova nasce com a doença que a velha já curou, um campo ao lado (D263); a prova de uma
  régua não repete o que a régua proíbe (D262);
- em clone raso o `git log` responde o CORTE, o blob identifica o texto (D293, D294, D315);
- leitura de fonte é hipótese; rodada é dado (D308); prefixo diz onde o arquivo mora, não o que
  ALCANÇA (D310);
- número em vários lugares se cobra contra a MEDIÇÃO — *consistência não é correção* (D311); régua
  do vizinho: leia o critério inteiro (D314); instrumento estreito dá o número otimista (D266);
- meça o SALDO antes do conserto: errar o rótulo e acertar o veredicto não é errar (D184).

*(história: §H10)*

---

## 7 · Entrega

**Todo prompt fecha com** relatório em `docs/relatorios/`, provas em `docs/provas/`, decisões em
`docs/DECISOES.md`, `FILA.md`, `ONDE_PARAMOS.md` e `INDEX.md` em dia, testes verdes e **PR
mesclado na `main`**. Ao chat volta o RECADO.

**Medição é em metros e em dados:** JSON em `docs/provas/<prompt>/` com gleba, motor, semente e
contrato, e determinismo provado; o que não mede gleba entra numa **lista declarada de exceções**,
conferida nos dois sentidos.

**Duas pilhas convivem** (D14, D17): Symbios em Node 22+ sem npm; LAB-07 em Bun.

**"Verde" é UM comando:**

```sh
./external-engines/conferir.sh
```

Ele roda cobertura, precondição (sem o `.wasm`
reprova com a receita), oito passos, todos mesmo depois de uma falha, e **nada fica fora dele**
(D126).

**O CI** (`verde.yml`) tem dois trabalhos: o das
**1955 travas que leem arquivo do próprio repositório**, sem segredo, e o verde completo, que
exige `VIZINHOS_TOKEN` e sem ele **falha com a receita**.

### 🔴 O CI AUTOMÁTICO ESTÁ DESLIGADO desde 08/10/2026

Cota zera em **1º/11/2026**; gatilho comentado e rotina `disabled_manually`. Religar são **DOIS**
passos, só em [`docs/COMO_RELIGAR_O_CI.md`](docs/COMO_RELIGAR_O_CI.md). **Toda entrega declara
"conferido aqui, não no GitHub"**, e quem roda o verde completo é a sessão, antes do commit; a trava `gatilho-do-verde` reprova a partir de 1º/11/2026.

### UM ENVIO POR ENTREGA

Commit é de graça; `git push` custa. Código, prova, relatório, decisão e recado saem em **um envio
só**, no fim. **O envio à `main` passa pelo gancho `external-engines/ganchos/pre-push`**, que o
`conferir.sh` liga: recusa árvore suja ou commit que não é o `HEAD`, e roda o trabalho sem clones
sobre o que vai (D333). *(história: §H11)*
