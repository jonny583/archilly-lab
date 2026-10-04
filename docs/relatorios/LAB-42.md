# LAB-42 · O balanço ganhou arquivo — e a fila de 04/10 fechou

**04/10/2026 · [`BALANCOS.md`](BALANCOS.md) ·
`external-engines/esteira/tests/balancos.test.ts`**

O chat mandou: *"crie `docs/relatorios/BALANCOS.md` e registre ali os balanços, inclusive
os que foram só para o chat, para nenhuma lista precisar ser re-derivada de novo."*

**O pedido fecha um prejuízo que foi medido, não suposto.** Em 03/10 o chat pediu um
balanço **fora da fila**; a resposta foi para o chat e **não para um arquivo**. No dia
seguinte ele mandou executar um item dela, e o primeiro achado do LAB-36 foi sobre o
próprio pedido: **a lista não existia em lugar nenhum.** Custou uma varredura inteira do
`CLAUDE.md` para recuperar cinco linhas — e ao recuperá-las elas eram **cinco, não quatro,
e duas estavam falsas** (D136, D137).

---

## 1 · O que o arquivo tem, e por que em duas partes

| parte | o que entra | por quê |
|---|---|---|
| **§1** | os balanços que foram **só para o chat**, transcritos ou **reconstruídos** | não têm outro lugar onde morar — é o prejuízo que criou o arquivo |
| **§2** | um **índice** dos balanços que já moram num recado | copiá-los criaria a segunda montagem que o D116 proíbe |
| **§3** | o saldo da fila **LAB-38 a LAB-42** | o primeiro balanço que nasce **dentro** do arquivo |

**Duas disciplinas que o arquivo carrega por escrito:**

1. **Reconstrução sai etiquetada como reconstrução**, com a fonte de cada linha.
   Reconstrução sem etiqueta é invenção com cara de registro. O balanço de 03/10 está lá
   **reconstruído a partir da fila que o chat escreveu dele**, linha por linha;
2. **balanço recuperado se confere, não se obedece** — e a prova disso é o próprio balanço
   de 03/10, que dizia *"quatro regras sem teste"* quando eram **cinco, e duas eram
   slogan**. O arquivo registra **o que o balanço errou**, e não só o que ele disse.

---

## 2 · A regra, porque arquivo que ninguém é obrigado a alimentar apodrece

O chat ordenou **o arquivo**; o que o mantém vivo é a **§1-B** nova do `CLAUDE.md`, ao
lado da regra do RECADO — ela diz onde o balanço vai, com que campos, que recado não se
copia e que reconstrução se etiqueta. **Se o chat preferir sem a regra, é uma seção a
remover**: o arquivo continua de pé, e volta a depender de eu lembrar — que é exatamente a
forma do D104.

**E a regra tem guarda, porque regra que ninguém pode desmentir é slogan** (a lição que o
LAB-36 pagou com duas regras falsas). São **seis travas** em `balancos.test.ts` mais
**uma** no `regras.test.ts`:

| trava | o que ela impede |
|---|---|
| o arquivo existe e traz **a razão** de existir | virar lista sem memória de por que a lista existe |
| toda entrada do §1 tem **data, origem, o que produziu e onde está o original** | entrada que não diz se foi reconstruída |
| o balanço de 03/10 **se declara reconstrução**, cita a fonte e diz o que **errou** | reconstrução valendo como transcrição |
| toda seção citada no §2 **existe** no `RECADOS.md`, com o título igual | referência morta: "está registrado" sem estar |
| todo arquivo citado existe | a exceção fantasma que a guarda do §7 já reprova (LAB-36) |
| o índice está em **ordem cronológica** | *"me dá tudo desde o dia tal"* virar reconstrução |
| a **§1-B** existe e o arquivo que ela manda alimentar existe | a regra virar afirmação sem nada que reprove |

**Provado por sabotagem, não por confiança:** renomeado um título citado no índice, a
suíte vai de **6 verdes a 1 vermelha** com a mensagem *"o índice cita seção que não existe
no RECADOS.md"*; desfeito, volta ao verde.

---

## 3 · O achado do caminho: um número copiado em quatro arquivos (D153)

Pôr `balancos.test.ts` na lista do trabalho do CI fez o número de travas protegidas sair
de **64** para **76** — e esse número estava **colado à mão em quatro arquivos**:
`CLAUDE.md`, `ONDE_PARAMOS.md`, `FILA.md` e o comentário do próprio YAML.

> **Número com quatro casas envelhece em três delas.** É a forma do D116 numa grandeza de
> prosa.

Os quatro foram atualizados e **ganharam trava de concordância**. O que ela **não** faz vai
dito no próprio teste: ela não confere se o número é o **verdadeiro** — para isso teria de
rodar a suíte, e contar `test(` com regex mediria texto. **O valor é meu para atualizar; a
divergência é dela para acusar** — e divergência foi o que de fato aconteceu.

**E a primeira versão dessa trava reprovou por defeito dela mesma:** eu casei por
`"NN travas que leem arquivo"`, e a `FILA.md` dizia só *"protege NN travas"* — **régua
medindo uma das frases em vez do número**, a forma do D137. O conserto foi declarar a
frase canônica e exigi-la nos quatro. Régua que casa por frase tem de **dizer qual frase**.

**Os números históricos não foram mexidos:** o relatório do LAB-38, os recados e a prova
do LAB-38 seguem dizendo **64**, porque era verdade quando foram escritos. Reescrever
recado antigo falsifica o registro — é a mesma razão por que o teto de 12 linhas só olha o
**último** recado.

---

## 4 · O saldo da fila, que é o §3 do arquivo novo

| prompt | o que ficou |
|---|---|
| **LAB-38** | o **CI**, com dois trabalhos e nomes que não enganam — e achou um defeito meu no primeiro disparo |
| **LAB-39** | a trava que comparava **duas provas entre si** passou a **medir** |
| **LAB-40** | promessas sem exercício de **6 para 0**, e a testada de frente medida **fora de Antonina** |
| **LAB-41** | a ausência da ortogonal tinha causa: **via fora da gleba** |
| **LAB-42** | este arquivo, a regra e as travas |

**Cinco prompts, cinco PRs mesclados.** A suíte foi de **372 para 393 travas**. O ponto
cego da §6 apareceu **duas** vezes, as duas **dentro do prompt** (D142, D148), e uma
terceira de **método**, nova na série (D151). **Três achados para o Generate**, todos em
lista numerada e **nenhum commit no vizinho**.

---

## 5 · Entrega

| o quê | onde |
|---|---|
| o arquivo | [`BALANCOS.md`](BALANCOS.md) |
| as travas | `esteira/tests/balancos.test.ts` (6) · `esteira/tests/regras.test.ts` (+2) |
| a regra | `CLAUDE.md` **§1-B** |
| a lista do CI, com o arquivo novo | `.github/workflows/verde.yml` |
| decisões | **D152**, **D153** |

**Verde:** `./external-engines/conferir.sh` — 7 passos, **393 travas** (eram 385), exit 0.

**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três.

**Esta é a última entrega da fila de 04/10.** Com o LAB-42 mesclado, a fila **esgota**: o
recado acumulado está no `RECADOS.md`, o motivo está no `ONDE_PARAMOS.md`, e o despertador
é **desligado, não apagado** — o chat ratificou essa escolha três vezes (D112) e mandou
reabilitar em vez de recriar.

**Não houve prova em `docs/provas/LAB-42/`, e isso vai declarado:** este prompt não mede
gleba nenhuma — ele cria um arquivo de prosa e as travas dele. A prova de que as travas
apertam é a **sabotagem do §2**, e ela é remensurável a qualquer hora rodando
`bun test tests/balancos.test.ts` depois de renomear um título citado. Inventar um JSON
para cumprir formalidade seria o oposto do que a §7 pede.
